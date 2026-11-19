// 第 6 章 复习（上）判断题（Leon 9th Chapter 6 Test A 第 1–9、14 题，共 10 道）。
// 答案：1T 2F 3T 4F 5F 6F 7F 8F 9T 14F；大肥鱼 6 / 10（对 1、3、4、6、9、14）。
// 结构同 5.x：题卡 → 抢答气泡 → 判定印章 → 理由 / 最小反例（剪切的特征线、单位阵的满扇形、重数柱）。左栏：大肥鱼答题卡（两列）。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, LX, OK, I2, Plane, arrow } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'claude_think', 'ds_happy', 'ds_think', 'ds_proud', 'ds_confused'] };

export async function setup(R) {
  const QD = [
    [1, 'C02', 'D02', '对', true, 'C03', '特征值全非零 ⇒ 可逆？', 1],
    [2, 'C04', 'D03', '对', false, 'C05', 'A 与 Aᵀ 特征向量相同？', 2],
    [3, 'C06', 'D04', '对', true, 'C07', '相似 ⇒ 特征值相同？', 3],
    [4, 'C08', 'D05', '错', false, 'C09', '特征值相同 ⇒ 相似？', 4],
    [5, 'C10', 'D06', '对', false, 'C11', '有重根 ⇒ 亏损？', 5],
    [6, 'C12', 'D07', '错', false, 'C13', '秩 3，0 三重 ⇒ 可对角化？', 6],
    [7, 'C14', 'D08', '对', false, 'C15', '秩 1，0 三重 ⇒ 亏损？', 7],
    [8, 'C16', 'D09', '对', false, 'C17', '秩 = 非零特征值个数？', 8],
    [9, 'C18', 'D10', '对', true, 'C19', '秩 = 非零奇异值个数？', 9],
    [10, 'C20', 'D11', '错', false, 'C21', '对称 + det > 0 ⇒ 正定？（原第 14 题）', 14],
  ];
  const pre = {}, post = {};
  QD.forEach(q => { pre[q[1]] = 0.8; pre[q[5]] = 0.3; post[q[5]] = 0.6; });
  Object.assign(post, { C01: 0.8, C05: 1.4, C09: 1.2, C11: 1.0, C13: 1.0, C15: 1.2, C17: 1.0, C22: 0.8, C23: 0.8 }); pre.D12 = 0.6;
  let QS;
  const B = base(R, { assets, label: '第六章 · 复习', title: '判断题 10 道', hi: 3, en: 'CHAPTER TEST A', titleEnd: () => QS[0].s, pre, post });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  QS = QD.map(([n, q, ds, ans, truth, v, zh, orig]) => ({ n, q, ds, ans, truth, v, zh, orig, key: 'q' + n }));
  QS.forEach((Q, i) => { Q.s = L(Q.q).s - 0.6; Q.da = L(Q.ds).s + 0.2; Q.vt = L(Q.v).s + 0.15; Q.e = i < QS.length - 1 ? L(QS[i + 1].q).s - 0.7 : L('D12').s - 0.4; Q.right = (Q.ans === '对') === Q.truth; });
  const T = {
    hi: cue('D01', '来考我'), rule: cue('C01', '永远成立'), ce: cue('C01', '反例'),
    q2b: cue('C05', '反例'), q4b: cue('C09', '可是和单位矩阵相似的'), q5b: cue('C11', '有重根仅仅是'), q7b: cue('C15', '剩下那个'),
    sc: L('D12').s, sum: L('C22').s, s1: cue('C22', '第二题'), s2: cue('C22', '第五、第七题'), s3: L('C23').s, s4: cue('C23', '这四道错题'), next: L('C24').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.rule, 0.3); TL.sfx('pop', T.ce, 0.3);
  QS.forEach(Q => { TL.sfx('whoosh', Q.s, 0.3); TL.sfx('pop', Q.da + 0.3, 0.28); TL.sfx(Q.truth ? 'ding_hi' : 'stamp', Q.vt, 0.38); TL.sfx(Q.right ? 'sparkle' : 'buzz', Q.vt + 0.5, 0.2); });
  TL.sfx('warp', T.q2b + 1.0, 0.3); TL.sfx('pop', T.q4b, 0.3); TL.sfx('shimmer', L('C11').s + 0.5, 0.3); TL.sfx('pop', T.q7b, 0.3);
  TL.sfx('ding_lo', T.sc + 0.3, 0.3); [T.s1, T.s2, T.s3].forEach(x => TL.sfx('pluck', x, 0.25)); TL.sfx('bell_soft', T.s4, 0.3); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

  const PL = new Plane({ ox: DX - 220, oy: DY + 170, u: 70, R: 3 }), PR = new Plane({ ox: DX + 220, oy: DY + 170, u: 70, R: 3 });
  const SH = [[1, 1], [0, 1]], SHt = [[1, 0], [1, 1]];
  const osc = t0 => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(2, Math.max(0, (B.t - t0) / 2.2)) );
  function fanPair(a, D, t0, left, right) {
    const s = osc(t0);
    B.eigFan(PL, left.M, s, a, D, { grid: false, fan: 12, r: 1.3, eig: left.eig });
    B.eigFan(PR, right.M, s, a, D, { grid: false, fan: 12, r: 1.3, eig: right.eig });
    ctag(left.name, PL.ox, DY + 420, { px: 28, a, color: C.ink, font: F.serif }); ctag(right.name, PR.ox, DY + 420, { px: 28, a, color: C.ink, font: F.serif });
  }
  function bars2(cx, cy, alg, geo, a, okk) {
    if (a <= 0) return; const hu = 50;
    ctx.save(); ctx.globalAlpha = a * 0.85; ctx.fillStyle = C.peri; ctx.fillRect(cx - 100, cy - alg * hu, 80, alg * hu); ctx.fillStyle = okk ? OK : C.free; ctx.fillRect(cx + 20, cy - geo * hu, 80, geo * hu); ctx.restore();
    ctag('代数 ' + alg, cx - 60, cy + 28, { px: 24, a, color: C.peri }); ctag('几何 ' + geo, cx + 60, cy + 28, { px: 24, a, color: okk ? OK : C.free }); B.line2([cx - 130, cy], [cx + 130, cy], C.ink, a * 0.6, 2);
  }

  function drawIntro() {
    const a = 1 - gin(QS[0].s - 0.2, 0.5); if (a <= 0) return;
    ctag('特征值 · 对角化 · 谱定理 · 奇异值 · 正定', DX, DY - 120, { px: 34, a: a * gin(T.hi - 1.5, 0.5), color: C.inkMid });
    ctag('永远成立 → ✓ 对，给理由', DX, DY - 10, { px: 40, a: a * gin(T.rule, 0.5), color: OK });
    ctag('不一定成立 → ✗ 错，举反例', DX, DY + 80, { px: 40, a: a * gin(T.ce, 0.5), color: C.free });
    ctag('10 题', DX, DY + 180, { px: 30, a: a * gin(T.rule + 1.0), color: C.inkMid });
  }

  const BODY = {
    1: (a, Q) => { if (a <= 0) return; B.card(DX, DY + 20, 560, 90, a, OK); texAt('q1b', DX, DY + 20, 36, { alpha: a });
      ctag('A 奇异 ⇔ 0 是特征值', DX, DY + 130, { px: 32, a: a * gin(cue('C03', '等价的说法')), color: C.peri, font: F.serif }); },
    2: (a, Q, D) => { if (a <= 0) return; const g = a * gin(T.q2b);
      texAt('q2a', DX - 220, DY - 40, 30, { alpha: g }); texAt('q2b', DX + 220, DY - 40, 30, { alpha: g * gin(T.q2b + 2.0) });
      fanPair(g, D, T.q2b + 1.0, { M: SH, eig: [{ d: [1, 0], col: C.i }], name: '剪切 A' }, { M: SHt, eig: [{ d: [0, 1], col: C.j }], name: 'Aᵀ' });
      ctag('特征值相同 ≠ 特征向量相同', DX, DY + 30, { px: 28, a: g * gin(T.q2b + 3.0), color: C.free }); },
    3: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 460, 90, a, OK); texAt('q3b', DX, DY + 20, 38, { alpha: a }); ctag('定理 6.1.1', DX, DY + 120, { px: 30, a, color: C.inkMid }); },
    4: (a, Q, D) => { if (a <= 0) return; texAt('q4b', DX, DY - 40, 34, { alpha: a * gin(T.q4b) });
      fanPair(a, D, Q.vt + 0.5, { M: I2, eig: [], name: 'I：λ = 1, 1' }, { M: SH, eig: [{ d: [1, 0], col: C.i }], name: '剪切：λ = 1, 1' });
      ctag('与 I 相似的只有 I 自己', DX, DY + 30, { px: 28, a: a * gin(T.q4b + 1.5), color: C.peri }); },
    5: (a, Q, D) => { if (a <= 0) return; const g = a;
      const eig = Array.from({ length: 12 }, (_, i) => ({ d: [Math.cos(i * Math.PI / 6), Math.sin(i * Math.PI / 6)], col: OK }));
      const P = new Plane({ ox: DX, oy: DY + 170, u: 80, R: 3 }); B.eigFan(P, I2, 0, g, D, { grid: false, fan: 0, r: 1.5, eig, lines: 0 });
      ctag('I：λ = 1（n 重），处处都是特征向量', DX, DY - 30, { px: 28, a: g, color: OK });
      ctag('有重根 → 只是“可能”亏损', DX, DY + 400, { px: 30, a: a * gin(T.q5b), color: C.peri }); },
    6: (a) => { if (a <= 0) return; texAt('q6b', DX, DY - 20, 34, { alpha: a }); bars2(DX, DY + 230, 3, 1, a * gin(cue('C13', '代数重数')), false);
      B.stamp(DX + 280, DY + 160, false, prog(B.t, cue('C13', 'A亏损'), cue('C13', 'A亏损') + 0.4), a, '亏损'); },
    7: (a) => { if (a <= 0) return; texAt('q7b', DX, DY - 20, 34, { alpha: a }); bars2(DX - 60, DY + 230, 3, 3, a * gin(L('C15').s + 0.5), true);
      ctag('+ 单重 λ 的 1 个 = 4', DX + 230, DY + 150, { px: 28, a: a * gin(T.q7b), color: OK }); B.stamp(DX + 280, DY + 250, true, prog(B.t, cue('C15', 'A可以对角化'), cue('C15', 'A可以对角化') + 0.4), a, '可对角化'); },
    8: (a) => { if (a <= 0) return; texAt('q8b', DX, DY + 0, 36, { alpha: a, reveal: rv(L('C17').s, 2.5) });
      ctag('秩 1，非零特征值 0 个', DX, DY + 100, { px: 30, a: a * gin(cue('C17', '秩是一')), color: C.free }); ctag('亏损矩阵让两者对不上', DX, DY + 170, { px: 30, a: a * gin(cue('C17', '亏损矩阵')), color: C.peri }); },
    9: (a) => { if (a <= 0) return; B.card(DX, DY + 10, 480, 90, a, OK); texAt('q9b', DX, DY + 10, 38, { alpha: a }); ctag('U、V 可逆，不改变秩', DX, DY + 110, { px: 30, a: a * gin(cue('C19', 'U和V都可逆')), color: OK }); },
    10: (a) => { if (a <= 0) return; B.card(DX, DY + 20, 560, 90, a, C.free); texAt('q10b', DX, DY + 20, 36, { alpha: a }); ctag('负定！（6.7 刚学过）', DX, DY + 130, { px: 32, a: a * gin(cue('C21', '是负定的')), color: C.free, font: F.serif }); },
  };

  function drawQ(Q, D) {
    const a = B.win(Q.s, Q.e, 0.4, 0.35); if (a <= 0) return;
    BODY[Q.n](a * gin(Q.vt + 0.3, 0.5), Q, D);
    const g = gin(Q.s + 0.1, 0.5);
    ctag(Q.n === 10 ? '第 10 题（原第 14 题）' : `第 ${Q.n} 题`, DX, DY - 360, { px: 34, a: a * g, color: C.peri, font: F.serif });
    ctag(Q.zh, DX, DY - 305, { px: 28, a: a * g, color: C.inkMid });
    texAt(Q.key, DX, DY - 230, Q.n === 6 || Q.n === 7 ? 30 : 36, { alpha: a * g, reveal: prog(B.t, Q.s + 0.2, L(Q.q).e - 0.3) });
    B.bubble(DX - 200, DY - 130, `大肥鱼：${Q.ans}！`, a * gin(Q.da) * (1 - 0.6 * gin(Q.vt + 1.5)));
    B.stamp(DX + 250, DY - 135, Q.truth, prog(B.t, Q.vt - 0.05, Q.vt + 0.4), a * (1 - 0.5 * gin(Q.vt + 3)));
  }

  function drawEnd() {
    const a = B.win(T.sc, 1e9); if (a <= 0) return;
    const s1 = a * (1 - gin(T.next - 0.2, 0.4));
    ctag('6 / 10', DX, DY - 300, { px: 110, a: s1 * gin(T.sc + 0.2, 0.5), color: C.ds, font: F.serif });
    ctag('错题共同点：把“可能”看成了“一定”', DX, DY - 190, { px: 30, a: s1 * gin(T.sc + 1.0), color: C.peri });
    const items = [['第 2 题', 'λ 同 ≠ 向量同', T.s1, C.i], ['第 5、7 题', '数特征空间维数', T.s2, C.j], ['第 8 题', '秩看奇异值', T.s3, C.k]];
    items.forEach(([h, b, t0, col], i) => { const y = DY - 90 + i * 90; B.card(DX, y, 560, 76, s1 * gin(t0), col); ctag(h, DX - 170, y, { px: 26, a: s1 * gin(t0), color: col }); ctag(b, DX + 70, y, { px: 30, a: s1 * gin(t0), color: C.ink }); });
    B.card(DX, DY + 210, 560, 90, s1 * gin(T.s4), C.free); ctag('背后都是：亏损矩阵', DX, DY + 210, { px: 38, a: s1 * gin(T.s4), color: C.free, font: F.serif });
    const s2 = a * gin(T.next - 0.2, 0.4);
    ctag('下一段', DX, DY - 120, { px: 34, a: s2, color: C.inkMid });
    ctag('计算题 + 同济题型', DX, DY - 20, { px: 80, a: s2 * gin(T.next + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('A⁷ = A · 乔列斯基 · eᵗᴬ', DX, DY + 90, { px: 36, a: s2 * gin(T.next + 0.8), color: C.ink, font: F.serif });
  }

  function drawLeft() {
    const t = B.t, a = smooth(prog(t, QS[0].s, QS[0].s + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; B.K.head('大肥鱼答题卡', 210, 1, 1);
    QS.forEach((Q, i) => {
      if (t < Q.s - 0.2) return;
      const x = LX + 10 + Math.floor(i / 5) * 210, y = 270 + (i % 5) * 42, cur = t >= Q.s && t < Q.e;
      B.tag(`${Q.orig}.`, x, y, { px: 26, a: cur ? 1 : 0.7, color: cur ? C.peri : C.inkMid });
      if (t > Q.da) B.tag(Q.ans, x + 50, y, { px: 26, a: 0.85, color: C.ds });
      if (t > Q.vt) { B.tag(Q.truth ? '真' : '假', x + 95, y, { px: 24, a: 0.85, color: Q.truth ? OK : C.free }); B.tag(Q.right ? '✓' : '✗', x + 140, y, { px: 28, a: gin(Q.vt + 0.4), color: Q.right ? OK : C.free }); }
    });
    if (t > T.sc) B.tag('6 / 10', LX + 330, 210, { px: 40, a: gin(T.sc + 0.3), color: C.ds, font: F.serif });
    ctx.restore();
  }

  function draw(t) {
    B.frame(t, D => { drawIntro(); QS.forEach(Q => drawQ(Q, D)); drawEnd(); drawLeft(); });
  }
  return { TL, draw };
}
