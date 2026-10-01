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
import { localReach, beratung } from '../angebote';

const path = '/angebote/sparring';
const title = 'Software-Architektur-Beratung in Leipzig und online - Gregor Woiwode';
const description = `Beratung für Software-Architektur, Engineering und Projektmanagement, online und vor Ort in Leipzig. ${beratung.hourlyRateAmount} Euro netto pro Stunde, die erste Stunde ist kostenfrei.`;

export const beratungPage = {
  title,
  description,
  schema: [
    webPageNode({ path, name: title, description, mainEntity: ref(serviceId(path)) }),
    serviceNode({
      path,
      name: 'Beratung',
      description: `${beratung.intro} ${beratung.background} ${localReach.text}`,
      serviceType:
        'Beratung für Software-Architektur, Software Engineering und Softwareprojektmanagement',
      audience: beratung.audience,
      offers: [
        offerNode({
          name: 'Beratung pro Stunde',
          description: `${beratung.hourlyRate} ${beratung.rateNote}. Abgerechnet wird die vereinbarte Zeit.`,
          amount: beratung.hourlyRateAmount,
          unitCode: 'HUR',
          url: absoluteUrl(path)
        }),
        offerNode({
          name: 'Erste Beratungsstunde',
          description: `${beratung.special} ${beratung.freeHourNote}`,
          amount: 0,
          unitCode: 'HUR',
          eligibleHours: 1,
          url: absoluteUrl(path)
        })
      ],
      catalog: offerCatalogNode(
        'Themen in der Beratung',
        [...beratung.topics, ...beratung.changeTypes].map(name => ({ name }))
      )
    }),
    breadcrumbNode(path, [
      { name: 'Start', path: '/' },
      { name: 'Angebote', path: '/angebote' },
      { name: 'Beratung', path }
    ])
  ]
};
