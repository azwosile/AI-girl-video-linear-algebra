// 第 2 章 §2.3（上）伴随矩阵与克拉默法则（Leon 9th §2.3 adj A、例 1–3、Thm 2.3.1；同济 第二章 §3 A*、克拉默法则推论）。
// 3B1B 视角（EoLA 第 12 集）：y = (î, x) 围成的有向面积；变换后 = (a₁, b) 的面积 = y · det A。
// 分镜：
//   D01–C01   钩子：[A | I] 消元 → 有没有公式？
//   C02–C03   adj A：元素 → 代数余子式 → 转置（格子飞过对角线）
//   D02–C07   A · adj A：i = j 展开 = det；i ≠ j 引理 = 0 → det(A) I → A⁻¹ 公式
//   C08–D03   2 阶口诀：主对调、副变号；(3,1;1,2)⁻¹
//   C10–G01   例 2：代数余子式矩阵 → 按行竖放（转置）→ A⁻¹ = adj/5；代价提醒
//   C14–C18   Cramer：xᵢ = det(Aᵢ)/det(A)；证明；例 3 → (1,1,2)
//   D04–C22   几何：(î, x) 面积 = y → 变换 → (a₁, b) 面积 = y·det A → y = 4/2
//   G02–C23   同济 A*、齐次推论；只适合小矩阵
//   D05–C24   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { det2, paraFill, areaLabel } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_think', 'ds_confused', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_cross', 'gpt_explain'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const I2 = [[1, 0], [0, 1]];
const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));
const SUB = ['₁', '₂', '₃'];

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const G = MJ.G, gx = MJ.gx;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.6, C03: 0.4, C04: 0.5, C05: 0.4, C06: 0.4, C07: 0.4, C08: 0.6, C09: 0.4, C10: 0.7, C11: 0.4, C12: 0.4, C13: 0.4, G01: 0.4, C14: 0.7, C15: 0.4, C16: 0.4, C17: 0.6, C18: 0.4, C19: 0.7, C20: 0.4, C21: 0.4, C22: 0.4, G02: 0.7, G03: 0.4, C23: 0.4, D05: 0.7 },
    post: { C02: 0.6, C03: 0.6, C05: 0.8, C06: 0.6, C07: 0.8, C09: 0.6, C11: 0.6, C12: 0.6, C13: 0.6, C16: 0.6, C18: 1.0, C19: 0.6, C20: 0.6, C21: 0.8, C22: 0.9, G03: 0.6 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 170, oy: DY + 170, u: 85, R: 10 });

  const T = {
    hook: L('D01').s, adjN: cue('C01', '伴随矩阵'), crN: cue('C01', '克拉默法则'),
    def: L('C02').s - 0.5, cof: cue('C02', '代数余子式'), tr: cue('C02', '第二步'), ij: L('C03').s, ji: cue('C03', '下标是反过来的'),
    why: L('D02').s, pr: L('C04').s - 0.3, prR: cue('C04', '点乘第j行'), eq: L('C05').s, ne: cue('C05', 'i不等于j'), lem: cue('C05', '引理'),
    AI: L('C06').s - 0.2, trw: cue('C06', '转置，就是为了'), inv: L('C07').s - 0.2,
    two: L('C08').s - 0.5, kou: cue('C08', '口诀'), m2: L('C09').s - 0.2, chk: L('D03').s,
    ex: L('C10').s - 0.5, nine: cue('C10', '九个代数余子式'), r1: L('C11').s - 0.2, col1: cue('C11', '竖着放进'), r2: L('C12').s - 0.2, r3: cue('C12', '第三行是'),
    div: L('C13').s - 0.2, forget: cue('C13', '忘了转置'), cost: L('G01').s - 0.2,
    cr: L('C14').s - 0.5, crT: cue('C14', '克拉默法则'), crF: L('C15').s - 0.3, Ai: cue('C15', '是把A的第i列'), cpf: L('C16').s - 0.3, cpf2: cue('C16', '这正好是'),
    e3: L('C17').s - 0.5, e3d: cue('C17', '行列式是负四'), e3c: L('C18').s - 0.2, e3x: cue('C18', '所以x等于'),
    geoQ: L('D04').s, geo: L('C19').s - 0.5, gx0: cue('C19', '未知向量x'), gpar: cue('C19', '平行四边形'), gh: cue('C19', '高就是y'),
    gT: L('C20').s - 0.2, gT2: cue('C20', '所有面积'), gN: cue('C20', '新面积'), ga1: L('C21').s, gb: cue('C21', 'x落到b'), gA2: cue('C21', '也就是'),
    gy: L('C22').s - 0.2, gy2: cue('C22', '四除以二'), gxx: cue('C22', 'x坐标同理'),
    tj: L('G02').s - 0.5, tjE: cue('G02', 'E就是'), hom: L('G03').s - 0.2, homN: cue('G03', '有非零解'), small: L('C23').s - 0.2,
    end0: L('D05').s - 0.6, z1: cue('D05', '伴随矩阵：'), z2: cue('D05', 'A逆等于'), z3: cue('D05', 'x i等于'), next: cue('C24', '下一节'),
  };

  // ── 平面关键帧（几何克拉默）──
  const Mat = tt => lerpM(I2, G, smoother(prog(tt, T.gT2 - 0.2, T.gT2 + 1.8)));

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.adjN, 0.3); TL.sfx('pop', T.crN, 0.3);
  TL.sfx('swell', T.def, 0.3); TL.sfx('sparkle', T.cof, 0.3); TL.sfx('swoosh_in', T.tr, 0.35); TL.sfx('click', T.ji, 0.3);
  TL.sfx('sting', T.why + 0.1, 0.25); TL.sfx('marimba', T.prR, 0.28); TL.sfx('check', T.eq + 0.8, 0.3); TL.sfx('stamp', T.lem, 0.35); TL.sfx('ding', T.AI + 0.5, 0.35); TL.sfx('stamp', T.inv + 0.5, 0.35);
  TL.sfx('whoosh', T.two, 0.3); TL.sfx('pluck', T.kou, 0.3); TL.sfx('pop', T.m2 + 0.5, 0.3); TL.sfx('check', T.chk + 0.8, 0.3);
  TL.sfx('whoosh', T.ex, 0.3); [T.r1, T.r2, T.r3].forEach(t => TL.sfx('marimba', t + 0.3, 0.28)); TL.sfx('swoosh_in', T.col1, 0.3); TL.sfx('ding', T.div + 0.4, 0.3); TL.sfx('sting', T.forget, 0.25); TL.sfx('ding_lo', T.cost + 0.3, 0.3);
  TL.sfx('stamp', T.crT, 0.35); TL.sfx('pluck', T.Ai, 0.3); TL.sfx('check', T.cpf2, 0.3); TL.sfx('swell', T.e3, 0.3); TL.sfx('pop', T.e3d, 0.3); [0, 1, 2].forEach(k => TL.sfx('marimba', T.e3c + 0.6 + k * 0.9, 0.28)); TL.sfx('ding', T.e3x, 0.35);
  TL.sfx('whoosh', T.geo, 0.3); TL.sfx('pluck', T.gx0, 0.3); TL.sfx('pop', T.gh, 0.3); TL.sfx('warp', T.gT2 - 0.2, 0.4); TL.sfx('pluck', T.gb, 0.3); TL.sfx('ding', T.gy2, 0.35);
  TL.sfx('bell_soft', T.tj + 0.2, 0.3); TL.sfx('stamp', T.homN, 0.3); TL.sfx('ding_lo', T.small + 0.3, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.z1, T.z2, T.z3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

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
    [...'2.3 伴随与克拉默'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'ADJOINT · CRAMER', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    K.tag('[ A | I ]  →  消元  →  [ I | A⁻¹ ]', DX, DY - 120, { px: 44, a: a * gin(T.hook + 0.8, 0.5), align: 'center', color: C.inkMid, w: 900, font: F.serif });
    K.tag('A⁻¹ = ？（直接写出）', DX, DY - 20, { px: 50, a: a * gin(T.hook + 2.2, 0.5), align: 'center', color: C.peri, w: 900, font: F.serif });
    K.tag('伴随矩阵', DX - 160, DY + 120, { px: 44, a: a * gin(T.adjN, 0.4), align: 'center', color: C.j, w: 900 });
    K.tag('克拉默法则', DX + 160, DY + 120, { px: 44, a: a * gin(T.crN, 0.4), align: 'center', color: C.i, w: 900 });
  }

  // ── adj 定义：格子变形 ──
  function drawDef() {
    const a = win(t, T.def, T.why + 0.2, 0.5, 0.4); if (a <= 0) return;
    const cs = smoother(prog(t, T.cof, T.cof + 0.8)), ts = smoother(prog(t, T.tr + 0.4, T.tr + 1.8));
    const x0 = DX - 190, y0 = DY - 190, cw = 190, rh = 110;
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const r = lerp(i, j, ts), c = lerp(j, i, ts), lift = i !== j ? Math.sin(Math.PI * ts) * 40 * (i < j ? -1 : 1) : 0;
      const X = x0 + c * cw + lift, Y = y0 + r * rh - lift;
      ctx.font = F.serif(54, 'italic');
      if (cs < 1) { ctx.globalAlpha = a * (1 - cs); ctx.fillStyle = C.ink; ctx.fillText('a' + SUB[i] + SUB[j], X, Y); }
      if (cs > 0) { ctx.globalAlpha = a * cs; ctx.fillStyle = i === j ? C.peri : (i < j ? C.i : C.j); ctx.fillText('A' + SUB[i] + SUB[j], X, Y); }
    }
    ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x0 - 80, y0 - 60); ctx.lineTo(x0 - 100, y0 - 60); ctx.lineTo(x0 - 100, y0 + 2 * rh + 60); ctx.lineTo(x0 - 80, y0 + 2 * rh + 60);
    ctx.moveTo(x0 + 2 * cw + 80, y0 - 60); ctx.lineTo(x0 + 2 * cw + 100, y0 - 60); ctx.lineTo(x0 + 2 * cw + 100, y0 + 2 * rh + 60); ctx.lineTo(x0 + 2 * cw + 80, y0 + 2 * rh + 60); ctx.stroke();
    ctx.restore();
    K.tag(ts > 0.5 ? 'adj A' : (cs > 0.5 ? '代数余子式' : 'A'), DX, DY - 330, { px: 40, a, align: 'center', color: ts > 0.5 ? C.peri : C.ink, w: 900, font: F.serif });
    K.tag('① 换成代数余子式', DX - 170, DY + 170, { px: 32, a: a * gin(T.cof), align: 'center', color: C.j, w: 900 });
    K.tag('② 转置', DX + 190, DY + 170, { px: 32, a: a * gin(T.tr), align: 'center', color: C.i, w: 900 });
    texAt('ij', DX, DY + 280, 48, { alpha: a * gin(T.ij), reveal: reveal(T.ij, 0.8), color: C.peri });
  }

  // ── A · adj A ──
  function drawProd() {
    const a = win(t, T.why + 0.2, T.two, 0.5, 0.4); if (a <= 0) return;
    K.tag('为什么转置？算 A · adj A', DX, DY - 330, { px: 36, a: a * gin(T.pr), align: 'center', color: C.ink, w: 900 });
    texAt('prod', DX, DY - 230, 40, { alpha: a * gin(T.pr), reveal: reveal(T.pr, 1.4) });
    texAt('cases', DX + 120, DY - 110, 44, { alpha: a * gin(T.eq), reveal: reveal(T.eq, 1.0) });
    K.tag('按第 i 行展开', DX - 250, DY - 140, { px: 30, a: a * gin(T.eq + 0.4), align: 'center', color: C.j, w: 900 });
    K.tag('引理 2.2.1', DX - 250, DY - 80, { px: 30, a: a * gin(T.lem), align: 'center', color: C.free, w: 900 });
    texAt('AadjI', DX, DY + 50, 54, { alpha: a * gin(T.AI), reveal: reveal(T.AI, 1.0), color: C.peri });
    K.tag('转置：让第 i 行配第 i 行的代数余子式', DX, DY + 140, { px: 30, a: a * gin(T.trw), align: 'center', color: C.inkMid, w: 700 });
    texAt('inv', DX, DY + 270, 56, { alpha: a * gin(T.inv), reveal: reveal(T.inv, 1.0), color: C.j });
  }

  // ── 2 阶 ──
  function draw2() {
    const a = win(t, T.two, T.ex, 0.5, 0.4); if (a <= 0) return;
    K.tag('2 阶', DX, DY - 330, { px: 36, a, align: 'center', color: C.peri, w: 900 });
    const pl = tex.place('adj2', DX, DY - 200, 54, 'c'); tex.draw(ctx, pl, { alpha: a, reveal: reveal(T.two + 0.4, 1.0) });
    tex.draw(ctx, pl, { alpha: a * gin(T.kou), only: ['m'], force: C.i }); tex.draw(ctx, pl, { alpha: a * gin(T.kou + 1.2), only: ['s'], force: C.free });
    K.tag('主对角线对调', DX - 170, DY - 70, { px: 34, a: a * gin(T.kou), align: 'center', color: C.i, w: 900 });
    K.tag('副对角线变号', DX + 170, DY - 70, { px: 34, a: a * gin(T.kou + 1.2), align: 'center', color: C.free, w: 900 });
    texAt('inv2', DX, DY + 100, 50, { alpha: a * gin(T.m2), reveal: reveal(T.m2, 1.2) });
    K.tag('A · A⁻¹ = I  ✓', DX, DY + 260, { px: 44, a: a * gin(T.chk + 0.6) * outBack(prog(t, T.chk + 0.6, T.chk + 1.0)), align: 'center', color: C.j, w: 900, font: F.serif });
  }

  // ── 例 2 ──
  function drawEx2() {
    const a = win(t, T.ex, T.cr, 0.5, 0.4); if (a <= 0) return;
    texAt('Aex', DX - 130, DY - 270, 38, { alpha: a, reveal: reveal(T.ex + 0.3, 0.8) });
    K.tag('det A = 5', DX + 200, DY - 270, { px: 42, a: a * gin(T.ex + 1.4), align: 'center', color: C.peri, w: 900, font: F.serif });
    const rA = [gin(T.r1), gin(T.r2), gin(T.r3)];
    const pc = tex.place('cofM', DX - 290, DY + 20, 44, 'c');
    tex.draw(ctx, pc, { alpha: a * rA[0], only: ['a'], force: C.i }); tex.draw(ctx, pc, { alpha: a * rA[1], only: ['b'], force: C.j }); tex.draw(ctx, pc, { alpha: a * rA[2], only: ['c'], force: C.k });
    tex.draw(ctx, pc, { alpha: a * gin(T.nine), skip: ['a', 'b', 'c'] });
    K.tag('代数余子式', DX - 290, DY - 120, { px: 28, a: a * gin(T.nine), align: 'center', color: C.inkMid, w: 700 });
    K.tag('转置', DX - 90, DY - 40, { px: 28, a: a * gin(T.col1), align: 'center', color: C.peri, w: 900 });
    K.tag('→', DX - 90, DY + 20, { px: 48, a: a * gin(T.col1), align: 'center', color: C.peri, w: 900, font: F.serif });
    const pa = tex.place('adjM', DX + 190, DY + 20, 44, 'c');
    tex.draw(ctx, pa, { alpha: a * gin(T.col1), only: ['a'], force: C.i }); tex.draw(ctx, pa, { alpha: a * gin(T.r2 + 0.8), only: ['b'], force: C.j }); tex.draw(ctx, pa, { alpha: a * gin(T.r3 + 0.6), only: ['c'], force: C.k });
    tex.draw(ctx, pa, { alpha: a * gin(T.col1), skip: ['a', 'b', 'c'] });
    texAt('invM', DX, DY + 250, 40, { alpha: a * gin(T.div), reveal: reveal(T.div, 1.0) });
    K.tag('别忘了转置！', DX + 200, DY - 130, { px: 36, a: a * win(t, T.forget, T.cost + 0.3, 0.3, 0.3), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('n 阶：n² 个 (n−1) 阶行列式 → 大矩阵别用', DX, DY + 370, { px: 28, a: a * gin(T.cost), align: 'center', color: C.free, w: 900 });
  }

  // ── Cramer + 例 3 ──
  function drawCr() {
    const a = win(t, T.cr, T.geoQ + 0.3, 0.5, 0.4); if (a <= 0) return;
    const fA = a * (1 - gin(T.e3, 0.5));
    if (fA > 0) {
      K.tag('定理 2.3.1 · 克拉默法则', DX, DY - 330, { px: 36, a: fA * gin(T.crT), align: 'center', color: C.i, w: 900 });
      texAt('cram', DX, DY - 200, 70, { alpha: fA * gin(T.crF), reveal: reveal(T.crF, 1.0), color: C.peri });
      const pl = tex.place('Ai', DX, DY - 60, 44, 'c'); tex.draw(ctx, pl, { alpha: fA * gin(T.Ai), reveal: reveal(T.Ai, 0.8) }); tex.draw(ctx, pl, { alpha: fA * gin(T.Ai + 0.6), only: ['b'], force: C.i });
      K.tag('第 i 列换成 b', DX, DY + 20, { px: 30, a: fA * gin(T.Ai + 0.6), align: 'center', color: C.i, w: 900 });
      texAt('cpf', DX, DY + 170, 38, { alpha: fA * gin(T.cpf), reveal: reveal(T.cpf, 1.6) });
      K.tag('= Aᵢ 沿第 i 列展开', DX, DY + 290, { px: 32, a: fA * gin(T.cpf2), align: 'center', color: C.j, w: 900 });
    }
    const eA = a * gin(T.e3, 0.5);
    if (eA > 0) {
      texAt('sys', DX - 180, DY - 280, 36, { alpha: eA, reveal: reveal(T.e3, 1.0) });
      texAt('cdA', DX + 220, DY - 280, 44, { alpha: eA * gin(T.e3d), color: C.peri });
      ['c1', 'c2', 'c3'].forEach((k, i) => { const t0 = T.e3c + 0.4 + i * 0.9; const pl = tex.place(k, DX, DY - 110 + i * 140, 34, 'c'); tex.draw(ctx, pl, { alpha: eA * gin(t0), reveal: reveal(t0, 0.8) }); tex.draw(ctx, pl, { alpha: eA * gin(t0 + 0.3), only: ['b'], force: C.i }); });
      texAt('cx', DX, DY + 320, 36, { alpha: eA * gin(T.e3x), reveal: reveal(T.e3x, 1.0), color: C.j });
    }
  }

  // ── 几何克拉默 ──
  function drawGeo(D) {
    const a = win(t, T.geo, T.tj, 0.5, 0.4); if (a <= 0) return;
    const M = Mat(t), ap = v => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
    const ei = ap([1, 0]), xv = ap(gx);
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.5 * a });
    P.axes(ctx, { M, color: C.ink, width: 3, alpha: 0.8 * a });
    const pg = gin(T.gpar, 0.6);
    const Mc = [[ei[0], xv[0]], [ei[1], xv[1]]];
    const { c } = paraFill(ctx, P, Mc, { color: C.i, alpha: 0.36 * a * pg, stroke: C.i, flipColor: false });
    // 高 y 的标注（变换前）
    const hA = a * win(t, T.gh - 0.2, T.gT2 - 0.2, 0.3, 0.3);
    if (hA > 0) { const q0 = P.S([gx[0], 0]), q1 = P.S(gx); ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = C.free; ctx.lineWidth = 3; ctx.globalAlpha = hA; ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke(); ctx.restore(); }
    ctx.restore();
    const O = P.S([0, 0]);
    arrow(ctx, O, P.S(ei), { color: C.i, width: 9, head: 28, alpha: a }); arrow(ctx, O, P.S(ap([0, 1])), { color: C.j, width: 9, head: 28, alpha: a * 0.7 });
    arrow(ctx, O, P.S(xv), { color: C.peri, width: 9, head: 28, alpha: a * gin(T.gx0) });
    const tipX = P.S(xv);
    K.tag(t > T.gT2 + 1.0 ? 'b = (4, 2)' : 'x = (?, y)', tipX[0] + 20, tipX[1] - 24, { px: 34, a: a * gin(T.gx0), color: C.peri, w: 900, font: F.serif });
    K.tag('y', P.S([gx[0], 1])[0] + 26, P.S([gx[0], 1])[1], { px: 38, a: hA, color: C.free, w: 900, font: F.serif });
    const lab = t < T.gT2 ? '面积 = 1 × y = y' : (t < T.gA2 ? '面积 = y · det A' : '面积 = det(A₂) = 4');
    K.tag(lab, c[0], c[1] + 10, { px: 32, a: a * pg, align: 'center', color: C.ink, w: 900 });
    texAt('G', DX + 180, DY - 300, 34, { alpha: a * gin(T.gT - 0.2), halo: C.disc });
    K.tag('det A = 2', DX + 180, DY - 215, { px: 32, a: a * gin(T.gT2), align: 'center', color: C.peri, w: 900 });
    K.tag('î → a₁ = (2, 0)', DX + 180, DY - 160, { px: 30, a: a * gin(T.ga1), align: 'center', color: C.i, w: 900 });
    texAt('gy', DX - 40, DY + 225, 36, { alpha: a * gin(T.gy), reveal: reveal(T.gy, 1.2), halo: C.disc });
    K.tag('x 坐标：用 (x, ĵ) 的面积', DX - 230, DY - 300, { px: 28, a: a * gin(T.gxx), align: 'center', color: C.j, w: 900 });
  }

  // ── 同济 ──
  function drawTj() {
    const a = win(t, T.tj, T.end0, 0.5, 0.5); if (a <= 0) return;
    K.tag('同济第二章 §3 · 伴随矩阵 A*', DX, DY - 320, { px: 34, a, align: 'center', color: C.gpt, w: 900 });
    texAt('tjA', DX, DY - 220, 52, { alpha: a * gin(T.tj + 0.6), reveal: reveal(T.tj + 0.6, 1.0) });
    K.tag('E = 单位矩阵', DX, DY - 140, { px: 30, a: a * gin(T.tjE), align: 'center', color: C.inkMid, w: 700 });
    K.tag('齐次方程组 Ax = 0', DX, DY - 40, { px: 36, a: a * gin(T.hom), align: 'center', color: C.peri, w: 900 });
    K.tag('|A| ≠ 0 → 只有零解', DX, DY + 30, { px: 34, a: a * gin(T.hom + 1.4), align: 'center', color: C.ink, w: 900 });
    K.tag('Ax = 0 有非零解 ⇒ |A| = 0', DX, DY + 115, { px: 40, a: a * gin(T.homN), align: 'center', color: C.free, w: 900, font: F.serif });
    K.tag('n 元：n + 1 个 n 阶行列式 → 还是消元快', DX, DY + 240, { px: 30, a: a * gin(T.small), align: 'center', color: C.inkMid, w: 900 });
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('行列式写出逆与解', DX, DY - 300, { px: 46, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('adj A：代数余子式 → 转置', DX, DY - 180, { px: 40, a: a * gin(T.z1), align: 'center', color: C.ink, w: 900, font: F.serif });
    texAt('inv', DX, DY - 50, 50, { alpha: a * gin(T.z2), color: C.j });
    texAt('cram', DX, DY + 120, 56, { alpha: a * gin(T.z3), color: C.i });
    K.tag('下一节：密码 · 叉积', DX, DY + 270, { px: 32, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.def, T.two);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('伴随矩阵 adj A', T.def);
      K.bullet('① 元素 → 代数余子式', 290, gin(T.cof)); K.bullet('② 转置', 350, gin(T.tr)); K.bullet('A · adj A = det(A) I', 410, gin(T.AI), { color: C.peri }); K.bullet('A⁻¹ = adj A / det A', 470, gin(T.inv), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.two, T.cr);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('算 adj A', T.two);
      K.bullet('2 阶：主对调、副变号', 290, gin(T.kou)); K.bullet('3 阶：九个代数余子式', 350, gin(T.nine)); K.bullet('第 i 行 → 第 i 列', 410, gin(T.col1), { color: C.peri }); K.bullet('只适合 2、3 阶', 470, gin(T.cost), { color: C.free, mark: C.free }); ctx.restore(); }
    a = sec(T.cr, T.geoQ + 0.3);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('克拉默法则', T.cr);
      K.bullet('xᵢ = det(Aᵢ) / det(A)', 290, gin(T.crF), { color: C.peri }); K.bullet('Aᵢ：第 i 列换成 b', 350, gin(T.Ai)); K.bullet('例 3：det A = −4', 410, gin(T.e3d)); K.bullet('x = (1, 1, 2)', 470, gin(T.e3x), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.geoQ + 0.3, T.tj);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('为什么换进 b？', T.geoQ + 0.3);
      K.bullet('(î, x) 面积 = y', 290, gin(T.gh)); K.bullet('变换后 × det A', 350, gin(T.gN)); K.bullet('(a₁, b) 面积 = det(A₂)', 410, gin(T.gA2), { color: C.peri }); K.bullet('y = det(A₂) / det(A)', 470, gin(T.gy), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.tj, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('同济对照', T.tj, C.gpt);
      K.bullet('A* = adj A', 290, gin(T.tj + 0.4)); K.bullet('AA* = A*A = |A|E', 350, gin(T.tj + 0.8)); K.bullet('有非零解 ⇒ |A| = 0', 410, gin(T.homN), { color: C.free, mark: C.free }); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('adj：换余子式再转置', 290, gin(T.z1)); K.bullet('A⁻¹ = adj A / det A', 350, gin(T.z2), { color: C.j, mark: C.j }); K.bullet('xᵢ = det Aᵢ / det A', 410, gin(T.z3), { color: C.peri }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 2.3', prog(t, 0.2, 1.3));
    drawTitle(); drawDef(); drawProd(); draw2(); drawEx2(); drawCr(); drawGeo(D); drawTj(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
