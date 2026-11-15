// 第 4 章 4.2a 标准矩阵（Leon 9th §4.2 定理 4.2.1 + 复合）。
// 分镜：x = x₁î + x₂ĵ（分解路径）→ 变换 î→(1,−2)、ĵ→(3,0)，x 跟着走到 (5,2) → 两列拼成矩阵 → 定理卡
//       → 例 1 三列 → 旋转矩阵（θ 动画）→ TB5 / TB1(a) → TB2 平行四边形拆 v₃ → 复合：先转 90° 再剪切 → TB6 FR ≠ RF → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_ask', 'ds_happy', 'ds_proud', 'ds_think'] };

const mv = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
const mm = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
const rotM = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];

export async function setup(R) {
  const B = base(R, {
    assets, label: '第四章 · 线性变换', title: '4.2 标准矩阵', hi: 3, en: 'THE STANDARD MATRIX',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.6, C07: 0.4, C08: 0.6, C10: 0.6, C12: 0.6, C14: 0.6, C16: 0.6, C19: 0.6, C20: 0.4, C22: 0.6, C26: 0.6 },
    post: { C03: 0.8, C06: 0.8, C07: 1.0, C08: 0.6, C09: 0.6, C11: 0.6, C13: 0.6, C15: 0.6, C18: 0.8, C20: 1.0, C21: 0.6, C24: 0.6, C25: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, dec: L('C02').s, ldec: cue('C02', '所以'), all: L('C03').s, d1: L('D01').s,
    w: L('C04').s, wi: cue('C04', '把i帽送到'), wj: cue('C04', '把j帽送到'), x: L('C05').s, x2: cue('C05', '变换以后'), calc: L('C06').s, mat: L('C07').s, mx: cue('C07', '矩阵乘向量'),
    thm: L('C08').s, d2: L('D02').s, rem: L('C09').s,
    e1: L('C10').s, e1b: L('C11').s, e1c: cue('C11', '验证'), rot: L('C12').s, rot2: L('C13').s, r90: cue('C13', '西塔等于九十'),
    b5: L('C14').s, d3: L('D03').s, d3A: cue('D03', '拼起来'), b1: L('C15').s, b2: L('C16').s, b2v: L('C17').s, b2s: cue('C17', '先把v'), b2L: L('C18').s,
    cp: L('C19').s, d4: L('D04').s, cv: L('C20').s, cv2: cue('C20', '再做一个剪切'), cvr: cue('C20', '最后'), cw: L('C21').s, cw2: cue('C21', '先做的A'),
    b6: L('C22').s, b6r: L('C23').s, b6f: cue('C23', '关于y轴'), b6c: L('C24').s, d5: L('D05').s, rf: L('C25').s, rf2: cue('C25', '矩阵乘法'),
    sum: L('C26').s, d6: L('D06').s, end: L('C27').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.dec, 0.3); TL.sfx('ding_hi', T.all, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('warp', T.wi, 0.4); TL.sfx('warp', T.wj, 0.4); TL.sfx('pop', T.x, 0.3); TL.sfx('warp', T.x2, 0.4); TL.sfx('pop', T.calc, 0.3); TL.sfx('ding_hi', T.mat + 0.6, 0.35);
  TL.sfx('shimmer', T.thm, 0.4); TL.sfx('ding_hi', T.d2, 0.3); TL.sfx('whoosh', T.e1, 0.3); TL.sfx('pop', T.e1b, 0.3); TL.sfx('check', T.e1c + 0.8, 0.3);
  TL.sfx('warp', T.rot + 0.5, 0.4); TL.sfx('pop', T.rot2, 0.3); TL.sfx('whoosh', T.b5, 0.3); TL.sfx('pop', T.d3A, 0.3); TL.sfx('check', T.b1 + 0.4, 0.3);
  TL.sfx('whoosh', T.b2, 0.3); TL.sfx('pop', T.b2s, 0.3); TL.sfx('ding_hi', T.b2L + 1.5, 0.3); TL.sfx('pluck', T.d4, 0.3);
  TL.sfx('warp', T.cv + 0.3, 0.4); TL.sfx('warp', T.cv2, 0.4); TL.sfx('ding_hi', T.cvr, 0.3); TL.sfx('whoosh', T.b6, 0.3); TL.sfx('warp', T.b6r + 0.5, 0.4); TL.sfx('warp', T.b6f, 0.4);
  TL.sfx('pop', T.b6c, 0.3); TL.sfx('pluck', T.d5, 0.3); TL.sfx('error_buzz', T.rf2, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C27').e + 0.3, 0.4);

  const MA = [[1, 3], [-2, 0]], X = [-1, 2];
  const P = new Plane({ ox: DX - 60, oy: DY + 60, u: 52, R: 9 });

  // 分解路径：x₁ 份新 î（首尾相接）再 x₂ 份新 ĵ
  function path(Pl, M, v, a, g2 = 1) {
    if (a <= 0) return;
    const ci = mv(M, [v[0], 0]), all = mv(M, v);
    B.vec(Pl, ci, a * 0.9, { color: C.i, width: 6, head: 18 });
    B.vec(Pl, [all[0] - ci[0], all[1] - ci[1]], a * 0.9 * g2, { color: C.j, width: 6, head: 18, from: ci, grow: g2 });
  }

  // ── A：分解 + 变换 ──
  function shotW(D) {
    const a = B.win(T.o1 + 0.3, T.thm - 0.3); if (a <= 0) return;
    const si = smoother(prog(B.t, T.wi + 0.2, T.wi + 1.6)), sj = smoother(prog(B.t, T.wj + 0.2, T.wj + 1.6));
    const Mt = [[lerp(1, MA[0][0], si), lerp(0, MA[0][1], sj)], [lerp(0, MA[1][0], si), lerp(1, MA[1][1], sj)]];
    const sx = smoother(prog(B.t, T.x2 + 0.3, T.x2 + 2.2));
    const M = si + sj > 0 && B.t < T.x ? Mt : lerpM(I2, MA, B.t < T.x ? 0 : sx);
    const Mg = B.t < T.x ? Mt : M;
    B.warp(P, Mg, 1, a * gin(T.o1 + 0.5), D, { from: Mg, neu: 0.5 });
    // 例向量 x
    const gx = a * gin(T.dec + 0.5) * (1 - gin(T.w - 0.3)) + a * gin(T.x);
    const v = mv(Mg, X);
    path(P, Mg, X, gx * 0.85, B.t < T.x ? gin(T.dec + 1.2) : 1);
    B.vec(P, v, gx, { color: C.peri, width: 9, head: 26 }); B.dot(...P.S(v), 7, C.peri, gx);
    ctag(B.t < T.x ? 'x' : (sx < 0.98 ? 'x' : 'L(x) = (5, 2)'), ...P.S([v[0] - (sx < 0.98 ? 0.3 : 1.2), v[1] + 0.6]), { px: 34, a: gx, color: C.peri, font: F.serif });
    // 标签：落点坐标
    const lab = a * gin(T.wi + 1.4) * (1 - gin(T.x - 0.3)) ;
    ctag('(1, −2)', ...P.S([2.3, -1.8]), { px: 28, a: lab, color: C.i }); ctag('(3, 0)', ...P.S([3.4, 0.6]), { px: 28, a: a * gin(T.wj + 1.4) * (1 - gin(T.x - 0.3)), color: C.j });
    // 公式
    texAt('dec', DX, DY - 380, 40, { alpha: a * gin(T.dec) * (1 - gin(T.w - 0.3)) });
    texAt('Ldec', DX, DY - 310, 40, { alpha: a * gin(T.ldec) * (1 - gin(T.w - 0.3)) });
    const g3 = a * gin(T.all) * (1 - gin(T.w - 0.3)); B.card(DX, DY + 300, 640, 84, g3, OK); ctag('两个落点 → 整张网格', DX, DY + 300, { px: 36, a: g3, color: OK });
    texAt('x', DX - 210, DY - 330, 38, { alpha: a * gin(T.x) * (1 - gin(T.calc - 0.2)) });
    texAt('calc', DX + 30, DY - 370, 36, { alpha: a * gin(T.calc) * (1 - gin(T.mat - 0.2)) });
    texAt('Mx', DX, DY - 370, 40, { alpha: a * gin(T.mx) });
    const gm = a * gin(T.mat) * (1 - gin(T.mx - 0.2)); if (gm > 0) { B.card(DX + 300, DY + 270, 260, 170, gm, C.peri); texAt('M', DX + 300, DY + 270, 48, { alpha: gm }); }
  }

  // ── B：定理卡 ──
  function shotThm() {
    const a = B.win(T.thm - 0.2, T.e1 - 0.3); if (a <= 0) return;
    ctag('定理 4.2.1  标准矩阵', DX, DY - 330, { px: 38, a, color: C.peri, font: F.serif });
    texAt('thm', DX, DY - 220, 40, { alpha: a * gin(T.thm + 0.6) });
    const g = a * gin(T.thm + 1.6); B.card(DX, DY - 90, 420, 96, g, C.peri); texAt('aj', DX, DY - 90, 46, { alpha: g, color: C.peri });
    // 列 = 落脚点 小图
    const g2 = a * gin(T.d2); if (g2 > 0) {
      const xs = [DX - 260, DX - 90, DX + 90, DX + 260], cols = [C.i, C.j, C.k, C.inkMid], nm = ['e₁', 'e₂', '…', 'eₙ'];
      xs.forEach((x, i) => { const gi = g2 * gin(T.d2 + 0.2 * i); ctx.save(); ctx.globalAlpha = gi; ctx.strokeStyle = cols[i]; ctx.lineWidth = 5; ctx.strokeRect(x - 40, DY + 30, 80, 180); ctx.restore();
        ctag(nm[i] === '…' ? '…' : 'L(' + nm[i] + ')', x, DY + 120, { px: 30, a: gi, color: cols[i], font: F.serif }); ctag(nm[i] === '…' ? '' : nm[i] + ' 的落点', x, DY + 240, { px: 22, a: gi, color: C.inkMid }); });
    }
    ctag('记住：列 = 基向量的落脚点', DX, DY + 330, { px: 38, a: a * gin(T.rem), color: OK, font: F.serif });
  }

  // ── C：例 1 ──
  function shotE1() {
    const a = B.win(T.e1 - 0.2, T.rot - 0.3); if (a <= 0) return;
    ctag('例 1  L: ℝ³ → ℝ²', DX, DY - 380, { px: 32, a, color: C.peri });
    texAt('ex1', DX, DY - 310, 42, { alpha: a });
    texAt('ex1e', DX, DY - 180, 38, { alpha: a * gin(cue('C10', 'e一的像')), reveal: rv(cue('C10', 'e一的像'), 3.0) });
    const g = a * gin(T.e1b); B.card(DX, DY - 10, 440, 150, g, C.peri); texAt('ex1A', DX, DY - 10, 46, { alpha: g });
    texAt('ex1c', DX, DY + 170, 42, { alpha: a * gin(T.e1c) });
    B.stamp(DX + 300, DY + 170, true, gin(T.e1c + 0.8, 0.4), a * gin(T.e1c + 0.8));
  }

  // ── D：旋转 ──
  const PR = new Plane({ ox: DX - 120, oy: DY + 80, u: 150, R: 3 });
  function shotRot(D) {
    const a = B.win(T.rot - 0.2, T.b5 - 0.3); if (a <= 0) return;
    const th0 = 0.7, th = th0 * smoother(prog(B.t, T.rot + 0.5, T.rot + 2.0)) + (Math.PI / 2 - th0) * smoother(prog(B.t, T.r90, T.r90 + 1.4));
    const M = rotM(th); B.warp(PR, M, 1, a, D, { from: M, neu: 0.45 });
    // 角度弧
    const O = PR.S([0, 0]), ga = a * gin(T.rot + 0.6); if (ga > 0 && th > 0.05) { ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(O[0], O[1], 60, -th, 0); ctx.stroke(); ctx.restore(); texAt('th', O[0] + 80 * Math.cos(th / 2), O[1] - 80 * Math.sin(th / 2), 32, { alpha: ga }); }
    const pi = PR.S(mv(M, [1, 0])), pj = PR.S(mv(M, [0, 1]));
    ctag('(cos θ, sin θ)', pi[0] + 90, pi[1] - 30, { px: 26, a: a * gin(cue('C12', 'i帽落到')) * (1 - gin(T.r90 - 0.2)), color: C.i });
    ctag('(−sin θ, cos θ)', pj[0] - 40, pj[1] - 40, { px: 26, a: a * gin(cue('C12', 'j帽落到')) * (1 - gin(T.r90 - 0.2)), color: C.j });
    const g = a * gin(T.rot2); B.card(DX + 230, DY - 300, 520, 150, g, C.peri); texAt('rot', DX + 230, DY - 300, 40, { alpha: g });
    const g2 = a * gin(T.r90); B.card(DX + 230, DY + 330, 520, 120, g2, C.peri); texAt('rot90', DX + 230, DY + 330, 38, { alpha: g2 });
  }

  // ── E：TB5 + TB1(a) ──
  function shotB5() {
    const a = B.win(T.b5 - 0.2, T.b2 - 0.3); if (a <= 0) return;
    ctag('Test B 第 5 题', DX, DY - 380, { px: 32, a, color: C.peri }); texAt('b5', DX, DY - 310, 38, { alpha: a });
    ctag('e₁ → (1, 1, 3)ᵀ', DX - 200, DY - 200, { px: 32, a: a * gin(T.d3 + 0.6), color: C.i }); ctag('e₂ → (1, −1, 2)ᵀ', DX + 200, DY - 200, { px: 32, a: a * gin(cue('D03', '代入e二')), color: C.j });
    const g = a * gin(T.d3A); B.card(DX, DY - 50, 300, 200, g, C.peri); texAt('b5A', DX, DY - 50, 44, { alpha: g });
    ctag('3 × 2：三行两列', DX + 300, DY - 50, { px: 28, a: a * gin(cue('D03', '三行两列')), color: C.inkMid });
    ctag('Test B 第 1(a) 题', DX, DY + 130, { px: 30, a: a * gin(T.b1), color: C.peri }); texAt('b1a', DX - 40, DY + 230, 40, { alpha: a * gin(T.b1 + 0.3) });
    B.stamp(DX + 290, DY + 230, true, gin(cue('C15', '所以它是线性'), 0.4), a * gin(cue('C15', '所以它是线性')), '线性');
  }

  // ── F：TB2 ──
  const PB = new Plane({ ox: DX + 200, oy: DY + 240, u: 40, R: 8 });
  function shotB2(D) {
    const a = B.win(T.b2 - 0.2, T.cp - 0.3); if (a <= 0) return;
    ctag('Test B 第 2 题', DX, DY - 390, { px: 30, a, color: C.peri }); texAt('b2', DX, DY - 310, 36, { alpha: a });
    texAt('b2b', DX - 220, DY - 170, 36, { alpha: a * gin(T.b2v) }); texAt('b2v', DX - 220, DY - 60, 40, { alpha: a * gin(T.b2s), color: C.peri });
    // 小平面：v₃ = 3v₁ + 2v₂
    const g = a * gin(T.b2v + 0.4); if (g > 0) {
      ctx.save(); ctx.globalAlpha = g * 0.35; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; for (let k = -2; k <= 4; k++) { const p = PB.S([k, -1]), q = PB.S([k, 8]); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); }
      for (let k = -1; k <= 8; k++) { const p = PB.S([-2, k]), q = PB.S([4, k]); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); } ctx.restore();
      const gp = gin(T.b2s + 0.4, 1.2);
      B.vec(PB, [1, 1], g, { color: C.i, width: 6, head: 18, label: 'v₁', px: 26 }); B.vec(PB, [-1, 2], g, { color: C.j, width: 6, head: 18, label: 'v₂', px: 26, lx: -40 });
      B.vec(PB, [3, 3], g * gp * 0.7, { color: C.i, width: 4, head: 14 }); B.vec(PB, [-2, 4], g * gp * 0.7, { color: C.j, width: 4, head: 14, from: [3, 3], grow: gp });
      B.vec(PB, [1, 7], g * gin(T.b2s + 1.6), { color: C.peri, width: 7, head: 22, label: 'v₃', px: 28, lx: -50 });
    }
    const gL = a * gin(T.b2L); B.card(DX - 40, DY + 380, 820, 110, gL, C.peri); texAt('b2L', DX - 40, DY + 380, 34, { alpha: gL, reveal: rv(T.b2L, 3.0) });
    ctag('不用求矩阵！', DX - 260, DY + 80, { px: 34, a: a * gin(T.b2v), color: OK, font: F.serif });
  }

  // ── G：复合 ──
  const PC = new Plane({ ox: DX - 40, oy: DY + 60, u: 120, R: 4 });
  const RA = [[0, -1], [1, 0]], SB = [[1, 1], [0, 1]], BA = mm(SB, RA);
  function shotComp(D) {
    const a = B.win(T.cp - 0.2, T.b6 - 0.3); if (a <= 0) return;
    const s1 = smoother(prog(B.t, T.cv + 0.3, T.cv + 1.8)), s2 = smoother(prog(B.t, T.cv2, T.cv2 + 1.6));
    const M = s2 > 0 ? lerpM(RA, BA, s2) : lerpM(I2, RA, s1);
    B.warp(PC, M, 1, a * gin(T.cv - 0.3), D, { from: M, neu: 0.5, square: true });
    ctag('L₁：转 90°（A）', DX - 260, DY - 300, { px: 30, a: a * gin(T.cv + 0.3), color: C.i });
    ctag('L₂：剪切（B）', DX + 260, DY - 300, { px: 30, a: a * gin(T.cv2), color: C.j });
    texAt('comp', DX, DY - 380, 40, { alpha: a * gin(T.cp) * (1 - gin(T.cv - 0.3)) + a * gin(T.cw) });
    ctag('谁在前面？', DX, DY - 300, { px: 40, a: a * gin(T.d4) * (1 - gin(T.cv - 0.3)), color: C.free, font: F.serif });
    const g = a * gin(T.cvr); B.card(DX + 120, DY + 330, 660, 130, g, C.peri); texAt('rs', DX + 120, DY + 330, 34, { alpha: g });
    ctag('← 从右往左读', DX + 230, DY - 230, { px: 32, a: a * gin(T.cw2), color: C.peri });
    const pi = PC.S(mv(M, [1, 0])); ctag('(1, 1)', pi[0] + 50, pi[1] - 10, { px: 28, a: a * gin(T.cvr), color: C.i });
    const pj = PC.S(mv(M, [0, 1])); ctag('(−1, 0)', pj[0] - 50, pj[1] - 30, { px: 28, a: a * gin(T.cvr), color: C.j });
  }

  // ── H：TB6 ──
  const PF = new Plane({ ox: DX - 230, oy: DY + 90, u: 130, R: 3 });
  const RR = rotM(Math.PI / 6), FF = [[-1, 0], [0, 1]], FR = mm(FF, RR), RF = mm(RR, FF);
  function shotB6(D) {
    const a = B.win(T.b6 - 0.2, T.sum - 0.3); if (a <= 0) return;
    const s1 = smoother(prog(B.t, T.b6r + 0.5, T.b6r + 1.9)), s2 = smoother(prog(B.t, T.b6f + 0.3, T.b6f + 1.8));
    const M = s2 > 0 ? lerpM(RR, FR, s2) : lerpM(I2, RR, s1);
    B.warp(PF, M, 1, a, D, { from: M, neu: 0.45 });
    // RF 幽灵
    const gr = a * gin(T.rf); if (gr > 0) { const O = PF.S([0, 0]); B.line2(O, PF.S(mv(RF, [1, 0])), C.free, gr, 6, [12, 8]); B.line2(O, PF.S(mv(RF, [0, 1])), C.free, gr * 0.6, 4, [12, 8]); const q = PF.S(mv(RF, [1, 0])); ctag('RF 的 î', q[0] - 20, q[1] + 34, { px: 26, a: gr, color: C.free }); }
    ctag('Test B 第 6 题：先转 30°，再关于 y 轴反射', DX, DY - 390, { px: 30, a, color: C.peri });
    const X0 = DX + 250;
    texAt('b6R', X0, DY - 270, 34, { alpha: a * gin(T.b6r) }); texAt('b6F', X0, DY - 140, 34, { alpha: a * gin(T.b6f) });
    const g = a * gin(T.b6c); B.card(X0, DY + 10, 380, 130, g, C.peri); texAt('FR', X0, DY + 10, 32, { alpha: g });
    ctag('?', X0, DY + 160, { px: 50, a: a * gin(T.d5) * (1 - gin(T.rf)), color: C.free, font: F.serif });
    const g2 = a * gin(T.rf); B.card(X0, DY + 160, 380, 130, g2, C.free); texAt('RF', X0, DY + 160, 32, { alpha: g2 });
    texAt('neq', X0, DY + 290, 44, { alpha: a * gin(T.rf2), color: C.free });
  }

  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 300, { px: 40, a, color: C.peri, font: F.serif });
    B.card(DX, DY - 170, 520, 96, a * gin(T.sum + 0.3), C.peri); texAt('sum1', DX, DY - 170, 46, { alpha: a * gin(T.sum + 0.3) });
    B.card(DX, DY - 40, 520, 96, a * gin(cue('C26', '复合')), C.j); texAt('sum2', DX, DY - 40, 44, { alpha: a * gin(cue('C26', '复合')) });
    ctag('先做的写右边', DX, DY + 60, { px: 32, a: a * gin(cue('C26', '先做的')), color: C.inkMid });
    ctag('换一组别的基？', DX, DY + 180, { px: 40, a: a * gin(T.d6), color: C.free, font: F.serif });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('任意基下的矩阵', DX, DY - 20, { px: 88, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
  }

  const SECS = [
    { t0: T.dec - 0.2, t1: T.thm - 0.3, head: '盯住 î、ĵ', items: [['x = x₁î + x₂ĵ', T.dec], ['L(x) 跟着走', T.ldec], ['两列 = 矩阵', T.mat, { color: C.peri, mark: C.peri }]] },
    { t0: T.thm - 0.3, t1: T.b2 - 0.3, head: '定理 4.2.1', items: [['aⱼ = L(eⱼ)', T.thm, { color: C.peri, mark: C.peri }], ['例 1', T.e1], ['旋转矩阵', T.rot], ['TB5、TB1(a)', T.b5]] },
    { t0: T.b2 - 0.3, t1: T.cp - 0.3, head: 'Test B 第 2 题', items: [['拆 v₃', T.b2v], ['L(v₃) = (0, 17)ᵀ', T.b2L, { color: OK, mark: OK }]] },
    { t0: T.cp - 0.3, t1: T.sum - 0.3, head: '复合 = 乘积', items: [['先做的写右边', T.cw2, { color: C.peri, mark: C.peri }], ['TB6：FR', T.b6], ['FR ≠ RF', T.rf2, { color: C.free, mark: C.free }]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotW(D); shotThm(); shotE1(); shotRot(D); shotB5(); shotB2(D); shotComp(D); shotB6(D); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
