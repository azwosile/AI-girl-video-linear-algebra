// 第 1 章 §1.2b 齐次方程组（Leon 9th §1.2 Homogeneous Systems + Thm 1.2.1 + Applications；同济第六版 第三章 §3 定理 4）
// 分镜：
//   开场 D01–C01  大圆：上一节的方程组，右边常数变成 0 → “齐次”
//   C02–C05      两方程三未知数的齐次方程组；全取 0 → 平凡解 / 零解；问“非零解？”
//   C06–D03      Planes3D：两张过原点的平面交出一条直线，点在线上滑
//   C10–C11      回到矩阵：R₂ − 2R₁ → x₂ = x₃，x₃ = t，解 (−t, t, t)
//   C12–C13      回到 3D：t 取遍实数画出交线；第三张平面只在原点相交
//   C14–C18      定理 1.2.1：m×n 台阶示意，主元 ≤ m，自由列 ≥ n − m
//   G01–G02      反例：三张平面共用一条直线；同济的秩
//   D06–G03      光合作用配平（3 方程 4 未知数），RREF → 6, 6, 6, 1
//   C26–C32      Leon 车流图（图 1.2.2），x₄ = 200 → 530 / 370 / 410
//   D10–C33      总结
// 屏幕上的数字全部来自 math.json（mathcheck.py 独立验算）。
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { arrow, ring } from '../../engine/la2d/plane.js';
import { MBoard } from '../../engine/la2d/mboard.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'gpt_cross', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const PREV = [[1, 2, 1, 4], [2, 4, 3, 9], [3, 6, 5, 14]];   // 上一节的方程组（回顾）

// three.js 只在浏览器里有；无浏览器干跑时换成桩（只检查时间轴与 2D 绘制）
async function load3D() {
  try { return (await import('../../engine/la3d/planes3d.js')).Planes3D; }
  catch (e) {
    return class { constructor(s) { this.size = s; } reset() { return this; } setPlane() { return this; } setLine() { return this; } setPoint() { return this; }
      render() { return { width: this.size, height: this.size }; } project() { return [this.size / 2, this.size / 2]; } };
  }
}

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const M = R.math; if (!M) throw new Error('缺 math.json');
  const S = M.systems, PL = M.planes;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.3, C05: 0.3, C06: 0.7, C07: 0.3, C08: 0.4, C09: 0.3, C10: 0.6, C11: 0.3, C12: 0.7, D04: 0.3, C13: 0.4, C14: 0.7, C16: 0.4, C17: 0.3, C18: 0.3,
      G01: 0.5, G02: 0.4, D06: 0.7, C19: 0.3, C21: 0.5, C22: 0.3, C23: 0.5, C24: 0.4, C25: 0.5, C26: 0.8, C28: 0.3, C29: 0.6, C30: 0.3, C31: 0.4, C32: 0.3, D10: 0.5, C33: 0.3 },
    post: { C05: 0.6, C09: 0.8, C12: 0.6, C13: 0.9, C18: 1.0, G01: 0.6, C25: 0.9, C32: 1.2, C33: 1.3 }, tail: 0.6,
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
  const Planes3D = await load3D();
  const P3 = new Planes3D(900, { R: 3 });

  const T = {
    rhs0: cue('D01', '全是零'), name: cue('C01', '齐次'),
    sys: cue('C02', '比如') - 0.2, cst: cue('C02', '常数项'),
    zeros: cue('D02', 'x一'), always: cue('C03', '永远'), triv: cue('C04', '平凡解'), tj0: cue('C04', '同济'),
    q: cue('C05', '除了'), nz: cue('C05', '非零解'),
    s3d: L('C06').s - 0.7, p1: cue('C06', '一张平面'), orig: cue('C07', '原点'), p2: cue('C07', '每张平面'),
    line: cue('C08', '交出'), slide: cue('C09', '每个点'), o: cue('C09', '原点只是'), inf: L('D03').s,
    elim: L('C10').s - 0.6, o1: cue('C10', '第二行减去') - 0.1,
    eq23: cue('C11', '得到'), free: cue('C11', '自由变量'), tt: cue('C11', '设它'), sol: cue('C11', '解就是'),
    back3d: L('C12').s - 0.5, tAll: cue('C12', '取遍'),
    third: cue('D04', '三张平面'), only0: cue('C13', '只在原点'),
    thm: L('C14').s - 0.6, mn: cue('C14', '方程个数'), th: cue('C14', '定理'), nm: cue('C15', 'n大于m'), why: L('D05').s,
    stair: cue('C16', '看台阶'), piv: cue('C16', '每一行'), fr: cue('C17', '至少剩下'), one: cue('C18', '取一'), nzs: cue('C18', '非零解'),
    conv: L('G01').s - 0.3, share: cue('G01', '三张平面'), rank: cue('G02', '秩'),
    chem0: L('D06').s - 0.4, chem: cue('C19', '光合作用'), coef: cue('C20', '系数'),
    atoms: cue('C21', '两边'), cC: cue('C21', '先看碳'), cO: cue('C22', '再看氧'), cH: cue('C22', '氢'),
    move: cue('C23', '移到左边'), zeroR: cue('C23', '右边全是零'), cnt: cue('C23', '三个方程'),
    hom: L('D07').s, gt: cue('D07', '四大于三'), rr: cue('C24', '消元以后'), f4: cue('C24', 'x四是自由变量'), six: cue('C24', '六倍'),
    pick: cue('C25', '取x四'), bal: cue('C25', '六个二氧化碳'), zz: L('D08').s, nothing: L('G03').s,
    traf: L('C26').s - 0.7, net: cue('C26', '四个路口'), inout: cue('C27', '开进来'), four: cue('C27', '四个方程'),
    eqA: cue('C28', '路口A'), rref: cue('C29', '简化'), zrow: cue('C29', '最后一行'), f4t: cue('C29', 'x四是'), con: L('C30').s,
    how: L('D09').s, cant: cue('C31', '算不出来'), x4: cue('C31', 'x四等于'), fill: cue('C32', '五百三十'),
    sum: L('D10').s - 0.6, s1: cue('D10', '一定有零解'), s2: cue('D10', '未知数比方程多'), next: cue('C33', '下一节'),
  };
  T.fill2 = T.fill + (L('C32').e - T.fill) * 0.4; T.fill3 = T.fill + (L('C32').e - T.fill) * 0.75;

  // ── 矩阵板 ──
  const zcol = r => r.map(row => [...row.slice(0, -1), 0]);
  const B0 = new MBoard(PREV);
  B0.set(T.rhs0 - 0.1, T.rhs0 + 0.6, zcol(PREV));
  const ex2 = S.ex2, B1 = new MBoard(ex2.A.map(r => [...r, 0]));
  B1.add(T.o1, T.o1 + 1.5, ex2.ops[0][1], ex2.ops[0][2], ex2.ops[0][3]);
  const ph = S.photo, B2 = new MBoard(ph.A.map(r => [...r, 0]));
  B2.set(T.rr, T.rr + 0.8, ph.rref.map(r => [...r, 0]));
  const BO0 = { x: DX, y: DY - 10, px: 60 }, BO1 = { x: DX - 40, y: DY - 40, px: 66 }, BO2 = { x: DX - 30, y: DY + 40, px: 54 };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('swell', T.rhs0, 0.3); TL.sfx('stamp', T.name + 0.2, 0.35);
  TL.sfx('warp', T.sys, 0.3); TL.sfx('pluck', T.cst, 0.3); TL.sfx('tick2', T.zeros, 0.3); TL.sfx('check', T.always, 0.3); TL.sfx('bell_soft', T.tj0, 0.3);
  TL.sfx('ding_lo', T.q, 0.3); TL.sfx('sting', T.nz, 0.3);
  TL.sfx('whoosh', T.s3d, 0.35); TL.sfx('swell', T.p1, 0.3); TL.sfx('ding', T.orig, 0.3); TL.sfx('swell', T.p2, 0.3); TL.sfx('shimmer', T.line, 0.35);
  TL.sfx('sparkle', T.inf + 0.2, 0.3);
  TL.sfx('whoosh', T.elim, 0.3); for (const op of B1.ops) TL.sfx('pop', op.t0 + 0.6, 0.3);
  TL.sfx('pluck', T.free, 0.35); [T.tt, T.sol].forEach(t => TL.sfx('tick2', t, 0.3));
  TL.sfx('whoosh', T.back3d, 0.3); TL.sfx('swell', T.third, 0.3); TL.sfx('thud', T.only0, 0.3);
  TL.sfx('whoosh', T.thm, 0.3); TL.sfx('stamp', T.th + 0.4, 0.3); TL.sfx('marimba', T.stair, 0.3); TL.sfx('marimba_hi', T.piv, 0.3); TL.sfx('pluck', T.fr, 0.35); TL.sfx('sparkle', T.nzs, 0.3);
  TL.sfx('buzz', T.conv + 0.4, 0.25); TL.sfx('swell', T.share, 0.3); TL.sfx('bell_soft', T.rank, 0.3);
  TL.sfx('whoosh', T.chem0 + 0.4, 0.3); TL.sfx('swell', T.chem, 0.3); [T.cC, T.cO, T.cH].forEach(t => TL.sfx('tick2', t, 0.3));
  TL.sfx('warp', T.move, 0.3); TL.sfx('ding', T.gt, 0.3); TL.sfx('pop', T.rr + 0.4, 0.3); TL.sfx('pluck', T.f4, 0.3); TL.sfx('stamp', T.bal, 0.35); TL.sfx('ding_lo', T.zz + 0.3, 0.25);
  TL.sfx('whoosh', T.traf, 0.35); TL.sfx('marimba', T.net, 0.3); TL.sfx('pluck', T.eqA, 0.3); TL.sfx('stamp', T.rref + 0.3, 0.3); TL.sfx('ding_lo', T.cant, 0.3);
  [T.x4, T.fill, T.fill2, T.fill3].forEach((t, i) => TL.sfx(i % 2 ? 'marimba_hi' : 'marimba', t, 0.3));
  TL.sfx('whoosh', T.sum, 0.3); TL.sfx('check', T.s1, 0.3); TL.sfx('check', T.s2, 0.3); TL.sfx('shimmer', L('C33').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  // 大圆里各幕的可见度
  const A3 = () => win(t, T.s3d, T.elim, 0.6, 0.5) + win(t, T.back3d, T.thm, 0.5, 0.5) + win(t, T.conv, T.chem0, 0.5, 0.5);
  const lineFor = (id, k = 1) => L(id).e + k;

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.2, L('C01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.2 齐次方程组'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'HOMOGENEOUS', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
  }

  // 列框（右边常数列）
  function colBox(B, BO, col, a, color = C.peri, mode = 1) {
    if (a <= 0) return; const Lb = B.layout(BO), [x] = B.cell(BO, 0, col, mode), y0 = Lb.ry(0) - Lb.rh * 0.55, y1 = Lb.ry(B.m - 1) + Lb.rh * 0.55, w = Lb.cw * 0.95;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.strokeRect(x - w / 2, y0, w, y1 - y0); ctx.restore();
  }

  // ── 开场：回顾方程组 → 右边变 0 ──
  function drawRecap() {
    const a = win(t, 2.6, T.sys - 0.2, 0.5, 0.4); if (a <= 0) return;
    B0.draw(ctx, t, { ...BO0, mode: 0, alpha: a, labels: false });
    // 右边常数一圈橙框，变 0 时闪一下
    const Lb = B0.layout(BO0), hb = win(t, T.rhs0 - 0.6, T.sys - 0.4, 0.3, 0.3);
    if (hb > 0) for (let r = 0; r < 3; r++) { const [x, y] = B0.cell(BO0, r, 3, 0); ring(ctx, [x, y], prog(t, T.rhs0 + r * 0.08, T.rhs0 + 0.8 + r * 0.08), { color: C.peri, r1: 64, width: 3 }); }
    const yb = BO0.y + Lb.h / 2 + 90;
    K.tag('右边全是 0', DX, yb, { px: 44, a: a * win(t, T.rhs0 + 0.3, T.name - 0.2, 0.3, 0.3), align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('齐次线性方程组', DX, yb, { px: 50, a: a * gin(T.name, 0.4), align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('homogeneous system', DX, yb + 58, { px: 28, a: a * gin(T.name + 0.3, 0.4), align: 'center', color: C.inkMid });
  }

  // ── B1：两方程三未知数 ──
  function drawB1() {
    const a = win(t, T.sys, T.s3d + 0.2, 0.4, 0.4) + win(t, T.elim + 0.3, T.back3d + 0.1, 0.5, 0.4); if (a <= 0) return;
    const mode = smoother(prog(t, T.elim + 0.1, T.elim + 1.0));
    const hi = {}; hi[1] = win(t, T.eq23, T.tt, 0.2, 0.3) * 0.7;
    B1.draw(ctx, t, { ...BO1, mode, alpha: a, hiRows: hi, labelHold: 1.6,
      pivots: [{ r: 0, c: 0, t0: T.eq23, t1: T.back3d }, { r: 1, c: 1, t0: T.eq23 + 0.15, t1: T.back3d }], stair: win(t, T.eq23, T.back3d, 0.3, 0.3) });
    const Lb = B1.layout(BO1);
    // C02：右边的 0
    colBox(B1, BO1, 3, a * win(t, T.cst, T.zeros - 0.2, 0.25, 0.3) * (1 - mode), C.peri, 0);
    // C10：消元时零列始终是零
    colBox(B1, BO1, 3, a * win(t, T.o1 + 0.9, T.eq23, 0.25, 0.3) * mode, C.mist, 1);
    // D02/C03：全取 0
    const yb = BO1.y + Lb.h / 2 + 76;
    if (t > T.zeros - 0.2 && t < T.s3d + 0.5) {
      const az = a * win(t, T.zeros, T.s3d - 0.2, 0.3, 0.3);
      tex.draw(ctx, tex.place('zero', DX, yb, 58, 'c'), { alpha: az, reveal: prog(t, T.zeros - 0.1, T.zeros + 1.0) });
      if (t > T.always) { const g = outBack(prog(t, T.always, T.always + 0.4)); ctx.save(); ctx.globalAlpha = az; star4(ctx, DX + 300, yb, 22 * g, C.j); ctx.restore(); }
      K.tag('平凡解 · trivial solution', DX, yb + 74, { px: 34, a: az * win(t, T.triv, T.q - 0.1, 0.3, 0.3), align: 'center', color: C.inkMid });
      // C05：非零解？
      const qa = az * gin(T.q, 0.4);
      if (qa > 0) { const k = outBack(prog(t, T.nz - 0.1, T.nz + 0.4)); K.tag('非零解 ？', DX, yb + 80, { px: 52 * Math.max(0.6, k), a: qa, align: 'center', color: C.free, font: F.serif, w: 900 }); }
    }
    // C11：列标题 自由 / 首元
    const hd = win(t, T.free - 0.2, T.back3d, 0.3, 0.3) * mode;
    if (hd > 0) [0, 1, 2].forEach(c => {
      const [x, y] = B1.cell(BO1, 0, c, 1), isFree = c === 2, g = isFree ? gin(T.free) : gin(T.eq23 + c * 0.12), col = isFree ? C.free : C.peri;
      if (g > 0) K.tag(isFree ? '自由' : '首元', x, y - Lb.rh * 1.55, { px: 28, color: col, a: a * hd * g, align: 'center' });
    });
    // C11：第二行读成 x₂ = x₃
    const rd = win(t, T.eq23, T.back3d, 0.25, 0.3) * mode;
    if (rd > 0) K.tag('x₂ − x₃ = 0  →  x₂ = x₃', DX - 40, BO1.y + Lb.h / 2 + 80, { px: 40, a: a * rd, align: 'center', color: C.ink, font: F.serif, w: 900 });
  }

  // ── 3D：平面与交线 ──
  function draw3D(D) {
    const a = A3(); if (a <= 0.003) return;
    P3.reset();
    // 第一幕：两张平面 + 交线
    const actA = t < T.elim + 0.6, actB = t > T.back3d - 0.6 && t < T.thm + 0.6, actC = t > T.conv - 0.6;
    let az = -58, el = 22;
    if (actA) {
      az = -64 + (t - T.s3d) * 1.6; el = 24;
      P3.setPlane(0, PL.n1, { color: C.i, alpha: 0.36, scale: outCubic(prog(t, T.p1 - 0.3, T.p1 + 0.9)), tilt: smoother(prog(t, T.p1 + 0.2, T.p1 + 1.3)) });
      P3.setPlane(1, PL.n2, { color: C.j, alpha: 0.36, scale: outCubic(prog(t, T.p2 - 0.2, T.p2 + 0.9)), tilt: smoother(prog(t, T.p2 + 0.2, T.p2 + 1.3)) });
      P3.setPoint(0, [0, 0, 0], { r: 0.1 + 0.08 * pulse(t, T.orig, 0.8), color: C.ink, alpha: gin(T.orig - 0.2) });
      P3.setLine(0, PL.line, { grow: smoother(prog(t, T.line, T.line + 1.0)), color: C.peri, width: 8 });
      // C09：线上的点滑来滑去
      const sl = win(t, T.slide, T.elim, 0.3, 0.3);
      if (sl > 0) { const s = Math.sin((t - T.slide) * 1.2) * 1.5; P3.setPoint(1, PL.line.map(v => v * s), { r: 0.13, color: C.free, alpha: sl }); }
    } else if (actB) {
      az = -50 + (t - T.back3d) * 1.4; el = lerp(24, 30, smooth(prog(t, T.third, T.third + 1.5)));
      const ln = 1 - smooth(prog(t, T.only0 - 0.2, T.only0 + 0.6));
      P3.setPlane(0, PL.n1, { color: C.i, alpha: 0.32 }); P3.setPlane(1, PL.n2, { color: C.j, alpha: 0.32 });
      P3.setLine(0, PL.line, { color: C.peri, width: 8, alpha: ln });
      // t 取遍实数：点从 −∞ 走到 +∞，留下轨迹
      const tr = smoother(prog(t, T.tAll - 0.4, T.tAll + 1.6)), s = lerp(-1.75, 1.75, tr);
      if (t < T.third) P3.setPoint(1, PL.line.map(v => v * s), { r: 0.13, color: C.free, alpha: win(t, T.back3d + 0.2, T.third, 0.3, 0.3) });
      P3.setPlane(2, PL.n3, { color: C.k, alpha: 0.32, scale: outCubic(prog(t, T.third, T.third + 0.9)), tilt: smoother(prog(t, T.third + 0.3, T.third + 1.4)) });
      P3.setPoint(0, [0, 0, 0], { r: 0.1 + 0.1 * pulse(t, T.only0, 0.9), color: C.ink });
    } else if (actC) {
      az = -58 + (t - T.conv) * 1.6; el = 26;
      const sh = smoother(prog(t, T.share - 0.3, T.share + 1.2));
      P3.setPlane(0, PL.n1, { color: C.i, alpha: 0.3 }); P3.setPlane(1, PL.n2, { color: C.j, alpha: 0.3 });
      P3.setPlane(2, PL.n3share, { color: C.k, alpha: 0.32, scale: outCubic(prog(t, T.share - 0.3, T.share + 0.8)), tilt: sh });
      P3.setLine(0, PL.line, { color: C.peri, width: 8, grow: smoother(prog(t, T.conv, T.conv + 0.8)) });
      P3.setPoint(0, [0, 0, 0], { r: 0.1, color: C.ink });
    }
    const cv = P3.render({ el, az, dist: 12.5, axesA: 1, floorA: 1 });
    ctx.save(); K.clip(D); ctx.globalAlpha = Math.min(1, a); ctx.drawImage(cv, D.x - 450, D.y - 450, 900, 900); ctx.restore();
    // 2D 标签（投影到画布）
    const lab = (p, text, opt) => { const [x, y] = P3.project(p); K.tag(text, D.x - 450 + x, D.y - 450 + y, opt); };
    const A = Math.min(1, a);
    lab([3.75, 0, 0], 'x₁', { px: 30, a: A * 0.8, align: 'center' }); lab([0, 3.75, 0], 'x₂', { px: 30, a: A * 0.8, align: 'center' }); lab([0, 0, 3.75], 'x₃', { px: 30, a: A * 0.8, align: 'center' });
    if (actA) {
      lab([0, 0, 0], '原点', { px: 28, a: A * win(t, T.orig, T.line, 0.2, 0.3), color: C.ink });
      lab(PL.line.map(v => v * 2.1), '交线', { px: 34, a: A * gin(T.line + 0.6), color: C.peri, w: 900 });
      const sl = win(t, T.slide, T.elim, 0.3, 0.3);
      if (sl > 0) { const s = Math.sin((t - T.slide) * 1.2) * 1.5; lab(PL.line.map(v => v * s + 0.25), '同时满足两个方程', { px: 26, a: A * sl * win(t, T.slide, T.o + 0.4, 0.3, 0.3), color: C.free }); }
    }
    if (actB && t < T.third) {
      const tr = smoother(prog(t, T.tAll - 0.4, T.tAll + 1.6)), s = lerp(-1.75, 1.75, tr);
      lab(PL.line.map(v => v * s + 0.3), `t = ${s.toFixed(1).replace('-', '−')}`, { px: 30, a: A * win(t, T.back3d + 0.2, T.third, 0.3, 0.3), color: C.free, w: 900 });
    }
    if (actB) lab([0.35, -0.35, 0.35], '只剩原点', { px: 32, a: A * gin(T.only0 + 0.3), color: C.ink, w: 900 });
    if (actC) lab(PL.line.map(v => v * 2.1), '三张平面共用一条线', { px: 30, a: A * gin(T.share + 0.8), color: C.peri, w: 900 });
  }

  // ── 定理 1.2.1：台阶示意 ──
  const GM = 3, GN = 5, PIV = [[0, 0], [1, 1], [2, 3]], FREE = [2, 4];
  function drawThm(D) {
    const a = win(t, T.thm + 0.2, T.conv, 0.5, 0.4); if (a <= 0) return;
    const cs = 104, x0 = DX - (GN * cs) / 2, y0 = DY - 210, g = smooth(prog(t, T.mn - 0.2, T.mn + 0.6));
    ctx.save(); ctx.globalAlpha = a;
    // 自由列底色
    for (const c of FREE) { const f = gin(T.fr + (c === 4 ? 0.2 : 0), 0.4); if (f > 0) { ctx.globalAlpha = a * f * 0.22; ctx.fillStyle = C.free; ctx.fillRect(x0 + c * cs + 4, y0 - 6, cs - 8, GM * cs + 12); } }
    ctx.globalAlpha = a;
    // 格子 + 内容
    ctx.font = F.sans(46, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const stairA = gin(T.stair, 0.5);
    for (let r = 0; r < GM; r++) for (let c = 0; c < GN; c++) {
      const k = smooth(prog(t, T.mn - 0.2 + (r * GN + c) * 0.025, T.mn + 0.2 + (r * GN + c) * 0.025)); if (k <= 0) continue;
      const cx = x0 + c * cs + cs / 2, cy = y0 + r * cs + cs / 2, isP = PIV.some(([pr, pc]) => pr === r && pc === c), pc = PIV[r][1];
      ctx.globalAlpha = a * k * 0.35; ctx.strokeStyle = C.mist; ctx.lineWidth = 1.5; ctx.strokeRect(cx - cs / 2, cy - cs / 2, cs, cs);
      const below = c < pc; ctx.globalAlpha = a * k * (below ? lerp(1, 0.4, stairA) : 1);
      ctx.fillStyle = below ? (stairA > 0.5 ? C.mist : C.ink) : C.ink;
      if (isP && stairA > 0) { star4(ctx, cx, cy, 30 * outBack(prog(t, T.piv + r * 0.25, T.piv + 0.4 + r * 0.25)), C.peri); if (prog(t, T.piv + r * 0.25, T.piv + 0.4 + r * 0.25) < 0.5) ctx.fillText('∗', cx, cy); }
      else ctx.fillText(below && stairA > 0.5 ? '0' : '∗', cx, cy);
    }
    // 台阶线
    if (stairA > 0) {
      ctx.globalAlpha = a * stairA; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath();
      ctx.moveTo(x0, y0); PIV.forEach(([r, c], i) => { const xs = x0 + c * cs; if (i) ctx.lineTo(xs, y0 + r * cs); ctx.lineTo(xs, y0 + (r + 1) * cs); });
      ctx.lineTo(x0 + GN * cs, y0 + GM * cs); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
    // 维度标注
    K.tag('n = 5 个未知数', DX, y0 - 52, { px: 32, a: a * g, align: 'center', color: C.inkMid });
    ctx.save(); ctx.globalAlpha = a * g; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0 - 22); ctx.lineTo(x0 + GN * cs, y0 - 22); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x0 - 22, y0); ctx.lineTo(x0 - 22, y0 + GM * cs); ctx.stroke(); ctx.restore();
    K.tag('m = 3', x0 - 40, y0 + GM * cs / 2, { px: 32, a: a * g, align: 'right', color: C.inkMid });
    // 列标题：主元 / 自由
    for (let c = 0; c < GN; c++) {
      const isF = FREE.includes(c), f = isF ? gin(T.fr + (c === 4 ? 0.2 : 0)) : gin(T.piv + 0.3);
      K.tag(isF ? '自由' : '主元', x0 + c * cs + cs / 2, y0 + GM * cs + 36, { px: 28, a: a * f, align: 'center', color: isF ? C.free : C.peri });
    }
    K.tag('主元最多 m = 3 个', DX, y0 + GM * cs + 96, { px: 34, a: a * win(t, T.piv + 0.8, T.fr, 0.3, 0.3), align: 'center', color: C.peri });
    K.tag('n − m = 2 个自由变量', DX, y0 + GM * cs + 96, { px: 34, a: a * win(t, T.fr + 0.4, T.one, 0.3, 0.3), align: 'center', color: C.free });
    // C18：自由变量取 1
    if (t > T.one - 0.2) {
      const o = gin(T.one); K.tag('= 1', x0 + 2 * cs + cs / 2, y0 + GM * cs + 76, { px: 34, a: a * o, align: 'center', color: C.free, w: 900 });
      K.tag('= 0', x0 + 4 * cs + cs / 2, y0 + GM * cs + 76, { px: 34, a: a * o, align: 'center', color: C.inkMid });
      K.tag('→ 非零解', DX, y0 + GM * cs + 138, { px: 40, a: a * gin(T.nzs), align: 'center', color: C.j, font: F.serif, w: 900 });
    }
    // 定理式子（C15）
    const ta = a * win(t, T.nm - 0.3, T.stair - 0.2, 0.3, 0.3);
    if (ta > 0) tex.draw(ctx, tex.place('thm', DX, y0 + GM * cs + 100, 56, 'c'), { alpha: ta, reveal: prog(t, T.nm - 0.3, T.nm + 0.9), color: C.peri });
  }

  // ── 光合作用 ──
  function drawChem(D) {
    const a = win(t, T.chem0 + 0.4, T.traf, 0.5, 0.5); if (a <= 0) return;
    const yr = DY - 330;
    const rxA = a * (1 - smooth(prog(t, T.bal - 0.4, T.bal)));
    if (t > T.chem - 0.3) tex.draw(ctx, tex.place('rx', DX, yr, 46, 'c'), { alpha: rxA, reveal: prog(t, T.chem - 0.3, T.coef + 0.6), cls: {} });
    if (t > T.bal - 0.5) {
      const r6 = a * gin(T.bal - 0.2, 0.5);
      tex.draw(ctx, tex.place('rx6', DX, yr, 50, 'c'), { alpha: r6 * (1 - 0.6 * win(t, T.zz, T.nothing + 1.2, 0.3, 0.3)) });
      const bl = win(t, T.bal + 1.2, T.zz - 0.1, 0.3, 0.25); if (bl > 0) K.tag('配平 ✓', DX, yr + 66, { px: 34, a: r6 * bl, align: 'center', color: C.j, w: 900 });
    }
    // D08 / G03：零解 —— 什么都没发生
    const zz = win(t, T.zz, T.traf - 0.3, 0.3, 0.3);
    if (zz > 0) {
      K.tag('0 CO₂ + 0 H₂O → 0 O₂ + 0 C₆H₁₂O₆', DX, yr + 66, { px: 34, a: a * zz, align: 'center', color: C.inkMid });
      const s = prog(t, T.nothing, T.nothing + 0.5); if (s > 0) { ctx.save(); ctx.globalAlpha = a * zz; ctx.strokeStyle = C.free; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(DX - 300, yr + 66); ctx.lineTo(DX - 300 + 600 * s, yr + 66); ctx.stroke(); ctx.restore(); }
    }
    K.tag('右边全是 0，有什么用？', DX, DY - 20, { px: 46, a: a * win(t, T.chem0 + 0.6, T.chem - 0.2, 0.3, 0.3), align: 'center', color: C.inkMid, font: F.serif, w: 900 });
    K.tag('→ 化学配平', DX, DY + 60, { px: 40, a: a * win(t, L('C19').s + 0.3, T.chem + 1.2, 0.3, 0.3), align: 'center', color: C.peri, font: F.serif, w: 900 });
    // C21–C22：三种原子
    const ea = a * win(t, T.cC - 0.2, T.move + 0.3, 0.3, 0.4);
    if (ea > 0) [['eqC', T.cC], ['eqO', T.cO], ['eqH', T.cH]].forEach(([k, tt], i) => {
      if (t > tt - 0.2) tex.draw(ctx, tex.place(k, DX - 300, DY - 120 + i * 110, 54, 'l'), { alpha: ea, reveal: prog(t, tt - 0.2, tt + 1.0) });
    });
    if (t > T.atoms - 0.2) K.tag('两边每种原子一样多', DX, DY - 220, { px: 32, a: a * win(t, T.atoms, T.move, 0.3, 0.3), align: 'center', color: C.inkMid });
    // C23 起：矩阵板
    const ba = a * gin(T.move, 0.5) * (1 - smooth(prog(t, T.bal - 0.3, T.bal + 0.3)) * 0.0);
    if (ba > 0) {
      const mode = smoother(prog(t, T.hom - 0.3, T.hom + 0.6));
      B2.draw(ctx, t, { ...BO2, mode, alpha: ba, labels: false,
        pivots: [0, 1, 2].map(i => ({ r: i, c: i, t0: T.rr + 0.9 + i * 0.12, t1: T.traf })), stair: win(t, T.rr + 0.9, T.traf, 0.3, 0.3) });
      const Lb = B2.layout(BO2);
      colBox(B2, BO2, 4, ba * win(t, T.zeroR, T.gt, 0.25, 0.3), C.peri, mode);
      // D07：3 < 4
      const ct = ba * win(t, T.cnt, T.rr, 0.3, 0.3);
      K.tag('3 个方程  <  4 个未知数', BO2.x, BO2.y + Lb.h / 2 + 70, { px: 38, a: ct, align: 'center', color: C.ink, font: F.serif, w: 900 });
      // C24：x₄ 自由
      const fa = ba * win(t, T.f4, T.traf, 0.3, 0.3) * mode;
      if (fa > 0) { const [x, y] = B2.cell(BO2, 0, 3, 1); K.tag('自由', x, y - Lb.rh * 1.55, { px: 28, a: fa, align: 'center', color: C.free }); }
      if (t > T.six - 0.2) tex.draw(ctx, tex.place('solP', BO2.x, BO2.y + Lb.h / 2 + 70, 46, 'c'), { alpha: ba * gin(T.six - 0.2, 0.5), reveal: prog(t, T.six - 0.2, T.six + 0.9), color: C.peri });
    }
  }

  // ── 车流（Leon 图 1.2.2） ──
  const tr = S.traffic, Iv = tr.inter, d = 160;
  const NODE = { A: [DX - d, DY - d - 40], D: [DX + d, DY - d - 40], B: [DX - d, DY + d - 40], C: [DX + d, DY + d - 40] };
  const arm = 250;
  // [起点, 终点, 标签键, 数值或变量下标]
  const SEGS = [
    { p: [NODE.A[0], NODE.A[1] - arm], q: NODE.A, v: Iv.A[0], node: 'A', io: 'in' },
    { p: NODE.A, q: [NODE.A[0] - arm, NODE.A[1]], v: Iv.A[1], node: 'A', io: 'out' },
    { p: NODE.D, q: [NODE.D[0], NODE.D[1] - arm], v: Iv.D[1], node: 'D', io: 'out' },
    { p: [NODE.D[0] + arm, NODE.D[1]], q: NODE.D, v: Iv.D[0], node: 'D', io: 'in' },
    { p: [NODE.B[0] - arm, NODE.B[1]], q: NODE.B, v: Iv.B[0], node: 'B', io: 'in' },
    { p: NODE.B, q: [NODE.B[0], NODE.B[1] + arm], v: Iv.B[1], node: 'B', io: 'out' },
    { p: NODE.C, q: [NODE.C[0] + arm, NODE.C[1]], v: Iv.C[1], node: 'C', io: 'out' },
    { p: [NODE.C[0], NODE.C[1] + arm], q: NODE.C, v: Iv.C[0], node: 'C', io: 'in' },
    { p: NODE.D, q: NODE.A, x: 0 }, { p: NODE.A, q: NODE.B, x: 1 }, { p: NODE.B, q: NODE.C, x: 2 }, { p: NODE.C, q: NODE.D, x: 3 },
  ];
  const XSUB = ['x₁', 'x₂', 'x₃', 'x₄'];
  function drawTraffic(D) {
    const a = win(t, T.traf + 0.3, T.sum, 0.6, 0.5); if (a <= 0) return;
    const g = outCubic(prog(t, T.traf + 0.3, T.net + 0.6));
    ctx.save(); K.clip(D); ctx.globalAlpha = a;
    // 路：深色宽带
    ctx.strokeStyle = C.ghost; ctx.lineWidth = 64; ctx.lineCap = 'butt';
    for (const xx of [NODE.A[0], NODE.D[0]]) { ctx.beginPath(); ctx.moveTo(xx, DY - 40 - (d + arm) * g); ctx.lineTo(xx, DY - 40 + (d + arm) * g); ctx.stroke(); }
    for (const yy of [NODE.A[1], NODE.B[1]]) { ctx.beginPath(); ctx.moveTo(DX - (d + arm) * g, yy); ctx.lineTo(DX + (d + arm) * g, yy); ctx.stroke(); }
    ctx.restore();
    // 车：沿方向流动的小方块
    const fl = smooth(prog(t, T.net, T.net + 0.8));
    if (fl > 0) { ctx.save(); K.clip(D);
      SEGS.forEach((s, i) => {
        const len = Math.hypot(s.q[0] - s.p[0], s.q[1] - s.p[1]), n = Math.max(2, Math.round(len / 70)), ux = (s.q[0] - s.p[0]) / len, uy = (s.q[1] - s.p[1]) / len;
        for (let k = 0; k < n; k++) {
          const f = ((t * 0.32 + k / n + i * 0.137) % 1), x = s.p[0] + ux * len * f, y = s.p[1] + uy * len * f, edge = Math.min(1, f * 6, (1 - f) * 6);
          ctx.globalAlpha = a * fl * edge * 0.55; ctx.fillStyle = s.x != null ? C.ink : C.inkMid; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(uy, ux)); ctx.fillRect(-9, -5, 18, 10); ctx.restore();
        }
      }); ctx.restore(); }
    // 箭头 + 标签
    const hiA = win(t, T.eqA, T.rref, 0.3, 0.3);
    SEGS.forEach((s, i) => {
      const ga = gin(T.net + 0.1 + i * 0.05, 0.4); if (ga <= 0) return;
      let col = C.ink; if (s.node === 'A' && hiA > 0) col = s.io === 'in' ? C.j : C.peri;
      if (s.x === 0 && hiA > 0) col = C.j; if (s.x === 1 && hiA > 0) col = C.peri;
      const mx = (s.p[0] + s.q[0]) / 2, my = (s.p[1] + s.q[1]) / 2, ux = s.q[0] - s.p[0], uy = s.q[1] - s.p[1], l = Math.hypot(ux, uy);
      const sh = s.x != null ? 46 : 46, p0 = [s.p[0] + ux / l * sh, s.p[1] + uy / l * sh], q0 = [s.q[0] - ux / l * sh, s.q[1] - uy / l * sh];
      arrow(ctx, p0, q0, { color: col, width: 5, head: 18, alpha: a * ga, grow: ga });
      const nx = -uy / l, ny = ux / l, off = 40;
      let text, tc = col;
      if (s.x != null) {
        text = XSUB[s.x];
        const known = [T.fill, T.fill2, T.fill3, T.x4 + 0.4][s.x], kv = tr.pick.x[s.x];
        if (t > known) { const k = outBack(prog(t, known, known + 0.4)); text = String(kv); tc = C.peri; K.tag(text, mx + nx * off, my + ny * off, { px: 34 * lerp(1.3, 1, k), a: a * ga, align: 'center', color: tc, w: 900 }); return; }
        K.tag(text, mx + nx * off, my + ny * off, { px: 34, a: a * ga, align: 'center', color: s.x === 3 && t > T.f4t ? C.free : tc, w: 900 });
      } else K.tag(String(s.v), mx + nx * off, my + ny * off, { px: 30, a: a * ga, align: 'center', color: tc === C.ink ? C.inkMid : tc });
    });
    // 路口
    Object.entries(NODE).forEach(([k, [x, y]], i) => {
      const ga = gin(T.net + i * 0.12, 0.4); if (ga <= 0) return;
      const p = pulse(t, T.inout + i * 0.25, 0.6) + (k === 'A' ? pulse(t, T.eqA, 0.8) : 0);
      ctx.save(); ctx.globalAlpha = a * ga; ctx.fillStyle = C.disc; ctx.strokeStyle = k === 'A' && hiA > 0 ? C.peri : C.ink; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 30 + 8 * p, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      K.tag(k, x, y + 1, { px: 32, a: a * ga, align: 'center', color: C.ink, font: F.serif, w: 900 });
    });
    // C28：路口 A 进 / 出
    if (hiA > 0) {
      K.tag('进', NODE.A[0] - 100, NODE.A[1] - 140, { px: 30, a: a * hiA, align: 'center', color: C.j, w: 900 });
      K.tag('出', NODE.A[0] - 150, NODE.A[1] + 50, { px: 30, a: a * hiA, align: 'center', color: C.peri, w: 900 });
    }
    // 底部：x₄ 自由 / 已知
    const yb = DY + d + arm - 40 + 30;
    K.tag('算不出唯一的车流', DX, yb, { px: 34, a: a * win(t, T.cant, T.x4, 0.3, 0.3), align: 'center', color: C.free });
  }

  // ── 总结 ──
  function drawSum(D) {
    const a = smooth(prog(t, T.sum, T.sum + 0.5)); if (a <= 0) return;
    const card = (y, g, l1, l2, col) => { if (g <= 0) return; const w = 700, h = 150, k = outBack(g);
      ctx.save(); ctx.globalAlpha = a * g; ctx.translate(DX, y); ctx.scale(lerp(0.9, 1, k), lerp(0.9, 1, k)); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, 10, h); ctx.restore();
      K.tag(l1, DX, y - 28, { px: 38, a: a * g, align: 'center', color: C.ink, font: F.serif, w: 900 }); K.tag(l2, DX, y + 34, { px: 34, a: a * g, align: 'center', color: col, w: 700 }); };
    card(DY - 130, gin(T.s1, 0.5), '齐次方程组 A x = 0', '一定有零解（x = 0 永远成立）', C.j);
    card(DY + 70, gin(T.s2, 0.5), '未知数 n  >  方程 m', '一定有无穷多个非零解', C.peri);
    K.tag('下一节：矩阵 × 向量', DX, DY + 250, { px: 36, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  // ── 左栏 ──
  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    // C02–C05
    let a = sec(T.sys, T.s3d);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('齐次方程组', 210, 1, smooth(prog(t, T.sys, T.sys + 0.6)));
      K.bullet('常数项全是 0', 290, gin(T.cst)); K.bullet('永远有解：全取 0', 350, gin(T.always));
      K.note('名字 · 对照', ['教材：平凡解（trivial）', '同济：零解'], 400, gin(T.triv, 0.5));
      ctx.restore(); }
    // C06–D03
    a = sec(T.s3d + 0.2, T.elim);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('一个方程 = 一张平面', 210, 1, smooth(prog(t, T.s3d + 0.3, T.s3d + 0.9)));
      if (t > T.p1 - 0.2) tex.draw(ctx, tex.place('e1', LX, 290, 40, 'l'), { alpha: a * gin(T.p1 - 0.2), reveal: prog(t, T.p1 - 0.2, T.p1 + 0.8), color: C.i });
      if (t > T.p2 - 0.2) tex.draw(ctx, tex.place('e2', LX, 355, 40, 'l'), { alpha: a * gin(T.p2 - 0.2), reveal: prog(t, T.p2 - 0.2, T.p2 + 0.8), color: C.j });
      K.bullet('右边是 0 → 都过原点', 430, gin(T.orig)); K.bullet('两张平面交成一条直线', 490, gin(T.line));
      K.bullet('非零解有无穷多个', 550, gin(T.inf), { color: C.free, mark: C.free }); ctx.restore(); }
    // C10–C11
    a = sec(T.elim + 0.2, T.back3d);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('消元验证', 210, 1, smooth(prog(t, T.elim + 0.3, T.elim + 0.9)));
      K.bullet('R₂ − 2R₁', 290, gin(T.o1)); K.bullet('x₃ 自由，设 x₃ = t', 350, gin(T.free), { mark: C.free });
      if (t > T.tt - 0.1) tex.draw(ctx, tex.place('par', LX, 430, 36, 'l'), { alpha: a, reveal: prog(t, T.tt, T.sol + 0.6) });
      if (t > T.sol - 0.1) tex.draw(ctx, tex.place('sol', LX, 505, 38, 'l'), { alpha: a, reveal: prog(t, T.sol, T.sol + 0.9), color: C.peri });
      ctx.restore(); }
    // C12–C13
    a = sec(T.back3d + 0.2, T.thm);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('t 取遍实数', 210, 1, smooth(prog(t, T.back3d + 0.3, T.back3d + 0.9)));
      tex.draw(ctx, tex.place('sol', LX, 290, 38, 'l'), { alpha: a, color: C.peri });
      K.bullet('点排成那条交线', 360, gin(T.tAll + 0.4));
      if (t > T.third - 0.2) tex.draw(ctx, tex.place('e3', LX, 440, 40, 'l'), { alpha: a * gin(T.third - 0.2), reveal: prog(t, T.third - 0.2, T.third + 0.8), color: C.k });
      K.bullet('三张平面 → 只交于原点', 510, gin(T.only0)); K.bullet('只剩零解', 570, gin(T.only0 + 0.8), { color: C.inkMid, mark: C.mist }); ctx.restore(); }
    // C14–C18
    a = sec(T.thm + 0.2, T.conv);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('定理 1.2.1', 210, 1, smooth(prog(t, T.th, T.th + 0.6)), C.peri);
      K.bullet('m 个方程，n 个未知数', 290, gin(T.mn)); K.bullet('n > m  ⇒  有非零解', 350, gin(T.nm), { color: C.peri });
      K.bullet('主元 ≤ m（每行最多一个）', 430, gin(T.piv), { px: 32 }); K.bullet('自由变量 ≥ n − m > 0', 485, gin(T.fr), { px: 32, mark: C.free });
      K.bullet('自由变量取 1 → 非零解', 540, gin(T.one), { px: 32, color: C.j, mark: C.j }); ctx.restore(); }
    // G01–G02
    a = sec(T.conv + 0.2, T.chem0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('反过来？不一定', 210, 1, smooth(prog(t, T.conv + 0.3, T.conv + 0.9)));
      K.note('GPT · 提醒', ['n ≤ m 也可能有非零解', '三张平面共用一条直线'], 270, gin(T.conv + 0.6, 0.5));
      K.note('同济第六版 · 对照', ['秩 R(A) < n  ⇔  有非零解', '（秩：后面再讲）'], 470, gin(T.rank, 0.5)); ctx.restore(); }
    // D06–G03
    a = sec(T.chem0 + 0.4, T.traf);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('配平 = 齐次方程组', 210, 1, smooth(prog(t, T.chem0 + 0.5, T.chem0 + 1.1)));
      K.bullet('每种原子：左边 = 右边', 290, gin(T.atoms)); K.bullet('移项：右边全是 0', 350, gin(T.zeroR));
      K.bullet('3 个方程，4 个未知数', 410, gin(T.cnt)); K.bullet('4 > 3 → 一定能配平', 470, gin(T.gt), { color: C.peri });
      K.bullet('x₄ = 1 → 6, 6, 6, 1', 530, gin(T.pick), { color: C.j, mark: C.j }); ctx.restore(); }
    // C26–C32
    a = sec(T.traf + 0.3, T.sum);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('车流：进 = 出', 210, 1, smooth(prog(t, T.traf + 0.4, T.traf + 1.0)));
      K.bullet('4 个路口 → 4 个方程', 290, gin(T.four));
      if (t > T.eqA - 0.1) tex.draw(ctx, tex.place('eqA', LX, 360, 36, 'l'), { alpha: a * win(t, T.eqA, T.rref - 0.1, 0.3, 0.3), reveal: prog(t, T.eqA, T.eqA + 1.0) });
      K.bullet('最后一行全 0 → x₄ 自由', 360, gin(T.f4t) * (t > T.rref ? 1 : 0), { mark: C.free });
      if (t > T.con - 0.1) ['solT1', 'solT2', 'solT3'].forEach((k, i) => tex.draw(ctx, tex.place(k, LX, 435 + i * 58, 38, 'l'), { alpha: a, reveal: prog(t, T.con + i * 0.5, T.con + 0.6 + i * 0.5) }));
      ctx.restore(); }
    // 总结
    a = smooth(prog(t, T.sum, T.sum + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; K.head('一句话', 210, 1, smooth(prog(t, T.sum, T.sum + 0.6)));
      K.bullet('零解永远在', 290, gin(T.s1)); K.bullet('未知数多 → 必有非零解', 350, gin(T.s2), { color: C.peri }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.2', prog(t, 0.2, 1.3));
    drawTitle(); drawRecap(); drawB1(); draw3D(D); drawThm(D); drawChem(D); drawTraffic(D); drawSum(D);
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
