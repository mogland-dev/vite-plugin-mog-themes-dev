export interface Base {
  created: Date;
  id: string;
}

export interface BaseCommentIndex extends Base {
  commentsIndex: number;
  allowComment: boolean;
}

export interface WriteBase {
  title: string;
  text: string;
  images: {
    width?: number;
    height?: number;
    color?: string;
    type?: string;
    src?: string;
  }[];
  modified: Date;
  fields: Record<string, any>;
  password?: string | null;
  hide: boolean;
  rss: boolean;
}