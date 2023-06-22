# @mogland-dev/vite-plugin-mog-themes-dev

A Vite Plugin for developing mog themes

<pre align="center">
🧪 Working in Progress
</pre>

## Features

- [x] **File listening and reload (full reload).** When the theme file changes, the page will be reloaded automatically.
- [x] **Multi-theme support.** You can develop multiple themes at the same time.
- [ ] **Simulation data.** You can configure the simulation data in the `mock` folder.
- [x] **Friendly error page.** When an error occurs, the error page will be displayed. No JSON display.
- [ ] **GUI configuration.** You can configure the theme like in the console, or modify the mock data.
- [x] **Theme extension support.** You can develop themes based on custom extensions.
- [ ] **Full development support.** You can experience the good development of the theme without the need for a mog server.
- [ ] **Full reload -> Hot reload.** When the theme file changes, only the changed part will be reloaded. It will be implemented in the future.
- [ ] **Create To Publish CLI.** You can create a theme and publish it to the Mog Community with one cli.
- [ ] **Connect to the Mog Server.** You can connect to the Mog Server to develop themes to experience the production environment.
- [ ] ...

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

## Simulation Data [WIP]

> The content of this section has not yet been determined, and the content may change at any time. Please do not use it in a production environment.

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
