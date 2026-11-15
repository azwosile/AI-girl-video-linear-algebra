# -*- coding: utf-8 -*-
"""第 3 章 3.6a 行空间与列空间（Leon 9th §3.6 前半：定义、例 1、定理 3.6.1、秩、例 2、定理 3.6.2/3.6.3、推论 3.6.4、列空间的基 例 3/4）台词源（唯一真源）。
3B1B 第 7 集画面：列空间 = 变换后能到达的所有地方；ℝ³ 被压成平面，b 不在平面上 ⇒ 无解。
数值：例 2 A = [[1,−2,3],[2,−5,1],[1,−4,−7]] → U 行 (1,−2,3)、(0,1,5)，秩 2；例 3 a₂ = 2a₁，a₄ = 3a₁ + 2a₃；例 4 主元列 1、2、5。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='一个 m×n 矩阵，横着看是 m 个行向量，竖着看是 n 个列向量。各自张成一个空间。', read='一个m行n列的矩阵，横着看，是m个行向量；竖着看，是n个列向量。它们各自张成一个空间。'),
    dict(id='C02', pose='claude_explain', sub='行向量张成的，叫行空间，由 1×n 的行组成；列向量张成的，叫列空间，在 ℝᵐ 里。', read='行向量张成的，叫行空间，住在R一乘n里；列向量张成的，叫列空间，住在R m里。'),
    dict(id='C03', pose='claude_point', sub='例 1：A = [[1, 0, 0], [0, 1, 0]]。行空间是 (α, β, 0)，三维行向量里的一张平面；列空间是整个 ℝ²。', read='教材例一：A的两行是一、零、零和零、一、零。行空间是所有阿尔法、贝塔、零，一张平面；列空间呢，是整个R二。'),
    dict(id='D01', mood='think', pose='ds_think', sub='行空间二维，列空间也二维……巧合吗？', read='行空间是二维，列空间也是二维，这是巧合吗？'),
    dict(id='C04', pose='claude_smile', sub='不是巧合，下一节证明它们永远相等。先看行空间怎么求。', read='不是巧合，下一节会证明，它们永远相等。先看行空间怎么求。'),
    dict(id='C05', pose='claude_explain', sub='定理 3.6.1：行等价的矩阵，行空间相同。', read='定理三点六点一：行等价的矩阵，行空间相同。'),
    dict(id='C06', pose='claude_point', sub='每一次行变换，新的行都是旧行的线性组合；而行变换又可以倒回去。所以两边的行空间互相包含。', read='因为每一次行变换，新的行都是旧行的线性组合；而行变换又都可以倒回去。所以两边的行空间互相包含，也就相等。'),
    dict(id='C07', pose='claude_explain', sub='于是：化成行阶梯形，非零行就是行空间的一组基。行空间的维数，叫矩阵的秩。', read='于是，求行空间就简单了：化成行阶梯形，非零的那些行，就是行空间的一组基。行空间的维数，叫作矩阵的秩。'),
    dict(id='C08', pose='claude_point', sub='例 2：三行三列的 A，化成阶梯形 U，剩下 (1, −2, 3) 和 (0, 1, 5) 两行，第三行变成零。', read='教材例二：一个三行三列的矩阵A，化成阶梯形U，剩下一、负二、三，和零、一、五，这两个非零行，第三行变成了零。'),
    dict(id='C09', pose='claude_explain', sub='所以这两行是行空间的基，rank(A) = 2。', read='所以这两行，是行空间的一组基，A的秩等于二。'),
    dict(id='C10', pose='claude_explain', sub='再看列空间。把 Ax 按列展开：x₁ 乘第一列，加 x₂ 乘第二列……就是列向量的线性组合。', read='再看列空间。把A x按列展开：x一乘第一列，加上x二乘第二列，一直加下去，这就是列向量的线性组合。'),
    dict(id='C11', pose='claude_point', sub='所以，Ax 能到达的所有地方，正好就是列空间。也就是这个变换所有可能的输出。', read='所以，A x能到达的所有地方，正好就是列空间。也就是这个变换所有可能的输出。'),
    dict(id='C12', pose='claude_explain', sub='定理 3.6.2：Ax = b 有解 ⇔ b 在 A 的列空间里。', read='于是有定理三点六点二：A x等于b有解，等价于b在A的列空间里。'),
    dict(id='C13', pose='claude_point', sub='画面：这个矩阵把 ℝ³ 压成一张平面。b 在平面上，有解；b 离开平面，怎么输入都到不了，无解。', read='看画面：这个矩阵，把R三压成了一张平面。b在平面上，就有解；b一旦离开平面，不管输入什么都到不了，就无解。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='那如果列空间是整个空间，就什么 b 都有解了！'),
    dict(id='C14', pose='claude_smile', sub='对，这是定理 3.6.3 的前半句：对每个 b 都有解 ⇔ 列向量张成 ℝᵐ。', read='对，这就是定理三点六点三的前半句：对每一个b都有解，等价于列向量张成R m。'),
    dict(id='C15', pose='claude_explain', sub='后半句：对每个 b 至多一个解 ⇔ 列向量线性无关。因为两个解相减，落在零空间里。', read='后半句：对每一个b，最多一个解，等价于列向量线性无关。因为两个解相减，就落在零空间里。'),
    dict(id='C16', pose='claude_point', sub='推论 3.6.4：n×n 矩阵非奇异 ⇔ 它的列向量构成 ℝⁿ 的一组基。', read='推论三点六点四：n阶方阵非奇异，等价于它的列向量构成R n的一组基。'),
    dict(id='G01', pose='gpt_point', sub='这一条把第一、二、三章串起来：可逆、det ≠ 0、Ax = 0 只有零解、列向量是一组基，全是同一件事。', read='这一条，把前三章串了起来：可逆，行列式不为零，齐次方程没有非零解，列向量是一组基，说的全是同一件事。'),
    dict(id='C17', pose='claude_explain', sub='列空间的基怎么找？例 3：A 和它的最简形 U，列空间不同，但列之间的关系一模一样。', read='那列空间的基怎么找？看教材例三：A和它的最简形U，列空间并不相同，但是列与列之间的关系，一模一样。'),
    dict(id='C18', pose='claude_point', sub='U 里 u₂ = 2u₁，u₄ = 3u₁ + 2u₃；A 里同样 a₂ = 2a₁，a₄ = 3a₁ + 2a₃。', read='在U里，第二列是第一列的二倍，第四列是三倍的第一列加二倍的第三列；回到A里，同样的关系照样成立。'),
    dict(id='C19', pose='claude_explain', sub='因为 Ax = 0 和 Ux = 0 的解完全相同，列之间的线性关系也就完全相同。', read='因为A x等于零和U x等于零的解完全相同，所以列与列之间的线性关系，也完全相同。'),
    dict(id='C20', pose='claude_point', sub='方法：在 U 里找主元所在的列号，再回到 A，取同样位置的列。', read='所以方法是：在U里找出主元所在的列号，再回到A，取同样位置的那些列。'),
    dict(id='G02', pose='gpt_cross', sub='一定要取 A 的列，不能取 U 的列！行变换会改变列空间。', read='一定要取A的列，不能取U的列！行变换会改变列空间。'),
    dict(id='C21', pose='claude_explain', sub='例 4：4×5 矩阵，主元在第 1、2、5 列，所以 a₁、a₂、a₅ 是列空间的一组基。', read='教材例四：一个四行五列的矩阵，主元在第一、第二、第五列，所以A的这三列，是列空间的一组基。'),
    dict(id='D03', mood='think', pose='ds_think', sub='行空间取 U 的行，列空间取 A 的列……我得记一下。', read='行空间取U的行，列空间取A的列，我得记一下。'),
    dict(id='C22', pose='claude_smile', sub='记住原因就不会混：行变换不改变行空间，但会改变列空间。下一节：秩与零化度。', read='记住原因就不会混：行变换不改变行空间，但会改变列空间。下一节，我们讲秩与零化度。'),
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
