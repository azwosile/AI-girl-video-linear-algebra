# -*- coding: utf-8 -*-
"""第 3 章 3.3 线性无关（Leon 9th §3.3：定义、例 1–6、定理 3.3.1、朗斯基 例 7 / 定理 3.3.3、定理 3.3.2 唯一表示）台词源（唯一真源）。
数值（sympy 已复核）：例 4 x₃ = 2x₁ − 3x₂；例 5 x₃ = 3x₁ + x₂；例 6 3p₁ − 2p₂ + p₃ = 0；W[eˣ, e⁻ˣ] = −2。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='上一节的第四组里，第三个向量躺在前两个张成的平面里，加了也白加。', read='上一节的第四组向量里，第三个向量躺在前两个张成的平面里，加了也白加。'),
    dict(id='C02', pose='claude_point', sub='教材例子：x₁ = (1, −1, 2)ᵀ，x₂ = (−2, 3, 1)ᵀ，x₃ = (−1, 3, 8)ᵀ，正好 x₃ = 3x₁ + 2x₂。', read='再看教材的一组例子：x一、x二、x三。x三正好等于三倍的x一，加上二倍的x二。'),
    dict(id='C03', pose='claude_explain', sub='x₃ 能用 x₁、x₂ 表示，所以三个向量张成的，和前两个张成的，是同一张平面。', read='x三能用x一、x二表示出来，所以三个向量张成的，和前两个张成的，是同一张平面。'),
    dict(id='C04', pose='claude_point', sub='移项：3x₁ + 2x₂ − x₃ = 0。', read='把式子移项：三x一，加二x二，减x三，等于零向量。'),
    dict(id='C05', pose='claude_explain', sub='一组不全为零的系数，组合出了零向量。这就是“多余”的数学说法。', read='一组不全为零的系数，组合出了零向量。这就是多余的数学说法。'),
    dict(id='C06', pose='claude_explain', sub='定义：若 c₁v₁ + ⋯ + cₙvₙ = 0 必然推出所有系数都是零，就称 v₁, …, vₙ 线性无关。', read='定义：如果c一v一，一直加到c n v n，等于零，就必然推出所有的系数都等于零，这组向量就叫线性无关。'),
    dict(id='C07', pose='claude_point', sub='反过来，存在不全为零的系数让组合等于零，就叫线性相关。', read='反过来，如果存在不全为零的系数，让组合等于零，就叫线性相关。'),
    dict(id='D01', mood='think', pose='ds_ask', sub='系数全取零，组合当然是零啊。'),
    dict(id='C08', pose='claude_smile', sub='对，全取零永远可以，那是“平凡”的组合。线性无关是说：除此之外，再没有别的办法得到零。', read='对，全取零永远可以，那叫平凡的组合。线性无关是说：除了这个平凡的组合，再没有别的办法得到零。'),
    dict(id='C09', pose='claude_point', sub='几何上：ℝ² 里两个向量线性相关，就是共线。', read='几何上：在R二里，两个向量线性相关，就是共线。'),
    dict(id='C10', pose='claude_explain', sub='ℝ³ 里三个向量线性相关，就是落在同一张平面上：至少有一个能被其余的表示出来。', read='在R三里，三个向量线性相关，就是它们落在同一张平面上：至少有一个，能被其余的表示出来。'),
    dict(id='C11', pose='claude_point', sub='线性无关：每个向量都伸向一个新的方向，谁也替代不了谁。', read='线性无关，就是每个向量都伸向一个新的方向，谁也替代不了谁。'),
    dict(id='C12', pose='claude_explain', sub='例 2：e₁ + 2e₂ + 3e₃ − (1, 2, 3)ᵀ = 0，所以这四个向量线性相关。', read='教材例二：e一、e二、e三，再加上一、二、三。e一加二e二加三e三，再减去它，正好是零。所以线性相关。'),
    dict(id='G01', pose='gpt_point', sub='一般地，ℝⁿ 里超过 n 个向量，一定线性相关。下一节证明。', read='一般地，R n里超过n个向量，一定线性相关。下一节会证明。'),
    dict(id='C13', pose='claude_explain', sub='怎么判断？ℝⁿ 里的 n 个向量：排成方阵的列，算行列式。', read='那怎么判断呢？如果是R n里的n个向量，就把它们排成方阵的列，算行列式。'),
    dict(id='C14', pose='claude_point', sub='定理 3.3.1：det ≠ 0 ⇔ 线性无关；det = 0 ⇔ 线性相关。', read='教材定理三点三点一：行列式不等于零，就线性无关；等于零，就线性相关。'),
    dict(id='D02', mood='think', pose='ds_think', sub='这和第二章有什么关系？'),
    dict(id='C15', pose='claude_explain', sub='det = 0 说明变换把空间压扁了：有非零的系数向量 c 被送到零，Xc = 0。这正好就是线性相关。', read='行列式等于零，说明这个变换把空间压扁了：有一个非零的系数向量c，被送到了零。这正好就是线性相关。'),
    dict(id='C16', pose='claude_point', sub='例 4：(4, 2, 3)ᵀ、(2, 3, 1)ᵀ、(2, −5, 3)ᵀ。排成矩阵，det = 0，线性相关。', read='教材例四：四、二、三；二、三、一；二、负五、三。排成矩阵，行列式算出来等于零，所以线性相关。'),
    dict(id='C17', pose='claude_explain', sub='解 Xc = 0 还能找出具体关系：x₃ = 2x₁ − 3x₂。', read='再解一下齐次方程，还能找出具体的关系：x三，等于二倍的x一，减去三倍的x二。'),
    dict(id='C18', pose='claude_think', sub='向量个数和维数不同，比如 ℝ⁴ 里的三个向量，没有行列式可算。这时用消元。', read='如果向量的个数和维数不同，比如R四里的三个向量，就没有行列式可算了。这时候用消元。'),
    dict(id='C19', pose='claude_explain', sub='例 5：把三个向量排成列，化成行最简形。出现自由变量，齐次方程有非零解，线性相关。', read='教材例五：把三个向量排成矩阵的列，化成行最简形。出现了自由变量，说明齐次方程有非零解，线性相关。'),
    dict(id='C20', pose='claude_point', sub='读出关系：x₃ = 3x₁ + x₂。', read='从最简形里读出关系：x三，等于三倍的x一，加上x二。'),
    dict(id='C21', pose='claude_explain', sub='多项式也一样。例 6：让 c₁p₁ + c₂p₂ + c₃p₃ 等于零多项式，比较系数，得到齐次方程组。', read='多项式也一样。教材例六：让三个二次多项式的组合，等于零多项式，比较各次项的系数，就得到一个齐次方程组。'),
    dict(id='C22', pose='claude_point', sub='解出 c₁ = 3c₃，c₂ = −2c₃。取 c₃ = 1：3p₁ − 2p₂ + p₃ = 0，线性相关。', read='解出来：c一等于三倍的c三，c二等于负二倍的c三。取c三等于一，就是：三p一，减二p二，加p三，等于零。线性相关。'),
    dict(id='C23', pose='claude_explain', sub='函数呢？eˣ 和 e⁻ˣ。用朗斯基行列式：第一行是两个函数，第二行是它们的导数。', read='函数呢？比如e的x次方，和e的负x次方。用朗斯基行列式：第一行是两个函数，第二行是它们的导数。'),
    dict(id='C24', pose='claude_point', sub='算出来 W = −2 ≠ 0。定理 3.3.3：W 在某一点不为零，函数就线性无关。', read='算出来是负二，不等于零。教材定理三点三点三：朗斯基行列式在某一点不为零，这些函数就线性无关。'),
    dict(id='G02', pose='gpt_cross', sub='注意方向：W 恒等于零，推不出线性相关。例 8 的 x² 和 x|x| 就是反例。', read='注意方向：朗斯基行列式恒等于零，并不能推出线性相关。教材例八的x平方，和x乘x的绝对值，就是反例。'),
    dict(id='C25', pose='claude_explain', sub='最后一个重要性质，定理 3.3.2：v₁, …, vₙ 线性无关，则张成里每个向量的表示方法唯一。', read='最后一个重要的性质，定理三点三点二：如果这组向量线性无关，那么它们张成里的每个向量，表示方法都是唯一的。'),
    dict(id='C26', pose='claude_point', sub='假如有两种表示，相减得到一个等于零的组合；线性无关 ⇒ 系数之差全是零，两种表示其实一样。', read='假如有两种表示，相减，就得到一个等于零的组合；线性无关说，相减以后的系数全是零，所以两种表示其实是同一种。'),
    dict(id='G03', pose='gpt_explain', sub='同济对照：线性相关 ⇔ 秩 < 向量个数。常用结论：部分相关 ⇒ 整体相关；整体无关 ⇒ 部分无关。', read='同济对照：向量组线性相关，等价于它的秩小于向量的个数。还有两条常用结论：部分相关，则整体相关；整体无关，则部分无关。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='又能张成、又不多余的向量组……是不是就是最好的？', read='又能张成，又不多余的向量组，是不是就是最好的？'),
    dict(id='C27', pose='claude_smile', sub='正是。它叫“基”。下一节见。', read='正是。它叫作基。我们下一节见。'),
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
