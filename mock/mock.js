const jiti = require("jiti")();
const { resolve } = require('path');

// 读取 @types/index.ts，拿到 module.exports
const mock = jiti(resolve(process.cwd(), './@types/index.ts'));
module.exports = mock;