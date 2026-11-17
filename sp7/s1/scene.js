// 特别篇 7 · 第 1 段：判断题闪电战（17 连击后断在“自由变量 ⇒ 无穷多解”）。
// 分镜：规则卡（T 青 / F 红两枚巨印悬停）→ 每题：题卡翻入 → 大肥鱼抢答 → 印章砸下 + 连击 +1 → 理由 / 反例小板
//       Q2 陷阱：GPT 故障闪烁 “n = 1”，T/F 半叠印章“分情况”；子空间三连配坐标轴小图；“或”字红圈
//       → 最后一题连击碎裂（buzz + 抖动）→ 定格 ×17 + 两个工具箱总结卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_confused', 'ds_happy', 'ds_proud', 'ds_shock', 'ds_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2526_q1']);
  const B = base(R, {
    assets, label: '特别篇 7 · 判断 · 导航 · 附加', title: '判断题闪电战', hi: 3, en: 'TRUE OR FALSE · LIGHTNING ROUND',
    titleEnd: () => B.L('C01').s + 0.6,
    pre: { C03: 0.6, C05: 0.6, C07: 0.6, C09: 0.6, C11: 0.6, C13: 0.8, C20: 0.8, C25: 0.6 },
    post: { C02: 1.0, D02: 0.6, C04: 1.4, G01: 0.8, C06: 1.6, C08: 1.0, D06: 0.8, C10: 0.8, D07: 1.2, D08: 0.8, D09: 0.6, D10: 0.6, D11: 0.6, D12: 0.6, D13: 0.6, D14: 0.8, D16: 0.6, D17: 1.0, G03: 0.6, D18: 0.6, D19: 0.8, C26: 1.0, D21: 1.0, C27: 1.6 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const QY = DY - 250, EY = DY - 110;

  // 题目表：q 题卡文字、c 提问句、d 抢答句、v 判定（'T'|'F'|'TF'）、st 盖章时刻、ex 理由行 [文字, 时刻, 颜色]、viz 额外画面
  const Q = [
    { q: '(A + B)² = A² + 2AB + B²', c: 'C03', d: 'D02', v: 'F', st: () => s('D02') + 0.2, end: () => s('C05') - 0.3,
      ex: [['(A + B)² = A² + AB + BA + B²', () => cue('D02', '展开是')], ['AB ≠ BA（乘法不交换）', () => cue('D02', '矩阵乘法不交换'), C.free]], viz: 'q1' },
    { q: 'x, y ∈ ℝⁿ（n > 0）⇒ det(xyᵀ) = 0', c: 'C05', d: 'D03', v: 'TF', st: () => cue('C06', '考场上最稳'), end: () => s('C07') - 0.3,
      ex: [['每行都是 yᵀ 的倍数 ⇒ 秩 ≤ 1 < n', () => cue('D03', '每一行都是'), C.ds], ['n = 1：xyᵀ = [6]，det = 6 ≠ 0', () => cue('G01', '比如x等于二'), C.free],
        ['n ≥ 2：成立（秩 ≤ 1 < n）', () => cue('C06', '大于等于二时成立'), OK], ['n = 1：不成立（x = 2，y = 3）', () => cue('C06', '等于一时不成立'), C.free]], viz: 'q2' },
    { q: 'v₁…vₛ 无关，加上 v 相关 ⇒ v ∈ Span(v₁…vₛ)', c: 'C07', d: 'D05', v: 'T', st: () => s('D05') + 0.2, end: () => s('C09') - 0.3,
      ex: [['c₁v₁ + … + cₛvₛ + kv = 0（不全为零）', () => cue('D05', '存在一组')], ['若 k = 0 ⇒ c₁v₁ + … + cₛvₛ = 0，与无关矛盾', () => cue('C08', '如果k等于零'), C.free],
        ['k ≠ 0 ⇒ v = −(c₁v₁ + … + cₛvₛ)/k', () => cue('C08', '两边除以k'), OK]], viz: 'q3' },
    { q: '某个 x ≠ 0 使 Ax = Bx ⇒ A = B', c: 'C09', d: 'D06', v: 'F', st: () => s('D06') + 0.2, end: () => s('C11') - 0.3,
      ex: [['A = [[1, 0], [0, 0]]，B = I，x = (1, 0)', () => cue('D06', 'A等于一')], ['Ax = Bx = (1, 0)，但 A ≠ B', () => cue('D06', '可是A不等于B'), C.free],
        ['要“对所有 x”：代入 e₁…eₙ ⇒ 每列相等', () => cue('C10', '要对所有的x'), OK]] },
    { q: 'AB = 4I ⇒ A 非奇异', c: 'C11', d: 'D07', v: 'T', st: () => s('D07') + 0.2, end: () => s('C13') - 0.3,
      ex: [['det A · det B = 4ⁿ ≠ 0 ⇒ det A ≠ 0', () => cue('D07', '两边取行列式'), OK], ['或：A⁻¹ = B / 4', () => cue('D07', '或者直接写'), C.i]] },
    { q: 'AB = AC，A ≠ O ⇒ B = C', c: 'C13', d: 'D08', v: 'F', st: () => s('D08') + 0.15, end: () => s('C14') - 0.2,
      ex: [['A = [[1, 0], [0, 0]]，B = [[0, 0], [0, 1]]，C = O', () => cue('D08', 'A等于一')], ['AB = O = AC，但 B ≠ C（A 不可逆不能消去）', () => cue('D08', 'AC也等于零'), C.free]] },
    { q: 'x, y ≠ 0，xyᵀ 的行阶梯形恰有一个非零行', c: 'C14', d: 'D09', v: 'T', st: () => s('D09') + 0.15, end: () => s('C15') - 0.2,
      ex: [['每行 ∝ yᵀ，x ≠ 0 ⇒ 至少一行非零', () => cue('D09', '每一行都是')], ['秩恰好 = 1', () => cue('D09', '秩恰好是一'), OK]] },
    { q: 'det(A + B) = det A + det B', c: 'C15', d: 'D10', v: 'F', st: () => s('D10') + 0.15, end: () => s('C16') - 0.2,
      ex: [['A = B = I₂：det(2I₂) = 4 ≠ 1 + 1', () => cue('D10', '两倍单位矩阵'), C.free]] },
    { q: 'det(αA) = α det A', c: 'C16', d: 'D11', v: 'F', st: () => s('D11') + 0.15, end: () => s('C17') - 0.2,
      ex: [['det(αA) = αⁿ det A', () => cue('D11', '每一行都提出'), OK], ['det(3I₂) = 9 ≠ 3', () => cue('D11', '比如三倍'), C.free]] },
    { q: 'A 非奇异 ⇒ AᵀA 非奇异', c: 'C17', d: 'D12', v: 'T', st: () => s('D12') + 0.15, end: () => s('C18') - 0.2,
      ex: [['det(AᵀA) = det Aᵀ · det A = (det A)² ≠ 0', () => cue('D12', 'A转置乘A的行列式'), OK]] },
    { q: 'A ≠ O，AB = O ⇒ det B = 0（方阵）', c: 'C18', d: 'D13', v: 'T', st: () => s('D13') + 0.15, end: () => s('C19') - 0.2,
      ex: [['反证：B 可逆 ⇒ A = ABB⁻¹ = O，矛盾', () => cue('D13', '用反证'), OK]] },
    { q: 'Ay = Az = b ⇒ y − z 是 Ax = 0 的解', c: 'C19', d: 'D14', v: 'T', st: () => s('D14') + 0.15, end: () => s('C20') - 0.2,
      ex: [['A(y − z) = Ay − Az = b − b = 0', () => cue('D14', 'A乘y减z'), OK]] },
    { q: 'S ∩ T 是子空间', c: 'C20', d: 'D15', v: 'T', st: () => s('D15') + 0.15, end: () => s('C21') - 0.2, qt: () => cue('C20', '第一个'),
      ex: [['两边都封闭 ⇒ 交集也封闭', () => cue('D15', '两边都封闭'), OK]], viz: 'cap' },
    { q: 'S ∪ T 是子空间', c: 'C21', d: 'D16', v: 'F', st: () => s('D16') + 0.15, end: () => s('C22') - 0.2,
      ex: [['x 轴 ∪ y 轴：(1, 0) + (0, 1) = (1, 1)', () => cue('D16', 'x轴并y轴'), C.free]], viz: 'cup' },
    { q: '{x | x₃ = x₁ 或 x₃ = x₂} 是子空间', c: 'C22', d: 'D17', v: 'F', st: () => s('D17') + 0.15, end: () => s('C23') - 0.2,
      ex: [['两张平面的并！', () => cue('D17', '两张平面的并')], ['(1, 0, 1) + (0, 1, 1) = (1, 1, 2)', () => cue('D17', '一、零、一'), C.free], ['2 ≠ 1 且 2 ≠ 1 ⇒ 不在集合里', () => cue('D17', '第三个分量二'), C.free]], viz: 'or' },
    { q: 'U 子空间，x + y ∈ U ⇒ x ∈ U 且 y ∈ U', c: 'C23', d: 'D18', v: 'F', st: () => s('D18') + 0.15, end: () => s('C24') - 0.2,
      ex: [['U = {0}，x = e₁，y = −e₁', () => cue('D18', 'U只含零向量')], ['x + y = 0 ∈ U，但 x ∉ U', () => cue('D18', '但x不在U里'), C.free]] },
    { q: '向量空间的零元唯一', c: 'C24', d: 'D19', v: 'T', st: () => s('D19') + 0.15, end: () => s('C25') - 0.2,
      ex: [['0 = 0 + 0′ = 0′', () => cue('D19', '零等于零加零撇'), OK]] },
    { q: 'RREF 有自由变量 ⇒ Ax = b 有无穷多解', c: 'C25', d: 'D20', v: 'F', st: () => s('D21') + 0.1, end: () => s('C27') - 0.3, qt: () => cue('C25', '最后一题'),
      ex: [['[1 1 | 0]，[0 0 | 1]：x₂ 自由，但 0 = 1 ⇒ 无解', () => cue('C26', '比如增广矩阵'), C.free], ['先有解，才谈无穷多', () => cue('C26', '要先有解'), C.i]], viz: 'last' },
  ];
  const tBreak = cue('D20', '有自由变量就') + 0.9;

  // ── 音效 ──
  TL.sfx('riser', cue('C01', '闪电战') - 0.4, 0.4); TL.sfx('slam', cue('C02', '规则'), 0.35);
  TL.sfx('stamp', cue('C02', '判F'), 0.3); TL.sfx('stamp', cue('C02', '判T'), 0.3); TL.sfx('count_go', s('D01') + 0.2, 0.4);
  Q.forEach((q, i) => {
    TL.sfx('swoosh_in', (q.qt ? q.qt() : s(q.c)) + 0.05, 0.3);
    if (i < 17) { TL.sfx('stamp', q.st(), 0.4); TL.sfx(q.v === 'F' ? 'impact' : 'ding_hi', q.st() + 0.05, 0.3); TL.sfx('pop', q.st() + 0.35, 0.25); }
  });
  TL.sfx('glitch', cue('G01', 'n等于一'), 0.35); TL.sfx('crack', cue('D04', '这一步要求'), 0.3);
  TL.sfx('sparkle', cue('C12', '清完'), 0.35); TL.sfx('swell', cue('C12', '清完') - 0.3, 0.3);
  TL.sfx('buzz', tBreak - 0.3, 0.45); TL.sfx('crack', tBreak, 0.4); TL.sfx('thud', s('D21') + 0.1, 0.3);
  TL.sfx('shimmer', s('C27') + 0.3, 0.35); TL.sfx('sparkle', cue('C27', '记住两个工具箱'), 0.3);
  TL.sfx('zap', cue('G03', '或字'), 0.3);

  // 连击数：盖章即 +1；Q2 算 1；最后一题不算
  const comboAt = () => { let n = 0, tp = 0; Q.slice(0, 17).forEach(q => { if (B.t >= q.st()) { n++; tp = q.st(); } }); return [n, tp]; };

  // ════ 规则卡（开场）════
  function shotRules() {
    const a = B.win(s('C01') + 0.8, s('C03') - 0.3); if (a <= 0) return;
    const g = a * gin(cue('C02', '规则'));
    B.card(DX, DY - 230, 860, 100, g, C.peri);
    ctag('判断 + 理由', DX, DY - 230, { px: 46, a: g, color: C.ink, font: F.serif });
    const tf = gin(cue('C02', '判F')), tt = gin(cue('C02', '判T'));
    // 两枚巨印悬停（轻微上下浮动）
    const fl = Math.sin(B.t * 2) * 8;
    K.redStamp('F', DX - 220, DY + 30 + fl, prog(B.t, cue('C02', '判F'), cue('C02', '判F') + 0.5), a, C.free, 150);
    K.redStamp('T', DX + 220, DY + 30 - fl, prog(B.t, cue('C02', '判T'), cue('C02', '判T') + 0.5), a, C.j, 150);
    ctag('给一个具体反例', DX - 220, DY + 220, { px: 30, a: a * tf, color: C.free });
    ctag('给一句证明', DX + 220, DY + 220, { px: 30, a: a * tt, color: C.j });
    ctag('只写 T / F ≈ 0 分', DX, DY + 300, { px: 28, a: a * gin(cue('C02', '只写T或F')), color: C.inkMid });
    K.pill('COMBO 0', DX, DY - 120, C.peri, a * gin(s('D01')), 30);
    B.burst(DX - 220, DY + 30, cue('C02', '判F') + 0.3, C.free, { r1: 240 }); B.burst(DX + 220, DY + 30, cue('C02', '判T') + 0.3, C.j, { r1: 240 });
  }

  // ════ 单题 ════
  function shotQ(q, i) {
    const t0 = q.qt ? q.qt() : s(q.c), a = B.win(t0, q.end(), 0.3, 0.3); if (a <= 0) return;
    // 题卡翻入（绕水平轴）
    const fl = smoother(prog(B.t, t0, t0 + 0.45));
    ctx.save(); ctx.translate(DX, QY); ctx.scale(1, Math.max(0.02, fl)); ctx.translate(-DX, -QY);
    B.card(DX, QY, 900, 110, a, C.peri);
    ctag(`Q${i + 1}`, DX - 405, QY, { px: 30, a, color: C.peri, font: F.serif });
    ctag(q.q, DX + 20, QY, { px: q.q.length > 24 ? 32 : 38, a, color: C.ink, font: F.serif });
    ctx.restore();
    if (i < 5) K.pill('最新卷 · 2025–26 第 1 题', DX, QY - 85, C.i, a * fl, 20);
    // 印章
    const st = q.st(), ss = prog(B.t, st, st + 0.45);
    if (q.v === 'TF') {
      K.redStamp('T', DX + 330, QY + 20, ss, a, C.j, 64); K.redStamp('F', DX + 395, QY + 35, prog(B.t, st + 0.12, st + 0.57), a, C.free, 64);
      ctag('分情况', DX + 365, QY + 110, { px: 28, a: a * gin(st + 0.4), color: C.i });
    } else K.redStamp(q.v, DX + 360, QY + 20, ss, a, q.v === 'T' ? C.j : C.free, 70);
    B.burst(DX + 360, QY + 20, st + 0.1, q.v === 'T' ? C.j : C.free, { r1: 200 });
    // 理由行
    q.ex.forEach(([tx, tf, col], k) => {
      const tk = tf(), g = a * gin(tk);
      ctag(tx, DX, EY + k * 68, { px: 34, a: g, color: col ?? C.ink, font: F.serif });
    });
    if (q.viz) VIZ[q.viz](a, q);
  }

  const mini = (x, y, M, a, col = C.ink, px = 30) => B.mat(x, y, M, { px, a, cell: () => ({ col }) });
  const VIZ = {
    // 反例：左右两个结果“碰撞”后弹开
    q1(a) {
      const g = a * gin(s('C04')); if (g <= 0) return;
      const yy = DY + 120;
      mini(DX - 330, yy, [[0, 1], [0, 0]], g * gin(cue('C04', 'A等于零')), C.i); ctag('A', DX - 330, yy - 75, { px: 28, a: g, color: C.i, font: F.serif });
      mini(DX - 160, yy, [[0, 0], [1, 0]], g * gin(cue('C04', 'B等于零')), C.k); ctag('B', DX - 160, yy - 75, { px: 28, a: g, color: C.k, font: F.serif });
      const tc = cue('C04', '平方是单位矩阵'), tr = cue('C04', '而A方加二AB加B方');
      const hit = prog(B.t, tr + 1.2, tr + 1.7), bounce = Math.sin(Math.PI * Math.min(1, hit)) * 40;
      const lx = DX + 60 + 60 * smoother(Math.min(1, hit * 2)) - bounce, rx = DX + 330 - 60 * smoother(Math.min(1, hit * 2)) + bounce;
      mini(lx, yy, [[1, 0], [0, 1]], g * gin(tc), OK); ctag('(A + B)²', lx, yy - 75, { px: 26, a: g * gin(tc), color: OK, font: F.serif });
      mini(rx, yy, [[2, 0], [0, 0]], g * gin(tr), C.free); ctag('A² + 2AB + B²', rx, yy - 75, { px: 26, a: g * gin(tr), color: C.free, font: F.serif });
      ctag('≠', (lx + rx) / 2, yy, { px: 56, a: g * gin(tr + 1.6), color: C.free, font: F.serif });
      B.flash(tr + 1.45, 0.25, 0.3, C.free);
    },
    q2(a) {
      const t0 = cue('G01', 'n等于一');
      K.glitch(t0 - 0.2, t0 + 1.4, 1);
      const g = a * B.win(s('G01'), s('C06') + 0.4);
      if (g > 0) { K.redStamp('n = 1 ?', DX - 300, DY + 210, prog(B.t, t0, t0 + 0.5), g, C.free, 44); }
      const q = smoother(prog(B.t, s('C05'), s('C05') + 0.5)) * (1 - gin(st2()));
      ctag('?', DX + 430, QY - 40 + Math.sin(B.t * 6) * 6, { px: 44, a: a * q * (0.6 + 0.4 * Math.sin(B.t * 9)), color: C.i, font: F.serif });
    },
    q3(a) {
      const g = a * gin(cue('C08', '关键一步')); if (g <= 0) return;
      ctag('k ≠ 0', DX + 330, EY + 230, { px: 48, a: g, color: C.peri, font: F.serif });
      K.ring(DX + 330, EY + 230, 80, C.peri, g, prog(B.t, cue('C08', '关键一步'), cue('C08', '关键一步') + 0.7), 5);
      const gp = a * gin(s('G02')); B.card(DX - 120, EY + 230, 460, 64, gp * 0.95, C.gpt); ctag('评分点：写出 k ≠ 0', DX - 120, EY + 230, { px: 30, a: gp, color: C.gpt });
    },
    cap(a) { axesViz(a, 'cap'); }, cup(a) { axesViz(a, 'cup'); },
    or(a) {
      const g = a * gin(cue('G03', '或字') - 0.2); if (g <= 0) return;
      // “或”字红圈
      const ox = DX + 2, oy = QY; K.ring(ox, oy, 34, C.free, g, prog(B.t, cue('G03', '或字'), cue('G03', '或字') + 0.6), 5);
      B.card(DX, DY + 250, 760, 70, g * 0.95, C.gpt); ctag('“或” = 并集 ⇒ 多半 F　　“且” = 交集 ⇒ 通常 T', DX, DY + 250, { px: 30, a: g, color: C.gpt });
    },
    last(a) {
      const g = a * gin(s('C26')); if (g <= 0) return;
      const M = B.mat(DX, DY + 160, [[1, 1, 0], [0, 0, 1]], { px: 40, a: g * gin(cue('C26', '比如增广矩阵')), bar: 2, cell: (i, j) => ({ col: i === 1 ? C.free : C.ink }) });
      if (B.t > cue('C26', '零等于一')) K.rowBox(M, 1, 0, 2, C.free, g * gin(cue('C26', '零等于一')));
      ctag('0 = 1 ✗', DX + 200, DY + 160 + 29, { px: 32, a: g * gin(cue('C26', '零等于一')), color: C.free, font: F.serif, align: 'left' });
    },
  };
  const st2 = () => Q[1].st();
  function axesViz(a, kind) {
    const t0 = kind === 'cap' ? s('D15') : s('D16'), g = a * gin(t0 + 0.2); if (g <= 0) return;
    const cx = DX, cy = DY + 170, R0 = 120;
    ctx.save(); ctx.globalAlpha = g * 0.5; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - R0 - 40, cy); ctx.lineTo(cx + R0 + 40, cy); ctx.moveTo(cx, cy + R0); ctx.lineTo(cx, cy - R0); ctx.stroke(); ctx.restore();
    if (kind === 'cap') {
      B.line2([cx - R0, cy + R0 * 0.6], [cx + R0, cy - R0 * 0.6], C.i, g, 5); B.line2([cx - R0, cy - R0 * 0.3], [cx + R0, cy + R0 * 0.3], C.j, g, 5);
      B.dot(cx, cy, 10, OK, g); ctag('S ∩ T = {0}', cx + 190, cy - 20, { px: 28, a: g, color: OK, font: F.serif });
    } else {
      B.line2([cx - R0 - 30, cy], [cx + R0 + 30, cy], C.i, g, 6); B.line2([cx, cy + R0], [cx, cy - R0], C.j, g, 6);
      const u = smoother(prog(B.t, cue('D16', '一、零加零'), cue('D16', '一、零加零') + 1.0)), U = 80;
      arrow(ctx, [cx, cy], [cx + U, cy], { color: C.i, width: 6, head: 18, alpha: g });
      arrow(ctx, [cx, cy], [cx, cy - U], { color: C.j, width: 6, head: 18, alpha: g });
      if (u > 0) { arrow(ctx, [cx, cy], [cx + U * u, cy - U * u], { color: C.free, width: 7, head: 20, alpha: g }); }
      ctag('(1, 1) ∉ S ∪ T', cx + U + 120, cy - U - 10, { px: 28, a: g * gin(cue('D16', '两条轴上都没有')), color: C.free, font: F.serif });
      B.cross(cx + U, cy - U, gin(cue('D16', '两条轴上都没有'), 0.4), g, 26);
    }
  }

  // ════ 最新卷全清 ════
  function shotClear() {
    const a = B.win(s('C12'), s('C13') - 0.2); if (a <= 0) return;
    const tc = cue('C12', '清完'), k = lerp(1.6, 1, outBack(prog(B.t, tc, tc + 0.5), 2));
    ctx.save(); ctx.translate(DX, DY - 60); ctx.scale(k, k); ctx.translate(-DX, -(DY - 60));
    B.card(DX, DY - 60, 720, 130, a * gin(tc), C.i); ctag('最新卷第 1 题 · 全清', DX, DY - 60, { px: 54, a: a * gin(tc), color: C.i, font: F.serif }); ctx.restore();
    B.burst(DX, DY - 60, tc + 0.1, C.i, { r1: 380, n: 26 }); B.burst(DX, DY - 60, tc + 0.35, C.peri, { r1: 300, n: 16 });
    ctag('往年判断题 · 加速', DX, DY + 110, { px: 34, a: a * gin(cue('C12', '接下来')), color: C.ink });
  }

  // ════ 连击计数 + 断连 + 总结 ════
  function shotCombo() {
    const [n, tp] = comboAt(); const a = B.win(s('D01'), s('C27') - 0.2, 0.3, 0.2);
    if (B.t < tBreak) { if (n > 0) B.combo(n, DX - 290, DY + 340, tp, a, 'COMBO'); return; }
    // 碎裂：×17 分成碎片飞散
    const u = prog(B.t, tBreak, tBreak + 0.9);
    if (u < 1) {
      for (let k = 0; k < 9; k++) {
        const ang = k * 0.7 + 0.3, r = 220 * outCubic(u);
        ctx.save(); ctx.globalAlpha = 1 - u; ctx.translate(DX - 330 + Math.cos(ang) * r, DY + 310 + Math.sin(ang) * r + 200 * u * u); ctx.rotate(ang * u * 3);
        ctx.fillStyle = C.peri; ctx.fillRect(-14, -10, 28, 20); ctx.restore();
      }
    }
    // 重组定格
    const g = gin(s('C27'));
    if (g > 0) { B.combo(17, DX + 130, DY - 120, s('C27'), g, 'COMBO · 最高纪录'); }
  }
  function shotShake() { const u = prog(B.t, tBreak, tBreak + 0.5); if (u <= 0 || u >= 1) return 0; return Math.sin(u * 60) * 14 * (1 - u); }

  function shotSummary() {
    const a = B.win(s('C27'), 1e9); if (a <= 0) return;
    const tk = cue('C27', '记住两个工具箱');
    const gF = a * gin(cue('C27', '反例用')), gT = a * gin(cue('C27', '证明用'));
    B.card(DX - 230, DY + 130, 420, 250, gF, C.free); B.card(DX + 230, DY + 130, 420, 250, gT, C.j);
    ctag('F · 反例工具箱', DX - 230, DY + 40, { px: 30, a: gF, color: C.free });
    ['2×2 小矩阵', '坐标轴', 'n = 1'].forEach((w, k) => ctag(w, DX - 230, DY + 105 + k * 52, { px: 32, a: gF * gin(cue('C27', '反例用') + 0.5 + k * 0.5), color: C.ink, font: F.serif }));
    ctag('T · 证明工具箱', DX + 230, DY + 40, { px: 30, a: gT, color: C.j });
    ['行列式', '反证', '移项'].forEach((w, k) => ctag(w, DX + 230, DY + 105 + k * 52, { px: 32, a: gT * gin(cue('C27', '证明用') + 0.4 + k * 0.4), color: C.ink, font: F.serif }));
    B.burst(DX, DY + 130, tk + 0.2, C.peri, { r1: 320 });
  }

  function draw(t) {
    B.frame(t, () => {
      const sh = shotShake(); if (sh) { ctx.save(); ctx.translate(sh, 0); }
      shotRules(); Q.forEach(shotQ); shotClear(); shotSummary(); shotCombo();
      B.paper(EX, 'y2526_q1', { t0: s('C01') + 0.6, dock: cue('C02', '规则') - 0.2, out: s('C12') - 0.2 });
      if (sh) ctx.restore();
    });
  }
  return { TL, draw };
}
