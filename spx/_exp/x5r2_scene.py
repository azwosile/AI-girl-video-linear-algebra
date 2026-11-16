p='x5/scene.js'; s=open(p,encoding='utf-8').read(); assert 'shotPoly' not in s
code = r"""
  // ════ 扩写二：P₃ 多项式无关（17–18 Q3，23–24 Q6）════
  function polyShot(A, P, t) {
    const cols = [C.i, C.j, C.free];
    // 多项式 → 系数
    P.polys.forEach((pl, i) => {
      const y = DY - 290 + i * 56, g = A * gin(t.read[i]);
      ctag(pl, DX - 260, y, { px: 30, a: A * gin(t.t0 + i * 0.3), color: cols[i], font: F.serif });
      arrow(ctx, [DX - 130, y], [DX - 60, y], { color: cols[i], width: 3, head: 12, alpha: g });
      ctag('(' + P.vec[i].map(v => String(v).replace('-', '−')).join(', ') + ')', DX + 40, y, { px: 30, a: g, color: cols[i], font: F.serif });
    });
    ctag('按 1, x, x² 读系数', DX + 230, DY - 290, { px: 24, a: A * gin(t.read[0]) * (1 - gin(t.mat)), color: C.inkMid });
    // 系数矩阵（列 = 向量）
    const gm = A * gin(t.mat);
    if (gm > 0) {
      const R = [0, 1, 2].map(i => [0, 1, 2].map(j => P.vec[j][i]));
      const M = B.mat(DX - 150, DY - 20, R, { px: 38, a: gm, cell: (i, j) => ({ txt: String(R[i][j]).replace('-', '−'), col: i === 2 && j === 2 ? C.peri : cols[j], a: gin(t.mat + 0.3 + j * 0.4) }) });
      const hi = gin(t.det);
      ctx.save(); ctx.globalAlpha = gm * hi * 0.9; ctx.strokeStyle = C.peri; ctx.lineWidth = 2.5;
      const [x0, y2] = M.cell(2, 0), [x2] = M.cell(2, 2); ctx.strokeRect(x0 - 30, y2 - 24, x2 - x0 + 60, 48); ctx.restore();
      ctag('1  · |' + P.minor + '|', DX + 140, DY - 60, { px: 30, a: gm * gin(t.det + 0.4), color: C.ink, font: F.serif });
      ctag(P.calc, DX + 140, DY + 5, { px: 30, a: gm * gin(t.det + 1.2), color: C.i, font: F.serif });
    }
    const gx = A * gin(t.ans) * (1 - gin(t.fadeAns));
    B.card(DX, DY + 130, 560, 76, gx * 0.95, OK);
    ctag(P.ans, DX, DY + 130, { px: 34, a: gx, color: OK, font: F.serif });
    B.burst(DX, DY + 130, t.ans + 0.2, OK, { r1: 220 });
  }
  function shotPoly() {
    let a = B.win(s('C19a'), s('C19f') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C19a') + 0.4);
      B.qhead('2017–2018 期中 · 第 3 题 · 10 分', A);
      polyShot(A, { polys: ['x + 2', 'x + 1', 'x² − 1'], vec: [[2, 1, 0], [1, 1, 0], [-1, 0, 1]], minor: '2 1; 1 1', calc: '= 2 − 1 = 1 ≠ 0', ans: 'det = 1 ≠ 0 ⇒ 线性无关' },
        { t0: s('C19a') + 0.6, read: [cue('C19b', '读成二'), cue('C19b', '读成一'), cue('C19b', '读成负一')], mat: s('C19c'), det: s('C19d'), ans: cue('C19d', '所以线性无关'), fadeAns: s('D04a') });
      const ge = A * gin(s('C19e'));
      ctag('c₁p₁ + c₂p₂ + c₃p₃ = 0   ⇔   M c = 0', DX, DY + 130, { px: 32, a: ge * (1 - gin(s('G02b'))), color: C.j, font: F.serif });
      const gg = A * gin(s('G02b'));
      [['x²：c₃ = 0', s('G02b') + 0.3], ['x：c₁ + c₂ = 0', cue('G02b', 'x项')], ['1：2c₁ + c₂ − c₃ = 0', cue('G02b', '常数项')]].forEach(([tx, t0], i) =>
        ctag(tx, DX - 40, DY + 110 + i * 52, { px: 28, a: gg * gin(t0), color: C.gpt, font: F.serif }));
      const gz = A * gin(cue('G02b', '解出来'));
      ctag('⇒ c = 0 ✓', DX + 240, DY + 162, { px: 30, a: gz, color: OK, font: F.serif });
    }
    a = B.win(s('C19f'), s('C20') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C19f') + 0.4);
      B.qhead('2023–2024 期中 · 第 6 题 · 10 分', A);
      polyShot(A, { polys: ['x + 2', 'x − 4', 'x² − 2x + 3'], vec: [[2, 1, 0], [-4, 1, 0], [3, -2, 1]], minor: '2 −4; 1 1', calc: '= 2 + 4 = 6 ≠ 0', ans: 'det = 6 ≠ 0 ⇒ 线性无关' },
        { t0: s('C19f') + 0.6, read: [cue('C19f', '读系数'), cue('C19f', '负四'), cue('C19f', '三、负二')], mat: cue('C19f', '三、负二') + 1.0, det: s('C19g'), ans: cue('C19g', '线性无关'), fadeAns: 1e9 });
      const gp = A * gin(s('C19h'));
      B.card(DX, DY + 250, 700, 100, gp * 0.95, C.free);
      ctag('Leon：P₃ = 次数 < 3 的多项式', DX, DY + 228, { px: 30, a: gp, color: C.free, font: F.serif });
      ctag('基 {1, x, x²}，dim P₃ = 3（不是 4！）', DX, DY + 272, { px: 28, a: gp * gin(cue('C19h', '维数是三')), color: C.ink, font: F.serif });
    }
  }
"""
anchor = "\n  function shotOutro() {"; assert anchor in s; s = s.replace(anchor, code + anchor, 1)
a2 = "shotQ2021(); shotOutro();"; assert a2 in s; s = s.replace(a2, "shotQ2021(); shotPoly(); shotOutro();", 1)
a3 = "const a = B.win(s('C16'), s('C20') - 0.2);"; assert a3 in s; s = s.replace(a3, "const a = B.win(s('C16'), s('C19a') - 0.2);", 1)
a4 = "B.paper(EX, 'y2021_q6', { t0: s('C16') + 0.2, dock: cue('C16', '三个四维向量') - 0.6, out: s('C20') - 0.3 });"; assert a4 in s
s = s.replace(a4, a4.replace("out: s('C20') - 0.3", "out: s('C19a') - 0.3") + """
    B.paper(EX, 'y1718_q3', { t0: s('C19a') + 0.2, dock: cue('C19a', 'x加二') - 0.3, out: s('C19f') - 0.3 });
    B.paper(EX, 'y2324_q6', { t0: s('C19f') + 0.2, dock: cue('C19f', 'x加二') - 0.3, out: s('C20') - 0.3 });""", 1)
a5 = "'y1819_q9', 'y2021_q6'])"; assert a5 in s; s = s.replace(a5, "'y1819_q9', 'y2021_q6', 'y1718_q3', 'y2324_q6'])", 1)
a6 = "C16: 1.0, C20: 0.8 },"; assert a6 in s; s = s.replace(a6, "C16: 1.0, C19a: 1.0, C19f: 1.0, C19h: 0.4, C20: 0.8 },", 1)
a7 = "C19: 1.0, C20: 1.2 },"; assert a7 in s; s = s.replace(a7, "C19: 1.0, C19a: 0.8, C19b: 1.2, C19c: 0.8, C19d: 1.4, D04a: 0.4, C19e: 1.2, G02b: 1.2, C19f: 1.0, C19g: 1.4, C19h: 1.2, D04b: 0.6, C20: 1.2 },", 1)
a8 = "TL.sfx('bell_soft', s('C20'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);"; assert a8 in s
s = s.replace(a8, a8 + """
  // 扩写二 sfx
  TL.sfx('whoosh', s('C19a') + 0.2, 0.3); ['读成二', '读成一', '读成负一'].forEach(p => TL.sfx('pop', cue('C19b', p), 0.3));
  TL.sfx('swoosh_soft', s('C19c'), 0.3); TL.sfx('tick', s('C19d') + 0.4, 0.3); TL.sfx('impact', cue('C19d', '所以线性无关') + 0.2, 0.3);
  ['x项', '常数项'].forEach(p => TL.sfx('tick', cue('G02b', p), 0.3)); TL.sfx('check', cue('G02b', '解出来'), 0.3);
  TL.sfx('whoosh', s('C19f') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C19f', '三、负二') + 1.0, 0.3); TL.sfx('impact', cue('C19g', '线性无关') + 0.2, 0.3);
  TL.sfx('buzz', s('C19h') + 0.2, 0.25); TL.sfx('shimmer', s('D04b'), 0.3);""", 1)
open(p,'w',encoding='utf-8').write(s); print('ok')
