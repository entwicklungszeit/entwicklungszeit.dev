import type { ComparisonGroup, ComparisonLabels } from '../types/comparison';

export const careerPaths = [
  {
    label: 'Festanstellung',
    figure: 'ca. 100.000 €',
    figureNote: 'Jahresgehalt brutto',
    description:
      'In einem Unternehmen sind 100.000 € brutto auch in Deutschland realistisch. Voraussetzung ist, dass du Verantwortung übernimmst, Entscheidungen mitprägst und dein Urteilsvermögen sichtbar machst.'
  },
  {
    label: 'Freelance',
    figure: 'bis 200.000 €',
    figureNote: 'Jahresumsatz, nicht Netto',
    description:
      'Als Freelancer ist ein Umsatz von 200.000 € gut erreichbar. Davon bleibt weniger übrig als bei einem Gehalt in derselben Höhe, denn Steuern und Abgaben sind ein anderes Thema. Entscheidend ist, dass Kunden dich für deine Wirkung buchen und nicht für deine Stunden.'
  }
];

export const careerPathsDisclaimer =
  'Das sind Größenordnungen, die möglich sind, kein Ergebnisversprechen. Was für dich realistisch ist, hängt von deiner Ausgangslage ab und ist Teil des Erstgesprächs.';

export const focusFields = [
  {
    label: 'Feld 1',
    title: 'Technische Tiefe',
    description:
      'Häufig fehlt es nicht an Talent, sondern an Routine in Sprache, Framework und Werkzeugen. Wer die Grundlagen automatisiert hat, arbeitet effektiver. Das sind meist Dinge, die du schnell in den Arbeitsalltag bringst und die schnell Ergebnisse zeigen.',
    topics: [
      'Framework- und Sprachkenntnis, um Probleme einfacher zu lösen',
      'Einfache Teststrategien für bessere Qualität',
      'Bestehende Automatisierung im Unternehmen verstehen und verbessern',
      'Lernroutinen, die nicht jedes Mal zehn Stunden Vorlauf brauchen',
      'Clean Code & Architektur',
      'Code Reviews und Architektur Dojos',
      'Technische Dokumentation'
    ]
  },
  {
    label: 'Feld 2',
    title: 'Produkt- und Unternehmenskontext',
    description:
      'Viele haben einen sehr guten Blick auf ihre eigene Perspektive, etwa Datenbank, Oberfläche oder Backend. Wie das Produkt beim Kunden eingesetzt wird und wo die besten Hebel liegen, ist eine andere Welt. Wir schauen strategisch, wie du Einblick in die Entscheidungsebenen bekommst und ein Teil davon wirst.',
    topics: [
      'Produkt und Kundeneinsatz verstehen',
      'Hebel für Produktweiterentwicklung erkennen',
      'Zugang zu Entscheidungsebenen bekommen',
      'Anforderungsanalyse',
      'Stakeholder Management',
      'Deine Karriere entwickeln & Personal Branding',
      'Design Thinking, Problem Solving, Innovation Workshops'
    ]
  },
  {
    label: 'Feld 3',
    title: 'Soft Skills',
    description:
      'Wer mehr Verantwortung übernimmt, wird an Kommunikation und Wirkung gemessen. Diese Fähigkeiten sind entwickelbar und rechtfertigen am Ende das höhere Gehalt oder den höheren Tagessatz.',
    topics: [
      'Kommunikation, Rhetorik und Präsentationstechniken',
      'Persönlichkeits- & Kommunikationstypen',
      'Konfliktmanagement',
      'Stressbewältigung und emotionale Gelassenheit',
      'Leadership in technischen Teams',
      'Mitarbeiterentwicklung, Moderation und agile Methoden'
    ]
  }
];

export const programSteps = [
  {
    week: 'Vorab',
    title: 'Kennenlerngespräch: 60 bis 90 Minuten',
    description:
      'Ich höre dir zu und verstehe deine Situation. Danach sage ich dir ehrlich, ob ich helfen kann und wie. Erste Empfehlungen bekommst du in jedem Fall, auch wenn du danach allein weitergehst. Bei Berufseinsteigern nehme ich mir noch mehr Zeit und schicke dir anschließend einen Strategievorschlag.'
  },
  {
    week: 'Woche 1-2',
    title: 'Analyse: Ausgangslage und Ziele',
    description:
      'Wir klären, wo du stehst und was du erreichen willst, setzen messbare Ziele und legen fest, wie stark wir Mentoring und Coaching gewichten. In diesen ersten zwei Wochen kannst du ohne Angabe von Gründen abbrechen und bekommst dein Honorar zurück.'
  },
  {
    week: 'Woche 3-11',
    title: 'Praxisphase: 1 bis 2 Sessions pro Woche',
    description:
      'Je nach Bedarf arbeiten wir an Hard Skills (Mentoring) oder an Strategie und Soft Skills (Coaching) und setzen das Gelernte direkt in deinem Arbeitsalltag um.'
  },
  {
    week: 'Woche 12',
    title: 'Bilanz: Was bleibt',
    description:
      'Wir werten aus, was sich verändert hat, und legen fest, wie du auf eigenen Beinen weitermachst.'
  }
];

export const sessionFormat = [
  {
    title: 'Vorab geplant',
    description:
      'Wir stimmen die Termine im Voraus ab. Pro Woche gibt es 1 bis 2 Sessions von je 60 Minuten. Wenn du zum Coden oder Modellieren mehr Zeit brauchst, machen wir auch mal 2 Stunden daraus.'
  },
  {
    title: 'Mit Agenda',
    description: 'Jede Session hat eine Agenda und wir nutzen die Zeit fokussiert.'
  },
  {
    title: 'Vor- und Nachbereitung',
    description:
      'Ich bereite jede Session vor und arbeite sie danach nach. Du bekommst die Aufzeichnung und kannst in Ruhe alles nachvollziehen.'
  }
];

export const termsHighlights = [
  '12 Wochen, 12 bis 24 Sessions (1 bis 2 pro Woche)',
  'Live-Sessions von 60 Minuten, bei Bedarf länger',
  'Vor- und Nachbereitung durch mich, Aufzeichnung jeder Session',
  'Erreichbarkeit zwischen den Sessions'
];

export const termsDetails = [
  {
    label: 'Zahlung',
    text: 'Sofort bei Rechnungserhalt, keine Ratenzahlung.'
  },
  {
    label: 'Rückerstattung',
    text: 'Innerhalb der ersten 2 Wochen kannst du ohne Angabe von Gründen abbrechen und bekommst das volle Honorar zurück.'
  },
  {
    label: 'Steuerlich',
    text: 'Das Programm ist Fort- und Weiterbildung und damit eine Betriebsausgabe.'
  }
];

export const discoveryCallUrl = 'https://calendly.com/gregor-entwicklungszeit/austausch-kennenlernen';

const sparringHourlyRateAmount = 120;

export const programPrice = { amount: 3600, currency: 'EUR' };

export const formatEuro = (amount: number) =>
  `${new Intl.NumberFormat('de-DE').format(amount)} €`;

// Sichtbarer Ortsbezug; JSON-LD nennt dieselbe Region in siteIdentity.areaServed.
export const localReach = {
  city: 'Leipzig',
  badge: 'Online und vor Ort in Leipzig',
  text: 'Ich arbeite online im gesamten DACH-Raum und auf Wunsch vor Ort im Raum Leipzig.'
};

export const sparring = {
  hourlyRateAmount: sparringHourlyRateAmount,
  hourlyRate: formatEuro(sparringHourlyRateAmount),
  rateNote: 'netto zzgl. USt. pro Stunde',
  special: 'Die erste Stunde ist kostenfrei.',
  intro:
    'Du stehst vor einer Veränderung und brauchst jemanden von außen, der so etwas schon oft begleitet hat? Im Sparring denken wir gemeinsam laut, schaffen Klarheit und entwickeln einen strategischen Weg.',
  audience:
    'Für alle, die vor einer Veränderung stehen und einen außenstehenden Sparringspartner mit Erfahrung suchen.',
  changeTypes: [
    'Systemische Veränderung',
    'Architektonische Veränderung',
    'Technologische Veränderung',
    'Organisatorische Veränderung',
    'Strukturelle Veränderung im Team'
  ],
  topics: [
    'Software-Architektur',
    'Software Engineering',
    'Softwareprojektmanagement',
    'Mentoring für Entwickler:innen'
  ],
  background:
    'Ich war über neun Jahre CTO, neben meiner Arbeit als Softwarearchitekt und Entwickler, und bin heute CIO. Ich kann dich vom Entwickler bis zur Führungskraft beraten.',
  process: [
    'Wir sprechen die Situation gemeinsam durch, Stunde für Stunde.',
    'Nach der kostenfreien Stunde entscheiden wir: Wollen wir weitermachen, und wenn ja, wie lange?',
    'Abgerechnet wird genau die vereinbarte Zeit, also nach tatsächlichem Bedarf.',
    'Du bekommst eine Nachbereitung mit meinen Empfehlungen, bei offenen Fragen auch mit einer Nachrecherche von mir.'
  ],
  freeHourNote:
    'Die kostenfreie Stunde gibt es einmal. Ist dein Problem danach gelöst, ist das genau richtig so.'
};

export const comparisonLabels: ComparisonLabels = {
  ours: 'Entwicklungszeit',
  others: 'Andere Anbieter'
};

export const comparisonGroups: ComparisonGroup[] = [
  {
    title: 'Handwerk und Persönlichkeit',
    rows: [
      {
        title: 'Technische Skills',
        description: 'Architektur, Code-Qualität, belastbare Entscheidungen',
        ours: true,
        others: false
      },
      {
        title: 'Kommunikative Skills',
        description: 'Erklären, Konflikte klären, Stakeholder mitnehmen',
        ours: true,
        others: false
      },
      {
        title: 'Strategische Skills',
        description: 'Die richtigen Dinge tun und Rückhalt dafür bekommen',
        ours: true,
        others: false
      },
      {
        title: 'Teams auf dem Weg zum Erfolg begleiten',
        description: 'Nicht nur Einzelne, auch das Team dahinter',
        ours: true,
        others: false
      }
    ]
  },
  {
    title: 'Markt und Vermarktung',
    rows: [
      {
        title: 'Hilfe beim Markenaufbau',
        description: 'Als Freelancer eine eigene Marke entwickeln',
        ours: true,
        others: true
      },
      {
        title: 'Marketing- und Vertriebsfokus',
        description: 'Positionierung und Akquise als Kern des Programms',
        ours: false,
        others: true
      },
      {
        title: '„Bezahlt für Ergebnisse, nicht für Zeit“',
        description: 'Das Abrechnungsmodell als Kernversprechen',
        ours: false,
        others: true
      }
    ]
  },
  {
    title: 'Haltung',
    rows: [
      {
        title: 'Wachstum zuerst, Einkommen als Folge',
        description: 'Höheres Einkommen ergibt sich aus echter Stärke',
        ours: true,
        others: false
      },
      {
        title: 'Schnell mehr Geld als Hauptziel',
        description: 'Wer nur das will, ist bei mir falsch',
        ours: false,
        others: true
      }
    ]
  }
];
