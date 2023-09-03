const { readFile } = require('fs/promises');
const ejs = require('ejs');
const { resolve } = require('path');
const colors = require('picocolors');
const mime = require('mime');
const { readdirSync, readFileSync } = require('fs');
const md5 = require('md5');

function logger(type, message) {
  const time = new Date().toLocaleTimeString();
  console.log(`${colors.dim(time)} ${colors.bold(colors.blue(`[mog-theme-dev-server]`))} ${colors.green(type)} ${colors.dim(message)}`);
}

const FORBIDDEN_FILES = [
  ".DS_Store",
  "node_modules",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  ".git",
  ".idea",
  ".vscode",
  ".env",
  "README.md",
];

const DIRECT_FILES = [
  "favicon.ico",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "woff",
  "woff2",
  "ttf",
  "eot",
  "mp4",
  "webm",
  "ogg",
  "mp3",
  "wav",
  "flac",
  "aac",
]

function generateErrorPage(error) {
  // prevent code execution
  error.message = error.message.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  error.stack = error.stack.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <script type="module" src="/@vite/client"></script>
      <title>Error</title>
      <style>
        :root {
          --text-color: #333;
          --bg-color: #fff;
          --pre-bg-color: #f5f5f5;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --text-color: #fff;
            --bg-color: #333;
            --pre-bg-color: #1e1e1e;
          }
        }
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-color);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: var(--bg-color);
          text-align: center;
        }
        h2 {
          font-size: 2rem;
          margin: 10px;
        }
        pre {
          text-align: left;
          margin: 20px;
          padding: 20px;
          background: var(--pre-bg-color);
          border-radius: 4px;
          overflow-x: auto;
          max-width: calc(100vw - 100px);
        }
      </style>
    </head>
    <body>
      <div>
        <h2>Mog Theme Dev Server - Failed to load theme</h2>
        <pre>${error.stack}</pre>
      </div>
    </body>
  </html>
  `;
}

function generateMockData(req) {
  const generator = require(resolve(process.cwd(), './mock/index.js'));
  const mock = generator.generateMockData(req);
  const mockData = {
    url: {},
    path: "",
  };
  for (const key of Object.keys(mock)) {
    mockData[key] = mock[key];
  }
  if (req.url === '/') {
    mockData.page = { docs: mockData.site.posts, ...mockData.page };
  }
  return mockData;
}


function extensionToFunction(req, theme, extension) {
  const extensionPath = resolve(process.cwd(), `./themes/${theme}/plugins/${extension}`);
  const _extensionFunction = require(extensionPath);
  const mock = generateMockData(req);
  const extensionFunction = Function(
    `
    ${Object.keys(mock)
      .map(key => `const ${key} = ${JSON.stringify(mock[key])};`)
      .join('\n')
    }
    return ${_extensionFunction[_extensionFunction.name].toString().replace(/(\r\n|\n|\r)/gm, '')}
    `
  )();
  return extensionFunction;
}

function generateInjectExtensions(req, theme) {
  const extensions = readdirSync(resolve(process.cwd(), `./themes/${theme}/plugins`), { withFileTypes: true })
    .filter(dirent => !dirent.isDirectory()) // exclude directories
  const _extensionsList = [];
  for (const extension of extensions) {
    if (extension.name.endsWith('.js')) {
      _extensionsList.push(extension.name.split('.')[0]);
      logger('load extension', extension.name);
    }
  }
  let extensionsList = [];
  for (const extension of _extensionsList) {
    extensionsList.push({
      name: extension,
      function: extensionToFunction(req, theme, extension),
    });
  }
  return extensionsList;
}


function createMogThemeDevServerPlugin(config) {
  return {
    name: 'mog-theme-dev-server',
    handleHotUpdate({ file, server }) {
      for (const forbiddenFile of FORBIDDEN_FILES) {
        if (file.includes(forbiddenFile)) {
          return;
        }
      }
      // parse path, only files under themes directory will trigger hot update
      // not use includes themes, because there may be other directories called xx-themes-xx
      if (file.split('/').includes('themes') || file.split('/').includes('mock')) {
        // check config, if config.themeId exists, only files under this themeId will trigger hot update
        if (config?.themeId) {
          if (!file.includes(config.themeId) && !file.includes('mock')) {
            return;
          }
        }
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
        if (config?.dev) {
          server.ws.send({
            type: 'custom',
            event: 'file-changed',
          })
        }
        const _file = file.split('/').slice(-2);
        const theme = _file[0];
        const filename = _file[1];
        const time = new Date().toLocaleTimeString();
        console.log(`${colors.dim(time)} ${colors.bold(colors.blue(`[mog-theme-dev-server]`))} ${colors.green(`page reload`)} ${colors.dim(`${filename} - ${theme}`)}`);
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        req.query = Object.fromEntries(url.searchParams) || {};
        req.params = req.url.split('/').slice(2);
        const pathSegments = req.url.split('/');
        const _filename = pathSegments[1] || "index";
        const nowTheme = config?.themeId || pathSegments[1];
        const validFilenames = ["index", "category", "tag", "archive", "friends", "posts", "page"];
        const isCategoryOrTag = ["category", "tag"].includes(_filename);
        const hasParams = req.params?.length > 0;

        let filename = validFilenames.includes(_filename) ? _filename : "page";

        if (!validFilenames.includes(_filename) && (isCategoryOrTag && hasParams)) {
          filename = "archive";
        } else if (_filename === "posts") {
          if (hasParams) {
            filename = "post";
          } else {
            filename = "archive";
          }
        }

        if (req.url.includes('@private/vite-ws')) { // to support custom event
          const file = await readFile(resolve(__dirname, './vite-ws.js'));
          res.setHeader('Content-Type', 'application/javascript');
          res.end(file);
          return;
        }
        // If you want to use static assets in your theme, 
        // you can put the static assets in the assets folder and then request /raw/assets/* in the theme template to get the static assets.
        if (req.url.includes('raw')) {
          // 检索是否有对应的文件
          const filename = req.url.split('/').slice(-1)[0];
          try {
            const file = await readFile(resolve(process.cwd(), `./themes/${nowTheme}/${req.url.split('/').slice(-2).join('/')}`));
            res.setHeader('Content-Type', mime.getType(filename) || 'text/plain');
            res.end(file);
          } catch (error) {
            res.statusCode = 404;
            res.end(generateErrorPage(error));
          }
          return;
        }
        if (req.url.includes('vite')) { // to support vite client
          next();
          return;
        }
        for (const forbiddenFile of FORBIDDEN_FILES) {
          if (req.url.includes(forbiddenFile)) {
            res.statusCode = 403;
            res.end(generateErrorPage(`Forbidden file: ${forbiddenFile}`));
            return;
          }
        }
        for (const directFile of DIRECT_FILES) {
          if (req.url.includes(directFile)) {
            next();
            return;
          }
        }
        try {
          const themeFile = await readFile(resolve(process.cwd(), `./themes/${nowTheme}/${filename || "index"}.ejs`), 'utf-8');

          const mockData = generateMockData(req);

          const ejsData = {
            ...mockData,
          }

          const extensions = generateInjectExtensions(req, nowTheme);
          for (const key of extensions) {
            ejsData[key.name] = key.function;
          }
          ejsData["_i"] = Function(
            `
            return function (key) {
              return key;
            }
            `
          )();
          ejsData['private'] = {}
          ejsData['private']['plugins'] = extensions;
          // console.log(extensions);

          const renderedTheme = ejs.render(themeFile, ejsData, {
            root: resolve(process.cwd(), `./themes/${nowTheme}`),
          });
          // add @vite/client, to support page update
          const injected = renderedTheme.replace(
            '</head>',
            `<script type="module" src="/@vite/client"></script>
            ${config?.dev ? `<script type="module" src="/@private/vite-ws" data-mog-private-hash="${md5(new Date().getTime().toString())}"></script>` : ''}
            </head>`
          );
          res.setHeader('Content-Type', 'text/html');
          res.end(injected);
        } catch (error) {
          const time = new Date().toLocaleTimeString();
          console.error(`${colors.dim(time)} ${colors.bold(colors.blue(`[mog-theme-dev-server]`))} ${colors.red(`Failed to load theme: ${error.stack}`)}`);
          res.statusCode = 500;
          res.end(generateErrorPage(error));
        }
      });
    },
  };
}

module.exports = createMogThemeDevServerPlugin;
