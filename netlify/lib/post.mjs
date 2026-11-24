// E-Mail-Versand über das eigene Postfach (SMTP).
//
// Zugangsdaten stehen nur in Netlify unter "Keys and secrets":
//   SMTP_HOST, SMTP_PORT (587 oder 465), SMTP_USER, SMTP_PASS
// Optional MAIL_FROM, sonst wird die Adresse aus site.js verwendet.

import nodemailer from 'nodemailer';
import { SITE } from '../../src/data/site.js';

export function postBereit() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transport;
function verbindung() {
  if (!transport) {
    const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
}

// Eine Zeile ohne Zeilenumbrüche, damit niemand Kopfzeilen einschleusen kann.
export function einzeilig(text, laenge = 200) {
  return String(text || '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, laenge);
}

export async function senden({ an, betreff, text, antwortAn, anhaenge }) {
  const absender = process.env.MAIL_FROM || SITE.mail;
  return verbindung().sendMail({
    from: { name: SITE.name, address: absender },
    to: an,
    replyTo: antwortAn || SITE.mail,
    subject: einzeilig(betreff, 150),
    text,
    attachments: anhaenge,
  });
}

const FUSS = [
  '',
  '--',
  SITE.firma,
  `${SITE.strasse}, ${SITE.ort}`,
  `Telefon ${SITE.telefon} · ${SITE.mail}`,
  `${SITE.firmenbuch}, ${SITE.firmenbuchgericht} · UID ${SITE.uid}`,
].join('\n');

export function mitFuss(text) {
  return `${text.trimEnd()}\n${FUSS}\n`;
}

export function zeitpunkt(datum = new Date()) {
  const tag = new Intl.DateTimeFormat('de-AT', { timeZone: 'Europe/Vienna', dateStyle: 'long' }).format(datum);
  const uhr = new Intl.DateTimeFormat('de-AT', { timeZone: 'Europe/Vienna', hour: '2-digit', minute: '2-digit' }).format(datum);
  return `${tag}, ${uhr} Uhr`;
}
