// 特别篇 · 期中速成 x5：线性相关 / 无关。
// 分镜：多余向量（c = a + b 走折线） → 万能三步卡 → 15–16 Q2：3 个主元座位、4 个向量抢座，第 4 个被弹开
//       → 17–18 Q6：列消元（第三行归零）→ x₃ = 4x₁ − 2x₂ 验算 → 3D：平面 + 折线走法 + 法向量 → 18–19 Q9：4×4 消元两行归零
//       → 20–21 Q6：含 a 的行消元，末行 (0,0,0,a−6) 逼成全 0 → 套路卡⑨。
import { base, loadExam, SBoard, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, arrow, load3D, rgba } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_happy', 'ds_think', 'ds_proud', 'gpt_point', 'gpt_explain'] };

export async function setup(R) {
  const EX = await loadExam(['y1516_q2', 'y1718_q6', 'y2324_q4', 'y1819_q9', 'y2021_q6', 'y1718_q3', 'y2324_q6', 'y2021_q8']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '线性相关', hi: 1, en: 'LINEAR DEPENDENCE',
    titleEnd: () => B.L('C02').s + 0.3,
    pre: { C19i: 1.0, C04: 0.8, C06: 1.0, C09: 0.6, C13: 1.0, C16: 1.0, C19a: 1.0, C19f: 1.0, C19h: 0.4, C20: 0.8 },
    post: { C19i: 0.6, C19j: 1.2, C19k: 1.2, C19l: 1.4, D04c: 0.6, C02: 1.0, C03: 1.0, C05: 1.4, C07: 1.4, C08: 1.0, C09: 2.4, C12: 1.4, C14: 1.2, C15: 1.0, C18: 1.0, C19: 1.0, C19a: 0.8, C19b: 1.2, C19c: 0.8, C19d: 1.4, D04a: 0.4, C19e: 1.2, G02b: 1.2, C19f: 1.0, C19g: 1.4, C19h: 1.2, D04b: 0.6, C20: 1.2 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;

  // ── 消元板 ──
  const o7 = [0, 1, 2, 3, 4].map(i => cue('C07', '做消元') + 0.6 + i * 1.2);
  const MB7 = new SBoard([[2, 3, 2], [1, -1, 6], [3, 4, 4]], { aug: false });
  MB7.swap(o7[0], o7[0] + 1.0, 0, 1); MB7.add(o7[1], o7[1] + 1.0, 1, 0, -2); MB7.add(o7[2], o7[2] + 1.0, 2, 0, -3); MB7.scale(o7[3], o7[3] + 1.0, 1, 1 / 5); MB7.add(o7[4], o7[4] + 1.0, 2, 1, -7);
  const o14 = [0, 1, 2, 3, 4].map(i => cue('C14', '排成列') + 0.5 + i * 1.1);
  const MB14 = new SBoard([[1, 2, 1, 2], [1, -1, -1, 1], [2, -5, -4, 1], [4, 2, 0, 6]], { aug: false });
  MB14.add(o14[0], o14[0] + 0.9, 1, 0, -1); MB14.add(o14[1], o14[1] + 0.9, 2, 0, -2); MB14.add(o14[2], o14[2] + 0.9, 3, 0, -4); MB14.add(o14[3], o14[3] + 0.9, 2, 1, -3); MB14.add(o14[4], o14[4] + 0.9, 3, 1, -2);
  const o17 = [0, 1, 2].map(i => cue('C17', '当成行') + 0.6 + i * 1.3);
  const MB17 = new SBoard([[1, 2, -1, 0], [1, 1, 0, 2], [2, 1, 1, 'a']], { aug: false });
  MB17.add(o17[0], o17[0] + 1.1, 1, 0, -1); MB17.add(o17[1], o17[1] + 1.1, 2, 0, -2, [0, -3, 3, 'a']); MB17.add(o17[2], o17[2] + 1.1, 2, 1, -3, [0, 0, 0, 'a−6']);

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45);
  TL.sfx('pop', s('C02') + 0.6, 0.25); TL.sfx('swoosh_soft', cue('C02', '能被其他'), 0.3); TL.sfx('sting', cue('C02', '就叫线性相关'), 0.25);
  [0, 1, 2].forEach(i => TL.sfx('pop', cue('C03', ['排成矩阵', '做消元', '数主元'][i]), 0.28)); TL.sfx('ding_hi', cue('C03', '秩小于'), 0.3);
  [['C04', 0.2], ['C06', 0.2], ['C13', 0.2], ['C16', 0.2]].forEach(([id, d]) => { TL.sfx('whoosh', s(id) + d, 0.3); TL.sfx('stamp', s(id) + d + 2.4, 0.3); });
  TL.sfx('slam', s('C05') + 0.1, 0.35);
  [0, 1, 2].forEach(i => TL.sfx('click', cue('C05', '最多只能') + 0.4 + i * 0.4, 0.3)); TL.sfx('crack', cue('C05', '四个向量') + 1.6, 0.3); TL.sfx('stamp', cue('C05', '必然相关'), 0.35);
  [...o7, ...o14, ...o17].forEach(t => TL.sfx('swoosh_soft', t, 0.2));
  TL.sfx('ding_hi', o7[4] + 1.1, 0.3); TL.sfx('ding_hi', cue('C08', '正好是'), 0.3);
  TL.sfx('riser', s('C09') - 0.4, 0.2); TL.sfx('marimba', cue('C09', '先沿x一'), 0.3); TL.sfx('marimba_lo', cue('C09', '再沿x二'), 0.3); TL.sfx('ding_hi', cue('C09', '终点'), 0.35);
  TL.sfx('zap', cue('C12', '法向量'), 0.3); TL.sfx('ding_hi', s('D03') + 1.4, 0.35);
  TL.sfx('ding_hi', o14[4] + 1.0, 0.3); TL.sfx('ding_hi', o17[2] + 1.2, 0.3); TL.sfx('slam', s('C18') + 0.6, 0.35); TL.sfx('check', cue('C19', '正好'), 0.35);
  TL.sfx('bell_soft', s('C20'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);
  // 扩写三 sfx
  TL.sfx('whoosh', s('C19i') + 0.2, 0.3); ['x读成', 'x加二读成', 'x平方读成'].forEach(p => TL.sfx('pop', cue('C19j', p), 0.3));
  TL.sfx('impact', cue('C19k', '三个向量') + 0.2, 0.3); TL.sfx('ding_hi', cue('C19l', '记住'), 0.3); TL.sfx('shimmer', s('D04c'), 0.3);
  // 扩写二 sfx
  TL.sfx('whoosh', s('C19a') + 0.2, 0.3); ['读成二', '读成一', '读成负一'].forEach(p => TL.sfx('pop', cue('C19b', p), 0.3));
  TL.sfx('swoosh_soft', s('C19c'), 0.3); TL.sfx('tick', s('C19d') + 0.4, 0.3); TL.sfx('impact', cue('C19d', '所以线性无关') + 0.2, 0.3);
  ['x项', '常数项'].forEach(p => TL.sfx('tick', cue('G02b', p), 0.3)); TL.sfx('check', cue('G02b', '解出来'), 0.3);
  TL.sfx('whoosh', s('C19f') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C19f', '三、负二') + 1.0, 0.3); TL.sfx('impact', cue('C19g', '线性无关') + 0.2, 0.3);
  TL.sfx('buzz', s('C19h') + 0.2, 0.25); TL.sfx('shimmer', s('D04b'), 0.3);

  // ════ 定义：多余的向量 ════
  function shotDef() {
    const a = B.win(s('C02') - 0.2, s('C04') - 0.1); if (a <= 0) return;
    const pA = a * (1 - gin(s('C03') - 0.2));
    if (pA > 0) {
      const O = [DX - 250, DY + 120], u = [260, -60], v = [110, -230];
      const P = q => [O[0] + q[0], O[1] + q[1]];
      arrow(ctx, O, P(u), { color: C.i, alpha: pA * gin(s('C02') + 0.6), grow: smooth(prog(B.t, s('C02') + 0.6, s('C02') + 1.2)) });
      arrow(ctx, O, P(v), { color: C.peri, alpha: pA * gin(s('C02') + 0.9), grow: smooth(prog(B.t, s('C02') + 0.9, s('C02') + 1.5)) });
      const tc = cue('C02', '能被其他'), w = [u[0] + v[0], u[1] + v[1]];
      arrow(ctx, P(u), P(w), { color: rgba(C.peri, 0.7), alpha: pA * gin(tc), grow: smooth(prog(B.t, tc, tc + 0.8)), dash: [10, 8], width: 4 });
      arrow(ctx, O, P(w), { color: C.j, alpha: pA * gin(tc + 0.9), grow: smooth(prog(B.t, tc + 0.9, tc + 1.6)), width: 7 });
      ctag('a', P(u)[0] + 24, P(u)[1] + 20, { px: 34, a: pA, color: C.i, font: F.serif }); ctag('b', P(v)[0] - 24, P(v)[1], { px: 34, a: pA, color: C.peri, font: F.serif });
      ctag('c = a + b', P(w)[0] + 80, P(w)[1] - 10, { px: 34, a: pA * gin(tc + 1.4), color: C.j, font: F.serif });
      const tl = cue('C02', '就叫线性相关');
      B.xcard('c 是多余的 ⇒ 相关', DX + 220, DY - 230, 380, 76, pA * gin(tl), C.free, 32);
      B.xcard('谁都不多余 ⇒ 无关', DX + 220, DY - 130, 380, 76, pA * gin(cue('C02', '谁都不多余')), OK, 32);
    }
    const pB = a * gin(s('C03') - 0.2);
    if (pB > 0) {
      ['排成列', '消元', '数主元'].forEach((t, i) => {
        const g = pB * gin(cue('C03', ['排成矩阵', '做消元', '数主元'][i])), x = DX - 300 + i * 300;
        B.card(x, DY - 120, 240, 110, g, [C.i, C.peri, C.j][i]); ctag(`${i + 1}  ${t}`, x, DY - 120, { px: 38, a: g, color: C.ink });
        B.burst(x, DY - 120, cue('C03', ['排成矩阵', '做消元', '数主元'][i]), [C.i, C.peri, C.j][i], { r1: 120, n: 10 });
        if (i < 2) ctag('→', x + 150, DY - 120, { px: 40, a: g, color: C.inkMid });
      });
      B.xcard('秩 < 向量个数 ⇒ 相关', DX, DY + 60, 520, 86, pB * gin(cue('C03', '秩小于')), OK, 38);
      ctag('数主元我会！', DX, DY + 190, { px: 34, a: pB * gin(s('D01')), color: C.ds, font: F.serif });
    }
  }

  // ════ 15–16 Q2：抢座 ════
  function shotQ1516() {
    const a = B.win(s('C04'), s('C06') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C04', '四个三维向量') - 0.4); if (A <= 0) return;
    B.qhead('2015–2016 · 第 2 题', A);
    const M = [[1, 0, 1, 1], [0, 1, 0, 2], [0, 1, 1, 3]], cols = [C.i, C.peri, C.j, C.k];
    const seat = gin(cue('C05', '最多只能'));
    const mm = B.mat(DX, DY - 200, M, { px: 44, a: A, cell: (i, j) => ({ col: cols[j] }) });
    ctag('3 × 4', DX + 230, DY - 200, { px: 30, a: A * gin(s('D02')), color: C.inkMid });
    if (seat > 0) {
      const sy = DY + 40;
      for (let k = 0; k < 3; k++) { const x = DX - 220 + k * 220, g = A * gin(cue('C05', '最多只能') + 0.4 + k * 0.4); B.card(x, sy, 150, 110, g, C.inkMid); ctag(`主元 ${k + 1}`, x, sy + 80, { px: 24, a: g, color: C.inkMid }); }
      ctag('R³：最多 3 个主元', DX, sy - 110, { px: 32, a: A * seat, color: C.ink });
      const tf = cue('C05', '四个向量');
      for (let j = 0; j < 4; j++) {
        const t0 = tf + j * 0.4, p = smoother(prog(B.t, t0, t0 + 0.7));
        const [x0, y0] = mm.cell(0, j), tx = j < 3 ? DX - 220 + j * 220 : DX + 120, ty = j < 3 ? sy : sy - 10;
        let x = lerp(x0, tx, p), y = lerp(y0 + 40, ty, p) - Math.sin(Math.PI * p) * 80;
        if (j === 3) { const bo = smoother(prog(B.t, t0 + 0.7, t0 + 1.3)); x = lerp(x, DX + 420, bo); y = lerp(y, sy + 140, bo) - Math.sin(Math.PI * bo) * 60; }
        B.dot(x, y, 22, cols[j], A * gin(t0));
        if (j === 3 && B.t > t0 + 0.7) { B.burst(DX + 220, sy, t0 + 0.7, C.free, { r1: 100, n: 12 }); ctag('多余！', DX + 420, sy + 200, { px: 30, a: A * gin(t0 + 1.0), color: C.free }); }
      }
      B.stamp(DX, DY + 240, false, gin(cue('C05', '必然相关'), 0.4), A * gin(cue('C05', '必然相关')), '必相关');
    }
    B.xcard('个数 > 维数 ⇒ 直接相关', DX, DY + 340, 520, 70, A * gin(s('G01')), C.gpt, 32);
  }

  // ════ 17–18 Q6 ════
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3, nPlanes: 1, nLines: 0, nPoints: 0 });
  const k3 = 0.22, x1 = [2, 1, 3].map(v => v * k3), x2 = [3, -1, 4].map(v => v * k3), x3 = [2, 6, 4].map(v => v * k3);
  const add = (...vs) => vs.reduce((p, q) => p.map((v, i) => v + q[i])), mul = (k, v) => v.map(x => x * k);
  function shotQ1718(D) {
    const a = B.win(s('C06'), s('C13') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C06', '三个三维向量') - 0.4); if (A <= 0) return;
    B.qhead('2017–2018 期中 · 第 6 题', A * (1 - B.win(s('C09') - 0.3, s('C13') - 0.2)));
    // (a) 消元 + 组合
    const pa = A * (1 - gin(s('C09') - 0.3));
    if (pa > 0) {
      const done = gin(o7[4] + 1.1);
      MB7.draw(ctx, B.t, { x: DX - 150, y: DY - 140, px: 50, mode: 1, alpha: pa * gin(s('C07')), hiRows: { 2: done }, labelHold: 1.0 });
      ctag('2 个主元，秩 2 < 3', DX + 250, DY - 140, { px: 32, a: pa * done, color: OK });
      texAt('x3', DX, DY + 90, 46, { alpha: pa * gin(cue('C08', '解出来')) });
      texAt('x3chk', DX, DY + 230, 36, { alpha: pa * gin(cue('C08', '验算')) * (1 - B.win(s('C08a'), e('C08a'))) });
      B.ghalo('x3chk', DX, DY + 230, 36, null, pa * gin(cue('C08', '正好是')) * (1 - B.win(s('C08a'), e('C08a'))), OK);
    }
    // 3D
    const g3 = A * B.win(s('C09') - 0.3, s('C13') - 0.2);
    if (g3 > 0) {
      P3.reset();
      P3.setPlane(0, [7, 1, -5], { color: C.k, alpha: 0.22, scale: 0.9 * outCubic(prog(B.t, s('C09') + 0.2, s('C09') + 1.4)) });
      const V = B.show3D(P3, D, g3, { el: 20, az: 40 + 10 * Math.sin(B.t * 0.15), dist: 13, target: [0.2, 0.4, 0.5], axesA: 0.45, floorA: 0.25 });
      const O = [0, 0, 0];
      V.v3(O, x1, { color: C.i, alpha: g3 }); V.v3(O, x2, { color: C.peri, alpha: g3 });
      V.lab(mul(1.35, x1), 'x₁', { px: 30, a: g3, color: C.i }); V.lab(mul(1.3, x2), 'x₂', { px: 30, a: g3, color: C.peri });
      const t1 = cue('C09', '先沿x一'), t2 = cue('C09', '再沿x二');
      for (let k = 0; k < 4; k++) { const p = smoother(prog(B.t, t1 + k * 0.35, t1 + k * 0.35 + 0.35)); if (p > 0) V.v3(mul(k, x1), add(mul(k, x1), mul(p, x1)), { color: rgba(C.i, 0.75), alpha: g3 }); }
      const P4 = mul(4, x1);
      for (let k = 0; k < 2; k++) { const p = smoother(prog(B.t, t2 + k * 0.45, t2 + k * 0.45 + 0.45)); if (p > 0) V.v3(add(P4, mul(-k, x2)), add(P4, mul(-k - p, x2)), { color: rgba(C.peri, 0.75), alpha: g3 }); }
      if (B.t > t1 + 1.4) V.lab(add(P4, [0, 0, 0.25]), '4x₁', { px: 28, a: g3 * gin(t1 + 1.4), color: C.i });
      const te = cue('C09', '终点');
      V.v3(O, x3, { color: C.j, alpha: g3 * gin(te), width: 7 });
      V.lab(mul(1.12, x3), 'x₃', { px: 32, a: g3 * gin(te), color: C.j });
      if (B.t > te) { const [px, py] = V.pr(x3); B.burst(px, py, te, C.j, { r1: 90, n: 12 }); }
      // 法向量
      const tn = cue('C12', '法向量'), nn = [7, 1, -5].map(v => v * 0.1);
      V.v3(O, mul(smoother(prog(B.t, tn, tn + 0.8)), nn), { color: C.free, alpha: g3 * gin(tn) });
      V.lab(mul(1.25, nn), 'n', { px: 30, a: g3 * gin(tn + 0.6), color: C.free });
      // 叠加文字
      const tb = s('C10'), tc = s('C11'), td = s('C12');
      texAt('x3', DX, DY - 380, 36, { alpha: g3 * B.win(s('C09'), tb) });
      texAt('prop', DX + 300, DY - 300, 36, { alpha: g3 * B.win(tb + 0.3, tc) });
      B.xcard('(b) 不成比例 ⇒ x₁, x₂ 无关', DX, DY - 380, 520, 66, g3 * B.win(tb, tc), C.peri, 28);
      B.xcard('(c) dim Span = 2，基 {x₁, x₂}', DX, DY - 380, 520, 66, g3 * B.win(tc, td), OK, 28);
      texAt('cross', DX, DY - 360, 32, { alpha: g3 * B.win(td, 1e9) });
      B.answer('plane', DX, DY + 300, 42, g3 * gin(cue('C12', '所以平面方程')), { col: OK });
      texAt('plchk', DX - 30, DY + 215, 30, { alpha: g3 * gin(s('D03') + 0.6) });
      ctag('✓', DX + 140, DY + 215, { px: 40, a: g3 * gin(s('D03') + 1.4), color: OK });
    }
  }

  // ════ 18–19 Q9 ════
  function shotQ1819() {
    const a = B.win(s('C13'), s('C16') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C13', '四个四维向量') - 0.4); if (A <= 0) return;
    B.qhead('2018–2019 期中 · 第 9 题', A);
    const done = gin(o14[4] + 1.0);
    ctag('4 个向量 · R⁴：个数 = 维数，不能秒', DX, DY - 360, { px: 30, a: A * gin(s('C14')), color: C.ink });
    MB14.draw(ctx, B.t, { x: DX - 120, y: DY - 120, px: 46, mode: 1, alpha: A * gin(s('C14') + 0.3), hiRows: { 2: done, 3: done }, labelHold: 1.0 });
    ctag('只剩 2 个主元', DX + 290, DY - 160, { px: 32, a: A * done, color: OK });
    ctag('秩 2 < 4 ⇒ 相关', DX + 290, DY - 100, { px: 32, a: A * gin(s('C15')), color: OK });
    texAt('v34', DX, DY + 150, 38, { alpha: A * gin(cue('C15', '而且两个')) });
    B.stamp(DX + 330, DY + 270, false, gin(s('C15') + 0.6, 0.4), A * gin(s('C15') + 0.6) * (1 - B.win(s('G02a'), e('G02a'))), '相关');
    B.xcard('方阵：det = 0 ⇔ 相关（4 阶不划算）', DX - 80, DY + 270, 520, 66, A * gin(s('G02')) * (1 - gin(s('G02a'))), C.gpt, 26);
  }

  // ════ 20–21 Q6 ════
  function shotQ2021() {
    const a = B.win(s('C16'), s('C19a') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C16', '三个四维向量') - 0.4); if (A <= 0) return;
    B.qhead('2020–2021 期中 · 第 6 题', A);
    ctag('dim = 2  ⇔  秩 = 2  ⇔  恰好一个多余', DX, DY - 360, { px: 32, a: A * gin(s('C17')), color: C.ink });
    const done = gin(o17[2] + 1.2), zero = gin(s('C18') + 0.6);
    MB17.draw(ctx, B.t, { x: DX - 60, y: DY - 160, px: 50, mode: 1, alpha: A * gin(s('C17') + 0.3), hiRows: { 2: done }, labelHold: 1.0 });
    ctag('必须全 0', DX + 350, DY - 80, { px: 30, a: A * done * B.win(o17[2] + 1.2, s('C19')), color: C.free });
    B.answer('a6', DX, DY + 60, 48, A * zero, { col: OK }); B.burst(DX, DY + 60, s('C18') + 0.6, OK, { r1: 240 });
    texAt('a3', DX, DY + 190, 42, { alpha: A * gin(s('C19')) });
    ctag('第四分量：−0 + 3 × 2 = 6 = a ✓', DX, DY + 270, { px: 28, a: A * gin(cue('C19', '第四个分量')), color: C.inkMid });
    ctag('含参数 = 让某一行恰好全 0', DX, DY + 340, { px: 32, a: A * gin(s('D04')), color: C.ds, font: F.serif });
  }

  // ════ 扩写二：P₃ 多项式无关（17–18 Q3，23–24 Q6）════
  function polyShot(A, P, t) {
    const cols = [C.i, C.j, C.free];
    // 多项式 → 系数
    P.polys.forEach((pl, i) => {
      const y = DY - 290 + i * 56, g = A * gin(t.read[i]);
      ctag(pl, DX - 260, y, { px: 30, a: A * gin(t.t0 + i * 0.3), color: cols[i], font: F.serif });
      arrow(ctx, [DX - 130, y], [DX - 60, y], { color: cols[i], width: 3, head: 12, alpha: g });
      ctag('(' + P.vec[i].map(v => String(v).replace('-', '−')).join(', ') + ')', DX + 40, y, { px: 30, a: g, color: cols[i], font: F.serif });
    });
    ctag('按 1, x, x² 读系数', DX + 230, DY - 290, { px: 24, a: A * gin(t.read[0]) * (1 - gin(t.mat)), color: C.inkMid });
    // 系数矩阵（列 = 向量）
    const gm = A * gin(t.mat);
    if (gm > 0) {
      const R = [0, 1, 2].map(i => [0, 1, 2].map(j => P.vec[j][i]));
      const M = B.mat(DX - 150, DY - 20, R, { px: 38, a: gm, cell: (i, j) => ({ txt: String(R[i][j]).replace('-', '−'), col: i === 2 && j === 2 ? C.peri : cols[j], a: gin(t.mat + 0.3 + j * 0.4) }) });
      const hi = gin(t.det);
      ctx.save(); ctx.globalAlpha = gm * hi * 0.9; ctx.strokeStyle = C.peri; ctx.lineWidth = 2.5;
      const [x0, y2] = M.cell(2, 0), [x2] = M.cell(2, 2); ctx.strokeRect(x0 - 30, y2 - 24, x2 - x0 + 60, 48); ctx.restore();
      ctag(P.minor, DX + 150, DY - 60, { px: 30, a: gm * gin(t.det + 0.4), color: C.ink, font: F.serif });
      ctag(P.calc, DX + 150, DY + 5, { px: 30, a: gm * gin(t.det + 1.2), color: C.i, font: F.serif });
    }
    const gx = A * gin(t.ans) * (1 - gin(t.fadeAns));
    B.card(DX, DY + 130, 560, 76, gx * 0.95, OK);
    ctag(P.ans, DX, DY + 130, { px: 34, a: gx, color: OK, font: F.serif });
    B.burst(DX, DY + 130, t.ans + 0.2, OK, { r1: 220 });
  }
  function shotPoly() {
    let a = B.win(s('C19a'), s('C19f') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C19a') + 0.4);
      B.qhead('2017–2018 期中 · 第 3 题 · 10 分', A);
      polyShot(A, { polys: ['x + 2', 'x + 1', 'x² − 1'], vec: [[2, 1, 0], [1, 1, 0], [-1, 0, 1]], minor: '1 × (2·1 − 1·1)', calc: '= 2 − 1 = 1 ≠ 0', ans: 'det = 1 ≠ 0 ⇒ 线性无关' },
        { t0: s('C19a') + 0.6, read: [cue('C19b', '读成二'), cue('C19b', '读成一'), cue('C19b', '读成负一')], mat: s('C19c'), det: s('C19d'), ans: cue('C19d', '所以线性无关'), fadeAns: s('D04a') });
      const ge = A * gin(s('C19e'));
      ctag('c₁p₁ + c₂p₂ + c₃p₃ = 0   ⇔   M c = 0', DX, DY + 130, { px: 32, a: ge * (1 - gin(s('G02b'))), color: C.j, font: F.serif });
      const gg = A * gin(s('G02b'));
      [['x²：c₃ = 0', s('G02b') + 0.3], ['x：c₁ + c₂ = 0', cue('G02b', 'x项')], ['1：2c₁ + c₂ − c₃ = 0', cue('G02b', '常数项')]].forEach(([tx, t0], i) =>
        ctag(tx, DX - 40, DY + 110 + i * 52, { px: 28, a: gg * gin(t0), color: C.gpt, font: F.serif }));
      const gz = A * gin(cue('G02b', '解出来'));
      ctag('⇒ c = 0 ✓', DX + 240, DY + 162, { px: 30, a: gz, color: OK, font: F.serif });
    }
    a = B.win(s('C19f'), s('C19i') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C19f') + 0.4);
      B.qhead('2023–2024 期中 · 第 6 题 · 10 分', A);
      polyShot(A, { polys: ['x + 2', 'x − 4', 'x² − 2x + 3'], vec: [[2, 1, 0], [-4, 1, 0], [3, -2, 1]], minor: '1 × (2·1 − (−4)·1)', calc: '= 2 + 4 = 6 ≠ 0', ans: 'det = 6 ≠ 0 ⇒ 线性无关' },
        { t0: s('C19f') + 0.6, read: [cue('C19f', '读系数'), cue('C19f', '负四'), cue('C19f', '三、负二')], mat: cue('C19f', '三、负二') + 1.0, det: s('C19g'), ans: cue('C19g', '线性无关'), fadeAns: 1e9 });
      const gp = A * gin(s('C19h'));
      B.card(DX, DY + 250, 700, 100, gp * 0.95, C.free);
      ctag('Leon：P₃ = 次数 < 3 的多项式', DX, DY + 228, { px: 30, a: gp, color: C.free, font: F.serif });
      ctag('基 {1, x, x²}，dim P₃ = 3（不是 4！）', DX, DY + 272, { px: 28, a: gp * gin(cue('C19h', '维数是三')), color: C.ink, font: F.serif });
    }
  }

  // ════ 扩写三：20–21 Q8(2) {x, x + 2, x²} 张成 P₃ ════
  function shotR3() {
    const a = B.win(s('C19i'), s('C20') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C19i') + 0.4);
    B.qhead('2020–2021 期中 · 第 8(2) 题 · 5 分', A);
    polyShot(A, { polys: ['x', 'x + 2', 'x²'], vec: [[0, 1, 0], [2, 1, 0], [0, 0, 1]], minor: '1 × (0·1 − 2·1)', calc: '= −2 ≠ 0', ans: 'det = −2 ≠ 0 ⇒ 线性无关' },
      { t0: s('C19i') + 0.6, read: [cue('C19j', 'x读成'), cue('C19j', 'x加二读成'), cue('C19j', 'x平方读成')], mat: cue('C19j', '排成三列'), det: s('C19k'), ans: cue('C19k', '三个向量'), fadeAns: 1e9 });
    B.drill(A, [{ txt: '无关 + 个数 = dim P₃ = 3  ⇒  基  ⇒  张成', x: DX, y: DY + 250, px: 30, card: OK, t: s('C19l') + 0.3, burst: cue('C19l', '记住') }]);
  }

  function shotOutro() {
    const a = B.win(s('C20'), 1e9); if (a <= 0) return;
    const g = a * gin(s('C20'));
    B.card(DX, DY - 60, 880, 300, g, C.peri);
    ctag('套路卡 ⑨', DX - 330, DY - 170, { px: 30, a: g, color: C.peri, font: F.serif });
    const ts = [s('C20') + 0.3, cue('C20', '秩小于个数'), cue('C20', '个数大于维数'), cue('C20', '含参数')];
    ['排成列 → 消元 → 数主元', '秩 < 个数 ⇒ 相关', '个数 > 维数 ⇒ 直接相关', '含参数 ⇒ 让多余的那一行全为 0'].forEach((l, k) =>
      ctag(l, DX - 400, DY - 110 + k * 54, { px: 32, a: a * gin(ts[k]), color: k === 2 ? C.gpt : C.ink, align: 'left' }));
    B.burst(DX + 380, DY - 170, s('C20') + 0.2, C.peri, { r1: 100, n: 12 });
    B.xcard('下一段 → 过渡矩阵', DX, DY + 200, 440, 70, a * gin(s('D05')), C.ds, 30);
  }

  function papers() {
    B.paper(EX, 'y1516_q2', { t0: s('C04') + 0.2, dock: cue('C04', '四个三维向量') - 0.6, out: s('C06') - 0.4 });
    B.paper(EX, 'y1718_q6', { t0: s('C06') + 0.2, dock: cue('C06', '二零二三') - 0.4, out: s('C09') - 0.4 });
    B.paper(EX, 'y2324_q4', { t0: cue('C06', '二零二三'), dock: cue('C06', '三个三维向量') - 0.4, out: s('C07') + 0.6, side: { y: 260 } });
    B.paper(EX, 'y1819_q9', { t0: s('C13') + 0.2, dock: cue('C13', '四个四维向量') - 0.6, out: s('C16') - 0.4 });
    B.paper(EX, 'y2021_q6', { t0: s('C16') + 0.2, dock: cue('C16', '三个四维向量') - 0.6, out: s('C19a') - 0.3 });
    B.paper(EX, 'y1718_q3', { t0: s('C19a') + 0.2, dock: cue('C19a', 'x加二') - 0.3, out: s('C19f') - 0.3 });
    B.paper(EX, 'y2324_q6', { t0: s('C19f') + 0.2, dock: cue('C19f', 'x加二') - 0.3, out: s('C19i') - 0.3 });
    B.paper(EX, 'y2021_q8', { t0: s('C19i') + 0.2, dock: cue('C19i', '证明x') - 0.3, out: s('C20') - 0.3 });
  }

  // ── 扩写：逐步算式小卡 ──
  const XC = [
    ['C03a', DY + 300, ['相关 ⇔ Ax = 0 有非零解 ⇔ 有自由列 ⇔ 秩 < 个数'], C.j],
    ['C07a', DY + 300, ['R₂ − 2R₁ = (0, 5, −10)', 'R₃ − 3R₁ = (0, 7, −14)'], C.i],
    ['C08a', DY + 250, ['c₃ = 1 → c₂ = 2 → c₁ = −4', '−4x₁ + 2x₂ + x₃ = 0'], C.i],
    ['C12a', DY + 300, ['(1·4 − 3·(−1), 3·3 − 2·4, 2·(−1) − 1·3) = (7, 1, −5)'], C.i],
    ['C14a', DY + 300, ['(0, −3, −2, −1)　×3 → R₃　×2 → R₄'], C.i],
    ['G02a', DY + 300, ['(1, 0), (2, 0), (0, 1)：相关', '但 (0, 1) ∉ Span{(1, 0), (2, 0)}'], C.free],
    ['C17a', DY + 300, ['R₂ − R₁ = (0, −1, 1, 2)　R₃ − 2R₁ = (0, −3, 3, a)', 'R₃ − 3R₂ = (0, 0, 0, a − 6)'], C.i],
  ];
  function extras() {
    for (const [id, y, rows, col] of XC) {
      const g = B.win(s(id), e(id) + 0.15); if (g <= 0) continue;
      const w = Math.max(...rows.map(r => [...r].reduce((q, ch) => q + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 30 : 16), 0))) + 80, h = rows.length * 44 + 30;
      B.card(DX, y, Math.min(880, w), h, g * 0.95, col);
      rows.forEach((r, i) => ctag(r, DX, y - (rows.length - 1) * 22 + i * 44, { px: 29, a: g * gin(s(id) + 0.3 + i * 1.4), color: col === OK ? OK : C.ink, font: F.serif }));
    }
  }

  function draw(t) {
    B.frame(t, D => { shotDef(); shotQ1516(); shotQ1718(D); shotQ1819(); shotQ2021(); shotPoly(); shotR3(); shotOutro(); papers(); extras(); });
  }
  return { TL, draw };
}
