// 特别篇 · 期中速成 x6：过渡矩阵与坐标（2025–26 第 5 题）。
// 分镜：两副眼镜（同一点、两套斜网格、两组读数）→ 原题 → 3D：按 E 走 (3,2,−1) 与按 F 走 (8,−5,3) 到同一点，坐标里程表滚动
//       → 翻译链 [x]_E →E→ 标准 →F⁻¹→ [x]_F，弧线合成 S → [F|E] 三步消元 → [I|S] → S×坐标逐行点亮（里程表）
//       → F 回代自检 → Leon / 同济约定对照 → 套路卡⑩。
import { base, loadExam, MBoard, C, F, lerp, prog, smooth, smoother, outCubic, DX, DY, OK, arrow, load3D, rgba, fmtNum } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_shock', 'ds_think', 'ds_happy', 'ds_proud', 'gpt_point', 'gpt_explain', 'gpt_cross'] };

export async function setup(R) {
  const EX = await loadExam(['y2526_q5', 'y2425_q6', 'y1718_q7', 'y2021_q5', 'y1516_q3']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '过渡矩阵', hi: 1, en: 'CHANGE OF BASIS',
    titleEnd: () => B.L('C02').s + 0.3,
    pre: { C03: 1.0, C04: 0.4, C06: 0.6, C08: 0.6, C13: 0.6, C16g: 1.0, C16m: 1.0, C16o: 0.4, C16q: 1.0, C17: 0.8 },
    post: { C02: 1.6, C04: 2.0, C05: 2.4, C07: 1.4, C11: 1.2, C12: 1.0, C13: 1.0, C15: 1.0, G02: 1.0, C16: 1.0, C16g: 1.2, C16h: 0.8, C16i: 1.0, C16j: 1.2, C16k: 1.2, C16l: 1.2, G03b: 1.0, C16n: 1.2, C16o: 0.8, C16p: 1.6, G03c: 1.0, C16r: 1.0, C16s: 1.4, G03d: 1.2, C17: 1.2 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;

  const gjT = [s('C09') + 0.3, s('C10') + 0.3, s('C11') + 0.3];
  const GJ = new MBoard([[1, 1, 1, 1, 2, 1], [1, 2, 2, 1, 3, 5], [0, 0, 1, 1, 2, 4]], { aug: false });
  GJ.add(gjT[0], gjT[0] + 1.2, 1, 0, -1).add(gjT[1], gjT[1] + 1.2, 0, 1, -1).add(gjT[2], gjT[2] + 1.2, 1, 2, -1);

  TL.sfx('swoosh_in', 0.3, 0.45);
  TL.sfx('buzz', s('D01') + 0.3, 0.2);
  TL.sfx('warp', s('C02') + 1.0, 0.25); TL.sfx('warp', cue('C02', '读出来') + 0.4, 0.25);
  TL.sfx('whoosh', s('C03') + 0.2, 0.3); TL.sfx('stamp', s('C03') + 2.6, 0.3);
  TL.sfx('riser', s('C04') - 0.4, 0.2);
  [0, 1, 2].forEach(i => TL.sfx('marimba', cue('C04', '三步v一') + i * 1.0, 0.25)); TL.sfx('ding_hi', cue('C04', '到达'), 0.3);
  [0, 1, 2].forEach(i => TL.sfx('marimba_hi', cue('C05', '要走八步') + i * 1.0, 0.25)); TL.sfx('ding_hi', cue('C05', '所以x在F'), 0.3);
  TL.sfx('count', cue('C04', '所以x在E'), 0.25); TL.sfx('count', cue('C05', '所以x在F'), 0.25);
  TL.sfx('pop', s('G01') + 1.0, 0.3);
  TL.sfx('swoosh_soft', s('C06') + 0.5, 0.3); TL.sfx('swoosh_soft', s('C07') + 0.4, 0.3); TL.sfx('slam', cue('C07', '两步合起来') + 0.4, 0.3);
  TL.sfx('swoosh_in', cue('C08', '并排写'), 0.3);
  gjT.forEach(x => TL.sfx('pluck', x, 0.28)); TL.sfx('shimmer', gjT[2] + 1.3, 0.3); TL.sfx('ding_hi', s('C12') + 0.4, 0.35);
  [0, 1, 2].forEach(i => TL.sfx('tick', cue('C13', ['第一行', '第二行', '第三行'][i]), 0.3)); TL.sfx('count_go', cue('C13', '第三行') + 2.0, 0.3);
  TL.sfx('ding_hi', s('C14') + 0.3, 0.3);
  [0, 1, 2].forEach(i => TL.sfx('tick', cue('C15', ['一减三', '负一加三', '一减六'][i]), 0.3)); TL.sfx('ding_hi', cue('C15', '所以y'), 0.3);
  TL.sfx('check', e('G02') - 0.6, 0.35);
  TL.sfx('sting', s('G03') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('G03', '同济教材'), 0.3); TL.sfx('slam', s('C16') + 0.4, 0.3);
  TL.sfx('bell_soft', s('C17'), 0.35); TL.sfx('shimmer', s('D05'), 0.35);
  // 扩写二 sfx
  TL.sfx('whoosh', s('C16g') + 0.2, 0.3); TL.sfx('swoosh_soft', s('C16h') + 0.3, 0.3);
  TL.sfx('pop', cue('C16i', '左边得到零、零'), 0.3); TL.sfx('pop', cue('C16i', '第二行减第一行') + 0.8, 0.3); TL.sfx('pop', cue('C16j', '第二行减第三行') + 0.8, 0.3); TL.sfx('zap', cue('C16j', '最后') + 1.6, 0.3);
  TL.sfx('impact', s('C16k') + 0.4, 0.3); ['二减三加八', '二加三', '二减四'].forEach(p => TL.sfx('tick', cue('C16l', p), 0.3)); TL.sfx('ding_hi', cue('C16l', '所以u坐标') + 0.2, 0.35); TL.sfx('stamp', e('G03b') - 0.8, 0.35); TL.sfx('shimmer', s('D04a'), 0.3);
  TL.sfx('whoosh', s('C16m') + 0.2, 0.3); TL.sfx('ding_hi', cue('C16n', 'V的行列式'), 0.3); TL.sfx('ding_hi', cue('C16n', 'U的行列式'), 0.3); TL.sfx('pluck', cue('C16n', '都不为零'), 0.3);
  TL.sfx('swoosh_soft', cue('C16o', '换到最上面') + 0.5, 0.3); ['第三行减两倍第一行', '交换第二', '再乘负一', '往上回代'].forEach((p, i) => TL.sfx('pop', cue('C16p', p) + [0.5, 0.6, 0.4, 0.6][i], 0.3));
  TL.sfx('impact', cue('C16p', '右边得到S') + 0.3, 0.3); TL.sfx('check', cue('G03c', '正好是v一'), 0.3); TL.sfx('stamp', cue('G03c', '对') + 0.2, 0.35);
  TL.sfx('whoosh', s('C16q') + 0.2, 0.3); TL.sfx('buzz', s('D04b') + 0.3, 0.18); TL.sfx('laser', cue('C16r', '第一列四'), 0.25); TL.sfx('laser', cue('C16r', '第二列一'), 0.25);
  TL.sfx('ding_hi', cue('C16s', '得零、负一'), 0.3); TL.sfx('impact', cue('C16s', '得一、五'), 0.3); TL.sfx('check', s('G03d') + 1.0, 0.3);

  // ── 里程表：数字滚动 ──
  function odo(x, y, vals, p, col, a, { px = 44, lab = '' } = {}) {
    if (a <= 0) return;
    const n = vals.length, gap = px * 1.6, x0 = x - (n - 1) * gap / 2;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = rgba(C.paperHi, 0.9); ctx.strokeStyle = col; ctx.lineWidth = 3;
    const w = n * gap + px * 0.8, h = px * 1.5; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2 + 3, w, h - 6); ctx.clip();
    ctx.font = F.serif(px); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    vals.forEach((v, i) => {
      const q = smoother(Math.min(1, Math.max(0, p * 1.4 - i * 0.2))), cur = v * q, lo = Math.trunc(cur), fr = Math.abs(cur - lo), dir = v < 0 ? -1 : 1;
      const cx = x0 + i * gap;
      ctx.fillStyle = q >= 1 ? col : C.ink;
      ctx.fillText(fmtNum(lo).replace('-', '−'), cx, y - fr * px * 1.2);
      if (fr > 0.01) ctx.fillText(fmtNum(lo + dir).replace('-', '−'), cx, y + (1 - fr) * px * 1.2);
      if (i < n - 1) { ctx.fillStyle = C.inkMid; ctx.fillText(',', cx + gap / 2, y + px * 0.1); }
    });
    ctx.restore();
    if (lab) ctag(lab, x - w / 2 - 20, y, { px: px * 0.7, a, color: col, align: 'right', font: F.serif });
  }

  // ════ 两副眼镜（2D 斜网格） ════
  function shotGlasses() {
    const a = B.win(s('C02') - 0.2, s('C03') + 0.1); if (a <= 0) return;
    const sw = smoother(prog(B.t, cue('C02', '读出来') - 0.3, cue('C02', '读出来') + 0.7));
    const bE = [[1, 0.25], [0.35, 1]], bF = [[1, -0.35], [-0.2, 1.05]], P = [2.2, 1.6], k = 95, O = [DX, DY + 30];
    const bs = [0, 1].map(i => [0, 1].map(j => lerp(bE[i][j], bF[i][j], sw))), col = sw < 0.5 ? C.j : C.peri;
    const S = (u, v) => [O[0] + k * (u * bs[0][0] + v * bs[1][0]), O[1] - k * (u * bs[0][1] + v * bs[1][1])];
    ctx.save(); ctx.globalAlpha = a * 0.35 * gin(s('C02') + 0.6); ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    for (let i = -4; i <= 4; i++) { let p = S(i, -4), q = S(i, 4); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); p = S(-4, i); q = S(4, i); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); }
    ctx.restore();
    arrow(ctx, O, S(1, 0), { color: col, alpha: a, width: 5 }); arrow(ctx, O, S(0, 1), { color: col, alpha: a, width: 5 });
    const Pp = [O[0] + k * P[0], O[1] - k * P[1]];
    arrow(ctx, O, Pp, { color: C.i, alpha: a * gin(s('C02') + 0.3), width: 7 });
    B.dot(Pp[0], Pp[1], 12, C.i, a);
    // 坐标读数：解 u·b0 + v·b1 = P
    const det = bs[0][0] * bs[1][1] - bs[1][0] * bs[0][1], u = (P[0] * bs[1][1] - bs[1][0] * P[1]) / det, v = (bs[0][0] * P[1] - P[0] * bs[0][1]) / det;
    ctag(`${sw < 0.5 ? 'E' : 'F'} 眼镜读数：(${u.toFixed(1)}, ${v.toFixed(1)})`, DX, DY - 330, { px: 38, a: a * gin(s('C02') + 1.0), color: col, font: F.serif });
    ctag('同一个点', Pp[0] + 90, Pp[1] - 20, { px: 30, a: a * gin(s('C02') + 0.8), color: C.i });
  }

  // ════ 3D：两种走法 ════
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3, nPlanes: 0, nLines: 0, nPoints: 0 });
  const k3 = 0.3, sc = v => v.map(q => q * k3);
  const vE = [[1, 1, 1], [2, 3, 2], [1, 5, 4]].map(sc), uF = [[1, 1, 0], [1, 2, 0], [1, 2, 1]].map(sc), X = sc([6, 4, 3]);
  const add = (p, q) => p.map((v, i) => v + q[i]), mul = (c, v) => v.map(q => q * c);
  function show3D(D) {
    const a = B.win(s('C04') - 0.3, s('C06') - 0.1); if (a <= 0) return;
    P3.reset();
    const V = B.show3D(P3, D, a, { el: 22, az: -35 + 8 * Math.sin(B.t * 0.18), dist: 12, target: [0.9, 0.9, 0.7], axesA: 0.45, floorA: 0.25 });
    const O = [0, 0, 0], pE = a * B.win(s('C04') - 0.3, s('C05') + 0.6), pF = a * gin(s('C05'));
    const cE = [C.j, rgba(C.j, 0.75), rgba(C.j, 0.55)], cF = [C.peri, rgba(C.peri, 0.75), rgba(C.peri, 0.55)];
    vE.forEach((v, i) => { V.v3(O, v, { color: C.j, alpha: pE, width: 6 }); V.lab(mul(1.3, v), `v${'₁₂₃'[i]}`, { px: 28, a: pE, color: C.j }); });
    uF.forEach((v, i) => { V.v3(O, v, { color: C.peri, alpha: pF, width: 6 }); V.lab(add(mul(1.3, v), [0, 0, 0.12]), `u${'₁₂₃'[i]}`, { px: 28, a: pF, color: C.peri }); });
    // 按 E 走
    { let p = [0, 0, 0]; const t0 = cue('C04', '三步v一'); [3, 2, -1].forEach((c, i) => { const q = smoother(prog(B.t, t0 + i * 1.0, t0 + i * 1.0 + 0.85)); if (q > 0) { V.v3(p, add(p, mul(c * q, vE[i])), { color: cE[i], alpha: pE * 0.9 + 0.1 * a, width: 4 }); } p = add(p, mul(c, vE[i])); }); }
    // 按 F 走
    { let p = [0, 0, 0]; const t0 = cue('C05', '要走八步'); [8, -5, 3].forEach((c, i) => { const q = smoother(prog(B.t, t0 + i * 1.0, t0 + i * 1.0 + 0.85)); if (q > 0) { V.v3(p, add(p, mul(c * q, uF[i])), { color: cF[i], alpha: pF, width: 4 }); } p = add(p, mul(c, uF[i])); }); }
    const tx = cue('C04', '到达');
    const [px, py] = V.pr(X); B.dot(px, py, 14, C.i, a * gin(tx)); ctag('(6, 4, 3)', px + 70, py - 30, { px: 30, a: a * gin(tx), color: C.i, font: F.serif });
    if (B.t > tx) B.burst(px, py, tx, C.i, { r1: 100, n: 12 }); if (B.t > cue('C05', '所以x在F')) B.burst(px, py, cue('C05', '所以x在F') - 0.6, C.peri, { r1: 120, n: 14 });
    odo(DX + 130, DY + 240, [3, 2, -1], prog(B.t, cue('C04', '所以x在E'), cue('C04', '所以x在E') + 1.6), C.j, a * gin(cue('C04', '所以x在E')), { lab: 'E 坐标' });
    odo(DX + 130, DY + 330, [8, -5, 3], prog(B.t, cue('C05', '所以x在F'), cue('C05', '所以x在F') + 1.6), C.peri, a * gin(cue('C05', '所以x在F')), { lab: 'F 坐标' });
    B.xcard('点没动，说明书换了 ⇒ 过渡矩阵 = 翻译词典', DX, DY - 360, 700, 70, a * gin(s('G01') + 0.6), C.gpt, 30);
  }

  // ════ 原题 + 翻译链 ════
  function shotChain() {
    const a0 = B.win(s('C03'), s('C04') - 0.2);
    if (a0 > 0) { B.qhead('2025–2026 期中 · 第 5 题', a0 * gin(s('C03') + 3)); texAt('EF', DX, DY + 60, 40, { alpha: a0 * gin(s('C03') + 3.6) }); }
    const a = B.win(s('C06') - 0.2, s('C08') - 0.1); if (a <= 0) return;
    const bx = [DX - 340, DX, DX + 340], by = DY - 120, labs = ['E 坐标', '标准坐标', 'F 坐标'], cols = [C.j, C.ink, C.peri];
    const ts = [s('C06') + 0.3, s('C06') + 1.2, s('C07') + 0.4];
    bx.forEach((x, i) => { const g = a * gin(ts[i]); B.card(x, by, 200, 100, g, cols[i]); ctag(labs[i], x, by, { px: 36, a: g, color: cols[i], font: F.serif }); });
    arrow(ctx, [bx[0] + 105, by], [bx[1] - 105, by], { color: C.j, alpha: a, grow: smooth(prog(B.t, ts[1] - 0.5, ts[1])), width: 5 });
    arrow(ctx, [bx[1] + 105, by], [bx[2] - 105, by], { color: C.peri, alpha: a, grow: smooth(prog(B.t, ts[2] - 0.4, ts[2])), width: 5 });
    ctag('× E', (bx[0] + bx[1]) / 2, by - 40, { px: 32, a: a * gin(ts[1]), color: C.j, font: F.serif });
    ctag('× F⁻¹', (bx[1] + bx[2]) / 2, by - 40, { px: 32, a: a * gin(ts[2]), color: C.peri, font: F.serif });
    texAt('xE', DX - 200, DY + 130, 36, { alpha: a * B.win(cue('C06', '因为E乘'), s('C07')) });
    ctag('= 3v₁ + 2v₂ − v₃', DX + 110, DY + 130, { px: 34, a: a * B.win(cue('C06', '因为E乘') + 0.6, s('C07')), color: C.ink, font: F.serif });
    const tS = cue('C07', '两步合起来');
    const gS = a * gin(tS);
    if (gS > 0) {
      const q = smoother(prog(B.t, tS, tS + 1.0));
      ctx.save(); ctx.globalAlpha = gS; ctx.strokeStyle = OK; ctx.lineWidth = 5; ctx.beginPath();
      const N = 40; for (let i = 0; i <= N * q; i++) { const th = Math.PI * (1 - i / N), x = DX + 340 * Math.cos(th), y = by + 60 + 150 * Math.sin(th); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      ctag('S = F⁻¹E', DX, by + 250, { px: 44, a: gS * gin(tS + 0.8), color: OK, font: F.serif });
    }
    texAt('chain', DX, DY + 260, 44, { alpha: a * gin(cue('C07', 'x的F坐标')) });
    ctag('从右往左读：先 E，再 F⁻¹', DX, DY + 350, { px: 32, a: a * gin(s('D02')), color: C.ds });
  }

  // ════ [F|E] → [I|S] ════
  function shotGJ() {
    const a = B.win(s('C08') - 0.2, s('G03') - 0.1); if (a <= 0) return;
    const fade = 1 - gin(s('C13') - 0.3);
    const o = { x: DX, y: DY - 120, px: 46, mode: 1, alpha: a * gin(cue('C08', '并排写')) * fade, labelHold: 0.9 };
    if (o.alpha > 0) {
      GJ.draw(ctx, B.t, o);
      const Lo = GJ.layout(o), bx = (Lo.mx(2) + Lo.mx(3)) / 2;
      ctx.save(); ctx.globalAlpha = o.alpha; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, Lo.ry(0) - Lo.rh * 0.5); ctx.lineTo(bx, Lo.ry(2) + Lo.rh * 0.5); ctx.stroke(); ctx.restore();
      const lab0 = 1 - gin(gjT[2] + 1.3);
      ctag('F', (Lo.mx(0) + Lo.mx(2)) / 2, Lo.ry(0) - Lo.rh * 1.0, { px: 38, a: o.alpha * lab0, color: C.peri, font: F.serif });
      ctag('E', (Lo.mx(3) + Lo.mx(5)) / 2, Lo.ry(0) - Lo.rh * 1.0, { px: 38, a: o.alpha * lab0, color: C.j, font: F.serif });
      const gD = o.alpha * gin(gjT[2] + 1.3);
      if (gD > 0) {
        ctag('I', (Lo.mx(0) + Lo.mx(2)) / 2, Lo.ry(0) - Lo.rh * 1.0, { px: 40, a: gD, color: C.ink, font: F.serif });
        ctag('S = F⁻¹E', (Lo.mx(3) + Lo.mx(5)) / 2, Lo.ry(0) - Lo.rh * 1.0, { px: 40, a: gD, color: OK, font: F.serif });
        ctx.save(); ctx.globalAlpha = gD; ctx.shadowColor = OK; ctx.shadowBlur = 24; ctx.strokeStyle = OK; ctx.lineWidth = 4; ctx.strokeRect(bx + 14, Lo.ry(0) - Lo.rh * 0.6, Lo.mx(5) - bx + Lo.cw * 0.5 - 14, Lo.rh * 3.2); ctx.restore();
        B.burst(Lo.mx(4), Lo.ry(1), gjT[2] + 1.3, OK, { r1: 220 });
      }
      ctag('只用 3 步！', DX + 360, DY + 110, { px: 32, a: o.alpha * gin(cue('C11', '只用了三步')), color: C.i });
      B.answer('Sans', DX, DY + 170, 40, o.alpha * gin(s('C12') + 0.4), { col: OK });
      ctag('比先求 F⁻¹ 再乘快多了', DX, DY + 320, { px: 30, a: o.alpha * gin(s('D03')), color: C.ds });
    }
    // 坐标
    const p2 = a * gin(s('C13') - 0.3);
    if (p2 > 0) {
      const xAct = p2 * (1 - gin(s('C15') - 0.3)), yAct = p2 * gin(s('C15') - 0.3) * (1 - gin(s('G02') - 0.2));
      texAt('Sans', DX - 260, DY - 200, 38, { alpha: p2 * (1 - gin(s('G02') - 0.2)) });
      if (xAct > 0) {
        texAt('SxE', DX + 200, DY - 200, 38, { alpha: xAct });
        const ts = ['第一行', '第二行', '第三行'].map(w => cue('C13', w));
        ['3 + 2 + 3 = 8', '−3 − 2 + 0 = −5', '3 + 4 − 4 = 3'].forEach((t, i) => ctag(t, DX, DY - 20 + i * 56, { px: 32, a: xAct * gin(ts[i]), color: C.ink }));
        odo(DX + 100, DY + 220, [8, -5, 3], prog(B.t, ts[2] + 1.6, ts[2] + 3.0), C.peri, xAct * gin(ts[2] + 1.6), { lab: 'F 坐标' });
        ctag('= 3D 里走出来的', DX + 100, DY + 310, { px: 30, a: xAct * gin(s('C14')), color: OK });
      }
      if (yAct > 0) {
        texAt('SyE', DX + 200, DY - 200, 38, { alpha: yAct });
        const ts = ['一减三', '负一加三', '一减六'].map(w => cue('C15', w));
        ['1 − 3 − 6 = −8', '−1 + 3 + 0 = 2', '1 − 6 + 8 = 3'].forEach((t, i) => ctag(t, DX, DY - 20 + i * 56, { px: 32, a: yAct * gin(ts[i]), color: C.ink }));
        odo(DX + 100, DY + 220, [-8, 2, 3], prog(B.t, cue('C15', '所以y'), cue('C15', '所以y') + 1.4), C.peri, yAct * gin(cue('C15', '所以y')), { lab: 'y 的 F 坐标' });
      }
      const g2 = p2 * gin(s('G02'));
      if (g2 > 0) { texAt('back', DX, DY - 60, 44, { alpha: g2, reveal: rv(s('G02') + 0.6, 4) }); B.stamp(DX + 330, DY + 130, true, gin(e('G02') - 0.6, 0.4), g2 * gin(e('G02') - 0.6), '✓ 自检'); }
    }
  }

  // ════ 约定对照 ════
  function shotConv() {
    const a = B.win(s('G03') - 0.2, s('C16a') - 0.1); if (a <= 0) return;
    const gL = a * gin(s('G03') + 0.4), gT = a * gin(cue('G03', '同济教材'));
    B.card(DX, DY - 220, 860, 150, gL, C.peri); ctag('Leon（英文卷）', DX - 300, DY - 270, { px: 28, a: gL, color: C.peri }); texAt('leon', DX, DY - 205, 38, { alpha: gL });
    B.card(DX, DY - 30, 860, 150, gT, C.k); ctag('同济', DX - 360, DY - 80, { px: 28, a: gT, color: C.k }); texAt('tj', DX, DY - 15, 38, { alpha: gT });
    const gP = a * gin(s('C16') + 0.4);
    B.answer('PS', DX, DY + 130, 48, gP, { col: OK }); B.burst(DX, DY + 130, s('C16') + 0.4, OK, { r1: 220 });
    B.xcard('答卷写明方向：F 坐标 = S × E 坐标', DX, DY + 250, 560, 70, a * gin(cue('C16', '保险起见')), C.i, 30);
  }

  // ════ 2024–25 Q6：多项式基的过渡矩阵 ════
  const neg = v => String(v).replace('-', '−');
  const GJ3 = [
    [[1, 2, 0, 1, 0, 0], [0, 1, 0, 0, 1, 0], [-1, 0, 1, 0, 0, 1]],
    [[1, 2, 0, 1, 0, 0], [0, 1, 0, 0, 1, 0], [0, 2, 1, 1, 0, 1]],
    [[1, 2, 0, 1, 0, 0], [0, 1, 0, 0, 1, 0], [0, 0, 1, 1, -2, 1]],
    [[1, 0, 0, 1, -2, 0], [0, 1, 0, 0, 1, 0], [0, 0, 1, 1, -2, 1]],
  ];
  const GJop = ['', 'R₃ + R₁', 'R₃ − 2R₂', 'R₁ − 2R₂'], GJrow = [-1, 2, 2, 0];
  function shotP3() {
    const a = B.win(s('C16a'), s('C16g') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C16b') - 0.4); if (A <= 0) return;
    B.qhead('2024–2025 期中 · 第 6 题', A);
    const polys = [['1 − x²', '(1, 0, −1)', C.i, '一减x平方'], ['x + 2', '(2, 1, 0)', C.j, 'x加二'], ['x²', '(0, 0, 1)', C.k, '；x平方']];
    const up = smoother(prog(B.t, s('C16c') - 0.3, s('C16c') + 0.4));
    polys.forEach(([p, v, col, cu], i) => {
      const g = A * gin(cue('C16b', cu)), y = lerp(DY - 250 + i * 70, DY - 330, up), x = lerp(DX, DX - 280 + i * 280, up);
      ctag(up < 0.5 ? `${p}  →  ${v}` : `${p} → ${v}`, x, y, { px: lerp(36, 26, up), a: g, color: col, font: F.serif });
    });
    const tGJ = s('C16d') + 1.2, st = Math.max(0, Math.min(3, Math.floor((B.t - tGJ) / 1.8) + 1));
    const gF = A * gin(s('C16c') + 0.2) * (1 - gin(s('C16e') - 0.2));
    const aug = gin(s('C16d') + 0.2);
    const rows = aug > 0.5 ? GJ3[B.t < tGJ ? 0 : st] : GJ3[0].map(r => r.slice(0, 3));
    const colC = j => j < 3 ? [C.i, C.j, C.k][j] : C.ink;
    const M = B.mat(DX + (aug > 0.5 ? 0 : 0), DY - 50, rows, { px: aug > 0.5 ? 40 : 46, a: gF, bar: aug > 0.5 ? 3 : null,
      cell: (i, j) => ({ txt: neg(rows[i][j]), col: aug > 0.5 ? (i === GJrow[st] && B.t >= tGJ ? C.peri : (j < 3 ? C.ink : C.j)) : colC(j) }) });
    ctag(aug > 0.5 ? '[F | I]' : 'F =', DX - M.w / 2 - 90, DY - 50, { px: 32, a: gF, color: C.ink, font: F.serif });
    if (aug > 0.5 && st > 0 && B.t >= tGJ) ctag(GJop[st], DX, DY + 70, { px: 28, a: gF, color: C.peri, font: F.serif });
    const gd = A * B.win(s('C16c') + 0.8, e('C16c') + 0.2);
    ctag('det F = 1 ≠ 0  ⇒  无关  ⇒  张成 P₃', DX, DY + 140, { px: 32, a: gd, color: OK });
    const gS = A * gin(s('C16e') + 0.1) * (1 - gin(s('C16f') - 0.1) * 0.0);
    B.answer('S2', DX, DY - 40, 42, gS, { col: OK }); B.burst(DX, DY - 40, s('C16e') + 0.3, OK, { r1: 240 });
    const gc = A * gin(s('G03a') + 0.2) * (1 - gin(s('C16f')));
    ctag('S · (0, 1, 0) = (−2, 1, −2)', DX, DY + 140, { px: 30, a: gc, color: C.ink, font: F.serif });
    ctag('−2(1 − x²) + (x + 2) − 2x² = x  ✓', DX, DY + 195, { px: 30, a: gc * gin(cue('G03a', '负二倍')), color: OK, font: F.serif });
    B.xcard('Leon：S = F⁻¹　　同济：P = F', DX, DY + 170, 620, 76, A * gin(s('C16f') + 0.2), C.k, 32);
  }

  // ════ 扩写二：17–18 Q7；20–21 Q5；15–16 Q3（倒着问）════
  const ng = v => String(v).replace('-', '−');
  function elim(A, S, T, ops, MY, { bar = 3, fin = null, lab = '[U | V]' } = {}) {
    let k = 0; for (let q = 1; q < S.length; q++) if (B.t >= T[q]) k = q;
    const prev = k ? S[k - 1] : S[0], fresh = k ? gin(T[k], 0.5) : 1, gf = fin ? gin(fin) : 0;
    const M = B.mat(DX + 30, MY, S[k], { px: 36, a: A, bar, cell: (i, j) => {
      const ch = S[k][i][j] !== prev[i][j];
      return { txt: ng(S[k][i][j]), col: ch && fresh < 1 ? C.j : (j >= bar && gf > 0 ? OK : (j < bar ? C.ink : C.i)), a: ch ? 0.3 + 0.7 * fresh : 1 };
    } });
    ctag(lab, DX + 30, MY - M.h / 2 - 28, { px: 26, a: A, color: C.peri, font: F.serif });
    if (k > 0 && ops[k]) ops[k].forEach(([i, txt]) => ctag(txt, DX + 30 - M.w / 2 - 90, M.cell(i, 0)[1], { px: 25, a: A * gin(T[k] - 0.4) * (1 - gin(T[k] + 4.0)), color: C.j, font: F.serif }));
    return M;
  }
  function shotR2() {
    // ── 17–18 Q7 ──
    let a = B.win(s('C16g'), s('C16m') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C16g') + 0.4);
      B.qhead('2017–2018 期中 · 第 7 题 · 15 分', A);
      const g0 = A * (1 - gin(s('C16h')));
      ctag('v₁ = (4, 6, 7)　v₂ = (0, 1, 1)　v₃ = (0, 1, 2)', DX, DY - 160, { px: 30, a: g0, color: C.i, font: F.serif });
      ctag('u₁ = (1, 1, 1)　u₂ = (1, 2, 2)　u₃ = (2, 3, 4)', DX, DY - 100, { px: 30, a: g0, color: C.j, font: F.serif });
      ctag('x = 2v₁ + 3v₂ − 4v₃', DX, DY - 30, { px: 32, a: g0 * gin(cue('C16g', '再求x')), color: C.ink, font: F.serif });
      const Ab = A * gin(s('C16h') + 0.2);
      if (Ab > 0) {
        const S = [
          [[1, 1, 2, 4, 0, 0], [1, 2, 3, 6, 1, 1], [1, 2, 4, 7, 1, 2]],
          [[1, 1, 2, 4, 0, 0], [1, 2, 3, 6, 1, 1], [0, 0, 1, 1, 0, 1]],
          [[1, 1, 2, 4, 0, 0], [0, 1, 1, 2, 1, 1], [0, 0, 1, 1, 0, 1]],
          [[1, 1, 2, 4, 0, 0], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1]],
          [[1, 0, 0, 1, -1, -2], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1]],
        ];
        const T = [-1, cue('C16i', '左边得到零、零') , cue('C16i', '第二行减第一行') + 0.8, cue('C16j', '第二行减第三行') + 0.8, cue('C16j', '最后') + 1.6];
        const ops = [null, [[2, 'R₃ − R₂']], [[1, 'R₂ − R₁']], [[1, 'R₂ − R₃']], [[0, 'R₁ − R₂ − 2R₃']]];
        const M = elim(Ab, S, T, ops, DY - 200, { fin: s('C16k') });
        ctag('左：u 的列　|　右：v 的列', DX + 30, DY - 200 + M.h / 2 + 32, { px: 24, a: Ab * B.win(s('C16h') + 0.5, s('C16i')), color: C.ink });
        if (B.t > s('C16k')) {
          const g = Ab * gin(s('C16k') + 0.3), [x0, y0] = M.cell(0, 3), [x2] = M.cell(0, 5);
          ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = OK; ctx.lineWidth = 3; ctx.strokeRect(x0 - 30, y0 - 28, x2 - x0 + 60, M.h - 8); ctx.restore();
          ctag('= S', x2 + 80, DY - 200, { px: 34, a: g, color: OK, font: F.serif });
          B.burst(x2 + 80, DY - 200, s('C16k') + 0.4, OK, { r1: 120, n: 12 });
        }
        const gl = Ab * gin(s('C16l'));
        ctag('S · (2, 3, −4)', DX, DY - 10, { px: 30, a: gl, color: C.ink, font: F.serif });
        ['2 − 3 + 8 = 7', '2 + 3 = 5', '2 − 4 = −2'].forEach((t, q) => ctag(t, DX - 260 + q * 260, DY + 50, { px: 28, a: Ab * gin(cue('C16l', ['二减三加八', '二加三', '二减四'][q])), color: C.i, font: F.serif }));
        const gx = Ab * gin(cue('C16l', '所以u坐标'));
        B.card(DX, DY + 130, 520, 74, gx * 0.95, OK);
        ctag('[x]ᵤ = (7, 5, −2)', DX, DY + 130, { px: 34, a: gx, color: OK, font: F.serif });
        B.burst(DX, DY + 130, cue('C16l', '所以u坐标') + 0.3, OK, { r1: 200 });
        ctag('7u₁ + 5u₂ − 2u₃ = (8, 11, 9) = 2v₁ + 3v₂ − 4v₃', DX, DY + 215, { px: 27, a: Ab * B.win(s('G03b') + 0.3, s('C16m')), color: C.gpt, font: F.serif });
        B.stamp(DX + 300, DY + 40, true, gin(e('G03b') - 0.8, 0.4), Ab * gin(e('G03b') - 0.8), '✓ 15 分');
      }
    }
    // ── 20–21 Q5 ──
    a = B.win(s('C16m'), s('C16q') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C16m') + 0.4);
      B.qhead('2020–2021 期中 · 第 5 题 · 15 分', A);
      const g1 = A * (1 - gin(s('C16o')));
      const MV = B.mat(DX - 200, DY - 150, [[1, 1, 0], [0, 1, 1], [1, 0, 1]], { px: 34, a: g1, cell: () => ({ col: C.i }) });
      const MU = B.mat(DX + 220, DY - 150, [[2, 1, 2], [3, 2, 0], [1, 0, 3]], { px: 34, a: g1, cell: () => ({ col: C.j }) });
      ctag('V =', DX - 200 - MV.w / 2 - 50, DY - 150, { px: 30, a: g1, color: C.i, font: F.serif });
      ctag('U =', DX + 220 - MU.w / 2 - 50, DY - 150, { px: 30, a: g1, color: C.j, font: F.serif });
      ctag('det V = 2', DX - 200, DY - 40, { px: 32, a: g1 * gin(cue('C16n', 'V的行列式')), color: C.i, font: F.serif });
      ctag('det U = −1', DX + 220, DY - 40, { px: 32, a: g1 * gin(cue('C16n', 'U的行列式')), color: C.j, font: F.serif });
      B.xcard('都 ≠ 0 → 各自三个向量无关 → 都是 R³ 的基', DX, DY + 60, 760, 70, g1 * gin(cue('C16n', '都不为零')), OK, 29);
      const Ab = A * gin(s('C16o') + 0.2);
      if (Ab > 0) {
        const S = [
          [[2, 1, 2, 1, 1, 0], [3, 2, 0, 0, 1, 1], [1, 0, 3, 1, 0, 1]],
          [[1, 0, 3, 1, 0, 1], [3, 2, 0, 0, 1, 1], [2, 1, 2, 1, 1, 0]],
          [[1, 0, 3, 1, 0, 1], [0, 2, -9, -3, 1, -2], [0, 1, -4, -1, 1, -2]],
          [[1, 0, 3, 1, 0, 1], [0, 1, -4, -1, 1, -2], [0, 2, -9, -3, 1, -2]],
          [[1, 0, 3, 1, 0, 1], [0, 1, -4, -1, 1, -2], [0, 0, 1, 1, 1, -2]],
          [[1, 0, 0, -2, -3, 7], [0, 1, 0, 3, 5, -10], [0, 0, 1, 1, 1, -2]],
        ];
        const T = [-1, cue('C16o', '换到最上面') + 0.5, cue('C16p', '第三行减两倍第一行') + 0.5, cue('C16p', '交换第二') + 0.6, cue('C16p', '再乘负一') + 0.4, cue('C16p', '往上回代') + 0.6];
        const ops = [null, [[0, 'R₁ ↔ R₃']], [[1, 'R₂ − 3R₁'], [2, 'R₃ − 2R₁']], [[1, 'R₂ ↔ R₃']], [[2, '−(R₃ − 2R₂)']], [[1, 'R₂ + 4R₃'], [0, 'R₁ − 3R₃']]];
        const M = elim(Ab, S, T, ops, DY - 190, { fin: cue('C16p', '右边得到S') });
        if (B.t > cue('C16p', '右边得到S')) {
          const g = Ab * gin(cue('C16p', '右边得到S')), [x0, y0] = M.cell(0, 3), [x2] = M.cell(0, 5);
          ctx.save(); ctx.globalAlpha = g; ctx.strokeStyle = OK; ctx.lineWidth = 3; ctx.strokeRect(x0 - 30, y0 - 28, x2 - x0 + 60, M.h - 8); ctx.restore();
          ctag('= S', x2 + 80, DY - 190, { px: 34, a: g, color: OK, font: F.serif });
          B.burst(x2 + 80, DY - 190, cue('C16p', '右边得到S') + 0.3, OK, { r1: 120, n: 12 });
        }
        ctag('不用分数：先找开头是 1 的行', DX, DY + 10, { px: 28, a: Ab * B.win(cue('C16o', '换到最上面'), e('C16o') + 0.3), color: C.free });
        const gc = Ab * gin(s('G03c') + 0.3);
        ctag('−2u₁ + 3u₂ + u₃', DX - 150, DY + 60, { px: 30, a: gc, color: C.gpt, font: F.serif });
        ctag('= (−4 + 3 + 2, −6 + 6 + 0, −2 + 0 + 3) = (1, 0, 1) = v₁', DX - 20, DY + 120, { px: 24, a: Ab * gin(cue('G03c', '算出来')), color: C.gpt, font: F.serif });
        B.stamp(DX + 300, DY + 210, true, gin(cue('G03c', '对') + 0.2, 0.4), Ab * gin(cue('G03c', '正好是v一')), '✓ 15 分');
      }
    }
    // ── 15–16 Q3：倒着问 ──
    a = B.win(s('C16q'), s('C17') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C16q') + 0.4);
      B.qhead('2015–2016 · 第 3 题 · 倒着问', A);
      ctag('v₁ = (2, 6)　v₂ = (1, 4)', DX - 120, DY - 200, { px: 32, a: A, color: C.i, font: F.serif });
      const MS = B.mat(DX + 280, DY - 200, [[4, 1], [2, 1]], { px: 38, a: A, cell: (i, j) => ({ col: j ? C.j : C.k }) });
      ctag('S =', DX + 280 - MS.w / 2 - 50, DY - 200, { px: 32, a: A, color: C.ink, font: F.serif });
      const gr = A * gin(s('C16r'));
      ctag('S 的每一列 = 对应的 v 在 u 下的坐标', DX, DY - 100, { px: 30, a: gr, color: C.peri });
      if (B.t > cue('C16r', '第一列四')) {
        const [x, y] = MS.cell(0, 0); ctx.save(); ctx.globalAlpha = A * gin(cue('C16r', '第一列四')); ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.strokeRect(x - 24, y - 26, 48, MS.h - 8); ctx.restore();
      }
      if (B.t > cue('C16r', '第二列一')) {
        const [x, y] = MS.cell(0, 1); ctx.save(); ctx.globalAlpha = A * gin(cue('C16r', '第二列一')); ctx.strokeStyle = C.j; ctx.lineWidth = 3; ctx.strokeRect(x - 24, y - 26, 48, MS.h - 8); ctx.restore();
      }
      ctag('v₁ = 4u₁ + 2u₂', DX - 200, DY - 30, { px: 34, a: A * gin(cue('C16r', '第一列四') + 0.5), color: C.k, font: F.serif });
      ctag('v₂ = u₁ + u₂', DX + 200, DY - 30, { px: 34, a: A * gin(cue('C16r', '第二列一') + 0.5), color: C.j, font: F.serif });
      ctag('u₂ = v₂ − u₁　⇒　v₁ = 2u₁ + 2v₂', DX, DY + 40, { px: 30, a: A * gin(s('C16s') + 0.4), color: C.ink, font: F.serif });
      ctag('u₁ = (v₁ − 2v₂) / 2 = ((2 − 2)/2, (6 − 8)/2)', DX, DY + 100, { px: 28, a: A * gin(cue('C16s', '所以u一')), color: C.ink, font: F.serif });
      const gx = A * gin(cue('C16s', '得零、负一'));
      B.card(DX, DY + 180, 600, 76, gx * 0.95, OK);
      ctag('u₁ = (0, −1)　u₂ = (1, 5)', DX, DY + 180, { px: 34, a: gx, color: OK, font: F.serif });
      B.burst(DX, DY + 180, cue('C16s', '得一、五'), OK, { r1: 200 });
      ctag('4(0, −1) + 2(1, 5) = (2, 6) ✓　(0, −1) + (1, 5) = (1, 4) ✓', DX, DY + 260, { px: 26, a: A * gin(s('G03d') + 0.3), color: C.gpt, font: F.serif });
    }
  }

  function shotOutro() {
    const a = B.win(s('C17'), 1e9); if (a <= 0) return;
    const g = a * gin(s('C17'));
    B.card(DX, DY - 60, 880, 300, g, C.peri);
    ctag('套路卡 ⑩', DX - 330, DY - 170, { px: 30, a: g, color: C.peri, font: F.serif });
    const ts = [s('C17') + 0.3, cue('C17', '计算用'), cue('C17', '新坐标等于'), cue('C17', '最后用')];
    ['S = F⁻¹E：从右往左读（先进标准，再出到 F）', '计算：[F | E] → [I | S]', '新坐标 = S × 旧坐标', '自检：F × 新坐标 = 原向量'].forEach((l, k) =>
      ctag(l, DX - 400, DY - 110 + k * 54, { px: 32, a: a * gin(ts[k]), color: C.ink, align: 'left' }));
    B.burst(DX + 380, DY - 170, s('C17') + 0.2, C.peri, { r1: 100, n: 12 });
    B.xcard('下一段 → RREF 反推', DX, DY + 200, 440, 70, a * gin(s('D05')), C.ds, 30);
  }

  function papers() {
    B.paper(EX, 'y2526_q5', { t0: s('C03') + 0.2, dock: s('C03') + 3.0, out: s('C16a') - 0.3 });
    B.paper(EX, 'y2425_q6', { t0: s('C16a') + 0.2, dock: s('C16b') - 0.5, out: s('C16g') - 0.3 });
    B.paper(EX, 'y1718_q7', { t0: s('C16g') + 0.2, dock: cue('C16g', '给了v一') , out: s('C16m') - 0.3 });
    B.paper(EX, 'y2021_q5', { t0: s('C16m') + 0.2, dock: cue('C16m', '给了两组') , out: s('C16q') - 0.3 });
    B.paper(EX, 'y1516_q3', { t0: s('C16q') + 0.2, dock: cue('C16q', '已知v一') , out: s('C17') - 0.3 });
  }

  // ── 扩写：逐步算式小卡 ──
  const XC = [
    ['C04a', DY - 330, ['3·(1, 1, 1) + 2·(2, 3, 2) − (1, 5, 4)', '= (6, 4, 3)'], C.i],
    ['C09a', DY + 300, ['左：(0, 1, 1)　　右：(0, 1, 4)'], C.i],
    ['C10a', DY + 300, ['左：(1, 0, 0)　　右：(1, 1, −3)'], C.i],
    ['C11a', DY + 300, ['左：(0, 1, 0)　　右：(−1, −1, 0)'], C.i],
  ];
  function extras() {
    for (const [id, y, rows, col] of XC) {
      const g = B.win(s(id), e(id) + 0.15); if (g <= 0) continue;
      const w = Math.max(...rows.map(r => [...r].reduce((q, ch) => q + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 30 : 16), 0))) + 80, h = rows.length * 44 + 30;
      B.card(DX, y, Math.min(880, w), h, g * 0.95, col);
      rows.forEach((r, i) => ctag(r, DX, y - (rows.length - 1) * 22 + i * 44, { px: 29, a: g * gin(s(id) + 0.3 + i * 1.4), color: col === OK ? OK : C.ink, font: F.serif }));
    }
  }

  function draw(t) {
    B.frame(t, D => { shotGlasses(); shotChain(); show3D(D); shotGJ(); shotConv(); shotP3(); shotR2(); shotOutro(); papers(); extras(); });
  }
  return { TL, draw };
}
