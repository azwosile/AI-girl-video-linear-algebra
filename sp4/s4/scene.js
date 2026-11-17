// 特别篇 4 · 第 4 段：数向量的相关性——三把刀（2015–16 第 2 题；2017–18 第 6 题 = 2023–24 第 4 题；2018–19 第 9 题；2020–21 第 6 题）。
// 分镜：三张判法卡 → 刀①：4 个 ℝ³ 向量，1 秒 → v₄ = 2v₂ + v₃ → 刀②（关系）：x₁、x₂、x₃，两份纸卡并排打勾
//       → 解 c₁、c₂，第三分量验证 → 3D：x₁、x₂ 张平面，x₃ 落进平面，法向量 (7,1,−5) 竖起 → 方程 7x + y − 5z = 0 → 评分点
//       → 刀③：ℝ⁴ 四向量消元，后两行归零 → rank 2 → 2020–21 含参：a 滑块拖到 6 第三行归零 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba, load3D } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_happy', 'gpt_cross', 'gpt_point', 'gpt_think'] };

export async function setup(R) {
  const EX = await loadExam(['y1516_q2', 'y1718_q6', 'y2324_q4', 'y1819_q9', 'y2021_q6']);
  const P3 = new (await load3D())(900, { R: 3, nPlanes: 1, nLines: 4, nPoints: 1 });
  const B = base(R, {
    assets, label: '特别篇 4 · 向量空间与子空间', title: '数向量的相关性：三把刀', hi: 4, en: 'THREE KNIVES FOR DEPENDENCE',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.6, C04: 0.8, C10: 0.8, C12: 0.8, C15: 0.6 },
    post: { C01: 1.6, C02: 1.4, C03: 1.4, G01: 1.6, C04: 1.4, C05: 1.4, C06: 2.0, C07: 1.8, C08: 2.4, C09: 1.8, G02: 1.4, C10: 1.6, C11: 2.0, G03: 1.4, C12: 1.2, C13: 2.0, C14: 1.8, D01: 0.8, C15: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const KN = [['① 个数 > 维数 → 相关', '直接相关'], ['② 方阵 → 看 det', '看行列式'], ['③ 否则 → 消元看秩', '消元看秩']];
  KN.forEach(([, w]) => TL.sfx('slam', cue('C01', w), 0.28));
  TL.sfx('whoosh', s('C02') + 0.2, 0.3); TL.sfx('ding_hi', cue('C03', '必然相关'), 0.32); TL.sfx('check', s('G01') + 0.4, 0.28);
  TL.sfx('whoosh', s('C04') + 0.2, 0.3); TL.sfx('check', cue('C04', '考了两次'), 0.3); ['证明三个向量相关', '证明x一、x二无关', '求它们张成空间的维数', '描述它的几何意义'].forEach(w => TL.sfx('tick', cue('C05', w), 0.22));
  TL.sfx('type', cue('C06', '解出'), 0.25); TL.sfx('check', cue('C06', '对'), 0.3); TL.sfx('ding', cue('C07', '所以相关'), 0.3);
  TL.sfx('hum', s('C08') + 0.2, 0.22); TL.sfx('thud', cue('C08', 'x三正好躺在里面'), 0.32); TL.sfx('riser', cue('C08', '法向量用叉积'), 0.22); TL.sfx('impact', cue('C09', '七x加y减五z'), 0.3); TL.sfx('check', cue('C09', '等于零'), 0.3);
  TL.sfx('zap', s('G02') + 0.3, 0.25);
  TL.sfx('whoosh', s('C10') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C10', '消元看秩'), 0.25); TL.sfx('crack', s('C11') + 0.3, 0.3); TL.sfx('ding_hi', cue('C11', '秩是二'), 0.3);
  TL.sfx('whoosh', s('C12') + 0.2, 0.3); ['得到零、负一、一、二', '得到零、负三、三、a', '得到零、零、零、a减六'].forEach(w => TL.sfx('marimba', cue('C13', w), 0.22));
  TL.sfx('warp', s('C14') + 0.2, 0.25); TL.sfx('impact', cue('C14', 'a等于六'), 0.32); TL.sfx('sparkle', s('D01') + 0.2, 0.25); TL.sfx('swell', s('C15') - 0.2, 0.3);

  function shotKnives() {
    const a = B.win(s('C01'), s('C02') + 0.6); if (a <= 0) return;
    KN.forEach(([tx, w], k) => { const t0 = cue('C01', w), u = outBack(prog(B.t, t0, t0 + 0.4), 2);
      B.xcard(tx, DX - 380 + k * 380, DY + lerp(-200, 0, u), 340, 120, a * gin(t0), [C.peri, C.i, C.j][k], 28, [C.peri, C.i, C.j][k]); });
  }

  function shotK1() {
    const a = B.win(s('C02') + 0.6, s('C04') - 0.3); if (a <= 0) return;
    B.qhead('2015–16 · 第 2 题：ℝ³ 中四个向量，无关吗？', a);
    const V = [[1, 0, 0], [0, 1, 1], [1, 0, 1], [1, 2, 3]];
    V.forEach((v, k) => { K.cvec(DX - 330 + k * 220, DY - 140, v, a * gin(s('C02') + 1 + k * 0.4), { px: 34, col: [C.peri, C.i, C.j, C.k][k] }); ctag('v' + '₁₂₃₄'[k], DX - 330 + k * 220, DY - 250, { px: 28, a: a * gin(s('C02') + 1 + k * 0.4), color: [C.peri, C.i, C.j, C.k][k], font: F.serif }); });
    ctag('4 > 3 = dim ℝ³ ⇒ 必然相关', DX, DY + 30, { px: 44, a: a * gin(cue('C03', '四个')), color: OK, font: F.serif });
    K.pill('1 秒', DX + 380, DY + 30, C.i, a * gin(cue('C03', '一秒钟')), 30);
    const gG = a * gin(s('G01'));
    B.card(DX, DY + 190, 860, 90, gG * 0.95, C.gpt); ctag('关系：v₄ = 2v₂ + v₃ = (0,2,2) + (1,0,1) = (1,2,3)', DX, DY + 190, { px: 28, a: gG, color: C.gpt, font: F.serif });
  }

  function shotK2(D) {
    const a = B.win(s('C04') + 0.4, s('C10') - 0.3); if (a <= 0) return;
    const g3 = a * gin(s('C08'));
    if (g3 > 0) {
      P3.reset();
      const x1 = [2, 1, 3], x2 = [3, -1, 4], x3 = [2, 6, 4], sc = 0.32, f = v => v.map(q => q * sc);
      P3.setPlane(0, [7, 1, -5], { color: C.i, alpha: 0.28, scale: 0.9 * outCubic(prog(B.t, s('C08') + 0.6, s('C08') + 1.6)) });
      P3.setLine(0, f(x1), { half: 1, p0: f(x1).map(q => q / 2), color: C.i, width: 7, grow: gin(s('C08') + 0.2) });
      P3.setLine(1, f(x2), { half: 1, p0: f(x2).map(q => q / 2), color: C.j, width: 7, grow: gin(s('C08') + 0.4) });
      const tx = cue('C08', 'x三正好躺在里面'), dr = 1 - smoother(prog(B.t, tx - 0.8, tx));
      const x3s = f(x3), off = [1.5 * dr, -0.5 * dr, 2.5 * dr];
      P3.setLine(2, x3s, { half: 1, p0: x3s.map((q, i) => q / 2 + off[i]), color: C.free, width: 7, grow: gin(tx - 0.8) });
      const nv = [7, 1, -5].map(q => q * 0.25);
      P3.setLine(3, nv, { half: 1, p0: nv.map(q => q / 2), color: C.peri, width: 7, grow: gin(cue('C08', '法向量用叉积'), 0.8) });
      B.show3D(P3, D, g3 * (1 - gin(s('G02') + 1) * 0.5), { el: 18, az: -40 + (B.t - s('C08')) * 4, dist: 14, axesA: 0.35, floorA: 0.1 });
      ctag('x₁ × x₂ = (7, 1, −5)', DX + 380, DY - 280, { px: 30, a: g3 * gin(cue('C08', '等于七、一、负五')), color: C.peri, font: F.serif });
      ctag('7x + y − 5z = 0', DX, DY + 270, { px: 48, a: g3 * gin(cue('C09', '七x加y减五z')), color: OK, font: F.serif });
      ctag('x₃：14 + 6 − 20 = 0 ✓', DX + 380, DY + 200, { px: 28, a: g3 * gin(cue('C09', '代x三验一下')), color: C.j, font: F.serif });
      const gG = a * gin(s('G02'));
      B.card(DX, DY - 330, 760, 70, gG * 0.95, C.gpt); ctag('只写“一个平面”只拿一半：必须写方程', DX, DY - 330, { px: 26, a: gG, color: C.gpt });
    }
    const gA = a * (1 - gin(s('C08')));
    if (gA > 0) {
      B.qhead('2017–18 第 6 题 = 2023–24 第 4 题', gA);
      const X = [[2, 1, 3], [3, -1, 4], [2, 6, 4]];
      X.forEach((v, k) => { K.cvec(DX - 300 + k * 200, DY - 160, v, gA * gin(s('C04') + 2 + k * 0.4), { px: 34, col: [C.i, C.j, C.free][k] }); ctag('x' + '₁₂₃'[k], DX - 300 + k * 200, DY - 270, { px: 28, a: gA, color: [C.i, C.j, C.free][k], font: F.serif }); });
      ['(a) 相关', '(b) x₁, x₂ 无关', '(c) dim', '(d) 几何'].forEach((tx, k) => K.pill(tx, DX + 320, DY - 260 + k * 60, C.inkMid, gA * gin(cue('C05', ['证明三个向量相关', '证明x一、x二无关', '求它们张成空间的维数', '描述它的几何意义'][k])), 22));
      const g6 = gA * gin(s('C06'));
      ctag('2c₁ + 3c₂ = 2,  c₁ − c₂ = 6', DX - 100, DY - 10, { px: 32, a: g6, font: F.serif });
      ctag('⇒ c₁ = 4,  c₂ = −2', DX - 100, DY + 50, { px: 34, a: g6 * gin(cue('C06', '解出')), color: C.i, font: F.serif });
      ctag('第三分量：4·3 − 2·4 = 4 ✓', DX - 100, DY + 110, { px: 30, a: g6 * gin(cue('C06', '用第三个分量验证')), color: C.j, font: F.serif });
      const g7 = gA * gin(s('C07'));
      if (g7 > 0) { B.card(DX, DY + 230, 900, 120, g7 * 0.95, OK);
        ctag('x₃ = 4x₁ − 2x₂ ⇒ 相关', DX - 200, DY + 205, { px: 30, a: g7, color: OK, font: F.serif });
        ctag('2/3 ≠ −1 ⇒ x₁, x₂ 无关', DX + 220, DY + 205, { px: 28, a: g7 * gin(cue('C07', '不成比例')), color: OK, font: F.serif });
        ctag('dim Span = 2', DX, DY + 260, { px: 30, a: g7 * gin(cue('C07', '维数是二')), color: OK, font: F.serif }); }
    }
  }

  function shotK3() {
    const a = B.win(s('C10') + 0.4, s('C12') - 0.3); if (a <= 0) return;
    B.qhead('2018–19 · 第 9 题 · 4 分：ℝ⁴ 中四个向量', a);
    const S = [[[1, 1, 2, 4], [2, -1, -5, 2], [1, -1, -4, 0], [2, 1, 1, 6]], [[1, 1, 2, 4], [0, -3, -9, -6], [0, -2, -6, -4], [0, -1, -3, -2]], [[1, 1, 2, 4], [0, -3, -9, -6], [0, 0, 0, 0], [0, 0, 0, 0]]];
    const T = [0, cue('C10', '消元看秩') + 0.6, s('C11') + 0.3];
    const { M, k } = K.steps(S, T, [null, [[1, 'r₂ − 2r₁'], [2, 'r₃ − r₁'], [3, 'r₄ − 2r₁']], [[2, 'r₃ − ⅔r₂'], [3, 'r₄ − ⅓r₂']]], { x: DX - 40, y: DY - 120, px: 36, a, hi: (i, j, k) => k === 2 && i >= 2 ? C.free : null });
    if (k === 2) { K.rowBox(M, 2, 0, 3, C.free, a, 18); K.rowBox(M, 3, 0, 3, C.free, a, 18); }
    ctag('rank = 2 < 4 ⇒ 相关', DX, DY + 100, { px: 42, a: a * gin(cue('C11', '秩是二')), color: OK, font: F.serif });
    ctag('v₃ = (2v₂ − v₁)/3,   v₄ = (4v₁ + v₂)/3', DX, DY + 170, { px: 30, a: a * gin(cue('C11', 'v三等于')), color: C.i, font: F.serif });
    ctag('四个向量只撑起一个平面', DX, DY + 230, { px: 28, a: a * gin(cue('C11', '只撑起了一个平面')), color: C.i });
    const gG = a * gin(s('G03'));
    B.card(DX, DY + 310, 760, 70, gG * 0.95, C.gpt); ctag('4 分题：写出 rank = 2 < 4 ⇒ 相关，就够了', DX, DY + 310, { px: 26, a: gG, color: C.gpt });
  }

  function shotA() {
    const a = B.win(s('C12') + 0.4, s('C15') - 0.2); if (a <= 0) return;
    B.qhead('2020–21 · 第 6 题：dim Span{α₁, α₂, α₃} = 2，求 a', a);
    const tA = s('C14') + 0.2, av = B.t < tA ? 'a' : (() => { const v = lerp(9, 6, smoother(prog(B.t, tA, cue('C14', 'a等于六')))); return v.toFixed(1).replace('.0', ''); })();
    const a6 = B.t < tA ? 'a − 6' : String(+(parseFloat(av) - 6).toFixed(1));
    const S = [[[1, 2, -1, 0], [1, 1, 0, 2], [2, 1, 1, 'a']], [[1, 2, -1, 0], [0, -1, 1, 2], [2, 1, 1, 'a']], [[1, 2, -1, 0], [0, -1, 1, 2], [0, -3, 3, 'a']], [[1, 2, -1, 0], [0, -1, 1, 2], [0, 0, 0, a6]]];
    const T = [0, cue('C13', '得到零、负一、一、二'), cue('C13', '得到零、负三、三、a'), cue('C13', '得到零、零、零、a减六')];
    const { M } = K.steps(S, T, [null, [[1, 'r₂ − r₁']], [[2, 'r₃ − 2r₁']], [[2, 'r₃ − 3r₂']]], { x: DX - 40, y: DY - 120, px: 38, a, hi: (i, j) => j === 3 && i === 2 ? C.peri : null });
    if (B.t > tA) {
      const sx = DX - 250, sw = 500, v = parseFloat(av), y = DY + 80;
      B.line2([sx, y], [sx + sw, y], C.inkMid, a, 4); B.dot(sx + sw * (v - 3) / 7, y, 14, C.peri, a); ctag('a = ' + av, sx + sw * (v - 3) / 7, y - 34, { px: 26, a, color: C.peri, font: F.serif });
      if (B.t > cue('C14', 'a等于六')) { K.rowBox(M, 2, 0, 3, OK, a, 18); B.flash(cue('C14', 'a等于六'), 0.2, 0.3, OK); }
    }
    ctag('dim = 2 ⇔ rank = 2 ⇔ 第三行全零 ⇒ a = 6', DX, DY + 170, { px: 34, a: a * gin(cue('C14', '第三行必须全零')), color: OK, font: F.serif });
    K.pill('参数赶到最后一行！（第 1 集同款）', DX, DY + 260, C.ds, a * gin(s('D01')), 26);
  }

  function shotOutro() {
    const a = B.win(s('C15'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 三把刀', ['① 个数 > 维数：必相关', '② 方阵：看行列式', '③ 否则：消元看秩', '④ 几何描述：写方程（叉积求法向量）'],
      [s('C15') + 0.3, cue('C15', '方阵看行列式'), cue('C15', '否则消元看秩'), cue('C15', '几何描述')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, (D) => {
      shotKnives(); shotK1(); shotK2(D); shotK3(); shotA(); shotOutro();
      B.paper(EX, 'y1516_q2', { t0: s('C02') + 0.1, dock: s('C02') + 1, out: s('C04') - 0.4 });
      B.paper(EX, 'y1718_q6', { t0: s('C04') + 0.1, dock: s('C04') + 1.8, out: s('C08') - 0.3 });
      B.paper(EX, 'y2324_q4', { t0: s('C04') + 0.6, dock: s('C04') + 2.2, out: s('C08') - 0.3 });
      B.paper(EX, 'y1819_q9', { t0: s('C10') + 0.1, dock: s('C10') + 1.2, out: s('C12') - 0.4 });
      B.paper(EX, 'y2021_q6', { t0: s('C12') + 0.1, dock: s('C13'), out: s('C15') - 0.4 });
    });
  }
  return { TL, draw };
}
