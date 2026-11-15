// 第 2 章 §2.2（下）奇异判定、消元法与乘积公式（Leon 9th Thm 2.2.2、例 1、Table 1、Thm 2.2.3、舍入误差；同济 第一章 §4 例、第二章 §3）。
// 3B1B 视角：det(AB) = 先放大 det B 倍，再放大 det A 倍。
// 分镜：
//   D01–C01   三个大结果
//   C02–C05   Thm 2.2.2：U = Eₖ…E₁A；det(Eᵢ) ≠ 0 → 同步；U 零行 / U 对角为 1
//   D02–C10   消元法：只用交换 + 倍加；例 1 网格逐步变形，计分板记交换次数 → −60
//   D03–G01   运算量：10 阶 3 628 799 vs 285（柱子冲出画面）；20! → 77 年；n³/3
//   C13–C17   det(AB)：单位正方形 → B（×3）→ AB（×6）；代数证明；AB ≠ BA 但 det 相等
//   C18–C23   推论：det(A⁻¹)、det(cA)、det(A+B) 反例；速算
//   G02–C24   舍入误差：0.1 I 的 det = 10⁻¹⁰ 却完全可逆；同济对照
//   D05–C25   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { det2, paraFill, areaLabel, DetGrid } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_think', 'ds_ask', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_cross'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const I2 = [[1, 0], [0, 1]];
const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));
const fmtBig = v => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const E1 = MJ.E1, ST = MJ.steps, TB = MJ.table, MA = MJ.A, MB = MJ.B, MAB = MJ.AB;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.6, C03: 0.5, C04: 0.4, C05: 0.4, C06: 0.5, C07: 0.4, C08: 0.6, C09: 0.5, C10: 0.5, C11: 0.6, C12: 0.5, G01: 0.4, C13: 0.7, C14: 0.4, C15: 0.4, C16: 0.5, C17: 0.3, C18: 0.7, C19: 0.5, C20: 0.5, C21: 0.4, C22: 0.7, C23: 0.4, G02: 0.7, G03: 0.4, C24: 0.4, D05: 0.7 },
    post: { C03: 0.5, C05: 0.9, C08: 0.6, C09: 0.8, C10: 1.0, C11: 0.8, C12: 0.8, C15: 0.9, C16: 0.5, C18: 0.5, C19: 0.5, C21: 0.8, C22: 2.5, C23: 0.9, G03: 0.8 }, tail: 0.6,
  });
  const L = TL.L, cue = TL.cue;
  const cast = new Cast(R.envelope, TL);
  for (const n of assets.chars) cast.add(n, R.img[n], SHADOW[n.split('_')[0]]);
  const dir = makeDirector(TL, cast, {
    C: { x: 250, y: 1095, h: 470, in: [0.9, 1.6] },
    D: { x: 1738, y: 1095, h: 500 },
    G: { x: 1716, y: 1095, h: 500 },
  });
  const K = makeKit(ctx);
  const P = new Plane({ ox: DX - 150, oy: DY + 160, u: 90, R: 10 });
  const GE = new DetGrid(E1), GS = new DetGrid([[1, 2, 3], [0, 1, 4], [0, 0, 0]]), GN = new DetGrid([[1, 2, 3], [0, 1, 4], [0, 0, 1]]);

  const T = {
    hook: L('D01').s, three: cue('C01', '三个大结果'), r1: cue('C01', '奇异的判定'), r2: cue('C01', '最快的算法'), r3: cue('C01', '乘积公式'),
    thm: L('C02').s - 0.5, all: cue('C02', '现在对所有n证明'), U: L('C03').s - 0.3, dU: cue('C03', '两边取行列式'),
    ne0: cue('C04', '都不是零'), sync: cue('C04', '完全同步'), sg: L('C05').s - 0.2, ns: cue('C05', 'A非奇异'), qed: cue('C05', '证完'),
    alg: L('D02').s, m: L('C06').s - 0.3, sw: cue('C06', '每交换一次'), pm: L('C07').s - 0.2, odd: cue('C07', '奇数次'),
    ex: L('C08').s - 0.5, s1: cue('C08', '第二行减去'), s1b: cue('C08', '第三行减去'), z: L('C09').s - 0.2, swp: cue('C09', '只好和第三行交换'), cnt: cue('C09', '记一次交换'),
    tri: L('C10').s - 0.2, sgn: cue('C10', '取负号'), r60: cue('C10', '等于负六十'),
    fast: L('D03').s, tb: L('C11').s - 0.4, big: cue('C11', '三百六十二万'), small: cue('C11', '二百八十五'),
    fac: L('C12').s - 0.3, n20: cue('C12', '二十阶'), yrs: cue('C12', '七十七年'), cube: L('G01').s - 0.2, blink: cue('G01', '一眨眼'),
    ab: L('C13').s - 0.5, geo: L('C14').s - 0.3, doB: cue('C14', 'B把面积'), doA: cue('C14', 'A再放大'), six: cue('C15', '一共放大'), abm: cue('C15', '算一下'),
    pf: L('C16').s - 0.3, pfs: cue('C16', 'B奇异的时候'), ba: L('D04').s, comm: L('C17').s,
    c1: L('C18').s - 0.5, c1g: cue('C18', '放大几倍'), c2: L('C19').s - 0.3, c2b: cue('C19', '上一节的二B'), c3: L('C20').s - 0.3, ce: cue('C20', '最简单的反例'), ce2: L('C21').s - 0.2,
    qz: L('C22').s - 0.5, pause: cue('C22', '暂停'), qa1: L('C23').s, qa2: cue('C23', 'A逆的行列式'), qa3: cue('C23', 'A的五次方'),
    rd: L('G02').s - 0.5, near: cue('G02', '很接近零'), rd2: L('G03').s - 0.2, inv10: cue('G03', '完全可逆'), svd: L('C24').s - 0.2, tj: cue('C24', '同济'),
    end0: L('D05').s - 0.6, e1: cue('D05', '奇异等价于'), e2: cue('D05', '消元化成三角'), e3: cue('D05', '乘积的行列式'), next: cue('C25', '下一节'),
  };

  // ── det(AB) 平面关键帧 ──
  const KF = [[T.doB - 0.1, T.doB + 1.6, MB], [T.doA - 0.1, T.doA + 1.6, MAB]];
  const Mat = tt => { let M = I2, prev = I2; for (const [a, b, Tg] of KF) { if (tt < a) break; M = lerpM(prev, Tg, smoother(prog(tt, a, b))); prev = Tg; } return M; };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); [T.r1, T.r2, T.r3].forEach(t => TL.sfx('pop', t, 0.3));
  TL.sfx('stamp', T.thm + 0.5, 0.35); TL.sfx('marimba', T.U + 0.3, 0.28); TL.sfx('marimba', T.dU, 0.28); TL.sfx('check', T.ne0, 0.3); TL.sfx('pluck', T.sg, 0.3); TL.sfx('pluck', T.ns, 0.3); TL.sfx('ding', T.qed, 0.35);
  TL.sfx('whoosh', T.m, 0.3); TL.sfx('stamp', T.pm + 0.3, 0.3); TL.sfx('swell', T.ex, 0.3); TL.sfx('warp', T.s1, 0.3); TL.sfx('warp', T.s1b, 0.3); TL.sfx('ding_lo', T.z + 0.6, 0.3); TL.sfx('swoosh_in', T.swp, 0.35); TL.sfx('click', T.cnt, 0.35); TL.sfx('ding', T.r60, 0.35);
  TL.sfx('whoosh', T.tb, 0.3); TL.sfx('swell', T.big - 0.4, 0.35); TL.sfx('crack', T.big + 0.8, 0.3); TL.sfx('pop', T.small, 0.3); TL.sfx('thud', T.yrs, 0.35); TL.sfx('sparkle', T.blink, 0.3);
  TL.sfx('stamp', T.ab + 0.5, 0.35); TL.sfx('warp', T.doB, 0.4); TL.sfx('ding', T.doB + 1.6, 0.25); TL.sfx('warp', T.doA, 0.4); TL.sfx('ding', T.six, 0.35); TL.sfx('marimba', T.pf + 0.3, 0.28); TL.sfx('sting', T.ba + 0.2, 0.25); TL.sfx('check', T.comm, 0.3);
  TL.sfx('whoosh', T.c1, 0.3); TL.sfx('pop', T.c2, 0.3); TL.sfx('ding_lo', T.c3 + 0.4, 0.3); TL.sfx('crack', T.ce2 + 1.0, 0.25);
  TL.sfx('whoosh', T.qz, 0.3); TL.sfx('ding_lo', T.pause, 0.3); [T.qa1, T.qa2, T.qa3].forEach(t => TL.sfx('marimba_hi', t + 0.5, 0.28));
  TL.sfx('glitch', T.rd + 0.4, 0.25); TL.sfx('sting', T.inv10, 0.3); TL.sfx('bell_soft', T.tj, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.e1, T.e2, T.e3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C25').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);
  const reveal = (t0, d = 1.0) => prog(t, t0, t0 + d);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.2, L('C01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第二章 · 行列式', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'2.2 三大结果'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'SINGULARITY · ELIMINATION · PRODUCT', cx / 2, 62, 24, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    [['奇异 ⇔ det = 0', T.r1], ['消元求行列式', T.r2], ['det(AB) = det A · det B', T.r3]].forEach(([s, ta], i) => K.tag(s, DX, DY - 130 + i * 120, { px: 46, a: a * gin(ta, 0.4), align: 'center', color: [C.free, C.peri, C.j][i], w: 900, font: F.serif }));
  }

  // ── Thm 2.2.2 ──
  function drawThm() {
    const a = win(t, T.thm, T.alg + 0.2, 0.5, 0.4); if (a <= 0) return;
    texAt('thm22', DX, DY - 320, 50, { alpha: a, reveal: reveal(T.thm + 0.4, 1.0), color: C.peri });
    K.tag('第一节：只验证了 n ≤ 3', DX, DY - 245, { px: 30, a: a * gin(T.thm + 2.0) * (1 - gin(T.U, 0.4)), align: 'center', color: C.inkMid, w: 700 });
    texAt('U', DX, DY - 220, 44, { alpha: a * gin(T.U), reveal: reveal(T.U, 0.9) });
    const pl = tex.place('detU', DX, DY - 130, 42, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.dU), reveal: reveal(T.dU, 1.2) }); tex.draw(ctx, pl, { alpha: a * gin(T.ne0 - 0.6), only: ['e'], force: C.j });
    texAt('neq0', DX, DY - 50, 38, { alpha: a * gin(T.ne0 - 0.6), reveal: reveal(T.ne0 - 0.6, 1.0), color: C.j });
    K.tag('det A = 0  ⇔  det U = 0', DX, DY + 30, { px: 38, a: a * gin(T.sync), align: 'center', color: C.peri, w: 900, font: F.serif });
    const g1 = a * gin(T.sg, 0.5), g2 = a * gin(T.ns, 0.5);
    K.tag('奇异', DX - 200, DY + 110, { px: 34, a: g1, align: 'center', color: C.free, w: 900 });
    GS.draw(ctx, { x: DX - 200, y: DY + 220, px: 34, a: g1, bars: 1, hi: { '2,0': [g1, C.free], '2,1': [g1, C.free], '2,2': [g1, C.free] } });
    K.tag('det U = 0', DX - 200, DY + 330, { px: 32, a: g1, align: 'center', color: C.free, w: 900 });
    K.tag('非奇异', DX + 200, DY + 110, { px: 34, a: g2, align: 'center', color: C.j, w: 900 });
    GN.draw(ctx, { x: DX + 200, y: DY + 220, px: 34, a: g2, bars: 1, hi: { '0,0': [g2, C.j], '1,1': [g2, C.j], '2,2': [g2, C.j] } });
    K.tag('det U = 1', DX + 200, DY + 330, { px: 32, a: g2, align: 'center', color: C.j, w: 900 });
  }

  // ── 消元法 + 例 1 ──
  function drawElim() {
    const a = win(t, T.alg + 0.2, T.fast + 0.2, 0.5, 0.4); if (a <= 0) return;
    K.tag('只用：交换（变号）+ 倍加（不变）', DX, DY - 350, { px: 32, a: a * gin(T.m), align: 'center', color: C.inkMid, w: 900 });
    texAt('elim', DX, DY - 280, 48, { alpha: a * gin(T.pm), reveal: reveal(T.pm, 1.0), color: C.peri });
    const g = gin(T.ex, 0.5); if (g <= 0) return;
    // 网格逐步：E1 → 第一步（两行倍加）→ 交换
    const s1 = smoother(prog(t, T.s1, T.s1b + 1.2)), sw = smoother(prog(t, T.swp, T.swp + 1.0));
    const chT = [null, T.s1 + 0.4, T.s1b + 0.4];   // 每行在倍加时整体换成新值（不插值，避免出现 3.9 之类的小数）
    let rows = E1.map((r, i) => i === 0 ? r : (t >= chT[i] ? ST[0][i] : r));
    const fmt = v => { const r = Math.round(v); return Math.abs(v - r) < 0.05 ? String(r).replace('-', '−') : v.toFixed(1); };
    const x = DX - 80, y = DY - 60, px = 46, rh = px * 1.5;
    const hi = {}; if (t > T.tri) [[0, 0], [1, 1], [2, 2]].forEach(([i, j]) => { hi[i + ',' + j] = [gin(T.tri), C.peri]; });
    if (t > T.z && t < T.swp) { hi['1,1'] = [gin(T.z + 0.4), C.free]; }
    const flash = {}; [1, 2].forEach(i => { const f = win(t, chT[i], chT[i] + 1.0, 0.1, 0.5); if (f > 0) [0, 1, 2].forEach(j => { flash[i + ',' + j] = [f, C.i]; }); });
    // 交换：第 2、3 行竖直交错移动
    ctx.save(); ctx.globalAlpha = a * g;
    const G2 = new DetGrid(rows.map(r => r.map(fmt)), { fmt: v => v });
    const Lg = G2.layout({ x, y, px });
    // 画框 + 第 1 行（用 DetGrid 画全部，交换时把 2、3 行文字隐藏后自绘）
    const dim = sw > 0 && sw < 1 ? { '1,0': 0, '1,1': 0, '1,2': 0, '2,0': 0, '2,1': 0, '2,2': 0 } : {};
    const disp = sw >= 1 ? [rows[0], rows[2], rows[1]] : rows;
    const G3 = new DetGrid(disp.map(r => r.map(fmt)), { fmt: v => v });
    G3.draw(ctx, { x, y, px, a: 1, bars: 1, hi: sw >= 1 ? hi : (t > T.z ? hi : flash), dim });
    if (sw > 0 && sw < 1) {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = F.sans(px, 500);
      [[1, 2], [2, 1]].forEach(([from, to]) => { const yy = lerp(Lg.ry(from), Lg.ry(to), sw); const dx = Math.sin(Math.PI * sw) * 60 * (from === 1 ? 1 : -1); ctx.fillStyle = C.ink; rows[from].forEach((v, j) => ctx.fillText(fmt(v), Lg.cx(j) + dx, yy)); });
    }
    ctx.restore();
    const op = (txt, row, t0, t1) => K.tag(txt, x + 260, Lg.ry(row) + 10, { px: 30, a: a * win(t, t0, t1, 0.3, 0.3), color: C.peri, w: 900 });
    op('R₂ − 2R₁', 1, T.s1, T.z + 0.6); op('R₃ − 3R₁', 2, T.s1b, T.z + 0.6); op('R₂ ↔ R₃', 1, T.swp - 0.2, T.tri);
    K.tag('主元是 0！', x + 280, Lg.ry(1) + 10, { px: 32, a: a * win(t, T.z + 0.6, T.swp - 0.2, 0.3, 0.3), color: C.free, w: 900 });
    // 计分板
    const nsw = t > T.cnt ? 1 : 0;
    ctx.save(); ctx.globalAlpha = a * g; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; ctx.strokeRect(DX + 200, DY - 210, 220, 96); ctx.restore();
    K.tag('交换次数', DX + 310, DY - 182, { px: 26, a: a * g, align: 'center', color: C.inkMid, w: 700 });
    K.tag(String(nsw), DX + 310, DY - 130, { px: 46, a: a * g, align: 'center', color: nsw ? C.free : C.ink, w: 900, font: F.serif });
    texAt('ex60', DX, DY + 210, 46, { alpha: a * gin(T.sgn), reveal: reveal(T.sgn, 1.2) });
    K.tag('奇数次 → 负号', DX, DY + 300, { px: 32, a: a * gin(T.sgn + 0.4), align: 'center', color: C.free, w: 900 });
  }

  // ── 运算量 ──
  function drawOps(D) {
    const a = win(t, T.fast, T.ab, 0.5, 0.4); if (a <= 0) return;
    K.tag('10 阶：加法次数', DX, DY - 350, { px: 34, a: a * gin(T.tb), align: 'center', color: C.ink, w: 900 });
    const base = DY + 260, H = 520, gb = smoother(prog(t, T.big - 0.4, T.big + 1.4)), gs = gin(T.small, 0.6);
    // 展开法：线性比例下冲出圆盘
    ctx.save(); K.clip(D); ctx.globalAlpha = a;
    const cap = base - (DY - 300), hBig = Math.min(gb * 1400, cap); ctx.fillStyle = C.free; ctx.fillRect(DX - 260, base - hBig, 160, hBig);
    if (gb * 1400 > cap) { const yT = base - cap; ctx.fillStyle = C.disc; ctx.beginPath(); ctx.moveTo(DX - 270, yT + 34); for (let k = 0; k <= 6; k++) ctx.lineTo(DX - 270 + k * 30, yT + (k % 2 ? 18 : 34)); ctx.lineTo(DX - 90, yT + 48); for (let k = 6; k >= 0; k--) ctx.lineTo(DX - 270 + k * 30, yT + (k % 2 ? 32 : 48)); ctx.closePath(); ctx.fill(); }
    const hSm = 4 * gs;   // 按比例只有 0.04 px：画成 4 px 的细线，已是放大 ctx.fillStyle = C.j; ctx.fillRect(DX + 100, base - hSm, 160, hSm);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(DX - 380, base); ctx.lineTo(DX + 380, base); ctx.stroke(); ctx.restore();
    K.tag('余子式展开', DX - 180, base + 40, { px: 30, a: a * gin(T.tb), align: 'center', color: C.free, w: 900 });
    K.tag('消元', DX + 180, base + 40, { px: 30, a: a * gin(T.tb), align: 'center', color: C.j, w: 900 });
    K.tag(fmtBig(Math.round(3628799 * gb)), DX - 180, DY - 260, { px: 46, a: a * gin(T.big - 0.4), align: 'center', color: C.ink, w: 900, font: F.serif });
    K.tag('285', DX + 180, base - hSm - 40, { px: 50, a: a * gs, align: 'center', color: C.j, w: 900, font: F.serif });
    // 公式与 20 阶
    texAt('fact', DX - 180, DY - 170, 44, { alpha: a * gin(T.fac), color: C.ink, halo: C.disc });
    K.tag('20 阶：> 2 × 10¹⁸ 次', DX + 150, DY - 150, { px: 34, a: a * gin(T.n20), align: 'center', color: C.free, w: 900 });
    K.tag('≈ 77 年', DX + 150, DY - 80, { px: 56, a: a * gin(T.yrs) * outBack(prog(t, T.yrs, T.yrs + 0.4)), align: 'center', color: C.free, w: 900, font: F.serif });
    texAt('cube', DX + 180, DY + 60, 44, { alpha: a * gin(T.cube), color: C.j });
    K.tag('20 阶：2470 次', DX + 180, DY + 150, { px: 32, a: a * gin(T.cube + 1.2), align: 'center', color: C.j, w: 900 });
  }

  // ── det(AB) ──
  function drawAB(D) {
    const a = win(t, T.ab, T.c1, 0.5, 0.4); if (a <= 0) return;
    texAt('thm23', DX, DY - 330, 50, { alpha: a, reveal: reveal(T.ab + 0.4, 1.0), color: C.peri, halo: C.disc });
    const pA = win(t, T.geo, T.pf, 0.5, 0.4) * a;
    if (pA > 0) {
      const M = Mat(t), d = det2(M);
      ctx.save(); K.clip(D);
      P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: 0.14 * pA });
      P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.5 * pA });
      P.axes(ctx, { M, color: C.ink, width: 3, alpha: 0.8 * pA });
      const { c } = paraFill(ctx, P, M, { color: C.peri, alpha: 0.38 * pA, stroke: C.peri });
      ctx.restore();
      const O = P.S([0, 0], M); arrow(ctx, O, P.S([1, 0], M), { color: C.i, width: 9, head: 28, alpha: pA }); arrow(ctx, O, P.S([0, 1], M), { color: C.j, width: 9, head: 28, alpha: pA });
      areaLabel(K, c, d, { a: pA, px: 38, prefix: '面积 ' });
      const card = (key, t0, t1, y) => { const g = win(t, t0, t1, 0.3, 0.3); if (g > 0) texAt(key, DX + 300, y, 36, { alpha: pA * g, halo: C.disc }); };
      card('Bm', T.doB - 0.3, T.pf, DY - 200); card('Am', T.doA - 0.3, T.pf, DY - 70); card('ABm', T.abm, T.pf, DY + 60);
      K.tag('× 3', DX - 300, DY - 200, { px: 50, a: pA * gin(T.doB + 1.2), align: 'center', color: C.i, w: 900, font: F.serif });
      K.tag('× 2', DX - 300, DY - 120, { px: 50, a: pA * gin(T.doA + 1.2), align: 'center', color: C.j, w: 900, font: F.serif });
      K.tag('= × 6', DX - 300, DY - 40, { px: 50, a: pA * gin(T.six), align: 'center', color: C.peri, w: 900, font: F.serif });
    }
    const qA = a * gin(T.pf, 0.5);
    if (qA > 0) {
      texAt('pf', DX, DY - 150, 36, { alpha: qA, reveal: reveal(T.pf, 1.6) });
      K.tag('B 奇异 → AB 奇异 → 0 = 0', DX, DY - 20, { px: 34, a: qA * gin(T.pfs), align: 'center', color: C.inkMid, w: 900 });
      texAt('comm', DX, DY + 130, 46, { alpha: qA * gin(T.ba + 0.4), reveal: reveal(T.ba + 0.4, 1.2) });
      K.tag('矩阵不交换，行列式交换', DX, DY + 240, { px: 38, a: qA * gin(T.comm), align: 'center', color: C.j, w: 900, font: F.serif });
    }
  }

  // ── 推论 + 速算 ──
  function drawCor() {
    let a = win(t, T.c1, T.qz, 0.5, 0.4);
    if (a > 0) {
      K.tag('推论', DX, DY - 350, { px: 34, a, align: 'center', color: C.peri, w: 900 });
      texAt('inv', DX, DY - 250, 48, { alpha: a, reveal: reveal(T.c1 + 0.4, 1.0) });
      K.tag('放大几倍，撤回就缩小几倍', DX, DY - 150, { px: 30, a: a * gin(T.c1g), align: 'center', color: C.inkMid, w: 700 });
      texAt('cA', DX, DY - 60, 48, { alpha: a * gin(T.c2), reveal: reveal(T.c2, 1.0) });
      K.tag('每一行都乘 c', DX, DY + 10, { px: 30, a: a * gin(T.c2 + 1.0), align: 'center', color: C.inkMid, w: 700 });
      texAt('sum', DX, DY + 110, 44, { alpha: a * gin(T.c3), reveal: reveal(T.c3, 1.0), color: C.free });
      texAt('ce', DX, DY + 220, 42, { alpha: a * gin(T.ce2), reveal: reveal(T.ce2, 1.4) });
    }
    a = win(t, T.qz, T.rd, 0.5, 0.4);
    if (a > 0) {
      K.tag('A：3 阶，det A = 2', DX, DY - 300, { px: 44, a, align: 'center', color: C.peri, w: 900, font: F.serif });
      [['q1', T.qa1, '3A'], ['q2', T.qa2, 'A⁻¹'], ['q3', T.qa3, 'A⁵']].forEach(([k, ta, lab], i) => {
        const y = DY - 150 + i * 140; K.tag('det(' + lab + ') = ?', DX, y, { px: 44, a: a * gin(T.qz + 0.6 + i * 0.3) * (1 - gin(ta, 0.25)), align: 'center', color: C.ink, w: 900, font: F.serif });
        texAt(k, DX, y - 10, 50, { alpha: a * gin(ta + 0.45, 0.3) });
      });
    }
  }

  // ── 舍入误差 + 同济 ──
  function drawRd() {
    const a = win(t, T.rd, T.end0, 0.5, 0.5); if (a <= 0) return;
    K.tag('电脑：舍入误差', DX, DY - 330, { px: 38, a, align: 'center', color: C.gpt, w: 900 });
    K.tag('算出来的 det ≈ 0，很难恰好 = 0', DX, DY - 250, { px: 34, a: a * gin(T.near - 0.8), align: 'center', color: C.ink, w: 900 });
    texAt('rd', DX, DY - 140, 50, { alpha: a * gin(T.rd2), reveal: reveal(T.rd2, 1.0) });
    texAt('rd2', DX, DY - 40, 46, { alpha: a * gin(T.inv10), reveal: reveal(T.inv10, 0.8), color: C.j });
    K.tag('det 小 ≠ 接近奇异', DX, DY + 60, { px: 44, a: a * gin(T.inv10 + 0.8), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('判断接近奇异：第 6 章 · 奇异值', DX, DY + 150, { px: 30, a: a * gin(T.svd), align: 'center', color: C.inkMid, w: 700 });
    K.tag('同济：第一章 §4 例题 · 第二章 §3 方阵行列式', DX, DY + 230, { px: 28, a: a * gin(T.tj), align: 'center', color: C.gpt, w: 900 });
    texAt('tj', DX, DY + 310, 40, { alpha: a * gin(T.tj + 0.6), reveal: reveal(T.tj + 0.6, 1.0) });
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('三大结果', DX, DY - 300, { px: 50, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    texAt('thm22', DX, DY - 170, 46, { alpha: a * gin(T.e1), color: C.free });
    texAt('elim', DX, DY - 50, 46, { alpha: a * gin(T.e2) });
    texAt('thm23', DX, DY + 70, 46, { alpha: a * gin(T.e3), color: C.j });
    K.tag('下一节：伴随矩阵 · 克拉默法则', DX, DY + 220, { px: 32, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.thm, T.alg + 0.2);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('定理 2.2.2', T.thm);
      K.bullet('奇异 ⇔ det = 0', 290, gin(T.thm + 0.5), { color: C.peri }); K.bullet('消元：U = Eₖ…E₁A', 350, gin(T.U)); K.bullet('det(Eᵢ) 都 ≠ 0', 410, gin(T.ne0), { color: C.j, mark: C.j });
      K.bullet('U 零行 → 0；否则 → 1', 470, gin(T.ns)); ctx.restore(); }
    a = sec(T.alg + 0.2, T.fast + 0.2);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('消元求行列式', T.alg);
      K.bullet('交换 + 倍加 → 上三角', 290, gin(T.m)); K.bullet('± 对角线乘积', 350, gin(T.pm), { color: C.peri }); K.bullet('例 1：交换 1 次', 410, gin(T.cnt), { color: C.free, mark: C.free }); K.bullet('−(2)(−6)(−5) = −60', 470, gin(T.r60)); ctx.restore(); }
    a = sec(T.fast + 0.2, T.ab);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('运算量（表 1）', T.fast);
      K.bullet('展开：n! − 1 次加法', 290, gin(T.fac), { color: C.free, mark: C.free }); K.bullet('10 阶：3 628 799', 350, gin(T.big)); K.bullet('消元：≈ n³/3，10 阶 285', 410, gin(T.small), { color: C.j, mark: C.j }); K.bullet('软件全用消元', 470, gin(T.blink)); ctx.restore(); }
    a = sec(T.ab, T.c1);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('定理 2.2.3', T.ab);
      K.bullet('det(AB) = det A · det B', 290, gin(T.ab + 0.5), { color: C.peri }); K.bullet('先 ×3，再 ×2 → ×6', 350, gin(T.six)); K.bullet('证明：拆成初等矩阵', 410, gin(T.pf)); K.bullet('det(AB) = det(BA)', 470, gin(T.comm), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.c1, T.rd);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('推论', T.c1);
      K.bullet('det(A⁻¹) = 1 / det A', 290, gin(T.c1)); K.bullet('det(cA) = cⁿ det A', 350, gin(T.c2), { color: C.peri }); K.bullet('det(A+B) ≠ det A + det B', 410, gin(T.c3), { color: C.free, mark: C.free });
      K.bullet('速算：54、1/2、32', 470, gin(T.qa3 + 0.5)); ctx.restore(); }
    a = sec(T.rd, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('电脑上的 det', T.rd, C.gpt);
      K.bullet('舍入误差：很难恰好 0', 290, gin(T.near)); K.bullet('det 小 ≠ 接近奇异', 350, gin(T.inv10 + 0.8), { color: C.free, mark: C.free }); K.bullet('第 6 章：奇异值', 410, gin(T.svd)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('奇异 ⇔ det = 0', 290, gin(T.e1), { color: C.free, mark: C.free }); K.bullet('消元：数交换次数', 350, gin(T.e2), { color: C.peri }); K.bullet('乘积 → 乘积', 410, gin(T.e3), { color: C.j, mark: C.j }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 2.2', prog(t, 0.2, 1.3));
    drawTitle(); drawThm(); drawElim(); drawOps(D); drawAB(D); drawCor(); drawRd(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
