import { Base } from "./basic";

enum CommentStatus {
  Pending = 0, // 待审核
  Approved = 1, // 已通过
  Spam = 2, // 垃圾评论
  Trash = 3, // 回收站
  Private = 4, // 私密评论
}

enum CommentReactions {
  Like = "like",
  Dislike = "dislike",
  Smile = "smile",
  Angry = "angry",
  Laugh = "laugh",
  Confused = "confused",
  Heart = "heart",
  Haha = "haha",
  Cry = "cry",
  Wow = "wow",
}

interface CommentReaction {
  [key: string]: number;
}

export interface Comment extends Base {
  pid: string;
  parent?: Comment;
  children?: Comment[];
  text: string;
  author: string;
  email: string;
  url?: string;
  status: CommentStatus;
  commentsIndex: number;
  key: string;
  reactions: CommentReaction;
}
