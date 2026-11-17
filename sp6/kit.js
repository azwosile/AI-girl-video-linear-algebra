// 特别篇 6 公用小件（叠在 sp/common.js 的 B 上）：逐步消元板、丝线（列关系）、列框、行表、打字行、
// 套路卡、故障特效、倒计时、四个基本子空间十字图。所有函数都是纯绘制，时间全部来自 B.t。
import { C, F, lerp, prog, smooth, smoother, outCubic, outBack, rgba, DX, DY, OK, arrow } from '../sp/common.js';

export const neg = v => String(v).replace(/-/g, '−');
export const vec = a => '(' + a.map(neg).join(', ') + ')';

export function kit(B) {
  const { ctx, gin, ctag } = B;
  const t = () => B.t;
  const K = {};

  /** 逐步消元板：S 状态表，T 每个状态的起始时刻（T[0] 忽略），ops[k] = [[行, '标签'], ...]
   *  opt: x, y, px, bar, a, hi(i,j,k)→颜色, lx, opHold, cw, rh；返回 { M, k } */
  K.steps = (S, T, ops, opt) => {
    let k = 0; for (let q = 1; q < S.length; q++) if (t() >= T[q]) k = q;
    const prev = k ? S[k - 1] : S[0], fresh = k ? gin(T[k], 0.5) : 1, a = opt.a ?? 1;
    const M = B.mat(opt.x, opt.y, S[k], { px: opt.px ?? 38, a, bar: opt.bar ?? null, cw: opt.cw ?? null, rh: opt.rh ?? null, cell: (i, j) => {
      const ch = neg(S[k][i][j]) !== neg(prev[i][j]);
      const hc = opt.hi ? opt.hi(i, j, k) : null;
      return { txt: neg(S[k][i][j]), col: ch && fresh < 1 ? C.j : (hc || C.ink), a: ch ? 0.3 + 0.7 * fresh : 1 };
    } });
    if (k > 0 && ops && ops[k]) {
      const lx = opt.lx ?? opt.x - M.w / 2 - 90;
      ops[k].forEach(([i, tx]) => ctag(tx, lx, M.cell(i, 0)[1], { px: 26, a: a * gin(T[k] - 0.4) * (1 - gin(T[k] + (opt.opHold ?? 4.5))), color: C.j, font: F.serif }));
    }
    return { M, k };
  };

  /** 圆环（主元圈），s 为描边进度 */
  K.ring = (x, y, r, col, a, s = 1, w = 4) => {
    if (a <= 0 || s <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * smoother(Math.min(1, s))); ctx.stroke(); ctx.restore();
  };
  /** 列框：第 j 列（行 i0..i1）半透明填色 + 描边 */
  K.colBox = (M, j, i0, i1, col, a, pad = 28) => {
    if (a <= 0) return; const [x, y0] = M.cell(i0, j), y1 = M.cell(i1, j)[1];
    ctx.save(); ctx.globalAlpha = a * 0.16; ctx.fillStyle = col; ctx.fillRect(x - pad, y0 - pad, pad * 2, y1 - y0 + pad * 2);
    ctx.globalAlpha = a * 0.9; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x - pad, y0 - pad, pad * 2, y1 - y0 + pad * 2); ctx.restore();
  };
  /** 行框 */
  K.rowBox = (M, i, j0, j1, col, a, pad = 26) => {
    if (a <= 0) return; const [x0, y] = M.cell(i, j0), x1 = M.cell(i, j1)[0];
    ctx.save(); ctx.globalAlpha = a * 0.16; ctx.fillStyle = col; ctx.fillRect(x0 - pad - 6, y - pad, x1 - x0 + 2 * pad + 12, pad * 2);
    ctx.globalAlpha = a * 0.9; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x0 - pad - 6, y - pad, x1 - x0 + 2 * pad + 12, pad * 2); ctx.restore();
  };

  /** 丝线：从点 p 拉到点 q 的发光弧线（s 0..1 生长），可带系数标签 */
  K.thread = (p, q, s, col, a, { lift = 90, label = null, px = 28, width = 4 } = {}) => {
    if (a <= 0 || s <= 0) return; const e = smoother(Math.min(1, s)), N = 40;
    const P = u => [lerp(p[0], q[0], u), lerp(p[1], q[1], u) - Math.sin(Math.PI * u) * lift];
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = width; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.lineCap = 'round';
    ctx.beginPath(); for (let k = 0; k <= N * e; k++) { const [x, y] = P(k / N); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    const [hx, hy] = P(e); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(hx, hy, 7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (label && e > 0.5) { const [mx, my] = P(0.5); B.card(mx, my - 6, label.length * px * 0.62 + 30, px + 18, a * smooth((e - 0.5) * 2) * 0.95, col); ctag(label, mx, my - 6, { px, a: a * smooth((e - 0.5) * 2), color: col, font: F.serif }); }
  };
  /** 从矩阵 M 的第 j 列顶端连到若干列：targets [[列, '系数'], ...]，t0 开始，每根间隔 gap */
  K.threads = (M, j, targets, t0, col, a, { gap = 0.45, dy = -30, lift = 90, i0 = 0, h = null } = {}) => {
    const [xj, yj] = M.cell(i0, j);
    targets.forEach(([c, lab], k) => { const [xc] = M.cell(i0, c); K.thread([xj, yj + dy - (h ?? 0)], [xc, yj + dy - (h ?? 0)], prog(t(), t0 + k * gap, t0 + k * gap + 0.8), col, a, { lift: lift + Math.abs(j - c) * 12, label: lab }); });
  };

  /** 行表：rows = [[标签, 内容, t0, 颜色], ...]，左对齐两栏 */
  K.table = (rows, x, y, a, { dy = 60, w1 = 170, px = 30, fade = null } = {}) => {
    rows.forEach(([h, v, t0, col], q) => {
      const g = a * gin(t0); if (g <= 0) return; const yy = y + q * dy;
      ctag(h, x, yy, { px, a: g, color: col ?? C.ink, align: 'left' });
      ctag(v, x + w1, yy, { px, a: g, color: col ?? C.ink, font: F.serif, align: 'left' });
    });
  };
  /** 打字行：文字按 [t0, t0+d] 逐字出现，带光标 */
  K.type = (text, x, y, t0, d, a, { px = 30, col = C.ink, align = 'left', font = F.serif } = {}) => {
    if (a <= 0) return; const u = prog(t(), t0, t0 + d); if (u <= 0) return;
    const chars = [...text], n = Math.ceil(chars.length * u), s = chars.slice(0, n).join('');
    ctag(s, x, y, { px, a, color: col, align, font });
    if (u < 1) { ctx.save(); ctx.font = font(px); const w = ctx.measureText(s).width; ctx.globalAlpha = a * (Math.sin(t() * 18) > 0 ? 1 : 0.2); ctx.fillStyle = C.peri; const x0 = align === 'left' ? x : x - w / 2; ctx.fillRect(x0 + w + 4, y - px * 0.5, 3, px); ctx.restore(); }
  };
  /** 小标签（圆角色块 + 字），用在行首 */
  K.pill = (text, x, y, col, a, px = 22) => {
    if (a <= 0) return; ctx.save(); ctx.font = F.sans(px, 900); const w = ctx.measureText(text).width + 22;
    ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - w / 2, y - px * 0.8, w, px * 1.6, px * 0.8); ctx.fill();
    ctx.fillStyle = C.paperHi; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1); ctx.restore();
  };

  /** 套路卡（圆盘中央）：items 文字、ts 出现时刻 */
  K.recipeCard = (title, items, ts, a, { y = DY - 60, w = 900, col = C.peri, hiIdx = -1 } = {}) => {
    if (a <= 0) return; const h = 110 + items.length * 58;
    B.card(DX, y, w, h, a, col);
    ctag(title, DX - w / 2 + 40, y - h / 2 + 42, { px: 30, a, color: col, font: F.serif, align: 'left' });
    items.forEach((l, k) => ctag(l, DX - w / 2 + 50, y - h / 2 + 104 + k * 58, { px: 31, a: a * gin(ts[k]), color: k === hiIdx ? C.free : C.ink, align: 'left' }));
    B.burst(DX + w / 2 - 50, y - h / 2 + 40, ts[0], col, { r1: 100, n: 12 });
  };

  /** 故障特效：红色扫描线 + 色散错位条 + 轻微抖动（t0..t1，k 强度） */
  K.glitch = (t0, t1, k = 1) => {
    const tt = t(); if (tt < t0 || tt > t1) return; const u = prog(tt, t0, t1), env = Math.sin(Math.PI * u) * k;
    const rnd = (n) => { const x = Math.sin(n * 127.1 + Math.floor(tt * 24) * 311.7) * 43758.5453; return x - Math.floor(x); };
    ctx.save();
    for (let i = 0; i < 9; i++) {
      const y = rnd(i) * 1080, h = 6 + rnd(i + 20) * 40, dx = (rnd(i + 40) - 0.5) * 120 * env;
      ctx.globalAlpha = 0.35 * env; ctx.fillStyle = i % 3 === 0 ? '#FF2B4A' : i % 3 === 1 ? '#2BE0FF' : C.ink; ctx.fillRect(dx, y, 1920, h * 0.25);
    }
    const sy = (tt * 900) % 1300 - 110; const g = ctx.createLinearGradient(0, sy - 60, 0, sy + 60);
    g.addColorStop(0, 'rgba(255,40,70,0)'); g.addColorStop(0.5, 'rgba(255,40,70,0.55)'); g.addColorStop(1, 'rgba(255,40,70,0)');
    ctx.globalAlpha = env; ctx.fillStyle = g; ctx.fillRect(0, sy - 60, 1920, 120);
    ctx.globalAlpha = 0.08 * env; ctx.fillStyle = '#FF2B4A'; for (let y = 0; y < 1080; y += 6) ctx.fillRect(0, y, 1920, 2);
    ctx.restore();
  };
  /** 暗角（0..1） */
  K.vignette = (a) => {
    if (a <= 0) return; const g = ctx.createRadialGradient(960, 540, 300, 960, 540, 1150);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.75)'); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
  };
  /** 红色印章（字可自定，倾斜盖下） */
  K.redStamp = (text, x, y, s, a, col = C.free, px = 54) => {
    if (s <= 0 || a <= 0) return; const k = lerp(2.0, 1, outBack(Math.min(1, s), 2.2));
    ctx.save(); ctx.globalAlpha = a * smooth(Math.min(1, s * 2)); ctx.translate(x, y); ctx.rotate(-0.16); ctx.scale(k, k);
    ctx.font = F.serif(px, 900); const w = ctx.measureText(text).width + 60, h = px * 1.7;
    ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
  };

  /** 倒计时：从 t0 开始以 from 秒倒数，到 tStop 定格（返回剩余秒数） */
  K.countdown = (x, y, t0, from, tStop, a, { reset = null } = {}) => {
    if (a <= 0) return; const base = reset != null && t() >= reset ? reset : t0;
    const el = Math.max(0, Math.min(t(), tStop ?? 1e9) - base), left = Math.max(0, from - el);
    const mm = Math.floor(left / 60), ss = Math.floor(left % 60), frac = left % 1;
    const txt = `${mm}:${String(ss).padStart(2, '0')}`;
    ctx.save(); ctx.globalAlpha = a; B.card(x, y, 210, 84, a, left < 30 ? C.free : C.peri);
    ctx.strokeStyle = left < 30 ? C.free : C.peri; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x - 64, y, 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (left / from)); ctx.stroke(); ctx.restore();
    ctag(txt, x + 24, y + 2, { px: 46, a, color: tStop != null && t() >= tStop ? OK : C.ink, font: F.serif });
    if (tStop == null || t() < tStop) { ctx.save(); ctx.globalAlpha = a * 0.6 * (1 - frac); ctx.fillStyle = C.peri; ctx.beginPath(); ctx.arc(x - 64, y, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    return left;
  };

  /** 四个基本子空间十字图：左框 ℝⁿ（行空间 / 零空间），右框 ℝᵐ（列空间 / 左零空间）
   *  o: { a, x, y, w, h, gap, labels:{row,nul,col,lnul}, dims:{...}, dimA, boxA:{row,nul,col,lnul}, arrowS, zeroS, n:'ℝⁿ', m:'ℝᵐ', fill:{...} } */
  K.fourSub = (o) => {
    const a = o.a; if (a <= 0) return;
    const x = o.x ?? DX, y = o.y ?? DY - 20, w = o.w ?? 320, h = o.h ?? 380, gap = o.gap ?? 200;
    const L = x - gap / 2 - w / 2, R = x + gap / 2 + w / 2, hTop = h * (o.split ?? 0.55);
    const box = (cx, top, bh, col, lab, dim, ba, sub) => {
      if (ba <= 0) return; ctx.save(); ctx.globalAlpha = a * ba * 0.22; ctx.fillStyle = col; ctx.fillRect(cx - w / 2, top, w, bh);
      ctx.globalAlpha = a * ba; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(cx - w / 2, top, w, bh); ctx.restore();
      ctag(lab, cx, top + bh / 2 - (sub ? 22 : 0) - (dim ? 14 : 0), { px: 30, a: a * ba, color: col });
      if (sub) ctag(sub, cx, top + bh / 2 + 12 - (dim ? 14 : 0), { px: 24, a: a * ba, color: C.ink, font: F.serif });
      if (dim) ctag(dim, cx, top + bh / 2 + (sub ? 46 : 26), { px: 30, a: a * ba * (o.dimA ?? 0), color: C.ink, font: F.serif });
    };
    const ba = o.boxA || {}, lb = o.labels || {}, dm = o.dims || {}, fl = o.fill || {};
    const top = y - h / 2;
    box(L, top, hTop, C.i, lb.row ?? '行空间 R(Aᵀ)', dm.row ?? 'dim = r', ba.row ?? 1, fl.row);
    box(L, top + hTop + 8, h - hTop - 8, C.free, lb.nul ?? '零空间 N(A)', dm.nul ?? 'dim = n − r', ba.nul ?? 1, fl.nul);
    box(R, top, hTop, C.j, lb.col ?? '列空间 R(A)', dm.col ?? 'dim = r', ba.col ?? 1, fl.col);
    box(R, top + hTop + 8, h - hTop - 8, C.k, lb.lnul ?? '左零空间 N(Aᵀ)', dm.lnul ?? 'dim = m − r', ba.lnul ?? 1, fl.lnul);
    ctag(o.n ?? 'ℝⁿ', L, top - 34, { px: 38, a, color: C.ink, font: F.serif }); ctag(o.m ?? 'ℝᵐ', R, top - 34, { px: 38, a, color: C.ink, font: F.serif });
    const s = o.arrowS ?? 1;
    if (s > 0) {
      arrow(ctx, [L + w / 2 + 12, top + hTop / 2], [R - w / 2 - 12, top + hTop / 2], { color: C.peri, width: 6, head: 22, alpha: a, grow: s });
      ctag('A', x, top + hTop / 2 - 34, { px: 40, a: a * s, color: C.peri, font: F.serif });
      ctag('一对一', x, top + hTop / 2 + 34, { px: 22, a: a * s * (o.oneA ?? 0), color: C.peri });
    }
    const z = o.zeroS ?? 0;
    if (z > 0) {
      const p0 = [L + w / 2 + 12, top + hTop + (h - hTop) / 2], p1 = [x + 10, top + hTop + (h - hTop) / 2 + 10];
      arrow(ctx, p0, p1, { color: C.free, width: 5, head: 18, alpha: a, grow: z });
      B.dot(x + 22, p1[1], 9, C.free, a * z); ctag('0', x + 46, p1[1], { px: 30, a: a * z, color: C.free, font: F.serif });
    }
    return { L, R, top, hTop, w, h };
  };

  /** 纵向向量（canvas 画的括号列），返回宽度 */
  K.cvec = (x, y, v, a, { px = 34, col = C.ink, brk = C.ink } = {}) => B.mat(x, y, v.map(q => [q]), { px, a, col, brk, cell: () => ({ col }) });

  /** 一句话横幅（顶部、圆盘上沿下方） */
  K.banner = (text, a, col = C.peri, y = DY - 405) => B.qhead(text, a, col);
  return K;
}
