// 第 5 章 5.2 正交子空间与四个基本子空间（Leon 9th §5.2）。
// 分镜：3D：xy 平面 + z 轴（例 2）→ 地板与墙反例（两平面交出 y 轴）→ 交集只有 0 → 正交补（e₁ 直线 ⊥ 补是 yz 平面）
//       → Ax = 0 每行与 x 正交 → 定理 5.2.1 → 例 4：3D 行空间平面 + 零空间法线，再换列空间平面 + N(Aᵀ)
//       → 定理 5.2.2–5.2.4 → 四子空间大图（A 压扁零空间、行空间一一送到列空间）→ 推论 5.2.5 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_confused', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第五章 · 正交性', title: '5.2 正交子空间', hi: 3, en: 'ORTHOGONAL SUBSPACES',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C06: 0.6, C08: 0.6, C10: 0.6, C11: 0.5, C14: 0.6, C17: 0.6, C19: 0.6, G01: 0.6, C21: 0.6 },
    post: { C03: 0.8, C04: 1.2, C05: 1.0, C07: 1.0, C09: 0.8, C10: 1.2, C12: 1.6, C13: 1.6, C16: 1.0, C17: 1.2, C18: 1.6, C19: 1.0, G02: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, def: L('C02').s, e1: L('C03').s, e2: cue('C03', '例二'), d1: L('D01').s, wall: L('C04').s, wall2: cue('C04', '交出了'),
    cap: L('C05').s, cap2: cue('C05', '如果x同时'), comp: L('C06').s, comp2: cue('C06', 'z轴的正交补'), diff: L('C07').s, diff2: cue('C07', '但是e一直线'),
    rows: L('C08').s, rows2: cue('C08', '每一行'), nr: L('C09').s, nr2: cue('C09', '教材把'), thm: L('C10').s, thm2: cue('C10', 'A转置的零空间'),
    e4: L('C11').s, e4u: cue('C11', '化成'), e4p: L('C12').s, e4n: cue('C12', '零空间由'), e4v: cue('C12', '看画面'), e4c: L('C13').s, e4c2: cue('C13', 'A转置的零空间'), e4c3: cue('C13', '又是'), d2: L('D02').s,
    dim: L('C14').s, dsum: L('C15').s, pp: L('C16').s, pp2: cue('C16', '所以零空间'), big: L('C17').s, big2: cue('C17', '右边的'), map: L('C18').s, map2: cue('C18', '限制在'),
    cor: L('C19').s, cor2: cue('C19', '要么存在'), cor3: cue('C19', 'b不在列空间'), d3: L('D03').s, ls: L('C20').s,
    tj: L('G01').s, tj2: cue('G01', '秩加上'), tjb: L('G02').s, tjb2: cue('G02', '把已知向量'), sum: L('C21').s, end: cue('C21', '下一节'),
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.def, 0.3); TL.sfx('whoosh', T.e1, 0.3); TL.sfx('pop', T.e2, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('buzz', T.wall, 0.3); TL.sfx('crack', T.wall2, 0.3);
  TL.sfx('pop', T.cap, 0.3); TL.sfx('shimmer', T.comp, 0.3); TL.sfx('whoosh', T.comp2, 0.3); TL.sfx('pop', T.diff2, 0.3);
  TL.sfx('whoosh', T.rows, 0.3); TL.sfx('pop', T.rows2, 0.3); TL.sfx('ding', T.nr, 0.3); TL.sfx('shimmer', T.thm, 0.35);
  TL.sfx('pop', T.e4, 0.3); TL.sfx('pop', T.e4u, 0.3); TL.sfx('whoosh', T.e4p, 0.3); TL.sfx('ding_hi', T.e4v, 0.3); TL.sfx('whoosh', T.e4c, 0.3); TL.sfx('ding_hi', T.e4c3, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('pop', T.dim, 0.3); TL.sfx('pop', T.dsum, 0.3); TL.sfx('pop', T.pp, 0.3); TL.sfx('shimmer', T.big, 0.35); TL.sfx('pop', T.big2, 0.3); TL.sfx('warp', T.map, 0.35);
  TL.sfx('pop', T.cor, 0.3); TL.sfx('pop', T.cor3, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('ding', T.ls, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tjb2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', T.end + 0.3, 0.4);

  let P3 = null;
  const fadeSwap = (ts) => { const sw = Math.min(...ts.map(tt => Math.abs(B.t - tt))); return sw < 0.35 ? 0.25 + sw * 2.1 : 1; };

  // ── A：3D 几何（例 1–2、地板墙、正交补）──
  function shotA(D) {
    const a = B.win(T.e1 - 0.2, T.rows - 0.3); if (a <= 0 || !P3) return;
    P3.reset(); const t = B.t;
    let lab = [];
    if (t < T.wall) { // 例 2：xy 平面 + z 轴
      P3.setPlane(0, [0, 0, 1], { color: C.i, alpha: 0.34, scale: gin(T.e2, 0.8) }); P3.setLine(0, [0, 0, 1], { grow: gin(T.e2 + 0.4, 0.8), color: C.peri });
      P3.setLine(1, [1, 0, 0], { grow: gin(T.e1, 0.6) * (1 - gin(T.e2)), color: C.j, width: 6 });
    } else if (t < T.comp) { // 地板 + 墙
      const s = fadeSwap([T.wall]); P3.setPlane(0, [0, 0, 1], { color: C.i, alpha: 0.3, scale: s }); P3.setPlane(1, [1, 0, 0], { color: C.j, alpha: 0.3, scale: s * gin(T.wall + 0.3, 0.8) });
      P3.setLine(0, [0, 1, 0], { grow: gin(T.wall2, 0.8), color: C.free, width: 9 });
    } else { // 正交补：z 轴 → xy 平面；e₁ 直线 → yz 平面
      const pre = t < T.diff, s = fadeSwap([T.diff]);
      if (pre) { P3.setLine(0, [0, 0, 1], { color: C.peri }); P3.setPlane(0, [0, 0, 1], { color: C.i, alpha: 0.34, scale: s * gin(T.comp2, 0.8) }); }
      else { P3.setLine(0, [1, 0, 0], { color: C.peri }); P3.setLine(1, [0, 1, 0], { color: C.j, width: 5, grow: s * (1 - gin(T.diff2)) }); P3.setPlane(0, [1, 0, 0], { color: C.j, alpha: 0.34, scale: gin(T.diff2, 0.8) }); }
    }
    const V = B.show3D(P3, D, a, { el: 22, az: -38 + 8 * Math.sin(B.t * 0.2), dist: 14, axesA: 0.6, floorA: t >= T.wall && t < T.comp ? 0 : 0.25 });
    // 标签与公式
    texAt('def', DX, DY - 390, 32, { alpha: a * gin(T.def + 0.3) * (1 - gin(T.wall - 0.2)) });
    if (t < T.wall) { V.lab([0, 0, 3.4], 'z 轴', { px: 28, a: a * gin(T.e2), color: C.peri }); V.lab([2.2, 2.2, 0], 'xy 平面', { px: 28, a: a * gin(T.e2), color: C.i }); ctag('X ⊥ Y', DX, DY + 360, { px: 40, a: a * gin(T.e2 + 0.8), color: OK, font: F.serif }); }
    if (t >= T.wall && t < T.comp) {
      const g = a * gin(T.wall); V.v3([0, 0, 0], [1.6, 1.6, 0], { color: C.i, alpha: g }); V.v3([0, 0, 0], [0, 1.6, 1.6], { color: C.j, alpha: g });
      V.lab([1.9, 1.9, -0.2], '(1, 1, 0)', { px: 26, a: g, color: C.i }); V.lab([0, 1.8, 2.0], '(0, 1, 1)', { px: 26, a: g, color: C.j });
      texAt('wall', DX, DY - 380, 36, { alpha: g }); V.lab([0, 3.4, 0], '交线：y 轴', { px: 28, a: a * gin(T.wall2), color: C.free });
      B.cross(DX + 360, DY - 300, gin(T.wall + 0.6, 0.4), a * gin(T.wall + 0.6));
      const gc = a * gin(T.cap); B.card(DX, DY + 330, 640, 90, gc, OK); texAt('cap', DX, DY + 330, 32, { alpha: gc * gin(T.cap2) }); ctag('X ∩ Y = {0}', DX, DY + 260, { px: 34, a: gc, color: OK, font: F.serif });
    }
    if (t >= T.comp) {
      const g = a * gin(T.comp); B.card(DX, DY - 370, 700, 90, g, C.peri); texAt('comp', DX, DY - 370, 32, { alpha: g });
      if (t < T.diff) { V.lab([0, 0, 3.4], 'Y = z 轴', { px: 28, a: g, color: C.peri }); V.lab([2.3, 2.3, 0], 'Y⊥ = xy 平面', { px: 28, a: a * gin(T.comp2), color: C.i }); }
      else { V.lab([3.4, 0, 0], 'e₁ 直线', { px: 28, a, color: C.peri }); V.lab([0, 1.4, 1.6], 'e₂ 直线 ⊥ e₁', { px: 26, a: a * (1 - gin(T.diff2)), color: C.j }); V.lab([0, 2.2, 2.2], '补 = span{e₂, e₃}', { px: 28, a: a * gin(T.diff2), color: C.j }); }
    }
  }

  // ── B：Ax = 0 每行 ──
  function shotB() {
    const a = B.win(T.rows - 0.2, T.e4 - 0.3); if (a <= 0) return;
    // 矩阵行条 + x 列
    const gR = a * gin(T.rows + 0.3);
    for (let i = 0; i < 3; i++) {
      const y0 = DY - 200 + i * 80, hi = gin(T.rows2 + i * 0.5) * (1 - gin(T.rows2 + i * 0.5 + 0.8)) ;
      B.card(DX - 200, y0, 360, 60, gR, hi > 0.2 ? C.peri : C.inkMid); ctag(`第 ${i + 1} 行  aᵢᵀ`, DX - 200, y0, { px: 28, a: gR, color: hi > 0.2 ? C.peri : C.ink });
      ctag('· x = 0', DX + 100, y0, { px: 30, a: gR * gin(T.rows2 + i * 0.5), color: OK, font: F.serif });
    }
    texAt('rows', DX, DY - 340, 34, { alpha: gR });
    const gn = a * gin(T.nr); B.card(DX, DY + 100, 420, 90, gn, OK); texAt('nr', DX, DY + 100, 40, { alpha: gn });
    ctag('R(Aᵀ) = Aᵀ 的列空间 = 行空间', DX, DY + 180, { px: 28, a: a * gin(T.nr2), color: C.inkMid });
    const gt = a * gin(T.thm); ctag('定理 5.2.1  基本子空间定理', DX, DY + 260, { px: 28, a: gt, color: C.peri, font: F.serif });
    B.card(DX, DY + 330, 720, 80, gt, C.peri); texAt('thm', DX, DY + 330, 34, { alpha: gt, reveal: rv(T.thm + 0.3, 2.5) });
  }

  // ── C：例 4（3D）──
  function shotC(D) {
    const a = B.win(T.e4 - 0.2, T.dim - 0.3); if (a <= 0 || !P3) return;
    const gm = a * (1 - gin(T.e4p)); texAt('A', DX - 180, DY - 60, 44, { alpha: gm * gin(T.e4 + 0.3) }); texAt('rref', DX + 200, DY - 60, 44, { alpha: gm * gin(T.e4u) });
    if (gm > 0) arrow(ctx, [DX - 20, DY - 60], [DX + 50, DY - 60], { color: C.peri, width: 5, head: 18, alpha: gm * gin(T.e4u) });
    const g3 = a * gin(T.e4p); if (g3 <= 0) return;
    P3.reset(); const col = B.t >= T.e4c, s = fadeSwap([T.e4c]);
    const n = col ? [-1, -2, 1] : [-1, -1, 1], b1 = [1, 0, 1], b2 = col ? [0, 1, 2] : [0, 1, 1], pc = col ? C.j : C.i, lc = col ? C.free : C.peri;
    P3.setPlane(0, n, { color: pc, alpha: 0.32, scale: s * gin(col ? T.e4c : T.e4p, 0.8) });
    P3.setLine(0, n, { color: lc, grow: gin(col ? T.e4c2 : T.e4n, 0.8), width: 8 });
    const V = B.show3D(P3, D, g3, { el: 20, az: -30 + 10 * Math.sin(B.t * 0.18), dist: 14, axesA: 0.5, floorA: 0.2 });
    const gb = g3 * gin((col ? T.e4c : T.e4p) + 0.6); V.v3([0, 0, 0], b1.map(v => v * 1.3), { color: C.ink, alpha: gb }); V.v3([0, 0, 0], b2.map(v => v * 1.0), { color: C.ink, alpha: gb });
    const nn = Math.hypot(...n); V.lab(n.map(v => v / nn * 3.6), col ? 'N(Aᵀ)' : 'N(A)', { px: 32, a: g3 * gin(col ? T.e4c2 : T.e4n), color: lc, font: F.serif });
    V.lab([1.9, 1.1, 1.9], col ? 'R(A)' : 'R(Aᵀ)', { px: 32, a: gb, color: pc, font: F.serif });
    // 法线直角标
    const gr = g3 * gin(col ? T.e4c3 : T.e4v); if (gr > 0) { const O = V.pr([0, 0, 0]), A1 = V.pr(b1.map(v => v * 0.3)), A2 = V.pr(n.map(v => v / nn * 0.5)); B.rightMark(O, [A1[0] - O[0], A1[1] - O[1]], [A2[0] - O[0], A2[1] - O[1]], gr, { s: 22, color: OK }); }
    texAt(col ? 'NAT' : 'NA', DX, DY - 380, 34, { alpha: g3 * gin(col ? T.e4c2 : T.e4n) });
    if (col) texAt('RA', DX, DY - 320, 30, { alpha: g3 * gin(T.e4c + 0.4) });
    ctag('一面一线，互相垂直', DX, DY + 360, { px: 34, a: g3 * gin(col ? T.e4c3 : T.e4v), color: OK, font: F.serif });
    ctag('两两配对，每对都垂直！', DX, DY + 290, { px: 30, a: a * gin(T.d2), color: C.ds });
  }

  // ── D：定理 5.2.2–4 + 大图 ──
  function bigPic(a) {
    if (a <= 0) return;
    const t = B.t, gL = gin(T.big), gR = gin(T.big2);
    // 左 ℝⁿ、右 ℝᵐ 两个平行四边形块
    const blk = (x, y, w, h, col, text, sub, g, sk = 30) => { if (g <= 0) return; ctx.save(); ctx.globalAlpha = a * g * 0.22; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + sk, y); ctx.lineTo(x + w + sk, y); ctx.lineTo(x + w - sk, y + h); ctx.lineTo(x - sk, y + h); ctx.closePath(); ctx.fill(); ctx.globalAlpha = a * g; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      ctag(text, x + w / 2, y + h / 2 - 16, { px: 32, a: a * g, color: col, font: F.serif }); ctag(sub, x + w / 2, y + h / 2 + 24, { px: 24, a: a * g, color: C.inkMid }); };
    const X0 = DX - 420, X1 = DX + 120;
    ctag('ℝⁿ', X0 + 150, DY - 290, { px: 40, a: a * gL, color: C.ink, font: F.serif }); ctag('ℝᵐ', X1 + 150, DY - 290, { px: 40, a: a * gR, color: C.ink, font: F.serif });
    blk(X0, DY - 240, 300, 200, C.i, 'R(Aᵀ)', '维数 r', gL); blk(X0, DY - 20, 300, 160, C.peri, 'N(A)', '维数 n − r', gL);
    blk(X1, DY - 240, 300, 200, C.j, 'R(A)', '维数 r', gR); blk(X1, DY - 20, 300, 160, C.free, 'N(Aᵀ)', '维数 m − r', gR);
    ctag('⊥', X0 + 150, DY - 30, { px: 36, a: a * gL, color: OK }); ctag('⊥', X1 + 150, DY - 30, { px: 36, a: a * gR, color: OK });
    // A 的映射
    const gm = gin(T.map, 0.6); if (gm > 0) {
      arrow(ctx, [X0 + 320, DY - 160], [X1 - 20, DY - 160], { color: C.ink, width: 6, head: 22, alpha: a * gm, grow: gm }); ctag('A：一一对应', (X0 + X1) / 2 + 160, DY - 195, { px: 26, a: a * gm, color: C.ink });
      const Z = [(X0 + X1) / 2 + 160, DY + 200]; arrow(ctx, [X0 + 300, DY + 80], Z, { color: C.peri, width: 5, head: 20, alpha: a * gm, grow: gm }); B.dot(...Z, 12, C.ink, a * gm); ctag('0', Z[0] + 26, Z[1] + 6, { px: 30, a: a * gm, color: C.ink, font: F.serif });
      ctag('压成 0', Z[0] - 90, Z[1] + 10, { px: 26, a: a * gm, color: C.peri });
    }
    ctag('限制在行空间上：可逆', DX - 120, DY + 300, { px: 30, a: a * gin(T.map2), color: OK, font: F.serif });
  }
  function shotD() {
    const a = B.win(T.dim - 0.2, T.cor - 0.3); if (a <= 0) return;
    const g1 = a * (1 - gin(T.big - 0.2));
    ctag('定理 5.2.2', DX - 300, DY - 300, { px: 26, a: g1 * gin(T.dim), color: C.peri }); texAt('dim', DX + 60, DY - 300, 40, { alpha: g1 * gin(T.dim) });
    ctag('定理 5.2.3', DX - 300, DY - 170, { px: 26, a: g1 * gin(T.dsum), color: C.peri }); texAt('dsum', DX + 60, DY - 170, 40, { alpha: g1 * gin(T.dsum) });
    ctag('唯一拆分：x = s + s⊥', DX + 60, DY - 100, { px: 28, a: g1 * gin(T.dsum + 1.5), color: C.inkMid });
    ctag('定理 5.2.4', DX - 300, DY + 20, { px: 26, a: g1 * gin(T.pp), color: C.peri }); texAt('pp', DX + 60, DY + 20, 40, { alpha: g1 * gin(T.pp) });
    ctag('N(A) ⟷ R(Aᵀ)    N(Aᵀ) ⟷ R(A)  互为正交补', DX, DY + 140, { px: 30, a: g1 * gin(T.pp2), color: OK });
    bigPic(a * gin(T.big));
  }

  // ── E：推论 5.2.5 ──
  function shotE(D) {
    const a = B.win(T.cor - 0.2, T.tj - 0.3); if (a <= 0 || !P3) return;
    P3.reset(); P3.setPlane(0, [-1, -2, 1], { color: C.j, alpha: 0.3 }); P3.setLine(0, [-1, -2, 1], { color: C.free, grow: gin(T.cor2, 0.8) });
    const V = B.show3D(P3, D, a, { el: 18, az: -30 + 8 * Math.sin(B.t * 0.18), dist: 14, axesA: 0.5, floorA: 0.2 });
    const n = [-1, -2, 1], nn = Math.hypot(...n), bb = [1.6, 0.4, 1.2].map((v, i) => v + n[i] / nn * 1.3);
    V.v3([0, 0, 0], bb, { color: C.i, alpha: a * gin(T.cor + 0.4) }); V.lab(bb.map(v => v * 1.12), 'b', { px: 34, a: a * gin(T.cor + 0.4), color: C.i, font: F.serif });
    const gy = a * gin(T.cor3); if (gy > 0) { const k = bb.reduce((s, v, i) => s + v * n[i], 0) / (nn * nn), pp = bb.map((v, i) => v - k * n[i]); V.v3(pp, bb, { color: C.free, alpha: gy, width: 6 }); V.lab(pp, '列空间里的部分', { px: 24, a: gy, color: C.j }); }
    V.lab([2.0, 1.0, 2.2], 'R(A)', { px: 30, a, color: C.j, font: F.serif }); V.lab(n.map(v => v / nn * 3.6), 'N(Aᵀ)', { px: 30, a: a * gin(T.cor2), color: C.free, font: F.serif });
    ctag('推论 5.2.5', DX, DY - 390, { px: 28, a, color: C.peri, font: F.serif });
    texAt('cor', DX - 230, DY - 320, 32, { alpha: a * gin(T.cor + 0.3) }); texAt('fred', DX + 150, DY - 320, 30, { alpha: a * gin(T.cor2) });
    ctag('放弃？', DX - 200, DY + 330, { px: 34, a: a * gin(T.d3) * (1 - gin(T.ls)), color: C.ds, font: F.serif });
    ctag('找最近点 → 最小二乘', DX, DY + 330, { px: 36, a: a * gin(T.ls), color: OK, font: F.serif });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照', DX, DY - 360, { px: 36, a, color: C.gpt, font: F.serif });
    ctag('没有“四个基本子空间”', DX, DY - 270, { px: 30, a: a * gin(T.tj + 0.5), color: C.inkMid });
    const g1 = a * gin(T.tj2); B.card(DX, DY - 170, 460, 90, g1, C.gpt); texAt('tj', DX, DY - 170, 38, { alpha: g1 }); ctag('第四章：S 是解空间', DX, DY - 100, { px: 26, a: g1, color: C.gpt });
    const g2 = a * gin(T.tjb); ctag('期末常见：求与已知向量都正交的向量', DX, DY + 20, { px: 30, a: g2, color: C.ink });
    const g3 = a * gin(T.tjb2); B.card(DX, DY + 130, 560, 100, g3, C.peri); ctag('已知向量排成行 → 解 Ax = 0', DX, DY + 130, { px: 30, a: g3, color: C.peri, font: F.serif }); ctag('5.x 复习（下）会做', DX, DY + 220, { px: 26, a: g3, color: C.inkMid });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    B.card(DX, DY - 220, 720, 80, a * gin(T.sum + 0.3), C.peri); texAt('thm', DX, DY - 220, 34, { alpha: a * gin(T.sum + 0.3) });
    ctag('互为正交补', DX, DY - 120, { px: 34, a: a * gin(cue('C21', '各自互为')), color: OK, font: F.serif });
    ctag('r + (n − r) = n     r + (m − r) = m', DX, DY - 30, { px: 32, a: a * gin(cue('C21', '维数加起来')), color: C.ink, font: F.serif });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120 + 60, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('最小二乘', DX, DY + 50, { px: 100, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  const SECS = [
    { t0: T.def - 0.2, t1: T.rows - 0.3, head: '正交子空间', items: [['X ⊥ Y：两两正交', T.def, { color: C.peri, mark: C.peri }], ['地板 ⊥ 墙？✗', T.wall, { color: C.free, mark: C.free }], ['交集只有 0', T.cap], ['正交补 Y⊥', T.comp, { color: OK, mark: OK }]] },
    { t0: T.rows - 0.3, t1: T.cor - 0.3, head: '四个基本子空间', items: [['N(A) ⊥ R(Aᵀ)', T.nr, { color: C.peri, mark: C.peri }], ['定理 5.2.1', T.thm], ['例 4：一面一线', T.e4p], ['dim S + dim S⊥ = n', T.dim], ['大图', T.big, { color: OK, mark: OK }]] },
    { t0: T.cor - 0.3, t1: T.end - 0.3, head: '推论与对照', items: [['Ax = b 二选一', T.cor], ['→ 最小二乘', T.ls, { color: OK, mark: OK }], ['同济：r + dim S = n', T.tj, { color: C.gpt, mark: C.gpt }]] },
  ];

  const P3c = await load3D(); P3 = new P3c(900, { R: 3 });
  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(); shotC(D); shotD(); shotE(D); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
