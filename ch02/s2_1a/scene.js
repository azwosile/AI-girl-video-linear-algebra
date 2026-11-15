// 第 2 章 §2.1（上）行列式是什么（Leon 9th §2.1 Case 1–2、记号；同济第六版 第一章 §1）。
// 3B1B 视角（EoLA 第 6 集）：行列式 = 面积放大倍数；负号 = 翻面；0 = 压扁 = 奇异。
// 分镜：
//   D01–C01   开场：上一章的预告
//   C02–C05   单位正方形 → (3,0;0,2) 面积 6；圆也 ×6；det A / |A|
//   D02–C06   剪切：面积不变，det = 1
//   C07–G01   (3,1;1,2)：外框 12 − 3 − 2 − 2 = 5 → ad − bc；主 − 副对角线
//   D03–C25   负号 = 翻面：小圆弧方向；(1,2;2,1) = −3；思考题 (2,0;0,−1) = −2
//   C14–D05   连续变形穿过 0；(1,2;2,4) 压成线 → det 0 ⇔ 奇异
//   C18–C22   Leon 的代数推导：2 阶消元得 a₁₁a₂₂ − a₂₁a₁₂；记号例；1 阶
//   G02–C23   同济对照、总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { det2, polyFill, paraFill, orientArc, areaLabel, shapeMap, circlePts } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_ask', 'ds_think', 'ds_confused', 'ds_happy', 'ds_shock', 'ds_proud', 'gpt_point', 'gpt_explain'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const I2 = [[1, 0], [0, 1]];
const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const DT = Object.fromEntries(MJ.dets.map(d => [d.desc, d.A]));
  const MS = DT['拉伸 (3,0;0,2)'], SH = DT['剪切'], MG = DT['一般 (3,1;1,2)，割补 12−3−2−2'], MF = DT['翻面 (1,2;2,1)'], MZ = DT['压扁 (1,2;2,4)'], MQ = DT['思考题 (2,0;0,−1)'];
  const CUT = MJ.cut;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.4, C03: 0.3, C04: 0.3, C05: 0.3, C06: 0.4, C07: 0.6, C08: 0.3, C09: 0.3, C10: 0.3, C11: 0.6, C12: 0.3, C13: 0.3, C24: 0.5, C14: 0.5, C15: 0.6, C16: 0.3, C17: 0.3, C18: 0.8, C19: 0.4, C20: 0.3, C21: 0.4, C27: 0.4, C22: 0.6, D06: 0.6 },
    post: { C03: 0.8, C04: 0.5, C06: 0.6, C07: 1.0, C09: 0.6, C10: 0.5, C12: 0.8, C13: 0.4, C24: 1.6, C14: 0.6, C15: 0.5, C16: 0.5, C19: 0.8, C21: 0.5, C22: 0.6 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 170, oy: DY + 170, u: 95, R: 10 });

  const T = {
    q: L('D01').s, one: cue('C01', '一个变换'),
    sq: L('C02').s - 0.3, sq1: cue('C02', '面积是一'),
    s3: cue('C03', 'i帽拉长'), s6: cue('C03', '面积是六'),
    uni: cue('C04', '均匀变形'), circ: cue('C04', '随便画一个圆'), name: cue('C05', '就叫矩阵的行列式'), bars: cue('C05', '两条竖线'),
    shq: L('D02').s, sh: cue('C06', '正方形被推成'), sh1: cue('C06', '行列式等于一'),
    gen: cue('C07', 'i帽落到'), genq: cue('C07', '面积是多少'),
    box: cue('C08', '套一个长方形'), box12: cue('C08', '面积十二'),
    ty: cue('C09', '黄色'), tg: cue('C09', '绿色'), rc: cue('C09', '小长方形'),
    res: L('C10').s, adbc: cue('C10', '把数字换成'), adbc2: cue('C10', '就得到'),
    g1: L('G01').s, g1b: cue('G01', '减去'),
    neg: L('D03').s, back: L('C11').s, ccw: cue('C11', '逆时针'),
    fl: cue('C12', 'i帽落到'), arc2: cue('C12', '看小圆弧'), page: cue('C12', '翻了个面'),
    m3: L('C13').s, sgn: cue('C13', '绝对值'), film: L('D04').s,
    qz: L('C24').s, qza: L('D08').s, qzr: L('C25').s,
    rep: L('C14').s, rep0: cue('C14', '缩到'), repl: cue('C14', '中间那一刻'),
    zq: L('C15').s - 0.3, zl: cue('C15', 'i帽落到'), zline: cue('C15', '同一条直线'),
    z0: cue('C16', '面积变成零'), zf: cue('C16', '一乘四'),
    sg: cue('C17', '撤不回来'), sgn2: cue('C17', '所以'), conv: L('C26').s, conv2: cue('C26', '撤得回来'), wow: L('D05').s,
    lq: L('C18').s - 0.6, lq2: cue('C18', '什么时候'),
    l1: cue('C19', '第二行先乘'), l2: cue('C19', '再减去'), l2b: cue('C19', '就变成零'),
    lne: cue('C20', '当且仅当'), lsw: cue('C20', '先交换两行'),
    ldef: cue('C21', '于是教材定义'), lsame: cue('C21', '一模一样'),
    lex: L('C27').s - 0.2, lex2: cue('C27', '等于三乘一'),
    o1: L('C22').s - 0.4, o1n: cue('C22', '在数轴上'), o1x: cue('C22', '放大a倍'),
    tj: L('G02').s - 0.2,
    end0: L('D06').s - 0.6, z1: cue('D06', '负号'), z2: cue('D06', '等于零'), z3: L('D07').s, next: cue('C23', '下一节'),
  };

  // ── 平面关键帧：[开始, 结束, 目标矩阵] ──
  const KF = [
    [T.s3 - 0.1, T.s3 + 1.4, MS],
    [T.sh - 0.2, T.sh + 1.3, SH],
    [T.gen - 0.2, T.gen + 1.5, MG],
    [T.back, T.back + 1.0, I2],
    [T.fl - 0.1, T.fl + 2.2, MF],
    [T.qz, T.qz + 0.8, I2],
    [T.qza + 0.1, T.qza + 2.0, MQ],
    [T.rep, T.rep + 0.6, I2],
    [T.rep0 - 0.6, L('C14').e - 0.2, MF],
    [T.zl - 0.1, T.zl + 1.8, MZ],
  ];
  const Mat = tt => { let M = I2, prev = I2; for (const [a, b, Tg] of KF) { if (tt < a) break; M = lerpM(prev, Tg, smoother(prog(tt, a, b))); prev = Tg; } return M; };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('stamp', T.one, 0.3); TL.sfx('swell', T.sq, 0.3); TL.sfx('pop', T.sq1, 0.3);
  TL.sfx('warp', T.s3, 0.4); TL.sfx('ding', T.s6, 0.3); TL.sfx('pop', T.circ, 0.3); TL.sfx('stamp', T.name, 0.35); TL.sfx('click', T.bars, 0.3);
  TL.sfx('warp', T.sh, 0.4); TL.sfx('check', T.sh1, 0.3); TL.sfx('warp', T.gen, 0.4); TL.sfx('ding_lo', T.genq + 0.4, 0.25);
  TL.sfx('pluck', T.box, 0.3); TL.sfx('marimba', T.ty, 0.3); TL.sfx('marimba_hi', T.tg, 0.3); TL.sfx('marimba', T.rc, 0.3); TL.sfx('ding', T.res + 0.8, 0.3); TL.sfx('stamp', T.adbc2, 0.35); TL.sfx('bell_soft', T.g1, 0.3);
  TL.sfx('sting', T.neg + 0.2, 0.3); TL.sfx('warp', T.back, 0.3); TL.sfx('pluck', T.ccw, 0.3); TL.sfx('warp', T.fl, 0.4); TL.sfx('glitch', T.page, 0.25); TL.sfx('stamp', T.sgn, 0.3); TL.sfx('sparkle', T.film + 0.2, 0.25);
  TL.sfx('ding_lo', T.qz + 0.3, 0.3); TL.sfx('warp', T.qza + 0.1, 0.35); TL.sfx('check', T.qzr, 0.3);
  TL.sfx('warp', T.rep0 - 0.6, 0.35); TL.sfx('crack', T.repl, 0.25); TL.sfx('warp', T.zl, 0.4); TL.sfx('thud', T.z0, 0.35); TL.sfx('stamp', T.sgn2, 0.35); TL.sfx('check', T.conv2, 0.3); TL.sfx('sting', T.wow + 0.2, 0.3);
  TL.sfx('whoosh', T.lq, 0.3); [T.l1, T.l2, T.lne].forEach(t => TL.sfx('marimba', t, 0.28)); TL.sfx('stamp', T.ldef, 0.35); TL.sfx('pop', T.lex2, 0.3); TL.sfx('whoosh', T.o1, 0.3); TL.sfx('warp', T.o1x, 0.3); TL.sfx('bell_soft', T.tj + 0.2, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.z1, T.z2, T.z3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C23').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.2, L('C01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第二章 · 行列式', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'2.1 行列式'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'THE DETERMINANT', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    K.tag('面积放大了多少倍？', DX, DY, { px: 58, a: a * gin(T.one, 0.5), align: 'center', color: C.peri, font: F.serif, w: 900 });
  }

  // ── 平面 ──
  function drawPlane(D) {
    const a = win(t, T.sq, T.lq + 0.3, 0.6, 0.6); if (a <= 0.003) return;
    const M = Mat(t), d = det2(M);
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.55 * a });
    P.axes(ctx, { M, color: C.ink, width: 3, alpha: 0.8 * a });
    // 压扁的直线
    const zl = gin(T.zline, 0.5) * (t < T.lq ? 1 : 0);
    if (zl > 0) { P.line(ctx, [0, 0], [1, 2], { M: I2, color: C.free, width: 5, alpha: a * zl * 0.9 }); }
    // 割补：外框 + 切块（数学坐标，恒等变换下画）
    const cutA = win(t, T.box - 0.1, T.neg, 0.4, 0.5);
    if (cutA > 0) {
      const S = p => P.S(p, I2), [bw, bh] = CUT.box, [a1, c1] = CUT.v1, [b1, d1] = CUT.v2;
      ctx.save(); ctx.setLineDash([14, 10]); polyFill(ctx, [S([0, 0]), S([bw, 0]), S([bw, bh]), S([0, bh])], { alpha: 0, stroke: C.ink, width: 3, salpha: a * cutA * gin(T.box) }); ctx.restore();
      const piece = (pts, col, g) => polyFill(ctx, pts.map(S), { color: col, alpha: 0.55 * a * cutA * g, stroke: col, width: 2, salpha: a * cutA * g });
      const gy = gin(T.ty, 0.5), gg = gin(T.tg, 0.5), gr = gin(T.rc, 0.5);
      piece([[0, 0], [a1, 0], [a1, c1]], C.i, gy); piece([[bw, bh], [b1, bh], [b1, d1]], C.i, gy);
      piece([[0, 0], [b1, d1], [0, d1]], C.j, gg); piece([[bw, bh], [a1, c1], [bw, c1]], C.j, gg);
      piece([[a1, 0], [bw, 0], [bw, c1], [a1, c1]], C.k, gr); piece([[0, d1], [b1, d1], [b1, bh], [0, bh]], C.k, gr);
      K.tag('4', P.S([bw / 2, 0])[0], P.S([0, -0.32])[1], { px: 34, a: a * cutA * gin(T.box), align: 'center', color: C.ink, w: 900 });
      K.tag('3', P.S([bw + 0.3, 0])[0], P.S([0, bh / 2])[1], { px: 34, a: a * cutA * gin(T.box), align: 'center', color: C.ink, w: 900 });
    }
    // 平行四边形（det 实时）
    const showPara = win(t, T.sq, T.lq, 0.5, 0.5);
    const { c } = paraFill(ctx, P, M, { color: C.peri, alpha: 0.36 * a * showPara * (1 - 0.6 * cutA * gin(T.ty)), stroke: C.peri });
    // 圆：任何图形都 ×det
    const ca = win(t, T.circ - 0.1, T.name + 0.6, 0.4, 0.5);
    if (ca > 0) {
      const base = circlePts(0.5, 1.6, 0.4);
      ctx.save(); ctx.setLineDash([8, 8]); polyFill(ctx, shapeMap(P, I2, base), { alpha: 0, stroke: C.ink, width: 2, salpha: 0.6 * a * ca }); ctx.restore();
      polyFill(ctx, shapeMap(P, M, base), { color: C.j, alpha: 0.5 * a * ca, stroke: C.j, width: 3, salpha: a * ca });
      const q = P.S([0.5, 1.6], M); K.tag('面积也 × 6', q[0] + 190, q[1] - 10, { px: 44, a: a * ca, align: 'center', color: C.j, w: 900, font: F.serif });
    }
    ctx.restore();
    // 基向量
    const O = P.S([0, 0], M), pi = P.S([1, 0], M), pj = P.S([0, 1], M), ga = a * gin(T.sq, 0.6);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: ga }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: ga });
    K.tag('î', pi[0] + 14, pi[1] + 30, { px: 40, a: ga, color: C.i, w: 900, font: F.serif }); K.tag('ĵ', pj[0] - 44, pj[1] - 10, { px: 40, a: ga, color: C.j, w: 900, font: F.serif });
    // 方向小圆弧
    orientArc(ctx, P, M, { r: 0.6, alpha: a * win(t, T.back + 0.6, T.lq, 0.4, 0.4) });
    // 面积读数
    const lab = win(t, T.sq1 - 0.2, T.box, 0.3, 0.3) + win(t, T.res + 0.2, T.zq + 0.3, 0.3, 0.3) * (1 - win(t, T.res + 0.2, T.neg, 0.3, 0.3)) + win(t, T.zq + 0.3, T.lq, 0.3, 0.3);
    if (lab > 0) areaLabel(K, c, d, { a: a * Math.min(1, lab), px: 38, prefix: t < T.name ? '面积 ' : 'det = ' });
    // 矩阵卡（右上）
    const card = (key, t0, t1, lab2) => { const g = win(t, t0, t1, 0.3, 0.3); if (g <= 0) return; texAt(key, DX + 290, DY - 330, 44, { alpha: a * g, halo: C.disc }); if (lab2) K.tag(lab2, DX + 290, DY - 238, { px: 28, a: a * g, align: 'center', color: C.inkMid, w: 700 }); };
    card('M1', T.s3 - 0.3, T.sh - 0.3); card('Msh', T.sh - 0.3, T.gen - 0.3, '剪切'); card('Mg', T.gen - 0.3, T.back); card('Mf', T.fl - 0.3, T.qz); card('Mq', T.qz, T.rep, '思考题'); card('Mf', T.rep + 0.2, T.zq); card('Ms', T.zq, T.lq, '上一章的老朋友');
    // 底部公式
    const low = (key, t0, t1, px = 50, y = DY + 290, opt = {}) => { const g = win(t, t0, t1, 0.3, 0.3); if (g <= 0) return; texAt(key, DX, y, px, { alpha: a * g, reveal: prog(t, t0, t0 + 1.0), halo: C.disc, ...opt }); };
    low('det6', T.name, T.sh - 0.2, 46); low('det1', T.sh1 - 0.3, T.gen - 0.2, 46);
    low('cut', T.res, T.neg, 50, DY + 290); if (t > T.adbc - 0.2) { const g = win(t, T.adbc - 0.2, T.neg, 0.3, 0.3); const pl = tex.place('adbc', DX + 230, DY - 190, 44, 'c'); tex.draw(ctx, pl, { alpha: a * g, reveal: prog(t, T.adbc, T.adbc2 + 0.6), halo: C.disc }); tex.draw(ctx, pl, { alpha: a * g * gin(T.g1, 0.4), only: ['m'], force: C.i }); tex.draw(ctx, pl, { alpha: a * g * gin(T.g1b, 0.4), only: ['s'], force: C.j }); }
    low('flip', T.m3 - 0.2, T.qz, 46); low('quiz', T.qzr - 0.2, T.rep, 50);
    low('sing', T.zf - 0.2, T.sgn2 - 0.1, 46); low('iff', T.sgn2, T.lq, 50);
    K.tag('翻面！', DX + 290, DY - 160, { px: 46, a: a * win(t, T.page, T.qz, 0.3, 0.3), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('压成一条线', DX + 290, DY - 160, { px: 40, a: a * win(t, T.z0, T.lq, 0.3, 0.3), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('奇异', DX + 290, DY - 90, { px: 54, a: a * win(t, T.sg, T.lq, 0.3, 0.3) * outBack(prog(t, T.sg, T.sg + 0.4)), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('穿过 0 的那一刻：压扁', DX + 250, DY - 160, { px: 34, a: a * win(t, T.repl, L('C14').e + 0.4, 0.3, 0.3), align: 'center', color: C.free, w: 900 });
  }

  // ── Leon 的代数推导 ──
  function drawAlg() {
    const a = win(t, T.lq, T.end0, 0.5, 0.5); if (a <= 0) return;
    const A1 = a * (1 - gin(T.o1, 0.4));
    if (A1 > 0) {
      const top = 1 - gin(T.ldef - 0.2, 0.4);
      K.tag('什么时候 A 能用行变换化成 I？', DX, DY - 330, { px: 40, a: A1 * gin(T.lq2), align: 'center', color: C.peri, font: F.serif, w: 900 });
      texAt('L0', DX, DY - 210, 50, { alpha: A1 * gin(T.lq + 0.3), reveal: prog(t, T.lq + 0.3, T.lq + 1.2) });
      if (top > 0) {
        if (t > T.l1 - 0.2) { texAt('L1', DX + 40, DY - 70, 46, { alpha: A1 * top * gin(T.l1 - 0.2), reveal: prog(t, T.l1 - 0.2, T.l1 + 0.8) }); K.tag('R₂ × a₁₁', DX - 300, DY - 70, { px: 30, a: A1 * top * gin(T.l1), align: 'center', color: C.peri, w: 900 }); }
        if (t > T.l2 - 0.2) { const pl = tex.place('L2', DX + 40, DY + 70, 46, 'c'); tex.draw(ctx, pl, { alpha: A1 * top * gin(T.l2 - 0.2), reveal: prog(t, T.l2 - 0.2, T.l2 + 0.8) }); tex.draw(ctx, pl, { alpha: A1 * top * gin(T.l2b), only: ['k'], force: C.peri }); K.tag('R₂ − a₂₁R₁', DX - 300, DY + 70, { px: 30, a: A1 * top * gin(T.l2), align: 'center', color: C.peri, w: 900 }); }
        if (t > T.lne - 0.2) texAt('Lne', DX, DY + 210, 46, { alpha: A1 * top * gin(T.lne - 0.2), reveal: prog(t, T.lne - 0.2, T.lne + 0.8), color: C.j });
        K.tag('a₁₁ = 0：先交换两行，结论一样', DX, DY + 300, { px: 32, a: A1 * top * gin(T.lsw), align: 'center', color: C.inkMid, w: 700 });
      }
      const dg = gin(T.ldef - 0.1, 0.5);
      if (dg > 0) {
        texAt('Ldef', DX, DY - 50, 64, { alpha: A1 * dg, reveal: prog(t, T.ldef, T.ldef + 1.0), color: C.ink });
        K.tag('= ad − bc（割补得到的）', DX, DY + 50, { px: 36, a: A1 * gin(T.lsame), align: 'center', color: C.j, w: 900 });
        if (t > T.lex - 0.2) { texAt('leonEx', DX, DY + 200, 48, { alpha: A1 * gin(T.lex), reveal: prog(t, T.lex, T.lex2 + 1.2) }); K.tag('教材记号：竖线', DX, DY + 290, { px: 28, a: A1 * gin(T.lex), align: 'center', color: C.inkMid }); }
      }
    }
    // 1 阶 + 数轴
    const A2 = a * gin(T.o1, 0.5);
    if (A2 > 0) {
      texAt('one', DX, DY - 250, 60, { alpha: A2, reveal: prog(t, T.o1, T.o1 + 1.0) });
      const nl = gin(T.o1n, 0.5);
      if (nl > 0) {
        const y = DY - 60, x0 = DX - 380, u = 120, s = smoother(prog(t, T.o1x - 0.3, T.o1x + 1.0)), av = 2.5;
        ctx.save(); ctx.globalAlpha = A2 * nl; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 - 40, y); ctx.lineTo(x0 + 6.4 * u, y); ctx.stroke();
        ctx.font = F.sans(26); ctx.fillStyle = C.inkMid; ctx.textAlign = 'center';
        for (let k = 0; k <= 6; k++) { ctx.fillRect(x0 + k * u - 1.5, y - 10, 3, 20); ctx.fillText(String(k), x0 + k * u, y + 38); }
        ctx.fillStyle = C.i; ctx.globalAlpha = A2 * nl * 0.85; ctx.fillRect(x0, y - 9, u * lerp(1, av, s), 18); ctx.restore();
        K.tag(s < 0.5 ? '长度 1' : '长度 × a', x0 + u * lerp(1, av, s) / 2, y - 48, { px: 32, a: A2 * nl, align: 'center', color: C.i, w: 900 });
        K.tag('a = 2.5', x0 + u * av, y + 80, { px: 28, a: A2 * gin(T.o1x + 0.6), align: 'center', color: C.inkMid });
      }
      if (t > T.tj - 0.1) { K.tag('同济第一章 §1 · 二阶行列式', DX, DY + 150, { px: 32, a: A2 * gin(T.tj), align: 'center', color: C.gpt, w: 900 }); texAt('tj', DX, DY + 260, 46, { alpha: A2 * gin(T.tj), reveal: prog(t, T.tj, T.tj + 1.2) }); }
    }
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('行列式 = 面积放大倍数', DX, DY - 290, { px: 50, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('负号 = 翻面', DX - 200, DY - 180, { px: 40, a: a * gin(T.z1), align: 'center', color: C.free, w: 900 });
    K.tag('0 = 压扁 = 奇异', DX + 200, DY - 180, { px: 40, a: a * gin(T.z2), align: 'center', color: C.free, w: 900 });
    const pl = tex.place('adbc', DX, DY - 20, 66, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.z3) }); tex.draw(ctx, pl, { alpha: a * gin(T.z3), only: ['m'], force: C.i }); tex.draw(ctx, pl, { alpha: a * gin(T.z3 + 0.6), only: ['s'], force: C.j });
    K.tag('主对角线 − 副对角线', DX, DY + 110, { px: 34, a: a * gin(T.z3 + 0.4), align: 'center', color: C.inkMid, w: 700 });
    K.tag('下一节：三阶 · 体积', DX, DY + 240, { px: 34, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.sq, T.gen - 0.3);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('行列式 = 面积倍数', T.sq);
      K.bullet('单位正方形：面积 1', 290, gin(T.sq1)); K.bullet('(3, 0; 0, 2) → 面积 6', 350, gin(T.s6)); K.bullet('任何图形都 × 6', 410, gin(T.circ), { color: C.j, mark: C.j });
      K.bullet('记作 det A 或 |A|', 470, gin(T.name), { color: C.peri }); K.bullet('剪切：面积不变 → 1', 530, gin(T.sh1)); ctx.restore(); }
    a = sec(T.gen - 0.2, T.neg);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('割补出公式', T.gen - 0.1);
      K.bullet('外框 4 × 3 = 12', 290, gin(T.box12)); K.bullet('切掉 3 + 2 + 2，剩 5', 350, gin(T.rc)); K.bullet('一般：ad − bc', 410, gin(T.adbc2), { color: C.peri });
      K.note('GPT · 背法', ['主对角线相乘 − 副对角线相乘'], 450, gin(T.g1, 0.5)); ctx.restore(); }
    a = sec(T.neg + 0.2, T.zq);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('符号 = 方向', T.neg + 0.3);
      K.bullet('î → ĵ 逆时针：正', 290, gin(T.ccw)); K.bullet('变成顺时针：翻面，负', 350, gin(T.page), { color: C.free, mark: C.free }); K.bullet('|det| = 面积倍数', 410, gin(T.sgn), { color: C.peri });
      K.bullet('思考题：(2, 0; 0, −1) = −2', 470, gin(T.qzr), { px: 32 }); ctx.restore(); }
    a = sec(T.zq + 0.2, T.lq);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('等于 0 = 压扁', T.zq + 0.3);
      K.bullet('两列落在同一条线上', 290, gin(T.zline)); K.bullet('面积变成 0', 350, gin(T.z0)); K.bullet('撤不回来：奇异', 410, gin(T.sg), { color: C.free, mark: C.free }); K.bullet('det A ≠ 0 ⇔ 可逆', 470, gin(T.conv2), { color: C.peri }); ctx.restore(); }
    a = sec(T.lq + 0.2, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('Leon 的出发点', T.lq + 0.3);
      K.bullet('2 阶：消元看能否化成 I', 290, gin(T.lq2)); K.bullet('a₁₁a₂₂ − a₂₁a₁₂ 定义成 det A', 350, gin(T.ldef), { color: C.peri, px: 32 }); K.bullet('1 阶：det(a) = a', 410, gin(T.o1));
      K.note('同济第六版 · 对照', ['第一章 §1 二阶行列式', '记号、公式完全相同'], 450, gin(T.tj, 0.5)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('|det| = 面积倍数', 290, gin(T.end0 + 0.3)); K.bullet('负 = 翻面', 350, gin(T.z1), { color: C.free, mark: C.free }); K.bullet('0 ⇔ 奇异', 410, gin(T.z2), { color: C.free, mark: C.free }); K.bullet('ad − bc', 470, gin(T.z3), { color: C.peri }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 2.1', prog(t, 0.2, 1.3));
    drawTitle(); drawPlane(D); drawAlg(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
