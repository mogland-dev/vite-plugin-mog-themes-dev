import { Base } from "./basic";
enum RssParserType {
  RSS = 'rss',
  ATOM = 'atom',
}
enum FriendStatus {
  Approved = 0, // 已通过
  Pending = 1, // 待审核
  Spam = 2, // 垃圾友链
  Trash = 3, // 回收站友链
}

export interface Friend extends Base {
  // token: string; [PRIVATE]
  name: string;
  link: string;
  desc?: string;
  logo?: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  status: FriendStatus;
  group?: string;
  auto_check?: boolean;
  verify_link?: string;
  feed?: string;
  feed_type?: RssParserType;
  feed_contents?: string;
}