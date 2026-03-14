export const stackKeys = {
  all: ['stack'] as const,

  // Guest
  groupedByUser: (nickname: string) => [...stackKeys.all, 'grouped', nickname] as const,
  autocomplete: (keyword: string) => [...stackKeys.all, 'autocomplete', keyword] as const,

  // Admin
  adminList: (keyword?: string) => [...stackKeys.all, 'admin', 'list', keyword ?? ''] as const,
};
