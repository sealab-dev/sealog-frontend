export interface AuthProfile {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  profileImageUrl: string | null;
}
