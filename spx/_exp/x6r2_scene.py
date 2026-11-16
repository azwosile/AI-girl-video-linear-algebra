p='x6/scene.js'; s=open(p,encoding='utf-8').read(); assert 'shotR2' not in s
code = r"""
  // ════ 扩写二：17–18 Q7；20–21 Q5；15–16 Q3（倒着问）════
  const ng = v => String(v).replace('-', '−');
  function elim(A, S, T, ops, MY, { bar = 3, fin = null, lab = '[U | V]' } = {}) {
    let k = 0; for (let q = 1; q < S.length; q++) if (B.t >= T[q]) k = q;
    const prev = k ? S[k - 1] : S[0], fresh = k ? gin(T[k], 0.5) : 1, gf = fin ? gin(fin) : 0;
    const M = B.mat(DX + 30, MY, S[k], { px: 36, a: A, bar, cell: (i, j) => {
      const ch = S[k][i][j] !== prev[i][j];
      return { txt: ng(S[k][i][j]), col: ch && fresh < 1 ? C.j : (j >= bar && gf > 0 ? OK : (j < bar ? C.ink : C.i)), a: ch ? 0.3 + 0.7 * fresh : 1 };
    } });
    ctag(lab, DX + 30, MY - M.h / 2 - 28, { px: 26, a: A, color: C.peri, font: F.serif });
    if (k > 0 && ops[k]) ops[k].forEach(([i, txt]) => ctag(txt, DX + 30 - M.w / 2 - 90, M.cell(i, 0)[1], { px: 25, a: A * gin(T[k] - 0.4) * (1 - gin(T[k] + 4.0)), color: C.j, font: F.serif }));
    return M;
  }
  function shotR2() {
    // ── 17–18 Q7 ──
    let a = B.win(s('C16g'), s('C16m') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C16g') + 0.4);
      B.qhead('2017–2018 期中 · 第 7 题 · 15 分', A);
      const g0 = A * (1 - gin(s('C16h')));
      ctag('v₁ = (4, 6, 7)　v₂ = (0, 1, 1)　v₃ = (0, 1, 2)', DX, DY - 160, { px: 30, a: g0, color: C.i, font: F.serif });
      ctag('u₁ = (1, 1, 1)　u₂ = (1, 2, 2)　u₃ = (2, 3, 4)', DX, DY - 100, { px: 30, a: g0, color: C.j, font: F.serif });
      ctag('x = 2v₁ + 3v₂ − 4v₃', DX, DY - 30, { px: 32, a: g0 * gin(cue('C16g', '再求x')), color: C.ink, font: F.serif });
      const Ab = A * gin(s('C16h') + 0.2);
      if (Ab > 0) {
        const S = [
          [[1, 1, 2, 4, 0, 0], [1, 2, 3, 6, 1, 1], [1, 2, 4, 7, 1, 2]],
          [[1, 1, 2, 4, 0, 0], [1, 2, 3, 6, 1, 1], [0, 0, 1, 1, 0, 1]],
          [[1, 1, 2, 4, 0, 0], [0, 1, 1, 2, 1, 1], [0, 0, 1, 1, 0, 1]],
          [[1, 1, 2, 4, 0, 0], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1]],
          [[1, 0, 0, 1, -1, -2], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1]],
        ];
        const T = [-1, cue('C16i', '左边得到零、零') , cue('C16i', '第二行减第一行') + 0.8, cue('C16j', '第二行减第三行') + 0.8, cue('C16j', '最后') + 1.6];
        const ops = [null, [[2, 'R₃ − R₂']], [[1, 'R₂ − R₁']], [[1, 'R₂ − R₃']], [[0, 'R₁ − R₂ − 2R₃']]];
        const M = elim(Ab, S, T, ops, DY - 200, { fin: s('C16k') });
        ctag('左：u 的列　|　右：v 的列', DX + 30, DY - 200 + M.h / 2 + 32, { px: 24, a: Ab * B.win(s('C16h') + 0.5, s('C16i')), color: C.ink });
        if (B.t > s('C16k')) {
          const g = Ab * gin(s('C16k') + 0.3), [x0, y0] = M.cell(0, 3), [x2] = M.cell(0, 5);
          ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = OK; ctx.lineWidth = 3; ctx.strokeRect(x0 - 30, y0 - 28, x2 - x0 + 60, M.h - 8); ctx.restore();
          ctag('= S', x2 + 80, DY - 200, { px: 34, a: g, color: OK, font: F.serif });
          B.burst(x2 + 80, DY - 200, s('C16k') + 0.4, OK, { r1: 120, n: 12 });
        }
        const gl = Ab * gin(s('C16l'));
        ctag('S · (2, 3, −4)', DX, DY - 10, { px: 30, a: gl, color: C.ink, font: F.serif });
        ['2 − 3 + 8 = 7', '2 + 3 = 5', '2 − 4 = −2'].forEach((t, q) => ctag(t, DX - 260 + q * 260, DY + 50, { px: 28, a: Ab * gin(cue('C16l', ['二减三加八', '二加三', '二减四'][q])), color: C.i, font: F.serif }));
        const gx = Ab * gin(cue('C16l', '所以u坐标'));
        B.card(DX, DY + 130, 520, 74, gx * 0.95, OK);
        ctag('[x]ᵤ = (7, 5, −2)', DX, DY + 130, { px: 34, a: gx, color: OK, font: F.serif });
        B.burst(DX, DY + 130, cue('C16l', '所以u坐标') + 0.3, OK, { r1: 200 });
        ctag('7u₁ + 5u₂ − 2u₃ = (8, 11, 9) = 2v₁ + 3v₂ − 4v₃', DX, DY + 215, { px: 27, a: Ab * B.win(s('G03b') + 0.3, s('C16m')), color: C.gpt, font: F.serif });
        B.stamp(DX + 300, DY + 40, true, gin(e('G03b') - 0.8, 0.4), Ab * gin(e('G03b') - 0.8), '✓ 15 分');
      }
    }
    // ── 20–21 Q5 ──
    a = B.win(s('C16m'), s('C16q') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C16m') + 0.4);
      B.qhead('2020–2021 期中 · 第 5 题 · 15 分', A);
      const g1 = A * (1 - gin(s('C16o')));
      const MV = B.mat(DX - 200, DY - 150, [[1, 1, 0], [0, 1, 1], [1, 0, 1]], { px: 34, a: g1, cell: () => ({ col: C.i }) });
      const MU = B.mat(DX + 220, DY - 150, [[2, 1, 2], [3, 2, 0], [1, 0, 3]], { px: 34, a: g1, cell: () => ({ col: C.j }) });
      ctag('V =', DX - 200 - MV.w / 2 - 50, DY - 150, { px: 30, a: g1, color: C.i, font: F.serif });
      ctag('U =', DX + 220 - MU.w / 2 - 50, DY - 150, { px: 30, a: g1, color: C.j, font: F.serif });
      ctag('det V = 2', DX - 200, DY - 40, { px: 32, a: g1 * gin(cue('C16n', 'V的行列式')), color: C.i, font: F.serif });
      ctag('det U = −1', DX + 220, DY - 40, { px: 32, a: g1 * gin(cue('C16n', 'U的行列式')), color: C.j, font: F.serif });
      B.xcard('都 ≠ 0 → 各自三个向量无关 → 都是 R³ 的基', DX, DY + 60, 760, 70, g1 * gin(cue('C16n', '都不为零')), OK, 29);
      const Ab = A * gin(s('C16o') + 0.2);
      if (Ab > 0) {
        const S = [
          [[2, 1, 2, 1, 1, 0], [3, 2, 0, 0, 1, 1], [1, 0, 3, 1, 0, 1]],
          [[1, 0, 3, 1, 0, 1], [3, 2, 0, 0, 1, 1], [2, 1, 2, 1, 1, 0]],
          [[1, 0, 3, 1, 0, 1], [0, 2, -9, -3, 1, -2], [0, 1, -4, -1, 1, -2]],
          [[1, 0, 3, 1, 0, 1], [0, 1, -4, -1, 1, -2], [0, 2, -9, -3, 1, -2]],
          [[1, 0, 3, 1, 0, 1], [0, 1, -4, -1, 1, -2], [0, 0, 1, 1, 1, -2]],
          [[1, 0, 0, -2, -3, 7], [0, 1, 0, 3, 5, -10], [0, 0, 1, 1, 1, -2]],
        ];
        const T = [-1, cue('C16o', '换到最上面') + 0.5, cue('C16p', '第三行减两倍第一行') + 0.5, cue('C16p', '交换第二') + 0.6, cue('C16p', '再乘负一') + 0.4, cue('C16p', '往上回代') + 0.6];
        const ops = [null, [[0, 'R₁ ↔ R₃']], [[1, 'R₂ − 3R₁'], [2, 'R₃ − 2R₁']], [[1, 'R₂ ↔ R₃']], [[2, '(R₃ − 2R₂)·(−1)']], [[1, 'R₂ + 4R₃'], [0, 'R₁ − 3R₃']]];
        const M = elim(Ab, S, T, ops, DY - 190, { fin: cue('C16p', '右边得到S') });
        if (B.t > cue('C16p', '右边得到S')) {
          const g = Ab * gin(cue('C16p', '右边得到S')), [x0, y0] = M.cell(0, 3), [x2] = M.cell(0, 5);
          ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = OK; ctx.lineWidth = 3; ctx.strokeRect(x0 - 30, y0 - 28, x2 - x0 + 60, M.h - 8); ctx.restore();
          ctag('= S', x2 + 80, DY - 190, { px: 34, a: g, color: OK, font: F.serif });
          B.burst(x2 + 80, DY - 190, cue('C16p', '右边得到S') + 0.3, OK, { r1: 120, n: 12 });
        }
        ctag('不用分数：先找开头是 1 的行', DX, DY + 10, { px: 28, a: Ab * B.win(cue('C16o', '换到最上面'), e('C16o') + 0.3), color: C.free });
        const gc = Ab * gin(s('G03c') + 0.3);
        ctag('−2u₁ + 3u₂ + u₃', DX - 150, DY + 60, { px: 30, a: gc, color: C.gpt, font: F.serif });
        ctag('= (−4 + 3 + 2, −6 + 6 + 0, −2 + 0 + 3) = (1, 0, 1) = v₁', DX, DY + 120, { px: 27, a: Ab * gin(cue('G03c', '算出来')), color: C.gpt, font: F.serif });
        B.stamp(DX + 300, DY + 210, true, gin(cue('G03c', '对') + 0.2, 0.4), Ab * gin(cue('G03c', '正好是v一')), '✓ 15 分');
      }
    }
    // ── 15–16 Q3：倒着问 ──
    a = B.win(s('C16q'), s('C17') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C16q') + 0.4);
      B.qhead('2015–2016 · 第 3 题 · 倒着问', A);
      ctag('v₁ = (2, 6)　v₂ = (1, 4)', DX - 120, DY - 200, { px: 32, a: A, color: C.i, font: F.serif });
      const MS = B.mat(DX + 280, DY - 200, [[4, 1], [2, 1]], { px: 38, a: A, cell: (i, j) => ({ col: j ? C.j : C.k }) });
      ctag('S =', DX + 280 - MS.w / 2 - 50, DY - 200, { px: 32, a: A, color: C.ink, font: F.serif });
      const gr = A * gin(s('C16r'));
      ctag('S 的第 k 列 = v_k 在 u 下的坐标', DX, DY - 100, { px: 30, a: gr, color: C.peri });
      if (B.t > cue('C16r', '第一列四')) {
        const [x, y] = MS.cell(0, 0); ctx.save(); ctx.globalAlpha = A * gin(cue('C16r', '第一列四')); ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.strokeRect(x - 24, y - 26, 48, MS.h - 8); ctx.restore();
      }
      if (B.t > cue('C16r', '第二列一')) {
        const [x, y] = MS.cell(0, 1); ctx.save(); ctx.globalAlpha = A * gin(cue('C16r', '第二列一')); ctx.strokeStyle = C.j; ctx.lineWidth = 3; ctx.strokeRect(x - 24, y - 26, 48, MS.h - 8); ctx.restore();
      }
      ctag('v₁ = 4u₁ + 2u₂', DX - 200, DY - 30, { px: 34, a: A * gin(cue('C16r', '第一列四') + 0.5), color: C.k, font: F.serif });
      ctag('v₂ = u₁ + u₂', DX + 200, DY - 30, { px: 34, a: A * gin(cue('C16r', '第二列一') + 0.5), color: C.j, font: F.serif });
      ctag('u₂ = v₂ − u₁　⇒　v₁ = 2u₁ + 2v₂', DX, DY + 40, { px: 30, a: A * gin(s('C16s') + 0.4), color: C.ink, font: F.serif });
      ctag('u₁ = (v₁ − 2v₂) / 2 = ((2 − 2)/2, (6 − 8)/2)', DX, DY + 100, { px: 28, a: A * gin(cue('C16s', '所以u一')), color: C.ink, font: F.serif });
      const gx = A * gin(cue('C16s', '得零、负一'));
      B.card(DX, DY + 180, 600, 76, gx * 0.95, OK);
      ctag('u₁ = (0, −1)　u₂ = (1, 5)', DX, DY + 180, { px: 34, a: gx, color: OK, font: F.serif });
      B.burst(DX, DY + 180, cue('C16s', '得一、五'), OK, { r1: 200 });
      ctag('4(0, −1) + 2(1, 5) = (2, 6) ✓　(0, −1) + (1, 5) = (1, 4) ✓', DX, DY + 260, { px: 26, a: A * gin(s('G03d') + 0.3), color: C.gpt, font: F.serif });
    }
  }
"""
anchor = "\n  function shotOutro() {"; assert anchor in s; s = s.replace(anchor, code + anchor, 1)
a2 = "shotP3(); shotOutro();"; assert a2 in s; s = s.replace(a2, "shotP3(); shotR2(); shotOutro();", 1)
a3 = "const a = B.win(s('C16a'), s('C17') - 0.2);"; assert a3 in s; s = s.replace(a3, "const a = B.win(s('C16a'), s('C16g') - 0.2);", 1)
a4 = "B.paper(EX, 'y2425_q6', { t0: s('C16a') + 0.2, dock: s('C16b') - 0.5, out: s('C17') - 0.3 });"; assert a4 in s
s = s.replace(a4, a4.replace("out: s('C17') - 0.3", "out: s('C16g') - 0.3") + """
    B.paper(EX, 'y1718_q7', { t0: s('C16g') + 0.2, dock: cue('C16g', '给了v一') , out: s('C16m') - 0.3 });
    B.paper(EX, 'y2021_q5', { t0: s('C16m') + 0.2, dock: cue('C16m', '给了两组') , out: s('C16q') - 0.3 });
    B.paper(EX, 'y1516_q3', { t0: s('C16q') + 0.2, dock: cue('C16q', '已知v一') , out: s('C17') - 0.3 });""", 1)
a5 = "loadExam(['y2526_q5', 'y2425_q6'])"; assert a5 in s; s = s.replace(a5, "loadExam(['y2526_q5', 'y2425_q6', 'y1718_q7', 'y2021_q5', 'y1516_q3'])", 1)
# pre/post
a6 = "C13: 0.6, C17: 0.8 },"; assert a6 in s; s = s.replace(a6, "C13: 0.6, C16g: 1.0, C16m: 1.0, C16o: 0.4, C16q: 1.0, C17: 0.8 },", 1)
a7 = "C16: 1.0, C17: 1.2 },"; assert a7 in s; s = s.replace(a7, "C16: 1.0, C16g: 1.2, C16h: 0.8, C16i: 1.0, C16j: 1.2, C16k: 1.2, C16l: 1.2, G03b: 1.0, C16n: 1.2, C16o: 0.8, C16p: 1.6, G03c: 1.0, C16r: 1.0, C16s: 1.4, G03d: 1.2, C17: 1.2 },", 1)
a8 = "TL.sfx('bell_soft', s('C17'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);"; assert a8 in s
s = s.replace(a8, a8 + """
  // 扩写二 sfx
  TL.sfx('whoosh', s('C16g') + 0.2, 0.3); TL.sfx('swoosh_soft', s('C16h') + 0.3, 0.3);
  TL.sfx('pop', cue('C16i', '左边得到零、零'), 0.3); TL.sfx('pop', cue('C16i', '第二行减第一行') + 0.8, 0.3); TL.sfx('pop', cue('C16j', '第二行减第三行') + 0.8, 0.3); TL.sfx('zap', cue('C16j', '最后') + 1.6, 0.3);
  TL.sfx('impact', s('C16k') + 0.4, 0.3); ['二减三加八', '二加三', '二减四'].forEach(p => TL.sfx('tick', cue('C16l', p), 0.3)); TL.sfx('ding_hi', cue('C16l', '所以u坐标') + 0.2, 0.35); TL.sfx('stamp', e('G03b') - 0.8, 0.35); TL.sfx('shimmer', s('D04a'), 0.3);
  TL.sfx('whoosh', s('C16m') + 0.2, 0.3); TL.sfx('ding_hi', cue('C16n', 'V的行列式'), 0.3); TL.sfx('ding_hi', cue('C16n', 'U的行列式'), 0.3); TL.sfx('pluck', cue('C16n', '都不为零'), 0.3);
  TL.sfx('swoosh_soft', cue('C16o', '换到最上面') + 0.5, 0.3); ['第三行减两倍第一行', '交换第二', '再乘负一', '往上回代'].forEach((p, i) => TL.sfx('pop', cue('C16p', p) + [0.5, 0.6, 0.4, 0.6][i], 0.3));
  TL.sfx('impact', cue('C16p', '右边得到S') + 0.3, 0.3); TL.sfx('check', cue('G03c', '正好是v一'), 0.3); TL.sfx('stamp', cue('G03c', '对') + 0.2, 0.35);
  TL.sfx('whoosh', s('C16q') + 0.2, 0.3); TL.sfx('buzz', s('D04b') + 0.3, 0.18); TL.sfx('laser', cue('C16r', '第一列四'), 0.25); TL.sfx('laser', cue('C16r', '第二列一'), 0.25);
  TL.sfx('ding_hi', cue('C16s', '得零、负一'), 0.3); TL.sfx('impact', cue('C16s', '得一、五'), 0.3); TL.sfx('check', s('G03d') + 1.0, 0.3);""", 1)
open(p,'w',encoding='utf-8').write(s); print('ok')
