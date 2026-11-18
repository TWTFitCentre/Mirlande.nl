/* FitCoach Mirlande – site.js (zonder afhankelijkheden) */
(function () {
  'use strict';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- Gratis kennismaking: knop -> keuze Middelharnis / Online ---------- */
  function setK(open) {
    $$('.k-closed').forEach(function (el) { el.hidden = open; });
    $$('.k-open').forEach(function (el) { el.hidden = !open; });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-k]');
    if (!t) return;
    if (t.getAttribute('data-k') === 'open') {
      setK(true);
      if (t.tagName === 'A' && t.getAttribute('href') === '#kennismaken') {
        e.preventDefault();
        var target = $('#kennismaken');
        if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); history.replaceState(null, '', '#kennismaken'); }
      }
    } else {
      setK(false);
    }
  });

  /* ---------- Pakketten ---------- */
  var PAK = [
    { key: 'basic', name: 'Basic', kicker: 'De basis van jouw FitPlan', desc: 'Basispakket voor de start van jouw FitPlan, met ondersteunende supplementen voor de aanvulling van vitaminen, mineralen en proteïne.', items: ['Aloë drank', 'Thee', 'Formula 1 shake'], focus: ['Energie', 'Vetverlies'], best: false },
    { key: 'plus', name: 'Plus', kicker: 'Basic met extra proteïne', desc: 'Een upgrade van het basispakket, met extra ondersteuning bij jouw doel: vitaliteit, vetverlies en/of opbouw van spiermassa.', items: ['Alles uit Basic', 'Proteïne Drink Mix'], focus: ['Energie', 'Vetverlies', 'Spiermassa'], best: false },
    { key: 'premium', name: 'Premium', kicker: 'Plus met extra vezels', desc: 'Een upgrade van het pluspakket, met extra aandacht voor je vezelinname en verzadiging.', items: ['Alles uit Plus', 'Multivezel', 'Gratis shaker'], focus: ['Energie', 'Vetverlies', 'Spiermassa'], best: true },
    { key: 'ultimate', name: 'Ultimate', kicker: 'Het meest complete pakket', desc: 'Een upgrade van het premiumpakket, met extra aandacht bij jouw doel: vetverlies en/of opbouw van spiermassa.', items: ['Alles uit Premium', 'Phyto Complete', 'Gratis shaker'], focus: ['Energie', 'Vetverlies', 'Spiermassa', 'Focus'], best: false }
  ];
  var PRICE = [
    { basic: 179.99, plus: 254.99, premium: 299.99, ultimate: 384.99 },
    { basic: 139.89, plus: 197.11, premium: 231.21, ultimate: 297.12 },
    { basic: 123.27, plus: 173.69, premium: 203.74, ultimate: 261.82 }
  ];
  var NOTES = [
    'Dit betaal je als je start. Het is de adviesprijs, inclusief btw.',
    'Dit betaal je als member, of direct bij je start als je voor 2 maanden bestelt.',
    'Dit betaal je als member na 2 à 3 maanden, of direct bij je start als je voor 3 maanden bestelt.'
  ];
  var fmt = function (n) { return '€ ' + n.toFixed(2).replace('.', ','); };
  var pakIdx = 0, tierIdx = 0;
  function setPressed(btns, idx) {
    btns.forEach(function (b, i) {
      var on = i === idx;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = on ? '#142836' : '#ffffff';
      b.style.color = on ? '#ffffff' : '#142836';
    });
  }
  function renderPak() {
    var p = PAK[pakIdx];
    if (!$('#pk-name')) return;
    $('#pk-chip').textContent = 'Voorbeeld · ' + p.name;
    $('#pk-best').hidden = !p.best;
    $$('.pk-stage').forEach(function (st) {
      var show = st.getAttribute('data-pak') === String(pakIdx);
      if (show && st.hidden) { // animatie opnieuw laten vallen
        $$('.pkdrop', st).forEach(function (img) { img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; });
      }
      st.hidden = !show;
    });
    $('#pk-kicker').textContent = p.kicker;
    $('#pk-name').textContent = p.name;
    $('#pk-desc').textContent = p.desc;
    $('#pk-items').innerHTML = p.items.map(function (it) {
      return '<div style="display: flex; gap: 10px; align-items: flex-start;"><span style="flex: none; width: 8px; height: 8px; border-radius: 50%; background: #1399a3; margin-top: 10px;"></span><span>' + esc(it) + '</span></div>';
    }).join('');
    $('#pk-focus').innerHTML = p.focus.map(function (f) {
      return '<span style="border: 1.5px solid #d9e8ea; border-radius: 999px; padding: 6px 14px; font-size: 14px; font-weight: 500; color: #142836;">' + esc(f) + '</span>';
    }).join('');
    $('#pk-price').textContent = fmt(PRICE[tierIdx][p.key]);
    $('#pk-note').textContent = NOTES[tierIdx];
    setPressed($$('.pk-tab'), pakIdx);
    setPressed($$('.pk-tier'), tierIdx);
  }
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.pk-tab'), tier = e.target.closest('.pk-tier');
    if (tab) { pakIdx = +tab.getAttribute('data-pak'); renderPak(); }
    if (tier) { tierIdx = +tier.getAttribute('data-tier'); renderPak(); }
  });

  /* ---------- Veelgestelde vragen ---------- */
  document.addEventListener('click', function (e) {
    var q = e.target.closest('.faq-q');
    if (!q) return;
    var open = q.getAttribute('aria-expanded') === 'true';
    $$('.faq-q').forEach(function (b) {
      var on = b === q && !open;
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
      $('.faq-sign', b).textContent = on ? '−' : '+';
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
  });

  /* ---------- Vragenlijst (drempelverlager) ---------- */
  var FORM_ENDPOINT = window.FITCHECK_FORM_ENDPOINT || ''; // Google Apps Script web-app URL
  var STEPS = [
    { key: 'goal', multi: true, q: 'Waar mag ik je mee helpen? Je mag meer dan één kiezen.', opts: ['Meer energie', 'Gewicht verliezen', 'Spiermassa opbouwen', 'Een gezonde levensstijl', 'Body transformatie programma'] },
    { key: 'age', q: 'Hoe oud ben je?', opts: ['18 tot 25', '25 tot 35', '35 tot 45', '45 tot 55', '55 tot 65', '65 plus'] },
    { key: 'focus', text: true, q: 'Wat is het allerbelangrijkste waar je nu aan wilt werken op het gebied van gezondheid en energie?' },
    { key: 'block', text: true, q: 'Wat houdt je op dit moment het meeste tegen om dat doel te bereiken?' },
    { key: 'urgency', q: 'Hoe belangrijk is het voor jou om dit nu aan te pakken? Op een schaal van 1 tot 5.', opts: [
      '1. Helemaal niet belangrijk',
      '2. Niet zo belangrijk. Ik wil wel veranderen, maar het hoeft niet per se nu.',
      '3. Neutraal. Ik twijfel nog en heb niet echt een plan of een duidelijk doel.',
      '4. Belangrijk. Ik wil serieus aan de slag en zoek handvatten om mijn doelen te behalen.',
      '5. Zeer belangrijk. Ik wil nu veranderen en ben super gemotiveerd om direct aan de slag te gaan.'] },
    { key: 'budget', q: 'Stel je zou in jezelf investeren: wat voelt voor jou per dag realistisch?', opts: ['€ 6 tot € 7 per dag', '€ 8 tot € 10 per dag', '€ 10 of meer per dag', 'Geen idee, ik bespreek graag de mogelijkheden'] },
    { key: 'contact', contact: true, q: 'Hoe kan ik je bereiken?' }
  ];
  var st = { step: 0, ans: { goal: [] }, text: {}, naam: '', mail: '', tel: '', agree: false, err: '', sent: false, busy: false };
  var root = $('#fc-root');
  var INPUT = 'font: inherit; padding: 14px 16px; border: 1.5px solid #7a9a9e; border-radius: 12px; min-height: 48px; box-sizing: border-box; width: 100%; background: #ffffff;';
  var chip = function (on) { return 'text-align: left; border: 1.5px solid #0e7580; border-radius: 14px; padding: 12px 16px; min-height: 48px; font: inherit; font-size: 16px; line-height: 1.4; font-weight: 500; cursor: pointer; ' + (on ? 'background: #0e7580; color: #ffffff;' : 'background: #ffffff; color: #142836;'); };

  function renderForm() {
    if (!root) return;
    if (st.sent) {
      root.innerHTML =
        '<div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">' +
        '<div style="width: 56px; height: 56px; border-radius: 50%; background: #0e7580; color: #ffffff; display: flex; align-items: center; justify-content: center;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></div>' +
        '<p style="margin: 0; font-size: 24px; font-weight: 700; color: #142836;">Bedankt!</p>' +
        '<p style="margin: 0; color: #3d5f63;">Ik heb je aanvraag ontvangen en neem op werkdagen binnen 24 uur persoonlijk contact met je op. Wil je niet wachten? Plan dan nu zelf je gratis kennismaking.</p>' +
        '<a href="#kennismaken" data-k="open" style="display: inline-block; background: #0e7580; color: #ffffff; padding: 14px 26px; border-radius: 999px; font-weight: 600;">Plan direct je afspraak</a>' +
        '</div>';
      return;
    }
    var cur = STEPS[st.step], n = STEPS.length;
    var isContact = !!cur.contact, isText = !!cur.text, isChoice = !isText && !isContact;
    var h = '';
    h += '<p style="margin: 0 0 4px; font-size: 20px; line-height: 1.35; font-weight: 700; color: #142836;">Nog even rondkijken? Vertel me eerst waar je mee zit</p>';
    h += '<p style="margin: 0 0 14px; font-size: 15px; color: #3d5f63;">Een paar korte vragen, daarna neem ik persoonlijk contact met je op. Vrijblijvend.</p>';
    h += '<div style="display: flex; gap: 12px; align-items: center; margin-bottom: 18px;"><div style="flex: 1; height: 8px; background: #ffffff; border-radius: 999px; overflow: hidden;"><div style="height: 100%; background: var(--accent); border-radius: 999px; width: ' + Math.round(((st.step + 1) / n) * 100) + '%;"></div></div><span style="flex: none; font-size: 14px; color: #3d5f63; font-weight: 600;">Vraag ' + (st.step + 1) + ' van ' + n + '</span></div>';
    h += '<p style="margin: 0 0 14px; font-size: 18px; line-height: 1.4; font-weight: 600; color: #142836;">' + esc(cur.q) + '</p>';
    if (isChoice) {
      h += '<div style="display: flex; flex-direction: column; gap: 8px;">' + cur.opts.map(function (o) {
        var on = cur.multi ? st.ans.goal.indexOf(o) >= 0 : st.ans[cur.key] === o;
        return '<button type="button" class="fc-opt" data-opt="' + esc(o) + '" aria-pressed="' + on + '" style="' + chip(on) + '">' + esc(o) + '</button>';
      }).join('') + '</div>';
    }
    if (isText) {
      h += '<textarea class="fc-text" rows="4" aria-label="' + esc(cur.q) + '" style="' + INPUT + ' resize: vertical;">' + esc(st.text[cur.key] || '') + '</textarea>';
      h += '<div style="font-size: 14px; color: #3d5f63; margin-top: 6px;">Vul in wat je kwijt wilt. We bespreken de rest in de FitCheck.</div>';
    }
    if (st.err && !isContact) h += '<div role="alert" style="font-size: 14px; color: #a12a2a; font-weight: 600; margin-top: 8px;">' + esc(st.err) + '</div>';
    if (isContact) {
      h += '<div style="display: flex; flex-direction: column; gap: 10px;">';
      h += '<input class="fc-naam" type="text" autocomplete="name" placeholder="Je volledige naam" aria-label="Je volledige naam" value="' + esc(st.naam) + '" style="' + INPUT + '">';
      h += '<input class="fc-mail" type="email" autocomplete="email" placeholder="Je e-mailadres" aria-label="Je e-mailadres" value="' + esc(st.mail) + '" style="' + INPUT + '">';
      h += '<input class="fc-tel" type="tel" autocomplete="tel" placeholder="Je telefoonnummer" aria-label="Je telefoonnummer" value="' + esc(st.tel) + '" style="' + INPUT + '">';
      h += '<div style="display: flex; gap: 12px; align-items: flex-start; margin-top: 4px;"><input id="fc-akkoord" class="fc-agree" type="checkbox"' + (st.agree ? ' checked' : '') + ' style="width: 22px; height: 22px; margin: 3px 0 0; flex: none;"><label for="fc-akkoord" style="font-size: 13px; line-height: 1.5; color: #3d5f63;">Ik geef toestemming dat Mirlande mijn gegevens, ook wat ik hierboven heb ingevuld, gebruikt om contact met me op te nemen en mijn FitCheck voor te bereiden. Dat mag gezondheidsinformatie zijn als ik die zelf invul. Ik kan mijn toestemming altijd intrekken. Lees de <a href="https://drive.google.com/file/d/19xrLmwKiqtJJMl2PzHzuhKj-n2Kn9Sa9/view" target="_blank" rel="noopener" style="text-decoration: underline;">privacyverklaring</a>.</label></div>';
      if (st.err) h += '<div role="alert" style="font-size: 14px; color: #a12a2a; font-weight: 600;">' + esc(st.err) + '</div>';
      h += '</div>';
    }
    h += '<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; align-items: center;">';
    if (st.step > 0) h += '<button type="button" class="fc-back" style="background: #ffffff; color: #142836; border: 1.5px solid #0e7580; border-radius: 999px; padding: 12px 22px; min-height: 48px; font-size: 16px; font-weight: 600; cursor: pointer;">Terug</button>';
    if (cur.multi || isText || isContact) h += '<button type="button" class="fc-next" ' + (st.busy ? 'disabled ' : '') + 'style="background: #0e7580; color: #ffffff; border: 0; border-radius: 999px; padding: 12px 26px; min-height: 48px; font-size: 16px; font-weight: 600; cursor: pointer;">' + (isContact ? (st.busy ? 'Even geduld…' : 'Verstuur mijn aanvraag') : 'Volgende') + '</button>';
    h += '</div>';
    h += '<p style="margin: 14px 0 0; font-size: 14px; color: #3d5f63;">Vrijblijvend. Je zit nergens aan vast. Liever direct een afspraak? <a href="#kennismaken" data-k="open" style="color: #142836; font-weight: 600; text-decoration: underline;">Plan je gratis kennismaking</a>.</p>';
    root.innerHTML = h;
  }

  function readInputs() {
    var cur = STEPS[st.step];
    var ta = $('.fc-text', root); if (ta) st.text[cur.key] = ta.value;
    var a = $('.fc-naam', root); if (a) { st.naam = a.value; st.mail = $('.fc-mail', root).value; st.tel = $('.fc-tel', root).value; st.agree = $('.fc-agree', root).checked; }
  }
  function submitForm() {
    var payload = {
      bron: location.hostname, tijd: new Date().toISOString(),
      doel: st.ans.goal.join(', '), leeftijd: st.ans.age || '', focus: st.text.focus || '', belemmering: st.text.block || '',
      urgentie: st.ans.urgency || '', budget: st.ans.budget || '',
      naam: st.naam.trim(), email: st.mail.trim(), telefoon: st.tel.trim(), toestemming: st.agree ? 'ja' : 'nee'
    };
    st.busy = true; renderForm();
    var done = function () { st.busy = false; st.sent = true; st.err = ''; renderForm(); };
    if (!FORM_ENDPOINT) { console.warn('FITCHECK_FORM_ENDPOINT ontbreekt; aanvraag niet verzonden', payload); setTimeout(done, 400); return; }
    fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(done, function () { st.busy = false; st.err = 'Versturen lukte niet. Probeer het nog eens, of app me op 06-57327138.'; renderForm(); });
  }
  if (root) {
    root.addEventListener('click', function (e) {
      var cur = STEPS[st.step];
      var opt = e.target.closest('.fc-opt');
      if (opt) {
        var v = opt.getAttribute('data-opt');
        if (cur.multi) { var i = st.ans.goal.indexOf(v); i >= 0 ? st.ans.goal.splice(i, 1) : st.ans.goal.push(v); st.err = ''; renderForm(); }
        else { st.ans[cur.key] = v; st.step++; st.err = ''; renderForm(); }
        return;
      }
      if (e.target.closest('.fc-back')) { readInputs(); st.step--; st.err = ''; renderForm(); return; }
      if (e.target.closest('.fc-next')) {
        readInputs();
        if (cur.contact) {
          if (!st.naam.trim() || !(st.mail.trim() || st.tel.trim())) { st.err = 'Vul je naam in en een e-mailadres of telefoonnummer.'; renderForm(); return; }
          if (!st.agree) { st.err = 'Zet een vinkje bij de toestemming, dan kan ik contact met je opnemen.'; renderForm(); return; }
          submitForm(); return;
        }
        if (cur.text && !(st.text[cur.key] || '').trim()) { st.err = 'Vul dit veld in om verder te gaan.'; renderForm(); return; }
        if (cur.multi && !st.ans.goal.length) { st.err = 'Kies minstens één antwoord om verder te gaan.'; renderForm(); return; }
        st.step++; st.err = ''; renderForm();
      }
    });
    renderForm();
  }
  renderPak();
})();
