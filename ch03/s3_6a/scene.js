// 第 3 章 3.6a 行空间与列空间（Leon 9th §3.6 前半）。
// 分镜：矩阵横看（行框）/ 竖看（列框）→ 例 1 → 定理 3.6.1：行变换不改行空间 → 例 2 阶梯形、秩 2
//       → Ax = 列的线性组合 → ℝ³ 压成平面：b 在面上有解 / 离开平面无解 → 定理 3.6.3、推论 3.6.4（前三章串起来）
//       → 例 3：A 与 U 列关系相同 → 方法：U 找主元列号、回 A 取列 → 例 4（1、2、5 列）→ 预告秩与零化度。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_think', 'ds_happy', 'ds_ask', 'gpt_explain', 'gpt_point', 'gpt_cross'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.6 行空间与列空间', hi: 3, en: 'ROW SPACE AND COLUMN SPACE', titlePx: 88,
    titleEnd: () => B.L('C01').s + 1.0,
    pre: { C03: 0.5, C05: 0.6, C08: 0.5, C10: 0.6, C12: 0.5, C14: 0.4, C16: 0.5, C17: 0.6, C21: 0.5, C22: 0.4 },
    post: { C02: 0.6, C03: 0.8, C07: 0.7, C09: 0.7, C11: 0.6, C13: 0.8, C15: 0.6, G01: 0.8, C18: 0.8, C20: 0.6, G02: 0.6, C21: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, hz: cue('C01', '横着看'), vt: cue('C01', '竖着看'), rs: L('C02').s, cs: cue('C02', '列向量张成的'),
    e1: L('C03').s, e1r: cue('C03', '行空间是'), e1c: cue('C03', '列空间呢'), ds1: L('D01').s, nc: L('C04').s,
    t1: L('C05').s, t1b: L('C06').s, t1c: cue('C06', '倒回去'), basis: L('C07').s, basis2: cue('C07', '非零的那些行'), rank: cue('C07', '秩'),
    e2: L('C08').s, e2u: cue('C08', '化成阶梯形'), e2z: cue('C08', '第三行'), e2r: L('C09').s,
    ax: L('C10').s, ax2: cue('C10', '按列展开'), rng: L('C11').s, t2: L('C12').s, pic: L('C13').s, pin: cue('C13', 'b在平面上'), pout: cue('C13', 'b一旦离开'),
    ds2: L('D02').s, t3a: L('C14').s, t3b: L('C15').s, t3c: cue('C15', '两个解相减'), cor: L('C16').s, chain: L('G01').s,
    e3: L('C17').s, e3b: cue('C17', '列与列之间'), e3u: L('C18').s, e3a: cue('C18', '回到A里'), why: L('C19').s, meth: L('C20').s, meth2: cue('C20', '再回到A'),
    warn: L('G02').s, e4: L('C21').s, e4p: cue('C21', '主元在'), e4a: cue('C21', '所以A的'), ds3: L('D03').s, end: L('C22').s, end2: cue('C22', '下一节'),
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', T.hz, 0.3); TL.sfx('whoosh', T.vt, 0.3); TL.sfx('pop', T.e1r, 0.3); TL.sfx('pop', T.e1c, 0.3);
  TL.sfx('whoosh', T.t1, 0.3); TL.sfx('check', T.t1c + 1.2, 0.3); TL.sfx('ding_hi', T.rank, 0.3); TL.sfx('whoosh', T.e2, 0.3); TL.sfx('warp', T.e2z, 0.3); TL.sfx('ding_hi', T.e2r + 0.8, 0.3);
  TL.sfx('whoosh', T.ax, 0.3); TL.sfx('warp', T.pic + 0.5, 0.38); TL.sfx('check', T.pin, 0.3); TL.sfx('buzz', T.pout + 0.8, 0.25);
  TL.sfx('pluck', T.t3a, 0.25); TL.sfx('pluck', T.t3b, 0.25); TL.sfx('ding_hi', T.cor, 0.3); TL.sfx('shimmer', T.chain + 0.5, 0.35);
  TL.sfx('whoosh', T.e3, 0.3); TL.sfx('pop', T.e3u + 0.5, 0.3); TL.sfx('pop', T.e3a, 0.3); TL.sfx('buzz', T.warn, 0.22); TL.sfx('whoosh', T.e4, 0.3); TL.sfx('check', T.e4a, 0.3); TL.sfx('shimmer', L('C22').e + 0.3, 0.4);

  // 分组框：在 tex 的 \class 分组外画框
  function gbox(key, x, y, px, cls, col, a, pad = 10, anchor = 'c') {
    if (a <= 0) return; const g = B.tex.groupBox(B.tex.place(key, x, y, px, anchor), cls); if (!g) return;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(g.x - g.w / 2 - pad, g.y - g.h / 2 - pad, g.w + 2 * pad, g.h + 2 * pad); ctx.restore();
  }

  // ── A：横看 / 竖看 + 例 1 ──
  function shotIntro() {
    const a = B.win(T.hz - 0.3, T.t1 - 0.4); if (a <= 0) return;
    ctag('横着看：m 个行向量    竖着看：n 个列向量', DX, DY - 340, { px: 32, a: a * gin(T.hz), color: C.ink });
    texAt('A1r', DX, DY - 180, 70, { alpha: a * gin(T.hz) });
    const rA = a * B.win(T.hz, T.vt, 0.3, 0.3) + a * gin(T.e1r) * (1 - gin(T.e1c)), cA = a * B.win(T.vt, T.e1 - 0.2, 0.3, 0.3) + a * gin(T.e1c);
    gbox('A1r', DX, DY - 180, 70, 'r1', C.i, rA, 3); gbox('A1r', DX, DY - 180, 70, 'r2', C.i, rA * 0.8, 3);
    ['c1', 'c2', 'c3'].forEach((c, i) => gbox('A1c', DX, DY - 180, 70, c, C.j, cA * (i === 2 ? 0.8 : 1), 4));
    ctag('行空间：1×n 的行向量', DX - 200, DY - 30, { px: 30, a: a * gin(T.rs), color: C.i });
    ctag('列空间：在 ℝᵐ 里', DX + 200, DY - 30, { px: 30, a: a * gin(T.cs), color: C.j });
    ctag('例 1', DX, DY + 60, { px: 30, a: a * gin(T.e1), color: C.peri });
    texAt('row1', DX - 200, DY + 150, 50, { alpha: a * gin(T.e1r), color: C.i }); ctag('一张平面（2 维）', DX - 200, DY + 220, { px: 28, a: a * gin(T.e1r + 0.6), color: C.i });
    texAt('col1', DX + 200, DY + 150, 56, { alpha: a * gin(T.e1c), color: C.j }); ctag('整个 ℝ²（2 维）', DX + 200, DY + 220, { px: 28, a: a * gin(T.e1c + 0.4), color: C.j });
    ctag('不是巧合 —— 下一节证明', DX, DY + 320, { px: 32, a: a * gin(T.nc), color: C.peri });
  }

  // ── B：定理 3.6.1 + 例 2 ──
  function shotRow() {
    const a = B.win(T.t1 - 0.2, T.ax - 0.4); if (a <= 0) return;
    const s1 = a * (1 - gin(T.e2 - 0.2, 0.4));
    if (s1 > 0) {
      ctag('定理 3.6.1：行等价 ⇒ 行空间相同', DX, DY - 300, { px: 38, a: s1 * gin(T.t1), color: C.peri });
      ctag('行变换：新行 = 旧行的线性组合', DX, DY - 180, { px: 32, a: s1 * gin(T.t1b), color: C.ink });
      ctag('行变换可以倒回去', DX, DY - 120, { px: 32, a: s1 * gin(T.t1c), color: C.ink });
      ctag('互相包含 ⇒ 相等 ✓', DX, DY - 50, { px: 34, a: s1 * gin(T.t1c + 1.2), color: OK });
      B.card(DX, DY + 120, 700, 170, s1 * gin(T.basis2 - 0.3, 0.5), C.i);
      ctag('阶梯形的非零行 = 行空间的基', DX, DY + 80, { px: 34, a: s1 * gin(T.basis2), color: C.i });
      ctag('行空间的维数 = 秩', DX, DY + 150, { px: 40, a: s1 * gin(T.rank), color: C.peri, font: F.serif });
    }
    const s2 = a * gin(T.e2 - 0.2, 0.4);
    if (s2 > 0) {
      ctag('例 2', DX, DY - 330, { px: 32, a: s2, color: C.peri });
      texAt('A2', DX - 220, DY - 150, 46, { alpha: s2 * gin(T.e2 + 0.3), reveal: rv(T.e2 + 0.3, 0.8) });
      ctag('→', DX, DY - 150, { px: 44, a: s2 * gin(T.e2u), color: C.inkMid });
      texAt('U2', DX + 220, DY - 150, 46, { alpha: s2 * gin(T.e2u), reveal: rv(T.e2u, 1.0), cls: { z: 1 - 0.6 * gin(T.e2z + 0.6) } });
      gbox('U2', DX + 220, DY - 150, 46, 'z', C.free, s2 * gin(T.e2z), 8);
      ctag('非零行 (1, −2, 3)、(0, 1, 5)：行空间的基', DX, DY + 40, { px: 32, a: s2 * gin(T.e2r), color: C.i });
      texAt('rk2', DX, DY + 160, 66, { alpha: s2 * gin(T.e2r + 0.8), color: C.peri });
    }
  }

  // ── C：列空间 = 能到达的地方 ──
  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const nrm = [-1, -1, 1];
  function shotCol(D) {
    const a = B.win(T.ax - 0.2, T.t3a - 0.4); if (a <= 0) return;
    const s1 = a * (1 - gin(T.pic - 0.2, 0.5));
    if (s1 > 0) {
      ctag('列空间', DX, DY - 300, { px: 44, a: s1 * gin(T.ax), color: C.j, font: F.serif });
      texAt('Ax', DX, DY - 170, 46, { alpha: s1 * gin(T.ax2), reveal: rv(T.ax2, 1.6) });
      ctag('= 列向量的线性组合', DX, DY - 90, { px: 32, a: s1 * gin(T.ax2 + 1.6), color: C.ink });
      ctag('Ax 能到达的所有地方 = 列空间', DX, DY + 40, { px: 36, a: s1 * gin(T.rng), color: C.j });
      ctag('变换所有可能的输出', DX, DY + 110, { px: 30, a: s1 * gin(T.rng + 1.2), color: C.inkMid });
      texAt('th2', DX - 200, DY + 240, 50, { alpha: s1 * gin(T.t2) }); ctag('有解 ⇔ b 在列空间里', DX + 140, DY + 240, { px: 34, a: s1 * gin(T.t2), color: C.peri });
    }
    const s2 = a * gin(T.pic - 0.2, 0.5);
    if (s2 > 0) {
      const sq = smoother(prog(B.t, T.pic + 0.5, T.pic + 2.0));
      P3.reset();
      P3.setPlane(0, nrm, { color: C.j, alpha: 0.34, scale: outCubic(prog(B.t, T.pic + 0.8, T.pic + 1.8)) });
      // 压扁前：两张淡平面上下夹着（代表 ℝ³ 的厚度）
      if (sq < 1) { P3.setPlane(1, nrm, { color: C.inkMid, alpha: 0.14 * (1 - sq), d: lerp(1.8, 0, sq) }); P3.setPlane(2, nrm, { color: C.inkMid, alpha: 0.14 * (1 - sq), d: lerp(-1.8, 0, sq) }); }
      const out = B.t > T.pout;
      const bIn = [0.8, 0.4, 1.2], bOut = [0.8, 0.4, 1.2].map((q, i) => q + [-0.9, -0.9, 0.9][i] * smooth(prog(B.t, T.pout, T.pout + 1.0)));
      P3.setPoint(0, [0, 0, 0], { r: 0.08, color: C.ink });
      P3.setPoint(1, out ? bOut : bIn, { r: 0.13, color: out ? C.free : OK, alpha: gin(T.pin - 0.3) });
      const V = B.show3D(P3, D, s2, { el: 22, az: 35 + 8 * Math.sin(B.t * 0.3), dist: 12.5, axesA: 0.8, floorA: 0.6 });
      V.lab((out ? bOut : bIn).map((q, i) => q * 1.1 + (i === 2 ? 0.55 : 0)), out ? 'b 离开平面：无解' : 'b 在平面上：有解', { px: 30, a: s2 * gin(T.pin), color: out ? C.free : OK });
      ctag('A 把 ℝ³ 压成一张平面（列空间）', DX, DY + 260, { px: 32, a: s2 * gin(T.pic + 0.5), color: C.j });
      ctag('列空间 = 整个空间 ⇒ 每个 b 都有解', DX, DY + 330, { px: 32, a: s2 * gin(T.ds2), color: C.ds });
    }
  }

  // ── D：定理 3.6.3 / 推论 3.6.4 ──
  function shotThm() {
    const a = B.win(T.t3a - 0.2, T.e3 - 0.4); if (a <= 0) return;
    ctag('定理 3.6.3（A 是 m×n）', DX, DY - 350, { px: 30, a: a * gin(T.t3a), color: C.peri });
    B.card(DX, DY - 260, 760, 80, a * gin(T.t3a), C.j); ctag('每个 b 都有解 ⇔ 列向量张成 ℝᵐ', DX, DY - 260, { px: 34, a: a * gin(T.t3a), color: C.j });
    B.card(DX, DY - 160, 760, 80, a * gin(T.t3b), C.i); ctag('每个 b 至多一个解 ⇔ 列向量线性无关', DX, DY - 160, { px: 34, a: a * gin(T.t3b), color: C.i });
    ctag('两个解相减 → 落在 N(A) 里', DX, DY - 90, { px: 28, a: a * gin(T.t3c), color: C.inkMid });
    ctag('推论 3.6.4：n×n 的 A 非奇异 ⇔ 列向量是 ℝⁿ 的一组基', DX, DY + 10, { px: 32, a: a * gin(T.cor), color: C.peri });
    const ch = a * gin(T.chain, 0.5);
    if (ch > 0) {
      const items = [['A 可逆', '第一章'], ['det A ≠ 0', '第二章'], ['Ax = 0 只有零解', '第一章'], ['列向量是一组基', '第三章']];
      items.forEach(([t, c], i) => { const x = DX - 300 + i * 200, y = DY + 180; B.card(x, y, 185, 110, ch * gin(T.chain + 0.4 * i), C.gpt);
        ctag(t, x, y - 12, { px: 24, a: ch * gin(T.chain + 0.4 * i), color: C.ink }); ctag(c, x, y + 28, { px: 22, a: ch * gin(T.chain + 0.4 * i), color: C.gpt }); });
      ctag('⇔ 全是同一件事', DX, DY + 300, { px: 34, a: ch * gin(T.chain + 2.0), color: C.gpt });
    }
  }

  // ── E：列空间的基 ──
  function shotBasis() {
    const a = B.win(T.e3 - 0.2, T.ds3 - 0.2); if (a <= 0) return;
    const s1 = a * (1 - gin(T.e4 - 0.2, 0.4));
    if (s1 > 0) {
      ctag('例 3：A 与最简形 U —— 列空间不同，列关系相同', DX, DY - 350, { px: 30, a: s1 * gin(T.e3), color: C.peri });
      texAt('A3', DX - 210, DY - 220, 42, { alpha: s1 * gin(T.e3 + 0.4) }); texAt('U3', DX + 210, DY - 220, 42, { alpha: s1 * gin(T.e3 + 0.8) });
      const uh = s1 * gin(T.e3u), ah = s1 * gin(T.e3a);
      gbox('U3', DX + 210, DY - 220, 42, 'c1', C.i, uh, 6); gbox('U3', DX + 210, DY - 220, 42, 'c3', C.i, uh, 6); gbox('U3', DX + 210, DY - 220, 42, 'c2', C.free, uh, 6); gbox('U3', DX + 210, DY - 220, 42, 'c4', C.free, uh, 6);
      gbox('A3', DX - 210, DY - 220, 42, 'c1', C.i, ah, 6); gbox('A3', DX - 210, DY - 220, 42, 'c3', C.i, ah, 6); gbox('A3', DX - 210, DY - 220, 42, 'c2', C.free, ah, 6); gbox('A3', DX - 210, DY - 220, 42, 'c4', C.free, ah, 6);
      texAt('rel3u', DX, DY - 90, 38, { alpha: uh, reveal: rv(T.e3u, 1.4) });
      texAt('rel3a', DX, DY - 30, 38, { alpha: ah, reveal: rv(T.e3a, 1.4), color: C.peri });
      texAt('same', DX, DY + 60, 40, { alpha: s1 * gin(T.why), color: OK }); ctag('解相同 ⇒ 列关系相同', DX, DY + 120, { px: 28, a: s1 * gin(T.why + 0.8), color: OK });
      B.card(DX, DY + 230, 720, 90, s1 * gin(T.meth, 0.5), C.j);
      ctag('U 里找主元列号 → 回到 A 取同样的列', DX, DY + 230, { px: 32, a: s1 * gin(T.meth, 0.5), color: C.j });
      ctag('取 A 的列，不能取 U 的列！', DX, DY + 330, { px: 34, a: s1 * gin(T.warn), color: C.free });
    }
    const s2 = a * gin(T.e4 - 0.2, 0.4);
    if (s2 > 0) {
      ctag('例 4：4×5 矩阵', DX, DY - 350, { px: 32, a: s2, color: C.peri });
      texAt('U4', DX, DY - 200, 40, { alpha: s2 * gin(T.e4 + 0.3) });
      ['c1', 'c2', 'c5'].forEach(c => gbox('U4', DX, DY - 200, 40, c, C.i, s2 * gin(T.e4p), 6));
      texAt('A4', DX, DY + 60, 40, { alpha: s2 * gin(T.e4p + 0.8) });
      ['c1', 'c2', 'c5'].forEach(c => gbox('A4', DX, DY + 60, 40, c, C.j, s2 * gin(T.e4a), 6));
      ctag('列空间的基：', DX - 120, DY + 230, { px: 32, a: s2 * gin(T.e4a), color: C.j }); texAt('b4', DX + 100, DY + 230, 44, { alpha: s2 * gin(T.e4a), color: C.j });
    }
  }

  // ── F：小结 ──
  function shotSum() {
    const a = B.win(T.ds3 - 0.2, T.end2 - 0.2); if (a <= 0) return;
    B.card(DX - 200, DY - 60, 340, 200, a * gin(T.ds3), C.i); ctag('行空间', DX - 200, DY - 110, { px: 40, a: a * gin(T.ds3), color: C.i, font: F.serif }); ctag('取 U 的非零行', DX - 200, DY - 40, { px: 30, a: a * gin(T.ds3), color: C.ink });
    B.card(DX + 200, DY - 60, 340, 200, a * gin(T.ds3 + 0.6), C.j); ctag('列空间', DX + 200, DY - 110, { px: 40, a: a * gin(T.ds3 + 0.6), color: C.j, font: F.serif }); ctag('取 A 的主元列', DX + 200, DY - 40, { px: 30, a: a * gin(T.ds3 + 0.6), color: C.ink });
    ctag('原因：行变换不改行空间，但会改列空间', DX, DY + 140, { px: 32, a: a * gin(T.end), color: C.peri });
  }

  function shotEnd() {
    const a = B.win(T.end2 - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end2), color: C.inkMid });
    ctag('秩与零化度', DX, DY - 20, { px: 96, a: a * gin(T.end2 + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  const SECS = [
    { t0: T.o1 + 1.0, t1: T.t1 - 0.3, head: '两个空间', items: [['行空间：行向量张成', T.rs, { color: C.i, mark: C.i }], ['列空间：列向量张成', T.cs, { color: C.j, mark: C.j }], ['例 1：都是 2 维', T.e1c]] },
    { t0: T.t1 - 0.3, t1: T.ax - 0.3, head: '行空间', items: [['行变换不改行空间', T.t1], ['非零行 = 基', T.basis2], ['维数 = 秩', T.rank, { color: C.peri }], ['例 2：秩 2', T.e2r]] },
    { t0: T.ax - 0.3, t1: T.t3a - 0.3, head: '列空间', items: [['Ax = 列的组合', T.ax2], ['= 所有可能的输出', T.rng], ['有解 ⇔ b 在列空间', T.t2, { color: C.peri }], ['压成平面：b 在 / 不在', T.pic]] },
    { t0: T.t3a - 0.3, t1: T.e3 - 0.3, head: '解的个数', items: [['张成 ℝᵐ：都有解', T.t3a, { color: C.j, mark: C.j }], ['无关：至多一个', T.t3b, { color: C.i, mark: C.i }], ['推论 3.6.4', T.cor], ['前三章串起来', T.chain, { color: C.gpt, mark: C.gpt }]] },
    { t0: T.e3 - 0.3, t1: T.end2 - 0.3, head: '列空间的基', items: [['列关系不变', T.e3b], ['U 找列号', T.meth], ['回 A 取列', T.meth2, { color: C.j, mark: C.j }], ['例 4：a₁、a₂、a₅', T.e4a]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotIntro(); shotRow(); shotCol(D); shotThm(); shotBasis(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
