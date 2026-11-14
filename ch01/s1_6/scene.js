// 第 1 章 §1.6 分块矩阵（Leon 9th §1.6：按列 / 按行分块、Block Multiplication、例 1–3、内积 / 外积、外积展开）。
// 3B1B 视角：色块代替元素；AB 的每一列 = A 搬运 B 的每一列；外积 = 把平面压成一条线的「图层」，XYᵀ = 图层叠加。
// 分镜：
//   D01–C01   大矩阵 → 横竖切开 → 分块矩阵
//   C02–C05   按列：A[b₁ b₂ b₃] = [Ab₁ Ab₂ Ab₃]；平面上 A 搬运向量；A = AI
//   D02–C07   按行：AB 的第 i 行 = aᵢB
//   C08–C24   一般分块：块当数乘；顺序不能换
//   D03–G01   切法要对齐；例 1 四块；Case 3：竖切 × 横切 = 和
//   C13–C15   分块对角求逆（例 2）
//   D04–C19   内积 / 外积；外积行列都成比例；平面被压成一条线
//   C20–D05   外积展开（例 3），图层叠加热力图
//   G02–C23   同济对照、总结
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mlerp2, rgba } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { fmtNum } from '../../engine/la2d/mboard.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'ds_shock', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const SUBN = ['₁', '₂', '₃'];

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const EX1 = MJ.blocks[0], BD = MJ.inverses[0];
  const L3a = MJ.products[9].Ax, L3b = MJ.products[10].Ax, L3 = MJ.products[11].Ax, OUT = MJ.products[7].Ax;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.7, C03: 0.3, C04: 0.5, C06: 0.3, C08: 0.7, C24: 0.3, C10: 0.3, C11: 0.4, C12: 0.3, G01: 0.4, C13: 0.7, C16: 0.5, C17: 0.3, C18: 0.3, C19: 0.4, C20: 0.6, C21: 0.3, C22: 0.4, G02: 0.4, D06: 0.6 },
    post: { C03: 0.6, C04: 0.6, C07: 0.5, C09: 0.4, C12: 0.6, C14: 0.4, C18: 0.4, C19: 0.6, C21: 0.5, C22: 0.4 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 30, oy: DY + 80, u: 95, R: 9 });

  const T = {
    big: cue('D01', '一块一块'), cut: cue('C01', '横线和竖线'), sub: cue('C01', '子矩阵'), blk: cue('C01', '分块矩阵'),
    col: L('C02').s - 0.6, colc: cue('C02', '按列切开'), cols: cue('C02', '分别乘'),
    c1: cue('C03', '第一列'), c2: cue('C03', '第二列'), c3: cue('C03', '第三列'), cj: cue('C03', '拼起来'),
    geo: L('C04').s - 0.4, gv: cue('C04', '每一列是一个向量'), gm: cue('C04', '送到新位置'), ai: cue('C05', '单位矩阵的第j列'), aih: cue('C05', 'i帽'),
    row: L('D02').s, rowf: cue('C06', '第i行乘B'), r1: cue('C07', '二、五'), rj: cue('C07', '摞起来'),
    gen: L('C08').s - 0.6, gen2: cue('C08', '当成一个数'), tl: cue('C09', '左上角那块'), same: cue('C09', '一模一样'),
    ord: cue('C24', '顺序不能换'), ord2: cue('C24', '不能写成'),
    ex1: L('D03').s, cnd: cue('C10', '列怎么切'), cnd2: cue('C10', '行就必须'), e1: cue('C11', '例一'), e1s: cue('C11', '切成二加二'),
    four: cue('C12', '四个块'), eq1: cue('C12', '完全一样'),
    c3t: cue('G01', '小技巧'), c3s: cue('G01', '两块乘积之和'), c3o: cue('G01', '外积'),
    bd: L('C13').s - 0.6, bd1: cue('C13', '分块对角矩阵'), bd0: cue('C13', '其余全是零'), bd2: cue('C14', '当且仅当'), bdi: cue('C14', '分别求逆'), bdg: cue('C15', '各管各的'),
    io: L('D04').s, inn: cue('C16', 'x转置乘y'), inn2: cue('C16', '每个元素'), out: cue('C17', 'x乘y转置'), out2: cue('C17', '叫外积'),
    oex: cue('C18', '教材例子'), orow: cue('C18', '每一行'), ocol: cue('C18', '每一列'),
    sq: L('C19').s - 0.4, sq2: cue('C19', '压成一条线'),
    exp: L('C20').s - 0.5, exp2: cue('C20', '一串外积相加'), exp3: cue('C20', '外积展开'),
    l1: cue('C21', '第一层'), l2: cue('C21', '第二层'), lsum: cue('C21', '两层加起来'), lay: cue('C22', '想成图层'), img: cue('C22', '第六章'),
    tj: L('G02').s - 0.2, tj2: cue('G02', '分块对角'),
    end0: L('D06').s - 0.6, z1: cue('D06', '把块当成数'), z2: cue('D06', '前提是'), z3: cue('D07', '各自求逆'), z4: cue('D07', '一层层外积'), next: cue('C23', '真题'),
  };
  const QB = [T.four, T.four + 0.6, T.four + 1.2, T.four + 1.8];

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('type', T.big, 0.25); TL.sfx('swell', T.cut, 0.3); TL.sfx('stamp', T.blk, 0.35);
  TL.sfx('whoosh', T.col, 0.3); [T.c1, T.c2, T.c3].forEach((t, i) => TL.sfx(['marimba', 'marimba_hi', 'marimba'][i], t + 0.2, 0.28)); TL.sfx('check', T.cj, 0.3);
  TL.sfx('warp', T.gm, 0.4); TL.sfx('ding_lo', T.aih, 0.3);
  TL.sfx('whoosh', T.row + 0.2, 0.3); TL.sfx('pop', T.r1, 0.3); TL.sfx('check', T.rj, 0.3);
  TL.sfx('whoosh', T.gen, 0.3); TL.sfx('pop', T.tl, 0.3); TL.sfx('buzz', T.ord2, 0.25);
  TL.sfx('whoosh', T.ex1 + 0.2, 0.3); TL.sfx('ding_lo', T.cnd, 0.3); QB.forEach((t, i) => TL.sfx(i % 2 ? 'marimba_hi' : 'marimba', t, 0.28)); TL.sfx('check', T.eq1, 0.3); TL.sfx('bell_soft', T.c3t, 0.3);
  TL.sfx('whoosh', T.bd, 0.3); TL.sfx('pop', T.bd1, 0.3); TL.sfx('check', T.bdi, 0.3);
  TL.sfx('whoosh', T.io + 0.2, 0.3); TL.sfx('pop', T.inn, 0.3); TL.sfx('pop', T.out, 0.3); TL.sfx('tick', T.orow, 0.3); TL.sfx('tick', T.ocol, 0.3); TL.sfx('thud', T.sq2, 0.3);
  TL.sfx('whoosh', T.exp, 0.3); TL.sfx('pluck', T.l1, 0.3); TL.sfx('pluck', T.l2, 0.3); TL.sfx('shimmer', T.lsum, 0.35); TL.sfx('sparkle', T.lay, 0.3);
  TL.sfx('bell_soft', T.tj + 0.2, 0.3); TL.sfx('whoosh', T.end0, 0.3); [T.z1, T.z2, T.z3, T.z4].forEach(t => TL.sfx('check', t, 0.3)); TL.sfx('shimmer', L('C23').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  // 数字格子：分割线 + 色块
  function grid(M, o) {
    const { x, y, px, a = 1, rs = [], cs = [], tint = () => null, color = () => C.ink, cw = px * 1.9, rh = px * 1.5, split = 1, splitColor = C.peri, show = () => 1 } = o;
    const m = M.length, n = M[0].length, W = cw * n, H = rh * m, x0 = x - W / 2, y0 = y - H / 2;
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) { const tn = tint(i, j); if (tn) { ctx.globalAlpha = a * tn[1]; ctx.fillStyle = tn[0]; ctx.fillRect(x0 + j * cw + 2, y0 + i * rh + 2, cw - 4, rh - 4); } }
    ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 3.5; const e = 14, bx0 = x0 - 8, bx1 = x0 + W + 8;
    ctx.beginPath(); ctx.moveTo(bx0 + e, y0 - 4); ctx.lineTo(bx0, y0 - 4); ctx.lineTo(bx0, y0 + H + 4); ctx.lineTo(bx0 + e, y0 + H + 4); ctx.moveTo(bx1 - e, y0 - 4); ctx.lineTo(bx1, y0 - 4); ctx.lineTo(bx1, y0 + H + 4); ctx.lineTo(bx1 - e, y0 + H + 4); ctx.stroke();
    if (split > 0) { ctx.globalAlpha = a * Math.min(1, split); ctx.strokeStyle = splitColor; ctx.lineWidth = split > 1 ? 5 : 3; ctx.setLineDash([10, 8]);
      for (const r of rs) { ctx.beginPath(); ctx.moveTo(x0 - 4, y0 + r * rh); ctx.lineTo(x0 + W + 4, y0 + r * rh); ctx.stroke(); }
      for (const c of cs) { ctx.beginPath(); ctx.moveTo(x0 + c * cw, y0 - 4); ctx.lineTo(x0 + c * cw, y0 + H + 4); ctx.stroke(); } ctx.setLineDash([]); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = F.sans(px, 500);
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) { const s = show(i, j); if (s <= 0) continue; ctx.globalAlpha = a * s; ctx.fillStyle = color(i, j); ctx.fillText(fmtNum(M[i][j]), x0 + j * cw + cw / 2, y0 + i * rh + rh / 2); }
    ctx.restore(); return { x0, y0, W, H, cw, rh };
  }

  function drawTitle() {
    const a = 1 - smooth(prog(t, T.col - 0.2, T.col + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.6 分块矩阵'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'PARTITIONED MATRICES', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    // 大矩阵 → 切开
    const ga = a * gin(T.big - 0.6, 0.6); if (ga <= 0) return;
    const BIG = Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => ((i * 7 + j * 5 + 3) % 11) - 3));
    const cut = smoother(prog(t, T.cut, T.cut + 1.0)), tn = gin(T.sub, 0.6);
    const tc = (i, j) => [[C.i, C.j], [C.k, C.peri]][i < 2 ? 0 : 1][j < 3 ? 0 : 1];
    grid(BIG, { x: DX, y: DY - 20, px: 34, a: ga, rs: [2], cs: [3], split: cut, tint: (i, j) => tn > 0 ? [tc(i, j), 0.22 * tn] : null });
    K.tag('分块矩阵', DX, DY + 250, { px: 40, a: ga * gin(T.blk), align: 'center', color: C.peri, font: F.serif, w: 900 });
    [['A₁₁', -1, -1], ['A₁₂', 1, -1], ['A₂₁', -1, 1], ['A₂₂', 1, 1]].forEach(([s, sx, sy], i) => K.tag(s, DX + sx * 250, DY - 20 + sy * 150, { px: 32, a: ga * gin(T.sub + 0.3 + i * 0.15), align: 'center', color: [C.i, C.j, C.k, C.peri][i], font: F.serif, w: 900 }));
  }

  // ── 按列 ──
  function drawCols() {
    const a = win(t, T.col, T.geo, 0.4, 0.4); if (a <= 0) return;
    const hl = { c1: gin(T.c1), c2: gin(T.c2), c3: gin(T.c3) };
    texAt('colAB', DX, DY - 280, 46, { alpha: a * gin(T.colc - 0.2), reveal: prog(t, T.colc - 0.2, T.cols + 0.8) });
    const ea = a * gin(T.c1 - 0.6, 0.5);
    if (ea > 0) {
      const pl = tex.place('colEx', DX - 180, DY - 40, 46, 'c');
      tex.draw(ctx, pl, { alpha: ea, cls: { c1: 0.35 + 0.65 * hl.c1, c2: 0.35 + 0.65 * hl.c2, c3: 0.35 + 0.65 * hl.c3 } });
      const cur = t < T.c2 ? 'c1' : t < T.c3 ? 'c2' : 'c3', bx = tex.groupBox(pl, cur), ha = ea * gin(T.c1) * (1 - gin(T.cj, 0.4));
      if (bx && ha > 0) { ctx.save(); ctx.globalAlpha = ha; ctx.strokeStyle = { c1: C.i, c2: C.j, c3: C.k }[cur]; ctx.lineWidth = 4; ctx.strokeRect(bx.x - bx.w / 2 - 12, bx.y - bx.h / 2 - 10, bx.w + 24, bx.h + 20); ctx.restore(); }
      texAt('colRes', DX + 300, DY - 40, 46, { alpha: ea, cls: hl });
      K.tag('拼起来 = AB', DX + 260, DY + 110, { px: 32, a: ea * gin(T.cj), align: 'center', color: C.peri, w: 900 });
    }
  }
  // 平面：A 搬运向量
  const A2 = MJ.products[13].A, bv = [[1, 1], [-1, 1]];
  function drawGeo(D) {
    const a = win(t, T.geo, T.row, 0.4, 0.4); if (a <= 0) return;
    const s = smoother(prog(t, T.gm - 0.2, T.gm + 1.3)), M = mlerp2(A2, s);
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.55 * a }); P.axes(ctx, { M, color: C.ink, width: 3, alpha: 0.7 * a });
    ctx.restore();
    const O = P.S([0, 0], M);
    const ba = a * gin(T.gv, 0.4) * (1 - gin(T.ai, 0.4));
    if (ba > 0) bv.forEach((v, i) => { const q = P.S(v, M); arrow(ctx, O, q, { color: [C.i, C.j][i] === C.i ? C.k : C.free, width: 8, head: 26, alpha: ba }); K.tag(s > 0.5 ? `Ab${SUBN[i]}` : `b${SUBN[i]}`, q[0] + (i ? -70 : 14), q[1] - 20, { px: 32, a: ba, color: i ? C.free : C.k, w: 900, font: F.serif }); });
    const ea = a * gin(T.ai, 0.4);
    if (ea > 0) { const pi = P.S([1, 0], M), pj = P.S([0, 1], M); arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: ea }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: ea });
      K.tag('Ae₁ = 第 1 列', pi[0] + 16, pi[1] + 30, { px: 28, a: ea * gin(T.aih), color: C.i, w: 900 }); K.tag('Ae₂ = 第 2 列', pj[0] - 220, pj[1] - 20, { px: 28, a: ea * gin(T.aih), color: C.j, w: 900 });
      texAt('AI', DX, DY - 330, 40, { alpha: ea, halo: C.disc }); }
    K.tag('A 把 B 的每一列搬到新位置', DX, DY - 330, { px: 32, a: a * gin(T.gm) * (1 - ea / Math.max(a, 1e-6)), align: 'center', color: C.peri, w: 900 });
  }

  // ── 按行 ──
  function drawRows() {
    const a = win(t, T.row + 0.2, T.gen, 0.4, 0.4); if (a <= 0) return;
    const r1 = gin(T.r1), rj = gin(T.rj);
    texAt('rowAB', DX, DY - 230, 44, { alpha: a * gin(T.rowf - 0.3), cls: { r1: 1, r2: 0.4 + 0.6 * rj, r3: 0.4 + 0.6 * rj } });
    const ea = a * gin(T.r1 - 0.4, 0.5);
    if (ea > 0) {
      texAt('rowEx', DX - 160, DY + 70, 42, { alpha: ea, cls: { r1: 1, r2: 0.35 + 0.65 * rj, r3: 0.35 + 0.65 * rj } });
      texAt('rowRes', DX + 250, DY + 70, 42, { alpha: ea, cls: { r1: r1, r2: rj, r3: rj } });
      K.tag('各算各的，摞起来', DX, DY + 250, { px: 32, a: ea * gin(T.rj), align: 'center', color: C.peri, w: 900 });
    }
  }

  // ── 一般分块 ──
  function drawGen() {
    const a = win(t, T.gen, T.ex1, 0.4, 0.4); if (a <= 0) return;
    const hl = gin(T.tl, 0.4);
    const pl = tex.place('blk4', DX, DY - 80, 34, 'c');
    tex.draw(ctx, pl, { alpha: a * gin(T.gen + 0.3), reveal: prog(t, T.gen + 0.3, T.gen2 + 0.6) });
    if (hl > 0) { tex.draw(ctx, pl, { alpha: a * hl, only: ['c11'], force: C.peri }); tex.draw(ctx, pl, { alpha: a * hl, only: ['ra'], force: C.i }); tex.draw(ctx, pl, { alpha: a * hl, only: ['cb'], force: C.j }); }
    K.tag('块当成数：行 × 列', DX, DY + 60, { px: 32, a: a * gin(T.gen2), align: 'center', color: C.ink, w: 900 });
    K.tag('和 2×2 公式一模一样', DX, DY + 120, { px: 30, a: a * gin(T.same), align: 'center', color: C.peri, w: 900 });
    const oa = a * gin(T.ord, 0.4); if (oa > 0) { texAt('ord', DX, DY + 230, 48, { alpha: oa }); K.tag('块是矩阵：顺序不能换', DX, DY + 310, { px: 30, a: oa * gin(T.ord2), align: 'center', color: C.free, w: 900 }); }
  }

  // ── 例 1 ──
  function drawEx1() {
    const a = win(t, T.ex1 + 0.2, T.bd, 0.4, 0.4); if (a <= 0) return;
    const ca = a * (1 - gin(T.c3t, 0.4));
    const BC = [[C.i, C.j], [C.k, C.peri]];
    const pul = 1 + 1.2 * pulse(t, T.cnd, 1.4) + 1.2 * pulse(t, T.cnd2, 1.4);
    if (ca > 0) {
      K.tag('教材 · 例 1', DX, DY - 330, { px: 30, a: ca, align: 'center', color: C.inkMid });
      const rs = gin(T.cnd - 0.3, 0.5);
      // 当前高亮的块（C12 逐块）
      let q = -1; for (let i = 0; i < 4; i++) if (t >= QB[i]) q = i; if (t > T.eq1 + 0.5) q = -1;
      const qi = q >> 1, qj = q & 1;
      const tintA = (i, j) => { const bi = i < 1 ? 0 : 1, bk = j < 2 ? 0 : 1; const on = q < 0 || bi === qi; return [BC[bi][bk], (q < 0 ? 0.16 : on ? 0.3 : 0.06) * rs]; };
      const tintB = (i, j) => { const bk = i < 2 ? 0 : 1, bj = j < 2 ? 0 : 1; const on = q < 0 || bj === qj; return [BC[bk][bj], (q < 0 ? 0.16 : on ? 0.3 : 0.06) * rs]; };
      grid(EX1.A, { x: DX - 300, y: DY - 120, px: 30, a: ca, rs: [1], cs: [2], split: rs * (t < T.cnd2 + 1.5 ? pul : 1), tint: tintA });
      grid(EX1.B, { x: DX + 60, y: DY - 120, px: 30, a: ca, rs: [2], cs: [2], split: rs * (t < T.cnd2 + 1.5 ? pul : 1), tint: tintB });
      K.tag('A：3×4', DX - 300, DY - 250, { px: 28, a: ca * gin(T.e1), align: 'center', color: C.ink, w: 900 }); K.tag('B：4×4', DX + 60, DY - 250, { px: 28, a: ca * gin(T.e1), align: 'center', color: C.ink, w: 900 });
      K.tag('列 2 + 2', DX - 300, DY + 10, { px: 26, a: ca * gin(T.cnd), align: 'center', color: C.peri, w: 900 }); K.tag('行 2 + 2', DX + 230, DY - 120, { px: 26, a: ca * gin(T.cnd2), color: C.peri, w: 900 });
      const ra = ca * gin(T.four - 0.2, 0.4);
      if (ra > 0) {
        const done = (i, j) => { const bi = i < 1 ? 0 : 1, bj = j < 2 ? 0 : 1, k = bi * 2 + bj; return gin(QB[k] + 0.3, 0.4); };
        grid(EX1.AB, { x: DX - 60, y: DY + 150, px: 32, a: ra, rs: [1], cs: [2], tint: (i, j) => [C.peri, 0.12 * done(i, j)], show: done, color: (i, j) => i === 0 && t > T.eq1 - 0.2 ? C.peri : C.ink });
        K.tag('AB =', DX - 330, DY + 150, { px: 34, a: ra, align: 'center', color: C.ink, font: F.serif, w: 900 });
        texAt('c11', DX, DY + 300, 30, { alpha: ra * gin(QB[0] + 0.3) * (1 - gin(T.eq1, 0.4)), halo: C.disc });
        K.tag('分块算 = 直接乘 ✓', DX, DY + 300, { px: 32, a: ra * gin(T.eq1), align: 'center', color: C.peri, w: 900 });
      }
    }
    const ga = a * gin(T.c3t, 0.4);
    if (ga > 0) {
      texAt('case3', DX, DY - 150, 54, { alpha: ga, reveal: prog(t, T.c3t, T.c3s + 0.8) });
      K.tag('竖切 A × 横切 B = 两块乘积之和', DX, DY + 10, { px: 32, a: ga * gin(T.c3s), align: 'center', color: C.gpt, w: 900 });
      K.tag('→ 外积展开的源头', DX, DY + 90, { px: 32, a: ga * gin(T.c3o), align: 'center', color: C.peri, w: 900 });
    }
  }

  // ── 分块对角 ──
  function drawBD() {
    const a = win(t, T.bd, T.io, 0.4, 0.4); if (a <= 0) return;
    const blk = (i, j) => (i < 2) === (j < 2);
    const tint = (i, j) => blk(i, j) ? [i < 2 ? C.i : C.j, 0.22] : null;
    const col = (i, j) => blk(i, j) ? C.ink : C.mist;
    grid(BD.A, { x: DX - 230, y: DY - 120, px: 34, a: a * gin(T.bd1 - 0.3), rs: [2], cs: [2], tint, color: col, split: gin(T.bd1) });
    K.tag('A', DX - 230, DY - 260, { px: 36, a: a * gin(T.bd1 - 0.3), align: 'center', color: C.ink, font: F.serif, w: 900 });
    K.tag('其余全是 0', DX - 230, DY + 20, { px: 26, a: a * gin(T.bd0), align: 'center', color: C.mist, w: 900 });
    const ia = a * gin(T.bdi, 0.5);
    if (ia > 0) { grid(BD.inv, { x: DX + 230, y: DY - 120, px: 34, a: ia, rs: [2], cs: [2], tint, color: col }); K.tag('A⁻¹', DX + 230, DY - 260, { px: 36, a: ia, align: 'center', color: C.peri, font: F.serif, w: 900 }); K.tag('→', DX, DY - 120, { px: 50, a: ia, align: 'center', color: C.peri, w: 900 }); }
    texAt('bd', DX, DY + 150, 46, { alpha: a * gin(T.bd2), reveal: prog(t, T.bd2, T.bdi + 0.8) });
    K.tag('两块各管各的，各撤各的', DX, DY + 280, { px: 32, a: a * gin(T.bdg), align: 'center', color: C.peri, w: 900 });
  }

  // ── 内积 / 外积 ──
  function drawIO() {
    const a = win(t, T.io + 0.2, T.sq, 0.4, 0.4); if (a <= 0) return;
    texAt('inner', DX, DY - 260, 42, { alpha: a * gin(T.inn - 0.2), reveal: prog(t, T.inn - 0.2, T.inn + 1.0) });
    K.tag('内积：一行 × 一列 = 一个数', DX, DY - 160, { px: 30, a: a * gin(T.inn + 0.6), align: 'center', color: C.j, w: 900 });
    const oa = a * gin(T.out - 0.2, 0.4);
    if (oa > 0) {
      texAt('outer', DX - 170, DY + 60, 42, { alpha: oa, reveal: prog(t, T.out - 0.2, T.out + 0.9) });
      const rw = gin(T.orow, 0.4) * (1 - gin(T.ocol, 0.3)), cl = gin(T.ocol, 0.4);
      const sweepR = Math.floor(clamp((t - T.orow) / 0.5, 0, 2.99)), sweepC = Math.floor(clamp((t - T.ocol) / 0.5, 0, 2.99));
      grid(OUT, { x: DX + 260, y: DY + 60, px: 34, a: oa * gin(T.out2 - 0.3), tint: (i, j) => rw > 0 && i === sweepR ? [C.i, 0.3 * rw] : cl > 0 && j === sweepC ? [C.j, 0.3 * cl] : null });
      K.tag('外积：一列 × 一行 = 整个矩阵', DX, DY + 200, { px: 30, a: oa * gin(T.out2), align: 'center', color: C.peri, w: 900 });
      K.tag('每行 ∥ (3, 5, 2)', DX - 120, DY + 270, { px: 30, a: oa * gin(T.orow), align: 'center', color: C.i, w: 900 });
      K.tag('每列 ∥ x', DX + 200, DY + 270, { px: 30, a: oa * gin(T.ocol), align: 'center', color: C.j, w: 900 });
    }
  }
  function drawSquash(D) {
    const a = win(t, T.sq, T.exp, 0.4, 0.4); if (a <= 0) return;
    const s = smoother(prog(t, T.sq + 0.6, T.sq2 + 0.6)), M = mlerp2([[2, 2], [1, 1]], s);
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.55 * a });
    ctx.globalAlpha = a * gin(T.sq2 - 0.3); ctx.strokeStyle = C.peri; ctx.lineWidth = 6; const d = [2 / Math.sqrt(5), 1 / Math.sqrt(5)];
    ctx.beginPath(); ctx.moveTo(P.ox - d[0] * 700, P.oy + d[1] * 700); ctx.lineTo(P.ox + d[0] * 700, P.oy - d[1] * 700); ctx.stroke();
    ctx.restore();
    const O = P.S([0, 0], M), pi = P.S([1, 0], M), pj = P.S([0, 1], M);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: a }); arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: a });
    texAt('oxy2', DX + 20, DY - 320, 38, { alpha: a, halo: C.disc });
    K.tag('整个平面 → 一条直线', DX, DY + 330, { px: 34, a: a * gin(T.sq2), align: 'center', color: C.peri, font: F.serif, w: 900 });
  }

  // ── 外积展开：图层 ──
  function heat(M, x, y, cell, a, col, label) {
    const mx = 20;
    ctx.save();
    M.forEach((r, i) => r.forEach((v, j) => { ctx.globalAlpha = a * (0.12 + 0.88 * v / mx); ctx.fillStyle = col; ctx.fillRect(x + (j - 1.5) * cell + 2, y + (i - 1.5) * cell + 2, cell - 4, cell - 4);
      ctx.globalAlpha = a; ctx.fillStyle = v / mx > 0.55 ? '#121010' : C.ink; ctx.font = F.sans(cell * 0.36, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(v), x + (j - 1) * cell, y + (i - 1) * cell); }));
    ctx.restore(); if (label) K.tag(label, x, y + cell * 2.0, { px: 26, a, align: 'center', color: col, w: 900 });
  }
  function drawExp() {
    const a = win(t, T.exp, T.tj, 0.4, 0.4); if (a <= 0) return;
    texAt('expand', DX, DY - 300, 40, { alpha: a * gin(T.exp2 - 0.4), reveal: prog(t, T.exp2 - 0.4, T.exp3 + 0.6) });
    texAt('ex3', DX, DY - 170, 36, { alpha: a * gin(T.l1 - 0.2), cls: {}, reveal: prog(t, T.l1 - 0.2, T.lsum + 0.4) });
    const ha = a * gin(T.l1, 0.5);
    if (ha > 0) {
      heat(L3a, DX - 300, DY + 70, 66, ha, C.i, '第 1 层');
      K.tag('+', DX - 150, DY + 70, { px: 50, a: a * gin(T.l2), align: 'center', color: C.ink, w: 900 });
      heat(L3b, DX, DY + 70, 66, a * gin(T.l2, 0.5), C.j, '第 2 层');
      K.tag('=', DX + 150, DY + 70, { px: 50, a: a * gin(T.lsum), align: 'center', color: C.ink, w: 900 });
      heat(L3, DX + 300, DY + 70, 66, a * gin(T.lsum, 0.5), C.peri, 'XYᵀ');
    }
    K.tag('每层简单，叠起来复杂', DX, DY + 280, { px: 32, a: a * gin(T.lay), align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('第六章：图像压缩', DX, DY + 340, { px: 26, a: a * gin(T.img), align: 'center', color: C.inkMid });
  }

  function drawTJ() {
    const a = win(t, T.tj, T.end0, 0.4, 0.5); if (a <= 0) return;
    K.tag('同济第六版 · 对照', DX, DY - 160, { px: 34, a, align: 'center', color: C.gpt, w: 900 });
    K.tag('第二章「矩阵分块法」', DX, DY - 70, { px: 38, a, align: 'center', color: C.ink, w: 900 });
    texAt('bd', DX, DY + 70, 40, { alpha: a * gin(T.tj2) });
  }
  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    K.tag('块当成数来乘', DX, DY - 250, { px: 44, a: a * gin(T.z1), align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('A 的列切法 = B 的行切法', DX, DY - 160, { px: 32, a: a * gin(T.z2), align: 'center', color: C.ink, w: 900 });
    K.tag('分块对角：各自求逆', DX, DY - 70, { px: 32, a: a * gin(T.z3), align: 'center', color: C.i, w: 900 });
    K.tag('XYᵀ = 一层层外积', DX, DY + 20, { px: 32, a: a * gin(T.z4), align: 'center', color: C.j, w: 900 });
    K.tag('第一章 完', DX, DY + 170, { px: 40, a: a * gin(L('C23').s + 0.5, 0.5), align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag('下一集：真题练手', DX, DY + 240, { px: 30, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.col, T.gen);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('按列 / 按行切', T.col);
      K.bullet('AB = [Ab₁ Ab₂ Ab₃]', 290, gin(T.colc)); K.bullet('A 搬运 B 的每一列', 350, gin(T.gm), { color: C.peri }); K.bullet('A 的第 j 列 = Aeⱼ', 410, gin(T.ai));
      K.bullet('AB 第 i 行 = aᵢB', 480, gin(T.rowf), { mark: C.j }); ctx.restore(); }
    a = sec(T.gen + 0.2, T.bd);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('分块乘法', T.gen + 0.3);
      K.bullet('块当成数来乘', 290, gin(T.gen2)); K.bullet('顺序不能换', 350, gin(T.ord), { color: C.free, mark: C.free }); K.bullet('A 列切 = B 行切', 410, gin(T.cnd), { color: C.peri }); K.bullet('例 1：四块拼回', 470, gin(T.four));
      K.note('GPT · 小技巧', ['[A₁ A₂][B₁; B₂] = A₁B₁ + A₂B₂'], 510, gin(T.c3t, 0.5)); ctx.restore(); }
    a = sec(T.bd + 0.2, T.io);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('分块对角', T.bd + 0.3);
      K.bullet('对角块都可逆 ⇔ A 可逆', 290, gin(T.bd2)); K.bullet('逆 = 各块求逆', 350, gin(T.bdi), { color: C.peri }); ctx.restore(); }
    a = sec(T.io + 0.2, T.tj);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('内积与外积', T.io + 0.3);
      K.bullet('xᵀy：一个数', 290, gin(T.inn), { mark: C.j }); K.bullet('xyᵀ：一个矩阵', 350, gin(T.out), { mark: C.peri }); K.bullet('外积把平面压成线', 410, gin(T.sq2)); K.bullet('XYᵀ = 外积之和', 470, gin(T.exp2), { color: C.peri }); ctx.restore(); }
    a = sec(T.tj + 0.2, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('对照', T.tj + 0.3); K.note('同济第六版', ['第二章 矩阵分块法', '分块对角求逆同例 2'], 260, gin(T.tj, 0.5)); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('块当成数', 290, gin(T.z1)); K.bullet('切法要对齐', 350, gin(T.z2)); K.bullet('对角块各自求逆', 410, gin(T.z3), { mark: C.i }); K.bullet('矩阵 = 外积图层', 470, gin(T.z4), { mark: C.j }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.6', prog(t, 0.2, 1.3));
    drawTitle(); drawCols(); drawGeo(D); drawRows(); drawGen(); drawEx1(); drawBD(); drawIO(); drawSquash(D); drawExp(); drawTJ(); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
