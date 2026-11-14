// 第 1 章 §1.4 矩阵代数（Leon 9th §1.4：Thm 1.4.1、例 2、单位矩阵、逆矩阵、例 3 / 5、Thm 1.4.2、转置运算律（§1.3 例 11）、对称矩阵、图；
// 同济第六版 第二章 §2–§3）。3B1B 对应：EoLA 第 4 集（结合律）、第 7 集（逆 = 撤销，压扁就撤不回）。
// 分镜：
//   D01–C01   开场
//   C02–G01   运算律清单（✓）与 AB ≠ BA（✗）；结合律 = 动作流水线，括号只是“先合并哪两步”
//   C06–C07   例 2：幂
//   C08–C09   单位矩阵：网格一动不动
//   D03–C12   逆：剪切 → 推回去；例 3 乘出 I
//   C13–G02   例 5：平面压扁到 x 轴，一条竖线落成一个点 → 奇异
//   C16–C19   (AB)⁻¹ = B⁻¹A⁻¹：袜子与鞋；验证
//   C20–C25   转置：例 11 元素飞行、方阵沿对角线翻面、(AB)ᵀ = BᵀAᵀ、对称
//   C26–D07   航线图：邻接矩阵、A² 数两步路线
//   G03–G04   同济：伴随矩阵、二阶求逆公式
//   D08–C30   总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mlerp2 } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow, ring, target } from '../../engine/la2d/plane.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'ds_shock', 'gpt_cross', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const fmt = v => String(v).replace('-', '−');

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const TR = MJ.transposes, GR = MJ.graph;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.4, C03: 0.3, C04: 0.3, C06: 0.6, C08: 0.7, C09: 0.3, C10: 0.5, C11: 0.3, C12: 0.4, C13: 0.6, C14: 0.3, C16: 0.7, C17: 0.3, C18: 0.3, C20: 0.8, C21: 0.3, C22: 0.4, C23: 0.5, C25: 0.4, C26: 0.7, C28: 0.4, C29: 0.3, G03: 0.5, D08: 0.6 },
    post: { C05: 0.5, C07: 0.4, C09: 0.5, C11: 0.6, C14: 0.6, C18: 0.4, C21: 0.6, C22: 0.6, C29: 0.6, G04: 0.5 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 30, oy: DY + 40, u: 110, R: 8 });

  const T = {
    rules: L('C02').s - 0.4, add: cue('C02', '加法'), dist: cue('C02', '分配'),
    asc: cue('C03', '结合律'), why: L('D02').s, act: cue('C04', '动作'), cba: cue('C04', '先做C'), par: cue('C05', '括号'), same: cue('C05', '结果当然'),
    warn: L('G01').s, warn2: cue('G01', '括号可以挪'),
    pw: L('C06').s - 0.4, ex2: cue('C06', '例二'), sq: cue('C06', '平方后'), cube: cue('C07', '立方'), pn: cue('C07', 'n次方'),
    id: L('C08').s - 0.5, one: cue('C08', '特殊的一'), I: cue('C08', '单位矩阵'), diag: cue('C08', '对角线'),
    geo: cue('C09', '几何上'), stay: cue('C09', 'i帽还在'), ia: cue('C09', '所以'),
    div: L('D03').s, undo: cue('C10', '撤销'), def: cue('C10', 'A B等于'), inv: cue('C10', '逆矩阵'),
    sh: cue('C11', '剪切'), back: cue('C11', '往回推'), its: cue('C11', '它的逆'),
    e3: L('C12').s - 0.2, e3I: cue('C12', '正好是I'),
    sg: L('C13').s - 0.1, flat: cue('C13', '压扁'), vline: cue('C14', '一整条竖线'), lost: cue('C14', '根本不知道'),
    noinv: cue('C15', '没有逆'), sing: cue('C15', '奇异矩阵'), nons: cue('C15', '非奇异'), oops: L('D04').s, sq2: L('G02').s,
    abi: L('C16').s - 0.5, guess: L('D05').s, sock: cue('C17', '先穿袜子'), shoe: cue('C17', '再穿鞋'), off: cue('C17', '先脱鞋'), off2: cue('C17', '再脱袜子'),
    rev: cue('C18', '撤销时'), rule: cue('C18', '所以'), chk: cue('C19', '验证'), mid: cue('C19', '中间的'), rest: cue('C19', '剩下'),
    tr: L('C20').s - 0.6, trn: cue('C20', '转置'), row: cue('C20', '每一行'),
    e11: cue('C21', '例十一'), ij: cue('C21', '第i行'), flip: cue('C22', '主对角线'), still: cue('C22', '对角线上的元素'),
    abt: cue('C23', '最要紧'), again: L('D06').s, szT: cue('C24', '看尺寸'), only: cue('C24', '只有'),
    sym: cue('C25', '对称矩阵'), sym2: cue('C25', '关于对角线'),
    gr: L('C26').s - 0.6, city: cue('C26', '四个城市'), r1: cue('C26', '有航线'), two: cue('C27', '双向'), adj: cue('C27', '邻接矩阵'),
    a2: cue('C28', 'A的平方'), steps: cue('C28', '走两步'), w1: cue('C29', '一到二'), w2: cue('C29', '一到三'), tot: cue('C29', '左上角'), wow: L('D07').s,
    tj: L('G03').s - 0.3, form: cue('G04', '主对角线'), sign: cue('G04', '变号'), dv: cue('G04', '再除以'),
    end0: L('D08').s - 0.6, s1: cue('D08', '结合律'), s2: cue('D08', 'I是'), s3: cue('D08', '逆矩阵是'), s4: L('D09').s, s5: cue('D09', '顺序'), next: cue('C30', '下一节'),
  };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45);
  TL.sfx('whoosh', T.rules, 0.3); [T.add, T.add + 0.8, T.dist].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('stamp', T.asc, 0.35);
  TL.sfx('swell', T.act, 0.3); TL.sfx('marimba', T.cba, 0.3); TL.sfx('warp', T.par, 0.3); TL.sfx('check', T.same, 0.3); TL.sfx('buzz', T.warn + 0.3, 0.25);
  TL.sfx('whoosh', T.pw, 0.3); TL.sfx('pop', T.sq, 0.3); TL.sfx('pop', T.cube, 0.3); TL.sfx('pluck', T.pn, 0.3);
  TL.sfx('whoosh', T.id, 0.3); TL.sfx('stamp', T.I, 0.35); TL.sfx('shimmer', T.stay, 0.3);
  TL.sfx('ding_lo', T.div + 0.2, 0.25); TL.sfx('swell', T.undo, 0.3); TL.sfx('stamp', T.inv, 0.35); TL.sfx('warp', T.sh, 0.35); TL.sfx('warp', T.back, 0.35); TL.sfx('check', T.e3I, 0.3);
  TL.sfx('whoosh', T.sg, 0.3); TL.sfx('thud', T.flat + 0.6, 0.35); TL.sfx('ding_lo', T.vline + 0.8, 0.3); TL.sfx('buzz', T.lost, 0.25); TL.sfx('stamp', T.sing, 0.35);
  TL.sfx('whoosh', T.abi, 0.3); TL.sfx('pop', T.sock, 0.3); TL.sfx('pop', T.shoe, 0.3); TL.sfx('pop', T.off, 0.3); TL.sfx('pop', T.off2, 0.3); TL.sfx('stamp', T.rule + 0.4, 0.35); TL.sfx('check', T.rest + 0.6, 0.3);
  TL.sfx('whoosh', T.tr, 0.3); TL.sfx('warp', T.row + 0.3, 0.35); TL.sfx('shimmer', T.flip, 0.3); TL.sfx('stamp', T.abt + 0.3, 0.35); TL.sfx('check', T.only, 0.3); TL.sfx('bell_soft', T.sym, 0.3);
  TL.sfx('whoosh', T.gr, 0.3); TL.sfx('marimba', T.city, 0.3); TL.sfx('pluck', T.adj, 0.3); TL.sfx('swell', T.a2, 0.3); TL.sfx('marimba', T.w1, 0.3); TL.sfx('marimba_hi', T.w2, 0.3); TL.sfx('ding', T.tot, 0.3); TL.sfx('sparkle', T.wow + 0.2, 0.3);
  TL.sfx('bell_soft', T.tj + 0.2, 0.3); TL.sfx('pluck', T.form, 0.3); TL.sfx('pluck', T.sign, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); [T.s1, T.s2, T.s3, T.s4, T.s5].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C30').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);
  const tick = (x, y, a, ok = true) => K.tag(ok ? '✓' : '✗', x, y, { px: 44, a, align: 'center', color: ok ? C.j : C.free, w: 900 });

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.6, L('C01').e + 0.05)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.4 矩阵代数'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'MATRIX ALGEBRA', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
  }

  // ── 运算律 + 结合律流水线 ──
  function drawRules() {
    const a = win(t, T.rules, T.pw, 0.4, 0.4); if (a <= 0) return;
    const lst = win(t, T.rules, T.act - 0.2, 0.3, 0.4);
    if (lst > 0) {
      [['r1', T.add], ['r2', T.add + 0.8], ['r3', T.dist]].forEach(([k, tt], i) => {
        if (t > tt - 0.2) { texAt(k, DX - 40, DY - 260 + i * 100, 46, { alpha: a * lst * gin(tt - 0.2), reveal: prog(t, tt - 0.2, tt + 0.7) }); tick(DX + 330, DY - 260 + i * 100, a * lst * gin(tt + 0.4)); }
      });
      if (t > T.asc - 0.2) { texAt('assoc', DX - 40, DY + 60, 56, { alpha: a * lst * gin(T.asc - 0.2), reveal: prog(t, T.asc - 0.2, T.asc + 0.8), color: C.peri }); tick(DX + 330, DY + 60, a * lst * gin(T.asc + 0.6)); }
    }
    // 流水线：x 从右边进来，依次经过 C、B、A
    const pa = a * gin(T.act - 0.2, 0.5);
    if (pa > 0) {
      texAt('assoc', DX, DY - 300, 60, { alpha: pa, color: C.peri });
      const bx = [DX + 220, DX, DX - 220], by = DY - 20, names = ['C', 'B', 'A'], cols = [C.k, C.j, C.i];
      for (let k = 0; k < 3; k++) {
        const g = gin(T.act + k * 0.2, 0.4);
        ctx.save(); ctx.globalAlpha = pa * g; ctx.fillStyle = C.paperHi; ctx.strokeStyle = cols[k]; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(bx[k] - 70, by - 60, 140, 120, 18); ctx.fill(); ctx.stroke(); ctx.restore();
        K.tag(names[k], bx[k], by, { px: 64, a: pa * g, align: 'center', color: cols[k], font: F.serif, w: 900 });
        K.tag(['第一步', '第二步', '第三步'][k], bx[k], by + 96, { px: 26, a: pa * g * gin(T.cba + k * 0.3), align: 'center', color: C.inkMid });
      }
      // x 走过去
      const s = (t - T.cba) / 2.4 % 1, flow = t > T.cba ? s : -1;
      if (flow >= 0) { const x = lerp(DX + 400, DX - 400, flow); ctx.save(); ctx.globalAlpha = pa; ctx.fillStyle = C.peri; ctx.beginPath(); ctx.arc(x, by - 90, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore(); K.tag('x', x, by - 126, { px: 30, a: pa, align: 'center', color: C.peri, w: 900 }); }
      arrow(ctx, [DX + 400, by - 90], [DX - 400, by - 90], { color: C.mist, width: 3, head: 16, alpha: pa * 0.6 });
      // 括号在 (AB) 与 (BC) 之间来回
      const sw = 0.5 - 0.5 * Math.cos(Math.max(0, t - T.par) * 1.6), bA = pa * gin(T.par, 0.4);
      if (bA > 0) {
        const grp = (x0, x1, al) => { ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = C.peri; ctx.lineWidth = 5; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.roundRect(x0 - 90, by - 80, x1 - x0 + 180, 160, 26); ctx.stroke(); ctx.restore(); };
        grp(bx[2], bx[1], bA * (1 - sw)); grp(bx[1], bx[0], bA * sw);
        K.tag(sw < 0.5 ? '(AB) C' : 'A (BC)', DX, by + 170, { px: 40, a: bA, align: 'center', color: C.peri, w: 900 });
      }
      K.tag('顺序没变 → 结果一样', DX, DY + 260, { px: 38, a: pa * gin(T.same), align: 'center', color: C.j, font: F.serif, w: 900 });
      const w = gin(T.warn, 0.4);
      if (w > 0) { texAt('neq', DX, DY + 350, 52, { alpha: pa * w, color: C.free }); }
    }
  }

  // ── 幂 ──
  function drawPow() {
    const a = win(t, T.pw, T.id, 0.4, 0.4); if (a <= 0) return;
    K.tag('教材 · 例 2', DX, DY - 330, { px: 32, a, align: 'center', color: C.inkMid });
    if (t > T.sq - 0.4) texAt('pow2', DX, DY - 200, 52, { alpha: a, reveal: prog(t, T.sq - 0.4, T.sq + 0.8) });
    if (t > T.cube - 0.2) texAt('pow3', DX, DY - 30, 52, { alpha: a, reveal: prog(t, T.cube - 0.2, T.cube + 0.8) });
    if (t > T.pn - 0.2) texAt('pown', DX, DY + 170, 52, { alpha: a, reveal: prog(t, T.pn - 0.2, T.pn + 1.0), color: C.peri });
  }

  // ── 平面：单位矩阵 / 剪切与逆 / 压扁 ──
  function planeM() {
    if (t < T.div) return { M: [[1, 0], [0, 1]], ph: 'I' };
    if (t < T.sg) {
      const f = smoother(prog(t, T.sh - 0.1, T.sh + 1.1)), b = smoother(prog(t, T.back - 0.1, T.back + 1.2));
      return { M: [[1, f - b], [0, 1]], ph: 'inv' };
    }
    return { M: [[1, 0], [0, 1 - smoother(prog(t, T.flat - 0.1, T.flat + 1.6))]], ph: 'sing' };
  }
  function drawPlane(D) {
    const a = win(t, T.id + 0.3, T.e3, 0.5, 0.4) + win(t, T.sg + 0.3, T.abi, 0.5, 0.4); if (a <= 0) return;
    const { M, ph } = planeM();
    // 例 3 那段把平面淡掉
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.6 * a, grow: smooth(prog(t, T.id + 0.3, T.id + 1.4)) });
    P.axes(ctx, { M, color: C.ink, width: 3, alpha: 0.8 * a });
    ctx.restore();
    const O = P.S([0, 0], M), pi = P.S([1, 0], M), pj = P.S([0, 1], M);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: a }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: a * (ph === 'sing' ? Math.max(0.25, M[1][1]) : 1) });
    K.tag('î', pi[0] + 16, pi[1] - 24, { px: 40, a, color: C.i, w: 900, font: F.serif }); K.tag('ĵ', pj[0] - 40, pj[1] - 14, { px: 40, a: a * (ph === 'sing' ? M[1][1] : 1), color: C.j, w: 900, font: F.serif });
    if (ph === 'I') {
      texAt('I3', DX + 280, DY - 280, 40, { alpha: a * gin(T.I), reveal: prog(t, T.I, T.diag + 0.8), halo: C.disc });
      K.tag('什么都不做', DX - 220, DY - 330, { px: 42, a: a * gin(T.geo), align: 'center', color: C.peri, font: F.serif, w: 900 });
      ring(ctx, pi, prog(t, T.stay, T.stay + 0.9), { color: C.i }); ring(ctx, pj, prog(t, T.stay + 0.3, T.stay + 1.2), { color: C.j });
      if (t > T.ia - 0.1) texAt('IA', DX, DY + 330, 56, { alpha: a * gin(T.ia), color: C.peri, halo: C.disc });
    }
    if (ph === 'inv') {
      if (t > T.def - 0.2) texAt('invdef', DX, DY - 330, 46, { alpha: a * gin(T.def - 0.2), reveal: prog(t, T.def - 0.2, T.inv + 0.8), halo: C.disc });
      const f = smoother(prog(t, T.sh - 0.1, T.sh + 1.1));
      if (f > 0) { texAt('Sh', DX + 330, DY - 190, 40, { alpha: a * f, halo: C.disc }); K.tag('剪切', DX + 330, DY - 100, { px: 30, a: a * f, align: 'center', color: C.ink, w: 900 }); }
      const b = gin(T.back, 0.4);
      if (b > 0) { texAt('Shinv', DX + 330, DY + 40, 40, { alpha: a * b, color: C.peri, halo: C.disc }); K.tag('推回去 = 逆', DX + 330, DY + 130, { px: 30, a: a * b, align: 'center', color: C.peri, w: 900 }); }
      if (t > T.back + 0.8) K.tag('又回到原样 = I', DX - 220, DY + 320, { px: 36, a: a * gin(T.its), align: 'center', color: C.j, font: F.serif, w: 900 });
    }
    if (ph === 'sing') {
      texAt('ex5', DX + 330, DY - 270, 44, { alpha: a * gin(T.sg + 0.3), halo: C.disc }); K.tag('例 5', DX + 330, DY - 350, { px: 28, a: a * gin(T.sg + 0.3), align: 'center', color: C.inkMid });
      // 一条竖线 x = 1 上的点
      const va = a * gin(T.vline - 0.3, 0.5);
      if (va > 0) for (let k = -3; k <= 3; k++) {
        const I2 = [[1, 0], [0, 1]], p0 = P.S([1, k], I2), p1 = P.S([1, 0], I2), s = smoother(prog(t, T.vline + 0.4 + Math.abs(k) * 0.06, T.vline + 1.4 + Math.abs(k) * 0.06));
        ctx.save(); ctx.globalAlpha = va; ctx.fillStyle = C.free; ctx.beginPath(); ctx.arc(p0[0], lerp(p0[1], p1[1], s), 9, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      // 结果点 → 往回猜：好几个问号
      const q = a * gin(T.lost, 0.4);
      if (q > 0) { const p = P.S([1, 0], M); [-2, -1, 1, 2].forEach((k, i) => K.tag('?', p[0] + 10, p[1] - k * 70, { px: 40, a: q * gin(T.lost + i * 0.12), color: C.free, w: 900 })); }
      K.tag('奇异 singular', DX - 220, DY - 330, { px: 42, a: a * gin(T.sing), align: 'center', color: C.free, font: F.serif, w: 900 });
      K.tag('压扁了 → 撤不回去', DX - 220, DY + 320, { px: 36, a: a * gin(T.noinv), align: 'center', color: C.free, font: F.serif, w: 900 });
    }
  }

  // 例 3
  function drawEx3() {
    const a = win(t, T.e3, T.sg, 0.4, 0.4); if (a <= 0) return;
    K.tag('教材 · 例 3', DX, DY - 220, { px: 32, a, align: 'center', color: C.inkMid });
    texAt('ex3', DX, DY - 40, 54, { alpha: a, reveal: prog(t, T.e3, T.e3I + 0.4) });
    K.tag('左乘、右乘都是 I ✓', DX, DY + 150, { px: 38, a: a * gin(T.e3I + 0.3), align: 'center', color: C.j, font: F.serif, w: 900 });
  }

  // ── 袜子与鞋 ──
  function drawSocks() {
    const a = win(t, T.abi, T.tr, 0.4, 0.4); if (a <= 0) return;
    texAt('ABinv', DX, DY - 330, 60, { alpha: a * gin(T.rule), color: C.peri });
    K.tag('(AB)⁻¹ = ？', DX, DY - 330, { px: 52, a: a * (1 - gin(T.rule)) * gin(T.abi + 0.3), align: 'center', color: C.ink, font: F.serif, w: 900 });
    K.tag('A⁻¹B⁻¹ ？', DX, DY - 240, { px: 40, a: a * win(t, T.guess, T.sock, 0.3, 0.3), align: 'center', color: C.free, w: 900 });
    const card = (x, y, txt, sub, col, g) => { if (g <= 0) return; ctx.save(); ctx.globalAlpha = a * g; ctx.fillStyle = C.paperHi; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 110, y - 50, 220, 100, 16); ctx.fill(); ctx.stroke(); ctx.restore();
      K.tag(txt, x, y - 8, { px: 38, a: a * g, align: 'center', color: col, font: F.serif, w: 900 }); K.tag(sub, x, y + 30, { px: 24, a: a * g, align: 'center', color: C.inkMid }); };
    const y1 = DY - 120, y2 = DY + 60;
    K.tag('早上', DX - 380, y1, { px: 30, a: a * gin(T.sock), align: 'center', color: C.inkMid });
    card(DX - 160, y1, '① 袜子', 'B', C.j, gin(T.sock)); card(DX + 160, y1, '② 鞋', 'A', C.i, gin(T.shoe));
    arrow(ctx, [DX - 40, y1], [DX + 40, y1], { color: C.ink, width: 4, head: 16, alpha: a * gin(T.shoe) });
    K.tag('晚上', DX - 380, y2, { px: 30, a: a * gin(T.off), align: 'center', color: C.inkMid });
    card(DX - 160, y2, '① 脱鞋', 'A⁻¹', C.i, gin(T.off)); card(DX + 160, y2, '② 脱袜子', 'B⁻¹', C.j, gin(T.off2));
    arrow(ctx, [DX - 40, y2], [DX + 40, y2], { color: C.ink, width: 4, head: 16, alpha: a * gin(T.off2) });
    if (t > T.chk - 0.2) { const pl = tex.place('proof', DX, DY + 230, 40, 'c'); tex.draw(ctx, pl, { alpha: a, reveal: prog(t, T.chk - 0.2, T.rest + 1.0), halo: C.disc }); const h = win(t, T.mid, T.rest + 0.6, 0.2, 0.3); if (h > 0) tex.draw(ctx, pl, { alpha: a * h, only: ['m'], force: C.peri }); }
  }

  // ── 转置 ──
  function drawTrans() {
    const a = win(t, T.tr, T.gr, 0.4, 0.4); if (a <= 0) return;
    const A = TR[0].A, cs = 92;
    // C20–C21：2×3 → 3×2 飞行
    const fa = a * win(t, T.tr, T.flip - 0.2, 0.3, 0.3);
    if (fa > 0) {
      const s = smoother(prog(t, T.row + 0.2, T.row + 1.6));
      const x0 = DX - 1.5 * cs, y0 = DY - 140 - cs, x1 = DX - cs, y1 = DY - 140 - 1.5 * cs;
      for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
        const pA = [x0 + j * cs + cs / 2, y0 + i * cs + cs / 2], pT = [x1 + i * cs + cs / 2, y1 + j * cs + cs / 2];
        const lag = smoother(clamp(s * 1.3 - (i * 3 + j) * 0.05)), arc = Math.sin(Math.PI * lag) * 40;
        const p = [lerp(pA[0], pT[0], lag) + arc, lerp(pA[1], pT[1], lag)];
        const hl = i === 0 && j === 2 && t > T.ij;
        ctx.save(); ctx.globalAlpha = fa; ctx.font = F.sans(50, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = i === 0 ? C.i : C.j; ctx.fillText(A[i][j], p[0], p[1]);
        if (hl) { ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.strokeRect(p[0] - 34, p[1] - 34, 68, 68); }
        ctx.restore();
      }
      K.tag(s < 0.5 ? 'A：2 × 3' : 'Aᵀ：3 × 2', DX, DY - 360, { px: 38, a: fa, align: 'center', color: C.ink, w: 900 });
      K.tag('第 1 行 → 第 1 列（橙黄）  第 2 行 → 第 2 列（青）', DX, DY + 120, { px: 28, a: fa * gin(T.row + 1.2), align: 'center', color: C.inkMid });
      if (t > T.ij - 0.1) texAt('aij', DX, DY + 210, 50, { alpha: fa * gin(T.ij), color: C.peri });
    }
    // C22：方阵沿主对角线翻面
    const sa = a * win(t, T.flip - 0.2, T.abt - 0.1, 0.3, 0.3);
    if (sa > 0) {
      const B = TR[1].A, cs2 = 100, bx = DX - 1.5 * cs2, by = DY - 160 - 1.5 * cs2, s = smoother(prog(t, T.flip + 0.3, T.flip + 1.6));
      ctx.save(); ctx.globalAlpha = sa * 0.7; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(bx - 20, by - 20); ctx.lineTo(bx + 3 * cs2 + 20, by + 3 * cs2 + 20); ctx.stroke(); ctx.restore();
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const p0 = [bx + j * cs2 + cs2 / 2, by + i * cs2 + cs2 / 2], p1 = [bx + i * cs2 + cs2 / 2, by + j * cs2 + cs2 / 2];
        // 绕对角线翻：沿垂直对角线方向缩放到 0 再展开
        const m = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], k = Math.cos(Math.PI * s), p = [m[0] + (p0[0] - m[0]) * k, m[1] + (p0[1] - m[1]) * k];
        const d = i === j;
        ctx.save(); ctx.globalAlpha = sa; ctx.font = F.sans(50, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = d ? C.peri : C.ink; ctx.fillText(fmt(B[i][j]), p[0], p[1]); ctx.restore();
      }
      K.tag('沿主对角线翻面', DX, DY + 210, { px: 38, a: sa * gin(T.flip + 0.3), align: 'center', color: C.peri, font: F.serif, w: 900 });
      K.tag('对角线上的数不动', DX, DY + 270, { px: 30, a: sa * gin(T.still), align: 'center', color: C.inkMid });
    }
    // C23–C25：(AB)ᵀ、尺寸、对称
    const ra = a * win(t, T.abt - 0.1, T.gr, 0.3, 0.3);
    if (ra > 0) {
      texAt('ABT', DX, DY - 250, 64, { alpha: ra, reveal: prog(t, T.abt - 0.1, T.abt + 0.9), color: C.peri });
      K.tag('又是顺序反过来', DX, DY - 160, { px: 34, a: ra * gin(T.abt + 1.0), align: 'center', color: C.inkMid });
      if (t > T.szT - 0.2) texAt('szT', DX, DY - 10, 54, { alpha: ra * gin(T.szT - 0.2), reveal: prog(t, T.szT - 0.2, T.only + 0.6) });
      K.tag('内标 n 对上 ✓', DX, DY + 100, { px: 32, a: ra * gin(T.only), align: 'center', color: C.j, w: 900 });
      if (t > T.sym - 0.2) { texAt('sym', DX, DY + 220, 64, { alpha: ra * gin(T.sym - 0.2), color: C.j }); K.tag('对称矩阵 symmetric', DX, DY + 310, { px: 34, a: ra * gin(T.sym + 0.3), align: 'center', color: C.j, w: 900 }); }
    }
  }

  // ── 航线图 ──
  const NODES = [[-150, -150], [150, -150], [0, 40], [0, 260]];
  function drawGraph() {
    const a = win(t, T.gr, T.end0, 0.5, 0.5); if (a <= 0) return;
    const gx = DX - 230, gy = DY - 80, N = NODES.map(([x, y]) => [gx + x * 0.9, gy + y * 0.9]);
    const ga = a * gin(T.city, 0.5);
    // 边
    GR.edges.forEach(([u, v], k) => {
      const g = smoother(prog(t, T.r1 + k * 0.2, T.r1 + 0.5 + k * 0.2)), p = N[u - 1], q = N[v - 1];
      ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(lerp(p[0], q[0], g), lerp(p[1], q[1], g)); ctx.stroke(); ctx.restore();
    });
    // 两步路线高亮
    const walk = (w, t0, col) => { const s = prog(t, t0, t0 + 1.2); if (s <= 0 || t > T.tj + 0.3) return; const pts = w.map(k => N[k - 1]);
      ctx.save(); ctx.globalAlpha = a * (1 - smooth(prog(t, T.tj - 0.2, T.tj + 0.3))); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = 'round';
      const seg = s * 2; ctx.beginPath(); ctx.moveTo(...pts[0]);
      for (let k = 0; k < 2; k++) { const f = clamp(seg - k); if (f <= 0) break; const p = pts[k], q = pts[k + 1]; const off = k ? -10 : 10; ctx.lineTo(lerp(p[0], q[0], f) + off, lerp(p[1], q[1], f) + off); }
      ctx.stroke(); ctx.restore(); };
    walk(GR.walks11[0], T.w1, C.i); walk(GR.walks11[1], T.w2, C.j);
    N.forEach((p, k) => { const g = outBack(prog(t, T.city + k * 0.12, T.city + 0.4 + k * 0.12)); if (g <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = k === 0 && t > T.w1 ? C.peri : C.disc; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p[0], p[1], 30 * g, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); K.tag(String(k + 1), p[0], p[1], { px: 32, a: a * g, align: 'center', color: C.ink, w: 900 }); });
    // 邻接矩阵 / A²
    const ma = a * gin(T.r1 + 0.6, 0.5);
    if (ma > 0) texAt('Adj', DX + 230, DY - 150, 40, { alpha: ma * (1 - gin(T.a2, 0.5) * 0.65), reveal: prog(t, T.r1 + 0.6, T.r1 + 1.8) });
    K.tag('对称 ✓', DX + 230, DY - 300, { px: 34, a: a * gin(T.two), align: 'center', color: C.j, w: 900 });
    K.tag('邻接矩阵', DX + 230, DY + 10, { px: 30, a: a * gin(T.adj), align: 'center', color: C.inkMid });
    if (t > T.a2 - 0.2) { const pl = tex.place('Adj2', DX + 230, DY + 170, 40, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.a2 - 0.2), reveal: prog(t, T.a2 - 0.2, T.a2 + 1.0) }); const h = gin(T.tot, 0.3); if (h > 0) tex.draw(ctx, pl, { alpha: a * h, only: ['c'], force: C.peri }); }
    K.tag('两步路线条数', DX + 230, DY + 330, { px: 30, a: a * gin(T.steps), align: 'center', color: C.peri, w: 900 });
    // 同济：二阶求逆公式盖在图上
    const tj = a * gin(T.tj, 0.4);
    if (tj > 0) { ctx.save(); ctx.globalAlpha = tj * 0.94; ctx.fillStyle = C.disc; ctx.beginPath(); ctx.arc(DX, DY, DR - 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      K.tag('同济：伴随矩阵求逆（二阶）', DX, DY - 200, { px: 34, a: tj, align: 'center', color: C.gpt, w: 900 });
      texAt('inv2', DX, DY, 60, { alpha: tj, reveal: prog(t, T.tj + 0.3, T.form + 0.5) });
      K.tag('主对角线换位置 · 副对角线变号 · 除以 ad − bc', DX, DY + 170, { px: 30, a: tj * gin(T.sign), align: 'center', color: C.peri, w: 900 }); }
  }

  // ── 总结 ──
  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    texAt('assoc', DX - 180, DY - 260, 46, { alpha: a * gin(T.s1) }); tick(DX + 120, DY - 260, a * gin(T.s1)); texAt('neq', DX + 270, DY - 260, 46, { alpha: a * gin(T.s1 + 0.6), color: C.free });
    texAt('IA', DX, DY - 140, 50, { alpha: a * gin(T.s2) });
    K.tag('A⁻¹：撤销 A', DX, DY - 40, { px: 40, a: a * gin(T.s3), align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('压扁 → 奇异，没有逆', DX, DY + 50, { px: 36, a: a * gin(T.s4), align: 'center', color: C.free, w: 900 });
    texAt('ABinv', DX - 200, DY + 160, 44, { alpha: a * gin(T.s5) }); texAt('ABT', DX + 220, DY + 160, 44, { alpha: a * gin(T.s5 + 0.3) });
    K.tag('下一节：初等矩阵与求逆', DX, DY + 290, { px: 34, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  // ── 左栏 ──
  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.rules, T.pw);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('哪些规则还能用', T.rules);
      K.bullet('加法：交换、结合', 290, gin(T.add)); K.bullet('乘法对加法分配', 350, gin(T.dist)); K.bullet('乘法结合律 ✓', 410, gin(T.asc), { color: C.peri });
      K.note('GPT · 提醒', ['能结合 ≠ 能交换', '括号能挪，位置不能挪'], 450, gin(T.warn, 0.5)); ctx.restore(); }
    a = sec(T.pw + 0.2, T.id);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('方阵的幂', T.pw + 0.3);
      K.bullet('A² = AA，A³ = AAA', 290, gin(T.ex2)); K.bullet('结合律保证没有歧义', 350, gin(T.sq)); ctx.restore(); }
    a = sec(T.id + 0.2, T.div);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('单位矩阵 I', T.id + 0.3);
      K.bullet('对角线 1，其余 0', 290, gin(T.diag)); K.bullet('几何：什么都不做', 350, gin(T.geo)); K.bullet('IA = AI = A', 410, gin(T.ia), { color: C.peri }); ctx.restore(); }
    a = sec(T.div + 0.2, T.abi);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('逆矩阵 = 撤销', T.div + 0.3);
      K.bullet('AB = BA = I', 290, gin(T.def)); K.bullet('B 记作 A⁻¹', 350, gin(T.inv), { color: C.peri });
      K.bullet('压扁 → 奇异（不可逆）', 420, gin(T.sing), { color: C.free, mark: C.free });
      K.note('GPT · 注意', ['只有方阵才谈可逆', '长方形矩阵不说“奇异”'], 460, gin(T.sq2, 0.5)); ctx.restore(); }
    a = sec(T.abi + 0.2, T.tr);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('乘积的逆', T.abi + 0.3);
      K.bullet('先穿袜子再穿鞋', 290, gin(T.sock)); K.bullet('先脱鞋再脱袜子', 350, gin(T.off)); K.bullet('(AB)⁻¹ = B⁻¹A⁻¹', 410, gin(T.rule), { color: C.peri }); ctx.restore(); }
    a = sec(T.tr + 0.2, T.gr);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('转置 Aᵀ', T.tr + 0.3);
      K.bullet('行 → 列', 290, gin(T.row)); K.bullet('aᵢⱼ 跑到 (j, i)', 350, gin(T.ij)); K.bullet('(AB)ᵀ = BᵀAᵀ', 410, gin(T.abt), { color: C.peri }); K.bullet('Aᵀ = A：对称', 470, gin(T.sym), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.gr + 0.2, T.tj);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('图与邻接矩阵', T.gr + 0.3);
      K.bullet('有航线 1，没有 0', 290, gin(T.r1)); K.bullet('双向 → 对称', 350, gin(T.two)); K.bullet('A² 数两步路线', 410, gin(T.a2), { color: C.peri }); ctx.restore(); }
    a = sec(T.tj + 0.2, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('同济怎么求逆', T.tj + 0.3);
      K.note('同济第六版 · 对照', ['先讲行列式', '伴随矩阵：A⁻¹ = A* / |A|', '本课用行变换（下一节）'], 280, gin(T.tj + 0.4, 0.5)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('结合 ✓  交换 ✗', 290, gin(T.s1)); K.bullet('I：不动；A⁻¹：撤销', 350, gin(T.s2)); K.bullet('乘积求逆、转置：反序', 410, gin(T.s5), { color: C.peri }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.4', prog(t, 0.2, 1.3));
    drawTitle(); drawRules(); drawPow(); drawPlane(D); drawEx3(); drawSocks(); drawTrans(); drawGraph(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
