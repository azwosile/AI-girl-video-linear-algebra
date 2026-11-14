// 第 1 章 §1.1 线性方程组（Leon 9th §1.1；同济第六版 第三章 §1、§3）
// 分镜：
//   开场   标题；大肥鱼半身海报提问（D01）
//   C01–02 大圆里冒出成百上千个未知数 → 排成整齐方阵，橙色扫描线（"机械、可靠的方法"）
//   C03–06 大圆里写线性方程一般式；反例打叉；m×n 方程组一般形式；解 (x₁,…,xₙ)
//   D02–07 左栏：相容 / 不相容
//   C08–G01 大圆变成平面：两条直线；唯一解 / 平行无解 / 重合无穷多解；左栏三幅小图总结
//   D03–D04 三种操作：交换、倍乘（直线不动）、倍加（直线绕交点旋转，交点不动）
//   C17–C22 三元例子：方程组面板逐步消元成三角形，回代
//   D05–C26 去掉 x → 系数矩阵 → 增广矩阵；在矩阵上把消元快速重做一遍（主元方框）
//   G02–C27 同济对照；悬念：主元全是 0 怎么办 → 下一节
import { C, F } from '../../engine/style/tokens.js';
import { clamp, lerp, prog, smooth, smoother, outCubic, outBack, pulse, win, rng } from '../../engine/core/util.js';
import { buildTimeline } from '../../engine/core/timeline.js';
import { star4, dotted, cornerMark } from '../../engine/style/motifs.js';
import { Plane, eqLine, ring } from '../../engine/la2d/plane.js';
import { MBoard } from '../../engine/la2d/mboard.js';
import { Cast, subtitle } from '../../engine/cast/cast.js';
import { makeDirector } from '../../engine/cast/director.js';
import { makeKit } from '../../engine/style/kit.js';

export const assets = { chars: ['claude_explain', 'claude_point', 'claude_think', 'claude_smile', 'ds_ask', 'ds_confused', 'ds_happy', 'ds_shock', 'gpt_explain', 'gpt_proud'] };
const SHADOW = { claude: C.shadowClaude, ds: C.shadowDs, gpt: C.shadowGpt };
const DX = 1230, DY = 540, DR = 515, LX = 168;
const SUBN = ['₁', '₂', '₃'];

/** a·x₁ + b·x₂ = c → 文本 */
function eqText(a, b, c) {
  const t = []; const term = (k, v, first) => {
    if (k === 0) return; const s = k < 0 ? '−' : '+', m = Math.abs(k) === 1 ? '' : String(Math.abs(k));
    t.push(first ? (k < 0 ? '−' : '') + m + v : ` ${s} ${m}${v}`);
  };
  term(a, 'x₁', true); term(b, 'x₂', a === 0);
  return t.join('') + ' = ' + (c < 0 ? '−' : '') + Math.abs(c);
}

export async function setup(R) {
  const { ctx, stage, tex } = R;
  const TL = buildTimeline({
    lines: R.lines, durations: R.durations, lead: 2.0,
    pre: { C01: 0.5, C03: 0.6, C05: 0.3, D02: 0.3, C08: 0.8, C10: 0.6, C11: 0.6, G01: 0.5, D03: 0.7, C13: 0.3, C14: 0.3, C16: 0.4, D04: 0.3,
      C17: 0.6, C19: 0.3, C20: 0.7, C21: 0.5, C22: 0.8, D05: 0.6, C23: 0.3, C25: 0.4, C26: 0.3, G02: 1.0, D06: 0.5 },
    post: { C27: 1.9 }, tail: 0.6,
  });
  const L = TL.L, cue = TL.cue;
  const cast = new Cast(R.envelope, TL);
  for (const n of assets.chars) cast.add(n, R.img[n], SHADOW[n.split('_')[0]]);
  const dir = makeDirector(TL, cast, {
    C: { x: 250, y: 1095, h: 470, in: [L('C01').s - 0.35, L('C01').s + 0.4] },
    D: { x: 1738, y: 1095, h: 500, skip: ['D01'] },
    G: { x: 1716, y: 1095, h: 500 },
  });
  const P = new Plane({ ox: DX - 60, oy: DY + 60, u: 88, R: 12 });

  // ---------- 时刻 ----------
  const T = {
    cloud: [L('C01').s - 0.2, L('C01').e], grid: [L('C02').s + 0.2, L('C02').s + 1.6], scan: [L('C02').s + 1.6, L('C02').e + 0.3],
    lin: cue('C03', '每个未知数') - 0.3, nl: [cue('C04', '平方'), cue('C04', '相乘'), cue('C04', 'sin')], cross: cue('C04', '都不算'),
    sys: cue('C05', '放在一起') - 0.2, sol: cue('C06', '一组数') - 0.2, solHit: cue('C06', '同时满足'),
    cons: cue('C07', '有解叫'), incons: cue('C07', '无解叫'),
    l1: cue('C08', '每个方程') , l2: cue('C08', '一条直线'), dot: cue('C08', '同时落在'),
    case1: cue('C09', '交于一点'), m2: [cue('C10', '换成') - 0.1, cue('C10', '换成') + 1.3], case2: cue('C10', '两线平行'),
    m3: [cue('C11', '换成') - 0.1, cue('C11', '换成') + 1.3], case3: cue('C11', '同一条线'),
    minis: L('G01').s + 0.2,
    back: [L('D03').s - 0.5, L('D03').s + 0.9],
    op1: cue('C12', '第一'), op2: cue('C13', '第二'), op3: cue('C14', '第三'), equiv: cue('C15', '等价方程组') - 0.3, keep: cue('C15', '不改变'),
    reset: [L('C16').s - 0.35, L('C16').s + 0.1], rot: [cue('C16', '第二个方程'), cue('C16', '第二个方程') + 2.4], still: cue('C16', '交点纹丝'),
    tri: cue('C17', '三角形') - 0.2, b3: L('C18').s - 0.2,
    e1: [cue('C19', '第二个方程') - 0.1, cue('C19', '第二个方程') + 1.5], e2: [cue('C19', '第三个') - 0.1, cue('C19', '第三个') + 1.5],
    sw: [cue('C20', '交换') - 0.1, cue('C20', '交换') + 1.2], e3: [cue('C21', '再用') - 0.1, cue('C21', '再用') + 1.5], triDone: cue('C21', '三角形'),
    bx3: cue('C22', 'x三等于'), bx2: cue('C22', '代入得x二'), bx1: cue('C22', '再代入'), back2: cue('C22', '这叫回代'),
    reset3: [L('D05').s - 0.5, L('D05').s + 0.3],
    coef: [cue('C23', '只留') - 0.4, cue('C23', '只留') + 0.9], augm: [cue('C24', '右边') - 0.2, cue('C24', '右边') + 0.8],
    ero: cue('C25', '初等行变换') - 0.4,
    redo: L('C26').s, redoD: L('C26').d,
    tj: L('G02').s, ask: L('D06').s, next: cue('C27', '下一节') - 0.2,
  };

  // ---------- 2×2 方程组：直线与面板 ----------
  const B2 = new MBoard([[1, 1, 2], [1, -1, 2]]);
  B2.set(T.m2[0], T.m2[0] + 0.6, [[1, 1, 2], [1, 1, 1]]);
  B2.set(T.m3[0], T.m3[0] + 0.6, [[1, 1, 2], [-1, -1, -2]]);
  B2.set(T.back[0], T.back[0] + 0.6, [[1, 1, 2], [1, -1, 2]]);
  B2.swap(T.op1 + 0.2, T.op1 + 1.3, 0, 1);
  B2.scale(T.op2 + 0.3, T.op2 + 1.4, 0, 2);
  B2.set(T.reset[0], T.reset[1], [[1, 1, 2], [1, -1, 2]]);
  B2.add(T.rot[0], T.rot[1], 1, 0, -1);
  const lineB = t => { // 第二条直线（a, b, c）与标签
    if (t < T.m2[0]) return [1, -1, 2, 'x₁ − x₂ = 2'];
    if (t < T.m3[0]) { const s = smoother(prog(t, ...T.m2)); return [1, -1 + 2 * s, 2 - s, s >= 1 ? 'x₁ + x₂ = 1' : null]; }
    if (t < T.back[0]) { const s = smoother(prog(t, ...T.m3)); return [1, 1, 1 + s, s >= 1 ? '−x₁ − x₂ = −2' : null]; }
    if (t < T.rot[0]) {
      const s = smoother(prog(t, ...T.back)), th = lerp(Math.PI / 4, -Math.PI / 4, s), a = Math.cos(th), b = Math.sin(th);
      if (s < 1) return [a, b, 2 * a, null];
      return [1, -1, 2, t > T.op2 + 1.4 && t < T.reset[0] ? '2x₁ − 2x₂ = 4' : 'x₁ − x₂ = 2'];
    }
    const s = smoother(prog(t, T.rot[0] + 0.9, T.rot[1])); // 跟着面板变数同步转
    return [1 - s, -1 - s, 2 - 2 * s, s >= 1 ? '−2x₂ = 0' : s <= 0 ? 'x₁ − x₂ = 2' : null];
  };

  // ---------- 3×3 例子 ----------
  const S0 = [[1, 2, 1, 3], [3, -1, -3, -1], [2, 3, 1, 4]];
  const B3 = new MBoard(S0);
  B3.add(...T.e1, 1, 0, -3).add(...T.e2, 2, 0, -2).swap(...T.sw, 1, 2).add(...T.e3, 2, 1, -7);
  B3.set(...T.reset3, S0);
  const rd = f => T.redo + T.redoD * f;
  B3.add(rd(0.12), rd(0.12) + 0.8, 1, 0, -3).add(rd(0.25), rd(0.25) + 0.8, 2, 0, -2).swap(rd(0.4), rd(0.4) + 0.7, 1, 2).add(rd(0.62), rd(0.62) + 0.8, 2, 1, -7);
  const piv3 = [
    { r: 0, c: 0, t0: T.e1[0] - 0.3, t1: T.e2[1] + 0.2 }, { r: 1, c: 1, t0: T.e3[0] - 0.3, t1: T.e3[1] + 0.2 },
    { r: 0, c: 0, t0: T.triDone, t1: T.reset3[0] }, { r: 1, c: 1, t0: T.triDone + 0.12, t1: T.reset3[0] }, { r: 2, c: 2, t0: T.triDone + 0.24, t1: T.reset3[0] },
    { r: 0, c: 0, t0: rd(0.05), t1: rd(0.36) }, { r: 1, c: 1, t0: rd(0.55), t1: rd(0.78) }, { r: 0, c: 0, t0: rd(0.85) }, { r: 1, c: 1, t0: rd(0.88) }, { r: 2, c: 2, t0: rd(0.91) },
  ];

  // ---------- 音效 ----------
  TL.sfx('swoosh_in', 0.3, 0.45);
  TL.sfx('tinkle', T.cloud[0] + 0.3, 0.3); TL.sfx('swell', T.grid[0], 0.3); TL.sfx('type', T.scan[0], 0.25);
  TL.sfx('pluck', T.lin, 0.4); T.nl.forEach(t => TL.sfx('pop', t, 0.3)); TL.sfx('buzz', T.cross, 0.25);
  TL.sfx('swoosh_soft', T.sys, 0.3); TL.sfx('tick', T.solHit, 0.35);
  TL.sfx('check', T.cons, 0.3); TL.sfx('check', T.incons, 0.3);
  TL.sfx('whoosh', L('C08').s - 0.6, 0.35); TL.sfx('pluck', T.l1, 0.45); TL.sfx('pluck', T.l2, 0.45); TL.sfx('ding', T.dot, 0.35);
  TL.sfx('swell', T.m2[0], 0.3); TL.sfx('ding_lo', T.case2, 0.3); TL.sfx('swell', T.m3[0], 0.3); TL.sfx('ding_hi', T.case3, 0.3);
  TL.sfx('marimba', T.minis, 0.3); TL.sfx('marimba_hi', T.minis + 0.3, 0.3); TL.sfx('marimba', T.minis + 0.6, 0.3);
  TL.sfx('swoosh_soft', T.op1 + 0.2, 0.35); TL.sfx('pop', T.op2 + 0.8, 0.35); TL.sfx('check', T.equiv, 0.3);
  TL.sfx('swell', T.rot[0] + 0.8, 0.4); TL.sfx('ding', T.still, 0.35);
  TL.sfx('whoosh', T.b3 - 0.3, 0.35);
  for (const op of B3.ops) TL.sfx(op.type === 'swap' ? 'swoosh_soft' : op.type === 'set' ? 'swell' : 'pop', op.t0 + (op.type === 'add' ? 0.5 : 0.1), 0.3);
  TL.sfx('sparkle', T.triDone, 0.3); [T.bx3, T.bx2, T.bx1].forEach(t => TL.sfx('tick2', t, 0.3));
  TL.sfx('warp', T.coef[0], 0.3); TL.sfx('stamp', T.augm[0] + 0.3, 0.3); TL.sfx('check', T.ero + 0.4, 0.25);
  TL.sfx('bell_soft', T.tj + 0.3, 0.3); TL.sfx('sting', T.ask + 0.1, 0.3); TL.sfx('shimmer', T.next, 0.4);

  // ---------- 通用小件 ----------
  const K = makeKit(ctx), { tag, head, bullet } = K;
  const gin = (t0, d = 0.35) => smooth(prog(t, t0 - 0.1, t0 + d)); // 注意：使用前需在 draw 里设置 t
  let t = 0;

  function drawDisc(D) {
    ctx.save(); ctx.fillStyle = C.disc; ctx.beginPath(); ctx.arc(D.x, D.y, D.r, 0, Math.PI * 2); ctx.fill();
    const sw = smooth(prog(t, 0.4, 1.7)); if (sw > 0) {
      const a0 = -Math.PI / 2 + t * 0.08, a1 = a0 + sw * Math.PI * 1.6, rr = D.r + 18;
      ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.35; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(D.x, D.y, rr, a0, a1); ctx.stroke();
      ctx.globalAlpha = 1; star4(ctx, D.x + rr * Math.cos(a1), D.y + rr * Math.sin(a1), 13, C.peri);
      ctx.strokeStyle = C.peri; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(D.x, D.y, D.r + 6, Math.PI * 0.62, Math.PI * (0.62 + 0.22 * sw)); ctx.stroke();
    }
    ctx.restore();
  }
  const discAt = () => { const r0 = 430 * outCubic(prog(t, 0.05, 0.9)), m = smoother(prog(t, L('C01').s - 0.7, L('C01').s + 0.3)); return { x: lerp(1300, DX, m), y: lerp(520, DY, m), r: lerp(r0, DR, m) }; };
  const clipDisc = D => { ctx.beginPath(); ctx.arc(D.x, D.y, D.r - 1, 0, Math.PI * 2); ctx.clip(); };

  function drawTitle() {
    const a = 1 - smooth(prog(t, L('C01').s - 0.5, L('C01').s + 0.1)); if (a <= 0) return;
    const m = smoother(prog(t, L('D01').s - 0.3, L('D01').s + 0.4)), y = lerp(430, 230, m), k = lerp(1, 0.7, m);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(LX - 10, y); ctx.scale(k, k);
    ctx.font = F.sans(28); ctx.fillStyle = C.inkMid; ctx.globalAlpha = a * smooth(prog(t, 0.2, 0.6)); ctx.fillText('第一章 · 矩阵与方程组', 4, -128);
    ctx.font = F.serif(104); let cx = 0;
    [...'1.1 线性方程组'].forEach((ch, i) => {
      const s = prog(t, 0.3 + i * 0.06, 0.6 + i * 0.06), w = ctx.measureText(ch).width;
      if (s > 0) { ctx.save(); ctx.globalAlpha = a * smooth(s * 1.5); ctx.translate(cx + w / 2, -30); const sc = lerp(1.35, 1, outCubic(s)); ctx.scale(sc, sc); ctx.fillStyle = i < 3 ? C.peri : C.ink; ctx.fillText(ch, -w / 2, 30); ctx.restore(); }
      cx += w + 4;
    });
    ctx.globalAlpha = a * smooth(prog(t, 0.9, 1.4)); dotted(ctx, 'SYSTEMS', cx / 2, 62, 28, C.peri, { rule: 70 * smooth(prog(t, 1.0, 1.6)) });
    ctx.restore();
  }

  // 开场：未知数云 → 方阵 → 扫描线
  const R0 = rng(11), cloud = Array.from({ length: 120 }, (_, i) => {
    const a = R0() * Math.PI * 2, r = Math.sqrt(R0()) * (DR - 70);
    return { i, x: DX + Math.cos(a) * r, y: DY + Math.sin(a) * r, d: R0() * 1.6, s: 22 + R0() * 16, hot: R0() < 0.18 };
  });
  function drawCloud(D) {
    const a = win(t, T.cloud[0], L('C02').e + 0.4, 0.3, 0.5); if (a <= 0) return;
    const g = smoother(prog(t, ...T.grid)), cols = 12;
    ctx.save(); clipDisc(D); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const c of cloud) {
      const ap = smooth(prog(t, T.cloud[0] + c.d, T.cloud[0] + c.d + 0.4)); if (ap <= 0) continue;
      const gx = DX + (c.i % cols - (cols - 1) / 2) * 66, gy = DY + (Math.floor(c.i / cols) - 4.5) * 64;
      const x = lerp(c.x + Math.sin(t * 0.9 + c.i) * 6, gx, g), y = lerp(c.y + Math.cos(t * 0.7 + c.i) * 6, gy, g);
      const sc = Math.floor(c.i / cols), scan = smooth(prog(t, T.scan[0] + sc * 0.09, T.scan[0] + sc * 0.09 + 0.2));
      ctx.globalAlpha = a * ap * (c.hot && g < 0.5 ? 0.95 : 0.7); ctx.font = F.sans(lerp(c.s, 26, g), 500);
      ctx.fillStyle = scan > 0.5 ? C.peri : c.hot && g < 0.5 ? C.peri : C.ink;
      ctx.fillText('x' + (c.i + 1), x, y);
    }
    // 扫描线
    const sy = prog(t, ...T.scan); if (sy > 0 && sy < 1) { ctx.globalAlpha = a * 0.8; ctx.fillStyle = C.peri; ctx.fillRect(D.x - D.r, DY - 4.5 * 64 - 32 + sy * 640, 2 * D.r, 4); }
    ctx.restore();
  }

  // 定义段：一般式、反例、m×n、解
  const late = [];
  function drawDef(D) {
    const a = win(t, T.lin - 0.1, L('C08').s - 0.7, 0.3, 0.4); if (a <= 0) return;
    ctx.save(); clipDisc(D);
    const up = smoother(prog(t, T.sys - 0.5, T.sys));
    const plLin = tex.place('lin', DX, lerp(DY - 40, DY - 330, up), lerp(64, 44, up), 'c');
    tex.draw(ctx, plLin, { alpha: a, reveal: prog(t, T.lin - 0.1, T.lin + 0.9) });
    // 反例
    const nla = 1 - smooth(prog(t, T.sys - 0.6, T.sys - 0.2));
    ['nl1', 'nl2', 'nl3'].forEach((k, i) => {
      const g = smooth(prog(t, T.nl[i] - 0.1, T.nl[i] + 0.3)); if (g <= 0 || nla <= 0) return;
      const x = DX + (i - 1) * 300, y = DY + 140; tex.draw(ctx, tex.place(k, x, y, 50, 'c'), { alpha: a * g * nla });
      const c = smooth(prog(t, T.cross + i * 0.1, T.cross + i * 0.1 + 0.3));
      if (c > 0) { ctx.save(); ctx.globalAlpha = a * nla; ctx.strokeStyle = C.peri; ctx.lineWidth = 6; ctx.lineCap = 'round'; const w = 110;
        ctx.beginPath(); ctx.moveTo(x - w, y - 34); ctx.lineTo(x - w + 2 * w * c, y - 34 + 68 * c); ctx.stroke(); ctx.restore(); }
    });
    // m×n 方程组
    const sa = smooth(prog(t, T.sys, T.sys + 0.5));
    if (sa > 0) {
      const pl = tex.place('sysmn', DX + 20, DY + 50, 44, 'c');
      tex.draw(ctx, pl, { alpha: a * sa, reveal: prog(t, T.sys, T.sys + 1.2) });
      const br = smooth(prog(t, T.sys + 1.0, T.sys + 1.5));
      if (br > 0) { // 左侧花括号：m 个方程；顶部：n 个未知数（画在圆外层，避免被裁掉）
        const bb = tex.groupBox(pl, null), x0 = bb.x - bb.w / 2 - 26, y0 = bb.y - bb.h / 2 + 4, y1 = bb.y + bb.h / 2 - 4, ym = (y0 + y1) / 2;
        late.push(() => {
          ctx.save(); ctx.globalAlpha = a * br; ctx.strokeStyle = C.peri; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x0 + 12, y0); ctx.quadraticCurveTo(x0, y0, x0, y0 + 20); ctx.lineTo(x0, ym - 10); ctx.lineTo(x0 - 12, ym); ctx.lineTo(x0, ym + 10); ctx.lineTo(x0, y1 - 20); ctx.quadraticCurveTo(x0, y1, x0 + 12, y1); ctx.stroke(); ctx.restore();
          tag('m 个方程', x0 - 22, ym, { color: C.peri, px: 30, a: a * br, align: 'right' });
          tag('n 个未知数', bb.x, y0 - 30, { color: C.peri, px: 30, a: a * br, align: 'center' });
        });
      }
    }
    const so = smooth(prog(t, T.sol, T.sol + 0.5));
    if (so > 0) {
      const pl = tex.place('sol', DX, DY + 330, 54, 'c'); tex.draw(ctx, pl, { alpha: a * so, reveal: prog(t, T.sol, T.sol + 0.8) });
      ring(ctx, [DX, DY + 330], prog(t, T.solHit, T.solHit + 0.8), { color: C.peri, r0: 60, r1: 240, width: 4 });
    }
    ctx.restore();
    while (late.length) late.shift()();
  }

  function drawDefLeft() {
    const a = 1 - smooth(prog(t, L('C08').s - 0.8, L('C08').s - 0.3)); if (a <= 0 || t < T.lin - 0.3) return;
    ctx.save(); ctx.globalAlpha = a;
    const k7 = smooth(prog(t, T.cons - 0.6, T.cons - 0.2));
    ctx.globalAlpha = a * (1 - k7);
    head('线性方程', 210, gin(T.lin - 0.2), smooth(prog(t, T.lin, T.lin + 0.6)));
    bullet('未知数只做一次项', 285, gin(T.nl[0]) );
    bullet('不能相乘、不能套函数', 345, gin(T.cross));
    bullet('m 个方程、n 个未知数', 425, gin(T.sys + 0.3));
    bullet('解：同时满足所有方程', 485, gin(T.solHit));
    ctx.globalAlpha = a;
    // 相容 / 不相容
    const c1 = gin(T.cons), c2 = gin(T.incons);
    if (c1 > 0) { tag('相容', LX, 260, { px: 52, color: C.j, a: a * c1, font: F.serif, w: 900 }); tag('= 有解　consistent', LX + 130, 262, { px: 32, a: a * c1, color: C.inkMid }); }
    if (c2 > 0) { tag('不相容', LX, 360, { px: 52, color: C.peri, a: a * c2, font: F.serif, w: 900 }); tag('= 无解　inconsistent', LX + 180, 362, { px: 32, a: a * c2, color: C.inkMid }); }
    ctx.restore();
  }

  // 平面段
  function drawPlane(D) {
    const a = win(t, L('C08').s - 0.4, T.b3 - 0.2, 0.5, 0.5); if (a <= 0) return;
    const grow = prog(t, L('C08').s - 0.4, L('C08').s + 0.8);
    ctx.save(); clipDisc(D); ctx.globalAlpha = a;
    P.grid(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 1.3, alpha: 0.2 * a, grow });
    P.axes(ctx, { M: [[1, 0], [0, 1]], color: C.gridOld, width: 2.2, alpha: 0.55 * a, grow });
    // 直线 A：x₁ + x₂ = 2（金）；直线 B（青）
    const gA = smooth(prog(t, T.l1, T.l1 + 0.7)), gB = smooth(prog(t, T.l2, T.l2 + 0.7));
    const bump = 1 + 0.6 * pulse(t, T.op2 + 0.8, 0.8);
    eqLine(ctx, P, 1, 1, 2, { color: C.i, width: 5, alpha: a, grow: gA });
    const [ba, bb, bc, btxt] = lineB(t);
    const same = t > T.m3[1] - 0.1 && t < T.back[0];
    eqLine(ctx, P, ba, bb, bc, { color: C.j, width: 5 * (t > T.op2 && t < T.reset[0] ? bump : 1), alpha: a, grow: gB, ...(same ? {} : {}) });
    if (same) { ctx.save(); ctx.setLineDash([18, 14]); eqLine(ctx, P, 1, 1, 2, { color: C.i, width: 5, alpha: a }); ctx.restore(); }
    ctx.restore();
    // 标签
    const pA = P.S([-2.6, 4.6]); tag('x₁ + x₂ = 2', pA[0] + 18, pA[1], { color: C.i, a: a * gA, px: 32 });
    if (btxt && gB > 0) {
      let q; if (Math.abs(bb) > 0.3) { const x = 3.4; q = P.S([x, (bc - ba * x) / bb]); } else { q = P.S([bc / ba, 3.5]); }
      if (btxt === '−x₁ − x₂ = −2') q = P.S([-1.8, 3.8]);
      tag(btxt, q[0] + 16, q[1] + (btxt === '−2x₂ = 0' ? -30 : 26), { color: C.j, a: a * gB, px: 32, align: 'left' });
    }
    // 交点
    const unique = (t > T.dot && t < T.m2[0] + 0.3) || (t > T.back[1] && t < T.b3);
    const da = unique ? smooth(prog(t, t > T.back[1] ? T.back[1] : T.dot, (t > T.back[1] ? T.back[1] : T.dot) + 0.3)) : 0;
    if (da > 0) {
      const p = P.S([2, 0]), k = 1 + 0.35 * pulse(t, T.keep, 0.8) + 0.35 * pulse(t, T.still, 0.8);
      ctx.save(); ctx.globalAlpha = a * da; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(p[0], p[1], 10 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ring(ctx, p, prog(t, T.dot, T.dot + 0.8), { color: C.ink, r1: 60, width: 4 });
      ring(ctx, p, prog(t, T.still, T.still + 0.8), { color: C.peri, r1: 70, width: 4 });
      tag('(2, 0)', p[0] + 18, p[1] + 34, { a: a * da * smooth(prog(t, T.case1 - 0.2, T.case1 + 0.2)), px: 32 });
    }
    // 平行：两线之间的间距箭头
    const pg = win(t, T.case2, T.m3[0], 0.3, 0.3);
    if (pg > 0) { const p = P.S([0.5, 0.5]), q = P.S([1, 1]); ctx.save(); ctx.globalAlpha = a * pg; ctx.strokeStyle = C.peri; ctx.lineWidth = 3; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); ctx.restore(); }
  }

  function drawPlaneLeft() {
    const a = win(t, L('C08').s - 0.3, T.tri - 0.4, 0.4, 0.3); if (a <= 0) return;
    B2.draw(ctx, t, { x: LX + 190, y: 222, px: 44, mode: 0, alpha: a, labelHold: 1.2 });
    // 三种情形标签
    const caseA = (t0, t1, text, col) => { const g = win(t, t0, t1, 0.25, 0.25); if (g > 0) { tag(text, LX, 352, { px: 50, color: col, a: a * g, font: F.serif, w: 900 }); } };
    const endCases = T.back[0];
    caseA(T.case1, T.m2[0], '唯一解', C.ink); caseA(T.case2, T.m3[0], '无解', C.peri); caseA(T.case3, endCases, '无穷多解', C.j);
    // 三幅小图
    const mg = win(t, T.minis, T.back[0] + 0.3, 0.3, 0.3);
    if (mg > 0) ['p', 'par', 'same'].forEach((kind, i) => {
      const g = smooth(prog(t, T.minis + i * 0.3, T.minis + i * 0.3 + 0.35)) * mg; if (g <= 0) return;
      const cx = LX + 70 + i * 160, cy = 480, r = 60;
      ctx.save(); ctx.globalAlpha = a * g; ctx.fillStyle = C.disc; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.clip();
      ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      const ln = (x0, y0, x1, y1, c, dash) => { ctx.strokeStyle = c; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(cx + x0, cy + y0); ctx.lineTo(cx + x1, cy + y1); ctx.stroke(); };
      if (kind === 'p') { ln(-70, 40, 70, -40, C.i); ln(-70, -40, 70, 40, C.j); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill(); }
      if (kind === 'par') { ln(-70, 20, 70, -40, C.i); ln(-70, 50, 70, -10, C.j); }
      if (kind === 'same') { ln(-70, 30, 70, -30, C.j); ln(-70, 30, 70, -30, C.i, [10, 9]); }
      ctx.restore();
      tag(['唯一解', '无解', '无穷多解'][i], cx, cy + r + 30, { px: 28, a: a * g, align: 'center', color: [C.ink, C.peri, C.j][i] });
    });
    // 三种操作
    const ol = win(t, T.op1 - 0.3, T.tri - 0.4, 0.3, 0.3);
    if (ol > 0) {
      ctx.save(); ctx.globalAlpha = ol;
      bullet('Ⅰ  交换两个方程', 352, gin(T.op1), { px: 34 });
      bullet('Ⅱ  两边同乘非零数', 412, gin(T.op2), { px: 34 });
      bullet('Ⅲ  倍数加到另一个上', 472, gin(T.op3), { px: 34 });
      const e = gin(T.equiv); if (e > 0) tag('→ 等价方程组：解集不变', LX, 545, { px: 34, color: C.peri, a: ol * e });
      ctx.restore();
    }
  }

  // 三元例子面板（大圆里）
  function drawB3(D) {
    const a = smooth(prog(t, T.b3, T.b3 + 0.5)); if (a <= 0) return;
    const mode = smoother(prog(t, ...T.coef));
    const rhsA = clamp(1 - smooth(prog(t, ...T.coef)) + smooth(prog(t, ...T.augm)));
    const hi = {};
    const hiw = (t0, t1) => win(t, t0, t1, 0.2, 0.3);
    hi[2] = hiw(T.bx3 - 0.1, T.bx2 - 0.2); hi[1] = hiw(T.bx2 - 0.1, T.bx1 - 0.2); hi[0] = hiw(T.bx1 - 0.1, T.back2 + 0.5);
    B3.draw(ctx, t, { x: DX - 110, y: DY - 10, px: 54, mode, alpha: a, pivots: piv3, hiRows: hi, rhsA, heads: smooth(prog(t, T.augm[1], T.augm[1] + 0.4)) });
    // 矩阵名
    const L3 = B3.layout({ x: DX - 110, y: DY - 10, px: 54 });
    const yb = DY - 10 + L3.h / 2 + 70;
    const n1 = win(t, T.coef[1] - 0.3, T.augm[0], 0.3, 0.2), n2 = smooth(prog(t, T.augm[0] + 0.2, T.augm[0] + 0.6)) * (1 - smooth(prog(t, T.next - 0.3, T.next)));
    tag('系数矩阵 A', DX - 110, yb, { px: 40, a: a * n1, align: 'center', font: F.serif, w: 700 });
    tag('增广矩阵 (A | b)', DX - 110, yb, { px: 40, a: a * n2, align: 'center', font: F.serif, w: 700, color: C.ink });
    // D06：主元位置打问号
    const q = win(t, T.ask, T.next + 0.5, 0.2, 0.3);
    if (q > 0) { const [x, y] = B3.cell({ x: DX - 110, y: DY - 10, px: 54, mode: 1 }, 1, 1); tag('?', x + 46, y - 34, { px: 64, color: C.peri, a: a * q * (0.7 + 0.3 * Math.sin(t * 8)), font: F.serif, w: 900 }); }
  }

  function drawTriLeft() {
    const a = win(t, T.tri - 0.1, T.coef[0], 0.3, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const sa = 1 - smooth(prog(t, T.bx3 - 0.6, T.bx3 - 0.2));
    if (sa > 0) {
      ctx.globalAlpha = a * sa; head('目标：三角形', 210, 1, smooth(prog(t, T.tri, T.tri + 0.6)));
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
        const g = smooth(prog(t, T.tri + 0.2 + (r * 4 + c) * 0.04, T.tri + 0.5 + (r * 4 + c) * 0.04)); if (g <= 0) continue;
        const x = LX + 30 + c * 76 + (c === 3 ? 22 : 0), y = 320 + r * 70, zero = c < r && c < 3;
        ctx.globalAlpha = a * sa * g; ctx.font = F.sans(42, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = zero ? C.peri : C.ink; ctx.fillText(zero ? '0' : '∗', x, y);
      }
      ctx.globalAlpha = a * sa * smooth(prog(t, T.tri + 0.8, T.tri + 1.2)); ctx.strokeStyle = C.inkMid; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LX + 30 + 2.5 * 76 + 11, 290); ctx.lineTo(LX + 30 + 2.5 * 76 + 11, 490); ctx.stroke();
      ctx.textAlign = 'left';
    }
    // 回代
    ctx.globalAlpha = a; ctx.textAlign = 'left';
    if (t > T.bx3 - 0.3) {
      head('回代：从下往上', 210, gin(T.bx3 - 0.2), smooth(prog(t, T.bx3, T.bx3 + 0.5)));
      tex.draw(ctx, tex.place('x3', LX, 300, 44, 'l'), { alpha: a, reveal: prog(t, T.bx3, T.bx3 + 0.6) });
      if (t > T.bx2) tex.draw(ctx, tex.place('x2', LX, 380, 44, 'l'), { alpha: a, reveal: prog(t, T.bx2, T.bx2 + 0.9) });
      if (t > T.bx1) tex.draw(ctx, tex.place('x1', LX, 460, 44, 'l'), { alpha: a, reveal: prog(t, T.bx1, T.bx1 + 0.9) });
    }
    ctx.restore();
  }

  function drawMatLeft() {
    const a = smooth(prog(t, T.ero - 0.1, T.ero + 0.4)) * (1 - smooth(prog(t, T.next - 0.4, T.next))); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    head('初等行变换', 210, 1, smooth(prog(t, T.ero, T.ero + 0.6)));
    bullet('Ⅰ  交换两行', 290, gin(T.ero + 0.5), { px: 34 });
    bullet('Ⅱ  某行乘非零数', 350, gin(T.ero + 0.8), { px: 34 });
    bullet('Ⅲ  某行加上另一行的倍数', 410, gin(T.ero + 1.1), { px: 34 });
    K.note('同济第六版 · 对照', ['第三章 §1 矩阵的初等变换'], 470, gin(T.tj + 0.2, 0.5));
    ctx.restore();
  }

  function drawOutro() {
    const a = smooth(prog(t, T.next, T.next + 0.6)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.font = F.sans(30); ctx.fillStyle = C.inkMid; ctx.textBaseline = 'middle'; ctx.fillText('下一节', LX, 240);
    ctx.font = F.serif(84); ctx.fillStyle = C.ink; ctx.fillText('1.2 行阶梯形', LX, 330);
    ctx.fillStyle = C.peri; ctx.fillRect(LX, 395, 260 * smooth(prog(t, T.next + 0.3, T.next + 1.0)), 6);
    dotted(ctx, 'ECHELON', LX + 230, 450, 26, C.peri, { alpha: smooth(prog(t, T.next + 0.5, T.next + 1.0)) });
    ctx.restore();
  }

  function draw(tt) {
    t = tt;
    stage.bg();
    const D = discAt(); drawDisc(D);
    cornerMark(ctx, '第一章 · 1.1', prog(t, 0.2, 1.3));
    drawTitle();
    drawCloud(D); drawDef(D); drawPlane(D); drawB3(D);
    drawDefLeft(); drawPlaneLeft(); drawTriLeft(); drawMatLeft(); drawOutro();
    cast.draw(ctx, t, { name: 'ds_ask', spk: 'D', x: 1300, y: 1110, h: 1000, in: [0.35, 1.15], out: [L('C01').s - 0.8, L('C01').s - 0.15], from: 'bottom' });
    dir.draw(ctx, t);
    subtitle(ctx, t, TL);
  }
  return { TL, draw };
}
