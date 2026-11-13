# -*- coding: utf-8 -*-
"""字体：下载思源（Noto Serif SC / Noto Sans SC，SIL OFL）可变字体 → 固定字重 → 按项目实际用字子集化为 woff2。
用法：uv run --with fonttools --with brotli python pipeline/fonts.py
输出：assets/fonts/LA-Serif-Heavy.woff2、LA-Serif-Bold.woff2、LA-Sans-Medium.woff2
用字来源：engine/、ch*/ 下所有 .js .json .py 里出现的字符 + ASCII + 常用标点。新增文字后重跑。
"""
import re, urllib.request
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets' / 'fonts' / 'src'; SRC.mkdir(parents=True, exist_ok=True)
URL = {'serif': 'https://github.com/google/fonts/raw/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf',
       'sans': 'https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf',
       # 思源中文字体缺 ĵ（U+0135）和组合抑扬符（U+0302），用 Noto Sans 拉丁版兜底
       'latin': 'https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf'}
OUT = {'LA-Serif-Heavy': ('serif', 900), 'LA-Serif-Bold': ('serif', 700), 'LA-Sans-Medium': ('sans', 500),
       'LA-Latin-Medium': ('latin', 500), 'LA-Latin-Bold': ('latin', 700)}

for k, u in URL.items():
    f = SRC / f'{k}.ttf'
    if not f.exists():
        print('download', k); urllib.request.urlretrieve(u, f)

chars = set(chr(c) for c in range(32, 127)) | set('，。：；！？、（）—–·…「」『』“”‘’《》〈〉【】×÷−→←↑↓≠≤≥∞√∑∫∂∈ℝîĵk̂')
for p in list((ROOT / 'engine').rglob('*')) + list(ROOT.glob('ch*/**/*')):
    if p.suffix in ('.js', '.json', '.py', '.html') and p.is_file() and 'vendor' not in p.parts:
        chars |= set(p.read_text(encoding='utf-8', errors='ignore'))
text = ''.join(sorted(c for c in chars if c.isprintable()))
print('chars', len(text))
for name, (k, w) in OUT.items():
    font = TTFont(SRC / f'{k}.ttf')
    axes = {'wght': w}
    if 'fvar' in font and any(a.axisTag == 'wdth' for a in font['fvar'].axes): axes['wdth'] = 100
    font = instancer.instantiateVariableFont(font, axes)
    t = text if k != 'latin' else ''.join(c for c in text if ord(c) < 0x2E80)
    opt = subset.Options(); opt.flavor = 'woff2'; opt.layout_features = ['*']; opt.name_IDs = ['*']
    sub = subset.Subsetter(opt); sub.populate(text=t); sub.subset(font)
    dst = ROOT / 'assets' / 'fonts' / f'{name}.woff2'
    font.flavor = 'woff2'; font.save(dst)
    print(name, dst.stat().st_size // 1024, 'KB')
