---
title: 'Standalone Components: Eine pragmatische Migrationsstrategie'
description: 'NgModules schrittweise loswerden, ohne das ganze Team für zwei Wochen auszubremsen. Eine Reihenfolge, die sich in der Praxis bewährt hat.'
category: angular
pubDate: 2025-05-28
status: draft
---

Standalone Components sind seit einigen Angular-Versionen der empfohlene
Weg – trotzdem laufen viele bestehende Projekte noch komplett auf NgModules.
Der Umstieg muss kein Big-Bang-Rewrite sein.

## Die Reihenfolge, die funktioniert

1. **Neue Features standalone bauen.** Kein Zwang, Bestehendes sofort
   anzufassen – aber jede neue Component entsteht standalone.
2. **Blattknoten zuerst migrieren.** Components ohne viele Abhängigkeiten
   innerhalb des Moduls sind risikoarm und liefern schnell Lernerfahrung.
3. **Shared Modules zuletzt.** Module, die von vielen Feature-Bereichen
   genutzt werden, migrierst du erst, wenn das Team Routine mit dem Muster
   hat.

## Ein typischer Stolperstein

Viele Teams unterschätzen, wie viele implizite Abhängigkeiten über
`NgModule`-Imports "mitgeschleppt" wurden. Beim Umstieg auf `imports: []` in
der `@Component`-Dekoration werden diese plötzlich sichtbar – das ist
unbequem, aber im Kern eine Qualitätsverbesserung: explizite statt versteckte
Abhängigkeiten.

## Wann sich der Aufwand lohnt

Nicht jedes Projekt profitiert gleich stark. Der Umstieg lohnt sich
besonders, wenn:

- ihr ohnehin bald auf neuere Angular-Versionen upgraded,
- Bundle-Größe / Lazy-Loading-Granularität ein echtes Problem sind,
- neue Teammitglieder regelmäßig durch NgModule-Verzahnung verwirrt werden.

Ist keiner dieser Punkte akut, ist ein schrittweiser, featuregetriebener
Umstieg (Punkt 1 oben) meist der pragmatischste Weg.
