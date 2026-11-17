// 第 5 章 5.1（下）投影：影子公式（Leon 9th §5.1）。
// 分镜：x = p + z 拆分（影子从 x 尖端垂直落下）→ α 与 u → p = (xᵀy/yᵀy)y、“除两次长度” → 例 5：直线上滑动的点 + 距离计，最小处就是垂足
//       → 平面方程（3D 圆片 + 法向量）例 6/7 → 例 8 点到平面的影子 → TB1 四维：分量条 + 勾股条 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.1 投影', hi: 3, en: 'PROJECTION',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C06: 0.6, C09: 0.6, C12: 0.5, C13: 0.6, G01: 0.6, C17: 0.6 },
    post: { C02: 1.0, C04: 1.2, C05: 0.8, C07: 1.0, C08: 1.6, C10: 0.8, C11: 1.0, C12: 1.0, C14: 0.8, C15: 0.8, C16: 1.0, G01: 0.6, C17: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, dec: L('C02').s, dec2: cue('C02', 'z等于'), al: L('C03').s, al2: cue('C03', '阿尔法等于'), pf: L('C04').s, pf2: cue('C04', '分子是'), d1: L('D01').s, two: L('C05').s, two2: cue('C05', '一次把y'),
    e5: L('C06').s, e5w: L('C07').s, e5c: cue('C07', '所以Q'), e5v: L('C08').s, e5r: cue('C08', '最小二乘'),
    pl: L('C09').s, pl2: cue('C09', '展开'), e6: L('C10').s, e7: L('C11').s, e7n: cue('C11', '法向量六'), e8: L('C12').s, e8d: cue('C12', '标量投影'), d2: L('D02').s,
    tb: L('C13').s, tb1: L('C14').s, tb1p: cue('C14', '所以p'), tbz: L('C15').s, tbz2: cue('C15', '它和p的点积'), tbpy: L('C16').s, d3: L('D03').s,
    tj: L('G01').s, tj2: cue('G01', '方括号b a'), sum: L('C17').s, end: L('C18').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.dec, 0.3); TL.sfx('whoosh', T.dec2, 0.3); TL.sfx('pop', T.al, 0.3); TL.sfx('shimmer', T.pf, 0.35); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.two2, 0.3);
  TL.sfx('pop', T.e5, 0.3); TL.sfx('pop', T.e5w, 0.3); TL.sfx('ding_hi', T.e5c + 0.4, 0.3); TL.sfx('whoosh', T.e5v, 0.3);
  TL.sfx('whoosh', T.pl, 0.3); TL.sfx('pop', T.e6, 0.3); TL.sfx('pop', T.e7, 0.3); TL.sfx('ding', T.e7n, 0.3); TL.sfx('pop', T.e8, 0.3); TL.sfx('ding_hi', T.e8d + 1.6, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('whoosh', T.tb, 0.3); TL.sfx('pop', T.tb1, 0.3); TL.sfx('pop', T.tb1p, 0.3); TL.sfx('check', T.tbz2 + 3.0, 0.3); TL.sfx('ding_hi', T.tbpy + 2.5, 0.32); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  // ── A：拆分 + 公式 ──
  const P = new Plane({ ox: DX - 330, oy: DY + 200, u: 70, R: 8 });
  function shotA(D) {
    const a = B.win(T.o1 + 0.2, T.e5 - 0.3); if (a <= 0) return;
    B.grid(P, I2, a * 0.8, D, { old: 0.1, neu: 0.16, basis: false });
    const X = [2.2, 4.0], Y = [6, 2.2];
    B.lineD(P, D, Y, a * 0.5, { color: C.j, width: 2, dash: [8, 8] });
    arrow(ctx, P.S([0, 0]), P.S(Y), { color: C.j, width: 8, head: 24, alpha: a }); ctag('y', ...P.S([6.4, 2.0]), { px: 32, a, color: C.j, font: F.serif });
    arrow(ctx, P.S([0, 0]), P.S(X), { color: C.i, width: 8, head: 24, alpha: a }); ctag('x', ...P.S([2.0, 4.5]), { px: 32, a, color: C.i, font: F.serif });
    const pr = B.proj(P, X, Y, a * gin(T.dec), { grow: gin(T.dec + 0.4, 1.2), showZ: gin(T.dec2) });
    ctag('p', pr.Pp[0] + 10, pr.Pp[1] + 36, { px: 32, a: a * gin(T.dec + 1.4), color: C.peri, font: F.serif });
    ctag('z = x − p', (pr.X[0] + pr.Pp[0]) / 2 + 80, (pr.X[1] + pr.Pp[1]) / 2, { px: 30, a: a * gin(T.dec2), color: C.free, font: F.serif });
    texAt('dec', DX + 60, DY - 380, 36, { alpha: a * gin(T.dec + 0.6) });
    // 单位向量 u
    const gu = a * gin(T.al) * (1 - gin(T.pf + 0.5)); if (gu > 0) { const n = Math.hypot(...Y), U = [Y[0] / n, Y[1] / n]; arrow(ctx, P.S([0, 0]), P.S(U), { color: C.ink, width: 9, head: 20, alpha: gu }); ctag('u', ...P.S([U[0], U[1] + 0.5]), { px: 30, a: gu, color: C.ink, font: F.serif }); }
    texAt('u', DX + 240, DY - 260, 32, { alpha: a * gin(T.al) });
    texAt('alpha', DX + 240, DY - 160, 32, { alpha: a * gin(T.al2) });
    const gp = a * gin(T.pf); B.card(DX + 230, DY - 20, 440, 120, gp, C.peri); texAt('pf', DX + 230, DY - 20, 42, { alpha: gp });
    ctag('分子：点积   分母：yᵀy', DX + 230, DY + 70, { px: 26, a: a * gin(T.pf2), color: C.inkMid });
    const g2 = a * gin(T.two); texAt('two', DX + 230, DY + 180, 34, { alpha: g2 });
    ctag('影子长度', DX + 150, DY + 260, { px: 26, a: g2, color: C.peri }); ctag('单位向量', DX + 330, DY + 260, { px: 26, a: a * gin(T.two2), color: C.ink });
  }

  // ── B：例 5 + 滑动点 ──
  const P2 = new Plane({ ox: DX - 250, oy: DY + 210, u: 85, R: 7 });
  function shotB(D) {
    const a = B.win(T.e5 - 0.2, T.pl - 0.3); if (a <= 0) return;
    B.grid(P2, I2, a, D, { old: 0.1, neu: 0.25, basis: false });
    B.lineD(P2, D, [3, 1], a, { color: C.j, width: 4 }); ctag('y = x/3', ...P2.S([5.6, 2.4]), { px: 28, a, color: C.j, font: F.serif });
    const V = [1, 4]; B.dot(...P2.S(V), 10, C.i, a); ctag('(1, 4)', ...P2.S([0.2, 4.5]), { px: 28, a, color: C.i, font: F.serif });
    texAt('e5', DX + 200, DY - 360, 34, { alpha: a * gin(T.e5w) });
    // 滑动点：先在 [−1, 5] 来回扫，最后停在 Q
    const s0 = T.e5 + 1.0, s1 = T.e5c; const u = prog(B.t, s0, s1);
    const tt = u < 1 ? 2.1 + 2.6 * Math.sin(u * Math.PI * 2.5) * (1 - u * 0.85) : 2.1;
    const Qp = [tt, tt / 3], dist = Math.hypot(V[0] - Qp[0], V[1] - Qp[1]);
    const gs = a * gin(s0); B.line2(P2.S(V), P2.S(Qp), C.free, gs, 3, [10, 8]); B.dot(...P2.S(Qp), 11, C.peri, gs);
    B.meter(DX + 220, DY - 230, 420, dist, 4, gs, { label: '距离', fmt: v => v.toFixed(2) });
    const gq = a * gin(T.e5c); B.card(DX + 220, DY - 120, 500, 110, gq, C.peri); texAt('e5c', DX + 220, DY - 120, 34, { alpha: gq });
    if (gq > 0) { B.rightMark(P2.S([2.1, 0.7]), [-3, 1], [-1.1, -3.3], gq, { s: 20, color: OK }); ctag('Q', ...P2.S([2.6, 0.2]), { px: 32, a: gq, color: C.peri, font: F.serif }); }
    ctag('垂足 = 最近点', DX + 220, DY + 10, { px: 34, a: a * gin(T.e5v + 0.6), color: OK, font: F.serif });
    ctag('→ 5.3 最小二乘', DX + 220, DY + 70, { px: 28, a: a * gin(T.e5r), color: C.inkMid });
  }

  // ── C：平面方程（3D）+ 例 6/7/8 ──
  let P3 = null;
  function shotC(D) {
    const a = B.win(T.pl - 0.2, T.tb - 0.3); if (a <= 0 || !P3) return;
    P3.reset();
    const e8 = gin(T.e8), N = B.t >= T.e8 ? [1, 2, 2] : B.t >= T.e7 ? [6, 1, -8] : B.t >= T.e6 ? [2, 3, 4] : [1, 1, 2];
    const nn = Math.hypot(...N), Nu = N.map(v => v / nn);
    const sw = Math.min(...[T.e6, T.e7, T.e8].map(tt => Math.abs(B.t - tt))), sc = Math.min(gin(T.pl + 0.3, 0.8), sw < 0.35 ? 0.3 + sw * 2 : 1);
    P3.setPlane(0, N, { color: C.i, alpha: 0.32, scale: sc });
    const vP = [2, 0, 0], foot = [16 / 9, -4 / 9, -4 / 9];
    if (e8 > 0) { P3.setPoint(0, vP, { r: 0.1, color: C.peri, alpha: e8 }); P3.setPoint(1, foot, { r: 0.08, color: C.ink, alpha: gin(T.e8d) }); P3.setLine(0, [1, 2, 2], { p0: [(vP[0] + foot[0]) / 2, (vP[1] + foot[1]) / 2, (vP[2] + foot[2]) / 2], half: 1 / 3, grow: gin(T.e8d, 0.8), color: C.free, width: 6 }); }
    // 镜头按例题转到"看得见平面"的方位（避免平面侧视成一条线）
    const KF = [[T.e6, 0, 25], [T.e7, -70, 50], [T.e8, -10, 30]]; let az = -40, el = 20;
    for (const [tk, za, ze] of KF) { const k = gin(tk - 0.6, 1.4); az += (za - az) * k; el += (ze - el) * k; }
    const V = B.show3D(P3, D, a, { el, az: az + 8 * Math.sin(B.t * 0.2), dist: 14, axesA: 0.5, floorA: 0.25 });
    const ga = a * gin(T.pl + 0.8); V.v3([0, 0, 0], Nu.map(v => v * 2.2), { color: C.peri, alpha: ga }); V.lab(Nu.map(v => v * 2.6), 'N', { px: 32, a: ga, color: C.peri, font: F.serif });
    if (e8 > 0) V.lab([2.3, -0.4, 0.2], 'v = (2, 0, 0)', { px: 26, a: a * e8, color: C.peri });
    // 公式区（左上）
    const gf = a * (1 - gin(T.e6 - 0.2)); texAt('pl', DX, DY - 390, 36, { alpha: gf * gin(T.pl + 0.3) }); texAt('ple', DX, DY - 320, 32, { alpha: gf * gin(T.pl2) });
    const g6 = a * gin(T.e6) * (1 - gin(T.e7 - 0.2)); ctag('例 6  P₀ = (2, −1, 3)，N = (2, 3, 4)ᵀ', DX, DY - 390, { px: 28, a: g6, color: C.peri }); texAt('e6', DX, DY - 320, 34, { alpha: g6 });
    const g7 = a * gin(T.e7) * (1 - gin(T.e8 - 0.2)); ctag('例 7  过 (1,1,2)、(2,3,3)、(3,−3,3)', DX, DY - 400, { px: 28, a: g7, color: C.peri }); texAt('e7', DX, DY - 340, 32, { alpha: g7 * gin(T.e7n - 0.6) }); texAt('e7p', DX, DY - 280, 32, { alpha: g7 * gin(T.e7n + 1.2) });
    const g8 = a * e8; ctag('例 8  点到平面 x + 2y + 2z = 0', DX, DY - 390, { px: 28, a: g8, color: C.peri });
    const gd = a * gin(T.e8d + 1.2); B.card(DX, DY + 330, 400, 110, gd, OK); texAt('e8', DX, DY + 330, 36, { alpha: gd });
    ctag('距离 = 法向量方向上的影子', DX, DY - 320, { px: 30, a: a * gin(T.d2), color: C.ds });
  }

  // ── D：TB1 四维 ──
  function shotD() {
    const a = B.win(T.tb - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('测验 B · 第 1 题', DX, DY - 390, { px: 32, a, color: C.peri, font: F.serif });
    texAt('tb1', DX, DY - 320, 34, { alpha: a * gin(T.tb1) });
    texAt('tb1p', DX, DY - 245, 34, { alpha: a * gin(T.tb1p) });
    // 四个分量条：x、p、x − p
    const X = [1, 1, 2, 2], Pv = [-2 / 3, 1 / 3, 2 / 3, 0], Z = X.map((v, i) => v - Pv[i]);
    const rows = [['x', X, C.i, T.tb1], ['p', Pv, C.peri, T.tb1p + 1.0], ['x − p', Z, C.free, T.tbz]];
    rows.forEach(([n, vv, col, t0], r) => {
      const g = a * gin(t0) * (1 - gin(T.tbpy - 0.2)); if (g <= 0) return; const y0 = DY - 140 + r * 80;
      ctag(n, DX - 330, y0, { px: 30, a: g, color: col, font: F.serif });
      vv.forEach((v, i) => { const cx = DX - 180 + i * 130; ctx.save(); ctx.globalAlpha = g * 0.85; ctx.fillStyle = v >= 0 ? col : C.free; ctx.fillRect(cx - 40, y0 - Math.max(0, v) * 22, 80, Math.abs(v) * 22 + 1); ctx.restore(); B.line2([cx - 50, y0], [cx + 50, y0], C.inkMid, g, 2); });
    });
    texAt('tb1z', DX, DY + 140, 32, { alpha: a * gin(T.tbz2) * (1 - gin(T.tbpy - 0.2)) });
    B.stamp(DX + 330, DY + 60, true, gin(T.tbz2 + 3.0, 0.4), a * gin(T.tbz2 + 3.0) * (1 - gin(T.tbpy - 0.2)), '⊥');
    // 勾股条
    const gp = a * gin(T.tbpy); if (gp > 0) {
      const s = smoother(prog(B.t, T.tbpy + 1.2, T.tbpy + 2.5)), W = 52;
      ctx.save(); ctx.globalAlpha = gp * 0.85; ctx.fillStyle = C.peri; ctx.fillRect(DX - 260, DY - 60, 1 * W, 60); ctx.fillStyle = C.free; ctx.fillRect(lerp(DX - 260 + W + 30, DX - 260 + W, s), DY - 60, 9 * W, 60);
      ctx.fillStyle = C.i; ctx.fillRect(DX - 260, DY + 40, 10 * W, 60); ctx.restore();
      ctag('‖p‖² = 1', DX - 234, DY - 90, { px: 26, a: gp, color: C.peri }); ctag('‖x − p‖² = 9', DX + 50, DY - 90, { px: 26, a: gp, color: C.free }); ctag('‖x‖² = 10', DX, DY + 130, { px: 26, a: gp, color: C.i });
      texAt('tb1py', DX, DY + 230, 32, { alpha: a * gin(T.tbpy + 2.5) });
    }
    ctag('四维也成立！', DX, DY + 320, { px: 34, a: a * gin(T.d3), color: C.ds, font: F.serif });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照', DX, DY - 330, { px: 36, a, color: C.gpt, font: F.serif });
    ctag('正文没有单独的投影公式', DX, DY - 230, { px: 30, a: a * gin(T.tj + 0.5), color: C.inkMid });
    const g = a * gin(T.tj2); B.card(DX - 220, DY - 60, 360, 140, g, C.gpt); texAt('tj', DX - 220, DY - 60, 40, { alpha: g });
    ctag('=', DX, DY - 60, { px: 50, a: g, color: C.ink }); B.card(DX + 220, DY - 60, 360, 140, g, C.peri); texAt('pf', DX + 220, DY - 60, 36, { alpha: g });
    ctag('施密特正交化（5.6）', DX - 220, DY + 50, { px: 26, a: g, color: C.gpt }); ctag('向量投影', DX + 220, DY + 50, { px: 26, a: g, color: C.peri });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    B.card(DX, DY - 200, 440, 120, a * gin(T.sum + 0.3), C.peri); texAt('pf', DX, DY - 200, 42, { alpha: a * gin(T.sum + 0.3) });
    ctag('x − p ⊥ y', DX, DY - 80, { px: 36, a: a * gin(cue('C17', '并且')), color: C.free, font: F.serif });
    ctag('垂足 = 最近点', DX, DY + 10, { px: 34, a: a * gin(cue('C17', '垂足')), color: OK });
    ctag('点到平面距离 = 法向量方向的影子', DX, DY + 100, { px: 30, a: a * gin(cue('C17', '点到平面')), color: C.ink });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('正交子空间', DX, DY - 10, { px: 100, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('四个基本子空间', DX, DY + 110, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.dec - 0.2, t1: T.e5 - 0.3, head: '影子公式', items: [['x = p + z', T.dec, { color: C.peri, mark: C.peri }], ['标量投影 α', T.al], ['p = (xᵀy/yᵀy) y', T.pf, { color: C.peri, mark: C.peri }]] },
    { t0: T.e5 - 0.3, t1: T.tb - 0.3, head: '例子', items: [['例 5：最近点', T.e5], ['平面方程', T.pl], ['例 7：叉积求 N', T.e7], ['例 8：距离 2/3', T.e8, { color: OK, mark: OK }]] },
    { t0: T.tb - 0.3, t1: T.end - 0.3, head: '验算与对照', items: [['TB1：四维投影', T.tb1], ['勾股 1 + 9 = 10', T.tbpy, { color: OK, mark: OK }], ['同济：施密特那一项', T.tj, { color: C.gpt, mark: C.gpt }]] },
  ];

  const P3c = await load3D(); P3 = new P3c(900, { R: 3 });
  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(D); shotD(); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
