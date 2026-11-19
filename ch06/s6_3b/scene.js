// 第 6 章 6.3（下）马尔可夫链与矩阵指数（Leon 9th §6.3：概率向量、随机矩阵、定理 6.3.3、例 5 租车、应用 2 网页排名、e^A、例 6、例 7）。
// 分镜：比例柱 → 概率向量 / 随机矩阵 → Aⁿ = X diag(1, ½ⁿ) X⁻¹ → 3B1B：概率线段上多个起点迭代，落到 (2,3) 方向，停在 (0.4, 0.6)
//       → 定理 6.3.3、主特征值 → 租车四阶 → 网页排名：随机点击小图，节点大小 = 稳态分量 → e^A 级数 → 对角化求 e^A、例 6 → e^{tA}Y₀、例 7 → Aⁿ ↔ e^{tA} → 同济 φ(A) → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, rgba } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.3 马尔可夫链与矩阵指数', hi: 3, en: 'MARKOV CHAINS · MATRIX EXPONENTIAL',
    titleEnd: () => B.L('C02').s, titlePx: 80,
    pre: { C02: 0.4, C03: 0.6, C04: 0.4, C05: 0.6, C07: 0.6, C08: 0.6, C10: 0.8, C11: 0.4, C12: 0.6, C13: 0.6, C15: 0.6, G01: 0.6, C16: 0.6 },
    post: { C01: 0.6, C02: 0.6, C03: 0.8, C04: 2.0, C06: 0.8, C07: 0.8, C08: 1.4, C10: 0.8, C11: 0.8, C12: 1.0, C14: 1.0, C15: 0.8, G02: 0.6, C16: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    pv: L('C01').s, pv2: cue('C01', '叫作概率向量'), mc: L('C02').s, mc2: cue('C02', 'A叫转移矩阵'), mc3: cue('C02', '叫随机矩阵'), dg: L('C03').s, dg2: cue('C03', 'A的n次方'), dg3: cue('C03', 'n趋于无穷'),
    it: L('C04').s, it2: cue('C04', '最后停在'), it3: cue('C04', '这就是稳态向量'), d1: L('D01').s, th: L('C05').s, th2: cue('C05', '而且A乘x等于x'), dom: L('C06').s, dom2: cue('C06', '如果一是唯一'),
    car: L('C07').s, car2: cue('C07', '特征值是'), car3: cue('C07', '长期来看'), pr: L('C08').s, pr2: cue('C08', '用户沿着链接'), pr3: cue('C08', '稳态向量的各个分量'), d2: L('D02').s, ex: L('C09').s, ex2: cue('C09', '下面换一个方向'),
    se: L('C10').s, se2: cue('C10', '把a换成方阵A'), xd: L('C11').s, xd2: cue('C11', '而e的D次方'), e6: L('C12').s, e6b: cue('C12', '结果第一行'), d3: L('D03').s,
    iv: L('C13').s, iv2: cue('C13', '解就是'), iv3: cue('C13', '和一维的公式'), e7: L('C14').s, e7b: cue('C14', '算出来'), dc: L('C15').s, dc2: cue('C15', '离散时间'), dc3: cue('C15', '都靠对角化'),
    tj: L('G01').s, tj2: L('G02').s, sum: L('C16').s, end: L('C17').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.pv2, 0.3); TL.sfx('pop', T.mc2, 0.3); TL.sfx('pop', T.mc3, 0.3); TL.sfx('pop', T.dg2, 0.3); TL.sfx('swoosh_soft', T.dg3, 0.3);
  TL.sfx('whoosh', T.it, 0.3); for (let k = 0; k < 6; k++) TL.sfx('tick', T.it + 0.8 + k * 0.7, 0.18); TL.sfx('ding_hi', T.it3, 0.32); TL.sfx('pluck', T.d1, 0.3); TL.sfx('sting', T.th2, 0.3); TL.sfx('pop', T.dom2, 0.3);
  TL.sfx('pop', T.car, 0.3); TL.sfx('ding', T.car3, 0.3); TL.sfx('whoosh', T.pr, 0.3); TL.sfx('shimmer', T.pr3, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('swoosh_in', T.ex2, 0.3);
  TL.sfx('pop', T.se2, 0.3); TL.sfx('pop', T.xd, 0.3); TL.sfx('pop', T.e6, 0.3); TL.sfx('ding_hi', T.e6b + 1.0, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('sting', T.iv2, 0.3); TL.sfx('pop', T.e7, 0.3); TL.sfx('check', T.e7b + 1.0, 0.3); TL.sfx('shimmer', T.dc3, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C17').e + 0.3, 0.4);

  const A = [[0.7, 0.2], [0.3, 0.8]], st = w => [A[0][0] * w[0] + A[0][1] * w[1], A[1][0] * w[0] + A[1][1] * w[1]];
  // ── A：概率向量 + 随机矩阵 ──
  function shotA() {
    const a = B.win(T.pv - 0.2, T.it - 0.3); if (a <= 0) return;
    const g = a * (1 - gin(T.dg - 0.2));
    B.bars(DX, DY + 20, [0.8, 0.2], 1, g * gin(T.pv + 0.6), { cols: [C.peri, C.j], labels: ['已婚', '单身'], w: 140, gap: 100, hMax: 300, fmt: v => v.toFixed(1) });
    texAt('prob', DX, DY + 140, 38, { alpha: g * gin(T.pv2) });
    texAt('stoch', DX, DY - 370, 32, { alpha: g * gin(T.mc2) });
    ctag('每列是概率向量 → 随机矩阵', DX, DY - 290, { px: 30, a: g * gin(T.mc3), color: C.peri });
    ctag('只看上一步 · 概率不变：马尔可夫链', DX, DY + 230, { px: 28, a: g * gin(T.mc), color: C.inkMid });
    const g2 = a * gin(T.dg - 0.2); if (g2 <= 0) return;
    ctag('λ = 1，½', DX, DY - 300, { px: 40, a: g2, color: C.ink, font: F.serif });
    texAt('an', DX, DY - 150, 30, { alpha: g2 * gin(T.dg2), reveal: rv(T.dg2, 4.0) });
    ctag('(½)ⁿ → 0', DX, DY - 30, { px: 40, a: g2 * gin(T.dg3), color: C.j, font: F.serif });
  }

  // ── B：概率线段上的迭代 ──
  const P = new Plane({ ox: DX - 230, oy: DY + 270, u: 430, R: 1.2 });
  const starts = [[1, 0], [0, 1], [0.85, 0.15], [0.2, 0.8], [0.55, 0.45]];
  const paths = starts.map(s => { const r = [s]; for (let i = 0; i < 14; i++) r.push(st(r[i])); return r; });
  function shotB(D) {
    const a = B.win(T.it - 0.2, T.car - 0.3); if (a <= 0) return;
    const O = P.S([0, 0]);
    B.line2(O, P.S([1.15, 0]), C.ink, a * 0.6, 2); B.line2(O, P.S([0, 1.15]), C.ink, a * 0.6, 2);
    ctag('已婚比例', ...P.S([1.05, -0.08]), { px: 24, a, color: C.peri }); ctag('单身比例', ...P.S([-0.12, 1.12]), { px: 24, a, color: C.j });
    B.line2(P.S([1, 0]), P.S([0, 1]), C.ink, a * 0.9, 4); ctag('x₁ + x₂ = 1', ...P.S([0.72, 0.42]), { px: 26, a, color: C.inkMid, font: F.serif });
    B.lineD(P, D, [2 / Math.hypot(2, 3), 3 / Math.hypot(2, 3)], a * 0.7, { color: C.i, dash: [10, 8] });
    const n = prog(B.t, T.it + 0.6, T.it + 5.0) * 10;
    paths.forEach((pth, j) => {
      const k = Math.min(13, Math.floor(n)), f = smooth(n - k);
      for (let i = 0; i <= k; i++) B.dot(...P.S(pth[i]), 6, C.periLt, a * 0.5);
      const cur = [lerp(pth[k][0], pth[k + 1][0], f), lerp(pth[k][1], pth[k + 1][1], f)];
      B.dot(...P.S(cur), 11, C.peri, a);
    });
    const gs = a * gin(T.it2); B.dot(...P.S([0.4, 0.6]), 16, OK, gs); ctag('(0.4, 0.6)', ...P.S([0.62, 0.66]), { px: 30, a: gs, color: OK, font: F.serif });
    B.card(DX + 210, DY - 300, 360, 100, a * gin(T.it3), OK); texAt('ss', DX + 210, DY - 300, 34, { alpha: a * gin(T.it3) });
    const gt = a * gin(T.th); B.card(DX + 120, DY - 400, 560, 76, gt, C.peri); texAt('thm3', DX + 120, DY - 400, 32, { alpha: gt * gin(T.th2) });
    const gd = a * gin(T.dom); texAt('dom', DX + 210, DY - 190, 32, { alpha: gd });
    ctag('1 唯一最大 → 主特征值 → 必收敛', DX + 210, DY - 130, { px: 26, a: a * gin(T.dom2), color: C.peri });
  }

  // ── C：租车 + 网页排名 ──
  const N = [[0, 0], [1, 0.3], [0.4, 1], [-0.7, 0.8], [-0.9, -0.3]];
  const LINKS = [[0, 1], [0, 2], [1, 2], [2, 0], [3, 2], [3, 0], [4, 0], [2, 3], [1, 4]];
  const Mx = N.map(() => N.map(() => 0)); N.forEach((_, j) => { const out = LINKS.filter(l => l[0] === j).map(l => l[1]); out.forEach(i => Mx[i][j] += 1 / out.length); });
  let pr = N.map(() => 1 / N.length); for (let k = 0; k < 100; k++) pr = N.map((_, i) => 0.15 / N.length + 0.85 * N.reduce((s, _, j) => s + Mx[i][j] * pr[j], 0));
  function shotC() {
    const a = B.win(T.car - 0.2, T.se - 0.3); if (a <= 0) return;
    const g1 = a * (1 - gin(T.pr - 0.2));
    ctag('租车：四种车型', DX, DY - 300, { px: 40, a: g1, color: C.ink, font: F.serif });
    texAt('car', DX, DY - 200, 38, { alpha: g1 * gin(T.car2) });
    B.bars(DX, DY + 180, [0.25, 0.25, 0.25, 0.25], 0.5, g1 * gin(T.car3), { cols: [C.peri, C.j, C.i, C.k], labels: ['车型 1', '车型 2', '车型 3', '车型 4'], w: 90, gap: 50, hMax: 300, fmt: () => '¼' });
    const g2 = a * gin(T.pr - 0.2); if (g2 <= 0) return;
    const S = p => [DX + p[0] * 300, DY + 40 - p[1] * 280];
    LINKS.forEach(([f, t]) => { const p = S(N[f]), q = S(N[t]), d = [q[0] - p[0], q[1] - p[1]], n = Math.hypot(...d); arrow(ctx, [p[0] + d[0] / n * 50, p[1] + d[1] / n * 50], [q[0] - d[0] / n * 60, q[1] - d[1] / n * 60], { color: C.inkMid, width: 3, head: 14, alpha: g2 * 0.7 }); });
    const gr = gin(T.pr3, 1.0);
    N.forEach((p, i) => { const q = S(p), r = lerp(36, 30 + 260 * pr[i], gr); ctx.save(); ctx.globalAlpha = g2 * 0.85; ctx.fillStyle = C.paperHi; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(...q, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); ctag(gr > 0.5 ? pr[i].toFixed(2) : '网页', q[0], q[1], { px: 24, a: g2, color: C.ink, font: F.serif }); });
    // 随机点击的小人
    const tw = (B.t - T.pr2) / 0.8; if (tw > 0) { const seq = [0, 1, 2, 0, 2, 3, 2, 0, 1, 4, 0, 2, 3, 0, 1, 2]; const k = Math.floor(tw) % (seq.length - 1), f = smooth(tw - Math.floor(tw)); const p = S(N[seq[k]]), q = S(N[seq[k + 1]]); B.dot(lerp(p[0], q[0], f), lerp(p[1], q[1], f), 12, C.ds, g2); }
    ctag('稳态分量 = 网页重要程度', DX, DY + 380, { px: 30, a: g2 * gin(T.pr3), color: C.peri });
    ctag('排序 = 求属于 1 的特征向量', DX, DY - 360, { px: 32, a: g2 * gin(T.d2), color: C.ds, font: F.serif });
  }

  // ── D：矩阵指数 ──
  function shotD() {
    const a = B.win(T.se - 0.2, T.iv - 0.3); if (a <= 0) return;
    ctag('e^a = 1 + a + a²/2! + ···', DX, DY - 380, { px: 34, a: a * gin(T.se), color: C.inkMid, font: F.serif });
    B.card(DX, DY - 280, 700, 100, a * gin(T.se2), C.peri); texAt('series', DX, DY - 280, 34, { alpha: a * gin(T.se2) });
    texAt('expd', DX, DY - 130, 34, { alpha: a * gin(T.xd), reveal: rv(T.xd, 3.0) });
    ctag('对角元各自取指数', DX, DY - 40, { px: 28, a: a * gin(T.xd2), color: C.j });
    texAt('e6', DX, DY + 120, 34, { alpha: a * gin(T.e6), reveal: rv(T.e6b, 4.0) });
    ctag('λ = 1，0', DX - 300, DY + 240, { px: 30, a: a * gin(T.e6 + 2.0), color: C.inkMid, font: F.serif });
    ctag('有什么用？', DX + 250, DY + 260, { px: 36, a: a * gin(T.d3), color: C.ds, font: F.serif });
  }

  // ── E：e^{tA}Y₀ ──
  function shotE() {
    const a = B.win(T.iv - 0.2, T.tj - 0.3); if (a <= 0) return;
    B.card(DX, DY - 340, 640, 100, a * gin(T.iv2), C.peri); texAt('ivp', DX, DY - 340, 36, { alpha: a * gin(T.iv2) });
    ctag('与一维公式长得一样', DX, DY - 260, { px: 28, a: a * gin(T.iv3), color: C.inkMid });
    texAt('e7', DX, DY - 120, 34, { alpha: a * gin(T.e7), reveal: rv(T.e7, 3.0) });
    B.stamp(DX + 330, DY - 20, true, prog(B.t, T.e7b + 1.0, T.e7b + 1.4), a * (1 - gin(T.dc)), '同 6.2');
    const gd = a * gin(T.dc); if (gd <= 0) return;
    const L0 = DX - 220, R0 = DX + 220, y = DY + 130;
    B.card(L0, y, 320, 140, gd * gin(T.dc2), C.i); ctag('离散时间', L0, y - 40, { px: 28, a: gd * gin(T.dc2), color: C.i }); ctag('Aⁿ = XDⁿX⁻¹', L0, y + 20, { px: 34, a: gd * gin(T.dc2), color: C.ink, font: F.serif });
    B.card(R0, y, 320, 140, gd * gin(T.dc2 + 1.5), C.j); ctag('连续时间', R0, y - 40, { px: 28, a: gd * gin(T.dc2 + 1.5), color: C.j }); ctag('eᵗᴬ = XeᵗᴰX⁻¹', R0, y + 20, { px: 32, a: gd * gin(T.dc2 + 1.5), color: C.ink, font: F.serif });
    ctag('⟷', DX, y, { px: 50, a: gd * gin(T.dc2 + 1.5), color: C.peri });
    ctag('矩阵运算 → 对角线上数的运算', DX, DY + 290, { px: 32, a: gd * gin(T.dc3), color: C.peri, font: F.serif });
  }

  // ── F：同济 + 小结 ──
  function shotF() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济对照：求 Aⁿ 或 φ(A)', DX, DY - 320, { px: 34, a: g1, color: C.gpt });
    B.card(DX, DY - 200, 820, 100, g1 * gin(T.tj + 2.0), C.gpt); texAt('tj', DX, DY - 200, 32, { alpha: g1 * gin(T.tj + 2.0) });
    ctag('例：φ(A) = A¹⁰ − 5A⁹', DX, DY - 50, { px: 36, a: g1 * gin(T.tj2), color: C.ink, font: F.serif });
    ctag('φ 作用到每个特征值上', DX, DY + 40, { px: 32, a: g1 * gin(cue('G02', 'phi作用到')), color: C.peri });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    ctag('随机矩阵：有特征值 1', DX, DY - 230, { px: 38, a: g2, color: C.ink, font: F.serif });
    ctag('稳态 = 属于 1 的概率特征向量', DX, DY - 150, { px: 34, a: g2 * gin(cue('C16', '稳态就是')), color: OK });
    ctag('Aⁿ：取幂    eᵗᴬ：取指数', DX, DY - 40, { px: 36, a: g2 * gin(cue('C16', '对角化以后')), color: C.peri, font: F.serif });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('对称矩阵', DX, DY - 20, { px: 96, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('特征向量互相垂直', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.pv - 0.2, t1: T.car - 0.3, head: '马尔可夫链', items: [['概率向量：非负、和为 1', T.pv2], ['随机矩阵：每列和为 1', T.mc3], ['λ = 1 与 ½', T.dg], ['稳态 (0.4, 0.6)', T.it3, { color: OK }], ['Ax = x', T.th2, { color: C.peri }]] },
    { t0: T.car - 0.2, t1: T.se - 0.3, head: '应用', items: [['租车：各占 ¼', T.car3], ['网页排名', T.pr], ['= 属于 1 的特征向量', T.d2, { color: C.peri }]] },
    { t0: T.se - 0.2, t1: T.tj - 0.3, head: '矩阵指数', items: [['eᴬ 的级数', T.se2], ['eᴬ = XeᴰX⁻¹', T.xd, { color: C.peri }], ['例 6', T.e6], ['Y = eᵗᴬY₀', T.iv2, { color: OK }], ['Aⁿ ⟷ eᵗᴬ', T.dc2]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['都靠对角化', T.sum + 4]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(D); shotC(); shotD(); shotE(); shotF(); B.left(SECS); });
  }
  return { TL, draw };
}
