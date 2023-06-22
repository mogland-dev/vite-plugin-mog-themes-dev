# @mogland-dev/vite-plugin-mog-themes-dev

A Vite Plugin for developing mog themes

## Usage

- Themes Storage: `./themes`
- Server config: `./vite.config.js`
- Data simulation: `./mock`

```js
const createMogThemeDevServerPlugin = require('./plugin.js');

module.exports = {
  plugins: [
    createMogThemeDevServerPlugin({
      themeId: "theme.test-theme.wibus"
    })
  ],
};
```

1. According to the directions on the https://mog.js.org/development/theme store in the theme folder to create a theme.
2. The theme id that needs to be applied in vite.config.js. (If not, the access path needs to be changed to `{THEME_ID}/{PAGE}`)
3. Configure the data simulation you need.
4. Run `npm run dev` to start the development server.

## Simulation Data

The simulation data is stored in the `mock` folder, it's universal for all themes. It's a toml file, the key is the page, and the value is the data.

```toml
[global]
title = "Home"
description = "This is a home page"

[post]
title = "Post"
summary = "This is a post page"
text = "This is a post page, you can edit the mock.toml file to change the content."
```

## Theme

The theme is stored in the `themes` folder, it's a folder, the folder name is the theme id, and the folder contains the theme files.

```bash
themes
└── theme.test-theme.wibus
    ├── post.ejs
    ├── index.ejs
    └── ... # other files
```

## Author

@mogland-dev/vite-plugin-mog-themes-dev © Wibus, Released under MIT. Created on Jun 22, 2023

> [Personal Website](http://iucky.cn/) · [Blog](https://blog.iucky.cn/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)
