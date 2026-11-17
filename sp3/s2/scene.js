// 特别篇 3 · 第 2 段：代数余子式组合 = 偷梁换柱（三道题）。
// 分镜：① 2024–25 1(2)：展开式浮现（a 橙、A 奶油微光）→ 余子式“不看第二行”（第二行变暗）→ 抽屉动画：(−2,−2,4) 滑出，(1,1,2) 滑入
//       → 新行列式消元 → −18，与“算三遍”(4 − 6 − 16) 对上
//       → ② 2020–21 第 4 题：范德蒙型，第三行换成 (0,1,1,1)（GPT 补“0”高亮）→ 消元 → 3 阶 → 12
//       → ③ 2018–19 5(b)：下标第二个数全是 1（圈出）→ 竖抽屉：第一列滑出，(1,1,−1,2) 滑入 → r₄ − r₃ → 按第 4 列展开 → 6 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_proud', 'ds_shock', 'ds_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_f2', 'y2021_q4', 'y1819_q5']);
  const B = base(R, {
    assets, label: '特别篇 3 · 行列式', title: '余子式组合 = 偷梁换柱', hi: 2, en: 'COFACTOR COMBO · SWAP THE ROW',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C03: 0.6, C05: 0.4, C07: 0.8, C12: 0.8, C17: 0.6 },
    post: { C01: 1.2, D01: 0.8, C02: 1.4, C03: 1.6, C04: 1.4, C05: 2.0, D02: 0.8, C06: 1.8, G01: 1.4, C07: 1.4, D03: 0.6, G02: 1.0, C08: 1.4, C09: 1.8, C10: 1.6, C11: 1.4, C12: 1.4, D04: 0.6, C13: 1.4, C14: 1.8, C15: 1.8, C16: 1.8, G03: 1.6, C17: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const neg = v => String(v).replace(/-/g, '−');

  const tOut1 = cue('C05', '抽屉一样抽出来'), tIn1 = cue('C05', '换成一、一、二');
  const tOut2 = s('D03') + 0.2, tIn2 = s('C08') + 0.3;
  const tOut3 = cue('C14', '零、零、零、二'), tIn3 = cue('C14', '换成一、一、负一、二');

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25);
  TL.sfx('tick', cue('C02', '四减六减十六'), 0.25); TL.sfx('shimmer', s('C03') + 0.3, 0.3); TL.sfx('hum', cue('C04', '根本不看第二行'), 0.25);
  [[tOut1, tIn1], [tOut2, tIn2], [tOut3, tIn3]].forEach(([o, i]) => { TL.sfx('swoosh_soft', o, 0.3); TL.sfx('swoosh_in', i, 0.3); TL.sfx('click', i + 0.6, 0.3); });
  TL.sfx('ding_hi', cue('C05', '这正是题目要的'), 0.3); TL.sfx('sparkle', s('D02') + 0.2, 0.3);
  TL.sfx('marimba', cue('C06', '得到零、三、零'), 0.22); TL.sfx('marimba', cue('C06', '得到零、八、负六'), 0.22); TL.sfx('impact', cue('C06', '等于负十八'), 0.3);
  TL.sfx('check', s('G01') + 0.3, 0.3);
  TL.sfx('whoosh', s('C07') + 0.2, 0.3); TL.sfx('pop', s('D03') + 0.1, 0.25); TL.sfx('buzz', s('G02') + 0.3, 0.22); TL.sfx('pluck', cue('C08', '系数是零'), 0.3);
  TL.sfx('marimba', cue('C09', '得到零、一、三、七'), 0.22); TL.sfx('marimba', cue('C09', '得到零、负二、零、负二'), 0.22); TL.sfx('warp', cue('C09', '剩下一个三阶'), 0.25);
  TL.sfx('impact', cue('C10', '等于十二'), 0.3); TL.sfx('ding_hi', s('C11') + 0.3, 0.3);
  TL.sfx('whoosh', s('C12') + 0.2, 0.3); TL.sfx('sting', s('D04') + 0.2, 0.2); TL.sfx('pluck', cue('C13', '第二个数全是一'), 0.3);
  TL.sfx('marimba', cue('C15', '得到三、负一、一、零'), 0.22); TL.sfx('warp', cue('C16', '按第四列展开'), 0.25); TL.sfx('impact', cue('C16', '等于六'), 0.3);
  TL.sfx('ding_hi', s('G03') + 0.2, 0.3); TL.sfx('swell', s('C17') - 0.2, 0.3);

  /** 抽屉矩阵：rows 原矩阵，idx 行号（或列号 vertical），newV 新内容；tOut/tIn 时刻 */
  function drawer(x, y, rows, idx, newV, tOut, tIn, a, { px = 36, vertical = false, col = C.peri, keepGlow = true } = {}) {
    const n = rows.length, uo = smoother(prog(B.t, tOut, tOut + 0.6)), ui = smoother(prog(B.t, tIn, tIn + 0.6));
    const M = B.mat(x, y, rows, { px, a, cell: (i, j) => ((vertical ? j : i) === idx) ? { a: 0 } : (keepGlow && B.t > tOut - 2 ? { col: C.ink } : null) });
    const off = vertical ? [0, 1] : [1, 0], D = 520;
    for (let k = 0; k < n; k++) {
      const [cx, cy] = vertical ? M.cell(k, idx) : M.cell(idx, k);
      const ov = rows[vertical ? k : idx][vertical ? idx : k];
      if (uo < 1) ctag(neg(ov), cx + off[0] * D * uo, cy + off[1] * D * uo * 0.6, { px, a: a * (1 - uo), color: C.inkMid, font: F.serif });
      if (B.t > tIn) ctag(neg(newV[k]), cx - off[0] * D * (1 - ui), cy - off[1] * D * 0.6 * (1 - ui), { px, a: a * ui, color: col, font: F.serif });
    }
    // 抽屉框
    const pad = 14;
    if (B.t > tOut - 1 && a > 0) {
      const [x0, y0] = vertical ? M.cell(0, idx) : M.cell(idx, 0), [x1, y1] = vertical ? M.cell(n - 1, idx) : M.cell(idx, n - 1);
      const dx = B.t < tIn ? off[0] * D * uo : -off[0] * D * (1 - ui), dy = B.t < tIn ? off[1] * D * 0.6 * uo : -off[1] * D * 0.6 * (1 - ui);
      ctx.save(); ctx.globalAlpha = a * 0.8; ctx.strokeStyle = B.t < tIn ? C.inkMid : col; ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
      ctx.strokeRect(Math.min(x0, x1) - px + dx - pad, Math.min(y0, y1) - px * 0.7 + dy - pad, Math.abs(x1 - x0) + 2 * px + 2 * pad, Math.abs(y1 - y0) + px * 1.4 + 2 * pad); ctx.restore();
    }
    return M;
  }

  // ① 2024–25
  function shot1() {
    const a = B.win(s('C01') + 0.6, s('C07') - 0.3); if (a <= 0) return;
    B.qhead('2024–25 · 填空 1(2)：A₂₁ + A₂₂ + 2A₂₃ = ?', a);
    const A = [[1, -2, 2], [-2, -2, 4], [2, 4, -2]];
    const g2 = a * B.win(s('C02'), s('C03'));
    ctag('A₂₁ = 4,  A₂₂ = −6,  A₂₃ = −8  →  4 − 6 − 16 = −18（算三遍）', DX, DY + 300, { px: 26, a: g2 * gin(cue('C02', '四减六减十六')), color: C.inkMid, font: F.serif });
    const gF = a * gin(s('C03')) * (1 - gin(s('C06')));
    if (gF > 0) {
      const y = DY - 250, swapped = B.t > tIn1 + 0.4;
      ctag('det =', DX - 380, y, { px: 34, a: gF, font: F.serif });
      const co = swapped ? ['1', '1', '2'] : ['a₂₁', 'a₂₂', 'a₂₃'];
      co.forEach((c, k) => { const x = DX - 220 + k * 230;
        ctag(c, x - 40, y, { px: 34, a: gF, color: C.peri, font: F.serif });
        ctag('+', x - 115, y, { px: 34, a: gF * (k ? 1 : 0), font: F.serif });
        const gl = 0.6 + 0.4 * Math.sin(B.t * 4 + k);
        ctx.save(); ctx.shadowColor = C.i; ctx.shadowBlur = 18 * gl * gF; ctag('A₂' + (k + 1), x + 30, y, { px: 34, a: gF, color: C.ink, font: F.serif }); ctx.restore(); });
    }
    const gM = a * gin(s('C04') - 0.5) * (1 - gin(s('C06') + 0.4));
    if (gM > 0) {
      const M = drawer(DX, DY + 30, A, 1, [1, 1, 2], tOut1, tIn1, gM, { px: 40 });
      if (B.t < tOut1) K.rowBox(M, 1, 0, 2, C.inkMid, gM * gin(cue('C04', '根本不看第二行')), 22);
      ctag('余子式：划掉第 2 行算 → 纹丝不动', DX, DY + 210, { px: 28, a: gM * gin(cue('C04', '根本不看第二行')), color: C.i });
      K.pill('偷梁换柱！', DX + 340, DY + 30, C.ds, gM * gin(s('D02')), 30);
    }
    // 新行列式消元
    const S = [[[1, -2, 2], [1, 1, 2], [2, 4, -2]], [[1, -2, 2], [0, 3, 0], [2, 4, -2]], [[1, -2, 2], [0, 3, 0], [0, 8, -6]]];
    const g6 = a * gin(s('C06') + 0.2);
    if (g6 > 0) {
      const { M } = K.steps(S, [0, cue('C06', '得到零、三、零'), cue('C06', '得到零、八、负六')], [null, [[1, 'r₂ − r₁']], [[2, 'r₃ − 2r₁']]], { x: DX - 80, y: DY - 60, px: 40, a: g6 });
      ctag('= 1 · (3 · (−6) − 0) = −18', DX, DY + 150, { px: 40, a: g6 * gin(cue('C06', '行列式等于')), color: OK, font: F.serif });
      B.burst(DX + 200, DY + 150, cue('C06', '等于负十八'), OK, { r1: 200 });
      const gG = a * gin(s('G01'));
      B.card(DX, DY + 280, 820, 76, gG * 0.95, C.gpt); ctag('= 算三遍的 −18 ✓  草稿写清：换的是第几行', DX, DY + 280, { px: 26, a: gG, color: C.gpt });
    }
  }

  // ② 2020–21
  function shot2() {
    const a = B.win(s('C07') + 0.5, s('C12') - 0.3); if (a <= 0) return;
    B.qhead('2020–21 · 第 4 题(2)：A₃₂ + A₃₃ + A₃₄ = ?', a);
    const V = [[1, 1, 1, 1], [1, 2, 4, 8], [1, 3, 9, 27], [1, -1, 1, -1]];
    const gv = a * (1 - gin(s('C09') - 0.2));
    if (gv > 0) {
      ctag('det A = −48（第 2 章复习）', DX + 330, DY + 200, { px: 24, a: gv * gin(s('C07') + 2), color: C.inkMid });
      const pre = B.t < s('C08');
      const M = pre ? drawer(DX, DY - 30, V, 2, ['?', 1, 1, 1], s('D03') + 0.2, s('D03') + 0.8, gv, { px: 34, col: C.ds })
                    : drawer(DX, DY - 30, V, 2, [0, 1, 1, 1], s('C08') - 10, tIn2, gv, { px: 34 });
      const gG = a * B.win(s('G02'), s('C09'));
      if (gG > 0) K.ring(...M.cell(2, 0), 30, C.gpt, gG, prog(B.t, s('G02') + 0.3, s('G02') + 0.8), 5);
      ctag('A₃₁ 缺席 → 系数 0', DX, DY + 200, { px: 30, a: a * gin(s('G02') + 0.4) * gin(s('C08')) * (1 - gin(s('C09') - 0.2)), color: C.gpt });
    }
    const S = [[[1, 1, 1, 1], [1, 2, 4, 8], [0, 1, 1, 1], [1, -1, 1, -1]], [[1, 1, 1, 1], [0, 1, 3, 7], [0, 1, 1, 1], [1, -1, 1, -1]], [[1, 1, 1, 1], [0, 1, 3, 7], [0, 1, 1, 1], [0, -2, 0, -2]]];
    const g9 = a * gin(s('C09') - 0.2);
    if (g9 > 0) {
      const { M } = K.steps(S, [0, cue('C09', '得到零、一、三、七'), cue('C09', '得到零、负二、零、负二')], [null, [[1, 'r₂ − r₁']], [[3, 'r₄ − r₁']]], { x: DX - 260, y: DY - 60, px: 32, a: g9 });
      const g3 = g9 * gin(cue('C09', '剩下一个三阶'));
      if (g3 > 0) { K.colBox(M, 0, 0, 3, C.i, g3 * (1 - gin(s('C10'))), 18);
        arrow(ctx, [DX - 40, DY - 60], [DX + 60, DY - 60], { color: C.i, width: 4, head: 14, alpha: g3 });
        B.mat(DX + 260, DY - 60, [[1, 3, 7], [1, 1, 1], [-2, 0, -2]], { px: 34, a: g3 }); }
      const g10 = g9 * gin(s('C10'));
      ctag('1·(−2 − 0) − 3·(−2 + 2) + 7·(0 + 2)', DX, DY + 140, { px: 30, a: g10, font: F.serif });
      ctag('= −2 + 0 + 14 = 12', DX, DY + 200, { px: 40, a: g10 * gin(cue('C10', '等于负二加零加十四')), color: OK, font: F.serif });
      B.burst(DX + 150, DY + 200, cue('C10', '等于十二'), OK, { r1: 180 });
      B.xcard('A₃₂ + A₃₃ + A₃₄ = 12', DX, DY + 300, 520, 76, a * gin(s('C11')), OK, 34, OK);
    }
  }

  // ③ 2018–19
  function shot3() {
    const a = B.win(s('C12') + 0.5, s('C17') - 0.3); if (a <= 0) return;
    B.qhead('2018–19 · 第 5(b) 题：A₁₁ + A₂₁ − A₃₁ + 2A₄₁ = ?', a);
    const A = [[0, 2, 3, 0], [0, 4, 5, 0], [0, 1, 0, 3], [2, 0, 1, 3]];
    const gi = a * B.win(s('C13'), s('C15') - 0.2);
    if (gi > 0) {
      ['A₁₁', 'A₂₁', 'A₃₁', 'A₄₁'].forEach((tx, k) => { const x = DX - 270 + k * 180, y = DY - 260;
        ctag(tx, x, y, { px: 40, a: gi, font: F.serif }); K.ring(x + 18, y + 10, 16, C.peri, gi * gin(cue('C13', '第二个数全是一') + k * 0.2), 1, 3); });
      ctag('第二个下标不变 → 第 1 列', DX, DY - 190, { px: 28, a: gi * gin(cue('C13', '它们都在第一列')), color: C.peri });
    }
    const gw = a * B.win(s('D04'), s('C13') + 0.5);
    ctag('换第一行？', DX + 360, DY + 220, { px: 30, a: gw, color: C.ds }); if (gw > 0 && B.t > s('C13')) B.cross(DX + 360, DY + 220, prog(B.t, s('C13'), s('C13') + 0.4), gw, 60);
    const gM = a * B.win(s('C13') + 0.3, s('C15') - 0.1);
    if (gM > 0) drawer(DX, DY + 30, A, 0, [1, 1, -1, 2], tOut3, tIn3, gM, { px: 36, vertical: true });
    ctag('行、列都能展开 → 两个方向都能换', DX, DY + 280, { px: 26, a: a * B.win(cue('C14', '行列式按行按列'), s('C15') - 0.1), color: C.i });
    const N = [[1, 2, 3, 0], [1, 4, 5, 0], [-1, 1, 0, 3], [2, 0, 1, 3]], N2 = [[1, 2, 3, 0], [1, 4, 5, 0], [-1, 1, 0, 3], [3, -1, 1, 0]];
    const g15 = a * gin(s('C15'));
    if (g15 > 0) {
      const { M } = K.steps([N, N2], [0, cue('C15', '得到三、负一、一、零')], [null, [[3, 'r₄ − r₃']]], { x: DX - 260, y: DY - 60, px: 32, a: g15 });
      const g16 = g15 * gin(s('C16'));
      if (g16 > 0) {
        K.colBox(M, 3, 0, 3, C.i, g16, 18); K.ring(...M.cell(2, 3), 26, C.peri, g16, prog(B.t, s('C16'), s('C16') + 0.5));
        ctag('(−1)³⁺⁴ = −1', DX - 260, DY + 110, { px: 28, a: g16 * gin(cue('C16', '符号是')), color: C.peri, font: F.serif });
        ctag('−3 ×', DX + 30, DY - 60, { px: 34, a: g16 * gin(cue('C16', '行列式等于负三乘')), font: F.serif });
        B.mat(DX + 230, DY - 60, [[1, 2, 3], [1, 4, 5], [3, -1, 1]], { px: 32, a: g16 * gin(cue('C16', '行列式等于负三乘')) });
        ctag('= −2', DX + 420, DY - 60, { px: 34, a: g16 * gin(cue('C16', '这个三阶等于负二')), color: C.i, font: F.serif });
        ctag('−3 × (−2) = 6', DX, DY + 190, { px: 44, a: g16 * gin(cue('C16', '所以结果是')), color: OK, font: F.serif });
        B.burst(DX, DY + 190, cue('C16', '等于六'), OK, { r1: 200 });
      }
      const gG = a * gin(s('G03'));
      B.card(DX, DY + 300, 860, 76, gG * 0.95, C.gpt); ctag('Aᵢⱼ：i 是行，j 是列；哪个下标不变，就换那一行/列', DX, DY + 300, { px: 26, a: gG, color: C.gpt });
    }
  }

  function shotOutro() {
    const a = B.win(s('C17'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 余子式组合', ['① 组合 = 把那一行/列换成系数，再求 det', '② 缺的项，系数补 0', '③ 看清哪个下标不变'],
      [s('C17') + 0.3, cue('C17', '缺的项补零'), cue('C17', '看清哪个下标不变')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shot1(); shot2(); shot3(); shotOutro();
      B.paper(EX, 'y2425_f2', { t0: s('C01') + 0.2, dock: s('D01'), out: s('C07') - 0.4 });
      B.paper(EX, 'y2021_q4', { t0: s('C07') + 0.2, dock: s('D03'), out: s('C12') - 0.4 });
      B.paper(EX, 'y1819_q5', { t0: s('C12') + 0.2, dock: s('D04'), out: s('C17') - 0.4 });
    });
  }
  return { TL, draw };
}
