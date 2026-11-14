// 第 1 章 · 预览版「矩阵即变换」（约 1 分钟，深色海报风）
// 和 30 秒样片相比：
//   · 深色底，网格 / 公式用奶油色和橙色；大圆加大（r 515）
//   · 原始网格一直用淡奶油细线画着，变换后网格是橙色，两套网格同时可见
//   · 讲解更细：先认识 î、ĵ，再讲 (3,2)=3î+2ĵ，再讲三条规矩，最后才变换
//   · 角色差分随台词切换（交叉淡化 + 小跳）
// 分镜：
//   开场   标题 + 大圆；大肥鱼半身海报
//   D01    数字堆 + 问号
//   C01    数字飞进大圆化成网格，轻轻变形一下预告
//   C02    î、ĵ 长出，标 (1,0)、(0,1)；左栏写 î=[1;0]、ĵ=[0;1]
//   C03    3 个 î 首尾相接，再接 2 个 ĵ，到达 (3,2)；左栏写 [3;2]=3î+2ĵ
//   D02    清场，大肥鱼在右下提问
//   C04    平面先做一个温和的变换 B；左栏逐条写三条规矩，图上同步高亮直线 / 平行等距 / 原点
//   C05    平面复原；î、ĵ 脉冲（只需追踪它们）
//   C06    标出 î、ĵ 的落点 (2,1)、(−1,1)
//   C07    整张网格跟着走（变换 A）
//   C08    落点坐标飞进矩阵 A 的两列
//   D03    平面复原，向量 v=(1,2) 出现
//   C09    1 个 î + 2 个 ĵ 的配方；平面变换，配方跟着走
//   C10    Av = 1·第一列 + 2·第二列 = (0,3)
//   G01    大圆切到三维：单位立方体随 3×3 矩阵变换
//   D04    大肥鱼开心总结；收尾标语
import { C, F, W, H } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mixColor, mlerp2, mlerp3, apply2 } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow, arcGuide, target, ring } from '../../engine/la2d/plane.js';
import { Space3D } from '../../engine/la3d/space3d.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_ask', 'ds_happy', 'gpt_proud'] };

const A = [[2, -1], [1, 1]];
const B = [[1.15, 0.45], [-0.25, 0.95]]; // 三条规矩演示用的温和变换
const A3 = [[1, 1, 0], [0, 1, 1], [1, 0, 1]];
const I2 = [[1, 0], [0, 1]];
const DX = 1230, DY = 540, DR = 515; // 大圆
const LX = 168; // 左栏公式左边界
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const mixM = (P, Q, s) => P.map((r, i) => r.map((v, j) => lerp(v, Q[i][j], s)));

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 1.9,
    pre: { C01: 0.6, C02: 0.5, C03: 0.5, D02: 0.7, C04: 0.3, C05: 0.4, C06: 0.5, C07: 0.2, C08: 1.0, D03: 0.5, C09: 0.3, C10: 0.7, G01: 1.0, D04: 0.5 },
    post: { D04: 1.9 }, tail: 0.6,
  });
  const L = TL.L;
  const ln = Object.fromEntries(R.lines.map(l => [l.id, l]));
  const [d01, c01, c02, c03, d02, c04, c05, c06, c07, c08, d03, c09, c10, g01, d04] =
    ['D01', 'C01', 'C02', 'C03', 'D02', 'C04', 'C05', 'C06', 'C07', 'C08', 'D03', 'C09', 'C10', 'G01', 'D04'].map(L);
  /** 台词里某个词大约在什么时候说出（按朗读稿字数比例估算） */
  const cue = (id, word, k = 0) => {
    const l = L(id), rd = ln[id].read || ln[id].sub, i = rd.indexOf(word);
    if (i < 0) throw new Error(`cue: ${id} 里找不到「${word}」`);
    return l.s + l.d * clamp((i + k) / rd.length);
  };
  const cast = new Cast(R.envelope, TL);
  for (const n of assets.chars) cast.add(n, R.img[n], SHADOW[n.split('_')[0]]);
  const P = new Plane({ ox: DX, oy: DY + 40, u: 92, R: 11 });
  const S3 = new Space3D(1040, { R: 4 });

  // ---------- 关键时刻 ----------
  const T = {
    tease: [c01.s + 1.0, c01.e + 0.3],
    iGrow: [c02.s + 0.2, c02.s + 0.75], jGrow: [cue('C02', 'j帽') - 0.1, cue('C02', 'j帽') + 0.45],
    iTag: cue('C02', '一、零'), jTag: cue('C02', '零、一'),
    c32: cue('C03', '比如'), chainI: [cue('C03', '三个') - 0.1, cue('C03', '三个') + 1.0], chainJ: [cue('C03', '两个') - 0.1, cue('C03', '两个') + 0.75],
    clear1: [d02.s - 0.5, d02.s + 0.2],
    bFwd: [cue('C04', '线性变换') - 0.2, cue('C04', '线性变换') + 1.2],
    rule1: cue('C04', '直线还是'), rule2: cue('C04', '平行'), rule3: cue('C04', '原点'),
    bRev: [c05.s - 0.1, c05.s + 1.0], track: cue('C05', '知道'),
    rulesOut: [c06.s - 0.4, c06.s + 0.1],
    iTarget: cue('C06', 'i帽'), jTarget: cue('C06', 'j帽'),
    fwd: [c07.s + 0.05, c07.s + 1.75],
    aWrite: [c08.s - 0.2, c08.s + 0.4], iFly: [cue('C08', '第一列') - 0.15, cue('C08', '第一列') + 0.65], jFly: [cue('C08', '第二列') - 0.15, cue('C08', '第二列') + 0.65],
    rev: [d03.s - 0.4, d03.s + 0.7], vGrow: [cue('D03', '比如') - 0.1, cue('D03', '比如') + 0.45],
    comp1: [cue('C09', '一个') - 0.05, cue('C09', '一个') + 0.5], comp2: [cue('C09', '两个') - 0.05, cue('C09', '两个') + 0.75],
    fwd2: [cue('C09', '变换后') - 0.1, cue('C09', '变换后') + 1.5],
    col1: cue('C10', '一倍'), col2: cue('C10', '两倍'), land: cue('C10', '也就是'),
    to3d: [g01.s - 0.75, g01.s - 0.05], cam: [g01.s - 0.6, g01.s + 1.4], fwd3: [cue('G01', '三维') - 0.1, cue('G01', '三维') + 1.4], col3: cue('G01', '多一列'),
    recap: d04.s - 0.2, outro: d04.e + 0.5,
  };
  T.under = T.jFly[1] + 0.15;

  // 音效登记（mix.py 读取 TIMELINE.sfx；文件在 .cache48/）
  TL.sfx('swoosh_in', 0.3, 0.45);
  [0, 1, 2, 3].forEach(k => TL.sfx('pop', d01.s + 0.2 + k * 0.18, 0.32));
  TL.sfx('whoosh', c01.s - 0.5, 0.4);
  TL.sfx('swell', T.tease[0], 0.25);
  TL.sfx('pluck', T.iGrow[0], 0.5); TL.sfx('pluck', T.jGrow[0], 0.45);
  [0, 1, 2].forEach(k => TL.sfx('marimba', T.chainI[0] + k * 0.3, 0.32));
  [0, 1].forEach(k => TL.sfx('marimba_hi', T.chainJ[0] + k * 0.3, 0.32));
  TL.sfx('ding', T.chainJ[1], 0.35);
  TL.sfx('swoosh_soft', T.clear1[0], 0.3);
  TL.sfx('swell', T.bFwd[0], 0.35);
  [T.rule1, T.rule2, T.rule3].forEach(t => TL.sfx('check', t, 0.35));
  TL.sfx('swell', T.bRev[0], 0.25);
  TL.sfx('tick', T.iTarget, 0.4); TL.sfx('tick', T.jTarget, 0.4);
  TL.sfx('swell', T.fwd[0], 0.5);
  TL.sfx('pop', T.iFly[1], 0.35); TL.sfx('pop', T.jFly[1], 0.35);
  TL.sfx('swell', T.rev[0], 0.3);
  TL.sfx('pluck', T.vGrow[0], 0.45);
  TL.sfx('tick', T.comp1[0], 0.35); TL.sfx('tick', T.comp2[0], 0.35);
  TL.sfx('swell', T.fwd2[0], 0.4);
  TL.sfx('tick2', T.col1, 0.3); TL.sfx('tick2', T.col2, 0.3);
  TL.sfx('ding_hi', T.land, 0.45);
  TL.sfx('whoosh', T.to3d[0], 0.4);
  TL.sfx('swell', T.fwd3[0], 0.45);
  TL.sfx('sparkle', T.recap, 0.35);
  TL.sfx('shimmer', T.outro, 0.4);

  // 平面当前的矩阵
  const Mat = t => {
    if (t < T.bFwd[0]) return mlerp2(A, 0.38 * Math.sin(Math.PI * smooth(prog(t, ...T.tease))));
    if (t < T.bRev[0]) return mixM(I2, B, smoother(prog(t, ...T.bFwd)));
    if (t < T.fwd[0]) return mixM(B, I2, smoother(prog(t, ...T.bRev)));
    if (t < T.rev[0]) return mlerp2(A, smoother(prog(t, ...T.fwd)));
    if (t < T.fwd2[0]) return mlerp2(A, 1 - smoother(prog(t, ...T.rev)));
    return mlerp2(A, smoother(prog(t, ...T.fwd2)));
  };
  const offI = M => Math.min(1, Math.hypot(M[0][0] - 1, M[0][1], M[1][0], M[1][1] - 1) / 0.6);

  // 大圆舞台：开场从右侧长出，C01 时移到正位并放大
  const discAt = t => {
    const r0 = 430 * outCubic(prog(t, 0.05, 0.9));
    const m = smoother(prog(t, c01.s - 0.7, c01.s + 0.35));
    return { x: lerp(1300, DX, m), y: lerp(520, DY, m), r: lerp(r0, DR, m) };
  };

  // ---------- 各层 ----------
  function drawDisc(t, D) {
    if (D.r <= 0) return;
    ctx.save(); ctx.fillStyle = C.disc; ctx.beginPath(); ctx.arc(D.x, D.y, D.r, 0, Math.PI * 2); ctx.fill();
    // 外圈细线 + 绕行的四角星；左下一小段橙色粗弧（构成主义色块）
    const sw = smooth(prog(t, 0.4, 1.7)); if (sw > 0) {
      const a0 = -Math.PI / 2 + t * 0.1, a1 = a0 + sw * Math.PI * 1.6, rr = D.r + 18;
      ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.35; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(D.x, D.y, rr, a0, a1); ctx.stroke();
      ctx.globalAlpha = 1; star4(ctx, D.x + rr * Math.cos(a1), D.y + rr * Math.sin(a1), 13, C.peri);
      ctx.strokeStyle = C.peri; ctx.lineWidth = 10; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.arc(D.x, D.y, D.r + 6, Math.PI * 0.62, Math.PI * (0.62 + 0.22 * sw)); ctx.stroke();
    }
    ctx.restore();
  }

  function drawTitle(t) {
    const a = 1 - smooth(prog(t, c01.s - 0.5, c01.s + 0.1)); if (a <= 0) return;
    const m = smoother(prog(t, d01.s - 0.3, d01.s + 0.4));
    const x = 150, y = lerp(440, 215, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与线性变换', 4, -128);
    ctx.font = F.serif(108); ctx.textBaseline = 'alphabetic';
    let cx = 0; const title = '矩阵即变换';
    [...title].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.09, 0.62 + i * 0.09), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc);
        ctx.fillStyle = i >= 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 6;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.8, 1.3));
    dotted(ctx, 'MATRIX', cx / 2, 62, 30, C.peri, { rule: 70 * smooth(prog(t, 0.9, 1.5)) });
    ctx.restore();
  }

  function drawPile(t) {
    if (t < d01.s || t > c01.s + 0.6) return;
    const fly = smoother(prog(t, c01.s - 0.55, c01.s + 0.45));
    const pl = tex.place('pile', lerp(430, P.ox, fly), lerp(650, P.oy - 40, fly), lerp(92, 280, fly), 'c');
    const cls = {}, shift = {};
    ['e11', 'e12', 'e21', 'e22'].forEach((n, k) => {
      const s = prog(t, d01.s + 0.2 + k * 0.18, d01.s + 0.55 + k * 0.18);
      cls[n] = smooth(s * 1.4) * (1 - fly);
      const wob = 1 - fly;
      shift[n] = [Math.sin(t * 1.9 + k * 1.7) * 9 * wob, (1 - outBack(s, 2)) * 40 + Math.cos(t * 1.4 + k) * 7 * wob];
    });
    tex.draw(ctx, pl, { cls, shift, restAlpha: 0 });
    const q = smooth(prog(t, d01.s + 1.2, d01.s + 1.6)) * (1 - fly);
    if (q > 0) { ctx.save(); ctx.globalAlpha = q; ctx.font = F.serif(96); ctx.fillStyle = C.peri; ctx.fillText('?', 600, 600 - 10 * Math.sin(t * 2)); ctx.restore(); }
  }

  // 小标签（画布文字，带深色描边）
  function tag(text, x, y, { color = C.ink, px = 34, a = 1, align = 'left' } = {}) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = F.sans(px, 700); ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.strokeStyle = C.paperHi; ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y); ctx.restore();
  }
  const lab = (key, x, y, px, a, anchor = 'c') => { if (a > 0) tex.draw(ctx, tex.place(key, x, y, px, anchor), { alpha: a, halo: C.paperHi }); };

  function drawPlane2D(t, D, alpha) {
    if (t < c01.s - 0.2 || alpha <= 0) return;
    const M = Mat(t); P.M = M;
    const grow = prog(t, c01.s - 0.1, c01.s + 1.2);
    const off = offI(M);
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip();
    // 原始网格：淡奶油细线，始终可见
    P.grid(ctx, { M: I2, color: C.gridOld, width: 1.3, alpha: 0.24 * alpha, grow });
    P.axes(ctx, { M: I2, color: C.gridOld, width: 2.2, alpha: 0.5 * alpha, grow: prog(t, c01.s + 0.1, c01.s + 1.1) });
    // 变换后网格：橙色；不变形时更淡，变形后加重
    P.grid(ctx, { M, color: C.gridNew, width: 2, alpha: (0.42 + 0.4 * off) * alpha, grow });
    P.axes(ctx, { M, color: C.gridNew, width: 3.4, alpha: (0.5 + 0.45 * off) * alpha, grow: prog(t, c01.s + 0.1, c01.s + 1.1) });
    // 三条规矩的图上高亮
    const r1 = smooth(prog(t, T.rule1 - 0.1, T.rule1 + 0.35)) * (1 - smooth(prog(t, T.bRev[0], T.bRev[0] + 0.4)));
    if (r1 > 0) P.line(ctx, [0, -1], [1, 1], { M, color: C.ink, width: 5, alpha: alpha * r1, grow: r1 });
    const r2 = smooth(prog(t, T.rule2 - 0.1, T.rule2 + 0.3)) * (1 - smooth(prog(t, T.bRev[0], T.bRev[0] + 0.4)));
    if (r2 > 0) for (let k = -2; k <= 2; k++) P.line(ctx, [k, 0], [0, 1], { M, color: C.periLt, width: 4, alpha: alpha * r2 * 0.95, grow: smooth(prog(t, T.rule2 + k * 0.06, T.rule2 + 0.4 + k * 0.06)) });
    ctx.restore();

    ctx.save(); ctx.globalAlpha = alpha;
    const O = P.S([0, 0]);
    // 等距小刻度：在 y=0 轴上标出相邻竖线间距
    if (r2 > 0) for (let k = -2; k < 2; k++) {
      const p = P.S([k, 0]), q = P.S([k + 1, 0]); ctx.save(); ctx.globalAlpha = alpha * r2; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(p[0], p[1] + 20); ctx.lineTo(p[0], p[1] + 32); ctx.moveTo(p[0], p[1] + 26); ctx.lineTo(q[0], q[1] + 26); ctx.moveTo(q[0], q[1] + 20); ctx.lineTo(q[0], q[1] + 32); ctx.stroke();
      ctx.restore();
    }
    // 原点不动
    ring(ctx, O, prog(t, T.rule3, T.rule3 + 0.7), { color: C.ink }); ring(ctx, O, prog(t, T.rule3 + 0.3, T.rule3 + 1.0), { color: C.ink });
    const od = win(t, T.rule3 - 0.1, T.rule3 + 1.3, 0.2, 0.3);
    if (od > 0) { ctx.fillStyle = C.ink; ctx.globalAlpha = alpha * od; ctx.beginPath(); ctx.arc(O[0], O[1], 8, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = alpha; }

    // ---- C03：(3,2) = 3î + 2ĵ ----
    const clr1 = 1 - smooth(prog(t, ...T.clear1));
    if (t > T.chainI[0] && clr1 > 0) {
      for (let k = 0; k < 3; k++) {
        const g = smooth(prog(t, T.chainI[0] + k * 0.3, T.chainI[0] + k * 0.3 + 0.35));
        if (g > 0) arrow(ctx, P.S([k, 0]), P.S([k + 1, 0]), { color: C.i, width: 7, head: 22, grow: g, alpha: alpha * clr1 });
      }
      for (let k = 0; k < 2; k++) {
        const g = smooth(prog(t, T.chainJ[0] + k * 0.3, T.chainJ[0] + k * 0.3 + 0.35));
        if (g > 0) arrow(ctx, P.S([3, k]), P.S([3, k + 1]), { color: C.j, width: 7, head: 22, grow: g, alpha: alpha * clr1 });
      }
      tag('×3', P.S([1.5, 0])[0], P.S([1.5, 0])[1] + 38, { color: C.i, a: alpha * clr1 * smooth(prog(t, T.chainI[1] - 0.2, T.chainI[1] + 0.1)), align: 'center' });
      tag('×2', P.S([3, 1])[0] + 22, P.S([3, 1])[1], { color: C.j, a: alpha * clr1 * smooth(prog(t, T.chainJ[1] - 0.2, T.chainJ[1] + 0.1)) });
      const pd = smooth(prog(t, T.chainJ[1] - 0.05, T.chainJ[1] + 0.25)) * clr1;
      if (pd > 0) { const p = P.S([3, 2]); ring(ctx, p, prog(t, T.chainJ[1], T.chainJ[1] + 0.8), { color: C.ink, r1: 56, width: 4 });
        ctx.save(); ctx.globalAlpha = alpha * pd; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        tag('(3, 2)', p[0] + 20, p[1] - 30, { a: alpha * pd, px: 38 }); }
    }

    // ---- C06：落点目标 + 引导弧（C07 到达后淡出）----
    const tI = P.S([2, 1], I2), tJ = P.S([-1, 1], I2);
    const arrive = smooth(prog(t, T.fwd[1] - 0.3, T.fwd[1] + 0.2));
    const tgtA = (1 - arrive) * (t < T.rev[0] ? 1 : 0);
    const tipI0 = P.S([1, 0], I2), tipJ0 = P.S([0, 1], I2);
    arcGuide(ctx, tipI0, tI, { bend: -0.35, color: C.i, width: 3, alpha: alpha * tgtA, grow: prog(t, T.iTarget, T.iTarget + 0.45) });
    target(ctx, tI, { color: C.i, alpha: alpha * tgtA, s: prog(t, T.iTarget + 0.25, T.iTarget + 0.55) });
    arcGuide(ctx, tipJ0, tJ, { bend: 0.35, color: C.j, width: 3, alpha: alpha * tgtA, grow: prog(t, T.jTarget, T.jTarget + 0.45) });
    target(ctx, tJ, { color: C.j, alpha: alpha * tgtA, s: prog(t, T.jTarget + 0.25, T.jTarget + 0.55) });

    // ---- 基向量 ----
    const bump = t0 => 1 + 0.5 * pulse(t, t0, 0.7);
    const wI = 7.5 * bump(T.under) * bump(T.track), wJ = 7.5 * bump(T.under) * bump(T.track + 0.25);
    const tipI = P.S([1, 0]), tipJ = P.S([0, 1]);
    const basisA = (1 - smooth(prog(t, T.chainI[0] - 0.2, T.chainI[0] + 0.2)) * 0.6 * clr1) * (1 - smooth(prog(t, c09.s - 0.2, c09.s + 0.2)) * 0.6);
    arrow(ctx, O, tipJ, { color: C.j, width: wJ, head: 24, alpha: alpha * basisA, grow: smooth(prog(t, ...T.jGrow)) });
    arrow(ctx, O, tipI, { color: C.i, width: wI, head: 24, alpha: alpha * basisA, grow: smooth(prog(t, ...T.iGrow)) });
    const hatA = (1 - smooth(prog(t, c09.s - 0.3, c09.s + 0.1))) * basisA;
    lab('ihat', tipI[0] + 24, tipI[1] + 46, 66, alpha * hatA * smooth(prog(t, T.iGrow[1] - 0.15, T.iGrow[1] + 0.2)));
    lab('jhat', tipJ[0] - 46, tipJ[1] - 8, 66, alpha * hatA * smooth(prog(t, T.jGrow[1] - 0.15, T.jGrow[1] + 0.2)));
    // (1,0)、(0,1) 坐标小标签，C03 开始前淡出
    const tagOut = 1 - smooth(prog(t, T.c32 - 0.3, T.c32));
    tag('(1, 0)', tipI[0] + 4, tipI[1] + 100, { color: C.i, px: 30, a: alpha * tagOut * smooth(prog(t, T.iTag, T.iTag + 0.3)), align: 'center' });
    tag('(0, 1)', tipJ[0] - 120, tipJ[1] - 10, { color: C.j, px: 30, a: alpha * tagOut * smooth(prog(t, T.jTag, T.jTag + 0.3)) });

    // ---- 落点坐标标签（C08 时飞进矩阵 A 的列）----
    const colLabel = (key, at, side, t0, fly) => {
      const a = smooth(prog(t, t0 + 0.3, t0 + 0.6)); if (a <= 0 || t > fly[1]) return;
      const pl = tex.place(key, at[0] + side * 34, at[1] - 40, 52, side > 0 ? 'l' : 'r');
      const f = smoother(prog(t, ...fly));
      if (f <= 0) { tex.draw(ctx, pl, { alpha: alpha * a, halo: C.paperHi }); return; }
      const col = key === 'iland' ? ['e11', 'e21'] : ['e12', 'e22'];
      const gA = colBox(col), n0 = tex.groupBox(pl, 'n');
      const px = lerp(52, 70, f);
      const nx = lerp(n0.x, gA.x, f), ny = lerp(n0.y, gA.y, f);
      const pl2 = tex.place(key, 0, 0, px, 'c'), n2 = tex.groupBox(pl2, 'n');
      pl2.ox += nx - n2.x; pl2.oy += ny - n2.y;
      const fade = 1 - smooth(prog(t, fly[1] - 0.12, fly[1] + 0.02));
      tex.draw(ctx, pl2, { alpha: alpha * fade, cls: { n: 1 }, restAlpha: 1 - smooth(prog(t, fly[0] + 0.2, fly[1] - 0.15)), halo: C.paperHi });
    };
    colLabel('iland', tI, 1, T.iTarget, T.iFly);
    colLabel('jland', tJ, -1, T.jTarget, T.jFly);

    // ---- 向量 v 与配方 ----
    const vA = smooth(prog(t, ...T.vGrow)) * (1 - smooth(prog(t, T.to3d[0], T.to3d[1])));
    if (vA > 0) {
      const vS = smooth(prog(t, T.fwd2[1] - 0.1, T.fwd2[1] + 0.3));
      if (vS > 0) arrow(ctx, O, P.S([1, 2], I2), { color: C.ink, width: 4, head: 18, alpha: alpha * 0.3 * vS, halo: null, dash: [10, 8] });
      // 配方：1 个 î、2 个 ĵ 首尾相接，按当前矩阵画，所以变换时跟着走
      const c1 = smooth(prog(t, ...T.comp1));
      if (c1 > 0) arrow(ctx, O, P.S([1, 0]), { color: C.i, width: 9 * bump(T.col1), head: 26, grow: c1, alpha });
      for (let k = 0; k < 2; k++) {
        const g = smooth(prog(t, T.comp2[0] + k * 0.3, T.comp2[0] + k * 0.3 + 0.4));
        if (g > 0) arrow(ctx, P.S([1, k]), P.S([1, k + 1]), { color: C.j, width: 9 * bump(T.col2), head: 26, grow: g, alpha });
      }
      const m1 = P.S([0.5, 0]), m2 = P.S([1, 1]);
      tag('×1', m1[0], m1[1] + 40, { color: C.i, a: alpha * smooth(prog(t, T.comp1[1] - 0.2, T.comp1[1] + 0.1)), align: 'center' });
      tag('×2', m2[0] + 26, m2[1], { color: C.j, a: alpha * smooth(prog(t, T.comp2[1] - 0.2, T.comp2[1] + 0.1)) });
      const tipV = P.S([1, 2]);
      arrow(ctx, O, tipV, { color: C.vec, width: 8, head: 26, alpha: alpha * vA, grow: smooth(prog(t, ...T.vGrow)) });
      lab('vb', tipV[0] - 40, tipV[1] - 34, 64, alpha * vA * smooth(prog(t, T.vGrow[1] - 0.2, T.vGrow[1] + 0.1)));
      const ld = smooth(prog(t, T.land - 0.05, T.land + 0.3)) * vA;
      ring(ctx, tipV, prog(t, T.land, T.land + 0.8), { color: C.ink, r1: 64, width: 4 });
      if (ld > 0) tex.draw(ctx, tex.place('res', tipV[0] + 40, tipV[1] - 10, 52, 'l'), { alpha: alpha * ld, halo: C.paperHi });
    }
    ctx.restore();
  }

  // ---------- 左栏 ----------
  const plA = tex.place('A', LX, 235, 70, 'l');
  const colBox = names => {
    const bs = names.map(n => tex.groupBox(plA, n));
    const x0 = Math.min(...bs.map(b => b.x - b.w / 2)), x1 = Math.max(...bs.map(b => b.x + b.w / 2)), y0 = Math.min(...bs.map(b => b.y - b.h / 2)), y1 = Math.max(...bs.map(b => b.y + b.h / 2));
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, x0, x1, y1 };
  };
  const plIB = tex.place('ibasis', LX, 230, 60, 'l'), plJB = tex.place('jbasis', LX + 330, 230, 60, 'l');
  const plC32 = tex.place('c32', LX, 400, 62, 'l');
  const plV = tex.place('v', LX, 430, 58, 'l');
  const plVC = tex.place('vcomb', LX, 430, 60, 'l');
  const plAv = tex.place('Av', LX, 430, 54, 'l');
  const plAv2 = (() => { const e1 = tex.groupBox(plAv, 'eq'), pl = tex.place('Av2', 0, 560, 54, 'l'), e2 = tex.groupBox(pl, 'eq'); pl.ox += e1.x - e2.x; return pl; })();
  const plA3 = tex.place('A3', LX, 300, 64, 'l');

  function drawRules(t) {
    const a = smooth(prog(t, c04.s - 0.1, c04.s + 0.4)) * (1 - smooth(prog(t, ...T.rulesOut))); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.textBaseline = 'middle';
    ctx.font = F.serif(48); ctx.fillStyle = C.ink; ctx.fillText('线性变换的三条规矩', LX, 200);
    ctx.fillStyle = C.peri; ctx.fillRect(LX, 238, 120 * smooth(prog(t, c04.s, c04.s + 0.6)), 5);
    const items = [['直线还是直线', T.rule1], ['平行且等距', T.rule2], ['原点不动', T.rule3]];
    items.forEach(([s, t0], k) => {
      const g = smooth(prog(t, t0 - 0.15, t0 + 0.25)); if (g <= 0) return;
      const y = 310 + k * 78, dx = (1 - outCubic(g)) * -30;
      ctx.globalAlpha = a * g;
      star4(ctx, LX + 18 + dx, y, 14 * outBack(g, 2), C.peri);
      ctx.font = F.sans(42); ctx.fillStyle = C.ink; ctx.fillText(s, LX + 50 + dx, y);
    });
    // C05：结论
    const k5 = smooth(prog(t, T.track - 0.2, T.track + 0.3));
    if (k5 > 0) { ctx.globalAlpha = a * k5; ctx.font = F.sans(40, 700); ctx.fillStyle = C.peri; ctx.fillText('→ 只需追踪 î 和 ĵ', LX, 310 + 3 * 78 + 10); }
    ctx.restore();
  }

  function drawLeft(t) {
    // C02 / C03
    const out1 = 1 - smooth(prog(t, ...T.clear1));
    if (out1 > 0) {
      if (t > T.iTag - 0.2) tex.draw(ctx, plIB, { alpha: out1, reveal: prog(t, T.iTag - 0.2, T.iTag + 0.5) });
      if (t > T.jTag - 0.2) tex.draw(ctx, plJB, { alpha: out1, reveal: prog(t, T.jTag - 0.2, T.jTag + 0.5) });
      if (t > T.c32 - 0.1) {
        const g = n => smooth(prog(t, n, n + 0.4));
        tex.draw(ctx, plC32, { alpha: out1, cls: { p0: g(T.c32 - 0.1), p1: g(T.chainI[0]), p2: g(T.chainJ[0]) }, restAlpha: 0 });
      }
    }
    drawRules(t);
    const out = 1 - smooth(prog(t, T.to3d[0], T.to3d[1] - 0.1));
    // A：先写 "A =" 与括号，再接住飞来的两列
    const aw = smooth(prog(t, ...T.aWrite)) * out;
    if (aw > 0) {
      const e1 = smooth(prog(t, T.iFly[1] - 0.1, T.iFly[1] + 0.02)), e2 = smooth(prog(t, T.jFly[1] - 0.1, T.jFly[1] + 0.02));
      tex.draw(ctx, plA, { alpha: out, cls: { e11: e1, e21: e1, e12: e2, e22: e2 }, restAlpha: aw });
      for (const [names, col, d, hl] of [[['e11', 'e21'], C.i, 0, T.col1], [['e12', 'e22'], C.j, 0.15, T.col2]]) {
        const u = smooth(prog(t, T.under + d, T.under + d + 0.35)); if (u <= 0) continue;
        const b = colBox(names); ctx.save(); ctx.globalAlpha = out; ctx.fillStyle = col;
        const w = (b.w + 24) * u, th = 6 + 4 * pulse(t, hl, 0.7); ctx.fillRect(b.x - w / 2, b.y1 + 16, w, th);
        ctx.font = F.sans(28); ctx.textAlign = 'center'; ctx.globalAlpha = out * u; ctx.fillText(col === C.i ? 'î 落点' : 'ĵ 落点', b.x, b.y1 + 52); ctx.restore();
      }
    }
    // v → v = 1î + 2ĵ → Av
    const vIn = smooth(prog(t, T.vGrow[0] - 0.1, T.vGrow[0] + 0.4));
    const toComb = smooth(prog(t, T.comp1[0] - 0.4, T.comp1[0] - 0.05));
    const toAv = smooth(prog(t, c10.s - 0.3, c10.s + 0.1));
    if (vIn > 0 && toComb < 1) tex.draw(ctx, plV, { alpha: out * vIn * (1 - toComb), reveal: prog(t, T.vGrow[0] - 0.1, T.vGrow[0] + 0.5) });
    if (toComb > 0 && toAv < 1) {
      const g = n => smooth(prog(t, n, n + 0.4));
      tex.draw(ctx, plVC, { alpha: out * (1 - toAv), cls: { p0: toComb, p1: g(T.comp1[0]), p2: g(T.comp2[0]) }, restAlpha: 0 });
    }
    if (toAv > 0) {
      const g = n => smooth(prog(t, n, n + 0.4));
      tex.draw(ctx, plAv, { alpha: out, cls: { p0: toAv, p1: g(T.col1 - 0.1), p2: g(T.col2 - 0.1) }, restAlpha: 0 });
      tex.draw(ctx, plAv2, { alpha: out, reveal: prog(t, T.land, T.land + 0.45) });
    }
    // 三维矩阵
    const a3 = smooth(prog(t, T.to3d[1] - 0.1, T.to3d[1] + 0.5)) * (1 - smooth(prog(t, T.recap - 0.3, T.recap + 0.1)));
    if (a3 > 0) {
      tex.draw(ctx, plA3, { alpha: a3, reveal: prog(t, T.to3d[1] - 0.1, T.to3d[1] + 0.7) });
      const u = smooth(prog(t, T.col3, T.col3 + 0.35));
      if (u > 0) { const b = tex.groupBox(plA3, 'c3'); ctx.save(); ctx.globalAlpha = a3; ctx.fillStyle = C.k; const w = (b.w + 26) * u; ctx.fillRect(b.x - w / 2, b.y + b.h / 2 + 18, w, 6); ctx.restore();
        ring(ctx, [b.x, b.y], prog(t, T.col3, T.col3 + 0.8), { color: C.k, r0: 40, r1: 120, width: 4 }); }
      ctx.save(); ctx.font = F.sans(36); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a3 * smooth(prog(t, T.col3 + 0.2, T.col3 + 0.6));
      ctx.fillText('三列 = 三个基向量的落点', LX + 2, 300 + plA3.h / 2 + 72); ctx.restore();
    }
    // 总结
    const rc = smooth(prog(t, T.recap, T.recap + 0.5));
    if (rc > 0) {
      ctx.save(); ctx.globalAlpha = rc; ctx.textBaseline = 'middle';
      ctx.font = F.serif(56); ctx.fillStyle = C.ink; ctx.fillText('矩阵的每一列', LX, 250);
      ctx.fillText('= 基向量的去向', LX, 336);
      ctx.fillStyle = C.peri; ctx.fillRect(LX, 386, 360 * smooth(prog(t, T.recap + 0.3, T.recap + 0.9)), 6);
      ctx.restore();
    }
  }

  function draw3D(t, D, alpha) {
    if (alpha <= 0) return;
    const cm = smoother(prog(t, ...T.cam));
    const el = lerp(89, 27, cm), az = lerp(-90, -58, cm) + Math.max(0, t - T.cam[1]) * 5;
    const M = mlerp3(A3, smoother(prog(t, ...T.fwd3)));
    const cv = S3.render({ M, el, az, dist: lerp(16.8, 9.2, cm), target: [lerp(0, 0.75, cm), 0.6, lerp(0, 0.75, cm)],
      cubeA: smooth(prog(t, T.to3d[0] + 0.3, T.to3d[1] + 0.3)), arrowGrow: smooth(prog(t, T.to3d[0], T.to3d[1])) });
    ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(cv, D.x - 520, D.y - 520, 1040, 1040); ctx.restore();
  }

  function drawOutro(t) {
    const a = smooth(prog(t, T.outro, T.outro + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; dotted(ctx, 'LINEAR', 960, 1016, 34, C.peri, { rule: 150 * a }); ctx.restore();
  }

  // ---------- 角色差分 ----------
  // 每位角色的差分按台词 pose 切换：换差分前 0.25 s 开始交叉淡化 0.2 s，并小跳一下
  const poseSeq = spk => TL.seq.filter(x => x.spk === spk).map(x => ({ t: x.s - 0.25, pose: ln[x.id].pose }));
  const extra = { C: [{ t: d04.s - 0.1, pose: 'claude_smile' }] };
  const seqs = Object.fromEntries(['C', 'D', 'G'].map(s => [s, [...poseSeq(s), ...(extra[s] || [])].sort((a, b) => a.t - b.t)]));
  function poseAt(spk, t) {
    const q = seqs[spk]; let k = 0; for (let i = 0; i < q.length; i++) if (t >= q[i].t) k = i;
    const cur = q[k], prev = q[k - 1];
    const m = prev && prev.pose !== cur.pose ? smooth((t - cur.t) / 0.2) : 1;
    return { cur: cur.pose, prev: prev && prev.pose !== cur.pose ? prev.pose : null, m, pop: prev && prev.pose !== cur.pose ? pulse(t, cur.t, 0.35) : 0 };
  }
  function drawChar(t, spk, o) {
    const p = poseAt(spk, t);
    if (p.prev && p.m < 1) cast.draw(ctx, t, { ...o, name: p.prev, alpha: 1 - p.m, pop: p.pop, noDisc: true });
    cast.draw(ctx, t, { ...o, name: p.cur, alpha: p.m, pop: p.pop });
  }
  const discOf = (r, dy, col) => ({ r, dy, color: mixColor(col, C.paper, 0.72) });

  // ---------- 主绘制 ----------
  function draw(t) {
    stage.bg();
    const D = discAt(t);
    drawDisc(t, D);
    cornerMark(ctx, '第一章 · 预览', prog(t, 0.2, 1.3));
    drawTitle(t);
    const a3 = smooth(prog(t, ...T.to3d));
    drawPlane2D(t, D, 1 - a3);
    draw3D(t, D, a3);
    drawPile(t);
    drawLeft(t);
    // 角色
    cast.draw(ctx, t, { name: 'ds_ask', spk: 'D', x: 1290, y: 1110, h: 1000, in: [0.35, 1.15], out: [c01.s - 0.8, c01.s - 0.15], from: 'bottom' });
    drawChar(t, 'C', { spk: 'C', x: 250, y: 1095, h: 470, in: [c01.s - 0.3, c01.s + 0.45], from: 'left', disc: discOf(185, 290, C.claude) });
    drawChar(t, 'D', { spk: 'D', x: 1735, y: 1095, h: 500, in: [d02.s - 0.45, d02.s + 0.2], out: [c05.s + 0.4, c05.s + 1.0], from: 'right', disc: discOf(185, 300, C.ds), phase: 1.3 });
    drawChar(t, 'D', { spk: 'D', x: 1735, y: 1095, h: 500, in: [d03.s - 0.55, d03.s + 0.1], out: [c10.e + 0.1, c10.e + 0.7], from: 'right', disc: discOf(185, 300, C.ds), phase: 1.3 });
    cast.draw(ctx, t, { name: 'gpt_proud', spk: 'G', x: 1715, y: 1095, h: 470, in: [g01.s - 0.6, g01.s + 0.1], out: [d04.s - 0.7, d04.s - 0.2], from: 'right', disc: discOf(200, 290, C.gpt), phase: 2.1 });
    cast.draw(ctx, t, { name: 'ds_happy', spk: 'D', x: 1725, y: 1095, h: 520, in: [d04.s - 0.45, d04.s + 0.15], from: 'right', disc: discOf(190, 300, C.ds), phase: 0.7 });
    subtitle(ctx, t, TL);
    drawOutro(t);
  }
  return { TL, draw };
}
