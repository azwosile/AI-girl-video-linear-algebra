// 第 5 章 5.3（下）数据拟合（Leon 9th §5.3）。
// 分镜：散点 + 竖直残差 → 直线 y = c₀ + c₁x 的矩阵写法 → 例 2：三点、正规方程、最佳直线 + 残差方块（面积计 2/3）→ 微积分偏导同解
//       → 3B1B：直线摆动，残差方块面积变大，回到最佳 → 二次拟合 例 3 → 对参数线性 → 过拟合（三次插值乱抖）
//       → TB7 → 同济（回归直线）→ 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.3 数据拟合', hi: 3, en: 'FITTING DATA',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C07: 0.4, C09: 0.6, C10: 0.6, C11: 0.6, C14: 0.6, C15: 0.6, G01: 0.6, C18: 0.6 },
    post: { C01: 0.6, C03: 0.8, C05: 1.2, C06: 1.6, C08: 1.0, C09: 3.0, C12: 1.6, C13: 0.8, C14: 1.6, C16: 0.8, C17: 1.2, G01: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, o1b: cue('C01', '仅要求'), ln: L('C02').s, ln2: cue('C02', '每个数据点'), mx: L('C03').s,
    e2: L('C04').s, e2A: cue('C04', 'A的第二列'), e2n: L('C05').s, e2s: cue('C05', '解出'), e2f: L('C06').s, e2r: cue('C06', '画面上'), e2ss: cue('C06', '等于三分之二'), d1: L('D01').s,
    cl: L('C07').s, cl2: cue('C07', '令两个'), cl3: L('C08').s, cl4: cue('C08', '几何和微积分'), wig: L('C09').s, wig2: cue('C09', '仅在最佳位置'),
    q: L('C10').s, q2: cue('C10', 'A就多一列'), e3: L('C11').s, e3n: cue('C11', '正规方程'), e3s: L('C12').s, e3f: cue('C12', '最佳抛物线'), d2: L('D02').s,
    lin: L('C13').s, ov: L('C14').s, ov2: cue('C14', '可那样'), tb: L('C15').s, tb2: cue('C15', '求最佳直线'), tbn: L('C16').s, tbn2: cue('C16', 'A转置A是'), tbs: L('C17').s, tbf: cue('C17', '所以f x'), d3: L('D03').s,
    tj: L('G01').s, tj2: cue('G01', '但概率统计'), sum: L('C18').s, end: L('C19').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('marimba', T.o1 + 0.5, 0.25); TL.sfx('pop', T.ln, 0.3); TL.sfx('pop', T.mx, 0.3);
  TL.sfx('pop', T.e2, 0.3); TL.sfx('pop', T.e2n, 0.3); TL.sfx('ding_hi', T.e2s + 0.5, 0.3); TL.sfx('whoosh', T.e2f, 0.3); TL.sfx('pop', T.e2r, 0.3); TL.sfx('ding', T.e2ss, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.cl, 0.3); TL.sfx('pop', T.cl3, 0.3); TL.sfx('ding_hi', T.cl4, 0.3); TL.sfx('warp', T.wig, 0.35); TL.sfx('ding', T.wig2 + 0.5, 0.3);
  TL.sfx('whoosh', T.q, 0.3); TL.sfx('pop', T.e3, 0.3); TL.sfx('ding_hi', T.e3f + 0.5, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.lin, 0.3); TL.sfx('glitch', T.ov2, 0.3);
  TL.sfx('pop', T.tb, 0.3); TL.sfx('pop', T.tbn, 0.3); TL.sfx('ding_hi', T.tbf + 0.5, 0.32); TL.sfx('pluck', T.d3, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C19').e + 0.3, 0.4);

  // ── 开篇：散点 ──
  const P0 = new Plane({ ox: DX - 380, oy: DY + 250, u: 70, R: 11 });
  const pts0 = [[0.5, 1.2], [1.5, 2.6], [2.5, 2.4], [3.5, 3.9], [4.5, 4.1], [5.5, 5.6], [6.5, 5.5], [7.5, 6.9], [8.5, 7.0]];
  function shotA(D) {
    const a = B.win(T.o1 + 0.1, T.e2 - 0.3); if (a <= 0) return;
    B.grid(P0, I2, a * 0.8, D, { old: 0.08, neu: 0.15, basis: false });
    const f = x => 0.85 + 0.72 * x;
    B.curve(P0, D, f, -1, 11, a * gin(T.o1b), { color: C.peri, width: 5 });
    pts0.forEach(([x, y], i) => { const g = a * gin(T.o1 + 0.4 + i * 0.12); B.sqRes(P0, x, y, f(x), g * gin(T.o1b), { sq: 0 }); B.dot(...P0.S([x, y]), 9, C.i, g); });
    texAt('line', DX + 230, DY - 330, 44, { alpha: a * gin(T.ln) });
    ctag('m 个点 → m 个方程，2 个未知数', DX + 230, DY - 250, { px: 28, a: a * gin(T.ln2), color: C.inkMid });
    const gm = a * gin(T.mx); B.card(DX + 120, DY + 50, 640, 290, gm, C.peri); texAt('sys', DX + 120, DY + 50, 34, { alpha: gm });
  }

  // ── 例 2 + 残差方块 + 摆动 ──
  const P = new Plane({ ox: DX - 330, oy: DY + 280, u: 72, R: 9 });
  const D2 = [[0, 1], [3, 4], [6, 5]];
  function shotB(D) {
    const a = B.win(T.e2 - 0.2, T.q - 0.3); if (a <= 0) return;
    B.grid(P, I2, a * 0.8, D, { old: 0.08, neu: 0.16, basis: false });
    // 直线参数：最佳 c = (4/3, 2/3)；摆动阶段偏离
    let c0 = 4 / 3, c1 = 2 / 3;
    if (B.t > T.wig) { const u = B.t - T.wig, k = 1 - gin(T.wig2 + 0.3, 1.2); c1 += 0.35 * Math.sin(u * 1.6) * k; c0 += 1.0 * Math.sin(u * 1.1 + 1) * k; }
    const f = x => c0 + c1 * x, gl = a * gin(T.e2f);
    B.curve(P, D, f, -1, 9, gl, { color: C.peri, width: 5 });
    const ss = D2.reduce((s, [x, y]) => s + (y - f(x)) ** 2, 0);
    D2.forEach(([x, y], i) => { B.sqRes(P, x, y, f(x), gl * gin(T.e2r), { sq: gin(T.e2r + 0.5) }); B.dot(...P.S([x, y]), 10, C.i, a * gin(T.e2 + 0.4 + i * 0.3)); ctag(`(${x}, ${y})`, P.S([x, y])[0] - 10, P.S([x, y])[1] - 34, { px: 24, a: a * gin(T.e2 + 0.4 + i * 0.3), color: C.i }); });
    const gs = gl * gin(T.e2ss); B.meter(DX + 230, DY - 50, 400, ss, 3, gs, { label: 'Σ rᵢ² =', fmt: v => v.toFixed(3) });
    if (gs > 0 && B.t < T.wig) ctag('= 2/3 最小', DX + 230, DY + 10, { px: 28, a: gs, color: OK, font: F.serif });
    // 公式区
    const gA = a * (1 - gin(T.cl - 0.2));
    texAt('e2A', DX + 200, DY - 350, 32, { alpha: gA * gin(T.e2A) });
    texAt('e2n', DX + 200, DY - 240, 30, { alpha: gA * gin(T.e2n) });
    const gf = gA * gin(T.e2f); texAt('e2f', DX + 200, DY - 150, 32, { alpha: gf });
    // 微积分
    const gc = a * gin(T.cl) * (1 - gin(T.wig - 0.2)); texAt('calc', DX + 180, DY - 340, 32, { alpha: gc * gin(T.cl2) }); texAt('calc2', DX + 180, DY - 220, 32, { alpha: gc * gin(T.cl3) });
    ctag('几何 = 微积分', DX + 230, DY - 130, { px: 34, a: gc * gin(T.cl4), color: OK, font: F.serif });
    ctag('偏离 → 方块变大', DX + 230, DY - 330, { px: 32, a: a * gin(T.wig + 0.3), color: C.free, font: F.serif });
    ctag('最佳：总面积最小', DX + 230, DY - 270, { px: 32, a: a * gin(T.wig2), color: OK, font: F.serif });
  }

  // ── 二次拟合 + 过拟合 ──
  const P2 = new Plane({ ox: DX - 300, oy: DY + 250, u: 95, R: 6 });
  const D3 = [[0, 3], [1, 2], [2, 4], [3, 4]];
  function shotC(D) {
    const a = B.win(T.q - 0.2, T.tb - 0.3); if (a <= 0) return;
    B.grid(P2, I2, a * 0.8, D, { old: 0.08, neu: 0.16, basis: false });
    texAt('quad', DX + 100, DY - 370, 32, { alpha: a * gin(T.q + 0.3) * (1 - gin(T.lin - 0.2)) });
    const pts = a * gin(T.e3); D3.forEach(([x, y], i) => B.dot(...P2.S([x, y]), 10, C.i, pts * gin(T.e3 + 0.3 + i * 0.2)));
    texAt('e3A', DX + 230, DY - 230, 28, { alpha: a * gin(T.e3 + 0.5) * (1 - gin(T.e3s - 0.2)) });
    texAt('e3n', DX + 230, DY - 230, 28, { alpha: a * gin(T.e3s - 0.2) * (1 - gin(T.lin - 0.2)) * gin(T.e3n) });
    const fq = x => 11 / 4 - x / 4 + x * x / 4, gq = a * gin(T.e3f);
    B.curve(P2, D, fq, -1.5, 4.5, gq * (1 - gin(T.ov2) * 0.6), { color: C.peri, width: 5 }); D3.forEach(([x, y]) => B.sqRes(P2, x, y, fq(x), gq * (1 - gin(T.ov2)), { sq: 0.8 }));
    B.card(DX + 230, DY - 90, 440, 90, gq * (1 - gin(T.lin - 0.2)), C.peri); texAt('e3f', DX + 230, DY - 90, 36, { alpha: gq * (1 - gin(T.lin - 0.2)) });
    ctag('换一列 → 换一种曲线', DX + 230, DY + 10, { px: 30, a: a * gin(T.d2) * (1 - gin(T.lin - 0.2)), color: C.ds });
    const gl = a * gin(T.lin) * (1 - gin(T.ov - 0.2)); texAt('lin', DX + 150, DY - 330, 36, { alpha: gl }); ctag('对参数 c 线性就行', DX + 150, DY - 260, { px: 28, a: gl, color: OK });
    // 过拟合：过 4 点的三次插值 + 抖动
    const go = a * gin(T.ov2); if (go > 0) {
      const lag = x => D3.reduce((s, [xi, yi], i) => s + yi * D3.reduce((pp, [xj], j) => j === i ? pp : pp * (x - xj) / (xi - xj), 1), 0);
      B.curve(P2, D, x => lag(x) + 0.25 * Math.sin(x * 9 + B.t * 3) * gin(T.ov2 + 1.0), -1.2, 4.2, go, { color: C.free, width: 4 });
      ctag('n 个点 → n − 1 次多项式穿过：过拟合', DX + 120, DY - 330, { px: 28, a: go, color: C.free });
      ctag('连误差也拟合进去了', DX + 120, DY - 270, { px: 26, a: go, color: C.inkMid });
    }
  }

  // ── TB7 ──
  const P3 = new Plane({ ox: DX - 250, oy: DY + 230, u: 80, R: 6 });
  function shotD(D) {
    const a = B.win(T.tb - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('测验 B · 第 7 题', DX, DY - 390, { px: 32, a, color: C.peri, font: F.serif });
    B.grid(P3, I2, a * 0.8, D, { old: 0.08, neu: 0.16, basis: false, clipY: DY - 220 });
    const pts = [[-1, 1], [1, 3], [2, 3]]; pts.forEach(([x, y], i) => B.dot(...P3.S([x, y]), 10, C.i, a * gin(T.tb + 0.6 + i * 0.25)));
    texAt('tb7', DX + 200, DY - 320, 32, { alpha: a * gin(T.tb + 0.4) });
    // 三步
    const steps = [['① 排 A', T.tbn], ['② AᵀA、Aᵀy', T.tbn2], ['③ 解 2×2', T.tbs]];
    steps.forEach(([s, t0], i) => ctag(s, DX + 330, DY - 160 + i * 60, { px: 28, a: a * gin(t0), color: gin(t0) > 0.5 && B.t < (steps[i + 1]?.[1] ?? T.d3) ? C.peri : C.inkMid }));
    texAt('tb7n', DX + 60, DY - 230, 30, { alpha: a * gin(T.tbn2) });
    const f = x => 13 / 7 + 5 * x / 7, gf = a * gin(T.tbf); B.curve(P3, D, f, -2, 4, gf, { color: C.peri, width: 5 }); pts.forEach(([x, y]) => B.sqRes(P3, x, y, f(x), gf, { sq: 0.7 }));
    B.card(DX + 120, DY + 360, 420, 86, gf, OK); texAt('tb7f', DX + 120, DY + 360, 36, { alpha: gf });
    ctag('三步！', DX + 330, DY + 40, { px: 36, a: a * gin(T.d3), color: C.ds, font: F.serif });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照', DX, DY - 330, { px: 36, a, color: C.gpt, font: F.serif });
    ctag('同济线代很少出拟合题', DX, DY - 240, { px: 30, a: a * gin(T.tj + 0.5), color: C.inkMid });
    const g = a * gin(T.tj2); B.card(DX, DY - 90, 560, 150, g, C.gpt); texAt('tj', DX, DY - 90, 34, { alpha: g }); ctag('概率统计：回归直线斜率', DX, DY + 20, { px: 26, a: g, color: C.gpt });
    ctag('= 正规方程化开', DX, DY + 90, { px: 30, a: a * gin(T.tj2 + 2.0), color: C.peri, font: F.serif });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    ctag('数据拟合 = 最小二乘', DX, DY - 230, { px: 36, a: a * gin(T.sum + 0.3), color: C.ink, font: F.serif });
    ctag('A 的每一列 ↔ 一个基函数', DX, DY - 130, { px: 32, a: a * gin(cue('C18', '每一列')), color: C.i });
    ctag('A 的每一行 ↔ 一个数据点', DX, DY - 60, { px: 32, a: a * gin(cue('C18', '每一行')), color: C.j });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('内积空间', DX, DY - 10, { px: 100, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('函数也有长度和角度', DX, DY + 110, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.ln - 0.2, t1: T.q - 0.3, head: '直线拟合', items: [['y = c₀ + c₁x', T.ln, { color: C.peri, mark: C.peri }], ['A = [1  x]', T.mx], ['例 2：Σrᵢ² = 2/3', T.e2ss, { color: OK, mark: OK }], ['偏导 = 正规方程', T.cl3], ['方块面积最小', T.wig]] },
    { t0: T.q - 0.3, t1: T.end - 0.3, head: '推广与练习', items: [['二次：多一列 x²', T.q], ['例 3 抛物线', T.e3s, { color: C.peri, mark: C.peri }], ['别贪高次', T.ov, { color: C.free, mark: C.free }], ['TB7：13/7 + 5x/7', T.tbf, { color: OK, mark: OK }], ['同济：回归直线', T.tj, { color: C.gpt, mark: C.gpt }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(D); shotD(D); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
