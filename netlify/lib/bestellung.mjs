// Bestellungen aus Stripe lesen und als E-Mail-Text aufbereiten.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE } from '../../src/data/site.js';
import { agb, widerrufsbelehrung, alsText, STAND } from '../../src/data/rechtstexte.js';
import { zeitpunkt } from './post.mjs';

const euro = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });
const cent = (betrag) => euro.format((betrag || 0) / 100);

export async function stripe(pfad, { methode = 'GET', daten } = {}) {
  const antwort = await fetch(`https://api.stripe.com/v1/${pfad}`, {
    method: methode,
    headers: {
      authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(daten ? { 'content-type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: daten ? new URLSearchParams(daten) : undefined,
  });
  const inhalt = await antwort.json().catch(() => ({}));
  if (!antwort.ok) {
    throw new Error(`Stripe ${antwort.status}: ${(inhalt.error && inhalt.error.message) || 'unbekannter Fehler'}`);
  }
  return inhalt;
}

// Prüft die Unterschrift einer Stripe-Benachrichtigung.
export function unterschriftGueltig(inhalt, kopfzeile, geheimnis, toleranzSekunden = 300) {
  if (!kopfzeile || !geheimnis) return false;
  const teile = Object.fromEntries(
    kopfzeile.split(',').map((teil) => {
      const i = teil.indexOf('=');
      return [teil.slice(0, i).trim(), teil.slice(i + 1).trim()];
    }),
  );
  const zeit = Number.parseInt(teile.t, 10);
  if (!zeit || !teile.v1) return false;
  if (Math.abs(Date.now() / 1000 - zeit) > toleranzSekunden) return false;
  const erwartet = createHmac('sha256', geheimnis).update(`${zeit}.${inhalt}`).digest('hex');
  const a = Buffer.from(erwartet);
  const b = Buffer.from(teile.v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Code für den Link "Bestellung annehmen" in unserer eigenen Benachrichtigung.
export function annahmeCode(sitzung) {
  return createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET || '')
    .update(`annehmen:${sitzung}`)
    .digest('hex')
    .slice(0, 32);
}

export function codeGueltig(sitzung, code) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return false;
  const a = Buffer.from(annahmeCode(sitzung));
  const b = Buffer.from(String(code || ''));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function bestellungLaden(sitzungsId) {
  const sitzung = await stripe(`checkout/sessions/${encodeURIComponent(sitzungsId)}`);
  const zeilen = await stripe(
    `checkout/sessions/${encodeURIComponent(sitzungsId)}/line_items?limit=100&expand[]=data.price.product`,
  );
  const kunde = sitzung.customer_details || {};
  const lieferung =
    (sitzung.collected_information && sitzung.collected_information.shipping_details) || sitzung.shipping_details || null;
  const versandCent =
    (sitzung.shipping_cost && sitzung.shipping_cost.amount_total) ||
    (sitzung.total_details && sitzung.total_details.amount_shipping) ||
    0;

  return {
    sitzung: sitzung.id,
    zahlung: typeof sitzung.payment_intent === 'string' ? sitzung.payment_intent : null,
    bezahlt: sitzung.payment_status === 'paid',
    test: sitzung.livemode === false,
    nummer: (sitzung.metadata && sitzung.metadata.bestellnummer) || sitzung.id.slice(-10).toUpperCase(),
    zeit: new Date(sitzung.created * 1000),
    lieferart: (sitzung.metadata && sitzung.metadata.lieferart) === 'abholung' ? 'abholung' : 'versand',
    email: kunde.email || '',
    name: kunde.name || '',
    telefon: kunde.phone || '',
    rechnungsadresse: kunde.address || null,
    lieferName: (lieferung && lieferung.name) || kunde.name || '',
    lieferadresse: (lieferung && lieferung.address) || null,
    positionen: (zeilen.data || []).map((zeile) => {
      const produkt = zeile.price && typeof zeile.price.product === 'object' ? zeile.price.product : {};
      const ml = Number.parseInt((produkt.metadata && produkt.metadata.ml) || '', 10) || null;
      const einzel = (zeile.price && zeile.price.unit_amount) || 0;
      return {
        name: zeile.description || produkt.name || 'Artikel',
        menge: zeile.quantity || 1,
        einzel,
        summe: zeile.amount_total,
        grundpreis: ml ? Math.round((einzel / ml) * 1000) : null,
      };
    }),
    warenwert: sitzung.amount_subtotal,
    versand: versandCent,
    gesamt: sitzung.amount_total,
  };
}

function adresseText(name, adresse) {
  if (!adresse) return name || '';
  return [name, adresse.line1, adresse.line2, `${adresse.postal_code || ''} ${adresse.city || ''}`.trim(), adresse.country === 'AT' ? 'Österreich' : adresse.country]
    .filter(Boolean)
    .join('\n');
}

export function uebersichtText(b) {
  // Der Grundpreis je Liter steht auf den Sortenseiten, in der E-Mail nicht.
  const zeilen = b.positionen.map((p) =>
    p.menge > 1
      ? `${p.menge} x ${p.name} (je ${cent(p.einzel)}): ${cent(p.summe)}`
      : `1 x ${p.name}: ${cent(p.summe)}`,
  );
  const liefer =
    b.lieferart === 'abholung'
      ? 'Abholung ab Hof nach telefonischer Terminvereinbarung'
      : `Versand innerhalb Österreichs an:\n${adresseText(b.lieferName, b.lieferadresse)}`;
  return [
    `Bestellnummer: ${b.nummer}`,
    `Bestellt am: ${zeitpunkt(b.zeit)}`,
    '',
    ...zeilen,
    '',
    `Zwischensumme: ${cent(b.warenwert)}`,
    b.lieferart === 'abholung' ? 'Versand: entfällt (Abholung ab Hof)' : `Versandkosten: ${b.versand ? cent(b.versand) : 'kostenlos'}`,
    `Gesamtbetrag inkl. 20 % USt.: ${cent(b.gesamt)}`,
    '',
    liefer,
  ].join('\n');
}

const TESTZEILE = 'TESTBESTELLUNG: Es wurde kein echtes Geld abgebucht und es wird nichts verschickt.\n\n';

// E-Mail 1 an den Kunden, sofort nach der Bestellung.
export function eingangText(b) {
  return (
    (b.test ? TESTZEILE : '') +
    [
      `Hallo ${b.name || ''},`.replace(' ,', ','),
      '',
      `wir haben deine Bestellung Nr. ${b.nummer} vom ${zeitpunkt(b.zeit)} erhalten. Das ist noch keine Annahme; der Vertrag kommt erst mit unserer Vertragsbestätigung zustande.`,
      '',
      uebersichtText(b),
      '',
      SITE.altershinweis,
      '',
      'Danke für deine Bestellung!',
      'Christoph und Christoph von Dirndltaler Oberbrand',
    ].join('\n')
  );
}

// E-Mail 2 an den Kunden: Annahme der Bestellung mit allen Vertragsunterlagen.
export function vertragText(b) {
  const linie = '='.repeat(60);
  return (
    (b.test ? TESTZEILE : '') +
    [
      `Hallo ${b.name || ''},`.replace(' ,', ','),
      '',
      `wir nehmen deine Bestellung Nr. ${b.nummer} hiermit an. Damit ist der Kaufvertrag zustande gekommen.`,
      b.lieferart === 'abholung'
        ? `Wir melden uns wegen eines Termins für die Abholung ab Hof. Du erreichst uns auch unter ${SITE.telefon}.`
        : 'Wir machen dein Paket fertig und übergeben es dem Paketdienst.',
      '',
      SITE.altershinweis,
      b.lieferart === 'abholung'
        ? ''
        : 'Ohne erfolgreiche Altersprüfung bei der Übergabe wird die Ware nicht ausgehändigt und an uns zurückgesandt.',
      '',
      linie,
      'DEINE BESTELLUNG',
      linie,
      '',
      uebersichtText(b),
      '',
      linie,
      'WIDERRUFSBELEHRUNG',
      linie,
      '',
      alsText(widerrufsbelehrung()),
      '',
      'Online widerrufen: https://www.dirndltaler-oberbrand.at/widerruf (Schaltfläche „Vertrag widerrufen“)',
      '',
      linie,
      'GEWÄHRLEISTUNG',
      linie,
      '',
      'Die EU-weit einheitliche Mitteilung über dein gesetzliches Gewährleistungsrecht hängt dieser E-Mail als Bild an. Du findest sie auch unter https://www.dirndltaler-oberbrand.at/gewaehrleistung',
      '',
      linie,
      `ALLGEMEINE GESCHÄFTSBEDINGUNGEN (Stand ${STAND})`,
      linie,
      '',
      alsText(agb()),
    ].join('\n')
  );
}

// Benachrichtigung an uns selbst.
export function internText(b, annahmeLink) {
  return (
    (b.test ? TESTZEILE : '') +
    [
      `Neue Bestellung Nr. ${b.nummer}`,
      '',
      `Kunde: ${b.name}`,
      `E-Mail: ${b.email}`,
      `Telefon: ${b.telefon || 'nicht angegeben'}`,
      '',
      uebersichtText(b),
      '',
      'Rechnungsadresse:',
      adresseText(b.name, b.rechnungsadresse),
      '',
      'Der Kunde hat bisher nur die Eingangsbestätigung bekommen.',
      'Bestellung annehmen und Vertragsbestätigung senden:',
      annahmeLink,
      '',
      'Bei Übergabe den Ausweis prüfen. Kann die Bestellung nicht erfüllt werden: Kunde informieren und Zahlung in Stripe erstatten.',
    ].join('\n')
  );
}
