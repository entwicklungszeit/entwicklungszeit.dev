export type JsonLdNode = Record<string, unknown>;

// Verweis auf einen Knoten im selben @graph.
export const ref = (id: string) => ({ '@id': id });

// Nimmt die Property nur auf, wenn ein Wert da ist (0 und false bleiben erhalten).
export const optional = (key: string, value: unknown): JsonLdNode =>
  value === undefined || value === null || value === '' ? {} : { [key]: value };
