// 第 6 章 6.1（下）特征多项式、复特征值、迹与行列式、相似（Leon 9th §6.1 例 3–7、定理 6.1.1）。
// 分镜：特征多项式 → 例 3 展开 + λ 滑块（p(λ) 曲线 + A − λI 的单位正方形面积穿过 0）→ 例 4 三阶（3D：零空间直线 + λ = 1 特征平面）
//       → 例 5 旋转放大：所有向量都转向 → 复特征向量 → 积 = det、和 = tr → 例 6 验算 → 定理 6.1.1 + 例 7（T 与 A 各自的特征方向，倍数相同）→ 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, DR, OK, I2, arrow, load3D, rgba } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.1 特征多项式', hi: 3, en: 'CHARACTERISTIC POLYNOMIAL',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.4, C05: 0.6, C08: 0.6, C11: 0.6, C13: 0.6, C14: 0.6, C16: 0.5, G01: 0.6, C18: 0.6 },
    post: { C01: 0.6, C02: 0.8, C03: 0.8, C04: 2.0, C07: 1.0, C09: 1.6, C10: 0.8, C12: 0.8, C13: 0.8, C15: 0.8, C17: 0.8, G02: 0.6, C18: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    cp: L('C01').s, cp2: cue('C01', '叫作特征多项式'), e3: L('C02').s, e3p: cue('C02', 'A减拉姆达I的行列式'), e3f: cue('C02', '分解成'), e3v: L('C03').s, e3v2: cue('C03', '对拉姆达等于四'),
    sl: L('C04').s, sl2: cue('C04', '它穿过零'), d1: L('D01').s, e4: L('C05').s, e4p: cue('C05', '展开得到'), e4e: cue('C05', '特征值是零'),
    e4n: L('C06').s, e4r: cue('C06', '拉姆达等于一的时候'), e4b: L('C07').s, e4b2: cue('C07', '基是'), e4b3: cue('C07', '二重根'),
    e5: L('C08').s, e5p: cue('C08', '特征多项式是'), e5e: cue('C08', '特征值是'), rot: L('C09').s, rot2: cue('C09', '所以只能'), d2: L('D02').s, cv: L('C10').s, cv2: cue('C10', '实矩阵的复特征值'),
    fac: L('C11').s, fac2: cue('C11', '再令拉姆达等于零'), fac3: cue('C11', '所有特征值的乘积'), tr: L('C12').s, tr2: cue('C12', '所有特征值的和'),
    e6: L('C13').s, e6c: cue('C13', '行列式是'), e6k: cue('C13', '特征值是二加减三i'), d3: L('D03').s,
    sim: L('C14').s, sim2: cue('C14', '相似矩阵有相同'), pf: L('C15').s, pf2: cue('C15', '行列式拆成'), e7: L('C16').s, e7b: cue('C16', '用一个可逆矩阵S'), e7c: cue('C16', '它的特征值'), geo: L('C17').s, geo2: cue('C17', '特征值描述的是'),
    tj: L('G01').s, tj1b: cue('G01', '并且推出'), tj2: L('G02').s, sum: L('C18').s, end: L('C19').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.cp2, 0.3); TL.sfx('pop', T.e3, 0.3); TL.sfx('type', T.e3p, 0.22); TL.sfx('ding_hi', T.e3f + 1.5, 0.3); TL.sfx('pop', T.e3v2, 0.3);
  TL.sfx('whoosh', T.sl, 0.3); TL.sfx('ding', T.sl2 + 0.5, 0.3); TL.sfx('ding', T.sl2 + 1.5, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.e4, 0.3); TL.sfx('ding_hi', T.e4e, 0.3); TL.sfx('whoosh', T.e4n, 0.3); TL.sfx('pop', T.e4r, 0.3); TL.sfx('shimmer', T.e4b2, 0.3);
  TL.sfx('pop', T.e5, 0.3); TL.sfx('buzz', T.e5p + 2.0, 0.2); TL.sfx('warp', T.rot + 0.4, 0.35); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.cv, 0.3);
  TL.sfx('whoosh', T.fac, 0.3); TL.sfx('ding_hi', T.fac3, 0.32); TL.sfx('ding_hi', T.tr2, 0.32); TL.sfx('pop', T.e6, 0.3); TL.sfx('check', T.e6k + 1.5, 0.3); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('sting', T.sim2, 0.3); TL.sfx('pop', T.pf2, 0.3); TL.sfx('pop', T.e7, 0.3); TL.sfx('warp', T.e7c, 0.3); TL.sfx('shimmer', T.geo2, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C19').e + 0.3, 0.4);

  // ── A：例 3 + λ 滑块 ──
  const A3 = [[3, 2], [3, -2]], p3 = l => l * l - l - 12;
  const PC = new Plane({ ox: DX - 30, oy: DY + 210, u: 52, R: 7 });
  const PS = new Plane({ ox: DX + 300, oy: DY - 20, u: 26, R: 6 });
  function shotA(D) {
    const a = B.win(T.cp - 0.2, T.e4 - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.sl - 0.2));
    B.card(DX, DY - 380, 520, 86, a * gin(T.cp + 0.4), C.peri); texAt('cp', DX, DY - 380, 38, { alpha: a * gin(T.cp + 0.4) });
    ctag('λ 的 n 次多项式', DX, DY - 300, { px: 28, a: g0 * gin(T.cp2), color: C.inkMid });
    texAt('e3A', DX, DY - 200, 36, { alpha: g0 * gin(T.e3) });
    texAt('e3p', DX, DY - 60, 32, { alpha: g0 * gin(T.e3p), reveal: rv(T.e3p, 5.0) });
    texAt('e3v', DX, DY + 110, 32, { alpha: g0 * gin(T.e3v) });
    // 滑块
    const gs = a * gin(T.sl - 0.2); if (gs <= 0) return;
    texAt('e3A', DX - 300, DY - 290, 30, { alpha: gs });
    ctx.save(); B.K.clip(D);
    B.line2(PC.S([-6, 0]), PC.S([7, 0]), C.ink, gs * 0.6, 2);
    for (let k = -5; k <= 6; k++) { const q = PC.S([k, 0]); B.line2([q[0], q[1] - 6], [q[0], q[1] + 6], C.inkMid, gs * 0.6, 2); if (k % 2 === 0 || k === -3) ctag(String(k).replace('-', '−'), q[0], q[1] + 28, { px: 22, a: gs * 0.7, color: C.inkMid }); }
    ctx.restore();
    B.curve(PC, D, l => p3(l) / 6, -5, 6, gs, { color: C.peri, width: 4 });
    ctag('p(λ) = λ² − λ − 12', DX - 250, DY + 20, { px: 28, a: gs, color: C.peri, font: F.serif });
    const lam = lerp(-5, 6, smoother(prog(B.t, T.sl + 0.5, T.sl2 + 2.6)));
    const q = PC.S([lam, p3(lam) / 6]); B.line2(PC.S([lam, 0]), q, C.ink, gs * 0.6, 2, [6, 6]); B.dot(...q, 10, C.ink, gs); B.dot(...PC.S([lam, 0]), 7, C.i, gs);
    ctag(`λ = ${lam.toFixed(1).replace('-', '−')}`, PC.S([lam, 0])[0], PC.S([lam, 0])[1] + 62, { px: 28, a: gs, color: C.i, font: F.serif });
    for (const r of [-3, 4]) { const gr = gs * gin(T.sl2 + (r === 4 ? 1.5 : 0.5)); B.dot(...PC.S([r, 0]), 13, OK, gr); }
    // A − λI 的单位正方形
    const M = [[3 - lam, 2], [3, -2 - lam]], det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
    const col = Math.abs(det) < 1.2 ? OK : det > 0 ? C.peri : C.free;
    ctx.save(); B.K.clip(D); PS.grid(ctx, { M: I2, color: C.gridOld, width: 1, alpha: 0.12 * gs }); ctx.restore();
    B.poly(PS, [[0, 0], [1, 0], [1, 1], [0, 1]], M, gs, { fill: col, stroke: col, fa: 0.35, width: 3 });
    ctag('A − λI 把单位正方形变成', PS.ox, DY - 300, { px: 24, a: gs, color: C.inkMid });
    ctag(`面积因子 ${det.toFixed(1).replace('-', '−')}`, PS.ox, DY + 150, { px: 28, a: gs, color: col, font: F.serif });
  }

  // ── B：例 4 三阶，3D 特征空间 ──
  const P3c = await load3D(); const P3 = new P3c(820, { R: 3 });
  function shotB(D) {
    const a = B.win(T.d1 - 0.2, T.e5 - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.e4n - 0.2));
    ctag('三阶：照样展开行列式', DX, DY - 300, { px: 34, a: g0 * gin(T.d1 + 0.5), color: C.ds });
    texAt('e4A', DX, DY - 160, 38, { alpha: g0 * gin(T.e4) });
    texAt('e4p', DX, DY - 30, 40, { alpha: g0 * gin(T.e4p) });
    ctag('λ = 0，λ = 1（二重）', DX, DY + 70, { px: 34, a: g0 * gin(T.e4e), color: C.peri, font: F.serif });
    const g = a * gin(T.e4n - 0.2); if (g <= 0) return;
    P3.reset(); P3.setLine(0, [1, 1, 1], { color: C.i, grow: gin(T.e4n + 0.3, 0.8), width: 9 });
    const gp = gin(T.e4r, 0.8); P3.setPlane(0, [1, -3, 1], { color: C.j, alpha: 0.32 * gp });
    const Dl = { x: D.x, y: D.y + 120, r: Math.max(0, D.r - 120) };
    const V = B.show3D(P3, Dl, g, { el: 20, az: -35 + 8 * Math.sin(B.t * 0.25), dist: 13, axesA: 0.4, floorA: 0 });
    V.lab([2.2, 2.2, 2.6], 'λ = 0：span{(1,1,1)}', { px: 26, a: g, color: C.i });
    const gb = gin(T.e4b2); const b1 = [3, 1, 0].map(v => v * 0.75), b2 = [-1, 0, 1].map(v => v * 1.6);
    V.v3([0, 0, 0], b1, { color: C.j, alpha: g * gb }); V.v3([0, 0, 0], b2, { color: C.k, alpha: g * gin(T.e4b2 + 0.8) });
    texAt('e4n', DX - 260, DY - 360, 30, { alpha: g });
    texAt('e4r', DX + 170, DY - 360, 30, { alpha: g * gp });
    texAt('e4b', DX + 170, DY - 270, 28, { alpha: g * gb });
    ctag('二重根 → 两个无关特征向量（这次够了）', DX, DY + 420, { px: 26, a: g * gin(T.e4b3), color: OK });
  }

  // ── C：例 5 旋转放大 ──
  const M5 = [[1, 2], [-2, 1]];
  const P5 = new Plane({ ox: DX, oy: DY + 140, u: 66, R: 8 });
  function shotC(D) {
    const a = B.win(T.e5 - 0.2, T.fac - 0.3); if (a <= 0) return;
    texAt('e5A', DX, DY - 390, 36, { alpha: a * gin(T.e5) });
    texAt('e5p', DX, DY - 300, 34, { alpha: a * gin(T.e5p) });
    const gr = a * gin(T.rot - 0.2) ;
    const s = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(2, Math.max(0, (B.t - T.rot - 0.4) / 2.2)));
    B.eigFan(P5, M5, s, gr, D, { fan: 16, r: 1.0, eig: [], neu: 0.4, clipY: DY - 250 });
    ctag('每个向量都被转走：没有实特征方向', DX, DY + 420, { px: 26, a: gr * gin(T.rot + 2.0), color: C.free });
    const gc = a * gin(T.cv); B.card(DX, DY - 200, 640, 86, gc, C.k); texAt('e5v', DX, DY - 200, 32, { alpha: gc });
    ctag('实矩阵：复特征值共轭成对', DX, DY + 360, { px: 28, a: a * gin(T.cv2), color: C.k });
  }

  // ── D：积 = det，和 = tr，例 6 ──
  function shotD() {
    const a = B.win(T.fac - 0.2, T.sim - 0.3); if (a <= 0) return;
    texAt('fac', DX, DY - 360, 32, { alpha: a * gin(T.fac), reveal: rv(T.fac, 3.0) });
    ctag('令 λ = 0 ↓', DX - 260, DY - 280, { px: 26, a: a * gin(T.fac2), color: C.inkMid });
    ctag('比较 λⁿ⁻¹ 系数 ↓', DX + 240, DY - 280, { px: 26, a: a * gin(T.tr), color: C.inkMid });
    B.card(DX - 240, DY - 200, 440, 84, a * gin(T.fac3), C.peri); texAt('prod', DX - 240, DY - 200, 30, { alpha: a * gin(T.fac3) });
    B.card(DX + 240, DY - 200, 440, 84, a * gin(T.tr2), C.j); texAt('sum', DX + 240, DY - 200, 30, { alpha: a * gin(T.tr2) });
    const g6 = a * gin(T.e6); if (g6 <= 0) return;
    texAt('e6A', DX, DY - 50, 36, { alpha: g6 });
    texAt('e6c', DX, DY + 60, 34, { alpha: a * gin(T.e6c) });
    texAt('e6k', DX, DY + 160, 32, { alpha: a * gin(T.e6k + 0.8) });
    B.stamp(DX + 300, DY + 270, true, prog(B.t, T.e6k + 1.5, T.e6k + 1.9), a, '✓ 对上');
    ctag('算完先验：迹 + 行列式', DX - 150, DY + 280, { px: 32, a: a * gin(T.d3), color: C.ds, font: F.serif });
  }

  // ── E：定理 6.1.1 + 例 7 ──
  const TT = [[2, 1], [0, 3]], A7 = [[-1, -2], [6, 6]];
  const PL = new Plane({ ox: DX - 250, oy: DY + 220, u: 44, R: 5 }), PR = new Plane({ ox: DX + 230, oy: DY + 220, u: 44, R: 5 });
  function shotE(D) {
    const a = B.win(T.sim - 0.2, T.tj - 0.3); if (a <= 0) return;
    B.card(DX, DY - 390, 600, 86, a * gin(T.sim2), C.peri); texAt('sim', DX, DY - 390, 34, { alpha: a * gin(T.sim2) });
    texAt('simpf', DX, DY - 300, 26, { alpha: a * gin(T.pf), reveal: rv(T.pf, 5.0) });
    const g7 = a * gin(T.e7); if (g7 <= 0) return;
    texAt('e7', DX, DY - 190, 28, { alpha: g7, reveal: rv(T.e7, 4.0) });
    texAt('e7e', DX, DY - 110, 36, { alpha: a * gin(T.e7c) });
    const s = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(2, Math.max(0, (B.t - T.e7c - 0.3) / 2.4)));
    const D2 = { ...D };
    B.eigFan(PL, TT, s, g7 * gin(T.e7 + 1.0), D2, { grid: false, fan: 12, r: 0.9, eig: [{ d: [1, 0], col: C.i, label: '×2' }, { d: [1, 1], col: C.j, label: '×3' }] });
    B.eigFan(PR, A7, s, g7 * gin(T.e7b + 1.0), D2, { grid: false, fan: 12, r: 0.45, eig: [{ d: [2, -3], col: C.i, label: '×2' }, { d: [1, -2], col: C.j, label: '×3' }] });
    ctag('T', PL.ox, DY + 420, { px: 34, a: g7, color: C.ink, font: F.serif }); ctag('A = S⁻¹TS', PR.ox, DY + 420, { px: 34, a: g7 * gin(T.e7b + 1.0), color: C.ink, font: F.serif });
    ctag('同一个变换，换了一组基', DX, DY - 30, { px: 30, a: a * gin(T.geo), color: OK });
    ctag('伸缩倍数与基无关', DX, DY + 20, { px: 30, a: a * gin(T.geo2), color: C.peri });
  }

  // ── F：同济 + 小结 ──
  function shotF() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章第二节', DX, DY - 330, { px: 34, a: g1, color: C.gpt });
    B.card(DX, DY - 220, 560, 96, g1 * gin(T.tj + 1.0), C.gpt); texAt('tj1', DX, DY - 220, 36, { alpha: g1 * gin(T.tj + 1.0) });
    ctag('A 可逆 ⇔ 0 不是特征值', DX, DY - 120, { px: 32, a: g1 * gin(T.tj1b), color: C.peri, font: F.serif });
    B.card(DX, DY + 30, 860, 96, g1 * gin(T.tj2), C.gpt); texAt('tj2', DX, DY + 30, 30, { alpha: g1 * gin(T.tj2), reveal: rv(T.tj2 + 0.5, 8.0) });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    ctag('特征多项式的根 = 特征值', DX, DY - 230, { px: 40, a: g2, color: C.peri, font: F.serif });
    ctag('可能重复，可能是复数', DX, DY - 160, { px: 30, a: g2, color: C.inkMid });
    texAt('prod', DX, DY - 50, 34, { alpha: g2 * gin(cue('C18', '特征值之积')) });
    texAt('sum', DX, DY + 40, 34, { alpha: g2 * gin(cue('C18', '之和等于迹')) });
    ctag('相似 ⇒ 特征值相同', DX, DY + 140, { px: 34, a: g2 * gin(cue('C18', '相似矩阵')), color: OK, font: F.serif });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('线性微分方程组', DX, DY - 20, { px: 80, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag("Y′ = AY", DX, DY + 90, { px: 40, a: g3 * gin(T.end + 0.8), color: C.ink, font: F.serif });
  }

  const SECS = [
    { t0: T.cp - 0.2, t1: T.e5 - 0.3, head: '特征多项式', items: [['p(λ) = det(A − λI)', T.cp], ['例 3：λ = 4，−3', T.e3v, { color: C.peri }], ['p(λ) 穿过 0 的地方', T.sl2], ['例 4：0 和二重的 1', T.e4e], ['λ = 1：特征平面', T.e4b2, { color: C.j }]] },
    { t0: T.e5 - 0.2, t1: T.sim - 0.3, head: '复数与验算', items: [['例 5：1 ± 2i', T.e5e, { color: C.k }], ['旋转：没有实方向', T.rot], ['积 = det A', T.fac3, { color: C.peri }], ['和 = tr A', T.tr2, { color: C.j }], ['例 6：13 与 4', T.e6k]] },
    { t0: T.sim - 0.2, t1: T.tj - 0.3, head: '相似', items: [['定理 6.1.1', T.sim], ['p 相同 ⇒ λ 相同', T.sim2, { color: C.peri }], ['例 7：λ = 2，3', T.e7c], ['与基无关', T.geo2, { color: OK }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['根 = 特征值', T.sum], ['积 = det，和 = tr', T.sum + 3]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(D); shotD(); shotE(D); shotF(); B.left(SECS); });
  }
  return { TL, draw };
}
