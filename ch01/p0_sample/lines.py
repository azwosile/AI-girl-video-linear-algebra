# -*- coding: utf-8 -*-
"""第 1 章 · 30 秒样片「矩阵即变换」台词源（唯一真源）。
字段：id（首字母=说话人 C/G/D）、sub（字幕，真实符号）、read（朗读稿）、mood（大肥鱼参考音情绪）
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='think', sub='老师，矩阵不就是一堆排好的数字吗？'),
    dict(id='C01', sub='换个角度看：矩阵描述的，是整个平面怎么变形。'),
    dict(id='C02', sub='先盯住两个基向量：î 落到 (2, 1)，ĵ 落到 (−1, 1)。',
         read='先盯住两个基向量：i帽落到二、一，j帽落到负一、一。'),
    dict(id='C03', sub='整张网格跟着它们走——直线还是直线，原点不动。',
         read='整张网格跟着它们走，直线还是直线，原点不动。'),
    dict(id='C04', sub='所以矩阵的两列，就是 î 和 ĵ 的落点。',
         read='所以矩阵的两列，就是i帽和j帽的落点。'),
    dict(id='D02', mood='daily', sub='那随便一个向量呢？'),
    dict(id='C05', sub='v = (1, 2)：一倍第一列，加两倍第二列，落到 (0, 3)。',
         read='比如向量一、二：一倍第一列，加两倍第二列，落到零、三。'),
    dict(id='G01', sub='到了三维也一样——只是多一列罢了。',
         read='到了三维也一样，只是多一列罢了。'),
]

if __name__ == '__main__':
    here = Path(__file__).resolve().parent
    for l in LINES:
        l.setdefault('read', l['sub'])
        l.setdefault('mood', None)
    (here / 'script.json').write_text(json.dumps({l['id']: [l['read'], l['mood']] for l in LINES}, ensure_ascii=False, indent=1), encoding='utf-8')
    (here / 'lines.json').write_text(json.dumps(LINES, ensure_ascii=False, indent=1), encoding='utf-8')
    print(len(LINES), 'lines,', sum(len(l['read']) for l in LINES), 'chars')
