// 第 1 章 §1.2 行阶梯形（Leon 9th §1.2；同济第六版 第三章 §1 行阶梯形 / 行最简形）
// 分镜：
//   开场   标题；C01 左栏小三角形回顾
//   C02–C05 大圆：方程组 → 增广矩阵；R₂−2R₁、R₃−3R₁；第二列全 0（问号）→ 跳到第三列找主元；R₃−2R₂ 出零行
//   C06–C08 台阶虚线；列标题标出首元变量 x₁、x₃（橙）与自由变量 x₂（玫红）；左栏参数解
//   C09–C11 常数 14 → 15 再消一遍：0 0 0 | 1 → “0 = 1” 无解信号
//   C12–C15 行阶梯形三条规矩（图上逐条对应）；同济对照；高斯消元法
//   D04–C17 大圆变平面：超定（三条直线两两相交却无公共点）；欠定（一条直线上的点滑来滑去）
//   C18–G02 回到矩阵：把主元上方也消成 0 → 简化行阶梯形；同济“行最简形”
//   D05–C21 左栏总结流程
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, eqLine, ring } from '../../engine/la2d/plane.js';
import { MBoard } from '../../engine/la2d/mboard.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_shock', 'ds_ask', 'gpt_cross', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const S0 = [[1, 2, 1, 4], [2, 4, 3, 9], [3, 6, 5, 14]];
const REF = [[1, 2, 1, 4], [0, 0, 1, 1], [0, 0, 0, 0]];
const S15 = [[1, 2, 1, 4], [2, 4, 3, 9], [3, 6, 5, 15]];

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.2,
    pre: { C02: 0.3, C03: 0.5, D01: 0.4, C05: 0.3, C06: 0.6, C07: 0.4, C08: 0.3, C09: 0.5, C10: 0.3, C12: 1.0, C13: 0.3, C14: 0.3, G01: 0.4, C15: 0.5,
      D04: 0.7, C16: 0.5, C17: 0.6, C18: 0.9, C19: 0.4, C20: 0.6, G02: 0.4, D05: 0.6, C21: 0.4 },
    post: { C09: 2.6, C21: 2.0 }, tail: 0.6,
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
  const P = new Plane({ ox: DX, oy: DY + 20, u: 82, R: 12 });

  const T = {
    sys: cue('C02', '看这个') , mat: [cue('C03', '写成') - 0.1, cue('C03', '写成') + 1.0],
    o1: cue('C03', '第二行减去') - 0.1, o2: cue('C03', '第三行减去') - 0.1,
    q: L('D01').s, skip: cue('C04', '跳过'), col3: cue('C04', '第三列'),
    o3: cue('C05', '第三行减去') - 0.1, zero: cue('C05', '整行变成'),
    stair: cue('C06', '看这个形状'), refName: cue('C06', '这就是'),
    lead: cue('C07', '首元变量'), free: cue('C07', '自由变量'),
    p0: cue('C08', '设x二'), p1: cue('C08', 'x三等于'), p2: cue('C08', 'x一等于'), sol3: L('D02').s,
    reset: L('C09').s - 0.3, n15: cue('C09', '十五') - 0.2, redo: cue('C09', '再消一遍') + 0.2,
    bad: cue('C10', '零等于一'), sig: cue('C11', '无解的信号') - 0.3,
    back: L('C12').s - 0.8, r1: cue('C12', '第一，'), r2: L('C13').s, r3: L('C14').s, tj1: L('G01').s,
    gauss: cue('C15', '高斯消元法') - 0.3,
    plane: [L('D04').s - 0.6, L('D04').s + 0.4], over: cue('C16', '超定'), tri: cue('C16', '三条直线'),
    under: cue('C17', '欠定'), uInf: cue('C17', '要么无解'),
    back2: L('C18').s - 0.7, above: cue('C18', '上方的数'), o4: cue('C19', '第一行减去') - 0.1, read: cue('C19', '读出来'),
    rref: cue('C20', '简化行阶梯形') - 0.2, gj: cue('C20', '高斯若尔当'), tj2: L('G02').s,
    sum: L('D05').s - 0.3, s1: cue('C21', '阶梯形'), s2: cue('C21', '出现零等于一'), s3: cue('C21', '有自由变量'), s4: cue('C21', '没有就是'),
  };
  const B = new MBoard(S0);
  B.add(T.o1, T.o1 + 1.4, 1, 0, -2).add(T.o2, T.o2 + 1.4, 2, 0, -3).add(T.o3, T.o3 + 1.4, 2, 1, -2);
  B.set(T.reset, T.reset + 0.6, S0).set(T.n15, T.n15 + 0.6, S15)
    .add(T.redo, T.redo + 0.75, 1, 0, -2).add(T.redo + 0.85, T.redo + 1.6, 2, 0, -3).add(T.redo + 1.7, T.redo + 2.45, 2, 1, -2);
  B.set(T.back, T.back + 0.6, REF);
  B.add(T.o4, T.o4 + 1.4, 0, 1, -1);
  const BO = { x: DX - 60, y: DY - 30, px: 56 };
  const piv = [
    { r: 0, c: 0, t0: T.o1 - 0.3, t1: T.o2 + 1.5 },
    { r: 1, c: 2, t0: T.col3, t1: T.o3 + 1.6 },
    { r: 0, c: 0, t0: T.stair, t1: T.reset }, { r: 1, c: 2, t0: T.stair + 0.15, t1: T.reset },
    { r: 0, c: 0, t0: T.r1, t1: T.plane[0] }, { r: 1, c: 2, t0: T.r1 + 0.15, t1: T.plane[0] },
    { r: 0, c: 0, t0: T.rref, t1: T.sum }, { r: 1, c: 2, t0: T.rref + 0.15, t1: T.sum },
  ];

  // 音效
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('swell', T.sys, 0.3); TL.sfx('warp', T.mat[0], 0.3);
  for (const op of B.ops) TL.sfx(op.type === 'set' ? 'swell' : 'pop', op.t0 + (op.type === 'add' ? 0.6 : 0.1), 0.3);
  TL.sfx('ding_lo', T.q + 0.2, 0.3); TL.sfx('whoosh', T.skip, 0.3); TL.sfx('ding', T.col3, 0.35); TL.sfx('thud', T.zero, 0.3);
  TL.sfx('marimba', T.stair, 0.3); TL.sfx('marimba_hi', T.stair + 0.35, 0.3); TL.sfx('stamp', T.refName, 0.3);
  TL.sfx('pluck', T.lead, 0.35); TL.sfx('pluck', T.free, 0.35); [T.p0, T.p1, T.p2].forEach(t => TL.sfx('tick2', t, 0.3)); TL.sfx('sparkle', T.sol3, 0.3);
  TL.sfx('buzz', T.bad, 0.3); TL.sfx('sting', L('D03').s, 0.3); TL.sfx('stamp', T.sig + 0.3, 0.3);
  [T.r1, T.r2, T.r3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('bell_soft', T.tj1 + 0.3, 0.3); TL.sfx('stamp', T.gauss + 0.3, 0.3);
  TL.sfx('whoosh', T.plane[0], 0.35); TL.sfx('pluck', T.over, 0.35); TL.sfx('pluck', T.over + 0.35, 0.35); TL.sfx('pluck', T.over + 0.7, 0.35); TL.sfx('ding_lo', T.tri + 0.3, 0.3);
  TL.sfx('swell', T.under, 0.3); TL.sfx('whoosh', T.back2, 0.3); TL.sfx('ding', T.above, 0.3); TL.sfx('sparkle', T.read, 0.3);
  TL.sfx('stamp', T.rref + 0.3, 0.3); TL.sfx('bell_soft', T.tj2 + 0.3, 0.3);
  [T.s1, T.s2, T.s3, T.s4].forEach((t, i) => TL.sfx(i % 2 ? 'marimba_hi' : 'marimba', t, 0.3)); TL.sfx('shimmer', L('C21').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.3, L('C01').e + 0.3)); if (a <= 0) return;
    const m = smoother(prog(t, L('C01').s - 0.3, L('C01').s + 0.4)), y = lerp(430, 230, m), k = lerp(1, 0.7, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.2 行阶梯形'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'ECHELON', cx / 2, 62, 28, C.peri, { rule: 70 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
  }
  // C01：大圆里的小三角形回顾
  function drawRecap(D) {
    const a = win(t, L('C01').s, T.sys - 0.4, 0.4, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.font = F.sans(64, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const g = smooth(prog(t, L('C01').s + 0.2 + (r * 3 + c) * 0.07, L('C01').s + 0.5 + (r * 3 + c) * 0.07)); if (g <= 0) continue;
      ctx.globalAlpha = a * g; const z = c < r; ctx.fillStyle = z ? C.mist : C.ink; ctx.fillText(z ? '0' : '∗', DX - 140 + c * 140, DY - 140 + r * 140);
      if (c === r) { ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.strokeRect(DX - 140 + c * 140 - 46, DY - 140 + r * 140 - 46, 92, 92); }
    }
    ctx.restore();
  }

  function drawBoard(D, fade) {
    const a = fade * smooth(prog(t, T.sys - 0.2, T.sys + 0.4)) * (1 - smooth(prog(t, T.plane[0], T.plane[0] + 0.5))) + smooth(prog(t, T.back2, T.back2 + 0.6));
    if (a <= 0) return;
    const mode = smoother(prog(t, ...T.mat));
    const hi = {};
    hi[2] = win(t, T.zero - 0.1, T.stair, 0.2, 0.3) * 0.8 + win(t, T.bad - 0.2, T.back, 0.2, 0.3) + win(t, T.r3, T.tj1 + 0.4, 0.2, 0.3) * 0.8;
    hi[0] = win(t, T.above - 0.1, T.read + 0.6, 0.2, 0.3) * 0.6;
    const stair = win(t, T.stair, T.reset, 0.3, 0.3) + win(t, T.r2, T.plane[0], 0.3, 0.3) + win(t, T.rref, T.sum, 0.3, 0.3);
    const bad = t > T.bad - 0.2 && t < T.back;
    B.draw(ctx, t, { ...BO, mode, alpha: a, pivots: piv, hiRows: hi, hiColor: bad ? C.free : C.peri, stair, heads: 0, labelHold: 1.0 });
    const Lb = B.layout(BO);
    // D01：第二列下方打问号
    const q = win(t, T.q, T.col3 + 0.2, 0.2, 0.3);
    if (q > 0) for (const r of [1, 2]) { const [x, y] = B.cell(BO, r, 1, 1); ctx.save(); ctx.globalAlpha = a * q * 0.9; ctx.strokeStyle = C.free; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.strokeRect(x - 40, y - 34, 80, 68); ctx.restore(); }
    if (q > 0) { const [x, y] = B.cell(BO, 0, 1, 1); K.tag('?', x, y - Lb.rh * 0.95, { px: 60, color: C.free, a: a * q, align: 'center', font: F.serif, w: 900 }); }
    // C04：跳过第二列的箭头
    const sk = win(t, T.skip, T.o3, 0.2, 0.3);
    if (sk > 0) {
      const [x1, y] = B.cell(BO, 1, 1, 1), [x2] = B.cell(BO, 1, 2, 1), g = smooth(prog(t, T.skip, T.skip + 0.6));
      ctx.save(); ctx.globalAlpha = a * sk; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.beginPath();
      const yy = y - Lb.rh * 0.62; ctx.moveTo(x1, yy); ctx.quadraticCurveTo((x1 + x2) / 2, yy - 50, lerp(x1, x2, g), yy - (g < 1 ? 50 * Math.sin(Math.PI * g) * 0.5 : 0)); ctx.stroke(); ctx.restore();
    }
    // 列标题：首元变量 / 自由变量
    const hd = win(t, T.lead - 0.2, T.reset, 0.3, 0.3) + win(t, T.read, T.sum, 0.3, 0.3);
    if (hd > 0) ['x₁', 'x₂', 'x₃'].forEach((v, c) => {
      const [x, y] = B.cell(BO, 0, c, 1), isFree = c === 1, g = isFree ? gin(T.free) : gin(T.lead + c * 0.1);
      const col = isFree ? C.free : C.peri;
      K.tag(v, x, y - Lb.rh * 0.95, { px: 40, color: g > 0.5 ? col : C.inkMid, a: a * hd * Math.max(0.5, g), align: 'center' });
      if (g > 0) K.tag(isFree ? '自由' : '首元', x, y - Lb.rh * 1.55, { px: 26, color: col, a: a * hd * g, align: 'center' });
    });
    // 名称标签
    const yb = BO.y + Lb.h / 2 + 64;
    K.tag('行阶梯形', BO.x, yb, { px: 42, a: a * win(t, T.refName, T.lead - 0.3, 0.3, 0.3), align: 'center', font: F.serif, w: 900, color: C.peri });
    K.tag('0 = 1  →  无解', BO.x, yb, { px: 46, a: a * win(t, T.bad, T.back - 0.2, 0.25, 0.3), align: 'center', font: F.serif, w: 900, color: C.free });
    K.tag('简化行阶梯形（RREF）', BO.x, yb, { px: 42, a: a * win(t, T.rref, T.sum, 0.3, 0.3), align: 'center', font: F.serif, w: 900, color: C.peri });
    // C11：无解信号框
    const sg = win(t, T.sig, T.back - 0.2, 0.25, 0.3);
    if (sg > 0) { const y = Lb.ry(2), w = Lb.wM + 70; ctx.save(); ctx.globalAlpha = a * sg; ctx.strokeStyle = C.free; ctx.lineWidth = 5; ctx.strokeRect(BO.x - w / 2, y - Lb.rh * 0.5, w, Lb.rh); ctx.restore(); }
    // C18：主元上方的数
    const ab = win(t, T.above, T.o4 + 0.4, 0.2, 0.3);
    if (ab > 0) { const [x, y] = B.cell(BO, 0, 2, 1); ring(ctx, [x, y], prog(t, T.above, T.above + 0.8), { color: C.peri, r1: 70, width: 4 }); ctx.save(); ctx.globalAlpha = a * ab; ctx.strokeStyle = C.peri; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x, y, 38, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  }

  // 平面：超定 / 欠定
  const OV = [[1, 1, 1, 'x₁ + x₂ = 1', C.i], [1, -1, 3, 'x₁ − x₂ = 3', C.j], [-1, 2, -2, '−x₁ + 2x₂ = −2', C.k]];
  function drawPlane(D) {
    const a = win(t, T.plane[0], T.back2, 0.5, 0.5); if (a <= 0) return;
    const grow = prog(t, T.plane[0], T.plane[1] + 0.5);
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.3, alpha: 0.2 * a, grow });
    P.axes(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 2.2, alpha: 0.55 * a, grow });
    const ov = 1 - smooth(prog(t, T.under - 0.4, T.under));
    OV.forEach(([p, q, r, txt, col], i) => eqLine(ctx, P, p, q, r, { color: col, width: 5, alpha: a * ov, grow: smooth(prog(t, T.over + i * 0.35, T.over + i * 0.35 + 0.7)) }));
    // 欠定：一条直线 x₁ + x₂ = 1，点在上面滑
    const un = smooth(prog(t, T.under - 0.2, T.under + 0.5));
    if (un > 0) {
      eqLine(ctx, P, 1, 1, 1, { color: C.i, width: 5, alpha: a * un, grow: un });
      const s = Math.sin((t - T.under) * 1.3) * 2.6, p = P.S([0.5 + s, 0.5 - s]);
      ctx.globalAlpha = a * un; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(p[0], p[1], 11, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    // 两两交点
    const pts = [[2, -1], [0, 1], [4, 1]], tg = smooth(prog(t, T.tri, T.tri + 0.5)) * ov;
    if (tg > 0) pts.forEach(([x, y], i) => {
      const p = P.S([x, y]); ctx.save(); ctx.globalAlpha = a * tg; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      ring(ctx, p, prog(t, T.tri + i * 0.15, T.tri + i * 0.15 + 0.8), { color: C.free, r1: 50, width: 3 });
    });
    OV.forEach(([p, q, r, txt, col], i) => {
      const pos = [P.S([-2.6, 3.6]), P.S([4.6, 1.6]), P.S([-3.4, -2.7])][i];
      K.tag(txt, pos[0], pos[1], { color: col, px: 30, a: a * ov * smooth(prog(t, T.over + i * 0.35 + 0.3, T.over + i * 0.35 + 0.7)), align: i === 1 ? 'left' : 'left' });
    });
  }

  function drawLeft() {
    // C02–C05：方程组提示
    const a1 = win(t, T.sys, T.stair - 0.3, 0.3, 0.4);
    if (a1 > 0) { ctx.save(); ctx.globalAlpha = a1; K.head('高斯消元', 210, 1, smooth(prog(t, T.sys, T.sys + 0.6)));
      K.bullet('每列选一个主元', 290, gin(T.o1 - 0.3)); K.bullet('用它把下面消成 0', 350, gin(T.o1 + 0.5));
      K.bullet('这一列没有主元？', 430, gin(T.q), { color: C.free, mark: C.free }); K.bullet('→ 跳到下一列', 490, gin(T.skip)); ctx.restore(); }
    // C06–D02：首元 / 自由 + 参数解
    const a2 = win(t, T.stair - 0.2, T.reset - 0.2, 0.3, 0.4);
    if (a2 > 0) { ctx.save(); ctx.globalAlpha = a2; K.head('读出解', 210, 1, smooth(prog(t, T.stair, T.stair + 0.6)));
      K.bullet('首元变量：x₁、x₃', 290, gin(T.lead), { color: C.ink }); K.bullet('自由变量：x₂', 350, gin(T.free), { mark: C.free });
      if (t > T.p0 - 0.1) tex.draw(ctx, tex.place('par', LX, 430, 38, 'l'), { alpha: a2, reveal: prog(t, T.p0, T.p2 + 1.0) });
      if (t > T.sol3 - 0.2) tex.draw(ctx, tex.place('sol3', LX, 505, 36, 'l'), { alpha: a2, reveal: prog(t, T.sol3 - 0.2, T.sol3 + 0.8), color: C.peri });
      ctx.restore(); }
    // C09–C11
    const a3 = win(t, T.reset, T.back - 0.2, 0.3, 0.4);
    if (a3 > 0) { ctx.save(); ctx.globalAlpha = a3; K.head('无解的信号', 210, 1, smooth(prog(t, T.reset, T.reset + 0.6)));
      K.bullet('常数 14 → 15', 290, gin(T.n15)); K.bullet('最后一行：0 0 0 | 1', 350, gin(T.bad - 0.4));
      K.bullet('左边全 0，右边非 0', 430, gin(T.sig), { color: C.free, mark: C.free }); K.bullet('→ 方程组无解', 490, gin(T.sig + 0.6), { color: C.free, mark: C.free }); ctx.restore(); }
    // C12–C15：三条规矩
    const a4 = win(t, T.back, T.plane[0], 0.3, 0.4);
    if (a4 > 0) { ctx.save(); ctx.globalAlpha = a4;
      const hd2 = 1 - smooth(prog(t, T.gauss - 0.3, T.gauss));
      ctx.globalAlpha = a4 * hd2; K.head('行阶梯形 · 三条', 210, 1, smooth(prog(t, T.back + 0.3, T.back + 0.9)));
      ctx.globalAlpha = a4 * (1 - hd2); K.head('高斯消元法', 210, 1, smooth(prog(t, T.gauss, T.gauss + 0.6)), C.peri);
      ctx.globalAlpha = a4;
      K.bullet('① 每行领头数是 1', 290, gin(T.r1), { px: 34 }); K.bullet('② 领头数逐行右移', 350, gin(T.r2), { px: 34 }); K.bullet('③ 全零行放最下面', 410, gin(T.r3), { px: 34 });
      K.note('同济第六版 · 对照', ['行阶梯形不要求领头为 1'], 470, gin(T.tj1 + 0.2, 0.5)); ctx.restore(); }
    // D04–C17
    const a5 = win(t, T.plane[0] + 0.2, T.back2, 0.3, 0.4);
    if (a5 > 0) { ctx.save(); ctx.globalAlpha = a5; K.head('方程数 ≠ 未知数', 210, 1, smooth(prog(t, T.plane[0] + 0.3, T.plane[0] + 0.9)));
      K.bullet('超定：方程更多', 290, gin(T.over)); K.bullet('通常无解', 345, gin(T.tri), { px: 32, color: C.inkMid, mark: C.mist });
      K.bullet('欠定：方程更少', 425, gin(T.under)); K.bullet('无解或无穷多解', 480, gin(T.uInf), { px: 32, color: C.inkMid, mark: C.mist });
      K.bullet('绝不会唯一', 535, gin(T.uInf + 1.2), { px: 32, color: C.peri }); ctx.restore(); }
    // C18–G02
    const a6 = win(t, T.back2, T.sum, 0.3, 0.4);
    if (a6 > 0) { ctx.save(); ctx.globalAlpha = a6; K.head('再走一步', 210, 1, smooth(prog(t, T.back2, T.back2 + 0.6)));
      K.bullet('主元上方也消成 0', 290, gin(T.above));
      if (t > T.read - 0.1) tex.draw(ctx, tex.place('rref', LX, 370, 40, 'l'), { alpha: a6, reveal: prog(t, T.read, T.read + 1.0) });
      K.bullet('高斯–若尔当消元', 445, gin(T.gj), { color: C.peri });
      K.note('同济第六版 · 对照', ['叫“行最简形矩阵”'], 490, gin(T.tj2 + 0.2, 0.5)); ctx.restore(); }
    // 总结
    const a7 = smooth(prog(t, T.sum, T.sum + 0.5)); if (a7 > 0) drawSummary(a7);
  }

  function drawSummary(a) {
    ctx.save(); ctx.globalAlpha = a; K.head('一张图看懂', 210, 1, smooth(prog(t, T.sum, T.sum + 0.6)));
    const box = (text, x, y, g, col = C.ink, w = 300) => { if (g <= 0) return; ctx.save(); ctx.globalAlpha = a * g; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x - w / 2, y - 34, w, 68);
      ctx.font = F.sans(34, 700); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y); ctx.restore(); };
    const arr = (x0, y0, x1, y1, g, label) => { if (g <= 0) return; ctx.save(); ctx.globalAlpha = a * g; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, g), lerp(y0, y1, g)); ctx.stroke(); ctx.restore();
      if (label) K.tag(label, (x0 + x1) / 2 + 12, (y0 + y1) / 2, { px: 26, color: C.inkMid, a: a * g }); };
    // 大圆里画流程（分支向右）
    const cx = DX - 170, rx = 330;
    box('化成行阶梯形', cx, 230, gin(T.s1), C.ink, 340);
    arr(cx, 264, cx, 340, gin(T.s2 - 0.2)); box('出现 0 = 1 ?', cx, 374, gin(T.s2), C.ink, 300);
    arr(cx + 150, 374, cx + rx - 75, 374, gin(T.s2 + 0.5)); K.tag('是', cx + 200, 350, { px: 26, a: a * gin(T.s2 + 0.5), color: C.inkMid, align: 'center' }); box('无解', cx + rx, 374, gin(T.s2 + 0.7), C.free, 150);
    arr(cx, 408, cx, 484, gin(T.s3 - 0.2), '否'); box('有自由变量 ?', cx, 518, gin(T.s3), C.ink, 300);
    arr(cx + 150, 518, cx + rx + 20 - 100, 518, gin(T.s3 + 0.5)); K.tag('有', cx + 200, 494, { px: 26, a: a * gin(T.s3 + 0.5), color: C.inkMid, align: 'center' }); box('无穷多解', cx + rx + 20, 518, gin(T.s3 + 0.7), C.j, 200);
    arr(cx, 552, cx, 628, gin(T.s4 - 0.1), '没有'); box('唯一解', cx, 662, gin(T.s4 + 0.1), C.peri, 200);
    ctx.restore();
    // 左栏三句话
    ctx.save(); ctx.globalAlpha = a;
    K.bullet('看台阶，就知道', 290, gin(T.sum + 0.4)); K.bullet('有没有解、有几个解', 350, gin(T.sum + 0.8));
    ctx.restore();
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.2', prog(t, 0.2, 1.3));
    drawTitle(); drawRecap(D);
    const sumFade = 1 - smooth(prog(t, T.sum - 0.2, T.sum + 0.4));
    if (sumFade > 0) drawBoard(D, sumFade);
    drawPlane(D); drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
