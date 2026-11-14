# -*- coding: utf-8 -*-
"""配音前发音审查：把朗读稿过一遍 pron.apply，再用 GPT-SoVITS 自己的文本前端（LangSegmenter + g2pW，
复刻 TextPreprocessor 的 text_lang='zh' 分支）得到每个字实际送进模型的拼音，按规则查错。
用法（整合包 python）：$PY pipeline/g2p_lint.py ch01/s1_1 [ch01/s1_2 ...]
输出 <段>/qa_g2p.txt；有 ✗ 时退出码 1。
为什么需要它：asr.py 用无调拼音比对，pypinyin 把「行」默认读 xing，「行阶梯形」被读成 xíng 也会判 1.00。
"""
import json, os, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'pipeline'))
import pron
G = 'E:/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0'
os.chdir(G); sys.path.insert(0, G); sys.path.insert(0, G + '/GPT_SoVITS')
from text.cleaner import clean_text
from text.LangSegmenter import LangSegmenter


def front(t):
    tl, ll = [], []
    for tmp in LangSegmenter.getTexts(t):
        en = tmp['lang'] == 'en'
        if ll and (ll[-1] == 'en') == en: tl[-1] += tmp['text']
        else: ll.append('en' if en else 'zh'); tl.append(tmp['text'])
    chars = []  # (字, 音素串, 语种)
    for x, l in zip(tl, ll):
        ph, w2p, norm = clean_text(x.replace('%', '-').replace('￥', ','), l, 'v2')
        if l == 'zh':
            i = 0
            for ch, n in zip(norm, w2p): chars.append((ch, ''.join(ph[i:i + n]), 'zh')); i += n
        else:
            chars.append((x.strip(), ' '.join(p for p in ph if p not in ',.?!'), 'en'))
    return chars


# 硬规则：(字, 错误读音正则, 说明)。数学课里这些读音几乎不会是对的
HARD = [('行', r'^x', '行 读成 xíng（不在 xing_words 白名单里）'),
        ('得', r'5$', '得 读成轻声 de（得到 / 代入得 应读 dé）'),
        ('数', r'3$', '数 读成 shǔ（名词「数」应读 shù）'),
        ('几', r'1$', '几 读成 jī（几个 / 取几 应读 jǐ）'),
        ('当', r'4$', '当 读成 dàng（若尔当 / 当时 应读 dāng；当成 / 当作 读 dàng 是对的，已放行）'),
        ('乘', r'^sh', '乘 读成 shèng'),
        ('模', r'^m.*o', '模 读成 mó（模样 / 一模一样 应读 mú；模长 读 mó 可忽略）')]
# 只在这些上下文里才算错（值得 / 觉得 / 记得 读轻声是对的）
CTX = {'得': lambda prev, nxt: nxt == '到' or (prev != '' and prev in '入出求解'),
       '当': lambda prev, nxt: nxt == '' or nxt not in '成作做'}


def ctx_ok(cs, i, c):
    f = CTX.get(c)
    if not f: return True
    prev = cs[i - 1][0] if i > 0 else ''
    nxt = cs[i + 1][0] if i + 1 < len(cs) else ''
    return f(prev[-1:] if prev else '', nxt[:1] if nxt else '')


SOFT = set('转和重为调长差处似角降朝藏传空曲省率占着了还只相种便')


def lint(seg):
    sc = json.loads((ROOT / seg / 'script.json').read_text(encoding='utf-8'))
    rep, nbad = [], 0
    for k, (read, _m) in sc.items():
        t = pron.apply(read)
        cs = front(t)
        bad, soft = [], []
        xing_ok = sum(t.count(w) for w in pron.XING if '行' in w)
        nx = 0
        for idx, (ch, p, l) in enumerate(cs):
            if l == 'en':
                if not p.strip(): bad.append(f'英文片段「{ch}」被吞掉（没有音素）')
                continue
            if ch == '行' and p.startswith('x'):
                nx += 1
                if nx <= xing_ok: continue
            for c, pat, why in HARD:
                if ch == c and re.search(pat, p) and ctx_ok(cs, idx, c): bad.append(f'{why}：{ch}={p}')
            if ch in SOFT: soft.append(f'{ch}={p}')
        flag = '✗' if bad else 'OK'
        nbad += bool(bad)
        rep.append(f'{flag} {k} | 送字: {t}' + ''.join(f'\n      ✗ {b}' for b in bad)
                   + (f'\n      · 复核: {" ".join(soft)}' if soft else ''))
    (ROOT / seg / 'qa_g2p.txt').write_text('\n'.join(rep) + f'\n\n✗ {nbad} 句\n', encoding='utf-8')
    return nbad, rep


if __name__ == '__main__':
    total = 0
    for seg in sys.argv[1:]:
        n, rep = lint(seg); total += n
        print(f'== {seg}: ✗ {n} 句'); print('\n'.join(r for r in rep if r.startswith('✗')))
    print('G2P_LINT', 'FAIL' if total else 'PASS', total)
    sys.exit(1 if total else 0)
