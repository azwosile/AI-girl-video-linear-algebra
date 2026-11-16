// 特别篇公用骨架（以 ch04/common.js 为底）：原题上屏（paper）、套路卡、答案框、连击计数、坐标里程表、
// 闪光 / 粒子爆点、带符号的行变换面板（SBoard）。速成版 spx/ 与完整版 sp01–sp07 共用。
// 用法：
//   import { base, loadExam, SBoard, ... } from '../../sp/common.js';
//   const EX = await loadExam(['y1819_q1']);
//   const B = base(R, {...});                     // 与 ch04 相同的参数
//   B.paper(EX, 'y1819_q1', { t0, dock, out });   // 整页飞入 → 推近描框 → 纸卡 → 停到左栏
import { base as base4, C, F, lerp, prog, smooth, smoother, outCubic, outBack, win, rgba, DX, DY, DR, LX, arrow } from '../ch04/common.js';
import { loadImage, loadJSON } from '../engine/core/stage.js';
import { MBoard, fmtNum } from '../engine/la2d/mboard.js';

export * from '../ch04/common.js';
export { MBoard, fmtNum };

const ROOT = new URL('../', import.meta.url).href;

/** 读原题裁切表与图片：返回 { spec, img:{key}, page:{页名} } */
export async function loadExam(keys) {
  const spec = await loadJSON(ROOT + 'sp/exam_crops.json');
  const img = {}, page = {};
  await Promise.all(keys.map(async k => {
    img[k] = await loadImage(`${ROOT}assets/exam/${k}.png`);
    const pn = spec[k].src[0][0];
    if (!page[pn]) page[pn] = loadImage(`${ROOT}assets/exam/pages/${pn}.jpg`).catch(() => null);
  }));
  for (const k of Object.keys(page)) page[k] = await page[k];
  return { spec, img, page };
}

/** 行变换面板：允许格子里放字符串（参数，如 'a−5'）。倍加时给出 over（结果行），字符串格按 over 取值 */
export class SBoard extends MBoard {
  add(t0, t1, dst, src, k, over = null) {
    const R = this.last.map(r => r.slice());
    R[dst] = R[dst].map((v, j) => (typeof v === 'number' && typeof R[src][j] === 'number') ? v + k * R[src][j] : over[j]);
    return this._push({ type: 'add', t0, t1, dst, src, kk: k }, R);
  }
}

export function base(R, o) {
  const B = base4(R, o);
  const { ctx, K, S } = B;
  const t = () => S.t;

  // ── 原题上屏 ──
  // T: { t0 开始, dock 停到左栏的时刻, out 离场时刻, side:{x,y,w,hMax} 左栏位置, big:{w,hMax} 推近后大小 }
  B.paper = (EX, key, T) => {
    const tt = t(); if (tt < T.t0 - 0.1 || (T.out != null && tt > T.out + 0.6)) return null;
    const sp = EX.spec[key], im = EX.img[key], pg = EX.page[sp.src[0][0]], r = sp.src[0];
    const outA = T.out != null ? 1 - smooth(prog(tt, T.out, T.out + 0.5)) : 1;
    const big = T.big || {}, side = T.side || {};
    // 纸卡的“大”状态（圆盘中央）与“侧”状态（左栏）
    const fit = (w, hMax) => { let W = w, H = W * im.height / im.width; if (H > hMax) { H = hMax; W = H * im.width / im.height; } return [W, H]; };
    const [bw, bh] = fit(big.w ?? 1000, big.hMax ?? 620), [sw, sh] = fit(side.w ?? 620, side.hMax ?? 400);
    const bx = big.x ?? DX, by = big.y ?? DY - 40;
    const sx = side.x ?? (LX + sw / 2 - 20), sy = side.y ?? (178 + sh / 2);
    const t0 = T.t0, dock = T.dock ?? t0 + 4;
    ctx.save();
    // 阶段 A/B：整页飞入、描框、推近（有页图才做）
    const pA = smooth(prog(tt, t0, t0 + 0.8)), push = smoother(prog(tt, t0 + 1.5, t0 + 2.5)), cross = smooth(prog(tt, t0 + 2.2, t0 + 2.7));
    if (pg && cross < 1 && tt < dock) {
      const ph = 920, pw = ph * pg.width / pg.height;
      // 裁切框在整页里的位置（像素，页面坐标）
      const cx0 = r[1] * pw, cy0 = r[2] * ph, cx1 = r[3] * pw, cy1 = r[4] * ph;
      // 推近：让裁切框宽度变成 bw，中心移到 (bx,by)
      const k = lerp(1, bw / (cx1 - cx0), push);
      const ccx = (cx0 + cx1) / 2, ccy = (cy0 + cy1) / 2;
      const ox = lerp(DX - pw / 2 + 380 * (1 - pA), bx - ccx * k, push), oy = lerp(DY - ph / 2, by - ccy * k, push);
      const rot = lerp(0.12, -0.025, pA) * (1 - push);
      ctx.globalAlpha = pA * (1 - cross) * outA;
      ctx.translate(DX, DY); ctx.rotate(rot); ctx.translate(-DX, -DY);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(ox + 14, oy + 18, pw * k, ph * k);
      ctx.drawImage(pg, ox, oy, pw * k, ph * k);
      // 橙框描边
      const s = smooth(prog(tt, t0 + 0.8, t0 + 1.5));
      if (s > 0) {
        const X0 = ox + cx0 * k - 8, Y0 = oy + cy0 * k - 8, X1 = ox + cx1 * k + 8, Y1 = oy + cy1 * k + 8, per = 2 * (X1 - X0 + Y1 - Y0);
        ctx.strokeStyle = C.peri; ctx.lineWidth = 6; ctx.setLineDash([per * s, per]); ctx.strokeRect(X0, Y0, X1 - X0, Y1 - Y0); ctx.setLineDash([]);
        ctx.globalAlpha *= 0.12 * s; ctx.fillStyle = C.peri; ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    // 阶段 C：纸卡（大 → 侧）
    const ca = (pg ? cross : smooth(prog(tt, t0, t0 + 0.5))) * outA;
    let box = null;
    if (ca > 0) {
      const m = smoother(prog(tt, dock, dock + 0.8));
      const w = lerp(bw, sw, m), h = lerp(bh, sh, m), x = lerp(bx, sx, m), y = lerp(by, sy, m);
      ctx.globalAlpha = ca;
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(x - w / 2 + 10, y - h / 2 + 12, w, h);
      ctx.drawImage(im, x - w / 2, y - h / 2, w, h);
      ctx.strokeStyle = rgba(C.ink, 0.5); ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h / 2, w, h);
      // 角标（盖章）
      const st = smooth(prog(tt, t0 + 2.5, t0 + 2.9)), sk = lerp(1.6, 1, outBack(st, 2));
      if (st > 0) {
        const fs = lerp(30, 22, m); ctx.font = F.sans(fs, 900); const tw = ctx.measureText(sp.tag).width + 28;
        ctx.save(); ctx.translate(x + w / 2 - tw / 2 + 10, y - h / 2 - fs * 0.9); ctx.rotate(-0.04); ctx.scale(sk, sk);
        ctx.globalAlpha = ca * st; ctx.fillStyle = C.peri; ctx.fillRect(-tw / 2, -fs * 0.8, tw, fs * 1.6);
        ctx.fillStyle = C.paperHi; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(sp.tag, 0, 1); ctx.restore();
      }
      box = { x, y, w, h };
    }
    ctx.restore();
    return box;
  };

  // ── 套路卡（左栏，原题纸卡下方）──
  B.recipe = (label, text, y, a, col = C.peri, { x = LX - 10, w = 560, px = 30 } = {}) => {
    if (a <= 0) return; const g = outCubic(Math.min(1, a * 1.2));
    ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - g) * -40, 0);
    ctx.fillStyle = rgba(C.paperHi, 0.9); ctx.fillRect(x, y - 40, w, 80); ctx.fillStyle = col; ctx.fillRect(x, y - 40, 8, 80);
    ctx.font = F.sans(22, 900); ctx.fillStyle = col; ctx.textBaseline = 'middle'; ctx.fillText(label, x + 24, y - 18);
    ctx.font = F.sans(px, 700); ctx.fillStyle = C.ink; ctx.fillText(text, x + 24, y + 14);
    ctx.restore();
  };

  // ── 题头（圆盘上沿）──
  B.qhead = (text, a, col = C.peri) => K.tag(text, DX, DY - 405, { align: 'center', w: 900, px: 30, a, color: col });

  // ── 答案框：发光描边 + 结论 tex ──
  B.answer = (k, x, y, px, a, { w = null, h = null, col = C.j, glow = 1 } = {}) => {
    if (a <= 0) return;
    const pl = B.tex.place(k, x, y, px, 'c'), W = w ?? pl.w + 60, H = h ?? pl.h + 40;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(C.paperHi, 0.85); ctx.fillRect(x - W / 2, y - H / 2, W, H);
    ctx.shadowColor = col; ctx.shadowBlur = 24 * glow; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.strokeRect(x - W / 2, y - H / 2, W, H); ctx.restore();
    B.tex.draw(ctx, pl, { alpha: a, color: C.ink });
  };

  // ── 粒子爆点（关键结论出现时）──
  B.burst = (x, y, t0, col = C.peri, { n = 18, r0 = 30, r1 = 170, d = 0.7 } = {}) => {
    const s = prog(t(), t0, t0 + d); if (s <= 0 || s >= 1) return;
    ctx.save(); ctx.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const ang = i / n * Math.PI * 2 + (i % 2) * 0.17, rr = lerp(r0, r1 * (0.75 + 0.25 * ((i * 7) % 5) / 4), outCubic(s));
      ctx.globalAlpha = (1 - s) * 0.95; const sz = 7 * (1 - s) + 2;
      ctx.save(); ctx.translate(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); ctx.rotate(ang + Math.PI / 4); ctx.fillRect(-sz, -sz, sz * 2, sz * 2); ctx.restore();
    }
    ctx.globalAlpha = (1 - s) * 0.6; ctx.strokeStyle = col; ctx.lineWidth = 4 * (1 - s) + 1; ctx.beginPath(); ctx.arc(x, y, lerp(r0, r1 * 1.1, outCubic(s)), 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  };
  // 全屏闪白（临界值、“破题”瞬间）
  B.flash = (t0, a = 0.35, d = 0.35, col = C.ink) => { const s = prog(t(), t0, t0 + d); if (s <= 0 || s >= 1) return; ctx.save(); ctx.globalAlpha = a * (1 - s) ** 2; ctx.fillStyle = col; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); };
  // 橙色下划线扫过
  B.ul = (x0, x1, y, s, col = C.peri, wdt = 5) => { if (s <= 0) return; ctx.save(); ctx.fillStyle = col; ctx.fillRect(x0, y, (x1 - x0) * smooth(s), wdt); ctx.restore(); };
  // tex 某 class 分组下划线
  B.gul = (k, x, y, px, cls, s, col = C.peri) => { if (s <= 0) return; const g = B.tex.groupBox(B.tex.place(k, x, y, px, 'c'), cls); if (!g) return; B.ul(g.x - g.w / 2 - 4, g.x + g.w / 2 + 4, g.y + g.h / 2 + 8, s, col); };
  // tex 某 class 分组发光圈
  B.ghalo = (k, x, y, px, cls, a, col = C.peri) => {
    if (a <= 0) return; const g = B.tex.groupBox(B.tex.place(k, x, y, px, 'c'), cls); if (!g) return;
    ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.strokeStyle = col; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(g.x - g.w / 2 - 10, g.y - g.h / 2 - 8, g.w + 20, g.h + 16, 12); ctx.stroke(); ctx.restore();
  };

  // ── 连击计数（判断题 / 秒杀填空）──
  B.combo = (n, x, y, tPop, a = 1, label = 'COMBO') => {
    if (a <= 0 || n <= 0) return; const s = prog(t(), tPop, tPop + 0.45), k = lerp(1.7, 1, outBack(s, 2.4));
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(-0.08); ctx.scale(k, k);
    ctx.font = F.serif(84, 900); ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic'; ctx.lineWidth = 10; ctx.strokeStyle = C.paperHi; ctx.strokeText('×' + n, 0, 0); ctx.fillStyle = C.peri; ctx.fillText('×' + n, 0, 0);
    ctx.font = F.sans(26, 900); ctx.fillStyle = C.ink; ctx.fillText(label, 0, 34); ctx.restore();
  };

  // ── 坐标里程表：数字从 from 滚到 to ──
  B.odo = (x, y, from, to, s, { px = 54, gap = 120, col = C.ink, paren = true } = {}) => {
    ctx.save(); ctx.font = F.sans(px, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const n = to.length, x0 = x - (n - 1) * gap / 2;
    for (let i = 0; i < n; i++) {
      const si = smoother(prog(s, i * 0.12, 0.64 + i * 0.12)), v = lerp(from[i], to[i], si), lo = Math.floor(v), fr = v - lo;
      const cx = x0 + i * gap; ctx.save(); ctx.beginPath(); ctx.rect(cx - gap / 2 + 6, y - px * 0.7, gap - 12, px * 1.4); ctx.clip();
      ctx.fillStyle = col;
      for (const [val, dy] of [[lo, -fr], [lo + 1, 1 - fr]]) { ctx.globalAlpha = 1 - Math.abs(dy) * 0.6; ctx.fillText(fmtNum(val), cx, y + dy * px * 1.1); }
      ctx.restore();
      if (i < n - 1) { ctx.fillStyle = C.inkMid; ctx.fillText(',', cx + gap / 2, y + 6); }
    }
    if (paren) { ctx.fillStyle = C.inkMid; ctx.font = F.sans(px * 1.3, 500); ctx.fillText('(', x0 - gap * 0.62, y); ctx.fillText(')', x0 + (n - 1) * gap + gap * 0.62, y); }
    ctx.restore();
  };

  // ── 卡片 + tex（圆盘里的小结框）──
  B.tcard = (k, x, y, w, h, a, col = C.peri, px = 40, opt = {}) => { if (a <= 0) return; B.card(x, y, w, h, a, col); B.texAt(k, x, y, px, { alpha: a, ...opt }); };
  // 文字卡
  B.xcard = (text, x, y, w, h, a, col = C.peri, px = 32, tcol = C.ink) => { if (a <= 0) return; B.card(x, y, w, h, a, col); B.ctag(text, x, y, { px, a, color: tcol }); };

  // ── 分叉树（含参讨论的三结局）：root 文本，leaves [{text, sub, col, at}] ──
  B.tree = (x, y, root, leaves, a, { dx = 300, dy = 170, at0 = 0 } = {}) => {
    if (a <= 0) return; B.xcard(root, x, y, 380, 70, a * B.gin(at0), C.ink, 30);
    leaves.forEach((lf, i) => {
      const lx = x + (i - (leaves.length - 1) / 2) * dx, ly = y + dy, g = a * B.gin(lf.at, 0.5);
      if (g <= 0) return;
      arrow(ctx, [x, y + 38], [lx, ly - 50], { color: lf.col, width: 4, head: 16, alpha: g, grow: B.gin(lf.at, 0.5) });
      B.card(lx, ly, dx - 30, 110, g, lf.col); B.ctag(lf.text, lx, ly - 22, { px: 31, a: g, color: lf.col }); B.ctag(lf.sub, lx, ly + 24, { px: 28, a: g, color: C.ink });
    });
  };
  // ── 手绘矩阵（逐格控制透明度 / 颜色），返回 {cell(i,j)→[x,y], w, h} ──
  // cell 回调：(i, j) => ({ a, col, txt })；bar：竖线在第 bar 列之前（增广）
  B.mat = (x, y, rows, { px = 44, a = 1, cw = null, rh = null, cell = null, bar = null, col = C.ink, brk = C.ink } = {}) => {
    const m = rows.length, n = rows[0].length; cw = cw ?? px * 1.7; rh = rh ?? px * 1.45;
    const W = cw * n + (bar != null ? px * 0.6 : 0), H = rh * m;
    const cx = j => x - W / 2 + cw * (j + 0.5) + (bar != null && j >= bar ? px * 0.6 : 0), cy = i => y - H / 2 + rh * (i + 0.5);
    if (a > 0) {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = brk; ctx.lineWidth = Math.max(2.5, px * 0.06);
      const x0 = x - W / 2 - px * 0.2, x1 = x + W / 2 + px * 0.2, y0 = y - H / 2 - px * 0.1, y1 = y + H / 2 + px * 0.1, k = px * 0.3;
      ctx.beginPath(); ctx.moveTo(x0 + k, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x0 + k, y1); ctx.moveTo(x1 - k, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1 - k, y1); ctx.stroke();
      if (bar != null) { const bx = (cx(bar - 1) + cx(bar)) / 2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, y0 + 6); ctx.lineTo(bx, y1 - 6); ctx.stroke(); }
      ctx.font = F.sans(px, 500); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        const c = cell ? cell(i, j) || {} : {}, ca = a * (c.a ?? 1); if (ca <= 0) continue;
        ctx.globalAlpha = ca; ctx.fillStyle = c.col || col; ctx.fillText(c.txt ?? fmtNum(rows[i][j]), cx(j), cy(i));
      }
      ctx.restore();
    }
    return { cell: (i, j) => [cx(j), cy(i)], w: W, h: H };
  };
  // ── 光点沿弧线飞行（带拖尾）：p → q，s 0..1 ──
  B.fly = (p, q, s, col = C.peri, { lift = 120, r = 12, txt = null, px = 34 } = {}) => {
    if (s <= 0 || s >= 1) return; const P = u => { const e = smoother(u); return [lerp(p[0], q[0], e), lerp(p[1], q[1], e) - Math.sin(Math.PI * e) * lift]; };
    ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 22;
    for (let k = 6; k >= 0; k--) { const u = Math.max(0, s - k * 0.025), [x, y] = P(u); ctx.globalAlpha = (1 - k / 7) * 0.9; ctx.beginPath(); ctx.arc(x, y, r * (1 - k / 9), 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    if (txt) { const [x, y] = P(s); K.tag(txt, x, y - 30, { align: 'center', w: 900, px, color: col }); }
  };
  // ── 印章动作：卡片从 from 落到 to，s 0..1；落下瞬间放大回弹 ──
  B.stampMove = (from, to, s) => { const e = smoother(Math.min(1, s / 0.7)), k = s < 0.7 ? lerp(1.25, 1, e) : 1 + 0.12 * Math.sin(Math.PI * Math.min(1, (s - 0.7) / 0.3)); return { x: lerp(from[0], to[0], e), y: lerp(from[1], to[1], e), k }; };

  // ── 数据驱动的讲题板：B.drill(A, items) ──
  // item: {mat:[S0,S1..], T:[-1,t1..], ops:[null,[[row,'R₂ − R₁']]..], x, y, px, bar, cw, t, u, lx, hi:(i,j,k)=>col}
  //       {txt, x, y, t, u, px, col, card:col, w, h, burst:bool|t}   {stamp:'文字', ok, x, y, t}
  const ngs = v => String(v).replace(/-/g, '−');
  B.drill = (A, items) => {
    if (A <= 0) return;
    for (const it of items) {
      const g = A * (it.t != null ? B.gin(it.t, it.d ?? 0.4) : 1) * (it.u != null ? 1 - B.gin(it.u) : 1);
      if (g <= 0.001) continue;
      if (it.mat) {
        const S = it.mat, T = it.T || [-1]; let k = 0; for (let q = 1; q < S.length; q++) if (t() >= T[q]) k = q;
        const prev = k ? S[k - 1] : S[0], fresh = k ? B.gin(T[k], 0.5) : 1;
        const M = B.mat(it.x, it.y, S[k], { px: it.px ?? 36, a: g, bar: it.bar ?? null, cw: it.cw ?? null, cell: (i, j) => {
          const ch = ngs(S[k][i][j]) !== ngs(prev[i][j]);
          const hc = it.hi ? it.hi(i, j, k) : null;
          return { txt: ngs(S[k][i][j]), col: ch && fresh < 1 ? C.j : (hc || C.ink), a: ch ? 0.3 + 0.7 * fresh : 1 };
        } });
        if (k > 0 && it.ops && it.ops[k]) it.ops[k].forEach(([i, tx]) => B.ctag(tx, it.lx ?? it.x - M.w / 2 - 85, M.cell(i, 0)[1], { px: 24, a: g * B.gin(T[k] - 0.4) * (1 - B.gin(T[k] + 4.0)), color: C.j, font: F.serif }));
        if (it.label) B.ctag(it.label, it.x - M.w / 2 - 60, it.y, { px: 32, a: g, color: it.lcol ?? C.ink, font: F.serif, align: 'right' });
      } else if (it.stamp) {
        B.stamp(it.x, it.y, it.ok ?? true, B.gin(it.t, 0.4), g, it.stamp);
      } else if (it.txt != null) {
        const col = it.col ?? C.ink;
        if (it.card) { const w = it.w ?? Math.min(900, [...it.txt].reduce((q, ch) => q + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 1.0 : 0.55), 0) * (it.px ?? 32) + 80); B.card(it.x, it.y, w, it.h ?? (it.px ?? 32) + 44, g * 0.95, it.card); }
        B.ctag(it.txt, it.x, it.y, { px: it.px ?? 32, a: g, color: it.card && it.col == null ? (it.card === C.ink ? C.ink : it.card) : col, font: it.sans ? F.sans : F.serif });
        if (it.burst) B.burst(it.x, it.y, it.burst === true ? it.t + 0.15 : it.burst, it.card || col, { r1: it.r1 ?? 220 });
      }
    }
  };
  return B;
}

