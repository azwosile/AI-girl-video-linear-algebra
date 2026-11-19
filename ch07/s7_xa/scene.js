// 第 7 章 复习（上）判断题（Leon 9th Chapter 7 Test A 第 1–10 题）。
// 答案：1F 2F 3F 4T 5F 6F 7T 8F 9F 10F；大肥鱼 5 / 10（对 1、4、7、8、9）。
// 结构同 6.x：题卡 → 抢答气泡 → 判定印章 → 理由 / 最小反例（矩阵形状块、特征值分裂、1/ε 爆炸）。左栏：大肥鱼答题卡（两列）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, LX, OK } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_happy', 'ds_think', 'ds_proud', 'ds_confused'] };

export async function setup(R) {
  const QD = [
    [1, 'C02', 'D02', '错', false, 'C03', '浮点加法满足结合律？'],
    [2, 'C04', 'D03', '对', false, 'C05', 'A(BC) 与 (AB)C 运算量相同？'],
    [3, 'C07', 'D04', '对', false, 'C08', '稳定算法 ⇒ 解一定准？'],
    [4, 'C10', 'D05', '对', true, 'C11', '对称：稳定算法求 λ 误差小？'],
    [5, 'C12', 'D06', '对', false, 'C13', '非对称：稳定算法求 λ 误差也小？'],
    [6, 'C14', 'D07', '对', false, 'C15', '用 A⁻¹b 比 LU 更有效率？'],
    [7, 'C17', 'D08', '对', true, 'C18', '对称 ⇒ ‖A‖₁ = ‖A‖∞？'],
    [8, 'C19', 'D09', '错', false, 'C20', '‖A‖₂ = ‖A‖_F？'],
    [9, 'C21', 'D10', '错', false, 'C22', '最小二乘：四种方法都高精度？'],
    [10, 'C23', 'D11', '对', false, 'C24', 'A ≈ B ⇒ A⁺ ≈ B⁺？'],
  ];
  const pre = {}, post = {};
  QD.forEach(q => { pre[q[1]] = 0.8; pre[q[5]] = 0.3; post[q[5]] = 0.6; });
  Object.assign(post, { C01: 0.8, C06: 1.4, C09: 1.2, C13: 1.2, C16: 1.2, C20: 1.0, C22: 1.0, C25: 1.2, C26: 0.8 }); pre.D12 = 0.6;
  let QS;
  const B = base(R, { assets, label: '第七章 · 复习', title: '判断题 10 道', hi: 3, en: 'CHAPTER TEST A', titleEnd: () => QS[0].s, pre, post });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  QS = QD.map(([n, q, ds, ans, truth, v, zh]) => ({ n, q, ds, ans, truth, v, zh, key: 'q' + n }));
  QS.forEach((Q, i) => { Q.s = L(Q.q).s - 0.6; Q.da = L(Q.ds).s + 0.2; Q.vt = L(Q.v).s + 0.15; Q.e = i < QS.length - 1 ? L(QS[i + 1].q).s - 0.7 : L('D12').s - 0.4; Q.right = (Q.ans === '对') === Q.truth; });
  const T = {
    hi: cue('D01', '来考我'), rule: cue('C01', '永远成立'), ce: cue('C01', '反例'),
    q2b: cue('C05', '设A是一行n列'), q2c: L('C06').s, q2d: cue('C06', '先算B乘C'), q3b: L('C09').s, q5b: cue('C13', '还是那个矩阵'), q6b: L('C16').s, q8b: cue('C20', '一般来说'), q9b: cue('C22', '经典的施密特'),
    q10b: cue('C24', 'B的伪逆'), q10c: L('C25').s,
    sc: L('D12').s, sum: L('C26').s, s1: cue('C26', '运算顺序'), s2: cue('C26', '病态'), s3: cue('C26', '非对称敏感'), s4: cue('C26', '不求逆'), s5: cue('C26', '伪逆不连续'), next: L('C27').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.rule, 0.3); TL.sfx('pop', T.ce, 0.3);
  QS.forEach(Q => { TL.sfx('whoosh', Q.s, 0.3); TL.sfx('pop', Q.da + 0.3, 0.28); TL.sfx(Q.truth ? 'ding_hi' : 'stamp', Q.vt, 0.38); TL.sfx(Q.right ? 'sparkle' : 'buzz', Q.vt + 0.5, 0.2); });
  TL.sfx('pop', T.q2c, 0.3); TL.sfx('impact', T.q2d, 0.3); TL.sfx('pop', T.q3b, 0.3); TL.sfx('warp', T.q5b, 0.3); TL.sfx('pop', T.q6b, 0.3); TL.sfx('pop', T.q8b, 0.3); TL.sfx('pop', T.q9b, 0.3); TL.sfx('impact', T.q10b, 0.3); TL.sfx('crack', T.q10c, 0.3);
  TL.sfx('ding_lo', T.sc + 0.3, 0.3); [T.s1, T.s2, T.s3, T.s4, T.s5].forEach(x => TL.sfx('pluck', x, 0.25)); TL.sfx('shimmer', L('C27').e + 0.3, 0.4);

  const rect = (x, y, w, h, col, a, lb) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.35; ctx.fillStyle = col; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x - w / 2, y - h / 2, w, h); ctx.restore(); if (lb) ctag(lb, x, y + h / 2 + 24, { px: 24, a, color: col, font: F.serif }); };

  function drawIntro() {
    const a = 1 - gin(QS[0].s - 0.2, 0.5); if (a <= 0) return;
    ctag('浮点 · 消元 · 主元 · 范数 · 条件数 · 正交 · QR', DX, DY - 120, { px: 32, a: a * gin(T.hi - 1.5, 0.5), color: C.inkMid });
    ctag('永远成立 → ✓ 对，给理由', DX, DY - 10, { px: 40, a: a * gin(T.rule, 0.5), color: OK });
    ctag('不一定成立 → ✗ 错，举反例', DX, DY + 80, { px: 40, a: a * gin(T.ce, 0.5), color: C.free });
    ctag('10 题', DX, DY + 180, { px: 30, a: a * gin(T.rule + 1.0), color: C.inkMid });
  }

  const BODY = {
    1: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 640, 90, a, C.free); texAt('a1', DX, DY + 20, 34, { alpha: a }); ctag('第一节：小的数先加', DX, DY + 120, { px: 30, a, color: C.inkMid }); },
    2: (a) => { if (a <= 0) return; ctag('A：1 × n　B：n × 1　C：1 × n', DX, DY - 30, { px: 28, a: a * gin(T.q2b), color: C.ink, font: F.serif });
      const g1 = a * gin(T.q2c); rect(DX - 300, DY + 60, 160, 14, C.i, g1, 'AB = 数'); rect(DX - 160, DY + 60, 14, 14, OK, g1 * gin(T.q2c + 1.2), '2n');
      const g2 = a * gin(T.q2d), s = smoother(prog(B.t, T.q2d, T.q2d + 1.0)); rect(DX + 180, DY + 110, 160 * s + 14, 160 * s + 14, C.free, g2, 'BC：n × n');
      ctag('2n²', DX + 180, DY + 110, { px: 40, a: g2 * gin(T.q2d + 1.5), color: C.free, font: F.serif });
      texAt('a2', DX, DY + 260, 28, { alpha: a * gin(T.q2d + 2.0) }); },
    3: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 560, 90, a, C.free); texAt('a3', DX, DY + 20, 36, { alpha: a });
      ctag('希尔伯特 12 阶 + 部分主元：误差 0.28', DX, DY + 120, { px: 28, a, color: C.free });
      ctag('稳定管“小”，cond 谁也管不了', DX, DY + 190, { px: 28, a: a * gin(T.q3b), color: C.peri }); },
    4: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 620, 90, a, OK); texAt('a4', DX, DY + 20, 34, { alpha: a }); ctag('定理 7.6.1 + 正交对角化', DX, DY + 120, { px: 30, a, color: C.inkMid }); },
    5: (a) => { if (a <= 0) return; texAt('a5', DX, DY - 10, 34, { alpha: a });
      const s = smoother(prog(B.t, T.q5b, T.q5b + 1.0)), cy = DY + 160; B.line2([DX - 300, cy], [DX + 300, cy], C.inkMid, a * 0.5, 2);
      B.dot(DX - 180 * s, cy, 10, C.free, a); B.dot(DX + 180 * s, cy, 10, C.free, a); ctag('1', DX, cy + 34, { px: 26, a: a * (1 - s), color: C.ink });
      ctag('1 − 10⁻⁵', DX - 180, cy + 34, { px: 24, a: a * s, color: C.free, font: F.serif }); ctag('1 + 10⁻⁵', DX + 180, cy + 34, { px: 24, a: a * s, color: C.free, font: F.serif });
      ctag('扰动 10⁻¹⁰ → 放大 10⁵ 倍', DX, DY + 260, { px: 28, a: a * s, color: C.free }); },
    6: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 560, 90, a, C.free); texAt('a6', DX, DY + 20, 36, { alpha: a });
      ctag('一样多 · LU 更准', DX, DY + 120, { px: 30, a, color: C.ink }); ctag('求 A⁻¹ 本身 ≈ n³，是 LU 的三倍', DX, DY + 190, { px: 28, a: a * gin(T.q6b), color: C.peri }); },
    7: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 460, 90, a, OK); texAt('a7', DX, DY + 20, 38, { alpha: a }); ctag('Aᵀ = A', DX, DY + 120, { px: 32, a, color: OK, font: F.serif }); },
    8: (a) => { if (a <= 0) return; texAt('IF', DX, DY + 0, 36, { alpha: a }); texAt('a8', DX, DY + 100, 30, { alpha: a * gin(T.q8b) }); ctag('只有秩 1 时才相等', DX, DY + 190, { px: 30, a: a * gin(T.q8b + 1.5), color: C.peri }); },
    9: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 520, 90, a, C.free); texAt('a9', DX, DY + 20, 36, { alpha: a });
      ctag('正规方程多丢一倍位数', DX, DY + 120, { px: 28, a, color: C.free }); ctag('经典施密特可能失去正交性', DX, DY + 180, { px: 28, a: a * gin(T.q9b), color: C.free }); },
    10: (a) => { if (a <= 0) return; texAt('a10', DX, DY + 0, 32, { alpha: a * gin(T.q10b - 1.0) });
      const k = Math.min(3, Math.floor(Math.max(0, B.t - T.q10b) / 0.9));
      const eps = ['0.1', '0.01', '0.001', '0.0001'][k], inv = ['10', '100', '1000', '10000'][k];
      ctag(`ε = ${eps}　→　1/ε = ${inv}`, DX, DY + 110, { px: 34, a: a * gin(T.q10b), color: C.free, font: F.serif });
      ctag('秩突然变了：伪逆不连续', DX, DY + 190, { px: 30, a: a * gin(T.q10c), color: C.peri });
      ctag('→ 数值秩要设阈值', DX, DY + 250, { px: 26, a: a * gin(cue('C25', '要设一个阈值')), color: C.inkMid }); },
  };

  function drawQ(Q) {
    const a = B.win(Q.s, Q.e, 0.4, 0.35); if (a <= 0) return;
    BODY[Q.n](a * gin(Q.vt + 0.3, 0.5), Q);
    const g = gin(Q.s + 0.1, 0.5);
    ctag(`第 ${Q.n} 题`, DX, DY - 360, { px: 34, a: a * g, color: C.peri, font: F.serif });
    ctag(Q.zh, DX, DY - 305, { px: 28, a: a * g, color: C.inkMid });
    texAt(Q.key, DX, DY - 230, Q.n === 9 || Q.n === 10 ? 30 : 34, { alpha: a * g, reveal: prog(B.t, Q.s + 0.2, L(Q.q).e - 0.3) });
    B.bubble(DX - 200, DY - 130, `大肥鱼：${Q.ans}！`, a * gin(Q.da) * (1 - 0.6 * gin(Q.vt + 1.5)));
    B.stamp(DX + 250, DY - 135, Q.truth, prog(B.t, Q.vt - 0.05, Q.vt + 0.4), a * (1 - 0.5 * gin(Q.vt + 3)));
  }

  function drawEnd() {
    const a = B.win(T.sc, 1e9); if (a <= 0) return;
    const s1 = a * (1 - gin(T.next - 0.2, 0.4));
    ctag('5 / 10', DX, DY - 320, { px: 110, a: s1 * gin(T.sc + 0.2, 0.5), color: C.ds, font: F.serif });
    ctag('陷阱，就是知识点', DX, DY - 215, { px: 32, a: s1 * gin(T.sum), color: C.peri });
    const items = [['第 2 题', '运算顺序决定计算量', T.s1, C.i], ['第 3 题', '病态：稳定也救不了', T.s2, C.free], ['第 5 题', '非对称特征值敏感', T.s3, C.k], ['第 6 题', '不靠求逆解方程组', T.s4, C.j], ['第 10 题', '伪逆不连续', T.s5, C.peri]];
    items.forEach(([h, b, t0, col], i) => { const y = DY - 130 + i * 78; B.card(DX, y, 620, 66, s1 * gin(t0), col); ctag(h, DX - 210, y, { px: 26, a: s1 * gin(t0), color: col }); ctag(b, DX + 60, y, { px: 30, a: s1 * gin(t0), color: C.ink }); });
    const s2 = a * gin(T.next - 0.2, 0.4);
    ctag('下一段', DX, DY - 120, { px: 34, a: s2, color: C.inkMid });
    ctag('计算题', DX, DY - 20, { px: 90, a: s2 * gin(T.next + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('运算量 · 主元 · 条件数', DX, DY + 90, { px: 36, a: s2 * gin(T.next + 0.8), color: C.ink, font: F.serif });
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
    B.frame(t, () => { drawIntro(); QS.forEach(Q => drawQ(Q)); drawEnd(); drawLeft(); });
  }
  return { TL, draw };
}
