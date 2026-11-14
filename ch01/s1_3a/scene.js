// 第 1 章 §1.3（上）向量与 Ax（Leon 9th §1.3 Vectors / Scalar Multiplication / Matrix Addition / Matrix Multiplication and Linear Systems /
// Theorem 1.3.1；同济第六版 第二章 §1–§2、第四章 §1 定理 1）。3B1B 对应：Essence of Linear Algebra 第 1–3 集。
// 分镜：
//   开场 D01–C01  标题
//   C02–C04      老朋友方程组 → 解 (2, 1) → 行向量 / 列向量 → ℝⁿ
//   D02–G01      平面：箭头 (2, 1)；箭头 ⇄ 一列数；记号 aᵢⱼ、aⱼ
//   C07–C09      数乘：×2、×(−1)、×½；½A
//   C10–G02      加法：首尾相接；对应分量；矩阵加法、零矩阵
//   C13–D05      线性组合：2(1,1) + 1(1,−1) = (3,1) → 方程组竖着看
//   C19–C21      行图（两直线交于 (2,1)）与列图（箭头拼出 (3,1)）
//   C22–G03      定义 Ax = x₁a₁ + … + xₙaₙ；行乘列（Case 1、例 3）；尺寸
//   C29–D07      主画面：A 作为网格变换，î → a₁，ĵ → a₂，x = (2,1) 落到 b = (3,1)
//   C34–G04      定理 1.3.1；例 7：两列共线，b 够不着；同济对照
//   D10–C41      总结
// 屏幕上的数字全部来自 math.json / tex.json（mathcheck.py 独立验算）。
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mlerp2 } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow, arcGuide, target, ring, eqLine } from '../../engine/la2d/plane.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'ds_shock', 'gpt_cross', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const fmt = v => String(v).replace('-', '−');

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const M = R.math; if (!M) throw new Error('缺 math.json');
  const S0 = M.systems.sys0, E7 = M.systems.ex7, V = M.vec.v, CB = M.combos[0], AD = M.adds[0];
  const A0 = S0.A, a1 = [A0[0][0], A0[1][0]], a2 = [A0[0][1], A0[1][1]], bb = S0.b, xs = S0.sol.map(Number);
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.3, C05: 0.5, C07: 0.7, C09: 0.3, C10: 0.7, D03: 0.3, C13: 0.7, C15: 0.3, C19: 0.6, C22: 0.7, D06: 0.4, C26: 0.3, C27: 0.4, C29: 0.8, C32: 0.3, C34: 0.7, C36: 0.4, G04: 0.4, D10: 0.6 },
    post: { C05: 0.5, C08: 0.4, C11: 0.4, C14: 0.5, C18: 0.4, C20: 0.6, C24: 0.6, C26: 0.5, C27: 0.4, C31: 0.6, C33: 0.6, C38: 0.4 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 40, oy: DY + 70, u: 96, R: 9 });

  const T = {
    old: cue('C01', '老朋友'),
    sys: cue('C02', '还记得'), sol: cue('C02', '它的解'),
    two: cue('C03', '两个数'), row: cue('C03', '横着写'), col: cue('C03', '竖着写'),
    rn: cue('C04', 'R n'), eu: cue('C04', '欧氏空间'), why: L('D02').s,
    pl: L('C05').s - 0.5, draw: cue('C05', '箭头'), rt: cue('C05', '向右走二'), up: cue('C05', '向上走一'),
    phy: cue('C06', '物理里'), calc: cue('C06', '算的时候'), sw: cue('C06', '切换'),
    nota: L('G01').s - 0.2, aij: cue('G01', 'a i j'), ajc: cue('G01', '第j列记作'),
    sc: L('C07').s - 0.5, x2: cue('C07', '乘以二'), neg: cue('C08', '乘以负一'), half: cue('C08', '二分之一'), scl: cue('C08', '标量'),
    hA: L('C09').s - 0.2, hA2: cue('C09', '二分之一乘A'),
    add: L('C10').s - 0.5, tail: cue('C10', '尾巴'), end: cue('C10', '直奔终点'), comp: cue('C11', '对应分量'), eq41: cue('C11', '等于四'),
    madd: L('D03').s - 0.2, same: cue('C12', '一样大'), zero: cue('G02', '零矩阵'), zneg: cue('G02', 'A加上'),
    lc: L('C13').s - 0.5, lcn: cue('C13', '线性组合'), st2: cue('C14', '先走两步'), st1: cue('C14', '再走一步'), arr: cue('C14', '到达'),
    eye: L('D04').s, vert: cue('C15', '竖着看'), c1: cue('C16', 'x一的系数'), c2: cue('C16', 'x二的系数'),
    sent: cue('C17', '一句话'), ask: cue('C18', '各取几倍'), ans: cue('C18', '答案是'), recipe: L('D05').s,
    rc: L('C19').s - 0.4, byRow: cue('C19', '按行看'), meet: cue('C19', '交点'), byCol: cue('C20', '按列看'), h2t: cue('C20', '首尾相接'),
    coord: cue('C21', '交点的坐标'), match: cue('C21', '配方里'),
    def: L('C22').s - 0.5, Am: cue('C22', '矩阵A'), xv: cue('C22', '向量x'), each: cue('C23', '每个分量'), sum: cue('C23', '全部加起来'), one: cue('C24', '一个式子'),
    rw: L('D06').s - 0.2, ith: cue('C25', '第i行'),
    c1r: L('C26').s - 0.2, terms: cue('C26', '六加二'), num: cue('C26', '得到一个数'),
    e3: L('C27').s - 0.2, e3r: cue('C27', '每一行'), e3a: cue('C27', '得到负二'), e3c: cue('C28', '按列再算'), same3: cue('C28', '一模一样'),
    sz: cue('G03', '尺寸'), szn: cue('G03', 'n个分量'), szm: cue('G03', 'm个分量'),
    gt: L('C29').s - 0.6, act: cue('C29', '动作'), move: cue('C29', '整个平面'),
    ih: cue('C30', 'i帽'), jh: cue('C30', 'j帽'), grid: cue('C31', '网格'), par: cue('C31', '平行'), o: cue('C31', '原点不动'),
    where: cue('C32', '落在哪'), steps: cue('C32', '两步i帽'), after: cue('C32', '变换后'), land: cue('C33', '正好落在'), who: cue('C33', '哪个x'), d7: L('D07').s,
    th: L('C34').s - 0.5, thn: cue('C34', '相容性定理'), iff: cue('C35', '当且仅当'), lcb: cue('C35', '线性组合'), when: L('D08').s,
    e7: L('C36').s - 0.4, e7c: cue('C36', '两列分别'), dbl: cue('C37', '两倍'), lineq: cue('C37', '同一条直线'),
    stuck: cue('C38', '跑不出'), boff: cue('C38', 'b等于'), none: cue('C39', '无解'), inc: cue('C39', '不相容'),
    par7: L('D09').s, both: L('C40').s, tj: L('G04').s - 0.2, tj4: cue('G04', '第四章'),
    end0: L('D10').s - 0.6, s1: cue('D10', '能缩放'), s2: cue('D10', 'A x就是'), s3: L('D11').s, next: cue('C41', '下一节'),
  };
  // 例 7 结束后，D09 的“平行线”画面持续到 C40 结束
  T.gtEnd = T.th;

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('swell', T.sys, 0.3); TL.sfx('check', T.sol + 0.4, 0.3);
  TL.sfx('pluck', T.row, 0.3); TL.sfx('pluck', T.col, 0.3); TL.sfx('bell_soft', T.rn, 0.3);
  TL.sfx('whoosh', T.pl, 0.35); TL.sfx('warp', T.draw, 0.3); TL.sfx('tick2', T.rt, 0.3); TL.sfx('tick2', T.up, 0.3); TL.sfx('shimmer', T.sw, 0.3);
  TL.sfx('swell', T.nota + 0.2, 0.3); TL.sfx('pop', T.ajc, 0.3);
  TL.sfx('whoosh', T.sc, 0.3); TL.sfx('warp', T.x2, 0.3); TL.sfx('warp', T.neg, 0.3); TL.sfx('warp', T.half, 0.3); TL.sfx('stamp', T.scl, 0.3); TL.sfx('pop', T.hA2, 0.3);
  TL.sfx('whoosh', T.add, 0.3); TL.sfx('marimba', T.tail, 0.3); TL.sfx('marimba_hi', T.end, 0.3); TL.sfx('check', T.eq41, 0.3);
  TL.sfx('swell', T.madd + 0.2, 0.3); TL.sfx('bell_soft', T.zero, 0.3);
  TL.sfx('whoosh', T.lc, 0.3); TL.sfx('marimba', T.st2, 0.3); TL.sfx('marimba_hi', T.st1, 0.3); TL.sfx('ding', T.arr, 0.3); TL.sfx('sting', T.eye + 0.2, 0.3);
  TL.sfx('warp', T.vert, 0.3); TL.sfx('pluck', T.c1, 0.3); TL.sfx('pluck', T.c2, 0.3); TL.sfx('stamp', T.ans, 0.3); TL.sfx('sparkle', T.recipe + 0.2, 0.3);
  TL.sfx('whoosh', T.rc, 0.3); TL.sfx('swell', T.byRow, 0.3); TL.sfx('ding', T.meet, 0.3); TL.sfx('swell', T.byCol, 0.3); TL.sfx('check', T.match, 0.3);
  TL.sfx('whoosh', T.def, 0.3); TL.sfx('pluck', T.each, 0.3); TL.sfx('stamp', T.one + 0.3, 0.35);
  TL.sfx('ding_lo', T.rw + 0.2, 0.25); [0, 1, 2, 3].forEach(i => TL.sfx(i % 2 ? 'marimba_hi' : 'marimba', T.terms + i * 0.35, 0.25)); TL.sfx('check', T.num, 0.3);
  TL.sfx('swell', T.e3, 0.3); TL.sfx('check', T.e3a, 0.3); TL.sfx('check', T.same3, 0.3); TL.sfx('bell_soft', T.sz, 0.3);
  TL.sfx('whoosh', T.gt, 0.35); TL.sfx('warp', T.move, 0.4); TL.sfx('ding', T.ih + 0.3, 0.3); TL.sfx('ding', T.jh + 0.3, 0.3); TL.sfx('shimmer', T.par, 0.3);
  TL.sfx('warp', T.after, 0.4); TL.sfx('stamp', T.land, 0.35); TL.sfx('sparkle', T.d7 + 0.2, 0.3);
  TL.sfx('whoosh', T.th, 0.3); TL.sfx('stamp', T.thn, 0.35); TL.sfx('ding', T.iff, 0.3);
  TL.sfx('whoosh', T.e7, 0.3); TL.sfx('swell', T.lineq, 0.3); TL.sfx('buzz', T.boff + 0.4, 0.25); TL.sfx('thud', T.none, 0.3); TL.sfx('pluck', T.par7, 0.3); TL.sfx('bell_soft', T.tj, 0.3);
  TL.sfx('whoosh', T.end0, 0.3); TL.sfx('check', T.s1, 0.3); TL.sfx('check', T.s2, 0.3); TL.sfx('check', T.s3, 0.3); TL.sfx('shimmer', L('C41').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const S = p => P.S(p, [[1, 0], [0, 1]]);
  const vlab = (p, text, opt, off = [16, -26]) => { const [x, y] = S(p); K.tag(text, x + off[0], y + off[1], opt); };
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  // 平面可见度：箭头段 / 网格变换 / 例 7
  const aVec = () => win(t, T.pl, T.nota, 0.6, 0.4) + win(t, T.sc, T.hA, 0.5, 0.4) + win(t, T.add, T.madd, 0.5, 0.4) + win(t, T.lc, T.def, 0.5, 0.5);
  const aGT = () => win(t, T.gt, T.th, 0.6, 0.5);
  const aE7 = () => win(t, T.e7, T.end0, 0.5, 0.5);

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').e - 0.2, L('C01').e + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.3 向量与 Ax'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'MATRIX × VECTOR', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    // 大圆里：一支箭头先亮个相
    const ea = a * smooth(prog(t, 0.9, 1.6)); if (ea > 0) { const g = smoother(prog(t, 1.0, 2.0)); arrow(ctx, [DX - 200, DY + 150], [DX + 200, DY - 60], { color: C.peri, width: 12, head: 40, grow: g, alpha: ea }); star4(ctx, DX - 200, DY + 150, 14 * g, C.ink, ea); }
  }

  // ── 开场：老朋友 → 行 / 列向量 → ℝⁿ ──
  function drawRecap() {
    const a0 = win(t, T.sys - 0.2, T.pl + 0.2, 0.4, 0.4); if (a0 <= 0) return;
    const nr = win(t, T.rn - 0.2, T.pl, 0.3, 0.3), a = a0 * (1 - nr);
    const up = smoother(prog(t, T.two - 0.4, T.two + 0.4));
    const y0 = lerp(DY - 70, DY - 250, up);
    texAt('sys0', DX, y0, 62, { alpha: a, reveal: prog(t, T.sys - 0.2, T.sys + 1.2) });
    if (t > T.sol - 0.2) texAt('sol0', DX, y0 + 140, 56, { alpha: a * (1 - 0.55 * up), reveal: prog(t, T.sol - 0.2, T.sol + 0.9), color: C.peri });
    // 两个数 → 行向量 / 列向量
    const ra = a * gin(T.row, 0.4), ca = a * gin(T.col, 0.4);
    if (ra > 0) { texAt('rowv', DX - 230, DY + 60, 64, { alpha: ra, reveal: prog(t, T.row - 0.1, T.row + 0.7) }); K.tag('行向量', DX - 230, DY + 150, { px: 34, a: ra, align: 'center', color: C.inkMid }); }
    if (ca > 0) { texAt('colv', DX + 230, DY + 60, 64, { alpha: ca, reveal: prog(t, T.col - 0.1, T.col + 0.7), color: C.peri }); K.tag('列向量（默认）', DX + 230, DY + 180, { px: 34, a: ca, align: 'center', color: C.peri }); }
    // ℝⁿ
    const na = a0 * nr;
    if (na > 0) {
      ctx.save(); ctx.globalAlpha = na * 0.92; ctx.fillStyle = C.disc; ctx.beginPath(); ctx.arc(DX, DY, DR - 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      texAt('Rn', DX, DY - 30, 64, { alpha: na, reveal: prog(t, T.rn - 0.2, T.rn + 1.0) });
      K.tag('n 维欧氏空间', DX, DY + 170, { px: 40, a: na * gin(T.eu), align: 'center', color: C.peri, font: F.serif, w: 900 });
      K.tag('（全体 n 个实数组成的列向量）', DX, DY + 228, { px: 28, a: na * gin(T.eu + 0.3), align: 'center', color: C.inkMid });
    }
  }

  // ── 平面底子 ──
  function drawGridBase(D, a, grow = 1) {
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.3, alpha: 0.2 * a, grow });
    P.axes(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 2.2, alpha: 0.55 * a, grow });
    ctx.restore();
  }

  // ── 箭头段（C05–D05、C19–C21） ──
  function drawVec(D) {
    const a = Math.min(1, aVec()); if (a <= 0.003) return;
    drawGridBase(D, a, smooth(prog(t, T.pl, T.pl + 1.2)));
    const O = S([0, 0]);
    // C05–C06：(2, 1)
    const va = a * win(t, T.draw - 0.2, T.nota, 0.3, 0.3);
    if (va > 0) {
      const tip = S(V);
      // 分解：右 2，上 1
      const hx = win(t, T.rt - 0.1, T.phy + 0.4, 0.2, 0.4), hy = win(t, T.up - 0.1, T.phy + 0.4, 0.2, 0.4);
      arrow(ctx, O, S([V[0], 0]), { color: C.i, width: 5, head: 18, grow: smoother(prog(t, T.rt - 0.1, T.rt + 0.6)), alpha: va * hx, dash: [12, 8] });
      arrow(ctx, S([V[0], 0]), tip, { color: C.j, width: 5, head: 18, grow: smoother(prog(t, T.up - 0.1, T.up + 0.5)), alpha: va * hy, dash: [12, 8] });
      vlab([V[0] / 2, 0], '右 2', { px: 30, a: va * hx, align: 'center', color: C.i }, [0, 30]);
      vlab([V[0], V[1] / 2], '上 1', { px: 30, a: va * hy, align: 'left', color: C.j }, [16, 0]);
      arrow(ctx, O, tip, { color: C.peri, width: 9, head: 30, grow: smoother(prog(t, T.draw - 0.1, T.draw + 0.8)) });
      ring(ctx, O, prog(t, T.draw - 0.2, T.draw + 0.6), { color: C.ink });
      // C06：箭头 ⇄ 一列数
      const ka = va * gin(T.calc, 0.4);
      if (ka > 0) { const [x, y] = tip; texAt('colv', x + 110, y - 70, 52, { alpha: ka, reveal: prog(t, T.calc - 0.1, T.calc + 0.6), color: C.peri }); arcGuide(ctx, [x + 20, y - 10], [x + 70, y - 60], { color: C.inkMid, grow: gin(T.calc + 0.2, 0.4), alpha: ka }); }
      K.tag('箭头 ⇄ 一列数', DX, DY - 360, { px: 40, a: va * gin(T.sw, 0.4), align: 'center', color: C.ink, font: F.serif, w: 900 });
    }
    // C07–C08：数乘
    const sa = a * win(t, T.sc + 0.2, T.hA, 0.3, 0.3);
    if (sa > 0) {
      const ks = [[T.x2, 2, '2v', C.peri], [T.neg, -1, '−v', C.free], [T.half, 0.5, '½v', C.j]];
      // 当前的缩放倍数在 1 → 2 → −1 → ½ 之间平滑过渡；旧的留虚影
      let k = 1, lab = 'v', col = C.ink;
      for (const [tk, kk, lb, cc] of ks) { const s = smoother(prog(t, tk, tk + 0.8)); if (s > 0) { k = lerp(k, kk, s); if (s > 0.5) { lab = lb; col = cc; } } }
      arrow(ctx, O, S(V), { color: C.mist, width: 6, head: 22, alpha: sa * 0.55, dash: [10, 8] });
      vlab(V, 'v', { px: 30, a: sa * 0.6, color: C.inkMid });
      arrow(ctx, O, S([V[0] * k, V[1] * k]), { color: col, width: 10, head: 32, alpha: sa });
      vlab([V[0] * k, V[1] * k], lab, { px: 40, a: sa, color: col, w: 900 }, k < 0 ? [-60, 30] : [18, -30]);
      K.tag(`× ${k < 0 ? '(−1)' : k === 0.5 ? '½' : fmt(Math.round(k * 10) / 10)}`, DX + 300, DY - 300, { px: 50, a: sa * gin(T.x2, 0.4), align: 'center', color: col, font: F.serif, w: 900 });
      K.tag('标量 = 缩放倍数', DX, DY - 380, { px: 36, a: sa * gin(T.scl, 0.4), align: 'center', color: C.ink, font: F.serif, w: 900 });
    }
    // C10–C11：加法
    const da = a * win(t, T.add + 0.2, T.madd, 0.3, 0.3);
    if (da > 0) {
      const u = AD.A.map(r => r[0]), v = AD.B.map(r => r[0]), w = AD.sum.map(r => r[0]);
      const g1 = smoother(prog(t, T.add + 0.3, T.add + 1.0)), g2 = smoother(prog(t, T.add + 0.8, T.add + 1.5));
      const mv = smoother(prog(t, T.tail - 0.1, T.tail + 0.9));
      arrow(ctx, O, S(u), { color: C.i, width: 9, head: 28, grow: g1, alpha: da });
      vlab(u, 'u', { px: 36, a: da * g1, color: C.i, w: 900 }, [-46, -10]);
      const vs = [lerp(0, u[0], mv), lerp(0, u[1], mv)];
      arrow(ctx, S(vs), S([vs[0] + v[0], vs[1] + v[1]]), { color: C.j, width: 9, head: 28, grow: g2, alpha: da });
      vlab([vs[0] + v[0] / 2, vs[1] + v[1] / 2], 'v', { px: 36, a: da * g2, color: C.j, w: 900 }, [18, -4]);
      if (mv > 0 && mv < 1) arrow(ctx, O, S(v), { color: C.j, width: 4, head: 16, alpha: da * 0.35 * (1 - mv), dash: [8, 8] });
      const ge = smoother(prog(t, T.end - 0.1, T.end + 0.7));
      arrow(ctx, O, S(w), { color: C.peri, width: 11, head: 34, grow: ge, alpha: da });
      vlab(w, 'u + v', { px: 38, a: da * ge, color: C.peri, w: 900 }, [18, 34]);
      if (t > T.comp - 0.2) texAt('addv', DX, DY - 330, 46, { alpha: da * gin(T.comp - 0.2, 0.4), reveal: prog(t, T.comp - 0.2, T.eq41 + 0.6), halo: C.disc });
    }
    // C13–D05：线性组合 2a₁ + 1a₂ = (3, 1)
    const la = a * win(t, T.lc + 0.2, T.rc + 0.2, 0.3, 0.4);
    if (la > 0) drawCombo(la, T.st2, T.st1, T.arr, true);
    // C19–C21：行图 → 列图
    const ra = a * win(t, T.rc + 0.3, T.def, 0.4, 0.5);
    if (ra > 0) {
      const toCol = smooth(prog(t, T.byCol - 0.3, T.byCol + 0.5));
      const lineA = ra * lerp(1, 0.3, toCol);
      ctx.save(); K.clip(D);
      eqLine(ctx, P, 1, 1, 3, { M: [[1, 0], [0, 1]], color: C.i, width: 5, alpha: lineA, grow: smoother(prog(t, T.byRow - 0.2, T.byRow + 0.8)) });
      eqLine(ctx, P, 1, -1, 1, { M: [[1, 0], [0, 1]], color: C.j, width: 5, alpha: lineA, grow: smoother(prog(t, T.byRow + 0.2, T.byRow + 1.0)) });
      ctx.restore();
      const X = S(xs); target(ctx, X, { color: C.ink, r: 14, s: gin(T.meet, 0.4), alpha: lineA });
      ring(ctx, X, prog(t, T.meet, T.meet + 0.8), { color: C.ink });
      vlab(xs, '交点 (2, 1)', { px: 32, a: lineA * gin(T.meet), color: C.ink, w: 900 }, [20, -30]);
      K.tag('按行看', DX - 320, DY - 330, { px: 40, a: ra * win(t, T.byRow - 0.2, T.byCol, 0.3, 0.3), align: 'center', color: C.ink, font: F.serif, w: 900 });
      K.tag('按列看', DX - 320, DY - 330, { px: 40, a: ra * gin(T.byCol, 0.4), align: 'center', color: C.peri, font: F.serif, w: 900 });
      if (toCol > 0) drawCombo(ra * toCol, T.byCol + 0.3, T.h2t, T.h2t + 0.6, false);
      // C21：两处的 2 和 1 同时闪
      const hl = ra * win(t, T.coord, T.def, 0.2, 0.3);
      if (hl > 0) {
        const pz = 1 + 0.25 * pulse(t, T.match, 0.6);
        vlab(xs, 'x₁ = 2, x₂ = 1', { px: 32 * pz, a: hl, color: C.peri, w: 900 }, [20, 34]);
        K.tag('坐标 = 配方', DX, DY - 380, { px: 40, a: hl * gin(T.match), align: 'center', color: C.peri, font: F.serif, w: 900 });
      }
    }
  }

  // 2·a₁ 再接 1·a₂ 到 (3, 1)
  function drawCombo(a, tA, tB, tC, labels) {
    const O = S([0, 0]), A2 = [a1[0] * CB.c[0], a1[1] * CB.c[0]], B = CB.result;
    const g0 = smooth(prog(t, tA - 0.9, tA - 0.3));
    // 原始的两列（单位倍）
    arrow(ctx, O, S(a1), { color: C.i, width: 6, head: 22, alpha: a * g0 * 0.7, grow: g0 });
    arrow(ctx, O, S(a2), { color: C.j, width: 6, head: 22, alpha: a * g0 * 0.7, grow: g0 });
    if (labels) { vlab(a1, '(1, 1)', { px: 28, a: a * g0, color: C.i }, [-100, -20]); vlab(a2, '(1, −1)', { px: 28, a: a * g0, color: C.j }, [-30, 34]); }
    const gA = smoother(prog(t, tA, tA + 0.8)), gB = smoother(prog(t, tB, tB + 0.7)), gC = smoother(prog(t, tC, tC + 0.5));
    arrow(ctx, O, S(A2), { color: C.i, width: 10, head: 30, grow: gA, alpha: a });
    vlab([A2[0] / 2, A2[1] / 2], '2 倍', { px: 32, a: a * gA, color: C.i, w: 900 }, [-90, -10]);
    arrow(ctx, S(A2), S(B), { color: C.j, width: 10, head: 30, grow: gB, alpha: a });
    vlab([(A2[0] + B[0]) / 2, (A2[1] + B[1]) / 2], '1 倍', { px: 32, a: a * gB, color: C.j, w: 900 }, [18, -14]);
    target(ctx, S(B), { color: C.peri, r: 15, s: gC, alpha: a });
    vlab(B, '(3, 1)', { px: 34, a: a * gC, color: C.peri, w: 900 }, [22, 30]);
    if (labels) {
      const ey = win(t, T.eye, T.vert, 0.2, 0.3);
      if (ey > 0) { ring(ctx, S(B), prog(t, T.eye + 0.1, T.eye + 0.9), { color: C.peri, r1: 70, width: 4 }); vlab(B, '= 方程组右边！', { px: 34, a: a * ey, color: C.free, w: 900 }, [22, 76]); }
    }
  }

  // ── 公式幕：½A、矩阵加法、零矩阵、记号 ──
  function drawTexActs() {
    // G01：记号
    let a = win(t, T.nota, T.sc, 0.4, 0.4);
    if (a > 0) {
      const pl = tex.place('Agen', DX, DY - 120, 50, 'c');
      tex.draw(ctx, pl, { alpha: a, reveal: prog(t, T.nota, T.nota + 1.2) });
      const hl = gin(T.ajc, 0.4);
      if (hl > 0) { tex.draw(ctx, pl, { alpha: a * hl, only: ['c'], force: C.peri }); const bx = tex.groupBox(pl, 'c'); if (bx) { ctx.save(); ctx.globalAlpha = a * hl; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.strokeRect(bx.x - bx.w / 2 - 14, bx.y - bx.h / 2 - 12, bx.w + 28, bx.h + 24); ctx.restore(); } }
      K.tag('aᵢⱼ：第 i 行、第 j 列', DX, DY + 130, { px: 38, a: a * gin(T.aij, 0.4), align: 'center', color: C.ink, w: 900 });
      if (t > T.ajc - 0.1) texAt('aj', DX, DY + 280, 42, { alpha: a * hl, reveal: prog(t, T.ajc, T.ajc + 0.9), color: C.peri });
    }
    // C09：½A
    a = win(t, T.hA, T.add, 0.4, 0.4);
    if (a > 0) {
      texAt('halfA', DX, DY - 40, 56, { alpha: a, reveal: prog(t, T.hA, T.hA2 + 1.2) });
      K.tag('每个元素都乘 ½', DX, DY + 140, { px: 38, a: a * gin(T.hA2 + 0.8), align: 'center', color: C.peri, font: F.serif, w: 900 });
    }
    // D03–G02：矩阵加法 → 零矩阵
    a = win(t, T.madd, T.lc, 0.4, 0.4);
    if (a > 0) {
      texAt('addM', DX, DY - 120, 46, { alpha: a, reveal: prog(t, L('C12').s - 0.2, L('C12').s + 1.4) });
      K.tag('两个 2 × 3 → 一样大才能加', DX, DY + 30, { px: 36, a: a * gin(T.same), align: 'center', color: C.peri, font: F.serif, w: 900 });
      if (t > T.zero - 0.2) { texAt('zeroM', DX, DY + 170, 60, { alpha: a * gin(T.zero - 0.2), reveal: prog(t, T.zneg - 0.3, T.zneg + 0.9), color: C.j }); K.tag('零矩阵 O：加上它什么都不变', DX, DY + 260, { px: 30, a: a * gin(T.zero), align: 'center', color: C.inkMid }); }
    }
  }

  // ── Ax 定义与行乘列 ──
  function drawAx() {
    let a = win(t, T.def, T.rw, 0.5, 0.4);
    if (a > 0) {
      const pl = tex.place('Asys', DX, DY - 200, 60, 'c');
      tex.draw(ctx, pl, { alpha: a, reveal: prog(t, T.def, T.def + 1.2) });
      // 标签 A / x / b
      const xA = pl.ox + pl.w * 0.2, xX = pl.ox + pl.w * 0.57, xB = pl.ox + pl.w * 0.9, yl = DY - 200 + pl.h / 2 + 34;
      K.tag('A', xA, yl, { px: 38, a: a * gin(T.Am), align: 'center', color: C.peri, w: 900 });
      K.tag('x', xX, yl, { px: 38, a: a * gin(T.xv), align: 'center', color: C.peri, w: 900 });
      K.tag('b', xB, yl, { px: 38, a: a * gin(T.xv + 0.4), align: 'center', color: C.peri, w: 900 });
      if (t > T.each - 0.2) texAt('AxDef', DX, DY + 20, 50, { alpha: a, reveal: prog(t, T.each - 0.2, T.sum + 0.6) });
      K.tag('x 的分量 × A 的对应列，再相加', DX, DY + 100, { px: 32, a: a * gin(T.sum), align: 'center', color: C.inkMid });
      if (t > T.one - 0.1) { const s = outBack(prog(t, T.one, T.one + 0.5)); texAt('Axb', DX, DY + 230, 90 * Math.max(0.5, s), { alpha: a * gin(T.one), color: C.peri }); }
    }
    // D06–C26：行乘列（Case 1）
    a = win(t, T.rw, T.e3, 0.4, 0.4);
    if (a > 0) {
      K.tag('行 × 列', DX, DY - 300, { px: 50, a: a, align: 'center', color: C.ink, font: F.serif, w: 900 });
      K.tag('第 i 行与 x 对应相乘再相加 = 结果的第 i 个数', DX, DY - 230, { px: 30, a: a * gin(T.ith), align: 'center', color: C.inkMid });
      if (t > T.c1r - 0.1) texAt('case1', DX - 90, DY - 20, 54, { alpha: a, reveal: prog(t, T.c1r, T.c1r + 1.2) });
      if (t > T.terms - 0.2) texAt('case1r', DX, DY + 210, 54, { alpha: a, reveal: prog(t, T.terms - 0.2, T.terms + 1.6), color: C.peri });
      // 配对连线（逐对亮起）
      const pr = clamp((t - T.terms) / 1.4);
      if (pr > 0 && pr < 1.2) K.tag(['2 × 3', '1 × 2', '(−3) × 1', '4 × (−2)'][Math.min(3, Math.floor(pr * 4))], DX + 330, DY - 20, { px: 36, a: a * win(t, T.terms, T.num, 0.2, 0.3), align: 'center', color: C.i, w: 900 });
      K.tag('→ 一个数', DX, DY + 300, { px: 38, a: a * gin(T.num), align: 'center', color: C.ink, font: F.serif, w: 900 });
    }
    // C27–G03：例 3，两种算法
    a = win(t, T.e3, T.gt, 0.4, 0.5);
    if (a > 0) {
      texAt('ex3', DX, DY - 170, 44, { alpha: a, reveal: prog(t, T.e3, T.e3a + 0.8) });
      K.tag('按行', DX - 420, DY - 300, { px: 32, a: a * gin(T.e3r), align: 'center', color: C.i, w: 900 });
      if (t > T.e3c - 0.2) { texAt('ex3c', DX, DY + 60, 44, { alpha: a, reveal: prog(t, T.e3c - 0.2, T.e3c + 1.4), color: C.ink }); K.tag('按列', DX - 420, DY - 60, { px: 32, a: a * gin(T.e3c), align: 'center', color: C.j, w: 900 }); }
      K.tag('一模一样 ✓', DX, DY + 190, { px: 38, a: a * gin(T.same3), align: 'center', color: C.j, font: F.serif, w: 900 });
      if (t > T.sz - 0.2) texAt('size', DX, DY + 320, 50, { alpha: a * gin(T.sz - 0.2), reveal: prog(t, T.sz - 0.2, T.szm + 0.6), color: C.peri });
    }
  }

  // ── 主画面：A 作为网格变换 ──
  function drawGT(D) {
    const a = Math.min(1, aGT()); if (a <= 0.003) return;
    const s = smoother(prog(t, T.move - 0.1, T.move + 2.4)), Mt = mlerp2(A0, s);
    // 变换前的 x 先摆好，等 C32 “变换后”再整体跟着动一次（倒回去再走）
    const back = smoother(prog(t, T.where - 0.3, T.where + 0.8)) * (1 - smoother(prog(t, T.after - 0.1, T.after + 2.0)));
    const Mx = mlerp2(A0, s * (1 - back));
    ctx.save(); K.clip(D);
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.14 * a, grow: smooth(prog(t, T.gt, T.gt + 1.2)) });
    P.grid(ctx, { M: Mx, color: C.gridNew, width: 2.2, alpha: 0.6 * a * (1 + 0.6 * pulse(t, T.par, 1.2)), grow: smooth(prog(t, T.gt + 0.3, T.gt + 1.5)) });
    P.axes(ctx, { M: Mx, color: C.ink, width: 3, alpha: 0.8 * a, grow: smooth(prog(t, T.gt + 0.3, T.gt + 1.5)) });
    ctx.restore();
    const O = P.S([0, 0], Mx), pi = P.S([1, 0], Mx), pj = P.S([0, 1], Mx);
    const ga = gin(T.gt + 1.0, 0.6);
    arrow(ctx, O, pi, { color: C.i, width: 9, head: 28, alpha: a * ga });
    arrow(ctx, O, pj, { color: C.j, width: 9, head: 28, alpha: a * ga });
    K.tag('î', pi[0] + 18, pi[1] - 26, { px: 40, a: a * ga, color: C.i, w: 900, font: F.serif });
    K.tag('ĵ', pj[0] - 44, pj[1] - 10, { px: 40, a: a * ga, color: C.j, w: 900, font: F.serif });
    // C30：落到哪一列
    const ci = a * win(t, T.ih + 0.4, T.where, 0.3, 0.3), cj = a * win(t, T.jh + 0.4, T.where, 0.3, 0.3);
    K.tag('第一列 (1, 1)', pi[0] + 20, pi[1] + 30, { px: 30, a: ci * (s > 0.95 ? 1 : 0), color: C.i, w: 900 });
    K.tag('第二列 (1, −1)', pj[0] + 20, pj[1] + 34, { px: 30, a: cj * (s > 0.95 ? 1 : 0), color: C.j, w: 900 });
    ring(ctx, pi, prog(t, T.ih + 0.3, T.ih + 1.1), { color: C.i }); ring(ctx, pj, prog(t, T.jh + 0.3, T.jh + 1.1), { color: C.j });
    // C31：原点不动
    ring(ctx, O, prog(t, T.o, T.o + 0.9), { color: C.ink, r1: 60 }); K.tag('原点不动', O[0] - 20, O[1] + 40, { px: 30, a: a * win(t, T.o, T.where, 0.3, 0.3), align: 'right', color: C.ink, w: 900 });
    // C32–C33：x = (2, 1) → b = (3, 1)
    const xa = a * gin(T.where, 0.4);
    if (xa > 0) {
      const p2 = P.S([xs[0], 0], Mx), px = P.S(xs, Mx);
      const st = win(t, T.steps - 0.1, T.d7 + 2, 0.3, 0.3);
      arrow(ctx, O, p2, { color: C.i, width: 6, head: 20, alpha: xa * st, dash: [12, 8], grow: smoother(prog(t, T.steps, T.steps + 0.7)) });
      arrow(ctx, p2, px, { color: C.j, width: 6, head: 20, alpha: xa * st, dash: [12, 8], grow: smoother(prog(t, T.steps + 0.5, T.steps + 1.1)) });
      arrow(ctx, O, px, { color: C.peri, width: 11, head: 34, alpha: xa });
      const done = smooth(prog(t, T.after + 1.6, T.after + 2.0));
      K.tag(done > 0.5 ? 'Ax = b = (3, 1)' : 'x = (2, 1)', px[0] + 22, px[1] - 30, { px: 34, a: xa, color: done > 0.5 ? C.peri : C.ink, w: 900 });
      if (done > 0) { target(ctx, P.S(bb, Mt), { color: C.peri, r: 18, s: done, alpha: a }); ring(ctx, P.S(bb, Mt), prog(t, T.land, T.land + 0.9), { color: C.peri, r1: 80, width: 4 }); }
      K.tag('2 î + 1 ĵ  →  2·第一列 + 1·第二列', DX, DY - 390, { px: 32, a: a * win(t, T.steps + 0.4, T.land, 0.3, 0.3), align: 'center', color: C.ink, w: 900 });
      K.tag('谁被 A 送到了 b？', DX, DY - 390, { px: 42, a: a * gin(T.who, 0.4), align: 'center', color: C.peri, font: F.serif, w: 900 });
    }
    // 右上角的 A
    texAt('Amat', DX + 300, DY - 300, 44, { alpha: a * gin(T.act, 0.5), halo: C.disc });
  }

  // ── 定理 1.3.1 ──
  function drawThm() {
    const a = win(t, T.th + 0.2, T.e7, 0.4, 0.4); if (a <= 0) return;
    K.tag('定理 1.3.1  相容性定理', DX, DY - 220, { px: 44, a: a * gin(T.thn - 0.4), align: 'center', color: C.peri, font: F.serif, w: 900 });
    if (t > L('C35').s - 0.2) texAt('thm', DX, DY - 40, 52, { alpha: a, reveal: prog(t, L('C35').s - 0.2, T.lcb + 0.8) });
    K.tag('有解', DX - 260, DY + 60, { px: 34, a: a * gin(T.iff - 0.6), align: 'center', color: C.inkMid });
    K.tag('b 是 A 各列的线性组合', DX + 190, DY + 60, { px: 34, a: a * gin(T.lcb), align: 'center', color: C.inkMid });
    K.tag('（consistent ⇔ b 能被列拼出来）', DX, DY + 170, { px: 30, a: a * gin(T.lcb + 0.6), align: 'center', color: C.inkMid });
  }

  // ── 例 7：够不着 ──
  function drawE7(D) {
    const a = Math.min(1, aE7()); if (a <= 0.003) return;
    drawGridBase(D, a, smooth(prog(t, T.e7, T.e7 + 1.0)));
    const O = S([0, 0]), c1 = E7.A.map(r => r[0]), c2 = E7.A.map(r => r[1]), b7 = E7.b;
    const rowV = smooth(prog(t, T.par7 - 0.2, T.par7 + 0.4)) * (1 - smooth(prog(t, T.both + 0.6, T.both + 1.4)));
    const colA = a * (1 - 0.8 * rowV);
    // 共线：整条直线
    ctx.save(); K.clip(D);
    P.line(ctx, [0, 0], [1 / Math.hypot(...c1), 2 / Math.hypot(...c1)], { M: [[1, 0], [0, 1]], color: C.peri, width: 14, alpha: colA * 0.28 * gin(T.lineq, 0.6), grow: smoother(prog(t, T.lineq, T.lineq + 1.0)) });
    // D09：按行看，两条平行线
    eqLine(ctx, P, 1, 2, 1, { M: [[1, 0], [0, 1]], color: C.i, width: 5, alpha: a * rowV });
    eqLine(ctx, P, 2, 4, 1, { M: [[1, 0], [0, 1]], color: C.j, width: 5, alpha: a * rowV });
    ctx.restore();
    const g1 = smoother(prog(t, T.e7c, T.e7c + 0.7)), g2 = smoother(prog(t, T.e7c + 0.6, T.e7c + 1.3));
    arrow(ctx, O, S(c2), { color: C.j, width: 8, head: 26, grow: g2, alpha: colA });
    arrow(ctx, O, S(c1), { color: C.i, width: 10, head: 30, grow: g1, alpha: colA });
    vlab(c1, '(1, 2)', { px: 30, a: colA * g1, color: C.i, w: 900 }, [-110, 0]);
    vlab(c2, '(2, 4) = 2 × (1, 2)', { px: 30, a: colA * g2, color: C.j, w: 900 }, [20, 0]);
    // C38：组合在线上来回滑，始终够不着 b
    const sl = win(t, T.stuck - 0.2, T.par7, 0.3, 0.3);
    if (sl > 0) {
      const k = 0.6 + 0.9 * Math.sin((t - T.stuck) * 1.5), p = [c1[0] * k, c1[1] * k];
      target(ctx, S(p), { color: C.peri, r: 12, s: 1, alpha: colA * sl });
      K.tag('所有组合都在这条线上', DX + 120, DY - 380, { px: 34, a: colA * sl, align: 'center', color: C.peri, w: 900 });
      if (t > T.boff) { const B = S(b7), Q = S(p); ctx.save(); ctx.globalAlpha = colA * sl * 0.7; ctx.strokeStyle = C.free; ctx.setLineDash([6, 8]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...Q); ctx.lineTo(...B); ctx.stroke(); ctx.restore(); }
    }
    const ba = a * gin(T.boff, 0.4);
    if (ba > 0) { target(ctx, S(b7), { color: C.free, r: 16, s: gin(T.boff, 0.4), alpha: ba }); vlab(b7, 'b = (1, 1)', { px: 32, a: ba, color: C.free, w: 900 }, [22, 8]); }
    const na = a * win(t, T.none, T.par7, 0.3, 0.3);
    if (na > 0) { const s = outBack(prog(t, T.none, T.none + 0.4)); K.tag('无解 ✗', DX - 200, DY + 330, { px: 56 * Math.max(0.6, s), a: na, align: 'center', color: C.free, font: F.serif, w: 900 }); }
    K.tag('按行：两条平行线，没有交点', DX, DY - 380, { px: 34, a: a * rowV, align: 'center', color: C.ink, w: 900 });
    K.tag('按列：够不着 b', DX, DY + 330, { px: 36, a: a * rowV, align: 'center', color: C.free, font: F.serif, w: 900 });
  }

  // ── 总结 ──
  function drawSum() {
    const a = smooth(prog(t, T.end0, T.end0 + 0.6)); if (a <= 0) return;
    texAt('AxDef', DX, DY - 150, 50, { alpha: a, reveal: prog(t, T.end0, T.end0 + 1.2) });
    K.tag('x = 配方，A 的列 = 原料', DX, DY - 50, { px: 36, a: a * gin(T.s2), align: 'center', color: C.peri, font: F.serif, w: 900 });
    texAt('Axb', DX, DY + 90, 72, { alpha: a * gin(T.s3), color: C.ink });
    K.tag('有解  ⇔  b 能被 A 的列拼出来', DX, DY + 190, { px: 36, a: a * gin(T.s3 + 0.3), align: 'center', color: C.j, font: F.serif, w: 900 });
    K.tag('下一节：矩阵 × 矩阵', DX, DY + 290, { px: 36, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  // ── 左栏 ──
  function drawLeft() {
    const sec = (t0, t1) => win(t, t0, t1, 0.3, 0.4);
    const H = (txt, t0, col) => K.head(txt, 210, 1, smooth(prog(t, t0, t0 + 0.6)), col);
    let a = sec(T.sys, T.pl);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('向量 = 一列数', T.sys);
      K.bullet('两个数，按顺序排好', 290, gin(T.two)); K.bullet('横着写：行向量', 350, gin(T.row)); K.bullet('竖着写：列向量', 410, gin(T.col), { color: C.peri });
      K.bullet('全体 → ℝⁿ', 470, gin(T.rn)); ctx.restore(); }
    a = sec(T.pl + 0.2, T.sc);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('向量 = 箭头', T.pl + 0.3);
      K.bullet('从原点出发', 290, gin(T.draw)); K.bullet('(2, 1)：右 2，上 1', 350, gin(T.rt)); K.bullet('箭头 ⇄ 一列数', 410, gin(T.sw), { color: C.peri });
      K.note('GPT · 记号', ['aᵢⱼ：第 i 行第 j 列的元素', 'aⱼ：A 的第 j 列（列向量）'], 450, gin(T.aij, 0.5)); ctx.restore(); }
    a = sec(T.sc + 0.2, T.add);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('第一件：数乘', T.sc + 0.3);
      K.bullet('× 2：拉长两倍', 290, gin(T.x2)); K.bullet('× (−1)：掉头', 350, gin(T.neg), { mark: C.free }); K.bullet('× ½：缩成一半', 410, gin(T.half), { mark: C.j });
      K.bullet('矩阵：每个元素都乘', 480, gin(T.hA), { color: C.peri }); ctx.restore(); }
    a = sec(T.add + 0.2, T.lc);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('第二件：加法', T.add + 0.3);
      K.bullet('首尾相接', 290, gin(T.tail)); K.bullet('对应分量相加', 350, gin(T.comp)); K.bullet('矩阵：一样大才能加', 410, gin(T.same), { color: C.peri });
      K.note('GPT · 零矩阵', ['A + O = A', 'A + (−1)A = O'], 450, gin(T.zero, 0.5)); ctx.restore(); }
    a = sec(T.lc + 0.2, T.rc);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('线性组合', T.lc + 0.3);
      K.bullet('先缩放，再相加', 290, gin(T.lcn));
      if (t > T.vert - 0.1) texAt('colform', LX, 380, 36, { alpha: a * gin(T.vert), reveal: prog(t, T.c1, T.sent + 1.2) }, 'l');
      if (t > T.ans - 0.2) texAt('combo', LX, 490, 36, { alpha: a * gin(T.ans - 0.2), cls: {}, color: C.peri }, 'l');
      K.bullet('解 = 配方', 580, gin(T.recipe), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.rc + 0.3, T.def);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('同一个方程组，两种看法', T.rc + 0.4);
      K.bullet('按行：直线的交点', 290, gin(T.byRow)); K.bullet('按列：箭头首尾相接', 350, gin(T.byCol), { color: C.peri }); K.bullet('交点坐标 = 配方', 410, gin(T.coord), { color: C.j, mark: C.j }); ctx.restore(); }
    a = sec(T.def + 0.2, T.rw);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('定义：A 乘 x', T.def + 0.3);
      K.bullet('系数 → 矩阵 A', 290, gin(T.Am)); K.bullet('未知数 → 向量 x', 350, gin(T.xv)); K.bullet('x 的分量 × A 的列', 410, gin(T.each)); K.bullet('全部加起来', 470, gin(T.sum));
      K.bullet('方程组 = Ax = b', 540, gin(T.one), { color: C.peri }); ctx.restore(); }
    a = sec(T.rw + 0.2, T.gt);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('另一种算法：行乘列', T.rw + 0.3);
      K.bullet('第 i 行 · x = 第 i 个数', 290, gin(T.ith)); K.bullet('按列算：结果一样', 350, gin(T.e3c), { color: C.j, mark: C.j });
      K.note('GPT · 尺寸', ['A：m 行 n 列', 'x：n 个分量  →  Ax：m 个分量'], 410, gin(T.sz, 0.5)); ctx.restore(); }
    a = sec(T.gt + 0.2, T.th);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('A = 一个动作', T.gt + 0.3);
      K.bullet('î → A 的第一列', 290, gin(T.ih), { mark: C.i }); K.bullet('ĵ → A 的第二列', 350, gin(T.jh), { mark: C.j });
      K.bullet('格线平行、等距', 410, gin(T.par)); K.bullet('原点不动', 470, gin(T.o));
      K.bullet('Ax = b：谁被送到 b？', 540, gin(T.who), { color: C.peri }); ctx.restore(); }
    a = sec(T.th + 0.2, T.e7);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('定理 1.3.1', T.thn, C.peri);
      K.bullet('Ax = b 有解', 290, gin(T.iff - 0.5)); K.bullet('⇔ b 是 A 的列的线性组合', 350, gin(T.lcb), { px: 32, color: C.peri }); ctx.restore(); }
    a = sec(T.e7 + 0.2, T.end0);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('例 7：够不着', T.e7 + 0.3);
      if (t > T.e7 - 0.1) texAt('ex7', LX, 300, 38, { alpha: a, reveal: prog(t, T.e7, T.e7 + 1.0) }, 'l');
      const lift = gin(T.tj, 0.5);
      if (lift < 1) { ctx.save(); ctx.globalAlpha *= 1 - lift;
        K.bullet('第二列 = 2 × 第一列', 390, gin(T.dbl)); K.bullet('组合跑不出这条线', 450, gin(T.stuck)); K.bullet('b = (1, 1) 不在线上 → 无解', 510, gin(T.none), { px: 32, color: C.free, mark: C.free }); ctx.restore(); }
      K.note('同济第六版 · 对照', ['第二章：先用“行乘列”定义乘法', 'y = Ax 叫线性变换', '第四章：b 能由列线性表示'], 380, lift); ctx.restore(); }
    a = smooth(prog(t, T.end0, T.end0 + 0.5));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; H('一句话', T.end0);
      K.bullet('向量：能缩放，能相加', 290, gin(T.s1)); K.bullet('Ax：用 x 组合 A 的列', 350, gin(T.s2), { color: C.peri }); K.bullet('有解 ⇔ b 能被列拼出', 410, gin(T.s3), { color: C.j, mark: C.j }); ctx.restore(); }
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 1.3', prog(t, 0.2, 1.3));
    drawTitle(); drawRecap(); drawVec(D); drawTexActs(); drawAx(); drawGT(D); drawThm(); drawE7(D); drawSum();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
