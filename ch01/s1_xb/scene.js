// 第 1 章 复习（下）期中真题（北京交通大学 历年期中卷）。
// 第 1 题 含参方程组：增广矩阵消元 → 分三种情况 → 3D：α 从 2 滑到 8，α₂ 躺进 α₁、α₃ 张成的平面；β 滑到 1，b 落进平面。
// 第 2 题 LU：三步消元 → 乘数抄进 L → 初等矩阵表示（顺序陷阱 + 袜子鞋子）。
// 第 3 题 证明可逆：凑 A·(…) = I；AB = 4I；为什么一边就够。收尾：行列式预告（面积放大倍数）。
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'ds_shock', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const OK = '#4FC1A6';

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.8, C05: 0.4, C08: 0.6, C10: 0.3, C11: 0.9, C13: 0.3, C14: 0.3, C16: 0.3, C17: 0.9, C19: 0.4, C20: 0.3, D08: 0.6, C22: 0.4 },
    post: { C03: 0.5, C07: 0.6, C09: 0.6, C10: 0.5, G01: 0.5, C13: 0.6, C15: 0.5, C16: 0.6, C19: 0.6, G02: 0.4, C20: 0.6 }, tail: 0.8,
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

  const T = {
    bj: cue('C01', '北京交通大学'), k1: cue('C01', '含参数的方程组'), k2: cue('C01', 'L U分解'), k3: cue('C01', '证明矩阵可逆'),
    q1: L('C02').s - 0.4, cols: cue('C02', '三列'), par: cue('C02', '藏着一个参数'), rb: cue('C02', '右边b'), ask1: cue('C03', 'A可逆'), ask2: cue('C03', '无穷多解'),
    d2: cue('D02', '第二行减第一行'), d2a: cue('D02', '阿尔法减二'), d2x: cue('D02', '不可逆'),
    wait: L('C04').s, below: cue('C04', '下面的行'),
    r3a: cue('C05', '第三行减二倍第一行'), r3b: cue('C05', '再加上第二行'), r3c: cue('C05', '第三行变成'),
    cs1: cue('C06', '如果阿尔法不等于八'), piv3: cue('C06', '三个主元齐了'),
    cs2: cue('C07', '如果阿尔法等于八'), cs2b: cue('C07', '贝塔不等于一'), cs3: cue('C07', '贝塔等于一，才有解'),
    geo: L('C08').s - 0.3, rel: cue('C08', '阿尔法二等于负'), flat: cue('C08', '三列躺进同一个平面'),
    bin: cue('C09', '也必须落在'), bsl: cue('C09', '算一下'), b1: cue('C09', '要求贝塔等于一'),
    gen: cue('C10', '通解'), dirn: cue('C10', '后面这个方向'), det: cue('G01', '行列式算'),
    q2: L('C11').s - 0.5, luA: cue('C11', 'L U分解'), emx: cue('C11', '初等矩阵'),
    s1: cue('D04', '第二行加第一行'), s2: cue('D04', '第三行加第一行'), s3: cue('D04', '再第三行加二倍第二行'), gotU: cue('D04', '得到U'),
    diag: cue('C12', '对角线'), mul: cue('C12', '乘数呢'), m1: cue('C12', '所以L里填负一'),
    m3: cue('C13', '三个乘数'), chk: cue('C13', '逐行验算'),
    d5: cue('D05', '所以A等于'), rev: cue('C14', '顺序反了'), e1r: cue('C14', '先做的E一'), undo: cue('C14', '从左边'),
    sock: cue('C15', '先穿袜子'), off: cue('C15', '脱的时候'), right: cue('C15', '所以A等于'), neg: cue('C15', '把乘数变号'),
    isL: cue('C16', '乘出来正好就是L'),
    q3: L('C17').s - 0.5, prove: cue('C17', '证明A非奇异'), shock: L('D06').s,
    noel: cue('C18', '不用消元'), mv: cue('C18', '把三I移过去'),
    fac: cue('C19', '提出一个A'), div: cue('C19', '两边除以三'), inv: cue('C19', '逆矩阵直接写出来了'),
    tip: cue('G02', '快招'), y25: cue('G02', 'A B等于四I'), why: L('D07').s,
    thm: cue('C20', '一点五节的定理'), binv: cue('C20', 'B可逆'), rmul: cue('C20', '两边右乘'),
    sum: L('D08').s - 0.3, z1: cue('D08', '含参数'), z2: cue('D08', 'L U把乘数'), z3: cue('D08', '证可逆'),
    fin: cue('C21', '第一章到这里'), nx: L('C22').s - 0.2, area: cue('C22', '放大了多少倍'), ok2: cue('C22', '可不可逆'),
  };
  const Q1E = T.q2 - 0.3, Q2E = T.q3 - 0.3, Q3E = T.sum;

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', 0.9, 0.25); TL.sfx('pop', T.k1, 0.25); TL.sfx('pop', T.k2, 0.25); TL.sfx('pop', T.k3, 0.25);
  TL.sfx('whoosh', T.q1, 0.3); TL.sfx('pluck', T.par, 0.3); TL.sfx('pluck', T.rb, 0.3);
  TL.sfx('pop', T.d2a, 0.28); TL.sfx('buzz', T.wait, 0.2); TL.sfx('swoosh_soft', T.r3a, 0.3); TL.sfx('swoosh_soft', T.r3b, 0.3); TL.sfx('ding_hi', T.r3c + 0.6, 0.3);
  TL.sfx('check', T.cs1, 0.3); TL.sfx('buzz', T.cs2b, 0.2); TL.sfx('check', T.cs3, 0.3);
  TL.sfx('warp', T.geo + 0.6, 0.3); TL.sfx('thud', T.flat, 0.3); TL.sfx('warp', T.bin + 0.4, 0.3); TL.sfx('ding_hi', T.b1, 0.3);
  TL.sfx('whoosh', T.q2, 0.3); [T.s1, T.s2, T.s3].forEach(x => TL.sfx('swoosh_soft', x, 0.3)); TL.sfx('pop', T.m1, 0.28); TL.sfx('ding_hi', T.chk + 0.5, 0.3);
  TL.sfx('stamp', T.rev, 0.36); TL.sfx('pluck', T.sock, 0.3); TL.sfx('pluck', T.off, 0.3); TL.sfx('check', T.right, 0.3); TL.sfx('sparkle', T.isL, 0.25);
  TL.sfx('whoosh', T.q3, 0.3); TL.sfx('sting', T.shock, 0.25); TL.sfx('swoosh_soft', T.mv, 0.3); TL.sfx('pop', T.fac, 0.28); TL.sfx('ding_hi', T.inv, 0.3);
  TL.sfx('bell_soft', T.tip, 0.3); TL.sfx('check', T.binv, 0.3);
  TL.sfx('ding_lo', T.sum + 0.3, 0.3); TL.sfx('warp', T.area, 0.3); TL.sfx('shimmer', L('C22').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  // ── 片头 ──
  function drawTitle() {
    const a = 1 - smooth(prog(t, T.q1 - 0.3, T.q1 + 0.3)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 复习', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'期中真题'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.07, 0.6 + i * 0.07), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 2 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'MIDTERM', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    // 盘里：三类题型卡片
    const ba = a * gin(T.bj, 0.5);
    K.tag('北京交通大学 · 线代期中 2015–2026', DX, DY - 230, { px: 32, a: ba, align: 'center', color: C.inkMid });
    [['含参数方程组', T.k1, C.i], ['LU 分解', T.k2, C.j], ['证明可逆', T.k3, C.k]].forEach(([s, t0, col], i) => {
      const g = gin(t0, 0.4); if (g <= 0) return; const y = DY - 110 + i * 110, sc = lerp(0.85, 1, outBack(g));
      ctx.save(); ctx.globalAlpha = a * g; ctx.translate(DX, y); ctx.scale(sc, sc);
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-230, -40, 460, 80, 14); ctx.stroke(); ctx.restore();
      K.tag(s, DX, y + 2, { px: 40, a: a * g, align: 'center', color: col, font: F.serif, w: 900 });
    });
  }

  // ── 气泡 / 印章 ──
  function bubble(x, y, text, a, col = C.ds) {
    if (a <= 0) return; ctx.save(); ctx.font = F.sans(32, 900); const w = ctx.measureText(text).width + 44;
    ctx.fillStyle = col; ctx.globalAlpha = a * 0.9; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 30, w, 60, 30); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w / 2 - 40, y + 28); ctx.lineTo(x + w / 2 - 10, y + 52); ctx.lineTo(x + w / 2 - 14, y + 26); ctx.fill();
    ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1); ctx.restore();
  }
  function cross(x, y, w, h, s, a) {
    if (s <= 0 || a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.free; ctx.lineWidth = 7; ctx.lineCap = 'round';
    const e = (u0, u1) => { ctx.beginPath(); ctx.moveTo(x - w / 2, y + (u0 ? -h / 2 : h / 2)); ctx.lineTo(lerp(x - w / 2, x + w / 2, u1), lerp(y + (u0 ? -h / 2 : h / 2), y + (u0 ? h / 2 : -h / 2), u1)); ctx.stroke(); };
    e(1, smooth(s * 2)); if (s > 0.5) e(0, smooth(s * 2 - 1)); ctx.restore();
  }

  // ── 3D 小工具（第 1 题）──
  function proj(v, yaw, ox, oy, u) {
    const [x, y, z] = v, c = Math.cos(yaw), s = Math.sin(yaw), pit = 0.4, cp = Math.cos(pit), sp = Math.sin(pit);
    const X = c * x - s * y, Y = s * x + c * y;            // 绕 z 轴转
    return [ox + u * X, oy - u * (z * cp - Y * sp)];        // 俯视一点
  }
  const A1 = [1, 1, 2], A3 = [1, 3, 0];
  function draw3D(a) {
    if (a <= 0) return;
    const yaw = -2.3 + 0.08 * Math.sin(t * 0.35), ox = DX + 20, oy = DY + 70, u = 62;
    const P = v => proj(v, yaw, ox, oy, u);
    const alpha = lerp(2, 8, smoother(prog(t, T.geo + 0.6, T.rel + 0.4)));
    const beta = lerp(3, 1, smoother(prog(t, T.bin + 0.4, T.b1)));
    const flatA = gin(T.flat, 0.5), pf = pulse(t, T.flat, 0.9);
    // 坐标轴
    [[6, 0, 0], [0, 9, 0], [0, 0, 5]].forEach((e, i) => { arrow(ctx, P([0, 0, 0]), P(e), { color: C.inkMid, width: 2, head: 10, alpha: a * 0.45 }); });
    // 平面：s1 α₁ + s3 α₃
    const quad = [[-1, -0.8], [2, -0.8], [2, 2.6], [-1, 2.6]].map(([p, q]) => P([p * A1[0] + q * A3[0], p * A1[1] + q * A3[1], p * A1[2] + q * A3[2]]));
    ctx.save(); ctx.globalAlpha = a * (0.12 + 0.12 * flatA + 0.25 * pf); ctx.fillStyle = C.ink; ctx.beginPath(); quad.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = a * 0.35; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    const O = P([0, 0, 0]);
    const A2 = [2, alpha, -2];
    arrow(ctx, O, P(A1), { color: C.i, width: 6, head: 18, alpha: a }); arrow(ctx, O, P(A3), { color: C.k, width: 6, head: 18, alpha: a });
    // α₂ 离平面的“影子高度”：沿法向 (−3, 1, 1) 的分量
    const off = (alpha - 8) / 11, foot = A2.map((v, i) => v - off * [-3, 1, 1][i]);
    if (Math.abs(alpha - 8) > 0.05) { ctx.save(); ctx.setLineDash([6, 8]); ctx.globalAlpha = a * 0.7; ctx.strokeStyle = C.j; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...P(A2)); ctx.lineTo(...P(foot)); ctx.stroke(); ctx.restore(); }
    arrow(ctx, O, P(A2), { color: C.j, width: 7, head: 20, alpha: a });
    const lab = (txt, v, col, dx = 10, dy = -8) => { const p = P(v); K.tag(txt, p[0] + dx, p[1] + dy, { px: 30, a, color: col, w: 900, font: F.serif }); };
    lab('α₁', A1, C.i); lab('α₃', A3, C.k, 12, 4); lab('α₂', A2, C.j, 12, -10);
    K.tag(`α = ${alpha.toFixed(1)}`, DX - 330, DY - 120, { px: 40, a: a * gin(T.geo + 0.4), color: Math.abs(alpha - 8) < 0.05 ? C.free : C.j, w: 900, font: F.serif });
    texAt('rel', DX, DY + 330, 40, { alpha: a * gin(T.rel) * (1 - gin(T.bin, 0.4)), halo: C.disc });
    K.tag('三列共面 → A 不可逆', DX + 230, DY - 210, { px: 32, a: a * flatA * (1 - gin(T.bin, 0.4)), align: 'center', color: C.free, w: 900 });
    // b
    const ba = a * gin(T.bin, 0.5);
    if (ba > 0) {
      const B = [1, 2, beta], offb = (beta - 1) / 11, fb = B.map((v, i) => v - offb * [-3, 1, 1][i]);
      if (Math.abs(beta - 1) > 0.03) { ctx.save(); ctx.setLineDash([6, 8]); ctx.globalAlpha = ba * 0.7; ctx.strokeStyle = C.peri; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...P(B)); ctx.lineTo(...P(fb)); ctx.stroke(); ctx.restore(); }
      arrow(ctx, O, P(B), { color: C.peri, width: 7, head: 20, alpha: ba }); lab('b', B, C.peri, 12, -6);
      K.tag(`β = ${beta.toFixed(1)}`, DX - 330, DY - 60, { px: 40, a: ba, color: Math.abs(beta - 1) < 0.03 ? OK : C.peri, w: 900, font: F.serif });
      texAt('brel', DX, DY + 320, 36, { alpha: ba * gin(T.bsl), halo: C.disc });
      K.tag('b 落进平面 → 有解', DX + 230, DY - 210, { px: 32, a: ba * gin(T.b1), align: 'center', color: OK, w: 900 });
    }
  }

  // ── 第 1 题 ──
  function drawQ1() {
    const a = win(t, T.q1, Q1E, 0.4, 0.4); if (a <= 0) return;
    K.tag('第 1 题 · 2025–2026 第 2 题', DX, DY - 380, { px: 30, a: a * gin(T.q1 + 0.1), align: 'center', color: C.peri, font: F.serif, w: 900 });
    // 题面
    const pa = a * (1 - gin(T.d2 - 0.3, 0.4));
    if (pa > 0) {
      texAt('q1', DX, DY - 170, 40, { alpha: pa * gin(T.cols), reveal: prog(t, T.cols, T.rb + 0.8) });
      texAt('q1A', DX, DY - 30, 40, { alpha: pa * gin(T.cols + 1) });
      K.tag('① α 取何值，A 可逆？', DX, DY + 90, { px: 34, a: pa * gin(T.ask1), align: 'center', color: C.ink, w: 900 });
      K.tag('② α、β 取何值，Ax = b 有无穷多解？', DX, DY + 160, { px: 34, a: pa * gin(T.ask2), align: 'center', color: C.ink, w: 900 });
    }
    // 消元
    const ea = a * win(t, T.d2 - 0.3, T.geo, 0.4, 0.4);
    if (ea > 0) {
      const m3 = gin(T.r3a, 0.5), m1 = gin(T.d2, 0.4) * (1 - m3);
      texAt('aug0', DX, DY - 220, 42, { alpha: ea * (1 - Math.max(m1, m3)) });
      if (m1 > 0) texAt('aug1', DX, DY - 220, 42, { alpha: ea * m1 });
      if (m3 > 0) texAt('aug3', DX, DY - 220, 42, { alpha: ea * m3 });
      const lab = t < T.r3a ? 'R₂ − R₁' : t < T.r3b ? 'R₃ − 2R₁' : 'R₃ + R₂';
      K.tag(lab, DX + 300, DY - 330, { px: 32, a: ea * gin(T.d2, 0.3), align: 'center', color: C.peri, w: 900 });
      bubble(DX - 150, DY - 60, '大肥鱼：α = 2 不可逆！', ea * gin(T.d2x) * (1 - gin(T.r3a, 0.4)));
      cross(DX - 150, DY - 60, 360, 60, prog(t, T.wait + 0.2, T.wait + 0.8), ea * (1 - gin(T.r3a, 0.4)));
      K.tag('下面的行还能补主元', DX, DY + 40, { px: 32, a: ea * gin(T.below) * (1 - gin(T.r3a, 0.4)), align: 'center', color: C.peri, w: 900 });
      // 三种情况
      const rows = [['c1', T.cs1, '三个主元 → A 可逆，解唯一', OK], ['c2', T.cs2b, '0 = β − 1 ≠ 0 → 无解', C.free], ['c3', T.cs3, '有自由变量 → 无穷多解', C.peri]];
      rows.forEach(([k, t0, s, col], i) => { const g = ea * gin(t0, 0.4); if (g <= 0) return; const y = DY - 20 + i * 100;
        texAt(k, DX - 250, y, 40, { alpha: g, color: col }); K.tag('→', DX - 110, y + 2, { px: 34, a: g, color: C.inkMid }); K.tag(s, DX - 70, y + 2, { px: 30, a: g, color: col, w: 900 }); });
    }
    // 3D
    draw3D(a * win(t, T.geo, T.gen - 0.2, 0.5, 0.4));
    // 通解 + 行列式
    const ga = a * gin(T.gen - 0.2, 0.4);
    if (ga > 0) {
      texAt('gen', DX, DY - 120, 48, { alpha: ga, reveal: prog(t, T.gen, T.gen + 1.4) });
      K.tag('特解', DX - 115, DY + 10, { px: 28, a: ga * gin(T.gen + 0.8), align: 'center', color: C.peri, w: 900 });
      K.tag('α₁ + α₂ − 3α₃ = 0 给的方向', DX + 150, DY + 10, { px: 28, a: ga * gin(T.dirn), align: 'center', color: C.j, w: 900 });
      const da = ga * gin(T.det, 0.4);
      if (da > 0) { texAt('det', DX, DY + 150, 44, { alpha: da }); K.tag('行列式：第二章', DX, DY + 230, { px: 28, a: da, align: 'center', color: C.gpt, w: 900 }); }
    }
  }

  // ── 第 2 题 ──
  function drawQ2() {
    const a = win(t, T.q2, Q2E, 0.4, 0.4); if (a <= 0) return;
    K.tag('第 2 题 · 2025–2026 第 3 题', DX, DY - 380, { px: 30, a: a * gin(T.q2 + 0.1), align: 'center', color: C.peri, font: F.serif, w: 900 });
    // 消元三步
    const sa = a * (1 - gin(T.m3 + 0.2, 0.4));
    if (sa > 0) {
      const st = [T.q2, T.s1, T.s2, T.s3], keys = ['luA', 'lu1', 'lu2', 'lu3'], ops = ['', 'R₂ + R₁', 'R₃ + R₁', 'R₃ + 2R₂'];
      let k = 0; for (let i = 1; i < 4; i++) if (t > st[i]) k = i;
      const g = gin(st[k] + 0.05, 0.35);
      if (k > 0) texAt(keys[k - 1], DX, DY - 170, 46, { alpha: sa * (1 - g) });
      texAt(keys[k], DX, DY - 170, 46, { alpha: sa * (k === 0 ? gin(T.q2 + 0.3) : g) });
      if (k > 0) K.tag(ops[k], DX + 300, DY - 300, { px: 34, a: sa * g, align: 'center', color: C.peri, w: 900 });
      K.tag('① 求 LU 分解　② 写成初等矩阵 × U', DX, DY + 10, { px: 30, a: sa * gin(T.emx) * (1 - gin(T.s1, 0.4)), align: 'center', color: C.ink, w: 900 });
      // 乘数
      const mu = [['ℓ₂₁ = −1', T.m1], ['ℓ₃₁ = −1', T.m3 - 0.6], ['ℓ₃₂ = −2', T.m3 - 0.2]];
      mu.forEach(([s, t0], i) => K.tag(s, DX - 220 + i * 220, DY + 40, { px: 34, a: sa * gin(t0), align: 'center', color: C.free, w: 900, font: F.serif }));
      K.tag('减去 −1 倍 = 加 1 倍', DX, DY + 120, { px: 28, a: sa * gin(T.m1 + 0.4), align: 'center', color: C.inkMid });
    }
    // L、U
    const la = a * win(t, T.m3 + 0.2, L('D05').s - 0.1, 0.4, 0.3);
    if (la > 0) { texAt('LU', DX, DY - 120, 48, { alpha: la, reveal: prog(t, T.m3 + 0.2, T.m3 + 1.4) }); K.tag('L', DX - 150, DY + 20, { px: 36, a: la, align: 'center', color: C.free, font: F.serif, w: 900 }); K.tag('U', DX + 190, DY + 20, { px: 36, a: la, align: 'center', color: C.ink, font: F.serif, w: 900 });
      K.tag('逐行验算：LU = A ✓', DX, DY + 120, { px: 32, a: la * gin(T.chk + 0.4), align: 'center', color: OK, w: 900 }); }
    // 顺序陷阱
    const oa = a * gin(L('D05').s + 0.2, 0.4);
    if (oa > 0) {
      const wa = oa * (1 - gin(T.right, 0.4));
      texAt('wrong', DX, DY - 230, 46, { alpha: wa });
      cross(DX, DY - 230, 420, 70, prog(t, T.rev, T.rev + 0.6), wa);
      texAt('EEE', DX, DY - 110, 46, { alpha: oa * gin(T.e1r) });
      K.tag('先做的写最右边', DX, DY - 40, { px: 28, a: oa * gin(T.e1r + 0.4), align: 'center', color: C.i, w: 900 });
      // 袜子与鞋
      const ka = oa * gin(T.sock, 0.4) * (1 - gin(T.isL, 0.4));
      if (ka > 0) {
        const box = (s, x, y, col, g) => { if (g <= 0) return; ctx.save(); ctx.globalAlpha = ka * g; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 95, y - 32, 190, 64, 12); ctx.stroke(); ctx.restore(); K.tag(s, x, y + 2, { px: 30, a: ka * g, align: 'center', color: col, w: 900 }); };
        K.tag('穿', DX - 330, DY + 62, { px: 28, a: ka, color: C.inkMid }); K.tag('脱', DX - 330, DY + 152, { px: 28, a: ka * gin(T.off), color: C.inkMid });
        box('① 袜子', DX - 150, DY + 60, C.j, 1); box('② 鞋', DX + 110, DY + 60, C.i, gin(T.sock + 0.5));
        box('① 脱鞋', DX - 150, DY + 150, C.i, gin(T.off)); box('② 脱袜子', DX + 110, DY + 150, C.j, gin(T.off + 0.5));
      }
      const ra = oa * gin(T.right, 0.4);
      if (ra > 0) { texAt('right', DX, DY - 230, 46, { alpha: ra }); K.tag('E⁻¹：乘数变号', DX, DY + 250, { px: 30, a: ra * gin(T.neg) * (1 - gin(T.isL, 0.3)), align: 'center', color: C.peri, w: 900 }); }
      const ia = oa * gin(T.isL, 0.4);
      if (ia > 0) { texAt('Einv', DX, DY + 110, 36, { alpha: ia, reveal: prog(t, T.isL, T.isL + 1.2) }); K.tag('两问是同一件事', DX, DY + 250, { px: 30, a: ia * gin(T.isL + 1), align: 'center', color: OK, w: 900 }); }
    }
  }

  // ── 第 3 题 ──
  function drawQ3() {
    const a = win(t, T.q3, Q3E, 0.4, 0.4); if (a <= 0) return;
    K.tag('第 3 题 · 2017–2018 第 2 题', DX, DY - 380, { px: 30, a: a * gin(T.q3 + 0.1), align: 'center', color: C.peri, font: F.serif, w: 900 });
    const ma = a * (1 - gin(T.thm - 0.3, 0.4));
    texAt('q3', DX, DY - 280, 50, { alpha: ma * gin(T.q3 + 0.3), reveal: prog(t, T.q3 + 0.3, T.q3 + 1.4) });
    K.tag('证明 A 非奇异', DX, DY - 200, { px: 34, a: ma * gin(T.prove), align: 'center', color: C.ink, w: 900 });
    K.tag('目标：A · (？) = I', DX, DY - 130, { px: 34, a: ma * gin(T.noel + 0.6), align: 'center', color: C.peri, font: F.serif, w: 900 });
    const tip = gin(T.tip, 0.5), up = smoother(prog(t, T.tip, T.tip + 0.8));
    texAt('q3a', DX, DY - 40, 46, { alpha: ma * gin(T.mv) * (1 - tip) });
    texAt('q3b', DX, DY + 50, 46, { alpha: ma * gin(T.fac) * (1 - tip) });
    texAt('q3c', DX, lerp(DY + 160, DY - 30, up), 44, { alpha: ma * gin(T.div), reveal: prog(t, T.div, T.inv + 0.6) });
    K.tag('一边乘出 I 就够', DX, DY + 70, { px: 32, a: ma * gin(T.tip + 0.6), align: 'center', color: C.gpt, w: 900 });
    const ya = ma * gin(T.y25, 0.4);
    if (ya > 0) { K.tag('2025–2026 第 1(5) 题', DX, DY + 150, { px: 26, a: ya, align: 'center', color: C.inkMid, w: 900 }); texAt('q3d', DX, DY + 220, 40, { alpha: ya }); }
    const wa = a * gin(T.thm - 0.3, 0.4);
    if (wa > 0) {
      K.tag('为什么一边就够？', DX, DY - 250, { px: 38, a: wa, align: 'center', color: C.peri, font: F.serif, w: 900 });
      texAt('q3e', DX, DY - 120, 44, { alpha: wa, reveal: prog(t, T.thm, T.thm + 1.4) });
      K.tag('Bx = 0 只有零解 → B 可逆（定理 1.5.2）', DX, DY - 20, { px: 30, a: wa * gin(T.binv), align: 'center', color: OK, w: 900 });
      texAt('q3f', DX, DY + 90, 34, { alpha: wa * gin(T.rmul), reveal: prog(t, T.rmul, T.rmul + 1.2) });
    }
  }

  // ── 收尾：三招 + 行列式预告 ──
  const Pl = new Plane({ ox: DX, oy: DY + 80, u: 90, R: 8 });
  function drawEnd() {
    const a = win(t, T.sum, 1e9, 0.4, 0.4); if (a <= 0) return;
    const sa = a * (1 - gin(T.nx, 0.5));
    if (sa > 0) {
      K.tag('第一章 · 期中三招', DX, DY - 260, { px: 44, a: sa, align: 'center', color: C.peri, font: F.serif, w: 900 });
      [['含参数 → 看消完的最后一行', T.z1, C.i], ['LU → 乘数抄进 L，逆序撤销', T.z2, C.j], ['证可逆 → 凑 A · (？) = I', T.z3, C.k]].forEach(([s, t0, col], i) =>
        K.tag(s, DX, DY - 120 + i * 100, { px: 38, a: sa * gin(t0, 0.4), align: 'center', color: col, w: 900 }));
      K.tag('第一章 完', DX, DY + 230, { px: 40, a: sa * gin(T.fin, 0.5), align: 'center', color: C.ink, font: F.serif, w: 900 });
    }
    const na = a * gin(T.nx, 0.5);
    if (na > 0) {
      const D = { x: DX, y: DY, r: DR }, s = smoother(prog(t, T.area - 0.3, T.area + 1.2)), M = [[1 + s, 0.5 * s], [0, 1 + 0.5 * s]];
      ctx.save(); K.clip(D); Pl.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * na }); Pl.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.55 * na });
      const sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(p => Pl.S(p, M)); ctx.globalAlpha = na * 0.35; ctx.fillStyle = C.i; ctx.beginPath(); sq.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.restore();
      const area = (M[0][0] * M[1][1] - M[0][1] * M[1][0]);
      const c = Pl.S([0.5, 0.5], M); K.tag(`面积 × ${area.toFixed(1)}`, c[0], c[1], { px: 34, a: na * gin(T.area), align: 'center', color: C.ink, w: 900, font: F.serif });
      ctx.save(); ctx.globalAlpha = na * 0.85; ctx.fillStyle = C.disc; ctx.beginPath(); ctx.roundRect(DX - 190, DY - 375, 380, 80, 16); ctx.fill(); ctx.restore();
      K.tag('第二章 · 行列式', DX, DY - 330, { px: 44, a: na, align: 'center', color: C.peri, font: F.serif, w: 900 });
      K.tag('det = 0 ⇔ 压扁 ⇔ 不可逆', DX, DY + 330, { px: 32, a: na * gin(T.ok2), align: 'center', color: C.free, w: 900 });
    }
  }

  // ── 左栏 ──
  function drawLeft() {
    const a = smooth(prog(t, T.q1, T.q1 + 0.6)) * (1 - gin(T.nx, 0.5)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; K.head('期中真题 · 第一章', 210, 1, 1);
    const items = [['① 含参数方程组', '2025–2026', T.q1, Q1E, C.i], ['② LU 分解', '2025–2026', T.q2, Q2E, C.j], ['③ 证明可逆', '2017–2018', T.q3, Q3E, C.k]];
    items.forEach(([s, y0, t0, t1, col], i) => {
      const y = 300 + i * 90, cur = t >= t0 && t < t1, done = t >= t1;
      K.tag(s, LX + 10, y, { px: 34, a: cur ? 1 : 0.55, color: cur ? col : C.ink, w: 900 });
      K.tag(y0 + (done ? '  ✓' : ''), LX + 14, y + 40, { px: 24, a: 0.7, color: done ? OK : C.inkMid });
    });
    ctx.restore();
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 复习', prog(t, 0.2, 1.3));
    drawTitle(); drawQ1(); drawQ2(); drawQ3(); drawEnd();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
