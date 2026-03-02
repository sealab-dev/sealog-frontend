import type { UserRole } from "./user.enums";

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: UserRole;
  position: string | null;
  about: string | null;
  profileImagePath: string | null;
}

export interface BlogUserResponse {
  nickname: string;
  profileImagePath: string | null;
  position: string | null;
  about: string | null;
  //api 연결 후
  // bannerImagePath: string | null
}
