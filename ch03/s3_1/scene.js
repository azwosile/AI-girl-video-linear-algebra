// 第 3 章 3.1 向量空间是什么（Leon 9th §3.1）。
// 分镜：两种运算（箭头首尾相接 / 拉长缩短反向 → 数组）→ 八条公理 → 四个例子（ℝⁿ、ℝ^{m×n}、P_n、C[a,b]，函数 = 无穷多个分量）
//       → 定理 3.1.1 三步证明 → 反例 α∘(x₁,x₂) = (αx₁, x₂) 破坏 A6（同一个点画出两个结果）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, arrow, DX, DY, LX, OK } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_happy', 'ds_think', 'ds_confused', 'ds_ask', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.1 向量空间', hi: 3, en: 'VECTOR SPACES',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C10: 0.6, C16: 0.6, C20: 0.6, C24: 0.4 },
    post: { C03: 0.6, C05: 0.5, C08: 0.6, C13: 0.6, C15: 0.8, G02: 0.5, C17: 0.5, C22: 0.6, C23: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    ops: L('C02').s, add: cue('C02', '相加'), mul: cue('C02', '乘上'), tip: cue('C03', '首尾'), str: cue('C03', '拉长'), shr: cue('C03', '缩短'), rev: cue('C03', '反向'),
    arr: L('C04').s, arr2: cue('C04', '每个位置'), clo: cue('C05', '同一类'), clo2: cue('C05', '封闭'),
    ax: L('C06').s, ax8: cue('C06', '八条'), axA: L('C07').s, axM: L('C08').s, hab: cue('C09', '习惯'), tj: L('G01').s,
    ex: L('C10').s, ex1: cue('C10', 'R n'), ex2: L('C11').s, ex3: L('C12').s, ex3b: L('C13').s, ex3c: cue('C13', '排成一列'),
    ex4: L('C14').s, ex4b: cue('C14', '每一个点'), ex4c: L('C15').s, ex4d: cue('C15', '每一个x'), sum: L('G02').s, sum2: cue('G02', '守这八条'),
    th: L('C16').s, th1: cue('C16', '数零乘'), pf: L('C17').s, pf2: cue('C17', '按分配律'), pf3: cue('C17', '两边同时'), th2: L('C18').s, th3: cue('C18', '第三条'),
    odd: L('C20').s, odd2: cue('C20', '第二个分量'), dsg: L('D06').s, chk: L('C21').s, chk6: cue('C21', '第六条'),
    lhs: L('C22').s, rhs: cue('C22', '右边'), neq: L('C23').s, notvs: cue('C23', '不是向量空间'), ticket: cue('C23', '入场券'), tip3: L('G03').s,
    end: L('C24').s,
  };
  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.add, 0.3); TL.sfx('pop', T.mul, 0.3); TL.sfx('whoosh', T.tip, 0.3); TL.sfx('warp', T.str, 0.3); TL.sfx('warp', T.rev, 0.3);
  TL.sfx('check', T.clo2, 0.35); TL.sfx('whoosh', T.ax, 0.3); TL.sfx('pluck', T.axA, 0.25); TL.sfx('pluck', T.axM, 0.25); TL.sfx('bell_soft', T.tj, 0.3);
  [T.ex1, T.ex2, T.ex3, T.ex4].forEach(x => TL.sfx('pop', x, 0.3)); TL.sfx('shimmer', T.ex4d, 0.35); TL.sfx('ding_hi', T.sum2, 0.3);
  TL.sfx('whoosh', T.th, 0.3); TL.sfx('check', T.pf3 + 1.2, 0.3); TL.sfx('whoosh', T.odd, 0.3); TL.sfx('pop', T.dsg + 0.3, 0.28); TL.sfx('warp', T.lhs + 0.4, 0.3); TL.sfx('warp', T.rhs + 0.4, 0.3);
  TL.sfx('buzz', T.neq + 0.2, 0.25); TL.sfx('stamp', T.notvs, 0.38); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

  const P = new Plane({ ox: DX - 170, oy: DY + 170, u: 82, R: 9 });
  const v = [1, 2], w = [3, -1];

  // ── A：两种运算 ──
  function shotOps(D) {
    const a = B.win(T.ops - 0.3, T.ax - 0.4); if (a <= 0) return;
    const ga = a * (1 - gin(T.arr - 0.2, 0.5));
    if (ga > 0) {
      B.grid(P, [[1, 0], [0, 1]], ga, D, { neu: 0, basis: false, old: 0.16 });
      const tipS = smoother(prog(B.t, T.tip, T.tip + 1.0));
      // 数乘因子：1 → 2 → 0.5 → −1
      let k = 1; if (B.t > T.str) k = lerp(1, 2, smoother(prog(B.t, T.str, T.str + 0.7)));
      if (B.t > T.shr) k = lerp(2, 0.5, smoother(prog(B.t, T.shr, T.shr + 0.7)));
      if (B.t > T.rev) k = lerp(0.5, -1, smoother(prog(B.t, T.rev, T.rev + 0.8)));
      const sc = B.t > T.str - 0.1;
      B.vec(P, v, ga * gin(T.ops + 0.3), { color: C.i, label: 'v' });
      if (!sc) {
        B.vec(P, w, ga * gin(T.ops + 0.6), { color: C.j, label: 'w', from: [v[0] * tipS, v[1] * tipS] });
        B.vec(P, [v[0] + w[0], v[1] + w[1]], ga * gin(T.tip + 0.9), { color: C.peri, label: 'v + w', width: 9 });
      } else {
        const sa = ga * gin(T.str - 0.1);
        B.vec(P, [v[0] * k, v[1] * k], sa, { color: C.free, width: 10, label: `${k.toFixed(1).replace('-', '−')} v`, lx: 18, ly: 20 });
      }
    }
    const ta = a * gin(T.arr - 0.1, 0.5);
    texAt('add2', DX, DY - 150, 54, { alpha: ta, reveal: rv(T.arr, 1.2) });
    texAt('sc2', DX, DY + 60, 54, { alpha: a * gin(T.arr2, 0.5), reveal: rv(T.arr2, 1.0) });
    ctag('封闭：加完、乘完，还是同一类东西', DX, DY + 260, { px: 38, a: a * gin(T.clo, 0.5), color: C.peri });
    if (ga > 0) ctag(B.t > T.str ? '数乘：拉长 · 缩短 · 反向' : '加法：首尾相接', DX, DY - 360, { px: 36, a: ga * gin(T.tip - 0.3), color: C.ink });
  }

  // ── B：八条公理 ──
  function shotAxioms() {
    const a = B.win(T.ax - 0.1, T.ex - 0.4); if (a <= 0) return;
    for (let i = 0; i < 8; i++) {
      const y = DY - 330 + i * 80, add = i < 4;
      const t0 = T.ax8 + 0.15 * i;
      const hl = add ? smooth(prog(B.t, T.axA, T.axA + 0.5)) * (1 - smooth(prog(B.t, T.axM, T.axM + 0.5))) : smooth(prog(B.t, T.axM, T.axM + 0.5)) * (1 - smooth(prog(B.t, T.hab, T.hab + 0.6)));
      const col = hl > 0.5 ? (add ? C.i : C.j) : C.ink;
      texAt('ax' + (i + 1), DX - 330, y, 40, { alpha: a * gin(t0, 0.4) * (0.55 + 0.45 * Math.max(hl, B.t < T.axA ? 1 : 0)), color: col }, 'l');
    }
    ctag('加法', DX + 330, DY - 210, { px: 34, a: a * gin(T.axA), color: C.i });
    ctag('数乘', DX + 330, DY + 110, { px: 34, a: a * gin(T.axM), color: C.j });
    B.card(DX, DY + 345, 640, 70, a * gin(T.hab, 0.5), C.peri);
    ctag('= 平时对数组运算的习惯', DX, DY + 345, { px: 34, a: a * gin(T.hab, 0.5), color: C.peri });
  }

  // ── C：四个例子 ──
  const f = x => 0.9 * Math.sin(1.25 * x) + 0.25, g = x => 0.45 * Math.cos(0.8 * x + 0.6) + 0.18 * x;
  function plotFn(fn, a, color, { x0, x1, ox, oy, sx, sy, width = 5 }) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let k = 0; k <= 160; k++) { const x = lerp(x0, x1, k / 160), X = ox + x * sx, Y = oy - fn(x) * sy; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.stroke(); ctx.restore();
  }
  function shotExamples(D) {
    const a = B.win(T.ex - 0.2, T.th - 0.4); if (a <= 0) return;
    const one = (t0, t1) => a * B.win(t0, t1, 0.35, 0.35);
    // ℝⁿ
    let s = one(T.ex1 - 0.2, T.ex2 - 0.2);
    ctag('例 1', DX, DY - 300, { px: 32, a: s, color: C.peri }); texAt('exRn', DX, DY - 40, 70, { alpha: s, reveal: rv(T.ex1, 0.9) });
    ctag('n 个实数排成一列', DX, DY + 210, { px: 34, a: s * gin(T.ex1 + 0.8), color: C.inkMid });
    // ℝ^{m×n}
    s = one(T.ex2, T.ex3 - 0.2);
    ctag('例 2：m×n 矩阵', DX, DY - 300, { px: 34, a: s, color: C.peri }); texAt('exRmn', DX, DY - 40, 54, { alpha: s, reveal: rv(T.ex2 + 0.5, 1.2) });
    ctag('对应元素相加 · 每个元素乘同一个数', DX, DY + 170, { px: 32, a: s * gin(cue('C11', '对应元素')), color: C.inkMid });
    // P_n
    s = one(T.ex3, T.ex4 - 0.2);
    ctag('例 3：Pₙ（次数 < n 的多项式）', DX, DY - 300, { px: 34, a: s, color: C.peri });
    texAt('exP', DX, DY - 20, 56, { alpha: s * gin(T.ex3b), reveal: rv(T.ex3c - 0.6, 1.4) });
    ctag('系数排成一列 → 就是 ℝ³ 里的箭头', DX, DY + 210, { px: 32, a: s * gin(T.ex3c + 0.8), color: C.inkMid });
    // C[a,b]
    s = one(T.ex4, T.sum - 0.1);
    if (s > 0) {
      const G = { x0: -3.2, x1: 3.2, ox: DX, oy: DY + 40, sx: 120, sy: 120 };
      ctag('例 4：C[a, b]（连续函数）', DX, DY - 330, { px: 34, a: s, color: C.peri });
      B.line2([DX - 420, G.oy], [DX + 420, G.oy], C.inkMid, s * 0.6, 2);
      const bars = gin(T.ex4c, 0.4);
      if (bars < 1) { plotFn(f, s * (1 - bars), C.i, G); plotFn(g, s * (1 - bars), C.j, G); plotFn(x => f(x) + g(x), s * gin(T.ex4b, 0.6) * (1 - bars), C.peri, { ...G, width: 7 }); }
      // 竖线：在某个 x 处两个函数值相加
      const ma = s * B.win(T.ex4b, T.ex4c, 0.3, 0.3);
      if (ma > 0) {
        const x = lerp(-2.4, 2.2, smooth(prog(B.t, T.ex4b, T.ex4c - 0.3))), X = G.ox + x * G.sx;
        const yf = G.oy - f(x) * G.sy, yfg = G.oy - (f(x) + g(x)) * G.sy;
        B.line2([X, G.oy], [X, yf], C.i, ma, 8); B.line2([X + 12, yf], [X + 12, yfg], C.j, ma, 8); B.dot(X, yfg, 9, C.peri, ma);
        B.tag('f(x) + g(x)', X + 26, yfg - 20, { px: 30, a: ma, color: C.peri, font: F.serif });
      }
      // 函数 = 无穷多个分量：竖条越来越密，最后连成曲线
      if (bars > 0) {
        const n = Math.round(lerp(6, 90, smoother(prog(B.t, T.ex4c + 0.3, T.ex4d + 1.6))));
        ctx.save(); ctx.globalAlpha = s * bars; ctx.fillStyle = C.i;
        for (let k = 0; k < n; k++) { const x = lerp(G.x0, G.x1, (k + 0.5) / n), X = G.ox + x * G.sx, h = f(x) * G.sy, bw = Math.max(2, (G.x1 - G.x0) * G.sx / n * 0.55); ctx.fillRect(X - bw / 2, Math.min(G.oy, G.oy - h), bw, Math.abs(h)); }
        ctx.restore();
        plotFn(f, s * smooth(prog(B.t, T.ex4d + 1.2, T.ex4d + 2.0)), C.ink, { ...G, width: 4 });
        ctag('每一个 x ↔ 一个分量', DX, DY + 300, { px: 34, a: s * gin(T.ex4d), color: C.peri });
      } else texAt('exC', DX, DY + 300, 44, { alpha: s * gin(T.ex4b), reveal: rv(T.ex4b, 1.0) });
    }
    // 汇总：四格
    s = a * gin(T.sum, 0.5);
    if (s > 0) {
      const cells = [['ℝⁿ', '一列数'], ['m×n', '矩阵'], ['Pₙ', '多项式'], ['C[a, b]', '函数']];
      cells.forEach(([h, d], i) => { const x = DX + (i % 2 ? 190 : -190), y = DY - 170 + Math.floor(i / 2) * 210;
        B.card(x, y, 330, 170, s * gin(T.sum + 0.12 * i, 0.4), [C.i, C.j, C.k, C.peri][i]);
        ctag(h, x, y - 25, { px: 48, a: s * gin(T.sum + 0.12 * i, 0.4), color: [C.i, C.j, C.k, C.peri][i], font: F.serif }); ctag(d, x, y + 40, { px: 30, a: s * gin(T.sum + 0.12 * i, 0.4), color: C.inkMid }); });
      ctag('能相加 · 能数乘 · 守八条规矩', DX, DY + 300, { px: 40, a: s * gin(T.sum2 - 0.6), color: C.peri });
    }
  }

  // ── D：定理 3.1.1 ──
  function shotThm() {
    const a = B.win(T.th - 0.2, T.odd - 0.4); if (a <= 0) return;
    ctag('定理 3.1.1', DX, DY - 360, { px: 34, a: a * gin(T.th), color: C.peri });
    texAt('th1', DX, DY - 270, 66, { alpha: a * gin(T.th1), reveal: rv(T.th1, 0.8), color: B.t > T.pf3 + 1.2 ? OK : C.ink });
    texAt('pf1', DX, DY - 130, 50, { alpha: a * gin(T.pf), reveal: rv(T.pf, 1.0) * (B.t < T.pf2 ? 0.55 : 1) });
    ctag('分配律 A6', DX + 210, DY - 70, { px: 28, a: a * gin(T.pf2), color: C.j });
    texAt('pf2', DX, DY - 10, 50, { alpha: a * gin(T.pf3 + 0.5), reveal: rv(T.pf3 + 0.5, 0.8), color: OK });
    ctag('两边 + (−0x)', DX - 260, DY - 10, { px: 28, a: a * gin(T.pf3), color: C.inkMid });
    texAt('th2', DX, DY + 130, 48, { alpha: a * gin(T.th2), reveal: rv(T.th2, 1.0) });
    texAt('th3', DX, DY + 230, 48, { alpha: a * gin(T.th3), reveal: rv(T.th3, 0.8) });
    ctag('在陌生的集合里，要靠公理保证', DX, DY + 340, { px: 32, a: a * gin(L('C19').s + 1.0), color: C.peri });
  }

  // ── E：反例 ──
  const P2 = new Plane({ ox: DX - 260, oy: DY + 270, u: 105, R: 6 });
  function shotOdd(D) {
    const a = B.win(T.odd - 0.2, T.end - 0.4); if (a <= 0) return;
    ctag('V = ℝ²，加法照常，数乘改成：', DX, DY - 380, { px: 30, a: a * gin(T.odd), color: C.inkMid });
    texAt('odd', DX, DY - 315, 50, { alpha: a * gin(T.odd + 0.3), reveal: rv(T.odd + 0.3, 1.0), color: C.peri });
    ctag('第二个分量保持不动', DX + 250, DY - 250, { px: 28, a: a * gin(T.odd2), color: C.free });
    ctag('封闭 ✓', DX - 260, DY - 250, { px: 32, a: a * gin(T.dsg + 0.8), color: OK });
    texAt('lhs', DX, DY - 170, 40, { alpha: a * gin(T.lhs), reveal: rv(T.lhs, 1.0), color: C.i });
    texAt('rhs', DX, DY - 100, 40, { alpha: a * gin(T.rhs), reveal: rv(T.rhs, 1.2), color: C.j });
    ctag('检查 A6：(α+β)∘x = α∘x + β∘x ?', DX, DY - 170, { px: 28, a: a * gin(T.chk6) * (1 - gin(T.lhs - 0.2)), color: C.inkMid });
    const ga = a * gin(T.chk, 0.5);
    if (ga > 0) {
      ctx.save(); B.K.clip(D); ctx.beginPath(); ctx.rect(0, DY - 50, 1920, 1080); ctx.clip(); P2.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.16 * ga }); ctx.restore();
      B.vec(P2, [1, 1], ga, { color: C.ink, label: 'x = (1, 1)', lx: -150, ly: -20, px: 28 });
      B.vec(P2, [2, 1], ga * gin(T.lhs + 0.4), { color: C.i, label: '左边 (2, 1)', lx: 14, ly: 26, px: 28 });
      B.vec(P2, [2, 2], ga * gin(T.rhs + 0.4), { color: C.j, label: '右边 (2, 2)', lx: 14, ly: -16, px: 28 });
      const p = P2.S([2, 1]), q = P2.S([2, 2]); B.line2(p, q, C.free, ga * gin(T.neq), 4, [8, 8]);
    }
    texAt('neq', DX + 250, DY + 70, 46, { alpha: a * gin(T.neq), color: C.free });
    B.stamp(DX + 250, DY + 200, false, prog(B.t, T.notvs - 0.05, T.notvs + 0.4), a, '✗ 不是');
    ctag('先查封闭 → 找被破坏的公理 → 代入数字', DX, DY + 330, { px: 30, a: a * gin(T.tip3), color: C.gpt });
  }

  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('子空间', DX, DY - 20, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('向量空间里面的向量空间', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.ops, t1: T.ax - 0.3, head: '两种运算', items: [['加法：首尾相接', T.tip], ['数乘：拉长 · 缩短 · 反向', T.str], ['数组：逐个位置算', T.arr], ['结果还是同类 → 封闭', T.clo2, { color: C.peri }]] },
    { t0: T.ax - 0.3, t1: T.ex - 0.3, head: '八条公理', items: [['A1–A4：管加法', T.axA, { color: C.i, mark: C.i }], ['A5–A8：管数乘', T.axM, { color: C.j, mark: C.j }], ['不用死背：运算习惯', T.hab]],
      note: { title: '同济对照', body: ['满足八条的集合 = “线性空间”', '同济放在第六章'], t: T.tj, y: 440 } },
    { t0: T.ex - 0.3, t1: T.th - 0.3, head: '都是向量空间', items: [['ℝⁿ', T.ex1], ['m×n 矩阵', T.ex2], ['Pₙ：多项式', T.ex3], ['C[a, b]：连续函数', T.ex4]] },
    { t0: T.th - 0.3, t1: T.odd - 0.3, head: '定理 3.1.1', items: [['0x = 0', T.th1], ['x + y = 0 ⇒ y = −x', T.th2], ['(−1)x = −x', T.th3]] },
    { t0: T.odd - 0.3, t1: T.end - 0.3, head: '反例', items: [['数乘改成 (αx₁, x₂)', T.odd], ['封闭 ✓', T.dsg + 0.8, { color: OK, mark: OK }], ['A6 ✗：(2,1) ≠ (2,2)', T.neq, { color: C.free, mark: C.free }], ['八条一条都不能少', T.ticket, { color: C.peri }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotOps(D); shotAxioms(); shotExamples(D); shotThm(); shotOdd(D); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
