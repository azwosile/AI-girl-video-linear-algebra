# -*- coding: utf-8 -*-
"""特别篇 6 · 第 1 段：RREF 读心术。
原题：总论：行变换不改变列之间的线性关系
台词源（唯一真源），由 mid/script/sp06.py 导出；数值见 verify_sp06.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：开场：黑底上一个 3×4 矩阵 A 缓缓旋转，标题“压轴 · RREF 反推”盖章落下；右上角分值条：24 分 / 15 分 / 15 分 / 10 分。
    # 音效：slam @ 压轴
    dict(id='C01', pose='claude_point', sub='第六集，压轴。期中卷最后一道大题，十年里几乎每年都是同一个套路：给你 RREF，反推原矩阵。分值从 10 分到 24 分。', read='第六集，压轴。期中卷最后一道大题，十年里几乎每年都是同一个套路：给你RREF，反推原矩阵。分值从十分到二十四分。'),
    dict(id='D01', mood='panic', pose='ds_confused', sub='RREF 是简化行阶梯形……可是知道结果，怎么倒推回去？', read='RREF是简化行阶梯形。可是只知道结果，怎么倒推回去？'),
    dict(id='C02', pose='claude_explain', sub='靠一条定理，这一集所有题都只用它：行变换不改变列与列之间的线性关系。', read='靠一条定理，这一集所有的题都只用它：行变换，不改变列与列之间的线性关系。'),
    # 镜头：A 与 U 上下对齐，A 的列标 a₁…a₄（金），U 的列标 u₁…u₄（青）；U 的第 4 列 (−1, 1, 0) 发光，两条丝线连到第 1、3 列，丝线上写着 −1 和 +1；同样系数的丝线在 A 上复刻。
    dict(id='C03', pose='claude_explain', sub='为什么？行变换等于左乘一个可逆矩阵 E：U = EA。如果 A 的列满足 c₁a₁ + … + cₙaₙ = 0，也就是 Ac = 0，那么 Uc = EAc = 0。反过来也一样。', read='为什么？行变换等于左乘一个可逆矩阵E：U等于E乘A。如果A的列满足某个组合等于零，也就是A乘c等于零，那么U乘c等于E乘A乘c，也等于零。反过来也一样。'),
    dict(id='C04', pose='claude_explain', sub='所以 A 和 U 的零空间完全相同；列之间有什么关系，它们就有一模一样的关系。', read='所以A和U的零空间完全相同；A的列之间有什么关系，U的列之间就有一模一样的关系。'),
    dict(id='C05', pose='claude_point', sub='而 U 的关系一眼就能看出来。U 的第 4 列是 (−1, 1, 0)，意思就是 u₄ = −u₁ + u₃。那么 A 里必然有 a₄ = −a₁ + a₃。', read='而U的关系，一眼就能看出来。比如U的第四列是负一、一、零，意思就是u四等于负u一加u三。那么A里面，必然有a四等于负a一加a三。'),
    # 音效：pluck @ 丝线
    # 镜头：三张小卡依次弹出：①N(A) = N(U) ✓ ②行空间 R(Aᵀ) = R(Uᵀ) ✓ ③列空间 R(A) ≠ R(U) ✗（但主元列位置相同）。第三张卡带红框。
    dict(id='C06', pose='claude_explain', sub='三条推论。第一，N(A) = N(U)。第二，行空间相同：U 的行是 A 的行的组合，反过来也是。', read='三条推论。第一，A的零空间等于U的零空间。第二，行空间相同：U的行是A的行的组合，反过来也是。'),
    dict(id='C07', pose='claude_explain', sub='第三条最容易错：列空间不同！U 的列下面一堆零，A 的列不是。但主元列的位置相同，所以列空间的基要取 A 的主元列——原矩阵的列，不是 U 的列。', read='第三条最容易错：列空间不同！U的列下面一堆零，A的列不是。但是主元列的位置相同，所以列空间的基，要取A的主元列，是原矩阵的列，不是U的列。'),
    dict(id='G01', pose='gpt_point', sub='评分点：列空间的基写成 U 的主元列，这一问直接零分。每年都有人栽。', read='评分点：列空间的基写成U的主元列，这一问直接零分。每年都有人栽在这里。'),
    dict(id='D02', mood='think', pose='ds_think', sub='行空间用 U 的行，列空间用 A 的列。行用 U，列用 A。', read='行空间用U的行，列空间用A的列。行用U，列用A。'),
    dict(id='C08', pose='claude_smile', sub='这一句就是本集的口诀。', read='这一句，就是本集的口诀。'),
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
