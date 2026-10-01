import {
  absoluteUrl,
  breadcrumbNode,
  faqNode,
  offerCatalogNode,
  offerNode,
  ref,
  serviceId,
  serviceNode,
  webPageNode
} from '@json-ld';
import { focusFields, programPrice } from '../angebote';
import { faqs } from '../faqData';

const path = '/angebote/entwickler-mit-wirkung';
const title = 'Software-Mentoring in Leipzig und online: Impact Developer Programm - Gregor Woiwode';
const description =
  '12 Wochen 1:1 Software-Mentoring und Coaching, online und vor Ort in Leipzig, für Entwickler:innen auf dem Weg zu 100.000 Euro Gehalt oder 200.000 Euro Freelance-Umsatz.';

export const entwicklerMitWirkungPage = {
  title,
  description,
  schema: [
    webPageNode({ path, name: title, description, mainEntity: ref(serviceId(path)) }),
    serviceNode({
      path,
      name: 'Entwickler:in mit Wirkung',
      alternateName: 'Impact Developer Programm',
      description,
      serviceType: 'Mentoring und Coaching für Software-Entwickler:innen',
      audience: 'Software-Entwickler:innen, vom Berufseinstieg bis zur Tech-Lead-Rolle',
      offers: [
        offerNode({
          name: '12 Wochen 1:1 Mentoring und Coaching',
          description:
            '12 bis 24 Live-Sessions à 60 Minuten, Vor- und Nachbereitung, Aufzeichnung jeder Session. Zahlung bei Rechnungserhalt, volle Rückerstattung in den ersten 2 Wochen.',
          amount: programPrice.amount,
          url: absoluteUrl(path)
        })
      ],
      catalog: offerCatalogNode(
        'Schwerpunkte des Programms',
        focusFields.map(field => ({ name: field.title, description: field.description }))
      )
    }),
    faqNode(path, faqs),
    breadcrumbNode(path, [
      { name: 'Start', path: '/' },
      { name: 'Angebote', path: '/angebote' },
      { name: 'Entwickler:in mit Wirkung', path }
    ])
  ]
};
