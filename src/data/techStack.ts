// Technologie-Logos für die Tech-Stack-Sektion. Gleiches 48er Raster und gleiche
// Tonregel wie die Angebots-Symbole (navigation.ts): 'ink' folgt currentColor,
// 'accent' nutzt --offer-accent. Gerendert von TechLogo.astro.
export type TechLogoName =
  "git" | "dotnet" | "angular" | "typescript" | "nodejs";

export interface TechLogoShape {
  tone: "ink" | "accent";
  d?: string;
  transform?: string;
  circle?: { cx: number; cy: number; r: number };
}

export const techLogos: Record<TechLogoName, TechLogoShape[]> = {
  git: [
    { tone: "ink", d: "M24 3.5L44.5 24L24 44.5L3.5 24Z" },
    { tone: "ink", d: "M19 20.5V27.5" },
    { tone: "ink", circle: { cx: 19, cy: 18, r: 2.5 } },
    { tone: "ink", circle: { cx: 19, cy: 30, r: 2.5 } },
    { tone: "accent", d: "M19 25.5C23.5 25.5 25.5 24 27.3 22" },
    { tone: "accent", circle: { cx: 29.5, cy: 20, r: 2.5 } },
  ],
  dotnet: [
    {
      tone: "ink",
      d: "M8 4H40a4 4 0 0 1 4 4V40a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z",
    },
    { tone: "accent", circle: { cx: 10, cy: 31, r: 1.8 } },
    { tone: "accent", d: "M15 32V19L22 32V19" },
    { tone: "accent", d: "M33 19H27V32H33M27 25.5H32" },
    { tone: "accent", d: "M35.5 19H41.5M38.5 19V32" },
  ],
  angular: [
    { tone: "ink", d: "M24 3.5L42.5 10L39.5 34.5L24 44.5L8.5 34.5L5.5 10Z" },
    { tone: "accent", d: "M16.5 33L24 15L31.5 33" },
    { tone: "accent", d: "M19.3 27.5H28.7" },
  ],
  typescript: [
    {
      tone: "ink",
      d: "M8 4H40a4 4 0 0 1 4 4V40a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z",
    },
    { tone: "accent", d: "M11 21H25M18 21V35" },
    {
      tone: "accent",
      d: "M7.2 3.4C6.3 1.8 4.9 1 3.2 1C1.4 1 0 2 0 3.5C0 7 7.2 5.4 7.2 9.4C7.2 11.1 5.5 12.2 3.5 12.2C1.9 12.2 .5 11.5 -.3 10.2",
      transform: "translate(28.5 21.5) scale(1.08)",
    },
  ],
  nodejs: [
    { tone: "ink", d: "M24 3L42 13.5V34.5L24 45L6 34.5V13.5Z" },
    { tone: "accent", d: "M22 18.5V28A3.4 3.4 0 0 1 15.2 28" },
    {
      tone: "accent",
      d: "M7.2 3.4C6.3 1.8 4.9 1 3.2 1C1.4 1 0 2 0 3.5C0 7 7.2 5.4 7.2 9.4C7.2 11.1 5.5 12.2 3.5 12.2C1.9 12.2 .5 11.5 -.3 10.2",
      transform: "translate(27 18.5) scale(1.05)",
    },
  ],
};

export const techStack: { name: string; logo: TechLogoName; text: string }[] = [
  {
    name: "Git",
    logo: "git",
    text: "Branching-Strategien, Historie aufräumen, Review-Workflows.",
  },
  {
    name: ".NET",
    logo: "dotnet",
    text: "Backend, Architektur und Modernisierung bestehender Systeme.",
  },
  {
    name: "Angular",
    logo: "angular",
    text: "Große Frontends, Signals, Migration und Teamstruktur.",
  },
  {
    name: "TypeScript",
    logo: "typescript",
    text: "Typsystem, Strict-Mode und gemeinsame Konventionen.",
  },
  {
    name: "Node.js",
    logo: "nodejs",
    text: "Services, Tooling und Build-Pipelines.",
  },
];
