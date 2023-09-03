import { Category } from "./category";
import { Comment } from "./comment";
import { Config, Theme } from "./config";
import { Friend } from "./friend";
import { Page } from "./page";
import { Post } from "./post";
import { User } from "./user";

export interface Mock {
  config: Config;
  user: User;
  comments: Comment[];
  friends: Friend[];
  theme: Theme;
  site: {
    categories: Category[];
    posts: Post[];
    pages: Page[];
    tags: { count: number; name: string; }[];
  };
}

export { Category, Comment, Config, Friend, Page, Post, User, Theme };
export * from "./render";
