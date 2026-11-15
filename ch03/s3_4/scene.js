// 第 3 章 3.4 基与维数（Leon 9th §3.4）。
// 分镜：基 = 张成（够用）+ 无关（不浪费）→ 三组基（标准基 / (1,1,1)… / E₁₁…）→ 定理 3.4.1：平面里第三个一定被表示
//       → m = n → 维数表 → P 无穷维 → ℝ³ 子空间四类（点 / 线 / 面 / 全空间）→ 定理 3.4.3 + 例 4（det = 2）
//       → 定理 3.4.4 三句 → Test B 6：对称矩阵拆成三块（dim = 3）→ 预告换基。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_happy', 'ds_think', 'ds_ask', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.4 基与维数', hi: 3, en: 'BASIS AND DIMENSION',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.5, C07: 0.4, C08: 0.6, C11: 0.4, C12: 0.4, C13: 0.3, C15: 0.6, C16: 0.6, C18: 0.4, C20: 0.6, C21: 0.3, C24: 0.6 },
    post: { C03: 0.6, C06: 0.7, C10: 0.7, C12: 0.8, C14: 0.6, G01: 0.6, C17: 0.6, C19: 0.6, C20: 0.8, C23: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, def: L('C02').s, sp: L('C03').s, ind: cue('C03', '线性无关'),
    std: L('C04').s, b2: L('C05').s, mat: L('C06').s, mat2: cue('C06', '每个矩阵'),
    ds1: L('D01').s, num: L('C07').s, th1: L('C08').s, th1b: cue('C08', '一定线性相关'), pic: L('C09').s, pic2: cue('C09', '取三个'), pic3: cue('C09', '第三个一定'),
    mn: L('C10').s, mn2: cue('C10', '所以两者相等'), dim: L('C11').s, tab: L('C12').s,
    t1: cue('C12', 'R n的维数'), t2: cue('C12', '二乘二'), t3: cue('C12', 'P n'), t4: cue('C12', '零子空间'),
    ds2: L('D02').s, inf: L('C13').s, inf2: cue('C13', '可是'), inf3: cue('C13', '就矛盾了'), inf4: L('C14').s,
    sub: L('C15').s, s0: cue('C15', '零维'), s1: cue('C15', '一维'), s2: cue('C15', '二维'), s3: cue('C15', '三维'), g1: L('G01').s,
    th3: L('C16').s, th3b: L('C17').s, th3c: cue('C17', '张成，也就'), th3d: cue('C17', '查一条'),
    e4: L('C18').s, e4d: cue('C18', '算一下行列式'), e4v: L('C19').s,
    th4: L('C20').s, th4a: cue('C20', '少于n个'), th4b: cue('C20', '可以扩充'), th4c: cue('C20', '可以删减'),
    ds3: L('D03').s, tb: L('C21').s, ds4: L('D04').s, sym: L('C22').s, sym2: cue('C22', '把它拆开'), ds5: L('D05').s, dimS: L('C23').s, dimS2: cue('C23', '维数是三'), tj: L('G02').s, end: L('C24').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', T.def, 0.3); TL.sfx('pluck', T.sp, 0.25); TL.sfx('pluck', T.ind, 0.25);
  TL.sfx('whoosh', T.std, 0.3); TL.sfx('pop', T.b2, 0.3); TL.sfx('pop', T.mat, 0.3); TL.sfx('ding_hi', T.num, 0.3);
  TL.sfx('whoosh', T.th1, 0.3); TL.sfx('pop', T.pic2, 0.3); TL.sfx('warp', T.pic3, 0.3); TL.sfx('check', T.mn2, 0.32); TL.sfx('ding_hi', T.dim, 0.35);
  [T.t1, T.t2, T.t3, T.t4].forEach(x => TL.sfx('pop', x, 0.28)); TL.sfx('warp', T.inf3, 0.3); TL.sfx('shimmer', T.inf4, 0.35);
  [T.s0, T.s1, T.s2, T.s3].forEach(x => TL.sfx('pop', x, 0.28)); TL.sfx('bell_soft', T.g1, 0.3);
  TL.sfx('whoosh', T.th3, 0.3); TL.sfx('check', T.th3d, 0.3); TL.sfx('whoosh', T.e4, 0.3); TL.sfx('stamp', T.e4v + 0.8, 0.35);
  [T.th4a, T.th4b, T.th4c].forEach(x => TL.sfx('pluck', x, 0.25)); TL.sfx('whoosh', T.tb, 0.3); TL.sfx('check', T.ds4 + 1.5, 0.3); TL.sfx('pop', T.sym2, 0.3); TL.sfx('ding_hi', T.dimS2, 0.35);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const cam = (az = 40) => ({ el: 24, az: az + 8 * Math.sin(B.t * 0.3), dist: 12.5, axesA: 0.8, floorA: 0.6 });

  // ── A：定义 ──
  function shotDef() {
    const a = B.win(T.o1 - 0.2, T.std - 0.4); if (a <= 0) return;
    ctag('基', DX, DY - 200, { px: 130, a: a * gin(T.o1 + 1.0, 0.5), color: C.peri, font: F.serif });
    ctag('= 线性无关 + 张成 V', DX, DY - 50, { px: 44, a: a * gin(T.def), color: C.ink });
    B.card(DX - 200, DY + 130, 340, 150, a * gin(T.sp), C.j); ctag('张成', DX - 200, DY + 100, { px: 40, a: a * gin(T.sp), color: C.j, font: F.serif }); ctag('够用：都凑得出来', DX - 200, DY + 160, { px: 28, a: a * gin(T.sp), color: C.ink });
    B.card(DX + 200, DY + 130, 340, 150, a * gin(T.ind), C.i); ctag('无关', DX + 200, DY + 100, { px: 40, a: a * gin(T.ind), color: C.i, font: F.serif }); ctag('不浪费：一个不多', DX + 200, DY + 160, { px: 28, a: a * gin(T.ind), color: C.ink });
  }

  // ── B：三组基 ──
  function shotBases(D) {
    const a = B.win(T.std - 0.2, T.ds1 + 0.6); if (a <= 0) return;
    const s3 = a * (1 - gin(T.mat - 0.2, 0.4));
    if (s3 > 0) {
      const m = smoother(prog(B.t, T.b2, T.b2 + 1.2));
      const E = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], Bv = [[1, 1, 1], [1, 1, 0], [1, 0, 0]];
      P3.reset(); P3.setPoint(0, [0, 0, 0], { r: 0.09, color: C.ink });
      const V = B.show3D(P3, D, s3, cam(40)); const O = [0, 0, 0];
      const cols = [C.i, C.j, C.k];
      for (let i = 0; i < 3; i++) { const v = E[i].map((q, j) => lerp(q, Bv[i][j], m) * 2); V.v3(O, v, { color: cols[i], alpha: s3 * gin(T.std + 0.6 + 0.3 * i) }); }
      ctag(m < 0.5 ? '标准基 e₁、e₂、e₃' : '(1,1,1)ᵀ、(1,1,0)ᵀ、(1,0,0)ᵀ：也是基', DX, DY - 350, { px: 34, a: s3 * gin(T.std + 0.4), color: m < 0.5 ? C.ink : C.peri });
      ctag('基远不止一组', DX, DY + 330, { px: 34, a: s3 * gin(cue('C04', '远远不止')), color: C.peri });
    }
    const sm = a * gin(T.mat - 0.2, 0.4);
    if (sm > 0) {
      ctag('2×2 矩阵空间的基', DX, DY - 300, { px: 34, a: sm, color: C.peri });
      texAt('E', DX, DY - 150, 36, { alpha: sm * gin(T.mat + 0.6), reveal: rv(T.mat + 0.6, 1.6) });
      ctag('每个恰好一个位置是 1', DX, DY - 50, { px: 30, a: sm * gin(T.mat2), color: C.inkMid });
      texAt('Eab', DX, DY + 80, 42, { alpha: sm * gin(T.mat2 + 1.2), reveal: rv(T.mat2 + 1.2, 1.2) });
      ctag('基有很多组……什么不变？', DX, DY + 240, { px: 34, a: sm * gin(T.ds1), color: C.ds });
    }
  }

  // ── C：定理 3.4.1 → 维数 ──
  const P = new Plane({ ox: DX, oy: DY + 60, u: 80, R: 4.4 });
  const v1 = [2.2, -0.8], v2 = [-1.2, 1.9], w1 = [1.5, 0.3], w2 = [0.2, 1.4], w3 = [2.4, 2.2];
  function shotThm(D) {
    const a = B.win(T.num - 0.2, T.tab - 0.4); if (a <= 0) return;
    const s1 = a * (1 - gin(T.mn - 0.2, 0.4));
    ctag('个数不变', DX, DY - 360, { px: 40, a: a * gin(T.num) * (1 - gin(T.th1)), color: C.peri, font: F.serif });
    if (s1 > 0) {
      ctag('定理 3.4.1', DX, DY - 370, { px: 28, a: s1 * gin(T.th1), color: C.peri });
      texAt('th1', DX - 140, DY - 300, 40, { alpha: s1 * gin(T.th1 + 0.3), reveal: rv(T.th1 + 0.3, 1.0) });
      ctag('⇒ 多于 n 个必相关', DX + 230, DY - 300, { px: 32, a: s1 * gin(T.th1b), color: C.free });
      const ga = s1 * gin(T.pic, 0.5);
      if (ga > 0) {
        B.grid(P, I2, ga, D, { neu: 0, basis: false, old: 0.18, clipY: DY - 240 });
        B.vec(P, v1, ga, { color: C.i, label: 'v₁' }); B.vec(P, v2, ga, { color: C.j, label: 'v₂' });
        ctag('Span(v₁, v₂) = 平面', DX - 260, DY - 190, { px: 28, a: ga, color: C.inkMid });
        const pa = ga * gin(T.pic2);
        B.vec(P, w1, pa, { color: C.k, label: 'w₁', width: 6 }); B.vec(P, w2, pa, { color: C.k, label: 'w₂', width: 6 });
        const d = smoother(prog(B.t, T.pic3, T.pic3 + 1.5));
        // w₃ = a·w₁ + b·w₂：解 2×2
        const det = w1[0] * w2[1] - w2[0] * w1[1], ca = (w3[0] * w2[1] - w2[0] * w3[1]) / det, cb = (w1[0] * w3[1] - w3[0] * w1[1]) / det;
        B.vec(P, w3, pa, { color: C.free, label: 'w₃', width: 8 });
        if (d > 0) { const p = [w1[0] * ca, w1[1] * ca]; B.vec(P, p, ga * d * 0.7, { color: C.k, width: 4, head: 14 }); B.vec(P, [w2[0] * cb, w2[1] * cb], ga * d * 0.7, { color: C.k, width: 4, head: 14, from: p }); }
        texAt('w3', DX + 230, DY + 300, 40, { alpha: ga * gin(T.pic3 + 0.8), color: C.free });
      }
    }
    const s2 = a * gin(T.mn - 0.2, 0.4);
    if (s2 > 0) {
      ctag('两组基：n 个 和 m 个', DX, DY - 260, { px: 34, a: s2, color: C.ink });
      texAt('mn', DX, DY - 150, 56, { alpha: s2 * gin(T.mn + 1.0), reveal: rv(T.mn + 1.0, 2.0) });
      texAt('dim', DX, DY + 40, 110, { alpha: s2 * gin(T.dim, 0.5), color: C.peri });
      ctag('维数：基里向量的个数', DX, DY + 170, { px: 38, a: s2 * gin(T.dim + 0.5), color: C.ink });
    }
  }

  // ── D：维数表 + 无穷维 ──
  function shotTable() {
    const a = B.win(T.tab - 0.2, T.sub - 0.4); if (a <= 0) return;
    const s1 = a * (1 - gin(T.ds2, 0.4));
    if (s1 > 0) {
      ctag('常见维数', DX, DY - 330, { px: 34, a: s1, color: C.peri });
      [['d1', T.t1], ['d2', T.t2], ['d3', T.t3], ['d4', T.t4]].forEach(([k, t0], i) => texAt(k, DX - 330, DY - 220 + i * 120, 50, { alpha: s1 * gin(t0), reveal: rv(t0, 0.8) }, 'l'));
    }
    const s2 = a * gin(T.ds2, 0.4);
    if (s2 > 0) {
      ctag('全体多项式 P：假如是 n 维……', DX, DY - 300, { px: 36, a: s2 * gin(T.inf), color: C.ink });
      texAt('Pinf', DX, DY - 170, 60, { alpha: s2 * gin(T.inf2), reveal: rv(T.inf2, 1.4) });
      ctag('n + 1 个，线性无关', DX, DY - 70, { px: 34, a: s2 * gin(T.inf2 + 1.2), color: C.i });
      ctag('矛盾！', DX, DY + 20, { px: 44, a: s2 * gin(T.inf3), color: C.free, font: F.serif });
      ctag('P、C[a, b]：无穷维', DX, DY + 150, { px: 48, a: s2 * gin(T.inf4), color: C.peri, font: F.serif });
    }
  }

  // ── E：ℝ³ 的子空间四类 ──
  function shotSub(D) {
    const a = B.win(T.sub - 0.2, T.th3 - 0.4); if (a <= 0) return;
    const stage = B.t < T.s1 ? 0 : B.t < T.s2 ? 1 : B.t < T.s3 ? 2 : 3;
    P3.reset();
    P3.setPoint(0, [0, 0, 0], { r: 0.14 + (stage === 0 ? 0.05 * Math.sin(B.t * 6) : 0), color: stage === 0 ? C.peri : C.ink });
    if (stage >= 1) P3.setLine(0, [1, 0.6, 0.8], { color: C.i, width: 8, grow: smoother(prog(B.t, T.s1, T.s1 + 0.8)), alpha: stage === 1 ? 1 : 0.5 });
    if (stage >= 2) P3.setPlane(0, [0.3, -0.5, 1], { color: C.j, alpha: stage === 2 ? 0.36 : 0.18, scale: outCubic(prog(B.t, T.s2, T.s2 + 0.9)) });
    if (stage >= 3) { const g = smooth(prog(B.t, T.s3, T.s3 + 1.2)); P3.setPlane(1, [0.3, -0.5, 1], { color: C.k, alpha: 0.18 * g, d: 1.5 * g }); P3.setPlane(2, [0.3, -0.5, 1], { color: C.k, alpha: 0.18 * g, d: -1.5 * g }); }
    B.show3D(P3, D, a, cam(30));
    const labs = [['0 维', '原点', T.s0], ['1 维', '直线', T.s1], ['2 维', '平面', T.s2], ['3 维', 'ℝ³', T.s3]];
    labs.forEach(([d, n, t0], i) => { const x = DX - 300 + i * 200, y = DY - 340, on = i === stage;
      B.card(x, y, 170, 80, a * gin(t0), on ? C.peri : C.inkMid); ctag(d, x, y - 14, { px: 26, a: a * gin(t0), color: on ? C.peri : C.inkMid }); ctag(n, x, y + 18, { px: 28, a: a * gin(t0), color: C.ink }); });
    ctag('没有第五种', DX, DY + 330, { px: 36, a: a * gin(T.g1), color: C.gpt });
  }

  // ── F：定理 3.4.3 + 例 4 ──
  function shotTh3() {
    const a = B.win(T.th3 - 0.2, T.th4 - 0.4); if (a <= 0) return;
    ctag('定理 3.4.3', DX, DY - 360, { px: 30, a: a * gin(T.th3), color: C.peri });
    texAt('th3', DX, DY - 290, 46, { alpha: a * gin(T.th3 + 0.6), reveal: rv(T.th3 + 0.6, 1.0) });
    ctag('线性无关 ⇒ 自动张成', DX, DY - 200, { px: 34, a: a * gin(T.th3b), color: C.i });
    ctag('张成 ⇒ 自动线性无关', DX, DY - 140, { px: 34, a: a * gin(T.th3c), color: C.j });
    ctag('数量对了，查一条就够', DX, DY - 70, { px: 32, a: a * gin(T.th3d), color: OK });
    const e = a * gin(T.e4, 0.4);
    ctag('例 4：(1,2,3)ᵀ、(−2,1,0)ᵀ、(1,0,1)ᵀ', DX, DY + 30, { px: 32, a: e, color: C.peri });
    texAt('X4', DX, DY + 160, 46, { alpha: e * gin(T.e4d), reveal: rv(T.e4d, 1.0) * (B.t < T.e4v ? 0.7 : 1) });
    B.stamp(DX + 300, DY + 300, true, prog(B.t, T.e4v + 0.8, T.e4v + 1.2), a, '✓ 是基');
  }

  // ── G：定理 3.4.4 ──
  function shotTh4() {
    const a = B.win(T.th4 - 0.2, T.ds3 - 0.2); if (a <= 0) return;
    ctag('定理 3.4.4（dim V = n）', DX, DY - 300, { px: 34, a: a * gin(T.th4), color: C.peri });
    [['少于 n 个 → 张不成', T.th4a, C.free], ['无关组 → 扩充成基', T.th4b, C.i], ['张成集 → 删减成基', T.th4c, C.j]].forEach(([txt, t0, col], i) => {
      B.card(DX, DY - 150 + i * 150, 620, 110, a * gin(t0), col); ctag(txt, DX, DY - 150 + i * 150, { px: 40, a: a * gin(t0), color: col, font: F.serif });
    });
  }

  // ── H：Test B 6 对称矩阵 ──
  function shotSym() {
    const a = B.win(T.ds3 - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('Test B 第 6 题：2×2 对称矩阵 S', DX, DY - 350, { px: 34, a, color: C.peri });
    ctag('加法 ✓  数乘 ✓ → 子空间', DX, DY - 270, { px: 32, a: a * gin(T.ds4 + 1.5), color: OK });
    texAt('sym', DX, DY - 100, 40, { alpha: a * gin(T.sym), reveal: rv(T.sym, 0.6) * (B.t < T.sym2 ? 0.25 : 1) + (B.t >= T.sym2 ? 0 : 0), color: C.ink });
    // 第二块的两个 1 绑在一起
    const hb = a * gin(T.ds5, 0.4);
    ctag('两个 1 绑在一起', DX + 60, DY + 10, { px: 28, a: hb, color: C.ds });
    texAt('dimS', DX, DY + 140, 70, { alpha: a * gin(T.dimS2), color: C.peri });
    B.stamp(DX + 280, DY + 140, true, prog(B.t, T.dimS + 0.4, T.dimS + 0.8), a, '✓ 基');
    const g = a * gin(T.tj, 0.5);
    B.card(DX, DY + 290, 700, 100, g, C.gpt);
    ctag('同济：极大线性无关组 = 基；向量组的秩 = 维数', DX, DY + 290, { px: 28, a: g, color: C.gpt });
  }

  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end + 1.5), color: C.inkMid });
    ctag('换基', DX, DY - 20, { px: 96, a: a * gin(T.end + 1.8, 0.5), color: C.peri, font: F.serif });
    ctag('基一换，坐标也跟着变', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.3), color: C.ink });
  }

  const SECS = [
    { t0: T.def - 0.2, t1: T.std - 0.3, head: '基', items: [['线性无关 + 张成', T.def], ['张成：够用', T.sp, { color: C.j, mark: C.j }], ['无关：不浪费', T.ind, { color: C.i, mark: C.i }]] },
    { t0: T.std - 0.3, t1: T.num - 0.3, head: '基不止一组', items: [['标准基', T.std], ['(1,1,1)ᵀ…', T.b2], ['E₁₁、E₁₂、E₂₁、E₂₂', T.mat]] },
    { t0: T.num - 0.3, t1: T.tab - 0.3, head: '维数', items: [['个数不变', T.num, { color: C.peri }], ['定理 3.4.1', T.th1], ['m = n', T.mn2], ['dim V', T.dim, { color: C.peri }]] },
    { t0: T.tab - 0.3, t1: T.sub - 0.3, head: '常见维数', items: [['ℝⁿ：n', T.t1], ['2×2 矩阵：4', T.t2], ['Pₙ：n', T.t3], ['{0}：0', T.t4], ['P、C[a,b]：无穷维', T.inf4, { color: C.peri }]] },
    { t0: T.sub - 0.3, t1: T.th3 - 0.3, head: 'ℝ³ 的子空间', items: [['0 维：原点', T.s0], ['1 维：直线', T.s1], ['2 维：平面', T.s2], ['3 维：ℝ³', T.s3]] },
    { t0: T.th3 - 0.3, t1: T.ds3 - 0.2, head: '判断基', items: [['n 维 + n 个：查一条', T.th3d, { color: OK, mark: OK }], ['例 4：det = 2', T.e4v], ['定理 3.4.4', T.th4]] },
    { t0: T.ds3 - 0.2, t1: T.end - 0.3, head: '对称矩阵', items: [['是子空间', T.ds4 + 1.5], ['拆成三块', T.sym2], ['dim S = 3', T.dimS2, { color: C.peri }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotDef(); shotBases(D); shotThm(D); shotTable(); shotSub(D); shotTh3(); shotTh4(); shotSym(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
