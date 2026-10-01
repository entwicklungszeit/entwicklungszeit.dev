export const SITE_URL = 'https://entwicklungszeit.dev';

// Seiten-URLs enden auf '/', passend zu Canonical und Sitemap (Astro.url.pathname).
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`;

export const assetUrl = (path: string) => `${SITE_URL}${path}`;

// Stabile @id für einen Knoten, der zu einer Seite gehört, z. B. `…/sparring/#service`.
export const pageNodeId = (path: string, fragment: string) => `${absoluteUrl(path)}#${fragment}`;

export const personId = `${SITE_URL}/#gregor-woiwode`;
export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;
