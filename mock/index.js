/* You shouldn't need to edit this file. It's used by the plugin to load mock files. */
const jiti = require("jiti")();
const { resolve } = require('path');
const generator = jiti(resolve(process.cwd(), './mock/generator.ts'));
module.exports = {
  ...generator,
}
