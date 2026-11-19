// 第 7 章 7.5 正交变换（Leon 9th §7.5：‖Qe‖ = ‖e‖、豪斯霍尔德反射 H = I − 2uuᵀ、α 的符号、例 1 / 例 2、豪斯霍尔德 QR、吉文斯旋转 / 反射例 3、例 4、何时用吉文斯）。
// 分镜：误差小圆跟着 x 一起被 Q 转动，大小不变 → 3B1B：镜面放在 x 与目标点正中间，x 翻过去落到坐标轴 → 例 1 / 例 2
//       → 4×4 稀疏图案逐列被 H₁、H₂、H₃ 清零成 R → 吉文斯：(−3, 4) 转到 (5, 0)；反射版本 → 例 4 → 快三角形的矩阵只剩一条次对角线 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, Plane, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_happy', 'ds_think', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.5 正交变换', hi: 3, en: 'ORTHOGONAL TRANSFORMATIONS',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C07: 0.6, C10: 0.6, C11: 0.6, C14: 0.6, G01: 0.6, C16: 0.6 },
    post: { C01: 0.6, C02: 1.4, C03: 0.8, C04: 1.2, C05: 1.4, C06: 1.0, C07: 1.2, C08: 1.2, C09: 1.2, C10: 1.4, C11: 1.0, C12: 1.2, C13: 1.2, C14: 1.2, C15: 1.0, G01: 0.8, C16: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, er: L('C02').s, er2: cue('C02', '乘上Q以后'), er3: cue('C02', '大小不变'), q: L('C03').s, q2: cue('C03', '问题是'),
    h: L('C04').s, h2: cue('C04', '镜面反射'), h3: cue('C04', 'H的转置'), mr: L('C05').s, mr2: cue('C05', '正中间'), mr3: cue('C05', '法向量'), sg: L('C06').s, sg2: cue('C06', '不会发生抵消'), d1: L('D01').s,
    e1: L('C07').s, e1b: cue('C07', 'v是四、二、二'), e1c: L('C08').s, e1d: cue('C08', 'H乘x'), e2: L('C09').s, e2b: cue('C09', '结果是'), qr: L('C10').s, qr2: cue('C10', 'H二消第二列'), qr3: cue('C10', 'A等于Q乘R'), qr4: cue('C10', '三分之二n的立方'),
    gv: L('C11').s, gv2: cue('C11', '转一个角度'), g3: L('C12').s, g3b: cue('C12', '旋转矩阵把x'), g3r: L('C13').s, g3s: cue('C13', '行列式是一'), g4: L('C14').s, g4b: cue('C14', '结果是十三'),
    d2: L('D02').s, wh: L('C15').s, wh2: cue('C15', 'Q R算法'), wh3: cue('C15', '三分之四n的立方'), tj: L('G01').s, tj2: cue('G01', '殊途同归'), sum: L('C16').s, end: L('C17').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('warp', T.er2, 0.3); TL.sfx('ding', T.er3, 0.3); TL.sfx('pop', T.q2, 0.3); TL.sfx('sting', T.h, 0.3); TL.sfx('shimmer', T.h2, 0.3); TL.sfx('whoosh', T.mr2 + 0.5, 0.3); TL.sfx('pop', T.mr3, 0.3); TL.sfx('pop', T.sg2, 0.3);
  TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.e1, 0.3); TL.sfx('pop', T.e1b, 0.3); TL.sfx('ding_hi', T.e1d, 0.3); TL.sfx('ding', T.e2b, 0.3); [0, 1, 2].forEach(k => TL.sfx('whoosh', T.qr + 0.8 + k * 1.4, 0.25)); TL.sfx('ding', T.qr3, 0.3);
  TL.sfx('sting', T.gv, 0.3); TL.sfx('warp', T.gv2, 0.3); TL.sfx('pop', T.g3, 0.3); TL.sfx('ding_hi', T.g3b, 0.3); TL.sfx('pop', T.g3r, 0.3); TL.sfx('pop', T.g4, 0.3); TL.sfx('ding', T.g4b, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.wh2, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C17').e + 0.3, 0.4);

  const P = new Plane({ ox: DX, oy: DY + 90, u: 70, R: 5 });
  const circ = (c, r, col, a) => { if (a <= 0) return; const [x, y] = P.S(c); ctx.save(); ctx.globalAlpha = a * 0.3; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r * P.u, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); };
  const axes = (a, Pp = P, r = 4.5) => { B.line2(Pp.S([-r, 0]), Pp.S([r, 0]), C.inkMid, a * 0.45, 2); B.line2(Pp.S([0, -r * 0.7]), Pp.S([0, r * 0.7]), C.inkMid, a * 0.45, 2); };

  // ── A：误差圆被 Q 转动 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.h - 0.3); if (a <= 0) return;
    ctag('为什么数值计算偏爱正交矩阵？', DX, DY - 390, { px: 34, a: a * gin(T.o + 0.3), color: C.peri, font: F.serif });
    texAt('Qe', DX, DY - 310, 40, { alpha: a * gin(T.er) });
    axes(a);
    const th = 1.1 * smoother(prog(B.t, T.er2, T.er2 + 2.0)), x0 = [3, 1], x = [x0[0] * Math.cos(th) - x0[1] * Math.sin(th), x0[0] * Math.sin(th) + x0[1] * Math.cos(th)];
    B.vec(P, x, a, { color: C.ink, label: th > 0.5 ? 'Qx' : 'x' });
    circ(x, 0.55, C.free, a * gin(T.er + 0.8)); B.tag('误差圆', P.S(x)[0] + 46, P.S(x)[1] + 10, { px: 24, a: a * gin(T.er + 0.8), color: C.free });
    ctag('转了一下，大小不变', DX, DY + 300, { px: 32, a: a * gin(T.er3), color: OK, font: F.serif });
    ctag('怎样用 Q 把一列变成 (∗, 0, …, 0)？', DX, DY - 230, { px: 30, a: a * gin(T.q2), color: C.ink });
  }

  // ── B：豪斯霍尔德镜面 ──
  function shotB() {
    const a = B.win(T.h - 0.2, T.e1 - 0.3); if (a <= 0) return;
    B.card(DX, DY - 370, 560, 80, a * gin(T.h), C.peri); texAt('H', DX, DY - 370, 34, { alpha: a * gin(T.h) });
    axes(a);
    const x = [2, 1.5], al = -2.5, tgt = [al, 0], v = [x[0] - al, x[1]], nv = Math.hypot(...v), n = [v[0] / nv, v[1] / nv], m = [-n[1], n[0]];
    const gm = a * gin(T.h2);
    B.line2(P.S([-m[0] * 4.5, -m[1] * 4.5]), P.S([m[0] * 4.5, m[1] * 4.5]), C.k, gm, 4, [12, 8]); B.tag('镜面', P.S([m[0] * 3.6, m[1] * 3.6])[0] + 12, P.S([m[0] * 3.6, m[1] * 3.6])[1], { px: 26, a: gm, color: C.k });
    const s = smoother(prog(B.t, T.mr2 + 0.5, T.mr2 + 2.0)), d = x[0] * n[0] + x[1] * n[1], cur = [x[0] - 2 * d * n[0] * s, x[1] - 2 * d * n[1] * s];
    B.vec(P, x, a * (s > 0 ? 0.35 : 1), { color: C.ink, label: 'x' });
    B.vec(P, cur, a * gin(T.mr2 + 0.5), { color: C.i, label: s > 0.9 ? 'Hx = αe₁' : null });
    B.dot(...P.S(tgt), 8, C.peri, a * gin(T.mr2));
    const gv = a * gin(T.mr3); if (gv > 0) { arrow(ctx, P.S(tgt), P.S(x), { color: C.peri, width: 4, head: 16, alpha: gv }); B.tag('v = x − αe₁', P.S([(x[0] + al) / 2, x[1] / 2])[0] - 40, P.S([(x[0] + al) / 2, x[1] / 2])[1] - 30, { px: 26, a: gv, color: C.peri, font: F.serif }); }
    texAt('v', DX, DY - 280, 32, { alpha: a * gin(T.mr3) });
    ctag('Hᵀ = H，H² = I', DX + 300, DY - 200, { px: 28, a: a * gin(T.h3) * (1 - gin(T.sg - 0.2)), color: C.inkMid, font: F.serif });
    ctag('α 与 x₁ 异号：v₁ 同号相加，不抵消', DX, DY - 200, { px: 28, a: a * gin(T.sg), color: OK });
    ctag('第一节的技巧！', DX, DY + 300, { px: 30, a: a * gin(T.d1), color: C.ds });
  }

  // ── C：例 1、例 2 + 豪斯霍尔德 QR ──
  function shotC() {
    const a = B.win(T.e1 - 0.2, T.gv - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.qr - 0.2));
    texAt('ex1', DX, DY - 340, 32, { alpha: g0 * gin(T.e1), reveal: rv(T.e1, 3.0) });
    texAt('ex1H', DX, DY - 200, 32, { alpha: g0 * gin(T.e1c) });
    ctag('H x = (−3, 0, 0) ✓', DX, DY - 80, { px: 30, a: g0 * gin(T.e1d), color: OK, font: F.serif });
    texAt('ex2', DX, DY + 30, 32, { alpha: g0 * gin(T.e2) });
    ctag('把例 1 的 H 嵌进 I₄ 的右下角', DX, DY + 120, { px: 28, a: g0 * gin(T.e2), color: C.inkMid });
    const g1 = a * gin(T.qr - 0.2); if (g1 <= 0) return;
    const step = Math.min(3, Math.floor(Math.max(0, (B.t - T.qr - 0.8) / 1.4)) + (B.t > T.qr + 0.8 ? 1 : 0));
    const pat = Array.from({ length: 4 }, (_, i) => Array.from({ length: 4 }, (_, j) => (j < step && i > j ? '0' : '×')));
    ctag(['A', 'H₁A', 'H₂H₁A', 'H₃H₂H₁A = R'][step], DX, DY - 340, { px: 34, a: g1, color: C.peri, font: F.serif });
    B.mat(DX, DY - 170, pat, g1, { cw: 80, ch: 62, px: 32, col: (i, j) => (pat[i][j] === '0' ? C.inkMid : j === step - 1 && i >= j ? C.i : C.ink), cell: (i, j) => (j === step - 1 && i > j ? { bg: C.i, a: 0.18 } : null) });
    texAt('hqr', DX, DY + 20, 34, { alpha: g1 * gin(T.qr3) });
    texAt('cost', DX, DY + 110, 34, { alpha: g1 * gin(T.qr4) });
    ctag('消元的两倍，换来稳定', DX, DY + 190, { px: 28, a: g1 * gin(T.qr4 + 1.0), color: OK });
  }

  // ── D：吉文斯 ──
  const PG = new Plane({ ox: DX + 170, oy: DY + 120, u: 42, R: 6 });
  function shotD() {
    const a = B.win(T.gv - 0.2, T.d2 - 0.3); if (a <= 0) return;
    ctag('吉文斯：一次只动两个坐标', DX, DY - 390, { px: 34, a: a * gin(T.gv), color: C.peri, font: F.serif });
    const g0 = a * (1 - gin(T.g4 - 0.2)); if (g0 > 0) {
      axes(g0, PG, 6);
      const th0 = Math.atan2(4, -3), s = smoother(prog(B.t, T.g3b - 0.3, T.g3b + 1.5)), th = lerp(th0, 0, s), p = [5 * Math.cos(th), 5 * Math.sin(th)];
      ctx.save(); ctx.globalAlpha = g0 * 0.4; ctx.strokeStyle = C.inkMid; ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(PG.ox, PG.oy, 5 * PG.u, -th0, 0); ctx.stroke(); ctx.restore();
      B.vec(PG, [-3, 4], g0 * gin(T.g3) * 0.4, { color: C.ink, label: '(−3, 4)', px: 26 }); B.vec(PG, p, g0 * gin(T.g3), { color: C.i, width: 7 });
      if (s > 0.95) B.tag('(5, 0)', PG.S([5, 0])[0] - 20, PG.S([5, 0])[1] + 34, { px: 28, a: g0, color: C.i, font: F.serif });
      texAt('G3', DX - 230, DY - 250, 26, { alpha: g0 * gin(T.g3b) });
      texAt('G3r', DX - 230, DY - 130, 26, { alpha: g0 * gin(T.g3r) });
      ctag('旋转 det = 1　反射 det = −1', DX - 230, DY - 40, { px: 26, a: g0 * gin(T.g3s), color: C.inkMid });
    }
    const g4 = a * gin(T.g4 - 0.2); if (g4 > 0) {
      ctag('只在 (1, 3) 平面里转', DX, DY - 300, { px: 30, a: g4, color: C.ink });
      B.card(DX, DY - 160, 860, 160, g4, C.i); texAt('G4', DX, DY - 160, 32, { alpha: g4 });
      ctag('长度 13：x₂ = 8 不动', DX, DY + 0, { px: 30, a: g4 * gin(T.g4b), color: OK });
    }
  }

  // ── E：为什么还要吉文斯 ──
  function shotE() {
    const a = B.win(T.d2 - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('已经有豪斯霍尔德，为什么还要吉文斯？', DX, DY - 380, { px: 30, a: a * gin(T.d2), color: C.ds });
    const n = 5, kill = Math.floor(Math.max(0, (B.t - T.wh2) / 0.8)) + (B.t > T.wh2 ? 1 : 0);
    const pat = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i > j + 1 ? '' : i === j + 1 ? (j < kill ? '0' : '×') : '×')));
    B.mat(DX, DY - 150, pat, a * gin(T.wh), { cw: 72, ch: 56, px: 28, col: (i, j) => (i === j + 1 ? (j < kill ? C.inkMid : C.i) : C.ink), cell: (i, j) => (i === j + 1 && j >= kill ? { bg: C.i, a: 0.18 } : null) });
    ctag('快三角形：只剩零星几个要消', DX, DY + 30, { px: 28, a: a * gin(T.wh), color: C.i });
    ctag('→ 第六节的 QR 算法', DX, DY + 90, { px: 28, a: a * gin(T.wh2), color: C.peri });
    ctag('满矩阵：≈ ⁴⁄₃ n³，比豪斯霍尔德贵', DX, DY + 170, { px: 28, a: a * gin(T.wh3), color: C.free });
  }

  // ── F：同济 + 小结 ──
  function shotF() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章 施密特正交化', DX, DY - 320, { px: 34, a: g1, color: C.gpt, font: F.serif });
    B.card(DX - 220, DY - 190, 380, 110, g1 * gin(T.tj + 1.0), C.gpt); ctag('施密特', DX - 220, DY - 210, { px: 32, a: g1 * gin(T.tj + 1.0), color: C.gpt }); ctag('一个个造正交向量', DX - 220, DY - 165, { px: 24, a: g1 * gin(T.tj + 1.0), color: C.ink });
    B.card(DX + 220, DY - 190, 380, 110, g1 * gin(cue('G01', '反过来')), C.peri); ctag('豪斯霍尔德 · 吉文斯', DX + 220, DY - 210, { px: 30, a: g1 * gin(cue('G01', '反过来')), color: C.peri }); ctag('用正交矩阵去消零', DX + 220, DY - 165, { px: 24, a: g1 * gin(cue('G01', '反过来')), color: C.ink });
    ctag('殊途同归：A = QR', DX, DY - 40, { px: 40, a: g1 * gin(T.tj2), color: OK, font: F.serif });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['正交变换不放大误差', OK, T.sum], ['豪斯霍尔德：镜面反射，一次一整列', C.peri, cue('C16', '豪斯霍尔德是')], ['吉文斯：平面旋转，一次一个', C.i, cue('C16', '吉文斯是')]].forEach(([s, c, t0], i) => ctag(s, DX, DY - 240 + i * 90, { px: 36, a: g2 * gin(t0), color: c, font: F.serif }));
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('算特征值', DX, DY - 20, { px: 90, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('完全不碰特征多项式', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.er - 0.2, t1: T.e1 - 0.3, head: '正交变换', items: [['‖Qe‖ = ‖e‖', T.er3, { color: OK }], ['H = I − 2uuᵀ', T.h, { color: C.peri }], ['镜子放在正中间', T.mr2, { color: C.k }], ['α 与 x₁ 异号', T.sg]] },
    { t0: T.e1 - 0.2, t1: T.gv - 0.3, head: '豪斯霍尔德', items: [['例 1：Hx = (−3, 0, 0)', T.e1d], ['例 2：嵌入右下角', T.e2], ['H₃H₂H₁A = R', T.qr3, { color: C.peri }], ['≈ ⅔ n³', T.qr4]] },
    { t0: T.gv - 0.2, t1: T.sum - 0.3, head: '吉文斯', items: [['平面内转一个角', T.gv2, { color: C.i }], ['例 3：(−3, 4) → (5, 0)', T.g3b], ['例 4：(5, 8, 12) → (13, 8, 0)', T.g4b], ['适合快三角形的矩阵', T.wh2]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['用正交矩阵消零', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotA(); shotB(); shotC(); shotD(); shotE(); shotF(); B.left(SECS); });
  }
  return { TL, draw };
}
