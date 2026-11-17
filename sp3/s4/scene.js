// 特别篇 3 · 第 4 段：零多的行列式 + 伴随的行列式（2018–19 第 5(a) 题）。
// 分镜：原题 → 扫描线找最空的列（第 1 列亮）→ 按第 1 列展开：2 跳出，第 4 行第 1 列划掉 → M₄₁ 三阶浮出
//       → 第 3 列只有一个 3 → −6 → det = 12 → 符号棋盘铺开（+−+− 交替，(4,1) 位置闪 −）
//       → A·adjA = |A|I 两边取 det → |A|·|adjA| = |A|⁴ → 约掉 → 12³ = 1728（里程表滚数）→ 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_think', 'gpt_point', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q5']);
  const B = base(R, {
    assets, label: '特别篇 3 · 行列式', title: '零多的行列式 + 伴随', hi: 4, en: '2018–19 · Q5(a)',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C06: 0.8, G02: 0.6 },
    post: { C01: 1.2, C02: 1.4, C03: 1.8, C04: 1.8, C05: 1.6, G01: 2.0, C06: 1.8, C07: 2.0, D01: 0.8, C08: 1.4, G02: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const A = [[0, 2, 3, 0], [0, 4, 5, 0], [0, 1, 0, 3], [2, 0, 1, 3]];

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  TL.sfx('laser', s('C02') + 0.4, 0.25); TL.sfx('ding', cue('C02', '第一列是'), 0.3);
  TL.sfx('pop', cue('C03', '按第一列展开'), 0.25); TL.sfx('crack', cue('C03', '划掉第四行'), 0.3); TL.sfx('swoosh_in', cue('C03', '剩下的三阶'), 0.3);
  TL.sfx('ding', cue('C04', '第三列也只有一个三'), 0.3); TL.sfx('marimba', cue('C04', '等于负六'), 0.25); TL.sfx('impact', s('C05') + 0.3, 0.3);
  TL.sfx('tinkle', cue('G01', '画一个正负号的棋盘'), 0.3); TL.sfx('buzz', cue('G01', '等于负一'), 0.2);
  TL.sfx('click', s('C06') + 0.3, 0.3); TL.sfx('swoosh_soft', cue('C07', '可以约掉一个'), 0.3); TL.sfx('riser', cue('C07', '等于十二的三次方') - 0.6, 0.25); TL.sfx('impact', cue('C07', '一千七百二十八'), 0.35);
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('swell', s('G02') - 0.2, 0.3);

  function shotDet() {
    const a = B.win(s('C02'), s('C06') - 0.3); if (a <= 0) return;
    B.qhead('2018–19 · 第 5(a) 题：det A = ?', a);
    const gC = a * gin(cue('C03', '划掉第四行'));
    const M = B.mat(DX - 280, DY - 120, A, { px: 38, a, cell: (i, j) => (j === 0 && B.t > cue('C02', '第一列是')) ? { col: i === 3 ? C.peri : C.inkMid } : ((i === 3 || j === 0) && gC > 0 ? { a: 1 - 0.7 * gC } : null) });
    ctag('A =', DX - 280 - M.w / 2 - 50, DY - 120, { px: 32, a, font: F.serif });
    // 扫描线
    const us = prog(B.t, s('C02') + 0.3, s('C02') + 1.6);
    if (us > 0 && us < 1) { const x = lerp(DX - 280 - M.w / 2, DX - 280 + M.w / 2, us); B.line2([x, DY - 120 - M.h / 2], [x, DY - 120 + M.h / 2], C.i, a * 0.8, 4); }
    if (B.t > cue('C02', '第一列是')) K.colBox(M, 0, 0, 3, C.peri, a * (1 - gin(s('C05'))), 18);
    if (gC > 0) { const [x0, y0] = M.cell(3, 0), [x3] = M.cell(3, 3), [, yt] = M.cell(0, 0);
      B.line2([x0 - 30, y0], [x3 + 30, y0], C.free, gC, 4); B.line2([x0, yt - 30], [x0, y0 + 30], C.free, gC, 4); }
    ctag('det A = 2 · (−1)⁴⁺¹ · M₄₁ = −2 M₄₁', DX + 200, DY - 300, { px: 32, a: a * gin(cue('C03', '按第一列展开')), color: C.ink, font: F.serif });
    const g3 = a * gin(cue('C03', '剩下的三阶'));
    if (g3 > 0) {
      const M3 = B.mat(DX + 220, DY - 120, [[2, 3, 0], [4, 5, 0], [1, 0, 3]], { px: 36, a: g3, cell: (i, j) => j === 2 && B.t > cue('C04', '第三列也只有一个三') ? { col: i === 2 ? C.i : C.inkMid } : null });
      ctag('M₄₁ =', DX + 220 - M3.w / 2 - 70, DY - 120, { px: 30, a: g3, font: F.serif });
      if (B.t > cue('C04', '第三列也只有一个三')) K.colBox(M3, 2, 0, 2, C.i, g3, 16);
      ctag('M₄₁ = 3 · (2·5 − 3·4) = 3 · (−2) = −6', DX + 160, DY + 60, { px: 32, a: a * gin(cue('C04', '按第三列展开')), color: C.i, font: F.serif });
    }
    ctag('det A = −2 × (−6) = 12', DX, DY + 160, { px: 48, a: a * gin(s('C05')), color: OK, font: F.serif });
    B.burst(DX, DY + 160, s('C05') + 0.4, OK, { r1: 240 });
    // 符号棋盘
    const gG = a * gin(cue('G01', '画一个正负号的棋盘'));
    if (gG > 0) {
      const x0 = DX - 120, y0 = DY + 230, c = 34;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const g = gG * gin(cue('G01', '画一个正负号的棋盘') + (i + j) * 0.12); const p = (i + j) % 2 === 0;
        const hot = i === 3 && j === 0; ctag(p ? '+' : '−', x0 + j * c * 1.6 - 200, y0 + i * c - 0, { px: 30, a: g, color: hot ? C.free : (p ? C.j : C.peri), font: F.serif });
        if (hot && B.t > cue('G01', '等于负一')) K.ring(x0 + j * c * 1.6 - 200, y0 + i * c, 20, C.free, g, prog(B.t, cue('G01', '等于负一'), cue('G01', '等于负一') + 0.4), 3); }
      ctag('(−1)⁴⁺¹ = −1', DX + 200, DY + 280, { px: 32, a: a * gin(cue('G01', '第四行第一列')), color: C.free, font: F.serif });
    }
  }

  function shotAdj() {
    const a = B.win(s('C06'), s('G02') - 0.2); if (a <= 0) return;
    B.qhead('det(adj A) = ?', a);
    ctag('A · adj A = |A| I', DX, DY - 230, { px: 44, a: a * gin(s('C06') + 0.3), color: C.peri, font: F.serif });
    ctag('|A| · |adj A| = |A|⁴', DX, DY - 140, { px: 44, a: a * gin(cue('C06', '两边取行列式')), color: C.ink, font: F.serif });
    const g7 = a * gin(cue('C07', '可以约掉一个'));
    ctag('|A| = 12 ≠ 0 ⇒ |adj A| = |A|³', DX, DY - 50, { px: 40, a: g7, color: C.i, font: F.serif });
    const tR = cue('C07', '等于十二的三次方');
    const g = a * gin(tR - 0.3);
    if (g > 0) {
      const v = Math.round(lerp(0, 1728, smoother(prog(B.t, tR, cue('C07', '一千七百二十八') + 0.3))));
      ctag('12³ = ' + v, DX, DY + 80, { px: 70, a: g, color: OK, font: F.serif });
      B.burst(DX + 100, DY + 80, cue('C07', '一千七百二十八') + 0.3, OK, { r1: 300, n: 26 });
    }
    const gd = a * gin(s('D01'));
    ctag('一般地：|adj A| = |A|ⁿ⁻¹', DX, DY + 200, { px: 34, a: gd, color: C.ds, font: F.serif });
    K.pill('别死记 → 每次从 A·adjA = |A|I 现推，5 秒', DX, DY + 290, C.peri, a * gin(cue('C08', '别死记')), 26);
  }

  function shotOutro() {
    const a = B.win(s('G02'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 零多的行列式', ['① 先找最空的行或列', '② 符号看棋盘 (−1)ⁱ⁺ʲ', '③ |adj A|：从 A·adjA = |A|I 现推'],
      [s('G02') + 0.3, cue('G02', '符号看棋盘'), cue('G02', '伴随的行列式')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotDet(); shotAdj(); shotOutro();
      B.paper(EX, 'y1819_q5', { t0: s('C01') + 0.2, dock: s('C02'), out: s('G02') - 0.4 });
    });
  }
  return { TL, draw };
}
