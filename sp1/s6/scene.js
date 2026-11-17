// 特别篇 1 · 第 6 段：矩阵方程——左乘还是右乘（2020–21 第 2 题，10 分）。
// 分镜：原题三步 → 二阶求逆动画（主对角换位、副对角变号、÷det）→ X = A⁻¹B（左侧“乘入”箭头）
//       → 行 × 列扫描逐格算出 X → 大肥鱼写 Y(A − 1)，红波浪线 + “矩阵 − 数 = 未定义”
//       → 补 I → 积木：(A − I)⁻¹ 贴到 B 左边卡不进去、抖动弹开，挪到右边咔哒贴合
//       → (A − I)⁻¹ 分数 → B 逐行相乘 → Y → 第一行验算 → 三连快问翻牌 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_confused', 'ds_proud', 'ds_think', 'gpt_cross', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y2021_q2']);
  const B = base(R, {
    assets, label: '特别篇 1 · 方程组与参数讨论', title: '左乘还是右乘', hi: 6, en: '2020–21 · Q2 · 10 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C03: 0.4, C05: 0.4, D01: 0.6, C09: 0.4, C11: 0.4, C15: 0.8, C19: 0.6 },
    post: { C02: 1.0, C03: 1.6, C04: 1.4, C05: 1.2, C06: 1.6, C07: 1.6, G01: 1.0, C08: 1.2, C09: 1.8, C10: 1.6, C11: 1.6, C12: 1.4, C13: 1.4, C14: 1.6, G02: 1.4, D04: 1.4, D05: 1.4, D06: 1.6, C18: 1.2, C19: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tSwap = cue('C03', '主对角线换位置'), tNeg = cue('C03', '副对角线变号'), tDiv = cue('C03', '再除以行列式');
  const tScan = ['点乘一、三，得负一', '点乘二、四，得零', '负五、三', '点乘二、四，得二'];
  const tBlk = s('D02') + 0.4, tFix = cue('C09', '从右边乘上');

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  TL.sfx('tick', cue('C02', '第一问'), 0.25); TL.sfx('tick', cue('C02', '第二问'), 0.25);
  TL.sfx('ding', cue('C03', '等于一'), 0.3); TL.sfx('swoosh_soft', tSwap, 0.3); TL.sfx('zap', tNeg, 0.25); TL.sfx('pop', tDiv, 0.25);
  TL.sfx('impact', s('C04') + 0.2, 0.3); TL.sfx('swoosh_in', cue('C05', '从左边乘上'), 0.3);
  ['得负一', '得零', '得四', '得二'].forEach(w => TL.sfx('marimba', cue('C06', w), 0.25)); TL.sfx('ding_hi', s('C07') + 0.2, 0.3);
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('slam', s('G01') + 0.1, 0.3); TL.sfx('buzz', s('G01') + 0.3, 0.22);
  TL.sfx('click', cue('C08', 'Y乘单位矩阵'), 0.3);
  TL.sfx('pop', tBlk, 0.25); TL.sfx('buzz', tBlk + 1.0, 0.3); TL.sfx('thud', tBlk + 1.2, 0.25);
  TL.sfx('whoosh', tFix, 0.3); TL.sfx('click', tFix + 0.8, 0.35); TL.sfx('ding_hi', s('C10') + 0.2, 0.3);
  TL.sfx('pop', cue('C11', '它的逆等于'), 0.25); TL.sfx('tick2', cue('C12', '也就是三'), 0.3); TL.sfx('tick2', cue('C13', '也就是三分之十七'), 0.3);
  TL.sfx('impact', s('C14') + 0.2, 0.3); TL.sfx('check', cue('G02', '正是B的第一行'), 0.3);
  ['C15', 'C16', 'C17'].forEach(id => TL.sfx('swoosh_soft', s(id) + 0.1, 0.3)); ['D04', 'D05', 'D06'].forEach(id => TL.sfx('ding', e(id) + 0.1, 0.3));
  TL.sfx('check', s('C18') + 0.2, 0.3); TL.sfx('swell', s('C19') - 0.2, 0.3);

  // ════ 求 A⁻¹ ════
  function shotInv() {
    const a = B.win(s('C02'), s('C05') - 0.2); if (a <= 0) return;
    B.qhead('2020–2021 期中 · 第 2 题 · 10 分', a);
    const g = a * gin(s('C02'));
    B.mat(DX - 250, DY - 240, [[3, 1], [5, 2]], { px: 38, a: g }); ctag('A =', DX - 360, DY - 240, { px: 32, a: g, font: F.serif });
    B.mat(DX + 150, DY - 240, [[1, 2], [3, 4]], { px: 38, a: g }); ctag('B =', DX + 40, DY - 240, { px: 32, a: g, font: F.serif });
    K.pill('(a) AX = B', DX - 200, DY - 120, C.i, a * gin(cue('C02', '第一问')), 26); K.pill('(b) YA − Y = B', DX + 200, DY - 120, C.peri, a * gin(cue('C02', '第二问')), 26);
    const gi = a * gin(s('C03'));
    if (gi > 0) {
      ctag('det A = 3·2 − 1·5 = 1', DX, DY - 20, { px: 34, a: a * gin(cue('C03', '三乘二')), color: C.i, font: F.serif });
      // 动画矩阵：交换 + 变号
      const sw = smoother(prog(B.t, tSwap, tSwap + 0.9)), ng = gin(tNeg, 0.4);
      const cx = DX - 60, cy = DY + 140, d = 70;
      ctx.save(); ctx.globalAlpha = gi; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
      [[-1, 1], [1, -1]].forEach(([sx]) => { const x = cx + sx * 110; ctx.beginPath(); ctx.moveTo(x - sx * -10, cy - 90); ctx.lineTo(x, cy - 90); ctx.lineTo(x, cy + 90); ctx.lineTo(x - sx * -10, cy + 90); ctx.stroke(); });
      ctx.restore();
      const p3 = [lerp(cx - d, cx + d, sw), lerp(cy - 45, cy + 45, sw) - Math.sin(Math.PI * sw) * 60], p2 = [lerp(cx + d, cx - d, sw), lerp(cy + 45, cy - 45, sw) + Math.sin(Math.PI * sw) * 60];
      ctag('3', ...p3, { px: 40, a: gi, color: sw > 0 && sw < 1 ? C.i : C.ink, font: F.serif }); ctag('2', ...p2, { px: 40, a: gi, color: sw > 0 && sw < 1 ? C.i : C.ink, font: F.serif });
      ctag(ng > 0.5 ? '−1' : '1', cx + d, cy - 45, { px: 40, a: gi, color: ng > 0 && B.t < tNeg + 1.5 ? C.free : C.ink, font: F.serif });
      ctag(ng > 0.5 ? '−5' : '5', cx - d, cy + 45, { px: 40, a: gi, color: ng > 0 && B.t < tNeg + 1.5 ? C.free : C.ink, font: F.serif });
      ctag('÷ 1', cx + 190, cy, { px: 36, a: gi * gin(tDiv), color: C.i, font: F.serif });
      ctag('A⁻¹ =', cx - 200, cy, { px: 34, a: a * gin(s('C04')), color: OK, font: F.serif });
      B.burst(cx, cy, s('C04') + 0.2, OK, { r1: 200 });
    }
  }

  // ════ X = A⁻¹B ════
  function shotX() {
    const a = B.win(s('C05'), s('D01') - 0.2); if (a <= 0) return;
    const ge = a * gin(cue('C05', '从左边乘上'));
    ctag('AX = B  ⇒  A⁻¹ · AX = A⁻¹ · B  ⇒  X = A⁻¹B', DX, DY - 300, { px: 34, a: a * gin(s('C05')), font: F.serif });
    arrow(ctx, [DX - 340, DY - 250], [DX - 250, DY - 250], { color: C.i, width: 5, head: 16, alpha: ge }); ctag('左乘', DX - 380, DY - 250, { px: 26, a: ge, color: C.i });
    const y = DY - 40;
    const MI = B.mat(DX - 300, y, [[2, -1], [-5, 3]], { px: 40, a: a * gin(s('C05') + 0.5) });
    const MB = B.mat(DX - 20, y, [[1, 2], [3, 4]], { px: 40, a: a * gin(s('C05') + 0.5) });
    ctag('=', DX + 120, y, { px: 44, a: a * gin(s('C06')), font: F.serif });
    const res = [[-1, 0], [4, 2]], tc = ['得负一', '得零', '得四', '得二'].map(w => cue('C06', w));
    const MX = B.mat(DX + 260, y, res, { px: 40, a: a * gin(s('C06')), cell: (i, j) => ({ a: gin(tc[i * 2 + j]), col: OK }) });
    let cur = -1; tc.forEach((t, k) => { if (B.t > t - 1.2) cur = k; });
    if (cur >= 0 && B.t < s('C07')) { const i = cur >> 1, j = cur & 1; K.rowBox(MI, i, 0, 1, C.i, a, 18); K.colBox(MB, j, 0, 1, C.j, a, 18); K.ring(...MX.cell(i, j), 30, C.peri, a, 1); }
    const gx = a * gin(s('C07'));
    ctag('X =', DX + 260 - 140, y + 180, { px: 36, a: gx, color: OK, font: F.serif });
    B.mat(DX + 260, y + 180, res, { px: 40, a: gx, col: OK, cell: () => ({ col: OK }) });
    B.burst(DX + 260, y + 180, s('C07') + 0.2, OK, { r1: 200 });
  }

  // ════ Y：补 I + 积木 ════
  function block(x, y, w, txt, col, a) { B.card(x, y, w, 90, a, col); ctag(txt, x, y, { px: 40, a, color: col, font: F.serif }); }
  function shotY() {
    const a = B.win(s('D01'), s('C15') - 0.3); if (a <= 0) return;
    // 大肥鱼的错式
    const gw = a * B.win(s('D01') + 0.3, s('C08') + 0.2);
    if (gw > 0) {
      ctag('Y(A − 1) = B', DX, DY - 220, { px: 46, a: gw, color: C.ds, font: F.serif });
      const u = prog(B.t, s('G01'), s('G01') + 0.5);
      if (u > 0) { ctx.save(); ctx.globalAlpha = gw; ctx.strokeStyle = C.free; ctx.lineWidth = 4; ctx.beginPath(); for (let k = 0; k <= 30 * u; k++) { const x = DX + 50 + k * 1.2, yy = DY - 190 + Math.sin(k * 1.2) * 5; k ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); ctx.restore(); }
      ctag('矩阵 − 数：没有定义', DX, DY - 140, { px: 30, a: gw * gin(s('G01') + 0.3), color: C.free });
    }
    const gI = a * B.win(s('C08'), s('C11') - 0.2);
    ctag('YA − Y I = Y(A − I) = B', DX, DY - 220, { px: 44, a: gI * gin(cue('C08', 'Y乘单位矩阵')), color: C.ink, font: F.serif });
    // 积木
    const gk = a * B.win(s('D02'), s('C11') - 0.2);
    if (gk > 0) {
      const y = DY - 20;
      block(DX - 300, y, 110, 'Y', C.ink, gk); block(DX - 130, y, 190, '(A − I)', C.peri, gk); ctag('=', DX, y, { px: 44, a: gk, font: F.serif }); block(DX + 130, y, 110, 'B', C.ink, gk);
      // 逆块：D02 先贴左边（失败），C09 挪到右边
      const u1 = smoother(prog(B.t, tBlk, tBlk + 0.9)), bounce = prog(B.t, tBlk + 1.0, tBlk + 1.6), u2 = smoother(prog(B.t, tFix, tFix + 0.8));
      let x = lerp(DX + 130, DX + 20, u1), yy = lerp(y + 170, y, u1);
      if (bounce > 0) { x += Math.sin(bounce * 40) * 14 * (1 - bounce); yy += bounce * 90 - Math.sin(Math.PI * bounce) * 40; }
      if (u2 > 0) { x = lerp(x, DX + 290, u2); yy = lerp(yy, y, u2) - Math.sin(Math.PI * u2) * 120; }
      block(x, yy, 220, '(A − I)⁻¹', u2 > 0.95 ? OK : bounce > 0 && u2 <= 0 ? C.free : C.j, gk * gin(tBlk - 0.2));
      if (bounce > 0 && bounce < 1 && u2 <= 0) B.cross(DX + 20, y - 80, bounce * 2, gk, 30);
      if (u2 >= 1) B.burst(DX + 290, y, tFix + 0.8, OK, { r1: 160 });
      ctag('在哪边乘进来，就从哪边消掉', DX, y + 230, { px: 30, a: gk * gin(cue('C09', '矩阵不能除')), color: C.peri });
      const g10 = gk * gin(s('C10'));
      B.xcard('Y = B(A − I)⁻¹', DX - 140, DY + 300, 360, 76, g10, OK, 36, OK);
      B.xcard('(A − I)⁻¹B', DX + 250, DY + 300, 260, 76, g10 * gin(cue('C10', '顺序一旦写反')), C.free, 32, C.free);
      B.cross(DX + 250, DY + 300, prog(B.t, cue('C10', '完全不同'), cue('C10', '完全不同') + 0.4), g10, 40);
    }
    // 计算
    const gc = a * B.win(s('C11'), s('C15') - 0.3);
    if (gc > 0) {
      const y = DY - 180;
      ctag('A − I =', DX - 330, y, { px: 30, a: gc, font: F.serif }); B.mat(DX - 200, y, [[2, 1], [5, 1]], { px: 34, a: gc });
      ctag('det = −3', DX - 40, y, { px: 30, a: gc * gin(cue('C11', '行列式二减五')), color: C.i, font: F.serif });
      const gi = gc * gin(cue('C11', '它的逆等于'));
      ctag('(A − I)⁻¹ =', DX + 140, y, { px: 30, a: gi, font: F.serif });
      B.mat(DX + 330, y, [['−⅓', '⅓'], ['5/3', '−⅔']], { px: 34, a: gi * gin(cue('C11', '也就是第一行')), col: C.j, cell: () => ({ col: C.j }) });
      K.type('(1, 2)·(A − I)⁻¹ = (−⅓ + 10/3, ⅓ − 4/3) = (3, −1)', DX - 400, DY - 40, s('C12') + 0.2, 2.2, gc, { px: 28 });
      K.type('(3, 4)·(A − I)⁻¹ = (−1 + 20/3, 1 − 8/3) = (17/3, −5/3)', DX - 400, DY + 20, s('C13') + 0.2, 2.2, gc, { px: 28 });
      const gy = gc * gin(s('C14'));
      ctag('Y =', DX - 120, DY + 150, { px: 38, a: gy, color: OK, font: F.serif });
      B.mat(DX + 30, DY + 150, [[3, -1], ['17/3', '−5/3']], { px: 38, a: gy, cell: () => ({ col: OK }) });
      B.burst(DX + 30, DY + 150, s('C14') + 0.2, OK, { r1: 220 });
      const gv = gc * gin(s('G02'));
      B.card(DX, DY + 310, 820, 76, gv * 0.95, C.gpt);
      ctag('验算：(3, −1)(A − I) = (6 − 5, 3 − 1) = (1, 2) = B 第一行 ✓', DX, DY + 310, { px: 26, a: gv, color: C.gpt, font: F.serif });
    }
  }

  // ════ 三连快问 ════
  function shotQuiz() {
    const a = B.win(s('C15'), s('C19') - 0.2); if (a <= 0) return;
    const Q = [['XA = B', 'X = BA⁻¹', 'C15', 'D04'], ['AXB = C', 'X = A⁻¹CB⁻¹', 'C16', 'D05'], ['XA + B = X', 'X = −B(A − I)⁻¹', 'C17', 'D06']];
    Q.forEach(([q, ans, cq, ca], k) => {
      const x = DX - 300 + k * 300, y = DY - 60, g = a * gin(s(cq));
      if (g <= 0) return;
      const fl = prog(B.t, e(ca) - 0.2, e(ca) + 0.4), sx = Math.abs(Math.cos(Math.PI * fl)), back = fl > 0.5;
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-x, -y);
      B.card(x, y, 270, 220, g, back ? OK : C.peri);
      ctag(back ? ans : q, x, y, { px: back ? 30 : 36, a: g, color: back ? OK : C.ink, font: F.serif });
      ctx.restore();
      ctag(`${k + 1}`, x, y - 140, { px: 28, a: g, color: C.peri, font: F.serif });
    });
    ctag('前提：A、B、A − I 可逆（答卷要写）', DX, DY + 200, { px: 30, a: a * gin(cue('C18', '前提')), color: C.i });
  }

  function shotOutro() {
    const a = B.win(s('C19'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 矩阵方程', ['① 提公因子要补 I：YA − Y = Y(A − I)', '② 矩阵在哪边，就从哪边乘逆', '③ 答案有分数 → 至少验算一行'],
      [s('C19') + 0.3, cue('C19', '矩阵在哪边'), cue('C19', '答案有分数')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotInv(); shotX(); shotY(); shotQuiz(); shotOutro();
      B.paper(EX, 'y2021_q2', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C15') - 0.4 });
    });
  }
  return { TL, draw };
}
