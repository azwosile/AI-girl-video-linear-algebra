// 特别篇 6 · 第 4 段：两道同型题连做（2020–21 第 7 题；2021–22 第 2 题），带考场倒计时。
// 分镜：倒计时 3:00 启动 → 原题 → U 板 + α 列槽（α₄ 空槽）→ N(A)：x₄ = t → b = Aη（η 权重沿弧线飞入 b）
//       → α₄ 乘 0 用不上（×0 划掉）→ 丝线补出 α₄ → 通解 → 第一题 ✓
//       → 第二题：倒计时重置 → 原题 → U 板（圈主元，三列自由）→ 特解 + 三个零空间向量（变号动画）
//       → b = 3a₁ + 6a₃ 逐分量 → 倒计时定格 0:41 + “考场速度 ✓” → 同一招总结。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit, neg, vec } from '../kit.js';

export const assets = { chars: ['claude_point', 'claude_explain', 'claude_write', 'claude_smile', 'ds_ask', 'ds_proud', 'ds_think', 'ds_happy', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2021_q7', 'y2122_q2']);
  const B = base(R, {
    assets, label: '特别篇 6 · 秩与四个子空间', title: '同型题连做', hi: 3, en: 'SPEED RUN × 2',
    titleEnd: () => B.L('C01').s + 0.2,
    pre: { C01: 0.6, C03: 0.3, C06: 0.4, C08: 1.2, D03: 0.3, D04: 0.3, G01: 0.6 },
    post: { C01: 0.8, C02: 0.6, C03: 1.0, C04: 1.2, C05: 0.8, C06: 1.4, C07: 1.6, D02: 0.6, D03: 1.2, C09: 1.0, D04: 0.6, C10: 1.8, G01: 1.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const U1 = [[1, 0, 0, -1], [0, 1, 0, 1], [0, 0, 1, -1]];
  const AL = [[-1, 3, 2], [1, 1, -1], [-1, -1, -2], [3, -1, -1]], ETA = [1, 1, 2, 0], B1 = [-2, 2, -3];
  const U2 = [[1, 2, 0, 3, 1, 3], [0, 0, 1, 2, 4, 6], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
  const A1 = [1, 1, 3, 4], A3 = [2, -1, 1, 3], B2 = [15, -3, 15, 30];
  const t1 = s('C01') + 0.4, tStop1 = e('C07'), t2 = s('C08') + 0.4, tStop2 = e('C10') + 0.2;
  const from2 = Math.round(tStop2 - t2) + 41;
  const tA4 = cue('C06', '所以阿尔法四'), tBw = cue('C04', '等于阿尔法一');

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('count', t1, 0.35); TL.sfx('whoosh', cue('C01', '二零二零') , 0.3); TL.sfx('stamp', cue('C01', '二零二零') + 2.4, 0.3);
  ['求零空间', '求b', '再求全部解'].forEach(w => TL.sfx('pop', cue('C02', w), 0.28));
  TL.sfx('pop', cue('C03', '令x四'), 0.28); TL.sfx('ding_hi', cue('C03', '基是'), 0.3);
  [0, 1, 2].forEach(i => TL.sfx('laser', tBw + i * 0.4, 0.25)); TL.sfx('impact', cue('C04', '也就是'), 0.3);
  TL.sfx('buzz', s('D01') + 0.3, 0.2); TL.sfx('crack', cue('C05', '阿尔法四乘零'), 0.3);
  TL.sfx('pluck', cue('C06', 'U的第四列'), 0.35); [0, 1, 2].forEach(i => TL.sfx('pluck', tA4 + i * 0.4, 0.3)); TL.sfx('shimmer', cue('C06', '也就是三'), 0.3);
  TL.sfx('impact', s('C07') + 0.4, 0.3); TL.sfx('ding_hi', e('C07') - 0.2, 0.4);
  TL.sfx('count', t2, 0.35); TL.sfx('whoosh', s('C08') + 0.3, 0.3); TL.sfx('stamp', s('C08') + 2.8, 0.3);
  TL.sfx('pop', cue('D02', '主元在'), 0.3); TL.sfx('zap', cue('D02', '自由变量'), 0.25);
  ['特解是', 'x二取一', 'x四取一', 'x五取一'].forEach(w => TL.sfx('tick', cue('D03', w), 0.28));
  TL.sfx('check', s('C09') + 0.3, 0.3); TL.sfx('swoosh_soft', cue('C09', '要变号'), 0.3);
  [0, 1].forEach(i => TL.sfx('laser', cue('D04', 'b那一列') + i * 0.45, 0.25)); TL.sfx('impact', cue('D04', '所以b'), 0.3);
  TL.sfx('ding_hi', cue('C10', '也就是'), 0.35); TL.sfx('sparkle', tStop2, 0.4); TL.sfx('bell_soft', s('G01') + 0.3, 0.35);

  // ── 列槽 ──
  function slots(cols, y, a, { dx = 112, x0 = DX + 20 } = {}) {
    if (a <= 0) return [];
    const n = cols.length, xs = cols.map((_, j) => x0 + (j - (n - 1) / 2) * dx);
    cols.forEach((c, j) => {
      const x = xs[j], m = c.v.length, h = m * 48 + 26, f = c.f ?? 1;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c.col; ctx.lineWidth = 3; if (f < 1) ctx.setLineDash([8, 8]);
      ctx.strokeRect(x - 42, y - h / 2, 84, h); ctx.setLineDash([]); ctx.globalAlpha = a * 0.12 * f; ctx.fillStyle = c.col; ctx.fillRect(x - 42, y - h / 2, 84, h); ctx.restore();
      ctag(c.lab, x, y - h / 2 - 26, { px: 28, a, color: c.col, font: F.serif });
      c.v.forEach((q, i) => ctag(neg(q), x, y - (m - 1) * 24 + i * 48, { px: 32, a: a * (c.comp ? c.comp[i] : f), color: c.vcol ?? C.ink, font: F.serif }));
      if (f < 0.05 && !(c.comp && c.comp.some(v => v > 0.05))) ctag('?', x, y, { px: 50, a: a * (0.6 + 0.4 * Math.sin(B.t * 6)), color: c.col, font: F.serif });
      if (c.over) c.over(x, y, h);
    });
    return xs;
  }

  // ════ 第一题 ════
  function shotQ1() {
    const a = B.win(s('C01'), s('C08') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C01', 'A是三乘四') - 0.2); if (A <= 0) return;
    B.qhead('2020–2021 期中 · 第 7 题 · 15 分', A);
    const M = B.mat(DX + 20, DY - 240, U1, { px: 38, a: A, cell: (i, j) => ({ col: j === 3 ? (B.t > cue('C06', 'U的第四列') ? C.k : C.free) : (i === j ? C.i : null) }) });
    ctag('U', DX + 20 - M.w / 2 - 50, DY - 240, { px: 34, a: A, color: C.inkMid, font: F.serif });
    ['x₁', 'x₂', 'x₃', 'x₄'].forEach((v, j) => ctag(v, M.cell(0, j)[0], DY - 240 - M.h / 2 - 26, { px: 22, a: A * gin(s('C03')), color: j === 3 ? C.free : C.i }));
    // 列槽：α₁..α₄ + b
    const xs = slots([
      { lab: 'α₁', v: AL[0], col: C.i }, { lab: 'α₂', v: AL[1], col: C.i }, { lab: 'α₃', v: AL[2], col: C.i },
      { lab: 'α₄', v: AL[3], col: C.free, f: gin(tA4 + 1.2), vcol: OK, over: (x, y, h) => { const g = A * B.win(s('D01'), s('C06')); if (g > 0) { ctag('× 0', x, y + h / 2 + 30, { px: 30, a: g * gin(cue('C05', '阿尔法四乘零')), color: C.free, font: F.serif }); B.cross(x, y, gin(cue('C05', '根本用不上'), 0.4), g, 40); } } },
      { lab: 'b', v: B1, col: C.peri, f: gin(cue('C04', '也就是') + 0.3), vcol: C.peri },
    ], DY + 40, A * gin(cue('C01', '阿尔法一等于') - 0.3) * (1 - gin(s('C07') - 0.2)), { dx: 120 });
    // η 权重
    if (xs.length) {
      const gη = A * B.win(s('C02') + 0.5, s('C07') - 0.2);
      ETA.forEach((w, j) => ctag('×' + w, xs[j], DY + 40 + 110, { px: 28, a: gη * gin(cue('C02', '伊塔等于') + j * 0.2), color: j === 3 ? C.free : C.peri, font: F.serif }));
      ctag('η = (1, 1, 2, 0)', DX + 20, DY + 210, { px: 30, a: gη, color: C.peri, font: F.serif });
      [0, 1, 2].forEach(j => B.fly([xs[j], DY + 40], [xs[4], DY + 40], prog(B.t, tBw + j * 0.4, tBw + 0.9 + j * 0.4), C.peri, { lift: 90, r: 10 }));
    }
    // C02 三问
    { const g = A * B.win(s('C02'), s('C03'));
      ctag('① N(A) 的基　② 已知 η 是解，求 b　③ 全部解', DX + 20, DY - 120, { px: 28, a: g, color: C.ink }); }
    // C03
    { const g = A * B.win(s('C03'), s('C04'));
      ctag('x₄ = t → x₁ = t，x₂ = −t，x₃ = t', DX + 20, DY - 120, { px: 30, a: g * gin(cue('C03', '令x四')), color: C.free, font: F.serif });
      B.card(DX + 20, DY + 290, 420, 70, g * gin(cue('C03', '基是')), C.free);
      ctag('N(A) 基：(1, −1, 1, 1)', DX + 20, DY + 290, { px: 30, a: g * gin(cue('C03', '基是')), color: C.free, font: F.serif }); }
    // C04
    { const g = A * B.win(s('C04'), s('D01') + 0.3);
      ctag('b = Aη = α₁ + α₂ + 2α₃', DX + 20, DY - 120, { px: 32, a: g * gin(s('C04') + 0.2), color: C.peri, font: F.serif });
      ctag('= (−1 + 1 − 2, 3 + 1 − 2, 2 − 1 − 4) = (−2, 2, −3)', DX + 20, DY + 290, { px: 28, a: g * gin(cue('C04', '等于负一')), color: C.ink, font: F.serif }); }
    // D01/C05
    ctag('η 的第 4 个分量 = 0 → 出题人故意的', DX + 20, DY - 120, { px: 30, a: A * B.win(cue('C05', '伊塔的第四个'), s('C06')), color: C.gpt });
    // C06：丝线
    { const g = A * B.win(s('C06'), s('C07') - 0.1);
      K.colBox(M, 3, 0, 2, C.k, g * gin(cue('C06', 'U的第四列')), 26);
      K.threads(M, 3, [[0, '−1'], [1, '+1'], [2, '−1']], tA4, C.k, g, { gap: 0.4, dy: -32, lift: 55 });
      ctag('α₄ = −α₁ + α₂ − α₃ = (3, −1, −1)', DX + 20, DY - 120, { px: 30, a: g * gin(tA4 + 0.4), color: OK, font: F.serif });
      if (xs.length) [0, 1, 2].forEach(j => B.fly([xs[j], DY + 40], [xs[3], DY + 40], prog(B.t, tA4 + j * 0.4, tA4 + 0.9 + j * 0.4), C.k, { lift: 70, r: 9 }));
    }
    // C07：通解
    { const g = A * gin(s('C07'));
      texAt('gen1', DX + 20, DY + 80, 40, { alpha: g, reveal: rv(s('C07') + 0.3, 3.0) });
      ctag('特解直接用题目给的 η', DX + 20, DY + 230, { px: 28, a: g * gin(cue('C07', '特解直接')), color: C.i });
      B.burst(DX + 20, DY + 80, s('C07') + 0.6, OK, { r1: 260 });
      B.stamp(DX + 330, DY + 280, true, gin(e('C07') - 0.3, 0.4), g * gin(e('C07') - 0.3), '✓ 第一题'); }
  }

  // ════ 第二题 ════
  function shotQ2() {
    const a = B.win(s('C08'), s('G01') - 0.1); if (a <= 0) return;
    const A = a * gin(cue('C08', '增广矩阵的RREF') - 0.2); if (A <= 0) return;
    B.qhead('2021–2022 期中 · 第 2 题 · 10 分', A);
    const tp = cue('D02', '主元在'), tf = cue('D02', '自由变量');
    const free = j => j === 1 || j === 3 || j === 4;
    const M = B.mat(DX + 20, DY - 250, U2, { px: 34, a: A, bar: 5, cell: (i, j) => ({ col: j === 5 && B.t > s('D04') ? C.peri : ((i === 0 && j === 0) || (i === 1 && j === 2)) && B.t > tp ? C.i : free(j) && B.t > tf && i < 2 ? C.free : null }) });
    ['x₁', 'x₂', 'x₃', 'x₄', 'x₅', 'b'].forEach((v, j) => ctag(v, M.cell(0, j)[0], DY - 250 - M.h / 2 - 26, { px: 22, a: A * gin(tp), color: j === 5 ? C.peri : free(j) ? C.free : C.i }));
    [[0, 0], [1, 2]].forEach(([r, c], q) => { const [x, y] = M.cell(r, c); K.ring(x, y, 22, C.i, A, prog(B.t, tp + q * 0.3, tp + q * 0.3 + 0.5)); });
    K.pill('3 个自由变量！', DX + 330, DY - 250, C.free, A * B.win(tf + 0.4, s('D03') + 0.5), 24);
    // 列槽 a₁ a₃ b
    const xs = slots([{ lab: 'a₁', v: A1, col: C.i }, { lab: 'a₃', v: A3, col: C.i }, { lab: 'b', v: B2, col: C.peri, f: 0, comp: ['十二', '三减六', '九加六', '十八'].map(w => gin(cue('C10', w) + 0.6)), vcol: C.peri }],
      DY + 120, A * gin(cue('C08', 'a一等于')) * (1 - B.win(s('D03') - 0.3, s('D04') - 0.2)), { dx: 150, x0: DX + 220 });
    // D03 / C09：特解 + 零空间
    { const g = A * B.win(s('D03'), s('D04') - 0.1);
      if (g > 0) {
        ctag('特解 x₀ = (3, 0, 6, 0, 0)', DX + 20, DY - 80, { px: 32, a: g * gin(cue('D03', '特解是')), color: C.i, font: F.serif });
        const vs = [[-2, 1, 0, 0, 0], [-3, 0, -2, 1, 0], [-1, 0, -4, 0, 1]], ws = ['x二取一', 'x四取一', 'x五取一'];
        vs.forEach((v, q) => { const x = DX + 20 + (q - 1) * 190; K.cvec(x, DY + 140, v, g * gin(cue('D03', ws[q])), { px: 28, col: C.free }); ctag(['x₂ = 1', 'x₄ = 1', 'x₅ = 1'][q], x, DY + 10, { px: 24, a: g * gin(cue('D03', ws[q])), color: C.free }); });
        // 变号：U 第 2 列 (2, 0) → (−2, ·, 0)
        const tv = cue('C09', '要变号');
        K.colBox(M, 1, 0, 1, C.free, g * B.win(tv - 0.3, e('C09') + 0.5), 22);
        const [cx, cy] = M.cell(0, 1);
        B.fly([cx, cy], [DX + 20 - 190 - 20, DY + 140 - 2 * 44], prog(B.t, tv, tv + 0.9), C.free, { lift: 80, txt: '2 → −2', px: 26 });
        ctag('自由列的数：变号 → 放到主元位置', DX + 20, DY + 330, { px: 28, a: g * gin(tv), color: C.free });
      }
    }
    // D04 / C10：b
    { const g = A * gin(s('D04') - 0.1);
      K.colBox(M, 5, 0, 1, C.peri, g * gin(cue('D04', 'b那一列')), 22);
      K.threads(M, 5, [[0, '3'], [2, '6']], cue('D04', 'b那一列'), C.peri, g, { dy: -30, lift: 70 });
      ctag('b = 3a₁ + 6a₃', DX + 20, DY - 80, { px: 38, a: g * gin(cue('D04', '所以b')), color: C.peri, font: F.serif });
      ['3 + 12 = 15', '3 − 6 = −3', '9 + 6 = 15', '12 + 18 = 30'].forEach((tx, i) => ctag(tx, DX - 160, DY + 120 - 72 + i * 48, { px: 26, a: g * B.win(cue('C10', ['十二', '三减六', '九加六', '十八'][i]), e('C10') + 1.2), color: C.peri, font: F.serif, align: 'right' }));
      if (xs.length) [0, 1].forEach(j => B.fly([xs[j], DY + 120], [xs[2], DY + 120], prog(B.t, cue('C10', '三倍') + j * 0.6, cue('C10', '三倍') + 0.9 + j * 0.6), C.peri, { lift: 80, r: 10, txt: ['×3', '×6'][j], px: 26 }));
      B.burst(xs[2] ?? DX, DY + 120, cue('C10', '也就是') + 0.3, OK, { r1: 200 });
      const gs = A * gin(tStop2);
      K.redStamp('考场速度 ✓', DX + 20, DY + 340, prog(B.t, tStop2, tStop2 + 0.5), gs, OK, 44);
    }
  }

  function shotTimer() {
    const a = B.win(t1 - 0.2, s('G01') + 1.0); if (a <= 0) return;
    const second = B.t >= t2 - 0.3;
    const pulse = second ? 1 + 0.15 * Math.sin(Math.PI * Math.min(1, Math.max(0, (B.t - t2) / 0.4))) : 1;
    ctx.save(); ctx.translate(DX + 400, DY - 360); ctx.scale(pulse, pulse); ctx.translate(-(DX + 400), -(DY - 360));
    if (!second) K.countdown(DX + 400, DY - 360, t1, 180, tStop1, a);
    else K.countdown(DX + 400, DY - 360, t2, from2, tStop2, a);
    ctx.restore();
  }

  function shotOutro() {
    const a = B.win(s('G01'), 1e9); if (a <= 0) return;
    const g = a * gin(s('G01') + 0.2);
    B.card(DX, DY - 60, 860, 260, g, C.gpt);
    ctag('同一招', DX, DY - 140, { px: 30, a: g, color: C.gpt });
    ctag('b 在 RREF 里的那一列', DX, DY - 70, { px: 40, a: g * gin(cue('G01', 'b在RREF')), color: C.peri, font: F.serif });
    ctag('= b 在主元列下的坐标', DX, DY - 10, { px: 40, a: g * gin(cue('G01', '就是b在')), color: OK, font: F.serif });
    K.pill('会了一题 = 会了十年的题', DX, DY + 140, C.peri, a * gin(cue('G01', '会了一题')), 30);
    B.burst(DX, DY - 40, cue('G01', '就是b在') + 0.3, OK, { r1: 320, n: 22 });
  }

  function papers() {
    B.paper(EX, 'y2021_q7', { t0: cue('C01', '二零二零'), dock: cue('C01', 'A是三乘四') - 0.3, out: s('C08') - 0.4 });
    B.paper(EX, 'y2122_q2', { t0: s('C08') + 0.3, dock: cue('C08', '增广矩阵的RREF') - 0.3, out: s('G01') - 0.2 });
  }

  function draw(t) {
    B.frame(t, () => { shotQ1(); shotQ2(); shotOutro(); papers(); shotTimer(); });
  }
  return { TL, draw };
}
