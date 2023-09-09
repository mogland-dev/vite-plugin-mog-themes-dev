const createMogThemeDevServerPlugin = require('./plugin.js');

module.exports = {
  plugins: [
    createMogThemeDevServerPlugin({
      themeId: 'theme.tiny.wibus-wee.ejs',
      dev: true
    })
  ],
};
