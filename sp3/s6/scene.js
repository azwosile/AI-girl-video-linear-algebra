// 特别篇 3 · 第 6 段：两道行列式判断题（2021–22 第 1(1)(2) 题）+ 本集五张卡 + 下集预告。
// 分镜：判断 ① A ≠ O、AB = O ⇒ |B| = 0？大肥鱼“或”的两条分支 → 反证三行（假设 → 右乘 B⁻¹ → A = O 矛盾，闪电）→ T 印章
//       → GPT：转置写法 vs 右乘写法（三行对比）→ 顺便：A 可逆时也成立 → 判断 ② det(αA) = α det A？大肥鱼抢答 → 反例 2I₂ → F 印章
//       → 五张卡扇形摊开 → 下一集：向量空间 · 证明模板。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'ds_ask', 'ds_confused', 'ds_happy', 'ds_think', 'gpt_point', 'gpt_proud'] };

export async function setup(R) {
  const EX = await loadExam(['y2122_t12']);
  const B = base(R, {
    assets, label: '特别篇 3 · 行列式', title: '两道行列式判断题', hi: 6, en: '2021–22 · T/F 1(1)(2)',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C05: 0.6, C07: 0.8, G02: 0.6 },
    post: { C01: 1.2, D01: 1.0, C02: 1.8, C03: 1.6, G01: 1.4, D02: 0.6, C04: 1.8, C05: 1.2, D03: 0.8, C06: 1.8, C07: 2.4, G02: 1.2, D04: 0.6, C08: 2.4 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const tP = [cue('C02', '假设B的行列式不等于零'), cue('C02', '两边右乘B的逆'), cue('C03', '矛盾')];
  const tF = cue('C07', '数乘提出n次方'), cards = ['数乘提出 n 次方', '余子式组合就换行', '消元挂计数器', '零多先找最空的行列', '有加号先乘再算'];
  const tCard = ['数乘提出n次方', '余子式组合就换行', '消元挂计数器', '零多先找最空的行列', '有加号先乘再算'].map(w => cue('C07', w));

  TL.sfx('whoosh', s('C01') + 0.2, 0.3); TL.sfx('stamp', s('C01') + 2.6, 0.3); TL.sfx('pop', s('D01') + 0.2, 0.25);
  tP.forEach((t, k) => TL.sfx(k === 2 ? 'zap' : 'type', t, 0.28)); TL.sfx('stamp', cue('C03', '判断为对'), 0.35);
  TL.sfx('click', s('G01') + 0.3, 0.3); TL.sfx('pop', s('D02') + 0.2, 0.25); TL.sfx('swoosh_soft', cue('C04', '如果A可逆'), 0.3);
  TL.sfx('whoosh', s('C05') + 0.2, 0.3); TL.sfx('sting', s('D03') + 0.2, 0.22); TL.sfx('slam', cue('C06', '右边是二'), 0.3); TL.sfx('stamp', cue('C06', '正确的公式'), 0.3);
  tCard.forEach(t => TL.sfx('swoosh_in', t, 0.25)); TL.sfx('swell', s('G02') - 0.2, 0.3); TL.sfx('sting', s('D04') + 0.1, 0.2); TL.sfx('bell_soft', e('C08') + 0.2, 0.35);

  function shotT1() {
    const a = B.win(s('C01') + 0.6, s('C05') - 0.2); if (a <= 0) return;
    B.qhead('判断 1(1)：A ≠ O，AB = O  ⇒  |B| = 0 ？', a);
    const gd = a * B.win(s('D01'), s('C02'));
    if (gd > 0) { ctag('|A| · |B| = 0', DX, DY - 220, { px: 38, a: gd, color: C.ds, font: F.serif });
      arrow(ctx, [DX - 40, DY - 190], [DX - 240, DY - 90], { color: C.ds, width: 4, head: 14, alpha: gd }); arrow(ctx, [DX + 40, DY - 190], [DX + 240, DY - 90], { color: C.ds, width: 4, head: 14, alpha: gd });
      ctag('|A| = 0 ?', DX - 280, DY - 60, { px: 32, a: gd, color: C.ds, font: F.serif }); ctag('|B| = 0 ?', DX + 280, DY - 60, { px: 32, a: gd, color: C.ds, font: F.serif }); }
    const gp = a * gin(s('C02'));
    if (gp > 0) {
      ['假设 |B| ≠ 0 ⇒ B 可逆', 'AB = O ⇒ A = O · B⁻¹ = O', '与 A ≠ O 矛盾 ⇒ |B| = 0'].forEach((tx, k) => {
        const g = gp * gin(tP[k]); B.xcard(tx, DX - 80, DY - 200 + k * 100, 640, 76, g, k === 2 ? C.free : C.peri, 30, k === 2 ? C.free : C.ink); });
      if (B.t > tP[2]) B.flash(tP[2], 0.25, 0.3, C.free);
      K.redStamp('T  对', DX + 360, DY - 100, prog(B.t, cue('C03', '判断为对'), cue('C03', '判断为对') + 0.5), gp * gin(cue('C03', '判断为对')), OK, 52);
    }
    const gG = a * B.win(s('G01'), s('D02'));
    if (gG > 0) { B.card(DX, DY + 170, 860, 90, gG * 0.95, C.gpt); ctag('参考答案：转置写法（绕）  ·  右乘 B⁻¹：三行写完', DX, DY + 170, { px: 26, a: gG, color: C.gpt }); }
    const g4 = a * gin(s('C04'));
    if (g4 > 0) { B.card(DX, DY + 200, 860, 110, g4 * 0.95, C.i);
      ctag('只问 |B|。若 A 可逆：A⁻¹AB = O ⇒ B = O ⇒ |B| = 0', DX, DY + 180, { px: 26, a: g4 * gin(cue('C04', '如果A可逆')), color: C.i, font: F.serif });
      ctag('不管 A 怎样，结论都成立', DX, DY + 225, { px: 26, a: g4 * gin(cue('C04', '所以不管A怎样')), color: C.i }); }
  }

  function shotT2() {
    const a = B.win(s('C05') + 0.4, s('C07') - 0.2); if (a <= 0) return;
    B.qhead('判断 1(2)：det(αA) = α det A ？', a);
    ctag('要 n 次方，错！反例 2I', DX, DY - 220, { px: 34, a: a * gin(s('D03') + 0.4) * (1 - gin(s('C06') + 1)), color: C.ds });
    const g = a * gin(s('C06'));
    if (g > 0) {
      ctag('α = 2,  A = I₂', DX, DY - 200, { px: 38, a: g, font: F.serif });
      ctag('左：det(2I₂) = 4', DX - 250, DY - 90, { px: 36, a: g * gin(cue('C06', '左边')), color: C.i, font: F.serif });
      ctag('右：2 · 1 = 2', DX + 250, DY - 90, { px: 36, a: g * gin(cue('C06', '右边是二')), color: C.k, font: F.serif });
      ctag('≠', DX, DY - 90, { px: 60, a: g * gin(cue('C06', '右边是二')), color: C.free, font: F.serif });
      B.xcard('det(αA) = αⁿ det A', DX, DY + 60, 560, 90, g * gin(cue('C06', '正确的公式')), OK, 40, OK);
      K.redStamp('F  错', DX + 360, DY + 200, prog(B.t, cue('C06', '右边是二'), cue('C06', '右边是二') + 0.5), g * gin(cue('C06', '右边是二')), C.free, 52);
    }
  }

  function shotOutro() {
    const a = B.win(s('C07'), 1e9); if (a <= 0) return;
    const gc = a * (1 - gin(s('G02') + 0.5) * 0.7);
    cards.forEach((tx, k) => { const u = outBack(prog(B.t, tCard[k], tCard[k] + 0.5), 1.6), ang = (k - 2) * 0.16 * u;
      const x = DX + (k - 2) * 230 * u, y = DY - 60 + Math.abs(k - 2) * 24 * u;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.translate(-x, -y);
      B.card(x, y, 220, 280, gc * gin(tCard[k]), [C.peri, C.i, C.j, C.k, C.free][k]);
      ctag(String(k + 1), x, y - 90, { px: 54, a: gc * gin(tCard[k]), color: [C.peri, C.i, C.j, C.k, C.free][k], font: F.serif });
      tx.match(/.{1,5}/g).forEach((ln, q) => ctag(ln, x, y + q * 40, { px: 28, a: gc * gin(tCard[k]), color: C.ink }));
      ctx.restore(); });
    const gn = a * gin(s('G02'));
    K.pill('下一集 · 向量空间', DX, DY + 200, C.i, gn, 34);
    ctag('每道证明的标准写法', DX, DY + 270, { px: 28, a: gn * gin(cue('G02', '标准写法')), color: C.ink });
    ctag('证明题也有模板', DX, DY + 330, { px: 32, a: a * gin(cue('C08', '证明题也有模板')), color: C.peri });
  }

  function draw(t) {
    B.frame(t, () => {
      shotT1(); shotT2(); shotOutro();
      B.paper(EX, 'y2122_t12', { t0: s('C01') + 0.2, dock: s('D01'), out: s('C07') - 0.4 });
    });
  }
  return { TL, draw };
}
