# -*- coding: utf-8 -*-
"""特别篇 6 · 第 3 段：给 RREF 和三列，求剩下的列和 b。
原题：2024–25 第 4 题（15 分）：(A|b) 的 RREF=[[1,1,0,0,0|4],[0,0,1,1,0|−6],[0,0,0,0,1|3],[0,0,0,0,0|0]]；a₁=(1,−1,−2,0)，a₃=(1,0,0,1)，a₅=(1,1,3,3)
台词源（唯一真源），由 mid/script/sp06.py 导出；数值见 verify_sp06.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2024–25 第 4 题 → 纸卡。A 的五列以虚线框出现，只有第 1、3、5 列有数字，第 2、4 列和 b 是空框。
    dict(id='C01', pose='claude_point', sub='2024 到 2025 学年第 4 题。这次连 A 都不给全：只给增广矩阵的 RREF，和 A 的第 1、3、5 列。要求 N(A)、行空间、全部解，再把 a₂、a₄、b 补出来。', read='二零二四到二零二五学年第四题。这次连A都不给全：只给增广矩阵的RREF，和A的第一、三、五列。要求零空间、行空间、全部解，再把a二、a四和b补出来。'),
    dict(id='C02', pose='claude_explain', sub='RREF 三个非零行：(1, 1, 0, 0, 0 | 4)，(0, 0, 1, 1, 0 | −6)，(0, 0, 0, 0, 1 | 3)。主元在第 1、3、5 列，自由变量 x₂、x₄。', read='RREF的三个非零行：一、一、零、零、零，竖线四；零、零、一、一、零，竖线负六；零、零、零、零、一，竖线三。主元在第一、三、五列，自由变量是x二和x四。'),
    dict(id='D01', mood='panic', pose='ds_shock', sub='缺了两列，还能解？', read='缺了两列，还能解？'),
    dict(id='C03', pose='claude_smile', sub='能。前三问根本不需要 A——N(A) = N(U)，行空间也和 U 一样，全部解也只看 RREF。', read='能。前三问根本不需要A。A的零空间等于U的零空间，行空间也和U一样，全部解也只看RREF。'),
    dict(id='C04', pose='claude_write', sub='(a) N(A)：x₂ = s，x₄ = t，则 x₁ = −s，x₃ = −t，x₅ = 0。基：(−1, 1, 0, 0, 0) 和 (0, 0, −1, 1, 0)。', read='第一问，零空间：令x二等于s，x四等于t，则x一等于负s，x三等于负t，x五等于零。基是：负一、一、零、零、零，和零、零、负一、一、零。'),
    dict(id='C05', pose='claude_write', sub='行空间的基：三个非零行 (1, 1, 0, 0, 0)、(0, 0, 1, 1, 0)、(0, 0, 0, 0, 1)。', read='行空间的基：三个非零行，一、一、零、零、零；零、零、一、一、零；零、零、零、零、一。'),
    dict(id='C06', pose='claude_write', sub='(b) 全部解：自由变量取零，读右边一列，特解 (4, 0, −6, 0, 3)。x = (4, 0, −6, 0, 3) + s(−1, 1, 0, 0, 0) + t(0, 0, −1, 1, 0)。', read='第二问，全部解：自由变量取零，读出最右边一列，特解是四、零、负六、零、三。所以x等于四、零、负六、零、三，加s乘负一、一、零、零、零，再加t乘零、零、负一、一、零。'),
    # 镜头：丝线动画：U 第 2 列 (1, 0, 0) 连向第 1 列，系数 1；A 的虚线框 a₂ 被丝线连上 a₁ 后“填色”，数字流入。第 4 列同理。
    # 音效：shimmer @ 填色
    dict(id='C07', pose='claude_explain', sub='(c) 现在用读心术。U 的第 2 列是 (1, 0, 0)，等于第 1 列。所以 a₂ = a₁ = (1, −1, −2, 0)。', read='第三问，现在用读心术。U的第二列是一、零、零，和第一列一样。所以a二等于a一，就是一、负一、负二、零。'),
    dict(id='C08', pose='claude_explain', sub='U 的第 4 列是 (0, 1, 0)，等于第 3 列。所以 a₄ = a₃ = (1, 0, 0, 1)。', read='U的第四列是零、一、零，和第三列一样。所以a四等于a三，就是一、零、零、一。'),
    dict(id='D02', mood='think', pose='ds_think', sub='那 b 呢？b 也是增广矩阵的一列……', read='那b呢？b也是增广矩阵的一列。'),
    dict(id='C09', pose='claude_point', sub='对，丝线对 b 一样有效。b 那一列是 (4, −6, 3)，对应主元列 1、3、5，所以 b = 4a₁ − 6a₃ + 3a₅。', read='对，丝线对b一样有效。b那一列是四、负六、三，对应主元列一、三、五，所以b等于四a一减六a三加三a五。'),
    dict(id='C10', pose='claude_write', sub='逐分量：第一个 4 − 6 + 3 = 1；第二个 −4 + 0 + 3 = −1；第三个 −8 + 0 + 9 = 1；第四个 0 − 6 + 9 = 3。b = (1, −1, 1, 3)。', read='逐个分量算：第一个，四减六加三，等于一；第二个，负四加零加三，等于负一；第三个，负八加零加九，等于一；第四个，零减六加九，等于三。b等于一、负一、一、三。'),
    dict(id='G01', pose='gpt_think', sub='其实 b = A × 特解，和 (b) 问的特解是同一件事：4a₁ + 0a₂ − 6a₃ + 0a₄ + 3a₅。两问互相验证。', read='其实b等于A乘特解，和第二问的特解是同一件事：四a一加零a二减六a三加零a四加三a五。两问可以互相验证。'),
    dict(id='G02', pose='gpt_point', sub='评分点：写出“行变换保持列的线性关系”这一句，再写 a₂ = a₁。只写结果，老师可能扣过程分。', read='评分点：先写出行变换保持列的线性关系这一句，再写a二等于a一。只写结果，老师可能扣过程分。'),
    # 镜头：套路卡：“RREF 反推三板斧：N(A) 和行空间看 U；非主元列 = 主元列的组合（系数读 U 的列）；b 同理。”
    dict(id='C11', pose='claude_smile', sub='套路卡：零空间和行空间看 U；非主元列是主元列的组合，系数直接读 U 的那一列；b 也一样。', read='套路卡：零空间和行空间看U；非主元列是主元列的组合，系数直接读U的那一列；b也一样。'),
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
