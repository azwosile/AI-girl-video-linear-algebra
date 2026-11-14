// 2D 线性变换平面（3B1B 式）：网格、坐标轴、向量箭头、虚线、标注。数学坐标 y 向上。
import { C } from '../style/tokens.js';
import { clamp, smooth, apply2, rgba } from '../core/util.js';

export class Plane {
  /** ox,oy 原点屏幕坐标；u 每单位像素；R 网格半宽（单位） */
  constructor({ ox, oy, u, R = 10 }) { Object.assign(this, { ox, oy, u, R }); this.M = [[1, 0], [0, 1]]; }
  /** 数学坐标 → 屏幕（经过当前矩阵 M） */
  S(p, M = this.M) { const q = apply2(M, p); return [this.ox + q[0] * this.u, this.oy - q[1] * this.u]; }
  /** 网格线：grow 0..1 从原点向外画；只画 |k|≤R 的整数线 */
  grid(ctx, { M = this.M, color = C.paperHi, width = 2.2, alpha = 1, grow = 1, step = 1, dash = null, stagger = true } = {}) {
    if (alpha <= 0 || grow <= 0) return;
    const R = this.R; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash(dash);
    for (let k = -R; k <= R; k += step) {
      if (k === 0) continue;
      // 由内向外依次出现
      const g = stagger ? smooth(clamp(grow * 1.6 - Math.abs(k) / R * 0.6)) : smooth(grow);
      if (g <= 0) continue;
      ctx.globalAlpha = alpha * Math.min(1, g * 1.5);
      const L = R * g;
      for (const [a, b] of [[[k, -L], [k, L]], [[-L, k], [L, k]]]) {
        const p = this.S(a, M), q = this.S(b, M); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke();
      }
    }
    ctx.restore();
  }
  axes(ctx, { M = this.M, color = C.ink, width = 3, alpha = 1, grow = 1 } = {}) {
    if (alpha <= 0 || grow <= 0) return;
    const L = this.R * smooth(grow); ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
    for (const [a, b] of [[[-L, 0], [L, 0]], [[0, -L], [0, L]]]) { const p = this.S(a, M), q = this.S(b, M); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); }
    ctx.restore();
  }
  /** 直线 {p0 + t·d}，用于"直线仍是直线"高亮 */
  line(ctx, p0, d, { M = this.M, color = C.ink, width = 4, alpha = 1, grow = 1 } = {}) {
    if (alpha <= 0 || grow <= 0) return; const L = this.R * 1.5 * smooth(grow);
    const a = this.S([p0[0] - d[0] * L, p0[1] - d[1] * L], M), b = this.S([p0[0] + d[0] * L, p0[1] + d[1] * L], M);
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.restore();
  }
}

/** 屏幕坐标箭头。grow 0..1 从起点长出；halo 是外描边色（在色块上保持清晰） */
export function arrow(ctx, p, q, { color = C.ink, width = 6, head = 22, alpha = 1, grow = 1, halo = C.paperHi, haloW = 4, dash = null } = {}) {
  if (alpha <= 0 || grow <= 0) return;
  const g = clamp(grow), x = p[0] + (q[0] - p[0]) * g, y = p[1] + (q[1] - p[1]) * g;
  const dx = x - p[0], dy = y - p[1], L = Math.hypot(dx, dy); if (L < 0.5) return;
  const ux = dx / L, uy = dy / L, h = Math.min(head, L * 0.6), hw = h * 0.5;
  const bx = x - ux * h, by = y - uy * h;
  const tri = () => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(bx - uy * hw, by + ux * hw); ctx.lineTo(bx + uy * hw, by - ux * hw); ctx.closePath(); };
  ctx.save(); ctx.globalAlpha = alpha; ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
  if (dash) ctx.setLineDash(dash);
  for (const pass of halo ? [0, 1] : [1]) {
    const w = pass ? width : width + haloW * 2; ctx.strokeStyle = ctx.fillStyle = pass ? color : halo;
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(bx + ux * 1, by + uy * 1); ctx.stroke();
    ctx.setLineDash([]); tri(); if (!pass) { ctx.lineWidth = haloW * 2; ctx.stroke(); } ctx.fill(); if (dash) ctx.setLineDash(dash);
  }
  ctx.restore();
}

/** 虚线弧形引导箭头（"落到这里"） */
export function arcGuide(ctx, p, q, { bend = 0.3, color = C.ink, width = 2.5, alpha = 1, grow = 1 } = {}) {
  if (alpha <= 0 || grow <= 0) return;
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1];
  const cx = mx - dy * bend, cy = my + dx * bend, N = 40, n = Math.max(2, Math.round(N * clamp(grow)));
  const B = t => [(1 - t) * (1 - t) * p[0] + 2 * (1 - t) * t * cx + t * t * q[0], (1 - t) * (1 - t) * p[1] + 2 * (1 - t) * t * cy + t * t * q[1]];
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash([8, 9]); ctx.lineCap = 'round';
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const pt = B(i / N); i ? ctx.lineTo(...pt) : ctx.moveTo(...pt); } ctx.stroke(); ctx.restore();
}

/** 落点标记：空心圆 + 十字短线 */
export function target(ctx, p, { color = C.ink, r = 11, alpha = 1, s = 1 } = {}) {
  if (alpha <= 0 || s <= 0) return; const k = smooth(s);
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p[0], p[1], r * k, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p[0], p[1], 3.5 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
/** 扩散圆环脉冲（强调原点等） */
export function ring(ctx, p, s, { color = C.ink, r0 = 8, r1 = 46, width = 3 } = {}) {
  if (s <= 0 || s >= 1) return; ctx.save(); ctx.globalAlpha = 1 - s; ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.arc(p[0], p[1], r0 + (r1 - r0) * smooth(s), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
export { rgba };

/** 直线 a·x + b·y = c（数学坐标），按当前矩阵画；grow 从直线上离原点最近的点向两端长出 */
export function eqLine(ctx, P, a, b, c, opt = {}) {
  const n2 = a * a + b * b; if (n2 < 1e-9) return;
  const L = Math.sqrt(n2), p0 = [a * c / n2, b * c / n2], d = [-b / L, a / L];
  P.line(ctx, opt.at || p0, d, opt);
}
/** 直线上离原点最近的点（用于放标签） */
export function eqFoot(a, b, c) { const n2 = a * a + b * b; return [a * c / n2, b * c / n2]; }
