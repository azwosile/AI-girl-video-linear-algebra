// 特别篇 5 · 第 4 段：从标准基出发（2023–24 第 3 题；2022–23 第 3 题；2024–25 1(6)）。
// 分镜：S = U⁻¹I = U⁻¹ 公式变形 → 2023–24 第 3 题：U 列排 → U⁻¹ 浮出 → 两个坐标（逐行点乘）→ 同济 = U 本身（对照卡）→ 验算
//       → 2022–23：三根箭头像阶梯，反三角矩阵 det = −1 → F⁻¹ 由“读出来”：e₁ = u₃、e₂ = u₂ − u₃、e₃ = u₁ − u₂，三组系数落成列
//       → 2024–25 填空：2D 斜网格上 v 沿 u₁、u₂ 分解（−4 格 u₁ + 3 格 u₂）→ 验算 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_think', 'gpt_cross', 'gpt_point', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y2324_q3']);
  const B = base(R, {
    assets, label: '特别篇 5 · 过渡矩阵', title: '从标准基出发', hi: 4, en: 'FROM THE STANDARD BASIS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.6, C05: 0.8, C08: 0.8, C10: 0.6 },
    post: { C01: 1.8, C02: 1.4, C03: 1.8, C04: 2.2, G01: 1.8, G02: 1.8, C05: 1.4, C06: 2.0, D01: 0.6, C07: 2.2, C08: 1.4, C09: 2.0, G03: 1.6, C10: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const Ui = [[2, -1, 0], [1, -3, 2], [-1, 2, -1]];
  const tRd = ['e一等于u三', 'e二等于u二减u三', 'e三等于u一减u二'].map(w => cue('C07', w));

  TL.sfx('swoosh_soft', cue('C01', '就是U逆'), 0.3); TL.sfx('whoosh', s('C02') + 0.2, 0.3); TL.sfx('stamp', s('C02') + 2.6, 0.3);
  TL.sfx('impact', cue('C03', '得到U逆'), 0.3); TL.sfx('ding_hi', cue('C04', '也就是四、七、负四'), 0.28); TL.sfx('ding_hi', cue('C04', '也就是一、负三、二'), 0.28);
  TL.sfx('click', s('G01') + 0.3, 0.28); TL.sfx('check', cue('G02', '对'), 0.3);
  TL.sfx('whoosh', s('C05') + 0.2, 0.3); TL.sfx('ding', cue('C06', '行列式等于负一'), 0.28); TL.sfx('impact', cue('C06', 'F逆等于'), 0.3);
  TL.sfx('pop', s('D01') + 0.2, 0.25); tRd.forEach(t => TL.sfx('pluck', t, 0.28)); TL.sfx('ding_hi', cue('C07', '按列排'), 0.3);
  TL.sfx('whoosh', s('C08') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C09', '得到c二等于三'), 0.28); TL.sfx('ding_hi', cue('C09', '坐标是负四、三'), 0.3); TL.sfx('check', s('G03') + 0.4, 0.28);
  TL.sfx('swell', s('C10') - 0.2, 0.3);

  function shotFormula() {
    const a = B.win(s('C01'), s('C02') + 0.4); if (a <= 0) return;
    ctag('标准基矩阵 = I', DX, DY - 160, { px: 34, a: a * gin(cue('C01', '单位矩阵')), color: C.ink });
    ctag('S = U⁻¹ I = U⁻¹', DX, DY - 40, { px: 60, a: a * gin(cue('C01', 'S等于U逆乘单位矩阵')), color: C.peri, font: F.serif });
  }

  function shotQ1() {
    const a = B.win(s('C02') + 0.6, s('C05') - 0.2); if (a <= 0) return;
    B.qhead('2023–24 · 第 3 题：{e} → {u} 的过渡矩阵，及 (3,2,5)、(2,3,2) 的坐标', a);
    const MU = B.mat(DX - 380, DY - 140, [[1, 1, 2], [1, 2, 4], [1, 3, 5]], { px: 32, a, cell: () => ({ col: C.peri }) }); ctag('U', DX - 380, DY - 240, { px: 26, a, color: C.peri, font: F.serif });
    const g3 = a * gin(cue('C03', '得到U逆'));
    if (g3 > 0) { arrow(ctx, [DX - 270, DY - 140], [DX - 170, DY - 140], { color: C.inkMid, width: 4, head: 14, alpha: g3 });
      const M = B.mat(DX - 40, DY - 140, Ui, { px: 32, a: g3, cell: () => ({ col: OK }) }); ctag('S = U⁻¹', DX - 40, DY - 240, { px: 26, a: g3, color: OK, font: F.serif }); }
    const g4 = a * gin(s('C04'));
    ctag('U⁻¹(3, 2, 5) = (6−2,  3−6+10,  −3+4−5) = (4, 7, −4)', DX + 40, DY + 20, { px: 28, a: g4, color: C.ink, font: F.serif });
    ctag('U⁻¹(2, 3, 2) = (1, −3, 2)', DX + 40, DY + 80, { px: 28, a: a * gin(cue('C04', 'U逆乘二、三、二')), color: C.ink, font: F.serif });
    const gG = a * B.win(s('G01'), s('G02'));
    if (gG > 0) { B.card(DX + 300, DY - 140, 360, 160, gG * 0.95, C.j); ctag('同济：= U 本身', DX + 300, DY - 170, { px: 28, a: gG, color: C.j }); ctag('U  vs  U⁻¹ → 定义式必写', DX + 300, DY - 110, { px: 24, a: gG * gin(cue('G01', '定义式一定要写')), color: C.j }); }
    const gV = a * gin(s('G02'));
    B.card(DX, DY + 220, 940, 90, gV * 0.95, C.gpt);
    ctag('4(1,1,1) + 7(1,2,3) − 4(2,4,5) = (3, 2, 5) ✓', DX, DY + 220, { px: 28, a: gV * gin(cue('G02', '也就是三、二、五')), color: C.gpt, font: F.serif });
  }

  function shotQ2() {
    const a = B.win(s('C05') + 0.4, s('C08') - 0.2); if (a <= 0) return;
    B.qhead('2022–23 · 第 3 题：F = {(1,1,1), (1,1,0), (1,0,0)}', a);
    // 阶梯箭头
    const ox = DX - 440, oy = DY + 40, P = v => [ox + v[0] * 50 + v[2] * 40, oy - v[1] * 90 - v[2] * 50];
    [[1, 1, 1], [1, 1, 0], [1, 0, 0]].forEach((v, k) => arrow(ctx, [ox, oy], P([v[0] * 1.6, v[1], v[2]]), { color: [C.i, C.j, C.k][k], width: 6, head: 16, alpha: a * gin(s('C05') + 1 + k * 0.4) }));
    const M = B.mat(DX - 80, DY - 140, [[1, 1, 1], [1, 1, 0], [1, 0, 0]], { px: 32, a: a * gin(s('C06')), cell: (i, j) => i + j <= 2 ? { col: C.peri } : null });
    ctag('反三角：det = −1 ≠ 0 → 是基', DX - 80, DY - 20, { px: 26, a: a * gin(cue('C06', '行列式等于负一')), color: C.i });
    const g6 = a * gin(cue('C06', 'F逆等于'));
    const Fi = [[0, 0, 1], [0, 1, -1], [1, -1, 0]];
    const MI = B.mat(DX + 300, DY - 140, Fi, { px: 32, a: g6, cell: (i, j) => ({ col: OK, a: B.t > s('D01') ? gin(tRd[j] + 0.4) : 1 }) });
    ctag('F⁻¹', DX + 300, DY - 240, { px: 26, a: g6, color: OK, font: F.serif });
    const gr = a * gin(s('C07'));
    ['e₁ = u₃', 'e₂ = u₂ − u₃', 'e₃ = u₁ − u₂'].forEach((tx, k) => { ctag(tx, DX - 300 + k * 300, DY + 120, { px: 32, a: gr * gin(tRd[k]), color: [C.i, C.j, C.k][k], font: F.serif });
      if (B.t > tRd[k] && B.t < tRd[k] + 1.5) K.colBox(MI, k, 0, 2, [C.i, C.j, C.k][k], gr, 14); });
    ctag('系数按列排 → F⁻¹（不用消元）', DX, DY + 220, { px: 28, a: gr * gin(cue('C07', '按列排')), color: OK });
  }

  function shotQ3() {
    const a = B.win(s('C08') + 0.4, s('C10') - 0.2); if (a <= 0) return;
    B.qhead('2024–25 · 填空 1(6)：u₁ = (1,2)，u₂ = (2,3)，v = (2,1) 的坐标', a);
    const u = 46, ox = DX - 200, oy = DY + 120, b1 = [1, 2], b2 = [2, 3];
    const T2 = (x, y) => [ox + (x * b1[0] + y * b2[0]) * u, oy - (x * b1[1] + y * b2[1]) * u];
    ctx.save(); ctx.beginPath(); ctx.rect(DX - 600, DY - 250, 760, 560); ctx.clip();
    for (let k = -6; k <= 6; k++) { B.line2(T2(k, -6), T2(k, 6), C.j, a * 0.22, 1.5); B.line2(T2(-6, k), T2(6, k), C.j, a * 0.22, 1.5); }
    arrow(ctx, [ox, oy], T2(1, 0), { color: C.i, width: 5, head: 14, alpha: a }); arrow(ctx, [ox, oy], T2(0, 1), { color: C.k, width: 5, head: 14, alpha: a });
    const g = a * gin(cue('C09', '得到c二等于三'));
    const p1 = T2(-4 * smoother(prog(B.t, cue('C09', '得到c二等于三'), cue('C09', '得到c二等于三') + 0.8)), 0);
    if (g > 0) { arrow(ctx, [ox, oy], p1, { color: C.i, width: 4, head: 12, alpha: g * 0.8 }); const q = smoother(prog(B.t, cue('C09', '得到c二等于三') + 0.8, cue('C09', '得到c二等于三') + 1.6));
      arrow(ctx, p1, [p1[0] + (T2(0, 3)[0] - ox) * q, p1[1] + (T2(0, 3)[1] - oy) * q], { color: C.k, width: 4, head: 12, alpha: g * 0.8 * (q > 0 ? 1 : 0) }); }
    arrow(ctx, [ox, oy], [ox + 2 * u, oy - 1 * u], { color: C.peri, width: 7, head: 18, alpha: a * gin(s('C09')) });
    ctx.restore();
    ctag('v', ox + 2 * u + 20, oy - u - 20, { px: 28, a: a * gin(s('C09')), color: C.peri, font: F.serif });
    ctag('c₁ + 2c₂ = 2', DX + 340, DY - 120, { px: 30, a: a * gin(s('C09')), font: F.serif }); ctag('2c₁ + 3c₂ = 1', DX + 340, DY - 70, { px: 30, a: a * gin(s('C09')), font: F.serif });
    ctag('(c₁, c₂) = (−4, 3)', DX + 340, DY + 20, { px: 40, a: a * gin(cue('C09', '坐标是负四、三')), color: OK, font: F.serif });
    const gG = a * gin(s('G03'));
    B.card(DX + 340, DY + 150, 480, 110, gG * 0.95, C.gpt);
    ctag('−4(1,2) + 3(2,3) = (2,1) ✓', DX + 340, DY + 130, { px: 26, a: gG, color: C.gpt, font: F.serif }); ctag('草稿上验，一秒钟', DX + 340, DY + 175, { px: 24, a: gG, color: C.gpt });
  }

  function shotOutro() {
    const a = B.win(s('C10'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 从标准基出发', ['① Leon：U⁻¹   同济：U', '② 坐标 = 解 Uc = x'], [s('C10') + 0.3, cue('C10', '坐标')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotFormula(); shotQ1(); shotQ2(); shotQ3(); shotOutro();
      B.paper(EX, 'y2324_q3', { t0: s('C02') + 0.2, dock: s('C03'), out: s('C05') - 0.4 });
    });
  }
  return { TL, draw };
}
