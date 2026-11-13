// 通用数学 / 缓动 / 颜色工具。全部是纯函数。
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, s) => a + (b - a) * s;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const smooth = s => { s = clamp(s); return s * s * (3 - 2 * s); };
export const smoother = s => { s = clamp(s); return s * s * s * (s * (6 * s - 15) + 10); };
export const outCubic = s => { s = clamp(s); return 1 - Math.pow(1 - s, 3); };
export const inCubic = s => { s = clamp(s); return s * s * s; };
export const outBack = (s, k = 1.5) => { s = clamp(s); const c = k + 1; return 1 + c * Math.pow(s - 1, 3) + k * Math.pow(s - 1, 2); };
/** 窗口淡入淡出：t 在 [a,b] 内为 1，前后各 fi/fo 秒过渡 */
export const win = (t, a, b, fi = 0.3, fo = 0.3) => Math.min(smooth(prog(t, a - fi, a)), 1 - smooth(prog(t, b, b + fo)));
/** 一次性脉冲：t0 起 0→1→0，持续 d 秒 */
export const pulse = (t, t0, d = 0.6) => { const s = prog(t, t0, t0 + d); return s <= 0 || s >= 1 ? 0 : Math.sin(Math.PI * s); };
export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
export function rgba(h, a = 1) { const [r, g, b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; }
export function mixColor(h1, h2, s) { const a = hex2rgb(h1), b = hex2rgb(h2); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], clamp(s))).toString(16).padStart(2, '0')).join(''); }
/** 2×2 矩阵 [[a,b],[c,d]] 插值：(1−s)I + sA（与 3B1B 一致） */
export const mlerp2 = (A, s) => [[lerp(1, A[0][0], s), lerp(0, A[0][1], s)], [lerp(0, A[1][0], s), lerp(1, A[1][1], s)]];
export const mlerp3 = (A, s) => A.map((r, i) => r.map((v, j) => lerp(i === j ? 1 : 0, v, s)));
export const apply2 = (M, [x, y]) => [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
