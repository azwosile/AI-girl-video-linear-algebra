// AE build script (Surehand ae_run_script, args = {mode, items}) — 正片包装：片头 EP_Intro / 段落卡 EP_Card / 片尾 EP_End
// 1920x1080 60fps. Tokens: paper #121010, ink #F2E2C8, peri #E06A3A, i #F2B544, j #4FC1A6, free #E8577A
const C = (h) => aemcp.color3(h);
const C4 = (h) => aemcp.color(h);
const W = 1920, H = 1080, FPS = 60;
const proj = app.project;
const out = [];

function ease(prop, inf, outf) {
  inf = inf || 75; outf = outf || 75;
  for (let k = 1; k <= prop.numKeys; k++) {
    const vt = prop.propertyValueType;
    const dims = (vt === PropertyValueType.TwoD_SPATIAL || vt === PropertyValueType.ThreeD_SPATIAL) ? 1
      : (vt === PropertyValueType.ThreeD ? 3 : (vt === PropertyValueType.TwoD ? 2 : 1));
    const a = [], b = [];
    for (let d = 0; d < dims; d++) { a.push(new KeyframeEase(0, inf)); b.push(new KeyframeEase(0, outf)); }
    prop.setTemporalEaseAtKey(k, a, b);
  }
}
function keys(prop, ts, vs, e) { prop.setValuesAtTimes(ts, vs); if (e !== false) ease(prop, e && e[0], e && e[1]); return prop; }
const tr = (l) => l.property('ADBE Transform Group');
function fx(l, mn) { return l.property('ADBE Effect Parade').addProperty(mn); }
function glow(l, thr, rad, inten) { const g = fx(l, 'ADBE Glo2'); g.property(2).setValue(thr); g.property(3).setValue(rad); g.property(4).setValue(inten); return g; }

function newComp(name, dur) {
  for (let i = proj.numItems; i >= 1; i--) { const it = proj.item(i); if (it instanceof CompItem && it.name === name) it.remove(); }
  const comp = proj.items.addComp(name, W, H, 1, dur, FPS);
  comp.bgColor = C('#121010'); comp.motionBlur = true;
  return comp;
}
function kit(comp) {
  const L = comp.layers, DUR = comp.duration;
  const K = {};
  K.shape = (name) => { const s = L.addShape(); s.name = name; return s; };
  K.group = (s, name) => { const g = s.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group'); g.name = name; return g.property('ADBE Vectors Group'); };
  K.stroke = (v, hex, w) => { const st = v.addProperty('ADBE Vector Graphic - Stroke'); st.property('ADBE Vector Stroke Color').setValue(C4(hex)); st.property('ADBE Vector Stroke Width').setValue(w); st.property('ADBE Vector Stroke Line Cap').setValue(2); return st; };
  K.fill = (v, hex) => { const f = v.addProperty('ADBE Vector Graphic - Fill'); f.property('ADBE Vector Fill Color').setValue(C4(hex)); return f; };
  K.line = (v, pts, closed) => { const p = v.addProperty('ADBE Vector Shape - Group'); const sh = new Shape(); sh.vertices = pts; sh.closed = !!closed; p.property('ADBE Vector Shape').setValue(sh); return p; };
  K.trim = (v, t0, t1) => { const t = v.addProperty('ADBE Vector Filter - Trim'); keys(t.property('ADBE Vector Trim End'), [t0, t1], [0, 100], [10, 85]); return t; };
  K.text = (name, str, font, size, hex, pos, track, just) => {
    const t = L.addText(str); t.name = name;
    const src = t.property('ADBE Text Properties').property('ADBE Text Document'); const td = src.value;
    td.resetCharStyle(); td.text = str; td.font = font; td.fontSize = size; td.applyFill = true; td.fillColor = C(hex); td.applyStroke = false;
    td.justification = just || ParagraphJustification.CENTER_JUSTIFY; td.tracking = track || 0;
    src.setValue(td); tr(t).property('ADBE Position').setValue(pos); return t;
  };
  K.reveal = (t, t0, t1, opts) => { // per-character reveal: scale/opacity/blur/offset, left→right
    opts = opts || {};
    const an = t.property('ADBE Text Properties').property('ADBE Text Animators').addProperty('ADBE Text Animator');
    const ap = an.property('ADBE Text Animator Properties');
    if (opts.scale !== false) ap.addProperty('ADBE Text Scale 3D').setValue([opts.scale || 260, opts.scale || 260, 100]);
    ap.addProperty('ADBE Text Opacity').setValue(0);
    ap.addProperty('ADBE Text Blur').setValue([opts.blur || 24, opts.blur || 24]);
    ap.addProperty('ADBE Text Position 3D').setValue([opts.dx || 0, opts.dy === undefined ? -50 : opts.dy, 0]);
    const sel = an.property('ADBE Text Selectors').addProperty('ADBE Text Selector');
    sel.property('ADBE Text Range Advanced').property('ADBE Text Range Shape').setValue(2);
    keys(sel.property('ADBE Text Percent Offset'), [t0, t1], [-100, 100], [20, 85]);
  };
  K.bg = () => {
    L.addSolid(C('#121010'), 'BG', W, H, 1, DUR);
    const noise = L.addSolid(C('#000000'), 'Grain', W, H, 1, DUR);
    const fn = fx(noise, 'ADBE Fractal Noise'); fn.property(4).setValue(140);
    try { (fn.property('ADBE Fractal Noise-0023') || fn.property(17)).expression = 'time*400'; } catch (e) {}
    noise.blendingMode = BlendingMode.OVERLAY; tr(noise).property('ADBE Opacity').setValue(9);
    const vig = L.addSolid(C('#000000'), 'Vignette', W, H, 1, DUR);
    const m = vig.property('ADBE Mask Parade').addProperty('ADBE Mask Atom'); const sh = new Shape();
    const k = 0.5523, rx = 1150, ry = 720, cx = W / 2, cy = H / 2;
    sh.vertices = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
    sh.inTangents = [[-rx * k, 0], [0, -ry * k], [rx * k, 0], [0, ry * k]];
    sh.outTangents = [[rx * k, 0], [0, ry * k], [-rx * k, 0], [0, -ry * k]]; sh.closed = true;
    m.property('ADBE Mask Shape').setValue(sh); m.property('ADBE Mask Feather').setValue([420, 420]); m.inverted = true;
    tr(vig).property('ADBE Opacity').setValue(70);
  };
  K.grid = (t0, t1, op, drift) => { // flat grid, always-visible "original grid"
    const g = K.shape('Grid'); const v = K.group(g, 'lines'); const N = 14, S = 90, E = N * S;
    for (let i = -N; i <= N; i++) { K.line(v, [[i * S, -E], [i * S, E]]); K.line(v, [[-E, i * S], [E, i * S]]); }
    const st = K.stroke(v, '#F2E2C8', 1.4); st.property('ADBE Vector Stroke Opacity').setValue(op || 14);
    K.trim(v, t0, t1);
    tr(g).property('ADBE Position').setValue([W / 2, H / 2]);
    if (drift) keys(tr(g).property('ADBE Position'), [0, DUR], [[W / 2 + drift, H / 2], [W / 2 - drift, H / 2]], false);
    return g;
  };
  K.disc = (cx, cy, r, t0, t1) => { // the course's big disc as an arc that draws in
    const d = K.shape('Disc');
    const v0 = K.group(d, 'fill'); const e0 = v0.addProperty('ADBE Vector Shape - Ellipse'); e0.property('ADBE Vector Ellipse Size').setValue([2 * r, 2 * r]);
    K.fill(v0, '#211915');
    const v = K.group(d, 'ring'); const e = v.addProperty('ADBE Vector Shape - Ellipse'); e.property('ADBE Vector Ellipse Size').setValue([2 * r + 6, 2 * r + 6]);
    K.stroke(v, '#E06A3A', 4); const t = K.trim(v, t0, t1);
    keys(t.property('ADBE Vector Trim Offset'), [t0, t1], [-120, 60], [10, 85]);
    const v2 = K.group(d, 'dash'); const e2 = v2.addProperty('ADBE Vector Shape - Ellipse'); e2.property('ADBE Vector Ellipse Size').setValue([2 * r + 50, 2 * r + 50]);
    const s2 = K.stroke(v2, '#F2E2C8', 1.4); s2.property('ADBE Vector Stroke Opacity').setValue(30);
    const dd = s2.property('ADBE Vector Stroke Dashes'); dd.addProperty('ADBE Vector Stroke Dash 1').setValue(6); dd.addProperty('ADBE Vector Stroke Gap 1').setValue(18);
    K.trim(v2, t0 + 0.15, t1 + 0.3);
    tr(d).property('ADBE Position').setValue([cx, cy]);
    tr(d).property('ADBE Rotate Z').expression = 'time*5';
    keys(tr(d).property('ADBE Scale'), [t0, t1], [[92, 92], [100, 100]], [10, 85]);
    glow(d, 50, 26, 0.9);
    return d;
  };
  K.star = (x, y, t0, size) => { // ✦ 星点
    const s = K.shape('Star'); const v = K.group(s, 'st'); const a = size || 16, b = a * 0.22;
    K.line(v, [[0, -a], [b, -b], [a, 0], [b, b], [0, a], [-b, b], [-a, 0], [-b, -b]], true); K.fill(v, '#E06A3A');
    tr(s).property('ADBE Position').setValue([x, y]);
    keys(tr(s).property('ADBE Scale'), [t0, t0 + 0.25, t0 + 0.45], [[0, 0], [140, 140], [100, 100]], [10, 70]);
    tr(s).property('ADBE Rotate Z').expression = 'time*40';
    glow(s, 30, 20, 1.2); return s;
  };
  K.fadeAll = (t0, t1, dx) => { // global exit: fade (and slide) every layer
    for (let i = 1; i <= comp.numLayers; i++) {
      const l = comp.layer(i); if (l.name === 'BG' || l.name === 'Grain' || l.name === 'Vignette' || l instanceof CameraLayer) continue;
      const op = tr(l).property('ADBE Opacity'); const v = op.numKeys ? op.valueAtTime(t0, false) : op.value;
      op.setValuesAtTimes([t0, t1], [v, 0]);
    }
  };
  K.blackIn = (t1) => { const s = L.addSolid(C('#121010'), 'FadeIn', W, H, 1, DUR); keys(tr(s).property('ADBE Opacity'), [0, t1], [100, 0], false); return s; };
  return K;
}

function particles(comp, HIT) {
  const parts = comp.layers.addSolid(C('#000000'), 'Sparks', W, H, 1, comp.duration);
  parts.blendingMode = BlendingMode.ADD;
  try {
    const pw = fx(parts, 'CC Particle World');
    const P = (n) => pw.property('CC Particle World-' + ('000' + n).slice(-4));
    const br = P(4); br.setValuesAtTimes([0, HIT - 0.01, HIT, HIT + 0.12, HIT + 0.13], [0, 0, 9, 9, 0]);
    for (let k = 1; k <= br.numKeys; k++) br.setInterpolationTypeAtKey(k, KeyframeInterpolationType.HOLD);
    const set = (n, v) => { try { P(n).setValue(v); } catch (e) { out.push('pw ' + n + ' ' + e); } };
    set(5, 1.1); set(8, -0.03); set(10, 0.12); set(11, 0.03); set(12, 0.05); set(16, 1.4); set(18, 0.18); set(41, 2.5);
    set(19, 0.8); set(20, 360); set(23, 1); set(24, 0.06); set(25, 0); set(26, 60); set(27, 100); set(28, 1);
    set(29, C('#FFE2A0')); set(30, C('#E06A3A')); set(39, 2);
    glow(parts, 30, 20, 1.2);
  } catch (e) { out.push('no particle world ' + e); }
  return parts;
}

// ---------------- EP_Intro (8 s) ----------------
function makeIntro(o) {
  const DUR = 8, HIT = 1.75;
  const comp = newComp(o.name, DUR); const K = kit(comp); const L = comp.layers;
  K.bg();
  // 3D grid + disc + basis vectors with camera fly-in (same language as SPX_Title)
  const grid = K.shape('Grid3D'); grid.threeDLayer = true;
  { const v = K.group(grid, 'lines'); const N = 24, S = 90, E = N * S;
    for (let i = -N; i <= N; i++) { K.line(v, [[i * S, -E], [i * S, E]]); K.line(v, [[-E, i * S], [E, i * S]]); }
    const st = K.stroke(v, '#F2E2C8', 1.6); st.property('ADBE Vector Stroke Opacity').setValue(22);
    const t = v.addProperty('ADBE Vector Filter - Trim'); keys(t.property('ADBE Vector Trim End'), [0, 1.3], [0, 100], [20, 80]);
    const ax = K.group(grid, 'axes'); K.line(ax, [[-E, 0], [E, 0]]); K.line(ax, [[0, -E], [0, E]]); K.stroke(ax, '#E06A3A', 3.2); K.trim(ax, 0.2, 1.4);
    tr(grid).property('ADBE Position').setValue([W / 2, H / 2, 0]); glow(grid, 55, 18, 0.6); }
  const disc = K.shape('Ring3D'); disc.threeDLayer = true;
  { const v = K.group(disc, 'ring'); const e = v.addProperty('ADBE Vector Shape - Ellipse'); e.property('ADBE Vector Ellipse Size').setValue([1030, 1030]);
    K.stroke(v, '#E06A3A', 5); const t = K.trim(v, 0.35, 1.5); keys(t.property('ADBE Vector Trim Offset'), [0.35, 1.5], [-90, 90], [10, 85]);
    tr(disc).property('ADBE Position').setValue([W / 2, H / 2, -2]); tr(disc).property('ADBE Rotate Z').expression = 'time*6'; glow(disc, 40, 30, 1.2); }
  // big outline episode number behind everything
  const num = K.text('BigNum', o.num, 'NotoSerifSC-Black', 720, '#E06A3A', [W / 2, H / 2 + 250], 20);
  { const src = num.property('ADBE Text Properties').property('ADBE Text Document'); const td = src.value;
    td.applyFill = false; td.applyStroke = true; td.strokeColor = C('#E06A3A'); td.strokeWidth = 3; src.setValue(td);
    keys(tr(num).property('ADBE Opacity'), [HIT, HIT + 0.6], [0, 16]); keys(tr(num).property('ADBE Scale'), [HIT, DUR], [[112, 112], [100, 100]], [5, 60]); }
  const cam = L.addCamera('Cam', [W / 2, H / 2]); cam.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
  keys(tr(cam).property('ADBE Position'), [0, 2.2, DUR], [[W / 2 - 260, H / 2 + 420, -1500], [W / 2, H / 2, -2050], [W / 2 + 40, H / 2 - 20, -1900]], [30, 80]);
  keys(tr(cam).property('ADBE Orientation'), [0, 2.2, DUR], [[-24, 10, -6], [0, 0, 0], [1.5, -1.5, 0]], [30, 80]);
  cam.property('ADBE Camera Options Group').property('ADBE Camera Zoom').setValue(2050);
  // shockwave + sparks + flash
  const wave = K.shape('Shockwave');
  { const v = K.group(wave, 'w'); const e = v.addProperty('ADBE Vector Shape - Ellipse'); e.property('ADBE Vector Ellipse Size').setValue([200, 200]);
    const st = K.stroke(v, '#F2B544', 14); keys(st.property('ADBE Vector Stroke Width'), [HIT, HIT + 0.7], [26, 0.5], [10, 60]);
    keys(tr(wave).property('ADBE Scale'), [HIT, HIT + 0.7], [[60, 60], [1100, 1100]], [5, 70]);
    keys(tr(wave).property('ADBE Opacity'), [HIT - 0.01, HIT, HIT + 0.7], [0, 100, 0], false);
    tr(wave).property('ADBE Position').setValue([W / 2, H / 2 - 40]); glow(wave, 30, 40, 1.5); }
  particles(comp, HIT);
  const flash = L.addSolid(C('#F2E2C8'), 'Flash', W, H, 1, DUR); flash.blendingMode = BlendingMode.ADD;
  keys(tr(flash).property('ADBE Opacity'), [HIT - 0.02, HIT, HIT + 0.3], [0, 30, 0], false);
  const plate = K.shape('Plate');
  { const v = K.group(plate, 'p'); const r = v.addProperty('ADBE Vector Shape - Rect'); r.property('ADBE Vector Rect Size').setValue([1400, 560]); r.property('ADBE Vector Rect Roundness').setValue(280);
    K.fill(v, '#121010'); tr(plate).property('ADBE Position').setValue([W / 2, H / 2 + 20]); fx(plate, 'ADBE Gaussian Blur 2').property(1).setValue(90);
    keys(tr(plate).property('ADBE Opacity'), [HIT - 0.1, HIT + 0.4], [0, 86]); }
  // texts
  const tsize = o.title.length <= 4 ? 230 : (o.title.length <= 6 ? 190 : 150);
  const title = K.text('Title', o.title, 'NotoSerifSC-Black', tsize, '#F2E2C8', [W / 2, H / 2 + 45], 50);
  K.reveal(title, HIT - 0.45, HIT + 0.35, { scale: 340, blur: 30, dy: -60 });
  glow(title, 60, 26, 0.7);
  try { const ls = fx(title, 'CC Light Sweep'); ls.property(2).setValue(-30); ls.property(1).setValuesAtTimes([HIT + 0.6, HIT + 1.6], [[W / 2 - 800, H / 2], [W / 2 + 800, H / 2]]); } catch (e) {}
  fx(title, 'ADBE Drop Shadow');
  const sub = K.text('Subtitle', o.sub, 'NotoSansSC-Medium', 50, '#E06A3A', [W / 2, H / 2 + 175], 100);
  keys(tr(sub).property('ADBE Opacity'), [HIT + 0.55, HIT + 1.1], [0, 100]);
  keys(tr(sub).property('ADBE Position'), [HIT + 0.55, HIT + 1.1], [[W / 2, H / 2 + 215], [W / 2, H / 2 + 175]], [20, 85]);
  const tag = K.text('Tag', o.tag, 'NotoSansSC-Medium', 40, '#F2E2C8', [W / 2, H / 2 - 185], 180);
  keys(tr(tag).property('ADBE Opacity'), [HIT + 0.3, HIT + 0.9], [0, 75]);
  const s1 = K.star(W / 2 - 520, H / 2 - 200, HIT + 0.4, 18), s2 = K.star(W / 2 + 560, H / 2 + 200, HIT + 0.55, 14);
  for (const l of [flash, plate, title, sub, tag, s1, s2, num, wave]) l.moveToBeginning();
  comp.layer('Sparks').moveToBeginning(); flash.moveToBeginning();
  K.fadeAll(DUR - 0.6, DUR - 0.05);
  return comp;
}

// ---------------- EP_Card (2.6 s) ----------------
function makeCard(o) {
  const DUR = 2.6;
  const comp = newComp(o.name, DUR); const K = kit(comp);
  K.bg();
  K.grid(0, 0.7, 10, 30);
  const disc = K.disc(1390, 540, 430, 0.1, 0.9);
  // big section number inside the disc, faint
  const ghost = K.text('Ghost', o.num, 'NotoSerifSC-Black', 340, '#E06A3A', [1390, 660], 0);
  keys(tr(ghost).property('ADBE Opacity'), [0.25, 0.8], [0, 14]); keys(tr(ghost).property('ADBE Scale'), [0.25, DUR], [[115, 115], [100, 100]], [5, 60]);
  const LJ = ParagraphJustification.LEFT_JUSTIFY, X = 170;
  const chap = K.text('Chap', o.chap, 'NotoSansSC-Medium', 38, '#A89982', [X, 330], 140, LJ);
  keys(tr(chap).property('ADBE Opacity'), [0.15, 0.5], [0, 100]);
  const num = K.text('Num', o.num, 'NotoSerifSC-Black', 210, '#E06A3A', [X - 8, 545], 20, LJ);
  K.reveal(num, 0.12, 0.55, { scale: 100, blur: 20, dx: -80, dy: 0 });
  const tsz = Math.min(124, Math.floor(740 / o.title.length));
  const title = K.text('Title', o.title, 'NotoSerifSC-Black', tsz, '#F2E2C8', [X, 690], 30, LJ);
  K.reveal(title, 0.3, 0.85, { scale: 180, blur: 24, dy: -40 });
  // width-aware underline
  let tw = 700; try { const r = title.sourceRectAtTime(1.5, false); tw = Math.max(320, Math.min(760, r.width)); } catch (e) {}
  const ul = K.shape('Underline'); { const v = K.group(ul, 'u'); K.line(v, [[0, 0], [tw, 0]]); K.stroke(v, '#E06A3A', 5); K.trim(v, 0.45, 1.0);
    tr(ul).property('ADBE Position').setValue([X, 735]); glow(ul, 60, 14, 0.5); }
  // progress dots
  const dots = K.shape('Dots'); const gap = 36;
  for (let i = 0; i < o.total; i++) {
    const v = K.group(dots, 'd' + i); const e = v.addProperty('ADBE Vector Shape - Ellipse');
    e.property('ADBE Vector Ellipse Size').setValue(i === o.idx ? [18, 18] : [11, 11]);
    if (i <= o.idx) K.fill(v, i === o.idx ? '#E06A3A' : '#A89982'); else { const st = K.stroke(v, '#A89982', 2); st.property('ADBE Vector Stroke Opacity').setValue(60); }
    v.parentProperty.property('ADBE Vector Transform Group').property('ADBE Vector Position').setValue([i * gap, 0]);
  }
  tr(dots).property('ADBE Position').setValue([X + 8, 815]);
  keys(tr(dots).property('ADBE Opacity'), [0.5, 0.9], [0, 100]);
  const cnt = K.text('Count', (o.idx + 1) + ' / ' + o.total, 'NotoSansSC-Medium', 28, '#A89982', [X + o.total * gap + 20, 826], 60, LJ);
  keys(tr(cnt).property('ADBE Opacity'), [0.6, 1.0], [0, 100]);
  K.star(X + tw + 44, 650, 0.75, 14);
  K.fadeAll(DUR - 0.45, DUR - 0.02);
  K.blackIn(0.18);
  return comp;
}

// ---------------- EP_End (10 s) ----------------
function makeEnd(o) {
  const DUR = 10;
  const comp = newComp(o.name, DUR); const K = kit(comp); const L = comp.layers;
  K.bg();
  K.grid(0, 1.0, 12, 40);
  K.disc(W / 2, 440, 410, 0.2, 1.3);
  const done = K.text('Done', o.done, 'NotoSansSC-Medium', 40, '#A89982', [W / 2, 150], 200);
  keys(tr(done).property('ADBE Opacity'), [0.3, 0.8], [0, 100]);
  const nx = K.text('NextLabel', o.nextLabel || '下一集', 'NotoSansSC-Medium', 44, '#E06A3A', [W / 2, 300], 300);
  keys(tr(nx).property('ADBE Opacity'), [0.6, 1.0], [0, 100]);
  const nt = K.text('NextTitle', o.next, 'NotoSerifSC-Black', o.next.length <= 6 ? 150 : 112, '#F2E2C8', [W / 2, 465], 40);
  K.reveal(nt, 0.8, 1.6, { scale: 260, blur: 28, dy: -50 }); glow(nt, 70, 20, 0.4);
  const ns = K.text('NextSub', o.nextSub, 'NotoSansSC-Medium', 36, '#E06A3A', [W / 2, 555], 60);
  keys(tr(ns).property('ADBE Opacity'), [1.5, 2.0], [0, 100]);
  // 一键三连 pills
  const labels = ['点赞', '投币', '收藏'], cols = ['#E06A3A', '#F2B544', '#4FC1A6'];
  for (let i = 0; i < 3; i++) {
    const x = W / 2 + (i - 1) * 240, y = 900, t0 = 2.4 + i * 0.22;
    const p = K.shape('Pill' + i); const v = K.group(p, 'r'); const r = v.addProperty('ADBE Vector Shape - Rect');
    r.property('ADBE Vector Rect Size').setValue([210, 84]); r.property('ADBE Vector Rect Roundness').setValue(42);
    K.stroke(v, cols[i], 4); const f = K.fill(v, cols[i]); f.property('ADBE Vector Fill Opacity').setValue(0);
    keys(f.property('ADBE Vector Fill Opacity'), [3.6 + i * 0.12, 3.8 + i * 0.12], [0, 100]);
    tr(p).property('ADBE Position').setValue([x, y]);
    keys(tr(p).property('ADBE Scale'), [t0, t0 + 0.18, t0 + 0.32], [[0, 0], [118, 118], [100, 100]], [10, 70]);
    glow(p, 80, 14, 0.35);
    const tx = K.text('PillT' + i, labels[i], 'NotoSansSC-Black', 44, '#F2E2C8', [x, y + 16], 60);
    keys(tr(tx).property('ADBE Opacity'), [t0 + 0.1, t0 + 0.3], [0, 100]);
    const td = tx.property('ADBE Text Properties').property('ADBE Text Document');
    const a = td.value; a.fillColor = C(cols[i]); td.setValueAtTime(0, a); const b = td.value; b.fillColor = C('#121010'); td.setValueAtTime(3.7 + i * 0.12, b);
    try { for (let k = 1; k <= td.numKeys; k++) td.setInterpolationTypeAtKey(k, KeyframeInterpolationType.HOLD); } catch (e) {}
  }
  const cta = K.text('CTA', o.cta || '一键三连，下一集见', 'NotoSansSC-Medium', 38, '#A89982', [W / 2, 1010], 160);
  keys(tr(cta).property('ADBE Opacity'), [4.0, 4.5], [0, 100]);
  // characters
  const chars = o.chars || [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    try {
      const f = new File(c.path); const io = new ImportOptions(f); const item = proj.importFile(io);
      const l = L.add(item); l.name = 'Char' + i;
      const sc = c.h / item.height * 100; tr(l).property('ADBE Scale').setValue([sc * (c.flip ? -1 : 1), sc]);
      const y = H - c.h / 2 + 30;
      keys(tr(l).property('ADBE Position'), [c.t, c.t + 0.6], [[c.x, y + 400], [c.x, y]], [10, 85]);
      keys(tr(l).property('ADBE Opacity'), [c.t, c.t + 0.3], [0, 100]);
    } catch (e) { out.push('char ' + c.path + ' ' + e); }
  }
  K.fadeAll(DUR - 0.8, DUR - 0.05);
  K.blackIn(0.25);
  return comp;
}

// ---------------- dispatch ----------------
const A = args || {};
const made = [];
for (const it of (A.items || [])) {
  const c = it.kind === 'intro' ? makeIntro(it) : (it.kind === 'card' ? makeCard(it) : makeEnd(it));
  made.push(c.name);
  if (A.queue) {
    const rq = proj.renderQueue.items.add(c);
    const om = rq.outputModule(1);
    om.file = new File(A.outDir + '\\' + c.name + '.mp4');
  }
}
return { made: made, log: out };
