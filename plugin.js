const { readFile } = require('fs/promises');
const ejs = require('ejs');
const { resolve } = require('path');
const colors = require('picocolors');

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
        const nowTheme = config?.themeId ? config.themeId : req.url.split('/')[1];
        const filename = req.url.split('/').slice(-1)[0];
        try {
          const themeFile = await readFile(resolve(process.cwd(), `./themes/${nowTheme}/${filename}.ejs`), 'utf-8');

          const mockData = {
            title: 'My Theme',
            // ...
          };

          const renderedTheme = ejs.render(themeFile, mockData);
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
