// 无浏览器干跑：伪造 canvas / document，逐 0.05 s 调用 draw，抓运行时错误与 NaN。
// 用法：node pipeline/test/dryrun.mjs ch01/s1_1
import fs from 'fs'; import path from 'path'; import { pathToFileURL } from 'url';
const seg = path.resolve(process.argv[2]);
let nan = 0; const nanAt = new Set(); let curT = 0;
const ctxProxy = () => new Proxy({}, {
  get(o, k) { if (k in o) return o[k]; if (k === 'measureText') return s => ({ width: String(s).length * 20 });
    if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(16) });
    if (k === 'createRadialGradient' || k === 'createLinearGradient') return () => ({ addColorStop() {} });
    return (...a) => { for (const v of a) if (typeof v === 'number' && !isFinite(v)) { nan++; nanAt.add(curT.toFixed(2) + ':' + String(k)); } }; },
  set(o, k, v) { if (typeof v === 'number' && !isFinite(v)) { nan++; nanAt.add(curT.toFixed(2) + ':' + String(k)); } o[k] = v; return true; } });
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctxProxy() }) };
globalThis.Path2D = class { rect() {} };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(seg, f), 'utf8')); } catch { return {}; } };
const lines = J('lines.json'), durations = J('durations.json'), env = J('envelope.json'), texc = J('tex_cache.json'), math = J('math.json');
const { TexBank } = await import(pathToFileURL(path.resolve('engine/tex/tex.js')));
const scene = await import(pathToFileURL(path.join(seg, 'scene.js')));
const img = {}; for (const n of scene.assets.chars) img[n] = { width: 600, height: 800 };
const ctx = ctxProxy();
const R = { stage: { ctx, bg() {} }, ctx, lines, durations, envelope: env, tex: new TexBank(texc), img, math };
const { TL, draw } = await scene.setup(R);
let err = 0;
for (let t = 0; t <= TL.total; t += 0.05) { curT = t; try { draw(t); } catch (e) { if (err++ < 5) console.log('t=' + t.toFixed(2), e.stack.split('\n').slice(0, 3).join(' | ')); } }
console.log(`total ${TL.total.toFixed(2)} s, lines ${TL.seq.length}, sfx ${TL.export().sfx.length}, errors ${err}, NaN ${nan}`, [...nanAt].slice(0, 8));

// 节奏关：静音占比（规范 ≤ 15%）与长空档（无人声 > 2.5 s）
{
  const seq = TL.seq.slice().sort((a, b) => a.s - b.s); let voiced = 0, prev = 0; const gaps = [];
  for (const x of seq) { voiced += x.e - x.s; const g = x.s - prev; if (g > 2.5) gaps.push(`${x.id} 前 ${g.toFixed(1)}s`); prev = Math.max(prev, x.e); }
  if (TL.total - prev > 2.5) gaps.push(`片尾 ${(TL.total - prev).toFixed(1)}s`);
  const sil = 1 - voiced / TL.total, chars = seq.reduce((n, x) => n + [...(x.read || x.sub || '')].length, 0);
  console.log(`PACE 静音 ${(sil * 100).toFixed(1)}%${sil > 0.15 ? ' ✗ 超过 15%' : ' ✓'}，语速 ${(chars / TL.total * 60).toFixed(0)} 字/分，长空档 ${gaps.length ? gaps.join('、') : '无'}`);
}

// 版面关：右下角 D 与 G 不得同时在场（含退场动画）
{
  const W = globalThis.__castWindows || {}; const bad = [];
  for (const [a, b, od] of W.D || []) for (const [c, d, oe] of W.G || []) { const lo = Math.max(a, c), hi = Math.min(b + (od ?? 0.6), d + (oe ?? 0.6)); if (hi - lo > 0.05) bad.push(`${lo.toFixed(1)}–${hi.toFixed(1)}s`); }
  console.log(`CAST 右下角重叠 ${bad.length ? '✗ ' + bad.join('、') : '✓ 无'}`);
}
