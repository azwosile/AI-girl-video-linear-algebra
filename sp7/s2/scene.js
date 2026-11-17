// 特别篇 7 · 第 2 段：整卷导航与考场策略。
// 分镜：最新卷 6 道题缩略卡 2×3 依次放大落位，每张挂“分值 + 对应特别篇”标签 → “每一道题都讲过” 全部打勾
//       → 120 分钟时间条切成 7 段（逐段生长）→ 做题顺序：卡片重排（4、5 先做，判断题挪到最后）
//       → 十张套路卡扇形展开，逐张高亮放大 → 验算三连图标 → bug 题回闪。
import { base, loadExam, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba } from '../../sp/common.js';
import { kit } from '../../sp6/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'ds_happy', 'ds_think', 'gpt_point', 'gpt_proud'] };

export async function setup(R) {
  const KEYS = ['y2526_q1', 'y2526_q2', 'y2526_q3', 'y2526_q4', 'y2526_q5', 'y2526_q6'];
  const EX = await loadExam(KEYS);
  const B = base(R, {
    assets, label: '特别篇 7 · 判断 · 导航 · 附加', title: '整卷导航', hi: 2, en: 'EXAM MAP & STRATEGY',
    titleEnd: () => B.L('C01').s + 0.6,
    pre: { C01: 0.4, G01: 0.8, C05: 0.8, G03: 0.6 },
    post: { C01: 0.8, C04: 1.0, D01: 1.2, G01: 1.6, G02: 1.6, C08: 1.6, G03: 1.2, D02: 2.0 },
  });
  const { L, cue, TL, ctx, gin, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;
  const K = kit(B);

  const P = [
    { n: 1, pts: 25, ep: '本集 · 闪电战', t: () => cue('C02', '第一题') },
    { n: 2, pts: 12, ep: '特别篇 1', t: () => cue('C02', '第二题') },
    { n: 3, pts: 12, ep: '特别篇 2', t: () => cue('C03', '第三题') },
    { n: 4, pts: 24, ep: '特别篇 6', t: () => cue('C03', '第四题') },
    { n: 5, pts: 15, ep: '特别篇 5', t: () => cue('C04', '第五题') },
    { n: 6, pts: 12, ep: '特别篇 4', t: () => cue('C04', '第六题') },
  ];
  const tOrder = cue('G02', '顺序建议'), tOk = s('D01');

  // ── 音效 ──
  TL.sfx('swoosh_in', s('C01') + 0.6, 0.35);
  P.forEach(p => { TL.sfx('pop', p.t(), 0.3); TL.sfx('tick', p.t() + 0.5, 0.25); });
  TL.sfx('ding_hi', tOk + 0.1, 0.35); TL.sfx('sparkle', tOk + 0.4, 0.3);
  ['判断二十分钟', '第二、三题', '第四题二十五分钟', '第五、六题', '最后留十五分钟'].forEach(w => TL.sfx('tick2', cue('G01', w), 0.3));
  TL.sfx('whoosh', tOrder + 0.6, 0.35); TL.sfx('swoosh_soft', cue('G02', '判断题放到后面'), 0.3);
  TL.sfx('riser', s('C05') - 0.2, 0.3);
  const RC = [
    ['参数讨论先算 det，令 det = 0 的值单独代回', () => cue('C05', '一，参数讨论')],
    ['LU：乘数变号进 L', () => cue('C05', '二，LU分解')],
    ['求逆：[A | I] → [I | A⁻¹]', () => cue('C06', '三，求逆')],
    ['det 先化三角；A·adj A = det A · I', () => cue('C06', '四，行列式')],
    ['子空间三条：含 0、加法封闭、数乘封闭', () => cue('C06', '五，子空间')],
    ['相关性：秩 / det；函数用 Wronskian', () => cue('C07', '六，相关性')],
    ['过渡矩阵：到谁用谁的逆', () => cue('C07', '七，过渡矩阵')],
    ['行空间用 U，列空间用 A', () => cue('C08', '八，行空间')],
    ['非主元列、b 的系数：读 U 的那一列', () => cue('C08', '九，非主元列')],
    ['判断：F 给反例，T 给证明', () => cue('C08', '十，判断题')],
  ];
  RC.forEach(([, tf]) => TL.sfx('click', tf(), 0.3));
  ['代回原方程', '维数加起来', '判断题拿二乘二'].forEach(w => TL.sfx('check', cue('G03', w), 0.3));
  TL.sfx('glitch', s('D02') + 0.2, 0.25);

  // 缩略卡位置：2 行 × 3 列；重排后顺序 4 5 2 3 6 1
  const slot = k => [DX - 300 + (k % 3) * 300, DY - 150 + Math.floor(k / 3) * 250];
  const ORDER = [3, 4, 1, 2, 5, 0];
  function shotMap() {
    const a = B.win(s('C01') + 0.5, s('C05') - 0.3); if (a <= 0) return;
    ctag('2025–2026 期中 · 6 题 · 100 分', DX, DY - 360, { px: 32, a: a * gin(s('C01') + 0.5), color: C.peri });
    const mv = smoother(prog(B.t, tOrder + 0.6, tOrder + 1.6)), shrink = smoother(prog(B.t, s('G01') - 0.3, s('G01') + 0.4));
    P.forEach((p, i) => {
      const g = a * gin(p.t()); if (g <= 0) return;
      const pos0 = slot(i), pos1 = slot(ORDER.indexOf(i));
      let [x, y] = [lerp(pos0[0], pos1[0], mv), lerp(pos0[1], pos1[1], mv) - Math.sin(Math.PI * mv) * (i === 0 ? -60 : 60)];
      y = lerp(y, y - 60, shrink) ; const sc = lerp(1, 0.8, shrink);
      const pop = lerp(1.25, 1, outBack(prog(B.t, p.t(), p.t() + 0.5), 2)) * sc;
      const im = EX.img[KEYS[i]], W = 260 * pop, H = Math.min(150 * pop, W * im.height / im.width);
      ctx.save(); ctx.globalAlpha = g; ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - W / 2 + 8, y - H / 2 + 10, W, H);
      ctx.drawImage(im, 0, 0, im.width, Math.min(im.height, im.width * H / W), x - W / 2, y - H / 2, W, H);
      ctx.strokeStyle = p.n === 4 ? C.peri : rgba(C.ink, 0.6); ctx.lineWidth = p.n === 4 ? 4 : 2; ctx.strokeRect(x - W / 2, y - H / 2, W, H); ctx.restore();
      K.pill(`第 ${p.n} 题 · ${p.pts} 分`, x, y - H / 2 - 18, p.pts >= 24 ? C.peri : C.i, g, 20);
      K.pill(p.ep, x, y + H / 2 + 22, C.j, g * gin(p.t() + 0.5), 20);
      if (B.t > tOk) B.stamp(x + W / 2 - 20, y - 10, true, gin(tOk + i * 0.08, 0.4), g * (1 - shrink * 0.6));
    });
    // 时间条
    const gt = a * gin(s('G01') - 0.1); if (gt <= 0) return;
    const segs = [['判断', 20, C.i, '判断二十分钟'], ['2', 15, C.k, '第二、三题'], ['3', 15, C.k, '第二、三题'], ['4', 25, C.peri, '第四题二十五分钟'], ['5', 15, C.j, '第五、六题'], ['6', 15, C.j, '第五、六题'], ['验算', 15, OK, '最后留十五分钟']];
    const X0 = DX - 420, Wt = 840, yb = DY + 300; let acc = 0;
    ctag('120 分钟', X0 - 20, yb - 48, { px: 26, a: gt, color: C.inkMid, align: 'left' });
    segs.forEach(([lab, m, col, w]) => {
      const u = smoother(prog(B.t, cue('G01', w), cue('G01', w) + 0.6)), x0 = X0 + acc / 120 * Wt, ww = m / 120 * Wt * u; acc += m;
      if (u <= 0) return;
      ctx.save(); ctx.globalAlpha = gt * 0.85; ctx.fillStyle = col; ctx.fillRect(x0 + 2, yb - 22, Math.max(0, ww - 4), 44); ctx.restore();
      ctag(lab, x0 + m / 120 * Wt / 2, yb, { px: 22, a: gt * u, color: C.paperHi, font: F.sans });
      ctag(`${m}′`, x0 + m / 120 * Wt / 2, yb + 44, { px: 22, a: gt * u, color: col });
    });
    // 顺序建议
    const go = a * gin(tOrder + 1.4);
    ctag('先做 4、5（套路固定、分值高）→ 判断题放最后', DX, DY + 180, { px: 28, a: go, color: C.peri });
  }

  function shotRecipes() {
    const a = B.win(s('C05'), s('G03') - 0.3); if (a <= 0) return;
    ctag('必背清单 · 10 张套路卡', DX, DY - 360, { px: 32, a: a * gin(s('C05')), color: C.peri });
    // 扇形展开：未点到的卡在底部扇形里，点到的飞到中央放大，之后退到右侧列表
    let cur = -1; RC.forEach(([, tf], k) => { if (B.t >= tf()) cur = k; });
    RC.forEach(([txt, tf], k) => {
      const t0 = tf(), fan = smoother(prog(B.t, s('C05') + 0.3 + k * 0.08, s('C05') + 1.0 + k * 0.08));
      const ang = (k - 4.5) * 0.11, fx = DX + Math.sin(ang) * 520, fy = DY + 640 - Math.cos(ang) * 420;
      const lx = DX - 20, ly = DY - 290 + k * 62; // 列表位
      const on = prog(B.t, t0, t0 + 0.5), off = prog(B.t, t0 + 1.4, t0 + 2.0);
      let x, y, sc, rot;
      if (B.t < t0) { x = fx; y = fy; sc = 0.55; rot = ang; }
      else if (k === cur && off < 1) { const m = smoother(on); x = lerp(fx, DX, m); y = lerp(fy, DY + 60, m); sc = lerp(0.55, 0.95, outBack(on, 1.6)); rot = lerp(ang, 0, m);
        const o = smoother(off); x = lerp(x, lx, o); y = lerp(y, ly, o); sc = lerp(sc, 0.62, o); }
      else { x = lx; y = ly; sc = 0.62; rot = 0; }
      const g = a * fan; if (g <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
      B.card(0, 0, 980, 80, g, k === cur ? C.peri : C.inkMid);
      ctag(String(k + 1), -450, 0, { px: 40, a: g, color: C.peri, font: F.serif });
      ctag(txt, 30, 0, { px: 38, a: g, color: C.ink });
      ctx.restore();
      if (k === cur) B.burst(DX, DY + 60, t0 + 0.4, C.peri, { r1: 260, n: 14 });
    });
  }

  function shotVerify() {
    const a = B.win(s('G03'), 1e9); if (a <= 0) return;
    ctag('验算习惯', DX, DY - 300, { px: 40, a: a * gin(s('G03')), color: OK, font: F.serif });
    [['代回原式', 'A·x = b ?', '代回原方程'], ['维数检查', 'r + (n − r) = n', '维数加起来'], ['小数字反例', '2×2 试一试', '判断题拿二乘二']].forEach(([h, sub, w], k) => {
      const x = DX - 300 + k * 300, y = DY - 80, g = a * gin(cue('G03', w)); if (g <= 0) return;
      const sc = lerp(1.3, 1, outBack(prog(B.t, cue('G03', w), cue('G03', w) + 0.5), 2));
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
      ctx.globalAlpha = g; ctx.strokeStyle = OK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      ctag('✓', x, y - 12, { px: 70, a: g, color: OK, font: F.serif });
      ctag(h, x, y + 130, { px: 32, a: g, color: C.ink }); ctag(sub, x, y + 175, { px: 26, a: g, color: C.inkMid, font: F.serif });
    });
    const gb = a * gin(s('D02'));
    K.glitch(s('D02') + 0.1, s('D02') + 0.9, 0.6);
    K.redStamp('a₄ = −a₁ ?!  · 特别篇 6 的 bug 题', DX, DY + 300, prog(B.t, s('D02') + 0.3, s('D02') + 0.8), gb, C.free, 34);
  }

  function draw(t) { B.frame(t, () => { shotMap(); shotRecipes(); shotVerify(); }); }
  return { TL, draw };
}
