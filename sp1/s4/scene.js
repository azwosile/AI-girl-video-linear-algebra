// 特别篇 1 · 第 4 段：系数就是解（2018–19 第 3 题；2017–18 第 1(iv) 题；2024–25 第 1(1) 题）。
// 分镜：原题三步 → 列积木（A 拆成三根竖条，x 的分量贴上去）→ 系数 3、1、4 从 b 的等式里“飞出”排成 x
//       → 相容 ✓ / 齐次非零解 ⇒ 奇异（红章）→ 评分点 → 第二题：大肥鱼抢答被叫停，项逐个移到左边、符号翻转
//       → 第三题：两式相等 → 移项 → 系数 → 秩–零化度天平（3 = 2 + 1）→ N(A) = Span → 特解 + 通解
//       → 五秒变式倒计时 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_confused', 'ds_proud', 'ds_shock', 'ds_think', 'gpt_cross', 'gpt_point', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q3', 'y1718_f4', 'y2425_f1']);
  const B = base(R, {
    assets, label: '特别篇 1 · 方程组与参数讨论', title: '系数就是解', hi: 4, en: 'COEFFICIENTS ARE SOLUTIONS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C03: 0.4, C08: 0.8, C10: 0.8, C13: 0.4, C16: 0.8, G04: 0.6 },
    post: { C03: 1.4, C04: 1.6, C05: 0.8, C07: 1.2, G01: 1.4, C09: 1.6, D03: 0.8, C11: 1.2, C13: 1.6, C14: 1.4, G03: 1.2, C15: 1.6, C16: 5.0, D05: 1.0, G04: 1.6 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  // ── 音效 ──
  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  TL.sfx('sting', s('D01') + 0.2, 0.2);
  [0, 1, 2].forEach(k => TL.sfx('pop', cue('C03', '把A的列组合') + k * 0.35, 0.28)); TL.sfx('click', cue('C03', 'A x 等于x一'), 0.3);
  TL.sfx('sparkle', cue('C04', '直接飞出来'), 0.35); [0, 1, 2].forEach(k => TL.sfx('marimba_hi', cue('C04', '直接飞出来') + 0.2 + k * 0.2, 0.22));
  TL.sfx('check', s('C05') + 0.2, 0.3); TL.sfx('pop', cue('C06', '同样地读'), 0.3); TL.sfx('stamp', cue('C07', '奇异'), 0.35);
  TL.sfx('zap', s('G01') + 0.3, 0.25);
  TL.sfx('whoosh', s('C08') + 0.2, 0.3); TL.sfx('stamp', s('C08') + 2.6, 0.3);
  TL.sfx('pop', s('D02') + 0.2, 0.25); TL.sfx('slam', s('G02') + 0.1, 0.3); TL.sfx('glitch', s('G02') + 0.2, 0.25);
  [0, 1].forEach(k => TL.sfx('swoosh_soft', cue('C09', '挪到同一边') + k * 0.5, 0.28)); TL.sfx('ding_hi', cue('C09', '所以解是'), 0.3); TL.sfx('buzz', cue('C09', '不是一'), 0.22);
  TL.sfx('ding_lo', s('D03') + 0.1, 0.25);
  TL.sfx('whoosh', s('C10') + 0.2, 0.3); TL.sfx('stamp', s('C10') + 2.6, 0.3);
  TL.sfx('click', cue('C11', '互相相等'), 0.3); TL.sfx('swoosh_soft', cue('C11', '移项'), 0.3);
  TL.sfx('pluck', s('C12') + 0.2, 0.3); TL.sfx('pop', s('D04') + 0.2, 0.25);
  TL.sfx('thud', cue('C13', '列数三'), 0.3); TL.sfx('ding', cue('C13', '维数等于一'), 0.3);
  TL.sfx('impact', cue('C14', '张成的空间'), 0.3); TL.sfx('zap', cue('G03', '会被判错'), 0.25);
  TL.sfx('ding_hi', cue('C15', '全部解'), 0.3);
  TL.sfx('count', cue('C16', '五秒钟'), 0.3); TL.sfx('count_go', s('D05'), 0.3); TL.sfx('check', s('C17') + 0.1, 0.3);
  TL.sfx('swell', s('G04') - 0.2, 0.3);

  // ════ 第 1 题 ════
  const BX = j => DX - 200 + j * 130, BY = DY - 120;
  function bars(a, lab) {
    const cols = [C.i, C.j, C.free];
    [0, 1, 2].forEach(j => {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(cols[j], 0.22); ctx.strokeStyle = cols[j]; ctx.lineWidth = 3;
      ctx.fillRect(BX(j) - 34, BY - 110, 68, 220); ctx.strokeRect(BX(j) - 34, BY - 110, 68, 220); ctx.restore();
      ctag(`a${'₁₂₃'[j]}`, BX(j), BY, { px: 34, a, color: cols[j], font: F.serif });
      if (lab) ctag(lab[j], BX(j), BY - 150, { px: 34, a, color: C.peri, font: F.serif });
    });
  }
  function shotQ1() {
    const a = B.win(s('C02'), s('C08') - 0.3); if (a <= 0) return;
    const g0 = a * gin(s('C03'));
    ctag('A =', BX(0) - 110, BY, { px: 36, a: g0, font: F.serif });
    const tc = cue('C04', '直接飞出来');
    bars(g0, B.t > tc + 0.8 ? ['3', '1', '4'] : null);
    // x 分量方块贴到竖条上
    const tb = cue('C03', '把A的列组合');
    ['x₁', 'x₂', 'x₃'].forEach((q, j) => {
      const u = smoother(prog(B.t, tb + j * 0.35, tb + 0.6 + j * 0.35)); if (u <= 0 || B.t > tc) return;
      const x = lerp(DX + 300, BX(j), u), y = lerp(BY + j * 60 - 60, BY - 150, u);
      B.card(x, y, 70, 56, a * (1 - gin(tc - 0.3)), C.peri); ctag(q, x, y, { px: 30, a: a * (1 - gin(tc - 0.3)), color: C.peri, font: F.serif });
    });
    ctag('Ax = x₁a₁ + x₂a₂ + x₃a₃', DX, DY + 50, { px: 38, a: a * B.win(cue('C03', 'A x 等于x一'), s('C04')), font: F.serif });
    // b = 3a₁ + 1·a₂ + 4a₃ → 系数飞出
    const gq = a * B.win(s('C04'), s('C06') - 0.1);
    if (gq > 0) {
      const y = DY + 50; ctag('b = ', DX - 260, y, { px: 38, a: gq, font: F.serif });
      const parts = [['3', 'a₁ +'], ['1·', 'a₂ +'], ['4', 'a₃']];
      parts.forEach(([c, r], k) => {
        const x = DX - 160 + k * 170, fly = prog(B.t, tc + k * 0.2, tc + 0.8 + k * 0.2);
        if (fly < 1) ctag(c, lerp(x, BX(k), smoother(fly)), lerp(y, BY - 150, smoother(fly)) - Math.sin(Math.PI * fly) * 80, { px: 40, a: gq, color: C.peri, font: F.serif });
        ctag(r, x + 60, y, { px: 38, a: gq, font: F.serif });
      });
      const gx = gq * gin(tc + 1.0);
      ctag('x =', DX - 120, DY + 200, { px: 36, a: gx, font: F.serif }); K.cvec(DX - 30, DY + 200, [3, 1, 4], gx, { px: 32, col: C.peri });
      ctag('就是一个解！', DX + 160, DY + 200, { px: 34, a: gx, color: C.peri });
      B.burst(DX - 30, DY + 200, tc + 1.0, C.peri, { r1: 200 });
      B.stamp(DX + 330, DY + 60, true, prog(B.t, s('C05') + 0.1, s('C05') + 0.6), gq, '相容');
    }
    const gb = a * B.win(s('C06'), s('C08') - 0.3);
    if (gb > 0) {
      ctag('3a₁ + a₂ + 4a₃ = 0', DX, DY + 50, { px: 40, a: gb, font: F.serif });
      ctag('x = (3, 1, 4)ᵀ ≠ 0，Ax = 0', DX, DY + 120, { px: 34, a: gb * gin(cue('C06', '同样地读')), color: C.peri, font: F.serif });
      K.redStamp('奇异', DX + 300, DY + 210, prog(B.t, cue('C07', '奇异'), cue('C07', '奇异') + 0.5), gb, C.free, 50);
      const gG = gb * gin(s('G01'));
      B.card(DX, DY + 300, 860, 100, gG * 0.95, C.gpt);
      ctag('评分点：写出 x = (3,1,4)ᵀ ≠ 0 满足 Ax = 0', DX, DY + 280, { px: 26, a: gG, color: C.gpt });
      ctag('+ 定理：A 非奇异 ⇔ Ax = 0 只有零解', DX, DY + 320, { px: 26, a: gG * gin(cue('G01', '再引用定理')), color: C.gpt });
    }
  }

  // ════ 第 2 题：先移项 ════
  function shotQ2() {
    const a = B.win(s('C08') + 3.5, s('C10') - 0.3); if (a <= 0) return;
    B.qhead('2017–2018 · 填空 1(iv)', a);
    const tm = cue('C09', '挪到同一边'), u1 = smoother(prog(B.t, tm, tm + 0.8)), u2 = smoother(prog(B.t, tm + 0.5, tm + 1.3));
    const y = DY - 140;
    // a₁ + a₂ = 3a₃ − 2a₄ → a₁ + a₂ − 3a₃ + 2a₄ = 0
    ctag('a₁ + a₂', DX - 220, y, { px: 42, a, font: F.serif });
    ctag('=', lerp(DX - 70, DX + 330, u2), y, { px: 42, a, font: F.serif });
    ctag(u1 > 0.5 ? '− 3a₃' : '3a₃', lerp(DX + 20, DX - 30, u1), y - Math.sin(Math.PI * u1) * 70, { px: 42, a, font: F.serif, color: u1 > 0.5 ? C.peri : C.ink });
    ctag(u2 > 0.5 ? '+ 2a₄' : '− 2a₄', lerp(DX + 160, DX + 170, u2), y - Math.sin(Math.PI * u2) * 70, { px: 42, a, font: F.serif, color: u2 > 0.5 ? C.peri : C.ink });
    ctag('0', DX + 400, y, { px: 42, a: a * u2, font: F.serif });
    // 大肥鱼的错误答案
    const gw = a * gin(s('D02') + 0.2);
    ctag('(1, 1, 3, −2)', DX - 150, DY + 40, { px: 38, a: gw, color: C.ds, font: F.serif });
    B.cross(DX - 150, DY + 40, prog(B.t, cue('C09', '不是一'), cue('C09', '不是一') + 0.4), gw, 50);
    const gr = a * gin(cue('C09', '所以解是'));
    B.xcard('x = (1, 1, −3, 2)ᵀ', DX + 200, DY + 40, 360, 80, gr, OK, 38, OK);
    B.burst(DX + 200, DY + 40, cue('C09', '所以解是') + 0.2, OK, { r1: 200 });
    K.redStamp('先移项！', DX, DY + 220, prog(B.t, s('G02'), s('G02') + 0.5), a * gin(s('G02')), C.free, 46);
  }

  // ════ 第 3 题：N(A) ════
  function shotQ3() {
    const a = B.win(s('C10') + 3.5, s('C16') - 0.3); if (a <= 0) return;
    B.qhead('2024–2025 · 填空 1(1)', a);
    const y = DY - 250;
    ctag('a₁ − a₂ = a₂ + a₃ = b', DX, y, { px: 38, a: a * gin(s('C11') - 0.5), font: F.serif });
    const g1 = a * gin(cue('C11', '移项'));
    ctag('⇒ a₁ − 2a₂ − a₃ = 0', DX, y + 70, { px: 38, a: g1, color: C.peri, font: F.serif });
    const g2 = a * gin(s('C12'));
    ctag('(1, −2, −1)ᵀ ∈ N(A)', DX, y + 140, { px: 36, a: g2, color: C.free, font: F.serif });
    // 天平
    const gb = a * B.win(s('C13'), s('C15') - 0.1);
    if (gb > 0) {
      const tilt = lerp(0.18, 0, smoother(prog(B.t, cue('C13', '维数等于一') - 0.3, cue('C13', '维数等于一') + 0.5)));
      const cx = DX, cy = DY + 90;
      ctx.save(); ctx.globalAlpha = gb; ctx.strokeStyle = C.ink; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 140); ctx.moveTo(cx - 60, cy + 140); ctx.lineTo(cx + 60, cy + 140); ctx.stroke();
      ctx.translate(cx, cy); ctx.rotate(tilt); ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(260, 0); ctx.stroke(); ctx.restore();
      const ly = cy - Math.sin(tilt) * 260, ry = cy + Math.sin(tilt) * 260;
      B.xcard('rank = 2', cx - 260, ly + 50, 200, 60, gb, C.i, 30);
      B.xcard(B.t > cue('C13', '维数等于一') ? 'dim N(A) = 1' : 'dim N(A) = ?', cx + 260, ry + 50, 240, 60, gb, C.free, 30);
      ctag('n = 3（列数）', cx, cy - 40, { px: 28, a: gb, color: C.peri });
    }
    const gs = a * gin(cue('C14', '张成的空间'));
    if (gs > 0) {
      B.xcard('N(A) = Span{(1, −2, −1)ᵀ}', DX, DY + 120, 560, 84, gs * (1 - gin(s('C15')) * 0.5), OK, 38, OK);
      B.burst(DX, DY + 120, cue('C14', '张成的空间') + 0.2, OK, { r1: 260 });
      const gG = gs * gin(s('G03'));
      B.card(DX, DY + 240, 820, 70, gG * 0.95, C.gpt);
      ctag('只写一个向量、不写 Span → 判错', DX, DY + 240, { px: 28, a: gG, color: C.gpt });
    }
    const gp = a * gin(s('C15'));
    if (gp > 0) {
      B.card(DX, DY + 330, 860, 80, gp, C.i);
      ctag('a₁ − a₂ = b ⇒ x = (1, −1, 0) + k(1, −2, −1)', DX, DY + 330, { px: 30, a: gp * gin(cue('C15', '全部解')), color: C.i, font: F.serif });
    }
  }

  // ════ 变式 ════
  function shotQuiz() {
    const a = B.win(s('C16'), s('G04') - 0.2); if (a <= 0) return;
    B.card(DX, DY - 120, 760, 110, a, C.peri);
    ctag('变式：2a₁ − a₃ = a₂，Ax = 0 的一个非零解？', DX, DY - 120, { px: 32, a, color: C.ink, font: F.serif });
    K.countdown(DX, DY + 60, cue('C16', '五秒钟'), 5, s('D05'), a * (1 - gin(s('D05') + 1.2)));
    const gd = a * gin(cue('D05', '所以是'));
    ctag('2a₁ − a₂ − a₃ = 0', DX, DY + 40, { px: 38, a: a * gin(s('D05') + 1.3), color: C.ink, font: F.serif });
    B.xcard('(2, −1, −1)ᵀ', DX, DY + 150, 340, 80, gd, OK, 38, OK);
    B.stamp(DX + 280, DY + 140, true, prog(B.t, s('C17'), s('C17') + 0.5), a);
  }

  function shotOutro() {
    const a = B.win(s('G04'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 系数就是解', ['① 看见列的线性组合等式 → 先移项', '② 移到一边 = 0，系数就是 Ax = 0 的解', '③ 求 N(A)：秩–零化度定维数，再写 Span'],
      [s('G04') + 0.3, cue('G04', '系数就是解'), cue('G04', '求零空间')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotQ1(); shotQ2(); shotQ3(); shotQuiz(); shotOutro();
      B.paper(EX, 'y1819_q3', { t0: s('C01') + 0.2, dock: s('C02') + 0.5, out: s('C08') - 0.4 });
      B.paper(EX, 'y1718_f4', { t0: s('C08') + 0.2, dock: s('C08') + 3.5, out: s('C10') - 0.4 });
      B.paper(EX, 'y2425_f1', { t0: s('C10') + 0.2, dock: s('C10') + 3.5, out: s('C16') - 0.4 });
    });
  }
  return { TL, draw };
}
