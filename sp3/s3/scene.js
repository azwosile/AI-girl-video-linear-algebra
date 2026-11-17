// 特别篇 3 · 第 3 段：消元算 4×4，再算一个“拼出来”的 B（2017–18 第 4 题，12 分）。
// 分镜：原题三步 → 三条规则卡 + 右上角符号计数器 → 换行（计数器翻成 −）→ 三步倍加 → 上三角，对角线亮 → det = 10
//       → 第二问 B₁ + B₂ 并排，大肥鱼写 “10 + 10 = 20” → GPT 提醒 → 四行变乐高积木 A₁…A₄（四色）
//       → B 的每一行由积木拼成 → 倍加拆积木三步 → (2A₁, A₃, A₄, 2A₂) → 提出 4 → A₂ 往上冒两格（计数器翻两次回 +）
//       → det B = 40，大肥鱼的 20 被红叉 → 验算 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_confused', 'ds_proud', 'gpt_cross', 'gpt_point', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1718_q4']);
  const B = base(R, {
    assets, label: '特别篇 3 · 行列式', title: '消元 4×4 + 拼出来的 B', hi: 3, en: '2017–18 · Q4 · 12 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C08: 0.6, C09: 0.6, C11: 0.4, C15: 0.6 },
    post: { C01: 1.2, C02: 1.6, C03: 1.6, C04: 1.8, C05: 1.6, C06: 1.6, C07: 1.8, D01: 0.6, G01: 1.4, C08: 1.4, D02: 1.2, G02: 1.2, C09: 1.4, C10: 2.0, C11: 2.2, C12: 1.8, C13: 1.8, C14: 1.6, G03: 1.6, C15: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const S = [
    [[0, 1, 2, 3], [1, 1, 1, 1], [-2, -2, 3, 3], [1, 2, -2, -3]],
    [[1, 1, 1, 1], [0, 1, 2, 3], [-2, -2, 3, 3], [1, 2, -2, -3]],
    [[1, 1, 1, 1], [0, 1, 2, 3], [0, 0, 5, 5], [0, 1, -3, -4]],
    [[1, 1, 1, 1], [0, 1, 2, 3], [0, 0, 5, 5], [0, 0, -5, -7]],
    [[1, 1, 1, 1], [0, 1, 2, 3], [0, 0, 5, 5], [0, 0, 0, -2]],
  ];
  const tSwap = cue('C03', '先交换第一行和第二行');
  const T = [0, tSwap, cue('C04', '第三行加两倍'), cue('C05', '第四行减第二行'), cue('C06', '第四行加第三行')];
  const OPS = [null, [[0, 'r₁ ↔ r₂'], [1, '']], [[2, 'r₃ + 2r₁'], [3, 'r₄ − r₁']], [[3, 'r₄ − r₂']], [[3, 'r₄ + r₃']]];
  const COL = [C.peri, C.i, C.j, C.k];
  const tUp = [cue('C13', '交换两次') - 0.6, cue('C13', '交换两次')];

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3);
  ['乘负一', '整体乘k', '不变'].forEach(w => TL.sfx('tick', cue('C02', w), 0.25)); TL.sfx('pop', cue('C02', '计数器'), 0.25);
  TL.sfx('swoosh_soft', tSwap, 0.3); TL.sfx('crack', tSwap + 0.5, 0.3);
  T.slice(2).forEach(t => { TL.sfx('swoosh_soft', t, 0.25); TL.sfx('marimba', t + 0.4, 0.22); });
  TL.sfx('shimmer', cue('C06', '对角线是'), 0.3); TL.sfx('impact', cue('C07', '等于十'), 0.3);
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('click', s('G01') + 0.4, 0.3);
  TL.sfx('whoosh', s('C08') + 0.2, 0.3); TL.sfx('type', s('D02') + 0.3, 0.25); TL.sfx('sting', s('G02') + 0.2, 0.22);
  [0, 1, 2, 3].forEach(k => TL.sfx('pop', cue('C09', '乐高积木') + k * 0.2, 0.22));
  ['第一行等于', '第二行等于', '第三行等于', '第四行等于'].forEach(w => TL.sfx('pluck', cue('C10', w), 0.25));
  ['第三行减去第二行', '第四行减去新的第三行', '第二行减去第四行的一半'].forEach(w => { TL.sfx('swoosh_soft', cue('C11', w), 0.25); TL.sfx('crack', cue('C11', w) + 0.8, 0.22); });
  TL.sfx('slam', cue('C12', '提出两个二'), 0.3); tUp.forEach(t => { TL.sfx('swoosh_in', t, 0.25); TL.sfx('tick2', t + 0.3, 0.25); });
  TL.sfx('impact', cue('C13', '等于四十'), 0.35); TL.sfx('buzz', cue('C14', '加起来二十'), 0.22); TL.sfx('stamp', cue('C14', '正确答案却是四十'), 0.3);
  TL.sfx('check', s('G03') + 0.4, 0.3); TL.sfx('swell', s('C15') - 0.2, 0.3);

  // 符号计数器（右上）
  function signCounter(a) {
    if (a <= 0) return;
    let sg = 1, tf = -1; if (B.t > tSwap) { sg = -1; tf = tSwap; }
    if (B.t > s('C08')) { sg = 1; tf = -1; }
    if (B.t > tUp[0]) { sg = -1; tf = tUp[0]; } if (B.t > tUp[1]) { sg = 1; tf = tUp[1]; }
    const fl = tf > 0 ? Math.abs(Math.cos(Math.PI * Math.min(1, prog(B.t, tf, tf + 0.4)))) : 1;
    const x = DX + 520, y = DY - 300;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, Math.max(0.05, fl)); ctx.translate(-x, -y);
    B.card(x, y, 140, 110, a, sg > 0 ? C.j : C.free); ctag(sg > 0 ? '+' : '−', x, y, { px: 70, a, color: sg > 0 ? C.j : C.free, font: F.serif }); ctx.restore();
    ctag('符号', x, y + 80, { px: 22, a, color: C.inkMid });
  }

  function shotA() {
    const a = B.win(s('C02'), s('C08') - 0.3); if (a <= 0) return;
    const gR = a * B.win(s('C02'), s('C03') + 0.4);
    [['换两行 → × (−1)', C.free, '乘负一'], ['某行 × k → 整体 × k', C.i, '整体乘k'], ['某行 + 别行倍数 → 不变', C.j, '不变']].forEach(([tx, col, w], k) =>
      B.xcard(tx, DX - 80, DY - 180 + k * 100, 560, 76, gR * gin(cue('C02', w)), col, 30, col));
    const gM = a * gin(s('C03'));
    if (gM > 0) {
      const { M, k } = K.steps(S, T, OPS, { x: DX - 40, y: DY - 60, px: 40, a: gM });
      if (B.t < tSwap + 0.2) K.ring(...M.cell(0, 0), 30, C.free, gM, prog(B.t, s('C03'), s('C03') + 0.5), 5);
      const gd = gM * gin(cue('C06', '对角线是'));
      if (gd > 0) [0, 1, 2, 3].forEach(q => K.ring(...M.cell(q, q), 30, C.i, gd, prog(B.t, cue('C06', '对角线是') + q * 0.25, cue('C06', '对角线是') + 0.5 + q * 0.25)));
      ctag('det A = (−1) · 1 · 1 · 5 · (−2) = 10', DX, DY + 200, { px: 42, a: gM * gin(s('C07')), color: OK, font: F.serif });
      B.burst(DX + 300, DY + 200, cue('C07', '等于十'), OK, { r1: 200 });
      const gG = a * gin(s('G01'));
      B.card(DX, DY + 300, 760, 70, gG * 0.95, C.gpt); ctag('草稿右上角写 ±，换一次划一下', DX, DY + 300, { px: 26, a: gG, color: C.gpt });
    }
  }

  const BR = [['2A₁', [[0, 2]]], ['A₂ + A₃', [[1, 1], [2, 1]]], ['A₂ + A₃ + A₄', [[1, 1], [2, 1], [3, 1]]], ['2A₂ + A₄', [[1, 2], [3, 1]]]];
  function lego(x, y, parts, a, w = 380) {
    if (a <= 0) return; let tot = parts.reduce((q, [, k]) => q + k, 0), cx = x - w / 2;
    parts.forEach(([i, k]) => { const ww = w * k / tot; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(COL[i], 0.35); ctx.strokeStyle = COL[i]; ctx.lineWidth = 3;
      ctx.fillRect(cx + 3, y - 24, ww - 6, 48); ctx.strokeRect(cx + 3, y - 24, ww - 6, 48);
      for (let d = 0; d < 2 * k; d++) { ctx.beginPath(); ctx.arc(cx + ww * (d + 0.5) / (2 * k), y - 30, 7, Math.PI, 0); ctx.fill(); ctx.stroke(); }
      ctx.restore(); ctag((k > 1 ? k : '') + 'A' + '₁₂₃₄'[i], cx + ww / 2, y, { px: 26, a, color: C.ink, font: F.serif }); cx += ww; });
  }

  function shotB() {
    const a = B.win(s('C08'), s('C15') - 0.2); if (a <= 0) return;
    const g8 = a * (1 - gin(s('C09')));
    if (g8 > 0) {
      ctag('B =', DX - 520, DY - 80, { px: 32, a: g8, font: F.serif });
      B.mat(DX - 300, DY - 80, [[0, 1, 2, 3], [-2, -2, 3, 3], [1, 2, -2, -3], [1, 1, 1, 1]], { px: 28, a: g8 }); ctag('B₁', DX - 300, DY - 220, { px: 26, a: g8, color: C.inkMid, font: F.serif });
      ctag('+', DX - 80, DY - 80, { px: 56, a: g8, color: C.peri, font: F.serif });
      B.mat(DX + 140, DY - 80, [[0, 1, 2, 3], [1, 1, 1, 1], [-1, -1, 4, 4], [2, 3, -1, -2]], { px: 28, a: g8 }); ctag('B₂', DX + 140, DY - 220, { px: 26, a: g8, color: C.inkMid, font: F.serif });
    }
    // 大肥鱼的 20
    const gw = a * gin(s('D02') + 0.3);
    const wx = B.t > s('C09') ? DX + 380 : DX, wy = B.t > s('C09') ? DY + 330 : DY + 160;
    ctag('det B = 10 + 10 = 20', wx, wy, { px: B.t > s('C09') ? 26 : 38, a: gw * (1 - gin(s('G03'))), color: C.ds, font: F.serif });
    if (B.t > cue('C14', '加起来二十')) B.cross(wx, wy, prog(B.t, cue('C14', '加起来二十'), cue('C14', '加起来二十') + 0.4), gw * (1 - gin(s('G03'))), 120);
    K.pill('行列式对加法不友好', DX, DY + 240, C.gpt, a * B.win(s('G02'), s('C09') + 0.5), 28);
    // 乐高
    const gL = a * gin(s('C09'));
    if (gL > 0) {
      const lx = DX - 330;
      ['A₁ = (0, 1, 2, 3)', 'A₂ = (1, 1, 1, 1)', 'A₃ = (−2, −2, 3, 3)', 'A₄ = (1, 2, −2, −3)'].forEach((tx, k) => {
        const g = gL * gin(cue('C09', '乐高积木') + k * 0.2) * (1 - gin(s('C11')) * 0.6); lego(lx, DY - 230 + k * 80, [[k, 1]], g, 120); ctag(tx, lx + 200, DY - 230 + k * 80, { px: 24, a: g, color: COL[k], font: F.serif, align: 'left' }); });
      // B 的四行
      let rows = BR.map(r => r[1]);
      const t1 = cue('C11', '第三行减去第二行'), t2 = cue('C11', '第四行减去新的第三行'), t3 = cue('C11', '第二行减去第四行的一半');
      if (B.t > t1 + 0.6) rows[2] = [[3, 1]]; if (B.t > t2 + 0.6) rows[3] = [[1, 2]]; if (B.t > t3 + 0.6) rows[1] = [[2, 1]];
      let ord = [0, 1, 2, 3]; const yy = r => DY - 230 + r * 90;
      rows.forEach((pr, r) => {
        const g = gL * gin(cue('C10', ['第一行等于', '第二行等于', '第三行等于', '第四行等于'][r]));
        let y = yy(r);
        if (B.t > tUp[0] - 0.01) { const u1 = smoother(prog(B.t, tUp[0], tUp[0] + 0.5)), u2 = smoother(prog(B.t, tUp[1], tUp[1] + 0.5));
          // 当前行序 (2A₁,A₃,A₄,2A₂) → A₂ 从第 4 位冒到第 2 位
          if (r === 3) y = yy(3 - u1 - u2); else if (r === 2) y = yy(2 + u1); else if (r === 1) y = yy(1 + u2);
        }
        const fade = r === 0 || r === 3 ? 1 : 1;
        lego(DX + 220, y, B.t > cue('C12', '提出两个二') + 0.5 ? pr.map(([i]) => [i, 1]) : pr, g * fade, 340);
        ctag('r' + '₁₂₃₄'[r], DX + 20, yy(r), { px: 22, a: g * (1 - gin(tUp[0])), color: C.inkMid, font: F.serif });
      });
      [[t1, 2, 'r₃ − r₂'], [t2, 3, 'r₄ − r₃'], [t3, 1, 'r₂ − ½r₄']].forEach(([t, r, tx]) => ctag(tx, DX + 470, yy(r), { px: 24, a: gL * gin(t) * (1 - gin(t + 3)), color: C.j, font: F.serif, align: 'left' }));
      ctag('× 4', DX + 470, DY - 80, { px: 54, a: gL * gin(cue('C12', '提出两个二')), color: C.peri, font: F.serif, align: 'left' });
      B.burst(DX + 220, DY - 100, cue('C12', '提出两个二'), C.peri, { r1: 260 });
      ctag('det B = 4 · det A = 4 × 10 = 40', DX + 40, DY + 170, { px: 42, a: gL * gin(cue('C13', '所以B的行列式')), color: OK, font: F.serif });
      B.burst(DX + 40, DY + 170, cue('C13', '等于四十'), OK, { r1: 260, n: 24 });
      K.redStamp('40 ≠ 20', DX - 330, DY + 280, prog(B.t, cue('C14', '正确答案却是四十'), cue('C14', '正确答案却是四十') + 0.5), gL * gin(cue('C14', '正确答案却是四十')) * (1 - gin(s('G03') + 0.5)), C.free, 46);
      const gG = a * gin(s('G03'));
      B.card(DX - 60, DY + 290, 760, 70, gG * 0.95, C.gpt); ctag('直接对 B 消元：也是 40 ✓', DX - 60, DY + 290, { px: 28, a: gG, color: C.gpt });
    }
  }

  function shotOutro() {
    const a = B.win(s('C15'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 消元算行列式', ['① 换行变号（挂计数器）', '② 倍乘提出', '③ 倍加不变', '④ 拼出来的矩阵：先加起来，再拆回原来的行'],
      [s('C15') + 0.3, cue('C15', '倍乘提出'), cue('C15', '倍加不变'), cue('C15', '拼出来的矩阵')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotA(); shotB(); shotOutro();
      signCounter(B.win(s('C02') + 1, s('C15') - 0.2) * gin(cue('C02', '计数器')));
      B.paper(EX, 'y1718_q4', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C15') - 0.4 });
    });
  }
  return { TL, draw };
}
