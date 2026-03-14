export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthProfile {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  profileImageUrl: string | null;
}
