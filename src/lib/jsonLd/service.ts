import { siteIdentity } from '../../data/siteIdentity';
import { optional, ref, type JsonLdNode } from './types';
import { absoluteUrl, organizationId, pageNodeId, personId } from './urls';

type ServiceInput = {
  path: string;
  name: string;
  alternateName?: string;
  description: string;
  serviceType: string;
  audience: string;
  offers: JsonLdNode[];
  catalog?: JsonLdNode;
};

export const serviceId = (path: string) => pageNodeId(path, 'service');

export function serviceNode(input: ServiceInput): JsonLdNode {
  return {
    '@type': 'Service',
    '@id': serviceId(input.path),
    name: input.name,
    ...optional('alternateName', input.alternateName),
    description: input.description,
    url: absoluteUrl(input.path),
    serviceType: input.serviceType,
    provider: ref(personId),
    brand: ref(organizationId),
    areaServed: [
      ...siteIdentity.areaServed.countries.map(name => ({ '@type': 'Country', name })),
      ...siteIdentity.areaServed.cities.map(name => ({ '@type': 'City', name }))
    ],
    availableLanguage: 'de',
    audience: { '@type': 'Audience', audienceType: input.audience },
    offers: input.offers,
    ...optional('hasOfferCatalog', input.catalog)
  };
}
