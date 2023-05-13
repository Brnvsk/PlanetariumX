import { INewsTag } from "src/app/types/news.types";
import { News } from "./news.type";
import { RoleUsers } from "./role-users.enum";

type UserRole = 'user' | 'admin'

export interface User {
  id: number,
  login: string,
  password: string,
  email: string,
  role: UserRole,
  avatarId: number | null,
  tags: INewsTag[],
  discount: number
}

export interface TempUser {
  login: string,
  password: string,
  email: string,
  avatarId: number | null,
  role: UserRole,
  interested: News[],
}

export interface IUserAvatar {
  id: number,
  src: string
}