// 特别篇 · 期中速成 x7：RREF 反推（2024–25 第 4 题）。
// 分镜：核心一句（小例：行变换前后 col₃ = col₁ + col₂ 不变）→ 原题 → 圈主元（主元环 + 自由列染色）
//       → 零空间：自由变量轮流取 1，向量逐格长出 → 行空间抄 U 的行 / 列空间用 A 的主元列（错误路线打叉）
//       → 特解读最后一列 + 通解 → 丝线：U 列 ↔ A 列，a₂、a₄ 沿线飞入，b 由 4、−6、3 三根线合成 → 回代 → 套路卡⑪。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, arrow, rgba, fmtNum } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_shock', 'ds_think', 'ds_proud', 'gpt_point', 'gpt_explain'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_q4', 'y2223_q2', 'y2021_q7', 'y2526_q4', 'y2324_n2']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: 'RREF 反推', hi: 1, en: 'READING THE RREF',
    titleEnd: () => B.L('C02').s + 0.3,
    pre: { C17t: 1.0, C17w: 0.6, C03: 1.0, C04: 0.4, C06: 0.6, C10: 0.6, C12: 0.8, C17a: 1.0, C17f: 0.9, C17j: 1.0, C17p: 0.6, C18: 0.8 },
    post: { C17t: 0.6, C17u: 1.6, C17v: 1.4, G03e: 1.2, C17w: 1.4, C17x: 1.4, D04e: 0.6, C02: 1.6, C05: 0.8, C07: 1.2, C09: 1.2, C11: 1.0, C13: 1.0, C14: 1.0, C16: 1.0, C17: 1.2, G03: 1.0, C17b: 0.8, C17d: 0.8, C17e: 1.0, C17g: 0.8, C17h: 0.8, C17i: 1.2, C17k: 0.9, C17l: 0.9, C17m: 1.1, C17n: 0.8, C17o: 1.3, C17p: 1.0, C17q: 1.0, C17r: 1.0, G03d: 0.8, C17s: 1.3, C18: 1.2 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;

  const U = [[1, 1, 0, 0, 0, 4], [0, 0, 1, 1, 0, -6], [0, 0, 0, 0, 1, 3], [0, 0, 0, 0, 0, 0]];
  const Acols = [[1, -1, -2, 0], [1, -1, -2, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 3, 3], [1, -1, 1, 3]];
  const piv = [[0, 0], [1, 2], [2, 4]], colCol = [C.i, C.free, C.j, C.free, C.k, C.peri];
  const tPiv = cue('C04', '第一、三、五列'), tFree = cue('C04', '第二、四列');
  const tT = { e1: cue('C12', 'e一、e二、e三'), a2: cue('C13', '拉线过去'), a4: cue('C14', '所以a四'), b: cue('C16', '所以b') };

  TL.sfx('swoosh_in', 0.3, 0.45);
  TL.sfx('buzz', s('D01') + 0.4, 0.2);
  TL.sfx('swoosh_soft', s('C02') + 1.6, 0.3); TL.sfx('ding_hi', cue('C02', 'A里也一模一样'), 0.3);
  TL.sfx('whoosh', s('C03') + 0.2, 0.3); TL.sfx('stamp', s('C03') + 2.6, 0.3);
  [0, 1, 2].forEach(i => TL.sfx('pop', tPiv + i * 0.35, 0.3)); TL.sfx('zap', tFree, 0.25);
  TL.sfx('sting', s('D02') + 0.6, 0.25);
  TL.sfx('tick', s('C06') + 1.0, 0.3); TL.sfx('ding_hi', cue('C07', '得到第一个'), 0.3); TL.sfx('ding_hi', cue('C07', '得到第二个'), 0.3);
  TL.sfx('swoosh_soft', s('C08') + 0.6, 0.3); TL.sfx('buzz', s('D03') + 0.4, 0.18); TL.sfx('crack', s('C09') + 0.3, 0.3); TL.sfx('slam', cue('C09', '要用A自己'), 0.3);
  TL.sfx('pluck', cue('C10', '直接读出'), 0.3); TL.sfx('ding_hi', s('C11') + 1.0, 0.3);
  TL.sfx('laser', tT.e1, 0.25); TL.sfx('laser', tT.e1 + 0.5, 0.25); TL.sfx('laser', tT.e1 + 1.0, 0.25);
  TL.sfx('whoosh', tT.a2, 0.3); TL.sfx('ding_hi', tT.a2 + 0.9, 0.3); TL.sfx('whoosh', tT.a4, 0.3); TL.sfx('ding_hi', tT.a4 + 0.9, 0.3);
  TL.sfx('buzz', s('D04') + 0.3, 0.18);
  [0, 1, 2].forEach(i => TL.sfx('laser', tT.b + i * 0.45, 0.25)); TL.sfx('impact', tT.b + 1.6, 0.3);
  [0, 1, 2, 3].forEach(i => TL.sfx('tick', cue('C17', ['四减六', '负四加零', '负八加零', '零减六'][i]), 0.3)); TL.sfx('ding_hi', cue('C17', 'b等于'), 0.35);
  TL.sfx('check', e('G03') - 0.6, 0.35); TL.sfx('bell_soft', s('C18'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);
  // 扩写三 sfx
  TL.sfx('whoosh', s('C17t') + 0.2, 0.3); ['第二行加两倍', '除以负六', '第一行加第二行'].forEach(p => TL.sfx('pop', cue('C17u', p) + 0.5, 0.3));
  TL.sfx('tick', cue('C17v', '令x三等于一'), 0.3); TL.sfx('tick', cue('C17v', '令x三等于零'), 0.3); TL.sfx('impact', s('G03e') + 0.3, 0.3);
  ['第二行减两倍', '第三行加第一行', '两行一加'].forEach(p => TL.sfx('pop', cue('C17w', p) + 0.5, 0.3)); TL.sfx('impact', cue('C17x', '取x三等于三'), 0.35);
  // 扩写段 sfx
  TL.sfx('whoosh', s('C17a') + 0.2, 0.3); TL.sfx('pop', s('C17b') + 0.6, 0.3); TL.sfx('ding_hi', cue('C17b', '轮流取一') + 1.0, 0.3);
  TL.sfx('laser', s('C17d') + 0.4, 0.25); TL.sfx('ding_hi', cue('C17d', '所以a三'), 0.3); TL.sfx('laser', s('C17e') + 0.3, 0.25); TL.sfx('impact', cue('C17e', '所以a四') + 0.2, 0.3);
  TL.sfx('whoosh', s('C17f') + 0.2, 0.3); TL.sfx('pop', cue('C17g', '令x四'), 0.3); TL.sfx('ding_hi', s('C17h') + 0.6, 0.3); TL.sfx('impact', s('C17i') + 0.4, 0.3);
  TL.sfx('slam', s('C17j') + 0.2, 0.35); TL.sfx('buzz', s('D04b') + 0.3, 0.18);
  TL.sfx('swoosh_soft', cue('C17k', '第二行减两倍') + 0.6, 0.3); TL.sfx('zap', cue('C17l', '整行清零'), 0.3); TL.sfx('pluck', s('G03c') + 0.4, 0.3);
  TL.sfx('swoosh_soft', cue('C17m', '第一行减三倍') + 0.4, 0.3); TL.sfx('pop', cue('C17n', '特解是'), 0.3); TL.sfx('impact', cue('C17o', '全部解') + 0.3, 0.3);
  TL.sfx('tick', s('C17p') + 0.3, 0.3); TL.sfx('tick', cue('C17p', '行空间'), 0.3); TL.sfx('tick', cue('C17p', '列空间'), 0.3);
  TL.sfx('crack', cue('C17q', '展开整理'), 0.3); TL.sfx('ding_hi', cue('C17r', '所以A转置'), 0.3); TL.sfx('check', s('G03d') + 1.0, 0.3);
  TL.sfx('laser', s('C17s') + 0.4, 0.25); TL.sfx('impact', cue('C17s', '沿着丝线') + 0.3, 0.3); TL.sfx('stamp', cue('C17s', '正好是a四'), 0.35); TL.sfx('shimmer', s('D04d'), 0.3);

  // ── 环 ──
  const ring = (x, y, r, col, a, s0) => { if (a <= 0 || s0 <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * smoother(Math.min(1, s0))); ctx.stroke(); ctx.restore(); };
  const vbox = (x0, y0, x1, y1, col, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.16; ctx.fillStyle = col; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.restore(); };

  // ════ 核心一句：小例 ════
  function shotKey() {
    const a = B.win(s('C02') - 0.2, s('C03') + 0.1); if (a <= 0) return;
    const A0 = [[1, 2, 3], [2, 1, 3]], U0 = [[1, 2, 3], [0, -3, -3]];
    const gA = a * gin(s('C02') + 0.4), op = smoother(prog(B.t, s('C02') + 1.6, s('C02') + 2.6));
    const M1 = B.mat(DX - 260, DY - 120, A0, { px: 48, a: gA });
    const M2 = B.mat(DX + 260, DY - 120, U0, { px: 48, a: gA * op });
    arrow(ctx, [DX - 110, DY - 120], [DX + 110, DY - 120], { color: C.peri, alpha: gA, grow: op, width: 5 });
    ctag('R₂ − 2R₁', DX, DY - 170, { px: 30, a: gA * op, color: C.peri });
    const gk = a * gin(cue('C02', 'U里第几列'));
    [[M1, 'A'], [M2, 'U']].forEach(([M, nm], k) => {
      const [x0, y0] = M.cell(0, 0), [x2, y1] = M.cell(1, 2);
      ctag('col₃ = col₁ + col₂', k ? DX + 260 : DX - 260, DY + 0, { px: 30, a: gk, color: OK, font: F.serif });
      vbox(M.cell(0, 2)[0] - 34, y0 - 34, M.cell(0, 2)[0] + 34, y1 + 34, OK, gk);
      ctag(nm, k ? DX + 260 : DX - 260, DY - 240, { px: 38, a: gA * (k ? op : 1), color: C.ink, font: F.serif });
    });
    B.xcard('行变换不改变列之间的线性关系', DX, DY + 130, 640, 80, a * gin(cue('C02', 'A里也一模一样')), OK, 34);
    ctag('Ux = 0 ⇔ Ax = 0（同解）', DX, DY + 250, { px: 34, a: a * gin(s('G01') + 0.4), color: C.gpt, font: F.serif });
  }

  // ════ 主体：U 板 ════
  const UX = DX, UY = DY - 210, UPX = 40;
  function Ucell(i, j) {
    const t = B.t;
    const isPiv = piv.some(([r, c]) => r === i && c === j);
    if (t > s('C12') - 0.3) return { col: j === 5 ? C.peri : colCol[j] === C.free ? C.free : colCol[j] };
    if (t > s('C10') - 0.3 && t < s('C12') - 0.3 && j === 5) return { col: C.peri };
    if (isPiv && t > tPiv) return { col: C.i };
    if ((j === 1 || j === 3) && t > tFree) return { col: C.free };
    return null;
  }
  function shotMain() {
    const a = B.win(s('C03'), s('C17a') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C03') + 3.4); if (A <= 0) return;
    B.qhead('2024–2025 期中 · 第 4 题', A * (1 - gin(s('C12') - 0.5)));
    const M = B.mat(UX, UY, U, { px: UPX, a: A, bar: 5, cell: Ucell });
    // 变量标签
    ['x₁', 'x₂', 'x₃', 'x₄', 'x₅', 'b'].forEach((v, j) => ctag(v, M.cell(0, j)[0], UY - 125, { px: 26, a: A * gin(tPiv - 0.6) * (1 - gin(s('C12') - 0.4)), color: j === 1 || j === 3 ? C.free : C.inkMid }));
    ctag('U = rref(A | b)', UX - 380, UY, { px: 28, a: A * gin(s('C12') - 0.4), color: C.inkMid, align: 'right' });
    piv.forEach(([r, c], k) => { const [x, y] = M.cell(r, c); ring(x, y, 28, C.i, A * (1 - gin(s('C12') - 0.4)), prog(B.t, tPiv + k * 0.35, tPiv + k * 0.35 + 0.5)); });
    [1, 3].forEach(j => { const [x, y0] = M.cell(0, j), y1 = M.cell(3, j)[1]; vbox(x - 30, y0 - 30, x + 30, y1 + 30, C.free, A * B.win(tFree, s('C06') + 0.5)); });
    ctag('自由变量 x₂、x₄', UX + 380, UY + 60, { px: 28, a: A * B.win(tFree + 0.4, s('C06') + 0.5), color: C.free });
    ctag('已知 a₁、a₃、a₅ = 主元列！', DX, DY + 20, { px: 36, a: A * B.win(s('D02') + 0.5, s('C06') - 0.2), color: C.i, font: F.serif });

    // (a) 零空间
    const pa = A * B.win(s('C06') - 0.2, s('C08') - 0.1);
    if (pa > 0) {
      const t1 = s('C06') + 1.0, t2 = cue('C07', '再令');
      ctag('x₂ = 1, x₄ = 0', DX - 200, DY - 10, { px: 32, a: pa * gin(t1), color: C.free });
      ctag('x₂ = 0, x₄ = 1', DX + 200, DY - 10, { px: 32, a: pa * gin(t2), color: C.free });
      texAt('n1', DX - 200, DY + 180, 34, { alpha: pa * gin(cue('C07', '得到第一个')), reveal: rv(cue('C06', '第一行') - 0.4, 6) });
      texAt('n2', DX + 200, DY + 180, 34, { alpha: pa * gin(t2 + 0.6) });
      B.burst(DX - 200, DY + 180, cue('C07', '得到第一个'), OK, { r1: 140 }); B.burst(DX + 200, DY + 180, cue('C07', '得到第二个'), OK, { r1: 140 });
      ctag('N(A) 的基', DX, DY + 180, { px: 30, a: pa * gin(cue('C07', '两个自由变量')), color: OK });
    }
    // 行空间 / 列空间
    const pr = A * B.win(s('C08') - 0.2, s('C10') - 0.1);
    if (pr > 0) {
      const tc = s('C08') + 0.6;
      [0, 1, 2].forEach(r => { const [x0, y] = M.cell(r, 0), x1 = M.cell(r, 4)[0]; vbox(x0 - 30, y - 24, x1 + 30, y + 24, OK, pr * gin(tc + r * 0.25)); });
      ['(1, 1, 0, 0, 0)', '(0, 0, 1, 1, 0)', '(0, 0, 0, 0, 1)'].forEach((t, r) => ctag(t, DX - 230, DY + 20 + r * 50, { px: 30, a: pr * gin(tc + 0.6 + r * 0.25), color: OK, font: F.serif }));
      ctag('行空间 R(Aᵀ) 的基', DX - 230, DY - 40, { px: 28, a: pr * gin(tc + 0.3), color: OK });
      const gX = pr * gin(s('D03') + 0.2);
      ctag('列空间 = U 的列？', DX + 230, DY - 40, { px: 28, a: gX, color: C.free });
      [0, 2, 4].forEach((j, k) => { const [x, y0] = M.cell(0, j), y1 = M.cell(3, j)[1]; vbox(x - 28, y0 - 28, x + 28, y1 + 28, C.free, gX * B.win(s('D03') + 0.4, s('C09') + 0.4)); });
      B.cross(DX + 230, DY - 40, gin(s('C09') + 0.3, 0.4), gX, 44);
      B.answer('col', DX + 230, DY + 80, 36, pr * gin(cue('C09', '要用A自己')), { col: OK });
      B.xcard('全卷最常见丢分点', DX + 230, DY + 190, 340, 64, pr * gin(cue('C09', '这是全卷')), C.free, 28);
    }
    // (b) 全部解
    const pb = A * B.win(s('C10') - 0.2, s('C12') - 0.3);
    if (pb > 0) {
      const tr = cue('C10', '直接读出');
      [[0, 0, 4], [1, 2, -6], [2, 4, 3]].forEach(([r, c, v], k) => { const p = smoother(prog(B.t, tr + k * 0.5, tr + k * 0.5 + 0.8)); if (p > 0 && p < 1) B.fly(M.cell(r, 5), [DX - 330 + 0 * k, DY + 70 + c * 34], p, C.peri, { txt: fmtNum(v).replace('-', '−'), px: 30 }); });
      texAt('xp', DX - 330, DY + 140, 30, { alpha: pb * gin(tr + 1.5) * (1 - gin(s('C11') + 0.2)) });
      ctag('特解 xₚ', DX - 330, DY + 0, { px: 28, a: pb * gin(tr) * (1 - gin(s('C11') + 0.2)), color: C.peri });
      texAt('gen', DX, DY + 150, 34, { alpha: pb * gin(s('C11') + 0.2), reveal: rv(s('C11') + 0.2, 4) });
      B.ghalo('gen', DX, DY + 150, 34, null, pb * gin(s('C11') + 3.0) * 0.8, OK);
      ctag('= 一张平移过的二维平面', DX, DY + 330, { px: 30, a: pb * gin(s('G02')), color: C.gpt });
    }
    // (c) 丝线
    const pc = A * gin(s('C12') - 0.3);
    if (pc > 0) {
      const AY = DY + 140, have = j => {
        if (j === 0 || j === 2 || j === 4) return 1;
        if (j === 1) return gin(tT.a2 + 0.9); if (j === 3) return gin(tT.a4 + 0.9); return gin(tT.b + 1.6);
      };
      const rowsA = [0, 1, 2, 3].map(i => Acols.map(c => c[i]));
      const MA = B.mat(UX, AY, rowsA, { px: UPX, a: pc, bar: 5, cell: (i, j) => { const h = have(j); return h > 0.5 ? { col: colCol[j] === C.free ? C.ink : colCol[j], a: h } : { txt: '?', col: C.inkMid, a: 1 - h * 2 }; } });
      ['a₁', 'a₂', 'a₃', 'a₄', 'a₅', 'b'].forEach((v, j) => ctag(v, MA.cell(3, j)[0], AY + 125, { px: 28, a: pc, color: j === 1 || j === 3 ? C.free : colCol[j] }));
      ctag('A', UX - 360, AY, { px: 34, a: pc, color: C.inkMid, align: 'right', font: F.serif });
      const thread = (j0, j1, col, t0, lw = 3, k = 0) => {
        const p = smoother(prog(B.t, t0, t0 + 0.6)); if (p <= 0) return;
        const [x0, y0] = M.cell(3, j0), [x1, y1] = MA.cell(0, j1), ya = y0 + 40, yb = y1 - 40, xm = (x0 + x1) / 2;
        ctx.save(); ctx.globalAlpha = pc * 0.85; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.shadowColor = col; ctx.shadowBlur = 10;
        ctx.beginPath(); const N = 30; for (let q = 0; q <= N * p; q++) { const u = q / N, x = (1 - u) ** 3 * x0 + 3 * (1 - u) ** 2 * u * x0 + 3 * (1 - u) * u * u * x1 + u ** 3 * x1, y = (1 - u) ** 3 * ya + 3 * (1 - u) ** 2 * u * (ya + 70 + k * 20) + 3 * (1 - u) * u * u * (yb - 70 - k * 20) + u ** 3 * yb; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      };
      [0, 2, 4].forEach((j, k) => { thread(j, j, colCol[j], tT.e1 + k * 0.5); ctag(['e₁', 'e₂', 'e₃'][k], M.cell(3, j)[0] + 34, M.cell(3, j)[1] + 52, { px: 24, a: pc * gin(tT.e1 + k * 0.5), color: colCol[j] }); });
      // a₂：U 第 2 列 = e₁ → a₁
      const g2 = gin(tT.a2 - 0.6);
      if (g2 > 0) { ctag('= 1·e₁', M.cell(0, 1)[0], UY - 125, { px: 26, a: pc * g2 * (1 - B.win(s('C15') + 0.3, e('C15') + 0.3)), color: C.i }); thread(0, 1, C.i, tT.a2, 4, 1); const p = smoother(prog(B.t, tT.a2, tT.a2 + 0.9)); if (p > 0 && p < 1) B.fly(MA.cell(1, 0), MA.cell(1, 1), p, C.i, { lift: 90, txt: 'a₁', px: 28 }); }
      const g4 = gin(tT.a4 - 1.2);
      if (g4 > 0) { ctag('= 1·e₂', M.cell(0, 3)[0], UY - 125, { px: 26, a: pc * g4 * (1 - B.win(s('C15') + 0.3, e('C15') + 0.3)), color: C.j }); thread(2, 3, C.j, tT.a4, 4, 1); const p = smoother(prog(B.t, tT.a4, tT.a4 + 0.9)); if (p > 0 && p < 1) B.fly(MA.cell(1, 2), MA.cell(1, 3), p, C.j, { lift: 90, txt: 'a₃', px: 28 }); }
      // D04 / C15：错线
      const gw = pc * B.win(s('D04'), e('C15'));
      if (gw > 0) { thread(1, 3, C.free, s('D04') + 0.2, 3, 2); B.cross(MA.cell(0, 2)[0] + 40, DY + 0, gin(s('C15') + 0.3, 0.4), gw, 36); B.xcard('e₂ = 第二个主元列 = a₃（不是 a₂）', DX, DY - 375, 560, 64, pc * gin(s('C15') + 0.6) * B.win(s('C15'), e('C15') + 0.5), C.j, 28); }
      // b
      const gb = gin(tT.b - 2.5);
      if (gb > 0) {
        ctag('= 4e₁ − 6e₂ + 3e₃', M.cell(0, 5)[0] + 40, UY - 158, { px: 26, a: pc * gb, color: C.peri });
        [[0, 4, C.i], [2, -6, C.j], [4, 3, C.k]].forEach(([j, k, col], q) => { thread(j, 5, col, tT.b + q * 0.45, 3, q); const p = smoother(prog(B.t, tT.b + q * 0.45, tT.b + q * 0.45 + 0.9)); if (p > 0 && p < 1) B.fly(MA.cell(2, j), MA.cell(2, 5), p, col, { lift: 110, txt: `${k > 0 ? '+' : '−'}${Math.abs(k)}a`, px: 24 }); });
      }
      const tx = [['C13', 'a2', 0.9], ['C14', 'a4', 0.9]];
      texAt('a2', DX - 220, DY + 330, 30, { alpha: pc * B.win(tT.a2 + 0.9, s('C16') - 0.2) });
      texAt('a4', DX + 230, DY + 330, 30, { alpha: pc * B.win(tT.a4 + 0.9, s('C16') - 0.2) });
      const ts = ['四减六', '负四加零', '负八加零', '零减六'].map(w => cue('C17', w));
      ['4 − 6 + 3 = 1', '−4 + 0 + 3 = −1', '−8 + 0 + 9 = 1', '0 − 6 + 9 = 3'].forEach((t, i) => ctag(t, DX - 330 + i * 220, DY + 320, { px: 26, a: pc * gin(ts[i]) * (1 - gin(cue('C17', 'b等于'))), color: C.ink }));
      B.answer('b', DX, DY + 330, 34, pc * gin(cue('C17', 'b等于')) * (1 - gin(s('G03') - 0.2)), { col: OK });
      if (B.t > cue('C17', 'b等于')) B.burst(DX, DY + 330, cue('C17', 'b等于'), OK, { r1: 240 });
      texAt('chk', DX, DY + 330, 36, { alpha: pc * gin(s('G03')) });
      B.stamp(DX + 380, DY + 330, true, gin(e('G03') - 0.6, 0.4), pc * gin(e('G03') - 0.6), '✓ 自检');
    }
  }

  // ════ 再练两道：2022–23 Q2；2020–21 Q7 ════
  const neg = v => String(v).replace('-', '−');
  function rref(id0, id1, title, rows, piv, a0) {
    const a = B.win(s(id0), s(id1) - 0.2); if (a <= 0) return 0;
    const A = a * gin(a0); if (A <= 0) return 0;
    B.qhead(title, A);
    const gp = gin(s(id0) + 0) ;
    const M = B.mat(DX, DY - 215, rows, { px: 38, a: A, cell: (i, j) => ({ txt: neg(rows[i][j]), col: piv.includes(j) ? C.i : C.free }) });
    ctag('U =', DX - M.w / 2 - 70, DY - 215, { px: 32, a: A, color: C.ink, font: F.serif });
    // 主元圈
    rows.forEach((r, i) => { const j = r.findIndex(v => v !== 0); if (j >= 0 && piv.includes(j)) { const [x, y] = M.cell(i, j); ctx.save(); ctx.globalAlpha = A * gp; ctx.strokeStyle = C.i; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); } });
    return { A, M };
  }
  function shotMore() {
    // 2022–23 Q2
    const P2 = [[1, 0, 2, 1], [0, 1, 1, 4], [0, 0, 0, 0], [0, 0, 0, 0]];
    const r2 = rref('C17a', 'C17f', '2022–2023 · 第 2 题', P2, [0, 1], cue('C17a', '行最简形'));
    if (r2) {
      const { A, M } = r2;
      ['x₁', 'x₂', 'x₃', 'x₄'].forEach((t, j) => ctag(t, M.cell(0, j)[0], DY - 215 - M.h / 2 - 26, { px: 24, a: A * gin(s('C17b')), color: j < 2 ? C.i : C.free }));
      texAt('p2n', DX, DY - 10, 36, { alpha: A * gin(cue('C17b', '轮流取一')), reveal: rv(cue('C17b', '轮流取一'), 2.5) });
      texAt('p2r', DX, DY + 60, 36, { alpha: A * gin(s('C17c') + 0.3) });
      if (B.t > s('C17d') - 0.2) {
        const g3 = A * gin(s('C17d')), [x3, y3] = M.cell(0, 2), [x3b] = M.cell(1, 2);
        ctx.save(); ctx.globalAlpha = g3 * 0.9; ctx.strokeStyle = C.j; ctx.lineWidth = 3; ctx.strokeRect(x3 - 26, y3 - 26, 52, M.h / 2 + 4); ctx.restore();
        ctag('= 2e₁ + e₂', x3b - 70, DY - 215 + M.h / 2 + 30, { px: 26, a: g3, color: C.j });
        texAt('p2a3', DX, DY + 140, 36, { alpha: A * gin(cue('C17d', '所以a三')) });
      }
      if (B.t > s('C17e') - 0.2) {
        const g4 = A * gin(s('C17e')), [x4, y4] = M.cell(0, 3);
        ctx.save(); ctx.globalAlpha = g4 * 0.9; ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.strokeRect(x4 - 26, y4 - 26, 52, M.h / 2 + 4); ctx.restore();
        ctag('= e₁ + 4e₂', x4 + 90, DY - 215 + M.h / 2 + 30, { px: 26, a: g4, color: C.k });
        texAt('p2a4', DX, DY + 215, 36, { alpha: A * gin(cue('C17e', '所以a四')) });
      }
      B.burst(DX, DY + 215, cue('C17e', '所以a四') + 0.2, OK, { r1: 200 });
    }
    // 2020–21 Q7
    const P3 = [[1, 0, 0, -1], [0, 1, 0, 1], [0, 0, 1, -1]];
    const r3 = rref('C17f', 'C17j', '2020–2021 期中 · 第 7 题', P3, [0, 1, 2], cue('C17f', '三乘四'));
    if (r3) {
      const { A } = r3;
      texAt('p3n', DX, DY - 15, 38, { alpha: A * gin(cue('C17g', '零空间的基')) });
      ctag('x₄ = 1 → x₁ = 1, x₂ = −1, x₃ = 1', DX, DY - 85, { px: 28, a: A * gin(cue('C17g', '令x四')), color: C.free, font: F.serif });
      texAt('p3b', DX, DY + 65, 36, { alpha: A * gin(s('C17h') + 0.3), reveal: rv(s('C17h') + 0.3, 3) });
      B.ghalo('p3b', DX, DY + 65, 36, 'z', A * B.win(s('G03b'), e('G03b')));
      ctag('η 的第 4 个分量 = 0  →  α₄ 用不上', DX, DY + 140, { px: 30, a: A * gin(s('G03b') + 0.3), color: C.gpt });
      B.answer('p3x', DX, DY + 225, 38, A * gin(s('C17i') + 0.3), { col: OK });
      B.burst(DX, DY + 225, s('C17i') + 0.4, OK, { r1: 220 });
    }
  }

  // ════ 压轴加练：2025–26 Q4（自己消元 + 四个子空间 + 零行配方求 N(Aᵀ)）════
  function shotQ4() {
    const a = B.win(s('C17j'), s('C17t') - 0.2); if (a <= 0) return;
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
      B.stamp(DX + 300, DY + 100, true, gin(cue('C17s', '正好是a四'), 0.4), A * gin(cue('C17s', '正好是a四')), '✓ 24 分');
    }
  }

  // ════ 扩写三：23–24 Q2′ 零空间 ════
  function shotR3() {
    const a = B.win(s('C17t'), s('C18') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C17t') + 0.4);
    B.qhead('2023–2024 期中 · 第 2′ 题 · 14 分', A);
    const tW = s('C17w'), tV = s('C17v');
    B.drill(A, [
      { txt: 'A =', x: DX - 250, y: DY - 210, px: 32, t: s('C17t') + 0.8, u: tW },
      { mat: [[[1, -1, 4, 2], [-2, -4, 7, 5]], [[1, -1, 4, 2], [0, -6, 15, 9]], [[1, -1, 4, 2], [0, 1, '-5/2', '-3/2']], [[1, 0, '3/2', '1/2'], [0, 1, '-5/2', '-3/2']]],
        T: [-1, cue('C17u', '第二行加两倍') + 0.5, cue('C17u', '除以负六') + 0.5, cue('C17u', '第一行加第二行') + 0.5],
        ops: [null, [[1, 'R₂ + 2R₁']], [[1, 'R₂ ÷ (−6)']], [[0, 'R₁ + R₂']]], x: DX - 20, y: DY - 210, px: 34, cw: 90, lx: DX + 290, t: s('C17t') + 0.8, u: tW,
        hi: (i, j, k) => k === 3 && i === j ? C.i : (k === 3 && j >= 2 && B.t >= tV ? C.free : null) },
      { txt: '主元：第 1、2 列    自由：x₃、x₄', x: DX, y: DY - 110, px: 28, col: C.free, t: tV + 0.2, u: tW },
      { txt: 'x₃ = 1, x₄ = 0  →  (−3/2, 5/2, 1, 0)', x: DX, y: DY - 40, px: 30, t: cue('C17v', '令x三等于一'), u: tW },
      { txt: 'x₃ = 0, x₄ = 1  →  (−1/2, 3/2, 0, 1)', x: DX, y: DY + 20, px: 30, t: cue('C17v', '令x三等于零'), u: tW },
      { txt: 'N(A) = Span{(−3, 5, 2, 0), (−1, 3, 0, 2)}', x: DX, y: DY + 130, px: 32, card: OK, t: s('G03e') + 0.3, u: tW, burst: true },
      { txt: 'B =', x: DX - 200, y: DY - 190, px: 32, t: tW },
      { mat: [[[1, 2, -4], [2, 1, -1], [-1, 1, -3]], [[1, 2, -4], [0, -3, 7], [-1, 1, -3]], [[1, 2, -4], [0, -3, 7], [0, 3, -7]], [[1, 2, -4], [0, -3, 7], [0, 0, 0]]],
        T: [-1, cue('C17w', '第二行减两倍') + 0.5, cue('C17w', '第三行加第一行') + 0.5, cue('C17w', '两行一加') + 0.4],
        ops: [null, [[1, 'R₂ − 2R₁']], [[2, 'R₃ + R₁']], [[2, 'R₃ + R₂']]], x: DX - 40, y: DY - 190, px: 36, lx: DX + 200, t: tW, hi: (i, j, k) => k === 3 && i === 2 ? C.free : null },
      { txt: 'x₂ = 7x₃ / 3', x: DX, y: DY - 30, px: 30, t: s('C17x') + 0.3 },
      { txt: 'x₁ = −2x₂ + 4x₃ = −2x₃ / 3', x: DX, y: DY + 30, px: 30, t: cue('C17x', 'x一等于') },
      { txt: 'N(B) = Span{(−2, 7, 3)}', x: DX, y: DY + 140, px: 34, card: OK, t: cue('C17x', '取x三等于三'), burst: true },
      { txt: '自由变量轮流取 1，其余取 0', x: DX, y: DY + 245, px: 30, col: C.ds, t: s('D04e') + 0.2 },
    ]);
  }

  function shotOutro() {
    const a = B.win(s('C18'), 1e9); if (a <= 0) return;
    const g = a * gin(s('C18'));
    B.card(DX, DY - 60, 900, 320, g, C.peri);
    ctag('套路卡 ⑪', DX - 340, DY - 180, { px: 30, a: g, color: C.peri, font: F.serif });
    const ts = [s('C18') + 0.3, cue('C18', '零空间'), cue('C18', '行空间抄'), cue('C18', '非主元列')];
    ['① 圈主元，分出自由变量', '② N(A)：自由变量轮流取 1', '③ 行空间抄 U 的行；列空间用 A 的主元列', '④ 非主元列和 b：沿丝线读系数'].forEach((l, k) =>
      ctag(l, DX - 410, DY - 120 + k * 56, { px: 32, a: a * gin(ts[k]), color: k === 2 ? C.free : C.ink, align: 'left' }));
    B.burst(DX + 390, DY - 180, s('C18') + 0.2, C.peri, { r1: 100, n: 12 });
    B.xcard('最后一段 → 判断题闪电战', DX, DY + 200, 480, 70, a * gin(s('D05')), C.ds, 30);
  }

  function papers() {
    B.paper(EX, 'y2425_q4', { t0: s('C03') + 0.2, dock: s('C03') + 3.0, out: s('C12') - 0.6 });
    B.paper(EX, 'y2223_q2', { t0: s('C17a') + 0.2, dock: cue('C17a', '行最简形') - 0.5, out: s('C17f') - 0.3 });
    B.paper(EX, 'y2021_q7', { t0: s('C17f') + 0.2, dock: cue('C17f', '三乘四') - 0.5, out: s('C17j') - 0.3 });
    B.paper(EX, 'y2526_q4', { t0: s('C17j') + 0.2, dock: cue('C17j', '这次没有给U') - 0.3, out: s('C17t') - 0.3 });
    B.paper(EX, 'y2324_n2', { t0: s('C17t') + 0.2, dock: cue('C17t', '求A和B') - 0.3, out: s('C18') - 0.3 });
  }

  // ── 扩写：逐步算式小卡 ──
  const XC = [
    ['G09a', DY + 300, ['U 的列：最后一个分量都是 0　A 的列：不一定'], C.free],
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
    B.frame(t, () => { shotKey(); shotMain(); shotMore(); shotQ4(); shotR3(); shotOutro(); papers(); extras(); });
  }
  return { TL, draw };
}
