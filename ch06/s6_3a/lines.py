# -*- coding: utf-8 -*-
"""第 6 章 6.3（上）对角化（Leon 9th §6.3：定理 6.3.1、6.3.2；例 1 A = (2 −3; 2 −5)，X = (3 1; 1 2)，D = diag(1, −4)，A⁵ = (206 −615; 410 −1229)；
例 2 特征值 0、1、1 可对角化；例 3 剪切 (1 1; 0 1) 亏损；例 4 A、B 特征值 4、2、2，代数重数 / 几何重数）台词源（唯一真源）。
3B1B 画面：第 13 集基变换，换到特征基里网格只沿两轴伸缩；剪切只有一条特征线。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='前两节反复用到一个动作：把向量拆到特征向量上。这一节把它写成矩阵语言：对角化。', read='前两节，反复用到一个动作：把向量拆到特征向量上。这一节，把它写成矩阵的语言：对角化。'),
    dict(id='C02', pose='claude_explain', sub='先要一个保证：定理 6.3.1，属于不同特征值的特征向量线性无关。', read='先要一个保证：定理六点三点一，属于不同特征值的特征向量，线性无关。'),
    dict(id='C03', pose='claude_point', sub='证明思路：假设相关，取一个组合等于零，左乘 A，再减去 λ 倍的原式，消掉一项，得到更短的相关组合，矛盾。', read='证明的思路：假设它们相关，取一个线性组合等于零，左乘A，再减去拉姆达倍的原式，就能消掉一项，得到更短的相关组合，矛盾。'),
    dict(id='C04', pose='claude_explain', sub='定义：若存在可逆矩阵 X 和对角矩阵 D，使 X⁻¹AX = D，就说 A 可对角化。', read='定义：如果存在可逆矩阵X和对角矩阵D，使X逆乘A乘X等于D，就说A可以对角化。'),
    dict(id='C05', pose='claude_point', sub='定理 6.3.2：n 阶矩阵 A 可对角化，当且仅当 A 有 n 个线性无关的特征向量。', read='定理六点三点二：n阶矩阵A可以对角化，等价于A有n个线性无关的特征向量。'),
    dict(id='C06', pose='claude_explain', sub='为什么？把特征向量排成 X 的列。AX 的第 j 列是 Axⱼ = λⱼxⱼ，正好是 XD 的第 j 列。所以 AX = XD。', read='为什么？把特征向量排成X的各列。A X的第j列，是A乘x j，等于拉姆达j乘x j，正好是X乘对角矩阵D的第j列。所以A X等于X D。'),
    dict(id='D01', mood='think', pose='ds_think', sub='X 的列是特征向量，D 的对角线是特征值……顺序要对应吗？', read='X的列是特征向量，D的对角线是特征值，顺序要对应吗？'),
    dict(id='C07', pose='claude_smile', sub='要。第 j 列的特征向量，配第 j 个对角元的特征值。顺序可以换，倍数可以变，但必须一一对应。', read='要。第j列的特征向量，配第j个对角元的特征值。顺序可以换，倍数可以变，但是必须一一对应。'),
    dict(id='C08', pose='claude_point', sub='例 1：A = (2 −3; 2 −5)，特征值 1 和 −4，特征向量 (3, 1)ᵀ 和 (1, 2)ᵀ。X = (3 1; 1 2)，D = diag(1, −4)。', read='例一：A的第一行是二、负三，第二行是二、负五。特征值是一和负四，特征向量是三、一，和一、二。把它们排成X，D的对角线是一和负四。'),
    dict(id='C09', pose='claude_explain', sub='3B1B 的看法：X 把标准基换成特征基。在特征基里看，A 只是沿两条轴各自伸缩：一条乘 1，一条乘 −4。D 就是这个样子。', read='换一个看法：X把标准基换成特征基。在特征基里看，A只是沿两条轴各自伸缩：一条乘一，一条乘负四。D就是这个简单的样子。'),
    dict(id='C10', pose='claude_explain', sub='最大的好处：A = XDX⁻¹，于是 Aᵏ = XDᵏX⁻¹，中间的 X⁻¹X 全部抵消。对角矩阵的 k 次方，只要对角元各自 k 次方。', read='对角化最大的好处：A等于X D X逆，于是A的k次方，等于X乘D的k次方乘X逆，中间的X逆X全部抵消。对角矩阵的k次方，只要每个对角元各自k次方。'),
    dict(id='C11', pose='claude_point', sub='比如 A⁵ = X·diag(1, −1024)·X⁻¹ = (206 −615; 410 −1229)。不用连乘五次。', read='比如A的五次方，等于X乘对角阵一、负一千零二十四，再乘X逆，结果第一行是二百零六、负六百一十五，第二行是四百一十、负一千二百二十九。不用连乘五次。'),
    dict(id='C12', pose='claude_explain', sub='例 2：一个三阶矩阵，特征值 0、1、1。λ = 1 是二重根，但特征空间是二维的：(1, 2, 0)ᵀ 和 (1, 0, 1)ᵀ。三个无关特征向量，照样能对角化。', read='例二：一个三阶矩阵，特征值是零、一、一。拉姆达等于一是二重根，但特征空间是二维的，有一、二、零，和一、零、一。三个无关的特征向量，照样能对角化。'),
    dict(id='D02', mood='think', pose='ds_confused', sub='那有没有对角化不了的？', read='那有没有对角化不了的？'),
    dict(id='C13', pose='claude_smile', sub='有。例 3：A = (1 1; 0 1)，剪切变换。特征值是二重的 1，可特征向量只有 (1, 0)ᵀ 这一个方向。', read='有。例三：A的第一行是一、一，第二行是零、一，这是剪切变换。特征值是二重的一，可是特征向量，只有一、零这一个方向。'),
    dict(id='C14', pose='claude_explain', sub='看网格：剪切把平面往右推，只有 x 轴上的向量留在原线上。凑不出两个无关特征向量，这样的矩阵叫亏损矩阵，不能对角化。', read='看网格：剪切把整个平面往右推，只有x轴上的向量留在原线上。凑不出两个无关的特征向量，这样的矩阵叫亏损矩阵，不能对角化。'),
    dict(id='C15', pose='claude_point', sub='例 4：A 和 B 的特征值都是 4、2、2。A 属于 2 的特征空间是一维的，B 的却是二维的。A 亏损，B 可以对角化。', read='例四把差别说清楚了：A和B的特征值都是四、二、二。A属于二的特征空间是一维的，B的却是二维的。A亏损，B可以对角化。'),
    dict(id='C16', pose='claude_explain', sub='术语：作为根的重数叫代数重数，特征空间的维数叫几何重数。几何重数不超过代数重数；每个特征值两者相等，才能对角化。', read='术语：特征值作为根的重数，叫代数重数；特征空间的维数，叫几何重数。几何重数不超过代数重数；每个特征值两者都相等，才能对角化。'),
    dict(id='D03', mood='easy', pose='ds_proud', sub='所以：特征值互不相同，一定能对角化；有重根，要数一数特征空间的维数！', read='所以：特征值互不相同，一定能对角化；有重根，就要看特征空间的维数！'),
    dict(id='C17', pose='claude_smile', sub='总结得很准。', read='总结得很准。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济第五章第三节“相似矩阵”：A 与对角阵相似，当且仅当 A 有 n 个线性无关的特征向量。同济把 X 记作 P，写成 P⁻¹AP = Λ。', read='同济对照：同济第五章第三节叫相似矩阵，结论写成：n阶矩阵A与对角阵相似，等价于A有n个线性无关的特征向量。同济把X记作P，写成P逆A P等于大拉姆达。'),
    dict(id='G02', pose='gpt_point', sub='同济计算题常问：A 能否对角化？若能，求 P 和 Λ。步骤：求特征值，逐个求基础解系，数够 n 个就排成 P。', read='同济的计算题常问：A能否对角化？如果能，求P和大拉姆达。标准步骤：求特征值，逐个求基础解系，数够n个，就把它们排成P。'),
    dict(id='C18', pose='claude_explain', sub='小结：A 可对角化 ⇔ 有 n 个无关特征向量。此时 A = XDX⁻¹，Aᵏ = XDᵏX⁻¹。重根要看几何重数，剪切是亏损的典型。', read='小结：A可以对角化，等价于有n个无关的特征向量。这时A等于X D X逆，A的k次方等于X D的k次方X逆。有重根要看几何重数，剪切是亏损的典型例子。'),
    dict(id='C19', pose='claude_point', sub='下一节：用对角化预测马尔可夫链的未来，并定义矩阵的指数函数。', read='下一节：用对角化，预测马尔可夫链的未来，并且定义矩阵的指数函数。'),
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
