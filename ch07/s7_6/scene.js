// 第 7 章 7.6 特征值问题（Leon 9th §7.6：定理 7.6.1 扰动界、对称 vs 非对称、幂法例 1、收敛比、QR 算法例 2、海森伯格形与原点平移）。
// 分镜：特征值周围的扰动圆（对称：小；非对称：被 cond(X) 吹大）→ 3B1B：幂法——向量一次次被拉向 (1, 1) 方向
//       → 偏离分量每次缩成 ⅓ 的柱子 → QR 算法：A_k 的非对角元一格格褪色，对角线逼近 3 和 1 → 海森伯格图案 → 同济：相似矩阵 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, Plane, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_confused', 'ds_happy', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.6 特征值问题', hi: 3, en: 'THE EIGENVALUE PROBLEM',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C05: 0.6, C07: 0.6, C10: 0.6, C13: 0.6, C15: 0.6, G01: 0.6, C16: 0.6 },
    post: { C01: 0.6, C02: 1.4, C03: 1.2, C04: 1.2, C05: 1.0, C06: 1.0, C07: 1.4, C08: 1.2, C09: 1.0, C10: 0.8, C11: 1.0, C12: 1.2, C13: 1.4, C14: 1.2, C15: 1.2, G01: 0.8, C16: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, o2: cue('C01', '换一条路'), th: L('C02').s, th2: cue('C02', '定理七点六点一'), th3: cue('C02', '不超过X的条件数'), sy: L('C03').s, sy2: cue('C03', '非常稳'), ns: L('C04').s, ns2: cue('C04', '十万倍'),
    d1: L('D01').s, pw: L('C05').s, pw2: cue('C05', '各自特征值的k次方'), pw3: cue('C05', '压倒其余各项'), sc: L('C06').s, sc2: cue('C06', '最大特征值的近似'),
    e1: L('C07').s, e1b: cue('C07', '第一次得五、四'), e1c: cue('C07', '第二次'), e1d: cue('C07', '第三次'), e1e: cue('C07', '真值是三'), cv: L('C08').s, cv2: cue('C08', '三分之一'), cv3: cue('C08', '缩成三分之一'),
    d2: L('D02').s, sl: L('C09').s, sl2: cue('C09', '一次只给出一个'), qa: L('C10').s, qa2: cue('C10', '十大算法'), qs: L('C11').s, qs2: cue('C11', '再反过来乘'), qs3: cue('C11', '不断重复'),
    sm: L('C12').s, sm2: cue('C12', '正交相似变换'), e2: L('C13').s, e2b: cue('C13', '再一次'), cn: L('C14').s, cn2: cue('C14', '对角线逼近'), cn3: cue('C14', '实舒尔形'),
    hs: L('C15').s, hs2: cue('C15', '三对角形'), hs3: cue('C15', '原点平移'), tj: L('G01').s, tj2: cue('G01', '特征值，就直接写在'), d3: L('D03').s, sum: L('C16').s, end: L('C17').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.o2, 0.3); TL.sfx('sting', T.th2, 0.3); TL.sfx('pop', T.th3, 0.3); TL.sfx('ding', T.sy2, 0.3); TL.sfx('impact', T.ns2, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.pw, 0.3); TL.sfx('warp', T.pw3, 0.3); TL.sfx('pop', T.sc2, 0.3); [T.e1b, T.e1c, T.e1d].forEach(x => TL.sfx('whoosh', x, 0.28)); TL.sfx('ding_hi', T.e1e, 0.3); TL.sfx('pop', T.cv2, 0.3);
  TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.sl2, 0.3); TL.sfx('sting', T.qa, 0.32); TL.sfx('shimmer', T.qa2, 0.3); TL.sfx('pop', T.qs2, 0.3); TL.sfx('ding', T.sm2, 0.3); TL.sfx('pop', T.e2, 0.3); TL.sfx('pop', T.e2b, 0.3);
  for (let k = 0; k < 4; k++) TL.sfx('marimba', T.cn + 0.4 + k * 0.7, 0.18); TL.sfx('ding_hi', T.cn2, 0.3); TL.sfx('pop', T.hs, 0.3); TL.sfx('pop', T.hs3, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C17').e + 0.3, 0.4);

  // ── A：扰动界 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.d1 - 0.3); if (a <= 0) return;
    ctag('不解特征多项式', DX, DY - 390, { px: 36, a: a * gin(T.o2), color: C.peri, font: F.serif });
    B.card(DX, DY - 300, 700, 90, a * gin(T.th2), C.peri); texAt('thm', DX, DY - 300, 36, { alpha: a * gin(T.th2) });
    ctag('X 把 A 对角化，E 是扰动', DX, DY - 220, { px: 26, a: a * gin(T.th3), color: C.inkMid });
    // 两块“复平面”：对称（小圆）vs 非对称（大圆）
    const cxL = DX - 220, cxR = DX + 220, cy = DY + 40;
    const gS = a * gin(T.sy), gN = a * gin(T.ns);
    [[cxL, gS, '对称', OK, 22], [cxR, gN, '非对称', C.free, 22 + 120 * smoother(prog(B.t, T.ns + 0.8, T.ns2 + 0.3))]].forEach(([cx, g, lb, col, r]) => {
      if (g <= 0) return; B.line2([cx - 170, cy], [cx + 170, cy], C.inkMid, g * 0.5, 2); B.line2([cx, cy - 150], [cx, cy + 150], C.inkMid, g * 0.3, 2);
      ctx.save(); ctx.globalAlpha = g * 0.25; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx + 60, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = g; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      B.dot(cx + 60, cy, 8, C.ink, g); ctag(lb, cx, cy - 190, { px: 30, a: g, color: col });
    });
    texAt('sym', cxL, DY + 250, 26, { alpha: gS }); ctag('cond₂(Q) = 1：非常稳', cxL, DY + 310, { px: 24, a: a * gin(T.sy2), color: OK });
    texAt('ns', cxR, DY + 250, 26, { alpha: gN }); ctag('放大十万倍', cxR, DY + 310, { px: 26, a: a * gin(T.ns2), color: C.free });
  }

  // ── B：幂法 ──
  const P = new Plane({ ox: DX - 260, oy: DY + 230, u: 95, R: 5 });
  const IT = [[2, 1], [1, 0.8], [1, 13 / 14], [1, 40 / 41], [1, 121 / 122]];
  function shotB() {
    const a = B.win(T.d1 - 0.2, T.qa - 0.3); if (a <= 0) return;
    ctag('幂法：反复乘 A', DX, DY - 390, { px: 36, a: a * gin(T.pw), color: C.peri, font: F.serif });
    texAt('pw', DX, DY - 310, 30, { alpha: a * gin(T.pw2) * (1 - gin(T.sc - 0.1)) });
    texAt('pstep', DX, DY - 310, 30, { alpha: a * gin(T.sc) * (1 - gin(T.e1 - 0.2)) });
    texAt('pA', DX, DY - 310, 32, { alpha: a * gin(T.e1) });
    // 平面上的迭代向量
    const g = a * gin(T.pw - 0.1); if (g > 0) {
      B.line2(P.S([-0.3, 0]), P.S([3.4, 0]), C.inkMid, g * 0.5, 2); B.line2(P.S([0, -0.3]), P.S([0, 2.6]), C.inkMid, g * 0.5, 2);
      B.line2(P.S([-0.2, -0.2]), P.S([2.6, 2.6]), C.i, g * 0.6, 3, [10, 8]); B.tag('特征方向 (1, 1)', P.S([2.3, 2.5])[0] - 30, P.S([2.3, 2.5])[1] - 20, { px: 24, a: g, color: C.i });
      const ts = [T.e1, T.e1b, T.e1c, T.e1d, T.e1d + 1.5];
      IT.forEach((v, k) => { const gk = g * gin(ts[k]), last = k === IT.length - 1 || B.t < ts[k + 1]; B.vec(P, v, gk * (last ? 1 : 0.3), { color: last ? C.peri : C.inkMid, width: last ? 7 : 4, head: last ? 22 : 14 }); });
    }
    const rows = [['k', 'Au', '缩放后 u'], ['1', '(5, 4)', '(1, 0.8)'], ['2', '(2.8, 2.6)', '(1, 0.929)'], ['3', '(2.929, 2.857)', '(1, 0.976)']];
    const gt = a * gin(T.e1b) * (1 - gin(T.cv - 0.2));
    B.mat(DX + 190, DY - 120, rows, gt, { cw: 150, ch: 52, px: 24, bracket: false, fade: (i) => (i === 0 ? 1 : gin([0, T.e1b, T.e1c, T.e1d][i])), col: (i, j) => (i === 0 ? C.inkMid : j === 1 && i > 0 ? C.peri : C.ink) });
    ctag('λ ≈ 2.98（真值 3）', DX + 190, DY + 40, { px: 30, a: a * gin(T.e1e) * (1 - gin(T.cv - 0.2)), color: OK, font: F.serif });
    const gc = a * gin(T.cv - 0.2); if (gc > 0) {
      texAt('rate', DX + 200, DY - 160, 34, { alpha: gc * gin(T.cv2) });
      const vals = [1, 1 / 3, 1 / 9, 1 / 27, 1 / 81];
      vals.forEach((v, k) => { const g2 = gc * gin(T.cv3 + k * 0.3), h = 200 * v, x = DX + 60 + k * 70, y0 = DY + 120; ctx.save(); ctx.globalAlpha = g2 * 0.85; ctx.fillStyle = C.free; ctx.fillRect(x - 22, y0 - h, 44, h); ctx.restore(); ctag(String(k), x, y0 + 24, { px: 22, a: g2, color: C.inkMid }); });
      ctag('偏离分量 × ⅓', DX + 200, DY + 180, { px: 28, a: gc * gin(T.cv3), color: C.free });
      ctag('λ₂ ≈ λ₁ → 很慢；一次只有一个', DX + 200, DY + 250, { px: 26, a: a * gin(T.sl), color: C.ds });
    }
  }

  // ── C：QR 算法 ──
  const AK = [[2, 1, 1], [2.8, -0.6, 1.2], [2.97561, 0.21951, 1.02439], [2.99726, -0.07397, 1.00274], [2.9997, 0.02469, 1.0003], [2.99997, -0.00823, 1.00003]];
  function shotC() {
    const a = B.win(T.qa - 0.2, T.hs - 0.3); if (a <= 0) return;
    ctag('QR 算法（弗朗西斯，1961）', DX, DY - 390, { px: 34, a: a * gin(T.qa), color: C.peri, font: F.serif });
    ctag('二十世纪十大算法之一', DX, DY - 335, { px: 26, a: a * gin(T.qa2) * (1 - gin(T.qs - 0.2)), color: C.i });
    B.card(DX, DY - 320, 520, 80, a * gin(T.qs), C.peri); texAt('qr', DX, DY - 320, 36, { alpha: a * gin(T.qs) });
    texAt('sim', DX, DY - 220, 30, { alpha: a * gin(T.sm) * (1 - gin(T.e2 - 0.2)) });
    ctag('正交相似：特征值不变，误差不放大', DX, DY - 150, { px: 26, a: a * gin(T.sm2) * (1 - gin(T.e2 - 0.2)), color: OK });
    const ge = a * gin(T.e2); if (ge <= 0) return;
    const t = B.t, k = t < T.e2b ? 1 : t < T.cn + 0.4 ? 2 : Math.min(5, 3 + Math.floor((t - T.cn - 0.4) / 0.7));
    const [d1, o, d2] = AK[k], fmt = v => (Math.abs(v) >= 0.1 ? v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '') : v.toFixed(3));
    ctag(`A${['', '₁', '₂', '₃', '₄', '₅', '₆'][k + 1]}`, DX - 260, DY - 70, { px: 40, a: ge, color: C.ink, font: F.serif });
    const fo = Math.min(1, Math.abs(o) / 0.6);
    B.mat(DX - 60, DY - 70, [[fmt(d1), fmt(o)], [fmt(o), fmt(d2)]], ge, { cw: 150, ch: 70, px: 34, col: (i, j) => (i === j ? C.peri : C.free), fade: (i, j) => (i === j ? 1 : 0.25 + 0.75 * fo), cell: (i, j) => (i === j ? { bg: C.peri, a: 0.15 } : null) });
    // 非对角元的柱子
    const offs = [0.6, 0.21951, 0.07397, 0.02469, 0.00823], y0 = DY + 220;
    offs.forEach((v, i) => { const g = ge * (i + 1 <= k ? 1 : 0), h = 220 * v / 0.6, x = DX + 180 + i * 56; if (g <= 0) return; ctx.save(); ctx.globalAlpha = g * 0.85; ctx.fillStyle = C.free; ctx.fillRect(x - 18, y0 - h, 36, Math.max(2, h)); ctx.restore(); ctag(['0.6', '0.22', '0.074', '0.025', '0.008'][i], x, y0 + 24, { px: 18, a: g, color: C.inkMid }); });
    ctag('|非对角元|', DX + 290, DY - 30, { px: 24, a: ge * gin(T.cn), color: C.free });
    ctag('对角线 → 3 和 1', DX - 60, DY + 70, { px: 30, a: ge * gin(T.cn2), color: C.peri, font: F.serif });
    ctag('对称 → 对角阵；一般 → 实舒尔形', DX - 60, DY + 140, { px: 26, a: ge * gin(T.cn3), color: C.inkMid });
  }

  // ── D：海森伯格 + 平移 ──
  function shotD() {
    const a = B.win(T.hs - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('实用两招', DX, DY - 390, { px: 34, a: a * gin(T.hs), color: C.peri, font: F.serif });
    const n = 6, sym = B.t > T.hs2;
    const pat = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i > j + 1 ? '' : (sym && j > i + 1) ? '' : '×')));
    B.mat(DX - 140, DY - 120, pat, a * gin(T.hs), { cw: 56, ch: 50, px: 24, col: (i, j) => (i === j + 1 ? C.i : C.ink) });
    ctag(sym ? '对称：三对角形' : '① 上海森伯格形', DX - 140, DY + 70, { px: 30, a: a * gin(T.hs), color: C.i });
    ctag('每步 n − 1 次吉文斯', DX - 140, DY + 130, { px: 26, a: a * gin(T.hs2 + 0.6), color: C.inkMid });
    B.card(DX + 270, DY - 120, 260, 120, a * gin(T.hs3), OK); ctag('② 原点平移', DX + 270, DY - 140, { px: 30, a: a * gin(T.hs3), color: OK }); ctag('收敛快得多', DX + 270, DY - 95, { px: 24, a: a * gin(T.hs3), color: C.ink });
  }

  // ── E：同济 + 小结 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章：相似矩阵特征值相同', DX, DY - 300, { px: 32, a: g1, color: C.gpt, font: F.serif });
    ctag('A₁ ∼ A₂ ∼ A₃ ∼ … → 三角形', DX, DY - 200, { px: 38, a: g1 * gin(cue('G01', '造出一串相似矩阵')), color: C.ink, font: F.serif });
    ctag('特征值直接写在对角线上', DX, DY - 110, { px: 32, a: g1 * gin(T.tj2), color: C.peri });
    ctag('软件求特征值 = 一连串 QR', DX, DY - 10, { px: 30, a: g1 * gin(T.d3), color: C.ds });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['别解特征多项式', C.free, T.sum], ['对称：特征值很稳', OK, cue('C16', '对称矩阵的特征值')], ['幂法：最大的一个', C.i, cue('C16', '幂法')], ['QR 算法：全部', C.peri, cue('C16', 'Q R算法')]].forEach(([s, c, t0], i) => ctag(s, DX, DY - 260 + i * 80, { px: 38, a: g2 * gin(t0), color: c, font: F.serif }));
    const g3 = a * gin(T.end - 0.2);
    ctag('最后一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('最小二乘', DX, DY - 20, { px: 90, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('正规方程的坑', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.th - 0.2, t1: T.d1 - 0.3, head: '扰动', items: [['|Δλ| ≤ cond₂(X)‖E‖₂', T.th3, { color: C.peri }], ['对称：很稳', T.sy2, { color: OK }], ['非对称：可放大很多', T.ns2, { color: C.free }]] },
    { t0: T.d1 - 0.2, t1: T.qa - 0.3, head: '幂法', items: [['反复乘 A，再缩放', T.sc], ['例 1：λ ≈ 2.98', T.e1e, { color: OK }], ['收敛比 |λ₂/λ₁|', T.cv2, { color: C.free }], ['一次只一个', T.sl2]] },
    { t0: T.qa - 0.2, t1: T.sum - 0.3, head: 'QR 算法', items: [['A = QR → RQ', T.qs2, { color: C.peri }], ['正交相似', T.sm2, { color: OK }], ['非对角元 → 0', T.cn], ['海森伯格 + 平移', T.hs3, { color: C.i }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['QR 算法求全部特征值', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotA(); shotB(); shotC(); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
