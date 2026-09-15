export const blogCategories = ['leadership', 'kommunikation', 'ai', 'angular'] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const blogCategoryLabels: Record<BlogCategory, string> = {
  leadership: 'Leadership',
  kommunikation: 'Kommunikation',
  ai: 'AI',
  angular: 'Angular'
};

// Written out as literal class names (not built from the category string) so
// Tailwind's static content scanner can find and generate them.
export const blogCategoryTextClass: Record<BlogCategory, string> = {
  leadership: 'text-leadership',
  kommunikation: 'text-kommunikation',
  ai: 'text-ai',
  angular: 'text-angular'
};
