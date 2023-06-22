const { readFile } = require('fs/promises');
const ejs = require('ejs');
const { resolve } = require('path');
const colors = require('picocolors');
const mime = require('mime');

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
      if (file.split('/').includes('themes')) {
        // check config, if config.themeId exists, only files under this themeId will trigger hot update
        if (config?.themeId) {
          if (!file.includes(config.themeId)) {
            return;
          }
        }
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
        const _file = file.split('/').slice(-2);
        const theme = _file[0];
        const filename = _file[1];
        const time = new Date().toLocaleTimeString();
        console.log(`${colors.dim(time)} ${colors.bold(colors.blue(`[mog-theme-dev-server]`))} ${colors.green(`page reload`)} ${colors.dim(`${filename} - ${theme}`)}`);
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const nowTheme = config?.themeId ? config.themeId : req.url.split('/')[1];
        const filename = req.url.split('/').slice(-1)[0];

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
            res.end(JSON.stringify({
              message: "Not Found",
              error: "Not Found",
            }));
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
            res.end(JSON.stringify({
              message: "Forbidden",
              error: "Forbidden",
            }));
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
          const themeFile = await readFile(resolve(process.cwd(), `./themes/${nowTheme}/${filename}.ejs`), 'utf-8');

          const mockData = {
            title: 'My Theme',
            // ...
          };

          const renderedTheme = ejs.render(themeFile, mockData, {
            debug: true,
            compileDebug: true,
            root: resolve(process.cwd(), `./themes/${nowTheme}`),
          });
          // add @vite/client, to support page update
          const injected = renderedTheme.replace(
            '</head>',
            '<script type="module" src="/@vite/client"></script></head>'
          );
          res.setHeader('Content-Type', 'text/html');
          res.end(injected);
        } catch (error) {
          const time = new Date().toLocaleTimeString();
          console.error(`${colors.dim(time)} ${colors.bold(colors.blue(`[mog-theme-dev-server]`))} ${colors.red(`Failed to load theme: ${error.message}`)}`);
          res.statusCode = 500;
          res.end(JSON.stringify({
            message: "Internal Server Error",
            error: error.message,
          }));
        }
      });
    },
  };
}

module.exports = createMogThemeDevServerPlugin;
