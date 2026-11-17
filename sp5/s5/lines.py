# -*- coding: utf-8 -*-
"""特别篇 5 · 第 5 段：多项式空间里换基。
原题：2024–25 第 6(b) 题：从 {1, x, x²} 到 {1−x², x+2, x²} 的过渡矩阵
台词源（唯一真源），由 mid/script/sp05.py 导出；数值见 verify_sp05.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2024–25 第 6 题 → 纸卡；(a) 问“张成 P₃”已在上一集讲过（贴回看标签）。
    dict(id='C01', pose='claude_point', sub='2024 到 2025 学年第 6 题第二问：从 {1, x, x²} 到 {1 − x², x + 2, x²} 的过渡矩阵。第一问“张成 P₃”上一集讲过了。', read='二零二四到二零二五学年第六题第二问：从一、x、x方，到一减x方、x加二、x方的过渡矩阵。第一问张成P三，上一集已经讲过了。'),
    # 镜头：三个多项式化身为三根 3D 箭头：1 − x² → (1, 0, −1)，x + 2 → (2, 1, 0)，x² → (0, 0, 1)，排成矩阵 P 的三列。
    dict(id='C02', pose='claude_explain', sub='多项式空间的老办法：翻译成系数向量。按 1, x, x² 的顺序：1 − x² → (1, 0, −1)；x + 2 → (2, 1, 0)；x² → (0, 0, 1)。', read='多项式空间的老办法：翻译成系数向量。按一、x、x方的顺序：一减x方，对应一、零、负一；x加二，对应二、一、零；x方，对应零、零、一。'),
    dict(id='C03', pose='claude_explain', sub='旧基 {1, x, x²} 翻译过来就是标准基 I。新基的系数向量排成列：P = [[1, 2, 0], [0, 1, 0], [−1, 0, 1]]。', read='旧基一、x、x方，翻译过来就是标准基，单位矩阵。新基的系数向量排成列：P等于一、二、零；零、一、零；负一、零、一。'),
    dict(id='C04', pose='claude_explain', sub='这就是上一段的“从标准基出发”。同济写法：答案就是 P。Leon 写法：答案是 P⁻¹。', read='这就是上一段的从标准基出发。同济写法：答案就是P。Leon写法：答案是P逆。'),
    dict(id='C05', pose='claude_write', sub='求 P⁻¹：[P | I] 消元，得 P⁻¹ = [[1, −2, 0], [0, 1, 0], [1, −2, 1]]。', read='求P逆：P增广单位矩阵消元，得到P逆等于：一、负二、零；零、一、零；一、负二、一。'),
    dict(id='D01', mood='think', pose='ds_ask', sub='P⁻¹ 的列是什么意思？', read='P逆的每一列，是什么意思？'),
    dict(id='C06', pose='claude_explain', sub='是旧基在新基下的坐标。第一列 (1, 0, 1)：1 = 1·(1 − x²) + 0·(x + 2) + 1·x²。拆开看：1 − x² + x² = 1。对！', read='是旧基在新基下的坐标。第一列一、零、一，意思是：一等于一倍的一减x方，加零倍的x加二，加一倍的x方。拆开看：一减x方加x方，等于一。对！'),
    # 镜头：第一列的验算以多项式“拼图”演示：1 − x² 与 x² 两块拼合，x² 项抵消，剩下常数 1。
    dict(id='G01', pose='gpt_think', sub='再验第二列 (−2, 1, −2)：−2(1 − x²) + (x + 2) − 2x² = −2 + 2x² + x + 2 − 2x² = x。正是旧基的第二个。', read='再验第二列，负二、一、负二：负二倍的一减x方，加上x加二，再减二倍x方，等于负二加二x方加x加二减二x方，等于x。正是旧基的第二个向量。'),
    dict(id='G02', pose='gpt_point', sub='答卷写法：先写“取系数向量，同构于 ℝ³”，写出 P，再写明按哪种定义给出 P 或 P⁻¹。', read='答卷写法：先写取系数向量，同构于R三；写出P；再写明按哪种定义，给出P或者P逆。'),
    # 镜头：套路卡：“多项式换基 = 翻成系数向量 → 从标准基出发；P 的列 = 新基坐标，P⁻¹ 的列 = 旧基坐标。”
    dict(id='C07', pose='claude_smile', sub='套路卡：多项式换基，先翻成系数向量，就变成从标准基出发；P 的列是新基，P⁻¹ 的列是旧基在新基下的坐标。', read='套路卡：多项式换基，先翻成系数向量，就变成从标准基出发；P的列是新基，P逆的列是旧基在新基下的坐标。', post=500),
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
