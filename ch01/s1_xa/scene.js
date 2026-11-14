// 第 1 章 复习（上）判断题（Leon 9th Chapter 1 Test A 选 9 题）。
// 结构：题卡（第 n 题 + 公式）→ 大肥鱼抢答气泡 → 判定印章（✓ 对 / ✗ 错）→ 反例 / 理由（能配画面的配 3B1B 画面）。
// 左栏是大肥鱼的答题卡，逐题记分，最后 2 / 9。
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, mlerp2 } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_confused', 'ds_happy', 'ds_ask', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const OK = '#4FC1A6';

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C03: 0.8, C05: 0.8, C07: 0.8, C09: 0.8, C12: 0.8, C14: 0.8, C16: 0.8, C19: 0.8, C21: 0.8, D11: 0.6, C04: 0.3, C06: 0.3, C08: 0.3, C10: 0.3, C13: 0.3, C15: 0.3, C17: 0.3, C20: 0.3, C22: 0.3 },
    post: { C04: 0.4, C06: 0.4, C08: 0.4, C11: 0.4, C13: 0.4, C15: 0.6, C18: 0.4, C20: 0.4, C22: 0.4 }, tail: 0.6,
  });
  const L = TL.L, cue = TL.cue;
  const cast = new Cast(R.envelope, TL);
  for (const n of assets.chars) cast.add(n, R.img[n], SHADOW[n.split('_')[0]]);
  const dir = makeDirector(TL, cast, {
    C: { x: 250, y: 1095, h: 470, in: [0.9, 1.6] },
    D: { x: 1738, y: 1095, h: 500 },
    G: { x: 1716, y: 1095, h: 500 },
  });
  const K = makeKit(ctx);
  const P = new Plane({ ox: DX, oy: DY + 120, u: 80, R: 9 });

  // 题目表：q 题卡台词、ds 抢答台词、ans 大肥鱼的答案、truth 命题真假、v 判定台词、end 本题结束
  const QS = [
    { n: 1, q: 'C03', ds: 'D02', ans: '对', truth: false, v: 'C04', key: 'q1', zh: '有自由变量 ⇒ 一定无穷多解？' },
    { n: 2, q: 'C05', ds: 'D03', ans: '对', truth: false, v: 'C06', key: 'q2', zh: 'A、B 可逆 ⇒ A + B 可逆？' },
    { n: 3, q: 'C07', ds: 'D04', ans: '对', truth: false, v: 'C08', key: 'q3', zh: '完全平方公式还成立吗？' },
    { n: 4, q: 'C09', ds: 'D05', ans: '对', truth: false, v: 'C10', key: 'q4', zh: '矩阵能“约掉”吗？' },
    { n: 5, q: 'C12', ds: 'D06', ans: '错', truth: false, v: 'C13', key: 'q5', zh: 'AB = O，那 BA 呢？' },
    { n: 6, q: 'C14', ds: 'D07', ans: '对', truth: false, v: 'C15', key: 'q6', zh: '等于自己的逆，只能是 ±I？' },
    { n: 7, q: 'C16', ds: 'D08', ans: '？', truth: true, v: 'C17', key: 'q7', zh: '三阶矩阵，列之间有关系' },
    { n: 8, q: 'C19', ds: 'D09', ans: '对', truth: false, v: 'C20', key: 'q8', zh: '初等 × 初等 = 初等？' },
    { n: 9, q: 'C21', ds: 'D10', ans: '对', truth: true, v: 'C22', key: 'q9', zh: 'x、y 非零，A = xyᵀ' },
  ];
  QS.forEach((Q, i) => { Q.s = L(Q.q).s - 0.6; Q.da = L(Q.ds).s + 0.2; Q.vt = L(Q.v).s + 0.15; Q.e = i < 8 ? QS_next(i) : L('D11').s - 0.4; });
  function QS_next(i) { return L(['C05', 'C07', 'C09', 'C12', 'C14', 'C16', 'C19', 'C21'][i]).s - 0.7; }
  const T = {
    hi: cue('D01', '来考我'), rule: cue('C01', '判断题'), ce: cue('C01', '反例'), one: cue('C02', '只要一个例子'), nine: cue('C02', '九道'),
    g1: L('G01').s, g1b: cue('G01', '零向量'),
    q3e: cue('C08', '展开是'), q3n: cue('C08', '一般不能交换'),
    q4c: cue('C10', '压到横轴上'), q4b: cue('C10', '第一行相同'), q4k: L('C11').s,
    q5c: cue('C13', '零一、零零'), q5d: cue('C13', 'B A却是'),
    q6c: cue('C15', '交换两行'), q6f: cue('C15', '翻折'), q6b: cue('C15', '再翻一次'),
    q7c: cue('C17', '矩阵形式'), q7t: cue('C17', '定理'), q7g: L('C18').s,
    q8c: cue('C20', '两个倍加矩阵'),
    q9r: cue('C22', '每一行都是'), q9z: cue('C22', '至少留下一行'),
    sc: L('D11').s, law: cue('C23', '不能交换'), law2: cue('C23', '随便约掉'), tip: cue('G02', '二阶小矩阵'), tip2: cue('G02', '零一、零零'),
    end: L('D12').s, next: cue('C24', '期中考试题'),
  };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.rule, 0.3); TL.sfx('bell_soft', T.one, 0.3);
  QS.forEach(Q => { TL.sfx('whoosh', Q.s, 0.3); TL.sfx('pop', Q.da + 0.3, 0.28); TL.sfx(Q.truth ? 'ding_hi' : 'stamp', Q.vt, 0.38); TL.sfx((Q.ans === '对') === Q.truth ? 'sparkle' : 'buzz', Q.vt + 0.5, 0.2); });
  TL.sfx('warp', T.q4c, 0.35); TL.sfx('warp', T.q6f, 0.35); TL.sfx('warp', T.q6b, 0.35); TL.sfx('thud', T.q7g + 0.3, 0.3);
  TL.sfx('ding_lo', T.sc + 0.3, 0.3); TL.sfx('check', T.law, 0.3); TL.sfx('check', T.law2, 0.3); TL.sfx('bell_soft', T.tip, 0.3); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);

  function drawTitle() {
    const a = 1 - smooth(prog(t, QS[0].s - 0.2, QS[0].s + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 复习', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'判断题 9 道'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'CHAPTER TEST A', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    const ra = a * gin(T.rule, 0.5); if (ra <= 0) return;
    K.tag('永远成立 → ✓ 对，给理由', DX, DY - 120, { px: 40, a: ra, align: 'center', color: OK, w: 900 });
    K.tag('不一定成立 → ✗ 错，举反例', DX, DY - 30, { px: 40, a: a * gin(T.ce, 0.5), align: 'center', color: C.free, w: 900 });
    K.tag('一个反例，就能推翻一整句话', DX, DY + 100, { px: 34, a: a * gin(T.one, 0.5), align: 'center', color: C.peri, font: F.serif, w: 900 });
  }

  // 印章
  function stamp(x, y, ok, s, a) {
    if (s <= 0) return; const k = lerp(1.8, 1, outBack(s, 2.2));
    ctx.save(); ctx.globalAlpha = a * smooth(s * 2); ctx.translate(x, y); ctx.rotate(-0.18); ctx.scale(k, k);
    const col = ok ? OK : C.free; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.strokeRect(-92, -48, 184, 96); ctx.lineWidth = 2; ctx.strokeRect(-82, -38, 164, 76);
    ctx.fillStyle = col; ctx.font = F.serif(58, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ok ? '✓ 对' : '✗ 错', 0, 4); ctx.restore();
  }
  function bubble(x, y, text, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = F.sans(32, 900); const w = ctx.measureText(text).width + 44;
    ctx.fillStyle = C.ds; ctx.globalAlpha = a * 0.9; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 30, w, 60, 30); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w / 2 - 40, y + 28); ctx.lineTo(x + w / 2 - 10, y + 52); ctx.lineTo(x + w / 2 - 14, y + 26); ctx.fill();
    ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1); ctx.restore();
  }

  function drawQ(Q) {
    const a = win(t, Q.s, Q.e, 0.4, 0.35); if (a <= 0) return;
    const g = gin(Q.s + 0.1, 0.5);
    K.tag(`第 ${Q.n} 题`, DX, DY - 360, { px: 34, a: a * g, align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag(Q.zh, DX, DY - 300, { px: 28, a: a * g, align: 'center', color: C.inkMid });
    texAt(Q.key, DX, DY - 225, Q.n === 7 || Q.n === 9 || Q.n === 1 ? 36 : 46, { alpha: a * g, reveal: prog(t, Q.s + 0.2, L(Q.q).e - 0.3) });
    bubble(DX - 200, DY - 120, `大肥鱼：${Q.ans === '？' ? '看不出来…' : Q.ans + '！'}`, a * gin(Q.da) * (1 - 0.5 * gin(Q.vt + 1.5)));
    stamp(DX + 260, DY - 125, Q.truth, prog(t, Q.vt - 0.05, Q.vt + 0.4), a);
    BODY[Q.n](a * gin(Q.vt + 0.3, 0.5), Q);
  }
  const ccw = (k, y, px, t0, opt = {}) => texAt(k, DX, y, px, { alpha: opt.a, reveal: prog(t, t0, t0 + 1.0), ...opt });
  const BODY = {
    1: (a) => { if (a <= 0) return; texAt('q1s', DX - 200, DY + 40, 44, { alpha: a }); texAt('q1r', DX + 170, DY + 40, 40, { alpha: a * gin(L('C04').s + 2.5) }); K.tag('先有解，才谈得上几个解', DX, DY + 190, { px: 30, a: a * gin(L('C04').s + 3), align: 'center', color: C.peri, w: 900 });
      const ga = win(t, T.g1, QS[0].e, 0.3, 0.3); if (ga > 0) { texAt('g1', DX, DY + 280, 42, { alpha: ga * gin(T.g1b) }); K.tag('齐次方程组永远相容 ✓', DX, DY + 345, { px: 26, a: ga * gin(T.g1b), align: 'center', color: C.gpt, w: 900 }); } },
    2: (a) => { if (a <= 0) return; texAt('q2c', DX, DY + 60, 64, { alpha: a, reveal: prog(t, L('C06').s + 0.5, L('C06').s + 1.8) }); K.tag('零矩阵没有逆', DX, DY + 170, { px: 34, a: a * gin(L('C06').s + 2.5), align: 'center', color: C.free, w: 900 }); },
    3: (a) => { if (a <= 0) return; texAt('q3e', DX, DY + 20, 46, { alpha: a * gin(T.q3e), reveal: prog(t, T.q3e, T.q3e + 1.2) }); texAt('q3n', DX, DY + 170, 36, { alpha: a * gin(T.q3n - 0.6) }); K.tag('AB ≠ BA，合并不了', DX, DY + 290, { px: 30, a: a * gin(T.q3n), align: 'center', color: C.peri, w: 900 }); },
    4: (a) => { if (a <= 0) return; const D = { x: DX, y: DY, r: DR };
      const pa = a * (1 - gin(T.q4b, 0.4)), s = smoother(prog(t, T.q4c - 0.2, T.q4c + 1.2)), M = [[1, 0], [0, 1 - s]];
      if (pa > 0) { ctx.save(); K.clip(D); P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.12 * pa }); P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.55 * pa }); ctx.restore();
        const O = P.S([0, 0], M); arrow(ctx, O, P.S([1, 0], M), { color: C.i, width: 8, head: 24, alpha: pa }); arrow(ctx, O, P.S([0, 1], M), { color: C.j, width: 8, head: 24, alpha: pa * (1 - s * 0.7) });
        K.tag('竖直方向的信息全丢了', DX, DY + 330, { px: 30, a: pa * gin(T.q4c + 1), align: 'center', color: C.free, w: 900 }); }
      const ca = a * gin(T.q4b, 0.4); if (ca > 0) { texAt('q4c', DX, DY + 60, 36, { alpha: ca }); K.tag('第二行不同，乘出来一样', DX, DY + 170, { px: 30, a: ca, align: 'center', color: C.free, w: 900 }); }
      const ka = a * gin(T.q4k, 0.4); if (ka > 0) { texAt('q4k', DX, DY + 260, 38, { alpha: ka }); K.tag('A 可逆才能约', DX, DY + 330, { px: 28, a: ka, align: 'center', color: OK, w: 900 }); } },
    5: (a) => { if (a <= 0) return; texAt('q5c', DX, DY + 30, 40, { alpha: a * gin(T.q5c) }); texAt('q5d', DX, DY + 170, 40, { alpha: a * gin(T.q5d) }); K.tag('大肥鱼答对了 ✓', DX - 200, DY - 50, { px: 28, a: a * gin(L('C13').s + 0.3), align: 'center', color: C.ds, w: 900 }); },
    6: (a) => { if (a <= 0) return; const D = { x: DX, y: DY, r: DR };
      const s1 = smoother(prog(t, T.q6f - 0.1, T.q6f + 1.0)), s2 = smoother(prog(t, T.q6b, T.q6b + 1.0)), S = [[0, 1], [1, 0]];
      const M = s2 > 0 ? mlerp2(S, 1 - s2) : mlerp2(S, s1);
      ctx.save(); K.clip(D); P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.2, alpha: 0.12 * a }); P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.55 * a });
      ctx.setLineDash([12, 10]); P.line(ctx, [0, 0], [Math.SQRT1_2, Math.SQRT1_2], { M: [[1, 0], [0, 1]], color: C.peri, width: 3, alpha: a * gin(T.q6f - 0.3) }); ctx.setLineDash([]); ctx.restore();
      const O = P.S([0, 0], M); arrow(ctx, O, P.S([1, 0], M), { color: C.i, width: 8, head: 24, alpha: a }); arrow(ctx, O, P.S([0, 1], M), { color: C.j, width: 8, head: 24, alpha: a });
      texAt('q6c', DX, DY + 330, 36, { alpha: a * gin(T.q6c), halo: C.disc });
      K.tag('翻两次 = 没翻', DX + 280, DY + 30, { px: 30, a: a * gin(T.q6b + 1.0), align: 'center', color: C.peri, w: 900 }); },
    7: (a) => { if (a <= 0) return; const gg = gin(T.q7g, 0.5);
      texAt('q7c', DX, DY + 50, 50, { alpha: a * gin(T.q7c) * (1 - gg), reveal: prog(t, T.q7c, T.q7c + 1) });
      if (gg > 0) { // 斜投影小 3D：三列落在同一平面（a3 = a1 + 2a2）
        const ox = DX, oy = DY + 150, u = 60, pr = v => [ox + u * (v[0] - 0.55 * v[1]), oy - u * (v[2] - 0.35 * v[1])];
        const a1 = [1, 0, 1], a2 = [0, 1, 2], a3 = [1, 1, 3];
        const pl = [[-0.4, -0.3], [1.4, -0.3], [1.4, 1.3], [-0.4, 1.3]].map(([s1, s2]) => pr([s1 * a1[0] + s2 * a2[0], s1 * a1[1] + s2 * a2[1], s1 * a1[2] + s2 * a2[2]]));
        ctx.save(); ctx.globalAlpha = a * gg * 0.18; ctx.fillStyle = C.ink; ctx.beginPath(); pl.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.restore();
        [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(e => arrow(ctx, pr([0, 0, 0]), pr(e.map(x => x * 2.2)), { color: C.inkMid, width: 2, head: 10, alpha: a * gg * 0.5 }));
        [[a1, C.i], [a2, C.j], [a3, C.k]].forEach(([v, col], i) => arrow(ctx, pr([0, 0, 0]), pr(v), { color: col, width: 6, head: 18, alpha: a * gg, grow: smooth(prog(t, T.q7g + 0.1 + i * 0.25, T.q7g + 0.7 + i * 0.25)) }));
        K.tag('a₁', pr(a1)[0] + 10, pr(a1)[1] - 6, { px: 30, a: a * gg, color: C.i, w: 900 }); K.tag('a₂', pr(a2)[0] - 40, pr(a2)[1] - 6, { px: 26, a: a * gg, color: C.j, w: 900 }); K.tag('a₃', pr(a3)[0] + 10, pr(a3)[1] - 6, { px: 26, a: a * gg, color: C.k, w: 900 });
      }
      K.tag('Ax = 0 有非零解 ⇒ 不可逆（定理 1.5.2）', DX, DY + 190, { px: 30, a: a * gin(T.q7t) * (1 - gin(T.q7g, 0.5)), align: 'center', color: OK, w: 900 });
      K.tag('三列共面：空间被压扁', DX, DY + 300, { px: 32, a: a * gin(T.q7g), align: 'center', color: C.peri, font: F.serif, w: 900 }); },
    8: (a) => { if (a <= 0) return; texAt('q8c', DX, DY + 60, 50, { alpha: a * gin(T.q8c - 0.3), reveal: prog(t, T.q8c - 0.3, T.q8c + 1) }); K.tag('两次行变换，一次做不到', DX, DY + 200, { px: 32, a: a * gin(T.q8c + 1), align: 'center', color: C.free, w: 900 }); },
    9: (a) => { if (a <= 0) return; texAt('q9c', DX, DY + 60, 40, { alpha: a * gin(T.q9r - 0.4) }); K.tag('每行 ∥ yᵀ → 只剩一行', DX, DY + 200, { px: 32, a: a * gin(T.q9r + 0.8), align: 'center', color: OK, w: 900 }); K.tag('x、y ≠ 0 → 至少一行', DX, DY + 260, { px: 28, a: a * gin(T.q9z), align: 'center', color: C.inkMid, w: 900 }); },
  };

  function drawEnd() {
    const a = win(t, T.sc, 1e9, 0.4, 0.4); if (a <= 0) return;
    K.tag('2 / 9', DX, DY - 250, { px: 120, a: a * gin(T.sc + 0.2, 0.5), align: 'center', color: C.ds, font: F.serif, w: 900 });
    texAt('law', DX, DY - 60, 46, { alpha: a * gin(T.law), reveal: prog(t, T.law, T.law2 + 0.8) });
    K.tag('别把数的规律搬到矩阵上', DX, DY + 40, { px: 34, a: a * gin(T.law - 0.6), align: 'center', color: C.peri, font: F.serif, w: 900 });
    const ta = a * gin(T.tip, 0.4); if (ta > 0) { K.tag('先找反例：二阶小矩阵', DX, DY + 150, { px: 34, a: ta, align: 'center', color: C.gpt, w: 900 }); texAt('tip', DX, DY + 250, 50, { alpha: a * gin(T.tip2) }); }
    K.tag('下一集：期中真题', DX, DY + 350, { px: 30, a: a * gin(T.next, 0.5), align: 'center', color: C.inkMid });
  }

  function drawLeft() {
    const a = smooth(prog(t, QS[0].s, QS[0].s + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; K.head('大肥鱼答题卡', 210, 1, 1);
    QS.forEach((Q, i) => {
      const y = 270 + i * 38, on = t >= Q.s - 0.2, cur = t >= Q.s && t < Q.e;
      if (!on) return;
      K.tag(`${Q.n}.`, LX + 10, y, { px: 28, a: cur ? 1 : 0.7, color: cur ? C.peri : C.inkMid, w: 900 });
      if (t > Q.da) K.tag(`答：${Q.ans}`, LX + 60, y, { px: 26, a: 0.85, color: C.ds, w: 700 });
      if (t > Q.vt) { const right = (Q.ans === '对') === Q.truth && Q.ans !== '？'; K.tag(Q.truth ? '真' : '假', LX + 170, y, { px: 26, a: 0.85, color: Q.truth ? OK : C.free, w: 900 });
        K.tag(Q.ans === '？' ? '—' : right ? '✓' : '✗', LX + 230, y, { px: 30, a: gin(Q.vt + 0.4), color: Q.ans === '？' ? C.inkMid : right ? OK : C.free, w: 900 }); }
    });
    if (t > T.sc) K.tag('2 / 9', LX + 330, 210, { px: 40, a: gin(T.sc + 0.3), color: C.ds, w: 900, font: F.serif });
    ctx.restore();
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第一章 · 复习', prog(t, 0.2, 1.3));
    drawTitle(); QS.forEach(drawQ); drawEnd();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
