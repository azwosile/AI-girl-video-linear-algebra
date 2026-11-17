// 特别篇 4 · 第 2 段：函数和多项式里的子空间（2018–19 第 7 题；2025–26 第 6 题）。
// 分镜：三道闸门（零 / 加法 / 数乘）立起 → 2018–19 第 7 题 → W₁ 依次过闸门（每道闸亮绿）→ W₂ 撞在第一道闸（红闪）
//       → GPT 规律卡 → 2025–26 第 6 题 → Leon 记号 P₄（4 维，与同济差一）→ 积分线性三道闸全过
//       → 条件翻译成系数方程：a₀ + a₁/2 + a₂/3 + a₃/4 = 0 → 自由变量轮流取 1 → 三条曲线在 [0,1] 上正负面积抵消（上橙下蓝）
//       → 基 + dim 3 → 评分点 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_shock', 'ds_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q7', 'y2526_q6']);
  const B = base(R, {
    assets, label: '特别篇 4 · 向量空间与子空间', title: '函数和多项式里的子空间', hi: 2, en: 'SUBSPACES OF FUNCTIONS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.6, C07: 0.8, C09: 0.4, C14: 0.6 },
    post: { C01: 1.6, C02: 1.4, D01: 0.6, C03: 1.0, C04: 1.8, C05: 1.6, C06: 1.6, G01: 1.6, C07: 1.4, G02: 1.6, C08: 1.8, D02: 0.6, C09: 1.8, C10: 1.6, C11: 2.0, C12: 2.4, C13: 1.6, G03: 1.8, C14: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const G1 = [cue('C04', '闸门一'), cue('C04', '闸门二'), cue('C05', '闸门三')];
  const G2 = [s('C08') + 0.3, cue('C08', 'p加q的积分'), cue('C08', '阿尔法 p的积分')];
  const tW2 = cue('C06', '不等于x平方');
  const tC = [cue('C11', '令a一等于一'), cue('C11', '令a二等于一'), cue('C11', '令a三等于一')];

  ['含零向量', '加法封闭', '数乘封闭'].forEach(w => TL.sfx('thud', cue('C01', w), 0.28));
  TL.sfx('whoosh', s('C02') + 0.2, 0.3); TL.sfx('stamp', s('C02') + 2.6, 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25);
  [...G1, ...G2].forEach(t => TL.sfx('ding_hi', t + 0.8, 0.25)); TL.sfx('stamp', cue('C05', '三道全过'), 0.3);
  TL.sfx('buzz', tW2, 0.32); TL.sfx('crack', tW2 + 0.2, 0.3); TL.sfx('click', s('G01') + 0.3, 0.3);
  TL.sfx('whoosh', s('C07') + 0.2, 0.3); TL.sfx('stamp', s('C07') + 2.6, 0.3); TL.sfx('pluck', cue('G02', '和同济'), 0.3);
  TL.sfx('pop', s('D02') + 0.2, 0.25); TL.sfx('type', cue('C09', '从零到一积分'), 0.25); TL.sfx('ding', cue('C10', '维数就是三'), 0.3);
  tC.forEach(t => { TL.sfx('swoosh_in', t, 0.25); TL.sfx('marimba', t + 1.0, 0.25); });
  TL.sfx('shimmer', s('C12') + 0.3, 0.3); TL.sfx('impact', s('C13') + 0.3, 0.3); TL.sfx('zap', s('G03') + 0.3, 0.25); TL.sfx('swell', s('C14') - 0.2, 0.3);

  // 三道闸门；pass[k] 时刻 → 绿；fail 时刻 → 红
  function gates(x, y, a, pass, fail = null, label = null) {
    if (a <= 0) return;
    ['① 含 0', '② 加法封闭', '③ 数乘封闭'].forEach((tx, k) => { const gx = x - 300 + k * 300;
      let col = C.inkMid; if (pass && B.t > pass[k] + 0.8) col = C.j; if (fail && k === 0 && B.t > fail) col = C.free;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(gx - 70, y + 60); ctx.lineTo(gx - 70, y - 50); ctx.lineTo(gx + 70, y - 50); ctx.lineTo(gx + 70, y + 60); ctx.stroke();
      if (col !== C.inkMid) { ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.stroke(); } ctx.restore();
      ctag(tx, gx, y + 95, { px: 24, a, color: col === C.inkMid ? C.ink : col }); });
    if (label) ctag(label, x - 520, y, { px: 34, a, color: C.peri, font: F.serif });
    // 小球穿闸
    if (pass) { let px = x - 460; pass.forEach((t, k) => { px = lerp(px, x - 300 + k * 300 + 120, smoother(prog(B.t, t, t + 0.8))); });
      if (fail) px = lerp(x - 460, x - 380, smoother(prog(B.t, fail - 0.6, fail))) - (B.t > fail ? 30 * smoother(prog(B.t, fail, fail + 0.3)) : 0);
      B.dot(px, y, 16, fail ? C.free : C.peri, a); }
  }

  function shotW() {
    const a = B.win(s('C01'), s('C07') - 0.3); if (a <= 0) return;
    const pre = B.t < s('C02') + 1;
    gates(DX + 60, pre ? DY : DY - 200, a * gin(cue('C01', '含零向量')), null);
    const gq = a * gin(s('C02') + 1.2);
    ctag('C²[−1, 1]：W₁ = {f″ + f = 0}，W₂ = {f″ + f = x²}', DX, DY - 330, { px: 30, a: gq, font: F.serif });
    K.pill('不用解方程：闸门只问性质', DX, DY - 50, C.peri, a * B.win(s('C03'), s('C04')), 28);
    const g1 = a * B.win(s('C04') - 0.3, s('C06') - 0.1);
    if (g1 > 0) {
      gates(DX + 60, DY - 200, g1, G1, null, 'W₁');
      [['0″ + 0 = 0 ✓', G1[0]], ['(f+g)″ + (f+g) = (f″+f) + (g″+g) = 0 ✓', G1[1]], ['(αf)″ + αf = α(f″ + f) = 0 ✓', G1[2]]].forEach(([tx, t], k) =>
        ctag(tx, DX, DY - 10 + k * 60, { px: 30, a: g1 * gin(t), color: C.j, font: F.serif }));
      K.redStamp('子空间', DX + 380, DY + 220, prog(B.t, cue('C05', '三道全过'), cue('C05', '三道全过') + 0.5), g1 * gin(cue('C05', '三道全过')), OK, 44);
    }
    const g2 = a * gin(s('C06'));
    if (g2 > 0) {
      gates(DX + 60, DY - 200, g2, [1e9, 1e9, 1e9], tW2, 'W₂');
      ctag('0″ + 0 = 0 ≠ x²', DX, DY + 20, { px: 40, a: g2 * gin(cue('C06', '零函数代进去')), color: C.free, font: F.serif });
      if (B.t > tW2) B.flash(tW2, 0.2, 0.3, C.free);
      const gG = a * gin(s('G01'));
      B.card(DX, DY + 170, 860, 120, gG * 0.95, C.gpt);
      ctag('右边 = 0 的线性方程 → 解集一定是子空间', DX, DY + 145, { px: 28, a: gG, color: C.gpt });
      ctag('右边 ≠ 0 → 第一道闸就过不去（先查零，最快）', DX, DY + 195, { px: 26, a: gG * gin(cue('G01', '右边不是零')), color: C.gpt });
    }
  }

  function plotPoly(ox, oy, w, h, f, col, a, u = 1) {
    if (a <= 0) return;
    const X = x => ox + x * w, Y = y => oy - y * h, N = 60;
    B.line2([ox - 20, oy], [ox + w + 20, oy], C.inkMid, a * 0.6, 2); B.line2([ox, oy - h * 0.9], [ox, oy + h * 0.6], C.inkMid, a * 0.6, 2);
    ctx.save(); ctx.globalAlpha = a * 0.45 * u;
    for (let i = 0; i < N; i++) { const x0 = i / N, x1 = (i + 1) / N, y = f((x0 + x1) / 2); ctx.fillStyle = y >= 0 ? C.peri : C.k; ctx.fillRect(X(x0), Math.min(Y(0), Y(y)), w / N + 0.5, Math.abs(Y(y) - Y(0))); }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= N; i++) { const x = -0.1 + 1.2 * i / N; i ? ctx.lineTo(X(x), Y(f(x))) : ctx.moveTo(X(x), Y(f(x))); } ctx.stroke(); ctx.restore();
    ctag('0', X(0), oy + 24, { px: 18, a, color: C.inkMid }); ctag('1', X(1), oy + 24, { px: 18, a, color: C.inkMid });
  }

  function shotP() {
    const a = B.win(s('C07') + 0.6, s('C14') - 0.2); if (a <= 0) return;
    B.qhead('2025–26 · 第 6 题 · 12 分：S = {p ∈ P₄ | ∫₀¹ p dx = 0}', a);
    const gG = a * B.win(s('G02'), s('C08'));
    if (gG > 0) { ctag('P₄ = {a₀ + a₁x + a₂x² + a₃x³}：次数 < 4，4 维', DX, DY - 200, { px: 32, a: gG, color: C.ink, font: F.serif });
      ctag('Leon P₄  ↔  同济 P[x]₃（记号差一）', DX, DY - 120, { px: 30, a: gG * gin(cue('G02', '和同济')), color: C.gpt }); }
    const g8 = a * B.win(s('C08'), s('C09') - 0.1);
    if (g8 > 0) {
      gates(DX + 60, DY - 180, g8, G2, null, 'S');
      [['∫ 0 = 0 ✓', G2[0]], ['∫(p + q) = ∫p + ∫q = 0 ✓', G2[1]], ['∫ αp = α ∫ p = 0 ✓', G2[2]]].forEach(([tx, t], k) => ctag(tx, DX, DY + 20 + k * 60, { px: 30, a: g8 * gin(t), color: C.j, font: F.serif }));
      K.pill('原因只有一个：积分是线性的', DX, DY + 230, C.peri, g8 * gin(cue('C08', '积分是线性的')), 28);
    }
    const g9 = a * gin(s('C09'));
    if (g9 > 0) {
      ctag('∫₀¹ p = a₀ + a₁/2 + a₂/3 + a₃/4 = 0', DX, DY - 230, { px: 40, a: g9 * gin(cue('C09', '从零到一积分')), color: C.i, font: F.serif });
      const g10 = g9 * gin(s('C10'));
      ctag('1 个方程 · 4 个未知数 → a₁、a₂、a₃ 自由 → dim S = 3', DX, DY - 160, { px: 28, a: g10, color: C.ink });
      const fs = [x => x - 1 / 2, x => x * x - 1 / 3, x => x * x * x - 1 / 4], nm = ['x − ½', 'x² − ⅓', 'x³ − ¼'], cols = [C.peri, C.j, C.k];
      fs.forEach((f, k) => { const g = g9 * gin(tC[k]); const ox = DX - 470 + k * 340, oy = DY + 90;
        ctag(['a₁ = 1 → a₀ = −½', 'a₂ = 1 → a₀ = −⅓', 'a₃ = 1 → a₀ = −¼'][k], ox + 125, DY - 90, { px: 24, a: g, color: cols[k], font: F.serif });
        plotPoly(ox, oy, 250, 200, f, cols[k], g, gin(s('C12'))); ctag(nm[k], ox + 125, oy + 70, { px: 32, a: g * gin(tC[k] + 1), color: cols[k], font: F.serif }); });
      ctag('上方面积 = 下方面积 → 积分为 0', DX, DY + 200, { px: 28, a: g9 * gin(s('C12')) * (1 - gin(s('C13'))), color: C.i });
      B.xcard('基：{x − ½, x² − ⅓, x³ − ¼}，dim S = 3', DX, DY + 210, 760, 76, g9 * gin(s('C13')) * (1 - gin(s('G03'))), OK, 32, OK);
      const gG3 = a * gin(s('G03'));
      B.card(DX, DY + 230, 900, 120, gG3 * 0.95, C.gpt);
      ctag('无关：次数各不相同', DX, DY + 205, { px: 26, a: gG3 * gin(cue('G03', '无关')), color: C.gpt });
      ctag('张成：p = a₁(x − ½) + a₂(x² − ⅓) + a₃(x³ − ¼)（a₀ 正好被消掉）', DX, DY + 255, { px: 24, a: gG3 * gin(cue('G03', '张成')), color: C.gpt, font: F.serif });
    }
  }

  function shotOutro() {
    const a = B.win(s('C14'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 子空间', ['① 三道闸门，先查零', '② 线性条件的解集一定是子空间', '③ 求基：翻译成系数方程，自由变量轮流取 1'],
      [s('C14') + 0.3, cue('C14', '线性条件的解集'), cue('C14', '求基')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotW(); shotP(); shotOutro();
      B.paper(EX, 'y1819_q7', { t0: s('C02') + 0.2, dock: s('C02') + 1.2, out: s('C07') - 0.4 });
      B.paper(EX, 'y2526_q6', { t0: s('C07') + 0.2, dock: s('G02'), out: s('C14') - 0.4 });
    });
  }
  return { TL, draw };
}
