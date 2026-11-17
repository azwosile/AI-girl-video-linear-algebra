// 特别篇 5 · 第 2 段：最新卷第 5 题（2025–26，15 分；数据 = 2021–22 第 6 题）。
// 分镜：两份纸卡并排打勾 → E、F 六根列向量上屏 → det E = 3、det F = 1 → [F | E] 增广（F 橙、E 青）
//       → “左乘一串初等矩阵 = F⁻¹”解释卡 → 三步消元 → 右半 = S 浮出 → x 的 E 坐标直接读系数 → S·(3,2,−1) 逐行点乘 → (8,−5,3)
//       → y → (−8,2,3) → 验算：两条路都到 (6,4,3) → 两副眼镜：同一点在两套斜网格下读数不同 → 同济版对照 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_ask', 'ds_happy', 'gpt_point', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y2526_q5', 'y2122_q6']);
  const B = base(R, {
    assets, label: '特别篇 5 · 过渡矩阵', title: '最新卷第 5 题', hi: 2, en: '2025–26 · Q5 · 15 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C04: 0.6, C06: 0.4, C10: 0.8, C13: 0.6 },
    post: { C01: 1.4, C02: 1.6, C03: 1.6, G01: 1.6, C04: 1.6, D01: 0.6, C05: 1.8, C06: 1.6, C07: 1.8, C08: 2.0, C09: 1.8, C10: 1.6, C11: 2.0, C12: 2.0, G02: 2.0, D02: 2.0, G03: 1.8, C13: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const S = [
    [[1, 1, 1, 1, 2, 1], [1, 2, 2, 1, 3, 5], [0, 0, 1, 1, 2, 4]],
    [[1, 1, 1, 1, 2, 1], [0, 1, 1, 0, 1, 4], [0, 0, 1, 1, 2, 4]],
    [[1, 1, 1, 1, 2, 1], [0, 1, 0, -1, -1, 0], [0, 0, 1, 1, 2, 4]],
    [[1, 0, 0, 1, 1, -3], [0, 1, 0, -1, -1, 0], [0, 0, 1, 1, 2, 4]],
  ];
  const T = [0, cue('C07', '第二行减第一行'), cue('C08', '第二行减第三行'), cue('C08', '第一行减第二行再减第三行')];
  const OPS = [null, [[1, 'r₂ − r₁']], [[1, 'r₂ − r₃']], [[0, 'r₁ − r₂ − r₃']]];
  const Sm = [[1, 1, -3], [-1, -1, 0], [1, 2, 4]];
  const tx = ['第一行三加二加三等于八', '第二行负三减二加零等于负五', '第三行三加四减四等于三'].map(w => cue('C11', w));

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('check', cue('C01', '一模一样'), 0.3); TL.sfx('stamp', cue('C01', '重考题'), 0.3);
  [0, 1, 2, 3, 4, 5].forEach(k => TL.sfx('pop', s('C02') + 0.6 + k * 0.6, 0.2)); TL.sfx('tick', s('C03') + 0.4, 0.25);
  TL.sfx('check', cue('G01', 'E的行列式等于三'), 0.28); TL.sfx('check', cue('G01', 'F的行列式等于一'), 0.28);
  TL.sfx('swoosh_in', cue('C04', '并排写成增广矩阵'), 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('shimmer', cue('C05', '就是F逆'), 0.3);
  T.slice(1).forEach(t => { TL.sfx('swoosh_soft', t, 0.25); TL.sfx('marimba', t + 0.4, 0.22); }); TL.sfx('impact', s('C09') + 0.3, 0.32);
  TL.sfx('pluck', cue('C10', '直接读系数'), 0.28); tx.forEach(t => TL.sfx('laser', t, 0.22)); TL.sfx('ding_hi', cue('C11', '所以是八、负五、三'), 0.3);
  TL.sfx('ding_hi', cue('C12', '也就是负八、二、三'), 0.3); TL.sfx('check', cue('G02', '对上了'), 0.32);
  TL.sfx('hum', s('D02') + 0.2, 0.22); TL.sfx('click', s('G03') + 0.3, 0.28); TL.sfx('swell', s('C13') - 0.2, 0.3);

  function shotData() {
    const a = B.win(s('C02'), s('C04') - 0.2); if (a <= 0) return;
    B.qhead('2025–26 · 第 5 题 · 15 分（= 2021–22 第 6 题）', a);
    const V = [['v₁', [1, 1, 1]], ['v₂', [2, 3, 2]], ['v₃', [1, 5, 4]], ['u₁', [1, 1, 0]], ['u₂', [1, 2, 0]], ['u₃', [1, 2, 1]]];
    V.forEach(([n, v], k) => { const x = DX - 480 + k * 190 + (k >= 3 ? 60 : 0), g = a * gin(s('C02') + 0.6 + k * 0.6), col = k < 3 ? C.j : C.peri;
      ctag(n, x, DY - 250, { px: 28, a: g, color: col, font: F.serif }); K.cvec(x, DY - 150, v, g, { px: 32, col }); });
    ctag('E', DX - 290, DY - 320, { px: 30, a: a * gin(s('C02') + 0.6), color: C.j, font: F.serif }); ctag('F', DX + 340, DY - 320, { px: 30, a: a * gin(s('C02') + 2.4), color: C.peri, font: F.serif });
    const g3 = a * gin(s('C03'));
    ctag('① E → F 的过渡矩阵   ② x = 3v₁ + 2v₂ − v₃，y = v₁ − 3v₂ + 2v₃ 的 F 坐标', DX, DY + 20, { px: 26, a: g3, color: C.ink, font: F.serif });
    const gG = a * gin(s('G01'));
    B.card(DX, DY + 160, 760, 90, gG * 0.95, C.gpt); ctag('det E = 3 ≠ 0，det F = 1 ≠ 0 → 都是基', DX, DY + 160, { px: 28, a: gG, color: C.gpt, font: F.serif });
  }

  function shotS() {
    const a = B.win(s('C04'), s('C10') - 0.2); if (a <= 0) return;
    B.qhead('Leon：S = F⁻¹E → 一次消元 [F | E] → [I | S]', a);
    const g = a * gin(cue('C04', '并排写成增广矩阵'));
    if (g > 0) {
      const { M, k } = K.steps(S, T, OPS, { x: DX + 40, y: DY - 130, px: 36, bar: 3, a: g, cw: 86, hi: (i, j, k) => k === 0 ? (j < 3 ? C.peri : C.j) : (k === 3 && j >= 3 ? OK : null) });
      ctag('F', M.cell(0, 1)[0], DY - 130 - M.h / 2 - 30, { px: 26, a: g * (1 - gin(T[3])), color: C.peri, font: F.serif });
      ctag('E', M.cell(0, 4)[0], DY - 130 - M.h / 2 - 30, { px: 26, a: g * (1 - gin(T[3])), color: C.j, font: F.serif });
      ctag('I', M.cell(0, 1)[0], DY - 130 - M.h / 2 - 30, { px: 26, a: g * gin(T[3]), color: C.ink, font: F.serif });
      ctag('S', M.cell(0, 4)[0], DY - 130 - M.h / 2 - 30, { px: 28, a: g * gin(T[3]), color: OK, font: F.serif });
      if (k === 3) K.colBox(M, 4, 0, 2, OK, 0, 0);
    }
    const g5 = a * B.win(s('D01'), s('C06'));
    if (g5 > 0) { B.card(DX, DY + 160, 880, 120, g5 * 0.95, C.i);
      ctag('消元 = 左乘一串 Eₖ⋯E₁；它把 F 变成 I ⇒ Eₖ⋯E₁ = F⁻¹', DX, DY + 135, { px: 26, a: g5 * gin(s('C05')), color: C.i, font: F.serif });
      ctag('同一串操作作用在右边 → F⁻¹E', DX, DY + 185, { px: 26, a: g5 * gin(cue('C05', '同一串操作')), color: C.i, font: F.serif }); }
    const g9 = a * gin(s('C09'));
    if (g9 > 0) { const M2 = B.mat(DX + 60, DY + 170, Sm, { px: 34, a: g9, cell: () => ({ col: OK }) }); ctag('S =', DX + 60 - M2.w / 2 - 50, DY + 170, { px: 32, a: g9, color: OK, font: F.serif }); B.burst(DX + 60, DY + 170, s('C09') + 0.3, OK, { r1: 220 }); }
  }

  function shotCoord() {
    const a = B.win(s('C10'), s('D02') - 0.2); if (a <= 0) return;
    const MS = B.mat(DX - 300, DY - 150, Sm, { px: 34, a, cell: () => ({ col: OK }) }); ctag('S', DX - 300, DY - 250, { px: 28, a, color: OK, font: F.serif });
    const g10 = a * gin(cue('C10', '直接读系数'));
    ctag('x = 3v₁ + 2v₂ − v₃  ⇒  [x]_E = (3, 2, −1)', DX + 200, DY - 300, { px: 28, a: g10, color: C.j, font: F.serif });
    const g11 = a * gin(s('C11'));
    if (g11 > 0) {
      ctag('×', DX - 160, DY - 150, { px: 34, a: g11, font: F.serif }); K.cvec(DX - 80, DY - 150, [3, 2, -1], g11, { px: 32, col: C.j }); ctag('=', DX + 10, DY - 150, { px: 34, a: g11, font: F.serif });
      const Mx = B.mat(DX + 90, DY - 150, [[8], [-5], [3]], { px: 34, a: g11, cell: (i) => ({ a: gin(tx[i]), col: C.peri }) });
      tx.forEach((t, i) => { if (B.t > t - 0.3 && B.t < t + 1.4) K.rowBox(MS, i, 0, 2, C.peri, g11, 14); });
      ctag('[x]_F = (8, −5, 3)', DX + 360, DY - 150, { px: 32, a: g11 * gin(cue('C11', '所以是八、负五、三')), color: C.peri, font: F.serif });
    }
    const g12 = a * gin(s('C12'));
    ctag('[y]_E = (1, −3, 2)  ⇒  [y]_F = S[y]_E = (−8, 2, 3)', DX, DY + 30, { px: 32, a: g12, color: C.peri, font: F.serif });
    ctag('(1 − 3 − 6,  −1 + 3,  1 − 6 + 8)', DX, DY + 85, { px: 26, a: g12 * gin(cue('C12', '一减三减六')), color: C.inkMid, font: F.serif });
    const gG = a * gin(s('G02'));
    if (gG > 0) {
      B.card(DX, DY + 220, 980, 150, gG * 0.95, C.gpt);
      ctag('3(1,1,1) + 2(2,3,2) − (1,5,4) = (6, 4, 3)', DX, DY + 180, { px: 28, a: gG * gin(cue('G02', '等于六、四、三')), color: C.gpt, font: F.serif });
      ctag('8u₁ − 5u₂ + 3u₃ = (8−5+3, 8−10+6, 3) = (6, 4, 3)', DX, DY + 230, { px: 28, a: gG * gin(cue('G02', '而八u一')), color: C.gpt, font: F.serif });
      B.stamp(DX + 420, DY + 205, true, prog(B.t, cue('G02', '对上了'), cue('G02', '对上了') + 0.5), gG * gin(cue('G02', '对上了')), '对上');
    }
  }

  // 两副眼镜
  function shotGlasses() {
    const a = B.win(s('D02'), s('C13') - 0.2); if (a <= 0) return;
    const P = [1.6, 1.1];
    const grid = (ox, oy, b1, b2, col, lab, rd, g) => {
      const u = 70, T2 = (x, y) => [ox + (x * b1[0] + y * b2[0]) * u, oy - (x * b1[1] + y * b2[1]) * u];
      for (let k = -3; k <= 3; k++) { B.line2(T2(k, -3), T2(k, 3), col, g * 0.3, 1.5); B.line2(T2(-3, k), T2(3, k), col, g * 0.3, 1.5); }
      const p = [ox + P[0] * u, oy - P[1] * u]; B.dot(...p, 12, C.i, g); ctag(rd, p[0] + 10, p[1] - 40, { px: 26, a: g, color: col, font: F.serif });
      ctag(lab, ox, oy + 250, { px: 28, a: g, color: col });
    };
    const g = a * (1 - gin(s('G03')) * 0.75);
    ctx.save(); ctx.beginPath(); ctx.rect(DX - 560, DY - 300, 500, 600); ctx.clip(); grid(DX - 310, DY + 40, [1, 0], [0.3, 1], C.j, 'E 眼镜', '(3, 2, −1)', g); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(DX + 60, DY - 300, 500, 600); ctx.clip(); grid(DX + 310, DY + 40, [1, 0.4], [-0.3, 1], C.peri, 'F 眼镜', '(8, −5, 3)', g); ctx.restore();
    ctag('同一个点，两组坐标', DX, DY - 300, { px: 30, a: g, color: C.i });
    const gG = a * gin(s('G03'));
    if (gG > 0) { B.card(DX, DY + 40, 960, 170, gG * 0.96, C.j);
      ctag('同济写法：E → F 的过渡矩阵 P = E⁻¹F = S⁻¹', DX, DY - 5, { px: 30, a: gG, color: C.j, font: F.serif });
      ctag('[x]_F = P⁻¹[x]_E → 还得再求一次逆', DX, DY + 50, { px: 28, a: gG * gin(cue('G03', '还得再求一次逆')), color: C.j, font: F.serif });
      ctag('这题：Leon 最省事', DX, DY + 100, { px: 28, a: gG * gin(cue('G03', '最省事')), color: C.peri }); }
  }

  function shotOutro() {
    const a = B.win(s('C13'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 过渡矩阵', ['① [目标基 | 出发基] 一次消元 → S', '② 坐标 = S × 系数', '③ 回到标准坐标验算'],
      [s('C13') + 0.3, cue('C13', '坐标等于S乘系数'), cue('C13', '最后回到标准坐标验算')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotData(); shotS(); shotCoord(); shotGlasses(); shotOutro();
      B.paper(EX, 'y2526_q5', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C13') - 0.4 });
      B.paper(EX, 'y2122_q6', { t0: cue('C01', '一模一样') - 0.4, dock: cue('C01', '一模一样') + 0.4, out: s('C02') - 0.2 });
    });
  }
  return { TL, draw };
}
