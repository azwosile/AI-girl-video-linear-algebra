p='x7/scene.js'; s=open(p,encoding='utf-8').read()
assert 'shotQ4' not in s
code = r"""
  // ════ 压轴加练：2025–26 Q4（自己消元 + 四个子空间 + 零行配方求 N(Aᵀ)）════
  function shotQ4() {
    const a = B.win(s('C17j'), s('C18') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C17j', '这次没有给U'));
    B.qhead('2025–2026 期中 · 第 4 题 · 24 分', A);
    const S = [
      [[1, 3, 3, 2, 7], [2, 6, 9, 7, 20], [-1, -3, 3, 4, 5]],
      [[1, 3, 3, 2, 7], [0, 0, 3, 3, 6], [0, 0, 6, 6, 12]],
      [[1, 3, 3, 2, 7], [0, 0, 3, 3, 6], [0, 0, 0, 0, 0]],
      [[1, 3, 0, -1, 1], [0, 0, 1, 1, 2], [0, 0, 0, 0, 0]],
    ];
    const T = [-1, cue('C17k', '第二行减两倍') + 0.6, cue('C17l', '整行清零'), cue('C17m', '第一行减三倍') + 0.4];
    let k = 0; for (let q = 1; q < 4; q++) if (B.t >= T[q]) k = q;
    const prev = k ? S[k - 1] : S[0], fresh = k ? gin(T[k], 0.5) : 1;
    const MY = DY - 215, fin = k === 3;
    const piv = fin ? [0, 2] : [];
    const M = B.mat(DX + 40, MY, S[k], { px: 38, a: A, bar: 4, cell: (i, j) => {
      const ch = S[k][i][j] !== prev[i][j];
      return { txt: neg(S[k][i][j]), col: ch && fresh < 1 ? C.j : (fin && piv.includes(j) && i < 2 && S[k][i][j] === 1 ? C.i : (fin && (j === 1 || j === 3) ? C.free : C.ink)), a: ch ? 0.3 + 0.7 * fresh : 1 };
    } });
    // 行操作标签（矩阵左侧）
    const LX = DX + 40 - M.w / 2 - 95;
    const ops = [[], [[1, 'R₂ − 2R₁'], [2, 'R₃ + R₁']], [[2, 'R₃ − 2R₂']], [[1, 'R₂ ÷ 3'], [0, 'R₁ − 3R₂']]];
    if (k > 0) ops[k].forEach(([i, txt]) => ctag(txt, LX, M.cell(i, 0)[1], { px: 26, a: A * gin(T[k] - 0.4) * (1 - gin(T[k] + 4.5)), color: C.j, font: F.serif }));
    // 主元跳格提示
    if (B.t > s('G03c') - 0.2 && !fin) {
      const g = A * B.win(s('G03c'), e('G03c') + 0.3), [x, y] = M.cell(1, 2);
      ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.gpt; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      ctag('主元列：第 1、3 列', DX + 40, MY + M.h / 2 + 34, { px: 28, a: g, color: C.gpt });
    }
    if (fin) {
      [[0, 0], [1, 2]].forEach(([i, j]) => { const [x, y] = M.cell(i, j); ctx.save(); ctx.globalAlpha = A * gin(T[3] + 0.6); ctx.strokeStyle = C.i; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); });
      ['x₁', 'x₂', 'x₃', 'x₄'].forEach((t, j) => ctag(t, M.cell(0, j)[0], MY - M.h / 2 - 26, { px: 24, a: A * gin(s('C17n')), color: j === 0 || j === 2 ? C.i : C.free }));
    }
    // (a) 区
    const ga = A * (1 - gin(s('C17p') - 0.1));
    if (ga > 0) {
      ctag('令 x₂ = x₄ = 0：x₁ = 1，x₃ = 2', DX, DY - 20, { px: 30, a: ga * gin(cue('C17n', '让自由变量')), color: C.ink, font: F.serif });
      ctag('特解  (1, 0, 2, 0)', DX, DY + 40, { px: 32, a: ga * gin(cue('C17n', '特解是')), color: C.i, font: F.serif });
      ctag('x₂ = 1 → (−3, 1, 0, 0)　　x₄ = 1 → (1, 0, −1, 1)', DX, DY + 110, { px: 28, a: ga * gin(s('C17o') + 0.3), color: C.free, font: F.serif });
      const gx = ga * gin(cue('C17o', '全部解'));
      B.card(DX, DY + 200, 860, 76, gx * 0.95, OK);
      ctag('x = (1, 0, 2, 0) + s(−3, 1, 0, 0) + t(1, 0, −1, 1)', DX, DY + 200, { px: 32, a: gx, color: OK, font: F.serif });
      B.burst(DX, DY + 200, cue('C17o', '全部解') + 0.3, OK, { r1: 240 });
    }
    // (b) 四个子空间
    const gb = A * gin(s('C17p'));
    if (gb > 0) {
      const rows = [
        ['N(A)', '(−3, 1, 0, 0)，(1, 0, −1, 1)', s('C17p') + 0.3, C.free],
        ['行空间', '(1, 3, 0, −1)，(0, 0, 1, 1)', cue('C17p', '行空间'), C.ink],
        ['列空间', 'a₁ = (1, 2, −1)，a₃ = (3, 9, 3)', cue('C17p', '列空间'), C.i],
        ['N(Aᵀ)', '(5, −2, 1)', cue('C17r', '所以A转置'), C.j],
      ];
      rows.forEach(([h, v, t0, col], q) => {
        const y = DY - 40 + q * 62, g = gb * gin(t0) * (1 - 0.6 * gin(s('C17s')));
        ctag(h, DX - 330, y, { px: 30, a: g, color: col, align: 'left' });
        ctag(v, DX - 170, y, { px: 30, a: g, color: col, font: F.serif, align: 'left' });
      });
      // 零行配方
      if (B.t > s('C17q') - 0.2) {
        const g = A * B.win(s('C17q'), e('G03d') + 0.2), [, y3] = M.cell(2, 0);
        ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.j; ctx.lineWidth = 3; ctx.strokeRect(DX + 40 - M.w / 2 - 6, y3 - 26, M.w + 12, 52); ctx.restore();
        ctag('5R₁ − 2R₂ + R₃ = 0', DX + 40, MY + M.h / 2 + 34, { px: 30, a: g * gin(cue('C17q', '展开整理')), color: C.j, font: F.serif });
        B.flash(DX + 40, y3, cue('C17q', '等于零'), C.j);
      }
      ctag('5·1 − 2·2 − 1 = 0 ✓　5·2 − 2·7 + 4 = 0 ✓', DX, DY + 215, { px: 28, a: A * B.win(s('G03d') + 0.2, e('G03d') + 0.2), color: C.gpt, font: F.serif });
    }
    // (c)
    if (B.t > s('C17s') - 0.2) {
      const g = A * gin(s('C17s')), [x4, y4] = M.cell(0, 3);
      ctx.save(); ctx.globalAlpha = g * 0.9; ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.strokeRect(x4 - 26, y4 - 26, 52, M.h * 2 / 3 + 4); ctx.restore();
      ctag('= −e₁ + e₂', x4, MY + M.h / 2 + 34, { px: 26, a: g, color: C.k });
      const gx = A * gin(cue('C17s', '沿着丝线'));
      B.card(DX, DY + 215, 600, 80, gx * 0.95, OK);
      ctag('a₄ = −a₁ + a₃', DX, DY + 215, { px: 38, a: gx, color: OK, font: F.serif });
      B.burst(DX, DY + 215, cue('C17s', '沿着丝线') + 0.3, OK, { r1: 200 });
      B.stamp(DX + 360, DY + 215, true, gin(cue('C17s', '正好是a四'), 0.4), A * gin(cue('C17s', '正好是a四')), '✓ 24 分');
    }
  }
"""
anchor = "\n  function shotOutro() {"
assert anchor in s; s = s.replace(anchor, code + anchor, 1)
a2 = "shotMore(); shotOutro();"; assert a2 in s; s = s.replace(a2, "shotMore(); shotQ4(); shotOutro();", 1)
a3 = "B.paper(EX, 'y2021_q7', { t0: s('C17f') + 0.2, dock: cue('C17f', '三乘四') - 0.5, out: s('C18') - 0.3 });"
assert a3 in s; s = s.replace(a3, a3.replace("s('C18') - 0.3", "s('C17j') - 0.3") + "\n    B.paper(EX, 'y2526_q4', { t0: s('C17j') + 0.2, dock: cue('C17j', '这次没有给U') - 0.3, out: s('C18') - 0.3 });", 1)
a4 = "loadExam(['y2425_q4', 'y2223_q2', 'y2021_q7'])"; assert a4 in s; s = s.replace(a4, "loadExam(['y2425_q4', 'y2223_q2', 'y2021_q7', 'y2526_q4'])", 1)
# r3 window must end at C17j now
a5 = "rref('C17f', 'C18',"; assert a5 in s; s = s.replace(a5, "rref('C17f', 'C17j',", 1)
open(p,'w',encoding='utf-8').write(s)
print('ok')
