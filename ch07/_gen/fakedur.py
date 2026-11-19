"""本地冒烟用的假时长（按 5.6 字/秒估算），只写在本地；主机上的 durations.json 由 prep 生成，不要推送本文件的结果。"""
import json, sys
from pathlib import Path
H = Path(__file__).resolve().parents[1]
for d in sorted(H.glob('s7_*')):
    if (d / 'durations.json').exists() and '--force' not in sys.argv: continue
    L = json.loads((d / 'lines.json').read_text(encoding='utf-8'))
    (d / 'durations.json').write_text(json.dumps({l['id']: round(len(l['read']) / 5.6 + 0.4, 2) for l in L}), encoding='utf-8'); print(d.name)
