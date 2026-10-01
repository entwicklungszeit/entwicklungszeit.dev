import { breadcrumbNode, itemListNode, ref, webPageNode, type JsonLdNode } from '@json-ld';
import { pageNodeId } from '../../lib/jsonLd/urls';

type PostEntry = { name: string; path: string };

function blogListing(
  path: string,
  name: string,
  description: string,
  trail: { name: string; path: string }[],
  posts: PostEntry[]
): JsonLdNode[] {
  const listId = pageNodeId(path, 'posts');
  return [
    { ...itemListNode(posts, 'BlogPosting'), '@id': listId },
    webPageNode({
      path,
      name,
      description,
      type: 'CollectionPage',
      mainEntity: ref(listId)
    }),
    breadcrumbNode(path, [{ name: 'Start', path: '/' }, ...trail])
  ];
}

export const blogIndexSchema = (posts: PostEntry[]) =>
  blogListing(
    '/blog',
    'Blog - Entwicklungszeit',
    'Artikel über Kommunikation, Führung, AI Engineering und Angular von Gregor Woiwode.',
    [{ name: 'Blog', path: '/blog' }],
    posts
  );

export const blogCategorySchema = (categoryPath: string, label: string, posts: PostEntry[]) =>
  blogListing(
    categoryPath,
    `${label} Artikel - Entwicklungszeit Blog`,
    `Alle Blog-Artikel aus der Kategorie ${label} auf Entwicklungszeit.`,
    [
      { name: 'Blog', path: '/blog' },
      { name: label, path: categoryPath }
    ],
    posts
  );
