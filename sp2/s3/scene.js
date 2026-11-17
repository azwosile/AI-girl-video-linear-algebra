// 特别篇 2 · 第 3 段：LU 之后还要解 AX = B（2024–25 第 5 题，15 分）。
// 分镜：原题三步 → 消元两步 + 乘数进 L → L、U 成型 → 大肥鱼“直接求逆”被引导 → LUX = B 拆成两级台阶（LY = B ↓ 前代、UX = Y ↑ 回代）
//       → 第 1 列：前代三格自上而下点亮、回代自下而上点亮 → X 第 1 列落位 → 第 2 列同理（分数）
//       → 分工卡（L 管怎么消，U 管主元）→ X 全貌 → 观察：B 第 3 列 = −⅓ × 第 1 列，X 同步（丝线）
//       → 第三问：B 的三列在 xy 平面里（2D 平面图 + 三根箭头）→ rank 2、列空间 x₃ = 0 → 评分点 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_happy', 'ds_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_q5']);
  const B = base(R, {
    assets, label: '特别篇 2 · LU 与初等矩阵', title: 'LU 之后解 AX = B', hi: 3, en: '2024–25 · Q5 · 15 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C05: 0.4, C07: 0.6, C10: 0.6, C13: 0.6, C14: 0.8, C16: 0.6 },
    post: { C01: 1.0, C02: 1.6, C03: 1.4, C04: 1.6, C05: 1.4, C06: 1.6, C07: 1.6, C08: 1.6, C09: 1.6, C10: 1.4, C11: 1.6, C12: 1.2, C13: 1.8, G01: 1.8, C14: 1.6, C15: 2.0, G02: 1.4, C16: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const S = [[[2, 1, 1], [6, 4, 5], [4, 1, 3]], [[2, 1, 1], [0, 1, 2], [0, -1, 1]], [[2, 1, 1], [0, 1, 2], [0, 0, 3]]];
  const T = [0, cue('C02', '第二行减三倍'), s('C03') + 0.3];
  const OPS = [null, [[1, 'r₂ − 3r₁'], [2, 'r₃ − 2r₁']], [[2, 'r₃ − (−1)r₂']]];
  const Lm = [[1, 0, 0], [3, 1, 0], [2, '−1', 1]], Um = [[2, 1, 1], [0, 1, 2], [0, 0, 3]];
  const fy1 = ['y一等于三', 'y二等于负九', 'y三等于负六减九'].map(w => cue('C07', w));
  const bx1 = ['x三等于负五', 'x二等于一', 'x一等于二分之七'].map(w => cue('C08', w));
  const fy2 = ['y一等于零', 'y二等于一', 'y三等于一'].map(w => cue('C10', w));
  const bx2 = ['x三等于三分之一', 'x二等于三分之一', 'x一等于负三分之一'].map(w => cue('C11', w));

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  ['LU分解', '解矩阵方程', 'B的秩'].forEach(w => TL.sfx('tick', cue('C01', w), 0.25));
  [1, 2].forEach(k => { TL.sfx('swoosh_soft', T[k], 0.25); TL.sfx('marimba', T[k] + 0.4, 0.22); });
  TL.sfx('ding_hi', s('C04') + 0.3, 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25);
  TL.sfx('click', cue('C05', '拆成两步'), 0.3); TL.sfx('swoosh_soft', cue('C06', '从上往下'), 0.3); TL.sfx('swoosh_soft', cue('C06', '从下往上'), 0.3);
  [...fy1, ...fy2].forEach(t => TL.sfx('marimba_hi', t, 0.22)); [...bx1, ...bx2].forEach(t => TL.sfx('marimba_lo', t, 0.22));
  TL.sfx('impact', s('C09') + 0.2, 0.3); TL.sfx('pop', s('D02') + 0.2, 0.25); TL.sfx('ding', s('C12') + 0.3, 0.3);
  TL.sfx('impact', cue('C13', '结果'), 0.3); TL.sfx('pluck', cue('G01', '恰好是第一列'), 0.3); TL.sfx('shimmer', cue('G01', '所以X的第三列'), 0.3);
  TL.sfx('sparkle', s('D03') + 0.2, 0.3);
  TL.sfx('pop', cue('C14', '第三行全是零'), 0.25); TL.sfx('ding_hi', cue('C14', '秩等于二'), 0.3);
  TL.sfx('hum', s('C15') + 0.2, 0.25); TL.sfx('shimmer', cue('C15', '整个x y平面'), 0.3); TL.sfx('zap', cue('G02', '不给分'), 0.25);
  TL.sfx('swell', s('C16') - 0.2, 0.3);

  function shotLU() {
    const a = B.win(s('C02'), s('C05') - 0.2); if (a <= 0) return;
    B.qhead('2024–2025 期中 · 第 5 题 · 15 分', a);
    const { M } = K.steps(S, T, OPS, { x: DX - 120, y: DY - 200, px: 38, a });
    const g4 = a * gin(s('C04'));
    if (g4 > 0) {
      ctag('L =', DX - 380, DY + 100, { px: 32, a: g4, color: C.peri, font: F.serif }); B.mat(DX - 250, DY + 100, Lm, { px: 34, a: g4, cell: (i, j) => i > j ? { col: C.peri } : null });
      ctag('U =', DX + 60, DY + 100, { px: 32, a: g4, font: F.serif }); B.mat(DX + 190, DY + 100, Um, { px: 34, a: g4 });
      B.burst(DX - 30, DY + 100, s('C04') + 0.3, OK, { r1: 240 });
    }
    const gd = a * gin(s('D01') + 0.2);
    ctag('X = A⁻¹B ?', DX, DY + 280, { px: 36, a: gd, color: C.ds, font: F.serif });
  }

  // 两级台阶 + 逐列求解
  function shotSolve() {
    const a = B.win(s('C05'), s('C14') - 0.3); if (a <= 0) return;
    const g5 = a * gin(cue('C05', '拆成两步'));
    ctag('LUX = B', DX, DY - 360, { px: 40, a: a * gin(s('C05') + 0.3), font: F.serif });
    B.xcard('① LY = B  前代 ↓', DX - 220, DY - 290, 380, 64, g5 * gin(cue('C06', '从上往下')), C.peri, 28);
    B.xcard('② UX = Y  回代 ↑', DX + 220, DY - 290, 380, 64, g5 * gin(cue('C06', '从下往上')), C.j, 28);
    // 左 L，右 U
    const gm = a * gin(s('C06') + 0.4);
    const ML = B.mat(DX - 330, DY - 120, Lm, { px: 30, a: gm, cell: (i, j) => i > j ? { col: C.peri } : null });
    const MU = B.mat(DX + 110, DY - 120, Um, { px: 30, a: gm, cell: (i, j) => i === j ? { col: C.j } : null });
    // 当前列
    const col2 = B.t > s('C10') - 0.2;
    const bv = col2 ? [0, 1, 0] : [3, 0, 0], yv = col2 ? [0, 1, 1] : [3, -9, -15], xv = col2 ? ['−⅓', '⅓', '⅓'] : ['7/2', 1, -5];
    const fy = col2 ? fy2 : fy1, bx = col2 ? bx2 : bx1;
    const gc = a * B.win(s('C07') - 0.3, s('C13') - 0.2) * (col2 ? gin(s('C10')) : 1);
    if (gc > 0) {
      ctag(col2 ? 'b₂' : 'b₁', DX - 160, DY - 210, { px: 26, a: gc, color: C.inkMid, font: F.serif }); K.cvec(DX - 160, DY - 120, bv, gc, { px: 30 });
      ctag('y', DX - 50, DY - 210, { px: 26, a: gc, color: C.peri, font: F.serif });
      B.mat(DX - 50, DY - 120, yv.map(v => [v]), { px: 30, a: gc, cell: (i) => ({ a: gin(fy[i]), col: C.peri }) });
      ctag('x', DX + 300, DY - 210, { px: 26, a: gc, color: C.j, font: F.serif });
      B.mat(DX + 300, DY - 120, xv.map(v => [v]), { px: 30, a: gc, cell: (i) => ({ a: gin(bx[i]), col: OK }) });
      fy.forEach((t, i) => { if (B.t > t - 0.6 && B.t < t + 1.4) K.rowBox(ML, i, 0, 2, C.peri, gc, 16); });
      bx.forEach((t, k) => { const i = 2 - k; if (B.t > t - 0.6 && B.t < t + 1.4) K.rowBox(MU, i, 0, 2, C.j, gc, 16); });
      // 前代箭头 ↓ / 回代箭头 ↑
      const uf = prog(B.t, fy[0], fy[2] + 0.5), ub = prog(B.t, bx[0], bx[2] + 0.5);
      arrow(ctx, [DX - 470, DY - 200], [DX - 470, DY - 40], { color: C.peri, width: 5, head: 16, alpha: gc * (uf > 0 ? 1 : 0), grow: uf });
      arrow(ctx, [DX + 390, DY - 40], [DX + 390, DY - 200], { color: C.j, width: 5, head: 16, alpha: gc * (ub > 0 ? 1 : 0), grow: ub });
      const ln = col2 ? [['y₁ = 0', fy[0]], ['3·0 + y₂ = 1 → y₂ = 1', fy[1]], ['0 − 1 + y₃ = 0 → y₃ = 1', fy[2]], ['3x₃ = 1 → x₃ = ⅓', bx[0]], ['x₂ + ⅔ = 1 → x₂ = ⅓', bx[1]], ['2x₁ + ⅓ + ⅓ = 0 → x₁ = −⅓', bx[2]]]
        : [['y₁ = 3', fy[0]], ['3y₁ + y₂ = 0 → y₂ = −9', fy[1]], ['2y₁ − y₂ + y₃ = 0 → y₃ = −15', fy[2]], ['3x₃ = −15 → x₃ = −5', bx[0]], ['x₂ + 2x₃ = −9 → x₂ = 1', bx[1]], ['2x₁ + x₂ + x₃ = 3 → x₁ = 7/2', bx[2]]];
      ln.forEach(([tx, t], k) => ctag(tx, k < 3 ? DX - 220 : DX + 230, DY + 40 + (k % 3) * 46, { px: 24, a: gc * gin(t), color: k < 3 ? C.peri : C.j, font: F.serif }));
    }
    const g9 = a * B.win(s('C09'), s('C10') - 0.1);
    B.xcard('X 第 1 列 = (7/2, 1, −5)ᵀ', DX, DY + 230, 520, 70, g9, OK, 32, OK);
    const g12 = a * B.win(s('D02'), s('C13') - 0.2);
    B.card(DX, DY + 240, 820, 76, g12 * 0.95, C.i);
    ctag('前代：L 对角全是 1，不用除   ·   回代：÷ U 的主元', DX, DY + 240, { px: 26, a: g12, color: C.i });
    ctag('L 管怎么消，U 管主元是多少', DX, DY + 300, { px: 28, a: a * B.win(s('C12'), s('C13') - 0.2), color: C.peri });
    // X 全貌 + 第三列观察
    const g13 = a * gin(cue('C13', '结果'));
    if (g13 > 0) {
      const MB = B.mat(DX - 250, DY + 170, [[3, 0, -1], [0, 1, 0], [0, 0, 0]], { px: 30, a: g13 * gin(s('G01')) });
      ctag('B', DX - 250, DY + 80, { px: 26, a: g13 * gin(s('G01')), color: C.inkMid, font: F.serif });
      const MX = B.mat(DX + 160, DY + 170, [['7/2', '−⅓', '−7/6'], [1, '⅓', '−⅓'], [-5, '⅓', '5/3']], { px: 30, a: g13, cw: 90, cell: (i, j) => ({ col: j === 2 && B.t > cue('G01', '所以X的第三列') ? C.i : OK }) });
      ctag('X =', DX + 160 - MX.w / 2 - 50, DY + 170, { px: 30, a: g13, color: OK, font: F.serif });
      const gt = a * gin(cue('G01', '恰好是第一列'));
      if (gt > 0) {
        K.colBox(MB, 0, 0, 2, C.i, gt, 14); K.colBox(MB, 2, 0, 2, C.i, gt, 14);
        K.threads(MB, 0, [[2, '× (−⅓)']], cue('G01', '恰好是第一列'), C.i, gt, { dy: -26, lift: 50 });
        const gx = a * gin(cue('G01', '所以X的第三列'));
        K.colBox(MX, 0, 0, 2, C.i, gx, 14); K.colBox(MX, 2, 0, 2, C.i, gx, 14);
        K.threads(MX, 0, [[2, '× (−⅓)']], cue('G01', '所以X的第三列'), C.i, gx, { dy: -26, lift: 50 });
      }
      K.pill('线性真好用！', DX, DY + 340, C.ds, a * gin(s('D03')), 28);
    }
  }

  function shotRank() {
    const a = B.win(s('C14'), s('C16') - 0.2); if (a <= 0) return;
    const MB = B.mat(DX - 250, DY - 200, [[3, 0, -1], [0, 1, 0], [0, 0, 0]], { px: 38, a, cell: (i) => i === 2 && B.t > cue('C14', '第三行全是零') ? { col: C.free } : null });
    ctag('B =', DX - 400, DY - 200, { px: 32, a, font: F.serif });
    if (B.t > cue('C14', '第三行全是零')) K.rowBox(MB, 2, 0, 2, C.free, a * gin(cue('C14', '第三行全是零')), 18);
    ctag('rank B = 2', DX + 200, DY - 200, { px: 46, a: a * gin(cue('C14', '秩等于二')), color: C.i, font: F.serif });
    // xy 平面
    const g = a * gin(s('C15'));
    if (g > 0) {
      const ox = DX, oy = DY + 120, u = 46;
      ctx.save(); ctx.globalAlpha = g * 0.5; ctx.fillStyle = rgba(C.j, 0.18); ctx.beginPath(); ctx.moveTo(ox - 260, oy + 60); ctx.lineTo(ox + 140, oy + 60); ctx.lineTo(ox + 260, oy - 60); ctx.lineTo(ox - 140, oy - 60); ctx.closePath(); ctx.fill(); ctx.restore();
      ctag('xy 平面（x₃ = 0）', ox + 200, oy + 90, { px: 24, a: g, color: C.j });
      const P = (x, y) => [ox + x * u + y * u * 0.6, oy - y * u * 0.5];
      arrow(ctx, P(0, 0), P(3, 0), { color: C.i, width: 6, head: 18, alpha: g * gin(s('C15') + 0.4) }); ctag('(3,0,0)', ...P(3.5, -0.4), { px: 22, a: g, color: C.i });
      arrow(ctx, P(0, 0), P(0, 1.6), { color: C.peri, width: 6, head: 18, alpha: g * gin(s('C15') + 0.7) }); ctag('(0,1,0)', ...P(0.2, 2.2), { px: 22, a: g, color: C.peri });
      arrow(ctx, P(0, 0), P(-1, 0), { color: C.k, width: 6, head: 18, alpha: g * gin(s('C15') + 1.0) }); ctag('(−1,0,0)', ...P(-2.2, -0.4), { px: 22, a: g, color: C.k });
      B.flash(cue('C15', '整个x y平面'), 0.2, 0.4, C.j);
      ctag('R(B) = Span{e₁, e₂} = {x₃ = 0}', DX, DY - 60, { px: 34, a: a * gin(cue('C15', '整个x y平面')), color: OK, font: F.serif });
    }
    const gG = a * gin(s('G02'));
    B.card(DX, DY + 300, 860, 80, gG * 0.95, C.gpt);
    ctag('评分点：给出一组基或几何描述；只写“二维”不给分', DX, DY + 300, { px: 26, a: gG, color: C.gpt });
  }

  function shotOutro() {
    const a = B.win(s('C16'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · LU 解方程', ['① 有了 LU：LY = B 前代，UX = Y 回代', '② B 有几列，就做几遍', '③ B 的列有什么关系，X 的列就有什么关系'],
      [s('C16') + 0.3, cue('C16', '前代加回代'), cue('C16', 'B的列之间')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotLU(); shotSolve(); shotRank(); shotOutro();
      B.paper(EX, 'y2425_q5', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C16') - 0.4 });
    });
  }
  return { TL, draw };
}
