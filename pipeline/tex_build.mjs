// TeX → 逐字形路径缓存（MathJax 3，离线）。
// 用法：node pipeline/tex_build.mjs ch01/p0_sample
// 读取 <段>/tex.json：{ key: "TeX 源" }；输出 <段>/tex_cache.json：
//   { key: { vb:[x,y,w,h], items:[{t:'p', d, m:[a,b,c,d,e,f], fill, cls:[..], bb:[x0,y0,x1,y1]} | {t:'r', x,y,w,h, m, fill, cls}] } }
// 坐标为 MathJax 内部单位（1 em = 1000），y 向下；m 是累积变换矩阵。
// 约定：\class{名}{...} 给字形打标签（用于分组揭示、按名匹配做公式变形）；颜色用 \color{#RRGGBB}{...}。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const here = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(here, 'package.json'))
const { mathjax } = require('mathjax-full/js/mathjax.js')
const { TeX } = require('mathjax-full/js/input/tex.js')
const { SVG } = require('mathjax-full/js/output/svg.js')
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js')
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js')
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js')

const ROOT = path.resolve(here, '..')
const seg = path.resolve(ROOT, process.argv[2])
const src = JSON.parse(fs.readFileSync(path.join(seg, 'tex.json'), 'utf8'))

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)
const tex = new TeX({ packages: AllPackages })
const svg = new SVG({ fontCache: 'none' })
const doc = mathjax.document('', { InputJax: tex, OutputJax: svg })

const mul = (A, B) => [A[0]*B[0]+A[2]*B[1], A[1]*B[0]+A[3]*B[1], A[0]*B[2]+A[2]*B[3], A[1]*B[2]+A[3]*B[3], A[0]*B[4]+A[2]*B[5]+A[4], A[1]*B[4]+A[3]*B[5]+A[5]]
function parseTransform(s) {
  let M = [1, 0, 0, 1, 0, 0]
  if (!s) return M
  for (const m of s.matchAll(/(translate|scale|matrix)\(([^)]*)\)/g)) {
    const v = m[2].split(/[\s,]+/).filter(Boolean).map(Number)
    let T
    if (m[1] === 'translate') T = [1, 0, 0, 1, v[0], v[1] || 0]
    else if (m[1] === 'scale') T = [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0]
    else T = v
    M = mul(M, T)
  }
  return M
}
function pathBBox(d) {
  // 按命令解析（MathJax 只用绝对坐标 M L H V Q T C S Z）；H/V 只带一个数，不能两两配对
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, cx = 0, cy = 0
  const add = (x, y) => { cx = x; cy = y; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  for (const m of d.matchAll(/([MLHVQTCSZmlhvqtcsz])([^MLHVQTCSZmlhvqtcsz]*)/g)) {
    const c = m[1].toUpperCase(), n = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number)
    if (c === 'H') n.forEach(x => add(x, cy))
    else if (c === 'V') n.forEach(y => add(cx, y))
    else if (c !== 'Z') for (let k = 0; k + 1 < n.length; k += 2) add(n[k], n[k + 1])
  }
  return [x0, y0, x1, y1]
}

const EXT = new Set(['2223', '2225', '7C', '23A2', '23A5', '23AA', 'E154', '2212', '23D0'])
const out = {}
for (const [key, texSrc] of Object.entries(src)) {
  const node = doc.convert(texSrc, { display: true })
  const svgEl = adaptor.firstChild(node)
  const vb = adaptor.getAttribute(svgEl, 'viewBox').split(/\s+/).map(Number)
  const items = []
  const walk = (el, M, fill, cls, stroke, clip = null) => {
    if (adaptor.kind(el) === '#text' || adaptor.kind(el) === '#comment') return
    const tag = adaptor.kind(el)
    let M2 = mul(M, parseTransform(adaptor.getAttribute(el, 'transform')))
    // 嵌套 <svg>（MathJax 伸缩定界符的延伸段）：按 SVG 语义套 x/y + viewBox 映射，并记下视口裁剪框（根坐标）
    if (tag === 'svg' && el !== svgEl) {
      const g = k => Number(adaptor.getAttribute(el, k) || 0)
      const [vx, vy, vw, vh] = (adaptor.getAttribute(el, 'viewBox') || `0 0 ${g('width')} ${g('height')}`).split(/\s+/).map(Number)
      const sx = vw ? g('width') / vw : 1, sy = vh ? g('height') / vh : 1
      M2 = mul(M2, [sx, 0, 0, sy, g('x') - vx * sx, g('y') - vy * sy])
      const c = [[vx, vy], [vx + vw, vy + vh]].map(q => [M2[0] * q[0] + M2[2] * q[1] + M2[4], M2[1] * q[0] + M2[3] * q[1] + M2[5]])
      clip = [Math.min(c[0][0], c[1][0]), Math.min(c[0][1], c[1][1]), Math.max(c[0][0], c[1][0]), Math.max(c[0][1], c[1][1])]
    }
    const f = adaptor.getAttribute(el, 'fill') || fill
    const st = adaptor.getAttribute(el, 'stroke') || stroke
    const c = adaptor.getAttribute(el, 'class')
    const cls2 = c && !c.startsWith('mjx') ? [...cls, ...c.split(/\s+/).filter(Boolean)] : cls
    if (tag === 'path') {
      const d = adaptor.getAttribute(el, 'd')
      const dc = adaptor.getAttribute(el, 'data-c')
      if (d && clip && EXT.has(dc)) {
        // 直线延伸段：变换后包围盒 ∩ 视口 → 矩形（等价于浏览器裁剪后的样子）
        const bb = pathBBox(d), m = M2
        const c = [[bb[0], bb[1]], [bb[2], bb[1]], [bb[0], bb[3]], [bb[2], bb[3]]].map(q => [m[0] * q[0] + m[2] * q[1] + m[4], m[1] * q[0] + m[3] * q[1] + m[5]])
        const x0 = Math.max(clip[0], Math.min(...c.map(q => q[0]))), x1 = Math.min(clip[2], Math.max(...c.map(q => q[0])))
        const y0 = Math.max(clip[1], Math.min(...c.map(q => q[1]))), y1 = Math.min(clip[3], Math.max(...c.map(q => q[1])))
        if (x1 > x0 && y1 > y0) items.push({ t: 'r', x: x0, y: y0, w: x1 - x0, h: y1 - y0, m: [1, 0, 0, 1, 0, 0], fill: f, cls: cls2 })
      } else if (d) {
        if (clip) console.warn(`  ⚠ ${key}: 嵌套 svg 内非延伸字形 ${dc}，未裁剪`)
        items.push({ t: 'p', d, m: M2, fill: f, cls: cls2, bb: pathBBox(d) })
      }
    } else if (tag === 'rect') {
      const g = k => Number(adaptor.getAttribute(el, k) || 0)
      items.push({ t: 'r', x: g('x'), y: g('y'), w: g('width'), h: g('height'), m: M2, fill: f, cls: cls2 })
    } else if (tag === 'line') {
      const g = k => Number(adaptor.getAttribute(el, k) || 0)
      const sw = Number(adaptor.getAttribute(el, 'stroke-width') || 70)  // MathJax CSS：line[data-line] stroke-width 70px
      const x1 = g('x1'), y1 = g('y1'), x2 = g('x2'), y2 = g('y2')
      items.push({ t: 'r', x: Math.min(x1, x2) - (x1 === x2 ? sw / 2 : 0), y: Math.min(y1, y2) - (y1 === y2 ? sw / 2 : 0),
                   w: Math.abs(x2 - x1) || sw, h: Math.abs(y2 - y1) || sw, m: M2, fill: st || f, cls: cls2 })
    }
    for (const ch of adaptor.childNodes(el)) walk(ch, M2, f, cls2, st, clip)
  }
  walk(svgEl, [1, 0, 0, 1, 0, 0], 'currentColor', [], null)
  out[key] = { vb, items }
  console.log(key.padEnd(10), items.length, 'items', vb.map(v => Math.round(v)).join(' '))
}
fs.writeFileSync(path.join(seg, 'tex_cache.json'), JSON.stringify(out))
