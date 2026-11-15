# -*- coding: utf-8 -*-
"""第 3 章 3.2a 子空间（Leon 9th §3.2 前半：定义、例 2、反例、P_n 中 p(0)=0、零空间 例 9）台词源（唯一真源）。
3B1B 画面：ℝ³ 中过原点的平面；向量相加、数乘都留在平面内；推离原点的平面「掉出去」；坐标轴并集 x₁x₂ = 0 不封闭。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='think', pose='ds_ask', sub='一个向量空间里面，还能再装一个向量空间吗？'),
    dict(id='C01', pose='claude_smile', sub='能。在 ℝ³ 里画一张过原点的平面，在平面上随便取两个向量。', read='能。在R三里画一张过原点的平面，在这张平面上，随便取两个向量。'),
    dict(id='C02', pose='claude_point', sub='把它们相加，结果还在平面上；把其中一个拉长、反向，也还在平面上。'),
    dict(id='C03', pose='claude_explain', sub='加法和数乘都跑不出这张平面。它自己就成了一个小的向量空间：子空间。', read='加法和数乘，都跑不出这张平面。平面自己就成了一个小的向量空间，这就是子空间。'),
    dict(id='C04', pose='claude_explain', sub='定义：V 的非空子集 S，对数乘封闭、对加法封闭，就叫 V 的子空间。', read='定义：向量空间V的一个非空子集S，如果对数乘封闭，对加法也封闭，就叫作V的子空间。'),
    dict(id='D02', mood='think', pose='ds_think', sub='八条公理呢？不用一条条检查吗？'),
    dict(id='C05', pose='claude_explain', sub='大部分是从 V 继承来的：交换律、结合律、分配律，在大空间里成立，在小集合里当然也成立。', read='大部分是从V那里继承来的：交换律、结合律、分配律，在大空间里成立，放到小集合里，当然也成立。'),
    dict(id='C06', pose='claude_point', sub='剩下零向量和负向量。上一节的定理正好派上用场：0x = 0，(−1)x = −x。', read='剩下的是零向量和负向量。上一节的定理正好派上用场：零乘x是零向量，负一乘x是负向量。'),
    dict(id='C07', pose='claude_smile', sub='既然对数乘封闭，这两个就自动落在 S 里。所以判定子空间，检查两条就够了。'),
    dict(id='C08', pose='claude_point', sub='教材例 2：ℝ³ 中，第一个分量等于第二个分量的所有向量。', read='看教材例二：R三中，第一个分量等于第二个分量的所有向量。'),
    dict(id='C09', pose='claude_explain', sub='两个这样的向量相加，前两个分量还相等；乘上 α，也还相等。两条都过，是子空间。', read='取两个这样的向量，相加以后，前两个分量还是相等；乘上阿尔法，也还相等。两条都通过，所以是子空间。'),
    dict(id='C10', pose='claude_point', sub='几何上，它就是一张过原点的平面。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='那所有平面都是子空间咯？'),
    dict(id='C11', pose='claude_think', sub='不一定。把平面推离原点，比如 x₁ + x₂ + x₃ = 1。', read='不一定。把平面推离原点，比如：三个分量加起来等于一的那些向量。'),
    dict(id='C12', pose='claude_explain', sub='两个向量的分量和都是 1，相加以后变成 2，跑出平面了。更直接：零向量根本不在里面。', read='两个向量的分量和都是一，相加以后变成了二，跑出了平面。更直接的是：零向量根本不在里面。'),
    dict(id='C13', pose='claude_point', sub='所以，子空间一定经过原点。这是最快的排除法。'),
    dict(id='G01', pose='gpt_point', sub='考试技巧：先看零向量在不在。不在，直接判“不是”。', read='考试技巧：先看零向量在不在。不在，直接判不是。'),
    dict(id='C14', pose='claude_think', sub='再看一个过原点、却仍然不是子空间的：ℝ² 中 x₁x₂ = 0 的点。', read='再看一个过原点、但仍然不是子空间的例子：平面上，两个分量的乘积等于零的那些点。'),
    dict(id='C15', pose='claude_explain', sub='乘积为零，至少有一个分量是零，所以这个集合就是两条坐标轴。', read='乘积为零，说明至少有一个分量是零，所以这个集合，就是两条坐标轴。'),
    dict(id='C16', pose='claude_point', sub='(1, 0) 和 (0, 1) 都在轴上；相加得 (1, 1)，乘积是 1，不在集合里。加法不封闭。', read='一、零和零、一都在坐标轴上；相加得到一、一，乘积是一，不在集合里。加法不封闭。'),
    dict(id='D04', mood='think', pose='ds_think', sub='原来过原点，也只是必要条件。'),
    dict(id='C17', pose='claude_smile', sub='对。每个向量空间至少有两个子空间：由零向量单独组成的 {0}，和 V 自己。', read='对。每个向量空间都至少有两个子空间：最小的，是由零向量单独组成的集合；最大的，是V自己。'),
    dict(id='C18', pose='claude_explain', sub='子空间不一定在 ℝⁿ 里。Pₙ 中满足 p(0) = 0 的多项式：常数项为零，加完、乘完还是零。', read='子空间也不一定在R n里。比如P n中，满足p零等于零的多项式：常数项都是零，相加、数乘以后，常数项还是零。'),
    dict(id='C19', pose='claude_point', sub='下面是本章最重要的子空间之一：零空间。', read='下面，是本章最重要的子空间之一：零空间。'),
    dict(id='C20', pose='claude_explain', sub='矩阵 A 的零空间，就是方程 Ax = 0 的全部解，记作 N(A)。', read='矩阵A的零空间，就是方程A x等于零的全部解，记作N A。'),
    dict(id='C21', pose='claude_explain', sub='为什么是子空间？Ax = 0、Ay = 0，则 A(x + y) = 0 + 0，A(αx) = α·0，都还是零。', read='为什么它是子空间？如果A x等于零，A y也等于零，那么A乘x加y，等于零加零；A乘阿尔法x，等于阿尔法乘零。结果都还是零。'),
    dict(id='C22', pose='claude_point', sub='教材例 9：A 是 2×4 矩阵。先化成行最简形。', read='来算教材例九：A是两行四列的矩阵。先把它化成行最简形。'),
    dict(id='C23', pose='claude_explain', sub='主元在第 1、2 列；x₃、x₄ 是自由变量，取成 α、β。', read='主元在第一列和第二列；x三、x四是自由变量，分别取成阿尔法和贝塔。'),
    dict(id='C24', pose='claude_point', sub='解出：x = α(1, −2, 1, 0)ᵀ + β(−1, 1, 0, 1)ᵀ。', read='解出来：x等于阿尔法乘一、负二、一、零，加上贝塔乘负一、一、零、一。'),
    dict(id='C25', pose='claude_explain', sub='N(A) 是 ℝ⁴ 里一张过原点的“平面”，由这两个向量撑起来。', read='所以零空间，是R四里一张过原点的平面，由这两个向量撑了起来。'),
    dict(id='G02', pose='gpt_explain', sub='同济对照：N(A) 在同济叫齐次线性方程组的“解空间”，是同一个东西。', read='同济对照：零空间在同济叫作齐次线性方程组的解空间。两本书说的是同一个东西。'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='撑起来……这个说法我喜欢。', read='撑起来，这个说法我喜欢。'),
    dict(id='C26', pose='claude_smile', sub='用几个向量撑起一个空间，这个动作有名字，叫“张成”。下一节就讲它。', read='用几个向量撑起一个空间，这个动作有个名字，叫张成。下一节就讲它。'),
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
