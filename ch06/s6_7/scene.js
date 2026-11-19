// 第 6 章 6.7 正定矩阵（+ 6.8 点到）（Leon 9th §6.7 例 1–3、定理 6.7.1；§6.8 佩龙定理）。
// 分镜：特征值难求 → 例 1 矩阵 → 顺序主子式逐层点亮 4、36、108 → 消元三步“剥洋葱”，主元 4、9、3 → 主子式 = 主元连乘
//       → A = LU → LDLᵀ → 乔列斯基 L₁ → 定理 6.7.1 五条等价 → BᵀB → −I 反例、半正定陷阱 → 乔列斯基快一倍 → 佩龙定理（正矩阵 → 正特征向量柱）
//       → 同济 赫尔维茨 + 含参题数轴 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, arrow, rgba } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第六章 · 特征值', title: '6.7 正定矩阵', hi: 3, en: 'POSITIVE DEFINITE MATRICES',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C03: 0.6, C04: 0.6, C05: 0.4, C06: 0.6, C07: 0.4, C08: 0.6, C10: 0.4, C11: 0.4, C12: 0.4, C13: 0.8, G01: 0.6, C15: 0.6 },
    post: { C01: 0.6, C02: 0.8, C03: 1.0, C04: 1.4, C05: 1.0, C06: 1.0, C07: 1.4, C08: 1.0, C09: 0.8, C10: 0.8, C11: 0.6, C12: 0.6, C14: 0.8, G02: 1.0, C15: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, o2: cue('C01', '这一节给出'), e1: L('C02').s, e1b: cue('C02', '它的特征值不是整数'), mn: L('C03').s, m1: cue('C03', '一阶的是四'), m2: cue('C03', '二阶的是'), m3: cue('C03', '三阶的就是'), m4: cue('C03', '全部为正'),
    el: L('C04').s, el1: cue('C04', '第一行的二分之一倍'), el2: cue('C04', '负二分之一倍'), el3: cue('C04', '再把新的第二行'), el4: cue('C04', '主元依次是'), d1: L('D01').s, rel: L('C05').s, rel2: cue('C05', '一百零八等于'), rel3: cue('C05', '第k个顺序主子式'),
    lu: L('C06').s, lu2: cue('C06', '再把U的主元提出来'), ch: L('C07').s, ch2: cue('C07', '这叫乔列斯基分解'), ch3: cue('C07', '本例的L一'),
    th: L('C08').s, th1: cue('C08', '一，A正定'), th2: cue('C08', '二，顺序主子式'), th3: cue('C08', '三，只用'), th4: cue('C08', '四，有乔列斯基'), th5: cue('C08', '五，A等于'), bb: L('C09').s, bb2: cue('C09', 'B可逆'),
    d2: L('D02').s, ni: L('C10').s, ni2: cue('C10', '要每一个'), ps: L('C11').s, ps2: cue('C11', '教材举了反例'), sp: L('C12').s, pe: L('C13').s, pe2: cue('C13', '元素全为正的矩阵'), pe3: cue('C13', '这就是佩龙定理'), io: L('C14').s, io2: cue('C14', '也解释了'), d3: L('D03').s,
    tj: L('G01').s, tj1b: cue('G01', '负定'), tj2: L('G02').s, tj2b: cue('G02', '顺序主子式分别是'), tj2c: cue('G02', '解出a'), sum: L('C15').s, end: L('C16').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.e1, 0.3); TL.sfx('buzz', T.e1b, 0.2); [T.m1, T.m2, T.m3].forEach(t => TL.sfx('marimba', t, 0.3)); TL.sfx('ding_hi', T.m4, 0.3);
  [T.el1, T.el2, T.el3].forEach(t => TL.sfx('swoosh_soft', t, 0.3)); TL.sfx('ding_hi', T.el4, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('sparkle', T.rel2, 0.3);
  TL.sfx('pop', T.lu, 0.3); TL.sfx('pop', T.lu2, 0.3); TL.sfx('sting', T.ch2, 0.3); TL.sfx('pop', T.ch3, 0.3); [T.th1, T.th2, T.th3, T.th4, T.th5].forEach(t => TL.sfx('pluck', t, 0.24)); TL.sfx('ding', T.bb2, 0.3);
  TL.sfx('pluck', T.d2, 0.3); TL.sfx('stamp', T.ni, 0.3); TL.sfx('pop', T.ps2, 0.3); TL.sfx('pop', T.sp, 0.3); TL.sfx('whoosh', T.pe, 0.3); TL.sfx('shimmer', T.pe3, 0.3); TL.sfx('pop', T.io2, 0.3); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2b, 0.3); TL.sfx('ding_hi', T.tj2c, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C16').e + 0.3, 0.4);

  // 数字矩阵（可逐行变化）
  const cellW = 110, cellH = 74;
  function mat(M, cx, cy, a, { hl = null, pivots = [], col = C.ink, px = 40 } = {}) {
    if (a <= 0) return; const n = M.length, x0 = cx - (n * cellW) / 2, y0 = cy - (n * cellH) / 2;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0 + 12, y0 - 6); ctx.lineTo(x0 - 4, y0 - 6); ctx.lineTo(x0 - 4, y0 + n * cellH + 6); ctx.lineTo(x0 + 12, y0 + n * cellH + 6); ctx.stroke();
    const x1 = x0 + n * cellW; ctx.beginPath(); ctx.moveTo(x1 - 12, y0 - 6); ctx.lineTo(x1 + 4, y0 - 6); ctx.lineTo(x1 + 4, y0 + n * cellH + 6); ctx.lineTo(x1 - 12, y0 + n * cellH + 6); ctx.stroke(); ctx.restore();
    if (hl) for (const h of hl) if (h.a > 0) { ctx.save(); ctx.globalAlpha = a * h.a; ctx.fillStyle = rgba(h.col, 0.12); ctx.fillRect(x0 + 4, y0 + 2, h.k * cellW - 8, h.k * cellH - 4); ctx.strokeStyle = h.col; ctx.lineWidth = 3; ctx.strokeRect(x0 + 4, y0 + 2, h.k * cellW - 8, h.k * cellH - 4); ctx.restore(); }
    M.forEach((r, i) => r.forEach((v, j) => { const pv = pivots.includes(i) && i === j; ctag(String(v).replace('-', '−'), x0 + (j + 0.5) * cellW, y0 + (i + 0.5) * cellH, { px, a: a * (v === 0 ? 0.45 : 1), color: pv ? C.peri : col, font: F.serif }); }));
    return { x0, y0 };
  }
  const A = [[4, 2, -2], [2, 10, 2], [-2, 2, 5]], A1 = [[4, 2, -2], [0, 9, 3], [0, 3, 4]], A2 = [[4, 2, -2], [0, 9, 3], [0, 0, 3]];

  // ── A：主子式 + 消元 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.lu - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.e1 - 0.2));
    ctag('三阶以上：特征值难求', DX, DY - 60, { px: 44, a: g0 * gin(T.o + 0.6), color: C.inkMid, font: F.serif });
    ctag('更快的判别法？', DX, DY + 40, { px: 40, a: g0 * gin(T.o2), color: C.peri, font: F.serif });
    const g = a * gin(T.e1 - 0.2); if (g <= 0) return;
    const step = B.t < T.el1 + 0.8 ? 0 : B.t < T.el3 + 0.8 ? 1 : 2;
    const Mshow = [A, A1, A2][step];
    const hl = step === 0 ? [{ k: 1, col: C.i, a: gin(T.m1) }, { k: 2, col: C.j, a: gin(T.m2) }, { k: 3, col: C.peri, a: gin(T.m3) }].map(h => ({ ...h, a: h.a * (1 - gin(T.el - 0.3)) })) : null;
    mat(Mshow, DX - 120, DY - 120, g, { hl, pivots: step === 2 && B.t > T.el4 ? [0, 1, 2] : [] });
    ctag('特征值不是整数', DX + 290, DY - 230, { px: 28, a: g * gin(T.e1b) * (1 - gin(T.mn)), color: C.free });
    // 主子式数值
    const vals = [[4, T.m1, C.i], [36, T.m2, C.j], [108, T.m3, C.peri]];
    vals.forEach(([v, t0, col], i) => { const gi = a * gin(t0); ctag(`Δ${'₁₂₃'[i]} = ${v}`, DX + 300, DY - 230 + i * 70, { px: 34, a: gi, color: col, font: F.serif }); });
    ctag('全部为正', DX + 300, DY - 10, { px: 30, a: a * gin(T.m4), color: OK });
    // 消元操作说明
    const ops = [['R₂ − ½R₁', T.el1], ['R₃ + ½R₁', T.el2], ['R₃ − ⅓R₂', T.el3]];
    ops.forEach(([s, t0], i) => ctag(s, DX - 120, DY + 80 + i * 50, { px: 30, a: a * gin(t0) * (1 - gin(T.rel - 0.2)), color: C.inkMid, font: F.serif }));
    ctag('主元 4、9、3：全正', DX - 120, DY + 250, { px: 32, a: a * gin(T.el4), color: C.peri, font: F.serif });
    const gr = a * gin(T.rel); if (gr <= 0) return;
    ctag('36 = 4 × 9', DX + 300, DY + 100, { px: 34, a: gr, color: C.j, font: F.serif });
    ctag('108 = 4 × 9 × 3', DX + 300, DY + 160, { px: 34, a: a * gin(T.rel2), color: C.peri, font: F.serif });
    ctag('Δₖ = 前 k 个主元之积', DX + 120, DY + 330, { px: 32, a: a * gin(T.rel3), color: OK, font: F.serif });
  }

  // ── B：LU → LDLᵀ → 乔列斯基 ──
  function shotB() {
    const a = B.win(T.lu - 0.2, T.th - 0.3); if (a <= 0) return;
    texAt('A', DX, DY - 370, 32, { alpha: a });
    texAt('lu', DX, DY - 230, 30, { alpha: a * gin(T.lu), reveal: rv(T.lu, 3.0) });
    B.card(DX, DY - 80, 560, 120, a * gin(T.lu2), C.inkMid); texAt('ldl', DX, DY - 80, 32, { alpha: a * gin(T.lu2) });
    B.card(DX, DY + 110, 720, 130, a * gin(T.ch2), C.peri); texAt('chol', DX, DY + 110, 32, { alpha: a * gin(T.ch2), reveal: rv(T.ch3, 4.0) });
    ctag('主元全正 → 能开平方', DX, DY + 230, { px: 30, a: a * gin(T.ch), color: OK });
    ctag('乔列斯基分解', DX, DY + 290, { px: 36, a: a * gin(T.ch2), color: C.peri, font: F.serif });
  }

  // ── C：定理 6.7.1 + BᵀB + 反例 ──
  function shotC() {
    const a = B.win(T.th - 0.2, T.pe - 0.3); if (a <= 0) return;
    const g1 = a * (1 - gin(T.d2 - 0.2));
    ctag('定理 6.7.1（A 对称）', DX, DY - 390, { px: 32, a: g1, color: C.peri });
    const items = [['① A 正定', T.th1], ['② 顺序主子式全正', T.th2], ['③ 消元（只用第三类变换）主元全正', T.th3], ['④ 有乔列斯基分解', T.th4], ['⑤ A = BᵀB，B 可逆', T.th5]];
    items.forEach(([s, t0], i) => { const y = DY - 310 + i * 74, gi = g1 * gin(t0); B.card(DX, y, 640, 60, gi, i === 4 ? C.peri : C.inkMid); ctag(s, DX, y, { px: 30, a: gi, color: i === 4 ? C.peri : C.ink, font: F.serif }); });
    texAt('btb', DX, DY + 110, 38, { alpha: g1 * gin(T.bb) });
    ctag('B 可逆，x ≠ 0 ⇒ Bx ≠ 0', DX, DY + 190, { px: 30, a: g1 * gin(T.bb2), color: OK });
    const g2 = a * gin(T.d2 - 0.2); if (g2 <= 0) return;
    ctag('只看 det > 0 ？', DX, DY - 360, { px: 40, a: g2, color: C.ds, font: F.serif });
    B.card(DX, DY - 250, 600, 90, g2 * gin(T.ni), C.free); texAt('negI', DX, DY - 250, 34, { alpha: g2 * gin(T.ni) });
    B.stamp(DX + 340, DY - 250, false, prog(B.t, T.ni + 1.5, T.ni + 1.9), g2, '负定');
    ctag('每一个顺序主子式都要 > 0', DX, DY - 150, { px: 30, a: g2 * gin(T.ni2), color: C.peri });
    const gp = g2 * gin(T.ps);
    ctag('陷阱：半正定', DX, DY - 50, { px: 34, a: gp, color: C.free, font: F.serif });
    ctag('A = (0 0; 0 −1)：顺序主子式 0、0 ≥ 0', DX, DY + 20, { px: 28, a: gp * gin(T.ps2), color: C.ink, font: F.serif });
    ctag('却不是半正定 → 看所有主子式 / 特征值', DX, DY + 80, { px: 28, a: gp * gin(T.ps2 + 1.5), color: C.peri });
    const gs = g2 * gin(T.sp); B.card(DX, DY + 220, 620, 110, gs, OK);
    ctag('乔列斯基：比 LU 快一倍', DX, DY + 195, { px: 32, a: gs, color: OK, font: F.serif }); ctag('数值稳定 · 不用选主元', DX, DY + 250, { px: 28, a: gs, color: C.ink });
  }

  // ── D：佩龙定理 ──
  function shotD() {
    const a = B.win(T.pe - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('6.8 非负矩阵（点到为止）', DX, DY - 380, { px: 32, a: a * gin(T.pe), color: C.inkMid });
    texAt('perron', DX, DY - 290, 38, { alpha: a * gin(T.pe2) });
    ctag('佩龙定理', DX, DY - 210, { px: 40, a: a * gin(T.pe3), color: C.peri, font: F.serif });
    const g = a * gin(T.pe2 + 1.0);
    mat([[2, 1, 1], [1, 3, 1], [1, 1, 4]].map(r => r.map(v => v)), DX - 200, DY, g, { px: 34, col: OK });
    ctag('全正', DX - 200, DY + 140, { px: 28, a: g, color: OK });
    const xv = [0.43, 0.56, 0.71];
    xv.forEach((v, i) => { const h = 200 * v * gin(T.pe3, 0.8); ctx.save(); ctx.globalAlpha = g * 0.9; ctx.fillStyle = C.peri; ctx.fillRect(DX + 140 + i * 80, DY + 110 - h, 56, h); ctx.restore(); });
    B.line2([DX + 120, DY + 110], [DX + 360, DY + 110], C.ink, g * 0.6, 2); ctag('x₁ > 0（每个分量）', DX + 250, DY + 150, { px: 26, a: g * gin(T.pe3), color: C.peri });
    ctag('投入产出分析 · 马尔可夫链 · 网页排名', DX, DY + 260, { px: 30, a: a * gin(T.io), color: C.ink });
    ctag('稳态向量背后：佩龙定理', DX, DY + 340, { px: 34, a: a * gin(T.d3), color: C.ds, font: F.serif });
  }

  // ── E：同济 + 小结 ──
  function shotE() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第五章第七节 赫尔维茨定理', DX, DY - 380, { px: 32, a: g1, color: C.gpt });
    ctag('正定 ⇔ 各阶顺序主子式 > 0', DX, DY - 310, { px: 30, a: g1 * gin(T.tj + 2.0), color: C.ink });
    ctag('负定 ⇔ 奇数阶 < 0，偶数阶 > 0', DX, DY - 255, { px: 30, a: g1 * gin(T.tj1b), color: C.k });
    const g2 = g1 * gin(T.tj2); if (g2 > 0) {
      texAt('tjA', DX - 260, DY - 110, 32, { alpha: g2 });
      texAt('tjm', DX + 150, DY - 110, 28, { alpha: g2 * gin(T.tj2b), reveal: rv(T.tj2b, 4.0) });
      // 数轴：−1 < a < 1 与 −4/5 < a < 0
      const X = v => DX + v * 300, y = DY + 90; B.line2([X(-1.4), y], [X(1.4), y], C.ink, g2 * 0.6, 2);
      [-1, -0.8, 0, 1].forEach(v => { B.line2([X(v), y - 8], [X(v), y + 8], C.ink, g2 * 0.6, 2); ctag(v === -0.8 ? '−⅘' : String(v).replace('-', '−'), X(v), y + 34, { px: 24, a: g2, color: C.inkMid, font: F.serif }); });
      const s1 = gin(T.tj2b + 1.5), s2 = gin(T.tj2b + 3.0);
      ctx.save(); ctx.globalAlpha = g2 * 0.5 * s1; ctx.fillStyle = C.j; ctx.fillRect(X(-1), y - 36, X(1) - X(-1), 12); ctx.globalAlpha = g2 * 0.5 * s2; ctx.fillStyle = C.i; ctx.fillRect(X(-0.8), y - 54, X(0) - X(-0.8), 12); ctx.globalAlpha = g2 * 0.8 * gin(T.tj2c); ctx.fillStyle = C.peri; ctx.fillRect(X(-0.8), y - 6, X(0) - X(-0.8), 12); ctx.restore();
      B.card(DX, DY + 210, 340, 80, g2 * gin(T.tj2c), C.peri); texAt('tjr', DX, DY + 210, 38, { alpha: g2 * gin(T.tj2c) });
    }
    const g3 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    ctag('判断正定：五条路线', DX, DY - 230, { px: 40, a: g3, color: C.peri, font: F.serif });
    ctag('手算最快：顺序主子式 / 主元', DX, DY - 140, { px: 32, a: g3 * gin(cue('C15', '手算最快')), color: C.ink });
    ctag('乔列斯基 = LDLᵀ 再开平方', DX, DY - 70, { px: 32, a: g3 * gin(cue('C15', '乔列斯基分解')), color: OK });
    ctag('det > 0 不足以判定', DX, DY + 0, { px: 32, a: g3 * gin(cue('C15', '行列式为正')), color: C.free });
    const g4 = a * gin(T.end - 0.2);
    ctag('第六章正文完', DX, DY - 120, { px: 34, a: g4, color: C.inkMid });
    ctag('复习：判断题 10 道', DX, DY - 20, { px: 72, a: g4 * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  const SECS = [
    { t0: T.e1 - 0.2, t1: T.th - 0.3, head: '例 1', items: [['主子式 4、36、108', T.m4, { color: C.peri }], ['主元 4、9、3', T.el4], ['Δₖ = 主元连乘', T.rel3], ['A = LDLᵀ', T.lu2], ['乔列斯基 L₁L₁ᵀ', T.ch2, { color: C.peri }]] },
    { t0: T.th - 0.2, t1: T.pe - 0.3, head: '五条等价', items: [['正定 ⇔ 主子式全正', T.th2], ['⇔ 主元全正 ⇔ 乔列斯基', T.th4], ['⇔ A = BᵀB', T.th5, { color: C.peri }], ['−I：det > 0 也不行', T.ni, { color: C.free }], ['半正定：看全部主子式', T.ps2]] },
    { t0: T.pe - 0.2, t1: T.tj - 0.3, head: '6.8 点到', items: [['正矩阵 → 正特征向量', T.pe2], ['佩龙定理', T.pe3, { color: C.peri }]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['主子式 · 主元 · 乔列斯基', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(); shotC(); shotD(); shotE(); B.left(SECS); });
  }
  return { TL, draw };
}
