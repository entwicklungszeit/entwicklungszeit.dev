import { siteIdentity } from '../../data/siteIdentity';
import { optional, ref, type JsonLdNode } from './types';
import { absoluteUrl, organizationId, pageNodeId, personId, websiteId } from './urls';

type BlogPostingInput = {
  path: string;
  headline: string;
  description: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  section?: string;
};

export function blogPostingNode(input: BlogPostingInput): JsonLdNode {
  return {
    '@type': 'BlogPosting',
    '@id': pageNodeId(input.path, 'article'),
    mainEntityOfPage: absoluteUrl(input.path),
    headline: input.headline,
    description: input.description,
    inLanguage: siteIdentity.locale,
    datePublished: input.datePublished.toISOString(),
    dateModified: (input.dateModified ?? input.datePublished).toISOString(),
    author: ref(personId),
    publisher: ref(organizationId),
    isPartOf: ref(websiteId),
    breadcrumb: ref(pageNodeId(input.path, 'breadcrumb')),
    ...optional('image', input.image),
    ...optional('articleSection', input.section)
  };
}
