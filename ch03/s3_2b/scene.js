// 第 3 章 3.2b 张成与张成集（Leon 9th §3.2 后半）。
// 分镜：线性组合 → Span 定义 → ℝ² 中 α、β 滑动、点阵铺满平面 → 共线只扫出一条线
//       → ℝ³：两个向量张成平面，第三个向量离开平面（层层平面填满空间）/ 躺在平面上（白加）
//       → 定理 3.2.1 → 张成集 → 例 11 四组（✓ ✓ ✗ ✗）→ 例 12 P₃ → 定理 3.2.2：解集 = 特解 + 零空间（平移直线）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_ask', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.2 张成', hi: 3, en: 'SPAN',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.5, C07: 0.6, C10: 0.6, C13: 0.6, C15: 0.4, C17: 0.4, C19: 0.4, C22: 0.6, C24: 0.6, C28: 0.3 },
    post: { C03: 0.6, C05: 0.8, C06: 0.6, C09: 0.8, C12: 0.6, C14: 0.5, C16: 0.6, C18: 0.6, C20: 0.8, C23: 0.8, C27: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    lc: L('C02').s, sp: L('C03').s, spn: cue('C03', 'Span'), pt: L('C04').s, fix: cue('C04', '固定'), mov: L('C05').s, all: cue('C05', '两个不共线'),
    col: L('D01').s, col2: L('C06').s, line: cue('C06', '张成就缩成'),
    r3: L('C07').s, v3: L('C08').s, v3all: cue('C08', '三个向量就能'), v3in: L('C09').s, v3w: cue('C09', '加了也白加'),
    th: L('C10').s, th2: L('C11').s, th3: cue('C11', '乘一个数'), ss: L('C12').s,
    e11: L('C13').s, ga: L('C14').s, gaok: cue('C14', '能。'), gb: L('C15').s, gb2: L('C16').s, gbok: cue('C16', '所以能张成'),
    gc: L('C17').s, gc2: cue('C17', '第一个分量永远'), gc3: L('C18').s, gcno: cue('C18', '不能张成'), gd: L('C19').s, gd2: L('C20').s, gd3: cue('C20', '第三个向量'), gdno: cue('C20', '所以不能'),
    ds2: L('D02').s, e12: L('C22').s, e12b: L('C23').s, e12c: cue('C23', '就能解出'),
    nh: L('C24').s, nh2: L('C25').s, ex: L('C26').s, ex2: cue('C26', '齐次方程的解'), ex3: cue('C26', '平移'), ex4: L('C27').s, tj: L('G01').s, end: L('C28').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', T.lc, 0.3); TL.sfx('ding_hi', T.spn, 0.3); TL.sfx('pop', T.fix, 0.3); TL.sfx('shimmer', T.mov + 0.4, 0.35); TL.sfx('check', T.all, 0.3);
  TL.sfx('warp', T.col2, 0.3); TL.sfx('whoosh', T.r3, 0.3); TL.sfx('pop', T.v3, 0.3); TL.sfx('shimmer', T.v3all, 0.35); TL.sfx('warp', T.v3in, 0.3); TL.sfx('buzz', T.v3w, 0.22);
  TL.sfx('whoosh', T.th, 0.3); TL.sfx('check', T.th3 + 0.8, 0.3); TL.sfx('ding_hi', T.ss, 0.3); TL.sfx('whoosh', T.e11, 0.3);
  TL.sfx('stamp', T.gaok, 0.35); TL.sfx('stamp', T.gbok, 0.35); TL.sfx('stamp', T.gcno, 0.35); TL.sfx('stamp', T.gdno, 0.35);
  TL.sfx('whoosh', T.e12, 0.3); TL.sfx('check', T.e12c + 1.5, 0.3); TL.sfx('whoosh', T.nh, 0.3); TL.sfx('warp', T.ex3, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', L('C28').e + 0.3, 0.4);

  // ── A：线性组合 / Span ──
  function shotDef() {
    const a = B.win(T.lc - 0.2, T.pt - 0.3); if (a <= 0) return;
    ctag('线性组合', DX, DY - 250, { px: 34, a: a * gin(T.lc), color: C.peri });
    texAt('lc', DX, DY - 160, 56, { alpha: a * gin(T.lc + 0.3), reveal: rv(T.lc + 0.3, 1.4) });
    ctag('每个向量乘一个数，再全部加起来', DX, DY - 70, { px: 30, a: a * gin(T.lc + 1.4), color: C.inkMid });
    ctag('所有组合放在一起 → 张成', DX, DY + 60, { px: 34, a: a * gin(T.sp), color: C.peri });
    texAt('span', DX, DY + 160, 42, { alpha: a * gin(T.spn), reveal: rv(T.spn, 1.4), color: C.ink });
  }

  // ── B：ℝ² 扫满 / 共线只有一条线 ──
  const P = new Plane({ ox: DX, oy: DY + 30, u: 70, R: 5.6 });
  const v1 = [2, 1], v2 = [-1, 1.5], v2c = [-1.2, -0.6];
  const SAMP = []; for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) SAMP.push([i * 0.5, j * 0.5, Math.hypot(i, j)]);
  function shotSweep(D) {
    const a = B.win(T.pt - 0.2, T.r3 - 0.3); if (a <= 0) return;
    const colS = smoother(prog(B.t, T.col2 - 0.2, T.col2 + 0.8));
    const w2 = [lerp(v2[0], v2c[0], colS), lerp(v2[1], v2c[1], colS)];
    B.grid(P, I2, a, D, { neu: 0, basis: false, old: 0.16 });
    // 铺满：点阵按到原点的距离逐渐出现
    const fill = prog(B.t, T.mov + 0.3, T.mov + 3.5) * 9;
    ctx.save(); K(); ctx.restore();
    function K() {
      B.K.clip(D);
      for (const [al, be, r] of SAMP) {
        const s = a * smooth(Math.min(1, Math.max(0, fill - r)));
        if (s <= 0) continue;
        const q = P.S([al * v1[0] + be * w2[0], al * v1[1] + be * w2[1]]);
        B.dot(q[0], q[1], 5, colS > 0.5 ? C.free : C.peri, s * 0.75);
      }
    }
    // 当前点：α、β 滑动
    const tt = B.t - T.pt, al = B.t < T.mov ? 1.2 : 1.2 * Math.cos(tt * 0.9), be = B.t < T.mov ? 0.8 : 1.3 * Math.sin(tt * 0.7);
    const pa = a * gin(T.fix);
    const p1 = [al * v1[0], al * v1[1]], tip = [p1[0] + be * w2[0], p1[1] + be * w2[1]];
    B.vec(P, v1, a * gin(T.pt), { color: C.i, label: 'v₁' }); B.vec(P, w2, a * gin(T.pt + 0.5), { color: C.j, label: 'v₂' });
    if (pa > 0) {
      B.vec(P, p1, pa * 0.6, { color: C.i, width: 5, head: 16 }); B.vec(P, [be * w2[0], be * w2[1]], pa * 0.6, { color: C.j, width: 5, head: 16, from: p1 });
      const q = P.S(tip); B.dot(q[0], q[1], 10, C.ink, pa);
      B.tag(`α = ${al.toFixed(1).replace('-', '−')}   β = ${be.toFixed(1).replace('-', '−')}`, DX - 120, DY - 330, { px: 32, a: pa, color: C.ink, font: F.serif });
    }
    if (colS > 0.5) { const L1 = P.S([-5 * v2c[0], -5 * v2c[1]]), L2 = P.S([5 * v2c[0], 5 * v2c[1]]); B.line2(L1, L2, C.free, a * gin(T.line, 0.5), 6); }
    ctag(colS > 0.5 ? '共线：张成只是一条线' : '不共线：张成整个 ℝ²', DX, DY + 330, { px: 36, a: a * gin(colS > 0.5 ? T.line : T.all), color: colS > 0.5 ? C.free : OK });
  }

  // ── C：ℝ³ ──
  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const u1 = [2, 0, 1], u2 = [0, 2, 1], nn = [1, 1, -2], off = [-0.8, -0.8, 2.4], onp = [1.6, 1.0, 1.3];
  function shot3D(D) {
    const a = B.win(T.r3 - 0.2, T.th - 0.3); if (a <= 0) return;
    P3.reset();
    P3.setPlane(0, nn, { color: C.i, alpha: 0.32, scale: outCubic(prog(B.t, T.r3 + 0.4, T.r3 + 1.4)) });
    // 第三个向量离开平面：一层层平行的面填满空间
    const st = a * B.win(T.v3all, T.v3in, 0.6, 0.4);
    if (st > 0) { P3.setPlane(1, nn, { color: C.k, alpha: 0.16 * st, d: 1.6 * smooth(prog(B.t, T.v3all, T.v3all + 1.5)) }); P3.setPlane(2, nn, { color: C.k, alpha: 0.16 * st, d: -1.6 * smooth(prog(B.t, T.v3all, T.v3all + 1.5)) }); }
    P3.setPoint(0, [0, 0, 0], { r: 0.09, color: C.ink });
    const V = B.show3D(P3, D, a, { el: 38, az: -40 + 8 * Math.sin(B.t * 0.3), dist: 12.5, axesA: 0.8, floorA: 0.6 });
    const O = [0, 0, 0];
    V.v3(O, u1, { color: C.i, alpha: a * gin(T.r3 + 0.2) }); V.v3(O, u2, { color: C.j, alpha: a * gin(T.r3 + 0.5) });
    const m = smoother(prog(B.t, T.v3in, T.v3in + 1.2)), w3 = off.map((q, i) => lerp(q, onp[i], m));
    V.v3(O, w3, { color: m > 0.5 ? C.free : C.k, alpha: a * gin(T.v3), width: 9 });
    V.lab(w3.map(q => q * 1.15), 'v₃', { px: 32, a: a * gin(T.v3), color: m > 0.5 ? C.free : C.k, font: F.serif });
    ctag(B.t < T.v3 ? '两个不共线的向量 → 一张平面' : B.t < T.v3in ? 'v₃ 不在平面上 → 整个 ℝ³' : 'v₃ 躺在平面上 → 白加', DX, DY + 330, { px: 36, a: a * gin(T.r3 + 0.4), color: B.t < T.v3in ? C.ink : C.free });
  }

  // ── D：定理 3.2.1 / 张成集 ──
  function shotThm() {
    const a = B.win(T.th - 0.2, T.e11 - 0.3); if (a <= 0) return;
    ctag('定理 3.2.1：张成都是子空间', DX, DY - 300, { px: 38, a: a * gin(T.th), color: C.peri });
    texAt('th1', DX, DY - 170, 44, { alpha: a * gin(T.th2), reveal: rv(T.th2, 1.2) });
    texAt('th2', DX, DY - 70, 44, { alpha: a * gin(T.th3), reveal: rv(T.th3, 1.0) });
    ctag('相加、数乘后还是线性组合 ✓', DX, DY + 20, { px: 32, a: a * gin(T.th3 + 0.8), color: OK });
    ctag('张成集', DX, DY + 150, { px: 40, a: a * gin(T.ss), color: C.peri, font: F.serif });
    texAt('sset', DX, DY + 240, 46, { alpha: a * gin(T.ss + 0.5), reveal: rv(T.ss + 0.5, 1.0) });
  }

  // ── E：例 11 ──
  const G = [['ga', T.ga, T.gaok, true], ['gb', T.gb, T.gbok, true], ['gc', T.gc, T.gcno, false], ['gd', T.gd, T.gdno, false]];
  function shotEx11() {
    const a = B.win(T.e11 - 0.2, T.e12 - 0.3); if (a <= 0) return;
    ctag('例 11：哪些能张成 ℝ³？', DX, DY - 380, { px: 34, a: a * gin(T.e11), color: C.peri });
    // 顶部四个小格
    G.forEach(([k, t0, tv, ok], i) => {
      const x = DX - 300 + i * 200, y = DY - 300, cur = B.t >= t0 - 0.3 && (i === 3 || B.t < G[i + 1][1] - 0.3);
      B.card(x, y, 170, 70, a * gin(T.e11 + 0.4 + 0.1 * i), cur ? C.i : C.inkMid);
      ctag(`(${'abcd'[i]})`, x - 40, y, { px: 32, a: a * gin(T.e11 + 0.4 + 0.1 * i), color: cur ? C.i : C.ink, font: F.serif });
      ctag(ok ? '✓ 能' : '✗ 不能', x + 30, y, { px: 28, a: a * gin(tv), color: ok ? OK : C.free });
    });
    const one = (t0, t1) => a * B.win(t0 - 0.3, t1 - 0.3, 0.3, 0.3);
    let s = one(T.ga, T.gb);
    texAt('ga', DX, DY - 140, 50, { alpha: s, reveal: rv(T.ga, 1.0) }); texAt('ra', DX, DY + 60, 46, { alpha: s * gin(T.ga + 2.0), reveal: rv(T.ga + 2.0, 1.0) });
    B.stamp(DX + 240, DY + 230, true, prog(B.t, T.gaok, T.gaok + 0.4), s, '✓ 能');
    s = one(T.gb, T.gc);
    texAt('gb', DX, DY - 140, 46, { alpha: s, reveal: rv(T.gb, 1.0) }); texAt('rb1', DX, DY + 30, 34, { alpha: s * gin(T.gb + 2.2), reveal: rv(T.gb + 2.2, 1.0) });
    texAt('rb2', DX, DY + 140, 40, { alpha: s * gin(T.gb2), reveal: rv(T.gb2, 1.8), color: C.j });
    B.stamp(DX + 240, DY + 260, true, prog(B.t, T.gbok, T.gbok + 0.4), s, '✓ 能');
    s = one(T.gc, T.gd);
    texAt('gc', DX, DY - 140, 46, { alpha: s, reveal: rv(T.gc, 1.0) }); texAt('rc1', DX, DY + 30, 40, { alpha: s * gin(T.gc2 - 0.4), reveal: rv(T.gc2 - 0.4, 1.0) });
    ctag('第 1 个分量 = 第 3 个分量', DX, DY + 130, { px: 30, a: s * gin(T.gc2 + 0.6), color: C.i });
    texAt('rc2', DX - 150, DY + 220, 40, { alpha: s * gin(T.gc3), color: C.free }); ctag('凑不出来', DX - 150, DY + 300, { px: 30, a: s * gin(T.gc3 + 0.4), color: C.free });
    B.stamp(DX + 240, DY + 230, false, prog(B.t, T.gcno, T.gcno + 0.4), s, '✗ 不能');
    s = one(T.gd, T.ds2 + 1.5);
    texAt('gd', DX, DY - 140, 46, { alpha: s, reveal: rv(T.gd, 1.0) }); texAt('rd1', DX, DY + 30, 38, { alpha: s * gin(T.gd2), reveal: rv(T.gd2, 1.0) });
    texAt('rd2', DX - 70, DY + 200, 38, { alpha: s * gin(T.gd3), reveal: rv(T.gd3, 1.4), color: C.free });
    B.stamp(DX + 280, DY + 200, false, prog(B.t, T.gdno, T.gdno + 0.4), s, '✗ 不能');
    // D02/C21：小结
    const sm = a * gin(T.ds2 + 1.5, 0.5);
    if (sm > 0) {
      ctag('向量多 ≠ 能张成', DX, DY - 60, { px: 46, a: sm, color: C.peri, font: F.serif });
      ctag('关键：有没有“白加”的向量', DX, DY + 40, { px: 36, a: sm * gin(L('C21').s), color: C.ink });
      ctag('→ 下一节：线性相关', DX, DY + 130, { px: 32, a: sm * gin(cue('C21', '正式的名字')), color: C.inkMid });
    }
  }

  // ── F：例 12 ──
  function shotEx12() {
    const a = B.win(T.e12 - 0.2, T.nh - 0.3); if (a <= 0) return;
    ctag('例 12：多项式也能张成', DX, DY - 300, { px: 34, a, color: C.peri });
    ctag('1 − x²，x + 2，x²  张成 P₃', DX, DY - 200, { px: 40, a: a * gin(T.e12 + 0.8), color: C.ink, font: F.serif });
    texAt('p12', DX, DY - 60, 38, { alpha: a * gin(T.e12b), reveal: rv(T.e12b, 1.4) });
    ctag('比较 x²、x、常数项的系数', DX, DY + 30, { px: 30, a: a * gin(T.e12b + 1.6), color: C.inkMid });
    texAt('p12b', DX, DY + 130, 40, { alpha: a * gin(T.e12c), reveal: rv(T.e12c, 2.0), color: C.j });
    ctag('任何 ax² + bx + c 都有解 ✓', DX, DY + 250, { px: 34, a: a * gin(T.e12c + 1.5), color: OK });
  }

  // ── G：定理 3.2.2 ──
  const Q = new Plane({ ox: DX - 120, oy: DY + 110, u: 52, R: 7 });
  function shotNonhom(D) {
    const a = B.win(T.nh - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('定理 3.2.2：Ax = b 的全部解', DX, DY - 380, { px: 32, a: a * gin(T.nh), color: C.peri });
    texAt('th322', DX, DY - 310, 44, { alpha: a * gin(T.nh2), reveal: rv(T.nh2, 1.2) });
    const ga = a * gin(T.ex, 0.5); if (ga <= 0) return;
    B.grid(Q, I2, ga, D, { neu: 0, basis: false, old: 0.16, clipY: DY - 250 });
    texAt('eq', DX + 260, DY - 200, 40, { alpha: ga, color: C.ink });
    const d = [-2, 1];
    const hl = ga * gin(T.ex2, 0.5);
    B.line2(Q.S([-7 * d[0] / 2, -7 * d[1] / 2]), Q.S([7 * d[0] / 2, 7 * d[1] / 2]), C.j, hl, 5);
    B.vec(Q, d, hl, { color: C.j, label: 'N(A)', lx: -110, ly: -10, px: 30 });
    const m = smoother(prog(B.t, T.ex3, T.ex3 + 1.4));
    if (m > 0) {
      const sh = [4 * m, 0];
      B.line2(Q.S([sh[0] - 3 * d[0], sh[1] - 3 * d[1]]), Q.S([sh[0] + 4 * d[0], sh[1] + 4 * d[1]]), C.peri, ga * smooth(m * 2), 6);
      B.vec(Q, [4, 0], ga * gin(T.ex3), { color: C.i, label: 'x₀ = (4, 0)', lx: -60, ly: 50, px: 30 });
    }
    texAt('hom', DX + 260, DY - 130, 34, { alpha: hl, color: C.j });
    ctag('不过原点的直线：零空间平移', DX, DY + 340, { px: 34, a: ga * gin(T.ex4), color: C.peri });
    if (B.t > T.tj - 0.3) { B.card(DX + 210, DY + 0, 470, 110, a * gin(T.tj, 0.5), C.gpt); ctag('同济：R(A) = R(A, b)', DX + 210, DY - 20, { px: 30, a: a * gin(T.tj, 0.5), color: C.gpt }); ctag('⇔ b 在列向量的张成里', DX + 210, DY + 25, { px: 28, a: a * gin(T.tj + 0.6, 0.5), color: C.ink }); }
  }

  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('线性相关', DX, DY - 20, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('“白加”的正式名字', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.lc, t1: T.pt - 0.3, head: '张成', items: [['线性组合', T.lc], ['全部组合 = Span', T.spn, { color: C.peri }]] },
    { t0: T.pt - 0.3, t1: T.r3 - 0.3, head: 'ℝ² 里的张成', items: [['固定 α、β → 一个点', T.fix], ['α、β 动起来 → 铺满', T.mov + 0.4], ['不共线：整个 ℝ²', T.all, { color: OK, mark: OK }], ['共线：一条线', T.line, { color: C.free, mark: C.free }]] },
    { t0: T.r3 - 0.3, t1: T.th - 0.3, head: 'ℝ³ 里的张成', items: [['两个 → 一张平面', T.r3], ['第三个不在面上 → ℝ³', T.v3all, { color: C.k, mark: C.k }], ['躺在面上 → 白加', T.v3w, { color: C.free, mark: C.free }]] },
    { t0: T.th - 0.3, t1: T.e11 - 0.3, head: '定理 3.2.1', items: [['张成是子空间', T.th], ['Span = V → 张成集', T.ss, { color: C.peri }]] },
    { t0: T.e11 - 0.3, t1: T.e12 - 0.3, head: '例 11', items: [['(a) 坐标方向齐全', T.gaok, { color: OK, mark: OK }], ['(b) 倒推总有解', T.gbok, { color: OK, mark: OK }], ['(c) 两个只张成平面', T.gcno, { color: C.free, mark: C.free }], ['(d) det = 0', T.gdno, { color: C.free, mark: C.free }]] },
    { t0: T.e12 - 0.3, t1: T.nh - 0.3, head: '例 12', items: [['P₃ 的张成集', T.e12], ['比较系数', T.e12b]] },
    { t0: T.nh - 0.3, t1: T.end - 0.3, head: '定理 3.2.2', items: [['全部解 = x₀ + N(A)', T.nh2], ['零空间：过原点', T.ex2, { color: C.j, mark: C.j }], ['平移到特解', T.ex3, { color: C.peri }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotDef(); shotSweep(D); shot3D(D); shotThm(); shotEx11(); shotEx12(); shotNonhom(D); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
