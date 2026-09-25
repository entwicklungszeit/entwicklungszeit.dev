import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://entwicklungszeit.dev',
  integrations: [
    // astro-expressive-code must be registered before mdx() so its remark/rehype
    // plugins can process code blocks in both .md and .mdx content.
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      defaultProps: {
        showLineNumbers: true,
        wrap: true,
      },
    }),
    tailwind(),
    vue(),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  redirects: {
    '/coaching': '/angebote',
  },

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    remotePatterns: [{ protocol: 'https' }],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
