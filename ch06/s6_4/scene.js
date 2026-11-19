// 第 6 章 6.4 埃尔米特矩阵与谱定理（Leon 9th §6.4：复内积、定理 6.4.1、酉矩阵、舒尔定理、谱定理 6.4.4、例 4、正规矩阵）。
// 分镜：复向量长度 zᴴz（例 z = (1+i, 2)）→ 埃尔米特定义 + 例 → 定理 6.4.1（实数、正交）+ 两段证明 → 酉矩阵 → 谱定理 A = QDQᵀ → 舒尔定理
//       → 3B1B：对称矩阵网格沿两条垂直特征轴伸缩，正方形变长方形 → 例 4：3D 特征平面 + 法线，施密特把 (−2,1,0) 转正 → 正规矩阵 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.4 对称矩阵与谱定理', hi: 3, en: 'HERMITIAN MATRICES · SPECTRAL THEOREM',
    titleEnd: () => B.L('C02').s, titlePx: 88,
    pre: { C02: 0.4, C04: 0.6, C05: 0.6, C07: 0.4, C09: 0.6, C10: 0.6, C12: 0.6, C13: 0.6, C16: 0.6, G01: 0.6, C17: 0.6 },
    post: { C01: 0.6, C03: 0.8, C04: 0.6, C05: 0.8, C06: 0.8, C07: 1.0, C08: 1.0, C10: 1.0, C11: 0.8, C12: 2.0, C14: 1.0, C15: 1.2, C16: 0.6, G02: 0.6, C17: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, zh: L('C02').s, zh2: cue('C02', '长度的平方'), zx: L('C03').s, zx2: cue('C03', '结果是六'), he: L('C04').s, he2: cue('C04', '对角元必须是实数'), he3: cue('C04', '实对称矩阵'),
    th: L('C05').s, th2: cue('C05', '属于不同特征值'), mx: L('C06').s, mx2: cue('C06', '特征值却是实数'), d1: L('D01').s, p1: L('C07').s, p1b: cue('C07', '一方面'), p1c: cue('C07', '另一方面'), p1d: cue('C07', '拉姆达只能是实数'),
    p2: L('C08').s, p2b: cue('C08', '夹出'), un: L('C09').s, un2: cue('C09', '实的酉矩阵'), sp: L('C10').s, sp2: cue('C10', '实对称矩阵，则可以'), d2: L('D02').s, sc: L('C11').s, sc2: cue('C11', '任何方阵'), sc3: cue('C11', '而对称的上三角阵'),
    geo: L('C12').s, geo2: cue('C12', '变换就是'), geo3: cue('C12', '网格不会被剪歪'), e4: L('C13').s, e4b: cue('C13', '特征值是'), es: L('C14').s, es2: cue('C14', '这两个不正交'), e5: L('C15').s, e5b: cue('C15', '把三个排成U'), d3: L('D03').s,
    nm: L('C16').s, nm2: cue('C16', '这样的矩阵叫正规矩阵'), tj: L('G01').s, tj2: L('G02').s, tj2b: cue('G02', '要先施密特'), sum: L('C17').s, end: L('C18').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.zh2, 0.3); TL.sfx('pop', T.zx, 0.3); TL.sfx('ding_hi', T.zx2, 0.3); TL.sfx('pop', T.he, 0.3); TL.sfx('pop', T.he3, 0.3);
  TL.sfx('sting', T.th, 0.3); TL.sfx('pop', T.th2, 0.3); TL.sfx('ding', T.mx2, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.p1b, 0.3); TL.sfx('pop', T.p1c, 0.3); TL.sfx('ding_hi', T.p1d, 0.3); TL.sfx('pop', T.p2b, 0.3);
  TL.sfx('pop', T.un, 0.3); TL.sfx('sting', T.sp, 0.32); TL.sfx('pop', T.sp2, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.sc2, 0.3); TL.sfx('ding', T.sc3, 0.3);
  TL.sfx('warp', T.geo + 0.5, 0.35); TL.sfx('sparkle', T.geo3, 0.3); TL.sfx('pop', T.e4, 0.3); TL.sfx('whoosh', T.es, 0.3); TL.sfx('warp', T.es2 + 1.0, 0.3); TL.sfx('pop', T.e5, 0.3); TL.sfx('ding_hi', T.e5b, 0.3); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('pop', T.nm2, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2b, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  // ── A：复向量 + 埃尔米特 + 定理 + 证明 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.un - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.th - 0.2));
    ctag('对称矩阵 · 埃尔米特矩阵', DX, DY - 380, { px: 40, a: g0 * gin(T.o + 0.4), color: C.peri, font: F.serif });
    texAt('zh', DX, DY - 270, 38, { alpha: g0 * gin(T.zh2) });
    ctag('H：共轭转置', DX, DY - 190, { px: 28, a: g0 * gin(T.zh2 + 1.5), color: C.inkMid });
    texAt('zex', DX, DY - 90, 34, { alpha: g0 * gin(T.zx) });
    ctag('‖z‖ = √6：正实数', DX, DY + 0, { px: 30, a: g0 * gin(T.zx2), color: OK });
    B.card(DX, DY + 120, 300, 80, g0 * gin(T.he), C.peri); texAt('herm', DX, DY + 120, 40, { alpha: g0 * gin(T.he) });
    ctag('对角元实数 · 对称位置共轭', DX, DY + 210, { px: 28, a: g0 * gin(T.he2), color: C.inkMid });
    ctag('实对称矩阵是特例', DX, DY + 270, { px: 28, a: g0 * gin(T.he3), color: C.j });
    const g1 = a * gin(T.th - 0.2); if (g1 <= 0) return;
    B.card(DX, DY - 380, 640, 90, g1, C.peri); texAt('thm1', DX, DY - 380, 36, { alpha: g1 });
    texAt('mex', DX, DY - 260, 34, { alpha: a * gin(T.mx) * (1 - gin(T.p1 - 0.2)) });
    const gp = a * gin(T.p1 - 0.2); if (gp <= 0) return;
    ctag('为什么是实数？', DX, DY - 270, { px: 32, a: gp * (1 - gin(T.p2 - 0.2)), color: C.ds });
    ctag('zᴴMz = λ‖z‖²', DX - 220, DY - 170, { px: 34, a: gp * gin(T.p1b), color: C.i, font: F.serif });
    ctag('(zᴴMz)ᴴ = zᴴMz ⇒ 实数', DX + 210, DY - 170, { px: 30, a: gp * gin(T.p1c), color: C.j, font: F.serif });
    texAt('pf1', DX, DY - 60, 30, { alpha: gp * gin(T.p1d) });
    B.card(DX, DY + 90, 480, 80, a * gin(T.p2b), C.k); texAt('pf2', DX, DY + 90, 36, { alpha: a * gin(T.p2b) });
    ctag('λ ≠ μ ⇒ zᴴw = 0：正交', DX, DY + 180, { px: 30, a: a * gin(T.p2b + 2.0), color: C.k });
  }

  // ── B：酉矩阵、谱定理、舒尔 ──
  function shotB() {
    const a = B.win(T.un - 0.2, T.geo - 0.3); if (a <= 0) return;
    texAt('unit', DX - 220, DY - 360, 40, { alpha: a * gin(T.un) }); ctag('酉矩阵', DX - 220, DY - 290, { px: 28, a: a * gin(T.un), color: C.inkMid });
    ctag('实的 → 正交矩阵 Q', DX + 220, DY - 360, { px: 32, a: a * gin(T.un2), color: C.j, font: F.serif });
    ctag('谱定理 6.4.4', DX, DY - 200, { px: 34, a: a * gin(T.sp), color: C.peri });
    B.card(DX, DY - 110, 460, 110, a * gin(T.sp2), C.peri); texAt('spec', DX, DY - 110, 54, { alpha: a * gin(T.sp2) });
    ctag('重根也不亏损？', DX, DY + 20, { px: 32, a: a * gin(T.d2) * (1 - gin(T.sc)), color: C.ds });
    ctag('从不亏损', DX, DY + 20, { px: 36, a: a * gin(T.sc), color: OK, font: F.serif });
    texAt('schur', DX, DY + 130, 30, { alpha: a * gin(T.sc2), reveal: rv(T.sc2, 3.0) });
    // 上三角 → 对角（小方格）
    const gm = a * gin(T.sc3); if (gm > 0) { const x0 = DX - 75, y0 = DY + 220, c = 50; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const up = j > i, dg = i === j; const k = up ? 1 - gin(T.sc3 + 1.0, 0.8) : 1; if (j < i) continue; ctx.save(); ctx.globalAlpha = gm * k * (dg ? 0.9 : 0.5); ctx.fillStyle = dg ? C.peri : C.inkMid; ctx.fillRect(x0 + j * c + 4, y0 + i * c + 4, c - 8, c - 8); ctx.restore(); } }
  }

  // ── C：3B1B 对称矩阵网格 ──
  const S2 = [[2, 1], [1, 2]];
  const P = new Plane({ ox: DX, oy: DY + 60, u: 66, R: 10 });
  function shotC(D) {
    const a = B.win(T.geo - 0.2, T.e4 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.geo + 0.5, T.geo + 3.0));
    const Ms = B.eigFan(P, S2, s, a, D, { fan: 16, r: 1.2, eig: [{ d: [1, 1], col: C.i, label: '×3' }, { d: [1, -1], col: C.j, label: '×1' }], square: false, neu: 0.4 });
    // 沿特征轴的正方形 → 长方形
    const q = [[0, 0], [Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT1_2 + Math.SQRT1_2, 0], [Math.SQRT1_2, -Math.SQRT1_2]];
    B.poly(P, q, Ms, a * gin(T.geo2), { fill: C.peri, stroke: C.peri, fa: 0.25, width: 3 });
    B.rightMark(P.S([0, 0]), [1, -1], [1, 1], a, { s: 26, color: C.ink });
    texAt('spec', DX, DY - 380, 40, { alpha: a });
    ctag('互相垂直的轴，各自伸缩', DX, DY - 300, { px: 30, a: a * gin(T.geo2), color: C.ink });
    ctag('不剪歪', DX, DY + 400, { px: 34, a: a * gin(T.geo3), color: OK, font: F.serif });
  }

  // ── D：例 4 3D ──
  const P3c = await load3D(); const P3 = new P3c(820, { R: 3 });
  const nrm = v => { const n = Math.hypot(...v); return v.map(x => x / n); };
  function shotD(D) {
    const a = B.win(T.e4 - 0.2, T.tj - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.nm - 0.2));
    texAt('e4A', DX, DY - 390, 28, { alpha: g0 * gin(T.e4), reveal: rv(T.e4, 3.0) });
    ctag('λ = −1，−1，5', DX, DY - 320, { px: 32, a: g0 * gin(T.e4b), color: C.peri, font: F.serif });
    const g = g0 * gin(T.es - 0.2); if (g > 0) {
      P3.reset(); P3.setPlane(0, [-1, -2, 1], { color: C.j, alpha: 0.3 });
      P3.setLine(0, nrm([-1, -2, 1]), { color: C.peri, grow: gin(T.e5, 0.8), width: 8 });
      const Dl = { x: D.x, y: D.y + 110, r: Math.max(0, D.r - 110) };
      const V = B.show3D(P3, Dl, g, { el: 22, az: -60 + 8 * Math.sin(B.t * 0.25), dist: 13, axesA: 0.35, floorA: 0 });
      const k = 2.0, b1 = nrm([1, 0, 1]).map(x => x * k), b2 = nrm([-2, 1, 0]).map(x => x * k), u2 = nrm([-1, 1, 1]).map(x => x * k), u3 = nrm([-1, -2, 1]).map(x => x * k);
      const s = smoother(prog(B.t, T.es2 + 1.0, T.es2 + 2.6)), c = nrm(b2.map((x, i) => lerp(x, u2[i], s))).map(x => x * k);
      V.v3([0, 0, 0], b1, { color: C.i, alpha: g }); V.lab(b1.map(x => x * 1.18), s > 0.5 ? 'u₁' : '(1,0,1)', { px: 24, a: g, color: C.i });
      V.v3([0, 0, 0], c, { color: C.j, alpha: g * gin(T.es + 1.5) }); V.lab(c.map(x => x * 1.2), s > 0.5 ? 'u₂' : '(−2,1,0)', { px: 24, a: g * gin(T.es + 1.5), color: C.j });
      V.v3([0, 0, 0], u3, { color: C.peri, alpha: g * gin(T.e5) }); V.lab(u3.map(x => x * 1.2), 'u₃（λ = 5）', { px: 24, a: g * gin(T.e5), color: C.peri });
      ctag('施密特（平面内）', DX - 280, DY - 230, { px: 28, a: g * gin(T.es2), color: C.j });
      ctag('白送垂直', DX + 300, DY - 230, { px: 28, a: g * gin(T.e5 + 1.0), color: C.peri });
      texAt('e4u', DX, DY + 345, 26, { alpha: g * gin(T.e5b) });
    }
    const gn = a * gin(T.nm - 0.2); if (gn <= 0) return;
    B.card(DX, DY - 120, 380, 90, gn, C.k); texAt('normal', DX, DY - 120, 42, { alpha: gn });
    ctag('正规矩阵 ⇔ 有完整的标准正交特征向量', DX, DY - 20, { px: 30, a: gn * gin(T.nm2), color: C.k });
  }

  // ── E：同济 + 小结 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章第四节 实对称矩阵', DX, DY - 330, { px: 34, a: g1, color: C.gpt });
    ctag('特征值实数 · 不同 λ 的特征向量正交', DX, DY - 240, { px: 30, a: g1 * gin(T.tj + 1.0), color: C.ink });
    B.card(DX, DY - 150, 480, 90, g1 * gin(cue('G01', '必有正交阵P')), C.gpt); texAt('tj', DX, DY - 150, 38, { alpha: g1 * gin(cue('G01', '必有正交阵P')) });
    ctag('经典题：λ = −2，1，1', DX, DY - 20, { px: 34, a: g1 * gin(T.tj2), color: C.gpt, font: F.serif });
    ctag('重根 1：先施密特，再全部单位化', DX, DY + 60, { px: 30, a: g1 * gin(T.tj2b), color: C.peri });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    ctag('特征值全是实数', DX, DY - 230, { px: 38, a: g2, color: C.ink, font: F.serif });
    ctag('特征向量可取标准正交', DX, DY - 160, { px: 34, a: g2 * gin(cue('C17', '特征向量可以')), color: C.j });
    B.card(DX, DY - 40, 420, 100, g2 * gin(cue('C17', '谱定理')), C.peri); texAt('spec', DX, DY - 40, 48, { alpha: g2 * gin(cue('C17', '谱定理')) });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('奇异值分解', DX, DY - 20, { px: 90, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('转 · 拉 · 转', DX, DY + 90, { px: 40, a: g3 * gin(T.end + 0.8), color: C.ink, font: F.serif });
  }

  const SECS = [
    { t0: T.o - 0.2, t1: T.un - 0.3, head: '埃尔米特矩阵', items: [['‖z‖² = zᴴz', T.zh2], ['M = Mᴴ', T.he], ['λ 全是实数', T.th, { color: C.peri }], ['不同 λ ⇒ 正交', T.th2, { color: C.k }]] },
    { t0: T.un - 0.2, t1: T.e4 - 0.3, head: '谱定理', items: [['酉矩阵 UᴴU = I', T.un], ['A = QDQᵀ', T.sp2, { color: C.peri }], ['从不亏损（舒尔）', T.sc], ['沿垂直轴伸缩', T.geo2, { color: OK }]] },
    { t0: T.e4 - 0.2, t1: T.tj - 0.3, head: '例 4', items: [['λ = −1，−1，5', T.e4b], ['重根平面：施密特', T.es2, { color: C.j }], ['不同 λ：白送正交', T.e5, { color: C.peri }], ['正规矩阵', T.nm2, { color: C.k }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['实特征值 · 正交特征向量', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(); shotC(D); shotD(D); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
