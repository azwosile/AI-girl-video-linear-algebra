// 特别篇 5 · 第 1 段：过渡矩阵的“约定之战”。
// 分镜：开场 VS 擂台：左 Leon（管坐标，橙）右 同济（管基，青）→ Leon 卡：[x]_F = S[x]_E，S = F⁻¹E（坐标箭头从 E 系飞到 F 系）
//       → 同济卡：β = αP，P = α⁻¹β（新基向量用旧基写，系数排成列）→ 中间一个“互为逆”双向箭头
//       → 两份本校答案纸卡分列两侧（2021–22 第 6 题 Leon / 2020–21 第 5 题 同济）→ “老师也没统一” → 策略：第一行写定义式（高亮框）
//       → 推荐 Leon → GPT 口诀“到谁，就用谁的逆”大字。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'ds_confused', 'ds_shock', 'gpt_cross', 'gpt_point'] };

export async function setup(R) {
  const EX = await loadExam(['y2122_q6', 'y2021_q5']);
  const B = base(R, {
    assets, label: '特别篇 5 · 过渡矩阵', title: '约定之战', hi: 1, en: 'LEON vs TONGJI · TRANSITION MATRIX',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C03: 0.4, C06: 0.6, G02: 0.6 },
    post: { C01: 1.6, D01: 0.6, C02: 1.8, C03: 2.4, C04: 2.4, C05: 2.0, G01: 2.0, D02: 0.8, C06: 2.2, C07: 1.8, G02: 3.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  TL.sfx('riser', cue('C01', '约定之战') - 0.5, 0.25); TL.sfx('slam', cue('C01', '约定之战') + 0.2, 0.35); TL.sfx('pop', s('D01') + 0.2, 0.25);
  TL.sfx('crack', cue('C02', '两个不同的矩阵'), 0.3); TL.sfx('warp', cue('C02', '互为逆矩阵'), 0.25);
  TL.sfx('swoosh_in', s('C03') + 0.2, 0.3); TL.sfx('whoosh', cue('C03', '变成在F下的坐标'), 0.28); TL.sfx('ding', cue('C03', '算出来S等于'), 0.3);
  TL.sfx('swoosh_in', s('C04') + 0.2, 0.3); TL.sfx('pluck', cue('C04', '系数排成列'), 0.28); TL.sfx('ding', cue('C04', 'P等于'), 0.3);
  TL.sfx('zap', cue('C05', '两者互为逆矩阵'), 0.3); TL.sfx('stamp', cue('G01', '一份按Leon'), 0.28); TL.sfx('stamp', cue('G01', '一份按同济'), 0.28); TL.sfx('glitch', cue('G01', '没有统一'), 0.22);
  TL.sfx('sting', s('D02') + 0.2, 0.2); TL.sfx('type', cue('C06', '先写出你用的定义式'), 0.28); TL.sfx('ding_hi', cue('C06', '都给分'), 0.3);
  TL.sfx('click', cue('C07', '推荐Leon写法'), 0.3); TL.sfx('swell', s('G02') - 0.2, 0.3); TL.sfx('impact', cue('G02', '到谁，就用谁的逆'), 0.35);

  function arena(a) {
    if (a <= 0) return;
    const sh = 1 - outBack(prog(B.t, cue('C01', '约定之战'), cue('C01', '约定之战') + 0.6), 2);
    B.xcard('Leon', DX - 380 - sh * 300, DY - 230, 280, 90, a, C.peri, 44, C.peri);
    B.xcard('同济', DX + 380 + sh * 300, DY - 230, 280, 90, a, C.j, 44, C.j);
    const k = lerp(2, 1, outBack(prog(B.t, cue('C01', '约定之战') + 0.2, cue('C01', '约定之战') + 0.7), 2));
    ctx.save(); ctx.translate(DX, DY - 230); ctx.scale(k, k); ctx.translate(-DX, -(DY - 230));
    ctag('VS', DX, DY - 230, { px: 70, a: a * gin(cue('C01', '约定之战') + 0.2), color: C.free, font: F.serif }); ctx.restore();
  }

  function shotDefs() {
    const a = B.win(s('C01') + 0.6, s('G01') - 0.2); if (a <= 0) return;
    arena(a);
    ctag('“从 E 到 F 的过渡矩阵”', DX, DY - 120, { px: 34, a: a * B.win(s('C02'), s('C03')), color: C.ink });
    ctag('两本书 → 两个不同的矩阵（互为逆）', DX, DY - 50, { px: 30, a: a * B.win(cue('C02', '两个不同的矩阵'), s('C03')), color: C.free });
    // Leon
    const gL = a * gin(s('C03'));
    if (gL > 0) {
      ctag('管坐标', DX - 380, DY - 140, { px: 28, a: gL, color: C.peri });
      ctag('[x]_F = S [x]_E', DX - 380, DY - 60, { px: 40, a: gL * gin(cue('C03', 'x的F坐标等于')), color: C.ink, font: F.serif });
      // 坐标从 E 飞向 F
      const u = prog(B.t, cue('C03', '变成在F下的坐标'), cue('C03', '变成在F下的坐标') + 0.9);
      ctag('[x]_E', DX - 520, DY + 50, { px: 30, a: gL, color: C.inkMid, font: F.serif }); ctag('[x]_F', DX - 240, DY + 50, { px: 30, a: gL * gin(cue('C03', '变成在F下的坐标') + 0.6), color: C.peri, font: F.serif });
      if (u > 0) arrow(ctx, [DX - 470, DY + 50], [DX - 290, DY + 50], { color: C.peri, width: 5, head: 16, alpha: gL, grow: smoother(u) });
      ctag('S', DX - 380, DY + 20, { px: 28, a: gL * gin(cue('C03', '变成在F下的坐标')), color: C.peri, font: F.serif });
      B.xcard('S = F⁻¹E', DX - 380, DY + 150, 300, 80, gL * gin(cue('C03', '算出来S等于')), C.peri, 40, C.peri);
    }
    const gT = a * gin(s('C04'));
    if (gT > 0) {
      ctag('管基', DX + 380, DY - 140, { px: 28, a: gT, color: C.j });
      ctag('(β₁, β₂, β₃) = (α₁, α₂, α₃) P', DX + 380, DY - 60, { px: 32, a: gT * gin(cue('C04', '贝塔等于阿尔法乘P')), color: C.ink, font: F.serif });
      ctag('新基用旧基表示 → 系数排成列', DX + 380, DY + 40, { px: 24, a: gT * gin(cue('C04', '系数排成列')), color: C.j });
      B.xcard('P = α⁻¹β', DX + 380, DY + 150, 300, 80, gT * gin(cue('C04', 'P等于')), C.j, 40, C.j);
    }
    const g5 = a * gin(s('C05'));
    if (g5 > 0) {
      ctag('E → F：  F⁻¹E   vs   E⁻¹F', DX, DY + 260, { px: 36, a: g5, font: F.serif });
      const u = prog(B.t, cue('C05', '两者互为逆矩阵'), cue('C05', '两者互为逆矩阵') + 0.6);
      arrow(ctx, [DX - 200, DY + 150], [DX + 200, DY + 150], { color: C.free, width: 5, head: 16, alpha: g5 * (u > 0 ? 1 : 0), grow: smoother(u) });
      arrow(ctx, [DX + 200, DY + 150], [DX - 200, DY + 150], { color: C.free, width: 5, head: 16, alpha: g5 * (u > 0 ? 1 : 0), grow: smoother(u) });
      ctag('互为逆', DX, DY + 115, { px: 28, a: g5 * gin(cue('C05', '两者互为逆矩阵')), color: C.free });
    }
  }

  function shotStrategy() {
    const a = B.win(s('G01'), s('G02') - 0.2); if (a <= 0) return;
    const gG = a * B.win(s('G01'), s('C06'));
    if (gG > 0) {
      ctag('本校两份参考答案', DX, DY - 300, { px: 30, a: gG, color: C.gpt });
      ctag('Leon：S = U⁻¹V', DX - 330, DY + 230, { px: 30, a: gG * gin(cue('G01', '一份按Leon')), color: C.peri, font: F.serif });
      ctag('同济：(u) = (v) S', DX + 330, DY + 230, { px: 30, a: gG * gin(cue('G01', '一份按同济')), color: C.j, font: F.serif });
      ctag('老师们自己也没统一', DX, DY + 300, { px: 30, a: gG * gin(cue('G01', '没有统一')), color: C.free });
    }
    const g6 = a * gin(s('C06'));
    if (g6 > 0) {
      ctag('答卷第一行：', DX - 300, DY - 180, { px: 32, a: g6, color: C.i });
      B.card(DX + 60, DY - 100, 760, 100, g6, C.i);
      K.type('设 [x]_F = S [x]_E', DX - 220, DY - 100, cue('C06', '先写出你用的定义式'), 1.4, g6, { px: 40, col: C.ink });
      ctag('定义写清楚 → 按哪种算都给分', DX, DY + 30, { px: 32, a: g6 * gin(cue('C06', '定义写清楚了')), color: OK });
      const g7 = a * gin(s('C07'));
      B.xcard('问坐标 → 推荐 Leon：S 一乘就出来', DX, DY + 150, 680, 80, g7, C.peri, 30, C.peri);
      ctag('本集：全部 Leon 写法，最后附同济版', DX, DY + 240, { px: 26, a: g7 * gin(cue('C07', '这一集的所有题')), color: C.inkMid });
    }
  }

  function shotMotto() {
    const a = B.win(s('G02'), 1e9); if (a <= 0) return;
    ctag('S = （目标基）⁻¹ × （出发基）', DX, DY - 120, { px: 46, a: a * gin(s('G02') + 0.3), color: C.ink, font: F.serif });
    const t0 = cue('G02', '到谁，就用谁的逆'), k = lerp(1.8, 1, outBack(prog(B.t, t0, t0 + 0.6), 2));
    ctx.save(); ctx.translate(DX, DY + 40); ctx.scale(k, k); ctx.translate(-DX, -(DY + 40));
    ctag('到谁，就用谁的逆', DX, DY + 40, { px: 76, a: a * gin(t0), color: C.peri, font: F.serif }); ctx.restore();
    B.burst(DX, DY + 40, t0 + 0.1, C.peri, { r1: 420, n: 26 });
  }

  function draw(t) {
    B.frame(t, () => {
      shotDefs(); shotStrategy(); shotMotto();
      B.paper(EX, 'y2122_q6', { t0: cue('G01', '一份按Leon'), dock: cue('G01', '一份按Leon') + 0.8, out: cue('G01', '一份按同济') - 0.3 });
      B.paper(EX, 'y2021_q5', { t0: cue('G01', '一份按同济'), dock: cue('G01', '一份按同济') + 0.8, out: s('C06') - 0.2 });
    });
  }
  return { TL, draw };
}
