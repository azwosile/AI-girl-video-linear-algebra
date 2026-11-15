// 第 2 章 §2.1（下）三条直接推论（Leon 9th Thm 2.1.2–2.1.4；同济第六版 第一章 §4 性质 1、性质 3 推论、副对角线）。
// 3B1B 视角：转置 = 行围成的平行四边形与列围成的面积相同；上三角 = 拉伸 + 剪切；零列 = 压回原点；两列相同 = 边重合。
// 分镜：
//   D01–C01   钩子：一眼看出
//   C02–C07   转置：2 阶字母飞过对角线；(3,2;1,2) 的列四边形 vs 行四边形，面积都是 4；归纳；行 ⇔ 列
//   D02–C13   三角：U = 2·4·3 = 24；(3,1;0,2) = 拉伸 6 + 剪切；下三角、对角、det I
//   C14–C19   零行：展开全是 0；零列压回原点；两列相同 → 线段；(1,2,3;4,5,6;1,2,3)
//   C20–C22   速判四题
//   G01–C23   同济：Dᵀ = D；副对角线 −abc = 对角矩阵换列
//   D05–C24   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { det2, paraFill, areaLabel, DetGrid } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_ask', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_cross'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const I2 = [[1, 0], [0, 1]];
const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const MT = MJ.MT, MTt = MJ.MTt, T2 = MJ.T2, TD = MJ.T2s.D, MZ = MJ.Z, ME = MJ.E;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.5, C03: 0.4, C04: 0.5, C05: 0.4, C06: 0.4, C07: 0.3, C08: 0.4, C09: 0.5, C10: 0.4, C11: 0.6, C12: 0.4, C13: 0.4, C14: 0.7, C15: 0.3, C16: 0.5, C17: 0.4, C18: 0.4, C19: 0.3, C20: 0.7, C21: 0.4, C22: 0.4, G01: 0.6, G02: 0.4, C23: 0.4, D05: 0.7 },
    post: { C03: 0.6, C05: 0.6, C07: 0.5, C10: 0.6, C12: 0.6, C15: 0.5, C16: 0.6, C18: 0.6, C20: 1.7, C21: 0.6, C22: 0.8, C23: 0.6 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 200, oy: DY + 190, u: 95, R: 10 });
  const GU = new DetGrid(MJ.U);

  const T = {
    hook: L('D01').s, three: cue('C01', '三条定理'),
    tr: L('C02').s - 0.4, trf: cue('C02', 'A转置的行列式'),
    t2: L('C03').s - 0.3, fly: cue('C03', '转置以后'), same2: cue('C03', '是同一个数'),
    geo: L('C04').s - 0.4, col: cue('C04', 'A的两列'), row: cue('C04', '就是A的两行'),
    ex: cue('C05', '比如'), area4: cue('C05', '面积却都是四'),
    why: L('C06').s - 0.3, ind: cue('C06', '做归纳'), rc: cue('C07', '对列也成立'),
    tri: L('D02').s, thm3: L('C08').s - 0.3, u: cue('C09', '看这个上三角'), uc: cue('C09', '沿第一列展开'), u2: cue('C10', '那个二阶'), u24: cue('C10', '所以答案'),
    waste: L('D03').s, geo2: L('C11').s - 0.5, st: cue('C11', '先把i帽'), s6: cue('C11', '面积是六'),
    sh: cue('C12', '水平推一下'), shk: cue('C12', '剪切不改面积'),
    low: L('C13').s - 0.3, lowT: cue('C13', '转置一下'), dI: cue('C13', '单位矩阵'),
    z: L('C14').s - 0.5, zp: cue('C15', '证明'), zg: L('C16').s - 0.3, zc: cue('C16', '压回了原点'), zv: cue('C16', '体积为零'),
    eq: L('C17').s - 0.3, eqg: cue('C18', '两条边重合'), eqs: cue('C18', '线段'), ds: L('D04').s, ds0: cue('D04', '直接是零'), later: L('C19').s,
    qz: L('C20').s - 0.5, pause: cue('C20', '先暂停'), a1: cue('C21', '第一题'), a2: cue('C21', '第二题'), a3: cue('C22', '第三题'), a4: cue('C22', '第四题'),
    tj: L('G01').s - 0.4, tjT: cue('G01', '记号是'), anti: cue('G02', '副对角线'), abc: cue('G02', '负abc'),
    why2: L('C23').s - 0.2, swap: cue('C23', '交换了第一列'), sgn: cue('C23', '交换会带来负号'),
    end0: L('D05').s - 0.6, s1: cue('D05', '转置不变'), s2: cue('D05', '三角矩阵'), s3: cue('D05', '零行'), next: cue('C24', '下一节'),
  };

  // ── 平面关键帧（三角段与零列段）──
  const KF = [[T.st - 0.1, T.st + 1.6, TD], [T.sh - 0.1, T.sh + 1.6, T2], [T.low, T.low + 0.8, I2], [T.zc - 0.6, T.zc + 1.0, MZ], [T.eq, T.eq + 0.8, I2], [T.eqg - 0.4, T.eqg + 1.2, ME]];
  const Mat = tt => { let M = I2, prev = I2; for (const [a, b, Tg] of KF) { if (tt < a) break; M = lerpM(prev, Tg, smoother(prog(tt, a, b))); prev = Tg; } return M; };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.three, 0.3);
  TL.sfx('stamp', T.trf, 0.35); TL.sfx('swoosh_in', T.fly, 0.3); TL.sfx('check', T.same2, 0.3); TL.sfx('pluck', T.col, 0.3); TL.sfx('pluck', T.row, 0.3); TL.sfx('ding', T.area4, 0.35); TL.sfx('stamp', T.rc, 0.3);
  TL.sfx('whoosh', T.thm3, 0.3); TL.sfx('pop', T.uc, 0.3); TL.sfx('ding', T.u24, 0.35); TL.sfx('sting', T.waste + 0.1, 0.25); TL.sfx('warp', T.st, 0.4); TL.sfx('pop', T.s6, 0.3); TL.sfx('warp', T.sh, 0.4); TL.sfx('check', T.shk, 0.3); TL.sfx('click', T.dI, 0.3);
  TL.sfx('whoosh', T.z, 0.3); TL.sfx('marimba', T.zp, 0.3); TL.sfx('warp', T.zc - 0.6, 0.4); TL.sfx('thud', T.zv, 0.3); TL.sfx('warp', T.eqg - 0.4, 0.4); TL.sfx('crack', T.eqs, 0.25); TL.sfx('check', T.ds0, 0.3);
  TL.sfx('whoosh', T.qz, 0.3); TL.sfx('ding_lo', T.pause, 0.3); [T.a1, T.a2, T.a3, T.a4].forEach(t => TL.sfx('marimba_hi', t + 0.8, 0.28));
  TL.sfx('bell_soft', T.tj + 0.2, 0.3); TL.sfx('sting', T.abc, 0.3); TL.sfx('warp', T.swap, 0.35); TL.sfx('stamp', T.sgn, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.s1, T.s2, T.s3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

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
    [...'2.1 三条推论'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'THREE QUICK THEOREMS', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    K.tag('一眼看出', DX, DY - 40, { px: 70, a: a * gin(T.hook + 1.0, 0.5), align: 'center', color: C.peri, font: F.serif, w: 900 });
    ['转置', '三角', '零行'].forEach((s, i) => K.tag(s, DX + (i - 1) * 220, DY + 90, { px: 44, a: a * gin(T.three + i * 0.25, 0.4), align: 'center', color: C.ink, w: 900 }));
  }

  // ── 转置：字母飞 ──
  function drawTrAlg() {
    const a = win(t, T.tr, T.geo, 0.5, 0.4); if (a <= 0) return;
    texAt('thm2', DX, DY - 300, 64, { alpha: a, reveal: reveal(T.tr + 0.2, 1.0), color: C.peri });
    const g = gin(T.t2, 0.5); if (g <= 0) return;
    const s = smoother(prog(t, T.fly, T.fly + 1.2)), cx = DX - 200, cy = DY - 90, dx = 110, dy = 100;
    const pos = { a: [[0, 0], [0, 0]], d: [[1, 1], [1, 1]], b: [[0, 1], [1, 0]], c: [[1, 0], [0, 1]] };
    ctx.save(); ctx.globalAlpha = a * g; ctx.strokeStyle = C.ink; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx - 60, cy - 60); ctx.lineTo(cx - 60, cy + dy + 60); ctx.moveTo(cx + dx + 60, cy - 60); ctx.lineTo(cx + dx + 60, cy + dy + 60); ctx.stroke();
    ctx.setLineDash([6, 8]); ctx.globalAlpha = a * g * 0.5 * win(t, T.fly - 0.3, T.same2 + 1.0, 0.3, 0.3); ctx.beginPath(); ctx.moveTo(cx - 40, cy - 40); ctx.lineTo(cx + dx + 40, cy + dy + 40); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = a * g; ctx.font = F.serif(78, 'italic'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const [k, [p0, p1]] of Object.entries(pos)) {
      const r = lerp(p0[0], p1[0], s), c = lerp(p0[1], p1[1], s), lift = (k === 'b' || k === 'c') ? Math.sin(Math.PI * s) * 40 * (k === 'b' ? -1 : 1) : 0;
      ctx.fillStyle = k === 'b' ? C.i : k === 'c' ? C.j : C.ink; ctx.fillText(k, cx + c * dx + lift, cy + r * dy - lift);
    }
    ctx.restore();
    K.tag(t < T.fly + 0.6 ? 'A' : 'Aᵀ', cx - 140, cy + dy / 2 + 16, { px: 54, a: a * g, align: 'center', color: C.peri, w: 900, font: F.serif });
    K.tag('ad − bc', DX + 200, DY - 70, { px: 50, a: a * gin(T.same2 - 0.8), align: 'center', color: C.ink, w: 900, font: F.serif });
    K.tag('ad − cb', DX + 200, DY + 30, { px: 50, a: a * gin(T.same2 - 0.3), align: 'center', color: C.ink, w: 900, font: F.serif });
    K.tag('同一个数', DX, DY + 170, { px: 46, a: a * gin(T.same2), align: 'center', color: C.j, w: 900, font: F.serif });
  }

  // ── 平面（转置几何 + 三角 + 零列/两列相同）──
  function drawPlane(D) {
    const a = Math.max(win(t, T.geo, T.why + 0.2, 0.5, 0.4), win(t, T.geo2, T.low + 0.3, 0.4, 0.4), win(t, T.zg - 0.2, T.ds + 0.2, 0.4, 0.4)); if (a <= 0.003) return;
    const trMode = t < T.why + 0.5, M = trMode ? I2 : Mat(t);
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    if (!trMode) P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.5 * a });
    P.axes(ctx, { M: trMode ? I2 : M, color: C.ink, width: 3, alpha: 0.8 * a });
    if (trMode) {
      const gc = gin(T.col, 0.6) * a, gr = gin(T.row, 0.6) * a;
      const A1 = lerpM(I2, MT, smoother(prog(t, T.col, T.col + 1.2))), A2 = lerpM(I2, MTt, smoother(prog(t, T.row, T.row + 1.2)));
      const r1 = paraFill(ctx, P, A1, { color: C.peri, alpha: 0.32 * gc, stroke: C.peri });
      const r2 = paraFill(ctx, P, A2, { color: C.j, alpha: 0.32 * gr, stroke: C.j });
      ctx.restore();
      const arw = (M2, col, g) => { const O = P.S([0, 0]), p1 = P.S([M2[0][0], M2[1][0]]), p2 = P.S([M2[0][1], M2[1][1]]); arrow(ctx, O, p1, { color: col, width: 7, head: 24, alpha: g }); arrow(ctx, O, p2, { color: col, width: 7, head: 24, alpha: g }); };
      arw(A1, C.peri, gc); arw(A2, C.j, gr);
      K.tag('A 的两列', DX + 300, DY - 300, { px: 34, a: gc, align: 'center', color: C.peri, w: 900 });
      K.tag('A 的两行 = Aᵀ 的两列', DX + 260, DY - 240, { px: 30, a: gr, align: 'center', color: C.j, w: 900 });
      texAt('MT', DX - 300, DY - 290, 40, { alpha: a * gin(T.geo + 0.2), halo: C.disc });
      if (t > T.area4 - 0.3) { areaLabel(K, r1.c, det2(A1), { a: gc * gin(T.area4), px: 34, prefix: '面积 ', color: C.peri, dy: 20 }); areaLabel(K, r2.c, det2(A2), { a: gr * gin(T.area4 + 0.2), px: 34, prefix: '面积 ', color: C.j, dy: -20 }); }
      return;
    }
    const { c, d } = paraFill(ctx, P, M, { color: C.peri, alpha: 0.36 * a, stroke: C.peri });
    ctx.restore();
    const O = P.S([0, 0], M), pi = P.S([1, 0], M), pj = P.S([0, 1], M);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: a }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: a * clamp(Math.hypot(pj[0] - O[0], pj[1] - O[1]) / 30) });
    if (Math.abs(d) > 0.05 || t > T.zc) areaLabel(K, c, d, { a: a * 0.95, px: 38, prefix: '面积 ' });
    const card = (key, t0, t1, px = 40) => { const g = win(t, t0, t1, 0.3, 0.3); if (g > 0) texAt(key, DX + 240, DY - 300, px, { alpha: a * g, halo: C.disc }); };
    card('T2', T.geo2, T.sh - 0.2); card('T2f', T.sh - 0.2, T.low, 30); card('Z', T.zc - 0.6, T.eq); card('E', T.eq, T.ds + 0.3);
    K.tag('拉伸：3 × 2 = 6', DX + 260, DY - 180, { px: 34, a: a * win(t, T.s6 - 0.3, T.sh, 0.3, 0.3), align: 'center', color: C.i, w: 900 });
    K.tag('剪切：面积不变', DX + 260, DY - 180, { px: 34, a: a * win(t, T.shk - 0.6, T.low, 0.3, 0.3), align: 'center', color: C.j, w: 900 });
    K.tag('ĵ 压回原点', DX + 260, DY - 180, { px: 36, a: a * win(t, T.zc, T.eq, 0.3, 0.3), align: 'center', color: C.free, w: 900 });
    K.tag('两条边重合 → 线段', DX + 230, DY - 180, { px: 34, a: a * win(t, T.eqs - 0.4, T.ds + 0.3, 0.3, 0.3), align: 'center', color: C.free, w: 900 });
  }

  // ── 归纳证明 + 三角代数 + 零行代数 ──
  function drawAlg() {
    // 归纳
    let a = win(t, T.why, T.tri, 0.4, 0.4);
    if (a > 0) {
      texAt('thm2', DX, DY - 250, 56, { alpha: a, color: C.peri });
      K.tag('A 的第一行  =  Aᵀ 的第一列', DX, DY - 110, { px: 40, a: a * gin(T.why + 0.3), align: 'center', color: C.ink, w: 900, font: F.serif });
      K.tag('n − 1 阶已成立 ⇒ n 阶成立（归纳）', DX, DY - 10, { px: 32, a: a * gin(T.ind), align: 'center', color: C.inkMid, w: 700 });
      K.tag('行  ⇔  列', DX, DY + 150, { px: 80, a: a * gin(T.rc - 0.6) * outBack(prog(t, T.rc - 0.6, T.rc)), align: 'center', color: C.j, w: 900, font: F.serif });
    }
    // 三角矩阵
    a = win(t, T.thm3, T.geo2, 0.4, 0.4);
    if (a > 0) {
      const pl = tex.place('thm3', DX, DY - 290, 40, 'c'); tex.draw(ctx, pl, { alpha: a, reveal: reveal(T.thm3 + 0.2, 1.0) }); tex.draw(ctx, pl, { alpha: a * gin(T.thm3 + 1.2), only: ['d'], force: C.peri });
      const hi = {}; [[0, 0], [1, 1], [2, 2]].forEach(([i, j]) => { hi[i + ',' + j] = [gin(T.u24), C.peri]; }); [1, 2].forEach(r => { hi[r + ',0'] = [gin(T.uc) * (1 - gin(T.u24)), C.j]; });
      GU.draw(ctx, { x: DX - 230, y: DY + 40, px: 42, a: a * gin(T.u), bars: 1, hi });
      texAt('u1', DX + 140, DY + 10, 36, { alpha: a * gin(T.uc + 0.4), reveal: reveal(T.uc + 0.4, 1.4) });
      texAt('u2', DX + 140, DY + 130, 46, { alpha: a * gin(T.u24), reveal: reveal(T.u24, 1.0) });
      K.tag('3、1、5 白写了？', DX, DY + 280, { px: 40, a: a * gin(T.waste), align: 'center', color: C.free, w: 900, font: F.serif });
    }
    // 下三角 / det I（在平面段后半叠加）
    a = win(t, T.low + 0.2, T.z, 0.4, 0.4);
    if (a > 0) {
      texAt('low', DX, DY - 200, 48, { alpha: a * gin(T.lowT - 0.6), reveal: reveal(T.lowT - 0.6, 1.0) });
      K.tag('下三角 → 转置 → 上三角', DX, DY - 60, { px: 36, a: a * gin(T.lowT), align: 'center', color: C.j, w: 900 });
      texAt('detI', DX, DY + 90, 66, { alpha: a * gin(T.dI), reveal: reveal(T.dI, 0.8), color: C.peri });
      K.tag('对角矩阵：对角元直接相乘', DX, DY + 220, { px: 32, a: a * gin(T.dI - 0.8), align: 'center', color: C.inkMid, w: 700 });
    }
    // 零行代数
    a = win(t, T.z, T.zg, 0.4, 0.4);
    if (a > 0) {
      const pl = tex.place('thm4', DX, DY - 120, 46, 'c'); tex.draw(ctx, pl, { alpha: a, reveal: reveal(T.z + 0.4, 1.0) }); tex.draw(ctx, pl, { alpha: a * gin(T.z + 1.0), only: ['z'], force: C.free });
      texAt('thm4b', DX, DY + 80, 44, { alpha: a * gin(T.zp + 0.4), reveal: reveal(T.zp + 0.4, 1.4) });
      K.tag('沿零行展开', DX, DY + 200, { px: 34, a: a * gin(T.zp), align: 'center', color: C.free, w: 900 });
    }
    // 两行相同 3 阶
    a = win(t, T.ds - 0.1, T.qz, 0.4, 0.4);
    if (a > 0) {
      const pl = tex.place('same3', DX, DY - 80, 56, 'c'); tex.draw(ctx, pl, { alpha: a, reveal: reveal(T.ds, 1.0) }); tex.draw(ctx, pl, { alpha: a * gin(T.ds + 1.0), only: ['r'], force: C.free });
      K.tag('第 1 行 = 第 3 行', DX, DY + 110, { px: 38, a: a * gin(T.ds + 1.0), align: 'center', color: C.free, w: 900 });
      K.tag('代数证明：下一节（行变换）', DX, DY + 220, { px: 32, a: a * gin(T.later), align: 'center', color: C.inkMid, w: 700 });
    }
  }

  // ── 速判 ──
  function drawQuiz() {
    const a = win(t, T.qz, T.tj, 0.5, 0.4); if (a <= 0) return;
    K.tag('一眼看出', DX, DY - 360, { px: 40, a, align: 'center', color: C.peri, w: 900, font: F.serif });
    const Qs = [['q1', -200, -180, T.a1, '= −10', '下三角'], ['q2', 200, -180, T.a2, '= 0', '零列'], ['q3', -200, 140, T.a3, '= 0', '两行相同'], ['q4', 200, 140, T.a4, '= −16', 'Aᵀ']];
    Qs.forEach(([k, dx, dy, ta, ans, why], i) => {
      const g = gin(T.qz + 0.4 + i * 0.25, 0.4); if (g <= 0) return;
      const pl = tex.place(k, DX + dx, DY + dy, 34, 'c'); tex.draw(ctx, pl, { alpha: a * g });
      K.tag(String(i + 1), DX + dx - 140, DY + dy - 60, { px: 30, a: a * g, align: 'center', color: C.inkMid, w: 900 });
      const r = gin(ta + 0.6, 0.4);
      K.tag(ans, DX + dx, DY + dy + 110, { px: 40, a: a * r, align: 'center', color: C.peri, w: 900, font: F.serif });
      K.tag(why, DX + dx, DY + dy - 100, { px: 26, a: a * r, align: 'center', color: C.j, w: 900 });
    });
    // 第 2 题第二列、第 3 题行高亮（在答案出现时）
  }

  // ── 同济 ──
  function drawTj() {
    const a = win(t, T.tj, T.end0, 0.5, 0.5); if (a <= 0) return;
    K.tag('同济第一章 §4 · 性质 1', DX, DY - 340, { px: 34, a, align: 'center', color: C.gpt, w: 900 });
    K.tag('行列式与它的转置行列式相等', DX, DY - 200, { px: 40, a: a * gin(T.tj + 1.2) * (1 - gin(T.anti - 0.2, 0.4)), align: 'center', color: C.ink, w: 900, font: F.serif });
    texAt('tjT', DX, DY - 260 + 160 * (1 - gin(T.anti - 0.2, 0.4)), 60, { alpha: a * gin(T.tjT - 1.0), reveal: reveal(T.tjT - 1.0, 0.8), color: C.peri });
    const g = gin(T.anti - 0.2, 0.5); if (g <= 0) return;
    const pl = tex.place('anti', DX, DY - 60, 50, 'c'); tex.draw(ctx, pl, { alpha: a * g, reveal: reveal(T.anti - 0.2, 1.0) }); tex.draw(ctx, pl, { alpha: a * g * gin(T.abc), only: ['m'], force: C.free });
    // 对角矩阵换列动画
    const w = gin(T.why2, 0.5); if (w <= 0) return;
    const s = smoother(prog(t, T.swap, T.swap + 1.4)), x0 = DX - 110, y0 = DY + 170, cw = 110, rh = 62;
    ctx.save(); ctx.globalAlpha = a * w; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = F.serif(44, 'italic');
    const cells = [[0, 0, 'a'], [1, 1, 'b'], [2, 2, 'c']];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const hit = cells.find(x => x[0] === r && x[1] === c); if (!hit) { ctx.fillStyle = C.inkMid; ctx.font = F.sans(36); const cc = c === 0 ? lerp(0, 2, s) : c === 2 ? lerp(2, 0, s) : 1; ctx.fillText('0', x0 + cc * cw, y0 + r * rh); } }
    ctx.font = F.serif(44, 'italic');
    const lab = { a: [0, 0, 2], b: [1, 1, 1], c: [2, 2, 0] };
    for (const [k, [r, c0, c1]] of Object.entries(lab)) { const cc = lerp(c0, c1, s), lift = (k !== 'b') ? Math.sin(Math.PI * s) * 30 * (k === 'a' ? -1 : 1) : 0; ctx.fillStyle = k === 'b' ? C.ink : C.i; ctx.fillText(k, x0 + cc * cw, y0 + r * rh + lift); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 - 60, y0 - 40); ctx.lineTo(x0 - 60, y0 + 2 * rh + 40); ctx.moveTo(x0 + 2 * cw + 60, y0 - 40); ctx.lineTo(x0 + 2 * cw + 60, y0 + 2 * rh + 40); ctx.stroke();
    ctx.restore();
    K.tag(s < 0.5 ? 'abc' : '−abc', DX + 300, y0 + rh, { px: 50, a: a * w, align: 'center', color: s < 0.5 ? C.ink : C.free, w: 900, font: F.serif });
    K.tag('交换两列 → × (−1)', DX, DY + 380, { px: 32, a: a * gin(T.sgn), align: 'center', color: C.free, w: 900 });
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('一眼看出的三条', DX, DY - 300, { px: 48, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    texAt('thm2', DX, DY - 170, 52, { alpha: a * gin(T.s1) });
    K.tag('三角：对角线相乘', DX, DY - 50, { px: 42, a: a * gin(T.s2), align: 'center', color: C.ink, w: 900, font: F.serif });
    K.tag('零行 · 两行相同 → 0', DX, DY + 70, { px: 42, a: a * gin(T.s3), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('下一节：行变换 → 最快的算法', DX, DY + 220, { px: 32, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.tr, T.tri);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('定理 2.1.2 · 转置', T.tr);
      K.bullet('det(Aᵀ) = det(A)', 290, gin(T.trf), { color: C.peri }); K.bullet('2 阶：ad − bc = ad − cb', 350, gin(T.same2)); K.bullet('行围成的 = 列围成的面积', 410, gin(T.area4), { px: 32 });
      K.bullet('行的结论 ⇔ 列的结论', 470, gin(T.rc), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.tri, T.z);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('定理 2.1.3 · 三角', T.tri);
      K.bullet('det = 对角元之积', 290, gin(T.thm3 + 0.5), { color: C.peri }); K.bullet('例：2 · 4 · 3 = 24', 350, gin(T.u24)); K.bullet('拉伸给面积，剪切不改', 410, gin(T.shk), { color: C.j, mark: C.j });
      K.bullet('下三角、对角同理；det I = 1', 470, gin(T.dI), { px: 32 }); ctx.restore(); }
    a = sec(T.z, T.qz);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('定理 2.1.4 · 等于 0', T.z);
      K.bullet('有零行 / 零列 → 0', 290, gin(T.z + 0.4), { color: C.free, mark: C.free }); K.bullet('几何：基向量压回原点', 350, gin(T.zc)); K.bullet('两行 / 两列相同 → 0', 410, gin(T.eq), { color: C.free, mark: C.free });
      K.bullet('几何：两条边重合', 470, gin(T.eqg)); ctx.restore(); }
    a = sec(T.qz, T.tj);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('速判', T.qz);
      K.bullet('三角？看对角线', 290, gin(T.qz + 0.3)); K.bullet('零行零列？0', 350, gin(T.qz + 0.5)); K.bullet('两行相同？0', 410, gin(T.qz + 0.7)); K.bullet('转置？不变', 470, gin(T.qz + 0.9)); ctx.restore(); }
    a = sec(T.tj, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('同济对照', T.tj, C.gpt);
      K.bullet('性质 1：Dᵀ = D', 290, gin(T.tjT)); K.bullet('副对角线 3 阶：−abc', 350, gin(T.abc), { color: C.free, mark: C.free }); K.bullet('= 对角矩阵换两列', 410, gin(T.swap)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('转置不变', 290, gin(T.s1)); K.bullet('三角：对角线', 350, gin(T.s2), { color: C.peri }); K.bullet('零行 / 两行同：0', 410, gin(T.s3), { color: C.free, mark: C.free }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 2.1', prog(t, 0.2, 1.3));
    drawTitle(); drawTrAlg(); drawPlane(D); drawAlg(); drawQuiz(); drawTj(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
