# -*- coding: utf-8 -*-
"""朗读稿发音修正（GSV 送字前）。规则表见 pipeline/pron.json。tts.py / g2p_lint.py / asr.py 共用。"""
import json, os, re
from pathlib import Path

_P = json.loads((Path(__file__).resolve().parent / 'pron.json').read_text(encoding='utf-8'))
XING = sorted(_P['xing_words'], key=len, reverse=True)
RULES = [(re.compile(a), b) for a, b in _P['rules']]
NAMES = {'Claude': '克劳德', 'GPT': 'G P T', 'DeepSeek': '深度求索'}


def fix_hang(s):
    """行 → 航，xing_words 里的词保留 xíng。"""
    keep = []
    def hold(m):
        keep.append(m.group(0)); return f'\x00{len(keep) - 1}\x00'
    if XING: s = re.sub('|'.join(map(re.escape, XING)), hold, s)
    s = s.replace('行', '航')
    return re.sub(r'\x00(\d+)\x00', lambda m: keep[int(m.group(1))], s)


def apply(text):
    for a, b in NAMES.items(): text = text.replace(a, b)
    if os.environ.get('PRON_OFF'): return text  # 审查旧配音：看不加修正时 GSV 会怎么读
    for r, b in RULES: text = r.sub(b, text)
    return fix_hang(text)
