// 特别篇 6 · 第 2 段：最新卷第 4 题补完（2025–26 第 4 题，24 分）。
// 分镜：原题三步 → 三问标签 → [A|b] 逐步消元（5 步，改动格闪青）→ 圈主元 / 自由列染色 → 末行 0 = 0 + 秩卡
//       → 通解（列向量形式，特解 / 零空间分色）→ 3D：过原点平面平移到 x₀ → 验算特解
//       → 四个子空间表（逐行出现）→ N(Aᵀ) 点乘验算 → 丝线 a₄ = −a₁ + a₃ → 维数小表两个等式亮起。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba, load3D } from '../../sp/common.js';
import { kit, neg, vec } from '../kit.js';

export const assets = { chars: ['claude_point', 'claude_explain', 'claude_write', 'claude_smile', 'ds_ask', 'gpt_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2526_q4']);
  const B = base(R, {
    assets, label: '特别篇 6 · 秩与四个子空间', title: '最新卷第 4 题', hi: 3, en: '2025–26 · Q4 · 24 PTS',
    titleEnd: () => B.L('C01').s + 0.2,
    pre: { C01: 0.6, C03: 0.6, C05: 0.4, C07: 0.6, C08: 0.8, C09: 0.8, C12: 0.6, G03: 0.4 },
    post: { C02: 0.8, C03: 1.4, C04: 1.6, C05: 1.2, C06: 1.0, C07: 1.6, C08: 1.6, G01: 1.0, C09: 1.0, C10: 1.0, C11: 0.8, G02: 1.0, C12: 1.4, G03: 1.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const S = [
    [[1, 3, 3, 2, 7], [2, 6, 9, 7, 20], [-1, -3, 3, 4, 5]],
    [[1, 3, 3, 2, 7], [0, 0, 3, 3, 6], [-1, -3, 3, 4, 5]],
    [[1, 3, 3, 2, 7], [0, 0, 3, 3, 6], [0, 0, 6, 6, 12]],
    [[1, 3, 3, 2, 7], [0, 0, 3, 3, 6], [0, 0, 0, 0, 0]],
    [[1, 3, 3, 2, 7], [0, 0, 1, 1, 2], [0, 0, 0, 0, 0]],
    [[1, 3, 0, -1, 1], [0, 0, 1, 1, 2], [0, 0, 0, 0, 0]],
  ];
  const T = [-1, cue('C03', '第二行减两倍'), cue('C03', '第三行加第一行'), cue('C04', '第三行减两倍'), cue('C04', '第二行除以三'), cue('C04', '第一行减三倍')];
  const OPS = [null, [[1, 'R₂ − 2R₁']], [[2, 'R₃ + R₁']], [[2, 'R₃ − 2R₂']], [[1, 'R₂ ÷ 3']], [[0, 'R₁ − 3R₂']]];
  const tPiv = cue('C05', '主元在'), tFree = cue('C05', '自由变量');

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', s('C01') + 0.2, 0.35); TL.sfx('stamp', s('C01') + 2.6, 0.35);
  ['求全部解', '四个基本子空间', '把a四'].forEach(w => TL.sfx('pop', cue('C02', w), 0.28));
  T.slice(1).forEach(x => TL.sfx('pluck', x, 0.3));
  TL.sfx('ding_hi', s('C05') + 0.3, 0.3); [0, 1].forEach(i => TL.sfx('pop', tPiv + i * 0.35, 0.3)); TL.sfx('zap', tFree, 0.25);
  TL.sfx('tick', s('D01') + 0.4, 0.25); TL.sfx('ding_hi', cue('C06', '都是二'), 0.3);
  TL.sfx('pop', cue('C07', '令x二'), 0.28); TL.sfx('impact', cue('C07', '写成向量形式') + 0.4, 0.3);
  TL.sfx('warp', s('C08') + 0.3, 0.3); TL.sfx('whoosh', cue('C08', '平移到'), 0.35); TL.sfx('shimmer', cue('C08', '特解负责'), 0.3);
  TL.sfx('check', e('G01') - 0.5, 0.3);
  TL.sfx('tick', s('C09') + 0.4, 0.28); TL.sfx('tick', cue('C09', '行空间的基'), 0.28); TL.sfx('tick', s('C10') + 0.3, 0.28); TL.sfx('slam', cue('C10', '注意'), 0.3);
  TL.sfx('tick', s('C11') + 0.3, 0.28); TL.sfx('ding_hi', cue('C11', '得到y'), 0.3);
  TL.sfx('check', cue('G02', '等于零'), 0.3); TL.sfx('check', cue('G02', '也等于零'), 0.3);
  TL.sfx('pluck', cue('C12', '所以a四'), 0.35); TL.sfx('pluck', cue('C12', '所以a四') + 0.45, 0.35); TL.sfx('stamp', cue('C12', '正是a四'), 0.35);
  TL.sfx('ding_hi', cue('G03', '正是列数'), 0.3); TL.sfx('ding_hi', cue('G03', '正是行数'), 0.3); TL.sfx('bell_soft', cue('G03', '对上了'), 0.35);

  // ── 3D ──
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3, nPlanes: 2, nLines: 2, nPoints: 3 });

  // ── 主板 ──
  const piv = [[0, 0], [1, 2]];
  const isPivCol = j => j === 0 || j === 2, isFree = j => j === 1 || j === 3;
  function board(A) {
    const lift = smoother(prog(B.t, s('C09') - 0.6, s('C09') + 0.2));
    const hide3 = 1 - B.win(s('C08') - 0.2, e('G01') + 0.3);
    const y = lerp(DY - 230, DY - 290, lift), px = lerp(40, 34, lift);
    const fin = B.t >= T[5];
    const { M, k } = K.steps(S, T, OPS, { x: DX + 30, y, px, bar: 4, a: A * hide3, hi: (i, j, kk) => {
      if (kk < 5) return null;
      if (B.t > s('C12') - 0.2 && j === 3 && i < 2) return C.k;
      if (B.t > tPiv && piv.some(([r, c]) => r === i && c === j)) return C.i;
      if (B.t > tFree && isFree(j)) return C.free;
      if (j === 4 && B.t > s('C07')) return C.peri;
      return null;
    } });
    if (hide3 <= 0) return M;
    ['x₁', 'x₂', 'x₃', 'x₄', 'b'].forEach((v, j) => ctag(v, M.cell(0, j)[0], y - M.h / 2 - 28, { px: 24, a: A * hide3 * gin(s('C05')), color: j === 4 ? C.peri : isFree(j) ? C.free : isPivCol(j) ? C.i : C.inkMid }));
    if (fin) piv.forEach(([r, c], q) => { const [x, yy] = M.cell(r, c); K.ring(x, yy, 24, C.i, A * hide3, prog(B.t, tPiv + q * 0.35, tPiv + q * 0.35 + 0.5)); });
    // RREF 标签
    ctag('RREF', DX + 30 - M.w / 2 - 90, y, { px: 28, a: A * hide3 * gin(s('C05')) * (1 - gin(T[5] - 0.4) * 0 ), color: C.i, font: F.serif });
    return M;
  }

  function shotMain() {
    const a = B.win(s('C01'), 1e9); if (a <= 0) return;
    const A = a * gin(cue('C01', 'A的三行') - 0.2); if (A <= 0) return;
    B.qhead('2025–2026 期中 · 第 4 题 · 24 分', A * (1 - gin(s('C08') - 0.3) * (1 - gin(e('G01') + 0.3))));
    const M = board(A);
    // C01：b 列提示
    ctag('b = (7, 20, 5)', DX + 30, DY - 80, { px: 30, a: A * B.win(cue('C01', 'b等于'), s('C03') - 0.2), color: C.peri, font: F.serif });
    // C02：三问标签
    { const g = A * B.win(s('C02'), s('C03') + 0.3);
      [['(a) Ax = b 全部解', '求全部解'], ['(b) 四个基本子空间的基', '四个基本子空间'], ['(c) a₄ 用其他列表示', '把a四']].forEach(([tx, w], i) => {
        const gi = g * gin(cue('C02', w)); B.card(DX + 30, DY + 10 + i * 78, 560, 62, gi * 0.95, [OK, C.j, C.k][i]); ctag(tx, DX + 30, DY + 10 + i * 78, { px: 30, a: gi, color: C.ink });
      });
      K.pill('回看 速成版 第 8 段', DX + 30, DY + 260, C.ds, g * gin(cue('C02', '速成版讲过')), 22);
    }
    // C03/C04：逐个数小字
    [['C03', '(2, 6, 9, 7 | 20) − 2·(1, 3, 3, 2 | 7) = (0, 0, 3, 3 | 6)', '第二行减两倍', '第三行加第一行'], ['C03', '(−1, −3, 3, 4 | 5) + (1, 3, 3, 2 | 7) = (0, 0, 6, 6 | 12)', '第三行加第一行', null],
     ['C04', '(0, 0, 6, 6 | 12) − 2·(0, 0, 3, 3 | 6) = 0', '第三行减两倍', '第二行除以三'], ['C04', '(1, 3, 3, 2 | 7) − 3·(0, 0, 1, 1 | 2) = (1, 3, 0, −1 | 1)', '第一行减三倍', null]]
      .forEach(([id, tx, w0, w1]) => ctag(tx, DX + 30, DY - 40, { px: 28, a: A * B.win(cue(id, w0), w1 ? cue(id, w1) - 0.2 : e(id) + 0.6), color: C.j, font: F.serif }));
    // C05：主元 / 自由
    ctag('主元列：1、3　自由变量：x₂、x₄', DX + 30, DY - 40, { px: 30, a: A * B.win(tPiv, s('D01')), color: C.i });
    // D01 / C06：末行 + 秩
    if (B.t > s('D01') - 0.2 && B.t < s('C07')) {
      const g = A * B.win(s('D01'), s('C07') - 0.1);
      K.rowBox(M, 2, 0, 4, C.j, g);
      ctag('0x₁ + 0x₂ + 0x₃ + 0x₄ = 0', DX + 30, DY - 40, { px: 32, a: g, color: C.j, font: F.serif });
      ctag('若是 “0 = 非零” → 无解', DX + 30, DY + 30, { px: 28, a: g * gin(cue('C06', '零等于非零')), color: C.free });
      const gr = g * gin(cue('C06', '这里A的秩'));
      B.card(DX + 30, DY + 130, 640, 90, gr * 0.95, OK);
      ctag('r(A) = r(A | b) = 2  →  有解', DX + 30, DY + 112, { px: 32, a: gr, color: OK, font: F.serif });
      ctag('自由变量 2 个 → 无穷多解', DX + 30, DY + 152, { px: 28, a: g * gin(cue('C06', '两个自由变量')), color: C.ink });
      B.burst(DX + 30, DY + 130, cue('C06', '都是二'), OK, { r1: 220 });
    }
    // C07：通解
    { const g = A * B.win(s('C07'), s('C08') - 0.2);
      if (g > 0) {
        ctag('x₂ = s，x₄ = t', DX + 30, DY - 70, { px: 30, a: g * gin(cue('C07', '令x二')), color: C.free, font: F.serif });
        ctag('x₁ = 1 − 3s + t，　x₃ = 2 − t', DX + 30, DY - 20, { px: 30, a: g * gin(cue('C07', 'x一等于')), color: C.ink, font: F.serif });
        const tv = cue('C07', '写成向量形式');
        texAt('gen', DX + 30, DY + 140, 40, { alpha: g * gin(tv), reveal: rv(tv, e('C07') - tv - 0.4) });
        B.ghalo('gen', DX + 30, DY + 140, 40, 'p', g * gin(cue('C07', '一、零、二、零') + 0.4));
        B.ghalo('gen', DX + 30, DY + 140, 40, 'n', g * gin(cue('C07', '加s乘') + 0.4), C.free);
        ctag('特解 x₀', DX - 205, DY + 270, { px: 26, a: g * gin(cue('C07', '一、零、二、零') + 0.4), color: C.i });
        ctag('N(A) 的任意向量', DX + 190, DY + 270, { px: 26, a: g * gin(cue('C07', '加s乘') + 0.4), color: C.free });
      }
    }
    // G01：验算特解
    { const g = A * B.win(s('G01'), e('G01') + 0.6);
      if (g > 0) {
        B.card(DX + 30, DY + 300, 800, 120, g * 0.95, C.gpt);
        ctag('A(1, 0, 2, 0)ᵀ = a₁ + 2a₃', DX + 30, DY + 268, { px: 30, a: g, color: C.ink, font: F.serif });
        ctag('= (1 + 6, 2 + 18, −1 + 6) = (7, 20, 5) = b ✓', DX + 30, DY + 326, { px: 30, a: g * gin(cue('G01', '等于一加六')), color: OK, font: F.serif });
      }
    }
    // C09–C11：四个子空间表
    { const g = A * gin(s('C09') - 0.2) * (1 - 0.65 * gin(s('C12') - 0.2));
      if (g > 0) {
        const rows = [
          ['N(A)', '(−3, 1, 0, 0)，(1, 0, −1, 1)', s('C09') + 0.4, C.free],
          ['行空间', '(1, 3, 0, −1)，(0, 0, 1, 1)', cue('C09', '行空间的基'), C.j],
          ['列空间', 'a₁ = (1, 2, −1)，a₃ = (3, 9, 3)', s('C10') + 0.3, C.i],
          ['N(Aᵀ)', '(5, −2, 1)', cue('C11', '得到y'), C.k],
        ];
        K.table(rows, DX - 330, DY - 110, g, { dy: 66, w1: 150 });
        if (B.t > cue('C09', '行空间的基') - 0.2 && B.t < s('C10')) [0, 1].forEach(r => K.rowBox(M, r, 0, 3, C.j, g * B.win(cue('C09', '行空间的基'), s('C10'))));
        K.pill('原矩阵的列！', DX + 330, DY - 110 + 2 * 66, C.free, g * B.win(cue('C10', '注意'), s('C11') + 1), 24);
        ctag('dim = 3 − 2 = 1', DX + 330, DY - 110 + 3 * 66, { px: 28, a: g * gin(cue('C11', '维数')), color: C.k, font: F.serif });
        // G02 点乘
        const g2 = A * B.win(s('G02'), e('G02') + 0.6);
        B.card(DX + 30, DY + 220, 820, 130, g2 * 0.95, C.gpt);
        ctag('(5, −2, 1)·a₁ = 5 − 4 − 1 = 0 ✓', DX + 30, DY + 190, { px: 30, a: g2 * gin(cue('G02', '点乘a一')), color: OK, font: F.serif });
        ctag('(5, −2, 1)·a₃ = 15 − 18 + 3 = 0 ✓', DX + 30, DY + 250, { px: 30, a: g2 * gin(cue('G02', '点乘a三')), color: OK, font: F.serif });
      }
    }
    // C12：丝线
    if (B.t > s('C12') - 0.3) {
      const g = A * B.win(s('C12') - 0.3, s('G03') - 0.1), t0 = cue('C12', '所以a四');
      K.colBox(M, 3, 0, 1, C.k, g * gin(s('C12')), 26);
      K.threads(M, 3, [[0, '−1'], [2, '+1']], t0, C.k, g, { dy: -34, lift: 60 });
      B.card(DX + 30, DY + 200, 700, 150, g * gin(t0) * 0.95, OK);
      ctag('a₄ = −a₁ + a₃', DX + 30, DY + 160, { px: 42, a: g * gin(t0 + 0.6), color: OK, font: F.serif });
      ctag('(3, 9, 3) − (1, 2, −1) = (2, 7, 4) = a₄ ✓', DX + 30, DY + 228, { px: 30, a: g * gin(cue('C12', '验算')), color: C.ink, font: F.serif });
      B.burst(DX + 30, DY + 160, t0 + 0.7, OK, { r1: 240 });
    }
    // G03：维数小表
    if (B.t > s('G03') - 0.3) {
      const g = A * gin(s('G03') - 0.2);
      const cells = [['R(A)', 2, C.i], ['N(A)', 2, C.free], ['R(Aᵀ)', 2, C.j], ['N(Aᵀ)', 1, C.k]];
      cells.forEach(([n, d, col], i) => { const x = DX + 30 + (i - 1.5) * 170, y = DY - 60; B.card(x, y, 150, 110, g * 0.95, col); ctag(n, x, y - 22, { px: 28, a: g, color: col }); ctag(String(d), x, y + 24, { px: 44, a: g, color: C.ink, font: F.serif }); });
      const g1 = g * gin(cue('G03', '正是列数') - 0.6), g2 = g * gin(cue('G03', '正是行数') - 0.6);
      B.card(DX + 30, DY + 90, 640, 70, g1 * 0.95, OK); ctag('行空间 2 + 零空间 2 = 4 = n（列数）', DX + 30, DY + 90, { px: 30, a: g1, color: OK, font: F.serif });
      B.card(DX + 30, DY + 180, 640, 70, g2 * 0.95, OK); ctag('列空间 2 + 左零空间 1 = 3 = m（行数）', DX + 30, DY + 180, { px: 30, a: g2, color: OK, font: F.serif });
      B.burst(DX + 30, DY + 90, cue('G03', '正是列数') - 0.4, OK, { r1: 200 }); B.burst(DX + 30, DY + 180, cue('G03', '正是行数') - 0.4, OK, { r1: 200 });
      B.stamp(DX + 380, DY + 300, true, gin(cue('G03', '对上了'), 0.4), g * gin(cue('G03', '对上了')), '✓ 交卷');
    }
  }

  // ════ 3D：零空间平面平移到特解 ════
  function shot3D(D) {
    const a = B.win(s('C08'), e('C08') + 0.8); if (a <= 0) return;
    const t0 = s('C08'), tm = cue('C08', '平移到'), n = [0.35, 0.5, 1], x0 = [1.6, 1.2, 1.4];
    const dn = n[0] * x0[0] + n[1] * x0[1] + n[2] * x0[2], u = smoother(prog(B.t, tm, tm + 2.0));
    P3.reset();
    P3.setPlane(0, n, { color: C.j, alpha: 0.32, d: 0, scale: 0.75 * outCubic(prog(B.t, t0 + 0.4, t0 + 1.4)) });
    P3.setPlane(1, n, { color: C.i, alpha: 0.38 * u, d: dn * u, scale: 0.75 * (u > 0 ? 1 : 0) });
    P3.setPoint(0, [0, 0, 0], { r: 0.1, color: C.ink, alpha: 1 });
    P3.setPoint(1, x0, { r: 0.12, color: C.i, alpha: gin(tm - 0.4) });
    const V = B.show3D(P3, D, a, { el: 20, az: -55 + (B.t - t0) * 5, dist: 13.5, axesA: 0.4, floorA: 0.2 });
    V.v3([0, 0, 0], x0, { color: C.i, alpha: a * gin(tm - 0.4), grow: smoother(prog(B.t, tm - 0.4, tm + 0.6)) });
    V.lab([0, 0, -0.4], 'O', { px: 28, a, color: C.ink });
    V.lab([-1.6, 1.8, -1.4], 'N(A)：Ax = 0', { px: 30, a: a * gin(t0 + 1.2), color: C.j });
    V.lab([x0[0], x0[1], x0[2] + 0.5], 'x₀', { px: 32, a: a * gin(tm), color: C.i });
    V.lab([x0[0] + 0.4, x0[1] + 1.6, x0[2] + 1.0], 'Ax = b 的解集', { px: 30, a: a * gin(tm + 1.6), color: C.i });
    K.banner('解集 = 特解 + 零空间', a * gin(cue('C08', '特解负责')), C.i);
    ctag('（ℝ⁴ 中的二维平面，此处示意）', DX, DY + 400, { px: 22, a: a * 0.8, color: C.inkMid });
  }

  function papers() {
    B.paper(EX, 'y2526_q4', { t0: s('C01') + 0.2, dock: cue('C01', 'A的三行') - 0.3, out: e('G03') + 1.2 });
  }

  function draw(t) {
    B.frame(t, D => { shot3D(D); shotMain(); papers(); });
  }
  return { TL, draw };
}
