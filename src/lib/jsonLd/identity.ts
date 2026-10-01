import { siteIdentity } from '../../data/siteIdentity';
import { optional, ref, type JsonLdNode } from './types';
import { SITE_URL, assetUrl, organizationId, personId, websiteId } from './urls';

export function personNode(): JsonLdNode {
  const { person } = siteIdentity;
  return {
    '@type': 'Person',
    '@id': personId,
    name: person.name,
    url: SITE_URL,
    image: assetUrl(person.imagePath),
    jobTitle: person.jobTitle,
    award: person.award,
    knowsAbout: person.knowsAbout,
    sameAs: person.sameAs
  };
}

export function organizationNode(): JsonLdNode {
  const { brand, organization } = siteIdentity;
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: brand,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: assetUrl(organization.logoPath) },
    founder: ref(personId),
    sameAs: organization.sameAs
  };
}

export function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    name: siteIdentity.brand,
    url: SITE_URL,
    inLanguage: siteIdentity.locale,
    publisher: ref(organizationId)
  };
}
