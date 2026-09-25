export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Single source of truth for the top-level navigation, used by
// Navigation.vue for both the desktop and mobile menu.
export const navItems: NavItem[] = [
  { label: 'Start', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Podcast', href: '/podcast' },
  {
    label: 'Angebote',
    href: '/angebote',
    children: [
      { label: 'Entwickler:in mit Wirkung', href: '/angebote/entwickler-mit-wirkung' },
      { label: 'Sparring', href: '/angebote/sparring' }
    ]
  },
  { label: 'Kontakt', href: '/kontakt' }
];
