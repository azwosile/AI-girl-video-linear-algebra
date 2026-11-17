// 特别篇 2 · 第 4 段：初等矩阵是“操作印章”（2018–19 第 2 题，14 分）。
// 分镜：原题三步 → 印章比喻：I 上做行操作 = 刻印面 → E₁ 从 I 变形 → 印章盖到 A 上（第二行变形）
//       → “点名”动画：E₁ 第二行 (−3, 1, 0) 三根丝线点名 A 的三行 → 左乘 = 行，右乘 = 列
//       → E₂、E₃ 依次刻好盖下 → U（⅓ 主元）→ det = 1 检查 → L = E₁⁻¹E₂⁻¹E₃⁻¹：三枚逆印章叠放，数字原位落进 L
//       → 评分点 → A⁻¹（整数）+ 验算 → 两条路解 Ax = b，结果对上 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_ask', 'ds_confused', 'ds_happy', 'gpt_point', 'gpt_proud', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q2']);
  const B = base(R, {
    assets, label: '特别篇 2 · LU 与初等矩阵', title: '初等矩阵 = 操作印章', hi: 4, en: '2018–19 · Q2 · 14 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C05: 0.4, C07: 0.6, C11: 0.6, C14: 0.6, C15: 0.6, G03: 0.6 },
    post: { C01: 1.2, C02: 1.2, C03: 1.6, C04: 1.6, C05: 1.8, C06: 1.4, C07: 1.6, C08: 1.8, C09: 1.6, C10: 1.4, C11: 1.6, C12: 1.8, C13: 1.6, G01: 1.4, C14: 1.6, G02: 1.4, C15: 1.6, C16: 1.6, D04: 1.0, G03: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const A0 = [[1, 0, 1], [3, 3, 4], [2, 2, 3]];
  const ST = [A0, [[1, 0, 1], [0, 3, 1], [2, 2, 3]], [[1, 0, 1], [0, 3, 1], [0, 2, 1]], [[1, 0, 1], [0, 3, 1], [0, 0, '⅓']]];
  const TS = [0, cue('C04', '变成零'), cue('C07', '变成零'), cue('C08', '等于零、零')];
  const E = [
    [[1, 0, 0], ['−3', 1, 0], [0, 0, 1], [1, 0], 'E₁', 'r₂ − 3r₁'],
    [[1, 0, 0], [0, 1, 0], ['−2', 0, 1], [2, 0], 'E₂', 'r₃ − 2r₁'],
    [[1, 0, 0], [0, 1, 0], [0, '−⅔', 1], [2, 1], 'E₃', 'r₃ − ⅔r₂'],
  ];
  const tE = [cue('C03', '所以E一'), cue('C07', 'E二的三行'), cue('C08', 'E三的三行')];
  const tStamp = [cue('C04', '盖在A上'), s('C07') + 0.3, s('C08') + 0.3];

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('sting', s('D01') + 0.2, 0.2);
  TL.sfx('shimmer', cue('C02', '一枚印章'), 0.3); TL.sfx('type', cue('C02', '怎么刻'), 0.25);
  TL.sfx('swoosh_soft', cue('C03', '第二行变成'), 0.3); tStamp.forEach(t => { TL.sfx('whoosh', t, 0.25); TL.sfx('stamp', t + 0.6, 0.35); });
  TL.sfx('pop', s('D02') + 0.2, 0.25); [0, 1, 2].forEach(k => TL.sfx('laser', cue('C05', '去点名') + k * 0.45, 0.25)); TL.sfx('ding_hi', cue('C05', '正好就是'), 0.3);
  TL.sfx('click', cue('C06', '左乘'), 0.3); TL.sfx('click', cue('C06', '右乘'), 0.3);
  TL.sfx('impact', s('C09') + 0.2, 0.3); TL.sfx('pop', s('D03') + 0.2, 0.25); TL.sfx('check', cue('C10', '等于一'), 0.3);
  TL.sfx('swoosh_soft', cue('C11', '两边依次左乘逆'), 0.3);
  [0, 1, 2].forEach(k => { TL.sfx('swoosh_in', cue('C12', '叠起来') + k * 0.5, 0.25); TL.sfx('pluck', cue('C12', '直接落进L') + k * 0.3, 0.28); });
  TL.sfx('ding_hi', s('C13') + 0.3, 0.3); TL.sfx('zap', cue('G01', '扣一半'), 0.25);
  TL.sfx('impact', cue('C14', '算出来是'), 0.3); ['一加零等于一', '二减二等于零', '负三加三等于零'].forEach(w => TL.sfx('check', cue('G02', w), 0.28));
  TL.sfx('ding', cue('C15', '也就是零、三、负二'), 0.3); TL.sfx('ding_hi', cue('C16', '两条路对得上'), 0.3);
  TL.sfx('stamp', s('D04') + 0.3, 0.3); TL.sfx('swell', s('G03') - 0.2, 0.3);

  // 印章：圆角方框里放 3×3
  function seal(x, y, M, a, col, { flip = 0, px = 28, label = null } = {}) {
    if (a <= 0) return;
    const sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * flip)));
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1); ctx.translate(-x, -y);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(col, 0.12); ctx.strokeStyle = col; ctx.lineWidth = 5;
    const w = 210, h = 190; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - h / 2, w, h, 22) : ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill(); ctx.stroke(); ctx.restore();
    B.mat(x, y, M, { px, a, cell: (i, j) => (i !== j && String(M[i][j]) !== '0') ? { col } : null });
    ctx.restore();
    if (label) ctag(label, x, y - 125, { px: 28, a, color: col, font: F.serif });
  }

  function shotSeal() {
    const a = B.win(s('C02'), s('C09') - 0.2); if (a <= 0) return;
    // I → E₁（刻印）
    const tc = cue('C03', '第二行变成'), u = gin(tc, 0.8);
    const g2 = a * gin(cue('C02', '一枚印章')) * (1 - gin(s('C04') - 0.2));
    if (g2 > 0) {
      const M = u < 0.5 ? [[1, 0, 0], [0, 1, 0], [0, 0, 1]] : E[0].slice(0, 3);
      seal(DX - 200, DY - 120, M, g2, C.peri, { label: u < 0.5 ? 'I' : 'E₁', px: 32 });
      ctag('对 I 做这个行操作 = 刻好的印面', DX + 160, DY - 160, { px: 28, a: g2 * gin(cue('C02', '怎么刻')), color: C.ink });
      ctag('r₂ − 3r₁', DX + 160, DY - 90, { px: 36, a: g2 * gin(s('C03') + 0.3), color: C.peri, font: F.serif });
    }
    // 三枚印章 + A 的变化
    const gA = a * gin(s('C04') - 0.2);
    if (gA > 0) {
      let k = 0; for (let q = 1; q < 4; q++) if (B.t >= TS[q]) k = q;
      const MA = B.mat(DX + 220, DY + 60, ST[k], { px: 38, a: gA, cell: (i, j) => {
        const ch = k > 0 && String(ST[k][i][j]) !== String(ST[k - 1][i][j]); return ch ? { col: C.j } : null; } });
      ctag(['A', 'E₁A', 'E₂E₁A', 'E₃E₂E₁A = U'][k], DX + 220, DY + 60 - MA.h / 2 - 34, { px: 28, a: gA, color: k === 3 ? OK : C.inkMid, font: F.serif });
      E.forEach(([r0, r1, r2, pos, lab, op], q) => {
        const gq = gA * gin(q === 0 ? s('C04') - 0.2 : tE[q] - 0.6); if (gq <= 0) return;
        const st = prog(B.t, tStamp[q], tStamp[q] + 0.6), back = smoother(prog(B.t, tStamp[q] + 0.9, tStamp[q] + 1.5));
        const hx = DX - 300 + q * 0, hy = DY - 230 + q * 0;
        const x = lerp(lerp(hx, DX + 220, smoother(Math.min(1, st * 1.4))), DX - 330 + q * 120, back), y = lerp(lerp(hy, DY + 40, smoother(st)), DY + 250, back);
        const sc = lerp(lerp(1, 0.85, st), 0.55, back);
        ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y);
        seal(x, y, [r0, r1, r2], gq, [C.peri, C.j, C.k][q], { label: lab + '  ' + op });
        ctx.restore();
        if (st > 0.6 && st < 1) B.flash(tStamp[q] + 0.4, 0.15, 0.3);
        if (q === 0) B.burst(DX + 220, DY + 60, tStamp[q] + 0.6, C.peri, { r1: 200 });
      });
    }
    // 点名
    const gn = a * B.win(s('C05'), s('C07') - 0.2);
    if (gn > 0) {
      const y = DY - 210; ctag('E₁ 的第 2 行 (−3, 1, 0) 点名 A 的三行：', DX, y, { px: 28, a: gn, color: C.ink });
      [['−3 × (1, 0, 1)', C.free], ['+ 1 × (3, 3, 4)', C.i], ['+ 0 × (2, 2, 3)', C.inkMid]].forEach(([tx, col], k) => ctag(tx, DX - 280 + k * 280, y + 60, { px: 28, a: gn * gin(cue('C05', '去点名') + k * 0.45), color: col, font: F.serif }));
      ctag('= (0, 3, 1)  =  r₂ − 3r₁', DX, y + 120, { px: 32, a: gn * gin(cue('C05', '正好就是')), color: OK, font: F.serif });
      const g6 = gn * gin(s('C06'));
      K.pill('左乘 EA → 对行动手', DX - 200, DY - 300, C.peri, g6 * gin(cue('C06', '左乘')), 26);
      K.pill('右乘 AE → 对列动手', DX + 200, DY - 300, C.k, g6 * gin(cue('C06', '右乘')), 26);
    }
    // ⅓ + det
    const gd = a * B.win(s('D03'), s('C11') - 0.2);
    ctag('det A = 1 · 3 · ⅓ = 1 ✓  分数主元很正常', DX, DY - 220, { px: 32, a: gd * gin(cue('C10', '等于一')), color: C.i, font: F.serif });
  }

  // L = E₁⁻¹E₂⁻¹E₃⁻¹
  function shotL() {
    const a = B.win(s('C11'), s('C14') - 0.2); if (a <= 0) return;
    ctag('E₃E₂E₁A = U  ⇒  A = E₁⁻¹E₂⁻¹E₃⁻¹ U', DX, DY - 330, { px: 34, a: a * gin(cue('C11', '两边依次左乘逆')), font: F.serif });
    ctag('L = E₁⁻¹E₂⁻¹E₃⁻¹', DX, DY - 270, { px: 38, a: a * gin(cue('C11', '所以L等于')), color: C.peri, font: F.serif });
    const inv = [[[1, 0, 0], ['3', 1, 0], [0, 0, 1]], [[1, 0, 0], [0, 1, 0], ['2', 0, 1]], [[1, 0, 0], [0, 1, 0], [0, '⅔', 1]]];
    const tf = cue('C12', '把刻的数变号'), tst = cue('C12', '叠起来'), tL = cue('C12', '直接落进L');
    inv.forEach((M, q) => {
      const fl = prog(B.t, tf + q * 0.3, tf + 0.6 + q * 0.3), stack = smoother(prog(B.t, tst + q * 0.5, tst + 0.6 + q * 0.5));
      const x = lerp(DX - 300 + q * 300, DX, stack), y = lerp(DY - 80, DY - 40, stack);
      const showM = fl > 0.5 ? M : E[q].slice(0, 3);
      seal(x, y, showM, a * (1 - gin(tL + 1.0) * 0.85), [C.peri, C.j, C.k][q], { flip: fl, label: stack < 0.5 ? (fl > 0.5 ? E[q][4] + '⁻¹' : E[q][4]) : null });
    });
    const gl = a * gin(tL + 0.6);
    if (gl > 0) {
      const ML = B.mat(DX, DY + 170, [[1, 0, 0], ['3', 1, 0], ['2', '⅔', 1]], { px: 40, a: gl, cell: (i, j) => i > j ? { col: i === 1 ? C.peri : j === 0 ? C.j : C.k } : null });
      ctag('L =', DX - ML.w / 2 - 60, DY + 170, { px: 34, a: gl, color: C.peri, font: F.serif });
      B.burst(DX, DY + 170, tL + 0.8, C.peri, { r1: 240 });
      ctag('= 上一段的“乘数归位”', DX, DY + 290, { px: 26, a: a * gin(s('C13') + 1), color: C.i });
    }
    const gG = a * gin(s('G01'));
    B.card(DX, DY + 340, 860, 70, gG * 0.95, C.gpt); ctag('评分点：写出 E₁⁻¹、E₂⁻¹、E₃⁻¹ 再相乘；只写 L 扣一半', DX, DY + 340, { px: 26, a: gG, color: C.gpt });
  }

  function shotInv() {
    const a = B.win(s('C14'), s('G03') - 0.2); if (a <= 0) return;
    const g = a * gin(cue('C14', '算出来是'));
    ctag('det A = 1 ⇒ A⁻¹ 全是整数', DX, DY - 320, { px: 30, a: a * gin(s('C14')), color: C.i });
    const MI = B.mat(DX + 120, DY - 190, [[1, 2, -3], [-1, 1, -1], [0, -2, 3]], { px: 36, a: g, cell: () => ({ col: OK }) });
    ctag('A⁻¹ =', DX + 120 - MI.w / 2 - 70, DY - 190, { px: 32, a: g, color: OK, font: F.serif });
    const gv = a * B.win(s('G02'), s('C15') + 0.4);
    if (gv > 0) ['一加零等于一', '二减二等于零', '负三加三等于零'].forEach((w, j) => { const t = cue('G02', w); if (B.t > t - 0.5 && B.t < t + 1.5) K.colBox(MI, j, 0, 2, C.gpt, gv, 16);
      ctag(['1 + 0 = 1 ✓', '2 − 2 = 0 ✓', '−3 + 3 = 0 ✓'][j], DX - 300 + j * 300, DY - 40, { px: 28, a: gv * gin(t), color: C.gpt, font: F.serif }); });
    const g15 = a * gin(s('C15'));
    if (g15 > 0) {
      ctag('b = (−2, 1, 0)ᵀ', DX, DY + 20, { px: 32, a: g15, font: F.serif });
      B.xcard('路 ①  x = A⁻¹b = (0, 3, −2)ᵀ', DX - 210, DY + 130, 400, 76, g15 * gin(cue('C15', '直接乘')), OK, 28, OK);
      B.xcard('路 ②  LU：y = (−2, 7, −⅔) → x = (0, 3, −2)ᵀ', DX + 210, DY + 230, 420, 76, a * gin(s('C16') + 0.3), C.i, 24, C.i);
      B.stamp(DX + 330, DY + 110, true, prog(B.t, cue('C16', '两条路对得上'), cue('C16', '两条路对得上') + 0.5), a * gin(s('C16')), '对上');
    }
  }

  function shotOutro() {
    const a = B.win(s('G03'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 初等矩阵', ['① E = 对 I 做同样的行操作', '② 左乘 = 行操作', '③ E⁻¹：把刻的数变号', '④ L = E₁⁻¹E₂⁻¹E₃⁻¹（按这个顺序）'],
      [s('G03') + 0.3, cue('G03', '左乘是行操作'), cue('G03', '逆是数字变号'), cue('G03', 'L等于')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotSeal(); shotL(); shotInv(); shotOutro();
      B.paper(EX, 'y1819_q2', { t0: s('C01') + 0.2, dock: s('D01'), out: s('G03') - 0.4 });
    });
  }
  return { TL, draw };
}
