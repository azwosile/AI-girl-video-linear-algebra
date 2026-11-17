// 第 5 章 5.6 施密特正交化与 QR（Leon 9th §5.6）。
// 分镜：3D 里三根歪的 x → 第一步单位化 → 第二步 x₂ 的影子落下、x₂ − p₁ 立起来 → 第三步 x₃ 投到 u₁u₂ 平面、剩余部分竖直 → 为何不为零 / 定理 5.6.1
//       → 例 2：四维列向量卡片逐步计算，r 系数一个个飞进上三角 R → A = QR → 定理 5.6.2 + 列的读法 → 定理 5.6.3 → 例 4 回代动画 → 修正施密特 / 正交多项式预告
//       → 同济：先正交、后单位化（b₁ b₂ b₃）→ 同济例题 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point', 'gpt_cross'] };

const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k), dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0), nrm = a => Math.hypot(...a), unit = a => mul(a, 1 / nrm(a));

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.6 施密特正交化', hi: 3, en: 'GRAM–SCHMIDT',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C03: 0.6, C04: 0.6, C07: 0.6, C12: 0.6, C14: 0.6, C17: 0.6, G01: 0.6, C18: 0.6 },
    post: { C01: 0.6, C03: 1.6, C04: 1.8, C05: 0.8, C06: 1.0, C08: 0.8, C09: 1.2, C10: 1.2, C11: 1.6, C13: 1.2, C15: 1.6, C16: 0.8, C17: 0.8, G02: 1.0, G03: 1.0 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, idea: L('C02').s, idea2: cue('C02', '剩下的部分'), s1: L('C03').s, s2: cue('C03', '第二步'), s2b: cue('C03', 'x二减p一'), s3: L('C04').s, s3b: cue('C04', 'x三减p二'), s3c: cue('C04', '单位化'),
    d1: L('D01').s, nz: L('C05').s, sp: L('C06').s,
    e2: L('C07').s, r11: L('C08').s, r12: L('C09').s, r12b: cue('C09', 'a二减三倍'), q2: cue('C09', '长度r二二'), r13: L('C10').s, r13b: cue('C10', 'a三减p二'), q3: cue('C10', '长度r三三'), d2: L('D02').s,
    qr: L('C11').s, qr2: cue('C11', '排成上三角'), qr3: cue('C11', '就有A等于'), thm: L('C12').s, why: L('C13').s, why2: cue('C13', 'a二等于'), why3: cue('C13', 'a三是'), why4: cue('C13', '这正是'),
    ls: L('C14').s, e4: L('C15').s, e4b: cue('C15', '从下往上'), d3: L('D03').s, same: L('C16').s, mgs: cue('C16', '教材还给了'), poly: L('C17').s,
    tj: L('G01').s, tj2: L('G02').s, tj2b: cue('G02', 'b三再减'), tj3: L('G03').s, tj3b: cue('G03', '算出b二'), tj3c: cue('G03', '考试推荐'), sum: L('C18').s, end: L('C19').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('shimmer', T.idea, 0.3); TL.sfx('pop', T.s1, 0.3); TL.sfx('whoosh', T.s2, 0.3); TL.sfx('warp', T.s2b, 0.35); TL.sfx('whoosh', T.s3, 0.3); TL.sfx('warp', T.s3b, 0.35); TL.sfx('ding_hi', T.s3c, 0.3);
  TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.sp, 0.3); TL.sfx('pop', T.e2, 0.3); TL.sfx('pop', T.r11, 0.3); TL.sfx('pop', T.r12, 0.3); TL.sfx('pop', T.q2, 0.3); TL.sfx('pop', T.r13, 0.3); TL.sfx('pop', T.q3, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('swoosh_in', T.qr2, 0.35); TL.sfx('ding_hi', T.qr3, 0.35); TL.sfx('pop', T.thm, 0.3); TL.sfx('pop', T.why, 0.3); TL.sfx('pop', T.ls, 0.3); TL.sfx('pop', T.e4, 0.3);
  TL.sfx('marimba_lo', T.e4b, 0.3); TL.sfx('marimba', T.e4b + 1.0, 0.3); TL.sfx('marimba_hi', T.e4b + 2.0, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('check', T.same + 0.8, 0.3); TL.sfx('pop', T.poly, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('pop', T.tj3, 0.3); TL.sfx('ding_hi', T.tj3b + 2.0, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C19').e + 0.3, 0.4);

  // ── A：3D 施密特 ──
  let P3 = null;
  const X1 = [2.2, 0.4, 0.3], X2 = [1.3, 1.9, 0.2], X3 = [0.9, 0.8, 2.0];
  const U1 = unit(X1), P1 = mul(U1, dot(X2, U1)), Z2 = sub(X2, P1), U2 = unit(Z2), P2 = add(mul(U1, dot(X3, U1)), mul(U2, dot(X3, U2))), Z3 = sub(X3, P2), U3 = unit(Z3);
  const nPl = [U1[1] * U2[2] - U1[2] * U2[1], U1[2] * U2[0] - U1[0] * U2[2], U1[0] * U2[1] - U1[1] * U2[0]];
  function shotA(D) {
    const a = B.win(T.o1 + 0.1, T.e2 - 0.3); if (a <= 0 || !P3) return;
    P3.reset();
    const gPl = gin(T.s3, 0.8); P3.setPlane(0, nPl, { color: C.j, alpha: 0.26, scale: gPl * 0.9 });
    const V = B.show3D(P3, D, a, { el: 20, az: -55 + 12 * Math.sin(B.t * 0.15), dist: 12, axesA: 0.35, floorA: 0.15 });
    const k = 1.45; // 单位向量显示长度
    // x₁ → u₁
    const s1 = smoother(prog(B.t, T.s1 + 0.6, T.s1 + 1.8));
    const x1d = mul(X1, lerp(1, k / nrm(X1), s1)); V.v3([0, 0, 0], x1d, { color: s1 > 0.5 ? C.peri : C.i, alpha: a }); V.lab(mul(x1d, 1.15), s1 > 0.5 ? 'u₁' : 'x₁', { px: 30, a, color: s1 > 0.5 ? C.peri : C.i, font: F.serif });
    // x₂：影子 → 立起 → 单位化
    const g2 = gin(T.s2, 0.6), dz2 = smoother(prog(B.t, T.s2b, T.s2b + 1.6)), un2 = smoother(prog(B.t, T.s2b + 2.2, T.s2b + 3.2));
    V.v3([0, 0, 0], X2, { color: C.i, alpha: a * (1 - dz2 * 0.6) }); V.lab(mul(X2, 1.12), 'x₂', { px: 30, a: a * (1 - dz2 * 0.6), color: C.i, font: F.serif });
    if (g2 > 0) { V.v3([0, 0, 0], P1, { color: C.free, alpha: a * g2 * (1 - un2 * 0.7), width: 6 }); B.line2(V.pr(X2), V.pr(P1), C.inkMid, a * g2 * (1 - dz2), 3, [8, 8]); V.lab(mul(P1, 0.6), 'p₁', { px: 26, a: a * g2 * (1 - un2), color: C.free, font: F.serif }); }
    if (dz2 > 0) { const z = mul(Z2, lerp(1, k / nrm(Z2), un2)), base = mul(P1, 1 - dz2); V.v3(base, add(base, z), { color: un2 > 0.5 ? C.peri : C.j, alpha: a * dz2 }); V.lab(add(base, mul(z, 1.18)), un2 > 0.5 ? 'u₂' : 'x₂ − p₁', { px: 28, a: a * dz2, color: un2 > 0.5 ? C.peri : C.j, font: F.serif }); }
    // x₃
    const g3 = gin(T.s3, 0.6), dz3 = smoother(prog(B.t, T.s3b, T.s3b + 1.6)), un3 = smoother(prog(B.t, T.s3c, T.s3c + 1.0));
    if (g3 > 0) {
      V.v3([0, 0, 0], X3, { color: C.i, alpha: a * g3 * (1 - dz3 * 0.6) }); V.lab(mul(X3, 1.1), 'x₃', { px: 30, a: a * g3 * (1 - dz3 * 0.6), color: C.i, font: F.serif });
      V.v3([0, 0, 0], P2, { color: C.free, alpha: a * gin(T.s3 + 1.0) * (1 - un3 * 0.7), width: 6 }); B.line2(V.pr(X3), V.pr(P2), C.inkMid, a * gin(T.s3 + 1.0) * (1 - dz3), 3, [8, 8]); V.lab(add(P2, [0.2, 0.2, -0.2]), 'p₂', { px: 26, a: a * gin(T.s3 + 1.0) * (1 - un3), color: C.free, font: F.serif });
      if (dz3 > 0) { const z = mul(Z3, lerp(1, k / nrm(Z3), un3)), base = mul(P2, 1 - dz3); V.v3(base, add(base, z), { color: un3 > 0.5 ? C.peri : C.k, alpha: a * dz3 }); V.lab(add(base, mul(z, 1.18)), un3 > 0.5 ? 'u₃' : 'x₃ − p₂', { px: 28, a: a * dz3, color: un3 > 0.5 ? C.peri : C.k, font: F.serif }); }
    }
    // 直角标（u₁ ⊥ u₂、u₃ ⊥ 平面）
    const gr = a * un2 * (1 - gin(T.s3 + 0.5)); if (gr > 0) { const O = V.pr([0, 0, 0]), A1 = V.pr(mul(U1, 0.3)), A2 = V.pr(mul(U2, 0.3)); B.rightMark(O, [A1[0] - O[0], A1[1] - O[1]], [A2[0] - O[0], A2[1] - O[1]], gr, { color: OK }); }
    // 文字
    texAt('idea', DX, DY - 380, 30, { alpha: a * gin(T.idea + 0.3) * (1 - gin(T.s1 - 0.2)) });
    ctag('减掉影子 → 剩下的全都垂直', DX, DY + 360, { px: 32, a: a * gin(T.idea2) * (1 - gin(T.s1 - 0.2)), color: OK, font: F.serif });
    texAt('s1', DX - 260, DY - 370, 32, { alpha: a * gin(T.s1) * (1 - gin(T.s3 - 0.2)) }); texAt('s2', DX + 160, DY - 370, 30, { alpha: a * gin(T.s2) * (1 - gin(T.s3 - 0.2)) });
    texAt('s3', DX, DY - 370, 30, { alpha: a * gin(T.s3) * (1 - gin(T.nz - 0.2)) });
    ctag('若 x₃ − p₂ = 0，x₃ 就落在平面里 ✗', DX, DY - 370, { px: 30, a: a * gin(T.nz) * (1 - gin(T.sp - 0.2)), color: C.free });
    const gs = a * gin(T.sp); ctag('定理 5.6.1', DX, DY - 390, { px: 28, a: gs, color: C.peri, font: F.serif }); texAt('span', DX, DY - 330, 30, { alpha: gs });
  }

  // ── B：例 2 计算 + R 填充 ──
  const Rm = [[2, 3, 2], [0, 5, -2], [0, 0, 4]], Rt = () => [[T.r11, T.r12, T.r13], [0, T.q2, T.r13 + 1.5], [0, 0, T.q3]];
  function drawR(x, y, a, { cell = 70, fly = true } = {}) {
    if (a <= 0) return; const tt = Rt();
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; const W = cell * 3 + 20, H = cell * 3 + 10;
    ctx.beginPath(); ctx.moveTo(x - W / 2 + 12, y - H / 2); ctx.lineTo(x - W / 2, y - H / 2); ctx.lineTo(x - W / 2, y + H / 2); ctx.lineTo(x - W / 2 + 12, y + H / 2); ctx.moveTo(x + W / 2 - 12, y - H / 2); ctx.lineTo(x + W / 2, y - H / 2); ctx.lineTo(x + W / 2, y + H / 2); ctx.lineTo(x + W / 2 - 12, y + H / 2); ctx.stroke(); ctx.restore();
    ctag('R =', x - W / 2 - 60, y, { px: 34, a, color: C.ink, font: F.serif });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const cx = x + (j - 1) * cell, cy = y + (i - 1) * cell;
      if (j < i) { ctag('0', cx, cy, { px: 32, a: a * 0.5, color: C.inkMid, font: F.serif }); continue; }
      const t0 = tt[i][j], s = fly ? smoother(prog(B.t, t0 + 0.4, t0 + 1.2)) : 1; if (s <= 0) continue;
      const fx = lerp(DX + 0, cx, s), fy = lerp(DY - 200, cy, s);
      ctag(String(Rm[i][j]).replace('-', '−'), fx, fy, { px: lerp(44, 32, s), a: a * Math.min(1, s * 2), color: i === j ? C.peri : C.ink, font: F.serif });
    }
  }
  function shotB() {
    const a = B.win(T.e2 - 0.2, T.thm - 0.3); if (a <= 0) return;
    texAt('e2A', DX - 300, DY - 230, 34, { alpha: a * gin(T.e2 + 0.3) * (1 - gin(T.qr3 - 0.2)) });
    const rows = [['r11', T.r11], ['r12', T.r12], ['q2', T.q2], ['r13', T.r13], ['q3', T.q3]];
    rows.forEach(([k, t0], i) => { const g = a * gin(t0) * (1 - gin(T.qr2 - 0.2)); texAt(k, DX + 160, DY - 100 + i * 70, 28, { alpha: g * (B.t < (rows[i + 1]?.[1] ?? T.qr) ? 1 : 0.55) }); });
    ctag('全是 ±½ ！', DX + 300, DY + 300, { px: 32, a: a * gin(T.d2) * (1 - gin(T.qr - 0.2)), color: C.ds, font: F.serif });
    drawR(DX + 220, DY - 290, a * gin(T.r11) * (1 - gin(T.qr2 - 0.2)), { cell: 56 });
    const gq = a * gin(T.qr2); if (gq > 0) { drawR(DX, DY - 40, gq, { cell: 80, fly: false }); const g3 = a * gin(T.qr3); B.card(DX, DY + 260, 380, 100, g3, C.peri); ctag('A = QR', DX, DY + 260, { px: 52, a: g3, color: C.peri, font: F.serif }); }
  }

  // ── C：定理 5.6.2 + 列的读法 + 5.6.3 + 例 4 ──
  function shotC() {
    const a = B.win(T.thm - 0.2, T.poly - 0.3); if (a <= 0) return;
    const g1 = a * (1 - gin(T.ls - 0.2));
    if (g1 > 0) { ctag('定理 5.6.2', DX, DY - 380, { px: 28, a: g1 * gin(T.thm), color: C.peri, font: F.serif }); B.card(DX, DY - 310, 760, 90, g1 * gin(T.thm), C.peri); texAt('thm', DX, DY - 310, 32, { alpha: g1 * gin(T.thm) });
      texAt('cols', DX, DY - 60, 38, { alpha: g1 * gin(T.why), reveal: rv(T.why, T.why3 + 1.2 - T.why) });
      ctag('= QR 的第 1、2、3 列', DX, DY + 120, { px: 32, a: g1 * gin(T.why4), color: OK, font: F.serif }); }
    const g2 = a * gin(T.ls); if (g2 <= 0) return;
    ctag('定理 5.6.3', DX, DY - 380, { px: 28, a: g2, color: C.peri, font: F.serif }); B.card(DX, DY - 310, 360, 90, g2, C.peri); texAt('ls', DX, DY - 310, 40, { alpha: g2 });
    texAt('e4', DX, DY - 170, 34, { alpha: a * gin(T.e4 + 0.3) });
    // 回代：x₃ → x₂ → x₁
    const xs = [['x₃ = 2/2 = 1', T.e4b], ['x₂ = (−1 + 1)/4 = 0', T.e4b + 1.0], ['x₁ = (−1 + 0 − 1)/5 = −2/5', T.e4b + 2.0]];
    xs.forEach(([s, t0], i) => { const g = a * gin(t0); ctag(s, DX, DY - 30 + i * 60, { px: 32, a: g, color: [C.k, C.j, C.i][i], font: F.serif }); });
    if (B.t > T.e4b) { const u = prog(B.t, T.e4b, T.e4b + 2.6), yy = lerp(DY + 90, DY - 30, u); arrow(ctx, [DX - 330, DY + 100], [DX - 330, yy - 10], { color: C.peri, width: 5, head: 18, alpha: a * (1 - u * 0.5) }); ctag('回代', DX - 390, DY + 30, { px: 26, a: a * (1 - u * 0.5), color: C.peri }); }
    const gx = a * gin(T.same); B.card(DX, DY + 230, 460, 90, gx, OK); texAt('e4x', DX, DY + 230, 36, { alpha: gx }); ctag('= 正规方程的解', DX + 320, DY + 300, { px: 26, a: gx, color: OK });
    ctag('不算 AᵀA：数值更稳 · 修正施密特', DX, DY + 360, { px: 28, a: a * gin(T.mgs), color: C.inkMid });
  }

  function shotD() {
    const a = B.win(T.poly - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('不局限于 ℝⁿ', DX, DY - 300, { px: 36, a, color: C.peri, font: F.serif });
    texAt('poly', DX, DY - 180, 38, { alpha: a * gin(T.poly + 0.6) });
    const P = new Plane({ ox: DX, oy: DY + 140, u: 150, R: 2 });
    [[() => 1, C.i], [x => x, C.j], [x => x * x - 2 / 3, C.k]].forEach(([f, col], i) => {
      const g = a * gin(T.poly + 1.2 + i * 0.6); if (g <= 0) return; ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); for (let k = 0; k <= 80; k++) { const x = -1.2 + 2.4 * k / 80, q = P.S([x, f(x)]); k ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke(); ctx.restore(); });
    B.line2(P.S([-1.4, 0]), P.S([1.4, 0]), C.ink, a * 0.6, 2); ctag('→ 5.7 正交多项式', DX, DY + 340, { px: 30, a: a * gin(cue('C17', '这就是')), color: C.inkMid });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照  先正交，后单位化', DX, DY - 380, { px: 34, a, color: C.gpt, font: F.serif });
    const g0 = a * (1 - gin(T.tj3 - 0.2));
    if (g0 > 0) {
      ['Leon：正交 → 单位化 → 正交 → 单位化 …', '同济：正交 → 正交 → 正交 → 最后统一单位化'].forEach((s, i) => ctag(s, DX, DY - 290 + i * 60, { px: 28, a: g0 * gin(T.tj + 0.5 + i * 0.8), color: i ? C.gpt : C.peri }));
      texAt('tjs', DX, DY - 90, 34, { alpha: g0 * gin(T.tj2) }); texAt('tjs3', DX, DY + 30, 30, { alpha: g0 * gin(T.tj2b) });
      ctag('分母 [b, b]：不开根号，手算省事', DX, DY + 130, { px: 28, a: g0 * gin(T.tj2b + 1.5), color: OK });
    }
    const g1 = a * gin(T.tj3); if (g1 > 0) {
      texAt('tje', DX, DY - 250, 34, { alpha: g1 }); const g2 = a * gin(T.tj3b); B.card(DX, DY - 80, 640, 150, g2, C.gpt); texAt('tjr', DX, DY - 80, 34, { alpha: g2 });
      ctag('再单位化：b₁/√6、b₂ → (−1,1,1)/√3、b₃ → (1,0,1)/√2', DX, DY + 40, { px: 28, a: a * gin(T.tj3b + 3.0), color: C.inkMid });
      B.stamp(DX + 300, DY + 160, true, gin(T.tj3c, 0.4), a * gin(T.tj3c), '推荐');
    }
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    ctag('减去投影，再单位化', DX, DY - 230, { px: 36, a: a * gin(T.sum + 0.3), color: C.ink, font: F.serif });
    B.card(DX, DY - 120, 380, 100, a * gin(cue('C18', '记下所有')), C.peri); ctag('A = QR', DX, DY - 120, { px: 50, a: a * gin(cue('C18', '记下所有')), color: C.peri, font: F.serif });
    texAt('ls', DX, DY, 38, { alpha: a * gin(cue('C18', '用它解')) });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('第五章复习', DX, DY - 10, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('Test A：十道判断题', DX, DY + 110, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.idea - 0.2, t1: T.e2 - 0.3, head: '施密特过程', items: [['减影子、再单位化', T.idea, { color: C.peri, mark: C.peri }], ['u₁、u₂、u₃', T.s1], ['不会减成 0', T.nz], ['span 保持', T.sp, { color: OK, mark: OK }]] },
    { t0: T.e2 - 0.3, t1: T.tj - 0.3, head: 'QR 分解', items: [['例 2：q 全是 ±½', T.r11], ['A = QR', T.qr3, { color: C.peri, mark: C.peri }], ['Rx̂ = Qᵀb', T.ls], ['例 4：回代', T.e4b, { color: OK, mark: OK }], ['正交多项式', T.poly]] },
    { t0: T.tj - 0.3, t1: T.end - 0.3, head: '同济写法', items: [['先正交后单位化', T.tj, { color: C.gpt, mark: C.gpt }], ['[a, b]/[b, b]', T.tj2], ['例：b₂、b₃', T.tj3b]] },
  ];

  const P3c = await load3D(); P3 = new P3c(900, { R: 3 });
  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(); shotC(); shotD(); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
