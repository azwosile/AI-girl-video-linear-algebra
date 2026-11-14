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
const lines = J('lines.json'), durations = J('durations.json'), env = J('envelope.json'), texc = J('tex_cache.json');
const { TexBank } = await import(pathToFileURL(path.resolve('engine/tex/tex.js')));
const scene = await import(pathToFileURL(path.join(seg, 'scene.js')));
const img = {}; for (const n of scene.assets.chars) img[n] = { width: 600, height: 800 };
const ctx = ctxProxy();
const R = { stage: { ctx, bg() {} }, ctx, lines, durations, envelope: env, tex: new TexBank(texc), img };
const { TL, draw } = await scene.setup(R);
let err = 0;
for (let t = 0; t <= TL.total; t += 0.05) { curT = t; try { draw(t); } catch (e) { if (err++ < 5) console.log('t=' + t.toFixed(2), e.stack.split('\n').slice(0, 3).join(' | ')); } }
console.log(`total ${TL.total.toFixed(2)} s, lines ${TL.seq.length}, sfx ${TL.export().sfx.length}, errors ${err}, NaN ${nan}`, [...nanAt].slice(0, 8));
