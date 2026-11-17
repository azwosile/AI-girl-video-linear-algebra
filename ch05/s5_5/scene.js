// 第 5 章 5.5 标准正交基与正交矩阵（Leon 9th §5.5）。
// 分镜：标准基 → 定义 → 例 1（3D 三根互相垂直的箭头）→ 定理 5.5.1 → 例 2 单位化（箭头缩到单位长）
//       → 定理 5.5.2：斜放的标准正交轴，v 往两轴投影 = 坐标 → 帕塞瓦尔 → 例 5：sin²x 分解曲线 + 直角三角形 3/4
//       → 正交矩阵：网格刚性旋转、翻转（保长保角）→ 置换矩阵 → 最小二乘 x̂ = Aᵀb → 投影 UUᵀ（3D 点压到 xy 平面，例 7）→ TB8 系数条 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.5 标准正交基', hi: 3, en: 'ORTHONORMAL SETS',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C03: 0.6, C06: 0.6, C09: 0.6, C11: 0.6, C14: 0.6, C15: 0.6, C18: 0.6, G01: 0.6, C19: 0.6 },
    post: { C01: 0.6, C03: 1.0, C04: 1.0, C05: 1.2, C07: 1.6, C08: 1.0, C10: 1.6, C12: 0.8, C13: 2.0, C14: 1.0, C16: 1.0, C17: 1.6, C18: 1.2, G02: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, def: L('C02').s, def2: cue('C02', '再加上'), e1: L('C03').s, e1b: cue('C03', '两两点积'), li: L('C04').s, li2: cue('C04', '和v j做内积'), e2: L('C05').s,
    co: L('C06').s, co2: cue('C06', 'v的第i个坐标'), d1: L('D01').s, cov: L('C07').s, cov2: cue('C07', '看画面'), pa: L('C08').s, pa2: cue('C08', '还有帕塞瓦尔'),
    e5: L('C09').s, e5b: cue('C09', '也可以写成'), e5n: L('C10').s, e5p: cue('C10', '用帕塞瓦尔'), e5r: cue('C10', '所以sine'), d2: L('D02').s,
    qm: L('C11').s, qm2: cue('C11', '定理五点五点五'), inv: L('C12').s, rot: cue('C12', '例六'), gr: L('C13').s, gr2: cue('C13', '或者翻转'), gr3: cue('C13', 'Q x和Q y'),
    pm: L('C14').s, pm2: cue('C14', '右乘换列'), ls: L('C15').s, ls2: cue('C15', '正规方程'), ps: L('C16').s, ps2: cue('C16', '它就是'), uu: L('C17').s, e7: cue('C17', '例七'),
    tb: L('C18').s, tb2: cue('C18', '内积等于'), tb3: cue('C18', 'x的长度'), d3: L('D03').s, tj: L('G01').s, tj2: L('G02').s, tj3: cue('G02', '两条常考'), sum: L('C19').s, end: L('C20').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.def, 0.3); TL.sfx('pop', T.def2, 0.3); TL.sfx('whoosh', T.e1, 0.3); TL.sfx('check', T.e1b + 1.0, 0.3); TL.sfx('pop', T.li, 0.3); TL.sfx('warp', T.e2, 0.3);
  TL.sfx('shimmer', T.co, 0.35); TL.sfx('pluck', T.d1, 0.3); TL.sfx('whoosh', T.cov2, 0.3); TL.sfx('pop', T.pa, 0.3); TL.sfx('pop', T.pa2, 0.3);
  TL.sfx('whoosh', T.e5, 0.3); TL.sfx('pop', T.e5b, 0.3); TL.sfx('pop', T.e5p, 0.3); TL.sfx('ding_hi', T.e5r + 1.0, 0.35); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('pop', T.qm, 0.3); TL.sfx('pop', T.qm2, 0.3); TL.sfx('pop', T.inv, 0.3); TL.sfx('warp', T.gr, 0.35); TL.sfx('warp', T.gr2, 0.35); TL.sfx('ding', T.gr3, 0.3); TL.sfx('pop', T.pm, 0.3);
  TL.sfx('pop', T.ls, 0.3); TL.sfx('ding', T.ls2, 0.3); TL.sfx('pop', T.ps, 0.3); TL.sfx('whoosh', T.e7, 0.3); TL.sfx('pop', T.tb, 0.3); TL.sfx('ding_hi', T.tb3 + 1.5, 0.32); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj3, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C20').e + 0.3, 0.4);

  let P3 = null;
  // ── A：例 1–2（3D）──
  const V1 = [[1, 1, 1], [2, 1, -3], [4, -5, 1]], cols = [C.i, C.j, C.k];
  function shotA(D) {
    const a = B.win(T.o1 + 0.1, T.co - 0.3); if (a <= 0 || !P3) return;
    const go = a * (1 - gin(T.def - 0.2)); ctag('标准基：互相垂直，长度为一', DX, DY - 360, { px: 34, a: go * gin(T.o1 + 0.5), color: C.ink, font: F.serif });
    P3.reset();
    const V = B.show3D(P3, D, a, { el: 22, az: -40 + 10 * Math.sin(B.t * 0.18), dist: 13, axesA: 0.5 * (1 - gin(T.e1) * 0.6), floorA: 0.25 });
    const gs = a * (1 - gin(T.e1 - 0.2)); [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((e, i) => V.v3([0, 0, 0], e.map(v => v * 1.6), { color: cols[i], alpha: gs * gin(T.o1 + 0.5 + i * 0.3) }));
    texAt('def', DX, DY - 370, 34, { alpha: a * gin(T.def) * (1 - gin(T.e1 - 0.2)) }); ctag('正交组', DX - 200, DY + 360, { px: 30, a: a * gin(T.def) * (1 - gin(T.e1 - 0.2)), color: C.i }); ctag('+ 长度为一 = 标准正交组', DX + 120, DY + 360, { px: 30, a: a * gin(T.def2) * (1 - gin(T.e1 - 0.2)), color: OK });
    const g1 = a * gin(T.e1); if (g1 <= 0) return;
    const u = smoother(prog(B.t, T.e2 + 0.5, T.e2 + 2.0));
    V1.forEach((v, i) => { const n = Math.hypot(...v), k = lerp(0.42, 1.8 / n, u), e = v.map(x => x * k); V.v3([0, 0, 0], e, { color: cols[i], alpha: g1 * gin(T.e1 + 0.4 + i * 0.4) }); V.lab(e.map(x => x * 1.18), u > 0.5 ? `v${'₁₂₃'[i]}/√${[3, 14, 42][i]}` : `v${'₁₂₃'[i]}`, { px: 26, a: g1 * gin(T.e1 + 0.4 + i * 0.4), color: cols[i], font: F.serif }); });
    texAt('e1', DX, DY - 370, 30, { alpha: g1 * (1 - gin(T.li - 0.2)) });
    ctag('vᵢᵀvⱼ = 0 ✓', DX + 300, DY + 300, { px: 30, a: g1 * gin(T.e1b + 1.0) * (1 - gin(T.li - 0.2)), color: OK });
    const gl = a * gin(T.li) * (1 - gin(T.e2 - 0.2)); ctag('定理 5.5.1  正交组 ⇒ 线性无关', DX, DY - 380, { px: 28, a: gl, color: C.peri, font: F.serif }); texAt('li', DX, DY + 340, 30, { alpha: gl * gin(T.li2) });
    const g2 = a * gin(T.e2); ctag('例 2  除以各自长度', DX, DY - 380, { px: 28, a: g2, color: C.peri, font: F.serif }); texAt('e2', DX, DY + 340, 34, { alpha: g2 });
  }

  // ── B：坐标 = 内积 ──
  const P = new Plane({ ox: DX - 120, oy: DY + 170, u: 80, R: 8 });
  const th = 0.5, U1 = [Math.cos(th), Math.sin(th)], U2 = [-Math.sin(th), Math.cos(th)], Vv = [3.2, 3.6];
  function shotB(D) {
    const a = B.win(T.co - 0.2, T.e5 - 0.3); if (a <= 0) return;
    B.grid(P, I2, a * 0.6, D, { old: 0.1, neu: 0, basis: false });
    B.lineD(P, D, U1, a * 0.6, { color: C.i, width: 2 }); B.lineD(P, D, U2, a * 0.6, { color: C.j, width: 2 });
    arrow(ctx, P.S([0, 0]), P.S(U1), { color: C.i, width: 9, head: 22, alpha: a }); arrow(ctx, P.S([0, 0]), P.S(U2), { color: C.j, width: 9, head: 22, alpha: a });
    ctag('u₁', ...P.S([U1[0] + 0.1, U1[1] - 0.45]), { px: 30, a, color: C.i, font: F.serif }); ctag('u₂', ...P.S([U2[0] - 0.4, U2[1]]), { px: 30, a, color: C.j, font: F.serif });
    arrow(ctx, P.S([0, 0]), P.S(Vv), { color: C.ink, width: 8, head: 24, alpha: a * gin(T.co + 0.4) }); ctag('v', ...P.S([Vv[0] + 0.3, Vv[1] + 0.3]), { px: 32, a: a * gin(T.co + 0.4), color: C.ink, font: F.serif });
    const gp = gin(T.cov2, 1.0);
    const c1 = Vv[0] * U1[0] + Vv[1] * U1[1], c2 = Vv[0] * U2[0] + Vv[1] * U2[1];
    B.proj(P, Vv, U1, a * gp, { grow: gp, pCol: C.i, zCol: C.inkMid }); B.proj(P, Vv, U2, a * gin(T.cov2 + 0.8), { grow: gin(T.cov2 + 0.8, 1.0), pCol: C.j, zCol: C.inkMid });
    ctag(`c₁ = ${c1.toFixed(2)}`, ...P.S([c1 * U1[0] + 0.6, c1 * U1[1] - 0.6]), { px: 28, a: a * gin(T.cov2 + 1.0), color: C.i, font: F.serif });
    ctag(`c₂ = ${c2.toFixed(2)}`, ...P.S([c2 * U2[0] - 0.9, c2 * U2[1] + 0.2]), { px: 28, a: a * gin(T.cov2 + 1.8), color: C.j, font: F.serif });
    const gc = a * gin(T.co2); B.card(DX + 120, DY - 340, 560, 90, gc, C.peri); texAt('coord', DX + 120, DY - 340, 34, { alpha: gc });
    ctag('不用消元！', DX + 320, DY - 250, { px: 34, a: a * gin(T.d1), color: C.ds, font: F.serif });
    const g3 = a * gin(T.pa); texAt('pars', DX + 120, DY + 360, 32, { alpha: g3, reveal: rv(T.pa, T.pa2 + 1.5 - T.pa) });
    ctag(`c₁² + c₂² = ${(c1 * c1 + c2 * c2).toFixed(2)} = ‖v‖²`, DX + 250, DY - 170, { px: 28, a: a * gin(T.pa2 + 1.0), color: OK, font: F.serif });
  }

  // ── C：例 5 sin⁴ ──
  const Pf = new Plane({ ox: DX - 40, oy: DY + 40, u: 95, R: 5 });
  function shotC(D) {
    const a = B.win(T.e5 - 0.2, T.qm - 0.3); if (a <= 0) return;
    const gc = a * (1 - gin(T.e5p - 0.2));
    if (gc > 0) {
      ctx.save(); B.K.clip(D); B.line2(Pf.S([-4, 0]), Pf.S([4, 0]), C.ink, gc * 0.7, 2); ctx.restore();
      B.curve(Pf, D, x => Math.sin(x) ** 2, -Math.PI, Math.PI, gc * gin(T.e5 + 0.4), { color: C.i, width: 6 });
      B.curve(Pf, D, () => 0.5, -Math.PI, Math.PI, gc * gin(T.e5 + 2.5), { color: C.j, width: 3, dash: [10, 8] }); B.curve(Pf, D, x => -0.5 * Math.cos(2 * x), -Math.PI, Math.PI, gc * gin(T.e5 + 3.2), { color: C.k, width: 3, dash: [10, 8] });
      ctag('sin²x', ...Pf.S([-2.4, 1.3]), { px: 30, a: gc * gin(T.e5 + 0.4), color: C.i, font: F.serif }); ctag('1/2', ...Pf.S([3.6, 0.5]), { px: 26, a: gc * gin(T.e5 + 2.5), color: C.j }); ctag('−½cos2x', ...Pf.S([0, -0.85]), { px: 26, a: gc * gin(T.e5 + 3.2), color: C.k });
      texAt('e5', DX, DY - 330, 34, { alpha: gc * gin(T.e5b) });
      ctag('1/√2 与 cos2x：标准正交组（权 1/π）', DX, DY + 300, { px: 28, a: gc * gin(T.e5n), color: OK });
    }
    const gt = a * gin(T.e5p); if (gt > 0) {
      // 直角三角形：直角边 1/√2、1/2
      const S = 520, O = [DX - 230, DY + 200], Aq = [O[0] + S * Math.SQRT1_2, O[1]], Bq = [O[0] + S * Math.SQRT1_2, O[1] - S * 0.5];
      B.line2(O, Aq, C.j, gt, 7); B.line2(Aq, Bq, C.k, gt, 7); B.line2(O, Bq, C.peri, gt * gin(T.e5p + 1.0), 7); B.rightMark(Aq, [-1, 0], [0, -1], gt);
      ctag('1/√2', (O[0] + Aq[0]) / 2, O[1] + 34, { px: 30, a: gt, color: C.j, font: F.serif }); ctag('1/2', Aq[0] + 50, (Aq[1] + Bq[1]) / 2, { px: 30, a: gt, color: C.k, font: F.serif });
      ctag('‖sin²x‖² = 1/2 + 1/4 = 3/4', DX, DY - 330, { px: 34, a: gt * gin(T.e5p + 1.0), color: C.peri, font: F.serif });
      const gr = a * gin(T.e5r); B.card(DX, DY - 220, 760, 100, gr, OK); texAt('e5r', DX, DY - 220, 30, { alpha: gr });
      ctag('积分 → 勾股定理！', DX + 260, DY + 100, { px: 34, a: a * gin(T.d2), color: C.ds, font: F.serif });
    }
  }

  // ── D：正交矩阵 ──
  const P2 = new Plane({ ox: DX, oy: DY + 60, u: 70, R: 8 });
  const rotM = t => [[Math.cos(t), -Math.sin(t)], [Math.sin(t), Math.cos(t)]];
  function shotD(D) {
    const a = B.win(T.qm - 0.2, T.ls - 0.3); if (a <= 0) return;
    const pmA = gin(T.pm - 0.2);
    const gw = a * (1 - pmA);
    if (gw > 0) {
      const ang = 0.7 * smoother(prog(B.t, T.rot, T.rot + 1.5)) + (B.t > T.gr ? 0.6 * Math.sin((B.t - T.gr) * 0.8) : 0);
      const fl = smoother(prog(B.t, T.gr2, T.gr2 + 1.2)) * (1 - smoother(prog(B.t, T.gr3 + 2.5, T.gr3 + 3.7)));
      const R0 = rotM(ang), M = [[R0[0][0], R0[0][1] * (1 - 2 * fl)], [R0[1][0], R0[1][1] * (1 - 2 * fl)]];
      B.warp(P2, M, gin(T.qm, 0.8), gw, D, { square: true, labels: false });
      // 保长保角：两向量 + 夹角
      const x = [2.5, 1], y = [0.5, 2.6], Qx = [M[0][0] * x[0] + M[0][1] * x[1], M[1][0] * x[0] + M[1][1] * x[1]], Qy = [M[0][0] * y[0] + M[0][1] * y[1], M[1][0] * y[0] + M[1][1] * y[1]];
      const g3 = gw * gin(T.gr3); arrow(ctx, P2.S([0, 0]), P2.S(Qx), { color: C.peri, width: 7, head: 20, alpha: g3 }); arrow(ctx, P2.S([0, 0]), P2.S(Qy), { color: C.free, width: 7, head: 20, alpha: g3 });
      ctag('Qx', ...P2.S(Qx.map(v => v * 1.15)), { px: 28, a: g3, color: C.peri, font: F.serif }); ctag('Qy', ...P2.S(Qy.map(v => v * 1.15)), { px: 28, a: g3, color: C.free, font: F.serif });
      B.card(DX, DY - 360, 520, 90, gw * gin(T.qm2), C.peri); texAt('Q', DX, DY - 360, 38, { alpha: gw * gin(T.qm2) });
      texAt('rot', DX + 300, DY - 230, 30, { alpha: gw * gin(T.rot) * (1 - gin(T.gr3 - 0.2)) });
      ctag('不拉伸 · 不歪斜', DX - 260, DY - 250, { px: 30, a: gw * gin(T.gr + 0.5), color: OK });
      B.card(DX, DY + 360, 600, 80, g3, OK); texAt('pres', DX, DY + 360, 32, { alpha: g3 });
    }
    const gp = a * pmA; if (gp > 0) {
      ctag('置换矩阵 = 单位矩阵换列', DX, DY - 300, { px: 34, a: gp, color: C.peri, font: F.serif });
      texAt('perm', DX, DY - 120, 48, { alpha: gp });
      ctag('右乘：换列    左乘：换行', DX, DY + 60, { px: 32, a: a * gin(T.pm2), color: C.ink });
      ctag('Pᵀ = P⁻¹', DX, DY + 150, { px: 40, a: a * gin(T.pm2 + 1.0), color: OK, font: F.serif });
    }
  }

  // ── E：最小二乘 + 投影 UUᵀ（3D）──
  function shotE(D) {
    const a = B.win(T.ls - 0.2, T.tb - 0.3); if (a <= 0 || !P3) return;
    const g0 = a * (1 - gin(T.ps - 0.2)); if (g0 > 0) { texAt('ls', DX, DY - 100, 44, { alpha: g0 * gin(T.ls2) }); ctag('各列标准正交：AᵀA = I', DX, DY - 220, { px: 34, a: g0 * gin(T.ls + 0.4), color: C.peri, font: F.serif }); ctag('解方程 → 一次乘法', DX, DY + 20, { px: 30, a: g0 * gin(T.ls2 + 1.5), color: OK }); }
    const g = a * gin(T.ps); if (g <= 0) return;
    P3.reset(); P3.setPlane(0, [0, 0, 1], { color: C.j, alpha: 0.3, scale: gin(T.ps, 0.8) });
    const bb = [5, 3, 4].map(v => v * 0.42), pp = [bb[0], bb[1], 0], dn = gin(T.e7 + 1.0, 1.2);
    P3.setPoint(0, bb, { r: 0.09, color: C.i, alpha: g }); P3.setPoint(1, [bb[0], bb[1], bb[2] * (1 - dn)], { r: 0.08, color: C.peri, alpha: g * gin(T.e7 + 1.0) });
    const V = B.show3D(P3, D, g, { el: 24, az: -35 + 8 * Math.sin(B.t * 0.2), dist: 13, axesA: 0.5, floorA: 0 });
    V.v3([0, 0, 0], [1.4, 0, 0], { color: C.i, alpha: g }); V.v3([0, 0, 0], [0, 1.4, 0], { color: C.j, alpha: g }); V.lab([1.4, -0.3, 0.25], 'u₁', { px: 26, a: g, color: C.i }); V.lab([-0.3, 1.4, 0.25], 'u₂', { px: 26, a: g, color: C.j });
    V.v3([0, 0, 0], bb, { color: C.ink, alpha: g }); V.lab(bb.map(v => v * 1.1), 'b = (5, 3, 4)', { px: 26, a: g, color: C.ink });
    if (dn > 0) { B.line2(V.pr(bb), V.pr([bb[0], bb[1], bb[2] * (1 - dn)]), C.free, g, 4, [8, 6]); V.lab([pp[0] + 0.3, pp[1] + 0.3, -0.3], 'p = (5, 3, 0)', { px: 26, a: g * gin(T.e7 + 2.2), color: C.peri }); }
    texAt('pS', DX, DY - 370, 32, { alpha: g * (1 - gin(T.uu - 0.2)) }); ctag('= S 里离 b 最近的点', DX, DY - 300, { px: 28, a: g * gin(T.ps2) * (1 - gin(T.uu - 0.2)), color: OK });
    const gu = a * gin(T.uu); B.card(DX, DY - 360, 340, 80, gu, C.peri); texAt('UU', DX, DY - 360, 40, { alpha: gu });
    texAt('e7', DX, DY + 350, 28, { alpha: a * gin(T.e7) });
  }

  // ── F：TB8 ──
  function shotF() {
    const a = B.win(T.tb - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('测验 B · 第 8 题', DX, DY - 390, { px: 32, a, color: C.peri, font: F.serif });
    texAt('tb8', DX, DY - 320, 32, { alpha: a * gin(T.tb + 0.3) });
    const X = [2, -2, 1], Y = [3, 1, -4];
    for (let i = 0; i < 3; i++) {
      const x0 = DX - 260 + i * 260, g = a * gin(T.tb + 0.8 + i * 0.3);
      ctag(`u${'₁₂₃'[i]}`, x0, DY + 120, { px: 30, a: g, color: [C.i, C.j, C.k][i], font: F.serif });
      [[X[i], C.peri, -40], [Y[i], C.free, 40]].forEach(([v, col, dx]) => { ctx.save(); ctx.globalAlpha = g * 0.85; ctx.fillStyle = col; ctx.fillRect(x0 + dx - 30, DY + 80 - Math.max(0, v) * 40, 60, Math.abs(v) * 40); ctx.restore(); ctag(String(v).replace('-', '−'), x0 + dx, DY + 80 - v * 40 + (v >= 0 ? -22 : 22), { px: 26, a: g, color: col }); });
      ctag(String(X[i] * Y[i]).replace('-', '−'), x0, DY + 180, { px: 32, a: a * gin(T.tb2 + i * 0.4), color: C.ink, font: F.serif });
    }
    B.line2([DX - 400, DY + 80], [DX + 400, DY + 80], C.inkMid, a, 2);
    ctag('x', DX - 400, DY - 200, { px: 28, a, color: C.peri, font: F.serif }); ctag('y', DX - 360, DY - 200, { px: 28, a, color: C.free, font: F.serif });
    const gr = a * gin(T.tb3); B.card(DX, DY + 300, 700, 90, gr, OK); texAt('tb8r', DX, DY + 300, 32, { alpha: gr });
    ctag('系数直接乘、直接平方加！', DX, DY - 230, { px: 32, a: a * gin(T.d3), color: C.ds, font: F.serif });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照  第五章 §1', DX, DY - 340, { px: 36, a, color: C.gpt, font: F.serif });
    const g1 = a * gin(T.tj + 0.5); B.card(DX, DY - 230, 360, 90, g1, C.gpt); texAt('tj', DX, DY - 230, 40, { alpha: g1 });
    ctag('列（或行）：两两正交的单位向量', DX, DY - 150, { px: 28, a: a * gin(cue('G01', '并证明')), color: C.ink });
    ctag('y = Px（P 正交）：正交变换，保长度', DX, DY - 60, { px: 28, a: a * gin(T.tj2), color: C.ink });
    const g3 = a * gin(T.tj3); B.card(DX, DY + 60, 640, 90, g3, C.peri); texAt('tj2', DX, DY + 60, 34, { alpha: g3 }); ctag('常考', DX - 360, DY + 60, { px: 28, a: g3, color: C.peri });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    texAt('coord', DX, DY - 230, 34, { alpha: a * gin(T.sum + 0.3) });
    ctag('‖v‖² = Σcᵢ²', DX, DY - 150, { px: 34, a: a * gin(cue('C19', '长度平方')), color: C.ink, font: F.serif });
    texAt('Q', DX, DY - 60, 36, { alpha: a * gin(cue('C19', '正交矩阵')) });
    texAt('UU', DX, DY + 40, 38, { alpha: a * gin(cue('C19', '投影矩阵')) });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('格拉姆–施密特', DX, DY - 10, { px: 90, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('任给一组基，掰成标准正交基', DX, DY + 110, { px: 34, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.def - 0.2, t1: T.qm - 0.3, head: '标准正交基', items: [['正交组 / 标准正交组', T.def, { color: C.peri, mark: C.peri }], ['正交 ⇒ 无关', T.li], ['坐标 = 内积', T.co, { color: OK, mark: OK }], ['帕塞瓦尔', T.pa], ['∫sin⁴ = 3π/4', T.e5r]] },
    { t0: T.qm - 0.3, t1: T.end - 0.3, head: '正交矩阵与投影', items: [['QᵀQ = I', T.qm2, { color: C.peri, mark: C.peri }], ['保长度、保角度', T.gr3], ['置换矩阵', T.pm], ['p = UUᵀb', T.uu, { color: OK, mark: OK }], ['TB8：‖x‖ = 3', T.tb3], ['同济：det = ±1', T.tj3, { color: C.gpt, mark: C.gpt }]] },
  ];

  const P3c = await load3D(); P3 = new P3c(900, { R: 3 });
  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(D); shotD(D); shotE(D); shotF(); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
