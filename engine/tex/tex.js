// TeX 渲染：读取 pipeline/tex_build.mjs 生成的逐字形缓存，用 Path2D 绘制。
// 支持：逐字书写（reveal）、按 \class 分组透明度、分组位移、两式之间按 class 匹配变形（morph）。
import { C } from '../style/tokens.js';
import { clamp, smooth } from '../core/util.js';

const mulPt = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

export class TexBank {
  constructor(cache) {
    this.f = {};
    for (const [k, v] of Object.entries(cache)) {
      const items = v.items.map(it => {
        let p, bb;
        if (it.t === 'p') {
          p = new Path2D(it.d);
          const c = [[it.bb[0], it.bb[1]], [it.bb[2], it.bb[1]], [it.bb[0], it.bb[3]], [it.bb[2], it.bb[3]]].map(q => mulPt(it.m, q[0], q[1]));
          bb = [Math.min(...c.map(q => q[0])), Math.min(...c.map(q => q[1])), Math.max(...c.map(q => q[0])), Math.max(...c.map(q => q[1]))];
        } else {
          p = new Path2D(); p.rect(it.x, it.y, it.w, it.h);
          const c = [[it.x, it.y], [it.x + it.w, it.y + it.h]].map(q => mulPt(it.m, q[0], q[1]));
          bb = [Math.min(c[0][0], c[1][0]), Math.min(c[0][1], c[1][1]), Math.max(c[0][0], c[1][0]), Math.max(c[0][1], c[1][1])];
        }
        return { p, m: it.m, fill: it.fill === 'currentColor' ? null : it.fill, cls: it.cls, bb, cx: (bb[0] + bb[2]) / 2 };
      });
      // 书写顺序：按水平中心
      const order = items.map((_, i) => i).sort((a, b) => items[a].cx - items[b].cx);
      items.forEach((it, i) => { it.rank = order.indexOf(i) / Math.max(1, items.length - 1); });
      this.f[k] = { vb: v.vb, items };
    }
  }
  /** 计算放置：返回屏幕坐标变换。anchor: 'l' 左中 | 'c' 中心 | 'r' 右中 */
  place(key, x, y, px, anchor = 'c') {
    const f = this.f[key]; if (!f) throw new Error('TeX 缺少 ' + key);
    const s = px / 1000, [vx, vy, vw, vh] = f.vb;
    const ox = anchor === 'l' ? x : anchor === 'r' ? x - vw * s : x - vw * s / 2;
    return { key, s, ox: ox - vx * s, oy: y - (vy + vh / 2) * s, w: vw * s, h: vh * s };
  }
  /** 某个 class 分组在屏幕上的包围盒中心与尺寸 */
  groupBox(pl, cls) {
    const its = this.f[pl.key].items.filter(it => !cls || it.cls.includes(cls));
    if (!its.length) return null;
    const x0 = Math.min(...its.map(i => i.bb[0])), y0 = Math.min(...its.map(i => i.bb[1])), x1 = Math.max(...its.map(i => i.bb[2])), y1 = Math.max(...its.map(i => i.bb[3]));
    return { x: pl.ox + (x0 + x1) / 2 * pl.s, y: pl.oy + (y0 + y1) / 2 * pl.s, w: (x1 - x0) * pl.s, h: (y1 - y0) * pl.s };
  }
  /**
   * 绘制。opt：
   *   alpha, color（覆盖 currentColor，默认 ink）, reveal 0..1（逐字形自左向右书写，带上浮）,
   *   cls: {名: alpha}（分组透明度，未列出的分组按 1）, only: [名]（只画这些分组）, skip: [名],
   *   shift: {名: [dx,dy]}（分组位移，屏幕像素）, halo: 描边颜色（在色块上保持可读）
   */
  draw(ctx, pl, opt = {}) {
    const f = this.f[pl.key]; const a0 = opt.alpha ?? 1; if (a0 <= 0) return;
    const rev = opt.reveal ?? 1;
    ctx.save();
    for (const it of f.items) {
      if (opt.only && !it.cls.some(c => opt.only.includes(c))) continue;
      if (opt.skip && it.cls.some(c => opt.skip.includes(c))) continue;
      let a = a0;
      let hit = false;
      if (opt.cls) for (const c of it.cls) if (c in opt.cls) { a *= opt.cls[c]; hit = true; }
      if (!hit && opt.restAlpha != null) a *= opt.restAlpha;
      let dy = 0;
      if (rev < 1) { const k = clamp((rev * 1.35 - it.rank) / 0.35); a *= smooth(k); dy = (1 - smooth(k)) * 14; }
      if (a <= 0.003) continue;
      let dx = 0, sy = 0;
      if (opt.shift) for (const c of it.cls) if (opt.shift[c]) { dx += opt.shift[c][0]; sy += opt.shift[c][1]; }
      const m = it.m, s = pl.s;
      ctx.setTransform(m[0] * s, m[1] * s, m[2] * s, m[3] * s, pl.ox + m[4] * s + dx, pl.oy + m[5] * s + dy + sy);
      ctx.globalAlpha = a;
      if (opt.halo) { ctx.strokeStyle = opt.halo; ctx.lineWidth = (opt.haloW ?? 7) / s; ctx.lineJoin = 'round'; ctx.stroke(it.p); }
      ctx.fillStyle = opt.force || it.fill || opt.color || C.ink;
      ctx.fill(it.p);
    }
    ctx.restore();
  }
}

/** 两式变形（类 3B1B TransformMatchingTex）：同名 \class 分组飞到新位置并交叉淡化，其余字形先淡出后淡入。s 0..1 */
export function morphTex(bank, ctx, plA, plB, s, opt = {}) {
  const fa = bank.f[plA.key], fb = bank.f[plB.key];
  const names = [...new Set(fa.items.flatMap(i => i.cls).filter(c => fb.items.some(j => j.cls.includes(c))))];
  const e = smooth(s), a = opt.alpha ?? 1;
  const shiftA = {}, shiftB = {};
  for (const n of names) {
    const ga = bank.groupBox(plA, n), gb = bank.groupBox(plB, n);
    shiftA[n] = [(gb.x - ga.x) * e, (gb.y - ga.y) * e];
    shiftB[n] = [(ga.x - gb.x) * (1 - e), (ga.y - gb.y) * (1 - e)];
  }
  const fadeOut = clamp(1 - s * 2), fadeIn = clamp(s * 2 - 1);
  // A：匹配分组随位移淡出（后半程），非匹配分组前半程淡出
  const tbl = v => Object.fromEntries(names.map(n => [n, v]));
  bank.draw(ctx, plA, { ...opt, alpha: a, shift: shiftA, reveal: 1, cls: tbl(1 - e), restAlpha: fadeOut });
  bank.draw(ctx, plB, { ...opt, alpha: a, shift: shiftB, reveal: 1, cls: tbl(e), restAlpha: fadeIn });
}
