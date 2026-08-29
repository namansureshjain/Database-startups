/* =========================================================
   Ganeshotsav site — behaviour
   Everything editable lives in assets/js/config.js
   ========================================================= */
(function () {
  'use strict';

  var DEFAULTS = {
    mandalName: 'श्री गणेश उत्सव मंडळ', mandalNameEn: 'Shree Ganesh Utsav Mandal',
    tagline: 'Ganeshotsav', cityLine: '',
    sthapanaDateTime: '2026-09-14T11:02:00', visarjanDate: '2026-09-25', festivalYear: '2026',
    upiId: '', upiPayeeName: '', qrImage: 'assets/qr.svg', qrIsSample: false,
    causeName: '', causeLine: '', phone: '', phoneLabel: '', whatsapp: '', email: '',
    address: '', mapsUrl: '', instagram: '', youtube: '',
    musicSrc: 'assets/audio/aarti.mp3', musicVolume: .55,
    showWelcomeGate: true, showPetals: true
  };
  var cfg = Object.assign({}, DEFAULTS, window.SITE_CONFIG || {});

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- toast ---------------- */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200);
  }

  /* ---------------- config into the page ---------------- */
  $$('[data-cfg]').forEach(function (el) {
    var v = cfg[el.getAttribute('data-cfg')];
    if (v) el.textContent = v;
  });
  document.title = cfg.mandalNameEn + ' · ' + cfg.tagline;
  var gateTitle = $('#gateTitle'); if (gateTitle) gateTitle.textContent = cfg.mandalNameEn;
  var yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  function fmtDate(iso) {
    var d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  var heroDates = $('#heroDates');
  if (heroDates) {
    heroDates.innerHTML = 'Sthapana · ' + fmtDate(cfg.sthapanaDateTime) +
      ' &nbsp;—&nbsp; Visarjan · ' + fmtDate(cfg.visarjanDate);
  }

  /* ---------------- header + nav ---------------- */
  var head = $('#siteHead'), burger = $('#burger'), nav = $('#nav');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (window.innerWidth < 900) document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setNav(burger.getAttribute('aria-expanded') !== 'true');
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) setNav(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 900) setNav(false); });

  var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- countdown ---------------- */
  var cdEl = $('#countdown'), cdLabel = $('#cdLabel');
  var sthapana = new Date(cfg.sthapanaDateTime);
  var visarjan = new Date(cfg.visarjanDate + 'T18:00:00');

  function tick() {
    var now = new Date(), target, label;
    if (now < sthapana)      { target = sthapana; label = 'Sthapana begins in'; }
    else if (now < visarjan) { target = visarjan; label = 'Visarjan in'; }
    else {
      cdLabel.textContent = 'गणपती बाप्पा मोरया — पुढच्या वर्षी लवकर या';
      cdEl.innerHTML = '<li style="grid-column:1/-1"><b>' + cfg.festivalYear +
        '</b><span>Thank you for celebrating with us</span></li>';
      return true; // stop
    }
    cdLabel.textContent = label;
    var t = Math.max(0, target - now);
    var v = [Math.floor(t / 864e5), Math.floor(t / 36e5) % 24, Math.floor(t / 6e4) % 60, Math.floor(t / 1e3) % 60];
    $$('#countdown b').forEach(function (b, i) {
      var s = i === 0 ? String(v[i]) : ('0' + v[i]).slice(-2);
      if (b.textContent !== s) b.textContent = s;
    });
    return false;
  }
  if (cdEl && !isNaN(sthapana)) {
    if (!tick()) { var cdTimer = setInterval(function () { if (tick()) clearInterval(cdTimer); }, 1000); }
  }

  /* ---------------- donate: QR + UPI ---------------- */
  var qrImg = $('#qrImg'), upiCode = $('#upiId'), upiLink = $('#upiLink');
  var chosenAmount = '';

  if (qrImg && cfg.qrImage) qrImg.src = cfg.qrImage;
  var sampleBadge = $('#qrSample');
  if (sampleBadge && cfg.qrIsSample) sampleBadge.hidden = false;
  if (upiCode && cfg.upiId) upiCode.textContent = cfg.upiId;

  function upiUri() {
    var p = ['pa=' + encodeURIComponent(cfg.upiId),
             'pn=' + encodeURIComponent(cfg.upiPayeeName || cfg.mandalNameEn),
             'cu=INR',
             'tn=' + encodeURIComponent('Ganeshotsav ' + cfg.festivalYear + ' donation')];
    if (chosenAmount) p.push('am=' + encodeURIComponent(chosenAmount));
    return 'upi://pay?' + p.join('&');
  }
  function refreshUpiLink() { if (upiLink) upiLink.href = upiUri(); }
  refreshUpiLink();

  $$('#amountChips button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#amountChips button').forEach(function (o) { o.classList.remove('is-active'); });
      b.classList.add('is-active');
      chosenAmount = b.getAttribute('data-amt') || '';
      refreshUpiLink();
      toast(chosenAmount ? '₹' + chosenAmount + ' — scan or tap to pay' : 'Enter any amount you like');
    });
  });

  var copyBtn = $('#copyUpi');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = cfg.upiId || (upiCode && upiCode.textContent) || '';
      var done = function () { toast('UPI ID copied'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallbackCopy);
      } else fallbackCopy();
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed — ' + text); }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------------- contact links ---------------- */
  var waUrl = cfg.whatsapp
    ? 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent('Namaskar! I have a question about Ganeshotsav ' + cfg.festivalYear + '.')
    : '';
  [['#mapCard', cfg.mapsUrl], ['#callCard', cfg.phone ? 'tel:' + cfg.phone : ''],
   ['#waCard', waUrl], ['#waAsk', waUrl]].forEach(function (pair) {
    var el = $(pair[0]);
    if (!el) return;
    if (pair[1]) el.href = pair[1];
    else { el.removeAttribute('href'); el.style.display = 'none'; }
  });

  /* ---------------- social icons ---------------- */
  var socialWrap = $('#social');
  if (socialWrap) {
    var ICONS = {
      instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.42.68.82.9 1.4.17.4.37 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2a3.8 3.8 0 0 1-.9 1.4c-.42.42-.82.68-1.4.9-.4.17-1 .37-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.42-.42.82-.68 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.9-11.2a1.55 1.55 0 1 1-3.1 0 1.55 1.55 0 0 1 3.1 0z"/>',
      youtube:   '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.2V8.8L15.5 12 10 15.2z"/>'
    };
    ['instagram', 'youtube'].forEach(function (k) {
      if (!cfg[k]) return;
      var a = document.createElement('a');
      a.href = cfg[k]; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', k);
      a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[k] + '</svg>';
      socialWrap.appendChild(a);
    });
  }

  /* ---------------- scroll reveal ---------------- */
  var revealables = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); }, Math.min(i, 5) * 70);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* hide the floating Donate button once the donate section is on screen */
  var giveFab = $('#giveFab'), donateSec = $('#donate');
  if (giveFab && donateSec && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      giveFab.classList.toggle('is-hidden', e[0].isIntersecting);
    }, { threshold: .18 }).observe(donateSec);
  }

  /* ---------------- falling marigold petals ---------------- */
  (function petals() {
    var cv = $('#petals');
    if (!cv || !cfg.showPetals || reduceMotion) return;
    var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var COLORS = ['#FFB627', '#F26A21', '#FFD166', '#E8853A', '#FFE1A8'];
    var bits = [], raf = null;

    function size() {
      var r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(46, Math.max(14, w / 26)));
      bits = [];
      for (var i = 0; i < n; i++) bits.push(make(Math.random() * h));
    }
    function make(y) {
      return {
        x: Math.random() * w, y: y,
        r: 3 + Math.random() * 5,
        vy: .25 + Math.random() * .65,
        sway: .4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - .5) * .02,
        a: .3 + Math.random() * .45,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      };
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < bits.length; i++) {
        var p = bits[i];
        p.y += p.vy; p.phase += .012; p.rot += p.spin;
        p.x += Math.sin(p.phase) * p.sway;
        if (p.y - p.r > h) { bits[i] = make(-20); continue; }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .62, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    }
    function play()  { if (!raf) raf = requestAnimationFrame(frame); }
    function pause() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    size(); play();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    document.addEventListener('visibilitychange', function () { document.hidden ? pause() : play(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? play() : pause(); }).observe(cv);
    }
  })();

  /* ---------------- music ----------------
     Plays cfg.musicSrc if the file exists. If it doesn't (or the browser
     refuses it), a soft temple-bell + drone ambience is synthesised with
     the Web Audio API so the button always does something.               */
  var music = (function () {
    var btn = $('#musicBtn');
    var el = null, ctx = null, master = null, bellTimer = null, drones = [];
    var on = false, useSynth = false;

    function audioEl() {
      if (el) return el;
      el = new Audio();
      el.src = cfg.musicSrc;
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      el.addEventListener('error', function () { useSynth = true; if (on) startSynth(); });
      return el;
    }

    function fade(target, ms) {                         // gentle volume ramp
      if (!el) return;
      var from = el.volume, t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / ms);
        el.volume = Math.max(0, Math.min(1, from + (target - from) * k));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }

    /* --- synthesised fallback --- */
    function startSynth() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ctx) ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      if (!master) {
        master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);
      }
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(cfg.musicVolume * .5, ctx.currentTime, .8);

      if (!drones.length) {
        var filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 900;
        filter.connect(master);
        [110, 164.81, 220.5].forEach(function (f, i) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = i === 2 ? 'triangle' : 'sine';
          o.frequency.value = f;
          g.gain.value = i === 2 ? .05 : .12;
          var lfo = ctx.createOscillator(), lg = ctx.createGain();
          lfo.frequency.value = .05 + i * .02; lg.gain.value = .04;
          lfo.connect(lg); lg.connect(g.gain); lfo.start();
          o.connect(g); g.connect(filter); o.start();
          drones.push(o, lfo);
        });
      }
      if (!bellTimer) { bell(); bellTimer = setInterval(bell, 9000); }
    }

    function bell() {                                   // a small temple bell
      if (!ctx || !master) return;
      var t = ctx.currentTime + .02, base = 523.25;
      [[1, .30, 4.2], [2.02, .16, 2.6], [2.76, .11, 1.9], [4.07, .06, 1.3]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = base * p[0];
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(p[1], t + .006);
        g.gain.exponentialRampToValueAtTime(.0001, t + p[2]);
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + p[2] + .1);
      });
    }

    function stopSynth() {
      if (master && ctx) master.gain.setTargetAtTime(0, ctx.currentTime, .35);
      clearInterval(bellTimer); bellTimer = null;
    }

    function sync() {
      if (!btn) return;
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Mute festival music' : 'Play festival music');
    }

    function start(quiet) {
      on = true; sync();
      if (useSynth) { startSynth(); if (!quiet) toast('Temple bells on'); return; }
      var a = audioEl();
      var p = a.play();
      if (p && p.catch) {
        p.then(function () {
          fade(cfg.musicVolume, 1200);
          if (!quiet) toast('Aarti playing');
        }).catch(function () {
          useSynth = true; startSynth();
          if (!quiet) toast('Temple bells on');
        });
      } else { fade(cfg.musicVolume, 1200); }
    }

    function stop() {
      on = false; sync();
      stopSynth();
      if (el) { fade(0, 500); setTimeout(function () { if (!on && el) el.pause(); }, 520); }
    }

    if (btn) btn.addEventListener('click', function () { on ? stop() : start(false); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && on) { if (el) el.pause(); if (ctx) ctx.suspend(); }
      else if (!document.hidden && on) { if (ctx) ctx.resume(); if (el && !useSynth) el.play().catch(function () {}); }
    });

    sync();
    return { start: start, stop: stop };
  })();

  /* ---------------- welcome gate ---------------- */
  (function gate() {
    var g = $('#gate');
    if (!g) return;
    var seen = false;
    try { seen = sessionStorage.getItem('ganpati-gate') === '1'; } catch (e) {}
    if (!cfg.showWelcomeGate || seen) return;

    g.hidden = false;
    document.body.style.overflow = 'hidden';

    function close(withSound) {
      try { sessionStorage.setItem('ganpati-gate', '1'); } catch (e) {}
      g.classList.add('is-leaving');
      document.body.style.overflow = '';
      setTimeout(function () { g.hidden = true; }, 500);
      if (withSound) music.start(true);
    }
    $('#enterSound').addEventListener('click', function () { close(true); });
    $('#enterSilent').addEventListener('click', function () { close(false); });
    setTimeout(function () { var b = $('#enterSound'); if (b) b.focus(); }, 120);
  })();

})();
