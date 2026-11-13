// 构成主义母题：四角星、细竖线、字间加点标题、实心圆、斜切色块。
import { C, F } from './tokens.js';
import { clamp, smooth } from '../core/util.js';

export function star4(ctx, x, y, r, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.beginPath();
  const k = r * 0.22;
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x + k, y - k, x + r, y); ctx.quadraticCurveTo(x + k, y + k, x, y + r);
  ctx.quadraticCurveTo(x - k, y + k, x - r, y); ctx.quadraticCurveTo(x - k, y - k, x, y - r); ctx.fill(); ctx.restore();
}
export function disc(ctx, x, y, r, color, alpha = 1) {
  if (r <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
/** 字间加点：'LINEAR' → L . I . N . E . A . R，两侧可带细线 */
export function dotted(ctx, text, x, y, px, color, { alpha = 1, rule = 0, gap = 0.55, font = F.serif } = {}) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = font(px, 700); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const chars = [...text]; const ws = chars.map(c => ctx.measureText(c).width); const dot = ctx.measureText('.').width; const sp = px * gap;
  const total = ws.reduce((a, b) => a + b, 0) + (chars.length - 1) * (dot + 2 * sp);
  let cx = x - total / 2;
  chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += ws[i]; if (i < chars.length - 1) { cx += sp; ctx.fillText('.', cx, y); cx += dot + sp; } });
  if (rule > 0) { ctx.strokeStyle = color; ctx.lineWidth = Math.max(1.5, px / 22); const m = px * 0.9;
    ctx.beginPath(); ctx.moveTo(x - total / 2 - m - rule, y); ctx.lineTo(x - total / 2 - m, y); ctx.moveTo(x + total / 2 + m, y); ctx.lineTo(x + total / 2 + m + rule, y); ctx.stroke(); }
  ctx.restore(); return total;
}
/** 左上角段落标识：四角星 + 细竖线 + 竖排小字（参考图左上） */
export function cornerMark(ctx, label, s = 1, alpha = 1) {
  const a = smooth(s); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  star4(ctx, 78, 92, 20 * a, C.peri);
  ctx.strokeStyle = C.peri; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(78, 136); ctx.lineTo(78, 136 + 300 * a); ctx.stroke();
  ctx.font = F.sans(20); ctx.fillStyle = C.inkMid; ctx.globalAlpha *= clamp(a * 1.4 - 0.4);
  [...label].forEach((c, i) => ctx.fillText(c, 98, 160 + i * 26));
  ctx.restore();
}
/** 斜切色块（转场用）：角度约 −18°，s 0→1 扫过全屏 */
export function slash(ctx, s, color, W, H, width = 900) {
  if (s <= 0 || s >= 1) return;
  const x = -width + (W + 2 * width) * s;
  ctx.save(); ctx.fillStyle = color; ctx.beginPath();
  const k = Math.tan(18 * Math.PI / 180) * H;
  ctx.moveTo(x, 0); ctx.lineTo(x + width, 0); ctx.lineTo(x + width - k, H); ctx.lineTo(x - k, H); ctx.closePath(); ctx.fill(); ctx.restore();
}
