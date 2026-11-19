(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Active section highlight
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a'));
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navAnchors.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) secObs.observe(s); });
  }

  /* ---------- Ticker: duplicate for seamless loop ---------- */
  var track = document.getElementById('tickerTrack');
  if (track && !reduced) {
    Array.prototype.slice.call(track.children).forEach(function (n) {
      var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c);
    });
  }

  /* ---------- Gallery ---------- */
  var work = [
    ['volatility-inducing-events-from-2023-infographic', 'Volatility-Inducing Events of 2023', 576, 720],
    ['key-findings-wall-street-horizon-corporate-event-data-survey', 'Key Findings: Corporate Event Data Survey', 500, 500],
    ['navigating-the-etf-data-landscape', 'Navigating the ETF Data Landscape', 720, 405],
    ['reporting-frequency', 'Reporting Frequency', 720, 720, 1],
    ['full-tsx-tsxventure-coverage', 'Full TSX & TSX Venture Coverage', 720, 566],
    ['leveraging-etf-calendar-data', 'Leveraging ETF Calendar Data', 500, 500],
    ['stock-buybacks-under-attack-tracking-share-repurchase-events', 'Stock Buybacks Under Attack: Tracking Share Repurchases Ahead of 2023', 720, 377],
    ['dividend-investing-101', 'Dividend Investing 101', 720, 720],
    ['data-strategies-to-prepare-portfolios-for-volatility', 'Data Strategies to Prepare Portfolios for Volatility', 720, 405],
    ['where-are-they-now-q2-2023', 'Where Are They Now? Q2 2023', 720, 720],
    ['ceo-uncertainty-remains-high', 'CEO Uncertainty Remains High', 720, 720, 1],
    ['january-and-february-m-a-hits-lowest-level-since-2020-will-m', 'Jan & Feb M&A Hits Lowest Level Since 2020', 720, 288],
    ['q4-22-where-are-they-now', "Where Are They Now? Q4 '22", 720, 720, 1],
    ['q1-2024-buyback-and-dividend-increases-point-to-improving-co', 'Q1 2024 Buyback & Dividend Increases Point to Improving Sentiment', 720, 405],
    ['the-great-dividend-divide', 'The Great Dividend Divide', 720, 720],
    ['secondary-equity-issuance-announcements-on-the-rise', 'Secondary Equity Issuance Announcements on the Rise', 720, 288],
    ['ceo-uncertainty-spikes-after-improving-last-quarter', 'CEO Uncertainty Spikes After Improving Last Quarter', 720, 288, 1]
  ];
  var gallery = document.getElementById('gallery');
  work.forEach(function (w, i) {
    var b = document.createElement('button');
    b.className = 'g-item reveal';
    b.type = 'button';
    b.setAttribute('aria-label', 'Enlarge: ' + w[1]);
    b.innerHTML = '<img loading="lazy" decoding="async" alt="" width="' + w[2] + '" height="' + w[3] + '" src="assets/work/' + w[0] + '-t.webp">' +
      (w[4] ? '<span class="g-badge">GIF</span>' : '') + '<span class="g-cap"></span>';
    b.querySelector('.g-cap').textContent = w[1];
    b.addEventListener('click', function () { openLb(i); });
    gallery.appendChild(b);
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  var lbIdx = 0, lastFocus = null;
  function show(i) {
    lbIdx = (i + work.length) % work.length;
    var w = work[lbIdx];
    lbImg.src = 'assets/work/' + w[0] + (w[4] ? '.gif' : '.webp');
    lbImg.alt = w[1];
    lbCap.textContent = w[1] + '  ·  ' + (lbIdx + 1) + ' / ' + work.length;
    lb.querySelector('.lb-scroll').scrollTop = 0;
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; lbImg.src = ''; if (lastFocus) lastFocus.focus(); }
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(lbIdx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(lbIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') show(lbIdx + 1);
    else if (e.key === 'ArrowLeft') show(lbIdx - 1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(lbIdx + (dx < 0 ? 1 : -1));
  });

  /* ---------- Counters ---------- */
  function countUp(el) {
    var to = +el.dataset.to;
    if (reduced) { el.textContent = to; return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .chart');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('.count').forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (el.classList.contains('stat') || el.classList.contains('case') || el.classList.contains('g-item')) ? ((i % 3) * 80) + 'ms' : '';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.count').forEach(function (el) { el.textContent = el.dataset.to; });
  }

  /* ---------- Career chart tooltips ---------- */
  var chart = document.querySelector('.chart');
  var tips = [
    "Exclusive Concepts · Sr. Social Media Specialist · '17",
    "Wall Street Horizon · Digital Marketing · '19",
    "TMX Group · Product Marketing Manager · '22",
    "TMX Datalinx · Sr. Manager, PMM & Scaled Growth · '26"
  ];
  if (chart) {
    var tip = document.createElement('div'); tip.className = 'cc-tip'; chart.appendChild(tip);
    var roles = document.querySelectorAll('.role');
    var pts = chart.querySelectorAll('.cc-pts circle');
    function hot(i, on, circle) {
      roles.forEach(function (r) { r.classList.toggle('hot', on && r.dataset.i === String(i)); });
      pts.forEach(function (p) { p.classList.toggle('hot', on && p.dataset.i === String(i)); });
      if (on && circle) {
        var cr = circle.getBoundingClientRect(), fr = chart.getBoundingClientRect();
        var x = cr.left + cr.width / 2 - fr.left;
        x = Math.max(120, Math.min(fr.width - 120, x));
        tip.style.left = x + 'px'; tip.style.top = (cr.top - fr.top) + 'px';
        tip.textContent = tips[i];
      }
      tip.classList.toggle('show', !!(on && circle));
    }
    pts.forEach(function (p) {
      var i = +p.dataset.i;
      p.addEventListener('mouseenter', function () { hot(i, true, p); });
      p.addEventListener('mouseleave', function () { hot(i, false); });
      p.addEventListener('click', function () {
        hot(i, true, p);
        var r = document.querySelector('.role[data-i="' + i + '"]');
        if (r) { var d = r.querySelector('details'); if (d) d.open = true; }
      });
    });
    roles.forEach(function (r) {
      var i = +r.dataset.i;
      r.addEventListener('mouseenter', function () { hot(i, true, chart.querySelector('.cc-pts circle[data-i="' + i + '"]')); });
      r.addEventListener('mouseleave', function () { hot(i, false); });
    });
  }

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
