export type OfferIconName = 'podcast' | 'blog' | 'wirkung' | 'beratung';

// Geometrie der Angebots-Symbole (48er Raster). `tone` bestimmt die Farbe:
// 'ink' folgt currentColor, 'accent' nutzt --offer-accent. Gerendert von
// OfferIcon.astro und OfferIcon.vue, damit die Pfade nur hier stehen.
export interface OfferIconShape {
  tone: 'ink' | 'accent';
  d?: string;
  circle?: { cx: number; cy: number; r: number };
  opacity?: number;
}

export const offerIcons: Record<OfferIconName, OfferIconShape[]> = {
  podcast: [
    { tone: 'ink', d: 'M14 10a6 6 0 0 1 12 0V22a6 6 0 0 1-12 0Z' },
    { tone: 'ink', d: 'M8 21a12 12 0 0 0 24 0' },
    { tone: 'ink', d: 'M20 33V43' },
    { tone: 'ink', d: 'M13 43H27' },
    { tone: 'accent', d: 'M36 11a6 6 0 0 1 0 10' },
    { tone: 'accent', d: 'M40 7a11 11 0 0 1 0 18', opacity: 0.55 }
  ],
  blog: [
    { tone: 'ink', d: 'M11 4H29L38 13V42a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z' },
    { tone: 'ink', d: 'M29 4V13H38' },
    { tone: 'ink', d: 'M15 22H32' },
    { tone: 'ink', d: 'M15 29H28' },
    { tone: 'accent', d: 'M15 36H24' },
    { tone: 'accent', d: 'M29 33V39' }
  ],
  wirkung: [
    { tone: 'ink', d: 'M6 41H17V31H27V21H34' },
    { tone: 'accent', circle: { cx: 38, cy: 12, r: 3.25 } },
    { tone: 'accent', d: 'M30.5 12A7.5 7.5 0 0 1 38 4.5' },
    { tone: 'accent', d: 'M27 12A11 11 0 0 1 38 1', opacity: 0.55 }
  ],
  beratung: [
    { tone: 'ink', d: 'M9 6H21a5 5 0 0 1 5 5V17a5 5 0 0 1-5 5H15L9 27V22a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5Z' },
    { tone: 'ink', d: 'M10 14H20' },
    { tone: 'accent', d: 'M27 24H39a5 5 0 0 1 5 5V35a5 5 0 0 1-5 5V45L33 40H27a5 5 0 0 1-5-5V29a5 5 0 0 1 5-5Z' },
    { tone: 'accent', d: 'M28 32H38' }
  ]
};

// Linie wird unter 32 px dicker, damit sie nicht ausdünnt.
export const offerIconStrokeWidth = (size: number): number =>
  size >= 32 ? 1.75 : size >= 20 ? 2 : 2.25;

export interface NavItem {
  label: string;
  href: string;
  icon?: OfferIconName;
  children?: NavItem[];
}

// Single source of truth for the top-level navigation, used by
// Navigation.vue for both the desktop and mobile menu.
export const navItems: NavItem[] = [
  { label: 'Start', href: '/' },
  {
    label: 'Angebote',
    href: '/angebote',
    children: [
      { label: 'Podcast', href: '/podcast', icon: 'podcast' },
      { label: 'Blog', href: '/blog', icon: 'blog' },
      { label: 'Entwickler:in mit Wirkung', href: '/angebote/entwickler-mit-wirkung', icon: 'wirkung' },
      { label: 'Beratung', href: '/angebote/sparring', icon: 'beratung' }
    ]
  },
  { label: 'Kontakt', href: '/kontakt' }
];

// Angebote werden über ihre URL angesprochen, nicht über die Position im Menü.
export const offerNavItem = (href: string): NavItem =>
  navItems.find(item => item.href === '/angebote')!.children!.find(child => child.href === href)!;
