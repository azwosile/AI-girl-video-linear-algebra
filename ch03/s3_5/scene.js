// 第 3 章 3.5 换基（Leon 9th §3.5）。重建版。
// 分镜：标准网格上的 (7,7)ᵀ → 斜网格 y=(2,1)ᵀ、z=(1,4)ᵀ 盖上来，同一点 = 3y + z → 坐标是“描述”
//       → x = Uc、c = U⁻¹x → 例 2 → 绕标准基一圈：v 坐标 →V→ 标准 →U⁻¹→ u 坐标，S = U⁻¹V
//       → 例 4（第一列 = v₁ 的 u 坐标）→ 方向陷阱（教材 vs 同济）→ P₃ 换基 → 预告 3.6。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, arrow, DX, DY, OK, I2 } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_shock', 'ds_ask', 'ds_happy', 'gpt_cross', 'gpt_explain', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第三章 · 向量空间', title: '3.5 换基', hi: 3, en: 'CHANGE OF BASIS',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C06: 0.6, C08: 0.6, C10: 0.5, C12: 0.6, G01: 0.6, C17: 0.6, C20: 0.4 },
    post: { C05: 0.7, C09: 0.8, C11: 0.6, C14: 0.7, C16: 0.8, C18: 0.6, C19: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, std: L('C02').s, up: cue('C02', '再向上走七格'), sk: L('C03').s, sk2: cue('C03', '整张网格'), new: L('C04').s, new2: cue('C04', '新坐标'), ds1: L('D01').s, desc: L('C05').s, ord: cue('C05', '有序基'),
    uc: L('C06').s, inv: L('C07').s, inv2: cue('C07', '反过来翻译'), e2: L('C08').s, e2i: cue('C08', 'U的逆矩阵是'), e2c: L('C09').s, e2v: cue('C09', '验算一下'),
    ds2: L('D02').s, loop: L('C10').s, loop2: cue('C10', '再用U的逆'), Sdef: L('C11').s, Sname: cue('C11', '教材把它叫作'),
    e4: L('C12').s, e4S: cue('C12', '算出S等于'), col: L('C13').s, col2: cue('C13', '三u一减四u二'), every: L('C14').s, rev: cue('C14', '反方向'),
    warn: L('G01').s, tj: L('G02').s, tjP: cue('G02', '于是P等于'), opp: L('C15').s, ds3: L('D03').s, hist: L('G03').s, tip: L('C16').s, tip2: cue('C16', '再挑一列验算'),
    p3: L('C17').s, p3a: L('C18').s, p3c: cue('C18', '比较系数'), p3r: cue('C18', '所以c一是五'), p3m: L('C19').s, p3i: cue('C19', '求一次逆'), ds4: L('D04').s, end: L('C20').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pluck', T.std + 0.5, 0.25); TL.sfx('pluck', T.up, 0.25); TL.sfx('warp', T.sk2, 0.4); TL.sfx('pop', T.new2, 0.3); TL.sfx('ding_hi', T.desc, 0.3);
  TL.sfx('whoosh', T.uc, 0.3); TL.sfx('warp', T.inv2, 0.3); TL.sfx('whoosh', T.e2, 0.3); TL.sfx('pop', T.e2c, 0.3); TL.sfx('check', T.e2v + 1.0, 0.3);
  TL.sfx('whoosh', T.loop, 0.3); TL.sfx('pluck', T.loop + 0.8, 0.25); TL.sfx('pluck', T.loop2, 0.25); TL.sfx('ding_hi', T.Sdef, 0.35);
  TL.sfx('whoosh', T.e4, 0.3); TL.sfx('pop', T.e4S, 0.3); TL.sfx('check', T.col2 + 1.2, 0.3); TL.sfx('warp', T.rev, 0.3);
  TL.sfx('buzz', T.warn, 0.25); TL.sfx('pop', T.tjP, 0.3); TL.sfx('bell_soft', T.hist, 0.3); TL.sfx('check', T.tip2, 0.3);
  TL.sfx('whoosh', T.p3, 0.3); TL.sfx('pluck', T.p3c, 0.25); TL.sfx('ding_hi', T.p3r, 0.3); TL.sfx('shimmer', L('C20').e + 0.3, 0.4);

  // ── A：两张网格，同一个点 ──
  const YZ = [[2, 1], [1, 4]];
  const P = new Plane({ ox: DX - 190, oy: DY + 250, u: 46, R: 12 });
  function shotGrid(D) {
    const a = B.win(T.o1 - 0.2, T.uc - 0.4); if (a <= 0) return;
    const sk = gin(T.sk2 - 0.3, 0.8), dim = 1 - 0.55 * sk;
    B.grid(P, YZ, a, D, { old: 0.22 * dim + 0.06, neu: 0.5 * sk, basis: false });
    const O = P.S([0, 0]), X = P.S([7, 7]);
    // 标准走法：右 7，上 7
    const g1 = smoother(prog(B.t, T.std + 0.5, T.std + 1.6)), g2 = smoother(prog(B.t, T.up, T.up + 1.1));
    const ea = a * dim;
    if (g1 > 0) arrow(ctx, O, P.S([7 * g1, 0]), { color: C.i, width: 7, head: 20, alpha: ea });
    if (g2 > 0) arrow(ctx, P.S([7, 0]), P.S([7, 7 * g2]), { color: C.j, width: 7, head: 20, alpha: ea });
    // 新基：y, z；3y + z
    const ba = a * gin(T.sk2, 0.5);
    B.vec(P, [2, 1], ba, { color: C.peri, label: 'y', width: 9 }); B.vec(P, [1, 4], ba, { color: C.k, label: 'z', width: 9 });
    const h1 = smoother(prog(B.t, T.new + 0.4, T.new + 1.8)), h2 = smoother(prog(B.t, T.new + 1.8, T.new + 2.6));
    if (h1 > 0) arrow(ctx, O, P.S([6 * h1, 3 * h1]), { color: C.peri, width: 6, head: 18, alpha: a });
    if (h2 > 0) arrow(ctx, P.S([6, 3]), P.S([6 + h2, 3 + 4 * h2]), { color: C.k, width: 6, head: 18, alpha: a });
    for (let k = 1; k <= 2; k++) if (h1 * 3 > k) B.dot(...P.S([2 * k, k]), 6, C.peri, a);
    B.dot(X[0], X[1], 12, C.ink, a * gin(T.std)); ctag('x', X[0] + 26, X[1] - 18, { px: 34, a: a * gin(T.std), color: C.ink, font: F.serif });
    // 右侧标注
    texAt('x77', DX + 250, DY - 300, 34, { alpha: a * gin(T.std + 0.5) * (1 - gin(T.sk - 0.3)) });
    texAt('yz', DX + 250, DY - 300, 34, { alpha: a * gin(T.sk) * (1 - gin(T.new - 0.3)) });
    texAt('x31', DX + 250, DY - 300, 38, { alpha: a * gin(T.new) });
    texAt('c77', DX + 260, DY - 160, 34, { alpha: a * gin(T.ds1), color: C.i, halo: C.disc });
    texAt('c31', DX + 260, DY - 30, 34, { alpha: a * gin(T.new2), color: C.peri, halo: C.disc });
    ctag('点不变，描述变了', DX + 260, DY + 90, { px: 32, a: a * gin(T.desc), color: OK });
    ctag('有序基：顺序也算数', DX + 260, DY + 145, { px: 28, a: a * gin(T.ord), color: C.inkMid });
  }

  // ── B：x = Uc，例 2 ──
  function shotUc() {
    const a = B.win(T.uc - 0.2, T.ds2 - 0.3); if (a <= 0) return;
    const s1 = a * (1 - gin(T.e2 - 0.2, 0.4)), s2 = a * gin(T.e2 - 0.2, 0.4);
    if (s1 > 0) {
      texAt('xUc', DX, DY - 220, 52, { alpha: s1 * gin(T.uc + 0.4), reveal: rv(T.uc + 0.4, 1.6) });
      // 翻译图：新基坐标 ⇄ 标准坐标
      const y = DY - 30, ga = s1 * gin(T.inv);
      B.card(DX - 260, y, 280, 100, ga, C.peri); ctag('新基坐标 c', DX - 260, y, { px: 32, a: ga, color: C.peri });
      B.card(DX + 260, y, 280, 100, ga, C.i); ctag('标准坐标 x', DX + 260, y, { px: 32, a: ga, color: C.i });
      if (ga > 0) { arrow(ctx, [DX - 110, y - 20], [DX + 110, y - 20], { color: C.ink, width: 4, head: 16, alpha: ga }); ctag('U', DX, y - 55, { px: 32, a: ga, color: C.ink, font: F.serif }); }
      const gb = s1 * gin(T.inv2); if (gb > 0) { arrow(ctx, [DX + 110, y + 20], [DX - 110, y + 20], { color: C.free, width: 4, head: 16, alpha: gb }); ctag('U⁻¹', DX, y + 58, { px: 32, a: gb, color: C.free, font: F.serif }); }
      texAt('cUx', DX, DY + 170, 52, { alpha: s1 * gin(T.inv2 + 0.6), color: C.free });
    }
    if (s2 > 0) {
      ctag('例 2', DX, DY - 340, { px: 32, a: s2, color: C.peri });
      texAt('U2', DX, DY - 250, 40, { alpha: s2 * gin(T.e2 + 0.3) });
      texAt('Ui', DX, DY - 130, 40, { alpha: s2 * gin(T.e2i), color: C.free });
      texAt('c2', DX, DY + 20, 40, { alpha: s2 * gin(T.e2c), reveal: rv(T.e2c, 1.4) });
      texAt('chk2', DX, DY + 170, 40, { alpha: s2 * gin(T.e2v), reveal: rv(T.e2v, 1.6), color: OK });
      ctag('✓', DX + 330, DY + 170, { px: 48, a: s2 * gin(T.e2v + 1.6), color: OK });
    }
  }

  // ── C：绕标准基一圈，例 4 ──
  function shotLoop() {
    const a = B.win(T.ds2 - 0.2, T.warn - 0.3); if (a <= 0) return;
    const s1 = a * (1 - gin(T.e4 - 0.2, 0.4)), s2 = a * gin(T.e4 - 0.2, 0.4);
    if (s1 > 0) {
      const y = DY - 150, xs = [DX - 330, DX, DX + 330], cols = [C.k, C.i, C.peri], names = ['v 坐标', '标准坐标', 'u 坐标'];
      const ap = [s1 * gin(T.ds2 + 0.3), s1 * gin(T.loop), s1 * gin(T.loop2)];
      xs.forEach((x, i) => { B.card(x, y, 220, 90, ap[i], cols[i]); ctag(names[i], x, y, { px: 30, a: ap[i], color: cols[i] }); });
      const g1 = s1 * gin(T.loop + 0.6), g2 = s1 * gin(T.loop2 + 0.3);
      if (g1 > 0) { arrow(ctx, [xs[0] + 115, y], [xs[1] - 115, y], { color: C.ink, width: 4, head: 16, alpha: g1 }); ctag('V', (xs[0] + xs[1]) / 2, y - 40, { px: 32, a: g1, color: C.ink, font: F.serif }); }
      if (g2 > 0) { arrow(ctx, [xs[1] + 115, y], [xs[2] - 115, y], { color: C.ink, width: 4, head: 16, alpha: g2 }); ctag('U⁻¹', (xs[1] + xs[2]) / 2, y - 40, { px: 32, a: g2, color: C.free, font: F.serif }); }
      // 合成弧线
      const gs = s1 * gin(T.Sdef, 0.6);
      if (gs > 0) {
        ctx.save(); ctx.globalAlpha = gs; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.beginPath();
        const pr = smoother(prog(B.t, T.Sdef, T.Sdef + 1.0)); ctx.arc(DX, y + 50, 330, Math.PI - 0.0, Math.PI + 0.0 - Math.PI * pr, true); ctx.stroke(); ctx.restore();
      }
      texAt('S', DX, DY + 60, 60, { alpha: s1 * gin(T.Sdef + 0.6), color: C.peri });
      texAt('xu', DX, DY + 170, 48, { alpha: s1 * gin(T.Sdef + 1.2) });
      ctag('教材：从 {v} 到 {u} 的过渡矩阵', DX, DY + 265, { px: 30, a: s1 * gin(T.Sname), color: C.inkMid });
    }
    if (s2 > 0) {
      ctag('例 4（u 同例 2）', DX, DY - 350, { px: 32, a: s2, color: C.peri });
      texAt('V4', DX, DY - 270, 40, { alpha: s2 * gin(T.e4 + 0.3) });
      texAt('S4', DX, DY - 140, 40, { alpha: s2 * gin(T.e4S), reveal: rv(T.e4S, 1.6) });
      const g = s2 * gin(T.col);
      if (g > 0) { const gb = B.tex.groupBox(B.tex.place('S4', DX, DY - 140, 40, 'c'), 'c1'); if (gb) { ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.strokeRect(gb.x - gb.w / 2 - 8, gb.y - gb.h / 2 - 8, gb.w + 16, gb.h + 16); ctx.restore(); } }
      texAt('chk4', DX, DY + 10, 40, { alpha: s2 * gin(T.col2), reveal: rv(T.col2, 1.6), color: OK });
      B.card(DX, DY + 150, 760, 90, s2 * gin(T.every), C.k);
      ctag('每一列 = 旧基向量在新基下的坐标', DX, DY + 150, { px: 32, a: s2 * gin(T.every), color: C.k });
      texAt('Sinv', DX, DY + 280, 38, { alpha: s2 * gin(T.rev), color: C.free });
    }
  }

  // ── D：方向陷阱 ──
  function shotTrap() {
    const a = B.win(T.warn - 0.2, T.p3 - 0.3); if (a <= 0) return;
    ctag('⚠ 方向陷阱', DX, DY - 350, { px: 40, a: a * gin(T.warn), color: C.free, font: F.serif });
    const gl = a * gin(T.warn + 0.4), gt = a * gin(T.tj);
    B.card(DX - 215, DY - 140, 400, 250, gl, C.peri); ctag('教材（Leon）', DX - 215, DY - 230, { px: 30, a: gl, color: C.peri });
    texAt('leon', DX - 215, DY - 140, 30, { alpha: gl }); ctag('“从 {v} 到 {u}”', DX - 215, DY - 60, { px: 28, a: gl, color: C.ink });
    B.card(DX + 215, DY - 140, 400, 250, gt, C.gpt); ctag('同济', DX + 215, DY - 230, { px: 30, a: gt, color: C.gpt });
    texAt('tj', DX + 215, DY - 165, 25, { alpha: gt }); texAt('tjP', DX + 215, DY - 100, 34, { alpha: a * gin(T.tjP), color: C.gpt }); ctag('“从 V 到 U”', DX + 215, DY - 45, { px: 28, a: a * gin(T.tjP), color: C.ink });
    texAt('tjL', DX, DY + 60, 44, { alpha: a * gin(T.opp), color: C.free });
    ctag('同一个名字，方向相反', DX, DY + 130, { px: 32, a: a * gin(T.opp + 1.0), color: C.free });
    ctag('期中卷：两种都考过', DX, DY + 200, { px: 30, a: a * gin(T.hist), color: C.gpt });
    const g = a * gin(T.tip, 0.5); if (g > 0) { B.card(DX, DY + 300, 720, 90, g, OK); ctag('先写定义式 → 再验一列', DX, DY + 300, { px: 34, a: g, color: OK }); }
  }

  // ── E：P₃ 换基 ──
  function shotPoly() {
    const a = B.win(T.p3 - 0.2, T.ds4 - 0.3); if (a <= 0) return;
    ctag('多项式空间 P₃', DX, DY - 350, { px: 32, a, color: C.peri });
    texAt('p3b', DX, DY - 270, 40, { alpha: a * gin(T.p3 + 0.5), reveal: rv(T.p3 + 0.5, 1.4) });
    texAt('p3', DX, DY - 160, 36, { alpha: a * gin(T.p3a), reveal: rv(T.p3a, 1.6) });
    texAt('p3c', DX, DY - 60, 38, { alpha: a * gin(T.p3c), reveal: rv(T.p3c, 2.0) });
    texAt('p3r', DX, DY + 60, 40, { alpha: a * gin(T.p3r), color: OK });
    ctag('新基写成旧坐标，排成列：', DX - 180, DY + 230, { px: 28, a: a * gin(T.p3m), color: C.inkMid });
    texAt('p3M', DX + 210, DY + 230, 32, { alpha: a * gin(T.p3m + 0.5) });
    ctag('新 → 旧；求逆：旧 → 新', DX, DY + 345, { px: 30, a: a * gin(T.p3i), color: C.peri });
  }

  function shotEnd() {
    const a1 = B.win(T.ds4 - 0.1, T.end - 0.1);
    if (a1 > 0) ctag('换基 = 换一种语言，描述同一个东西', DX, DY - 20, { px: 44, a: a1 * gin(T.ds4 + 0.4), color: C.ds, font: F.serif });
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('3.6 行空间与列空间', DX, DY - 20, { px: 80, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  const SECS = [
    { t0: T.std - 0.2, t1: T.uc - 0.3, head: '同一个点', items: [['标准：(7, 7)ᵀ', T.std, { color: C.i, mark: C.i }], ['歪网格：(3, 1)ᵀ', T.new2, { color: C.peri, mark: C.peri }], ['坐标 = 描述', T.desc, { color: OK }]] },
    { t0: T.uc - 0.3, t1: T.ds2 - 0.3, head: '翻译', items: [['x = Uc', T.uc], ['c = U⁻¹x', T.inv2, { color: C.free, mark: C.free }], ['例 2：(3, −2)ᵀ', T.e2c], ['验算 ✓', T.e2v, { color: OK, mark: OK }]] },
    { t0: T.ds2 - 0.3, t1: T.warn - 0.3, head: '过渡矩阵', items: [['绕标准基一圈', T.loop], ['S = U⁻¹V', T.Sdef, { color: C.peri, mark: C.peri }], ['列 = 旧基的新坐标', T.every, { color: C.k, mark: C.k }], ['反方向：S⁻¹', T.rev]] },
    { t0: T.warn - 0.3, t1: T.p3 - 0.3, head: '方向陷阱', items: [['同济 P = V⁻¹U', T.tjP, { color: C.gpt, mark: C.gpt }], ['名字相同，方向相反', T.opp, { color: C.free }], ['写定义 + 验一列', T.tip, { color: OK, mark: OK }]] },
    { t0: T.p3 - 0.3, t1: T.end - 0.3, head: 'P₃ 换基', items: [['比较系数', T.p3c], ['(5, 1, 1)ᵀ', T.p3r, { color: OK, mark: OK }], ['新 → 旧，求逆', T.p3m]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotGrid(D); shotUc(); shotLoop(); shotTrap(); shotPoly(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
