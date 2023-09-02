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
const posts = [
  {
    id: "aosidjasodijasoidjasoid",
    title: "Hello World",
    slug: "hello-world",
    text: "This is my first post,yoyoyoyoyoyoyoyo",
    category: {
      name: "Mock Category",
      slug: "mock-category",
    },
    category_id: "categoryid",
    tags: ["tag1", "tag2"],
    created: new Date().toLocaleDateString(),
    modified: new Date().toLocaleDateString(),
    count: {
      read: 900,
      like: 2
    },
    summary: "This is my first post",
  }
];

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