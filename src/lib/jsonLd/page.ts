import { siteIdentity } from '../../data/siteIdentity';
import { optional, ref, type JsonLdNode } from './types';
import { absoluteUrl, pageNodeId, websiteId } from './urls';

type WebPageInput = {
  path: string;
  name: string;
  description: string;
  type?: 'WebPage' | 'CollectionPage';
  mainEntity?: JsonLdNode;
};

export function webPageNode(input: WebPageInput): JsonLdNode {
  return {
    '@type': input.type ?? 'WebPage',
    '@id': pageNodeId(input.path, 'webpage'),
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: siteIdentity.locale,
    isPartOf: ref(websiteId),
    breadcrumb: ref(pageNodeId(input.path, 'breadcrumb')),
    ...optional('mainEntity', input.mainEntity)
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbNode(path: string, items: BreadcrumbItem[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': pageNodeId(path, 'breadcrumb'),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

type ListEntry = { name: string; path: string };

export function itemListNode(entries: ListEntry[]): JsonLdNode {
  return {
    '@type': 'ItemList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      url: absoluteUrl(entry.path),
      item: { '@type': 'Service', name: entry.name, url: absoluteUrl(entry.path) }
    }))
  };
}
