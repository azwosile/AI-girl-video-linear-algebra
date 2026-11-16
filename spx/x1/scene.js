// 特别篇 · 期中速成 x1：含参方程组。
// 分镜：开场三平面 → 18–19 Q1 原题 → 方程组 / Ax=b / 增广 → 带参消元 → 末行三结局分叉树 → 通解 + 验算
//       → 3D 三平面随 a、b 滑块变化（交点 / 无公共点 / 整条交线）→ 套路卡①
//       → 25–26 Q2 原题 → det 展开 → α 滑块拖平行六面体到体积 0 → α=8 代回消元 → β=1 → 评分点
//       → 24–25 Q2 姊妹题 → 套路卡② → 预告。
import { base, loadExam, SBoard, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, arrow, load3D, rgba } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_confused', 'ds_shock', 'ds_ask', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_explain'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q1', 'y2526_q2', 'y2425_q2']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '含参方程组', hi: 2, en: 'PARAMETRIC SYSTEMS',
    titleEnd: () => B.L('C03').s,
    pre: { C03: 0.6, C06: 0.4, C09: 0.4, C12: 0.4, C13: 0.8, C16: 0.6, C17: 1.0, C20: 0.4, C22: 0.6, C24: 0.4, C26: 1.0, C28: 0.6 },
    post: { C07a: 0.6, C12a: 0.6, C16a: 1.0, C24b: 0.6, C25b: 0.8, C26a: 0.6, C26b: 1.2, C04: 0.8, C07: 1.0, C08: 0.6, C11: 0.6, C12: 0.8, C14: 1.2, C15: 1.2, C16: 1.4, C20: 0.8, C22: 2.0, C24: 1.2, C25: 0.8, C27: 1.0, C28: 1.2 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', cue('C02', '先消元'), 0.3);
  TL.sfx('whoosh', s('C03') + 0.2, 0.35); TL.sfx('stamp', s('C03') + 2.5, 0.35);
  TL.sfx('pop', cue('C05', '增广矩阵'), 0.3);
  [cue('C06', '第二行'), cue('C06', '第三行'), s('C07') + 0.3].forEach(x => TL.sfx('pluck', x, 0.3));
  TL.sfx('sting', s('D02'), 0.3); TL.sfx('pop', s('C08') + 0.4, 0.3);
  TL.sfx('ding_hi', s('C09') + 0.3, 0.3); TL.sfx('buzz', s('C10') + 0.3, 0.22); TL.sfx('ding_hi', s('C11') + 0.3, 0.3);
  TL.sfx('pop', s('C12') + 0.3, 0.3); TL.sfx('check', e('G02') - 0.4, 0.3);
  TL.sfx('warp', s('C13') + 0.3, 0.35); TL.sfx('warp', cue('C14', 'a等于五时'), 0.3); TL.sfx('shimmer', s('C15') + 2.2, 0.35);
  TL.sfx('bell_soft', s('C16'), 0.35);
  TL.sfx('whoosh', s('C17') + 0.3, 0.35); TL.sfx('stamp', s('C17') + 2.6, 0.35);
  TL.sfx('pop', s('D05') + 0.3, 0.3); TL.sfx('pop', s('C20') + 0.3, 0.3); TL.sfx('ding_hi', s('C21') + 0.3, 0.3);
  TL.sfx('warp', s('C22') + 0.4, 0.3); TL.sfx('sting', s('C22') + 6.4, 0.35);
  [cue('C24', '第二行减去'), cue('C24', '第三行减去'), cue('C24', '再把第二行')].forEach(x => TL.sfx('pluck', x, 0.3));
  TL.sfx('sting', s('D06'), 0.3); TL.sfx('ding_hi', cue('C25', '答案'), 0.35);
  TL.sfx('whoosh', s('C26') + 0.2, 0.35); TL.sfx('ding_hi', cue('C27', '所以'), 0.35);
  TL.sfx('bell_soft', s('C28'), 0.35); TL.sfx('shimmer', s('D08'), 0.35);
  ['C06a', 'C06b', 'C07a', 'C24a', 'C24b'].forEach(id => TL.sfx('tick', s(id) + 0.3, 0.25));
  TL.sfx('buzz', s('G01a') + 0.4, 0.2); TL.sfx('pop', s('C11a') + 0.3, 0.3); TL.sfx('pop', s('C12b') + 0.3, 0.3);
  TL.sfx('bell_soft', s('C16a') + 0.2, 0.3); TL.sfx('pop', s('C20a') + 0.3, 0.3); TL.sfx('pop', s('C25a') + 0.3, 0.3); TL.sfx('check', e('C25b') - 0.6, 0.3);
  TL.sfx('pop', s('C26a') + 0.3, 0.3); [cue('C26b', '第二行加上'), cue('C26b', '第三行减去'), cue('C26b', '再把两行')].forEach(x => TL.sfx('pluck', x, 0.3));

  // ── 小件：参数滑块 ──
  const slider = (name, v, v0, v1, x, y, w, a, col = C.peri, crit = null) => {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = rgba(C.ink, 0.35); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.stroke();
    const px = v => x - w / 2 + (v - v0) / (v1 - v0) * w;
    if (crit != null) { ctx.fillStyle = C.free; ctx.fillRect(px(crit) - 2, y - 16, 4, 32); ctag(String(crit).replace('-', '−'), px(crit), y + 30, { px: 22, a, color: C.free }); }
    ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(px(v), y); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px(v), y, 13, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctag(`${name} = ${(Math.round(v * 10) / 10).toFixed(1).replace('-', '−')}`, x - w / 2 - 20, y, { px: 30, a, color: col, font: F.serif, align: 'right' });
  };

  // ── 3D ──
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3, nPlanes: 3, nLines: 2, nPoints: 4 });

  // ════ 开场 ════
  function shotIntro(D) {
    const a = B.win(0.6, s('C03') + 0.1); if (a <= 0) return;
    const sp = B.t * 0.25;
    P3.reset();
    P3.setPlane(0, [1, 1, 3], { color: C.i, alpha: 0.3, d: 2, scale: outCubic(prog(B.t, 0.8, 1.8)) });
    P3.setPlane(1, [1, 2, 4], { color: C.j, alpha: 0.3, d: 3, scale: outCubic(prog(B.t, 1.2, 2.2)) });
    P3.setPlane(2, [1, 3, 7 + Math.sin(sp * 2) * 1.5], { color: C.k, alpha: 0.3, d: 6, scale: outCubic(prog(B.t, 1.6, 2.6)) });
    B.show3D(P3, D, a * (1 - 0.6 * gin(s('C02'))), { el: 22, az: -50 + B.t * 6, dist: 15, axesA: 0.5, floorA: 0.3 });
    const g = a * gin(s('C02'));
    B.xcard('先消元  →  盯住最后一行', DX, DY - 60, 620, 100, g, C.peri, 40);
    texAt('r1', DX, DY + 80, 44, { alpha: a * gin(cue('C02', '最后一行')) });
  }

  // ════ 2018–19 Q1 ════
  const MB1 = new SBoard([[1, 1, 3, 2], [1, 2, 4, 3], [1, 3, 'a', 'b']]);
  const o1 = [cue('C06', '第二行'), cue('C06', '第三行'), s('C07') + 0.3];
  MB1.add(o1[0], o1[0] + 1.6, 1, 0, -1);
  MB1.add(o1[1], o1[1] + 1.6, 2, 0, -1, [0, 2, 'a−3', 'b−2']);
  MB1.add(o1[2], o1[2] + 1.8, 2, 1, -2, [0, 0, 'a−5', 'b−4']);

  function shotQ1() {
    const a = B.win(s('C03'), s('C13') - 0.2); if (a <= 0) return;
    const after = gin(s('C04') - 0.1);           // 纸卡停靠后才画圆盘内容
    if (after <= 0) return;
    const A = a * after;
    B.qhead('2018–2019 期中 · 第 1 题', A);
    // 方程组、矩阵方程
    const top = A * (1 - gin(s('C06') - 0.2));
    texAt('sys1', DX, DY - 240, 44, { alpha: top, reveal: prog(B.t, s('C04'), e('C04') - 1) });
    texAt('axb1', DX, DY - 30, 44, { alpha: top * gin(s('C05')), reveal: rv(s('C05'), 1.6) });
    // 增广矩阵
    const mv = smoother(prog(B.t, s('C06') - 0.3, s('C06') + 0.4)), up = smoother(prog(B.t, s('C09') - 0.3, s('C09') + 0.4));
    const by = lerp(lerp(DY + 200, DY - 110, mv), DY - 250, up), bpx = lerp(lerp(40, 58, mv), 44, up);
    const fadeQ1 = 1 - gin(s('C12') - 0.2);
    MB1.draw(ctx, B.t, { x: DX, y: by, px: bpx, mode: 1, alpha: A * gin(cue('C05', '增广矩阵')) * fadeQ1,
      hiRows: { 1: B.win(s('C06a'), e('C06a')), 2: Math.max(B.win(s('C06b'), e('C07a')), gin(s('D02')) * (1 - gin(s('C12')))) }, labelHold: 1.2 });
    // C05a：系数 | 常数
    { const g = A * B.win(s('C05a'), e('C05a')); if (g > 0) { ctag('系数', DX - 50, DY + 95, { px: 30, a: g, color: C.i }); ctag('常数', DX + 150, DY + 95, { px: 30, a: g, color: C.peri });
      ['方程 1', '方程 2', '方程 3'].forEach((t, i) => ctag(t, DX - 300, DY + 200 + (i - 1) * 62, { px: 24, a: g, color: rgba(C.ink, 0.7) })); } }
    // C06a/C06b/C07a：逐个数
    [['C06a', '(1, 2, 4 | 3) − (1, 1, 3 | 2) = (0, 1, 1 | 1)'], ['C06b', '(1, 3, a | b) − (1, 1, 3 | 2) = (0, 2, a − 3 | b − 2)'], ['C07a', '(0, 2, a − 3 | b − 2) − 2·(0, 1, 1 | 1) = (0, 0, a − 5 | b − 4)']]
      .forEach(([id, t]) => ctag(t, DX, DY + 110, { px: 32, a: A * B.win(s(id), e(id) + 0.1), color: C.i, font: F.serif }));
    { const g = A * B.win(s('G01a'), e('G01a') + 0.2); B.xcard('÷ (a − 5) 之前：先问 a − 5 = 0 吗？', DX, DY + 270, 640, 76, g, C.free, 32); }
    // 抄参数提醒
    if (top > 0) { const g = top * B.win(s('G01'), e('G01')); ctag('a、b 原样抄进去', DX + 300, DY + 330, { px: 28, a: g, color: C.gpt }); }
    // 末行方程 + 三结局
    const g8 = A * gin(s('C08') + 0.4) * fadeQ1;
    texAt('last1', DX, lerp(DY + 120, DY - 60, up), 50, { alpha: g8 });
    B.ghalo('last1', DX, lerp(DY + 120, DY - 60, up), 50, 'a', g8 * B.win(cue('C08', '乘以'), s('C09')));
    B.burst(DX, DY + 120, s('C08') + 0.4, C.peri);
    const tr = A * fadeQ1;
    B.tree(DX, DY - 30, '', [
      { text: 'a ≠ 5', sub: '唯一解 · (e)', col: OK, at: s('C09') + 0.3 },
      { text: 'a = 5，b ≠ 4', sub: '无解 · (c)', col: C.free, at: s('C10') + 0.3 },
      { text: 'a = 5，b = 4', sub: '无穷多解 · (d)', col: C.i, at: s('C11') + 0.3 },
    ], tr * gin(s('C09')) * (1 - B.win(s('C11a'), e('G01b'))), { dx: 330, dy: 200, at0: 1e9 });
    // C11a / G01b：秩表
    { const g = tr * B.win(s('C11a'), e('G01b')); if (g > 0) { B.card(DX, DY + 90, 820, 250, g * 0.95, C.i);
      [['a ≠ 5：r(A) = r(A|b) = 3', '唯一解', OK], ['a = 5，b ≠ 4：r(A) = 2 < r(A|b) = 3', '无解', C.free], ['a = 5，b = 4：r(A) = r(A|b) = 2 < 3', '无穷多解', C.i]]
        .forEach(([t, r, col], i) => { const gi = g * gin(cue('C11a', ['a不等于五', 'a等于五、b不等于四', 'a等于五、b等于四'][i])); ctag(t, DX - 380, DY + 15 + i * 72, { px: 30, a: gi, color: C.ink, font: F.serif, align: 'left' }); ctag('→ ' + r, DX + 270, DY + 15 + i * 72, { px: 30, a: gi, color: col, align: 'left' }); });
      ctag('同济：比秩  ⇔  Leon：看“0 = 非零数”', DX, DY + 280, { px: 28, a: g * gin(s('G01b') + 0.2), color: C.gpt }); } }
    // 通解
    const g12 = A * gin(s('C12') + 0.2);
    B.ctag('a = 5，b = 4 时', DX, DY - 300, { px: 30, a: g12, color: C.i });
    texAt('back1', DX, DY - 205, 42, { alpha: g12, reveal: rv(s('C12') + 0.3, 3) });
    texAt('sub1', DX, DY - 125, 34, { alpha: A * gin(s('C12a') + 0.2), reveal: rv(cue('C12a', '第一行'), 3) });
    { const g = A * B.win(s('C12b'), e('C12b') + 0.2); ctag('特解', DX - 30, DY + 150, { px: 28, a: g, color: C.i }); ctag('Ax = 0 的解', DX + 180, DY + 150, { px: 28, a: g * gin(cue('C12b', 't倍')), color: C.j }); }
    B.answer('gen1', DX, DY + 30, 44, A * gin(cue('C12', '通解')), { col: C.i });
    texAt('chk1', DX, DY + 230, 36, { alpha: A * gin(s('G02') + 0.3), reveal: rv(s('G02') + 0.3, 3) });
    B.stamp(DX + 320, DY + 340, true, gin(e('G02') - 0.4, 0.4), A * gin(e('G02') - 0.4));
  }

  // ── 3D 三平面 ──
  function shot3D(D) {
    const a = B.win(s('C13'), s('C16') - 0.1); if (a <= 0) return;
    const tA = cue('C14', 'a等于五时'), tB = s('C15') + 0.2;
    const av = lerp(7, 5, smoother(prog(B.t, tA, tA + 2.2))), bv = lerp(6, 4, smoother(prog(B.t, tB, tB + 2.2)));
    P3.reset();
    const gr = i => outCubic(prog(B.t, s('C13') + 0.3 + i * 0.6, s('C13') + 1.3 + i * 0.6));
    P3.setPlane(0, [1, 1, 3], { color: C.i, alpha: 0.28, d: 2, scale: 0.8 * gr(0) });
    P3.setPlane(1, [1, 2, 4], { color: C.j, alpha: 0.28, d: 3, scale: 0.8 * gr(1) });
    P3.setPlane(2, [1, 3, av], { color: C.peri, alpha: 0.34, d: bv, scale: 0.8 * gr(2) });
    // 前两张平面的交线：(1,1,0) + t(−2,−1,1)
    const onLine = smooth(prog(bv, 4.4, 4.02));
    P3.setLine(0, [-2, -1, 1], { p0: [1, 1, 0], color: onLine > 0.5 ? C.ink : C.mist, width: 4 + 6 * onLine, alpha: 0.5 + 0.5 * gin(s('C14')), half: 3.2 });
    // 交点（a ≠ 5）
    const x3 = (bv - 4) / (av - 5), pt = [2 - (1 - x3) - 3 * x3, 1 - x3, x3];
    const pa = Math.abs(x3) < 2.5 ? 1 : 0;
    if (pa) P3.setPoint(0, pt, { r: 0.13, color: C.ink });
    const V = B.show3D(P3, D, a, { el: 34, az: -28 + 8 * Math.sin(B.t * 0.2), dist: 15, target: [0.3, 0.6, 0.4], axesA: 0.5, floorA: 0.3 });
    if (pa) { const [x, y] = V.pr(pt); B.dot(x, y, 12, C.ink, a * gin(s('C14'))); }
    slider('a', av, 3, 8, DX + 40, DY + 255, 380, a * gin(s('C13') + 1.5), C.peri, 5);
    slider('b', bv, 2, 7, DX + 40, DY + 320, 380, a * gin(s('C13') + 1.5), C.i, 4);
    const lab = (txt, col, t0, t1) => ctag(txt, DX, DY - 350, { px: 34, a: a * B.win(t0, t1), color: col, font: F.serif });
    lab('a ≠ 5：交于一点', OK, s('C14'), tA + 0.3);
    lab('a = 5，b ≠ 4：没有公共点', C.free, tA + 1.8, tB + 1.6);
    lab('a = 5，b = 4：整条直线都是解', C.i, tB + 2.0, e('D04') + 1);
    B.flash(tB + 2.2, 0.25);
    const d4 = a * gin(s('D04'));
    ['一个点', '没有点', '一整条线'].forEach((t, i) => B.xcard(t, DX - 300 + i * 300, DY - 250, 220, 64, d4 * gin(s('D04') + i * 0.5), [OK, C.free, C.i][i], 30));
  }

  // ── 套路卡（圆盘内大卡）──
  const recipeCard = (n, lines, y, a, col, t0 = 0) => {
    if (a <= 0) return; const h = 100 + lines.length * 58;
    B.card(DX, y, 900, h, a, col); ctag(`套路卡 ${n}`, DX - 330, y - h / 2 + 40, { px: 32, a, color: col, font: F.serif });
    lines.forEach((l, i) => ctag(l, DX - 380, y - h / 2 + 100 + i * 56, { px: 36, a: a * gin(t0 + 0.4 + i * 0.6), color: C.ink, align: 'left' }));
  };
  const R1 = ['消元到阶梯形，只盯最后一行 (0 … 0 c | d)', 'c ≠ 0 → 唯一解', 'c = 0，d ≠ 0 → 无解', 'c = 0，d = 0 → 无穷多解'];
  const R2 = ['方阵含参：先求 det，找临界值', 'det ≠ 0 → 唯一解（不用再讨论）', '临界值代回增广矩阵消元', '再用套路卡①看最后一行'];
  function shotRecipe1() {
    const a = B.win(s('C16'), s('C17') - 0.2); if (a <= 0) return;
    recipeCard('①', R1, DY, a * (1 - gin(s('C16a'))), C.peri, s('C16'));
    B.burst(DX + 330, DY - 120, s('C16') + 0.3, C.peri);
    const g = a * gin(s('C16a')); if (g > 0) { B.card(DX, DY - 10, 800, 330, g * 0.95, C.peri); ctag('考场写法', DX, DY - 140, { px: 34, a: g, color: C.peri });
      [['当 a = 5 且 b ≠ 4 时，无解；', C.free], ['当 a = 5 且 b = 4 时，有无穷多解；', C.i], ['当 a ≠ 5 时，有唯一解。', OK]].forEach(([t, col], i) => ctag(t, DX - 330, DY - 60 + i * 70, { px: 34, a: g * gin(s('C16a') + 0.8 + i * 1.6), color: col, font: F.serif, align: 'left' })); }
  }

  // ════ 2025–26 Q2 ════
  const MB2 = new SBoard([[1, 2, 1, 1], [1, 8, 3, 2], [2, -2, 0, 'β']]);
  const o2 = [cue('C24', '第二行减去'), cue('C24', '第三行减去'), cue('C24', '再把第二行')];
  MB2.add(o2[0], o2[0] + 1.5, 1, 0, -1);
  MB2.add(o2[1], o2[1] + 1.5, 2, 0, -2, [0, -6, -2, 'β−2']);
  MB2.add(o2[2], o2[2] + 1.6, 2, 1, 1, [0, 0, 0, 'β−1']);
  const cr = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];

  function shotQ2(D) {
    const a = B.win(s('C17'), s('C26') - 0.2); if (a <= 0) return;
    const after = gin(s('C18') - 0.1); if (after <= 0) return;
    const A = a * after;
    B.qhead('2025–2026 期中 · 第 2 题', A * (1 - B.win(s('C22'), e('C22'))));
    // 第一问
    const p1 = A * (1 - gin(s('C22') - 0.3)) + A * gin(s('C23') - 0.2) * 0;
    texAt('A2', DX, DY - 260, 40, { alpha: p1, reveal: rv(s('C18'), 3) });
    ctag('(1) α = ? 时 a₁, a₂, a₃ 张成 ℝ³', DX, DY - 120, { px: 32, a: p1 * gin(s('C19')), color: C.ink });
    texAt('q2a', DX, DY - 40, 40, { alpha: p1 * gin(s('D05') + 0.3) });
    texAt('det2a', DX, DY + 70, 38, { alpha: p1 * gin(s('C20')), reveal: rv(s('C20'), 3) });
    texAt('det2b', DX + 60, DY + 160, 40, { alpha: p1 * gin(cue('C20', '合起来')) });
    B.ghalo('det2b', DX + 60, DY + 160, 40, 'f', p1 * gin(cue('C20', '也就是')));
    { const g = p1 * B.win(s('C20a'), e('C20a') + 0.2); [['α·0 − 3·(−2) = 6', '第一个'], ['−2 · (1·0 − 3·2) = +12', '第二个'], ['1·(−2) − α·2 = −2 − 2α', '第三个']].forEach(([t, c], i) => ctag(t, DX, DY + 225 + i * 42, { px: 28, a: g * gin(cue('C20a', c)), color: [C.i, C.j, C.k][i], font: F.serif })); }
    B.answer('ans2a', DX, DY + 290, 46, p1 * gin(s('C21') + 0.3), { col: OK });
    B.burst(DX, DY + 290, s('C21') + 0.4, OK);
    // α 滑块：平行六面体
    const g3 = a * B.win(s('C22'), e('C22') + 1.6);
    if (g3 > 0) {
      const t0 = s('C22') + 0.8, al = lerp(2, 8, smoother(prog(B.t, t0, t0 + 5.6)));
      const k = 0.42, c1 = [1, 1, 2].map(v => v * k), c2 = [2, al, -2].map(v => v * k), c3 = [1, 3, 0].map(v => v * k);
      P3.reset();
      const flat = smooth(prog(al, 7.6, 8));
      if (flat > 0) P3.setPlane(0, [-3, 1, 1], { color: C.free, alpha: 0.2 * flat, scale: 0.6 * flat });
      const V = B.show3D(P3, D, g3, { el: 22, az: -20 + 12 * Math.sin(B.t * 0.18), dist: 12, target: [0.6, 1.2, 0], axesA: 0.5, floorA: 0.3 });
      const add = (...vs) => vs.reduce((p, q) => p.map((x, i) => x + q[i]), [0, 0, 0]);
      const O = [0, 0, 0], P = [O, c1, c2, c3, add(c1, c2), add(c1, c3), add(c2, c3), add(c1, c2, c3)].map(V.pr);
      const faces = [[0, 1, 4, 2], [0, 1, 5, 3], [0, 2, 6, 3], [7, 6, 2, 4], [7, 5, 1, 4], [7, 6, 3, 5]];
      ctx.save(); ctx.globalAlpha = g3 * 0.16 * (1 - flat * 0.7); ctx.fillStyle = C.i;
      for (const f of faces) { ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(...P[q]) : ctx.moveTo(...P[q])); ctx.closePath(); ctx.fill(); }
      ctx.globalAlpha = g3 * 0.6; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      for (const [p, q] of [[1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]]) { ctx.beginPath(); ctx.moveTo(...P[p]); ctx.lineTo(...P[q]); ctx.stroke(); }
      ctx.restore();
      V.v3(O, c1, { color: C.i, alpha: g3 }); V.v3(O, c2, { color: C.peri, alpha: g3 }); V.v3(O, c3, { color: C.j, alpha: g3 });
      V.lab(c1.map(v => v * 1.15), 'a₁', { px: 30, a: g3, color: C.i }); V.lab(c2.map(v => v * 1.1), 'a₂', { px: 30, a: g3, color: C.peri }); V.lab(c3.map(v => v * 1.15), 'a₃', { px: 30, a: g3, color: C.j });
      slider('α', al, 2, 9, DX + 60, DY + 360, 400, g3, C.peri, 8);
      const vol = 16 - 2 * al;
      ctag(`体积 = |det A| = ${Math.abs(vol).toFixed(1)}`, DX, DY - 340, { px: 38, a: g3, color: vol < 0.2 ? C.free : C.ink, font: F.serif });
      B.flash(t0 + 5.6, 0.3); B.burst(DX, DY - 340, t0 + 5.6, C.free, { r1: 240 });
      ctag('α = 8：压进同一张平面', DX, DY + 280, { px: 32, a: g3 * gin(t0 + 5.7), color: C.free });
      void cr;
    }
    // 第二问
    const p2 = A * gin(s('C23') - 0.2);
    if (p2 > 0) {
      texAt('uniq2', DX, DY - 290, 36, { alpha: p2, reveal: rv(s('C23'), 2.5) });
      ctag('⇒ 只能 α = 8', DX, DY - 220, { px: 32, a: p2 * gin(cue('C23', '所以只能')), color: C.peri });
      const hideB = 1 - gin(s('C25a') - 0.2);
      MB2.draw(ctx, B.t, { x: DX, y: DY - 30, px: 54, mode: 1, alpha: p2 * gin(s('C24')) * hideB, hiRows: { 1: B.win(s('C24a'), cue('C24a', '二、负二')), 2: Math.max(B.win(cue('C24a', '二、负二'), e('C24b')), gin(s('D06'))) }, labelHold: 1.2 });
      ctag('R₂ − R₁ = (0, 6, 2 | 1)', DX, DY + 130, { px: 30, a: p2 * B.win(s('C24a'), e('C24a')), color: C.i, font: F.serif });
      ctag('R₃ − 2R₁ = (0, −6, −2 | β − 2)', DX, DY + 178, { px: 30, a: p2 * B.win(cue('C24a', '二、负二'), e('C24a')), color: C.i, font: F.serif });
      ctag('R₃ + R₂ = (0, 0, 0 | β − 1)', DX, DY + 150, { px: 32, a: p2 * B.win(s('C24b'), e('C24b')), color: C.peri, font: F.serif });
      texAt('gen2a', DX, DY - 110, 36, { alpha: p2 * gin(s('C25a') + 0.2), reveal: rv(s('C25a') + 0.4, 4) });
      texAt('gen2', DX, DY + 40, 40, { alpha: p2 * gin(s('C25b') + 0.2) });
      ctag('第三式：2x₁ − 2x₂ = 4/3 − 1/3 = 1 = β ✓', DX, DY + 165, { px: 28, a: p2 * gin(cue('C25b', '代回')), color: OK, font: F.serif });
      ctag('β = 1 → 无穷多解', DX - 210, DY + 150, { px: 30, a: p2 * gin(s('C25') + 0.4) * hideB, color: C.i });
      ctag('β ≠ 1 → 无解', DX + 220, DY + 150, { px: 30, a: p2 * gin(cue('C25', '贝塔不等于一')) * hideB, color: C.free });
      B.answer('ans2', DX, DY + 245, 50, p2 * gin(cue('C25', '答案')), { col: C.i });
      B.burst(DX, DY + 245, cue('C25', '答案') + 0.1, C.i);
      const g = p2 * gin(s('G03'));
      B.xcard('评分点：写出“α ≠ 8 ⇒ 唯一解”', DX, DY + 385, 620, 66, g, C.gpt, 28);
    }
  }

  // ════ 2024–25 Q2 ════
  const MB3 = new SBoard([[1, 2, 1, 1], [-1, 4, 3, 2], [2, -2, -2, 'β']]);
  const o3 = [cue('C26b', '第二行加上'), cue('C26b', '第三行减去'), cue('C26b', '再把两行')];
  MB3.add(o3[0], o3[0] + 1.5, 1, 0, 1);
  MB3.add(o3[1], o3[1] + 1.5, 2, 0, -2, [0, -6, -4, 'β−2']);
  MB3.add(o3[2], o3[2] + 1.6, 2, 1, 1, [0, 0, 0, 'β+1']);
  function shotQ3() {
    const a = B.win(s('C26'), s('C28') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C26a') - 0.3); if (A <= 0) return;
    B.qhead('2024–2025 期中 · 第 2 题（姊妹题）', A);
    const up3 = smoother(prog(B.t, s('C26b') - 0.3, s('C26b') + 0.4));
    texAt('A3', DX, DY - 260, 38, { alpha: A, reveal: rv(s('C26a') - 0.2, 2) });
    const gd = A * (1 - up3);
    texAt('det3x', DX, DY - 100, 36, { alpha: gd, reveal: rv(s('C26a') + 0.3, 4) });
    texAt('det3b', DX + 40, DY - 10, 40, { alpha: gd * gin(cue('C26a', '合起来')) });
    B.ghalo('det3b', DX + 40, DY - 10, 40, 'f', gd * gin(cue('C26a', '也就是')));
    ctag('α ≠ −2 → 构成基', DX, DY + 90, { px: 32, a: gd * gin(cue('C26a', '不等于负二')), color: OK });
    MB3.draw(ctx, B.t, { x: DX, y: DY - 40, px: 50, mode: 1, alpha: A * up3, hiRows: { 2: gin(e('C26b') - 0.6) }, labelHold: 1.2 });
    B.answer('ans3', DX, DY + 140, 46, A * gin(s('C27') + 0.2), { col: C.i });
    B.burst(DX, DY + 140, s('C27') + 0.3, C.i);
    texAt('gen3', DX, DY + 255, 34, { alpha: A * gin(cue('C27', '通解')) * (1 - gin(s('D07') + 0.6)) });
    ctag('同一个套路！', DX, DY + 270, { px: 36, a: A * gin(s('D07') + 0.6), color: C.ds, font: F.serif });
  }

  function shotOutro() {
    const a = B.win(s('C28'), 1e9); if (a <= 0) return;
    const two = smoother(prog(B.t, s('G04'), s('G04') + 0.6));
    recipeCard('②', R2, lerp(DY, DY + 170, two), a, C.i, s('C28'));
    if (two > 0) recipeCard('①', R1, DY - 200, a * two, C.peri, 0);
    B.burst(DX + 330, DY - 120, s('C28') + 0.3, C.i);
    const g = a * gin(s('D08'));
    B.xcard('下一段 → 初等矩阵 · LU 分解', DX, DY + 420, 560, 70, g, C.ds, 30);
  }

  // ── 原题纸卡 ──
  function papers() {
    B.paper(EX, 'y1819_q1', { t0: s('C03') + 0.2, dock: s('C04') - 0.2, out: s('C16') - 0.4 });
    B.paper(EX, 'y2526_q2', { t0: s('C17') + 0.3, dock: s('C18') - 0.2, out: s('C26') - 0.4 });
    B.paper(EX, 'y2425_q2', { t0: s('C26') + 0.3, dock: s('C26a') - 0.3, out: s('C28') - 0.3 });
  }

  function draw(t) {
    B.frame(t, D => {
      shotIntro(D); shotQ1(); shot3D(D); shotRecipe1(); shotQ2(D); shotQ3(); shotOutro();
      papers();
    });
  }
  return { TL, draw };
}
