// Wir nehmen eine Bestellung an: Der Kunde bekommt die Vertragsbestätigung
// mit AGB, Widerrufsbelehrung und Muster-Formular.
// Aufgerufen über den Link in unserer eigenen Bestell-Benachrichtigung.

import { SITE } from '../../src/data/site.js';
import { postBereit, senden, mitFuss, zeitpunkt } from '../lib/post.mjs';
import { stripe, bestellungLaden, codeGueltig, vertragText } from '../lib/bestellung.mjs';

export const config = { path: '/api/annehmen' };

const antwort = (status, inhalt) =>
  new Response(JSON.stringify(inhalt), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export default async (request) => {
  if (request.method !== 'POST') return antwort(405, { fehler: 'Nur POST ist erlaubt.' });

  let eingabe;
  try {
    eingabe = await request.json();
  } catch {
    return antwort(400, { fehler: 'Die Anfrage konnte nicht gelesen werden.' });
  }
  const sitzung = String(eingabe.b || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(sitzung) || !codeGueltig(sitzung, eingabe.c)) {
    return antwort(403, { fehler: 'Dieser Link ist nicht gültig.' });
  }
  if (!postBereit()) return antwort(503, { fehler: 'Der E-Mail-Versand ist nicht eingerichtet.' });

  try {
    const b = await bestellungLaden(sitzung);
    if (!b.bezahlt) return antwort(409, { fehler: 'Diese Bestellung ist noch nicht bezahlt.' });
    if (!b.email) return antwort(409, { fehler: 'Zu dieser Bestellung gibt es keine E-Mail-Adresse.' });

    if (b.zahlung) {
      const zahlung = await stripe(`payment_intents/${b.zahlung}`);
      const schon = zahlung.metadata && zahlung.metadata.vertrag_gesendet;
      if (schon) {
        return antwort(200, { meldung: `Die Vertragsbestätigung für ${b.nummer} wurde bereits gesendet (${zeitpunkt(new Date(schon))}).` });
      }
    }

    await senden({
      an: b.email,
      betreff: `Vertragsbestätigung zu deiner Bestellung ${b.nummer}`,
      text: mitFuss(vertragText(b)),
    });
    await senden({
      an: SITE.mail,
      betreff: `Kopie: Vertragsbestätigung ${b.nummer} an ${b.email}`,
      text: mitFuss(vertragText(b)),
    });

    if (b.zahlung) {
      await stripe(`payment_intents/${b.zahlung}`, {
        methode: 'POST',
        daten: { 'metadata[vertrag_gesendet]': new Date().toISOString() },
      });
    }
    return antwort(200, { meldung: `Bestellung ${b.nummer} angenommen. Die Vertragsbestätigung ist an ${b.email} unterwegs.` });
  } catch (grund) {
    console.error('Annahme fehlgeschlagen:', grund && grund.message);
    return antwort(502, { fehler: 'Das hat nicht geklappt. Bitte versuche es in ein paar Minuten noch einmal.' });
  }
};
