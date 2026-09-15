export const blogCategories = ['leadership', 'kommunikation', 'ai', 'angular'] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const blogCategoryLabels: Record<BlogCategory, string> = {
  leadership: 'Leadership',
  kommunikation: 'Kommunikation',
  ai: 'AI',
  angular: 'Angular'
};
