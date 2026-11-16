// 特别篇 · 期中速成 x4：子空间。
// 分镜：三道闸门（零 / 加法 / 数乘）→ 18–19 Q7(a)：sin、cos 曲线 + 组合曲线留在 W，三闸全绿
//       → (b)：零函数撞上第一道闸（落闸 + 红光）、x²−2 进去但 2 倍被弹出 → 25–26 Q6：积分=0 的面积抵消，
//       参数 a 被消掉（4 根柱子掉一根）→ 基曲线三条、正负面积抵消 → 套路卡⑧。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, DX, DY, OK, rgba, arrow } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_shock', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_explain', 'gpt_cross'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q7', 'y2526_q6', 'y2425_q7', 'y2021_t5']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '子空间', hi: 1, en: 'SUBSPACES',
    titleEnd: () => B.L('C02').s + 0.3,
    pre: { C03: 1.0, C09: 0.6, C12: 1.0, C14: 0.4, C17: 0.8 },
    post: { C02: 1.0, C07: 1.0, C08: 1.4, C10: 1.0, C13: 0.6, C15: 1.0, C16: 1.6, C17: 1.2 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;

  // ── 时间锚点 ──
  const tG = [cue('C02', '第一道'), cue('C02', '第二道'), cue('C02', '第三道')];
  const tA = [s('C05') + 0.6, s('C06') + 0.6, s('C07') + 0.6];
  const tBlock = cue('C09', '左边是零'), tBad2 = cue('C10', '但它的两倍');
  TL.sfx('swoosh_in', 0.3, 0.45);
  tG.forEach(x => TL.sfx('thud', x, 0.3)); TL.sfx('ding_hi', cue('C02', '三道都过'), 0.3);
  TL.sfx('slam', s('G01') + 1.0, 0.3);
  [['C03', 0.2], ['C12', 0.2]].forEach(([id, d]) => { TL.sfx('whoosh', s(id) + d, 0.3); TL.sfx('stamp', s(id) + d + 2.4, 0.3); });
  TL.sfx('pluck', cue('C04', '比如正弦'), 0.3); TL.sfx('pluck', cue('C04', '余弦也一样'), 0.3);
  tA.forEach(x => { TL.sfx('check', x + 0.6, 0.35); });
  TL.sfx('stamp', cue('C07', '三道全过') + 0.3, 0.35);
  TL.sfx('shimmer', cue('C08', '它们的任意组合'), 0.3);
  TL.sfx('swoosh_soft', tBlock - 0.8, 0.3); TL.sfx('slam', tBlock, 0.4); TL.sfx('buzz', tBlock + 0.2, 0.25);
  TL.sfx('pluck', cue('C10', '其实它并不是'), 0.3); TL.sfx('crack', tBad2 + 0.6, 0.3);
  TL.sfx('pop', s('C13') + 0.5, 0.3);
  TL.sfx('pop', s('C14') + 0.4, 0.25); TL.sfx('swoosh_soft', cue('C14', '于是a'), 0.3);
  TL.sfx('slam', s('C15') + 0.6, 0.3); TL.sfx('ding_hi', cue('C16', '所以基'), 0.35);
  [0, 1, 2].forEach(i => TL.sfx('marimba', cue('C16', '看图') + 0.4 + i * 0.6, 0.25));
  TL.sfx('thud', s('D03') + 0.8, 0.35); TL.sfx('bell_soft', s('C17'), 0.35); TL.sfx('shimmer', s('D04'), 0.35);

  // ── 小工具：坐标图 ──
  function plot(cx, cy, w, h, xr, yr, a, fns, { axes = true, ticks = [] } = {}) {
    if (a <= 0) return null;
    const X = x => cx - w / 2 + (x - xr[0]) / (xr[1] - xr[0]) * w, Y = y => cy + h / 2 - (y - yr[0]) / (yr[1] - yr[0]) * h;
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(cx - w / 2, cy - h / 2 - 10, w, h + 50); ctx.clip();
    if (axes) {
      ctx.strokeStyle = rgba(C.ink, 0.45); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - w / 2, Y(0)); ctx.lineTo(cx + w / 2, Y(0)); ctx.stroke();
      if (xr[0] <= 0 && xr[1] >= 0) { ctx.beginPath(); ctx.moveTo(X(0), cy - h / 2); ctx.lineTo(X(0), cy + h / 2); ctx.stroke(); }
      ctx.font = F.sans(22, 500); ctx.fillStyle = C.inkMid; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ticks.forEach(([v, t]) => { ctx.fillRect(X(v) - 1, Y(0) - 6, 2, 12); ctx.fillText(t, X(v), Y(0) + 10); });
    }
    for (const fn of fns) {
      const d = fn.draw ?? 1; if (d <= 0) continue;
      const x1 = xr[0] + (xr[1] - xr[0]) * d, N = 160;
      if (fn.fill) {
        const [f0, f1] = fn.fill;
        for (const sgn of [1, -1]) {
          ctx.beginPath(); ctx.moveTo(X(f0), Y(0));
          for (let k = 0; k <= N; k++) { const x = f0 + (Math.min(f1, x1) - f0) * k / N, y = fn.f(x); ctx.lineTo(X(x), Y(sgn > 0 ? Math.max(0, y) : Math.min(0, y))); }
          ctx.lineTo(X(Math.min(f1, x1)), Y(0)); ctx.closePath();
          ctx.globalAlpha = a * (fn.fillA ?? 0.3); ctx.fillStyle = sgn > 0 ? fn.col : C.free; ctx.fill();
        }
        ctx.globalAlpha = a;
      }
      ctx.strokeStyle = fn.col; ctx.lineWidth = fn.lw ?? 4; ctx.globalAlpha = a * (fn.a ?? 1);
      ctx.beginPath(); let first = true;
      for (let k = 0; k <= N; k++) { const x = xr[0] + (x1 - xr[0]) * k / N, y = fn.f(x); if (y < yr[0] - 1 || y > yr[1] + 1) { first = true; continue; } first ? ctx.moveTo(X(x), Y(y)) : ctx.lineTo(X(x), Y(y)); first = false; }
      ctx.stroke(); ctx.globalAlpha = a;
      if (fn.label && d >= 1) { ctx.font = F.serif(28); ctx.fillStyle = fn.col; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const lx = fn.lx ?? xr[1] - (xr[1] - xr[0]) * 0.02; ctx.fillText(fn.label, X(lx) + 8, Y(fn.f(lx)) + (fn.ly ?? 0)); }
    }
    ctx.restore();
    return { X, Y };
  }

  // ── 小工具：三道闸门（state: 0 未判 / 1 通过 / −1 拦下；tState 判定时刻） ──
  function gates(cy, a, st, { w = 760, h = 150, label = true } = {}) {
    if (a <= 0) return;
    const names = ['① 零向量', '② 加法', '③ 数乘'];
    for (let i = 0; i < 3; i++) {
      const x = DX - w / 3 + i * w / 3, [v, tS] = st[i] || [0, 1e9], g = gin(tS, 0.4), col = v > 0 ? OK : v < 0 ? C.free : C.inkMid;
      const drop = v < 0 ? smoother(prog(B.t, tS - 0.35, tS)) : 0;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = rgba(v ? col : C.ink, v ? 0.15 + 0.1 * g : 0.06); ctx.strokeStyle = v ? col : rgba(C.ink, 0.5); ctx.lineWidth = 3;
      ctx.fillRect(x - 22, cy - h / 2, 14, h); ctx.fillRect(x + 8, cy - h / 2, 14, h);
      ctx.strokeRect(x - 22, cy - h / 2, 14, h); ctx.strokeRect(x + 8, cy - h / 2, 14, h);
      if (v < 0) { ctx.fillStyle = C.free; ctx.globalAlpha = a * 0.85; const bh = h * drop; ctx.fillRect(x - 60, cy - h / 2, 120, Math.max(0, bh * 0.18)); for (let k = 0; k < 5; k++) ctx.fillRect(x - 56 + k * 26, cy - h / 2, 6, bh); }
      ctx.restore();
      if (label) ctag(names[i], x, cy + h / 2 + 28, { px: 26, a, color: col });
      if (v > 0) { ctag('✓', x, cy - h / 2 - 30, { px: lerp(70, 44, g), a: a * g, color: OK }); }
      if (v < 0) { B.burst(x, cy, tS, C.free, { r1: 120, n: 14 }); B.flash(tS, 0.25, 0.3, C.free); }
    }
  }

  // ════ 开场：三道闸门 ════
  function shotGates() {
    const a = B.win(s('C02') - 0.3, s('C03') + 0.1); if (a <= 0) return;
    const st = tG.map((x, i) => [gin(cue('C02', '三道都过')) > 0 ? 1 : 0, cue('C02', '三道都过') + i * 0.25]);
    const blk = gin(s('G01') + 1.0);
    if (blk > 0) st[0] = [-1, s('G01') + 1.0];
    gates(DY - 20, a, st);
    tG.forEach((x, i) => { const g = a * gin(x); ctag(['0 在里面吗？', 'u + v 还在吗？', 'c·u 还在吗？'][i], DX - 253 + i * 253, DY - 170, { px: 28, a: g, color: C.ink }); });
    // 小球穿闸
    const t0 = cue('C02', '三道都过') - 1.2, p = prog(B.t, t0, t0 + 1.2);
    if (p > 0 && p < 1 && !blk) { const x = lerp(DX - 420, DX + 420, smooth(p)); B.dot(x, DY - 20, 14, C.i, a); }
    if (blk > 0) { const p2 = prog(B.t, s('G01') + 0.2, s('G01') + 1.0), x = lerp(DX - 440, DX - 290, smoother(p2)), bounce = smoother(prog(B.t, s('G01') + 1.0, s('G01') + 1.6)); B.dot(x - 60 * bounce, DY - 20, 14, C.free, a); }
    B.xcard('一道拦下 ⇒ 不是子空间', DX, DY + 210, 520, 76, a * gin(s('G01') + 1.4) * (1 - gin(s('C01a'))), C.free, 32);
  }

  // ════ 18–19 Q7 ════
  function shotQ7() {
    const a = B.win(s('C03'), s('C12') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C03', '下面两个子集') - 0.6); if (A <= 0) return;
    B.qhead('2018–2019 期中 · 第 7 题', A);
    // (a)
    const pa = A * B.win(s('C04') - 0.2, s('C09') - 0.1);
    if (pa > 0) {
      texAt('Wa', DX, DY - 360, 40, { alpha: pa });
      const k = gin(cue('C08', '它们的任意组合'), 1.2), ph = B.t * 0.6;
      const fns = [
        { f: Math.sin, col: C.i, draw: prog(B.t, cue('C04', '比如正弦'), cue('C04', '比如正弦') + 1.2), label: 'sin x', lx: 1.6, ly: -24, a: lerp(1, 0.35, k) },
        { f: Math.cos, col: C.j, draw: prog(B.t, cue('C04', '余弦也一样'), cue('C04', '余弦也一样') + 1.0), label: 'cos x', lx: -0.2, ly: -24, a: lerp(1, 0.35, k) },
        { f: x => (2 + 0.6 * Math.sin(ph)) * Math.sin(x) + Math.cos(x), col: C.peri, draw: k, lw: 5, label: k > 0.9 ? `${(2 + 0.6 * Math.sin(ph)).toFixed(1)} sin x + cos x` : '', lx: -1.5, ly: 36 },
      ];
      plot(DX, DY - 170, 760, 240, [-3.4, 3.4], [-2.8, 2.8], pa, fns, { ticks: [[-Math.PI, '−π'], [Math.PI, 'π']] });
      const st = tA.map(x => [gin(x + 0.6) > 0 ? 1 : 0, x + 0.6]);
      gates(DY + 80, pa * gin(s('C05')), st, { h: 110 });
      ['a1', 'a2', 'a3'].forEach((kk, i) => { const g = pa * B.win(tA[i] - 0.3, i < 2 ? tA[i + 1] - 0.3 : s('C08')); texAt(kk, DX, DY + 210, 36, { alpha: g }); });
      const g7 = pa * gin(cue('C07', '三道全过') + 0.3);
      B.stamp(DX + 360, DY + 210, true, gin(cue('C07', '三道全过') + 0.3, 0.4), g7, '✓ 是');
      ctag('组合还在 W 里', DX, DY + 210, { px: 34, a: pa * gin(cue('C08', '它们的任意组合') + 0.6), color: C.peri });
    }
    // (b)
    const pb = A * gin(s('C09') - 0.1);
    if (pb > 0) {
      texAt('Wb', DX, DY - 360, 40, { alpha: pb });
      const st = [[gin(tBlock) > 0 ? -1 : 0, tBlock], [0, 1e9], [gin(tBad2 + 0.6) > 0 ? -1 : 0, tBad2 + 0.6]];
      gates(DY - 190, pb, st, { h: 120 });
      const p2 = prog(B.t, tBlock - 0.9, tBlock), bo = smoother(prog(B.t, tBlock, tBlock + 0.6));
      B.dot(lerp(DX - 470, DX - 290, smoother(p2)) - 70 * bo, DY - 190, 14, C.free, pb * (1 - B.win(s('C10'), 1e9) * 0.7));
      ctag('f = 0', DX - 440, DY - 260, { px: 28, a: pb * B.win(tBlock - 1, s('C10')), color: C.free });
      texAt('b1', DX, DY - 30, 40, { alpha: pb * gin(cue('C09', '左边是零')) * (1 - gin(s('C11') - 0.2)) });
      const gx = pb * gin(cue('C10', '其实它并不是')) * (1 - gin(s('C11') - 0.2));
      texAt('b2', DX - 200, DY + 90, 34, { alpha: gx });
      texAt('b3', DX - 200, DY + 170, 34, { alpha: gx * gin(tBad2) });
      plot(DX + 310, DY + 160, 240, 170, [-2.4, 2.4], [-5, 6], gx, [
        { f: x => x * x - 2, col: C.i, label: 'f', lx: 1.9 },
        { f: x => 2 * x * x - 4, col: C.free, draw: gin(tBad2, 0.8), label: '2f', lx: 1.5 },
      ]);
      B.cross(DX - 200, DY + 170, gin(tBad2 + 0.6, 0.4), gx, 40);
      const g11 = pb * gin(s('C11') - 0.2);
      if (g11 > 0) {
        B.card(DX - 210, DY + 120, 400, 160, g11, OK); ctag('右边 = 0', DX - 210, DY + 85, { px: 34, a: g11, color: OK }); ctag('解集是子空间', DX - 210, DY + 145, { px: 32, a: g11, color: C.ink });
        B.card(DX + 210, DY + 120, 400, 160, g11 * gin(cue('C11', '右边不是零')), C.free); ctag('右边 ≠ 0', DX + 210, DY + 85, { px: 34, a: g11 * gin(cue('C11', '右边不是零')), color: C.free }); ctag('连 0 都进不去', DX + 210, DY + 145, { px: 32, a: g11 * gin(cue('C11', '右边不是零')), color: C.ink });
      }
      B.stamp(DX + 330, DY - 70, false, gin(s('C10') + 0.4, 0.4), pb * gin(s('C10') + 0.4) * (1 - gin(s('C11') - 0.2)), '✗ 不是');
      const gg = pb * gin(s('G02'));
      B.xcard('(b) 一句话：0 ∉ W　　(a) 三条都写 / 对线性组合封闭', DX, DY + 320, 820, 70, gg, C.gpt, 28);
    }
  }

  // ════ 25–26 Q6 ════
  function shotQ6() {
    const a = B.win(s('C12'), s('C16c') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C12', '证明S') - 0.6); if (A <= 0) return;
    B.qhead('2025–2026 期中 · 第 6 题', A);
    texAt('S', DX, DY - 360, 38, { alpha: A * (1 - gin(cue('C16', '看图') - 0.3)) });
    // G03：P₄ 维数
    const g3 = A * B.win(s('G03'), s('C13') + 0.2);
    if (g3 > 0) ['1', 'x', 'x²', 'x³'].forEach((t, i) => { const x = DX - 270 + i * 180, g = g3 * gin(s('G03') + 1 + i * 0.3); B.card(x, DY - 60, 140, 100, g, C.gpt); ctag(t, x, DY - 60, { px: 44, a: g, color: C.ink, font: F.serif }); });
    ctag('P₄：最高 3 次，dim = 4', DX, DY + 80, { px: 34, a: g3 * gin(cue('G03', '维数是四')), color: C.gpt });
    // C13：三道闸门全过
    const g13 = A * B.win(s('C13'), s('C14') - 0.2);
    gates(DY - 40, g13, [[1, s('C13') + 1.0], [1, cue('C13', '积分对加法') + 0.6], [1, cue('C13', '积分对加法') + 1.4]], { h: 130 });
    ctag('积分是线性的：∫(p+q) = ∫p + ∫q，∫cp = c∫p', DX, DY + 150, { px: 30, a: g13 * gin(cue('C13', '积分对加法')), color: C.ink });
    // C14–C15：求基
    const pc = A * B.win(s('C14') - 0.2, s('C16') + 0.6);
    if (pc > 0) {
      texAt('p', DX, DY - 250, 40, { alpha: pc, reveal: rv(s('C14'), 1.5) });
      texAt('int', DX, DY - 150, 38, { alpha: pc * gin(cue('C14', '积分出来')) });
      // 四个参数柱 → a 被消掉
      const kill = smoother(prog(B.t, cue('C14', '于是a'), cue('C14', '于是a') + 1.0));
      ['a', 'b', 'c', 'd'].forEach((t, i) => {
        const x = DX - 240 + i * 160, g = pc * gin(s('C14') + 0.4 + i * 0.2) * (1 - gin(s('C15') - 0.2)), dy = i === 0 ? kill * 120 : 0;
        const col = i === 0 ? C.free : [C.i, C.j, C.k][i - 1];
        B.card(x, DY - 20 + dy, 110, 90, g * (i === 0 ? 1 - 0.6 * kill : 1), col); ctag(t, x, DY - 20 + dy, { px: 44, a: g * (i === 0 ? 1 - 0.6 * kill : 1), color: col, font: F.serif });
      });
      texAt('aeq', DX, DY + 120, 38, { alpha: pc * gin(cue('C14', '于是a') + 0.6) * (1 - gin(s('C15') - 0.2)) });
      texAt('pb', DX, DY - 20, 40, { alpha: pc * gin(s('C15') + 0.4) * (1 - gin(cue('C16', '看图') - 0.3)) });
    }
    // C16：基 + 面积抵消
    const pd = A * gin(s('C16'));
    if (pd > 0) {
      const tt = cue('C16', '看图') + 0.4, mv = gin(cue('C16', '看图') - 0.3);
      texAt('basis', DX, lerp(DY + 140, DY - 260, mv), 40, { alpha: pd });
      B.answer('basis', DX, lerp(DY + 140, DY - 260, mv), 40, pd * gin(cue('C16', '所以基')), { col: OK });
      const fs = [[x => x - 0.5, C.i, 'x − ½'], [x => x * x - 1 / 3, C.j, 'x² − ⅓'], [x => x ** 3 - 0.25, C.k, 'x³ − ¼']];
      plot(DX - 40, DY + 20, 640, 300, [-0.1, 1.15], [-0.45, 0.85], pd * mv, fs.map(([f, col, lb], i) => ({
        f, col, draw: prog(B.t, tt + i * 0.6, tt + i * 0.6 + 0.8), fill: B.t > tt + 2.4 + i * 0.5 ? [0, 1] : null, fillA: 0.18,
      })), { ticks: [[0, '0'], [1, '1']] });
      fs.forEach(([, col, lb], i) => ctag(lb, DX + 340, DY - 80 + i * 56, { px: 32, a: pd * mv * gin(tt + i * 0.6 + 0.6), color: col, font: F.serif }));
      ctag('上面积 = 下面积 ⇒ ∫ = 0', DX, DY + 210, { px: 32, a: pd * gin(tt + 2.6), color: C.peri });
      const gd = pd * gin(s('D03'));
      if (gd > 0) { ctag('4', DX - 120, DY + 300, { px: 56, a: gd, color: C.gpt, font: F.serif }); ctag('−1 =', DX, DY + 300, { px: 44, a: gd * gin(s('D03') + 0.5), color: C.free }); ctag('3', DX + 120, DY + 300, { px: 56, a: gd * gin(s('D03') + 0.8), color: OK, font: F.serif }); }
    }
  }

  // ════ 2024–25 Q7：S ∩ T；2020–21 1(5)：S ∪ T ════
  function shotInt() {
    const a = B.win(s('C16c'), s('C17') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C16d') - 0.4); if (A <= 0) return;
    const ph2 = smoother(prog(B.t, s('D03a') - 0.2, s('D03a') + 0.5));
    B.qhead(ph2 < 0.5 ? '2024–2025 期中 · 第 7 题' : '2020–2021 · 判断 1(5)', A * Math.abs(1 - 2 * ph2) * (1 - gin(s('G03a'))));
    // ── Venn ──
    const gv = A * (1 - ph2);
    if (gv > 0) {
      const cy = DY - 120, rx = 210, ry = 150, x1 = DX - 115, x2 = DX + 115;
      const ell = (x, col, al) => { ctx.beginPath(); ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(col, al); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); };
      ctx.save(); ctx.globalAlpha = gv; ell(x1, C.i, 0.10); ell(x2, C.j, 0.10);
      ctx.beginPath(); ctx.ellipse(x1, cy, rx, ry, 0, 0, Math.PI * 2); ctx.clip();
      ctx.beginPath(); ctx.ellipse(x2, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(C.peri, 0.28 + 0.12 * Math.sin(B.t * 2)); ctx.fill();
      ctx.restore();
      ctag('S', x1 - 140, cy - 100, { px: 40, a: gv, color: C.i, font: F.serif }); ctag('T', x2 + 140, cy - 100, { px: 40, a: gv, color: C.j, font: F.serif });
      ctag('S ∩ T', DX, cy - 175, { px: 32, a: gv, color: C.peri, font: F.serif });
      const g0 = gv * gin(s('C16d') + 0.6); B.dot(DX, cy + 60, 9, C.ink, g0); ctag('0', DX + 22, cy + 60, { px: 28, a: g0, color: C.ink });
      const gx = gv * gin(s('C16e') + 0.3), gs = gv * gin(cue('C16e', '于是'));
      B.dot(DX - 30, cy - 40, 9, C.i, gx); ctag('x', DX - 52, cy - 40, { px: 28, a: gx, color: C.ink, font: F.serif });
      B.dot(DX + 30, cy - 10, 9, C.j, gx); ctag('y', DX + 52, cy - 10, { px: 28, a: gx, color: C.ink, font: F.serif });
      B.dot(DX, cy + 10, 11, OK, gs * gin(cue('C16e', '于是'))); ctag('x + y', DX - 4, cy + 32, { px: 24, a: gs, color: OK, font: F.serif });
      const gc = gv * gin(s('C16f') + 0.3); B.dot(DX - 55, cy + 90, 9, OK, gc); ctag('cx', DX - 80, cy + 110, { px: 24, a: gc, color: OK, font: F.serif });
      gates(DY + 190, gv * gin(s('C16d')), [[1, s('C16d') + 1.0], [1, cue('C16e', '于是') + 0.6], [1, s('C16f') + 1.2]], { h: 110 });
      if (gc > 0) B.stamp(DX + 300, DY - 300, true, gin(e('C16f') - 0.7, 0.4), gv * gin(e('C16f') - 0.7), '证毕');
    }
    // ── 并集反例 ──
    const gu = A * ph2;
    if (gu > 0) {
      const ox = DX - 60, oy = DY + 40, k = 170;
      ctx.save(); ctx.globalAlpha = gu * gin(s('C16g') + 0.8); ctx.lineWidth = 5;
      ctx.strokeStyle = C.i; ctx.beginPath(); ctx.moveTo(ox - 400, oy); ctx.lineTo(ox + 400, oy); ctx.stroke();
      ctx.strokeStyle = C.j; ctx.beginPath(); ctx.moveTo(ox, oy + 300); ctx.lineTo(ox, oy - 360); ctx.stroke(); ctx.restore();
      const gl = gu * gin(s('C16g') + 1.2);
      ctag('S', ox + 380, oy - 30, { px: 38, a: gl, color: C.i, font: F.serif }); ctag('T', ox + 30, oy - 340, { px: 38, a: gl, color: C.j, font: F.serif });
      const gx = gu * gin(s('C16h') + 0.2), gy = gu * gin(cue('C16h', 'y等于零')), gs = gu * gin(cue('C16h', 'x加y'));
      arrow(ctx, [ox, oy], [ox + k, oy], { color: C.i, width: 6, head: 20, alpha: gx }); ctag('x = (1, 0)', ox + k, oy + 38, { px: 28, a: gx, color: C.i, font: F.serif });
      arrow(ctx, [ox, oy], [ox, oy - k], { color: C.j, width: 6, head: 20, alpha: gy }); ctag('y = (0, 1)', ox - 100, oy - k, { px: 28, a: gy, color: C.j, font: F.serif });
      if (gs > 0) {
        ctx.save(); ctx.globalAlpha = gs * 0.6; ctx.setLineDash([10, 8]); ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ox + k, oy); ctx.lineTo(ox + k, oy - k); ctx.lineTo(ox, oy - k); ctx.stroke(); ctx.restore();
        arrow(ctx, [ox, oy], [ox + k, oy - k], { color: C.free, width: 6, head: 20, alpha: gs, grow: gin(cue('C16h', 'x加y'), 0.6) });
        ctag('x + y = (1, 1) ∉ S ∪ T', ox + k + 200, oy - k - 55, { px: 30, a: gs * gin(cue('C16h', 'x加y') + 0.6), color: C.free, font: F.serif });
        B.cross(ox + k, oy - k, gin(cue('C16h', '两条线上都没有'), 0.4), gs, 40);
      }
      B.stamp(DX + 280, DY - 300, false, gin(cue('C16g', '答案') , 0.4), gu * gin(cue('C16g', '答案')), '错');
      const g3 = gu * gin(s('G03a'));
      B.xcard('交集 ✓ 一定是子空间　　并集 ✗ 一般不是', DX, DY + 300, 700, 76, g3, C.gpt, 30);
    }
  }

  function shotOutro() {
    const a = B.win(s('C17'), 1e9); if (a <= 0) return;
    const g = a * gin(s('C17'));
    B.card(DX, DY - 60, 880, 300, g, C.peri);
    ctag('套路卡 ⑧', DX - 330, DY - 170, { px: 30, a: g, color: C.peri, font: F.serif });
    ['子空间 = 三道闸门：0 ∈ W、加法封闭、数乘封闭', '判“不是”：先试零向量', '求基：写通式 → 用条件消掉一个参数', '　　　→ 按剩下的参数整理'].forEach((l, k) =>
      ctag(l, DX - 400, DY - 110 + k * 54, { px: 32, a: a * gin(s('C17') + 0.3 + (k < 2 ? 0 : cue('C17', '求基') - s('C17')) + k * 0.2), color: k === 1 ? C.free : C.ink, align: 'left' }));
    B.burst(DX + 380, DY - 170, s('C17') + 0.2, C.peri, { r1: 100, n: 12 });
    B.xcard('下一段 → 线性相关', DX, DY + 200, 440, 70, a * gin(s('D04')), C.ds, 30);
  }

  function papers() {
    B.paper(EX, 'y1819_q7', { t0: s('C03') + 0.2, dock: cue('C03', '下面两个子集') - 0.8, out: s('C12') - 0.4 });
    B.paper(EX, 'y2526_q6', { t0: s('C12') + 0.2, dock: cue('C12', '证明S') - 0.8, out: s('C16c') - 0.3 });
    B.paper(EX, 'y2425_q7', { t0: s('C16c') + 0.2, dock: s('C16d') - 0.5, out: s('D03a') - 0.2 });
    B.paper(EX, 'y2021_t5', { t0: s('C16g') + 0.1, dock: s('C16g') + 2.6, out: s('C17') - 0.3 });
  }

  // ── 扩写：逐步算式小卡 ──
  const XC = [
    ['C01a', DY + 290, ['x + y = 1（右边 ≠ 0）', 'x₁x₂ = 0（乘积）', 'x ≥ 0（乘负数就出去）'], C.free],
    ['C11a', DY + 300, ['Ax = 0 → 零空间 ✓　　Ax = b (b ≠ 0) → 平移 ✗'], C.j],
    ['G02a', DY + 215, ['y = 2x ✓　　x + y = 1 ✗'], C.gpt],
    ['C14a', DY + 300, ['∫₀¹ 1, x, x², x³ dx = 1, ½, ⅓, ¼'], C.i],
    ['C16a', DY + 300, ['次数 1、2、3 各不相同 ⇒ 线性无关'], C.j],
    ['G16b', DY + 300, ['∫₀¹ (x² − ⅓) dx = ⅓ − ⅓ = 0  ✓'], OK],
  ];
  function extras() {
    for (const [id, y, rows, col] of XC) {
      const g = B.win(s(id), e(id) + 0.15); if (g <= 0) continue;
      const w = Math.max(...rows.map(r => [...r].reduce((q, ch) => q + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 30 : 16), 0))) + 80, h = rows.length * 44 + 30;
      B.card(DX, y, Math.min(880, w), h, g * 0.95, col);
      rows.forEach((r, i) => ctag(r, DX, y - (rows.length - 1) * 22 + i * 44, { px: 29, a: g * gin(s(id) + 0.3 + i * 1.4), color: col === OK ? OK : C.ink, font: F.serif }));
    }
  }

  function draw(t) {
    B.frame(t, () => { shotGates(); shotQ7(); shotQ6(); shotInt(); shotOutro(); papers(); extras(); });
  }
  return { TL, draw };
}
