// 第 3 章 3.2a 子空间（Leon 9th §3.2 前半）。
// 分镜：ℝ³ 过原点平面，两个向量相加 / 数乘都留在面上 → 定义（两条封闭）→ 公理继承（0x、(−1)x 落回 S）
//       → 例 2：x₁ = x₂ 的平面 → 反例 1：推离原点的平面（零向量不在）→ 反例 2：两条坐标轴（加法跑出去）
//       → {0} 与 V、Pₙ 中 p(0)=0 → 零空间 N(A)：封闭证明 → 例 9 行最简形 → 两个向量撑起 ℝ⁴ 里的「平面」。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, arrow, DX, DY, OK, I2, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_ask', 'ds_think', 'ds_happy', 'gpt_point', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.2 子空间', hi: 3, en: 'SUBSPACES',
    titleEnd: () => B.L('C01').s + 0.6,
    pre: { C04: 0.5, C08: 0.6, C11: 0.4, C14: 0.5, C17: 0.4, C19: 0.6, C22: 0.5, C26: 0.4 },
    post: { C03: 0.6, C07: 0.6, C10: 0.5, C13: 0.6, C16: 0.7, C18: 0.5, C21: 0.6, C24: 0.8, C25: 0.5 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    pl: L('C01').s, two: cue('C01', '随便取'), add: L('C02').s, str: cue('C02', '拉长'), sub: L('C03').s, subn: cue('C03', '子空间'),
    def: L('C04').s, defm: cue('C04', '对数乘'), defa: cue('C04', '对加法'), ax: L('D02').s, inh: L('C05').s, zn: L('C06').s, zn2: cue('C06', '负一乘'), two2: cue('C07', '检查两条'),
    ex2: L('C08').s, ex2a: L('C09').s, ex2b: cue('C09', '乘上'), ex2ok: cue('C09', '两条都通过'), ex2g: L('C10').s,
    off: L('C11').s, off2: L('C12').s, off3: cue('C12', '零向量'), orig: L('C13').s, tip: L('G01').s,
    axs: L('C14').s, axs2: L('C15').s, axs3: L('C16').s, axs4: cue('C16', '乘积是一'), nec: L('D04').s,
    triv: L('C17').s, pn: L('C18').s, pn2: cue('C18', '常数项'),
    na: L('C19').s, na2: L('C20').s, npf: L('C21').s, npf2: cue('C21', 'A乘阿尔法'), e9: L('C22').s, e9r: cue('C22', '行最简形'), piv: L('C23').s, fr: cue('C23', '自由变量'),
    sol: L('C24').s, pl4: L('C25').s, tj: L('G02').s, ds5: L('D05').s, end: L('C26').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', T.pl, 0.3); TL.sfx('pop', T.two, 0.3); TL.sfx('pop', T.add + 0.6, 0.3); TL.sfx('warp', T.str, 0.3); TL.sfx('ding_hi', T.subn, 0.3);
  TL.sfx('whoosh', T.def, 0.3); TL.sfx('pluck', T.defm, 0.25); TL.sfx('pluck', T.defa, 0.25); TL.sfx('check', T.two2, 0.35);
  TL.sfx('whoosh', T.ex2, 0.3); TL.sfx('check', T.ex2ok, 0.35); TL.sfx('warp', T.off, 0.3); TL.sfx('buzz', T.off3, 0.25); TL.sfx('bell_soft', T.tip, 0.3);
  TL.sfx('whoosh', T.axs, 0.3); TL.sfx('buzz', T.axs4, 0.25); TL.sfx('pop', T.triv, 0.3); TL.sfx('pop', T.pn, 0.3);
  TL.sfx('whoosh', T.na, 0.3); TL.sfx('check', T.npf2 + 1.5, 0.3); TL.sfx('pluck', T.e9r, 0.25); TL.sfx('pop', T.fr, 0.3); TL.sfx('ding_hi', T.sol + 0.8, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', L('C26').e + 0.3, 0.4);

  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const az = t => -52 + 6 * Math.sin(t * 0.25);

  // ── A：过原点的平面（ℝ³）──
  const n0 = [1, 2, -2], u = [2, 0, 1], w = [0, 1, 1]; // n·u = 0, n·w = 0
  function shotPlane(D) {
    const a = B.win(T.pl - 0.2, T.def - 0.4); if (a <= 0) return;
    P3.reset();
    P3.setPlane(0, n0, { color: C.i, alpha: 0.34, scale: outCubic(prog(B.t, T.pl, T.pl + 1.0)), tilt: smoother(prog(B.t, T.pl + 0.3, T.pl + 1.3)) });
    P3.setPoint(0, [0, 0, 0], { r: 0.09, color: C.ink });
    const V = B.show3D(P3, D, a, { el: 22, az: az(B.t), dist: 12.5, axesA: 0.8, floorA: 0.6 });
    const g = smoother(prog(B.t, T.add + 0.3, T.add + 1.2));
    const k = B.t < T.str ? 1 : lerp(1, -1.5, smoother(prog(B.t, T.str, T.str + 1.2)));
    const O = [0, 0, 0];
    if (B.t < T.str + 0.1) {
      V.v3(O, u, { color: C.j, alpha: a * gin(T.two) }); V.v3(O, w, { color: C.k, alpha: a * gin(T.two + 0.4) });
      V.v3(O, [u[0] + w[0] * g, u[1] + w[1] * g, u[2] + w[2] * g], { color: C.peri, alpha: a * gin(T.add + 0.3) });
      V.lab([u[0] + w[0], u[1] + w[1], u[2] + w[2] + 0.4], 'x + y', { px: 32, a: a * gin(T.add + 1.1), color: C.peri, font: F.serif });
    } else {
      V.v3(O, w, { color: C.k, alpha: a * 0.5 });
      V.v3(O, u.map(q => q * k), { color: C.free, alpha: a, width: 9 });
      V.lab(u.map(q => q * k * 1.12), `${k.toFixed(1).replace('-', '−')} x`, { px: 32, a, color: C.free, font: F.serif });
    }
    ctag('加法、数乘都跑不出这张平面', DX, DY + 330, { px: 36, a: a * gin(T.sub), color: C.ink });
    ctag('子空间', DX, DY - 360, { px: 52, a: a * gin(T.subn, 0.5), color: C.peri, font: F.serif });
  }

  // ── B：定义 + 公理继承 ──
  function shotDef() {
    const a = B.win(T.def - 0.2, T.ex2 - 0.4); if (a <= 0) return;
    ctag('子空间的定义', DX, DY - 360, { px: 34, a: a * gin(T.def), color: C.peri });
    texAt('def', DX, DY - 280, 50, { alpha: a * gin(T.def + 0.3), reveal: rv(T.def + 0.3, 0.8) });
    texAt('clo1', DX - 300, DY - 180, 44, { alpha: a * gin(T.defm), reveal: rv(T.defm, 0.8), color: C.j }, 'l');
    texAt('clo2', DX - 300, DY - 100, 44, { alpha: a * gin(T.defa), reveal: rv(T.defa, 0.9), color: C.i }, 'l');
    // 八条公理的小格子：大部分继承（灰勾），A3/A4 由定理落回 S
    const g = a * gin(T.inh, 0.5);
    if (g > 0) {
      for (let i = 0; i < 8; i++) {
        const x = DX - 315 + i * 90, y = DY + 40, special = i === 2 || i === 3;
        const lit = special ? gin(i === 2 ? T.zn + 0.6 : T.zn2) : gin(T.inh + 0.6 + 0.12 * i);
        B.card(x, y, 76, 76, g, special ? C.peri : C.inkMid);
        ctag('A' + (i + 1), x, y - 8, { px: 28, a: g, color: special ? C.peri : C.ink });
        ctag('✓', x, y + 26, { px: 24, a: g * lit, color: special ? C.peri : OK });
      }
      ctag('交换、结合、分配：大空间里成立，小集合里照样成立', DX, DY + 120, { px: 28, a: g * gin(T.inh + 0.8), color: C.inkMid });
    }
    texAt('inh0', DX - 180, DY + 210, 42, { alpha: a * gin(T.zn + 0.4), reveal: rv(T.zn + 0.4, 0.8), color: C.peri });
    texAt('inh1', DX + 180, DY + 210, 42, { alpha: a * gin(T.zn2), reveal: rv(T.zn2, 0.8), color: C.peri });
    B.card(DX, DY + 320, 560, 70, a * gin(T.two2, 0.5), OK);
    ctag('判定子空间：只查两条封闭', DX, DY + 320, { px: 34, a: a * gin(T.two2, 0.5), color: OK });
  }

  // ── C：例 2（x₁ = x₂）──
  function shotEx2(D) {
    const a = B.win(T.ex2 - 0.2, T.off - 0.3); if (a <= 0) return;
    const sa = a * (1 - gin(T.ex2g - 0.1, 0.5));
    ctag('例 2：ℝ³ 中 x₁ = x₂ 的向量', DX, DY - 360, { px: 34, a, color: C.peri });
    if (sa > 0) {
      texAt('ex2S', DX, DY - 220, 50, { alpha: sa * gin(T.ex2 + 0.6), reveal: rv(T.ex2 + 0.6, 0.9) });
      texAt('ex2add', DX, DY - 30, 46, { alpha: sa * gin(T.ex2a), reveal: rv(T.ex2a, 1.2) });
      texAt('ex2sc', DX, DY + 160, 46, { alpha: sa * gin(T.ex2b), reveal: rv(T.ex2b, 1.0) });
      ctag('前两个分量仍相等 ✓', DX, DY + 300, { px: 34, a: sa * gin(T.ex2ok), color: OK });
    }
    const ga = a * gin(T.ex2g - 0.1, 0.5);
    if (ga > 0) {
      P3.reset(); P3.setPlane(0, [1, -1, 0], { color: C.j, alpha: 0.36, scale: outCubic(prog(B.t, T.ex2g, T.ex2g + 0.9)) }); P3.setPoint(0, [0, 0, 0], { r: 0.1, color: C.ink });
      P3.setLine(0, [1, 1, 0], { color: C.i, width: 5, alpha: 0.7 }); P3.setLine(1, [0, 0, 1], { color: C.k, width: 5, alpha: 0.7 });
      B.show3D(P3, D, ga, { el: 22, az: az(B.t) + 30, dist: 12.5, axesA: 0.8, floorA: 0.6 });
      ctag('过原点的平面 x₁ = x₂', DX, DY + 330, { px: 34, a: ga, color: C.j });
    }
  }

  // ── D：推离原点的平面 ──
  function shotOff(D) {
    const a = B.win(T.off - 0.2, T.axs - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.off + 0.3, T.off + 1.5));
    P3.reset(); P3.setPlane(0, [1, 1, 1], { color: C.free, alpha: 0.34, d: s * 1.6 }); P3.setPlane(1, [1, 1, 1], { color: C.inkMid, alpha: 0.12 * s });
    const p0 = 0.1 + 0.06 * Math.sin(B.t * 5) * gin(T.off3);
    P3.setPoint(0, [0, 0, 0], { r: p0, color: B.t > T.off3 ? C.free : C.ink });
    const V = B.show3D(P3, D, a, { el: 24, az: az(B.t) + 38, dist: 12.5, axesA: 0.8, floorA: 0.6 });
    ctag('x₁ + x₂ + x₃ = 1', DX, DY - 360, { px: 38, a: a * gin(T.off), color: C.free, font: F.serif });
    const ta = a * gin(T.off2);
    if (ta > 0) { B.card(DX + 210, DY - 190, 400, 190, ta, C.free); texAt('offadd', DX + 210, DY - 210, 32, { alpha: ta, reveal: rv(T.off2, 1.0) }); texAt('offsum', DX + 210, DY - 125, 32, { alpha: ta * gin(T.off2 + 1.2), color: C.free }); }
    if (B.t > T.off3) V.lab([0.3, 0.3, -0.7], '0 不在面上', { px: 32, a: a * gin(T.off3), color: C.free });
    B.card(DX, DY + 320, 600, 70, a * gin(T.orig, 0.5), C.peri);
    ctag('子空间一定经过原点', DX, DY + 320, { px: 36, a: a * gin(T.orig, 0.5), color: C.peri });
  }

  // ── E：两条坐标轴 ──
  const P = new Plane({ ox: DX, oy: DY + 40, u: 110, R: 3.4 });
  function shotAxes(D) {
    const a = B.win(T.axs - 0.2, T.triv - 0.3); if (a <= 0) return;
    B.grid(P, I2, a, D, { neu: 0, basis: false, old: 0.18 });
    ctag('ℝ² 中 x₁x₂ = 0 的点', DX, DY - 360, { px: 34, a, color: C.peri });
    const ax = a * gin(T.axs2, 0.6), L1 = P.S([-3.6, 0]), L2 = P.S([3.6, 0]), L3 = P.S([0, -3.6]), L4 = P.S([0, 3.6]);
    B.line2(L1, L2, C.i, ax, 9); B.line2(L3, L4, C.i, ax, 9);
    ctag('= 两条坐标轴', DX + 230, DY - 280, { px: 32, a: ax, color: C.i });
    B.vec(P, [1, 0], a * gin(T.axs3), { color: C.j, label: '(1, 0)', lx: 4, ly: 40, px: 30 });
    B.vec(P, [0, 1], a * gin(T.axs3 + 0.4), { color: C.j, label: '(0, 1)', lx: 14, ly: -6, px: 30 });
    const g = smoother(prog(B.t, T.axs3 + 1.2, T.axs3 + 2.2));
    B.vec(P, [1, 1], a * gin(T.axs3 + 1.2), { color: C.free, width: 9, grow: g, label: g > 0.9 ? '(1, 1)' : null, px: 32 });
    texAt('axprod', DX - 220, DY + 230, 40, { alpha: a * gin(T.axs4), color: C.free });
    B.stamp(DX + 220, DY + 230, false, prog(B.t, T.axs4 + 0.6, T.axs4 + 1.0), a, '✗ 不封闭');
    ctag('过原点：必要，不充分', DX, DY + 340, { px: 32, a: a * gin(T.nec), color: C.peri });
  }

  // ── F：{0}、V、Pₙ 中 p(0)=0 ──
  function shotTriv() {
    const a = B.win(T.triv - 0.2, T.na - 0.3); if (a <= 0) return;
    const s1 = a * (1 - gin(T.pn - 0.2, 0.4));
    if (s1 > 0) {
      ctag('每个向量空间至少有两个子空间', DX, DY - 300, { px: 34, a: s1 * gin(T.triv), color: C.peri });
      B.card(DX - 190, DY, 300, 220, s1 * gin(T.triv + 0.6), C.inkMid); ctag('{0}', DX - 190, DY - 20, { px: 70, a: s1 * gin(T.triv + 0.6), color: C.ink, font: F.serif }); ctag('只有零向量', DX - 190, DY + 60, { px: 28, a: s1 * gin(T.triv + 0.6), color: C.inkMid });
      B.card(DX + 190, DY, 300, 220, s1 * gin(T.triv + 1.4), C.peri); ctag('V', DX + 190, DY - 20, { px: 70, a: s1 * gin(T.triv + 1.4), color: C.peri, font: F.serif }); ctag('它自己', DX + 190, DY + 60, { px: 28, a: s1 * gin(T.triv + 1.4), color: C.inkMid });
    }
    const s2 = a * gin(T.pn - 0.2, 0.4);
    if (s2 > 0) {
      ctag('不在 ℝⁿ 里的子空间：Pₙ 中 p(0) = 0', DX, DY - 300, { px: 34, a: s2, color: C.peri });
      texAt('p0', DX, DY - 120, 50, { alpha: s2 * gin(T.pn + 0.6), reveal: rv(T.pn + 0.6, 0.8) });
      ctag('常数项 = 0', DX, DY - 40, { px: 30, a: s2 * gin(T.pn2), color: C.inkMid });
      texAt('p0b', DX, DY + 70, 46, { alpha: s2 * gin(T.pn2 + 0.6), reveal: rv(T.pn2 + 0.6, 1.0), color: OK });
      ctag('两条封闭 ✓ → 子空间', DX, DY + 200, { px: 34, a: s2 * gin(T.pn2 + 1.6), color: OK });
    }
  }

  // ── G：零空间 ──
  function shotNull() {
    const a = B.win(T.na - 0.2, T.end - 0.3); if (a <= 0) return;
    const s1 = a * (1 - gin(T.e9 - 0.2, 0.4));
    if (s1 > 0) {
      ctag('零空间', DX, DY - 360, { px: 50, a: s1 * gin(T.na), color: C.peri, font: F.serif });
      texAt('NA', DX, DY - 240, 50, { alpha: s1 * gin(T.na2), reveal: rv(T.na2, 1.0) });
      ctag('Ax = 0 的全部解', DX, DY - 160, { px: 32, a: s1 * gin(T.na2 + 0.8), color: C.inkMid });
      texAt('Npf1', DX, DY - 30, 42, { alpha: s1 * gin(T.npf), reveal: rv(T.npf + 0.5, 1.2) });
      texAt('Npf2', DX, DY + 70, 42, { alpha: s1 * gin(T.npf2), reveal: rv(T.npf2, 1.0) });
      ctag('两条封闭 ✓', DX, DY + 190, { px: 36, a: s1 * gin(T.npf2 + 1.5), color: OK });
    }
    const s2 = a * gin(T.e9 - 0.2, 0.4);
    if (s2 > 0) {
      ctag('例 9', DX, DY - 360, { px: 34, a: s2, color: C.peri });
      texAt('A9', DX - 200, DY - 270, 40, { alpha: s2 * gin(T.e9 + 0.3), reveal: rv(T.e9 + 0.3, 0.9) });
      ctag('→', DX + 30, DY - 270, { px: 40, a: s2 * gin(T.e9r), color: C.inkMid });
      texAt('R9', DX + 220, DY - 270, 40, { alpha: s2 * gin(T.e9r), reveal: rv(T.e9r, 1.0) });
      const pa = s2 * gin(T.piv, 0.4);
      ctag('主元列：1、2', DX + 150, DY - 190, { px: 28, a: pa, color: C.i });
      ctag('自由列：3、4', DX + 340, DY - 190, { px: 28, a: s2 * gin(T.fr), color: C.free });
      texAt('free9', DX, DY - 110, 40, { alpha: s2 * gin(T.fr + 0.4), color: C.free });
      texAt('rel9', DX, DY - 40, 40, { alpha: s2 * gin(T.fr + 1.2), reveal: rv(T.fr + 1.2, 1.0) });
      texAt('sol9', DX, DY + 120, 48, { alpha: s2 * gin(T.sol), reveal: rv(T.sol, 1.4), color: C.ink });
      B.card(DX, DY + 300, 640, 76, s2 * gin(T.pl4, 0.5), C.j);
      ctag('ℝ⁴ 里过原点的“平面”', DX, DY + 300, { px: 34, a: s2 * gin(T.pl4, 0.5), color: C.j });
    }
  }

  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('张成', DX, DY - 20, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('用几个向量撑起一个空间', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.pl, t1: T.def - 0.3, head: '平面里的平面', items: [['过原点的平面', T.pl], ['相加 → 还在面上', T.add + 0.6], ['数乘 → 还在面上', T.str], ['→ 子空间', T.subn, { color: C.peri }]] },
    { t0: T.def - 0.3, t1: T.ex2 - 0.3, head: '定义', items: [['非空子集 S', T.def + 0.3], ['(i) 对数乘封闭', T.defm, { color: C.j, mark: C.j }], ['(ii) 对加法封闭', T.defa, { color: C.i, mark: C.i }], ['其余公理自动继承', T.inh], ['只查两条', T.two2, { color: OK, mark: OK }]] },
    { t0: T.ex2 - 0.3, t1: T.off - 0.3, head: '例 2', items: [['x₁ = x₂', T.ex2], ['加法 ✓', T.ex2a + 1, { color: OK, mark: OK }], ['数乘 ✓', T.ex2b + 0.8, { color: OK, mark: OK }], ['= 过原点的平面', T.ex2g]] },
    { t0: T.off - 0.3, t1: T.axs - 0.3, head: '不过原点', items: [['x₁ + x₂ + x₃ = 1', T.off], ['和变成 2，跑出去', T.off2 + 1, { color: C.free, mark: C.free }], ['0 不在里面', T.off3, { color: C.free, mark: C.free }], ['先看零向量', T.tip, { color: C.gpt, mark: C.gpt }]] },
    { t0: T.axs - 0.3, t1: T.triv - 0.3, head: '过原点也不够', items: [['x₁x₂ = 0：两条轴', T.axs2], ['(1,0) + (0,1) = (1,1)', T.axs3 + 1.2], ['加法不封闭', T.axs4, { color: C.free, mark: C.free }]] },
    { t0: T.triv - 0.3, t1: T.na - 0.3, head: '更多子空间', items: [['{0} 和 V', T.triv], ['Pₙ 中 p(0) = 0', T.pn]] },
    { t0: T.na - 0.3, t1: T.end - 0.3, head: '零空间 N(A)', items: [['Ax = 0 的全部解', T.na2], ['封闭：线性运算', T.npf], ['例 9：行最简形', T.e9r], ['x₃、x₄ 自由', T.fr, { color: C.free, mark: C.free }], ['两个向量撑起来', T.pl4, { color: C.j, mark: C.j }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotPlane(D); shotDef(); shotEx2(D); shotOff(D); shotAxes(D); shotTriv(); shotNull(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
