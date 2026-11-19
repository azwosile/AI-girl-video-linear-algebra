// 第 6 章 6.5 奇异值分解（Leon 9th §6.5：定理 6.5.1、例 1、秩、定理 6.5.3、应用）。
// 分镜：任何矩阵都能分解？→ 3B1B：单位圆 → 椭圆（A = (3 0; 4 5)），半轴 3√5、√5，v₁ ⊥ v₂ ↦ Av₁ ⊥ Av₂ → AᵀA 的特征值 45、5
//       → 定理 A = UΣVᵀ → 转、拉、转三步动画 → 求法 → 例 1（圆被压成线段 → 秩 1）→ 一层一层的和 → 最佳低秩逼近
//       → 图像压缩：程序生成 40×40 图，前 k 层重建 + 奇异值柱 → 应用 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM, rgba } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

// 对称矩阵 Jacobi 特征分解（图像压缩用，40×40）
function jacobi(S) {
  const n = S.length, A = S.map(r => r.slice()), V = A.map((_, i) => A.map((_, j) => +(i === j)));
  for (let sweep = 0; sweep < 30; sweep++) {
    let off = 0; for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q]; if (off < 1e-10) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-12) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const ev = A.map((r, i) => r[i]), idx = ev.map((_, i) => i).sort((a, b) => ev[b] - ev[a]);
  return { vals: idx.map(i => ev[i]), vecs: idx.map(i => V.map(r => r[i])) };
}

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.5 奇异值分解', hi: 3, en: 'THE SINGULAR VALUE DECOMPOSITION',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.4, C05: 0.4, C06: 0.6, C07: 0.4, C08: 0.4, C09: 0.6, C11: 0.4, C12: 0.6, C14: 0.6, G01: 0.6, C16: 0.6 },
    post: { C01: 0.6, C02: 1.6, C03: 0.8, C04: 1.0, C05: 0.8, C06: 0.8, C07: 3.0, C08: 0.8, C10: 1.0, C11: 0.8, C12: 0.8, C13: 0.8, C14: 2.4, C15: 0.6, G02: 0.6, C16: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, o2: cue('C01', '有，奇异值分解'), el: L('C02').s, el2: cue('C02', '比如A'), ax: L('C03').s, ax2: cue('C03', '叫作A的奇异值'), vv: L('C04').s, vv2: cue('C04', '它们互相垂直'), vv3: cue('C04', '变换以后'), d1: L('D01').s,
    ata: L('C05').s, ata2: cue('C05', 'v是A的转置'), ata3: cue('C05', '特征值四十五'), th: L('C06').s, th2: cue('C06', 'V和U分别'), rd: L('C07').s, rd1: cue('C07', '先用V的转置'), rd2: cue('C07', '再用大西格玛'), rd3: cue('C07', '最后用U'), rd4: cue('C07', '转、拉、转'),
    how: L('C08').s, e1: L('C09').s, e1b: cue('C09', '特征值四和零'), e1u: L('C10').s, e1u2: cue('C10', 'U的其余两列'), d2: L('D02').s, rk: L('C11').s, rk2: cue('C11', '非零奇异值的个数'),
    ly: L('C12').s, ly2: cue('C12', '每一层'), bs: L('C13').s, bs2: cue('C13', '误差就是'), im: L('C14').s, im2: cue('C14', '保留最大的三十个'), d3: L('D03').s, ap: L('C15').s,
    tj: L('G01').s, tj2: L('G02').s, sum: L('C16').s, end: L('C17').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.o2, 0.3); TL.sfx('warp', T.el2 + 0.5, 0.35); TL.sfx('pop', T.ax, 0.3); TL.sfx('ding', T.ax2, 0.3); TL.sfx('pop', T.vv, 0.3); TL.sfx('check', T.vv3 + 0.8, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.ata2, 0.3); TL.sfx('ding_hi', T.ata3, 0.3); TL.sfx('sting', T.th, 0.32); TL.sfx('pop', T.th2, 0.3); TL.sfx('swoosh_soft', T.rd1, 0.3); TL.sfx('warp', T.rd2, 0.3); TL.sfx('swoosh_soft', T.rd3, 0.3); TL.sfx('ding_hi', T.rd4, 0.3);
  TL.sfx('pop', T.how, 0.3); TL.sfx('pop', T.e1, 0.3); TL.sfx('pop', T.e1u, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('crack', T.rk + 0.3, 0.3); TL.sfx('ding', T.rk2, 0.3);
  TL.sfx('whoosh', T.ly, 0.3); TL.sfx('pop', T.bs, 0.3); TL.sfx('whoosh', T.im, 0.3); TL.sfx('riser', T.im + 0.6, 0.25); TL.sfx('sparkle', T.im2, 0.3); TL.sfx('pluck', T.d3, 0.3); TL.sfx('pop', T.ap, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C17').e + 0.3, 0.4);

  const A = [[3, 0], [4, 5]], s1 = 3 * Math.sqrt(5), s2 = Math.sqrt(5);
  const rot = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
  const mul = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]], [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
  const P = new Plane({ ox: DX + 20, oy: DY + 90, u: 40, R: 14 });
  const v1 = [Math.SQRT1_2, Math.SQRT1_2], v2 = [-Math.SQRT1_2, Math.SQRT1_2];
  // ── A：圆 → 椭圆 ──
  function shotA(D) {
    const a = B.win(T.o - 0.2, T.th - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.el - 0.2));
    ctag('特征值：只对方阵 · 未必可对角化', DX, DY - 120, { px: 34, a: g0 * gin(T.o + 0.3), color: C.inkMid });
    ctag('任何矩阵都行的分解？', DX, DY - 30, { px: 46, a: g0 * gin(T.o + 2.5), color: C.peri, font: F.serif });
    ctag('奇异值分解', DX, DY + 70, { px: 40, a: g0 * gin(T.o2), color: OK, font: F.serif });
    const g = a * gin(T.el - 0.2); if (g <= 0) return;
    const s = smoother(prog(B.t, T.el2 + 0.5, T.el2 + 2.5)) * (1 - 0) ;
    B.warp(P, A, s, g, D, { basis: false, neu: 0.3, clipY: DY - 300 });
    const Ms = B.mapCircle(P, D, A, s, g, { color: C.peri, width: 4, fill: 0.12, radii: gin(T.vv) > 0 ? [{ v: v1, col: C.i }, { v: v2, col: C.j }] : [] });
    texAt('A', DX - 300, DY - 380, 34, { alpha: g });
    const ga = g * gin(T.ax); if (ga > 0 && s > 0.98) {
      const u1 = [1 / Math.sqrt(10), 3 / Math.sqrt(10)], u2 = [-3 / Math.sqrt(10), 1 / Math.sqrt(10)];
      B.line2(P.S([-u1[0] * s1, -u1[1] * s1]), P.S([u1[0] * s1, u1[1] * s1]), C.i, ga * 0.6, 2, [8, 8]); B.line2(P.S([-u2[0] * s2, -u2[1] * s2]), P.S([u2[0] * s2, u2[1] * s2]), C.j, ga * 0.6, 2, [8, 8]);
      ctag('σ₁ = 3√5', ...P.S([u1[0] * s1 * 0.6 + 1.2, u1[1] * s1 * 0.6]), { px: 28, a: ga, color: C.i, font: F.serif }); ctag('σ₂ = √5', ...P.S([u2[0] * s2 - 1.4, u2[1] * s2 + 0.4]), { px: 28, a: ga, color: C.j, font: F.serif });
      if (gin(T.vv3) > 0) B.rightMark(P.S([0, 0]), [P.S(u1)[0] - P.ox, P.S(u1)[1] - P.oy], [P.S(u2)[0] - P.ox, P.S(u2)[1] - P.oy], ga * gin(T.vv3 + 0.8), { s: 24, color: C.ink });
    }
    texAt('sig', DX + 180, DY - 380, 32, { alpha: g * gin(T.ax2) });
    texAt('vv', DX + 120, DY - 300, 28, { alpha: g * gin(T.vv) * (1 - gin(T.ata - 0.2)) });
    ctag('Av₁ ⊥ Av₂', DX + 300, DY + 380, { px: 32, a: g * gin(T.vv3 + 0.8), color: OK, font: F.serif });
    texAt('ata', DX + 120, DY - 300, 30, { alpha: a * gin(T.ata2) });
    ctag('√45 = 3√5，√5 = √5', DX - 230, DY + 400, { px: 28, a: a * gin(T.ata3), color: C.peri, font: F.serif });
  }

  // ── B：定理 + 转、拉、转 ──
  const thV = -Math.PI / 4, thU = Math.atan2(3, 1);
  function shotB(D) {
    const a = B.win(T.th - 0.2, T.e1 - 0.3); if (a <= 0) return;
    B.card(DX, DY - 390, 380, 90, a, C.peri); texAt('svd', DX, DY - 390, 48, { alpha: a });
    const gt = a * (1 - gin(T.rd - 0.2));
    texAt('sigm', DX, DY - 230, 34, { alpha: gt * gin(T.th2) });
    ctag('V（n 阶）、U（m 阶）：正交矩阵', DX, DY - 100, { px: 30, a: gt * gin(T.th2), color: C.inkMid });
    ctag('Σ：对角线上非负，从大到小', DX, DY - 40, { px: 30, a: gt * gin(T.th2 + 3.0), color: C.inkMid });
    const g = a * gin(T.rd - 0.2) * (1 - gin(T.how - 0.2)); if (g > 0) {
      const p1 = smoother(prog(B.t, T.rd1 + 0.5, T.rd1 + 2.0)), p2 = smoother(prog(B.t, T.rd2 + 0.3, T.rd2 + 2.0)), p3 = smoother(prog(B.t, T.rd3 + 0.3, T.rd3 + 2.0));
      const M = mul(rot(thU * p3), mul([[lerp(1, s1, p2), 0], [0, lerp(1, s2, p2)]], rot(thV * p1)));
      B.warp(P, M, 1, g, D, { basis: false, neu: 0.3, clipY: DY - 320 });
      B.mapCircle(P, D, M, 1, g, { color: C.peri, width: 4, fill: 0.12, radii: [{ v: v1, col: C.i }, { v: v2, col: C.j }] });
      const lab = p3 > 0.02 ? 'U：转到 u 方向' : p2 > 0.02 ? 'Σ：沿坐标轴拉伸' : p1 > 0.02 ? 'Vᵀ：v 转到坐标轴' : '';
      ctag(lab, DX, DY - 290, { px: 34, a: g * gin(T.rd1), color: p3 > 0.02 ? C.k : p2 > 0.02 ? C.peri : C.j, font: F.serif });
      ctag('转 · 拉 · 转', DX, DY + 400, { px: 40, a: g * gin(T.rd4), color: OK, font: F.serif });
    }
    const gh = a * gin(T.how - 0.2); if (gh <= 0) return;
    B.card(DX, DY - 230, 760, 110, gh, C.peri); texAt('how', DX, DY - 230, 36, { alpha: gh });
    ctag('σᵢ 来自 AᵀA · vᵢ 是单位特征向量 · uᵢ 算出来', DX, DY - 120, { px: 28, a: gh, color: C.inkMid });
  }

  // ── C：例 1 + 秩 ──
  const P1 = new Plane({ ox: DX + 230, oy: DY + 180, u: 70, R: 4 });
  function shotC(D) {
    const a = B.win(T.e1 - 0.2, T.ly - 0.3); if (a <= 0) return;
    texAt('e1A', DX, DY - 380, 30, { alpha: a * gin(T.e1), reveal: rv(T.e1, 3.0) });
    texAt('e1u', DX, DY - 270, 26, { alpha: a * gin(T.e1u), reveal: rv(T.e1u, 5.0) });
    ctag('其余两列：N(Aᵀ) 的标准正交基', DX, DY - 190, { px: 26, a: a * gin(T.e1u2), color: C.inkMid });
    const gr = a * gin(T.d2); if (gr <= 0) return;
    const s = smoother(prog(B.t, T.rk + 0.3, T.rk + 2.0));
    ctx.save(); B.K.clip(D); P1.grid(ctx, { M: I2, color: C.gridOld, width: 1, alpha: 0.12 * gr }); ctx.restore();
    B.mapCircle(P1, D, [[1, 1], [1, 1]], s, gr, { color: C.peri, width: 4, fill: 0.15, radii: [{ v: v1, col: C.i }, { v: v2, col: C.free }] });
    ctag('σ₂ = 0：这个方向被压扁', P1.ox, DY + 420, { px: 26, a: gr * gin(T.rk + 1.5), color: C.free });
    B.card(DX - 230, DY + 60, 400, 90, a * gin(T.rk2), C.peri); texAt('rank', DX - 230, DY + 60, 32, { alpha: a * gin(T.rk2) });
    ctag('例 1：秩 = 1', DX - 230, DY + 150, { px: 32, a: a * gin(T.rk2 + 1.5), color: OK, font: F.serif });
  }

  // ── D：分层 + 图像压缩 ──
  const NI = 40, IMG = [];
  for (let i = 0; i < NI; i++) { const r = []; for (let j = 0; j < NI; j++) { const x = (j - 20) / 20, y = (i - 20) / 20; let v = 0.12;
    if (Math.hypot(x + 0.15, y + 0.1) < 0.55) v = 0.9; if (Math.hypot(x + 0.15, y + 0.1) < 0.3) v = 0.25;
    if (x + y > 0.6 && x + y < 0.95) v = 0.75; if (y > 0.55 && x < -0.2) v = 0.6; if (Math.abs(x - 0.6) < 0.08 && y < 0.2) v = 0.85; r.push(v); } IMG.push(r); }
  const ATA = IMG[0].map((_, p) => IMG[0].map((_, q) => IMG.reduce((s, r) => s + r[p] * r[q], 0)));
  const ED = jacobi(ATA), SV = ED.vals.map(v => Math.sqrt(Math.max(0, v)));
  const UC = ED.vecs.map((vv, k) => IMG.map(r => r.reduce((s, x, j) => s + x * vv[j], 0) / (SV[k] || 1)));
  const recon = k => IMG.map((_, i) => IMG[0].map((_, j) => { let s = 0; for (let l = 0; l < k; l++) s += SV[l] * UC[l][i] * ED.vecs[l][j]; return s; }));
  const RC = {}; [1, 2, 3, 5, 8, 12, 20, 30].forEach(k => RC[k] = recon(k));
  function img(M, x, y, px, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < NI; i++) for (let j = 0; j < NI; j++) { const v = Math.max(0, Math.min(1, M[i][j])); ctx.fillStyle = `rgb(${Math.round(18 + v * (242 - 18))},${Math.round(16 + v * (226 - 16))},${Math.round(16 + v * (200 - 16))})`; ctx.fillRect(x + j * px, y + i * px, px + 0.5, px + 0.5); } ctx.restore(); }
  function shotD() {
    const a = B.win(T.ly - 0.2, T.tj - 0.3); if (a <= 0) return;
    texAt('layers', DX, DY - 390, 34, { alpha: a * gin(T.ly), reveal: rv(T.ly, 4.0) });
    ctag('每层秩 1 · σ 越大越重要', DX, DY - 320, { px: 28, a: a * gin(T.ly2), color: C.inkMid });
    texAt('best', DX, DY - 240, 28, { alpha: a * gin(T.bs) });
    const gi = a * gin(T.im - 0.2); if (gi <= 0) return;
    const ks = [1, 2, 3, 5, 8, 12, 20, 30], kk = ks[Math.min(ks.length - 1, Math.floor(prog(B.t, T.im + 0.6, T.im2 + 0.5) * ks.length))];
    img(IMG, DX - 400, DY - 140, 8, gi); ctag('原图 40×40', DX - 240, DY + 210, { px: 26, a: gi, color: C.inkMid });
    img(RC[kk], DX + 40, DY - 140, 8, gi); ctag(`前 ${kk} 层`, DX + 200, DY + 210, { px: 30, a: gi, color: C.peri, font: F.serif });
    // 奇异值柱
    const bx = DX - 330, by = DY + 360, w = 16; for (let l = 0; l < 30; l++) { const h = Math.min(110, 110 * SV[l] / SV[0]); ctx.save(); ctx.globalAlpha = gi * (l < kk ? 0.9 : 0.25); ctx.fillStyle = l < kk ? C.peri : C.inkMid; ctx.fillRect(bx + l * (w + 6), by - h, w, h); ctx.restore(); }
    ctag('σ₁ ≥ σ₂ ≥ ···', DX + 360, DY + 320, { px: 26, a: gi, color: C.inkMid, font: F.serif });
    ctag('扔掉小的奇异值', DX, DY + 260, { px: 34, a: a * gin(T.d3), color: C.ds, font: F.serif });
    const ga = a * gin(T.ap); ctag('数值秩 · 潜在语义索引 · 主成分分析', DX, DY + 430, { px: 28, a: ga, color: OK });
  }

  // ── E：同济 + 小结 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济对照：不讲 SVD', DX, DY - 330, { px: 34, a: g1, color: C.gpt });
    ctag('基础：对称矩阵正交对角化', DX, DY - 250, { px: 32, a: g1 * gin(T.tj + 2.0), color: C.ink });
    texAt('tj', DX, DY - 160, 38, { alpha: g1 * gin(cue('G01', '正是对A的转置')) });
    const gr = g1 * gin(T.tj2);
    B.card(DX - 220, DY + 40, 400, 200, gr, C.inkMid); B.card(DX + 220, DY + 40, 400, 200, gr * gin(T.tj2 + 3), C.peri);
    ctag('特征分解', DX - 220, DY - 30, { px: 32, a: gr, color: C.ink, font: F.serif }); ctag('一个 X · 方阵', DX - 220, DY + 30, { px: 28, a: gr, color: C.inkMid }); ctag('λ 可正可负可复', DX - 220, DY + 90, { px: 28, a: gr, color: C.inkMid });
    ctag('奇异值分解', DX + 220, DY - 30, { px: 32, a: gr * gin(T.tj2 + 3), color: C.peri, font: F.serif }); ctag('两个正交矩阵 · 任意形状', DX + 220, DY + 30, { px: 28, a: gr * gin(T.tj2 + 3), color: C.ink }); ctag('σ 永远 ≥ 0', DX + 220, DY + 90, { px: 28, a: gr * gin(T.tj2 + 3), color: C.ink });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    B.card(DX, DY - 230, 380, 96, g2, C.peri); texAt('svd', DX, DY - 230, 48, { alpha: g2 });
    ctag('转 · 拉 · 转', DX, DY - 140, { px: 36, a: g2, color: OK, font: F.serif });
    ctag('σᵢ = √λᵢ(AᵀA) · 非零个数 = 秩', DX, DY - 50, { px: 32, a: g2 * gin(cue('C16', '奇异值是')), color: C.ink });
    ctag('截断 = 最佳低秩逼近', DX, DY + 30, { px: 32, a: g2 * gin(cue('C16', '截断')), color: C.peri });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('二次型', DX, DY - 20, { px: 96, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('对称矩阵的另一张面孔', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.o - 0.2, t1: T.th - 0.3, head: '圆 → 椭圆', items: [['半轴 = 奇异值', T.ax2, { color: C.peri }], ['σ = 3√5，√5', T.ax2 + 1], ['v₁ ⊥ v₂ ↦ Av₁ ⊥ Av₂', T.vv3], ['AᵀA：45、5', T.ata3]] },
    { t0: T.th - 0.2, t1: T.ly - 0.3, head: '奇异值分解', items: [['A = UΣVᵀ', T.th, { color: C.peri }], ['转 · 拉 · 转', T.rd4, { color: OK }], ['σᵢ = √λᵢ(AᵀA)', T.how], ['例 1：σ = 2，0', T.e1b], ['秩 = 非零 σ 个数', T.rk2, { color: C.peri }]] },
    { t0: T.ly - 0.2, t1: T.tj - 0.3, head: '低秩逼近', items: [['一层一层的和', T.ly], ['前 k 层最近', T.bs, { color: C.peri }], ['图像压缩', T.im2], ['PCA、LSI…', T.ap]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['任何矩阵都能 SVD', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(D); shotB(D); shotC(D); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
