import { pageNodeId } from './urls';
import type { JsonLdNode } from './types';

// Minimale Form, die der Builder braucht. `FaqItem` aus src/types/faq erfüllt sie strukturell.
type FaqEntry = { question: string; answer: string | string[] };

const answerText = (answer: FaqEntry['answer']) =>
  (Array.isArray(answer) ? answer : [answer]).join('\n');

export function faqNode(path: string, faqs: FaqEntry[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': pageNodeId(path, 'faq'),
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: answerText(faq.answer) }
    }))
  };
}
