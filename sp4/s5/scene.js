// 特别篇 4 · 第 5 段：函数与多项式的相关性（2018–19 第 8 题；2024–25 1(4)；2023–24 1(3)；2023–24 第 6 题；2017–18 第 3 题；张成 P₃ 一族）。
// 分镜：两条路分屏（左朗斯基瀑布，右系数箭头）→ 第 8(1) 题：五个函数逐行求导往下“流”，下三角变 0，对角线 0!…4! → 288
//       → 第 8(2) 题：x = 0 处变范德蒙（节点 0,1,2,3），后减前六个因子 → 12 → 两道填空连发（连击 +1 +1）
//       → GPT 警告：W ≠ 0 ⇒ 无关（单向箭头，反向被打叉）→ x² 与 x|x| 反例 → 多项式：三个多项式化身系数箭头 → det 6
//       → 同类 det 1 → 张成 P₃ 三张卡依次翻牌 → 评分点 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_confused', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q8', 'y2324_f3', 'y2324_q6', 'y1718_q3']);
  const B = base(R, {
    assets, label: '特别篇 4 · 向量空间与子空间', title: '函数与多项式的相关性', hi: 5, en: 'WRONSKIAN · COEFFICIENT VECTORS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.6, C05: 0.6, C07: 0.8, C10: 0.8, C14: 0.6, C16: 0.6 },
    post: { C01: 1.6, C02: 1.2, C03: 1.6, C04: 2.0, C05: 1.8, C06: 2.0, C07: 1.8, C08: 1.8, G01: 1.6, D01: 0.6, C09: 1.6, C10: 1.4, C11: 1.8, C12: 1.8, C13: 1.4, C14: 1.6, C15: 2.0, G02: 1.6, C16: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tW = s('C03') + 0.3, tD = cue('C04', '对角线是');
  const W5 = [['1', 'x', 'x²', 'x³', 'x⁴'], ['0', '1', '2x', '3x²', '4x³'], ['0', '0', '2', '6x', '12x²'], ['0', '0', '0', '6', '24x'], ['0', '0', '0', '0', '24']];
  let combo = 0;
  TL.sfx('swoosh_soft', cue('C01', '朗斯基行列式'), 0.3); TL.sfx('swoosh_soft', cue('C01', '翻译成系数向量'), 0.3);
  TL.sfx('whoosh', s('C02') + 0.2, 0.3); TL.sfx('stamp', s('C02') + 2.6, 0.3);
  [0, 1, 2, 3, 4].forEach(k => TL.sfx('marimba_lo', tW + k * 0.5, 0.2)); [0, 1, 2, 3, 4].forEach(k => TL.sfx('ding_hi', tD + k * 0.25, 0.2));
  TL.sfx('riser', cue('C04', 'W等于') - 0.3, 0.22); TL.sfx('impact', cue('C04', '二百八十八'), 0.32);
  TL.sfx('warp', cue('C05', '在x等于零处'), 0.25); TL.sfx('shimmer', cue('C05', '范德蒙行列式'), 0.3);
  [0, 1, 2, 3, 4, 5].forEach(k => TL.sfx('tick', cue('C06', '一减零') + k * 0.5, 0.2)); TL.sfx('impact', cue('C06', '等于十二'), 0.32);
  TL.sfx('ding_hi', cue('C07', '无关'), 0.3); TL.sfx('sparkle', cue('C07', '无关') + 0.15, 0.25); TL.sfx('ding_hi', cue('C08', '无关'), 0.3); TL.sfx('sparkle', cue('C08', '无关') + 0.15, 0.25);
  TL.sfx('buzz', cue('G01', '推不出相关'), 0.25); TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('pluck', cue('C09', '有反例'), 0.3);
  TL.sfx('whoosh', s('C10') + 0.2, 0.3); [0, 1, 2].forEach(k => TL.sfx('swoosh_in', cue('C11', ['对应二、一、零', '对应负四、一、零', '对应三、负二、一'][k]), 0.25));
  TL.sfx('impact', cue('C12', '等于六'), 0.3); TL.sfx('ding', cue('C13', '系数行列式等于一'), 0.3);
  TL.sfx('hum', s('C14') + 0.3, 0.22); ['行列式等于负二', '负x、x加一、x方，行列式等于一', '一减x方、x加二、x方，行列式等于一'].forEach(w => TL.sfx('stamp', cue('C15', w), 0.25));
  TL.sfx('zap', cue('G02', '评分点'), 0.25); TL.sfx('swell', s('C16') - 0.2, 0.3);

  function shotSplit() {
    const a = B.win(s('C01'), s('C02') + 0.6); if (a <= 0) return;
    B.line2([DX, DY - 300], [DX, DY + 300], C.inkMid, a * 0.5, 2);
    const g1 = a * gin(cue('C01', '朗斯基行列式'));
    ctag('函数 → 朗斯基 W', DX - 300, DY - 240, { px: 34, a: g1, color: C.peri });
    ['f', 'f′', 'f″', 'f‴'].forEach((tx, k) => ctag(tx, DX - 300, DY - 150 + k * 70, { px: 34, a: g1 * gin(cue('C01', '朗斯基行列式') + k * 0.3), color: C.ink, font: F.serif }));
    const g2 = a * gin(cue('C01', '翻译成系数向量'));
    ctag('多项式 → 系数向量', DX + 300, DY - 240, { px: 34, a: g2, color: C.j });
    const ox = DX + 300, oy = DY + 100;
    [[2, 1, C.i], [-1.5, 1, C.k], [1, -1.6, C.free]].forEach(([x, y, col], k) => arrow(ctx, [ox, oy], [ox + x * 60, oy - y * 60 - k * 10], { color: col, width: 6, head: 16, alpha: g2 * gin(cue('C01', '翻译成系数向量') + k * 0.3) }));
  }

  function shotW5() {
    const a = B.win(s('C02') + 0.8, s('C05') - 0.2); if (a <= 0) return;
    B.qhead('2018–19 · 第 8(1) 题：{1, x, x², x³, x⁴} 线性无关', a);
    const M = B.mat(DX - 80, DY - 20, W5, { px: 34, a, cw: 110, rh: 72, cell: (i, j) => {
      const g = gin(tW + i * 0.5, 0.5); const lower = i > j; const diag = i === j && B.t > tD + i * 0.25;
      return { a: g, col: diag ? C.i : lower && B.t > tD ? C.inkMid : C.ink, txt: W5[i][j] }; } });
    // 流动箭头
    [0, 1, 2, 3].forEach(i => { const u = prog(B.t, tW + i * 0.5, tW + i * 0.5 + 0.5); if (u > 0 && u < 1) { const [x, y] = M.cell(i, 4); arrow(ctx, [x + 80, y], [x + 80, y + 72 * u], { color: C.peri, width: 4, head: 12, alpha: a }); } });
    ctag('d/dx ↓', DX - 80 + M.w / 2 + 70, DY - 20, { px: 24, a: a * gin(tW) * (1 - gin(tD)), color: C.peri });
    if (B.t > tD) [0, 1, 2, 3, 4].forEach(k => K.ring(...M.cell(k, k), 34, C.i, a, prog(B.t, tD + k * 0.25, tD + k * 0.25 + 0.4)));
    const t4 = cue('C04', 'W等于'), v = Math.round(lerp(1, 288, smoother(prog(B.t, t4, cue('C04', '二百八十八')))));
    ctag('W = 0!·1!·2!·3!·4! = ' + v, DX, DY + 280, { px: 40, a: a * gin(t4), color: OK, font: F.serif });
    ctag('≠ 0 ⇒ 无关', DX + 380, DY + 280, { px: 32, a: a * gin(cue('C04', '不等于零')), color: OK });
  }

  function shotVdm() {
    const a = B.win(s('C05') + 0.4, s('C07') - 0.2); if (a <= 0) return;
    B.qhead('2018–19 · 第 8(2) 题：{1, eˣ, e²ˣ, e³ˣ}', a);
    const M = B.mat(DX - 200, DY - 60, [[1, 1, 1, 1], [0, 1, 2, 3], [0, 1, 4, 9], [0, 1, 8, 27]], { px: 34, a: a * gin(cue('C05', '在x等于零处')), cell: (i, j) => i === 1 ? { col: C.i } : null });
    ctag('W(0) =', DX - 200 - M.w / 2 - 80, DY - 60, { px: 30, a: a * gin(cue('C05', '在x等于零处')), font: F.serif });
    ctag('(eᵏˣ)⁽ⁿ⁾ = kⁿ eᵏˣ → x = 0：1, k, k², k³', DX + 100, DY - 290, { px: 26, a: a * gin(cue('C05', '各阶导数')), color: C.ink, font: F.serif });
    ctag('范德蒙：节点 0, 1, 2, 3', DX + 250, DY - 160, { px: 28, a: a * gin(cue('C05', '范德蒙行列式')), color: C.i });
    const F6 = ['(1−0)', '(2−0)', '(3−0)', '(2−1)', '(3−1)', '(3−2)'];
    F6.forEach((tx, k) => ctag(tx, DX + 130 + (k % 3) * 120, DY - 60 + Math.floor(k / 3) * 60, { px: 28, a: a * gin(cue('C06', '一减零') + k * 0.5), color: C.peri, font: F.serif }));
    ctag('= 1·2·3·1·2·1 = 12 ≠ 0 ⇒ 无关', DX, DY + 180, { px: 40, a: a * gin(cue('C06', '乘起来是')), color: OK, font: F.serif });
    B.burst(DX, DY + 180, cue('C06', '等于十二'), OK, { r1: 220 });
  }

  function shotFill() {
    const a = B.win(s('C07') + 0.4, s('C10') - 0.2); if (a <= 0) return;
    const g7 = a * gin(s('C07'));
    B.card(DX - 240, DY - 150, 520, 230, g7 * 0.92, C.peri);
    ctag('2024–25 · 填空：1, sin x, cos x', DX - 240, DY - 235, { px: 24, a: g7, color: C.peri });
    B.mat(DX - 300, DY - 140, [['1', 'sin x', 'cos x'], ['0', 'cos x', '−sin x'], ['0', '−sin x', '−cos x']], { px: 24, a: g7, cw: 100, rh: 44 });
    ctag('W = −cos²x − sin²x = −1', DX - 240, DY - 50, { px: 26, a: g7 * gin(cue('C07', '按第一列展开')), color: OK, font: F.serif });
    const g8 = a * gin(s('C08'));
    B.card(DX + 300, DY - 150, 480, 230, g8 * 0.92, C.j);
    ctag('2023–24 · 填空：eˣ, e⁻ˣ', DX + 300, DY - 235, { px: 24, a: g8, color: C.j });
    B.mat(DX + 300, DY - 150, [['eˣ', 'e⁻ˣ'], ['eˣ', '−e⁻ˣ']], { px: 26, a: g8, cw: 110, rh: 48 });
    ctag('W = −1 − 1 = −2', DX + 300, DY - 70, { px: 28, a: g8 * gin(cue('C08', '等于负二')), color: OK, font: F.serif });
    const n = (B.t > cue('C07', '无关') ? 1 : 0) + (B.t > cue('C08', '无关') ? 1 : 0);
    B.combo(n, DX + 560, DY - 300, n === 2 ? cue('C08', '无关') : cue('C07', '无关'), a * (1 - gin(s('G01'))), 'COMBO');
    const gG = a * gin(s('G01'));
    if (gG > 0) {
      ctag('W ≠ 0', DX - 260, DY + 100, { px: 40, a: gG, color: C.ink, font: F.serif }); ctag('无关', DX + 260, DY + 100, { px: 40, a: gG, color: C.ink });
      arrow(ctx, [DX - 140, DY + 85], [DX + 160, DY + 85], { color: OK, width: 6, head: 18, alpha: gG });
      const gr = gG * gin(cue('G01', '推不出相关'));
      ctag('W ≡ 0', DX - 260, DY + 190, { px: 36, a: gr, color: C.inkMid, font: F.serif }); ctag('相关', DX + 260, DY + 190, { px: 36, a: gr, color: C.inkMid });
      arrow(ctx, [DX - 140, DY + 190], [DX + 160, DY + 190], { color: C.free, width: 5, head: 16, alpha: gr });
      if (gr > 0) B.cross(DX, DY + 190, prog(B.t, cue('G01', '推不出相关'), cue('G01', '推不出相关') + 0.4), gr, 50);
      ctag('反例：x² 与 x|x|（无关，但 W ≡ 0）· 期中不考', DX, DY + 290, { px: 26, a: a * gin(cue('C09', '有反例')), color: C.i, font: F.serif });
    }
  }

  function shotPoly() {
    const a = B.win(s('C10') + 0.4, s('C14') - 0.2); if (a <= 0) return;
    B.qhead('2023–24 · 第 6 题：P₃ 中 x + 2, x − 4, x² − 2x + 3', a);
    const P = [['x + 2', [2, 1, 0], C.i, '对应二、一、零'], ['x − 4', [-4, 1, 0], C.k, '对应负四、一、零'], ['x² − 2x + 3', [3, -2, 1], C.free, '对应三、负二、一']];
    ctag('基：1, x, x²', DX - 380, DY - 270, { px: 26, a: a * gin(s('C11')), color: C.inkMid });
    P.forEach(([nm, v, col, w], k) => { const g = a * gin(cue('C11', w)), x = DX - 380 + k * 230;
      ctag(nm, x, DY - 200, { px: 28, a: g, color: col, font: F.serif }); K.cvec(x, DY - 80, v, g, { px: 32, col }); });
    // 3D-ish 小箭头
    const ox = DX + 380, oy = DY - 60, pr = (v) => [ox + v[0] * 22 + v[2] * 30, oy - v[1] * 40 - v[2] * 50];
    P.forEach(([, v, col, w]) => arrow(ctx, [ox, oy], pr(v), { color: col, width: 5, head: 14, alpha: a * gin(cue('C11', w) + 0.3) }));
    const g12 = a * gin(s('C12'));
    if (g12 > 0) {
      const M = B.mat(DX - 150, DY + 130, [[2, -4, 3], [1, 1, -2], [0, 0, 1]], { px: 32, a: g12, cell: (i) => i === 2 ? { col: C.i } : null });
      ctag('det', DX - 150 - M.w / 2 - 50, DY + 130, { px: 28, a: g12, font: F.serif });
      ctag('= 1 · (2·1 − (−4)·1) = 6 ≠ 0 ⇒ 无关', DX + 210, DY + 130, { px: 30, a: g12 * gin(cue('C12', '一乘以')), color: OK, font: F.serif });
    }
    B.xcard('2017–18 第 3 题：x + 2, x + 1, x² − 1 → det = 1 → 无关', DX, DY + 280, 860, 70, a * gin(s('C13')), C.j, 26, C.j);
  }

  function shotSpan() {
    const a = B.win(s('C14'), s('C16') - 0.2); if (a <= 0) return;
    B.qhead('一族题：三个多项式张成 P₃', a);
    ctag('dim P₃ = 3：3 个向量  张成 ⇔ 无关 ⇔ det ≠ 0', DX, DY - 230, { px: 32, a: a * gin(cue('C14', 'P三是三维的')), color: C.peri, font: F.serif });
    const CD = [['{x, x+2, x²}', '−2', '行列式等于负二', '2020–21'], ['{−x, x+1, x²}', '1', '负x、x加一、x方，行列式等于一', '2021–22'], ['{1−x², x+2, x²}', '1', '一减x方、x加二、x方，行列式等于一', '2024–25']];
    CD.forEach(([set, d, w, yr], k) => { const x = DX - 340 + k * 340, g = a * gin(s('C15') + k * 0.6), fl = prog(B.t, cue('C15', w), cue('C15', w) + 0.5), sx = Math.abs(Math.cos(Math.PI * fl));
      ctx.save(); ctx.translate(x, DY - 20); ctx.scale(Math.max(0.03, sx), 1); ctx.translate(-x, -(DY - 20));
      B.card(x, DY - 20, 300, 220, g, fl > 0.5 ? OK : C.i);
      if (fl < 0.5) { ctag(yr, x, DY - 80, { px: 24, a: g, color: C.inkMid }); ctag(set, x, DY - 20, { px: 28, a: g, font: F.serif }); }
      else { ctag('det = ' + d, x, DY - 40, { px: 36, a: g, color: OK, font: F.serif }); ctag('张成 P₃ ✓', x, DY + 30, { px: 28, a: g, color: OK }); }
      ctx.restore(); });
    const gG = a * gin(s('G02'));
    B.card(DX, DY + 220, 900, 110, gG * 0.95, C.gpt);
    ctag('书写：先写 dim P₃ = 3，张成 ⇔ 线性无关', DX, DY + 195, { px: 26, a: gG, color: C.gpt });
    ctag('再算行列式 —— 这句理由是评分点', DX, DY + 245, { px: 26, a: gG * gin(cue('G02', '评分点')), color: C.gpt });
  }

  function shotOutro() {
    const a = B.win(s('C16'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 函数与多项式', ['① 函数：朗斯基，W ≠ 0 ⇒ 无关', '② 多项式：翻成系数向量，算行列式', '③ n 维空间里 n 个向量：无关 ⇔ 张成'],
      [s('C16') + 0.3, cue('C16', '多项式翻成系数向量'), cue('C16', 'n维空间里')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotSplit(); shotW5(); shotVdm(); shotFill(); shotPoly(); shotSpan(); shotOutro();
      B.paper(EX, 'y1819_q8', { t0: s('C02') + 0.1, dock: s('C02') + 0.8, out: s('C07') - 0.3 });
      B.paper(EX, 'y2324_f3', { t0: s('C08') - 0.2, dock: s('C08') + 0.4, out: s('G01') - 0.2 });
      B.paper(EX, 'y2324_q6', { t0: s('C10') + 0.1, dock: s('C11'), out: s('C13') - 0.2 });
      B.paper(EX, 'y1718_q3', { t0: s('C13') + 0.1, dock: s('C13') + 0.8, out: s('C14') - 0.2 });
    });
  }
  return { TL, draw };
}
