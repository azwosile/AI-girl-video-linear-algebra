// 特别篇 6 · 第 5 段：由 RREF 求 N(A)、R(Aᵀ) 和剩余列（2022–23 第 2 题，10 分）——一题四问的最短书写。
// 分镜：原题三步 → U + a₁、a₂ 居中 → 缩到右上角，答卷纸展开 → 四行逐字写出，行首小标签 ①看 U ②看 U ③丝线 ④丝线
//       → 零空间向量 (−2, −1, 1, 0) 与第三行连线：“零空间里的每个向量都是一条丝线” → 第三、四行回指第一行“自带校验”。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit, neg, vec } from '../kit.js';

export const assets = { chars: ['claude_point', 'claude_explain', 'claude_write', 'claude_smile', 'ds_ask', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y2223_q2']);
  const B = base(R, {
    assets, label: '特别篇 6 · 秩与四个子空间', title: '最短书写', hi: 2, en: '2022–23 · Q2 · 10 PTS',
    titleEnd: () => B.L('C01').s + 0.2,
    pre: { C01: 0.6, C03: 0.4, D01: 0.4, G01: 0.4 },
    post: { C01: 1.0, C02: 1.0, C03: 1.4, C04: 1.2, C05: 1.4, C06: 1.6, D01: 0.4, C07: 1.6, G01: 2.2 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const U = [[1, 0, 2, 1], [0, 1, 1, 4], [0, 0, 0, 0], [0, 0, 0, 0]];

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', s('C01') + 0.2, 0.35); TL.sfx('stamp', s('C01') + 2.6, 0.35);
  TL.sfx('swoosh_soft', s('C02') + 0.3, 0.3);
  ['C03', 'C04', 'C05', 'C06'].forEach(id => { TL.sfx('pop', s(id) + 0.2, 0.28); TL.sfx('type', s(id) + 0.6, 0.18); });
  TL.sfx('ding_hi', cue('C05', '也就是'), 0.3); TL.sfx('ding_hi', cue('C06', '也就是'), 0.3);
  TL.sfx('pop', s('D01') + 0.3, 0.28);
  TL.sfx('pluck', cue('C07', '意思就是'), 0.35); TL.sfx('shimmer', cue('C07', '每一个向量'), 0.35);
  TL.sfx('check', cue('G01', '验算第一行'), 0.3); TL.sfx('check', cue('G01', '验算第一行') + 0.5, 0.3); TL.sfx('bell_soft', cue('G01', '自带校验'), 0.35);

  // 答卷纸四行：[标签, 颜色, 主行, 算式行, 主行时刻, 算式时刻]
  const LN = [
    ['①看 U', C.free, 'N(A) = N(U)：x₃ = s，x₄ = t', '基 (−2, −1, 1, 0)，(−1, −4, 0, 1)', s('C03') + 0.3, cue('C03', '基是')],
    ['②看 U', C.j, 'R(Aᵀ) = R(Uᵀ)', '基 (1, 0, 2, 1)，(0, 1, 1, 4)', s('C04') + 0.3, cue('C04', '基是')],
    ['③丝线', C.k, 'U 第 3 列 (2, 1)：a₃ = 2a₁ + a₂', '= (−2 + 4, 10 − 3, 4 + 7, 2 − 1) = (2, 7, 11, 1)', s('C05') + 0.3, cue('C05', '等于负二')],
    ['④丝线', C.k, 'U 第 4 列 (1, 4)：a₄ = a₁ + 4a₂', '= (−1 + 16, 5 − 12, 2 + 28, 1 − 4) = (15, −7, 30, −3)', s('C06') + 0.3, cue('C06', '等于负一')],
  ];
  const LY = k => DY - 150 + k * 112, LX0 = DX - 330;

  function shotMain() {
    const a = B.win(s('C01'), 1e9); if (a <= 0) return;
    const A = a * gin(cue('C01', '四乘四的A') - 0.2); if (A <= 0) return;
    B.qhead('2022–2023 期中 · 第 2 题 · 10 分', A * (1 - gin(s('C02') + 0.4)));
    // U：先居中，C02 后缩到右上角
    const sh = smoother(prog(B.t, s('C02') + 0.2, s('C02') + 1.0));
    const ux = lerp(DX - 120, DX + 330, sh), uy = lerp(DY - 120, DY - 300, sh), px = lerp(44, 26, sh);
    const tc3 = cue('C05', 'U的第三列'), tc4 = cue('C06', 'U的第四列');
    const M = B.mat(ux, uy, U, { px, a: A, cell: (i, j) => ({ col: i === j && i < 2 ? C.i : (j === 2 && B.t > tc3 && B.t < s('C06')) || (j === 3 && B.t > tc4 && B.t < s('D01')) ? C.k : null }) });
    ctag('U', ux - M.w / 2 - lerp(50, 30, sh), uy, { px: lerp(40, 26, sh), a: A, color: C.inkMid, font: F.serif });
    if (B.t > tc3 && B.t < s('C06')) K.colBox(M, 2, 0, 1, C.k, A * B.win(tc3, s('C06')), lerp(30, 20, sh));
    if (B.t > tc4 && B.t < s('D01')) K.colBox(M, 3, 0, 1, C.k, A * B.win(tc4, s('D01')), lerp(30, 20, sh));
    // a₁、a₂（C01 居中显示，之后缩到 U 下方）
    const ax = lerp(DX + 200, DX + 330, sh), ay = lerp(DY - 120, DY - 160, sh);
    ctag('a₁ = (−1, 5, 2, 1)', ax, ay - lerp(30, 14, sh), { px: lerp(32, 22, sh), a: A * gin(cue('C01', 'a一等于')), color: C.i, font: F.serif });
    ctag('a₂ = (4, −3, 7, −1)', ax, ay + lerp(30, 14, sh), { px: lerp(32, 22, sh), a: A * gin(cue('C01', 'a二等于')), color: C.i, font: F.serif });
    ctag('求 N(A)、R(Aᵀ) 的基，a₃、a₄', DX, DY + 120, { px: 32, a: A * B.win(cue('C01', '求零空间'), s('C02') + 0.4), color: C.ink });
    // 答卷纸
    const gp = A * gin(s('C02') + 0.6);
    if (gp > 0) {
      const top = DY - 220, bot = DY + 250, w = 900, open = outCubic(prog(B.t, s('C02') + 0.6, s('C02') + 1.4));
      ctx.save(); ctx.globalAlpha = gp; ctx.fillStyle = rgba('#F2E6D0', 0.07); ctx.fillRect(DX - w / 2, top, w, (bot - top) * open);
      ctx.strokeStyle = rgba(C.ink, 0.35); ctx.lineWidth = 2; ctx.strokeRect(DX - w / 2, top, w, (bot - top) * open);
      ctx.strokeStyle = rgba(C.free, 0.35); ctx.beginPath(); ctx.moveTo(DX - w / 2 + 70, top); ctx.lineTo(DX - w / 2 + 70, top + (bot - top) * open); ctx.stroke(); ctx.restore();
      ctag('四行解决，每行带依据', DX, top - 30, { px: 28, a: gp * B.win(s('C02') + 0.6, s('C03') + 2), color: C.peri });
      LN.forEach(([tag, col, l1, l2, t1, t2], k) => {
        const y = LY(k);
        K.pill(tag, DX - 395, y - 18, col, gp * gin(t1 - 0.2), 20);
        K.type(l1, LX0, y - 18, t1, Math.min(2.2, Math.max(0.8, t2 - t1 - 0.3)), gp, { px: 30, col: C.ink });
        K.type(l2, LX0 + 20, y + 26, t2, 2.0, gp, { px: 27, col: k < 2 ? col : C.inkMid });
        if (k >= 2) ctag(k === 2 ? '(2, 7, 11, 1)' : '(15, −7, 30, −3)', DX + 350, y - 18, { px: 28, a: gp * gin(cue(k === 2 ? 'C05' : 'C06', '也就是')), color: OK, font: F.serif });
      });
      B.burst(DX + 350, LY(2) - 18, cue('C05', '也就是') + 0.2, OK, { r1: 120 });
      B.burst(DX + 350, LY(3) - 18, cue('C06', '也就是') + 0.2, OK, { r1: 120 });
    }
    // D01 / C07：零空间向量 = 丝线
    { const g = A * B.win(s('D01'), s('G01') - 0.1);
      if (g > 0) {
        // 圈出第一行的第一个基向量和第三行
        const y1 = LY(0) + 26, y3 = LY(2) - 18;
        ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.free; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(LX0 + 40, y1 - 24, 240, 48, 12); ctx.stroke();
        ctx.strokeStyle = C.k; ctx.beginPath(); ctx.roundRect(LX0 + 190, y3 - 24, 300, 48, 12); ctx.stroke(); ctx.restore();
        K.thread([LX0 + 160, y1 + 26], [LX0 + 340, y3 + 26], prog(B.t, cue('C07', '意思就是') - 0.3, cue('C07', '意思就是') + 0.7), OK, g, { lift: -60, label: '同一件事' });
        const gq = g * gin(cue('C07', '意思就是'));
        B.card(DX, DY + 330, 820, 80, gq * 0.95, OK);
        ctag('−2a₁ − a₂ + a₃ = 0　⇔　a₃ = 2a₁ + a₂', DX, DY + 330, { px: 32, a: gq, color: OK, font: F.serif });
        K.pill('零空间里的每个向量 = 一条丝线', DX, DY + 400, C.peri, g * gin(cue('C07', '每一个向量')), 26);
        B.burst(DX, DY + 330, cue('C07', '也就是') + 0.2, OK, { r1: 260 });
      }
    }
    // G01：第三、四行回指第一行
    { const g = A * gin(s('G01'));
      if (g > 0) {
        [2, 3].forEach((k, q) => {
          const u = prog(B.t, s('G01') + 0.4 + q * 0.5, s('G01') + 1.3 + q * 0.5);
          arrow(ctx, [DX + 440, LY(k) - 18], [DX + 440, LY(0) - 10 + q * 26], { color: OK, width: 4, head: 16, alpha: g, grow: smoother(u) });
        });
        ctag('验算 ✓', DX + 440, LY(1), { px: 26, a: g * gin(cue('G01', '验算第一行')), color: OK });
        B.stamp(DX + 300, DY + 330, true, gin(cue('G01', '自带校验'), 0.4), g * gin(cue('G01', '自带校验')), '自带校验');
      }
    }
  }

  function papers() {
    B.paper(EX, 'y2223_q2', { t0: s('C01') + 0.2, dock: cue('C01', '四乘四的A') - 0.3, out: e('G01') + 1.5 });
  }

  function draw(t) {
    B.frame(t, () => { shotMain(); papers(); });
  }
  return { TL, draw };
}
