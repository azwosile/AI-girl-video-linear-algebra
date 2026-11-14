// 第 1 章 §1.3（下）矩阵乘法（Leon 9th §1.3 Matrix Multiplication、例 8 / 9 / 10、Application 1；同济第六版 第二章 §2 例 4）。
// 3B1B 对应：Essence of Linear Algebra 第 4 集（矩阵乘法 = 复合变换）。
// 分镜：
//   D01–C01   “对应元素相乘？”打叉
//   C02–C03b  按列：AB = (Ab₁, …, Abᵣ)；例 8 第一列
//   D02–C07   按元素：Falk 排法（B 在上、A 在左、AB 在交叉处），第 2 行 × 第 3 列 = 30，九格依次填满
//   D03–G01   尺寸：m×n · n×r = m×r；例 9：AB 不行，BA 可以
//   C11–C19   主画面：旋转 → 剪切，跟踪 î、ĵ，得 Sh·Rot；“从右往左读”
//   C20–C24   反过来：先剪切再旋转，网格不同 → AB ≠ BA；例 10、例 8 尺寸
//   D06–G03   同济例 4：BA = O
//   C25–D07   应用 1：生产成本 MP
//   D08–C29   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow, ring } from '../../engine/la2d/plane.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'ds_shock', 'gpt_cross', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const fmt = v => String(v).replace('-', '−');
const mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const rotM = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
const shM = s => [[1, s], [0, 1]];

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const X = MJ.mats, A8 = X.A8, B8 = X.B8, AB8 = MJ.products[2].Ax;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.4, C03b: 0.3, D02: 0.5, C05: 0.4, C06: 0.3, D03: 0.5, C09: 0.3, C10: 0.4, C11: 0.8, C12: 0.4, C14: 0.5, C15: 0.5, C16: 0.3, C18: 0.4, C19: 0.3, C20: 0.6, C21: 0.3, C22: 0.4, C23: 0.4, C25: 0.8, C27: 0.4, D08: 0.6 },
    post: { C03b: 0.5, C07: 1.4, C10: 0.5, C12: 0.6, C14: 0.6, C15: 0.4, C17: 0.4, C19: 0.4, C21: 0.6, C24: 0.4, C27: 0.5 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 30, oy: DY + 40, u: 120, R: 7 });

  const T = {
    naive: cue('D01', '对应元素'), no: L('C01').s, split: cue('C01', '一列一列'),
    col: cue('C02', '每一列'), aon: cue('C02', 'A乘这一列'), side: cue('C03', '并排'), jth: cue('C03', '第j列'),
    c1: L('C03b').s - 0.3, c1r: cue('C03b', '得到'),
    ent: L('D02').s - 0.3, rule: cue('C04', '第i行'), ex8: cue('C05', '例八'),
    r2: cue('C06', '第二行是'), c3: cue('C06', '第三列是'), e30: cue('C07', '等于三十'), all9: cue('C07', '九个位置'),
    sz: L('D03').s - 0.3, pair: cue('D03', '配对'), rl: cue('C08', '列数'), mn: cue('C09', '中间的n'), res: cue('C09', '结果是'),
    e9: cue('C10', '例九'), no9: cue('C10', '根本乘不了'), ba9: cue('C10', '反过来'), rhy: L('G01').s,
    gt: L('C11').s - 0.6, act: cue('C11', '一个动作'),
    rot: cue('C12', '旋转'), rot90: cue('C12', '九十度'), ri: cue('C12', 'i帽落到'), rj: cue('C12', 'j帽落到'), rm: cue('C13', '旋转矩阵'),
    sh: cue('C14', '剪切'), shj: cue('C14', 'j帽被推到'), paper: cue('C14', '一摞纸'),
    comp: cue('C15', '先旋转'), comp2: cue('C15', '再剪切'), still: cue('C15', '平行'),
    ask: L('D04').s, ti: cue('C16', '跟踪i帽'), ti2: cue('C16', '再剪切'), tj: cue('C17', '跟踪j帽'), tj2: cue('C17', '剪切不动'),
    form: cue('C18', '用公式'), merge: cue('C18', '合成一个'), f01: L('C18b').s, why: L('D05').s, rtl: cue('C19', '右边进来'), fg: cue('C19', '函数'),
    rev: L('C20').s - 0.4, guess: L('D05b').s, rv: L('C21').s, rvj: cue('C21', 'j帽先到'), diff: cue('C21', '完全不一样'),
    neq: cue('C22', '不等于'), law: cue('C22', '交换律'), e10: cue('C23', '例十'), e8s: cue('C24', '例八'),
    sigh: L('D06').s, tj4: L('G02').s - 0.2, tjO: cue('G02', '零矩阵'), canc: L('G03').s,
    app: L('C25').s - 0.6, mm: cue('C26', '矩阵M'), pm: cue('C26', '矩阵P'), mp: cue('C27', '第一列'), m1: cue('C27', '原料'), m2: cue('C27', '人工'), m3: cue('C27', '杂费'),
    rc: cue('C28', '行乘列'), ledger: L('D07').s,
    end0: L('D08').s - 0.6, s1: cue('D08', '每一列'), s2: cue('D08', '每个元素'), s3: L('D09').s, next: cue('C29', '下一节'),
  };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('swell', T.naive, 0.3); TL.sfx('buzz', T.no + 0.2, 0.25); TL.sfx('warp', T.split, 0.3);
  TL.sfx('pluck', T.col, 0.3); TL.sfx('marimba', T.side, 0.3); TL.sfx('marimba_hi', T.side + 0.4, 0.3); TL.sfx('check', T.c1r + 0.6, 0.3);
  TL.sfx('whoosh', T.ent, 0.3); TL.sfx('pluck', T.r2, 0.3); TL.sfx('pluck', T.c3, 0.3); TL.sfx('stamp', T.e30, 0.35);
  for (let k = 0; k < 9; k++) TL.sfx(k % 2 ? 'marimba_hi' : 'marimba', T.all9 + 0.3 + k * 0.22, 0.18);
  TL.sfx('ding_lo', T.pair, 0.3); TL.sfx('pluck', T.mn, 0.3); TL.sfx('check', T.res, 0.3); TL.sfx('buzz', T.no9, 0.25); TL.sfx('check', T.ba9 + 0.5, 0.3); TL.sfx('bell_soft', T.rhy, 0.3);
  TL.sfx('whoosh', T.gt, 0.35); TL.sfx('warp', T.rot, 0.4); TL.sfx('ding', T.ri, 0.3); TL.sfx('ding', T.rj, 0.3); TL.sfx('warp', T.sh, 0.4);
  TL.sfx('warp', T.comp, 0.35); TL.sfx('warp', T.comp2, 0.35); TL.sfx('ding', T.ti2, 0.3); TL.sfx('ding', T.tj2, 0.3); TL.sfx('stamp', T.merge, 0.35);
  TL.sfx('sting', T.why + 0.2, 0.3); TL.sfx('pluck', T.rtl, 0.3);
  TL.sfx('whoosh', T.rev, 0.3); TL.sfx('warp', T.rv, 0.35); TL.sfx('warp', T.rvj, 0.35); TL.sfx('thud', T.diff, 0.3); TL.sfx('stamp', T.neq, 0.35);
  TL.sfx('pop', T.e10, 0.3); TL.sfx('pop', T.e8s, 0.3); TL.sfx('bell_soft', T.tj4, 0.3); TL.sfx('buzz', T.tjO + 0.3, 0.25);
  TL.sfx('whoosh', T.app, 0.3); TL.sfx('pluck', T.mm, 0.3); TL.sfx('pluck', T.pm, 0.3); [T.m1, T.m2, T.m3].forEach(t => TL.sfx('tick2', t, 0.3)); TL.sfx('sparkle', T.ledger + 0.2, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); TL.sfx('check', T.s1, 0.3); TL.sfx('check', T.s2, 0.3); TL.sfx('check', T.s3, 0.3); TL.sfx('shimmer', L('C29').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.2, L('C01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.3 矩阵乘法'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'MATRIX × MATRIX', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
  }

  // ── 开场：对应元素相乘？ ──
  function drawNaive() {
    const a = win(t, T.naive - 0.3, T.col - 0.1, 0.4, 0.4); if (a <= 0) return;
    texAt('naive', DX, DY - 40, 56, { alpha: a, reveal: prog(t, T.naive - 0.3, T.naive + 1.0) });
    const x = outBack(prog(t, T.no + 0.1, T.no + 0.5));
    if (x > 0) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.free; ctx.lineWidth = 12; ctx.lineCap = 'round'; const r = 150 * x; ctx.beginPath(); ctx.moveTo(DX + 270 - r, DY - 40 - r); ctx.lineTo(DX + 270 + r, DY - 40 + r); ctx.moveTo(DX + 270 + r, DY - 40 - r); ctx.lineTo(DX + 270 - r, DY - 40 + r); ctx.stroke(); ctx.restore(); }
    K.tag('不是这样乘！', DX, DY + 170, { px: 46, a: a * gin(T.no + 0.3), align: 'center', color: C.free, font: F.serif, w: 900 });
    K.tag('→ 把 B 拆成一列一列', DX, DY + 250, { px: 36, a: a * gin(T.split), align: 'center', color: C.peri });
  }

  // ── 按列 ──
  function drawCols() {
    const a = win(t, T.col - 0.2, T.ent, 0.4, 0.4); if (a <= 0) return;
    const pl = tex.place('cols', DX, DY - 170, 46, 'c');
    const ph = k => win(t, T.side + k * 0.45, T.c1, 0.2, 0.3);
    tex.draw(ctx, pl, { alpha: a, reveal: prog(t, T.col - 0.2, T.side + 1.6) });
    for (const [k, c] of [[0, 'b1'], [1, 'b2'], [2, 'b3']]) { const h = ph(k); if (h > 0) tex.draw(ctx, pl, { alpha: a * h, only: [c], force: [C.i, C.j, C.k][k] }); }
    K.tag('第 j 列 = A × (B 的第 j 列)', DX, DY - 30, { px: 36, a: a * gin(T.jth), align: 'center', color: C.peri, font: F.serif, w: 900 });
    if (t > T.c1 - 0.1) { texAt('ex8c1', DX, DY + 170, 50, { alpha: a, reveal: prog(t, T.c1, T.c1r + 1.0) }); K.tag('例 8 · 第一列', DX, DY + 330, { px: 30, a: a * gin(T.c1), align: 'center', color: C.inkMid }); }
  }

  // ── Falk 排法：B 在上，A 在左，AB 在交叉处 ──
  const cs = 88, gap = 34;
  const FX = DX - (2 * cs + gap + 3 * cs) / 2 + 2 * cs + gap, FY = DY - 250 + 2 * cs + gap; // AB 左上角
  const cellA = (i, j) => [FX - gap - (2 - j) * cs + cs / 2, FY + i * cs + cs / 2];
  const cellB = (i, j) => [FX + j * cs + cs / 2, FY - gap - (2 - i) * cs + cs / 2];
  const cellC = (i, j) => [FX + j * cs + cs / 2, FY + i * cs + cs / 2];
  function bracket(x0, y0, w, h, a, col = C.ink) {
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3.5; const e = 12;
    ctx.beginPath(); ctx.moveTo(x0 + e, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + h); ctx.lineTo(x0 + e, y0 + h); ctx.moveTo(x0 + w - e, y0); ctx.lineTo(x0 + w, y0); ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0 + w - e, y0 + h); ctx.stroke(); ctx.restore();
  }
  function num(v, [x, y], a, col = C.ink, px = 44) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = F.sans(px, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(fmt(v), x, y); ctx.restore(); }
  function drawFalk() {
    const a = win(t, T.ent, T.sz, 0.4, 0.4); if (a <= 0) return;
    const g = gin(T.ex8 - 0.2, 0.6);
    bracket(FX - gap - 2 * cs, FY, 2 * cs, 3 * cs, a * g); bracket(FX, FY - gap - 2 * cs, 3 * cs, 2 * cs, a * g);
    K.tag('A', FX - gap - cs, FY + 3 * cs + 40, { px: 40, a: a * g, align: 'center', color: C.peri, w: 900, font: F.serif });
    K.tag('B', FX + 3 * cs + 40, FY - gap - cs, { px: 40, a: a * g, align: 'center', color: C.peri, w: 900, font: F.serif });
    K.tag('AB', FX + 3 * cs + 52, FY + 1.5 * cs, { px: 40, a: a * gin(T.all9), align: 'center', color: C.peri, w: 900, font: F.serif });
    // 行 / 列高亮带：先 (2,3)，再九格逐个
    let hi = null;
    if (t > T.r2 - 0.2 && t < T.all9 + 0.3) hi = [1, 2];
    const fillT = k => T.all9 + 0.3 + k * 0.22;
    for (let k = 0; k < 9; k++) if (t > fillT(k) - 0.05 && t < fillT(k) + 0.22) hi = [Math.floor(k / 3), k % 3];
    if (hi) {
      const [i, j] = hi, ra = gin(T.r2, 0.3), ca = t > T.all9 ? 1 : gin(T.c3, 0.3);
      ctx.save(); ctx.globalAlpha = a * 0.22 * ra; ctx.fillStyle = C.i; ctx.fillRect(FX - gap - 2 * cs, FY + i * cs + 6, 2 * cs, cs - 12);
      ctx.globalAlpha = a * 0.22 * ca; ctx.fillStyle = C.j; ctx.fillRect(FX + j * cs + 6, FY - gap - 2 * cs, cs - 12, 2 * cs);
      ctx.globalAlpha = a * 0.9 * ca; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.strokeRect(FX + j * cs + 4, FY + i * cs + 4, cs - 8, cs - 8);
      // 引导虚线：行向右、列向下汇到格子
      ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.globalAlpha = a * 0.6 * ca; ctx.strokeStyle = C.i; ctx.beginPath(); ctx.moveTo(FX - gap, FY + i * cs + cs / 2); ctx.lineTo(FX + j * cs + 6, FY + i * cs + cs / 2); ctx.stroke();
      ctx.strokeStyle = C.j; ctx.beginPath(); ctx.moveTo(FX + j * cs + cs / 2, FY - gap); ctx.lineTo(FX + j * cs + cs / 2, FY + i * cs + 6); ctx.stroke(); ctx.restore();
    }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) num(A8[i][j], cellA(i, j), a * g, hi && hi[0] === i ? C.i : C.ink);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) num(B8[i][j], cellB(i, j), a * g, hi && hi[1] === j ? C.j : C.ink);
    // 结果格
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const k = i * 3 + j, is23 = i === 1 && j === 2, s = is23 ? gin(T.e30, 0.3) : gin(fillT(k), 0.2);
      num(AB8[i][j], cellC(i, j), a * s, is23 ? C.peri : C.ink, 44 * (1 + 0.3 * pulse(t, is23 ? T.e30 : fillT(k), 0.4)));
    }
    if (t > T.r2) texAt('e23', DX, DY + 330, 46, { alpha: a * win(t, T.r2, T.all9 + 0.2, 0.3, 0.3), reveal: prog(t, T.r2, T.e30 + 0.6), color: C.ink, halo: C.disc });
    K.tag('3 行 2 列 × 2 行 3 列', DX, DY - 350, { px: 32, a: a * gin(T.ex8), align: 'center', color: C.inkMid });
  }

  // ── 尺寸规则 ──
  function drawSize() {
    const a = win(t, T.sz, T.gt, 0.4, 0.4); if (a <= 0) return;
    const pl = tex.place('size', DX, DY - 220, 70, 'c');
    tex.draw(ctx, pl, { alpha: a, reveal: prog(t, T.rl - 0.2, T.res + 0.6) });
    const nh = gin(T.mn, 0.3); if (nh > 0) tex.draw(ctx, pl, { alpha: a * nh, only: ['n'], force: C.free });
    K.tag('A 的列数 = B 的行数', DX, DY - 80, { px: 36, a: a * gin(T.rl), align: 'center', color: C.peri, font: F.serif, w: 900 });
    const e9 = win(t, T.e9, T.gt, 0.3, 0.3);
    if (e9 > 0) {
      K.tag('2×2 · 3×2', DX - 200, DY + 40, { px: 40, a: a * e9, align: 'center', color: C.ink, w: 900 });
      K.tag('✗ 2 ≠ 3', DX - 200, DY + 100, { px: 34, a: a * e9 * gin(T.no9), align: 'center', color: C.free, w: 900 });
      K.tag('3×2 · 2×2', DX + 200, DY + 40, { px: 40, a: a * e9 * gin(T.ba9), align: 'center', color: C.ink, w: 900 });
      K.tag('✓ → 3×2', DX + 200, DY + 100, { px: 34, a: a * e9 * gin(T.ba9 + 0.4), align: 'center', color: C.j, w: 900 });
      if (t > T.ba9 + 0.5) texAt('ex9', DX, DY + 260, 40, { alpha: a * e9, reveal: prog(t, T.ba9 + 0.5, T.ba9 + 1.8) });
    }
  }

  // ── 主画面：复合变换 ──
  // 返回 t 时刻的变换矩阵与阶段说明
  const S1 = () => {
    // 段 1：只演示旋转（C12–C13），段 2：只演示剪切（C14），段 3：先转后剪（C15–C19），段 4：先剪后转（C20–C24）
    if (t < T.sh - 0.4) return { M: rotM(Math.PI / 2 * smoother(prog(t, T.rot90 - 0.3, T.rot90 + 1.4))), ph: 1 };
    if (t < T.comp - 0.4) {
      const back = smoother(prog(t, T.sh - 0.4, T.sh + 0.2));
      const r = rotM(Math.PI / 2 * (1 - back)), s = smoother(prog(t, T.shj - 0.2, T.shj + 1.2));
      return { M: back < 1 ? r : shM(s), ph: 2 };
    }
    if (t < T.rev + 0.2) {
      const back = smoother(prog(t, T.comp - 0.4, T.comp + 0.1));
      if (back < 1) return { M: shM(1 - back), ph: 3 };
      const r = smoother(prog(t, T.comp + 0.1, T.comp + 1.3)), s = smoother(prog(t, T.comp2, T.comp2 + 1.2));
      return { M: mul(shM(s), rotM(Math.PI / 2 * r)), ph: 3 };
    }
    const back = smoother(prog(t, T.rev + 0.2, T.rev + 0.9));
    if (back < 1) return { M: mul(shM(1 - back), rotM(Math.PI / 2 * (1 - back))), ph: 4 };
    const s = smoother(prog(t, T.rv - 0.1, T.rv + 1.0)), r = smoother(prog(t, T.rv + 1.1, T.rv + 2.3));
    return { M: mul(rotM(Math.PI / 2 * r), shM(s)), ph: 4 };
  };
  function drawGT(D) {
    const a = win(t, T.gt, T.e10 - 0.1, 0.6, 0.5); if (a <= 0) return;
    const { M, ph } = S1();
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * a, grow: smooth(prog(t, T.gt, T.gt + 1.2)) });
    // 段 4：上一个结果留个虚影对照
    if (ph === 4) P.grid(ctx, { M: MJ.products[10].Ax, color: C.j, width: 1.6, alpha: 0.35 * a * gin(T.diff, 0.5), dash: [6, 8], stagger: false });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.6 * a, grow: smooth(prog(t, T.gt + 0.3, T.gt + 1.5)) });
    P.axes(ctx, { M, color: C.ink, width: 3, alpha: 0.8 * a, grow: smooth(prog(t, T.gt + 0.3, T.gt + 1.5)) });
    ctx.restore();
    const O = P.S([0, 0], M), pi = P.S([1, 0], M), pj = P.S([0, 1], M), ga = a * gin(T.gt + 1.0, 0.6);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: ga }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: ga });
    K.tag('î', pi[0] + 16, pi[1] - 24, { px: 40, a: ga, color: C.i, w: 900, font: F.serif }); K.tag('ĵ', pj[0] - 40, pj[1] - 14, { px: 40, a: ga, color: C.j, w: 900, font: F.serif });
    // 坐标读数
    const rd = (p, c, opt) => K.tag(`(${fmt(Math.round(p[0] * 10) / 10)}, ${fmt(Math.round(p[1] * 10) / 10)})`, ...opt, { px: 28, a: a * 0.9, color: c, w: 900 });
    const showRd = (ph === 1 && t > T.ri) || (ph === 3 && t > T.ti) || (ph === 4 && t > T.rv);
    if (showRd) { const mi = [M[0][0], M[1][0]], mj = [M[0][1], M[1][1]]; rd(mi, C.i, [pi[0] + 20, pi[1] + 24]); if (ph !== 1 || t > T.rj) rd(mj, C.j, [pj[0] + 20, pj[1] + 26]); }
    // 右上角：当前在做什么
    const lab = ph === 1 ? '旋转 90°' : ph === 2 ? '剪切' : ph === 3 ? '先旋转，再剪切' : '先剪切，再旋转';
    K.tag(lab, DX, DY - 400, { px: 40, a: a * gin(ph === 1 ? T.rot : ph === 2 ? T.sh : ph === 3 ? T.comp : T.rv), align: 'center', color: ph >= 3 ? C.peri : C.ink, font: F.serif, w: 900 });
    // 矩阵卡片
    if (ph === 1) texAt('Rot', DX + 330, DY - 260, 50, { alpha: a * gin(T.rm, 0.4), color: C.ink, halo: C.disc });
    if (ph === 2) texAt('Sh', DX + 330, DY - 260, 50, { alpha: a * gin(T.paper, 0.4), color: C.ink, halo: C.disc });
    if (ph === 3) {
      if (t > T.form - 0.2) texAt('ShRot', DX, DY + 260, 40, { alpha: a * win(t, T.form - 0.2, T.f01, 0.3, 0.3), reveal: prog(t, T.form - 0.2, T.form + 1.4), halo: C.disc });
      if (t > T.f01 - 0.2) texAt('Sh01', DX, DY + 260, 38, { alpha: a * win(t, T.f01 - 0.2, T.why, 0.3, 0.3), reveal: prog(t, T.f01 - 0.2, T.f01 + 1.6), halo: C.disc });
      const rr = win(t, T.rtl - 0.2, T.rev, 0.3, 0.3);
      if (rr > 0) {
        texAt('ABx', DX, DY + 220, 64, { alpha: a * rr, halo: C.disc });
        const s = smoother(prog(t, T.rtl, T.rtl + 1.4)); ctx.save(); ctx.globalAlpha = a * rr; arrow(ctx, [DX + 160, DY + 290], [DX + 160 - 320 * s, DY + 290], { color: C.peri, width: 5, head: 18 }); ctx.restore();
        K.tag('先 B 后 A：从右往左读', DX, DY + 335, { px: 30, a: a * rr * gin(T.rtl + 0.4), align: 'center', color: C.peri, w: 900 });
        if (t > T.fg - 0.1) texAt('fgx', DX + 330, DY + 200, 44, { alpha: a * rr * gin(T.fg), halo: C.disc });
      }
    }
    if (ph === 4) {
      K.tag('猜猜看：一样吗？', DX, DY + 300, { px: 40, a: a * win(t, T.guess, T.rv + 0.4, 0.3, 0.3), align: 'center', color: C.free, font: F.serif, w: 900 });
      if (t > T.diff - 0.2) texAt('RotSh', DX, DY + 250, 40, { alpha: a * gin(T.diff - 0.2), reveal: prog(t, T.diff - 0.2, T.diff + 1.2), halo: C.disc });
      if (t > T.neq - 0.1) { const s = outBack(prog(t, T.neq, T.neq + 0.5)); texAt('neq', DX + 280, DY - 280, 70 * Math.max(0.5, s), { alpha: a * gin(T.neq), color: C.free, halo: C.disc }); }
      K.tag('（青色虚线 = 先转后剪的结果）', DX, DY + 325, { px: 26, a: a * gin(T.diff + 0.6), align: 'center', color: C.j });
    }
  }

  // ── 例 10、例 8 尺寸、同济例 4 ──
  function drawNeq() {
    const a = win(t, T.e10 - 0.1, T.app, 0.4, 0.4); if (a <= 0) return;
    const e = win(t, T.e10 - 0.1, T.tj4, 0.3, 0.3);
    if (e > 0) {
      texAt('neq', DX, DY - 330, 64, { alpha: a * e, color: C.free });
      texAt('ex10', DX, DY - 170, 48, { alpha: a * e, reveal: prog(t, T.e10, T.e10 + 1.0) });
      texAt('ex10b', DX, DY - 10, 48, { alpha: a * e, reveal: prog(t, T.e10 + 1.0, T.e10 + 2.0) });
      if (t > T.e8s - 0.1) texAt('sz8', DX, DY + 170, 44, { alpha: a * e, reveal: prog(t, T.e8s, T.e8s + 1.2), color: C.peri });
    }
    const g = win(t, T.tj4 + 0.35, T.app, 0.3, 0.3);
    if (g > 0) {
      K.tag('同济第二章 · 例 4', DX, DY - 320, { px: 34, a: a * g, align: 'center', color: C.gpt, w: 900 });
      texAt('tjAB', DX, DY - 180, 44, { alpha: a * g, reveal: prog(t, T.tj4, T.tj4 + 1.2) });
      texAt('tjBA', DX, DY - 10, 44, { alpha: a * g, reveal: prog(t, T.tjO - 0.6, T.tjO + 0.6) });
      const z = gin(T.tjO + 0.3, 0.4); if (z > 0) K.tag('BA = O ！', DX + 300, DY + 80, { px: 40, a: a * g * z, align: 'center', color: C.free, font: F.serif, w: 900 });
      if (t > T.canc - 0.1) texAt('cancel', DX, DY + 190, 46, { alpha: a * g, reveal: prog(t, T.canc, T.canc + 1.0), color: C.peri });
      K.tag('AB = AC 也不能约掉 A', DX, DY + 280, { px: 34, a: a * g * gin(T.canc + 2.0), align: 'center', color: C.inkMid });
    }
  }

  // ── 应用 1：生产成本 ──
  function drawApp() {
    const a = win(t, T.app, T.end0, 0.5, 0.5); if (a <= 0) return;
    K.tag('教材 · 应用 1  生产成本', DX, DY - 380, { px: 32, a: a, align: 'center', color: C.inkMid });
    const mA = a * gin(T.mm, 0.4), pA = a * gin(T.pm, 0.4);
    const plM = tex.place('Mm', DX - 40, DY - 240, 40, 'c');
    if (mA > 0) { tex.draw(ctx, plM, { alpha: mA, reveal: prog(t, T.mm, T.mm + 1.0) });
      ['原料', '人工', '杂费'].forEach((s, i) => K.tag(s, plM.ox - 30, DY - 240 + (i - 1) * 50, { px: 26, a: mA, align: 'right', color: C.i }));
      ['产品A', 'B', 'C'].forEach((s, i) => K.tag(s, plM.ox + plM.w * (0.4 + i * 0.2), DY - 240 - 100, { px: 24, a: mA, align: 'center', color: C.j })); }
    const plP = tex.place('Pm', DX, DY - 30, 36, 'c');
    if (pA > 0) { tex.draw(ctx, plP, { alpha: pA, reveal: prog(t, T.pm, T.pm + 1.0) });
      ['夏', '秋', '冬', '春'].forEach((s, i) => K.tag(s, plP.ox + plP.w * (0.3 + i * 0.165), DY - 30 - 90, { px: 24, a: pA, align: 'center', color: C.k }));
      const c1 = win(t, T.mp, T.rc + 2.5, 0.3, 0.3); if (c1 > 0) { ctx.save(); ctx.globalAlpha = a * c1 * 0.2; ctx.fillStyle = C.k; ctx.fillRect(plP.ox + plP.w * 0.23, DY - 30 - 70, plP.w * 0.15, 140); ctx.restore(); } }
    if (t > T.mp - 0.2) { const pl = tex.place('MP1', DX, DY + 190, 40, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.mp - 0.2), reveal: prog(t, T.mp - 0.2, T.m3 + 0.8) });
      const hc = gin(T.m1, 0.3); if (hc > 0) tex.draw(ctx, pl, { alpha: a * hc, only: ['c'], force: C.peri }); }
    if (t > T.rc - 0.2) texAt('mp1', DX, DY + 340, 30, { alpha: a * gin(T.rc - 0.2), reveal: prog(t, T.rc - 0.2, T.rc + 1.4), halo: C.disc });
  }

  // ── 总结 ──
  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    texAt('cols', DX, DY - 220, 40, { alpha: a, reveal: prog(t, T.s1 - 0.2, T.s1 + 1.0) });
    if (t > T.s2 - 0.2) texAt('cij', DX, DY - 60, 44, { alpha: a, reveal: prog(t, T.s2 - 0.2, T.s2 + 1.0) });
    if (t > T.s3 - 0.2) { texAt('ABx', DX - 160, DY + 110, 64, { alpha: a * gin(T.s3 - 0.2), color: C.peri }); K.tag('先 B 后 A', DX + 160, DY + 110, { px: 40, a: a * gin(T.s3), align: 'center', color: C.peri, font: F.serif, w: 900 }); }
    if (t > T.s3 + 0.8) texAt('neq', DX, DY + 230, 56, { alpha: a * gin(T.s3 + 0.8), color: C.free });
    K.tag('下一节：运算律与逆矩阵', DX, DY + 330, { px: 34, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  // ── 左栏 ──
  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.col - 0.2, T.ent);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('看法一：按列', T.col - 0.2);
      K.bullet('B 拆成一列一列', 290, gin(T.col)); K.bullet('每列都乘 A', 350, gin(T.aon)); K.bullet('新列并排 = AB', 410, gin(T.side), { color: C.peri }); ctx.restore(); }
    a = sec(T.ent + 0.2, T.sz);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('看法二：按元素', T.ent + 0.3);
      K.bullet('第 i 行 × 第 j 列', 290, gin(T.rule)); K.bullet('对应相乘，再相加', 350, gin(T.rule + 0.8));
      if (t > T.rule) texAt('cij', LX, 440, 30, { alpha: a * gin(T.rule + 1.2), reveal: prog(t, T.rule + 1.2, T.rule + 2.4) }, 'l');
      K.bullet('例 8：c₂₃ = 30', 520, gin(T.e30), { color: C.peri }); ctx.restore(); }
    a = sec(T.sz + 0.2, T.gt);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('尺寸规则', T.sz + 0.3);
      K.bullet('A 的列数 = B 的行数', 290, gin(T.rl)); K.bullet('结果：m 行 r 列', 350, gin(T.res));
      K.bullet('AB 能乘 ≠ BA 能乘', 410, gin(T.ba9), { color: C.free, mark: C.free });
      K.note('GPT · 口诀', ['内标相同才能乘', '外标决定结果多大'], 450, gin(T.rhy, 0.5)); ctx.restore(); }
    a = sec(T.gt + 0.2, T.rev);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('乘法 = 动作接连做', T.gt + 0.3);
      K.bullet('旋转：î→(0,1)，ĵ→(−1,0)', 290, gin(T.ri), { px: 32 }); K.bullet('剪切：ĵ→(1,1)', 350, gin(T.shj), { px: 32 });
      K.bullet('跟踪 î、ĵ → 新矩阵的列', 410, gin(T.ti), { px: 32, color: C.peri }); K.bullet('先做的写右边', 470, gin(T.rtl), { color: C.free, mark: C.free }); ctx.restore(); }
    a = sec(T.rev + 0.2, T.app);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('顺序很重要', T.rev + 0.3);
      K.bullet('先剪后转 ≠ 先转后剪', 290, gin(T.diff)); K.bullet('一般 AB ≠ BA', 350, gin(T.neq), { color: C.free, mark: C.free }); K.bullet('有时连大小都不同', 410, gin(T.e8s));
      K.note('同济第六版 · 例 4', ['BA = O，但 A、B 都不是 O', 'AB = AC 不能约掉 A'], 450, gin(T.tj4, 0.5)); ctx.restore(); }
    a = sec(T.app + 0.2, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('真实用途：记账', T.app + 0.3);
      K.bullet('M：单件成本', 290, gin(T.mm), { mark: C.i }); K.bullet('P：每季产量', 350, gin(T.pm), { mark: C.k }); K.bullet('MP：每季各项总成本', 410, gin(T.mp), { color: C.peri }); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('AB 的列 = A × B 的列', 290, gin(T.s1)); K.bullet('元素 = 行 × 列', 350, gin(T.s2)); K.bullet('AB = 先 B 后 A', 410, gin(T.s3), { color: C.peri }); K.bullet('顺序不能换', 470, gin(T.s3 + 0.8), { color: C.free, mark: C.free }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.3', prog(t, 0.2, 1.3));
    drawTitle(); drawNaive(); drawCols(); drawFalk(); drawSize(); drawGT(D); drawNeq(); drawApp(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
