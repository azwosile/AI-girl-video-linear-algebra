// 特别篇 2 · 第 2 段：带分数的 LU + 逆（2020–21 第 3 题，10 分）。
// 分镜：原题三步 → 大肥鱼主刀消元（三步，乘数飞进 L，操作标签用 DS 蓝）→ “完美”印章 + L、U 成型
//       → det = 1·2·3 → [A | I] 前半程照抄（右半 = L⁻¹，解释“操作本身”）→ 从下往上三步（分数格逐个翻牌）
//       → A⁻¹ → 第一行全是 1：列和验算三连 → 分数 vs 小数（3.83 被划掉）→ 十秒随堂 2×2 LU → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_ask', 'ds_happy', 'ds_proud', 'ds_shock', 'ds_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2021_q3']);
  const B = base(R, {
    assets, label: '特别篇 2 · LU 与初等矩阵', title: '带分数的 LU + 逆', hi: 2, en: '2020–21 · Q3 · 10 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C04: 0.6, C06: 0.4, C11: 0.8, C13: 0.6 },
    post: { C01: 1.0, D02: 1.4, D03: 1.4, D04: 1.6, C02: 1.6, C03: 1.4, C04: 1.8, C05: 1.4, C06: 1.6, C07: 1.6, C08: 1.6, C09: 1.8, G01: 1.6, C10: 1.2, G02: 1.4, C11: 10.0, D07: 1.4, C12: 1.4, C13: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const S = [[[1, 1, 1], [3, 5, 6], [-2, 2, 7]], [[1, 1, 1], [0, 2, 3], [-2, 2, 7]], [[1, 1, 1], [0, 2, 3], [0, 4, 9]], [[1, 1, 1], [0, 2, 3], [0, 0, 3]]];
  const T = [0, cue('D02', '得到零'), cue('D03', '得到零'), cue('D04', '零、零、三')];
  const OPS = [null, [[1, 'r₂ − 3r₁']], [[2, 'r₃ − (−2)r₁']], [[2, 'r₃ − 2r₂']]];
  const LF = [[1, 0, cue('D02', '三进L'), '3'], [2, 0, cue('D03', '负二进L'), '−2'], [2, 1, cue('D04', '二进L'), '2']];
  const SI = [
    [[1, 1, 1, 1, 0, 0], [3, 5, 6, 0, 1, 0], [-2, 2, 7, 0, 0, 1]],
    [[1, 1, 1, 1, 0, 0], [0, 2, 3, -3, 1, 0], [0, 0, 3, 8, -2, 1]],
    [[1, 1, 1, 1, 0, 0], [0, 2, 3, -3, 1, 0], [0, 0, 1, '8/3', '−⅔', '⅓']],
    [[1, 1, 1, 1, 0, 0], [0, 1, 0, '−11/2', '3/2', '−½'], [0, 0, 1, '8/3', '−⅔', '⅓']],
    [[1, 0, 0, '23/6', '−5/6', '1/6'], [0, 1, 0, '−11/2', '3/2', '−½'], [0, 0, 1, '8/3', '−⅔', '⅓']],
  ];
  const TI = [0, cue('C04', '右半边的三行'), cue('C06', '右半边变成'), cue('C07', '得到'), cue('C08', '得到')];
  const OPI = [null, [[1, '照抄 LU 三步']], [[2, 'r₃ ÷ 3']], [[1, '(r₂ − 3r₃) ÷ 2']], [[0, 'r₁ − r₂ − r₃']]];

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25);
  [1, 2, 3].forEach(k => { TL.sfx('swoosh_soft', T[k], 0.25); TL.sfx('marimba', T[k] + 0.4, 0.22); });
  LF.forEach(([, , t]) => { TL.sfx('whoosh', t, 0.25); TL.sfx('pluck', t + 0.8, 0.3); });
  TL.sfx('stamp', s('C02') + 0.2, 0.35); TL.sfx('ding', cue('C03', '等于六'), 0.3);
  TI.slice(1).forEach(t => { TL.sfx('swoosh_soft', t, 0.25); TL.sfx('marimba_lo', t + 0.4, 0.22); });
  TL.sfx('pop', s('D05') + 0.2, 0.25); TL.sfx('ding_hi', cue('C05', 'L的逆'), 0.3);
  TL.sfx('impact', s('C09') + 0.3, 0.3); TL.sfx('sting', s('D06') + 0.2, 0.2);
  ['等于一', '等于零；六分之一', '六分之一减二分之一'].forEach(w => TL.sfx('check', cue('G01', w), 0.28));
  TL.sfx('buzz', cue('G02', '会被扣分'), 0.22);
  TL.sfx('count', cue('C11', '十秒钟'), 0.3); TL.sfx('count_go', s('D07'), 0.3); TL.sfx('check', s('C12') + 0.2, 0.3);
  TL.sfx('swell', s('C13') - 0.2, 0.3);

  const LX0 = DX + 250, LY0 = DY - 220;
  function shotLU() {
    const a = B.win(s('D01'), s('C04') - 0.3); if (a <= 0) return;
    B.qhead('大肥鱼主刀：A 的 LU', a, C.ds);
    const { M } = K.steps(S, T, OPS, { x: DX - 140, y: DY - 220, px: 36, a });
    const ML = B.mat(LX0, LY0, [[1, 0, 0], ['3', 1, 0], ['−2', '2', 1]], { px: 36, a: a * gin(s('D02')), cell: (i, j) => {
      const lf = LF.find(([r, c]) => r === i && c === j); if (!lf) return null; const g = gin(lf[2] + 0.8);
      return g > 0.02 ? { a: g, col: C.peri } : { txt: '□', col: C.inkMid, a: 0.6 };
    } });
    ctag('L =', LX0 - ML.w / 2 - 50, LY0, { px: 30, a: a * gin(s('D02')), color: C.peri, font: F.serif });
    LF.forEach(([i, j, t0, tx]) => { const u = prog(B.t, t0, t0 + 0.8); if (u > 0 && u < 1) B.fly([...M.cell(i, j)], ML.cell(i, j), u, C.ds, { lift: 120, r: 10, txt: tx, px: 30 }); });
    K.redStamp('完美', DX + 250, DY + 40, prog(B.t, s('C02') + 0.2, s('C02') + 0.7), a * gin(s('C02') + 0.2), OK, 56);
    const gU = a * gin(cue('C02', 'U的三行'));
    ctag('U = 消元结果，L = 乘数', DX - 140, DY - 40, { px: 28, a: gU, color: C.ink });
    const gd = a * gin(s('C03'));
    if (gd > 0) { [0, 1, 2].forEach(k => K.ring(...M.cell(k, k), 28, C.i, gd, prog(B.t, s('C03') + 0.3 + k * 0.3, s('C03') + 0.8 + k * 0.3)));
      ctag('det A = 1 · 2 · 3 = 6 ≠ 0 ⇒ 可逆', DX, DY + 200, { px: 36, a: gd * gin(cue('C03', '等于六')), color: C.i, font: F.serif }); }
  }

  function shotInv() {
    const a = B.win(s('C04'), s('C11') - 0.3); if (a <= 0) return;
    B.qhead('求逆：[A | I] → [I | A⁻¹]', a);
    const { M } = K.steps(SI, TI, OPI, { x: DX + 40, y: DY - 210, px: 30, bar: 3, a, cw: 92, rh: 58, lx: DX - 440, hi: (i, j, k) => k === 1 && j >= 3 ? C.j : null });
    const g5 = a * B.win(s('D05'), s('C06'));
    if (g5 > 0) { K.colBox(M, 3, 0, 2, C.j, 0, 0); ctag('右半 = L⁻¹（对 I 做同样的消元 = 操作本身）', DX + 40, DY - 30, { px: 26, a: g5 * gin(cue('C05', 'L的逆')), color: C.j }); }
    if (B.t > TI[2] - 0.2 && B.t < TI[3] + 1.5) K.rowBox(M, 2, 3, 5, OK, a * gin(TI[2] + 0.5), 20);
    const g9 = a * gin(s('C09'));
    if (g9 > 0) {
      ctag('A⁻¹ =', DX - 180, DY + 110, { px: 34, a: g9, color: OK, font: F.serif });
      const MA = B.mat(DX + 30, DY + 110, [['23/6', '−5/6', '1/6'], ['−11/2', '3/2', '−½'], ['8/3', '−⅔', '⅓']], { px: 30, a: g9, cw: 96, rh: 52, cell: () => ({ col: OK }) });
      B.burst(DX + 30, DY + 110, s('C09') + 0.3, OK, { r1: 220 });
      const gv = a * B.win(s('G01'), s('G02') - 0.1);
      if (gv > 0) {
        ['等于一', '等于零；六分之一', '六分之一减二分之一'].forEach((w, j) => { K.colBox(MA, j, 0, 2, C.gpt, gv * gin(cue('G01', w) - 1.5) * (1 - gin(cue('G01', w) + 2.5)), 16); });
        B.card(DX + 40, DY + 300, 860, 90, gv * 0.95, C.gpt);
        ctag('第 1 行 (1, 1, 1) · 各列 = 列和：1 ✓  0 ✓  0 ✓', DX + 40, DY + 300, { px: 28, a: gv, color: C.gpt, font: F.serif });
      }
      const g10 = a * gin(s('C10'));
      ctag('挑最简单的那一行来验', DX + 40, DY + 230, { px: 26, a: g10 * (1 - gin(s('G02'))), color: C.i });
      const gf = a * gin(s('G02'));
      if (gf > 0) {
        B.card(DX + 40, DY + 300, 860, 90, gf, C.gpt);
        ctag('23/6', DX - 120, DY + 300, { px: 38, a: gf, color: OK, font: F.serif }); ctag('✓', DX - 40, DY + 300, { px: 34, a: gf, color: OK });
        ctag('3.83', DX + 160, DY + 300, { px: 38, a: gf, color: C.free, font: F.serif });
        B.cross(DX + 160, DY + 300, prog(B.t, cue('G02', '会被扣分'), cue('G02', '会被扣分') + 0.4), gf, 40);
      }
    }
  }

  function shotQuiz() {
    const a = B.win(s('C11'), s('C13') - 0.2); if (a <= 0) return;
    B.card(DX, DY - 200, 700, 110, a, C.peri);
    ctag('随堂：[[1, 2], [3, 4]] 的 LU？', DX, DY - 200, { px: 34, a, font: F.serif });
    K.countdown(DX, DY - 50, cue('C11', '十秒钟'), 10, s('D07'), a);
    const g = a * gin(cue('D07', 'L是'));
    if (g > 0) {
      ctag('L =', DX - 300, DY + 120, { px: 32, a: g, color: C.peri, font: F.serif }); B.mat(DX - 190, DY + 120, [[1, 0], [3, 1]], { px: 36, a: g, cell: (i, j) => i === 1 && j === 0 ? { col: C.peri } : null });
      ctag('U =', DX + 60, DY + 120, { px: 32, a: g * gin(cue('D07', 'U是')), font: F.serif }); B.mat(DX + 170, DY + 120, [[1, 2], [0, -2]], { px: 36, a: g * gin(cue('D07', 'U是')) });
    }
    const gd = a * gin(cue('C12', '行列式'));
    ctag('det = 1 · (−2) = −2 = 1·4 − 2·3 ✓', DX, DY + 280, { px: 32, a: gd, color: C.i, font: F.serif });
  }

  function shotOutro() {
    const a = B.win(s('C13'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 求逆', ['① [A | I] 的前半程 = LU', '② 右半边先出 L⁻¹', '③ 从下往上回代，各行 ÷ 主元', '④ 挑最简单的一行验算'],
      [s('C13') + 0.3, cue('C13', '右半边先出'), cue('C13', '从下往上'), cue('C13', '挑最简单')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotLU(); shotInv(); shotQuiz(); shotOutro();
      B.paper(EX, 'y2021_q3', { t0: s('C01') + 0.2, dock: s('D01') + 0.3, out: s('C11') - 0.4 });
    });
  }
  return { TL, draw };
}
