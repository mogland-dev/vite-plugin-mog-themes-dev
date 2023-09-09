import { Post } from "./post";
import { Page } from "./page";
import { Category } from "./category";
import { Friend } from "./friend";
import { User } from "./user";

export type RenderType =
  | "pages"
  | "posts"
  | "index"
  | "category"
  | "tag"
  | "archive"
  | "friends";

export interface Render<T extends RenderType> {
  site: {
    posts: Post[];
    pages: Page[];
    categories: Category[];
    tags: {
      count: number;
      name: string;
    }[];
  };
  page: IRenderPage<T>;
  config: any;
  theme: any;
  path: string;
  url: {
    url: string;
    path: string;
    query: Record<string, string>;
    params: Record<string, string>;
    origin: string;
    host: string;
    protocol: string;
  };
  user: User;
}

export interface RenderPagePage extends Page {}
export interface RenderPostPage extends Post {}
export interface RenderIndexPage {
  docs: Post[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
export interface RenderCategoryPage {
  data: {
    [key in keyof Category & {
      [key in "children"]: any;
    }]: Category[key];
  };
  isTag: false;
  isCategory: true;
}
export interface RenderTagPage {
  data: {
    name: string;
    children: Post[];
  };
  isTag: true;
  isCategory: false;
}
export interface RenderArchivePage {
  data: {
    children: Post[];
  };
  isCategory: boolean;
}
export type RenderFriendsPage = Friend[];

export type IRenderPage<T extends RenderType> = T extends "page"
  ? RenderPagePage
  : T extends "post"
  ? RenderPostPage
  : T extends "index"
  ? RenderIndexPage
  : T extends "category"
  ? RenderCategoryPage
  : T extends "tag"
  ? RenderTagPage
  : T extends "archive"
  ? RenderArchivePage
  : T extends "friends"
  ? RenderFriendsPage
  : never;
