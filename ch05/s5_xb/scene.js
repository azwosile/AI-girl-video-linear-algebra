// 第 5 章 复习（下）计算题 + 同济题型 + 小结 + 第六章预告（Leon 9th Chapter 5 Test B 4、6、10）。
// 分镜：开场 → TB4 四子空间维数（左右两块 ℝ⁵ / ℝ⁷）→ TB6：3D 平面 S + 法线 S⊥ + 投影矩阵 → TB10：q₃ 与 R 第三列、回代
//       → 同济题型一（零空间 + 施密特，3D 平面里两根不垂直的基础解系被掰正）→ 题型二（正交矩阵判定，逐列验）
//       → 易错两处 → 整章总结“垂直就是最近” → 第六章预告（diag(0, 1, 4)、Ax = λx 方向不变）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain', 'gpt_point', 'gpt_cross'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 复习', title: '计算题与总结', hi: 3, en: 'CHAPTER TEST B',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.6, C07: 0.8, C11: 0.8, G01: 0.8, G04: 0.6, C14: 0.6, C15: 0.8, G05: 0.8 },
    post: { C03: 0.8, C04: 0.8, C05: 1.2, C08: 1.0, C09: 0.8, C10: 1.4, C12: 1.4, C13: 1.6, G02: 1.0, G03: 1.4, G04: 1.2, C14: 0.8, C15: 1.2, C16: 0.8, C17: 0.8, G05: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, q1: L('C02').s, q1a: L('C03').s, q1a2: cue('C03', '它的正交补'), q1b: L('C04').s, q1c: L('C05').s, q1c2: cue('C05', '所以最小二乘'), d1: L('D01').s, c6: L('C06').s,
    q2: L('C07').s, q2n: L('C08').s, q2n2: cue('C08', '得到'), q2x: cue('C08', '也可以'), q2g: L('C09').s, q2p: L('C10').s, q2u: cue('C10', '这就是'),
    q3: L('C11').s, q3r: L('C12').s, q3q: cue('C12', 'q三是'), q3R: L('C13').s, q3x: cue('C13', 'Q转置b'), q3b: cue('C13', '回代'), d2: L('D02').s,
    tj: L('G01').s, tj2: L('G02').s, tj2b: cue('G02', '基础解系'), tj2c: cue('G02', '可是'), tj3: L('G03').s, tj3b: cue('G03', 'a三等于'), tj4: L('G04').s, tj4b: cue('G04', '或者逐列'), tj4c: cue('G04', '比如画面上'), tj4d: cue('G04', '行列式'),
    d3: L('D03').s, err: L('C14').s, err2: cue('C14', '二是'), rec: L('C15').s, r1: L('C16').s, r2: cue('C16', '投影的垂足'), r3: cue('C16', '把b投影'), r4: cue('C16', '四个子空间'), r5: L('C17').s, r6: cue('C17', '施密特'),
    d4: L('D04').s, nx: L('G05').s, nx2: cue('G05', '那组神奇'), eig: L('C18').s, eig2: cue('C18', 'A x等于'), end: cue('C18', '我们下一章见'),
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', T.q1, 0.3); TL.sfx('pop', T.q1a, 0.3); TL.sfx('pop', T.q1b, 0.3); TL.sfx('pop', T.q1c, 0.3); TL.sfx('ding_hi', T.q1c2, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('whoosh', T.q2, 0.3); TL.sfx('pop', T.q2n2, 0.3); TL.sfx('pop', T.q2g, 0.3); TL.sfx('ding_hi', T.q2p + 1.5, 0.3);
  TL.sfx('whoosh', T.q3, 0.3); TL.sfx('pop', T.q3r, 0.3); TL.sfx('pop', T.q3q, 0.3); TL.sfx('pop', T.q3R, 0.3); TL.sfx('marimba', T.q3b + 0.5, 0.3); TL.sfx('ding_hi', T.q3b + 2.5, 0.32); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2b, 0.3); TL.sfx('buzz', T.tj2c, 0.3); TL.sfx('warp', T.tj3b, 0.35); TL.sfx('pop', T.tj4, 0.3); TL.sfx('check', T.tj4c + 1.0, 0.3);
  TL.sfx('pluck', T.d3, 0.3); TL.sfx('pop', T.err, 0.3); TL.sfx('pop', T.err2, 0.3); TL.sfx('sting', T.rec, 0.3); [T.r1, T.r2, T.r3, T.r4, T.r5, T.r6].forEach(x => TL.sfx('pop', x, 0.28)); TL.sfx('shimmer', T.d4, 0.4);
  TL.sfx('bell_soft', T.nx, 0.3); TL.sfx('warp', T.eig2, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  const card = (k, x, y, w, h, a, col, px = 40, opt = {}) => { if (a <= 0) return; B.card(x, y, w, h, a, col); texAt(k, x, y, px, { alpha: a, ...opt }); };
  let P3 = null;

  function shotIntro() {
    const a = B.win(T.o1 + 0.2, T.q1 - 0.3); if (a <= 0) return;
    const it = [['Test B', '第 4、6、10 题', C.peri], ['同济题型', '求正交向量 · 判正交矩阵', C.gpt], ['整章收尾', '+ 第六章预告', OK]];
    it.forEach(([h, b, col], i) => { const y = DY - 160 + i * 130, g = a * gin(T.o1 + 0.4 + i * 0.8); B.card(DX, y, 640, 104, g, col); ctag(h, DX - 180, y, { px: 34, a: g, color: col, font: F.serif }); ctag(b, DX + 90, y, { px: 28, a: g, color: C.ink }); });
  }

  // ── TB4 ──
  function shotQ1() {
    const a = B.win(T.q1 - 0.2, T.q2 - 0.3); if (a <= 0) return;
    ctag('Test B 第 4 题', DX, DY - 390, { px: 30, a, color: C.peri }); texAt('tb4', DX, DY - 330, 38, { alpha: a * gin(T.q1 + 0.3) });
    const blk = (x, y, w, h, col, t, sub, g) => { if (g <= 0) return; B.card(x, y, w, h, g, col); ctag(t, x, y - 12, { px: 30, a: g, color: col, font: F.serif }); ctag(sub, x, y + 24, { px: 24, a: g, color: C.inkMid }); };
    const gb = a * gin(cue('C02', '四个基本子空间'));
    ctag('ℝ⁵', DX - 250, DY - 240, { px: 34, a: gb, color: C.ink, font: F.serif }); ctag('ℝ⁷', DX + 250, DY - 240, { px: 34, a: gb, color: C.ink, font: F.serif });
    blk(DX - 250, DY - 160, 300, 100, C.i, 'R(Aᵀ)', 'dim 4', gb); blk(DX - 250, DY - 50, 300, 90, C.peri, 'N(A)', `dim ${B.t > T.q1c ? '1' : '?'}`, gb);
    blk(DX + 250, DY - 160, 300, 100, C.j, 'R(A)', 'dim 4', gb); blk(DX + 250, DY - 50, 300, 90, C.free, 'N(Aᵀ)', `dim ${B.t > T.q1a ? '3' : '?'}`, gb);
    texAt('tb4a', DX, DY + 80, 32, { alpha: a * gin(T.q1a) });
    texAt('tb4b', DX, DY + 160, 32, { alpha: a * gin(T.q1b) });
    card('tb4c', DX, DY + 250, 620, 80, a * gin(T.q1c), C.peri, 32);
    ctag('最小二乘：无穷多解（相差 N(A) 中的向量）', DX, DY + 330, { px: 28, a: a * gin(T.q1c2), color: C.ink });
    ctag('投影 p 仍唯一 ✓（判断题第 6 题）', DX, DY + 380, { px: 26, a: a * gin(T.c6), color: OK });
  }

  // ── TB6（3D）──
  function shotQ2(D) {
    const a = B.win(T.q2 - 0.2, T.q3 - 0.3); if (a <= 0 || !P3) return;
    const n = [-2, 2, 1], x1 = [1, 0, 2], x2 = [0, 1, -2];
    P3.reset(); P3.setPlane(0, n, { color: C.j, alpha: 0.3, scale: gin(T.q2 + 0.5, 0.8) }); P3.setLine(0, n, { color: C.peri, grow: gin(T.q2n2, 0.8), width: 8 });
    const V = B.show3D(P3, D, a, { el: 20, az: -30 + 10 * Math.sin(B.t * 0.18), dist: 13, axesA: 0.45, floorA: 0.15 });
    const gx = a * gin(T.q2 + 0.8); V.v3([0, 0, 0], x1.map(v => v * 0.8), { color: C.i, alpha: gx }); V.v3([0, 0, 0], x2.map(v => v * 0.8), { color: C.i, alpha: gx });
    V.lab(x1.map(v => v * 0.95), 'x₁', { px: 28, a: gx, color: C.i, font: F.serif }); V.lab(x2.map(v => v * 0.95), 'x₂', { px: 28, a: gx, color: C.i, font: F.serif });
    V.lab([1.2, 1.2, 0.2], 'S', { px: 34, a: a * gin(T.q2g), color: C.j, font: F.serif }); V.lab(n.map(v => v / 3 * 3.4), 'S⊥', { px: 32, a: a * gin(T.q2n2), color: C.peri, font: F.serif });
    texAt('tb6', DX, DY - 380, 30, { alpha: a * gin(T.q2 + 0.3) * (1 - gin(T.q2p - 0.2)) });
    texAt('tb6n', DX, DY + 340, 30, { alpha: a * gin(T.q2n2) * (1 - gin(T.q2p - 0.2)) });
    ctag('= x₁ × x₂', DX + 300, DY + 280, { px: 26, a: a * gin(T.q2x) * (1 - gin(T.q2p - 0.2)), color: C.inkMid });
    ctag('S：过原点的平面；S⊥：它的法线', DX, DY - 300, { px: 28, a: a * gin(T.q2g) * (1 - gin(T.q2p - 0.2)), color: OK });
    const gp = a * gin(T.q2p); card('tb6p', DX, DY - 330, 640, 150, gp, C.peri, 30);
    ctag('= UUᵀ，u = n/3', DX, DY - 220, { px: 28, a: a * gin(T.q2u), color: OK });
  }

  // ── TB10 ──
  function shotQ3() {
    const a = B.win(T.q3 - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('Test B 第 10 题', DX, DY - 390, { px: 30, a, color: C.peri });
    texAt('tb10', DX, DY - 290, 30, { alpha: a * gin(T.q3 + 0.3) });
    texAt('tb10q', DX, DY - 160, 28, { alpha: a * gin(cue('C11', '已经算出')) });
    texAt('tb10r', DX, DY - 70, 28, { alpha: a * gin(T.q3r), reveal: rv(T.q3r, 3.0) });
    texAt('tb10q3', DX, DY + 50, 30, { alpha: a * gin(T.q3q) });
    // R 第三列高亮
    const gR = a * gin(T.q3R) * (1 - gin(T.q3x)); if (gR > 0) ctag('R 第三列：(−1, 3, 6)ᵀ', DX + 260, DY + 140, { px: 28, a: gR, color: C.peri, font: F.serif });
    const gx = a * gin(T.q3x); card('tb10x', DX, DY + 200, 680, 90, gx, OK, 30);
    ['x₃ = 6/6 = 1', 'x₂ = (6 − 3)/4 = 3/4', 'x₁ = (1 + 3/2 + 1)/2 = 7/4'].forEach((s, i) => ctag(s, DX - 260 + i * 260, DY + 290, { px: 24, a: a * gin(T.q3b + 0.5 + i * 1.0), color: [C.k, C.j, C.i][i], font: F.serif }));
    ctag('乘 Qᵀ，再回代！', DX, DY + 360, { px: 32, a: a * gin(T.d2), color: C.ds, font: F.serif });
  }

  // ── 同济题型 ──
  function shotTJ(D) {
    const a = B.win(T.tj - 0.2, T.d3 - 0.3); if (a <= 0 || !P3) return;
    const ga = a * (1 - gin(T.tj4 - 0.2));
    if (ga > 0) {
      ctag('同济题型一  求两两正交的向量', DX, DY - 390, { px: 30, a: ga, color: C.gpt, font: F.serif });
      const n = [1, 1, 1], s = smoother(prog(B.t, T.tj3b, T.tj3b + 1.6));
      P3.reset(); P3.setPlane(0, n, { color: C.j, alpha: 0.28, scale: gin(T.tj2, 0.8) });
      const V = B.show3D(P3, D, ga, { el: 22, az: -40 + 8 * Math.sin(B.t * 0.18), dist: 12, axesA: 0.4, floorA: 0.15 });
      V.v3([0, 0, 0], [1.2, 1.2, 1.2], { color: C.peri, alpha: ga }); V.lab([1.45, 1.45, 1.45], 'a₁', { px: 28, a: ga, color: C.peri, font: F.serif });
      const k = 1.5, xi1 = [1, 0, -1].map(v => v * k), xi2 = [0, 1, -1].map(v => v * k), a3 = [-0.5, 1, -0.5].map(v => v * k), cur = xi2.map((v, i) => lerp(v, a3[i], s));
      const gb = ga * gin(T.tj2b); V.v3([0, 0, 0], xi1, { color: C.i, alpha: gb }); V.v3([0, 0, 0], cur, { color: s > 0.5 ? C.k : C.i, alpha: gb });
      V.lab(xi1.map(v => v * 1.15), s > 0.5 ? 'a₂ = ξ₁' : 'ξ₁', { px: 26, a: gb, color: C.i, font: F.serif }); V.lab(cur.map(v => v * 1.18), s > 0.5 ? 'a₃' : 'ξ₂', { px: 26, a: gb, color: s > 0.5 ? C.k : C.i, font: F.serif });
      if (s > 0) B.line2(V.pr(xi2), V.pr(a3), C.inkMid, ga * (1 - s * 0.5), 3, [8, 6]);
      if (s > 0.9) { const O = V.pr([0, 0, 0]), A1 = V.pr(xi1.map(v => v * 0.2)), A2 = V.pr(a3.map(v => v * 0.2)); B.rightMark(O, [A1[0] - O[0], A1[1] - O[1]], [A2[0] - O[0], A2[1] - O[1]], ga * smooth((s - 0.9) * 10), { color: OK }); }
      texAt('tj1', DX, DY - 320, 30, { alpha: ga * gin(T.tj + 0.4) });
      texAt('tj1b', DX, DY + 300, 28, { alpha: ga * gin(T.tj2b) * (1 - gin(T.tj3b - 0.2)) });
      ctag('基础解系不一定正交！', DX + 280, DY + 220, { px: 28, a: ga * gin(T.tj2c) * (1 - gin(T.tj3b - 0.2)), color: C.free });
      card('tj1c', DX, DY + 300, 640, 150, ga * gin(T.tj3b), C.gpt, 30);
      ctag('= 零空间 + 施密特', DX + 280, DY + 220, { px: 28, a: ga * gin(cue('G03', '这就是')), color: OK });
    }
    const gb = a * gin(T.tj4); if (gb > 0) {
      ctag('同济题型二  判断正交矩阵', DX, DY - 390, { px: 30, a: gb, color: C.gpt, font: F.serif });
      ctag('AᵀA = I ？  或逐列：长度 1、两两内积 0', DX, DY - 290, { px: 30, a: gb * gin(T.tj4b), color: C.ink });
      card('tj2', DX, DY - 120, 700, 190, gb * gin(T.tj4c), C.gpt, 34);
      const M = [[1, -8, -4], [-8, 1, -4], [-4, -4, 7]];
      ['‖列 1‖² = (1 + 64 + 16)/81 = 1', '列 1 · 列 2 = (−8 − 8 + 16)/81 = 0', '……'].forEach((s, i) => ctag(s, DX, DY + 50 + i * 54, { px: 28, a: gb * gin(T.tj4c + 1.0 + i * 0.8), color: i < 2 ? OK : C.inkMid, font: F.serif }));
      ctag('det ≠ ±1 → 直接排除', DX, DY + 250, { px: 30, a: gb * gin(T.tj4d), color: C.free });
      void M;
    }
  }

  // ── 易错 + 总结 ──
  function shotRec() {
    const a = B.win(T.d3 - 0.2, T.nx - 0.3); if (a <= 0) return;
    const ge = a * (1 - gin(T.rec - 0.2));
    if (ge > 0) {
      ctag('最容易丢分', DX, DY - 300, { px: 40, a: ge * gin(T.d3), color: C.ds, font: F.serif });
      B.card(DX, DY - 160, 720, 100, ge * gin(T.err), C.free); ctag('① 施密特算错 → 每步顺手验正交', DX, DY - 160, { px: 32, a: ge * gin(T.err), color: C.ink });
      B.card(DX, DY - 30, 720, 100, ge * gin(T.err2), C.free); ctag('② 正规方程排错 → 先写清每一行对应谁', DX, DY - 30, { px: 32, a: ge * gin(T.err2), color: C.ink });
    }
    const g = a * gin(T.rec); if (g <= 0) return;
    ctag('垂直 = 最近', DX, DY - 330, { px: 72, a: g, color: C.peri, font: F.serif });
    const it = [['点积', '长度与角度', T.r1, C.i], ['投影', '垂足 = 最近点', T.r2, C.peri], ['最小二乘', 'b 投到列空间', T.r3, C.j], ['四个子空间', '残差在 N(Aᵀ)', T.r4, C.free], ['标准正交基', '投影 = 内积', T.r5, C.k], ['施密特', 'A = QR', T.r6, OK]];
    const up = a * (1 - 0.6 * gin(T.d4));
    it.forEach(([h, b, t0, col], i) => { const x = DX + (i % 2 ? 200 : -200), y = DY - 200 + Math.floor(i / 2) * 110, gg = up * gin(t0); B.card(x, y, 380, 90, gg, col); ctag(h, x - 90, y, { px: 30, a: gg, color: col, font: F.serif }); ctag(b, x + 70, y, { px: 24, a: gg, color: C.ink }); });
    ctag('第五章，懂了！', DX, DY + 210, { px: 44, a: a * gin(T.d4), color: C.ds, font: F.serif });
  }

  // ── 第六章预告 ──
  const PE = new Plane({ ox: DX, oy: DY + 120, u: 70, R: 7 });
  function shotNext(D) {
    const a = B.win(T.nx - 0.1, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.eig - 0.2));
    if (g1 > 0) { ctag('第四章 例 2：换一组基', DX, DY - 300, { px: 32, a: g1, color: C.inkMid }); card('diag', DX, DY - 120, 300, 200, g1 * gin(cue('G05', '矩阵就变成')), C.peri, 48); ctag('那组神奇的基，怎么找？', DX, DY + 80, { px: 36, a: g1 * gin(T.nx2), color: C.ds, font: F.serif }); }
    const g2 = a * gin(T.eig); if (g2 <= 0) return;
    const M = [[2, 1], [1, 2]], s = smoother(prog(B.t, T.eig2, T.eig2 + 1.8)) * (1 - smoother(prog(B.t, T.eig2 + 3.5, T.eig2 + 5.0)));
    const Ms = [[lerp(1, M[0][0], s), lerp(0, M[0][1], s)], [lerp(0, M[1][0], s), lerp(1, M[1][1], s)]];
    B.warp(PE, M, s, g2, D, { basis: false, clipY: DY - 200 });
    const mv = v => [Ms[0][0] * v[0] + Ms[0][1] * v[1], Ms[1][0] * v[0] + Ms[1][1] * v[1]];
    ctx.save(); B.K.clip(D); ctx.beginPath(); ctx.rect(0, DY - 200, 1920, 1080); ctx.clip(); B.line2(PE.S([-6, -6]), PE.S([6, 6]), C.j, g2 * 0.5, 2, [8, 8]); B.line2(PE.S([-6, 6]), PE.S([6, -6]), C.k, g2 * 0.5, 2, [8, 8]); ctx.restore();
    arrow(ctx, PE.S([0, 0]), PE.S(mv([1, 1])), { color: C.j, width: 8, head: 22, alpha: g2 }); arrow(ctx, PE.S([0, 0]), PE.S(mv([1, -1])), { color: C.k, width: 8, head: 22, alpha: g2 });
    arrow(ctx, PE.S([0, 0]), PE.S(mv([1, 0.2])), { color: C.inkMid, width: 5, head: 18, alpha: g2 * 0.8 });
    ctag('第六章  特征值与特征向量', DX, DY - 360, { px: 44, a: g2, color: C.peri, font: F.serif });
    card('eig', DX, DY - 270, 300, 80, g2 * gin(T.eig2), OK, 44);
    ctag('留在自己方向上的向量', DX + 260, DY + 330, { px: 28, a: g2 * gin(T.eig2 + 1.5), color: C.j });
    ctag('下一章见！', DX, DY + 380, { px: 36, a: a * gin(T.end), color: C.ds, font: F.serif });
  }

  const SECS = [
    { t0: T.q1 - 0.3, t1: T.tj - 0.3, head: 'Test B 计算题', items: [['TB4：维数 3、1', T.q1, { color: C.free, mark: C.free }], ['TB6：S⊥ 与投影矩阵', T.q2, { color: C.j, mark: C.j }], ['TB10：补完 QR', T.q3, { color: C.peri, mark: C.peri }], ['x̂ = (7/4, 3/4, 1)', T.q3x, { color: OK, mark: OK }]] },
    { t0: T.tj - 0.3, t1: T.rec - 0.3, head: '同济题型', items: [['零空间 + 施密特', T.tj, { color: C.gpt, mark: C.gpt }], ['判正交矩阵', T.tj4, { color: C.gpt, mark: C.gpt }], ['易错两处', T.err, { color: C.free, mark: C.free }]] },
    { t0: T.rec - 0.3, t1: T.nx - 0.3, head: '整章总结', items: [['垂直 = 最近', T.rec, { color: C.peri, mark: C.peri }], ['点积 → 投影 → 最小二乘', T.r1], ['正交基 → QR', T.r5, { color: OK, mark: OK }]] },
  ];

  const P3c = await load3D(); P3 = new P3c(900, { R: 3 });
  function draw(t) {
    B.frame(t, D => { shotIntro(); shotQ1(); shotQ2(D); shotQ3(); shotTJ(D); shotRec(); shotNext(D); B.left(SECS); });
  }
  return { TL, draw };
}
