// 特别篇 3 · 第 1 段：公式填空连击（五道小题）。
// 分镜：开场旋转单位立方体 + 连击计数器 → ① |A adj A|：A·adjA = |A|I，对角四个 2 亮起 → 16，COMBO ×1
//       → ② 三阶 → 8，×2 → ③ det(−2A⁻¹)：立方体三条棱各乘 −2（翻面）体积 −8，再 × ½ → −4；错误答案 −1 被划 ×3
//       → ④ A − 2I：三行变三根箭头落在同一条直线上 → 0，×4 → ⑤ det(A+B)：A = B = I₂ 反例，红色 ≠ 砸下 → 加法不友好 ×5。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_proud', 'ds_think', 'gpt_point', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y2324_f1', 'y2223_f1', 'y2425_f3', 'y2324_f4', 'y2021_t3']);
  const B = base(R, {
    assets, label: '特别篇 3 · 行列式', title: '公式填空连击', hi: 1, en: 'FORMULA COMBO · 5 FILL-INS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C06: 0.4, C08: 0.6, C11: 0.6, C15: 0.6, C17: 0.4 },
    post: { C01: 1.4, C02: 1.0, C03: 1.4, C04: 1.4, C05: 1.2, C06: 0.8, D02: 0.6, C07: 1.0, C08: 1.0, C09: 1.6, C10: 1.6, G01: 1.4, C11: 1.2, C12: 1.4, C13: 1.6, C14: 1.4, C15: 1.0, C16: 1.6, G02: 1.4, C17: 1.8 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tC = [cue('C05', '连击一'), s('C07') + 0.1, cue('G01', '连击三'), s('C14') + 0.1, s('C17') + 0.1];
  const combo = () => { let n = 0; tC.forEach(t => { if (B.t >= t) n++; }); return n; };

  TL.sfx('hum', 0.4, 0.2); TL.sfx('whoosh', s('C02') + 0.2, 0.3);
  tC.forEach((t, k) => { TL.sfx('ding_hi', t, 0.32); TL.sfx('sparkle', t + 0.15, 0.25); });
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('click', cue('C03', '等于A的行列式乘单位矩阵'), 0.3);
  [0, 1, 2, 3].forEach(k => TL.sfx('marimba_hi', cue('C04', '对角线上四个二') + k * 0.25, 0.22)); TL.sfx('impact', cue('C04', '等于十六'), 0.3);
  TL.sfx('whoosh', s('C06') + 0.2, 0.3); TL.sfx('pop', s('D02') + 0.1, 0.25);
  TL.sfx('whoosh', s('C08') + 0.2, 0.3); [0, 1, 2].forEach(k => TL.sfx('warp', cue('C09', '三条棱各乘负二') + k * 0.4, 0.22)); TL.sfx('slam', cue('C09', '体积就乘负八'), 0.3);
  TL.sfx('impact', cue('C10', '等于负四'), 0.3); TL.sfx('buzz', cue('G01', '等于负一'), 0.22);
  TL.sfx('whoosh', s('C11') + 0.2, 0.3); TL.sfx('pop', s('D03') + 0.1, 0.25); TL.sfx('swoosh_soft', cue('C12', '对角线各减二'), 0.3);
  TL.sfx('laser', cue('C13', '三根箭头'), 0.3); TL.sfx('thud', cue('C13', '体积是零'), 0.3);
  TL.sfx('whoosh', s('C15') + 0.2, 0.3); TL.sfx('sting', s('D04') + 0.2, 0.2); TL.sfx('slam', cue('C16', '不相等'), 0.35);
  TL.sfx('swell', s('C17') - 0.3, 0.3);

  // 立方体（斜二测），三条棱缩放 sx, sy, sz
  function cube(ox, oy, u, sx, sy, sz, col, a, rot = 0) {
    if (a <= 0) return;
    const c = Math.cos(rot), sn = Math.sin(rot);
    const P = (x, y, z) => { x *= sx; y *= sy; z *= sz; const X = c * x - sn * z, Z = sn * x + c * z; return [ox + X * u + Z * u * 0.45, oy - y * u - Z * u * 0.35]; };
    const V = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map(p => P(p[0] - 0.5, p[1] - 0.5, p[2] - 0.5));
    ctx.save(); ctx.globalAlpha = a * 0.18; ctx.fillStyle = col; ctx.beginPath(); [4, 5, 6, 7].forEach((i, k) => k ? ctx.lineTo(...V[i]) : ctx.moveTo(...V[i])); ctx.closePath(); ctx.fill(); ctx.restore();
    [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => B.line2(V[i], V[j], col, a, 3));
  }

  function shotOpen() {
    const a = B.win(0, s('C02') + 1.5); if (a <= 0) return;
    cube(DX, DY + 20, 200, 1, 1, 1, C.ink, a, B.t * 0.5);
    ctag('5 道公式题 · 每道一连击', DX, DY + 300, { px: 30, a: a * gin(cue('C01', '五道题')), color: C.i });
  }

  function shotQ12() {
    const a = B.win(s('C02') + 0.5, s('C08') - 0.3); if (a <= 0) return;
    const three = B.t > s('C06');
    B.qhead(three ? '2022–23 · 填空 1(1)：3 阶，|A| = 2，|A adj A| = ?' : '2023–24 · 填空 1(1)：4 阶，|A| = 2，|A adj A| = ?', a);
    const g3 = a * gin(cue('C03', '有一个更基本的等式'));
    ctag('A · adj A = |A| I', DX, DY - 220, { px: 48, a: g3, color: C.peri, font: F.serif });
    const g4 = a * gin(s('C04'));
    if (g4 > 0) {
      const n = three ? 3 : 4, rows = [...Array(n)].map((_, i) => [...Array(n)].map((_, j) => i === j ? 2 : 0));
      const M = B.mat(DX - 120, DY + 20, rows, { px: 38, a: g4, cell: (i, j) => i === j ? { col: C.i, a: three ? 1 : gin(cue('C04', '对角线上四个二') + i * 0.25) } : { col: C.inkLo || C.inkMid } });
      ctag('|A| I =', DX - 120 - M.w / 2 - 80, DY + 20, { px: 32, a: g4, font: F.serif });
      const tv = three ? s('D02') + 0.2 : cue('C04', '等于十六');
      ctag(three ? '= 2³ = 8' : '= 2⁴ = 16', DX + 220, DY + 20, { px: 52, a: g4 * gin(tv), color: OK, font: F.serif });
      if (!three) B.burst(DX + 240, DY + 20, cue('C04', '等于十六'), OK, { r1: 200 });
      ctag('不用记 |adj A| 的公式', DX, DY + 240, { px: 28, a: a * gin(s('C03') + 1) * (three ? 0 : 1), color: C.inkMid });
    }
  }

  function shotQ3() {
    const a = B.win(s('C08') + 0.5, s('C11') - 0.3); if (a <= 0) return;
    B.qhead('2024–25 · 填空 1(3)：3 阶，det A = 2，det(−2A⁻¹) = ?', a);
    const t9 = cue('C09', '三条棱各乘负二');
    const sx = lerp(1, -2, smoother(prog(B.t, t9, t9 + 0.4))), sy = lerp(1, -2, smoother(prog(B.t, t9 + 0.4, t9 + 0.8))), sz = lerp(1, -2, smoother(prog(B.t, t9 + 0.8, t9 + 1.2)));
    const g9 = a * gin(s('C09')) * (1 - gin(s('C10') + 1.5) * 0.7);
    cube(DX - 300, DY + 40, 70, sx, sy, sz, C.i, g9, 0.5);
    ctag('(−2)³ = −8', DX - 300, DY + 300, { px: 40, a: g9 * gin(cue('C09', '体积就乘负八')), color: C.i, font: F.serif });
    ctag('数乘：每行都乘 −2 → 提出 (−2)ⁿ', DX + 200, DY - 200, { px: 28, a: a * gin(cue('C09', '数乘提出来')), color: C.ink });
    ctag('det A⁻¹ = 1 / det A = ½', DX + 200, DY - 120, { px: 34, a: a * gin(s('C10')), color: C.ink, font: F.serif });
    ctag('(−2)³ · ½ = −4', DX + 200, DY - 20, { px: 52, a: a * gin(cue('C10', '合起来')), color: OK, font: F.serif });
    B.burst(DX + 200, DY - 20, cue('C10', '等于负四'), OK, { r1: 220 });
    const gw = a * gin(cue('G01', '最常见的错'));
    if (gw > 0) { ctag('(−2) · ½ = −1', DX + 200, DY + 120, { px: 38, a: gw, color: C.free, font: F.serif }); B.cross(DX + 200, DY + 120, prog(B.t, cue('G01', '等于负一'), cue('G01', '等于负一') + 0.4), gw, 70);
      ctag('忘了 n 次方', DX + 200, DY + 190, { px: 28, a: gw * gin(cue('G01', '忘了n次方')), color: C.free }); }
  }

  function shotQ4() {
    const a = B.win(s('C11') + 0.5, s('C15') - 0.3); if (a <= 0) return;
    B.qhead('2023–24 · 填空 1(4)：det(A − 2I) = ?', a);
    const MA = B.mat(DX - 300, DY - 170, [[1, -2, 2], [-2, -2, 4], [2, 4, -2]], { px: 34, a: a * (1 - gin(s('C13')) * 0.6) });
    ctag('A =', DX - 430, DY - 170, { px: 30, a, font: F.serif });
    const g12 = a * gin(cue('C12', '对角线各减二'));
    const MM = B.mat(DX + 180, DY - 170, [[-1, -2, 2], [-2, -4, 4], [2, 4, -4]], { px: 34, a: g12, cell: (i, j) => i === j ? { col: C.j } : null });
    ctag('A − 2I =', DX - 20, DY - 170, { px: 30, a: g12, font: F.serif });
    const gr = a * gin(cue('C12', '看三行'));
    ctag('r₂ = 2r₁', DX + 420, DY - 205, { px: 26, a: gr * gin(cue('C12', '第二行是第一行的两倍')), color: C.i, font: F.serif });
    ctag('r₃ = −2r₁', DX + 420, DY - 135, { px: 26, a: gr * gin(cue('C12', '第三行是第一行的负二倍')), color: C.i, font: F.serif });
    const g13 = a * gin(cue('C13', '三根箭头'));
    if (g13 > 0) {
      const ox = DX, oy = DY + 150, u = 55, d = [-0.6, -1, 1].map(v => v / Math.hypot(0.6, 1, 1));
      B.line2([ox - 380, oy + 160], [ox + 380, oy - 160], C.inkMid, g13 * 0.5, 2, [8, 8]);
      [[1, C.peri], [2, C.i], [-2, C.k]].forEach(([k, col], q) => { const g = prog(B.t, cue('C13', '三根箭头') + q * 0.3, cue('C13', '三根箭头') + 0.6 + q * 0.3);
        arrow(ctx, [ox, oy], [ox + k * 2.6 * u * 1.15, oy - k * 2.6 * u * 0.49], { color: col, width: 6, head: 18, alpha: g13 * (g > 0 ? 1 : 0), grow: smoother(g) }); });
      ctag('体积 = 0', DX + 330, DY + 280, { px: 44, a: g13 * gin(cue('C13', '体积是零')), color: OK, font: F.serif });
    }
    K.pill('算之前先看一眼', DX - 300, DY + 300, C.i, a * gin(cue('C14', '算之前先看一眼')), 28);
  }

  function shotQ5() {
    const a = B.win(s('C15') + 0.5, s('C17') + 2.5); if (a <= 0) return;
    B.qhead('2020–21 · 判断 1(3)：det(A + B) = det A + det B ？', a);
    const g = a * gin(s('C16'));
    if (g > 0) {
      ctag('A = B = I₂', DX, DY - 220, { px: 40, a: g, color: C.ink, font: F.serif });
      ctag('左：det(2I₂) = 4', DX - 260, DY - 100, { px: 38, a: g * gin(cue('C16', '左边')), color: C.i, font: F.serif });
      ctag('右：1 + 1 = 2', DX + 260, DY - 100, { px: 38, a: g * gin(cue('C16', '右边')), color: C.k, font: F.serif });
      const tN = cue('C16', '不相等'), k = lerp(2.4, 1, outBack(prog(B.t, tN, tN + 0.4), 2.4));
      ctx.save(); ctx.translate(DX, DY - 100); ctx.scale(k, k); ctx.translate(-DX, -(DY - 100));
      ctag('≠', DX, DY - 100, { px: 70, a: g * gin(tN, 0.15), color: C.free, font: F.serif }); ctx.restore();
      if (B.t > tN) B.flash(tN, 0.25, 0.3, C.free);
      K.redStamp('×  错', DX + 330, DY + 40, prog(B.t, tN + 0.3, tN + 0.8), g * gin(tN + 0.3), C.free, 50);
    }
    const gG = a * gin(s('G02'));
    B.card(DX, DY + 170, 820, 130, gG * 0.95, C.gpt);
    ctag('det(AB) = det A · det B  ✓', DX, DY + 145, { px: 32, a: gG, color: OK, font: F.serif });
    ctag('det(A + B) ≠ det A + det B  ✗', DX, DY + 200, { px: 32, a: gG * gin(cue('G02', '对加法')), color: C.free, font: F.serif });
  }

  function draw(t) {
    B.frame(t, () => {
      shotOpen(); shotQ12(); shotQ3(); shotQ4(); shotQ5();
      const n = combo(); if (B.t > s('C01')) { B.combo(n, DX + 560, DY - 300, tC[Math.max(0, n - 1)], gin(s('C01') + 0.5), 'COMBO'); if (n === 0) ctag('COMBO ×0', DX + 470, DY - 320, { px: 30, a: gin(s('C01') + 0.5) * 0.7, color: C.inkMid }); }
      B.paper(EX, 'y2324_f1', { t0: s('C02') + 0.2, dock: s('D01'), out: s('C06') - 0.2 });
      B.paper(EX, 'y2223_f1', { t0: s('C06') + 0.2, dock: s('D02'), out: s('C08') - 0.2 });
      B.paper(EX, 'y2425_f3', { t0: s('C08') + 0.2, dock: s('C09'), out: s('C11') - 0.2 });
      B.paper(EX, 'y2324_f4', { t0: s('C11') + 0.2, dock: s('D03'), out: s('C15') - 0.2 });
      B.paper(EX, 'y2021_t3', { t0: s('C15') + 0.2, dock: s('D04'), out: s('C17') - 0.2 });
    });
  }
  return { TL, draw };
}
