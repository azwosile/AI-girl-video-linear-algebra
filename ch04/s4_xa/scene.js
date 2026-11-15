// 第 4 章 复习（上）判断题（Leon 9th Chapter 4 Test A，10 题全做）。
// 答案：1F 2T 3T 4F 5F 6T 7T 8T 9T 10F；大肥鱼 5 / 10（对 2、3、6、8、9）。
// 结构同 3.x：题卡 → 抢答气泡 → 判定印章 → 理由 / 最小反例（2D 网格、3D 平面）。左栏：大肥鱼答题卡（两列）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, LX, OK, I2, Plane, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_happy', 'ds_think', 'ds_proud', 'ds_confused'] };

export async function setup(R) {
  const QD = [
    [1, 'C02', 'D02', '对', false, 'C03', '像相同 ⇒ 输入相同？'],
    [2, 'C05', 'D03', '对', true, 'C06', '两个线性算子的和，还是线性算子？'],
    [3, 'C07', 'D04', '对', true, 'C08', '沿核的方向移动，输出不变？'],
    [4, 'C09', 'D05', '对', false, 'C10', '先转后反射 = 先反射后转？'],
    [5, 'C12', 'D06', '对', false, 'C13', '齐次坐标的向量构成子空间？'],
    [6, 'C15', 'D07', '对', true, 'C16', 'L 连做两次 ↔ A²？'],
    [7, 'C17', 'D08', '错', true, 'C18', '同一组基下矩阵相同 ⇒ 变换相同？'],
    [8, 'C20', 'D09', '对', true, 'C21', '能表示 L 的矩阵 = 与 A 相似的矩阵？'],
    [9, 'C22', 'D10', '对', true, 'C23', '相似可以传递？'],
    [10, 'C24', 'D11', '对', false, 'C25', '迹相同 ⇒ 相似？'],
  ];
  const pre = {}, post = {};
  QD.forEach(q => { pre[q[1]] = 0.8; pre[q[5]] = 0.3; post[q[5]] = 0.5; });
  Object.assign(post, { C04: 0.6, C11: 0.6, C14: 0.6, C19: 0.6, C26: 0.5, C27: 0.7, C29: 0.6, C30: 0.5 }); pre.D12 = 0.6;
  let QS;
  const B = base(R, { assets, label: '第四章 · 复习', title: '判断题 10 道', hi: 3, en: 'CHAPTER TEST A', titleEnd: () => QS[0].s, pre, post });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  QS = QD.map(([n, q, ds, ans, truth, v, zh]) => ({ n, q, ds, ans, truth, v, zh, key: 'q' + n }));
  QS.forEach((Q, i) => { Q.s = L(Q.q).s - 0.6; Q.da = L(Q.ds).s + 0.2; Q.vt = L(Q.v).s + 0.15; Q.e = i < QS.length - 1 ? L(QS[i + 1].q).s - 0.7 : L('D12').s - 0.4; Q.right = (Q.ans === '对') === Q.truth; });
  const T = {
    hi: cue('D01', '来考我'), rule: cue('C01', '永远成立'), ce: cue('C01', '反例'),
    q1b: L('C04').s, q4b: L('C11').s, q5b: L('C14').s, q7b: L('C19').s, q10b: L('C26').s, q10c: cue('C26', '再看行列式'), q10n: L('C27').s,
    sc: L('D12').s, sum: L('C28').s, s1: L('C29').s, s2: cue('C29', '第四题'), s3: cue('C29', '第五题'), s4: cue('C29', '第十题'), q7r: L('C30').s, d13: L('D13').s, next: L('C31').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.rule, 0.3); TL.sfx('pop', T.ce, 0.3);
  QS.forEach(Q => { TL.sfx('whoosh', Q.s, 0.3); TL.sfx('pop', Q.da + 0.3, 0.28); TL.sfx(Q.truth ? 'ding_hi' : 'stamp', Q.vt, 0.38); TL.sfx(Q.right ? 'sparkle' : 'buzz', Q.vt + 0.5, 0.2); });
  TL.sfx('pop', T.q1b, 0.3); TL.sfx('warp', L('C08').s + 0.6, 0.35); TL.sfx('pop', T.q4b, 0.3); TL.sfx('pop', T.q5b, 0.3); TL.sfx('pop', T.q10b, 0.3); TL.sfx('shimmer', T.q10n, 0.3);
  TL.sfx('ding_lo', T.sc + 0.3, 0.3); [T.s1, T.s2, T.s3, T.s4].forEach(x => TL.sfx('pluck', x, 0.25)); TL.sfx('bell_soft', T.q7r, 0.3); TL.sfx('shimmer', L('C31').e + 0.3, 0.4);

  const P3c = await load3D(); const P3 = new P3c(900, { R: 3 });
  const low = D => ({ x: D.x, y: D.y + 140, r: Math.max(0, D.r - 140) });
  const P = new Plane({ ox: DX, oy: DY + 170, u: 100, R: 6 });
  let DD = null;
  function grid2(a, D, ox, oy, u = 100) { DD = D; P.ox = ox; P.oy = oy; P.u = u; B.grid(P, I2, a, D, { old: 0.1, neu: 0.28, basis: false, clipY: DY - 20 }); }
  const vec2 = (v, col, a, label, w = 8, from = [0, 0]) => { if (a <= 0) return; const O = P.S(from), E = P.S(v); arrow(ctx, O, E, { color: col, width: w, head: 22, alpha: a }); if (label) ctag(label, E[0] + 34, E[1] - 18, { px: 28, a, color: col, font: F.serif }); };
  const clipLow = () => { if (DD) B.K.clip(DD); ctx.beginPath(); ctx.rect(0, DY - 20, 1920, 1080); ctx.clip(); };

  function drawIntro() {
    const a = 1 - gin(QS[0].s - 0.2, 0.5); if (a <= 0) return;
    ctag('网格 · î 和 ĵ · 核与像 · 交换图 · 相似', DX, DY - 120, { px: 36, a: a * gin(T.hi - 1.5, 0.5), color: C.inkMid });
    ctag('永远成立 → ✓ 对，给理由', DX, DY - 10, { px: 40, a: a * gin(T.rule, 0.5), color: OK });
    ctag('不一定成立 → ✗ 错，举反例', DX, DY + 80, { px: 40, a: a * gin(T.ce, 0.5), color: C.free });
    ctag('10 题全做', DX, DY + 180, { px: 30, a: a * gin(T.rule + 1.0), color: C.inkMid });
  }

  const BODY = {
    1: (a, Q, D) => { if (a <= 0) return;
      const ga = a * (1 - gin(T.q1b - 0.2, 0.4));
      if (ga > 0) {
        grid2(ga, D, DX - 120, DY + 380, 52);
        const s = smoother(prog(B.t, Q.vt + 1.6, Q.vt + 3.2));
        vec2([1, lerp(2, 0, s)], C.i, ga * gin(Q.vt + 0.8), s > 0.9 ? null : '(1, 2)'); vec2([1, lerp(5, 0, s)], C.j, ga * gin(Q.vt + 1.0), s > 0.9 ? null : '(1, 5)');
        ctx.save(); clipLow(); B.line2(P.S([1, -1]), P.S([1, 7]), C.free, ga * gin(Q.vt + 1.2) * 0.6, 3, [10, 8]); ctx.restore();
        B.dot(...P.S([1, 0]), 11, C.free, ga * s); ctag('都落到 (1, 0)', DX + 230, DY + 260, { px: 30, a: ga * s, color: C.free });
        ctag('投影 L(x) = (x₁, 0)ᵀ', DX + 230, DY + 60, { px: 30, a: ga * gin(Q.vt + 0.4), color: C.ink });
      }
      const g2 = a * gin(T.q1b - 0.2, 0.4); if (g2 > 0) {
        texAt('q1b', DX, DY + 40, 40, { alpha: g2 });
        B.card(DX, DY + 180, 700, 100, g2 * gin(cue('C04', '核里仅剩')), OK); ctag('仅当 ker(L) = {0}，才有 x₁ = x₂', DX, DY + 180, { px: 32, a: g2 * gin(cue('C04', '核里仅剩')), color: OK });
      } },
    2: (a, Q) => { if (a <= 0) return;
      ctag('代一个线性组合进去', DX, DY + 0, { px: 30, a, color: C.ink });
      texAt('q2b', DX, DY + 90, 30, { alpha: a * gin(Q.vt + 1.0), reveal: rv(Q.vt + 1.0, 2.5) });
      ctag('各自拆开 → 按 α、β 合并', DX, DY + 190, { px: 30, a: a * gin(cue('C06', '各自拆开')), color: OK }); },
    3: (a, Q, D) => { if (a <= 0) return;
      const g = a * (1 - gin(Q.vt + 0.6) * 0) ;
      texAt('q3b', DX + 210, DY + 40, 36, { alpha: g * gin(Q.vt - 0.5) });
      const gs = a * gin(L('C08').s); if (gs > 0) {
        grid2(gs, D, DX - 180, DY + 300, 80);
        ctx.save(); clipLow(); B.line2(P.S([1.5, -4]), P.S([1.5, 6]), C.free, gs * 0.7, 5); ctx.restore();
        const t = Math.sin((B.t - L('C08').s) * 1.3) * 1.6 + 1.2;
        vec2([1.5, t], C.i, gs, 'v + x'); B.dot(...P.S([1.5, 0]), 12, C.j, gs); ctag('L(v) 不动', ...P.S([1.5, -0.6]), { px: 28, a: gs, color: C.j });
        ctag('核的方向', DX + 220, DY + 200, { px: 30, a: gs, color: C.free }); ctag('信息全被压没', DX + 220, DY + 260, { px: 30, a: a * gin(cue('C08', '全被压没')), color: C.inkMid });
      } },
    4: (a, Q, D) => { if (a <= 0) return;
      grid2(a, D, DX - 60, DY + 200, 130);
      const h = Math.sqrt(3) / 2, g1 = a * gin(cue('C10', '先转后反射')), g2 = a * gin(cue('C10', '先反射后转'));
      vec2([1, 0], C.inkMid, a * 0.6, 'î', 5);
      vec2([0.5, -h], C.i, g1, null); { const E = P.S([0.5, -h]); ctag('FR：(½, −√3/2)', E[0] + 150, E[1] + 6, { px: 28, a: g1, color: C.i, font: F.serif }); } vec2([0.5, h], C.j, g2, 'RF：(½, √3/2)');
      const g3 = a * gin(T.q4b); B.card(DX + 260, DY + 40, 260, 90, g3, C.free); texAt('q4b', DX + 260, DY + 40, 44, { alpha: g3, color: C.free });
      ctag('4.2 节 Test B 第 6 题', DX + 260, DY + 110, { px: 24, a: g3, color: C.inkMid }); },
    5: (a, Q, D) => { if (a <= 0) return;
      const s = smoother(prog(B.t, T.q5b + 0.5, T.q5b + 1.8));
      P3.reset(); P3.setPlane(0, [0, 0, 1], { color: C.j, alpha: 0.3, scale: outCubic(prog(B.t, Q.vt + 0.3, Q.vt + 1.2)), d: 1 });
      P3.setPoint(0, [0, 0, 0], { r: 0.12, color: C.free });
      const V = B.show3D(P3, low(D), a, { el: 18, az: -55 + 6 * Math.sin(B.t * 0.3), dist: 14, axesA: 0.7, floorA: 0.3 });
      V.lab([0.5, -0.3, -0.35], '0 不在平面上', { px: 26, a: a * gin(Q.vt + 1.4), color: C.free });
      const u = [1, 0.4, 1], w = [-0.3, 1, 1], g = a * gin(T.q5b);
      V.v3([0, 0, 0], u, { color: C.i, alpha: g }); V.v3([0, 0, 0], w, { color: C.i, alpha: g });
      V.v3(u, [u[0] + w[0] * s, u[1] + w[1] * s, u[2] + w[2] * s], { color: C.free, alpha: g * gin(T.q5b + 0.5), width: 5 });
      if (s > 0.9) V.lab([u[0] + w[0] + 0.9, u[1] + w[1], 1.7], 'z = 2：跑出去了', { px: 26, a: g, color: C.free });
      texAt('q5b', DX - 200, DY + 330, 28, { alpha: a * gin(T.q5b), halo: C.disc });
      ctag('z = 1：不过原点', DX + 250, DY + 340, { px: 26, a: a * gin(Q.vt + 1.0), color: C.j }); },
    6: (a, Q) => { if (a <= 0) return;
      texAt('q6b', DX, DY + 30, 46, { alpha: a, reveal: rv(Q.vt + 0.5, 1.4) });
      ctag('复合 = 乘积；线性的复合还是线性', DX, DY + 150, { px: 32, a: a * gin(cue('C16', '线性变换的复合')), color: OK }); },
    7: (a, Q, D) => { if (a <= 0) return;
      texAt('q7b', DX, DY + 20, 34, { alpha: a * gin(Q.vt + 1.0) });
      ctag('矩阵相同 = 每个基向量去向相同', DX, DY + 110, { px: 30, a: a * gin(cue('C18', '矩阵相同')), color: C.ink });
      const g = a * gin(T.q7b); B.card(DX, DY + 230, 720, 110, g, OK); ctag('基向量的去向 → 决定一切', DX, DY + 210, { px: 34, a: g, color: OK }); ctag('“盯住 î 和 ĵ” 的一般版本', DX, DY + 255, { px: 26, a: g * gin(cue('C19', '这就是')), color: C.inkMid }); },
    8: (a, Q) => { if (a <= 0) return;
      ctag('⇒ 定理 4.3.1', DX - 230, DY + 10, { px: 30, a: a * gin(Q.vt + 0.6), color: C.ink });
      ctag('⇐ 用 S 的列当新基 F', DX + 200, DY + 10, { px: 30, a: a * gin(cue('C21', '反过来')), color: C.ink });
      texAt('q8b', DX, DY + 110, 32, { alpha: a * gin(cue('C21', '就用S的列')) }); },
    9: (a, Q) => { if (a <= 0) return;
      texAt('q9b', DX, DY + 40, 40, { alpha: a * gin(cue('C23', '代进去')), reveal: rv(cue('C23', '代进去'), 2.0) });
      ctag('两次换基 → 合成一次（TS）', DX, DY + 150, { px: 32, a: a * gin(cue('C23', '两次换基')), color: OK }); },
    10: (a, Q) => { if (a <= 0) return;
      texAt('q10a', DX, DY + 10, 36, { alpha: a * gin(cue('C25', '反例')) });
      texAt('q10b', DX - 160, DY + 110, 40, { alpha: a * gin(T.q10b) }); ctag('I 仅和自己相似', DX + 170, DY + 110, { px: 28, a: a * gin(T.q10b + 1.5), color: C.free });
      texAt('q10c', DX, DY + 190, 38, { alpha: a * gin(T.q10c), color: C.free });
      const g = a * gin(T.q10n); B.card(DX, DY + 300, 760, 100, g, C.peri); ctag('tr、det 相同：仅是必要条件 → 只能秒判“不相似”', DX, DY + 300, { px: 28, a: g, color: C.ink }); },
  };

  function drawQ(Q, D) {
    const a = B.win(Q.s, Q.e, 0.4, 0.35); if (a <= 0) return;
    BODY[Q.n](a * gin(Q.vt + 0.3, 0.5), Q, D);
    const g = gin(Q.s + 0.1, 0.5);
    ctag(`第 ${Q.n} 题`, DX, DY - 360, { px: 34, a: a * g, color: C.peri, font: F.serif });
    ctag(Q.zh, DX, DY - 305, { px: 28, a: a * g, color: C.inkMid });
    texAt(Q.key, DX, DY - 230, 40, { alpha: a * g, reveal: prog(B.t, Q.s + 0.2, L(Q.q).e - 0.3) });
    B.bubble(DX - 200, DY - 130, `大肥鱼：${Q.n === 4 ? '一样' : Q.ans}！`, a * gin(Q.da) * (1 - 0.6 * gin(Q.vt + 1.5)));
    B.stamp(DX + 250, DY - 135, Q.truth, prog(B.t, Q.vt - 0.05, Q.vt + 0.4), a * (1 - 0.5 * gin(Q.vt + 3)));
  }

  function drawEnd() {
    const a = B.win(T.sc, 1e9); if (a <= 0) return;
    const s1 = a * (1 - gin(T.next - 0.2, 0.4));
    ctag('5 / 10', DX, DY - 300, { px: 110, a: s1 * gin(T.sc + 0.2, 0.5), color: C.ds, font: F.serif });
    ctag('错题共同点：凭直觉，没找反例', DX, DY - 190, { px: 32, a: s1 * gin(cue('C28', '共同点')), color: C.peri });
    const items = [['第 1 题', '想投影', T.s1, C.i], ['第 4 题', '盯住 î', T.s2, C.j], ['第 5 题', '看原点', T.s3, C.k], ['第 10 题', '想单位矩阵', T.s4, C.free]];
    items.forEach(([h, b, t0, col], i) => { const x = DX + (i % 2 ? 200 : -200), y = DY - 80 + Math.floor(i / 2) * 100; B.card(x, y, 360, 84, s1 * gin(t0), col); ctag(h, x - 90, y, { px: 28, a: s1 * gin(t0), color: col }); ctag(b, x + 60, y, { px: 30, a: s1 * gin(t0), color: C.ink }); });
    B.card(DX, DY + 150, 720, 90, s1 * gin(T.q7r), OK); ctag('第 7 题：基向量的去向决定一切 —— 整章地基', DX, DY + 150, { px: 28, a: s1 * gin(T.q7r), color: OK });
    ctag('先想最简单的反例！', DX, DY + 260, { px: 36, a: s1 * gin(T.d13), color: C.ds, font: F.serif });
    const s2 = a * gin(T.next - 0.2, 0.4);
    ctag('下一节', DX, DY - 120, { px: 34, a: s2, color: C.inkMid });
    ctag('计算题 + 同济真题型', DX, DY - 20, { px: 80, a: s2 * gin(T.next + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('相似求参数', DX, DY + 90, { px: 36, a: s2 * gin(T.next + 0.8), color: C.ink });
  }

  function drawLeft() {
    const t = B.t, a = smooth(prog(t, QS[0].s, QS[0].s + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; B.K.head('大肥鱼答题卡', 210, 1, 1);
    QS.forEach((Q, i) => {
      if (t < Q.s - 0.2) return;
      const x = LX + 10 + Math.floor(i / 5) * 210, y = 270 + (i % 5) * 42, cur = t >= Q.s && t < Q.e;
      B.tag(`${Q.n}.`, x, y, { px: 26, a: cur ? 1 : 0.7, color: cur ? C.peri : C.inkMid });
      if (t > Q.da) B.tag(Q.ans, x + 50, y, { px: 26, a: 0.85, color: C.ds });
      if (t > Q.vt) { B.tag(Q.truth ? '真' : '假', x + 95, y, { px: 24, a: 0.85, color: Q.truth ? OK : C.free }); B.tag(Q.right ? '✓' : '✗', x + 140, y, { px: 28, a: gin(Q.vt + 0.4), color: Q.right ? OK : C.free }); }
    });
    if (t > T.sc) B.tag('5 / 10', LX + 330, 210, { px: 40, a: gin(T.sc + 0.3), color: C.ds, font: F.serif });
    ctx.restore();
  }

  function draw(t) {
    B.frame(t, D => { drawIntro(); QS.forEach(Q => drawQ(Q, D)); drawEnd(); drawLeft(); });
  }
  return { TL, draw };
}
