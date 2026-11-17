// 第 5 章 5.4 内积空间（Leon 9th §5.4）。
// 分镜：开篇（多项式、函数、矩阵也要长度角度）→ 三条公理卡片 → ℝⁿ 标准 / 加权 → 矩阵内积：逐格相乘求和（例 3）
//       → 函数内积 = 积分：1 与 x 两条曲线、乘积曲线、正负面积抵消（例 1）→ 长度与勾股 → 例 2 cos·sin 在 [−π, π] 抵消 → 傅里叶预告
//       → 投影 / 柯西–施瓦茨 / 夹角 → 范数三条 → 例 5 分量条 → 单位“圆”：菱形 → 圆 → 方 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.4 内积空间', hi: 3, en: 'INNER PRODUCT SPACES',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C05: 0.6, C06: 0.6, C09: 0.6, C11: 0.6, C14: 0.6, C15: 0.6, G01: 0.6, C18: 0.6 },
    post: { C01: 0.6, C03: 1.2, C05: 1.4, C07: 1.6, C08: 1.4, C09: 1.0, C10: 1.2, C12: 1.4, C13: 0.8, C15: 1.2, C16: 2.0, C17: 0.6, G02: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, def: L('C02').s, ax: L('C03').s, ax2: cue('C03', '第二'), ax3: cue('C03', '第三'), std: L('C04').s, w: cue('C04', '也可以加权'),
    mat: L('C05').s, mat2: cue('C05', '例三'), mat3: cue('C05', 'A的长度'), fn: L('C06').s, fn2: cue('C06', '把求和'), d1: L('D01').s,
    e1: L('C07').s, e1b: cue('C07', '例一'), e1c: cue('C07', '看画面'), e1n: L('C08').s, e1p: cue('C08', '勾股定律'), e2: L('C09').s, e2b: cue('C09', 'cos x和sin x'), fo: L('C10').s,
    pj: L('C11').s, pj2: cue('C11', '而且'), cs: L('C12').s, cs2: cue('C12', '证明'), ang: L('C13').s, nm: L('C14').s, nm2: cue('C14', '数乘以后'), nm3: cue('C14', '还有三角'),
    e5: L('C15').s, e5a: cue('C15', '一范数'), e5b: cue('C15', '二范数'), e5c: cue('C15', '无穷范数'), uc: L('C16').s, uc2: cue('C16', '一范数是'), uc3: cue('C16', '无穷范数是'), d2: L('D02').s, rul: L('C17').s,
    tj: L('G01').s, tj2: L('G02').s, sum: L('C18').s, end: L('C19').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('shimmer', T.def, 0.3); TL.sfx('pop', T.ax, 0.3); TL.sfx('pop', T.ax2, 0.3); TL.sfx('pop', T.ax3, 0.3); TL.sfx('pop', T.std, 0.3); TL.sfx('pop', T.w, 0.3);
  TL.sfx('whoosh', T.mat, 0.3); TL.sfx('count', T.mat2 + 0.6, 0.3); TL.sfx('ding_hi', T.mat3, 0.3); TL.sfx('whoosh', T.fn, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.e1b, 0.3); TL.sfx('warp', T.e1c, 0.35); TL.sfx('pop', T.e1n, 0.3); TL.sfx('ding_hi', T.e1p + 1.0, 0.3); TL.sfx('whoosh', T.e2, 0.3); TL.sfx('ding', T.e2b + 1.2, 0.3); TL.sfx('shimmer', T.fo, 0.35);
  TL.sfx('pop', T.pj, 0.3); TL.sfx('pop', T.cs, 0.3); TL.sfx('pop', T.ang, 0.3); TL.sfx('pop', T.nm, 0.3); TL.sfx('pop', T.e5a, 0.3); TL.sfx('pop', T.e5b, 0.3); TL.sfx('pop', T.e5c, 0.3);
  TL.sfx('warp', T.uc2, 0.35); TL.sfx('warp', T.uc3, 0.35); TL.sfx('pluck', T.d2, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C19').e + 0.3, 0.4);

  // ── A：开篇 + 公理 ──
  function shotA() {
    const a = B.win(T.o1 + 0.1, T.mat - 0.3); if (a <= 0) return;
    const go = a * (1 - gin(T.def - 0.2));
    [['多项式', -300, C.i], ['函数', 0, C.j], ['矩阵', 300, C.k]].forEach(([s, dx, col], i) => { const g = go * gin(T.o1 + 0.8 + i * 0.4); B.card(DX + dx, DY - 40, 220, 100, g, col); ctag(s, DX + dx, DY - 40, { px: 40, a: g, color: col, font: F.serif }); });
    ctag('长度？角度？', DX, DY + 110, { px: 48, a: go * gin(T.o1 + 2.2), color: C.peri, font: F.serif });
    const g = a * gin(T.def); if (g <= 0) return;
    texAt('ip', DX, DY - 360, 40, { alpha: g });
    const ga = a * (1 - gin(T.std - 0.2));
    [['ax1', T.ax], ['ax2', T.ax2], ['ax3', T.ax3]].forEach(([k, t0], i) => { const gi = ga * gin(t0); B.card(DX, DY - 220 + i * 120, 820, 96, gi, i === 0 ? C.peri : i === 1 ? C.i : C.j); texAt(k, DX, DY - 220 + i * 120, 34, { alpha: gi }); });
    const gs = a * gin(T.std); B.card(DX, DY - 180, 820, 100, gs, C.peri); texAt('std', DX, DY - 180, 34, { alpha: gs });
    ctag('ℝⁿ：标准内积 / 加权内积', DX, DY - 80, { px: 28, a: gs, color: C.inkMid });
  }

  // ── B：矩阵内积 ──
  function shotB() {
    const a = B.win(T.mat - 0.2, T.fn - 0.3); if (a <= 0) return;
    texAt('mat', DX, DY - 370, 40, { alpha: a * gin(T.mat + 0.3) });
    texAt('matE', DX, DY - 230, 36, { alpha: a * gin(T.mat2) });
    const A = [[1, 1], [1, 2], [3, 3]], Bm = [[-1, 1], [3, 0], [-3, 4]], pr = A.map((r, i) => r.map((v, j) => v * Bm[i][j]));
    let acc = 0, k = 0;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      const t0 = T.mat2 + 0.8 + k * 0.35, g = a * gin(t0), x = DX - 330 + j * 130, y = DY - 60 + i * 100; k++;
      if (g <= 0) continue; acc += pr[i][j] * smooth(prog(B.t, t0, t0 + 0.3));
      B.card(x, y, 110, 80, g, pr[i][j] >= 0 ? C.i : C.free); ctag(`${A[i][j]}×${String(Bm[i][j]).replace('-', '−')}`, x, y - 14, { px: 22, a: g, color: C.inkMid }); ctag(String(pr[i][j]).replace('-', '−'), x, y + 18, { px: 32, a: g, color: pr[i][j] >= 0 ? C.i : C.free, font: F.serif });
    }
    ctag('Σ = ' + Math.round(acc), DX + 30, DY + 40, { px: 44, a: a * gin(T.mat2 + 0.8), color: C.peri, font: F.serif });
    const gr = a * gin(T.mat3); B.card(DX + 50, DY + 320, 640, 90, gr, OK); texAt('matR', DX + 50, DY + 320, 34, { alpha: gr });
    ctag('F 范数', DX + 330, DY + 240, { px: 28, a: gr, color: OK });
  }

  // ── C：函数内积 ──
  const P1 = new Plane({ ox: DX, oy: DY + 120, u: 230, R: 2 });
  const P2 = new Plane({ ox: DX, oy: DY + 120, u: 90, R: 5 });
  function axesF(P, D, a, x0, x1, ticks) {
    ctx.save(); B.K.clip(D); B.line2(P.S([x0, 0]), P.S([x1, 0]), C.ink, a * 0.8, 2); B.line2(P.S([0, -1.6]), P.S([0, 1.8]), C.ink, a * 0.5, 2); ctx.restore();
    ticks.forEach(([v, s]) => { const q = P.S([v, 0]); B.line2([q[0], q[1] - 8], [q[0], q[1] + 8], C.ink, a * 0.8, 2); ctag(s, q[0], q[1] + 32, { px: 24, a: a * 0.8, color: C.inkMid }); });
  }
  function shotC(D) {
    const a = B.win(T.fn - 0.2, T.pj - 0.3); if (a <= 0) return;
    const ex2 = B.t >= T.e2 - 0.3, aA = a * (1 - gin(T.e2 - 0.3)), aB = a * gin(T.e2 - 0.3);
    texAt('fun', DX, DY - 380, 38, { alpha: a * gin(T.fn + 0.3) * (1 - gin(T.e2 - 0.3)) });
    ctag('Σ → ∫ ：无穷多个分量的点积', DX, DY - 300, { px: 28, a: a * gin(T.fn2) * (1 - gin(T.e1b - 0.2)), color: C.inkMid });
    if (aA > 0) {
      axesF(P1, D, aA * gin(T.fn + 0.3), -1.5, 1.5, [[-1, '−1'], [1, '1']]);
      B.curve(P1, D, () => 1, -1, 1, aA * gin(T.e1b), { color: C.i, width: 5 }); B.curve(P1, D, x => x, -1, 1, aA * gin(T.e1b + 0.6), { color: C.j, width: 5 });
      ctag('1', ...P1.S([-1.15, 1]), { px: 30, a: aA * gin(T.e1b), color: C.i, font: F.serif }); ctag('x', ...P1.S([1.15, 1]), { px: 30, a: aA * gin(T.e1b + 0.6), color: C.j, font: F.serif });
      const gA = aA * gin(T.e1c, 0.8); B.area(P1, D, x => x, -1, 1, gA); ctag('−', ...P1.S([-0.55, -0.25]), { px: 44, a: gA, color: C.free }); ctag('+', ...P1.S([0.55, 0.25]), { px: 44, a: gA, color: OK });
      texAt('e1', DX, DY - 300, 36, { alpha: aA * gin(T.e1b + 1.2) });
      const gn = aA * gin(T.e1n); texAt('e1n', DX - 180, DY + 330, 32, { alpha: gn }); texAt('e1p', DX + 230, DY + 330, 32, { alpha: aA * gin(T.e1p) });
    }
    if (aB > 0) {
      axesF(P2, D, aB, -4, 4, [[-Math.PI, '−π'], [Math.PI, 'π']]);
      B.curve(P2, D, Math.cos, -Math.PI, Math.PI, aB * gin(T.e2b), { color: C.i, width: 5 }); B.curve(P2, D, Math.sin, -Math.PI, Math.PI, aB * gin(T.e2b + 0.4), { color: C.j, width: 5 });
      const gp = aB * gin(T.e2b + 1.2, 0.8); B.curve(P2, D, x => Math.sin(x) * Math.cos(x), -Math.PI, Math.PI, gp, { color: C.peri, width: 3, dash: [8, 6] }); B.area(P2, D, x => Math.sin(x) * Math.cos(x), -Math.PI, Math.PI, gp);
      ctag('cos x', ...P2.S([-3.6, 1.25]), { px: 26, a: aB * gin(T.e2b), color: C.i }); ctag('sin x', ...P2.S([1.6, 1.3]), { px: 26, a: aB * gin(T.e2b + 0.4), color: C.j });
      B.card(DX, DY - 330, 900, 96, aB * gin(T.e2 + 0.3), C.peri); texAt('e2', DX, DY - 330, 28, { alpha: aB * gin(T.e2 + 0.3) });
      const gf = aB * gin(T.fo); if (gf > 0) { [1, 2, 3].forEach((k, i) => B.curve(P2, D, x => 0.5 * Math.cos(k * x), -Math.PI, Math.PI, gf * gin(T.fo + 0.5 + i * 0.4) * 0.6, { color: [C.k, C.free, C.ink][i], width: 2 })); ctag('傅里叶：正交的三角函数 = 坐标轴', DX, DY + 340, { px: 30, a: gf, color: OK, font: F.serif }); }
    }
  }

  // ── D：投影、柯西–施瓦茨、夹角、范数 ──
  function shotD() {
    const a = B.win(T.pj - 0.2, T.e5 - 0.3); if (a <= 0) return;
    const g1 = a * gin(T.pj); B.card(DX, DY - 320, 820, 110, g1, C.peri); texAt('proj', DX, DY - 320, 34, { alpha: g1 });
    const g2 = a * gin(T.cs); ctag('定理 5.4.2  柯西–施瓦茨', DX, DY - 210, { px: 28, a: g2, color: C.peri, font: F.serif }); texAt('cs', DX, DY - 150, 38, { alpha: g2 });
    ctag('u = p + (u − p)  →  勾股  →  ‖p‖ ≤ ‖u‖', DX, DY - 80, { px: 28, a: a * gin(T.cs2), color: C.inkMid, font: F.serif });
    texAt('cos', DX, DY + 20, 36, { alpha: a * gin(T.ang) });
    const g4 = a * gin(T.nm); ctag('范数三条', DX, DY + 130, { px: 28, a: g4, color: C.peri, font: F.serif }); texAt('norm', DX, DY + 200, 30, { alpha: g4, reveal: rv(T.nm + 0.3, cue('C14', '内积导出') - T.nm - 0.3) });
    ctag('内积导出的长度 ✓', DX, DY + 280, { px: 28, a: a * gin(cue('C14', '内积导出')), color: OK });
  }

  // ── E：例 5 + 单位圆 ──
  const P3 = new Plane({ ox: DX, oy: DY + 60, u: 210, R: 2 });
  const ball = (p, k) => { const pts = []; for (let i = 0; i <= 240; i++) { const th = i / 240 * Math.PI * 2, c = Math.cos(th), s = Math.sin(th); const e = 2 / p; pts.push([Math.sign(c) * Math.abs(c) ** e * k, Math.sign(s) * Math.abs(s) ** e * k]); } return pts; };
  function poly(pts, col, a, w = 5) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((q, i) => { const s = P3.S(q); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); ctx.stroke(); ctx.restore(); }
  function shotE(D) {
    const a = B.win(T.e5 - 0.2, T.tj - 0.3); if (a <= 0) return;
    const ga = a * (1 - gin(T.uc - 0.2));
    if (ga > 0) {
      texAt('e5', DX, DY - 360, 38, { alpha: ga });
      const X = [4, -5, 3];
      X.forEach((v, i) => { const x = DX - 250 + i * 150, g = ga * gin(T.e5 + 0.5 + i * 0.2), h = Math.abs(v) * 34, mx = Math.abs(v) === 5 && B.t > T.e5c; ctx.save(); ctx.globalAlpha = g * 0.85; ctx.fillStyle = mx ? C.k : v >= 0 ? C.i : C.free; ctx.fillRect(x - 40, DY + 60 - h, 80, h); ctx.restore(); ctag(String(v).replace('-', '−'), x, DY + 95, { px: 32, a: g, color: C.ink, font: F.serif }); });
      // 一范数：首尾相接
      const g1 = ga * gin(T.e5a); if (g1 > 0) { let x0 = DX - 330; [4, 5, 3].forEach((v, i) => { ctx.save(); ctx.globalAlpha = g1 * 0.8; ctx.fillStyle = [C.i, C.free, C.i][i]; ctx.fillRect(x0, DY + 160, v * 50, 30); ctx.restore(); x0 += v * 50; }); ctag('12', x0 + 40, DY + 175, { px: 32, a: g1, color: C.i, font: F.serif }); }
      texAt('e5n', DX, DY + 290, 36, { alpha: ga * gin(T.e5a), reveal: rv(T.e5a, T.e5c + 1.2 - T.e5a) });
    }
    const gb = a * gin(T.uc); if (gb <= 0) return;
    ctx.save(); B.K.clip(D); P3.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: 0.1 * gb, step: 0.5 }); ctx.restore();
    B.line2(P3.S([-1.6, 0]), P3.S([1.6, 0]), C.ink, gb * 0.7, 2); B.line2(P3.S([0, -1.6]), P3.S([0, 1.6]), C.ink, gb * 0.7, 2);
    poly(ball(2, 1), C.j, gb * gin(T.uc + 0.5), 6); ctag('‖·‖₂ = 1  圆', ...P3.S([0.95, 1.12]), { px: 28, a: gb * gin(T.uc + 0.5), color: C.j });
    // 变形：2 → 1 → ∞
    const m1 = smoother(prog(B.t, T.uc2, T.uc2 + 1.2)), m2 = smoother(prog(B.t, T.uc3, T.uc3 + 1.2));
    const pp = m2 > 0 ? lerp(1, 40, m2 * m2) : lerp(2, 1, m1);
    if (m1 > 0) poly(ball(pp, 1), C.peri, gb, 5);
    poly(ball(1, 1), C.i, gb * gin(T.uc2 + 1.2) * 0.8, 4); ctag('‖·‖₁ = 1  菱形', ...P3.S([0, -1.2]), { px: 28, a: gb * gin(T.uc2 + 1.2), color: C.i });
    poly(ball(40, 1), C.k, gb * gin(T.uc3 + 1.2) * 0.8, 4); ctag('‖·‖∞ = 1  正方形', ...P3.S([1.0, -1.15]), { px: 28, a: gb * gin(T.uc3 + 1.2), color: C.k });
    ctag('圆也可以是方的！', DX, DY - 360, { px: 36, a: a * gin(T.d2), color: C.ds, font: F.serif });
    ctag('只有 ‖·‖₂ 来自内积：有勾股、有投影', DX, DY - 300, { px: 28, a: a * gin(T.rul + 0.6), color: OK });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照', DX, DY - 330, { px: 36, a, color: C.gpt, font: F.serif });
    ctag('只在 ℝⁿ 里定义内积', DX, DY - 240, { px: 30, a: a * gin(T.tj + 0.5), color: C.inkMid });
    ctag('也证施瓦茨不等式，用来定义夹角', DX, DY - 180, { px: 30, a: a * gin(cue('G01', '但它也证明')), color: C.ink });
    const g = a * gin(T.tj2); B.card(DX, DY - 30, 620, 120, g, C.gpt); ctag('重点：三条公理 + 柯西–施瓦茨', DX, DY - 50, { px: 32, a: g, color: C.gpt, font: F.serif }); ctag('函数内积：开阔眼界', DX, DY + 5, { px: 26, a: g, color: C.inkMid });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    ctag('内积 = 三条公理', DX, DY - 230, { px: 36, a: a * gin(T.sum + 0.3), color: C.ink, font: F.serif });
    ctag('→ 长度 · 角度 · 正交 · 投影', DX, DY - 140, { px: 32, a: a * gin(cue('C18', '有了内积')), color: C.peri });
    ctag('函数正交 → 傅里叶分析', DX, DY - 50, { px: 32, a: a * gin(cue('C18', '函数也能')), color: OK });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('标准正交基', DX, DY - 10, { px: 100, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('两两正交、长度为一，有什么好事？', DX, DY + 110, { px: 34, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.def - 0.2, t1: T.pj - 0.3, head: '内积', items: [['三条公理', T.ax, { color: C.peri, mark: C.peri }], ['ℝⁿ：标准 / 加权', T.std], ['矩阵：逐元素', T.mat], ['函数：积分', T.fn, { color: OK, mark: OK }], ['1 ⊥ x，cos ⊥ sin', T.e1b]] },
    { t0: T.pj - 0.3, t1: T.end - 0.3, head: '几何照搬', items: [['投影', T.pj], ['柯西–施瓦茨', T.cs, { color: C.peri, mark: C.peri }], ['范数三条', T.nm], ['1 / 2 / ∞ 范数', T.e5, { color: OK, mark: OK }], ['同济：仅 ℝⁿ', T.tj, { color: C.gpt, mark: C.gpt }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(); shotC(D); shotD(); shotE(D); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
