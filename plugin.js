const { readFile } = require('fs/promises');
const ejs = require('ejs');
const { resolve } = require('path');
const colors = require('picocolors');

function createMogThemeDevServerPlugin() {
  return {
    name: 'mog-theme-dev-server',
    handleHotUpdate({ file, server }) {
      if (file.includes('theme')) {
        // 通知 Vite 根据修改的 EJS 文件重新部分刷新
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
        // theme.xxx/index.ejs
        const _file = file.split('/').slice(-2);
        const theme = _file[0];
        const filename = _file[1];
        // 8:06:30 AM - [mog-theme-dev-server] index.ejs was updated. Reloading...
        const time = new Date().toLocaleTimeString();
        console.log(`${colors.dim(time)} ${colors.bold(colors.blue(`[mog-theme-dev-server]`))} ${colors.green(`page reload`)} ${colors.dim(`${filename} - ${theme}`)}`);
      }
    },
    configureServer(server) {
      
    },
  };
}

module.exports = createMogThemeDevServerPlugin;
