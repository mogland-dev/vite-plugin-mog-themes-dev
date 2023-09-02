import { WriteBase } from "./basic";
import { Category } from "./category";

export interface Post extends WriteBase {
  slug: string;
  summary: string;
  category_id: string;
  category: Category
  copyright: boolean;
  count: {
    read: number;
    like: number;
  }
  tags: string[];
}
