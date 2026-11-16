// 特别篇 · 期中速成 x0：开场 + 考点热力图 + 路线图。
// 分镜：标题 → 前三章三块拼图 → 热力图逐列波浪点亮（数字跳动）→ 行合计条形生长、最热四行描边
//       → 子空间 / 过渡矩阵 / 判断行扫光 → 路线图：8 个站点沿折线依次亮起、光点行进 → 四拍卡 → 11 张套路卡扇形展开。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, rgba } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_shock', 'ds_think', 'ds_proud', 'gpt_point', 'gpt_explain'] };

// 七份期中卷 × 八类题型，分值（人工归并；判断 / 填空按小题折算），每列合计 100
const PAPERS = ['25–26', '24–25', '23–24', '21–22', '20–21', '18–19', '17–18'];
const TOPICS = ['含参方程组', '矩阵运算与逆', '行列式', '子空间', '线性相关', '过渡矩阵', 'RREF / 零空间', '判断题'];
const HEAT = [
  [12, 12, 0, 0, 0, 18, 0],
  [12, 25, 10, 10, 20, 14, 12],
  [0, 6, 16, 20, 10, 30, 15],
  [12, 13, 2, 10, 10, 20, 12],
  [0, 8, 34, 10, 10, 14, 25],
  [15, 8, 12, 15, 15, 0, 15],
  [24, 18, 14, 10, 15, 4, 21],
  [25, 10, 12, 25, 20, 0, 0],
];
PAPERS.forEach((_, j) => { const t = HEAT.reduce((p, r) => p + r[j], 0); if (t !== 100) throw new Error(`HEAT 第 ${j} 列合计 ${t} ≠ 100`); });

export async function setup(R) {
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '期中速成 · 开场', hi: 1, en: 'MIDTERM CRASH COURSE',
    titleEnd: () => B.L('G01').s + 0.2,
    pre: { C02: 0.6, C05: 0.2 },
    post: { C02: 2.4, C03: 1.6, C04: 1.2, D02: 0.6, C07: 1.6, C08: 1.0, G02: 1.6, C09: 1.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const tot = HEAT.map(r => r.reduce((p, q) => p + q, 0));

  TL.sfx('swell', 0.2, 0.35); TL.sfx('shimmer', 1.0, 0.3);
  TL.sfx('buzz', s('D01') + 0.4, 0.18);
  [0, 1, 2].forEach(i => TL.sfx('pop', cue('G01', ['线性方程组', '行列式', '向量空间'][i]), 0.3));
  PAPERS.forEach((_, j) => TL.sfx('marimba', s('C02') + 1.2 + j * 0.28, 0.2));
  TL.sfx('riser', s('C03') + 0.2, 0.22); TL.sfx('impact', cue('C03', '最热的四块'), 0.3);
  TL.sfx('laser', cue('C04', '子空间'), 0.25); TL.sfx('laser', cue('C04', '过渡矩阵'), 0.25); TL.sfx('laser', s('D02') + 0.2, 0.25);
  const tk = k => k < 4 ? s('C06') + 0.3 + k * 1.1 : s('C07') + 0.3 + (k - 4) * 1.3;
  for (let k = 0; k < 8; k++) TL.sfx('tick', tk(k), 0.22);
  [0, 1, 2, 3].forEach(i => TL.sfx('pop', cue('C08', ['原题上屏', '一句话套路', '动画演示', '答案和评分点'][i]), 0.28));
  TL.sfx('swoosh_in', s('G02') + 0.4, 0.3); TL.sfx('sparkle', s('G02') + 1.6, 0.3);
  TL.sfx('count_go', s('D03') + 0.2, 0.3); TL.sfx('whoosh', s('C09') + 0.4, 0.3);

  // ════ 前三章拼图 ════
  function shotChapters() {
    const a = B.win(s('G01') - 0.2, s('C02') + 0.1); if (a <= 0) return;
    const names = ['第 1 章\n线性方程组', '第 2 章\n行列式', '第 3 章\n向量空间'], cols = [C.peri, C.i, C.j];
    names.forEach((n, i) => {
      const t0 = cue('G01', ['线性方程组', '行列式', '向量空间'][i]), g = a * gin(t0), k = outBack(Math.min(1, Math.max(0, (B.t - t0) / 0.5)), 1.8);
      const x = DX - 300 + i * 300, y = DY - 40;
      ctx.save(); ctx.globalAlpha = g; ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
      B.card(x, y, 250, 200, 1, cols[i]);
      n.split('\n').forEach((l, q) => ctag(l, x, y - 30 + q * 60, { px: q ? 36 : 28, a: 1, color: q ? C.ink : cols[i], font: q ? F.serif : undefined }));
      ctx.restore();
    });
    ctag('今年期中：只考前三章', DX, DY + 160, { px: 34, a: a * gin(cue('G01', '只考前三章')), color: C.ink });
  }

  // ════ 热力图 ════
  const GX = DX - 300, GY = DY - 250, CW = 88, RH = 60;
  const cx = j => GX + CW * (j + 0.5), cy = i => GY + RH * (i + 0.5);
  function shotHeat() {
    const a = B.win(s('C02') - 0.2, s('C05') + 0.4); if (a <= 0) return;
    const t0 = s('C02') + 1.2;
    ctag('七份期中卷 · 每份 100 分', DX, GY - 70, { px: 30, a: a * gin(s('C02')), color: C.inkMid });
    PAPERS.forEach((p, j) => ctag(p, cx(j), GY - 22, { px: 24, a: a * gin(t0 + j * 0.28 - 0.3), color: C.inkMid }));
    TOPICS.forEach((t, i) => ctag(t, GX - 16, cy(i), { px: 26, a: a * gin(s('C02') + 0.4 + i * 0.08), color: C.ink, align: 'right' }));
    const hot = [6, 1, 4, 2], tHot = cue('C03', '最热的四块');
    const sweep = [[3, cue('C04', '子空间')], [5, cue('C04', '过渡矩阵')], [7, s('D02') + 0.2]];
    for (let i = 0; i < 8; i++) for (let j = 0; j < 7; j++) {
      const v = HEAT[i][j], tc = t0 + j * 0.28 + i * 0.04, g = a * gin(tc, 0.35); if (g <= 0) continue;
      const k = v / 34, pop = outBack(Math.min(1, Math.max(0, (B.t - tc) / 0.4)), 2);
      let boost = 0; sweep.forEach(([r, ts]) => { if (r === i) boost = Math.max(boost, B.win(ts, ts + 3.2) * (v > 0 ? 1 : 0)); });
      const w = (CW - 8) * pop, h = (RH - 8) * pop;
      ctx.save(); ctx.globalAlpha = g * (v ? 0.22 + 0.78 * k : 0.08);
      ctx.fillStyle = v ? (k > 0.55 ? C.peri : k > 0.3 ? C.i : rgba(C.i, 0.7)) : C.ink;
      if (boost > 0) { ctx.shadowColor = C.j; ctx.shadowBlur = 24 * boost; }
      ctx.fillRect(cx(j) - w / 2, cy(i) - h / 2, w, h); ctx.restore();
      if (boost > 0) { ctx.save(); ctx.globalAlpha = a * boost; ctx.strokeStyle = C.j; ctx.lineWidth = 3; ctx.strokeRect(cx(j) - w / 2, cy(i) - h / 2, w, h); ctx.restore(); }
      const shown = Math.round(v * smoother(prog(B.t, tc, tc + 0.6)));
      if (v) ctag(String(shown), cx(j), cy(i), { px: 26, a: g, color: C.ink, font: F.serif });
    }
    // 行合计
    const gt = gin(s('C03') + 0.3);
    if (gt > 0) {
      const bx = GX + CW * 7 + 18;
      ctag('合计', bx + 50, GY - 22, { px: 24, a: a * gt, color: C.inkMid });
      tot.forEach((v, i) => {
        const p = smoother(prog(B.t, s('C03') + 0.3 + i * 0.12, s('C03') + 1.3 + i * 0.12)), w = 110 * v / 106 * p, isHot = hot.includes(i);
        ctx.save(); ctx.globalAlpha = a * gt * (isHot && B.t > tHot ? 1 : 0.6); ctx.fillStyle = isHot && B.t > tHot ? C.peri : C.inkMid; ctx.fillRect(bx, cy(i) - 12, w, 24); ctx.restore();
        ctag(String(Math.round(v * p)), bx + w + 26, cy(i), { px: 22, a: a * gt, color: C.ink });
      });
      hot.forEach((r, k) => {
        const g = a * gin(tHot + k * 0.25);
        if (g <= 0) return;
        ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.shadowColor = C.peri; ctx.shadowBlur = 14;
        ctx.strokeRect(GX - 190, cy(r) - RH / 2 + 2, 190 + CW * 7 + 160, RH - 4); ctx.restore();
      });
    }
    // 底注
    const sw = sweep.map(([r, ts], k) => B.win(ts, (k < 2 ? sweep[k + 1][1] : s('C05') + 0.4)));
    const notes = ['子空间：7 / 7 份', '过渡矩阵：6 / 7 份，每次 12–15 分', '判断题：5 / 7 份，最多 25 分'];
    notes.forEach((n, k) => ctag(n, DX, GY + RH * 8 + 50, { px: 32, a: a * sw[k], color: C.j }));
  }

  // ════ 路线图 ════
  const ST = [['x1', '含参方程组'], ['x2', 'LU 与逆'], ['x3', '行列式'], ['x4', '子空间'], ['x5', '线性相关'], ['x6', '过渡矩阵'], ['x7', 'RREF 反推'], ['x8', '判断 + 十条']];
  const pos = k => { const row = k < 4 ? 0 : 1, c = row ? 7 - k : k; return [DX - 345 + c * 230, DY - 150 + row * 230]; };
  function shotRoad() {
    const a = B.win(s('C05') + 0.2, s('C08') + 0.1); if (a <= 0) return;
    // 路径
    ctx.save(); ctx.globalAlpha = a * 0.5; ctx.strokeStyle = C.inkMid; ctx.lineWidth = 3; ctx.setLineDash([10, 10]); ctx.beginPath();
    for (let k = 0; k < 8; k++) { const [x, y] = pos(k); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
    // 光点
    let kk = -1; for (let k = 0; k < 8; k++) if (B.t >= tk(k)) kk = k;
    if (kk >= 0) {
      const nxt = Math.min(7, kk + 1), p = kk < 7 ? smoother(prog(B.t, tk(kk), tk(kk) + 0.6)) : 0;
      const [x0, y0] = pos(kk), [x1, y1] = pos(nxt);
      const q = kk < 7 && B.t > tk(nxt) - 0.6 ? smoother(prog(B.t, tk(nxt) - 0.6, tk(nxt))) : 0;
      B.dot(lerp(x0, x1, q), lerp(y0, y1, q), 12, C.i, a);
    }
    ST.forEach(([id, n], k) => {
      const [x, y] = pos(k), g = a * gin(tk(k)), lit = B.t >= tk(k);
      ctx.save(); ctx.globalAlpha = g; ctx.fillStyle = lit ? rgba(C.peri, 0.25) : rgba(C.ink, 0.06); ctx.strokeStyle = lit ? C.peri : C.inkMid; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 46, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      ctag(String(k + 1), x, y, { px: 40, a: g, color: C.peri, font: F.serif });
      ctag(n, x, y + 80, { px: 28, a: g, color: C.ink });
      if (lit) B.burst(x, y, tk(k), C.peri, { r1: 90, n: 10 });
    });
  }

  // ════ 四拍 + 套路卡 ════
  function shotBeats() {
    const a = B.win(s('C08') - 0.2, s('C09') + 0.2); if (a <= 0) return;
    const fa = a * (1 - gin(s('G02') - 0.2));
    const labs = ['原题上屏', '一句话套路', '动画演示', '答案 · 评分点'], cols = [C.inkMid, C.peri, C.j, OK];
    labs.forEach((l, i) => {
      const t0 = cue('C08', ['原题上屏', '一句话套路', '动画演示', '答案和评分点'][i]), g = fa * gin(t0), x = DX - 345 + i * 230;
      B.card(x, DY - 40, 200, 150, g, cols[i]); ctag(`${i + 1}`, x, DY - 80, { px: 36, a: g, color: cols[i], font: F.serif }); ctag(l, x, DY - 10, { px: 28, a: g, color: C.ink });
      if (i < 3) ctag('→', x + 115, DY - 40, { px: 32, a: g, color: C.inkMid });
    });
    const g2 = a * gin(s('G02') + 0.4);
    if (g2 > 0) {
      for (let k = 0; k < 11; k++) {
        const sp = smoother(prog(B.t, s('G02') + 0.4, s('G02') + 1.6)), th = lerp(0, (k - 5) * 0.13, sp);
        ctx.save(); ctx.globalAlpha = g2; ctx.translate(DX, DY + 260); ctx.rotate(th); ctx.translate(0, -300);
        B.card(0, 0, 130, 180, 1, [C.peri, C.i, C.j, C.k][k % 4]);
        ctag(`套路卡`, 0, -40, { px: 20, a: 1, color: C.inkMid }); ctag('①②③④⑤⑥⑦⑧⑨⑩⑪'[k], 0, 20, { px: 52, a: 1, color: [C.peri, C.i, C.j, C.k][k % 4], font: F.serif });
        ctx.restore();
      }
      ctag('考前过一遍 = 复习提纲', DX, DY + 300, { px: 32, a: a * gin(cue('G02', '考前')), color: C.gpt });
    }
  }

  function shotGo() {
    const a = B.win(s('C09'), 1e9); if (a <= 0) return;
    const k = outBack(Math.min(1, Math.max(0, (B.t - s('C09') - 0.3) / 0.6)), 1.6);
    ctag('第 1 段', DX, DY - 80, { px: 36, a: a * gin(s('C09') + 0.3), color: C.inkMid });
    ctag('含参方程组', DX, DY, { px: 80 * Math.max(0.01, k), a: a * gin(s('C09') + 0.3), color: C.peri, font: F.serif });
  }

  function draw(t) {
    B.frame(t, () => { shotChapters(); shotHeat(); shotRoad(); shotBeats(); shotGo(); });
  }
  return { TL, draw };
}
