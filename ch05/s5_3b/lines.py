# -*- coding: utf-8 -*-
"""第 5 章 5.3（下）数据拟合（Leon 9th §5.3：直线拟合 (4)；例 2 y = 4/3 + (2/3)x，残差平方和 2/3；微积分偏导验证；
多项式拟合 (6)；例 3 y = 11/4 − x/4 + x²/4；过拟合（图 5.3.3）；Chapter Test B 7：f = 13/7 + (5/7)x）台词源（唯一真源）。
3B1B 画面：散点 + 可动直线 + 残差正方形面积计；抛物线拟合；高次插值乱抖对照。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='实验数据总有误差。我们不要求曲线穿过每个点，只要求误差的平方和最小。', read='实验数据总有误差。我们不要求曲线穿过每个点，仅要求误差的平方和最小。'),
    dict(id='C02', pose='claude_explain', sub='拟合直线 y = c₀ + c₁x。每个数据点给一个方程 c₀ + c₁xᵢ = yᵢ：m 个点，m 个方程，两个未知数。', read='拟合一条直线，y等于c零加c一x。每个数据点，给出一个方程：m个点，就是m个方程，两个未知数。'),
    dict(id='C03', pose='claude_point', sub='写成矩阵：A 的第一列全是 1，第二列是各个 xᵢ；未知数是 c₀、c₁，右边是各个 yᵢ。', read='写成矩阵：A的第一列全是一，第二列是各个x；未知数是c零和c一，右边是各个y。'),
    dict(id='C04', pose='claude_explain', sub='例 2：数据 (0, 1)、(3, 4)、(6, 5)。A = [[1, 0], [1, 3], [1, 6]]，y = (1, 4, 5)ᵀ。', read='例二：三个数据点，零、一，三、四，六、五。A的第二列是零、三、六，右边是一、四、五。'),
    dict(id='C05', pose='claude_point', sub='正规方程：[[3, 9], [9, 45]] c = (10, 42)ᵀ。解出 c₀ = 4/3，c₁ = 2/3。', read='正规方程的系数矩阵，是三、九，九、四十五，右边是十、四十二。解出c零等于三分之四，c一等于三分之二。'),
    dict(id='C06', pose='claude_explain', sub='最佳直线 y = 4/3 + (2/3)x。画面上三条竖直小线段就是残差，它们的平方和最小，等于 2/3。', read='最佳直线，y等于三分之四，加三分之二x。画面上，三条竖直的小线段就是残差，它们的平方和最小，等于三分之二。'),
    dict(id='D01', mood='think', pose='ds_think', sub='平方和最小……好像也能用微积分求？', read='平方和最小，好像也能用微积分来求？'),
    dict(id='C07', pose='claude_smile', sub='能。把 ‖r‖² 看成 c₀、c₁ 的二元函数，令两个偏导数为零。', read='能。把残差的长度平方，看成c零和c一的二元函数，令两个偏导数都等于零。'),
    dict(id='C08', pose='claude_point', sub='得到 3c₀ + 9c₁ = 10，3c₀ + 15c₁ = 14，和正规方程同解。几何和微积分，殊途同归。', read='得到三c零加九c一等于十，三c零加十五c一等于十四，和正规方程同解。几何和微积分，殊途同归。'),
    dict(id='C09', pose='claude_explain', sub='让直线动起来：每偏离一点，残差方块就变大。只有在最佳位置，方块的总面积最小。', read='让直线动起来：每偏离一点，残差方块就变大。仅在最佳位置，方块的总面积最小。'),
    dict(id='C10', pose='claude_explain', sub='数据不像直线，就换成多项式。二次拟合 y = c₀ + c₁x + c₂x²，A 多一列 xᵢ²。', read='数据不像直线，就换成多项式。二次拟合，y等于c零加c一x加c二x方，A就多一列x的平方。'),
    dict(id='C11', pose='claude_point', sub='例 3：数据 (0, 3)、(1, 2)、(2, 4)、(3, 4)。正规方程 [[4, 6, 14], [6, 14, 36], [14, 36, 98]] c = (13, 22, 54)ᵀ。', read='例三：四个数据点，零、三，一、二，二、四，三、四。正规方程的系数矩阵是三阶的，右边是十三、二十二、五十四。'),
    dict(id='C12', pose='claude_explain', sub='解出 c = (11/4, −1/4, 1/4)ᵀ，最佳抛物线 y = 2.75 − 0.25x + 0.25x²。', read='解出c零是四分之十一，c一是负四分之一，c二是四分之一。最佳抛物线，y等于二点七五，减零点二五x，加零点二五x方。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='换一列，就换一种曲线，方法一点不变！', read='换一列，就换一种曲线，方法一点不变！'),
    dict(id='C13', pose='claude_smile', sub='对。凡是对参数线性的式子，比如正弦项、指数项前面的系数，都能这样拟合。', read='对。凡是对参数线性的式子，比如正弦项、指数项前面的系数，都能这样拟合。'),
    dict(id='C14', pose='claude_explain', sub='但别贪高次：n 个点总能被 n − 1 次多项式穿过，可那会把误差也一起拟合进去，曲线乱抖。', read='但是别贪高次：n个点，总能被n减一次多项式穿过，可那样会把误差也一起拟合进去，曲线乱抖。'),
    dict(id='C15', pose='claude_point', sub='测验 B 第 7 题：数据 (−1, 1)、(1, 3)、(2, 3)，求最佳直线 f(x) = c₁ + c₂x。', read='测验B第七题：数据是负一、一，一、三，二、三。求最佳直线，f x等于c一加c二x。'),
    dict(id='C16', pose='claude_explain', sub='A = [[1, −1], [1, 1], [1, 2]]，AᵀA = [[3, 2], [2, 6]]，Aᵀy = (7, 8)ᵀ。', read='A的第二列，是负一、一、二。A转置A是三、二，二、六；A转置y是七、八。'),
    dict(id='C17', pose='claude_point', sub='行列式是 14，解出 c₁ = 13/7，c₂ = 5/7，所以 f(x) = 13/7 + (5/7)x。', read='系数行列式是十四，解出c一等于七分之十三，c二等于七分之五。所以f x等于七分之十三，加七分之五x。'),
    dict(id='D03', mood='easy', pose='ds_proud', sub='先排 A，再算 AᵀA 和 Aᵀy，最后解二阶方程组。三步！', read='先排A，再算A转置A和A转置y，最后解二阶方程组。就三步！'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济线代很少出拟合题。但概率统计里的回归直线公式，就是这里的正规方程化开以后的样子。', read='同济对照：同济线代很少出拟合题。但概率统计里的回归直线公式，就是这里的正规方程，化开以后的样子。'),
    dict(id='C18', pose='claude_explain', sub='小结：数据拟合就是最小二乘。A 的每一列对应一个基函数，每一行对应一个数据点。', read='小结：数据拟合，就是最小二乘。A的每一列，对应一个基函数；每一行，对应一个数据点。'),
    dict(id='C19', pose='claude_point', sub='下一节：把点积推广出去，函数之间也能谈长度和角度。', read='下一节：把点积推广出去，函数之间，也能谈长度和角度。'),
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
