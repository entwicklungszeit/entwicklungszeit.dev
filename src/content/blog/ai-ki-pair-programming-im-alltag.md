---
title: 'KI-Pair-Programming im Alltag: Ein ehrlicher Zwischenstand'
description: 'Wo KI-Assistenten beim Programmieren wirklich Zeit sparen, wo sie bremsen – und ein kleines Code-Beispiel für einen sinnvollen Review-Kniff.'
category: ai
pubDate: 2025-03-01
---

KI-Coding-Assistenten sind mittlerweile fester Bestandteil vieler
Entwickler-Workflows. Der Alltag zeigt aber ein differenzierteres Bild als
die Marketing-Versprechen.

## Wo es wirklich hilft

- **Boilerplate & Wiederholung**: Tests für offensichtliche Fälle,
  Typdefinitionen aus Beispieldaten, Migrationsskripte.
- **Erste Entwürfe**: Ein grober erster Wurf, den du danach gezielt
  überarbeitest, ist oft schneller als eine leere Datei.
- **Erklären von fremdem Code**: Besonders hilfreich beim Einstieg in
  unbekannte Codebasen.

## Wo es (noch) bremst

- Architekturentscheidungen mit langfristigen Konsequenzen
- Code, der stark von ungeschriebenem Domänenwissen abhängt
- Sicherheitskritische Logik ohne gründlichen menschlichen Review

## Ein kleiner Review-Kniff

Ein einfacher, aber wirksamer Trick: Lass dir von der KI nicht nur den Code
generieren, sondern explizit auch die Annahmen auflisten, die sie dabei
getroffen hat.

```ts
// Prompt: "Implementiere eine Funktion, die Nutzer nach Aktivität filtert.
// Liste am Ende in Kommentaren die getroffenen Annahmen auf."

interface User {
  id: string;
  lastActiveAt: Date;
}

// Annahmen:
// - "aktiv" bedeutet: lastActiveAt innerhalb der letzten 30 Tage
// - Zeitzonen werden ignoriert (UTC wird angenommen)
// - Nutzer ohne lastActiveAt gelten als inaktiv
function filterActiveUsers(users: User[], now: Date = new Date()): User[] {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  return users.filter(user => {
    if (!user.lastActiveAt) return false;
    return now.getTime() - user.lastActiveAt.getTime() <= THIRTY_DAYS_MS;
  });
}
```

Die Annahmen-Liste macht in Sekunden sichtbar, ob die generierte Lösung zu
deinem tatsächlichen Domänenverständnis passt – und spart dir damit genau
die Reviewzeit, die KI-Tools eigentlich versprechen.

Mehr dazu in der Podcast-Folge
["KI im Entwickleralltag"](/podcast/folge-002-ki-im-entwickleralltag).
