// 舞台：主 Canvas、纸张底纹、资源加载。
import { C, W, H } from '../style/tokens.js';
import { rng } from './util.js';

export async function loadJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }
export async function loadJSONOr(url, dflt) { try { return await loadJSON(url); } catch { return dflt; } }
export function loadImage(url) { return new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => no(new Error(url)); im.src = url; }); }

export class Stage {
  constructor(canvas) {
    this.cv = canvas; this.ctx = canvas.getContext('2d'); this.W = W; this.H = H;
    // 纸纹：固定种子噪点 + 极淡纤维，预渲染一次
    const p = document.createElement('canvas'); p.width = W; p.height = H; const g = p.getContext('2d');
    g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
    const r = rng(7), img = g.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 7; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(img, 0, 0);
    g.globalAlpha = 0.035; g.strokeStyle = C.inkMid; g.lineWidth = 1;
    for (let k = 0; k < 260; k++) { const x = r() * W, y = r() * H, a = r() * Math.PI, l = 8 + r() * 30; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    // 四角轻微压暗
    const v = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.0);
    v.addColorStop(0, 'rgba(48,41,89,0)'); v.addColorStop(1, 'rgba(48,41,89,0.07)');
    g.globalAlpha = 1; g.fillStyle = v; g.fillRect(0, 0, W, H);
    this.paper = p;
  }
  bg() { const c = this.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.drawImage(this.paper, 0, 0); }
}
