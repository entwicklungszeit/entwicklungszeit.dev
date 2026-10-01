import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { readFileSync, readdirSync } from 'node:fs';

// lastmod pro Inhaltsseite aus dem Frontmatter (updatedDate, sonst pubDate).
// Für alle anderen Seiten bleibt es beim Build-Datum.
function contentLastmod(collection, urlPrefix) {
  const dir = `./src/content/${collection}`;
  const dates = new Map();
  for (const file of readdirSync(dir).filter(f => /\.mdx?$/.test(f))) {
    const frontmatter = readFileSync(`${dir}/${file}`, 'utf8');
    const date =
      frontmatter.match(/^updatedDate:\s*['"]?([\d-]+)/m)?.[1] ??
      frontmatter.match(/^pubDate:\s*['"]?([\d-]+)/m)?.[1];
    if (date) dates.set(`https://entwicklungszeit.dev${urlPrefix}/${file.replace(/\.mdx?$/, '')}/`, date);
  }
  return dates;
}

const lastmodByUrl = new Map([
  ...contentLastmod('blog', '/blog'),
  ...contentLastmod('podcast', '/podcast')
]);

export default defineConfig({
  site: 'https://entwicklungszeit.dev',
  integrations: [
    // astro-expressive-code must be registered before mdx() so its remark/rehype
    // plugins can process code blocks in both .md and .mdx content.
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      defaultProps: {
        showLineNumbers: true,
        wrap: true
      }
    }),
    tailwind(),
    vue(),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: page => !page.endsWith('/danke/'),
      serialize: item => {
        const date = lastmodByUrl.get(item.url);
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      }
    })
  ],

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    remotePatterns: [{ protocol: 'https' }]
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },

  build: {
    inlineStylesheets: 'auto'
  }
});
