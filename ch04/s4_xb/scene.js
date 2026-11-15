// 第 4 章 复习（下）：Test B 精选 3 题 + 同济期末常见题型 1 题 + 全章总结（Leon 9th Chapter 4 Test B 第 3、4、9 题）。
// 期中卷里线性变换几乎不出现（见 docs/第四章制作计划.md §3），片中由 GPT 说明，不编造“某年期中考过”。
// 分镜：说明卡 → TB3 套路卡①② → TB4 套路卡③ + 3D 压平面 → TB9 过渡矩阵链 + 验列 + B + 不变量秒验
//       → 同济：相似求参数（迹、行列式）+ 交换块 2D → 五条总结 → 一句话 → 第五章预告。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_proud', 'ds_happy', 'ds_think', 'ds_shock', 'gpt_explain', 'gpt_point', 'gpt_cross'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第四章 · 复习', title: '计算题 + 同济题型', hi: 3, en: 'CHAPTER TEST B',
    titleEnd: () => B.L('G02').s,
    pre: { C01: 0.8, C02: 0.4, C04: 0.4, C06: 0.8, C08: 0.4, C09: 0.4, C10: 0.8, C12: 0.4, C15: 0.4, C17: 0.4, G03: 0.8, G04: 0.4, C20: 0.4, C22: 0.8, D08: 0.4, G06: 0.8 },
    post: { C03: 0.6, C05: 0.8, C08: 0.6, C09: 1.2, C13: 0.6, C14: 0.8, C16: 0.6, C18: 0.8, C19: 0.8, D07: 0.4, G05: 0.6, C20: 0.6, C21: 0.8, C25: 0.6, C26: 0.8, G06: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    g1: L('G01').s, g2: L('G02').s, d1: L('D01').s,
    q1: L('C01').s, q1q: cue('C01', '求核'), c1: L('C02').s, c1s: cue('C02', '三个分量'), d2: L('D02').s, geo: L('C03').s, c2: L('C04').s, c2L: cue('C04', '一、零、一的像'), c2S: cue('C04', '所以S的像'), why: L('C05').s,
    q2: L('C06').s, d3: L('D03').s, cols: L('C07').s, cols3: cue('C07', 'e三的像'), c3: L('C08').s, c3y: cue('C08', '设y等于'), c3e: cue('C08', '于是'), v3: L('C09').s, v3e: cue('C09', 'e三方向'),
    q3: L('C10').s, q3A: cue('C10', 'L在u这组基下'), ab: L('C11').s, d4: L('D04').s, ch: L('C12').s, ch1: cue('C12', 'v坐标先乘V'), ch2: cue('C12', '再乘U逆'),
    S: L('C13').s, chk: L('C14').s, bq: L('C15').s, bB: L('C16').s, d5: L('D05').s, tr: L('C17').s, dt: L('C18').s, rule: L('C19').s,
    tj: L('G03').s, d6: L('D06').s, eq: L('G04').s, eqd: cue('G04', '行列式相等'), sol: L('D07').s, warn: L('G05').s, ver: L('C20').s, ver2: cue('C20', '把一、负一'), diag: L('C21').s,
    s1: L('C22').s, s2: L('C23').s, s3: L('C24').s, s4: L('C25').s, s5: cue('C25', '第五'), d8: L('D08').s, one: L('C26').s, nx: L('G06').s, end: L('D09').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.g2, 0.3); TL.sfx('sting', T.d1, 0.28);
  TL.sfx('whoosh', T.q1, 0.3); TL.sfx('pop', T.c1, 0.3); TL.sfx('pop', T.c1s, 0.3); TL.sfx('ding_hi', T.d2 + 0.5, 0.3); TL.sfx('pop', T.c2, 0.3); TL.sfx('pop', T.c2L, 0.3); TL.sfx('ding_hi', T.c2S, 0.3);
  TL.sfx('whoosh', T.q2, 0.3); TL.sfx('pop', T.cols, 0.3); TL.sfx('pop', T.c3, 0.3); TL.sfx('ding_hi', T.c3e, 0.3); TL.sfx('warp', T.v3 + 0.4, 0.4);
  TL.sfx('whoosh', T.q3, 0.3); TL.sfx('pop', T.ab, 0.3); TL.sfx('pluck', T.d4, 0.3); TL.sfx('pop', T.ch1, 0.3); TL.sfx('pop', T.ch2, 0.3); TL.sfx('ding_hi', T.S + 1.0, 0.3); TL.sfx('check', T.chk + 2.0, 0.3);
  TL.sfx('pop', T.bq, 0.3); TL.sfx('ding_hi', T.bB + 1.0, 0.3); TL.sfx('pluck', T.d5, 0.3); TL.sfx('check', L('C17').e - 0.4, 0.3); TL.sfx('check', L('C18').e - 0.4, 0.3); TL.sfx('shimmer', T.rule, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pluck', T.d6, 0.3); TL.sfx('pop', T.eq, 0.3); TL.sfx('pop', T.eqd, 0.3); TL.sfx('ding_hi', T.sol + 0.6, 0.3); TL.sfx('error_buzz', cue('G05', '但反过来'), 0.25); TL.sfx('warp', T.ver2, 0.4);
  [T.s1, T.s2, T.s3, T.s4, T.s5].forEach(x => TL.sfx('pop', x, 0.3)); TL.sfx('shimmer', T.d8, 0.4); TL.sfx('bell_soft', T.nx, 0.3); TL.sfx('shimmer', L('D09').e + 0.3, 0.4);

  const card = (k, x, y, w, h, a, col, px = 40, opt = {}) => { if (a <= 0) return; B.card(x, y, w, h, a, col); texAt(k, x, y, px, { alpha: a, ...opt }); };
  const recipe = (n, txt, y, a, col) => { if (a <= 0) return; B.card(DX, y, 640, 74, a, col); ctag(`套路卡 ${n}`, DX - 220, y, { px: 28, a, color: col, font: F.serif }); ctag(txt, DX + 70, y, { px: 30, a, color: C.ink }); };

  function shotIntro() {
    const a = B.win(T.g1 + 0.2, T.q1 - 0.3); if (a <= 0) return;
    B.card(DX, DY - 180, 640, 110, a * gin(T.g1 + 0.5), C.gpt); ctag('翻了 9 份期中卷（2015–2026）', DX, DY - 200, { px: 30, a: a * gin(T.g1 + 0.5), color: C.ink }); ctag('线性变换：很少出现 → 主要考在期末', DX, DY - 155, { px: 28, a: a * gin(cue('G01', '很少出现')), color: C.gpt });
    const g = a * gin(T.g2);
    B.card(DX - 180, DY + 10, 300, 120, g, C.peri); ctag('Test B', DX - 180, DY - 15, { px: 32, a: g, color: C.peri, font: F.serif }); ctag('第 3、4、9 题', DX - 180, DY + 30, { px: 28, a: g, color: C.ink });
    const g2 = a * gin(cue('G02', '再加')); B.card(DX + 180, DY + 10, 300, 120, g2, C.gpt); ctag('同济期末', DX + 180, DY - 15, { px: 32, a: g2, color: C.gpt, font: F.serif }); ctag('相似求参数', DX + 180, DY + 30, { px: 28, a: g2, color: C.ink });
    ctag('来吧！', DX, DY + 180, { px: 40, a: a * gin(T.d1), color: C.ds, font: F.serif });
  }

  // ── TB3 ──
  function shotQ1() {
    const a = B.win(T.q1 - 0.2, T.q2 - 0.3); if (a <= 0) return;
    ctag('第 1 题 · Test B 第 3 题', DX, DY - 390, { px: 30, a, color: C.peri });
    texAt('b3', DX, DY - 320, 30, { alpha: a, reveal: prog(B.t, T.q1 + 0.3, L('C01').e - 1.0) });
    recipe('①', '求核 = 解 L(x) = 0', DY - 220, a * gin(T.c1), C.free);
    texAt('b3s', DX, DY - 130, 30, { alpha: a * gin(T.c1s), reveal: rv(T.c1s, 2.5) });
    card('b3k', DX, DY - 40, 520, 80, a * gin(T.d2 + 0.5), C.free, 38, { color: C.free });
    ctag('分量同加一个常数 → 差不变 → 输出不变', DX, DY + 40, { px: 28, a: a * gin(T.geo), color: C.inkMid });
    recipe('②', '求像 = 把张成向量送过去', DY + 130, a * gin(T.c2), C.j);
    texAt('b3L', DX - 175, DY + 225, 30, { alpha: a * gin(T.c2L) }); card('b3S', DX + 230, DY + 225, 330, 70, a * gin(T.c2S), C.j, 32, { color: C.j });
    texAt('b3c', DX, DY + 320, 34, { alpha: a * gin(T.why) });
  }

  // ── TB4 ──
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3 });
  const M4 = [[0, 1, 0], [1, 0, 0], [1, 1, 0]];
  const PTS = []; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) PTS.push([i * 0.7, j * 0.7, k * 0.7]);
  function shotQ2(D) {
    const a = B.win(T.q2 - 0.2, T.q3 - 0.3); if (a <= 0) return;
    const alg = a * (1 - gin(T.v3 - 0.2, 0.5));
    if (alg > 0) {
      ctag('第 2 题 · Test B 第 4 题', DX, DY - 390, { px: 30, a: alg, color: C.peri });
      texAt('b4', DX, DY - 320, 40, { alpha: alg });
      ctag('值域 = 列空间 → 先写标准矩阵', DX, DY - 240, { px: 28, a: alg * gin(T.d3), color: C.ds });
      card('b4A', DX - 220, DY - 110, 270, 190, alg * gin(T.cols), C.peri, 40);
      ctag('e₃ → 0', DX - 220, DY + 10, { px: 26, a: alg * gin(T.cols3), color: C.k });
      ctag('值域 = 前两列张成的平面', DX + 180, DY - 110, { px: 30, a: alg * gin(cue('C07', '所以值域')), color: C.j });
      recipe('③', '值域写成方程', DY + 90, alg * gin(T.c3), C.j);
      texAt('b4y', DX, DY + 200, 34, { alpha: alg * gin(T.c3y) });
      card('b4e', DX, DY + 320, 520, 80, alg * gin(T.c3e), C.j, 36, { color: C.j });
    }
    const g3 = a * gin(T.v3 - 0.2, 0.5); if (g3 <= 0) return;
    const s = smoother(prog(B.t, T.v3 + 0.4, T.v3 + 2.6));
    const Ms = M4.map((r, i) => r.map((v, j) => lerp(i === j ? 1 : 0, v, s)));
    P3.reset();
    P3.setPlane(0, [1, 1, -1], { color: C.j, alpha: 0.3 * gin(T.v3 + 0.3), scale: outCubic(prog(B.t, T.v3 + 0.3, T.v3 + 1.2)) });
    P3.setLine(0, [0, 0, 1], { color: C.k, width: 6, alpha: gin(T.v3e) * (1 - 0.6 * s), grow: 1 });
    P3.setPoint(0, [0, 0, 0], { r: 0.1, color: C.k });
    const V = B.show3D(P3, D, g3, { el: 22, az: -62 + 6 * Math.sin(B.t * 0.25), dist: 14, axesA: 0.6, floorA: 0.3 });
    for (const p of PTS) { const q = [0, 1, 2].map(i => Ms[i][0] * p[0] + Ms[i][1] * p[1] + Ms[i][2] * p[2]); const xy = V.pr(q); B.dot(xy[0], xy[1], 7, C.i, g3 * 0.85); }
    ctag('ℝ³ → 平面 y₃ = y₁ + y₂', DX - 170, DY - 330, { px: 32, a: g3, color: C.j, font: F.serif });
    ctag('e₃ 方向 → 0', DX - 300, DY + 300, { px: 28, a: g3 * gin(T.v3e), color: C.k });
    ctag('核 1 维 + 值域 2 维 = 3', DX + 220, DY + 330, { px: 30, a: g3 * gin(cue('C09', '核一维')), color: OK });
  }

  // ── TB9 ──
  function shotQ3() {
    const a = B.win(T.q3 - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('第 3 题 · Test B 第 9 题', DX, DY - 390, { px: 30, a, color: C.peri });
    texAt('b9', DX, DY - 325, 30, { alpha: a });
    const top = a * (1 - gin(T.bq - 0.2));
    texAt('b9A', DX - 220, DY - 230, 34, { alpha: a * gin(T.q3A) });
    ctag('(a) 从 v 到 u 的过渡矩阵   (b) L 在 v 下的矩阵', DX + 200, DY - 230, { px: 26, a: a * gin(T.ab), color: C.ink });
    ctag('方向陷阱！', DX, DY - 165, { px: 30, a: top * gin(T.d4) * (1 - gin(T.ch)), color: C.free, font: F.serif });
    // 链：v 坐标 →V→ 标准 →U⁻¹→ u 坐标
    const xs = [DX - 300, DX, DX + 300], y = DY - 140, lab = ['v 坐标', '标准坐标', 'u 坐标'], col = [C.j, C.ink, C.i], ts = [T.ch, T.ch1, T.ch2];
    xs.forEach((x, i) => { const g = top * gin(ts[i]); B.card(x, y, 170, 70, g, col[i]); ctag(lab[i], x, y, { px: 26, a: g, color: C.ink }); });
    ['chV', 'chU'].forEach((k, i) => { const g = top * gin(ts[i + 1]); arrow(ctx, [xs[i] + 92, y], [xs[i + 1] - 92, y], { color: C.peri, width: 5, head: 18, alpha: g, grow: gin(ts[i + 1], 0.6) }); texAt(k, (xs[i] + xs[i + 1]) / 2, y - 40, 32, { alpha: g, color: C.peri }); });
    texAt('b9S', DX, DY - 30, 32, { alpha: top * gin(T.S), reveal: rv(T.S, 2.5) });
    texAt('b9c', DX, DY + 90, 32, { alpha: top * gin(T.chk) });
    B.stamp(DX + 300, DY + 185, true, gin(T.chk + 2.0, 0.4), top * gin(T.chk + 2.0));
    // (b)
    const gb = a * gin(T.bq);
    if (gb > 0) {
      card('b9B0', DX, DY - 150, 300, 80, gb, C.peri, 40);
      ctag('翻译 → 变换 → 翻译回去', DX, DY - 85, { px: 26, a: gb, color: C.inkMid });
      texAt('b9B', DX, DY + 10, 30, { alpha: a * gin(T.bB), reveal: rv(T.bB, 3.0) });
      ctag('这么大，算错了？！', DX, DY + 110, { px: 30, a: a * gin(T.d5) * (1 - gin(T.tr)), color: C.free, font: F.serif });
      ctag('不变量秒验', DX - 320, DY + 160, { px: 28, a: a * gin(T.tr), color: OK });
      texAt('b9t', DX + 40, DY + 160, 32, { alpha: a * gin(T.tr + 0.4) });
      texAt('b9d', DX + 40, DY + 235, 32, { alpha: a * gin(T.dt + 0.4) });
      const gr = a * gin(T.rule); B.card(DX, DY + 335, 760, 90, gr, OK); ctag('对得上 ≠ 全对；对不上 ⇒ 一定错', DX, DY + 335, { px: 32, a: gr, color: OK });
    }
  }

  // ── 同济 ──
  const PS = new Plane({ ox: DX + 200, oy: DY + 175, u: 80, R: 2 });
  function shotTJ(D) {
    const a = B.win(T.tj - 0.2, T.s1 - 0.3); if (a <= 0) return;
    ctag('第 4 题 · 同济期末常见题型：相似求参数', DX, DY - 390, { px: 30, a, color: C.gpt });
    texAt('tj', DX, DY - 290, 38, { alpha: a, reveal: prog(B.t, T.tj + 0.3, L('G03').e - 1.0) });
    ctag('还没学特征值？', DX, DY - 190, { px: 30, a: a * gin(T.d6) * (1 - gin(T.eq)), color: C.ds, font: F.serif });
    const up = a * (1 - gin(T.ver - 0.2) * 0.0);
    texAt('tjt', DX - 200, DY - 180, 38, { alpha: up * gin(T.eq + 0.4) }); texAt('tjd', DX + 210, DY - 180, 38, { alpha: up * gin(T.eqd) });
    card('tjs', DX, DY - 90, 340, 80, a * gin(T.sol + 0.6), OK, 42, { color: OK });
    const gw = a * gin(T.warn) * (1 - gin(T.ver - 0.2));
    B.card(DX, DY + 60, 760, 130, gw, C.free); ctag('已知相似 → 用必要条件解参数 ✓', DX, DY + 35, { px: 30, a: gw, color: OK }); ctag('tr、det 相等 → 证明相似 ✗', DX, DY + 85, { px: 30, a: gw * gin(cue('G05', '但反过来')), color: C.free });
    // 验证：交换块
    const gv = a * gin(T.ver); if (gv > 0) {
      card('tjb', DX - 260, DY + 120, 200, 120, gv, C.peri, 40); ctag('x = 0 时右下角', DX - 260, DY + 210, { px: 24, a: gv, color: C.inkMid });
      const s = smoother(prog(B.t, T.ver2, T.ver2 + 1.4));
      const M = lerpM(I2, [[0, 1], [1, 0]], s);
      B.grid(PS, M, gv, D, { old: 0.15, neu: 0.45, basis: false, clipY: DY + 30 });
      const O = PS.S([0, 0], I2);
      const p1 = PS.S(mv(M, [1, 1]), I2), p2 = PS.S(mv(M, [1, -1]), I2);
      arrow(ctx, O, p1, { color: C.j, width: 7, head: 22, alpha: gv }); arrow(ctx, O, p2, { color: C.free, width: 7, head: 22, alpha: gv });
      ctag('(1, 1) 不动：×1', p1[0] + 95, p1[1] - 5, { px: 24, a: gv, color: C.j }); ctag(s > 0.5 ? '(1, −1) 反向：×(−1)' : '(1, −1)', s > 0.5 ? p2[0] - 120 : p2[0] + 50, s > 0.5 ? p2[1] - 5 : p2[1] + 25, { px: 24, a: gv, color: C.free });
      ctag('合适的基下 = diag(2, 1, −1)', DX, DY + 360, { px: 30, a: a * gin(T.diag), color: OK });
    }
  }
  const mv = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];

  // ── 总结 ──
  function shotSum() {
    const a = B.win(T.s1 - 0.2, T.nx - 0.3); if (a <= 0) return;
    ctag('第四章总结', DX, DY - 390, { px: 38, a, color: C.peri, font: F.serif });
    const it = [['一', '保持线性组合：网格平行等距，原点不动', T.s1, C.i], ['二', '列 = 基向量的落脚点；复合 = 乘积', T.s2, C.j], ['三', '核、值域 = 零空间、列空间；维数相加', T.s3, C.free],
      ['四', '任意基：第 j 列 = L(vⱼ) 的 F 坐标', T.s4, C.k], ['五', 'B = S⁻¹AS：tr、det 不变', T.s5, C.peri]];
    const up = a * (1 - 0.65 * gin(T.d8));
    it.forEach(([n, s, t0, col], i) => { const y = DY - 300 + i * 92, g = up * gin(t0); B.card(DX, y, 780, 76, g, col); ctag(n, DX - 350, y, { px: 34, a: g, color: col, font: F.serif }); ctag(s, DX + 30, y, { px: 30, a: g, color: C.ink }); });
    const g = a * gin(T.d8); B.card(DX, DY + 180, 780, 110, g, C.ds);
    ctag('矩阵 = 线性变换在一组基下的坐标写法', DX, DY + 180, { px: 34, a: g, color: C.ink, font: F.serif });
    ctag('—— 这就是整个第四章', DX + 180, DY + 270, { px: 28, a: a * gin(T.one), color: C.inkMid });
  }
  function shotNext() {
    const a = B.win(T.nx - 0.1, 1e9); if (a <= 0) return;
    ctag('下一章', DX, DY - 160, { px: 34, a: a * gin(T.nx), color: C.inkMid });
    ctag('第五章  正交性', DX, DY - 60, { px: 88, a: a * gin(T.nx + 0.3, 0.5), color: C.peri, font: F.serif });
    const it = ['夹角', '投影', '最小二乘', '正交基'];
    it.forEach((s, i) => { const x = DX - 270 + i * 180, g = a * gin(cue('G06', s) + 0.1); B.card(x, DY + 70, 150, 64, g, C.j); ctag(s, x, DY + 70, { px: 28, a: g, color: C.ink }); });
    ctag('第四章通关！', DX, DY + 200, { px: 44, a: a * gin(T.end), color: OK, font: F.serif });
  }

  const SECS = [
    { t0: T.q1 - 0.3, t1: T.q3 - 0.3, head: '三张套路卡', items: [['① 求核：解 L(x) = 0', T.c1, { color: C.free, mark: C.free }], ['② 求像：送张成向量', T.c2, { color: C.j, mark: C.j }], ['③ 值域写成方程', T.c3, { color: C.j, mark: C.j }]] },
    { t0: T.q3 - 0.3, t1: T.tj - 0.3, head: 'TB9 换基', items: [['S = U⁻¹V', T.S, { color: C.peri, mark: C.peri }], ['验一列', T.chk], ['B = S⁻¹AS', T.bq], ['tr、det 秒验', T.tr, { color: OK, mark: OK }]] },
    { t0: T.tj - 0.3, t1: T.s1 - 0.3, head: '同济题型', items: [['迹相等', T.eq], ['行列式相等', T.eqd], ['x = 0，y = 1', T.sol, { color: OK, mark: OK }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotIntro(); shotQ1(); shotQ2(D); shotQ3(); shotTJ(D); shotSum(); shotNext(); B.left(SECS); });
  }
  return { TL, draw };
}
