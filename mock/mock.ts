import { faker } from "@faker-js/faker/locale/zh_CN";
import {
  Config,
  User,
  Post,
  Page,
  Category,
  Friend,
  Theme,
  Mock,
  Comment,
} from "../@types";

const config: Config = {
  seo: {
    title: faker.internet.domainWord(),
    description: faker.lorem.paragraph(),
  },
  site: {
    fount_url: faker.internet.url(),
    server_url: faker.internet.url(),
  },
  themes: [],
  webhooks: Array.from({ length: faker.number.int({ min: 2, max: 10 }) }).map(
    () => {
      return {
        name: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        url: faker.internet.url(),
      };
    }
  ),
  email: {
    host: faker.internet.domainName(),
    port: faker.number.int({
      min: 0,
      max: 65535,
    }),
    secure: faker.datatype.boolean(),
    user: faker.internet.email(),
    pass: faker.internet.password(),
  },
  schedule: Array.from({ length: faker.number.int({ min: 2, max: 10 }) }).map(
    () => {
      return {
        name: faker.lorem.word(),
        time: faker.date.future(),
        enable: faker.datatype.boolean(),
        description: faker.lorem.paragraph(),
        token: faker.string.uuid(),
        action: null,
        type: "event" as any,
        after: "none" as any,
        active: faker.datatype.boolean(),
      };
    }
  ),
};

const user: User = {
  id: faker.string.uuid(),
  username: faker.internet.userName(),
  nickname: faker.person.firstName(),
  created: new Date(faker.date.past()).toLocaleDateString(),
};

const posts: Post[] = Array.from({
  length: faker.number.int({ min: 10, max: 50 }),
}).map(() => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    text: faker.lorem.paragraphs(),
    slug: faker.lorem.slug(),
    summary: faker.lorem.paragraph(),
    category_id: faker.string.uuid(),
    category: {
      id: faker.string.uuid(),
      name: faker.lorem.word(),
      type: faker.number.int({ min: 0, max: 1 }) as any,
      created: new Date(faker.date.past()).toLocaleDateString(),
      description: faker.lorem.paragraph(),
      icon: faker.lorem.word(),
      slug: faker.lorem.slug(),
    },
    count: {
      read: faker.number.int({ min: 0, max: 1000 }),
      like: faker.number.int({ min: 0, max: 1000 }),
    },
    tags: Array.from({ length: faker.number.int({ min: 2, max: 10 }) }).map(
      () => faker.lorem.word()
    ),
    copyright: faker.datatype.boolean(),
    commentsIndex: faker.number.int({ min: 0, max: 1000 }),
    images: [],
    fields: {},
    hide: faker.datatype.boolean(),
    rss: faker.datatype.boolean(),
    password: faker.internet.password(),
    created: new Date(faker.date.past()).toLocaleDateString(),
    modified: faker.date.past(),
    allowComment: faker.datatype.boolean(),
  };
});

const pages: Page[] = Array.from({
  length: faker.number.int({ min: 2, max: 4 }),
}).map(() => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(2),
    text: faker.lorem.paragraphs(),
    slug: faker.lorem.slug(),
    commentsIndex: faker.number.int({ min: 0, max: 1000 }),
    images: [],
    fields: {},
    created: new Date(faker.date.past()).toLocaleDateString(),
    modified: faker.date.past(),
    allowComment: faker.datatype.boolean(),
    subtitle: faker.lorem.sentence(),
    order: faker.number.int({ min: 0, max: 1000 }),
    hide: faker.datatype.boolean(),
    rss: faker.datatype.boolean(),
  };
});

const comments: Comment[] = Array.from({
  length: faker.number.int({ min: 10, max: 100 }),
}).map(() => {
  return {
    id: faker.string.uuid(),
    pid: faker.string.uuid(),
    parent: undefined,
    children: [],
    text: faker.lorem.paragraph(),
    author: faker.internet.userName(),
    email: faker.internet.email(),
    url: faker.internet.url(),
    status: faker.number.int({ min: 0, max: 4 }) as any,
    commentsIndex: faker.number.int({ min: 0, max: 1000 }),
    key: faker.lorem.word(),
    reactions: {
      like: faker.number.int({ min: 0, max: 1000 }),
      dislike: faker.number.int({ min: 0, max: 1000 }),
      smile: faker.number.int({ min: 0, max: 1000 }),
      angry: faker.number.int({ min: 0, max: 1000 }),
      laugh: faker.number.int({ min: 0, max: 1000 }),
      confused: faker.number.int({ min: 0, max: 1000 }),
      heart: faker.number.int({ min: 0, max: 1000 }),
      haha: faker.number.int({ min: 0, max: 1000 }),
      cry: faker.number.int({ min: 0, max: 1000 }),
      wow: faker.number.int({ min: 0, max: 1000 }),
    },
    created: new Date(faker.date.past()).toLocaleDateString(),
  };
});

const categories: Category[] = Array.from({
  length: faker.number.int({ min: 3, max: 5 }),
}).map(() => {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.word(),
    type: faker.number.int({ min: 0, max: 1 }) as any,
    created: new Date(faker.date.past()).toLocaleDateString(),
    description: faker.lorem.paragraph(),
    icon: faker.lorem.word(),
    slug: faker.lorem.slug(),
  };
});

const friends: Friend[] = Array.from({
  length: faker.number.int({ min: 10, max: 50 }),
}).map(() => {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.word(),
    link: faker.internet.url(),
    desc: faker.lorem.paragraph(),
    logo: faker.internet.url(),
    nickname: faker.person.firstName(),
    avatar: faker.internet.url(),
    email: faker.internet.email(),
    status: faker.number.int({ min: 0, max: 3 }) as any,
    group: faker.lorem.word(),
    auto_check: faker.datatype.boolean(),
    verify_link: faker.internet.url(),
    feed: faker.internet.url(),
    feed_type: (faker.datatype.boolean() ? "rss" : "atom") as any,
    feed_contents: faker.lorem.paragraph(),
    created: new Date(faker.date.past()).toLocaleDateString(),
  };
});

const theme: Theme = {
  id: faker.string.uuid(),
  name: faker.lorem.word(),
  active: faker.datatype.boolean(),
  package: JSON.stringify({
    name: faker.lorem.word(),
    version: faker.system.semver(),
    description: faker.lorem.paragraph(),
    author: faker.internet.userName(),
  }),
  version: faker.system.semver(),
  config: JSON.stringify(
    // FIX: 这里应该直接解析主题的配置
    Array.from({ length: 10 }).map(() => {
      return {
        name: faker.lorem.word(),
        key: camelCase(faker.lorem.word()),
        type: "textarea",
        value: faker.lorem.paragraph(),
      };
    })
  ),
  path: faker.system.filePath(),
};

function camelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export const mock: Mock = {
  config,
  user,
  comments,
  friends,
  theme,
  site: {
    posts,
    pages,
    categories,
    tags: Array.from({ length: faker.number.int({ min: 2, max: 10 }) }).map(
      () => faker.lorem.word()
    ),
  },
};

module.exports = mock;