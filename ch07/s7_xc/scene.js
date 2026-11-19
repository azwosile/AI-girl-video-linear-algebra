// 第 7 章 复习（下）计算题 6–10 + 全课收尾（Leon 9th Chapter 7 Test B 第 6–10 题）：豪斯霍尔德与吉文斯、QR 与 RQ、幂法、伪逆最小范数解、豪斯霍尔德最小二乘。
// 分镜：(2, −2) 转到 (2√2, 0) → RQ = QᵀAQ → 幂法的 λ 估计在数轴上左右摆动收敛到 5 → U ᵀb → 只用非零 σ → x = A⁺b
//       → H₁、H₂ 两步得到 R 与 c，残差 = ‖(6/5, 8/5)‖ = 2 → 七章依次点亮的路线（全课回顾）→ 同济六章 → 第八、九章在网站上 → 完结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, Plane, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_happy', 'ds_proud', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 复习', title: '计算题（下）', hi: 3, en: 'CHAPTER TEST B · 6–10',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.8, C05: 0.8, C07: 0.8, C10: 0.8, C13: 0.8, C17: 1.0, G01: 0.6, C20: 0.6, C21: 0.8 },
    post: { C01: 0.6, C02: 0.8, C03: 1.4, C04: 1.4, C06: 1.4, C08: 1.4, C09: 1.4, C11: 1.4, C12: 1.4, C14: 1.6, C15: 1.6, C16: 1.4, C17: 1.2, C18: 1.0, C19: 1.0, G01: 1.0, C20: 1.0 },
    tail: 3.0,
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, p6: L('C02').s, p6b: L('C03').s, p6c: cue('C03', 'H乘x等于'), p6d: L('C04').s, p6e: cue('C04', '结果是'),
    p7: L('C05').s, p7b: L('C06').s, p7c: cue('C06', '正交相似'), p7d: cue('C06', '如果x是A的特征向量'), d1: L('D01').s,
    p8: L('C07').s, p8b: L('C08').s, p8c: cue('C08', '之后的最大分量'), p8d: L('C09').s, p8e: cue('C09', '精确值是五'), p8f: cue('C09', '收敛很快'),
    p9: L('C10').s, p9b: L('C11').s, p9c: cue('C11', 'y一是'), p9d: L('C12').s, p9e: cue('C12', '和零空间的方向正交'),
    p10: L('C13').s, p10b: L('C14').s, p10c: cue('C14', 'H一乘A'), p10d: L('C15').s, p10e: cue('C15', '得到R的上半部分'), p10f: L('C16').s, p10g: cue('C16', '残差就是'), d2: L('D02').s,
    fin: L('C17').s, fin2: cue('C17', '正文的最后一章'), rc1: L('C18').s, rc2: L('C19').s, d3: L('D03').s, tj: L('G01').s, web: L('C20').s, bye: L('C21').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); [T.p6, T.p7, T.p8, T.p9, T.p10].forEach(x => TL.sfx('whoosh', x, 0.3)); TL.sfx('ding_hi', T.p6c, 0.3); TL.sfx('warp', T.p6d + 0.5, 0.3); TL.sfx('ding', T.p6e, 0.3);
  TL.sfx('pop', T.p7b, 0.3); TL.sfx('ding', T.p7c, 0.3); TL.sfx('pluck', T.d1, 0.3); for (let k = 0; k < 5; k++) TL.sfx('marimba', T.p8b + 0.8 + k * 0.8, 0.18); TL.sfx('ding_hi', T.p8e, 0.3);
  TL.sfx('pop', T.p9b, 0.3); TL.sfx('pop', T.p9c, 0.3); TL.sfx('ding_hi', T.p9d, 0.3); TL.sfx('pop', T.p10c, 0.3); TL.sfx('pop', T.p10e, 0.3); TL.sfx('ding_hi', T.p10g, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('bell_soft', T.fin, 0.35); for (let k = 0; k < 7; k++) TL.sfx('marimba_hi', (k < 4 ? T.rc1 + 0.8 + k * 1.3 : T.rc2 + 0.6 + (k - 4) * 1.4), 0.2); TL.sfx('sparkle', T.d3, 0.3); TL.sfx('pop', T.tj, 0.3); TL.sfx('pop', T.web, 0.3); TL.sfx('shimmer', T.bye, 0.4); TL.sfx('riser', L('C21').e - 0.5, 0.3);

  const head = (n, title, a) => { ctag(`第 ${n} 题`, DX, DY - 395, { px: 32, a, color: C.peri, font: F.serif }); ctag(title, DX, DY - 345, { px: 26, a, color: C.inkMid }); };
  function shotIntro() {
    const a = B.win(T.o - 0.2, T.p6 - 0.3); if (a <= 0) return;
    ctag('后五道计算题', DX, DY - 120, { px: 50, a: a * gin(T.o + 0.6), color: C.peri, font: F.serif });
    ctag('然后：全课收尾', DX, DY - 20, { px: 36, a: a * gin(T.o + 1.4), color: C.ink });
  }

  // ── 第 6 题 ──
  const P6 = new Plane({ ox: DX + 170, oy: DY + 170, u: 55, R: 3.5 });
  function shot6() {
    const a = B.win(T.p6 - 0.2, T.p7 - 0.3); if (a <= 0) return;
    head(6, 'x = (1, 2, −2)：豪斯霍尔德与吉文斯', a);
    texAt('b6H', DX, DY - 260, 28, { alpha: a * gin(T.p6b), reveal: rv(T.p6b, 3.0) });
    const g = a * gin(T.p6d); if (g > 0) {
      texAt('b6G', DX, DY - 140, 26, { alpha: g * gin(T.p6e - 1.0) });
      ctag('只动第 2、3 个坐标', DX - 260, DY + 60, { px: 26, a: g, color: C.inkMid });
      B.line2(P6.S([-1, 0]), P6.S([3.4, 0]), C.inkMid, g * 0.5, 2); B.line2(P6.S([0, -2.6]), P6.S([0, 1]), C.inkMid, g * 0.5, 2);
      const th0 = Math.atan2(-2, 2), s = smoother(prog(B.t, T.p6d + 0.5, T.p6d + 2.0)), th = lerp(th0, 0, s), r = 2 * Math.SQRT2;
      B.vec(P6, [2, -2], g * 0.35, { color: C.ink, label: '(2, −2)', px: 24, ly: 24 }); B.vec(P6, [r * Math.cos(th), r * Math.sin(th)], g, { color: C.i, width: 7 });
      if (s > 0.95) B.tag('(2√2, 0)', P6.S([r, 0])[0] - 40, P6.S([r, 0])[1] - 28, { px: 26, a: g, color: C.i, font: F.serif });
      ctag('c = s = √2 / 2', DX - 260, DY + 120, { px: 28, a: g * gin(T.p6e - 1.0), color: C.i, font: F.serif });
    }
  }

  // ── 第 7 题 ──
  function shot7() {
    const a = B.win(T.p7 - 0.2, T.p8 - 0.3); if (a <= 0) return;
    head(7, 'A = QR，B = RQ：特征值、特征向量？', a);
    B.card(DX, DY - 230, 520, 90, a * gin(T.p7b), C.peri); texAt('b7', DX, DY - 230, 38, { alpha: a * gin(T.p7b) });
    ctag('正交相似 → 特征值相同', DX, DY - 130, { px: 32, a: a * gin(T.p7c), color: OK, font: F.serif });
    texAt('b7v', DX, DY - 30, 30, { alpha: a * gin(T.p7d) });
    ctag('这就是 QR 算法的每一步！', DX, DY + 90, { px: 30, a: a * gin(T.d1), color: C.ds });
  }

  // ── 第 8 题 ──
  const LAM = [7, 33 / 7, 167 / 33, 833 / 167, 4167 / 833];
  function shot8() {
    const a = B.win(T.p8 - 0.2, T.p9 - 0.3); if (a <= 0) return;
    head(8, '幂法迭代五次', a);
    texAt('b8', DX, DY - 260, 32, { alpha: a * gin(T.p8e - 0.4) });
    ctag('A = [1 2; 4 3]，u₀ = (1, 1)', DX, DY - 260, { px: 30, a: a * gin(T.p8) * (1 - gin(T.p8e - 0.6)), color: C.ink, font: F.serif });
    const g = a * gin(T.p8b); if (g > 0) {
      const X = B.axis(DX - 380, DX + 380, DY - 60, 4.5, 7.2, g, { ticks: [[4.5, '4.5'], [5, '5'], [6, '6'], [7, '7']] });
      B.line2([X(5), DY - 150], [X(5), DY + 20], OK, g * 0.6, 3, [8, 6]);
      LAM.forEach((v, k) => { const t0 = T.p8b + 0.8 + k * 0.8, gk = g * gin(t0), cur = k === LAM.length - 1 || B.t < T.p8b + 0.8 + (k + 1) * 0.8;
        B.dot(X(v), DY - 60 - (k % 2 ? 40 : -40) * 0, cur ? 12 : 7, cur ? C.peri : C.inkMid, gk * (cur ? 1 : 0.5));
        ctag(v.toFixed(k === 0 ? 0 : k === 4 ? 4 : 2), X(v), DY - 110 - k * 0, { px: 22, a: gk * (cur ? 1 : 0), color: C.peri, font: F.serif }); });
      const rows = [['k', '1', '2', '3', '4', '5'], ['λ ≈', '7', '4.71', '5.06', '4.99', '5.0024']];
      B.mat(DX, DY + 80, rows, g * gin(T.p8c), { cw: 120, ch: 50, px: 26, bracket: false, col: (i, j) => (i === 0 || j === 0 ? C.inkMid : C.peri) });
    }
    ctag('u₅ ≈ (0.4999, 1)　→　x₁ = (1, 2)', DX, DY + 190, { px: 28, a: a * gin(T.p8d), color: C.ink, font: F.serif });
    ctag('另一个 λ = −1，比值 ⅕：收敛很快', DX, DY + 250, { px: 28, a: a * gin(T.p8f), color: OK });
  }

  // ── 第 9 题 ──
  function shot9() {
    const a = B.win(T.p9 - 0.2, T.p10 - 0.3); if (a <= 0) return;
    head(9, '4 × 3，秩 2，b = (5, 1, −1, 9)，σ = 12, 6, 0', a);
    texAt('b9a', DX, DY - 250, 32, { alpha: a * gin(T.p9b), reveal: rv(T.p9b, 2.0) });
    ctag('σ₃ = 0 → y₃ 取 0', DX, DY - 170, { px: 28, a: a * gin(T.p9c + 1.5), color: C.inkMid });
    ctag('x = (7/12) v₁ − (1/6) v₂', DX, DY - 90, { px: 34, a: a * gin(T.p9d), color: C.ink, font: F.serif });
    ctag('v₁ = (2, 2, 1)/3，v₂ = (1, −2, 2)/3', DX, DY - 30, { px: 26, a: a * gin(T.p9d), color: C.inkMid, font: F.serif });
    B.card(DX, DY + 80, 520, 100, a * gin(T.p9d + 1.5), OK); texAt('b9x', DX, DY + 80, 34, { alpha: a * gin(T.p9d + 1.5) });
    ctag('⊥ 零空间 (−2, 1, 2)：离原点最近', DX, DY + 190, { px: 28, a: a * gin(T.p9e), color: C.k });
  }

  // ── 第 10 题 ──
  function shot10() {
    const a = B.win(T.p10 - 0.2, T.fin - 0.3); if (a <= 0) return;
    head(10, '豪斯霍尔德化上三角，求最小二乘解', a);
    texAt('b10A', DX, DY - 260, 28, { alpha: a * gin(T.p10) });
    ctag('α = −2，v₁ = (3, 1, 1, 1)，β = 6', DX, DY - 165, { px: 26, a: a * gin(T.p10b) * (1 - gin(T.p10d - 0.2)), color: C.inkMid, font: F.serif });
    texAt('b10H1', DX, DY - 60, 26, { alpha: a * gin(T.p10c) * (1 - gin(T.p10d - 0.2)) });
    ctag('第二步只看后三个：α = −3，β = 10', DX, DY - 165, { px: 26, a: a * gin(T.p10d), color: C.inkMid, font: F.serif });
    texAt('b10R', DX, DY - 60, 26, { alpha: a * gin(T.p10e) });
    const g = a * gin(T.p10f); if (g > 0) {
      ctag('−3x₂ = −1 → x₂ = ⅓；　−2x₁ − 3 = −7 → x₁ = 2', DX, DY + 80, { px: 26, a: g, color: C.ink, font: F.serif });
      B.card(DX, DY + 170, 640, 90, g * gin(T.p10g), OK); texAt('b10x', DX, DY + 170, 30, { alpha: g * gin(T.p10g) });
      ctag('与正规方程一致', DX, DY + 260, { px: 26, a: g * gin(T.p10g + 1.5), color: C.inkMid });
    }
  }

  // ── 全课收尾 ──
  const CH = [['1', '方程组与矩阵'], ['2', '行列式'], ['3', '向量空间'], ['4', '线性变换'], ['5', '正交与最小二乘'], ['6', '特征值'], ['7', '数值线性代数']];
  function shotFin() {
    const a = B.win(T.fin - 0.2, 1e9); if (a <= 0) return;
    const g0 = a * (1 - gin(T.tj - 0.2));
    ctag('第七章 · 完', DX, DY - 380, { px: 44, a: g0 * gin(T.fin), color: C.peri, font: F.serif });
    ctag('英文教材正文的最后一章', DX, DY - 320, { px: 28, a: g0 * gin(T.fin2), color: C.inkMid });
    const ts = [0, 1, 2, 3].map(k => T.rc1 + 0.8 + k * 1.3).concat([0, 1, 2].map(k => T.rc2 + 0.6 + k * 1.4));
    CH.forEach(([n, s], k) => {
      const ang = -Math.PI / 2 + k * 2 * Math.PI / 7, cx = DX + 250 * Math.cos(ang), cy = DY + 0 + 250 * Math.sin(ang), g = g0 * gin(ts[k]);
      if (k > 0) B.line2([DX + 250 * Math.cos(ang - 2 * Math.PI / 7), DY + 250 * Math.sin(ang - 2 * Math.PI / 7)], [cx, cy], C.peri, g * 0.6, 3);
      ctx.save(); ctx.globalAlpha = g; ctx.fillStyle = k === 6 ? C.peri : C.disc; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 46 * outBack(prog(B.t, ts[k], ts[k] + 0.4), 2), 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      ctag(n, cx, cy, { px: 40, a: g, color: k === 6 ? C.paperHi : C.peri, font: F.serif }); ctag(s, cx, cy + 70, { px: 24, a: g, color: C.ink });
    });
    const gl = g0 * gin(T.d3); if (gl > 0) B.line2([DX + 250 * Math.cos(-Math.PI / 2 + 6 * 2 * Math.PI / 7), DY + 250 * Math.sin(-Math.PI / 2 + 6 * 2 * Math.PI / 7)], [DX, DY - 250], C.peri, gl * 0.8, 4);
    ctag('从解方程组出发，又回到电脑上解方程组', DX, DY + 322, { px: 28, a: gl, color: C.ds });
    const g1 = a * gin(T.tj - 0.2) * (1 - gin(T.web - 0.2));
    ctag('同济六章：全部对照完', DX, DY - 300, { px: 36, a: g1, color: C.gpt, font: F.serif });
    ['行列式', '矩阵', '初等变换', '向量组', '相似与二次型', '线性空间'].forEach((s, i) => ctag(s, DX - 250 + (i % 3) * 250, DY - 190 + Math.floor(i / 3) * 80, { px: 32, a: g1 * gin(T.tj + 1.0 + i * 0.4), color: C.ink, font: F.serif }));
    ctag('考试按同济练 · 理解看英文教材和这套动画', DX, DY + 30, { px: 28, a: g1 * gin(cue('G01', '考试按同济练')), color: C.peri });
    const g2 = a * gin(T.web - 0.2) * (1 - gin(T.bye - 0.2));
    ctag('教材网站上还有', DX, DY - 260, { px: 32, a: g2, color: C.inkMid });
    B.card(DX - 210, DY - 150, 360, 100, g2 * gin(cue('C20', '第八章')), C.k); ctag('第八章 迭代法', DX - 210, DY - 150, { px: 32, a: g2 * gin(cue('C20', '第八章')), color: C.k, font: F.serif });
    B.card(DX + 210, DY - 150, 360, 100, g2 * gin(cue('C20', '第九章')), C.j); ctag('第九章 若尔当标准形', DX + 210, DY - 150, { px: 30, a: g2 * gin(cue('C20', '第九章')), color: C.j, font: F.serif });
    ctag('想看？评论区告诉我们', DX, DY - 20, { px: 32, a: g2 * gin(cue('C20', '评论区')), color: C.peri });
    const g3 = a * gin(T.bye - 0.2);
    ctag('AI 娘线性代数课', DX, DY - 240, { px: 40, a: g3, color: C.inkMid, font: F.serif });
    ctag('完结', DX, DY - 110, { px: 130, a: g3 * gin(T.bye + 0.6, 0.6), color: C.peri, font: F.serif });
    ctag('谢谢你，一路看到这里', DX, DY + 40, { px: 40, a: g3 * gin(cue('C21', '谢谢你')), color: C.ink, font: F.serif });
  }

  const SECS = [
    { t0: T.p6 - 0.2, t1: T.p9 - 0.3, head: '6 – 8 题', items: [['Hx = (−3, 0, 0)', T.p6c, { color: C.peri }], ['Gx = (1, 2√2, 0)', T.p6e, { color: C.i }], ['RQ = QᵀAQ', T.p7b, { color: OK }], ['λ₁ = 5，x₁ = (1, 2)', T.p8e]] },
    { t0: T.p9 - 0.2, t1: T.fin - 0.3, head: '9 – 10 题', items: [['只用非零 σ', T.p9c], ['x = (⅓, ½, 1/12)', T.p9d + 1.5, { color: OK }], ['R、c 两步得到', T.p10e, { color: C.peri }], ['x = (2, ⅓)，残差 2', T.p10g, { color: OK }]] },
    { t0: T.fin - 0.2, t1: 1e9, head: '全课', items: [['七章 · 完结', T.fin, { color: C.peri }]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotIntro(); shot6(); shot7(); shot8(); shot9(); shot10(); shotFin(); B.left(SECS); });
  }
  return { TL, draw };
}
