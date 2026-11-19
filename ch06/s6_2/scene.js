// 第 6 章 6.2 线性微分方程组（Leon 9th §6.2）。
// 分镜：y′ = ay（指数曲线）→ 两个量互相影响 Y′ = AY → 试 Y = e^{λt}x → 例 1 特征对 + 通解
//       → 3B1B：相平面速度场 + 流线，沿 x₁ 外冲、沿 x₂ 收回 → 初值拆分 (6,1) = x₁ + 2x₂ → 和婚姻例子同一套路 → n 维通解
//       → 例 2 复特征值：向外螺线 / 实部为负向里螺线 → 弹簧：纯虚，圆周振动 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.2 线性微分方程组', hi: 3, en: 'LINEAR DIFFERENTIAL EQUATIONS',
    titleEnd: () => B.L('C02').s, titlePx: 92,
    pre: { C02: 0.4, C03: 0.6, C05: 0.6, C06: 0.6, C07: 0.6, C10: 0.6, C11: 0.8, C13: 0.4, C15: 0.8, G01: 0.6, C17: 0.6 },
    post: { C01: 1.0, C02: 0.8, C03: 0.8, C04: 0.6, C05: 0.8, C06: 3.0, C08: 1.0, C09: 0.6, C10: 0.8, C12: 0.6, C13: 2.0, C14: 1.0, C16: 2.0, G02: 0.6, C17: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    y1: L('C01').s, y1b: cue('C01', '答案是'), sys: L('C02').s, sys2: cue('C02', '写成矩阵'), d1: L('D01').s,
    tr: L('C03').s, tr2: cue('C03', '试一试'), tr3: cue('C03', '两边相等'), one: L('C04').s, e1: L('C05').s, e1g: cue('C05', '通解是'),
    ph: L('C06').s, ph1: cue('C06', '沿着x一的方向'), ph2: cue('C06', '沿着x二的方向'), ph3: cue('C06', '其余的点'),
    iv: L('C07').s, iv2: cue('C07', '解出'), sol: L('C08').s, sol2: cue('C08', '代回原方程'), d2: L('D02').s, same: L('C09').s, same2: cue('C09', '差别仅在于'), gen: L('C10').s,
    cx: L('C11').s, cx2: cue('C11', '特征值是二加减i'), eu: L('C12').s, eu2: cue('C12', '把解拆成'), sp: L('C13').s, sp2: cue('C13', '虚部一'), sp3: cue('C13', '合起来'), d3: L('D03').s,
    st: L('C14').s, st2: cue('C14', '如果所有特征值'), spr: L('C15').s, spr2: cue('C15', '令y一等于y'), spr3: cue('C15', '系数矩阵的特征值'), osc: L('C16').s, osc2: cue('C16', '教材还用'),
    tj: L('G01').s, tj2: L('G02').s, sum: L('C17').s, end: L('C18').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.y1b, 0.3); TL.sfx('pop', T.sys, 0.3); TL.sfx('pop', T.sys2, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.tr2, 0.3); TL.sfx('ding_hi', T.tr3, 0.32); TL.sfx('shimmer', T.one, 0.3); TL.sfx('pop', T.e1, 0.3); TL.sfx('pop', T.e1g, 0.3);
  TL.sfx('whoosh', T.ph, 0.3); TL.sfx('riser', T.ph1, 0.25); TL.sfx('swoosh_soft', T.ph2, 0.3); TL.sfx('swell', T.ph3, 0.3);
  TL.sfx('pop', T.iv, 0.3); TL.sfx('ding', T.iv2, 0.3); TL.sfx('pop', T.sol, 0.3); TL.sfx('check', T.sol2, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.same2, 0.3); TL.sfx('pop', T.gen, 0.3);
  TL.sfx('whoosh', T.cx, 0.3); TL.sfx('pop', T.cx2, 0.3); TL.sfx('pop', T.eu, 0.3); TL.sfx('warp', T.sp, 0.35); TL.sfx('pluck', T.d3, 0.3); TL.sfx('swoosh_soft', T.st, 0.3); TL.sfx('ding_hi', T.st2, 0.3);
  TL.sfx('whoosh', T.spr, 0.3); TL.sfx('pop', T.spr3, 0.3); TL.sfx('marimba', T.osc, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  const A1 = [[3, 4], [3, 2]], A2 = [[1, 1], [-2, 3]];
  // ── A：y′ = ay → 方程组 → 试解 → 例 1 ──
  const P0 = new Plane({ ox: DX - 260, oy: DY + 300, u: 60, R: 6 });
  function shotA(D) {
    const a = B.win(T.y1 - 0.2, T.ph - 0.3); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sys - 0.2));
    texAt('y1', DX, DY - 300, 42, { alpha: g1 * gin(T.y1b) });
    if (g1 > 0) { B.line2(P0.S([-1, 0]), P0.S([9, 0]), C.ink, g1 * 0.5, 2); B.line2(P0.S([0, -0.5]), P0.S([0, 6]), C.ink, g1 * 0.5, 2);
      const gr = smoother(prog(B.t, T.y1b, T.y1b + 2.0));
      [[0.25, C.peri, 'a > 0'], [0, C.inkMid, 'a = 0'], [-0.5, C.j, 'a < 0']].forEach(([k, col, lb], i) => { B.curve(P0, D, x => Math.min(7, 2 * Math.exp(k * x)), 0, 8 * gr, g1, { color: col, width: 4 }); ctag(lb, ...P0.S([8.4, Math.min(5.5, 2 * Math.exp(k * 8)) + 0.3]), { px: 26, a: g1 * gr, color: col, font: F.serif }); }); }
    const g2 = a * gin(T.sys); if (g2 <= 0) return;
    texAt('sys', DX, DY - 330, 36, { alpha: g2 });
    texAt('Y', DX, DY - 200, 38, { alpha: g2 * gin(T.sys2) });
    ctag('缠在一起，不能分开解', DX, DY - 120, { px: 30, a: g2 * gin(T.d1) * (1 - gin(T.tr2)), color: C.ds });
    texAt('try', DX - 220, DY - 80, 38, { alpha: a * gin(T.tr2) });
    ctag('若 Ax = λx', DX + 200, DY - 80, { px: 32, a: a * gin(T.tr), color: C.peri, font: F.serif });
    texAt('chk', DX, DY + 20, 32, { alpha: a * gin(T.tr2 + 1.0), reveal: rv(T.tr2 + 1.0, 4.0) });
    B.stamp(DX + 360, DY + 20, true, prog(B.t, T.tr3, T.tr3 + 0.4), a * (1 - gin(T.e1)), '✓ 相等');
    ctag('沿特征向量：退化成一维 y′ = λy', DX, DY + 120, { px: 30, a: a * gin(T.one), color: OK });
    const g5 = a * gin(T.e1); B.card(DX, DY + 230, 760, 80, g5, C.inkMid); texAt('eig', DX, DY + 230, 30, { alpha: g5 });
    B.card(DX, DY + 340, 700, 80, a * gin(T.e1g), C.peri); texAt('gen', DX, DY + 340, 32, { alpha: a * gin(T.e1g) });
  }

  // ── B：相平面 ──
  const P = new Plane({ ox: DX, oy: DY + 60, u: 52, R: 10 });
  const ring = (r, n, off = 0) => Array.from({ length: n }, (_, i) => [r * Math.cos(off + i * 2 * Math.PI / n), r * Math.sin(off + i * 2 * Math.PI / n)]);
  function field(A, a, D, { step = 1.5, len = 0.5, color = C.inkMid } = {}) {
    if (a <= 0) return; ctx.save(); B.K.clip(D);
    for (let x = -9; x <= 9; x += step) for (let y = -9; y <= 9; y += step) {
      const v = [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y], n = Math.hypot(...v); if (n < 1e-6) continue;
      const q = [x + v[0] / n * len, y + v[1] / n * len]; arrow(ctx, P.S([x, y]), P.S(q), { color, width: 2, head: 8, alpha: a * 0.45 });
    }
    ctx.restore();
  }
  function shotB(D) {
    const a = B.win(T.ph - 0.2, T.iv - 0.3); if (a <= 0) return;
    B.grid(P, I2, a, D, { old: 0.1, neu: 0, basis: false });
    field(A1, a * gin(T.ph + 0.3), D);
    B.lineD(P, D, [0.8, 0.6], a * gin(T.ph1 - 0.5), { color: C.i, width: 4 });
    B.lineD(P, D, [Math.SQRT1_2, -Math.SQRT1_2], a * gin(T.ph2 - 0.5), { color: C.j, width: 4 });
    // 沿 x₁ 外冲、沿 x₂ 收回
    const t1 = prog(B.t, T.ph1, T.ph1 + 2.5), t2 = prog(B.t, T.ph2, T.ph2 + 2.5);
    for (const sg of [1, -1]) {
      const r1 = 0.3 * Math.exp(6 * 0.55 * t1); if (r1 < 12 && t1 > 0) B.dot(...P.S([sg * 0.8 * r1, sg * 0.6 * r1]), 10, C.i, a);
      const r2 = 8 * Math.exp(-3 * t2); if (t2 > 0) B.dot(...P.S([sg * Math.SQRT1_2 * r2, -sg * Math.SQRT1_2 * r2]), 10, C.j, a);
    }
    ctag('e⁶ᵗ 外冲', ...P.S([6.5, 6.3]), { px: 28, a: a * gin(T.ph1), color: C.i, font: F.serif });
    ctag('e⁻ᵗ 收回', ...P.S([5.2, -6.8]), { px: 28, a: a * gin(T.ph2), color: C.j, font: F.serif });
    const gf = a * gin(T.ph3);
    B.flow(P, D, A1, gf, { starts: ring(1.2, 16, 0.2), T: 0.7, n: 140, grow: prog(B.t, T.ph3, T.ph3 + 4.0), color: C.periLt, dot: 1 });
    texAt('Y', DX, DY - 400, 32, { alpha: a });
    ctag('最后都被拉向 x₁ 方向', DX, DY + 420, { px: 28, a: gf * gin(T.ph3 + 2.5), color: C.i });
  }

  // ── C：初值 ──
  const PI = new Plane({ ox: DX - 120, oy: DY + 200, u: 46, R: 8 });
  function shotC(D) {
    const a = B.win(T.iv - 0.2, T.cx - 0.3); if (a <= 0) return;
    const gp = a * (1 - gin(T.gen - 0.2));
    if (gp > 0) {
      B.grid(PI, I2, gp, D, { old: 0.1, neu: 0, basis: false, clipY: DY - 40 });
      B.vec(PI, [4, 3], gp * gin(T.iv + 0.6), { color: C.i, label: 'x₁', lx: -20, ly: -20 });
      B.vec(PI, [2, -2], gp * gin(T.iv + 1.2), { color: C.j, from: [4, 3], label: '2x₂', lx: 30, ly: -10 });
      B.vec(PI, [6, 1], gp * gin(T.iv + 0.3), { color: C.ink, label: 'Y₀ = (6, 1)', lx: 50, ly: 20, px: 28 });
    }
    texAt('ivp', DX, DY - 380, 32, { alpha: a * gin(T.iv), reveal: rv(T.iv, 3.0) });
    B.card(DX, DY - 250, 420, 130, a * gin(T.sol), C.peri); texAt('sol', DX, DY - 250, 34, { alpha: a * gin(T.sol) });
    B.stamp(DX + 330, DY - 250, true, prog(B.t, T.sol2, T.sol2 + 0.4), a * (1 - gin(T.d2)), '✓ 验证');
    ctag('拆到特征向量上 = 婚姻的例子', DX + 200, DY - 120, { px: 28, a: a * gin(T.d2), color: C.ds });
    ctag('λⁿ  ⟶  e^(λt)', DX + 250, DY - 60, { px: 36, a: a * gin(T.same2) * (1 - gin(T.gen - 0.2)), color: C.peri, font: F.serif });
    const gg = a * gin(T.gen - 0.2); B.card(DX, DY + 80, 760, 90, gg, C.peri); texAt('genn', DX, DY + 80, 32, { alpha: gg });
    ctag('n 个无关特征向量', DX, DY + 170, { px: 30, a: gg, color: C.inkMid });
  }

  // ── D：复特征值螺线 ──
  function shotD(D) {
    const a = B.win(T.cx - 0.2, T.spr - 0.3); if (a <= 0) return;
    texAt('e2A', DX, DY - 390, 32, { alpha: a * gin(T.cx) });
    texAt('euler', DX, DY - 300, 34, { alpha: a * gin(T.eu) });
    const gs = a * gin(T.sp - 0.3); if (gs <= 0) return;
    B.grid(P, I2, gs, D, { old: 0.1, neu: 0, basis: false });
    const inward = gin(T.d3 + 0.5);
    const Ause = inward < 0.5 ? A2 : A2.map(r => r.map(v => -v));
    const gOut = gs * (1 - inward), gIn = gs * inward;
    field(A2, gOut * 0.8, D, { step: 1.8 }); field(Ause, gIn * 0.8, D, { step: 1.8 });
    B.flow(P, D, A2, gOut, { starts: ring(0.35, 6), T: 2.2, n: 200, grow: prog(B.t, T.sp, T.sp + 4.5), color: C.periLt, dot: 1, tclip: 10 });
    B.flow(P, D, A2.map(r => r.map(v => -v)), gIn, { starts: ring(7.5, 6, 0.3), T: 2.0, n: 200, grow: prog(B.t, T.d3 + 0.6, T.d3 + 4.5), color: C.j, dot: 1 });
    ctag('实部 2：向外 e²ᵗ', DX - 230, DY + 400, { px: 28, a: gOut * gin(T.sp + 0.5), color: C.peri });
    ctag('虚部 1：旋转', DX + 230, DY + 400, { px: 28, a: gOut * gin(T.sp2), color: C.i });
    ctag('实部 < 0：向里螺线', DX, DY + 400, { px: 30, a: gIn, color: C.j });
    const gr = a * gin(T.st2); B.card(DX, DY - 210, 640, 70, gr, OK); ctag('全部实部 < 0 ⇒ 稳定', DX, DY - 210, { px: 32, a: gr, color: OK, font: F.serif });
  }

  // ── E：弹簧 ──
  const PS = new Plane({ ox: DX + 210, oy: DY + 150, u: 70, R: 3 });
  function shotE(D) {
    const a = B.win(T.spr - 0.2, T.tj - 0.3); if (a <= 0) return;
    texAt('spring', DX, DY - 330, 32, { alpha: a * gin(T.spr2), reveal: rv(T.spr2, 3.5) });
    const go = a * gin(T.spr + 0.5), w = 1.6, ph = (B.t - T.spr) * w, y = 2.2 * Math.cos(ph), v = -2.2 * Math.sin(ph);
    // 弹簧 + 物块（竖直）
    const X0 = DX - 250, top = DY - 170, by = DY + 150 - y * 60;
    if (go > 0) { ctx.save(); ctx.globalAlpha = go; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, top); const nz = 14; for (let i = 1; i <= nz; i++) ctx.lineTo(X0 + (i % 2 ? 26 : -26), top + (by - 40 - top) * i / nz); ctx.lineTo(X0, by - 40); ctx.stroke();
      ctx.fillStyle = C.peri; ctx.fillRect(X0 - 50, by - 40, 100, 80); ctx.fillStyle = C.ink; ctx.fillRect(X0 - 90, top - 8, 180, 8); ctx.restore();
      B.line2([X0 + 90, DY + 150], [X0 + 130, DY + 150], C.inkMid, go, 2); ctag('y', X0 + 150, by, { px: 28, a: go, color: C.peri, font: F.serif }); }
    // 相平面圆
    const gp = a * gin(T.spr3); if (gp > 0) {
      ctx.save(); B.K.clip(D); PS.grid(ctx, { M: I2, color: C.gridOld, width: 1, alpha: 0.12 * gp }); PS.axes(ctx, { color: C.ink, width: 2, alpha: 0.4 * gp }); ctx.restore();
      B.levelQ(PS, D, [[1, 0], [0, 1]], 2.2 * 2.2, gp, { color: C.k, width: 3, dash: [8, 6] });
      B.dot(...PS.S([y, v]), 11, C.peri, gp); B.line2(PS.S([y, 0]), PS.S([y, v]), C.peri, gp * 0.5, 2, [5, 5]);
      ctag('y', PS.S([3, 0])[0] + 20, PS.S([3, 0])[1] + 26, { px: 26, a: gp, color: C.inkMid, font: F.serif }); ctag("y′", PS.S([0, 3])[0] + 30, PS.S([0, 3])[1], { px: 26, a: gp, color: C.inkMid, font: F.serif });
    }
    ctag('纯虚 λ：不涨不缩，只转 → 振动', DX, DY + 400, { px: 30, a: a * gin(T.osc), color: C.k });
    ctag('高楼抗震：同一方法', DX, DY - 230, { px: 28, a: a * gin(T.osc2), color: C.inkMid });
  }

  // ── F：同济 + 小结 ──
  function shotF() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济对照', DX, DY - 280, { px: 34, a: g1, color: C.gpt });
    ctag('线代课不讲 → 高等数学 / 常微分方程', DX, DY - 180, { px: 32, a: g1 * gin(T.tj + 1.0), color: C.inkMid });
    ctag('常系数方程组的特征根法', DX, DY - 40, { px: 40, a: g1 * gin(T.tj2), color: C.gpt, font: F.serif });
    ctag('= 矩阵的特征值', DX, DY + 40, { px: 40, a: g1 * gin(T.tj2 + 1.5), color: C.peri, font: F.serif });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    texAt('try', DX, DY - 260, 44, { alpha: g2 });
    ctag('实 λ：指数增长 / 衰减', DX, DY - 140, { px: 34, a: g2 * gin(cue('C17', '实特征值')), color: C.i });
    ctag('复 λ：旋转（螺线）', DX, DY - 70, { px: 34, a: g2 * gin(cue('C17', '复特征值')), color: C.k });
    ctag('初值 = 把 Y₀ 拆到特征向量上', DX, DY + 10, { px: 34, a: g2 * gin(cue('C17', '初值问题')), color: C.peri });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('对角化', DX, DY - 20, { px: 96, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('拆到特征向量上 → 矩阵分解', DX, DY + 90, { px: 34, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.y1 - 0.2, t1: T.ph - 0.3, head: "Y′ = AY", items: [['一维：y = ceᵃᵗ', T.y1b], ['两个量互相影响', T.sys], ['试 Y = e^(λt)x', T.tr2, { color: C.peri }], ['例 1：λ = 6，−1', T.e1]] },
    { t0: T.ph - 0.2, t1: T.cx - 0.3, head: '相平面', items: [['x₁ 方向：外冲', T.ph1, { color: C.i }], ['x₂ 方向：收回', T.ph2, { color: C.j }], ['初值：c₁ = 1，c₂ = 2', T.iv2, { color: C.peri }], ['λⁿ → e^(λt)', T.same2]] },
    { t0: T.cx - 0.2, t1: T.tj - 0.3, head: '复特征值', items: [['例 2：λ = 2 ± i', T.cx2, { color: C.k }], ['实部：涨或缩', T.st], ['虚部：转多快', T.st + 1.5], ['弹簧：λ = ±√k i', T.spr3, { color: C.peri }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['基本解 e^(λt)x', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(D); shotD(D); shotE(D); shotF(); B.left(SECS); });
  }
  return { TL, draw };
}
