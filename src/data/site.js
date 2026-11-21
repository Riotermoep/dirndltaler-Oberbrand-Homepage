// Zentrale Angaben der Website. Hier ändern, nicht in den einzelnen Seiten.
export const SITE = {
  name: 'Dirndltaler Oberbrand',
  firma: 'Dirndltaler Oberbrand OG',
  strasse: 'Grünau 12',
  ort: '3202 Hofstetten-Grünau',
  telefon: '0681/81892321',
  telefonLink: '+4368181892321',
  mail: 'office@dirndltaler-oberbrand.at',
  instagram: 'https://www.instagram.com/dirndltaler_oberbrand/',
  facebook: 'https://www.facebook.com/110692924577822',

  // false: Suchmaschinen sollen die Seite noch nicht aufnehmen.
  // Erst beim Start auf der echten Domain auf true stellen.
  live: false,

  // false: Auf der echten Seite gibt es den Warenkorb ohne Bezahlung.
  // In den Vorschauen von Netlify ist die Kasse immer an und läuft im
  // Testmodus von Stripe. Erst zum Verkaufsstart auf true stellen.
  zahlungAktiv: false,

  firmenbuch: 'FN 553514 t',
  firmenbuchgericht: 'Landesgericht St. Pölten',
  uid: 'ATU76819007',

  // Stehen so in AGB, Datenschutz und auf "Versand und Zahlung".
  zahlungsarten: 'Kreditkarte, eps-Überweisung, Apple Pay, Google Pay, Barzahlung bei Abholung',
  zahlungsdienst: 'Stripe Payments Europe Ltd., Irland',
  altershinweis: 'Abgabe nur an Personen ab 18 Jahren. Übergabe nur gegen Vorlage eines amtlichen Lichtbildausweises.',
  // Versandkosten in Euro: Pauschale je Bestellung, frei ab diesem Warenwert
  versand: { pauschale: 6.4, freiAb: 150 },
};

export const NAVIGATION = [
  { titel: 'Sorten', link: '/sorten/' },
  { titel: 'Brennerei', link: '/#brennerei' },
  { titel: 'Über uns', link: '/#ueber-uns' },
  { titel: 'Vom selben Hof', link: '/vom-selben-hof/' },
  { titel: 'Kontakt', link: '/kontakt/' },
];

export const RECHTLICHES = [
  { titel: 'Versand und Zahlung', link: '/versand-und-zahlung/' },
  { titel: 'AGB', link: '/agb/' },
  { titel: 'Widerrufsbelehrung', link: '/widerrufsbelehrung/' },
  { titel: 'Datenschutz', link: '/datenschutz/' },
  { titel: 'Impressum', link: '/impressum/' },
];

// Ist die Kasse beim Bauen der Seite sichtbar? Auf der echten Seite nur mit
// zahlungAktiv, in Vorschauen und am eigenen Rechner immer.
export function kasseSichtbar() {
  const kontext = typeof process !== 'undefined' ? process.env.CONTEXT : undefined;
  return SITE.zahlungAktiv || kontext !== 'production';
}
