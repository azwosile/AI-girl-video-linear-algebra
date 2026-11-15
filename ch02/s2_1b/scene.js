// 第 2 章 §2.1（中）三阶与余子式展开（Leon 9th §2.1 Case 3、minor / cofactor、例 1、n 阶定义、Thm 2.1.1、例 2、4×4；
// 同济第六版 第一章 §1 对角线法则、§3 逆序数定义、§5 按行（列）展开）。
// 3B1B 视角（EoLA 第 6 集后半）：三阶行列式 = 体积放大倍数；0 = 压进平面。
// 分镜：
//   D01–C05   单位立方体 → 拉伸 (2,1,2) 体积 4 → 斜推仍 4 → k̂ 进平面 → 0
//   D02–D03   六项式：三正三负，每行每列各取一个
//   C08–C14   按第一行分组 → 划掉行列 = 余子式 → 代数余子式 + 棋盘符号 → 按第一行展开
//   C15–C18   例 1：(2,5,4;3,1,2;5,4,6) = −4 − 40 + 28 = −16
//   C19–D05   n 阶递归定义；定理 2.1.1；例 2 按第二列 = −16
//   C22–C25   4×4 挑零：−2 · 3 · (−2) = 12
//   G01–C26   同济：对角线法则（只限 ≤ 3 阶）、逆序数定义
//   D06–C27   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { det3, DetGrid } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_ask', 'ds_think', 'ds_shock', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_cross'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));
const SYM = [['a₁₁', 'a₁₂', 'a₁₃'], ['a₂₁', 'a₂₂', 'a₂₃'], ['a₃₁', 'a₃₂', 'a₃₃']];

// three.js 只在浏览器里有；无浏览器干跑时换成桩
async function load3D() {
  try { return (await import('../../engine/la3d/space3d.js')).Space3D; }
  catch (e) { return class { constructor(s) { this.size = s; } render() { return null; } }; }
}

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const A = MJ.A, A4 = MJ.A4, V = MJ.vol;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.4, C03: 0.5, C04: 0.5, C05: 0.4, C06: 0.5, C08: 0.5, C09: 0.4, C10: 0.4, C11: 0.5, C12: 0.4, C13: 0.4, C14: 0.3, C15: 0.7, C16: 0.4, C17: 0.4, C18: 0.4, C19: 0.7, C20: 0.4, C21: 0.6, C22: 0.6, C23: 0.4, C24: 0.5, C25: 0.4, G01: 0.6, G02: 0.4, C26: 0.5, D06: 0.7 },
    post: { C02: 0.6, C03: 0.6, C04: 0.6, C07: 0.6, C09: 0.5, C10: 0.5, C13: 0.6, C16: 0.4, C17: 0.4, C18: 0.9, C21: 0.9, C24: 0.5, C25: 0.8, G01: 0.6 }, tail: 0.6,
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
  const Space3D = await load3D();
  const S3 = new Space3D(1040, { R: 4 });
  const GS = new DetGrid(SYM), GA = new DetGrid(A), G4 = new DetGrid(A4);
  const SAR = new DetGrid(SYM.map(r => [...r, r[0], r[1]]));

  const T = {
    q: L('D01').s, cube: cue('C01', '单位立方体'), v1: cue('C01', '体积是一'),
    st: cue('C02', '做一个变换'), v4: cue('C02', '体积变成四'),
    sh: cue('C03', '斜着推'), v4b: cue('C03', '体积还是四'),
    zk: cue('C04', '推进了'), paper: cue('C04', '压成一张纸'), v0: cue('C04', '体积是零'),
    sum3: L('C05').s, sing: cue('C05', '矩阵奇异'),
    how: L('D02').s, six: L('C06').s + 1.0, plus: cue('C07', '三项带加号'), minus: cue('C07', '三项带减号'), pick: cue('C07', '各取一个数'),
    scare: L('D03').s, grp: cue('C08', '分成三组'), wow: cue('C08', '奇迹出现了'),
    k1: cue('C09', '划掉第一行'), k1b: cue('C09', '二阶行列式'), k2: cue('C10', 'a一二后面'), k3: cue('C10', 'a一三后面'),
    nm: cue('C11', '起个名字'), Mij: cue('C11', '剩下的矩阵叫'), mnr: cue('C11', '的余子式'),
    cof: cue('C12', '代数余子式'), chess: cue('C13', '国际象棋'), alt: cue('C13', '正负交替'),
    exp: L('D04').s, row1: cue('C14', '按第一行展开'), two: cue('C14', '二阶也一样'),
    e1: L('C15').s - 0.4, ea: cue('C16', '第一项'), eaR: cue('C16', '得负四'), eb: cue('C17', '第二项'), ebR: cue('C17', '负四十'), ec: cue('C18', '第三项'), es: cue('C18', '加起来'),
    def: L('C19').s - 0.4, defn: cue('C19', '变成n个'), thm: cue('C20', '任何一行'),
    e2: cue('C21', '按第二列展开'), e2s: cue('C21', '还是负十六'), same: L('D05').s,
    f: L('C22').s - 0.3, f0: cue('C22', '第一列有三个零'), f1: cue('C23', '前三项'), fsg: cue('C23', '负号'),
    f2: cue('C24', '剩下的三阶'), f2c: cue('C24', '沿第三列展开'), f3: cue('C25', '最后'), f3b: cue('C25', '只算了一个二阶'),
    sar: L('G01').s - 0.3, sarM: cue('G01', '相减'), only: cue('G02', '只适用于'), n24: cue('G02', '二十四项'), bad: cue('G02', '必错'),
    tj: cue('C26', '逆序数'), leon: cue('C26', '我们按Leon走'),
    end0: L('D06').s - 0.6, z2: cue('D06', '配上棋盘符号'), z3: L('D07').s, next: cue('C27', '下一节'),
  };

  // ── 立方体关键帧 ──
  const KF = [[T.st - 0.1, T.st + 1.6, V.S], [T.sh - 0.1, T.sh + 1.6, V.H], [T.zk - 0.1, T.zk + 2.0, V.Z]];
  const Mat = tt => { let M = I3, prev = I3; for (const [a, b, Tg] of KF) { if (tt < a) break; M = lerpM(prev, Tg, smoother(prog(tt, a, b))); prev = Tg; } return M; };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('swell', T.cube, 0.3); TL.sfx('pop', T.v1, 0.3); TL.sfx('warp', T.st, 0.4); TL.sfx('ding', T.v4, 0.3);
  TL.sfx('warp', T.sh, 0.4); TL.sfx('check', T.v4b, 0.3); TL.sfx('warp', T.zk, 0.4); TL.sfx('thud', T.paper + 0.3, 0.35); TL.sfx('stamp', T.sing, 0.35);
  TL.sfx('whoosh', T.how, 0.3); TL.sfx('swell', T.six, 0.3); TL.sfx('marimba', T.plus, 0.3); TL.sfx('marimba_hi', T.minus, 0.3); TL.sfx('sting', T.scare + 0.1, 0.3);
  TL.sfx('sparkle', T.wow, 0.3); [T.k1, T.k2, T.k3].forEach(t => TL.sfx('pluck', t, 0.3)); TL.sfx('stamp', T.mnr, 0.3); TL.sfx('stamp', T.cof, 0.3); TL.sfx('click', T.alt, 0.3); TL.sfx('ding', T.row1, 0.3);
  TL.sfx('whoosh', T.e1, 0.3); [T.ea, T.eb, T.ec].forEach(t => TL.sfx('marimba', t, 0.28)); TL.sfx('ding', T.es + 0.8, 0.35);
  TL.sfx('whoosh', T.def, 0.3); TL.sfx('stamp', T.thm, 0.35); TL.sfx('pluck', T.e2, 0.3); TL.sfx('check', T.e2s, 0.35); TL.sfx('sparkle', T.same, 0.25);
  TL.sfx('whoosh', T.f, 0.3); TL.sfx('pop', T.f0, 0.3); TL.sfx('crack', T.f1, 0.25); TL.sfx('pluck', T.f2c, 0.3); TL.sfx('ding', T.f3, 0.35);
  TL.sfx('bell_soft', T.sar + 0.2, 0.3); TL.sfx('glitch', T.bad, 0.3); TL.sfx('click', T.tj, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.z2, T.z3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C27').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);
  const reveal = (t0, d = 1.0) => prog(t, t0, t0 + d);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('D01').e - 0.2, L('D01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第二章 · 行列式', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'2.1 三阶与展开'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'COFACTOR EXPANSION', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    K.tag('三阶 = 体积？', DX, DY, { px: 64, a: a * gin(T.q + 0.6, 0.5), align: 'center', color: C.peri, font: F.serif, w: 900 });
  }

  // ── 3D 立方体 ──
  function drawCube(D) {
    const a = win(t, T.cube - 0.3, T.how + 0.3, 0.6, 0.6); if (a <= 0.003) return;
    const M = Mat(t), v = det3(M), cm = smooth(prog(t, T.cube - 0.3, T.cube + 1.2));
    const cv = S3.render({ M, el: 24, az: lerp(-70, -48, prog(t, T.cube, T.how)), dist: 13, target: [0.9, 0.6, 0.6], cubeA: cm, gridA: 1, arrowGrow: cm });
    ctx.save(); K.clip(D); ctx.globalAlpha = a; if (cv && cv.width) ctx.drawImage(cv, D.x - 520, D.y - 520, 1040, 1040); ctx.restore();
    // 体积读数
    const vA = a * gin(T.v1, 0.4);
    K.tag('体积', DX + 300, DY - 330, { px: 32, a: vA, align: 'center', color: C.inkMid, w: 700 });
    K.tag((Math.abs(v) < 0.05 ? 0 : v).toFixed(t > T.v4 - 0.2 && t < T.st + 1.6 ? 1 : 0), DX + 300, DY - 260, { px: 66, a: vA, align: 'center', color: Math.abs(v) < 0.05 ? C.free : C.peri, w: 900, font: F.serif });
    const card = (key, t0, t1) => { const g = win(t, t0, t1, 0.3, 0.3); if (g > 0) texAt(key, DX - 300, DY - 290, 40, { alpha: a * g, halo: C.disc }); };
    card('MS', T.st - 0.3, T.sh - 0.2); card('MH', T.sh - 0.2, T.zk - 0.2); card('MZ', T.zk - 0.2, T.how + 0.3);
    K.tag('底面没变，高没变', DX, DY + 330, { px: 36, a: a * win(t, T.v4b - 0.6, T.zk - 0.2, 0.3, 0.3), align: 'center', color: C.j, w: 900 });
    K.tag('压成一张纸', DX, DY + 330, { px: 44, a: a * win(t, T.paper, T.sum3, 0.3, 0.3), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('det = 0 ⇔ 奇异', DX, DY + 330, { px: 46, a: a * win(t, T.sing - 0.2, T.how + 0.3, 0.3, 0.3) * outBack(prog(t, T.sing - 0.2, T.sing + 0.3)), align: 'center', color: C.free, w: 900, font: F.serif });
  }

  // ── 六项式 → 分组 → 余子式 → 代数余子式 ──
  function drawCof() {
    const a = win(t, T.how + 0.2, T.e1, 0.5, 0.4); if (a <= 0) return;
    // 六项式
    const sA = a * (1 - gin(T.grp, 0.5));
    if (sA > 0) {
      K.tag('三阶：Leon 消元的结论', DX, DY - 230, { px: 34, a: sA * gin(T.six - 0.6), align: 'center', color: C.inkMid, w: 700 });
      const pl = tex.place('six', DX, DY - 90, 44, 'c');
      tex.draw(ctx, pl, { alpha: sA * gin(T.six - 0.4), reveal: reveal(T.six - 0.4, 1.4) });
      tex.draw(ctx, pl, { alpha: sA * gin(T.plus, 0.4), only: ['p'], force: C.j });
      tex.draw(ctx, pl, { alpha: sA * gin(T.minus, 0.4), only: ['q'], force: C.free });
      // 每行每列各取一个：在符号矩阵上逐个点亮第一项
      const g = gin(T.pick, 0.4);
      if (g > 0) {
        const cyc = Math.floor(clamp((t - T.pick) / 1.2, 0, 5.99)), perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], p = perms[cyc];
        const hi = {}; p.forEach((c, r) => { hi[r + ',' + c] = [1, [0, 3, 4].includes(cyc) ? C.j : C.free]; });
        GS.draw(ctx, { x: DX, y: DY + 170, px: 40, a: sA * g, bars: 0, hi });
        K.tag('每行、每列各取一个', DX, DY + 320, { px: 32, a: sA * g, align: 'center', color: C.inkMid, w: 700 });
      }
    }
    // 分组 + 划行列
    const gA = a * gin(T.grp, 0.5) * (1 - gin(T.nm, 0.5));
    if (gA > 0) {
      const pl = tex.place('grp', DX, DY - 200, 42, 'c');
      tex.draw(ctx, pl, { alpha: gA, reveal: reveal(T.grp, 1.2) });
      tex.draw(ctx, pl, { alpha: gA * gin(T.k1, 0.3), only: ['a'], force: C.i });
      tex.draw(ctx, pl, { alpha: gA * gin(T.k1b, 0.4), only: ['x'], force: C.peri });
      tex.draw(ctx, pl, { alpha: gA * gin(T.k2, 0.3), only: ['b', 'y'], force: C.j });
      tex.draw(ctx, pl, { alpha: gA * gin(T.k3, 0.3), only: ['c', 'z'], force: C.k });
      const c = t < T.k2 ? 0 : t < T.k3 ? 1 : 2, t0 = [T.k1, T.k2, T.k3][c];
      GS.draw(ctx, { x: DX, y: DY + 150, px: 46, a: gA * gin(T.k1 - 0.3), bars: 1, strike: { r: 0, c, s: prog(t, t0, t0 + 0.7), color: [C.peri, C.j, C.k][c] } });
    }
    // 命名：M_ij、余子式、代数余子式、棋盘
    const nA = a * gin(T.nm, 0.5);
    if (nA > 0) {
      K.tag('Mᵢⱼ：划掉第 i 行、第 j 列', DX, DY - 330, { px: 36, a: nA * gin(T.Mij), align: 'center', color: C.ink, w: 900 });
      K.tag('余子式 = det(Mᵢⱼ)', DX, DY - 262, { px: 36, a: nA * gin(T.mnr), align: 'center', color: C.ink, w: 900 });
      texAt('cof', DX, DY - 170, 50, { alpha: nA * gin(T.cof), reveal: reveal(T.cof, 0.9), color: C.peri });
      const sw = Math.floor((t - T.nm) / 1.4) % 9, sr = Math.floor(sw / 3), sc = sw % 3, stS = (t < T.cof ? 1 : 1 - gin(T.cof, 0.4)) * prog(((t - T.nm) % 1.4), 0, 0.6);
      GS.draw(ctx, { x: DX, y: DY + 50, px: 46, a: nA, bars: 1, strike: { r: sr, c: sc, s: stS }, signs: prog(t, T.chess, T.alt + 0.8) });
      const pl = tex.place('exp1', DX, DY + 240, 46, 'c'); tex.draw(ctx, pl, { alpha: nA * gin(T.exp), reveal: reveal(T.exp, 1.2) });
      texAt('exp2', DX, DY + 330, 42, { alpha: nA * gin(T.two), reveal: reveal(T.two, 0.9), color: C.inkMid });
      K.tag('按第一行展开', DX + 300, DY + 170, { px: 30, a: nA * gin(T.row1), align: 'center', color: C.peri, w: 900 });
    }
  }

  // ── 例 1 ──
  function drawEx1() {
    const a = win(t, T.e1, T.def, 0.5, 0.4); if (a <= 0) return;
    K.tag('例 1', DX - 330, DY - 300, { px: 36, a, align: 'center', color: C.peri, w: 900, font: F.serif });
    const c = t < T.eb ? 0 : t < T.ec ? 1 : 2, t0 = [T.ea, T.eb, T.ec][c], on = t > T.ea - 0.2 && t < T.es;
    GA.draw(ctx, { x: DX, y: DY - 250, px: 48, a, bars: 1, strike: on ? { r: 0, c, s: prog(t, t0, t0 + 0.6), color: [C.i, C.j, C.k][c] } : null, signs: t > T.ea - 0.2 ? 0 : 0 });
    texAt('e1a', DX, DY - 60, 42, { alpha: a * gin(T.ea), reveal: reveal(T.ea, 1.0), color: t > T.eaR ? C.ink : C.inkMid });
    texAt('e1b', DX, DY + 60, 42, { alpha: a * gin(T.eb), reveal: reveal(T.eb, 1.0) });
    texAt('e1c', DX, DY + 180, 42, { alpha: a * gin(T.ec), reveal: reveal(T.ec, 1.0) });
    texAt('e1s', DX, DY + 300, 48, { alpha: a * gin(T.es), reveal: reveal(T.es, 1.2), color: C.peri });
  }

  // ── n 阶定义、定理 2.1.1、例 2 ──
  function drawDef() {
    const a = win(t, T.def, T.f, 0.5, 0.4); if (a <= 0) return;
    const dA = a * (1 - gin(T.e2 - 0.3, 0.5));
    if (dA > 0) {
      K.tag('n 阶：递归定义', DX, DY - 330, { px: 36, a: dA, align: 'center', color: C.peri, w: 900, font: F.serif });
      texAt('def', DX, DY - 220, 36, { alpha: dA, reveal: reveal(T.def + 0.3, 1.4) });
      K.tag('n 阶 → n 个 (n − 1) 阶', DX, DY - 110, { px: 32, a: dA * gin(T.defn), align: 'center', color: C.inkMid, w: 700 });
      K.tag('定理 2.1.1', DX, DY + 10, { px: 34, a: dA * gin(T.thm), align: 'center', color: C.j, w: 900 });
      texAt('thm', DX, DY + 120, 42, { alpha: dA * gin(T.thm), reveal: reveal(T.thm, 1.3) });
      K.tag('任何一行 · 任何一列', DX, DY + 260, { px: 38, a: dA * gin(T.thm + 1.0), align: 'center', color: C.j, w: 900, font: F.serif });
    }
    const eA = a * gin(T.e2 - 0.3, 0.5);
    if (eA > 0) {
      K.tag('例 2：按第二列', DX - 300, DY - 300, { px: 32, a: eA, align: 'center', color: C.peri, w: 900, font: F.serif });
      const hi = {}; [0, 1, 2].forEach(r => { hi[r + ',1'] = [1, C.j]; });
      GA.draw(ctx, { x: DX, y: DY - 220, px: 46, a: eA, bars: 1, hi, signs: prog(t, T.e2 + 0.3, T.e2 + 1.3) * 1 });
      texAt('e2', DX, DY + 30, 40, { alpha: eA * gin(T.e2 + 0.6), reveal: reveal(T.e2 + 0.6, 1.6) });
      texAt('e2s', DX, DY + 160, 48, { alpha: eA * gin(T.e2s - 1.2), reveal: reveal(T.e2s - 1.2, 1.0) });
      K.tag('结果一样！', DX, DY + 280, { px: 44, a: eA * gin(T.e2s) * outBack(prog(t, T.e2s, T.e2s + 0.4)), align: 'center', color: C.j, w: 900, font: F.serif });
    }
  }

  // ── 4×4 挑零 ──
  function drawF() {
    const a = win(t, T.f, T.sar, 0.5, 0.4); if (a <= 0) return;
    const hi = {}; const h0 = gin(T.f0, 0.4) * (1 - gin(T.f1 + 1.2, 0.4)); [0, 1, 2].forEach(r => { hi[r + ',0'] = [h0, C.j]; }); hi['3,0'] = [gin(T.f1 + 0.6), C.i];
    G4.draw(ctx, { x: DX, y: DY - 200, px: 44, a, bars: 1, hi, strike: { r: 3, c: 0, s: prog(t, T.f1 + 0.8, T.f1 + 1.5) } });
    K.tag('(−1)⁴⁺¹ = −', DX + 270, DY - 60, { px: 32, a: a * gin(T.fsg), align: 'center', color: C.free, w: 900 });
    K.tag('三个 0', DX - 300, DY - 260, { px: 32, a: a * h0, align: 'center', color: C.j, w: 900 });
    const pl = tex.place('f1', DX, DY + 70, 38, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.f2 - 0.6), reveal: reveal(T.f2 - 0.6, 1.0) });
    K.tag('第三列：两个 0', DX + 280, DY + 70, { px: 28, a: a * gin(T.f2c - 0.4), align: 'center', color: C.j, w: 900 });
    texAt('f2', DX, DY + 240, 40, { alpha: a * gin(T.f2c), reveal: reveal(T.f2c, 1.6) });
    K.tag('4 阶 → 只算一个 2 阶', DX, DY + 340, { px: 36, a: a * gin(T.f3b), align: 'center', color: C.peri, w: 900, font: F.serif });
  }

  // ── 同济：对角线法则、逆序数 ──
  function drawSar() {
    const a = win(t, T.sar, T.end0, 0.5, 0.5); if (a <= 0) return;
    const sA = a * (1 - gin(T.tj - 0.2, 0.5));
    if (sA > 0) {
      K.tag('同济 · 对角线法则（三阶）', DX, DY - 320, { px: 36, a: sA, align: 'center', color: C.gpt, w: 900 });
      const o = { x: DX, y: DY - 110, px: 42 }, Lg = SAR.layout(o), dim = {};
      [0, 1, 2].forEach(r => { dim[r + ',3'] = 0.45; dim[r + ',4'] = 0.45; });
      SAR.draw(ctx, { ...o, a: sA, bars: 1, dim });
      const line = (c0, dirn, col, g) => { if (g <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.globalAlpha = sA * 0.85; ctx.lineCap = 'round';
        const x0 = Lg.cx(c0), y0 = Lg.ry(0) - 20, x1 = Lg.cx(c0 + 2 * dirn), y1 = Lg.ry(2) + 20;
        ctx.beginPath(); ctx.moveTo(x0 - dirn * 18, y0); ctx.lineTo(lerp(x0 - dirn * 18, x1 + dirn * 18, g), lerp(y0, y1, g)); ctx.stroke(); ctx.restore(); };
      [0, 1, 2].forEach((c, k) => line(c, 1, C.j, prog(t, T.sar + 0.6 + k * 0.4, T.sar + 1.2 + k * 0.4)));
      [2, 3, 4].forEach((c, k) => line(c, -1, C.free, prog(t, T.sarM + k * 0.4, T.sarM + 0.6 + k * 0.4)));
      K.tag('+', DX - 380, DY - 110, { px: 60, a: sA * gin(T.sar + 0.6), align: 'center', color: C.j, w: 900 });
      K.tag('−', DX + 380, DY - 110, { px: 60, a: sA * gin(T.sarM), align: 'center', color: C.free, w: 900 });
      K.tag('4 阶：24 项 ≠ 8 条对角线', DX, DY + 120, { px: 40, a: sA * gin(T.n24), align: 'center', color: C.ink, w: 900, font: F.serif });
      K.tag('只限 2、3 阶！', DX, DY + 240, { px: 48, a: sA * gin(T.only), align: 'center', color: C.free, w: 900, font: F.serif });
      const x = sA * gin(T.bad, 0.3) * outBack(prog(t, T.bad, T.bad + 0.4));
      if (x > 0) { ctx.save(); ctx.globalAlpha = x; ctx.strokeStyle = C.free; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(DX + 280, DY + 70); ctx.lineTo(DX + 360, DY + 170); ctx.moveTo(DX + 360, DY + 70); ctx.lineTo(DX + 280, DY + 170); ctx.stroke(); ctx.restore(); }
    }
    const tA = a * gin(T.tj - 0.2, 0.5);
    if (tA > 0) {
      K.tag('同济第一章 §3 · 逆序数定义', DX, DY - 250, { px: 36, a: tA, align: 'center', color: C.gpt, w: 900 });
      texAt('tj', DX, DY - 110, 54, { alpha: tA, reveal: reveal(T.tj, 1.2) });
      K.tag('t：排列 p₁p₂…pₙ 的逆序数', DX, DY + 10, { px: 30, a: tA * gin(T.tj + 0.8), align: 'center', color: C.inkMid, w: 700 });
      K.tag('⇔', DX, DY + 120, { px: 60, a: tA * gin(T.leon - 1.0), align: 'center', color: C.ink, w: 900 });
      K.tag('Leon：按行展开的递归定义', DX, DY + 230, { px: 36, a: tA * gin(T.leon - 0.8), align: 'center', color: C.peri, w: 900, font: F.serif });
    }
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('三阶行列式 = 体积放大倍数', DX, DY - 300, { px: 46, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    texAt('cof', DX, DY - 180, 50, { alpha: a * gin(T.z2 - 0.4), color: C.ink });
    GS.draw(ctx, { x: DX, y: DY + 10, px: 40, a: a * gin(T.z2), bars: 1, signs: prog(t, T.z2, T.z2 + 1.0) });
    K.tag('哪一行、哪一列都行 → 挑零最多的', DX, DY + 180, { px: 36, a: a * gin(T.z3), align: 'center', color: C.j, w: 900 });
    K.tag('下一节：转置 · 三角 · 零行', DX, DY + 280, { px: 32, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.cube - 0.3, T.how);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('三阶 = 体积倍数', T.cube - 0.3);
      K.bullet('单位立方体：体积 1', 290, gin(T.v1)); K.bullet('拉伸 2、1、2 → 体积 4', 350, gin(T.v4)); K.bullet('斜推：体积不变', 410, gin(T.v4b), { color: C.j, mark: C.j });
      K.bullet('压进平面 → 0 → 奇异', 470, gin(T.v0), { color: C.free, mark: C.free }); ctx.restore(); }
    a = sec(T.how + 0.2, T.grp);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('六项式', T.how + 0.3);
      K.bullet('三项正、三项负', 290, gin(T.minus)); K.bullet('每行每列各取一个', 350, gin(T.pick), { color: C.peri }); ctx.restore(); }
    a = sec(T.grp, T.e1);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('余子式与代数余子式', T.grp);
      K.bullet('按第一行分三组', 290, gin(T.grp)); K.bullet('划掉 i 行 j 列 → Mᵢⱼ', 350, gin(T.Mij)); K.bullet('余子式 = det(Mᵢⱼ)', 410, gin(T.mnr));
      K.bullet('Aᵢⱼ = (−1)ⁱ⁺ʲ det(Mᵢⱼ)', 470, gin(T.cof), { color: C.peri }); K.bullet('符号：棋盘，左上为正', 530, gin(T.chess), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.e1, T.def);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('例 1', T.e1);
      K.bullet('按第一行展开', 290, gin(T.ea)); K.bullet('2 · (−2) = −4', 350, gin(T.eaR)); K.bullet('−5 · 8 = −40', 410, gin(T.ebR)); K.bullet('4 · 7 = 28', 470, gin(T.ec + 1.0)); K.bullet('det = −16', 530, gin(T.es), { color: C.peri }); ctx.restore(); }
    a = sec(T.def, T.f);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('任意行列展开', T.def);
      K.bullet('1 阶：它自己', 290, gin(T.def + 0.4)); K.bullet('n 阶：按第一行递归', 350, gin(T.defn)); K.bullet('定理 2.1.1：任何行列', 410, gin(T.thm), { color: C.j, mark: C.j }); K.bullet('例 2：第二列 → −16', 470, gin(T.e2s), { color: C.peri }); ctx.restore(); }
    a = sec(T.f, T.sar);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('挑零最多的', T.f);
      K.bullet('第一列三个 0', 290, gin(T.f0)); K.bullet('只剩 a₄₁ = 2，符号 −', 350, gin(T.fsg)); K.bullet('3 阶：第三列两个 0', 410, gin(T.f2c)); K.bullet('−2 · 3 · (−2) = 12', 470, gin(T.f3), { color: C.peri }); ctx.restore(); }
    a = sec(T.sar, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('同济对照', T.sar, C.gpt);
      K.bullet('对角线法则：只限 ≤ 3 阶', 290, gin(T.only), { color: C.free, mark: C.free }); K.bullet('4 阶：24 项 ≠ 8 条', 350, gin(T.n24)); K.bullet('逆序数定义 ⇔ 展开定义', 410, gin(T.tj), { color: C.peri }); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('三阶 = 体积', 290, gin(T.end0 + 0.3)); K.bullet('划行列 → 余子式', 350, gin(T.z2 - 0.6)); K.bullet('配棋盘符号 → 代数余子式', 410, gin(T.z2), { color: C.peri }); K.bullet('挑零最多的展开', 470, gin(T.z3), { color: C.j, mark: C.j }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 2.1', prog(t, 0.2, 1.3));
    drawTitle(); drawCube(D); drawCof(); drawEx1(); drawDef(); drawF(); drawSar(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
