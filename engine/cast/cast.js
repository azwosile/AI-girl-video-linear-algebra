// 角色立绘：剪纸式入场 / 退场、说话时随配音包络弹跳、呼吸、纸片投影、身后色圆。
import { C, F, SPEAKER } from '../style/tokens.js';
import { clamp, smooth, outBack, inCubic, lerp } from '../core/util.js';

export class Cast {
  /** env: envelope.json（每句 30 fps RMS 0..1）；TL: 时间轴 */
  constructor(env, TL) { this.env = env; this.TL = TL; this.img = {}; this.shadow = {}; }
  add(name, img) {
    this.img[name] = img;
    const s = document.createElement('canvas'); s.width = img.width; s.height = img.height; const g = s.getContext('2d');
    g.drawImage(img, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = C.ink; g.fillRect(0, 0, s.width, s.height);
    this.shadow[name] = s;
  }
  /** 说话人 spk 在 t 时刻的音量包络（0..1，已平滑） */
  level(spk, t) {
    const L = this.TL.speaking(t); if (!L || L.spk !== spk) return 0;
    const e = this.env[L.id]; if (!e) return 0;
    const f = (t - L.s) * 30, i = Math.floor(f), k = f - i;
    const v = i => e[clamp(i, 0, e.length - 1)] || 0;
    return (t < L.s || t > L.e) ? 0 : lerp(v(i), v(i + 1), k);
  }
  /**
   * 画一个角色。o：
   *   name 图片名, spk 说话人字母, x 脚底中心 x, y 底边 y, h 高度（px）,
   *   in [t0,t1] 入场时间, out [t0,t1] 退场时间, from 入场方向 'left'|'right'|'bottom',
   *   disc {r, dx, dy, color} 身后色圆, flip 镜像
   */
  draw(ctx, t, o) {
    const im = this.img[o.name]; if (!im) return;
    const sIn = o.in ? clamp((t - o.in[0]) / (o.in[1] - o.in[0])) : 1;
    const sOut = o.out ? clamp((t - o.out[0]) / (o.out[1] - o.out[0])) : 0;
    if (sIn <= 0 || sOut >= 1) return;
    const eIn = outBack(sIn, 1.2), eOut = inCubic(sOut);
    const dir = o.from || 'bottom';
    const off = (1 - eIn) + eOut; // 0 = 就位
    let dx = 0, dy = 0, rot = 0;
    if (dir === 'bottom') { dy = off * (o.h * 0.8); rot = (1 - eIn) * -0.06 + eOut * 0.05; }
    if (dir === 'left') { dx = -off * (o.h * 0.9); rot = (1 - eIn) * -0.07 - eOut * 0.06; }
    if (dir === 'right') { dx = off * (o.h * 0.9); rot = (1 - eIn) * 0.07 + eOut * 0.06; }
    const lv = this.level(o.spk, t);
    // 说话：上跳 + 轻微拉伸；呼吸：±0.6%
    const breath = 1 + 0.006 * Math.sin(t * 2 * Math.PI / 3.4 + (o.phase || 0));
    const bounce = lv * 9, sx = breath * (1 - lv * 0.006), sy = breath * (1 + lv * 0.012);
    const H = o.h, W = H * im.width / im.height;
    const a = clamp(sIn * 3) * (1 - clamp((sOut - 0.6) / 0.4));
    ctx.save();
    ctx.translate(o.x + dx, o.y + dy); ctx.rotate(rot);
    if (o.disc) {
      const dr = o.disc.r * smooth(clamp(sIn * 1.6)) * (1 - eOut);
      ctx.globalAlpha = a; ctx.fillStyle = o.disc.color; ctx.beginPath(); ctx.arc(o.disc.dx || 0, -(o.disc.dy ?? H * 0.62), dr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.translate(0, -bounce); ctx.scale(o.flip ? -sx : sx, sy);
    // 纸片投影
    ctx.globalAlpha = a * 0.13; ctx.drawImage(this.shadow[o.name], -W / 2 + 9, -H + 7, W, H);
    ctx.globalAlpha = a; ctx.drawImage(im, -W / 2, -H, W, H);
    ctx.restore();
  }
}

/** 字幕：底部居中，paper 底条 + 说话人色标 */
export function subtitle(ctx, t, TL, { y = 1018, px = 40, maxW = 1240 } = {}) {
  const L = TL.subAt(t); if (!L) return;
  const a = smooth(clamp((t - L.s + 0.1) / 0.18)) * (1 - smooth(clamp((t - L.e - 0.3) / 0.2)));
  if (a <= 0) return;
  const sp = SPEAKER[L.spk];
  ctx.save(); ctx.font = F.sans(px); ctx.textBaseline = 'middle';
  const name = sp.name, nw = (ctx.font = F.sans(26, 700), ctx.measureText(name).width); ctx.font = F.sans(px);
  const tw = Math.min(maxW, ctx.measureText(L.sub).width), pad = 22, gap = 18, w = nw + gap + tw + pad * 2, h = px + 26;
  const x0 = 960 - w / 2;
  ctx.globalAlpha = a * 0.86; ctx.fillStyle = C.paperHi; ctx.fillRect(x0, y - h / 2, w, h);
  ctx.globalAlpha = a; ctx.fillStyle = sp.color; ctx.fillRect(x0, y - h / 2, 6, h);
  ctx.font = F.sans(26, 700); ctx.fillText(name, x0 + pad, y + 1);
  ctx.font = F.sans(px); ctx.fillStyle = C.ink; ctx.fillText(L.sub, x0 + pad + nw + gap, y + 1, maxW);
  ctx.restore();
}
