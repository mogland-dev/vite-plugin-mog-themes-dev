/** @type {import('../@types').Config } */
const config = {
  seo: {
    title: 'Mog',
    description: 'A simple blog system',
  },
  site: {},
  schedule: [],
  webhooks: [],
  themes: [],
  email: {},
};

/** @type {import('../@types').User } */
const user = {};

/** @type {import('../@types').Post[] }*/
const posts = [];

/** @type {import('../@types').Page[] }*/
const pages = [];

/** @type {import('../@types').Comment[] }*/
const comments = [];

/** @type {import('../@types').Category[] }*/
const categories = [];

/** @type {import('../@types').Friend[] }*/
const friends = [];

/** @type {import('../@types').Theme }*/
const theme = {}


/** @type {import('../@types').Mock } */
module.exports = {
  config,
  user,
  comments,
  friends,
  theme,
  site: {
    posts,
    pages,
    categories,
    tags: [], // FIX: it should be auto-generated
  }
}