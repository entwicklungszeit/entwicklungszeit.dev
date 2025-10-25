import type { Episode } from '../types/episode';

const RSS_FEED_URL = 'https://anchor.fm/s/1003c6b34/podcast/rss';
const MAX_EPISODES = 12;

export async function fetchEpisodes(): Promise<Episode[]> {
  try {
    const response = await fetch(RSS_FEED_URL);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    const episodes: Episode[] = [];

    for (let i = 0; i < Math.min(items.length, MAX_EPISODES); i++) {
      const item = items[i];

      // Get episode link - prefer Spotify
      let link = '';
      const links = Array.from(item.querySelectorAll('link'));
      for (const linkEl of links) {
        const url = linkEl.textContent?.trim() || '';
        if (url.includes('spotify.com')) {
          link = url;
          break;
        }
      }
      if (!link) {
        link = item.querySelector('link')?.textContent?.trim() || '';
      }

      // Get thumbnail
      let thumbnail = '';
      const allElements = item.getElementsByTagName('*');
      for (const element of allElements) {
        const nodeName = element.nodeName.toLowerCase();
        if (
          (nodeName.includes('itunes:image') ||
            (nodeName.includes('image') &&
              element.namespaceURI?.includes('itunes'))) &&
          element.hasAttribute('href')
        ) {
          thumbnail = element.getAttribute('href') || '';
          break;
        }
      }

      // Fallback thumbnail
      if (!thumbnail) {
        const imageUrl = xmlDoc.querySelector('image url');
        thumbnail =
          imageUrl?.textContent ||
          'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/42889269/f3920f44c23f9537.jpg';
      }

      // Get episode details
      const title =
        item.querySelector('title')?.textContent?.trim() ||
        'Podcast Episode';
      const description =
        item.querySelector('description')?.textContent?.trim() || '';
      const shortDesc =
        description.replace(/<[^>]*>/g, '').substring(0, 100) +
        (description.length > 100 ? '...' : '');

      if (link && thumbnail) {
        episodes.push({
          link,
          thumbnail,
          title,
          description: shortDesc,
        });
      }
    }

    return episodes;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
}
