export const postKeys = {
  all: ['post'] as const,

  // Guest
  posts: () => [...postKeys.all, 'list'] as const,
  userPosts: (nickname: string) => [...postKeys.all, 'list', nickname] as const,
  detail: (nickname: string, slug: string) => [...postKeys.all, 'detail', nickname, slug] as const,
  autocomplete: (keyword: string) => [...postKeys.all, 'autocomplete', keyword] as const,

  // User
  edit: (slug: string) => [...postKeys.all, 'edit', slug] as const,
  deleted: () => [...postKeys.all, 'deleted'] as const,
};
