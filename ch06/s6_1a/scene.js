// 第 6 章 6.1（上）方向不变的向量（Leon 9th §6.1）。
// 分镜：婚姻的例子（柱状图逐年迭代 → 稳态）→ 两个特别向量 x₁、x₂（平面上：x₁ 不动、x₂ 减半）→ 拆分 w₀ 并迭代收敛
//       → 定义 Ax = λx → 3B1B：网格变形，样本向量离开原线、特征向量留在线上 → 例 2 → 零向量 → (A − λI)x = 0、特征空间、特征方程 → 五条等价 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.1 方向不变的向量', hi: 3, en: 'EIGENVALUES',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C05: 0.6, C09: 0.6, C10: 0.4, C11: 0.6, C14: 0.6, C17: 0.4, G01: 0.6, C18: 0.6 },
    post: { C01: 0.6, C03: 0.8, C04: 1.4, C06: 0.8, C08: 1.4, C10: 2.4, C11: 0.8, C13: 0.6, C16: 0.6, C17: 1.0, G02: 0.6, C18: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, ex: L('C02').s, ex2: cue('C02', '现在已婚'), w0: L('C03').s, w1: cue('C03', '一年以后'), wA: cue('C03', 'A的第一列'), w1c: cue('C03', '算出来是'),
    it: L('C04').s, it10: cue('C04', '第十年'), it12: cue('C04', '第十二年起'), d1: L('D01').s,
    x1: L('C05').s, x1b: cue('C05', 'A乘x一'), x2: L('C06').s, x2b: cue('C06', '乘完方向不变'), dec: L('C07').s, dec2: cue('C07', '每乘一次A'),
    wn: L('C08').s, wn2: cue('C08', '第二项越来越小'), d2: L('D02').s,
    def: L('C09').s, def2: cue('C09', '就说拉姆达'), fan: L('C10').s, fan2: cue('C10', '只有特征向量'), fan3: cue('C10', '只被拉长'),
    e2: L('C11').s, e2c: cue('C11', 'A乘x'), e2d: cue('C11', '所以拉姆达'), mul: L('C12').s, mul2: cue('C12', '所以'), d3: L('D03').s, z: L('C13').s, z2: cue('C13', '特征向量必须非零'),
    sh: L('C14').s, sh2: cue('C14', '拉姆达是特征值'), es: L('C15').s, es2: cue('C15', '叫作属于'), ce: L('C16').s, ce2: cue('C16', '也就是'), ce3: cue('C16', '叫作特征方程'),
    five: L('C17').s, tj: L('G01').s, tj2: L('G02').s, sum: L('C18').s, sum2: cue('C18', '求法'), end: L('C19').s,
  };
  const F5 = ['拉姆达是特征值', '齐次方程组有非零解', '零空间不只有零向量', 'A减拉姆达I奇异', '它的行列式等于零'].map(s => cue('C17', s));
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.ex2, 0.3); TL.sfx('pop', T.w0, 0.3); TL.sfx('pop', T.w1c, 0.3); TL.sfx('riser', T.it, 0.25); TL.sfx('ding_hi', T.it12 + 0.4, 0.32); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('whoosh', T.x1, 0.3); TL.sfx('ding', T.x1b + 0.6, 0.3); TL.sfx('pop', T.x2, 0.3); TL.sfx('ding_lo', T.x2b, 0.3); TL.sfx('pop', T.dec, 0.3); TL.sfx('tick', T.dec2, 0.25); TL.sfx('shimmer', T.wn2, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('sting', T.def2, 0.3); TL.sfx('warp', T.fan + 0.6, 0.35); TL.sfx('sparkle', T.fan2, 0.3); TL.sfx('pop', T.e2, 0.3); TL.sfx('ding_hi', T.e2d, 0.3); TL.sfx('pop', T.mul, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('stamp', T.z, 0.3);
  TL.sfx('whoosh', T.sh, 0.3); TL.sfx('pop', T.es, 0.3); TL.sfx('pop', T.ce, 0.3); TL.sfx('ding_hi', T.ce3, 0.3); F5.forEach(t => TL.sfx('pluck', t, 0.24)); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C19').e + 0.3, 0.4);

  const A = [[0.7, 0.2], [0.3, 0.8]];
  const step = w => [A[0][0] * w[0] + A[0][1] * w[1], A[1][0] * w[0] + A[1][1] * w[1]];
  const W = [[8000, 2000]]; for (let i = 0; i < 14; i++) W.push(step(W[i]));
  const fmt = v => Math.round(v).toString();

  // ── A：婚姻的例子，柱状图逐年迭代 ──
  function shotA() {
    const a = B.win(T.ex - 0.2, T.x1 - 0.3); if (a <= 0) return;
    ctag('已婚', DX - 120, DY - 330, { px: 30, a: a * gin(T.ex + 0.3), color: C.peri }); ctag('单身', DX + 120, DY - 330, { px: 30, a: a * gin(T.ex + 0.3), color: C.j });
    const g = a * gin(T.ex2);
    let n = 0; if (B.t > T.w1c) n = 1; const ni = prog(B.t, T.it, T.it12 + 0.4); if (ni > 0) n = 1 + ni * 11;
    const k = Math.min(13, Math.floor(n)), f = smooth(n - k), w = [lerp(W[k][0], W[k + 1][0], f), lerp(W[k][1], W[k + 1][1], f)];
    B.bars(DX, DY + 60, w, 9000, g, { cols: [C.peri, C.j], w: 150, gap: 90, hMax: 330, fmt });
    ctag(`第 ${Math.floor(n)} 年`, DX + 330, DY - 220, { px: 40, a: g, color: C.ink, font: F.serif });
    if (B.t > T.it12) { const gl = a * gin(T.it12); B.line2([DX - 330, DY + 60 - 330 * 4000 / 9000], [DX + 330, DY + 60 - 330 * 4000 / 9000], C.peri, gl * 0.6, 2, [8, 8]); B.line2([DX - 330, DY + 60 - 330 * 6000 / 9000], [DX + 330, DY + 60 - 330 * 6000 / 9000], C.j, gl * 0.6, 2, [8, 8]); }
    texAt('marr', DX, DY + 200, 34, { alpha: a * gin(T.w0) });
    texAt('w1', DX, DY + 300, 34, { alpha: a * gin(T.w1c) * (1 - gin(T.it10)) });
    texAt('w10', DX, DY + 300, 34, { alpha: a * gin(T.it10) });
    ctag('停下来了？', DX, DY - 400, { px: 40, a: a * gin(T.d1), color: C.ds, font: F.serif });
  }

  // ── B：x₁ 不动，x₂ 减半；拆分 w₀，迭代收敛 ──
  const P = new Plane({ ox: DX + 60, oy: DY + 120, u: 76, R: 7 });
  function shotB(D) {
    const a = B.win(T.x1 - 0.2, T.def - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.x1b, T.x1b + 1.4)) * (1 - smoother(prog(B.t, T.x2b + 1.0, T.x2b + 2.2)));
    const s2 = smoother(prog(B.t, T.x2b - 0.6, T.x2b + 0.8)) * (1 - smoother(prog(B.t, T.x2b + 1.0, T.x2b + 2.2)));
    const sm = Math.max(s, s2);
    B.warp(P, A, sm, a, D, { basis: false, neu: 0.35, clipY: DY - 300 });
    const Ms = lerpM(I2, A, sm);
    B.lineD(P, D, [2 / Math.hypot(2, 3), 3 / Math.hypot(2, 3)], a * 0.7, { color: C.i, dash: [12, 10] });
    B.lineD(P, D, [-1 / Math.SQRT2, 1 / Math.SQRT2], a * gin(T.x2) * 0.7, { color: C.j, dash: [12, 10] });
    B.vec(P, [2, 3], a * gin(T.x1 + 0.4), { color: C.i, label: 'x₁', lx: 20 });
    if (gin(T.x2) > 0) { const e = P.S([-1, 1], Ms); arrow(ctx, P.S([0, 0]), e, { color: C.j, width: 8, head: 24, alpha: a * gin(T.x2) }); ctag('x₂', e[0] - 34, e[1] - 20, { px: 34, a: a * gin(T.x2), color: C.j, font: F.serif }); }
    texAt('ax1', DX, DY - 380, 34, { alpha: a * gin(T.x1b) });
    texAt('ax2', DX, DY - 300, 34, { alpha: a * gin(T.x2) });
    // 拆分：w₀ / 2000 = (4, 1) = x₁ − 2x₂
    const gd = a * gin(T.dec); if (gd <= 0) return;
    const nIt = prog(B.t, T.dec2, T.wn2 + 2.0) * 8, kk = Math.floor(nIt), ff = smooth(nIt - kk);
    const c2 = -2 * Math.pow(0.5, kk + ff);
    const wv = [2 + c2 * -1, 3 + c2 * 1];
    B.vec(P, [2, 3], gd * 0.9, { color: C.i, width: 6 });
    B.vec(P, [c2 * -1, c2 * 1], gd, { color: C.j, width: 6, from: [2, 3] });
    B.vec(P, wv, gd, { color: C.ink, width: 8, label: kk + ff < 0.05 ? 'w₀ / 2000' : 'wₙ / 2000', lx: 30, ly: 10, px: 28 });
    for (let i = 0; i <= kk && i < 8; i++) { const ci = -2 * Math.pow(0.5, i); B.dot(...P.S([2 - ci, 3 + ci]), 6, C.peri, gd * 0.8); }
    texAt('w0d', DX, DY - 220, 32, { alpha: gd });
    texAt('wn', DX, DY + 255, 30, { alpha: a * gin(T.wn) });
    ctag('n → ∞：只剩 x₁ 方向', DX, DY + 320, { px: 28, a: a * gin(T.wn2), color: C.peri });
  }

  // ── C：定义 + 3B1B 网格变形扇形 ──
  const M2 = [[4, -2], [1, 1]];
  const P2 = new Plane({ ox: DX, oy: DY + 60, u: 58, R: 10 });
  function shotC(D) {
    const a = B.win(T.def - 0.2, T.sh - 0.3); if (a <= 0) return;
    const gdef = a * gin(T.def + 0.3); B.card(DX, DY - 390, 640, 90, gdef, C.peri); texAt('def', DX, DY - 390, 38, { alpha: gdef });
    ctag('λ：特征值    x：特征向量', DX, DY - 310, { px: 30, a: a * gin(T.def2), color: C.inkMid });
    const gf = a * gin(T.fan); if (gf <= 0) return;
    const s = smoother(prog(B.t, T.fan + 0.6, T.fan + 3.0)) * (1 - smoother(prog(B.t, T.e2 - 0.2, T.e2 + 0.8)) * 0) ;
    const eig = [{ d: [2, 1], col: C.i, label: '×3' }, { d: [1, 1], col: C.j, label: '×2' }];
    B.eigFan(P2, M2, s, gf, D, { fan: 16, r: 1.1, eig, lines: gin(T.fan2), hot: Math.max(0.35, gin(T.fan2)), clipY: DY - 260 });
    ctag('大多数向量：离开原来的直线', DX - 250, DY + 400, { px: 26, a: gf * gin(T.fan + 1.5), color: C.inkMid });
    ctag('特征向量：只伸缩', DX + 260, DY + 400, { px: 26, a: gf * gin(T.fan3), color: C.i });
    // 例 2
    const g2 = a * gin(T.e2); if (g2 <= 0) return;
    B.card(DX + 160, DY - 200, 640, 90, g2 * gin(T.e2c), C.i); texAt('e2', DX + 160, DY - 200, 32, { alpha: g2 * gin(T.e2c) });
    texAt('e2b', DX + 160, DY - 110, 32, { alpha: a * gin(T.mul + 0.6) });
    ctag('整条直线（去掉零）', DX + 160, DY - 50, { px: 26, a: a * gin(T.mul2), color: C.i });
    const gz = a * gin(T.d3); if (gz <= 0) return;
    B.card(DX - 280, DY + 280, 360, 80, gz, C.free); texAt('zero', DX - 280, DY + 280, 28, { alpha: gz });
    B.cross(DX - 280, DY + 280, prog(B.t, T.z, T.z + 0.4), gz, 36);
    ctag('特征向量 ≠ 0，特征值可以 = 0', DX + 120, DY + 330, { px: 28, a: a * gin(T.z2), color: OK });
  }

  // ── D：(A − λI)x = 0 → 特征空间 → 特征方程 → 五条等价 ──
  function shotD() {
    const a = B.win(T.sh - 0.2, T.tj - 0.3); if (a <= 0) return;
    texAt('def', DX, DY - 380, 36, { alpha: a * gin(T.sh) });
    ctag('移项 ↓', DX, DY - 320, { px: 28, a: a * gin(T.sh + 0.8), color: C.inkMid });
    B.card(DX, DY - 255, 520, 86, a * gin(T.sh + 1.2), C.peri); texAt('shift', DX, DY - 255, 38, { alpha: a * gin(T.sh + 1.2) });
    ctag('有非零解？', DX + 380, DY - 255, { px: 28, a: a * gin(T.sh2), color: C.ds });
    const ge = a * gin(T.es) * (1 - gin(T.five - 0.2));
    texAt('espace', DX - 200, DY - 120, 38, { alpha: ge }); ctag('= 特征空间（子空间）', DX + 110, DY - 120, { px: 30, a: ge * gin(T.es2), color: C.j });
    const gc = a * gin(T.ce) * (1 - gin(T.five - 0.2));
    ctag('奇异 ⇔', DX - 230, DY + 10, { px: 32, a: gc * gin(T.ce2), color: C.inkMid }); texAt('chareq', DX + 40, DY + 10, 40, { alpha: gc * gin(T.ce2) });
    ctag('只含 λ 的方程：特征方程', DX, DY + 100, { px: 32, a: gc * gin(T.ce3), color: C.peri, font: F.serif });
    const gf = a * gin(T.five - 0.2); if (gf <= 0) return;
    const items = ['λ 是 A 的特征值', '(A − λI)x = 0 有非零解', 'N(A − λI) ≠ {0}', 'A − λI 奇异', 'det(A − λI) = 0'];
    items.forEach((s, i) => { const y = DY - 140 + i * 82, gi = gf * gin(F5[i]); B.card(DX, y, 560, 64, gi, i === 4 ? C.peri : C.inkMid); ctag(s, DX, y, { px: 32, a: gi, color: i === 4 ? C.peri : C.ink, font: F.serif }); if (i) ctag('⇕', DX - 320, y - 41, { px: 30, a: gi, color: C.inkMid }); });
  }

  // ── E：同济 + 小结 + 下一节 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章第二节', DX, DY - 300, { px: 34, a: g1, color: C.gpt });
    B.card(DX, DY - 180, 480, 96, g1 * gin(T.tj + 1.0), C.gpt); texAt('tj', DX, DY - 180, 40, { alpha: g1 * gin(T.tj + 1.0) });
    ctag('单位阵记作 E', DX, DY - 90, { px: 30, a: g1 * gin(T.tj + 1.0), color: C.inkMid });
    ctag('特征向量 ≠ 0', DX - 180, DY + 60, { px: 40, a: g1 * gin(T.tj2), color: C.free, font: F.serif });
    ctag('特征值可以 = 0', DX + 180, DY + 60, { px: 40, a: g1 * gin(T.tj2 + 1.2), color: OK, font: F.serif });
    ctag('判断题高频！', DX, DY + 160, { px: 32, a: g1 * gin(cue('G02', '判断题')), color: C.peri });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    texAt('def', DX, DY - 250, 44, { alpha: g2 });
    ctag('方向不变的非零向量 · 伸缩倍数', DX, DY - 160, { px: 32, a: g2, color: C.inkMid });
    ctag('① 解 det(A − λI) = 0 → λ', DX, DY - 30, { px: 36, a: g2 * gin(T.sum2), color: C.peri, font: F.serif });
    ctag('② 解 (A − λI)x = 0 → x', DX, DY + 50, { px: 36, a: g2 * gin(T.sum2 + 1.6), color: C.j, font: F.serif });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('特征多项式', DX, DY - 20, { px: 88, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('迹 · 行列式 · 相似', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.ex - 0.2, t1: T.def - 0.3, head: '一个老例子', items: [['每年乘一次 A', T.w0], ['人数停在 (4000, 6000)', T.it12], ['x₁：乘完不动', T.x1b, { color: C.i }], ['x₂：乘完减半', T.x2b, { color: C.j }], ['拆开 → 第二项消失', T.wn2, { color: C.peri }]] },
    { t0: T.def - 0.2, t1: T.sh - 0.3, head: '特征值与特征向量', items: [['Ax = λx，x ≠ 0', T.def], ['方向不变，只伸缩', T.fan3, { color: C.i }], ['例 2：λ = 3', T.e2d], ['倍数也是：整条直线', T.mul2], ['特征值可以是 0', T.z2, { color: OK }]] },
    { t0: T.sh - 0.2, t1: T.tj - 0.3, head: '怎么找', items: [['(A − λI)x = 0', T.sh], ['解集 = 特征空间', T.es2, { color: C.j }], ['det(A − λI) = 0', T.ce2, { color: C.peri }], ['五条等价', T.five]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['先求 λ，再求 x', T.sum2, { color: C.peri }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(D); shotC(D); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
