export const userKeys = {
  all: ['user'] as const,
  myProfile: () => [...userKeys.all, 'me'] as const,
  publicProfile: (nickname: string) => [...userKeys.all, 'blog', nickname] as const,
};