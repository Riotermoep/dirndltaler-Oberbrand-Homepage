// Legt bei Stripe einen Bezahlvorgang an und gibt dessen Adresse zurück.
//
// Die Preise kommen ausschließlich aus src/data/sorten.js. Was der Browser
// an Preisen mitschickt, wird nicht verwendet.
//
// Der geheime Schlüssel steht nur in Netlify unter "Keys and secrets"
// (STRIPE_SECRET_KEY), niemals in diesem Repository.

import { SORTEN } from '../../src/data/sorten.js';
import { SITE } from '../../src/data/site.js';

export const config = { path: '/api/checkout' };

const HOECHSTMENGE = 60;

function antwort(status, inhalt) {
  return new Response(JSON.stringify(inhalt), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function fehler(status, meldung) {
  return antwort(status, { fehler: meldung });
}

// Stripe erwartet verschachtelte Angaben in der Form a[b][0][c]=wert.
function flach(wert, pfad, ziel) {
  if (wert === undefined || wert === null) return;
  if (Array.isArray(wert)) {
    wert.forEach((eintrag, i) => flach(eintrag, `${pfad}[${i}]`, ziel));
  } else if (typeof wert === 'object') {
    for (const [name, eintrag] of Object.entries(wert)) {
      flach(eintrag, pfad ? `${pfad}[${name}]` : name, ziel);
    }
  } else {
    ziel.append(pfad, String(wert));
  }
}

export default async (request) => {
  if (request.method !== 'POST') return fehler(405, 'Nur POST ist erlaubt.');

  const adresse = new URL(request.url);
  const schluessel = process.env.STRIPE_SECRET_KEY || '';
  if (!schluessel) return fehler(503, 'Die Bezahlung ist noch nicht eingerichtet.');

  // Solange der Verkauf nicht freigegeben ist, sind nur Testzahlungen möglich.
  if (!SITE.zahlungAktiv && !schluessel.startsWith('sk_test_')) {
    return fehler(503, 'Die Online-Bestellung ist noch nicht freigeschaltet.');
  }
  // Auf der echten Seite bleibt die Kasse bis zur Freigabe ganz zu.
  const vorschau = adresse.hostname.startsWith('deploy-preview-') || adresse.hostname === 'localhost';
  if (!SITE.zahlungAktiv && !vorschau) {
    return fehler(503, 'Die Online-Bestellung ist noch nicht freigeschaltet.');
  }

  let eingabe;
  try {
    eingabe = await request.json();
  } catch {
    return fehler(400, 'Die Bestellung konnte nicht gelesen werden.');
  }

  const lieferart = eingabe.lieferart === 'abholung' ? 'abholung' : 'versand';
  if (eingabe.alterBestaetigt !== true) {
    return fehler(400, 'Wir verkaufen nur an Personen ab 18 Jahren. Bitte bestätige dein Alter.');
  }
  if (eingabe.bedingungenGelesen !== true) {
    return fehler(400, 'Bitte bestätige, dass du AGB und Widerrufsbelehrung gelesen hast.');
  }
  if (!Array.isArray(eingabe.positionen) || eingabe.positionen.length === 0) {
    return fehler(400, 'Dein Warenkorb ist leer.');
  }

  const zeilen = [];
  let warenwertCent = 0;
  const uebersicht = [];
  for (const position of eingabe.positionen.slice(0, 40)) {
    const sorte = SORTEN.find((s) => s.slug === position.slug);
    const groesse = sorte && sorte.groessen.find((g) => String(g.ml) === String(position.ml));
    const menge = Number.parseInt(position.menge, 10);
    if (!sorte || !groesse || !Number.isInteger(menge) || menge < 1 || menge > HOECHSTMENGE) {
      return fehler(400, 'Im Warenkorb liegt ein Artikel, den es so nicht mehr gibt. Bitte lade den Warenkorb neu.');
    }
    const cent = Math.round(groesse.preis * 100);
    warenwertCent += cent * menge;
    uebersicht.push(`${menge}x ${sorte.name} ${groesse.ml} ml`);
    zeilen.push({
      quantity: menge,
      price_data: {
        currency: 'eur',
        unit_amount: cent,
        product_data: {
          name: `${sorte.name}, ${groesse.ml} ml`,
          description: [sorte.art, sorte.vol ? `${String(sorte.vol).replace('.', ',')} % vol.` : null].filter(Boolean).join(' · '),
          metadata: { slug: sorte.slug, ml: groesse.ml },
        },
      },
    });
  }

  const versandCent = warenwertCent >= SITE.versand.freiAb * 100 ? 0 : Math.round(SITE.versand.pauschale * 100);
  const ursprung = adresse.origin;

  // Bestellnummer: DO-JJMMTT-XXXX
  const heute = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna', year: '2-digit', month: '2-digit', day: '2-digit' })
    .format(new Date())
    .replace(/-/g, '');
  const zeichen = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const zufall = Array.from(crypto.getRandomValues(new Uint8Array(4)), (z) => zeichen[z % zeichen.length]).join('');
  const bestellnummer = `DO-${heute}-${zufall}`;

  const auftrag = {
    mode: 'payment',
    locale: 'de',
    line_items: zeilen,
    success_url: `${ursprung}/bestellung/danke/?bestellung={CHECKOUT_SESSION_ID}&nr=${bestellnummer}`,
    client_reference_id: bestellnummer,
    cancel_url: `${ursprung}/kasse/`,
    phone_number_collection: { enabled: true },
    billing_address_collection: 'required',
    metadata: {
      bestellnummer,
      lieferart,
      alter_bestaetigt: 'ja',
      artikel: uebersicht.join(', ').slice(0, 480),
    },
    payment_intent_data: { description: `Bestellung ${bestellnummer} ${SITE.name}`, metadata: { bestellnummer } },
    custom_text: {
      submit: {
        message:
          lieferart === 'abholung'
            ? `Abholung ab Hof nach telefonischer Terminvereinbarung. ${SITE.altershinweis}`
            : `Lieferung nur innerhalb Österreichs. ${SITE.altershinweis}`,
      },
    },
  };

  if (lieferart === 'versand') {
    auftrag.shipping_address_collection = { allowed_countries: ['AT'] };
    auftrag.shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          display_name: versandCent === 0 ? 'Versand innerhalb Österreichs (kostenlos)' : 'Versand innerhalb Österreichs',
          fixed_amount: { amount: versandCent, currency: 'eur' },
        },
      },
    ];
  }

  const formular = new URLSearchParams();
  flach(auftrag, '', formular);

  let stripe;
  try {
    stripe = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${schluessel}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: formular,
    });
  } catch {
    return fehler(502, 'Der Zahlungsanbieter ist gerade nicht erreichbar. Bitte versuche es in ein paar Minuten noch einmal.');
  }

  const ergebnis = await stripe.json().catch(() => ({}));
  if (!stripe.ok || !ergebnis.url) {
    console.error('Stripe-Fehler', stripe.status, ergebnis && ergebnis.error && ergebnis.error.message);
    return fehler(502, 'Die Bezahlung konnte nicht gestartet werden. Bitte versuche es noch einmal oder melde dich bei uns.');
  }

  return antwort(200, { url: ergebnis.url });
};
