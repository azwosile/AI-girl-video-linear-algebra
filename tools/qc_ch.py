# -*- coding: utf-8 -*-
"""成片质检：python tools/qc_ch.py ch05 → 每段 时长 / 响度 / 真峰值 / 停顿占比（1 − 台词总时长 / 成片时长）/ 语速（字 / 台词分钟），写 <ch>/qc.txt"""
import json, re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
ch = sys.argv[1]; rows = []; tot = 0
def ff(args):
    return subprocess.run(['ffmpeg', '-nostdin', '-hide_banner'] + args, capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
for seg in sorted((ROOT / ch).glob('s*_*')):
    f = seg / 'out' / f'{ch}_{seg.name}.mp4'
    if not f.exists(): rows.append(f'{seg.name}\tMISSING'); continue
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)], capture_output=True, text=True).stdout)
    e = ff(['-i', str(f), '-vn', '-af', 'loudnorm=print_format=json', '-f', 'null', '-'])
    j = json.loads(e[e.rindex('{'):e.rindex('}') + 1])
    du = json.loads((seg / 'durations.json').read_text(encoding='utf-8'))
    du = du.get('lines', du) if isinstance(du, dict) else du
    sp = sum(v for v in (du.values() if isinstance(du, dict) else du) if isinstance(v, (int, float)))
    sil = d - sp
    L = json.loads((seg / 'lines.json').read_text(encoding='utf-8'))
    L = L['lines'] if isinstance(L, dict) and 'lines' in L else L
    n = len(L); chars = sum(len(re.sub(r'[\s，。、：；！？“”‘’（）,.!?:;()\-—…]', '', (x.get('read') or x.get('sub') or ''))) for x in L)
    tot += d
    rows.append(f"{seg.name}\t{n}\t{int(d // 60)}:{d % 60:04.1f}\t{float(j['input_i']):.1f} LUFS\t{float(j['input_tp']):.1f} dBTP\t{100 * sil / d:.1f}%\t{60 * chars / sp:.0f} 字/分")
rows.append(f'TOTAL\t{int(tot // 60)}:{tot % 60:04.1f}')
out = '\n'.join(rows); (ROOT / ch / 'qc.txt').write_text(out, encoding='utf-8'); print(out)
