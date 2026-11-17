// 特别篇 2 · 第 1 段：同一个矩阵考了两次（2021–22 第 4 题 = 2023–24 第 5 题）。
// 分镜：热力图 LU 行七格全亮 → 两张原题并排，逐个数字连线比对 → “一模一样”印章
//       → 乘数规则卡 → 消元板三步，乘数沿弧线飞进 L 的空位（−2、3、−2）→ “撤销”双向箭头
//       → L、U 成型 + 验一行 → [A | I] 同步消元（前半程 = LU，右半边出 L⁻¹）→ 从下往上回代
//       → 大肥鱼除以 2 被抓：主元是 −2，符号全翻（故障）→ A⁻¹ → 验算 → det = 主元之积 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_confused', 'ds_proud', 'ds_shock', 'ds_think', 'gpt_cross', 'gpt_point', 'gpt_proud', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y2122_q4', 'y2324_q5']);
  const B = base(R, {
    assets, label: '特别篇 2 · LU 与初等矩阵', title: '同一个矩阵考了两次', hi: 1, en: '2021–22 Q4 = 2023–24 Q5',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.6, C04: 0.4, C05: 0.6, C10: 0.6, C11: 0.8, D04: 0.4, G06: 0.6 },
    post: { G01: 1.2, D01: 1.0, C03: 1.2, C04: 1.6, C05: 1.4, C06: 1.6, C07: 1.6, G02: 1.4, C08: 1.8, C09: 1.8, C10: 1.8, G03: 1.4, C12: 1.2, C13: 1.6, C14: 1.6, C15: 1.8, C16: 1.8, C17: 1.6, C18: 1.8, G05: 1.4, C19: 1.6, G06: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const A = [[-2, 1, 2], [4, 1, -2], [-6, -3, 4]];
  const S = [A, [[-2, 1, 2], [0, 3, 2], [-6, -3, 4]], [[-2, 1, 2], [0, 3, 2], [0, -6, -2]], [[-2, 1, 2], [0, 3, 2], [0, 0, 2]]];
  const T = [0, cue('C06', '新的第二行'), cue('C08', '做第三行减去'), cue('C09', '做第三行减去')];
  const OPS = [null, [[1, 'r₂ − (−2)r₁']], [[2, 'r₃ − 3r₁']], [[2, 'r₃ − (−2)r₂']]];
  const LF = [[1, 0, cue('C06', '乘数负二'), '−2'], [2, 0, cue('C08', '三飞进'), '3'], [2, 1, cue('C09', '负二飞进'), '−2']];
  const f = x => x;
  const SI = [
    [[-2, 1, 2, 1, 0, 0], [4, 1, -2, 0, 1, 0], [-6, -3, 4, 0, 0, 1]],
    [[-2, 1, 2, 1, 0, 0], [0, 3, 2, 2, 1, 0], [0, 0, 2, 1, 2, 1]],
    [[-2, 1, 2, 1, 0, 0], [0, 3, 2, 2, 1, 0], [0, 0, 1, '½', 1, '½']],
    [[-2, 1, 2, 1, 0, 0], [0, 1, 0, '⅓', '−⅓', '−⅓'], [0, 0, 1, '½', 1, '½']],
    [[-2, 0, 0, '−⅓', '−5/3', '−⅔'], [0, 1, 0, '⅓', '−⅓', '−⅓'], [0, 0, 1, '½', 1, '½']],
    [[1, 0, 0, '1/6', '5/6', '⅓'], [0, 1, 0, '⅓', '−⅓', '−⅓'], [0, 0, 1, '½', 1, '½']],
  ];
  const TI = [0, cue('C13', '前三步做完'), cue('C14', '第三行除以主元二'), cue('C15', '再除以三'), cue('C16', '得到负二'), cue('C17', '符号全翻')];
  const OPI = [null, [[1, '同 LU 三步'], [2, '']], [[2, 'r₃ ÷ 2']], [[1, '(r₂ − 2r₃) ÷ 3']], [[0, 'r₁ − 2r₃ − r₂']], [[0, 'r₁ ÷ (−2)']]];

  // ── 音效 ──
  for (let k = 0; k < 7; k++) TL.sfx('tick', s('C01') + 2.0 + k * 0.22, 0.2); TL.sfx('ding_hi', cue('C01', 'LU分解'), 0.3);
  TL.sfx('check', cue('G01', '满分'), 0.28);
  TL.sfx('swoosh_in', s('C02') + 0.3, 0.3); TL.sfx('swoosh_in', s('C02') + 0.7, 0.3);
  for (let k = 0; k < 9; k++) TL.sfx('laser', cue('C02', '逐个数字') + k * 0.25, 0.15); TL.sfx('stamp', s('D01') + 0.3, 0.35);
  TL.sfx('pop', s('C03') + 0.3, 0.25); TL.sfx('ding', cue('C04', '原样写进L'), 0.3);
  [1, 2, 3].forEach(k => { TL.sfx('swoosh_soft', T[k], 0.25); TL.sfx('marimba', T[k] + 0.4, 0.22); });
  LF.forEach(([, , t]) => { TL.sfx('whoosh', t, 0.25); TL.sfx('pluck', t + 0.8, 0.3); });
  TL.sfx('pop', s('D02') + 0.2, 0.25); TL.sfx('swoosh_soft', cue('C07', '反着做'), 0.3);
  TL.sfx('ding_hi', s('C10') + 0.3, 0.3); TL.sfx('check', cue('G03', '正是A的第二行'), 0.3);
  TI.slice(1).forEach(t => { TL.sfx('swoosh_soft', t, 0.25); TL.sfx('marimba_lo', t + 0.4, 0.22); });
  TL.sfx('pop', s('D03') + 0.2, 0.25); TL.sfx('slam', s('G04') + 0.1, 0.3); TL.sfx('glitch', s('G04') + 0.2, 0.3);
  TL.sfx('impact', s('C18') + 0.3, 0.3); TL.sfx('check', cue('G05', '等于一'), 0.28); TL.sfx('check', cue('G05', '等于零'), 0.28);
  [0, 1, 2].forEach(k => TL.sfx('tick2', cue('C19', '负二乘三乘二') + k * 0.4, 0.3)); TL.sfx('ding_hi', cue('C19', '白送'), 0.3);
  TL.sfx('swell', s('G06') - 0.2, 0.3);

  // ════ 开场：热力图一行 + 两张原题 ════
  function shotOpen() {
    const a = B.win(s('C01'), s('C03') - 0.2); if (a <= 0) return;
    const g1 = a * B.win(s('C01') + 1.6, s('C02') - 0.1);
    if (g1 > 0) {
      ctag('LU / 初等矩阵 / 求逆', DX - 230, DY - 120, { px: 30, a: g1, color: C.peri, align: 'right' });
      for (let k = 0; k < 7; k++) {
        const t0 = s('C01') + 2.0 + k * 0.22, u = outBack(prog(B.t, t0, t0 + 0.4), 2);
        ctx.save(); ctx.globalAlpha = g1 * gin(t0); ctx.fillStyle = rgba(C.peri, 0.8); const w = 60 * u; ctx.fillRect(DX - 190 + k * 72 - w / 2, DY - 144, w, 48); ctx.restore();
      }
      ctag('7 / 7', DX + 330, DY - 120, { px: 34, a: g1 * gin(cue('C01', 'LU分解')), color: OK, font: F.serif });
      ctag('每年 10–14 分 · 算法固定 · 全卷最稳', DX, DY + 20, { px: 32, a: a * gin(s('G01')) * (1 - gin(s('C02') - 0.2)), color: C.gpt });
    }
    const g2 = a * gin(s('C02') + 0.2);
    if (g2 > 0) {
      ['y2122_q4', 'y2324_q5'].forEach((k, q) => {
        const im = EX.img[k], w = 430, h = Math.min(300, w * im.height / im.width), x = DX - 225 + q * 450, y = DY - 140;
        const u = outCubic(prog(B.t, s('C02') + 0.3 + q * 0.4, s('C02') + 1.1 + q * 0.4));
        ctx.save(); ctx.globalAlpha = g2 * u; ctx.translate(x + (1 - u) * (q ? 400 : -400), y); ctx.rotate((1 - u) * (q ? 0.2 : -0.2));
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h); ctx.drawImage(im, -w / 2, -h / 2, w, h);
        ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.restore();
        ctag(['2021–22 · 第 4 题', '2023–24 · 第 5 题'][q], x, y + h / 2 + 30, { px: 26, a: g2 * u, color: C.i });
      });
      // 逐个数字连线比对
      const tc = cue('C02', '逐个数字'), M1 = B.mat(DX - 225, DY + 150, A, { px: 30, a: g2 * gin(tc - 0.5) }), M2 = B.mat(DX + 225, DY + 150, A, { px: 30, a: g2 * gin(tc - 0.5) });
      for (let k = 0; k < 9; k++) {
        const i = Math.floor(k / 3), j = k % 3, t0 = tc + k * 0.25, u = prog(B.t, t0, t0 + 0.3); if (u <= 0) continue;
        B.line2(M1.cell(i, j), M2.cell(i, j), C.j, g2 * 0.5 * (1 - gin(s('D01') + 1)), 2);
        K.ring(...M1.cell(i, j), 20, C.j, g2 * 0.7, u, 3); K.ring(...M2.cell(i, j), 20, C.j, g2 * 0.7, u, 3);
      }
      K.redStamp('一模一样', DX, DY + 150, prog(B.t, s('D01') + 0.3, s('D01') + 0.8), g2 * gin(s('D01') + 0.3), C.free, 56);
    }
  }

  // ════ LU ════
  const LX0 = DX + 250, LY0 = DY - 230;
  function shotLU() {
    const a = B.win(s('C03'), s('C11') - 0.3); if (a <= 0) return;
    B.qhead('A 的 LU 分解', a);
    const { M } = K.steps(S, T, OPS, { x: DX - 140, y: DY - 230, px: 36, a, hi: (i, j, k) => (k >= 1 && i === 0 && j === 0 && B.t < T[3]) || (k >= 3 && i === 1 && j === 1 && B.t < T[3] + 2) ? C.i : null });
    ctag(B.t < T[3] + 1 ? 'A →' : 'U =', DX - 140 - M.w / 2 - 60, DY - 230, { px: 30, a, color: C.inkMid, font: F.serif });
    // 主元圈
    if (B.t > s('C05') && B.t < T[2] + 1) K.ring(...M.cell(0, 0), 28, C.i, a, prog(B.t, s('C05'), s('C05') + 0.5));
    if (B.t > s('C09') && B.t < T[3] + 1.5) K.ring(...M.cell(1, 1), 28, C.i, a, prog(B.t, s('C09'), s('C09') + 0.5));
    // L 骨架
    const gL = a * gin(s('C04') + 0.4);
    const Lm = [[1, 0, 0], [null, 1, 0], [null, null, 1]];
    const ML = B.mat(LX0, LY0, [[1, 0, 0], ['−2', 1, 0], ['3', '−2', 1]], { px: 36, a: gL, cell: (i, j) => {
      const lf = LF.find(([r, c]) => r === i && c === j);
      if (lf) { const g = gin(lf[2] + 0.8); return g > 0.02 ? { a: g, col: C.peri } : { txt: '□', col: C.inkMid, a: 0.6 }; }
      return null;
    } });
    ctag('L =', LX0 - ML.w / 2 - 50, LY0, { px: 30, a: gL, color: C.peri, font: F.serif });
    // 乘数飞入
    LF.forEach(([i, j, t0, tx]) => { const u = prog(B.t, t0, t0 + 0.8); if (u > 0 && u < 1) B.fly([...M.cell(i, j)], ML.cell(i, j), u, C.peri, { lift: 120, r: 10, txt: tx, px: 30 }); });
    // 规则卡
    const gr = a * B.win(s('C04'), s('C05') + 1.0);
    B.card(DX, DY + 20, 860, 120, gr * 0.95, C.peri);
    ctag('rᵢ − ℓ · rⱼ   ⟶   L 的 (i, j) 位置写 ℓ', DX, DY, { px: 36, a: gr, color: C.ink, font: F.serif });
    ctag('“减去 ℓ 倍”的那个 ℓ，原样抄', DX, DY + 50, { px: 26, a: gr * gin(cue('C04', '注意')), color: C.peri });
    // 计算提示
    const hint = [['4 ÷ (−2) = −2', s('C05'), T[1] + 2], ['−6 ÷ (−2) = 3', s('C08'), T[2] + 1.6], ['−6 ÷ 3 = −2', s('C09'), T[3] + 1.6]];
    hint.forEach(([tx, t0, t1]) => ctag(tx, DX - 140, DY - 60, { px: 34, a: a * B.win(t0 + 0.6, t1), color: C.i, font: F.serif }));
    // 撤销
    const gu = a * B.win(s('D02'), s('C08') - 0.1);
    if (gu > 0) {
      const y = DY + 160; B.xcard('A', DX - 300, y, 120, 70, gu, C.ink, 36); B.xcard('U', DX + 300, y, 120, 70, gu, C.ink, 36);
      arrow(ctx, [DX - 220, y - 20], [DX + 220, y - 20], { color: C.j, width: 5, head: 16, alpha: gu, grow: gin(s('C07')) });
      ctag('r₂ + 2r₁（消元）', DX, y - 50, { px: 26, a: gu * gin(s('C07')), color: C.j });
      arrow(ctx, [DX + 220, y + 20], [DX - 220, y + 20], { color: C.peri, width: 5, head: 16, alpha: gu, grow: gin(cue('C07', '反着做')) });
      ctag('r₂ − 2r₁（撤销 → 记进 L）', DX, y + 52, { px: 26, a: gu * gin(cue('C07', '反着做')), color: C.peri });
      const gG = gu * gin(s('G02'));
      B.card(DX, y + 140, 820, 70, gG * 0.95, C.gpt); ctag('永远写成“减去 ℓ 倍”，ℓ 直接抄进 L', DX, y + 140, { px: 28, a: gG, color: C.gpt });
    }
    // 结果 + 验算
    const g10 = a * gin(s('C10'));
    if (g10 > 0) {
      ctag('A = LU', DX + 60, DY + 60, { px: 52, a: g10, color: OK, font: F.serif }); B.burst(DX + 60, DY + 60, s('C10') + 0.3, OK, { r1: 260 });
      const gG = a * gin(s('G03'));
      if (gG > 0) { K.rowBox(ML, 1, 0, 2, C.gpt, gG, 20); B.card(DX + 60, DY + 200, 860, 76, gG * 0.95, C.gpt);
        ctag('L 第 2 行 × U：−2·(−2, 1, 2) + (0, 3, 2) = (4, 1, −2) ✓', DX + 60, DY + 200, { px: 26, a: gG, color: C.gpt, font: F.serif }); }
    }
  }

  // ════ 求逆 ════
  function shotInv() {
    const a = B.win(s('C11'), s('G06') - 0.3); if (a <= 0) return;
    B.qhead('2021–22 加问：A⁻¹', a);
    const { M } = K.steps(SI, TI, OPI, { x: DX + 40, y: DY - 200, px: 30, bar: 3, a, cw: 84, rh: 58, lx: DX - 420, hi: (i, j, k) => j >= 3 && k >= 1 ? (k === 1 ? C.j : null) : null });
    ctag('[A | I]', DX + 40, DY - 200 - M.h / 2 - 30, { px: 26, a: a * (1 - gin(TI[1])), color: C.inkMid, font: F.serif });
    ctag('左 = U，右 = L⁻¹', DX + 40, DY - 200 - M.h / 2 - 30, { px: 26, a: a * B.win(TI[1], TI[2]), color: C.j });
    const g12 = a * B.win(s('C12'), TI[1] + 1);
    ctag('从下往上：r₃ 清第 3 列 → r₂ 清第 2 列 → 各行 ÷ 主元', DX + 40, DY - 30, { px: 26, a: g12, color: C.ink });
    if (B.t > TI[2] - 0.2 && B.t < TI[3] + 2) K.rowBox(M, 2, 3, 5, OK, a * gin(TI[2] + 0.5), 20);
    // 大肥鱼错号
    const gd = a * B.win(s('D03'), TI[5] + 0.5);
    if (gd > 0) {
      ctag('÷ 2：−1/6, −5/6, −⅓ ?', DX + 40, DY + 30, { px: 34, a: gd, color: C.ds, font: F.serif });
      B.cross(DX + 40, DY + 30, prog(B.t, s('G04') + 0.1, s('G04') + 0.5), gd, 50);
      if (B.t > s('G04')) K.ring(...M.cell(0, 0), 32, C.free, gd, prog(B.t, s('G04'), s('G04') + 0.5), 5);
      K.glitch(s('G04') + 0.1, s('G04') + 0.6, 0.6);
      ctag('主元 −2：除以负数，符号全翻', DX + 40, DY + 90, { px: 30, a: a * gin(cue('C17', '第一个主元是负数')) * (1 - gin(s('C18') - 0.2)), color: C.free });
    }
    const g18 = a * gin(s('C18'));
    if (g18 > 0) {
      ctag('A⁻¹ =', DX - 160, DY + 110, { px: 34, a: g18, color: OK, font: F.serif });
      B.mat(DX + 30, DY + 110, [['1/6', '5/6', '⅓'], ['⅓', '−⅓', '−⅓'], ['½', 1, '½']], { px: 30, a: g18, cw: 80, rh: 52, cell: () => ({ col: OK }) });
      B.burst(DX + 30, DY + 110, s('C18') + 0.3, OK, { r1: 220 });
      const gv = a * gin(s('G05'));
      B.card(DX + 40, DY + 290, 860, 100, gv * 0.95, C.gpt);
      ctag('(−2, 1, 2)·第 1 列 = −⅓ + ⅓ + 1 = 1 ✓', DX + 40, DY + 270, { px: 26, a: gv * gin(cue('G05', '等于一')), color: C.gpt, font: F.serif });
      ctag('(−2, 1, 2)·第 2 列 = −5/3 − ⅓ + 2 = 0 ✓', DX + 40, DY + 312, { px: 26, a: gv * gin(cue('G05', '等于零')), color: C.gpt, font: F.serif });
      const gd2 = a * gin(s('C19'));
      if (gd2 > 0) {
        [0, 1, 2].forEach(k => K.ring(DX - 330 + k * 120, DY + 290, 34, C.i, gd2, prog(B.t, cue('C19', '负二乘三乘二') + k * 0.4, cue('C19', '负二乘三乘二') + 0.5 + k * 0.4), 4));
        B.card(DX + 40, DY + 290, 860, 100, gd2, C.i);
        ctag('det A = (−2) · 3 · 2 = −12', DX + 40, DY + 275, { px: 36, a: gd2, color: C.i, font: F.serif });
        ctag('U 的主元之积 —— LU 做完，行列式白送', DX + 40, DY + 318, { px: 24, a: gd2 * gin(cue('C19', '白送')), color: C.ink });
      }
    }
  }

  function shotOutro() {
    const a = B.win(s('G06'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · LU', ['① 每一步写成 rᵢ − ℓ rⱼ', '② ℓ 原样抄进 L 的 (i, j)', '③ U 的主元之积 = det A', '④ 最后验算一行'],
      [s('G06') + 0.3, cue('G06', 'l抄进L'), cue('G06', 'U的主元之积'), cue('G06', '最后验算')], a, { y: DY - 40 });
  }

  function draw(t) { B.frame(t, () => { shotOpen(); shotLU(); shotInv(); shotOutro(); }); }
  return { TL, draw };
}
