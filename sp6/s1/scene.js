// 特别篇 6 · 第 1 段：RREF 读心术（总论：行变换不改变列之间的线性关系）。
// 分镜：A 缓缓旋转 + “压轴”盖章 + 分值条 → RREF 反推的问号 → 定理卡 → U = EA 证明（Ac=0 ⇔ Uc=0）
//       → A 与 U 上下对齐，U 第 4 列发光拉丝线到第 1、3 列，丝线复刻到 A → 三条推论卡（第三张红框）
//       → U 的列 vs A 的列（零行对比）→ 评分点 → 口诀“行用 U，列用 A”。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit, neg, vec } from '../kit.js';

export const assets = { chars: ['claude_point', 'claude_explain', 'claude_smile', 'ds_confused', 'ds_think', 'gpt_point'] };

export async function setup(R) {
  const B = base(R, {
    assets, label: '特别篇 6 · 秩与四个子空间', title: 'RREF 读心术', hi: 4, en: 'READING THE RREF',
    titleEnd: () => B.L('D01').s,
    pre: { C02: 0.4, C05: 0.6, C06: 0.6, G01: 0.3, D02: 0.3 },
    post: { C01: 0.8, C02: 1.4, C03: 1.0, C04: 0.8, C05: 1.6, C06: 0.6, C07: 1.2, G01: 0.8, D02: 0.6, C08: 1.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const A = [[1, 3, 3, 2], [2, 6, 9, 7], [-1, -3, 3, 4]];
  const U = [[1, 3, 0, -1], [0, 0, 1, 1], [0, 0, 0, 0]];

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('slam', cue('C01', '压轴'), 0.4);
  [0, 1, 2, 3].forEach(i => TL.sfx('pop', cue('C01', '分值从') + i * 0.25, 0.25));
  TL.sfx('buzz', s('D01') + 0.5, 0.18);
  TL.sfx('impact', cue('C02', '行变换'), 0.35); TL.sfx('shimmer', cue('C02', '线性关系'), 0.3);
  TL.sfx('tick', cue('C03', '左乘'), 0.3); TL.sfx('tick', cue('C03', '如果A的列'), 0.3); TL.sfx('ding_hi', cue('C03', '也等于零'), 0.3); TL.sfx('swoosh_soft', cue('C03', '反过来'), 0.3);
  TL.sfx('stamp', cue('C04', '完全相同'), 0.3);
  TL.sfx('pop', cue('C05', '第四列'), 0.3);
  TL.sfx('pluck', cue('C05', 'u四等于'), 0.35); TL.sfx('pluck', cue('C05', 'u四等于') + 0.45, 0.35);
  TL.sfx('pluck', cue('C05', '必然有'), 0.35); TL.sfx('pluck', cue('C05', '必然有') + 0.45, 0.35); TL.sfx('ding_hi', cue('C05', '必然有') + 1.3, 0.3);
  TL.sfx('pop', cue('C06', '第一'), 0.3); TL.sfx('pop', cue('C06', '第二'), 0.3);
  TL.sfx('crack', cue('C07', '列空间不同'), 0.35); TL.sfx('pop', cue('C07', '主元列的位置'), 0.3); TL.sfx('ding_hi', cue('C07', '是原矩阵的列'), 0.3);
  TL.sfx('buzz', cue('G01', '直接零分'), 0.22);
  TL.sfx('pop', cue('D02', '行用U'), 0.3); TL.sfx('stamp', s('C08') + 0.4, 0.4); TL.sfx('shimmer', s('C08') + 0.6, 0.3);

  // ════ 开场：旋转的 A + 盖章 + 分值条 ════
  function shotIntro() {
    const a = B.win(0.4, s('C02') - 0.1); if (a <= 0) return;
    const sp = B.t * 0.35, k = outCubic(prog(B.t, 0.5, 1.6));
    ctx.save(); ctx.translate(DX, DY - 40); ctx.transform(Math.cos(sp) * 0.25 + 0.75, Math.sin(sp) * 0.06, -Math.sin(sp) * 0.06, 1, 0, 0); ctx.scale(k, k); ctx.translate(-DX, -(DY - 40));
    const up = smoother(prog(B.t, s('D01'), s('D01') + 0.6));
    B.mat(lerp(DX, DX - 230, up), DY - 40, A, { px: lerp(56, 40, up), a: a * (1 - 0.0 * up) });
    ctx.restore();
    // 压轴盖章
    K.redStamp('压轴 · RREF 反推', DX + 40, DY + 200, prog(B.t, cue('C01', '压轴'), cue('C01', '压轴') + 0.5), a * (1 - gin(s('D01'))), C.peri, 50);
    // 分值条
    const sc = [['2025–26', 24], ['2024–25', 15], ['2017–18', 15], ['2022–23', 10]], t0 = cue('C01', '分值从');
    sc.forEach(([y, v], i) => {
      const g = a * gin(t0 + i * 0.25) * (1 - gin(s('D01'))); if (g <= 0) return;
      const yy = DY - 300 + i * 52, wv = v * 14 * outCubic(prog(B.t, t0 + i * 0.25, t0 + i * 0.25 + 0.6));
      ctag(y, DX + 150, yy, { px: 24, a: g, color: C.inkMid, align: 'right' });
      ctx.save(); ctx.globalAlpha = g; ctx.fillStyle = i ? rgba(C.peri, 0.6) : C.peri; ctx.fillRect(DX + 170, yy - 14, wv, 28); ctx.restore();
      ctag(v + ' 分', DX + 190 + wv, yy, { px: 26, a: g, color: C.ink, align: 'left', font: F.serif });
    });
    // D01：RREF → ? → A
    const g = a * gin(s('D01') + 0.3);
    if (g > 0) {
      B.mat(DX + 230, DY - 40, U, { px: 40, a: g, cell: (i, j) => ({ col: U[i][j] === 1 && U.slice(0, i).every(r => r[j] === 0) && U[i].slice(0, j).every(v => v === 0) ? C.i : C.ink }) });
      ctag('A', DX - 230, DY - 175, { px: 40, a: g, color: C.ink, font: F.serif }); ctag('U = rref(A)', DX + 230, DY - 175, { px: 34, a: g, color: C.i, font: F.serif });
      arrow(ctx, [DX - 70, DY - 70], [DX + 70, DY - 70], { color: C.inkMid, width: 4, head: 16, alpha: g });
      arrow(ctx, [DX + 70, DY - 10], [DX - 70, DY - 10], { color: C.free, width: 5, head: 18, alpha: g * gin(cue('D01', '倒推')), grow: gin(cue('D01', '倒推'), 0.6) });
      ctag('?', DX, DY + 40, { px: 64, a: g * gin(cue('D01', '倒推')), color: C.free, font: F.serif });
    }
  }

  // ════ 定理卡 + 证明 ════
  function shotTheorem() {
    const a = B.win(s('C02'), s('C05') - 0.2); if (a <= 0) return;
    const up = smoother(prog(B.t, s('C03') - 0.2, s('C03') + 0.5));
    const y = lerp(DY - 40, DY - 300, up), g = a * gin(cue('C02', '行变换'));
    B.card(DX, y, 780, 110, g, OK);
    ctag('行变换不改变', DX, y - 22, { px: lerp(40, 32, up), a: g, color: C.ink });
    ctag('列与列之间的线性关系', DX, y + 26, { px: lerp(44, 34, up), a: g * gin(cue('C02', '列与列')), color: OK });
    B.burst(DX, y, cue('C02', '线性关系'), OK, { r1: 260 });
    B.flash(cue('C02', '行变换'), 0.18);
    // 证明
    const p = a * up;
    texAt('ueq', DX, DY - 150, 46, { alpha: p * gin(cue('C03', '左乘')) });
    ctag('E 可逆（初等矩阵之积）', DX, DY - 92, { px: 26, a: p * gin(cue('C03', '可逆矩阵')), color: C.inkMid });
    texAt('pf1', DX, DY - 10, 42, { alpha: p * gin(cue('C03', '如果A的列')), reveal: rv(cue('C03', '如果A的列'), e('C03') - cue('C03', '如果A的列') - 1.6) });
    texAt('pf2', DX, DY + 80, 42, { alpha: p * gin(cue('C03', '反过来')), reveal: rv(cue('C03', '反过来'), 1.2) });
    B.ghalo('pf1', DX, DY - 10, 42, 'z', p * B.win(cue('C03', '也等于零'), e('C03') + 0.3));
    // C04：N(A) = N(U)
    const g4 = a * gin(s('C04'));
    if (g4 > 0) {
      B.answer('nul', DX, DY + 200, 48, g4 * gin(cue('C04', '完全相同') - 0.6), { col: OK });
      ctag('A 的列关系  ＝  U 的列关系', DX, DY + 310, { px: 34, a: a * gin(cue('C04', '之间就有')), color: OK, font: F.serif });
      B.burst(DX, DY + 200, cue('C04', '完全相同'), OK, { r1: 220 });
    }
  }

  // ════ A 与 U 对齐 + 丝线 ════
  const top = DY - 230, bot = DY + 90;
  function shotThreads() {
    const a = B.win(s('C05') - 0.2, s('C06') + 0.2); if (a <= 0) return;
    const g = a * gin(s('C05') - 0.2);
    const MA = B.mat(DX + 30, bot, A, { px: 42, a: g, cell: (i, j) => ({ col: j === 3 && B.t > cue('C05', '必然有') + 1.2 ? OK : (j === 0 || j === 2) && B.t > cue('C05', '必然有') ? C.i : C.ink }) });
    const MU = B.mat(DX + 30, top, U, { px: 42, a: g, cell: (i, j) => ({ col: j === 3 && B.t > cue('C05', '第四列') ? C.peri : (j === 0 || j === 2) && B.t > cue('C05', 'u四等于') ? C.j : C.ink }) });
    ctag('U', DX - 250, top, { px: 42, a: g, color: C.j, font: F.serif }); ctag('A', DX - 250, bot, { px: 42, a: g, color: C.i, font: F.serif });
    ['u₁', 'u₂', 'u₃', 'u₄'].forEach((l, j) => ctag(l, MU.cell(0, j)[0], top + 110, { px: 26, a: g, color: C.j }));
    ['a₁', 'a₂', 'a₃', 'a₄'].forEach((l, j) => ctag(l, MA.cell(2, j)[0], bot + 110, { px: 26, a: g, color: C.i }));
    // U 第 4 列发光
    K.colBox(MU, 3, 0, 2, C.peri, g * gin(cue('C05', '第四列')), 30);
    K.threads(MU, 3, [[0, '−1'], [2, '+1']], cue('C05', 'u四等于'), C.j, g, { dy: -40, lift: 70 });
    ctag('u₄ = −u₁ + u₃', DX + 420, top, { px: 32, a: g * gin(cue('C05', 'u四等于') + 0.8), color: C.j, font: F.serif });
    // 复刻到 A
    K.colBox(MA, 3, 0, 2, OK, g * gin(cue('C05', '必然有') + 1.0), 30);
    const ta = cue('C05', '必然有');
    // 丝线从 U 竖直“滴”到 A
    [0, 2, 3].forEach((j, q) => { const [x] = MU.cell(2, j), y0 = top + 70, y1 = bot - 90; const u = prog(B.t, ta - 0.6 + q * 0.12, ta + 0.2 + q * 0.12);
      if (u > 0) { ctx.save(); ctx.globalAlpha = g * (1 - prog(B.t, ta + 1.6, ta + 2.2)) * 0.8; ctx.strokeStyle = C.j; ctx.setLineDash([6, 8]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(y0, y1, smoother(u))); ctx.stroke(); ctx.restore(); } });
    K.threads(MA, 3, [[0, '−1'], [2, '+1']], ta, OK, g, { dy: -40, lift: 70 });
    ctag('a₄ = −a₁ + a₃', DX + 420, bot, { px: 32, a: g * gin(ta + 1.0), color: OK, font: F.serif });
    ctag('(2, 7, 4) = −(1, 2, −1) + (3, 9, 3) ✓', DX + 30, bot + 175, { px: 28, a: g * gin(ta + 1.6), color: OK, font: F.serif });
    B.burst(DX + 420, bot, ta + 1.2, OK, { r1: 150 });
  }

  // ════ 三条推论 ════
  function shotThree() {
    const a = B.win(s('C06'), s('D02') - 0.1); if (a <= 0) return;
    const cards = [
      ['①', 'N(A) = N(U)', '✓', OK, cue('C06', '第一')],
      ['②', '行空间 R(Aᵀ) = R(Uᵀ)', '✓', OK, cue('C06', '第二')],
      ['③', '列空间 R(A) ≠ R(U)', '✗', C.free, cue('C07', '列空间不同')],
    ];
    const shrink = smoother(prog(B.t, cue('C07', 'U的列下面') - 0.3, cue('C07', 'U的列下面') + 0.4));
    cards.forEach(([n, txt, mk, col, t0], i) => {
      const g = a * gin(t0, 0.45); if (g <= 0) return;
      const pop = outBack(prog(B.t, t0, t0 + 0.45), 2), y = lerp(DY - 250 + i * 120, DY - 330 + i * 70, shrink), w = lerp(640, 520, shrink), h = lerp(92, 58, shrink);
      ctx.save(); ctx.translate(DX, y); ctx.scale(lerp(0.6, 1, pop), lerp(0.6, 1, pop)); ctx.translate(-DX, -y);
      B.card(DX, y, w, h, g, col); if (i === 2) { ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.free; ctx.lineWidth = 6; ctx.strokeRect(DX - w / 2 - 6, y - h / 2 - 6, w + 12, h + 12); ctx.restore(); }
      ctag(n, DX - w / 2 + 36, y, { px: lerp(34, 26, shrink), a: g, color: col, font: F.serif });
      ctag(txt, DX, y, { px: lerp(34, 28, shrink), a: g, color: C.ink, font: F.serif });
      ctag(mk, DX + w / 2 - 36, y, { px: lerp(40, 30, shrink), a: g, color: col, font: F.serif });
      ctx.restore();
    });
    // 行空间：U 的行是 A 的行的组合
    ctag('U 的行 = A 的行的组合（可逆，反过来也是）', DX, DY + 120, { px: 28, a: a * B.win(cue('C06', '第二') + 0.6, s('C07') - 0.2), color: C.inkMid });
    // ③ 展开：U 列 vs A 列
    const g = a * shrink;
    if (g > 0) {
      const MU = B.mat(DX - 210, DY + 40, U, { px: 36, a: g, cell: (i, j) => ({ col: i === 2 ? C.free : (j === 0 || j === 2) ? C.j : C.ink }) });
      const MA = B.mat(DX + 230, DY + 40, A, { px: 36, a: g, cell: (i, j) => ({ col: (j === 0 || j === 2) ? C.i : C.ink }) });
      ctag('U', DX - 210, DY - 70, { px: 34, a: g, color: C.j, font: F.serif }); ctag('A', DX + 230, DY - 70, { px: 34, a: g, color: C.i, font: F.serif });
      K.rowBox(MU, 2, 0, 3, C.free, g * B.win(cue('C07', 'U的列下面'), cue('C07', '主元列的位置')), 24);
      ctag('最后一个分量全是 0', DX - 210, DY + 140, { px: 26, a: g * B.win(cue('C07', 'U的列下面') + 0.3, cue('C07', '主元列的位置')), color: C.free });
      ctag('A 的列：不是', DX + 230, DY + 140, { px: 26, a: g * B.win(cue('C07', 'A的列不是'), cue('C07', '主元列的位置')), color: C.ink });
      const tp = cue('C07', '主元列的位置');
      [0, 2].forEach(j => { K.colBox(MU, j, 0, 2, C.j, g * gin(tp), 26); K.colBox(MA, j, 0, 2, C.i, g * gin(tp + 0.4), 26); });
      ctag('主元列位置相同：第 1、3 列', DX, DY + 150, { px: 28, a: g * B.win(tp + 0.3, e('C07') + 2), color: C.j });
      const gb = a * gin(cue('C07', '列空间的基'));
      B.card(DX, DY + 250, 760, 80, gb * 0.95, C.i);
      ctag('列空间的基 = A 的主元列 (1, 2, −1)，(3, 9, 3)', DX, DY + 250, { px: 30, a: gb, color: C.i, font: F.serif });
      B.cross(DX - 210, DY + 40, gin(cue('C07', '不是U的列'), 0.4), g * gin(cue('C07', '不是U的列')), 90);
      B.burst(DX, DY + 250, cue('C07', '是原矩阵的列'), C.i, { r1: 260 });
      // G01 评分点
      const g1 = a * gin(s('G01'));
      B.xcard('评分点：列空间的基写成 U 的主元列 → 这一问 0 分', DX, DY + 360, 820, 70, g1, C.free, 30);
    }
  }

  // ════ 口诀 ════
  function shotMotto() {
    const a = B.win(s('D02') - 0.1, 1e9); if (a <= 0) return;
    const g1 = a * gin(s('D02')), g2 = a * gin(cue('D02', '列空间用'));
    B.card(DX - 200, DY - 120, 360, 200, g1, C.j); B.card(DX + 200, DY - 120, 360, 200, g2, C.i);
    ctag('行空间', DX - 200, DY - 170, { px: 30, a: g1, color: C.inkMid }); ctag('用 U 的行', DX - 200, DY - 100, { px: 46, a: g1, color: C.j, font: F.serif });
    ctag('列空间', DX + 200, DY - 170, { px: 30, a: g2, color: C.inkMid }); ctag('用 A 的列', DX + 200, DY - 100, { px: 46, a: g2, color: C.i, font: F.serif });
    const tm = cue('D02', '行用U'), gm = a * gin(tm);
    const k = lerp(1.6, 1, outBack(prog(B.t, tm, tm + 0.5), 2));
    ctx.save(); ctx.translate(DX, DY + 120); ctx.scale(k, k); ctx.translate(-DX, -(DY + 120));
    B.card(DX, DY + 120, 620, 120, gm, C.peri); ctag('行用 U，列用 A', DX, DY + 120, { px: 62, a: gm, color: C.peri, font: F.serif }); ctx.restore();
    K.redStamp('本集口诀', DX + 260, DY + 230, prog(B.t, s('C08') + 0.4, s('C08') + 0.9), a, C.peri, 34);
    B.burst(DX, DY + 120, s('C08') + 0.5, C.peri, { r1: 340, n: 24 });
    B.flash(s('C08') + 0.4, 0.15);
  }

  function draw(t) {
    B.frame(t, () => { shotIntro(); shotTheorem(); shotThreads(); shotThree(); shotMotto(); });
  }
  return { TL, draw };
}
