# -*- coding: utf-8 -*-
"""原题裁切：sp/exam_crops.json → assets/exam/<key>.png（暖色纸感，竖直拼接多块）。
用法：python tools/exam_crop.py <页图目录> [key ...]   页图为 <名>.jpg/png（线代期中/_extract/img 或 .midimg）"""
import json, sys
from pathlib import Path
from PIL import Image, ImageOps
ROOT = Path(__file__).resolve().parents[1]
spec = json.loads((ROOT / 'sp/exam_crops.json').read_text(encoding='utf-8'))
src = Path(sys.argv[1]); keys = sys.argv[2:] or [k for k in spec if not k.startswith('_')]
out = ROOT / 'assets/exam'; out.mkdir(parents=True, exist_ok=True)
PAPER, INK = (242, 230, 208), (34, 26, 20)
def page(n):
    for ext in ('.png', '.jpg'):
        p = src / (n + ext)
        if p.exists(): return Image.open(p).convert('L')
    raise FileNotFoundError(n)
for k in keys:
    parts = []
    for n, x0, y0, x1, y1 in spec[k]['src']:
        im = page(n); W, H = im.size
        parts.append(im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H))))
    w = max(p.width for p in parts); h = sum(p.height for p in parts) + 8 * (len(parts) - 1)
    g = Image.new('L', (w, h), 255); y = 0
    for p in parts: g.paste(p, (0, y)); y += p.height + 8
    g = ImageOps.autocontrast(g, cutoff=1)
    ImageOps.colorize(g, INK, PAPER).save(out / f'{k}.png', optimize=True)
    print(k, g.size)
