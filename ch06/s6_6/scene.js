// 第 6 章 6.6 二次型（Leon 9th §6.6：xᵀAx、例 1、例 2、主轴定理 6.6.1、定理 6.6.2、黑塞矩阵、Test B 第 6 题）。
// 分镜：二次型 = xᵀAx → 标准位置椭圆 → 例 2 歪椭圆 + 特征轴 → 3B1B：坐标系转 45°，椭圆摆正，交叉项消失
//       → 主轴定理 → 正定 / 负定 / 不定 + 定理 6.6.2 → 线框曲面：碗、倒碗、马鞍 → 黑塞矩阵判极值 → TB6 鞍点 → 同济 配方法 / 惯性定理 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.6 二次型', hi: 3, en: 'QUADRATIC FORMS',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C03: 0.4, C04: 0.6, C05: 0.4, C08: 0.6, C09: 0.6, C10: 0.4, C12: 0.6, C13: 0.6, C15: 0.6, G01: 0.6, C16: 0.6 },
    post: { C01: 0.6, C02: 1.0, C03: 0.8, C04: 0.8, C05: 0.8, C06: 1.0, C07: 2.4, C08: 1.0, C10: 0.8, C11: 0.8, C12: 2.4, C14: 0.8, C15: 1.0, G02: 0.6, C16: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, qf: L('C02').s, qf2: cue('C02', '可以写成'), qf3: cue('C02', '这个式子就叫二次型'), sd: L('C03').s, sd2: cue('C03', '比如'),
    e2: L('C04').s, e2b: cue('C04', '交叉项二x y'), e2c: cue('C04', '对应的矩阵'), d1: L('D01').s, ev: L('C05').s, ev2: cue('C05', '单位特征向量'), qq: L('C06').s, qq2: cue('C06', '二次型变成'), qq3: cue('C06', '交叉项消失了'),
    nw: L('C07').s, nw2: cue('C07', '看画面'), pa: L('C08').s, pa2: cue('C08', '化成平方项之和'), cl: L('C09').s, cl2: cue('C09', '叫正定'), cl3: cue('C09', '叫负定'), cl4: cue('C09', '叫不定'),
    th: L('C10').s, d2: L('D02').s, why: L('C11').s, sf: L('C12').s, sf2: cue('C12', '负定是'), sf3: cue('C12', '不定是马鞍'), sf4: cue('C12', '马鞍沿着'),
    hs: L('C13').s, hs2: cue('C13', '矩阵是'), hj: L('C14').s, tb: L('C15').s, tb2: cue('C15', '驻点是'), tb3: cue('C15', '黑塞矩阵第一行'), tb4: cue('C15', '所以是鞍点'), d3: L('D03').s,
    tj: L('G01').s, tj1b: cue('G01', '一是正交变换法'), tj1c: cue('G01', '二是配方法'), tj2: L('G02').s, tj2b: cue('G02', '分别叫'), sum: L('C16').s, end: L('C17').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.qf2, 0.3); TL.sfx('ding', T.qf3, 0.3); TL.sfx('pop', T.sd2, 0.3); TL.sfx('pop', T.e2, 0.3); TL.sfx('pop', T.e2c, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.ev, 0.3); TL.sfx('pop', T.qq, 0.3); TL.sfx('sparkle', T.qq3, 0.3); TL.sfx('warp', T.nw2, 0.35); TL.sfx('sting', T.pa, 0.32); TL.sfx('pop', T.cl2, 0.3); TL.sfx('pop', T.cl3, 0.3); TL.sfx('pop', T.cl4, 0.3);
  TL.sfx('ding_hi', T.th, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('whoosh', T.sf, 0.3); TL.sfx('pop', T.sf2, 0.3); TL.sfx('pop', T.sf3, 0.3); TL.sfx('pop', T.hs, 0.3); TL.sfx('pop', T.hj, 0.3);
  TL.sfx('pop', T.tb, 0.3); TL.sfx('pop', T.tb3, 0.3); TL.sfx('stamp', T.tb4, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj1c, 0.3); TL.sfx('pop', T.tj2b, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C17').e + 0.3, 0.4);

  const rot = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
  const P = new Plane({ ox: DX, oy: DY + 110, u: 70, R: 9 });
  function axes2(Pp, D, M, a, labs = ['x', 'y'], col = C.ink) {
    if (a <= 0) return; ctx.save(); B.K.clip(D); Pp.grid(ctx, { M, color: C.gridOld, width: 1.2, alpha: 0.12 * a }); Pp.axes(ctx, { M, color: col, width: 2.5, alpha: 0.6 * a }); ctx.restore();
    const ex = Pp.S([4.2, 0], M), ey = Pp.S([0, 4.2], M); ctag(labs[0], ex[0] + 18, ex[1] + 18, { px: 28, a, color: col, font: F.serif }); ctag(labs[1], ey[0] + 22, ey[1] - 8, { px: 28, a, color: col, font: F.serif });
  }
  // ── A：二次型 + 标准位置椭圆 ──
  function shotA(D) {
    const a = B.win(T.o - 0.2, T.e2 - 0.3); if (a <= 0) return;
    ctag('对称矩阵的另一个角度', DX, DY - 390, { px: 34, a: a * gin(T.o + 0.3) * (1 - gin(T.qf2)), color: C.inkMid });
    texAt('qf', DX, DY - 360, 32, { alpha: a * gin(T.qf2), reveal: rv(T.qf2, 4.0) });
    ctag('A 对称 · 叫二次型', DX, DY - 270, { px: 28, a: a * gin(T.qf3), color: C.peri });
    const g = a * gin(T.sd); if (g <= 0) return;
    axes2(P, D, I2, g);
    B.levelQ(P, D, [[1 / 4, 0], [0, 1 / 9]], 1, g * gin(T.sd2), { color: C.peri, width: 5 });
    texAt('std', DX + 260, DY - 160, 36, { alpha: g * gin(T.sd2) });
    ctag('轴 = 坐标轴', DX + 260, DY - 70, { px: 28, a: g * gin(T.sd2 + 2.0), color: OK });
  }

  // ── B：例 2 歪椭圆 → 转 45° 摆正 ──
  const A2 = [[3, 1], [1, 3]];
  function shotB(D) {
    const a = B.win(T.e2 - 0.2, T.pa - 0.3); if (a <= 0) return;
    texAt('e2', DX, DY - 390, 32, { alpha: a * gin(T.e2c) });
    const s = smoother(prog(B.t, T.nw2 + 0.3, T.nw2 + 2.8)), M = rot(Math.PI / 4 * s);
    // 整个图转 45°（顺时针看：把特征轴转到坐标轴）——M 作用在画面上
    const Mr = rot(-Math.PI / 4 * s);
    axes2(P, D, I2, a * (1 - s * 0.6), ['x', 'y'], C.inkMid);
    const gq = a * gin(T.ev2); if (gq > 0) axes2(P, D, rot(-Math.PI / 4 + 0 * s).map(r => r), 0, ['', '']);
    // 主轴（特征向量方向）：随画面一起转
    const e1 = [Math.SQRT1_2, -Math.SQRT1_2], e2 = [Math.SQRT1_2, Math.SQRT1_2];
    const r1 = [Mr[0][0] * e1[0] + Mr[0][1] * e1[1], Mr[1][0] * e1[0] + Mr[1][1] * e1[1]], r2 = [Mr[0][0] * e2[0] + Mr[0][1] * e2[1], Mr[1][0] * e2[0] + Mr[1][1] * e2[1]];
    B.lineD(P, D, r1, gq, { color: C.i, width: 3, dash: [12, 8] }); B.lineD(P, D, r2, gq, { color: C.j, width: 3, dash: [12, 8] });
    const ql = P.S([r1[0] * 3.6, r1[1] * 3.6]), q2 = P.S([r2[0] * 3.0, r2[1] * 3.0]);
    ctag("x′（λ = 2）", ql[0] + 40, ql[1] + 24, { px: 26, a: gq, color: C.i, font: F.serif }); ctag("y′（λ = 4）", q2[0] + 40, q2[1] - 24, { px: 26, a: gq, color: C.j, font: F.serif });
    B.levelQ(P, D, A2, 8, a * gin(T.e2 + 0.5), { color: C.peri, width: 5, M: Mr });
    ctag('交叉项 → 歪着', DX - 280, DY - 280, { px: 28, a: a * gin(T.e2b) * (1 - gin(T.qq3)), color: C.free });
    texAt('e2ev', DX, DY - 300, 30, { alpha: a * gin(T.ev2) * (1 - gin(T.qq - 0.2)) });
    texAt('e2q', DX, DY - 300, 30, { alpha: a * gin(T.qq2), reveal: rv(T.qq2, 4.0) });
    ctag('交叉项消失！', DX + 260, DY - 220, { px: 32, a: a * gin(T.qq3), color: OK, font: F.serif });
    ctag('转 45°：摆正', DX, DY + 410, { px: 32, a: a * gin(T.nw2), color: C.peri, font: F.serif });
  }

  // ── C：主轴定理 + 分类 + 定理 6.6.2 ──
  function shotC() {
    const a = B.win(T.pa - 0.2, T.sf - 0.3); if (a <= 0) return;
    ctag('主轴定理 6.6.1', DX, DY - 390, { px: 32, a: a * gin(T.pa), color: C.peri });
    B.card(DX, DY - 310, 820, 90, a * gin(T.pa2), C.peri); texAt('pa', DX, DY - 310, 34, { alpha: a * gin(T.pa2) });
    ctag('x = Qy · 系数 = 特征值', DX, DY - 230, { px: 28, a: a * gin(T.pa2 + 2.0), color: C.inkMid });
    const rows = [['正定', '> 0', T.cl2, C.peri], ['负定', '< 0', T.cl3, C.k], ['不定', '有正有负', T.cl4, C.free]];
    rows.forEach(([n, s, t0, col], i) => { const x = DX - 300 + i * 300, g = a * gin(t0); B.card(x, DY - 90, 250, 110, g, col); ctag(n, x, DY - 115, { px: 36, a: g, color: col, font: F.serif }); ctag('xᵀAx ' + s, x, DY - 60, { px: 26, a: g, color: C.ink }); });
    B.card(DX, DY + 70, 480, 90, a * gin(T.th), C.peri); texAt('thm2', DX, DY + 70, 38, { alpha: a * gin(T.th) });
    ctag('为什么只看 λ？', DX, DY + 170, { px: 30, a: a * gin(T.d2) * (1 - gin(T.why)), color: C.ds });
    texAt('pa', DX, DY + 180, 30, { alpha: a * gin(T.why) });
    ctag('y 不全为零都恒正 ⇒ 每个 λᵢ > 0', DX, DY + 260, { px: 30, a: a * gin(T.why + 2.0), color: OK });
  }

  // ── D：线框曲面 ──
  function surf(cx, cy, k, f, a, col, { n = 12, R = 1.2, kz = 60, hi = null } = {}) {
    if (a <= 0) return; const pr = (x, y) => { const z = f(x, y); return [cx + (x - y) * k * 0.87, cy + (x + y) * k * 0.42 - z * kz]; };
    ctx.save(); ctx.globalAlpha = a * 0.8; ctx.strokeStyle = col; ctx.lineWidth = 1.8;
    for (let i = 0; i <= n; i++) { const u = -R + 2 * R * i / n; for (const vert of [0, 1]) { ctx.beginPath(); for (let j = 0; j <= 30; j++) { const v = -R + 2 * R * j / 30, p = vert ? pr(u, v) : pr(v, u); j ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); } }
    ctx.restore();
    if (hi) for (const h of hi) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = h.col; ctx.lineWidth = 5; ctx.beginPath(); for (let j = 0; j <= 30; j++) { const v = -R + 2 * R * j / 30, p = pr(v * h.d[0], v * h.d[1]); j ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); ctx.restore(); }
  }
  function shotD() {
    const a = B.win(T.sf - 0.2, T.tj - 0.3); if (a <= 0) return;
    const g1 = a * (1 - gin(T.hs - 0.2));
    surf(DX - 310, DY + 40, 85, (x, y) => x * x + y * y, g1 * gin(T.sf), C.peri); ctag('正定：碗', DX - 310, DY + 250, { px: 30, a: g1 * gin(T.sf), color: C.peri });
    surf(DX, DY - 40, 85, (x, y) => -(x * x + y * y), g1 * gin(T.sf2), C.k); ctag('负定：倒碗', DX, DY + 250, { px: 30, a: g1 * gin(T.sf2), color: C.k });
    surf(DX + 310, DY, 85, (x, y) => x * y * 1.6, g1 * gin(T.sf3), C.free, { hi: gin(T.sf4) > 0 ? [{ d: [Math.SQRT1_2, Math.SQRT1_2], col: OK }, { d: [Math.SQRT1_2, -Math.SQRT1_2], col: C.i }] : null }); ctag('不定：马鞍', DX + 310, DY + 250, { px: 30, a: g1 * gin(T.sf3), color: C.free });
    ctag('正 λ 方向向上弯 · 负 λ 方向向下弯', DX, DY + 330, { px: 28, a: g1 * gin(T.sf4), color: C.ink });
    const g2 = a * gin(T.hs - 0.2); if (g2 <= 0) return;
    ctag('驻点附近 ≈ 二次型', DX, DY - 390, { px: 32, a: g2, color: C.inkMid });
    texAt('hes', DX, DY - 300, 36, { alpha: g2 * gin(T.hs2) });
    const hj = [['H 正定', '极小', C.peri], ['H 负定', '极大', C.k], ['H 不定', '鞍点', C.free]];
    hj.forEach(([h, r, col], i) => { const x = DX - 300 + i * 300, g = g2 * gin(T.hj + i * 1.2) * (1 - gin(T.tb - 0.2)); B.card(x, DY - 170, 240, 90, g, col); ctag(h + ' → ' + r, x, DY - 170, { px: 28, a: g, color: col }); });
    const g3 = a * gin(T.tb - 0.2); if (g3 <= 0) return;
    ctag('测验 B 第 6 题', DX, DY - 200, { px: 30, a: g3, color: C.peri });
    texAt('tb6', DX, DY - 130, 30, { alpha: g3 * gin(T.tb2 - 2.0) });
    texAt('tb6h', DX - 170, DY + 10, 32, { alpha: g3 * gin(T.tb3) });
    surf(DX + 300, DY + 160, 80, (x, y) => (5 * (x + y) * (x + y) / 2 - (x - y) * (x - y) / 2) * 0.35, g3 * gin(T.tb3 + 1.5), C.free, { hi: [{ d: [Math.SQRT1_2, Math.SQRT1_2], col: OK }, { d: [Math.SQRT1_2, -Math.SQRT1_2], col: C.i }] });
    B.stamp(DX - 170, DY + 200, false, prog(B.t, T.tb4, T.tb4 + 0.4), g3, '鞍点');
    ctag('一正一负 = 马鞍', DX - 170, DY + 320, { px: 34, a: g3 * gin(T.d3), color: C.ds, font: F.serif });
  }

  // ── E：同济 + 小结 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章第五、六节 化标准形', DX, DY - 330, { px: 34, a: g1, color: C.gpt });
    B.card(DX - 220, DY - 180, 400, 140, g1 * gin(T.tj1b), C.gpt); ctag('正交变换法', DX - 220, DY - 210, { px: 34, a: g1 * gin(T.tj1b), color: C.gpt, font: F.serif }); ctag('= 主轴定理', DX - 220, DY - 150, { px: 28, a: g1 * gin(T.tj1b), color: C.ink });
    B.card(DX + 220, DY - 180, 400, 140, g1 * gin(T.tj1c), C.i); ctag('配方法', DX + 220, DY - 210, { px: 34, a: g1 * gin(T.tj1c), color: C.i, font: F.serif }); ctag('可逆即可，不要求正交', DX + 220, DY - 150, { px: 28, a: g1 * gin(T.tj1c), color: C.ink });
    texAt('tj', DX, DY + 10, 36, { alpha: g1 * gin(T.tj2) });
    ctag('惯性定理：正、负系数个数不变', DX, DY + 100, { px: 32, a: g1 * gin(T.tj2 + 1.0), color: C.peri });
    ctag('正惯性指数 · 负惯性指数', DX, DY + 170, { px: 28, a: g1 * gin(T.tj2b), color: C.inkMid });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    texAt('pa', DX, DY - 230, 34, { alpha: g2 });
    ctag('转到主轴 · 只剩平方项 · 系数 = λ', DX, DY - 150, { px: 32, a: g2, color: C.inkMid });
    ctag('全正：正定（碗）', DX - 200, DY - 40, { px: 34, a: g2 * gin(cue('C16', '特征值全正')), color: C.peri, font: F.serif });
    ctag('有正有负：不定（马鞍）', DX + 220, DY - 40, { px: 34, a: g2 * gin(cue('C16', '有正有负')), color: C.free, font: F.serif });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('正定矩阵', DX, DY - 20, { px: 96, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('不求特征值也能判断', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.qf - 0.2, t1: T.pa - 0.3, head: '二次型', items: [['xᵀAx，A 对称', T.qf3], ['无交叉项：标准位置', T.sd2], ['例 2：交叉项 → 歪', T.e2b, { color: C.free }], ['λ = 2，4', T.ev], ['转 45° 摆正', T.nw2, { color: OK }]] },
    { t0: T.pa - 0.2, t1: T.hs - 0.3, head: '分类', items: [['主轴定理 6.6.1', T.pa], ['正定 / 负定 / 不定', T.cl4], ['正定 ⇔ λ 全正', T.th, { color: C.peri }], ['碗 · 倒碗 · 马鞍', T.sf3]] },
    { t0: T.hs - 0.2, t1: T.tj - 0.3, head: '判极值', items: [['黑塞矩阵 H', T.hs2], ['正定极小 · 负定极大', T.hj], ['不定：鞍点', T.hj + 2.4, { color: C.free }], ['TB6：λ = 5，−1', T.tb3]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['系数 = 特征值', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
