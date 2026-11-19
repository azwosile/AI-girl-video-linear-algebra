// 第 7 章 7.3 主元策略（Leon 9th §7.3：例 1 行号向量 p、PA = LU、例 2 三步求解、例 3 小主元灾难、部分主元 / 完全主元）。
// 分镜：数字矩阵 + 旁边的行号向量 p 跳动 → 按 p 读出上三角 → PA = LU → 三步求解
//       → 3B1B：两条直线交于 (1, 2)，小主元算出的点被甩到 (0, 2)，换行后落回 → 列里挑最大 → 完全主元扫整块子阵 → 同济 vs 电脑 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, Plane } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.3 主元策略', hi: 3, en: 'PIVOTING STRATEGIES',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C05: 0.6, C06: 0.6, C07: 0.6, C10: 0.6, C11: 0.4, C13: 0.6, G01: 0.6, C15: 0.6 },
    post: { C01: 0.6, C03: 1.0, C04: 1.4, C05: 1.2, C06: 1.4, C07: 0.8, C08: 1.2, C09: 1.2, C10: 1.2, C11: 1.0, C12: 0.8, C13: 1.0, C14: 1.0, G02: 0.6, C15: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, e1: L('C02').s, e1b: cue('C02', '选第三行'), pv: L('C03').s, pv2: cue('C03', '开始p是'), pv3: cue('C03', '变成三二一'), el: L('C04').s, el2: cue('C04', '乘数分别是三和二'), el3: cue('C04', '第二步'), el4: cue('C04', '按p等于三一二'),
    pa: L('C05').s, pa2: cue('C05', '于是P乘A'), e2: L('C06').s, e2b: cue('C06', '先重排'), e2c: cue('C06', '前代'), e2d: cue('C06', '回代'), d1: L('D01').s,
    e3: L('C07').s, e3b: cue('C07', '精确解'), e3c: cue('C07', '直接拿'), bad: L('C08').s, bad2: cue('C08', '乘数是一万'), bad3: cue('C08', 'x二等于二'), bad4: cue('C08', '错了百分之百'),
    why: L('C09').s, why2: cue('C09', '那个一被舍掉了'), why3: cue('C09', '放大了一万倍'), good: L('C10').s, good2: cue('C10', '第二行变成'), good3: cue('C10', '完全正确'), d2: L('D02').s,
    pp: L('C11').s, pp2: cue('C11', '选绝对值最大'), pp3: cue('C11', '都不超过一'), st: L('C12').s, st2: cue('C12', '带部分主元的L U分解'), cp: L('C13').s, cp2: cue('C13', '行和列都要换'), wn: L('C14').s,
    tj: L('G01').s, tj2: cue('G01', '电脑正相反'), tj3: L('G02').s, sum: L('C15').s, end: L('C16').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.e1, 0.3); TL.sfx('pop', T.e1b, 0.3); TL.sfx('click', T.pv2, 0.3); TL.sfx('click', T.pv3, 0.3); TL.sfx('whoosh', T.el2, 0.3); TL.sfx('whoosh', T.el3, 0.3); TL.sfx('ding', T.el4, 0.3);
  TL.sfx('sting', T.pa2, 0.3); TL.sfx('pop', T.e2b, 0.3); TL.sfx('pop', T.e2c, 0.3); TL.sfx('ding_hi', T.e2d, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.e3, 0.3); TL.sfx('pop', T.e3c, 0.3); TL.sfx('impact', T.bad2, 0.3); TL.sfx('buzz', T.bad4, 0.25); TL.sfx('crack', T.why2, 0.3); TL.sfx('warp', T.good, 0.3); TL.sfx('ding_hi', T.good3, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('sting', T.pp, 0.3); TL.sfx('pop', T.pp2, 0.3); TL.sfx('ding', T.pp3, 0.3); TL.sfx('pop', T.st2, 0.3); TL.sfx('pop', T.cp, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C16').e + 0.3, 0.4);

  // ── A：例 1、例 2 ──
  const A0 = [[6, -4, 2], [4, 2, 1], [2, -1, 1]], A1 = [[0, -1, -1], [0, 4, -1], [2, -1, 1]], A2 = [[0, -1, -1], [0, 0, -5], [2, -1, 1]];
  function shotA() {
    const a = B.win(T.o - 0.2, T.d1 - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.pa - 0.2)), t = B.t;
    const M = t < T.el2 + 0.6 ? A0 : t < T.el3 + 1.2 ? A1 : A2;
    const piv = t < T.el3 ? 2 : 0, pivA = t > T.e1b && t < T.el4;
    B.mat(DX - 80, DY - 220, M, g0 * gin(T.e1), { cw: 100, ch: 70, px: 36, cell: (i, j) => (pivA && i === piv && j === (t < T.el3 ? 0 : 1) ? { box: C.peri } : pivA && i === piv ? { bg: C.peri, a: 0.15 } : null), col: (i, j) => (M[i][j] === 0 && M !== A0 ? C.inkMid : C.ink) });
    const p = t < T.pv3 ? [1, 2, 3] : t < T.el4 ? [3, 2, 1] : [3, 1, 2];
    const gp = g0 * gin(T.pv2);
    B.tag('p', DX + 200, DY - 340, { px: 34, a: gp, color: C.i, font: F.serif });
    B.mat(DX + 260, DY - 220, p.map(v => [v]), gp, { cw: 70, ch: 70, px: 36, col: () => C.i, bcol: C.i });
    ctag('只交换行号，不搬数据', DX + 260, DY - 80, { px: 24, a: gp, color: C.inkMid });
    ctag('乘数 3、2', DX - 80, DY - 80, { px: 30, a: g0 * gin(T.el2) * (1 - gin(T.el3)), color: C.peri });
    ctag('乘数 −4', DX - 80, DY - 80, { px: 30, a: g0 * gin(T.el3 + 0.8) * (1 - gin(T.el4)), color: C.peri });
    const gr = g0 * gin(T.el4); if (gr > 0) { B.mat(DX - 80, DY + 60, [A2[2], A2[0], A2[1]], gr, { cw: 90, ch: 56, px: 32, col: (i, j) => (j < i ? C.inkMid : C.ink) }); ctag('按 p = (3, 1, 2) 读出：上三角', DX - 80, DY + 170, { px: 28, a: gr, color: OK }); }
    const g1 = a * gin(T.pa - 0.2); if (g1 <= 0) return;
    texAt('PA', DX, DY - 360, 34, { alpha: g1 * (1 - gin(T.e2 - 0.2)) });
    B.card(DX, DY - 230, 860, 140, g1 * gin(T.pa2), C.peri); texAt('PALU', DX, DY - 230, 30, { alpha: g1 * gin(T.pa2) });
    const g2 = a * gin(T.e2); if (g2 <= 0) return;
    ctag('① 重排 c = Pb　② 前代　③ 回代', DX, DY - 60, { px: 30, a: g2 * gin(T.e2b), color: C.ink });
    texAt('ex2', DX, DY + 60, 32, { alpha: g2 * gin(T.e2b), reveal: prog(B.t, T.e2b, T.e2d + 1.0) });
  }

  // ── B：例 3 小主元 ──
  const P = new Plane({ ox: DX + 160, oy: DY + 170, u: 62, R: 4 });
  function shotB() {
    const a = B.win(T.d1 - 0.2, T.d2 - 0.3); if (a <= 0) return;
    ctag('主元不是零就行？', DX, DY - 380, { px: 34, a: a * gin(T.d1) * (1 - gin(T.e3)), color: C.ds });
    texAt('sys3', DX - 260, DY - 330, 30, { alpha: a * gin(T.e3) });
    texAt('exact3', DX + 200, DY - 330, 30, { alpha: a * gin(T.e3b) });
    const gl = a * gin(T.bad - 0.2), t = B.t;
    // 直线图
    const gg = a * gin(T.e3b);
    if (gg > 0) {
      B.line2(P.S([-1.5, 0]), P.S([3.6, 0]), C.inkMid, gg * 0.6, 2); B.line2(P.S([0, -0.6]), P.S([0, 3.6]), C.inkMid, gg * 0.6, 2); B.tag('x₁', P.S([3.6, 0])[0] + 8, P.S([3.6, 0])[1] + 4, { px: 24, a: gg * 0.7, color: C.inkMid }); B.tag('x₂', P.S([0, 3.6])[0] + 8, P.S([0, 3.6])[1], { px: 24, a: gg * 0.7, color: C.inkMid });
      const D = { x: P.ox, y: P.oy - 60, r: 300 };
      B.curve(P, D, x => (4 - 0.0001 * x) / 2, -1.5, 3.5, gg, { color: C.i, width: 4 });
      B.curve(P, D, x => 3 - x, -0.5, 3.5, gg, { color: C.j, width: 4 });
      const [ex, ey] = P.S([1.00005, 1.99995]); B.dot(ex, ey, 10, OK, gg); B.tag('精确 (1, 2)', ex + 16, ey - 26, { px: 24, a: gg, color: OK });
      const gb = gg * gin(T.bad3) * (1 - gin(T.good2)); const [bx, by] = P.S([0, 2]); B.dot(bx, by, 11, C.free, gb); B.tag('(0, 2)', bx - 100, by - 26, { px: 26, a: gb, color: C.free, font: F.serif });
    }
    // 左侧计算
    const x0 = DX - 260;
    ctag('三位十进制，主元 0.0001', x0, DY - 230, { px: 26, a: a * gin(T.e3c) * (1 - gin(T.good - 0.2)), color: C.inkMid });
    ctag('乘数 = 10000！', x0, DY - 170, { px: 36, a: gl * gin(T.bad2) * (1 - gin(T.good - 0.2)), color: C.free, font: F.serif });
    texAt('bad3', x0 + 30, DY - 100, 26, { alpha: gl * gin(T.bad3) * (1 - gin(T.good - 0.2)) });
    ctag('x₁ 错了 100%', x0, DY - 30, { px: 30, a: gl * gin(T.bad4) * (1 - gin(T.good - 0.2)), color: C.free });
    const gw = a * gin(T.why) * (1 - gin(T.good - 0.2)); if (gw > 0) {
      const cut = gin(T.why2, 0.6);
      ctag('a₂₂ = 1 − 20000', x0, DY + 50, { px: 30, a: gw, color: C.ink, font: F.serif });
      B.digits(x0, DY + 120, '−19999', gw, { px: 44, cw: 30, dim: k => (k >= 4 ? 1 - 0.8 * cut : 1), col: k => (k >= 4 ? C.free : C.ink) });
      ctag('→ −2.00 × 10⁴：那个 1 没了', x0, DY + 185, { px: 26, a: gw * cut, color: C.free });
      ctag('大乘数：误差 × 10000', x0, DY + 250, { px: 28, a: gw * gin(T.why3), color: C.peri });
    }
    const gd = a * gin(T.good - 0.2); if (gd > 0) {
      ctag('换行：用 1 当主元', x0, DY - 220, { px: 30, a: gd, color: OK, font: F.serif });
      ctag('乘数只有 0.0001', x0, DY - 160, { px: 28, a: gd, color: C.ink });
      texAt('good3', x0 + 30, DY - 90, 26, { alpha: gd * gin(T.good2) });
      B.card(x0, DY + 10, 300, 70, gd * gin(T.good3), OK); ctag('(1, 2) ✓', x0, DY + 10, { px: 36, a: gd * gin(T.good3), color: OK, font: F.serif });
    }
  }

  // ── C：部分主元 / 完全主元 ──
  const MP = [['·', '·', '·', '·'], ['', '0.3', '·', '·'], ['', '−2.5', '·', '·'], ['', '1.1', '·', '·']];
  function shotC() {
    const a = B.win(T.d2 - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('挑绝对值大的当主元', DX, DY - 390, { px: 34, a: a * gin(T.d2) * (1 - gin(T.pp)), color: C.ds });
    ctag('部分主元法', DX, DY - 390, { px: 40, a: a * gin(T.pp), color: C.peri, font: F.serif });
    const cm = gin(T.cp2 - 0.4);
    B.mat(DX - 180, DY - 190, MP, a * gin(T.pp), { cw: 90, ch: 64, px: 32,
      cell: (i, j) => (cm > 0.5 ? (i >= 1 && j >= 1 ? { bg: C.k, a: 0.18 } : null) : (j === 1 && i >= 1 ? (i === 2 && B.t > T.pp2 + 0.6 ? { box: C.peri, bg: C.peri, a: 0.2 } : { bg: C.i, a: 0.12 }) : null)),
      col: (i, j) => (j === 1 && i === 2 ? C.peri : C.ink) });
    ctag('第 i 列中 |·| 最大', DX - 180, DY - 30, { px: 26, a: a * gin(T.pp2) * (1 - cm), color: C.peri });
    ctag('整个子矩阵里找最大', DX - 180, DY - 30, { px: 26, a: a * cm, color: C.k });
    B.card(DX + 240, DY - 220, 300, 90, a * gin(T.pp3), OK); texAt('pp', DX + 240, DY - 220, 40, { alpha: a * gin(T.pp3) });
    ctag('误差不被放大', DX + 240, DY - 140, { px: 28, a: a * gin(T.st), color: OK });
    ctag('标准做法：带部分主元的 LU', DX, DY + 60, { px: 32, a: a * gin(T.st2) * (1 - gin(T.cp - 0.1)), color: C.ink, font: F.serif });
    ctag('完全主元：行列都换，更稳但贵', DX, DY + 60, { px: 30, a: a * gin(T.cp2), color: C.k });
    ctag('算法稳 ≠ 结果准：病态是问题本身的事', DX, DY + 150, { px: 28, a: a * gin(T.wn), color: C.free });
  }

  // ── D：同济 + 小结 ──
  function shotD() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('两种挑法', DX, DY - 360, { px: 36, a: g1, color: C.gpt, font: F.serif });
    B.card(DX - 220, DY - 220, 380, 150, g1 * gin(T.tj), C.gpt); ctag('同济 · 手算', DX - 220, DY - 260, { px: 30, a: g1 * gin(T.tj), color: C.gpt }); ctag('挑 1、挑简单的', DX - 220, DY - 205, { px: 28, a: g1 * gin(T.tj), color: C.ink }); ctag('少出分数', DX - 220, DY - 165, { px: 24, a: g1 * gin(T.tj), color: C.inkMid });
    B.card(DX + 220, DY - 220, 380, 150, g1 * gin(T.tj2), C.peri); ctag('电脑', DX + 220, DY - 260, { px: 30, a: g1 * gin(T.tj2), color: C.peri }); ctag('挑 |·| 最大的', DX + 220, DY - 205, { px: 28, a: g1 * gin(T.tj2), color: C.ink }); ctag('少放大误差', DX + 220, DY - 165, { px: 24, a: g1 * gin(T.tj2), color: C.inkMid });
    ctag('考试按同济，但要知道电脑为什么不那样做', DX, DY - 40, { px: 28, a: g1 * gin(T.tj3), color: C.ink });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['p 向量记录换行', C.i, T.sum], ['PA = LU', C.peri, cue('C15', 'P乘A等于L乘U')], ['小主元 → 大乘数 → 放大误差', C.free, cue('C15', '小主元')], ['部分主元：|l| ≤ 1', OK, cue('C15', '部分主元')]].forEach(([s, c, t0], i) => ctag(s, DX, DY - 260 + i * 80, { px: 36, a: g2 * gin(t0), color: c, font: F.serif }));
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('矩阵范数', DX, DY - 20, { px: 90, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('先学会量矩阵有多大', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.e1 - 0.2, t1: T.d1 - 0.3, head: '换行', items: [['行号向量 p', T.pv2, { color: C.i }], ['PA = LU', T.pa2, { color: C.peri }], ['c = Pb → 前代 → 回代', T.e2b]] },
    { t0: T.d1 - 0.2, t1: T.d2 - 0.3, head: '小主元', items: [['乘数 10000', T.bad2, { color: C.free }], ['x₁ = 0：错 100%', T.bad4, { color: C.free }], ['换行后 (1, 2)', T.good3, { color: OK }]] },
    { t0: T.d2 - 0.2, t1: T.sum - 0.3, head: '主元策略', items: [['部分主元：列中最大', T.pp2, { color: C.peri }], ['|l_ki| ≤ 1', T.pp3, { color: OK }], ['完全主元：行列都换', T.cp2, { color: C.k }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['带部分主元的 LU', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotA(); shotB(); shotC(); shotD(); B.left(SECS); });
  }
  return { TL, draw };
}
