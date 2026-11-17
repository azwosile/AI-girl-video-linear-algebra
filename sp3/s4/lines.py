# -*- coding: utf-8 -*-
"""特别篇 3 · 第 4 段：零多的行列式 + 伴随的行列式。
原题：2018–19 第 5(a) 题：A=[[0,2,3,0],[0,4,5,0],[0,1,0,3],[2,0,1,3]]，求 det A 与 det(adj A)
台词源（唯一真源），由 mid/script/sp03.py 导出；数值见 verify_sp03.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2018–19 第 5(a) 题。矩阵中所有 0 渐渐变暗淡出，只留下非零元素组成的“骨架”。
    dict(id='C01', pose='claude_point', sub='回到 2018 到 2019 学年第 5 题的第一问。同一个 A，这次求 det A 和 det(adj A)。', read='回到二零一八到二零一九学年第五题的第一问。同一个A，这次求A的行列式，和A的伴随的行列式。'),
    dict(id='C02', pose='claude_explain', sub='零多的行列式，先找“最空”的行或列。第一列：(0, 0, 0, 2)，只有一个非零元素。', read='零多的行列式，先找最空的行或列。第一列是零、零、零、二，只有一个非零元素。'),
    # 镜头：发光折线：从 a₄₁ = 2 出发，划掉第 4 行第 1 列，剩下 3×3 子矩阵；再沿其第 3 列走到 3，划掉后剩 2×2。
    dict(id='C03', pose='claude_write', sub='按第一列展开：det A = 2 × (−1)⁴⁺¹ × M₄₁ = −2 M₄₁。M₄₁ 是划掉第 4 行第 1 列的 3 阶：[[2, 3, 0], [4, 5, 0], [1, 0, 3]]。', read='按第一列展开：A的行列式等于二，乘负一的四加一次方，乘M四一，也就是负二倍的M四一。M四一是划掉第四行、第一列剩下的三阶：二、三、零；四、五、零；一、零、三。'),
    dict(id='C04', pose='claude_write', sub='这个 3 阶的第三列也只有一个 3：按第三列展开，M₄₁ = 3 × (2 × 5 − 3 × 4) = 3 × (−2) = −6。', read='这个三阶的第三列也只有一个三：按第三列展开，M四一等于三乘以二乘五减三乘四，等于三乘负二，等于负六。'),
    dict(id='C05', pose='claude_point', sub='det A = −2 × (−6) = 12。', read='A的行列式等于负二乘负六，等于十二。'),
    dict(id='G01', pose='gpt_point', sub='符号是最大的坑：(−1)^(i+j)，第 4 行第 1 列是 (−1)⁵ = −1。考场上画一个正负号棋盘，从左上角的“+”开始交替。', read='符号是最大的坑：负一的i加j次方，第四行第一列是负一的五次方，等于负一。考场上画一个正负号的棋盘，从左上角的正号开始交替。'),
    # 镜头：正负号棋盘 4×4 铺开，(4,1) 位置的“−”被圈出。
    dict(id='C06', pose='claude_explain', sub='第二问，det(adj A)。还是从 A·adj A = |A| I 出发，两边取行列式：|A| · |adj A| = |A|⁴。', read='第二问，伴随矩阵的行列式。还是从A乘A的伴随等于A的行列式乘单位矩阵出发，两边取行列式：A的行列式乘伴随的行列式，等于A的行列式的四次方。'),
    dict(id='C07', pose='claude_explain', sub='|A| = 12 ≠ 0，可以约掉一个：|adj A| = |A|³ = 12³ = 1728。', read='A的行列式等于十二，不为零，可以约掉一个：伴随的行列式等于A的行列式的三次方，等于十二的三次方，一千七百二十八。'),
    dict(id='D01', mood='think', pose='ds_think', sub='所以一般就是 |adj A| = |A|ⁿ⁻¹？', read='所以一般地，伴随的行列式就等于A的行列式的n减一次方？'),
    dict(id='C08', pose='claude_smile', sub='对。但别死记 n − 1，每次从 A·adj A = |A| I 推一遍，五秒钟，不会错。', read='对。但别死记n减一，每次从A乘伴随等于A的行列式乘单位矩阵推一遍，五秒钟，不会错。'),
    # 镜头：套路卡：“先找最空的行列；符号棋盘；|adj A| 从 A·adj A = |A|I 推。”
    dict(id='G02', pose='gpt_proud', sub='套路卡：先找最空的行或列；符号看棋盘；伴随的行列式，从 A·adj A = |A| I 现推。', read='套路卡：先找最空的行或列；符号看棋盘；伴随的行列式，从A乘伴随等于A的行列式乘单位矩阵现推。', post=500),
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
