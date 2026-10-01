import { breadcrumbNode, itemListNode, webPageNode } from '@json-ld';
import { navItems } from '../navigation';

const path = '/angebote';
const title = 'Angebote - Entwicklungszeit';
const description =
  'Kostenlose Inhalte mit Podcast und Blog sowie Dienstleistungen: das 12-Wochen-Programm Entwickler:in mit Wirkung und Beratung auf Stundenbasis.';

const offerEntries = navItems
  .find(item => item.href === path)!
  .children!.map(offer => ({ name: offer.label, path: offer.href }));

export const angebotePage = {
  title,
  description,
  schema: [
    webPageNode({
      path,
      name: title,
      description,
      type: 'CollectionPage',
      mainEntity: itemListNode(offerEntries)
    }),
    breadcrumbNode(path, [
      { name: 'Start', path: '/' },
      { name: 'Angebote', path }
    ])
  ]
};
