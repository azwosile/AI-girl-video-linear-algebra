// 第 6 章 6.3（上）对角化（Leon 9th §6.3：定理 6.3.1、6.3.2，例 1–4）。
// 分镜：拆到特征向量上 → 定理 6.3.1（证明思路）→ 定义 X⁻¹AX = D → 定理 6.3.2 + AX = XD 逐列对照 → 一一对应
//       → 例 1 → 3B1B 基变换：标准网格 → 特征基网格 → 只沿两轴伸缩（×1、×−4）→ A^k = XD^kX⁻¹，A⁵ → 例 2 二重根仍可 → 例 3 剪切只有一条特征线
//       → 例 4 代数 / 几何重数柱 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.3 对角化', hi: 3, en: 'DIAGONALIZATION',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C05: 0.4, C06: 0.4, C08: 0.6, C09: 0.4, C10: 0.6, C12: 0.6, C13: 0.6, C15: 0.6, C16: 0.4, G01: 0.6, C18: 0.6 },
    post: { C01: 0.6, C03: 0.8, C05: 0.6, C06: 1.0, C07: 0.6, C08: 0.8, C09: 2.0, C10: 0.8, C11: 1.0, C12: 0.8, C14: 1.6, C15: 0.8, C16: 0.8, G02: 0.6, C18: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, o2: cue('C01', '对角化'), th1: L('C02').s, th1b: cue('C02', '属于不同特征值'), pf: L('C03').s, pf2: cue('C03', '左乘A'), pf3: cue('C03', '矛盾'),
    def: L('C04').s, def2: cue('C04', '使X逆乘A乘X'), th2: L('C05').s, th2b: cue('C05', '等价于'), why: L('C06').s, why2: cue('C06', 'A X的第j列'), why3: cue('C06', '所以A X等于X D'),
    d1: L('D01').s, ord: L('C07').s, ord2: cue('C07', '顺序可以换'),
    e1: L('C08').s, e1b: cue('C08', '把它们排成X'), cb: L('C09').s, cb2: cue('C09', '在特征基里看'), cb3: cue('C09', 'D就是'),
    pw: L('C10').s, pw2: cue('C10', '于是A的k次方'), pw3: cue('C10', '对角矩阵的k次方'), a5: L('C11').s, a5b: cue('C11', '结果第一行'), a5c: cue('C11', '不用连乘'),
    e2: L('C12').s, e2b: cue('C12', '但特征空间是二维的'), e2c: cue('C12', '三个无关'), d2: L('D02').s, e3: L('C13').s, e3b: cue('C13', '可是特征向量'), sh: L('C14').s, sh2: cue('C14', '只有x轴上'), sh3: cue('C14', '叫亏损矩阵'),
    e4: L('C15').s, e4b: cue('C15', 'A属于二的特征空间'), e4c: cue('C15', 'A亏损'), mu: L('C16').s, mu2: cue('C16', '特征空间的维数'), mu3: cue('C16', '几何重数不超过'), d3: L('D03').s, ok: L('C17').s,
    tj: L('G01').s, tj2: L('G02').s, tj2b: cue('G02', '标准步骤'), sum: L('C18').s, end: L('C19').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.o2, 0.3); TL.sfx('sting', T.th1b, 0.3); TL.sfx('pop', T.pf2, 0.3); TL.sfx('buzz', T.pf3, 0.2);
  TL.sfx('pop', T.def2, 0.3); TL.sfx('shimmer', T.th2b, 0.3); TL.sfx('pop', T.why2, 0.3); TL.sfx('ding_hi', T.why3, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.ord, 0.3);
  TL.sfx('pop', T.e1, 0.3); TL.sfx('pop', T.e1b, 0.3); TL.sfx('warp', T.cb + 0.4, 0.35); TL.sfx('warp', T.cb2 + 0.3, 0.35); TL.sfx('ding', T.cb3, 0.3);
  TL.sfx('pop', T.pw2, 0.3); TL.sfx('tick', T.pw3, 0.25); TL.sfx('pop', T.a5, 0.3); TL.sfx('ding_hi', T.a5b, 0.32); TL.sfx('pop', T.e2, 0.3); TL.sfx('check', T.e2c, 0.3);
  TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.e3, 0.3); TL.sfx('warp', T.sh + 0.3, 0.35); TL.sfx('stamp', T.sh3, 0.3); TL.sfx('pop', T.e4, 0.3); TL.sfx('pop', T.e4b, 0.3); TL.sfx('pop', T.mu, 0.3); TL.sfx('ding_hi', T.mu3, 0.3); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2b, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C19').e + 0.3, 0.4);

  // ── A：定理 6.3.1 + 定义 + 定理 6.3.2 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.e1 - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.def - 0.2));
    ctag('拆到特征向量上', DX, DY - 300, { px: 40, a: g0 * gin(T.o + 0.5), color: C.inkMid });
    ctag('↓ 写成矩阵的语言', DX, DY - 220, { px: 30, a: g0 * gin(T.o2 - 0.5), color: C.inkMid });
    B.card(DX, DY - 90, 820, 90, g0 * gin(T.th1b), C.peri); texAt('thm1', DX, DY - 90, 34, { alpha: g0 * gin(T.th1b) });
    texAt('pf', DX, DY + 50, 28, { alpha: g0 * gin(T.pf2), reveal: rv(T.pf2, 3.0) });
    ctag('更短的相关组合 → 矛盾', DX, DY + 140, { px: 30, a: g0 * gin(T.pf3), color: C.free });
    const g1 = a * gin(T.def - 0.2); if (g1 <= 0) return;
    B.card(DX, DY - 360, 420, 86, g1 * gin(T.def2), C.peri); texAt('def', DX, DY - 360, 42, { alpha: g1 * gin(T.def2) });
    texAt('thm2', DX, DY - 260, 30, { alpha: a * gin(T.th2b) });
    texAt('axxd', DX, DY - 100, 30, { alpha: a * gin(T.why), reveal: rv(T.why2, 5.0) });
    // 一一对应：三组彩色列
    const go = a * gin(T.d1); if (go <= 0) return;
    const cols = [C.i, C.j, C.k];
    for (let j = 0; j < 3; j++) {
      const x = DX - 200 + j * 200; B.card(x, DY + 120, 140, 70, go, cols[j]); ctag(`x${'₁₂₃'[j]}`, x, DY + 120, { px: 34, a: go, color: cols[j], font: F.serif });
      B.card(x, DY + 250, 140, 70, go, cols[j]); ctag(`λ${'₁₂₃'[j]}`, x, DY + 250, { px: 34, a: go, color: cols[j], font: F.serif });
      B.line2([x, DY + 158], [x, DY + 212], cols[j], go * gin(T.ord), 3);
    }
    ctag('X 的第 j 列 ↔ D 的第 j 个对角元', DX, DY + 340, { px: 28, a: go * gin(T.ord), color: C.ink });
    ctag('顺序可换 · 倍数可变 · 必须对应', DX, DY + 400, { px: 26, a: go * gin(T.ord2), color: C.inkMid });
  }

  // ── B：例 1 + 基变换 ──
  const A1 = [[2, -3], [2, -5]], X = [[3, 1], [1, 2]], XD = [[3, -4], [1, -8]];
  const P = new Plane({ ox: DX + 80, oy: DY + 40, u: 34, R: 14 });
  function shotB(D) {
    const a = B.win(T.e1 - 0.2, T.e2 - 0.3); if (a <= 0) return;
    B.card(DX, DY - 390, 820, 100, a * gin(T.e1b), C.inkMid); texAt('e1', DX, DY - 390, 30, { alpha: a * gin(T.e1b) });
    const gp = a * gin(T.cb - 0.2) * (1 - gin(T.pw - 0.2)); if (gp > 0) {
      const s1 = smoother(prog(B.t, T.cb + 0.4, T.cb + 2.2)), s2 = smoother(prog(B.t, T.cb2 + 0.3, T.cb2 + 2.6));
      const Mfrom = lerpM(I2, X, s1);
      const Ms = B.warp(P, s2 > 0 ? XD : X, s2 > 0 ? s2 : s1, gp, D, { from: s2 > 0 ? X : I2, basis: false, neu: 0.45, clipY: DY - 320 });
      const O = P.S([0, 0]);
      arrow(ctx, O, P.S([1, 0], Ms), { color: C.i, width: 8, head: 22, alpha: gp }); arrow(ctx, O, P.S([0, 1], Ms), { color: C.j, width: 8, head: 22, alpha: gp });
      ctag(s1 > 0.5 ? 'x₁ = (3, 1)' : 'e₁', ...P.S([1.25, 0.35], Ms), { px: 26, a: gp, color: C.i, font: F.serif });
      ctag(s1 > 0.5 ? 'x₂ = (1, 2)' : 'e₂', ...P.S([0.55, 1.3], Ms), { px: 26, a: gp, color: C.j, font: F.serif });
      ctag('X：标准基 → 特征基', DX, DY - 280, { px: 30, a: gp * gin(T.cb + 0.4) * (1 - gin(T.cb2)), color: C.ink });
      ctag('A 在特征基里：×1 与 ×(−4)', DX, DY - 280, { px: 30, a: gp * gin(T.cb2), color: C.peri });
      texAt('def', DX - 300, DY + 380, 34, { alpha: gp * gin(T.cb3) });
    }
    const gw = a * gin(T.pw - 0.2); if (gw <= 0) return;
    ctag('A = XDX⁻¹', DX, DY - 270, { px: 40, a: gw, color: C.peri, font: F.serif });
    ctag('Aᵏ = (XDX⁻¹)(XDX⁻¹)···(XDX⁻¹)', DX, DY - 190, { px: 32, a: gw * gin(T.pw2), color: C.ink, font: F.serif });
    ctag('X⁻¹X = I 全部抵消', DX, DY - 130, { px: 28, a: gw * gin(T.pw2 + 2.0), color: OK });
    B.card(DX, DY - 30, 620, 110, gw * gin(T.pw2 + 2.5), C.peri); texAt('pow', DX, DY - 30, 34, { alpha: gw * gin(T.pw2 + 2.5) });
    texAt('a5', DX, DY + 140, 32, { alpha: a * gin(T.a5), reveal: rv(T.a5, 4.0) });
    ctag('不用连乘五次', DX, DY + 260, { px: 32, a: a * gin(T.a5c), color: C.ds, font: F.serif });
  }

  // ── C：例 2、例 3 剪切 ──
  const PS = new Plane({ ox: DX, oy: DY + 140, u: 70, R: 8 });
  function shotC(D) {
    const a = B.win(T.e2 - 0.2, T.e4 - 0.3); if (a <= 0) return;
    const g2 = a * (1 - gin(T.d2 - 0.2));
    ctag('例 2：λ = 0，1，1', DX, DY - 300, { px: 40, a: g2, color: C.ink, font: F.serif });
    texAt('e2', DX, DY - 170, 34, { alpha: g2 * gin(T.e2b) });
    ctag('二重根，特征空间二维 → 3 个无关', DX, DY - 60, { px: 30, a: g2 * gin(T.e2c), color: OK });
    B.stamp(DX, DY + 80, true, prog(B.t, T.e2c + 0.5, T.e2c + 0.9), g2, '可对角化');
    const g3 = a * gin(T.e3 - 0.2); if (g3 <= 0) return;
    texAt('e3', DX, DY - 390, 30, { alpha: g3, reveal: rv(T.e3, 3.0) });
    const s = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(2, Math.max(0, (B.t - T.sh - 0.3) / 2.6)));
    B.eigFan(PS, [[1, 1], [0, 1]], s, g3 * gin(T.e3b), D, { fan: 16, r: 1.6, eig: [{ d: [1, 0], col: C.i, label: '唯一方向' }], neu: 0.45, clipY: DY - 320 });
    ctag('只有 x 轴留在原线上', DX, DY - 280, { px: 30, a: g3 * gin(T.sh2), color: C.i });
    B.stamp(DX + 320, DY + 330, false, prog(B.t, T.sh3, T.sh3 + 0.4), g3, '亏损');
  }

  // ── D：例 4 + 代数 / 几何重数 ──
  function shotD() {
    const a = B.win(T.e4 - 0.2, T.tj - 0.3); if (a <= 0) return;
    texAt('e4', DX, DY - 370, 32, { alpha: a * gin(T.e4) });
    texAt('e4e', DX, DY - 270, 34, { alpha: a * gin(T.e4 + 1.5) });
    const gb = a * gin(T.e4b); if (gb <= 0) return;
    // 柱：λ = 2 的代数重数 2 / 几何重数（A：1，B：2）
    const bar = (cx, alg, geo, name, okk) => {
      const by = DY + 140, hu = 90;
      ctag(name, cx, DY - 180, { px: 40, a: gb, color: okk ? OK : C.free, font: F.serif });
      ctx.save(); ctx.globalAlpha = gb * 0.85; ctx.fillStyle = C.peri; ctx.fillRect(cx - 110, by - alg * hu, 90, alg * hu); ctx.fillStyle = okk ? OK : C.free; ctx.fillRect(cx + 20, by - geo * hu * gin(T.e4b + 0.8, 0.8), 90, geo * hu * gin(T.e4b + 0.8, 0.8)); ctx.restore();
      ctag('代数 ' + alg, cx - 65, by + 30, { px: 24, a: gb, color: C.peri }); ctag('几何 ' + geo, cx + 65, by + 30, { px: 24, a: gb, color: okk ? OK : C.free });
      B.line2([cx - 140, by], [cx + 140, by], C.ink, gb * 0.6, 2);
    };
    ctag('λ = 2', DX, DY - 120, { px: 30, a: gb, color: C.inkMid, font: F.serif });
    bar(DX - 220, 2, 1, 'A', false); bar(DX + 220, 2, 2, 'B', true);
    B.stamp(DX - 220, DY + 240, false, prog(B.t, T.e4c, T.e4c + 0.4), gb, '亏损'); B.stamp(DX + 220, DY + 240, true, prog(B.t, T.e4c + 0.8, T.e4c + 1.2), gb, '可对角化');
    const gm = a * gin(T.mu3); B.card(DX, DY + 360, 640, 80, gm, C.peri); texAt('mult', DX, DY + 360, 36, { alpha: gm });
    ctag('互不相同 ⇒ 一定可以', DX - 200, DY + 430, { px: 26, a: a * gin(T.d3), color: C.ds }); ctag('有重根 ⇒ 看几何重数', DX + 200, DY + 430, { px: 26, a: a * gin(T.d3 + 1.8), color: C.ds });
  }

  // ── E：同济 + 小结 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章第三节 相似矩阵', DX, DY - 330, { px: 34, a: g1, color: C.gpt });
    ctag('A 与对角阵相似 ⇔ n 个无关特征向量', DX, DY - 240, { px: 32, a: g1 * gin(T.tj + 1.0), color: C.ink });
    B.card(DX, DY - 150, 400, 90, g1 * gin(cue('G01', '同济把X记作P')), C.gpt); texAt('tj', DX, DY - 150, 40, { alpha: g1 * gin(cue('G01', '同济把X记作P')) });
    const st = ['① 求特征值', '② 逐个求基础解系', '③ 数够 n 个', '④ 排成 P，得 Λ'];
    st.forEach((s, i) => { const gi = g1 * gin(T.tj2b + i * 1.2); ctag(s, DX - 200 + (i % 2) * 400, DY + 10 + Math.floor(i / 2) * 80, { px: 32, a: gi, color: C.gpt, font: F.serif }); });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    ctag('可对角化 ⇔ n 个无关特征向量', DX, DY - 230, { px: 38, a: g2, color: C.peri, font: F.serif });
    texAt('pow', DX, DY - 110, 34, { alpha: g2 * gin(cue('C18', 'A的k次方')) });
    ctag('重根：看几何重数', DX - 200, DY + 30, { px: 32, a: g2 * gin(cue('C18', '有重根')), color: C.ink });
    ctag('剪切：亏损', DX + 220, DY + 30, { px: 32, a: g2 * gin(cue('C18', '剪切')), color: C.free });
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('马尔可夫链 · 矩阵指数', DX, DY - 20, { px: 72, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('Aⁿ 的未来 · eᴬ', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink, font: F.serif });
  }

  const SECS = [
    { t0: T.o - 0.2, t1: T.e1 - 0.3, head: '对角化', items: [['不同 λ ⇒ 无关', T.th1b, { color: C.peri }], ['X⁻¹AX = D', T.def2], ['⇔ n 个无关特征向量', T.th2b], ['AX = XD', T.why3, { color: C.peri }], ['列与对角元一一对应', T.ord]] },
    { t0: T.e1 - 0.2, t1: T.e2 - 0.3, head: '基变换的眼光', items: [['例 1：λ = 1，−4', T.e1], ['特征基里只伸缩', T.cb2, { color: C.peri }], ['Aᵏ = XDᵏX⁻¹', T.pw2], ['A⁵ 一步到位', T.a5b, { color: OK }]] },
    { t0: T.e2 - 0.2, t1: T.tj - 0.3, head: '什么时候不行', items: [['例 2：重根也可能行', T.e2c, { color: OK }], ['例 3：剪切 → 亏损', T.sh3, { color: C.free }], ['例 4：A 亏损，B 可以', T.e4c], ['几何 ≤ 代数', T.mu3, { color: C.peri }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['A = XDX⁻¹', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(D); shotC(D); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
