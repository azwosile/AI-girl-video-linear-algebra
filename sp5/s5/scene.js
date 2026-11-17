// 特别篇 5 · 第 5 段：多项式空间里换基（2024–25 第 6(b) 题）。
// 分镜：原题（(a) 贴“回看上一集”标签）→ 三个多项式化身三根系数箭头，排成 P 的三列 → 旧基 = 标准基 = I
//       → 同济 P / Leon P⁻¹ 对照 → [P | I] 消元得 P⁻¹ → “P⁻¹ 的列是什么？” → 第一列拼图：(1 − x²) + x² = 1（x² 抵消）
//       → 第二列验算 → 答卷写法三行 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_ask', 'gpt_point', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_q6']);
  const B = base(R, {
    assets, label: '特别篇 5 · 过渡矩阵', title: '多项式空间里换基', hi: 5, en: '2024–25 · Q6(b)',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C05: 0.6, C07: 0.6 },
    post: { C01: 1.6, C02: 1.8, C03: 1.8, C04: 1.6, C05: 2.0, D01: 0.6, C06: 2.4, G01: 2.2, G02: 2.0, C07: 2.4 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const PL = [['1 − x²', [1, 0, -1], C.i, '对应一、零、负一'], ['x + 2', [2, 1, 0], C.j, '对应二、一、零'], ['x²', [0, 0, 1], C.k, '对应零、零、一']];
  const Pi = [[1, -2, 0], [0, 1, 0], [1, -2, 1]];

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('pluck', cue('C01', '上一集已经讲过了'), 0.25);
  PL.forEach(([, , , w]) => TL.sfx('swoosh_in', cue('C02', w), 0.25)); TL.sfx('click', cue('C03', '单位矩阵'), 0.28); TL.sfx('impact', cue('C03', 'P等于'), 0.3);
  TL.sfx('ding', cue('C04', '答案就是P'), 0.28); TL.sfx('ding', cue('C04', '答案是P逆'), 0.28); TL.sfx('impact', cue('C05', '得到P逆等于'), 0.3);
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('swoosh_soft', cue('C06', '一等于一倍的一减x方'), 0.28); TL.sfx('crack', cue('C06', '一减x方加x方'), 0.28); TL.sfx('ding_hi', cue('C06', '对'), 0.3);
  TL.sfx('check', cue('G01', '正是旧基的第二个向量'), 0.3); ['先写取系数向量', '写出P', '再写明按哪种定义'].forEach(w => TL.sfx('type', cue('G02', w), 0.22));
  TL.sfx('swell', s('C07') - 0.2, 0.3);

  function shotP() {
    const a = B.win(s('C01') + 0.6, s('D01') - 0.2); if (a <= 0) return;
    B.qhead('2024–25 · 第 6(b) 题：{1, x, x²} → {1 − x², x + 2, x²}', a);
    K.pill('(a) 张成 P₃ → 回看上一集', DX + 360, DY - 280, C.inkMid, a * gin(cue('C01', '上一集已经讲过了')) * (1 - gin(s('C02') + 2)), 22);
    ctag('按 1, x, x² 读系数', DX - 300, DY - 280, { px: 26, a: a * gin(s('C02')), color: C.inkMid });
    const ox = DX + 380, oy = DY - 60, pr = v => [ox + v[0] * 50 + v[2] * 40, oy - v[1] * 70 - v[2] * 60];
    PL.forEach(([nm, v, col, w], k) => { const g = a * gin(cue('C02', w)), x = DX - 440 + k * 210;
      ctag(nm, x, DY - 210, { px: 28, a: g, color: col, font: F.serif }); K.cvec(x, DY - 110, v, g * (1 - gin(cue('C03', 'P等于'))), { px: 30, col });
      arrow(ctx, [ox, oy], pr(v), { color: col, width: 5, head: 14, alpha: g }); });
    const g3 = a * gin(cue('C03', 'P等于'));
    if (g3 > 0) { const M = B.mat(DX - 230, DY - 100, [[1, 2, 0], [0, 1, 0], [-1, 0, 1]], { px: 34, a: g3, cell: (i, j) => ({ col: PL[j][2] }) }); ctag('P =', DX - 230 - M.w / 2 - 50, DY - 100, { px: 30, a: g3, font: F.serif }); }
    ctag('旧基 {1, x, x²} → 标准基 → I', DX - 200, DY + 40, { px: 28, a: a * gin(cue('C03', '单位矩阵')), color: C.ink });
    const g4 = a * gin(s('C04'));
    B.xcard('同济：P', DX - 300, DY + 160, 280, 76, g4 * gin(cue('C04', '答案就是P')), C.j, 32, C.j);
    B.xcard('Leon：P⁻¹', DX + 40, DY + 160, 300, 76, g4 * gin(cue('C04', '答案是P逆')), C.peri, 32, C.peri);
    const g5 = a * gin(cue('C05', '得到P逆等于'));
    if (g5 > 0) { const M = B.mat(DX + 300, DY + 160, Pi, { px: 30, a: g5, cell: () => ({ col: OK }) }); ctag('P⁻¹', DX + 300, DY + 60, { px: 26, a: g5, color: OK, font: F.serif }); B.burst(DX + 300, DY + 160, cue('C05', '得到P逆等于') + 0.3, OK, { r1: 160 }); }
  }

  function shotCols() {
    const a = B.win(s('D01'), s('C07') - 0.2); if (a <= 0) return;
    const M = B.mat(DX - 400, DY - 120, Pi, { px: 34, a, cell: (i, j) => ({ col: OK }) }); ctag('P⁻¹', DX - 400, DY - 220, { px: 28, a, color: OK, font: F.serif });
    ctag('P⁻¹ 的列 = 旧基在新基下的坐标', DX + 120, DY - 260, { px: 30, a: a * gin(s('C06')), color: C.i });
    const g6 = a * gin(cue('C06', '一等于一倍的一减x方'));
    if (g6 > 0 && B.t < s('G01') + 0.5) K.colBox(M, 0, 0, 2, C.i, g6, 14);
    // 拼图
    if (g6 > 0) {
      const y = DY - 150, t1 = cue('C06', '一减x方加x方'), m = smoother(prog(B.t, t1, t1 + 0.8));
      B.card(DX - 60 + m * 60, y, 220, 70, g6, C.i); ctag('1 − x²', DX - 60 + m * 60, y, { px: 30, a: g6, font: F.serif });
      B.card(DX + 300 - m * 100, y, 160, 70, g6, C.k); ctag('+ x²', DX + 300 - m * 100, y, { px: 30, a: g6, font: F.serif });
      ctag('0 · (x + 2)', DX + 120, y + 80, { px: 24, a: g6 * (1 - m), color: C.inkMid, font: F.serif });
      if (m > 0.6) { ctag('−x² + x² = 0', DX + 120, y + 80, { px: 26, a: g6 * gin(t1 + 0.6), color: C.free, font: F.serif }); }
      ctag('= 1 ✓', DX + 470, y, { px: 40, a: g6 * gin(cue('C06', '对')), color: OK, font: F.serif });
    }
    const gG = a * gin(s('G01'));
    if (gG > 0) {
      if (B.t < s('G02')) K.colBox(M, 1, 0, 2, C.gpt, gG, 14);
      B.card(DX + 120, DY + 30, 900, 110, gG * 0.95, C.gpt);
      ctag('−2(1 − x²) + (x + 2) − 2x² = x', DX + 120, DY + 10, { px: 30, a: gG, color: C.gpt, font: F.serif });
      ctag('= 旧基第二个向量 ✓', DX + 120, DY + 55, { px: 26, a: gG * gin(cue('G01', '正是旧基的第二个向量')), color: C.gpt });
    }
    const g2 = a * gin(s('G02'));
    ['① 取系数向量：P₃ ≅ ℝ³', '② 写出 P', '③ 写明定义：同济 P / Leon P⁻¹'].forEach((tx, k) => B.xcard(tx, DX + 120, DY + 160 + k * 70, 680, 60, g2 * gin(cue('G02', ['先写取系数向量', '写出P', '再写明按哪种定义'][k])), C.peri, 26));
  }

  function shotOutro() {
    const a = B.win(s('C07'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 多项式换基', ['① 先翻成系数向量 → 从标准基出发', '② P 的列 = 新基', '③ P⁻¹ 的列 = 旧基在新基下的坐标'],
      [s('C07') + 0.3, cue('C07', 'P的列是新基'), cue('C07', 'P逆的列')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotP(); shotCols(); shotOutro();
      B.paper(EX, 'y2425_q6', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C07') - 0.4 });
    });
  }
  return { TL, draw };
}
