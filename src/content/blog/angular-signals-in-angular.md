---
title: 'Signals in Angular: Ein praktischer Einstieg'
description: 'Signals verändern, wie Angular Change Detection denkt. Ein praktisches Beispiel für die Migration eines klassischen Property-Bindings.'
category: angular
pubDate: 2025-05-12
---

Signals sind Angulars Antwort auf feingranulare Reaktivität ohne die
Overhead-Kosten der klassischen, Zone.js-basierten Change Detection. Hier ein
praktischer Einstieg anhand einer kleinen Migration.

## Vorher: Klassische Property mit manueller Change Detection

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <button (click)="increment()">Zähler: {{ count }}</button>
  `,
})
export class CounterComponent {
  @Input() start = 0;
  count = this.start;

  increment() {
    this.count++;
  }
}
```

Das Problem: Angular weiß nicht *gezielt*, dass sich nur `count` geändert
hat. Es prüft bei jeder Änderungserkennung den gesamten Component-Baum.

## Nachher: Signal-basierte Reaktivität

```ts
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <button (click)="increment()">Zähler: {{ count() }}</button>
  `,
})
export class CounterComponent {
  start = input(0);
  count = signal(this.start());

  increment() {
    this.count.update(value => value + 1);
  }
}
```

Der Unterschied im Diff macht die Verschiebung sichtbar:

```diff
- @Input() start = 0;
- count = this.start;
+ start = input(0);
+ count = signal(this.start());

  increment() {
-   this.count++;
+   this.count.update(value => value + 1);
  }
```

Mit `signal()` weiß Angular exakt, welcher Teil des Templates von welcher
Datenquelle abhängt – Change Detection kann feingranular statt über den
ganzen Baum arbeiten.

## Migrationsstrategie für bestehende Projekte

1. Beginne bei Leaf-Components ohne komplexe `@Input`/`@Output`-Verzahnung.
2. Migriere `@Input()` zu `input()`, bevor du internen State auf `signal()`
   umstellst – das reduziert die Zahl gleichzeitiger Änderungen.
3. Nutze `computed()` für abgeleiteten State, statt ihn manuell in Methoden
   zu berechnen.

Mehr dazu in der Podcast-Folge
["Angular Signals Deep Dive"](/podcast/folge-003-angular-signals-deep-dive).
