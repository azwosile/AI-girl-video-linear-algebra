import fs from 'fs'; import path from 'path';
import { buildTimeline } from '../../engine/core/timeline.js';
const seg = path.resolve(process.argv[2]); const lines = JSON.parse(fs.readFileSync(seg + '/lines.json'));
let dur = {}; try { dur = JSON.parse(fs.readFileSync(seg + '/durations.json')); } catch {}
const src = fs.readFileSync(seg + '/scene.js', 'utf8'); const m = src.match(/lead: ([\d.]+),\s*pre: (\{[^}]*\}),\s*post: (\{[^}]*\}), tail: ([\d.]+)/s);
const TL = buildTimeline({ lines, durations: dur, lead: +m[1], pre: eval('(' + m[2] + ')'), post: eval('(' + m[3] + ')'), tail: +m[4] });
console.log(TL.seq.map(x => `${x.id}@${x.s.toFixed(1)}-${x.e.toFixed(1)}`).join(' '), 'total', TL.total.toFixed(1));
