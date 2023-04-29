import { News } from "./news.type";
import { RoleUsers } from "./role-users.enum";

export interface User {
  id: number,
  login: string,
  password: string,
  email: string,
  role: RoleUsers,
  avatarId: number | null,
  interested: News[],
  discount: number
}

export interface TempUser {
  login: string,
  password: string,
  email: string,
  avatarId: number | null,
  role: RoleUsers,
  interested: News[],
}

export interface IUserAvatar {
  id: number,
  src: string
}