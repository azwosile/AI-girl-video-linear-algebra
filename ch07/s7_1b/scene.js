// 第 7 章 7.1 电脑里的数（下）：抵消与不稳定（Leon 9th §7.1：结合律失效、例 6 灾难性抵消、例 8 二次方程、稳定 / 病态、x¹⁰ 的根）。
// 分镜：两条加法顺序的“小数被吃掉”动画 → 两串长数位上下对齐、前四位相消变灰 → 求根公式里 −b 与 √ 两根柱子几乎等高 → 韦达改法
//       → 3B1B：复平面上 10 个重根从原点炸开成半径 0.1 的圆 → 本章路线图 → 同济 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_confused', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.1 抵消与不稳定', hi: 3, en: 'CANCELLATION · STABILITY',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C08: 0.6, C11: 0.4, C13: 0.6, C15: 0.6, G01: 0.6, C17: 0.6 },
    post: { C01: 0.6, C02: 1.4, C03: 1.0, C06: 1.2, C07: 1.0, C09: 1.2, C10: 1.0, C11: 1.2, C12: 1.0, C13: 1.6, C14: 1.0, C16: 1.0, G02: 0.6, C17: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, as: L('C02').s, as2: cue('C02', '再加零点零零四'), as3: cue('C02', '先把两个零点零零四'), d1: L('D01').s, db: L('C03').s, db2: cue('C03', '换个顺序'), db3: cue('C03', '小的数先加'),
    cd: L('C04').s, cd2: cue('C04', '六位十进制'), st: L('C05').s, st2: cue('C05', '相对误差分别'), su: L('C06').s, su2: cue('C06', '而真值是'), su3: cue('C06', '放大了一万倍'),
    why: L('C07').s, why2: cue('C07', '全部抵消'), why3: cue('C07', '灾难性抵消'), d2: L('D02').s, q: L('C08').s, q2: cue('C08', '精确的根'), qf: L('C09').s, qf2: cue('C09', '小根却是'),
    qw: L('C10').s, qw2: cue('C10', '又是抵消'), fx: L('C11').s, fx2: cue('C11', '再根据两根之积'), fx3: cue('C11', '完全正确'), d3: L('D03').s, stb: L('C12').s, stb2: cue('C12', '叫作数值稳定的'), stb3: cue('C12', '叫作不稳定的'),
    ill: L('C13').s, ill2: cue('C13', '常数项只改'), ill3: cue('C13', '根的模全部变成'), ill4: L('C14').s, ill5: cue('C14', '问题本身病态'), rv: L('C15').s, map: L('C16').s,
    tj: L('G01').s, tj2: L('G02').s, sum: L('C17').s, end: L('C18').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.as, 0.3); TL.sfx('buzz', T.as2, 0.22); TL.sfx('ding', T.as3 + 1.5, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('pop', T.db, 0.3); TL.sfx('pop', T.db2, 0.3);
  TL.sfx('pop', T.cd, 0.3); TL.sfx('pop', T.st, 0.3); TL.sfx('crack', T.su, 0.32); TL.sfx('sting', T.su3, 0.3); TL.sfx('glitch', T.why2, 0.3); TL.sfx('slam', T.why3, 0.3);
  TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.q, 0.3); TL.sfx('buzz', T.qf2, 0.22); TL.sfx('pop', T.qw2, 0.3); TL.sfx('pop', T.fx, 0.3); TL.sfx('ding_hi', T.fx3, 0.3); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('ding', T.stb2, 0.3); TL.sfx('buzz', T.stb3, 0.2); TL.sfx('pop', T.ill, 0.3); TL.sfx('impact', T.ill3, 0.3); TL.sfx('sting', T.ill5, 0.3); TL.sfx('whoosh', T.map, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C18').e + 0.3, 0.4);

  // ── A：结合律失效 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.cd - 0.3); if (a <= 0) return;
    ctag('浮点加法不满足结合律', DX, DY - 390, { px: 38, a: a * gin(T.as), color: C.peri, font: F.serif });
    // 左路：1 + 0.004 → 1（小数被吃掉）
    const gl = a * gin(T.as + 0.8), eat = smoother(prog(B.t, T.as2 - 0.5, T.as2 + 0.6));
    ctag('先 1 + 0.004', DX - 230, DY - 300, { px: 28, a: gl, color: C.inkMid });
    B.digits(DX - 230, DY - 230, '1.004', gl, { px: 52, cw: 36, dim: k => (k === 4 ? 1 - 0.85 * eat : 1), col: k => (k === 4 ? C.free : C.ink) });
    ctag('→ 1.00 → 再加 0.004 → 1.00', DX - 230, DY - 160, { px: 26, a: gl * gin(T.as2), color: C.free });
    // 右路：0.004 + 0.004 = 0.008 → 1.01
    const gr = a * gin(T.as3);
    ctag('先 0.004 + 0.004', DX + 230, DY - 300, { px: 28, a: gr, color: C.inkMid });
    B.digits(DX + 230, DY - 230, '1.008', gr, { px: 52, cw: 36, col: k => (k === 4 ? C.j : C.ink) });
    ctag('→ 1.01', DX + 230, DY - 160, { px: 30, a: gr * gin(T.as3 + 1.2), color: C.j, font: F.serif });
    texAt('assoc1', DX - 230, DY - 70, 30, { alpha: gl * gin(T.as2 + 0.5) }); texAt('assoc2', DX + 230, DY - 70, 30, { alpha: gr * gin(T.as3 + 1.5) });
    texAt('assocd', DX, DY + 50, 34, { alpha: a * gin(T.db) }); ctag('双精度也一样', DX, DY + 120, { px: 28, a: a * gin(T.db), color: C.inkMid });
    B.card(DX, DY + 210, 460, 76, a * gin(T.db3), OK); ctag('小的数先加', DX, DY + 210, { px: 36, a: a * gin(T.db3), color: OK, font: F.serif });
  }

  // ── B：例 6 灾难性抵消 ──
  function shotB() {
    const a = B.win(T.cd - 0.2, T.q - 0.3); if (a <= 0) return;
    ctag('相近的数相减', DX, DY - 390, { px: 38, a: a * gin(T.cd), color: C.peri, font: F.serif });
    const can = smoother(prog(B.t, T.why2 - 0.3, T.why2 + 0.8));
    const dim = k => (k < 5 ? 1 - 0.75 * can : 1), col0 = k => (k < 5 ? (can > 0.3 ? C.inkMid : C.ink) : C.free);
    const x0 = DX - 120;
    ctag('c =', x0 - 220, DY - 300, { px: 32, a: a * gin(T.cd), color: C.inkMid, font: F.serif }); B.digits(x0, DY - 300, '3.4215298', a * gin(T.cd), { px: 44, cw: 32, align: 'l', dim, col: col0 });
    ctag('d =', x0 - 220, DY - 240, { px: 32, a: a * gin(T.cd), color: C.inkMid, font: F.serif }); B.digits(x0, DY - 240, '3.4213851', a * gin(T.cd), { px: 44, cw: 32, align: 'l', dim, col: col0 });
    const gs = a * gin(T.st);
    ctag("c′ =", x0 - 220, DY - 160, { px: 32, a: gs, color: C.inkMid, font: F.serif }); B.digits(x0, DY - 160, '3.42153', gs, { px: 44, cw: 32, align: 'l', dim, col: col0 });
    ctag("d′ =", x0 - 220, DY - 100, { px: 32, a: gs, color: C.inkMid, font: F.serif }); B.digits(x0, DY - 100, '3.42139', gs, { px: 44, cw: 32, align: 'l', dim, col: col0 });
    ctag('相对误差 6 × 10⁻⁸，1.4 × 10⁻⁶：很小', DX, DY - 30, { px: 28, a: gs * gin(T.st2), color: OK });
    texAt('cd', DX, DY + 60, 36, { alpha: a * gin(T.su) }); texAt('cdrel', DX, DY + 140, 38, { alpha: a * gin(T.su2 + 0.8) });
    ctag('放大一万倍以上！', DX, DY + 220, { px: 34, a: a * gin(T.su3) * (1 - gin(T.why - 0.2)), color: C.free, font: F.serif });
    ctag('前四位 3.421 全部抵消，只剩带误差的尾巴', DX, DY + 220, { px: 28, a: a * gin(T.why2), color: C.inkMid });
    B.card(DX, DY + 300, 380, 64, a * gin(T.why3), C.free); ctag('灾难性抵消', DX, DY + 300, { px: 34, a: a * gin(T.why3), color: C.free, font: F.serif });
  }

  // ── C：例 8 二次方程 ──
  function shotC() {
    const a = B.win(T.q - 0.2, T.ill - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.stb - 0.2));
    texAt('quad', DX, DY - 380, 36, { alpha: a * gin(T.q) });
    ctag('精确根：10⁷ 与 10⁻⁷', DX, DY - 310, { px: 30, a: g0 * gin(T.q2), color: C.ink, font: F.serif });
    texAt('qf', DX - 230, DY - 200, 36, { alpha: g0 * gin(T.qf) * (1 - gin(T.fx - 0.2)) });
    texAt('r2bad', DX + 230, DY - 200, 34, { alpha: g0 * gin(T.qf2) * (1 - gin(T.fx - 0.2)) });
    ctag('错了千分之三点五', DX + 230, DY - 130, { px: 26, a: g0 * gin(T.qf2 + 1.0) * (1 - gin(T.fx - 0.2)), color: C.free });
    // 两根柱子：−b 与 √(b² − 4ac)
    const gb = g0 * gin(T.qw) * (1 - gin(T.fx - 0.2)); if (gb > 0) {
      const h1 = 260, h2 = 256, y0 = DY + 230;
      ctx.save(); ctx.globalAlpha = gb * 0.85; ctx.fillStyle = C.i; ctx.fillRect(DX - 150, y0 - h1, 100, h1); ctx.fillStyle = C.j; ctx.fillRect(DX + 50, y0 - h2, 100, h2); ctx.restore();
      ctag('−b', DX - 100, y0 + 30, { px: 28, a: gb, color: C.i, font: F.serif }); ctag('√(b² − 4ac)', DX + 100, y0 + 30, { px: 28, a: gb, color: C.j, font: F.serif });
      ctag('几乎等高 → 相减 → 抵消', DX, y0 - h1 - 40, { px: 28, a: gb * gin(T.qw2), color: C.free });
    }
    const gf = g0 * gin(T.fx - 0.2); if (gf > 0) {
      texAt('r1', DX, DY - 200, 32, { alpha: gf });
      ctag('同号相加，不抵消', DX, DY - 120, { px: 28, a: gf, color: C.j });
      B.card(DX, DY - 20, 560, 90, gf * gin(T.fx2), OK); texAt('r2good', DX, DY - 20, 34, { alpha: gf * gin(T.fx2) });
      ctag('完全正确', DX, DY + 80, { px: 34, a: gf * gin(T.fx3), color: OK, font: F.serif });
      ctag('公式没错，是算的顺序错了', DX, DY + 170, { px: 30, a: gf * gin(T.d3), color: C.ds });
    }
    const gs = a * gin(T.stb - 0.2); if (gs > 0) {
      ctag('数学上等价 ≠ 电脑上等价', DX, DY - 260, { px: 34, a: gs, color: C.ink, font: F.serif });
      B.card(DX - 220, DY - 120, 360, 110, gs * gin(T.stb2), OK); ctag('数值稳定', DX - 220, DY - 140, { px: 38, a: gs * gin(T.stb2), color: OK, font: F.serif }); ctag('误差不被放大', DX - 220, DY - 90, { px: 24, a: gs * gin(T.stb2), color: C.inkMid });
      B.card(DX + 220, DY - 120, 360, 110, gs * gin(T.stb3), C.free); ctag('不稳定', DX + 220, DY - 140, { px: 38, a: gs * gin(T.stb3), color: C.free, font: F.serif }); ctag('误差被放大', DX + 220, DY - 90, { px: 24, a: gs * gin(T.stb3), color: C.inkMid });
    }
  }

  // ── D：病态问题 x¹⁰ ──
  function shotD() {
    const a = B.win(T.ill - 0.2, T.rv - 0.3); if (a <= 0) return;
    texAt('p10', DX, DY - 380, 36, { alpha: a * gin(T.ill2) });
    const cx = DX, cy = DY - 60, rr = 210, s = outBack(prog(B.t, T.ill3 - 0.2, T.ill3 + 0.9), 1.6);
    B.line2([cx - 300, cy], [cx + 300, cy], C.inkMid, a * 0.5, 2); B.line2([cx, cy - 260], [cx, cy + 260], C.inkMid, a * 0.5, 2);
    ctag('Re', cx + 320, cy, { px: 24, a: a * 0.7, color: C.inkMid }); ctag('Im', cx, cy - 280, { px: 24, a: a * 0.7, color: C.inkMid });
    ctx.save(); ctx.globalAlpha = a * 0.5 * gin(T.ill3 + 0.6); ctx.strokeStyle = C.free; ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    for (let k = 0; k < 10; k++) { const th = 2 * Math.PI * k / 10; B.dot(cx + rr * s * Math.cos(th), cy - rr * s * Math.sin(th), 10, k === 0 ? C.peri : C.free, a * gin(T.ill)); }
    ctag(s < 0.1 ? '10 个根都在 0' : '|x| = 0.1', cx + 150, cy - 230, { px: 30, a: a * gin(T.ill), color: s < 0.1 ? C.peri : C.free, font: F.serif });
    texAt('p10r', DX, DY + 230, 34, { alpha: a * gin(T.ill3 + 0.6) });
    ctag('系数动 10⁻¹⁰，根动 0.1', DX, DY + 300, { px: 28, a: a * gin(T.ill4) * (1 - gin(T.ill5 - 0.1)), color: C.ink });
    ctag('不是算法的错：问题本身病态', DX, DY + 300, { px: 30, a: a * gin(T.ill5), color: C.free });
  }

  // ── E：路线图 ──
  const MAP = [['7.2', '高斯消元 = LU', '运算量'], ['7.3', '选主元', '部分主元法'], ['7.4', '范数与条件数', '量病态'], ['7.5', '正交变换', '豪斯霍尔德 · 吉文斯'], ['7.6', '特征值', '幂法 · QR 算法'], ['7.7', '最小二乘', 'QR · SVD']];
  function shotE() {
    const a = B.win(T.rv - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('前六章的方法 → 都要打个问号？', DX, DY - 380, { px: 34, a: a * gin(T.rv), color: C.ink });
    ctag('逐个换成稳定的版本', DX, DY - 320, { px: 30, a: a * gin(cue('C15', '稳定的版本')), color: OK });
    const tk = [cue('C16', '高斯消元'), cue('C16', '要选主元'), cue('C16', '条件数'), cue('C16', '正交变换'), cue('C16', '求特征值'), cue('C16', '解最小二乘')];
    MAP.forEach(([n, h, s], i) => { const x = DX - 220 + (i % 2) * 440, y = DY - 210 + Math.floor(i / 2) * 140, g = a * gin(tk[i]);
      B.card(x, y, 400, 110, g, [C.i, C.peri, C.free, C.j, C.k, C.ds][i]); ctag(n, x - 150, y - 18, { px: 26, a: g, color: C.inkMid }); ctag(h, x + 20, y - 18, { px: 32, a: g, color: C.ink, font: F.serif }); ctag(s, x + 20, y + 26, { px: 24, a: g, color: C.inkMid }); });
  }

  // ── F：同济 + 小结 ──
  function shotF() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章：解特征方程', DX, DY - 300, { px: 36, a: g1, color: C.gpt, font: F.serif });
    ctag('三阶手算 ✓　几百阶：软件从不这样做', DX, DY - 210, { px: 30, a: g1 * gin(cue('G01', '手算三阶')), color: C.ink });
    ctag('二次方程技巧 = 韦达定理', DX, DY - 90, { px: 34, a: g1 * gin(T.tj2), color: C.gpt, font: F.serif });
    ctag('x₁x₂ = c / a', DX, DY - 10, { px: 44, a: g1 * gin(T.tj2 + 1.0), color: C.peri, font: F.serif });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['不满足结合律', C.ink, T.sum], ['相近相减 → 灾难性抵消', C.free, cue('C17', '相近的数相减')], ['换算法：躲开不稳定', OK, cue('C17', '换算法')], ['躲不开：病态', C.peri, cue('C17', '但躲不开病态')]]
      .forEach(([s, c, t0], i) => ctag(s, DX, DY - 260 + i * 80, { px: 36, a: g2 * gin(t0), color: c, font: F.serif }));
    const g3 = a * gin(T.end - 0.2);
    ctag('下一节', DX, DY - 120, { px: 34, a: g3, color: C.inkMid });
    ctag('LU 分解', DX, DY - 20, { px: 90, a: g3 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('消元的真面目 · 运算量', DX, DY + 90, { px: 36, a: g3 * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.as - 0.2, t1: T.q - 0.3, head: '误差怎么放大', items: [['加法不结合', T.as], ['小的先加', T.db3, { color: OK }], ['相近相减：抵消', T.su, { color: C.free }], ['例 6：放大一万倍', T.su3]] },
    { t0: T.q - 0.2, t1: T.rv - 0.3, head: '怎么躲开', items: [['求根公式：小根抵消', T.qf2, { color: C.free }], ['先大根，再 c / (a r₁)', T.fx2, { color: OK }], ['稳定 vs 不稳定', T.stb], ['病态：问题本身敏感', T.ill5, { color: C.peri }]] },
    { t0: T.rv - 0.2, t1: T.sum - 0.3, head: '本章路线', items: [['7.2 – 7.3 消元与主元', T.map], ['7.4 条件数', cue('C16', '条件数')], ['7.5 – 7.7 正交方法', cue('C16', '正交变换')]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['稳定靠算法，病态靠问题', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, () => { shotA(); shotB(); shotC(); shotD(); shotE(); shotF(); B.left(SECS); });
  }
  return { TL, draw };
}
