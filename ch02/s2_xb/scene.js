// 第 2 章 复习（下）期中真题 + Leon Test B（题源见 lines.py 头注）。
// 结构：四个套路，每个套路 1–2 道题：题卡 → 大肥鱼先做（气泡）→ 翻车 / 卡住 → Claude 步骤 → 验算。左栏是「套路卡」，逐条点亮。
//   D01–C01   开场
//   C02–G01   套路一 拆乘积：Leon B1（½A、B⁻¹Aᵀ、EA²）→ 2018-19 第 4 题 → 2017-18 |5AᵀA*A⁻¹| → GPT 三个指数陷阱
//   C12–D06   套路二 含参数：Leon B2（x³ − x，配 y = x³ − x 小图）→ 2018-19 第 6 题 Cramer
//   C18–G02   套路三 看结构：2015-16 第 1 题（等差行 → 0；adj；验算 A·adj A = O）
//   C22–C25   套路四 余子式组合：2021-22 第 5 题（范德蒙德 −48；换第 3 行 → 12）
//   G03       快招：A² − A − 2I = O
//   D09–C26   总结
import { C, F } from '../../engine/style/tokens.js';
import { lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_happy', 'ds_think', 'ds_shock', 'ds_proud', 'gpt_explain', 'gpt_point'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const OK = '#4FC1A6';

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.8, C06: 0.7, C09: 0.7, G01: 0.4, C12: 0.8, C15: 0.7, C18: 0.8, C22: 0.8, G03: 0.7, D09: 0.7, C04: 0.3, C05: 0.3, C07: 0.4, C08: 0.4, C10: 0.4, C11: 0.4, C13: 0.4, C14: 0.4, C16: 0.4, C17: 0.4, C19: 0.4, C20: 0.4, C21: 0.4, C23: 0.4, C24: 0.4, C25: 0.4 },
    post: { C05: 0.5, C07: 0.5, C08: 0.6, C11: 0.6, G01: 0.5, C14: 0.6, C16: 0.5, D06: 0.5, C20: 0.5, G02: 0.5, C25: 0.6, G03: 0.6 }, tail: 0.6,
  });
  const L = TL.L, cue = TL.cue;
  const cast = new Cast(R.envelope, TL);
  for (const n of assets.chars) cast.add(n, R.img[n], SHADOW[n.split('_')[0]]);
  const dir = makeDirector(TL, cast, {
    C: { x: 250, y: 1095, h: 470, in: [0.9, 1.6] },
    D: { x: 1738, y: 1095, h: 500 },
    G: { x: 1716, y: 1095, h: 500 },
  });
  const K = makeKit(ctx);

  const T = {
    hi: cue('D01', '报仇'), four: cue('C01', '四个套路'),
    s1: L('C02').s - 0.6, b1g: cue('C02', 'A和B都是'), b1q: L('C03').s, b1a: cue('C03', '二分之一A'), b1b: cue('C03', 'B逆乘'), b1c: cue('C03', 'E乘A方'),
    b1w: L('D02').s, b1x: L('C04').s, b1r: cue('C04', '每一行都提出'), b1B: L('D03').s, b1C: L('C05').s, b1Cr: cue('C05', '所以答案'),
    q4: L('C06').s - 0.5, q4E: cue('C06', 'E把第二行'), q4A: cue('C06', 'A的三行'), q4e: L('C07').s, q4r: cue('C07', '倍加不改变'), q4i: L('C08').s,
    q5: L('C09').s - 0.5, q5s: L('D04').s, q5a: L('C10').s, q5a2: cue('C10', '两边取行列式'), q5b: L('C11').s, trap: L('G01').s - 0.2, tr1: cue('G01', '数乘'), tr2: cue('G01', '伴随是'), tr3: cue('G01', '求逆是'),
    s2: L('C12').s - 0.6, b2q: cue('C12', '问x取什么值'), b2e: L('C13').s, b2c: cue('C13', '后两项正好抵消'), b2r: L('C14').s, b2z: cue('C14', '所以x等于'),
    q6: L('C15').s - 0.5, q6d: L('C16').s, q6u: cue('C16', '所以拉姆达'), q6x: L('C17').s, q6v: L('D06').s,
    s3: L('C18').s - 0.6, q3q: cue('C18', '求A的行列式'), q3w: L('D07').s, q3l: L('C19').s, q3l2: cue('C19', '等于第二行'), q3d: L('C20').s, q3p: cue('C20', '平行六面体'), q3adj: L('C21').s, q3v: L('G02').s, q3v2: cue('G02', '比如第一行'),
    s4: L('C22').s - 0.6, q7q: cue('C22', '求A的行列式'), q7v: L('C23').s, q7vd: cue('C23', '范德蒙德'), q7vr: cue('C23', '等于负四十八'), q7s: L('D08').s, q7b: L('C24').s, q7sw: cue('C24', '把第三行换成'), q7r: L('C25').s,
    g3: L('G03').s - 0.5, g3b: cue('G03', '两边取行列式'),
    end: L('D09').s - 0.6, z1: cue('D09', '拆乘积'), z2: cue('D09', '含参数'), z3: cue('D09', '先看结构'), z4: cue('D09', '余子式组合'), next: cue('C26', '下一章'),
  };
  const SEC = [[T.s1, T.s2], [T.s2, T.s3], [T.s3, T.s4], [T.s4, T.g3], [T.g3, T.end]];

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.four, 0.3);
  [T.s1, T.s2, T.s3, T.s4, T.g3].forEach(t0 => TL.sfx('whoosh', t0, 0.3));
  TL.sfx('pop', T.b1w + 0.3, 0.28); TL.sfx('buzz', T.b1x + 0.2, 0.22); TL.sfx('check', T.b1r + 1.0, 0.3); TL.sfx('check', T.b1C + 0.2, 0.3); TL.sfx('check', T.b1Cr, 0.3);
  TL.sfx('pluck', T.q4A, 0.3); TL.sfx('marimba', T.q4e + 0.6, 0.28); TL.sfx('check', T.q4r, 0.3); TL.sfx('ding', T.q4i + 1.5, 0.3);
  TL.sfx('sting', T.q5s, 0.25); TL.sfx('swell', T.q5a, 0.3); TL.sfx('stamp', T.q5a2 + 1.0, 0.3); TL.sfx('ding', T.q5b + 1.2, 0.35); [T.tr1, T.tr2, T.tr3].forEach(t0 => TL.sfx('pluck', t0, 0.28));
  TL.sfx('sparkle', T.b2c, 0.3); TL.sfx('ding', T.b2z, 0.35); TL.sfx('stamp', T.q6u, 0.3); TL.sfx('marimba', T.q6x + 0.6, 0.28); TL.sfx('check', T.q6v + 0.8, 0.3);
  TL.sfx('pop', T.q3w + 0.3, 0.28); TL.sfx('sting', T.q3l2, 0.25); TL.sfx('stamp', T.q3p, 0.3); TL.sfx('check', T.q3v2 + 1.5, 0.3);
  TL.sfx('ding', T.q7vr, 0.3); TL.sfx('sting', T.q7s, 0.25); TL.sfx('swoosh_in', T.q7sw, 0.3); TL.sfx('ding', T.q7r + 0.5, 0.35); TL.sfx('stamp', T.g3b + 1.2, 0.3);
  TL.sfx('whoosh', T.end, 0.3); [T.z1, T.z2, T.z3, T.z4].forEach(t0 => TL.sfx('check', t0, 0.3)); TL.sfx('shimmer', L('C26').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);
  const rv = (t0, d = 1.0) => prog(t, t0, t0 + d);
  const head = (txt, src, a, col = C.peri) => { K.tag(txt, DX, DY - 370, { px: 32, a, align: 'center', color: col, font: F.serif, w: 900 }); if (src) K.tag(src, DX, DY - 320, { px: 26, a, align: 'center', color: C.inkMid, w: 700 }); };

  function bubble(x, y, text, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = F.sans(32, 900); const w = ctx.measureText(text).width + 44;
    ctx.fillStyle = C.ds; ctx.globalAlpha = a * 0.9; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 30, w, 60, 30); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w / 2 - 40, y + 28); ctx.lineTo(x + w / 2 - 10, y + 52); ctx.lineTo(x + w / 2 - 14, y + 26); ctx.fill();
    ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1); ctx.restore();
  }
  function strike(x, y, w, s, a) {   // 红色删除线
    if (s <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.free; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - w / 2, y + 8); ctx.lineTo(x - w / 2 + w * s, y - 8); ctx.stroke(); ctx.restore();
  }

  function drawTitle() {
    const a = 1 - smooth(prog(t, T.s1 - 0.2, T.s1 + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第二章 · 复习', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'期中真题'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 2 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'MIDTERM · TEST B', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    ['① 拆乘积', '② 含参数', '③ 看结构', '④ 余子式组合'].forEach((s, i) => K.tag(s, DX + (i % 2 ? 170 : -170), DY - 60 + Math.floor(i / 2) * 110, { px: 42, a: a * gin(T.four + i * 0.25, 0.4), align: 'center', color: [C.i, C.j, C.k, C.peri][i], w: 900 }));
  }

  // ── 套路一 ──
  function drawS1() {
    let a = win(t, T.s1, T.q4, 0.4, 0.4);
    if (a > 0) {
      head('套路一 · 拆乘积', 'Leon 第二章 Test B 第 1 题', a, C.i);
      K.tag('A、B 都是 3 阶：det A = 4，det B = 6；E 交换两行', DX, DY - 240, { px: 32, a: a * gin(T.b1g), align: 'center', color: C.ink, w: 900 });
      const rows = [['b1a', T.b1a], ['b1b', T.b1b], ['b1c', T.b1c]];
      rows.forEach(([k, t0], i) => { const y = DY - 110 + i * 130; texAt(k, DX - 230, y, 50, { alpha: a * gin(t0), reveal: rv(t0, 0.6) }); K.tag('=', DX - 60, y, { px: 44, a: a * gin(t0), align: 'center', color: C.inkMid, w: 900, font: F.serif }); });
      // 第 1 行：大肥鱼的错答 → 删除 → 正解
      const y0 = DY - 110, wA = a * gin(T.b1w + 0.4) * (1 - gin(T.b1r, 0.4));
      texAt('b1aw', DX + 140, y0, 46, { alpha: wA, color: C.ds }); strike(DX + 140, y0, 190, prog(t, T.b1x + 0.1, T.b1x + 0.5), wA);
      texAt('b1ar', DX + 160, y0, 46, { alpha: a * gin(T.b1r + 0.2), reveal: rv(T.b1r + 0.2, 1.0), color: OK });
      bubble(DX + 150, y0 - 80, '大肥鱼：2！', a * win(t, T.b1w + 0.2, T.b1r, 0.3, 0.3));
      texAt('b1br', DX + 140, y0 + 130, 46, { alpha: a * gin(T.b1B + 0.6), reveal: rv(T.b1B + 0.6, 1.0), color: OK });
      K.tag('大肥鱼 ✓', DX + 340, y0 + 130, { px: 26, a: a * gin(T.b1C), color: C.ds, w: 900 });
      texAt('b1cr', DX + 160, y0 + 260, 46, { alpha: a * gin(T.b1C + 0.3), reveal: rv(T.b1C + 0.3, 1.2), color: OK });
    }
    a = win(t, T.q4, T.q5, 0.4, 0.4);
    if (a > 0) {
      head('套路一 · 拆乘积', '2018-2019 期中 第 4 题', a, C.i);
      const pl = tex.place('q4A', DX, DY - 200, 38, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.q4E), reveal: rv(T.q4E, 1.4), skip: ['a'] }); tex.draw(ctx, pl, { alpha: a * gin(T.q4A + 0.8), only: ['a'], force: C.peri });
      K.tag('倍加：det E = 1', DX - 230, DY - 90, { px: 28, a: a * gin(T.q4E + 0.8), align: 'center', color: C.j, w: 900 });
      const pe = tex.place('q4e', DX, DY - 10, 42, 'c'); tex.draw(ctx, pe, { alpha: a * gin(T.q4e), reveal: rv(T.q4e, 1.4), skip: ['a'] }); tex.draw(ctx, pe, { alpha: a * gin(T.q4e), only: ['a'], force: C.peri });
      texAt('q4r', DX, DY + 110, 40, { alpha: a * gin(T.q4r), reveal: rv(T.q4r, 1.0), color: OK });
      texAt('q4i', DX, DY + 230, 44, { alpha: a * gin(T.q4i), reveal: rv(T.q4i, 1.6), color: OK });
    }
    a = win(t, T.q5, T.s2, 0.4, 0.4);
    if (a > 0) {
      head('套路一 · 拆乘积', '2017-2018 期中 第 1(iii) 题', a, C.i);
      texAt('q5', DX, DY - 240, 44, { alpha: a * gin(T.q5 + 0.4), reveal: rv(T.q5 + 0.4, 1.2) });
      K.tag('A* = 伴随矩阵', DX, DY - 175, { px: 28, a: a * gin(T.q5 + 1.8), align: 'center', color: C.inkMid, w: 700 });
      bubble(DX - 160, DY - 100, '大肥鱼：没学过啊！', a * win(t, T.q5s, T.q5a + 0.6, 0.3, 0.3));
      texAt('q5a', DX, DY - 80, 36, { alpha: a * gin(T.q5a), reveal: rv(T.q5a, 2.6) });
      texAt('q5b', DX, DY + 40, 46, { alpha: a * gin(T.q5b), reveal: rv(T.q5b, 1.6), color: OK });
      const tr = [['数乘：cⁿ', T.tr1, C.i], ['伴随：|A|ⁿ⁻¹', T.tr2, C.peri], ['求逆：1 / |A|', T.tr3, C.j]];
      K.tag('三个指数陷阱', DX, DY + 150, { px: 30, a: a * gin(T.trap), align: 'center', color: C.gpt, w: 900 });
      tr.forEach(([s, t0, col], i) => K.tag(s, DX - 290 + i * 290, DY + 225, { px: 34, a: a * gin(t0) * outBack(prog(t, t0, t0 + 0.4)), align: 'center', color: col, w: 900, font: F.serif }));
    }
  }

  // ── 套路二 ──
  function drawS2() {
    let a = win(t, T.s2, T.q6, 0.4, 0.4);
    if (a > 0) {
      head('套路二 · 含参数', 'Leon 第二章 Test B 第 2 题', a, C.j);
      texAt('b2', DX - 160, DY - 200, 40, { alpha: a * gin(T.s2 + 0.8), reveal: rv(T.s2 + 0.8, 1.0) });
      K.tag('奇异 ⇔ det A = 0', DX + 230, DY - 200, { px: 34, a: a * gin(T.b2q), align: 'center', color: C.free, w: 900, font: F.serif });
      const pe = tex.place('b2e', DX, DY - 40, 44, 'c'); const cc = gin(T.b2c, 0.5);
      tex.draw(ctx, pe, { alpha: a * gin(T.b2e), reveal: rv(T.b2e, 1.6), skip: ['c'] }); tex.draw(ctx, pe, { alpha: a * gin(T.b2e + 1.0) * (1 - 0.65 * cc), only: ['c'], force: cc > 0.5 ? C.inkMid : C.ink });
      if (cc > 0) { const bx = tex.groupBox(pe, 'c'); if (bx) { ctx.save(); ctx.globalAlpha = a * cc; ctx.strokeStyle = C.free; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx.x - bx.w / 2, bx.y + 4); ctx.lineTo(bx.x - bx.w / 2 + bx.w * cc, bx.y + 4); ctx.stroke(); ctx.restore(); K.tag('抵消', bx.x, bx.y + 50, { px: 26, a: a * cc, align: 'center', color: C.free, w: 900 }); } }
      texAt('b2r', DX, DY + 80, 46, { alpha: a * gin(T.b2r), reveal: rv(T.b2r, 1.2), color: OK });
      // y = x³ − x 小图：三个零点
      const ga = a * gin(T.b2z, 0.5);
      if (ga > 0) {
        const ox = DX, oy = DY + 230, ux = 110, uy = 90;
        ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - 230, oy); ctx.lineTo(ox + 230, oy); ctx.stroke();
        ctx.strokeStyle = C.j; ctx.lineWidth = 4; ctx.beginPath();
        for (let k = 0; k <= 60; k++) { const x = -1.6 + 3.2 * k / 60, y = x * x * x - x; const px = ox + ux * x, py = oy - uy * Math.max(-0.75, Math.min(0.75, y)); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.stroke(); ctx.fillStyle = C.free; [-1, 0, 1].forEach(x => { ctx.beginPath(); ctx.arc(ox + ux * x, oy, 9, 0, 7); ctx.fill(); }); ctx.restore();
        [-1, 0, 1].forEach(x => K.tag(String(x).replace('-', '−'), ox + ux * x, oy + 40, { px: 28, a: ga, align: 'center', color: C.free, w: 900, font: F.serif }));
        K.tag('x = 0、±1 时奇异', DX + 300, DY + 180, { px: 28, a: ga, align: 'center', color: C.free, w: 900 });
      }
    }
    a = win(t, T.q6, T.s3, 0.4, 0.4);
    if (a > 0) {
      head('套路二 · 含参数', '2018-2019 期中 第 6 题', a, C.j);
      texAt('q6s', DX, DY - 220, 44, { alpha: a * gin(T.q6 + 0.5), reveal: rv(T.q6 + 0.5, 1.4) });
      texAt('q6d', DX, DY - 70, 38, { alpha: a * gin(T.q6d), reveal: rv(T.q6d, 2.0) });
      K.tag('唯一解 ⇔ λ ≠ 6 且 λ ≠ −1', DX, DY + 30, { px: 36, a: a * gin(T.q6u), align: 'center', color: C.peri, w: 900, font: F.serif });
      texAt('q6x', DX, DY + 160, 34, { alpha: a * gin(T.q6x), reveal: rv(T.q6x, 2.0), color: OK });
      K.tag('大肥鱼验算：代回两个方程都成立 ✓', DX, DY + 275, { px: 28, a: a * gin(T.q6v + 0.8), align: 'center', color: C.ds, w: 900 });
    }
  }

  // ── 套路三 ──
  function drawS3() {
    const a = win(t, T.s3, T.s4, 0.4, 0.4); if (a <= 0) return;
    head('套路三 · 先看结构', '2015-2016 期中 第 1 题', a, C.k);
    const lA = gin(T.q3l, 0.5), pl = tex.place('q3', DX - 200, DY - 180, 44, 'c');
    tex.draw(ctx, pl, { alpha: a * gin(T.s3 + 0.8), reveal: rv(T.s3 + 0.8, 1.0), skip: lA > 0.3 ? ['a', 'b', 'c'] : [] });
    if (lA > 0.3) { tex.draw(ctx, pl, { alpha: a, only: ['a'], force: C.i }); tex.draw(ctx, pl, { alpha: a, only: ['b'], force: C.j }); tex.draw(ctx, pl, { alpha: a, only: ['c'], force: C.k }); }
    bubble(DX + 190, DY - 230, '大肥鱼：对角线法则，六项…', a * win(t, T.q3w + 0.2, T.q3l + 0.4, 0.3, 0.3));
    K.tag('r₃ − r₂ = r₂ − r₁ = (1, 1, 1)', DX + 200, DY - 150, { px: 32, a: a * gin(T.q3l2), align: 'center', color: C.peri, w: 900, font: F.serif });
    texAt('q3d', DX, DY - 30, 46, { alpha: a * gin(T.q3d), reveal: rv(T.q3d, 1.2), color: OK });
    K.tag('三行线性相关 → 平行六面体压扁', DX, DY + 40, { px: 30, a: a * gin(T.q3p), align: 'center', color: C.free, w: 900 });
    texAt('q3adj', DX - 120, DY + 175, 38, { alpha: a * gin(T.q3adj), reveal: rv(T.q3adj, 1.6) });
    K.tag('A · adj A = det A · I = O', DX + 250, DY + 140, { px: 28, a: a * gin(T.q3v), align: 'center', color: C.gpt, w: 900, font: F.serif });
    K.tag('(1,2,3)·(−1,2,−1) = 0 ✓', DX + 250, DY + 200, { px: 28, a: a * gin(T.q3v2 + 1.0), align: 'center', color: OK, w: 900, font: F.serif });
  }

  // ── 套路四 + 快招 ──
  function drawS4() {
    let a = win(t, T.s4, T.g3, 0.4, 0.4);
    if (a > 0) {
      head('套路四 · 余子式组合', '2021-2022 期中 第 5 题', a, C.peri);
      const sw = gin(T.q7sw, 0.5);
      texAt('q7', DX - 190, DY - 170, 38, { alpha: a * gin(T.s4 + 0.8) * (1 - sw), reveal: rv(T.s4 + 0.8, 1.2) });
      const pb = tex.place('q7b', DX - 140, DY - 170, 38, 'c'); tex.draw(ctx, pb, { alpha: a * sw, skip: ['r'] }); tex.draw(ctx, pb, { alpha: a * sw, only: ['r'], force: C.peri });
      K.tag('← 第 3 行换成系数', DX + 80, DY - 122, { px: 28, a: a * sw, align: 'left', color: C.peri, w: 900 });
      texAt('q7e', DX + 230, DY - 230 + 0 * sw, 30, { alpha: a * gin(T.q7q) * (1 - sw), color: C.ink });
      K.tag('每行：1, x, x², x³', DX + 230, DY - 150, { px: 30, a: a * gin(T.q7v) * (1 - sw), align: 'center', color: C.ink, w: 900, font: F.serif });
      K.tag('x = 1, 2, 3, −1', DX + 230, DY - 100, { px: 30, a: a * gin(T.q7v + 1.2) * (1 - sw), align: 'center', color: C.i, w: 900, font: F.serif });
      texAt('q7v', DX, DY + 40, 42, { alpha: a * gin(T.q7vd), reveal: rv(T.q7vd, 1.2), color: OK });
      bubble(DX + 150, DY + 140, '大肥鱼：四个三阶行列式？', a * win(t, T.q7s + 0.2, T.q7b + 0.6, 0.3, 0.3));
      texAt('q7e', DX - 60, DY + 170, 40, { alpha: a * gin(T.q7r), color: C.peri });
      K.tag('= 12', DX + 220, DY + 170, { px: 44, a: a * gin(T.q7r + 0.5) * outBack(prog(t, T.q7r + 0.5, T.q7r + 0.9)), align: 'left', color: OK, w: 900, font: F.serif });
      K.tag('系数换进那一行，再算一个行列式', DX, DY + 260, { px: 30, a: a * gin(T.q7r + 1.4), align: 'center', color: C.peri, w: 900 });
    }
    a = win(t, T.g3, T.end, 0.4, 0.4);
    if (a > 0) {
      head('快招', '2023-2024 期中 第 8(ii) 题', a, C.gpt);
      K.tag('证明 A 非奇异', DX, DY - 220, { px: 36, a: a * gin(T.g3 + 0.6), align: 'center', color: C.ink, w: 900 });
      texAt('g3', DX, DY - 100, 46, { alpha: a * gin(T.g3 + 1.2), reveal: rv(T.g3 + 1.2, 2.0) });
      texAt('g3b', DX, DY + 30, 46, { alpha: a * gin(T.g3b), reveal: rv(T.g3b, 1.6), color: OK });
      K.tag('⇒ det A ≠ 0 ⇒ A 非奇异', DX, DY + 150, { px: 38, a: a * gin(T.g3b + 1.8), align: 'center', color: C.gpt, w: 900, font: F.serif });
    }
  }

  function drawEnd() {
    const a = smooth(prog(t, T.end, T.end + 0.6)); if (a <= 0) return;
    K.tag('行列式 · 四个套路', DX, DY - 300, { px: 46, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    [['① 拆乘积：记住指数', T.z1, C.i], ['② 含参数：令 det = 0', T.z2, C.j], ['③ 先看结构，再动笔', T.z3, C.k], ['④ 余子式组合：换掉那一行', T.z4, C.peri]]
      .forEach(([s, t0, col], i) => K.tag(s, DX, DY - 180 + i * 85, { px: 38, a: a * gin(t0), align: 'center', color: col, w: 900 }));
    K.tag('第二章 完 · 下一章：向量空间', DX, DY + 210, { px: 32, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const a = smooth(prog(t, T.s1, T.s1 + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; K.head('套路卡', 210, 1, 1);
    const items = [['① 拆乘积：记指数', C.i], ['② 含参数：det = 0', C.j], ['③ 先看结构', C.k], ['④ 余子式组合：换行', C.peri], ['＋ 快招：取行列式', C.gpt]];
    items.forEach(([s, col], i) => {
      const [t0, t1] = SEC[i]; if (t < t0 - 0.2) return;
      const cur = t >= t0 && t < t1;
      K.bullet(s, 290 + i * 60, gin(t0), { color: cur ? col : C.inkMid, mark: cur ? col : C.inkMid });
    });
    ctx.restore();
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 复习', prog(t, 0.2, 1.3));
    drawTitle(); drawS1(); drawS2(); drawS3(); drawS4(); drawEnd();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
