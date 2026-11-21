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

  // Produktseite: "In den Warenkorb"
  document.querySelectorAll('[data-in-den-korb]').forEach(function (formular) {
    formular.addEventListener('submit', function (ereignis) {
      ereignis.preventDefault();
      var slug = formular.getAttribute('data-in-den-korb');
      var menge = parseInt(formular.querySelector('input[name="menge"]').value, 10);
      if (!menge || menge < 1) menge = 1;
      var korb = lesen();
      korb[slug] = (korb[slug] || 0) + menge;
      schreiben(korb);
      var meldung = formular.parentNode.querySelector('[data-korb-meldung]');
      if (meldung) meldung.classList.remove('versteckt');
    });
  });

  // Warenkorbseite
  var liste = document.querySelector('[data-korb-liste]');
  if (liste) {
    var sorten = JSON.parse(document.getElementById('sorten-daten').textContent);
    var leer = document.querySelector('[data-korb-leer]');
    var voll = document.querySelector('[data-korb-voll]');
    var summeFeld = document.querySelector('[data-korb-summe]');

    function zeichnen() {
      var korb = lesen();
      var slugs = Object.keys(korb).filter(function (s) {
        return sorten[s] && sorten[s].preis != null;
      });
      liste.textContent = '';
      var summe = 0;

      slugs.forEach(function (slug) {
        var sorte = sorten[slug];
        var zeile = document.createElement('tr');

        var name = document.createElement('th');
        name.scope = 'row';
        var link = document.createElement('a');
        link.href = '/sorten/' + slug + '/';
        link.textContent = sorte.name;
        name.appendChild(link);

        var menge = document.createElement('td');
        var feld = document.createElement('input');
        feld.type = 'number';
        feld.min = '1';
        feld.value = String(korb[slug]);
        feld.setAttribute('aria-label', 'Menge ' + sorte.name);
        feld.style.width = '5rem';
        feld.style.minHeight = '2.75rem';
        feld.addEventListener('change', function () {
          var neu = parseInt(feld.value, 10);
          var k = lesen();
          if (!neu || neu < 1) delete k[slug];
          else k[slug] = neu;
          schreiben(k);
          zeichnen();
        });
        menge.appendChild(feld);

        var preis = document.createElement('td');
        preis.className = 'zahl';
        preis.textContent = euro.format(sorte.preis * korb[slug]);
        summe += sorte.preis * korb[slug];

        var weg = document.createElement('td');
        weg.className = 'zahl';
        var knopf = document.createElement('button');
        knopf.type = 'button';
        knopf.className = 'knopf';
        knopf.textContent = 'Entfernen';
        knopf.setAttribute('aria-label', sorte.name + ' entfernen');
        knopf.addEventListener('click', function () {
          var k = lesen();
          delete k[slug];
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

      leer.classList.toggle('versteckt', slugs.length > 0);
      voll.classList.toggle('versteckt', slugs.length === 0);
      summeFeld.textContent = euro.format(summe);
    }

    zeichnen();
  }

  anzahlZeigen();
})();
