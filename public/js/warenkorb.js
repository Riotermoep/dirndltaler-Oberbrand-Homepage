// Warenkorb im Browser. Es werden keine Daten an einen Server geschickt.
(function () {
  var SCHLUESSEL = 'oberbrand-warenkorb';
  var speicher = {}; // Ersatz, falls der Browser keinen Speicher erlaubt

  function lesen() {
    try {
      var roh = window.localStorage.getItem(SCHLUESSEL);
      return roh ? JSON.parse(roh) : {};
    } catch (e) {
      return speicher;
    }
  }

  function schreiben(korb) {
    speicher = korb;
    try {
      window.localStorage.setItem(SCHLUESSEL, JSON.stringify(korb));
    } catch (e) {
      /* ohne Speicher gilt der Warenkorb nur für diese Seite */
    }
    anzahlZeigen();
  }

  function anzahl(korb) {
    return Object.keys(korb).reduce(function (summe, slug) {
      return summe + korb[slug];
    }, 0);
  }

  function anzahlZeigen() {
    var n = anzahl(lesen());
    document.querySelectorAll('[data-korb-anzahl]').forEach(function (el) {
      el.textContent = String(n);
    });
  }

  var euro = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });

  // Ein Eintrag im Warenkorb heißt "sorte|ml", z. B. "marille|350".
  function teilen(schluessel) {
    var teile = schluessel.split('|');
    return { slug: teile[0], ml: teile[1] };
  }

  // Produktseite: "In den Warenkorb"
  document.querySelectorAll('[data-in-den-korb]').forEach(function (formular) {
    formular.addEventListener('submit', function (ereignis) {
      ereignis.preventDefault();
      var slug = formular.getAttribute('data-in-den-korb');
      var groesse = formular.querySelector('input[name="groesse"]:checked');
      if (!groesse) return;
      var menge = parseInt(formular.querySelector('input[name="menge"]').value, 10);
      if (!menge || menge < 1) menge = 1;
      var schluessel = slug + '|' + groesse.value;
      var korb = lesen();
      korb[schluessel] = (korb[schluessel] || 0) + menge;
      schreiben(korb);
      var meldung = formular.parentNode.querySelector('[data-korb-meldung]');
      if (meldung) meldung.classList.remove('versteckt');
    });
  });

  // Warenkorbseite
  var liste = document.querySelector('[data-korb-liste]');
  if (liste) {
    var daten = JSON.parse(document.getElementById('sorten-daten').textContent);
    var sorten = daten.sorten;
    var versand = daten.versand;
    var leer = document.querySelector('[data-korb-leer]');
    var voll = document.querySelector('[data-korb-voll]');
    var summeFeld = document.querySelector('[data-korb-summe]');
    var versandFeld = document.querySelector('[data-korb-versand]');
    var gesamtFeld = document.querySelector('[data-korb-gesamt]');

    function preisVon(schluessel) {
      var t = teilen(schluessel);
      var sorte = sorten[t.slug];
      if (!sorte || sorte.groessen[t.ml] == null) return null;
      return sorte.groessen[t.ml];
    }

    function zeichnen() {
      var korb = lesen();
      // Einträge, die es im Sortiment nicht mehr gibt, fallen heraus.
      var veraltet = Object.keys(korb).filter(function (s) {
        return preisVon(s) == null;
      });
      if (veraltet.length) {
        veraltet.forEach(function (s) {
          delete korb[s];
        });
        schreiben(korb);
      }
      var eintraege = Object.keys(korb);
      liste.textContent = '';
      var summe = 0;

      eintraege.forEach(function (schluessel) {
        var t = teilen(schluessel);
        var titel = sorten[t.slug].name + ', ' + t.ml + ' ml';
        var einzelpreis = preisVon(schluessel);
        var zeile = document.createElement('tr');

        var name = document.createElement('th');
        name.scope = 'row';
        var link = document.createElement('a');
        link.href = '/sorten/' + t.slug + '/';
        link.textContent = titel;
        name.appendChild(link);

        var menge = document.createElement('td');
        var feld = document.createElement('input');
        feld.type = 'number';
        feld.min = '1';
        feld.value = String(korb[schluessel]);
        feld.setAttribute('aria-label', 'Menge ' + titel);
        feld.style.width = '5rem';
        feld.style.minHeight = '2.75rem';
        feld.addEventListener('change', function () {
          var neu = parseInt(feld.value, 10);
          var k = lesen();
          if (!neu || neu < 1) delete k[schluessel];
          else k[schluessel] = neu;
          schreiben(k);
          zeichnen();
        });
        menge.appendChild(feld);

        var preis = document.createElement('td');
        preis.className = 'zahl';
        preis.textContent = euro.format(einzelpreis * korb[schluessel]);
        summe += einzelpreis * korb[schluessel];

        var weg = document.createElement('td');
        weg.className = 'zahl';
        var knopf = document.createElement('button');
        knopf.type = 'button';
        knopf.className = 'knopf';
        knopf.textContent = 'Entfernen';
        knopf.setAttribute('aria-label', titel + ' entfernen');
        knopf.addEventListener('click', function () {
          var k = lesen();
          delete k[schluessel];
          schreiben(k);
          zeichnen();
        });
        weg.appendChild(knopf);

        zeile.appendChild(name);
        zeile.appendChild(menge);
        zeile.appendChild(preis);
        zeile.appendChild(weg);
        liste.appendChild(zeile);
      });

      var versandkosten = summe >= versand.freiAb ? 0 : versand.pauschale;
      leer.classList.toggle('versteckt', eintraege.length > 0);
      voll.classList.toggle('versteckt', eintraege.length === 0);
      summeFeld.textContent = euro.format(summe);
      versandFeld.textContent = versandkosten === 0 ? 'kostenlos' : euro.format(versandkosten);
      gesamtFeld.textContent = euro.format(summe + versandkosten);
    }

    zeichnen();
  }

  anzahlZeigen();
})();
