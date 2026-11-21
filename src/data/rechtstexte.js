// Die Rechtstexte an einer Stelle. Die Seiten AGB und Widerrufsbelehrung
// und die Bestätigungs-E-Mails verwenden genau diesen Wortlaut.
//
// Änderungen nur nach Rücksprache mit dem Anwalt. Die Widerrufsbelehrung
// folgt dem gesetzlichen Muster und wird nicht umformuliert.

import { SITE } from './site.js';
import { euroText } from './sorten.js';

export const STAND = '21. November 2026';

export function agb() {
  return [
    {
      titel: `1. Geltungsbereich`,
      absaetze: [
        `1.1 Diese AGB gelten für alle Bestellungen über den Webshop www.dirndltaler-oberbrand.at der ${SITE.firma}, ${SITE.strasse}, ${SITE.ort} (im Folgenden „wir“).`,
        `1.2 Unser Angebot richtet sich an Verbraucher und Unternehmer mit Lieferadresse in Österreich. Zwingende Bestimmungen des Konsumentenschutzes bleiben unberührt.`,
        `1.3 Vertragssprache ist Deutsch.`,
      ],
    },
    {
      titel: `2. Vertragsabschluss`,
      absaetze: [
        `2.1 Die Darstellung der Waren im Webshop ist kein bindendes Angebot, sondern eine Einladung zur Bestellung.`,
        `2.2 Mit dem Klick auf „zahlungspflichtig bestellen“ gibst du ein verbindliches Angebot ab. Bis dahin kannst du deine Eingaben in der Bestellübersicht prüfen und korrigieren.`,
        `2.3 Wir bestätigen den Eingang der Bestellung unverzüglich per E-Mail. Diese Eingangsbestätigung ist noch keine Annahme.`,
        `2.4 Der Vertrag kommt zustande, wenn wir die Bestellung mit einer gesonderten E-Mail annehmen oder die Ware versenden, spätestens innerhalb von 5 Werktagen.`,
        `2.5 Wir speichern den Vertragstext und senden ihn dir mit diesen AGB, der Widerrufsbelehrung samt Muster-Widerrufsformular und der EU-Gewährleistungsmitteilung per E-Mail zu (Vertragsbestätigung).`,
      ],
    },
    {
      titel: `3. Verkauf nur an Volljährige`,
      absaetze: [
        `3.1 Wir verkaufen Spirituosen ausschließlich an Personen ab 18 Jahren. Im Bestellvorgang bestätigst du, dass du volljährig bist.`,
        `3.2 Wir übergeben die Ware nur an dich oder an eine andere volljährige Person an der Lieferadresse, und nur nach Prüfung eines amtlichen Lichtbildausweises durch den Zusteller oder, bei Abholung, durch uns. Abstellgenehmigungen und die Hinterlegung in Paket- oder Abholstationen ohne Altersprüfung sind ausgeschlossen.`,
        `3.3 Kann die Altersprüfung nicht erfolgreich durchgeführt werden, findet keine Übergabe statt und die Ware geht an uns zurück. Gesetzliche Ansprüche auf Ersatz von Mehrkosten, die du schuldhaft verursacht hast, bleiben vorbehalten; wir verrechnen sie nur in nachgewiesener Höhe.`,
      ],
    },
    {
      titel: `4. Preise und Versandkosten`,
      absaetze: [
        `4.1 Alle Preise sind Gesamtpreise in Euro und enthalten die gesetzliche Umsatzsteuer und die Alkoholsteuer.`,
        `4.2 Versandkosten werden vor Abgabe der Bestellung gesondert ausgewiesen: ${euroText(SITE.versand.pauschale)} je Bestellung, ab einem Bestellwert von ${euroText(SITE.versand.freiAb)} versandkostenfrei. Bei Abholung ab Hof fallen keine Versandkosten an.`,
      ],
    },
    {
      titel: `5. Lieferung und Abholung`,
      absaetze: [
        `5.1 Wir liefern ausschließlich an Adressen in Österreich.`,
        `5.2 Die Lieferung erfolgt innerhalb von 3 bis 5 Werktagen nach Zahlungseingang, spätestens innerhalb von 30 Tagen.`,
        `5.3 Abholung ab Hof ist nach telefonischer Terminvereinbarung möglich.`,
        `5.4 Ist eine Ware nicht verfügbar, informieren wir dich unverzüglich und erstatten bereits geleistete Zahlungen.`,
        `5.5 Bei Verbrauchern geht die Gefahr erst mit Übergabe der Ware an dich oder einen von dir benannten Empfänger über.`,
        `5.6 Wir liefern jede Bestellung in einer Sendung.`,
      ],
    },
    {
      titel: `6. Zahlung`,
      absaetze: [
        `6.1 Wir akzeptieren folgende Zahlungsarten: ${SITE.zahlungsarten}.`,
        `6.2 Die Zahlung wird über den Zahlungsdienstleister ${SITE.zahlungsdienst} abgewickelt und ist mit der Bestellung fällig.`,
      ],
    },
    {
      titel: `7. Eigentumsvorbehalt`,
      absaetze: [
        `Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.`,
      ],
    },
    {
      titel: `8. Rücktrittsrecht`,
      absaetze: [
        `Verbrauchern steht ein gesetzliches Rücktrittsrecht zu. Die Einzelheiten stehen in der Widerrufsbelehrung.`,
      ],
    },
    {
      titel: `9. Gewährleistung`,
      absaetze: [
        `9.1 Es gelten die gesetzlichen Gewährleistungsbestimmungen. Die EU-weit einheitliche Mitteilung über dein gesetzliches Gewährleistungsrecht findest du auf jeder Produktseite und im Bestellvorgang; wir senden sie dir zusätzlich mit der Vertragsbestätigung.`,
        `9.2 Wir geben keine Hersteller- oder Haltbarkeitsgarantie ab.`,
        `9.3 Unsere Brände, Geiste und Liköre sind Naturprodukte. Geringe Unterschiede in Farbe, Trübung oder Geschmack zwischen Jahrgängen und Chargen sind produkttypisch und für sich allein kein Mangel, sofern das Produkt der Produktbeschreibung entspricht.`,
        `9.4 Bitte melde uns sichtbare Transportschäden möglichst rasch, am besten mit Foto. Deine Gewährleistungsrechte bleiben davon unberührt, auch wenn du nicht oder später meldest.`,
      ],
    },
    {
      titel: `10. Haftung`,
      absaetze: [
        `10.1 Bist du Verbraucher, haften wir nach den gesetzlichen Bestimmungen.`,
        `10.2 Bist du Unternehmer, haften wir nur bei Vorsatz oder grober Fahrlässigkeit; das gilt nicht für Personenschäden.`,
        `10.3 Ansprüche nach dem Produkthaftungsgesetz bleiben unberührt.`,
      ],
    },
    {
      titel: `11. Recht und Gerichtsstand`,
      absaetze: [
        `11.1 Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts.`,
        `11.2 Für Verbraucher gilt der gesetzliche Gerichtsstand. Für Unternehmer ist das sachlich zuständige Gericht in St. Pölten vereinbart.`,
      ],
    },
    {
      titel: `12. Schlussbestimmung`,
      absaetze: [
        `Sollte eine Bestimmung unwirksam sein, bleiben die übrigen Bestimmungen wirksam. Gegenüber Verbrauchern tritt an die Stelle der unwirksamen Bestimmung die gesetzliche Regelung.`,
      ],
    },
  ];
}

export function widerrufsbelehrung() {
  return [
    {
      titel: `Widerrufsrecht`,
      absaetze: [
        `Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.`,
        `Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.`,
        `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${SITE.firma}, ${SITE.strasse}, ${SITE.ort}, Telefon ${SITE.telefon}, E-Mail ${SITE.mail}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
        `Sie können Ihr Widerrufsrecht auch online unter www.dirndltaler-oberbrand.at/widerruf (Schaltfläche „Vertrag widerrufen“ im Fußbereich jeder Seite) ausüben. Wenn Sie diese Online-Funktion nutzen, übermitteln wir Ihnen auf einem dauerhaften Datenträger (z. B. durch eine E-Mail) unverzüglich eine Eingangsbestätigung mit Informationen zum Inhalt der Widerrufserklärung sowie dem Datum und der Uhrzeit ihres Eingangs.`,
        `Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.`,
      ],
    },
    {
      titel: `Folgen des Widerrufs`,
      absaetze: [
        `Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.`,
        `Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.`,
        `Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.`,
        `Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.`,
        `Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.`,
      ],
    },
    {
      titel: `Muster-Widerrufsformular`,
      absaetze: [
        `(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)`,
      ],
      punkte: [
        `An ${SITE.firma}, ${SITE.strasse}, ${SITE.ort}, E-Mail ${SITE.mail}`,
        `Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)`,
        `Bestellt am (*)/erhalten am (*)`,
        `Name des/der Verbraucher(s)`,
        `Anschrift des/der Verbraucher(s)`,
        `Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)`,
        `Datum`,
      ],
    },
  ];
}

export const MUSTER_FUSS = `(*) Unzutreffendes streichen.`;

// Reiner Text für E-Mails.
export function alsText(abschnitte) {
  return abschnitte
    .map((a) => {
      const zeilen = [a.titel.toUpperCase(), ''];
      a.absaetze.forEach((absatz) => zeilen.push(absatz, ''));
      (a.punkte || []).forEach((punkt) => zeilen.push(`- ${punkt}`));
      if (a.punkte) zeilen.push('', MUSTER_FUSS);
      return zeilen.join('\n').trimEnd();
    })
    .join('\n\n');
}
