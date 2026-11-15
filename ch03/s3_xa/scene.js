// 第 3 章 复习（上）判断题（Leon 9th Chapter 3 Test A，15 题选 12 题；第 5、9、11 题顺带说明）。
// 答案：1T 2F 3F 4F 6T 7F 8T 10F 12F 13T 14F 15F；大肥鱼 4 / 12（对 1、8、12、13）。
// 结构同 2.x：题卡 → 抢答气泡 → 判定印章 → 理由 / 最小反例（2D 网格、3D 平面）。左栏：大肥鱼答题卡（两列）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, LX, OK, I2, Plane, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_happy', 'ds_think', 'ds_proud', 'ds_shock', 'ds_confused', 'gpt_point'] };

export async function setup(R) {
  const QD = [
    [1, 'C02', 'D02', '对', true, 'C03', 'S 是子空间 ⇒ S 是向量空间？'],
    [2, 'C04', 'D03', '对', false, 'C05', 'ℝ² 是 ℝ³ 的子空间？'],
    [3, 'C07', 'D04', '对', false, 'C08', 'ℝ³ 里两张平面只交于原点？'],
    [4, 'C10', 'D05', '对', false, 'C11', '子空间的并集还是子空间？'],
    [6, 'C13', 'D06', '错', true, 'C14', 'n 个向量张成 ℝⁿ ⇒ 线性无关？'],
    [7, 'C15', 'D08', '对', false, 'C16', 'n 个向量张成 V ⇒ 线性无关？'],
    [8, 'C17', 'D09', '对', true, 'C18', '去掉最后一个，张成不变 ⇒ 线性相关？'],
    [10, 'C19', 'D10', '对', false, 'C20', 'A 与 Aᵀ 的零化度相同？'],
    [12, 'C22', 'D11', '错', false, 'C23', '行变换不改列空间？'],
    [13, 'C24', 'D12', '对', true, 'C25', '加一个张成外的向量，仍然无关？'],
    [14, 'C26', 'D13', '对', false, 'C27', '过渡矩阵的复合'],
    [15, 'C28', 'D14', '对', false, 'C29', '秩相同 ⇒ 平方的秩相同？'],
  ];
  const pre = {}, post = {};
  QD.forEach(q => { pre[q[1]] = 0.8; pre[q[5]] = 0.3; post[q[5]] = 0.5; });
  Object.assign(post, { C06: 0.6, C09: 0.6, C12: 0.6, C21: 0.6, D15: 0.5, C31: 0.7 }); pre.D15 = 0.6;
  let QS;
  const B = base(R, { assets, label: '第三章 · 复习', title: '判断题 12 道', hi: 3, en: 'CHAPTER TEST A', titleEnd: () => QS[0].s, pre, post });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  QS = QD.map(([n, q, ds, ans, truth, v, zh]) => ({ n, q, ds, ans, truth, v, zh, key: 'q' + n }));
  QS.forEach((Q, i) => { Q.s = L(Q.q).s - 0.6; Q.da = L(Q.ds).s + 0.2; Q.vt = L(Q.v).s + 0.15; Q.e = i < QS.length - 1 ? L(QS[i + 1].q).s - 0.7 : L('D15').s - 0.4; Q.right = (Q.ans === '对') === Q.truth; });
  const T = {
    hi: cue('D01', '来考我'), rule: cue('C01', '永远成立'), ce: cue('C01', '反例'),
    q2b: L('C06').s, q3b: L('C09').s, q5: L('C12').s, q10b: L('C21').s, q15b: cue('C29', 'B等于'),
    sc: L('D15').s, sum: L('C30').s, s1: cue('C31', '第一'), s2: cue('C31', '第二'), s3: cue('C31', '第三'), tip: L('G01').s, next: L('C32').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.rule, 0.3); TL.sfx('pop', T.ce, 0.3);
  QS.forEach(Q => { TL.sfx('whoosh', Q.s, 0.3); TL.sfx('pop', Q.da + 0.3, 0.28); TL.sfx(Q.truth ? 'ding_hi' : 'stamp', Q.vt, 0.38); TL.sfx(Q.right ? 'sparkle' : 'buzz', Q.vt + 0.5, 0.2); });
  TL.sfx('warp', T.q2b + 0.3, 0.3); TL.sfx('warp', L('C08').s + 0.6, 0.35); TL.sfx('check', T.q5, 0.3); TL.sfx('ding_lo', T.sc + 0.3, 0.3);
  TL.sfx('pluck', T.s1, 0.25); TL.sfx('pluck', T.s2, 0.25); TL.sfx('pluck', T.s3, 0.25); TL.sfx('bell_soft', T.tip, 0.3); TL.sfx('shimmer', L('C32').e + 0.3, 0.4);

  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });
  const low = D => ({ x: D.x, y: D.y + 140, r: Math.max(0, D.r - 140) });
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  // 2D 小网格（只画在题卡下方、圆盘里）
  const P = new Plane({ ox: DX, oy: DY + 170, u: 100, R: 4 });
  let DD = null;
  function grid2(a, D, ox, oy, u = 100) { DD = D; P.ox = ox; P.oy = oy; P.u = u; B.grid(P, I2, a, D, { old: 0.1, neu: 0.28, basis: false, clipY: DY - 20 }); }
  const vec2 = (v, col, a, label, w = 8) => { if (a <= 0) return; const O = P.S([0, 0]), E = P.S(v); arrow(ctx, O, E, { color: col, width: w, head: 22, alpha: a }); if (label) ctag(label, E[0] + 30, E[1] - 18, { px: 30, a, color: col, font: F.serif }); };
  const line2 = (d, col, a, w = 5) => { const p = P.S([-d[0] * 6, -d[1] * 6]), q = P.S([d[0] * 6, d[1] * 6]); ctx.save(); if (DD) B.K.clip(DD); ctx.beginPath(); ctx.rect(0, DY - 20, 1920, 1080); ctx.clip(); B.line2(p, q, col, a, w); ctx.restore(); };

  function drawIntro() {
    const a = 1 - gin(QS[0].s - 0.2, 0.5); if (a <= 0) return;
    ctag('子空间 · 张成 · 基 · 维数 · 换基 · 秩', DX, DY - 120, { px: 38, a: a * gin(T.hi - 1.5, 0.5), color: C.inkMid });
    ctag('永远成立 → ✓ 对，给理由', DX, DY - 10, { px: 40, a: a * gin(T.rule, 0.5), color: OK });
    ctag('不一定成立 → ✗ 错，举反例', DX, DY + 80, { px: 40, a: a * gin(T.ce, 0.5), color: C.free });
    ctag('15 题选 12 题', DX, DY + 180, { px: 30, a: a * gin(T.rule + 1.0), color: C.inkMid });
  }

  const BODY = {
    1: (a, Q) => { if (a <= 0) return;
      ctag('加法、数乘封闭 ⇒', DX, DY - 10, { px: 30, a, color: C.ink });
      texAt('q1e', DX, DY + 70, 40, { alpha: a * gin(Q.vt + 2.5), reveal: rv(Q.vt + 2.5, 1.0) });
      ctag('其余公理：从 V 继承', DX, DY + 160, { px: 32, a: a * gin(Q.vt + 1.5), color: C.inkMid });
      ctag('八条全成立 ✓', DX, DY + 240, { px: 36, a: a * gin(L('C03').e - 1.0), color: OK }); },
    2: (a, Q, D) => { if (a <= 0) return;
      const s1 = a * (1 - gin(T.q2b - 0.2, 0.4)), s2 = a * gin(T.q2b - 0.2, 0.4);
      if (s1 > 0) { texAt('q2a', DX, DY + 60, 50, { alpha: s1, color: C.free }); ctag('两个分量  vs  三个分量：根本不是子集', DX, DY + 160, { px: 32, a: s1 * gin(Q.vt + 1.5), color: C.ink }); }
      if (s2 > 0) {
        P3.reset(); P3.setPlane(0, [0, 0, 1], { color: C.j, alpha: 0.35, scale: outCubic(prog(B.t, T.q2b, T.q2b + 0.9)) });
        P3.setLine(0, [2, 1, 0], { color: C.i, grow: smoother(prog(B.t, T.q2b + 0.8, T.q2b + 1.6)), half: 1 }); P3.setPoint(0, [0, 0, 0], { r: 0.08, color: C.ink });
        B.show3D(P3, low(D), s2, { el: 24, az: 35 + 6 * Math.sin(B.t * 0.3), dist: 14, axesA: 0.7, floorA: 0.3 });
        texAt('q2b', DX, DY - 10, 40, { alpha: s2 * gin(T.q2b + 0.4), color: C.j, halo: C.disc });
        ctag('xy 平面：长得像 ℝ²，但不是 ℝ² 本身', DX, DY + 340, { px: 30, a: s2 * gin(T.q2b + 1.5), color: C.j }); } },
    3: (a, Q, D) => { if (a <= 0) return;
      const s1 = a * (1 - gin(T.q3b - 0.2, 0.4)), s2 = a * gin(T.q3b - 0.2, 0.4);
      if (s1 > 0) {
        const th = 0.9 * Math.sin((B.t - Q.vt) * 0.7), n1 = [0.25, 0.1, 1], n2 = [Math.cos(th), Math.sin(th), 0.35];
        P3.reset(); P3.setPlane(0, n1, { color: C.i, alpha: 0.3 }); P3.setPlane(1, n2, { color: C.j, alpha: 0.3, scale: outCubic(prog(B.t, Q.vt + 0.3, Q.vt + 1.1)) });
        P3.setLine(0, cross(n1, n2), { color: C.free, width: 8, grow: smoother(prog(B.t, Q.vt + 1.0, Q.vt + 1.8)) }); P3.setPoint(0, [0, 0, 0], { r: 0.08, color: C.ink });
        B.show3D(P3, low(D), s1, { el: 20, az: 30, dist: 14, axesA: 0.6, floorA: 0.2 });
        ctag('怎么转，都交出一整条直线', DX, DY + 340, { px: 32, a: s1 * gin(Q.vt + 1.8), color: C.free }); }
      if (s2 > 0) {
        ctag('两组基：2 + 2 = 4 个向量', DX, DY + 0, { px: 32, a: s2, color: C.ink });
        ctag('ℝ³ 里 4 个向量 ⇒ 必线性相关', DX, DY + 60, { px: 32, a: s2 * gin(T.q3b + 1.0), color: C.peri });
        texAt('q3a', DX, DY + 170, 40, { alpha: s2 * gin(cue('C09', '分成两边')), reveal: rv(cue('C09', '分成两边'), 1.2) });
        ctag('左边在 S，右边在 T：同一个非零向量', DX, DY + 260, { px: 30, a: s2 * gin(cue('C09', '非零向量')), color: C.free }); } },
    4: (a, Q, D) => { if (a <= 0) return;
      const ga = a * (1 - 0.6 * gin(T.q5));
      grid2(ga, D, DX - 60, DY + 250, 95);
      line2([1, 0], C.i, ga * 0.8, 6); line2([0, 1], C.j, ga * 0.8, 6);
      const sv = gin(cue('C11', '跑出去了') - 1.6, 0.6);
      vec2([1, 0], C.i, ga * gin(Q.vt + 2.0), '(1,0)'); vec2([0, 1], C.j, ga * gin(Q.vt + 2.4), '(0,1)'); vec2([1, 1], C.free, ga * sv, '(1,1) ✗');
      texAt('q4a', DX + 230, DY + 120, 34, { alpha: ga * sv, halo: C.disc });
      if (gin(T.q5) > 0) { B.card(DX, DY - 30, 640, 110, a * gin(T.q5), OK); ctag('第 5 题：S ∩ T 一定是子空间 ✓', DX, DY - 50, { px: 32, a: a * gin(T.q5), color: OK }); ctag('交集：两边都封闭', DX, DY - 5, { px: 26, a: a * gin(T.q5 + 0.8), color: C.inkMid }); } },
    6: (a, Q) => { if (a <= 0) return;
      ctag('关键在个数', DX, DY - 10, { px: 34, a, color: C.peri });
      texAt('q6b', DX, DY + 70, 44, { alpha: a * gin(Q.vt + 1.5) });
      B.card(DX, DY + 200, 760, 110, a * gin(cue('C14', '定理')), C.j);
      ctag('定理 3.4.3：n 维空间里的 n 个向量', DX, DY + 180, { px: 30, a: a * gin(cue('C14', '定理')), color: C.ink });
      ctag('张成  ⇔  线性无关', DX, DY + 225, { px: 34, a: a * gin(cue('C14', '数量对了')), color: C.j }); },
    7: (a, Q, D) => { if (a <= 0) return;
      grid2(a, D, DX - 170, DY + 230, 100);
      const g = gin(cue('C16', '取e一'), 0.5);
      vec2([1, 0], C.i, a * g, 'e₁'); vec2([0, 1], C.j, a * g, 'e₂'); vec2([1, 1], C.peri, a * gin(cue('C16', '取e一') + 0.8), 'e₁ + e₂');
      ctag('V = ℝ²：3 个向量 > 2 维', DX + 200, DY + 20, { px: 30, a: a * gin(Q.vt + 1.0), color: C.free });
      texAt('q7a', DX + 200, DY + 110, 32, { alpha: a * gin(cue('C16', '线性相关')), halo: C.disc }); },
    8: (a, Q) => { if (a <= 0) return;
      ctag('最后一个在前面的张成里', DX, DY - 10, { px: 32, a, color: C.ink });
      texAt('q8a', DX, DY + 70, 40, { alpha: a * gin(Q.vt + 1.5), reveal: rv(Q.vt + 1.5, 1.0) });
      texAt('q8b', DX, DY + 170, 40, { alpha: a * gin(cue('C18', '移项')), reveal: rv(cue('C18', '移项'), 1.2), color: OK });
      ctag('系数 −1 ≠ 0 ⇒ 线性相关', DX, DY + 260, { px: 32, a: a * gin(cue('C18', '移项') + 1.4), color: OK }); },
    10: (a, Q) => { if (a <= 0) return;
      texAt('q9', DX, DY + 0, 40, { alpha: a, color: OK }); ctag('第 9 题：秩相同 ✓', DX, DY + 60, { px: 28, a, color: OK });
      texAt('q10a', DX, DY + 140, 48, { alpha: a * gin(cue('C20', '零化度')), color: C.free });
      texAt('q10b', DX, DY + 250, 40, { alpha: a * gin(T.q10b), reveal: rv(T.q10b, 1.4) }); },
    12: (a, Q, D) => { if (a <= 0) return;
      grid2(a, D, DX - 180, DY + 230, 100);
      line2([1, 1], C.j, a * gin(cue('C23', '直线')), 6); line2([1, 0], C.free, a * gin(cue('C23', '变成了x轴')), 6);
      vec2([1, 1], C.j, a * gin(cue('C23', '直线') - 0.5), 'A'); vec2([1, 0], C.free, a * gin(cue('C23', '变成了x轴') - 0.3), 'U');
      texAt('q12a', DX + 200, DY + 40, 36, { alpha: a * gin(Q.vt + 1.0), halo: C.disc });
      ctag('第 11 题：行空间才相同', DX + 200, DY + 160, { px: 30, a: a * gin(cue('C23', '第十一题')), color: OK }); },
    13: (a, Q) => { if (a <= 0) return;
      texAt('q13a', DX, DY + 20, 38, { alpha: a, reveal: rv(Q.vt + 0.6, 1.0) });
      ctag('新向量系数 ≠ 0 ⇒ 它能被前面表示：矛盾', DX, DY + 110, { px: 30, a: a * gin(cue('C25', '矛盾') - 0.8), color: C.free });
      texAt('q13b', DX, DY + 200, 40, { alpha: a * gin(cue('C25', '剩下的系数')), color: OK }); },
    14: (a, Q) => { if (a <= 0) return;
      texAt('q14a', DX, DY + 30, 44, { alpha: a, reveal: rv(cue('C27', 'v坐标'), 2.0) });
      texAt('q14b', DX, DY + 150, 50, { alpha: a * gin(cue('C27', '先做的')), color: C.free });
      ctag('先做的写在右边', DX, DY + 250, { px: 32, a: a * gin(cue('C27', '先做的') + 0.6), color: C.inkMid }); },
    15: (a, Q) => { if (a <= 0) return;
      texAt('q15a', DX - 80, DY + 40, 40, { alpha: a, reveal: rv(Q.vt + 0.5, 1.0) }); ctag('秩 1 → 0', DX + 260, DY + 40, { px: 32, a: a * gin(cue('C29', '零矩阵')), color: C.free });
      texAt('q15b', DX - 80, DY + 190, 40, { alpha: a * gin(T.q15b), reveal: rv(T.q15b, 1.0) }); ctag('秩 1 → 1', DX + 260, DY + 190, { px: 32, a: a * gin(T.q15b + 1.8), color: OK }); },
  };

  function drawQ(Q, D) {
    const a = B.win(Q.s, Q.e, 0.4, 0.35); if (a <= 0) return;
    BODY[Q.n](a * gin(Q.vt + 0.3, 0.5), Q, D);
    const g = gin(Q.s + 0.1, 0.5);
    ctag(`第 ${Q.n} 题`, DX, DY - 360, { px: 34, a: a * g, color: C.peri, font: F.serif });
    ctag(Q.zh, DX, DY - 305, { px: 28, a: a * g, color: C.inkMid });
    texAt(Q.key, DX, DY - 230, Q.n === 8 ? 36 : 44, { alpha: a * g, reveal: prog(B.t, Q.s + 0.2, L(Q.q).e - 0.3) });
    B.bubble(DX - 200, DY - 130, `大肥鱼：${Q.ans}！`, a * gin(Q.da) * (1 - 0.6 * gin(Q.vt + 1.5)));
    B.stamp(DX + 250, DY - 135, Q.truth, prog(B.t, Q.vt - 0.05, Q.vt + 0.4), a * (1 - 0.5 * gin(Q.vt + 3)));
  }

  function drawEnd() {
    const a = B.win(T.sc, 1e9); if (a <= 0) return;
    const s1 = a * (1 - gin(T.next - 0.2, 0.4));
    ctag('4 / 12', DX, DY - 280, { px: 110, a: s1 * gin(T.sc + 0.2, 0.5), color: C.ds, font: F.serif });
    const items = [['两条坐标轴', '专治并集', T.s1, C.i], ['个数 ≠ 维数', '专治“张成 ⇒ 无关”', T.s2, C.j], ['(1, 1)ᵀ / 幂零矩阵', '专治列空间和秩', T.s3, C.free]];
    ctag('反例三大来源', DX, DY - 150, { px: 34, a: s1 * gin(T.sum), color: C.peri });
    items.forEach(([h, b, t0, col], i) => { const y = DY - 60 + i * 100; B.card(DX, y, 680, 84, s1 * gin(t0), col); ctag(h, DX - 160, y, { px: 32, a: s1 * gin(t0), color: col }); ctag(b, DX + 150, y, { px: 30, a: s1 * gin(t0), color: C.ink }); });
    ctag('先在 ℝ²、ℝ³ 里画一画', DX, DY + 280, { px: 34, a: s1 * gin(T.tip), color: C.gpt });
    const s2 = a * gin(T.next - 0.2, 0.4);
    ctag('下一节', DX, DY - 120, { px: 34, a: s2, color: C.inkMid });
    ctag('期中真题', DX, DY - 20, { px: 96, a: s2 * gin(T.next + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  function drawLeft() {
    const t = B.t, a = smooth(prog(t, QS[0].s, QS[0].s + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; B.K.head('大肥鱼答题卡', 210, 1, 1);
    QS.forEach((Q, i) => {
      if (t < Q.s - 0.2) return;
      const x = LX + 10 + Math.floor(i / 6) * 210, y = 270 + (i % 6) * 42, cur = t >= Q.s && t < Q.e;
      B.tag(`${Q.n}.`, x, y, { px: 26, a: cur ? 1 : 0.7, color: cur ? C.peri : C.inkMid });
      if (t > Q.da) B.tag(Q.ans, x + 50, y, { px: 26, a: 0.85, color: C.ds });
      if (t > Q.vt) { B.tag(Q.truth ? '真' : '假', x + 95, y, { px: 24, a: 0.85, color: Q.truth ? OK : C.free }); B.tag(Q.right ? '✓' : '✗', x + 140, y, { px: 28, a: gin(Q.vt + 0.4), color: Q.right ? OK : C.free }); }
    });
    if (t > T.sc) B.tag('4 / 12', LX + 330, 210, { px: 40, a: gin(T.sc + 0.3), color: C.ds, font: F.serif });
    ctx.restore();
  }

  function draw(t) {
    B.frame(t, D => { drawIntro(); QS.forEach(Q => drawQ(Q, D)); drawEnd(); drawLeft(); });
  }
  return { TL, draw };
}
