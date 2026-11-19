// 第 7 章 7.7 最小二乘问题（Leon 9th §7.7：正规方程 cond 平方、经典 vs 修正施密特（Läuchli 例）、算法 7.7.1、豪斯霍尔德 QR、伪逆 A⁺ = VΣ⁺Uᵀ、定理 7.7.1、奇异值的稳定性）。
// 分镜：两条 16 格有效数字尺：cond(A) 吃掉 6 位、cond(AᵀA) 吃掉 12 位 → 三根几乎重合的列，经典施密特得到 60° 的“正交”向量，修正施密特得到 90°
//       → QᵀA、Qᵀb 分块图，c₂ 那块就是残差 → 3B1B：秩亏时解集是一条直线，A⁺b 是原点到它的垂足 → 上双对角图案 → 同济：通解 = 特解 + 齐次解 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, Plane, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_happy', 'gpt_explain'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '第七章 · 数值线性代数', title: '7.7 最小二乘问题', hi: 3, en: 'LEAST SQUARES PROBLEMS',
    titleEnd: () => B.L('C02').s, titlePx: 92,
    pre: { C02: 0.4, C04: 0.6, C06: 0.6, C08: 0.6, C10: 0.6, C13: 0.6, C15: 0.6, G01: 0.6, C16: 0.6 },
    post: { C01: 0.6, C02: 1.2, C03: 1.4, C04: 1.0, C05: 1.4, C06: 1.4, C07: 1.2, C08: 1.2, C09: 1.4, C10: 1.0, C11: 1.4, C12: 1.2, C13: 1.4, C14: 1.0, C15: 1.2, G01: 0.8, C16: 0.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o: L('C01').s, sq: L('C02').s, sq2: cue('C02', '奇异值的平方'), sq3: cue('C02', '条件数被平方了'), ex: L('C03').s, ex2: cue('C03', '二点四乘'), ex3: cue('C03', '六乘十的十二次方'), ex4: cue('C03', '翻了一倍'),
    d1: L('D01').s, cg: L('C04').s, cg2: cue('C04', '一次性减掉'), cg3: cue('C04', '不再正交'), la: L('C05').s, la2: cue('C05', '内积是零点五'), la3: cue('C05', '六十度'),
    mg: L('C06').s, mg2: cue('C06', '立刻从剩下的所有列里'), mg3: cue('C06', '十的负十六次方'), al: L('C07').s, al2: cue('C07', '右端也要逐步修正'), al3: cue('C07', '回代解'),
    hq: L('C08').s, hq2: cue('C08', '下面全是零'), hq3: cue('C08', '分成上下两段'), rs: L('C09').s, rs2: cue('C09', '加上c二的平方'), rs3: cue('C09', '残差就是c二的长度'), d2: L('D02').s,
    rk: L('C10').s, rk2: cue('C10', '无穷多个'), rk3: cue('C10', '该选哪一个'), pv: L('C11').s, pv2: cue('C11', '用奇异值分解'), pv3: cue('C11', '零还是零'), pv4: cue('C11', '解就是伪逆乘b'),
    th: L('C12').s, th2: cue('C12', '长度都比它大'), ft: L('C13').s, ft2: cue('C13', '垂足'), ft3: cue('C13', '和零空间正交'), cp: L('C14').s, cp2: cue('C14', '按这些系数加起来'),
    sv: L('C15').s, sv2: cue('C15', '上双对角形'), tj: L('G01').s, tj2: cue('G01', '通解'), tj3: cue('G01', '伪逆挑的'), sum: L('C16').s, end: L('C17').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.sq2, 0.3); TL.sfx('sting', T.sq3, 0.3); TL.sfx('pop', T.ex2, 0.3); TL.sfx('impact', T.ex3, 0.3); TL.sfx('pluck', T.d1, 0.3);
  TL.sfx('pop', T.cg2, 0.3); TL.sfx('crack', T.la2, 0.3); TL.sfx('buzz', T.la3, 0.22); TL.sfx('warp', T.mg2, 0.3); TL.sfx('ding_hi', T.mg3, 0.3); TL.sfx('pop', T.al, 0.3); TL.sfx('pop', T.al3, 0.3);
  TL.sfx('whoosh', T.hq, 0.3); TL.sfx('pop', T.hq3, 0.3); TL.sfx('pop', T.rs2, 0.3); TL.sfx('ding', T.rs3, 0.3); TL.sfx('pluck', T.d2, 0.3); TL.sfx('pop', T.rk2, 0.3); TL.sfx('pop', T.pv2, 0.3); TL.sfx('pop', T.pv4, 0.3);
  TL.sfx('sting', T.th, 0.3); TL.sfx('whoosh', T.ft2, 0.3); TL.sfx('ding_hi', T.ft3, 0.3); TL.sfx('pop', T.cp, 0.3); TL.sfx('pop', T.sv, 0.3); TL.sfx('pop', T.sv2, 0.3); TL.sfx('bell_soft', T.tj, 0.3); TL.sfx('pop', T.tj3, 0.3);
  TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C17').e + 0.3, 0.4);

  const ruler = (y, lost, a, label, col) => {
    for (let k = 0; k < 16; k++) { const x = DX - 375 + k * 50, ok = k < 16 - lost; ctx.save(); ctx.globalAlpha = a * (ok ? 0.85 : 0.3); ctx.fillStyle = ok ? OK : C.free; ctx.fillRect(x - 20, y - 26, 40, 52); ctx.restore(); }
    ctag(label, DX, y + 52, { px: 26, a, color: col });
  };

  // ── A：条件数平方 ──
  function shotA() {
    const a = B.win(T.o - 0.2, T.d1 - 0.3); if (a <= 0) return;
    B.card(DX, DY - 370, 340, 80, a * gin(T.o + 0.4), C.peri); texAt('ne', DX, DY - 370, 38, { alpha: a * gin(T.o + 0.4) });
    ctag('σᵢ(AᵀA) = σᵢ(A)²', DX, DY - 280, { px: 32, a: a * gin(T.sq2), color: C.ink, font: F.serif });
    texAt('sq', DX, DY - 210, 38, { alpha: a * gin(T.sq3) });
    texAt('Al', DX - 240, DY - 70, 28, { alpha: a * gin(T.ex) });
    ctag('两列几乎共线', DX + 200, DY - 70, { px: 28, a: a * gin(T.ex), color: C.inkMid });
    ruler(DY + 60, Math.round(6 * gin(T.ex2, 0.8)), a * gin(T.ex2), 'cond(A) ≈ 2.4 × 10⁶：丢约 6 位', C.ink);
    ruler(DY + 200, Math.round(12 * gin(T.ex3, 1.0)), a * gin(T.ex3), 'cond(AᵀA) ≈ 6 × 10¹²：丢约 12 位', C.free);
    ctag('丢掉的位数翻倍', DX, DY + 310, { px: 30, a: a * gin(T.ex4), color: C.free, font: F.serif });
  }

  // ── B：经典 vs 修正施密特 ──
  const PL = new Plane({ ox: DX - 230, oy: DY + 170, u: 140, R: 1.6 }), PR = new Plane({ ox: DX + 230, oy: DY + 170, u: 140, R: 1.6 });
  function shotB() {
    const a = B.win(T.d1 - 0.2, T.hq - 0.3); if (a <= 0) return;
    ctag('那用 QR 呢？关键：Q 怎么来的', DX, DY - 390, { px: 30, a: a * gin(T.d1), color: C.ds });
    const g0 = a * (1 - gin(T.al - 0.2));
    ctag('经典施密特：一次性减掉所有投影', DX, DY - 320, { px: 28, a: g0 * gin(T.cg2), color: C.ink });
    ctag('三列几乎相同，只差 10⁻⁸', DX, DY - 260, { px: 28, a: g0 * gin(T.la), color: C.inkMid });
    const gl = g0 * gin(T.la2 - 0.3); if (gl > 0) {
      const th = Math.PI / 3 * smoother(prog(B.t, T.la2 - 0.3, T.la2 + 0.8));
      B.vec(PL, [1, 0], gl, { color: C.i, label: 'q₂', px: 28 }); B.vec(PL, [Math.cos(th), Math.sin(th)], gl, { color: C.free, label: 'q₃', px: 28 });
      ctag('CGS：q₂·q₃ = 0.5，60°', PL.ox + 60, DY + 240, { px: 26, a: gl * gin(T.la3), color: C.free });
    }
    const gr = g0 * gin(T.mg); if (gr > 0) {
      const th = Math.PI / 2 * smoother(prog(B.t, T.mg2, T.mg2 + 1.0));
      B.vec(PR, [1, 0], gr, { color: C.i, label: 'q₂', px: 28 }); B.vec(PR, [Math.cos(th), Math.sin(th)], gr, { color: OK, label: 'q₃', px: 28 });
      if (th > 1.5) B.rightMark(PR.S([0, 0]), [1, 0], [0, 1], gr, { s: 22, color: C.ink });
      ctag('MGS：q₂·q₃ ≈ 10⁻¹⁶', PR.ox + 60, DY + 240, { px: 26, a: gr * gin(T.mg3), color: OK });
      ctag('修正施密特：得到一个 q，立刻从剩下的列里减掉', DX, DY - 200, { px: 26, a: gr * gin(T.mg2), color: OK });
    }
    const g1 = a * gin(T.al - 0.2); if (g1 <= 0) return;
    ctag('算法 7.7.1', DX, DY - 320, { px: 32, a: g1, color: C.peri, font: F.serif });
    ctag('① MGS 得到 Q、R', DX, DY - 230, { px: 30, a: g1, color: C.ink });
    ctag('② 右端逐步修正', DX, DY - 160, { px: 30, a: g1 * gin(T.al2), color: C.ink });
    B.card(DX, DY - 70, 640, 80, g1 * gin(T.al2), C.peri); texAt('mgs', DX, DY - 70, 32, { alpha: g1 * gin(T.al2) });
    ctag('③ 回代 Rx = c', DX, DY + 30, { px: 30, a: g1 * gin(T.al3), color: OK });
  }

  // ── C：豪斯霍尔德 QR 解最小二乘 ──
  const blk = (x, y, w, h, col, a, lb, lbc = C.ink, tri = false) => {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.35; ctx.fillStyle = col;
    if (tri) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill(); } else ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h); ctx.restore();
    if (lb) K_tag(lb, x + w / 2 + (tri ? w * 0.15 : 0), y + h / 2 - (tri ? h * 0.15 : 0), a, lbc);
  };
  const K_tag = (s, x, y, a, col) => ctag(s, x, y, { px: 30, a, color: col, font: F.serif });
  function shotC() {
    const a = B.win(T.hq - 0.2, T.rk - 0.3); if (a <= 0) return;
    ctag('豪斯霍尔德 QR：n 个反射', DX, DY - 390, { px: 32, a: a * gin(T.hq), color: C.peri, font: F.serif });
    texAt('hqr', DX, DY - 300, 34, { alpha: a * gin(T.hq3) });
    const g = a * gin(T.hq2 - 0.3), x0 = DX - 260, y0 = DY - 190;
    K_tag('QᵀA =', x0 - 90, y0 + 130, g, C.inkMid);
    blk(x0, y0, 160, 160, C.peri, g, 'R₁', C.ink, true); blk(x0, y0 + 160, 160, 110, C.inkMid, g * gin(T.hq2), 'O', C.inkMid);
    const gb = a * gin(T.hq3), xb = DX + 120;
    K_tag('Qᵀb =', xb - 90, y0 + 130, gb, C.inkMid);
    blk(xb, y0, 60, 160, C.j, gb, 'c₁', C.j); blk(xb, y0 + 160, 60, 110, C.free, gb, 'c₂', C.free);
    const gs = a * gin(T.rs); if (gs > 0) { B.card(DX, DY + 170, 860, 90, gs, C.peri); texAt('split', DX, DY + 170, 30, { alpha: gs, reveal: rv(T.rs, 2.0) }); }
    ctag('R₁x = c₁ → 第一项 = 0', DX - 200, DY + 260, { px: 26, a: a * gin(T.rs2 + 0.8), color: C.j });
    ctag('残差 = ‖c₂‖', DX + 230, DY + 260, { px: 32, a: a * gin(T.rs3), color: C.free, font: F.serif });
  }

  // ── D：秩亏 → 伪逆 → 垂足 ──
  const PP = new Plane({ ox: DX + 150, oy: DY + 170, u: 110, R: 3 });
  function shotD(D) {
    const a = B.win(T.rk - 0.2, T.sv - 0.3); if (a <= 0) return;
    ctag('A 不满秩：最小二乘解无穷多', DX, DY - 390, { px: 30, a: a * gin(T.rk2), color: C.ink });
    ctag('该选哪一个？离原点最近的', DX, DY - 335, { px: 28, a: a * gin(T.rk3), color: C.peri });
    texAt('pinv', DX, DY - 260, 28, { alpha: a * gin(T.pv2) * (1 - gin(T.ft - 0.2)) });
    texAt('mn', DX, DY - 260, 32, { alpha: a * gin(T.th) * gin(T.ft - 0.2) });
    // 平面：解集直线 x₁ + 2x₂ = 2；垂足 (0.4, 0.8)
    const g = a * gin(T.rk2); if (g > 0) {
      const Dd = { x: PP.ox - 80, y: PP.oy - 80, r: 300 };
      B.line2(PP.S([-2.4, 0]), PP.S([2.4, 0]), C.inkMid, g * 0.5, 2); B.line2(PP.S([0, -0.8]), PP.S([0, 2.0]), C.inkMid, g * 0.5, 2);
      B.curve(PP, Dd, x => (2 - x) / 2, -2.5, 2.8, g, { color: C.j, width: 5 }); B.tag('解集', PP.S([-2.0, 2.0])[0], PP.S([-2.0, 2.0])[1] - 20, { px: 26, a: g, color: C.j });
      const s = (B.t - T.rk2) * 0.35, z = [lerp(-1.6, 2.4, 0.5 + 0.5 * Math.sin(s)), 0]; z[1] = (2 - z[0]) / 2;
      const gz = g * (1 - gin(T.ft2)); B.vec(PP, z, gz, { color: C.inkMid, width: 4, head: 14, label: 'z', px: 26 });
      B.line2(PP.S([1.6, -0.8]), PP.S([-1.8, 0.9]), C.k, g * gin(T.ft3) * 0.7, 3, [8, 8]); B.tag('零空间方向', PP.S([1.3, -0.65])[0] - 40, PP.S([1.3, -0.65])[1] + 30, { px: 22, a: g * gin(T.ft3), color: C.k });
      const gf = g * gin(T.pv4 - 0.2); B.vec(PP, [0.4, 0.8], gf, { color: C.peri, width: 7, label: 'A⁺b', px: 28 });
      if (gin(T.ft2) > 0) B.rightMark(PP.S([0.4, 0.8]), [-2, 1], [-1, -2], g * gin(T.ft2), { s: 20, color: C.ink });
      ctag('‖z‖ > ‖A⁺b‖', PP.ox, DY + 300, { px: 28, a: g * gin(T.th2), color: OK, font: F.serif });
    }
    texAt('two', DX - 210, DY - 120, 26, { alpha: a * gin(T.cp) });
    ctag('Σ⁺：非零 σ 取倒数，零还是零', DX - 210, DY - 40, { px: 24, a: a * gin(T.pv3) * (1 - gin(T.cp - 0.2)), color: C.inkMid });
    ctag('定理 7.7.1', DX - 230, DY + 40, { px: 28, a: a * gin(T.th), color: C.peri });
  }

  // ── E：奇异值稳定 + 双对角 ──
  function shotE() {
    const a = B.win(T.sv - 0.2, T.tj - 0.3); if (a <= 0) return;
    ctag('奇异值本身也很稳', DX, DY - 380, { px: 34, a: a * gin(T.sv), color: C.peri, font: F.serif });
    B.card(DX, DY - 290, 440, 80, a * gin(T.sv + 0.8), OK); texAt('svs', DX, DY - 290, 38, { alpha: a * gin(T.sv + 0.8) });
    const n = 5, pat = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (j === i || j === i + 1 ? '×' : '')));
    B.mat(DX, DY - 80, pat, a * gin(T.sv2), { cw: 64, ch: 52, px: 26, col: (i, j) => (j === i ? C.peri : C.i) });
    ctag('① 豪斯霍尔德 → 上双对角形', DX, DY + 100, { px: 28, a: a * gin(T.sv2), color: C.i });
    ctag('② 戈卢布–赖因施迭代', DX, DY + 160, { px: 28, a: a * gin(cue('C15', '戈卢布')), color: C.peri });
  }

  // ── F：同济 + 小结 ──
  function shotF() {
    const a = B.win(T.tj - 0.2, 1e9); if (a <= 0) return;
    const g1 = a * (1 - gin(T.sum - 0.2));
    ctag('同济 · 第四章：非齐次方程组的通解', DX, DY - 300, { px: 32, a: g1, color: C.gpt, font: F.serif });
    ctag('x = η* + c ξ', DX, DY - 200, { px: 50, a: g1 * gin(T.tj2), color: C.ink, font: F.serif });
    ctag('特解 + 齐次解 = 那条解集直线', DX, DY - 120, { px: 30, a: g1 * gin(T.tj2 + 1.0), color: C.j });
    ctag('A⁺b：与齐次解正交的那个特解', DX, DY - 40, { px: 30, a: g1 * gin(T.tj3), color: C.peri });
    const g2 = a * gin(T.sum - 0.2) * (1 - gin(T.end - 0.2));
    [['正规方程：cond 平方', C.free, T.sum], ['修正施密特 > 经典', C.j, cue('C16', '修正的施密特')], ['豪斯霍尔德 QR 最常用', C.peri, cue('C16', '豪斯霍尔德Q R')], ['秩亏：SVD，取范数最小', OK, cue('C16', '秩亏的时候')]].forEach(([s, c, t0], i) => ctag(s, DX, DY - 260 + i * 80, { px: 38, a: g2 * gin(t0), color: c, font: F.serif }));
    const g3 = a * gin(T.end - 0.2);
    ctag('第七章新内容讲完', DX, DY - 140, { px: 34, a: g3, color: C.inkMid });
    ctag('复习', DX, DY - 30, { px: 96, a: g3 * gin(cue('C17', '接下来是复习') + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('先做十道判断题', DX, DY + 80, { px: 36, a: g3 * gin(cue('C17', '十道判断题')), color: C.ink });
  }

  const SECS = [
    { t0: T.sq - 0.2, t1: T.hq - 0.3, head: '正规方程的坑', items: [['cond(AᵀA) = cond(A)²', T.sq3, { color: C.free }], ['丢掉位数翻倍', T.ex4], ['经典施密特失去正交', T.la3, { color: C.free }], ['修正施密特', T.mg2, { color: OK }]] },
    { t0: T.hq - 0.2, t1: T.rk - 0.3, head: '豪斯霍尔德 QR', items: [['QᵀA = [R₁; O]', T.hq2, { color: C.peri }], ['Qᵀb = [c₁; c₂]', T.hq3, { color: C.j }], ['残差 = ‖c₂‖', T.rs3, { color: C.free }]] },
    { t0: T.rk - 0.2, t1: T.sum - 0.3, head: '秩亏', items: [['A⁺ = VΣ⁺Uᵀ', T.pv2, { color: C.peri }], ['A⁺b 范数最小', T.th2, { color: OK }], ['垂足 ⊥ 零空间', T.ft3, { color: C.k }], ['|σᵢ − ωᵢ| ≤ ‖A − B‖₂', T.sv]] },
    { t0: T.sum - 0.2, t1: 1e9, head: '小结', items: [['别用正规方程', T.sum]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotA(); shotB(); shotC(); shotD(D); shotE(); shotF(); B.left(SECS); });
  }
  return { TL, draw };
}
