# -*- coding: utf-8 -*-
"""第 3 章 3.6b 秩与秩–零化度（Leon 9th §3.6 后半：定理 3.6.5 / 3.6.6、例 3；Test B 第 3、4、7 题；N(Aᵀ) 预告）台词源（唯一真源）。
3B1B 画面：3×3 秩 2 矩阵把 ℝ³ 压成平面，一条直线被压到原点：2 + 1 = 3。
数值：例 3 A = [[1,2,−1,1],[2,4,−3,0],[1,2,1,5]] → N(A) 基 (−2,1,0,0)、(−3,0,−2,1)；Test B 3 秩 2、零化度 3。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='上一节留了个问题：行空间和列空间的维数，为什么总相等？'),
    dict(id='C02', pose='claude_explain', sub='看阶梯形 U：每个主元占一行，也占一列。非零行有几行，主元就有几个，主元列也就有几列。', read='看阶梯形U：每个主元，占一行，也占一列。非零行有几行，主元就有几个；主元列，也就有几列。'),
    dict(id='C03', pose='claude_point', sub='非零行是行空间的基，主元列指出列空间的基。两边算的，是同一批主元。', read='非零行是行空间的基，主元列指出了列空间的基。两边算的，其实是同一批主元。'),
    dict(id='C04', pose='claude_explain', sub='所以秩既是行空间的维数，也是列空间的维数。转置以后行列互换，秩也不变。', read='所以，秩既是行空间的维数，也是列空间的维数。转置以后，行和列互换，秩也不变。'),
    dict(id='C05', pose='claude_point', sub='零空间的维数也有名字，叫零化度，记作 nullity。', read='零空间的维数，也有一个名字，叫零化度。'),
    dict(id='D01', mood='think', pose='ds_think', sub='秩是活下来的维数，那零化度是……被压没了的维数？', read='秩是活下来的维数，那零化度，是被压没了的维数？'),
    dict(id='C06', pose='claude_smile', sub='正是。这就是本章最漂亮的定理：秩–零化度定理。秩加零化度，等于列数 n。', read='正是。这就是本章最漂亮的一个定理：秩零化度定理。秩加零化度，等于列数n。'),
    dict(id='C07', pose='claude_explain', sub='看画面：这个 3×3 矩阵把 ℝ³ 压成平面，列空间二维；一整条直线被压到原点，零空间一维。2 + 1 = 3。', read='看画面：这个三阶矩阵，把R三压成一张平面，列空间是二维；同时，有一整条直线被压到了原点，零空间是一维。二加一，正好等于三。'),
    dict(id='C08', pose='claude_point', sub='输入的每一个维度，要么活下来，变成输出的维度；要么被压扁，进了零空间。一个都不会丢。', read='输入空间的每一个维度，要么活下来，变成输出的维度；要么被压扁，进了零空间。一个都不会丢。'),
    dict(id='C09', pose='claude_explain', sub='代数上更直接：最简形里，主元变量 r 个，自由变量 n − r 个；每个自由变量贡献零空间的一个基向量。', read='代数上更直接：最简形里，主元变量有r个，自由变量有n减r个；每个自由变量，贡献零空间的一个基向量。'),
    dict(id='C10', pose='claude_point', sub='例 3：A 是 3×4 矩阵。最简形里，主元在第 1、3 列，秩是 2。', read='教材例三：A是三行四列的矩阵。在最简形里，主元在第一列和第三列，秩是二。'),
    dict(id='C11', pose='claude_explain', sub='自由变量 x₂、x₄ 取成 α、β，解出零空间的基：(−2, 1, 0, 0)ᵀ 和 (−3, 0, −2, 1)ᵀ。', read='自由变量x二、x四，取成阿尔法、贝塔，解出零空间的基：负二、一、零、零，和负三、零、负二、一。'),
    dict(id='C12', pose='claude_point', sub='零化度 2，秩 2，2 + 2 = 4，正好是列数。', read='零化度是二，秩是二，二加二等于四，正好是列数。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='我来！Test B 第 7 题：A 是 6×4 矩阵，秩是 4。', read='我来！教材测验B第七题：A是一个六行四列的矩阵，秩是四。'),
    dict(id='C13', pose='claude_smile', sub='好，零空间几维？', read='好，那零空间是几维？'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='列数 4 减秩 4，零维！里面就一个零向量。', read='列数四，减去秩四，零维！里面就一个零向量。'),
    dict(id='C14', pose='claude_point', sub='列空间几维？列向量能张成 ℝ⁶ 吗？', read='列空间是几维？列向量能张成R六吗？'),
    dict(id='D04', mood='think', pose='ds_think', sub='列空间四维……四个向量撑不满六维，张不成 ℝ⁶。', read='列空间是四维，四个向量撑不满六维，所以张不成R六。'),
    dict(id='C15', pose='claude_explain', sub='对。四个列向量线性无关吗？', read='对。那四个列向量线性无关吗？'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='秩等于列数，线性无关！'),
    dict(id='C16', pose='claude_point', sub='最后：b 在列空间里，Ax = b 有几个解？', read='最后一问：b在列空间里，A x等于b有几个解？'),
    dict(id='D06', mood='think', pose='ds_think', sub='有解……列向量又线性无关，最多一个解。所以正好一个！', read='首先有解，列向量又线性无关，最多一个解。所以正好一个！'),
    dict(id='C17', pose='claude_smile', sub='全对。秩–零化度加上上一节的定理，这类题一步一个结论。', read='全对。秩零化度定理，加上上一节的定理，这类题一步一个结论。'),
    dict(id='C18', pose='claude_explain', sub='再来一道带数字的：Test B 第 3 题，4×5 矩阵。化成最简形，剩两个非零行，秩是 2。', read='再来一道带数字的：测验B第三题，一个四行五列的矩阵。化成最简形，剩下两个非零行，秩是二。'),
    dict(id='C19', pose='claude_point', sub='主元在第 1、3 列，A 的第 1、3 列就是列空间的基。零化度 = 5 − 2 = 3。', read='主元在第一、第三列，所以A的第一、第三列，就是列空间的基。零化度是五减二，等于三。'),
    dict(id='C20', pose='claude_explain', sub='三个自由变量 x₂、x₄、x₅，逐个取 1，得到零空间的三个基向量。', read='三个自由变量，x二、x四、x五，逐个取成一，就得到零空间的三个基向量。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：秩写作 R(A)；齐次方程组的“基础解系”含 n − r 个向量，就是零空间的基；行秩 = 列秩 = 秩，叫“三秩相等”。', read='同济对照：同济把秩写作R A；齐次方程组的基础解系，含有n减r个向量，就是零空间的一组基。行秩等于列秩等于矩阵的秩，同济叫三秩相等。'),
    dict(id='C21', pose='claude_point', sub='还有一个子空间没登场：Aᵀ 的零空间 N(Aᵀ)，维数是 m − r。', read='还有一个子空间没有登场：A转置的零空间，它的维数是m减r。'),
    dict(id='C22', pose='claude_explain', sub='行空间、列空间、N(A)、N(Aᵀ)，合称四个基本子空间。期中卷基本上每年都考，复习课里做一道。', read='行空间、列空间、零空间、A转置的零空间，合称四个基本子空间。期中卷基本上每年都考，复习课里我们就做一道。'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='第三章快通关了！'),
    dict(id='C23', pose='claude_smile', sub='下一节复习：先做判断题，再做期中真题。', read='下一节复习：先做判断题，再做期中真题。'),
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
