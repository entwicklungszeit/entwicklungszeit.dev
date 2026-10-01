import { siteIdentity } from '../../data/siteIdentity';
import { optional, ref, type JsonLdNode } from './types';
import { absoluteUrl, organizationId, pageNodeId, personId } from './urls';

type PodcastEpisodeInput = {
  path: string;
  seriesId: string;
  name: string;
  description: string;
  episodeNumber: number;
  datePublished: Date;
  audioUrl?: string;
  guest?: string;
};

export function podcastEpisodeNode(input: PodcastEpisodeInput): JsonLdNode {
  return {
    '@type': 'PodcastEpisode',
    '@id': pageNodeId(input.path, 'episode'),
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: siteIdentity.locale,
    episodeNumber: input.episodeNumber,
    datePublished: input.datePublished.toISOString(),
    partOfSeries: ref(input.seriesId),
    author: ref(personId),
    publisher: ref(organizationId),
    breadcrumb: ref(pageNodeId(input.path, 'breadcrumb')),
    ...(input.audioUrl
      ? { associatedMedia: { '@type': 'AudioObject', contentUrl: input.audioUrl } }
      : {}),
    ...(input.guest ? { actor: { '@type': 'Person', name: input.guest } } : {})
  };
}

type VideoInput = {
  name: string;
  description: string;
  uploadDate: Date;
  youtubeUrl: string;
  thumbnailUrl: string;
};

// Aus watch?v=ID / youtu.be/ID die ID ziehen; sonst kein VideoObject.
export function youtubeVideoId(url: string): string | undefined {
  const parsed = new URL(url);
  if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || undefined;
  return parsed.searchParams.get('v') ?? undefined;
}

export function videoObjectNode(input: VideoInput): JsonLdNode | undefined {
  const id = youtubeVideoId(input.youtubeUrl);
  if (!id) return undefined;
  return {
    '@type': 'VideoObject',
    name: input.name,
    description: input.description,
    uploadDate: input.uploadDate.toISOString(),
    thumbnailUrl: input.thumbnailUrl,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    contentUrl: input.youtubeUrl
  };
}
