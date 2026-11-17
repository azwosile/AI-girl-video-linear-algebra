# -*- coding: utf-8 -*-
"""特别篇 2 · 第 3 段：LU 之后还要解 AX = B。
原题：2024–25 第 5 题（15 分）：A=[[2,1,1],[6,4,5],[4,1,3]]，B=[[3,0,−1],[0,1,0],[0,0,0]]；(a) LU (b) 解 AX=B (c) rank B 与列空间
台词源（唯一真源），由 mid/script/sp02.py 导出；数值见 verify_sp02.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2024–25 第 5 题 → 纸卡 → 排版，三问分三行。
    dict(id='C01', pose='claude_point', sub='2024 到 2025 学年第 5 题，15 分。三问：LU 分解；解矩阵方程 AX = B；B 的秩和列空间。', read='二零二四到二零二五学年第五题，十五分。三问：LU分解；解矩阵方程A X 等于B；B的秩和列空间。'),
    dict(id='C02', pose='claude_write', sub='A = [[2, 1, 1], [6, 4, 5], [4, 1, 3]]。第一列主元 2：r₂ − 3r₁ 得 (0, 1, 2)；r₃ − 2r₁ 得 (0, −1, 1)。', read='A的三行是：二、一、一；六、四、五；四、一、三。第一列主元是二：第二行减三倍第一行，得到零、一、二；第三行减两倍第一行，得到零、负一、一。'),
    dict(id='C03', pose='claude_write', sub='第二列主元 1：r₃ − (−1)r₂，得 (0, 0, 3)。', read='第二列主元是一：第三行减去负一倍的第二行，得到零、零、三。'),
    dict(id='C04', pose='claude_point', sub='L = [[1, 0, 0], [3, 1, 0], [2, −1, 1]]，U = [[2, 1, 1], [0, 1, 2], [0, 0, 3]]。', read='L的三行：一、零、零；三、一、零；二、负一、一。U的三行：二、一、一；零、一、二；零、零、三。'),
    dict(id='D01', mood='think', pose='ds_think', sub='第二问求 X，我直接 X = A⁻¹B，先求 A⁻¹……', read='第二问求X，我直接X等于A逆乘B，先求A的逆。'),
    dict(id='C05', pose='claude_explain', sub='可以。但题目先让你做 LU，就是在暗示：用 LU 解方程。AX = B 就是 LUX = B，拆成两步。', read='可以。但题目先让你做LU，就是在暗示：用LU解方程。A X 等于B，就是L U X 等于B，拆成两步。'),
    # 镜头：两道“瀑布”：左瀑布 Ly = b（从上往下，前代），右瀑布 Ux = y（从下往上，回代）。数字像水流一样一格一格落下。
    # 音效：pluck @ 前代
    dict(id='C06', pose='claude_explain', sub='令 UX = Y。先解 LY = B，从上往下——前代；再解 UX = Y，从下往上——回代。B 有三列，就对每一列各做一次。', read='令U X 等于Y。先解L Y 等于B，从上往下，叫前代；再解U X 等于Y，从下往上，叫回代。B有三列，就对每一列各做一次。'),
    dict(id='C07', pose='claude_write', sub='第一列 b = (3, 0, 0)。前代：y₁ = 3；3y₁ + y₂ = 0，y₂ = −9；2y₁ − y₂ + y₃ = 0，y₃ = −6 − 9 = −15。', read='第一列，b等于三、零、零。前代：y一等于三；三y一加y二等于零，y二等于负九；二y一减y二加y三等于零，y三等于负六减九，等于负十五。'),
    dict(id='C08', pose='claude_write', sub='回代：3x₃ = −15，x₃ = −5；x₂ + 2x₃ = −9，x₂ = 1；2x₁ + x₂ + x₃ = 3，x₁ = 7/2。', read='回代：三x三等于负十五，x三等于负五；x二加二x三等于负九，x二等于一；二x一加x二加x三等于三，x一等于二分之七。'),
    dict(id='C09', pose='claude_point', sub='所以 X 的第一列是 (7/2, 1, −5)。', read='所以X的第一列是二分之七、一、负五。'),
    dict(id='C10', pose='claude_write', sub='第二列 b = (0, 1, 0)，再走一遍。前代：y₁ = 0；3·0 + y₂ = 1，y₂ = 1；2·0 − 1 + y₃ = 0，y₃ = 1。', read='第二列，b等于零、一、零，再走一遍。前代：y一等于零；三乘零加y二等于一，y二等于一；二乘零减一加y三等于零，y三等于一。'),
    dict(id='C11', pose='claude_write', sub='回代：3x₃ = 1，x₃ = 1/3；x₂ + 2/3 = 1，x₂ = 1/3；2x₁ + 1/3 + 1/3 = 0，x₁ = −1/3。', read='回代：三x三等于一，x三等于三分之一；x二加三分之二等于一，x二等于三分之一；二x一加三分之一加三分之一等于零，x一等于负三分之一。'),
    dict(id='D02', mood='think', pose='ds_think', sub='前代的时候 L 对角线全是 1，不用除；回代才要除以主元。', read='前代的时候，L的对角线全是一，不用除；回代的时候才要除以主元。'),
    dict(id='C12', pose='claude_smile', sub='对，这就是 LU 的分工：L 管“怎么消”，U 管“主元是多少”。', read='对，这就是LU的分工：L管怎么消，U管主元是多少。'),
    # 镜头：第二、三列同样流程加速播放（1.5 倍），结果依次落入 X 的第二、三列。
    dict(id='C13', pose='claude_explain', sub='第二列、第三列同样做。结果：X = [[7/2, −1/3, −7/6], [1, 1/3, −1/3], [−5, 1/3, 5/3]]。', read='第二列、第三列同样做。结果：X的第一行二分之七、负三分之一、负六分之七；第二行一、三分之一、负三分之一；第三行负五、三分之一、三分之五。'),
    dict(id='G01', pose='gpt_point', sub='小观察：B 的第三列 (−1, 0, 0) 恰好是第一列的 −1/3 倍，所以 X 的第三列也是第一列的 −1/3 倍：(−7/6, −1/3, 5/3)。能省一次计算，也能当验算。', read='小观察：B的第三列负一、零、零，恰好是第一列的负三分之一倍，所以X的第三列也是第一列的负三分之一倍：负六分之七、负三分之一、三分之五。能省一次计算，也能拿来验算。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='线性真好用！', read='线性真好用！'),
    # 镜头：第三问：3D 坐标系，B 的三列 (3,0,0)、(0,1,0)、(−1,0,0) 三根箭头全部躺在 xy 平面上；xy 平面染成半透明橙色。
    dict(id='C14', pose='claude_explain', sub='第三问。B = [[3, 0, −1], [0, 1, 0], [0, 0, 0]]，第三行全零，第一列和第二列无关，第三列是第一列的倍数。所以 rank B = 2。', read='第三问。B的三行是三、零、负一；零、一、零；零、零、零。第三行全是零，第一列和第二列无关，第三列是第一列的倍数。所以B的秩等于二。'),
    dict(id='C15', pose='claude_explain', sub='列空间：三根列向量第三个分量都是 0，全躺在 xy 平面里，而且已经有两根无关——所以列空间就是整个 xy 平面，Span{e₁, e₂}，也就是 x₃ = 0。', read='列空间：三根列向量的第三个分量都是零，全躺在x y平面里，而且已经有两根无关，所以列空间就是整个x y平面，也就是e一和e二张成的空间，即x三等于零。'),
    dict(id='G02', pose='gpt_cross', sub='评分点：列空间要给“一组基”或“几何描述”。写“Span{(3,0,0)ᵀ, (0,1,0)ᵀ}”和“平面 x₃ = 0”都可以，只写“二维”不给分。', read='评分点：列空间要给出一组基，或者几何描述。写三零零和零一零张成的空间，或者写平面x三等于零，都可以。只写二维，不给分。'),
    # 镜头：套路卡：“AX = B → 先 LY = B 前代，再 UX = Y 回代；B 的列有关系，X 的列也有同样关系。”
    dict(id='C16', pose='claude_smile', sub='套路卡：有了 LU，解方程就是前代加回代；B 的列之间有什么关系，X 的列之间就有什么关系。', read='套路卡：有了LU，解方程就是前代加回代；B的列之间有什么关系，X的列之间就有什么关系。', post=500),
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
