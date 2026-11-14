// 版面小件（左栏标题 / 要点 / 描边标签 / 对照卡 / 大圆），各节场景共用。
import { C, F } from './tokens.js';
import { prog, smooth, outCubic, outBack } from '../core/util.js';
import { star4 } from './motifs.js';

export const LX = 168, DX = 1230, DY = 540, DR = 515;

export function makeKit(ctx) {
  const k = {
    tag(text, x, y, { color = C.ink, px = 34, a = 1, align = 'left', w = 700, font = F.sans } = {}) {
      if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = font(px, w); ctx.textAlign = align; ctx.textBaseline = 'middle';
      ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.strokeStyle = C.paperHi; ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y); ctx.restore();
    },
    head(text, y, a, under = 1, color = C.ink) {
      if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = F.serif(46); ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, LX, y);
      ctx.fillStyle = C.peri; ctx.fillRect(LX, y + 34, 110 * under, 5); ctx.restore();
    },
    bullet(text, y, g, { px = 36, color = C.ink, mark = C.peri } = {}) {
      if (g <= 0) return; ctx.save(); const dx = (1 - outCubic(g)) * -26; ctx.globalAlpha *= g; star4(ctx, LX + 14 + dx, y, 12 * outBack(g, 2), mark);
      ctx.font = F.sans(px); ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, LX + 42 + dx, y); ctx.restore();
    },
    /** 教材对照卡（左边一条角色色） */
    note(title, body, y, a, { color = C.gpt, w = 480, bg = '#1A2420' } = {}) {
      if (a <= 0) return; const lines = Array.isArray(body) ? body : [body], h = 64 + lines.length * 44;
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = bg; ctx.fillRect(LX - 6, y, w, h); ctx.fillStyle = color; ctx.fillRect(LX - 6, y, 6, h);
      ctx.font = F.sans(26, 700); ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(title, LX + 16, y + 30);
      ctx.font = F.sans(30); ctx.fillStyle = C.ink; lines.forEach((l, i) => ctx.fillText(l, LX + 16, y + 76 + i * 44)); ctx.restore();
    },
    disc(D, t) {
      ctx.save(); ctx.fillStyle = C.disc; ctx.beginPath(); ctx.arc(D.x, D.y, D.r, 0, Math.PI * 2); ctx.fill();
      const sw = smooth(prog(t, 0.4, 1.7)); if (sw > 0) {
        const a0 = -Math.PI / 2 + t * 0.08, a1 = a0 + sw * Math.PI * 1.6, rr = D.r + 18;
        ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.35; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(D.x, D.y, rr, a0, a1); ctx.stroke();
        ctx.globalAlpha = 1; star4(ctx, D.x + rr * Math.cos(a1), D.y + rr * Math.sin(a1), 13, C.peri);
        ctx.strokeStyle = C.peri; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(D.x, D.y, D.r + 6, Math.PI * 0.62, Math.PI * (0.62 + 0.22 * sw)); ctx.stroke();
      }
      ctx.restore();
    },
    clip(D) { ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip(); },
  };
  return k;
}
