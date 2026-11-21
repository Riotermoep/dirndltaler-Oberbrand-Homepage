// Kasse: zeigt die Bestellung und startet die Bezahlung bei Stripe.
(function () {
  var SCHLUESSEL = 'oberbrand-warenkorb';
  var formular = document.querySelector('[data-kasse]');
  if (!formular) return;

  var daten = JSON.parse(document.getElementById('sorten-daten').textContent);
  var sorten = daten.sorten;
  var versand = daten.versand;
  var euro = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });

  var leer = document.querySelector('[data-kasse-leer]');
  var liste = document.querySelector('[data-kasse-liste]');
  var summeFeld = document.querySelector('[data-kasse-summe]');
  var versandFeld = document.querySelector('[data-kasse-versand]');
  var versandTitel = document.querySelector('[data-kasse-versandtitel]');
  var gesamtFeld = document.querySelector('[data-kasse-gesamt]');
  var fehlerFeld = document.querySelector('[data-kasse-fehler]');
  var knopf = document.querySelector('[data-kasse-knopf]');

  function korb() {
    try {
      var roh = window.localStorage.getItem(SCHLUESSEL);
      return roh ? JSON.parse(roh) : {};
    } catch (e) {
      return {};
    }
  }

  function positionen() {
    var k = korb();
    return Object.keys(k)
      .map(function (schluessel) {
        var teile = schluessel.split('|');
        var sorte = sorten[teile[0]];
        if (!sorte || sorte.groessen[teile[1]] == null) return null;
        return { slug: teile[0], ml: teile[1], menge: k[schluessel], name: sorte.name, preis: sorte.groessen[teile[1]] };
      })
      .filter(Boolean);
  }

  function lieferart() {
    var gewaehlt = formular.querySelector('input[name="lieferart"]:checked');
    return gewaehlt ? gewaehlt.value : 'versand';
  }

  function zeichnen() {
    var pos = positionen();
    leer.classList.toggle('versteckt', pos.length > 0);
    formular.classList.toggle('versteckt', pos.length === 0);
    liste.textContent = '';
    var summe = 0;
    pos.forEach(function (p) {
      var zeile = document.createElement('tr');
      var name = document.createElement('th');
      name.scope = 'row';
      name.textContent = p.name + ', ' + p.ml + ' ml';
      var menge = document.createElement('td');
      menge.className = 'zahl';
      menge.textContent = String(p.menge);
      var preis = document.createElement('td');
      preis.className = 'zahl';
      preis.textContent = euro.format(p.preis * p.menge);
      summe += p.preis * p.menge;
      zeile.appendChild(name);
      zeile.appendChild(menge);
      zeile.appendChild(preis);
      liste.appendChild(zeile);
    });
    var abholung = lieferart() === 'abholung';
    var kosten = abholung || summe >= versand.freiAb ? 0 : versand.pauschale;
    versandTitel.textContent = abholung ? 'Abholung ab Hof' : 'Versand innerhalb Österreichs';
    summeFeld.textContent = euro.format(summe);
    versandFeld.textContent = kosten === 0 ? 'kostenlos' : euro.format(kosten);
    gesamtFeld.textContent = euro.format(summe + kosten);
  }

  function fehler(text) {
    fehlerFeld.textContent = text;
    fehlerFeld.classList.toggle('versteckt', !text);
  }

  function volljaehrig(wert) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(wert)) return false;
    var t = wert.split('-').map(Number);
    var achtzehn = new Date(t[0] + 18, t[1] - 1, t[2]);
    return t[0] >= 1900 && achtzehn.getTime() <= Date.now();
  }

  formular.querySelectorAll('input[name="lieferart"]').forEach(function (feld) {
    feld.addEventListener('change', zeichnen);
  });

  formular.addEventListener('submit', function (ereignis) {
    ereignis.preventDefault();
    fehler('');
    var geburtsdatum = formular.querySelector('input[name="geburtsdatum"]').value;
    var alter = formular.querySelector('input[name="alter"]').checked;
    var bedingungen = formular.querySelector('input[name="bedingungen"]').checked;

    if (!geburtsdatum) return fehler('Bitte gib dein Geburtsdatum an.');
    if (!volljaehrig(geburtsdatum)) return fehler('Wir verkaufen nur an Personen ab 18 Jahren.');
    if (!alter) return fehler('Bitte bestätige, dass du mindestens 18 Jahre alt bist.');
    if (!bedingungen) return fehler('Bitte bestätige, dass du AGB und Widerrufsbelehrung gelesen hast.');

    knopf.disabled = true;
    knopf.textContent = 'Einen Moment …';

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        lieferart: lieferart(),
        geburtsdatum: geburtsdatum,
        alterBestaetigt: alter,
        bedingungenGelesen: bedingungen,
        positionen: positionen().map(function (p) {
          return { slug: p.slug, ml: p.ml, menge: p.menge };
        }),
      }),
    })
      .then(function (antwort) {
        return antwort
          .json()
          .catch(function () {
            return {};
          })
          .then(function (inhalt) {
            if (!antwort.ok || !inhalt.url) throw new Error(inhalt.fehler || '');
            window.location.href = inhalt.url;
          });
      })
      .catch(function (grund) {
        knopf.disabled = false;
        knopf.textContent = 'Zahlungspflichtig bestellen';
        fehler(grund.message || 'Die Bezahlung konnte nicht gestartet werden. Bitte versuche es noch einmal.');
      });
  });

  zeichnen();
})();
