// 第 5 章 5.3（上）最小二乘：把 b 投影到列空间（Leon 9th §5.3）。
// 分镜：构成主义星空：太阳、谷神星轨道弧、40 天观测点 → 消失 → 高斯预测弧、年底重现 → 超定方程 → 残差 r
//       → 3D：列空间平面、b、平面上游走的 Ax 与距离计 → 定理 5.3.1 勾股（直角三角形）→ r ∈ N(Aᵀ) → 正规方程 → 定理 5.3.2 / 投影矩阵
//       → 例 1：三条直线几乎共点 + 3D（b 很近、垂线很短）→ 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.3 最小二乘', hi: 3, en: 'LEAST SQUARES',
    titleEnd: () => B.L('C02').s,
    pre: { C03: 0.6, C05: 0.6, C06: 0.6, C09: 0.5, C11: 0.6, C13: 0.6, G01: 0.6, C17: 0.6 },
    post: { C02: 1.2, C04: 1.0, C05: 1.2, C07: 1.2, C08: 0.8, C09: 1.2, C11: 1.0, C12: 0.8, C14: 1.2, C15: 1.0, C16: 1.2, G02: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, o1b: cue('C01', '跟踪了四十天'), o1c: cue('C01', '它就躲进了'), gs: L('C02').s, gs2: cue('C02', '到了年底'), gs3: cue('C02', '他用的方法'),
    ov: L('C03').s, ov2: cue('C03', 'A x等于b'), d1: L('D01').s, res: L('C04').s, res2: cue('C04', 'r的长度平方'),
    geo: L('C05').s, geo2: cue('C05', '我们要在'), thm: L('C06').s, thm2: cue('C06', 'p最近'), pf: L('C07').s, pf2: cue('C07', 'b减y的长度平方'), pf3: cue('C07', '仅在y等于p'),
    rn: L('C08').s, rn2: cue('C08', '上一节刚学过'), ne: L('C09').s, ne2: cue('C09', '整理一下'), d2: L('D02').s, geoR: L('C10').s,
    uq: L('C11').s, uq2: cue('C11', '那么A转置A可逆'), pm: L('C12').s, pm2: cue('C12', '把中间'),
    e1: L('C13').s, e1n: L('C14').s, e1x: cue('C14', '解这个'), e1r: L('C15').s, e1r2: cue('C15', 'A转置乘r'), d3: L('D03').s, e1v: L('C16').s, e1v2: cue('C16', '看画面'),
    tj: L('G01').s, tj2: L('G02').s, sum: L('C17').s, end: L('C18').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('shimmer', T.o1 + 1.0, 0.3); TL.sfx('marimba', T.o1b, 0.25); TL.sfx('hum', T.o1c, 0.25); TL.sfx('laser', T.gs, 0.3); TL.sfx('ding_hi', T.gs2 + 1.0, 0.35);
  TL.sfx('pop', T.ov, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.res, 0.3); TL.sfx('whoosh', T.geo, 0.3); TL.sfx('shimmer', T.thm, 0.35); TL.sfx('pop', T.pf, 0.3); TL.sfx('ding', T.pf3, 0.3);
  TL.sfx('pop', T.rn, 0.3); TL.sfx('ding', T.rn2, 0.3); TL.sfx('shimmer', T.ne2, 0.4); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.uq, 0.3); TL.sfx('pop', T.pm2, 0.3);
  TL.sfx('pop', T.e1, 0.3); TL.sfx('pop', T.e1n, 0.3); TL.sfx('ding_hi', T.e1x + 1.0, 0.3); TL.sfx('check', T.e1r2 + 1.0, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('whoosh', T.e1v2, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  // ── A：谷神星 ──
  const stars = Array.from({ length: 70 }, (_, i) => { const r = Math.sqrt((i * 0.6180339) % 1) * 480, th = i * 2.39996; return [DX + r * Math.cos(th), DY + r * Math.sin(th), 1 + (i % 3), (i * 0.37) % 1]; });
  function shotA(D) {
    const a = B.win(T.o1 + 0.1, T.ov - 0.3); if (a <= 0) return;
    ctx.save(); K_clip(D);
    stars.forEach(([x, y, r, ph]) => { B.dot(x, y, r, C.ink, a * (0.35 + 0.3 * Math.sin(B.t * 1.3 + ph * 6))); });
    // 太阳
    const S = [DX - 60, DY + 40]; B.dot(...S, 46, C.peri, a * gin(T.o1 + 0.5)); ctx.restore();
    // 轨道（椭圆）
    const ell = th => [S[0] + 120 + 360 * Math.cos(th), S[1] + 250 * Math.sin(th)];
    const arc = (t0, t1, col, w, al, dash) => { if (al <= 0) return; ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); for (let i = 0; i <= 80; i++) { const p = ell(lerp(t0, t1, i / 80)); i ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); ctx.restore(); };
    // 40 天观测点（带噪声）
    const obs = Array.from({ length: 9 }, (_, i) => { const th = -0.4 - i * 0.07, p = ell(th); return [p[0] + Math.sin(i * 7.1) * 7, p[1] + Math.cos(i * 3.3) * 7]; });
    obs.forEach((p, i) => { const g = a * gin(T.o1b + i * 0.25); B.dot(...p, 7, C.i, g); });
    // 谷神星沿观测段移动，然后淡入太阳光
    const u = prog(B.t, T.o1b, T.o1c + 1.5), cur = ell(-0.4 - 0.63 * u);
    const ga = a * gin(T.o1b) * (1 - gin(T.o1c + 1.0, 0.8)); B.dot(...cur, 12, C.ink, ga);
    if (B.t > T.o1c) { ctx.save(); ctx.globalAlpha = a * 0.25 * gin(T.o1c); ctx.fillStyle = C.peri; ctx.beginPath(); ctx.arc(...S, 46 + 50 * gin(T.o1c, 1.5), 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    ctag('1801.1.1  谷神星', DX - 160, DY - 350, { px: 34, a: a * gin(T.o1 + 0.6), color: C.ink, font: F.serif });
    ctag('40 天', ...obs[4].map((v, i) => v + (i ? -40 : 30)), { px: 26, a: a * gin(T.o1b + 1.5), color: C.i });
    // 高斯预测弧
    arc(-1.03, -1.03 - 4.2 * gin(T.gs + 0.5, 3.0), C.peri, 4, a * gin(T.gs + 0.5), [12, 10]);
    ctag('高斯 · 最小二乘', DX + 230, DY + 340, { px: 34, a: a * gin(T.gs3), color: C.peri, font: F.serif });
    const re = ell(-5.23), gr = a * gin(T.gs2 + 1.0); B.dot(...re, 14, C.ink, gr); if (gr > 0) { ctx.save(); ctx.globalAlpha = gr; ctx.strokeStyle = OK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(...re, 30 + 10 * Math.sin(B.t * 4), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); ctag('年底：重新找到', re[0] + 10, re[1] - 56, { px: 28, a: gr, color: OK }); }
  }
  const K_clip = (D) => B.K.clip(D);

  // ── B：超定 + 残差（2D 三条直线示意）──
  const P = new Plane({ ox: DX - 40, oy: DY + 140, u: 70, R: 7 });
  function shotB(D) {
    const a = B.win(T.ov - 0.2, T.geo - 0.3); if (a <= 0) return;
    texAt('over', DX, DY - 380, 38, { alpha: a * gin(T.ov + 0.3) });
    B.grid(P, I2, a * 0.8, D, { old: 0.1, neu: 0.16, basis: false, clipY: DY - 300 });
    const lines = [[[1, 1], 3, C.i], [[-2, 3], 1, C.j], [[2, -1], 2, C.k]];
    lines.forEach(([n, c, col], i) => { const g = a * gin(T.ov2 + i * 0.3); const p0 = [n[0] * c / (n[0] ** 2 + n[1] ** 2), n[1] * c / (n[0] ** 2 + n[1] ** 2)]; B.lineD(P, D, [-n[1], n[0]], g, { p0, color: col, width: 4 }); });
    // 三角小区域 + 最佳点
    const X = [83 / 50, 71 / 50]; const gx = a * gin(T.res + 0.5); B.dot(...P.S(X), 10, C.peri, gx); ctag('x̂', P.S(X)[0] + 26, P.S(X)[1] + 26, { px: 30, a: gx, color: C.peri, font: F.serif });
    ctag('无解：三条线不共点', DX + 240, DY - 290, { px: 28, a: a * gin(T.ov2 + 1.2), color: C.free });
    const gr = a * gin(T.res); B.card(DX, DY + 330, 760, 90, gr, C.free); texAt('res', DX, DY + 330, 32, { alpha: gr, reveal: rv(T.res + 0.2, 1.5) });
    ctag('平方和最小 → “最小二乘”', DX + 220, DY + 250, { px: 28, a: a * gin(T.res2), color: C.inkMid });
  }

  // ── C：3D 列空间 + 定理 5.3.1 + 正规方程 ──
  let P3 = null;
  const a1 = [1, -2, 2], a2 = [1, 3, -1], nA = [-4, 3, 5];
  const sc3 = 0.62, bb = [3, 1, 2].map(v => v * sc3), rr = [-4, 3, 5].map(v => v / 50 * sc3);
  function scene3(D, a, { bExag = 1, walk = 0, tri = 0, rA = 0, cam = {} } = {}) {
    P3.reset();
    P3.setPlane(0, nA, { color: C.j, alpha: 0.3, scale: gin(T.geo, 0.8) });
    const r = rr.map(v => v * bExag), p = bb.map((v, i) => v - rr[i]), b = p.map((v, i) => v + r[i]);
    P3.setPoint(0, b, { r: 0.09, color: C.i, alpha: a }); P3.setPoint(1, p, { r: 0.08, color: C.peri, alpha: a * gin(T.thm) });
    const V = B.show3D(P3, D, a, { el: 18, az: -62 + 10 * Math.sin(B.t * 0.15), dist: 13, axesA: 0.45, floorA: 0.15, ...cam });
    V.v3([0, 0, 0], b, { color: C.i, alpha: a }); V.lab(b.map(v => v * 1.15), 'b', { px: 34, a, color: C.i, font: F.serif });
    // A 的两列
    V.v3([0, 0, 0], a1.map(v => v * 0.9), { color: C.ink, alpha: a * 0.8, width: 5 }); V.v3([0, 0, 0], a2.map(v => v * 0.9), { color: C.ink, alpha: a * 0.8, width: 5 });
    V.lab(a1.map(v => v * 1.05), 'a₁', { px: 26, a: a * 0.8, color: C.ink }); V.lab(a2.map(v => v * 1.05), 'a₂', { px: 26, a: a * 0.8, color: C.ink });
    V.lab([2.2, 1.6, 0.6], 'R(A)', { px: 30, a, color: C.j, font: F.serif });
    // 游走的 Ax
    if (walk > 0) {
      const u = B.t * 0.8, q = p.map((v, i) => v + (a1[i] * Math.cos(u) * 0.5 + a2[i] * Math.sin(u * 1.3) * 0.5) * (1 - gin(T.thm + 0.4)));
      const Q = V.pr(q), Bp = V.pr(b); B.line2(Q, Bp, C.free, a * walk, 3, [8, 8]); B.dot(...Q, 10, C.ink, a * walk); B.tag('Ax', Q[0] + 16, Q[1] + 20, { px: 26, a: a * walk, color: C.ink });
      const d = Math.hypot(...q.map((v, i) => v - b[i])); B.meter(DX, DY + 380, 420, d / sc3, 3, a * walk * (1 - gin(T.pf)), { label: '‖b − Ax‖', fmt: v => v.toFixed(2) });
    }
    if (tri > 0) { const pp = V.pr(p), Bp = V.pr(b); B.line2(pp, Bp, C.free, a * tri, 5); B.rightMark(pp, [V.pr([0, 0, 0])[0] - pp[0], V.pr([0, 0, 0])[1] - pp[1]], [Bp[0] - pp[0], Bp[1] - pp[1]], a * tri, { color: OK }); B.tag('r = b − p', (pp[0] + Bp[0]) / 2 + 20, (pp[1] + Bp[1]) / 2, { px: 26, a: a * tri, color: C.free }); B.tag('p', pp[0] + 14, pp[1] + 26, { px: 30, a: a * tri, color: C.peri, font: F.serif }); }
    if (rA > 0) { const rr2 = nA.map(v => v / Math.hypot(...nA) * 1.4); V.v3([0, 0, 0], rr2, { color: C.free, alpha: a * rA }); V.lab(rr2.map(v => v * 1.15), 'N(Aᵀ)', { px: 28, a: a * rA, color: C.free, font: F.serif }); }
    return V;
  }
  function shotC(D) {
    const a = B.win(T.geo - 0.2, T.e1 - 0.3); if (a <= 0 || !P3) return;
    const exag = 1 + 14 * (1 - gin(T.e1 - 0.6, 0.6));
    scene3(D, a, { bExag: exag, walk: gin(T.geo2) * (1 - gin(T.thm + 0.6)), tri: gin(T.thm2), rA: gin(T.rn2) });
    const g1 = a * gin(T.thm) * (1 - gin(T.rn - 0.2)); ctag('定理 5.3.1', DX, DY - 395, { px: 28, a: g1, color: C.peri, font: F.serif });
    B.card(DX, DY - 330, 330, 80, g1 * gin(T.thm2), OK); texAt('perp', DX, DY - 330, 40, { alpha: g1 * gin(T.thm2) });
    texAt('thm1', DX, DY + 360, 32, { alpha: a * gin(T.pf2) * (1 - gin(T.rn - 0.2)) }); ctag('仅当 y = p 时最小', DX + 300, DY + 300, { px: 26, a: a * gin(T.pf3) * (1 - gin(T.rn - 0.2)), color: OK });
    const g2 = a * gin(T.rn) * (1 - gin(T.uq - 0.2)); texAt('rn', DX, DY - 360, 38, { alpha: g2 });
    texAt('ne0', DX, DY + 280, 36, { alpha: g2 * gin(T.ne) });
    const g3 = a * gin(T.ne2); B.card(DX, DY + 370, 460, 90, g3, C.peri); texAt('ne', DX, DY + 370, 42, { alpha: g3 });
    ctag('别忘了：残差 ⊥ 列空间', DX, DY - 290, { px: 28, a: a * gin(T.geoR) * (1 - gin(T.uq - 0.2)), color: OK });
    const g4 = a * gin(T.uq); ctag('定理 5.3.2  rank A = n', DX, DY - 395, { px: 28, a: g4, color: C.peri, font: F.serif }); texAt('uniq', DX, DY - 330, 38, { alpha: g4 * gin(T.uq2) });
    texAt('P', DX, DY + 280, 32, { alpha: a * gin(T.pm) });
  }

  // ── D：例 1 ──
  const P2 = new Plane({ ox: DX - 220, oy: DY + 150, u: 95, R: 5 });
  function shotD(D) {
    const a = B.win(T.e1 - 0.2, T.tj - 0.3); if (a <= 0 || !P3) return;
    const g2d = a * (1 - gin(T.e1v2 - 0.2));
    if (g2d > 0) {
      texAt('e1', DX - 260, DY - 340, 30, { alpha: g2d * gin(T.e1 + 0.3) });
      texAt('e1A', DX + 170, DY - 340, 30, { alpha: g2d * gin(T.e1 + 1.5) });
      texAt('e1n', DX + 120, DY - 210, 30, { alpha: g2d * gin(T.e1n) });
      const gx = g2d * gin(T.e1x); B.card(DX + 160, DY - 90, 420, 90, gx, C.peri); texAt('e1x', DX + 160, DY - 90, 36, { alpha: gx });
      const gr = g2d * gin(T.e1r); texAt('e1r', DX + 60, DY + 20, 30, { alpha: gr });
      B.stamp(DX + 340, DY + 120, true, gin(T.e1r2 + 1.0, 0.4), g2d * gin(T.e1r2 + 1.0), '⊥');
      // 三直线缩略
      const gl = g2d * gin(T.e1 + 0.6); ctx.save(); ctx.beginPath(); ctx.rect(DX - 470, DY + 60, 380, 300); ctx.clip();
      const PP = new Plane({ ox: DX - 280 - 1.66 * 60, oy: DY + 210 + 1.42 * 60, u: 60, R: 6 });
      [[[1, 1], 3, C.i], [[-2, 3], 1, C.j], [[2, -1], 2, C.k]].forEach(([n, c, col]) => { const p0 = [n[0] * c / (n[0] ** 2 + n[1] ** 2), n[1] * c / (n[0] ** 2 + n[1] ** 2)]; const d = [-n[1], n[0]]; B.line2(PP.S([p0[0] - d[0] * 5, p0[1] - d[1] * 5]), PP.S([p0[0] + d[0] * 5, p0[1] + d[1] * 5]), col, gl, 4); });
      B.dot(...PP.S([83 / 50, 71 / 50]), 9, C.peri, g2d * gin(T.e1x)); ctx.restore();
      ctag('快要共点', DX - 280, DY + 380, { px: 28, a: g2d * gin(T.d3), color: C.ds });
    }
    const g3 = a * gin(T.e1v2); if (g3 > 0) { scene3(D, g3, { tri: 1, cam: { dist: 10 } }); ctag('b 离平面很近，垂线很短', DX, DY - 380, { px: 32, a: g3, color: OK, font: F.serif }); }
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照', DX, DY - 330, { px: 36, a, color: C.gpt, font: F.serif });
    ctag('正文不讲最小二乘', DX, DY - 240, { px: 30, a: a * gin(T.tj + 0.5), color: C.inkMid });
    ctag('→ 数值分析 / 概率统计', DX, DY - 180, { px: 28, a: a * gin(T.tj + 1.5), color: C.inkMid });
    const g = a * gin(T.tj2); B.card(DX, DY - 30, 520, 110, g, C.gpt); texAt('ne', DX, DY - 30, 44, { alpha: g }); ctag('考试只记这一句', DX, DY + 60, { px: 28, a: g, color: C.gpt });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    ctag('无解 → 把 b 投影到列空间', DX, DY - 230, { px: 32, a: a * gin(T.sum + 0.3), color: C.ink });
    texAt('rn', DX, DY - 140, 36, { alpha: a * gin(cue('C17', '残差垂直')) });
    B.card(DX, DY - 40, 460, 90, a * gin(cue('C17', '得到正规方程')), C.peri); texAt('ne', DX, DY - 40, 42, { alpha: a * gin(cue('C17', '得到正规方程')) });
    ctag('各列无关 → 唯一', DX, DY + 60, { px: 30, a: a * gin(cue('C17', '各列无关')), color: OK });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('数据拟合', DX, DY - 10, { px: 100, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('直线、抛物线，一招搞定', DX, DY + 110, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.ov - 0.3, t1: T.e1 - 0.3, head: '最小二乘', items: [['m > n：通常无解', T.ov], ['min ‖b − Ax‖', T.res, { color: C.free, mark: C.free }], ['最近点 ⇔ 垂直', T.thm], ['r ∈ N(Aᵀ)', T.rn], ['AᵀAx̂ = Aᵀb', T.ne2, { color: C.peri, mark: C.peri }], ['投影矩阵 P', T.pm]] },
    { t0: T.e1 - 0.3, t1: T.end - 0.3, head: '例 1 与对照', items: [['3 方程 2 未知数', T.e1], ['x̂ = (83/50, 71/50)', T.e1x, { color: C.peri, mark: C.peri }], ['Aᵀr = 0 ✓', T.e1r2, { color: OK, mark: OK }], ['同济：正规方程', T.tj, { color: C.gpt, mark: C.gpt }]] },
  ];

  const P3c = await load3D(); P3 = new P3c(900, { R: 3 });
  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(D); shotD(D); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
