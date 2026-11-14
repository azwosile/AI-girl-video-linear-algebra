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
    windows[spk] = w;
  }
  const discOf = (r, dy, col) => ({ r, dy, color: mixColor(col, C.paper, 0.72) });
  function drawOne(ctx, t, spk, o) {
    const p = poseAt(spk, t); if (!p) return;
    if (p.prev && p.m < 1) cast.draw(ctx, t, { ...o, spk, name: p.prev, alpha: 1 - p.m, pop: p.pop, noDisc: true });
    cast.draw(ctx, t, { ...o, spk, name: p.cur, alpha: p.m, pop: p.pop });
  }
  return {
    windows,
    draw(ctx, t) {
      const c = cfg.C;
      if (c) drawOne(ctx, t, 'C', { x: c.x, y: c.y, h: c.h, in: c.in, out: c.out, from: 'left', disc: discOf(c.disc || 185, c.discDy || 290, C.claude) });
      for (const spk of ['G', 'D']) {
        const k = cfg[spk]; if (!k) continue;
        for (const [a, b] of windows[spk]) {
          if (t < a - 0.1 || t > b + 0.8) continue;
          drawOne(ctx, t, spk, { x: k.x, y: k.y, h: k.h, in: [a, a + 0.6], out: [b, b + 0.6], from: 'right', disc: discOf(k.disc || 190, k.discDy || 300, spk === 'D' ? C.ds : C.gpt), phase: spk === 'D' ? 1.3 : 2.1 });
        }
      }
    },
  };
}
