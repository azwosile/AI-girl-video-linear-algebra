// 特别篇 1 · 第 1 段：开场——这套特别篇怎么用。
// 分镜：9 张真卷页从四周旋转飞入 → 散成扇形（卷角学年）→ 收拢成“卷子 × 考点”热力图（逐列波浪点亮）
//       → 四行全亮扫光 → 频率数字翻牌 → 两列灰卷标“全学期 · 不计” → 七集地图逐张亮起
//       → 原题三步流程（整页 → 纸卡 → 套路 → 动画 → 评分点）→ 回看卡样张 → 速成版 vs 特别篇对照
//       → 看法四步 → “第一集 · 方程组”收束。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_smile', 'ds_ask', 'ds_happy', 'ds_shock', 'ds_think', 'gpt_cross', 'gpt_explain', 'gpt_point', 'gpt_proud'] };

const YEARS = ['15–16', '17–18', '18–19', '20–21', '21–22', '22–23', '23–24', '24–25', '25–26'];
const KEYS = ['y1516_q2', 'y1718_q3', 'y1819_q1', 'y2021_q3', 'y2122_q4', 'y2223_q2', 'y2324_q5', 'y2425_q2', 'y2526_q2'];
const GRAY = new Set([0, 5]);
const TOPICS = ['含参方程组', 'LU / 初等矩阵', '行列式', '子空间判定', '线性相关性', '过渡矩阵', 'RREF 反推', '判断题'];
// 列：按 YEARS 顺序；分值强度 0..1（0 = 没考）。灰列只做装饰
const HEAT = [
  [0, 0, 18, 0, 0, 0, 0, 12, 12],
  [0, 12, 14, 20, 10, 0, 10, 25, 12],
  [0.5, 15, 30, 10, 20, 0.5, 16, 6, 2],
  [0.5, 12, 20, 10, 10, 0, 2, 13, 12],
  [0.5, 25, 14, 10, 10, 0.5, 34, 8, 6],
  [0.5, 15, 0, 15, 15, 0.5, 12, 8, 15],
  [0, 21, 0, 15, 10, 0.5, 14, 18, 24],
  [0, 0, 0, 20, 25, 0.5, 12, 10, 25],
];
const FREQ = ['3 / 7', '7 / 7', '7 / 7', '7 / 7', '7 / 7', '6 / 7', '6 / 7', '5 / 7'];

export async function setup(R) {
  const EX = await loadExam(KEYS);
  const B = base(R, {
    assets, label: '特别篇 1 · 方程组与参数讨论', title: '期中特别篇', hi: 1, en: 'MIDTERM SPECIAL · HOW TO USE',
    titleEnd: () => B.L('C01').s + 0.4,
    pre: { C01: 0.6, C03: 0.6, C05: 0.6, C06: 0.6, C08: 0.6, C09: 0.4, G04: 0.4, C10: 0.4 },
    post: { C02: 1.0, C03: 1.6, C04: 1.4, G01: 1.6, G02: 1.2, C05: 1.8, C07: 1.6, C08: 1.6, C09: 1.4, G04: 1.0, C10: 1.6 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);
  const tFan = s('C01') + 0.3, tHeat = s('C03') - 0.2, tRow4 = s('C04'), tGray = s('D02');

  // ── 音效 ──
  TL.sfx('riser', 0.4, 0.3); KEYS.forEach((_, k) => TL.sfx('swoosh_soft', tFan + k * 0.18, 0.18));
  TL.sfx('impact', cue('C01', '九份'), 0.3); TL.sfx('sting', s('D01') + 0.1, 0.25);
  TL.sfx('whoosh', cue('C02', '重新按考点排队'), 0.3);
  for (let j = 0; j < 9; j++) TL.sfx('tick', tHeat + 0.6 + j * 0.28, 0.18);
  TL.sfx('shimmer', tRow4 + 0.2, 0.3); TL.sfx('ding_hi', cue('C04', '全是亮的'), 0.3);
  ['过渡矩阵', '判断题', '含参方程组'].forEach(w => TL.sfx('click', cue('G01', w), 0.3));
  TL.sfx('ding_lo', tGray + 0.3, 0.3);
  for (let k = 0; k < 7; k++) TL.sfx('marimba', s('C05') + 1.2 + k * 0.6, 0.22);
  TL.sfx('whoosh', s('C06') + 0.3, 0.3); TL.sfx('pluck', cue('C06', '题目被裁下来'), 0.3);
  ['第二步', '第三步', '最后'].forEach(w => TL.sfx('pop', cue('C07', w), 0.3));
  TL.sfx('stamp', s('G03') + 0.4, 0.3); TL.sfx('swoosh_in', s('C08') + 0.2, 0.3);
  TL.sfx('pop', s('D03') + 0.2, 0.25); TL.sfx('swoosh_soft', cue('C09', '特别篇是'), 0.3);
  ['先暂停', '自己做一遍', '再往下看', '打个记号'].forEach(w => TL.sfx('tick2', cue('G04', w), 0.3));
  TL.sfx('bell_soft', s('C10') + 0.2, 0.35); TL.sfx('sparkle', cue('C10', '三张平面'), 0.3);

  // ════ 9 张卷子：飞入 → 扇形 → 收拢 ════
  function shotFan() {
    const a = B.win(tFan - 0.2, tHeat + 1.2); if (a <= 0) return;
    const gather = smoother(prog(B.t, tHeat - 0.6, tHeat + 0.6));
    KEYS.forEach((k, i) => {
      const pg = EX.page[EX.spec[k].src[0][0]]; const t0 = tFan + i * 0.18;
      const u = outCubic(prog(B.t, t0, t0 + 0.9)); if (u <= 0) return;
      const ang0 = (i / 9) * Math.PI * 2, fx = DX + Math.cos(ang0) * 1300, fy = DY + Math.sin(ang0) * 900;
      const fa = (i - 4) * 0.13, tx = DX + Math.sin(fa) * 520, ty = DY + 360 - Math.cos(fa) * 420;
      const x = lerp(lerp(fx, tx, u), DX, gather), y = lerp(lerp(fy, ty, u), DY, gather);
      const rot = lerp(ang0 * 0.5, fa, u) * (1 - gather), sc = lerp(1, 0.4, gather);
      const h = 360 * sc, w = pg ? h * pg.width / pg.height : h * 0.7;
      ctx.save(); ctx.globalAlpha = a * (1 - gather * 0.9); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
      if (pg) ctx.drawImage(pg, -w / 2, -h / 2, w, h); else { ctx.fillStyle = C.paperHi; ctx.fillRect(-w / 2, -h / 2, w, h); }
      ctx.strokeStyle = GRAY.has(i) ? C.inkMid : C.peri; ctx.lineWidth = 3; ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.restore();
      ctag(YEARS[i], x + Math.sin(rot) * h * 0.6, y - Math.cos(rot) * h * 0.6, { px: 26, a: a * u * (1 - gather), color: GRAY.has(i) ? C.inkMid : C.i, font: F.serif });
    });
    const gc = a * B.win(cue('C02', '一共六十道'), tHeat - 0.4);
    ctag('≈ 60 道题 · 110 个小问', DX, DY - 330, { px: 44, a: gc, color: C.peri, font: F.serif });
  }

  // ════ 热力图 ════
  const HX = j => DX - 250 + j * 72, HY = i => DY - 250 + i * 58;
  function shotHeat() {
    const a = B.win(tHeat, s('C05') - 0.2); if (a <= 0) return;
    const shrink = 0;
    ctag('卷子 × 考点', DX, DY - 380, { px: 34, a: a * gin(tHeat + 0.2), color: C.peri });
    YEARS.forEach((y, j) => ctag(y, HX(j), HY(0) - 50, { px: 20, a: a * gin(tHeat + 0.3 + j * 0.05) * (GRAY.has(j) ? 0.45 : 1), color: GRAY.has(j) ? C.inkMid : C.ink, font: F.serif }));
    TOPICS.forEach((tp, i) => {
      const hot = i >= 1 && i <= 4, gr = a * gin(tHeat + 0.3 + i * 0.05);
      const sweep = hot ? prog(B.t, tRow4 + (i - 1) * 0.25, tRow4 + 0.8 + (i - 1) * 0.25) : 0;
      ctag(tp, HX(0) - 60, HY(i), { px: 24, a: gr, color: hot && B.t > tRow4 ? C.peri : C.ink, align: 'right' });
      // 行扫光
      if (sweep > 0 && sweep < 1) { ctx.save(); ctx.globalAlpha = a * 0.5 * Math.sin(Math.PI * sweep); ctx.fillStyle = C.i; const x = lerp(HX(0) - 40, HX(8) + 40, sweep); ctx.fillRect(x - 30, HY(i) - 26, 60, 52); ctx.restore(); }
      if (hot) { const g = a * gin(tRow4 + (i - 1) * 0.25 + 0.6); ctx.save(); ctx.globalAlpha = g * (1 - gin(s('G01'))) ; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.strokeRect(HX(0) - 34, HY(i) - 27, HX(8) - HX(0) + 68, 54); ctx.restore(); }
      // 频率
      const tf = i === 5 || i === 6 ? cue('G01', '过渡矩阵') : i === 7 ? cue('G01', '判断题') : i === 0 ? cue('G01', '含参方程组') : tRow4 + 0.6;
      const gf = a * gin(tf);
      ctag(FREQ[i], HX(8) + 90, HY(i), { px: 26, a: gf, color: FREQ[i] === '7 / 7' ? OK : i === 0 ? C.free : C.i, font: F.serif });
      if (i === 0) ctag('近三年 2 次 ↑', HX(8) + 210, HY(i), { px: 22, a: a * gin(cue('G01', '近三年')), color: C.free });
      HEAT[i].forEach((v, j) => {
        const tc = tHeat + 0.6 + j * 0.28 + i * 0.04, g = a * gin(tc, 0.35); if (g <= 0) return;
        const gray = GRAY.has(j), dim = gray ? 1 - 0.6 * gin(tGray + 0.2) : 1;
        const pop = lerp(1.3, 1, outBack(prog(B.t, tc, tc + 0.4), 2));
        const k = v <= 0 ? 0 : Math.min(1, 0.25 + v / 34);
        const w = 60 * pop, h = 48 * pop;
        ctx.save(); ctx.globalAlpha = g * dim;
        ctx.fillStyle = v <= 0 ? rgba(C.ink, 0.06) : gray ? rgba(C.inkMid, 0.35) : rgba(C.peri, k);
        ctx.fillRect(HX(j) - w / 2, HY(i) - h / 2, w, h); ctx.restore();
      });
    });
    // 灰列
    const gg = a * gin(tGray + 0.2);
    [0, 5].forEach(j => { ctx.save(); ctx.globalAlpha = gg; ctx.strokeStyle = C.inkMid; ctx.setLineDash([8, 6]); ctx.lineWidth = 2; ctx.strokeRect(HX(j) - 34, HY(0) - 70, 68, HY(7) - HY(0) + 100); ctx.restore(); });
    ctag('全学期卷 · 不计入统计', (HX(0) + HX(5)) / 2, HY(7) + 70, { px: 24, a: a * gin(cue('G02', '超出了期中范围')), color: C.inkMid });
    ctag('正交 · 特征值 · 二次型 = 超纲', DX, HY(7) + 115, { px: 24, a: a * gin(cue('G02', '有正交')), color: C.free });
  }

  // ════ 七集地图 ════
  const EPS = ['方程组与参数讨论', 'LU 与逆', '行列式', '子空间与相关性', '过渡矩阵', '秩与 RREF 反推', '判断 · 导航 · 附加'];
  const EPW = ['方程组', 'LU与逆', '行列式', '子空间与相关性', '过渡矩阵', 'RREF反推', '判断题闪电战'];
  function shotMap() {
    const a = B.win(s('C05'), s('C06') - 0.2); if (a <= 0) return;
    ctag('七集地图', DX, DY - 380, { px: 36, a: a * gin(s('C05')), color: C.peri });
    EPS.forEach((tx, k) => {
      const t0 = cue('C05', EPW[k]), u = outBack(prog(B.t, t0 - 0.2, t0 + 0.4), 1.8); if (u <= 0) return;
      const x = DX - 200 + (k % 2) * 400 + (k === 6 ? 200 : 0), y = DY - 270 + Math.floor(k / 2) * 150;
      ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.translate(-x, -y);
      B.card(x, y, 360, 110, a, k === 0 ? C.peri : C.inkMid);
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = [C.peri, C.i, C.j, C.k, C.free, C.peri, C.i][k]; ctx.fillRect(x - 180, y - 55, 14, 110); ctx.restore();
      ctag(`特别篇 ${k + 1}`, x + 4, y - 24, { px: 22, a, color: C.inkMid });
      ctag(tx, x + 4, y + 16, { px: 32, a, color: C.ink, font: F.serif });
      ctx.restore();
    });
  }

  // ════ 固定流程 ════
  function shotFlow() {
    const a = B.win(s('C06'), s('C08') - 0.3); if (a <= 0) return;
    const steps = [['① 原题上屏', s('C06') + 0.4, C.i], ['② 一句话套路', cue('C07', '第二步'), C.j], ['③ 动画拆解', cue('C07', '第三步'), C.k], ['④ 答案 + 评分点', cue('C07', '最后'), C.gpt]];
    steps.forEach(([tx, t0, col], k) => {
      const x = DX - 330 + k * 220, y = DY + 250, g = a * gin(t0);
      K.pill(tx, x, y, col, g, 24);
      if (k > 0) arrow(ctx, [x - 160, y], [x - 100, y], { color: C.inkMid, width: 3, head: 12, alpha: g });
    });
    // 演示纸卡：整页 → 裁切 → 左栏
    B.paper(EX, 'y1819_q1', { t0: s('C06') + 0.6, dock: cue('C06', '停在左边'), out: s('C08') - 0.4, big: { y: DY - 80, w: 900, hMax: 420 } });
    const g2 = a * B.win(cue('C07', '第二步'), cue('C07', '第三步'));
    B.xcard('套路：先消元，把参数赶到最后一行', DX, DY - 60, 760, 80, g2, C.j, 32);
    const g3 = a * B.win(cue('C07', '第三步'), s('G03') + 0.2);
    if (g3 > 0) { // 小型消元动画示意：一行发光、数字翻牌
      const ph = (B.t * 1.2) % 3;
      B.mat(DX, DY - 60, [[1, 1, 3, 2], [0, 1, 1, 1], [0, 0, ph > 1.5 ? 'a−5' : 'a−3', ph > 1.5 ? 'b−4' : 'b−2']], { px: 34, a: g3, bar: 3, cell: (i) => i === 2 ? { col: C.peri } : null });
    }
    const gG = a * gin(s('G03'));
    B.card(DX, DY + 110, 700, 80, gG * 0.95, C.gpt);
    ctag('评分点：竖线不能省 · 参数原样抄 · 条件写全', DX, DY + 110, { px: 28, a: gG, color: C.gpt });
    B.stamp(DX + 330, DY + 90, true, prog(B.t, s('G03') + 0.4, s('G03') + 0.9), gG, '+4');
  }

  // ════ 回看卡 ════
  function shotReview() {
    const a = B.win(s('C08'), s('D03') - 0.1); if (a <= 0) return;
    const u = outBack(prog(B.t, s('C08') + 0.2, s('C08') + 0.8), 1.5);
    ctx.save(); ctx.translate(DX + (1 - u) * 600, 0);
    B.card(DX, DY - 40, 900, 420, a, C.i);
    ctag('回看卡', DX, DY - 220, { px: 30, a, color: C.i });
    const im = EX.img['y2526_q2']; const w = 360, h = Math.min(220, w * im.height / im.width);
    ctx.save(); ctx.globalAlpha = a; ctx.drawImage(im, DX - 420, DY - 160, w, h); ctx.strokeStyle = C.inkMid; ctx.strokeRect(DX - 420, DY - 160, w, h); ctx.restore();
    ctag('原题', DX - 240, DY + 80, { px: 22, a: a * gin(cue('C08', '只给原题')), color: C.inkMid });
    ctag('答案：α ≠ 8 张成 ℝ³', DX + 200, DY - 120, { px: 28, a: a * gin(cue('C08', '答案')), color: OK, font: F.serif });
    ctag('α = 8, β = 1 无穷多解', DX + 200, DY - 75, { px: 28, a: a * gin(cue('C08', '答案')), color: OK, font: F.serif });
    ctag('套路：det = −2(α − 8)', DX + 200, DY, { px: 28, a: a * gin(cue('C08', '一句话套路')), color: C.j, font: F.serif });
    ctag('→ 完整讲解见 第 1 章复习（下）', DX, DY + 140, { px: 28, a: a * gin(cue('C08', '去哪一集看')), color: C.peri });
    ctx.restore();
  }

  // ════ 速成版 vs 特别篇 ════
  function shotVs() {
    const a = B.win(s('D03'), s('G04') - 0.2); if (a <= 0) return;
    const L1 = a * gin(cue('C09', '速成版是')), R1 = a * gin(cue('C09', '特别篇是'));
    B.card(DX - 220, DY - 40, 400, 380, L1, C.i); B.card(DX + 220, DY - 40, 400, 380, R1, C.peri);
    ctag('速成版', DX - 220, DY - 190, { px: 36, a: L1, color: C.i, font: F.serif });
    ctag('每类 1 道代表题', DX - 220, DY - 100, { px: 28, a: L1 }); ctag('考前一晚', DX - 220, DY - 50, { px: 28, a: L1 }); ctag('≈ 75 分钟', DX - 220, DY, { px: 28, a: L1, color: C.inkMid });
    ctag('特别篇', DX + 220, DY - 190, { px: 36, a: R1, color: C.peri, font: F.serif });
    ctag('每道题都讲细', DX + 220, DY - 100, { px: 28, a: R1 }); ctag('把题型吃透', DX + 220, DY - 50, { px: 28, a: R1 }); ctag('7 集 · 43 段', DX + 220, DY, { px: 28, a: R1, color: C.inkMid });
    const gm = a * gin(cue('C09', '讲得更慢'));
    ctag('同一道题：更慢 · 更完整', DX, DY + 200, { px: 30, a: gm, color: C.peri });
  }

  // ════ 看法 + 收束 ════
  function shotHow() {
    const a = B.win(s('G04'), 1e9); if (a <= 0) return;
    const gq = a * (1 - gin(s('C10') - 0.2));
    [['⏸ 暂停', '先暂停'], ['✎ 自己做', '自己做一遍'], ['▶ 再看', '再往下看'], ['★ 打记号', '打个记号']].forEach(([tx, w], k) => {
      const x = DX - 330 + k * 220, y = DY - 60, g = gq * gin(cue('G04', w));
      const u = outBack(prog(B.t, cue('G04', w), cue('G04', w) + 0.5), 2);
      ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.gpt; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 70 * u, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      ctag(tx, x, y, { px: 28, a: g, color: C.ink });
      if (k > 0) arrow(ctx, [x - 140, y], [x - 80, y], { color: C.inkMid, width: 3, head: 12, alpha: g });
    });
    const ge = a * gin(s('C10'));
    if (ge > 0) {
      const k = lerp(1.5, 1, outBack(prog(B.t, s('C10'), s('C10') + 0.6), 2));
      ctx.save(); ctx.translate(DX, DY - 120); ctx.scale(k, k); ctx.translate(-DX, -(DY - 120));
      ctag('第一集 · 方程组与参数讨论', DX, DY - 120, { px: 52, a: ge, color: C.peri, font: F.serif }); ctx.restore();
      // 三张平面的示意线条
      const gp = a * gin(cue('C10', '三张平面'));
      [[C.peri, -0.25], [C.ink, 0.05], [C.j, 0.35]].forEach(([col, r], q) => {
        ctx.save(); ctx.globalAlpha = gp * 0.7; ctx.translate(DX, DY + 120); ctx.rotate(r + Math.sin(B.t * 0.8 + q) * 0.05);
        ctx.fillStyle = rgba(col, 0.25); ctx.strokeStyle = col; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-240, -40); ctx.lineTo(200, -70); ctx.lineTo(240, 40); ctx.lineTo(-200, 70); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      });
      B.burst(DX, DY + 120, cue('C10', '三张平面') + 0.3, C.i, { r1: 300, n: 20 });
    }
  }

  function draw(t) { B.frame(t, () => { shotFan(); shotHeat(); shotMap(); shotFlow(); shotReview(); shotVs(); shotHow(); }); }
  return { TL, draw };
}
