// 特别篇 6 · 第 6 段：这道题有 bug（2017–18 第 8 题，15 分）。
// 分镜：原题三步 + 暗角 → U 板 + 五个列槽（a₁、a₂ 已知）→ b、x₀ 卡 → 圈主元（1、2、4），N(A) 两个向量
//       → 丝线补 a₃ ✓“一切正常” → Ax₀ = b 解出 a₄ → a₄ 与 a₁ 并排，逐分量 ×(−1) 箭头，画面一顿
//       → 故障特效 + 第 4 列丝线断开 + “数据矛盾”红章 → U 第 4 列是主元列 → 找原因：b = a₁ + 2a₂
//       → 特解 (1, 2, 0, 0, 0) 与 x₀ 第 4 分量对比 → 出题人想要的答案（绿框）→ 考场应对三步卡 → 收尾。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit, neg, vec } from '../kit.js';

export const assets = { chars: ['claude_point', 'claude_explain', 'claude_write', 'claude_think', 'claude_smile', 'ds_shock', 'ds_confused', 'gpt_think', 'gpt_cross', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y1718_q8']);
  const B = base(R, {
    assets, label: '特别篇 6 · 秩与四个子空间', title: '这道题有 bug', hi: 2, en: '2017–18 · Q8 · A BUGGY PROBLEM',
    titleEnd: () => B.L('C01').s + 0.2,
    pre: { C01: 0.6, C04: 0.4, G01: 0.6, G03: 0.8, D01: 0.6, C07: 0.6, C09: 0.8, D02: 0.4, C10: 0.3, C11: 0.4 },
    post: { C01: 1.0, C02: 1.0, C03: 1.0, C04: 1.4, C05: 1.2, G01: 1.0, G02: 1.4, G03: 2.2, D01: 0.6, C06: 1.2, C07: 1.2, C08: 1.4, C09: 1.8, D02: 0.3, C10: 1.6, G04: 1.0, C11: 2.0 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const U = [[1, 0, 2, 0, -1], [0, 1, 3, 0, -2], [0, 0, 0, 1, 5], [0, 0, 0, 0, 0]];
  const a1 = [2, 1, -3, 2], a2 = [-1, 2, 3, 1], a3 = [1, 8, 3, 7], a4 = [-2, -1, 3, -2];
  const tA3 = cue('C05', '所以a三'), tA4 = cue('G02', '除以二'), tG = cue('G03', '负a一'), tBug = cue('C06', '矛盾');
  const tPiv = cue('C04', '主元在'), tFree = cue('C04', '自由变量');

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('hum', s('C01') + 0.2, 0.25); TL.sfx('whoosh', cue('C01', '二零一七'), 0.3); TL.sfx('stamp', cue('C01', '二零一七') + 2.4, 0.3);
  TL.sfx('sting', cue('C01', '本身有bug'), 0.35);
  TL.sfx('pop', cue('C03', 'b等于'), 0.28); TL.sfx('pop', cue('C03', 'x零等于'), 0.28);
  [0, 1, 2].forEach(i => TL.sfx('pop', tPiv + i * 0.3, 0.3)); TL.sfx('zap', tFree, 0.25); TL.sfx('ding_hi', cue('C04', '零空间的基'), 0.3);
  TL.sfx('pluck', cue('C05', 'U的第三列'), 0.35); TL.sfx('whoosh', tA3, 0.3); TL.sfx('check', cue('C05', '一切正常'), 0.3);
  TL.sfx('tick', s('G01') + 0.4, 0.28); TL.sfx('tick', cue('G01', '所以a四'), 0.28);
  TL.sfx('tick', cue('G02', '也就是'), 0.28); TL.sfx('pop', tA4, 0.3);
  TL.sfx('soft_hit', s('G03') + 0.2, 0.35); [0, 1, 2, 3].forEach(i => TL.sfx('tick2', s('G03') + 0.7 + i * 0.25, 0.25));
  TL.sfx('glitch', tG, 0.45); TL.sfx('crack', tG + 0.5, 0.35);
  TL.sfx('buzz', s('D01') + 0.3, 0.25); TL.sfx('stamp', tBug, 0.45); TL.sfx('slam', tBug + 0.05, 0.3);
  TL.sfx('tick', cue('C07', '而a一加二a二'), 0.28); TL.sfx('ding_hi', cue('C07', '本身就在'), 0.3);
  TL.sfx('pop', cue('C08', '特解应该是'), 0.28); TL.sfx('sting', cue('C08', '必然有一个'), 0.3);
  TL.sfx('swoosh_soft', s('C09') + 0.3, 0.3); TL.sfx('check', cue('C09', '第二小问'), 0.28);
  ['第一，', '第二，', '第三，'].forEach(w => TL.sfx('pop', cue('C10', w), 0.3));
  TL.sfx('shimmer', s('G04') + 0.4, 0.3); TL.sfx('bell_soft', s('C11') + 0.3, 0.35);

  // ── 列槽 ──
  const SY = DY + 100, SX = j => DX + 20 + (j - 2) * 120;
  function slots(a) {
    if (a <= 0) return;
    const f = [1, 1, gin(tA3 + 0.8), gin(tA4 + 0.3), 0];
    const V = [a1, a2, a3, a4, null];
    for (let j = 0; j < 5; j++) {
      const x = SX(j), h = 4 * 44 + 26, kn = j < 2;
      const bad = j === 3 && B.t > tG;
      const col = bad ? C.free : kn ? C.i : j === 4 ? C.inkMid : OK;
      const jit = bad ? (Math.sin(B.t * 53) * 3) * (1 - prog(B.t, tG + 1.5, tG + 2.5)) : 0;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = bad ? 5 : 3; if (!kn && f[j] < 1) ctx.setLineDash([8, 8]);
      ctx.strokeRect(x - 44 + jit, SY - h / 2, 88, h); ctx.setLineDash([]); ctx.globalAlpha = a * 0.12 * (kn ? 1 : f[j]); ctx.fillStyle = col; ctx.fillRect(x - 44, SY - h / 2, 88, h); ctx.restore();
      ctag(`a${'₁₂₃₄₅'[j]}`, x, SY - h / 2 - 26, { px: 28, a, color: col, font: F.serif });
      if (V[j]) V[j].forEach((q, i) => ctag(neg(q), x + jit, SY - 66 + i * 44, { px: 30, a: a * f[j], color: kn ? C.ink : bad ? C.free : OK, font: F.serif }));
      if (!kn && f[j] < 0.05) ctag('?', x, SY, { px: 48, a: a * (0.6 + 0.4 * Math.sin(B.t * 6)), color: col, font: F.serif });
    }
  }

  function shotMain(D) {
    const a = B.win(s('C01'), s('C09') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C02', 'A是四乘五') - 0.2); if (A <= 0) return;
    B.qhead('2017–2018 期中 · 第 8 题 · 15 分', A * (1 - gin(s('G03') - 0.2)));
    const brk = B.t > tG + 0.5;
    const M = B.mat(DX + 20, DY - 260, U, { px: 32, a: A, cell: (i, j) => {
      if (j === 3 && B.t > s('D01') && i === 2) return { col: C.free };
      if (((i === 0 && j === 0) || (i === 1 && j === 1) || (i === 2 && j === 3)) && B.t > tPiv) return { col: C.i };
      if ((j === 2 || j === 4) && B.t > tFree && i < 3) return { col: C.free };
      return null;
    } });
    ['x₁', 'x₂', 'x₃', 'x₄', 'x₅'].forEach((v, j) => ctag(v, M.cell(0, j)[0], DY - 260 - M.h / 2 - 24, { px: 22, a: A * gin(tPiv), color: (j === 2 || j === 4) ? C.free : C.i }));
    [[0, 0], [1, 1], [2, 3]].forEach(([r, c], q) => { const [x, y] = M.cell(r, c); K.ring(x, y, 22, r === 2 && B.t > s('D01') ? C.free : C.i, A, prog(B.t, tPiv + q * 0.3, tPiv + q * 0.3 + 0.5), r === 2 && B.t > s('D01') ? 6 : 4); });
    ctag('U', DX + 20 - M.w / 2 - 50, DY - 260, { px: 32, a: A, color: C.inkMid, font: F.serif });
    // 列槽
    slots(A * gin(cue('C02', 'a一等于')) * (1 - B.win(s('C07') - 0.3, s('C09') + 1)));
    // C03：b、x₀
    { const g = A * B.win(s('C03'), s('C04') - 0.1);
      ctag('b = (0, 5, 3, 4)', DX - 150, DY - 110, { px: 32, a: g * gin(cue('C03', 'b等于')), color: C.peri, font: F.serif });
      ctag('x₀ = (3, 2, 0, 2, 0)', DX + 190, DY - 110, { px: 32, a: g * gin(cue('C03', 'x零等于')), color: C.i, font: F.serif }); }
    // C04：零空间
    { const g = A * B.win(s('C04'), s('C05') - 0.1);
      ctag('自由变量 x₃、x₅', DX + 20, DY - 110, { px: 30, a: g * gin(tFree), color: C.free });
      B.card(DX + 20, DY + 290, 700, 70, g * gin(cue('C04', '零空间的基')), C.free);
      ctag('N(A) 基：(−2, −3, 1, 0, 0)，(1, 2, 0, −5, 1)', DX + 20, DY + 290, { px: 30, a: g * gin(cue('C04', '零空间的基')), color: C.free, font: F.serif }); }
    // C05：a₃
    { const g = A * B.win(s('C05'), s('G01') - 0.1);
      K.colBox(M, 2, 0, 2, C.k, g * gin(cue('C05', 'U的第三列')), 22);
      K.threads(M, 2, [[0, '2'], [1, '3']], cue('C05', 'U的第三列') + 0.4, C.k, g, { dy: -28, lift: 55 });
      ctag('a₃ = 2a₁ + 3a₂ = (1, 8, 3, 7)', DX + 20, DY - 110, { px: 30, a: g * gin(tA3), color: OK, font: F.serif });
      [0, 1].forEach(j => B.fly([SX(j), SY], [SX(2), SY], prog(B.t, tA3 + j * 0.35, tA3 + 0.8 + j * 0.35), C.k, { lift: 80, r: 9 }));
      K.pill('一切正常 ✓', DX + 20, DY + 290, OK, g * gin(cue('C05', '一切正常')), 28); }
    // G01 / G02：a₄
    { const g = A * B.win(s('G01'), s('G03') + 0.2);
      ctag('Ax₀ = 3a₁ + 2a₂ + 2a₄ = b', DX + 20, DY - 110, { px: 32, a: g * gin(s('G01') + 0.4) * (1 - gin(s('G02'))), color: C.gpt, font: F.serif });
      B.card(DX + 20, DY + 290, 640, 74, g * gin(cue('G01', '所以a四')), C.gpt);
      ctag('a₄ = (b − 3a₁ − 2a₂) / 2', DX + 20, DY + 290, { px: 32, a: g * gin(cue('G01', '所以a四')), color: C.gpt, font: F.serif });
      ctag('b − 3a₁ − 2a₂ = (−4, −2, 6, −4)', DX + 20, DY - 110, { px: 30, a: g * gin(cue('G02', '也就是')), color: C.ink, font: F.serif });
      [0, 1].forEach(j => B.fly([SX(j), SY], [SX(3), SY], prog(B.t, tA4 - 0.6 + j * 0.3, tA4 + 0.2 + j * 0.3), C.gpt, { lift: 70, r: 9 })); }
    // G03：a₄ 与 a₁ 并排
    { const g = A * B.win(s('G03') - 0.1, s('C07') - 0.2);
      if (g > 0) {
        const u = smoother(prog(B.t, s('G03'), s('G03') + 0.6));
        [0, 1, 2, 3].forEach(i => {
          const y = SY - 66 + i * 44, gi = g * gin(s('G03') + 0.7 + i * 0.25);
          arrow(ctx, [SX(0) + 46, y], [SX(3) - 46, y], { color: C.free, width: 3, head: 12, alpha: gi * u, grow: gin(s('G03') + 0.7 + i * 0.25, 0.4) });
          ctag('×(−1)', (SX(0) + SX(3)) / 2 + 10, y - 2, { px: 22, a: gi * u, color: C.free, font: F.serif });
        });
        const gq = g * gin(tG - 0.2);
        const k = lerp(1.5, 1, outBack(prog(B.t, tG - 0.2, tG + 0.3), 2));
        ctx.save(); ctx.translate(DX + 20, DY - 110); ctx.scale(k, k); ctx.translate(-(DX + 20), -(DY - 110));
        ctag('a₄ = −a₁ ？！', DX + 20, DY - 110, { px: 44, a: gq, color: C.free, font: F.serif }); ctx.restore();
      }
    }
    // 丝线断开：U 第 4 列 ↔ A 第 4 列
    { const g = A * B.win(tG - 1.2, s('C07') - 0.3);
      if (g > 0) {
        const [ux, uy] = M.cell(3, 3), ty = SY - 125, br = prog(B.t, tG + 0.5, tG + 1.1);
        const mid = (uy + 30 + ty) / 2;
        ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = brk ? C.free : C.j; ctx.lineWidth = 4; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.moveTo(ux, uy + 30); ctx.lineTo(ux, lerp(mid, mid - 30, br)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(SX(3), ty); ctx.lineTo(SX(3), lerp(mid, mid + 30, br)); ctx.stroke(); ctx.restore();
        if (br > 0 && br < 1) B.burst(ux, mid, tG + 0.5, C.free, { r1: 80, n: 10, d: 0.5 });
      }
    }
    // D01：主元列
    { const g = A * B.win(s('D01'), s('C07') - 0.2);
      K.colBox(M, 3, 0, 3, C.free, g, 22);
      ctag('主元列 ≠ 前面列的组合', DX + 340, DY - 260, { px: 26, a: g * gin(cue('D01', '主元列不可能')), color: C.free, align: 'left' }); }
    // 数据矛盾章
    K.redStamp('数据矛盾', DX + 230, DY + 290, prog(B.t, tBug, tBug + 0.5), A * (1 - gin(s('C07') - 0.3)), C.free, 54);
    B.flash(tBug, 0.25, 0.3, C.free);
    // C07 / C08：找原因
    { const g = A * B.win(s('C07'), s('C09') - 0.2);
      if (g > 0) {
        ctag('找原因', DX + 20, DY - 110, { px: 32, a: g, color: C.peri });
        ctag('a₁ + 2a₂ = (2 − 2, 1 + 4, −3 + 6, 2 + 2) = (0, 5, 3, 4) = b', DX + 20, DY - 30, { px: 30, a: g * gin(cue('C07', '而a一加二a二')), color: C.ink, font: F.serif });
        K.pill('b ∈ Span{a₁, a₂}', DX + 20, DY + 40, C.peri, g * gin(cue('C07', '本身就在')), 28);
        const g8 = g * gin(s('C08'));
        ctag('应有特解', DX - 230, DY + 150, { px: 28, a: g8, color: OK }); ctag('题目给的 x₀', DX + 270, DY + 150, { px: 28, a: g8 * gin(cue('C08', '题目却给')), color: C.free });
        const xs = [1, 2, 0, 0, 0], x0 = [3, 2, 0, 2, 0];
        xs.forEach((v, i) => {
          const y = DY + 210 + 0; const hi = i === 3;
          ctag(neg(v), DX - 330 + i * 50, y, { px: 34, a: g8 * gin(cue('C08', '特解应该是') + i * 0.12), color: hi ? OK : C.ink, font: F.serif });
          ctag(neg(x0[i]), DX + 170 + i * 50, y, { px: 34, a: g8 * gin(cue('C08', '题目却给') + i * 0.12), color: hi ? C.free : C.ink, font: F.serif });
        });
        const gh = g * gin(cue('C08', '第四个分量是零'));
        K.ring(DX - 330 + 150, DY + 210, 28, OK, gh, prog(B.t, cue('C08', '第四个分量是零'), cue('C08', '第四个分量是零') + 0.5));
        K.ring(DX + 170 + 150, DY + 210, 28, C.free, g * gin(cue('C08', '第四个分量是二')), prog(B.t, cue('C08', '第四个分量是二'), cue('C08', '第四个分量是二') + 0.5));
        ctag('≠', DX + 20, DY + 210, { px: 48, a: g * gin(cue('C08', '第四个分量是二')), color: C.free, font: F.serif });
        B.xcard('b 和 x₀，必有一个印错了', DX + 20, DY + 320, 600, 70, g * gin(cue('C08', '必然有一个')), C.free, 32);
      }
    }
  }

  // ════ 出题人想要的答案 + 考场应对 ════
  function shotAnswer() {
    const a = B.win(s('C09'), s('C11') - 0.2); if (a <= 0) return;
    const g = a * B.win(s('C09'), s('D02') + 0.2);
    if (g > 0) {
      B.card(DX + 20, DY - 80, 900, 330, g, OK);
      ctag('出题人想要的答案', DX + 20, DY - 210, { px: 30, a: g, color: OK });
      ctag('(i)  x = x₀ + c₁(−2, −3, 1, 0, 0) + c₂(1, 2, 0, −5, 1)', DX + 20, DY - 130, { px: 30, a: g * gin(cue('C09', '第一小问')), color: C.ink, font: F.serif });
      ctag('(ii)  a₃ = 2a₁ + 3a₂', DX + 20, DY - 60, { px: 30, a: g * gin(cue('C09', '第二小问')), color: C.ink, font: F.serif });
      ctag('a₅ = −a₁ − 2a₂ + 5a₄（读 U 第 5 列）', DX + 20, DY + 10, { px: 30, a: g * gin(cue('C09', 'a五读U')), color: C.ink, font: F.serif });
    }
    const g2 = a * gin(s('D02') + 0.3);
    if (g2 > 0) {
      const steps = [['①', '写出验算过程：a₄ = −a₁', cue('C10', '第一，')], ['②', '一句话注明：与第 4 列为主元列矛盾，疑数据有误', cue('C10', '第二，')], ['③', '按题意继续：x₀ + N(A)、a₅ 的表示式', cue('C10', '第三，')]];
      ctag('考场应对 · 三步', DX + 20, DY - 250, { px: 34, a: g2 * gin(s('C10')), color: C.peri });
      steps.forEach(([n, tx, t0], i) => {
        const gi = g2 * gin(t0, 0.45), y = DY - 160 + i * 110, k = lerp(0.7, 1, outBack(prog(B.t, t0, t0 + 0.45), 2));
        ctx.save(); ctx.translate(DX + 20, y); ctx.scale(k, k); ctx.translate(-(DX + 20), -y);
        B.card(DX + 20, y, 880, 84, gi * 0.95, i === 1 ? C.free : C.peri);
        ctag(n, DX - 390, y, { px: 36, a: gi, color: i === 1 ? C.free : C.peri, font: F.serif });
        ctag(tx, DX - 350, y, { px: 30, a: gi, color: C.ink, align: 'left' }); ctx.restore();
      });
      const g4 = a * gin(s('G04'));
      K.pill('发现矛盾 = 真的懂了（只会加分）', DX + 20, DY + 200, C.gpt, g4, 28);
      ctag('别为了“凑答案”改自己算对的数', DX + 20, DY + 270, { px: 30, a: a * gin(cue('G04', '千万别')), color: C.free });
    }
  }

  function shotOutro() {
    const a = B.win(s('C11'), 1e9); if (a <= 0) return;
    const g = a * gin(s('C11') + 0.2);
    B.card(DX, DY - 60, 860, 230, g, OK);
    ctag('验算习惯', DX, DY - 120, { px: 34, a: g, color: OK });
    ctag('抓自己的错', DX - 200, DY - 30, { px: 40, a: g * gin(cue('C11', '它不只抓')), color: C.ink, font: F.serif });
    ctag('也抓试卷的错', DX + 200, DY - 30, { px: 40, a: g * gin(cue('C11', '偶尔还能')), color: C.peri, font: F.serif });
    B.burst(DX + 200, DY - 30, cue('C11', '偶尔还能') + 0.4, C.peri, { r1: 200 });
  }

  function papers() {
    B.paper(EX, 'y1718_q8', { t0: cue('C01', '二零一七'), dock: cue('C02', 'A是四乘五') - 0.3, out: s('C09') - 0.3 });
  }

  function draw(t) {
    B.frame(t, D => { K.vignette(0.8 * B.win(s('C01'), e('C11') + 1, 1.2, 1.5)); shotMain(D); shotAnswer(); shotOutro(); papers(); });
    K.glitch(tG - 0.1, tG + 1.3, 1);
    K.glitch(tBug - 0.05, tBug + 0.45, 0.6);
  }
  return { TL, draw };
}
