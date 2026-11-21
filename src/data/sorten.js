// Das Sortiment. Eine Sorte = ein Eintrag.
//
// Felder mit null sind noch nicht bestätigt und werden auf der Seite
// nicht angezeigt. Solange "preis" null ist, kann die Sorte nicht in den
// Warenkorb gelegt werden.
//
// preis:      Bruttopreis in Euro als Zahl, z. B. 17.9
// fuellmenge: Liter als Zahl, z. B. 0.35 (daraus wird der Literpreis berechnet)
// vol:        Alkoholgehalt in % vol. als Zahl, z. B. 40
// bild:       Datei in public/img/, z. B. 'marille.jpg'

export const SORTEN = [
  {
    slug: 'marille',
    name: 'Marille',
    art: 'Edelbrand',
    bezeichnung: null,
    fuellmenge: null,
    vol: null,
    preis: null,
    allergene: null,
    text: null,
    bild: 'marille.jpg',
    bildAlt: 'Flasche Marille mit zwei Gläsern auf einem Holzbrett vor einer Wiese',
  },
  { slug: 'zwetschke', name: 'Zwetschke', art: 'Edelbrand', bezeichnung: null, fuellmenge: null, vol: null, preis: null, allergene: null, text: null, bild: null, bildAlt: null },
  { slug: 'kirsch', name: 'Kirsch', art: 'Edelbrand', bezeichnung: null, fuellmenge: null, vol: null, preis: null, allergene: null, text: null, bild: null, bildAlt: null },
  { slug: 'birne', name: 'Birne', art: 'Edelbrand', bezeichnung: null, fuellmenge: null, vol: null, preis: null, allergene: null, text: null, bild: null, bildAlt: null },
  { slug: 'aronia', name: 'Aronia', art: 'Edelbrand', bezeichnung: null, fuellmenge: null, vol: null, preis: null, allergene: null, text: null, bild: null, bildAlt: null },
  { slug: 'dirndlvodka', name: 'Dirndlvodka', art: 'Vodka mit Dirndl', bezeichnung: null, fuellmenge: null, vol: null, preis: null, allergene: null, text: null, bild: null, bildAlt: null },
  { slug: 'vodka', name: 'Vodka', art: 'Vodka', bezeichnung: null, fuellmenge: null, vol: null, preis: null, allergene: null, text: null, bild: null, bildAlt: null },
  {
    slug: 'muskateller-trester',
    name: 'Muskateller Trester',
    art: 'Special Edition · aus dem Sherryfass',
    bezeichnung: null,
    fuellmenge: null,
    vol: null,
    preis: null,
    allergene: null,
    text: null,
    bild: null,
    bildAlt: null,
  },
];

const euro = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });
const zahl = new Intl.NumberFormat('de-AT', { maximumFractionDigits: 2 });

export function preisText(sorte) {
  return sorte.preis == null ? null : euro.format(sorte.preis);
}

export function literpreisText(sorte) {
  if (sorte.preis == null || !sorte.fuellmenge) return null;
  return `${euro.format(sorte.preis / sorte.fuellmenge)} je Liter`;
}

export function eckdaten(sorte) {
  const teile = [];
  if (sorte.fuellmenge) teile.push(`${zahl.format(sorte.fuellmenge)} l`);
  if (sorte.vol) teile.push(`${zahl.format(sorte.vol)} % vol.`);
  return teile.join(' · ');
}
