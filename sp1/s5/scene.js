// 特别篇 1 · 第 5 段：自由变量 ≠ 无穷多解（2017–18 第 1(i) 题；2023–24 第 1(5) 题 = 2022–23 第 1(8) 题）。
// 分镜：原题三步 → B 上屏，大肥鱼“直接读”→ 第一行第二格 −1 红框闪烁 → r₁ + r₂ 翻牌成最简形
//       → 三行依次读出（自由列粉色）→ 通解向量 → 代回原 B 第一行自检
//       → 判断题纸卡（“一字不差考两次”角标）→ 左右分屏：齐次 / 非齐次，右侧 0 = 1 炸开 → ✗ 错 印章
//       → 左侧齐次：x = 0 永远是解 + 自由变量 ⇒ 无穷多 → 评分点 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_happy', 'ds_proud', 'gpt_cross', 'gpt_point', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1718_f1', 'y2324_f5']);
  const B = base(R, {
    assets, label: '特别篇 1 · 方程组与参数讨论', title: '自由变量 ≠ 无穷多解', hi: 5, en: 'FREE VARIABLE ≠ INFINITELY MANY',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C03: 0.4, C06: 0.8, C07: 0.4, G03: 0.4, C11: 0.6 },
    post: { C02: 1.0, G01: 1.2, C03: 1.6, C04: 1.4, C05: 1.6, G02: 1.4, D02: 0.6, C07: 1.6, C08: 1.6, C09: 1.2, C10: 1.6, G03: 1.4, C11: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const S = [[[1, -1, 0, -2], [0, 1, 0, 1], [0, 0, 1, -1]], [[1, 0, 0, -1], [0, 1, 0, 1], [0, 0, 1, -1]]];
  const tR = cue('C03', '第一行加上第二行'), T = [0, tR + 0.3], OPS = [null, [[0, 'r₁ + r₂']]];
  const tBoom = cue('C07', '零等于一');

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  TL.sfx('pop', cue('C02', '同解'), 0.25); TL.sfx('pop', s('D01') + 0.3, 0.25);
  TL.sfx('buzz', cue('G01', '负一'), 0.3); TL.sfx('slam', s('G01') + 0.1, 0.25);
  TL.sfx('swoosh_soft', T[1], 0.3); TL.sfx('marimba', T[1] + 0.4, 0.25);
  ['x一等于x四', 'x二等于负x四', 'x三等于x四'].forEach(w => TL.sfx('tick', cue('C04', w), 0.28)); TL.sfx('impact', s('C05') + 0.3, 0.3);
  TL.sfx('check', cue('G02', '等于零'), 0.3);
  TL.sfx('whoosh', s('C06') + 0.2, 0.3); TL.sfx('stamp', s('C06') + 2.6, 0.3); TL.sfx('ding_lo', cue('C06', '一字不差'), 0.3);
  TL.sfx('pop', s('D02') + 0.2, 0.25);
  TL.sfx('swoosh_in', s('C07') + 0.1, 0.3); TL.sfx('glitch', tBoom, 0.35); TL.sfx('crack', tBoom + 0.1, 0.3);
  TL.sfx('stamp', cue('C08', '所以答案是错'), 0.35);
  TL.sfx('ding_hi', cue('C09', '这句话是对的'), 0.3); TL.sfx('check', cue('C10', '无穷多个'), 0.3);
  TL.sfx('zap', s('G03') + 0.3, 0.25); TL.sfx('swell', s('C11') - 0.2, 0.3);

  function shotRead() {
    const a = B.win(s('C02'), s('C06') - 0.3); if (a <= 0) return;
    B.qhead('2017–2018 · 填空 1(i)', a);
    const { M } = K.steps(S, T, OPS, { x: DX + 60, y: DY - 210, px: 40, a, hi: (i, j, k) => j === 3 && B.t > cue('C04', 'x一等于x四') ? C.free : null });
    ctag(B.t < T[1] ? 'B =' : 'RREF =', DX + 60 - M.w / 2 - 80, DY - 210, { px: 32, a, color: C.inkMid, font: F.serif });
    ctag('A ~ B ⇒ Ax = 0 与 Bx = 0 同解', DX + 60, DY - 60, { px: 30, a: a * B.win(cue('C02', '同解'), s('C04')), color: C.ink });
    // 大肥鱼直接读
    const gd = a * B.win(s('D01') + 0.3, tR);
    ctag('x₁ = 2x₄ ?', DX + 60, DY + 40, { px: 40, a: gd, color: C.ds, font: F.serif });
    B.cross(DX + 60, DY + 40, prog(B.t, s('G01') + 0.2, s('G01') + 0.6), gd, 46);
    // −1 红框
    const gr = a * B.win(s('G01'), T[1] + 0.3);
    if (gr > 0) { const [x, y] = M.cell(0, 1), p = 0.6 + 0.4 * Math.sin(B.t * 10); ctx.save(); ctx.globalAlpha = gr * p; ctx.strokeStyle = C.free; ctx.lineWidth = 5; ctx.strokeRect(x - 38, y - 30, 76, 60); ctx.restore(); }
    ctag('阶梯形 ≠ 最简形', DX + 60, DY + 120, { px: 34, a: a * B.win(cue('G01', '只是阶梯形'), T[1]), color: C.free });
    // 读出
    const g4 = a * gin(s('C04'));
    if (g4 > 0) {
      if (B.t < s('G02') + 2) K.colBox(M, 3, 0, 2, C.free, g4 * 0.8, 24);
      [['x₁ = x₄', 'x一等于x四'], ['x₂ = −x₄', 'x二等于负x四'], ['x₃ = x₄', 'x三等于x四'], ['x₄ = t', '令x四等于t']].forEach(([tx, w], k) => ctag(tx, DX - 240 + k * 200, DY - 40, { px: 34, a: a * gin(cue('C04', w)), color: k === 3 ? C.free : C.ink, font: F.serif }));
      const gv = a * gin(s('C05') + 0.3);
      ctag('x = t', DX - 40, DY + 120, { px: 40, a: gv, font: F.serif });
      K.cvec(DX + 80, DY + 120, [1, '−1', 1, 1], gv, { px: 30, col: C.free });
      ctag('t ∈ ℝ', DX + 200, DY + 120, { px: 32, a: gv, color: C.inkMid, font: F.serif });
      B.burst(DX + 80, DY + 120, s('C05') + 0.4, C.free, { r1: 200 });
      const gc = a * gin(s('G02'));
      B.card(DX + 60, DY + 300, 820, 76, gc * 0.95, C.gpt);
      ctag('自检（原 B 第一行）：1 − (−1) + 0 − 2·1 = 0 ✓', DX + 60, DY + 300, { px: 28, a: gc, color: C.gpt, font: F.serif });
    }
  }

  function shotTF() {
    const a = B.win(s('C06') + 3.5, s('C11') - 0.2); if (a <= 0) return;
    B.qhead('判断：RREF 有自由变量 ⇒ Ax = b 有无穷多解', a);
    K.pill('2023–24 · 2022–23 一字不差', DX, DY - 340, C.free, a * gin(cue('C06', '一字不差')), 22);
    const gD = a * B.win(s('D02'), s('C07'));
    K.redStamp('对！？', DX, DY - 120, prog(B.t, s('D02') + 0.3, s('D02') + 0.7), gD, C.ds, 60);
    // 左右分屏
    const gs = a * gin(s('C07'));
    if (gs > 0) {
      const xl = DX - 230, xr = DX + 230;
      ctx.save(); ctx.globalAlpha = gs * 0.5; ctx.strokeStyle = C.inkMid; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(DX, DY - 280); ctx.lineTo(DX, DY + 300); ctx.stroke(); ctx.restore();
      ctag('齐次 Ax = 0', xl, DY - 250, { px: 32, a: gs, color: OK }); ctag('非齐次 Ax = b', xr, DY - 250, { px: 32, a: gs, color: C.free });
      const boom = prog(B.t, tBoom, tBoom + 0.6), shake = boom > 0 && boom < 1 ? Math.sin(B.t * 80) * 8 * (1 - boom) : 0;
      const M = B.mat(xr + shake, DY - 120, [[1, 1, 0], [0, 0, 1]], { px: 40, a: gs, bar: 2, cell: (i, j) => i === 1 ? { col: B.t > tBoom ? C.free : C.ink } : j === 1 ? { col: C.i } : null });
      ctag('x₂ 自由', xr, DY - 20, { px: 26, a: gs * gin(cue('C07', '自由变量')), color: C.i });
      if (B.t > tBoom) { K.rowBox(M, 1, 0, 2, C.free, gs, 22); B.burst(xr, DY - 95, tBoom, C.free, { r1: 200, n: 24 }); B.flash(tBoom, 0.25, 0.3, C.free); }
      ctag('0 = 1 → 无解', xr, DY + 30, { px: 34, a: gs * gin(tBoom + 0.3), color: C.free, font: F.serif });
      K.glitch(tBoom, tBoom + 0.5, 0.6);
      B.stamp(xr, DY + 170, false, prog(B.t, cue('C08', '所以答案是错'), cue('C08', '所以答案是错') + 0.5), gs, '✗ 错');
      ctag('自由变量只管“有解时有多少”', DX, DY + 300, { px: 28, a: gs * gin(cue('C08', '自由变量只决定')), color: C.ink });
      // 左：齐次
      const gl = gs * gin(s('C09'));
      B.mat(xl, DY - 120, [[1, 1, 0], [0, 0, 0]], { px: 40, a: gl, bar: 2 });
      ctag('x = 0 永远是解', xl, DY - 10, { px: 30, a: gs * gin(cue('C10', '总是解')), color: OK });
      ctag('+ 自由变量 ⇒ 无穷多', xl, DY + 40, { px: 30, a: gs * gin(cue('C10', '再加上')), color: OK });
      B.stamp(xl, DY + 170, true, prog(B.t, cue('C09', '这句话是对的'), cue('C09', '这句话是对的') + 0.5), gl);
      const gG = gs * gin(s('G03'));
      B.card(DX, DY + 300, 820, 76, gG, C.gpt);
      ctag('答 F + 2×2 反例；只写 F → 一半分', DX, DY + 300, { px: 30, a: gG, color: C.gpt });
    }
  }

  function shotOutro() {
    const a = B.win(s('C11'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 读解', ['① 读解之前，先化到最简形', '② 自由变量 ⇏ 有解（先查 0 = 非零）', '③ 判断题 = 结论 + 反例'],
      [s('C11') + 0.3, cue('C11', '自由变量不保证'), cue('C11', '判断题')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotRead(); shotTF(); shotOutro();
      B.paper(EX, 'y1718_f1', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C06') - 0.4 });
      B.paper(EX, 'y2324_f5', { t0: s('C06') + 0.2, dock: s('C06') + 3.5, out: s('C11') - 0.4 });
    });
  }
  return { TL, draw };
}
