"""把 _gen/L_<seg>.txt（每行：id|pose|mood|sub|read）写成 <seg>/lines.py（唯一真源，带标准页脚）。"""
import sys
from pathlib import Path
G = Path(__file__).resolve().parent; HERE = G.parent
foot = (G / 'footer.txt').read_text(encoding='utf-8')
for f in sorted(G.glob('L_*.txt')):
    seg = f.stem[2:]; raw = f.read_text(encoding='utf-8').split('\n')
    doc = []; rows = []
    for ln in raw:
        if ln.startswith('#'): doc.append(ln[1:].strip()); continue
        if not ln.strip(): continue
        if ln.startswith('//'): rows.append('    # ' + ln[2:].strip()); continue
        i, pose, mood, sub, read = [x.strip() for x in ln.split('|')]
        m = f"mood={mood!r}, " if mood else ''
        rows.append(f"    dict(id={i!r}, {m}pose={pose!r}, sub={sub!r}, read={read!r}),")
    d = HERE / seg; d.mkdir(exist_ok=True)
    src = '# -*- coding: utf-8 -*-\n"""' + '\n'.join(doc) + '\n运行：python lines.py → script.json / lines.json\n"""\nimport json\nfrom pathlib import Path\n\nLINES = [\n' + '\n'.join(rows) + '\n]\n\n' + foot
    (d / 'lines.py').write_text(src, encoding='utf-8'); print(seg, sum(1 for r in rows if 'dict(' in r))
