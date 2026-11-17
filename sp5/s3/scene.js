// 特别篇 5 · 第 3 段：再练一题（2017–18 第 7 题，15 分）——大肥鱼主刀。
// 分镜：原题（右上角计时器）→ 大肥鱼念口诀“到 u，就用 u 的逆” → [U | V] 六步消元（DS 蓝标签，Claude 点头 ✓）
//       → S 浮出 → 分屏两条路：左路 x = (8,11,9) 再解 Uc = x；右路 S × (2,3,−4)；两路同时到达 (7,5,−2)
//       → GPT 验算 → 标准网格扭成斜网格，向量钉住不动、坐标数字在变 → 什么时候走哪条路 → 大肥鱼“我一个人做完了！”。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_write', 'ds_happy', 'ds_proud', 'ds_think', 'gpt_point', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1718_q7']);
  const B = base(R, {
    assets, label: '特别篇 5 · 过渡矩阵', title: '再练一题：大肥鱼主刀', hi: 3, en: '2017–18 · Q7 · 15 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C04: 0.6, D04: 0.4 },
    post: { C01: 1.6, C02: 1.4, D01: 1.0, D02: 1.6, D03: 6.0, C03: 1.8, C04: 2.0, C05: 2.4, G01: 2.0, G02: 2.4, D04: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const S = [
    [[1, 1, 2, 4, 0, 0], [1, 2, 3, 6, 1, 1], [1, 2, 4, 7, 1, 2]],
    [[1, 1, 2, 4, 0, 0], [0, 1, 1, 2, 1, 1], [0, 1, 2, 3, 1, 2]],
    [[1, 1, 2, 4, 0, 0], [0, 1, 1, 2, 1, 1], [0, 0, 1, 1, 0, 1]],
    [[1, 1, 2, 4, 0, 0], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1]],
    [[1, 1, 0, 2, 0, -2], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1]],
    [[1, 0, 0, 1, -1, -2], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1]],
  ];
  const t0 = cue('D03', '第二行减第一行'), tE = e('D03') + 4.6;
  const T = [0, t0 + 0.4, cue('D03', '再用第三行减第二行'), cue('D03', '再往上消') + 0.4, cue('D03', '再往上消') + 2.0, cue('D03', '再往上消') + 3.6];
  const OPS = [null, [[1, 'r₂ − r₁'], [2, 'r₃ − r₁']], [[2, 'r₃ − r₂']], [[1, 'r₂ − r₃']], [[0, 'r₁ − 2r₃']], [[0, 'r₁ − r₂']]];
  const Sm = [[1, -1, -2], [1, 1, 0], [1, 0, 1]];

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('tick2', s('C01') + 1.0, 0.2);
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('ding', cue('D01', '就用u的逆'), 0.28); TL.sfx('swoosh_in', s('D02') + 0.3, 0.28);
  T.slice(1).forEach(t => { TL.sfx('swoosh_soft', t, 0.22); TL.sfx('marimba', t + 0.4, 0.2); TL.sfx('check', t + 1.0, 0.16); });
  TL.sfx('impact', s('C03') + 0.3, 0.32); TL.sfx('laser', cue('C04', '二减三加八'), 0.25); TL.sfx('ding_hi', cue('C04', '也就是七、五、负二'), 0.3);
  TL.sfx('swoosh_soft', s('C05') + 0.3, 0.25); TL.sfx('ding_hi', cue('C05', '也得到七、五、负二'), 0.3); TL.sfx('check', cue('G01', '两条路互相验证'), 0.3);
  TL.sfx('warp', s('G02') + 0.4, 0.25); TL.sfx('sparkle', s('D04') + 0.2, 0.3); TL.sfx('bell_soft', e('D04') + 0.4, 0.3);

  function timer(a) {
    if (a <= 0) return; const el = Math.max(0, B.t - s('C01'));
    const mm = Math.floor(el / 60), ss = Math.floor(el % 60);
    B.card(DX + 520, DY - 330, 160, 64, a, C.i); ctag(`${mm}:${String(ss).padStart(2, '0')}`, DX + 520, DY - 330, { px: 32, a, color: C.i, font: F.serif });
  }

  function shotElim() {
    const a = B.win(s('C02'), s('C04') - 0.2); if (a <= 0) return;
    B.qhead('2017–18 · 第 7 题：① v → u 的过渡矩阵  ② x = 2v₁ + 3v₂ − 4v₃ 的 u 坐标', a, B.t > s('D01') ? C.ds : C.peri);
    const gd = a * B.win(s('D01'), s('D02') + 0.4);
    ctag('到 u，就用 u 的逆：S = U⁻¹V', DX, DY - 200, { px: 40, a: gd * gin(cue('D01', '就用u的逆')), color: C.ds, font: F.serif });
    const g = a * gin(s('D02') + 0.3);
    if (g > 0) {
      const { M, k } = K.steps(S, T, OPS, { x: DX + 60, y: DY - 60, px: 36, bar: 3, a: g, cw: 86, hi: (i, j, k) => k === 0 ? (j < 3 ? C.peri : C.j) : (k === 5 && j >= 3 ? OK : null) });
      ctag('U', M.cell(0, 1)[0], DY - 60 - M.h / 2 - 30, { px: 26, a: g * (1 - gin(T[5])), color: C.peri, font: F.serif });
      ctag('V', M.cell(0, 4)[0], DY - 60 - M.h / 2 - 30, { px: 26, a: g * (1 - gin(T[5])), color: C.j, font: F.serif });
      // Claude 点头
      T.slice(1).forEach(t => { if (B.t > t + 1.0 && B.t < t + 1.8) ctag('✓', DX + 60 + M.w / 2 + 50, DY - 60, { px: 40, a: g * (1 - prog(B.t, t + 1.4, t + 1.8)), color: OK }); });
    }
    const g3 = a * gin(s('C03'));
    if (g3 > 0) { const M2 = B.mat(DX, DY + 190, Sm, { px: 36, a: g3, cell: () => ({ col: OK }) }); ctag('S =', DX - M2.w / 2 - 50, DY + 190, { px: 32, a: g3, color: OK, font: F.serif }); B.burst(DX, DY + 190, s('C03') + 0.3, OK, { r1: 200 }); }
  }

  function shotTwo() {
    const a = B.win(s('C04'), s('G02') - 0.2); if (a <= 0) return;
    B.line2([DX, DY - 280], [DX, DY + 200], C.inkMid, a * 0.5, 2);
    const gR = a * gin(s('C04'));
    ctag('路 ②：S × [x]_v', DX + 280, DY - 260, { px: 30, a: gR, color: C.peri });
    B.mat(DX + 140, DY - 140, Sm, { px: 30, a: gR, cell: () => ({ col: OK }) }); K.cvec(DX + 300, DY - 140, [2, 3, -4], gR, { px: 30, col: C.j });
    ctag('(2 − 3 + 8,  2 + 3,  2 − 4)', DX + 280, DY - 20, { px: 26, a: gR * gin(cue('C04', '二减三加八')), color: C.inkMid, font: F.serif });
    const gL = a * gin(s('C05'));
    ctag('路 ①：先算 x，再解 Uc = x', DX - 280, DY - 260, { px: 30, a: gL, color: C.j });
    ctag('x = 2(4,6,7) + 3(0,1,1) − 4(0,1,2)', DX - 280, DY - 170, { px: 24, a: gL, font: F.serif });
    ctag('= (8, 11, 9)', DX - 280, DY - 120, { px: 30, a: gL * gin(cue('C05', '等于八、十一、九')), color: C.i, font: F.serif });
    ctag('Uc = (8, 11, 9)', DX - 280, DY - 50, { px: 28, a: gL * gin(cue('C05', '再解U乘c等于x')), font: F.serif });
    // 汇合
    const tR = cue('C04', '也就是七、五、负二'), tL = cue('C05', '也得到七、五、负二');
    const yR = lerp(DY + 40, DY + 140, smoother(prog(B.t, tR, tR + 0.6))), yL = lerp(DY + 40, DY + 140, smoother(prog(B.t, tL, tL + 0.6)));
    ctag('(7, 5, −2)', lerp(DX + 280, DX + 150, smoother(prog(B.t, tL, tL + 0.6))), yR, { px: 38, a: gR * gin(tR), color: OK, font: F.serif });
    ctag('(7, 5, −2)', lerp(DX - 280, DX - 150, smoother(prog(B.t, tL, tL + 0.6))), yL, { px: 38, a: gL * gin(tL), color: OK, font: F.serif });
    if (B.t > tL + 0.6) B.burst(DX, DY + 140, tL + 0.6, OK, { r1: 220 });
    const gG = a * gin(s('G01'));
    B.card(DX, DY + 260, 960, 80, gG * 0.95, C.gpt); ctag('7u₁ + 5u₂ − 2u₃ = (7+5−4, 7+10−6, 7+10−8) = (8, 11, 9) ✓', DX, DY + 260, { px: 26, a: gG, color: C.gpt, font: F.serif });
  }

  function shotGrid() {
    const a = B.win(s('G02'), 1e9); if (a <= 0) return;
    const u = 70, ox = DX, oy = DY + 80, w = smoother(prog(B.t, s('G02') + 0.4, s('G02') + 2.4));
    const b1 = [lerp(1, 1.1, w), lerp(0, 0.45, w)], b2 = [lerp(0, -0.35, w), lerp(1, 0.9, w)];
    const T2 = (x, y) => [ox + (x * b1[0] + y * b2[0]) * u, oy - (x * b1[1] + y * b2[1]) * u];
    const col = w > 0.5 ? C.peri : C.ink;
    for (let k = -5; k <= 5; k++) { B.line2(T2(k, -4), T2(k, 4), col, a * 0.3, 1.5); B.line2(T2(-5, k), T2(5, k), col, a * 0.3, 1.5); }
    const v = [2.2, 1.6]; arrow(ctx, [ox, oy], [ox + v[0] * u, oy - v[1] * u], { color: C.i, width: 7, head: 20, alpha: a });
    const det = b1[0] * b2[1] - b1[1] * b2[0], c1 = (v[0] * b2[1] - v[1] * b2[0]) / det, c2 = (b1[0] * v[1] - b1[1] * v[0]) / det;
    ctag(`(${c1.toFixed(2)}, ${c2.toFixed(2)})`, ox + v[0] * u + 120, oy - v[1] * u - 20, { px: 30, a, color: col, font: F.serif });
    ctag('向量不动，坐标在变', DX, DY - 280, { px: 30, a, color: C.i });
    B.card(DX, DY - 200, 900, 76, a * gin(cue('G02', '左边那条路反而更快')) * 0.95, C.gpt);
    ctag('只问坐标 → 路 ① 更快；问了 S → 用 S 去乘', DX, DY - 200, { px: 28, a: a * gin(cue('G02', '左边那条路反而更快')), color: C.gpt });
    K.pill('我一个人做完了！', DX, DY + 330, C.ds, a * gin(s('D04')), 34);
    if (B.t > s('D04')) B.burst(DX, DY + 330, s('D04') + 0.2, C.ds, { r1: 200 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotElim(); shotTwo(); shotGrid();
      timer(B.win(s('C01') + 0.5, s('D04')) * gin(s('C01') + 1));
      B.paper(EX, 'y1718_q7', { t0: s('C01') + 0.2, dock: s('C02'), out: s('D04') - 0.4 });
    });
  }
  return { TL, draw };
}
