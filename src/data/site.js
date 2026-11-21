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

  // false: Warenkorb ohne Bezahlung. Wird mit dem Zahlungsanbieter aktiviert.
  zahlungAktiv: false,
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
