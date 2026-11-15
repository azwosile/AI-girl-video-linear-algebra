// 第 3 章 复习（下）期中真题：四大套路各一道（数字全部 sympy 复核，见 math.json）。
// ① 子空间判定：21-22 第 1(3) 题（两张平面的并集 → 反例）↔ 第 8 题（x₃ = x₁ − x₂ → 张成 → dim 2），3D 画面
// ② 线性相关性：y = xC，det C = 2；变式 det = 0；17-18 多项式版
// ③ 过渡矩阵：20-21 第 5 题，(u) = (v)S，S = V⁻¹U，验算第一列；教材约定下答案为 S⁻¹
// ④ 四个基本子空间：25-26 第 4 题，N(Aᵀ) 由消元记录 5R₁ − 2R₂ + R₃ = 0 读出，点积验垂直
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_shock', 'ds_think', 'ds_ask', 'ds_proud', 'gpt_cross', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 复习', title: '期中真题', hi: 2, en: 'MIDTERM PROBLEMS',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.8, C06: 0.6, C09: 0.8, C11: 0.4, G02: 0.6, C15: 0.8, C19: 0.6, C21: 0.8, C25: 0.6, C30: 0.6 },
    post: { C05: 0.6, G01: 0.6, C08: 0.8, C13: 0.6, C14: 0.6, G02: 0.8, C20: 0.6, G03: 0.6, D04: 0.6, C24: 0.6, C27: 0.6, C29: 0.8, D05: 0.6, C33: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, a1: L('C02').s, q13: L('C03').s, uni: cue('C04', '两张平面的并集'), ce: L('C05').s, ce2: cue('C05', '相加得到'), warn: L('G01').s,
    q8: L('C06').s, q8g: L('C07').s, q8d: L('C08').s, q8d2: cue('C08', '维数是二'),
    a2: L('C09').s, y: L('C10').s, yC: L('C11').s, yc0: L('C12').s, ydet: L('C13').s, yv: L('C14').s, yrel: cue('C14', '正好等于零'), poly: L('G02').s,
    a3: L('C15').s, dets: L('C16').s, conv: L('C17').s, Sf: L('C18').s, S: L('C19').s, chk: L('C20').s, leon: L('G03').s, ds4: L('D04').s,
    a4: L('C21').s, rr: L('C22').s, rc: L('C23').s, rc2: cue('C23', '列空间'), nul: L('C24').s, nat: L('C25').s, rel: L('C26').s, rel2: cue('C26', '五倍的第一行'), y4: L('C27').s, dot: L('C28').s, orth: L('G04').s, dims: L('C29').s, ds5: L('D05').s,
    sum: L('C30').s, s1: L('C31').s, s2: L('C32').s, s3: L('C33').s, nx: L('G05').s, end: L('C34').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); [T.a1, T.a2, T.a3, T.a4].forEach(x => TL.sfx('whoosh', x, 0.32));
  TL.sfx('warp', T.uni, 0.35); TL.sfx('buzz', T.ce2 + 1.0, 0.25); TL.sfx('bell_soft', T.warn, 0.3); TL.sfx('warp', T.q8g, 0.3); TL.sfx('check', T.q8d2, 0.3);
  TL.sfx('pop', T.yC, 0.3); TL.sfx('ding_hi', T.ydet, 0.3); TL.sfx('buzz', T.yv + 0.8, 0.22); TL.sfx('pop', T.poly, 0.3);
  TL.sfx('pluck', T.dets, 0.25); TL.sfx('pop', T.conv, 0.3); TL.sfx('pop', T.S, 0.3); TL.sfx('check', T.chk + 1.5, 0.3); TL.sfx('bell_soft', T.leon, 0.3);
  TL.sfx('pluck', T.rr, 0.25); TL.sfx('pop', T.rc, 0.3); TL.sfx('pop', T.nul, 0.3); TL.sfx('warp', T.rel2, 0.3); TL.sfx('ding_hi', T.y4, 0.3); TL.sfx('check', T.dot + 1.0, 0.3); TL.sfx('shimmer', T.dims, 0.35);
  TL.sfx('pluck', T.s1, 0.25); TL.sfx('pluck', T.s2, 0.25); TL.sfx('pluck', T.s3, 0.25); TL.sfx('shimmer', L('C34').e + 0.3, 0.45);

  function gbox(key, x, y, px, cls, col, a, pad = 5) {
    if (a <= 0) return; const g = B.tex.groupBox(B.tex.place(key, x, y, px, 'c'), cls); if (!g) return;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(g.x - g.w / 2 - pad, g.y - g.h / 2 - pad, g.w + 2 * pad, g.h + 2 * pad); ctx.restore();
  }
  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const low = D => ({ x: D.x, y: D.y + 150, r: Math.max(0, D.r - 150) });

  function shotIntro() {
    const a = B.win(T.o1 + 0.5, T.a1 - 0.3); if (a <= 0) return;
    ctag('2015 – 2026 期中卷 · 第三章', DX, DY - 220, { px: 34, a: a * gin(T.o1 + 0.8), color: C.inkMid });
    [['① 子空间判定', C.i], ['② 线性相关性', C.j], ['③ 过渡矩阵', C.peri], ['④ 四个基本子空间', C.k]].forEach(([s, col], i) => {
      const x = DX + (i % 2 ? 190 : -190), y = DY - 60 + Math.floor(i / 2) * 140, g = a * gin(cue('C01', '四个套路') + 0.3 * i);
      B.card(x, y, 340, 110, g, col); ctag(s, x, y, { px: 34, a: g, color: col }); });
    ctag('一个套路，一道题', DX, DY + 260, { px: 32, a: a * gin(cue('C01', '一个套路')), color: C.ink });
  }

  // ① 子空间判定（3D）
  function shotSub(D) {
    const a = B.win(T.a1 - 0.2, T.a2 - 0.3); if (a <= 0) return;
    ctag(B.t < T.q8 - 0.2 ? '套路一 · 2021–2022 期中 · 第 1(3) 题' : '套路一 · 2021–2022 期中 · 第 8 题', DX, DY - 350, { px: 30, a, color: C.i });
    const s1 = a * (1 - gin(T.q8 - 0.2, 0.4)), s2 = a * gin(T.q8 - 0.2, 0.4);
    if (s1 > 0) {
      texAt('sub1', DX, DY - 245, 40, { alpha: s1 * gin(T.q13), reveal: rv(T.q13, 1.2) });
      const g3 = s1 * gin(T.uni - 0.3, 0.5);
      if (g3 > 0) {
        P3.reset();
        P3.setPlane(0, [1, 0, -1], { color: C.i, alpha: 0.3, scale: 0.85 * outCubic(prog(B.t, T.uni - 0.2, T.uni + 0.8)) });
        P3.setPlane(1, [0, 1, -1], { color: C.j, alpha: 0.3, scale: 0.85 * outCubic(prog(B.t, T.uni + 0.4, T.uni + 1.4)) });
        P3.setPoint(0, [0, 0, 0], { r: 0.08, color: C.ink });
        const V = B.show3D(P3, low(D), g3, { el: 22, az: 40 + 6 * Math.sin(B.t * 0.3), dist: 15, axesA: 0.6, floorA: 0.25 });
        const ga = g3 * gin(T.ce), gs = g3 * gin(T.ce2);
        V.v3([0, 0, 0], [1, 0, 1], { color: C.i, alpha: ga }); V.v3([0, 0, 0], [0, 1, 1], { color: C.j, alpha: ga });
        V.v3([0, 0, 0], [1, 1, 2], { color: C.free, alpha: gs });
        V.lab([1.2, 1.2, 2.35], '(1, 1, 2) 两张都不在', { px: 28, a: gs, color: C.free });
        texAt('sub1c', DX, DY - 140, 30, { alpha: ga, halo: C.disc });
      }
      ctag('“或” = 两张平面的并集 ⇒ 不是子空间', DX, DY + 345, { px: 30, a: s1 * gin(T.uni) * (1 - gin(T.warn - 0.2)), color: C.free });
      const w = s1 * gin(T.warn, 0.5); if (w > 0) { B.card(DX, DY + 330, 700, 80, w, C.gpt); ctag('阅卷：反例必须写具体数字', DX, DY + 330, { px: 32, a: w, color: C.gpt }); }
    }
    if (s2 > 0) {
      texAt('sub8', DX, DY - 245, 40, { alpha: s2 });
      P3.reset();
      P3.setPlane(0, [1, -1, -1], { color: C.i, alpha: 0.32, scale: 0.85 * outCubic(prog(B.t, T.q8 + 0.4, T.q8 + 1.3)) });
      P3.setPoint(0, [0, 0, 0], { r: 0.08, color: C.ink });
      const V = B.show3D(P3, low(D), s2, { el: 22, az: -25 + 6 * Math.sin(B.t * 0.3), dist: 15, axesA: 0.6, floorA: 0.25 });
      const gv = s2 * gin(cue('C07', '拆开'));
      V.v3([0, 0, 0], [1.3, 0, 1.3], { color: C.j, alpha: gv }); V.v3([0, 0, 0], [0, 1.3, -1.3], { color: C.peri, alpha: gv });
      texAt('sub8g', DX, DY - 140, 30, { alpha: s2 * gin(T.q8g), reveal: rv(T.q8g, 1.6), halo: C.disc });
      texAt('sub8d', DX, DY + 335, 32, { alpha: s2 * gin(T.q8d), color: OK, halo: C.disc });
    }
  }

  // ② 线性相关性
  function shotDep() {
    const a = B.win(T.a2 - 0.2, T.a3 - 0.3); if (a <= 0) return;
    ctag('套路二 · 2021–2022 第 7 题类型', DX, DY - 360, { px: 30, a, color: C.j });
    const s1 = a * (1 - gin(T.poly - 0.2, 0.4)), s2 = a * gin(T.poly - 0.2, 0.4);
    if (s1 > 0) {
      ctag('已知 x₁、x₂、x₃ 线性无关', DX, DY - 300, { px: 30, a: s1 * gin(T.a2 + 0.8), color: C.ink });
      texAt('y', DX, DY - 235, 38, { alpha: s1 * gin(T.y), reveal: rv(T.y, 1.4) });
      texAt('yC', DX, DY - 120, 38, { alpha: s1 * gin(T.yC), reveal: rv(T.yC, 1.0) });
      ['c1', 'c2', 'c3'].forEach((c, i) => gbox('yC', DX, DY - 120, 38, c, [C.i, C.j, C.peri][i], s1 * gin(cue('C11', '每一列') + 0.3 * i)));
      ctag('C 的每一列 = 一个 y 的系数', DX, DY - 30, { px: 28, a: s1 * gin(cue('C11', '每一列')), color: C.inkMid });
      texAt('yc0', DX, DY + 40, 36, { alpha: s1 * gin(T.yc0), reveal: rv(T.yc0, 1.2) });
      texAt('ydet', DX, DY + 115, 40, { alpha: s1 * gin(T.ydet), color: OK });
      texAt('yv', DX, DY + 220, 34, { alpha: s1 * gin(T.yv), color: C.free, reveal: rv(T.yv, 1.2) });
      texAt('yrel', DX, DY + 315, 36, { alpha: s1 * gin(T.yrel), color: C.free });
    }
    if (s2 > 0) {
      ctag('多项式版 · 2017–2018 第 3 题', DX, DY - 220, { px: 32, a: s2, color: C.gpt });
      ctag('取基 1、x、x²，写成坐标', DX, DY - 120, { px: 30, a: s2 * gin(cue('G02', '取基')), color: C.ink });
      texAt('poly', DX, DY + 20, 44, { alpha: s2 * gin(cue('G02', '写成坐标')), reveal: rv(cue('G02', '写成坐标'), 1.2) });
      ctag('det ≠ 0 ⇒ 线性无关 ✓', DX, DY + 160, { px: 34, a: s2 * gin(cue('G02', '线性无关')), color: OK });
      ctag('套路：抽象向量 → 系数矩阵 → 行列式', DX, DY + 260, { px: 30, a: s2 * gin(cue('G02', '线性无关') + 1.0), color: C.peri });
    }
  }

  // ③ 过渡矩阵
  function shotTrans() {
    const a = B.win(T.a3 - 0.2, T.a4 - 0.3); if (a <= 0) return;
    ctag('套路三 · 2020–2021 第 5 题', DX, DY - 360, { px: 30, a, color: C.peri });
    const s1 = a * (1 - gin(T.S - 0.2, 0.4)), s2 = a * gin(T.S - 0.2, 0.4);
    if (s1 > 0) {
      texAt('PVU', DX, DY - 240, 40, { alpha: s1 * gin(T.a3 + 0.8), reveal: rv(T.a3 + 0.8, 1.2) });
      ctag('（列 = 基向量）', DX, DY - 140, { px: 26, a: s1 * gin(T.a3 + 1.5), color: C.inkMid });
      texAt('dets', DX, DY - 85, 40, { alpha: s1 * gin(T.dets + 1.0), color: OK }); ctag('都 ≠ 0 ⇒ 都是基 ✓', DX, DY - 30, { px: 28, a: s1 * gin(cue('C16', '都不是零')), color: OK });
      B.card(DX, DY + 70, 720, 100, s1 * gin(T.conv), C.peri);
      ctag('本卷：同济约定', DX, DY + 40, { px: 26, a: s1 * gin(T.conv), color: C.peri });
      texAt('conv', DX, DY + 85, 36, { alpha: s1 * gin(T.conv + 0.6) });
      texAt('Sf', DX, DY + 230, 38, { alpha: s1 * gin(T.Sf), reveal: rv(T.Sf, 1.6) });
    }
    if (s2 > 0) {
      texAt('S', DX, DY - 200, 46, { alpha: s2, reveal: rv(T.S, 1.6) });
      gbox('S', DX, DY - 200, 46, 'c1', C.j, s2 * gin(T.chk), 8);
      texAt('chk', DX, DY - 20, 40, { alpha: s2 * gin(T.chk + 0.4), reveal: rv(T.chk + 0.4, 1.6), color: OK });
      const lg = s2 * gin(T.leon, 0.5); if (lg > 0) { B.card(DX, DY + 120, 720, 100, lg, C.gpt); ctag('教材约定：V 到 U 的过渡矩阵 = U⁻¹V', DX, DY + 100, { px: 28, a: lg, color: C.gpt }); ctag('= S⁻¹（方向正好相反）', DX, DY + 140, { px: 28, a: lg, color: C.gpt }); }
      ctag('先写定义式，再验一列', DX, DY + 250, { px: 36, a: s2 * gin(T.ds4), color: C.peri, font: F.serif });
    }
  }

  // ④ 四个基本子空间
  function shotFour() {
    const a = B.win(T.a4 - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('套路四 · 2025–2026 第 4 题（24 分）', DX, DY - 360, { px: 30, a, color: C.k });
    const s1 = a * (1 - gin(T.nat - 0.2, 0.4)), s2 = a * gin(T.nat - 0.2, 0.4);
    if (s1 > 0) {
      texAt('A4', DX - 200, DY - 250, 36, { alpha: s1 * gin(T.a4 + 0.8) });
      ctag('→', DX + 30, DY - 250, { px: 40, a: s1 * gin(T.rr), color: C.inkMid });
      texAt('R4', DX + 210, DY - 250, 36, { alpha: s1 * gin(T.rr) });
      ['c1', 'c3'].forEach(c => gbox('R4', DX + 210, DY - 250, 36, c, C.peri, s1 * gin(cue('C22', '主元'))));
      ['c1', 'c3'].forEach(c => gbox('A4', DX - 200, DY - 250, 36, c, C.j, s1 * gin(T.rc2)));
      texAt('rk4', DX, DY - 150, 38, { alpha: s1 * gin(T.rr + 0.8), color: C.peri });
      ctag('行空间', DX - 300, DY - 70, { px: 30, a: s1 * gin(T.rc), color: C.i }); texAt('row4', DX + 60, DY - 70, 34, { alpha: s1 * gin(T.rc), color: C.i });
      ctag('列空间', DX - 300, DY + 40, { px: 30, a: s1 * gin(T.rc2), color: C.j }); texAt('col4', DX + 60, DY + 40, 30, { alpha: s1 * gin(T.rc2), color: C.j });
      ctag('零空间', DX - 300, DY + 190, { px: 30, a: s1 * gin(T.nul), color: C.free }); texAt('N4', DX + 60, DY + 190, 30, { alpha: s1 * gin(T.nul), color: C.free });
      ctag('2 + 2 = 4 = 列数 ✓', DX, DY + 320, { px: 32, a: s1 * gin(cue('C24', '二加二')), color: OK });
    }
    if (s2 > 0) {
      ctag('第四个：N(Aᵀ)', DX, DY - 300, { px: 34, a: s2, color: C.k });
      texAt('yA', DX, DY - 230, 38, { alpha: s2 * gin(T.nat + 0.5), reveal: rv(T.nat + 0.5, 1.4) });
      ctag('消元时第三行变成了零 → 记下怎么来的', DX, DY - 140, { px: 28, a: s2 * gin(T.rel), color: C.inkMid });
      texAt('rel4', DX, DY - 75, 42, { alpha: s2 * gin(T.rel2), reveal: rv(T.rel2, 1.4) });
      texAt('y4', DX, DY + 15, 44, { alpha: s2 * gin(T.y4), color: C.k });
      ctag('N(Aᵀ) 的基', DX + 290, DY + 15, { px: 28, a: s2 * gin(T.y4 + 0.8), color: C.k });
      ctag('和两列点积：', DX, DY + 90, { px: 28, a: s2 * gin(T.dot), color: C.ink });
      texAt('dot4', DX, DY + 145, 38, { alpha: s2 * gin(T.dot + 0.6), color: OK });
      ctag('垂直不是巧合 → 第五章 正交性', DX, DY + 215, { px: 28, a: s2 * gin(T.orth), color: C.gpt });
      texAt('dims4', DX, DY + 290, 40, { alpha: s2 * gin(T.dims), color: C.peri });
      ctag('维数 2、2、2、1', DX, DY + 345, { px: 26, a: s2 * gin(T.dims + 0.5), color: C.inkMid });
    }
  }

  // 总结
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.2); if (a <= 0) return;
    ctag('第三章 总结', DX, DY - 330, { px: 40, a: a * gin(T.sum), color: C.peri, font: F.serif });
    const S = [['向量空间 · 子空间', '八条规矩 · 两条封闭 · 过原点', T.s1, C.i], ['张成 · 无关 · 基 · 维数', '够用 · 不多余 · 个数不变', T.s2, C.j], ['换基', '先写定义式，再验一列', cue('C32', '换基'), C.peri], ['四个基本子空间', '秩 + 零化度 = 列数', T.s3, C.k]];
    S.forEach(([h, b, t0, col], i) => { const y = DY - 220 + i * 120; B.card(DX, y, 740, 100, a * gin(t0), col); ctag(h, DX, y - 20, { px: 32, a: a * gin(t0), color: col }); ctag(b, DX, y + 22, { px: 26, a: a * gin(t0), color: C.ink }); });
    ctag('下一章：线性变换', DX, DY + 300, { px: 34, a: a * gin(T.nx), color: C.gpt });
  }

  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('第三章 · 完', DX, DY - 120, { px: 40, a: a * gin(T.end), color: C.inkMid });
    ctag('第四章 线性变换', DX, DY - 10, { px: 88, a: a * gin(T.end + 0.4, 0.5), color: C.peri, font: F.serif });
    ctag('LINEAR TRANSFORMATIONS', DX, DY + 80, { px: 26, a: a * gin(T.end + 0.8), color: C.inkMid });
  }

  const SECS = [
    { t0: T.a1 - 0.2, t1: T.a2 - 0.3, head: '① 子空间', items: [['“或” → 并集 → 反例', T.uni, { color: C.free, mark: C.free }], ['反例写具体数字', T.warn, { color: C.gpt, mark: C.gpt }], ['等式 → 张成 → 基', T.q8g, { color: OK, mark: OK }]] },
    { t0: T.a2 - 0.3, t1: T.a3 - 0.3, head: '② 相关性', items: [['写成 y = xC', T.yC], ['det C ≠ 0 ⇒ 无关', T.ydet, { color: OK, mark: OK }], ['det C = 0 ⇒ 相关', T.yv, { color: C.free, mark: C.free }], ['多项式：取坐标', T.poly]] },
    { t0: T.a3 - 0.3, t1: T.a4 - 0.3, head: '③ 过渡矩阵', items: [['det ≠ 0 ⇒ 是基', T.dets], ['先写定义式', T.conv, { color: C.peri }], ['S = V⁻¹U', T.Sf], ['验算一列', T.chk, { color: OK, mark: OK }]] },
    { t0: T.a4 - 0.3, t1: T.sum - 0.3, head: '④ 四个子空间', items: [['秩 2', T.rr], ['行 / 列 / 零空间', T.rc], ['N(Aᵀ)：读消元记录', T.rel, { color: C.k, mark: C.k }], ['4 = 2 + 2，3 = 2 + 1', T.dims]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotIntro(); shotSub(D); shotDep(); shotTrans(); shotFour(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
