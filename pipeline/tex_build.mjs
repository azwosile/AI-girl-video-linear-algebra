// TeX → 逐字形路径缓存（MathJax 3，离线）。
// 用法：node pipeline/tex_build.mjs ch01/p0_sample
// 读取 <段>/tex.json：{ key: "TeX 源" }；输出 <段>/tex_cache.json：
//   { key: { vb:[x,y,w,h], items:[{t:'p', d, m:[a,b,c,d,e,f], fill, cls:[..], bb:[x0,y0,x1,y1]} | {t:'r', x,y,w,h, m, fill, cls}] } }
// 坐标为 MathJax 内部单位（1 em = 1000），y 向下；m 是累积变换矩阵。
// 约定：\class{名}{...} 给字形打标签（用于分组揭示、按名匹配做公式变形）；颜色用 \color{#RRGGBB}{...}。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, 'package.json'));
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

const ROOT = path.resolve(here, '..');
const seg = path.resolve(ROOT, process.argv[2]);
const src = JSON.parse(fs.readFileSync(path.join(seg, 'tex.json'), 'utf8'));

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const tex = new TeX({ packages: AllPackages });
const svg = new SVG({ fontCache: 'none' });
const doc = mathjax.document('', { InputJax: tex, OutputJax: svg });

const mul = (A, B) => [A[0]*B[0]+A[2]*B[1], A[1]*B[0]+A[3]*B[1], A[0]*B[2]+A[2]*B[3], A[1]*B[2]+A[3]*B[3], A[0]*B[4]+A[2]*B[5]+A[4], A[1]*B[4]+A[3]*B[5]+A[5]];
function parseTransform(s) {
  let M = [1, 0, 0, 1, 0, 0];
  if (!s) return M;
  for (const m of s.matchAll(/(translate|scale|matrix)\(([^)]*)\)/g)) {
    const v = m[2].split(/[\s,]+/).filter(Boolean).map(Number);
    let T;
    if (m[1] === 'translate') T = [1, 0, 0, 1, v[0], v[1] || 0];
    else if (m[1] === 'scale') T = [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0];
    else T = v;
    M = mul(M, T);
  }
  return M;
}
function pathBBox(d) {
  const n = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i+1]); y1 = Math.max(y1, n[i+1]); }
  return [x0, y0, x1, y1];
}

const out = {};
for (const [key, texSrc] of Object.entries(src)) {
  const node = doc.convert(texSrc, { display: true });
  const svgEl = adaptor.firstChild(node);
  const vb = adaptor.getAttribute(svgEl, 'viewBox').split(/\s+/).map(Number);
  const items = [];
  const walk = (el, M, fill, cls, stroke) => {
    if (adaptor.kind(el) === '#text' || adaptor.kind(el) === '#comment') return;
    const tag = adaptor.kind(el);
    const M2 = mul(M, parseTransform(adaptor.getAttribute(el, 'transform')));
    const f = adaptor.getAttribute(el, 'fill') || fill;
    const st = adaptor.getAttribute(el, 'stroke') || stroke;
    const c = adaptor.getAttribute(el, 'class');
    const cls2 = c && !c.startsWith('mjx') ? [...cls, ...c.split(/\s+/).filter(Boolean)] : cls;
    if (tag === 'path') {
      const d = adaptor.getAttribute(el, 'd');
      if (d) items.push({ t: 'p', d, m: M2, fill: f, cls: cls2, bb: pathBBox(d) });
    } else if (tag === 'rect') {
      const g = k => Number(adaptor.getAttribute(el, k) || 0);
      items.push({ t: 'r', x: g('x'), y: g('y'), w: g('width'), h: g('height'), m: M2, fill: f, cls: cls2 });
    } else if (tag === 'line') {
      const g = k => Number(adaptor.getAttribute(el, k) || 0);
      const sw = Number(adaptor.getAttribute(el, 'stroke-width') || 60);
      const x1 = g('x1'), y1 = g('y1'), x2 = g('x2'), y2 = g('y2');
      items.push({ t: 'r', x: Math.min(x1, x2) - (x1 === x2 ? sw / 2 : 0), y: Math.min(y1, y2) - (y1 === y2 ? sw / 2 : 0),
                   w: Math.abs(x2 - x1) || sw, h: Math.abs(y2 - y1) || sw, m: M2, fill: st || f, cls: cls2 });
    }
    for (const ch of adaptor.childNodes(el)) walk(ch, M2, f, cls2, st);
  };
  walk(svgEl, [1, 0, 0, 1, 0, 0], 'currentColor', [], null);
  out[key] = { vb, items };
  console.log(key.padEnd(10), items.length, 'items', vb.map(v => Math.round(v)).join(' '));
}
fs.writeFileSync(path.join(seg, 'tex_cache.json'), JSON.stringify(out));
