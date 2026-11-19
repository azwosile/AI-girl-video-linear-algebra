// 第 7 章 7.4 条件数（Leon 9th §7.4 后半：例 2 病态方程组、残差、例 4、夹逼不等式、条件数定义、例 3、cond₂ = σ₁/σₙ、希尔伯特矩阵、丢位数经验、例 5）。
// 分镜：3B1B：两条几乎平行的直线，一条稍微一转，交点沿直线滑出去很远 → 残差小 vs 误差大的两根柱子 → 夹逼不等式 → 例 3 条件数 24
//       → 椭圆越压越扁 → 希尔伯特 4 / 8 / 12 阶条件数柱 → 16 格有效数字尺被吃掉 → 例 5 → 同济：行列式 ×100，条件数不变 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, Plane, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_confused', 'ds_proud', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.4 条件数', hi: 3, en: 'CONDITION NUMBER',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C06: 0.6, C09: 0.6, C11: 0.6, C13: 0.6, C14: 0.6, C17: 0.6, G01: 0.6, C18: 0.6 },
    post: { C01: 0.6, C02: 1.0, C03: 1.4, C04: 1.4, C05: 1.0, C06: 0.8, C08: 1.4, C09: 1.4, C10: 1.0, C11: 1.2, C12: 1.2, C13: 1.2, C14: 1.2, C15: 1.4, C16: 1.0, C17: 1.2, G01: 0.8, C18: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, e2: L('C02').s, e2b: cue('C02', '精确解'), e2c: L('C03').s, e2d: cue('C03', '万分之二点五'), e2e: cue('C03', '变成了二、一'), d1: L('D01').s, ln: L('C04').s, ln2: cue('C04', '稍微转一点点'),
    df: L('C05').s, df2: cue('C05', '叫作病态的'), rs: L('C06').s, rs2: cue('C06', '可以算残差'), d2: L('D02').s, e4: L('C07').s, e4b: cue('C07', '算出来x撇'), e4c: L('C08').s, e4d: cue('C08', '可是真解'), e4e: cue('C08', '百分之百'),
    in: L('C09').s, in2: cue('C09', '夹逼不等式'), in3: cue('C09', '叫作A的条件数'), up: L('C10').s, up2: cue('C10', '大于等于一'), e3: L('C11').s, e3b: cue('C11', 'A逆等于'), e3c: cue('C11', '条件数是二十四'),
    ck: L('C12').s, ck2: cue('C12', '几乎顶到了上限'), c2: L('C13').s, c2b: cue('C13', '椭圆越扁'), c2c: cue('C13', '就是奇异了'), hi: L('C14').s, hi2: cue('C14', '四阶的条件数'), hi3: cue('C14', '八阶'), hi4: cue('C14', '十二阶'),
    h12: L('C15').s, h12b: cue('C15', '相对残差'), h12c: cue('C15', '错了将近三成'), d3: L('D03').s, rl: L('C16').s, rl2: cue('C16', '双精度大约有十六位'), rl3: cue('C16', '大约还剩十位'), e5: L('C17').s, e5b: cue('C17', '远远超出'),
    tj: L('G01').s, tj2: cue('G01', '把每个方程都乘十'), tj3: cue('G01', '条件数却一点不变'), sum: L('C18').s, end: L('C19').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.e2, 0.3); TL.sfx('pop', T.e2c, 0.3); TL.sfx('impact', T.e2e, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('warp', T.ln2, 0.32); TL.sfx('sting', T.df2, 0.3);
  TL.sfx('pop', T.rs2, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.e4b, 0.3); TL.sfx('pop', T.e4c, 0.3); TL.sfx('buzz', T.e4e, 0.25); TL.sfx('sting', T.in2, 0.3); TL.sfx('ding', T.in3, 0.3); TL.sfx('pop', T.up2, 0.3);
  TL.sfx('pop', T.e3b, 0.3); TL.sfx('ding_hi', T.e3c, 0.3); TL.sfx('ding', T.ck2, 0.3); TL.sfx('warp', T.c2b, 0.3); TL.sfx('crack', T.c2c, 0.3); [T.hi2, T.hi3, T.hi4].forEach(x => TL.sfx('pop', x, 0.3)); TL.sfx('buzz', T.h12c, 0.25);
  TL.sfx('pluck', T.d3, 0.3); TL.sfx('pop', T.rl2, 0.3); TL.sfx('ding', T.rl3, 0.3); TL.sfx('impact', T.e5b, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('ding', T.tj3, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C19').e + 0.3, 0.4);

  // ── A：例 2 + 两条几乎平行的线 ──
  const P = new Plane({ ox: DX - 120, oy: DY + 210, u: 70, R: 5 });
  const Q0 = [-3, 6.3];
  function shotA() {
    const a = B.win(T.o - 0.2, T.rs - 0.3); if (a <= 0) return;
    texAt('sysA', DX, DY - 370, 28, { alpha: a * gin(T.e2) * (1 - gin(T.e2c + 0.4)) });
    texAt('sysB', DX, DY - 370, 28, { alpha: a * gin(T.e2c + 0.4) });
    ctag('系数只变 0.025%', DX - 200, DY - 280, { px: 28, a: a * gin(T.e2d), color: C.inkMid }); ctag('解 (1, 2) → (2, 1)！', DX + 200, DY - 280, { px: 30, a: a * gin(T.e2e), color: C.free, font: F.serif });
    const g = a * gin(T.ln - 0.2) * (1 - gin(T.df - 0.2)); if (g > 0) {
      const s = smoother(prog(B.t, T.ln2, T.ln2 + 1.5)), X = [lerp(1, 2, s), lerp(2, 1, s)], D = { x: DX, y: DY + 20, r: 330 };
      B.line2(P.S([-1, 0]), P.S([4.5, 0]), C.inkMid, g * 0.5, 2); B.line2(P.S([0, -0.5]), P.S([0, 4.2]), C.inkMid, g * 0.5, 2);
      B.curve(P, D, x => 3 - x, -1, 4.5, g, { color: C.i, width: 4 });
      const k = (X[1] - Q0[1]) / (X[0] - Q0[0]); B.curve(P, D, x => X[1] + k * (x - X[0]), -1, 4.5, g, { color: C.j, width: 4 });
      B.dot(...P.S([1, 2]), 8, OK, g * 0.6); B.dot(...P.S(X), 11, s > 0.5 ? C.free : OK, g);
      B.tag(s > 0.5 ? '(2, 1)' : '(1, 2)', P.S(X)[0] + 16, P.S(X)[1] - 24, { px: 28, a: g, color: s > 0.5 ? C.free : OK, font: F.serif });
      ctag('（示意：夸大了夹角）', DX + 280, DY + 280, { px: 22, a: g, color: C.inkMid });
      ctag('几乎平行 → 交点滑出去很远', DX + 140, DY - 200, { px: 28, a: g * gin(T.ln2 + 1.0), color: C.peri });
    }
    const gd = a * gin(T.df - 0.2); if (gd > 0) {
      B.card(DX, DY - 120, 760, 150, gd, C.free);
      ctag('A 的元素小小的相对变化', DX, DY - 150, { px: 30, a: gd, color: C.ink }); ctag('→ 解很大的相对变化：病态', DX, DY - 95, { px: 32, a: gd * gin(T.df2), color: C.free, font: F.serif });
      ctag('反之：良态', DX, DY + 30, { px: 30, a: gd * gin(T.df2 + 1.5), color: OK });
    }
  }

  // ── B：残差 vs 误差 ──
  function shotB() {
    const a = B.win(T.rs - 0.2, T.in - 0.3); if (a <= 0) return;
    ctag('真解 x 不知道，怎么检验 x′？', DX, DY - 390, { px: 30, a: a * gin(T.rs), color: C.inkMid });
    B.card(DX, DY - 310, 360, 76, a * gin(T.rs2), C.peri); texAt('res', DX, DY - 310, 38, { alpha: a * gin(T.rs2) });
    ctag('残差小 ⇒ 解准？', DX, DY - 220, { px: 30, a: a * gin(T.d2) * (1 - gin(T.e4)), color: C.ds });
    texAt('ex4', DX, DY - 220, 30, { alpha: a * gin(T.e4b) });
    texAt('ex4r', DX, DY - 120, 30, { alpha: a * gin(T.e4c) });
    texAt('ex4e', DX, DY - 30, 30, { alpha: a * gin(T.e4d) });
    const gb = a * gin(T.e4c + 0.5); if (gb > 0) {
      const y0 = DY + 290, H = 190, s1 = smoother(prog(B.t, T.e4c + 0.5, T.e4c + 1.5)), s2 = smoother(prog(B.t, T.e4d + 0.5, T.e4d + 1.5));
      ctx.save(); ctx.globalAlpha = gb * 0.85; ctx.fillStyle = OK; ctx.fillRect(DX - 160, y0 - H / 18 * s1, 110, H / 18 * s1); ctx.fillStyle = C.free; ctx.fillRect(DX + 50, y0 - H * s2, 110, H * s2); ctx.restore();
      ctag('相对残差 1/18', DX - 105, y0 + 26, { px: 24, a: gb, color: OK }); ctag('相对误差 1 = 100%', DX + 105, y0 + 26, { px: 24, a: gb * gin(T.e4d), color: C.free });
    }
  }

  // ── C：夹逼 + 条件数 + 例 3 ──
  function shotC() {
    const a = B.win(T.in - 0.2, T.c2 - 0.3); if (a <= 0) return;
    ctag('e = A⁻¹ r，　b = A x', DX, DY - 390, { px: 30, a: a * gin(T.in), color: C.inkMid, font: F.serif });
    B.card(DX, DY - 290, 900, 120, a * gin(T.in2), C.peri); texAt('ineq', DX, DY - 290, 34, { alpha: a * gin(T.in2), reveal: rv(T.in2, 2.0) });
    B.card(DX, DY - 160, 420, 80, a * gin(T.in3), C.peri); texAt('cond', DX, DY - 160, 38, { alpha: a * gin(T.in3) });
    ctag('放大倍数的上限 · cond ≥ 1', DX, DY - 85, { px: 28, a: a * gin(T.up), color: C.ink });
    ctag('≈ 1 良态　很大 → 病态', DX, DY - 35, { px: 28, a: a * gin(T.up2), color: C.inkMid });
    texAt('ex3', DX, DY + 60, 32, { alpha: a * gin(T.e3b) });
    ctag('cond∞(A) = 24', DX, DY + 150, { px: 38, a: a * gin(T.e3c), color: C.peri, font: F.serif });
    texAt('chk', DX - 120, DY + 230, 34, { alpha: a * gin(T.ck) }); ctag('几乎顶到上限', DX + 220, DY + 230, { px: 28, a: a * gin(T.ck2), color: C.free });
  }

  // ── D：椭圆越扁越病态 ──
  const PE = new Plane({ ox: DX, oy: DY + 60, u: 120, R: 3 });
  function shotD() {
    const a = B.win(T.c2 - 0.2, T.hi - 0.3); if (a <= 0) return;
    B.card(DX, DY - 340, 340, 90, a, C.peri); texAt('c2', DX, DY - 340, 40, { alpha: a });
    const fl = smoother(prog(B.t, T.c2b - 0.3, T.c2c + 0.6)), sn = lerp(1.0, 0.02, fl), th = 0.5, R2 = [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
    const M = [[R2[0][0] * 2, R2[0][1] * sn], [R2[1][0] * 2, R2[1][1] * sn]];
    B.ball(PE, M, 1, a, { kind: 'two', color: fl > 0.9 ? C.free : C.peri });
    arrow(ctx, PE.S([0, 0]), PE.S([M[0][0], M[1][0]]), { color: C.i, width: 6, head: 18, alpha: a }); arrow(ctx, PE.S([0, 0]), PE.S([M[0][1], M[1][1]]), { color: C.j, width: 6, head: 18, alpha: a });
    B.tag('σ₁', PE.S([M[0][0], M[1][0]])[0] + 12, PE.S([M[0][0], M[1][0]])[1] - 12, { px: 30, a, color: C.i, font: F.serif });
    ctag(`cond₂ = ${(2 / sn).toFixed(0)}`, DX, DY + 280, { px: 40, a: a * gin(T.c2b - 0.3), color: fl > 0.9 ? C.free : C.peri, font: F.serif });
    ctag('最短半轴 = 0 → 奇异', DX, DY - 240, { px: 30, a: a * gin(T.c2c), color: C.free });
  }

  // ── E：希尔伯特 ──
  function shotE() {
    const a = B.win(T.hi - 0.2, T.d3 - 0.3); if (a <= 0) return;
    texAt('hil', DX, DY - 370, 40, { alpha: a * gin(T.hi) });
    const data = [[4, 4.19, T.hi2, '1.6 × 10⁴'], [8, 10.18, T.hi3, '1.5 × 10¹⁰'], [12, 16.21, T.hi4, '1.6 × 10¹⁶']], y0 = DY + 120, u = 22;
    data.forEach(([n, lg, t0, lb], i) => { const x = DX - 220 + i * 220, g = a * gin(t0), h = lg * u * smoother(prog(B.t, t0, t0 + 0.8));
      ctx.save(); ctx.globalAlpha = g * 0.85; ctx.fillStyle = i === 2 ? C.free : C.peri; ctx.fillRect(x - 50, y0 - h, 100, h); ctx.restore();
      ctag(`${n} 阶`, x, y0 + 30, { px: 26, a: g, color: C.ink }); ctag(lb, x, y0 - h - 26, { px: 26, a: g, color: i === 2 ? C.free : C.peri, font: F.serif }); });
    B.line2([DX - 320, y0 - 16 * u], [DX + 320, y0 - 16 * u], C.j, a * gin(T.hi4) * 0.8, 2, [10, 8]); B.tag('双精度 ≈ 10¹⁶', DX + 330, y0 - 16 * u, { px: 22, a: a * gin(T.hi4), color: C.j });
    const g2 = a * gin(T.h12); if (g2 > 0) { B.card(DX, DY + 230, 820, 80, g2, C.free); texAt('h12', DX, DY + 230, 30, { alpha: g2 }); }
    ctag('残差完美，解错了将近三成', DX, DY + 310, { px: 28, a: a * gin(T.h12c), color: C.free });
  }

  // ── F：丢位数 + 例 5 ──
  function shotF() {
    const a = B.win(T.d3 - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('丢掉几位数字？', DX, DY - 390, { px: 34, a: a * gin(T.d3), color: C.ds });
    texAt('digits', DX, DY - 310, 38, { alpha: a * gin(T.rl) });
    const lost = Math.round(6 * smoother(prog(B.t, T.rl3 - 0.8, T.rl3 + 0.4)));
    const lit = k => (k < 16 - lost ? OK : C.free);
    for (let k = 0; k < 16; k++) { const x = DX - 375 + k * 50; ctx.save(); ctx.globalAlpha = a * gin(T.rl2) * (k < 16 - lost ? 0.85 : 0.35); ctx.fillStyle = lit(k); ctx.fillRect(x - 20, DY - 220, 40, 60); ctx.restore(); }
    ctag('双精度 16 位', DX - 250, DY - 130, { px: 26, a: a * gin(T.rl2), color: OK }); ctag('cond = 10⁶ → 丢 6 位，剩 10 位', DX + 140, DY - 130, { px: 26, a: a * gin(T.rl3), color: C.free });
    const g5 = a * gin(T.e5); if (g5 > 0) {
      ctag('例 5：第六章的 100 阶上三角矩阵', DX, DY - 20, { px: 30, a: g5, color: C.ink });
      B.card(DX, DY + 70, 640, 86, g5, C.free); texAt('ex5', DX, DY + 70, 36, { alpha: g5 });
      ctag('31 位 > 16 位：远远超出双精度', DX, DY + 170, { px: 30, a: g5 * gin(T.e5b), color: C.free, font: F.serif });
    }
  }

  // ── G：同济 + 小结 ──
  function shotG() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济：det ≠ 0 ⇒ 唯一解', DX, DY - 320, { px: 36, a: g1, color: C.gpt, font: F.serif });
    ctag('但行列式不能衡量病态', DX, DY - 240, { px: 30, a: g1 * gin(cue('G01', '行列式不能衡量')), color: C.ink });
    const gx = g1 * gin(T.tj2);
    ctag('每个方程 × 10', DX, DY - 150, { px: 30, a: gx, color: C.inkMid });
    ctag('det × 100', DX - 200, DY - 70, { px: 40, a: gx, color: C.free, font: F.serif }); ctag('cond 不变', DX + 200, DY - 70, { px: 40, a: g1 * gin(T.tj3), color: OK, font: F.serif });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['残差小 ≠ 误差小', C.free, T.sum], ['cond = 放大倍数上限', C.peri, cue('C18', '条件数，是误差')], ['cond₂ = σ₁ / σₙ', C.i, cue('C18', '二范数条件数')], ['丢 log₁₀ cond 位', C.j, cue('C18', '大约丢掉')]]
      .forEach(([s, c, t0], i) => ctag(s, DX, DY - 260 + i * 80, { px: 38, a: g2 * gin(t0), color: c, font: F.serif }));
    const g3 = a * gin(T.end - 0.2);
    ctag('病态躲不开，别让算法再添乱', DX, DY - 200, { px: 30, a: g3, color: C.inkMid });
    ctag('下一节', DX, DY - 120, { px: 34, a: g3 * gin(cue('C19', '下一节')), color: C.inkMid });
    ctag('正交变换', DX, DY - 20, { px: 90, a: g3 * gin(cue('C19', '下一节') + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  const SECS = [
    { t0: T.e2 - 0.2, t1: T.in - 0.3, head: '病态', items: [['例 2：解面目全非', T.e2e, { color: C.free }], ['几乎平行的直线', T.ln], ['残差 r = b − Ax′', T.rs2, { color: C.peri }], ['残差小 ≠ 解准', T.e4e, { color: C.free }]] },
    { t0: T.in - 0.2, t1: T.hi - 0.3, head: '条件数', items: [['cond = ‖A‖‖A⁻¹‖', T.in3, { color: C.peri }], ['误差 ≤ cond × 残差', T.up], ['例 3：cond∞ = 24', T.e3c], ['cond₂ = σ₁ / σₙ', T.c2, { color: C.i }]] },
    { t0: T.hi - 0.2, t1: T.sum - 0.3, head: '病态矩阵', items: [['希尔伯特 h_ij = 1/(i+j−1)', T.hi], ['12 阶：错 28%', T.h12c, { color: C.free }], ['丢 log₁₀ cond 位', T.rl, { color: C.j }], ['行列式量不出病态', T.tj3, { color: C.gpt }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['条件数 = 敏感度', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotA(); shotB(); shotC(); shotD(); shotE(); shotF(); shotG(); B.left(SECS); });
  }
  return { TL, draw };
}
