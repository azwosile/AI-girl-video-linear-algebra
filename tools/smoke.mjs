// 无浏览器冒烟测试：node tools/smoke.mjs sp6/s1 [step]
// 用假 canvas / 假 TexBank 跑 setup + draw(t)（t 每 step 秒一帧），抓异常、缺 tex key、cue 找不到等错误。
import fs from 'fs'; import path from 'path'; import { pathToFileURL, fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
globalThis.fetch = async (u) => { const p = fileURLToPath(u); if (!fs.existsSync(p)) return { ok: false, status: 404 }; const s = fs.readFileSync(p, 'utf8'); return { ok: true, json: async () => JSON.parse(s) }; };
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => globalThis.__ctx }) };
globalThis.OffscreenCanvas = class { constructor(w, h) { this.width = w; this.height = h; } getContext() { return globalThis.__ctx; } };
globalThis.Image = class { set src(u) { this.width = 800; this.height = 400; setTimeout(() => this.onload && this.onload(), 0); } };
const seg = process.argv[2], step = +(process.argv[3] || 0.25);
const segDir = path.join(ROOT, seg);
const mk = () => new Proxy(function () {}, { get: (o, k) => k === 'measureText' ? (s) => ({ width: String(s).length * 20 }) : k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4) }) : k === 'canvas' ? { width: 1920, height: 1080 } : mk(), set: () => true, apply: () => mk() });
const ctx = new Proxy({}, { get: (o, k) => k in o ? o[k] : (k === 'measureText' ? (s) => ({ width: String(s).length * 20 }) : (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern') ? () => ({ addColorStop() {} }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4) }) : k === 'canvas' ? { width: 1920, height: 1080 } : () => mk()), set: (o, k, v) => { o[k] = v; return true; } });
globalThis.__ctx = ctx;
const texJ = JSON.parse(fs.readFileSync(path.join(segDir, 'tex.json'), 'utf8'));
const missing = new Set();
const tex = {
  place(k, x, y, px) { if (!(k in texJ)) missing.add(k); return { key: k, x, y, w: px * 6, h: px * 1.5, px }; },
  groupBox(pl, cls) { if (cls == null) return { x: pl.x, y: pl.y, w: 40, h: 30 }; if (!(pl.key in texJ) || !texJ[pl.key].includes(`\\class{${cls}}`)) missing.add(pl.key + '#' + cls); return { x: pl.x, y: pl.y, w: 40, h: 30 }; },
  draw() {}, has: k => k in texJ,
};
const lines = JSON.parse(fs.readFileSync(path.join(segDir, 'lines.json'), 'utf8'));
const dj = path.join(segDir, 'durations.json'); const durations = fs.existsSync(dj) ? JSON.parse(fs.readFileSync(dj, 'utf8')) : {};
const scene = await import(pathToFileURL(path.join(segDir, 'scene.js')).href);
const img = {}; for (const n of scene.assets.chars) img[n] = { width: 800, height: 1200 };
const stage = new Proxy({}, { get: (o, k) => k in o ? o[k] : (() => mk()) });
const R = { stage, ctx, lines, durations, envelope: {}, tex, img, math: null };
const { TL, draw } = await scene.setup(R);
let errs = 0, first = null;
for (let t = 0; t <= TL.total; t += step) { try { draw(t); } catch (e) { errs++; if (!first) first = `t=${t.toFixed(2)} ${e.stack.split('\n').slice(0, 3).join(' | ')}`; } }
const ex = TL.export();
console.log(`${seg}: total ${TL.total.toFixed(1)} s, ${ex.seq.length} lines, ${ex.sfx.length} sfx, draw errors ${errs}${first ? '\n  first: ' + first : ''}${missing.size ? '\n  missing tex: ' + [...missing].join(', ') : ''}`);
const SFX = new Set(['bell_soft', 'bgm', 'buzz', 'check', 'click', 'count', 'count_go', 'crack', 'ding', 'ding_hi', 'ding_lo', 'glitch', 'hum', 'impact', 'laser', 'marimba', 'marimba_hi', 'marimba_lo', 'pluck', 'pop', 'riser', 'shimmer', 'slam', 'slap', 'soft_hit', 'sparkle', 'stamp', 'sting', 'swell', 'swoosh_in', 'swoosh_soft', 'thud', 'tick', 'tick2', 'tinkle', 'type', 'warp', 'whoosh', 'zap']);
const bad = ex.sfx.filter(s => !SFX.has(s.name));
if (bad.length) console.log('  missing sfx:', [...new Set(bad.map(s => s.name))].join(', '));
