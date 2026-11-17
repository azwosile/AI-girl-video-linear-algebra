// 特别篇 6 · 第 3 段：给 RREF 和三列，求剩下的列和 b（2024–25 第 4 题，15 分）。
// 分镜：原题三步 → A 的五列 + b 以“列槽”出现（a₂、a₄、b 为虚线空槽）→ U 板（圈主元、自由列染色）
//       → “前三问不需要 A” → N(A) 基（自由变量轮流取 1）→ 行空间（行框）→ 特解读最后一列 + 通解
//       → 列槽回归：丝线 U 第 2 列 → 第 1 列，a₁ 的数字沿弧线飞入 a₂ 槽；a₄ 同理
//       → b：三根丝线 4 / −6 / 3 → 逐分量合成 → b = A·x₀ 互相验证 → 评分点 → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit, neg, vec } from '../kit.js';

export const assets = { chars: ['claude_point', 'claude_explain', 'claude_write', 'claude_smile', 'ds_shock', 'ds_think', 'gpt_think', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_q4']);
  const B = base(R, {
    assets, label: '特别篇 6 · 秩与四个子空间', title: '补全缺失的列', hi: 2, en: '2024–25 · Q4 · 15 PTS',
    titleEnd: () => B.L('C01').s + 0.2,
    pre: { C01: 0.6, C04: 0.4, C06: 0.4, C07: 0.8, C09: 0.4, G02: 0.4, C11: 0.8 },
    post: { C01: 0.6, C02: 1.0, C03: 0.8, C04: 1.4, C05: 1.0, C06: 1.6, C07: 1.6, C08: 1.6, C09: 1.6, C10: 1.6, G01: 1.0, G02: 0.8, C11: 1.8 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const U = [[1, 1, 0, 0, 0, 4], [0, 0, 1, 1, 0, -6], [0, 0, 0, 0, 1, 3], [0, 0, 0, 0, 0, 0]];
  const COL = [[1, -1, -2, 0], [1, -1, -2, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 3, 3], [1, -1, 1, 3]];
  const tPiv = cue('C02', '主元在'), tFree = cue('C02', '自由变量');
  const tA2 = cue('C07', '所以a二'), tA4 = cue('C08', '所以a四'), tB = cue('C09', '所以b');
  const tBc = ['第一个', '第二个', '第三个', '第四个'].map(w => cue('C10', w));

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('whoosh', s('C01') + 0.2, 0.35); TL.sfx('stamp', s('C01') + 2.6, 0.35);
  TL.sfx('pop', cue('C01', '和A的第一'), 0.3); TL.sfx('buzz', cue('C01', '再把a二'), 0.2);
  TL.sfx('pop', s('C02') + 0.3, 0.28); [0, 1, 2].forEach(i => TL.sfx('pop', tPiv + i * 0.3, 0.3)); TL.sfx('zap', tFree, 0.25);
  TL.sfx('sting', s('D01') + 0.2, 0.3);
  ['零空间等于', '行空间也和', '全部解也只看'].forEach(w => TL.sfx('check', cue('C03', w), 0.28));
  TL.sfx('ding_hi', cue('C04', '基是'), 0.3); TL.sfx('tick', s('C05') + 0.4, 0.28);
  TL.sfx('pop', cue('C06', '特解是'), 0.3); TL.sfx('impact', cue('C06', '所以x等于') + 0.3, 0.3);
  TL.sfx('pluck', cue('C07', 'U的第二列'), 0.35); TL.sfx('whoosh', tA2, 0.3); TL.sfx('shimmer', tA2 + 0.9, 0.3);
  TL.sfx('pluck', s('C08') + 0.3, 0.35); TL.sfx('whoosh', tA4, 0.3); TL.sfx('shimmer', tA4 + 0.9, 0.3);
  TL.sfx('pop', s('D02') + 0.3, 0.28);
  [0, 1, 2].forEach(i => TL.sfx('laser', cue('C09', 'b那一列') + i * 0.45, 0.25)); TL.sfx('impact', tB + 0.4, 0.3);
  tBc.forEach(x => TL.sfx('tick', x, 0.3)); TL.sfx('ding_hi', cue('C10', 'b等于一'), 0.35);
  TL.sfx('check', cue('G01', '互相验证'), 0.3); TL.sfx('pop', s('G02') + 0.3, 0.28);
  TL.sfx('bell_soft', s('C11'), 0.35); TL.sfx('shimmer', s('C11') + 0.5, 0.3);

  // ── 列槽 ──
  const SY = DY + 130, SX = j => DX + 20 + (j - 2.5) * 118;
  const known = j => j === 0 || j === 2 || j === 4;
  function slots(a) {
    if (a <= 0) return;
    const fill = [1, gin(tA2 + 0.8), 1, gin(tA4 + 0.8), 1, 0];
    const bcomp = tBc.map(x => gin(x + 0.6));
    COL.forEach((v, j) => {
      const x = SX(j), h = 4 * 50 + 30, isB = j === 5;
      const f = isB ? Math.max(...bcomp) : fill[j];
      const col = isB ? C.peri : known(j) ? C.i : C.free;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3;
      if (!known(j) && f < 1) ctx.setLineDash([8, 8]);
      ctx.strokeRect(x - 44, SY - h / 2, 88, h); ctx.setLineDash([]);
      ctx.globalAlpha = a * 0.12 * (known(j) ? 1 : f); ctx.fillStyle = col; ctx.fillRect(x - 44, SY - h / 2, 88, h); ctx.restore();
      ctag(isB ? 'b' : `a${'₁₂₃₄₅'[j]}`, x, SY - h / 2 - 28, { px: 30, a, color: col, font: F.serif });
      v.forEach((q, i) => {
        const g = isB ? bcomp[i] : f;
        ctag(neg(q), x, SY - 75 + i * 50, { px: 34, a: a * g, color: known(j) ? C.ink : OK, font: F.serif });
      });
      if (!known(j) && f < 0.05) ctag('?', x, SY, { px: 54, a: a * (0.6 + 0.4 * Math.sin(B.t * 6)), color: col, font: F.serif });
      if (isB && bcomp[0] < 0.05) ctag('?', x, SY, { px: 54, a: a * (0.6 + 0.4 * Math.sin(B.t * 6)), color: col, font: F.serif });
    });
    // 飞入：a₁ → a₂，a₃ → a₄
    [[0, 1, tA2], [2, 3, tA4]].forEach(([f, to, t0]) => [0, 1, 2, 3].forEach(i => B.fly([SX(f), SY - 75 + i * 50], [SX(to), SY - 75 + i * 50], prog(B.t, t0 + i * 0.12, t0 + 0.7 + i * 0.12), OK, { lift: 70, r: 9 })));
  }

  function shotMain() {
    const a = B.win(s('C01'), s('C11') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C01', '这次连A') - 0.2); if (A <= 0) return;
    B.qhead('2024–2025 期中 · 第 4 题 · 15 分', A);
    // U 板
    const gU = A * gin(s('C02') - 0.1);
    const M = B.mat(DX + 20, DY - 250, U, { px: 34, a: gU, bar: 5, cell: (i, j) => {
      if (j === 5 && (B.t > s('C06') || B.t > s('C09') - 0.3)) return { col: C.peri };
      if (piv(i, j) && B.t > tPiv) return { col: C.i };
      if ((j === 1 || j === 3) && B.t > tFree) return { col: C.free };
      return null;
    } });
    ['x₁', 'x₂', 'x₃', 'x₄', 'x₅', 'b'].forEach((v, j) => ctag(v, M.cell(0, j)[0], DY - 250 - M.h / 2 - 26, { px: 22, a: gU * gin(tPiv - 0.5), color: j === 5 ? C.peri : (j === 1 || j === 3) ? C.free : C.i }));
    [[0, 0], [1, 2], [2, 4]].forEach(([r, c], q) => { const [x, y] = M.cell(r, c); K.ring(x, y, 22, C.i, gU * (1 - gin(s('C07') - 0.3)), prog(B.t, tPiv + q * 0.3, tPiv + q * 0.3 + 0.5)); });
    ctag('U = rref(A | b)', DX + 20 - M.w / 2 - 110, DY - 250, { px: 26, a: gU, color: C.inkMid });
    // 列槽（C01–D01，C07 之后）
    const gs = A * (B.win(cue('C01', '和A的第一') - 0.2, s('C03') - 0.1) + B.win(s('C07') - 0.4, s('G02') - 0.1));
    slots(Math.min(1, gs));
    // C03：三枚勾
    { const g = A * B.win(s('C03'), s('C04') - 0.1);
      [['N(A) = N(U)', '零空间等于'], ['行空间 = U 的行空间', '行空间也和'], ['全部解：只看 RREF', '全部解也只看']].forEach(([tx, w], i) => {
        const gi = g * gin(cue('C03', w)); B.card(DX + 20, DY + 20 + i * 90, 560, 70, gi * 0.95, OK); ctag('✓  ' + tx, DX + 20, DY + 20 + i * 90, { px: 32, a: gi, color: OK, font: F.serif }); });
      ctag('不需要 A！', DX + 20, DY - 70, { px: 40, a: g * gin(cue('C03', '根本不需要')), color: C.peri, font: F.serif });
    }
    // C04：零空间
    { const g = A * B.win(s('C04'), s('C05') + 0.1);
      if (g > 0) {
        [1, 3].forEach(j => K.colBox(M, j, 0, 2, C.free, g, 24));
        ctag('x₂ = s，x₄ = t', DX + 20, DY - 60, { px: 30, a: g * gin(cue('C04', '令x二')), color: C.free, font: F.serif });
        ctag('x₁ = −s，x₃ = −t，x₅ = 0', DX + 20, DY - 10, { px: 30, a: g * gin(cue('C04', '则x一')), color: C.ink, font: F.serif });
        const tb = cue('C04', '基是');
        K.cvec(DX - 120, DY + 160, [-1, 1, 0, 0, 0], g * gin(tb), { px: 30, col: C.free });
        K.cvec(DX + 160, DY + 160, [0, 0, -1, 1, 0], g * gin(tb + 1.4), { px: 30, col: C.free });
        ctag('N(A) 的基', DX + 20, DY + 330, { px: 28, a: g * gin(tb), color: C.free });
        B.burst(DX - 120, DY + 160, tb + 0.2, C.free, { r1: 120 }); B.burst(DX + 160, DY + 160, tb + 1.6, C.free, { r1: 120 });
      }
    }
    // C05：行空间
    { const g = A * B.win(s('C05'), s('C06') - 0.1);
      if (g > 0) {
        [0, 1, 2].forEach(r => K.rowBox(M, r, 0, 4, C.j, g * gin(s('C05') + 0.4 + r * 0.5), 22));
        ['(1, 1, 0, 0, 0)', '(0, 0, 1, 1, 0)', '(0, 0, 0, 0, 1)'].forEach((tx, r) => ctag(tx, DX + 20, DY + 10 + r * 60, { px: 32, a: g * gin(s('C05') + 0.6 + r * 0.9), color: C.j, font: F.serif }));
        ctag('行空间 R(Aᵀ) 的基', DX + 20, DY - 60, { px: 30, a: g, color: C.j });
      }
    }
    // C06：全部解
    { const g = A * B.win(s('C06'), s('C07') - 0.3);
      if (g > 0) {
        K.colBox(M, 5, 0, 2, C.peri, g * gin(cue('C06', '读出最右边')), 24);
        ctag('自由变量取 0 → 特解 = 最右一列', DX + 20, DY - 60, { px: 30, a: g * gin(s('C06') + 0.3), color: C.peri });
        ctag('x₀ = (4, 0, −6, 0, 3)', DX + 20, DY, { px: 34, a: g * gin(cue('C06', '特解是')), color: C.i, font: F.serif });
        const tg = cue('C06', '所以x等于');
        texAt('gen', DX + 20, DY + 170, 36, { alpha: g * gin(tg), reveal: rv(tg, e('C06') - tg - 0.3) });
        B.burst(DX + 20, DY + 170, tg + 0.5, OK, { r1: 260 });
      }
    }
    // C07 / C08：丝线
    { const g = A * B.win(s('C07') - 0.3, s('D02'));
      K.colBox(M, 1, 0, 2, C.free, g * B.win(cue('C07', 'U的第二列'), s('C08')), 22);
      K.threads(M, 1, [[0, '×1']], cue('C07', '和第一列一样') - 0.3, C.j, g * (1 - gin(s('C08') + 0.5)), { dy: -30, lift: 60 });
      K.colBox(M, 3, 0, 2, C.free, g * gin(s('C08') + 0.2), 22);
      K.threads(M, 3, [[2, '×1']], cue('C08', '和第三列一样') - 0.3, C.j, g, { dy: -30, lift: 60 });
      ctag('a₂ = a₁', DX + 20, DY - 80, { px: 36, a: g * B.win(tA2 - 0.2, s('C08')), color: OK, font: F.serif });
      ctag('a₄ = a₃', DX + 20, DY - 80, { px: 36, a: g * gin(tA4 - 0.2), color: OK, font: F.serif });
    }
    // C09 / C10：b
    { const g = A * B.win(s('D02'), s('G02') - 0.1);
      K.colBox(M, 5, 0, 2, C.peri, g * gin(cue('C09', 'b那一列')), 22);
      K.threads(M, 5, [[0, '4'], [2, '−6'], [4, '3']], cue('C09', 'b那一列'), C.peri, g, { dy: -30, lift: 70 });
      const gb = g * gin(tB - 0.2);
      ctag('b = 4a₁ − 6a₃ + 3a₅', DX + 20, DY - 80, { px: 36, a: gb, color: C.peri, font: F.serif });
      B.burst(DX + 20, DY - 80, tB, C.peri, { r1: 200 });
      // 逐分量
      ['4 − 6 + 3 = 1', '−4 + 0 + 3 = −1', '−8 + 0 + 9 = 1', '0 − 6 + 9 = 3'].forEach((tx, i) => ctag(tx, SX(5) + 70, SY - 75 + i * 50, { px: 26, a: g * B.win(tBc[i], tBc[i] + 2.4), color: C.peri, font: F.serif, align: 'left' }));
      // 三列光柱
      [0, 2, 4].forEach((j, q) => { const u = prog(B.t, tB + q * 0.25, tB + 0.9 + q * 0.25); if (u > 0 && u < 1) B.fly([SX(j), SY], [SX(5), SY], u, C.peri, { lift: 110, r: 10, txt: ['×4', '×(−6)', '×3'][q], px: 26 }); });
      const gG = A * B.win(s('G01'), s('G02') - 0.1);
      B.card(DX + 20, DY - 80, 860, 70, gG, C.gpt);
      ctag('b = A·x₀ = 4a₁ + 0a₂ − 6a₃ + 0a₄ + 3a₅', DX + 20, DY - 80, { px: 30, a: gG, color: C.gpt, font: F.serif });
    }
    // G02 评分点
    { const g = A * B.win(s('G02'), s('C11') - 0.2);
      B.card(DX + 20, DY + 80, 820, 170, g, C.gpt);
      ctag('评分点', DX + 20, DY + 20, { px: 28, a: g, color: C.gpt });
      K.type('① 写出“行变换保持列的线性关系”', DX - 340, DY + 70, s('G02') + 0.4, 1.6, g, { px: 30 });
      K.type('② 再写 a₂ = a₁，a₄ = a₃', DX - 340, DY + 125, cue('G02', '再写'), 1.2, g, { px: 30 });
      ctag('只写结果 → 可能扣过程分', DX + 20, DY + 210, { px: 26, a: g * gin(cue('G02', '只写结果')), color: C.free });
    }
  }
  const piv = (i, j) => (i === 0 && j === 0) || (i === 1 && j === 2) || (i === 2 && j === 4);

  function shotOutro() {
    const a = B.win(s('C11'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · RREF 反推三板斧', ['① N(A)、行空间：看 U', '② 非主元列 = 主元列的组合（系数读 U 的那一列）', '③ b 同理：b 的那一列 = b 的“坐标”'],
      [s('C11') + 0.3, cue('C11', '非主元列'), cue('C11', 'b也一样')], a, { y: DY - 40 });
  }

  function papers() {
    B.paper(EX, 'y2425_q4', { t0: s('C01') + 0.2, dock: cue('C01', '这次连A') - 0.3, out: s('C11') - 0.3 });
  }

  function draw(t) {
    B.frame(t, () => { shotMain(); shotOutro(); papers(); });
  }
  return { TL, draw };
}
