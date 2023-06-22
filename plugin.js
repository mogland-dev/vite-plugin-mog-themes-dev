const { readFile } = require('fs/promises');
const ejs = require('ejs');
const { resolve } = require('path');
const colors = require('picocolors');

function createMogThemeDevServerPlugin(config) {
  return {
    name: 'mog-theme-dev-server',
    handleHotUpdate({ file, server }) {
      if (file.includes('theme')) {
        // 通知 Vite 根据修改的 EJS 文件重新部分刷新
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
        if (req.url.includes('vite')) {
          next();
          return;
        }
        const nowTheme = config?.themeId ? config.themeId : req.url.split('/')[1];
        const filename = req.url.split('/').slice(-1)[0];
        try {
          const themeFile = await readFile(resolve(process.cwd(), `./themes/${nowTheme}/${filename}.ejs`), 'utf-8');

          // 模拟数据
          const mockData = {
            title: 'My Theme',
            // ...
          };

          // 渲染 EJS 主题文件
          const renderedTheme = ejs.render(themeFile, mockData);
          // 在头部加入 @vite/client，以便在浏览器中进行热更新
          const injected = renderedTheme.replace(
            '</head>',
            '<script type="module" src="/@vite/client"></script></head>'
          );

          // 设置响应头和内容
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
