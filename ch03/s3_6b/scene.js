// 第 3 章 3.6b 秩与秩–零化度（Leon 9th §3.6 后半）。
// 分镜：阶梯形里每个主元占一行一列 → 行秩 = 列秩 → 零化度 → 秩–零化度定理
//       → 3×3 秩 2 矩阵把 ℝ³ 点阵压成平面，一条直线压到原点（2 + 1 = 3）→ 例 3 → Test B 7 问答（印章）
//       → Test B 3 → 同济对照 → 四个基本子空间 → 预告复习。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_think', 'ds_happy', 'ds_proud', 'ds_ask', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.6 秩与零化度', hi: 3, en: 'RANK AND NULLITY',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C05: 0.6, C07: 0.5, C09: 0.5, C10: 0.6, D02: 0.6, C18: 0.6, C21: 0.6, C23: 0.4 },
    post: { C04: 0.6, C06: 0.8, C08: 0.8, C09: 0.6, C12: 0.8, C17: 0.6, C20: 0.6, G01: 0.8, C22: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, piv: L('C02').s, piv2: cue('C02', '也占一列'), same: L('C03').s, same2: cue('C03', '同一批主元'), rk: L('C04').s, tr: cue('C04', '转置以后'),
    nul: L('C05').s, ds1: L('D01').s, thm: L('C06').s, thm2: cue('C06', '秩加零化度'), pic: L('C07').s, pcol: cue('C07', '列空间是二维'), pnul: cue('C07', '有一整条直线'), p3: cue('C07', '二加一'),
    keep: L('C08').s, alg: L('C09').s, e3: L('C10').s, e3p: cue('C10', '主元在'), e3n: L('C11').s, e3n2: cue('C11', '解出零空间的基'), e3c: L('C12').s,
    q7: L('D02').s, q7a: L('C13').s, a7a: L('D03').s, q7b: L('C14').s, a7b: L('D04').s, q7c: L('C15').s, a7c: L('D05').s, q7d: L('C16').s, a7d: L('D06').s, ok7: L('C17').s,
    b3: L('C18').s, b3r: cue('C18', '剩下两个非零行'), b3c: L('C19').s, b3n: cue('C19', '零化度是'), b3v: L('C20').s, tj: L('G01').s,
    nat: L('C21').s, four: L('C22').s, four2: cue('C22', '期中卷'), ds7: L('D07').s, end: L('C23').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.piv, 0.3); TL.sfx('pop', T.piv2, 0.3); TL.sfx('ding_hi', T.same2, 0.3); TL.sfx('warp', T.tr, 0.3);
  TL.sfx('whoosh', T.nul, 0.3); TL.sfx('shimmer', T.thm2, 0.4); TL.sfx('warp', T.pic + 0.4, 0.4); TL.sfx('pop', T.pcol, 0.3); TL.sfx('pop', T.pnul, 0.3); TL.sfx('ding_hi', T.p3, 0.35);
  TL.sfx('whoosh', T.e3, 0.3); TL.sfx('pluck', T.e3p, 0.25); TL.sfx('pop', T.e3n2, 0.3); TL.sfx('check', T.e3c + 1.0, 0.3);
  [T.a7a, T.a7b, T.a7c, T.a7d].forEach(x => TL.sfx('stamp', x + 1.0, 0.32)); TL.sfx('ding_hi', T.ok7, 0.3);
  TL.sfx('whoosh', T.b3, 0.3); TL.sfx('pluck', T.b3r, 0.25); TL.sfx('pop', T.b3n, 0.3); TL.sfx('pop', T.b3v + 1.0, 0.3); TL.sfx('bell_soft', T.tj, 0.3);
  TL.sfx('whoosh', T.nat, 0.3); TL.sfx('shimmer', T.four, 0.35); TL.sfx('shimmer', L('C23').e + 0.3, 0.4);

  function gbox(key, x, y, px, cls, col, a, pad = 6) {
    if (a <= 0) return; const g = B.tex.groupBox(B.tex.place(key, x, y, px, 'c'), cls); if (!g) return;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(g.x - g.w / 2 - pad, g.y - g.h / 2 - pad, g.w + 2 * pad, g.h + 2 * pad); ctx.restore();
  }
  // tex 里带 class 的条目中心（屏幕坐标）
  const centers = (key, pl, cls) => B.tex.f[key].items.filter(it => it.cls.includes(cls)).map(it => [pl.ox + (it.bb[0] + it.bb[2]) / 2 * pl.s, pl.oy + (it.bb[1] + it.bb[3]) / 2 * pl.s]);

  // ── A：主元占一行一列 ──
  function shotPivot() {
    const a = B.win(T.o1 - 0.2, T.nul - 0.4); if (a <= 0) return;
    ctag('行空间维数 = 列空间维数？', DX, DY - 340, { px: 36, a: a * gin(T.o1 + 0.6), color: C.peri });
    const k = 'U3', x = DX, y = DY - 160, px = 64;
    texAt(k, x, y, px, { alpha: a * gin(T.piv - 0.3) });
    const pl = B.tex.place(k, x, y, px, 'c');
    const hb = a * gin(T.piv, 0.5), vb = a * gin(T.piv2, 0.5);
    const cs = centers(k, pl, 'p');
    if (cs.length) {
      const all = B.tex.f[k].items, sx = it => pl.ox + (it.bb[0] + it.bb[2]) / 2 * pl.s, p0 = Math.min(...cs.map(c => c[0])) - 30;
      const inner = all.filter(it => sx(it) > p0 && it.bb[2] - it.bb[0] < 900);
      const xL = Math.min(...inner.map(it => pl.ox + it.bb[0] * pl.s)) - 12, xR = Math.max(...inner.map(it => pl.ox + it.bb[2] * pl.s)) + 12;
      for (const [cx, cy] of cs) {
        ctx.save(); ctx.globalAlpha = hb * 0.22; ctx.fillStyle = C.i; ctx.fillRect(xL, cy - 28, xR - xL, 56); ctx.globalAlpha = vb * 0.22; ctx.fillStyle = C.j; ctx.fillRect(cx - 26, y - pl.h / 2 + 8, 52, pl.h - 16); ctx.restore();
        ctx.save(); ctx.globalAlpha = a * gin(T.piv); ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
    }
    ctag('非零行 → 行空间的基', DX - 200, DY + 20, { px: 30, a: hb, color: C.i }); ctag('主元列 → 列空间的基', DX + 200, DY + 20, { px: 30, a: vb, color: C.j });
    ctag('同一批主元', DX, DY + 100, { px: 40, a: a * gin(T.same2), color: C.peri, font: F.serif });
    ctag('秩 = 行空间维数 = 列空间维数', DX, DY + 200, { px: 36, a: a * gin(T.rk), color: C.ink });
    ctag('rank(Aᵀ) = rank(A)', DX, DY + 280, { px: 34, a: a * gin(T.tr), color: C.inkMid, font: F.serif });
  }

  // ── B：秩–零化度 ──
  function shotThm() {
    const a = B.win(T.nul - 0.2, T.pic - 0.3); if (a <= 0) return;
    ctag('零化度 nullity = dim N(A)', DX, DY - 250, { px: 40, a: a * gin(T.nul), color: C.free, font: F.serif });
    ctag('秩：活下来的维数', DX - 200, DY - 140, { px: 32, a: a * gin(T.ds1), color: C.j }); ctag('零化度：被压没的维数', DX + 200, DY - 140, { px: 32, a: a * gin(T.ds1 + 1.0), color: C.free });
    ctag('秩–零化度定理', DX, DY - 10, { px: 40, a: a * gin(T.thm), color: C.peri, font: F.serif });
    texAt('rn', DX, DY + 110, 60, { alpha: a * gin(T.thm2), reveal: rv(T.thm2, 1.4) });
    ctag('n = 列数 = 输入空间的维数', DX, DY + 220, { px: 30, a: a * gin(T.thm2 + 1.6), color: C.inkMid });
  }

  // ── C：ℝ³ 点阵被压扁 ──
  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const M = [[1, 0, 1], [0, 1, 1], [1, 1, 2]];
  const PTS = []; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) PTS.push([i * 0.6, j * 0.6, k * 0.6]);
  const nl = [1, 1, -1];
  function shotSquash(D) {
    const a = B.win(T.pic - 0.2, T.alg - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.pic + 0.4, T.pic + 2.6));
    const Ms = M.map((r, i) => r.map((v, j) => lerp(i === j ? 1 : 0, v, s)));
    P3.reset();
    P3.setPlane(0, [-1, -1, 1], { color: C.j, alpha: 0.3 * gin(T.pcol), scale: outCubic(prog(B.t, T.pcol, T.pcol + 0.9)) });
    P3.setLine(0, nl, { color: C.free, width: 7, alpha: gin(T.pnul) * (1 - 0.6 * s), grow: smoother(prog(B.t, T.pnul, T.pnul + 0.8)) });
    P3.setPoint(0, [0, 0, 0], { r: 0.1, color: C.ink });
    const V = B.show3D(P3, D, a, { el: 22, az: 20 + 10 * Math.sin(B.t * 0.25), dist: 13, axesA: 0.7, floorA: 0.5 });
    for (const p of PTS) {
      const q = [0, 1, 2].map(i => Ms[i][0] * p[0] + Ms[i][1] * p[1] + Ms[i][2] * p[2]);
      const xy = V.pr(q); B.dot(xy[0], xy[1], 7, C.i, a * 0.85);
    }
    // 零空间上的点：t·(1,1,−1) → 被压向原点
    const za = a * gin(T.pnul);
    if (za > 0) for (let k = -2; k <= 2; k++) { if (!k) continue; const p = nl.map(v => v * k * 0.55), q = [0, 1, 2].map(i => Ms[i][0] * p[0] + Ms[i][1] * p[1] + Ms[i][2] * p[2]); const xy = V.pr(q); B.dot(xy[0], xy[1], 10, C.free, za); }
    texAt('M', DX + 320, DY + 170, 36, { alpha: a * gin(T.pic) });
    ctag('列空间：2 维（平面）', DX - 250, DY - 330, { px: 30, a: a * gin(T.pcol), color: C.j });
    ctag('零空间：1 维（直线 → 原点）', DX - 230, DY - 280, { px: 30, a: a * gin(T.pnul), color: C.free });
    texAt('rn3', DX, DY + 300, 70, { alpha: a * gin(T.p3), color: C.peri });
    ctag('每个维度：要么活下来，要么进零空间', DX, DY + 370, { px: 28, a: a * gin(T.keep) * (1 - gin(T.alg - 0.5)), color: C.ink });
  }

  // ── D：代数 + 例 3 ──
  function shotEx3() {
    const a = B.win(T.alg - 0.2, T.q7 - 0.3); if (a <= 0) return;
    const s1 = a * (1 - gin(T.e3 - 0.2, 0.4));
    if (s1 > 0) {
      ctag('最简形里：', DX, DY - 200, { px: 34, a: s1, color: C.ink });
      ctag('主元变量 r 个', DX - 200, DY - 100, { px: 36, a: s1 * gin(T.alg + 0.8), color: C.j }); ctag('自由变量 n − r 个', DX + 200, DY - 100, { px: 36, a: s1 * gin(cue('C09', '自由变量')), color: C.free });
      ctag('每个自由变量 → 零空间的一个基向量', DX, DY + 20, { px: 32, a: s1 * gin(cue('C09', '每个自由变量')), color: C.ink });
      texAt('alg', DX, DY + 150, 60, { alpha: s1 * gin(cue('C09', '每个自由变量') + 1.0), color: C.peri });
    }
    const s2 = a * gin(T.e3 - 0.2, 0.4);
    if (s2 > 0) {
      ctag('例 3：3×4 矩阵', DX, DY - 350, { px: 32, a: s2, color: C.peri });
      texAt('A3', DX - 210, DY - 230, 40, { alpha: s2 * gin(T.e3 + 0.3) }); ctag('→', DX + 5, DY - 230, { px: 40, a: s2 * gin(T.e3p - 0.5), color: C.inkMid });
      texAt('R3', DX + 200, DY - 230, 40, { alpha: s2 * gin(T.e3p - 0.5) });
      const pl = B.tex.place('R3', DX + 200, DY - 230, 40, 'c');
      for (const [cx, cy] of centers('R3', pl, 'p')) { ctx.save(); ctx.globalAlpha = s2 * gin(T.e3p); ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      ctag('主元在第 1、3 列 → 秩 2', DX + 200, DY - 130, { px: 28, a: s2 * gin(T.e3p), color: C.peri });
      ctag('x₂ = α，x₄ = β', DX, DY - 50, { px: 32, a: s2 * gin(T.e3n), color: C.free, font: F.serif });
      texAt('N3', DX, DY + 100, 44, { alpha: s2 * gin(T.e3n2), reveal: rv(T.e3n2, 1.4) });
      ctag('零化度 2 + 秩 2 = 4 = 列数 ✓', DX, DY + 260, { px: 34, a: s2 * gin(T.e3c), color: OK });
    }
  }

  // ── E：Test B 第 7 题 ──
  function shotQ7() {
    const a = B.win(T.q7 - 0.2, T.b3 - 0.3); if (a <= 0) return;
    ctag('Test B 第 7 题', DX, DY - 360, { px: 32, a, color: C.peri });
    texAt('q7', DX, DY - 290, 46, { alpha: a * gin(T.q7 + 0.6) });
    const Q = [['零空间几维？', 'dim N(A) = 4 − 4 = 0', T.q7a, T.a7a, true], ['列向量张成 ℝ⁶？', '列空间 4 维 < 6：张不成', T.q7b, T.a7b, false], ['列向量线性无关？', '秩 = 列数：无关', T.q7c, T.a7c, true], ['b 在列空间：几个解？', '有解 + 至多一个 = 正好一个', T.q7d, T.a7d, true]];
    Q.forEach(([q, ans, tq, ta, ok], i) => {
      const y = DY - 190 + i * 125, s = a * gin(tq);
      B.card(DX, y, 760, 105, s, C.inkMid);
      ctag(q, DX - 200, y - 22, { px: 28, a: s, color: C.ink });
      ctag(ans, DX - 60, y + 22, { px: 30, a: a * gin(ta + 0.6), color: ok ? OK : C.free });
      B.stamp(DX + 300, y, ok, prog(B.t, ta + 1.0, ta + 1.4), a, ok ? '✓' : '✗ 不能');
    });
  }

  // ── F：Test B 第 3 题 ──
  function shotB3() {
    const a = B.win(T.b3 - 0.2, T.nat - 0.3); if (a <= 0) return;
    ctag('Test B 第 3 题：4×5 矩阵', DX, DY - 360, { px: 32, a, color: C.peri });
    texAt('B3', DX - 210, DY - 230, 36, { alpha: a * gin(T.b3 + 0.4) }); ctag('→', DX + 5, DY - 230, { px: 40, a: a * gin(T.b3r - 0.6), color: C.inkMid });
    texAt('BR3', DX + 210, DY - 230, 36, { alpha: a * gin(T.b3r - 0.6) });
    ['c1', 'c3'].forEach(c => { gbox('BR3', DX + 210, DY - 230, 36, c, C.peri, a * gin(T.b3c), 4); gbox('B3', DX - 210, DY - 230, 36, c, C.j, a * gin(T.b3c + 1.0), 4); });
    ctag('秩 2；A 的第 1、3 列：列空间的基', DX, DY - 100, { px: 30, a: a * gin(T.b3c), color: C.j });
    texAt('n3', DX, DY - 30, 46, { alpha: a * gin(T.b3n), color: C.free });
    ctag('x₂、x₄、x₅ 逐个取 1', DX, DY + 40, { px: 28, a: a * gin(T.b3v), color: C.inkMid });
    texAt('NB3', DX, DY + 165, 30, { alpha: a * gin(T.b3v + 1.0), reveal: rv(T.b3v + 1.0, 1.6) });
    const g = a * gin(T.tj, 0.5);
    if (g > 0) { B.card(DX, DY + 330, 780, 90, g, C.gpt); ctag('同济：R(A)；基础解系 n − r 个；三秩相等', DX, DY + 330, { px: 28, a: g, color: C.gpt }); }
  }

  // ── G：四个基本子空间 ──
  function shotFour() {
    const a = B.win(T.nat - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('四个基本子空间（A 是 m×n，秩 r）', DX, DY - 330, { px: 34, a: a * gin(T.nat), color: C.peri });
    const S = [['行空间', 'r', C.i, T.nat + 0.3], ['列空间', 'r', C.j, T.nat + 0.6], ['N(A)', 'n − r', C.free, T.nat + 0.9], ['N(Aᵀ)', 'm − r', C.k, T.nat + 1.8]];
    S.forEach(([n, d, col, t0], i) => { const x = DX + (i % 2 ? 190 : -190), y = DY - 150 + Math.floor(i / 2) * 210;
      B.card(x, y, 330, 170, a * gin(t0), col); ctag(n, x, y - 30, { px: 40, a: a * gin(t0), color: col, font: F.serif }); ctag('维数 ' + d, x, y + 35, { px: 30, a: a * gin(t0), color: C.ink }); });
    ctag('期中卷年年考 → 复习课做一道', DX, DY + 280, { px: 32, a: a * gin(T.four2), color: C.gpt });
  }

  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('第三章复习', DX, DY - 20, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('判断题 + 期中真题', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.piv - 0.2, t1: T.nul - 0.3, head: '行秩 = 列秩', items: [['主元占一行', T.piv, { color: C.i, mark: C.i }], ['也占一列', T.piv2, { color: C.j, mark: C.j }], ['同一批主元', T.same2], ['转置秩不变', T.tr]] },
    { t0: T.nul - 0.3, t1: T.pic - 0.3, head: '秩–零化度', items: [['零化度 = dim N(A)', T.nul, { color: C.free, mark: C.free }], ['秩 + 零化度 = n', T.thm2, { color: C.peri }]] },
    { t0: T.pic - 0.3, t1: T.alg - 0.3, head: '画面', items: [['列空间：平面', T.pcol, { color: C.j, mark: C.j }], ['零空间：直线', T.pnul, { color: C.free, mark: C.free }], ['2 + 1 = 3', T.p3, { color: C.peri }]] },
    { t0: T.alg - 0.3, t1: T.q7 - 0.3, head: '例 3', items: [['主元 r 个 / 自由 n − r 个', T.alg], ['秩 2', T.e3p], ['零空间两个基向量', T.e3n2], ['2 + 2 = 4', T.e3c, { color: OK, mark: OK }]] },
    { t0: T.q7 - 0.3, t1: T.b3 - 0.3, head: 'Test B 7', items: [['dim N(A) = 0', T.a7a], ['张不成 ℝ⁶', T.a7b, { color: C.free, mark: C.free }], ['线性无关', T.a7c], ['正好一个解', T.a7d, { color: OK, mark: OK }]] },
    { t0: T.b3 - 0.3, t1: T.nat - 0.3, head: 'Test B 3', items: [['秩 2', T.b3r], ['第 1、3 列', T.b3c], ['零化度 3', T.b3n, { color: C.free, mark: C.free }]] },
    { t0: T.nat - 0.3, t1: T.end - 0.3, head: '四个子空间', items: [['行 / 列：r', T.nat + 0.3], ['N(A)：n − r', T.nat + 0.9], ['N(Aᵀ)：m − r', T.nat + 1.8]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotPivot(); shotThm(); shotSquash(D); shotEx3(); shotQ7(); shotB3(); shotFour(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
