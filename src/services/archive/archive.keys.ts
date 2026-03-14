export const archiveKeys = {
  all: ['archive'] as const,

  // Guest
  guestList: (nickname: string) => [...archiveKeys.all, 'guest', 'list', nickname] as const,
  guestPosts: (archiveId: number) => [...archiveKeys.all, 'guest', 'posts', archiveId] as const,

  // User
  myList: () => [...archiveKeys.all, 'user', 'list'] as const,
  myPosts: (archiveId: number) => [...archiveKeys.all, 'user', 'posts', archiveId] as const,
};
