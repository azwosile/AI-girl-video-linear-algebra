// 第 1 章 · 30 秒样片「矩阵即变换」
// 分镜：
//   开场   海报构图：大肥鱼半身 + 大圆 + 加点标题
//   D01    一堆数字漂在左侧（"矩阵不就是一堆数字？"）
//   C01    数字飞进大圆化成网格；平面轻轻变形一下预告
//   C02    î、ĵ 长出，标出落点 (2,1)、(−1,1)
//   C03    整张网格跟着变换；高亮一条直线、原点脉冲
//   C04    落点坐标飞进矩阵 A 的两列
//   D02    平面复原，向量 v 出现
//   C05    v 跟着变换；1·第一列 + 2·第二列 首尾相接 → (0,3)；左侧公式同步书写
//   G01    大圆内切到 three.js 三维：相机从俯视转到斜视，单位立方体随 3×3 矩阵变换
import { C, F, W, H } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mixColor, mlerp2, mlerp3, apply2 } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow, arcGuide, target, ring } from '../../engine/la2d/plane.js';
import { morphTex } from '../../engine/tex/tex.js';
import { Space3D } from '../../engine/la3d/space3d.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';

export const assets = { chars: ['claude_explain', 'deepseek_ask', 'gpt_proud'] };

const A = [[2, -1], [1, 1]];
const A3 = [[1, 1, 0], [0, 1, 1], [1, 0, 1]];
const I2 = [[1, 0], [0, 1]];
const DISC_FILL = mixColor(C.peri, C.paper, 0.22);

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 1.5,
    pre: { C01: 0.5, C03: 0.3, C04: 0.3, D02: 0.2, C05: 0.5, G01: 0.6 },
    post: { G01: 1.5 }, tail: 1.0,
  });
  const L = TL.L;
  const d01 = L('D01'), c01 = L('C01'), c02 = L('C02'), c03 = L('C03'), c04 = L('C04'), d02 = L('D02'), c05 = L('C05'), g01 = L('G01');
  const cast = new Cast(R.envelope, TL);
  for (const n of assets.chars) cast.add(n, R.img[n]);
  const P = new Plane({ ox: 1180, oy: 600, u: 100, R: 9 });
  const S3 = new Space3D(900, { R: 4 });

  // ---------- 关键时刻 ----------
  const T = {
    iGrow: [c02.s + 0.05, c02.s + 0.55], jGrow: [c02.s + 0.35, c02.s + 0.85],
    iTarget: c02.s + 1.3, jTarget: c02.s + 2.45,
    fwd: [c03.s + 0.05, c03.s + 1.75],
    lineHi: [c03.s - 0.15, c03.s + 0.35], origin: c03.s + 2.3,
    aWrite: [c04.s - 0.1, c04.s + 0.5], iFly: [c04.s + 0.45, c04.s + 1.25], jFly: [c04.s + 0.8, c04.s + 1.6], under: c04.s + 1.7,
    rev: [d02.s, d02.s + 1.0], vGrow: [d02.s + 1.05, d02.s + 1.55],
    fwd2: [c05.s + 0.05, c05.s + 1.0], comp1: [c05.s + 1.1, c05.s + 1.6], comp2: [c05.s + 2.0, c05.s + 2.75], land: c05.s + 3.0,
    to3d: [g01.s - 0.65, g01.s - 0.05], cam: [g01.s - 0.55, g01.s + 1.3], fwd3: [g01.s + 0.45, g01.s + 1.85], col3: g01.s + 1.35,
    outro: g01.e + 0.45,
  };
  // 音效登记（mix.py 读取 TIMELINE.sfx）
  TL.sfx('swoosh_in', 0.3, 0.45);
  [0, 1, 2, 3].forEach(k => TL.sfx('pop', d01.s + 0.2 + k * 0.18, 0.35));
  TL.sfx('whoosh', c01.s - 0.45, 0.4);
  TL.sfx('pluck', T.iGrow[0], 0.5); TL.sfx('pluck', T.jGrow[0], 0.45);
  TL.sfx('tick', T.iTarget, 0.4); TL.sfx('tick', T.jTarget, 0.4);
  TL.sfx('swell', T.fwd[0], 0.45);
  TL.sfx('pop', T.iFly[1], 0.35); TL.sfx('pop', T.jFly[1], 0.35);
  TL.sfx('swell', T.rev[0], 0.3);
  TL.sfx('pluck', T.vGrow[0], 0.45);
  TL.sfx('swell', T.fwd2[0], 0.35);
  TL.sfx('tick', T.comp1[0], 0.35); TL.sfx('tick', T.comp2[0], 0.35);
  TL.sfx('ding_hi', T.land, 0.45);
  TL.sfx('whoosh', T.to3d[0], 0.4);
  TL.sfx('swell', T.fwd3[0], 0.45);
  TL.sfx('shimmer', T.outro, 0.4);

  // 平面当前的变换进度 sA（0 = 恒等，1 = A）
  const sAat = t => {
    const tease = 0.42 * Math.sin(Math.PI * smooth(prog(t, c01.s + 1.3, c01.e + 0.2)));
    if (t < T.fwd[0]) return tease;
    if (t < T.rev[0]) return smoother(prog(t, ...T.fwd));
    if (t < T.fwd2[0]) return 1 - smoother(prog(t, ...T.rev));
    return smoother(prog(t, ...T.fwd2));
  };
  // 大圆舞台
  const discAt = t => {
    const r0 = 400 * outCubic(prog(t, 0.05, 0.9));
    const m = smoother(prog(t, c01.s - 0.7, c01.s + 0.35));
    return { x: lerp(1260, 1180, m), y: lerp(500, 540, m), r: lerp(r0, 450, m) };
  };

  // ---------- 各层 ----------
  function drawDisc(t, D) {
    if (D.r <= 0) return;
    ctx.save(); ctx.fillStyle = DISC_FILL; ctx.beginPath(); ctx.arc(D.x, D.y, D.r, 0, Math.PI * 2); ctx.fill();
    // 外圈细线 + 绕行的四角星
    const sw = smooth(prog(t, 0.4, 1.7)); if (sw > 0) {
      const a0 = -Math.PI / 2 + t * 0.12, a1 = a0 + sw * Math.PI * 1.55, rr = D.r + 20;
      ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.45; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(D.x, D.y, rr, a0, a1); ctx.stroke();
      ctx.globalAlpha = 1; star4(ctx, D.x + rr * Math.cos(a1), D.y + rr * Math.sin(a1), 13, C.peri);
    }
    ctx.restore();
  }

  function drawTitle(t) {
    const a = 1 - smooth(prog(t, c01.s - 0.5, c01.s + 0.1)); if (a <= 0) return;
    const m = smoother(prog(t, d01.s - 0.3, d01.s + 0.4)); // 让位给数字堆：上移缩小
    const x = 175, y = lerp(440, 215, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与线性变换', 4, -128);
    ctx.font = F.serif(108); ctx.textBaseline = 'alphabetic';
    let cx = 0; const title = '矩阵即变换';
    [...title].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.09, 0.62 + i * 0.09), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc);
        ctx.fillStyle = C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 6;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.8, 1.3));
    dotted(ctx, 'MATRIX', cx / 2, 62, 30, C.peri, { rule: 70 * smooth(prog(t, 0.9, 1.5)) });
    ctx.restore();
  }

  function drawPile(t) {
    if (t < d01.s || t > c01.s + 0.6) return;
    const fly = smoother(prog(t, c01.s - 0.55, c01.s + 0.45));
    const pl = tex.place('pile', lerp(470, P.ox, fly), lerp(660, P.oy - 40, fly), lerp(88, 260, fly), 'c');
    const cls = {}, shift = {};
    ['e11', 'e12', 'e21', 'e22'].forEach((n, k) => {
      const s = prog(t, d01.s + 0.2 + k * 0.18, d01.s + 0.55 + k * 0.18);
      cls[n] = smooth(s * 1.4) * (1 - fly);
      const wob = 1 - fly;
      shift[n] = [Math.sin(t * 1.9 + k * 1.7) * 9 * wob, (1 - outBack(s, 2)) * 40 + Math.cos(t * 1.4 + k) * 7 * wob];
    });
    tex.draw(ctx, pl, { cls, shift, restAlpha: 0 });
    // 问号
    const q = smooth(prog(t, d01.s + 1.2, d01.s + 1.6)) * (1 - fly);
    if (q > 0) { ctx.save(); ctx.globalAlpha = q; ctx.font = F.serif(90); ctx.fillStyle = C.peri; ctx.fillText('?', 640, 600 - 10 * Math.sin(t * 2)); ctx.restore(); }
  }

  function drawPlane2D(t, D, alpha) {
    if (t < c01.s - 0.2 || alpha <= 0) return;
    const sA = sAat(t), M = mlerp2(A, sA); P.M = M;
    const grow = prog(t, c01.s - 0.1, c01.s + 1.2);
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip();
    P.grid(ctx, { M: I2, color: C.ink, width: 1.3, alpha: 0.13 * alpha, grow });
    P.grid(ctx, { M, color: C.paperHi, width: 2.4, alpha: 0.95 * alpha, grow });
    // "直线还是直线"
    const lh = smooth(prog(t, ...T.lineHi)) * (1 - smooth(prog(t, c04.s - 0.3, c04.s + 0.2)));
    if (lh > 0) P.line(ctx, [0, -1], [1, 1], { M, color: C.k, width: 5, alpha: alpha * lh, grow: lh });
    P.axes(ctx, { M: I2, color: C.ink, width: 2.6, alpha: 0.85 * alpha, grow: prog(t, c01.s + 0.1, c01.s + 1.1) });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = alpha;
    const O = P.S([0, 0]);
    // 落点目标 + 引导弧（在 C03 到达后淡出）
    const tI = P.S([2, 1], I2), tJ = P.S([-1, 1], I2);
    const arrive = smooth(prog(t, T.fwd[1] - 0.3, T.fwd[1] + 0.2));
    const tgtA = (1 - arrive) * (t < T.rev[0] ? 1 : 0);
    const tipI0 = P.S([1, 0], I2), tipJ0 = P.S([0, 1], I2);
    arcGuide(ctx, tipI0, tI, { bend: -0.35, color: C.i, alpha: alpha * tgtA, grow: prog(t, T.iTarget, T.iTarget + 0.45) });
    target(ctx, tI, { color: C.i, alpha: alpha * tgtA, s: prog(t, T.iTarget + 0.25, T.iTarget + 0.55) });
    arcGuide(ctx, tipJ0, tJ, { bend: 0.35, color: C.j, alpha: alpha * tgtA, grow: prog(t, T.jTarget, T.jTarget + 0.45) });
    target(ctx, tJ, { color: C.j, alpha: alpha * tgtA, s: prog(t, T.jTarget + 0.25, T.jTarget + 0.55) });
    // 基向量
    const bump = t0 => 1 + 0.45 * pulse(t, t0, 0.7);
    const wI = 7 * bump(T.under) * bump(T.comp1[0]), wJ = 7 * bump(T.under);
    const tipI = P.S([1, 0]), tipJ = P.S([0, 1]);
    const basisA = 1 - smooth(prog(t, c05.s + 0.9, c05.s + 1.1)) * 0.55; // C05 时退为配角
    arrow(ctx, O, tipJ, { color: C.j, width: wJ, head: 24, alpha: alpha * basisA, grow: smooth(prog(t, ...T.jGrow)) });
    arrow(ctx, O, tipI, { color: C.i, width: wI, head: 24, alpha: alpha * basisA, grow: smooth(prog(t, ...T.iGrow)) });
    const lab = (key, tip, dx, dy, a) => { if (a > 0) tex.draw(ctx, tex.place(key, tip[0] + dx, tip[1] + dy, 66, 'c'), { alpha: alpha * a, halo: C.paperHi }); };
    const hatA = 1 - smooth(prog(t, c05.s + 0.8, c05.s + 1.1));
    lab('ihat', tipI, 22, 44, smooth(prog(t, T.iGrow[1] - 0.15, T.iGrow[1] + 0.2)) * hatA);
    lab('jhat', tipJ, -44, -6, smooth(prog(t, T.jGrow[1] - 0.15, T.jGrow[1] + 0.2)) * hatA);
    // 落点坐标标签（C04 时飞走）
    const colLabel = (key, at, side, t0, fly) => {
      const a = smooth(prog(t, t0 + 0.3, t0 + 0.6)); if (a <= 0 || t > fly[1]) return;
      const pl = tex.place(key, at[0] + side * 34, at[1] - 40, 52, side > 0 ? 'l' : 'r');
      const f = smoother(prog(t, ...fly));
      if (f <= 0) { tex.draw(ctx, pl, { alpha: alpha * a, halo: C.paperHi }); return; }
      // 飞向矩阵 A 对应列
      const col = key === 'iland' ? ['e11', 'e21'] : ['e12', 'e22'];
      const gA = colBox(col), n0 = tex.groupBox(pl, 'n');
      const px = lerp(52, 66, f), k = px / 52;
      // 以数字分组中心对齐到矩阵列中心
      const nx = lerp(n0.x, gA.x, f), ny = lerp(n0.y, gA.y, f);
      const pl2 = tex.place(key, 0, 0, px, 'c'), n2 = tex.groupBox(pl2, 'n');
      pl2.ox += nx - n2.x; pl2.oy += ny - n2.y;
      const fade = 1 - smooth(prog(t, fly[1] - 0.12, fly[1] + 0.02));
      tex.draw(ctx, pl2, { alpha: alpha * fade, cls: { n: 1 }, restAlpha: 1 - smooth(prog(t, fly[0] + 0.2, fly[1] - 0.15)), halo: f < 0.5 ? C.paperHi : null });
    };
    colLabel('iland', tI, 1, T.iTarget, T.iFly);
    colLabel('jland', tJ, -1, T.jTarget, T.jFly);
    // 原点不动
    ring(ctx, O, prog(t, T.origin, T.origin + 0.7)); ring(ctx, O, prog(t, T.origin + 0.3, T.origin + 1.0));
    const od = win(t, T.origin - 0.1, T.origin + 1.1, 0.2, 0.3);
    if (od > 0) { ctx.fillStyle = C.ink; ctx.globalAlpha = alpha * od; ctx.beginPath(); ctx.arc(O[0], O[1], 7, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = alpha; }
    // 向量 v
    const vA = smooth(prog(t, ...T.vGrow));
    if (vA > 0) {
      const vS = smooth(prog(t, T.fwd2[1] - 0.1, T.fwd2[1] + 0.3));
      // 变换前的虚影
      if (vS > 0) arrow(ctx, O, P.S([1, 2], I2), { color: C.ink, width: 4, head: 18, alpha: alpha * 0.28 * vS, halo: null, dash: [10, 8] });
      // 1·第一列、2·第二列 首尾相接
      const c1 = smooth(prog(t, ...T.comp1)), c2 = prog(t, ...T.comp2);
      if (c1 > 0) arrow(ctx, O, P.S([2, 1], I2), { color: C.i, width: 9, head: 26, grow: c1, alpha });
      if (c2 > 0) {
        const m = smoother(c2), base = [lerp(0, 2, m), lerp(0, 1, m)], k = lerp(1, 2, smoother(prog(t, T.comp2[0] + 0.35, T.comp2[1])));
        arrow(ctx, P.S(base, I2), P.S([base[0] - k, base[1] + k], I2), { color: C.j, width: 9, head: 26, alpha });
        if (c2 > 0.55) { ctx.save(); ctx.font = F.sans(40, 700); ctx.fillStyle = C.j; ctx.globalAlpha = alpha * smooth((c2 - 0.55) / 0.3);
          const mid = P.S([1.3, 2.25], I2); ctx.lineWidth = 6; ctx.strokeStyle = C.paperHi; ctx.strokeText('×2', mid[0], mid[1]); ctx.fillText('×2', mid[0], mid[1]); ctx.restore(); }
      }
      if (c1 > 0.6) { ctx.save(); ctx.font = F.sans(40, 700); ctx.fillStyle = C.i; ctx.globalAlpha = alpha * smooth((c1 - 0.6) / 0.3);
        const mid = P.S([1.35, 0.25], I2); ctx.lineWidth = 6; ctx.strokeStyle = C.paperHi; ctx.strokeText('×1', mid[0], mid[1]); ctx.fillText('×1', mid[0], mid[1]); ctx.restore(); }
      const tipV = P.S([1, 2]);
      arrow(ctx, O, tipV, { color: C.ink, width: 8, head: 26, alpha, grow: vA });
      tex.draw(ctx, tex.place('vb', tipV[0] + 30 * (1 - vS) - 36 * vS, tipV[1] - 30 + 120 * vS, 64, 'c'), { alpha: alpha * smooth(prog(t, T.vGrow[1] - 0.2, T.vGrow[1] + 0.1)), halo: C.paperHi });
      // 落点 (0,3)
      const ld = smooth(prog(t, T.land - 0.05, T.land + 0.3));
      ring(ctx, tipV, prog(t, T.land, T.land + 0.8), { r1: 60, width: 4 });
      if (ld > 0) tex.draw(ctx, tex.place('res', tipV[0] - 34, tipV[1] + 4, 52, 'r'), { alpha: alpha * ld, halo: C.paperHi });
    }
    ctx.restore();
  }

  // 矩阵 A 放置（左栏）
  const plA = tex.place('A', 150, 245, 66, 'l');
  const colBox = names => {
    const bs = names.map(n => tex.groupBox(plA, n));
    const x0 = Math.min(...bs.map(b => b.x - b.w / 2)), x1 = Math.max(...bs.map(b => b.x + b.w / 2)), y0 = Math.min(...bs.map(b => b.y - b.h / 2)), y1 = Math.max(...bs.map(b => b.y + b.h / 2));
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, x0, x1, y1 };
  };
  const plV = tex.place('v', 150, 440, 58, 'l');
  const plAv = tex.place('Av', 150, 440, 56, 'l');
  // 第二行 "= [0;3]" 的等号对齐第一行的等号
  const plAv2 = (() => { const e1 = tex.groupBox(plAv, 'eq'), pl = tex.place('Av2', 0, 585, 56, 'l'), e2 = tex.groupBox(pl, 'eq'); pl.ox += e1.x - e2.x; return pl; })();
  const plA3 = tex.place('A3', 150, 330, 64, 'l');

  function drawLeft(t) {
    const out = 1 - smooth(prog(t, T.to3d[0], T.to3d[1] - 0.1));
    // A：先写 "A =" 与括号，再接住飞来的两列
    const aw = smooth(prog(t, ...T.aWrite)) * out;
    if (aw > 0) {
      const e1 = smooth(prog(t, T.iFly[1] - 0.1, T.iFly[1] + 0.02)), e2 = smooth(prog(t, T.jFly[1] - 0.1, T.jFly[1] + 0.02));
      tex.draw(ctx, plA, { alpha: out, cls: { e11: e1, e21: e1, e12: e2, e22: e2 }, restAlpha: aw });
      // 列下划线
      for (const [names, col, d] of [[['e11', 'e21'], C.i, 0], [['e12', 'e22'], C.j, 0.15]]) {
        const u = smooth(prog(t, T.under + d, T.under + d + 0.35)); if (u <= 0) continue;
        const b = colBox(names); ctx.save(); ctx.globalAlpha = out; ctx.fillStyle = col;
        const w = (b.w + 24) * u; ctx.fillRect(b.x - w / 2, b.y1 + 16, w, 6); ctx.restore();
      }
    }
    // v → Av
    const vIn = smooth(prog(t, T.vGrow[0] - 0.1, T.vGrow[0] + 0.4));
    if (vIn > 0 && t < T.comp1[0]) tex.draw(ctx, plV, { alpha: out * vIn * (1 - smooth(prog(t, c05.s + 0.6, c05.s + 0.95))), reveal: prog(t, T.vGrow[0] - 0.1, T.vGrow[0] + 0.5) });
    if (t > c05.s + 0.6) {
      const g = n => smooth(prog(t, n, n + 0.4));
      tex.draw(ctx, plAv, { alpha: out, cls: { p0: g(c05.s + 0.7), p1: g(T.comp1[0]), p2: g(T.comp2[0] + 0.1) }, restAlpha: 0 });
      tex.draw(ctx, plAv2, { alpha: out, reveal: prog(t, T.land, T.land + 0.45) });
    }
    // 三维矩阵
    const a3 = smooth(prog(t, T.to3d[1] - 0.1, T.to3d[1] + 0.5));
    if (a3 > 0) {
      tex.draw(ctx, plA3, { reveal: prog(t, T.to3d[1] - 0.1, T.to3d[1] + 0.7) });
      const u = smooth(prog(t, T.col3, T.col3 + 0.35));
      if (u > 0) { const b = tex.groupBox(plA3, 'c3'); ctx.save(); ctx.fillStyle = C.k; const w = (b.w + 26) * u; ctx.fillRect(b.x - w / 2, b.y + b.h / 2 + 18, w, 6); ctx.restore();
        ring(ctx, [b.x, b.y], prog(t, T.col3, T.col3 + 0.8), { color: C.k, r0: 40, r1: 120, width: 4 }); }
      ctx.save(); ctx.font = F.sans(36); ctx.fillStyle = C.inkMid; ctx.globalAlpha = smooth(prog(t, T.col3 + 0.2, T.col3 + 0.6));
      ctx.fillText('三列 = 三个基向量的落点', 152, 330 + plA3.h / 2 + 72); ctx.restore();
    }
  }

  function draw3D(t, D, alpha) {
    if (alpha <= 0) return;
    const cm = smoother(prog(t, ...T.cam));
    const el = lerp(89, 27, cm), az = lerp(-90, -58, cm) + Math.max(0, t - T.cam[1]) * 5;
    const M = mlerp3(A3, smoother(prog(t, ...T.fwd3)));
    const cv = S3.render({ M, el, az, dist: lerp(16.8, 9.2, cm), target: [lerp(0, 0.75, cm), lerp(0.6, 0.6, cm), lerp(0, 0.75, cm)],
      cubeA: smooth(prog(t, T.to3d[0] + 0.3, T.to3d[1] + 0.3)), arrowGrow: smooth(prog(t, T.to3d[0], T.to3d[1])) });
    ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(cv, D.x - 450, D.y - 450, 900, 900); ctx.restore();
  }

  function drawOutro(t) {
    const a = smooth(prog(t, T.outro, T.outro + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; dotted(ctx, 'LINEAR', 960, 1016, 34, C.peri, { rule: 150 * a }); ctx.restore();
  }

  // ---------- 主绘制 ----------
  function draw(t) {
    stage.bg();
    const D = discAt(t);
    drawDisc(t, D);
    cornerMark(ctx, '第一章 · 样片', prog(t, 0.2, 1.3));
    drawTitle(t);
    const a3 = smooth(prog(t, ...T.to3d));
    drawPlane2D(t, D, 1 - a3);
    draw3D(t, D, a3);
    drawPile(t);
    drawLeft(t);
    // 角色
    cast.draw(ctx, t, { name: 'deepseek_ask', spk: 'D', x: 1250, y: 1100, h: 980, in: [0.35, 1.15], out: [c01.s - 0.8, c01.s - 0.15], from: 'bottom' });
    cast.draw(ctx, t, { name: 'claude_explain', spk: 'C', x: 205, y: 1095, h: 440, in: [c01.s - 0.3, c01.s + 0.45], from: 'left',
      disc: { r: 165, dy: 285, color: C.claudeLt } });
    cast.draw(ctx, t, { name: 'deepseek_ask', spk: 'D', x: 1730, y: 1095, h: 480, in: [d02.s - 0.4, d02.s + 0.2], out: [g01.s - 1.25, g01.s - 0.7], from: 'right',
      disc: { r: 180, dy: 300, color: C.dsLt }, phase: 1.3 });
    cast.draw(ctx, t, { name: 'gpt_proud', spk: 'G', x: 1715, y: 1095, h: 490, in: [g01.s - 0.55, g01.s + 0.15], from: 'right',
      disc: { r: 185, dy: 300, color: C.gpt }, phase: 2.1 });
    subtitle(ctx, t, TL);
    drawOutro(t);
  }
  return { TL, draw };
}
