import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [tailwind()],
  experimental: { svg: true },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' }
  }
});
