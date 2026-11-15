// 第 4 章 4.3 相似（Leon 9th §4.3）。
// 分镜：同一个 L、两副眼镜（标准网格 + u-网格）→ L(u₁) = 2u₁、L(u₂) = −u₁ + u₂ → B
//       → 朋友的语言：U → A → U⁻¹ 翻译链 → U⁻¹AU = B → 定理 4.3.1 交换图 → 定义 / 对称 / 传递
//       → 例 1 求导 → 例 2（3D：y₁ 压扁、y₂ 不动、y₃ ×4）→ 对角化预告 → 不变量 det / tr → 同济对照（名字相反）→ 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_explain', 'gpt_point', 'gpt_cross'] };

const mv = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
const mm = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
const mv3 = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);

export async function setup(R) {
  const B = base(R, {
    assets, label: '第四章 · 线性变换', title: '4.3 相似', hi: 3, en: 'SIMILARITY',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C03: 0.5, C06: 0.6, C07: 0.4, C09: 0.6, C10: 0.4, C12: 0.6, C15: 0.6, C18: 0.6, C20: 0.4, C22: 0.4, C24: 0.6, G01: 0.6, C27: 0.6 },
    post: { C03: 0.8, C04: 0.8, C05: 0.8, C07: 1.0, C08: 0.8, C10: 1.2, C11: 0.6, C14: 0.8, C17: 0.6, C20: 0.8, C21: 0.6, C22: 1.0, C23: 0.6, C25: 0.6, C26: 0.6, G02: 0.6, G03: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, ex: L('C02').s, exA: cue('C02', '它的矩阵A'), u: L('C03').s, ug: cue('C03', '画面里'), lu: L('C04').s, lu2: cue('C04', 'u二的像'), b: L('C05').s, b2: cue('C05', '同一个L'), d1: L('D01').s,
    fr: L('C06').s, frU: cue('C06', '矩阵U'), ch: L('C07').s, ch1: cue('C07', 'U先把'), ch2: cue('C07', 'A在我们这边'), ch3: cue('C07', 'U逆再把'), uau: L('C08').s,
    thm: L('C09').s, thmB: cue('C09', '那么'), cd: L('C10').s, cdLow: cue('C10', '下面绕路'), d2: L('D02').s, dir: L('C11').s, dir2: cue('C11', '它的列'),
    def: L('C12').s, sym: L('C13').s, tra: cue('C13', '传递'), one: L('C14').s,
    e1: L('C15').s, e1n: L('C16').s, e1d: cue('C16', '二x求导'), e1A: cue('C16', '所以矩阵A'), e1S: L('C17').s, e1r: cue('C17', '可以验证'),
    e2: L('C18').s, e2y: L('C19').s, e2c: L('C20').s, e2c2: cue('C20', '每个新基向量'), e2D: L('C21').s, e2D2: cue('C21', '也就是'), d3: L('D03').s, e2v: L('C22').s, e2n: cue('C22', '对角矩阵'),
    eig: L('C23').s, inv: L('C24').s, inv2: cue('C24', '迹，就是'), dt: L('C25').s, dt2: cue('C25', '迹的证明'), d4: L('D04').s, d4b: cue('D04', '行列式都是'), b10: L('C26').s,
    tj: L('G01').s, tj2: L('G02').s, tj2b: cue('G02', '同济叫'), tj3: L('G03').s, sum: L('C27').s, end: L('C28').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.exA, 0.3); TL.sfx('shimmer', T.ug, 0.35); TL.sfx('warp', T.lu, 0.4); TL.sfx('pop', T.lu2, 0.3); TL.sfx('ding_hi', T.b, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('whoosh', T.frU, 0.3); TL.sfx('pop', T.ch1, 0.3); TL.sfx('pop', T.ch2, 0.3); TL.sfx('pop', T.ch3, 0.3); TL.sfx('ding_hi', T.uau + 1.2, 0.35);
  TL.sfx('shimmer', T.thmB, 0.35); TL.sfx('pop', T.cd, 0.3); TL.sfx('swoosh_in', T.cdLow, 0.3); TL.sfx('ding_hi', L('C10').e - 0.4, 0.3); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('shimmer', T.def, 0.35); TL.sfx('pop', T.sym + 0.5, 0.3); TL.sfx('pop', T.tra, 0.3); TL.sfx('ding_hi', T.one, 0.35);
  TL.sfx('whoosh', T.e1, 0.3); TL.sfx('pop', T.e1A, 0.3); TL.sfx('pop', T.e1S, 0.3); TL.sfx('check', T.e1r + 0.8, 0.35);
  TL.sfx('whoosh', T.e2, 0.3); TL.sfx('pop', T.e2y, 0.3); TL.sfx('warp', T.e2c + 0.5, 0.4); TL.sfx('ding_hi', T.e2D, 0.35); TL.sfx('pluck', T.d3, 0.3); TL.sfx('warp', T.e2v + 0.3, 0.4);
  TL.sfx('bell_soft', T.eig, 0.3); TL.sfx('whoosh', T.inv, 0.3); TL.sfx('pop', T.dt, 0.3); TL.sfx('check', T.d4b + 0.8, 0.35); TL.sfx('pop', T.b10, 0.3);
  TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj2b, 0.3); TL.sfx('error_buzz', T.tj3, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C28').e + 0.3, 0.4);

  // ── A：两副眼镜 ──
  const MA = [[2, 0], [1, 1]], MU = [[1, -1], [1, 1]];
  const P = new Plane({ ox: DX - 60, oy: DY + 110, u: 72, R: 7 });
  function shotA(D) {
    const a = B.win(T.o1 + 0.3, T.fr - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.lu + 0.2, T.lu + 2.0)) * (1 - smoother(prog(B.t, T.b2, T.b2 + 1.2)));
    const M = lerpM(I2, MA, s);
    B.warp(P, M, 1, a * gin(T.o1 + 0.4), D, { from: M, neu: B.t > T.ug ? 0.22 : 0.45, basis: B.t < T.ug, labels: true });
    const gu = a * gin(T.ug); if (gu > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 2, 0, Math.PI * 2); ctx.clip(); P.grid(ctx, { M: mm(M, MU), color: C.j, width: 2.2, alpha: gu * 0.55, grow: gin(T.ug, 1.2) }); ctx.restore();
      const O = P.S([0, 0], I2), q1 = P.S(mv(mm(M, MU), [1, 0]), I2), q2 = P.S(mv(mm(M, MU), [0, 1]), I2);
      arrow(ctx, O, q1, { color: C.i, width: 8, head: 24, alpha: gu }); arrow(ctx, O, q2, { color: C.j, width: 8, head: 24, alpha: gu });
      ctag(s > 0.5 ? 'L(u₁)' : 'u₁', q1[0] + 34, q1[1] - 10, { px: 30, a: gu, color: C.i, font: F.serif }); ctag(s > 0.5 ? 'L(u₂)' : 'u₂', q2[0] - 30, q2[1] - 24, { px: 30, a: gu, color: C.j, font: F.serif });
      const gr = a * gin(T.lu2 + 0.6) * (1 - gin(T.b2)); if (gr > 0) { B.line2(O, P.S([-1, -1], I2), C.i, gr, 4, [10, 8]); B.line2(P.S([-1, -1], I2), P.S([-2, 0], I2), C.j, gr, 4, [10, 8]); ctag('−u₁ + u₂', ...P.S([-2.2, -1.0], I2), { px: 26, a: gr, color: C.ink }); }
    }
    ctag('戴上斜眼镜', DX - 330, DY - 120, { px: 28, a: a * gin(T.ug) * (1 - gin(T.lu - 0.2)), color: C.j });
    texAt('L', DX - 150, DY - 380, 40, { alpha: a * gin(T.ex) * (1 - gin(T.u - 0.2)) });
    const gA = a * gin(T.exA); B.card(DX + 270, DY - 360, 230, 130, gA, C.i); texAt('A', DX + 270, DY - 360, 40, { alpha: gA });
    texAt('u', DX - 150, DY - 380, 36, { alpha: a * gin(T.u) * (1 - gin(T.lu - 0.2)) });
    texAt('Lu1', DX - 130, DY - 390, 30, { alpha: a * gin(T.lu) * (1 - gin(T.b - 0.2)) }); texAt('Lu2', DX - 130, DY - 285, 30, { alpha: a * gin(T.lu2) * (1 - gin(T.b - 0.2)) });
    const gB = a * gin(T.b); B.card(DX - 110, DY - 360, 230, 130, gB, C.j); texAt('B', DX - 110, DY - 360, 40, { alpha: gB });
    ctag('同一个 L，两个矩阵', DX + 80, DY - 260, { px: 32, a: a * gin(T.b2), color: OK, font: F.serif });
    ctag('怎么联系？', DX + 80, DY + 340, { px: 36, a: a * gin(T.d1), color: C.free, font: F.serif });
  }

  // ── B：翻译链 ──
  function shotChain() {
    const a = B.win(T.fr - 0.2, T.thm - 0.3); if (a <= 0) return;
    ctag('朋友的语言：用 u₁、u₂ 当坐标轴', DX, DY - 380, { px: 32, a, color: C.j });
    texAt('U', DX, DY - 300, 38, { alpha: a * gin(T.frU) });
    // 四个盒子：她的坐标 → 标准坐标 → 标准坐标 → 她的坐标（右往左读：画在左到右，箭头标签 U, A, U⁻¹）
    const xs = [DX + 360, DX + 120, DX - 120, DX - 360], y = DY - 120;
    const lab = ['她的坐标', '我们的坐标', '变换后', '她的坐标'], col = [C.j, C.i, C.i, C.j];
    const ts = [T.ch, T.ch1, T.ch2, T.ch3];
    xs.forEach((x, i) => { const g = a * gin(ts[i]); B.card(x, y, 140, 84, g, col[i]); ctag(lab[i], x, y, { px: 26, a: g, color: C.ink }); });
    const ak = ['Ua', 'Aa', 'Ui'], ac = [C.j, C.peri, C.j];
    for (let i = 0; i < 3; i++) { const g = a * gin(ts[i + 1]); arrow(ctx, [xs[i] - 78, y], [xs[i + 1] + 78, y], { color: ac[i], width: 5, head: 18, alpha: g, grow: gin(ts[i + 1], 0.6) }); texAt(ak[i], (xs[i] + xs[i + 1]) / 2, y - 40, 34, { alpha: g, color: ac[i] }); }
    ctag('← 从右往左读', DX, y + 80, { px: 30, a: a * gin(T.ch), color: C.peri });
    const g = a * gin(T.uau); B.card(DX, DY + 120, 880, 150, g, C.peri); texAt('UAU', DX, DY + 120, 32, { alpha: g, reveal: rv(T.uau, 2.0) });
    ctag('翻译 → 变换 → 翻译回去', DX, DY + 250, { px: 32, a: a * gin(cue('C08', '翻译，变换')), color: OK, font: F.serif });
  }

  // ── C：定理 + 交换图 ──
  function shotThm() {
    const a = B.win(T.thm - 0.2, T.def - 0.3); if (a <= 0) return;
    ctag('定理 4.3.1', DX - 200, DY - 380, { px: 32, a, color: C.peri, font: F.serif });
    B.card(DX + 120, DY - 380, 300, 84, a * gin(T.thmB), C.peri); texAt('thm', DX + 120, DY - 380, 44, { alpha: a * gin(T.thmB) });
    ctag('S：从 F 到 E 的过渡矩阵', DX, DY - 300, { px: 28, a: a * gin(T.thm + 1.0), color: C.inkMid });
    B.cd(DX, DY - 40, 560, 320, a * gin(T.cd - 0.3), {
      cw: 230, ch: 90,
      corners: { tl: { k: 'cvF', col: C.j, at: T.cd }, tr: { k: 'cLF', col: C.j, at: T.cd + 0.5 }, bl: { k: 'cvE', col: C.i, at: T.cdLow }, br: { k: 'cLE', col: C.i, at: T.cdLow + 0.8 } },
      arrows: [{ f: 'tl', t: 'tr', at: T.cd + 0.5, lk: 'cB', label: 'B', col: C.j }, { f: 'tl', t: 'bl', at: T.cdLow, lk: 'cS', label: 'S', col: C.peri }, { f: 'bl', t: 'br', at: T.cdLow + 0.8, lk: 'cA', label: 'A', col: C.i, side: 1 },
        { f: 'br', t: 'tr', at: T.cdLow + 1.6, lk: 'cSi', label: 'S⁻¹', col: C.peri, side: 1 }],
      run: { t0: T.cdLow, t1: T.cdLow + 3.0, path: ['tl', 'bl', 'br', 'tr'], col: C.peri },
    });
    const g = a * gin(T.d2); B.card(DX, DY + 250, 620, 90, g, C.ds ?? C.i); ctag('S = 第三章的过渡矩阵！', DX, DY + 250, { px: 32, a: g, color: C.ink });
    ctag('列 = 新基 F 在旧基 E 下的坐标', DX, DY + 345, { px: 30, a: a * gin(T.dir2), color: C.peri });
  }

  // ── D：定义 ──
  function shotDef() {
    const a = B.win(T.def - 0.2, T.e1 - 0.3); if (a <= 0) return;
    ctag('定义  相似', DX, DY - 340, { px: 38, a, color: C.peri, font: F.serif });
    B.card(DX, DY - 220, 520, 110, a * gin(T.def + 0.4), C.peri); texAt('def', DX - 60, DY - 220, 48, { alpha: a * gin(T.def + 0.4) }); ctag('S 可逆', DX + 160, DY - 220, { px: 30, a: a * gin(T.def + 0.4), color: C.inkMid });
    ctag('对称', DX - 330, DY - 70, { px: 30, a: a * gin(T.sym), color: C.i }); texAt('sym', DX + 30, DY - 70, 40, { alpha: a * gin(T.sym + 0.5) });
    ctag('传递', DX - 330, DY + 40, { px: 30, a: a * gin(T.tra), color: C.j }); texAt('tra', DX + 30, DY + 40, 40, { alpha: a * gin(T.tra + 0.3) });
    const g = a * gin(T.one); B.card(DX, DY + 200, 760, 110, g, OK); ctag('相似矩阵 = 同一个算子在不同基下的矩阵', DX, DY + 200, { px: 34, a: g, color: OK, font: F.serif });
  }

  // ── E：例 1 ──
  function shotE1() {
    const a = B.win(T.e1 - 0.2, T.e2 - 0.3); if (a <= 0) return;
    ctag('例 1  求导 D: P₃ → P₃', DX, DY - 390, { px: 32, a, color: C.peri });
    ctag('[1, x, x²]', DX - 230, DY - 320, { px: 30, a: a * gin(T.e1 + 0.5), color: C.i, font: F.serif }); texAt('e1B', DX - 230, DY - 210, 40, { alpha: a * gin(T.e1 + 1.0) });
    ctag('[1, 2x, 4x² − 2]', DX + 230, DY - 320, { px: 30, a: a * gin(T.e1n), color: C.j, font: F.serif }); texAt('e1A', DX + 230, DY - 210, 40, { alpha: a * gin(T.e1A) });
    texAt('e1d', DX, DY - 70, 34, { alpha: a * gin(T.e1d) });
    const g = a * gin(T.e1S); B.card(DX - 150, DY + 110, 320, 180, g, C.peri); texAt('e1S', DX - 150, DY + 110, 40, { alpha: g });
    ctag('列 = 新基的坐标（3.5 节）', DX - 150, DY + 230, { px: 24, a: g, color: C.inkMid });
    const g2 = a * gin(T.e1r); B.card(DX + 220, DY + 110, 280, 100, g2, OK); texAt('e1r', DX + 220, DY + 110, 44, { alpha: g2 });
    B.stamp(DX + 220, DY + 240, true, gin(T.e1r + 0.8, 0.4), a * gin(T.e1r + 0.8));
  }

  // ── F：例 2（3D）──
  const M2 = [[2, 2, 0], [1, 1, 2], [1, 1, 2]];
  const Y = [[1, -1, 0], [-2, 1, 1], [1, 1, 1]], YC = [C.i, C.j, C.k], LAM = [0, 1, 4];
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3 });
  function shotE2(D) {
    const a = B.win(T.e2 - 0.2, T.eig - 0.3); if (a <= 0) return;
    const alg = a * (1 - gin(T.e2v - 0.3, 0.5));
    if (alg > 0) {
      ctag('例 2', DX - 300, DY - 380, { px: 32, a: alg, color: C.peri }); texAt('e2A', DX - 300, DY - 270, 40, { alpha: alg });
      ctag('平平无奇？', DX - 300, DY - 140, { px: 28, a: alg * gin(cue('C18', '平平无奇')) * (1 - gin(T.e2y)), color: C.inkMid });
      texAt('e2y', DX + 160, DY - 290, 32, { alpha: alg * gin(T.e2y) });
      texAt('e2Ay', DX, DY - 110, 38, { alpha: alg * gin(T.e2c) });
      ctag('只伸缩，不转向', DX, DY - 30, { px: 30, a: alg * gin(T.e2c2), color: OK });
      const g = alg * gin(T.e2D); B.card(DX, DY + 140, 560, 190, g, C.peri); texAt('e2D', DX, DY + 140, 40, { alpha: g });
      ctag('换副眼镜就对角了？', DX, DY + 300, { px: 32, a: alg * gin(T.d3), color: C.free, font: F.serif });
    }
    const g3 = a * gin(T.e2v - 0.3, 0.5); if (g3 <= 0) return;
    const s = smoother(prog(B.t, T.e2v + 0.3, T.e2v + 2.6));
    P3.reset();
    P3.setPoint(0, [0, 0, 0], { r: 0.08, color: C.ink });
    const V = B.show3D(P3, D, g3, { el: 22, az: -35 + 6 * Math.sin(B.t * 0.25), dist: 15, axesA: 0.6, floorA: 0.3 });
    const k = 0.55;
    Y.forEach((y, i) => { const lam = lerp(1, LAM[i], s), q = y.map(v => v * k * lam); const p0 = V.pr([0, 0, 0]);
      B.line2(p0, V.pr(y.map(v => v * k)), YC[i], g3 * 0.35, 3, [8, 6]);
      if (lam > 0.03) V.v3([0, 0, 0], q, { color: YC[i], alpha: g3 }); else B.dot(...p0, 12, YC[i], g3);
      V.lab(q.map(v => v * 1.12 + 0.08), ['y₁', 'y₂', 'y₃'][i] + (s > 0.5 ? ['  ×0', '  ×1', '  ×4'][i] : ''), { px: 28, a: g3, color: YC[i], font: F.serif }); });
    ctag('新基下：沿每根轴各自伸缩', DX, DY - 390, { px: 32, a: g3, color: C.peri, font: F.serif });
    const gn = a * gin(T.e2n); B.card(DX + 280, DY + 300, 300, 170, gn, C.peri); texAt('Dn', DX + 280, DY + 300, 34, { alpha: gn });
  }

  function shotEig() {
    const a = B.win(T.eig - 0.2, T.inv - 0.3); if (a <= 0) return;
    ctag('怎么找到这组基？', DX, DY - 200, { px: 44, a, color: C.ink, font: F.serif });
    ctag('第六章  特征值', DX, DY - 80, { px: 64, a: a * gin(cue('C23', '特征值')), color: C.peri, font: F.serif });
    ctag('0、1、4 不是巧合', DX, DY + 40, { px: 34, a: a * gin(cue('C23', '零、一、四')), color: C.inkMid });
  }

  // ── G：不变量 ──
  function shotInv() {
    const a = B.win(T.inv - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('相似不变量：行列式、迹', DX, DY - 380, { px: 34, a, color: C.peri, font: F.serif });
    texAt('tr', DX, DY - 290, 40, { alpha: a * gin(T.inv2) });
    texAt('det', DX, DY - 190, 34, { alpha: a * gin(T.dt), reveal: rv(T.dt, 3.0) });
    texAt('trab', DX - 100, DY - 100, 36, { alpha: a * gin(T.dt2) }); ctag('习题 15', DX + 170, DY - 100, { px: 26, a: a * gin(T.dt2), color: C.inkMid });
    // D04 验算表
    const g = a * gin(T.d4); if (g > 0) {
      const xs = [DX - 230, DX + 30, DX + 250];
      ctag('开篇例子', xs[0], DY + 20, { px: 28, a: g, color: C.inkMid }); ctag('tr', xs[1], DY + 20, { px: 30, a: g, color: C.ink, font: F.serif }); ctag('det', xs[2], DY + 20, { px: 30, a: g, color: C.ink, font: F.serif });
      [['A', '2 + 1 = 3', '2', C.i], ['B', '2 + 1 = 3', '2', C.j]].forEach(([n, tr, dt, col], i) => { const y = DY + 80 + i * 56, gi = g * gin(T.d4 + 0.6 + i * 1.2);
        ctag(n, xs[0], y, { px: 32, a: gi, color: col, font: F.serif }); ctag(tr, xs[1], y, { px: 30, a: gi, color: C.ink }); ctag(dt, xs[2], y, { px: 30, a: a * gin(T.d4b), color: C.ink }); });
      B.stamp(DX - 390, DY + 120, true, gin(T.d4b + 0.8, 0.4), a * gin(T.d4b + 0.8));
    }
    const gb = a * gin(T.b10); B.card(DX, DY + 300, 600, 100, gb, C.peri); texAt('b10', DX, DY + 300, 40, { alpha: gb }); ctag('Test B 第 10 题', DX, DY + 230, { px: 26, a: gb, color: C.peri });
  }

  // ── H：同济 ──
  function shotTJ() {
    const a = B.win(T.tj - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('同济对照  第五章', DX, DY - 360, { px: 38, a, color: C.gpt, font: F.serif });
    B.card(DX, DY - 250, 300, 90, a * gin(T.tj + 0.6), C.gpt); texAt('tj', DX, DY - 250, 44, { alpha: a * gin(T.tj + 0.6) });
    ctag('P 的列 = 新基在旧基下的坐标', DX, DY - 165, { px: 28, a: a * gin(cue('G01', 'P的列')), color: C.ink });
    const g1 = a * gin(T.tj2), g2 = a * gin(T.tj2b);
    B.card(DX - 220, DY, 380, 150, g1, C.peri); ctag('Leon', DX - 220, DY - 40, { px: 30, a: g1, color: C.peri, font: F.serif }); ctag('从 F 到 E', DX - 220, DY + 20, { px: 32, a: g1, color: C.ink });
    B.card(DX + 220, DY, 380, 150, g2, C.gpt); ctag('同济', DX + 220, DY - 40, { px: 30, a: g2, color: C.gpt, font: F.serif }); ctag('从旧基到新基', DX + 220, DY + 20, { px: 32, a: g2, color: C.ink });
    ctag('⇄ 名字方向相反，矩阵同一个', DX, DY + 120, { px: 30, a: a * gin(cue('G02', '名字的方向')), color: C.free });
    const g3 = a * gin(T.tj3); B.card(DX, DY + 250, 640, 100, g3, OK); ctag('别背名字：先写定义式，再验一列', DX, DY + 250, { px: 32, a: g3, color: OK });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    ctag('同一个变换 · 两副眼镜 · 两个矩阵', DX, DY - 220, { px: 34, a: a * gin(T.sum + 0.3), color: C.ink });
    B.card(DX, DY - 100, 340, 100, a * gin(cue('C27', 'B等于')), C.peri); texAt('thm', DX, DY - 100, 48, { alpha: a * gin(cue('C27', 'B等于')) });
    ctag('翻译 → 变换 → 翻译回去', DX, DY + 10, { px: 32, a: a * gin(cue('C27', '从右往左')), color: C.inkMid });
    ctag('det、tr 不变', DX, DY + 110, { px: 36, a: a * gin(cue('C27', '相似矩阵的行列式')), color: OK });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('第四章复习', DX, DY - 20, { px: 96, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('Test A：十道判断题', DX, DY + 100, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.ex - 0.2, t1: T.thm - 0.3, head: '两副眼镜', items: [['标准基：A', T.exA, { color: C.i, mark: C.i }], ['u-基：B', T.b, { color: C.j, mark: C.j }], ['U⁻¹AU = B', T.uau, { color: C.peri, mark: C.peri }]] },
    { t0: T.thm - 0.3, t1: T.e1 - 0.3, head: '定理与定义', items: [['B = S⁻¹AS', T.thmB, { color: C.peri, mark: C.peri }], ['S：过渡矩阵', T.d2], ['相似：对称、传递', T.def]] },
    { t0: T.e1 - 0.3, t1: T.inv - 0.3, head: '两个例子', items: [['例 1：求导', T.e1], ['例 2：对角化', T.e2], ['特征值预告', T.eig, { color: C.free, mark: C.free }]] },
    { t0: T.inv - 0.3, t1: T.end - 0.3, head: '不变量与对照', items: [['det、tr 相同', T.inv, { color: OK, mark: OK }], ['TB10', T.b10], ['同济：名字相反', T.tj2]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(D); shotChain(); shotThm(); shotDef(); shotE1(); shotE2(D); shotEig(); shotInv(); shotTJ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
