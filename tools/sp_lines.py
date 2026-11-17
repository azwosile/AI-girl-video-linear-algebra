# 由 mid/script/spNN.py 导出各段 lines.py：python tools/sp_lines.py 1 2 3 ...
import sys, os, re, json, importlib.util, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]; MS = Path('/home/user/mid/script')
sys.path.insert(0, str(MS))
TPL_TAIL = open(ROOT / 'sp6/s1/lines.py', encoding='utf-8').read().split("\n\nif __name__ == '__main__':", 1)[1]
for n in [int(a) for a in sys.argv[1:]]:
    import spk; importlib.reload(spk)
    spec = importlib.util.spec_from_file_location(f'sp{n:02d}', MS / f'sp{n:02d}.py'); m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)  # __name__ != '__main__' → 不导出
    for k, (sid, sg) in enumerate(spk.SEGS.items(), 1):
        d = ROOT / f'sp{n}' / f's{k}'; d.mkdir(parents=True, exist_ok=True)
        out = ['# -*- coding: utf-8 -*-', f'"""特别篇 {n} · 第 {k} 段：{sg["title"]}。', f'原题：{sg["exam"]}',
               f'台词源（唯一真源），由 mid/script/sp{n:02d}.py 导出；数值见 verify_sp{n:02d}.py。', '运行：python lines.py → script.json / lines.json', '"""',
               'import json', 'from pathlib import Path', '', 'LINES = [']
        for l in sg['lines']:
            if l['kind'] == 'line':
                for a, b in [('alpha', '阿尔法'), ('beta', '贝塔'), ('Span', '斯潘'), ('cos x', '余弦x'), ('sin x', '正弦x'), ('xy平面', 'x y平面')]: l['read'] = l['read'].replace(a, b)
            if l['kind'] == 'shot': out.append(f"    # 镜头：{l['text']}")
            elif l['kind'] == 'sfx': out.append(f"    # 音效：{l['name']}" + (f" @ {l['cue']}" if l.get('cue') else ''))
            else:
                kv = [f"id={l['id']!r}"] + ([f"mood={l['mood']!r}"] if 'mood' in l else []) + [f"pose={l['pose']!r}", f"sub={l['sub']!r}", f"read={l['read']!r}"] + ([f"post={l['post']}"] if 'post' in l else [])
                out.append('    dict(' + ', '.join(kv) + '),')
        out.append(']\n')
        (d / 'lines.py').write_text('\n'.join(out) + "\nif __name__ == '__main__':" + TPL_TAIL, encoding='utf-8')
        r = subprocess.run([sys.executable, 'lines.py'], cwd=d, capture_output=True, text=True)
        lat = sorted(set(re.findall(r'[A-Za-z]{2,}', ''.join(x['read'] for x in json.load(open(d / 'lines.json'))))))
        print(f'sp{n}/s{k}', sid, sg['title'], '|', r.stdout.strip() or r.stderr[-200:], '| latin:', lat)
