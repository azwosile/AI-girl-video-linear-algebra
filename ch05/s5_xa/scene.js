// 第 5 章 复习（上）判断题（Leon 9th Chapter 5 Test A，10 题全做）。
// 答案：1F 2F 3F 4F 5T 6F 7T 8T 9T 10F；大肥鱼 6 / 10（对 3、4、5、7、8、9）。
// 结构同 4.x：题卡 → 抢答气泡 → 判定印章 → 理由 / 最小反例（2D 投影、三根轴、3D 投影）。左栏：大肥鱼答题卡（两列）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, LX, OK, I2, Plane, arrow, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_happy', 'ds_think', 'ds_proud', 'ds_confused'] };

export async function setup(R) {
  const QD = [
    [1, 'C02', 'D02', '对', false, 'C03', '投影可以交换？'],
    [2, 'C05', 'D03', '对', false, 'C06', '两个单位向量，|xᵀy| = 1 ⇒ 无关？'],
    [3, 'C07', 'D04', '错', false, 'C08', '垂直可以传递？'],
    [4, 'C09', 'D05', '错', false, 'C10', '列空间里有非零 y 使 Aᵀy = 0？'],
    [5, 'C11', 'D06', '对', true, 'C12', 'AAᵀ 与 AᵀA 同秩？'],
    [6, 'C14', 'D07', '对', false, 'C15', '列相关 ⇒ 投影不唯一？'],
    [7, 'C16', 'D08', '对', true, 'C17', 'N(A) = {0} ⇒ 最小二乘解唯一？'],
    [8, 'C18', 'D09', '对', true, 'C19', '正交矩阵相乘还是正交矩阵？'],
    [9, 'C20', 'D10', '对', true, 'C21', 'UᵀU = Iₖ？'],
    [10, 'C22', 'D11', '对', false, 'C23', 'UUᵀ = Iₙ？'],
  ];
  const pre = {}, post = {};
  QD.forEach(q => { pre[q[1]] = 0.8; pre[q[5]] = 0.3; post[q[5]] = 0.5; });
  Object.assign(post, { C04: 0.8, C10: 0.6, C12: 0.8, C13: 0.6, C15: 0.8, C19: 0.6, C21: 0.5, C24: 0.8, C26: 0.6, C27: 0.7 }); pre.D12 = 0.6;
  let QS;
  const B = base(R, { assets, label: '第五章 · 复习', title: '判断题 10 道', hi: 3, en: 'CHAPTER TEST A', titleEnd: () => QS[0].s, pre, post });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  QS = QD.map(([n, q, ds, ans, truth, v, zh]) => ({ n, q, ds, ans, truth, v, zh, key: 'q' + n }));
  QS.forEach((Q, i) => { Q.s = L(Q.q).s - 0.6; Q.da = L(Q.ds).s + 0.2; Q.vt = L(Q.v).s + 0.15; Q.e = i < QS.length - 1 ? L(QS[i + 1].q).s - 0.7 : L('D12').s - 0.4; Q.right = (Q.ans === '对') === Q.truth; });
  const T = {
    hi: cue('D01', '来考我'), rule: cue('C01', '永远成立'), ce: cue('C01', '反例'),
    q1b: L('C04').s, q2b: cue('C06', '两个向量一定共线'), q5b: L('C13').s, q10b: L('C24').s,
    sc: L('D12').s, sum: L('C25').s, s1: L('C26').s, s2: cue('C26', '第二题'), s3: cue('C26', '第六题'), s4: cue('C26', '第十题'), tool: L('C27').s, d13: L('D13').s, next: L('C28').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.rule, 0.3); TL.sfx('pop', T.ce, 0.3);
  QS.forEach(Q => { TL.sfx('whoosh', Q.s, 0.3); TL.sfx('pop', Q.da + 0.3, 0.28); TL.sfx(Q.truth ? 'ding_hi' : 'stamp', Q.vt, 0.38); TL.sfx(Q.right ? 'sparkle' : 'buzz', Q.vt + 0.5, 0.2); });
  TL.sfx('pop', T.q1b, 0.3); TL.sfx('pop', T.q2b, 0.3); TL.sfx('warp', L('C08').s + 0.6, 0.35); TL.sfx('pop', T.q5b, 0.3); TL.sfx('whoosh', L('C23').s + 2.0, 0.3); TL.sfx('shimmer', T.q10b, 0.3);
  TL.sfx('ding_lo', T.sc + 0.3, 0.3); [T.s1, T.s2, T.s3, T.s4].forEach(x => TL.sfx('pluck', x, 0.25)); TL.sfx('bell_soft', T.tool, 0.3); TL.sfx('shimmer', L('C28').e + 0.3, 0.4);

  const P3c = await load3D(); const P3 = new P3c(900, { R: 3 });
  const low = D => ({ x: D.x, y: D.y + 140, r: Math.max(0, D.r - 140) });
  const P = new Plane({ ox: DX, oy: DY + 170, u: 100, R: 6 });
  let DD = null;
  function grid2(a, D, ox, oy, u = 100) { DD = D; P.ox = ox; P.oy = oy; P.u = u; B.grid(P, I2, a, D, { old: 0.1, neu: 0.28, basis: false, clipY: DY - 20 }); }
  const vec2 = (v, col, a, label, w = 8, from = [0, 0]) => { if (a <= 0) return; const O = P.S(from), E = P.S(v); arrow(ctx, O, E, { color: col, width: w, head: 22, alpha: a }); if (label) ctag(label, E[0] + 34, E[1] - 18, { px: 28, a, color: col, font: F.serif }); };

  function drawIntro() {
    const a = 1 - gin(QS[0].s - 0.2, 0.5); if (a <= 0) return;
    ctag('点积 · 投影 · 最小二乘 · 正交矩阵 · 施密特', DX, DY - 120, { px: 34, a: a * gin(T.hi - 1.5, 0.5), color: C.inkMid });
    ctag('永远成立 → ✓ 对，给理由', DX, DY - 10, { px: 40, a: a * gin(T.rule, 0.5), color: OK });
    ctag('不一定成立 → ✗ 错，举反例', DX, DY + 80, { px: 40, a: a * gin(T.ce, 0.5), color: C.free });
    ctag('10 题全做', DX, DY + 180, { px: 30, a: a * gin(T.rule + 1.0), color: C.inkMid });
  }

  const BODY = {
    1: (a, Q, D) => { if (a <= 0) return;
      const g2 = a * gin(Q.vt + 0.6); texAt('q1b', DX, DY - 40, 30, { alpha: g2 });
      const g = a * gin(T.q1b); if (g <= 0) return;
      grid2(g, D, DX - 200, DY + 330, 150);
      const X = [1, 1], Y = [1, 0];
      vec2(X, C.i, g, 'x = (1, 1)'); vec2(Y, C.j, g, 'y = (1, 0)', 8);
      const s = gin(T.q1b + 1.5, 1.0); B.proj(P, X, Y, g * s, { grow: s, pCol: C.peri });
      const s2 = gin(T.q1b + 3.0, 1.0); B.proj(P, Y, X, g * s2, { grow: s2, pCol: C.free, zCol: C.inkMid });
      ctag('x 投到 y：(1, 0)', DX + 260, DY + 160, { px: 28, a: g * s, color: C.peri }); ctag('y 投到 x：(½, ½)', DX + 260, DY + 220, { px: 28, a: g * s2, color: C.free });
    },
    2: (a, Q, D) => { if (a <= 0) return;
      texAt('q2b', DX, DY - 30, 36, { alpha: a * gin(Q.vt + 0.8) });
      const g = a * gin(T.q2b); if (g <= 0) return;
      grid2(g, D, DX - 60, DY + 260, 150);
      const th = 0.6, X = [Math.cos(th), Math.sin(th)]; vec2(X, C.i, g, 'x'); vec2(X.map(v => -v), C.j, g * gin(T.q2b + 0.8), 'y = −x');
      ctx.save(); B.K.clip(D); ctx.beginPath(); ctx.rect(0, DY - 20, 1920, 1080); ctx.clip(); B.line2(P.S(X.map(v => -v * 4)), P.S(X.map(v => v * 4)), C.inkMid, g * 0.5, 2, [8, 8]); ctx.restore();
      ctag('共线 → 线性相关', DX + 260, DY + 200, { px: 30, a: g * gin(T.q2b + 1.4), color: C.free });
    },
    3: (a, Q, D) => { if (a <= 0) return;
      const g = a * gin(L('C08').s); if (g <= 0) return;
      P3.reset(); P3.setLine(0, [1, 0, 0], { color: C.i, grow: gin(L('C08').s + 0.5, 0.6), width: 9 }); P3.setLine(1, [0, 1, 0], { color: C.j, grow: gin(L('C08').s + 1.2, 0.6) });
      const V = B.show3D(P3, low(D), g, { el: 22, az: -40 + 6 * Math.sin(B.t * 0.3), dist: 13, axesA: 0.4, floorA: 0.2 });
      V.lab([3.4, 0, 0.3], 'U = W = x 轴', { px: 28, a: g, color: C.i }); V.lab([0, 3.4, 0.3], 'V = y 轴', { px: 28, a: g * gin(L('C08').s + 1.2), color: C.j });
      ctag('U ⊥ V ✓   V ⊥ W ✓   U ⊥ W ✗', DX, DY - 40, { px: 32, a: a * gin(cue('C08', '可是U和W')), color: C.free, font: F.serif });
    },
    4: (a, Q) => { if (a <= 0) return;
      B.card(DX, DY + 20, 440, 90, a, OK); texAt('q4b', DX, DY + 20, 40, { alpha: a });
      ctag('y 要和自己正交 → yᵀy = 0 → y = 0', DX, DY + 130, { px: 30, a: a * gin(cue('C10', '它就要')), color: C.ink, font: F.serif });
    },
    5: (a, Q) => { if (a <= 0) return;
      texAt('q5b', DX, DY - 20, 30, { alpha: a * gin(cue('C12', '两边左乘')), reveal: rv(cue('C12', '两边左乘'), 2.5) });
      ctag('N(AᵀA) = N(A)', DX, DY + 70, { px: 34, a: a * gin(cue('C12', '于是')), color: OK, font: F.serif });
      const g = a * gin(T.q5b); B.card(DX, DY + 190, 840, 90, g, C.peri); texAt('q5c', DX, DY + 190, 28, { alpha: g });
      ctag('A → Aᵀ 同理', DX + 300, DY + 270, { px: 26, a: a * gin(cue('C13', '把A换成')), color: C.inkMid });
    },
    6: (a, Q, D) => { if (a <= 0) return;
      const g = a; P3.reset(); P3.setPlane(0, [0, 0, 1], { color: C.j, alpha: 0.3 });
      const bb = [1.6, 1.0, 1.8], pp = [1.6, 1.0, 0];
      P3.setPoint(0, pp, { r: 0.1, color: C.peri });
      const V = B.show3D(P3, low(D), g, { el: 24, az: -40 + 6 * Math.sin(B.t * 0.3), dist: 13, axesA: 0.4, floorA: 0 });
      V.v3([0, 0, 0], bb, { color: C.ink, alpha: g }); V.lab(bb.map(v => v * 1.1), 'b', { px: 30, a: g, color: C.ink, font: F.serif }); B.line2(V.pr(bb), V.pr(pp), C.free, g, 3, [8, 6]); V.lab([1.9, 1.3, -0.3], 'p 唯一', { px: 28, a: g, color: C.peri });
      // 三列相关：a₁、a₂、a₃ = a₁ + a₂（都在平面里）
      const cs = [[1.4, 0, 0], [0, 1.4, 0], [1.4, 1.4, 0]]; cs.forEach((c, i) => { V.v3([0, 0, 0], c, { color: [C.i, C.j, C.k][i], alpha: g * gin(Q.vt + 0.8 + i * 0.3), width: 5 }); });
      ctag('a₃ = a₁ + a₂：列相关', DX - 240, DY - 40, { px: 28, a: g * gin(Q.vt + 1.5), color: C.k });
      const gx = a * gin(cue('C15', '不唯一的是')); texAt('q6b', DX + 200, DY - 40, 32, { alpha: gx }); ctag('许多 x̂ → 同一个 p', DX + 200, DY + 20, { px: 26, a: gx, color: C.inkMid });
    },
    7: (a, Q) => { if (a <= 0) return;
      ctag('N(A) = {0} ⇔ rank A = n ⇔ 列无关', DX, DY - 10, { px: 32, a, color: C.ink, font: F.serif });
      ctag('⇒ AᵀA 可逆 ⇒ x̂ = (AᵀA)⁻¹Aᵀb', DX, DY + 70, { px: 32, a: a * gin(cue('C17', '定理五点三点二')), color: OK, font: F.serif });
    },
    8: (a, Q, D) => { if (a <= 0) return;
      texAt('q8b', DX, DY - 30, 34, { alpha: a, reveal: rv(Q.vt + 0.4, 2.5) });
      ctag('两个保长度的变换，复合还保长度', DX, DY + 60, { px: 30, a: a * gin(cue('C19', '几何上')), color: OK });
      // 小圆：转两下
      const g = a * gin(cue('C19', '几何上')); if (g > 0) { const O = [DX, DY + 230], r = 90, ang = (B.t - cue('C19', '几何上')) * 1.2; ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(...O, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); arrow(ctx, O, [O[0] + r * Math.cos(ang), O[1] - r * Math.sin(ang)], { color: C.peri, width: 6, head: 18, alpha: g }); arrow(ctx, O, [O[0] + r * Math.cos(ang * 0.4 + 2), O[1] - r * Math.sin(ang * 0.4 + 2)], { color: C.j, width: 6, head: 18, alpha: g }); }
    },
    9: (a, Q) => { if (a <= 0) return;
      texAt('q9b', DX, DY + 10, 40, { alpha: a * gin(Q.vt + 0.6) });
      ctag('i = j：1    i ≠ j：0', DX, DY + 110, { px: 32, a: a * gin(cue('C21', 'i等于j')), color: OK, font: F.serif });
    },
    10: (a, Q, D) => { if (a <= 0) return;
      const g1 = a * (1 - gin(T.q10b - 0.2));
      if (g1 > 0) {
        P3.reset(); P3.setPlane(0, [0, 0, 1], { color: C.j, alpha: 0.3 });
        const bb = [5, 3, 4].map(v => v * 0.38), dn = gin(cue('C23', 'U取e一') + 1.0, 1.2);
        P3.setPoint(0, [bb[0], bb[1], bb[2] * (1 - dn)], { r: 0.1, color: C.peri, alpha: dn });
        const V = B.show3D(P3, low(D), g1, { el: 24, az: -40 + 6 * Math.sin(B.t * 0.3), dist: 13, axesA: 0.45, floorA: 0 });
        V.v3([0, 0, 0], [1.3, 0, 0], { color: C.i, alpha: g1 }); V.v3([0, 0, 0], [0, 1.3, 0], { color: C.j, alpha: g1 }); V.lab([1.4, -0.3, 0.2], 'e₁', { px: 26, a: g1, color: C.i }); V.lab([-0.3, 1.4, 0.2], 'e₂', { px: 26, a: g1, color: C.j });
        V.v3([0, 0, 0], bb, { color: C.ink, alpha: g1 }); B.line2(V.pr(bb), V.pr([bb[0], bb[1], bb[2] * (1 - dn)]), C.free, g1 * dn, 3, [8, 6]);
        texAt('q10b', DX, DY - 40, 32, { alpha: g1 * gin(cue('C23', 'U取e一') + 2.0) });
        ctag('k < n：UUᵀ 是投影矩阵', DX, DY + 360, { px: 28, a: g1 * gin(Q.vt + 1.0), color: C.peri });
      }
      const g2 = a * gin(T.q10b - 0.2); if (g2 > 0) {
        B.card(DX, DY + 40, 720, 100, g2, C.peri); ctag('仅当 k = n（U 是方阵）：UUᵀ = I', DX, DY + 40, { px: 32, a: g2, color: C.peri, font: F.serif });
        ctag('第 9、10 题：矩阵乘法不交换', DX, DY + 160, { px: 32, a: a * gin(cue('C24', '第九、第十题')), color: OK });
      }
    },
  };

  function drawQ(Q, D) {
    const a = B.win(Q.s, Q.e, 0.4, 0.35); if (a <= 0) return;
    BODY[Q.n](a * gin(Q.vt + 0.3, 0.5), Q, D);
    const g = gin(Q.s + 0.1, 0.5);
    ctag(`第 ${Q.n} 题`, DX, DY - 360, { px: 34, a: a * g, color: C.peri, font: F.serif });
    ctag(Q.zh, DX, DY - 305, { px: 28, a: a * g, color: C.inkMid });
    texAt(Q.key, DX, DY - 230, Q.n === 2 || Q.n === 6 || Q.n === 8 ? 30 : 38, { alpha: a * g, reveal: prog(B.t, Q.s + 0.2, L(Q.q).e - 0.3) });
    B.bubble(DX - 200, DY - 130, `大肥鱼：${Q.ans}！`, a * gin(Q.da) * (1 - 0.6 * gin(Q.vt + 1.5)));
    B.stamp(DX + 250, DY - 135, Q.truth, prog(B.t, Q.vt - 0.05, Q.vt + 0.4), a * (1 - 0.5 * gin(Q.vt + 3)));
  }

  function drawEnd() {
    const a = B.win(T.sc, 1e9); if (a <= 0) return;
    const s1 = a * (1 - gin(T.next - 0.2, 0.4));
    ctag('6 / 10', DX, DY - 300, { px: 110, a: s1 * gin(T.sc + 0.2, 0.5), color: C.ds, font: F.serif });
    ctag('错题共同点：把公式当成对称的、可交换的', DX, DY - 190, { px: 30, a: s1 * gin(cue('C25', '错题的共同点')), color: C.peri });
    const items = [['第 1 题', '投影有方向', T.s1, C.i], ['第 2 题', '等号 ⇒ 共线', T.s2, C.j], ['第 6 题', 'p 唯一，x̂ 不唯一', T.s3, C.k], ['第 10 题', 'UUᵀ 是投影', T.s4, C.free]];
    items.forEach(([h, b, t0, col], i) => { const x = DX + (i % 2 ? 210 : -210), y = DY - 80 + Math.floor(i / 2) * 100; B.card(x, y, 400, 84, s1 * gin(t0), col); ctag(h, x - 120, y, { px: 26, a: s1 * gin(t0), color: col }); ctag(b, x + 50, y, { px: 28, a: s1 * gin(t0), color: C.ink }); });
    B.card(DX, DY + 150, 720, 90, s1 * gin(T.tool), OK); texAt('tool', DX + 120, DY + 150, 32, { alpha: s1 * gin(T.tool) }); ctag('第 4、5 题工具：', DX - 230, DY + 150, { px: 26, a: s1 * gin(T.tool), color: OK });
    ctag('先画图，再下判断！', DX, DY + 260, { px: 36, a: s1 * gin(T.d13), color: C.ds, font: F.serif });
    const s2 = a * gin(T.next - 0.2, 0.4);
    ctag('下一节', DX, DY - 120, { px: 34, a: s2, color: C.inkMid });
    ctag('计算题 + 同济题型', DX, DY - 20, { px: 80, a: s2 * gin(T.next + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('QR · 投影矩阵 · 施密特', DX, DY + 90, { px: 36, a: s2 * gin(T.next + 0.8), color: C.ink });
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
    if (t > T.sc) B.tag('6 / 10', LX + 330, 210, { px: 40, a: gin(T.sc + 0.3), color: C.ds, font: F.serif });
    ctx.restore();
  }

  function draw(t) {
    B.frame(t, D => { drawIntro(); QS.forEach(Q => drawQ(Q, D)); drawEnd(); drawLeft(); });
  }
  return { TL, draw };
}
