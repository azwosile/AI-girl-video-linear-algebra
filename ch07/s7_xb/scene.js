// 第 7 章 复习（中）计算题 1–5（Leon 9th Chapter 7 Test B 第 1–5 题）：(AB)x vs A(Bx)、部分主元 PA = LU 与两个右端、‖Q‖₂ / ‖Q‖_F、希尔伯特误差估计、丢位数。
// 分镜：题号卡 → 运算量两根柱 → 数字矩阵逐步部分主元（选中的主元框、行号顺序 2、3、1）→ P、L、U → 两个右端同时解
//       → Q 的四列单位向量 → H⁻¹ 的列和条 → 误差上界 → 15 格数字尺被吃掉约 7 格 → 同济 → 预告。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_happy', 'ds_think', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 复习', title: '计算题（上）', hi: 3, en: 'CHAPTER TEST B · 1–5',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.8, C05: 0.8, C10: 0.8, C12: 0.8, C17: 0.8, G01: 0.6, C20: 0.6 },
    post: { C01: 0.6, C02: 0.8, C03: 1.4, C04: 1.4, C05: 1.0, C06: 1.4, C07: 1.4, C08: 1.4, C09: 1.6, C11: 1.4, C13: 1.4, C14: 1.4, C15: 1.6, C16: 1.0, C18: 1.4, C19: 1.0, G01: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, p1: L('C02').s, p1b: L('C03').s, p1c: cue('C03', '再乘x'), p1d: cue('C03', '合起来'), p1e: L('C04').s, p1f: cue('C04', '显然后一种'),
    p2: L('C05').s, p2b: L('C06').s, p2c: cue('C06', '乘数是'), p2d: L('C07').s, p2e: cue('C07', '乘数二分之一'), p2f: cue('C07', '行的顺序'), p2g: L('C08').s, p2h: cue('C08', 'L的下三角'), p2i: cue('C08', 'U的三行'),
    p2j: L('C09').s, p2k: cue('C09', '第二个'), d1: L('D01').s, p3: L('C10').s, p3b: L('C11').s, p3c: cue('C11', 'Q的四列'),
    p4: L('C12').s, p4b: L('C13').s, p4c: cue('C13', 'H逆看各列'), p4d: L('C14').s, p4e: cue('C14', '条件数是'), p4f: cue('C14', 'b的一范数'), p4g: L('C15').s, p4h: cue('C15', '大约二点零四'), d2: L('D02').s, p4i: L('C16').s,
    p5: L('C17').s, p5b: L('C18').s, p5c: cue('C18', '等于五乘十的负八次方'), p5d: cue('C18', '七位准确数字'), p5e: L('C19').s, tj: L('G01').s, end: L('C20').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); [T.p1, T.p2, T.p3, T.p4, T.p5].forEach(x => TL.sfx('whoosh', x, 0.3)); TL.sfx('pop', T.p1d, 0.3); TL.sfx('pop', T.p1e, 0.3); TL.sfx('ding', T.p1f, 0.3);
  TL.sfx('pop', T.p2b, 0.3); TL.sfx('click', T.p2c, 0.3); TL.sfx('pop', T.p2d, 0.3); TL.sfx('click', T.p2e, 0.3); TL.sfx('ding', T.p2f, 0.3); TL.sfx('pop', T.p2h, 0.3); TL.sfx('pop', T.p2i, 0.3); TL.sfx('ding_hi', T.p2j + 2.5, 0.3); TL.sfx('ding_hi', T.p2k + 2.5, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.p3b, 0.3); TL.sfx('ding', T.p3c, 0.3); TL.sfx('pop', T.p4b, 0.3); TL.sfx('pop', T.p4c, 0.3); TL.sfx('pop', T.p4e, 0.3); TL.sfx('ding_hi', T.p4h, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('pop', T.p5b, 0.3); TL.sfx('ding', T.p5c, 0.3); TL.sfx('ding_hi', T.p5d, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', L('C20').e + 0.3, 0.4);

  const head = (n, title, a) => { ctag(`第 ${n} 题`, DX, DY - 395, { px: 32, a, color: C.peri, font: F.serif }); ctag(title, DX, DY - 345, { px: 26, a, color: C.inkMid }); };

  function shotIntro() {
    const a = B.win(T.o - 0.2, T.p1 - 0.3); if (a <= 0) return;
    [['运算量', C.i], ['部分主元', C.peri], ['范数与条件数', C.j]].forEach(([s, c], i) => ctag(s, DX, DY - 180 + i * 90, { px: 44, a: a * gin(T.o + 0.8 + i * 0.5), color: c, font: F.serif }));
  }

  // ── 第 1 题 ──
  function shot1() {
    const a = B.win(T.p1 - 0.2, T.p2 - 0.3); if (a <= 0) return;
    head(1, '(AB)x 与 A(Bx) 的加法、乘法次数', a);
    ctag('AB：n² 个元素 × 每个 n 次乘法', DX, DY - 260, { px: 28, a: a * gin(T.p1b), color: C.ink });
    texAt('b1a', DX, DY - 180, 32, { alpha: a * gin(T.p1d) });
    texAt('b1b', DX, DY - 90, 32, { alpha: a * gin(T.p1e) });
    const g = a * gin(T.p1e + 0.5); if (g > 0) {
      const y0 = DY + 270, s = smoother(prog(B.t, T.p1e + 0.5, T.p1e + 1.5));
      ctx.save(); ctx.globalAlpha = g * 0.85; ctx.fillStyle = C.free; ctx.fillRect(DX - 160, y0 - 250 * s, 110, 250 * s); ctx.fillStyle = OK; ctx.fillRect(DX + 50, y0 - 6, 110, 6); ctx.restore();
      ctag('n³', DX - 105, y0 + 26, { px: 28, a: g, color: C.free, font: F.serif }); ctag('2n²', DX + 105, y0 + 26, { px: 28, a: g, color: OK, font: F.serif });
      ctag('A(Bx) 好得多', DX + 105, y0 - 60, { px: 28, a: a * gin(T.p1f), color: OK });
    }
  }

  // ── 第 2 题 ──
  const S0 = [[2, 3, 6], [4, 4, 8], [1, 3, 4]], S1 = [[0, 1, 2], [4, 4, 8], [0, 2, 2]], S2 = [[0, 0, 1], [4, 4, 8], [0, 2, 2]];
  function shot2() {
    const a = B.win(T.p2 - 0.2, T.p3 - 0.3); if (a <= 0) return;
    head(2, '部分主元：P、PA = LU、两个右端', a);
    const g0 = a * (1 - gin(T.p2g - 0.2)), t = B.t;
    texAt('b2A', DX, DY - 270, 26, { alpha: g0 * gin(T.p2) });
    const M = t < T.p2c + 0.8 ? S0 : t < T.p2e + 0.8 ? S1 : S2;
    const pv = t < T.p2d ? [1, 0] : [2, 1];
    B.mat(DX - 100, DY - 70, M, g0 * gin(T.p2b - 0.2), { cw: 96, ch: 68, px: 34, cell: (i, j) => (t > T.p2b && t < T.p2f && i === pv[0] && j === pv[1] ? { box: C.peri, bg: C.peri, a: 0.2 } : (t > T.p2b && t < T.p2f && j === pv[1] && M[i][j] !== 0 && (pv[1] === 0 || i !== 1)) ? { bg: C.i, a: 0.12 } : null), col: (i, j) => (M[i][j] === 0 && M !== S0 ? C.inkMid : C.ink) });
    ctag('列中最大：4 → 第 2 行', DX + 260, DY - 130, { px: 26, a: g0 * gin(T.p2b) * (1 - gin(T.p2d)), color: C.peri });
    ctag('乘数 ½、¼', DX + 260, DY - 80, { px: 28, a: g0 * gin(T.p2c) * (1 - gin(T.p2d)), color: C.peri, font: F.serif });
    ctag('剩下 1 和 2：选 2', DX + 260, DY - 130, { px: 26, a: g0 * gin(T.p2d), color: C.peri });
    ctag('乘数 ½', DX + 260, DY - 80, { px: 28, a: g0 * gin(T.p2e), color: C.peri, font: F.serif });
    ctag('顺序：2、3、1', DX + 260, DY - 20, { px: 30, a: g0 * gin(T.p2f), color: OK, font: F.serif });
    const g1 = a * gin(T.p2g - 0.2); if (g1 <= 0) return;
    texAt('b2P', DX, DY - 250, 30, { alpha: g1 });
    texAt('b2LU', DX, DY - 120, 28, { alpha: g1 * gin(T.p2h) });
    ctag('所有乘数 ≤ 1', DX, DY - 30, { px: 26, a: g1 * gin(T.p2i + 1.0), color: OK });
    ctag('Pb = (0, 4, 3) → y = (0, 4, 1)', DX, DY + 40, { px: 28, a: g1 * gin(T.p2j), color: C.i, font: F.serif });
    ctag('Pc = (8, 2, 1) → y = (8, 0, −3)', DX, DY + 95, { px: 28, a: g1 * gin(T.p2k), color: C.j, font: F.serif });
    B.card(DX, DY + 190, 600, 90, g1 * gin(T.p2j + 2.5), OK); texAt('b2x', DX, DY + 190, 30, { alpha: g1 * gin(T.p2j + 2.5) });
    ctag('分解一次，两个右端都秒解', DX, DY + 280, { px: 28, a: a * gin(T.d1), color: C.ds });
  }

  // ── 第 3 题 ──
  function shot3() {
    const a = B.win(T.p3 - 0.2, T.p4 - 0.3); if (a <= 0) return;
    head(3, 'Q 是 4 阶正交矩阵', a);
    B.card(DX, DY - 230, 760, 90, a * gin(T.p3b), C.peri); texAt('b3', DX, DY - 230, 32, { alpha: a * gin(T.p3b) });
    const g = a * gin(T.p3c); if (g > 0) for (let j = 0; j < 4; j++) { const x = DX - 270 + j * 180; ctx.save(); ctx.globalAlpha = g * 0.85; ctx.fillStyle = [C.i, C.j, C.k, C.peri][j]; ctx.fillRect(x - 14, DY - 120, 28, 200); ctx.restore(); ctag(`‖q${'₁₂₃₄'[j]}‖² = 1`, x, DY + 110, { px: 24, a: g, color: C.ink, font: F.serif }); }
    ctag('平方和 = 4 → ‖Q‖_F = 2', DX, DY + 190, { px: 32, a: g * gin(T.p3c + 1.2), color: OK, font: F.serif });
  }

  // ── 第 4 题 ──
  const HI = [[16, -120, 240, -140], [-120, 1200, -2700, 1680], [240, -2700, 6480, -4200], [-140, 1680, -4200, 2800]], HS = [516, 5700, 13620, 8820];
  function shot4() {
    const a = B.win(T.p4 - 0.2, T.p5 - 0.3); if (a <= 0) return;
    head(4, '4 阶希尔伯特矩阵，b = (10, −10, 20, 10)', a);
    const g0 = a * (1 - gin(T.p4d - 0.2));
    ctag('‖H‖₁ = 1 + ½ + ⅓ + ¼ = 25/12', DX, DY - 270, { px: 30, a: g0 * gin(T.p4b), color: C.i, font: F.serif });
    const m = B.mat(DX - 40, DY - 80, HI, g0 * gin(T.p4c - 0.3), { cw: 120, ch: 56, px: 28, cell: (i, j) => (j === 2 && B.t > T.p4c + 1.5 ? { bg: C.peri, a: 0.2 } : null) });
    if (m) HS.forEach((v, j) => ctag(String(v), m.at(0, j)[0], m.y0 + m.H + 34, { px: 26, a: g0 * gin(T.p4c + 0.5 + j * 0.25), color: j === 2 ? C.peri : C.inkMid, font: F.serif }));
    ctag('H⁻¹', DX - 330, DY - 80, { px: 34, a: g0 * gin(T.p4c - 0.3), color: C.ink, font: F.serif });
    const g1 = a * gin(T.p4d - 0.2); if (g1 <= 0) return;
    texAt('b4n', DX, DY - 260, 32, { alpha: g1 });
    ctag('‖r‖₁ = 0.36 × 10⁻¹¹', DX, DY - 180, { px: 30, a: g1, color: C.ink, font: F.serif });
    texAt('b4c', DX, DY - 100, 32, { alpha: g1 * gin(T.p4e) });
    B.card(DX, DY + 20, 900, 110, g1 * gin(T.p4g), C.peri); texAt('b4e', DX, DY + 20, 30, { alpha: g1 * gin(T.p4g), reveal: rv(T.p4g, 2.0) });
    ctag('条件数两万多，还这么准？', DX, DY + 140, { px: 28, a: a * gin(T.d2), color: C.ds });
    ctag('残差 10⁻¹¹ × 两万 ≈ 10⁻⁹：保险上限', DX, DY + 210, { px: 28, a: a * gin(T.p4i), color: OK });
  }

  // ── 第 5 题 ──
  function shot5() {
    const a = B.win(T.p5 - 0.2, T.tj - 0.3); if (a <= 0) return;
    head(5, '10 阶，cond∞ = 5 × 10⁶，15 位十进制，相对残差 ≈ 2ε', a);
    ctag('ε = ½ × 10⁻¹⁴', DX, DY - 270, { px: 32, a: a * gin(T.p5b), color: C.ink, font: F.serif });
    B.card(DX, DY - 180, 700, 90, a * gin(T.p5c), C.peri); texAt('b5', DX, DY - 180, 34, { alpha: a * gin(T.p5c) });
    const lost = Math.round(8 * smoother(prog(B.t, T.p5d - 0.6, T.p5d + 0.4)));
    for (let k = 0; k < 15; k++) { const x = DX - 350 + k * 50, ok = k < 15 - lost; ctx.save(); ctx.globalAlpha = a * gin(T.p5d - 0.8) * (ok ? 0.85 : 0.3); ctx.fillStyle = ok ? OK : C.free; ctx.fillRect(x - 20, DY - 50, 40, 56); ctx.restore(); }
    ctag('约 7 位准确数字', DX, DY + 50, { px: 34, a: a * gin(T.p5d), color: OK, font: F.serif });
    ctag('经验：15 − log₁₀(5 × 10⁶) ≈ 15 − 6.7', DX, DY + 130, { px: 28, a: a * gin(T.p5e), color: C.inkMid, font: F.serif });
  }

  function shotEnd() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.end - 0.2));
    ctag('误差估计 = 放大倍数 × 输入误差', DX, DY - 200, { px: 36, a: g1, color: C.gpt, font: F.serif });
    ctag('数值分析课就这么考', DX, DY - 110, { px: 30, a: g1 * gin(cue('G01', '数值分析课')), color: C.ink });
    const g2 = a * gin(T.end - 0.2);
    ctag('下一段', DX, DY - 140, { px: 34, a: g2, color: C.inkMid });
    ctag('计算题（下）', DX, DY - 40, { px: 80, a: g2 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('豪斯霍尔德 · 吉文斯 · QR · 幂法 · SVD', DX, DY + 70, { px: 30, a: g2 * gin(T.end + 0.8), color: C.ink });
    ctag('+ 全课收尾', DX, DY + 130, { px: 30, a: g2 * gin(cue('C20', '收个尾')), color: C.free });
  }

  const SECS = [
    { t0: T.p1 - 0.2, t1: T.p3 - 0.3, head: '1 – 2 题', items: [['A(Bx)：2n²', T.p1e, { color: OK }], ['主元 4，再选 2', T.p2d, { color: C.peri }], ['顺序 2、3、1', T.p2f], ['x = (−3,1,1)，(5,3,−3)', T.p2j + 2.5, { color: OK }]] },
    { t0: T.p3 - 0.2, t1: T.tj - 0.3, head: '3 – 5 题', items: [['‖Q‖₂ = 1，‖Q‖_F = 2', T.p3c, { color: C.j }], ['cond₁(H) = 28375', T.p4e, { color: C.peri }], ['误差 ≤ 2.04 × 10⁻⁹', T.p4h, { color: OK }], ['约 7 位准确', T.p5d, { color: OK }]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotIntro(); shot1(); shot2(); shot3(); shot4(); shot5(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
