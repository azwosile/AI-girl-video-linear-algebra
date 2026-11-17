// 特别篇 5 · 第 6 段：反过来——已知 S 求新基（2015–16 第 3 题）+ 本集总结 + 下集预告。
// 分镜：原题：2D 平面 v₁、v₂ 已知，u₁、u₂ 两个问号 → S = U⁻¹V 两边变形 → U = VS⁻¹ → S⁻¹ → V·S⁻¹ 逐列点乘 → u₁ = (0,−1)、u₂ = (1,5)
//       → u 网格铺开，v₁ 被量出 4 格 u₁ + 2 格 u₂ → “S 的第 j 列 = v_j 在 u 下的坐标”大字
//       → 四张套路卡扇形展开 → 下一集：RREF 反推，原题有 bug（glitch）。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_confused', 'ds_shock', 'ds_think', 'gpt_proud', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1516_q3']);
  const B = base(R, {
    assets, label: '特别篇 5 · 过渡矩阵', title: '已知 S 求新基', hi: 6, en: '2015–16 · Q3 · REVERSE',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C07: 0.8, G02: 0.6 },
    post: { C01: 1.6, D01: 0.6, C02: 2.0, C03: 2.0, C04: 2.0, C05: 2.0, G01: 2.2, D02: 0.8, C06: 2.2, C07: 2.6, G02: 1.4, D03: 0.4, C08: 2.4 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const CARDS = ['先写定义式', '到谁就用谁的逆', '[目标 | 出发] 一次消元', 'S 的列 = 旧基新坐标'];
  const tC = ['先写定义式', '到谁就用谁的逆', '一次消元', 'S的列'].map(w => cue('C07', w));
  const tu1 = cue('C04', '所以u一等于零、负一'), tu2 = cue('C05', '所以u二等于一、五');

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25);
  TL.sfx('swoosh_soft', cue('C02', '两边左乘U'), 0.28); TL.sfx('swoosh_soft', cue('C02', '再右乘S逆'), 0.28); TL.sfx('ding', cue('C02', '得到U等于V乘S逆'), 0.3);
  TL.sfx('impact', cue('C03', '也就是'), 0.28); TL.sfx('laser', s('C04') + 1, 0.22); TL.sfx('ding_hi', tu1, 0.3); TL.sfx('ding_hi', tu2, 0.3);
  TL.sfx('hum', s('G01') + 0.2, 0.2); TL.sfx('marimba', cue('G01', '等于四u一加二u二'), 0.25); TL.sfx('check', cue('G01', '正是v一'), 0.3);
  TL.sfx('sparkle', s('D02') + 0.2, 0.25); TL.sfx('impact', cue('C06', 'S的第j列'), 0.32);
  tC.forEach(t => TL.sfx('swoosh_in', t, 0.22)); TL.sfx('glitch', cue('G02', '有bug'), 0.3); TL.sfx('sting', s('D03') + 0.1, 0.22); TL.sfx('bell_soft', e('C08') + 0.3, 0.35);

  const u = 34, ox = DX + 260, oy = DY + 90;
  const P = (x, y) => [ox + x * u, oy - y * u];
  function plane(a) {
    if (a <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(DX - 60, DY - 260, 660, 600); ctx.clip();
    for (let k = -9; k <= 9; k++) { B.line2(P(k, -9), P(k, 9), C.inkMid, a * 0.15, 1); B.line2(P(-9, k), P(9, k), C.inkMid, a * 0.15, 1); }
    const gN = gin(s('G01'));
    if (gN > 0) { const b1 = [0, -1], b2 = [1, 5], T2 = (x, y) => P(x * b1[0] + y * b2[0], x * b1[1] + y * b2[1]);
      for (let k = -6; k <= 6; k++) { B.line2(T2(k, -3), T2(k, 3), C.j, a * gN * 0.35, 1.5); B.line2(T2(-8, k), T2(8, k), C.j, a * gN * 0.35, 1.5); } }
    arrow(ctx, P(0, 0), P(2, 6), { color: C.i, width: 6, head: 16, alpha: a }); ctag('v₁', ...P(2.8, 6), { px: 26, a, color: C.i, font: F.serif });
    arrow(ctx, P(0, 0), P(1, 4), { color: C.k, width: 6, head: 16, alpha: a }); ctag('v₂', ...P(-0.2, 4.4), { px: 26, a, color: C.k, font: F.serif });
    const g1 = a * gin(tu1), g2 = a * gin(tu2);
    if (B.t < tu1) ctag('u₁ ?', ...P(3, -2), { px: 30, a: a * gin(s('C01') + 1.5), color: C.peri }); else { arrow(ctx, P(0, 0), P(0, -1), { color: C.peri, width: 6, head: 14, alpha: g1 }); ctag('u₁', ...P(0.8, -1.4), { px: 26, a: g1, color: C.peri, font: F.serif }); }
    if (B.t < tu2) ctag('u₂ ?', ...P(4, 2), { px: 30, a: a * gin(s('C01') + 1.8), color: C.j }); else { arrow(ctx, P(0, 0), P(1, 5), { color: C.j, width: 6, head: 14, alpha: g2 }); ctag('u₂', ...P(1.8, 5.2), { px: 26, a: g2, color: C.j, font: F.serif }); }
    // 量 v₁ = 4u₁ + 2u₂
    const tm = cue('G01', '等于四u一加二u二');
    if (B.t > tm) { const m1 = smoother(prog(B.t, tm, tm + 1)), m2 = smoother(prog(B.t, tm + 1, tm + 2));
      arrow(ctx, P(0, 0), P(0, -4 * m1), { color: C.peri, width: 4, head: 12, alpha: a * 0.9 });
      if (m2 > 0) arrow(ctx, P(0, -4), P(2 * m2, -4 + 10 * m2), { color: C.j, width: 4, head: 12, alpha: a * 0.9 });
      ctag('4u₁ + 2u₂', ...P(-2.6, -3), { px: 24, a: a * gin(tm + 2), color: OK, font: F.serif }); }
    ctx.restore();
  }

  function shotSolve() {
    const a = B.win(s('C01') + 0.6, s('C07') - 0.2); if (a <= 0) return;
    B.qhead('2015–16 · 第 3 题：已知 v₁, v₂ 和 S，求 u₁, u₂', a);
    plane(a);
    const x = DX - 330;
    ctag('S = [[4, 1], [2, 1]]', x, DY - 270, { px: 30, a: a * gin(s('C01') + 1.2), color: C.ink, font: F.serif });
    const g2 = a * gin(s('C02'));
    ctag('S = U⁻¹V', x, DY - 200, { px: 34, a: g2 * gin(cue('C02', '从V到U的过渡矩阵')), font: F.serif });
    ctag('⇒ US = V', x, DY - 150, { px: 34, a: g2 * gin(cue('C02', '两边左乘U')), font: F.serif });
    ctag('⇒ U = V S⁻¹', x, DY - 100, { px: 38, a: g2 * gin(cue('C02', '再右乘S逆')), color: C.peri, font: F.serif });
    const g3 = a * gin(s('C03'));
    if (g3 > 0) { ctag('det S = 2', x - 140, DY - 20, { px: 26, a: g3, color: C.i, font: F.serif });
      const M = B.mat(x + 90, DY - 10, [['½', '−½'], [-1, 2]], { px: 30, a: g3 * gin(cue('C03', '也就是')), cell: () => ({ col: C.i }) }); ctag('S⁻¹ =', x + 90 - M.w / 2 - 50, DY - 10, { px: 26, a: g3 * gin(cue('C03', '也就是')), color: C.i, font: F.serif }); }
    const g4 = a * gin(s('C04'));
    if (g4 > 0) {
      const MV = B.mat(x - 120, DY + 140, [[2, 1], [6, 4]], { px: 30, a: g4 }); ctag('V', x - 120, DY + 70, { px: 24, a: g4, color: C.inkMid, font: F.serif });
      const MS = B.mat(x + 20, DY + 140, [['½', '−½'], [-1, 2]], { px: 30, a: g4, cell: () => ({ col: C.i }) });
      ctag('=', x + 110, DY + 140, { px: 32, a: g4, font: F.serif });
      const MU = B.mat(x + 200, DY + 140, [[0, 1], [-1, 5]], { px: 30, a: g4, cell: (i, j) => ({ col: j ? C.j : C.peri, a: gin(j ? tu2 : tu1) }) });
      if (B.t < tu1 + 0.6) K.colBox(MS, 0, 0, 1, C.peri, g4, 12); else if (B.t < tu2 + 0.6) K.colBox(MS, 1, 0, 1, C.j, g4 * gin(s('C05')), 12);
      ctag('U', x + 200, DY + 70, { px: 24, a: g4, color: OK, font: F.serif });
      ctag('u₁ = (0, −1)', x - 80, DY + 250, { px: 30, a: g4 * gin(tu1), color: C.peri, font: F.serif });
      ctag('u₂ = (1, 5)', x + 160, DY + 250, { px: 30, a: a * gin(tu2), color: C.j, font: F.serif });
    }
    const gG = a * gin(s('G01'));
    B.card(DX + 270, DY - 300, 600, 70, gG * 0.95, C.gpt); ctag('S 第 1 列 (4, 2)：v₁ = 4u₁ + 2u₂ = (2, 6) ✓', DX + 270, DY - 300, { px: 24, a: gG * gin(cue('G01', '正是v一')), color: C.gpt, font: F.serif });
    const g6 = a * gin(cue('C06', 'S的第j列'));
    if (g6 > 0) { B.card(DX, DY + 320, 1000, 80, g6, OK); ctag('S 的第 j 列 = vⱼ 在 u 下的坐标', DX, DY + 320, { px: 36, a: g6, color: OK, font: F.serif }); }
  }

  function shotOutro() {
    const a = B.win(s('C07'), 1e9); if (a <= 0) return;
    const gc = a * (1 - gin(s('G02') + 0.4) * 0.7);
    CARDS.forEach((tx, k) => { const uu = outBack(prog(B.t, tC[k], tC[k] + 0.5), 1.6), ang = (k - 1.5) * 0.15 * uu, x = DX + (k - 1.5) * 250 * uu, y = DY - 70 + Math.abs(k - 1.5) * 24 * uu, col = [C.peri, C.i, C.j, OK][k];
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.translate(-x, -y);
      B.card(x, y, 230, 270, gc * gin(tC[k]), col); ctag(String(k + 1), x, y - 85, { px: 50, a: gc * gin(tC[k]), color: col, font: F.serif });
      tx.match(/.{1,6}/g).forEach((ln, q) => ctag(ln, x, y - 10 + q * 38, { px: 26, a: gc * gin(tC[k]), color: C.ink }));
      ctx.restore(); });
    const gn = a * gin(s('G02'));
    K.pill('下一集 · 压轴：RREF 反推（24 分）', DX, DY + 190, C.i, gn, 32);
    const gb = a * gin(cue('G02', '有bug'));
    if (gb > 0) { K.glitch(cue('G02', '有bug'), cue('G02', '有bug') + 0.5, 0.6); ctag('原题本身就有 bug', DX, DY + 260, { px: 32, a: gb, color: C.free }); }
    ctag('下一集揭晓', DX, DY + 330, { px: 30, a: a * gin(s('C08')), color: C.peri });
  }

  function draw(t) {
    B.frame(t, () => {
      shotSolve(); shotOutro();
      B.paper(EX, 'y1516_q3', { t0: s('C01') + 0.2, dock: s('D01'), out: s('C07') - 0.4 });
    });
  }
  return { TL, draw };
}
