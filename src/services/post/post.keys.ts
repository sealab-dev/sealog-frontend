export const postKeys = {
  all: ['post'] as const,

  // Guest
  posts: () => [...postKeys.all, 'list', 'all'] as const,
  userPosts: (nickname: string) => [...postKeys.all, 'list', 'user', nickname] as const,
  stackPosts: (nickname: string, stackName: string) => [...postKeys.all, 'list', 'stack', nickname, stackName] as const,
  search: (keyword: string) => [...postKeys.all, 'search', 'global', keyword] as const,
  searchUser: (nickname: string, keyword: string) => [...postKeys.all, 'search', 'user', nickname, keyword] as const,
  detail: (nickname: string, slug: string) => [...postKeys.all, 'detail', nickname, slug] as const,

  // User (Me)
  myList: (params?: object) => [...postKeys.all, 'me', 'list', params] as const,
  searchMe: (keyword: string) => [...postKeys.all, 'search', 'me', keyword] as const,
  edit: (slug: string) => [...postKeys.all, 'edit', slug] as const,
  deleted: () => [...postKeys.all, 'deleted'] as const,
};