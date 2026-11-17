// 特别篇 6 · 第 7 段：零空间与小题合集。
// 分镜：四个基本子空间十字图（ℝⁿ：行空间 / 零空间；ℝᵐ：列空间 / 左零空间；A 箭头，零空间压成 0）
//       → 2023–24 第 2′ 题：A 消元（4 步）→ 参数解 → 去分母取 2 → 基；GPT：基可整体缩放
//       → B 消元（3 步，第三行清零）→ 秩 2 → 基 (−2, 7, 3)
//       → 2015–16 第 6 题：4×2 的 A → 十字图填入（ℝ²、{0}、ℝ⁴ 中的平面、左零空间两向量）→ 点乘验算
//       → 小题快问：卡片翻出 + 10 秒环 + 连击计数（5 题）→ 收尾：维数依次亮起，r + (n − r) = n → 下集预告。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit, neg, vec } from '../kit.js';

export const assets = { chars: ['claude_point', 'claude_explain', 'claude_write', 'claude_smile', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_think', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y2324_n2', 'y1516_q6']);
  const B = base(R, {
    assets, label: '特别篇 6 · 秩与四个子空间', title: '零空间与小题合集', hi: 3, en: 'FOUR SUBSPACES',
    titleEnd: () => B.L('C01').s + 0.6,
    pre: { C03: 1.0, C06: 0.6, C08: 1.0, C11: 1.0, C12: 0.4, C13: 0.4, C14: 0.4, C16: 0.8, G03: 0.4 },
    post: { C01: 1.0, C02: 1.6, C04: 1.6, C05: 1.4, G01: 1.0, C06: 1.6, C07: 1.6, C09: 1.2, C10: 1.4, G02: 1.2, D01: 1.2, D02: 1.2, D03: 1.0, D04: 1.4, D05: 1.4, C16: 1.6, G03: 0.6, D06: 2.0 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const SA = [
    [[1, -1, 4, 2], [-2, -4, 7, 5]],
    [[1, -1, 4, 2], [0, -6, 15, 9]],
    [[1, -1, 4, 2], [0, 1, '-5/2', '-3/2']],
    [[1, 0, '3/2', '1/2'], [0, 1, '-5/2', '-3/2']],
  ];
  const TA = [-1, cue('C04', '第二行加两倍'), cue('C04', '除以负六'), cue('C04', '第一行加第二行')];
  const OA = [null, [[1, 'R₂ + 2R₁']], [[1, 'R₂ ÷ (−6)']], [[0, 'R₁ + R₂']]];
  const SB = [
    [[1, 2, -4], [2, 1, -1], [-1, 1, -3]],
    [[1, 2, -4], [0, -3, 7], [-1, 1, -3]],
    [[1, 2, -4], [0, -3, 7], [0, 3, -7]],
    [[1, 2, -4], [0, -3, 7], [0, 0, 0]],
  ];
  const TB = [-1, cue('C06', '第二行减两倍'), cue('C06', '第三行加第一行'), cue('C06', '再加上第二行')];
  const OB = [null, [[1, 'R₂ − 2R₁']], [[2, 'R₃ + R₁']], [[2, 'R₃ + R₂']]];
  const Q = [
    { c: 'C11', d: 'D01', q: 'A = [[3, 4], [6, 8]]，L(x) = Ax 的核与值域？', a: ['秩 1', 'ker L = Span{(−4, 3)}', 'R(L) = Span{(1, 2)}'] },
    { c: 'C12', d: 'D02', q: 'x₁ + 2x₂ + 3x₃ + x₄ = 0 的解集 S？', a: ['x₂、x₃、x₄ 自由', 'S = Span{(−2, 1, 0, 0),', '(−3, 0, 1, 0), (−1, 0, 0, 1)}'] },
    { c: 'C13', d: 'D03', q: 'x₁ + 2x₂ + 3x₃ = 0 的解集维数？', a: ['3 − 1 = 2'] },
    { c: 'C14', d: 'D04', q: '5×3 的 A，秩 2，a₁ − a₂ = a₂ + a₃ = b，求 N(A)', a: ['a₁ − 2a₂ − a₃ = 0', 'dim N(A) = 3 − 2 = 1', 'N(A) = Span{(1, −2, −1)}'] },
    { c: 'C15', d: 'D05', q: '判断：A 为 m×n，秩为 m ⇒ 列向量张成 ℝᵐ？', a: ['dim R(A) = m，R(A) ⊆ ℝᵐ', '⇒ R(A) = ℝᵐ　✓ 对'] },
  ];
  const qc = id => id === 'C15' ? cue('C15', '最后一道判断') : s(id) + 0.2;

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45);
  ['左边是', '行空间和零空间', '右边是', '列空间和左零空间'].forEach(w => TL.sfx('pop', cue('C01', w), 0.28));
  TL.sfx('tick', cue('C02', '维数'), 0.28); TL.sfx('crack', cue('C02', '压成零'), 0.3); TL.sfx('whoosh', cue('C02', '一对一'), 0.3);
  TL.sfx('whoosh', s('C03') + 0.2, 0.3); TL.sfx('stamp', s('C03') + 2.6, 0.3);
  TA.slice(1).forEach(x => TL.sfx('pluck', x, 0.3));
  TL.sfx('pop', s('C05') + 0.3, 0.28); TL.sfx('swoosh_soft', cue('C05', '为了去掉分母'), 0.3); TL.sfx('ding_hi', cue('C05', '基是'), 0.3);
  TL.sfx('check', cue('G01', '等于零就行'), 0.3);
  TB.slice(1).forEach(x => TL.sfx('pluck', x, 0.3)); TL.sfx('zap', cue('C06', '就变成零'), 0.28); TL.sfx('ding_hi', cue('C06', '秩是二'), 0.3);
  TL.sfx('ding_hi', cue('C07', '基是'), 0.3);
  TL.sfx('whoosh', s('C08') + 0.2, 0.3); TL.sfx('stamp', s('C08') + 2.6, 0.3);
  ['行空间等于', '零空间只有', '列空间由'].forEach(w => TL.sfx('pop', cue('C09', w), 0.28));
  TL.sfx('ding_hi', cue('C10', '得到'), 0.3); TL.sfx('check', cue('G02', '等于零'), 0.3); TL.sfx('check', cue('G02', '也等于零'), 0.3);
  Q.forEach((q, i) => { TL.sfx('click', qc(q.c), 0.35); TL.sfx('count', qc(q.c) + 0.3, 0.15); TL.sfx('ding_hi', e(q.d) - 0.3, 0.35); TL.sfx('sparkle', e(q.d) - 0.1, 0.25); });
  ['行空间', '零空间', '列空间', '左零空间'].forEach((w, i) => TL.sfx('tick', cue('C16', '一句话收尾') + 0.5 + i * 0.35, 0.28));
  TL.sfx('impact', cue('C16', 'r加n减r'), 0.3); TL.sfx('bell_soft', s('G03') + 0.2, 0.35); TL.sfx('shimmer', s('D06'), 0.35);

  // ════ 十字图（开场）════
  function shotCross() {
    const a = B.win(s('C01') + 0.2, s('C03') - 0.2); if (a <= 0) return;
    const ba = { row: gin(cue('C01', '行空间和零空间')), nul: gin(cue('C01', '行空间和零空间') + 0.4), col: gin(cue('C01', '列空间和左零空间')), lnul: gin(cue('C01', '列空间和左零空间') + 0.4) };
    K.fourSub({ a: a * gin(cue('C01', '左边是') - 0.3), y: DY - 40, boxA: ba, dimA: gin(cue('C02', '维数')),
      arrowS: smoother(prog(B.t, cue('C02', '一对一') - 0.3, cue('C02', '一对一') + 0.6)), oneA: gin(cue('C02', '一对一')), zeroS: smoother(prog(B.t, cue('C02', '压成零') - 0.3, cue('C02', '压成零') + 0.5)) });
    ctag('A：m × n', DX, DY - 330, { px: 34, a: a * gin(cue('C01', 'A是m乘n')), color: C.peri, font: F.serif });
    ctag('ℝⁿ：A 的输入　　ℝᵐ：A 的输出', DX, DY + 250, { px: 28, a: a * gin(cue('C01', '右边是') + 0.4) * (1 - gin(cue('C02', '压成零'))), color: C.inkMid });
  }

  // ════ 2023–24 第 2′ 题 ════
  function shotN2() {
    const a = B.win(s('C03'), s('C08') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C03', 'A的两行') - 0.2); if (A <= 0) return;
    B.qhead('2023–2024 期中 · 第 2′ 题 · 14 分', A);
    const ga = A * (1 - gin(s('C06') - 0.3));
    if (ga > 0) {
      const lift = smoother(prog(B.t, s('C05') - 0.3, s('C05') + 0.3));
      const { M } = K.steps(SA, TA, OA, { x: DX + 40, y: lerp(DY - 170, DY - 260, lift), px: lerp(40, 34, lift), a: ga, opHold: 3.5, cw: 92, hi: (i, j, k) => k === 3 && i === j ? C.i : k === 3 && j >= 2 ? C.free : null });
      ctag('A', DX + 40 - M.w / 2 - 50, lerp(DY - 170, DY - 260, lift), { px: 36, a: ga * (1 - gin(TA[1] - 0.4) * (1 - gin(TA[3] + 4))), color: C.inkMid, font: F.serif });
      const g5 = ga * gin(s('C05'));
      ctag('x₃ = s，x₄ = t', DX + 40, DY - 120, { px: 30, a: g5, color: C.free, font: F.serif });
      ctag('x₁ = −3s/2 − t/2，　x₂ = 5s/2 + 3t/2', DX + 40, DY - 65, { px: 30, a: ga * gin(cue('C05', 'x一等于')), color: C.ink, font: F.serif });
      K.pill('去分母：s、t 取 2', DX + 40, DY, C.peri, ga * gin(cue('C05', '为了去掉分母')) * (1 - gin(s('G01') - 0.3)), 24);
      const tb = cue('C05', '基是');
      K.cvec(DX - 100, DY + 160, [-3, 5, 2, 0], ga * gin(tb), { px: 30, col: C.free }); K.cvec(DX + 180, DY + 160, [-1, 3, 0, 2], ga * gin(tb + 1.0), { px: 30, col: C.free });
      ctag('N(A) 的基', DX + 40, DY + 310, { px: 28, a: ga * gin(tb), color: C.free });
      B.burst(DX - 100, DY + 160, tb + 0.2, C.free, { r1: 120 }); B.burst(DX + 180, DY + 160, tb + 1.2, C.free, { r1: 120 });
      // G01
      const g = ga * gin(s('G01'));
      B.card(DX + 40, DY, 760, 60, g * 0.95, C.gpt);
      ctag('基向量 × 非零常数，仍然对　|　验算：A·v = 0', DX + 40, DY, { px: 26, a: g, color: C.gpt });
    }
    // B
    const gb = A * gin(s('C06') - 0.2);
    if (gb > 0) {
      const lift = smoother(prog(B.t, s('C07') - 0.3, s('C07') + 0.3));
      const { M } = K.steps(SB, TB, OB, { x: DX + 40, y: lerp(DY - 150, DY - 240, lift), px: lerp(40, 34, lift), a: gb, opHold: 3.5 });
      ctag('B', DX + 40 - M.w / 2 - 50, lerp(DY - 150, DY - 240, lift), { px: 36, a: gb * (1 - gin(TB[1] - 0.4) * (1 - gin(TB[3] + 4))), color: C.inkMid, font: F.serif });
      K.pill('秩 2', DX + 260, lerp(DY - 150, DY - 240, lift), C.i, gb * gin(cue('C06', '秩是二')), 28);
      ctag('x₃ = t：x₂ = 7t/3，x₁ = −2x₂ + 4x₃ = −2t/3', DX + 40, DY - 60, { px: 30, a: gb * gin(s('C07') + 0.2), color: C.ink, font: F.serif });
      K.pill('取 t = 3', DX + 40, DY + 10, C.peri, gb * gin(cue('C07', '取t等于三')), 24);
      K.cvec(DX + 40, DY + 160, [-2, 7, 3], gb * gin(cue('C07', '基是')), { px: 32, col: C.free });
      ctag('N(B) 的基', DX + 40, DY + 280, { px: 28, a: gb * gin(cue('C07', '基是')), color: C.free });
      B.burst(DX + 40, DY + 160, cue('C07', '基是') + 0.2, C.free, { r1: 140 });
    }
  }

  // ════ 2015–16 第 6 题 ════
  function shotQ6() {
    const a = B.win(s('C08'), s('C11') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C08', 'A是四乘二') - 0.2); if (A <= 0) return;
    B.qhead('2015–2016 · 第 6 题 · 12 分', A);
    const Am = [[4, -2], [1, 3], [2, 1], [3, 4]];
    const sh = smoother(prog(B.t, s('C09') - 0.2, s('C09') + 0.5));
    const M = B.mat(lerp(DX + 20, DX + 20, sh), lerp(DY - 60, DY - 300, sh), Am, { px: lerp(44, 26, sh), a: A, cell: (i, j) => ({ col: j ? C.k : C.i }) });
    ctag('A', DX + 20 - M.w / 2 - lerp(50, 30, sh), lerp(DY - 60, DY - 300, sh), { px: lerp(40, 28, sh), a: A, color: C.inkMid, font: F.serif });
    ctag('秩 2（两列不成比例）', DX + 230, DY - 300, { px: 26, a: A * gin(s('C09') + 0.2), color: C.i, align: 'left' });
    const g = A * sh;
    if (g > 0) {
      K.fourSub({ a: g, y: DY + 20, w: 300, h: 360, gap: 150, n: 'ℝ²', m: 'ℝ⁴', dimA: 1, arrowS: 1, oneA: 0,
        labels: { row: '行空间', nul: '零空间', col: '列空间', lnul: '左零空间' },
        dims: { row: '', nul: '', col: '', lnul: '' },
        fill: { row: B.t > cue('C09', '行空间等于') ? '= ℝ²' : '', nul: B.t > cue('C09', '零空间只有') ? '= {0}' : '', col: B.t > cue('C09', '列空间由') ? 'ℝ⁴ 中的平面' : '', lnul: B.t > cue('C10', '得到') ? 'dim = 4 − 2 = 2' : (B.t > cue('C10', '维数') ? 'dim = 2' : '') },
        boxA: { row: gin(cue('C09', '行空间等于')), nul: gin(cue('C09', '零空间只有')), col: gin(cue('C09', '列空间由')), lnul: gin(s('C10')) } });
      const gl = A * gin(cue('C10', '得到'));
      ctag('(−5, −8, 14, 0)', DX + 245, DY + 300, { px: 26, a: gl, color: C.k, font: F.serif });
      ctag('(−5, −22, 0, 14)', DX + 245, DY + 340, { px: 26, a: gl * gin(cue('C10', '和负五') ), color: C.k, font: F.serif });
      const gg = A * gin(s('G02'));
      ctag('·a₁ = −20 − 8 + 28 = 0 ✓', DX - 200, DY + 300, { px: 26, a: gg * gin(cue('G02', '和第一列')), color: OK, font: F.serif });
      ctag('·a₂ = 10 − 24 + 14 = 0 ✓', DX - 200, DY + 340, { px: 26, a: gg * gin(cue('G02', '和第二列')), color: OK, font: F.serif });
    }
  }

  // ════ 小题快问 ════
  function shotQuick() {
    const a = B.win(s('C11'), s('C16') - 0.2); if (a <= 0) return;
    K.banner('小题快问', a * gin(s('C11')), C.ds);
    let n = 0;
    Q.forEach((q, i) => {
      const t0 = qc(q.c), t1 = i < 4 ? qc(Q[i + 1].c) - 0.2 : s('C16') - 0.2;
      if (B.t > e(q.d) - 0.3) n = i + 1;
      const g = a * B.win(t0, t1, 0.3, 0.3); if (g <= 0) return;
      const flip = smoother(prog(B.t, t0, t0 + 0.5)), sx = Math.sin(flip * Math.PI / 2);
      ctx.save(); ctx.translate(DX, DY - 120); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-DX, -(DY - 120));
      B.card(DX, DY - 120, 860, 120, g, C.peri);
      ctag(`Q${i + 1}`, DX - 390, DY - 120, { px: 30, a: g, color: C.peri, font: F.serif });
      ctag(q.q, DX + 20, DY - 120, { px: q.q.length > 26 ? 28 : 32, a: g, color: C.ink });
      ctx.restore();
      // 10 秒环
      const u = prog(B.t, t0 + 0.4, t0 + 10.4), done = B.t > e(q.d) - 0.3;
      ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = rgba(C.ink, 0.25); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(DX + 380, DY - 230, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = done ? OK : C.ds; ctx.beginPath(); ctx.arc(DX + 380, DY - 230, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (done ? 1 : 1 - u)); ctx.stroke(); ctx.restore();
      ctag(done ? '✓' : String(Math.max(0, Math.ceil(10 * (1 - u)))), DX + 380, DY - 230, { px: 28, a: g, color: done ? OK : C.ink, font: F.serif });
      // 大肥鱼的答案
      q.a.forEach((l, k) => {
        const ta = s(q.d) + 0.3 + k * Math.max(0.8, (e(q.d) - s(q.d) - 0.6) / q.a.length);
        const gk = g * gin(ta);
        ctag(l, DX + 20, DY + 20 + k * 62, { px: 34, a: gk, color: k === q.a.length - 1 ? OK : C.ds, font: F.serif });
      });
      B.burst(DX + 20, DY + 20 + (q.a.length - 1) * 62, e(q.d) - 0.3, OK, { r1: 220 });
      if (i === 3) ctag('要用维数，才能说“就是它”', DX + 20, DY + 260, { px: 28, a: a * B.win(s('C15'), cue('C15', '最后一道判断')), color: C.peri });
    });
    B.combo(n, DX - 300, DY + 300, Q[Math.max(0, n - 1)] ? e(Q[Math.max(0, n - 1)].d) - 0.3 : 0, a, '快问连击');
  }

  // ════ 收尾 ════
  function shotOutro() {
    const a = B.win(s('C16'), 1e9); if (a <= 0) return;
    const t0 = cue('C16', '一句话收尾') + 0.5;
    const ba = { row: gin(t0), nul: gin(t0 + 0.35), col: gin(t0 + 0.7), lnul: gin(t0 + 1.05) };
    K.fourSub({ a: a * (1 - gin(s('G03') - 0.2)), y: DY - 80, w: 290, h: 330, gap: 160, boxA: ba, dimA: 1, arrowS: 1, oneA: 1, zeroS: 1 });
    const ge = a * gin(cue('C16', 'r加n减r')) * (1 - gin(s('G03') - 0.2));
    const k = lerp(1.4, 1, outBack(prog(B.t, cue('C16', 'r加n减r'), cue('C16', 'r加n减r') + 0.5), 2));
    ctx.save(); ctx.translate(DX, DY + 210); ctx.scale(k, k); ctx.translate(-DX, -(DY + 210));
    B.card(DX, DY + 210, 640, 96, ge, C.peri); ctag('r + (n − r) = n', DX, DY + 210, { px: 50, a: ge, color: C.peri, font: F.serif }); ctx.restore();
    ctag('秩 + 零化度 = 列数', DX, DY + 290, { px: 30, a: a * gin(cue('C16', '秩加零化度')) * (1 - gin(s('G03') - 0.2)), color: C.ink });
    B.burst(DX, DY + 210, cue('C16', 'r加n减r') + 0.2, C.peri, { r1: 320, n: 22 });
    // 下集预告
    const g = a * gin(s('G03'));
    B.card(DX, DY - 40, 760, 220, g, C.ds);
    ctag('下一集 · 特别篇 7（最终集）', DX, DY - 100, { px: 30, a: g, color: C.ds });
    ctag('判断题闪电战 + 整卷走一遍', DX, DY - 30, { px: 42, a: g * gin(cue('G03', '判断题')), color: C.ink, font: F.serif });
    K.pill('最后一集了！', DX, DY + 120, C.peri, a * gin(s('D06')), 30);
    B.burst(DX, DY - 40, s('D06') + 0.2, C.ds, { r1: 360, n: 24 });
  }

  function papers() {
    B.paper(EX, 'y2324_n2', { t0: s('C03') + 0.2, dock: cue('C03', 'A的两行') - 0.3, out: s('C08') - 0.4 });
    B.paper(EX, 'y1516_q6', { t0: s('C08') + 0.2, dock: cue('C08', 'A是四乘二') - 0.3, out: s('C11') - 0.3 });
  }

  function draw(t) {
    B.frame(t, () => { shotCross(); shotN2(); shotQ6(); shotQuick(); shotOutro(); papers(); });
  }
  return { TL, draw };
}
