// 方程组 / 增广矩阵面板（MBoard）：同一份行数据，两种显示（方程组 mode=0 ↔ 矩阵 mode=1，可连续变形），
// 初等行变换按时间轴动画：交换（两行划弧换位）、倍乘、倍加（源行的 k 倍“幽灵行”滑到目标行，再逐格变数）。
// 用法：
//   const B = new MBoard([[1,2,1,3],[3,-1,-3,-1],[2,3,1,4]], { vars: ['x₁','x₂','x₃'] });
//   B.add(t0, t1, 2, 0, -3)   // R3 ← R3 − 3·R1（行号从 0 开始）
//   B.swap(t0, t1, 1, 2); B.scale(t0, t1, 1, -1); B.set(t0, t1, newRows)
//   B.draw(ctx, t, { x, y, px, mode, alpha, pivots:[{r,c,t0,t1}], stair, hiRows:{r:a}, heads, rhsA 常数列透明度, barA 竖线透明度 })
import { C, F } from '../style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, pulse } from '../core/util.js';

const VAR_FONT = px => `italic 500 ${px * 1.02}px "LA-Latin", serif`;
// 数字显示：整数照写；分数（分母 ≤ 12）写成 p/q；负号用 −
export const fmtNum = v => {
  const sg = v < -1e-9 ? '−' : '', x = Math.abs(v);
  if (Math.abs(x - Math.round(x)) < 1e-9) return sg + Math.round(x);
  for (let q = 2; q <= 12; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return `${sg}${p}/${q}`; }
  return sg + +x.toFixed(3);
};
const SUB = ['₁', '₂', '₃', '₄', '₅', '₆'];

export class MBoard {
  constructor(rows, { vars = null, aug = true } = {}) {
    this.rows0 = rows.map(r => r.slice()); this.aug = aug;
    this.n = rows[0].length - (aug ? 1 : 0); this.m = rows.length;
    this.vars = vars || Array.from({ length: this.n }, (_, i) => 'x' + SUB[i]);
    this.ops = []; this.states = [this.rows0];
  }
  _push(op, next) { op.k = this.ops.length; this.ops.push(op); this.states.push(next); return this; }
  get last() { return this.states[this.states.length - 1]; }
  /** R_dst ← R_dst + k·R_src */
  add(t0, t1, dst, src, k) { const R = this.last.map(r => r.slice()); R[dst] = R[dst].map((v, j) => v + k * R[src][j]); return this._push({ type: 'add', t0, t1, dst, src, kk: k }, R); }
  swap(t0, t1, i, j) { const R = this.last.map(r => r.slice()); [R[i], R[j]] = [R[j], R[i]]; return this._push({ type: 'swap', t0, t1, i, j }, R); }
  scale(t0, t1, i, k) { const R = this.last.map(r => r.slice()); R[i] = R[i].map(v => v * k); return this._push({ type: 'scale', t0, t1, i, kk: k }, R); }
  /** 直接换成另一组数（例如改一个常数），变化的格子交叉淡化 */
  set(t0, t1, rows) { return this._push({ type: 'set', t0, t1 }, rows.map(r => r.slice())); }
  /** 第 k 步之后的行数据 */
  rowsAfter(k) { return this.states[k]; }
  /** t 时刻：已完成的状态 + 正在进行的操作 */
  at(t) {
    let k = 0; for (const op of this.ops) if (t >= op.t0) k = op.k + 1;
    const op = this.ops[k - 1];
    if (op && t < op.t1) return { rows: this.states[k - 1], next: this.states[k], op, s: prog(t, op.t0, op.t1) };
    return { rows: this.states[k], next: null, op: null, s: 1, done: op };
  }
  /** 操作标签文字：R₂ − 3R₁ */
  static label(op) {
    const R = i => 'R' + SUB[i];
    if (op.type === 'add') { const a = Math.abs(op.kk); return `${R(op.dst)} ${op.kk < 0 ? '−' : '+'} ${a === 1 ? '' : a}${R(op.src)}`; }
    if (op.type === 'swap') return `${R(op.i)} ↔ ${R(op.j)}`;
    if (op.type === 'scale') return `${R(op.i)} × ${fmtNum(op.kk)}`;
    return '';
  }
  /** 布局：返回列中心 x（方程组 / 矩阵两种）、行 y、宽高 */
  layout(o) {
    const { x, y, px } = o, n = this.n, m = this.m;
    const rh = px * 1.5;
    // 矩阵：系数列宽 cw，竖线后常数列
    const cw = px * 1.75, bar = this.aug ? px * 0.9 : 0;
    const wM = cw * n + (this.aug ? bar + cw : 0);
    const mx = j => x - wM / 2 + cw * (j + 0.5) + (j >= n ? bar : 0);
    // 方程组：项宽 tw，运算符宽 ow，等号宽 ew
    const tw = px * 2.25, ow = px * 1.0, ew = px * 1.2;
    const wS = tw * n + ow * (n - 1) + ew + tw * 0.9;
    const sx = j => j < n ? x - wS / 2 + j * (tw + ow) + tw / 2 : x - wS / 2 + n * tw + (n - 1) * ow + ew + tw * 0.45;
    const opx = j => x - wS / 2 + j * (tw + ow) - ow / 2; // 第 j 项前的运算符
    const eqx = x - wS / 2 + n * tw + (n - 1) * ow + ew / 2;
    const ry = i => y - (m - 1) * rh / 2 + i * rh;
    return { rh, cw, bar, wM, mx, tw, ow, wS, sx, opx, eqx, ry, h: m * rh };
  }
  /** 某格在屏幕上的位置（mode 0..1 插值） */
  cell(o, r, c, mode = o.mode ?? 1) { const L = this.layout(o); return [lerp(L.sx(c), L.mx(c), smooth(mode)), L.ry(r)]; }

  draw(ctx, t, o) {
    const a0 = o.alpha ?? 1; if (a0 <= 0) return;
    const px = o.px, mode = smooth(o.mode ?? 1), L = this.layout(o), n = this.n;
    const st = this.at(t), op = st.op, s = st.s;
    const rowsA = st.rows, rowsB = st.next || st.rows;
    ctx.save(); ctx.textBaseline = 'middle';
    // 行的 y（交换时插值）与 x 偏移
    const rowY = i => {
      if (op && op.type === 'swap' && (i === op.i || i === op.j)) { const e = smoother(s), o2 = i === op.i ? op.j : op.i; return lerp(L.ry(i), L.ry(o2), e); }
      return L.ry(i);
    };
    const rowDX = i => (op && op.type === 'swap' && (i === op.i || i === op.j)) ? (i === op.i ? -1 : 1) * px * 1.1 * Math.sin(Math.PI * smoother(s)) : 0;
    // 行高亮底色
    if (o.hiRows) for (const [r, a] of Object.entries(o.hiRows)) {
      if (a <= 0) continue; const w = lerp(L.wS, L.wM, mode) + px * 1.2;
      ctx.globalAlpha = a0 * a * 0.22; ctx.fillStyle = o.hiColor || C.peri; ctx.fillRect(o.x - w / 2, L.ry(+r) - L.rh * 0.46, w, L.rh * 0.92);
    }
    // 括号与竖线（矩阵态）
    if (mode > 0.01) {
      ctx.globalAlpha = a0 * mode; ctx.strokeStyle = C.ink; ctx.lineWidth = Math.max(2.5, px * 0.06); ctx.lineCap = 'butt';
      const rA = this.aug ? (o.rhsA ?? 1) : 1, x0 = o.x - L.wM / 2 - px * 0.25, x1 = lerp(L.mx(n - 1) + L.cw / 2, o.x + L.wM / 2, this.aug ? smooth(rA) : 1) + px * 0.25, y0 = L.ry(0) - L.rh * 0.55, y1 = L.ry(this.m - 1) + L.rh * 0.55, k = px * 0.32;
      ctx.beginPath(); ctx.moveTo(x0 + k, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x0 + k, y1);
      ctx.moveTo(x1 - k, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1 - k, y1); ctx.stroke();
      if (this.aug && rA > 0.01 && (o.barA ?? 1) > 0) { ctx.globalAlpha = a0 * mode * rA * (o.barA ?? 1); const bx = L.mx(n) - L.cw / 2 - L.bar / 2; ctx.lineWidth = Math.max(1.6, px * 0.04); ctx.beginPath(); ctx.moveTo(bx, y0 + px * 0.15); ctx.lineTo(bx, y1 - px * 0.15); ctx.stroke(); }
    }
    // 列标题
    if (o.heads > 0 && mode > 0.5) {
      ctx.font = F.sans(px * 0.6, 500); ctx.fillStyle = C.inkMid; ctx.textAlign = 'center'; ctx.globalAlpha = a0 * o.heads * mode;
      for (let j = 0; j < n; j++) ctx.fillText(this.vars[j], L.mx(j), L.ry(0) - L.rh * 0.95);
      if (this.aug) ctx.fillText('b', L.mx(n), L.ry(0) - L.rh * 0.95);
    }
    // 台阶线
    if (o.stair > 0) this._stair(ctx, o, L, st.next && s > 0.6 ? rowsB : rowsA, a0 * o.stair);
    // 主元方框
    if (o.pivots) for (const p of o.pivots) {
      const g = smooth(prog(t, p.t0, p.t0 + 0.35)) * (p.t1 != null ? 1 - smooth(prog(t, p.t1, p.t1 + 0.3)) : 1); if (g <= 0) continue;
      const [cx, cy] = [lerp(L.sx(p.c), L.mx(p.c), mode), L.ry(p.r)], w = lerp(L.tw, L.cw * 0.86, mode) * (0.6 + 0.4 * g), h = L.rh * 0.8 * (0.6 + 0.4 * g);
      ctx.globalAlpha = a0 * g; ctx.strokeStyle = p.color || C.peri; ctx.lineWidth = 3.5; ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
    }
    // 各行
    const changed = (i, j) => st.next && rowsA[i][j] !== rowsB[i][j];
    for (let i = 0; i < this.m; i++) {
      const y = rowY(i), dx = rowDX(i);
      const flashRow = op && (op.type === 'add' ? op.dst === i : op.type === 'scale' ? op.i === i : op.type === 'set');
      const sw = op && op.type !== 'swap' && flashRow ? smooth(prog(s, 0.45, 0.85)) : 0; // 变数进度
      this._row(ctx, o, L, rowsA[i], rowsB[i], sw, y, dx, mode, a0, (j) => changed(i, j) && flashRow, pulse(s, 0.45, 0.55) * (flashRow ? 1 : 0), o.rowAlpha ? (o.rowAlpha[i] ?? 1) : 1);
    }
    // 倍加：幽灵行
    if (op && op.type === 'add') {
      // 幽灵行（k·R_src）先滑到目标行正下方停住，像竖式加法那样上下对齐；再并入目标行、目标行变数
      const g = smoother(prog(s, 0, 0.3)), mg = smoother(prog(s, 0.45, 0.6)), fade = 1 - smooth(prog(s, 0.52, 0.66));
      if (fade > 0) {
        const ghost = rowsA[op.src].map(v => v * op.kk), below = L.ry(op.dst) + L.rh * 0.74;
        const y = lerp(lerp(L.ry(op.src), below, g), L.ry(op.dst), mg), ga = a0 * fade * smooth(prog(s, 0, 0.12));
        const w = lerp(L.wS, L.wM, mode) + px * 1.6;
        if (op.dst < this.m - 1 && g > 0.6) { ctx.globalAlpha = ga * 0.92 * (1 - mg); ctx.fillStyle = o.ghostBg || C.disc; ctx.fillRect(o.x - w / 2, y - L.rh * 0.36, w, L.rh * 0.72); }
        this._row(ctx, o, L, ghost, ghost, 0, y, 0, mode, ga, () => false, 0, 1, C.peri);
        ctx.globalAlpha = ga * smooth(prog(s, 0.2, 0.32)) * (1 - mg); ctx.font = F.sans(px * 0.8, 700); ctx.fillStyle = C.peri; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('+', o.x - w / 2 - px * 0.1, y);
      }
    }
    // 操作标签
    if (o.labels !== false) {
      const lop = op || st.done;
      if (lop && lop.type !== 'set') {
        const la = smooth(prog(t, lop.t0 - 0.1, lop.t0 + 0.2)) * (1 - smooth(prog(t, lop.t1 + (o.labelHold ?? 1.0), lop.t1 + (o.labelHold ?? 1.0) + 0.3)));
        if (la > 0) {
          const r = lop.type === 'add' ? lop.dst : lop.type === 'scale' ? lop.i : Math.max(lop.i, lop.j);
          const lx = o.x + lerp(L.wS, L.wM, mode) / 2 + px * 0.9;
          ctx.globalAlpha = a0 * la; ctx.font = F.sans(px * 0.72, 700); ctx.textAlign = 'left'; ctx.fillStyle = C.peri;
          ctx.fillText(MBoard.label(lop), lx, L.ry(r));
          if (lop.type === 'swap') { ctx.strokeStyle = C.peri; ctx.lineWidth = 2.5; const y0 = L.ry(lop.i), y1 = L.ry(lop.j); ctx.beginPath(); ctx.moveTo(lx - px * 0.3, y0); ctx.lineTo(lx - px * 0.45, y0); ctx.lineTo(lx - px * 0.45, y1); ctx.lineTo(lx - px * 0.3, y1); ctx.stroke(); }
        }
      }
    }
    ctx.restore();
  }

  // 一行：方程组项 / 矩阵数，mode 插值；A→B 交叉淡化（sw），变化格闪橙
  _row(ctx, o, L, A, B, sw, y, dx, mode, a0, isChanged, flash, rowA = 1, force = null) {
    const px = o.px, n = this.n;
    const term = (row, j) => { // 方程组里第 j 项：{op, num, v}
      const v = row[j]; if (j >= n) return { op: '', num: fmtNum(v), v: '' };
      const first = row.slice(0, j).every(q => q === 0);
      if (v === 0) return { op: '', num: '', v: '', zero: true };
      const a = Math.abs(v), numS = a === 1 ? '' : String(a);
      if (first) return { op: '', num: (v < 0 ? '−' : '') + numS, v: this.vars[j] };
      return { op: v < 0 ? '−' : '+', num: numS, v: this.vars[j] };
    };
    const allZero = row => row.slice(0, n).every(q => q === 0);
    ctx.textAlign = 'center';
    for (let j = 0; j <= n - (this.aug ? 0 : 1); j++) {
      const xS = L.sx(j) + dx, xM = L.mx(j) + dx, xx = lerp(xS, xM, mode);
      for (const [row, w] of [[A, 1 - sw], [B, sw]]) {
        if (w <= 0.003) continue;
        const ch = isChanged(j), col = force || (ch && w === sw ? C.periLt : C.ink);
        const aa = a0 * w * rowA * (j >= n ? (o.rhsA ?? 1) : 1);
        // 矩阵态的数
        if (mode > 0.01) { ctx.globalAlpha = aa * mode; ctx.font = F.sans(px, 500); ctx.fillStyle = col; ctx.fillText(fmtNum(row[j]), xx, y); }
        // 方程组态
        if (mode < 0.99) {
          const tm = term(row, j), am = aa * (1 - mode);
          if (j < n && allZero(row) && j === 0) { ctx.globalAlpha = am; ctx.font = F.sans(px, 500); ctx.fillStyle = col; ctx.fillText('0', xx, y); }
          if (tm.op) { ctx.globalAlpha = am; ctx.font = F.sans(px, 500); ctx.fillStyle = col; ctx.fillText(tm.op, L.opx(j) + dx, y); }
          if (tm.num || tm.v) {
            ctx.font = F.sans(px, 500); const wn = ctx.measureText(tm.num).width; ctx.font = VAR_FONT(px); const wv = ctx.measureText(tm.v).width;
            const x0 = xx - (wn + wv) / 2;
            ctx.globalAlpha = am; ctx.fillStyle = col; ctx.textAlign = 'left';
            ctx.font = F.sans(px, 500); ctx.fillText(tm.num, x0, y);
            ctx.font = VAR_FONT(px); ctx.fillText(tm.v, x0 + wn, y);
            ctx.textAlign = 'center';
          }
        }
      }
      if (flash > 0 && isChanged(j)) { ctx.globalAlpha = a0 * flash * 0.5; ctx.fillStyle = C.peri; ctx.beginPath(); ctx.arc(xx, y, px * 0.7, 0, Math.PI * 2); ctx.fill(); }
    }
    // 等号（方程组态）
    if (this.aug && mode < 0.99) { ctx.globalAlpha = a0 * (1 - mode) * rowA * (o.rhsA ?? 1); ctx.font = F.sans(px, 500); ctx.fillStyle = force || C.ink; ctx.fillText('=', L.eqx + dx, y); }
  }

  _stair(ctx, o, L, rows, a) {
    const n = this.n, lead = rows.map(r => r.slice(0, n).findIndex(v => v !== 0));
    const pts = []; const left = c => L.mx(c) - L.cw / 2;
    let prevC = null;
    rows.forEach((r, i) => {
      const c = lead[i]; if (c < 0) return;
      const yTop = L.ry(i) - L.rh / 2, yBot = L.ry(i) + L.rh / 2;
      if (prevC == null) pts.push([left(c), yTop]); else pts.push([left(c), yTop]);
      pts.push([left(c), yBot]); prevC = c;
      const nc = lead.slice(i + 1).find(q => q >= 0);
      if (nc != null) pts.push([left(nc), yBot]); else pts.push([L.mx(n - 1) + L.cw / 2, yBot]);
    });
    if (pts.length < 2) return;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); ctx.restore();
  }
}
