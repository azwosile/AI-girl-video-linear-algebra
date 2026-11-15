// 第 4 章 4.2b 任意基下的矩阵（Leon 9th §4.2 定理 4.2.2–4.2.4）。
// 分镜：标准基 → 任意基（多项式没有箭头）→ V/W 取坐标 → 交换图 + 小球跑两条路 → aⱼ = [L(vⱼ)]_F
//       → 例 3（b-网格）→ 例 4（b-网格里的变换，读坐标）→ 例 5 求导矩阵 + 验证 → 定理 4.2.3 / 推论 4.2.4
//       → 例 6 增广矩阵行化简 → 验第一列 → 交换图走一遍 → 同济对照 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_shock', 'ds_happy', 'gpt_explain', 'gpt_point'] };

const mv = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
const mm = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];

export async function setup(R) {
  const B = base(R, {
    assets, label: '第四章 · 线性变换', title: '4.2 任意基下的矩阵', hi: 3, en: 'MATRICES FOR GENERAL BASES',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C03: 0.5, C04: 0.4, C06: 0.6, C08: 0.6, C10: 0.6, C14: 0.6, C16: 0.4, C17: 0.6, C19: 0.4, C22: 0.5, G01: 0.6, C23: 0.6 },
    post: { C02: 0.6, C04: 1.4, C05: 0.6, C07: 0.8, C09: 0.8, C11: 0.6, C12: 0.8, C13: 0.6, C15: 0.6, C16: 0.6, C18: 0.4, C19: 1.0, C20: 0.6, C21: 0.6, C22: 1.0, G02: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, o2: cue('C01', '多项式'), crd: L('C02').s, crE: cue('C02', '选一组基E'), crF: cue('C02', '选一组基F'),
    cd: L('C03').s, cdR: cue('C03', '右上角'), cdD: cue('C03', '往下走'), thm: L('C04').s, run: cue('C04', '上面走L'), aj: L('C05').s, d1: L('D01').s,
    e3: L('C06').s, e3b: cue('C06', '其中b一'), e3c: L('C07').s, e3A: cue('C07', '把坐标排成列'),
    e4: L('C08').s, e4w: cue('C08', '把b二送到'), e4r: L('C09').s, e4r2: cue('C09', 'b二的像'), e4A: cue('C09', '所以A'),
    e5: L('C10').s, e5c: L('C11').s, e5c2: cue('C11', 'x求导'), e5c3: cue('C11', '一求导'), e5A: cue('C11', '三列拼起来'), e5v: L('C12').s, e5ok: cue('C12', '正是p的导数'),
    d2: L('D02').s, fin: L('C13').s,
    gen: L('C14').s, buj: cue('C14', 'A的第j列'), t3: L('C15').s, t4: L('C16').s,
    e6: L('C17').s, e6b: cue('C17', 'b一、b二'), e6L: L('C18').s, ag: L('C19').s, ops: cue('C19', '然后'), ag1: L('C20').s, d3: L('D03').s, chk: L('C21').s,
    cd2: L('C22').s, cdA: cue('C22', 'A乘它'), cdF: cue('C22', '再用F翻译'),
    tj: L('G01').s, tj2: L('G02').s, sum: L('C23').s, d4: L('D04').s, end: L('C24').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.o2, 0.3); TL.sfx('whoosh', T.crE, 0.3); TL.sfx('whoosh', T.crF, 0.3); TL.sfx('pop', T.cd, 0.3); TL.sfx('pop', T.cdD, 0.3);
  TL.sfx('shimmer', T.thm, 0.35); TL.sfx('ding_hi', T.run + 2.6, 0.35); TL.sfx('pop', T.aj, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('whoosh', T.e3, 0.3); TL.sfx('pop', T.e3c, 0.3); TL.sfx('ding_hi', T.e3A, 0.3); TL.sfx('warp', T.e4 + 0.6, 0.4); TL.sfx('warp', T.e4w, 0.4); TL.sfx('pop', T.e4r, 0.3); TL.sfx('ding_hi', T.e4A, 0.3);
  TL.sfx('whoosh', T.e5, 0.3); [T.e5c, T.e5c2, T.e5c3].forEach(x => TL.sfx('pop', x, 0.3)); TL.sfx('ding_hi', T.e5A, 0.3); TL.sfx('check', T.e5ok, 0.35); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('whoosh', T.gen, 0.3); TL.sfx('pop', T.t3, 0.3); TL.sfx('shimmer', T.t4, 0.35); TL.sfx('whoosh', T.e6, 0.3); TL.sfx('pop', T.e6L, 0.3); TL.sfx('pop', T.ag, 0.3); TL.sfx('swoosh_in', T.ops + 0.6, 0.35);
  TL.sfx('ding_hi', T.ag1, 0.35); TL.sfx('pluck', T.d3, 0.3); TL.sfx('check', L('C21').e - 0.6, 0.35); TL.sfx('pop', T.cd2, 0.3); TL.sfx('ding_hi', L('C22').e - 0.5, 0.35);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

  // ── A：开场 + 取坐标 ──
  function blob(x, y, rx, ry, col, a, lab) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.15; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); if (lab) ctag(lab, x, y, { px: 40, a, color: col, font: F.serif }); }
  function shotOpen() {
    const a = B.win(T.o1 + 0.3, T.cd - 0.3); if (a <= 0) return;
    const g0 = a * (1 - gin(T.crd - 0.2));
    if (g0 > 0) {
      B.card(DX - 240, DY - 120, 360, 200, g0, C.i); ctag('标准基', DX - 240, DY - 170, { px: 34, a: g0, color: C.i, font: F.serif }); ctag('e₁, e₂, …', DX - 240, DY - 100, { px: 34, a: g0, color: C.ink, font: F.serif });
      B.card(DX + 240, DY - 120, 360, 200, g0 * gin(T.o1 + 1.5), C.j); ctag('任意基', DX + 240, DY - 170, { px: 34, a: g0 * gin(T.o1 + 1.5), color: C.j, font: F.serif }); ctag('无穷多组', DX + 240, DY - 100, { px: 34, a: g0 * gin(T.o1 + 1.5), color: C.ink });
      const gp = g0 * gin(T.o2); B.card(DX, DY + 150, 560, 120, gp, C.free); ctag('P₃：x²、x、1 —— 哪来的箭头？', DX, DY + 150, { px: 32, a: gp, color: C.free });
    }
    const g = a * gin(T.crd); if (g <= 0) return;
    const yU = DY - 140, yD = DY + 170, xl = DX - 240, xr = DX + 240;
    blob(xl, yU, 150, 110, C.ink, g, 'V'); blob(xr, yU, 150, 110, C.ink, g, 'W');
    arrow(ctx, [xl + 160, yU], [xr - 160, yU], { color: C.ink, width: 5, head: 20, alpha: g }); ctag('L', DX, yU - 30, { px: 34, a: g, color: C.ink, font: F.serif });
    const gE = a * gin(T.crE), gF = a * gin(T.crF);
    arrow(ctx, [xl, yU + 120], [xl, yD - 80], { color: C.i, width: 5, head: 20, alpha: gE, grow: gin(T.crE, 0.6) }); ctag('取 E 坐标', xl - 110, (yU + yD) / 2 + 20, { px: 28, a: gE, color: C.i });
    arrow(ctx, [xr, yU + 120], [xr, yD - 80], { color: C.j, width: 5, head: 20, alpha: gF, grow: gin(T.crF, 0.6) }); ctag('取 F 坐标', xr + 110, (yU + yD) / 2 + 20, { px: 28, a: gF, color: C.j });
    B.card(xl, yD, 220, 100, gE, C.i); ctag('ℝⁿ', xl, yD, { px: 44, a: gE, color: C.ink, font: F.serif });
    B.card(xr, yD, 220, 100, gF, C.j); ctag('ℝᵐ', xr, yD, { px: 44, a: gF, color: C.ink, font: F.serif });
    ctag('问题搬回 ℝⁿ → ℝᵐ', DX, DY + 330, { px: 34, a: a * gin(cue('C02', '问题就搬回')), color: OK, font: F.serif });
  }

  // ── B：交换图 ──
  function shotCD() {
    const a = B.win(T.cd - 0.2, T.e3 - 0.3); if (a <= 0) return;
    B.cd(DX, DY - 110, 560, 300, a, {
      corners: { tl: { k: 'cdv', at: T.cd, col: C.ink }, tr: { k: 'cdLv', at: T.cdR, col: C.ink }, bl: { k: 'cdve', at: T.cdD, col: C.i }, br: { k: 'cdLf', at: T.cdD + 0.6, col: C.j } },
      arrows: [{ f: 'tl', t: 'tr', at: T.cdR, lk: 'cdL', label: 'L' }, { f: 'tl', t: 'bl', at: T.cdD, label: 'E', col: C.i }, { f: 'tr', t: 'br', at: T.cdD + 0.6, label: 'F', col: C.j, side: 1 },
        { f: 'bl', t: 'br', at: T.thm + 0.6, lk: 'cdA', label: 'A', col: C.peri, side: 1 }],
      run: { t0: T.run, t1: T.run + 2.6, path: ['tl', 'tr', 'br'], col: C.ink },
    });
    { // 第二个小球：下路
      const u = prog(B.t, T.run, T.run + 2.6); if (u > 0 && u < 1) { const pts = [[DX - 280, DY - 260], [DX - 280, DY + 40], [DX + 280, DY + 40]], f = Math.min(1.999, u * 2), i = Math.floor(f), e = smooth(f - i);
        B.dot(lerp(pts[i][0], pts[i + 1][0], e), lerp(pts[i][1], pts[i + 1][1], e), 13, C.peri, a); }
    }
    const g = a * gin(T.thm); B.card(DX, DY + 200, 560, 100, g, C.peri); texAt('thm', DX, DY + 200, 44, { alpha: g });
    ctag('定理 4.2.2', DX, DY - 330, { px: 34, a: g, color: C.peri, font: F.serif });
    const g2 = a * gin(T.aj); B.card(DX, DY + 330, 560, 100, g2, OK); texAt('aj', DX, DY + 330, 44, { alpha: g2, color: OK });
    ctag('多一步：用 F 翻译', DX + 420, DY + 330, { px: 26, a: a * gin(T.d1), color: C.inkMid });
  }

  // ── C：例 3、例 4（b-网格）──
  const Bm = [[1, -1], [1, 1]], A4 = [[1, 1], [0, 2]], Bi = [[0.5, 0.5], [-0.5, 0.5]], M4 = mm(mm(Bm, A4), Bi);
  const P = new Plane({ ox: DX + 40, oy: DY + 120, u: 62, R: 7 });
  function bgrid(M, a, D, col = C.j) { if (a <= 0) return; ctx.save(); ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 2, 0, Math.PI * 2); ctx.clip(); P.grid(ctx, { M: mm(M, Bm), color: col, width: 2, alpha: a * 0.45 }); ctx.restore(); }
  function shotE3(D) {
    const a = B.win(T.e3 - 0.2, T.e4 - 0.3); if (a <= 0) return;
    ctag('例 3  输入：标准基 · 输出：{b₁, b₂}', DX, DY - 390, { px: 30, a, color: C.peri });
    texAt('e3', DX, DY - 320, 40, { alpha: a }); texAt('e3b', DX, DY - 220, 36, { alpha: a * gin(T.e3b) });
    texAt('e3c', DX, DY - 110, 34, { alpha: a * gin(T.e3c), reveal: rv(T.e3c, 3.5) });
    const g = a * gin(T.e3A); B.card(DX, DY + 60, 360, 150, g, C.peri); texAt('e3A', DX, DY + 60, 46, { alpha: g });
    ctag('列 = 在 {b₁, b₂} 下的坐标', DX, DY + 190, { px: 30, a: g, color: C.inkMid });
    void D;
  }
  function shotE4(D) {
    const a = B.win(T.e4 - 0.2, T.e5 - 0.3); if (a <= 0) return;
    const s1 = smoother(prog(B.t, T.e4w + 0.2, T.e4w + 2.0));
    const M = lerpM(I2, M4, s1);
    B.warp(P, I2, 1, a * 0.6, D, { basis: false, neu: 0.25, old: 0.08 });
    bgrid(M, a, D);
    const O = P.S([0, 0]);
    const b1 = mv(M, [1, 1]), b2 = mv(M, [-1, 1]);
    arrow(ctx, O, P.S(b1), { color: C.i, width: 8, head: 24, alpha: a }); arrow(ctx, O, P.S(b2), { color: C.j, width: 8, head: 24, alpha: a });
    ctag(s1 > 0.5 ? 'L(b₁)' : 'b₁', ...P.S([b1[0] + 0.3, b1[1] + 0.3]), { px: 30, a, color: C.i, font: F.serif });
    ctag(s1 > 0.5 ? 'L(b₂)' : 'b₂', ...P.S([b2[0] - 0.6, b2[1] + 0.2]), { px: 30, a, color: C.j, font: F.serif });
    // 读坐标：L(b₂) = 1·b₁ + 2·b₂（虚线路径）
    const gr = a * gin(T.e4r2); if (gr > 0) { B.line2(O, P.S([1, 1]), C.i, gr, 4, [10, 8]); B.line2(P.S([1, 1]), P.S([-1, 3]), C.j, gr, 4, [10, 8]); ctag('1·b₁ + 2·b₂', ...P.S([0.9, 2.6]), { px: 28, a: gr, color: C.ink }); }
    ctag('例 4  输入、输出都用 {b₁, b₂}', DX, DY - 390, { px: 30, a, color: C.peri });
    texAt('e4', DX, DY - 320, 40, { alpha: a * gin(T.e4 + 0.4) });
    ctag('网格 = b-网格', DX - 330, DY - 230, { px: 26, a: a * gin(T.e4 + 0.6) * (1 - gin(T.e4r - 0.2)), color: C.j });
    const g = a * gin(T.e4A); B.card(DX + 300, DY + 300, 260, 150, g, C.peri); texAt('e4A', DX + 300, DY + 300, 44, { alpha: g });
  }

  // ── D：例 5 求导 ──
  function shotE5() {
    const a = B.win(T.e5 - 0.2, T.gen - 0.3); if (a <= 0) return;
    ctag('例 5', DX - 160, DY - 380, { px: 32, a, color: C.peri }); texAt('e5', DX + 20, DY - 380, 44, { alpha: a }); texAt('e5b', DX, DY - 300, 36, { alpha: a * gin(T.e5 + 1.0) });
    const rows = [[T.e5c, 'x²', '2x', '(2, 0)ᵀ', C.i], [T.e5c2, 'x', '1', '(0, 1)ᵀ', C.j], [T.e5c3, '1', '0', '(0, 0)ᵀ', C.k]];
    const top = a * (1 - gin(T.e5v - 0.2) * 0.0);
    rows.forEach(([t0, f, d, c, col], i) => { const y = DY - 190 + i * 80, g = top * gin(t0);
      ctag(f, DX - 300, y, { px: 34, a: g, color: col, font: F.serif }); ctag('→', DX - 200, y, { px: 32, a: g, color: C.inkMid }); ctag(d, DX - 100, y, { px: 34, a: g, color: C.ink, font: F.serif });
      ctag('坐标', DX + 30, y, { px: 26, a: g, color: C.inkMid }); ctag(c, DX + 160, y, { px: 32, a: g, color: col, font: F.serif }); });
    const g = a * gin(T.e5A); B.card(DX, DY + 60, 300, 130, g, C.peri); texAt('e5A', DX, DY + 60, 40, { alpha: g });
    texAt('e5v', DX - 60, DY + 200, 34, { alpha: a * gin(T.e5v), reveal: rv(T.e5v, 3.0) });
    ctag('ax² + bx + c ↔ (a, b, c)ᵀ', DX, DY - 248, { px: 28, a: a * gin(T.e5v) * 1, color: C.inkMid });
    B.stamp(DX + 330, DY + 200, true, gin(T.e5ok, 0.4), a * gin(T.e5ok), '导数');
    ctag('有限维 + 选好基 ⇒ 线性变换 = 矩阵乘法', DX, DY + 340, { px: 32, a: a * gin(T.fin), color: OK, font: F.serif });
  }

  // ── E：定理 4.2.3、推论 4.2.4 ──
  function shotGen() {
    const a = B.win(T.gen - 0.2, T.e6 - 0.3); if (a <= 0) return;
    ctag('回到 ℝⁿ → ℝᵐ', DX, DY - 360, { px: 36, a, color: C.peri, font: F.serif });
    ctag('E = {u₁, …, uₙ}    F = {b₁, …, bₘ}    B = (b₁ … bₘ)', DX, DY - 280, { px: 30, a: a * gin(T.gen + 0.6), color: C.ink });
    texAt('Buj', DX, DY - 180, 44, { alpha: a * gin(T.buj) });
    const g = a * gin(T.t3); B.card(DX, DY - 50, 520, 100, g, C.peri); texAt('t423', DX, DY - 50, 44, { alpha: g }); ctag('定理 4.2.3', DX - 360, DY - 50, { px: 26, a: g, color: C.peri });
    const g2 = a * gin(T.t4); B.card(DX, DY + 120, 900, 110, g2, OK); texAt('aug', DX, DY + 120, 34, { alpha: g2 }); ctag('推论 4.2.4：一次行化简，全部列一起出来', DX, DY + 220, { px: 28, a: g2, color: OK });
  }

  // ── F：例 6 ──
  function shotE6() {
    const a = B.win(T.e6 - 0.2, T.cd2 - 0.3); if (a <= 0) return;
    const up = a * (1 - gin(T.chk - 0.2));
    ctag('例 6', DX - 300, DY - 390, { px: 32, a: up, color: C.peri }); texAt('e6', DX + 40, DY - 390, 38, { alpha: up });
    texAt('e6u', DX - 230, DY - 290, 34, { alpha: up * gin(cue('C17', 'u一是')) }); texAt('e6b', DX + 170, DY - 290, 30, { alpha: up * gin(T.e6b) });
    texAt('e6L', DX, DY - 170, 34, { alpha: up * gin(T.e6L), reveal: rv(T.e6L, 2.4) });
    const s = smoother(prog(B.t, T.ag1 - 0.4, T.ag1 + 0.6));
    const g0 = up * gin(T.ag); texAt('aug0', DX, DY + 0, 44, { alpha: g0 * (1 - s) }); texAt('aug1', DX, DY + 0, 44, { alpha: up * s });
    ctag('R₁ − R₂', DX + 330, DY - 50, { px: 28, a: up * gin(T.ops + 0.6) * (1 - s), color: C.free }); ctag('R₂ − R₃', DX + 330, DY + 0, { px: 28, a: up * gin(T.ops + 1.4) * (1 - s), color: C.free });
    const gA = up * gin(cue('C20', '右边就是A')); B.card(DX, DY + 190, 320, 170, gA, C.peri); texAt('e6A', DX, DY + 190, 42, { alpha: gA });
    ctag('怎么验证？', DX + 300, DY + 190, { px: 32, a: up * gin(T.d3), color: C.free, font: F.serif });
    const gc = a * gin(T.chk); ctag('验第一列', DX, DY - 300, { px: 34, a: gc, color: C.peri, font: F.serif });
    texAt('chk', DX, DY - 170, 40, { alpha: gc, reveal: rv(T.chk + 0.3, 3.5) });
    ctag('= L(u₁) ✓', DX, DY - 50, { px: 36, a: a * gin(L('C21').e - 0.8), color: OK });
  }

  function shotCD2() {
    const a = B.win(T.cd2 - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('交换图上走一遍', DX, DY - 360, { px: 34, a, color: C.peri, font: F.serif });
    B.cd(DX, DY - 30, 600, 340, a, {
      cw: 220, ch: 160,
      corners: { tl: { k: 'cdu', at: T.cd2, col: C.ink }, tr: { k: 'cdLu', at: T.cdF, col: C.ink }, bl: { k: 'cdue', at: T.cd2 + 0.8, col: C.i, px: 40 }, br: { k: 'cdcol', at: T.cdA, col: C.j, px: 34 } },
      arrows: [{ f: 'tl', t: 'tr', at: T.cdF + 0.4, lk: 'cdL', label: 'L' }, { f: 'tl', t: 'bl', at: T.cd2 + 0.5, label: 'E 坐标', col: C.i }, { f: 'br', t: 'tr', at: T.cdF, label: 'F 翻译', col: C.j, side: 1 },
        { f: 'bl', t: 'br', at: T.cdA, lk: 'cdA', label: 'A', col: C.peri, side: 1 }],
      run: { t0: T.cd2 + 0.5, t1: L('C22').e - 0.5, path: ['tl', 'bl', 'br', 'tr'], col: C.peri },
    });
    ctag('两条路重合 ✓', DX, DY + 280, { px: 38, a: a * gin(L('C22').e - 0.5), color: OK, font: F.serif });
  }

  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照  第六章 §4', DX, DY - 330, { px: 38, a, color: C.gpt, font: F.serif });
    B.card(DX, DY - 200, 640, 100, a * gin(T.tj + 0.6), C.gpt); texAt('tj', DX, DY - 200, 40, { alpha: a * gin(T.tj + 0.6) });
    ctag('A 的第 j 列 = T(αⱼ) 的坐标', DX, DY - 100, { px: 30, a: a * gin(cue('G01', 'A的第j列')), color: C.ink });
    const g = a * gin(T.tj2);
    B.card(DX - 220, DY + 80, 380, 170, g, C.gpt); ctag('同济', DX - 220, DY + 30, { px: 32, a: g, color: C.gpt, font: F.serif }); ctag('V → V，同一组基', DX - 220, DY + 100, { px: 28, a: g, color: C.ink });
    B.card(DX + 220, DY + 80, 380, 170, g * gin(cue('G02', '英文教材')), C.peri); ctag('Leon', DX + 220, DY + 30, { px: 32, a: g * gin(cue('G02', '英文教材')), color: C.peri, font: F.serif });
    ctag('V → W，两组基 E、F', DX + 220, DY + 100, { px: 28, a: g * gin(cue('G02', '英文教材')), color: C.ink });
    ctag('更一般', DX + 220, DY + 200, { px: 28, a: a * gin(cue('G02', '更一般')), color: OK });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 320, { px: 40, a, color: C.peri, font: F.serif });
    B.card(DX, DY - 190, 600, 100, a * gin(T.sum + 0.3), C.peri); texAt('aj', DX, DY - 190, 44, { alpha: a * gin(T.sum + 0.3) });
    B.card(DX, DY - 50, 900, 110, a * gin(cue('C23', '在R n里')), OK); texAt('aug', DX, DY - 50, 34, { alpha: a * gin(cue('C23', '在R n里')) });
    ctag('求导 = 矩阵！', DX, DY + 100, { px: 40, a: a * gin(T.d4), color: C.ds ?? C.i, font: F.serif });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('计算机图形学', DX, DY - 20, { px: 88, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('矩阵让图形动起来', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.crd - 0.2, t1: T.e3 - 0.3, head: '先取坐标', items: [['V 选 E，W 选 F', T.crd], ['交换图', T.cd], ['L(v) 的 F 坐标 = A·(v 的 E 坐标)', T.thm, { color: C.peri, mark: C.peri }], ['aⱼ = L(vⱼ) 的 F 坐标', T.aj, { color: OK, mark: OK }]] },
    { t0: T.e3 - 0.3, t1: T.gen - 0.3, head: '三个例子', items: [['例 3：输出用 b', T.e3], ['例 4：b-网格', T.e4], ['例 5：求导矩阵', T.e5, { color: C.peri, mark: C.peri }]] },
    { t0: T.gen - 0.3, t1: T.tj - 0.3, head: 'ℝⁿ 里的算法', items: [['aⱼ = B⁻¹L(uⱼ)', T.t3], ['(B | 像) → (I | A)', T.t4, { color: OK, mark: OK }], ['例 6', T.e6], ['验算', T.chk]] },
    { t0: T.tj - 0.3, t1: T.end - 0.3, head: '对照与小结', items: [['同济：同一组基', T.tj], ['Leon：两组基', T.tj2]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotOpen(); shotCD(); shotE3(D); shotE4(D); shotE5(); shotGen(); shotE6(); shotCD2(); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
