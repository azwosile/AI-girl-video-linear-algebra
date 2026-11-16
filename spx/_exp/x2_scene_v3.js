// 特别篇 · 期中速成 x2：初等矩阵、LU 与逆。
// 分镜：口诀（I → E）→ 18–19 Q2 原题 → 印章 E₁E₂E₃ 盖在 A 上 → 用过的印章排成 E₃E₂E₁A → 逆 = 变号 → 倍数光点飞进 L
//       → LU 验第三行 → [A|I] 高斯–约当七步 → 验一行 → x = A⁻¹b
//       → 23–24 Q5：边消元边把 lᵢⱼ 飞进 L（符号陷阱）→ 20–21 Q2：左乘 / 右乘（A⁻¹ 小签飞向左右）→ 套路卡。
import { base, loadExam, SBoard, MBoard, C, F, lerp, prog, smooth, smoother, outCubic, outBack, DX, DY, OK, arrow, rgba, fmtNum } from '../../sp/common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_proud', 'ds_shock', 'ds_think', 'ds_happy', 'gpt_point', 'gpt_explain', 'gpt_cross'] };

export async function setup(R) {
  const EX = await loadExam(['y1819_q2', 'y2324_q5', 'y2021_q2', 'y2425_q5', 'y2425_q3']);
  const B = base(R, {
    assets, label: '特别篇 · 期中速成', title: '初等矩阵 · LU · 逆', hi: 4, en: 'ELEMENTARY · LU · INVERSE', titlePx: 92,
    titleEnd: () => B.L('C03').s,
    pre: { C03: 0.8, C05: 0.4, C10: 0.6, C12: 0.4, C15: 0.8, C19: 1.0, C24: 1.0, C28: 0.6, C30c: 1.0, D06a: 0.4, C30k: 0.6, C30l: 1.0, C31: 0.8 },
    post: { C02: 0.8, C06: 1.6, C07: 1.6, C08: 1.8, C09: 0.8, C13: 2.0, C14: 0.8, C16: 1.5, C17: 2.5, C18: 1.0, C22: 1.5, C23: 0.8, G03: 0.6, C27: 0.8, C30: 1.0, C30c: 1.0, C30d: 1.2, C30e: 1.0, C30f: 1.4, D06a: 0.4, C30g: 1.2, C30h: 1.2, C30i: 1.0, C30j: 1.2, G03b: 1.0, C30k: 1.4, C30m: 1.2, C30n: 1.2, D06b: 0.6, C32: 1.0 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const s = id => L(id).s, e = id => L(id).e;

  // ════ 时间点 ════
  const tE = [cue('C05', '就得到E一'), s('C07') + 0.3, s('C08') + 0.3];        // 印章出现
  const tS = [s('C06') + 0.8, cue('C07', '第三行变成') - 0.4, cue('C08', 'E三的') + 1.6]; // 盖章
  const gjT = [s('C16') + 0.3, s('C16') + 1.6, s('C16') + 2.9, cue('C16', '接着') + 0.6, cue('C17', '第二行减去'), cue('C17', '第一行减去'), cue('C17', '最后') + 0.3];
  const luT = [cue('C20', '第二行的倍数') + 1.4, s('C22') + 0.4, cue('C22', '消完第一列') + 0.6];
  const flyT = [cue('C21', '所以L的第二行'), cue('C22', '填三'), cue('C22', '填负二')];

  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', cue('C02', '用它左乘'), 0.3);
  TL.sfx('whoosh', s('C03') + 0.2, 0.35); TL.sfx('stamp', s('C03') + 2.5, 0.35);
  tE.forEach(x => TL.sfx('pop', x, 0.25)); tS.forEach(x => TL.sfx('stamp', x + 0.7 * 1.2, 0.4));
  TL.sfx('sting', s('D02'), 0.3); TL.sfx('ding_hi', cue('C09', '最后U'), 0.3);
  TL.sfx('pop', s('C10') + 0.5, 0.3); TL.sfx('pop', s('C12') + 0.5, 0.3);
  [0, 1, 2].forEach(i => TL.sfx('laser', cue('C13', '看光点') + 0.6 + i * 0.9, 0.25)); TL.sfx('ding_hi', cue('C13', 'L是单位'), 0.3);
  TL.sfx('check', e('C14') - 0.6, 0.3);
  gjT.forEach(x => TL.sfx('pluck', x, 0.25)); TL.sfx('shimmer', s('D04'), 0.35); TL.sfx('check', e('G02') - 0.5, 0.3); TL.sfx('ding_hi', cue('C18', '所以x'), 0.35);
  TL.sfx('whoosh', s('C19') + 0.2, 0.35); TL.sfx('stamp', s('C19') + 2.5, 0.35);
  luT.forEach(x => TL.sfx('pluck', x, 0.25)); flyT.forEach(x => TL.sfx('laser', x, 0.25)); TL.sfx('buzz', s('G03') + 0.3, 0.22);
  TL.sfx('whoosh', s('C24') + 0.2, 0.35); TL.sfx('stamp', s('C24') + 2.5, 0.35);
  TL.sfx('pop', s('C25') + 0.4, 0.3); TL.sfx('ding_hi', s('C27') + 0.3, 0.3); TL.sfx('buzz', s('C29') + 0.2, 0.25); TL.sfx('ding_hi', cue('C30', '再右乘'), 0.3);
  TL.sfx('bell_soft', s('C31'), 0.35); TL.sfx('shimmer', s('D07'), 0.35);
  // 扩写二 sfx
  TL.sfx('whoosh', s('C30c') + 0.2, 0.3); TL.sfx('pop', cue('C30d', '第二行减三倍') + 0.5, 0.3); TL.sfx('pop', s('C30e') + 1.5, 0.3);
  TL.sfx('pluck', s('C30f') + 0.4, 0.3); TL.sfx('buzz', cue('C30f', '注意那个负一'), 0.2); TL.sfx('sting', s('D06a') + 0.2, 0.25);
  [cue('C30g', '第二行') + 0.6, s('C30h') + 0.5, cue('C30h', '再加上') + 0.5].forEach(x => TL.sfx('pop', x, 0.3));
  [cue('C30i', '第三行除以三'), cue('C30j', '第二行减'), cue('C30j', '第一行减去')].forEach(x => TL.sfx('tick', x + 0.3, 0.3));
  TL.sfx('check', cue('G03b', '正是B'), 0.3); TL.sfx('ding_hi', cue('C30k', '有两个非零行'), 0.3); TL.sfx('impact', cue('C30k', '一整个平面'), 0.3);
  TL.sfx('whoosh', s('C30l') + 0.2, 0.3); TL.sfx('swoosh_soft', cue('C30m', '第一、三行') + 0.4, 0.3); TL.sfx('swoosh_soft', cue('C30m', '第四、五行') + 0.4, 0.3);
  TL.sfx('stamp', cue('C30m', '非奇异'), 0.35); TL.sfx('impact', cue('C30n', '所以A的逆') + 0.2, 0.35); TL.sfx('shimmer', s('D06b'), 0.3);

  // ════ 开场：I → E ════
  function shotIntro() {
    const a = B.win(s('C02'), s('C03') + 0.1); if (a <= 0) return;
    const ch = smooth(prog(B.t, cue('C02', '就是对单位') + 0.5, cue('C02', '就是对单位') + 1.3));
    const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    B.mat(DX - 230, DY - 60, I, { px: 52, a, cell: (i, j) => (i === 1 && j === 0) ? { txt: ch > 0.5 ? '−3' : '0', col: ch > 0.5 ? C.peri : C.ink } : null });
    ctag(ch > 0.5 ? 'E' : 'I', DX - 230, DY - 230, { px: 48, a, color: ch > 0.5 ? C.peri : C.ink, font: F.serif });
    ctag('R₂ − 3R₁', DX - 230, DY + 110, { px: 32, a: a * gin(cue('C02', '就是对单位') + 0.2), color: C.peri });
    B.burst(DX - 230, DY - 60, cue('C02', '就是对单位') + 0.9, C.peri, { r1: 120 });
    const g = a * gin(cue('C02', '用它左乘'));
    arrow(ctx, [DX - 40, DY - 60], [DX + 90, DY - 60], { color: C.peri, width: 5, head: 18, alpha: g, grow: gin(cue('C02', '用它左乘'), 0.6) });
    B.card(DX + 250, DY - 60, 320, 120, g, C.peri);
    ctag('左乘 E', DX + 250, DY - 85, { px: 32, a: g, color: C.peri, font: F.serif });
    ctag('= 对 A 做同一个行变换', DX + 250, DY - 35, { px: 24, a: g, color: C.ink });
  }

  // ════ 18–19 Q2 ════
  const MA = new SBoard([[1, 0, 1], [3, 3, 4], [2, 2, 3]], { aug: false });
  const dS = 1.2;
  MA.add(tS[0] + 0.7 * dS, tS[0] + 0.7 * dS + 1.4, 1, 0, -3);
  MA.add(tS[1] + 0.7 * dS, tS[1] + 0.7 * dS + 1.4, 2, 0, -2);
  MA.add(tS[2] + 0.7 * dS, tS[2] + 0.7 * dS + 1.4, 2, 1, -2 / 3);
  const Es = [[[1, 0, 0], [-3, 1, 0], [0, 0, 1]], [[1, 0, 0], [0, 1, 0], [-2, 0, 1]], [[1, 0, 0], [0, 1, 0], [0, -2 / 3, 1]]];
  const Ek = [[1, 0], [2, 0], [2, 1]];
  const mult = [3, 2, 2 / 3];

  function shotQ1() {
    const a = B.win(s('C03'), s('C19') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C03', 'A的三行') + 0.2); if (A <= 0) return;
    B.qhead('2018–2019 期中 · 第 2 题', A);
    // ── (a) 印章 ──
    const pA = A * (1 - gin(s('C10') - 0.3));
    if (pA > 0) {
      texAt('order', DX, DY - 330, 44, { alpha: pA * gin(s('C04')), cls: { e1: 1, e2: 1, e3: 1 } });
      MA.draw(ctx, B.t, { x: DX + 170, y: DY - 80, px: 50, mode: 1, alpha: pA, labelHold: 1.0 });
      ctag(cue('C09', '最后U') < B.t ? 'U' : 'A', DX + 170, DY - 230, { px: 44, a: pA, color: cue('C09', '最后U') < B.t ? OK : C.ink, font: F.serif });
      for (let k = 0; k < 3; k++) {
        const ga = pA * gin(tE[k]); if (ga <= 0) continue;
        const sm = prog(B.t, tS[k], tS[k] + dS), back = smoother(prog(B.t, tS[k] + dS + 0.2, tS[k] + dS + 1.0));
        const home = [DX - 280, DY - 80], hit = [DX + 120, DY - 80], park = [DX + 40 - k * 190, DY + 210];
        let x, y, kk = 1;
        if (sm <= 0) { x = home[0]; y = home[1]; }
        else if (back <= 0) { const m = B.stampMove(home, hit, sm); x = m.x; y = m.y; kk = m.k; }
        else { x = lerp(hit[0], park[0], back); y = lerp(hit[1], park[1], back); kk = lerp(1, 0.6, back); }
        const px = 36 * kk, [r, c] = Ek[k];
        B.card(x, y, 230 * kk, 190 * kk, ga * (sm > 0 && sm < 1 ? 0.95 : 0.85), C.peri);
        B.mat(x, y + 8 * kk, Es[k], { px, a: ga, cell: (i, j) => (i === r && j === c) ? { col: C.peri } : { a: 0.7 } });
        ctag(`E${'₁₂₃'[k]}`, x, y - 120 * kk, { px: 34 * kk, a: ga, color: C.peri, font: F.serif });
      }
      // 用过的印章：E₃ E₂ E₁ A
      const gO = pA * gin(s('G01'));
      if (gO > 0) {
        ctag('A', DX + 250, DY + 210, { px: 44, a: gO, color: C.ink, font: F.serif });
        arrow(ctx, [DX + 40, DY + 330], [DX - 340, DY + 330], { color: C.gpt, width: 4, head: 16, alpha: gO, grow: gin(s('G01'), 0.8) });
        ctag('先做的贴着 A → 越往左越晚', DX - 150, DY + 370, { px: 26, a: gO, color: C.gpt });
      }
      B.burst(DX + 170, DY - 80, cue('C09', '最后U'), OK, { r1: 220 });
    }
    // ── (b) 逆 → L ──
    const pB = A * B.win(s('C10') - 0.2, s('C15') - 0.3);
    if (pB > 0) {
      const flip = k => smooth(prog(B.t, cue('C10', '负三变成') + k * 0.5, cue('C10', '负三变成') + 0.6 + k * 0.5));
      const ex = [DX - 330, DX - 80, DX + 170];
      const cells = [];
      for (let k = 0; k < 3; k++) {
        const g = pB * gin(s('C10') + 0.3 + k * 0.2), f = flip(k), [r, c] = Ek[k];
        const sc = Math.abs(Math.cos(Math.PI * f));             // 翻牌
        const M = B.mat(ex[k], DY - 150, Es[k], { px: 34, a: g, cell: (i, j) => (i === r && j === c) ? { txt: f > 0.5 ? fmtNum(mult[k]) : fmtNum(-mult[k]), col: f > 0.5 ? C.j : C.peri, a: f > 0.4 && f < 0.6 ? sc : 1 } : { a: 0.7 } });
        ctag(f > 0.5 ? `E${'₁₂₃'[k]}⁻¹` : `E${'₁₂₃'[k]}`, ex[k], DY - 270, { px: 34, a: g, color: f > 0.5 ? C.j : C.peri, font: F.serif });
        cells.push(M.cell(r, c));
      }
      ctag('“减三倍” ⇄ “加回三倍”', DX - 80, DY - 30, { px: 30, a: pB * gin(s('C11')) * (1 - smoother(prog(B.t, s('C14'), s('C14') + 0.5))), color: C.ink });
      // L
      const gL = pB * gin(s('C12')), up = smoother(prog(B.t, s('C14'), s('C14') + 0.8)), LY = DY + 220 - 150 * up;
      texAt('LUeq', DX - 80, DY + 60, 40, { alpha: gL * (1 - up) });
      const tf = k => cue('C13', '看光点') + 0.6 + k * 0.9;
      const LM = [[1, 0, 0], [3, 1, 0], [2, 2 / 3, 1]];
      const LL = B.mat(DX - 80, LY, LM, { px: 46, a: gL, cell: (i, j) => { const k = Ek.findIndex(q => q[0] === i && q[1] === j); if (k >= 0) return { a: gin(tf(k) + 0.6), col: C.j }; return i < j ? { a: 0.5 } : null; } });
      for (let k = 0; k < 3; k++) { B.fly(cells[k], LL.cell(...Ek[k]), prog(B.t, tf(k), tf(k) + 0.7), C.j, { txt: fmtNum(mult[k]), px: 30 }); B.burst(...LL.cell(...Ek[k]), tf(k) + 0.7, C.j, { r1: 70, n: 10 }); }
      ctag('单位下三角', DX + 200, LY, { px: 30, a: gL * gin(cue('C13', 'L是单位')), color: C.j });
      ctag('L', DX - 250, LY, { px: 46, a: gL, color: C.j, font: F.serif });
      // 验第三行
      const g14 = pB * gin(s('C14') + 0.3) * (1 - gin(s('C14a')));
      if (g14 > 0) { B.card(DX - 40, DY + 250, 760, 90, g14 * 0.95, C.i); texAt('row3', DX - 40, DY + 250, 34, { alpha: g14, reveal: rv(s('C14') + 0.6, 4) }); B.stamp(DX + 330, DY + 70, true, gin(e('C14') - 0.6, 0.4), g14 * gin(e('C14') - 0.6)); }
    }
    // ── (c) [A|I] ──
    const pC = A * B.win(s('C15') - 0.2, s('C18') - 0.3);
    if (pC > 0) {
      texAt('gj', DX, DY - 320, 44, { alpha: pC });
      const o = { x: DX, y: DY - 60, px: 44, mode: 1, alpha: pC * gin(s('C15') + 1.0), labelHold: 0.8 };
      GJ.draw(ctx, B.t, o);
      const Lo = GJ.layout(o), bx = (Lo.mx(2) + Lo.mx(3)) / 2;
      ctx.save(); ctx.globalAlpha = o.alpha; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, Lo.ry(0) - Lo.rh * 0.5); ctx.lineTo(bx, Lo.ry(2) + Lo.rh * 0.5); ctx.stroke(); ctx.restore();
      const gD = pC * gin(s('D04'));
      if (gD > 0) { ctx.save(); ctx.globalAlpha = gD; ctx.shadowColor = OK; ctx.shadowBlur = 24; ctx.strokeStyle = OK; ctx.lineWidth = 4; ctx.strokeRect(bx + 14, Lo.ry(0) - Lo.rh * 0.6, Lo.mx(5) - bx + Lo.cw * 0.5, Lo.rh * 3.2); ctx.restore(); ctag('A⁻¹', (bx + Lo.mx(5)) / 2 + 30, Lo.ry(2) + Lo.rh * 1.2, { px: 40, a: gD, color: OK, font: F.serif }); ctag('I', (Lo.mx(0) + Lo.mx(2)) / 2, Lo.ry(2) + Lo.rh * 1.2, { px: 40, a: gD, color: C.ink, font: F.serif }); }
      B.burst(DX + 160, DY - 60, s('D04'), OK, { r1: 260 });
      texAt('chk2', DX, DY + 280, 32, { alpha: pC * gin(s('G02') + 0.3) });
      B.stamp(DX + 360, DY + 280, true, gin(e('G02') - 0.5, 0.4), pC * gin(e('G02') - 0.5));
    }
    // ── (d) ──
    const pD = A * gin(s('C18') - 0.2);
    if (pD > 0) { texAt('xsol', DX, DY - 60, 40, { alpha: pD, reveal: rv(s('C18'), 4) }); B.answer('xsol', DX, DY - 60, 40, pD * gin(cue('C18', '所以x')), { col: OK }); B.burst(DX, DY - 60, cue('C18', '所以x'), OK, { r1: 300 }); }
  }
  const GJ = new MBoard([[1, 0, 1, 1, 0, 0], [3, 3, 4, 0, 1, 0], [2, 2, 3, 0, 0, 1]], { aug: false });
  GJ.add(gjT[0], gjT[0] + 1.0, 1, 0, -3).add(gjT[1], gjT[1] + 1.0, 2, 0, -2).add(gjT[2], gjT[2] + 1.0, 2, 1, -2 / 3)
    .scale(gjT[3], gjT[3] + 1.0, 2, 3).add(gjT[4], gjT[4] + 1.2, 1, 2, -1).add(gjT[5], gjT[5] + 1.2, 0, 2, -1).scale(gjT[6], gjT[6] + 1.2, 1, 1 / 3);

  // ════ 23–24 Q5 ════
  const M2 = new SBoard([[-2, 1, 2], [4, 1, -2], [-6, -3, 4]], { aug: false });
  M2.add(luT[0], luT[0] + 1.4, 1, 0, 2).add(luT[1], luT[1] + 1.4, 2, 0, -3).add(luT[2], luT[2] + 1.4, 2, 1, 2);
  function shotQ2() {
    const a = B.win(s('C19'), s('C24') - 0.2); if (a <= 0) return;
    const A = a * gin(s('C20') - 0.2); if (A <= 0) return;
    B.qhead('2023–2024 期中 · 第 5 题（= 2021–22 第 4 题）', A);
    const fin = gin(s('C23'));
    const o = { x: DX + 190, y: DY - 120, px: 48, mode: 1, alpha: A * (1 - fin), labelHold: 1.0,
      pivots: [{ r: 0, c: 0, t0: cue('C20', '主元是负二'), t1: s('C22') + 0.2 }, { r: 1, c: 1, t0: cue('C22', '第二列的主元'), t1: s('C23') }] };
    M2.draw(ctx, B.t, o);
    const LM = [[1, 0, 0], [-2, 1, 0], [3, -2, 1]], LK = [[1, 0], [2, 0], [2, 1]];
    const LL = B.mat(DX - 250, DY - 120, LM, { px: 46, a: A * (1 - fin), cell: (i, j) => { const k = LK.findIndex(q => q[0] === i && q[1] === j); if (k >= 0) return { a: gin(flyT[k] + 0.6), col: C.j }; return i < j ? { a: 0.5 } : null; } });
    ctag('L', DX - 250, DY - 290, { px: 44, a: A * (1 - fin), color: C.j, font: F.serif });
    const src = [M2.cell(o, 1, 0), M2.cell(o, 2, 0), M2.cell(o, 2, 1)];
    ['−2', '3', '−2'].forEach((t, k) => B.fly(src[k], LL.cell(...LK[k]), prog(B.t, flyT[k], flyT[k] + 0.7), C.j, { txt: t, px: 30 }));
    texAt('lij', DX, DY + 130, 38, { alpha: A * gin(s('C21') + 0.3) * (1 - fin) });
    ctag('4 ÷ (−2) = −2', DX - 200, DY + 240, { px: 32, a: A * gin(cue('C20', '第二行的倍数')) * (1 - fin) * (1 - B.win(s('C22a'), e('C22b'))), color: C.peri });
    ctag('−6 ÷ (−2) = 3', DX + 40, DY + 240, { px: 32, a: A * gin(s('C22')) * (1 - fin) * (1 - B.win(s('C22a'), e('C22b'))), color: C.peri });
    ctag('−6 ÷ 3 = −2', DX + 270, DY + 240, { px: 32, a: A * gin(cue('C22', '第二列的主元')) * (1 - fin) * (1 - B.win(s('C22a'), e('C22b'))), color: C.peri });
    const gF = A * fin;
    B.answer('LU2', DX, DY - 60, 42, gF, { col: OK }); B.burst(DX, DY - 60, s('C23') + 0.1, OK, { r1: 300 });
    const gW = A * gin(s('G03'));
    if (gW > 0) { B.xcard('倍数 = 下面的数 ÷ 主元（符号原样）', DX, DY + 200, 640, 80, gW, C.free, 30); B.cross(DX - 380, DY + 200, gin(s('G03'), 0.4), gW, 30); }
  }

  // ════ 20–21 Q2 ════
  function shotQ3() {
    const a = B.win(s('C24'), s('C30c') - 0.2); if (a <= 0) return;
    const A = a * gin(cue('C24', '求AX') - 0.3); if (A <= 0) return;
    B.qhead('2020–2021 期中 · 第 2 题', A);
    texAt('AB3', DX, DY - 300, 40, { alpha: A });
    const p1 = A * (1 - gin(s('C28') - 0.3));
    if (p1 > 0) {
      texAt('X1', DX, DY - 160, 44, { alpha: p1 * gin(s('C25')) });
      const pl = B.tex.place('X1', DX, DY - 160, 44, 'c'), gb = B.tex.groupBox(pl, 'inv');
      if (gb) B.fly([DX, DY - 420], [gb.x, gb.y], prog(B.t, s('C25') + 1.0, s('C25') + 1.8), C.peri, { txt: '左乘 A⁻¹', px: 28, lift: 60 });
      texAt('inv2', DX, DY - 10, 38, { alpha: p1 * gin(s('C26')), reveal: rv(s('C26') + 0.3, 3) });
      B.answer('X2', DX, DY + 170, 40, p1 * gin(s('C27')), { col: OK }); B.burst(DX, DY + 170, s('C27') + 0.2, OK, { r1: 260 });
    }
    const p2 = A * gin(s('C28') - 0.3);
    if (p2 > 0) {
      texAt('Y1', DX, DY - 170, 44, { alpha: p2 });
      B.ghalo('Y1', DX, DY - 170, 44, 'I', p2 * B.win(cue('C28', '注意'), s('D06')));
      const wr = p2 * gin(s('D06'));
      texAt('Yw', DX - 230, DY - 30, 42, { alpha: wr * (1 - 0.5 * gin(s('C29'))) });
      B.cross(DX - 230, DY - 30, gin(s('C29') + 0.1, 0.4), wr, 60);
      const gr = p2 * gin(s('C29') + 0.4);
      const yU = smoother(prog(B.t, s('C30a') - 0.3, s('C30a') + 0.3));
      texAt('Yr', DX + 220, DY - 30, 42, { alpha: gr });
      const pl = B.tex.place('Yr', DX + 220, DY - 30, 42, 'c'), gb = B.tex.groupBox(pl, 'inv');
      if (gb) B.fly([DX + 420, DY - 420], [gb.x, gb.y], prog(B.t, s('C29') + 1.0, s('C29') + 1.8), C.peri, { txt: '右乘', px: 28, lift: 60 });
      ctag('乘法不能交换次序', DX, DY + 70, { px: 30, a: gr * gin(cue('C29', '矩阵乘法')) * (1 - yU), color: C.free });
      B.answer('Y2', DX, lerp(DY + 220, DY + 150, yU), 38, p2 * gin(s('C30')), { col: OK });
      B.burst(DX + 200, DY + 220, cue('C30', '再右乘'), OK, { r1: 220 });
    }
  }

  // ════ 扩写二：24–25 Q5（LU + AX=B + rank）；24–25 Q3（置换阵）════
  const ng = v => String(v).replace(/-/g, '−');
  function stepMat(A, S, T, ops, x, y, { px = 36, bar = null, lx = null } = {}) {
    let k = 0; for (let q = 1; q < S.length; q++) if (B.t >= T[q]) k = q;
    const prev = k ? S[k - 1] : S[0], fresh = k ? gin(T[k], 0.5) : 1;
    const M = B.mat(x, y, S[k], { px, a: A, bar, cell: (i, j) => {
      const ch = S[k][i][j] !== prev[i][j];
      return { txt: ng(S[k][i][j]), col: ch && fresh < 1 ? C.j : C.ink, a: ch ? 0.3 + 0.7 * fresh : 1 };
    } });
    if (k > 0 && ops[k]) ops[k].forEach(([i, txt]) => ctag(txt, lx ?? x - M.w / 2 - 80, M.cell(i, 0)[1], { px: 24, a: A * gin(T[k] - 0.4) * (1 - gin(T[k] + 4.0)), color: C.j, font: F.serif }));
    return M;
  }
  function shotR2() {
    let a = B.win(s('C30c'), s('C30l') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C30c') + 0.4);
      B.qhead('2024–2025 期中 · 第 5 题 · 15 分', A);
      // (a) LU
      const ga = A * (1 - gin(s('D06a') - 0.2));
      if (ga > 0) {
        const S = [[[2, 1, 1], [6, 4, 5], [4, 1, 3]], [[2, 1, 1], [0, 1, 2], [0, -1, 1]], [[2, 1, 1], [0, 1, 2], [0, 0, 3]]];
        const T = [-1, cue('C30d', '第二行减三倍') + 0.5, s('C30e') + 1.5];
        stepMat(ga, S, T, [null, [[1, 'R₂ − 3R₁'], [2, 'R₃ − 2R₁']], [[2, 'R₃ + R₂']]], DX - 150, DY - 170, { px: 40 });
        const mul = [['3 = 6 ÷ 2', cue('C30d', '六除以二')], ['2 = 4 ÷ 2', cue('C30d', '四除以二')], ['−1 = −1 ÷ 1', s('C30e') + 0.3]];
        mul.forEach(([t, t0], i) => ctag(t, DX + 250, DY - 260 + i * 60, { px: 28, a: ga * gin(t0) * (1 - gin(s('C30f'))), color: C.i, font: F.serif }));
        const gf = ga * gin(s('C30f'));
        if (gf > 0) {
          ctag('L =', DX + 120, DY + 40, { px: 32, a: gf, color: C.i, font: F.serif });
          const LM = [['1', '0', '0'], ['3', '1', '0'], ['2', '−1', '1']];
          const ML = B.mat(DX + 250, DY + 40, LM, { px: 34, a: gf, cell: (i, j) => ({ txt: LM[i][j], col: i > j ? C.i : C.ink, a: i > j ? gin(s('C30f') + 0.4 + (i + j) * 0.4) : 1 }) });
          const [cx, cy] = ML.cell(2, 1);
          ctx.save(); ctx.globalAlpha = gf * gin(cue('C30f', '注意那个负一')); ctx.strokeStyle = C.free; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          ctag('U = 消元结果 ↑', DX - 150, DY + 40, { px: 28, a: gf, color: C.ink });
        }
      }
      // (b) [A|B]
      const gb = A * gin(s('D06a')) * (1 - gin(s('C30k') - 0.2));
      if (gb > 0) {
        ctx.save(); ctx.globalAlpha = gb * (1 - gin(s('C30g'))); ctx.restore();
        B.xcard('先求 A⁻¹ ?', DX + 230, DY - 300, 260, 64, gb * (1 - gin(s('C30g') + 1)), C.ds, 28);
        const S = [
          [[2, 1, 1, 3, 0, -1], [6, 4, 5, 0, 1, 0], [4, 1, 3, 0, 0, 0]],
          [[2, 1, 1, 3, 0, -1], [0, 1, 2, -9, 1, 3], [4, 1, 3, 0, 0, 0]],
          [[2, 1, 1, 3, 0, -1], [0, 1, 2, -9, 1, 3], [0, -1, 1, -6, 0, 2]],
          [[2, 1, 1, 3, 0, -1], [0, 1, 2, -9, 1, 3], [0, 0, 3, -15, 1, 5]],
        ];
        const T = [-1, cue('C30g', '第二行') + 0.6, s('C30h') + 0.5, cue('C30h', '再加上') + 0.5];
        const M = stepMat(gb * gin(s('C30g')), S, T, [null, [[1, 'R₂ − 3R₁']], [[2, 'R₃ − 2R₁']], [[2, 'R₃ + R₂']]], DX - 20, DY - 190, { px: 34, bar: 3 });
        ctag('A', DX - 20 - M.w / 4, DY - 190 - M.h / 2 - 30, { px: 26, a: gb * gin(s('C30g')), color: C.peri });
        ctag('B 跟着变', DX - 20 + M.w / 4, DY - 190 - M.h / 2 - 30, { px: 26, a: gb * gin(s('C30g')), color: C.j });
        const gx = gb * gin(s('C30i'));
        if (gx > 0) {
          const XR = [['7/2', '−1/3', '−7/6'], ['1', '1/3', '−1/3'], ['−5', '1/3', '5/3']];
          const T2 = [cue('C30j', '第一行减去'), cue('C30j', '第二行减') , cue('C30i', '第三行除以三')];
          ctag('X =', DX - 270, DY + 90, { px: 32, a: gx, color: C.i, font: F.serif });
          B.mat(DX - 20, DY + 90, XR, { px: 32, cw: 120, a: gx, cell: (i, j) => ({ txt: XR[i][j], col: B.t < T2[i] + 1.2 ? C.j : C.ink, a: gin(T2[i] + 0.3) }) });
          ctag('↑ 从下往上回代', DX + 290, DY + 90, { px: 26, a: gx * (1 - gin(s('G03b'))), color: C.peri });
          const gc = gb * gin(s('G03b') + 0.3);
          ctag('2·7/2 + 1·1 + 1·(−5) = 3  ✓', DX, DY + 250, { px: 30, a: gc, color: C.gpt, font: F.serif });
          B.burst(DX, DY + 250, cue('G03b', '正是B'), C.gpt, { r1: 220 });
        }
      }
      // (c)
      const gc = A * gin(s('C30k'));
      if (gc > 0) {
        const BM = [['3', '0', '−1'], ['0', '1', '0'], ['0', '0', '0']];
        ctag('B =', DX - 230, DY - 170, { px: 32, a: gc, color: C.ink, font: F.serif });
        const M = B.mat(DX - 60, DY - 170, BM, { px: 38, a: gc, cell: (i, j) => ({ txt: BM[i][j], col: (i === 0 && j === 0) || (i === 1 && j === 1) ? C.i : (i === 2 ? C.free : C.ink) }) });
        const gr = gc * gin(cue('C30k', '有两个非零行'));
        B.card(DX + 240, DY - 170, 260, 70, gr * 0.95, OK); ctag('rank B = 2', DX + 240, DY - 170, { px: 32, a: gr, color: OK, font: F.serif });
        const gs = gc * gin(cue('C30k', '列空间取'));
        ctag('C(B) = span{(3,0,0)ᵀ, (0,1,0)ᵀ}', DX, DY + 10, { px: 32, a: gs, color: C.ink, font: F.serif });
        const gp = gc * gin(cue('C30k', '也就是'));
        B.card(DX, DY + 110, 560, 76, gp * 0.95, OK);
        ctag('= { (x, y, 0)ᵀ }：xy 平面', DX, DY + 110, { px: 32, a: gp, color: OK, font: F.serif });
        B.burst(DX, DY + 110, cue('C30k', '一整个平面'), OK, { r1: 220 });
      }
    }
    // ── 24–25 Q3 ──
    a = B.win(s('C30l'), s('C31') - 0.2);
    if (a > 0) {
      const A = a * gin(s('C30l') + 0.4);
      B.qhead('2024–2025 期中 · 第 3 题 · 10 分', A);
      const P = [[0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 1, 0]];
      const I5 = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]];
      const T = [-1, cue('C30m', '第一、三行') + 0.4, cue('C30m', '第四、五行') + 0.4];
      const S = [I5, [[0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]], P];
      const gm = A * gin(s('C30m'));
      ctag('A =', DX - 280, DY - 150, { px: 32, a: A, color: C.ink, font: F.serif });
      if (B.t < s('C30m')) B.mat(DX - 80, DY - 150, P, { px: 34, a: A, cell: (i, j) => ({ txt: String(P[i][j]), col: P[i][j] ? C.i : C.ink, a: P[i][j] ? 1 : 0.45 }) });
      else stepMat(gm, S, T, [null, [[0, 'R₁ ↔ R₃']], [[3, 'R₄ ↔ R₅']]], DX - 80, DY - 150, { px: 34, lx: DX + 170 });
      const gd = A * gin(cue('C30m', '所以行列式'));
      B.card(DX, DY + 60, 600, 76, gd * 0.95, OK);
      ctag('det A = (−1)(−1) = 1 ≠ 0', DX, DY + 60, { px: 34, a: gd, color: OK, font: F.serif });
      B.stamp(DX + 330, DY - 260, true, gin(cue('C30m', '非奇异'), 0.4), gd * gin(cue('C30m', '非奇异')), '非奇异');
      const gi = A * gin(cue('C30n', 'A乘A'));
      ctag('A · A = I', DX, DY + 165, { px: 34, a: gi, color: C.ink, font: F.serif });
      const gx = A * gin(cue('C30n', '所以A的逆'));
      B.card(DX, DY + 260, 420, 80, gx * 0.95, OK);
      ctag('A⁻¹ = A', DX, DY + 260, { px: 40, a: gx, color: OK, font: F.serif });
      B.burst(DX, DY + 260, cue('C30n', '所以A的逆') + 0.2, OK, { r1: 200 });
    }
  }

  // ════ 套路卡 ════
  const RC = [['③', '未知矩阵在哪边，逆就乘在哪边', C.peri], ['④', '初等矩阵的逆 = 那个数变号', C.j], ['⑤', 'L = 消元倍数原样填（倍数 = 下 ÷ 主元）', C.i]];
  function shotOutro() {
    const a = B.win(s('C31'), 1e9); if (a <= 0) return;
    RC.forEach(([n, txt, col], i) => {
      const g = a * gin(i === 0 ? s('C31') + 0.3 : cue('C32', i === 1 ? '初等矩阵的逆' : 'L，就是') ), y = DY - 170 + i * 150;
      B.card(DX, y, 860, 120, g, col); ctag(`套路卡 ${n}`, DX - 300, y, { px: 30, a: g, color: col, font: F.serif }); ctag(txt, DX + 70, y, { px: 32, a: g, color: C.ink });
      B.burst(DX + 380, y, i === 0 ? s('C31') + 0.4 : cue('C32', i === 1 ? '初等矩阵的逆' : 'L，就是') + 0.1, col, { r1: 100, n: 12 });
    });
    B.xcard('下一段 → 行列式', DX, DY + 330, 420, 70, a * gin(s('D07')), C.ds, 30);
  }

  function papers() {
    B.paper(EX, 'y1819_q2', { t0: s('C03') + 0.2, dock: cue('C03', 'A的三行') - 0.4, out: s('C19') - 0.4 });
    B.paper(EX, 'y2324_q5', { t0: s('C19') + 0.2, dock: s('C20') - 0.5, out: s('C24') - 0.4 });
    B.paper(EX, 'y2021_q2', { t0: s('C24') + 0.2, dock: cue('C24', '求AX') - 0.6, out: s('C30c') - 0.3 });
    B.paper(EX, 'y2425_q5', { t0: s('C30c') + 0.2, dock: cue('C30c', '第一问') - 0.3, out: s('C30l') - 0.3 });
    B.paper(EX, 'y2425_q3', { t0: s('C30l') + 0.2, dock: cue('C30l', '一个五阶') - 0.3, out: s('C31') - 0.3 });
  }

  // ── 扩写：逐步算式小卡 ──
  const XC = [
    ['C02a', DY + 230, ['E₁ 第二行 (−3, 1, 0)', '⇒ 新第二行 = −3·R₁ + 1·R₂'], C.peri],
    ['C09a', DY + 290, ['(0, 2, 1) − ⅔·(0, 3, 1) = (0, 0, ⅓)'], C.i],
    ['C14a', DY + 250, ['R₂：3·(1, 0, 1) + (0, 3, 1) = (3, 3, 4)  ✓'], OK],
    ['C17a', DY + 290, ['P·[A | I] = [PA | P] = [I | A⁻¹]'], C.j],
    ['C18a', DY + 290, ['也可以：[A | b] 直接消元'], C.ink],
    ['C22a', DY + 300, ['R₂ + 2R₁ = (0, 3, 2)', 'R₃ − 3R₁ = (0, −6, −2)'], C.i],
    ['C22b', DY + 300, ['R₃ + 2R₂ = (0, 0, 2)'], C.i],
    ['G23a', DY + 300, ['3·(−2, 1, 2) − 2·(0, 3, 2) + (0, 0, 2) = (−6, −3, 4)  ✓'], OK],
    ['C27a', DY + 300, ['(2, −1)·B = (−1, 0)；(−5, 3)·B = (4, 2)'], C.i],
    ['C30a', DY + 290, ['(A − I)⁻¹ = −⅓ [[1, −1], [−5, 2]] = [[−⅓, ⅓], [5⁄3, −⅔]]'], C.i],
    ['C30b', DY + 290, ['(1, 2) → (3, −1)', '(3, 4) → (17⁄3, −5⁄3)'], C.i],
    ['G03a', DY + 290, ['(3, −1)(A − I) = (1, 2)  ✓'], OK],
  ];
  function extras() {
    for (const [id, y, rows, col] of XC) {
      const g = B.win(s(id), e(id) + 0.15); if (g <= 0) continue;
      const w = Math.max(...rows.map(r => [...r].reduce((q, ch) => q + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 30 : 16), 0))) + 80, h = rows.length * 44 + 30;
      B.card(DX, y, Math.min(860, w), h, g * 0.95, col);
      rows.forEach((r, i) => ctag(r, DX, y - (rows.length - 1) * 22 + i * 44, { px: 29, a: g * gin(s(id) + 0.3 + i * 1.4), color: col === OK ? OK : C.ink, font: F.serif }));
    }
  }

  function draw(t) {
    B.frame(t, D => { shotIntro(); shotQ1(); shotQ2(); shotQ3(); shotR2(); shotOutro(); papers(); extras(); });
  }
  return { TL, draw };
}
