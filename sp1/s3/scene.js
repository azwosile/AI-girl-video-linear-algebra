// 特别篇 1 · 第 3 段：列向量什么时候“塌”进平面（2024–25 第 2′ 题，12 分）+ 2025–26 第 2 题回看卡。
// 分镜：原题三步（角标“本卷两个第 2 题”）→ a₁ a₂ a₃ b 四根列上屏 → 两问 → 消元板（r₂+r₁、r₃−2r₁、r₃+r₂）
//       → 主元对角圈 + det = 6(α+2) 计数器 → 大肥鱼“两边一除”被红叉 → 先讨论 = 0 警示
//       → 第一问结论 + 两条路分屏 → 评分点链 → 第二问 α=−2, β=−1 → 通解逐行
//       → 3D：a₁ a₂ 张成平面，a₃ 随 α 上下，α=−2 被“吸”进平面（闪光 + 咔哒）；b 随 β 落入平面
//       → 回看卡（最新卷第 2 题）→ 两年临界值对照。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba, load3D } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_happy', 'ds_proud', 'ds_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_q2', 'y2526_q2']);
  const B = base(R, {
    assets, label: '特别篇 1 · 方程组与参数讨论', title: '列向量塌进平面', hi: 3, en: '2024–25 · Q2′ · 12 PTS',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C05: 0.6, C09: 0.4, C11: 0.6, C15: 1.0, C20: 0.8 },
    post: { C02: 1.2, C03: 1.2, C05: 1.0, C06: 1.6, C07: 1.6, G01: 1.6, G02: 1.0, C08: 1.4, C09: 1.4, C10: 1.2, G03: 1.2, C11: 1.4, C13: 1.2, C14: 1.6, C16: 1.6, C17: 2.0, C18: 2.0, C19: 1.4, D03: 1.2, C21: 1.4, G04: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const P3 = new (await load3D())(900, { R: 3, nPlanes: 1, nLines: 1, nPoints: 2 });

  const S = [
    [[1, 2, 1, 1], [-1, 4, 3, 2], [2, -2, 'α', 'β']],
    [[1, 2, 1, 1], [0, 6, 4, 3], [2, -2, 'α', 'β']],
    [[1, 2, 1, 1], [0, 6, 4, 3], [0, -6, 'α−2', 'β−2']],
    [[1, 2, 1, 1], [0, 6, 4, 3], [0, 0, 'α+2', 'β+1']],
  ];
  const T = [0, s('C06') + 0.3, cue('C06', '第三行减去'), s('C07') + 0.2];
  const OPS = [null, [[1, 'r₂ + r₁']], [[2, 'r₃ − 2r₁']], [[2, 'r₃ + r₂']]];
  const tDiv = s('D02'), tWhy = s('G02');

  // ── 音效 ──
  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('pop', cue('C01', '两个第二题'), 0.25);
  ['a一等于', 'a二等于', 'a三等于', '右边的b'].forEach(w => TL.sfx('pluck', cue('C02', w), 0.28));
  TL.sfx('tick', cue('C03', '第一问'), 0.3); TL.sfx('tick', cue('C03', '第二问'), 0.3);
  TL.sfx('ding_hi', cue('C04', '构成基'), 0.3);
  [1, 2, 3].forEach(k => { TL.sfx('swoosh_soft', T[k], 0.25); TL.sfx('marimba', T[k] + 0.4, 0.22); });
  TL.sfx('impact', T[3] + 0.6, 0.3);
  [0, 1, 2].forEach(k => TL.sfx('tick2', cue('G01', '一乘六乘') + k * 0.4, 0.3)); TL.sfx('ding', cue('G01', '等于六倍'), 0.3);
  TL.sfx('pop', tDiv + 0.2, 0.25); TL.sfx('slam', tWhy + 0.1, 0.3); TL.sfx('buzz', tWhy + 0.3, 0.25);
  TL.sfx('sting', cue('C08', '等于零的那一支'), 0.3);
  TL.sfx('check', cue('C09', '所以阿尔法不等于负二'), 0.3);
  TL.sfx('swoosh_soft', s('C10') + 0.2, 0.3); TL.sfx('zap', s('G03') + 0.3, 0.25);
  TL.sfx('ding_hi', cue('C11', '阿尔法等于负二'), 0.3);
  TL.sfx('tick2', cue('C12', '令x三等于三s'), 0.3); TL.sfx('tick2', cue('C13', '代进去'), 0.3); TL.sfx('impact', s('C14') + 0.2, 0.3);
  TL.sfx('hum', s('C15') - 0.6, 0.25); TL.sfx('crack', cue('C17', '吸进了平面'), 0.35); TL.sfx('impact', cue('C17', '吸进了平面') + 0.1, 0.25);
  TL.sfx('shimmer', cue('C18', '正好落进平面'), 0.35); TL.sfx('sparkle', s('D03') + 0.2, 0.3);
  TL.sfx('swoosh_in', s('C20') + 0.2, 0.3); TL.sfx('stamp', cue('C21', '完整过程'), 0.25);
  TL.sfx('ding_lo', cue('G04', '负二'), 0.3); TL.sfx('ding_hi', cue('G04', '一个是八'), 0.3);

  // ════ 1. 四根列 + 两问 ════
  function colVec(x, y, v, lab, col, a) {
    K.cvec(x, y, v, a, { px: 32, col }); ctag(lab, x, y - 100, { px: 30, a, color: col, font: F.serif });
  }
  function shotCols() {
    const a = B.win(s('C02'), s('C05') - 0.2); if (a <= 0) return;
    B.qhead('2024–2025 期中 · 第 2′ 题 · 12 分', a);
    colVec(DX - 300, DY - 160, [1, '−1', 2], 'a₁', C.i, a * gin(cue('C02', 'a一等于')));
    colVec(DX - 150, DY - 160, [2, 4, '−2'], 'a₂', C.j, a * gin(cue('C02', 'a二等于')));
    colVec(DX, DY - 160, [1, 3, 'α'], 'a₃', C.free, a * gin(cue('C02', 'a三等于')));
    colVec(DX + 200, DY - 160, [1, 2, 'β'], 'b', C.peri, a * gin(cue('C02', '右边的b')));
    const g1 = a * gin(cue('C03', '第一问')), g2 = a * gin(cue('C03', '第二问'));
    B.xcard('① α = ? 时 a₁, a₂, a₃ 构成 ℝ³ 的基', DX, DY + 60, 760, 70, g1, C.i, 30);
    B.xcard('② α, β = ? 时 Ax = b 有无穷多解', DX, DY + 150, 760, 70, g2, C.peri, 30);
    const gc = a * gin(cue('C04', '构成基'));
    K.redStamp('列的角度', DX + 260, DY + 280, prog(B.t, cue('C04', '构成基'), cue('C04', '构成基') + 0.5), gc, C.j, 36);
  }

  // ════ 2. 消元 + det + 讨论 ════
  function shotElim() {
    const a = B.win(s('C05'), s('C15') - 0.3); if (a <= 0) return;
    const { M } = K.steps(S, T, OPS, { x: DX + 60, y: DY - 230, px: 36, bar: 3, a, hi: (i, j) => (i === 2 && j >= 2) ? C.peri : null });
    const gM = a * gin(s('C05')); ctag('[A | b]', DX + 60 - M.w / 2 - 170, DY - 230, { px: 28, a: gM * (1 - gin(T[1] - 0.4)), color: C.inkMid, font: F.serif });
    // det
    const gd = a * B.win(s('G01'), s('C11') - 0.2);
    if (gd > 0) {
      [[0, 0], [1, 1], [2, 2]].forEach(([i, j], q) => K.ring(...M.cell(i, j), 30, C.i, gd, prog(B.t, cue('G01', '一乘六乘') + q * 0.4, cue('G01', '一乘六乘') + 0.5 + q * 0.4)));
      ctag('没换行、没倍乘 ⇒ det A = 主元之积', DX + 60, DY - 60, { px: 28, a: gd * gin(s('G01') + 0.3), color: C.inkMid });
      ctag('det A = 1 · 6 · (α + 2) = 6(α + 2)', DX + 60, DY, { px: 38, a: gd * gin(cue('G01', '一乘六乘')), color: C.i, font: F.serif });
    }
    // 大肥鱼：两边一除 → 红叉
    const gD = a * B.win(tDiv, s('C09') - 0.1);
    if (gD > 0) {
      ctag('x₃ = (β + 1) / (α + 2)', DX + 60, DY + 110, { px: 40, a: gD, color: C.ds, font: F.serif });
      B.cross(DX + 140, DY + 110, prog(B.t, tWhy + 0.1, tWhy + 0.5), gD, 60);
      K.glitch(tWhy, tWhy + 0.4, 0.4);
      const gw = gD * gin(cue('C08', '必须先讨论'));
      B.card(DX + 60, DY + 230, 820, 90, gw * 0.95, C.free);
      ctag('除以含参式子之前：先问它 = 0 吗？', DX + 60, DY + 215, { px: 30, a: gw, color: C.free });
      ctag('= 0 的那一支，才是题目真正想考的', DX + 60, DY + 252, { px: 24, a: gw * gin(cue('C08', '等于零的那一支')), color: C.ink });
    }
    // 第一问结论 + 两条路
    const g1 = a * B.win(s('C09'), s('C11') - 0.2);
    if (g1 > 0) {
      ctag('构成基 ⇔ A 可逆 ⇔ det A ≠ 0', DX + 60, DY + 110, { px: 34, a: g1, font: F.serif });
      B.xcard('① α ≠ −2', DX + 60, DY + 190, 340, 76, g1 * gin(cue('C09', '所以阿尔法不等于负二')), OK, 40, OK);
      const g2 = g1 * gin(s('C10'));
      B.xcard('路 A：按第一列展开 → 6(α+2)', DX - 160, DY + 300, 420, 64, g2, C.inkMid, 24);
      B.xcard('路 B：消元，主元相乘 → 6(α+2)', DX + 280, DY + 300, 420, 64, g2 * gin(cue('C10', '但第二问')), C.i, 24);
      const gG = g1 * gin(s('G03'));
      B.card(DX + 60, DY + 110, 820, 70, gG, C.gpt);
      ctag('评分点：写出“基 ⇔ 线性无关 ⇔ det ≠ 0”', DX + 60, DY + 110, { px: 30, a: gG, color: C.gpt });
    }
    // 第二问 + 通解
    const g3 = a * B.win(s('C11'), s('C15') - 0.3);
    if (g3 > 0) {
      ctag('末行 0 = 0：α + 2 = 0 且 β + 1 = 0', DX + 60, DY - 80, { px: 32, a: g3, font: F.serif });
      B.xcard('② α = −2，β = −1', DX + 60, DY - 10, 420, 72, g3 * gin(cue('C11', '阿尔法等于负二')), OK, 38, OK);
      K.type('6x₂ + 4x₃ = 3，令 x₃ = 3s ⇒ x₂ = ½ − 2s', DX - 360, DY + 90, cue('C12', '令x三等于三s'), 1.6, g3, { px: 30 });
      K.type('x₁ = 1 − (1 − 4s) − 3s = s', DX - 360, DY + 150, cue('C13', '代进去'), 1.2, g3, { px: 30 });
      const gv = g3 * gin(s('C14'));
      ctag('x =', DX - 160, DY + 270, { px: 36, a: gv, font: F.serif });
      K.cvec(DX - 70, DY + 270, [0, '½', 0], gv, { px: 30 });
      ctag('+ s', DX + 20, DY + 270, { px: 36, a: gv, color: C.free, font: F.serif });
      K.cvec(DX + 110, DY + 270, [1, '−2', 3], gv, { px: 30, col: C.free });
      B.burst(DX + 20, DY + 270, s('C14') + 0.3, C.free, { r1: 220 });
    }
  }

  // ════ 3. 3D：列塌进平面 ════
  const SC = 0.42;
  const alOf = t => { const t1 = cue('C17', '阿尔法等于负二'); const w = 2 + 1.6 * Math.sin((t - s('C16')) * 1.6) * smooth(prog(t, s('C16'), s('C16') + 1)); return t < t1 - 1.5 ? w : lerp(w, -2, smoother(prog(t, t1 - 1.5, t1))); };
  const beOf = t => lerp(2.5, -1, smoother(prog(t, cue('C18', '拖动贝塔'), cue('C18', '正好落进平面'))));
  function shotCol3D(D) {
    const a = B.win(s('C15') - 0.4, s('C20') - 0.3); if (a <= 0) return;
    const al = alOf(B.t), be = beOf(B.t), inA = Math.abs(al + 2) < 0.03, inB = Math.abs(be + 1) < 0.03;
    const a1 = [1, -1, 2], a2 = [2, 4, -2], a3 = [1, 3, al], b = [1, 2, be], sc = v => v.map(x => x * SC);
    P3.reset();
    P3.setPlane(0, [-1, 1, 1], { color: C.j, alpha: 0.26, scale: 1.0 * outCubic(prog(B.t, cue('C15', '张成一张平面'), cue('C15', '张成一张平面') + 1)) });
    const V = B.show3D(P3, D, a, { el: 18, az: -30 + (B.t - s('C15')) * 3, dist: 13, axesA: 0.35, floorA: 0.12 });
    const O = [0, 0, 0];
    V.v3(O, sc(a1), { color: C.i, alpha: a * gin(s('C15') + 0.6) }); V.lab(sc(a1).map(x => x * 1.15), 'a₁', { px: 28, a: a * gin(s('C15') + 0.6), color: C.i });
    V.v3(O, sc(a2), { color: C.j, alpha: a * gin(s('C15') + 1.0) }); V.lab(sc(a2).map(x => x * 1.15), 'a₂', { px: 28, a: a * gin(s('C15') + 1.0), color: C.j });
    const g3 = a * gin(s('C16'));
    V.v3(O, sc(a3), { color: C.free, alpha: g3, width: inA ? 10 : 7 }); V.lab(sc(a3).map(x => x * 1.12), `a₃ (α = ${al.toFixed(1).replace('-', '−')})`, { px: 26, a: g3, color: C.free });
    const tSnap = cue('C17', '吸进了平面');
    if (inA) { B.flash(tSnap, 0.3); B.burst(...V.pr(sc(a3)), tSnap, C.free, { r1: 160 }); }
    const gb = a * gin(s('C18'));
    V.v3(O, sc(b), { color: C.peri, alpha: gb, width: inB ? 10 : 6 }); V.lab(sc(b).map(x => x * 1.15), `b (β = ${be.toFixed(1).replace('-', '−')})`, { px: 26, a: gb, color: C.peri });
    if (inB) B.burst(...V.pr(sc(b)), cue('C18', '正好落进平面'), C.peri, { r1: 140 });
    // 说明
    ctag('Ax = x₁a₁ + x₂a₂ + x₃a₃', DX, DY - 380, { px: 30, a: a * B.win(s('C15'), s('C17')), color: C.ink, font: F.serif });
    ctag('α = −2：a₃ = (2a₂ − a₁)/3  → 三根塌成一张平面', DX, DY - 380, { px: 28, a: a * B.win(tSnap, s('C18')), color: C.free, font: F.serif });
    ctag('β = −1：b = ½ a₂ 落进平面', DX, DY - 380, { px: 30, a: a * B.win(cue('C18', '正好落进平面'), s('C19')), color: C.peri, font: F.serif });
    ctag('a₁ − 2a₂ + 3a₃ = 0  ↔  通解方向 (1, −2, 3)', DX, DY - 380, { px: 28, a: a * gin(cue('C19', '正是a一')), color: C.i, font: F.serif });
    const gd = a * gin(s('D03'));
    K.pill('不是基  ⇔  可能无穷多解', DX, DY + 390, C.i, gd, 30);
  }

  // ════ 4. 回看卡 ════
  function shotReview() {
    const a = B.win(s('C20') + 3.2, 1e9); if (a <= 0) return;
    const tA = cue('C21', '负二倍'), gA = a * gin(tA);
    B.card(DX + 40, DY + 40, 860, 300, a * 0.95, C.i);
    ctag('回看卡 · 2025–26 第 2 题', DX + 40, DY - 80, { px: 28, a, color: C.i });
    ctag('det A = −2(α − 8)', DX + 40, DY - 20, { px: 36, a: gA, color: C.i, font: F.serif });
    ctag('α ≠ 8：张成 ℝ³', DX + 40, DY + 40, { px: 30, a: a * gin(cue('C21', '不等于八时')), color: OK, font: F.serif });
    ctag('α = 8 且 β = 1：无穷多解', DX + 40, DY + 90, { px: 30, a: a * gin(cue('C21', '等于八并且')), color: OK, font: F.serif });
    ctag('完整讲解 → 第 1 章复习（下）', DX + 40, DY + 150, { px: 26, a: a * gin(cue('C21', '完整过程')), color: C.peri });
    const gG = a * gin(s('G04'));
    if (gG > 0) {
      [['24–25', '−2', C.free], ['25–26', '8', C.i]].forEach(([y, v, col], k) => {
        const x = DX - 140 + k * 360; K.pill(y, x, DY + 260, col, gG, 24);
        ctag('临界值 ' + v, x, DY + 320, { px: 34, a: gG * gin(cue('G04', k ? '一个是八' : '负二')), color: col, font: F.serif });
      });
      ctag('先用 det 找临界值 → 再代回增广矩阵看末行', DX + 40, DY + 390, { px: 26, a: gG * gin(cue('G04', '考场上')), color: C.ink });
    }
  }

  function draw(t) {
    B.frame(t, (D) => {
      shotCols(); shotElim(); shotCol3D(D); shotReview();
      B.paper(EX, 'y2425_q2', { t0: s('C01') + 0.2, dock: s('C02'), out: s('C15') - 0.6 });
      B.paper(EX, 'y2526_q2', { t0: s('C20') + 0.2, dock: s('C20') + 3.2, out: s('G04') + 0.5 });
    });
  }
  return { TL, draw };
}
