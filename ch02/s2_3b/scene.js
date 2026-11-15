// 第 2 章 §2.3（下）应用：密码与叉积（Leon 9th §2.3 Application 1 Coded Messages、The Cross Product、Application 2；同济高数下册 第八章 向量积）。
// 3B1B 视角（EoLA 第 10–11 集）：|x × y| = 平行四边形面积、方向垂直；w · (x × y) = det(w; x; y) = 平行六面体体积。
// 分镜：
//   D01–C01   钩子：两个应用
//   C02–C03   字母 → 数字；E 的频率暴露
//   C04–C05   按列排成 B → AB → 发送；两个 E 变成 80、69
//   D02–C09   解密：A⁻¹ = adj A / det A，det = ±1 ⇒ 整数；造 A：I 连续倍加
//   G01       希尔密码提醒
//   C10–C11   叉积分量公式（难记）
//   C12–C13   行列式记号 → 例 (1,2,3)×(4,5,6)
//   D03–C15   形式记号的真意：w · (x × y) = det；w = x ⇒ 0 ⇒ 垂直
//   C16–C20   三维：平行四边形面积 → 平行六面体体积 → 右手定则、交换变号
//   G02–G03   物理应用；同济高数对照
//   D04–C21   总结
import { C, F } from '../../engine/style/tokens.js';
import { lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { arrow } from '../../engine/la2d/plane.js';
import { polyFill } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_ask', 'ds_think', 'ds_confused', 'ds_proud', 'gpt_point', 'gpt_cross', 'gpt_explain'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const LET = [...'SENDMONEY'];
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const MSG = MJ.msg, SENT = MJ.AB[0].map((_, j) => MJ.AB.map(r => r[j])).flat();   // 按列读出 AB
  const GX = MJ.gx, GY = MJ.gy, GXY = MJ.gxy, GW = MJ.gw;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.6, C03: 0.4, C04: 0.6, C05: 0.4, C06: 0.4, C07: 0.4, C08: 0.4, C09: 0.5, G01: 0.6, C10: 0.7, C11: 0.4, C12: 0.6, C13: 0.4, C14: 0.4, C15: 0.4, C16: 0.7, C17: 0.4, C18: 0.5, C19: 0.4, C20: 0.5, G02: 0.6, G03: 0.5, D04: 0.7 },
    post: { C02: 0.5, C03: 0.6, C05: 0.9, C07: 0.7, C08: 0.8, C09: 0.6, C11: 0.6, C13: 0.9, C15: 0.9, C17: 0.7, C18: 0.9, C19: 0.6, C20: 0.8, G03: 0.6 }, tail: 0.6,
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
    hook: L('D01').s, enc: cue('C01', '加密信息'), crs: cue('C01', '叉积'),
    cd: L('C02').s - 0.5, cdN: cue('C02', '五、八、十'), freq: L('C03').s, freqE: cue('C03', '出现最多的那个数'),
    mat: L('C04').s - 0.5, matB: cue('C04', '按列排成'), matA: cue('C04', '左乘'), sent: L('C05').s, twoE: cue('C05', '两个E'),
    dq: L('D02').s, dec: L('C06').s - 0.2, decI: cue('C06', '最好也是整数'), fm: L('C07').s - 0.2, pm1: cue('C07', '只要A的行列式'),
    inv: L('C08').s - 0.2, back: cue('C08', '乘回去'), mk: L('C09').s - 0.3, mkD: cue('C09', '倍加不改变'),
    hill: L('G01').s - 0.4, mod: cue('G01', '取余数'),
    cx: L('C10').s - 0.5, hard: L('C11').s - 0.2,
    cd2: L('C12').s - 0.5, cdE: cue('C12', '第一行写'), cdX: cue('C12', '按第一行展开'), cof: L('C13').s - 0.2, ex: cue('C13', '例如'),
    form: L('D03').s, fw: cue('C14', '数字向量w'), same: L('C15').s - 0.2, perp: cue('C15', '同时垂直'), ver: cue('C15', '验证一下'),
    g3: L('C16').s - 0.5, gPar: cue('C16', '平行四边形'), gUp: cue('C16', '叉积垂直'), gLen: cue('C16', '长度等于'),
    gEx: L('C17').s - 0.2, gXY: cue('C17', '叉积是零、零、二'), gW: L('C18').s - 0.2, gV: cue('C18', '体积等于'), gDet: cue('C18', '三阶行列式'),
    dual: L('C19').s - 0.2, dualW: cue('C19', '对偶'), rh: L('C20').s - 0.2, sw: cue('C20', '交换x和y'),
    phy: L('G02').s - 0.4, ph2: cue('G02', '角动量'), ph3: cue('G02', '洛伦兹力'), ph4: cue('G02', '牛顿'),
    tj: L('G03').s - 0.4, tjB: cue('G03', '高数下册'), tjD: cue('G03', '三阶行列式'),
    end0: L('D04').s - 0.6, z1: cue('D04', '可以加密'), z2: cue('D04', '叉积用行列式'), z3: cue('D04', '长度是面积'), next: cue('C21', '下面两节'),
  };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.enc, 0.3); TL.sfx('pop', T.crs, 0.3);
  TL.sfx('whoosh', T.cd, 0.3); LET.forEach((_, k) => TL.sfx('click', T.cdN + k * 0.32, 0.18)); TL.sfx('sting', T.freqE, 0.25);
  TL.sfx('whoosh', T.mat, 0.3); TL.sfx('swoosh_in', T.matB, 0.3); TL.sfx('pluck', T.matA, 0.3); TL.sfx('marimba', T.sent + 0.4, 0.28); TL.sfx('check', T.twoE, 0.3);
  TL.sfx('swell', T.dec, 0.3); TL.sfx('stamp', T.fm + 0.6, 0.35); TL.sfx('ding', T.pm1, 0.35); TL.sfx('pop', T.inv + 0.5, 0.3); TL.sfx('sparkle', T.back, 0.35); TL.sfx('check', T.mkD, 0.3);
  TL.sfx('ding_lo', T.hill + 0.3, 0.3);
  TL.sfx('whoosh', T.cx, 0.3); TL.sfx('sting', T.hard + 0.4, 0.25); TL.sfx('swell', T.cd2, 0.3); TL.sfx('pluck', T.cdE, 0.3); [0, 1, 2].forEach(k => TL.sfx('marimba', T.cof + 0.4 + k * 0.6, 0.28)); TL.sfx('ding', T.ex + 1.2, 0.3);
  TL.sfx('pluck', T.fw, 0.3); TL.sfx('stamp', T.same + 0.6, 0.3); TL.sfx('check', T.ver + 1.0, 0.3);
  TL.sfx('warp', T.g3, 0.35); TL.sfx('pop', T.gUp, 0.3); TL.sfx('ding', T.gXY, 0.35); TL.sfx('swoosh_in', T.gW, 0.3); TL.sfx('stamp', T.gV, 0.3); TL.sfx('sparkle', T.dualW, 0.35); TL.sfx('whoosh', T.sw, 0.3);
  TL.sfx('bell_soft', T.phy + 0.2, 0.3); [T.ph2, T.ph3, T.ph4].forEach(t => TL.sfx('pluck', t, 0.28)); TL.sfx('bell_soft', T.tj + 0.2, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.z1, T.z2, T.z3].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C21').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);
  const reveal = (t0, d = 1.0) => prog(t, t0, t0 + d);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.2, L('C01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第二章 · 行列式', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'2.3 密码与叉积'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'CODES · CROSS PRODUCT', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    K.tag('判奇异 · 求逆 · 解方程', DX, DY - 120, { px: 44, a: a * gin(T.hook + 0.6, 0.5), align: 'center', color: C.inkMid, w: 900 });
    K.tag('还能做什么？', DX, DY - 20, { px: 50, a: a * gin(T.hook + 2.0, 0.5), align: 'center', color: C.peri, w: 900, font: F.serif });
    K.tag('整数矩阵加密', DX - 180, DY + 120, { px: 44, a: a * gin(T.enc, 0.4), align: 'center', color: C.j, w: 900 });
    K.tag('叉积', DX + 200, DY + 120, { px: 44, a: a * gin(T.crs, 0.4), align: 'center', color: C.i, w: 900 });
  }

  // 一排字母 / 数字（间距 88，单词间多 30）
  const slotX = k => DX + (k - 4) * 88 + (k >= 4 ? 15 : -15);
  function row(vals, y, px, { a = 1, t0 = null, step = 0.32, color = C.ink, hi = [], hiCol = C.free, font = F.serif } = {}) {
    vals.forEach((v, k) => {
      const g = t0 == null ? 1 : outBack(prog(t, t0 + k * step, t0 + k * step + 0.35)); if (g <= 0) return;
      K.tag(String(v), slotX(k), y, { px: px * (0.6 + 0.4 * g), a: a * Math.min(1, g), align: 'center', color: hi.includes(k) ? hiCol : color, w: 900, font });
    });
  }

  // ── 字母编码 ──
  function drawCode() {
    const a = win(t, T.cd, T.mat + 0.2, 0.5, 0.4); if (a <= 0) return;
    K.tag('字母 → 数字', DX, DY - 330, { px: 36, a, align: 'center', color: C.peri, w: 900 });
    const hE = gin(T.freqE, 0.4) > 0.5 ? [1, 7] : [];
    row(LET, DY - 200, 60, { a: a * gin(T.cd + 0.4), hi: hE });
    row(MSG, DY - 100, 48, { a, t0: T.cdN, color: C.i, hi: hE });
    ctx.save(); ctx.globalAlpha = a * gin(T.cdN); ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; ctx.setLineDash([4, 8]);
    LET.forEach((_, k) => { ctx.beginPath(); ctx.moveTo(slotX(k), DY - 165); ctx.lineTo(slotX(k), DY - 135); ctx.stroke(); }); ctx.restore();
    K.tag('英文里最常见的字母：E', DX, DY + 60, { px: 40, a: a * gin(T.freq + 0.4), align: 'center', color: C.ink, w: 900 });
    K.tag('长消息里：出现最多的数 ≈ E  →  一猜就破', DX, DY + 150, { px: 34, a: a * gin(T.freqE), align: 'center', color: C.free, w: 900 });
  }

  // ── 矩阵加密 ──
  function drawEnc() {
    const a = win(t, T.mat + 0.2, T.dec, 0.5, 0.4); if (a <= 0) return;
    const pb = tex.place('B', DX, DY - 250, 42, 'c');
    tex.draw(ctx, pb, { alpha: a * gin(T.matB), skip: ['a', 'b', 'c'] });
    tex.draw(ctx, pb, { alpha: a * gin(T.matB), only: ['a'], force: C.i }); tex.draw(ctx, pb, { alpha: a * gin(T.matB + 0.5), only: ['b'], force: C.j }); tex.draw(ctx, pb, { alpha: a * gin(T.matB + 1.0), only: ['c'], force: C.k });
    K.tag('按列放', DX + 280, DY - 250, { px: 32, a: a * gin(T.matB), align: 'center', color: C.inkMid, w: 700 });
    const pa = tex.place('AB', DX, DY - 30, 40, 'c');
    tex.draw(ctx, pa, { alpha: a * gin(T.matA), reveal: reveal(T.matA, 1.2), skip: ['a', 'b', 'c'] });
    const r = gin(T.sent, 0.6);
    tex.draw(ctx, pa, { alpha: a * r, only: ['a'], force: C.i }); tex.draw(ctx, pa, { alpha: a * r, only: ['b'], force: C.j }); tex.draw(ctx, pa, { alpha: a * r, only: ['c'], force: C.k });
    K.tag('A（整数矩阵）', DX - 300, DY + 70, { px: 28, a: a * gin(T.matA + 0.4), align: 'center', color: C.peri, w: 900 });
    const hE = gin(T.twoE) > 0.5 ? [1, 7] : [];
    row(SENT, DY + 170, 42, { a, t0: T.sent + 0.4, step: 0.22, color: C.ink, hi: hE });
    K.tag('两个 E：80 和 69，不再相同', DX, DY + 260, { px: 34, a: a * gin(T.twoE), align: 'center', color: C.free, w: 900 });
  }

  // ── 解密 ──
  function drawDec() {
    const a = win(t, T.dec, T.hill, 0.5, 0.4); if (a <= 0) return;
    texAt('dec', DX, DY - 310, 50, { alpha: a * gin(T.dec + 0.2), reveal: reveal(T.dec + 0.2, 0.8), color: C.j });
    K.tag('要求：A⁻¹ 也是整数矩阵', DX, DY - 230, { px: 32, a: a * gin(T.decI), align: 'center', color: C.free, w: 900 });
    const fA = a * (1 - gin(T.mk, 0.4));
    texAt('invf', DX - 180, DY - 100, 52, { alpha: fA * gin(T.fm + 0.4), reveal: reveal(T.fm + 0.4, 0.9), color: C.peri });
    K.tag('det A = ±1', DX + 210, DY - 130, { px: 42, a: fA * gin(T.pm1), align: 'center', color: C.i, w: 900, font: F.serif });
    K.tag('⇒ A⁻¹ = ±adj A，全是整数', DX + 210, DY - 60, { px: 30, a: fA * gin(T.pm1 + 0.8), align: 'center', color: C.ink, w: 900 });
    texAt('Ainv', DX - 110, DY + 100, 44, { alpha: a * gin(T.inv), reveal: reveal(T.inv, 1.0) });
    K.tag('det A = 1', DX + 270, DY + 100, { px: 40, a: a * gin(T.inv + 0.2), align: 'center', color: C.i, w: 900, font: F.serif });
    const bA = a * win(t, T.back, T.mk, 0.3, 0.4);
    row(LET, DY + 250, 50, { a: bA, t0: T.back + 0.2, step: 0.12, color: C.j });
    // 造 A：I 连续倍加
    const mA = a * gin(T.mk);
    K.tag('造 A：从 I 出发，连续倍加', DX, DY - 140, { px: 38, a: mA, align: 'center', color: C.peri, w: 900 });
    K.tag('I → r₁+r₃ → r₁+2r₂ → r₂+r₃ → r₃−r₂ → r₃+2r₁ → r₂+2r₁ = A', DX, DY - 60, { px: 28, a: mA * gin(T.mk + 0.8, 0.8), align: 'center', color: C.ink, w: 700, font: F.serif });
    K.tag('倍加不改行列式：det = 1 一路不变', DX, DY + 260, { px: 34, a: a * gin(T.mkD), align: 'center', color: C.j, w: 900 });
  }

  function drawHill() {
    const a = win(t, T.hill, T.cx, 0.5, 0.4); if (a <= 0) return;
    K.tag('希尔密码', DX, DY - 150, { px: 72, a, align: 'center', color: C.gpt, w: 900, font: F.serif });
    K.tag('Hill cipher', DX, DY - 60, { px: 36, a: a * gin(T.hill + 0.6), align: 'center', color: C.inkMid, w: 700, font: F.serif });
    K.tag('真正版本：对 26 取余（mod 26）', DX, DY + 50, { px: 38, a: a * gin(T.mod), align: 'center', color: C.ink, w: 900 });
    K.tag('教学演示 · 别拿它保护真秘密', DX, DY + 150, { px: 36, a: a * gin(T.mod + 1.4), align: 'center', color: C.free, w: 900 });
  }

  // ── 叉积公式 ──
  function drawCx() {
    const a = win(t, T.cx, T.cd2, 0.5, 0.4); if (a <= 0) return;
    K.tag('叉积 x × y：三维里的第三个向量', DX, DY - 300, { px: 36, a, align: 'center', color: C.peri, w: 900 });
    texAt('cxf', DX, DY - 60, 52, { alpha: a * gin(T.hard), reveal: reveal(T.hard, 1.6) });
    K.tag('难记！', DX, DY + 150, { px: 54, a: a * gin(T.hard + 1.8) * outBack(prog(t, T.hard + 1.8, T.hard + 2.2)), align: 'center', color: C.free, w: 900, font: F.serif });
  }

  function drawCdet() {
    const a = win(t, T.cd2, T.g3, 0.5, 0.4); if (a <= 0) return;
    const pc = tex.place('cdet', DX, DY - 250, 44, 'c');
    tex.draw(ctx, pc, { alpha: a * gin(T.cd2 + 0.3), reveal: reveal(T.cd2 + 0.3, 1.0), skip: ['e'] });
    tex.draw(ctx, pc, { alpha: a * gin(T.cdE), only: ['e'], force: C.i });
    K.tag('按第一行展开', DX + 330, DY - 250, { px: 28, a: a * gin(T.cdX), align: 'center', color: C.j, w: 900 });
    // 阶段 A：例
    const eA = a * (1 - gin(T.form, 0.4));
    if (eA > 0) {
      K.tag('三个代数余子式 = 三个分量', DX, DY - 110, { px: 34, a: eA * gin(T.cof), align: 'center', color: C.ink, w: 900 });
      texAt('cex', DX, DY + 40, 40, { alpha: eA * gin(T.ex), reveal: reveal(T.ex, 1.0) });
      const p2 = tex.place('cex2', DX, DY + 210, 34, 'c');
      tex.draw(ctx, p2, { alpha: eA * gin(T.ex + 1.0), reveal: reveal(T.ex + 1.0, 1.4), skip: ['a'] });
      tex.draw(ctx, p2, { alpha: eA * gin(T.ex + 2.0), only: ['a'], force: C.peri });
    }
    // 阶段 B：形式记号的真意
    const fA = a * gin(T.form, 0.4);
    if (fA > 0) {
      K.tag('形式记号：第一行放的是向量', DX, DY - 120, { px: 32, a: fA * (1 - gin(T.perp, 0.3)), align: 'center', color: C.free, w: 900 });
      const pw = tex.place('wdet', DX, DY + 0, 40, 'c');
      tex.draw(ctx, pw, { alpha: fA * gin(T.fw), reveal: reveal(T.fw, 1.0), skip: ['w'] }); tex.draw(ctx, pw, { alpha: fA * gin(T.fw), only: ['w'], force: C.k });
      const px = tex.place('xx0', DX, DY + 160, 38, 'c');
      tex.draw(ctx, px, { alpha: fA * gin(T.same), reveal: reveal(T.same, 1.0), skip: ['r'] }); tex.draw(ctx, px, { alpha: fA * gin(T.same + 0.6), only: ['r'], force: C.peri });
      K.tag('两行相同 → 行列式 0 → 垂直', DX, DY - 120, { px: 34, a: fA * gin(T.perp + 0.3, 0.3), align: 'center', color: C.peri, w: 900 });
      texAt('vchk', DX, DY + 280, 36, { alpha: fA * gin(T.ver), reveal: reveal(T.ver, 1.2), color: C.j });
    }
  }

  // ── 三维 ──
  const O3 = [DX - 290, DY + 45], U3 = 170;
  function pj(v, az, el) {
    const c = Math.cos(az), s = Math.sin(az), xr = v[0] * c - v[1] * s, dp = v[0] * s + v[1] * c;
    return [O3[0] + U3 * xr, O3[1] - U3 * (v[2] * Math.cos(el) + dp * Math.sin(el))];
  }
  function draw3D(D) {
    const a = win(t, T.g3, T.phy, 0.6, 0.5); if (a <= 0) return;
    const az = lerp(-1.0, -0.75, smooth(prog(t, T.g3, T.phy))), el = 0.5, P = v => pj(v, az, el);
    ctx.save(); K.clip(D); ctx.globalAlpha = a;
    // 地面网格
    ctx.strokeStyle = C.gridOld; ctx.lineWidth = 1.2; ctx.globalAlpha = a * 0.35;
    for (let k = -1; k <= 3; k++) { let p = P([k, -1, 0]), q = P([k, 3, 0]); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); p = P([-1, k, 0]); q = P([3, k, 0]); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); }
    ctx.globalAlpha = a; ctx.restore();
    const O = P([0, 0, 0]);
    // 平行四边形
    const pg = gin(T.gPar, 0.6);
    const base = [[0, 0, 0], GX, add3(GX, GY), GY];
    polyFill(ctx, base.map(P), { color: C.i, alpha: 0.32 * a * pg, stroke: C.i, salpha: a * pg });
    // 平行六面体
    const vA = gin(T.gW, 0.8);
    if (vA > 0) {
      const top = base.map(p => add3(p, GW)).map(P), bot = base.map(P);
      polyFill(ctx, top, { color: C.k, alpha: 0.16 * a * vA, stroke: C.k, salpha: a * vA });
      ctx.save(); ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.globalAlpha = a * vA;
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(...bot[k]); ctx.lineTo(...top[k]); ctx.stroke(); }
      // 高
      const hA = a * gin(T.gV, 0.5), f = P([GW[0], GW[1], 0]), w = P(GW);
      ctx.globalAlpha = hA; ctx.strokeStyle = C.free; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(...f); ctx.lineTo(...w); ctx.stroke(); ctx.restore();
      K.tag('高 1.5', w[0] + 70, (f[1] + w[1]) / 2 + 30, { px: 28, a: hA, align: 'center', color: C.free, w: 900 });
      arrow(ctx, O, w, { color: C.k, width: 7, head: 24, alpha: a * vA });
      K.tag('w', w[0] - 30, w[1] - 20, { px: 36, a: a * vA, color: C.k, w: 900, font: F.serif });
    }
    // 右手定则：在地面上从 x 弯向 y
    const sw = smoother(prog(t, T.sw, T.sw + 1.2)), rA = a * win(t, T.rh, T.phy, 0.4, 0.4);
    if (rA > 0) {
      const a0 = 0, a1 = Math.PI / 4, n = 24, pts = [];
      for (let k = 0; k <= n; k++) { const th = lerp(a0, a1, k / n); pts.push(P([0.9 * Math.cos(th), 0.9 * Math.sin(th), 0])); }
      if (sw > 0.5) pts.reverse();
      ctx.save(); ctx.globalAlpha = rA; ctx.strokeStyle = C.free; ctx.lineWidth = 5; ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); ctx.restore();
      arrow(ctx, pts[n - 3], pts[n], { color: C.free, width: 5, head: 20, alpha: rA });
    }
    // 向量
    const xg = gin(T.g3 + 0.4, 0.5), xy = [0, 0, lerp(GXY[2], -GXY[2], sw)];
    arrow(ctx, O, P(GX), { color: C.i, width: 8, head: 26, alpha: a * xg });
    arrow(ctx, O, P(GY), { color: C.j, width: 8, head: 26, alpha: a * xg });
    const px = P(GX), py = P(GY);
    K.tag('x', px[0] + 10, px[1] + 44, { px: 38, a: a * xg, color: C.i, w: 900, font: F.serif });
    K.tag('y', py[0] + 24, py[1] - 18, { px: 38, a: a * xg, color: C.j, w: 900, font: F.serif });
    const ug = smoother(prog(t, T.gUp, T.gUp + 1.0));
    if (ug > 0) {
      const tip = P(xy);
      arrow(ctx, O, tip, { color: C.peri, width: 9, head: 28, alpha: a, grow: ug });
      const lp = sw > 0.5 ? [(O[0] + tip[0]) / 2 - 130, (O[1] + tip[1]) / 2 + 40] : [tip[0] + 24, tip[1] + 10];
      K.tag(sw > 0.5 ? 'y × x' : 'x × y', lp[0], lp[1], { px: 36, a: a * ug, color: C.peri, w: 900, font: F.serif });
    }
    const c = P([1.5, 0.5, 0]);
    K.tag('面积', c[0], c[1] + 12, { px: 28, a: a * pg * (1 - vA), align: 'center', color: C.ink, w: 900 });
    // 读数（右上）
    const rx = DX + 180;
    K.tag('x = (2, 0, 0)   y = (1, 1, 0)', rx - 60, DY - 380, { px: 28, a: a * gin(T.gEx) * (1 - win(t, T.gDet, T.rh, 0.3, 0.3)), align: 'center', color: C.ink, w: 700, font: F.serif });
    K.tag('面积 = 底 2 × 高 1 = 2', rx - 60, DY - 320, { px: 30, a: a * win(t, T.gEx + 0.6, T.gW, 0.3, 0.3), align: 'center', color: C.i, w: 900 });
    K.tag('x × y = (0, 0, 2)，长 2', rx - 60, DY - 260, { px: 30, a: a * win(t, T.gXY, T.gW, 0.3, 0.3), align: 'center', color: C.peri, w: 900 });
    K.tag('w = (0.5, 0.6, 1.5)', rx - 60, DY - 320, { px: 28, a: a * win(t, T.gW, T.gDet, 0.3, 0.3), align: 'center', color: C.k, w: 900, font: F.serif });
    K.tag('体积 = 2 × 1.5 = 3', rx - 60, DY - 260, { px: 32, a: a * win(t, T.gV, T.gDet, 0.3, 0.3), align: 'center', color: C.k, w: 900 });
    texAt('vol', DX + 180, DY - 290, 34, { alpha: a * win(t, T.gDet, T.rh, 0.4, 0.3), halo: C.disc });
    K.tag('行列式 = 体积 ⇄ 叉积 · 对偶', DX + 180, DY - 185, { px: 30, a: a * win(t, T.dualW, T.rh, 0.3, 0.3), align: 'center', color: C.j, w: 900 });
    K.tag(sw > 0.5 ? '四指 y → x，拇指朝下' : '右手：四指 x → y，拇指 = x × y', rx - 60, DY - 320, { px: 30, a: a * win(t, T.rh + 0.3, T.phy, 0.3, 0.3), align: 'center', color: C.free, w: 900 });
    texAt('swap', rx - 60, DY - 268, 38, { alpha: a * gin(T.sw + 0.6), color: C.peri });
    K.tag('= 行列式交换两行', rx - 60, DY - 212, { px: 30, a: a * gin(T.sw + 1.0), align: 'center', color: C.inkMid, w: 900 });
  }

  function drawPhy() {
    const a = win(t, T.phy, T.tj, 0.5, 0.4); if (a <= 0) return;
    K.tag('物理里的叉积', DX, DY - 300, { px: 40, a, align: 'center', color: C.gpt, w: 900 });
    const it = [['力矩', 'τ = r × F', T.phy + 0.6], ['角动量', 'L = r × p', T.ph2], ['洛伦兹力', 'F = q v × B', T.ph3], ['副法向（牛顿）', 'B = T × N', T.ph4]];
    it.forEach(([n, f, t0], k) => {
      const y = DY - 170 + k * 110, g = a * gin(t0);
      K.tag(n, DX - 120, y, { px: 36, a: g, align: 'right', color: C.ink, w: 900 });
      K.tag(f, DX - 80, y, { px: 42, a: g, align: 'left', color: C.peri, w: 900, font: F.serif });
    });
  }

  function drawTj() {
    const a = win(t, T.tj, T.end0, 0.5, 0.5); if (a <= 0) return;
    K.tag('同济线代：不讲叉积', DX, DY - 300, { px: 34, a, align: 'center', color: C.gpt, w: 900 });
    K.tag('高等数学（下）· 第八章 向量代数与空间解析几何', DX, DY - 230, { px: 28, a: a * gin(T.tjB), align: 'center', color: C.ink, w: 700 });
    texAt('tjc', DX, DY - 30, 50, { alpha: a * gin(T.tjD), reveal: reveal(T.tjD, 1.0) });
    K.tag('i, j, k 就是 e₁, e₂, e₃', DX, DY + 150, { px: 32, a: a * gin(T.tjD + 1.0), align: 'center', color: C.inkMid, w: 900, font: F.serif });
  }

  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('行列式的两个应用', DX, DY - 300, { px: 46, a, align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('det = ±1 的整数矩阵 → 逆也是整数', DX, DY - 180, { px: 36, a: a * gin(T.z1), align: 'center', color: C.ink, w: 900 });
    texAt('sumc', DX, DY - 10, 40, { alpha: a * gin(T.z2), color: C.i });
    K.tag('⊥ x, ⊥ y；长度 = 平行四边形面积', DX, DY + 160, { px: 34, a: a * gin(T.z3), align: 'center', color: C.j, w: 900 });
    K.tag('下面：判断题 · 期中真题', DX, DY + 270, { px: 32, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.cd, T.dec);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('应用一：加密', T.cd);
      K.bullet('字母 → 数字：易被频率破解', 290, gin(T.freqE)); K.bullet('数字按列排成 B', 350, gin(T.matB)); K.bullet('发送 AB', 410, gin(T.sent), { color: C.peri }); ctx.restore(); }
    a = sec(T.dec, T.cx);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('解密', T.dec);
      K.bullet('左乘 A⁻¹ 还原', 290, gin(T.dec + 0.3)); K.bullet('A⁻¹ = adj A / det A', 350, gin(T.fm + 0.4)); K.bullet('det A = ±1 ⇒ 整数', 410, gin(T.pm1), { color: C.peri }); K.bullet('造 A：I 连续倍加', 470, gin(T.mk), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.cx, T.g3);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('应用二：叉积', T.cx);
      K.bullet('分量公式难记', 290, gin(T.hard)); K.bullet('第一行 e₁ e₂ e₃，按它展开', 350, gin(T.cdE)); K.bullet('(1,2,3)×(4,5,6) = (−3,6,−3)', 410, gin(T.ex + 1.0), { color: C.peri }); K.bullet('w · (x × y) = det', 470, gin(T.fw)); K.bullet('w = x ⇒ 0 ⇒ 垂直', 530, gin(T.same + 0.6), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.g3, T.phy);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('几何', T.g3);
      K.bullet('|x × y| = 平行四边形面积', 290, gin(T.gLen)); K.bullet('方向垂直于 x、y', 350, gin(T.gUp)); K.bullet('w · (x × y) = 体积', 410, gin(T.gV), { color: C.k, mark: C.k }); K.bullet('右手定则；交换变号', 470, gin(T.rh), { color: C.free, mark: C.free }); ctx.restore(); }
    a = sec(T.phy, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('物理 · 对照', T.phy, C.gpt);
      K.bullet('力矩、角动量、洛伦兹力', 290, gin(T.phy + 0.6)); K.bullet('Leon：牛顿的副法向', 350, gin(T.ph4)); K.bullet('同济：高数下册第八章', 410, gin(T.tjB), { color: C.gpt, mark: C.gpt }); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('det = ±1 → 整数逆 → 加密', 290, gin(T.z1)); K.bullet('叉积 = 行列式记号', 350, gin(T.z2), { color: C.i, mark: C.i }); K.bullet('垂直；长度 = 面积', 410, gin(T.z3), { color: C.j, mark: C.j }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 2.3', prog(t, 0.2, 1.3));
    drawTitle(); drawCode(); drawEnc(); drawDec(); drawHill(); drawCx(); drawCdet(); draw3D(D); drawPhy(); drawTj(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
