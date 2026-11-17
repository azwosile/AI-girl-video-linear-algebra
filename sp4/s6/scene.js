// 特别篇 4 · 第 6 段：证明题——交为零 ⇒ 并起来无关（2023–24 第 8 题，10 分）+ 本集总结 + 下集预告。
// 分镜：原题 → 两片光幕（橙 U、青 V）只在原点相交 → GPT 开头句 → 移项动画：d 两项带负号跳到右边，左染橙右染青
//       → 两根箭头困在各自光幕里，被迫挤向原点 → 四步板书（右侧依据）→ 评分点四格 → 关键想法“移项分家”
//       → 五张套路卡 + 证无关模板扇形 → 下集：约定之战。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_write', 'ds_shock', 'ds_think', 'gpt_explain', 'gpt_point', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y2324_q8']);
  const B = base(R, {
    assets, label: '特别篇 4 · 向量空间与子空间', title: '交为零 ⇒ 并起来无关', hi: 6, en: '2023–24 · Q8 · 10 PTS · PROOF',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.4, C08: 0.8, G03: 0.6 },
    post: { C01: 1.6, D01: 0.6, G01: 1.8, C02: 1.8, C03: 1.8, C04: 2.0, C05: 2.0, C06: 1.6, G02: 2.0, D02: 1.0, C07: 1.6, C08: 2.4, G03: 2.4 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tMove = cue('C02', '等于负的'), tSide = s('C03') + 0.3, tSq = cue('C04', '只能是零向量');
  const steps = [['设 c₁u₁ + c₂u₂ + d₁v₁ + d₂v₂ = 0', '① 设', s('G01') + 0.3], ['c₁u₁ + c₂u₂ = −(d₁v₁ + d₂v₂)', '② 移项', tMove], ['左 ∈ U，右 ∈ V ⇒ 二者 ∈ U ∩ V = {0}', '③ U ∩ V = {0}', cue('C04', '属于U交V')], ['u 无关 ⇒ c₁ = c₂ = 0；v 无关 ⇒ d₁ = d₂ = 0', '④ 基无关', s('C05') + 0.3]];
  const SUM = ['数乘查四条', '三道闸门', '交集模板 / 并集反例', '三把刀', '朗斯基 / 系数向量', '证无关从“设”开始'];
  const tS = ['怪数乘查四条', '子空间过三道闸门', '交集用三行模板', '相关性有三把刀', '函数用朗斯基', '证无关从设开始'].map(w => cue('C08', w));

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 3.0, 0.3); TL.sfx('hum', cue('C01', '只在零向量相交'), 0.22);
  TL.sfx('pop', s('D01') + 0.2, 0.25); TL.sfx('type', s('G01') + 0.3, 0.25);
  TL.sfx('swoosh_in', tMove, 0.3); TL.sfx('pluck', tMove + 0.6, 0.28); TL.sfx('shimmer', tSide, 0.28); TL.sfx('warp', cue('C04', '左右两边相等'), 0.25); TL.sfx('thud', tSq, 0.32);
  TL.sfx('ding', cue('C05', '所以c一、c二都等于零'), 0.3); TL.sfx('ding', cue('C05', '推出d一、d二都等于零'), 0.3); TL.sfx('stamp', cue('C06', '证毕'), 0.35);
  [0, 1, 2, 3].forEach(k => TL.sfx('check', cue('G02', ['开头的设', '移项后指出', '用U交V只有零', '用基线性无关'][k]), 0.25));
  TL.sfx('sparkle', s('D02') + 0.3, 0.25); TL.sfx('ding_hi', cue('D02', '移项把U和V分开'), 0.28);
  tS.forEach(t => TL.sfx('swoosh_in', t, 0.22)); TL.sfx('swell', s('G03') - 0.2, 0.3); TL.sfx('bell_soft', e('G03') + 0.3, 0.35);

  function curtains(ox, oy, a, sq = 0, vecs = 0) {
    if (a <= 0) return;
    const band = (ang, col) => { ctx.save(); ctx.translate(ox, oy); ctx.rotate(ang); ctx.globalAlpha = a * 0.22; ctx.fillStyle = col; ctx.fillRect(-380, -26, 760, 52); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-380, 0); ctx.lineTo(380, 0); ctx.stroke(); ctx.restore(); };
    band(-0.35, C.peri); band(0.55, C.j);
    ctag('U', ox + 360 * Math.cos(-0.35) + 30, oy + 360 * Math.sin(-0.35), { px: 34, a, color: C.peri, font: F.serif });
    ctag('V', ox + 360 * Math.cos(0.55) + 30, oy + 360 * Math.sin(0.55), { px: 34, a, color: C.j, font: F.serif });
    const pulse = 0.6 + 0.4 * Math.sin(B.t * 5); B.dot(ox, oy, 10 + 4 * pulse, C.i, a); ctag('U ∩ V = {0}', ox - 120, oy + 50, { px: 24, a: a * gin(cue('C01', '只在零向量相交')), color: C.i, font: F.serif });
    if (vecs > 0) { const r = 260 * (1 - sq);
      arrow(ctx, [ox, oy], [ox + r * Math.cos(-0.35), oy + r * Math.sin(-0.35)], { color: C.peri, width: 7, head: 20, alpha: a * vecs * (r > 8 ? 1 : 0) });
      arrow(ctx, [ox, oy], [ox + r * Math.cos(0.55), oy + r * Math.sin(0.55)], { color: C.j, width: 7, head: 20, alpha: a * vecs * (r > 8 ? 1 : 0) });
      if (sq > 0.98) B.burst(ox, oy, tSq + 0.6, C.i, { r1: 140 }); }
  }

  function shotProof() {
    const a = B.win(s('C01') + 0.6, s('C08') - 0.3); if (a <= 0) return;
    B.qhead('2023–24 · 第 8 题 · 10 分：U ∩ V = {0} ⇒ u₁, u₂, v₁, v₂ 无关', a);
    const board = B.t > s('C05');
    // 光幕（证明前半段在右，四步板书时淡出）
    const gc = a * gin(cue('C01', '只在零向量相交')) * (1 - gin(s('C06')) * 0.8);
    const sq = smoother(prog(B.t, cue('C04', '左右两边相等'), tSq + 0.4));
    curtains(DX + 320, DY + 60, gc * (board ? 0.4 : 1), sq, gin(tSide));
    // 等式与移项
    const ge = a * gin(s('G01') + 0.3) * (1 - gin(s('C05') - 0.2));
    if (ge > 0) {
      const y = DY - 200, mv = smoother(prog(B.t, tMove, tMove + 0.8)), sd = gin(tSide);
      ctag('c₁u₁ + c₂u₂', DX - 400, y, { px: 34, a: ge, color: sd > 0 ? C.peri : C.ink, font: F.serif });
      const dx0 = DX - 160, dx1 = DX + 40;
      ctag(mv < 0.5 ? '+ d₁v₁ + d₂v₂' : '−(d₁v₁ + d₂v₂)', lerp(dx0, dx1 + 60, mv), y - Math.sin(Math.PI * mv) * 70, { px: 34, a: ge, color: sd > 0 ? C.j : C.ink, font: F.serif });
      ctag('=', lerp(DX - 10 + 70, DX - 60, mv) + 0, y, { px: 34, a: ge, font: F.serif });
      ctag('0', lerp(DX + 80, DX + 300, mv), y, { px: 34, a: ge * (1 - mv), font: F.serif });
      ctag('∈ U', DX - 400, y + 50, { px: 26, a: ge * sd, color: C.peri, font: F.serif }); ctag('∈ V', dx1 + 60, y + 50, { px: 26, a: ge * sd, color: C.j, font: F.serif });
      ctag('目标：所有系数 = 0', DX - 300, y - 70, { px: 24, a: ge * gin(cue('G01', '目标是证明')) * (1 - mv), color: C.gpt });
      ctag('⇒ 两边都 = 0', DX - 200, y + 130, { px: 34, a: ge * gin(tSq), color: C.i, font: F.serif });
    }
    // 四步板书
    const gb = a * gin(s('C05'));
    if (gb > 0) steps.forEach(([tx, why, t], k) => { const y = DY - 210 + k * 105, g = gb * (k < 3 ? 1 : gin(t));
      B.card(DX - 80, y, 1040, 86, g * 0.92, B.t > cue('G02', ['开头的设', '移项后指出', '用U交V只有零', '用基线性无关'][k]) ? C.gpt : C.peri);
      ctag(tx, DX - 560, y, { px: 26, a: g, align: 'left', font: F.serif }); ctag(why, DX + 340, y, { px: 22, a: g, color: C.i, align: 'left' });
      if (B.t > cue('G02', ['开头的设', '移项后指出', '用U交V只有零', '用基线性无关'][k])) ctag('✓', DX + 470, y, { px: 30, a: g, color: C.gpt }); });
    K.redStamp('证毕', DX + 380, DY + 260, prog(B.t, cue('C06', '证毕'), cue('C06', '证毕') + 0.5), a * gin(cue('C06', '证毕')), OK, 54);
    const gk = a * gin(cue('D02', '移项把U和V分开'));
    K.pill('关键想法：移项分家（以后的“直和”还会用）', DX - 80, DY + 250, C.ds, gk, 26);
  }

  function shotOutro() {
    const a = B.win(s('C08'), 1e9); if (a <= 0) return;
    const gc = a * (1 - gin(s('G03') + 0.5) * 0.7);
    SUM.forEach((tx, k) => { const u = outBack(prog(B.t, tS[k], tS[k] + 0.5), 1.6), ang = (k - 2.5) * 0.13 * u, x = DX + (k - 2.5) * 200 * u, y = DY - 70 + Math.abs(k - 2.5) * 20 * u;
      const col = [C.peri, C.i, C.j, C.k, C.free, OK][k];
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.translate(-x, -y);
      B.card(x, y, 190, 250, gc * gin(tS[k]), col); ctag(String(k + 1), x, y - 80, { px: 46, a: gc * gin(tS[k]), color: col, font: F.serif });
      tx.split(' / ').forEach((ln, q, arr) => ln.match(/.{1,5}/g).forEach((l2, r) => ctag(l2, x, y - 10 + (q * 2 + r) * 34, { px: 24, a: gc * gin(tS[k]), color: C.ink })));
      ctx.restore(); });
    const gn = a * gin(s('G03'));
    K.pill('下一集 · 过渡矩阵', DX, DY + 190, C.i, gn, 34);
    ctag('Leon  ⇄  同济：写法正好相反 —— 约定之战', DX, DY + 260, { px: 28, a: gn * gin(cue('G03', '正好相反')), color: C.peri });
  }

  function draw(t) {
    B.frame(t, () => {
      shotProof(); shotOutro();
      B.paper(EX, 'y2324_q8', { t0: s('C01') + 0.2, dock: s('D01'), out: s('C08') - 0.4 });
    });
  }
  return { TL, draw };
}
