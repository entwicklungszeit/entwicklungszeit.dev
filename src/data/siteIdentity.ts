// Stammdaten für Person und Organisation, die im JSON-LD jeder Seite stehen.
export const siteIdentity = {
  brand: 'Entwicklungszeit',
  person: {
    name: 'Gregor Woiwode',
    imagePath: '/gregor-woiwode.png',
    jobTitle: 'Tech Lead und Software Engineer Coach',
    award: 'Google Developer Expert for Angular & Web-Technologies (seit 2019)',
    knowsAbout: [
      'Software Coaching',
      'Software Engineer Mentoring',
      'Tech Lead Mentoring',
      'Softwareentwicklung',
      'Softwarearchitektur',
      'Software Engineering',
      'Softwareprojektmanagement',
      'Engineering Leadership',
      'Karriereentwicklung'
    ],
    sameAs: [
      'https://www.linkedin.com/in/gregor-woiwode/',
      'https://github.com/GregOnNet',
      'https://g.dev/gregor'
    ]
  },
  organization: {
    logoPath: '/logo.svg',
    sameAs: [
      'https://www.youtube.com/@entwicklungszeit',
      'https://creators.spotify.com/pod/show/entwicklungszeit',
      'https://podcasts.apple.com/us/podcast/entwicklungszeit/id1767631664'
    ]
  },
  areaServed: {
    countries: ['DE', 'AT', 'CH'],
    cities: ['Leipzig']
  },
  locale: 'de-DE'
};
