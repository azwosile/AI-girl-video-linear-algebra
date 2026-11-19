// 第七章公用骨架（继承第六章；第七章新增数字矩阵格子 / 数位串 / 单位球（1、2、∞ 范数）/ 数轴）：时间轴 / 角色 / 标题 / 左栏分节 / 圆盘 / 2D 网格 / 3D 平面 / 判定印章。
// 每段 scene.js 只写「这段讲什么」：cue 表、左栏要点、圆盘里的分镜（shots）。
// 用法：
//   const B = base(R, { assets, label: '第七章 · 数值线性代数', title: '7.1 电脑里的数', hi: 3, en: 'NUMERICAL LINEAR ALGEBRA', titleEnd: () => L('C02').s, pre, post });
//   B.frame(t, D => { ...圆盘里画... ; B.left(SECTIONS) });
import { C, F } from '../engine/style/tokens.js';
import { lerp, prog, smooth, smoother, outCubic, outBack, win, rgba } from '../engine/core/util.js';
import { buildTimeline } from '../engine/core/timeline.js';
import { dotted, cornerMark } from '../engine/style/motifs.js';
import { Plane, arrow } from '../engine/la2d/plane.js';
import { Cast, subtitle } from '../engine/cast/cast.js';
import { makeDirector } from '../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../engine/style/kit.js';

export { C, F, lerp, prog, smooth, smoother, outCubic, outBack, win, rgba, Plane, arrow, LX, DX, DY, DR };
export const OK = '#4FC1A6';
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
export const I2 = [[1, 0], [0, 1]];
export const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));
export const neg = s => String(s).replace(/-/g, '−');

// three.js 只在浏览器里有；干跑时换成桩
export async function load3D() {
  try { return (await import('../engine/la3d/planes3d.js')).Planes3D; }
  catch (e) {
    return class { constructor(s) { this.size = s; } reset() { return this; } setPlane() { return this; } setLine() { return this; } setPoint() { return this; }
      render() { return { width: this.size, height: this.size }; } project() { return [this.size / 2, this.size / 2]; } };
  }
}

export function base(R, o) {
  const { ctx, stage, tex } = R;
  const TL = buildTimeline({ lines: R.lines, durations: R.durations, lead: o.lead ?? 2.1, pre: o.pre || {}, post: o.post || {}, tail: o.tail ?? 0.8 });
  const L = TL.L, cue = TL.cue;
  const cast = new Cast(R.envelope, TL);
  for (const n of o.assets.chars) cast.add(n, R.img[n], SHADOW[n.split('_')[0]]);
  const dir = makeDirector(TL, cast, o.dir || {
    C: { x: 250, y: 1095, h: 470, in: [0.9, 1.6] },
    D: { x: 1738, y: 1095, h: 500 },
    G: { x: 1716, y: 1095, h: 500 },
  });
  const K = makeKit(ctx);
  const S = { t: 0 };
  const B = {
    TL, L, cue, K, ctx, tex, S, MJ: R.math,
    get t() { return S.t; },
    gin: (t0, d = 0.35) => smooth(prog(S.t, t0 - 0.1, t0 + d)),
    rv: (t0, d = 1.0) => prog(S.t, t0, t0 + d),
    win: (t0, t1, fi = 0.35, fo = 0.4) => win(S.t, t0, t1, fi, fo),
    texAt: (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt),
    texW: (k, px) => { const pl = tex.place(k, 0, 0, px, 'l'); return pl.w ?? pl.width ?? 0; },
    tag: (text, x, y, opt = {}) => K.tag(text, x, y, { w: 900, ...opt }),
    ctag: (text, x, y, opt = {}) => K.tag(text, x, y, { align: 'center', w: 900, ...opt }),
  };

  // 标题（2.2a 同款：逐字弹入 → 缩到左上 → titleEnd 时淡出）
  B.title = () => {
    const t = S.t, end = o.titleEnd(), a = 1 - smooth(prog(t, end - 0.2, end + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText(o.label, 4, -128);
    ctx.font = F.serif(o.titlePx ?? 104); let cx = 0;
    [...o.title].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < (o.hi ?? 3) ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, o.en, cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    return a;
  };

  // 左栏分节：[{ t0, t1, head, color?, items: [[text, tAppear, { color, mark, px }]], note?: {title, body, t, y, color} }]
  B.left = (secs) => {
    const t = S.t;
    for (const sc of secs) {
      const te = o.titleEnd ? o.titleEnd() : 0, t0h = Math.max(sc.t0, te - 0.1);
      const a = win(t, t0h, sc.t1, 0.3, 0.4); if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha = a; K.head(sc.head, 210, 1, smooth(prog(t, t0h, t0h + 0.6)), sc.color || C.ink);
      sc.items.forEach(([txt, t0, op = {}], i) => K.bullet(txt, op.y ?? 290 + i * 60, B.gin(t0), op));
      if (sc.note) { const n = sc.note; K.note(n.title, n.body, n.y ?? (290 + sc.items.length * 60), B.gin(n.t, 0.5), { color: n.color || C.gpt, w: n.w ?? 520 }); }
      ctx.restore();
    }
  };

  B.discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(S.t, 0.05, 0.9)) });

  B.frame = (t, mid) => {
    S.t = t; stage.bg();
    const D = B.discAt(); K.disc(D, t);
    cornerMark(ctx, o.label, prog(t, 0.2, 1.3));
    B.title();
    mid(D);
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  };

  // ── 2D 网格（只画在圆盘里）──
  B.grid = (P, M, a, D, { old = 0.12, neu = 0.5, basis = true, clipY = null } = {}) => {
    if (a <= 0) return;
    ctx.save(); K.clip(D); if (clipY != null) { ctx.beginPath(); ctx.rect(0, clipY, 1920, 1080); ctx.clip(); }
    P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: old * a });
    if (neu > 0) P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: neu * a });
    ctx.restore();
    if (basis) { const O = P.S([0, 0], M); arrow(ctx, O, P.S([1, 0], M), { color: C.i, width: 8, head: 24, alpha: a }); arrow(ctx, O, P.S([0, 1], M), { color: C.j, width: 8, head: 24, alpha: a }); }
  };
  B.vec = (P, v, a, { color = C.ink, width = 8, head = 24, from = [0, 0], grow = 1, label = null, lx = 16, ly = -14, px = 34 } = {}) => {
    if (a <= 0) return;
    const p = P.S(from), q = P.S([from[0] + v[0] * grow, from[1] + v[1] * grow]);
    arrow(ctx, p, q, { color, width, head, alpha: a });
    if (label) B.tag(label, q[0] + lx, q[1] + ly, { px, a, color, font: F.serif });
  };
  B.dot = (x, y, r, color, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
  B.line2 = (p, q, color, a = 1, width = 3, dash = null) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.lineWidth = width; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.restore(); };

  // ── 3D：渲染 Planes3D 到圆盘，返回投影函数 ──
  B.show3D = (P3, D, a, cam) => {
    const cv = P3.render(cam);
    ctx.save(); K.clip(D); ctx.globalAlpha = Math.min(1, a); ctx.drawImage(cv, D.x - P3.size / 2, D.y - P3.size / 2, P3.size, P3.size); ctx.restore();
    const pr = p => { const [x, y] = P3.project(p); return [D.x - P3.size / 2 + x, D.y - P3.size / 2 + y]; };
    const lab = (p, text, op) => { const [x, y] = pr(p); K.tag(text, x, y, { align: 'center', w: 900, ...op }); };
    const v3 = (p, q, op) => arrow(ctx, pr(p), pr(q), { width: 7, head: 22, ...op });
    lab([P3.R * 1.3, 0, 0], 'x₁', { px: 28, a: a * 0.8 }); lab([0, P3.R * 1.3, 0], 'x₂', { px: 28, a: a * 0.8 }); lab([0, 0, P3.R * 1.3], 'x₃', { px: 28, a: a * 0.8 });
    return { pr, lab, v3 };
  };

  // ── 复习段用：判定印章、抢答气泡 ──
  B.stamp = (x, y, ok, s, a, text = null) => {
    if (s <= 0) return; const k = lerp(1.8, 1, outBack(s, 2.2));
    ctx.save(); ctx.globalAlpha = a * smooth(s * 2); ctx.translate(x, y); ctx.rotate(-0.18); ctx.scale(k, k);
    const col = ok ? OK : C.free; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.strokeRect(-92, -48, 184, 96); ctx.lineWidth = 2; ctx.strokeRect(-82, -38, 164, 76);
    ctx.fillStyle = col; ctx.font = F.serif(58, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text ?? (ok ? '✓ 对' : '✗ 错'), 0, 4); ctx.restore();
  };
  B.bubble = (x, y, text, a, col = C.ds) => {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = F.sans(32, 900); const w = ctx.measureText(text).width + 44;
    ctx.fillStyle = col; ctx.globalAlpha = a * 0.9; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 30, w, 60, 30); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w / 2 - 40, y + 28); ctx.lineTo(x + w / 2 - 10, y + 52); ctx.lineTo(x + w / 2 - 14, y + 26); ctx.fill();
    ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1); ctx.restore();
  };
  // 方框卡片（圆盘内的小结框）
  B.card = (x, y, w, h, a, col = C.peri) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(C.paperHi, 0.82); ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x - w / 2, y - h / 2, w, h); ctx.restore(); };

  // ════ 第四章新增 ════
  // tex 带 class 的框（groupBox）
  B.gbox = (key, x, y, px, cls, col, a, pad = 6) => {
    if (a <= 0) return; const g = tex.groupBox(tex.place(key, x, y, px, 'c'), cls); if (!g) return;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(g.x - g.w / 2 - pad, g.y - g.h / 2 - pad, g.w + 2 * pad, g.h + 2 * pad); ctx.restore();
  };
  // 3B1B 式网格变形：从 from（默认 I）插值到 M。square 给单位正方形着色；返回当前矩阵。
  B.warp = (P, M, s, a, D, { from = I2, square = false, basis = true, labels = true, old = 0.12, neu = 0.55, clipY = null, sqCol = C.i } = {}) => {
    const Ms = lerpM(from, M, s); if (a <= 0) return Ms;
    ctx.save(); K.clip(D); if (clipY != null) { ctx.beginPath(); ctx.rect(0, clipY, 1920, 1080); ctx.clip(); }
    P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: old * a });
    if (square) { const q = [[0, 0], [1, 0], [1, 1], [0, 1]].map(p => P.S(p, Ms)); ctx.globalAlpha = 0.22 * a; ctx.fillStyle = sqCol; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    P.grid(ctx, { M: Ms, color: C.gridNew, width: 2.2, alpha: neu * a });
    P.axes(ctx, { M: Ms, color: C.ink, width: 2.5, alpha: 0.55 * a });
    ctx.restore();
    if (basis) {
      const O = P.S([0, 0], Ms), pi = P.S([1, 0], Ms), pj = P.S([0, 1], Ms);
      arrow(ctx, O, pi, { color: C.i, width: 8, head: 24, alpha: a }); arrow(ctx, O, pj, { color: C.j, width: 8, head: 24, alpha: a });
      if (labels) { K.tag('î', pi[0] + 14, pi[1] + 26, { px: 34, a, color: C.i, font: F.serif }); K.tag('ĵ', pj[0] - 34, pj[1] - 14, { px: 34, a, color: C.j, font: F.serif }); }
    }
    return Ms;
  };
  // 非线性变形：f(p) → q（数学坐标），沿网格线采样画曲线；s 在恒等与 f 之间插值
  B.warpF = (P, f, s, a, D, { R = P.R, n = 48, neu = 0.55, old = 0.12, color = C.gridNew } = {}) => {
    if (a <= 0) return; const g = p => { const q = f(p); return [lerp(p[0], q[0], s), lerp(p[1], q[1], s)]; };
    const scr = q => [P.ox + q[0] * P.u, P.oy - q[1] * P.u];
    ctx.save(); K.clip(D); P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: old * a });
    ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.globalAlpha = neu * a;
    for (let k = -Math.floor(R); k <= Math.floor(R); k++) for (const vert of [0, 1]) {
      ctx.beginPath(); for (let i = 0; i <= n; i++) { const u = -R + 2 * R * i / n, p = vert ? [k, u] : [u, k], q = scr(g(p)); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke();
    }
    ctx.restore(); return scr;
  };
  // 平面上的多边形（数学坐标顶点，经矩阵 M）
  B.poly = (P, pts, M, a, { fill = C.peri, stroke = C.ink, fa = 0.55, width = 4 } = {}) => {
    if (a <= 0) return; const q = pts.map(p => P.S(p, M)); ctx.save(); ctx.globalAlpha = a * fa; ctx.fillStyle = fill; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = a; ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); return q;
  };
  // 红色叉（反例）
  B.cross = (x, y, s, a, r = 46) => { if (a <= 0 || s <= 0) return; const k = r * outBack(Math.min(1, s), 2); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.free; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - k, y - k); ctx.lineTo(x + k, y + k); ctx.moveTo(x + k, y - k); ctx.lineTo(x - k, y + k); ctx.stroke(); ctx.restore(); };
  // 四角交换图：corners {tl,tr,bl,br: {k?:tex 键, text?, px?, col?}}；arrows [{f,t,label,at,col}]；run {path:['tl','bl','br'], t0, t1, col}
  B.cd = (cx, cy, w, h, a, spec) => {
    if (a <= 0) return; const P0 = { tl: [cx - w / 2, cy - h / 2], tr: [cx + w / 2, cy - h / 2], bl: [cx - w / 2, cy + h / 2], br: [cx + w / 2, cy + h / 2] };
    const cw = spec.cw ?? 230, ch = spec.ch ?? 96;
    for (const [n, c] of Object.entries(spec.corners)) {
      const [x, y] = P0[n], ca = a * B.gin(c.at ?? 0);
      B.card(x, y, cw, ch, ca, c.col ?? C.inkMid);
      if (c.k) B.texAt(c.k, x, y, c.px ?? 36, { alpha: ca, color: c.tcol }); else K.tag(c.text, x, y, { align: 'center', w: 900, px: c.px ?? 32, a: ca, color: c.tcol ?? C.ink, font: F.serif });
    }
    for (const r of spec.arrows) {
      const p = P0[r.f], q = P0[r.t], hz = Math.abs(p[1] - q[1]) < 1, dx = Math.sign(q[0] - p[0]), dy = Math.sign(q[1] - p[1]);
      const off = hz ? [cw / 2 + 14, 0] : [0, ch / 2 + 14];
      const s0 = [p[0] + dx * off[0], p[1] + dy * off[1]], s1 = [q[0] - dx * off[0], q[1] - dy * off[1]];
      const ga = B.gin(r.at ?? 0, 0.5), col = r.col ?? C.ink;
      arrow(ctx, s0, s1, { color: col, width: 5, head: 20, alpha: a * Math.min(1, ga * 1.5), grow: ga });
      if (r.label) { const mx = (s0[0] + s1[0]) / 2 + (hz ? 0 : (r.side ?? -1) * 46), my = (s0[1] + s1[1]) / 2 + (hz ? (r.side ?? -1) * 32 : 0);
        if (r.lk) B.texAt(r.lk, mx, my, r.px ?? 34, { alpha: a * ga, color: col }); else K.tag(r.label, mx, my, { align: 'center', w: 900, px: r.px ?? 32, a: a * ga, color: col, font: F.serif }); }
    }
    const run = spec.run; if (run) {
      const u = prog(S.t, run.t0, run.t1); if (u > 0 && u < 1) {
        const pts = run.path.map(n => P0[n]), segs = pts.length - 1, f = Math.min(segs - 1e-6, u * segs), i = Math.floor(f), e = smooth(f - i);
        const x = lerp(pts[i][0], pts[i + 1][0], e), y = lerp(pts[i][1], pts[i + 1][1], e);
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = run.col ?? C.peri; ctx.shadowColor = run.col ?? C.peri; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    return P0;
  };
    // ════ 第五章新增 ════
  // 直角标：屏幕点 p，沿两条屏幕方向 u、v（会单位化）画小方块
  B.rightMark = (p, u, v, a, { s = 22, color = C.ink, width = 3 } = {}) => {
    if (a <= 0) return; const nu = Math.hypot(...u) || 1, nv = Math.hypot(...v) || 1, U = [u[0] / nu * s, u[1] / nu * s], V = [v[0] / nv * s, v[1] / nv * s];
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
    ctx.moveTo(p[0] + U[0], p[1] + U[1]); ctx.lineTo(p[0] + U[0] + V[0], p[1] + U[1] + V[1]); ctx.lineTo(p[0] + V[0], p[1] + V[1]); ctx.stroke(); ctx.restore();
  };
  // 圆盘内的过原点 / 过 p0 直线（数学坐标方向 d），自动裁进圆盘
  B.lineD = (P, D, d, a, { p0 = [0, 0], color = C.inkMid, width = 3, dash = null, grow = 1 } = {}) => {
    if (a <= 0) return; const L = 40 * grow; ctx.save(); K.clip(D);
    B.line2(P.S([p0[0] - d[0] * L, p0[1] - d[1] * L]), P.S([p0[0] + d[0] * L, p0[1] + d[1] * L]), color, a, width, dash); ctx.restore();
  };
  // 2D 投影：x 投到 y 上。画 p（橙）、x − p（虚线）、直角标；返回 {p, O, X, Pp}
  B.proj = (P, x, y, a, { grow = 1, showZ = 1, pCol = C.peri, zCol = C.free, mark = 1, width = 7 } = {}) => {
    const k = (x[0] * y[0] + x[1] * y[1]) / (y[0] * y[0] + y[1] * y[1]), p = [k * y[0], k * y[1]];
    const O = P.S([0, 0]), X = P.S(x), Pp = P.S(p);
    if (a > 0) {
      const g = smooth(grow); const Pg = [lerp(X[0], Pp[0], g), lerp(X[1], Pp[1], g)];
      if (showZ > 0) B.line2(X, Pg, zCol, a * showZ, 3, [10, 8]);
      if (g > 0.05) arrow(ctx, O, [lerp(O[0], Pp[0], g), lerp(O[1], Pp[1], g)], { color: pCol, width, head: 22, alpha: a * Math.min(1, g * 3) });
      if (mark > 0 && g > 0.9 && Math.abs(k) > 0.05) B.rightMark(Pp, [O[0] - Pp[0], O[1] - Pp[1]], [X[0] - Pp[0], X[1] - Pp[1]], a * mark * smooth((g - 0.9) * 10));
    }
    return { p, k, O, X, Pp };
  };
  // 水平计量条：中心 (x, y)，val ∈ [−max, max]，正值橙、负值红
  B.meter = (x, y, w, val, max, a, { label = null, h = 22, fmt = v => v.toFixed(1) } = {}) => {
    if (a <= 0) return; const r = Math.max(-1, Math.min(1, val / max)); ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    ctx.fillStyle = r >= 0 ? C.peri : C.free; ctx.fillRect(x, y - h / 2 + 3, r * (w / 2 - 3), h - 6);
    ctx.fillStyle = C.ink; ctx.fillRect(x - 1.5, y - h / 2 - 6, 3, h + 12); ctx.restore();
    if (label) K.tag(label + ' ' + fmt(val), x, y - h - 10, { align: 'center', w: 900, px: 28, a, color: Math.abs(val) < 1e-3 * max ? OK : (val > 0 ? C.peri : C.free), font: F.serif });
  };
  // 残差方块：数据点 (xi, yi) 与拟合值 fi 之间的竖线 + 以残差为边的正方形
  B.sqRes = (P, xi, yi, fi, a, { sq = 1, col = C.free } = {}) => {
    if (a <= 0) return; const A = P.S([xi, yi]), Bp = P.S([xi, fi]); B.line2(A, Bp, col, a, 4);
    if (sq > 0) { const s = Bp[1] - A[1]; ctx.save(); ctx.globalAlpha = a * sq * 0.28; ctx.fillStyle = col; ctx.fillRect(A[0], Math.min(A[1], Bp[1]), Math.abs(s), Math.abs(s)); ctx.globalAlpha = a * sq * 0.7; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(A[0], Math.min(A[1], Bp[1]), Math.abs(s), Math.abs(s)); ctx.restore(); }
  };
  // 数学坐标折线 / 曲线（f: x → y），裁进圆盘
  B.curve = (P, D, f, x0, x1, a, { color = C.peri, width = 5, n = 160, dash = null } = {}) => {
    if (a <= 0) return; ctx.save(); K.clip(D); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash); ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), q = P.S([x, f(x)]); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke(); ctx.restore();
  };
  // 曲线与 x 轴之间的面积（正绿负红），用于“函数内积 = 积分”
  B.area = (P, D, f, x0, x1, a, { n = 160, pos = OK, neg = C.free, fa = 0.35 } = {}) => {
    if (a <= 0) return; ctx.save(); K.clip(D);
    for (let i = 0; i < n; i++) { const xa = lerp(x0, x1, i / n), xb = lerp(x0, x1, (i + 1) / n), ym = f((xa + xb) / 2); const p = P.S([xa, 0]), q = P.S([xb, ym]);
      ctx.globalAlpha = a * fa; ctx.fillStyle = ym >= 0 ? pos : neg; ctx.fillRect(p[0], Math.min(p[1], q[1]), q[0] - p[0] + 0.6, Math.abs(q[1] - p[1])); }
    ctx.restore();
  };

  // ════ 第六章新增 ════
  // 特征方向演示：网格从 I 变到 M（进度 s）；fan 条灰色样本向量跟着变；eig 里的方向画成虚线并高亮
  // eig: [{ d:[x,y], col, lam? , label? }]
  B.eigFan = (P, M, s, a, D, { fan = 16, r = 1.4, eig = [], grid = true, square = false, neu = 0.45, lines = 1, hot = 1, clipY = null } = {}) => {
    if (a <= 0) return lerpM(I2, M, s);
    const Ms = grid ? B.warp(P, M, s, a, D, { square, basis: false, neu, clipY }) : lerpM(I2, M, s);
    for (const e of eig) { const n = Math.hypot(...e.d); B.lineD(P, D, [e.d[0] / n, e.d[1] / n], a * 0.75 * lines, { color: e.col, width: 3, dash: [12, 10] }); }
    const O = P.S([0, 0]);
    for (let i = 0; i < fan; i++) {
      const th = Math.PI * 2 * i / fan, v = [r * Math.cos(th), r * Math.sin(th)];
      const on = eig.some(e => Math.abs(e.d[0] * v[1] - e.d[1] * v[0]) / Math.hypot(...e.d) < 1e-6 * r + 0.02 * r);
      if (!on) arrow(ctx, O, P.S(v, Ms), { color: C.inkMid, width: 4, head: 14, alpha: a * 0.55 });
    }
    for (const e of eig) {
      const n = Math.hypot(...e.d); for (const sg of [1, -1]) { const v = [sg * r * e.d[0] / n, sg * r * e.d[1] / n]; arrow(ctx, O, P.S(v, Ms), { color: e.col, width: 7, head: 20, alpha: a * hot }); }
      if (e.label) { const q = P.S([r * e.d[0] / n, r * e.d[1] / n], Ms); K.tag(e.label, q[0] + 30, q[1] - 26, { align: 'center', w: 900, px: 30, a: a * hot, color: e.col, font: F.serif }); }
    }
    return Ms;
  };
  // 相图：Y' = A Y，从 starts 出发 RK4 积分画轨迹（数学坐标）；grow 0..1 控制画到多长；dots 画动点
  B.flow = (P, D, A, a, { starts = [], T = 3, n = 120, grow = 1, color = C.periLt, width = 2.5, dot = 0, tclip = 9 } = {}) => {
    if (a <= 0) return; const f = (y) => [A[0][0] * y[0] + A[0][1] * y[1], A[1][0] * y[0] + A[1][1] * y[1]];
    ctx.save(); K.clip(D); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = a * 0.75;
    const h = T / n, m = Math.max(1, Math.floor(n * grow));
    for (const s0 of starts) {
      let y = s0.slice(); ctx.beginPath(); ctx.moveTo(...P.S(y));
      for (let i = 0; i < m; i++) {
        const k1 = f(y), k2 = f([y[0] + h / 2 * k1[0], y[1] + h / 2 * k1[1]]), k3 = f([y[0] + h / 2 * k2[0], y[1] + h / 2 * k2[1]]), k4 = f([y[0] + h * k3[0], y[1] + h * k3[1]]);
        y = [y[0] + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), y[1] + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
        if (Math.abs(y[0]) > tclip || Math.abs(y[1]) > tclip) break; ctx.lineTo(...P.S(y));
      }
      ctx.stroke();
      if (dot > 0) { ctx.save(); ctx.globalAlpha = a * dot; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(...P.S(y), 7, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }
    ctx.restore();
  };
  // 对称 2×2 二次型等值线 xᵀAx = c（椭圆 / 双曲线），沿角度采样，q ≤ 0 处断开
  B.levelQ = (P, D, A, c, a, { color = C.peri, width = 4, n = 360, M = I2, dash = null } = {}) => {
    if (a <= 0) return; ctx.save(); K.clip(D); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.lineWidth = width; if (dash) ctx.setLineDash(dash);
    for (const sg of (c > 0 ? [1] : [1])) {
      ctx.beginPath(); let pen = false;
      for (let i = 0; i <= n; i++) {
        const th = Math.PI * 2 * i / n, u = [Math.cos(th), Math.sin(th)], q = A[0][0] * u[0] * u[0] + 2 * A[0][1] * u[0] * u[1] + A[1][1] * u[1] * u[1];
        const ok = q * c > 1e-3 && Math.sqrt(c / q) < 30; if (!ok) { pen = false; continue; }
        const r = Math.sqrt(c / q), p = P.S([r * u[0], r * u[1]], M); pen ? ctx.lineTo(...p) : ctx.moveTo(...p); pen = true;
      }
      ctx.stroke();
    }
    ctx.restore();
  };
  // 单位圆（及两条正交半径）经 lerpM(I, M, s) 映射
  B.mapCircle = (P, D, M, s, a, { color = C.peri, width = 4, fill = 0.12, radii = [] } = {}) => {
    if (a <= 0) return; const Ms = lerpM(I2, M, s); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const th = Math.PI * 2 * i / 120, p = P.S([Math.cos(th), Math.sin(th)], Ms); i ? ctx.lineTo(...p) : ctx.moveTo(...p); }
    ctx.globalAlpha = a * fill; ctx.fill(); ctx.globalAlpha = a; ctx.stroke(); ctx.restore();
    for (const r of radii) arrow(ctx, P.S([0, 0]), P.S(r.v, Ms), { color: r.col, width: 7, head: 20, alpha: a });
    return Ms;
  };
  // 柱状图：底边中心 (x, y)，vals 与 max 定高度 hMax
  B.bars = (x, y, vals, max, a, { cols = [C.peri, C.j], labels = [], w = 90, gap = 60, hMax = 300, fmt = v => String(Math.round(v)) } = {}) => {
    if (a <= 0) return; const n = vals.length, x0 = x - ((n - 1) * (w + gap)) / 2;
    vals.forEach((v, i) => { const h = hMax * v / max, cx = x0 + i * (w + gap); ctx.save(); ctx.globalAlpha = a * 0.85; ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(cx - w / 2, y - h, w, h); ctx.restore();
      K.tag(fmt(v), cx, y - h - 26, { align: 'center', w: 900, px: 30, a, color: cols[i % cols.length], font: F.serif }); if (labels[i]) K.tag(labels[i], cx, y + 30, { align: 'center', w: 900, px: 28, a, color: C.inkMid }); });
    B.line2([x0 - w, y], [x0 + (n - 1) * (w + gap) + w, y], C.ink, a * 0.6, 2);
  };
  // 文字列表卡（左对齐若干行，逐行出现）：rows [[text, t0, color?]]
  B.rows = (x, y, rows, a, { px = 30, dy = 52, font = F.sans } = {}) => { rows.forEach(([txt, t0, col], i) => K.tag(txt, x, y + i * dy, { w: 1200, px, a: a * B.gin(t0), color: col ?? C.ink, font })); };
  // ════ 第七章新增 ════
  // 数字矩阵格子：中心 (x, y)，rows 为二维数组（字符串 / 数字）。
  // opt: cw/ch 单元宽高；px 字号；col(i,j) 单元文字颜色；cell(i,j) → {bg, a, box} 单元底色 / 透明度 / 描边；bracket 画方括号；fade(i,j) 单元透明度系数
  B.mat = (x, y, rows, a, { cw = 92, ch = 64, px = 36, col = null, cell = null, bracket = true, fade = null, font = F.serif, bcol = C.ink } = {}) => {
    if (a <= 0) return null; const m = rows.length, n = rows[0].length, W = n * cw, H = m * ch, x0 = x - W / 2, y0 = y - H / 2;
    const at = (i, j) => [x0 + (j + 0.5) * cw, y0 + (i + 0.5) * ch];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      const c = cell ? cell(i, j) : null, f = fade ? fade(i, j) : 1; if (f <= 0) continue; const [cx, cy] = at(i, j);
      if (c && c.bg) { ctx.save(); ctx.globalAlpha = a * f * (c.a ?? 0.28); ctx.fillStyle = c.bg; ctx.fillRect(cx - cw / 2 + 3, cy - ch / 2 + 3, cw - 6, ch - 6); ctx.restore(); }
      if (c && c.box) { ctx.save(); ctx.globalAlpha = a * f; ctx.strokeStyle = c.box; ctx.lineWidth = 3; ctx.strokeRect(cx - cw / 2 + 4, cy - ch / 2 + 4, cw - 8, ch - 8); ctx.restore(); }
      const v = rows[i][j]; if (v === '' || v == null) continue;
      K.tag(neg(v), cx, cy, { align: 'center', w: 900, px, a: a * f, color: col ? col(i, j) : C.ink, font });
    }
    if (bracket) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = bcol; ctx.lineWidth = 3; const e = 12;
      ctx.beginPath(); ctx.moveTo(x0 + e, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + H); ctx.lineTo(x0 + e, y0 + H);
      ctx.moveTo(x0 + W - e, y0); ctx.lineTo(x0 + W, y0); ctx.lineTo(x0 + W, y0 + H); ctx.lineTo(x0 + W - e, y0 + H); ctx.stroke(); ctx.restore(); }
    return { at, x0, y0, W, H };
  };
  // 数位串：逐字等宽画出（小数点也占一格），dim(k) 返回第 k 个字符的透明度系数，col(k) 返回颜色
  B.digits = (x, y, str, a, { px = 44, cw = null, dim = null, col = null, align = 'c', font = F.serif, box = null } = {}) => {
    if (a <= 0) return null; const s = [...String(str)], w = cw ?? px * 0.62, W = s.length * w, x0 = align === 'l' ? x : align === 'r' ? x - W : x - W / 2;
    s.forEach((c, k) => { const f = dim ? dim(k) : 1; if (f <= 0) return; const cx = x0 + (k + 0.5) * w;
      if (box && box(k)) { ctx.save(); ctx.globalAlpha = a * f * 0.3; ctx.fillStyle = box(k); ctx.fillRect(cx - w / 2 + 1, y - px * 0.62, w - 2, px * 1.24); ctx.restore(); }
      K.tag(c, cx, y, { align: 'center', w: 900, px, a: a * f, color: col ? col(k) : C.ink, font }); });
    return { x0, w, W };
  };
  // 单位球：kind = 'two' 圆 | 'one' 菱形 | 'inf' 正方形；经 lerpM(I, M, s) 映射；返回映射后离原点最远的点（数学坐标）与距离
  B.ball = (P, M, s, a, { kind = 'two', color = C.peri, width = 4, fill = 0.12, n = 240 } = {}) => {
    const Ms = lerpM(I2, M, s), pts = [];
    for (let i = 0; i <= n; i++) { const th = Math.PI * 2 * i / n, c = Math.cos(th), sn = Math.sin(th);
      const r = kind === 'two' ? 1 : kind === 'one' ? 1 / (Math.abs(c) + Math.abs(sn)) : 1 / Math.max(Math.abs(c), Math.abs(sn));
      const u = [r * c, r * sn]; pts.push([Ms[0][0] * u[0] + Ms[0][1] * u[1], Ms[1][0] * u[0] + Ms[1][1] * u[1]]); }
    let far = pts[0], dmax = 0; for (const p of pts) { const d = kind === 'two' ? Math.hypot(...p) : kind === 'one' ? Math.abs(p[0]) + Math.abs(p[1]) : Math.max(Math.abs(p[0]), Math.abs(p[1])); if (d > dmax) { dmax = d; far = p; } }
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.beginPath();
      pts.forEach((p, i) => { const q = P.S(p); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.closePath(); ctx.globalAlpha = a * fill; ctx.fill(); ctx.globalAlpha = a; ctx.stroke(); ctx.restore(); }
    return { far, d: dmax, Ms };
  };
  // 水平数轴：屏幕 [x0, x1]、高度 y，数值范围 [v0, v1]；ticks [[v, label]]；返回 v → 屏幕 x
  B.axis = (x0, x1, y, v0, v1, a, { ticks = [], color = C.inkMid, px = 26 } = {}) => {
    const X = v => x0 + (v - v0) / (v1 - v0) * (x1 - x0); if (a <= 0) return X;
    arrow(ctx, [x0 - 20, y], [x1 + 30, y], { color, width: 3, head: 16, alpha: a });
    for (const [v, lb] of ticks) { B.line2([X(v), y - 10], [X(v), y + 10], color, a, 2); if (lb != null) K.tag(lb, X(v), y + 34, { align: 'center', w: 900, px, a, color, font: F.serif }); }
    return X;
  };
  // 竖直刻度尺（有效数字 / 条件数位数）：底 (x, y)，n 格，lit(k) 返回第 k 格的颜色（null = 暗）
  B.ruler = (x, y, n, a, { w = 46, h = 26, gap = 6, lit = () => C.peri, label = null } = {}) => {
    if (a <= 0) return; for (let k = 0; k < n; k++) { const c = lit(k), yy = y - k * (h + gap) - h; ctx.save(); ctx.globalAlpha = a * (c ? 0.85 : 0.18); ctx.fillStyle = c || C.inkMid; ctx.fillRect(x - w / 2, yy, w, h); ctx.restore(); }
    if (label) K.tag(label, x, y + 30, { align: 'center', w: 900, px: 26, a, color: C.inkMid });
  };
  return B;
}
