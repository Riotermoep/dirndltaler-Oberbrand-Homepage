// Online-Widerruf: nimmt die Erklärung entgegen und bestätigt sie sofort
// per E-Mail, mit Inhalt, Datum und Uhrzeit des Eingangs.

import { SITE } from '../../src/data/site.js';
import { postBereit, senden, mitFuss, einzeilig, zeitpunkt } from '../lib/post.mjs';

export const config = { path: '/api/widerruf' };

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
    return antwort(400, { fehler: 'Die Erklärung konnte nicht gelesen werden.' });
  }

  // Unsichtbares Feld, das nur automatische Programme ausfüllen.
  if (eingabe.website) return antwort(200, { zeit: zeitpunkt() });

  const name = einzeilig(eingabe.name, 120);
  const bestellnummer = einzeilig(eingabe.bestellnummer, 60);
  const email = einzeilig(eingabe.email, 160);
  const artikel = String(eingabe.artikel || '')
    .replace(/\r/g, '')
    .trim()
    .slice(0, 1000);

  if (!name || !bestellnummer) return antwort(400, { fehler: 'Bitte gib deinen Namen und die Bestellnummer an.' });
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email)) {
    return antwort(400, { fehler: 'Bitte gib eine gültige E-Mail-Adresse an.' });
  }
  if (!postBereit()) {
    return antwort(503, {
      fehler: `Die Online-Funktion ist gerade nicht verfügbar. Bitte sende deinen Widerruf per E-Mail an ${SITE.mail}.`,
    });
  }

  const zeit = zeitpunkt();
  const erklaerung = [
    'Erklärung:',
    'Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der folgenden Waren.',
    '',
    `Name: ${name}`,
    `Bestellnummer: ${bestellnummer}`,
    `E-Mail: ${email}`,
    `Betroffene Artikel: ${artikel || 'gesamte Bestellung'}`,
    '',
    `Eingegangen am: ${zeit}`,
  ].join('\n');

  try {
    await senden({
      an: email,
      betreff: `Eingangsbestätigung: Widerruf zur Bestellung ${bestellnummer}`,
      text: mitFuss(
        [
          `Hallo ${name},`,
          '',
          'wir haben deine Widerrufserklärung über unsere Online-Funktion erhalten und bestätigen hiermit ihren Eingang.',
          '',
          erklaerung,
          '',
          'Wie es weitergeht, steht in der Widerrufsbelehrung: https://www.dirndltaler-oberbrand.at/widerrufsbelehrung',
          `Hast du diese Erklärung nicht selbst abgegeben, melde dich bitte bei uns: ${SITE.mail}`,
        ].join('\n'),
      ),
    });
    await senden({
      an: SITE.mail,
      betreff: `Widerruf eingegangen: Bestellung ${bestellnummer}`,
      text: `Über die Online-Funktion ist ein Widerruf eingegangen. Der Kunde hat die Eingangsbestätigung erhalten.\n\n${erklaerung}\n\nRückzahlung binnen 14 Tagen ab Eingang; sie darf verweigert werden, bis die Ware zurück ist oder der Kunde den Versand nachweist.`,
      antwortAn: email,
    });
    return antwort(200, { zeit });
  } catch (grund) {
    console.error('Widerruf fehlgeschlagen:', grund && grund.message);
    return antwort(502, {
      fehler: `Die Bestätigung konnte nicht gesendet werden. Bitte sende deinen Widerruf per E-Mail an ${SITE.mail}.`,
    });
  }
};
