// 特别篇 4 · 第 1 段：怪数乘——公理逐条过（2017–18 第 5 题；2024–25 判断 2(1)；2018–19 第 10 题）。
// 分镜：原题 → 怪数乘动画：向量 (x₁,x₂) 被 α 只拉横向，竖向不动（平面网格上演示）→ 八条公理墙：A1–A4 一键绿灯，A5–A8 待查
//       → A5 两边逐项算 → 绿灯 → A6 两边 → 第二分量 x₂ vs 2x₂ 闪红 → 红灯 → 反例 α=β=1, x=(0,1)：(0,1) ≠ (0,2)
//       → 评分点 → “不是向量空间”印章 → 零元唯一：0 + 0′ 两条算法汇到一个式子 → β0 = 0、αx = 0 两串等号（等号上标理由）→ 套路卡。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_write', 'ds_confused', 'ds_think', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y1718_q5', 'y2425_t2']);
  const B = base(R, {
    assets, label: '特别篇 4 · 向量空间与子空间', title: '怪数乘：公理逐条过', hi: 1, en: 'WEIRD SCALAR MULTIPLICATION',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C02: 0.6, C09: 0.8, C12: 0.8, C15: 0.6 },
    post: { C01: 1.2, C02: 1.6, D01: 0.8, C03: 1.6, C04: 2.0, C05: 1.8, C06: 1.8, C07: 2.0, G01: 1.6, C08: 1.4, C09: 1.4, C10: 1.8, C11: 1.6, C12: 1.2, C13: 2.0, C14: 2.2, G02: 1.6, D02: 0.8, C15: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tA14 = cue('C03', '前四条自动成立'), tA5 = cue('C04', '相等，绿灯'), tA6 = cue('C06', '红灯');
  TL.sfx('whoosh', s('C02') + 0.2, 0.3); TL.sfx('stamp', s('C02') + 2.6, 0.3); TL.sfx('warp', cue('C02', '只乘第一个分量'), 0.3);
  TL.sfx('pop', s('D01') + 0.2, 0.25); [0, 1, 2, 3].forEach(k => TL.sfx('ding_hi', tA14 + k * 0.15, 0.22));
  TL.sfx('ding', tA5, 0.32); TL.sfx('glitch', cue('C06', 'x二被加了两次'), 0.25); TL.sfx('buzz', tA6, 0.32);
  TL.sfx('type', cue('C07', '取阿尔法和贝塔都等于一'), 0.25); TL.sfx('slam', cue('C07', '不相等'), 0.3); TL.sfx('zap', s('G01') + 0.3, 0.25);
  TL.sfx('stamp', s('C08') + 0.3, 0.35); TL.sfx('whoosh', s('C09') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C10', '把零加零撇算两遍'), 0.3); TL.sfx('ding_hi', s('C11') + 0.3, 0.3);
  TL.sfx('whoosh', s('C12') + 0.2, 0.3); TL.sfx('type', s('C13') + 0.3, 0.25); TL.sfx('type', s('C14') + 0.3, 0.25); TL.sfx('pluck', cue('G02', '在等号上方标注'), 0.3); TL.sfx('sparkle', s('D02') + 0.2, 0.25);
  TL.sfx('swell', s('C15') - 0.2, 0.3);

  function shotWeird() {
    const a = B.win(s('C02') + 1.2, s('C03') - 0.2); if (a <= 0) return;
    B.qhead('2017–18 · 第 5 题 · 12 分：V 是向量空间吗？', a);
    ctag('α ∘ (x₁, x₂) = (α x₁, x₂)', DX, DY - 260, { px: 44, a: a * gin(cue('C02', '数乘被改了')), color: C.peri, font: F.serif });
    const g = a * gin(cue('C02', '只乘第一个分量'));
    if (g > 0) {
      const ox = DX - 200, oy = DY + 140, u = 60;
      for (let k = -5; k <= 8; k++) B.line2([ox + k * u, oy - 4 * u], [ox + k * u, oy + 1.5 * u], C.inkMid, g * 0.18, 1);
      for (let k = -1; k <= 4; k++) B.line2([ox - 5 * u, oy - k * u], [ox + 8 * u, oy - k * u], C.inkMid, g * 0.18, 1);
      const al = lerp(1, 2.5, 0.5 - 0.5 * Math.cos((B.t - cue('C02', '只乘第一个分量')) * 1.6));
      arrow(ctx, [ox, oy], [ox + 2 * u, oy - 2 * u], { color: C.inkMid, width: 4, head: 14, alpha: g * 0.6 });
      arrow(ctx, [ox, oy], [ox + 2 * al * u, oy - 2 * u], { color: C.peri, width: 6, head: 18, alpha: g });
      ctag('α = ' + al.toFixed(1), ox + 2 * al * u + 60, oy - 2 * u - 20, { px: 26, a: g, color: C.peri, font: F.serif });
      ctag('竖向不动', ox + 600, oy - 60, { px: 28, a: g, color: C.i });
    }
  }

  const AX = ['A1 加法交换', 'A2 加法结合', 'A3 零元', 'A4 负元', 'A5 α(x+y)', 'A6 (α+β)x', 'A7 (αβ)x', 'A8 1·x'];
  function wall(a, x0 = DX - 470, y0 = DY - 300) {
    if (a <= 0) return;
    AX.forEach((tx, k) => { const x = x0 + (k % 4) * 0, y = y0 + k * 62, isAdd = k < 4;
      let st = 0; if (isAdd && B.t > tA14 + k * 0.15) st = 1; if (k === 4 && B.t > tA5) st = 1; if (k === 5 && B.t > tA6) st = -1; if ((k === 6 || k === 7) && B.t > cue('G01', 'A七、A八是成立的')) st = 1;
      const col = st > 0 ? C.j : st < 0 ? C.free : C.inkMid;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x - 30, y, 12, 0, 7); ctx.fill(); if (st) { ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.fill(); } ctx.restore();
      ctag(tx, x, y, { px: 24, a: a * (isAdd || B.t > cue('C03', '后四条') ? 1 : 0.5), color: k >= 4 ? C.ink : C.inkMid, align: 'left', font: F.serif }); });
    ctag('加法 4 条', x0 + 60, y0 - 50, { px: 22, a: a * gin(cue('C03', '加法四条')), color: C.j });
  }

  function shotAx() {
    const a = B.win(s('C03'), s('C09') - 0.3); if (a <= 0) return;
    wall(a);
    const x = DX + 160;
    const g4 = a * B.win(s('C04'), s('C05') - 0.1);
    if (g4 > 0) {
      ctag('α ∘ (x + y) = (α(x₁ + y₁), x₂ + y₂)', x, DY - 160, { px: 32, a: g4, font: F.serif });
      ctag('α∘x + α∘y = (αx₁ + αy₁, x₂ + y₂)', x, DY - 80, { px: 32, a: g4 * gin(cue('C04', '加阿尔法圈乘y')), font: F.serif });
      B.xcard('相等 ✓', x, DY + 30, 240, 70, g4 * gin(tA5), C.j, 32, C.j);
    }
    const g5 = a * B.win(s('C05'), s('C07') - 0.1);
    if (g5 > 0) {
      const hot = B.t > cue('C06', '看第二个分量');
      ctag('(α + β) ∘ x = ((α+β)x₁,', x - 60, DY - 160, { px: 32, a: g5, font: F.serif }); ctag('x₂)', x + 250, DY - 160, { px: 32, a: g5, color: hot ? C.i : C.ink, font: F.serif });
      ctag('α∘x + β∘x = ((α+β)x₁,', x - 60, DY - 80, { px: 32, a: g5 * gin(cue('C05', '而阿尔法圈乘x')), font: F.serif }); ctag('2x₂)', x + 255, DY - 80, { px: 32, a: g5 * gin(cue('C05', '而阿尔法圈乘x')), color: hot ? C.free : C.ink, font: F.serif });
      if (hot) { K.ring(x + 250, DY - 160, 40, C.i, g5, prog(B.t, cue('C06', '看第二个分量'), cue('C06', '看第二个分量') + 0.4)); K.ring(x + 255, DY - 80, 46, C.free, g5, prog(B.t, cue('C06', 'x二被加了两次'), cue('C06', 'x二被加了两次') + 0.4)); }
      B.xcard('A6 ✗', x, DY + 30, 240, 70, g5 * gin(tA6), C.free, 32, C.free);
      if (B.t > tA6) B.flash(tA6, 0.2, 0.3, C.free);
    }
    const g7 = a * gin(s('C07'));
    if (g7 > 0) {
      ctag('α = β = 1,  x = (0, 1)', x, DY - 180, { px: 34, a: g7, color: C.i, font: F.serif });
      ctag('左：2 ∘ (0, 1) = (0, 1)', x, DY - 100, { px: 32, a: g7 * gin(cue('C07', '左边')), font: F.serif });
      ctag('右：(0, 1) + (0, 1) = (0, 2)', x, DY - 40, { px: 32, a: g7 * gin(cue('C07', '右边')), font: F.serif });
      ctag('≠', x + 260, DY - 70, { px: 56, a: g7 * gin(cue('C07', '不相等')), color: C.free, font: F.serif });
      const gG = a * gin(s('G01'));
      B.card(x, DY + 90, 660, 110, gG * 0.95, C.gpt);
      ctag('评分点：必须代具体的数', x, DY + 65, { px: 26, a: gG, color: C.gpt });
      ctag('A7、A8 成立，可顺手一句', x, DY + 112, { px: 24, a: gG * gin(cue('G01', 'A七、A八是成立的')), color: C.gpt });
      K.redStamp('不是向量空间', x, DY + 250, prog(B.t, s('C08') + 0.3, s('C08') + 0.8), a * gin(s('C08') + 0.3), C.free, 46);
    }
  }

  function shotZero() {
    const a = B.win(s('C09') + 0.4, s('C12') - 0.3); if (a <= 0) return;
    B.qhead('2024–25 · 判断 2(1)：零元唯一（T）', a);
    const g = a * gin(cue('C10', '把零加零撇算两遍'));
    if (g > 0) {
      ctag('0 + 0′', DX, DY - 150, { px: 54, a: g, color: C.ink, font: F.serif });
      arrow(ctx, [DX - 60, DY - 110], [DX - 260, DY - 10], { color: C.peri, width: 4, head: 14, alpha: g * gin(cue('C10', '因为零撇是零元')) });
      arrow(ctx, [DX + 60, DY - 110], [DX + 260, DY - 10], { color: C.j, width: 4, head: 14, alpha: g * gin(cue('C10', '因为零是零元')) });
      ctag('= 0（0′ 是零元）', DX - 300, DY + 30, { px: 32, a: g * gin(cue('C10', '因为零撇是零元')), color: C.peri, font: F.serif });
      ctag('= 0′ + 0 = 0′（0 是零元）', DX + 300, DY + 30, { px: 32, a: g * gin(cue('C10', '因为零是零元')), color: C.j, font: F.serif });
      ctag('⇒  0 = 0′', DX, DY + 170, { px: 56, a: a * gin(s('C11')), color: OK, font: F.serif });
      B.burst(DX, DY + 170, s('C11') + 0.3, OK, { r1: 220 });
    }
  }

  function shotProof() {
    const a = B.win(s('C12') + 0.4, s('C15') - 0.2); if (a <= 0) return;
    B.qhead('2018–19 · 第 10 题：两个小证明', a);
    const g1 = a * gin(s('C13'));
    const eqs1 = [['β0', ''], ['= β(0 + 0)', 'A3'], ['= β0 + β0', 'A5']];
    eqs1.forEach(([tx, why], k) => { const x = DX - 420 + k * 300, y = DY - 200, g = g1 * gin(s('C13') + 0.3 + k * 0.9);
      ctag(tx, x, y, { px: 34, a: g, font: F.serif }); if (why) ctag(why, x - 60, y - 40, { px: 20, a: g * gin(cue('G02', '在等号上方标注')), color: C.i, font: F.serif }); });
    ctag('两边加 −(β0)  ⇒  0 = β0', DX, DY - 120, { px: 32, a: g1 * gin(cue('C13', '两边同时加上')), color: OK, font: F.serif });
    const g2 = a * gin(s('C14'));
    const eqs2 = [['x = 1x', 'A8'], ['= (α⁻¹α)x', ''], ['= α⁻¹(αx)', 'A7'], ['= α⁻¹0', ''], ['= 0', '第一问']];
    ctag('设 αx = 0，α ≠ 0：', DX - 300, DY - 20, { px: 30, a: g2, color: C.i });
    eqs2.forEach(([tx, why], k) => { const x = DX - 460 + k * 230, y = DY + 60, g = g2 * gin(cue('C14', '那么x等于') + k * 0.8);
      ctag(tx, x, y, { px: 32, a: g, font: F.serif }); if (why) ctag(why, x - 40, y - 40, { px: 20, a: g * gin(cue('G02', '在等号上方标注')), color: C.i, font: F.serif }); });
    ctag('⇒ α = 0 或 x = 0', DX, DY + 150, { px: 34, a: g2 * gin(cue('C14', '所以阿尔法等于零')), color: OK, font: F.serif });
    const gG = a * gin(s('G02'));
    B.card(DX, DY + 260, 840, 76, gG * 0.95, C.gpt); ctag('每个等号 = 一条公理或已证结论，标在等号上方', DX, DY + 260, { px: 26, a: gG, color: C.gpt });
    K.pill('证明 = 一串有理由的等号', DX, DY + 340, C.ds, a * gin(s('D02')), 26);
  }

  function shotOutro() {
    const a = B.win(s('C15'), 1e9); if (a <= 0) return;
    K.recipeCard('套路卡 · 公理验证', ['① 加法照常：只查数乘四条', '② 说不成立：给具体反例', '③ 证明：一串标了理由的等号'],
      [s('C15') + 0.3, cue('C15', '说不成立'), cue('C15', '证明')], a, { y: DY - 40 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotWeird(); shotAx(); shotZero(); shotProof(); shotOutro();
      B.paper(EX, 'y1718_q5', { t0: s('C02') + 0.2, dock: s('C02') + 1.2, out: s('C09') - 0.4 });
      B.paper(EX, 'y2425_t2', { t0: s('C09') + 0.1, dock: s('C10'), out: s('C12') - 0.4 });
    });
  }
  return { TL, draw };
}
