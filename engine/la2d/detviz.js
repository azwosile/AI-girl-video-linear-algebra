// 第二章（行列式）共用画面件：面积填充 + 实时读数、方向小圆弧、行列式面板（竖线 / 划掉行列 / 正负号棋盘 / 逐格高亮）。
// 用法：
//   import { det2, polyFill, paraFill, orientArc, DetGrid, shapeMap } from '../../engine/la2d/detviz.js';
//   paraFill(ctx, P, M, { color, alpha })            → 返回 { c: 屏幕质心, d: 行列式 }
//   orientArc(ctx, P, M, { r: 0.55, alpha })          → î′ 到 ĵ′ 的短弧（det > 0 逆时针、奶油色；det < 0 顺时针、free 色）
//   const G = new DetGrid([[2,5,4],[3,1,2],[5,4,6]]);
//   G.draw(ctx, { x, y, px, a, bars: 1, strike: { r, c, s }, hi: { 'i,j': [alpha, color] }, signs: s, dim: { 'i,j': 0.3 } })
import { C, F } from '../style/tokens.js';
import { clamp, lerp, smooth, rgba } from '../core/util.js';
import { fmtNum } from './mboard.js';

export const det2 = M => M[0][0] * M[1][1] - M[0][1] * M[1][0];
export const det3 = A => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
export function detN(A) {
  const n = A.length; if (n === 1) return A[0][0]; if (n === 2) return det2(A);
  let s = 0; for (let j = 0; j < n; j++) { if (!A[0][j]) continue; s += (j % 2 ? -1 : 1) * A[0][j] * detN(minor(A, 0, j)); } return s;
}
export const minor = (A, i, j) => A.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j));

export function polyFill(ctx, pts, { color = C.i, alpha = 0.35, stroke = null, width = 3, salpha = 1 } = {}) {
  if (alpha <= 0 && !stroke) return; ctx.save(); ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  if (alpha > 0) { ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.fill(); ctx.globalAlpha /= alpha; }
  if (stroke) { ctx.globalAlpha *= salpha; ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.stroke(); }
  ctx.restore();
}

/** 单位正方形在 M 下的像（平行四边形）。det < 0 时自动换成 free 色（opt.flipColor 可关） */
export function paraFill(ctx, P, M, { color = C.i, alpha = 0.32, stroke = null, flipColor = true, o = [0, 0], scale = 1 } = {}) {
  const d = det2(M), q = (x, y) => P.S([o[0] + x * scale, o[1] + y * scale], M);
  const pts = [q(0, 0), q(1, 0), q(1, 1), q(0, 1)];
  const col = flipColor && d < -1e-6 ? C.free : color;
  polyFill(ctx, pts, { color: col, alpha, stroke: stroke ? (flipColor && d < -1e-6 ? C.free : stroke) : null });
  const c = [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2];
  return { c, d, pts };
}

/** 任意图形（数学坐标多边形）经 M 变换后的屏幕点 */
export const shapeMap = (P, M, pts) => pts.map(p => P.S(p, M));
export const circlePts = (cx, cy, r, n = 48) => Array.from({ length: n }, (_, k) => [cx + r * Math.cos(2 * Math.PI * k / n), cy + r * Math.sin(2 * Math.PI * k / n)]);

/** î′→ĵ′ 的方向小圆弧（屏幕上画），det 的符号决定方向与颜色 */
export function orientArc(ctx, P, M, { r = 0.55, alpha = 1, width = 5, colPos = C.ink, colNeg = C.free } = {}) {
  if (alpha <= 0) return; const d = det2(M); if (Math.abs(d) < 0.02) return;
  const ti = Math.atan2(M[1][0], M[0][0]), tj = Math.atan2(M[1][1], M[0][1]);
  const O = P.S([0, 0], M), R = r * P.u, col = d > 0 ? colPos : colNeg;
  // 屏幕 y 向下：数学逆时针 = canvas anticlockwise
  let a0 = -ti, a1 = -tj; const ccw = d > 0;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.strokeStyle = col; ctx.lineWidth = width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(O[0], O[1], R, a0, a1, ccw); ctx.stroke();
  // 箭头
  const ex = O[0] + R * Math.cos(a1), ey = O[1] + R * Math.sin(a1), tang = a1 + (ccw ? -Math.PI / 2 : Math.PI / 2);
  const h = 16; ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(ex + h * Math.cos(tang), ey + h * Math.sin(tang));
  ctx.lineTo(ex + h * 0.55 * Math.cos(tang + 2.3), ey + h * 0.55 * Math.sin(tang + 2.3));
  ctx.lineTo(ex + h * 0.55 * Math.cos(tang - 2.3), ey + h * 0.55 * Math.sin(tang - 2.3)); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** 面积读数标签（数值实时；接近整数时显示整数） */
export function areaLabel(K, c, d, { a = 1, px = 38, prefix = 'det = ', color = null, dy = 0 } = {}) {
  if (a <= 0) return; const v = Math.abs(d - Math.round(d)) < 0.04 ? Math.round(d) : Math.round(d * 10) / 10;
  const s = (v < 0 ? '−' : '') + Math.abs(v);
  K.tag(prefix + s, c[0], c[1] + dy, { px, a, align: 'center', color: color || (d < -0.02 ? C.free : C.ink), w: 900, font: F.serif });
}

// ── 行列式面板 ──
export class DetGrid {
  constructor(rows, { fmt = v => (typeof v === 'number' ? fmtNum(v) : String(v)) } = {}) { this.rows = rows; this.n = rows.length; this.m = rows[0].length; this.fmt = fmt; }
  layout({ x, y, px, cw = 1.9, rh = 1.5 }) {
    const W = this.m * px * cw, H = this.n * px * rh;
    return { x0: x - W / 2, y0: y - H / 2, W, H, cx: j => x - W / 2 + (j + 0.5) * px * cw, ry: i => y - H / 2 + (i + 0.5) * px * rh, cwp: px * cw, rhp: px * rh };
  }
  /**
   * o: x, y, px, a, bars（1 = 竖线 |A|，0 = 方括号；中间值交叉淡化）, strike {r, c, s}（划掉第 r 行第 c 列，s 0..1；s>1 后其余格收拢由调用方另画）,
   *    hi {'i,j': [alpha, color]}（格子底色）, color {'i,j': color}（数字颜色）, dim {'i,j': alpha}, signs s（正负号棋盘，画在格子右上角）, rows（覆盖数据，用于变形）
   */
  draw(ctx, o) {
    const a = o.a ?? 1; if (a <= 0) return null; const L = this.layout(o), px = o.px, rows = o.rows || this.rows;
    ctx.save(); ctx.globalAlpha *= a;
    // 底色
    for (const [k, [ha, col]] of Object.entries(o.hi || {})) {
      if (ha <= 0) continue; const [i, j] = k.split(',').map(Number);
      ctx.save(); ctx.globalAlpha *= ha * 0.32; ctx.fillStyle = col || C.peri; ctx.fillRect(L.cx(j) - L.cwp * 0.46, L.ry(i) - L.rhp * 0.44, L.cwp * 0.92, L.rhp * 0.88); ctx.restore();
    }
    // 括号 / 竖线
    const bars = o.bars ?? 1, bx0 = L.x0 - px * 0.15, bx1 = L.x0 + L.W + px * 0.15, by0 = L.y0 - 4, by1 = L.y0 + L.H + 4, e = px * 0.32;
    ctx.strokeStyle = o.barColor || C.ink; ctx.lineWidth = Math.max(3, px * 0.075); ctx.lineCap = 'round';
    if (bars < 1) { ctx.save(); ctx.globalAlpha *= 1 - bars; ctx.beginPath(); ctx.moveTo(bx0 + e, by0); ctx.lineTo(bx0, by0); ctx.lineTo(bx0, by1); ctx.lineTo(bx0 + e, by1); ctx.moveTo(bx1 - e, by0); ctx.lineTo(bx1, by0); ctx.lineTo(bx1, by1); ctx.lineTo(bx1 - e, by1); ctx.stroke(); ctx.restore(); }
    if (bars > 0) { ctx.save(); ctx.globalAlpha *= bars; ctx.beginPath(); ctx.moveTo(bx0, by0); ctx.lineTo(bx0, by1); ctx.moveTo(bx1, by0); ctx.lineTo(bx1, by1); ctx.stroke(); ctx.restore(); }
    // 数字
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const st = o.strike;
    for (let i = 0; i < this.n; i++) for (let j = 0; j < this.m; j++) {
      const v = rows[i][j], s = this.fmt(v), k = i + ',' + j;
      let al = o.dim && k in o.dim ? o.dim[k] : 1;
      if (st && (i === st.r || j === st.c) && !(i === st.r && j === st.c)) al *= 1 - 0.75 * clamp(st.s);
      ctx.save(); ctx.globalAlpha *= al; ctx.font = F.sans(px * (s.length > 3 ? 0.8 : 1), 500); ctx.fillStyle = (o.color && o.color[k]) || C.ink; ctx.fillText(s, L.cx(j), L.ry(i)); ctx.restore();
    }
    // 划掉行 / 列
    if (st && st.s > 0) {
      const s = clamp(st.s), col = st.color || C.free; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(4, px * 0.09); ctx.globalAlpha *= 0.85;
      if (st.r != null) { const yy = L.ry(st.r); ctx.beginPath(); ctx.moveTo(L.x0 - px * 0.2, yy); ctx.lineTo(lerp(L.x0 - px * 0.2, L.x0 + L.W + px * 0.2, s), yy); ctx.stroke(); }
      if (st.c != null) { const xx = L.cx(st.c); ctx.beginPath(); ctx.moveTo(xx, L.y0 - px * 0.15); ctx.lineTo(xx, lerp(L.y0 - px * 0.15, L.y0 + L.H + px * 0.15, s)); ctx.stroke(); }
      // 交点圈出 a_ij
      if (st.r != null && st.c != null) { ctx.globalAlpha = a * s; ctx.lineWidth = 4; ctx.strokeStyle = C.i; ctx.beginPath(); ctx.arc(L.cx(st.c), L.ry(st.r), px * 0.62, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
    }
    // 正负号棋盘
    if (o.signs > 0) {
      for (let i = 0; i < this.n; i++) for (let j = 0; j < this.m; j++) {
        const g = smooth(clamp(o.signs * (this.n * this.m) - (i * this.m + j))); if (g <= 0) continue;
        const pos = (i + j) % 2 === 0; ctx.save(); ctx.globalAlpha *= g; ctx.font = F.sans(px * 0.55, 900); ctx.fillStyle = pos ? C.j : C.free;
        ctx.fillText(pos ? '+' : '−', L.cx(j) + L.cwp * 0.36, L.ry(i) - L.rhp * 0.3); ctx.restore();
      }
    }
    ctx.restore();
    return L;
  }
}

/** 运算量柱状图（s2_2b） */
export function bars(ctx, items, { x, y, w, h, a = 1, grow = 1, log = false, max = null } = {}) {
  if (a <= 0) return; const mx = max ?? Math.max(...items.map(it => it.v)); const f = v => log ? Math.log10(1 + v) / Math.log10(1 + mx) : v / mx;
  const bw = w / items.length;
  ctx.save(); ctx.globalAlpha *= a;
  items.forEach((it, k) => {
    const g = clamp(it.g ?? grow), hh = h * f(it.v) * g, xx = x + k * bw + bw * 0.18;
    ctx.fillStyle = it.color || C.peri; ctx.fillRect(xx, y - hh, bw * 0.64, hh);
    ctx.font = F.sans(26, 700); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (g > 0.05) ctx.fillText(it.label || '', xx + bw * 0.32, y + 26);
    if (g > 0.6) { ctx.globalAlpha *= smooth((g - 0.6) / 0.4); ctx.font = F.sans(28, 900); ctx.fillStyle = it.color || C.peri; ctx.fillText(it.text ?? String(it.v), xx + bw * 0.32, y - hh - 24); }
    ctx.globalAlpha = a;
  });
  ctx.restore();
}
export { rgba };
