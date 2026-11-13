# -*- coding: utf-8 -*-
"""字幕：由 out/timeline.json 生成 out/subs.srt（与画面内字幕同时间）。用法：python pipeline/srt.py ch01/p0_sample"""
import json, sys
from pathlib import Path
seg = (Path(__file__).resolve().parents[1] / sys.argv[1]).resolve(); out = seg / 'out'
tl = json.loads((out / 'timeline.json').read_text(encoding='utf-8'))
NAME = {'C': 'Claude', 'G': 'GPT', 'D': '大肥鱼'}
def ts(t): ms = int(round(t * 1000)); return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}'
seq = tl['seq']; lines = []
for k, l in enumerate(seq):
    e = l['vo'] + l['dur'] + 0.35
    if k + 1 < len(seq): e = min(e, seq[k + 1]['vo'] - 0.05)
    lines.append(f"{k + 1}\n{ts(l['vo'])} --> {ts(e)}\n{NAME[l['id'][0]]}：{l['sub']}\n")
(out / 'subs.srt').write_text('\n'.join(lines), encoding='utf-8')
print('srt →', out / 'subs.srt', len(lines), '条')
