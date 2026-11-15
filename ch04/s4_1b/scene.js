// 第 4 章 4.1b 从 ℝⁿ 到 ℝᵐ，核与像（Leon 9th §4.1 后半）。
// 分镜：例 5 平面压成数轴（核 = 斜线 → 原点）→ 例 7 平面送进 ℝ³（3D）→ L_A(x) = Ax → 问题卡
//       → 性质 (i)–(iii) → 例 8/9/10（积分面积、切线）→ 核与像的定义（V、W 两团 + 箭头）→ 定理 4.1.1
//       → 例 11 投影 → 例 12 求核 + ℝ³ 压到平面（3D，核直线缩成原点）→ 对照第三章 → 例 13 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第四章 · 线性变换', title: '4.1 核与像', hi: 3, en: 'KERNEL AND IMAGE',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C06: 0.5, C09: 0.6, C12: 0.6, C15: 0.6, C17: 0.5, C19: 0.6, C20: 0.6, C23: 0.4, C24: 0.4, C26: 0.6, G01: 0.6, C27: 0.6 },
    post: { C03: 1.0, C05: 0.6, C08: 0.6, C11: 0.6, C14: 0.6, C16: 0.6, C18: 0.6, C19: 1.0, C21: 0.6, C23: 1.2, C25: 0.6, D04: 0.4 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, e5: L('C02').s, e5s: L('C03').s, e5k: cue('C03', '斜线'), e7: L('C04').s, A7: L('C05').s, LA: L('C06').s, lin: L('C07').s,
    q: L('D01').s, qa: L('C08').s, p: L('C09').s, p2: L('C10').s, p3: cue('C10', '第三'), p1: L('C11').s,
    e8: L('C12').s, e9: L('C13').s, e10: L('C14').s, d2: L('D02').s,
    ker: L('C15').s, ker2: cue('C15', '被L送到'), img: L('C16').s, rng: cue('C16', '整个V的像'), thm: L('C17').s, prf: L('C18').s, prf2: cue('C18', '对标量乘法'),
    e11: L('C19').s, e11k: cue('C19', '核是'), e11r: cue('C19', '值域是'),
    e12: L('C20').s, e12s: L('C21').s, e12k: cue('C21', '核是一条直线'), e12S: L('C22').s, e12v: L('C23').s,
    d3: L('D03').s, cmp: L('C24').s, cmp2: cue('C24', '值域就是'), rn: L('C25').s, rn2: cue('C25', '例十二里'),
    e13: L('C26').s, e13r: cue('C26', '所以值域'), d4: L('D04').s, tj: L('G01').s, sum: L('C27').s, end: L('C28').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('warp', T.e5s, 0.4); TL.sfx('pop', T.e5k, 0.3); TL.sfx('whoosh', T.e7, 0.3); TL.sfx('pop', T.A7, 0.3); TL.sfx('ding_hi', T.LA, 0.3);
  TL.sfx('pluck', T.q, 0.3); TL.sfx('whoosh', T.p, 0.3); TL.sfx('pop', T.p2, 0.3); TL.sfx('pop', T.p3, 0.3); TL.sfx('ding_hi', T.p1, 0.3);
  [T.e8, T.e9, T.e10].forEach(x => TL.sfx('pop', x + 0.3, 0.3)); TL.sfx('shimmer', T.ker, 0.35); TL.sfx('pop', T.img, 0.3); TL.sfx('ding_hi', T.thm, 0.3);
  TL.sfx('warp', T.e11 + 0.4, 0.4); TL.sfx('whoosh', T.e12, 0.3); TL.sfx('pop', T.e12k, 0.3); TL.sfx('warp', T.e12v, 0.4); TL.sfx('shimmer', T.cmp, 0.35); TL.sfx('ding_hi', T.rn2, 0.3);
  TL.sfx('whoosh', T.e13, 0.3); TL.sfx('check', T.d4 + 1.0, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C28').e + 0.3, 0.4);

  const P = new Plane({ ox: DX, oy: DY + 40, u: 56, R: 8 });
  const K2 = D => { ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip(); };

  // ── A：例 5 ℝ² → ℝ¹ ──
  function shotE5(D) {
    const a = B.win(T.o1 + 0.3, T.e7 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.e5s + 0.3, T.e5s + 2.4));
    const M = B.warp(P, [[1, 1], [0, 0]], s, a * gin(T.o1 + 0.5), D, { neu: 0.5 });
    ctx.save(); K2(D); P.line(ctx, [0, 0], [1, -1], { M: I2, color: C.free, width: 6, alpha: a * gin(T.e5k) * 0.7 }); ctx.restore();
    void M;
    for (let k = -3; k <= 3; k++) if (k) B.dot(...P.S([k * 0.8, -k * 0.8], M), 9, C.free, a * gin(T.e5k));
    ctag('输入、输出不必在同一个空间', DX, DY - 380, { px: 32, a: a * gin(T.o1 + 0.6) * (1 - gin(T.e5 - 0.2)), color: C.ink });
    texAt('map5', DX - 200, DY - 380, 40, { alpha: a * gin(T.e5), color: C.peri }); texAt('e5', DX + 180, DY - 380, 44, { alpha: a * gin(T.e5) });
    ctag('整张平面 → 一条直线', DX, DY - 310, { px: 32, a: a * gin(T.e5s), color: C.ink });
    texAt('k5', DX + 220, DY + 300, 40, { alpha: a * gin(T.e5k), color: C.free }); ctag('这条线 → 原点', DX + 220, DY + 360, { px: 30, a: a * gin(T.e5k + 0.5), color: C.free });
  }

  // ── B：例 7 ℝ² → ℝ³ ──
  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const PT2 = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) PT2.push([i * 0.55, j * 0.55]);
  function shotE7(D) {
    const a = B.win(T.e7 - 0.2, T.q - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.e7 + 0.8, T.e7 + 3.0));
    P3.reset();
    P3.setPlane(0, [1, 1, -1], { color: C.j, alpha: 0.28 * gin(T.e7 + 2.6), scale: outCubic(prog(B.t, T.e7 + 2.6, T.e7 + 3.4)) });
    P3.setPoint(0, [0, 0, 0], { r: 0.09, color: C.ink });
    const V = B.show3D(P3, D, a, { el: 20, az: -105 + 8 * Math.sin(B.t * 0.25), dist: 13, axesA: 0.7, floorA: 0.35 });
    for (const [x1, x2] of PT2) { const q0 = [x1, x2, 0], q1 = [x2, x1, x1 + x2], q = q0.map((v, i) => lerp(v, q1[i], s)); const xy = V.pr(q); B.dot(xy[0], xy[1], 7, C.i, a * 0.85); }
    V.v3([0, 0, 0], [lerp(1, 0, s), lerp(0, 1, s), lerp(0, 1, s)], { color: C.i, alpha: a }); V.v3([0, 0, 0], [lerp(0, 1, s), lerp(1, 0, s), lerp(0, 1, s)], { color: C.j, alpha: a });
    texAt('map7', DX - 190, DY - 380, 40, { alpha: a * gin(T.e7), color: C.peri }); texAt('e7', DX + 170, DY - 380, 40, { alpha: a * gin(T.e7) });
    ctag('平面 → 空间里的一张平面', DX, DY - 320, { px: 30, a: a * gin(T.e7 + 2.6) * (1 - gin(T.A7 - 0.2)), color: C.j });
    const g = a * gin(T.A7); B.card(DX + 310, DY + 90, 300, 230, g, C.peri);
    texAt('A7', DX + 310, DY + 60, 40, { alpha: g }); texAt('LA', DX + 310, DY + 165, 32, { alpha: a * gin(cue('C05', '矩阵')), color: C.peri });
    const h = a * gin(T.LA); B.card(DX, DY + 290, 640, 84, h, C.peri);
    texAt('LAmap', DX - 160, DY + 290, 36, { alpha: h, color: C.peri }); texAt('LA', DX + 170, DY + 290, 38, { alpha: h });
    texAt('lin', DX, DY + 385, 34, { alpha: a * gin(T.lin), reveal: rv(T.lin, 1.4) });
  }

  // ── C：问题卡 ──
  function shotQ() {
    const a = B.win(T.q - 0.2, T.p - 0.3); if (a <= 0) return;
    B.card(DX - 230, DY - 60, 260, 120, a, C.i); B.card(DX + 230, DY - 60, 260, 120, a, C.j);
    ctag('矩阵', DX - 230, DY - 60, { px: 44, a, color: C.i, font: F.serif }); ctag('线性变换', DX + 230, DY - 60, { px: 40, a, color: C.j, font: F.serif });
    arrow(ctx, [DX - 90, DY - 85], [DX + 90, DY - 85], { color: OK, width: 5, head: 20, alpha: a });
    arrow(ctx, [DX + 90, DY - 35], [DX - 90, DY - 35], { color: C.inkMid, width: 5, head: 20, alpha: a * gin(T.q + 1.2), grow: gin(T.q + 1.2, 0.6) });
    ctag('?', DX, DY + 10, { px: 54, a: a * gin(T.q + 1.6) * (1 - gin(T.qa + 0.8)), color: C.free, font: F.serif });
    ctag('ℝⁿ → ℝᵐ：是！（下一节）', DX, DY + 120, { px: 36, a: a * gin(T.qa + 0.8), color: OK });
  }

  // ── D：性质 ──
  function shotProp() {
    const a = B.win(T.p - 0.2, T.e8 - 0.3); if (a <= 0) return;
    ctag('L: V → W 的三条性质', DX, DY - 330, { px: 36, a: a * gin(T.p), color: C.peri, font: F.serif });
    texAt('p1', DX, DY - 200, 46, { alpha: a * gin(T.p + 1.0) }); texAt('p2', DX, DY - 80, 34, { alpha: a * gin(T.p2) }); texAt('p3', DX, DY + 40, 42, { alpha: a * gin(T.p3) });
    const g = a * gin(T.p1); B.card(DX, DY + 200, 700, 110, g, C.free);
    ctag('L(0) ≠ 0  ⇒  立刻判定：不是线性变换', DX, DY + 180, { px: 32, a: g, color: C.free }); ctag('（平移就这样出局）', DX, DY + 225, { px: 26, a: g * gin(cue('C11', '上一节的平移')), color: C.inkMid });
  }

  // ── E：例 8/9/10 ──
  function shotEx() {
    const a = B.win(T.e8 - 0.2, T.ker - 0.3); if (a <= 0) return;
    ctag('不限于 ℝⁿ', DX, DY - 360, { px: 36, a, color: C.peri, font: F.serif });
    const cols = [[DX - 300, T.e8, 'e8', '例 8  恒等'], [DX, T.e9, 'e9', '例 9  积分'], [DX + 300, T.e10, 'e10', '例 10  求导']];
    for (const [x, t0, k, n] of cols) { const g = a * gin(t0); B.card(x, DY - 40, 270, 400, g, C.inkMid); ctag(n, x, DY - 210, { px: 28, a: g, color: C.ink }); texAt(k, x, DY + 110, k === 'e9' ? 30 : 38, { alpha: g }); }
    // 恒等：向量原地不动
    { const g = a * gin(T.e8 + 0.4), O = [DX - 360, DY + 30]; arrow(ctx, O, [DX - 230, DY - 90], { color: C.i, width: 6, head: 18, alpha: g }); ctag('不动', DX - 300, DY + 40, { px: 26, a: g, color: C.inkMid }); }
    // 积分：曲线下面积
    { const g = a * gin(T.e9 + 0.4); if (g > 0) { const x0 = DX - 110, x1 = DX + 110, yb = DY + 30, f = u => yb - 60 - 45 * Math.sin(u * 3) - 20 * u;
      ctx.save(); ctx.globalAlpha = g * 0.35; ctx.fillStyle = C.i; ctx.beginPath(); ctx.moveTo(x0 + 20, yb); for (let i = 0; i <= 40; i++) { const u = i / 40; ctx.lineTo(x0 + 20 + u * 180, f(u)); } ctx.lineTo(x1 - 20, yb); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = g; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40; i ? ctx.lineTo(x0 + 20 + u * 180, f(u)) : ctx.moveTo(x0 + 20, f(0)); } ctx.stroke();
      ctx.strokeStyle = C.inkMid; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke(); ctx.restore(); ctag('函数 → 一个实数', DX, DY + 190, { px: 24, a: g, color: C.inkMid }); } }
    // 求导：切线
    { const g = a * gin(T.e10 + 0.4); if (g > 0) { const cx = DX + 300, yb = DY - 10, f = u => yb + 40 - 70 * Math.sin(u * 2.4);
      ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, x = cx - 100 + u * 200; i ? ctx.lineTo(x, f(u)) : ctx.moveTo(x, f(u)); } ctx.stroke();
      const u0 = 0.35, x0 = cx - 100 + u0 * 200, y0 = f(u0), dy = -70 * 2.4 * Math.cos(u0 * 2.4) / 200; ctx.strokeStyle = C.j; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 - 80, y0 - 80 * dy); ctx.lineTo(x0 + 80, y0 + 80 * dy); ctx.stroke(); ctx.restore();
      ctag('和的导数 = 导数的和', DX + 300, DY + 190, { px: 22, a: g, color: C.inkMid }); } }
    ctag('微积分里的线性变换！', DX, DY + 280, { px: 36, a: a * gin(T.d2), color: OK, font: F.serif });
  }

  // ── F：核与像的定义 ──
  function blob(x, y, rx, ry, col, a, lab) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.16; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); if (lab) ctag(lab, x, y - ry - 26, { px: 34, a, color: col, font: F.serif }); }
  function shotKer() {
    const a = B.win(T.ker - 0.2, T.e11 - 0.3); if (a <= 0) return;
    const yb = DY + 30, xv = DX - 220, xw = DX + 220;
    blob(xv, yb, 170, 210, C.ink, a * gin(T.ker), 'V'); blob(xw, yb, 170, 210, C.ink, a * gin(T.ker), 'W');
    // 核：V 里一条线段 → W 的零向量
    const kg = a * gin(T.ker2); B.line2([xv - 90, yb + 110], [xv + 90, yb - 110], C.free, kg, 6); ctag('ker(L)', xv - 105, yb + 145, { px: 30, a: kg, color: C.free, font: F.serif });
    B.dot(xw - 60, yb + 80, 10, C.free, kg); ctag('0', xw - 60, yb + 115, { px: 28, a: kg, color: C.free, font: F.serif });
    for (const u of [-0.7, 0, 0.7]) { const p = [xv + 90 * u, yb - 110 * u]; arrow(ctx, [p[0] + 14, p[1]], [xw - 74, yb + 80], { color: C.free, width: 3, head: 14, alpha: kg * 0.8, grow: gin(T.ker2 + 0.3, 0.8) }); }
    // 值域
    const ig = a * gin(T.rng); ctx.save(); ctx.globalAlpha = ig * 0.3; ctx.fillStyle = C.j; ctx.beginPath(); ctx.ellipse(xw + 20, yb - 20, 110, 150, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctag('L(V)：值域', xw + 30, yb - 20, { px: 30, a: ig, color: C.j, font: F.serif });
    arrow(ctx, [xv + 60, yb - 160], [xw - 60, yb - 160], { color: C.ink, width: 5, head: 20, alpha: a * gin(T.ker) }); ctag('L', DX, yb - 190, { px: 34, a: a * gin(T.ker), color: C.ink, font: F.serif });
    texAt('ker', DX, DY - 360, 40, { alpha: a * gin(T.ker2) * (1 - gin(T.img - 0.2)), color: C.free });
    texAt('img', DX, DY - 360, 40, { alpha: a * gin(T.img) * (1 - gin(T.thm - 0.2)), color: C.j });
    ctag('定理 4.1.1：ker(L) 是 V 的子空间；L(S) 是 W 的子空间', DX, DY - 360, { px: 30, a: a * gin(T.thm), color: C.peri });
    const g = a * gin(T.prf); if (g > 0) { B.card(DX, DY + 320, 720, 110, g, C.peri); texAt('cl1', DX, DY + 295, 34, { alpha: g }); texAt('cl2', DX, DY + 345, 34, { alpha: a * gin(T.prf2) }); }
  }

  // ── G：例 11 ──
  function shotE11(D) {
    const a = B.win(T.e11 - 0.2, T.e12 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.e11 + 0.4, T.e11 + 2.0));
    const M = B.warp(P, [[1, 0], [0, 0]], s, a, D, { neu: 0.45 });
    ctx.save(); K2(D); P.line(ctx, [0, 0], [0, 1], { M: I2, color: C.free, width: 7, alpha: a * gin(T.e11k) }); P.line(ctx, [0, 0], [1, 0], { M: I2, color: C.i, width: 7, alpha: a * gin(T.e11r) }); ctx.restore();
    texAt('e11', DX, DY - 380, 44, { alpha: a });
    ctag('核：x₂ 轴（一维）', DX - 230, DY - 300, { px: 30, a: a * gin(T.e11k), color: C.free }); ctag('值域：x₁ 轴（一维）', DX + 230, DY - 300, { px: 30, a: a * gin(T.e11r), color: C.i });
    void M;
  }

  // ── H：例 12 ──
  const M12 = [[1, 1, 0], [0, 1, 1], [0, 0, 0]];
  const PTS = []; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) PTS.push([i * 0.6, j * 0.6, k * 0.6]);
  function shotE12(D) {
    const a = B.win(T.e12 - 0.2, T.d3 - 0.3); if (a <= 0) return;
    const alg = a * (1 - gin(T.e12v - 0.2, 0.5));
    if (alg > 0) {
      texAt('e12', DX, DY - 330, 44, { alpha: alg }); ctag('L: ℝ³ → ℝ²', DX, DY - 390, { px: 30, a: alg, color: C.peri });
      texAt('sys12', DX, DY - 220, 40, { alpha: alg * gin(T.e12 + 2.0) });
      texAt('sol12', DX, DY - 120, 40, { alpha: alg * gin(T.e12s) });
      const g = alg * gin(T.e12k); B.card(DX, DY - 10, 620, 90, g, C.free); texAt('k12', DX, DY - 10, 40, { alpha: g, color: C.free });
      ctag('S = Span{e₁, e₃}', DX, DY + 110, { px: 32, a: alg * gin(T.e12S), color: C.j });
      texAt('S12', DX, DY + 190, 40, { alpha: alg * gin(T.e12S + 1.2) }); texAt('LS12', DX, DY + 280, 44, { alpha: alg * gin(cue('C22', '所以S的像')), color: C.j });
    }
    const g3 = a * gin(T.e12v - 0.2, 0.5); if (g3 <= 0) return;
    const s = smoother(prog(B.t, T.e12v + 0.5, T.e12v + 2.8));
    const Ms = M12.map((r, i) => r.map((v, j) => lerp(i === j ? 1 : 0, v, s)));
    P3.reset();
    P3.setPlane(0, [0, 0, 1], { color: C.j, alpha: 0.25 * s, scale: 1 });
    P3.setLine(0, [1, -1, 1], { color: C.free, width: 7, alpha: 1 - 0.7 * s, grow: 1 });
    P3.setPoint(0, [0, 0, 0], { r: 0.1 + 0.06 * s, color: C.free });
    const V = B.show3D(P3, D, g3, { el: 24, az: -40 + 8 * Math.sin(B.t * 0.25), dist: 13, axesA: 0.7, floorA: 0.3 });
    for (const p of PTS) { const q = [0, 1, 2].map(i => Ms[i][0] * p[0] + Ms[i][1] * p[1] + Ms[i][2] * p[2]); const xy = V.pr(q); B.dot(xy[0], xy[1], 7, C.i, g3 * 0.85); }
    for (let k = -2; k <= 2; k++) { if (!k) continue; const p = [1, -1, 1].map(v => v * k * 0.5), q = [0, 1, 2].map(i => Ms[i][0] * p[0] + Ms[i][1] * p[1] + Ms[i][2] * p[2]); const xy = V.pr(q); B.dot(xy[0], xy[1], 10, C.free, g3); }
    ctag('ℝ³ → 平面（ℝ²）', DX, DY - 380, { px: 32, a: g3, color: C.j }); ctag('核直线 → 原点一个点', DX, DY - 330, { px: 32, a: g3 * gin(T.e12v + 2.0), color: C.free });
  }

  // ── I：对照第三章 ──
  function shotCmp() {
    const a = B.win(T.d3 - 0.2, T.e13 - 0.3); if (a <= 0) return;
    ctag('第三章的零空间、列空间？', DX, DY - 60, { px: 40, a: a * gin(T.d3 + 0.3) * (1 - gin(T.cmp - 0.2)), color: C.ink, font: F.serif });
    ctag('L(x) = Ax 时', DX, DY - 360, { px: 34, a: a * gin(T.cmp), color: C.peri });
    B.card(DX, DY - 230, 620, 100, a * gin(T.cmp + 0.3), C.free); texAt('kn', DX, DY - 230, 46, { alpha: a * gin(T.cmp + 0.3), color: C.free });
    B.card(DX, DY - 100, 620, 100, a * gin(T.cmp2), C.j); texAt('rg', DX, DY - 100, 44, { alpha: a * gin(T.cmp2), color: C.j });
    ctag('第三章的零空间、列空间', DX, DY + 0, { px: 28, a: a * gin(T.cmp2 + 0.6), color: C.inkMid });
    texAt('dim', DX, DY + 130, 42, { alpha: a * gin(T.rn), reveal: rv(T.rn, 1.4) });
    texAt('rn12', DX, DY + 240, 60, { alpha: a * gin(T.rn2), color: C.peri }); ctag('例 12', DX - 190, DY + 240, { px: 28, a: a * gin(T.rn2), color: C.inkMid });
  }

  // ── J：例 13 ──
  function shotE13() {
    const a = B.win(T.e13 - 0.2, T.tj - 0.3); if (a <= 0) return;
    texAt('e13', DX, DY - 360, 48, { alpha: a, color: C.peri }); ctag('求导', DX + 200, DY - 360, { px: 32, a, color: C.inkMid });
    const row = (y, items, t0, col) => items.forEach((s, i) => { const x = DX - 270 + i * 180, g = a * gin(t0 + 0.2 * i); B.card(x, y, 150, 74, g, col); ctag(s, x, y, { px: 30, a: g, color: C.ink, font: F.serif }); });
    ctag('P₃ = {ax² + bx + c}', DX, DY - 260, { px: 32, a: a * gin(T.e13 + 0.4), color: C.ink, font: F.serif });
    row(DY - 160, ['x²', 'x', '1', '5'], T.e13 + 0.6, C.inkMid);
    ctag('↓ D', DX - 360, DY - 75, { px: 30, a: a * gin(T.e13 + 1.2), color: C.ink });
    row(DY + 10, ['2x', '1', '0', '0'], T.e13 + 1.2, C.inkMid);
    texAt('k13', DX, DY + 170, 44, { alpha: a * gin(cue('C26', '核是P一')), color: C.free }); texAt('r13', DX, DY + 250, 44, { alpha: a * gin(T.e13r), color: C.j });
    ctag('1 + 2 = 3 = dim P₃ ✓', DX, DY + 340, { px: 36, a: a * gin(T.d4 + 1.0), color: OK });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照', DX, DY - 300, { px: 40, a, color: C.gpt, font: F.serif });
    B.card(DX, DY - 160, 640, 100, a * gin(T.tj + 0.5), C.gpt); texAt('tj1', DX, DY - 160, 44, { alpha: a * gin(T.tj + 0.5) });
    B.card(DX, DY - 30, 640, 100, a * gin(cue('G01', '值域')), C.gpt); texAt('tj2', DX, DY - 30, 44, { alpha: a * gin(cue('G01', '值域')) });
    ctag('名字不同，内容一样', DX, DY + 100, { px: 34, a: a * gin(cue('G01', '名字不同')), color: C.ink });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 320, { px: 40, a, color: C.peri, font: F.serif });
    ctag('核：被压没的部分', DX, DY - 200, { px: 38, a: a * gin(T.sum + 0.3), color: C.free }); ctag('值域：剩下撑开的部分', DX, DY - 100, { px: 38, a: a * gin(cue('C27', '值域')), color: C.j });
    texAt('dim', DX, DY + 40, 40, { alpha: a * gin(cue('C27', '两者维数')) });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('标准矩阵', DX, DY - 20, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('盯住 î 和 ĵ', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.e5 - 0.2, t1: T.p - 0.3, head: 'n 维 → m 维', items: [['例 5：ℝ² → ℝ¹', T.e5], ['例 7：ℝ² → ℝ³', T.e7], ['L(x) = Ax：矩阵即变换', T.LA, { color: C.peri, mark: C.peri }]] },
    { t0: T.p - 0.3, t1: T.e8 - 0.3, head: '三条性质', items: [['L(0) = 0', T.p], ['保持组合', T.p2], ['L(−v) = −L(v)', T.p3], ['(i) 最快排除', T.p1, { color: C.free, mark: C.free }]] },
    { t0: T.e8 - 0.3, t1: T.ker - 0.3, head: '更多例子', items: [['恒等', T.e8], ['积分', T.e9], ['求导', T.e10]] },
    { t0: T.ker - 0.3, t1: T.e11 - 0.3, head: '核与像', items: [['ker(L)', T.ker2, { color: C.free, mark: C.free }], ['L(S)、值域', T.img, { color: C.j, mark: C.j }], ['都是子空间', T.thm]] },
    { t0: T.e11 - 0.3, t1: T.d3 - 0.3, head: '例 11、12', items: [['投影：各一维', T.e11], ['核：一条直线', T.e12k, { color: C.free, mark: C.free }], ['L(S) = ℝ²', T.e12S, { color: C.j, mark: C.j }]] },
    { t0: T.d3 - 0.3, t1: T.tj - 0.3, head: '接上第三章', items: [['核 = N(A)', T.cmp], ['值域 = 列空间', T.cmp2], ['维数相加', T.rn], ['例 13：1 + 2 = 3', T.e13]] },
    { t0: T.tj - 0.3, t1: T.end - 0.3, head: '小结', items: [['同济：T⁻¹(0)、T(Vₙ)', T.tj], ['核 + 值域 = 输入维数', T.sum, { color: OK, mark: OK }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotE5(D); shotE7(D); shotQ(); shotProp(); shotEx(); shotKer(); shotE11(D); shotE12(D); shotCmp(); shotE13(); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
