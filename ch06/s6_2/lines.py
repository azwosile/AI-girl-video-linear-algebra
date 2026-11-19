# -*- coding: utf-8 -*-
"""第 6 章 6.2 线性微分方程组（Leon 9th §6.2：Y′ = AY；例 1 A = (3 4; 3 2)，λ = 6, −1，x₁ = (4, 3)ᵀ，x₂ = (1, −1)ᵀ；
初值 (6, 1)ᵀ → c = (1, 2)，y₁ = 4e^{6t} + 2e^{−t}，y₂ = 3e^{6t} − 2e^{−t}；例 2 λ = 2 ± i 螺线；应用：简谐运动、高楼振动）台词源（唯一真源）。
3B1B 画面：相平面速度场 + 流线，沿特征方向直进直出；复特征值向外螺线。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='先想最简单的微分方程：y′ = ay。答案是 y = ceᵃᵗ，增长率 a 决定一切。', read='先想一个最简单的微分方程：y的导数等于a乘y。答案是y等于c乘e的a t次方，增长率a决定一切。'),
    dict(id='C02', pose='claude_explain', sub='现在两个量互相影响：y₁′ = 3y₁ + 4y₂，y₂′ = 3y₁ + 2y₂。写成矩阵：Y′ = AY，A = (3 4; 3 2)。', read='现在两个量互相影响：y一的导数，等于三y一加四y二；y二的导数，等于三y一加二y二。写成矩阵，就是Y的导数等于A乘Y，A的第一行是三、四，第二行是三、二。'),
    dict(id='D01', mood='think', pose='ds_think', sub='两个方程缠在一起，不能各解各的……', read='两个方程缠在一起，不能分开，各解各的。'),
    dict(id='C03', pose='claude_smile', sub='所以去找特征向量。若 Ax = λx，试 Y = e^(λt)x：左边 Y′ = λe^(λt)x，右边 AY = e^(λt)Ax = λe^(λt)x。两边相等！', read='所以去找特征向量。如果A乘x等于拉姆达乘x，试一试Y等于e的拉姆达t次方乘x：左边求导，得拉姆达乘e的拉姆达t次方乘x；右边A乘Y，也得到同样的东西。两边相等！'),
    dict(id='C04', pose='claude_explain', sub='沿着特征向量，矩阵方程退化成一维的 y′ = λy。', read='沿着特征向量，矩阵方程就退化成了一维的方程。'),
    dict(id='C05', pose='claude_point', sub='例 1：特征值 6 和 −1，特征向量 x₁ = (4, 3)ᵀ，x₂ = (1, −1)ᵀ。通解 Y = c₁e⁶ᵗx₁ + c₂e⁻ᵗx₂。', read='例一：A的特征值是六和负一，特征向量x一是四、三，x二是一、负一。通解是c一乘e的六t次方乘x一，加c二乘e的负t次方乘x二。'),
    dict(id='C06', pose='claude_explain', sub='看相平面：每一点画出速度 AY。沿 x₁，点以 e⁶ᵗ 向外冲；沿 x₂，点以 e⁻ᵗ 往原点收。其余的点两种运动叠加，最后都被拉向 x₁ 方向。', read='看相平面：每一点都画出速度A乘Y。沿着x一的方向，点以e的六t次方向外冲；沿着x二的方向，点以e的负t次方往原点收。其余的点，两种运动叠加，最后都被拉向x一的方向。'),
    dict(id='C07', pose='claude_point', sub='加上初值 Y(0) = (6, 1)ᵀ：令 t = 0，c₁x₁ + c₂x₂ = (6, 1)ᵀ，解出 c₁ = 1，c₂ = 2。', read='再加上初值：Y零等于六、一。令t等于零，c一x一加c二x二，等于六、一，解出c一等于一，c二等于二。'),
    dict(id='C08', pose='claude_explain', sub='所以 y₁ = 4e⁶ᵗ + 2e⁻ᵗ，y₂ = 3e⁶ᵗ − 2e⁻ᵗ。代回原方程验证，两边处处相等。', read='所以，y一等于四e的六t次方，加二e的负t次方；y二等于三e的六t次方，减二e的负t次方。代回原方程验证，两边处处相等。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='求初值，就是把 Y₀ 拆到特征向量上！和婚姻那题一个套路。', read='求初值，就是把Y零拆到特征向量上！和婚姻那道题一个套路。'),
    dict(id='C09', pose='claude_smile', sub='完全一样。差别只在：离散的乘方 λⁿ，换成了连续的 e^(λt)。', read='完全一样。差别仅在于：离散的拉姆达n次方，换成了连续的e的拉姆达t次方。'),
    dict(id='C10', pose='claude_explain', sub='一般地，n 阶矩阵 A 有 n 个无关特征向量，通解就是 Y = c₁e^(λ₁t)x₁ + ⋯ + cₙe^(λₙt)xₙ。', read='一般地，如果n阶矩阵A有n个无关的特征向量，通解就是n项相加，每一项是常数，乘e的拉姆达i乘t次方，再乘特征向量x i。'),
    dict(id='C11', pose='claude_explain', sub='特征值是复数呢？例 2：A = (1 1; −2 3)，特征值 2 ± i，特征向量 (1, 1 + i)ᵀ。', read='如果特征值是复数呢？例二：A的第一行是一、一，第二行是负二、三。特征值是二加减i，特征向量是一、一加i。'),
    dict(id='C12', pose='claude_point', sub='用欧拉公式 e⁽²⁺ⁱ⁾ᵗ = e²ᵗ(cos t + i sin t)，把 e^(λt)x 拆成实部和虚部，两者都是实解。', read='用欧拉公式：e的二加i乘t次方，等于e的二t次方，乘括号余弦t加i正弦t。把解拆成实部和虚部，两个都是实数解。'),
    dict(id='C13', pose='claude_explain', sub='画面上：实部 2 让轨道以 e²ᵗ 向外扩张，虚部 1 让它绕原点旋转。合起来就是向外的螺线。', read='看画面：实部二，让轨道以e的二t次方向外扩张；虚部一，让它绕着原点旋转。合起来，就是向外的螺线。'),
    dict(id='D03', mood='think', pose='ds_think', sub='实部是负数，就变成往里转的螺线？', read='实部是负数的话，就变成往里转的螺线？'),
    dict(id='C14', pose='claude_smile', sub='没错。实部决定涨还是缩，虚部决定转得多快。所有特征值实部都为负，解就全部衰减到零，系统是稳定的。', read='没错。实部决定涨还是缩，虚部决定转得多快。如果所有特征值的实部都为负，解就全部衰减到零，系统是稳定的。'),
    dict(id='C15', pose='claude_explain', sub='应用：弹簧上的质量块。牛顿定律给出 y″ = −ky。令 y₁ = y，y₂ = y′，二阶方程变成一阶方程组，特征值是 ±√k·i。', read='应用：弹簧上的质量块。牛顿定律给出，y的二阶导数等于负k乘y。令y一等于y，y二等于y的导数，二阶方程就变成一阶方程组，系数矩阵的特征值是正负根号k乘i。'),
    dict(id='C16', pose='claude_point', sub='纯虚特征值：没有涨缩只有旋转，对应来回振动的简谐运动。教材还用同样的方法分析高楼在地震中的振动。', read='纯虚的特征值，没有涨缩，只有旋转，对应的就是来回振动的简谐运动。教材还用同样的方法，分析高楼在地震中的振动。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济线性代数不讲微分方程组，这部分在高等数学或常微分方程课里。但思路就是本节：先求特征值和特征向量。', read='同济对照：同济的线性代数不讲微分方程组，这部分内容在高等数学，或者常微分方程课里。但是思路就是本节：先求特征值和特征向量。'),
    dict(id='G02', pose='gpt_point', sub='学过同济的同学这样记：常系数线性方程组的“特征根法”，背后就是矩阵的特征值。', read='学过同济的同学可以这样记：常系数线性方程组的特征根法，背后就是矩阵的特征值。'),
    dict(id='C17', pose='claude_explain', sub='小结：Y′ = AY 的基本解是 e^(λt)x。实特征值给出指数增长或衰减，复特征值给出旋转。初值问题就是把 Y₀ 拆到特征向量上。', read='小结：Y的导数等于A乘Y，基本解是e的拉姆达t次方乘x。实特征值给出指数增长或衰减，复特征值给出旋转。初值问题，就是把Y零拆到特征向量上。'),
    dict(id='C18', pose='claude_point', sub='下一节：对角化。把“拆到特征向量上”这件事，写成一个矩阵分解。', read='下一节：对角化。把拆到特征向量上这件事，写成一个矩阵分解。'),
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
