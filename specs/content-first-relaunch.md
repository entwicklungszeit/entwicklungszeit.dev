# Content-First Relaunch: Entwicklungszeit.dev

## Problem Statement

Die Seite entwicklungszeit.dev ist heute primär auf den Verkauf eines Coachings ausgerichtet (Sales-Hero, Sales-CTAs, Testimonial-Dramaturgie auf der Startseite). Gregor möchte weg von diesem Vertriebszwang und die Seite stattdessen zu einer Content-Plattform machen, die seine Podcast-Episoden ("Entwicklungszeit") und Blogartikel über Kommunikation, Führung, AI Engineering und Angular in den Mittelpunkt stellt, um die Dev-Community zu stärken. Das bestehende Coaching-Angebot soll weiterhin auffindbar sein, aber nicht mehr die Startseite dominieren, und ohne aggressive Verkaufsmechanik auftreten.

## Solution

Die Seite wird um zwei neue Content-Bereiche erweitert – einen Blog (Astro Content Collection, Kategorien Leadership/Kommunikation/AI/Angular, Code-Beispiele via `astro-expressive-code`) und einen eigenständigen Podcast-Bereich (Astro Content Collection pro Episode mit Shownotes, RSS bleibt Quelle für neue Folgen). Die Startseite wird von einer Sales-Landingpage zu einer Content-Startseite umgebaut: kurze Positionierungs-Sektion, darunter gleichwertige Sektionen für neueste Artikel und neueste Folgen, plus ein neutraler Newsletter-Hinweis. Das Coaching-Angebot zieht auf eine eigene, ruhige Unterseite um (Zielgruppe: Entwickler auf dem Weg zu 80k–200k Jahresgehalt), ohne Sales-CTAs, aber mit einem einzeiligen Kontaktweg. Die bestehende Konfliktkommunikations-Produktseite bleibt unverändert bestehen; der zugehörige E-Mail-Kurs-Funnel wird entfernt. Diese Spec deckt Struktur & Content-Fundament ab; ein separater visueller Feinschliff (`/design`) folgt danach auf Basis des bestehenden Themes.

## User Stories

1. Als Website-Besucher möchte ich auf der Startseite sofort verstehen, wofür Entwicklungszeit steht (Kommunikation, Führung, AI-Wandel der Branche), damit ich weiß, ob der Inhalt für mich relevant ist.
2. Als Website-Besucher möchte ich auf der Startseite die neuesten Blogartikel sehen, damit ich direkt in aktuelle Inhalte einsteigen kann.
3. Als Website-Besucher möchte ich auf der Startseite die neuesten Podcast-Folgen sehen, damit ich das Hauptformat der Seite sofort entdecke.
4. Als Website-Besucher möchte ich über die Hauptnavigation direkt zu Blog, Podcast, Coaching und Kontakt springen können, damit ich nicht suchen muss.
5. Als Leser möchte ich eine Blog-Übersichtsseite mit allen Artikeln, damit ich stöbern kann.
6. Als Leser möchte ich Artikel nach Kategorie (Leadership, Kommunikation, AI, Angular) filtern können, damit ich gezielt zu meinem Interessensgebiet komme.
7. Als Leser möchte ich, dass jeder Artikel genau einer Kategorie zugeordnet ist, damit die Einordnung eindeutig bleibt.
8. Als Leser eines technischen Artikels möchte ich Code-Beispiele mit Syntax-Highlighting, Zeilennummern und Copy-Button sehen, damit ich sie gut lesen und übernehmen kann.
9. Als Leser möchte ich pro Artikel Titel, Beschreibung, Veröffentlichungsdatum und Kategorie sehen, damit ich den Inhalt einordnen kann.
10. Als Autor (Gregor) möchte ich neue Artikel als Markdown/MDX-Dateien mit definiertem Frontmatter anlegen können, damit ich ohne CMS publizieren kann.
11. Als Autor möchte ich, dass ein Artikel mit ungültigem oder unvollständigem Frontmatter den Build fehlschlagen lässt, damit fehlerhafte Inhalte nicht live gehen.
12. Als Website-Besucher möchte ich eine Podcast-Übersichtsseite mit allen Episoden, damit ich durch die Historie stöbern kann.
13. Als Website-Besucher möchte ich eine eigene Seite pro Episode mit Shownotes und Timestamps, damit ich Details zur Folge nachlesen kann.
14. Als Website-Besucher möchte ich von einer Episodenseite auf thematisch verwandte Blogartikel verlinkt werden (und umgekehrt), damit ich vertiefen kann.
15. Als Gregor möchte ich, dass neue Podcast-Folgen weiterhin über den bestehenden RSS-Feed erkannt werden, damit ich den Veröffentlichungsprozess nicht duplizieren muss.
16. Als Gregor möchte ich zu einer per RSS erkannten neuen Folge eine Content-Collection-Episodenseite mit Shownotes ergänzen können, damit die Folge einen redaktionellen Auftritt bekommt.
17. Als karriereorientierter Entwickler möchte ich eine eigene Coaching-Seite finden, die klar beschreibt, wem sie hilft (Entwickler Richtung 80k–200k Jahresgehalt) und wie (technisch und strategisch), damit ich einschätzen kann, ob das Angebot zu mir passt.
18. Als Besucher der Coaching-Seite möchte ich keine Verkaufsdruck-Elemente (Countdown, aufdringliche Formulare, Verkaufs-Testimonial-Dramaturgie) sehen, damit die Seite sich informativ statt verkäuferisch anfühlt.
19. Als Besucher der Coaching-Seite möchte ich trotzdem einen ruhigen, klaren Kontaktweg (z.B. Mailto-Link) am Ende der Seite finden, damit ich bei Interesse reagieren kann.
20. Als Besucher der Coaching-Seite möchte ich die bestehenden Testimonials sehen, damit ich Vertrauen in das Angebot aufbauen kann.
21. Als Interessent für Konfliktkommunikation möchte ich weiterhin die bestehende Produktseite `/konfliktkommunikation` unverändert vorfinden, damit dieses etablierte Angebot nicht gestört wird.
22. Als Website-Betreiber möchte ich, dass die Unterseite `/konfliktkommunikation/email-kurs` und ihre Route entfernt werden, damit der veraltete E-Mail-Kurs-Funnel nicht mehr erreichbar ist.
23. Als Website-Besucher möchte ich mich für einen allgemeinen Content-Newsletter ("Neue Artikel & Folgen per Mail") eintragen können, der klar getrennt vom alten Coaching-E-Mail-Kurs ist, damit ich informiert bleibe, ohne in einen Sales-Funnel zu geraten.
24. Als Website-Betreiber möchte ich, dass die Newsletter-Eintragung im Frontend so gebaut ist, dass sie an einen extern konfigurierten Endpunkt (Brevo) angebunden werden kann, damit ich die Automatisierung selbst in Brevo einrichten kann.
25. Als Website-Besucher möchte ich, dass Footer-Links (Impressum, Datenschutz) weiterhin wie bisher erreichbar sind, damit sich an rechtlich notwendigen Pfaden nichts Unerwartetes ändert.
26. Als Website-Besucher möchte ich, dass die neue Struktur auf dem bestehenden visuellen Theme (Farben, Tailwind-Konfiguration, Komponentenstil) aufbaut, damit die Seite bis zum späteren Design-Pass konsistent wirkt.
27. Als Gregor möchte ich zu Beginn 1–2 Platzhalterartikel pro Kategorie und eine minimale Menge an Beispiel-Episodeninhalten vorfinden, damit ich die Struktur sehen und direkt mit echten Inhalten weiterarbeiten kann.
28. Als Entwickler am Projekt möchte ich, dass ein fehlerhafter Blogartikel oder eine fehlerhafte Episodenseite (falsche Kategorie, fehlendes Pflichtfeld) den Astro-Build hart abbrechen lässt, damit Fehler vor dem Deploy auffallen.

## Implementation Decisions

- **Neue Content Collections**: `blog` (Artikel) und `podcast` (Episoden), definiert über Astro Content Collections mit Zod-Schema in `src/content/config.ts` (oder äquivalent nach aktueller Astro-5-Konvention).
  - `blog`-Schema: `title`, `description`, `category` (Enum: `leadership` | `kommunikation` | `ai` | `angular`), `pubDate`, optional `updatedDate`, optional `coverImage`, optional `draft` (boolean, default `false`), optional `relatedEpisodes` (Referenzen/Slugs).
  - `podcast`-Schema: `title`, `episodeNumber` oder `slug`-Identifikator, `pubDate`, `audioUrl`/`youtubeUrl` (aus RSS übernommen), `shownotes` (Markdown-Body), optional `guest`, optional `relatedPosts` (Referenzen/Slugs).
  - Kategorie ist ein einzelnes Pflichtfeld pro Artikel (keine Mehrfach-Tags).
- **Code-Beispiele**: Integration von `astro-expressive-code` als Markdown/MDX-Rendering-Plugin für den `blog`-Content-Type (Zeilennummern, Diff-Darstellung, Copy-Button, Dateiname-Frame). Keine Live-Playgrounds, keine externen Embeds (StackBlitz/CodeSandbox) als Standard.
- **Routing/Seiten**:
  - `/blog` (Übersicht mit Kategorie-Filter), `/blog/[slug]` (Artikeldetail), optional `/blog/kategorie/[category]`.
  - `/podcast` (Episodenübersicht), `/podcast/[slug]` (Episodendetail mit Shownotes).
  - `/coaching` als neue, eigenständige Coaching-Seite (ersetzt/ergänzt bisherige `angebote.astro`-Rolle — konkrete Umbenennung/Redirect-Strategie ist Teil der Umsetzung).
  - `/konfliktkommunikation` bleibt unverändert; `/konfliktkommunikation/email-kurs` wird gelöscht (Route und zugehörige Komponenten/Daten, soweit ausschließlich dafür genutzt).
  - `/kontakt` als eigene Seite oder Sektion, verlinkt aus der Hauptnavigation.
- **Navigation**: Start, Blog, Podcast, Coaching, Kontakt als Top-Level-Punkte; Impressum/Datenschutz bleiben ausschließlich im Footer wie bisher.
- **Startseite (`index.astro`)**: Wird umgebaut auf (1) Positionierungs-/Über-mich-Sektion (Kommunikation, Führung, AI-Wandel, Dev-Community), (2) Sektion "Neueste Artikel" (aus `blog`-Collection, z.B. 3 neueste), (3) Sektion "Neueste Folgen" (aus `podcast`-Collection, z.B. 3 neueste), (4) neutrale Newsletter-Einladungssektion. Bestehende Sales-lastige Komponenten (`CoachingHeroSection`, `HeroSection` in aktueller Sales-Form, `StrategiegespraechCTA` auf der Startseite) werden von der Startseite entfernt bzw. auf die Coaching-Seite verschoben, sofern sie dort inhaltlich noch passen.
- **Podcast-Datenfluss**: Bestehender RSS-basierter Fetch (`useEpisodes.ts`, `episodeService.ts`) bleibt Quelle zur Erkennung neuer Folgen; die redaktionelle Episodenseite (Shownotes etc.) wird manuell als Content-Collection-Eintrag ergänzt und mit der per RSS gelieferten Folge verknüpft (z.B. über gemeinsame Episodennummer/Slug).
- **Coaching-Seite Inhalt**: Beschreibung der Zielgruppe (Entwickler Richtung 80k–200k Jahresgehalt), Nutzenversprechen (technische und strategische Unterstützung), bestehende Testimonials (`testimonials.ts`, `TestimonialsSection`) werden unverändert übernommen. Keine Countdown-/Urgency-Elemente, kein mehrstufiges Sales-Formular; stattdessen ein einzeiliger Kontaktweg (Mailto-Link oder Verweis auf `/kontakt`) am Seitenende.
- **Newsletter (Content-Updates)**: Neue, von `/konfliktkommunikation/email-kurs` komplett getrennte Anmeldekomponente mit neutralem Wording ("Neue Artikel & Folgen per Mail"). Frontend-seitig als Formular gebaut, das an einen extern konfigurierbaren Endpunkt sendet; die eigentliche Brevo-Automatisierung richtet Gregor selbst außerhalb des Repos ein (Out of Scope für den Code, aber die Formular-Anbindungsstelle ist Teil der Implementierung).
- **Entfernung email-kurs**: Route/Seite `src/pages/konfliktkommunikation/email-kurs` sowie ausschließlich dafür verwendete Komponenten/Daten werden gelöscht. Falls Komponenten (z.B. `NewsletterForm.astro`) auch anderweitig genutzt werden, bleiben sie erhalten und werden nur von der gelöschten Seite entkoppelt.
- **Visuelles Design**: Bestehendes Tailwind-Theme, Farben und Komponentenstil bleiben in dieser Phase unverändert. Ein separater `/design`-Durchgang für visuellen Feinschliff folgt nach Fertigstellung dieser Struktur, auf Basis der dann existierenden echten Seiten (kein Mockup-basierter Vorlauf).
- **Platzhalterinhalte**: Für den initialen Merge werden 1–2 Beispielartikel pro Kategorie (inkl. mindestens einem Artikel mit Code-Beispiel zur Demonstration von `astro-expressive-code`) sowie minimale Beispiel-Episodeninhalte angelegt; echte redaktionelle Inhalte pflegt Gregor im Anschluss selbst nach.

## Testing Decisions

- Es existiert aktuell keine Test-Infrastruktur im Projekt (kein Test-Runner, keine `.test.*`/`.spec.*`-Dateien) — die Seite ist eine reine Content-/Präsentationsschicht ohne nennenswerte Business-Logik.
- Als einziger Seam dient die **Astro-Content-Collection-Schema-Validierung (Zod)**: `astro build`/`astro check` muss fehlschlagen, wenn ein Artikel oder eine Episode gegen das Schema verstößt (fehlendes Pflichtfeld, ungültige Kategorie außerhalb des Enums, falscher Datentyp).
- Ein guter Test hier prüft ausschließlich das nach außen sichtbare Verhalten: Der Build/CI-Lauf schlägt bei ungültigem Frontmatter fehl und läuft bei validem Frontmatter durch — keine Prüfung interner Implementierungsdetails der Collection-Loader.
- Prior Art im Repo: keine (erstmalige Einführung von Content Collections in diesem Projekt).
- Kein zusätzlicher Test-Layer (z.B. Playwright/Visual-Regression) ist für diese Spec vorgesehen; dies wurde mit dem Nutzer bestätigt.

## Out of Scope

- Visuelles Redesign (Farben, Layout-Überarbeitung, neue Komponenten-Optik) — folgt in einer separaten `/design`-Session nach dieser Struktur-Umsetzung.
- Migration/Überarbeitung realer redaktioneller Inhalte (echte Blogartikel, echte Shownotes) über die Platzhalterartikel hinaus.
- Einrichtung der Brevo-Automatisierung/-Liste für den neuen Content-Newsletter (macht Gregor selbst).
- Deaktivierung externer Automatisierungen rund um den alten E-Mail-Kurs (macht Gregor selbst).
- Änderungen an `/konfliktkommunikation/index.astro` selbst (bleibt inhaltlich und strukturell unverändert).
- Einführung eines CMS oder Redaktionssystems für die Content-Pflege (Markdown/MDX-Dateien im Repo reichen).
- Live editierbare/ausführbare Code-Snippets oder externe Playground-Embeds im Blog.
- Automatisierte Tests jenseits der Build-Schema-Validierung (z.B. E2E/Visual Tests).

## Further Notes

- Die bestehende Rolle von `angebote.astro` im Verhältnis zur neuen `/coaching`-Seite muss bei Implementierungsbeginn geklärt werden (Umbenennung, Zusammenlegung oder Redirect) — inhaltlich ist aber klar, dass es nur noch eine aktive Coaching-Seite mit der neuen Positionierung geben soll.
- `useEpisodes.ts`/`episodeService.ts` (RSS-Parsing) bleiben als technische Grundlage bestehen; die Verknüpfung zur neuen `podcast`-Content-Collection ist ein neuer Integrationspunkt und sollte so gebaut werden, dass eine per RSS erkannte Folge ohne Collection-Eintrag nicht zu einem Build-Fehler führt (nur Folgen mit redaktionellem Eintrag bekommen eine Detailseite).
- Gregor ist Google Developer Expert for Angular & Web-Technologies und aktiver Speaker — dieser Hintergrund sollte in der Positionierungs-Sektion der Startseite sinnvoll eingebunden werden (Content aus `host.ts` als Ausgangsbasis nutzbar).
