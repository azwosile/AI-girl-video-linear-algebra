// 第 2 章 复习（上）判断题（Leon 9th Chapter 2 Test A 全 10 题，答案 T F F T F T T T F T）。
// 结构：题卡（第 n 题 + 公式）→ 大肥鱼抢答气泡 → 判定印章（✓ 对 / ✗ 错）→ 理由 / 反例（能配画面的配 3B1B 网格）。
// 左栏是大肥鱼的答题卡，逐题记分，最后 3 / 10。
import { C, F } from '../../engine/style/tokens.js';
import { lerp, prog, smooth, smoother, outCubic, outBack, win } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, arrow } from '../../engine/la2d/plane.js';
import { paraFill } from '../../engine/la2d/detviz.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit, LX, DX, DY, DR } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_happy', 'ds_think', 'ds_confused', 'ds_proud', 'gpt_explain', 'gpt_point'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const OK = '#4FC1A6';
const I2 = [[1, 0], [0, 1]];
const lerpM = (A, B, s) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], s)));

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const MJ = R.math; if (!MJ) throw new Error('缺 math.json');
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.1,
    pre: { C02: 0.8, C04: 0.8, C06: 0.8, C08: 0.8, C10: 0.8, C13: 0.8, C15: 0.8, C17: 0.8, C19: 0.8, C21: 0.8, D12: 0.6, C03: 0.3, C05: 0.3, C07: 0.3, C09: 0.3, C11: 0.3, C14: 0.3, C16: 0.3, C18: 0.3, C20: 0.3, C22: 0.3 },
    post: { C03: 0.5, C05: 0.7, C07: 0.6, C09: 0.4, C12: 0.5, C14: 0.4, C16: 0.4, C18: 0.7, G01: 0.4, C22: 0.6, C23: 0.5 }, tail: 0.6,
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
  const P = new Plane({ ox: DX - 40, oy: DY + 190, u: 90, R: 9 });

  // 题目表：q 题卡台词、ds 抢答台词、ans 大肥鱼的答案、truth 命题真假、v 判定台词
  const QS = [
    { n: 1, q: 'C02', ds: 'D02', ans: '错', truth: true, v: 'C03', zh: 'AB ≠ BA，行列式呢？' },
    { n: 2, q: 'C04', ds: 'D03', ans: '对', truth: false, v: 'C05', zh: '行列式能拆加法吗？' },
    { n: 3, q: 'C06', ds: 'D04', ans: '对', truth: false, v: 'C07', zh: '常数能直接提出来吗？' },
    { n: 4, q: 'C08', ds: 'D05', ans: '错', truth: true, v: 'C09', zh: '转置 + 乘积' },
    { n: 5, q: 'C10', ds: 'D06', ans: '对', truth: false, v: 'C11', zh: '行列式相等 ⇒ 矩阵相等？' },
    { n: 6, q: 'C13', ds: 'D07', ans: '对', truth: true, v: 'C14', zh: '乘方' },
    { n: 7, q: 'C15', ds: 'D08', ans: '对', truth: true, v: 'C16', zh: '三角矩阵 T 非奇异 ⇔ 对角元全非零' },
    { n: 8, q: 'C17', ds: 'D09', ans: '对', truth: true, v: 'C18', zh: '有非零向量被送到原点' },
    { n: 9, q: 'C19', ds: 'D10', ans: '对', truth: false, v: 'C20', zh: 'A ~ B：行等价' },
    { n: 10, q: 'C21', ds: 'D11', ans: '？', truth: true, v: 'C22', zh: '幂零矩阵' },
  ];
  QS.forEach((Q, i) => { Q.key = 'q' + Q.n; Q.s = L(Q.q).s - 0.6; Q.da = L(Q.ds).s + 0.2; Q.vt = L(Q.v).s + 0.15; Q.e = i < QS.length - 1 ? L(QS[i + 1].q).s - 0.7 : L('D12').s - 0.4; });
  const T = {
    hi: cue('D01', '来考我'), rule: cue('C01', '判断题'), ce: cue('C01', '反例'),
    q1a: cue('C03', '都等于'), q1b: cue('C03', '数的乘法'),
    q2a: cue('C05', '压成一条线'), q2b: cue('C05', '也是零'), q2c: cue('C05', '可A加B'),
    q3a: cue('C07', '每个方向'), q3b: cue('C07', '面积放大四倍'), q3c: cue('C07', 'n行就是'),
    q4a: cue('C09', '第一步'), q4b: cue('C09', '第二步'),
    q5a: cue('C11', '剪切矩阵'), q5b: cue('C11', '推斜了'), q5c: L('C12').s,
    q6a: cue('C14', '几何上'), q6b: cue('C14', '做k次'),
    q7a: L('C16').s,
    q8a: cue('C18', '比如'), q8b: cue('C18', '压到原点'), q8c: cue('C18', '面积变成零'),
    q9a: cue('C20', '第一行乘二'), q9b: cue('C20', '交换两行'), q9g: cue('G01', '是不是零'),
    q10a: cue('C22', '它的平方'), q10b: cue('C22', '用第六题'),
    sc: L('D12').s, law: cue('C23', '乘法相处得好'), law2: cue('C23', '碰到加法'), tip: cue('G02', '先试'), tip2: cue('G02', '四个反例'),
    next: cue('C24', '期中'),
  };

  // ── 音效 ──
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('sting', T.hi, 0.28); TL.sfx('pop', T.rule, 0.3);
  QS.forEach(Q => { TL.sfx('whoosh', Q.s, 0.3); TL.sfx('pop', Q.da + 0.3, 0.28); TL.sfx(Q.truth ? 'ding_hi' : 'stamp', Q.vt, 0.38); TL.sfx(Q.ans === '？' ? 'pluck' : (Q.ans === '对') === Q.truth ? 'sparkle' : 'buzz', Q.vt + 0.5, 0.2); });
  TL.sfx('warp', T.q2a, 0.35); TL.sfx('warp', T.q3a, 0.35); TL.sfx('warp', T.q5b, 0.35); TL.sfx('warp', T.q8b, 0.35); TL.sfx('check', T.q9g, 0.3);
  TL.sfx('ding_lo', T.sc + 0.3, 0.3); TL.sfx('check', T.law, 0.3); TL.sfx('check', T.law2, 0.3); TL.sfx('bell_soft', T.tip, 0.3); TL.sfx('shimmer', L('C24').e + 0.3, 0.4);

  let t = 0;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d));
  const discAt = () => ({ x: DX, y: DY, r: DR * outCubic(prog(t, 0.05, 0.9)) });
  const texAt = (k, x, y, px, opt = {}, anchor = 'c') => tex.draw(ctx, tex.place(k, x, y, px, anchor), opt);
  const rv = (t0, d = 1.0) => prog(t, t0, t0 + d);

  function drawTitle() {
    const a = 1 - smooth(prog(t, QS[0].s - 0.2, QS[0].s + 0.4)); if (a <= 0) return;
    const m = smoother(prog(t, 1.7, 2.5)), y = lerp(430, 200, m), k = lerp(1, 0.62, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第二章 · 复习', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'判断题 10 道'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'CHAPTER TEST A', cx / 2, 62, 28, C.peri, { rule: 90 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
    K.tag('面积 · 体积 · 展开 · 消元', DX, DY - 120, { px: 40, a: a * gin(T.hi - 1.5, 0.5), align: 'center', color: C.inkMid, w: 900 });
    K.tag('永远成立 → ✓ 对，给理由', DX, DY - 10, { px: 40, a: a * gin(T.rule, 0.5), align: 'center', color: OK, w: 900 });
    K.tag('不一定成立 → ✗ 错，举反例', DX, DY + 80, { px: 40, a: a * gin(T.ce, 0.5), align: 'center', color: C.free, w: 900 });
  }

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

  // 网格（只画在题卡下方）
  function grid(M, a, { sq = 0, sqCol = C.i, label = null, D }) {
    if (a <= 0) return;
    ctx.save(); K.clip(D); ctx.beginPath(); ctx.rect(0, DY - 40, 1920, 1080); ctx.clip();
    P.grid(ctx, { M: I2, color: C.gridOld, width: 1.2, alpha: 0.12 * a });
    P.grid(ctx, { M, color: C.gridNew, width: 2.2, alpha: 0.5 * a });
    let c = null; if (sq > 0) c = paraFill(ctx, P, M, { color: sqCol, alpha: 0.38 * a * sq, stroke: sqCol, flipColor: false }).c;
    ctx.restore();
    const O = P.S([0, 0], M); arrow(ctx, O, P.S([1, 0], M), { color: C.i, width: 8, head: 24, alpha: a }); arrow(ctx, O, P.S([0, 1], M), { color: C.j, width: 8, head: 24, alpha: a });
    if (label && c) K.tag(label, c[0], c[1] + 10, { px: 30, a: a * sq, align: 'center', color: C.ink, w: 900 });
  }

  function drawQ(Q, D) {
    const a = win(t, Q.s, Q.e, 0.4, 0.35); if (a <= 0) return;
    const g = gin(Q.s + 0.1, 0.5);
    K.tag(`第 ${Q.n} 题`, DX, DY - 360, { px: 34, a: a * g, align: 'center', color: C.peri, font: F.serif, w: 900 });
    K.tag(Q.zh, DX, DY - 300, { px: 28, a: a * g, align: 'center', color: C.inkMid });
    texAt(Q.key, DX, DY - 225, 50, { alpha: a * g, reveal: prog(t, Q.s + 0.2, L(Q.q).e - 0.3) });
    bubble(DX - 200, DY - 120, `大肥鱼：${Q.ans === '？' ? '看不出来…' : Q.ans + '！'}`, a * gin(Q.da) * (1 - 0.5 * gin(Q.vt + 1.5)));
    stamp(DX + 260, DY - 125, Q.truth, prog(t, Q.vt - 0.05, Q.vt + 0.4), a);
    BODY[Q.n](a * gin(Q.vt + 0.3, 0.5), D);
  }

  const BODY = {
    1: (a) => { if (a <= 0) return;
      texAt('q1e', DX, DY + 20, 40, { alpha: a, reveal: rv(L('C03').s + 0.5, 1.0) });
      K.tag('两个行列式都是 6', DX, DY + 120, { px: 32, a: a * gin(L('C03').s + 2.0), align: 'center', color: C.peri, w: 900 });
      texAt('q1c', DX, DY + 220, 46, { alpha: a * gin(T.q1a), reveal: rv(T.q1a, 1.0), color: OK });
      K.tag('数的乘法可以交换', DX, DY + 290, { px: 28, a: a * gin(T.q1b), align: 'center', color: C.inkMid, w: 900 }); },
    2: (a, D) => { if (a <= 0) return;
      const s1 = smoother(prog(t, T.q2a - 0.2, T.q2a + 1.0)), s2 = smoother(prog(t, T.q2b - 0.2, T.q2b + 0.8)), s3 = smoother(prog(t, T.q2c, T.q2c + 1.0));
      const A = [[1, 0], [0, 0]], B = [[0, 0], [0, 1]];
      const M = s3 > 0 ? lerpM(B, I2, s3) : (s2 > 0 ? lerpM(A, B, s2) : lerpM(I2, A, s1));
      const ga = a * (1 - gin(T.q2c + 2.2, 0.5));
      grid(M, ga, { sq: 1, label: s3 > 0.9 ? '面积 1' : (s1 > 0.9 ? '面积 0' : null), D });
      K.tag(s3 > 0.5 ? 'A + B = I' : (s2 > 0.5 ? 'B = diag(0, 1)' : 'A = diag(1, 0)'), DX + 280, DY + 30, { px: 34, a: ga, align: 'center', color: s3 > 0.5 ? OK : C.free, w: 900, font: F.serif });
      texAt('q2c', DX, DY + 120, 40, { alpha: a * gin(T.q2c + 2.2, 0.5), reveal: rv(T.q2c + 2.2, 1.2) }); },
    3: (a, D) => { if (a <= 0) return;
      const s = smoother(prog(t, T.q3a - 0.2, T.q3a + 1.2)), M = [[1 + s, 0], [0, 1 + s]];
      grid(M, a * (1 - gin(T.q3c - 0.3, 0.4)), { sq: 1, label: s > 0.9 ? '面积 4' : '面积 1', D });
      K.tag('2I：两个方向各 × 2', DX + 270, DY + 30, { px: 32, a: a * gin(T.q3a) * (1 - gin(T.q3c - 0.3, 0.4)), align: 'center', color: C.peri, w: 900 });
      texAt('q3c', DX, DY + 90, 64, { alpha: a * gin(T.q3c - 0.3, 0.4), reveal: rv(T.q3c - 0.3, 0.8), color: OK });
      K.tag('3 阶：2³ = 8 倍', DX, DY + 220, { px: 34, a: a * gin(T.q3c + 0.8), align: 'center', color: C.inkMid, w: 900 }); },
    4: (a) => { if (a <= 0) return;
      const pl = tex.place('q4c', DX, DY + 60, 44, 'c'); tex.draw(ctx, pl, { alpha: a * gin(T.q4a), reveal: rv(T.q4a, 1.6), color: OK });
      K.tag('① 转置不变', DX - 120, DY + 160, { px: 32, a: a * gin(T.q4a + 0.6), align: 'center', color: C.i, w: 900 });
      K.tag('② 乘积公式', DX + 200, DY + 160, { px: 32, a: a * gin(T.q4b), align: 'center', color: C.j, w: 900 }); },
    5: (a, D) => { if (a <= 0) return;
      const s = smoother(prog(t, T.q5b - 0.2, T.q5b + 1.0)), M = [[1, s], [0, 1]];
      const ga = a * (1 - gin(T.q5c + 0.2, 0.4));
      grid(M, ga, { sq: 1, label: '面积 1', D });
      texAt('q5c', DX + 250, DY + 20, 34, { alpha: ga * gin(T.q5a), halo: C.disc });
      const ca = a * gin(T.q5c + 0.2, 0.4);
      K.tag('det 只记住一个数：面积放大几倍', DX, DY + 60, { px: 36, a: ca, align: 'center', color: C.peri, w: 900, font: F.serif });
      K.tag('丢掉了：方向、形状', DX, DY + 160, { px: 34, a: ca * gin(T.q5c + 1.4), align: 'center', color: C.free, w: 900 }); },
    6: (a) => { if (a <= 0) return;
      texAt('q6c', DX, DY + 60, 46, { alpha: a * gin(L('C14').s + 0.2), reveal: rv(L('C14').s + 0.2, 1.2), color: OK });
      K.tag('每做一次 A：面积 × det A', DX, DY + 200, { px: 32, a: a * gin(T.q6a), align: 'center', color: C.peri, w: 900 });
      K.tag('大肥鱼答对了 ✓', DX - 200, DY - 50, { px: 28, a: a * gin(L('C14').s + 0.3), align: 'center', color: C.ds, w: 900 }); },
    7: (a) => { if (a <= 0) return;
      texAt('q7c', DX, DY + 50, 60, { alpha: a, reveal: rv(T.q7a, 0.8), color: OK });
      K.tag('非奇异 ⇔ det ≠ 0', DX, DY + 170, { px: 36, a: a * gin(T.q7a + 1.0), align: 'center', color: C.peri, w: 900, font: F.serif });
      K.tag('大肥鱼答对了 ✓', DX - 200, DY - 50, { px: 28, a: a * gin(T.q7a), align: 'center', color: C.ds, w: 900 }); },
    8: (a, D) => { if (a <= 0) return;
      const A8 = MJ.q8A, x8 = MJ.q8x, s = smoother(prog(t, T.q8b - 0.2, T.q8b + 1.4)), M = lerpM(I2, A8, s);
      const sc = 0.5, Ms = M.map(r => r.map(v => v * sc));   // 网格缩小一半看全貌
      grid(Ms, a, { sq: 1, label: s > 0.9 ? '面积 0' : null, D });
      const O = P.S([0, 0], Ms), xt = P.S(x8, Ms);
      arrow(ctx, O, xt, { color: C.peri, width: 8, head: 24, alpha: a * (1 - 0.8 * s) });
      K.tag('x', xt[0] + 18, xt[1] + 10, { px: 34, a: a * (1 - s), color: C.peri, w: 900, font: F.serif });
      texAt('q8c', DX + 250, DY + 20, 34, { alpha: a * gin(T.q8a), halo: C.disc });
      K.tag('平面 → 一条线', DX + 250, DY + 120, { px: 30, a: a * gin(T.q8c), align: 'center', color: C.free, w: 900 }); },
    9: (a) => { if (a <= 0) return;
      texAt('q9c', DX, DY + 30, 46, { alpha: a * gin(T.q9a), reveal: rv(T.q9a, 1.0) });
      K.tag('det：1 → 2', DX, DY + 130, { px: 38, a: a * gin(T.q9a + 1.2), align: 'center', color: C.free, w: 900, font: F.serif });
      K.tag('交换两行：变号', DX, DY + 190, { px: 30, a: a * gin(T.q9b), align: 'center', color: C.inkMid, w: 900 });
      texAt('q9g', DX, DY + 270, 40, { alpha: a * gin(T.q9g), color: C.gpt }); },
    10: (a) => { if (a <= 0) return;
      texAt('q10c', DX, DY + 40, 46, { alpha: a * gin(T.q10a), reveal: rv(T.q10a, 1.0) });
      texAt('q10d', DX, DY + 200, 46, { alpha: a * gin(T.q10b), reveal: rv(T.q10b, 1.4), color: OK });
      K.tag('用第 6 题', DX + 260, DY + 120, { px: 28, a: a * gin(T.q10b), align: 'center', color: C.inkMid, w: 900 }); },
  };

  function drawEnd() {
    const a = win(t, T.sc, 1e9, 0.4, 0.4); if (a <= 0) return;
    K.tag('3 / 10', DX, DY - 270, { px: 120, a: a * gin(T.sc + 0.2, 0.5), align: 'center', color: C.ds, font: F.serif, w: 900 });
    K.tag('和乘法相处得好', DX, DY - 140, { px: 34, a: a * gin(T.law), align: 'center', color: OK, w: 900 });
    texAt('law', DX, DY - 70, 32, { alpha: a * gin(T.law), reveal: rv(T.law, 1.2) });
    K.tag('加法、数乘、行变换：小心', DX, DY + 20, { px: 34, a: a * gin(T.law2), align: 'center', color: C.free, w: 900 });
    texAt('law2', DX, DY + 90, 34, { alpha: a * gin(T.law2), reveal: rv(T.law2, 1.0) });
    const ta = a * gin(T.tip, 0.4); if (ta > 0) { K.tag('反例先试：对角矩阵、剪切矩阵', DX, DY + 180, { px: 32, a: ta, align: 'center', color: C.gpt, w: 900 }); texAt('tip', DX, DY + 260, 44, { alpha: ta }); }
  }

  function drawLeft() {
    const a = smooth(prog(t, QS[0].s, QS[0].s + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; K.head('大肥鱼答题卡', 210, 1, 1);
    QS.forEach((Q, i) => {
      const y = 265 + i * 36, on = t >= Q.s - 0.2, cur = t >= Q.s && t < Q.e;
      if (!on) return;
      K.tag(`${Q.n}.`, LX + 10, y, { px: 26, a: cur ? 1 : 0.7, color: cur ? C.peri : C.inkMid, w: 900 });
      if (t > Q.da) K.tag(`答：${Q.ans}`, LX + 60, y, { px: 24, a: 0.85, color: C.ds, w: 700 });
      if (t > Q.vt) { const right = (Q.ans === '对') === Q.truth && Q.ans !== '？'; K.tag(Q.truth ? '真' : '假', LX + 170, y, { px: 24, a: 0.85, color: Q.truth ? OK : C.free, w: 900 });
        K.tag(Q.ans === '？' ? '—' : right ? '✓' : '✗', LX + 230, y, { px: 28, a: gin(Q.vt + 0.4), color: Q.ans === '？' ? C.inkMid : right ? OK : C.free, w: 900 }); }
    });
    if (t > T.sc) K.tag('3 / 10', LX + 330, 210, { px: 40, a: gin(T.sc + 0.3), color: C.ds, w: 900, font: F.serif });
    ctx.restore();
  }

  function draw(tt) {
    t = tt; stage.bg();
    const D = discAt(); K.disc(D, t);
    cornerMark(ctx, '第二章 · 复习', prog(t, 0.2, 1.3));
    drawTitle(); QS.forEach(Q => drawQ(Q, D)); drawEnd();
    drawLeft();
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
