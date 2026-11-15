// 第 4 章 4.1a 什么是线性变换（Leon 9th §4.1 前半）。
// 分镜：变换 = 函数 = 运动（网格乱扭 → 规整的线性变换）→ 定义（可加 + 齐次）→ 两条几何判别
//       → 例 1 伸缩 / 例 2 投影 / 例 3 反射 / 例 4 旋转（各一段网格动画）→ 小结四宫格
//       → 反例：例 6 范数（数轴）、Test B 1(b)（横线拧成过原点的斜线）、平移（原点被拖走）→ 同济对照 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_ask', 'ds_think', 'ds_confused', 'ds_happy', 'ds_proud', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第四章 · 线性变换', title: '4.1 什么是线性变换', hi: 4, en: 'LINEAR TRANSFORMATIONS', titlePx: 92,
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C05: 0.6, C09: 0.5, C10: 0.6, C12: 0.6, C14: 0.6, C15: 0.6, C16: 0.5, C17: 0.6, C19: 0.6, C22: 0.4, G01: 0.6, C25: 0.6 },
    post: { C03: 0.8, C07: 0.6, C09: 0.8, C10: 1.0, C12: 1.0, C14: 1.0, C15: 1.2, C18: 0.6, C21: 1.0, C22: 0.8, C23: 0.6, G02: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, d1: L('D01').s, fn: L('C02').s, fn2: cue('C02', '吐出'), mv: L('C03').s, mv2: cue('C03', '整张网格'), mess: L('C04').s, lin: cue('C04', '线性变换'),
    def: L('C05').s, def2: cue('C05', '画面上'), one: L('C06').s, two: L('C07').s, two2: cue('C07', '第二'), op: L('C08').s, op2: cue('C08', '线性算子'),
    d2: L('D02').s, rule: L('C09').s, r1: cue('C09', '仍然是直线'), r2: cue('C09', '原点不动'),
    e1: L('C10').s, e1v: L('C11').s, e2: L('C12').s, e2s: cue('C12', '整张平面'), d3: L('D03').s, e2v: L('C13').s,
    e3: L('C14').s, e4: L('C15').s, e4i: cue('C15', 'i帽转到'), e4j: cue('C15', 'j帽转到了负'), four: L('C16').s, d4: L('D04').s,
    n6: L('C17').s, n6b: L('C18').s, b1: L('C19').s, b1b: L('C20').s, b1c: L('C21').s,
    d5: L('D05').s, tr: L('C22').s, tr2: cue('C22', '盯住原点'), L0: L('C23').s, L0b: cue('C23', '原点一动'), pit: L('C24').s, pit2: cue('C24', '这个坑'),
    tj: L('G01').s, tj2: L('G02').s, sum: L('C25').s, sum2: cue('C25', '判断的时候'), d6: L('D06').s, end: L('C26').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.fn2, 0.3); TL.sfx('warp', T.mv2, 0.4); TL.sfx('warp', T.lin, 0.4);
  TL.sfx('whoosh', T.def, 0.3); TL.sfx('pop', T.two, 0.3); TL.sfx('pop', T.two2, 0.3); TL.sfx('ding_hi', T.op2, 0.3);
  TL.sfx('warp', T.rule + 0.3, 0.4); TL.sfx('pluck', T.r1, 0.3); TL.sfx('pluck', T.r2, 0.3);
  [T.e1, T.e2, T.e3, T.e4].forEach(x => TL.sfx('warp', x + 0.6, 0.4)); TL.sfx('check', T.e1v + 1.5, 0.3); TL.sfx('shimmer', T.four, 0.35);
  TL.sfx('whoosh', T.n6, 0.3); TL.sfx('stamp', T.n6b + 2.0, 0.32); TL.sfx('warp', T.b1c, 0.4); TL.sfx('stamp', T.b1b + 2.0, 0.32);
  TL.sfx('warp', T.tr + 0.3, 0.4); TL.sfx('pop', T.tr2, 0.3); TL.sfx('stamp', T.L0b, 0.32); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C26').e + 0.3, 0.4);

  const P = new Plane({ ox: DX, oy: DY + 20, u: 64, R: 8 });
  const Ps = new Plane({ ox: DX, oy: DY + 60, u: 58, R: 8 }), P1 = new Plane({ ox: DX, oy: DY + 60, u: 34, R: 14 });

  // ── A：变换 = 函数 = 运动 ──
  const swirl = p => { const r = Math.hypot(p[0], p[1]), th = 0.55 * Math.sin(r * 0.6), c = Math.cos(th), s = Math.sin(th); const k = 1 + 0.06 * r; return [k * (c * p[0] - s * p[1]), k * (s * p[0] + c * p[1]) + 0.04 * p[0] * p[0]]; };
  const ML = [[1, 0.6], [0.3, 1.1]];
  function shotIntro(D) {
    const a = B.win(T.o1 + 0.4, T.def - 0.3); if (a <= 0) return;
    const sl = smoother(prog(B.t, T.lin, T.lin + 1.6));
    if (sl < 1) B.warpF(P, swirl, smoother(prog(B.t, T.mv2, T.mv2 + 2.2)) * (1 - sl), a * (1 - sl * 0.999), D, { neu: 0.5 });
    if (sl > 0) B.warp(P, ML, sl, a * sl, D, { basis: true });
    const va = a * gin(T.fn) * (1 - gin(T.mv2)); const vv = [2, 1.5], w = [-1.2, 2.6];
    if (va > 0) { B.vec(P, vv, va, { color: C.i, label: 'v', px: 34 }); B.vec(P, w, va * gin(T.fn2), { color: C.free, label: 'L(v)', px: 34 });
      ctx.save(); ctx.globalAlpha = va * gin(T.fn2); ctx.strokeStyle = C.inkMid; ctx.setLineDash([8, 8]); ctx.lineWidth = 3; const p = P.S(vv), q = P.S(w); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo((p[0] + q[0]) / 2 + 60, (p[1] + q[1]) / 2 - 80, q[0], q[1]); ctx.stroke(); ctx.restore(); }
    ctag('把矩阵当成“变换”', DX, DY - 360, { px: 38, a: a * gin(T.o1 + 0.6) * (1 - gin(T.fn - 0.2)), color: C.peri, font: F.serif });
    ctag('变换 = 函数：向量进，向量出', DX, DY - 360, { px: 36, a: a * gin(T.fn) * (1 - gin(T.mv - 0.2)), color: C.ink });
    ctag('每个点都挪到新位置', DX, DY - 360, { px: 36, a: a * gin(T.mv) * (1 - gin(T.mess - 0.2)), color: C.ink });
    ctag('绝大部分：乱七八糟', DX, DY - 360, { px: 36, a: a * gin(T.mess) * (1 - gin(T.lin - 0.1)), color: C.free });
    ctag('线性变换：最规整的一类', DX, DY - 360, { px: 38, a: a * gin(T.lin + 0.4), color: OK, font: F.serif });
    if (a * gin(T.d1) * (1 - gin(T.fn - 0.3)) > 0) texAt('Mq', DX, DY + 250, 60, { alpha: a * gin(T.d1) * (1 - gin(T.fn - 0.3)) });
  }

  // ── B：定义 ──
  function shotDef() {
    const a = B.win(T.def - 0.2, T.d2 - 0.3); if (a <= 0) return;
    texAt('map', DX, DY - 330, 52, { alpha: a * gin(T.def), color: C.peri });
    texAt('def', DX, DY - 200, 46, { alpha: a * gin(T.def2), reveal: rv(T.def2, 1.6) });
    ctag('先组合再变换 = 先变换再组合', DX, DY - 100, { px: 34, a: a * gin(T.one), color: C.ink });
    ctag('① 保持加法', DX - 300, DY + 10, { px: 32, a: a * gin(T.two), color: C.i });
    texAt('add', DX + 120, DY + 10, 40, { alpha: a * gin(T.two) });
    ctag('② 保持标量乘法', DX - 300, DY + 110, { px: 32, a: a * gin(T.two2), color: C.j });
    texAt('hom', DX + 120, DY + 110, 40, { alpha: a * gin(T.two2) });
    const g = a * gin(T.op2); B.card(DX, DY + 250, 640, 100, g, C.peri);
    texAt('op', DX - 150, DY + 250, 44, { alpha: g, color: C.peri }); ctag('线性算子', DX + 140, DY + 250, { px: 36, a: g, color: C.ink, font: F.serif });
  }

  // ── C：两条几何判别 ──
  const MR = [[1.2, 0.5], [-0.4, 0.9]];
  function shotRule(D) {
    const a = B.win(T.d2 - 0.2, T.e1 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.rule + 0.3, T.rule + 2.0));
    const M = B.warp(P, MR, s, a * gin(T.d2), D);
    if (a * gin(T.r1) > 0) { ctx.save(); K2(D); for (const k of [-2, 1, 3]) P.line(ctx, [0, k], [1, 0], { M, color: C.i, width: 5, alpha: a * gin(T.r1) * 0.9 }); ctx.restore(); }
    B.dot(...P.S([0, 0], M), 12, C.peri, a * gin(T.r2)); if (gin(T.r2) > 0) ringAt(P.S([0, 0]), T.r2);
    ctag('① 直线仍是直线：平行、等距', DX, DY - 380, { px: 34, a: a * gin(T.r1), color: C.i });
    ctag('② 原点不动', DX, DY - 330, { px: 34, a: a * gin(T.r2), color: C.peri });
  }
  const K2 = D => { ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip(); };
  const ringAt = (p, t0) => { const s = prog(B.t, t0, t0 + 1.0); if (s <= 0 || s >= 1) return; ctx.save(); ctx.globalAlpha = 1 - s; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 10 + 50 * s, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); };

  // ── D：四个例子 ──
  const rot = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
  const EX = [
    { t0: () => T.e1, t1: () => T.e2, M: s => [[1 + 2 * s, 0], [0, 1 + 2 * s]], k: 'e1', name: '例 1  伸缩 3 倍' },
    { t0: () => T.e2, t1: () => T.e3, M: s => [[1, 0], [0, 1 - s]], k: 'e2', name: '例 2  投影到 x₁ 轴' },
    { t0: () => T.e3, t1: () => T.e4, M: s => [[1, 0], [0, 1 - 2 * s]], k: 'e3', name: '例 3  关于 x₁ 轴反射' },
    { t0: () => T.e4, t1: () => T.four, M: s => rot(s * Math.PI / 2), k: 'e4', name: '例 4  逆时针转 90°' },
  ];
  function shotEx(D) {
    for (const e of EX) {
      const t0 = e.t0(), t1 = e.t1(), a = B.win(t0 - 0.2, t1 - 0.3); if (a <= 0) continue;
      const s = smoother(prog(B.t, t0 + 0.6, t0 + 2.4));
      const Pp = e.k === 'e1' ? P1 : Ps;
      B.warp(Pp, e.M(s), 1, a, D, { square: true, from: e.M(s) });
      ctag(e.name, DX, DY - 390, { px: 34, a, color: C.peri });
      texAt(e.k, DX, DY - 320, 46, { alpha: a * gin(t0 + 0.2) });
      if (e.k === 'e1') { texAt('lin1', DX, DY + 330, 38, { alpha: a * gin(T.e1v), reveal: rv(T.e1v, 1.4) }); ctag('线性 ✓', DX + 330, DY + 400, { px: 34, a: a * gin(T.e1v + 1.5), color: OK }); }
      if (e.k === 'e2') { ctag('压扁成一条直线', DX, DY + 300, { px: 32, a: a * gin(T.e2s), color: C.ink }); ctag('也算线性 ✓  平行等距、原点不动', DX, DY + 360, { px: 30, a: a * gin(T.e2v), color: OK }); }
      if (e.k === 'e3') ctag('上下翻面，像照镜子', DX, DY + 330, { px: 32, a: a * gin(t0 + 2.4), color: C.ink });
      if (e.k === 'e4') { ctag('î → ĵ', DX - 150, DY + 330, { px: 34, a: a * gin(T.e4i), color: C.i, font: F.serif }); ctag('ĵ → −î', DX + 150, DY + 330, { px: 34, a: a * gin(T.e4j), color: C.j, font: F.serif }); }
    }
    // 小结四宫格
    const a = B.win(T.four - 0.2, T.n6 - 0.3); if (a <= 0) return;
    ctag('四种动作，同一个规矩', DX, DY - 380, { px: 36, a, color: C.peri, font: F.serif });
    const names = ['伸缩', '投影', '反射', '旋转'], Ms = [[[1.5, 0], [0, 1.5]], [[1, 0], [0, 0]], [[1, 0], [0, -1]], rot(Math.PI / 2)];
    names.forEach((n, i) => {
      const x = DX + (i % 2 ? 200 : -200), y = DY - 140 + Math.floor(i / 2) * 330, g = a * gin(T.four + 0.3 * i);
      const Pm = new Plane({ ox: x, oy: y + 10, u: 34, R: 3 });
      B.card(x, y + 10, 300, 270, g, C.inkMid);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 148, y - 123, 296, 266); ctx.clip();
      Pm.grid(ctx, { M: I2, color: C.gridOld, width: 1, alpha: 0.12 * g }); Pm.grid(ctx, { M: Ms[i], color: C.gridNew, width: 2, alpha: 0.55 * g });
      ctx.restore();
      const O = Pm.S([0, 0], Ms[i]); arrow(ctx, O, Pm.S([1, 0], Ms[i]), { color: C.i, width: 6, head: 18, alpha: g }); arrow(ctx, O, Pm.S([0, 1], Ms[i]), { color: C.j, width: 6, head: 18, alpha: g });
      ctag(n, x, y - 95, { px: 30, a: g, color: C.ink });
    });
    ctag('平行等距 · 原点不动', DX, DY + 380, { px: 32, a: a * gin(cue('C16', '网格都保持')), color: OK });
  }

  // ── E：反例 1：范数 ──
  function shotNorm() {
    const a = B.win(T.n6 - 0.2, T.b1 - 0.3); if (a <= 0) return;
    ctag('反例 ①  例 6', DX, DY - 390, { px: 32, a, color: C.free });
    texAt('e6', DX, DY - 310, 46, { alpha: a * gin(T.n6 + 0.5) });
    const Pn = new Plane({ ox: DX - 210, oy: DY + 20, u: 62, R: 3 });
    ctx.save(); ctx.globalAlpha = a * 0.5; Pn.axes(ctx, { color: C.inkMid, width: 2 }); ctx.restore();
    const x = [2, 1.5];
    B.vec(Pn, x, a * gin(T.n6 + 1.0), { color: C.i, label: 'x', px: 32 });
    B.vec(Pn, [-x[0], -x[1]], a * gin(T.n6b), { color: C.j, label: '−x', px: 32, lx: -50, ly: 26 });
    // 数轴
    const y0 = DY + 20, x0 = DX + 250, len = 170; B.line2([x0 - 210, y0], [x0 + 220, y0], C.inkMid, a * gin(T.n6 + 1.0), 3);
    B.line2([x0, y0 - 12], [x0, y0 + 12], C.inkMid, a * gin(T.n6 + 1.0), 3); ctag('0', x0, y0 + 34, { px: 24, a: a * gin(T.n6 + 1.0), color: C.inkMid });
    B.dot(x0 + len, y0, 11, C.i, a * gin(T.n6 + 1.6)); ctag('M(x)', x0 + len, y0 - 40, { px: 28, a: a * gin(T.n6 + 1.6), color: C.i, font: F.serif });
    B.dot(x0 + len, y0, 7, C.j, a * gin(T.n6b + 0.5)); ctag('M(−x) 也在这', x0 + len, y0 - 82, { px: 26, a: a * gin(T.n6b + 0.5), color: C.j });
    B.dot(x0 - len, y0, 11, C.free, a * gin(T.n6b + 1.6)); ctag('−M(x)', x0 - len, y0 - 40, { px: 28, a: a * gin(T.n6b + 1.6), color: C.free, font: F.serif });
    texAt('e6b', DX, DY + 230, 44, { alpha: a * gin(T.n6b + 1.0) });
    B.stamp(DX + 300, DY + 340, false, prog(B.t, T.n6b + 2.0, T.n6b + 2.4), a, '✗ 非线性');
  }

  // ── F：反例 2：Test B 1(b) ──
  const fb = p => [p[0] * p[1] * 0.5, p[0]];
  function shotB1(D) {
    const a = B.win(T.b1 - 0.2, T.d5 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.b1c, T.b1c + 2.2));
    const scr = B.warpF(new Plane({ ox: DX, oy: DY + 80, u: 44, R: 6 }), fb, s, a * gin(T.b1c - 0.6), D, { neu: 0.6 });
    ctag('反例 ②  Test B 1(b)', DX, DY - 390, { px: 32, a, color: C.free });
    texAt('b1', DX, DY - 320, 46, { alpha: a * gin(T.b1 + 0.5) });
    ctag('乘积项 x₁x₂：警惕！', DX, DY - 250, { px: 32, a: a * gin(cue('C19', '一旦出现')) * (1 - gin(T.b1c)), color: C.free });
    texAt('b1b', DX, DY - 170, 44, { alpha: a * gin(T.b1b) * (1 - gin(T.b1c - 0.3)) });
    B.gbox('b1b', DX, DY - 170, 44, 'q', C.free, a * gin(T.b1b + 1.2) * (1 - gin(T.b1c)));
    ctag('放大 4 倍，不是 2 倍', DX, DY - 90, { px: 32, a: a * gin(T.b1b + 1.2) * (1 - gin(T.b1c)), color: C.free });
    ctag('横线 → 过原点的斜线：不再平行', DX, DY + 380, { px: 32, a: a * gin(T.b1c + 1.6), color: C.free });
    B.stamp(DX + 300, DY + 10, false, prog(B.t, T.b1b + 2.0, T.b1b + 2.4), a * (1 - gin(T.b1c - 0.3)), '✗ 非线性');
    void scr;
  }

  // ── G：平移 ──
  function shotTrans(D) {
    const a = B.win(T.d5 - 0.2, T.tj - 0.3); if (a <= 0) return;
    const av = [1.6, 1.1], s = smoother(prog(B.t, T.d5 + 1.0, T.d5 + 2.6)) ;
    const Pt = new Plane({ ox: DX - 40, oy: DY + 70, u: 62, R: 8 });
    ctx.save(); K2(D); Pt.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: 0.12 * a });
    Pt.axes(ctx, { color: C.inkMid, width: 2, alpha: 0.35 * a });
    const Pm = new Plane({ ox: Pt.ox + av[0] * Pt.u * s, oy: Pt.oy - av[1] * Pt.u * s, u: Pt.u, R: 8 }); Pm.grid(ctx, { M: I2, color: C.gridNew, width: 2.2, alpha: 0.55 * a }); Pm.axes(ctx, { color: C.ink, width: 3, alpha: 0.7 * a }); ctx.restore();
    ctag('平移：线还是直的、平行、等距……', DX, DY - 390, { px: 32, a: a * gin(T.d5) * (1 - gin(T.tr - 0.2)), color: C.ink });
    texAt('tr', DX, DY - 390, 46, { alpha: a * gin(T.tr) });
    const O = Pt.S([0, 0]), Oa = Pm.S([0, 0]);
    B.dot(O[0], O[1], 9, C.inkMid, a * gin(T.tr2)); B.dot(Oa[0], Oa[1], 13, C.peri, a * gin(T.tr2));
    arrow(ctx, O, Oa, { color: C.peri, width: 5, head: 18, alpha: a * gin(T.tr2), grow: gin(T.tr2, 0.6) });
    ctag('原点被拖到 a', Oa[0] + 120, Oa[1] - 30, { px: 30, a: a * gin(T.tr2 + 0.4), color: C.peri });
    if (gin(T.tr2) > 0) ringAt(Oa, T.tr2);
    const g = a * gin(T.L0); B.card(DX, DY - 290, 820, 90, g, C.peri);
    texAt('L0', DX, DY - 290, 42, { alpha: g, reveal: rv(T.L0, 1.6) });
    texAt('L0a', DX - 160, DY + 230, 44, { alpha: a * gin(T.L0b), color: C.free });
    B.stamp(DX + 230, DY + 230, false, prog(B.t, T.L0b, T.L0b + 0.4), a, '✗ 出局');
    const pa = a * gin(T.pit2); B.card(DX, DY + 335, 600, 70, pa, C.gpt); ctag('坑 → 4.2 节 图形学应用来填', DX, DY + 335, { px: 30, a: pa, color: C.gpt });
  }

  // ── H：同济对照 ──
  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济 第六章 §3', DX, DY - 330, { px: 38, a: a * gin(T.tj), color: C.gpt, font: F.serif });
    texAt('tjT', DX, DY - 210, 44, { alpha: a * gin(T.tj + 0.8) });
    ctag('定义相同：保持加法 + 保持数乘', DX, DY - 110, { px: 32, a: a * gin(T.tj + 1.6), color: C.ink });
    B.card(DX - 210, DY + 90, 360, 170, a * gin(T.tj2), C.gpt); B.card(DX + 210, DY + 90, 360, 170, a * gin(T.tj2 + 0.6), C.peri);
    ctag('同济', DX - 210, DY + 40, { px: 34, a: a * gin(T.tj2), color: C.gpt, font: F.serif }); ctag('Vₙ → Vₙ（自身）', DX - 210, DY + 110, { px: 32, a: a * gin(T.tj2), color: C.ink });
    ctag('英文教材', DX + 210, DY + 40, { px: 34, a: a * gin(T.tj2 + 0.6), color: C.peri, font: F.serif }); ctag('V → W；V = W 叫算子', DX + 210, DY + 110, { px: 30, a: a * gin(T.tj2 + 0.6), color: C.ink });
  }

  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    ctag('线性 = 保持线性组合', DX, DY - 220, { px: 36, a: a * gin(T.sum + 0.3), color: C.ink });
    ctag('几何：平行等距 · 原点不动', DX, DY - 130, { px: 36, a: a * gin(cue('C25', '几何上')), color: C.j });
    const g = a * gin(T.sum2); B.card(DX, DY + 20, 640, 110, g, OK); texAt('L0', DX, DY + 20, 34, { alpha: g, color: OK });
    ctag('最快的排除法：先看 L(0)', DX, DY + 120, { px: 30, a: g, color: OK });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('核与像', DX, DY - 20, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('ℝⁿ → ℝᵐ 的变换', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.fn - 0.2, t1: T.def - 0.3, head: '变换', items: [['= 函数', T.fn], ['= 网格的运动', T.mv2], ['线性：最规整', T.lin, { color: OK, mark: OK }]] },
    { t0: T.def - 0.3, t1: T.d2 - 0.3, head: '定义', items: [['保持线性组合', T.def2], ['① 加法', T.two, { color: C.i, mark: C.i }], ['② 标量乘法', T.two2, { color: C.j, mark: C.j }], ['V = W：算子', T.op2]] },
    { t0: T.d2 - 0.3, t1: T.e1 - 0.3, head: '几何判别', items: [['平行、等距', T.r1, { color: C.i, mark: C.i }], ['原点不动', T.r2, { color: C.peri, mark: C.peri }]] },
    { t0: T.e1 - 0.3, t1: T.n6 - 0.3, head: '四个例子', items: [['伸缩', T.e1], ['投影', T.e2], ['反射', T.e3], ['旋转', T.e4]] },
    { t0: T.n6 - 0.3, t1: T.tj - 0.3, head: '反例', items: [['范数', T.n6, { color: C.free, mark: C.free }], ['乘积项', T.b1, { color: C.free, mark: C.free }], ['平移', T.tr, { color: C.free, mark: C.free }], ['L(0) ≠ 0 → 出局', T.L0b]] },
    { t0: T.tj - 0.3, t1: T.sum - 0.3, head: '同济对照', items: [['记作 T', T.tj], ['仅讲 Vₙ → Vₙ', T.tj2]] },
    { t0: T.sum - 0.3, t1: T.end - 0.3, head: '小结', items: [['保持线性组合', T.sum], ['先看 L(0)', T.sum2, { color: OK, mark: OK }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotIntro(D); shotDef(); shotRule(D); shotEx(D); shotNorm(); shotB1(D); shotTrans(D); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
