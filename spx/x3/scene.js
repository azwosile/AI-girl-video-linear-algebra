// 特别篇 · 期中速成 x3：行列式。
// 分镜：四条公式上墙 → 秒杀四连（COMBO 计数）：|A adjA|、det(−2A⁻¹)（立方体三向拉伸 + 翻面）、det(A−2I)（行成比例）、
//       A₂₁+A₂₂+2A₂₃（偷梁换柱：抽屉换行）→ 18–19 Q5：按第一列展开（十字划掉）→ |adj A| → 换第一列
//       → 20–21 Q4：范德蒙德因子逐个点亮 → 换第三行 → 套路卡⑥⑦。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, arrow, rgba, fmtNum, load3D } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_proud', 'ds_think', 'ds_shock', 'ds_happy', 'gpt_point', 'gpt_explain'] };

export async function setup(R) {
  const EX = await loadExam(['y2324_f1', 'y2223_f1', 'y2425_f3', 'y2324_f4', 'y2425_f2', 'y1819_q5', 'y2021_q4', 'y1718_q4', 'y2324_q7']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '行列式', hi: 1, en: 'DETERMINANTS',
    titleEnd: () => B.L('C02').s + 0.5,
    pre: { C03: 0.8, C05: 0.8, C09: 0.8, C12: 0.8, C16: 1.0, C21: 0.6, C23: 1.0, C26: 0.6, C27b: 1.0, C27f: 0.4, C27j: 1.0, C28: 0.8 },
    post: { C02: 1.0, C04: 1.0, C06: 1.6, C07: 1.0, C11: 1.0, C14: 1.2, C15: 1.0, C18: 0.6, C19: 0.8, C20: 1.0, C22: 1.0, C25: 1.0, C27: 1.0, C27b: 1.0, C27c: 0.8, C27d: 1.4, C27e: 1.2, D06a: 0.6, C27f: 1.0, C27g: 1.0, C27h: 1.4, C27i: 1.4, G03b: 1.0, C27j: 0.8, C27k: 1.4, C27l: 1.2, C27m: 1.2, C28: 1.2 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const hit = [cue('C04', '等于十六'), cue('C07', '等于负四'), cue('C11', '行列式直接'), cue('C15', '等于负十八')];

  TL.sfx('swoosh_in', 0.3, 0.45);
  ['w1', 'w2', 'w3', 'w4'].forEach((_, i) => TL.sfx('pop', [cue('C02', 'k乘A'), cue('C02', 'A逆的'), cue('C02', '乘积的'), cue('C02', 'A乘A的伴随')][i], 0.25));
  [['C03', 0.2], ['C05', 0.2], ['C09', 0.2], ['C12', 0.2], ['C16', 0.2], ['C23', 0.2]].forEach(([id, d]) => { TL.sfx('whoosh', s(id) + d, 0.3); TL.sfx('stamp', s(id) + d + 2.4, 0.3); });
  hit.forEach(x => { TL.sfx('impact', x, 0.35); TL.sfx('ding_hi', x + 0.1, 0.3); });
  [0, 1, 2].forEach(i => TL.sfx('warp', cue('C06', '三个方向') + 0.4 + i * 0.9, 0.25)); TL.sfx('zap', cue('C06', '翻一个面'), 0.3);
  TL.sfx('buzz', s('D03') + 0.3, 0.22); TL.sfx('sting', s('D04'), 0.3);
  TL.sfx('swoosh_soft', cue('C14', '抽出来'), 0.35); TL.sfx('slam', cue('C14', '换成系数') + 0.6, 0.3);
  TL.sfx('pop', s('C17') + 1.0, 0.3); TL.sfx('pop', s('C18') + 0.4, 0.3); TL.sfx('ding_hi', s('C19') + 0.5, 0.35); TL.sfx('ding_hi', cue('C20', '一千七百'), 0.3);
  TL.sfx('swoosh_soft', cue('C21', '换掉第一列'), 0.35); TL.sfx('slam', cue('C21', '换掉第一列') + 1.0, 0.3); TL.sfx('ding_hi', cue('C22', '等于六'), 0.35);
  for (let i = 0; i < 6; i++) TL.sfx('tick', cue('C24', '二减一') + i * 0.75, 0.25);
  TL.sfx('ding_hi', cue('C25', '等于负四十八'), 0.35); TL.sfx('slam', s('C26') + 3.0, 0.3); TL.sfx('ding_hi', cue('C27', '等于十二'), 0.35);
  TL.sfx('bell_soft', s('C28'), 0.35); TL.sfx('shimmer', s('D07'), 0.35);
  // 扩写二 sfx
  TL.sfx('whoosh', s('C27b') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C27c', '先交换') + 0.5, 0.3); TL.sfx('pluck', cue('C27c', '变号'), 0.3);
  ['第四行减第一行', '再减第二行', '最后加第三行'].forEach(p => TL.sfx('pop', cue('C27d', p) + 0.6, 0.3));
  TL.sfx('ding_hi', s('C27e') + 0.4, 0.3); TL.sfx('impact', cue('C27e', '等于十'), 0.3); TL.sfx('sting', s('D06a') + 0.3, 0.25);
  TL.sfx('buzz', s('C27f') + 0.2, 0.25); TL.sfx('slam', s('C27f') + 0.4, 0.3); TL.sfx('swoosh_soft', s('C27g') + 0.3, 0.3);
  ['剩下r四', '剩下二倍', '剩下r三'].forEach(p => TL.sfx('pop', cue('C27h', p), 0.3)); TL.sfx('tick', cue('C27i', '换两次'), 0.3);
  TL.sfx('impact', cue('C27i', '等于四十'), 0.35); TL.sfx('stamp', s('G03b') + 0.3, 0.35);
  TL.sfx('whoosh', s('C27j') + 0.2, 0.3); TL.sfx('pop', cue('C27k', '第二行减第一行') + 0.6, 0.3); TL.sfx('pop', cue('C27k', '再减三倍') + 0.6, 0.3);
  TL.sfx('ding_hi', cue('C27k', '行列式等于'), 0.3); TL.sfx('stamp', cue('C27k', '所以非奇异'), 0.35);
  ['移项', '提出A', '两边除以二'].forEach(p => TL.sfx('tick', cue('C27l', p), 0.3)); TL.sfx('impact', cue('C27m', '而且A的逆') + 0.3, 0.3); TL.sfx('shimmer', s('D06b'), 0.3);

  // ── 抽屉换行 / 换列：old 矩阵，第 k 行（或列）抽出，换成 nv；s 0..1 ──
  const drawer = (x, y, rows, k, nv, sv, a, { px = 44, col = false, hiNew = C.peri, cell = null } = {}) => {
    const M = B.mat(x, y, rows, { px, a, cell: (i, j) => ((col ? j : i) === k ? { a: 0 } : (cell ? cell(i, j) : null)) });
    const n = col ? rows.length : rows[0].length, out = smoother(Math.min(1, sv * 2)), inn = smoother(Math.max(0, sv * 2 - 1));
    ctx.save(); ctx.font = F.sans(px, 500); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let q = 0; q < n; q++) {
      const [cx, cy] = col ? M.cell(q, k) : M.cell(k, q), ov = col ? rows[q][k] : rows[k][q];
      const dO = out * 380, dI = (1 - inn) * -380;
      ctx.globalAlpha = a * (1 - out); ctx.fillStyle = C.inkMid; ctx.fillText(fmtNum(ov), col ? cx : cx + dO, col ? cy + dO : cy);
      ctx.globalAlpha = a * inn; ctx.fillStyle = hiNew; ctx.fillText(fmtNum(nv[q]), col ? cx : cx + dI, col ? cy + dI : cy);
    }
    ctx.restore();
    if (inn > 0) { const p0 = col ? M.cell(0, k) : M.cell(k, 0), p1 = col ? M.cell(rows.length - 1, k) : M.cell(k, n - 1); ctx.save(); ctx.globalAlpha = a * inn * 0.18; ctx.fillStyle = hiNew; const pad = px * 0.7; ctx.fillRect(p0[0] - pad, p0[1] - pad, p1[0] - p0[0] + 2 * pad, p1[1] - p0[1] + 2 * pad); ctx.restore(); }
    return M;
  };

  // ════ 公式墙 ════
  function shotWall() {
    const a = B.win(s('C02') - 0.2, s('C03') + 0.2); if (a <= 0) return;
    const ts = [cue('C02', 'k乘A'), cue('C02', 'A逆的'), cue('C02', '乘积的'), cue('C02', 'A乘A的伴随')];
    ['w1', 'w2', 'w3', 'w4'].forEach((k, i) => {
      const x = DX + (i % 2 ? 210 : -210), y = DY + (i < 2 ? -110 : 110), g = a * gin(ts[i]);
      B.tcard(k, x, y, 400, 170, g, [C.peri, C.j, C.i, C.k][i], 40);
      B.burst(x, y, ts[i] + 0.1, [C.peri, C.j, C.i, C.k][i], { r1: 140, n: 12 });
    });
  }

  // ════ 秒杀 ════
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3 });
  function shotIntro(D) {
    const a = B.win(0.8, s('C02') - 0.1); if (a <= 0) return;
    P3.reset(); const V = B.show3D(P3, D, a, { el: 24, az: -40 + B.t * 12, dist: 13, axesA: 0.6, floorA: 0.3 });
    const k = lerp(0.6, 1.4, 0.5 + 0.5 * Math.sin(B.t * 0.9)), u = 1.1;
    const P = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]].map(q => V.pr([q[0] * u * k, q[1] * u, q[2] * u]));
    ctx.save(); ctx.globalAlpha = a * 0.2; ctx.fillStyle = C.i;
    for (const f of [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]]) { ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(...P[q]) : ctx.moveTo(...P[q])); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = a * 0.8; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5;
    for (const [p, q] of [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]]) { ctx.beginPath(); ctx.moveTo(...P[p]); ctx.lineTo(...P[q]); ctx.stroke(); }
    ctx.restore();
    ctag(`det = 体积缩放 = ${(k).toFixed(2)}`, DX, DY + 330, { px: 36, a, color: C.peri, font: F.serif });
  }
  function shotF1() {
    const a = B.win(s('C03'), s('C05') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C03', '求A乘') - 0.3); if (A <= 0) return;
    B.qhead('秒杀 ① · 2023–2024 填空 1(1)', A);
    texAt('f1', DX, DY - 250, 46, { alpha: A * gin(s('C04') + 0.4) });
    const I4 = [[2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 2, 0], [0, 0, 0, 2]];
    B.mat(DX, DY - 30, I4, { px: 44, a: A * gin(s('C04') + 1.4), cell: (i, j) => i === j ? { col: C.peri, a: gin(cue('C04', '四阶') + i * 0.3) } : { a: 0.35 } });
    B.answer('f1b', DX, DY + 190, 46, A * gin(hit[0]), { col: OK }); B.burst(DX, DY + 190, hit[0], OK, { r1: 280 });
    const g = A * gin(s('G01'));
    B.xcard('2022–2023：3 阶 → 2³ = 8', DX, DY + 330, 520, 70, g * (1 - gin(s('C01a'))), C.gpt, 30);
  }
  function shotF2(D) {
    const a = B.win(s('C05'), s('C09') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C05', '求负二倍') - 0.3); if (A <= 0) return;
    B.qhead('秒杀 ② · 2024–2025 填空 1(3)', A * (1 - B.win(s('C06'), e('C06'))));
    const cube = A * B.win(s('C06'), e('C06') + 1.2);
    if (cube > 0) {
      const t0 = cue('C06', '三个方向') + 0.4, sc = [0, 1, 2].map(i => lerp(1, 2, smoother(prog(B.t, t0 + i * 0.9, t0 + i * 0.9 + 0.7))));
      const flip = smoother(prog(B.t, cue('C06', '翻一个面'), cue('C06', '翻一个面') + 0.8)), fz = lerp(1, -1, flip);
      P3.reset();
      const V = B.show3D(P3, D, cube, { el: 24, az: -40 + B.t * 3, dist: 14, axesA: 0.6, floorA: 0.3 });
      const u = 0.9, vx = (i, j, k) => [i * u * sc[0], j * u * sc[1], k * u * sc[2] * fz];
      const P = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]].map(q => V.pr(vx(...q)));
      const faces = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
      ctx.save(); ctx.globalAlpha = cube * 0.2; ctx.fillStyle = flip > 0.5 ? C.free : C.i;
      for (const f of faces) { ctx.beginPath(); f.forEach((q, i) => i ? ctx.lineTo(...P[q]) : ctx.moveTo(...P[q])); ctx.closePath(); ctx.fill(); }
      ctx.globalAlpha = cube * 0.8; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5;
      for (const [p, q] of [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]]) { ctx.beginPath(); ctx.moveTo(...P[p]); ctx.lineTo(...P[q]); ctx.stroke(); }
      ctx.restore();
      const n = sc.filter(v => v > 1.5).length, vol = sc[0] * sc[1] * sc[2] * fz;
      ctag(`体积 ×${vol.toFixed(1).replace('-', '−')}`, DX, DY - 360, { px: 44, a: cube, color: flip > 0.5 ? C.free : C.ink, font: F.serif });
      ctag(['', '×2', '×2 ×2', '×2 ×2 ×2'][n] + (flip > 0.5 ? '，再变号' : ''), DX, DY + 330, { px: 34, a: cube, color: C.peri });
      B.flash(cue('C06', '翻一个面') + 0.8, 0.25);
    }
    const alg = A * gin(s('C07') - 0.3);
    texAt('f3', DX, DY - 120, 48, { alpha: alg, reveal: rv(s('C07'), 3) });
    B.answer('f3', DX, DY - 120, 48, alg * gin(hit[1]), { col: OK }); B.burst(DX + 250, DY - 120, hit[1], OK, { r1: 220 });
    const w = A * gin(s('D03') + 0.3);
    texAt('f3w', DX, DY + 60, 44, { alpha: w * 0.8 }); B.cross(DX, DY + 60, gin(s('D03') + 1.2, 0.4), w, 50);
    B.xcard('k 要乘 n 次：每一行都乘了一遍', DX, DY + 220, 620, 80, A * gin(s('C08') + 0.4) * (1 - gin(s('C08a'))), C.free, 32);
  }
  function shotF3() {
    const a = B.win(s('C09'), s('C12') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C09', 'A的三行') - 0.3); if (A <= 0) return;
    B.qhead('秒杀 ③ · 2023–2024 填空 1(4)', A);
    const M0 = [[1, -2, 2], [-2, -2, 4], [2, 4, -2]], M1 = [[-1, -2, 2], [-2, -4, 4], [2, 4, -4]];
    const sub = smooth(prog(B.t, s('C10') + 0.4, s('C10') + 1.6));
    ctag(sub > 0.5 ? 'A − 2I' : 'A', DX - 330, DY - 80, { px: 40, a: A, color: sub > 0.5 ? C.peri : C.ink, font: F.serif });
    const M = B.mat(DX, DY - 80, sub > 0.5 ? M1 : M0, { px: 52, a: A, cell: (i, j) => i === j ? { col: C.peri, a: Math.abs(sub - 0.5) * 2 } : null });
    const gd = A * gin(s('D04'));
    if (gd > 0) {
      [[1, '×2', C.j], [2, '×(−2)', C.i]].forEach(([r, t, c], k) => {
        const g = gd * gin(s('D04') + k * 1.0), [x0, y0] = M.cell(0, 2), [x1, y1] = M.cell(r, 2);
        ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + 70, y0); ctx.quadraticCurveTo(x0 + 140 + k * 60, (y0 + y1) / 2, x1 + 70, y1); ctx.stroke(); ctx.restore();
        ctag(t, x0 + 170 + k * 60, (y0 + y1) / 2, { px: 32, a: g, color: c });
        ctx.save(); ctx.globalAlpha = g * 0.15; ctx.fillStyle = c; ctx.fillRect(M.cell(r, 0)[0] - 50, y1 - 32, M.cell(r, 2)[0] - M.cell(r, 0)[0] + 100, 64); ctx.restore();
      });
    }
    const g11 = A * gin(hit[2]);
    B.xcard('两行成比例 ⇒ det = 0', DX, DY + 170, 500, 80, g11, OK, 36); B.burst(DX, DY + 170, hit[2], OK, { r1: 260 });
    ctag('三根行向量挤在一条线上，撑不出体积', DX, DY + 280, { px: 30, a: A * gin(cue('C11', '三根行向量')), color: C.inkMid });
  }
  function shotF4() {
    const a = B.win(s('C12'), s('C16') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C12', '同一个A') - 0.3); if (A <= 0) return;
    B.qhead('秒杀 ④ · 2024–2025 填空 1(2)', A * (1 - gin(s('G02'))));
    const M0 = [[1, -2, 2], [-2, -2, 4], [2, 4, -2]];
    const p = A * (1 - gin(s('G02') - 0.2));
    texAt('f4e', DX, DY - 300, 40, { alpha: p * gin(s('C13') + 1.0) });
    B.ghalo('f4e', DX, DY - 300, 40, 'c', p * B.win(cue('C13', '而第二行'), s('C14')));
    const sv = prog(B.t, cue('C14', '抽出来'), cue('C14', '换成系数') + 1.0);
    drawer(DX, DY - 80, M0, 1, [1, 1, 2], sv, p * gin(s('C12') + 0.5), { px: 52, cell: (i) => ({ a: 1 }) });
    ctag('(1, 1, 2)', DX - 330, DY - 80, { px: 30, a: p * B.win(cue('C14', '换成系数') - 0.5, cue('C14', '换成系数') + 1.0), color: C.peri });
    texAt('f4', DX, DY + 170, 40, { alpha: p * gin(s('C15')), reveal: rv(s('C15'), 2) });
    B.answer('f4', DX, DY + 170, 40, p * gin(hit[3]), { col: OK }); B.burst(DX + 300, DY + 170, hit[3], OK, { r1: 220 });
    const g = A * gin(s('G02'));
    if (g > 0) ['16', '−4', '0', '−18'].forEach((t, i) => { const x = DX - 330 + i * 220; B.card(x, DY, 180, 140, g * gin(s('G02') + i * 0.25), OK); ctag(t, x, DY, { px: 60, a: g * gin(s('G02') + i * 0.25), color: OK, font: F.serif }); });
  }

  // ════ 18–19 Q5 ════
  const Q5 = [[0, 2, 3, 0], [0, 4, 5, 0], [0, 1, 0, 3], [2, 0, 1, 3]];
  function shotQ5() {
    const a = B.win(s('C16'), s('C23') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C16', '第一列只有') - 0.3); if (A <= 0) return;
    B.qhead('2018–2019 期中 · 第 5 题', A);
    const pa = A * (1 - gin(s('C21') - 0.2));
    if (pa > 0) {
      const cross = gin(s('C17') + 1.5), hl = gin(cue('C16', '第一列只有'));
      const M = B.mat(DX - 230, DY - 160, Q5, { px: 44, a: pa, cell: (i, j) => { if (i === 3 && j === 0) return { col: C.peri }; if (j === 0) return { col: C.j, a: lerp(1, 0.3, cross) }; if (i === 3) return { a: lerp(1, 0.3, cross) }; return null; } });
      if (hl > 0) { const [x, y0] = M.cell(0, 0), y1 = M.cell(3, 0)[1]; ctx.save(); ctx.globalAlpha = pa * hl * 0.15; ctx.fillStyle = C.j; ctx.fillRect(x - 34, y0 - 34, 68, y1 - y0 + 68); ctx.restore(); }
      if (cross > 0) { const [x, y] = M.cell(3, 0); B.line2([x - 30, y], [M.cell(3, 3)[0] + 30, y], C.free, pa * cross, 4); B.line2([x, M.cell(0, 0)[1] - 30], [x, y + 30], C.free, pa * cross, 4); B.burst(x, y, s('C17') + 1.5, C.peri, { r1: 90, n: 10 }); }
      ctag('(−1)⁴⁺¹ = −1', DX - 230, DY + 20, { px: 32, a: pa * gin(cue('C17', '它的符号')), color: C.peri });
      texAt('q5a', DX + 170, DY - 160, 34, { alpha: pa * gin(s('C18')) });
      texAt('q5b', DX + 170, DY - 40, 38, { alpha: pa * gin(s('C19')) });
      B.answer('q5b', DX + 170, DY - 40, 38, pa * gin(s('C19') + 0.5), { col: OK }); B.burst(DX + 250, DY - 40, s('C19') + 0.5, OK, { r1: 200 });
      texAt('adj', DX, DY + 160, 34, { alpha: pa * gin(s('C20')), reveal: rv(s('C20') + 0.3, 4) });
      B.ghalo('adj', DX, DY + 160, 34, null, pa * gin(cue('C20', '一千七百')), OK);
    }
    const pb = A * gin(s('C21') - 0.2);
    if (pb > 0) {
      const sv = prog(B.t, cue('C21', '换掉第一列'), cue('C21', '换掉第一列') + 2.0);
      const M = drawer(DX, DY - 110, Q5, 0, [1, 1, -1, 2], sv, pb, { px: 46, col: true, cell: (i, j) => (j === 3 && gin(s('C22')) > 0.5 && (i === 2 || i === 3)) ? { col: C.i } : null });
      ctag('第一列 → (1, 1, −1, 2)', DX, DY - 330, { px: 32, a: pb * gin(cue('C21', '换掉第一列')), color: C.peri });
      if (gin(s('C22')) > 0) { const [x, y0] = M.cell(0, 3), y1 = M.cell(3, 3)[1]; ctx.save(); ctx.globalAlpha = pb * gin(s('C22')) * 0.16; ctx.fillStyle = C.i; ctx.fillRect(x - 36, y0 - 34, 72, y1 - y0 + 68); ctx.restore(); }
      B.answer('q5c', DX, DY + 180, 40, pb * gin(s('C22') + 0.6), { col: OK }); B.burst(DX + 300, DY + 180, cue('C22', '等于六'), OK, { r1: 200 });
      ctag('行和列都能换！', DX, DY + 320, { px: 36, a: pb * gin(s('D06')), color: C.ds, font: F.serif });
    }
  }

  // ════ 20–21 Q4 ════
  const VD = [[1, 1, 1, 1], [1, 2, 4, 8], [1, 3, 9, 27], [1, -1, 1, -1]], xs = [1, 2, 3, -1];
  function shotQ4() {
    const a = B.win(s('C23'), s('C27b') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C23', '仔细看') - 0.3); if (A <= 0) return;
    B.qhead('2020–2021 期中 · 第 4 题', A);
    const p1 = A * (1 - gin(s('C26') - 0.2));
    if (p1 > 0) {
      const M = B.mat(DX - 150, DY - 170, VD, { px: 42, a: p1 });
      ['1', 'x', 'x²', 'x³'].forEach((h, j) => ctag(h, M.cell(0, j)[0], DY - 300, { px: 28, a: p1 * gin(cue('C23', '每一行都是')), color: C.inkMid }));
      xs.forEach((x, i) => ctag(`x = ${String(x).replace('-', '−')}`, DX + 170, M.cell(i, 0)[1], { px: 30, a: p1 * gin(cue('C23', 'x分别取') + i * 0.3), color: C.peri }));
      const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], t0 = cue('C24', '二减一');
      let prod = 1, shown = 0;
      pairs.forEach(([i, j], k) => {
        const g = p1 * gin(t0 + k * 0.75), v = xs[j] - xs[i]; if (g > 0.5) { prod *= v; shown++; }
        const x = DX - 375 + k * 150, y = DY + 90;
        B.card(x, y, 130, 70, g, v < 0 ? C.free : C.j); ctag(`${String(xs[j]).replace('-', '−')}−${String(xs[i]).replace('-', '−')}`.replace('−−', '+'), x, y - 12, { px: 22, a: g, color: C.inkMid }); ctag(fmtNum(v), x, y + 16, { px: 30, a: g, color: v < 0 ? C.free : C.j });
        B.burst(x, y, t0 + k * 0.75, v < 0 ? C.free : C.j, { r1: 60, n: 8 });
      });
      ctag(`乘积 = ${fmtNum(prod)}`, DX, DY + 200, { px: 40, a: p1 * gin(t0), color: shown === 6 ? OK : C.ink, font: F.serif });
      B.answer('vand', DX, DY + 310, 38, p1 * gin(cue('C25', '等于负四十八')), { col: OK });
      ctag('认出来 = 10 秒', DX - 280, DY + 200, { px: 28, a: p1 * gin(s('G03')), color: C.gpt });
    }
    const p2 = A * gin(s('C26') - 0.2);
    if (p2 > 0) {
      const sv = prog(B.t, s('C26') + 2.0, s('C26') + 3.5);
      drawer(DX, DY - 140, VD, 2, [0, 1, 1, 1], sv, p2, { px: 44 });
      ctag('第三行 → (0, 1, 1, 1)', DX, DY - 330, { px: 32, a: p2, color: C.peri });
      B.answer('vand2', DX, DY + 170, 38, p2 * gin(s('C27') + 0.3), { col: OK }); B.burst(DX + 300, DY + 170, cue('C27', '等于十二'), OK, { r1: 200 });
    }
  }

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
        ctag('det B = 10 + 10 = 20 ?', DX, DY + 215, { px: 32, a: gb * (1 - gin(s('C27g'))), color: C.ds, font: F.serif });
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

  function shotOutro() {
    const a = B.win(s('C28'), 1e9); if (a <= 0) return;
    const RC = [['⑥', ['数乘乘 n 次：det(kA) = kⁿ det A', '伴随：A · adj A = |A| I'], C.peri, s('C28')], ['⑦', ['余子式组合 = 把那一行（列）', '换成系数，再算行列式'], C.j, cue('C28', '套路卡七')]];
    RC.forEach(([n, ls, col, t0], i) => {
      const g = a * gin(t0), y = DY - 130 + i * 230;
      B.card(DX, y, 860, 190, g, col); ctag(`套路卡 ${n}`, DX - 320, y - 55, { px: 30, a: g, color: col, font: F.serif });
      ls.forEach((l, k) => ctag(l, DX - 380, y - 5 + k * 50, { px: 34, a: g, color: C.ink, align: 'left' }));
      B.burst(DX + 380, y - 60, t0 + 0.2, col, { r1: 100, n: 12 });
    });
    B.xcard('下一段 → 子空间', DX, DY + 360, 420, 70, a * gin(s('D07')), C.ds, 30);
    B.combo(4, DX + 470, DY - 330, s('C28') - 1, a * 0.5, 'COMBO');
  }

  function combo() {
    const n = hit.filter(x => B.t >= x).length, last = hit[Math.max(0, n - 1)];
    const a = B.win(hit[0], s('C16') - 0.3);
    B.combo(n, DX + 470, DY - 330, last, a, '秒杀');
  }

  function papers() {
    B.paper(EX, 'y2324_f1', { t0: s('C03') + 0.2, dock: cue('C03', '求A乘') - 0.5, out: s('C05') - 0.4 });
    B.paper(EX, 'y2223_f1', { t0: s('G01') + 0.1, dock: s('G01') + 3.0, out: s('C05') - 0.4, side: { y: 260 } });
    B.paper(EX, 'y2425_f3', { t0: s('C05') + 0.2, dock: cue('C05', '求负二倍') - 0.5, out: s('C09') - 0.4 });
    B.paper(EX, 'y2324_f4', { t0: s('C09') + 0.2, dock: cue('C09', 'A的三行') - 0.5, out: s('C12') - 0.4 });
    B.paper(EX, 'y2425_f2', { t0: s('C12') + 0.2, dock: cue('C12', '同一个A') - 0.5, out: s('G02') - 0.2 });
    B.paper(EX, 'y1819_q5', { t0: s('C16') + 0.2, dock: cue('C16', '第一列只有') - 0.5, out: s('C23') - 0.4 });
    B.paper(EX, 'y2021_q4', { t0: s('C23') + 0.2, dock: cue('C23', '仔细看') - 0.5, out: s('C27b') - 0.3 });
    B.paper(EX, 'y1718_q4', { t0: s('C27b') + 0.2, dock: cue('C27b', '第一问') - 0.3, out: s('C27j') - 0.3 });
    B.paper(EX, 'y2324_q7', { t0: s('C27j') + 0.2, dock: cue('C27j', '求行列式') - 0.3, out: s('C28') - 0.3 });
  }

  // ── 扩写：逐步算式小卡 ──
  const XC = [
    ['C02a', DY + 300, ['kA：每行乘 k → kⁿ', 'AB：两次缩放 → 相乘'], C.i],
    ['C01a', DY + 300, ['|adj A| = |A|ⁿ⁻¹'], C.peri],
    ['C08a', DY + 230, ['4 阶：det(3A) = 3⁴ × 2 = 162  （不是 6）'], C.free],
    ['C11a', DY + 300, ['R₂ − 2R₁ = (0, 0, 0)  ⇒  det = 0'], C.i],
    ['C14a', DY + 300, ['A₂ⱼ 只看第 1、3 行 → 换第 2 行不影响'], C.j],
    ['C15a', DY + 300, ['1·(−10) + 2·(−6) + 2·2 = −18'], C.i],
    ['C18a', DY + 300, ['(+1)·3·|2 3; 4 5| = 3·(−2) = −6'], C.i],
    ['G20a', DY + 300, ['除以 |A| 之前：|A| = 12 ≠ 0  ✓'], OK],
    ['C22a', DY + 300, ['3·(−1)·(−2) + 3·(+1)·0 = 6'], C.i],
    ['C24a', DY + 300, ['xᵢ = xⱼ ⇒ 两行相同 ⇒ det = 0 ⇒ (xⱼ − xᵢ) 是因子'], C.j],
    ['C27a', DY + 300, ['1·(−2) − 3·0 + 7·2 = 12'], C.i],
  ];
  function extras() {
    for (const [id, y, rows, col] of XC) {
      const g = B.win(s(id), e(id) + 0.15); if (g <= 0) continue;
      const w = Math.max(...rows.map(r => [...r].reduce((q, ch) => q + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 30 : 16), 0))) + 80, h = rows.length * 44 + 30;
      B.card(DX, y, Math.min(880, w), h, g * 0.95, col);
      rows.forEach((r, i) => ctag(r, DX, y - (rows.length - 1) * 22 + i * 44, { px: 29, a: g * gin(s(id) + 0.3 + i * 1.4), color: col === OK ? OK : C.ink, font: F.serif }));
    }
  }

  function draw(t) {
    B.frame(t, D => { shotIntro(D); shotWall(); shotF1(); shotF2(D); shotF3(); shotF4(); shotQ5(); shotQ4(); shotR2(); shotOutro(); combo(); papers(); extras(); });
  }
  return { TL, draw };
}
