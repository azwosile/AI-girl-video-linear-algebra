# -*- coding: utf-8 -*-
"""第 1 章 · 预览版「矩阵即变换」（约 1 分钟，讲解加细）台词源（唯一真源）。
字段：id（首字母=说话人 C/G/D）、sub（字幕，真实符号）、read（朗读稿）、mood（大肥鱼参考音情绪）、pose（立绘差分）
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='think', pose='ds_ask', sub='老师，矩阵不就是一堆排好的数字吗？'),
    dict(id='C01', pose='claude_explain', sub='数字只是外表。其实矩阵是一个动作：让整个平面变形。'),
    dict(id='C02', pose='claude_point', sub='先认识两个基向量：î 指向 (1, 0)，ĵ 指向 (0, 1)。',
         read='先认识两个基向量：i帽指向一、零，j帽指向零、一。'),
    dict(id='C03', pose='claude_point', sub='平面上每个点都能用它俩拼出来：(3, 2) 就是 3 个 î 加 2 个 ĵ。',
         read='平面上每个点都能用它俩拼出来，比如三、二，就是三个i帽加两个j帽。'),
    dict(id='D02', mood='daily', pose='ds_ask', sub='那平面一变形，网格不会乱成一团吗？'),
    dict(id='C04', pose='claude_explain', sub='不会。线性变换有三条规矩：直线还是直线，平行且等距，原点不动。'),
    dict(id='C05', pose='claude_think', sub='所以只要知道 î 和 ĵ 落到哪儿，整张网格就定了。',
         read='所以只要知道i帽和j帽落到哪儿，整张网格就定了。'),
    dict(id='C06', pose='claude_point', sub='比如让 î 落到 (2, 1)，ĵ 落到 (−1, 1)。',
         read='比如让i帽落到二、一，j帽落到负一、一。'),
    dict(id='C07', pose='claude_point', sub='看——整张网格跟着它们走。', read='看，整张网格跟着它们走。'),
    dict(id='C08', pose='claude_explain', sub='把两个落点竖着并排写，就是矩阵 A：第一列记 î，第二列记 ĵ。',
         read='把两个落点竖着并排写，就是矩阵A：第一列记i帽，第二列记j帽。'),
    dict(id='D03', mood='think', pose='ds_ask', sub='那随便拿一个向量，比如 (1, 2)，它会去哪儿？',
         read='那随便拿一个向量，比如一、二，它会去哪儿？'),
    dict(id='C09', pose='claude_think', sub='它本来是 1 个 î 加 2 个 ĵ，变换后这个配方不变。',
         read='它本来是一个i帽加两个j帽，变换后这个配方不变。'),
    dict(id='C10', pose='claude_point', sub='所以它落到 1 倍第一列加 2 倍第二列，也就是 (0, 3)。',
         read='所以它落到一倍第一列加两倍第二列，也就是零、三。'),
    dict(id='G01', pose='gpt_proud', sub='这就是矩阵乘向量。三维也一样，只是多一列。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='原来矩阵记的是基向量的去向！'),
]

if __name__ == '__main__':
    here = Path(__file__).resolve().parent
    for l in LINES:
        l.setdefault('read', l['sub'])
        l.setdefault('mood', None)
    (here / 'script.json').write_text(json.dumps({l['id']: [l['read'], l['mood']] for l in LINES}, ensure_ascii=False, indent=1), encoding='utf-8')
    (here / 'lines.json').write_text(json.dumps(LINES, ensure_ascii=False, indent=1), encoding='utf-8')
    print(len(LINES), 'lines,', sum(len(l['read']) for l in LINES), 'chars')
