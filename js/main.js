/* ==========================================================================
   main.js — intro diary, type collage, poster wall, case-file modal,
   and pixel Kyro who follows you page to page.
   ========================================================================== */
(function () {
  'use strict';

  const D = window.SITE;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const html = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isNarrow = () => matchMedia('(max-width: 920px)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ------------------------------------------------------------------
     TYPE COLLAGE — every letter cut from a different magazine
     ------------------------------------------------------------------ */
  const CHIP = [
    { f: 'var(--f-pop)', c: '#fff', b: 'var(--blue)' },                         // 0
    { f: 'var(--f-drip)', c: 'var(--pink)', z: 1.05, sh: 1 },                   // 1
    { f: 'var(--f-block)', c: 'var(--ink)', b: 'var(--yellow)', z: 0.9 },       // 2
    { f: 'var(--f-retro)', c: 'var(--orange)', sh: 1 },                         // 3
    { f: 'var(--f-serif)', c: 'var(--ink)', b: '#fff', it: 1, bd: 1, z: 1.08 }, // 4
    { f: 'var(--f-doodle)', c: 'var(--green)' },                                // 5
    { f: 'var(--f-pixel)', c: '#fff', b: 'var(--ink)', z: 0.78 },               // 6
    { f: 'var(--f-marker)', c: 'var(--red)', z: 0.74 },                         // 7
    { f: 'var(--f-sketch)', c: 'var(--purple)', b: 'var(--sky)', z: 1.02 },     // 8
    { f: 'var(--f-graf)', c: 'var(--blue)', z: 1.02 },                          // 9
    { f: 'var(--f-pop)', c: 'var(--ink)', b: 'var(--pink)' },                   // 10
    { f: 'var(--f-block)', c: '#fff', b: 'var(--red)', z: 0.9 },                // 11
    { f: 'var(--f-serif)', c: 'var(--pink)', it: 1, z: 1.12 },                  // 12
    { f: 'var(--f-retro)', c: '#fff', b: 'var(--green)' }                       // 13
  ];

  function collage(root) {
    $$('.collage', root).forEach((el, n) => {
      if (el.dataset.done) return;
      const text = el.textContent.trim();
      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
      const r = Doodle.rng(Doodle.hash(text + n));
      const order = el.dataset.styles ? el.dataset.styles.split(',').map(Number) : null;
      el.textContent = '';
      let k = 0;
      text.split(' ').forEach((word, wi) => {
        if (wi) { const g = document.createElement('span'); g.className = 'chip-gap'; el.append(g); }
        const w = document.createElement('span');
        w.className = 'chip-word';
        for (const ch of word) {
          const st = CHIP[order ? order[k % order.length] : Math.floor(r() * CHIP.length)];
          const s = document.createElement('span');
          s.className = 'chip' + (st.sh ? ' ink-shadow' : '');
          s.textContent = ch;
          s.setAttribute('aria-hidden', 'true');
          const j = () => (r() * 7).toFixed(1);
          s.style.cssText =
            `--i:${k};--r:${((r() - 0.5) * 13).toFixed(1)}deg;--y:${((r() - 0.5) * 0.12).toFixed(3)}em;--z:${st.z || 1};` +
            `font-family:${st.f};color:${st.c};` + (st.b ? `background:${st.b};clip-path:polygon(${j()}% ${j()}%,${100 - j()}% ${j()}%,${100 - j()}% ${100 - j()}%,${j()}% ${100 - j()}%);` : '') +
            (st.it ? 'font-style:italic;' : '') + (st.bd ? 'box-shadow:inset 0 0 0 .05em var(--ink);' : '');
          w.append(s);
          k++;
        }
        el.append(w);
      });
      el.dataset.done = '1';
    });
  }

  /* ------------------------------------------------------------------
     little generators: barcodes, crowd, pixel stickers
     ------------------------------------------------------------------ */
  function barcodes(root) {
    $$('.barcode', root).forEach(el => {
      if (el.dataset.done) return;
      const code = el.dataset.code || '0000';
      const r = Doodle.rng(Doodle.hash(code));
      let h = '';
      for (let i = 0; i < 34; i++) h += `<span style="width:${1 + Math.floor(r() * 3.4)}px;margin-right:${r() < 0.3 ? 2 : 0}px"></span>`;
      el.innerHTML = h + `<b>${esc(code)}</b>`;
      el.dataset.done = '1';
    });
  }

  function crowd() {
    const svg = $('.crowd');
    if (!svg) return;
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    const r = Doodle.rng(77);
    let g = '';
    for (let x = -10; x < 1020; x += 30 + r() * 18) {
      const h = 40 + r() * 38, rad = 13 + r() * 5, top = 120 - h;
      g += `<rect x="${(x - rad * 1.35).toFixed(1)}" y="${(top + rad * 0.7).toFixed(1)}" width="${(rad * 2.7).toFixed(1)}" height="${(h + 10).toFixed(1)}" rx="${rad.toFixed(1)}" fill="#14207a"/>`;
      g += `<circle cx="${x.toFixed(1)}" cy="${top.toFixed(1)}" r="${rad.toFixed(1)}" fill="#14207a"/>`;
      if (r() < 0.42) {
        const side = r() < 0.5 ? -1 : 1, sx = x + side * rad * 1.1, ex = sx + side * (8 + r() * 14), ey = top - 30 - r() * 22;
        g += `<path d="M${sx.toFixed(1)} ${(top + rad).toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#14207a" stroke-width="9" stroke-linecap="round"/>`;
        if (r() < 0.45) g += `<rect x="${(ex - 5).toFixed(1)}" y="${(ey - 12).toFixed(1)}" width="10" height="15" rx="2" fill="#ffd23f"/>`;
      }
    }
    svg.innerHTML = `<g filter="url(#crayon)">${g}</g>`;
  }

  function pixelStickers() {
    const list = $$('canvas[data-pose]').filter(c => !c.closest('.buddy'));
    let f = 0;
    const paint = () => list.forEach(c => PixelKyro.paint(c, c.dataset.pose, f, false));
    paint();
    if (!RM) setInterval(() => { f++; paint(); }, 320);
    const pass = $('.pass-px');
    if (pass) PixelKyro.portrait(pass, 'idle');
  }

  /* ------------------------------------------------------------------
     POSTER WALL — six covers, six art styles
     ------------------------------------------------------------------ */
  const multicolor = (word, cols) => [...word].map((ch, i) => `<span style="color:${cols[i % cols.length]};rotate:${(i % 2 ? 4 : -5)}deg">${esc(ch)}</span>`).join('');

  const COVERS = {
    naive: () => `
      <p class="cv-txt t1">culture<br>night!</p>
      <svg class="string" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 3 Q50 20 100 3" stroke="#1b1a1f" stroke-width=".7" fill="none"/></svg>
      <i class="dd" data-doodle="lantern" data-color="ink" data-fill="red" style="--x:10%;--y:37%;--w:21%;--r:-4deg"></i>
      <i class="dd" data-doodle="lantern" data-color="ink" data-fill="pink" style="--x:40%;--y:43%;--w:21%;--r:3deg"></i>
      <i class="dd" data-doodle="lantern" data-color="ink" data-fill="orange" style="--x:70%;--y:37%;--w:21%;--r:6deg"></i>
      <i class="dd" data-doodle="star" data-color="blue" data-fill="sky" style="--x:72%;--y:10%;--w:15%;--r:12deg"></i>
      <i class="dd" data-doodle="flower" data-color="green" data-fill="pink" style="--x:6%;--y:66%;--w:19%"></i>
      <p class="cv-txt sold">SOLD OUT<small>a week early!</small></p>
      <p class="cv-txt t2">anime ✶ k-pop ✶ 200+ fam<br>asian culture night</p>`,
    pixel: () => {
      let cells = '';
      for (let i = 0; i < 100; i++) cells += `<b style="--c:${i < 40 ? 'var(--pink)' : i < 75 ? 'var(--sky)' : 'var(--yellow)'}"></b>`;
      return `
      <p class="cv-txt t1">SESSION<br>LEDGER</p>
      <p class="cv-txt t2">who wrote what?</p>
      <div class="win"><div class="bar"><i></i><i></i><i></i><span>split.app</span></div>
        <div class="grid">${cells}</div>
        <div class="legend"><span style="--c:var(--pink)">MELODY 40</span><span style="--c:var(--sky)">LYRICS 35</span><span style="--c:var(--yellow)">BEAT 25</span></div>
      </div>
      <p class="cv-txt lock">✓ FINAL RECORD LOCKED</p>`;
    },
    pop: () => `
      <p class="cv-txt t1">GO<br>FOR<br>SHOW!</p>
      <i class="dd" data-doodle="burst" data-color="ink" data-fill="yellow" style="--x:58%;--y:30%;--w:36%;--r:8deg"></i>
      <p class="cv-txt on-tour">ON<br>TOUR!</p>
      <i class="dd" data-doodle="sparkle" data-color="ink" data-fill="white" style="--x:80%;--y:6%;--w:13%"></i>
      <div class="ticket"><b>ALL ACCESS</b>✓ itinerary &nbsp;✓ riders<br>✓ load-in &nbsp;✓ showtime</div>`,
    flat: () => `
      <p class="cv-txt t2">SONGWRITING CAMP · ’24</p>
      <div class="sun"></div>
      <div class="clock"><b>72h</b></div>
      <svg class="note" viewBox="0 0 60 90" aria-hidden="true"><ellipse cx="22" cy="72" rx="17" ry="12.5" fill="#ffd23f" stroke="#1b1a1f" stroke-width="4" transform="rotate(-20 22 72)"/><rect x="34" y="8" width="7" height="64" fill="#1b1a1f"/><path d="M41 8 C 54 17, 60 31, 51 48 C 53 33, 49 25, 41 22Z" fill="#1b1a1f"/></svg>
      <p class="award">BEST CONCEPT<br>BEST MELODY</p>
      <p class="cv-txt t1">72-hour<br><span>song</span></p>`,
    fuzzy: () => `
      <p class="cv-txt t1">${multicolor('vocal', ['#2f5bea', '#ff4fa3', '#ff7a1f', '#2fbf55', '#9b5cff'])}<br>${multicolor('tutor', ['#f2382c', '#2f5bea', '#ffb800', '#ff4fa3', '#2fbf55'])}</p>
      <div class="ears"></div><div class="blob"></div>
      <span class="eye l"></span><span class="eye r"></span><span class="blush l"></span><span class="blush r"></span><span class="mouth"></span>
      <i class="dd" data-doodle="notes" data-color="ink" data-fill="pink" style="--x:72%;--y:30%;--w:17%;--r:12deg"></i>
      <i class="dd" data-doodle="sparkle" data-color="white" data-fill="white" style="--x:12%;--y:34%;--w:12%"></i>
      <i class="dd" data-doodle="sparkle" data-color="white" data-fill="white" style="--x:76%;--y:66%;--w:9%"></i>
      <p class="cv-txt t2">45H+ · 10+ STUDENTS · TOP 3</p>`,
    collage: () => `
      <div class="cols">${'copyright · master · publishing · sync · mechanicals · performance · PRO · split sheet · licence · 版权 · 母带 · 词曲 · bundle of rights · '.repeat(14)}</div>
      <p class="cv-txt t1"><span class="collage" data-styles="11,4,6,2,0,1,13,10,2,8,9,3,5,4,12,7">WHO OWNS A SONG?</span></p>
      <svg class="bundle" viewBox="0 0 120 80" aria-hidden="true"><g filter="url(#crayon)" stroke-linecap="round">
        <path d="M10 70 L100 12" stroke="#8b4a2b" stroke-width="7"/><path d="M18 74 L108 20" stroke="#a15b33" stroke-width="7"/>
        <path d="M6 60 L96 4" stroke="#8b4a2b" stroke-width="7"/><path d="M22 78 L112 30" stroke="#6e3a20" stroke-width="7"/>
        <path d="M52 30 C 62 40, 66 48, 64 58" stroke="#f2382c" stroke-width="6" fill="none"/></g></svg>
      <p class="cv-txt t2">a bundle of sticks</p>
      <p class="cv-txt cn">版权</p>`
  };
  const coverHTML = (p, i) => `<div class="cv cv-${p.style}">${COVERS[p.style](p, i)}<span class="cv-no">N°0${i + 1}</span></div>`;

  function posters() {
    const wall = $('#posters');
    if (!wall) return;
    const rot = [-2.2, 1.6, -1, 2.1, -1.8, 1.2], tape = ['', 'tape-pink', 'tape-blue', 'tape-pink', '', 'tape-blue'];
    wall.innerHTML = D.projects.map((p, i) => `
      <article class="pcard" data-reveal style="--r:${rot[i % 6]}deg;--tr:${i % 2 ? 4 : -4}deg">
        <span class="tape ${tape[i % 6]}"></span>
        <span class="pc-open">OPEN ↗</span>
        <div class="poster">${coverHTML(p, i)}</div>
        <div class="pc-cap">
          <p class="pc-kick"><span>${esc(p.kicker)}</span><span>${esc(p.date)}</span></p>
          <h3 class="pc-title">${esc(p.title)}</h3>
          <p class="pc-hook">${esc(p.hook)}</p>
          <span class="pc-metric"><b>${esc(p.metric.n)}</b>${esc(p.metric.l)}</span>
        </div>
        <button class="pc-hit" type="button" data-i="${i}" aria-label="Open case file: ${esc(p.title)}"></button>
      </article>`).join('');
    wall.addEventListener('click', e => {
      const b = e.target.closest('.pc-hit');
      if (b) openCase(+b.dataset.i);
    });
  }

  /* ------------------------------------------------------------------
     CASE-FILE MODAL
     ------------------------------------------------------------------ */
  const modal = $('#modal');
  let current = -1, lastFocus = null;

  function openCase(i) {
    const n = D.projects.length;
    i = (i + n) % n;
    const p = D.projects[i];
    current = i;
    $('.modal-left', modal).innerHTML = `<div class="poster">${coverHTML(p, i)}</div>
      <div class="modal-metric"><b>${esc(p.metric.n)}</b><span>${esc(p.metric.l)}</span></div>`;
    const li = a => a.map(x => `<li>${esc(x)}</li>`).join('');
    $('.modal-right', modal).innerHTML = `
      <p class="m-kick">case file n°0${i + 1} · ${esc(p.kicker)} · ${esc(p.date)}</p>
      <h2 class="m-title" id="modalTitle">${esc(p.title)}</h2>
      <p class="m-role">${esc(p.role)}</p>
      <p>${esc(p.hook)}</p>
      <p class="m-h">the situation</p><p>${esc(p.context)}</p>
      <p class="m-h">what I did</p><ul class="m-list">${li(p.did)}</ul>
      <p class="m-h">what happened</p><ul class="m-list win">${li(p.outcome)}</ul>
      <p class="m-h">tools &amp; skills</p>
      <div class="m-tools">${p.tools.map((t, k) => `<span style="--r:${k % 2 ? 2 : -2}deg">${esc(t)}</span>`).join('')}</div>
      <div class="m-link cta-row">
        ${p.link ? `<a class="btn btn-y" href="${esc(p.link.href)}" target="_blank" rel="noopener">${esc(p.link.label)}</a>` : ''}
        <button class="btn btn-w js-prev" type="button">← prev</button>
        <button class="btn btn-w js-next" type="button">next case →</button>
      </div>`;
    Doodle.decorate(modal);
    collage(modal);
    $$('.dd', modal).forEach(d => d.classList.add('drawn'));
    $('.modal-right', modal).scrollTop = 0;
    $('.modal-left', modal).scrollTop = 0;
    if (modal.hidden) {
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => modal.classList.add('open'));
      $('.modal-x', modal).focus({ preventScroll: true });
    }
    Buddy.say(pick(['ooh, good pick!', 'this one’s my fave', 'case file opened ✦']));
  }
  function closeCase() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('.modal-x')) closeCase();
    else if (e.target.closest('.js-prev')) openCase(current - 1);
    else if (e.target.closest('.js-next')) openCase(current + 1);
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeCase();
    if (e.key === 'ArrowRight') openCase(current + 1);
    if (e.key === 'ArrowLeft') openCase(current - 1);
    if (e.key === 'Tab') { // keep focus inside the open diary
      const f = $$('button, a[href]', modal);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ------------------------------------------------------------------
     PIXEL BUDDY — walks to each page and does that page's thing
     ------------------------------------------------------------------ */
  const Buddy = (() => {
    const BOX = 192; // 64px sprite × 3
    const el = $('#buddy');
    const body = $('.buddy-body', el);
    const cv = $('canvas', el);
    const bub = $('.bubble', el), bubTxt = $('span', bub);
    const fx = $('#fx');
    const hit = document.createElement('div');
    hit.className = 'hit';
    body.append(hit);
    const secs = $$('main section[data-pose]');
    const tabs = $$('.tab');
    const vinyl = $('#vinyl');
    const depthEls = $$('[data-depth]');
    const lineIdx = {};
    const PARTICLES = { listen: ['♪', '♫'], dj: ['♫', '♪', '✦'], sing: ['♪', '★', '♫'], business: ['$', '↗', '%', '✓'], wave: ['✦', '✿'], bye: ['♥', '♥', '✿'] };
    const FXCOL = ['#ff4fa3', '#2f5bea', '#ffd23f', '#2fbf55', '#ff7a1f', '#9b5cff'];
    const cur = { cx: innerWidth * 0.7, by: -40, s: 1 };
    let pose = '', frame = 0, lastF = 0, blinkUntil = 0, nextBlink = 2500;
    let active = null, changedAt = 0, lastSay = 0, sayTimer = 0, lastFx = 0, running = false, facing = 1;

    function say(text, ms) {
      if (!text) return;
      bubTxt.textContent = text;
      bub.classList.add('show');
      lastSay = performance.now();
      clearTimeout(sayTimer);
      sayTimer = setTimeout(() => bub.classList.remove('show'), ms || 3200);
    }
    function nextLine(key) {
      const L = D.lines[key] || [];
      if (!L.length) return '';
      lineIdx[key] = ((lineIdx[key] == null ? -1 : lineIdx[key]) + 1) % L.length;
      return L[lineIdx[key]];
    }
    function spawn(chars) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.textContent = pick(chars);
      p.style.left = (cur.cx + (Math.random() - 0.5) * BOX * 0.4 * cur.s) + 'px';
      p.style.top = (cur.by - BOX * 0.72 * cur.s) + 'px';
      p.style.color = pick(FXCOL);
      p.style.setProperty('--dx', ((Math.random() - 0.5) * 80).toFixed(0) + 'px');
      p.style.setProperty('--rot', ((Math.random() - 0.5) * 60).toFixed(0) + 'deg');
      fx.append(p);
      setTimeout(() => p.remove(), 1900);
    }
    function activeSection() {
      const mid = innerHeight * 0.45;
      for (const s of secs) { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) return s; }
      return secs[0].getBoundingClientRect().top > mid ? secs[0] : secs[secs.length - 1];
    }
    // stand in the page's spot when it's on screen, otherwise shrink & park in the corner
    function target(sec) {
      const narrow = isNarrow();
      const spot = narrow ? null : $('.buddy-spot', sec);
      const r = spot ? spot.getBoundingClientRect() : null;
      if (r && r.width && r.bottom > 140 && r.top < innerHeight - 90) {
        return {
          cx: clamp(r.left + r.width / 2, BOX / 2 + 24, innerWidth - BOX / 2 - 54),
          by: clamp(r.bottom, BOX + 64, innerHeight - 2), s: 1
        };
      }
      const s = narrow ? 0.52 : 0.62;
      return { cx: innerWidth - (narrow ? 6 : 60) - (BOX * s) / 2, by: innerHeight - 4, s };
    }
    function draw(blink) { PixelKyro.paint(cv, pose, frame, blink); }

    function tick(t) {
      if (!running) return;
      const sec = activeSection();
      if (sec !== active) {
        active = sec;
        changedAt = t;
        say(nextLine(sec.id));
        tabs.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + sec.id));
      }
      const tg = target(sec);
      const dx = tg.cx - cur.cx, dy = tg.by - cur.by, dist = Math.hypot(dx, dy);
      const travelling = !RM && t - changedAt < 2200 && dist > 26;
      const k = RM ? 1 : travelling ? 0.07 : 0.16;
      cur.cx += dx * k;
      cur.by += dy * k;
      cur.s += (tg.s - cur.s) * (RM ? 1 : 0.12);
      let p = sec.dataset.pose;
      if (travelling) {
        p = Math.abs(dx) > Math.abs(dy) * 0.5 ? 'walk' : 'jump';
        if (Math.abs(dx) > 3) facing = dx < 0 ? -1 : 1;
      } else facing = 1;
      const hopY = travelling && p === 'walk' ? -Math.abs(Math.sin(t / 85)) * 7 : 0;
      el.style.transform = `translate3d(${(cur.cx - BOX / 2).toFixed(1)}px, ${(cur.by - BOX + hopY).toFixed(1)}px, 0)`;
      el.style.setProperty('--s', cur.s.toFixed(3));
      el.classList.toggle('flip', facing < 0);
      bub.classList.toggle('left', cur.cx > innerWidth - 220);
      bub.classList.toggle('right', cur.cx < 200);

      const def = PixelKyro.poses[p];
      if (p !== pose) { pose = p; frame = 0; lastF = t; draw(false); }
      else if (t - lastF > def.ms) { frame = (frame + 1) % def.frames.length; lastF = t; draw(t < blinkUntil); }
      if (t > nextBlink) { blinkUntil = t + 140; nextBlink = t + 2200 + Math.random() * 2800; draw(true); }
      else if (blinkUntil && t > blinkUntil) { blinkUntil = 0; draw(false); }

      if (!travelling && !RM && PARTICLES[p] && t - lastFx > 720 && !document.hidden) { lastFx = t; spawn(PARTICLES[p]); }
      if (!travelling && t - lastSay > 11000 && t - changedAt > 6000) say(nextLine(sec.id));

      // page-wide scroll effects ride on the same frame
      if (vinyl) vinyl.style.transform = `rotate(${(t * 0.012 + scrollY * 0.22).toFixed(1)}deg)`;
      html.classList.toggle('scrolled', scrollY > 30);
      if (!RM) depthEls.forEach(d => {
        const r = d.getBoundingClientRect();
        d.style.translate = `0 ${((r.top + r.height / 2 - innerHeight / 2) * +d.dataset.depth).toFixed(1)}px`;
      });
      requestAnimationFrame(tick);
    }

    hit.addEventListener('click', () => {
      el.classList.remove('hop');
      void el.offsetWidth;
      el.classList.add('hop');
      say(nextLine('poke'));
      for (let i = 0; i < 4; i++) setTimeout(() => spawn(['♥', '✦', '✿']), i * 90);
    });

    function start() {
      if (running) return;
      running = true;
      el.classList.add('on');
      const tg = target(activeSection());
      Object.assign(cur, { cx: tg.cx, by: -40, s: tg.s });
      requestAnimationFrame(tick);
    }
    return { start, say };
  })();

  /* ------------------------------------------------------------------
     INTRO — drop the diary, open the cover, zoom into page one
     ------------------------------------------------------------------ */
  function startSite() {
    document.body.classList.add('site-in');
    Buddy.start();
  }

  function intro() {
    const box = $('#intro');
    const q = new URLSearchParams(location.search);
    let seen = false;
    try { seen = sessionStorage.getItem('kyro-diary-opened') === '1'; } catch (e) { /* private mode */ }
    if (!box || q.has('nointro') || (seen && !q.has('intro'))) {
      if (box) box.remove();
      startSite();
      return;
    }
    html.classList.add('intro-on');
    const book = $('#book', box);
    let opened = false, done = false;
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('in')));

    const finish = () => {
      if (done) return;
      done = opened = true;
      clearTimeout(auto);
      box.classList.add('gone');
      html.classList.remove('intro-on');
      try { sessionStorage.setItem('kyro-diary-opened', '1'); } catch (e) { /* ignore */ }
      startSite();
      setTimeout(() => box.remove(), 1000);
    };
    const open = () => {
      if (opened) return;
      opened = true;
      clearTimeout(auto);
      box.classList.add('opening');
      setTimeout(() => box.classList.add('zoom'), RM ? 0 : 1500);
      setTimeout(finish, RM ? 50 : 2150);
    };
    const auto = q.has('hold') ? 0 : setTimeout(open, RM ? 200 : 2400); // ?intro&hold = stay on the cover
    book.addEventListener('click', open);
    book.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    $('.intro-skip', box).addEventListener('click', finish);
    addEventListener('wheel', open, { once: true, passive: true });
    addEventListener('touchmove', open, { once: true, passive: true });
    addEventListener('keydown', e => { if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) open(); if (e.key === 'Escape') finish(); });
  }

  /* ------------------------------------------------------------------
     contact bits, menus, small delights
     ------------------------------------------------------------------ */
  const toast = (() => {
    const t = $('#toast');
    let timer = 0;
    return msg => {
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => t.classList.remove('show'), 2600);
    };
  })();

  function contact() {
    $$('.js-mail').forEach(a => { a.href = 'mailto:' + D.email; });
    $$('.js-linkedin').forEach(a => { if (D.linkedin) a.href = D.linkedin; else a.remove(); });
    $$('.js-resume').forEach(a => { a.href = D.resume; });
    $$('.js-copy-email').forEach(b => b.addEventListener('click', () => {
      const done = () => { toast('copied! ✿ ' + D.email); $$('.js-email-text').forEach(s => { s.textContent = D.email; }); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(D.email).then(done, () => toast(D.email));
      else toast(D.email);
    }));
    // friendly note while the résumé PDF hasn't been added yet
    if (location.protocol !== 'file:') {
      fetch(D.resume, { method: 'HEAD' }).then(r => { if (!r.ok) missingResume(); }).catch(missingResume);
    }
    function missingResume() {
      $$('.js-resume').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        toast('résumé PDF coming soon — email me meanwhile ✉');
      }));
    }
  }

  function menu() {
    const btn = $('.menu-btn'), sheet = $('#menu');
    if (!btn) return;
    const set = open => { sheet.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', e => { e.stopPropagation(); set(sheet.hidden); });
    sheet.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('click', e => { if (!sheet.hidden && !sheet.contains(e.target)) set(false); });
  }

  function polaroid() {
    const p = $('.polaroid');
    if (!p) return;
    const flip = () => p.classList.toggle('flipped');
    p.addEventListener('click', flip);
    p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  }

  // click on empty paper → leave a little crayon doodle
  function clickDoodles() {
    const kinds = ['star', 'sparkle', 'heart', 'flower', 'smile', 'note', 'daisy'];
    const cols = ['pink', 'blue', 'yellow', 'green', 'orange', 'purple', 'red'];
    let live = 0;
    document.addEventListener('click', e => {
      if (RM || live > 14) return;
      if (e.target.closest('a, button, input, .pcard, .buddy, .modal, .intro, .polaroid, .menu-sheet, .tracklist li, .nerd-list li')) return;
      const d = document.createElement('i');
      d.className = 'click-doodle';
      const c = pick(cols);
      d.innerHTML = Doodle.svg(pick(kinds), { color: 'ink', fill: c, seed: Math.floor(Math.random() * 1e9) });
      d.style.left = (e.pageX - 27) + 'px';
      d.style.top = (e.pageY - 27) + 'px';
      document.body.append(d);
      live++;
      setTimeout(() => { d.remove(); live--; }, 2600);
    });
  }

  /* ------------------------------------------------------------------
     observers: draw doodles + reveal blocks when they scroll in
     ------------------------------------------------------------------ */
  function observers() {
    const draw = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('drawn'); draw.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.dd, .doodle, .dd-inline').forEach(d => draw.observe(d));
    const reveal = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$('[data-reveal]').forEach(d => reveal.observe(d));
  }

  /* ------------------------------------------------------------------
     boot
     ------------------------------------------------------------------ */
  posters();
  Doodle.decorate(document);
  collage(document);
  barcodes(document);
  crowd();
  pixelStickers();
  contact();
  menu();
  polaroid();
  clickDoodles();
  observers();
  // wait for the fonts so the collage letters land in the right place
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve()).then(intro);
})();
