// 第 7 章 7.1 电脑里的数（上）（Leon 9th §7.1：浮点数定义、例 1 规格化、例 3 五十五个数、表 1 误差、例 4 二进制、例 5 运算舍入、机器精度、IEEE 754 例 7）。
// 分镜：π 的数位被截断 → 浮点数定义 → 3B1B：55 个浮点数撒在数轴上（零附近挤、外面稀、1 和 2 之间空）→ 1.5 往哪舍
//       → 绝对 / 相对误差表 → 0.31 反复乘二的流水 → 2634.46 被砍成 2630 → ε：1 附近的“吸附区” → 32 位比特格子（例 7 = 17.5）→ 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_confused', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.1 电脑里的数', hi: 3, en: 'NUMERICAL LINEAR ALGEBRA',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C06: 0.6, C08: 0.4, C10: 0.6, C12: 0.6, C14: 0.6, C17: 0.6, G01: 0.6, C20: 0.6 },
    post: { C01: 0.6, C02: 0.8, C04: 1.0, C05: 1.0, C06: 0.6, C07: 1.2, C09: 1.2, C11: 1.4, C13: 1.0, C15: 1.0, C16: 0.8, C18: 1.2, C19: 0.8, G01: 0.6, C20: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, q: cue('C01', '计算机到底'), ex: L('C02').s, ex2: cue('C02', '有限的位数'), ex3: cue('C02', '都要舍入'), d1: L('D01').s, c3: L('C03').s, c3b: cue('C03', '整个毁掉'),
    df: L('C04').s, df2: cue('C04', 't是数字的位数'), df3: cue('C04', '指数，被限制'), e1: L('C05').s, e1b: cue('C05', '零点零零一一二'), e1c: cue('C05', '叫作规格化'),
    e3: L('C06').s, e3b: cue('C06', '五十五个'), e3c: cue('C06', '画在数轴上'), e3d: L('C07').s, e3e: cue('C07', '十八个'), e3f: cue('C07', '三十六个'), e3g: cue('C07', '一个都没有'),
    d2: L('D02').s, er: L('C08').s, er2: cue('C08', '叫绝对误差'), er3: cue('C08', '叫相对误差'), er4: cue('C08', '错了百分之几'), tb: L('C09').s, tb2: cue('C09', '派存成'),
    bi: L('C10').s, bi2: cue('C10', '一零一一'), bi3: cue('C10', '反复乘二'), bs: L('C11').s, bs2: cue('C11', '下一位还是一'), bs3: cue('C11', '十一点三一二五'),
    op: L('C12').s, op2: cue('C12', '精确的和'), op3: cue('C12', '只剩两千六百三十'), mu: L('C13').s, mu2: cue('C13', '和的相对误差'), mu3: cue('C13', 'f l'),
    ep: L('C14').s, ep2: cue('C14', '最小的浮点数'), e3x: L('C15').s, e3y: cue('C15', '一加零点零零五'), e3z: cue('C15', '一般地'), dl: L('C16').s, d3: L('D03').s,
    ie: L('C17').s, ie2: cue('C17', '一位符号'), ie3: cue('C17', '首位一定是一'), x7: L('C18').s, x7b: cue('C18', '指数位是一百三十一'), x7c: cue('C18', '尾数是'), x7d: cue('C18', '等于十七点五'),
    db: L('C19').s, db2: cue('C19', '二的负五十二次方'), db3: cue('C19', '十六位十进制'), tj: L('G01').s, sum: L('C20').s, end: L('C21').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.q, 0.3); TL.sfx('glitch', T.ex3, 0.3); TL.sfx('crack', T.c3b, 0.3);
  TL.sfx('sting', T.df, 0.3); TL.sfx('pop', T.df2, 0.25); TL.sfx('pop', T.e1, 0.3); TL.sfx('ding', T.e1c, 0.3);
  TL.sfx('whoosh', T.e3c, 0.3); for (let k = 0; k < 6; k++) TL.sfx('marimba', T.e3c + 0.3 + k * 0.18, 0.15); TL.sfx('pop', T.e3e, 0.3); TL.sfx('pop', T.e3f, 0.3); TL.sfx('ding_lo', T.e3g, 0.3);
  TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.er2, 0.3); TL.sfx('pop', T.er3, 0.3); TL.sfx('pop', T.tb, 0.3); TL.sfx('pop', T.tb2, 0.3);
  TL.sfx('pop', T.bi2, 0.3); for (let k = 0; k < 6; k++) TL.sfx('click', T.bs + k * 1.2, 0.2); TL.sfx('ding_hi', T.bs3, 0.3);
  TL.sfx('pop', T.op2, 0.3); TL.sfx('crack', T.op3, 0.3); TL.sfx('pop', T.mu, 0.3); TL.sfx('sting', T.ep, 0.3); TL.sfx('pop', T.e3x, 0.3); TL.sfx('ding', T.e3y, 0.3); TL.sfx('pop', T.dl, 0.3);
  TL.sfx('pluck', T.d3, 0.3); TL.sfx('whoosh', T.ie, 0.3); TL.sfx('pop', T.ie2, 0.3); TL.sfx('pop', T.x7b, 0.3); TL.sfx('pop', T.x7c, 0.3); TL.sfx('ding_hi', T.x7d, 0.3); TL.sfx('pop', T.db2, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C21').e + 0.3, 0.4);

  // ── A：开场 + π 被截断 + 浮点数定义 ──
  const PI = '3.14159265358979323846';
  function shotA() {
    const a = B.win(T.o - 0.2, T.e3 - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.df - 0.2));
    ctag('λ = ?    σ = ?', DX, DY - 330, { px: 60, a: g0 * gin(T.o + 0.3) * (1 - gin(T.ex - 0.2)), color: C.peri, font: F.serif });
    ctag('计算机到底怎么算？', DX, DY - 240, { px: 36, a: g0 * gin(T.q) * (1 - gin(T.ex - 0.2)), color: C.ink });
    // π 的数位：先完整，再被截到 t 位
    const gp = g0 * gin(T.ex); if (gp > 0) {
      const keep = Math.round(lerp(PI.length, 6, smoother(prog(B.t, T.ex2, T.ex2 + 1.6))));
      ctag('精确：', DX - 380, DY - 140, { px: 30, a: gp, color: C.inkMid });
      B.digits(DX + 40, DY - 140, PI, gp, { px: 46, cw: 34, dim: k => (k < keep ? 1 : 0.18), col: k => (k < keep ? C.ink : C.free) });
      ctag('电脑：', DX - 380, DY - 40, { px: 30, a: gp * gin(T.ex3), color: C.inkMid });
      B.digits(DX + 40, DY - 40, '3.1416', gp * gin(T.ex3), { px: 46, cw: 34, align: 'c', col: k => (k === 5 ? C.peri : C.ink) });
      ctag('每一步都舍入', DX, DY + 60, { px: 34, a: gp * gin(T.ex3), color: C.peri, font: F.serif });
      ctag('一点点 → 有时毁掉整个答案', DX, DY + 150, { px: 32, a: gp * gin(T.c3b), color: C.free });
    }
    const g1 = a * gin(T.df - 0.2); if (g1 <= 0) return;
    ctag('浮点数', DX, DY - 380, { px: 38, a: g1, color: C.peri, font: F.serif });
    B.card(DX, DY - 280, 900, 120, g1, C.peri); texAt('fdef', DX, DY - 280, 40, { alpha: g1, reveal: rv(T.df, 2.0) });
    texAt('fdig', DX, DY - 170, 32, { alpha: g1 * gin(T.df3) });
    ctag('β 进制 · t 位数字 · 指数有范围', DX, DY - 100, { px: 28, a: g1 * gin(T.df2), color: C.inkMid });
    texAt('ex1', DX, DY + 0, 36, { alpha: g1 * gin(T.e1) });
    texAt('norm', DX, DY + 110, 36, { alpha: g1 * gin(T.e1b) });
    ctag('没有前导零 = 规格化', DX, DY + 200, { px: 32, a: g1 * gin(T.e1c), color: C.peri });
  }

  // ── B：例 3 的 55 个数 ──
  const FL = [0]; for (const e of [-1, 0, 1]) for (let d = 1; d <= 9; d++) { const v = d / 10 * 10 ** e; FL.push(+v.toFixed(3), -(+v.toFixed(3))); }
  function shotB() {
    const a = B.win(T.e3 - 0.2, T.er - 0.3); if (a <= 0) return;
    ctag('β = 10，t = 1，指数 −1 ~ 1', DX, DY - 380, { px: 34, a: a * gin(T.e3), color: C.ink, font: F.serif });
    ctag('一共 55 个数', DX, DY - 320, { px: 34, a: a * gin(T.e3b), color: C.peri });
    const g = a * gin(T.e3c - 0.1); if (g <= 0) return;
    const X = B.axis(DX - 430, DX + 430, DY - 160, -9.5, 9.5, g, { ticks: [[-9, '−9'], [-5, '−5'], [-1, '−1'], [0, '0'], [1, '1'], [2, '2'], [5, '5'], [9, '9']] });
    FL.forEach((v, k) => { const s = gin(T.e3c + 0.3 + (k % 18) * 0.06, 0.3); B.dot(X(v), DY - 160, 6, Math.abs(v) < 0.1 ? C.i : Math.abs(v) < 1 ? C.j : C.peri, g * s); });
    // 放大 [0, 1]
    const gz = g * gin(T.e3d - 0.2); if (gz > 0) {
      const Z = B.axis(DX - 400, DX + 400, DY + 20, 0, 1.0, gz, { ticks: [[0, '0'], [0.1, '0.1'], [0.5, '0.5'], [1, '1']] });
      FL.filter(v => v >= 0 && v <= 1).forEach(v => B.dot(Z(v), DY + 20, 7, v < 0.1 ? C.i : C.j, gz));
      B.line2([X(0), DY - 150], [DX - 400, DY + 10], C.inkMid, gz * 0.4, 2, [6, 6]); B.line2([X(1), DY - 150], [DX + 400, DY + 10], C.inkMid, gz * 0.4, 2, [6, 6]);
      ctag('放大 0 ~ 1', DX, DY - 60, { px: 26, a: gz, color: C.inkMid });
      ctag('|x| < 0.1：18 个', DX - 200, DY + 110, { px: 30, a: gz * gin(T.e3e), color: C.i });
      ctag('|x| < 1：36 个', DX + 200, DY + 110, { px: 30, a: gz * gin(T.e3f), color: C.j });
    }
    // 1 和 2 之间的空白
    const ge = g * gin(T.e3g); if (ge > 0) { ctx.save(); ctx.globalAlpha = ge * 0.25; ctx.fillStyle = C.free; ctx.fillRect(X(1) + 6, DY - 185, X(2) - X(1) - 12, 50); ctx.restore(); ctag('空', (X(1) + X(2)) / 2, DY - 215, { px: 28, a: ge, color: C.free }); }
    const g15 = g * gin(T.d2); if (g15 > 0) {
      const s = smoother(prog(B.t, T.d2 + 1.0, T.d2 + 2.0));
      B.dot(lerp(X(1.5), X(2), s), DY - 160, 9, C.ds, g15); ctag(s < 0.5 ? '1.5？' : '→ 2', lerp(X(1.5), X(2), s), DY - 260, { px: 30, a: g15 * (1 - gin(T.er - 0.4)), color: C.ds, font: F.serif });
      ctag('只能舍入到最近的浮点数', DX, DY + 200, { px: 32, a: g15 * gin(T.d2 + 1.0), color: C.ds });
    }
  }

  // ── C：误差 + 表 1 ──
  function shotC() {
    const a = B.win(T.er - 0.2, T.bi - 0.3); if (a <= 0) return;
    texAt('err', DX, DY - 330, 44, { alpha: a * gin(T.er2) });
    ctag('相对误差：错了百分之几', DX, DY - 220, { px: 32, a: a * gin(T.er4), color: C.peri });
    const rows = [['x', 'x′（4 位）', '绝对误差', '相对误差'], ['62133', '0.6213 × 10⁵', '−3', '≈ −4.8 × 10⁻⁵'], ['π', '3.142', '≈ 4.1 × 10⁻⁴', '≈ 1.3 × 10⁻⁴']];
    const g = a * gin(T.tb);
    B.mat(DX, DY - 40, rows, g, { cw: 215, ch: 72, px: 30, bracket: false, fade: (i, j) => (i === 2 ? gin(T.tb2) : 1), col: (i, j) => (i === 0 ? C.inkMid : j === 3 ? C.peri : C.ink) });
    B.line2([DX - 430, DY - 40 - 72], [DX + 430, DY - 40 - 72], C.inkMid, g * 0.5, 2);
    ctag('表 1', DX, DY + 110, { px: 28, a: g, color: C.inkMid });
  }

  // ── D：二进制 11.31 ──
  const STEPS = [['0.31 × 2', '0.62', '0'], ['0.62 × 2', '1.24', '1'], ['0.24 × 2', '0.48', '0'], ['0.48 × 2', '0.96', '0'], ['0.96 × 2', '1.92', '1'], ['0.92 × 2', '1.84', '1'], ['0.84 × 2', '1.68', '1 → 进位']];
  function shotD() {
    const a = B.win(T.bi - 0.2, T.op - 0.3); if (a <= 0) return;
    texAt('b11', DX - 240, DY - 380, 40, { alpha: a * gin(T.bi2) });
    ctag('小数部分：反复乘二，取整数部分', DX + 170, DY - 380, { px: 28, a: a * gin(T.bi3), color: C.inkMid });
    STEPS.forEach(([l, m, r], k) => {
      const t0 = k < 6 ? T.bs + k * 1.15 : T.bs2, g = a * gin(t0), y = DY - 300 + k * 56, last = k === 6;
      ctag(l, DX - 280, y, { px: 30, a: g, color: C.inkMid, font: F.serif }); ctag('= ' + m, DX - 80, y, { px: 30, a: g, color: C.ink, font: F.serif });
      ctag(r, DX + 120, y, { px: 32, a: g, color: last ? C.free : C.i, font: F.serif });
    });
    const gb = a * gin(T.bs + 0.5); if (gb > 0) {
      const n = Math.min(6, Math.floor((B.t - T.bs) / 1.15) + 1), raw = '010011'.slice(0, Math.max(0, n)), up = B.t > T.bs2 + 0.8;
      ctag('0.31 ≈ (0.' + (up ? '010100' : raw) + ')₂', DX + 300, DY - 140, { px: 34, a: gb, color: up ? C.peri : C.ink, font: F.serif });
    }
    texAt('b1131', DX, DY + 140, 38, { alpha: a * gin(T.bs3) });
    ctag('相对误差 ≈ 2.2 × 10⁻⁴', DX, DY + 230, { px: 30, a: a * gin(T.bs3 + 1.0), color: C.peri });
  }

  // ── E：运算舍入（例 5）──
  function shotE() {
    const a = B.win(T.op - 0.2, T.ep - 0.3); if (a <= 0) return;
    ctag('三位十进制：a′ = 2630，b′ = 4.46', DX, DY - 380, { px: 34, a: a * gin(T.op), color: C.ink, font: F.serif });
    const g = a * gin(T.op2); const cut = gin(T.op3, 0.6);
    ctag('a′ + b′ =', DX - 330, DY - 270, { px: 34, a: g, color: C.inkMid, font: F.serif });
    B.digits(DX + 60, DY - 270, '2634.46', g, { px: 54, cw: 40, dim: k => (k < 3 ? 1 : 1 - 0.8 * cut), col: k => (k < 3 ? C.ink : C.free) });
    texAt('fladd', DX, DY - 170, 38, { alpha: a * gin(T.op3 + 0.4) });
    const gm = a * gin(T.mu), cm = gin(T.mu + 1.5, 0.6);
    ctag('a′ b′ =', DX - 330, DY - 60, { px: 34, a: gm, color: C.inkMid, font: F.serif });
    B.digits(DX + 60, DY - 60, '11729.8', gm, { px: 54, cw: 40, dim: k => (k < 3 ? 1 : 1 - 0.8 * cm), col: k => (k < 3 ? C.ink : C.free) });
    texAt('flmul', DX, DY + 40, 38, { alpha: gm * gin(T.mu + 1.5) });
    ctag('和 ≈ −0.17%　积 ≈ −0.25%', DX, DY + 130, { px: 32, a: a * gin(T.mu2), color: C.peri });
    ctag('fl(·) = 电脑算出来的结果', DX, DY + 210, { px: 28, a: a * gin(T.mu3), color: C.inkMid });
  }

  // ── F：机器精度 ──
  function shotF() {
    const a = B.win(T.ep - 0.2, T.ie - 0.3); if (a <= 0) return;
    ctag('机器精度 ε', DX, DY - 390, { px: 40, a: a * gin(T.ep), color: C.peri, font: F.serif });
    B.card(DX, DY - 300, 420, 80, a * gin(T.ep2), C.peri); texAt('epsdef', DX, DY - 300, 40, { alpha: a * gin(T.ep2) });
    const g = a * gin(T.e3x); if (g > 0) {
      const X = B.axis(DX - 400, DX + 400, DY - 140, 0.995, 1.015, g, { ticks: [[1, '1'], [1.01, '1.01']] });
      ctx.save(); ctx.globalAlpha = g * 0.18; ctx.fillStyle = C.ink; ctx.fillRect(X(0.995), DY - 165, X(1.005) - X(0.995), 50); ctx.fillStyle = C.peri; ctx.fillRect(X(1.005), DY - 165, X(1.015) - X(1.005), 50); ctx.restore();
      const s1 = smoother(prog(B.t, T.e3x + 1.2, T.e3x + 2.2)); B.dot(lerp(X(1.00499), X(1), s1), DY - 140, 9, C.i, g);
      ctag('1.00499 → 1', lerp(X(1.00499), X(1), s1), DY - 210, { px: 26, a: g, color: C.i, font: F.serif });
      const g2 = g * gin(T.e3y), s2 = smoother(prog(B.t, T.e3y + 0.6, T.e3y + 1.6)); B.dot(lerp(X(1.005), X(1.01), s2), DY - 140, 9, C.peri, g2);
      ctag('1.005 → 1.01', lerp(X(1.005), X(1.01), s2), DY - 210, { px: 26, a: g2, color: C.peri, font: F.serif });
      texAt('eps3', DX, DY - 30, 32, { alpha: g * gin(T.e3y + 1.0) });
      ctag('ε = 0.005', DX - 220, DY + 60, { px: 36, a: g * gin(T.e3y + 2.0), color: C.peri, font: F.serif });
      texAt('epsb', DX + 220, DY + 60, 38, { alpha: g * gin(T.e3z) });
    }
    B.card(DX, DY + 180, 720, 90, a * gin(T.dl), OK); texAt('delta', DX, DY + 180, 34, { alpha: a * gin(T.dl) });
  }

  // ── G：IEEE 754 ──
  const BITS = '0' + '10000011' + '00011000000000000000000';
  function shotG() {
    const a = B.win(T.ie - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('IEEE 754 单精度（32 位）', DX, DY - 390, { px: 36, a: a * gin(T.ie), color: C.ink, font: F.serif });
    const g = a * gin(T.ie2), show = gin(T.x7 - 0.1, 0.5);
    const col = k => (k === 0 ? C.free : k < 9 ? C.i : C.j);
    B.digits(DX, DY - 290, show > 0.5 ? BITS : '?'.repeat(32), g, { px: 24, cw: 27, box: col, col: k => (show > 0.5 ? C.ink : C.inkMid), dim: k => (show > 0.5 ? 1 : 0.6) });
    ctag('符号 1', DX - 425, DY - 245, { px: 22, a: g, color: C.free, align: 'left' });
    ctag('指数 8', DX - 300, DY - 245, { px: 22, a: g, color: C.i }); ctag('尾数 23', DX + 160, DY - 245, { px: 22, a: g, color: C.j });
    texAt('ieee', DX, DY - 170, 36, { alpha: a * gin(T.ie3) }); ctag('首位 1 不用存', DX, DY - 100, { px: 28, a: a * gin(T.ie3) * (1 - gin(T.x7)), color: C.inkMid });
    ctag('指数 (10000011)₂ = 131，131 − 127 = 4', DX, DY - 100, { px: 30, a: a * gin(T.x7b), color: C.i, font: F.serif });
    ctag('尾数 (1.00011)₂', DX, DY - 30, { px: 30, a: a * gin(T.x7c), color: C.j, font: F.serif });
    texAt('ex7', DX, DY + 60, 40, { alpha: a * gin(T.x7d) });
    const gd = a * gin(T.db); if (gd > 0) {
      B.card(DX, DY + 170, 640, 90, gd, C.peri); ctag('双精度 64 位：尾数 52 位', DX, DY + 145, { px: 26, a: gd, color: C.inkMid });
      texAt('dbl', DX, DY + 190, 34, { alpha: gd * gin(T.db2) });
      ctag('≈ 16 位十进制有效数字', DX, DY + 270, { px: 30, a: gd * gin(T.db3), color: C.peri });
    }
  }

  // ── H：同济 + 小结 ──
  function shotH() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济：没有这一章', DX, DY - 200, { px: 40, a: g1, color: C.gpt, font: F.serif });
    ctag('所有计算都假设精确', DX, DY - 110, { px: 32, a: g1 * gin(T.tj + 1.2), color: C.ink });
    ctag('→ 数值分析课从这里讲起', DX, DY - 30, { px: 32, a: g1 * gin(cue('G01', '数值分析课')), color: C.peri });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    ctag('浮点数：有限、不均匀', DX, DY - 200, { px: 40, a: g2, color: C.ink, font: F.serif });
    B.card(DX, DY - 80, 640, 90, g2 * gin(cue('C20', '每做一次运算')), C.peri); texAt('delta', DX, DY - 80, 32, { alpha: g2 * gin(cue('C20', '每做一次运算')) });
    const g3 = a * gin(T.end - 0.2);
    ctag('成千上万次运算以后？', DX, DY - 200, { px: 34, a: g3, color: C.inkMid });
    ctag('下一节', DX, DY - 120, { px: 30, a: g3 * gin(cue('C21', '下一节')), color: C.inkMid });
    ctag('抵消与不稳定', DX, DY - 20, { px: 86, a: g3 * gin(cue('C21', '下一节') + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  const SECS = [
    { t0: T.ex - 0.2, t1: T.e3 - 0.3, head: '浮点数', items: [['有限位数，每步舍入', T.ex3], ['± 0.d₁d₂…d_t × βᵉ', T.df, { color: C.peri }], ['规格化：没有前导零', T.e1c]] },
    { t0: T.e3 - 0.2, t1: T.op - 0.3, head: '分布与误差', items: [['零附近挤，外面稀', T.e3d], ['绝对误差 x′ − x', T.er2], ['相对误差 ÷ x', T.er3, { color: C.peri }], ['二进制：乘二取整', T.bi3, { color: C.i }]] },
    { t0: T.op - 0.2, t1: T.tj - 0.3, head: '运算舍入', items: [['fl(a′ ∘ b′)', T.op3], ['机器精度 ε', T.ep, { color: C.peri }], ['|δ| < ε', T.dl, { color: OK }], ['双精度 ε ≈ 2.2 × 10⁻¹⁶', T.db2, { color: C.j }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['每次运算相对误差 < ε', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotA(); shotB(); shotC(); shotD(); shotE(); shotF(); shotG(); shotH(); B.left(SECS); });
  }
  return { TL, draw };
}
