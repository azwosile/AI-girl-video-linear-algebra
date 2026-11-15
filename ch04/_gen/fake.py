"""本地干跑用：没有真实 durations.json 时按 5.4 字/秒 伪造（sync.sh 排除 durations.json，不会传到主机）。"""
import json, sys
from pathlib import Path
for s in sys.argv[1:]:
    p = Path(s); d = p / 'durations.json'
    if d.exists() and not (p / '.fake').exists(): print(s, 'real durations kept'); continue
    L = json.loads((p / 'lines.json').read_text(encoding='utf-8'))
    d.write_text(json.dumps({l['id']: round(len(l['read']) / 5.4 + 0.3, 3) for l in L}), encoding='utf-8'); (p / '.fake').write_text('1')
    if not (p / 'envelope.json').exists(): (p / 'envelope.json').write_text('{}')
    print(s, 'fake durations')
