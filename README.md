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

## Kasse und Bezahlung

- Die Kasse (`/kasse/`) schickt die Bestellung an `netlify/functions/checkout.mjs`. Diese Funktion rechnet die Preise aus `src/data/sorten.js` neu und legt bei Stripe einen Bezahlvorgang an.
- Der geheime Stripe-Schlüssel steht nur in Netlify unter „Keys and secrets“ als `STRIPE_SECRET_KEY`, nie in diesem Repository.
- Solange `zahlungAktiv` in `src/data/site.js` auf `false` steht, ist die Kasse nur in den Vorschauen sichtbar und nimmt nur Testzahlungen an.

## Bestätigungs-E-Mails

- Stripe meldet jede bezahlte Bestellung an `netlify/functions/stripe-webhook.mjs`. Der Kunde bekommt die Eingangsbestätigung, euer Postfach eine Nachricht mit dem Link „Bestellung annehmen“.
- Der Link führt auf `/bestellung/annehmen/`. Mit dem Knopf dort geht die Vertragsbestätigung samt AGB und Widerrufsbelehrung an den Kunden (`netlify/functions/annehmen.mjs`).
- Der Online-Widerruf (`/widerruf/`) wird von `netlify/functions/widerruf.mjs` bestätigt.
- Der Wortlaut von AGB und Widerrufsbelehrung steht nur in `src/data/rechtstexte.js`.
- In Netlify unter „Keys and secrets“ nötig: `STRIPE_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
