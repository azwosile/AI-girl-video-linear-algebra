// 特别篇 7 · 第 3 段：附加题 2015–16 第 4 题（线性变换换基）+ 全系列收尾。
// 分镜：原题纸卡 → A 与 v₁ v₂ v₃ 上屏 → v 排成列 = V（三根列飞入）→ “两副眼镜”链 V → A → V⁻¹（三段箭头）
//       → 捷径：Av₁ = 0、Av₂ = v₂、Av₃ = v₃ 逐个算出（列飞向 B）→ B = diag(0,1,1) 盖章
//       → 3D：v₂、v₃ 张成的平面 + 点沿 v₁ 方向滑落到平面上（投影）→ GPT 验算 V⁻¹ → 特征值预告
//       → 收尾：七集标题依次掠过、“期中加油”大字 + 粒子。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba, load3D } from '../../sp/common.js';
import { kit, vec } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_confused', 'ds_happy', 'gpt_proud', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1516_q4']);
  const B = base(R, {
    assets, label: '特别篇 7 · 判断 · 导航 · 附加', title: '附加题：换基', hi: 3, en: 'BONUS · CHANGE OF BASIS',
    titleEnd: () => B.L('C01').s + 0.6,
    pre: { C02: 0.4, C04: 0.6, C05: 0.4, C09: 0.8, C10: 1.0 },
    post: { C02: 1.2, C03: 1.4, C04: 1.4, C06: 1.2, C07: 1.2, C08: 1.6, C09: 2.4, G01: 1.4, G02: 1.2, D02: 0.8, G03: 0.8, C11: 2.4 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3, nPlanes: 1, nLines: 3, nPoints: 4 });

  const A = [[3, -1, -2], [2, 0, -2], [2, -1, -1]];
  const v1 = [1, 1, 1], v2 = [1, 2, 0], v3 = [0, -2, 1];
  const V = [[1, 1, 0], [1, 2, -2], [1, 0, 1]];
  const Vi = [[-2, 1, 2], [3, -1, -2], [2, -1, -1]];
  const tA1 = s('C06'), tA2 = cue('C06', 'A乘v二'), tA3 = s('C07'), tB = s('C08');

  // ── 音效 ──
  TL.sfx('whoosh', s('C01') + 0.3, 0.3); TL.sfx('stamp', s('C01') + 2.7, 0.3);
  TL.sfx('pop', cue('C02', 'A的三行'), 0.3); ['v一等于', 'v二等于', 'v三等于'].forEach(w => TL.sfx('pluck', cue('C02', w), 0.3));
  TL.sfx('swoosh_in', cue('C03', '就是把v排成列'), 0.3); [0, 1, 2].forEach(k => TL.sfx('marimba', cue('C03', '就是把v排成列') + 0.3 + k * 0.25, 0.25));
  ['V把v坐标', 'A在标准坐标里', 'V逆再翻译'].forEach(w => TL.sfx('swoosh_soft', cue('C04', w), 0.3));
  TL.sfx('slap', s('D01') + 0.3, 0.25); TL.sfx('ding_hi', cue('C05', '有捷径'), 0.3);
  TL.sfx('thud', cue('C06', '也就是零向量'), 0.3); TL.sfx('shimmer', cue('C06', '正是v二'), 0.3); TL.sfx('shimmer', cue('C07', '正是v三'), 0.3);
  TL.sfx('stamp', cue('C08', 'B是对角矩阵'), 0.35); TL.sfx('sparkle', cue('C08', '对角线上'), 0.3);
  TL.sfx('warp', cue('C09', '压扁'), 0.3); TL.sfx('check', cue('G01', '和捷径一致'), 0.3); TL.sfx('bell_soft', cue('G02', '特征值与对角化'), 0.3);
  TL.sfx('swell', s('C10') + 0.2, 0.3); TL.sfx('sparkle', s('D02') + 0.2, 0.4); TL.sfx('impact', s('D02') + 0.1, 0.3); TL.sfx('bell_soft', s('C11') + 0.2, 0.4);

  // ════ 题面 + V ════
  function shotSetup() {
    const a = B.win(s('C02'), s('C09') - 0.3); if (a <= 0) return;
    const lift = smoother(prog(B.t, s('C04') - 0.3, s('C04') + 0.3)) * (1 - smoother(prog(B.t, s('C05') - 0.2, s('C05') + 0.4)));
    const ya = DY - 230 - 0 * lift;
    const gA = a * gin(cue('C02', 'A的三行')) * (1 - gin(tB - 0.2) * 0.7);
    const MA = B.mat(DX - 300, ya, A, { px: 32, a: gA }); ctag('A', DX - 300 - MA.w / 2 - 40, ya, { px: 34, a: gA, color: C.inkMid, font: F.serif });
    [[v1, 'v₁', C.free, 'v一等于'], [v2, 'v₂', C.i, 'v二等于'], [v3, 'v₃', C.j, 'v三等于']].forEach(([v, lab, col, w], k) => {
      const t0 = cue('C02', w), merge = smoother(prog(B.t, cue('C03', '就是把v排成列') + k * 0.25, cue('C03', '就是把v排成列') + 0.7 + k * 0.25));
      const x0 = DX + 30 + k * 120, x1 = DX + 170 + (k - 1) * 58;
      const g = a * gin(t0) * (1 - gin(s('C05') - 0.3)); if (g <= 0) return;
      const x = lerp(x0, x1, merge);
      K.cvec(x, ya, v, g, { px: 32, col }); ctag(lab, x, ya - 95, { px: 28, a: g * (1 - merge), color: col, font: F.serif });
    });
    const gV = a * gin(cue('C03', '就是把v排成列') + 0.9) * (1 - gin(s('C05') - 0.3));
    if (gV > 0) {
      ctag('V =', DX + 170 - 58 * 1.5 - 70, ya, { px: 34, a: gV, color: C.peri, font: F.serif });
      ctx.save(); ctx.globalAlpha = gV; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.strokeRect(DX + 170 - 90, ya - 80, 180, 160); ctx.restore();
      ctag('S = I⁻¹V = V（把 v 排成列）', DX + 170, ya + 130, { px: 28, a: gV, color: C.peri, font: F.serif });
    }
    ctag('到谁用谁的逆：到标准基 I', DX - 120, DY - 40, { px: 30, a: a * B.win(cue('C03', '到谁就用谁的逆'), s('C04') - 0.1), color: C.ink });
    // 两副眼镜
    const gg = a * B.win(s('C04'), s('C05') - 0.1); if (gg <= 0) return;
    const yy = DY + 70, xs = [DX + 360, DX + 120, DX - 120, DX - 360];
    ctag('B = V⁻¹ A V', DX, yy - 120, { px: 52, a: gg, color: C.ink, font: F.serif });
    const lbl = ['v 坐标', '标准坐标', '标准坐标', 'v 坐标'];
    xs.forEach((x, k) => { B.card(x, yy + 30, 170, 60, gg * gin(cue('C04', '从右往左读') + k * 0.2), k === 0 || k === 3 ? C.i : C.j); ctag(lbl[k], x, yy + 30, { px: 26, a: gg * gin(cue('C04', '从右往左读') + k * 0.2), color: C.ink }); });
    [['V', 'V把v坐标'], ['A', 'A在标准坐标里'], ['V⁻¹', 'V逆再翻译']].forEach(([m, w], k) => {
      const u = smoother(prog(B.t, cue('C04', w), cue('C04', w) + 0.7));
      arrow(ctx, [xs[k] - 90, yy + 30], [xs[k + 1] + 90, yy + 30], { color: C.peri, width: 5, head: 16, alpha: gg, grow: u });
      ctag(m, (xs[k] + xs[k + 1]) / 2, yy - 10, { px: 32, a: gg * u, color: C.peri, font: F.serif });
    });
    ctag('3 个 3×3 连乘……', DX, yy + 140, { px: 30, a: a * B.win(s('D01'), s('C05')), color: C.ds });
  }

  // ════ 捷径 ════
  function shotShort() {
    const a = B.win(s('C05'), s('C09') - 0.3); if (a <= 0) return;
    const g0 = a * gin(cue('C05', '有捷径'));
    B.card(DX, DY - 300, 860, 70, g0 * 0.95, C.peri);
    ctag('B 的第 i 列 = A vᵢ 在 {v} 下的坐标', DX, DY - 300, { px: 34, a: g0, color: C.ink, font: F.serif });
    const rows = [
      ['Av₁ = (3 − 1 − 2, 2 + 0 − 2, 2 − 1 − 1) = (0, 0, 0)', tA1, '= 0', C.free, '也就是零向量', [0, 0, 0]],
      ['Av₂ = (3 − 2, 2, 2 − 2) = (1, 2, 0)', tA2, '= v₂', C.i, '正是v二', [0, 1, 0]],
      ['Av₃ = (0 + 2 − 2, 0 + 0 − 2, 0 + 2 − 1) = (0, −2, 1)', tA3, '= v₃', C.j, '正是v三', [0, 0, 1]],
    ];
    rows.forEach(([tx, t0, res, col, w, crd], k) => {
      const y = DY - 190 + k * 80, g = a * gin(t0 + 0.3) * (1 - gin(tB + 2.5) * 0.65); if (g <= 0) return;
      K.type(tx, DX - 440, y, t0 + 0.3, 2.2, g, { px: 30, col: C.ink });
      const tr = k === 1 || k === 2 ? cue(k === 1 ? 'C06' : 'C07', w) : cue('C06', w);
      const gr = g * gin(tr);
      K.pill(res, DX + 400, y, col, gr, 26);
      B.burst(DX + 400, y, tr + 0.1, col, { r1: 120 });
      // 坐标飞向 B 的列
      const u = prog(B.t, tB + k * 0.3, tB + 0.9 + k * 0.3);
      if (u > 0 && u < 1) B.fly([DX + 400, y], [DX - 70 + k * 70, DY + 170], u, col, { lift: 90, r: 10 });
    });
    const gB = a * gin(tB + 1.1);
    if (gB > 0) {
      const M = B.mat(DX, DY + 170, [[0, 0, 0], [0, 1, 0], [0, 0, 1]], { px: 44, a: gB, cell: (i, j) => ({ col: i === j ? [C.free, C.i, C.j][j] : C.inkMid }) });
      ctag('B =', DX - M.w / 2 - 60, DY + 170, { px: 44, a: gB, color: C.ink, font: F.serif });
      const st = cue('C08', 'B是对角矩阵');
      K.redStamp('diag(0, 1, 1)', DX + 260, DY + 160, prog(B.t, st, st + 0.5), a, C.peri, 40);
      B.burst(DX, DY + 170, st + 0.2, C.peri, { r1: 260, n: 22 });
    }
  }

  // ════ 3D 投影 ════
  function shotProj(D) {
    const a = B.win(s('C09') - 0.2, s('C10') - 0.3); if (a <= 0) return;
    const t0 = s('C09'), tz = cue('C09', '压扁');
    const n = [2, -1, -2]; // v₂ × v₃
    P3.reset();
    P3.setPlane(0, n, { color: C.j, alpha: 0.3, scale: 0.8 * outCubic(prog(B.t, t0, t0 + 1.0)) });
    const pts = [[0.6, 0.8, 0.5], [-0.5, 0.3, -0.6], [0.9, -0.4, 0.2]];
    const cof = p => { // p = a v1 + b v2 + c v3 → 用 V⁻¹
      const c = Vi.map(r => r[0] * p[0] + r[1] * p[1] + r[2] * p[2]); return c; };
    const u = smoother(prog(B.t, tz, tz + 2.0));
    pts.forEach((c, k) => {
      const p = [0, 1, 2].map(i => c[0] * v1[i] + c[1] * v2[i] + c[2] * v3[i]);
      const q = [0, 1, 2].map(i => c[1] * v2[i] + c[2] * v3[i]);
      const cur = p.map((x, i) => lerp(x, q[i], u));
      P3.setPoint(k, cur, { r: 0.13, color: C.i, alpha: gin(t0 + 0.6) });
      const mid = p.map((x, i) => (x + q[i]) / 2), half = Math.hypot(...p.map((x, i) => x - q[i])) / 2;
      P3.setLine(k, v1, { p0: mid, half, color: C.free, alpha: 0.6 * gin(tz - 0.3), width: 3 });
    });
    void cof;
    const Vw = B.show3D(P3, D, a, { el: 22, az: -40 + (B.t - t0) * 4, dist: 14, axesA: 0.35, floorA: 0.15 });
    Vw.v3([0, 0, 0], v1, { color: C.free, alpha: a * gin(t0 + 0.4) * (1 - 0.6 * u) });
    Vw.v3([0, 0, 0], v2, { color: C.i, alpha: a * gin(t0 + 0.6) });
    Vw.v3([0, 0, 0], v3, { color: C.j, alpha: a * gin(t0 + 0.8) });
    Vw.lab(v1, 'v₁ → 0', { px: 30, a: a * gin(tz), color: C.free });
    Vw.lab(v2, 'v₂', { px: 30, a: a * gin(t0 + 0.6), color: C.i }); Vw.lab(v3, 'v₃', { px: 30, a: a * gin(t0 + 0.8), color: C.j });
    ctag('L = 沿 v₁ 方向投影到 Span{v₂, v₃}', DX, DY - 330, { px: 32, a: a * gin(cue('C09', '它是一个投影')), color: C.peri });
    // GPT 验算 + 特征值
    const gv = a * gin(s('G01'));
    if (gv > 0) {
      B.card(DX, DY + 280, 860, 110, gv * 0.95, C.gpt);
      B.mat(DX - 250, DY + 280, Vi, { px: 22, a: gv }); ctag('V⁻¹ =', DX - 380, DY + 280, { px: 28, a: gv, color: C.gpt, font: F.serif });
      ctag('V⁻¹AV = diag(0, 1, 1) ✓', DX + 150, DY + 280, { px: 32, a: gv * gin(cue('G01', '真的乘出来')), color: OK, font: F.serif });
    }
    const ge = a * gin(cue('G02', '特征值与对角化'));
    K.pill('第六章 · 特征值 λ = 0, 1, 1', DX, DY + 380, C.k, ge, 26);
  }

  // ════ 收尾 ════
  function shotOutro() {
    const a = B.win(s('C10'), 1e9); if (a <= 0) return;
    const T = ['1 · 参数讨论与线性方程组', '2 · LU 与初等矩阵', '3 · 行列式', '4 · 向量空间与相关性', '5 · 过渡矩阵', '6 · 秩与 RREF 反推', '7 · 判断 · 导航 · 附加'];
    T.forEach((tx, k) => {
      const t0 = s('C10') + 0.3 + k * 0.45, u = prog(B.t, t0, t0 + 1.4);
      if (u <= 0) return;
      const x = lerp(DX + 700, DX - 700, smoother(u)), y = DY - 260 + (k % 2) * 60;
      const g = a * Math.sin(Math.PI * Math.min(1, u)) * (1 - gin(s('D02')));
      ctag('特别篇 ' + tx, x, y, { px: 34, a: g, color: k % 2 ? C.i : C.ink, font: F.serif });
    });
    const gr = a * gin(cue('C10', '考场上记住'));
    ['先写定义', '再计算', '最后验算'].forEach((w, k) => K.pill(w, DX - 260 + k * 260, DY - 20, [C.i, C.j, OK][k], gr * gin(cue('C10', '考场上记住') + 0.6 + k * 0.6) * (1 - gin(s('D02'))), 30));
    const g = a * gin(s('D02')), k = lerp(1.8, 1, outBack(prog(B.t, s('D02'), s('D02') + 0.6), 2));
    ctx.save(); ctx.translate(DX, DY - 60); ctx.scale(k, k); ctx.translate(-DX, -(DY - 60));
    ctag('期中加油！', DX, DY - 60, { px: 120, a: g, color: C.peri, font: F.serif }); ctx.restore();
    B.burst(DX, DY - 60, s('D02') + 0.1, C.peri, { r1: 460, n: 30 }); B.burst(DX, DY - 60, s('D02') + 0.4, C.i, { r1: 380, n: 22 });
    ctag('考完回来 · 第四章 线性变换', DX, DY + 120, { px: 36, a: a * gin(s('G03')), color: C.ink });
  }

  function draw(t) {
    B.frame(t, (D) => {
      shotSetup(); shotShort(); shotProj(D); shotOutro();
      B.paper(EX, 'y1516_q4', { t0: s('C01') + 0.2, dock: cue('C01', '它把过渡矩阵') - 0.2, out: s('C09') - 0.4 });
    });
  }
  return { TL, draw };
}
