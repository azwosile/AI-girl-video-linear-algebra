// 打印每句台词的起止（真实时长），方便挑测试帧：node pipeline/test/times.mjs ch01/s1_1
import fs from 'fs'; import path from 'path'; import { pathToFileURL } from 'url';
const seg = path.resolve(process.argv[2]);
globalThis.document = { createElement: () => ({ getContext: () => new Proxy({}, { get: () => () => {} }) }) }; globalThis.Path2D = class {};
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(seg, f), 'utf8')); } catch { return {}; } };
const { TexBank } = await import(pathToFileURL(path.resolve('engine/tex/tex.js')));
const scene = await import(pathToFileURL(path.join(seg, 'scene.js')));
const img = {}; for (const n of scene.assets.chars) img[n] = { width: 600, height: 800 };
const ctx = new Proxy({}, { get: (o, k) => k === 'measureText' ? () => ({ width: 10 }) : () => {} });
const { TL } = await scene.setup({ stage: { ctx, bg() {} }, ctx, lines: J('lines.json'), durations: J('durations.json'), envelope: {}, tex: new TexBank(J('tex_cache.json')), img });
console.log(TL.seq.map(x => `${x.id} ${x.s.toFixed(1)}-${x.e.toFixed(1)}`).join('  '), '\ntotal', TL.total.toFixed(2));
