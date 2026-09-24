import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Artikel über Kommunikation, Führung, AI Engineering und Angular.
// Jeder Artikel gehört zu genau einer Kategorie (kein Mehrfach-Tagging).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['leadership', 'kommunikation', 'ai', 'angular']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    status: z.enum(['draft', 'public']),
    // Slugs/IDs von Episoden aus der `podcast`-Collection, die zu diesem Artikel passen.
    relatedEpisodes: z.array(reference('podcast')).optional(),
  }),
});

// Redaktionelle Episodenseiten (Shownotes etc.). Der RSS-Feed
// (siehe src/services/episodeService.ts) bleibt die Quelle zur Erkennung neuer
// Folgen; hier wird nur ergänzt, was Gregor redaktionell ausgearbeitet hat.
// Eine Folge aus dem RSS-Feed OHNE Eintrag hier bekommt bewusst keine Detailseite.
const podcast = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),
    // Verknüpfung zur per RSS gelieferten Folge (siehe episodeService.ts) erfolgt
    // über die gemeinsame Episodennummer.
    episodeNumber: z.number().int().positive(),
    pubDate: z.coerce.date(),
    audioUrl: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    guest: z.string().optional(),
    // Slugs/IDs von Artikeln aus der `blog`-Collection, die zu dieser Folge passen.
    relatedPosts: z.array(reference('blog')).optional(),
  }),
});

export const collections = { blog, podcast };
