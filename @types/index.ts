import { Category } from "./category";
import { Comment } from "./comment";
import { Config, Theme } from "./config";
import { Friend } from "./friend";
import { Page } from "./page";
import { Post } from "./post";
import { User } from "./user";

export interface Mock {
  config: Config;
  posts: Post[];
  pages: Page[];
  user: User;
  comments: Comment[];
  categories: Category[];
  friends: Friend[];
  theme: Theme;
}

export { Category, Comment, Config, Friend, Page, Post, User, Theme };
