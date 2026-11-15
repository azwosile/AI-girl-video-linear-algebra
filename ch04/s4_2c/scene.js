// 第 4 章 4.2c 应用：计算机图形学（Leon 9th §4.2 Application 1）。
// 分镜：顶点矩阵 T（三角形 + 回到起点）→ 一次乘法逐帧动画 → 伸缩 1.5 / y 轴反射 / 转 60°（三连）
//       → 平移不线性（网格不跟、红叉）→ 齐次坐标 + 平移矩阵 → 3D：z = 1 平面上的剪切（原点不动）
//       → 2×2 嵌入 3×3 → 复合：先放大再平移 → TB7 → 思考题 → 小结。
import { base, C, F, lerp, prog, smooth, smoother, outCubic, Plane, DX, DY, OK, I2, arrow, lerpM, load3D } from '../common.js';

export const assets = { chars: ['claude_smile', 'claude_explain', 'claude_point', 'ds_think', 'ds_confused', 'ds_ask', 'ds_proud', 'ds_happy'] };

const mv = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
const rotM = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
const TRI = [[0, 0], [1, 1], [1, -1]];

export async function setup(R) {
  const B = base(R, {
    assets, label: '第四章 · 线性变换', title: '4.2 应用：计算机图形学', hi: 3, en: 'COMPUTER GRAPHICS',
    titleEnd: () => B.L('C02').s,
    pre: { C02: 0.4, C04: 0.4, C05: 0.6, C06: 0.6, C07: 0.6, C08: 0.6, C09: 0.6, C11: 0.4, C13: 0.6, C16: 0.6, C18: 0.6, D04: 0.4, C21: 0.6, C22: 0.6 },
    post: { C03: 0.6, C04: 1.0, C05: 1.0, C06: 1.0, C07: 1.0, C08: 0.8, C12: 1.0, C14: 1.2, C15: 0.8, C17: 0.6, C18: 1.2, C20: 0.8, C21: 0.6 },
  });
  const { L, cue, TL, ctx, gin, rv, texAt, ctag } = B;
  const T = {
    o1: L('C01').s, vt: L('C02').s, vtT: cue('C02', '按列放进'), cl: L('C03').s, d1: L('D01').s, an: L('C04').s, an2: cue('C04', '一帧一帧'),
    dil: L('C05').s, dilg: cue('C05', '画面里'), ref: L('C06').s, refg: cue('C06', 'e一翻成'), rot: L('C07').s, rotg: cue('C07', '三角形就绕'),
    tr: L('C08').s, trx: cue('C08', '麻烦来了'), d2: L('D02').s, hom: L('C09').s, hom2: cue('C09', '补上一个一'), ign: L('C10').s,
    ta: L('C11').s, tam: cue('C11', '把第三列'), tax: L('C12').s, tax2: cue('C12', '平移，变成'), d3: L('D03').s,
    s3: L('C13').s, sh: L('C14').s, shz: cue('C14', 'z等于一这一层'), lin: L('C15').s, lin2: cue('C15', '我们站在'),
    emb: L('C16').s, d3x: L('C17').s, cp: L('C18').s, cp2: cue('C18', '先放大一点五倍'), cp3: cue('C18', '两个矩阵一乘'), ord: L('C19').s,
    b7: L('D04').s, b7c: L('C20').s, q: L('C21').s, sum: L('C22').s, d5: L('D05').s, end: L('C23').s,
  };
  TL.sfx('swoosh_in', 0.3, 0.45); TL.sfx('pop', T.vt + 0.6, 0.3); TL.sfx('pop', T.vtT, 0.3); TL.sfx('pop', T.cl + 0.5, 0.3); TL.sfx('pluck', T.d1, 0.3); TL.sfx('whoosh', T.an2, 0.35);
  TL.sfx('warp', T.dilg, 0.4); TL.sfx('warp', T.refg, 0.4); TL.sfx('warp', T.rotg, 0.4); TL.sfx('whoosh', T.tr + 0.6, 0.35); TL.sfx('error_buzz', T.trx, 0.35); TL.sfx('pluck', T.d2, 0.3);
  TL.sfx('shimmer', T.hom2, 0.35); TL.sfx('pop', T.tam, 0.3); TL.sfx('pop', T.tax, 0.3); TL.sfx('ding_hi', T.tax2, 0.35); TL.sfx('pluck', T.d3, 0.3);
  TL.sfx('whoosh', T.s3, 0.35); TL.sfx('warp', T.sh + 0.4, 0.4); TL.sfx('ding_hi', T.shz, 0.3); TL.sfx('pop', T.emb, 0.3); TL.sfx('pop', T.d3x, 0.3);
  TL.sfx('warp', T.cp2, 0.4); TL.sfx('whoosh', T.cp2 + 1.6, 0.35); TL.sfx('ding_hi', T.cp3, 0.3); TL.sfx('pop', T.b7 + 0.4, 0.3); TL.sfx('check', L('C20').e - 0.5, 0.35);
  TL.sfx('pluck', T.q, 0.3); TL.sfx('shimmer', T.sum, 0.35); TL.sfx('shimmer', L('C23').e + 0.3, 0.4);

  function tri(Pl, pts, a, { fill = C.peri, stroke = C.ink, fa = 0.55, w = 4, verts = false } = {}) {
    if (a <= 0) return; const q = pts.map(p => Pl.S(p, I2));
    ctx.save(); ctx.globalAlpha = a * fa; ctx.fillStyle = fill; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = a; ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
    if (verts) q.forEach(p => B.dot(...p, 8, C.ink, a));
  }

  // ── A：顶点矩阵 + 三连 ──
  const P = new Plane({ ox: DX - 40, oy: DY + 80, u: 130, R: 4 });
  function shotV(D) {
    const a = B.win(T.o1 + 0.3, T.tr - 0.3); if (a <= 0) return;
    // 当前矩阵：伸缩 → 反射 → 旋转，每段回到 I 再做下一个
    const sd = smoother(prog(B.t, T.dilg, T.dilg + 1.4)) * (1 - smoother(prog(B.t, T.ref - 0.3, T.ref + 0.2)));
    const sf = smoother(prog(B.t, T.refg, T.refg + 1.4)) * (1 - smoother(prog(B.t, T.rot - 0.3, T.rot + 0.2)));
    const sr = smoother(prog(B.t, T.rotg, T.rotg + 1.6));
    let M = I2;
    if (sd > 0) M = lerpM(I2, [[1.5, 0], [0, 1.5]], sd);
    if (sf > 0) M = lerpM(I2, [[-1, 0], [0, 1]], sf);
    if (sr > 0) M = rotM(Math.PI / 3 * sr);
    // 动画演示（C04）：逐帧小角度旋转的残影
    const an = a * gin(T.an2) * (1 - gin(T.dil - 0.3));
    B.warp(P, M, 1, a * gin(T.o1 + 0.4), D, { from: M, neu: 0.4, labels: false, basis: B.t > T.dil - 0.3 });
    if (an > 0) for (let k = 1; k <= 6; k++) { const th = k * 0.35 * smoother(prog(B.t, T.an2, T.an2 + 2.4)); tri(P, TRI.map(p => mv(rotM(th), p)), an * (0.18 + 0.1 * k / 6), { fa: 0.25, w: 2 }); }
    const gT = a * gin(T.vt + 0.6); tri(P, TRI.map(p => mv(M, p)), gT, { verts: B.t < T.dil });
    const lab = gT * (1 - gin(T.dil - 0.3));
    ctag('(0, 0)', ...P.S([-0.35, -0.25]), { px: 26, a: lab, color: C.ink }); ctag('(1, 1)', ...P.S([1.35, 1.15]), { px: 26, a: lab, color: C.ink }); ctag('(1, −1)', ...P.S([1.4, -1.15]), { px: 26, a: lab, color: C.ink });
    // 首尾相连：从 (1,−1) 回到 (0,0) 的那一笔高亮
    const gc = a * gin(T.cl + 0.5) * (1 - gin(T.d1)); if (gc > 0) { const p = P.S([1, -1]), q = P.S([0, 0]); arrow(ctx, p, q, { color: C.peri, width: 7, head: 22, alpha: gc, grow: gin(T.cl + 0.5, 1.0) }); }
    texAt('T0', DX, DY - 360, 44, { alpha: a * gin(T.vtT) * (1 - gin(T.cl - 0.2)) });
    texAt('T1', DX, DY - 360, 44, { alpha: a * gin(T.cl) * (1 - gin(T.an - 0.2)) });
    texAt('AT', DX, DY - 360, 42, { alpha: a * gin(T.an) * (1 - gin(T.dil - 0.2)) });
    ctag('一个一个改？', DX + 300, DY - 250, { px: 32, a: a * gin(T.d1) * (1 - gin(T.an)), color: C.free, font: F.serif });
    ctag('逐帧相乘 = 动画', DX + 280, DY - 250, { px: 32, a: an, color: OK, font: F.serif });
    // 三连标签 + 公式
    const tags = [[T.dil, T.ref, '① 伸缩', 'dil', 38], [T.ref, T.rot, '② 关于 y 轴反射', 'ref', 42], [T.rot, T.tr, '③ 旋转 60°', 'rot', 40]];
    for (const [t0, t1, n, k, px] of tags) { const g = a * gin(t0) * (1 - gin(t1 - 0.2)); ctag(n, DX, DY - 390, { px: 32, a: g, color: C.peri, font: F.serif }); B.card(DX, DY - 290, k === 'dil' ? 640 : 330, 150, g, C.peri); texAt(k, DX, DY - 290, px, { alpha: g }); }
    // 反射：e₁ 翻成 −e₁ 提示
    ctag('e₁ → −e₁，e₂ 不动', DX + 280, DY + 330, { px: 28, a: a * gin(T.refg + 0.6) * (1 - gin(T.rot - 0.2)), color: C.inkMid });
  }

  // ── B：平移的坑 ──
  const PT = new Plane({ ox: DX - 340, oy: DY + 140, u: 62, R: 9 });
  function shotTr(D) {
    const a = B.win(T.tr - 0.2, T.s3 - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.tr + 0.6, T.tr + 2.2));
    const s2 = smoother(prog(B.t, T.tax2 - 0.4, T.tax2 + 1.2));
    const k = Math.max(s * (1 - gin(T.hom - 0.2)), s2);
    B.warp(PT, I2, 1, a, D, { neu: 0.4, labels: false, basis: false });
    tri(PT, TRI, a * 0.35, { fa: 0.2, w: 2 });
    tri(PT, TRI.map(p => [p[0] + 6 * k, p[1] + 2 * k]), a);
    const ga = a * gin(T.tr + 0.6) * (k > 0.05 ? 1 : 0); if (ga > 0) B.line2(PT.S([0, 0]), PT.S([6 * k, 2 * k]), C.peri, ga, 4, [12, 8]);
    ctag('④ 平移', DX, DY - 390, { px: 32, a: a * (1 - gin(T.hom - 0.2)), color: C.peri, font: F.serif });
    texAt('tr', DX - 140, DY - 310, 44, { alpha: a * (1 - gin(T.hom - 0.2)) }); texAt('tr0', DX + 200, DY - 310, 40, { alpha: a * gin(T.trx) * (1 - gin(T.hom - 0.2)), color: C.free });
    const gx = a * gin(T.trx + 0.8) * (1 - gin(T.hom - 0.2));
    B.card(DX + 160, DY - 200, 460, 80, gx, C.free); ctag('没有 2×2 矩阵能做到', DX + 160, DY - 200, { px: 32, a: gx, color: C.free });
    ctag('4.1 节的坑！', DX + 260, DY - 110, { px: 32, a: a * gin(T.d2) * (1 - gin(T.hom - 0.2)), color: C.free, font: F.serif });
    // 齐次坐标
    const gh = a * gin(T.hom) * (1 - gin(T.ta - 0.2)); ctag('齐次坐标', DX, DY - 390, { px: 36, a: a * gin(T.hom), color: C.peri, font: F.serif });
    texAt('hom', DX + 120, DY - 250, 46, { alpha: gh * gin(T.hom2) });
    ctag('画图时忽略第三个分量', DX + 150, DY - 90, { px: 30, a: gh * gin(T.ign), color: C.inkMid });
    const gm = a * gin(T.tam); B.card(DX + 230, DY - 250, 300, 190, gm * (1 - gin(T.tax - 0.2)), C.peri); texAt('Ta', DX + 230, DY - 250, 44, { alpha: gm * (1 - gin(T.tax - 0.2)) });
    ctag('a = (6, 2)ᵀ', DX - 100, DY - 250, { px: 34, a: a * gin(T.ta) * (1 - gin(T.tax - 0.2)), color: C.peri });
    texAt('Tax', DX + 60, DY - 270, 40, { alpha: a * gin(T.tax), reveal: rv(T.tax, 2.0) });
    ctag('平移 = 矩阵乘法！', DX + 120, DY - 130, { px: 34, a: a * gin(T.tax2), color: OK, font: F.serif });
    ctag('不是线性的……怎么能写成矩阵？', DX + 120, DY - 70, { px: 28, a: a * gin(T.d3), color: C.free });
  }

  // ── C：3D 剪切 ──
  const P3c = await load3D(); const P3 = new P3c(900, { R: 3 });
  const AV = [1.4, 0.7];
  function shotSh(D) {
    const a = B.win(T.s3 - 0.2, T.emb - 0.3); if (a <= 0) return;
    const s = smoother(prog(B.t, T.sh + 0.4, T.sh + 2.6));
    P3.reset();
    P3.setPlane(0, [0, 0, 1], { color: C.j, alpha: 0.22 * gin(T.s3 + 0.3), scale: 0.8, d: 1 });
    P3.setLine(0, [AV[0] * s, AV[1] * s, 1], { color: C.k, width: 6, alpha: gin(T.sh + 0.2) });
    P3.setPoint(0, [0, 0, 0], { r: 0.1, color: OK, alpha: gin(T.lin) });
    const V = B.show3D(P3, D, a, { el: 18, az: -60 + 6 * Math.sin(B.t * 0.25), dist: 14, axesA: 0.7, floorA: 0.3 });
    const poly = (pts, al, fill) => { if (al <= 0) return; const q = pts.map(V.pr); ctx.save(); ctx.globalAlpha = al * 0.55; ctx.fillStyle = fill; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = al; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); };
    const sc = 0.6, z1 = TRI.map(([x, y]) => [x * sc, y * sc, 1]);
    poly(z1, a * gin(T.s3 + 0.6) * 0.4, C.inkMid);
    poly(z1.map(([x, y, z]) => [x + AV[0] * s * z, y + AV[1] * s * z, z]), a * gin(T.s3 + 0.6), C.peri);
    // 层：z = 0（不动）与 z = 2（推两倍）的点
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { B.dot(...V.pr([x * 0.8, y * 0.8, 0]), 6, C.ink, a * gin(T.sh) * 0.8); B.dot(...V.pr([x * 0.5 + AV[0] * s * 2, y * 0.5 + AV[1] * s * 2, 2]), 6, C.i, a * gin(T.sh) * 0.8); }
    V.lab([0, 0, 0], '原点不动', { px: 26, a: a * gin(T.lin), color: OK, dy: 0 });
    ctag('z = 1 这一层', DX - 320, DY + 210, { px: 28, a: a * gin(T.s3 + 0.4), color: C.j });
    ctag('3D 里：剪切（线性）', DX, DY - 390, { px: 32, a: a * gin(T.sh), color: C.peri, font: F.serif });
    ctag('越高推得越远', DX, DY - 340, { px: 28, a: a * gin(T.sh + 1.4), color: C.ink });
    ctag('z = 1 层：整体平移 a', DX + 260, DY + 290, { px: 30, a: a * gin(T.shz), color: C.peri });
    ctag('站在这一层看 = 平移', DX + 260, DY + 340, { px: 30, a: a * gin(T.lin2), color: OK });
    ctag('示意：a 已缩小', DX - 330, DY + 330, { px: 22, a: a * 0.7, color: C.inkMid });
  }

  // ── D：嵌入 + 复合 ──
  const PC = new Plane({ ox: DX - 360, oy: DY + 180, u: 58, R: 10 });
  function shotEmb(D) {
    const a = B.win(T.emb - 0.2, T.q - 0.3); if (a <= 0) return;
    const top = a * (1 - gin(T.cp - 0.2));
    ctag('线性变换也升级成 3×3', DX, DY - 360, { px: 34, a: top, color: C.peri, font: F.serif });
    B.card(DX - 180, DY - 180, 300, 200, top * gin(T.emb + 0.4), C.peri); texAt('emb', DX - 180, DY - 180, 50, { alpha: top * gin(T.emb + 0.4) });
    ctag('2×2 放左上角', DX - 180, DY - 50, { px: 26, a: top * gin(T.emb + 0.4), color: C.inkMid });
    B.card(DX + 200, DY - 180, 300, 200, top * gin(T.d3x), C.j); texAt('d3', DX + 200, DY - 180, 44, { alpha: top * gin(T.d3x) }); ctag('放大 3 倍', DX + 200, DY - 50, { px: 26, a: top * gin(T.d3x), color: C.inkMid });
    // 复合动画
    const gc = a * gin(T.cp) * (1 - gin(T.b7 - 0.2)); if (gc > 0) {
      const s1 = smoother(prog(B.t, T.cp2, T.cp2 + 1.4)), s2 = smoother(prog(B.t, T.cp2 + 1.6, T.cp2 + 3.0));
      const c = lerp(1, 1.5, s1), off = [6 * s2, 2 * s2];
      B.warp(PC, I2, 1, gc, D, { neu: 0.35, labels: false, basis: false });
      tri(PC, TRI, gc * 0.35, { fa: 0.2, w: 2 });
      tri(PC, TRI.map(([x, y]) => [c * x + off[0], c * y + off[1]]), gc);
      ctag('① 放大 1.5', DX - 230, DY - 30, { px: 28, a: gc * gin(T.cp2), color: C.i }); ctag('② 平移 (6, 2)', DX + 60, DY - 30, { px: 28, a: gc * gin(T.cp2 + 1.6), color: C.j });
      B.card(DX, DY - 220, 860, 170, gc * gin(T.cp3), C.peri); texAt('comp', DX, DY - 220, 34, { alpha: gc * gin(T.cp3) });
      ctag('先做的写右边', DX + 250, DY - 100, { px: 30, a: gc * gin(T.ord), color: C.peri });
    }
    const gb = a * gin(T.b7); if (gb > 0) {
      ctag('Test B 第 7 题：平移 a = (2, 5)ᵀ', DX, DY - 360, { px: 32, a: gb, color: C.peri });
      B.card(DX, DY - 200, 300, 190, gb * gin(T.b7 + 1.0), C.ds ?? C.i); texAt('b7', DX, DY - 200, 44, { alpha: gb * gin(T.b7 + 1.0) });
      texAt('b7x', DX, DY + 30, 40, { alpha: a * gin(T.b7c + 0.4), reveal: rv(T.b7c + 0.4, 2.0) });
      B.stamp(DX + 300, DY + 180, true, gin(L('C20').e - 0.5, 0.4), a * gin(L('C20').e - 0.5));
    }
  }

  function shotQ() {
    const a = B.win(T.q - 0.2, T.sum - 0.3); if (a <= 0) return;
    ctag('思考题', DX, DY - 280, { px: 40, a, color: C.free, font: F.serif });
    B.card(DX, DY - 120, 520, 200, a * gin(T.q + 0.5), C.free); texAt('q', DX, DY - 120, 46, { alpha: a * gin(T.q + 0.5) });
    ctag('复习课揭晓', DX, DY + 50, { px: 32, a: a * gin(cue('C21', '复习课')), color: C.inkMid });
  }
  function shotSum() {
    const a = B.win(T.sum - 0.2, T.end - 0.3); if (a <= 0) return;
    ctag('小结', DX, DY - 330, { px: 40, a, color: C.peri, font: F.serif });
    const it = [['图形 = 顶点矩阵', C.ink, T.sum + 0.3], ['伸缩、反射、旋转：左乘 2×2', C.i, cue('C22', '伸缩')], ['平移：齐次坐标 → 3×3', C.j, cue('C22', '平移靠')]];
    it.forEach(([s, col, t0], i) => ctag(s, DX, DY - 210 + i * 90, { px: 36, a: a * gin(t0), color: col }));
    ctag('游戏引擎里全是矩阵！', DX, DY + 150, { px: 40, a: a * gin(T.d5), color: OK });
  }
  function shotEnd() {
    const a = B.win(T.end - 0.1, 1e9); if (a <= 0) return;
    ctag('下一节', DX, DY - 120, { px: 34, a: a * gin(T.end), color: C.inkMid });
    ctag('相似', DX, DY - 20, { px: 110, a: a * gin(T.end + 0.3, 0.5), color: C.peri, font: F.serif });
    ctag('换一组基，矩阵怎么变', DX, DY + 110, { px: 36, a: a * gin(T.end + 0.8), color: C.ink });
  }

  const SECS = [
    { t0: T.vt - 0.2, t1: T.tr - 0.3, head: '顶点矩阵', items: [['T 按列存顶点', T.vtT], ['AT：一次全变', T.an, { color: OK, mark: OK }], ['伸缩 cI', T.dil], ['反射', T.ref], ['旋转 60°', T.rot]] },
    { t0: T.tr - 0.3, t1: T.emb - 0.3, head: '平移怎么办', items: [['不是线性的', T.trx, { color: C.free, mark: C.free }], ['齐次坐标：补 1', T.hom], ['3×3 平移矩阵', T.ta, { color: C.peri, mark: C.peri }], ['3D 里是剪切', T.s3]] },
    { t0: T.emb - 0.3, t1: T.end - 0.3, head: '全都是乘法', items: [['2×2 → 3×3', T.emb], ['复合：先放大后平移', T.cp], ['TB7', T.b7], ['思考题', T.q]] },
  ];

  function draw(t) {
    B.frame(t, D => { shotV(D); shotTr(D); shotSh(D); shotEmb(D); shotQ(); shotSum(); shotEnd(); B.left(SECS); });
  }
  return { TL, draw };
}
