import { Base } from "./basic";

export interface User extends Base {
  username: string;
  nickname: string;
  description?: string;
  avatar?: string;
  email?: string;
  url?: string;
  lastLoginTime?: Date;
  lastLoginIp?: string;
  socialIds?: Record<string, string>;
  api_token?: {
    name: string;
    created: Date;
    token: string;
    expired?: Date;
  };
}
