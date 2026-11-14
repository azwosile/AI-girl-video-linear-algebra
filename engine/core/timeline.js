// 时间轴：按实测配音时长排台词，统一登记音效；输出 TIMELINE 供混音 / 字幕。
// 用法：
//   const TL = buildTimeline({ lines, durations, lead: 1.6, pre: { C04: 0.4 }, post: { G01: 1.5 }, tail: 2.2 });
//   TL.L('C02') → { s, e, d, spk, sub }；TL.sfx('pluck', t, 0.5)；TL.total
export function buildTimeline({ lines, durations, lead = 1.0, same = 0.2, change = 0.28, pre = {}, post = {}, tail = 1.5 }) {
  const seq = []; let t = lead, prev = null;
  for (const l of lines) {
    if (prev) t += (prev.id[0] === l.id[0] ? same : change);
    t += pre[l.id] || 0;
    const d = durations[l.id] ?? Math.max(1.2, [...(l.read || l.sub)].length / 4.6);
    seq.push({ id: l.id, spk: l.id[0], sub: l.sub, read: l.read || l.sub, pose: l.pose, s: t, d, e: t + d });
    t += d + (post[l.id] || 0); prev = l;
  }
  const total = t + tail;
  const by = Object.fromEntries(seq.map(x => [x.id, x]));
  const sfxList = [];
  return {
    seq, total,
    L: id => { if (!by[id]) throw new Error('无此台词 ' + id); return by[id]; },
    /** 台词 id 里某个词大约在什么时候说出（按朗读稿字数比例估算；k 为字偏移） */
    cue: (id, word, k = 0) => {
      const l = by[id]; if (!l) throw new Error('无此台词 ' + id);
      const i = l.read.indexOf(word); if (i < 0) throw new Error(`cue: ${id} 里找不到「${word}」`);
      return l.s + l.d * Math.min(1, Math.max(0, (i + k) / [...l.read].length));
    },
    /** 某一时刻正在说话的句子（含 0.12 s 余量），没有返回 null */
    speaking: tt => seq.find(x => tt >= x.s - 0.05 && tt <= x.e + 0.12) || null,
    /** 最近一句字幕（句间空档仍显示上一句，避免闪烁） */
    subAt: tt => { let r = null; for (const x of seq) { if (tt >= x.s - 0.1) r = x; } return r && tt <= r.e + 0.5 ? r : null; },
    sfx: (name, at, gain = 0.5) => sfxList.push({ name, t: +at.toFixed(3), gain }),
    export: () => ({ total, seq: seq.map(x => ({ id: x.id, vo: +x.s.toFixed(3), dur: x.d, sub: x.sub })), sfx: sfxList }),
  };
}
