import { describe, expect, it } from 'vitest';
import {
  blogPostingNode,
  breadcrumbNode,
  faqNode,
  graph,
  offerNode,
  organizationNode,
  personId,
  personNode,
  podcastEpisodeNode,
  serializeJsonLd,
  serviceNode,
  videoObjectNode,
  webPageNode,
  websiteNode,
  youtubeVideoId
} from './public-api';

describe('jsonLd', () => {
  it('references provider and brand by @id that exist in the base graph', () => {
    const service = serviceNode({
      path: '/angebote/x',
      name: 'X',
      description: 'd',
      serviceType: 't',
      audience: 'a',
      offers: []
    });
    const ids = [personNode(), organizationNode(), websiteNode()].map(n => n['@id']);

    expect(ids).toContain((service.provider as { '@id': string })['@id']);
    expect(ids).toContain((service.brand as { '@id': string })['@id']);
    expect((service.provider as { '@id': string })['@id']).toBe(personId);
  });

  it('models prices as numbers excluding VAT', () => {
    const offer = offerNode({ name: 'n', description: 'd', amount: 120, unitCode: 'HUR', url: 'u' });
    const spec = offer.priceSpecification as Record<string, unknown>;

    expect(offer.price).toBe(120);
    expect(spec.valueAddedTaxIncluded).toBe(false);
    expect(spec.unitCode).toBe('HUR');
  });

  it('numbers breadcrumb positions without gaps and uses absolute urls', () => {
    const crumbs = breadcrumbNode('/a/b', [
      { name: 'Start', path: '/' },
      { name: 'A', path: '/a' },
      { name: 'B', path: '/a/b' }
    ]);
    const items = crumbs.itemListElement as { position: number; item: string }[];

    expect(items.map(i => i.position)).toEqual([1, 2, 3]);
    expect(items[2].item).toBe('https://entwicklungszeit.dev/a/b/');
  });

  it('flattens array answers in FAQ nodes to strings', () => {
    const node = faqNode('/p', [{ question: 'q', answer: ['a', 'b'] }]);
    const [question] = node.mainEntity as { acceptedAnswer: { text: string } }[];

    expect(question.acceptedAnswer.text).toBe('a\nb');
  });

  it('escapes < so a closing script tag cannot break out', () => {
    const json = serializeJsonLd(graph({ '@type': 'Thing', name: '</script><b>' }));

    expect(json).not.toContain('<');
    expect(JSON.parse(json)['@graph'][0].name).toBe('</script><b>');
  });

  it('builds a BlogPosting that points at author and publisher by @id with ISO dates', () => {
    const post = blogPostingNode({
      path: '/blog/x',
      headline: 'h',
      description: 'd',
      datePublished: new Date('2025-03-01T00:00:00Z')
    });

    expect((post.author as { '@id': string })['@id']).toBe(personId);
    expect(post.datePublished).toBe('2025-03-01T00:00:00.000Z');
    expect(post.dateModified).toBe(post.datePublished);
    expect(post).not.toHaveProperty('image');
  });

  it('links a PodcastEpisode to its series and omits missing media and guest', () => {
    const episode = podcastEpisodeNode({
      path: '/podcast/f',
      seriesId: 'series-id',
      name: 'n',
      description: 'd',
      episodeNumber: 3,
      datePublished: new Date('2025-01-01T00:00:00Z')
    });

    expect(episode.partOfSeries).toEqual({ '@id': 'series-id' });
    expect(episode).not.toHaveProperty('associatedMedia');
    expect(episode).not.toHaveProperty('actor');
  });

  it('extracts YouTube ids and skips the VideoObject without one', () => {
    expect(youtubeVideoId('https://www.youtube.com/watch?v=abc')).toBe('abc');
    expect(youtubeVideoId('https://youtu.be/xyz')).toBe('xyz');
    expect(
      videoObjectNode({
        name: 'n',
        description: 'd',
        uploadDate: new Date(),
        youtubeUrl: 'https://www.youtube.com/@entwicklungszeit',
        thumbnailUrl: 't'
      })
    ).toBeUndefined();
  });

  it('gives the home page no breadcrumb reference', () => {
    expect(webPageNode({ path: '/', name: 'n', description: 'd' })).not.toHaveProperty('breadcrumb');
  });
});
