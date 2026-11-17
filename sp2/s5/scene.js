// 特别篇 2 · 第 5 段：填空速算——由 E 读出 L（2017–18 第 1(ii) 题）+ 2025–26 第 3 题回看卡 + 本集收尾。
// 分镜：原题三步 → E₁、E₂ 上屏，非对角格翻译成行操作 → 大肥鱼“先乘再求逆”：E₂E₁ 乘出来冒出 −6（红闪）
//       → 秒算：两枚逆印章变号、按 E₁⁻¹E₂⁻¹ 顺序原位落下 → L → 顺序反了也冒 −6（串味动画）
//       → 验算 L U 第二行 → 回看卡（最新卷第 3 题：L、U、拆成三枚逆印章）→ 口诀“变号、原位、不用乘”大字 → 下集预告。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'ds_ask', 'ds_happy', 'ds_proud', 'gpt_proud', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1718_f2', 'y2526_q3']);
  const B = base(R, {
    assets, label: '特别篇 2 · LU 与初等矩阵', title: '由 E 读出 L', hi: 5, en: 'READ L FROM E · FILL-IN',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C03: 0.4, C04: 0.6, C07: 0.8, C09: 0.8 },
    post: { C01: 1.0, C02: 1.4, D01: 0.8, C03: 1.6, C04: 1.6, C05: 1.8, C06: 1.6, G01: 1.6, C07: 1.6, C08: 1.6, C09: 2.0, D03: 0.6, G02: 2.4 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tMul = cue('C03', '乘出来以后'), tSix = cue('C03', '负六'), tFast = cue('C04', '每个逆就是变号'), tDrop = cue('C04', '原位落下');

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  TL.sfx('pluck', cue('C02', '第二行减去两倍'), 0.3); TL.sfx('pluck', cue('C02', '第三行加上三倍'), 0.3);
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('swoosh_soft', tMul, 0.3); TL.sfx('buzz', tSix, 0.3); TL.sfx('glitch', tSix + 0.1, 0.25);
  TL.sfx('zap', tFast, 0.25); TL.sfx('zap', tFast + 0.4, 0.25); TL.sfx('whoosh', tDrop, 0.3); TL.sfx('pluck', tDrop + 0.6, 0.3); TL.sfx('pluck', tDrop + 0.9, 0.3);
  TL.sfx('impact', cue('C05', '所以L的三行'), 0.3); ['变号', '原位', '不用乘'].forEach(w => TL.sfx('tick2', cue('C05', w), 0.3));
  TL.sfx('pop', s('D02') + 0.2, 0.25); TL.sfx('buzz', cue('C06', '冒出一个负六'), 0.25);
  TL.sfx('check', cue('G01', '等于四、十一、五'), 0.3);
  TL.sfx('swoosh_in', s('C07') + 0.2, 0.3); TL.sfx('stamp', cue('C08', '完整过程'), 0.25);
  TL.sfx('swell', s('C09') - 0.2, 0.3); TL.sfx('impact', cue('C09', '变号、原位、不用乘'), 0.35); TL.sfx('sparkle', s('D03') + 0.2, 0.3); TL.sfx('bell_soft', e('G02') + 0.3, 0.35);

  function shotRead() {
    const a = B.win(s('C02'), s('C07') - 0.3); if (a <= 0) return;
    B.qhead('2017–2018 · 填空 1(ii)：E₂E₁A = U，求 L', a);
    const g = a * gin(s('C02'));
    const M1 = B.mat(DX - 250, DY - 220, [[1, 0, 0], [-2, 1, 0], [0, 0, 1]], { px: 34, a: g, cell: (i, j) => i === 1 && j === 0 ? { col: C.peri } : null });
    const M2 = B.mat(DX + 150, DY - 220, [[1, 0, 0], [0, 1, 0], [0, 3, 1]], { px: 34, a: g, cell: (i, j) => i === 2 && j === 1 ? { col: C.j } : null });
    ctag('E₁ =', DX - 380, DY - 220, { px: 30, a: g, font: F.serif }); ctag('E₂ =', DX + 20, DY - 220, { px: 30, a: g, font: F.serif });
    const g1 = a * gin(cue('C02', '第二行减去两倍')) * (1 - gin(s('D01'))), g2 = a * gin(cue('C02', '第三行加上三倍')) * (1 - gin(s('D01')));
    if (g1 > 0) K.ring(...M1.cell(1, 0), 26, C.peri, g1, 1); ctag('r₂ − 2r₁', DX - 250, DY - 90, { px: 30, a: g1, color: C.peri, font: F.serif });
    if (g2 > 0) K.ring(...M2.cell(2, 1), 26, C.j, g2, 1); ctag('r₃ + 3r₂', DX + 150, DY - 90, { px: 30, a: g2, color: C.j, font: F.serif });
    // 慢路：E₂E₁ 乘出来
    const gs = a * B.win(s('D01'), tFast - 0.2);
    if (gs > 0) {
      ctag('E₂E₁ =', DX - 120, DY + 40, { px: 32, a: gs * gin(tMul), font: F.serif });
      const MP = B.mat(DX + 30, DY + 40, [[1, 0, 0], [-2, 1, 0], [-6, 3, 1]], { px: 34, a: gs * gin(tMul), cell: (i, j) => i === 2 && j === 0 ? { col: C.free } : null });
      if (B.t > tSix) { K.ring(...MP.cell(2, 0), 30, C.free, gs, prog(B.t, tSix, tSix + 0.4), 5); B.burst(...MP.cell(2, 0), tSix, C.free, { r1: 120 }); }
      ctag('L 里根本没有 −6', DX + 250, DY + 120, { px: 28, a: gs * gin(tSix + 0.3), color: C.free });
      K.glitch(tSix, tSix + 0.4, 0.4);
    }
    // 快路
    const gf = a * gin(tFast - 0.2);
    if (gf > 0) {
      ctag('L = (E₂E₁)⁻¹ = E₁⁻¹ E₂⁻¹', DX, DY - 30, { px: 36, a: gf, color: C.ink, font: F.serif });
      const fl1 = gin(tFast, 0.4), fl2 = gin(tFast + 0.4, 0.4);
      ctag(fl1 > 0.5 ? '+2' : '−2', DX - 200, DY + 60, { px: 40, a: gf * (1 - gin(tDrop + 0.4)), color: C.peri, font: F.serif });
      ctag(fl2 > 0.5 ? '−3' : '3', DX + 200, DY + 60, { px: 40, a: gf * (1 - gin(tDrop + 0.7)), color: C.j, font: F.serif });
      const ML = B.mat(DX, DY + 190, [[1, 0, 0], [2, 1, 0], [0, -3, 1]], { px: 40, a: gf * gin(tDrop - 0.3), cell: (i, j) => (i === 1 && j === 0) ? { col: C.peri, a: gin(tDrop + 0.6) } : (i === 2 && j === 1) ? { col: C.j, a: gin(tDrop + 0.9) } : null });
      [[DX - 200, DY + 60, ML.cell(1, 0), tDrop, C.peri, '2'], [DX + 200, DY + 60, ML.cell(2, 1), tDrop + 0.3, C.j, '−3']].forEach(([x, y, q, t0, col, tx]) => { const u = prog(B.t, t0, t0 + 0.6); if (u > 0 && u < 1) B.fly([x, y], q, u, col, { lift: 60, r: 10, txt: tx, px: 30 }); });
      ctag('L =', DX - ML.w / 2 - 60, DY + 190, { px: 34, a: gf * gin(tDrop - 0.3), color: C.peri, font: F.serif });
      ['变号', '原位', '不用乘'].forEach((w, k) => K.pill(w, DX - 200 + k * 200, DY + 330, [C.peri, C.j, OK][k], a * gin(cue('C05', w)) * (1 - gin(s('D02'))), 28));
      // 顺序反了
      const gr = a * B.win(s('D02'), s('G01') - 0.1);
      if (gr > 0) { B.card(DX, DY + 330, 760, 76, gr, C.free); ctag('E₂⁻¹E₁⁻¹ = [[1,0,0],[2,1,0],[−6,−3,1]] → 串味', DX, DY + 330, { px: 26, a: gr * gin(cue('C06', '冒出一个负六')), color: C.free, font: F.serif }); }
      const gG = a * gin(s('G01'));
      if (gG > 0) { B.card(DX, DY + 330, 860, 76, gG, C.gpt); ctag('验：U = [[2,4,2],[0,3,1],[0,0,8]]，LU 第 2 行 = 2(2,4,2) + (0,3,1) = (4, 11, 5)', DX, DY + 330, { px: 22, a: gG, color: C.gpt, font: F.serif }); }
    }
  }

  function shotReview() {
    const a = B.win(s('C07') + 3.4, s('C09') - 0.2); if (a <= 0) return;
    B.card(DX + 40, DY + 40, 880, 360, a * 0.95, C.i);
    ctag('回看卡 · 2025–26 第 3 题', DX + 40, DY - 110, { px: 28, a, color: C.i });
    B.mat(DX - 160, DY - 10, [[1, 0, 0], [-1, 1, 0], [-1, -2, 1]], { px: 30, a: a * gin(cue('C07', 'L的三行')), cell: (i, j) => i > j ? { col: C.peri } : null });
    ctag('L', DX - 160, DY + 90, { px: 26, a, color: C.peri, font: F.serif });
    B.mat(DX + 220, DY - 10, [[1, 0, 1], [0, 1, 2], [0, 0, 1]], { px: 30, a: a * gin(cue('C07', 'U的三行')) });
    ctag('U', DX + 220, DY + 90, { px: 26, a, font: F.serif });
    ctag('A = E₁⁻¹E₂⁻¹E₃⁻¹ U   → 第 1 章复习（下）', DX + 40, DY + 170, { px: 28, a: a * gin(cue('C08', '拆回三枚逆印章')), color: C.peri, font: F.serif });
  }

  function shotOutro() {
    const a = B.win(s('C09'), 1e9); if (a <= 0) return;
    const t0 = cue('C09', '变号、原位、不用乘'), k = lerp(1.6, 1, outBack(prog(B.t, t0, t0 + 0.6), 2));
    ctx.save(); ctx.translate(DX, DY - 140); ctx.scale(k, k); ctx.translate(-DX, -(DY - 140));
    ctag('变号 · 原位 · 不用乘', DX, DY - 140, { px: 72, a: a * gin(t0), color: C.peri, font: F.serif }); ctx.restore();
    B.burst(DX, DY - 140, t0 + 0.1, C.peri, { r1: 420, n: 26 });
    ctag('七年七考的 10 分，稳了', DX, DY - 30, { px: 34, a: a * gin(cue('C09', '七年考了七次')), color: OK });
    const gn = a * gin(s('D03'));
    K.pill('下一集 · 行列式', DX, DY + 110, C.i, gn, 32);
    // 单位立方体被拉伸（预告）
    const gc = a * gin(s('G02')), sh = smoother(prog(B.t, cue('G02', '拉伸'), cue('G02', '拉伸') + 1.4));
    if (gc > 0) {
      const ox = DX - 60, oy = DY + 300, u = 90, M = [[1 + 0.5 * sh, 0.4 * sh], [0.2 * sh, 1 + 0.3 * sh]];
      const P = (x, y, z) => [ox + (M[0][0] * x + M[0][1] * y) * u + z * u * 0.5, oy - (M[1][0] * x + M[1][1] * y) * u * 0.6 - z * u * 0.6 + y * 0];
      const V = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map(p => P(...p));
      [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => B.line2(V[i], V[j], C.i, gc * 0.9, 3));
      ctag('det = 体积缩放', DX + 200, DY + 280, { px: 28, a: gc * gin(cue('G02', '拉伸') + 1), color: C.i });
      ctag('余子式：偷梁换柱', DX + 200, DY + 330, { px: 28, a: gc * gin(cue('G02', '偷梁换柱')), color: C.peri });
    }
  }

  function draw(t) {
    B.frame(t, () => {
      shotRead(); shotReview(); shotOutro();
      B.paper(EX, 'y1718_f2', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C07') - 0.4 });
      B.paper(EX, 'y2526_q3', { t0: s('C07') + 0.2, dock: s('C07') + 3.4, out: s('C09') - 0.4 });
    });
  }
  return { TL, draw };
}
