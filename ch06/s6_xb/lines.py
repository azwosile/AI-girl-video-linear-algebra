# -*- coding: utf-8 -*-
"""第 6 章 复习（下）计算题、同济题型与小结（Leon 9th Chapter 6 Test B 第 1 题（A⁷ = A）、第 5 题（LDLᵀ、Cholesky）、第 7 题（e^{tA}Y₀）；
同济：例 (−1 1 0; −4 3 0; 1 0 2) 不可对角化、(−2 1 1; 0 2 0; −4 1 3) 可对角化、正交变换化 f = −2x₁x₂ + 2x₁x₃ + 2x₂x₃ 为标准形）台词源（唯一真源）。
画面：计算流程卡；3D 特征平面；全章地图；第 7 集预告。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='复习下半场：三道 Leon 计算题，三道同济题型，最后把整章串起来。', read='复习下半场：三道英文教材的计算题，三道同济题型，最后把整章串起来。'),
    # TB1
    dict(id='C02', pose='claude_point', sub='Test B 第 1 题：A = (1 0 0; 1 1 −1; 1 2 −2)。求特征值、特征空间，写成 XDX⁻¹，再算 A⁷。', read='测验B第一题：A的第一行一、零、零，第二行一、一、负一，第三行一、二、负二。求特征值和特征空间，写成X D X逆，再算A的七次方。'),
    dict(id='C03', pose='claude_explain', sub='按第一行展开，p(λ) = −λ(λ − 1)(λ + 1)，特征值 1、0、−1。特征向量分别是 (1, 1, 1)ᵀ、(0, 1, 1)ᵀ、(0, 1, 2)ᵀ。', read='按第一行展开，特征多项式是负拉姆达，乘拉姆达减一，乘拉姆达加一，特征值是一、零、负一。特征向量分别是一、一、一，零、一、一，零、一、二。'),
    dict(id='D01', mood='think', pose='ds_think', sub='A⁷……要乘七次？', read='A的七次方，要乘七次吗？'),
    dict(id='C04', pose='claude_smile', sub='用对角化：A⁷ = XD⁷X⁻¹。1⁷ = 1，0⁷ = 0，(−1)⁷ = −1，D⁷ = D，所以 A⁷ = A。一步出答案。', read='用对角化：A的七次方，等于X乘D的七次方乘X逆。一的七次方是一，零的七次方是零，负一的七次方是负一，D的七次方就是D，所以A的七次方等于A。一步出答案。'),
    # TB5
    dict(id='C05', pose='claude_point', sub='Test B 第 5 题：A = (4 2 2; 2 10 10; 2 10 14)。不求特征值，证明 A 正定，再求 LDLᵀ 和 Cholesky 分解。', read='测验B第五题：A的第一行四、二、二，第二行二、十、十，第三行二、十、十四。不求特征值，证明A正定，再求L D L转置，和乔列斯基分解。'),
    dict(id='C06', pose='claude_explain', sub='顺序主子式：4、36、144，全为正，所以正定。消元乘数 ½、½、1，主元 4、9、4：L = (1 0 0; ½ 1 0; ½ 1 1)，D = diag(4, 9, 4)。', read='顺序主子式是四、三十六、一百四十四，全为正，所以正定。消元的乘数是二分之一、二分之一、一，主元是四、九、四。由此写出L和D。'),
    dict(id='C07', pose='claude_point', sub='开平方：L₁ = LD^(1/2) = (2 0 0; 1 3 0; 1 3 2)，A = L₁L₁ᵀ。主元全是完全平方，Cholesky 因子全是整数。', read='再开平方：L一等于L乘D的二分之一次方，第一行二、零、零，第二行一、三、零，第三行一、三、二。主元都是完全平方数，所以因子全是整数。'),
    # TB7
    dict(id='C08', pose='claude_point', sub='Test B 第 7 题：Y′ = AY，A = (1 −2; 3 −4)，Y(0) = (1, 2)ᵀ。', read='测验B第七题：Y的导数等于A乘Y，A的第一行一、负二，第二行三、负四，初值是一、二。'),
    dict(id='C09', pose='claude_explain', sub='特征值 −1 和 −2，特征向量 (1, 1)ᵀ 和 (2, 3)ᵀ。把 Y₀ 拆开：(1, 2)ᵀ = −(1, 1)ᵀ + (2, 3)ᵀ。', read='特征值是负一和负二，特征向量是一、一，和二、三。把Y零拆开：一、二，等于负的一、一，加上二、三。'),
    dict(id='C10', pose='claude_point', sub='所以 Y = −e⁻ᵗ(1, 1)ᵀ + e⁻²ᵗ(2, 3)ᵀ，即 y₁ = 2e⁻²ᵗ − e⁻ᵗ，y₂ = 3e⁻²ᵗ − e⁻ᵗ。两个特征值都为负，解衰减到零。', read='所以，Y等于负的e的负t次方，乘一、一；加上e的负二t次方，乘二、三。两个分量的式子，写在画面上了。两个特征值都为负，解衰减到零。'),
    # 同济
    dict(id='G01', pose='gpt_explain', sub='同济题型一：A = (−1 1 0; −4 3 0; 1 0 2)。特征值 2、1、1。λ = 1 时 A − E 的秩是 2，只有一个无关特征向量 (−1, −2, 1)ᵀ，所以不能对角化。', read='同济题型一：A的第一行负一、一、零，第二行负四、三、零，第三行一、零、二。特征值是二、一、一。对重根一，A减E的秩是二，仅有一个无关的特征向量，负一、负二、一，所以不能对角化。'),
    dict(id='G02', pose='gpt_point', sub='题型二：A = (−2 1 1; 0 2 0; −4 1 3)。特征值 −1、2、2。λ = 2 时 A − 2E 的秩是 1，有两个无关特征向量 (0, 1, −1)ᵀ、(1, 0, 4)ᵀ，可以对角化。', read='题型二：A的第一行负二、一、一，第二行零、二、零，第三行负四、一、三。特征值是负一、二、二。对重根二，A减二E的秩是一，有两个无关的特征向量，零、一、负一，和一、零、四，可以对角化。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='看重根那里的秩：n 减秩，就是几何重数！', read='看重根那里的秩：n减去秩，就是几何重数！'),
    dict(id='G03', pose='gpt_explain', sub='题型三：用正交变换把 f = −2x₁x₂ + 2x₁x₃ + 2x₂x₃ 化为标准形。矩阵就是 s6_4 那道 (0 −1 1; −1 0 1; 1 1 0)。', read='题型三：用正交变换，把二次型负二x一x二，加二x一x三，加二x二x三，化为标准形。它的矩阵，就是谱定理那一节的同济例题。'),
    dict(id='G04', pose='gpt_point', sub='特征值 −2、1、1，正交变换 x = Py 后，f = −2y₁² + y₂² + y₃²。正惯性指数 2，负惯性指数 1，是不定二次型。', read='特征值是负二、一、一，做正交变换x等于P y以后，f等于负二y一平方，加y二平方，加y三平方。正惯性指数是二，负惯性指数是一，是不定二次型。'),
    # 小结
    dict(id='C11', pose='claude_smile', sub='最后，把整章串成一条线。', read='最后，把整章串成一条线。'),
    dict(id='C12', pose='claude_explain', sub='起点：Ax = λx，方向不变的向量。det(A − λI) = 0 求 λ，N(A − λI) 求 x。积等于行列式，和等于迹。', read='起点：A乘x等于拉姆达乘x，方向不变的向量。用特征方程求拉姆达，用零空间求x。特征值之积是行列式，之和是迹。'),
    dict(id='C13', pose='claude_explain', sub='有 n 个无关特征向量就能对角化：Aⁿ、eᵗᴬ、马尔可夫稳态、微分方程，都变成对角线上的数各算各的。', read='有n个无关的特征向量，就能对角化：A的n次方、e的t A次方、马尔可夫稳态、微分方程，都变成对角线上的数，各算各的。'),
    dict(id='C14', pose='claude_explain', sub='对称矩阵最好：特征值全实，特征向量正交，A = QDQᵀ。由此转到二次型的主轴，判断正定；非方阵用 SVD：转、拉、转。', read='对称矩阵最好：特征值全实，特征向量正交，A等于Q D Q转置。由此把二次型转到主轴，判断正定；非方阵，就用奇异值分解：转、拉、转。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='一句话：找到不转向的方向，矩阵就只剩伸缩！', read='一句话：找到不转向的方向，矩阵就只剩伸缩！'),
    dict(id='C15', pose='claude_smile', sub='说得好。第六章到此结束。', read='说得好。第六章，到此结束。'),
    dict(id='C16', pose='claude_point', sub='下一集，第七章：数值线性代数。这一章的特征值、奇异值，计算机到底是怎么算出来的？', read='下一集，第七章：数值线性代数。这一章的特征值、奇异值，计算机到底是怎么算出来的？'),
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
