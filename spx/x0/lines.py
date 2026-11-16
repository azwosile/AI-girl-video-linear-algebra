# -*- coding: utf-8 -*-
"""特别篇 · 期中速成 x0：开场 + 考点热力图 + 路线图。
热力图分值（七份期中卷，每份 100 分，按题型归并，判断/填空按小题折算）见 scene.js HEAT。
行合计：RREF/零空间 106，矩阵运算与逆 103，线性相关 101，行列式 97，判断 92，过渡 80，子空间 79，含参 42。
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='欢迎来到特别篇·期中速成版。九十分钟，把七份期中卷里最该拿的分，一口气拿下。', read='欢迎来到特别篇，期中速成版。九十分钟，把七份期中卷里最该拿的分，一口气拿下。'),
    dict(id='D01', mood='panic', pose='ds_shock', sub='九十分钟？我还有一章没看完……', read='九十分钟？我还有一章没看完呢。'),
    dict(id='G01', pose='gpt_point', sub='所以才叫速成。今年期中只考前三章：线性方程组、行列式、向量空间。', read='所以才叫速成。今年期中只考前三章：线性方程组、行列式、向量空间。'),
    dict(id='C02', pose='claude_explain', sub='先看这张热力图。横着是七份期中卷，竖着是八类题型，格子越亮，分值越高。每份卷子都是 100 分。', read='先看这张热力图。横着是七份期中卷，竖着是八类题型，格子越亮，分值越高。每份卷子都是一百分。'),
    dict(id='C03', pose='claude_point', sub='把每一行加起来：最热的四块是 RREF 与零空间、矩阵运算与逆、线性相关、行列式，每块都在 100 分上下。', read='把每一行加起来：最热的四块，是RREF与零空间、矩阵运算与逆、线性相关、行列式，每一块都在一百分上下。'),
    dict(id='C04', pose='claude_explain', sub='再看列：子空间七份卷子全都考了；过渡矩阵七份里考了六份，而且一考就是 12 到 15 分的大题。', read='再看列：子空间，七份卷子全都考了；过渡矩阵，七份里考了六份，而且一考就是十二到十五分的大题。'),
    dict(id='D02', mood='think', pose='ds_think', sub='判断题也很亮……五份卷子都有，最多一份 25 分。', read='判断题也很亮，五份卷子都有，最多的一份二十五分。'),
    dict(id='C05', pose='claude_smile', sub='对，所以最后一段专门打判断题。路线图是这样的——', read='对，所以最后一段，专门打判断题。路线图是这样的。'),
    dict(id='C06', pose='claude_explain', sub='第一段含参方程组，第二段 LU 与逆，第三段行列式，第四段子空间。', read='第一段，含参方程组；第二段，LU与逆；第三段，行列式；第四段，子空间。'),
    dict(id='C07', pose='claude_explain', sub='第五段线性相关，第六段过渡矩阵，第七段压轴的 RREF 反推，第八段判断题闪电战加考前十条。', read='第五段，线性相关；第六段，过渡矩阵；第七段，压轴的RREF反推；第八段，判断题闪电战，再加考前十条。'),
    dict(id='C08', pose='claude_point', sub='每道题固定四拍：原题上屏 → 一句话套路 → 动画演示关键一步 → 答案和评分点。', read='每道题固定四拍：原题上屏，一句话套路，动画演示关键一步，最后是答案和评分点。'),
    dict(id='G02', pose='gpt_explain', sub='每段结尾有一张套路卡，一共十一张。考前把十一张卡过一遍，就是最好的复习提纲。', read='每段结尾都有一张套路卡，一共十一张。考前把十一张卡过一遍，就是最好的复习提纲。'),
    dict(id="C08a", pose="claude_point", sub="用法建议：每道题原题上屏时先按暂停，自己做两分钟，再往下看。卡住的那一步，就是你最该记的。", read="用法建议：每道题的原题上屏时，先按暂停，自己做两分钟，再往下看。被卡住的那一步，就是你最该记住的。"),
    dict(id="G02a", pose="gpt_explain", sub="每道题最后都有验算：代回去，或者抽查一格。考场上留两分钟验算，是最便宜的保分手段。", read="每道题最后都有验算：代回去，或者抽查一格。考场上留两分钟验算，是最便宜的保分手段。"),
    dict(id="D02a", pose="ds_think", sub="那遇到完全不会的题呢？", read="那遇到完全不会的题呢？", mood="think"),
    dict(id="C08b", pose="claude_explain", sub="先写能写的：定义、消元第一步、套路卡的第一行。大题按步骤给分，写对一半，就有一半的分。", read="先写能写的：定义、消元的第一步、套路卡的第一行。大题按步骤给分，写对一半，就有一半的分。"),
    dict(id='D03', mood='easy', pose='ds_proud', sub='好！我准备好了！', read='好！我准备好了！'),
    dict(id='C09', pose='claude_smile', sub='那就开始。第一段：含参方程组。', read='那就开始。第一段：含参方程组。'),
]
if __name__ == '__main__':
    here = Path(__file__).resolve().parent
    for l in LINES:
        l.setdefault('read', l['sub'])
        l.setdefault('mood', None)
    ids = [l['id'] for l in LINES]; assert len(ids) == len(set(ids)), '台词 id 重复'
    (here / 'script.json').write_text(json.dumps({l['id']: [l['read'], l['mood']] for l in LINES}, ensure_ascii=False, indent=1), encoding='utf-8')
    (here / 'lines.json').write_text(json.dumps(LINES, ensure_ascii=False, indent=1), encoding='utf-8')
    print(len(LINES), 'lines,', sum(len(l['read']) for l in LINES), 'chars')
