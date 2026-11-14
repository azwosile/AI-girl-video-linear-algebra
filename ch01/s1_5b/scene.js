// 第 1 章 §1.5（下）三角分解 LU（Leon 9th §1.5 Diagonal and Triangular Matrices、Triangular Factorization 例 6）。
// 3B1B 视角：上三角 = 横轴不动，下三角 = 纵轴不动；A = LU = 先做 U（保横轴剪切）再做 L（保纵轴剪切）。
// 分镜：
//   D01–C01   同一个 A、一百个 b → A = LU
//   C02–C03   上三角 / 下三角 / 对角（零区高亮）
//   C04–C06   平面：对角 = 沿轴拉伸；上三角保横轴；下三角保纵轴
//   D02–C07   U = upper，L = lower；严格三角形回代
//   C08–C13   例 6：只用倍加消元，乘子记下 → 填进 L → LU = A
//   D04–G01   为什么：E₃E₂E₁A = U ⇒ A = E₁⁻¹E₂⁻¹E₃⁻¹U；逆的顺序乘子不打架；原顺序出 −7/2
//   C19–C21   平面：I → U → LU = A
//   D05–C26   前代 + 回代，b = (4, 6, 4) → y = (4, 4, 8) → x = (−1, 1, 1)；消元一次，b 随便换
//   D06–G02   主元为 0 → 需要换行（第七章 PA = LU）；同济对照
//   D07–C28   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mlerp2 } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow, ring } from '../../engine/la2d/plane.js';
import { fmtNum } from '../../engine/la2d/mboard.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'ds_shock', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const num = v => typeof v === 'string' ? (v.includes('/') ? v.split('/').reduce((a, b) => Number(a) / Number(b)) : Number(v)) : v;
const mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const SUBN = ['₁', '₂', '₃'];

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const EX6 = MJ.systems.ex6, LUp = MJ.lu[1];
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.6, C04: 0.7, C05: 0.3, C06: 0.3, C08: 0.8, C09: 0.3, C10: 0.4, C12: 0.4, C14: 0.7, C18: 0.4, G01: 0.4, C19: 0.8, C20: 0.3, C22: 0.6, C24: 0.4, C25: 0.4, C26: 0.5, C27: 0.4, G02: 0.4, D07: 0.6 },
    post: { C05: 0.6, C06: 0.6, C09: 0.5, C10: 0.5, C12: 0.5, C13: 0.5, C17: 0.4, C18: 0.4, C20: 0.6, C21: 0.6, C24: 0.4, C25: 0.6 }, tail: 0.6,
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
    many: cue('D01', '一百次'), once: cue('C01', '消一遍'), alu: cue('C01', '三角分解'),
    sh: L('C02').s - 0.5, up: cue('C02', '上三角矩阵'), lo: cue('C02', '下三角矩阵'), dg: cue('C03', '对角矩阵'), both: cue('C03', '既是上三角'),
    pl: L('C04').s - 0.6, pD: cue('C04', '对角矩阵只沿'), pU: L('C05').s, pUx: cue('C05', '横轴这条线不动'), pL: L('C06').s, pLy: cue('C06', '纵轴不动'),
    ul: L('D02').s, ul2: cue('C07', 'U取自'), str: cue('C07', '严格三角形'), back: cue('C07', '回代'), pre: cue('C07', '前提是'),
    e6: L('C08').s - 0.6, e6a: cue('C08', '例六'), only3: cue('C08', '只用第三类'),
    o0: cue('C09', '第一步'), m0: cue('C09', '记下乘子二分之一'), o1: cue('C09', '第三行减去'),
    o2: cue('C10', '第二步'), m2: cue('C10', '乘子是负三'), isU: cue('C11', '这就是U'),
    f0: cue('C12', '二分之一放在'), f1: cue('C12', '二放在'), f2: cue('C12', '负三放在'), isL: cue('C12', '这就是L'),
    chk: cue('C13', '验证一下'), eqA: cue('C13', '正好等于A'),
    why: L('C14').s - 0.5, eee: cue('C14', 'E三E二E一A'), inv: cue('C15', '两边依次'), ord: cue('C15', '注意顺序'), pos: cue('C16', '正号'),
    cell: cue('C17', '各占各的格子'), join: cue('C17', '拼起来'), mix: cue('C18', '搅在一起'), m72: cue('C18', '负二分之七'),
    rule: cue('G01', '记个口诀'), sgn: cue('G01', '减是正'),
    lp: L('C19').s - 0.6, lp1: cue('C19', '只有一个乘子'), doU: cue('C20', 'U是保住横轴'), doL: cue('C20', 'L是保住纵轴'), stk: cue('C21', '两步叠起来'), cut: cue('C21', '拆成了'),
    sv: L('D05').s, spl: cue('C22', '写成L'), ux: cue('C22', '令U x'), fwd: cue('C23', '先解L y'), bwd: cue('C23', '再解U x'),
    ex: cue('C24', '四、六、四'), y1: cue('C24', 'y一等于四'), y2: cue('C24', 'y二等于'), y3: cue('C24', 'y三等于'),
    x3: cue('C25', 'x三等于一'), x2: cue('C25', 'x二等于一'), x1: cue('C25', 'x一等于负一'),
    cost: L('C26').s - 0.4, c1: cue('C26', '只做一次'), c2: cue('C26', '每来一个'), c3: cue('C26', '计算机'),
    pz: L('D06').s, p01: cue('C27', '零一、一零'), ch7: cue('C27', '第七章'),
    tj: L('G02').s - 0.2, tj2: cue('G02', '数值计算'),
    end0: L('D07').s - 0.6, z1: cue('D07', '消完是U'), z2: cue('D07', '填进去是L'), z3: cue('D07', 'A等于L U'), z4: cue('D08', '前代加回代'), next: cue('C28', '下一节'),
  };
  const OPT = [T.o0, T.o1, T.o2];
  const FILL = [T.f0, T.f1, T.f2];
  const MULT = EX6.ops.map(op => -num(op[3]));            // 乘子 ℓ = −c（“减去几倍”）
  const MPOS = EX6.ops.map(op => [op[1], op[2]]);

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.many, 0.3); TL.sfx('stamp', T.alu, 0.35);
  TL.sfx('whoosh', T.sh, 0.3); TL.sfx('pop', T.up, 0.3); TL.sfx('pop', T.lo, 0.3); TL.sfx('pop', T.dg, 0.3);
  TL.sfx('whoosh', T.pl, 0.3); TL.sfx('warp', T.pD, 0.35); TL.sfx('warp', T.pU + 0.3, 0.35); TL.sfx('ding_lo', T.pUx, 0.3); TL.sfx('warp', T.pL + 0.3, 0.35); TL.sfx('ding_lo', T.pLy, 0.3);
  TL.sfx('bell_soft', T.ul2, 0.3); TL.sfx('whoosh', T.e6, 0.3);
  OPT.forEach((t, i) => TL.sfx(i % 2 ? 'marimba_hi' : 'marimba', t + 0.3, 0.28)); [T.m0, T.o1 + 0.8, T.m2].forEach(t => TL.sfx('tick', t, 0.3));
  TL.sfx('stamp', T.isU, 0.35); FILL.forEach(t => TL.sfx('pluck', t + 0.4, 0.32)); TL.sfx('stamp', T.isL, 0.35); TL.sfx('sting', L('D03').s + 0.1, 0.28); TL.sfx('check', T.eqA, 0.35);
  TL.sfx('whoosh', T.why, 0.3); TL.sfx('pop', T.eee, 0.3); TL.sfx('pop', T.inv, 0.3); TL.sfx('shimmer', T.join, 0.32); TL.sfx('buzz', T.m72, 0.25); TL.sfx('bell_soft', T.rule, 0.3);
  TL.sfx('whoosh', T.lp, 0.3); TL.sfx('warp', T.doU, 0.4); TL.sfx('warp', T.doL, 0.4); TL.sfx('shimmer', T.stk, 0.35);
  TL.sfx('whoosh', T.sv + 0.2, 0.3); [T.y1, T.y2, T.y3, T.x3, T.x2, T.x1].forEach((t, i) => TL.sfx(i % 2 ? 'marimba_hi' : 'marimba', t, 0.26)); TL.sfx('check', T.x1 + 0.6, 0.3);
  TL.sfx('whoosh', T.cost, 0.3); TL.sfx('type', T.c2, 0.25); TL.sfx('ding_lo', T.p01, 0.3); TL.sfx('bell_soft', T.tj + 0.2, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.z1, T.z2, T.z3, T.z4].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C28').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  function drawTitle() {
    const a = 1 - smooth(prog(t, T.sh - 0.2, T.sh + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.5 三角分解'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'LU FACTORIZATION', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    // 一百个 b
    const ma = a * win(t, T.many - 0.3, T.alu - 0.3, 0.4, 0.4);
    if (ma > 0) {
      texAt('many', DX, DY - 120, 46, { alpha: ma, reveal: prog(t, T.many - 0.3, T.many + 1.2) });
      for (let i = 0; i < 12; i++) { const g = gin(T.many + 0.3 + i * 0.12, 0.3); K.tag('消元', DX - 330 + i * 60, DY + 40 + (i % 2) * 34, { px: 24, a: ma * g * 0.8, align: 'center', color: i < 1 ? C.peri : C.inkMid, w: 900 }); }
      K.tag('同一个 A，消一百遍？', DX, DY + 160, { px: 34, a: ma * gin(T.many + 1.2), align: 'center', color: C.free, w: 900 });
    }
    const la = a * gin(T.alu - 0.2, 0.5);
    if (la > 0) { texAt('ALU', DX, DY - 30, 130, { alpha: la, reveal: prog(t, T.alu - 0.2, T.alu + 0.6) }); K.tag('三角分解', DX, DY + 120, { px: 36, a: la * gin(T.alu + 0.4), align: 'center', color: C.peri, font: F.serif, w: 900 }); }
  }

  // ── 形状 ──
  function drawShapes() {
    const a = win(t, T.sh, T.pl, 0.4, 0.4); if (a <= 0) return;
    const one = (k, x, y, px, t0, lab, col) => {
      const g = gin(t0, 0.5); if (g <= 0) return; const pl = tex.place(k, x, y, px, 'c');
      tex.draw(ctx, pl, { alpha: a * g, reveal: prog(t, t0 - 0.1, t0 + 0.7) });
      const hl = gin(t0 + 0.6, 0.5); if (hl > 0) tex.draw(ctx, pl, { alpha: a * hl, only: ['z'], force: col });
      K.tag(lab, x, y + px * 2.4, { px: 30, a: a * g, align: 'center', color: col, w: 900 });
    };
    one('up', DX - 230, DY - 160, 46, T.up, '上三角：对角线下面是 0', C.i);
    one('lo', DX + 230, DY - 160, 46, T.lo, '下三角：对角线上面是 0', C.j);
    one('dg', DX, DY + 150, 42, T.dg, '对角：只剩对角线', C.k);
    K.tag('既上三角，又下三角', DX, DY + 300, { px: 28, a: a * gin(T.both), align: 'center', color: C.inkMid });
  }

  // ── 平面：对角 / 上三角 / 下三角；以及 LU ──
  function plane1() {
    if (t < T.pU - 0.2) return { M: mlerp2([[2, 0], [0, 0.5]], smoother(prog(t, T.pD - 0.2, T.pD + 1.2))), k: 'D' };
    if (t < T.pL - 0.2) return { M: mlerp2([[2, 1], [0, 1]], smoother(prog(t, T.pU + 0.2, T.pU + 1.5))), k: 'U' };
    return { M: mlerp2([[1, 0], [1, 2]], smoother(prog(t, T.pL + 0.2, T.pL + 1.5))), k: 'L' };
  }
  function plane2() {
    const Lm = LUp.L.map(r => r.map(num)), Um = LUp.U.map(r => r.map(num));
    const s1 = smoother(prog(t, T.doU - 0.2, T.doU + 1.3)), s2 = smoother(prog(t, T.doL - 0.2, T.doL + 1.3));
    const U_ = mlerp2(Um, s1), L_ = mlerp2(Lm, s2);
    return { M: mul(L_, U_), k: s2 > 0.02 ? 'LU2' : 'U2', s1, s2 };
  }
  function drawPlane(D) {
    const a1 = win(t, T.pl + 0.1, T.ul + 0.4, 0.5, 0.5), a2 = win(t, T.lp + 0.3, T.sv, 0.5, 0.5), a = Math.max(a1, a2);
    if (a <= 0.003) return;
    const st = a1 > 0 ? plane1() : plane2(), M = st.M;
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.6 * a });
    P.axes(ctx, { M: [[1, 0], [0, 1]], color: C.ink, width: 2, alpha: 0.35 * a });
    // 被保住的轴：粗亮线
    const keepX = st.k === 'U' ? gin(T.pUx - 0.3, 0.5) : st.k === 'U2' || st.k === 'LU2' ? gin(T.doU, 0.5) * (1 - gin(T.doL, 0.5)) : 0;
    const keepY = st.k === 'L' ? gin(T.pLy - 0.3, 0.5) : st.k === 'LU2' ? gin(T.doL, 0.5) * (1 - gin(T.stk, 0.5)) : 0;
    if (keepX > 0) { ctx.globalAlpha = a * keepX; ctx.strokeStyle = C.i; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(P.ox - 600, P.oy); ctx.lineTo(P.ox + 600, P.oy); ctx.stroke(); }
    if (keepY > 0) { ctx.globalAlpha = a * keepY; ctx.strokeStyle = C.j; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(P.ox, P.oy - 600); ctx.lineTo(P.ox, P.oy + 600); ctx.stroke(); }
    ctx.restore();
    const O = P.S([0, 0], M), pi = P.S([1, 0], M), pj = P.S([0, 1], M);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: a }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: a });
    K.tag('î', pi[0] + 16, pi[1] - 24, { px: 40, a, color: C.i, w: 900, font: F.serif }); K.tag('ĵ', pj[0] - 40, pj[1] - 14, { px: 40, a, color: C.j, w: 900, font: F.serif });
    const card = (key, lab, col, g) => { if (g <= 0) return; const pl = tex.place(key, DX + 300, DY - 290, 46, 'c'); tex.draw(ctx, pl, { alpha: a * g, halo: C.disc }); tex.draw(ctx, pl, { alpha: a * g, only: ['z'], force: col, halo: C.disc }); K.tag(lab, DX + 300, DY - 195, { px: 30, a: a * g, align: 'center', color: col, w: 900 }); };
    if (st.k === 'D') card('Dp', '对角：沿轴拉伸', C.k, gin(T.pD - 0.3));
    if (st.k === 'U') card('Up', '上三角：横轴不动', C.i, gin(T.pU));
    if (st.k === 'L') card('Lp', '下三角：纵轴不动', C.j, gin(T.pL));
    if (st.k === 'U2' || st.k === 'LU2') {
      const pl = tex.place('A2LU', DX, DY - 330, 40, 'c');
      tex.draw(ctx, pl, { alpha: a * gin(T.lp + 0.2), halo: C.disc });
      K.tag('① 先做 U：保横轴的剪切', DX - 250, DY + 260, { px: 30, a: a * gin(T.doU), align: 'center', color: C.i, w: 900 });
      K.tag('② 再做 L：保纵轴的剪切', DX + 230, DY + 260, { px: 30, a: a * gin(T.doL), align: 'center', color: C.j, w: 900 });
      K.tag('= A 的斜网格', DX, DY + 325, { px: 36, a: a * gin(T.stk), align: 'center', color: C.peri, font: F.serif, w: 900 });
    }
  }

  function drawUL() {
    const a = win(t, T.ul + 0.2, T.e6, 0.4, 0.4); if (a <= 0) return;
    K.tag('U', DX - 230, DY - 200, { px: 120, a: a * gin(T.ul + 0.3), align: 'center', color: C.i, font: F.serif, w: 900 });
    K.tag('upper · 上三角', DX - 230, DY - 100, { px: 32, a: a * gin(T.ul2), align: 'center', color: C.i, w: 900 });
    K.tag('L', DX + 230, DY - 200, { px: 120, a: a * gin(T.ul + 0.6), align: 'center', color: C.j, font: F.serif, w: 900 });
    K.tag('lower · 下三角', DX + 230, DY - 100, { px: 32, a: a * gin(T.ul2 + 0.4), align: 'center', color: C.j, w: 900 });
    const sa = a * gin(T.str, 0.5);
    if (sa > 0) {
      texAt('U6', DX - 60, DY + 120, 40, { alpha: sa });
      for (let i = 0; i < 3; i++) K.tag('↑', DX + 210, DY + 200 - i * 62, { px: 34, a: sa * gin(T.back + i * 0.25), align: 'center', color: C.peri, w: 900 });
      K.tag('回代', DX + 270, DY + 140, { px: 30, a: sa * gin(T.back), color: C.peri, w: 900 });
      K.tag('对角线 ≠ 0', DX - 60, DY + 270, { px: 30, a: sa * gin(T.pre), align: 'center', color: C.free, w: 900 });
    }
  }

  // ── 例 6 板 ──
  const S0 = EX6.A.map(r => r.map(num)), ST = EX6.steps.map(s => s.map(r => r.map(num)));
  const opLabel = op => { const Rr = i => 'R' + SUBN[i]; const k = num(op[3]), ak = Math.abs(k); return `${Rr(op[1])} ${k < 0 ? '−' : '+'} ${ak === 1 ? '' : fmtNum(ak)}${Rr(op[2])}`; };
  function board(o) {
    const { x, y, px, a } = o, m = 3, n = 3, cw = px * 2.0, rh = px * 1.55, W = cw * n, x0 = x - W / 2, y0 = y - (m * rh) / 2;
    const cx = j => x0 + j * cw + cw / 2, ry = i => y0 + i * rh + rh / 2;
    let k = -1; for (let i = 0; i < OPT.length; i++) if (t >= OPT[i]) k = i;
    const cur = k < 0 ? S0 : ST[k], prev = k < 1 ? S0 : ST[k - 1], s = k < 0 ? 1 : smoother(prog(t, OPT[k] + 0.25, OPT[k] + 0.85));
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 3.5;
    const bx0 = x0 - px * 0.3, bx1 = x0 + W + px * 0.3, by0 = y0 - 6, by1 = y0 + m * rh + 6, e = 14;
    ctx.beginPath(); ctx.moveTo(bx0 + e, by0); ctx.lineTo(bx0, by0); ctx.lineTo(bx0, by1); ctx.lineTo(bx0 + e, by1); ctx.moveTo(bx1 - e, by0); ctx.lineTo(bx1, by0); ctx.lineTo(bx1, by1); ctx.lineTo(bx1 - e, by1); ctx.stroke();
    if (k >= 0 && t < OPT[k] + 1.3) { const op = EX6.ops[k]; const f = 1 - smooth(prog(t, OPT[k] + 0.9, OPT[k] + 1.3));
      ctx.globalAlpha = a * 0.18 * f; ctx.fillStyle = C.peri; ctx.fillRect(x0 - px * 0.2, ry(op[1]) - rh * 0.45, W + px * 0.4, rh * 0.9);
      ctx.globalAlpha = a * 0.12 * f; ctx.fillStyle = C.j; ctx.fillRect(x0 - px * 0.2, ry(op[2]) - rh * 0.45, W + px * 0.4, rh * 0.9); }
    // 消完后：下三角零区淡色三角
    const ua = gin(T.isU, 0.5);
    if (ua > 0) { ctx.globalAlpha = a * ua * 0.16; ctx.fillStyle = C.i; ctx.beginPath(); ctx.moveTo(x0, y0 + rh * 0.95); ctx.lineTo(x0, y0 + m * rh); ctx.lineTo(x0 + W - cw * 0.95, y0 + m * rh); ctx.closePath(); ctx.fill(); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      const v0 = prev[i][j], v1 = cur[i][j], chg = Math.abs(v0 - v1) > 1e-9;
      ctx.font = F.sans(px, 500);
      if (chg && s < 1) { ctx.globalAlpha = a * (1 - s); ctx.fillStyle = C.ink; ctx.fillText(fmtNum(v0), cx(j), ry(i) - s * 14); ctx.globalAlpha = a * s; ctx.fillStyle = C.peri; ctx.fillText(fmtNum(v1), cx(j), ry(i) + (1 - s) * 14); }
      else { ctx.globalAlpha = a; ctx.fillStyle = chg && t < OPT[k] + 1.4 ? C.peri : C.ink; ctx.fillText(fmtNum(v1), cx(j), ry(i)); }
    }
    if (k >= 0) { const la = win(t, OPT[k], (OPT[k + 1] ?? OPT[k] + 2.4) - 0.05, 0.15, 0.2); K.tag(opLabel(EX6.ops[k]), x0 + W + px * 0.9, ry(EX6.ops[k][1]), { px: px * 0.7, a: a * la, color: C.peri, w: 900 }); }
    ctx.restore();
    return { x0, y0, W, cx, ry, rh };
  }
  function drawEx6() {
    const a = win(t, T.e6, T.why, 0.4, 0.4); if (a <= 0) return;
    const ba = a * (1 - gin(T.chk, 0.5));
    if (ba > 0) {
      K.tag('教材 · 例 6', DX, DY - 330, { px: 30, a: ba, align: 'center', color: C.inkMid });
      K.tag('只用第三类：Rᵢ + c·Rⱼ', DX, DY - 280, { px: 30, a: ba * gin(T.only3), align: 'center', color: C.k, w: 900 });
      K.tag('A', DX - 230, DY - 200, { px: 40, a: ba * (1 - gin(T.isU, 0.4)), align: 'center', color: C.ink, font: F.serif, w: 900 });
      K.tag('U', DX - 230, DY - 200, { px: 44, a: ba * gin(T.isU, 0.4), align: 'center', color: C.i, font: F.serif, w: 900 });
      const B = board({ x: DX - 230, y: DY - 60, px: 42, a: ba });
      // 乘子小票：先停在板下方，C12 时飞进 L
      const Lpl = tex.place('L6', DX + 250, DY - 60, 44, 'c');
      const la = ba * gin(T.f0 - 0.6, 0.5);
      const cls = {}; ['l21', 'l31', 'l32'].forEach((c, i) => cls[c] = gin(FILL[i] + 0.7, 0.25));
      if (la > 0) { tex.draw(ctx, Lpl, { alpha: la, cls }); K.tag('单位下三角', DX + 280, DY + 60, { px: 26, a: la, align: 'center', color: C.j }); }
      MULT.forEach((v, i) => {
        const t0 = [T.m0, T.o1 + 0.8, T.m2][i]; const g = gin(t0, 0.4); if (g <= 0) return;
        const home = [DX - 360 + i * 130, DY + 150];
        const box = tex.groupBox(Lpl, ['l21', 'l31', 'l32'][i]);
        const fl = smoother(prog(t, FILL[i], FILL[i] + 0.7)), tgt = box ? [box.x, box.y] : home;
        const p = [lerp(home[0], tgt[0], fl), lerp(home[1], tgt[1], fl) - Math.sin(Math.PI * fl) * 90];
        const fade = 1 - smooth(prog(t, FILL[i] + 0.65, FILL[i] + 0.8));
        const [r, c] = MPOS[i];
        K.tag(`ℓ${SUBN[r]}${SUBN[c]}`, p[0], p[1] - 40, { px: 24, a: ba * g * (1 - fl), align: 'center', color: C.inkMid });
        K.tag(fmtNum(v), p[0], p[1], { px: 40, a: ba * g * fade, align: 'center', color: C.peri, w: 900 });
      });
      K.tag('乘子 =「减去几倍」', DX - 230, DY + 220, { px: 28, a: ba * gin(T.m0) * (1 - gin(T.f0, 0.4)), align: 'center', color: C.peri });
      K.tag('按位置填进去', DX + 250, DY + 130, { px: 30, a: ba * gin(T.f0), align: 'center', color: C.peri, w: 900 });
      K.tag('L', DX + 250, DY - 200, { px: 44, a: ba * gin(T.isL, 0.4), align: 'center', color: C.j, font: F.serif, w: 900 });
    }
    const ca = a * gin(T.chk, 0.5);
    if (ca > 0) {
      texAt('LU6', DX, DY - 60, 42, { alpha: ca, reveal: prog(t, T.chk, T.eqA + 0.6) });
      K.tag('L', DX - 330, DY - 190, { px: 36, a: ca, align: 'center', color: C.j, font: F.serif, w: 900 }); K.tag('U', DX - 30, DY - 190, { px: 36, a: ca, align: 'center', color: C.i, font: F.serif, w: 900 }); K.tag('A', DX + 310, DY - 190, { px: 36, a: ca * gin(T.eqA), align: 'center', color: C.ink, font: F.serif, w: 900 });
      K.tag('L · U = A ✓', DX, DY + 120, { px: 40, a: ca * gin(T.eqA), align: 'center', color: C.peri, font: F.serif, w: 900 });
    }
  }

  // ── 为什么 ──
  function drawWhy() {
    const a = win(t, T.why, T.lp, 0.4, 0.4); if (a <= 0) return;
    const ra = 1 - gin(T.rule, 0.4);
    texAt('EEE', DX, DY - 300, 52, { alpha: a * ra * gin(T.eee - 0.3), reveal: prog(t, T.eee - 0.3, T.eee + 0.8) });
    texAt('Ainv', DX, DY - 200, 52, { alpha: a * ra * gin(T.inv), reveal: prog(t, T.inv, T.inv + 1.2) });
    K.tag('顺序反过来', DX + 330, DY - 140, { px: 26, a: a * ra * gin(T.ord), align: 'center', color: C.peri, w: 900 });
    const ea = a * ra * gin(T.pos - 0.3, 0.5);
    if (ea > 0) { const pl = tex.place('Einv', DX, DY - 10, 36, 'c'); tex.draw(ctx, pl, { alpha: ea, cls: { m: 1 }, reveal: prog(t, T.pos - 0.3, T.join + 0.6) }); }
    K.tag('乘子各占各的格子 → 直接拼成 L', DX, DY + 100, { px: 30, a: a * ra * gin(T.cell), align: 'center', color: C.j, w: 900 });
    const ma = a * ra * gin(T.mix - 0.2, 0.5);
    if (ma > 0) { texAt('Emix', DX, DY + 220, 36, { alpha: ma, reveal: prog(t, T.mix - 0.2, T.mix + 0.9) }); K.tag('原顺序：搅在一起 ✗', DX, DY + 320, { px: 28, a: ma * gin(T.m72), align: 'center', color: C.free, w: 900 }); }
    const ga = a * gin(T.rule, 0.5);
    if (ga > 0) {
      texAt('L6', DX, DY - 110, 54, { alpha: ga });
      K.tag('ℓᵢⱼ = 第 i 行减去第 j 行的倍数', DX, DY + 90, { px: 34, a: ga, align: 'center', color: C.gpt, w: 900 });
      K.tag('减 → 正    加 → 负', DX, DY + 170, { px: 34, a: ga * gin(T.sgn), align: 'center', color: C.peri, w: 900 });
    }
  }

  // ── 前代 / 回代 ──
  function drawSolve() {
    const a = win(t, T.sv + 0.2, T.pz, 0.4, 0.4); if (a <= 0) return;
    const sa = a * (1 - gin(T.cost, 0.4));
    if (sa > 0) {
      texAt('split', DX, DY - 330, 40, { alpha: sa * gin(T.spl - 0.2), reveal: prog(t, T.spl - 0.2, T.spl + 1.0) });
      texAt('two', DX, DY - 255, 40, { alpha: sa * gin(T.ux), reveal: prog(t, T.ux, T.ux + 0.8), color: C.peri });
      const fa = sa * gin(T.fwd, 0.4); if (fa > 0) { texAt('fw', DX - 40, DY - 120, 34, { alpha: fa }); K.tag('前代 ↓', DX + 330, DY - 120, { px: 28, a: fa, color: C.j, w: 900 }); }
      const yv = [[T.y1, 'y₁ = 4'], [T.y2, 'y₂ = 6 − 2 = 4'], [T.y3, 'y₃ = 4 − 8 + 12 = 8']];
      yv.forEach(([tt, s], i) => K.tag(s, DX - 300 + i * 230, DY - 20, { px: 28, a: sa * gin(tt), align: 'center', color: C.j, w: 900 }));
      const ba = sa * gin(T.bwd, 0.4); if (ba > 0) { texAt('bw', DX - 40, DY + 110, 34, { alpha: ba }); K.tag('回代 ↑', DX + 330, DY + 110, { px: 28, a: ba, color: C.i, w: 900 }); }
      const xv = [[T.x3, 'x₃ = 1'], [T.x2, 'x₂ = 1'], [T.x1, 'x₁ = −1']];
      xv.forEach(([tt, s], i) => K.tag(s, DX + 230 - i * 230, DY + 215, { px: 30, a: sa * gin(tt), align: 'center', color: C.i, w: 900 }));
      K.tag('x = (−1, 1, 1) ✓', DX, DY + 290, { px: 34, a: sa * gin(T.x1 + 0.6), align: 'center', color: C.peri, font: F.serif, w: 900 });
    }
    const ca = a * gin(T.cost, 0.4);
    if (ca > 0) {
      ctx.save(); ctx.globalAlpha = ca * gin(T.c1); ctx.fillStyle = C.peri; ctx.fillRect(DX - 380, DY - 140, 260, 120); ctx.restore();
      K.tag('消元 → L, U', DX - 250, DY - 80, { px: 32, a: ca * gin(T.c1), align: 'center', color: '#121010', w: 900 });
      K.tag('只做一次', DX - 250, DY + 10, { px: 28, a: ca * gin(T.c1), align: 'center', color: C.peri, w: 900 });
      for (let i = 0; i < 8; i++) { const g = gin(T.c2 + i * 0.18, 0.25), x = DX - 60 + (i % 4) * 110, y = DY - 120 + Math.floor(i / 4) * 90;
        if (g <= 0) continue; ctx.save(); ctx.globalAlpha = ca * g; ctx.strokeStyle = C.j; ctx.lineWidth = 3; ctx.strokeRect(x, y, 96, 70); ctx.restore();
        K.tag(`b${i < 3 ? SUBN[i] : ''}${i >= 3 ? '…' : ''}`, x + 48, y + 35, { px: 26, a: ca * g, align: 'center', color: C.j, w: 900 }); }
      K.tag('每个 b：前代 + 回代，快', DX + 150, DY + 110, { px: 30, a: ca * gin(T.c2 + 0.8), align: 'center', color: C.j, w: 900 });
      K.tag('计算机解方程的标准做法', DX, DY + 230, { px: 34, a: ca * gin(T.c3), align: 'center', color: C.ink, font: F.serif, w: 900 });
    }
  }

  function drawPivot() {
    const a = win(t, T.pz + 0.1, T.end0, 0.4, 0.5); if (a <= 0) return;
    const pa = a * (1 - gin(T.tj, 0.4));
    if (pa > 0) {
      const pl = tex.place('P01', DX, DY - 100, 70, 'c'); tex.draw(ctx, pl, { alpha: pa * gin(T.p01 - 0.2) });
      const bx = tex.groupBox(pl, 'bad'); const g = gin(T.p01 + 0.4);
      if (bx && g > 0) { ctx.save(); ctx.globalAlpha = pa * g; ctx.strokeStyle = C.free; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(bx.x, bx.y, 52, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * smoother(prog(t, T.p01 + 0.3, T.p01 + 0.9))); ctx.stroke(); ctx.restore(); }
      K.tag('主元是 0：只用倍加消不动', DX, DY + 60, { px: 34, a: pa * gin(T.p01 + 0.4), align: 'center', color: C.free, w: 900 });
      texAt('PLU', DX, DY + 170, 50, { alpha: pa * gin(T.ch7) });
      K.tag('先换好行，再分解（第七章）', DX, DY + 250, { px: 28, a: pa * gin(T.ch7), align: 'center', color: C.inkMid });
    }
    const ta = a * gin(T.tj, 0.4);
    if (ta > 0) {
      K.tag('同济第六版 · 对照', DX, DY - 160, { px: 34, a: ta, align: 'center', color: C.gpt, w: 900 });
      K.tag('正文不讲 LU，学习辅导里补充', DX, DY - 60, { px: 36, a: ta, align: 'center', color: C.ink, w: 900 });
      K.tag('数值计算里天天见', DX, DY + 40, { px: 36, a: ta * gin(T.tj2), align: 'center', color: C.peri, font: F.serif, w: 900 });
    }
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    texAt('ALU', DX, DY - 250, 90, { alpha: a });
    K.tag('U = 只用倍加消完的上三角', DX, DY - 110, { px: 34, a: a * gin(T.z1), align: 'center', color: C.i, w: 900 });
    K.tag('L = 乘子按位置填进单位下三角', DX, DY - 40, { px: 34, a: a * gin(T.z2), align: 'center', color: C.j, w: 900 });
    K.tag('Ly = b 前代，Ux = y 回代', DX, DY + 60, { px: 34, a: a * gin(T.z4), align: 'center', color: C.peri, w: 900 });
    K.tag('下一节：分块矩阵', DX, DY + 200, { px: 34, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.sh, T.e6);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('三角矩阵', T.sh);
      K.bullet('上三角：下面全 0', 290, gin(T.up), { mark: C.i }); K.bullet('下三角：上面全 0', 350, gin(T.lo), { mark: C.j }); K.bullet('对角：两者都是', 410, gin(T.dg), { mark: C.k });
      K.bullet('上三角 → 横轴不动', 480, gin(T.pUx), { px: 30, color: C.i, mark: C.i }); K.bullet('下三角 → 纵轴不动', 530, gin(T.pLy), { px: 30, color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.e6 + 0.2, T.why);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('例 6：LU 分解', T.e6 + 0.3);
      K.bullet('只用倍加消元', 290, gin(T.only3)); K.bullet('记下每个乘子', 350, gin(T.m0)); K.bullet('消完 = U', 410, gin(T.isU), { mark: C.i }); K.bullet('乘子填进去 = L', 470, gin(T.isL), { mark: C.j }); K.bullet('LU = A', 530, gin(T.eqA), { color: C.peri }); ctx.restore(); }
    a = sec(T.why + 0.2, T.lp);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('为什么能直接填', T.why + 0.3);
      K.bullet('E₃E₂E₁A = U', 290, gin(T.eee)); K.bullet('A = E₁⁻¹E₂⁻¹E₃⁻¹U', 350, gin(T.inv)); K.bullet('逆：乘子变正号', 410, gin(T.pos)); K.bullet('互不干扰 → L', 470, gin(T.join), { color: C.peri });
      K.note('GPT · 口诀', ['ℓᵢⱼ = 第 i 行减去第 j 行的倍数'], 520, gin(T.rule, 0.5)); ctx.restore(); }
    a = sec(T.lp + 0.2, T.sv);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('A = LU 的几何', T.lp + 0.3);
      K.bullet('先做 U：保横轴', 290, gin(T.doU), { mark: C.i }); K.bullet('再做 L：保纵轴', 350, gin(T.doL), { mark: C.j }); K.bullet('叠起来 = A', 410, gin(T.stk), { color: C.peri }); ctx.restore(); }
    a = sec(T.sv + 0.2, T.pz);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('用 LU 解方程', T.sv + 0.3);
      K.bullet('令 Ux = y', 290, gin(T.ux)); K.bullet('Ly = b：前代', 350, gin(T.fwd), { mark: C.j }); K.bullet('Ux = y：回代', 410, gin(T.bwd), { mark: C.i }); K.bullet('消元一次，b 随便换', 470, gin(T.c2), { color: C.peri }); ctx.restore(); }
    a = sec(T.pz + 0.2, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('注意', T.pz + 0.3);
      K.bullet('主元 0 → 需要换行', 290, gin(T.p01), { color: C.free, mark: C.free }); K.bullet('PA = LU（第七章）', 350, gin(T.ch7));
      K.note('同济第六版 · 对照', ['正文不讲 LU', '学习辅导补充'], 400, gin(T.tj, 0.5)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('消完是 U', 290, gin(T.z1), { mark: C.i }); K.bullet('乘子填成 L', 350, gin(T.z2), { mark: C.j }); K.bullet('A = LU', 410, gin(T.z3), { color: C.peri }); K.bullet('前代 + 回代', 470, gin(T.z4)); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.5', prog(t, 0.2, 1.3));
    drawTitle(); drawShapes(); drawPlane(D); drawUL(); drawEx6(); drawWhy(); drawSolve(); drawPivot(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
