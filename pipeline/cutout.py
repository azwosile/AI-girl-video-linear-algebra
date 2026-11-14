# -*- coding: utf-8 -*-
"""立绘抠图：从画布四边做泛洪，去掉纯黑（或纯白）底；闭运算 + 填洞，让和底色同色的内部暗部保持不透明。
用法：python pipeline/cutout.py <输入.png> <输出.png> [--bg black|white] [--h 1100]
"""
import argparse, numpy as np
from PIL import Image
from scipy import ndimage as ndi

ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--bg', default='auto'); ap.add_argument('--h', type=int, default=1100); ap.add_argument('--close', type=int, default=25)
a = ap.parse_args()
im = Image.open(a.src).convert('RGB'); x = np.asarray(im).astype(np.int16)[3:-3, 3:-3]  # 去掉生成图偶见的边缘细线
bg = a.bg
if bg == 'auto':
    c = np.concatenate([x[:8, :8].reshape(-1, 3), x[:8, -8:].reshape(-1, 3)]).mean()
    bg = 'white' if c > 128 else 'black'
cand = (x.max(2) < 16) if bg == 'black' else ((x.min(2) > 200) & (x.max(2) - x.min(2) < 22))
lab, _ = ndi.label(cand)
edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bgmask = np.isin(lab, list(edge))
fg = ~bgmask
k = a.close
yy, xx = np.ogrid[-k:k + 1, -k:k + 1]; disk = xx * xx + yy * yy <= k * k
fg = ndi.binary_closing(np.pad(fg, k + 2), structure=disk)[k + 2:-k - 2, k + 2:-k - 2]
fg = ndi.binary_fill_holes(fg)
# 去掉零碎小块：只保留面积 ≥ 最大块 2% 的连通区域
lab2, n2 = ndi.label(fg)
if n2 > 1:
    area = ndi.sum(fg, lab2, range(1, n2 + 1)); keep = [i + 1 for i, v in enumerate(area) if v >= 0.02 * area.max()]
    fg = np.isin(lab2, keep)
alpha = ndi.gaussian_filter(fg.astype(np.float32), 0.8)
# 画布边缘 4 px 内的底色像素一律透明（闭运算在边界上会留下细条）
rim = np.zeros_like(fg); rim[:4] = rim[-4:] = True; rim[:, :4] = rim[:, -4:] = True
alpha[rim & cand] = 0
rgba = np.dstack([x.astype(np.uint8), (np.clip(alpha, 0, 1) * 255).astype(np.uint8)])
out = Image.fromarray(rgba, 'RGBA')
bb = out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
out = out.crop(bb)
if out.height > a.h: out = out.resize((round(out.width * a.h / out.height), a.h), Image.LANCZOS)
out.save(a.dst, optimize=True)
print(a.dst, out.size, 'bg=' + bg)
