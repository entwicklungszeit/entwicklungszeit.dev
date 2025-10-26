import { ref, type Ref } from 'vue';
import type { Episode } from '../types/episode';

interface UseEpisodesReturn {
  episodes: Ref<Episode[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  fetchEpisodes: () => Promise<void>;
}

/**
 * Composable for fetching and managing podcast episodes
 * Follows Single Responsibility Principle - only handles episode data management
 */
export function useEpisodes(maxEpisodes: number = 5): UseEpisodesReturn {
  const episodes = ref<Episode[]>([]);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);

  const RSS_FEED_URL = 'https://anchor.fm/s/1003c6b34/podcast/rss';
  const FALLBACK_THUMBNAIL = 
    'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/42889269/f3920f44c23f9537.jpg';

  /**
   * Extracts thumbnail URL from RSS item using multiple strategies
   */
  const extractThumbnail = (item: Element, xmlDoc: Document): string => {
    // Strategy 1: iTunes image with href attribute
    const itunesImage = item.querySelector('itunes\\:image, image[href]');
    if (itunesImage?.hasAttribute('href')) {
      return itunesImage.getAttribute('href') || '';
    }

    // Strategy 2: Search for any iTunes namespace image
    const allElements = item.getElementsByTagName('*');
    for (const element of allElements) {
      const nodeName = element.nodeName.toLowerCase();
      if (
        (nodeName.includes('itunes:image') ||
          (nodeName.includes('image') && element.namespaceURI?.includes('itunes'))) &&
        element.hasAttribute('href')
      ) {
        return element.getAttribute('href') || '';
      }
    }

    // Strategy 3: Enclosure with image type
    const enclosure = item.querySelector('enclosure[type^="image"]');
    if (enclosure?.hasAttribute('url')) {
      return enclosure.getAttribute('url') || '';
    }

    // Strategy 4: Feed-level image
    const imageUrl = xmlDoc.querySelector('image url');
    return imageUrl?.textContent || FALLBACK_THUMBNAIL;
  };

  /**
   * Extracts episode link, preferring Spotify links
   */
  const extractLink = (item: Element): string => {
    const links = Array.from(item.querySelectorAll('link'));
    
    // Prefer Spotify links
    for (const linkEl of links) {
      const url = linkEl.textContent?.trim() || '';
      if (url.includes('spotify.com')) {
        return url;
      }
    }
    
    // Fallback to first available link
    return item.querySelector('link')?.textContent?.trim() || '';
  };

  /**
   * Parses RSS XML and extracts episode data
   */
  const parseRSSFeed = (xmlText: string): Episode[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    const parsedEpisodes: Episode[] = [];

    for (let i = 0; i < Math.min(items.length, maxEpisodes); i++) {
      const item = items[i];

      const link = extractLink(item);
      const thumbnail = extractThumbnail(item, xmlDoc);
      const title = item.querySelector('title')?.textContent?.trim() || 'Podcast Episode';
      const description = item.querySelector('description')?.textContent?.trim() || '';
      const shortDesc = description
        .replace(/<[^>]*>/g, '')
        .substring(0, 100) + (description.length > 100 ? '...' : '');

      if (link && thumbnail) {
        parsedEpisodes.push({
          link,
          thumbnail,
          title,
          description: shortDesc,
        });
      }
    }

    return parsedEpisodes;
  };

  /**
   * Fetches episodes from RSS feed
   */
  const fetchEpisodes = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(RSS_FEED_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status}`);
      }

      const xmlText = await response.text();
      episodes.value = parseRSSFeed(xmlText);

      console.log(`Successfully loaded ${episodes.value.length} episodes`);
    } catch (err) {
      console.error('Error loading podcast episodes:', err);
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    } finally {
      loading.value = false;
    }
  };

  return {
    episodes,
    loading,
    error,
    fetchEpisodes,
  };
}

