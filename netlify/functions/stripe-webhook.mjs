// Empfängt die Benachrichtigungen von Stripe über bezahlte Bestellungen.
// Schickt dem Kunden die Eingangsbestätigung und uns eine Nachricht mit
// dem Link zum Annehmen der Bestellung.

import { SITE } from '../../src/data/site.js';
import { postBereit, senden, mitFuss } from '../lib/post.mjs';
import {
  stripe,
  unterschriftGueltig,
  bestellungLaden,
  annahmeCode,
  eingangText,
  internText,
} from '../lib/bestellung.mjs';

export const config = { path: '/api/stripe-webhook' };

const antwort = (status, text) => new Response(text, { status, headers: { 'cache-control': 'no-store' } });

export default async (request) => {
  if (request.method !== 'POST') return antwort(405, 'Nur POST');

  const inhalt = await request.text();
  if (!unterschriftGueltig(inhalt, request.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET)) {
    return antwort(400, 'Unterschrift ungültig');
  }

  const ereignis = JSON.parse(inhalt);
  const sitzung = ereignis.data && ereignis.data.object;
  const bezahlt =
    (ereignis.type === 'checkout.session.completed' && sitzung.payment_status === 'paid') ||
    ereignis.type === 'checkout.session.async_payment_succeeded';
  if (!bezahlt) return antwort(200, 'nicht relevant');

  if (!postBereit()) {
    console.error('E-Mail-Versand ist nicht eingerichtet.');
    return antwort(500, 'E-Mail-Versand nicht eingerichtet');
  }

  try {
    const b = await bestellungLaden(sitzung.id);

    // Schon erledigt? Stripe schickt Benachrichtigungen manchmal doppelt.
    if (b.zahlung) {
      const zahlung = await stripe(`payment_intents/${b.zahlung}`);
      if (zahlung.metadata && zahlung.metadata.eingang_gesendet) return antwort(200, 'bereits gesendet');
    }

    const ursprung = new URL(request.url).origin;
    const link = `${ursprung}/bestellung/annehmen/?b=${encodeURIComponent(b.sitzung)}&c=${annahmeCode(b.sitzung)}`;

    if (b.email) {
      await senden({
        an: b.email,
        betreff: `Deine Bestellung ${b.nummer} ist bei uns eingegangen`,
        text: mitFuss(eingangText(b)),
      });
    }
    await senden({
      an: SITE.mail,
      betreff: `Neue Bestellung ${b.nummer}${b.test ? ' (Test)' : ''}`,
      text: internText(b, link),
      antwortAn: b.email || undefined,
    });

    if (b.zahlung) {
      await stripe(`payment_intents/${b.zahlung}`, {
        methode: 'POST',
        daten: { 'metadata[eingang_gesendet]': new Date().toISOString(), 'metadata[bestellnummer]': b.nummer },
      });
    }
    return antwort(200, 'gesendet');
  } catch (grund) {
    console.error('Bestellbestätigung fehlgeschlagen:', grund && grund.message);
    return antwort(500, 'Fehler, Stripe versucht es erneut');
  }
};
