import {
  absoluteUrl,
  breadcrumbNode,
  offerCatalogNode,
  offerNode,
  ref,
  serviceId,
  serviceNode,
  webPageNode
} from '@json-ld';
import { localReach, sparring } from '../coaching';

const path = '/angebote/sparring';
const title = 'Software-Architektur und Projekt-Sparring in Leipzig und online - Gregor Woiwode';
const description = `Sparring für Software-Architektur, Engineering und Projektmanagement, online und vor Ort in Leipzig. ${sparring.hourlyRateAmount} Euro netto pro Stunde, die erste Stunde ist kostenfrei.`;

export const sparringPage = {
  title,
  description,
  schema: [
    webPageNode({ path, name: title, description, mainEntity: ref(serviceId(path)) }),
    serviceNode({
      path,
      name: 'Sparring',
      description: `${sparring.intro} ${sparring.background} ${localReach.text}`,
      serviceType:
        'Sparring für Software-Architektur, Software Engineering und Softwareprojektmanagement',
      audience: sparring.audience,
      offers: [
        offerNode({
          name: 'Sparring pro Stunde',
          description: `${sparring.hourlyRate} ${sparring.rateNote}. Abgerechnet wird die vereinbarte Zeit.`,
          amount: sparring.hourlyRateAmount,
          unitCode: 'HUR',
          url: absoluteUrl(path)
        }),
        offerNode({
          name: 'Erste Sparring-Stunde',
          description: `${sparring.special} ${sparring.freeHourNote}`,
          amount: 0,
          unitCode: 'HUR',
          eligibleHours: 1,
          url: absoluteUrl(path)
        })
      ],
      catalog: offerCatalogNode(
        'Themen im Sparring',
        [...sparring.topics, ...sparring.changeTypes].map(name => ({ name }))
      )
    }),
    breadcrumbNode(path, [
      { name: 'Start', path: '/' },
      { name: 'Angebote', path: '/angebote' },
      { name: 'Sparring', path }
    ])
  ]
};
