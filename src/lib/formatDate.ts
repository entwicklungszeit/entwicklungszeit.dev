const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
