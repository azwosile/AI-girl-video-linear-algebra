// 第 7 章 7.4 矩阵范数（Leon 9th §7.4 前半：弗罗贝尼乌斯范数、相容 / 从属范数、定理 7.4.3 ‖A‖₂ = σ₁、1 范数 / ∞ 范数的列和 / 行和、例 1、‖I‖、正交矩阵）。
// 分镜：矩阵元素排成一条长向量 → 3B1B：单位圆被 A 拉成椭圆，最长半轴 = σ₁ → 菱形 / 正方形被拉成平行四边形，最远顶点决定范数
//       → 例 1 四阶矩阵：列和 / 行和条 → ‖I‖₂ vs ‖I‖_F → Q 只转不拉 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, Plane, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_proud', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.4 矩阵范数', hi: 3, en: 'MATRIX NORMS',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C07: 0.4, C11: 0.6, C13: 0.6, C15: 0.6, G01: 0.6, C16: 0.6 },
    post: { C01: 0.6, C02: 1.0, C03: 1.0, C04: 0.8, C05: 1.2, C06: 1.2, C07: 1.0, C08: 1.2, C09: 1.2, C10: 1.0, C11: 1.4, C13: 0.8, C14: 1.0, C15: 1.2, G01: 0.6, C16: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, fr: L('C02').s, fr2: cue('C02', '弗罗贝尼乌斯范数'), fr3: cue('C02', '长长的向量'), ax: L('C03').s, ax2: cue('C03', '不超过范数的乘积'), ax3: cue('C03', 'n次方'),
    sb: L('C04').s, sb2: cue('C04', '单位向量喂进去'), sb3: cue('C04', '就叫作'), tw: L('C05').s, tw2: cue('C05', '最长的半轴'), tw3: cue('C05', '西格玛一'), th: L('C06').s, th2: cue('C06', '三点六一八'),
    d1: L('D01').s, bl: L('C07').s, bl2: cue('C07', '无穷范数的单位圆'), bl3: cue('C07', '最远的那个顶点'), on: L('C08').s, on2: cue('C08', '变成A的各列'), on3: cue('C08', '最大的那一个'),
    in: L('C09').s, in2: cue('C09', '符号一致'), in3: cue('C09', '最大的那一个'), mn: L('C10').s, mn2: cue('C10', '一竖着写'), mn3: cue('C10', '无穷横着躺'),
    e1: L('C11').s, e1b: cue('C11', '十一、六、十四、十三'), e1c: cue('C11', '一范数是十四'), e1d: cue('C11', '十二、十五'), e1e: cue('C11', '无穷范数是十五'), d2: L('D02').s, pr: L('C12').s,
    cp: L('C13').s, cp2: cue('C13', '叫作相容'), ie: L('C14').s, ie2: cue('C14', '单位阵就是例子'), q: L('C15').s, q2: cue('C15', '二范数等于一'), tj: L('G01').s, sum: L('C16').s, end: L('C17').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.fr2, 0.3); TL.sfx('whoosh', T.fr3, 0.3); TL.sfx('pop', T.ax2, 0.3); TL.sfx('sting', T.sb, 0.3); TL.sfx('warp', T.sb2, 0.3); TL.sfx('pop', T.tw2, 0.3); TL.sfx('ding', T.tw3, 0.3); TL.sfx('pop', T.th2, 0.3);
  TL.sfx('pluck', T.d1, 0.3); TL.sfx('warp', T.bl + 0.5, 0.3); TL.sfx('pop', T.bl3, 0.3); TL.sfx('pop', T.on2, 0.3); TL.sfx('ding', T.on3, 0.3); TL.sfx('pop', T.in2, 0.3); TL.sfx('ding', T.in3, 0.3); TL.sfx('pluck', T.mn2, 0.3); TL.sfx('pluck', T.mn3, 0.3);
  TL.sfx('pop', T.e1, 0.3); TL.sfx('ding_hi', T.e1c, 0.3); TL.sfx('ding_hi', T.e1e, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.cp2, 0.3); TL.sfx('pop', T.ie2, 0.3); TL.sfx('shimmer', T.q, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C17').e + 0.3, 0.4);

  // ── A：弗罗贝尼乌斯 + 公理 ──
  const AM = [[2, 1], [1, 3]];
  function shotA() {
    const a = B.win(T.o - 0.2, T.sb - 0.3); if (a <= 0) return;
    ctag('矩阵有多大？', DX, DY - 390, { px: 38, a: a * gin(T.o + 0.4), color: C.peri, font: F.serif });
    const fl = smoother(prog(B.t, T.fr3, T.fr3 + 1.2)), g = a * gin(T.fr);
    // 2×2 元素 → 一条向量
    const cells = [[2, 0, 0], [1, 0, 1], [1, 1, 0], [3, 1, 1]];
    cells.forEach(([v, i, j], k) => { const x = lerp(DX - 45 + j * 90, DX - 225 + k * 150, fl), y = lerp(DY - 290 + i * 64, DY - 260, fl); B.tag(String(v), x, y, { px: 40, a: g, color: C.ink, font: F.serif, align: 'center' }); });
    if (fl < 0.5) B.mat(DX, DY - 258, [['', ''], ['', '']], g * (1 - fl * 2), { cw: 90, ch: 64 });
    else B.mat(DX, DY - 260, [['', '', '', '']], g * (fl * 2 - 1), { cw: 150, ch: 70 });
    texAt('F', DX, DY - 140, 38, { alpha: a * gin(T.fr2) });
    ctag('= 把 A 当长向量量长度', DX, DY - 60, { px: 28, a: a * gin(T.fr3 + 1.2), color: C.inkMid });
    ctag('非负 · 数乘 · 三角不等式', DX, DY + 30, { px: 30, a: a * gin(T.ax), color: C.ink });
    B.card(DX, DY + 120, 420, 80, a * gin(T.ax2), C.peri); texAt('iv', DX, DY + 120, 38, { alpha: a * gin(T.ax2) });
    ctag('‖Aⁿ‖ ≤ ‖A‖ⁿ', DX, DY + 210, { px: 34, a: a * gin(T.ax3), color: C.peri, font: F.serif });
  }

  // ── B：单位圆 → 椭圆 ──
  const P = new Plane({ ox: DX, oy: DY + 90, u: 62, R: 6 });
  function shotB(D) {
    const a = B.win(T.sb - 0.2, T.d1 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.sb2, T.sb2 + 2.0));
    B.grid(P, [[1, 0], [0, 1]], a, { x: D.x, y: P.oy, r: 330 }, { neu: 0, basis: false, old: 0.12 });
    for (let k = 0; k < 16; k++) { const th = 2 * Math.PI * k / 16, u = [Math.cos(th), Math.sin(th)], Ms = [[lerp(1, AM[0][0], s), lerp(0, AM[0][1], s)], [lerp(0, AM[1][0], s), lerp(1, AM[1][1], s)]];
      const v = [Ms[0][0] * u[0] + Ms[0][1] * u[1], Ms[1][0] * u[0] + Ms[1][1] * u[1]]; B.vec(P, v, a * gin(T.sb2) * 0.55, { color: C.periLt, width: 3, head: 12 }); }
    const r = B.ball(P, AM, s, a, { kind: 'two', color: C.peri });
    const gt = a * gin(T.tw2); if (gt > 0) { const f = r.far; arrow(ctx, P.S([0, 0]), P.S(f), { color: C.i, width: 7, head: 22, alpha: gt }); B.tag('σ₁ ≈ 3.618', P.S(f)[0] + 14, P.S(f)[1] - 10, { px: 30, a: gt, color: C.i, font: F.serif }); }
    texAt('sub', DX, DY - 380, 36, { alpha: a * gin(T.sb3) });
    B.card(DX, DY - 290, 300, 76, a * gin(T.tw3), C.i); texAt('two', DX, DY - 290, 40, { alpha: a * gin(T.tw3) });
    texAt('Am', DX, DY - 205, 32, { alpha: a * gin(T.th) });
    ctag('定理 7.4.3', DX + 330, DY - 290, { px: 26, a: a * gin(T.th), color: C.inkMid });
  }

  // ── C：菱形、正方形 ──
  const M2 = [[1, 2], [0, 2]];
  const PL = new Plane({ ox: DX - 230, oy: DY + 110, u: 50, R: 4 }), PR = new Plane({ ox: DX + 230, oy: DY + 110, u: 50, R: 4 });
  function shotC() {
    const a = B.win(T.d1 - 0.2, T.e1 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.bl + 0.5, T.bl + 2.2));
    ctag('A = [1 2; 0 2]', DX, DY - 390, { px: 34, a: a * gin(T.bl), color: C.ink, font: F.serif });
    [PL, PR].forEach(P0 => { B.line2(P0.S([-4, 0]), P0.S([4, 0]), C.inkMid, a * 0.35, 2); B.line2(P0.S([0, -3]), P0.S([0, 4]), C.inkMid, a * 0.35, 2); });
    const r1 = B.ball(PL, M2, s, a * gin(T.bl), { kind: 'one', color: C.i }), r2 = B.ball(PR, M2, s, a * gin(T.bl2), { kind: 'inf', color: C.j });
    ctag('1 范数：菱形', PL.ox, DY - 300, { px: 30, a: a * gin(T.bl), color: C.i }); ctag('∞ 范数：正方形', PR.ox, DY - 300, { px: 30, a: a * gin(T.bl2), color: C.j });
    const gf = a * gin(T.bl3);
    if (gf > 0) { B.dot(...PL.S(r1.far), 11, C.i, gf); B.dot(...PR.S(r2.far), 11, C.j, gf); }
    // 1 范数：顶点 = 各列
    const go = a * gin(T.on2); if (go > 0) {
      arrow(ctx, PL.S([0, 0]), PL.S([1, 0], M2), { color: C.ink, width: 5, head: 16, alpha: go }); arrow(ctx, PL.S([0, 0]), PL.S([0, 1], M2), { color: C.i, width: 6, head: 18, alpha: go });
      B.tag('列 1：|1| + |0| = 1', PL.ox - 200, DY - 240, { px: 24, a: go, color: C.inkMid }); B.tag('列 2：|2| + |2| = 4', PL.ox - 200, DY - 200, { px: 24, a: go, color: C.i });
      texAt('one', PL.ox, DY + 280, 30, { alpha: a * gin(T.on3) });
    }
    const gi = a * gin(T.in2); if (gi > 0) {
      arrow(ctx, PR.S([0, 0]), PR.S([1, 1], M2), { color: C.j, width: 6, head: 18, alpha: gi });
      B.tag('x = (1, 1)：行 1 → 1 + 2 = 3', PR.ox - 200, DY - 240, { px: 24, a: gi, color: C.j }); B.tag('行 2 → 0 + 2 = 2', PR.ox - 200, DY - 200, { px: 24, a: gi, color: C.inkMid });
      texAt('inf', PR.ox, DY + 280, 30, { alpha: a * gin(T.in3) });
    }
    ctag('‖A‖₁ = 4', PL.ox, DY + 340, { px: 30, a: a * gin(T.on3 + 0.8) * (1 - gin(T.mn - 0.2)), color: C.i, font: F.serif }); ctag('‖A‖∞ = 3', PR.ox, DY + 340, { px: 30, a: a * gin(T.in3 + 0.8) * (1 - gin(T.mn - 0.2)), color: C.j, font: F.serif });
    const gm = a * gin(T.mn); if (gm > 0) {
      ctx.save(); ctx.globalAlpha = gm * 0.9; ctx.fillStyle = C.i; ctx.fillRect(PL.ox - 8, DY - 160 - 60, 16, 120); ctx.fillStyle = C.j; ctx.fillRect(PR.ox - 70, DY - 168, 140, 16); ctx.restore();
      ctag('1 → 列', PL.ox + 70, DY - 160, { px: 30, a: a * gin(T.mn2), color: C.i, font: F.serif }); ctag('∞ → 行', PR.ox, DY - 120, { px: 30, a: a * gin(T.mn3), color: C.j, font: F.serif });
    }
  }

  // ── D：例 1 ──
  const A4 = [[-3, 2, 4, -3], [5, -2, -3, 5], [2, 1, -6, 4], [1, 1, 1, 1]], CS = [11, 6, 14, 13], RS = [12, 15, 13, 4];
  function shotD() {
    const a = B.win(T.e1 - 0.2, T.cp - 0.3); if (a <= 0) return;
    ctag('例 1', DX - 340, DY - 380, { px: 34, a: a * gin(T.e1), color: C.inkMid, font: F.serif });
    const cw = 96, ch = 66, x = DX - 70, y = DY - 150;
    const m = B.mat(x, y, A4, a * gin(T.e1), { cw, ch, px: 34, cell: (i, j) => (B.t > T.e1c && j === 2 && B.t < T.e1d ? { bg: C.i, a: 0.2 } : B.t > T.e1e && i === 1 ? { bg: C.j, a: 0.2 } : null) });
    if (m) {
      CS.forEach((v, j) => { const [cx] = m.at(0, j); const g = a * gin(T.e1b + j * 0.3); ctag(String(v), cx, m.y0 + m.H + 40, { px: 32, a: g, color: v === 14 ? C.i : C.inkMid, font: F.serif }); });
      RS.forEach((v, i) => { const [, cy] = m.at(i, 0); const g = a * gin(T.e1d + i * 0.25); ctag(String(v), m.x0 + m.W + 60, cy, { px: 32, a: g, color: v === 15 ? C.j : C.inkMid, font: F.serif }); });
      ctag('列和', m.x0 - 60, m.y0 + m.H + 40, { px: 24, a: a * gin(T.e1b), color: C.i }); ctag('行和', m.x0 + m.W + 60, m.y0 - 30, { px: 24, a: a * gin(T.e1d), color: C.j });
    }
    ctag('‖A‖₁ = 14', DX - 200, DY + 170, { px: 40, a: a * gin(T.e1c), color: C.i, font: F.serif }); ctag('‖A‖∞ = 15', DX + 200, DY + 170, { px: 40, a: a * gin(T.e1e), color: C.j, font: F.serif });
    ctag('估算常用 1、∞；‖·‖₂ 最几何但最贵', DX, DY + 260, { px: 28, a: a * gin(T.pr), color: C.inkMid });
  }

  // ── E：相容、‖I‖、正交 ──
  const PQ = new Plane({ ox: DX, oy: DY + 150, u: 80, R: 2.2 });
  function shotE() {
    const a = B.win(T.cp - 0.2, T.tj - 0.3); if (a <= 0) return;
    B.card(DX, DY - 360, 440, 80, a * gin(T.cp2), C.peri); texAt('compat', DX, DY - 360, 38, { alpha: a * gin(T.cp2) });
    ctag('弗罗贝尼乌斯范数与 ‖·‖₂ 也相容', DX, DY - 280, { px: 26, a: a * gin(T.cp2 + 1.5), color: C.inkMid });
    ctag('‖A‖₂ ≤ ‖A‖_F', DX, DY - 210, { px: 34, a: a * gin(T.ie), color: C.ink, font: F.serif });
    texAt('IF', DX, DY - 140, 36, { alpha: a * gin(T.ie2) * (1 - gin(T.q - 0.2)) });
    const gq = a * gin(T.q - 0.2); if (gq > 0) {
      const th = 0.9 * smoother(prog(B.t, T.q + 0.3, T.q + 2.5)), Q = [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
      B.ball(PQ, Q, 1, gq, { kind: 'two', color: C.j }); B.vec(PQ, [Q[0][0], Q[1][0]], gq, { color: C.i, width: 6, head: 18 }); B.vec(PQ, [Q[0][1], Q[1][1]], gq, { color: C.j, width: 6, head: 18 });
      ctag('只转不拉：圆还是圆', DX, DY - 130, { px: 30, a: gq, color: C.j });
      B.card(DX + 300, DY + 40, 200, 70, gq * gin(T.q2), OK); texAt('Q2', DX + 300, DY + 40, 36, { alpha: gq * gin(T.q2) });
    }
  }

  // ── F：同济 + 小结 ──
  function shotF() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济：本科不讲矩阵范数', DX, DY - 280, { px: 36, a: g1, color: C.gpt, font: F.serif });
    ctag('第五章：向量长度 · 正交矩阵保长度', DX, DY - 190, { px: 30, a: g1 * gin(cue('G01', '第五章')), color: C.ink });
    texAt('Q2', DX, DY - 90, 44, { alpha: g1 * gin(cue('G01', '说的就是这件事')) });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['最大的拉伸倍数', C.ink, T.sum], ['‖A‖₁：最大列和', C.i, cue('C16', '一范数看最大列和')], ['‖A‖∞：最大行和', C.j, cue('C16', '无穷范数看最大行和')], ['‖A‖₂ = σ₁', C.peri, cue('C16', '二范数等于')], ['‖Ax‖ ≤ ‖A‖‖x‖', OK, cue('C16', '而且')]]
      .forEach(([s, c, t0], i) => ctag(s, DX, DY - 300 + i * 76, { px: 36, a: g2 * gin(t0), color: c, font: F.serif }));
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('条件数', DX, DY - 20, { px: 96, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('方程组到底有多敏感', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.fr - 0.2, t1: T.d1 - 0.3, head: '矩阵范数', items: [['‖A‖_F：当长向量', T.fr2], ['‖AB‖ ≤ ‖A‖‖B‖', T.ax2], ['最大拉伸倍数', T.sb3, { color: C.peri }], ['‖A‖₂ = σ₁', T.tw3, { color: C.i }]] },
    { t0: T.d1 - 0.2, t1: T.cp - 0.3, head: '1 与 ∞', items: [['菱形 → 各列', T.on2, { color: C.i }], ['正方形 → 各行', T.in2, { color: C.j }], ['1 看列，∞ 看行', T.mn], ['例 1：14 与 15', T.e1e]] },
    { t0: T.cp - 0.2, t1: T.sum - 0.3, head: '性质', items: [['相容 ‖Ax‖ ≤ ‖A‖‖x‖', T.cp2, { color: C.peri }], ['‖I‖₂ = 1，‖I‖_F = √n', T.ie2], ['‖Q‖₂ = 1', T.q2, { color: OK }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['范数 = 最大拉伸', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(D); shotC(); shotD(); shotE(); shotF(); B.left(SECS); });
  }
  return { TL, draw };
}
