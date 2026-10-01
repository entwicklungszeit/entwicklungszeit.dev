import type { JsonLdNode } from './types';

export function graph(...nodes: JsonLdNode[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

// `<` wird escaped, damit ein `</script>` im Text das Markup nicht bricht.
// Astro escaped `set:html` nicht selbst.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
