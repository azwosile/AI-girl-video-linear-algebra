// 第四章公用骨架（继承第三章）：时间轴 / 角色 / 标题 / 左栏分节 / 圆盘 / 2D 网格 / 3D 平面 / 判定印章。
// 每段 scene.js 只写「这段讲什么」：cue 表、左栏要点、圆盘里的分镜（shots）。
// 用法：
//   const B = base(R, { assets, label: '第四章 · 线性变换', title: '4.1 线性变换', hi: 3, en: 'VECTOR SPACES', titleEnd: () => L('C02').s, pre, post });
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
      const a = win(t, sc.t0, sc.t1, 0.3, 0.4); if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha = a; K.head(sc.head, 210, 1, smooth(prog(t, sc.t0, sc.t0 + 0.6)), sc.color || C.ink);
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
  return B;
}
