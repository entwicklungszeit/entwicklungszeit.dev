import {
  absoluteUrl,
  breadcrumbNode,
  organizationId,
  personId,
  ref,
  webPageNode
} from '@json-ld';

const path = '/podcast';
const title = 'Podcast - Entwicklungszeit';
const description =
  'Alle Folgen des Entwicklungszeit Podcasts mit Shownotes: Softwareentwicklung, Führung und Kommunikation.';
export const podcastSeriesId = `${absoluteUrl(path)}#podcast`;

export const podcastPage = {
  title,
  description,
  schema: [
    {
      '@type': 'PodcastSeries',
      '@id': podcastSeriesId,
      name: 'Entwicklungszeit',
      description: 'Ein Podcast über Softwareentwicklung, Führung und Kommunikation',
      url: absoluteUrl(path),
      inLanguage: 'de-DE',
      author: ref(personId),
      publisher: ref(organizationId)
    },
    webPageNode({
      path,
      name: title,
      description,
      type: 'CollectionPage',
      mainEntity: ref(podcastSeriesId)
    }),
    breadcrumbNode(path, [
      { name: 'Start', path: '/' },
      { name: 'Podcast', path }
    ])
  ]
};
