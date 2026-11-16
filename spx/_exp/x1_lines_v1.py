# -*- coding: utf-8 -*-
"""特别篇 · 期中速成 x1：含参方程组（2018–19 第 1 题；2025–26 第 2 题；2024–25 第 2 题）台词源（唯一真源）。
数值（spx/verify.py 复核）：18–19 消元末行 (0 0 a−5 | b−4)，通解 (1,1,0)+t(−2,−1,1)；
25–26 det = −2(α−8)，α=8 时末行 (0 0 0 | β−1) ⇒ β=1；24–25 det = 6(α+2)，α=−2 时末行 (0 0 0 | β+1) ⇒ β=−1。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='期中速成，第一段：含参数的方程组。近几年考过三次，一题十二到十八分。', read='期中速成，第一段：含参数的方程组。近几年考过三次，一道题十二到十八分。'),
    dict(id='D01', mood='think', pose='ds_confused', sub='方程里一冒出 a 和 b，我就慌……', read='方程里一冒出a和b，我就慌。'),
    dict(id='C02', pose='claude_explain', sub='不用慌。套路只有一句话：先消元，再盯住最后一行。', read='不用慌。套路只有一句话：先消元，再盯住最后一行。'),
    # 2018–19 第 1 题
    dict(id='C03', pose='claude_point', sub='先看原题：2018–2019 学年期中，第 1 题，18 分。', read='先看原题：二零一八到二零一九学年期中，第一题，十八分。'),
    dict(id='C04', pose='claude_explain', sub='x₁ + x₂ + 3x₃ = 2，x₁ + 2x₂ + 4x₃ = 3，x₁ + 3x₂ + ax₃ = b。', read='第一个方程，x一，加上x二，加上三倍的x三，等于二。第二个方程，x一，加上两倍的x二，加上四倍的x三，等于三。第三个方程，x一，加上三倍的x二，加上a倍的x三，等于b。'),
    dict(id='C05', pose='claude_point', sub='(a)(b) 两问白送：写成 Ax = b，再写出增广矩阵。四分先拿到手。', read='a和b两问是白送的：写成A x 等于b，再写出增广矩阵。四分先拿到手。'),
    dict(id='G01', pose='gpt_point', sub='增广矩阵的竖线别漏；参数 a、b 原样抄进去，不要自作主张代数字。', read='注意：增广矩阵的竖线别漏掉；参数a和b原样抄进去，不要自作主张代数字。'),
    dict(id='C06', pose='claude_explain', sub='开始消元。第二行减第一行；第三行也减第一行。', read='开始消元。第二行减去第一行；第三行也减去第一行。'),
    dict(id='C07', pose='claude_explain', sub='再用第三行减去两倍的第二行。', read='再用第三行，减去两倍的第二行。'),
    dict(id='D02', mood='panic', pose='ds_shock', sub='最后一行只剩 0、0、a − 5，竖线后面是 b − 4！', read='最后一行只剩零、零、a减五，竖线后面是b减四！'),
    dict(id='C08', pose='claude_point', sub='对。整道题的命运，全写在这一行里。把它读回方程：(a − 5)x₃ = b − 4。', read='对。整道题的命运，全写在这一行里。把它读回成方程：a减五，乘以x三，等于b减四。'),
    dict(id='C09', pose='claude_explain', sub='情况一：a ≠ 5。x₃ 的系数不是零，三行都有主元——唯一解。这是第 (e) 问。', read='情况一：a不等于五。x三的系数不是零，三行都有主元，所以有唯一解。这是第e问。'),
    dict(id='C10', pose='claude_explain', sub='情况二：a = 5 但 b ≠ 4。这一行变成“0 = 非零数”，矛盾——无解。这是第 (c) 问。', read='情况二：a等于五，但b不等于四。这一行变成零等于一个非零的数，自相矛盾，所以无解。这是第c问。'),
    dict(id='C11', pose='claude_explain', sub='情况三：a = 5 且 b = 4。最后一行全是零，两个方程管三个未知数，有一个自由变量——无穷多解。这是第 (d) 问。', read='情况三：a等于五，并且b等于四。最后一行全是零，只剩两个方程，管着三个未知数，有一个自由变量，所以有无穷多解。这是第d问。'),
    dict(id='D03', mood='think', pose='ds_ask', sub='无穷多解的时候，要不要把解写出来？', read='无穷多解的时候，要不要把解写出来？'),
    dict(id='C12', pose='claude_smile', sub='没要求，但写出来更稳。令 x₃ = t，回代：x₂ = 1 − t，x₁ = 1 − 2t。通解 = (1, 1, 0) + t(−2, −1, 1)。', read='题目没要求，但写出来更稳。令x三等于t，往回代：x二等于一减t，x一等于一减两倍的t。通解就是一、一、零，加上t倍的负二、负一、一。'),
    dict(id='G02', pose='gpt_explain', sub='验一下 t = 0：(1, 1, 0) 代进三个方程，左边依次是 2、3、4——第三个正好等于 b = 4。', read='验一下t等于零的情况：把一、一、零代进三个方程，左边依次是二、三、四，第三个正好等于b，也就是四。'),
    dict(id='C13', pose='claude_point', sub='再看几何：每个方程是空间里的一张平面。a 管第三张平面的倾斜，b 管它的平移。', read='再看几何：每个方程，都是空间里的一张平面。a管着第三张平面的倾斜，b管着它的平移。'),
    dict(id='C14', pose='claude_explain', sub='a ≠ 5：三张平面交于一点。a = 5：第三张平面转到和前两张的交线平行；b ≠ 4 时它被推开，没有公共点。', read='a不等于五时，三张平面交于一点。a等于五时，第三张平面转到和前两张的交线平行；如果b不等于四，它就被推开，三张平面没有公共点。'),
    dict(id='C15', pose='claude_explain', sub='把 b 调到 4，第三张平面正好穿过那条交线：整条直线都是解。', read='把b调到四，第三张平面正好穿过那条交线：整条直线上的点，都是解。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='一个点、没有点、一整条线——三种结局！', read='一个点，没有点，一整条线，三种结局！'),
    dict(id='C16', pose='claude_point', sub='套路卡①：消元到阶梯形，只盯最后一行。系数 ≠ 0 → 唯一解；系数 = 0 再看右端：非零无解，为零无穷多解。', read='套路卡一：消元到阶梯形，只盯最后一行。系数不为零，唯一解；系数为零，再看右端：右端不为零，无解；右端为零，无穷多解。'),
    # 2025–26 第 2 题
    dict(id='C17', pose='claude_point', sub='第二题：2025–2026 学年期中第 2 题，12 分。去年的卷子里有一道几乎一样的，一起拿下。', read='第二题：二零二五到二零二六学年期中，第二题，十二分。去年的卷子里有一道几乎一样的，我们一起拿下。'),
    dict(id='C18', pose='claude_explain', sub='A 的三列是 a₁、a₂、a₃：A = [[1, 2, 1], [1, α, 3], [2, −2, 0]]，b = (1, 2, β)ᵀ。', read='A的三列，是a一、a二、a三。A的三行分别是：一、二、一；一、阿尔法、三；二、负二、零。b是一、二、贝塔。'),
    dict(id='C19', pose='claude_point', sub='第一问：α 取何值时，a₁、a₂、a₃ 张成 ℝ³？', read='第一问：阿尔法取什么值时，a一、a二、a三张成R三？'),
    dict(id='D05', mood='easy', pose='ds_proud', sub='三个向量张成 ℝ³，就是构成一组基——行列式不等于零！', read='三个向量张成R三，就是构成一组基，也就是行列式不等于零！'),
    dict(id='C20', pose='claude_smile', sub='对。按第一行展开：det A = 6 + 12 + (−2 − 2α) = 16 − 2α = −2(α − 8)。', read='对。按第一行展开：六，加十二，再加上负二减两倍阿尔法，合起来是十六减两倍阿尔法，也就是负二乘以阿尔法减八。'),
    dict(id='C21', pose='claude_explain', sub='所以 α ≠ 8 时，三列张成 ℝ³。', read='所以，阿尔法不等于八的时候，三列张成R三。'),
    dict(id='C22', pose='claude_point', sub='看动画：拖动 α，第二列跟着转，三根列向量撑起的平行六面体体积在变；拖到 8，体积归零，三根向量被压进同一张平面。', read='看动画：拖动阿尔法，第二列跟着转动，三根列向量撑起的平行六面体，体积在变；拖到八，体积归零，三根向量被压进了同一张平面。'),
    dict(id='C23', pose='claude_explain', sub='第二问要无穷多解。先想清楚：α ≠ 8 时 A 可逆，解唯一，不可能无穷多。所以只能 α = 8。', read='第二问要无穷多解。先想清楚：阿尔法不等于八时，A可逆，解是唯一的，不可能无穷多。所以只能是阿尔法等于八。'),
    dict(id='C24', pose='claude_explain', sub='把 α = 8 代进增广矩阵：第二行减第一行，第三行减两倍第一行，再把第二行加到第三行。', read='把阿尔法等于八代进增广矩阵：第二行减去第一行，第三行减去两倍的第一行，再把第二行加到第三行上。'),
    dict(id='D06', mood='panic', pose='ds_shock', sub='最后一行是 0、0、0，竖线后面是 β − 1！', read='最后一行是零、零、零，竖线后面是贝塔减一！'),
    dict(id='C25', pose='claude_point', sub='对。β = 1 时无穷多解，β ≠ 1 时无解。答案：α = 8，β = 1。', read='对。贝塔等于一时，无穷多解；贝塔不等于一时，无解。答案：阿尔法等于八，贝塔等于一。'),
    dict(id='G03', pose='gpt_point', sub='评分点：一定写出“α ≠ 8 时解唯一”，交代为什么只讨论 α = 8。少了这句容易扣分。', read='评分点：一定要写出，阿尔法不等于八时解唯一，交代清楚为什么只讨论阿尔法等于八。少了这一句，容易被扣分。'),
    # 2024–25 第 2 题
    dict(id='C26', pose='claude_point', sub='再看 2024–2025 学年的姊妹题：第二行换成 −1、4、3，右下角放 α。', read='再看二零二四到二零二五学年的姊妹题：第二行换成负一、四、三，参数阿尔法放在右下角。'),
    dict(id='C27', pose='claude_explain', sub='同一个流程：det A = 6(α + 2)；α = −2 时，最后一行是 (0 0 0 | β + 1)。所以 α = −2，β = −1。', read='同一个流程：行列式等于六乘以阿尔法加二；阿尔法等于负二时，最后一行是零、零、零，竖线后面是贝塔加一。所以，阿尔法等于负二，贝塔等于负一。'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='原来是同一个套路！先行列式找临界值，再代进去消元！', read='原来是同一个套路！先算行列式找临界值，再代进去消元！'),
    dict(id='C28', pose='claude_smile', sub='套路卡②：方阵含参，先求 det 找临界值；det ≠ 0 唯一解；临界值代回去消元，再看最后一行。', read='套路卡二：方阵含参数，先求行列式找临界值；行列式不为零，就是唯一解；临界值代回去消元，再看最后一行。'),
    dict(id='G04', pose='gpt_explain', sub='两张套路卡合起来，含参方程组就是送分题。', read='两张套路卡合起来，含参方程组，就是送分题。'),
    dict(id='D08', mood='easy', pose='ds_proud', sub='下一段：初等矩阵和 LU 分解！', read='下一段：初等矩阵和LU分解！'),
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
