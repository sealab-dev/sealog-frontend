export const seriesKeys = {
  all: ['series'] as const,

  // Guest
  guestList: (nickname: string) => [...seriesKeys.all, 'guest', 'list', nickname] as const,
  guestPosts: (nickname: string, slug: string) => [...seriesKeys.all, 'guest', 'posts', nickname, slug] as const,

  // User
  myList: () => [...seriesKeys.all, 'me', 'list'] as const,
  myPosts: (slug: string) => [...seriesKeys.all, 'me', 'posts', slug] as const,
};
