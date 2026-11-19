// 第 7 章 7.2 高斯消元 = LU 分解（Leon 9th §7.2：例 1 分解、乘数存进 L、例 2 前代回代、运算量 ⅓n³+n²−⅓n、结合顺序与计算量）。
// 分镜：数字矩阵逐步消元（被消的格子闪红变零）→ 零位填回乘数（橙）→ 劈成 L、U 两块 → 前代 / 回代逐行点亮
//       → 3B1B：右下角正方形一层层缩小，叠成金字塔，体积 ≈ ⅓n³ → n 翻倍工作量 ×8 → 同一个 A 换 b → (AB)x vs A(Bx) → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, neg } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_proud', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.2 消元就是 LU', hi: 3, en: 'GAUSSIAN ELIMINATION · LU',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C07: 0.6, C10: 0.6, C14: 0.6, G01: 0.6, C17: 0.6 },
    post: { C01: 0.6, C02: 1.0, C03: 1.4, C04: 1.2, C05: 1.2, C06: 1.0, C08: 1.2, C09: 1.2, C11: 1.4, C12: 1.2, C13: 0.8, C15: 1.2, G01: 0.6, C16: 0.6, C17: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, e1: L('C02').s, e1b: cue('C02', '乘数l二一'), e1c: cue('C02', 'l三一'), s1: L('C03').s, s1b: cue('C03', '第三行减'), s2: cue('C03', '第二步'), s2b: cue('C03', '第三行变成'),
    fill: L('C04').s, fill2: cue('C04', '这就是L'), fill3: cue('C04', '就是U'), lu: L('C05').s, lu2: cue('C05', '可以验证'), d1: L('D01').s, why: L('C06').s, why2: cue('C06', '把它们的逆'),
    so: L('C07').s, so2: cue('C07', '叫前代'), so3: cue('C07', '叫回代'), fw: L('C08').s, fw1: cue('C08', 'y一是负四'), fw2: cue('C08', 'y二是'), fw3: cue('C08', 'y三是'), bw: L('C09').s, bw1: cue('C09', 'x三是'), bw2: cue('C09', 'x二是'), bw3: cue('C09', 'x一是'), bw4: cue('C09', '解是'),
    ct: L('C10').s, ct2: cue('C10', '更新右下角'), py: L('C11').s, py2: cue('C11', '金字塔'), py3: cue('C11', '三分之一n的立方'), ex: L('C12').s, d2: L('D02').s, x8: L('C13').s, x8b: cue('C13', '翻八倍'), x8c: cue('C13', '一加德尔塔'),
    re: L('C14').s, re2: cue('C14', 'n的平方次运算'), ab: L('C15').s, ab2: cue('C15', '只要二倍n的平方次'), ab3: cue('C15', '相差五百倍'), tj: L('G01').s, tj2: cue('G01', '会影响计算量'), d3: L('D03').s, zp: L('C16').s, zp2: cue('C16', '很小的主元'), sum: L('C17').s, end: L('C18').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.e1, 0.3); TL.sfx('pop', T.e1b, 0.3); TL.sfx('pop', T.e1c, 0.3); TL.sfx('whoosh', T.s1, 0.3); TL.sfx('whoosh', T.s2, 0.3); TL.sfx('ding', T.s2b, 0.3);
  TL.sfx('sting', T.fill, 0.3); TL.sfx('pop', T.fill2, 0.3); TL.sfx('pop', T.fill3, 0.3); TL.sfx('ding_hi', T.lu2, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.why2, 0.3);
  TL.sfx('pop', T.so2, 0.3); TL.sfx('pop', T.so3, 0.3); [T.fw1, T.fw2, T.fw3, T.bw1, T.bw2, T.bw3].forEach(x => TL.sfx('click', x, 0.25)); TL.sfx('ding_hi', T.bw4, 0.3);
  TL.sfx('pop', T.ct, 0.3); for (let k = 0; k < 5; k++) TL.sfx('marimba', T.py + 0.4 + k * 0.5, 0.18); TL.sfx('ding', T.py3, 0.3); TL.sfx('pop', T.ex, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('impact', T.x8b, 0.3);
  TL.sfx('pop', T.re, 0.3); TL.sfx('pop', T.ab, 0.3); TL.sfx('sting', T.ab3, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('crack', T.zp2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  // ── A：例 1 消元 → 乘数填回 → L、U ──
  const M0 = [[2, 3, 1], [4, 1, 4], [3, 4, 6]], M1 = [[2, 3, 1], [0, -5, 2], [0, '−½', '9/2']], M2 = [[2, 3, 1], [0, -5, 2], [0, 0, '4.3']], MC = [[2, 3, 1], [2, -5, 2], ['3/2', '1/10', '4.3']];
  function shotA() {
    const a = B.win(T.o - 0.2, T.so - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.d1 - 0.2)), t = B.t;
    const st = t < T.s1b ? (t < T.s1 + 0.3 ? 0 : 1) : t < T.s2b ? 1 : t < T.fill + 0.6 ? 2 : 3;
    const M = [M0, M1, M2, MC][t < T.s1 + 0.6 ? 0 : t < T.s2b ? 1 : t < T.fill + 0.6 ? 2 : 3];
    ctag('A', DX - 260, DY - 280, { px: 44, a: g0 * gin(T.e1), color: C.ink, font: F.serif });
    const lower = (i, j) => j < i;
    B.mat(DX, DY - 280, M, g0 * gin(T.e1), { cw: 110, ch: 70, px: 38, col: (i, j) => (st === 3 && lower(i, j) ? C.peri : M === M2 && i === 2 && j === 1 ? C.free : C.ink),
      cell: (i, j) => (st >= 1 && st < 3 && lower(i, j) && (M[i][j] === 0) ? { bg: C.free, a: 0.18 } : st === 3 && lower(i, j) ? { bg: C.peri, a: 0.2 } : (j === i && t > T.e1b && t < T.fill) ? { box: C.i } : null) });
    ctag('l₂₁ = 4 / 2 = 2', DX - 230, DY - 150, { px: 30, a: g0 * gin(T.e1b) * (1 - gin(T.fill - 0.2)), color: C.peri, font: F.serif });
    ctag('l₃₁ = 3 / 2', DX + 30, DY - 150, { px: 30, a: g0 * gin(T.e1c) * (1 - gin(T.fill - 0.2)), color: C.peri, font: F.serif });
    texAt('mult2', DX, DY - 90, 32, { alpha: g0 * gin(T.s2) * (1 - gin(T.fill - 0.2)) });
    ctag('乘数填回被消掉的位置', DX, DY - 150, { px: 30, a: g0 * gin(T.fill), color: C.peri });
    // 劈成 L、U
    const gs = g0 * gin(T.fill2 - 0.2); if (gs > 0) {
      const sp = smoother(prog(B.t, T.fill2 - 0.2, T.fill2 + 0.8));
      B.mat(DX - lerp(0, 220, sp), DY + 30, [[1, '', ''], ['2', 1, ''], ['3/2', '1/10', 1]], gs, { cw: 80, ch: 58, px: 30, col: (i, j) => (j < i ? C.peri : C.inkMid) });
      ctag('L', DX - lerp(0, 220, sp), DY + 140, { px: 38, a: gs, color: C.peri, font: F.serif });
      const gu = g0 * gin(T.fill3); B.mat(DX + lerp(0, 220, sp), DY + 30, [[2, 3, 1], ['', -5, 2], ['', '', '4.3']], gu, { cw: 80, ch: 58, px: 30 }); ctag('U', DX + lerp(0, 220, sp), DY + 140, { px: 38, a: gu, color: C.ink, font: F.serif });
    }
    texAt('LU', DX, DY + 240, 30, { alpha: g0 * gin(T.lu) });
    ctag('L × U = A ✓', DX + 330, DY + 320, { px: 28, a: g0 * gin(T.lu2), color: OK });
    const g1 = a * gin(T.d1 - 0.2); if (g1 <= 0) return;
    ctag('为什么乘数正好组成 L？', DX, DY - 300, { px: 34, a: g1, color: C.ds });
    ctag('E₂ E₁ A = U', DX, DY - 190, { px: 48, a: g1 * gin(T.why), color: C.ink, font: F.serif });
    ctag('A = E₁⁻¹ E₂⁻¹ U = L U', DX, DY - 90, { px: 48, a: g1 * gin(T.why2), color: C.peri, font: F.serif });
    ctag('逆的乘积：乘数原样落到下三角', DX, DY + 10, { px: 30, a: g1 * gin(T.why2 + 1.5), color: C.inkMid });
    texAt('LU', DX, DY + 140, 30, { alpha: g1 * gin(T.why2 + 1.5) });
  }

  // ── B：前代 / 回代 ──
  function shotB() {
    const a = B.win(T.so - 0.2, T.ct - 0.3); if (a <= 0) return;
    B.card(DX, DY - 360, 560, 80, a * gin(T.so), C.peri); texAt('solve', DX, DY - 360, 38, { alpha: a * gin(T.so) });
    ctag('前代 ↓', DX - 170, DY - 285, { px: 28, a: a * gin(T.so2), color: C.i }); ctag('回代 ↑', DX + 170, DY - 285, { px: 28, a: a * gin(T.so3), color: C.j });
    ctag('b = (−4, 9, 0)', DX, DY - 220, { px: 32, a: a * gin(T.fw), color: C.ink, font: F.serif });
    const fw = [['y₁ = −4', T.fw1], ['y₂ = 9 − 2y₁ = 17', T.fw2], ['y₃ = 0 − (3/2)y₁ − (1/10)y₂ = 4.3', T.fw3]];
    fw.forEach(([s, t0], i) => ctag(s, DX, DY - 150 + i * 52, { px: 30, a: a * gin(t0), color: C.i, font: F.serif }));
    const bw = [['x₃ = 4.3 / 4.3 = 1', T.bw1], ['x₂ = (17 − 2) / (−5) = −3', T.bw2], ['x₁ = (−4 + 9 − 1) / 2 = 2', T.bw3]];
    bw.forEach(([s, t0], i) => ctag(s, DX, DY + 30 + i * 52, { px: 30, a: a * gin(t0), color: C.j, font: F.serif }));
    B.card(DX, DY + 240, 380, 84, a * gin(T.bw4), OK); texAt('bwd', DX, DY + 240, 34, { alpha: a * gin(T.bw4) });
  }

  // ── C：运算量金字塔 ──
  function shotC() {
    const a = B.win(T.ct - 0.2, T.re - 0.3); if (a <= 0) return;
    const n = 7, cx = DX - 170, cy = DY + 40, u = 34;
    ctag('第 k 步：更新 (n − k)² 个元素', DX, DY - 390, { px: 30, a: a * gin(T.ct2), color: C.ink });
    for (let k = 1; k < n; k++) {
      const m = n - k, g = a * gin(k === 1 ? T.ct2 : T.py + 0.4 + (k - 2) * 0.5), off = (k - 1) * 14;
      ctx.save(); ctx.globalAlpha = g * 0.55; ctx.fillStyle = [C.i, C.peri, C.j, C.k, C.free, C.ds][(k - 1) % 6]; ctx.fillRect(cx - m * u / 2 + off * 0.3, cy - m * u / 2 - off * 2.2 + (k - 1) * u / 2, m * u, m * u); ctx.restore();
      ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - m * u / 2 + off * 0.3, cy - m * u / 2 - off * 2.2 + (k - 1) * u / 2, m * u, m * u); ctx.restore();
      B.tag(`(n − ${k})²`, cx + m * u / 2 + off * 0.3 + 14, cy - m * u / 2 - off * 2.2 + (k - 1) * u / 2 + 14, { px: 22, a: g, color: C.inkMid });
    }
    texAt('cnt1', DX + 230, DY - 250, 36, { alpha: a * gin(T.py3) });
    ctag('金字塔体积', DX + 230, DY - 170, { px: 28, a: a * gin(T.py2), color: C.peri });
    texAt('cntm', DX + 220, DY - 70, 32, { alpha: a * gin(T.ex) }); texAt('cnta', DX + 220, DY + 0, 32, { alpha: a * gin(T.ex + 0.8) });
    const gx = a * gin(T.d2); if (gx > 0) {
      const rows = [['n', '乘除次数'], ['10', '430'], ['100', '343 300'], ['1000', '334 333 000']];
      B.mat(DX + 230, DY + 150, rows, gx, { cw: 170, ch: 44, px: 26, bracket: false, col: (i, j) => (i === 0 ? C.inkMid : i === 3 ? C.peri : C.ink) });
    }
    ctag('n × 2 → 工作量 × 8', DX, DY + 290, { px: 34, a: a * gin(T.x8b), color: C.free, font: F.serif });
  }

  // ── D：重用 LU、乘法顺序 ──
  function shotD() {
    const a = B.win(T.re - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('A = LU 只分解一次', DX, DY - 370, { px: 36, a: a * gin(T.re), color: C.peri, font: F.serif });
    ['b₁', 'b₂', 'b₃'].forEach((s, i) => { const g = a * gin(T.re + 0.8 + i * 0.4); ctag(`${s} → 前代 + 回代`, DX, DY - 290 + i * 50, { px: 28, a: g, color: C.ink, font: F.serif }); });
    ctag('每个右端 ≈ n² 次', DX, DY - 130, { px: 30, a: a * gin(T.re2), color: OK });
    texAt('abx', DX, DY - 20, 34, { alpha: a * gin(T.ab) });
    const gb = a * gin(T.ab2); if (gb > 0) {
      const y0 = DY + 260, s = smoother(prog(B.t, T.ab2, T.ab2 + 1.2)), hA = 230 * s, hB = 230 / 500 * s * 1;
      ctx.save(); ctx.globalAlpha = gb * 0.85; ctx.fillStyle = C.free; ctx.fillRect(DX - 160, y0 - hA, 110, hA); ctx.fillStyle = OK; ctx.fillRect(DX + 50, y0 - Math.max(2, hB), 110, Math.max(2, hB)); ctx.restore();
      ctag('(AB)x', DX - 105, y0 + 30, { px: 26, a: gb, color: C.free, font: F.serif }); ctag('A(Bx)', DX + 105, y0 + 30, { px: 26, a: gb, color: OK, font: F.serif });
      ctag('n = 1000：相差 500 倍', DX + 105, y0 - 80, { px: 28, a: gb * gin(T.ab3), color: C.peri });
    }
  }

  // ── E：同济 + 零主元 + 小结 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.d3 - 0.2));
    ctag('同济 · 第三章 初等行变换', DX, DY - 300, { px: 36, a: g1, color: C.gpt, font: F.serif });
    ctag('= 这里的消元，只是没写成 LU', DX, DY - 220, { px: 30, a: g1 * gin(T.tj + 1.2), color: C.ink });
    ctag('同济 · 第二章：(AB)C = A(BC)', DX, DY - 110, { px: 32, a: g1 * gin(cue('G01', '满足结合律')), color: C.gpt, font: F.serif });
    ctag('结果一样，计算量不一样', DX, DY - 40, { px: 30, a: g1 * gin(T.tj2), color: C.peri });
    const g2 = a * gin(T.d3 - 0.2) * (1 - gin(T.sum - 0.2));
    B.mat(DX, DY - 200, [['0', '·', '·'], ['·', '·', '·'], ['·', '·', '·']], g2, { cw: 80, ch: 60, px: 34, cell: (i, j) => (i === 0 && j === 0 ? { box: C.free } : null), col: (i, j) => (i + j === 0 ? C.free : C.inkMid) });
    ctag('主元为零 → 必须换行', DX, DY - 50, { px: 34, a: g2 * gin(T.zp), color: C.free, font: F.serif });
    ctag('很小的主元也出大问题', DX, DY + 30, { px: 30, a: g2 * gin(T.zp2), color: C.peri });
    const g3 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['消元 = LU 分解', C.ink, T.sum], ['乘数存进 L', C.peri, cue('C17', '乘数存进L')], ['先前代，再回代', C.j, cue('C17', '先前代')], ['≈ ⅓ n³', C.i, cue('C17', '总运算量')]].forEach(([s, c, t0], i) => ctag(s, DX, DY - 260 + i * 80, { px: 38, a: g3 * gin(t0), color: c, font: F.serif }));
    const g4 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g4, color: C.inkMid });
    ctag('主元策略', DX, DY - 20, { px: 90, a: g4 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('该选哪一行？', DX, DY + 90, { px: 36, a: g4 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.e1 - 0.2, t1: T.so - 0.3, head: 'LU 分解', items: [['乘数 l_ik', T.e1b, { color: C.peri }], ['乘数填回 → L', T.fill2, { color: C.peri }], ['消元结果 → U', T.fill3], ['初等矩阵的逆', T.why2]] },
    { t0: T.so - 0.2, t1: T.ct - 0.3, head: '解方程组', items: [['Ly = b 前代', T.so2, { color: C.i }], ['Ux = y 回代', T.so3, { color: C.j }], ['x = (2, −3, 1)', T.bw4, { color: OK }]] },
    { t0: T.ct - 0.2, t1: T.sum - 0.3, head: '运算量', items: [['≈ ⅓ n³（金字塔）', T.py3, { color: C.peri }], ['n × 2 → × 8', T.x8b, { color: C.free }], ['换 b：≈ n²', T.re2, { color: OK }], ['顺序影响计算量', T.ab]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['A = LU', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotA(); shotB(); shotC(); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
