export type OfferIconName = 'wirkung' | 'sparring';

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
  wirkung: [
    { tone: 'ink', d: 'M6 41H17V31H27V21H34' },
    { tone: 'accent', circle: { cx: 38, cy: 12, r: 3.25 } },
    { tone: 'accent', d: 'M30.5 12A7.5 7.5 0 0 1 38 4.5' },
    { tone: 'accent', d: 'M27 12A11 11 0 0 1 38 1', opacity: 0.55 }
  ],
  sparring: [
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
  { label: 'Blog', href: '/blog' },
  { label: 'Podcast', href: '/podcast' },
  {
    label: 'Angebote',
    href: '/angebote',
    children: [
      { label: 'Entwickler:in mit Wirkung', href: '/angebote/entwickler-mit-wirkung', icon: 'wirkung' },
      { label: 'Sparring', href: '/angebote/sparring', icon: 'sparring' }
    ]
  },
  { label: 'Kontakt', href: '/kontakt' }
];
