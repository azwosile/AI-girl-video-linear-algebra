// 第 1 章 §1.5（上）初等矩阵与求逆（Leon 9th §1.5 例 1–5、Thm 1.5.1、Thm 1.5.2、Cor 1.5.3；同济第六版 第三章 §1）。
// 3B1B 视角：三种行变换 = 三种网格变换；消元 = 把斜网格拧正；E₂E₁A = I ⇒ E₂E₁ = A⁻¹。
// 分镜：
//   D01–C02   行变换 = 左乘初等矩阵；I 做一次行变换
//   C03–C09   三类：交换（沿 y = x 翻折）、倍乘（拉伸）、倍加（剪切），例 1–3
//   D02–C12   “非零”：乘 0 压扁；Thm 1.5.1 逆仍是初等矩阵
//   C13–D03   拧正网格：A → E₁A → E₂E₁A = I，E₂E₁ = A⁻¹
//   C17–G01   Thm 1.5.2 三句话等价、Cor 1.5.3、行等价
//   C20–D04   [A | I] → [I | A⁻¹]，例 4 逐步
//   C26       例 5：x = A⁻¹b
//   C27–C28   消出零行 → 奇异
//   G02–C29   同济对照、总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mlerp2 } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow, ring } from '../../engine/la2d/plane.js';
import { fmtNum } from '../../engine/la2d/mboard.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'ds_shock', 'gpt_cross', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const num = v => typeof v === 'string' ? (v.includes('/') ? v.split('/').reduce((a, b) => Number(a) / Number(b)) : Number(v)) : v;
const mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const SUBN = ['₁', '₂', '₃'];

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const EX4 = MJ.systems.ex4aug, SG = MJ.systems.sing;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.4, C03: 0.6, C05: 0.3, C06: 0.7, C07: 0.3, C08: 0.7, C09: 0.3, C11: 0.6, C13: 0.8, C14: 0.4, C15: 0.4, C16: 0.4, C17: 0.7, C19: 0.4, C20: 0.8, C22: 0.4, C23: 0.5, C24: 0.5, C25: 0.5, C26: 0.6, C27: 0.6, D05: 0.6 },
    post: { C05: 0.6, C07: 0.6, C09: 0.6, C14: 0.5, C15: 0.7, C16: 0.4, C18: 0.5, C22: 0.6, C23: 0.6, C24: 0.6, C25: 0.8, C27: 0.5 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 30, oy: DY + 60, u: 100, R: 9 });

  const T = {
    left: cue('C01', '左边乘上'), elem: cue('C01', '初等矩阵'),
    def: L('C02').s - 0.4, once: cue('C02', '只做一次'), three: cue('C02', '三种行变换'),
    t1: L('C03').s - 0.6, ex1: cue('C03', '例一'), e1a: cue('C04', 'E一乘'), sw: cue('C05', '互换位置'), flip: cue('C05', '翻过去'),
    t2: L('C06').s - 0.6, ex2: cue('C06', '例二'), st: cue('C07', '横向拉长'),
    t3: L('C08').s - 0.6, ex3: cue('C08', '例三'), shr: cue('C09', '剪切'),
    nz: L('D02').s, zero: cue('C10', '乘零'), flat: cue('C10', '压扁'),
    th1: L('C11').s - 0.5, th1b: cue('C11', '而且'), iv1: cue('C12', '再换回来'), iv2: cue('C12', '乘阿尔法的逆'), iv3: cue('C12', '加m倍'),
    tw: L('C13').s - 0.7, aSk: cue('C13', '网格是斜的'), s1: cue('C14', '第一步'), s1e: cue('C14', '初等矩阵E一'), s2: cue('C15', '第二步'), s2e: cue('C15', '拧正了'),
    eq: cue('C16', '写成式子'), who: cue('C16', '那E二E一'), inv: cue('C16', '它就是'), wow: L('D03').s,
    th2: L('C17').s - 0.6, th2n: cue('C17', '三句话等价'), ca: cue('C18', 'A可逆'), cb: cue('C18', '只有零解'), cc: cue('C18', '化成I'),
    cor: L('C19').s - 0.3, cor2: cue('C19', '当且仅当'), rq: L('G01').s,
    alg: L('C20').s - 0.7, side: cue('C20', '旁边'), same: cue('C21', '同一串E'), res: cue('C21', '正好变成'),
    e4: cue('C22', '例四'), o0: cue('C22', '第二行加第一行'), o1: cue('C22', '第三行减'), o2: cue('C23', '第三行加上'), tri: cue('C23', '上三角'),
    o3: cue('C24', '用第三行'), o5: cue('C24', '再用第二行'), o6: cue('C25', '每行除以'), done: cue('C25', '右边那块'), cook: L('D04').s,
    e5: L('C26').s - 0.4, e5r: cue('C26', '得到'),
    sg: L('C27').s - 0.4, sgop: cue('C27', '第二行减'), sgz: cue('C27', '直接变成零'), sgn: cue('C28', '奇异的'),
    tj: L('G02').s - 0.2, tjc: cue('G02', '列变换'),
    end0: L('D05').s - 0.6, z1: cue('D05', '左乘'), z2: cue('D05', '三类'), z3: L('D06').s, z4: cue('D06', '消出零行'), next: cue('C29', '下一节'),
  };
  T.o4 = T.o3 + 0.9; T.o7 = T.o6 + 0.9;
  const OPT = [T.o0, T.o1, T.o2, T.o3, T.o4, T.o5, T.o6, T.o7];

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('stamp', T.elem, 0.35); TL.sfx('swell', T.def, 0.3); TL.sfx('pop', T.once, 0.3);
  [[T.t1, T.flip], [T.t2, T.st], [T.t3, T.shr]].forEach(([a, b]) => { TL.sfx('whoosh', a, 0.3); TL.sfx('warp', b, 0.4); }); TL.sfx('pop', T.e1a, 0.3);
  TL.sfx('ding_lo', T.nz + 0.2, 0.25); TL.sfx('thud', T.flat, 0.3); TL.sfx('stamp', T.th1 + 0.4, 0.35); [T.iv1, T.iv2, T.iv3].forEach(t => TL.sfx('check', t, 0.3));
  TL.sfx('whoosh', T.tw, 0.35); TL.sfx('warp', T.s1, 0.4); TL.sfx('warp', T.s2, 0.4); TL.sfx('shimmer', T.s2e, 0.35); TL.sfx('stamp', T.inv, 0.35); TL.sfx('sting', T.wow + 0.2, 0.3);
  TL.sfx('whoosh', T.th2, 0.3); [T.ca, T.cb, T.cc].forEach(t => TL.sfx('marimba', t, 0.3)); TL.sfx('bell_soft', T.cor2, 0.3); TL.sfx('bell_soft', T.rq, 0.3);
  TL.sfx('whoosh', T.alg, 0.3); TL.sfx('pop', T.side, 0.3); OPT.forEach((t, i) => TL.sfx(i % 2 ? 'marimba_hi' : 'marimba', t + 0.3, 0.28)); TL.sfx('stamp', T.done, 0.35); TL.sfx('sparkle', T.cook + 0.2, 0.3);
  TL.sfx('whoosh', T.e5, 0.3); TL.sfx('check', T.e5r, 0.3); TL.sfx('whoosh', T.sg, 0.3); TL.sfx('thud', T.sgz, 0.3); TL.sfx('buzz', T.sgn, 0.25); TL.sfx('bell_soft', T.tj + 0.2, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.z1, T.z2, T.z3, T.z4].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C29').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.2, L('C01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.5 初等矩阵'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'ELEMENTARY MATRICES', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    K.tag('行变换 = 左乘 E', DX, DY, { px: 54, a: a * gin(T.left, 0.5), align: 'center', color: C.peri, font: F.serif, w: 900 });
  }

  // ── 定义：I 做一次行变换 ──
  function drawDef() {
    const a = win(t, T.def, T.t1, 0.4, 0.4); if (a <= 0) return;
    texAt('I3', DX - 200, DY - 60, 50, { alpha: a, reveal: prog(t, T.def, T.def + 0.9) });
    arrow(ctx, [DX - 20, DY - 60], [DX + 90, DY - 60], { color: C.peri, width: 5, head: 20, alpha: a * gin(T.once), grow: smoother(prog(t, T.once, T.once + 0.5)) });
    K.tag('一次行变换', DX + 35, DY - 110, { px: 26, a: a * gin(T.once), align: 'center', color: C.peri });
    K.tag('E', DX + 200, DY - 60, { px: 90, a: a * gin(T.once + 0.5), align: 'center', color: C.peri, font: F.serif, w: 900 });
    ['交换', '倍乘', '倍加'].forEach((s, i) => K.tag(`${['I', 'II', 'III'][i]} · ${s}`, DX + (i - 1) * 260, DY + 160, { px: 36, a: a * gin(T.three + i * 0.3), align: 'center', color: [C.i, C.j, C.k][i], w: 900 }));
  }

  // ── 平面：三类 + 乘 0 + 拧正 ──
  const A2 = [[1, 2], [2, 5]], E1 = [[1, 0], [-2, 1]], E2 = [[1, -2], [0, 1]];
  function planeState() {
    if (t < T.t2 - 0.3) return { M: mlerp2([[0, 1], [1, 0]], smoother(prog(t, T.sw - 0.1, T.sw + 1.4))), k: 'swap' };
    if (t < T.t3 - 0.3) return { M: mlerp2([[2, 0], [0, 1]], smoother(prog(t, T.st - 0.1, T.st + 1.2))), k: 'scale' };
    if (t < T.nz) return { M: mlerp2([[1, 1], [0, 1]], smoother(prog(t, T.shr - 0.2, T.shr + 1.1))), k: 'shear' };
    if (t < T.th1) return { M: [[1, 0], [0, 1 - smoother(prog(t, T.zero, T.zero + 1.2))]], k: 'zero' };
    // 拧正：A → E1A → I
    const s0 = smoother(prog(t, T.tw + 0.9, T.aSk + 0.4)), s1 = smoother(prog(t, T.s1 + 0.3, T.s1 + 1.6)), s2 = smoother(prog(t, T.s2 + 0.3, T.s2 + 1.6));
    let M = mlerp2(A2, s0);
    if (s1 > 0) { const B = mul(E1, A2); M = A2.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s1))); }
    if (s2 > 0) { const B = mul(E1, A2), Cc = mul(E2, B); M = B.map((r, i) => r.map((v, j) => lerp(v, Cc[i][j], s2))); }
    return { M, k: 'tw' };
  }
  function drawPlane(D) {
    const a = win(t, T.t1 + 0.2, T.th1, 0.5, 0.4) * (1 - win(t, T.ex1 - 0.1, T.sw - 0.3, 0.3, 0.3)) + win(t, T.tw + 0.5, T.th2, 0.6, 0.5);
    if (a <= 0.003) return;
    const { M, k } = planeState();
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.6 * a });
    P.axes(ctx, { M, color: C.ink, width: 3, alpha: 0.8 * a });
    if (k === 'swap') { ctx.setLineDash([12, 10]); P.line(ctx, [0, 0], [Math.SQRT1_2, Math.SQRT1_2], { M: [[1, 0], [0, 1]], color: C.peri, width: 3, alpha: a * gin(T.sw - 0.2) }); ctx.setLineDash([]); }
    ctx.restore();
    const O = P.S([0, 0], M), pi = P.S([1, 0], M), pj = P.S([0, 1], M);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: a }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: a });
    K.tag('î', pi[0] + 16, pi[1] - 24, { px: 40, a, color: C.i, w: 900, font: F.serif }); K.tag('ĵ', pj[0] - 40, pj[1] - 14, { px: 40, a, color: C.j, w: 900, font: F.serif });
    const card = (key, lab, col, g) => { if (g <= 0) return; texAt(key, DX + 300, DY - 280, 46, { alpha: a * g, halo: C.disc }); K.tag(lab, DX + 300, DY - 190, { px: 30, a: a * g, align: 'center', color: col, w: 900 }); };
    if (k === 'swap') { card('Fswap', '交换 → 沿 y = x 翻折', C.i, gin(T.sw)); K.tag('y = x', P.S([-2.6, -2.0], [[1, 0], [0, 1]])[0], P.S([-2.6, -2.0], [[1, 0], [0, 1]])[1], { px: 30, a: a * gin(T.sw), color: C.peri, w: 900 }); }
    if (k === 'scale') card('Fscale', '第一行 ×2 → 横向拉伸', C.j, gin(T.st - 0.3));
    if (k === 'shear') card('Fshear', '第一行 + 第二行 → 剪切', C.k, gin(T.shr - 0.3));
    if (k === 'zero') K.tag('× 0：压扁，撤不回 ✗', DX, DY - 330, { px: 40, a: a * win(t, T.zero, T.th1 - 0.7, 0.3, 0.3), align: 'center', color: C.free, font: F.serif, w: 900 });
    if (k === 'tw') {
      texAt('A2', DX + 280, DY - 300, 42, { alpha: a * win(t, T.tw + 0.4, T.th2, 0.3, 0.3), halo: C.disc });
      if (t > T.s1 - 0.2) texAt('E1s', DX + 280, DY - 160, 40, { alpha: a * gin(T.s1 - 0.2), color: C.i, halo: C.disc });
      if (t > T.s2 - 0.2) texAt('E2s', DX + 280, DY - 40, 40, { alpha: a * gin(T.s2 - 0.2), color: C.j, halo: C.disc });
      K.tag('网格是斜的', DX - 240, DY - 330, { px: 36, a: a * win(t, T.aSk, T.s1, 0.3, 0.3), align: 'center', color: C.ink, font: F.serif, w: 900 });
      K.tag('拧正了 = I', DX - 240, DY - 330, { px: 40, a: a * gin(T.s2e), align: 'center', color: C.j, font: F.serif, w: 900 });
      if (t > T.eq - 0.2) texAt('EEA', DX, DY + 260, 58, { alpha: a * win(t, T.eq - 0.2, T.inv, 0.3, 0.3), halo: C.disc });
      if (t > T.inv - 0.2) texAt('EEinv', DX, DY + 280, 50, { alpha: a * gin(T.inv - 0.2), reveal: prog(t, T.inv - 0.2, T.inv + 0.9), color: C.peri, halo: C.disc });
    }
  }

  // 例 1：E₁ 与 E₁A（C03–C04，平面淡出时）
  function drawEx123() {
    let a = win(t, T.ex1 - 0.1, T.sw - 0.3, 0.3, 0.3);
    if (a > 0) {
      texAt('E1', DX, DY - 170, 50, { alpha: a, reveal: prog(t, T.ex1 - 0.1, T.ex1 + 0.8) });
      if (t > T.e1a - 0.2) { const pl = tex.place('E1A', DX, DY + 110, 46, 'c'); tex.draw(ctx, pl, { alpha: a, reveal: prog(t, T.e1a - 0.2, T.e1a + 0.9) }); tex.draw(ctx, pl, { alpha: a * gin(T.e1a + 0.8), only: ['r', 's'], force: C.i }); }
      K.tag('例 1 · 第一类', DX, DY - 330, { px: 30, a, align: 'center', color: C.inkMid });
    }
    a = win(t, T.ex2 - 0.1, T.st - 0.3, 0.3, 0.3);
    if (a > 0) { texAt('E2', DX, DY - 40, 54, { alpha: a, reveal: prog(t, T.ex2 - 0.1, T.ex2 + 0.8) }); K.tag('例 2 · 第二类：第三行 × 3', DX, DY - 230, { px: 30, a, align: 'center', color: C.inkMid }); }
    a = win(t, T.ex3 - 0.1, T.shr - 0.3, 0.3, 0.3);
    if (a > 0) { texAt('E3', DX, DY - 40, 54, { alpha: a, reveal: prog(t, T.ex3 - 0.1, T.ex3 + 0.8) }); K.tag('例 3 · 第三类：第一行 + 3 × 第三行', DX, DY - 230, { px: 30, a, align: 'center', color: C.inkMid }); }
  }

  // ── Thm 1.5.1 ──
  function drawTh1() {
    const a = win(t, T.th1, T.tw, 0.4, 0.4); if (a <= 0) return;
    K.tag('定理 1.5.1', DX, DY - 300, { px: 46, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('初等矩阵都可逆，逆还是同类', DX, DY - 220, { px: 36, a: a * gin(T.th1b), align: 'center', color: C.ink, w: 900 });
    [['inv1', T.iv1, C.i], ['inv2', T.iv2, C.j], ['inv3', T.iv3, C.k]].forEach(([k, tt, col], i) => { if (t > tt - 0.2) texAt(k, DX, DY - 80 + i * 120, 54, { alpha: a * gin(tt - 0.2), reveal: prog(t, tt - 0.2, tt + 0.7), color: col }); });
  }

  // ── Thm 1.5.2 ──
  function drawTh2() {
    const a = win(t, T.th2, T.alg, 0.4, 0.4); if (a <= 0) return;
    K.tag('定理 1.5.2  （A 是 n 阶方阵）', DX, DY - 330, { px: 40, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    const ys = [DY - 210, DY - 90, DY + 30];
    [['thA', T.ca], ['thB', T.cb], ['thC', T.cc]].forEach(([k, tt], i) => { if (t > tt - 0.2) texAt(k, DX, ys[i], 50, { alpha: a * gin(tt - 0.2), reveal: prog(t, tt - 0.2, tt + 0.8) }); });
    for (let i = 0; i < 2; i++) K.tag('⇕', DX, (ys[i] + ys[i + 1]) / 2, { px: 34, a: a * gin([T.cb, T.cc][i] + 0.4), align: 'center', color: C.peri, w: 900 });
    K.tag('（A ~ I：行等价于 I）', DX + 230, ys[2], { px: 26, a: a * gin(T.cc + 0.6), align: 'left', color: C.inkMid });
    if (t > T.cor - 0.1) { texAt('cor', DX, DY + 190, 44, { alpha: a * gin(T.cor), reveal: prog(t, T.cor, T.cor2 + 0.8), color: C.j }); K.tag('推论 1.5.3', DX, DY + 260, { px: 28, a: a * gin(T.cor), align: 'center', color: C.j }); }
  }

  // ── [A | I] 板 ──
  const S0 = EX4.A.map(r => r.map(num)), ST = EX4.steps.map(s => s.map(r => r.map(num)));
  const OPS = EX4.ops;
  const opLabel = op => { const R = i => 'R' + SUBN[i]; if (op[0] === 'add') { const k = num(op[3]); const ak = Math.abs(k); return `${R(op[1])} ${k < 0 ? '−' : '+'} ${ak === 1 ? '' : fmtNum(ak)}${R(op[2])}`; } if (op[0] === 'scale') return `${R(op[1])} × ${fmtNum(num(op[2]))}`; return `${R(op[1])} ↔ ${R(op[2])}`; };
  function augBoard(states0, ops, opT, o) {
    const { x, y, px, a, nL } = o, m = states0.length, ncol = states0[0].length, cw = px * 2.0, rh = px * 1.55, bar = px * 0.9;
    const W = cw * ncol + bar, x0 = x - W / 2, y0 = y - (m * rh) / 2;
    const cx = j => x0 + j * cw + cw / 2 + (j >= nL ? bar : 0), ry = i => y0 + i * rh + rh / 2;
    let k = -1; for (let i = 0; i < opT.length; i++) if (t >= opT[i]) k = i;
    const cur = k < 0 ? states0 : o.steps[k], prev = k < 1 ? states0 : o.steps[k - 1], s = k < 0 ? 1 : smoother(prog(t, opT[k] + 0.25, opT[k] + 0.85));
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 3.5;
    const bx0 = x0 - px * 0.3, bx1 = x0 + W + px * 0.3, by0 = y0 - 6, by1 = y0 + m * rh + 6, e = 14;
    ctx.beginPath(); ctx.moveTo(bx0 + e, by0); ctx.lineTo(bx0, by0); ctx.lineTo(bx0, by1); ctx.lineTo(bx0 + e, by1); ctx.moveTo(bx1 - e, by0); ctx.lineTo(bx1, by0); ctx.lineTo(bx1, by1); ctx.lineTo(bx1 - e, by1); ctx.stroke();
    const xb = x0 + nL * cw + bar / 2; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xb, by0 + 6); ctx.lineTo(xb, by1 - 6); ctx.stroke();
    // 正在变的行：底色
    if (k >= 0 && t < opT[k] + 1.3) { const op = ops[k], r = op[1]; ctx.globalAlpha = a * 0.18 * (1 - smooth(prog(t, opT[k] + 0.9, opT[k] + 1.3))); ctx.fillStyle = C.peri; ctx.fillRect(x0 - px * 0.2, ry(r) - rh * 0.45, W + px * 0.4, rh * 0.9);
      if (op[0] === 'add') { ctx.globalAlpha = a * 0.12; ctx.fillStyle = C.j; ctx.fillRect(x0 - px * 0.2, ry(op[2]) - rh * 0.45, W + px * 0.4, rh * 0.9); } }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < m; i++) for (let j = 0; j < ncol; j++) {
      const v0 = prev[i][j], v1 = cur[i][j], chg = Math.abs(v0 - v1) > 1e-9, f = fmtNum(v1).includes('/') ? 0.78 : 1;
      const col = j < nL ? C.ink : C.periLt;
      ctx.font = F.sans(px * f, 500);
      if (chg && s < 1) { ctx.globalAlpha = a * (1 - s); ctx.fillStyle = col; ctx.fillText(fmtNum(v0), cx(j), ry(i) - s * 14); ctx.globalAlpha = a * s; ctx.fillStyle = C.peri; ctx.fillText(fmtNum(v1), cx(j), ry(i) + (1 - s) * 14); }
      else { ctx.globalAlpha = a; ctx.fillStyle = chg && t < opT[k] + 1.4 ? C.peri : col; ctx.fillText(fmtNum(v1), cx(j), ry(i)); }
    }
    // 操作标签
    if (k >= 0) { const la = win(t, opT[k], (opT[k + 1] ?? opT[k] + 2.2) - 0.05, 0.15, 0.2); K.tag(opLabel(ops[k]), x0 + W + px * 1.0, ry(ops[k][1]), { px: px * 0.72, a: a * la, color: C.peri, w: 900 }); }
    ctx.restore();
    return { x0, y0, W, cx, ry, rh };
  }
  function drawAlg() {
    const a = win(t, T.alg, T.e5, 0.4, 0.4); if (a <= 0) return;
    const top = win(t, T.alg, T.e4 - 0.2, 0.3, 0.3);
    if (top > 0) { texAt('alg', DX, DY - 120, 64, { alpha: a * top, reveal: prog(t, T.side - 0.2, T.res + 0.6) }); if (t > T.same - 0.2) texAt('algE', DX, DY + 60, 44, { alpha: a * top * gin(T.same - 0.2), reveal: prog(t, T.same - 0.2, T.same + 1.2), color: C.peri }); }
    const ba = a * gin(T.e4 - 0.2, 0.5);
    if (ba > 0) {
      K.tag('教材 · 例 4', DX, DY - 320, { px: 30, a: ba, align: 'center', color: C.inkMid });
      K.tag('A', DX - 200, DY - 250, { px: 40, a: ba, align: 'center', color: C.ink, font: F.serif, w: 900 });
      K.tag('I', DX + 170, DY - 250, { px: 40, a: ba * (1 - gin(T.done, 0.4)), align: 'center', color: C.periLt, font: F.serif, w: 900 });
      K.tag('A⁻¹', DX + 170, DY - 250, { px: 40, a: ba * gin(T.done, 0.4), align: 'center', color: C.peri, font: F.serif, w: 900 });
      augBoard(S0, OPS, OPT, { x: DX - 70, y: DY - 40, px: 44, a: ba, nL: 3, steps: ST });
      K.tag('左边上三角 ✓', DX, DY + 170, { px: 32, a: ba * win(t, T.tri, T.o3, 0.3, 0.3), align: 'center', color: C.j, w: 900 });
      K.tag('左边 = I → 右边 = A⁻¹', DX, DY + 170, { px: 38, a: ba * gin(T.done), align: 'center', color: C.peri, font: F.serif, w: 900 });
    }
  }
  function drawEx5() {
    const a = win(t, T.e5, T.sg, 0.4, 0.4); if (a <= 0) return;
    K.tag('教材 · 例 5', DX, DY - 280, { px: 30, a, align: 'center', color: C.inkMid });
    texAt('ex5', DX, DY - 40, 46, { alpha: a, reveal: prog(t, T.e5, T.e5r + 1.0) });
  }
  function drawSing() {
    const a = win(t, T.sg, T.end0, 0.4, 0.5); if (a <= 0) return;
    const sa = a * (1 - gin(T.tj, 0.4));
    if (sa > 0) {
      const S0s = SG.A.map(r => r.map(num)), STs = SG.steps.map(s => s.map(r => r.map(num)));
      const B = augBoard(S0s, SG.ops, [T.sgop], { x: DX - 60, y: DY - 80, px: 52, a: sa, nL: 2, steps: STs });
      const z = gin(T.sgz, 0.4); if (z > 0) { ctx.save(); ctx.globalAlpha = sa * z; ctx.strokeStyle = C.free; ctx.lineWidth = 5; ctx.strokeRect(B.x0 - 16, B.ry(1) - B.rh * 0.48, 2 * 52 * 2.0 + 20, B.rh * 0.96); ctx.restore(); K.tag('左边整行是 0', DX - 120, DY + 60, { px: 34, a: sa * z, align: 'center', color: C.free, w: 900 }); }
      K.tag('不可能化成 I → 奇异，没有逆', DX, DY + 160, { px: 38, a: sa * gin(T.sgn), align: 'center', color: C.free, font: F.serif, w: 900 });
    }
    const tj = a * gin(T.tj, 0.4);
    if (tj > 0) { K.tag('同济第三章 · 对照', DX, DY - 200, { px: 34, a: tj, align: 'center', color: C.gpt, w: 900 }); texAt('tj', DX, DY - 60, 60, { alpha: tj, reveal: prog(t, T.tj, T.tj + 1.0) }); K.tag('求逆时全程只用行变换', DX, DY + 80, { px: 34, a: tj * gin(T.tjc), align: 'center', color: C.peri, w: 900 }); }
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('行变换 = 左乘 E', DX, DY - 280, { px: 46, a: a * gin(T.z1), align: 'center', color: C.peri, font: F.serif, w: 900 });
    ['翻折', '拉伸', '剪切'].forEach((s, i) => K.tag(s, DX + (i - 1) * 220, DY - 180, { px: 38, a: a * gin(T.z2 + i * 0.25), align: 'center', color: [C.i, C.j, C.k][i], w: 900 }));
    texAt('alg', DX, DY - 40, 54, { alpha: a * gin(T.z3) });
    K.tag('消出零行 → 没有逆', DX, DY + 90, { px: 38, a: a * gin(T.z4), align: 'center', color: C.free, w: 900 });
    K.tag('下一节：LU 分解', DX, DY + 220, { px: 34, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.def, T.nz);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('初等矩阵', T.def);
      K.bullet('I 做一次行变换', 290, gin(T.once));
      K.bullet('I：交换 → 翻折', 350, gin(T.t1 + 0.3), { mark: C.i }); K.bullet('II：倍乘 → 拉伸', 410, gin(T.t2 + 0.3), { mark: C.j }); K.bullet('III：倍加 → 剪切', 470, gin(T.t3 + 0.3), { mark: C.k });
      K.bullet('EA = 对 A 做同样的行变换', 540, gin(T.e1a), { px: 30, color: C.peri }); ctx.restore(); }
    a = sec(T.nz + 0.2, T.tw);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('每一步都能撤销', T.nz + 0.3);
      K.bullet('倍乘必须非零', 290, gin(T.zero), { color: C.free, mark: C.free }); K.bullet('E 都可逆', 350, gin(T.th1)); K.bullet('E⁻¹ 还是同类', 410, gin(T.th1b), { color: C.peri }); ctx.restore(); }
    a = sec(T.tw + 0.2, T.th2);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('消元 = 把网格拧正', T.tw + 0.3);
      K.bullet('E₁：R₂ − 2R₁', 290, gin(T.s1), { mark: C.i }); K.bullet('E₂：R₁ − 2R₂', 350, gin(T.s2), { mark: C.j }); K.bullet('E₂E₁A = I', 410, gin(T.eq)); K.bullet('E₂E₁ = A⁻¹', 470, gin(T.inv), { color: C.peri }); ctx.restore(); }
    a = sec(T.th2 + 0.2, T.alg);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('可逆的三种说法', T.th2 + 0.3);
      K.bullet('A 可逆', 290, gin(T.ca)); K.bullet('Ax = 0 只有零解', 350, gin(T.cb)); K.bullet('A 能化成 I', 410, gin(T.cc));
      K.note('GPT · 名词', ['行等价：能用行变换互相得到'], 450, gin(T.rq, 0.5)); ctx.restore(); }
    a = sec(T.alg + 0.2, T.e5);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('求逆：[A | I]', T.alg + 0.3);
      K.bullet('I 放在 A 旁边', 290, gin(T.side)); K.bullet('一起做行变换', 350, gin(T.same)); K.bullet('先往下消，再往上消', 410, gin(T.o3)); K.bullet('左边 I → 右边 A⁻¹', 470, gin(T.done), { color: C.peri }); ctx.restore(); }
    a = sec(T.e5 + 0.2, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('用逆解方程', T.e5 + 0.3);
      K.bullet('x = A⁻¹b', 290, gin(T.e5r)); K.bullet('消出零行 → 奇异', 350, gin(T.sgz), { color: C.free, mark: C.free });
      K.note('同济第六版 · 对照', ['(A, E) → (E, A⁻¹)', '求逆只能用行变换'], 400, gin(T.tj, 0.5)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('行变换 = 左乘 E', 290, gin(T.z1)); K.bullet('[A | I] → [I | A⁻¹]', 350, gin(T.z3), { color: C.peri }); K.bullet('零行 → 不可逆', 410, gin(T.z4), { color: C.free, mark: C.free }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.5', prog(t, 0.2, 1.3));
    drawTitle(); drawDef(); drawPlane(D); drawEx123(); drawTh1(); drawTh2(); drawAlg(); drawEx5(); drawSing(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
