import { breadcrumbNode, itemListNode, webPageNode } from '@json-ld';
import { navItems } from '../navigation';

const path = '/angebote';
const title = 'Angebote - Entwicklungszeit';
const description =
  'Zwei Wege, mit mir zu arbeiten: das 12-Wochen-Programm Entwickler:in mit Wirkung oder Sparring auf Stundenbasis.';

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
