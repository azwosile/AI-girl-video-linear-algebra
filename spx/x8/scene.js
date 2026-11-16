// 特别篇 · 期中速成 x8：判断题闪电战（12 连击）+ 考前十条。
// 分镜：每题一张“题卡”从右侧甩入 → 大肥鱼抢答（有时翻车）→ 印章 ✓ 对 / ✗ 错 砸下 + 屏闪 → 反例 / 理由 tex 弹出
//       → 右上 COMBO 计数逐题 +1；第 11 题“回头题”把第 6 题的反例卡飞回来 → 三个反例模板 → 考前十条两栏清单逐条打勾。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, rgba } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_proud', 'ds_happy', 'ds_think', 'gpt_point', 'gpt_explain', 'gpt_cross'] };

export async function setup(R) {
  const EX = await loadExam(['y2526_q1', 'y2021_t12', 'y2021_t3', 'y2021_t4', 'y2425_t2', 'y2122_t5', 'y2324_f2', 'y2324_f3', 'y2324_f5']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '判断题闪电战', hi: 1, en: 'TRUE OR FALSE',
    titleEnd: () => B.L('G01').s + 0.3,
    pre: { C02: 1.0, C10: 1.0, C15: 1.0, C17: 0.8, C18: 1.0 },
    post: { C20z: 0.6, C20a: 1.0, C20b: 1.0, C20c: 1.0, C20d: 1.4, C20e: 1.0, C20f: 1.2, C20g: 1.0, C20h: 0.8, C20i: 1.0, C20j: 1.2, C03: 1.2, C05: 0.6, G02: 1.0, C07: 1.0, C08: 1.0, C09: 1.0, C11: 1.0, C12: 0.8, C13: 0.8, C14: 0.8, C15: 0.8, D04: 0.6, C17: 1.0, G03: 1.2, C20: 1.2, C21: 1.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;

  // 题目表：[起句, 止句, 题卡 tex, 理由 tex, 判定时刻, 对错, 标题]
  const Q = [
    ['C02', 'C04', 'q1', 'r1', () => s('C03') + 0.2, false, '2025–26 · 1(1)'],
    ['C04', 'C06', 'q2', 'r2', () => cue('C05', 'n大于等于二'), true, '2025–26 · 1(2)'],
    ['C06', 'C08', 'q3', 'r3', () => cue('C06', '对。'), true, '2025–26 · 1(3)'],
    ['C08', 'C09', 'q4', 'r4', () => cue('C08', '错。'), false, '2025–26 · 1(4)'],
    ['C09', 'C10', 'q5', 'r5', () => cue('C09', '对。'), true, '2025–26 · 1(5)'],
    ['C10', 'C12', 'q6', 'r6', () => cue('C10', '错！'), false, '2020–21 · 1(1)'],
    ['C12', 'C13', 'q7', 'r7', () => cue('C12', '对。'), true, '2020–21 · 1(2)'],
    ['C13', 'C14', 'q8', 'r8', () => cue('C13', '错。'), false, '2020–21 · 1(3)'],
    ['C14', 'C15', 'q9', 'r9', () => cue('C14', '对。'), true, '2020–21 · 1(4)'],
    ['C15', 'C16', 'q10', 'r10', () => cue('C15', '对。'), true, '2024–25 · 2(1)'],
    ['C16', 'C17', 'q6', 'r6', () => s('D04') + 0.4, false, '2024–25 · 2(2)'],
    ['C17', 'C17a', 'q12', 'r12', () => cue('C17', '对。'), true, '2021–22 · 1(5)'],
    ['C17a', 'C17c', 'b1q', 'b1r', () => cue('C17b', '等于二'), true, '加时 · 2023–24 填空 1(2)', '= 2'],
    ['C17c', 'C17e', 'b2q', 'b2r', () => cue('C17d', '无关。'), true, '加时 · 2023–24 填空 1(3)', '无关'],
    ['C17e', 'G03', 'b3q', 'b3r', () => cue('C17f', '错！'), false, '加时 · 2023–24 1(5) / 2022–23'],
  ].map(([a, b, q, r, tv, ok, tag, st]) => ({ t0: s(a), t1: s(b), q, r, tv: tv(), ok, tag, st }));
  const tN1 = cue('C05', 'n等于一');

  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('riser', s('D01') - 0.6, 0.25); TL.sfx('count_go', s('D01') + 0.3, 0.3);
  Q.forEach((q, i) => { TL.sfx('swoosh_in', q.t0 + 0.15, 0.3); TL.sfx('slam', q.tv, 0.4); TL.sfx(q.ok ? 'ding_hi' : 'buzz', q.tv + 0.12, q.ok ? 0.32 : 0.22); TL.sfx('pop', q.tv + 1.0, 0.25); });
  TL.sfx('slam', tN1 + 0.4, 0.35); TL.sfx('buzz', tN1 + 0.5, 0.2);
  TL.sfx('sting', s('D02') + 0.2, 0.2); TL.sfx('glitch', s('C03') + 0.1, 0.25);
  TL.sfx('warp', s('C16') + 1.2, 0.3); TL.sfx('swoosh_soft', s('D04') - 0.2, 0.3);
  TL.sfx('impact', s('G03') + 0.2, 0.35); TL.sfx('sparkle', s('G03') + 0.5, 0.3);
  const tTen = [s('C18') + 2.0, cue('C18', '一：'), cue('C18', '二：'), cue('C18', '三：'), cue('C19', '四：'), cue('C19', '五：'), cue('C19', '六：'), cue('C20', '七：'), cue('C20', '八：'), cue('C20', '九：'), cue('C20', '十：')].slice(1);
  tTen.forEach(t => TL.sfx('tick2', t, 0.3));
  // 扩写三 sfx
  'abcdefghij'.split('').forEach(c => TL.sfx('pop', s('C20' + c) + 0.3, 0.25));
  TL.sfx('bell_soft', s('C18'), 0.35); TL.sfx('shimmer', s('D05'), 0.35); TL.sfx('swell', s('C21'), 0.3);

  // ════ 开场：规则 ════
  function shotRule() {
    const a = B.win(s('G01') - 0.2, s('C02') + 0.1); if (a <= 0) return;
    B.card(DX - 210, DY - 80, 360, 200, a * gin(s('G01') + 0.4), OK); ctag('✓ 对', DX - 210, DY - 120, { px: 50, a: a * gin(s('G01') + 0.4), color: OK, font: F.serif }); ctag('给证明', DX - 210, DY - 30, { px: 34, a: a * gin(s('G01') + 0.4), color: C.ink });
    B.card(DX + 210, DY - 80, 360, 200, a * gin(s('G01') + 0.9), C.free); ctag('✗ 错', DX + 210, DY - 120, { px: 50, a: a * gin(s('G01') + 0.9), color: C.free, font: F.serif }); ctag('给 2×2 反例', DX + 210, DY - 30, { px: 34, a: a * gin(s('G01') + 0.9), color: C.ink });
    B.xcard('光写 T / F 只拿一半分', DX, DY + 130, 480, 76, a * gin(cue('G01', '只能拿一半')), C.i, 32);
    const g = a * gin(s('D01'));
    if (g > 0) ctag('15 连击', DX, DY + 270, { px: lerp(110, 72, outCubic(Math.min(1, (B.t - s('D01')) / 0.5))), a: g, color: C.peri, font: F.serif });
  }

  // ════ 题卡 ════
  function shotQ(q, i) {
    const a = B.win(q.t0, q.t1 - 0.15); if (a <= 0) return;
    const sl = outCubic(Math.min(1, Math.max(0, (B.t - q.t0) / 0.5)));
    const x = lerp(DX + 700, DX, sl);
    ctag(q.tag, x, DY - 330, { px: 30, a, color: C.peri });
    B.card(x, DY - 220, 860, 130, a, C.inkMid); texAt(q.q, x, DY - 220, 42, { alpha: a });
    // 印章
    const st = gin(q.tv, 0.35);
    if (i === 1) {
      B.stamp(DX - 200, DY - 40, true, st, a * st, 'n≥2 ✓');
      B.stamp(DX + 200, DY - 40, false, gin(tN1 + 0.4, 0.35), a * gin(tN1 + 0.4), 'n=1 ✗');
      ctag('x = y = 1：det = 1', DX + 200, DY + 70, { px: 30, a: a * gin(tN1 + 1.2), color: C.free });
      B.xcard('两种情况都写上', DX, DY + 300, 380, 66, a * gin(s('G02') + 0.3), C.gpt, 30);
    } else {
      B.stamp(DX + 300, DY - 60, q.ok, st, a * st, q.st || (q.ok ? '✓ 对' : '✗ 错'));
    }
    if (st > 0) B.flash(q.tv, 0.22, 0.3, q.ok ? OK : C.free);
    // 理由
    const gr = a * gin(q.tv + 1.0);
    if (i === 10) {
      // 回头题：第 6 题反例卡飞回
      const fl = smoother(prog(B.t, s('D04') - 0.2, s('D04') + 0.6));
      const y = lerp(DY + 500, DY + 130, fl), sc = 32;
      ctag('同 2020–21 · 1(1)', DX, y - 90, { px: 28, a: a * fl, color: C.ds });
      B.card(DX, y, 860, 130, a * fl, C.free); texAt('r6', DX, y, sc, { alpha: a * fl });
      ctag('眼熟吗？', DX - 300, DY - 60, { px: 40, a: a * B.win(s('C16') + 1.0, s('D04')), color: C.i, font: F.serif });
    } else if (i !== 1) {
      B.card(DX, DY + 130, 860, 140, gr, q.ok ? OK : C.free); texAt(q.r, DX, DY + 130, 36, { alpha: gr, reveal: rv(q.tv + 1.0, 1.6) });
      ctag(q.st ? '答案' : q.ok ? '理由' : '反例', DX - 380, DY + 40, { px: 26, a: gr, color: q.ok ? OK : C.free });
    } else {
      texAt('r2', DX - 200, DY + 180, 32, { alpha: a * gin(s('C04') + 3.0) });
    }
    // 第 1 题：AB+BA 展开
    if (i === 0) {
      ctag('A² + AB + BA + B²', DX - 200, DY - 60, { px: 36, a: a * gin(s('C03') + 0.6), color: C.ink, font: F.serif });
      ctag('AB ≠ BA', DX - 200, DY + 0, { px: 32, a: a * gin(s('C03') + 1.6), color: C.free });
    }
    if (i === 5) ctag('只有 A 可逆才能约', DX, DY + 280, { px: 30, a: a * gin(cue('C11', '只有A可逆')), color: C.i });
  }

  function combo() {
    const n = Q.filter((q, i) => B.t >= q.tv).length, last = n ? Q[n - 1].tv : 0;
    const a = B.win(Q[0].tv, s('C18') - 0.3);
    B.combo(n, DX + 470, DY - 330, last, a, '连击');
  }

  function shotEnd() {
    const a = B.win(s('G03'), s('C18') - 0.1); if (a <= 0) return;
    ctag('15 连击完成！', DX, DY - 300, { px: 64, a: a * gin(s('G03') + 0.2), color: C.peri, font: F.serif });
    B.burst(DX, DY - 300, s('G03') + 0.2, C.peri, { r1: 300, n: 24 });
    const ms = [[[1, 0], [0, 0]], [[1, 0], [0, 1]], [[1, 0], [0, 2]]], labs = ['左上角一个 1', '单位矩阵 I', 'diag(1, 2)'], ts = [cue('G03', '左上角'), cue('G03', '单位矩阵'), cue('G03', '对角线')];
    ms.forEach((m, k) => { const x = DX - 300 + k * 300, g = a * gin(ts[k]); B.card(x, DY, 240, 200, g, C.gpt); B.mat(x, DY - 10, m, { px: 44, a: g }); ctag(labs[k], x, DY + 130, { px: 28, a: g, color: C.gpt }); });
    ctag('反例三模板', DX, DY + 210, { px: 34, a: a * gin(s('G03') + 1.5), color: C.ink, font: F.serif });
  }

  const EXS = [["A 是 3 阶，det A = 2", "det(3A) = 3³ × 2 = 54（不是 6）"], ["A 是 4 阶，|A| = 2", "|A · adj A| = |2I| = 2⁴ = 16"], ["A₂₁ + A₂₂ + 2A₂₃", "= 第 2 行换成 (1, 1, 2) 后的行列式"], ["末行 (0, 0, a − 1 | b − 2)", "a ≠ 1 唯一 · a = 1, b ≠ 2 无解 · a = 1, b = 2 无穷多"], ["[[2, 1], [6, 4]]：倍数 6 ÷ 2 = 3", "L = [[1, 0], [3, 1]]，U = [[2, 1], [0, 1]]"], ["[[3, 1], [5, 2]]⁻¹，det = 1", "主对角互换、副对角变号 → [[2, −1], [−5, 3]]"], ["{x : x₁ + x₂ = 1}", "0 + 0 ≠ 1 → 不是子空间"], ["R³ 里 4 个向量", "4 > 3 → 必相关"], ["旧基是标准基：E = I", "S = F⁻¹"], ["RREF 第 3 列 (2, 3, 0, 0)ᵀ", "a₃ = 2a₁ + 3a₂"]];

  function shotTen() {
    const a = B.win(s('C18'), s('C21') + 0.4); if (a <= 0) return;
    ctag('考前十条', DX, DY - 360, { px: 50, a: a * gin(s('C18')), color: C.peri, font: F.serif });
    const items = ['det(kA) = kⁿ det A', 'A · adj A = |A| I', '余子式组合：换行再算', '含参：盯最后一行', 'L：下 ÷ 主元', '求逆用 [A | I]', '子空间：先试零向量', '相关看秩', 'S = F⁻¹E', 'RREF：丝线读系数'];
    items.forEach((t, k) => {
      const col = k < 5 ? 0 : 1, row = k % 5, x = DX - 420 + col * 450, y = DY - 260 + row * 92, g = a * gin(tTen[k] - 0.2);
      ctag(`${k + 1}`, x, y, { px: 34, a: g, color: C.peri, font: F.serif });
      ctag(t, x + 34, y, { px: 30, a: g, color: C.ink, align: 'left' });
      ctag('✓', x + 370, y, { px: lerp(60, 36, gin(tTen[k] + 0.8)), a: g * gin(tTen[k] + 0.8), color: OK });
      const id = 'C20' + 'abcdefghij'[k], ga = a * B.win(s(id), e(id) + 0.25);
      if (ga > 0) {
        ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.strokeRect(x - 30, y - 34, 430, 68); ctx.restore();
        B.card(DX - 40, DY + 225, 740, 110, ga * 0.95, C.i);
        ctag(EXS[k][0], DX - 40, DY + 198, { px: 28, a: ga * gin(s(id) + 0.3), color: C.ink, font: F.serif });
        ctag(EXS[k][1], DX - 40, DY + 250, { px: 28, a: ga * gin(s(id) + 1.4), color: C.i, font: F.serif });
      }
    });
  }

  function shotBye() {
    const a = B.win(s('C21'), 1e9); if (a <= 0) return;
    ctag('速成版 · 完', DX, DY - 80, { px: 80, a: a * gin(s('C21') + 0.2), color: C.peri, font: F.serif });
    ctag('完整特别篇 → 每道题彻底吃透', DX, DY + 40, { px: 36, a: a * gin(cue('C21', '想把每道题')), color: C.ink });
    ctag('祝考试顺利！', DX, DY + 140, { px: 50, a: a * gin(cue('C21', '祝大家')), color: OK, font: F.serif });
    B.burst(DX, DY + 140, cue('C21', '祝大家'), OK, { r1: 320, n: 26 });
  }

  function papers() {
    B.paper(EX, 'y2526_q1', { t0: s('C02') + 0.2, dock: s('C02') + 3.0, out: s('C10') - 0.4 });
    B.paper(EX, 'y2021_t12', { t0: s('C10') + 0.2, dock: s('C10') + 3.0, out: s('C13') - 0.3 });
    B.paper(EX, 'y2021_t3', { t0: s('C13'), dock: s('C13') + 1.2, out: s('C14') - 0.3 });
    B.paper(EX, 'y2021_t4', { t0: s('C14'), dock: s('C14') + 1.2, out: s('C15') - 0.3 });
    B.paper(EX, 'y2425_t2', { t0: s('C15') + 0.2, dock: s('C15') + 3.0, out: s('C17') - 0.3 });
    B.paper(EX, 'y2122_t5', { t0: s('C17'), dock: s('C17') + 1.6, out: s('C17a') - 0.2 });
    B.paper(EX, 'y2324_f2', { t0: s('C17a'), dock: s('C17a') + 1.6, out: s('C17c') - 0.2 });
    B.paper(EX, 'y2324_f3', { t0: s('C17c'), dock: s('C17c') + 1.6, out: s('C17e') - 0.2 });
    B.paper(EX, 'y2324_f5', { t0: s('C17e'), dock: s('C17e') + 1.6, out: s('G03') - 0.2 });
  }

  // ── 扩写：逐步算式小卡 ──
  const XC = [
    ['C17b', DY + 300, ['1 个主元 + 2 个自由变量 → 过原点的平面'], C.j],
    ['C17d', DY + 300, ['x = 0：c₁ + c₂ = 0　　求导后 x = 0：c₁ − c₂ = 0'], C.i],
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
    B.frame(t, () => { shotRule(); Q.forEach(shotQ); combo(); shotEnd(); shotTen(); shotBye(); papers(); extras(); });
  }
  return { TL, draw };
}
