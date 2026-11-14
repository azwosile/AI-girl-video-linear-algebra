# -*- coding: utf-8 -*-
"""第 1 章 §1.6 分块矩阵（Leon 9th §1.6 Partitioned Matrices：按列 / 按行分块、Block Multiplication Case 1–4、例 1、
例 2 分块对角矩阵、Outer Product Expansions：内积 / 外积、例 3；同济第六版 第二章 矩阵分块法）台词源（唯一真源）。
3B1B 对应：色块代替元素做乘法；AB 的每一列 = A 搬运 B 的每一列；外积 = 把平面压到一条直线上的「图层」，XYᵀ = 图层叠加。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='sigh', pose='ds_confused', sub='矩阵一大，乘起来就眼花。能不能把它切成小块，一块一块算？', read='矩阵一大，乘起来就眼花。能不能把它切成小块，一块一块算？'),
    dict(id='C01', pose='claude_smile', sub='能。用横线和竖线把矩阵切开，每一块叫子矩阵，整个矩阵就叫分块矩阵。', read='能。用横线和竖线把矩阵切开，每一块叫子矩阵，整个矩阵就叫分块矩阵。'),
    # —— 按列
    dict(id='C02', pose='claude_explain', sub='最简单的切法：把 B 按列切开。A 乘 B，就是 A 分别乘 B 的每一列，再并排放好。', read='最简单的切法：把B按列切开。A乘B，就是A分别乘B的每一列，再并排放好。'),
    dict(id='C03', pose='claude_point', sub='教材的例子：A 乘 B 的第一列得 (6, −2)，乘第二列得 (15, −1)，乘第三列得 (5, 1)。三列拼起来就是 AB。', read='教材的例子：A乘B的第一列，是六、负二；乘第二列，是十五、负一；乘第三列，是五、一。三列拼起来，就是A B。'),
    dict(id='C04', pose='claude_explain', sub='这和第三节的几何是一回事：B 的每一列是一个向量，A 把它们一个个送到新位置。', read='这和第三节的几何是一回事：B的每一列是一个向量，A把它们一个个送到新位置。'),
    dict(id='C05', pose='claude_point', sub='特别地，A 乘单位矩阵的第 j 列，就是 A 的第 j 列。A 的每一列，正是 î、ĵ 被送到的地方。', read='特别地，A乘单位矩阵的第j列，就是A的第j列。A的每一列，正是i帽、j帽被送到的地方。'),
    dict(id='D02', mood='daily', pose='ds_ask', sub='那按行切呢？', read='那按行切呢？'),
    dict(id='C06', pose='claude_explain', sub='也行。AB 的第 i 行，就是 A 的第 i 行乘 B。', read='也行。A B的第i行，就是A的第i行乘B。'),
    dict(id='C07', pose='claude_point', sub='例子：A 的第一行是 (2, 5)，乘 B 得 (1, 9, −1)。三行各算各的，摞起来就是 AB。', read='例子：A的第一行是二、五，乘B，是一、九、负一。三行各算各的，摞起来就是A B。'),
    # —— 一般分块
    dict(id='C08', pose='claude_explain', sub='再一般一点：横竖都切。这时把每一块当成一个数，照普通矩阵乘法的规则来乘。', read='再一般一点：横竖都切。这时把每一块当成一个数，照普通矩阵乘法的规则来乘。'),
    dict(id='C09', pose='claude_point', sub='左上角那块 = A₁₁B₁₁ + A₁₂B₂₁。和 2×2 矩阵的公式一模一样，只是每个字母都是一块。', read='左上角那块，等于A一一乘B一一，加上A一二乘B二一。和二乘二矩阵的公式一模一样，只是每个字母都是一块。'),
    dict(id='C24', pose='claude_think', sub='注意：块是矩阵，乘的顺序不能换。必须是 A₁₂B₂₁，不能写成 B₂₁A₁₂。', read='注意：块是矩阵，乘的顺序不能换。必须是A一二乘B二一，不能写成B二一乘A一二。'),
    dict(id='D03', mood='panic', pose='ds_shock', sub='块和块也能乘？尺寸对不上怎么办？！', read='块和块也能乘？尺寸对不上怎么办？'),
    dict(id='C10', pose='claude_think', sub='所以有个条件：A 的列怎么切，B 的行就必须怎么切。这样每一对块相乘，尺寸都对得上。', read='所以有个条件：A的列怎么切，B的行就必须怎么切。这样每一对块相乘，尺寸都对得上。'),
    dict(id='C11', pose='claude_explain', sub='教材例 1：A 是 3×4，B 是 4×4。A 的列切成 2 + 2，B 的行也切成 2 + 2。', read='教材例一：A是三行四列，B是四行四列。A的列切成二加二，B的行也切成二加二。'),
    dict(id='C12', pose='claude_point', sub='四个块分别算，再拼回去，结果和直接相乘完全一样：第一行是 (8, 6, 4, 5)。', read='四个块分别算，再拼回去，结果和直接相乘完全一样：第一行是八、六、四、五。'),
    dict(id='G01', pose='gpt_explain', sub='小技巧：竖着切 A、横着切 B，乘积就是两块乘积之和：A₁B₁ + A₂B₂。后面的外积就从这里来。', read='小技巧：竖着切A、横着切B，乘积就是两块乘积之和：A一B一加A二B二。后面的外积，就从这里来。'),
    # —— 分块对角
    dict(id='C13', pose='claude_explain', sub='分块最好用的地方之一：分块对角矩阵。左上一块、右下一块，其余全是 0。', read='分块最好用的地方之一：分块对角矩阵。左上一块、右下一块，其余全是零。'),
    dict(id='C14', pose='claude_point', sub='教材例 2：它可逆，当且仅当两个对角块都可逆；逆矩阵就是两块分别求逆，原位放好。', read='教材例二：它可逆，当且仅当两个对角块都可逆；逆矩阵就是两块分别求逆，原位放好。'),
    dict(id='C15', pose='claude_smile', sub='两块各管各的坐标，互不干扰，所以撤销的时候也能各撤各的。', read='两块各管各的坐标，互不干扰，所以撤销的时候，也能各撤各的。'),
    # —— 内积 / 外积
    dict(id='D04', mood='think', pose='ds_ask', sub='那内积、外积又是什么？', read='那内积、外积又是什么？'),
    dict(id='C16', pose='claude_explain', sub='两个列向量 x、y。xᵀy 是一行乘一列，得到一个数，叫内积。矩阵乘法的每个元素，都是一次内积。', read='两个列向量x、y。x转置乘y，是一行乘一列，得到一个数，叫内积。矩阵乘法的每个元素，都是一次内积。'),
    dict(id='C17', pose='claude_point', sub='反过来，xyᵀ 是一列乘一行，得到一整个矩阵，叫外积。', read='反过来，x乘y转置，是一列乘一行，得到一整个矩阵，叫外积。'),
    dict(id='C18', pose='claude_point', sub='教材例子：x = (4, 1, 3)，y = (3, 5, 2)。外积的每一行都是 (3, 5, 2) 的倍数，每一列都是 x 的倍数。', read='教材例子：x是四、一、三，y是三、五、二。外积的每一行，都是三、五、二的倍数；每一列，都是x的倍数。'),
    dict(id='C19', pose='claude_think', sub='所以外积是最简单的矩阵：所有列都在同一条直线上，它把整个平面压成一条线。', read='所以外积是最简单的矩阵：所有列都在同一条直线上，它把整个平面压成一条线。'),
    dict(id='C20', pose='claude_explain', sub='再用上 GPT 的技巧：X 按列切，Yᵀ 按行切，XYᵀ 就拆成一串外积相加。这叫外积展开。', read='再用上GPT的技巧：X按列切，Y转置按行切，X乘Y转置，就拆成一串外积相加。这叫外积展开。'),
    dict(id='C21', pose='claude_point', sub='教材例 3：第一层是 (3, 2, 1) 乘 (1, 2, 3)，第二层是 (1, 4, 2) 乘 (2, 4, 1)。两层加起来，就是 XYᵀ。', read='教材例三：第一层是三二一，乘一二三；第二层是一四二，乘二四一。两层加起来，就是X乘Y转置。'),
    dict(id='C22', pose='claude_smile', sub='把外积想成图层：每一层都很简单，叠在一起就成了复杂的矩阵。第六章会用它压缩图片。', read='把外积想成图层：每一层都很简单，叠在一起，就成了复杂的矩阵。第六章会用它压缩图片。'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='就像修图软件里叠图层！', read='就像修图软件里叠图层！'),
    dict(id='G02', pose='gpt_proud', sub='同济对照：这些在同济第二章的“矩阵分块法”。同济也讲分块对角矩阵求逆，结论和例 2 一样。', read='同济对照：这些在同济第二章的矩阵分块法。同济也讲分块对角矩阵求逆，结论和例二一样。'),
    # —— 总结
    dict(id='D06', mood='easy', pose='ds_happy', sub='我来总结！分块就是把块当成数来乘，前提是 A 的列切法和 B 的行切法一致。', read='我来总结！分块就是把块当成数来乘，前提是A的列切法，和B的行切法一致。'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='对角分块各自求逆；外积是一列乘一行，矩阵等于一层层外积叠起来！', read='对角分块各自求逆；外积是一列乘一行，矩阵等于一层层外积叠起来！'),
    dict(id='C23', pose='claude_smile', sub='完全正确。第一章的内容到这里就讲完了。下一集，我们拿真题来练练手。', read='完全正确。第一章的内容到这里就讲完了。下一集，我们拿真题来练练手。'),
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
