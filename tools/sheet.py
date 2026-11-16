# 本地抽帧联系表：python tools/sheet.py spx/x1 [--at 0.6] [--ids C01 C02 ...] [--times 3 8.5]
# 每条台词取 起点 + at×时长 一帧；每 12 帧拼一张 4×3（每格 640×360）→ <段>/_sheets/sheet_N.png
import argparse, json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser(); ap.add_argument('seg'); ap.add_argument('--at', type=float, default=0.6)
ap.add_argument('--ids', nargs='*'); ap.add_argument('--times', nargs='*', type=float); ap.add_argument('--cols', type=int, default=4)
a = ap.parse_args(); seg = ROOT / a.seg
tl = json.loads((seg / 'out/timeline.json').read_text(encoding='utf-8')) if (seg / 'out/timeline.json').exists() else None
if a.times: pts = [(f'{t:.1f}', t) for t in a.times]
else:
    if tl is None:
        subprocess.run([sys.executable, str(ROOT / 'pipeline/render.py'), a.seg, '--frames', '0.5'], check=True)
        tl = json.loads((seg / 'out/timeline.json').read_text(encoding='utf-8'))
    L = tl['seq']
    pts = [(l['id'], l['vo'] + a.at * l['dur']) for l in L if not a.ids or l['id'] in a.ids]
out = seg / 'out/frames'
subprocess.run([sys.executable, str(ROOT / 'pipeline/render.py'), a.seg, '--frames', *[f'{t:.3f}' for _, t in pts], '--outdir', str(out)], check=True)
files = sorted(out.glob('*.jpg')) + sorted(out.glob('*.png'))
def find(t):
    return min(files, key=lambda f: abs(float(f.stem[1:]) - t))
sd = seg / '_sheets'; sd.mkdir(exist_ok=True)
for old in sd.glob('*.png'): old.unlink()
W, H, n = 640, 360, a.cols * 3
for k in range(0, len(pts), n):
    S = Image.new('RGB', (W * a.cols, H * 3), (0, 0, 0)); d = ImageDraw.Draw(S)
    for i, (name, t) in enumerate(pts[k:k + n]):
        im = Image.open(find(t)).convert('RGB').resize((W, H)); x, y = (i % a.cols) * W, (i // a.cols) * H
        S.paste(im, (x, y)); d.rectangle([x, y, x + 150, y + 26], fill=(0, 0, 0)); d.text((x + 6, y + 6), f'{name} {t:.1f}s', fill=(255, 210, 0))
    S.save(sd / f'sheet_{k // n + 1}.png'); print(sd / f'sheet_{k // n + 1}.png')
