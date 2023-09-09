import { WriteBase } from "./basic";

export interface Page extends WriteBase {
  slug: string;
  subtitle?: string | null;
  order: number;
}