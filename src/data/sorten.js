// Das Sortiment. Eine Sorte = ein Eintrag.
//
// Felder mit null sind noch nicht bestätigt und werden auf der Seite
// nicht angezeigt. Solange "groessen" leer ist, steht "Preis folgt" da
// und die Sorte kann nicht in den Warenkorb gelegt werden.
//
// groessen:  Liste der Flaschengrößen: { ml: 350, preis: 27.9 }
//            ml = Füllmenge in Millilitern, preis = Bruttopreis in Euro
// vol:       Alkoholgehalt in % vol. als Zahl, z. B. 42
// bild:      Datei in public/img/, z. B. 'marille.jpg'

export const SORTEN = [
  {
    slug: 'marille',
    name: 'Marille',
    art: 'Edelbrand',
    bezeichnung: null,
    vol: 42,
    groessen: [
      { ml: 200, preis: 17.9 },
      { ml: 350, preis: 27.9 },
    ],
    allergene: null,
    text: 'Die Kraft des Sommers steckt in dir, a Fest fia olle Sinn. Dei Essenz ins Glasl gossn, is für jeden Gaumen a Gewinn.',
    bild: 'marille.jpg',
    bildAlt: 'Flasche Marille mit zwei Gläsern auf einem Holzbrett vor einer Wiese',
  },
  {
    slug: 'zwetschke',
    name: 'Zwetschke',
    art: 'Edelbrand',
    bezeichnung: null,
    vol: 42,
    groessen: [
      { ml: 200, preis: 15.9 },
      { ml: 350, preis: 22.9 },
    ],
    allergene: null,
    text: null,
    bild: null,
    bildAlt: null,
  },
  { slug: 'kirsch', name: 'Kirsch', art: 'Edelbrand', bezeichnung: null, vol: null, groessen: [], allergene: null, text: null, bild: null, bildAlt: null },
  {
    slug: 'birne',
    name: 'Birne',
    art: 'Edelbrand',
    bezeichnung: null,
    vol: 42,
    groessen: [
      { ml: 200, preis: 15.9 },
      { ml: 350, preis: 22.9 },
    ],
    allergene: null,
    text: 'Der Edelbrand unserer Birn, bleibt da auf ewig in deim Hirn. Des Aroma is unermesslich, des mocht eam unvergesslich.',
    bild: null,
    bildAlt: null,
  },
  { slug: 'aronia', name: 'Aronia', art: 'Edelbrand', bezeichnung: null, vol: null, groessen: [], allergene: null, text: null, bild: null, bildAlt: null },
  {
    slug: 'dirndlvodkalikoer',
    name: 'Dirndlvodkalikör',
    art: 'Likör mit Dirndl',
    bezeichnung: null,
    vol: 30,
    groessen: [
      { ml: 350, preis: 29.9 },
      { ml: 500, preis: 38.9 },
    ],
    allergene: null,
    text: 'Der Liebliche. Geküsst von Dirndln aus dem Pielachtal, mit einem süß-säuerlichen Aroma.',
    bild: null,
    bildAlt: null,
  },
  {
    slug: 'vodka',
    name: 'Vodka',
    art: 'Vodka',
    bezeichnung: null,
    vol: 38,
    groessen: [
      { ml: 350, preis: 24.9 },
      { ml: 500, preis: 31.9 },
    ],
    allergene: null,
    text: 'Der Klassiker. Hergestellt aus ausgewählten Erdäpfeln aus regionalem Anbau.',
    bild: null,
    bildAlt: null,
  },
  {
    slug: 'mostlikoer',
    name: 'Mostlikör',
    art: 'Likör',
    bezeichnung: null,
    vol: 16,
    groessen: [
      { ml: 350, preis: 18.9 },
      { ml: 500, preis: 25.9 },
    ],
    allergene: null,
    text: 'Von unsre Äpfel kummt da Most, der wird da schmecken, wennst erm kost. Verfeinert mit Gewürzen, des Geschmackserlebnis willst ned verkürzen.',
    bild: null,
    bildAlt: null,
  },
  {
    slug: 'muskateller-trester',
    name: 'Muskateller Trester',
    art: 'Special Edition · aus dem Sherryfass',
    bezeichnung: null,
    vol: null,
    groessen: [],
    allergene: null,
    text: null,
    bild: null,
    bildAlt: null,
  },
];

const euro = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });
const zahl = new Intl.NumberFormat('de-AT', { maximumFractionDigits: 2 });

export function euroText(betrag) {
  return euro.format(betrag);
}

export function mlText(ml) {
  return `${ml} ml`;
}

// Für Karten: "ab 17,90 €" bei mehreren Größen, sonst der Preis.
export function preisText(sorte) {
  if (!sorte.groessen.length) return null;
  const kleinster = Math.min(...sorte.groessen.map((g) => g.preis));
  return sorte.groessen.length > 1 ? `ab ${euro.format(kleinster)}` : euro.format(kleinster);
}

export function literpreisText(groesse) {
  return `${euro.format((groesse.preis / groesse.ml) * 1000)} je Liter`;
}

export function fuellmengenText(sorte) {
  if (!sorte.groessen.length) return null;
  return `${sorte.groessen.map((g) => g.ml).join(' / ')} ml`;
}

export function eckdaten(sorte) {
  const teile = [];
  const mengen = fuellmengenText(sorte);
  if (mengen) teile.push(mengen);
  if (sorte.vol) teile.push(`${zahl.format(sorte.vol)} % vol.`);
  return teile.join(' · ');
}
