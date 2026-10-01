# JSON-LD

Builders for the structured data that every page of this site ships to search engines.

## What is JSON-LD and why do we have it?

A search engine reads the HTML of a page the way a person skims it: it sees text and has to guess what it means. Is "120 €" a price? Who offers it? For whom?

JSON-LD ("JSON for Linked Data") states this explicitly, in a machine-readable block that sits next to the visible page:

```html
<script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "Service", "name": "Sparring", "offers": { "@type": "Offer", "price": 120, "priceCurrency": "EUR" } }
</script>
```

The vocabulary comes from [schema.org](https://schema.org). `@type` says what a thing is (`Person`, `Service`, `Offer`), the other keys are its properties. The block is invisible to visitors and does not change how the page looks.

What it buys us:

- Google can connect the pages to entities: Gregor Woiwode (person), Entwicklungszeit (organization), the two offers with price and audience.
- Breadcrumbs can show up in search results.
- Other consumers (AI search, link previews, aggregators) read the same facts instead of guessing.

What it does **not** buy us: a guaranteed rich snippet. Google has no dedicated rich result for `Service`, `Offer` or `FAQPage` on a site like this. Breadcrumbs and Organization are the most likely visible effects. The rest is about being understood correctly.

## Ground rules

1. **Markup must match the visible page.** Google ignores or penalises markup for content visitors cannot see. Prices, names and descriptions therefore come from the same data files the page renders (`src/data/coaching.ts`, `navigation.ts`, `faqData.ts`), never from retyped strings.
2. **One `<script>` per page, one `@graph` inside it.** Nodes link to each other by `@id` instead of nesting copies.
3. **No reviews or ratings.** Google does not show self-published reviews of your own organization.

## How the pieces fit together

Every page renders one graph. The layout adds the site-wide nodes, the page adds its own:

```
Layout.astro  ──►  Person · Organization · WebSite      (on every page)
page.astro    ──►  WebPage · Service · Offer · …        (passed via the `schema` prop)
```

Nodes reference each other by `@id`, for example a `Service` points to its provider with `{ "@id": "https://entwicklungszeit.dev/#gregor-woiwode" }`. The `@id` is just a stable name, it does not have to be a reachable URL. A reference only resolves inside the same document, which is why the layout includes the base nodes on every page.

```
WebSite ◄── isPartOf ── WebPage ──► mainEntity ──► Service ──► provider ──► Person
                           │                          │                        ▲
                           └── breadcrumb             └── offers (Offer)       │
                                                      Organization ── founder ──┘
```

## What is applied where

The markup of each page is defined in `src/data/jsonld/<page>-jsonld.ts`.

| Page | Nodes added on top of Person, Organization, WebSite |
|---|---|
| `/` | none |
| `/angebote` | `CollectionPage` with an `ItemList` of both offers, `BreadcrumbList` |
| `/angebote/entwickler-mit-wirkung` | `WebPage`, `Service` (12-week programme, 3.600 € net, three focus areas as `OfferCatalog`), `FAQPage`, `BreadcrumbList` |
| `/angebote/sparring` | `WebPage`, `Service` with two `Offer`s (120 € net per hour, first hour free), topics as `OfferCatalog`, `BreadcrumbList` |
| `/podcast` | `PodcastSeries`, `CollectionPage`, `BreadcrumbList` |

All other pages currently only carry the base graph.

Prices are `UnitPriceSpecification` with `valueAddedTaxIncluded: false`, because the site quotes net prices. `areaServed` is DE, AT and CH plus the city Leipzig (offers are online and on site around Leipzig, see `localReach` in `src/data/coaching.ts`, which the pages render as visible text). There is deliberately no postal address.

## Module layout

| File | Responsibility |
|---|---|
| `public-api.ts` | The only import surface, available as `@json-ld` (see `tsconfig.json`) |
| `urls.ts` | Base URL, `absoluteUrl`, the fixed `@id`s, `pageNodeId` |
| `identity.ts` | `personNode`, `organizationNode`, `websiteNode` (facts live in `src/data/siteIdentity.ts`) |
| `service.ts` | `serviceNode` |
| `offer.ts` | `offerNode`, `offerCatalogNode` |
| `page.ts` | `webPageNode`, `breadcrumbNode`, `itemListNode` |
| `faq.ts` | `faqNode` |
| `document.ts` | `graph` (wraps nodes with `@context`/`@graph`), `serializeJsonLd` |
| `types.ts` | `JsonLdNode`, `ref`, `optional` |

`src/components/JsonLd.astro` renders a graph as a script tag. The layout does this for you.

## Adding or changing markup

Each page keeps its markup in its own file in `src/data/jsonld/` (for example `sparring-jsonld.ts`). The file exports the page's `title`, `description` and `schema`, and the page only passes them on. The files live outside `src/pages/` on purpose: a `.ts` file there would become a route.

New offer page, in short:

```ts
// src/data/jsonld/neues-angebot-jsonld.ts
import { breadcrumbNode, offerNode, ref, serviceId, serviceNode, webPageNode } from '@json-ld';

const path = '/angebote/neues-angebot';
const title = '…';
const description = '…';

export const neuesAngebotPage = {
  title,
  description,
  schema: [
    webPageNode({ path, name: title, description, mainEntity: ref(serviceId(path)) }),
    serviceNode({ path, name: '…', description, serviceType: '…', audience: '…', offers: [offerNode({ /* … */ })] }),
    breadcrumbNode(path, [
      { name: 'Start', path: '/' },
      { name: 'Angebote', path: '/angebote' },
      { name: '…', path }
    ])
  ]
};
```

```astro
---
import { neuesAngebotPage } from '../../data/jsonld/neues-angebot-jsonld';
const { title, description, schema } = neuesAngebotPage;
---

<Layout title={title} description={description} schema={schema}>
```

Things to keep in mind:

- **Trailing slash.** Page URLs end in `/`, matching canonical and sitemap. `absoluteUrl` handles it; do not concatenate URLs by hand.
- **Escaping.** `serializeJsonLd` escapes `<`, so a `</script>` inside a text cannot break out of the tag. Astro's `set:html` does not escape on its own.
- **Facts about Gregor or the brand** (links, job title, regions) are data in `src/data/siteIdentity.ts`, not code.
- **A new schema.org type** gets its own builder in the file that fits its topic, and is exported through `public-api.ts`.

## Checking your work

- `npm test` runs `jsonLd.test.ts` (references resolve, prices are numbers, escaping, breadcrumb order).
- After `npm run build`, open `dist/<page>/index.html`; the block is in the `<head>`.
- Validate deployed pages with [validator.schema.org](https://validator.schema.org) (is it valid schema.org?) and Google's [Rich Results Test](https://search.google.com/test/rich-results) (does Google understand it?).
