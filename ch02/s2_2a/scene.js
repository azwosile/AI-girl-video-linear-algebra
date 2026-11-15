// 第 2 章 §2.2（上）行变换怎样改变行列式（Leon 9th §2.2：Lemma 2.2.1、Row Operation I/II/III、(2)、列变换、Note；同济 第一章 §4 性质 2–6）。
// 3B1B 视角：画两“行”围成的平行四边形——交换 = 翻面，倍乘 = 一条边拉长，倍加 = 沿底边滑动（同底等高）。
// 分镜：
//   D01–C04   钩子：展开太慢 → 消元；画行向量 (3,0)、(1,2)，面积 6
//   C05–C08   I 交换：顺序反了 → 翻面 → −6；2 阶验证；两行相同 ⇒ det = −det ⇒ 0（还上节的债）
//   C09–C11   II 倍乘：第二行 ×2，高翻倍 → 12；沿该行展开提出 α；只乘一行
//   C12–C14   III 倍加：r₂ 沿 r₁ 方向滑，同底等高 → 6；滑到 (0,2) → 对角 3·2
//   D03–C20   Lemma 2.2.1：数值验证 0；抄本矩阵两行相同；倍加的代数证明
//   G01–C22   汇总 det(EA)=det(E)det(A)；列变换；倍数行 ⇒ 0
//   C23–C25   速判：det B = 3 的四步
//   G02–G03   同济：性质 2–6 记号；性质 5 拆一行
//   D05–C26   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { det2, paraFill, orientArc, areaLabel } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_think', 'ds_ask', 'ds_confused', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_explain'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));
const Tr = M => M[0].map((_, j) => M.map(r => r[j]));

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const A = MJ.A, O = MJ.ops;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.3, C03: 0.6, C04: 0.3, C05: 0.6, C06: 0.4, C07: 0.5, C08: 0.3, C09: 0.7, C10: 0.4, C11: 0.4, C12: 0.7, C13: 0.4, C14: 0.5, C15: 0.7, C16: 0.4, C17: 0.4, C18: 0.5, C19: 0.4, C20: 0.5, G01: 0.6, C21: 0.4, C22: 0.4, C23: 0.7, C24: 0.4, G02: 0.6, G03: 0.4, D05: 0.7 },
    post: { C03: 0.6, C06: 0.9, C07: 0.6, C08: 0.6, C09: 0.9, C10: 0.5, C13: 0.9, C14: 0.9, C17: 0.8, C19: 0.6, C20: 0.8, G01: 0.8, C22: 0.6, C23: 2.5, C24: 0.6, G03: 0.8 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 210, oy: DY + 140, u: 90, R: 10 });

  const T = {
    hook: L('D01').s, elim: cue('C01', '就是消元'), diag: cue('C01', '看对角线'), q: cue('C02', '会把行列式'),
    rows: L('C03').s - 0.4, r1: cue('C03', '三、零'), r2: cue('C03', '一、二'), a6: cue('C03', '等于六'), tr: cue('C04', '转置不改变'),
    sw: L('C05').s - 0.4, swg: cue('C05', '先后顺序反了'), ccw: cue('C06', '原来是逆时针'), cw: cue('C06', '现在变成顺时针'), m6: cue('C06', '负六'),
    sw2: L('C07').s - 0.3, ind: cue('C07', 'n阶'), same: L('D02').s, eqz: cue('C08', '只能是零'), debt: cue('C08', '欠的证明'),
    sc: L('C09').s - 0.5, scg: cue('C09', '第二行乘二'), a12: cue('C09', '面积变成十二'), scp: cue('C10', '沿着这一行展开'), scp2: cue('C10', '提出来'), one: cue('C11', '只乘了一行'), all: cue('C11', '整个矩阵'),
    ad: L('C12').s - 0.5, adg: cue('C12', '看第二个向量'), base: cue('C13', '底是第一行'), hgt: cue('C13', '高是'), a6b: cue('C13', '还是六'),
    back: cue('C14', '往回滑'), dg: cue('C14', '对角矩阵'), seed: cue('C14', '雏形'),
    why: L('D03').s, lem: L('C15').s - 0.5, lemS: cue('C15', '加起来等于零'),
    lt: L('C16').s - 0.3, lc: cue('C16', '配第二行'), ln: L('C17').s - 0.2, l0: cue('C17', '真的是零'),
    cp: L('C18').s - 0.3, cp2: cue('C18', '两行相同'), cx: L('C19').s - 0.2, cx2: cue('C19', '一模一样'), cx3: cue('C19', '展开式'),
    pf: L('C20').s - 0.3, pf2: cue('C20', '拆成两块'), pf3: cue('C20', 'c乘零'),
    sum: L('G01').s - 0.4, sumE: cue('G01', '交换是负一'), col: L('C21').s - 0.2, mul: L('C22').s - 0.2, mul0: cue('C22', '就出现零行'),
    qz: L('C23').s - 0.5, pause: cue('C23', '先暂停'), q1: cue('C24', '交换一、二行'), q2: cue('C24', '第二行乘四'), q3: cue('C24', '第三行减去'), q4: L('D04').s, q4b: cue('D04', '每一行都乘二'), ok: L('C25').s,
    tj: L('G02').s - 0.4, tj5: L('G03').s - 0.2, tj5b: cue('G03', '只拆那一行'),
    end0: L('D05').s - 0.6, s1: cue('D05', '交换变号'), s2: cue('D05', '倍乘'), s3: cue('D05', '倍加不变'), next: cue('C26', '下一节'),
  };

  // ── 行向量关键帧（Mt 的两列 = A 的两行）──
  const A0 = Tr(A);
  const KF = [[T.sc - 0.2, T.sc + 0.6, A0], [T.scg, T.scg + 1.6, Tr(O.scale)], [T.ad - 0.2, T.ad + 0.6, A0], [T.adg, T.adg + 2.2, Tr(O.add)], [T.back, T.back + 2.2, Tr(O.diag)]];
  const Mat = tt => { let M = A0, prev = A0; for (const [a, b, Tg] of KF) { if (tt < a) break; M = lerpM(prev, Tg, smoother(prog(tt, a, b))); prev = Tg; } return M; };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.elim, 0.3); TL.sfx('ding_lo', T.q, 0.3);
  TL.sfx('swell', T.rows, 0.3); TL.sfx('pluck', T.r1, 0.3); TL.sfx('pluck', T.r2, 0.3); TL.sfx('ding', T.a6, 0.3);
  TL.sfx('swoosh_in', T.swg - 0.6, 0.35); TL.sfx('glitch', T.cw, 0.3); TL.sfx('stamp', T.m6, 0.35); TL.sfx('marimba', T.sw2 + 0.3, 0.28); TL.sfx('sting', T.same + 0.2, 0.25); TL.sfx('check', T.eqz, 0.35);
  TL.sfx('warp', T.scg, 0.4); TL.sfx('ding', T.a12, 0.3); TL.sfx('marimba', T.scp2, 0.28); TL.sfx('ding_lo', T.all, 0.3);
  TL.sfx('warp', T.adg, 0.4); TL.sfx('pluck', T.base, 0.3); TL.sfx('pluck', T.hgt, 0.3); TL.sfx('check', T.a6b, 0.3); TL.sfx('warp', T.back, 0.35); TL.sfx('ding', T.dg, 0.3);
  TL.sfx('whoosh', T.lem, 0.3); TL.sfx('stamp', T.lemS, 0.3); TL.sfx('marimba', T.lc, 0.28); TL.sfx('ding', T.l0, 0.35); TL.sfx('swoosh_in', T.cp, 0.3); TL.sfx('crack', T.cp2, 0.25); TL.sfx('check', T.cx2, 0.3); TL.sfx('stamp', T.pf3, 0.35);
  TL.sfx('bell_soft', T.sum + 0.2, 0.3); TL.sfx('click', T.col, 0.3); TL.sfx('thud', T.mul0, 0.3);
  TL.sfx('whoosh', T.qz, 0.3); TL.sfx('ding_lo', T.pause, 0.3); [T.q1, T.q2, T.q3, T.q4b].forEach(t => TL.sfx('marimba_hi', t + 0.6, 0.28)); TL.sfx('sparkle', T.ok, 0.3);
  TL.sfx('bell_soft', T.tj + 0.2, 0.3); TL.sfx('pop', T.tj5 + 0.4, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.s1, T.s2, T.s3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C26').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);
  const reveal = (t0, d = 1.0) => prog(t, t0, t0 + d);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C02').e - 0.2, L('C02').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第二章 · 行列式', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'2.2 行变换'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'ROW OPERATIONS', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    // 钩子：项数 n!
    const g = a * gin(T.hook + 0.4, 0.5);
    [['2 阶', '2'], ['3 阶', '6'], ['4 阶', '24'], ['5 阶', '120']].forEach(([n, v], i) => {
      const x = DX - 330 + i * 220, gg = g * gin(T.hook + 0.4 + i * 0.5, 0.3);
      K.tag(n, x, DY - 120, { px: 34, a: gg, align: 'center', color: C.inkMid, w: 700 }); K.tag(v + ' 项', x, DY - 50, { px: 48, a: gg, align: 'center', color: i > 1 ? C.free : C.ink, w: 900, font: F.serif });
    });
    K.tag('消元 → 三角 → 对角线相乘', DX, DY + 110, { px: 44, a: a * gin(T.elim, 0.5), align: 'center', color: C.peri, w: 900, font: F.serif });
    K.tag('每种行变换，det 变成多少？', DX, DY + 220, { px: 38, a: a * gin(T.q, 0.5), align: 'center', color: C.ink, w: 900 });
  }

  // ── 行向量平面 ──
  function drawPlane(D) {
    const a = win(t, T.rows, T.why + 0.3, 0.6, 0.5) * (1 - win(t, T.sw2, T.sc - 0.2, 0.4, 0.4) * 0.0); if (a <= 0.003) return;
    const swS = smoother(prog(t, T.swg - 0.6, T.swg + 0.6)) * (1 - smoother(prog(t, T.sc - 0.3, T.sc + 0.3)));
    let M = Mat(t); if (swS > 0.5) M = [[M[0][1], M[0][0]], [M[1][1], M[1][0]]];
    const d = det2(M);
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.2 * a });
    P.axes(ctx, { M: [[1, 0], [0, 1]], color: C.inkMid, width: 2, alpha: 0.5 * a });
    // 同底等高辅助线
    const hA = a * win(t, T.adg - 0.3, T.why, 0.4, 0.4);
    if (hA > 0) {
      ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = C.j; ctx.lineWidth = 3; ctx.globalAlpha = hA * 0.8;
      const y2 = P.S([0, 2])[1]; ctx.beginPath(); ctx.moveTo(P.S([-2, 0])[0], y2); ctx.lineTo(P.S([6, 0])[0], y2); ctx.stroke(); ctx.restore();
    }
    const fillA = a * gin(T.r2, 0.6);
    const { c } = paraFill(ctx, P, M, { color: C.peri, alpha: 0.34 * fillA, stroke: C.peri });
    ctx.restore();
    // 行向量
    const O0 = P.S([0, 0]), p1 = P.S([M[0][0], M[1][0]]), p2 = P.S([M[0][1], M[1][1]]);
    const g1 = a * gin(T.r1, 0.5), g2 = a * gin(T.r2, 0.5);
    // 交换时：标签与颜色跟着“第几行”走
    const c1 = swS > 0.5 ? C.j : C.i, c2 = swS > 0.5 ? C.i : C.j;
    arrow(ctx, O0, p1, { color: c1, width: 9, head: 28, alpha: swS > 0.5 ? g2 : g1 }); arrow(ctx, O0, p2, { color: c2, width: 9, head: 28, alpha: swS > 0.5 ? g1 : g2 });
    const lab = (txt, p, col, al) => K.tag(txt, p[0] + 18, p[1] - 18, { px: 38, a: al, color: col, w: 900, font: F.serif });
    const pA = P.S([A0[0][0], A0[1][0]]), pB = P.S([M[0][1], M[1][1]]), pAm = P.S([M[0][0], M[1][0]]);
    if (swS > 0 && swS < 1) {   // 标签飞行
      const fp = (u, v) => [lerp(u[0], v[0], swS), lerp(u[1], v[1], swS) - Math.sin(Math.PI * swS) * 60];
      const q1 = P.S([A0[0][0], A0[1][0]]), q2 = P.S([A0[0][1], A0[1][1]]);
      lab('r₁', fp(q1, q2), C.i, g1); lab('r₂', fp(q2, q1), C.j, g2);
    } else { lab(swS >= 1 ? 'r₂' : 'r₁', pAm, c1, swS >= 1 ? g2 : g1); lab(swS >= 1 ? 'r₁' : 'r₂', pB, c2, swS >= 1 ? g1 : g2); }
    // 方向小圆弧（交换段）
    orientArc(ctx, P, M, { r: 0.7, alpha: a * win(t, T.ccw - 0.3, T.sc - 0.3, 0.3, 0.3) });
    // 面积读数
    if (t > T.a6 - 0.3) areaLabel(K, c, d, { a: fillA * gin(T.a6), px: 38, prefix: 'det = ' });
    // 右上矩阵卡 + 运算
    const card = (key, op, t0, t1) => { const g = win(t, t0, t1, 0.3, 0.3); if (g <= 0) return; texAt(key, DX + 300, DY - 320, 40, { alpha: a * g, halo: C.disc }); if (op) texAt(op, DX + 300, DY - 210, 34, { alpha: a * g, color: C.peri, halo: C.disc }); };
    const cA = win(t, T.rows + 0.3, T.swg - 0.3, 0.3, 0.3); if (cA > 0) { const pl = tex.place('A', DX + 300, DY - 320, 40, 'c'); tex.draw(ctx, pl, { alpha: a * cA, halo: C.disc }); tex.draw(ctx, pl, { alpha: a * cA * gin(T.r1), only: ['r1'], force: C.i }); tex.draw(ctx, pl, { alpha: a * cA * gin(T.r2), only: ['r2'], force: C.j }); }
    card('Msw', 'opSw', T.swg - 0.3, T.sc - 0.2); card('Msc', 'opSc', T.scg - 0.2, T.ad - 0.2); card('Mad', 'opAd', T.adg - 0.2, T.back - 0.2); card('Mdg', 'opDg', T.back - 0.2, T.why + 0.3);
    K.tag('翻面！', DX + 300, DY - 120, { px: 44, a: a * win(t, T.cw, T.sw2 + 0.3, 0.3, 0.3), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('高翻倍', DX + 300, DY - 120, { px: 40, a: a * win(t, T.a12 - 0.6, T.scp, 0.3, 0.3), align: 'center', color: C.i, w: 900, font: F.serif });
    K.tag('同底等高', DX + 300, DY - 120, { px: 44, a: a * win(t, T.hgt, T.back, 0.3, 0.3), align: 'center', color: C.j, w: 900, font: F.serif });
    K.tag('3 × 2 = 6', DX + 300, DY - 120, { px: 44, a: a * win(t, T.dg, T.why + 0.3, 0.3, 0.3), align: 'center', color: C.peri, w: 900, font: F.serif });
    K.tag('转置不变 → 画行 = 画列', DX, DY + 330, { px: 34, a: a * win(t, T.tr, T.sw, 0.3, 0.3), align: 'center', color: C.inkMid, w: 700 });
    // 底部代数
    const low = (key, t0, t1, px = 36, y = DY + 330, opt = {}) => { const g = win(t, t0, t1, 0.3, 0.3); if (g > 0) texAt(key, DX, y, px, { alpha: a * g, reveal: reveal(t0, 1.0), halo: C.disc, ...opt }); };
    low('sw2', T.sw2, T.same, 38); low('eqz', T.eqz - 0.3, T.sc - 0.2, 46, DY + 330, { color: C.j });
    low('sc1', T.scp, T.one, 37, DY + 300); low('sc2', T.scp2, T.one, 40, DY + 370, { color: C.peri });
    K.tag('只乘一行！整个矩阵 × α 不是 × α', DX, DY + 330, { px: 32, a: a * win(t, T.one, T.ad - 0.2, 0.3, 0.3), align: 'center', color: C.free, w: 900 });
    K.tag('消元求行列式的雏形', DX, DY + 330, { px: 34, a: a * win(t, T.seed, T.why + 0.3, 0.3, 0.3), align: 'center', color: C.peri, w: 900 });
  }

  // ── 引理 2.2.1 ──
  function drawLem() {
    const a = win(t, T.lem, T.sum, 0.5, 0.4); if (a <= 0) return;
    K.tag('Lemma 2.2.1', DX, DY - 360, { px: 32, a, align: 'center', color: C.peri, w: 900 });
    const top = 1 - gin(T.pf, 0.5);
    texAt('lem', DX, DY - 270, 38, { alpha: a * (1 - gin(T.pf, 0.5) * 0.0), reveal: reveal(T.lem + 0.3, 1.4) });
    // 数值验证
    const nA = a * win(t, T.lt, T.cp, 0.4, 0.4);
    if (nA > 0) {
      const pl = tex.place('L', DX - 200, DY - 40, 44, 'c'); tex.draw(ctx, pl, { alpha: nA }); tex.draw(ctx, pl, { alpha: nA * gin(T.lt + 0.6), only: ['r'], force: C.i });
      K.tag('第二行的代数余子式', DX + 220, DY - 110, { px: 30, a: nA * gin(T.lc), align: 'center', color: C.j, w: 900 });
      K.tag('−14   −8   17', DX + 220, DY - 40, { px: 46, a: nA * gin(T.lc + 0.4), align: 'center', color: C.j, w: 900, font: F.serif });
      texAt('lemN', DX, DY + 150, 40, { alpha: nA * gin(T.ln), reveal: reveal(T.ln, 1.6) });
      K.tag('真的是 0', DX, DY + 260, { px: 46, a: nA * gin(T.l0) * outBack(prog(t, T.l0, T.l0 + 0.4)), align: 'center', color: C.j, w: 900, font: F.serif });
    }
    // 抄本矩阵
    const cA = a * win(t, T.cp, T.pf, 0.4, 0.4);
    if (cA > 0) {
      const pl = tex.place('Lc', DX - 200, DY - 40, 44, 'c'); tex.draw(ctx, pl, { alpha: cA, reveal: reveal(T.cp, 0.8) }); tex.draw(ctx, pl, { alpha: cA * gin(T.cp + 0.5), only: ['r'], force: C.i });
      K.tag('第二行 ← 第一行的抄本', DX + 220, DY - 80, { px: 30, a: cA * gin(T.cp + 0.5), align: 'center', color: C.i, w: 900 });
      texAt('Lc0', DX + 220, DY, 42, { alpha: cA * gin(T.cp2), color: C.free });
      texAt('Lcexp', DX, DY + 150, 40, { alpha: cA * gin(T.cx), reveal: reveal(T.cx, 1.2) });
      K.tag('A₂ⱼ 不看第二行 → 与 A 的相同', DX, DY + 250, { px: 32, a: cA * gin(T.cx2), align: 'center', color: C.j, w: 900 });
    }
    // 倍加的证明
    const pA = a * gin(T.pf, 0.5);
    if (pA > 0) {
      K.tag('III 倍加：沿新的第 j 行展开', DX, DY - 130, { px: 34, a: pA, align: 'center', color: C.peri, w: 900 });
      texAt('add1', DX, DY - 30, 38, { alpha: pA, reveal: reveal(T.pf, 1.4) });
      const pl = tex.place('add2', DX, DY + 90, 50, 'c'); tex.draw(ctx, pl, { alpha: pA * gin(T.pf2), reveal: reveal(T.pf2, 1.0) }); tex.draw(ctx, pl, { alpha: pA * gin(T.pf2 + 0.6), only: ['x'], force: C.j }); tex.draw(ctx, pl, { alpha: pA * gin(T.pf3), only: ['y'], force: C.free });
      K.tag('引理：别人家的代数余子式 → 0', DX, DY + 200, { px: 32, a: pA * gin(T.pf3), align: 'center', color: C.free, w: 900 });
    }
  }

  // ── 汇总 + 列变换 + 倍数行 ──
  function drawSum2() {
    const a = win(t, T.sum, T.qz, 0.5, 0.4); if (a <= 0) return;
    texAt('sumF', DX, DY - 290, 50, { alpha: a, reveal: reveal(T.sum + 0.3, 1.0), color: C.peri });
    texAt('sumE', DX - 160, DY - 130, 42, { alpha: a * gin(T.sumE), reveal: reveal(T.sumE, 1.2) });
    ['交换', '倍乘', '倍加'].forEach((s, i) => K.tag(s, DX + 150, DY - 178 + i * 50, { px: 30, a: a * gin(T.sumE + i * 0.8), color: [C.free, C.i, C.j][i], w: 900 }));
    texAt('col', DX, DY + 40, 36, { alpha: a * gin(T.col), reveal: reveal(T.col, 1.4) });
    K.tag('列变换：效果一样', DX, DY + 110, { px: 30, a: a * gin(T.col + 1.0), align: 'center', color: C.inkMid, w: 700 });
    const pl = tex.place('mult', DX, DY + 250, 40, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.mul), reveal: reveal(T.mul, 1.6) }); tex.draw(ctx, pl, { alpha: a * gin(T.mul + 0.5), only: ['r'], force: C.i }); tex.draw(ctx, pl, { alpha: a * gin(T.mul0), only: ['z'], force: C.free });
  }

  // ── 速判 ──
  function drawQuiz() {
    const a = win(t, T.qz, T.tj, 0.5, 0.4); if (a <= 0) return;
    texAt('Bq', DX, DY - 320, 56, { alpha: a, color: C.peri });
    K.tag('3 阶', DX + 210, DY - 320, { px: 30, a, align: 'center', color: C.inkMid, w: 700 });
    const rows = [['R₁ ↔ R₂', T.q1, '−3'], ['R₂ × 4', T.q2, '12'], ['R₃ − 2R₁', T.q3, '3'], ['2B', T.q4b, '24']];
    rows.forEach(([op, ta, ans], i) => {
      const y = DY - 170 + i * 115, g = gin(T.qz + 0.5 + i * 0.3, 0.4); if (g <= 0) return;
      K.tag(op, DX - 140, y, { px: 44, a: a * g, align: 'center', color: C.ink, w: 900, font: F.serif });
      K.tag('→', DX + 40, y, { px: 40, a: a * g, align: 'center', color: C.inkMid, w: 700 });
      K.tag(ans, DX + 180, y, { px: 50, a: a * gin(ta + 0.6, 0.4), align: 'center', color: i === 3 ? C.free : C.peri, w: 900, font: F.serif });
    });
    K.tag('2³ · 3 = 24（每一行都乘 2）', DX, DY + 330, { px: 32, a: a * gin(T.q4b + 1.0), align: 'center', color: C.free, w: 900 });
  }

  // ── 同济 ──
  function drawTj() {
    const a = win(t, T.tj, T.end0, 0.5, 0.5); if (a <= 0) return;
    K.tag('同济第一章 §4 · 性质 2–6', DX, DY - 320, { px: 34, a, align: 'center', color: C.gpt, w: 900 });
    texAt('tjops', DX, DY - 220, 44, { alpha: a * gin(T.tj + 0.8), reveal: reveal(T.tj + 0.8, 1.4) });
    K.tag('列：c 代替 r', DX, DY - 140, { px: 30, a: a * gin(T.tj + 2.4), align: 'center', color: C.inkMid, w: 700 });
    const g = gin(T.tj5, 0.5); if (g <= 0) return;
    K.tag('性质 5：一行拆成两行之和', DX, DY - 30, { px: 34, a: a * g, align: 'center', color: C.peri, w: 900 });
    const pl = tex.place('tj5', DX, DY + 110, 44, 'c'); tex.draw(ctx, pl, { alpha: a * g, reveal: reveal(T.tj5 + 0.3, 1.4) }); tex.draw(ctx, pl, { alpha: a * g * gin(T.tj5 + 1.0), only: ['p'], force: C.i });
    K.tag('只拆那一行！', DX, DY + 250, { px: 42, a: a * gin(T.tj5b), align: 'center', color: C.free, w: 900, font: F.serif });
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('行变换 → 行列式', DX, DY - 300, { px: 48, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    [['交换', '× (−1)', C.free, T.s1], ['倍乘 α', '× α', C.i, T.s2], ['倍加', '不变', C.j, T.s3]].forEach(([k, v, col, ta], i) => {
      const y = DY - 160 + i * 120, g = a * gin(ta, 0.4);
      K.tag(k, DX - 150, y, { px: 46, a: g, align: 'center', color: col, w: 900, font: F.serif }); K.tag(v, DX + 150, y, { px: 46, a: g, align: 'center', color: C.ink, w: 900, font: F.serif });
    });
    K.tag('下一节：奇异 ⇔ det = 0 · 消元法', DX, DY + 260, { px: 32, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.rows, T.sc - 0.3);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('I 交换两行', T.rows);
      K.bullet('画两行围成的面积', 290, gin(T.rows + 0.3)); K.bullet('顺序反了 → 翻面', 350, gin(T.cw), { color: C.free, mark: C.free }); K.bullet('det → −det', 410, gin(T.m6), { color: C.peri });
      K.bullet('两行相同 ⇒ det = 0', 470, gin(T.eqz), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.sc - 0.3, T.ad - 0.3);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('II 一行乘 α', T.sc);
      K.bullet('一条边拉长 α 倍', 290, gin(T.scg)); K.bullet('det → α det', 350, gin(T.a12), { color: C.peri }); K.bullet('沿该行展开，提出 α', 410, gin(T.scp)); K.bullet('只乘一行！', 470, gin(T.one), { color: C.free, mark: C.free }); ctx.restore(); }
    a = sec(T.ad - 0.3, T.lem);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('III 倍加', T.ad);
      K.bullet('沿底边方向滑动', 290, gin(T.adg)); K.bullet('同底等高 → 不变', 350, gin(T.a6b), { color: C.j, mark: C.j }); K.bullet('滑成对角：3 · 2 = 6', 410, gin(T.dg), { color: C.peri }); ctx.restore(); }
    a = sec(T.lem, T.sum);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('引理 2.2.1', T.lem);
      K.bullet('第 i 行元素 × 第 j 行代数余子式', 290, gin(T.lemS), { px: 30 }); K.bullet('i ≠ j 时 = 0', 350, gin(T.lemS + 0.6), { color: C.peri }); K.bullet('抄本矩阵：两行相同', 410, gin(T.cp2)); K.bullet('倍加 = det A + c · 0', 470, gin(T.pf3), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.sum, T.qz);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('汇总', T.sum);
      K.bullet('det(EA) = det(E) det(A)', 290, gin(T.sum + 0.3), { color: C.peri }); K.bullet('列变换同理', 350, gin(T.col)); K.bullet('一行是另一行倍数 ⇒ 0', 410, gin(T.mul0), { color: C.free, mark: C.free }); ctx.restore(); }
    a = sec(T.qz, T.tj);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('速判', T.qz);
      K.bullet('交换：变号', 290, gin(T.q1 + 0.6)); K.bullet('一行 × 4：× 4', 350, gin(T.q2 + 0.6)); K.bullet('倍加：不变', 410, gin(T.q3 + 0.6)); K.bullet('2B：× 2ⁿ', 470, gin(T.q4b + 0.6), { color: C.free, mark: C.free }); ctx.restore(); }
    a = sec(T.tj, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('同济对照', T.tj, C.gpt);
      K.bullet('性质 2：交换变号', 290, gin(T.tj + 0.8)); K.bullet('性质 3：提公因子', 350, gin(T.tj + 1.4)); K.bullet('性质 4：成比例 ⇒ 0', 410, gin(T.tj + 2.0)); K.bullet('性质 5：拆一行', 470, gin(T.tj5), { color: C.peri }); K.bullet('性质 6：倍加不变', 530, gin(T.tj5 + 0.6)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('交换变号', 290, gin(T.s1), { color: C.free, mark: C.free }); K.bullet('倍乘乘 α', 350, gin(T.s2)); K.bullet('倍加不变', 410, gin(T.s3), { color: C.j, mark: C.j }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 2.2', prog(t, 0.2, 1.3));
    drawTitle(); drawPlane(D); drawLem(); drawSum2(); drawQuiz(); drawTj(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
