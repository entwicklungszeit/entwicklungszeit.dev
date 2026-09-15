export interface NavItem {
  label: string;
  href: string;
}

// Single source of truth for the top-level navigation, used by
// Navigation.vue for both the desktop and mobile menu.
export const navItems: NavItem[] = [
  { label: 'Start', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Podcast', href: '/podcast' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'Kontakt', href: '/kontakt' }
];
