// 第 5 章 5.1（上）点积：长度、夹角、正交（Leon 9th §5.1）。
// 分镜：开篇（长度？角度？）→ 点积定义 + 例 1 分量相乘条 → 长度 = 勾股、距离例 2 → 定理 5.1.1 三角形 + 余弦定理展开 → 例 3 θ = π/4
//       → 3B1B：x 绕原点转一圈，影子 + 点积计量条变号 → 柯西–施瓦茨 → 正交定义 + 例 4 → ℝⁿ、勾股定律正方形 → 余弦相似度 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.1 点积与正交', hi: 3, en: 'THE SCALAR PRODUCT',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C06: 0.6, C09: 0.5, C10: 0.5, C11: 0.6, C13: 0.6, C16: 0.6, G01: 0.6, C17: 0.6 },
    post: { C01: 0.6, C03: 1.0, C05: 1.0, C07: 0.8, C08: 1.0, C09: 3.0, C10: 0.6, C12: 1.0, C14: 1.0, C16: 0.8, G02: 0.6, C17: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, o1b: cue('C01', '把几何'), dot: L('C02').s, dot2: cue('C02', '对应分量'), e1: L('C03').s, e1c: cue('C03', '等于三乘四'), d1: L('D01').s,
    len: L('C04').s, len2: cue('C04', '勾股定理'), dist: cue('C04', '距离'), e2: L('C05').s, e2c: cue('C05', '距离等于'),
    thm: L('C06').s, pf: L('C07').s, pf2: cue('C07', '展开'), pf3: cue('C07', '交叉项'), e3: L('C08').s, e3c: cue('C08', '余弦等于'), d2: L('D02').s,
    sh: L('C09').s, sh2: cue('C09', '影子的长度'), sh3: cue('C09', '同向为正'), cs: L('C10').s, cs2: cue('C10', '等号成立'),
    orth: L('C11').s, orth0: cue('C11', '零向量'), e4: L('C12').s, e4b: cue('C12', '二、负三、一'),
    rn: L('C13').s, py: L('C14').s, py2: cue('C14', '如果x垂直于y'), d3: L('D03').s, py3: L('C15').s,
    ir: L('C16').s, ir2: cue('C16', '词频向量'), tj: L('G01').s, tj2: L('G02').s, tj2b: cue('G02', '单位向量'), sum: L('C17').s, end: L('C18').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('shimmer', T.o1b, 0.3); TL.sfx('pop', T.dot2, 0.3); TL.sfx('pop', T.e1, 0.3); TL.sfx('ding_hi', T.e1c + 2.2, 0.32); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('whoosh', T.len, 0.3); TL.sfx('pop', T.len2, 0.3); TL.sfx('pop', T.e2, 0.3); TL.sfx('ding_hi', T.e2c + 0.6, 0.3);
  TL.sfx('shimmer', T.thm, 0.35); TL.sfx('pop', T.pf, 0.3); TL.sfx('pop', T.pf3, 0.3); TL.sfx('pop', T.e3, 0.3); TL.sfx('ding_hi', T.e3c + 1.5, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('whoosh', T.sh, 0.3); TL.sfx('warp', T.sh3, 0.35); TL.sfx('shimmer', T.cs, 0.3); TL.sfx('pop', T.orth, 0.3); TL.sfx('check', T.e4 + 2.2, 0.3); TL.sfx('check', T.e4b + 1.8, 0.3);
  TL.sfx('whoosh', T.rn, 0.3); TL.sfx('pop', T.py, 0.3); TL.sfx('ding_hi', T.py2 + 0.8, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('pop', T.ir, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2b, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  const P = new Plane({ ox: DX - 80, oy: DY + 170, u: 58, R: 9 });
  const vec = (v, col, a, label, { w = 8, from = [0, 0], lx = 30, ly = -18, px = 30 } = {}) => { if (a <= 0) return; const O = P.S(from), E = P.S([from[0] + v[0], from[1] + v[1]]); arrow(ctx, O, E, { color: col, width: w, head: 22, alpha: a }); if (label) ctag(label, E[0] + lx, E[1] + ly, { px, a, color: col, font: F.serif }); };

  // ── A：开篇 + 定义 + 例 1 ──
  function shotA() {
    const a = B.win(T.o1 + 0.2, T.len - 0.3); if (a <= 0) return;
    const ga = a * (1 - gin(T.dot - 0.2));
    ctag('前四章：加法、数乘', DX, DY - 120, { px: 40, a: ga * gin(T.o1 + 0.4), color: C.inkMid });
    ctag('长度？  角度？', DX, DY - 10, { px: 64, a: ga * gin(T.o1 + 2.0), color: C.peri, font: F.serif });
    ctag('第五章：把几何请回来', DX, DY + 100, { px: 36, a: ga * gin(T.o1b), color: OK });
    const gd = a * gin(T.dot); if (gd <= 0) return;
    ctag('标量积（点积）', DX, DY - 380, { px: 34, a: gd, color: C.peri, font: F.serif });
    B.card(DX, DY - 290, 760, 100, gd * gin(T.dot2), C.peri); texAt('dotdef', DX, DY - 290, 40, { alpha: gd * gin(T.dot2) });
    const g1 = a * gin(T.e1); if (g1 <= 0) return;
    texAt('e1', DX, DY - 120, 38, { alpha: g1 });
    // 分量相乘条
    const xs = [3, -2, 1], ys = [4, 3, 2], pr = [12, -6, 2], cols = [C.i, C.j, C.k];
    const s = smoother(prog(B.t, T.e1c, T.e1c + 2.0));
    pr.forEach((v, i) => {
      const gi = g1 * gin(T.e1c + i * 0.5); if (gi <= 0) return;
      const y0 = DY + 40 + i * 62, w = v * 18;
      ctag(`${xs[i] < 0 ? '−' + -xs[i] : xs[i]} × ${ys[i]}`, DX - 300, y0, { px: 30, a: gi, color: cols[i], font: F.serif });
      const x0 = lerp(DX - 140, DX - 140 + pr.slice(0, i).reduce((p, q) => p + q, 0) * 18, s), yy = lerp(y0, DY + 240, s);
      ctx.save(); ctx.globalAlpha = gi * 0.8; ctx.fillStyle = v >= 0 ? cols[i] : C.free; ctx.fillRect(Math.min(x0, x0 + w), yy - 18, Math.abs(w), 36); ctx.restore();
      ctag(String(v).replace('-', '−'), x0 + w + (v >= 0 ? 34 : -34), yy, { px: 28, a: gi * (1 - s), color: C.ink });
    });
    B.line2([DX - 140, DY + 210], [DX - 140, DY + 270], C.ink, g1 * s, 3);
    texAt('e1c', DX + 120, DY + 300, 36, { alpha: g1 * gin(T.e1c + 2.2) });
    ctag('= 8 ?', DX + 330, DY + 240, { px: 40, a: a * gin(T.d1), color: C.ds, font: F.serif });
  }

  // ── B：长度、距离 ──
  function shotB(D) {
    const a = B.win(T.len - 0.2, T.thm - 0.3); if (a <= 0) return;
    B.grid(P, I2, a, D, { old: 0.12, neu: 0.3, basis: false });
    const X = [3, 4], Y = [-1, 7];
    vec(X, C.i, a * gin(T.len), 'x = (3, 4)');
    const gt = a * gin(T.len2) * (1 - gin(T.e2));
    if (gt > 0) { B.line2(P.S([0, 0]), P.S([3, 0]), C.j, gt, 5); B.line2(P.S([3, 0]), P.S([3, 4]), C.k, gt, 5); B.rightMark(P.S([3, 0]), [-1, 0], [0, -1], gt);
      ctag('3', ...P.S([1.5, -0.5]), { px: 30, a: gt, color: C.j }); ctag('4', ...P.S([3.5, 2]), { px: 30, a: gt, color: C.k }); ctag('‖x‖ = 5', ...P.S([0.6, 2.8]), { px: 30, a: gt, color: C.i, font: F.serif }); }
    texAt('len', DX, DY - 380, 38, { alpha: a * gin(T.len + 0.3) });
    texAt('dist', DX + 230, DY - 300, 34, { alpha: a * gin(T.dist) });
    const g2 = a * gin(T.e2); vec(Y, C.j, g2, 'y = (−1, 7)', { lx: -40 });
    if (g2 > 0) { arrow(ctx, P.S(X), P.S(Y), { color: C.peri, width: 6, head: 20, alpha: g2 * gin(T.e2 + 1.0), grow: gin(T.e2 + 1.0, 0.8) }); ctag('y − x', ...P.S([1.9, 6.0]), { px: 30, a: g2 * gin(T.e2 + 1.4), color: C.peri, font: F.serif }); }
    const g3 = a * gin(T.e2c); B.card(DX + 210, DY + 250, 500, 90, g3, C.peri); texAt('e2', DX + 210, DY + 250, 36, { alpha: g3 });
  }

  // ── C：定理 5.1.1 + 证明 + 例 3 ──
  const P2 = new Plane({ ox: DX - 250, oy: DY + 230, u: 52, R: 8 });
  function shotC(D) {
    const a = B.win(T.thm - 0.2, T.sh - 0.3); if (a <= 0) return;
    ctag('定理 5.1.1', DX, DY - 390, { px: 30, a, color: C.peri, font: F.serif });
    B.card(DX, DY - 315, 520, 96, a * gin(T.thm + 0.3), C.peri); texAt('thm', DX, DY - 315, 44, { alpha: a * gin(T.thm + 0.3) });
    // 三角形
    const X = [3, 4], Y = [-1, 7], O = P2.S([0, 0]), Xp = P2.S(X), Yp = P2.S(Y), gt = a * gin(T.thm + 0.8);
    arrow(ctx, O, Xp, { color: C.i, width: 7, head: 20, alpha: gt }); arrow(ctx, O, Yp, { color: C.j, width: 7, head: 20, alpha: gt });
    arrow(ctx, Xp, Yp, { color: C.peri, width: 6, head: 20, alpha: a * gin(T.pf) });
    ctag('x', Xp[0] + 22, Xp[1] + 10, { px: 30, a: gt, color: C.i, font: F.serif }); ctag('y', Yp[0] - 24, Yp[1], { px: 30, a: gt, color: C.j, font: F.serif }); ctag('y − x', (Xp[0] + Yp[0]) / 2 + 60, (Xp[1] + Yp[1]) / 2, { px: 28, a: a * gin(T.pf), color: C.peri, font: F.serif });
    if (gt > 0) { const a1 = Math.atan2(-(4), 3), a2 = Math.atan2(-7, -1); ctx.save(); ctx.globalAlpha = gt; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(O[0], O[1], 60, a2, a1); ctx.stroke(); ctx.restore(); ctag('θ', O[0] + 10, O[1] - 90, { px: 30, a: gt, color: C.ink, font: F.serif }); }
    texAt('cosl', DX + 170, DY - 170, 30, { alpha: a * gin(T.pf + 0.6) });
    texAt('expd', DX + 170, DY - 90, 30, { alpha: a * gin(T.pf2) });
    ctag('交叉项 = xᵀy', DX + 240, DY - 20, { px: 30, a: a * gin(T.pf3), color: C.peri });
    const g3 = a * gin(T.e3); B.card(DX + 190, DY + 140, 580, 130, g3, OK); texAt('e3', DX + 190, DY + 140, 36, { alpha: g3, reveal: rv(T.e3c, 1.6) });
    ctag('长度 × 长度 × 余弦', DX + 190, DY + 260, { px: 34, a: a * gin(T.d2), color: C.ds, font: F.serif });
  }

  // ── D：3B1B 影子 + 计量条 ──
  const P3 = new Plane({ ox: DX, oy: DY + 60, u: 80, R: 6 });
  function shotD(D) {
    const a = B.win(T.sh - 0.2, T.orth - 0.3); if (a <= 0) return;
    B.grid(P3, I2, a * 0.8, D, { old: 0.1, neu: 0.18, basis: false });
    const yv = [3, 1], ang = 0.3 + (B.t > T.sh3 ? (B.t - T.sh3) * 0.9 : 0.6 * smooth(prog(B.t, T.sh, T.sh3))), xv = [3 * Math.cos(ang + 0.6), 3 * Math.sin(ang + 0.6)];
    B.lineD(P3, D, [3, 1], a * 0.6, { color: C.j, width: 2, dash: [8, 8] });
    const pr = B.proj(P3, xv, yv, a * gin(T.sh2), { grow: gin(T.sh2, 0.8), pCol: C.peri });
    arrow(ctx, P3.S([0, 0]), P3.S(yv), { color: C.j, width: 8, head: 24, alpha: a }); ctag('y', ...P3.S([3.3, 1.4]), { px: 32, a, color: C.j, font: F.serif });
    arrow(ctx, P3.S([0, 0]), P3.S(xv), { color: C.i, width: 8, head: 24, alpha: a }); ctag('x', P3.S(xv)[0] + 20, P3.S(xv)[1] - 20, { px: 32, a, color: C.i, font: F.serif });
    const dv = xv[0] * yv[0] + xv[1] * yv[1], m = 3 * Math.hypot(...yv);
    B.meter(DX, DY - 300, 520, dv, m, a * gin(T.sh + 0.6), { label: 'xᵀy =' });
    ctag('影子长度 × ‖y‖', DX, DY - 380, { px: 32, a: a * gin(T.sh2), color: C.peri, font: F.serif });
    const g2 = a * gin(T.cs); if (g2 > 0) { B.card(DX, DY + 330, 520, 90, g2, C.peri); texAt('cs', DX, DY + 330, 40, { alpha: g2 }); ctag('|cos θ| ≤ 1', DX - 330, DY - 300, { px: 28, a: g2, color: C.inkMid }); }
    ctag('共线时取等号', DX + 330, DY + 250, { px: 28, a: a * gin(T.cs2), color: OK });
  }

  // ── E：正交 + 例 4 ──
  const P4 = new Plane({ ox: DX - 40, oy: DY + 170, u: 42, R: 11 });
  function shotE(D) {
    const a = B.win(T.orth - 0.2, T.rn - 0.3); if (a <= 0) return;
    B.card(DX, DY - 330, 520, 96, a * gin(T.orth + 0.3), C.peri); texAt('orth', DX, DY - 330, 44, { alpha: a * gin(T.orth + 0.3) });
    ctag('0 与一切向量正交', DX, DY - 245, { px: 30, a: a * gin(T.orth0), color: C.inkMid });
    const g = a * gin(T.e4); if (g <= 0) return;
    B.grid(P4, I2, g, D, { old: 0.1, neu: 0.25, basis: false, clipY: DY - 200 });
    const u1 = [3, 2], u2 = [-4, 6];
    arrow(ctx, P4.S([0, 0]), P4.S(u1), { color: C.i, width: 8, head: 22, alpha: g }); arrow(ctx, P4.S([0, 0]), P4.S(u2), { color: C.j, width: 8, head: 22, alpha: g });
    ctag('(3, 2)', ...P4.S([4.4, 2.4]), { px: 28, a: g, color: C.i, font: F.serif }); ctag('(−4, 6)', ...P4.S([-4.6, 6.8]), { px: 28, a: g, color: C.j, font: F.serif });
    B.rightMark(P4.S([0, 0]), [3, -2], [-4, -6], g * gin(T.e4 + 2.2), { s: 26, color: OK });
    texAt('e4a', DX + 200, DY - 150, 34, { alpha: g * gin(T.e4 + 1.0) });
    texAt('e4b', DX + 200, DY + 330, 34, { alpha: a * gin(T.e4b) });
    B.stamp(DX + 330, DY + 230, true, gin(T.e4b + 1.8, 0.4), a * gin(T.e4b + 1.8), '⊥');
  }

  // ── F：ℝⁿ + 勾股 ──
  const P5 = new Plane({ ox: DX - 150, oy: DY + 220, u: 52, R: 9 });
  function shotF(D) {
    const a = B.win(T.rn - 0.2, T.ir - 0.3); if (a <= 0) return;
    texAt('cosn', DX, DY - 330, 38, { alpha: a * gin(T.rn + 0.4) });
    ctag('ℝ²、ℝ³ → ℝⁿ：定义照搬', DX, DY - 230, { px: 30, a: a * gin(T.rn) * (1 - gin(T.py)), color: C.inkMid });
    const g = a * gin(T.py); if (g <= 0) return;
    texAt('exp', DX, DY - 230, 34, { alpha: g });
    const X = [4, 0], Y = [0, 3], s = gin(T.py2 + 0.3, 1.2);
    const O = P5.S([0, 0]), Xp = P5.S(X), XY = P5.S([4, 3]);
    // 三个正方形
    const sq = (pts, col, al) => { if (al <= 0) return; const q = pts.map(p => P5.S(p)); ctx.save(); ctx.globalAlpha = al * 0.25; ctx.fillStyle = col; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = al; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); };
    sq([[0, 0], [4, 0], [4, -4], [0, -4]], C.i, g * s); sq([[4, 0], [7, 0], [7, 3], [4, 3]], C.j, g * s); sq([[0, 0], [4, 3], [1, 7], [-3, 4]], C.peri, g * s);
    arrow(ctx, O, Xp, { color: C.i, width: 8, head: 22, alpha: g }); arrow(ctx, Xp, XY, { color: C.j, width: 8, head: 22, alpha: g }); arrow(ctx, O, XY, { color: C.peri, width: 7, head: 22, alpha: g * gin(T.py + 1) });
    B.rightMark(Xp, [-1, 0], [0, -1], g); ctag('x', ...P5.S([2, 0.5]), { px: 30, a: g, color: C.i, font: F.serif }); ctag('y', ...P5.S([4.5, 1.5]), { px: 30, a: g, color: C.j, font: F.serif }); ctag('x + y', ...P5.S([1.0, 2.6]), { px: 28, a: g, color: C.peri, font: F.serif });
    ctag('16', ...P5.S([2, -2]), { px: 34, a: g * s, color: C.i }); ctag('9', ...P5.S([5.5, 1.5]), { px: 34, a: g * s, color: C.j }); ctag('25', ...P5.S([0.5, 3.6]), { px: 34, a: g * s, color: C.peri });
    const gp = a * gin(T.py2 + 0.8); B.card(DX + 260, DY + 320, 480, 86, gp, OK); texAt('py', DX + 260, DY + 320, 36, { alpha: gp });
    ctag('ℝ⁴、ℝ⁵ ……？', DX + 290, DY - 100, { px: 34, a: a * gin(T.d3), color: C.ds, font: F.serif });
    ctag('交叉项 = 0，与维数无关', DX + 290, DY - 40, { px: 30, a: a * gin(T.py3), color: OK });
  }

  // ── G：余弦相似度 ──
  const P6 = new Plane({ ox: DX - 300, oy: DY + 260, u: 80, R: 7 });
  function shotG(D) {
    const a = B.win(T.ir - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('应用 1  信息检索', DX, DY - 380, { px: 32, a, color: C.peri, font: F.serif });
    B.grid(P6, I2, a * 0.7, D, { old: 0.08, neu: 0.15, basis: false });
    const docs = [[[5, 2], '文档 1：矩阵 ×5，猫 ×2', C.i], [[4.4, 3.0], '文档 2：矩阵 ×4，猫 ×3', C.j], [[0.8, 5.2], '文档 3：矩阵 ×1，猫 ×5', C.k]];
    docs.forEach(([v, lab, col], i) => { const g = a * gin(T.ir2 + i * 0.6); arrow(ctx, P6.S([0, 0]), P6.S(v), { color: col, width: 7, head: 20, alpha: g }); ctag(lab, P6.S(v)[0] + 30, P6.S(v)[1] - 26, { px: 24, a: g, color: col, align: 'left' }); });
    ctag('矩阵 →', ...P6.S([6.0, -0.4]), { px: 24, a, color: C.inkMid }); ctag('猫 ↑', ...P6.S([-0.5, 6.0]), { px: 24, a, color: C.inkMid });
    const c12 = (5 * 4.4 + 2 * 3) / (Math.hypot(5, 2) * Math.hypot(4.4, 3)), c13 = (5 * 0.8 + 2 * 5.2) / (Math.hypot(5, 2) * Math.hypot(0.8, 5.2));
    const g2 = a * gin(T.ir2 + 2.0); texAt('cosq', DX + 230, DY - 250, 32, { alpha: g2 });
    ctag(`cos(1, 2) ≈ ${c12.toFixed(2)}  相关`, DX + 260, DY - 140, { px: 30, a: g2, color: OK }); ctag(`cos(1, 3) ≈ ${c13.toFixed(2)}  不太相关`, DX + 260, DY - 80, { px: 30, a: g2, color: C.free });
  }

  // ── H：同济 ──
  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照  第五章 §1', DX, DY - 360, { px: 36, a, color: C.gpt, font: F.serif });
    const g1 = a * gin(T.tj + 0.5); B.card(DX - 220, DY - 200, 380, 150, g1, C.peri); ctag('Leon', DX - 220, DY - 245, { px: 28, a: g1, color: C.peri, font: F.serif }); ctag('xᵀy', DX - 220, DY - 185, { px: 40, a: g1, color: C.ink, font: F.serif });
    B.card(DX + 220, DY - 200, 380, 150, g1, C.gpt); ctag('同济', DX + 220, DY - 245, { px: 28, a: g1, color: C.gpt, font: F.serif }); texAt('tj', DX + 220, DY - 185, 34, { alpha: g1 });
    ctag('同一个数，记号不同', DX, DY - 80, { px: 32, a: a * gin(T.tj2), color: C.ink });
    const g3 = a * gin(T.tj2b); B.card(DX, DY + 80, 560, 140, g3, OK); ctag('单位化', DX - 150, DY + 80, { px: 34, a: g3, color: OK, font: F.serif }); texAt('tju', DX + 80, DY + 80, 40, { alpha: g3 });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    texAt('dotdef', DX, DY - 230, 34, { alpha: a * gin(T.sum + 0.3) });
    texAt('thm', DX, DY - 140, 40, { alpha: a * gin(cue('C17', '也等于')) });
    texAt('orth', DX, DY - 40, 38, { alpha: a * gin(cue('C17', '点积为零')) });
    texAt('py', DX, DY + 60, 36, { alpha: a * gin(cue('C17', '勾股定律')) });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('投影', DX, DY - 10, { px: 110, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('把“影子”精确算出来', DX, DY + 110, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.dot - 0.2, t1: T.thm - 0.3, head: '点积', items: [['xᵀy = Σ xᵢyᵢ', T.dot2, { color: C.peri, mark: C.peri }], ['长度 ‖x‖ = √(xᵀx)', T.len], ['距离 ‖x − y‖', T.dist]] },
    { t0: T.thm - 0.3, t1: T.rn - 0.3, head: '夹角与正交', items: [['xᵀy = ‖x‖‖y‖cos θ', T.thm, { color: C.peri, mark: C.peri }], ['影子 × 长度', T.sh], ['柯西–施瓦茨', T.cs], ['xᵀy = 0 ⇔ 正交', T.orth, { color: OK, mark: OK }]] },
    { t0: T.rn - 0.3, t1: T.end - 0.3, head: '推广与对照', items: [['ℝⁿ 照搬', T.rn], ['勾股定律', T.py, { color: OK, mark: OK }], ['余弦相似度', T.ir], ['同济 [x, y]', T.tj, { color: C.gpt, mark: C.gpt }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(D); shotC(D); shotD(D); shotE(D); shotF(D); shotG(D); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
