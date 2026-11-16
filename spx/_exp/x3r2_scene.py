p='x3/scene.js'; s=open(p,encoding='utf-8').read(); assert 'shotR2' not in s
code = r"""
  // ════ 扩写二：17–18 Q4（消元 + 行列式没有加法）；23–24 Q7 ════
  const ng = v => String(v).replace('-', '−');
  function stepMat(A, S, T, ops, x, y, { px = 36, diag = 0 } = {}) {
    let k = 0; for (let q = 1; q < S.length; q++) if (B.t >= T[q]) k = q;
    const prev = k ? S[k - 1] : S[0], fresh = k ? gin(T[k], 0.5) : 1;
    const M = B.mat(x, y, S[k], { px, a: A, cell: (i, j) => {
      const ch = S[k][i][j] !== prev[i][j];
      return { txt: ng(S[k][i][j]), col: ch && fresh < 1 ? C.j : (diag > 0 && i === j ? C.i : C.ink), a: ch ? 0.3 + 0.7 * fresh : 1 };
    } });
    if (k > 0 && ops[k]) ops[k].forEach(([i, txt]) => ctag(txt, x - M.w / 2 - 80, M.cell(i, 0)[1], { px: 24, a: A * gin(T[k] - 0.4) * (1 - gin(T[k] + 4.0)), color: C.j, font: F.serif }));
    if (diag > 0) for (let i = 0; i < S[k].length; i++) { const [cx, cy] = M.cell(i, i); ctx.save(); ctx.globalAlpha = A * diag; ctx.strokeStyle = C.i; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    return M;
  }
  function shotR2() {
    // ── 17–18 Q4 (a) ──
    let a = B.win(s('C27b'), s('C27j') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C27b') + 0.4);
      B.qhead('2017–2018 期中 · 第 4 题 · 12 分', A);
      const ga = A * (1 - gin(s('C27f') - 0.2));
      if (ga > 0) {
        const S = [
          [[0, 1, 2, 3], [1, 1, 1, 1], [-2, -2, 3, 3], [1, 2, -2, -3]],
          [[1, 1, 1, 1], [0, 1, 2, 3], [-2, -2, 3, 3], [1, 2, -2, -3]],
          [[1, 1, 1, 1], [0, 1, 2, 3], [0, 0, 5, 5], [0, 1, -3, -4]],
          [[1, 1, 1, 1], [0, 1, 2, 3], [0, 0, 5, 5], [0, 0, -5, -7]],
          [[1, 1, 1, 1], [0, 1, 2, 3], [0, 0, 5, 5], [0, 0, 0, -2]],
        ];
        const T = [-1, cue('C27c', '先交换') + 0.5, cue('C27d', '第四行减第一行') + 0.6, cue('C27d', '再减第二行') + 0.6, cue('C27d', '最后加第三行') + 0.6];
        const ops = [null, [[0, 'R₁ ↔ R₂']], [[2, 'R₃ + 2R₁'], [3, 'R₄ − R₁']], [[3, 'R₄ − R₂']], [[3, 'R₄ + R₃']]];
        stepMat(ga, S, T, ops, DX + 20, DY - 170, { diag: gin(s('C27e')) });
        // 符号记账
        const gs = ga * gin(cue('C27c', '变号'));
        B.card(DX + 330, DY - 300, 150, 56, gs * 0.95, C.free);
        ctag('符号 −', DX + 330, DY - 300, { px: 28, a: gs, color: C.free });
        ctag('1 × 1 × 5 × (−2) = −10', DX, DY + 30, { px: 32, a: ga * gin(s('C27e') + 0.4), color: C.i, font: F.serif });
        const gx = ga * gin(cue('C27e', '换行的那个负号'));
        B.card(DX, DY + 120, 560, 76, gx * 0.95, OK);
        ctag('det A = (−1) × (−10) = 10', DX, DY + 120, { px: 34, a: gx, color: OK, font: F.serif });
        B.burst(DX, DY + 120, cue('C27e', '等于十'), OK, { r1: 200 });
        const gd = ga * gin(s('D06a') + 0.3);
        ctag('det B = 10 + 10 = 20 ?', DX, DY + 215, { px: 32, a: gd, color: C.ds, font: F.serif });
      }
      // (b)
      const gb = A * gin(s('C27f'));
      if (gb > 0) {
        const gt = gb * (1 - gin(s('C27g') + 0.5));
        B.xcard('det(B₁ + B₂) ≠ det B₁ + det B₂', DX, DY - 200, 640, 80, gt, C.free, 34);
        if (B.t < s('C27g') + 1) { ctx.save(); ctx.globalAlpha = gb * gin(s('C27f') + 0.3) * (1 - gin(s('C27g'))); ctx.strokeStyle = C.free; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(DX - 200, DY + 215); ctx.lineTo(DX + 200, DY + 215); ctx.stroke(); ctx.restore(); }
        const gr = gb * gin(s('C27g'));
        if (gr > 0) {
          const R = [
            ['2r₁', 'r₂ + r₃', 'r₂ + r₃ + r₄', '2r₂ + r₄'],
            ['2r₁', 'r₂ + r₃', 'r₄', '2r₂ + r₄'],
            ['2r₁', 'r₂ + r₃', 'r₄', '2r₂'],
            ['2r₁', 'r₃', 'r₄', '2r₂'],
          ];
          const TT = [-1, cue('C27h', '剩下r四'), cue('C27h', '剩下二倍'), cue('C27h', '剩下r三')];
          let k = 0; for (let q = 1; q < 4; q++) if (B.t >= TT[q]) k = q;
          const fr = k ? gin(TT[k], 0.5) : 1;
          ctag('B 的行', DX - 300, DY - 260, { px: 28, a: gr, color: C.peri });
          ctx.save(); ctx.globalAlpha = gr; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(DX - 140, DY - 280); ctx.lineTo(DX - 160, DY - 280); ctx.lineTo(DX - 160, DY - 40); ctx.lineTo(DX - 140, DY - 40); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(DX + 140, DY - 280); ctx.lineTo(DX + 160, DY - 280); ctx.lineTo(DX + 160, DY - 40); ctx.lineTo(DX + 140, DY - 40); ctx.stroke(); ctx.restore();
          R[k].forEach((t, i) => {
            const ch = k > 0 && t !== R[k - 1][i];
            ctag(t, DX, DY - 250 + i * 60, { px: 32, a: gr * (ch ? 0.3 + 0.7 * fr : 1), color: ch && fr < 1 ? C.j : (/2r/.test(t) ? C.i : C.ink), font: F.serif });
          });
          const gi = gb * gin(s('C27i') + 0.3);
          ctag('det B = 2 · 2 · det[r₁; r₃; r₄; r₂]', DX, DY + 30, { px: 30, a: gi, color: C.ink, font: F.serif });
          ctag('r₁ r₃ r₄ r₂ → 换两次 → r₁ r₂ r₃ r₄：符号 +', DX, DY + 90, { px: 27, a: gb * gin(cue('C27i', '换两次')), color: C.j, font: F.serif });
          const gx = gb * gin(cue('C27i', '所以B的行列式'));
          B.card(DX, DY + 175, 520, 78, gx * 0.95, OK);
          ctag('det B = 4 × 10 = 40', DX, DY + 175, { px: 36, a: gx, color: OK, font: F.serif });
          B.burst(DX, DY + 175, cue('C27i', '等于四十'), OK, { r1: 220 });
          B.stamp(DX + 300, DY + 60, false, gin(s('G03b') + 0.3, 0.4), gb * gin(s('G03b') + 0.3), '≠ 20');
        }
      }
    }
    // ── 23–24 Q7 ──
    a = B.win(s('C27j'), s('C28') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C27j') + 0.4);
      B.qhead('2023–2024 期中 · 第 7 题 · 12 分', A);
      const g1 = A * (1 - gin(s('C27l') - 0.1));
      if (g1 > 0) {
        const S = [[[2, 2, 1], [2, 3, 5], [2, 5, 3]], [[2, 2, 1], [0, 1, 4], [0, 3, 2]], [[2, 2, 1], [0, 1, 4], [0, 0, -10]]];
        const T = [-1, cue('C27k', '第二行减第一行') + 0.6, cue('C27k', '再减三倍') + 0.6];
        stepMat(g1, S, T, [null, [[1, 'R₂ − R₁'], [2, 'R₃ − R₁']], [[2, 'R₃ − 3R₂']]], DX, DY - 160, { px: 40, diag: gin(cue('C27k', '行列式等于')) });
        const gx = g1 * gin(cue('C27k', '行列式等于'));
        B.card(DX, DY + 60, 620, 78, gx * 0.95, OK);
        ctag('det = 2 × 1 × (−10) = −20 ≠ 0', DX, DY + 60, { px: 34, a: gx, color: OK, font: F.serif });
        B.stamp(DX + 300, DY + 170, true, gin(cue('C27k', '所以非奇异'), 0.4), g1 * gin(cue('C27k', '所以非奇异')), '非奇异');
      }
      const g2 = A * gin(s('C27l'));
      if (g2 > 0) {
        const L = [['A² − A − 2I = O', s('C27l') + 0.2, C.ink], ['A² − A = 2I', cue('C27l', '移项'), C.ink], ['A(A − I) = 2I', cue('C27l', '提出A'), C.i], ['A · ½(A − I) = I', cue('C27l', '两边除以二'), C.j]];
        L.forEach(([t, t0, col], i) => ctag(t, DX, DY - 230 + i * 70, { px: 36, a: g2 * gin(t0), color: col, font: F.serif }));
        ctag('行列式定不下来，但能判断奇异性', DX, DY + 70, { px: 26, a: g2 * B.win(cue('C27l', '定不下来'), e('C27l')), color: C.free });
        const gx = g2 * gin(cue('C27m', '而且A的逆'));
        B.card(DX, DY + 150, 520, 80, gx * 0.95, OK);
        ctag('A⁻¹ = ½(A − I)', DX, DY + 150, { px: 38, a: gx, color: OK, font: F.serif });
        B.burst(DX, DY + 150, cue('C27m', '而且A的逆') + 0.3, OK, { r1: 200 });
        ctag('套路：常数项移一边，另一边提出 A', DX, DY + 240, { px: 28, a: g2 * gin(cue('C27m', '这类题的套路')), color: C.peri });
      }
    }
  }
"""
anchor = "\n  function shotOutro() {"; assert anchor in s; s = s.replace(anchor, code + anchor, 1)
a2 = "shotQ4(); shotOutro();"; assert a2 in s; s = s.replace(a2, "shotQ4(); shotR2(); shotOutro();", 1)
a3 = "const a = B.win(s('C23'), s('C28') - 0.2);"; assert a3 in s; s = s.replace(a3, "const a = B.win(s('C23'), s('C27b') - 0.2);", 1)
a4 = "B.paper(EX, 'y2021_q4', { t0: s('C23') + 0.2, dock: cue('C23', '仔细看') - 0.5, out: s('C28') - 0.3 });"; assert a4 in s
s = s.replace(a4, a4.replace("out: s('C28') - 0.3", "out: s('C27b') - 0.3") + """
    B.paper(EX, 'y1718_q4', { t0: s('C27b') + 0.2, dock: cue('C27b', '第一问') - 0.3, out: s('C27j') - 0.3 });
    B.paper(EX, 'y2324_q7', { t0: s('C27j') + 0.2, dock: cue('C27j', '求行列式') - 0.3, out: s('C28') - 0.3 });""", 1)
a5 = "'y1819_q5', 'y2021_q4'])"; assert a5 in s; s = s.replace(a5, "'y1819_q5', 'y2021_q4', 'y1718_q4', 'y2324_q7'])", 1)
a6 = "C26: 0.6, C28: 0.8 },"; assert a6 in s; s = s.replace(a6, "C26: 0.6, C27b: 1.0, C27f: 0.4, C27j: 1.0, C28: 0.8 },", 1)
a7 = "C27: 1.0, C28: 1.2 },"; assert a7 in s; s = s.replace(a7, "C27: 1.0, C27b: 1.0, C27c: 0.8, C27d: 1.4, C27e: 1.2, D06a: 0.6, C27f: 1.0, C27g: 1.0, C27h: 1.4, C27i: 1.4, G03b: 1.0, C27j: 0.8, C27k: 1.4, C27l: 1.2, C27m: 1.2, C28: 1.2 },", 1)
a8 = "TL.sfx('bell_soft', s('C28'), 0.35); TL.sfx('shimmer', s('D07'), 0.35);"; assert a8 in s
s = s.replace(a8, a8 + """
  // 扩写二 sfx
  TL.sfx('whoosh', s('C27b') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C27c', '先交换') + 0.5, 0.3); TL.sfx('pluck', cue('C27c', '变号'), 0.3);
  ['第四行减第一行', '再减第二行', '最后加第三行'].forEach(p => TL.sfx('pop', cue('C27d', p) + 0.6, 0.3));
  TL.sfx('ding_hi', s('C27e') + 0.4, 0.3); TL.sfx('impact', cue('C27e', '等于十'), 0.3); TL.sfx('sting', s('D06a') + 0.3, 0.25);
  TL.sfx('buzz', s('C27f') + 0.2, 0.25); TL.sfx('slam', s('C27f') + 0.4, 0.3); TL.sfx('swoosh_soft', s('C27g') + 0.3, 0.3);
  ['剩下r四', '剩下二倍', '剩下r三'].forEach(p => TL.sfx('pop', cue('C27h', p), 0.3)); TL.sfx('tick', cue('C27i', '换两次'), 0.3);
  TL.sfx('impact', cue('C27i', '等于四十'), 0.35); TL.sfx('stamp', s('G03b') + 0.3, 0.35);
  TL.sfx('whoosh', s('C27j') + 0.2, 0.3); TL.sfx('pop', cue('C27k', '第二行减第一行') + 0.6, 0.3); TL.sfx('pop', cue('C27k', '再减三倍') + 0.6, 0.3);
  TL.sfx('ding_hi', cue('C27k', '行列式等于'), 0.3); TL.sfx('stamp', cue('C27k', '所以非奇异'), 0.35);
  ['移项', '提出A', '两边除以二'].forEach(p => TL.sfx('tick', cue('C27l', p), 0.3)); TL.sfx('impact', cue('C27m', '而且A的逆') + 0.3, 0.3); TL.sfx('shimmer', s('D06b'), 0.3);""", 1)
open(p,'w',encoding='utf-8').write(s); print('ok')
