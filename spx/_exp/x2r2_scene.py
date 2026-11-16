p='x2/scene.js'; s=open(p,encoding='utf-8').read(); assert 'shotR2' not in s
code = r"""
  // ════ 扩写二：24–25 Q5（LU + AX=B + rank）；24–25 Q3（置换阵）════
  const ng = v => String(v).replace(/-/g, '−');
  function stepMat(A, S, T, ops, x, y, { px = 36, bar = null, lx = null } = {}) {
    let k = 0; for (let q = 1; q < S.length; q++) if (B.t >= T[q]) k = q;
    const prev = k ? S[k - 1] : S[0], fresh = k ? gin(T[k], 0.5) : 1;
    const M = B.mat(x, y, S[k], { px, a: A, bar, cell: (i, j) => {
      const ch = S[k][i][j] !== prev[i][j];
      return { txt: ng(S[k][i][j]), col: ch && fresh < 1 ? C.j : C.ink, a: ch ? 0.3 + 0.7 * fresh : 1 };
    } });
    if (k > 0 && ops[k]) ops[k].forEach(([i, txt]) => ctag(txt, lx ?? x - M.w / 2 - 80, M.cell(i, 0)[1], { px: 24, a: A * gin(T[k] - 0.4) * (1 - gin(T[k] + 4.0)), color: C.j, font: F.serif }));
    return M;
  }
  function shotR2() {
    let a = B.win(s('C30c'), s('C30l') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C30c') + 0.4);
      B.qhead('2024–2025 期中 · 第 5 题 · 15 分', A);
      // (a) LU
      const ga = A * (1 - gin(s('D06a') - 0.2));
      if (ga > 0) {
        const S = [[[2, 1, 1], [6, 4, 5], [4, 1, 3]], [[2, 1, 1], [0, 1, 2], [0, -1, 1]], [[2, 1, 1], [0, 1, 2], [0, 0, 3]]];
        const T = [-1, cue('C30d', '第二行减三倍') + 0.5, s('C30e') + 1.5];
        stepMat(ga, S, T, [null, [[1, 'R₂ − 3R₁'], [2, 'R₃ − 2R₁']], [[2, 'R₃ + R₂']]], DX - 150, DY - 170, { px: 40 });
        const mul = [['3 = 6 ÷ 2', cue('C30d', '六除以二')], ['2 = 4 ÷ 2', cue('C30d', '四除以二')], ['−1 = −1 ÷ 1', s('C30e') + 0.3]];
        mul.forEach(([t, t0], i) => ctag(t, DX + 250, DY - 260 + i * 60, { px: 28, a: ga * gin(t0) * (1 - gin(s('C30f'))), color: C.i, font: F.serif }));
        const gf = ga * gin(s('C30f'));
        if (gf > 0) {
          ctag('L =', DX + 120, DY + 40, { px: 32, a: gf, color: C.i, font: F.serif });
          const LM = [['1', '0', '0'], ['3', '1', '0'], ['2', '−1', '1']];
          const ML = B.mat(DX + 250, DY + 40, LM, { px: 34, a: gf, cell: (i, j) => ({ txt: LM[i][j], col: i > j ? C.i : C.ink, a: i > j ? gin(s('C30f') + 0.4 + (i + j) * 0.4) : 1 }) });
          const [cx, cy] = ML.cell(2, 1);
          ctx.save(); ctx.globalAlpha = gf * gin(cue('C30f', '注意那个负一')); ctx.strokeStyle = C.free; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          ctag('U = 消元结果 ↑', DX - 150, DY + 40, { px: 28, a: gf, color: C.ink });
        }
      }
      // (b) [A|B]
      const gb = A * gin(s('D06a')) * (1 - gin(s('C30k') - 0.2));
      if (gb > 0) {
        ctx.save(); ctx.globalAlpha = gb * (1 - gin(s('C30g'))); ctx.restore();
        B.xcard('先求 A⁻¹ ?', DX + 230, DY - 300, 260, 64, gb * (1 - gin(s('C30g') + 1)), C.ds, 28);
        const S = [
          [[2, 1, 1, 3, 0, -1], [6, 4, 5, 0, 1, 0], [4, 1, 3, 0, 0, 0]],
          [[2, 1, 1, 3, 0, -1], [0, 1, 2, -9, 1, 3], [4, 1, 3, 0, 0, 0]],
          [[2, 1, 1, 3, 0, -1], [0, 1, 2, -9, 1, 3], [0, -1, 1, -6, 0, 2]],
          [[2, 1, 1, 3, 0, -1], [0, 1, 2, -9, 1, 3], [0, 0, 3, -15, 1, 5]],
        ];
        const T = [-1, cue('C30g', '第二行') + 0.6, s('C30h') + 0.5, cue('C30h', '再加上') + 0.5];
        const M = stepMat(gb * gin(s('C30g')), S, T, [null, [[1, 'R₂ − 3R₁']], [[2, 'R₃ − 2R₁']], [[2, 'R₃ + R₂']]], DX - 20, DY - 190, { px: 34, bar: 3 });
        ctag('A', DX - 20 - M.w / 4, DY - 190 - M.h / 2 - 30, { px: 26, a: gb * gin(s('C30g')), color: C.peri });
        ctag('B 跟着变', DX - 20 + M.w / 4, DY - 190 - M.h / 2 - 30, { px: 26, a: gb * gin(s('C30g')), color: C.j });
        const gx = gb * gin(s('C30i'));
        if (gx > 0) {
          const XR = [['7/2', '−1/3', '−7/6'], ['1', '1/3', '−1/3'], ['−5', '1/3', '5/3']];
          const T2 = [cue('C30j', '第一行减去'), cue('C30j', '第二行减') , cue('C30i', '第三行除以三')];
          ctag('X =', DX - 260, DY + 90, { px: 32, a: gx, color: C.i, font: F.serif });
          B.mat(DX - 20, DY + 90, XR, { px: 32, a: gx, cell: (i, j) => ({ txt: XR[i][j], col: B.t < T2[i] + 1.2 ? C.j : C.ink, a: gin(T2[i] + 0.3) }) });
          ctag('↑ 从下往上回代', DX + 250, DY + 90, { px: 26, a: gx * (1 - gin(s('G03b'))), color: C.peri });
          const gc = gb * gin(s('G03b') + 0.3);
          ctag('2·7/2 + 1·1 + 1·(−5) = 3  ✓', DX, DY + 250, { px: 30, a: gc, color: C.gpt, font: F.serif });
          B.burst(DX, DY + 250, cue('G03b', '正是B'), C.gpt, { r1: 220 });
        }
      }
      // (c)
      const gc = A * gin(s('C30k'));
      if (gc > 0) {
        const BM = [['3', '0', '−1'], ['0', '1', '0'], ['0', '0', '0']];
        ctag('B =', DX - 230, DY - 170, { px: 32, a: gc, color: C.ink, font: F.serif });
        const M = B.mat(DX - 60, DY - 170, BM, { px: 38, a: gc, cell: (i, j) => ({ txt: BM[i][j], col: (i === 0 && j === 0) || (i === 1 && j === 1) ? C.i : (i === 2 ? C.free : C.ink) }) });
        const gr = gc * gin(cue('C30k', '有两个非零行'));
        B.card(DX + 240, DY - 170, 260, 70, gr * 0.95, OK); ctag('rank B = 2', DX + 240, DY - 170, { px: 32, a: gr, color: OK, font: F.serif });
        const gs = gc * gin(cue('C30k', '列空间取'));
        ctag('C(B) = span{(3,0,0)ᵀ, (0,1,0)ᵀ}', DX, DY + 10, { px: 32, a: gs, color: C.ink, font: F.serif });
        const gp = gc * gin(cue('C30k', '也就是'));
        B.card(DX, DY + 110, 560, 76, gp * 0.95, OK);
        ctag('= { (x, y, 0)ᵀ }：xy 平面', DX, DY + 110, { px: 32, a: gp, color: OK, font: F.serif });
        B.burst(DX, DY + 110, cue('C30k', '一整个平面'), OK, { r1: 220 });
      }
    }
    // ── 24–25 Q3 ──
    a = B.win(s('C30l'), s('C31') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C30l') + 0.4);
      B.qhead('2024–2025 期中 · 第 3 题 · 10 分', A);
      const P = [[0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 1, 0]];
      const I5 = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]];
      const T = [-1, cue('C30m', '第一、三行') + 0.4, cue('C30m', '第四、五行') + 0.4];
      const S = [I5, [[0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]], P];
      const gm = A * gin(s('C30m'));
      ctag('A =', DX - 280, DY - 150, { px: 32, a: A, color: C.ink, font: F.serif });
      if (B.t < s('C30m')) B.mat(DX - 80, DY - 150, P, { px: 34, a: A, cell: (i, j) => ({ txt: String(P[i][j]), col: P[i][j] ? C.i : C.ink, a: P[i][j] ? 1 : 0.45 }) });
      else stepMat(gm, S, T, [null, [[0, 'R₁ ↔ R₃']], [[3, 'R₄ ↔ R₅']]], DX - 80, DY - 150, { px: 34, lx: DX + 170 });
      const gd = A * gin(cue('C30m', '所以行列式'));
      B.card(DX, DY + 60, 600, 76, gd * 0.95, OK);
      ctag('det A = (−1)(−1) = 1 ≠ 0', DX, DY + 60, { px: 34, a: gd, color: OK, font: F.serif });
      B.stamp(DX + 300, DY + 150, true, gin(cue('C30m', '非奇异'), 0.4), gd * gin(cue('C30m', '非奇异')), '非奇异');
      const gi = A * gin(cue('C30n', 'A乘A'));
      ctag('A · A = I', DX - 120, DY + 170, { px: 34, a: gi, color: C.ink, font: F.serif });
      const gx = A * gin(cue('C30n', '所以A的逆'));
      B.card(DX, DY + 260, 420, 80, gx * 0.95, OK);
      ctag('A⁻¹ = A', DX, DY + 260, { px: 40, a: gx, color: OK, font: F.serif });
      B.burst(DX, DY + 260, cue('C30n', '所以A的逆') + 0.2, OK, { r1: 200 });
    }
  }
"""
anchor = "\n  // ════ 套路卡 ════"; assert anchor in s; s = s.replace(anchor, code + anchor, 1)
a2 = "shotQ3(); shotOutro();"; assert a2 in s; s = s.replace(a2, "shotQ3(); shotR2(); shotOutro();", 1)
a3 = "const a = B.win(s('C24'), s('C31') - 0.2);"; assert a3 in s; s = s.replace(a3, "const a = B.win(s('C24'), s('C30c') - 0.2);", 1)
a4 = "B.paper(EX, 'y2021_q2', { t0: s('C24') + 0.2, dock: cue('C24', '求AX') - 0.6, out: s('C31') - 0.3 });"; assert a4 in s
s = s.replace(a4, a4.replace("out: s('C31') - 0.3", "out: s('C30c') - 0.3") + """
    B.paper(EX, 'y2425_q5', { t0: s('C30c') + 0.2, dock: cue('C30c', '第一问') - 0.3, out: s('C30l') - 0.3 });
    B.paper(EX, 'y2425_q3', { t0: s('C30l') + 0.2, dock: cue('C30l', '一个五阶') - 0.3, out: s('C31') - 0.3 });""", 1)
a5 = "'y2324_q5', 'y2021_q2'])"; assert a5 in s; s = s.replace(a5, "'y2324_q5', 'y2021_q2', 'y2425_q5', 'y2425_q3'])", 1)
a6 = "C28: 0.6, C31: 0.8 },"; assert a6 in s; s = s.replace(a6, "C28: 0.6, C30c: 1.0, D06a: 0.4, C30k: 0.6, C30l: 1.0, C31: 0.8 },", 1)
a7 = "C30: 1.0, C32: 1.0 },"; assert a7 in s; s = s.replace(a7, "C30: 1.0, C30c: 1.0, C30d: 1.2, C30e: 1.0, C30f: 1.4, D06a: 0.4, C30g: 1.2, C30h: 1.2, C30i: 1.0, C30j: 1.2, G03b: 1.0, C30k: 1.4, C30m: 1.2, C30n: 1.2, D06b: 0.6, C32: 1.0 },", 1)
a8 = "TL.sfx('bell_soft', s('C31'), 0.35); TL.sfx('shimmer', s('D07'), 0.35);"; assert a8 in s
s = s.replace(a8, a8 + """
  // 扩写二 sfx
  TL.sfx('whoosh', s('C30c') + 0.2, 0.3); TL.sfx('pop', cue('C30d', '第二行减三倍') + 0.5, 0.3); TL.sfx('pop', s('C30e') + 1.5, 0.3);
  TL.sfx('pluck', s('C30f') + 0.4, 0.3); TL.sfx('buzz', cue('C30f', '注意那个负一'), 0.2); TL.sfx('sting', s('D06a') + 0.2, 0.25);
  [cue('C30g', '第二行') + 0.6, s('C30h') + 0.5, cue('C30h', '再加上') + 0.5].forEach(x => TL.sfx('pop', x, 0.3));
  [cue('C30i', '第三行除以三'), cue('C30j', '第二行减'), cue('C30j', '第一行减去')].forEach(x => TL.sfx('tick', x + 0.3, 0.3));
  TL.sfx('check', cue('G03b', '正是B'), 0.3); TL.sfx('ding_hi', cue('C30k', '有两个非零行'), 0.3); TL.sfx('impact', cue('C30k', '一整个平面'), 0.3);
  TL.sfx('whoosh', s('C30l') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C30m', '第一、三行') + 0.4, 0.3); TL.sfx('swoosh_soft', cue('C30m', '第四、五行') + 0.4, 0.3);
  TL.sfx('stamp', cue('C30m', '非奇异'), 0.35); TL.sfx('impact', cue('C30n', '所以A的逆') + 0.2, 0.35); TL.sfx('shimmer', s('D06b'), 0.3);""", 1)
open(p,'w',encoding='utf-8').write(s); print('ok')
