// 第 3 章 3.3 线性无关（Leon 9th §3.3）。
// 分镜：ℝ³ 中 x₃ 落在 x₁、x₂ 的平面上 → 移项得到零组合 → 定义（无关 / 相关 / 平凡组合）
//       → 几何：ℝ² 共线、ℝ³ 共面 vs 伸向新方向 → 例 2 → 行列式判别 + 网格被压扁（Xc = 0）
//       → 例 4（det = 0，x₃ = 2x₁ − 3x₂）→ 例 5 消元 → 例 6 多项式 → 朗斯基 → 唯一表示 → 预告「基」。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, lerpM, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_happy', 'ds_think', 'ds_ask', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.3 线性无关', hi: 3, en: 'LINEAR INDEPENDENCE',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C06: 0.6, C09: 0.6, C12: 0.5, C13: 0.6, C16: 0.6, C18: 0.5, C21: 0.6, C23: 0.6, C25: 0.6, C27: 0.3 },
    post: { C05: 0.6, C08: 0.6, C11: 0.6, G01: 0.6, C15: 0.7, C17: 0.7, C20: 0.7, C22: 0.7, G02: 0.6, C26: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, o2: L('C02').s, o3: L('C03').s, mv: L('C04').s, mv2: L('C05').s,
    def: L('C06').s, dep: L('C07').s, ds1: L('D01').s, triv: L('C08').s, triv2: cue('C08', '线性无关是说'),
    g2: L('C09').s, g3: L('C10').s, g3b: cue('C10', '至少有一个'), gi: L('C11').s,
    e2: L('C12').s, e2b: cue('C12', '所以线性相关'), g01: L('G01').s,
    how: L('C13').s, th: L('C14').s, th2: cue('C14', '等于零'), ds2: L('D02').s, sq: L('C15').s, sq2: cue('C15', '被送到了零'),
    e4: L('C16').s, e4d: cue('C16', '行列式算出来'), e4r: L('C17').s, e4r2: cue('C17', 'x三'),
    e5a: L('C18').s, e5: L('C19').s, e5r: cue('C19', '化成行最简形'), e5f: cue('C19', '自由变量'), e5x: L('C20').s,
    e6: L('C21').s, e6s: cue('C21', '比较各次项'), e6r: L('C22').s, e6r2: cue('C22', '取c三等于一'),
    w: L('C23').s, w2: cue('C23', '朗斯基行列式'), wv: L('C24').s, wth: cue('C24', '教材定理'), wg: L('G02').s, wg2: cue('G02', '教材例八'),
    u: L('C25').s, u2: L('C26').s, u3: cue('C26', '线性无关说'), tj: L('G03').s, ds3: L('D03').s, end: L('C27').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', T.o1, 0.3); TL.sfx('pop', T.o2 + 0.5, 0.3); TL.sfx('warp', T.o3, 0.3); TL.sfx('pluck', T.mv, 0.25); TL.sfx('ding_hi', T.mv2, 0.3);
  TL.sfx('whoosh', T.def, 0.3); TL.sfx('pluck', T.dep, 0.25); TL.sfx('pop', T.triv, 0.3); TL.sfx('whoosh', T.g2, 0.3); TL.sfx('warp', T.g3, 0.3); TL.sfx('shimmer', T.gi + 0.4, 0.3);
  TL.sfx('whoosh', T.e2, 0.3); TL.sfx('stamp', T.e2b, 0.32); TL.sfx('bell_soft', T.g01, 0.3); TL.sfx('whoosh', T.how, 0.3); TL.sfx('ding_hi', T.th, 0.3); TL.sfx('warp', T.sq, 0.35);
  TL.sfx('whoosh', T.e4, 0.3); TL.sfx('stamp', T.e4d + 1.2, 0.32); TL.sfx('pop', T.e4r2, 0.3); TL.sfx('whoosh', T.e5, 0.3); TL.sfx('pluck', T.e5r, 0.25); TL.sfx('pop', T.e5x, 0.3);
  TL.sfx('whoosh', T.e6, 0.3); TL.sfx('pop', T.e6r2, 0.3); TL.sfx('whoosh', T.w, 0.3); TL.sfx('ding_hi', T.wv, 0.3); TL.sfx('bell_soft', T.wg, 0.3);
  TL.sfx('whoosh', T.u, 0.3); TL.sfx('check', T.u3 + 1.2, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', L('C27').e + 0.3, 0.4);

  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const k = 1 / 4, X1 = [1, -1, 2].map(q => q * k), X2 = [-2, 3, 1].map(q => q * k), X3 = [-1, 3, 8].map(q => q * k);
  const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const N12 = cr(X1, X2);
  const cam = (el = 26) => ({ el, az: 55 + 8 * Math.sin(B.t * 0.3), dist: 12.5, axesA: 0.8, floorA: 0.6 });

  // ── A：开场 ℝ³ ──
  function shotOpen(D) {
    const a = B.win(T.o1 - 0.2, T.def - 0.4); if (a <= 0) return;
    const ga = a * (1 - gin(T.mv - 0.2, 0.5));
    if (ga > 0) {
      P3.reset(); P3.setPlane(0, N12, { color: C.i, alpha: 0.3, scale: outCubic(prog(B.t, T.o1 + 0.3, T.o1 + 1.3)) }); P3.setPoint(0, [0, 0, 0], { r: 0.09, color: C.ink });
      const V = B.show3D(P3, D, ga, cam(30)); const O = [0, 0, 0];
      V.v3(O, X1, { color: C.i, alpha: ga * gin(T.o2) }); V.lab(X1.map(q => q * 1.25), 'x₁', { px: 30, a: ga * gin(T.o2), color: C.i, font: F.serif });
      V.v3(O, X2, { color: C.j, alpha: ga * gin(T.o2 + 0.3) }); V.lab(X2.map(q => q * 1.2), 'x₂', { px: 30, a: ga * gin(T.o2 + 0.3), color: C.j, font: F.serif });
      // x₃ = 3x₁ + 2x₂：先走 3x₁ 再走 2x₂
      const s = smoother(prog(B.t, T.o2 + 1.6, T.o2 + 3.0));
      if (s > 0) { const p = X1.map(q => q * 3); V.v3(O, p, { color: C.i, alpha: ga * 0.45, width: 5 }); V.v3(p, p.map((q, i) => q + 2 * X2[i] * s), { color: C.j, alpha: ga * 0.45, width: 5 }); }
      V.v3(O, X3, { color: C.peri, alpha: ga * gin(T.o2 + 3.0), width: 9 }); V.lab(X3.map(q => q * 1.1), 'x₃', { px: 32, a: ga * gin(T.o2 + 3.0), color: C.peri, font: F.serif });
      texAt('rel', DX, DY - 340, 46, { alpha: ga * gin(T.o2 + 0.8), reveal: rv(T.o2 + 0.8, 1.0), color: C.peri });
      ctag('三个向量，还是同一张平面', DX, DY + 330, { px: 34, a: ga * gin(T.o3 + 1.0), color: C.ink });
    }
    const ta = a * gin(T.mv - 0.2, 0.5);
    if (ta > 0) {
      texAt('x123', DX, DY - 220, 40, { alpha: ta, reveal: rv(T.mv - 0.2, 0.8) });
      texAt('rel', DX, DY - 50, 46, { alpha: ta * (1 - gin(T.mv + 0.5)), color: C.peri });
      texAt('mv', DX, DY - 50, 50, { alpha: ta * gin(T.mv + 0.5), reveal: rv(T.mv + 0.5, 1.0), color: C.peri });
      ctag('系数 3、2、−1：不全为零', DX, DY + 70, { px: 34, a: ta * gin(T.mv2), color: C.free });
      ctag('“多余”的数学说法', DX, DY + 170, { px: 40, a: ta * gin(T.mv2 + 1.4), color: C.peri, font: F.serif });
    }
  }

  // ── B：定义 ──
  function shotDef() {
    const a = B.win(T.def - 0.2, T.g2 - 0.4); if (a <= 0) return;
    ctag('线性无关', DX, DY - 320, { px: 44, a: a * gin(T.def), color: OK, font: F.serif });
    texAt('def', DX, DY - 230, 42, { alpha: a * gin(T.def + 0.4), reveal: rv(T.def + 0.4, 1.6) });
    ctag('线性相关', DX, DY - 110, { px: 44, a: a * gin(T.dep), color: C.free, font: F.serif });
    texAt('dep', DX, DY - 30, 42, { alpha: a * gin(T.dep + 0.4), reveal: rv(T.dep + 0.4, 1.4) });
    const ta = a * gin(T.triv, 0.4);
    B.card(DX, DY + 170, 760, 190, ta, C.inkMid);
    ctag('平凡组合：永远成立', DX, DY + 110, { px: 30, a: ta, color: C.inkMid });
    texAt('triv', DX, DY + 165, 40, { alpha: ta, reveal: rv(T.triv, 0.8) });
    ctag('无关 = 除了它，再没有别的办法得到 0', DX, DY + 230, { px: 30, a: ta * gin(T.triv2), color: OK });
  }

  // ── C：几何 ──
  const P = new Plane({ ox: DX, oy: DY + 40, u: 90, R: 4.2 });
  function shotGeo(D) {
    const a = B.win(T.g2 - 0.2, T.e2 - 0.4); if (a <= 0) return;
    const s2 = a * (1 - gin(T.g3 - 0.2, 0.5));
    if (s2 > 0) {
      B.grid(P, I2, s2, D, { neu: 0, basis: false, old: 0.16 });
      B.line2(P.S([-4, -2]), P.S([4, 2]), C.free, s2 * gin(T.g2 + 0.8) * 0.5, 3, [10, 8]);
      B.vec(P, [2, 1], s2, { color: C.i, label: 'v₁' }); B.vec(P, [-1.4, -0.7], s2 * gin(T.g2 + 0.4), { color: C.j, label: 'v₂', lx: -40, ly: 40 });
      ctag('ℝ²：线性相关 = 共线', DX, DY - 340, { px: 36, a: s2, color: C.free });
    }
    const s3 = a * gin(T.g3 - 0.2, 0.5);
    if (s3 > 0) {
      const out = smoother(prog(B.t, T.gi, T.gi + 1.2));
      P3.reset(); P3.setPlane(0, N12, { color: out > 0.5 ? C.inkMid : C.free, alpha: lerp(0.3, 0.14, out) }); P3.setPoint(0, [0, 0, 0], { r: 0.09, color: C.ink });
      const V = B.show3D(P3, D, s3, cam(30)); const O = [0, 0, 0];
      const W3 = X3.map((q, i) => lerp(q, q * 0.4 + N12[i] * 1.6, out));
      V.v3(O, X1, { color: C.i, alpha: s3 }); V.v3(O, X2, { color: C.j, alpha: s3 }); V.v3(O, W3, { color: out > 0.5 ? C.k : C.peri, alpha: s3 * gin(T.g3 + 0.3), width: 9 });
      ctag(out > 0.5 ? '线性无关：每个都伸向新方向' : 'ℝ³：线性相关 = 共面', DX, DY - 340, { px: 36, a: s3, color: out > 0.5 ? OK : C.free });
      ctag(out > 0.5 ? '谁也替代不了谁' : '至少有一个能被其余的表示', DX, DY + 330, { px: 32, a: s3 * gin(out > 0.5 ? T.gi + 1.0 : T.g3b), color: C.ink });
    }
  }

  // ── D：例 2 ──
  function shotEx2() {
    const a = B.win(T.e2 - 0.2, T.how - 0.4); if (a <= 0) return;
    ctag('例 2', DX, DY - 300, { px: 34, a, color: C.peri });
    texAt('ex2', DX, DY - 120, 54, { alpha: a * gin(T.e2 + 0.6), reveal: rv(T.e2 + 0.6, 2.0) });
    B.stamp(DX, DY + 80, false, prog(B.t, T.e2b, T.e2b + 0.4), a, '相关');
    B.card(DX, DY + 260, 680, 90, a * gin(T.g01, 0.5), C.gpt);
    ctag('ℝⁿ 里超过 n 个向量 → 一定线性相关', DX, DY + 260, { px: 32, a: a * gin(T.g01, 0.5), color: C.gpt });
  }

  // ── E：行列式判别 + 压扁 ──
  const Mx = [[2, 1], [4, 2]], M0 = [[2, -1], [1, 1.5]];
  const Pq = new Plane({ ox: DX, oy: DY + 90, u: 60, R: 4.6 });
  function shotDet(D) {
    const a = B.win(T.how - 0.2, T.e4 - 0.4); if (a <= 0) return;
    ctag('ℝⁿ 里 n 个向量：排成方阵的列', DX, DY - 360, { px: 32, a: a * gin(T.how + 0.6), color: C.ink });
    texAt('thm', DX - 170, DY - 270, 50, { alpha: a * gin(T.th), color: OK }); ctag('⇔ 线性无关', DX + 130, DY - 270, { px: 38, a: a * gin(T.th), color: OK });
    ctag('det X = 0 ⇔ 线性相关', DX, DY - 200, { px: 36, a: a * gin(T.th2), color: C.free, font: F.serif });
    const ga = a * gin(T.sq - 0.2, 0.5);
    if (ga > 0) {
      const s = smoother(prog(B.t, T.sq + 0.4, T.sq + 2.0)), M = lerpM(M0, Mx, s);
      B.grid(Pq, M, ga, D, { neu: 0.45, basis: true, old: 0.12, clipY: DY - 160 });
      if (s > 0.95) { const c = [1, -2]; B.vec(Pq, c, ga * gin(T.sq2 - 0.3), { color: C.free, label: 'c', lx: 10, ly: 30, px: 30 });
        texAt('thm0', DX + 230, DY + 250, 38, { alpha: ga * gin(T.sq2), color: C.free }); ctag('c 被送到 0', DX + 230, DY + 310, { px: 28, a: ga * gin(T.sq2), color: C.free }); }
      ctag(s < 0.5 ? 'det ≠ 0' : 'det = 0：压扁成一条线', DX - 220, DY + 300, { px: 30, a: ga, color: s < 0.5 ? OK : C.free });
    }
  }

  // ── F：例 4 ──
  function shotEx4() {
    const a = B.win(T.e4 - 0.2, T.e5a - 0.4); if (a <= 0) return;
    ctag('例 4', DX, DY - 320, { px: 34, a, color: C.peri });
    ctag('(4, 2, 3)ᵀ，(2, 3, 1)ᵀ，(2, −5, 3)ᵀ', DX, DY - 240, { px: 38, a: a * gin(T.e4 + 0.5), color: C.ink, font: F.serif });
    texAt('X4', DX, DY - 80, 50, { alpha: a * gin(T.e4d - 0.8), reveal: rv(T.e4d - 0.8, 1.4) });
    B.stamp(DX + 300, DY + 40, false, prog(B.t, T.e4d + 1.2, T.e4d + 1.6), a, '相关');
    ctag('解 Xc = 0 → 具体关系', DX, DY + 110, { px: 30, a: a * gin(T.e4r), color: C.inkMid });
    texAt('r4', DX, DY + 200, 54, { alpha: a * gin(T.e4r2), reveal: rv(T.e4r2, 1.2), color: C.peri });
  }

  // ── G：例 5 ──
  function shotEx5() {
    const a = B.win(T.e5a - 0.2, T.e6 - 0.4); if (a <= 0) return;
    ctag('ℝ⁴ 里的三个向量：没有行列式 → 消元', DX, DY - 340, { px: 32, a: a * gin(T.e5a + 1.0), color: C.ink });
    ctag('例 5', DX, DY - 260, { px: 34, a: a * gin(T.e5), color: C.peri });
    texAt('X5', DX - 200, DY - 80, 42, { alpha: a * gin(T.e5 + 0.4), reveal: rv(T.e5 + 0.4, 1.0) });
    ctag('→', DX, DY - 80, { px: 46, a: a * gin(T.e5r), color: C.inkMid });
    texAt('R5', DX + 200, DY - 80, 42, { alpha: a * gin(T.e5r), reveal: rv(T.e5r, 1.0) });
    ctag('第 3 列没有主元 → c₃ 自由', DX + 200, DY + 90, { px: 28, a: a * gin(T.e5f), color: C.free });
    texAt('r5', DX, DY + 200, 54, { alpha: a * gin(T.e5x), reveal: rv(T.e5x, 1.2), color: C.peri });
  }

  // ── H：例 6 ──
  function shotEx6() {
    const a = B.win(T.e6 - 0.2, T.w - 0.4); if (a <= 0) return;
    ctag('例 6：多项式', DX, DY - 340, { px: 34, a, color: C.peri });
    texAt('p6', DX, DY - 260, 36, { alpha: a * gin(T.e6 + 0.4), reveal: rv(T.e6 + 0.4, 1.4) });
    ctag('c₁p₁ + c₂p₂ + c₃p₃ = 0，比较系数', DX, DY - 180, { px: 30, a: a * gin(T.e6s - 0.6), color: C.inkMid });
    texAt('sys6', DX, DY - 50, 42, { alpha: a * gin(T.e6s), reveal: rv(T.e6s, 1.2) });
    texAt('s6', DX, DY + 100, 44, { alpha: a * gin(T.e6r), reveal: rv(T.e6r, 1.0), color: C.j });
    texAt('r6', DX, DY + 210, 54, { alpha: a * gin(T.e6r2), reveal: rv(T.e6r2, 1.0), color: C.peri });
  }

  // ── I：朗斯基 ──
  function shotW() {
    const a = B.win(T.w - 0.2, T.u - 0.4); if (a <= 0) return;
    ctag('函数：eˣ 和 e⁻ˣ', DX, DY - 340, { px: 34, a, color: C.peri });
    ctag('第一行：函数    第二行：导数', DX, DY - 260, { px: 30, a: a * gin(T.w2), color: C.inkMid });
    texAt('W', DX, DY - 160, 46, { alpha: a * gin(T.w2 + 0.6), reveal: rv(T.w2 + 0.6, 1.0) * (B.t < T.wv ? 0.62 : 1) });
    texAt('thW', DX - 120, DY - 20, 46, { alpha: a * gin(T.wth), color: OK }); ctag('⇒ 线性无关', DX + 150, DY - 20, { px: 36, a: a * gin(T.wth), color: OK });
    ctag('定理 3.3.3', DX, DY + 40, { px: 26, a: a * gin(T.wth), color: C.inkMid });
    const g = a * gin(T.wg, 0.5);
    B.card(DX, DY + 210, 660, 190, g, C.free);
    texAt('warnW', DX - 150, DY + 160, 44, { alpha: g, color: C.free }); ctag('⇏ 线性相关', DX + 110, DY + 160, { px: 34, a: g, color: C.free });
    ctag('反例（例 8）：', DX - 160, DY + 245, { px: 28, a: g * gin(T.wg2), color: C.inkMid }); texAt('cex', DX + 90, DY + 245, 40, { alpha: g * gin(T.wg2) });
  }

  // ── J：唯一表示 ──
  function shotUniq() {
    const a = B.win(T.u - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('定理 3.3.2：线性无关 ⇒ 表示唯一', DX, DY - 320, { px: 36, a: a * gin(T.u), color: C.peri });
    texAt('u1', DX, DY - 200, 46, { alpha: a * gin(T.u2), reveal: rv(T.u2, 1.0) });
    ctag('相减', DX, DY - 125, { px: 28, a: a * gin(T.u2 + 1.0), color: C.inkMid });
    texAt('u2', DX, DY - 60, 46, { alpha: a * gin(T.u2 + 1.2), reveal: rv(T.u2 + 1.2, 1.0) });
    texAt('u3', DX, DY + 40, 50, { alpha: a * gin(T.u3), reveal: rv(T.u3, 0.8), color: OK });
    const g = a * gin(T.tj, 0.5);
    B.card(DX, DY + 220, 700, 170, g, C.gpt);
    ctag('同济：线性相关 ⇔ 秩 < 向量个数', DX, DY + 175, { px: 30, a: g, color: C.gpt });
    ctag('部分相关 ⇒ 整体相关', DX, DY + 225, { px: 28, a: g * gin(cue('G03', '部分相关')), color: C.ink });
    ctag('整体无关 ⇒ 部分无关', DX, DY + 268, { px: 28, a: g * gin(cue('G03', '整体无关')), color: C.ink });
  }

  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('基', DX, DY - 20, { px: 110, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('能张成 · 不多余', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.o2 + 0.2, t1: T.def - 0.3, head: '白加的向量', items: [['x₃ = 3x₁ + 2x₂', T.o2 + 0.8], ['同一张平面', T.o3], ['移项：零组合', T.mv, { color: C.peri }]] },
    { t0: T.def - 0.3, t1: T.g2 - 0.3, head: '定义', items: [['无关：只有平凡组合', T.def, { color: OK, mark: OK }], ['相关：系数不全为零', T.dep, { color: C.free, mark: C.free }]] },
    { t0: T.g2 - 0.3, t1: T.e2 - 0.3, head: '几何', items: [['ℝ²：相关 = 共线', T.g2], ['ℝ³：相关 = 共面', T.g3], ['无关：新方向', T.gi, { color: OK, mark: OK }]] },
    { t0: T.e2 - 0.3, t1: T.how - 0.3, head: '例 2', items: [['四个向量在 ℝ³', T.e2], ['超过 n 个必相关', T.g01, { color: C.gpt, mark: C.gpt }]] },
    { t0: T.how - 0.3, t1: T.e4 - 0.3, head: '行列式判别', items: [['定理 3.3.1', T.th], ['det = 0：压扁', T.sq, { color: C.free, mark: C.free }], ['非零 c 被送到 0', T.sq2]] },
    { t0: T.e4 - 0.3, t1: T.e6 - 0.3, head: '具体判断', items: [['例 4：det = 0', T.e4d], ['x₃ = 2x₁ − 3x₂', T.e4r2], ['例 5：消元', T.e5], ['x₃ = 3x₁ + x₂', T.e5x]] },
    { t0: T.e6 - 0.3, t1: T.u - 0.3, head: '多项式与函数', items: [['例 6：比较系数', T.e6s], ['3p₁ − 2p₂ + p₃ = 0', T.e6r2], ['朗斯基：W = −2', T.wv], ['W ≡ 0 推不出相关', T.wg, { color: C.free, mark: C.free }]] },
    { t0: T.u - 0.3, t1: T.end - 0.3, head: '唯一表示', items: [['定理 3.3.2', T.u], ['相减 → 系数相等', T.u3, { color: OK, mark: OK }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotOpen(D); shotDef(); shotGeo(D); shotEx2(); shotDet(D); shotEx4(); shotEx5(); shotEx6(); shotW(); shotUniq(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
