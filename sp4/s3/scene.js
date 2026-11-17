// 特别篇 4 · 第 3 段：交集是，并集不是（2024–25 第 7 题 = 2021–22 1(4)；2020–21 1(5)；2023–24 2(1)）。
// 分镜：3D 两张半透明平面（橙、青）过原点，交线发光 → 证明模板三行（左侧闸门编号），交线上两根箭头相加仍在交线上
//       → 评分点：“因为 S 是子空间” → 并集：2D x 轴 + y 轴，e₁ + e₂ = (1,1) 飞离两轴闪红 → F
//       → 反向封闭：U = x 轴，x = e₂、y = −e₂ 抵消成 0 落在 U 上，但 e₂ 不在 → F → 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba, load3D } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_proud', 'ds_think', 'gpt_point', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y2425_q7', 'y2021_t5', 'y2324_n2']);
  const P3 = new (await load3D())(900, { R: 3, nPlanes: 2, nLines: 3, nPoints: 1 });
  const B = base(R, {
    assets, label: '特别篇 4 · 向量空间与子空间', title: '交集是，并集不是', hi: 3, en: 'INTERSECTION YES · UNION NO',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C05: 0.8, C08: 0.8, C10: 0.6 },
    post: { C01: 1.6, C02: 1.6, C03: 2.0, C04: 2.0, G01: 1.6, C05: 1.0, D01: 0.8, C06: 2.0, C07: 1.6, C08: 1.2, D02: 0.6, C09: 2.0, G02: 1.6, C10: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tL = [s('C02') + 0.3, s('C03') + 0.3, s('C04') + 0.3];
  TL.sfx('hum', s('C01') + 0.5, 0.2); TL.sfx('shimmer', cue('C01', '考了两次'), 0.3);
  tL.forEach(t => { TL.sfx('type', t, 0.25); TL.sfx('ding_hi', t + 1.6, 0.25); }); TL.sfx('swoosh_soft', cue('C03', '所以x加y属于S'), 0.25);
  TL.sfx('zap', cue('G01', '会被扣分'), 0.25);
  TL.sfx('whoosh', s('C05') + 0.2, 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('whoosh', cue('C06', '可是e一加e二'), 0.3); TL.sfx('buzz', cue('C06', '既不在x轴上'), 0.3);
  TL.sfx('stamp', cue('C07', '所以错'), 0.35);
  TL.sfx('whoosh', s('C08') + 0.2, 0.3); TL.sfx('sting', s('D02') + 0.2, 0.2); TL.sfx('pop', cue('C09', 'x加y等于零'), 0.3); TL.sfx('stamp', cue('C09', '所以错'), 0.35);
  TL.sfx('click', cue('G02', '互相抵消成零'), 0.3); TL.sfx('swell', s('C10') - 0.2, 0.3);

  function shot3D(D) {
    const a = B.win(s('C01'), s('C05') - 0.2); if (a <= 0) return;
    P3.reset();
    P3.setPlane(0, [1, 0.3, -0.6], { color: C.peri, alpha: 0.3, scale: 0.85 * outCubic(prog(B.t, s('C01') + 0.6, s('C01') + 1.6)) });
    P3.setPlane(1, [-0.4, 1, 0.5], { color: C.j, alpha: 0.3, scale: 0.85 * outCubic(prog(B.t, s('C01') + 1.0, s('C01') + 2.0)) });
    const n1 = [1, 0.3, -0.6], n2 = [-0.4, 1, 0.5];
    const d = [n1[1] * n2[2] - n1[2] * n2[1], n1[2] * n2[0] - n1[0] * n2[2], n1[0] * n2[1] - n1[1] * n2[0]], nd = Math.hypot(...d), u = d.map(v => v / nd);
    P3.setLine(0, u, { color: C.i, width: 8, grow: gin(s('C01') + 2.2, 0.8) });
    const gA = gin(cue('C03', '所以x加y属于S'));
    if (gA > 0) {
      P3.setLine(1, u, { p0: [0, 0, 0], half: 0.8, color: C.ink, width: 6, grow: gA });
      P3.setLine(2, u, { p0: u.map(v => v * 0.8), half: 0.6, color: C.k, width: 6, grow: gin(cue('C03', '所以x加y属于S') + 0.5) });
      P3.setPoint(0, u.map(v => v * 2.0), { r: 0.13, color: OK, alpha: gin(cue('C03', '同理')) });
    }
    B.show3D(P3, D, a * (1 - gin(s('C02')) * 0.55), { el: 22, az: -50 + (B.t - s('C01')) * 4, dist: 14, axesA: 0.35, floorA: 0.1 });
    const gp = a * gin(s('C02'));
    if (gp > 0) {
      B.qhead('S ∩ T 是子空间：标准写法三行', gp);
      [['①', '0 ∈ S 且 0 ∈ T ⇒ 0 ∈ S ∩ T'], ['②', 'x, y ∈ S ∩ T：S 是子空间 ⇒ x + y ∈ S；同理 ∈ T ⇒ x + y ∈ S ∩ T'], ['③', 'x ∈ S ∩ T，α ∈ ℝ：αx ∈ S 且 ∈ T ⇒ αx ∈ S ∩ T']].forEach(([n, tx], k) => {
        const g = gp * gin(tL[k]), y = DY - 150 + k * 120;
        B.card(DX, y, 1000, 90, g * 0.92, k === 1 && B.t > s('G01') ? C.gpt : C.peri);
        ctag(n, DX - 450, y, { px: 34, a: g, color: C.j, font: F.serif }); K.type(tx, DX - 400, y, tL[k], 2.2, g, { px: 26 }); });
      const gG = a * gin(s('G01'));
      if (gG > 0) { const y = DY - 30; ctx.save(); ctx.globalAlpha = gG; ctx.strokeStyle = C.gpt; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(DX - 120, y, 150, 30, 0, 0, 7); ctx.stroke(); ctx.restore();
        ctag('评分点：写出理由“S 是子空间”', DX, DY + 240, { px: 30, a: gG, color: C.gpt }); }
    }
  }

  function axes2D(ox, oy, u, a) {
    for (let k = -4; k <= 4; k++) { B.line2([ox + k * u, oy - 3.5 * u], [ox + k * u, oy + 3.5 * u], C.inkMid, a * 0.15, 1); B.line2([ox - 4.5 * u, oy + k * u * 0.8], [ox + 4.5 * u, oy + k * u * 0.8], C.inkMid, a * 0.15, 1); }
  }

  function shotUnion() {
    const a = B.win(s('C05') + 0.4, s('C08') - 0.2); if (a <= 0) return;
    B.qhead('2020–21 · 判断 1(5)：S ∪ T 是子空间？', a);
    const ox = DX - 140, oy = DY + 60, u = 80;
    const g = a * gin(s('C06'));
    if (g > 0) {
      axes2D(ox, oy, u, g);
      B.line2([ox - 4.5 * u, oy], [ox + 4.5 * u, oy], C.peri, g, 6); ctag('S = x 轴', ox + 4.5 * u + 70, oy, { px: 26, a: g, color: C.peri });
      B.line2([ox, oy + 3.5 * u], [ox, oy - 3.5 * u], C.j, g, 6); ctag('T = y 轴', ox, oy - 3.5 * u - 30, { px: 26, a: g, color: C.j });
      arrow(ctx, [ox, oy], [ox + 2 * u, oy], { color: C.i, width: 6, head: 18, alpha: g * gin(cue('C06', 'e一在S里')) }); ctag('e₁', ox + 2 * u, oy + 30, { px: 26, a: g * gin(cue('C06', 'e一在S里')), color: C.i, font: F.serif });
      arrow(ctx, [ox, oy], [ox, oy - 2 * u], { color: C.k, width: 6, head: 18, alpha: g * gin(cue('C06', 'e二在T里')) }); ctag('e₂', ox - 30, oy - 2 * u, { px: 26, a: g * gin(cue('C06', 'e二在T里')), color: C.k, font: F.serif });
      const tS = cue('C06', '可是e一加e二'), us = smoother(prog(B.t, tS, tS + 0.8));
      if (us > 0) { arrow(ctx, [ox, oy], [ox + 2 * u * us, oy - 2 * u * us], { color: C.free, width: 7, head: 20, alpha: g }); B.line2([ox + 2 * u, oy], [ox + 2 * u, oy - 2 * u], C.inkMid, g * us * 0.5, 2, [6, 6]); B.line2([ox, oy - 2 * u], [ox + 2 * u, oy - 2 * u], C.inkMid, g * us * 0.5, 2, [6, 6]);
        ctag('(1, 1) ∉ S ∪ T', ox + 2 * u + 140, oy - 2 * u - 20, { px: 30, a: g * gin(cue('C06', '既不在x轴上')), color: C.free, font: F.serif });
        if (B.t > cue('C06', '既不在x轴上')) { B.flash(cue('C06', '既不在x轴上'), 0.2, 0.3, C.free); K.ring(ox + 2 * u, oy - 2 * u, 30, C.free, g, prog(B.t, cue('C06', '既不在x轴上'), cue('C06', '既不在x轴上') + 0.4)); } }
      K.redStamp('F  加法不封闭', DX + 360, DY + 240, prog(B.t, cue('C07', '所以错'), cue('C07', '所以错') + 0.5), g * gin(cue('C07', '所以错')), C.free, 40);
      ctag('两条线拼在一起 ≠ 一个面', DX + 360, DY - 200, { px: 26, a: g * gin(cue('C07', '两条线拼在一起')), color: C.i });
    }
  }

  function shotRev() {
    const a = B.win(s('C08') + 0.4, s('C10') - 0.2); if (a <= 0) return;
    B.qhead('2023–24 · 判断 2(1)：x + y ∈ U ⇒ x ∈ U 且 y ∈ U？', a);
    const ox = DX - 140, oy = DY + 60, u = 80, g = a * gin(s('C09'));
    if (g > 0) {
      axes2D(ox, oy, u, g);
      B.line2([ox - 4.5 * u, oy], [ox + 4.5 * u, oy], C.peri, g, 7); ctag('U = x 轴', ox + 4.5 * u + 70, oy, { px: 26, a: g, color: C.peri });
      const t0 = cue('C09', '取x等于e二'), m = smoother(prog(B.t, cue('C09', 'x加y等于零') - 0.3, cue('C09', 'x加y等于零') + 0.4));
      arrow(ctx, [ox, oy], [ox, oy - 2 * u * (1 - m)], { color: C.k, width: 6, head: 18, alpha: g * gin(t0) * (1 - m * 0.7) }); ctag('x = e₂', ox + 60, oy - 2 * u, { px: 26, a: g * gin(t0), color: C.k, font: F.serif });
      arrow(ctx, [ox, oy], [ox, oy + 2 * u * (1 - m)], { color: C.i, width: 6, head: 18, alpha: g * gin(cue('C09', 'y等于负e二')) * (1 - m * 0.7) }); ctag('y = −e₂', ox + 70, oy + 2 * u, { px: 26, a: g * gin(cue('C09', 'y等于负e二')), color: C.i, font: F.serif });
      if (m > 0) { B.dot(ox, oy, 14, OK, g * m); ctag('x + y = 0 ∈ U', ox - 150, oy - 40, { px: 28, a: g * m, color: OK, font: F.serif }); B.burst(ox, oy, cue('C09', 'x加y等于零') + 0.3, OK, { r1: 120 }); }
      ctag('但 e₂ ∉ U', ox + 120, oy - 2 * u - 50, { px: 30, a: g * gin(cue('C09', '可e二不在x轴上')), color: C.free });
      K.redStamp('F', DX + 360, DY + 200, prog(B.t, cue('C09', '所以错'), cue('C09', '所以错') + 0.5), g * gin(cue('C09', '所以错')), C.free, 70);
      const gG = a * gin(s('G02'));
      B.card(DX + 330, DY - 160, 520, 110, gG * 0.95, C.gpt);
      ctag('凑反例诀窍：', DX + 330, DY - 185, { px: 26, a: gG, color: C.gpt }); ctag('两个坏向量抵消成 0', DX + 330, DY - 135, { px: 28, a: gG * gin(cue('G02', '互相抵消成零')), color: C.gpt });
    }
  }

  function shotOutro() {
    const a = B.win(s('C10'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 交与并', ['① 交集：三行模板（写理由）', '② 并集：两条坐标轴', '③ 反向封闭：x 与 −x 抵消'],
      [s('C10') + 0.3, cue('C10', '并集'), cue('C10', '反过来的封闭')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, (D) => {
      shot3D(D); shotUnion(); shotRev(); shotOutro();
      B.paper(EX, 'y2425_q7', { t0: s('C01') + 0.3, dock: s('C01') + 2.4, out: s('C02') - 0.2 });
      B.paper(EX, 'y2021_t5', { t0: s('C05') + 0.1, dock: s('D01'), out: s('C08') - 0.4 });
      B.paper(EX, 'y2324_n2', { t0: s('C08') + 0.1, dock: s('D02'), out: s('C10') - 0.4 });
    });
  }
  return { TL, draw };
}
