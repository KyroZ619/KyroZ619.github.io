/* ==========================================================================
   doodles.js — crayon doodle generator.
   Every star, flower, squiggle and scribble is generated with a seeded
   random wobble, then run through the #crayon SVG filter so it looks drawn
   by hand (and stays the same on every visit).
   Usage in HTML:  <i class="dd" data-doodle="star" data-color="pink" data-fill="yellow"></i>
   ========================================================================== */
(function () {
  'use strict';

  const COL = {
    red: '#f2382c', pink: '#ff4fa3', blue: '#2f5bea', sky: '#62bdff', yellow: '#ffd23f',
    green: '#2fbf55', lime: '#9be22e', orange: '#ff7a1f', purple: '#9b5cff', brown: '#8b4a2b',
    ink: '#1b1a1f', white: '#ffffff', cream: '#fff6d8', navy: '#1d2f8f'
  };
  const col = v => (v ? (COL[v] || v) : null);
  let UID = 0;

  function rng(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  const r1 = v => Math.round(v * 10) / 10;
  const jit = (r, a) => (r() - 0.5) * 2 * a;
  const TAU = Math.PI * 2;

  function smooth(pts, closed) {
    if (pts.length < 2) return '';
    const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
    let d = `M${r1(P[1][0])} ${r1(P[1][1])}`;
    for (let i = 1; i < P.length - 2; i++) {
      const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
      d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
    }
    return closed ? d + 'Z' : d;
  }
  const poly = (pts, closed) => 'M' + pts.map(p => r1(p[0]) + ' ' + r1(p[1])).join('L') + (closed ? 'Z' : '');

  function stroke(d, c, w, op) {
    return `<path class="ln" pathLength="1" d="${d}" fill="none" stroke="${c}" stroke-width="${r1(w)}" stroke-linecap="round" stroke-linejoin="round"${op ? ` opacity="${op}"` : ''}/>`;
  }
  const solid = (d, c, op) => `<path d="${d}" fill="${c}"${op ? ` opacity="${op}"` : ''}/>`;

  // back-and-forth crayon scribble that fills a shape (like colouring in)
  function hatch(r, shape, box, c, o) {
    o = o || {};
    const id = 'dh' + (++UID);
    const [x0, y0, x1, y1] = box;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + 4;
    const gap = o.gap || 6, a = ((o.ang != null ? o.ang : 20 + r() * 140) * Math.PI) / 180;
    const ca = Math.cos(a), sa = Math.sin(a), pts = [];
    let i = 0;
    for (let v = -R; v <= R; v += gap, i++) {
      const u = (i % 2 ? R : -R) + jit(r, 5), vv = v + jit(r, gap * 0.3);
      pts.push([cx + u * ca - vv * sa, cy + u * sa + vv * ca]);
    }
    return `<clipPath id="${id}"><path d="${shape}"/></clipPath><g clip-path="url(#${id})">${stroke(poly(pts), c, o.w || 5, o.op)}</g>`;
  }

  function ellipsePts(r, cx, cy, rx, ry, j, n, turns, a0) {
    const pts = [], N = Math.round((n || 26) * (turns || 1)), start = a0 != null ? a0 : r() * TAU;
    for (let i = 0; i <= N; i++) {
      const t = start + (i / (n || 26)) * TAU, k = 1 + jit(r, j || 0.04);
      pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
    }
    return pts;
  }

  /* ---------- the shape library ---------- */
  const S = {
    star(r, o) {
      const n = o.n || 5;
      const mk = () => {
        const p = [];
        for (let i = 0; i < n * 2; i++) {
          const R = (i % 2 ? 20 : 46) * (1 + jit(r, 0.08)), a = -Math.PI / 2 + (i * Math.PI) / n + jit(r, 0.05);
          p.push([50 + Math.cos(a) * R, 53 + Math.sin(a) * R]);
        }
        return p;
      };
      const d = poly(mk(), true);
      return (o.fill ? hatch(r, d, [0, 0, 100, 100], o.fill, { gap: 6, w: 6 }) : '') +
        stroke(d, o.color, o.w || 5) + stroke(poly(mk(), true), o.color, (o.w || 5) * 0.5, 0.6);
    },
    sparkle(r, o) {
      const mk = () => {
        const q = v => r1(v + jit(r, 2));
        return `M${q(50)} ${q(4)}Q${q(56)} ${q(44)} ${q(96)} ${q(50)}Q${q(56)} ${q(56)} ${q(50)} ${q(96)}Q${q(44)} ${q(56)} ${q(4)} ${q(50)}Q${q(44)} ${q(44)} ${q(50)} ${q(4)}Z`;
      };
      const d = mk();
      return (o.fill ? hatch(r, d, [0, 0, 100, 100], o.fill, { gap: 5, w: 5 }) : '') + stroke(d, o.color, o.w || 5) + stroke(mk(), o.color, 2.5, 0.6);
    },
    heart(r, o) {
      const mk = () => {
        const p = [];
        for (let i = 0; i < 40; i++) {
          const t = (i / 40) * TAU;
          const x = 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          p.push([50 + x * 2.6 + jit(r, 1.5), 47 + y * 2.6 + jit(r, 1.5)]);
        }
        return p;
      };
      const d = smooth(mk(), true);
      return (o.fill ? hatch(r, d, [0, 0, 100, 100], o.fill, { gap: 6, w: 6 }) : '') + stroke(d, o.color, o.w || 5) + stroke(smooth(mk(), true), o.color, 2.5, 0.55);
    },
    flower(r, o) {
      const p = [];
      for (let i = 0; i <= 150; i++) {
        const t = (i / 150) * Math.PI, rr = 42 * Math.cos(5 * t) * (1 + jit(r, 0.05));
        p.push([50 + Math.cos(t) * rr, 50 + Math.sin(t) * rr]);
      }
      const c = smooth(ellipsePts(r, 50, 50, 10, 10, 0.08, 14, 1), true);
      return stroke(smooth(p, false), o.color, o.w || 4.5) +
        hatch(r, c, [38, 38, 62, 62], o.fill || COL.yellow, { gap: 4, w: 4 }) + stroke(c, o.fill || COL.yellow, 3);
    },
    daisy(r, o) { // filled petals + centre
      let g = '';
      const n = 7 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) {
        const deg = (i / n) * 360 + jit(r, 6);
        const d = smooth(ellipsePts(r, 73, 50, 18, 9, 0.06, 14, 1), true);
        g += `<g transform="rotate(${r1(deg)} 50 50)">${solid(d, o.fill || '#fff')}${stroke(d, o.color, 2.5)}</g>`;
      }
      const c = smooth(ellipsePts(r, 50, 50, 12, 12, 0.08, 14, 1), true);
      return g + hatch(r, c, [36, 36, 64, 64], COL.yellow, { gap: 4, w: 5 }) + stroke(c, COL.orange, 3);
    },
    sun(r, o) {
      const c = smooth(ellipsePts(r, 50, 50, 22, 22, 0.05, 20, 1), true);
      let rays = '';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU + jit(r, 0.12), a1 = 30 + jit(r, 3), a2 = 44 + jit(r, 4);
        rays += stroke(poly([[50 + Math.cos(a) * a1, 50 + Math.sin(a) * a1], [50 + Math.cos(a + jit(r, 0.05)) * a2, 50 + Math.sin(a) * a2]]), o.color, o.w || 5);
      }
      return hatch(r, c, [26, 26, 74, 74], o.fill || o.color, { gap: 5, w: 5 }) + stroke(c, o.color, 4) + rays;
    },
    squiggle(r, o) {
      const p = [], amp = 9 + r() * 6, ph = r() * TAU, f = 0.07 + r() * 0.04;
      for (let x = 6; x <= 194; x += 6) p.push([x, 20 + Math.sin(x * f + ph) * amp + jit(r, 1.5)]);
      return { vb: '0 0 200 40', g: stroke(smooth(p), o.color, o.w || 5) };
    },
    zigzag(r, o) {
      const p = [];
      for (let i = 0, x = 6; x <= 194; x += 14, i++) p.push([x + jit(r, 2), (i % 2 ? 8 : 32) + jit(r, 3)]);
      return { vb: '0 0 200 40', g: stroke(poly(p), o.color, o.w || 5) };
    },
    underline(r, o) {
      const mk = (y, a) => {
        const p = [];
        for (let x = 4; x <= 196; x += 12) p.push([x, y + Math.sin(x / 30 + a) * 2.5 + jit(r, 1.2)]);
        return p;
      };
      return { vb: '0 0 200 26', g: stroke(smooth(mk(10, r() * 3)), o.color, o.w || 5) + stroke(smooth(mk(17, r() * 3).slice(1, -2)), o.color, (o.w || 5) * 0.7, 0.8) };
    },
    arrow(r, o) {
      const p = [[10 + jit(r, 3), 70 + jit(r, 4)], [40, 22 + jit(r, 8)], [90, 18 + jit(r, 8)], [128 + jit(r, 2), 44 + jit(r, 4)]];
      const e = p[3], q = p[2], ang = Math.atan2(e[1] - q[1], e[0] - q[0]);
      const h = (s) => [e[0] - Math.cos(ang + s) * 18, e[1] - Math.sin(ang + s) * 18];
      return { vb: '0 0 140 90', g: stroke(smooth(p), o.color, o.w || 5) + stroke(poly([h(0.55), e, h(-0.55)]), o.color, o.w || 5) };
    },
    spiral(r, o) {
      const p = [];
      for (let t = 0; t < 5.2 * Math.PI; t += 0.3) { const rr = 3 + t * 2.6; p.push([50 + Math.cos(t) * rr + jit(r, 1), 50 + Math.sin(t) * rr + jit(r, 1)]); }
      return stroke(smooth(p), o.color, o.w || 5);
    },
    note(r, o) {
      const head = smooth(ellipsePts(r, 36, 74, 15, 10, 0.05, 16, 1), true);
      return `<g transform="rotate(-18 36 74)">${hatch(r, head, [18, 60, 54, 88], o.fill || o.color, { gap: 4, w: 5 })}${stroke(head, o.color, 4)}</g>` +
        stroke(poly([[49 + jit(r, 1), 70], [50 + jit(r, 2), 14]]), o.color, o.w || 6) +
        stroke(smooth([[50, 14], [66, 22 + jit(r, 3)], [76, 36], [70, 50 + jit(r, 3)]]), o.color, o.w || 6);
    },
    notes(r, o) {
      const hd = (x, y) => smooth(ellipsePts(r, x, y, 12, 8.5, 0.05, 14, 1), true);
      const h1 = hd(28, 78), h2 = hd(74, 68);
      return hatch(r, h1, [14, 68, 42, 88], o.fill || o.color, { gap: 4, w: 5 }) + stroke(h1, o.color, 4) +
        hatch(r, h2, [60, 58, 88, 78], o.fill || o.color, { gap: 4, w: 5 }) + stroke(h2, o.color, 4) +
        stroke(poly([[39, 75], [40, 20]]), o.color, 5) + stroke(poly([[85, 65], [86, 10]]), o.color, 5) +
        stroke(poly([[40, 20 + jit(r, 2)], [86, 10 + jit(r, 2)]]), o.color, 9) + stroke(poly([[40, 32], [86, 22]]), o.color, 5, 0.8);
    },
    cloud(r, o) {
      const p = [];
      for (let i = 0; i < 48; i++) {
        const t = (i / 48) * TAU, rr = 28 * (0.84 + 0.2 * Math.abs(Math.sin(4 * t))) * (1 + jit(r, 0.03));
        p.push([50 + Math.cos(t) * rr * 1.5, 54 + Math.sin(t) * rr * 0.9]);
      }
      const d = smooth(p, true);
      return { vb: '0 0 100 100', g: (o.fill ? hatch(r, d, [0, 20, 100, 90], o.fill, { gap: 6, w: 5 }) : '') + stroke(d, o.color, o.w || 4.5) };
    },
    crown(r, o) {
      const p = [[12, 80], [10, 30], [30, 56], [50, 18], [70, 56], [90, 30], [88, 80]].map(([x, y]) => [x + jit(r, 2), y + jit(r, 3)]);
      const d = poly(p, true);
      return hatch(r, d, [8, 16, 92, 82], o.fill || COL.yellow, { gap: 5, w: 5 }) + stroke(d, o.color, o.w || 5) +
        [[10, 26], [50, 13], [90, 26]].map(([x, y]) => stroke(smooth(ellipsePts(r, x, y, 4.5, 4.5, 0.1, 10, 1), true), o.color2 || COL.pink, 4)).join('');
    },
    circle(r, o) {
      return { vb: '0 0 220 110', g: stroke(smooth(ellipsePts(r, 110, 55, 100, 44, 0.05, 24, 1.18, Math.PI * (0.9 + r() * 0.2))), o.color, o.w || 5) };
    },
    scribble(r, o) {
      const p = []; let x = 50, y = 50, a = r() * TAU;
      for (let i = 0; i < (o.n || 70); i++) {
        a += jit(r, 1.3);
        x += Math.cos(a) * 9; y += Math.sin(a) * 9;
        if (((x - 50) / 42) ** 2 + ((y - 50) / 36) ** 2 > 1) { a = Math.atan2(50 - y, 50 - x) + jit(r, 0.6); x += Math.cos(a) * 6; y += Math.sin(a) * 6; }
        p.push([x, y]);
      }
      return stroke(smooth(p), o.color, o.w || 4);
    },
    blob(r, o) { // scribble-coloured blob (like a crayon patch)
      const p = [];
      for (let i = 0; i < 16; i++) { const t = (i / 16) * TAU, rr = 40 * (1 + jit(r, 0.14)); p.push([50 + Math.cos(t) * rr, 50 + Math.sin(t) * rr * 0.86]); }
      const d = smooth(p, true);
      return hatch(r, d, [0, 0, 100, 100], o.color, { gap: o.gap || 5, w: o.w || 6 }) + hatch(r, d, [0, 0, 100, 100], o.color, { gap: 9, w: 3, op: 0.7 });
    },
    burst(r, o) {
      const n = o.n || 16, p = [];
      for (let i = 0; i < n * 2; i++) { const R = (i % 2 ? 34 : 48) * (1 + jit(r, 0.05)), a = (i * Math.PI) / n; p.push([50 + Math.cos(a) * R, 50 + Math.sin(a) * R]); }
      const d = poly(p, true);
      return solid(d, o.fill || COL.yellow) + hatch(r, d, [0, 0, 100, 100], o.color2 || 'rgba(255,255,255,.55)', { gap: 7, w: 3 }) + stroke(d, o.color, o.w || 3.5);
    },
    bolt(r, o) {
      const d = poly([[58, 4], [24, 54], [48, 54], [36, 96], [78, 40], [52, 40], [64, 4]].map(([x, y]) => [x + jit(r, 2), y + jit(r, 2)]), true);
      return hatch(r, d, [20, 0, 82, 100], o.fill || COL.yellow, { gap: 5, w: 5 }) + stroke(d, o.color, o.w || 4.5);
    },
    smile(r, o) {
      const c = smooth(ellipsePts(r, 50, 50, 42, 40, 0.04, 22, 1.05), false);
      return (o.fill ? hatch(r, smooth(ellipsePts(r, 50, 50, 40, 38, 0.03, 20, 1), true), [6, 6, 94, 94], o.fill, { gap: 6, w: 5 }) : '') +
        stroke(c, o.color, o.w || 4.5) + stroke(poly([[36, 34], [36 + jit(r, 1), 46]]), o.color, 6) + stroke(poly([[64, 34], [64 + jit(r, 1), 46]]), o.color, 6) +
        stroke(smooth([[28, 58], [40, 72 + jit(r, 2)], [60, 73 + jit(r, 2)], [72, 58]]), o.color, o.w || 4.5);
    },
    vinyl(r, o) {
      let g = solid(smooth(ellipsePts(r, 50, 50, 48, 48, 0.008, 40, 1), true), COL.ink);
      for (let k = 0; k < 6; k++) g += stroke(smooth(ellipsePts(r, 50, 50, 44 - k * 4.4, 44 - k * 4.4, 0.012, 30, 1.02)), '#3d3b47', 1.2);
      const lab = smooth(ellipsePts(r, 50, 50, 16, 16, 0.03, 18, 1), true);
      g += solid(lab, o.fill || COL.pink) + hatch(r, lab, [34, 34, 66, 66], o.color2 || COL.yellow, { gap: 4, w: 2.5 });
      g += solid(smooth(ellipsePts(r, 50, 50, 2.6, 2.6, 0, 10, 1), true), '#fffefb');
      g += stroke(smooth(ellipsePts(r, 50, 50, 38, 38, 0.02, 20, 0.18, -0.9)), 'rgba(255,255,255,.35)', 3);
      return g;
    },
    dots(r, o) {
      let g = '';
      for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        const rad = 5.4 * (1 - (i + j) / 15);
        if (rad > 0.6) g += `<circle cx="${8 + i * 12}" cy="${8 + j * 12}" r="${r1(rad + jit(r, 0.3))}" fill="${o.color}"/>`;
      }
      return g;
    },
    asterisk(r, o) {
      let g = '';
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI + jit(r, 0.1), R = 42 + jit(r, 4);
        g += stroke(poly([[50 - Math.cos(a) * R, 50 - Math.sin(a) * R], [50 + Math.cos(a) * R, 50 + Math.sin(a) * R]]), o.color, o.w || 6);
      }
      return g;
    },
    loops(r, o) {
      const p = [];
      for (let t = 0; t < 7 * TAU; t += 0.35) p.push([10 + t * 4 - Math.cos(t) * 9, 22 + Math.sin(t) * 12 + jit(r, 1)]);
      return { vb: '0 0 200 44', g: stroke(smooth(p), o.color, o.w || 4) };
    },
    check(r, o) { return stroke(smooth([[12, 52], [36, 80 + jit(r, 3)], [90, 14 + jit(r, 4)]]), o.color, o.w || 9); },
    plus(r, o) {
      return stroke(poly([[50 + jit(r, 2), 8], [50 + jit(r, 2), 92]]), o.color, o.w || 9) + stroke(poly([[8, 50 + jit(r, 2)], [92, 50 + jit(r, 2)]]), o.color, o.w || 9);
    },
    cassette(r, o) {
      const box = poly([[6, 18], [94, 16], [96, 82], [5, 84]].map(([x, y]) => [x + jit(r, 1.5), y + jit(r, 1.5)]), true);
      const win = poly([[24, 34], [76, 33], [77, 56], [23, 57]], true);
      const reel = x => smooth(ellipsePts(r, x, 45, 7, 7, 0.06, 12, 1), true);
      return solid(box, o.fill || COL.orange) + hatch(r, box, [0, 10, 100, 90], 'rgba(255,255,255,.35)', { gap: 7, w: 3 }) + stroke(box, o.color, 4) +
        solid(win, '#fffdf4') + stroke(win, o.color, 3) + stroke(reel(37), o.color, 3) + stroke(reel(63), o.color, 3) +
        stroke(poly([[30, 84], [36, 70], [64, 70], [70, 84]]), o.color, 3) + stroke(poly([[14, 24], [60, 23]]), o.color, 2.5, 0.6);
    },
    lantern(r, o) {
      const body = smooth(ellipsePts(r, 50, 52, 30, 26, 0.04, 20, 1), true);
      return hatch(r, body, [18, 24, 82, 80], o.fill || COL.red, { gap: 5, w: 6 }) + stroke(body, o.color, 4) +
        stroke(poly([[38, 26], [62, 26]]), COL.yellow, 7) + stroke(poly([[38, 78], [62, 78]]), COL.yellow, 7) +
        stroke(poly([[50, 6], [50, 24]]), o.color, 3) + stroke(smooth([[50, 80], [49, 88], [51, 96]]), COL.yellow, 4) +
        stroke(smooth([[36, 32], [32, 52], [36, 72]]), 'rgba(255,255,255,.6)', 3) + stroke(smooth([[64, 32], [68, 52], [64, 72]]), 'rgba(255,255,255,.6)', 3);
    },
    eye(r, o) {
      const lid = smooth([[6, 50], [50, 18 + jit(r, 3)], [94, 50], [50, 82 + jit(r, 3)]], true);
      const ir = smooth(ellipsePts(r, 50, 50, 16, 16, 0.05, 14, 1), true);
      return solid(lid, '#fff') + stroke(lid, o.color, 4) + hatch(r, ir, [32, 32, 68, 68], o.fill || COL.blue, { gap: 4, w: 5 }) + stroke(ir, o.color, 3) +
        `<circle cx="50" cy="50" r="6" fill="${o.color}"/>`;
    },
    mic(r, o) {
      const head = smooth(ellipsePts(r, 50, 30, 18, 18, 0.04, 16, 1), true);
      const body = poly([[40, 46], [60, 46], [55, 92], [45, 92]], true);
      return solid(body, o.color) + hatch(r, head, [30, 10, 70, 50], o.fill || '#b9bbc9', { gap: 4, w: 4 }) + stroke(head, o.color, 4) +
        stroke(poly([[34, 30], [66, 30]]), o.color, 2.5) + stroke(poly([[50, 13], [50, 47]]), o.color, 2.5);
    }
  };

  function svg(type, opts) {
    const fn = S[type];
    if (!fn) return '';
    const o = Object.assign({}, opts);
    o.color = col(o.color) || COL.ink;
    o.fill = col(o.fill);
    o.color2 = col(o.color2);
    const r = rng(o.seed != null ? o.seed : hash(type));
    let out = fn(r, o);
    if (typeof out === 'string') out = { vb: '0 0 100 100', g: out };
    const filter = type === 'vinyl' ? 'rough' : 'crayon'; // big black record: wobble, no speckle
    return `<svg viewBox="${out.vb}" aria-hidden="true" focusable="false"><g filter="url(#${filter})">${out.g}</g></svg>`;
  }

  function decorate(root) {
    (root || document).querySelectorAll('[data-doodle]').forEach((el, i) => {
      if (el.dataset.done) return;
      const type = el.dataset.doodle;
      const sec = el.closest('[id]');
      const seed = el.dataset.seed ? +el.dataset.seed : hash(type + ':' + i + ':' + (sec ? sec.id : ''));
      el.innerHTML = svg(type, {
        color: el.dataset.color, fill: el.dataset.fill, color2: el.dataset.color2,
        w: el.dataset.w ? +el.dataset.w : undefined, n: el.dataset.n ? +el.dataset.n : undefined,
        gap: el.dataset.gap ? +el.dataset.gap : undefined, seed
      });
      el.dataset.done = '1';
    });
  }

  window.Doodle = { svg, decorate, rng, hash, COL, types: Object.keys(S) };
})();
