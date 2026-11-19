// 第 6 章 复习（下）计算题、同济题型与小结（Leon 9th Chapter 6 Test B 第 1、5、7 题 + 同济三题型 + 全章地图 + 第七章预告）。
// 分镜：TB1 特征值 → D⁷ = D ⇒ A⁷ = A → TB5 主子式 4、36、144 → LDLᵀ → 乔列斯基（整数因子）→ TB7 拆 Y₀ + 稳定结点相图
//       → 同济：不可 / 可对角化（n − r 计几何重数）→ 正交变换化标准形 → 全章地图逐节点亮 → 下一集：数值线性代数。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, rgba } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 复习', title: '计算题与全章小结', hi: 3, en: 'CHAPTER TEST B · SUMMARY',
    titleEnd: () => B.L('C02').s, titlePx: 92,
    pre: { C02: 0.6, C04: 0.4, C05: 0.8, C08: 0.8, G01: 0.8, G02: 0.6, G03: 0.8, C11: 0.8, C12: 0.4, C15: 0.6, C16: 0.6 },
    post: { C01: 0.6, C03: 0.8, C04: 1.4, C06: 0.8, C07: 1.4, C09: 0.8, C10: 1.6, G01: 1.0, G02: 1.0, G04: 1.0, C12: 0.8, C13: 0.8, C14: 1.0, C16: 2.0 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, t1: L('C02').s, t1p: L('C03').s, t1v: cue('C03', '特征向量分别是'), d1: L('D01').s, t1d: L('C04').s, t1d2: cue('C04', 'D的七次方就是D'), t1d3: cue('C04', '所以A的七次方等于A'),
    t5: L('C05').s, t5m: L('C06').s, t5m2: cue('C06', '消元的乘数'), t5c: L('C07').s, t5c2: cue('C07', '主元都是完全平方数'),
    t7: L('C08').s, t7e: L('C09').s, t7e2: cue('C09', '把Y零拆开'), t7y: L('C10').s, t7y2: cue('C10', '两个分量的式子'), t7y3: cue('C10', '两个特征值都为负'),
    g1: L('G01').s, g1b: cue('G01', 'A减E的秩是二'), g1c: cue('G01', '所以不能对角化'), g2: L('G02').s, g2b: cue('G02', 'A减二E的秩是一'), g2c: cue('G02', '可以对角化'), d2: L('D02').s,
    g3: L('G03').s, g4: L('G04').s, g4b: cue('G04', '正惯性指数是二'),
    m0: L('C11').s, m1: L('C12').s, m1b: cue('C12', '用特征方程'), m1c: cue('C12', '特征值之积'), m2: L('C13').s, m2b: cue('C13', 'A的n次方'), m3: L('C14').s, m3b: cue('C14', '由此把二次型'), m3c: cue('C14', '非方阵'), d3: L('D03').s,
    fin: L('C15').s, nx: L('C16').s, nx2: cue('C16', '这一章的特征值'),
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', T.t1, 0.3); TL.sfx('pop', T.t1p, 0.3); TL.sfx('pop', T.t1v, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.t1d, 0.3); TL.sfx('ding_hi', T.t1d3, 0.32);
  TL.sfx('whoosh', T.t5, 0.3); TL.sfx('check', T.t5m + 1.5, 0.3); TL.sfx('pop', T.t5m2, 0.3); TL.sfx('ding_hi', T.t5c, 0.3); TL.sfx('sparkle', T.t5c2, 0.3);
  TL.sfx('whoosh', T.t7, 0.3); TL.sfx('pop', T.t7e, 0.3); TL.sfx('pop', T.t7e2, 0.3); TL.sfx('pop', T.t7y, 0.3); TL.sfx('swoosh_soft', T.t7y3, 0.3);
  TL.sfx('bell_soft', T.g1, 0.3); TL.sfx('stamp', T.g1c, 0.3); TL.sfx('pop', T.g2, 0.3); TL.sfx('ding_hi', T.g2c, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.g3, 0.3); TL.sfx('ding_hi', T.g4, 0.3);
  TL.sfx('swoosh_in', T.m0, 0.3); TL.sfx('pop', T.m1, 0.3); TL.sfx('pop', T.m2, 0.3); TL.sfx('pop', T.m3, 0.3); TL.sfx('pop', T.m3c, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('sting', T.fin, 0.3); TL.sfx('riser', T.nx, 0.25); TL.sfx('shimmer', L('C16').e + 0.3, 0.4);

  // ── A：开场 + TB1 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.t5 - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.t1 - 0.2));
    [['英文教材计算题 × 3', C.peri], ['同济题型 × 3', C.gpt], ['整章串成一条线', OK]].forEach(([s, col], i) => ctag(s, DX, DY - 100 + i * 90, { px: 40, a: g0 * gin(T.o + 0.5 + i * 0.8), color: col, font: F.serif }));
    const g = a * gin(T.t1 - 0.2); if (g <= 0) return;
    ctag('测验 B 第 1 题', DX, DY - 390, { px: 32, a: g, color: C.peri });
    texAt('tb1A', DX, DY - 290, 32, { alpha: g, reveal: rv(T.t1, 4.0) });
    texAt('tb1p', DX, DY - 170, 34, { alpha: a * gin(T.t1p) });
    texAt('tb1v', DX, DY - 60, 30, { alpha: a * gin(T.t1v) });
    ctag('乘七次？', DX + 300, DY + 40, { px: 32, a: a * gin(T.d1) * (1 - gin(T.t1d)), color: C.ds });
    texAt('tb1d', DX, DY + 110, 32, { alpha: a * gin(T.t1d), reveal: rv(T.t1d, 6.0) });
    B.stamp(DX + 300, DY + 260, true, prog(B.t, T.t1d3, T.t1d3 + 0.4), a, 'A⁷ = A');
  }

  // ── B：TB5 ──
  function shotB() {
    const a = B.win(T.t5 - 0.2, T.t7 - 0.3); if (a <= 0) return;
    ctag('测验 B 第 5 题', DX, DY - 390, { px: 32, a, color: C.peri });
    texAt('tb5A', DX, DY - 280, 32, { alpha: a * gin(T.t5), reveal: rv(T.t5m, 3.0) });
    ctag('顺序主子式全正 ⇒ 正定', DX, DY - 180, { px: 30, a: a * gin(T.t5m + 1.5), color: OK });
    texAt('tb5l', DX, DY - 50, 30, { alpha: a * gin(T.t5m2), reveal: rv(T.t5m2, 3.0) });
    B.card(DX, DY + 120, 400, 140, a * gin(T.t5c), C.peri); texAt('tb5c', DX, DY + 120, 34, { alpha: a * gin(T.t5c) });
    ctag('主元 4、9、4 都是完全平方数 → 整数因子', DX, DY + 250, { px: 28, a: a * gin(T.t5c2), color: C.i });
  }

  // ── C：TB7 + 相图 ──
  const A7 = [[1, -2], [3, -4]];
  const P = new Plane({ ox: DX + 230, oy: DY + 170, u: 62, R: 4 });
  function shotC(D) {
    const a = B.win(T.t7 - 0.2, T.g1 - 0.3); if (a <= 0) return;
    ctag('测验 B 第 7 题', DX, DY - 390, { px: 32, a, color: C.peri });
    texAt('tb7A', DX, DY - 300, 32, { alpha: a * gin(T.t7) });
    texAt('tb7e', DX, DY - 200, 30, { alpha: a * gin(T.t7e) });
    texAt('tb7d', DX - 200, DY - 100, 30, { alpha: a * gin(T.t7e2) });
    B.card(DX - 230, DY + 140, 400, 130, a * gin(T.t7y2), C.peri); texAt('tb7y', DX - 230, DY + 140, 32, { alpha: a * gin(T.t7y2) });
    const g = a * gin(T.t7e2); if (g <= 0) return;
    ctx.save(); B.K.clip(D); ctx.beginPath(); ctx.rect(DX - 20, DY - 60, 600, 600); ctx.clip(); P.grid(ctx, { M: I2, color: C.gridOld, width: 1, alpha: 0.12 * g }); P.axes(ctx, { color: C.ink, width: 2, alpha: 0.4 * g }); ctx.restore();
    const DD = { x: P.ox, y: P.oy, r: 240 };
    B.lineD(P, DD, [Math.SQRT1_2, Math.SQRT1_2], g * 0.7, { color: C.i, dash: [10, 8] }); B.lineD(P, DD, [2 / Math.sqrt(13), 3 / Math.sqrt(13)], g * 0.7, { color: C.j, dash: [10, 8] });
    const ring = Array.from({ length: 10 }, (_, i) => [3.4 * Math.cos(i * 0.628 + 0.2), 3.4 * Math.sin(i * 0.628 + 0.2)]);
    B.flow(P, DD, A7, g * gin(T.t7y), { starts: ring, T: 4, n: 160, grow: prog(B.t, T.t7y, T.t7y + 4), color: C.inkMid, dot: 0.8 });
    B.flow(P, DD, A7, g * gin(T.t7y), { starts: [[1, 2]], T: 4, n: 160, grow: prog(B.t, T.t7y, T.t7y + 4), color: C.peri, width: 4, dot: 1 });
    B.dot(...P.S([1, 2]), 9, C.peri, g); ctag('Y₀', P.S([1, 2])[0] + 30, P.S([1, 2])[1] - 10, { px: 26, a: g, color: C.peri, font: F.serif });
    ctag('λ < 0：衰减到 0', P.ox, DY + 430, { px: 28, a: a * gin(T.t7y3), color: OK });
  }

  // ── D：同济题型 ──
  function shotD() {
    const a = B.win(T.g1 - 0.2, T.m0 - 0.3); if (a <= 0) return;
    const g1 = a * (1 - gin(T.g3 - 0.2));
    ctag('同济题型', DX, DY - 390, { px: 32, a: g1, color: C.gpt });
    texAt('tj1', DX, DY - 290, 30, { alpha: g1 * gin(T.g1), reveal: rv(T.g1, 3.0) });
    ctag('n − r = 3 − 2 = 1 < 2', DX - 120, DY - 190, { px: 30, a: g1 * gin(T.g1b), color: C.free, font: F.serif });
    B.stamp(DX + 300, DY - 190, false, prog(B.t, T.g1c, T.g1c + 0.4), g1, '不可');
    texAt('tj2', DX, DY - 50, 30, { alpha: g1 * gin(T.g2), reveal: rv(T.g2, 3.0) });
    ctag('n − r = 3 − 1 = 2 = 2', DX - 120, DY + 50, { px: 30, a: g1 * gin(T.g2b), color: OK, font: F.serif });
    B.stamp(DX + 300, DY + 50, true, prog(B.t, T.g2c, T.g2c + 0.4), g1, '可以');
    B.card(DX, DY + 190, 560, 80, g1 * gin(T.d2), C.ds); ctag('几何重数 = n − r(A − λE)', DX, DY + 190, { px: 34, a: g1 * gin(T.d2), color: C.ds, font: F.serif });
    const g2 = a * gin(T.g3 - 0.2); if (g2 <= 0) return;
    ctag('正交变换化标准形', DX, DY - 300, { px: 36, a: g2, color: C.gpt, font: F.serif });
    texAt('tj3', DX, DY - 170, 30, { alpha: g2 * gin(T.g4), reveal: rv(T.g4, 4.0) });
    ctag('λ = −2，1，1', DX, DY - 60, { px: 34, a: g2 * gin(T.g4), color: C.ink, font: F.serif });
    ctag('正惯性 2 · 负惯性 1 → 不定', DX, DY + 40, { px: 34, a: g2 * gin(T.g4b), color: C.free, font: F.serif });
  }

  // ── E：全章地图 ──
  const NODES = [
    { k: 'c', x: 0, y: -300, t: 'Ax = λx', col: C.peri, at: () => T.m1, big: 1 },
    { k: 'p', x: -330, y: -170, t: 'det(A−λI) = 0', col: C.ink, at: () => T.m1b },
    { k: 'tr', x: 330, y: -170, t: '积 = det · 和 = tr', col: C.ink, at: () => T.m1c },
    { k: 'dg', x: 0, y: -60, t: '对角化 A = XDX⁻¹', col: C.i, at: () => T.m2, big: 1 },
    { k: 'an', x: -360, y: 60, t: 'Aⁿ · 马尔可夫', col: C.i, at: () => T.m2b },
    { k: 'et', x: 360, y: 60, t: 'eᵗᴬ · Y′ = AY', col: C.i, at: () => T.m2b + 1.0 },
    { k: 'sy', x: 0, y: 150, t: '对称：A = QDQᵀ', col: C.j, at: () => T.m3, big: 1 },
    { k: 'qf', x: -340, y: 270, t: '二次型 · 正定', col: C.j, at: () => T.m3b },
    { k: 'sv', x: 340, y: 270, t: 'SVD：转 · 拉 · 转', col: C.k, at: () => T.m3c },
  ];
  const EDGES = [['c', 'p'], ['c', 'tr'], ['c', 'dg'], ['dg', 'an'], ['dg', 'et'], ['dg', 'sy'], ['sy', 'qf'], ['sy', 'sv']];
  function shotE() {
    const a = B.win(T.m0 - 0.2, 1e9); if (a <= 0) return;
    const gm = a * (1 - gin(T.nx - 0.2)); if (gm > 0) {
      ctag('第六章 · 一条线', DX, DY - 400, { px: 32, a: gm * gin(T.m0), color: C.inkMid });
      const pos = n => [DX + n.x, DY + n.y + 20];
      EDGES.forEach(([f, t]) => { const nf = NODES.find(n => n.k === f), nt = NODES.find(n => n.k === t), g = gm * gin(nt.at(), 0.6); B.line2(pos(nf), pos(nt), nt.col, g * 0.6, 3); });
      NODES.forEach(n => { const g = gm * gin(n.at(), 0.5), [x, y] = pos(n), w = n.big ? 420 : 330; B.card(x, y, w, n.big ? 74 : 64, g, n.col); ctag(n.t, x, y, { px: n.big ? 32 : 26, a: g, color: n.big ? n.col : C.ink, font: F.serif }); });
      ctag('找到不转向的方向，矩阵就只剩伸缩', DX, DY + 400, { px: 32, a: gm * gin(T.d3), color: C.ds, font: F.serif });
    }
    const gn = a * gin(T.nx - 0.2); if (gn <= 0) return;
    ctag('第六章 完', DX, DY - 300, { px: 34, a: gn * (1 - gin(T.nx + 1.0)), color: C.inkMid });
    ctag('下一集 · 第七章', DX, DY - 160, { px: 34, a: gn * gin(T.nx + 0.5), color: C.inkMid });
    ctag('数值线性代数', DX, DY - 50, { px: 88, a: gn * gin(T.nx + 0.9, 0.5), color: C.peri, font: F.serif });
    ctag('特征值 · 奇异值：计算机怎么算？', DX, DY + 70, { px: 34, a: gn * gin(T.nx2), color: C.ink });
  }

  const SECS = [
    { t0: T.t1 - 0.2, t1: T.g1 - 0.3, head: '计算题', items: [['TB1：A⁷ = A', T.t1d3, { color: C.peri }], ['TB5：4、36、144', T.t5m], ['乔列斯基：整数因子', T.t5c2], ['TB7：Y₀ = −x₁ + x₂', T.t7e2], ['λ < 0：衰减', T.t7y3, { color: OK }]] },
    { t0: T.g1 - 0.2, t1: T.m0 - 0.3, head: '同济题型', items: [['重根：看 n − r', T.g1b], ['题型一：不可对角化', T.g1c, { color: C.free }], ['题型二：可以', T.g2c, { color: OK }], ['题型三：标准形', T.g4]] },
    { t0: T.m0 - 0.2, t1: 1e9, head: '全章', items: [['特征方程 → 特征向量', T.m1b], ['对角化：各算各的', T.m2], ['对称：谱定理', T.m3, { color: C.j }], ['SVD：任何矩阵', T.m3c, { color: C.k }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(); shotC(D); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
