p='x4/scene.js'; s=open(p,encoding='utf-8').read(); assert 'shotAx' not in s
code = r"""
  // ════ 扩写二：17–18 Q5 怪数乘 ════
  function shotAx() {
    const a = B.win(s('C16i'), s('C17') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C16i') + 0.4);
    B.qhead('2017–2018 期中 · 第 5 题 · 12 分', A);
    B.card(DX - 60, DY - 330, 560, 64, A * gin(cue('C16i', '数乘被改了')) * 0.95, C.peri);
    ctag('α ∘ (x₁, x₂) = (αx₁, x₂)', DX - 60, DY - 330, { px: 32, a: A * gin(cue('C16i', '数乘被改了')), color: C.peri, font: F.serif });
    // 公理清单
    const RW = [
      ['加法 + 零向量 (0, 0)', s('C16j') + 1.0, cue('C16j', '自动成立'), true],
      ['1 ∘ x = x', s('C16k') + 0.5, cue('C16k', '还是x，过'), true],
      ['α ∘ (β ∘ x) = (αβ) ∘ x', cue('C16k', '阿尔法圈乘贝塔'), cue('C16k', '也过'), true],
      ['α ∘ (x + y) = α∘x + α∘y', s('C16l') + 0.3, cue('C16l', '还是过'), true],
      ['(α + β) ∘ x = α∘x + β∘x', s('C16m') + 0.3, cue('C16n', '只要x二不为零'), false],
    ];
    const lift = smoother(prog(B.t, s('C16m') - 0.4, s('C16m') + 0.4)), ga = A * (1 - gin(s('C17') - 0.5));
    RW.forEach(([tx, t0, t1, ok], i) => {
      const y = DY - 240 + i * 56, g = ga * gin(t0) * (i < 4 ? 1 - 0.45 * lift : 1);
      const fail = !ok && B.t >= t1;
      ctag(tx, DX - 210, y, { px: 28, a: g, color: fail ? C.free : (i === 4 ? C.i : C.ink), font: F.serif });
      const gm = g * gin(t1, 0.3);
      if (gm > 0) ctag(ok ? '✓' : '✗', DX + 40, y, { px: 34, a: gm, color: ok ? OK : C.free });
      if (fail) B.burst(DX + 40, y, t1, C.free, { r1: 60, n: 10 });
    });
    // 左右两边
    const gl = A * gin(s('C16m') + 0.3) * (1 - gin(s('C16n') + 2));
    if (gl > 0) {
      ctag('左：((α + β)x₁,  x₂)', DX - 160, DY + 70, { px: 30, a: A * gin(cue('C16m', '左边')), color: C.ink, font: F.serif });
      ctag('右：((α + β)x₁,  2x₂)', DX - 160, DY + 130, { px: 30, a: A * gin(cue('C16m', '右边')), color: C.ink, font: F.serif });
      const gh = A * gin(cue('C16m', '等于二x二'));
      ctx.save(); ctx.globalAlpha = gh; ctx.strokeStyle = C.free; ctx.lineWidth = 3;
      ctx.strokeRect(DX - 20, DY + 46, 70, 48); ctx.strokeRect(DX - 26, DY + 106, 90, 48); ctx.restore();
    }
    // 迷你坐标：反例
    const gp = A * gin(cue('C16n', '具体反例'));
    if (gp > 0) {
      const ox = DX + 150, oy = DY - 60, u = 72;
      ctx.save(); ctx.globalAlpha = gp * 0.5; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 1;
      for (let k = 0; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(ox + k * u, oy); ctx.lineTo(ox + k * u, oy - 2.4 * u); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ox, oy - k * u); ctx.lineTo(ox + 2.4 * u, oy - k * u); ctx.stroke(); }
      ctx.restore();
      const P = (x, y) => [ox + x * u, oy - y * u];
      arrow(ctx, P(0, 0), P(1, 1), { color: C.ink, width: 4, head: 14, alpha: gp });
      ctag('x', P(1, 1)[0] - 18, P(1, 1)[1] - 14, { px: 24, a: gp, color: C.ink, font: F.serif });
      const g1 = A * gin(cue('C16n', '二圈乘x'));
      arrow(ctx, P(0, 0), P(2, 1), { color: C.peri, width: 5, head: 16, alpha: g1 });
      ctag('2∘x = (2, 1)', P(2, 1)[0] + 10, P(2, 1)[1] + 30, { px: 24, a: g1, color: C.peri, font: F.serif });
      const g2 = A * gin(cue('C16n', '可是一圈乘x'));
      arrow(ctx, P(0, 0), P(2, 2), { color: C.j, width: 5, head: 16, alpha: g2 });
      ctag('x + x = (2, 2)', P(2, 2)[0] - 10, P(2, 2)[1] - 22, { px: 24, a: g2, color: C.j, font: F.serif });
    }
    const gx = A * gin(cue('C16n', '所以V不是'));
    B.stamp(DX + 160, DY + 110, false, gin(cue('C16n', '所以V不是'), 0.4), gx, '不是向量空间');
    const gg = A * gin(s('G03b') + 0.2);
    B.card(DX - 60, DY + 230, 640, 80, gg * 0.95, C.gpt);
    ctag('反例 + 指明违反 (α + β)x = αx + βx', DX - 60, DY + 230, { px: 28, a: gg * (1 - gin(s('C16o'))), color: C.gpt, font: F.serif });
    ctag('先试“先加再乘”，再试 0∘x：0∘(1, 1) = (0, 1) ≠ 0', DX - 60, DY + 230, { px: 26, a: gg * gin(s('C16o')), color: C.i, font: F.serif });
  }
"""
anchor = "\n  function shotOutro() {"; assert anchor in s; s = s.replace(anchor, code + anchor, 1)
a2 = "shotInt(); shotOutro();"; assert a2 in s; s = s.replace(a2, "shotInt(); shotAx(); shotOutro();", 1)
a3 = "const a = B.win(s('C16c'), s('C17') - 0.2);"; assert a3 in s; s = s.replace(a3, "const a = B.win(s('C16c'), s('C16i') - 0.2);", 1)
a4 = "B.paper(EX, 'y2021_t5', { t0: s('C16g') + 0.1, dock: s('C16g') + 2.6, out: s('C17') - 0.3 });"; assert a4 in s
s = s.replace(a4, a4.replace("out: s('C17') - 0.3", "out: s('C16i') - 0.3") + """
    B.paper(EX, 'y1718_q5', { t0: s('C16i') + 0.2, dock: cue('C16i', 'V是全体') - 0.3, out: s('C17') - 0.3 });""", 1)
a5 = "'y2425_q7', 'y2021_t5'])"; assert a5 in s; s = s.replace(a5, "'y2425_q7', 'y2021_t5', 'y1718_q5'])", 1)
a6 = "C14: 0.4, C17: 0.8 },"; assert a6 in s; s = s.replace(a6, "C14: 0.4, C16i: 1.0, C16m: 0.4, C17: 0.8 },", 1)
a7 = "C16: 1.6, C17: 1.2 },"; assert a7 in s; s = s.replace(a7, "C16: 1.6, C16i: 1.2, C16j: 1.0, C16k: 1.2, C16l: 1.0, D03b: 0.4, C16m: 1.4, C16n: 1.6, G03b: 1.0, C16o: 1.2, C17: 1.2 },", 1)
a8 = "TL.sfx('bell_soft', s('C17'), 0.35); TL.sfx('shimmer', s('D04'), 0.35);"; assert a8 in s
s = s.replace(a8, a8 + """
  // 扩写二 sfx
  TL.sfx('whoosh', s('C16i') + 0.2, 0.3); TL.sfx('pluck', cue('C16i', '数乘被改了'), 0.3);
  [cue('C16j', '自动成立'), cue('C16k', '还是x，过'), cue('C16k', '也过'), cue('C16l', '还是过')].forEach(x => TL.sfx('check', x, 0.25));
  TL.sfx('sting', s('D03b') + 0.2, 0.25); TL.sfx('tick', cue('C16m', '左边'), 0.3); TL.sfx('tick', cue('C16m', '右边'), 0.3);
  TL.sfx('buzz', cue('C16n', '只要x二不为零'), 0.25); TL.sfx('swoosh_soft', cue('C16n', '二圈乘x'), 0.3); TL.sfx('swoosh_soft', cue('C16n', '可是一圈乘x'), 0.3);
  TL.sfx('stamp', cue('C16n', '所以V不是'), 0.35); TL.sfx('pop', s('G03b') + 0.2, 0.3); TL.sfx('pop', s('C16o'), 0.3);""", 1)
open(p,'w',encoding='utf-8').write(s); print('ok')
