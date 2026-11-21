# Dirndltaler Oberbrand: Website und Webshop

Website der Brennerei Dirndltaler Oberbrand OG mit Sortiment, Warenkorb und der Rubrik „Vom selben Hof“ für Oberbrands Inferno.

Gebaut mit [Astro](https://astro.build), ausgeliefert über Netlify. Die Seite kommt ohne Datenbank aus.

## Lokal starten

```
npm install
npm run dev
```

`npm run build` erzeugt die fertige Seite im Ordner `dist`.

## Wo ändere ich was?

| Was | Datei |
| --- | --- |
| Sorten, Preise, Füllmengen, Texte | `src/data/sorten.js` |
| Adresse, Telefon, Links, Schalter | `src/data/site.js` |
| Startseite | `src/pages/index.astro` |
| Rubrik Oberbrands Inferno | `src/pages/vom-selben-hof.astro` |
| Rechtsseiten | `src/pages/impressum.astro`, `agb.astro`, `widerrufsbelehrung.astro`, `datenschutz.astro`, `versand-und-zahlung.astro` |
| Farben und Schriften | `src/styles/global.css` |
| Bilder | `public/img/` |

Versandkosten stehen in `src/data/site.js` (`versand`). Eine Sorte ohne Größen zeigt „Preis folgt“ und lässt sich nicht in den Warenkorb legen. Felder mit `null` werden nicht angezeigt.

## Schalter in `src/data/site.js`

- `live: false` hält Suchmaschinen fern. Erst beim Start auf der echten Domain auf `true` stellen.
- `zahlungAktiv: false` zeigt den Warenkorb ohne Bezahlung. Wird mit dem Zahlungsanbieter aktiviert.

## Noch offen

- Preise, Füllmengen, Alkoholgehalt, Bezeichnungen und Fotos je Sorte
- Rechtstexte nach anwaltlicher Prüfung einsetzen
- Kasse mit Schaltfläche „zahlungspflichtig bestellen“, Geburtsdatum und Zahlung über Stripe
- Bestätigungs-E-Mails für Bestellung und Widerruf, Dankeseite für das Widerrufsformular
- Anbieterangabe für Oberbrands Inferno
