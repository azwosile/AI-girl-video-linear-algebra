// 特别篇 3 · 第 5 段：先乘再算（2021–22 第 3 题；2023–24 第 7(i) 题）。
// 分镜：原题 → 大肥鱼的“−2 · 1 + 1 = −1”公式链 → “+I 加在矩阵上”：I 落在 AB 上而不是 det 上（两条路分叉，错的那条断裂）
//       → AB 逐行点乘（A 的行扫过 B 的三列）→ +I 对角线各 +1 → 第二行全零（红光扫过）→ det = 0，−1 被击碎
//       → 评分点 → 第二道：第一列全是 2 → 两步消元 → −20 → 非奇异印章 → 回看第二问（A⁻¹ = (A − I)/2）→ 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_proud', 'ds_shock', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2122_q3', 'y2324_q7']);
  const B = base(R, {
    assets, label: '特别篇 3 · 行列式', title: '先乘再算', hi: 5, en: '2021–22 · Q3  ·  2023–24 · Q7(i)',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C06: 0.8, C10: 0.6 },
    post: { C01: 1.4, D01: 1.2, C02: 1.6, C03: 2.0, C04: 1.6, C05: 1.6, D02: 0.6, G01: 1.6, C06: 1.4, C07: 1.8, C08: 1.4, C09: 1.8, C10: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tR = ['得到三、三、一', '得到零、负一、零', '得到一、二、一'].map(w => cue('C03', w));
  const tZ = cue('C05', '整行都是零');

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 3.0, 0.3);
  TL.sfx('type', s('D01') + 0.3, 0.25); TL.sfx('crack', cue('C02', '不是加在行列式上'), 0.3); TL.sfx('click', cue('C02', '老老实实先乘'), 0.3);
  tR.forEach(t => { TL.sfx('laser', t - 0.8, 0.2); TL.sfx('marimba', t, 0.25); });
  TL.sfx('swoosh_soft', cue('C04', '对角线各加一'), 0.3); TL.sfx('glitch', tZ, 0.25); TL.sfx('slam', cue('C05', '直接等于零'), 0.35);
  TL.sfx('crack', s('D02') + 0.2, 0.3); TL.sfx('zap', cue('G01', '评分点'), 0.25);
  TL.sfx('whoosh', s('C06') + 0.2, 0.3); TL.sfx('marimba', cue('C07', '得到零、一、四'), 0.22); TL.sfx('marimba', cue('C07', '得到零、三、二'), 0.22); TL.sfx('impact', cue('C07', '等于负二十'), 0.3);
  TL.sfx('stamp', cue('C08', '所以非奇异'), 0.35); TL.sfx('pluck', s('C09') + 0.4, 0.25); TL.sfx('swell', s('C10') - 0.2, 0.3);

  function shot1() {
    const a = B.win(s('C01') + 0.6, s('C06') - 0.3); if (a <= 0) return;
    B.qhead('2021–22 · 第 3 题：det(AB + I) = ?', a);
    // 错误公式链
    const gw = a * B.win(s('D01'), s('C03') - 0.2);
    if (gw > 0) {
      ['|A| = −2', '|B| = 1', '|AB| = −2', '+1 → −1 ?'].forEach((tx, k) => ctag(tx, DX - 360 + k * 240, DY - 220, { px: 32, a: gw * gin(s('D01') + 0.5 + k * 0.6), color: C.ds, font: F.serif }));
      const g2 = a * gin(s('C02'));
      ctag('det(AB + I)', DX, DY - 100, { px: 40, a: g2, font: F.serif });
      ctag('≠ det(AB) + 1', DX, DY - 30, { px: 40, a: g2 * gin(cue('C02', '不等于')), color: C.free, font: F.serif });
      ctag('I 加在矩阵上，不是加在行列式上', DX, DY + 60, { px: 30, a: g2 * gin(cue('C02', '是加在矩阵上')), color: C.i });
      if (B.t > cue('C02', '不是加在行列式上')) B.cross(DX + 240, DY - 220, prog(B.t, cue('C02', '不是加在行列式上'), cue('C02', '不是加在行列式上') + 0.4), gw, 80);
      K.pill('没有捷径：先乘', DX, DY + 160, C.peri, g2 * gin(cue('C02', '老老实实先乘')), 30);
    }
    // AB
    const g3 = a * gin(s('C03') - 0.2);
    if (g3 > 0) {
      const MA = B.mat(DX - 420, DY - 170, [[1, 1, 1], [2, -1, 0], [1, 0, 1]], { px: 32, a: g3 }); ctag('A', DX - 420, DY - 270, { px: 26, a: g3, color: C.inkMid, font: F.serif });
      const MB = B.mat(DX - 170, DY - 170, [[1, 0, 0], [2, 1, 0], [0, 2, 1]], { px: 32, a: g3 }); ctag('B', DX - 170, DY - 270, { px: 26, a: g3, color: C.inkMid, font: F.serif });
      ctag('=', DX - 20, DY - 170, { px: 38, a: g3, font: F.serif });
      const tI = cue('C04', '对角线各加一');
      const AB = [[3, 3, 1], [0, -1, 0], [1, 2, 1]], ABI = [[4, 3, 1], [0, 0, 0], [1, 2, 2]];
      const MP = B.mat(DX + 150, DY - 170, B.t > tI + 0.3 ? ABI : AB, { px: 36, a: g3, cell: (i, j) => {
        const on = gin(tR[i]); if (B.t > tZ && i === 1) return { col: C.free }; if (B.t > tI + 0.3 && i === j) return { col: C.j }; return { a: on, col: OK }; } });
      ctag(B.t > tI + 0.3 ? 'AB + I' : 'AB', DX + 150, DY - 270, { px: 26, a: g3, color: C.inkMid, font: F.serif });
      tR.forEach((t, i) => { if (B.t > t - 0.9 && B.t < t + 0.3) { K.rowBox(MA, i, 0, 2, C.peri, g3, 14); [0, 1, 2].forEach(j => K.colBox(MB, j, 0, 2, C.i, g3 * gin(t - 0.9 + j * 0.25) * 0.8, 12)); } });
      if (B.t > tI && B.t < tI + 1.6) [0, 1, 2].forEach(k => ctag('+1', ...[MP.cell(k, k)[0] + 30, MP.cell(k, k)[1] - 30], { px: 22, a: g3 * (1 - gin(tI + 1.2)), color: C.j, font: F.serif }));
      if (B.t > tZ) { K.rowBox(MP, 1, 0, 2, C.free, g3, 18); const u = prog(B.t, tZ, tZ + 0.6); if (u < 1) B.line2([MP.cell(1, 0)[0] - 40 + u * 0, MP.cell(1, 0)[1]], [lerp(MP.cell(1, 0)[0] - 40, MP.cell(1, 2)[0] + 40, u), MP.cell(1, 2)[1]], C.free, g3, 6); }
      const g5 = a * gin(cue('C05', '直接等于零'));
      ctag('det(AB + I) = 0', DX, DY + 60, { px: 60, a: g5, color: OK, font: F.serif });
      B.burst(DX, DY + 60, cue('C05', '直接等于零'), OK, { r1: 280 });
      const gd = a * gin(s('D02'));
      if (gd > 0) { ctag('−1', DX + 330, DY + 170, { px: 46, a: gd * (1 - gin(s('D02') + 1.2)), color: C.ds, font: F.serif }); B.burst(DX + 330, DY + 170, s('D02') + 0.3, C.ds, { r1: 120 }); }
      const gG = a * gin(s('G01'));
      B.card(DX, DY + 260, 860, 110, gG * 0.95, C.gpt);
      ctag('这题在等你用错公式', DX, DY + 235, { px: 28, a: gG, color: C.gpt });
      ctag('评分点：写出 AB + I 这一步', DX, DY + 285, { px: 28, a: gG * gin(cue('G01', '评分点')), color: C.gpt });
    }
  }

  function shot2() {
    const a = B.win(s('C06') + 0.6, s('C10') - 0.2); if (a <= 0) return;
    B.qhead('2023–24 · 第 7(i) 题：求 det，判断是否奇异', a);
    const S = [[[2, 2, 1], [2, 3, 5], [2, 5, 3]], [[2, 2, 1], [0, 1, 4], [2, 5, 3]], [[2, 2, 1], [0, 1, 4], [0, 3, 2]]];
    const { M } = K.steps(S, [0, cue('C07', '得到零、一、四'), cue('C07', '得到零、三、二')], [null, [[1, 'r₂ − r₁']], [[2, 'r₃ − r₁']]], { x: DX - 60, y: DY - 140, px: 40, a, hi: (i, j, k) => j === 0 && k === 0 && B.t > cue('C07', '第一列全是二') ? C.i : null });
    ctag('det = 2 · (1·2 − 4·3) = 2 · (−10) = −20', DX, DY + 50, { px: 40, a: a * gin(cue('C07', '行列式等于')), color: OK, font: F.serif });
    B.burst(DX + 250, DY + 50, cue('C07', '等于负二十'), OK, { r1: 200 });
    K.redStamp('非奇异', DX + 320, DY - 160, prog(B.t, cue('C08', '所以非奇异'), cue('C08', '所以非奇异') + 0.5), a * gin(cue('C08', '所以非奇异')), OK, 50);
    const g9 = a * gin(s('C09'));
    B.card(DX, DY + 200, 820, 120, g9 * 0.95, C.i);
    ctag('第二问：A² − A − 2I = O ⇒ A(A − I) = 2I', DX, DY + 175, { px: 28, a: g9, color: C.i, font: F.serif });
    ctag('⇒ A⁻¹ = (A − I) / 2   （第 2 章复习）', DX, DY + 225, { px: 28, a: g9 * gin(cue('C09', '所以A的逆')), color: C.i, font: F.serif });
  }

  function shotOutro() {
    const a = B.win(s('C10'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 先乘再算', ['① 行列式只对乘法友好', '② 看到加号：先把矩阵算出来', '③ 出现全零行：答案就是 0'],
      [s('C10') + 0.3, cue('C10', '看到加号'), cue('C10', '出现全零行')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shot1(); shot2(); shotOutro();
      B.paper(EX, 'y2122_q3', { t0: s('C01') + 0.2, dock: s('D01'), out: s('C06') - 0.4 });
      B.paper(EX, 'y2324_q7', { t0: s('C06') + 0.2, dock: s('C07'), out: s('C10') - 0.4 });
    });
  }
  return { TL, draw };
}
