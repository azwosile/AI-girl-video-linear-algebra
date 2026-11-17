// 特别篇 1 · 第 2 段：三张平面的三种结局（2018–19 第 1 题，18 分）。
// 分镜：原题三步 → 五问清单逐条点亮 → A·x = b 三块拼合 → 增广矩阵逐格写入、竖线亮起（评分点）
//       → 消元板三步（r₂−r₁、r₃−r₁、r₃−2r₂，数字翻牌）→ 末行放大描边 → (a−5)x₃ = b−4
//       → 三结局分叉树 → 唯一解公式 + 回代箭头 → 通解逐行 + 向量式（特解奶油 / 方向橙）→ 代回自检
//       → 3D：三平面 + a、b 滑块（交于一点 → 三棱柱 → 书页）→ 2r₂ − r₁ 合成第三行 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba, load3D } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_ask', 'ds_confused', 'ds_happy', 'ds_think', 'gpt_point', 'gpt_proud', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q1']);
  const B = base(R, {
    assets, label: '特别篇 1 · 方程组与参数讨论', title: '三张平面的三种结局', hi: 2, en: '2018–19 · Q1 · 18 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C04: 0.4, C06: 0.6, C12: 0.6, C15: 0.6, C17: 0.6, C20: 1.0, D04: 0.4, G04: 0.6 },
    post: { C03: 1.2, C05: 1.4, G01: 1.2, C07: 1.2, C08: 1.2, C09: 1.6, C10: 1.8, C12: 1.2, C13: 1.2, C14: 1.6, C15: 1.4, G02: 1.2, C18: 1.2, C19: 1.6, G03: 1.4, C21: 1.6, C22: 2.0, C23: 2.4, C24: 1.4, C25: 1.4, G04: 1.6, D05: 1.6 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const P3 = new (await load3D())(900, { R: 3, nPlanes: 3, nLines: 1, nPoints: 2 });

  const S = [
    [[1, 1, 3, 2], [1, 2, 4, 3], [1, 3, 'a', 'b']],
    [[1, 1, 3, 2], [0, 1, 1, 1], [1, 3, 'a', 'b']],
    [[1, 1, 3, 2], [0, 1, 1, 1], [0, 2, 'a−3', 'b−2']],
    [[1, 1, 3, 2], [0, 1, 1, 1], [0, 0, 'a−5', 'b−4']],
  ];
  const T = [0, s('C07'), s('C08'), s('C09')];
  const OPS = [null, [[1, 'r₂ − r₁']], [[2, 'r₃ − r₁']], [[2, 'r₃ − 2r₂']]];
  const tLast = s('C10');

  // ── 音效 ──
  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  ['写成矩阵形式', '写出增广矩阵', '无解', '有无穷多解', '有唯一解'].forEach(w => TL.sfx('tick', cue('C02', w), 0.25));
  TL.sfx('sting', s('D01') + 0.2, 0.2); TL.sfx('ding_hi', cue('C03', '先消元'), 0.3);
  TL.sfx('pop', cue('C04', '系数排成A'), 0.3); TL.sfx('pop', cue('C04', '未知数排成x'), 0.3); TL.sfx('pop', cue('C04', '右边排成b'), 0.3); TL.sfx('click', cue('C04', '就是A x'), 0.3);
  ['第一行', '第二行', '第三行'].forEach(w => TL.sfx('type', cue('C05', w), 0.25)); TL.sfx('zap', cue('G01', '竖线不能省'), 0.25);
  TL.sfx('click', cue('C06', '第二行减'), 0.3);
  [1, 2, 3].forEach(k => { TL.sfx('swoosh_soft', T[k], 0.25); TL.sfx('marimba', T[k] + 0.4, 0.22); });
  TL.sfx('impact', tLast + 0.2, 0.35); TL.sfx('pluck', s('D02') + 0.3, 0.3);
  TL.sfx('ding', s('C12') + 0.3, 0.3); TL.sfx('buzz', cue('C13', '矛盾'), 0.25); TL.sfx('ding_hi', cue('C14', '无穷多解'), 0.3);
  TL.sfx('pop', cue('C15', 'x三等于'), 0.3); TL.sfx('pop', cue('C15', '第二行给出'), 0.3); TL.sfx('pop', cue('C15', '第一行给出'), 0.3);
  TL.sfx('tick2', cue('C17', '令x三等于t'), 0.3); TL.sfx('tick2', cue('C18', '代进去'), 0.3); TL.sfx('impact', cue('C19', '写成向量'), 0.3);
  ['一加一等于二', '一加二等于三', '一加三等于四'].forEach(w => TL.sfx('check', cue('G03', w), 0.28));
  TL.sfx('hum', s('C20') - 0.6, 0.25); TL.sfx('ding', cue('C21', '交于一点'), 0.3);
  TL.sfx('warp', s('C22') + 0.2, 0.3); TL.sfx('buzz', cue('C22', '所以无解'), 0.22);
  TL.sfx('warp', s('C23') + 0.2, 0.3); TL.sfx('shimmer', cue('C23', '书页'), 0.35);
  TL.sfx('whoosh', cue('C24', '把第二个方程乘二'), 0.3); TL.sfx('impact', cue('C24', '等于一、三、五'), 0.3);
  TL.sfx('glitch', cue('C26', '互相矛盾'), 0.2);
  TL.sfx('swell', s('G04') - 0.2, 0.3); TL.sfx('sparkle', s('D05') + 0.2, 0.3);

  // ════ 1. 题面与五问 ════
  function shotAsk() {
    const a = B.win(s('C02'), s('C04') - 0.2); if (a <= 0) return;
    B.qhead('2018–2019 期中 · 第 1 题 · 18 分', a);
    ['① 矩阵形式', '② 增广矩阵', '③ 何时无解', '④ 何时无穷多解', '⑤ 何时唯一解'].forEach((tx, k) => {
      const w = ['写成矩阵形式', '写出增广矩阵', '无解', '有无穷多解', '有唯一解'][k];
      const g = a * gin(cue('C02', w)); K.pill(tx, DX - 360 + k * 180, DY - 120, k < 2 ? C.j : C.peri, g, 24);
    });
    ctag('x₁ + x₂ + 3x₃ = 2', DX, DY + 10, { px: 36, a: a * gin(s('C02')), font: F.serif });
    ctag('x₁ + 2x₂ + 4x₃ = 3', DX, DY + 60, { px: 36, a: a * gin(s('C02')), font: F.serif });
    ctag('x₁ + 3x₂ + a x₃ = b', DX, DY + 110, { px: 36, a: a * gin(s('C02')), font: F.serif, color: C.peri });
    const gr = a * gin(cue('C03', '先消元'));
    B.card(DX, DY + 230, 820, 76, gr * 0.95, C.j);
    ctag('套路：先消元，把参数赶到最后一行，盯着最后一行看', DX, DY + 230, { px: 28, a: gr, color: C.j });
  }

  // ════ 2. Ax = b + 增广矩阵 ════
  function shotAug() {
    const a = B.win(s('C04'), s('C06') - 0.1); if (a <= 0) return;
    const gA = a * gin(cue('C04', '系数排成A')), gx = a * gin(cue('C04', '未知数排成x')), gb = a * gin(cue('C04', '右边排成b'));
    const y = DY - 200;
    B.mat(DX - 220, y, [[1, 1, 3], [1, 2, 4], [1, 3, 'a']], { px: 32, a: gA, cell: (i, j) => i === 2 && j === 2 ? { col: C.peri } : null });
    K.cvec(DX - 20, y, ['x₁', 'x₂', 'x₃'], gx, { px: 32 });
    ctag('=', DX + 60, y, { px: 40, a: gb, font: F.serif });
    K.cvec(DX + 140, y, [2, 3, 'b'], gb, { px: 32, col: C.ink });
    ctag('A', DX - 220, y + 110, { px: 30, a: gA, color: C.inkMid, font: F.serif }); ctag('x', DX - 20, y + 110, { px: 30, a: gx, color: C.inkMid, font: F.serif }); ctag('b', DX + 140, y + 110, { px: 30, a: gb, color: C.inkMid, font: F.serif });
    // 增广：逐行写入
    const rows = [[1, 1, 3, 2], [1, 2, 4, 3], [1, 3, 'a', 'b']], tr = ['第一行', '第二行', '第三行'].map(w => cue('C05', w));
    const gM = a * gin(tr[0] - 0.2);
    const M = B.mat(DX, DY + 110, rows, { px: 38, a: gM, bar: 3, cell: (i, j) => ({ a: gin(tr[i] + j * 0.15), col: (i === 2 && j >= 2) ? C.peri : C.ink }) });
    ctag('[A | b] =', DX - M.w / 2 - 90, DY + 110, { px: 30, a: gM, color: C.inkMid, font: F.serif });
    // 竖线高亮 + 评分点
    const gG = a * gin(s('G01'));
    if (gG > 0) {
      const [bx] = M.cell(0, 3), pulse = 0.6 + 0.4 * Math.sin(B.t * 6);
      ctx.save(); ctx.globalAlpha = gG * pulse; ctx.strokeStyle = C.gpt; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(bx - 36, DY + 110 - M.h / 2); ctx.lineTo(bx - 36, DY + 110 + M.h / 2); ctx.stroke(); ctx.restore();
      B.card(DX, DY + 300, 820, 76, gG * 0.95, C.gpt);
      ctag('评分点：竖线不能省 · 参数原样抄 · 这两问 4 分', DX, DY + 300, { px: 28, a: gG, color: C.gpt });
    }
  }

  // ════ 3. 消元 → 末行 → 分叉树 → 解 ════
  function shotElim() {
    const a = B.win(s('C06'), s('C20') - 0.3); if (a <= 0) return;
    const up = smoother(prog(B.t, s('C12') - 0.4, s('C12') + 0.4));
    const my = lerp(DY - 120, DY - 290, up), px = lerp(40, 30, up);
    const { M } = K.steps(S, T, OPS, { x: DX + 40, y: my, px, bar: 3, a, hi: (i, j, k) => (i === 2 && j >= 2) ? C.peri : (k >= 1 && i === 0 && B.t < T[3] + 2) ? C.i : null });
    // 第一行发光指向
    const gr1 = a * B.win(s('C06'), T[3]);
    if (gr1 > 0) K.rowBox(M, 0, 0, 3, C.i, gr1 * 0.8, 22);
    // 第二列主元
    if (B.t > T[3] - 0.4 && B.t < tLast) K.ring(...M.cell(1, 1), 26, C.i, a, prog(B.t, T[3] - 0.4, T[3] + 0.2));
    // 末行
    const gl = a * gin(tLast);
    if (gl > 0) {
      K.rowBox(M, 2, 0, 3, C.peri, gl, 24);
      [0, 1, 2, 3].forEach(j => K.ring(...M.cell(2, j), 26, C.peri, gl * (1 - up), prog(B.t, tLast + 0.3 + j * 0.2, tLast + 0.8 + j * 0.2)));
      B.burst(...M.cell(2, 2), tLast + 0.3, C.peri, { r1: 200 });
    }
    // (a−5)x₃ = b−4
    const ge = a * gin(s('D02') + 0.4);
    ctag('(a − 5) x₃ = b − 4', DX + 40, lerp(DY + 80, my + M.h / 2 + 50, up), { px: lerp(48, 34, up), a: ge, color: C.peri, font: F.serif });
    // 分叉树
    const gt = a * B.win(s('C12') - 0.2, s('C17') - 0.2);
    B.tree(DX + 40, DY - 30, '末行 (0 0 a−5 | b−4)', [
      { text: 'a ≠ 5', sub: '唯一解', col: OK, at: s('C12') + 0.2 },
      { text: 'a = 5 且 b ≠ 4', sub: '0 = 非零 → 无解', col: C.free, at: s('C13') + 0.2 },
      { text: 'a = 5 且 b = 4', sub: '0 = 0 → 无穷多解', col: C.i, at: s('C14') + 0.2 },
    ], gt, { dx: 300, dy: 170, at0: s('C12') - 0.2 });
    B.cross(DX + 40, DY + 140, prog(B.t, cue('C13', '矛盾'), cue('C13', '矛盾') + 0.4), gt * (1 - gin(s('C14'))), 34);
    // 唯一解公式（C15–C16）
    const gu = a * B.win(s('C15'), s('C17') - 0.2);
    if (gu > 0) {
      const y0 = DY + 290;
      B.card(DX + 40, y0, 900, 90, gu * 0.95, OK);
      K.type('x₃ = (b − 4)/(a − 5)', DX - 390, y0, cue('C15', 'x三等于'), 1.0, gu, { px: 30, col: C.peri });
      K.type('x₂ = 1 − x₃', DX - 60, y0, cue('C15', '第二行给出'), 0.7, gu, { px: 30 });
      K.type('x₁ = 1 − 2x₃', DX + 200, y0, cue('C15', '第一行给出'), 0.7, gu, { px: 30 });
      const gs = gu * gin(cue('C16', '唯一解时'));
      ctag('唯一：x₃ 被第三行钉死   ·   无穷多：x₃ = t 自由', DX + 40, y0 - 70, { px: 26, a: gs, color: C.i });
    }
    // 书写顺序（G02）
    const gG = a * B.win(s('G02'), s('C17') - 0.2);
    if (gG > 0) { B.card(DX + 40, DY + 290, 900, 90, gG, C.gpt); ctag('写全条件：a = 5 并且 b ≠ 4 —— “并且”不能丢', DX + 40, DY + 290, { px: 28, a: gG, color: C.gpt }); }
    // 通解（C17–G03）
    const gs = a * B.win(s('C17'), s('C20') - 0.3);
    if (gs > 0) {
      const y0 = DY - 40;
      K.type('令 x₃ = t', DX - 300, y0, cue('C17', '令x三等于t'), 0.6, gs, { px: 32, col: C.free });
      K.type('x₂ = 1 − x₃ = 1 − t', DX - 300, y0 + 60, cue('C17', '所以x二'), 1.0, gs, { px: 32 });
      K.type('x₁ = 2 − (1 − t) − 3t = 1 − 2t', DX - 300, y0 + 120, cue('C18', '代进去'), 1.6, gs, { px: 32 });
      const tv = cue('C19', '写成向量'), gv = gs * gin(tv);
      const vy = DY + 230;
      ctag('x =', DX - 260, vy, { px: 36, a: gv, font: F.serif });
      K.cvec(DX - 160, vy, [1, 1, 0], gv, { px: 32, col: C.ink });
      ctag('+ t', DX - 60, vy, { px: 36, a: gv, font: F.serif, color: C.peri });
      K.cvec(DX + 40, vy, ['−2', '−1', 1], gv, { px: 32, col: C.peri });
      ctag('特解', DX - 160, vy + 100, { px: 24, a: gs * gin(cue('C19', '特解')), color: C.inkMid });
      ctag('齐次解（t 任意）', DX + 40, vy + 100, { px: 24, a: gs * gin(cue('C19', '齐次方程的解')), color: C.peri });
      B.burst(DX - 60, vy, tv + 0.3, C.peri, { r1: 240 });
      // 自检
      const gc = gs * gin(s('G03'));
      ['1 + 1 = 2 ✓', '1 + 2 = 3 ✓', '1 + 3 = 4 = b ✓'].forEach((tx, k) => ctag(tx, DX + 330, vy - 60 + k * 50, { px: 26, a: gc * gin(cue('G03', ['一加一等于二', '一加二等于三', '一加三等于四'][k])), color: OK, font: F.serif }));
    }
  }

  // ════ 4. 3D 三平面 ════
  const aOf = t => { const t1 = s('C22'), t2 = cue('C21', '交于一点'); return lerp(lerp(7, 6.2, smoother(prog(t, t2, t2 + 2.5))), 5, smoother(prog(t, t1, t1 + 2.0))); };
  const bOf = t => lerp(6, 4, smoother(prog(t, s('C23'), s('C23') + 2.2)));
  function shotPlanes(D) {
    const a = B.win(s('C20') - 0.4, s('D04') + 0.2); if (a <= 0) return;
    const av = aOf(B.t), bv = bOf(B.t), cols = [C.peri, C.ink, C.j];
    P3.reset();
    const N = [[1, 1, 3], [1, 2, 4], [1, 3, av]], Dd = [2, 3, bv];
    N.forEach((n, i) => P3.setPlane(i, n, { color: cols[i], alpha: 0.32, d: Dd[i], scale: 0.9 * outCubic(prog(B.t, s('C20') + i * 0.4, s('C20') + 0.8 + i * 0.4)) }));
    const det = av - 5, unique = Math.abs(det) > 0.02;
    if (unique) {
      const x3 = (bv - 4) / det, p = [1 - 2 * x3, 1 - x3, x3];
      if (Math.max(...p.map(Math.abs)) < 3) P3.setPoint(0, p, { r: 0.14, color: C.i, alpha: gin(cue('C21', '交于一点')) });
    } else if (Math.abs(bv - 4) < 0.02) {
      P3.setLine(0, [-2, -1, 1], { p0: [1, 1, 0], color: C.i, width: 8, grow: gin(cue('C23', '书页'), 0.8) });
      P3.setPoint(1, [1, 1, 0], { r: 0.12, color: C.ink, alpha: gin(cue('C23', '每个点都是解')) });
    }
    const V = B.show3D(P3, D, a, { el: 20, az: -55 + (B.t - s('C20')) * 3, dist: 15, axesA: 0.4, floorA: 0.12 });
    // 读数面板
    const gp = a * gin(s('C20') + 0.6);
    B.card(DX, DY - 360, 560, 76, gp * 0.95, C.inkMid);
    const fx = v => (Math.abs(v - Math.round(v)) < 0.02 ? String(Math.round(v)) : v.toFixed(1)).replace('-', '−');
    ctag(`a = ${fx(av)}   b = ${fx(bv)}   末行 (0 0 ${fx(av - 5)} | ${fx(bv - 4)})`, DX, DY - 360, { px: 28, a: gp, color: unique ? C.ink : Math.abs(bv - 4) < 0.02 ? OK : C.free, font: F.serif });
    const lab = unique ? '交于一点 · 唯一解' : Math.abs(bv - 4) < 0.02 ? '绕同一直线 · 无穷多解' : '三棱柱 · 无解';
    K.pill(lab, DX, DY + 380, unique ? OK : Math.abs(bv - 4) < 0.02 ? C.i : C.free, gp * gin(cue('C21', '交于一点')), 28);
    if (!unique && Math.abs(bv - 4) < 0.02) V.lab([1, 1, 0], '(1, 1, 0)', { px: 26, a: a * gin(cue('C23', '每个点都是解')), color: C.ink });
  }

  // ════ 5. 为什么是 5 和 4 ════
  function shotWhy() {
    const a = B.win(s('D04'), s('G04') - 0.2); if (a <= 0) return;
    const y = DY - 160, tc = cue('C24', '把第二个方程乘二'), tr = cue('C24', '等于一、三、五');
    const rows = [['r₁', [1, 1, 3, 2], C.ink], ['2r₂', [2, 4, 8, 6], C.j], ['2r₂ − r₁', [1, 3, 5, 4], C.i], ['r₃', [1, 3, 'a', 'b'], C.peri]];
    rows.forEach(([lab, v, col], k) => {
      const t0 = k === 0 ? s('C24') : k === 1 ? tc + 0.6 : k === 2 ? tr : s('C25');
      const g = a * gin(t0); if (g <= 0) return;
      const yy = y + k * 80 + (k === 3 ? 20 : 0);
      ctag(lab, DX - 300, yy, { px: 28, a: g, color: col, font: F.serif, align: 'right' });
      v.forEach((q, j) => ctag(String(q).replace('-', '−'), DX - 180 + j * 110 + (j === 3 ? 30 : 0), yy, { px: 38, a: g, color: col, font: F.serif }));
      ctx.save(); ctx.globalAlpha = g * 0.6; ctx.fillStyle = col; ctx.fillRect(DX - 180 + 2.5 * 110 + 12, yy - 22, 3, 44); ctx.restore();
    });
    const gl = a * gin(s('C25'));
    if (gl > 0) {
      ctx.save(); ctx.globalAlpha = gl; ctx.strokeStyle = C.i; ctx.setLineDash([10, 8]); ctx.lineWidth = 3; ctx.strokeRect(DX - 330, y + 160 - 40, 760, 180); ctx.restore();
      ['a', 'b'].forEach((q, k) => { const x = DX - 180 + (2 + k) * 110 + (k ? 30 : 0); B.burst(x, y + 260, s('C25') + 0.2 + k * 0.2, C.i, { r1: 90 }); });
      ctag('a = 5, b = 4：第三个方程 = 前两个的组合 → 多余 → 多一个自由度', DX, y + 380, { px: 26, a: gl, color: C.i });
    }
    const gc = a * gin(s('C26'));
    ctag('a = 5, b ≠ 4：左边像组合，右边不配合 → 矛盾', DX, y + 430, { px: 26, a: gc, color: C.free });
    K.glitch(cue('C26', '互相矛盾'), cue('C26', '互相矛盾') + 0.5, 0.5);
  }

  function shotOutro() {
    const a = B.win(s('G04'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 含参方程组', ['① 消元，把参数赶到最后一行', '② 末行写成 (0 0 p | q)', '③ p ≠ 0：唯一解', '④ p = 0, q ≠ 0：无解', '⑤ p = q = 0：无穷多解，写通解'],
      [s('G04') + 0.3, cue('G04', '末行写成'), cue('G04', 'p不等于零'), cue('G04', 'p等于零而'), cue('G04', 'p和q都等于零')], a, { y: DY - 40 });
    const g = a * gin(s('D05'));
    K.redStamp('一次消元定生死', DX + 250, DY + 260, prog(B.t, s('D05'), s('D05') + 0.5), g, C.peri, 40);
  }

  function draw(t) {
    B.frame(t, (D) => {
      shotAsk(); shotAug(); shotElim(); shotPlanes(D); shotWhy(); shotOutro();
      B.paper(EX, 'y1819_q1', { t0: s('C01') + 0.2, dock: s('C02') + 0.3, out: s('C20') - 0.6 });
    });
  }
  return { TL, draw };
}
