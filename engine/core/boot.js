// 页面启动：加载字体 / 数据 / 图片 → 调用场景 setup → 暴露 window.renderAt(t)、window.TIMELINE、window.__ready。
// 场景模块需导出：
//   export const assets = { chars: ['claude_explain', ...] }
//   export async function setup(R) → { TL, draw(t) }
//   R = { stage, ctx, lines, durations, envelope, tex(TexBank), cast(Cast), img{}, math（<段>/math.json，没有则 null） }
import { Stage, loadJSON, loadJSONOr, loadImage } from './stage.js';
import { TexBank } from '../tex/tex.js';
import { Cast } from '../cast/cast.js';

const ROOT = new URL('../../', import.meta.url).href;

async function loadFonts() {
  const list = [['LA-Serif', 'LA-Serif-Heavy', 900], ['LA-Serif', 'LA-Serif-Bold', 700], ['LA-Sans', 'LA-Sans-Medium', 500], ['LA-Sans', 'LA-Sans-Medium', 700],
    ['LA-Latin', 'LA-Latin-Medium', 500], ['LA-Latin', 'LA-Latin-Bold', 700], ['LA-Latin', 'LA-Latin-Bold', 900]];
  await Promise.all(list.map(async ([fam, file, w]) => {
    const f = new FontFace(fam, `url(${ROOT}assets/fonts/${file}.woff2)`, { weight: String(w) });
    document.fonts.add(await f.load());
  }));
}

export async function boot(scene, segURL) {
  const seg = new URL(segURL, location.href).href.replace(/\/?$/, '/');
  const cv = document.getElementById('c');
  const stage = new Stage(cv);
  const [lines, durations, envelope, texCache, math] = await Promise.all([
    loadJSON(seg + 'lines.json'), loadJSONOr(seg + 'durations.json', {}), loadJSONOr(seg + 'envelope.json', {}), loadJSONOr(seg + 'tex_cache.json', {}), loadJSONOr(seg + 'math.json', null),
    loadFonts()]);
  const img = {};
  await Promise.all((scene.assets?.chars || []).map(async n => { img[n] = await loadImage(`${ROOT}assets/characters/cutout/${n}.png`); }));
  const R = { stage, ctx: stage.ctx, lines, durations, envelope, tex: new TexBank(texCache), img, math };
  const { TL, draw } = await scene.setup(R);
  window.TIMELINE = TL.export();
  window.DURATION = TL.total;
  window.renderAt = t => { draw(Math.max(0, Math.min(TL.total, t))); return true; };
  window.renderAt(0);
  window.__ready = true;
  if (!new URLSearchParams(location.search).has('render')) previewUI(TL.total);
}

// 本地预览：空格播放 / 暂停，← → 逐 0.1 s，拖动进度条
function previewUI(total) {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;display:flex;gap:8px;align-items:center;padding:6px 12px;background:#302959;color:#EDE7DA;font:13px monospace';
  bar.innerHTML = '<button id="pp">▶</button><input id="sk" type="range" min="0" step="0.001" style="flex:1"><span id="tt"></span>';
  document.body.appendChild(bar);
  const sk = bar.querySelector('#sk'), tt = bar.querySelector('#tt'), pp = bar.querySelector('#pp');
  sk.max = total; let t = Number(new URLSearchParams(location.search).get('t') || 0), playing = false, last = 0;
  const show = () => { window.renderAt(t); sk.value = t; tt.textContent = t.toFixed(2) + ' / ' + total.toFixed(2); };
  sk.oninput = () => { t = +sk.value; show(); };
  pp.onclick = () => { playing = !playing; pp.textContent = playing ? '❚❚' : '▶'; last = performance.now(); if (playing) requestAnimationFrame(loop); };
  addEventListener('keydown', e => { if (e.code === 'Space') pp.onclick(); if (e.code === 'ArrowRight') { t = Math.min(total, t + 0.1); show(); } if (e.code === 'ArrowLeft') { t = Math.max(0, t - 0.1); show(); } });
  function loop(now) { if (!playing) return; t += (now - last) / 1000; last = now; if (t >= total) { t = total; pp.onclick(); } show(); requestAnimationFrame(loop); }
  show();
}
