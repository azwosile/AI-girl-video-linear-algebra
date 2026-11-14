// 角色调度：按台词自动安排出场 / 退场与差分切换。
//   C（Claude）常驻左下；D、G 在自己的台词前入场、说完停留一会儿再退场，间隔短的台词合并成一次出场。
//   差分：每句台词的 pose；换差分时提前 0.25 s 交叉淡化 0.2 s 并小跳。
import { C } from '../style/tokens.js';
import { smooth, pulse, mixColor } from '../core/util.js';

export function makeDirector(TL, cast, cfg) {
  const extra = cfg.extra || {};
  const seqs = {};
  for (const spk of ['C', 'D', 'G']) {
    seqs[spk] = [...TL.seq.filter(x => x.spk === spk && x.pose).map(x => ({ t: x.s - 0.25, pose: x.pose })), ...(extra[spk] || [])].sort((a, b) => a.t - b.t);
  }
  function poseAt(spk, t) {
    const q = seqs[spk]; if (!q.length) return null; let k = 0; for (let i = 0; i < q.length; i++) if (t >= q[i].t) k = i;
    const cur = q[k], prev = q[k - 1], sw = prev && prev.pose !== cur.pose && t >= cur.t;
    return { cur: cur.pose, prev: sw ? prev.pose : null, m: sw ? smooth((t - cur.t) / 0.2) : 1, pop: sw ? pulse(t, cur.t, 0.35) : 0 };
  }
  // D / G 的出场窗口
  const windows = {};
  for (const spk of ['D', 'G']) {
    const c = cfg[spk]; if (!c) continue; const pre = c.pre ?? 0.55, post = c.post ?? 1.4, merge = c.merge ?? 5;
    const w = [];
    for (const x of TL.seq.filter(x => x.spk === spk)) {
      if (c.skip && c.skip.includes(x.id)) continue;
      const a = x.s - pre, b = x.e + post;
      if (w.length && a - w[w.length - 1][1] < merge) w[w.length - 1][1] = b; else w.push([a, b]);
    }
    windows[spk] = w.map(([a, b]) => [a, b, 0.6]);
  }
  // D 与 G 共用右下角：时间上重叠时，先来的提前快速退场（0.35 s），后来的紧接着入场，避免两张立绘叠在一起
  if (windows.D && windows.G) {
    const all = [...windows.D.map(w => ({ w, s: 'D' })), ...windows.G.map(w => ({ w, s: 'G' }))].sort((p, q) => p.w[0] - q.w[0]);
    for (let i = 1; i < all.length; i++) for (let j = 0; j < i; j++) {
      const A = all[j].w, B = all[i].w; if (all[j].s === all[i].s) continue;
      if (B[0] < A[1] + A[2]) { A[1] = Math.max(A[0] + 0.7, B[0] - 0.4); A[2] = 0.35; B[0] = Math.max(B[0], A[1] + 0.3); }
    }
  }
  // 右下角立绘统一往右下收一点，别压住大圆（大圆右缘 x = 1745）
  const RIGHT = { x: cfg.rightX ?? 1785, h: cfg.rightH ?? 455 };
  if (typeof globalThis !== 'undefined') globalThis.__castWindows = windows; // 给 dryrun 的重叠检查用
  const discOf = (r, dy, col) => ({ r, dy, color: mixColor(col, C.paper, 0.72) });
  function drawOne(ctx, t, spk, o) {
    const p = poseAt(spk, t); if (!p) return;
    // 旧差分先保持不透明、后半程才淡出，新差分在上面淡入——避免两张半透明立绘叠出“重影”
    if (p.prev && p.m < 1) cast.draw(ctx, t, { ...o, spk, name: p.prev, alpha: 1 - smooth((p.m - 0.45) / 0.55), pop: p.pop, noDisc: true });
    cast.draw(ctx, t, { ...o, spk, name: p.cur, alpha: p.m, pop: p.pop });
  }
  return {
    windows,
    draw(ctx, t) {
      const c = cfg.C;
      if (c) drawOne(ctx, t, 'C', { x: c.x, y: c.y, h: c.h, in: c.in, out: c.out, from: 'left', disc: discOf(c.disc || 185, c.discDy || 290, C.claude) });
      for (const spk of ['G', 'D']) {
        const k = cfg[spk]; if (!k) continue;
        for (const [a, b, od] of windows[spk]) {
          if (t < a - 0.1 || t > b + od + 0.2) continue;
          drawOne(ctx, t, spk, { x: Math.max(k.x, RIGHT.x), y: k.y, h: Math.min(k.h, RIGHT.h), in: [a, a + 0.6], out: [b, b + od], from: 'right', disc: discOf(k.disc || 165, k.discDy || 275, spk === 'D' ? C.ds : C.gpt), phase: spk === 'D' ? 1.3 : 2.1 });
        }
      }
    },
  };
}
