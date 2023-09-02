import { Base } from "./basic";

export enum CategoryType {
  Category,
  Tag,
}

export interface Category extends Base {
  name: string;
  type: CategoryType;
  slug: string;
  icon?: string;
  description?: string;
}