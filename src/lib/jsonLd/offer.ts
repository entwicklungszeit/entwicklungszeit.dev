import { optional, ref, type JsonLdNode } from './types';
import { personId } from './urls';

type OfferInput = {
  name: string;
  description: string;
  amount: number;
  url: string;
  // Einheit nach UN/CEFACT, z. B. 'HUR' für Stunde.
  unitCode?: string;
  eligibleHours?: number;
};

export function offerNode(input: OfferInput): JsonLdNode {
  return {
    '@type': 'Offer',
    name: input.name,
    description: input.description,
    url: input.url,
    price: input.amount,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: input.amount,
      priceCurrency: 'EUR',
      valueAddedTaxIncluded: false,
      ...optional('unitCode', input.unitCode)
    },
    ...optional(
      'eligibleQuantity',
      input.eligibleHours && {
        '@type': 'QuantitativeValue',
        maxValue: input.eligibleHours,
        unitCode: 'HUR'
      }
    ),
    seller: ref(personId)
  };
}

type CatalogItem = { name: string; description?: string };

export function offerCatalogNode(name: string, items: CatalogItem[]): JsonLdNode {
  return {
    '@type': 'OfferCatalog',
    name,
    itemListElement: items.map(item => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: item.name,
        ...optional('description', item.description)
      }
    }))
  };
}
