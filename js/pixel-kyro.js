/* ==========================================================================
   pixel-kyro.js — 8-bit Kyro, drawn pixel-by-pixel (no image files).
   Every pose is a list of frames. A frame is composed from layered pixel
   maps (hair, face, jacket, arms, props), then auto-outlined like classic
   sprite art. Edit the maps below to restyle the character.
   ========================================================================== */
(function () {
  'use strict';

  const W = 64, H = 64;      // canvas size per frame
  const OX = 16, OY = 14;    // where the 32px-wide character sits on the canvas

  const PAL = {
    X: '#141218',                 // auto outline
    H: '#26222f', h: '#5a548a',   // hair + blue-violet shine
    S: '#fbd9c0', s: '#eab394',   // skin
    W: '#ffffff', E: '#2b1912', e: '#86523a', L: '#1a1720', B: '#ff9ec0',
    M: '#b93043', m: '#ec6b84', w: '#ffffff',
    C: '#2c2b36', c: '#66647c', N: '#e3e7f2',   // black shirt, collar, silver chain
    J: '#2f5bea', j: '#1f3fb3', Y: '#ffd23f',   // cobalt jacket, yellow patch
    P: '#f3e9d0', p: '#d5c39a',                 // cream wide-leg pants
    K: '#ffffff', k: '#ff4f9a', G: '#b9bbc9',   // sneakers
    Q: '#ff4f9a', q: '#c0266a',                 // headphones
    r: '#ef3a2f', Z: '#fffdf4', A: '#7a4122', R: '#c9773f',
    D: '#353447', d: '#7a7a92', V: '#18171d', v: '#ffd23f',
    U: '#62bdff', T: '#2fbf55', O: '#ff7a1f',
    '~': 'rgba(20,18,24,0.16)'
  };

  /* ---------- head + long wavy hair (24 wide, centre part) ---------- */
  const HEAD = [
    '........HHHHHHHH........',
    '.....HHHHHHHHHHHHHH.....',
    '....HHHHhhHHHHhhHHHH....',
    '...HHHhhHHHHHHHHhhHHH...',
    '..HHHhHHHHHSSHHHHHhHHH..',
    '..HHHHHHHHSSSSHHHHHHHH..',
    '.HHHHHHHHSSSSSSHHHHHHHH.',
    '.HHHHHHSSSSSSSSSSHHHHHH.',
    '.HHHHHSSSSSSSSSSSSHHHHH.',
    'HHHHHSLLLSSSSSSLLLSHHHHH',
    'HHHHSSSLLSSSSSSLLSSSHHHH',
    'HHHHSSSWESSSSSSEWSSSHHHH',
    'HHHHSSSWESSSSSSEWSSSHHHH',
    'HHHHSBBWeSSSSSSeWBBSHHHH',
    'HHHHSSSSSSSSsSSSSSSSHHHH',
    'HHHHSSSSSMwwwwwMSSSSHHHH',
    'HHHHSSSSSSmmmmmSSSSSHHHH',
    'HHHHHSSSSSSSSSSSSSSHHHHH',
    '.HHHHHSSSSSSSSSSSSHHHHH.',
    '.HHHHHHsSSSSSSSSsHHHHHH.',
    '...HHHHH.sSSSSs.HHHHH...',
    '..HHHHHH........HHHHHH..',
    '...HHHhHH......HHhHHH...',
    '...HHHHHH......HHHHHH...',
    '....HHHHH......HHHHH....',
    '...HHHhH........HhHHH...',
    '....HHHH........HHHH....',
    '...HHH............HHH...',
    '....H..............H....'
  ];

  /* ---------- torso: black shirt + open cobalt jacket + chain ---------- */
  const TORSO = [ // starts at y = 21
    '..............ssss..............',
    '.........JJJJcCSSCcJJJJ.........',
    '........JJJJJcCSSCcJJJJJ........',
    '........JJJJJCCNNCCJJJJJ........',
    '........JJJJJCCCCCCJJJJJ........',
    '........JJJJJCCcCCCJJJJJ........',
    '........JJJJJCCCCCCJJJJJ........',
    '........JJJJJCCcCCCJJJJJ........',
    '........JJJJJCCCCCCJJYYJ........',
    '........wwwwwCCCCCCwwwww........',
    '.........PPPPPPPPPPPPPP.........',
    '.........PPPPPPPPPPPPPP.........',
    '.........PPPPPPppPPPPPP.........'
  ];

  /* ---------- wide-leg pants + chunky sneakers ---------- */
  const LEGS = [ // starts at y = 34
    '........PPPPPPp..pPPPPPP........',
    '........PPPPPPp..pPPPPPP........',
    '........PPPPPpp..ppPPPPP........',
    '.......PPPPPPpp..ppPPPPPP.......',
    '.......PPPPPPpp..ppPPPPPP.......',
    '.......PPPPPPPp..pPPPPPPP.......',
    '.......pppppppp..pppppppp.......',
    '.......KKkKKKKK..KKKKKkKK.......',
    '......KKkkKKKKK..KKKKKkkKK......',
    '......GGGGGGGGG..GGGGGGGGG......'
  ];
  const LEG_L = LEGS.map(r => r.slice(0, 16));
  const LEG_R = LEGS.map(r => r.slice(16));

  /* ---------- face overlays (head coords) ---------- */
  const BLINK = { eyes: true, parts: [
    { x: 7, y: 10, rows: ['SS', 'SS', 'LL', 'SS'] },
    { x: 15, y: 10, rows: ['SS', 'SS', 'LL', 'SS'] }
  ]};
  const HAPPY = { eyes: true, parts: [
    { x: 6, y: 10, rows: ['SSSS', 'SLLS', 'LSSL', 'BSSS'] },
    { x: 14, y: 10, rows: ['SSSS', 'SLLS', 'LSSL', 'SSSB'] }
  ]};
  const SING = { parts: [{ x: 9, y: 15, rows: ['SMMMMMS', 'SSMmMSS'] }] };
  const OH = { parts: [{ x: 9, y: 15, rows: ['SSSMSSS', 'SSMmMSS'] }] };

  /* ---------- arms ---------- */
  const ARMS = {};
  const mirror = rows => rows.map(r => [...r].reverse().join(''));
  function armL(name, x, y, rows, front) {
    ARMS[name + 'L'] = { x, y, rows, front: !!front };
    ARMS[name + 'R'] = { x: 32 - x - rows[0].length, y, rows: mirror(rows), front: !!front };
  }
  function armR(name, x, y, rows, front) {
    ARMS[name + 'R'] = { x, y, rows, front: !!front };
    ARMS[name + 'L'] = { x: 32 - x - rows[0].length, y, rows: mirror(rows), front: !!front };
  }
  armL('down', 5, 22, ['..J', '.JJ', 'JJJ', 'JJJ', 'JJj', 'JJj', 'JJj', 'www', 'SSS', 'sSs']);
  const WAVE_BODY = ['....www.', '....JJJ.', '...JJJ..', '...JJJ..', '..JJJ...', '..JJj...',
    '.JJJ....', '.JJj....', 'JJJ.....', 'JJJ.....', 'JJ......'];
  armR('wave', 24, 9, ['.....SS.', '....SSSS', '....SSS.'].concat(WAVE_BODY), true);
  armR('wave2', 24, 9, ['......SS', '.....SSS', '....SSS.'].concat(WAVE_BODY), true);
  armR('point', 24, 14, ['.........SSS', '.........SSS', '........www.', '.......JJJ..', '......JJJ...',
    '.....JJj....', '...JJJJ.....', '.JJJJ.......', 'JJJ.........'], true);
  armR('phone', 24, 13, ['..SSS', '..SSS', '..www', '..JJJ', '.JJJ.', '.JJJ.', 'JJJ..', 'JJJ..', 'JJj..', 'JJ...'], true);
  armL('dj', 1, 22, ['......JJ', '.....JJJ', '....JJJ.', '...JJJ..', '..JJj...', '.www....', 'SSS.....', 'SSs.....'], true);
  armR('mic', 20, 18, ['SSS....', 'SSS....', '.wwJ...', '..JJJJ.', '...JJJJ'], true);

  /* ---------- tiny pixel font ---------- */
  const GLYPH = {
    H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'],
    I: ['XXX', '.X.', '.X.', '.X.', 'XXX'],
    R: ['XX.', 'X.X', 'XX.', 'X.X', 'X.X'],
    E: ['XXX', 'X..', 'XX.', 'X..', 'XXX'],
    M: ['X...X', 'XX.XX', 'X.X.X', 'X...X', 'X...X'],
    '♥': ['.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..']
  };

  /* ---------- drawing helpers (character coords) ---------- */
  function P(b, x, y, c) {
    x += OX; y += OY;
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    b[y * W + x] = c;
  }
  function rect(b, x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) P(b, x + i, y + j, c); }
  function line(b, x0, y0, x1, y1, c) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      P(b, x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function blit(b, rows, x, y) {
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j];
      for (let i = 0; i < row.length; i++) if (row[i] !== '.') P(b, x + i, y + j, row[i]);
    }
  }
  function text(b, str, x, y, c) {
    let cx = x;
    for (const ch of str) {
      const g = GLYPH[ch];
      g.forEach((row, yy) => [...row].forEach((v, xx) => { if (v === 'X') P(b, cx + xx, y + yy, c); }));
      cx += g[0].length + 1;
    }
  }

  /* ---------- props ---------- */
  function chart(b) {
    rect(b, 34, 0, 12, 13, 'Z');
    rect(b, 36, 8, 2, 3, 'U'); rect(b, 39, 5, 2, 6, 'k'); rect(b, 42, 2, 2, 9, 'Y');
    line(b, 35, 11, 44, 11, 'L');
    line(b, 35, 8, 43, 1, 'r'); P(b, 41, 1, 'r'); P(b, 42, 1, 'r'); P(b, 43, 2, 'r'); P(b, 43, 3, 'r');
    line(b, 36, 13, 35, 19, 'A'); line(b, 43, 13, 44, 19, 'A');
  }
  function briefcase(b) {
    rect(b, 2, 33, 9, 6, 'R'); rect(b, 2, 38, 9, 1, 'A'); rect(b, 6, 34, 1, 2, 'Y');
    P(b, 4, 32, 'A'); P(b, 5, 31, 'A'); P(b, 6, 31, 'A'); P(b, 7, 31, 'A'); P(b, 8, 32, 'A');
  }
  function record(b, cx) {
    rect(b, cx - 3, 29, 7, 1, 'V'); rect(b, cx - 5, 30, 11, 1, 'V');
    rect(b, cx - 1, 29, 3, 2, 'v');
  }
  function booth(b) {
    rect(b, -10, 31, 52, 2, 'd'); rect(b, -10, 33, 52, 11, 'D'); rect(b, -10, 36, 52, 1, 'Q');
    record(b, 2); record(b, 30);
    rect(b, 12, 39, 8, 3, 'Z'); rect(b, 14, 40, 4, 1, 'k');
    P(b, -6, 39, 'Y'); P(b, -3, 39, 'T'); P(b, 0, 39, 'U'); P(b, 33, 39, 'Y'); P(b, 36, 39, 'k');
  }
  function mic(b) {
    rect(b, 18, 13, 4, 4, 'G'); P(b, 18, 13, 'N'); P(b, 19, 13, 'N'); rect(b, 18, 15, 4, 1, 'D');
    P(b, 20, 17, 'V'); P(b, 21, 17, 'V');
  }
  function sign(dy) {
    return b => {
      rect(b, 4, 21 + dy, 24, 14, 'Z');
      text(b, 'HIRE', 9, 23 + dy, 'J');
      text(b, 'ME', 8, 29 + dy, 'k');
      text(b, '♥', 19, 29 + dy, 'r');
      rect(b, 2, 26 + dy, 3, 3, 'S'); rect(b, 27, 26 + dy, 3, 3, 'S');
    };
  }
  function phones(b, hy) { // over-ear headphones, head coords shifted by +4
    const p = (x, y, c) => P(b, x + 4, y + hy, c || 'Q');
    for (let x = 7; x <= 16; x++) p(x, -1);
    [[5, 0], [6, 0], [17, 0], [18, 0], [3, 1], [4, 1], [19, 1], [20, 1], [2, 2], [3, 2], [20, 2], [21, 2],
     [1, 3], [2, 3], [21, 3], [22, 3], [0, 4], [1, 4], [22, 4], [23, 4], [-1, 5], [0, 5], [23, 5], [24, 5],
     [-1, 6], [0, 6], [23, 6], [24, 6], [-1, 7], [24, 7]].forEach(([x, y]) => p(x, y));
    for (let y = 8; y <= 14; y++) {
      for (let x = -3; x <= 0; x++) p(x, y, x === 0 ? 'q' : 'Q');
      for (let x = 23; x <= 26; x++) p(x, y, x === 23 ? 'q' : 'Q');
    }
  }
  function glasses(b, hy) {
    const p = (x, y) => P(b, x + 4, y + hy, 'r');
    for (const x0 of [6, 14]) {
      for (let x = x0; x < x0 + 4; x++) { p(x, 10); p(x, 14); }
      for (let y = 11; y <= 13; y++) { p(x0, y); p(x0 + 3, y); }
    }
    for (let x = 10; x <= 13; x++) p(x, 11);
  }

  /* ---------- poses ---------- */
  const POSES = {
    idle:     { ms: 520, frames: [{}, { bob: 1 }] },
    wave:     { ms: 280, frames: [{ arms: ['downL', 'waveR'] }, { arms: ['downL', 'wave2R'] }] },
    walk:     { ms: 120, frames: [{ legL: -2 }, { bob: 1 }, { legR: -2 }, { bob: 1 }] },
    jump:     { ms: 200, frames: [{ arms: ['waveL', 'waveR'], legL: -2, legR: -2, face: OH }] },
    listen:   { ms: 340, frames: [
      { arms: ['downL', 'phoneR'], phones: 1, face: HAPPY },
      { arms: ['downL', 'phoneR'], phones: 1, face: HAPPY, headBob: 1 }] },
    business: { ms: 420, frames: [
      { arms: ['downL', 'pointR'], glasses: 1, mid: [chart], top: [briefcase] },
      { arms: ['downL', ['pointR', 0, -1]], glasses: 1, mid: [chart], top: [briefcase] }] },
    dj:       { ms: 230, frames: [
      { arms: ['djL', 'phoneR'], phones: 1, face: HAPPY, mid: [booth] },
      { arms: [['djL', 2, 0], 'phoneR'], phones: 1, face: HAPPY, headBob: 1, mid: [booth] }] },
    sing:     { ms: 300, frames: [
      { arms: ['waveL', 'micR'], face: [HAPPY, SING], mid: [mic] },
      { arms: ['wave2L', 'micR'], face: [HAPPY], mid: [mic], headBob: 1 }] },
    bye:      { ms: 360, frames: [{ mid: [sign(0)], face: HAPPY }, { mid: [sign(1)], bob: 1, face: HAPPY }] }
  };

  /* ---------- compose one frame ---------- */
  function build(f, blink) {
    const b = new Array(W * H).fill(null);
    const bob = f.bob || 0, hy = bob + (f.headBob || 0);
    const arms = (f.arms || ['downL', 'downR']).map(a => {
      const [k, dx, dy] = Array.isArray(a) ? a : [a, 0, 0];
      return Object.assign({}, ARMS[k], { dx, dy });
    });
    const drawArm = a => blit(b, a.rows, a.x + a.dx, a.y + a.dy + bob);

    arms.filter(a => !a.front).forEach(drawArm);
    blit(b, LEG_L, 0, 34 + (f.legL || 0));
    blit(b, LEG_R, 16, 34 + (f.legR || 0));
    blit(b, TORSO, 0, 21 + bob);
    blit(b, HEAD, 4, hy);
    blit(b, ['.Y.', 'YYY', '.Y.'], 22, hy + 5); // star hair clip

    const faces = [].concat(f.face || []);
    if (blink && !faces.some(o => o.eyes)) faces.push(BLINK);
    faces.forEach(o => o.parts.forEach(p => blit(b, p.rows, 4 + p.x, hy + p.y)));
    if (f.glasses) glasses(b, hy);
    if (f.phones) phones(b, hy);
    (f.mid || []).forEach(fn => fn(b));
    arms.filter(a => a.front).forEach(drawArm);
    (f.top || []).forEach(fn => fn(b));

    // auto outline (4-neighbour), then a soft ground shadow
    const o = b.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (b[i]) continue;
      if ((x > 0 && b[i - 1]) || (x < W - 1 && b[i + 1]) || (y > 0 && b[i - W]) || (y < H - 1 && b[i + W])) o[i] = 'X';
    }
    const sh = (x0, x1, y) => { for (let x = x0; x <= x1; x++) { const i = (y + OY) * W + x + OX; if (!o[i]) o[i] = '~'; } };
    sh(5, 26, 45); sh(8, 23, 46);
    return o;
  }

  function render(buf) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    for (let i = 0; i < buf.length; i++) {
      if (!buf[i]) continue;
      x.fillStyle = PAL[buf[i]] || buf[i];
      x.fillRect(i % W, (i / W) | 0, 1, 1);
    }
    return c;
  }

  const hasEyeOverride = f => [].concat(f.face || []).some(o => o.eyes);
  const poses = {};
  Object.keys(POSES).forEach(k => {
    const def = POSES[k];
    poses[k] = {
      ms: def.ms,
      frames: def.frames.map(f => render(build(f))),
      blink: def.frames.map(f => (hasEyeOverride(f) ? null : render(build(f, true))))
    };
  });

  function paint(canvas, pose, i, blink) {
    const p = poses[pose] || poses.idle;
    const n = p.frames.length;
    const src = (blink && p.blink[i % n]) || p.frames[i % n];
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  }

  // head-and-shoulders crop (for the backstage pass, stickers…)
  function portrait(canvas, pose) {
    const src = poses[pose || 'idle'].frames[0];
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(src, OX - 3, OY - 3, 38, 36, 0, 0, canvas.width, canvas.height);
  }

  window.PixelKyro = { W, H, poses, paint, portrait };
})();
