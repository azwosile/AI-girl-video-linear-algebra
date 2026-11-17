// 特别篇 1 · 第 7 段：置换矩阵求逆（2024–25 第 3 题，10 分）+ 本集收尾。
// 分镜：原题三步 → 5×5 矩阵（1 = 橙色方块，0 = 暗点）→ 每行每列恰一个 1 扫描 → 五条彩色行条从 I 出发
//       交换 1↔3、4↔5 → det = (−1)² = 1 → 同样交换再做一遍回到 I：P·P = I → 3×3 轮换反例（转三次才回）
//       → P⁻¹ = Pᵀ、P 对称 → [P | I] 两步 → 评分点 → 三枚操作印章翻面（逆操作）→ 本集四张套路卡扇形 → 下集预告印章。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'ds_ask', 'ds_happy', 'ds_shock', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_q3']);
  const B = base(R, {
    assets, label: '特别篇 1 · 方程组与参数讨论', title: '置换矩阵求逆', hi: 7, en: '2024–25 · Q3 · 10 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C06: 0.4, G01: 0.4, C08: 0.6, C10: 0.8 },
    post: { C02: 1.4, C03: 2.0, C04: 1.4, C05: 2.0, C06: 2.4, C07: 1.0, G01: 1.6, G02: 1.0, C08: 1.6, C09: 1.2, C10: 2.0, D03: 0.8, C11: 2.4 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const PERM = [2, 1, 0, 4, 3]; // 第 i 行的 1 在第 PERM[i] 列
  const COLS = [C.free, C.i, C.j, C.k, C.peri];
  const tS1 = cue('C03', '第一行和第三行换'), tS2 = cue('C03', '第四行和第五行换');
  const tB1 = cue('C05', '把同样的交换'), tB2 = tB1 + 1.0;

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('sting', s('D01') + 0.2, 0.2);
  TL.sfx('laser', cue('C02', '每一行恰好'), 0.25); TL.sfx('laser', cue('C02', '每一列也'), 0.25); TL.sfx('ding_hi', cue('C02', '置换矩阵'), 0.3);
  TL.sfx('whoosh', tS1, 0.3); TL.sfx('whoosh', tS2, 0.3);
  TL.sfx('tick', cue('C04', '变号一次'), 0.3); TL.sfx('ding', cue('C04', '等于一'), 0.3); TL.sfx('check', cue('C04', '所以非奇异'), 0.3);
  TL.sfx('swoosh_soft', tB1, 0.3); TL.sfx('swoosh_soft', tB2, 0.3); TL.sfx('impact', cue('C05', 'P的逆就是P自己'), 0.3);
  TL.sfx('pop', s('D02') + 0.2, 0.25);
  [0, 1, 2].forEach(k => TL.sfx('swoosh_soft', cue('C06', '转两次') - 1.2 + k * 0.9, 0.25)); TL.sfx('buzz', cue('C06', '回不来'), 0.2); TL.sfx('ding_hi', cue('C06', '等于它的转置'), 0.3);
  TL.sfx('pop', s('C07') + 0.3, 0.25);
  TL.sfx('click', cue('G01', '再做两步'), 0.3); TL.sfx('click', cue('G01', '再做两步') + 0.8, 0.3); TL.sfx('check', cue('G02', '经验证'), 0.3);
  ['交换两行', '某一行乘k', '某一行加上'].forEach(w => TL.sfx('stamp', cue('C08', w), 0.28));
  TL.sfx('shimmer', cue('C09', '撤销这个操作'), 0.3);
  ['末行定生死', '系数就是解', '自由变量不保证', '矩阵从哪边'].forEach(w => TL.sfx('marimba', cue('C10', w), 0.25));
  TL.sfx('sparkle', s('D03') + 0.2, 0.3); TL.sfx('stamp', cue('C11', '刻一枚印章'), 0.35); TL.sfx('bell_soft', e('C11') + 0.4, 0.35);

  // 行条状态：位置 slot(i) 动画
  function rowPos(i) {
    // 第一轮交换（I → P）
    let p = i;
    const sw = (a, b, t0) => { const u = smoother(prog(B.t, t0, t0 + 0.9)); if (p === a || p === b) { const q = p === a ? b : a; return lerp(p, q, u); } return p; };
    let y = i; const r1 = sw(0, 2, tS1); if (i === 0 || i === 2) y = r1; const r2 = (i === 3 || i === 4) ? sw(3, 4, tS2) : y; y = (i === 3 || i === 4) ? r2 : y;
    // 第二轮交换（P → I）
    const target = [2, 1, 0, 4, 3][i];
    if (B.t > tB1) { const u1 = smoother(prog(B.t, tB1, tB1 + 0.9)); if (i === 0 || i === 2) y = lerp(target, i, u1); }
    if (B.t > tB2) { const u2 = smoother(prog(B.t, tB2, tB2 + 0.9)); if (i === 3 || i === 4) y = lerp(target, i, u2); }
    return y;
  }
  function shotPerm() {
    const a = B.win(s('C02'), s('D02') + 0.2); if (a <= 0) return;
    B.qhead('2024–2025 期中 · 第 3 题 · 10 分', a);
    const cx = DX - 130, cy = DY - 30, d = 76;
    // 行条
    for (let i = 0; i < 5; i++) {
      const y = cy + (rowPos(i) - 2) * d, j = i; // 行条 i 携带 I 的第 i 行：1 在第 i 列
      const g = a * gin(s('C02') + 0.2 + i * 0.1);
      ctx.save(); ctx.globalAlpha = g * 0.25; ctx.fillStyle = COLS[i]; ctx.fillRect(cx - 2.5 * d, y - d / 2 + 4, 5 * d, d - 8); ctx.restore();
      for (let c = 0; c < 5; c++) {
        const x = cx + (c - 2) * d;
        if (c === j) { ctx.save(); ctx.globalAlpha = g; ctx.fillStyle = COLS[i]; ctx.fillRect(x - 24, y - 24, 48, 48); ctx.restore(); ctag('1', x, y, { px: 30, a: g, color: C.paperHi, font: F.serif }); }
        else B.dot(x, y, 5, C.inkMid, g * 0.6);
      }
    }
    // 扫描
    const sr = prog(B.t, cue('C02', '每一行恰好'), cue('C02', '每一行恰好') + 1.4), sc = prog(B.t, cue('C02', '每一列也'), cue('C02', '每一列也') + 1.4);
    if (sr > 0 && sr < 1) { ctx.save(); ctx.globalAlpha = a * 0.4; ctx.fillStyle = C.ink; ctx.fillRect(cx - 2.5 * d, cy + (sr * 5 - 2.5) * d, 5 * d, 6); ctx.restore(); }
    if (sc > 0 && sc < 1) { ctx.save(); ctx.globalAlpha = a * 0.4; ctx.fillStyle = C.ink; ctx.fillRect(cx + (sc * 5 - 2.5) * d, cy - 2.5 * d, 6, 5 * d); ctx.restore(); }
    ctag('置换矩阵', cx, cy - 2.5 * d - 50, { px: 34, a: a * gin(cue('C02', '置换矩阵')), color: C.peri });
    // 交换标签
    ctag('r₁ ↔ r₃', cx + 3 * d + 60, cy - d, { px: 30, a: a * gin(tS1) * (1 - gin(tB1 - 0.3) * 0.6), color: C.j, font: F.serif });
    ctag('r₄ ↔ r₅', cx + 3 * d + 60, cy + 1.5 * d, { px: 30, a: a * gin(tS2) * (1 - gin(tB1 - 0.3) * 0.6), color: C.j, font: F.serif });
    const gd = a * B.win(s('C04'), s('C05') - 0.1);
    ctag('换 1 次行，det 变号 1 次', DX, DY + 300, { px: 28, a: gd, color: C.ink });
    ctag('det P = (−1)² = 1 ≠ 0 ⇒ 非奇异', DX, DY + 350, { px: 34, a: gd * gin(cue('C04', '负一的平方')), color: C.i, font: F.serif });
    const gp = a * gin(cue('C05', '所以P乘P'));
    ctag('P · P = I  ⇒  P⁻¹ = P', DX, DY + 330, { px: 44, a: gp, color: OK, font: F.serif });
    B.burst(DX, DY + 330, cue('C05', 'P的逆就是P自己'), OK, { r1: 260 });
  }

  function shotCycle() {
    const a = B.win(s('C06'), s('G01') - 0.2); if (a <= 0) return;
    const cx = DX - 160, cy = DY - 60, d = 90, t0 = cue('C06', '转两次') - 1.2;
    let k = 0; for (let q = 0; q < 3; q++) k += smoother(prog(B.t, t0 + q * 0.9, t0 + q * 0.9 + 0.7));
    for (let i = 0; i < 3; i++) {
      const pos = (i + k) % 3, y = cy + (pos - 1) * d;
      ctx.save(); ctx.globalAlpha = a * 0.3; ctx.fillStyle = COLS[i]; ctx.fillRect(cx - 1.5 * d, y - d / 2 + 6, 3 * d, d - 12); ctx.restore();
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = COLS[i]; ctx.fillRect(cx + (i - 1) * d - 26, y - 26, 52, 52); ctx.restore();
    }
    ctag(`转了 ${Math.min(3, Math.floor(k + 0.02))} 次`, cx, cy + 2 * d, { px: 30, a, color: k >= 2.98 ? OK : C.free });
    ctag('轮换：转 2 次回不来', DX + 230, cy - 60, { px: 30, a: a * gin(cue('C06', '回不来')), color: C.free });
    ctag('P⁻¹ = Pᵀ', DX + 230, cy + 20, { px: 52, a: a * gin(cue('C06', '等于它的转置')), color: OK, font: F.serif });
    ctag('本题 P 对称：Pᵀ = P ⇒ P⁻¹ = P', DX, DY + 280, { px: 32, a: a * gin(s('C07') + 0.3), color: C.i, font: F.serif });
  }

  function shotWrite() {
    const a = B.win(s('G01'), s('C08') - 0.2); if (a <= 0) return;
    const t1 = cue('G01', '再做两步'), t2 = t1 + 0.8;
    const P = PERM.map(c => [0, 1, 2, 3, 4].map(j => j === c ? 1 : 0)), I = [0, 1, 2, 3, 4].map(i => [0, 1, 2, 3, 4].map(j => i === j ? 1 : 0));
    const S0 = P.map((r, i) => [...r, ...I[i]]);
    const swap = (M, a1, b1) => { const N = M.map(r => r.slice()); [N[a1], N[b1]] = [N[b1], N[a1]]; return N; };
    const S1 = swap(S0, 0, 2), S2 = swap(S1, 3, 4);
    K.steps([S0, S1, S2], [0, t1, t2], [null, [[0, 'r₁ ↔ r₃']], [[3, 'r₄ ↔ r₅']]], { x: DX + 40, y: DY - 120, px: 28, bar: 5, a, cw: 46, rh: 46 });
    ctag('[P | I] → [I | P]：两步', DX + 40, DY + 70, { px: 32, a: a * gin(t2 + 0.5), color: OK });
    const gG = a * gin(s('G02'));
    B.card(DX + 40, DY + 180, 760, 76, gG * 0.95, C.gpt);
    ctag('评分点：写一句“经验证 PP = I”', DX + 40, DY + 180, { px: 30, a: gG, color: C.gpt });
    B.stamp(DX + 360, DY + 160, true, prog(B.t, cue('G02', '单独给分'), cue('G02', '单独给分') + 0.5), gG, '+分');
  }

  function shotStamps() {
    const a = B.win(s('C08'), s('C10') - 0.2); if (a <= 0) return;
    [['换行 rᵢ ↔ rⱼ', '同一枚', '交换两行'], ['倍乘 × k', '× 1/k', '某一行乘k'], ['倍加 + ℓ rⱼ', '− ℓ rⱼ', '某一行加上']].forEach(([f, b, w], k) => {
      const x = DX - 300 + k * 300, y = DY - 60, t0 = cue('C08', w), g = a * gin(t0 - 0.3);
      const fl = prog(B.t, t0 + 0.6, t0 + 1.2), sx = Math.abs(Math.cos(Math.PI * fl)), back = fl > 0.5;
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.02, sx), 1);
      ctx.globalAlpha = g; ctx.strokeStyle = back ? OK : C.peri; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 96, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-x, -y);
      ctag(back ? b : f, x, y, { px: 30, a: g, color: back ? OK : C.peri, font: F.serif }); ctx.restore();
      ctag(back ? '逆' : '', x, y - 140, { px: 26, a: g, color: OK });
    });
    const g9 = a * gin(cue('C09', '撤销这个操作'));
    ctag('逆 = 撤销这个操作', DX, DY + 210, { px: 46, a: g9, color: C.peri, font: F.serif });
    B.burst(DX, DY + 210, cue('C09', '撤销这个操作') + 0.2, C.peri, { r1: 280 });
  }

  function shotOutro() {
    const a = B.win(s('C10'), 1e9); if (a <= 0) return;
    const items = [['末行定生死', '末行定生死'], ['系数就是解', '系数就是解'], ['自由变量 ⇏ 有解', '自由变量不保证'], ['从哪边乘就从哪边消', '矩阵从哪边']];
    items.forEach(([tx, w], k) => {
      const t0 = cue('C10', w), u = outBack(prog(B.t, t0 - 0.2, t0 + 0.4), 1.6); if (u <= 0) return;
      const ang = (k - 1.5) * 0.16, x = DX + Math.sin(ang) * 520 * u, y = DY + 360 - Math.cos(ang) * 470;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); B.card(0, 0, 260, 300, a, [C.peri, C.i, C.free, C.j][k]);
      ctag(`${k + 1}`, 0, -100, { px: 40, a, color: [C.peri, C.i, C.free, C.j][k], font: F.serif });
      ctag(tx, 0, 10, { px: 26, a, color: C.ink }); ctx.restore();
    });
    ctag('本集四张套路卡', DX, DY - 360, { px: 34, a: a * gin(s('C10') + 0.2), color: C.peri });
    const gn = a * gin(s('D03'));
    K.pill('下一集 · LU 分解（7 / 7）', DX, DY + 300, C.i, gn, 30);
    K.redStamp('初等矩阵 = 操作印章', DX + 240, DY + 200, prog(B.t, cue('C11', '刻一枚印章'), cue('C11', '刻一枚印章') + 0.5), a * gin(cue('C11', '刻一枚印章')), C.peri, 36);
  }

  function draw(t) {
    B.frame(t, () => {
      shotPerm(); shotCycle(); shotWrite(); shotStamps(); shotOutro();
      B.paper(EX, 'y2425_q3', { t0: s('C01') + 0.2, dock: s('D01') + 0.2, out: s('C08') - 0.4 });
    });
  }
  return { TL, draw };
}
