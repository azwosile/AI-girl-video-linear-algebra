# -*- coding: utf-8 -*-
"""第 1 章 §1.3（上）向量与 Ax（Leon 9th §1.3：Matrix Notation、Vectors、Scalar Multiplication、Matrix Addition、
Matrix Multiplication and Linear Systems（Case 1 / Case 2、式 (6)）、Linear Combination、Theorem 1.3.1 相容性定理、例 3 / 5 / 6 / 7；
同济第六版 第二章 §1–§2（矩阵、线性变换 y = Ax、矩阵乘法）与 第四章 §1 定理 1（b 能由 A 的列线性表示 ⇔ R(A) = R(A, b)））台词源（唯一真源）。
3B1B 对应：Essence of Linear Algebra 第 1–3 集（箭头、数乘与加法、线性组合、矩阵 = 网格变换）。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # —— 开场：向量从哪来
    dict(id='D01', mood='daily', pose='ds_ask', sub='老师，上一节说要把方程组写成“矩阵乘向量”。向量到底是什么？', read='老师，上一节说要把方程组写成矩阵乘向量。向量到底是什么？'),
    dict(id='C01', pose='claude_smile', sub='先别急着背定义。我们从一个老朋友开始。'),
    dict(id='C02', pose='claude_point', sub='还记得吗？x₁ + x₂ = 3，x₁ − x₂ = 1。解是 x₁ = 2，x₂ = 1。', read='还记得这个方程组吗？x一加x二等于三，x一减x二等于一。它的解是x一等于二，x二等于一。'),
    dict(id='C03', pose='claude_explain', sub='两个数按顺序排好，就是一个向量。横着写叫行向量，竖着写叫列向量。'),
    dict(id='C04', pose='claude_explain', sub='教材默认竖着写。由 n 个实数组成的列向量，全体记作 ℝⁿ，叫 n 维欧氏空间。', read='教材默认竖着写。由n个实数组成的列向量，全体记作R n，叫n维欧氏空间。'),
    dict(id='D02', mood='think', pose='ds_confused', sub='可这不就是一列数吗？跟“向量”这个名字有什么关系？'),
    dict(id='C05', pose='claude_point', sub='关键在画法。把 (2, 1) 画成一支箭头：从原点出发，向右走 2，向上走 1。', read='关键在画法。把二、一画成一支箭头：从原点出发，向右走二，向上走一。'),
    dict(id='C06', pose='claude_explain', sub='物理里，向量是有方向的箭头；算的时候，向量是一列数。线性代数让这两种看法随时切换。'),
    dict(id='G01', pose='gpt_explain', sub='补个记号：aᵢⱼ 是 A 第 i 行第 j 列的元素；A 的第 j 列记作 aⱼ，它本身就是一个列向量。', read='补个记号：a i j，是A第i行、第j列的元素。A的第j列记作a j，它本身就是一个列向量。'),
    # —— 数乘
    dict(id='C07', pose='claude_explain', sub='箭头能做两件事。第一件：数乘。乘以 2，箭头拉长到两倍。', read='箭头能做两件事。第一件：数乘。乘以二，箭头拉长到两倍。'),
    dict(id='C08', pose='claude_point', sub='乘以 −1，箭头掉头；乘以 ½，缩成一半。负责缩放的这个数，叫标量。', read='乘以负一，箭头掉头；乘以二分之一，缩成一半。负责缩放的这个数，叫标量。'),
    dict(id='C09', pose='claude_explain', sub='矩阵的数乘也一样：每个元素都乘上这个数。比如 ½A。', read='矩阵的数乘也一样：每个元素都乘上这个数。比如二分之一乘A。'),
    # —— 加法
    dict(id='C10', pose='claude_explain', sub='第二件：加法。u + v，就是把 v 的尾巴接到 u 的箭头尖上，从起点直奔终点。', read='第二件：加法。u加v，就是把v的尾巴，接到u的箭头尖上，从起点直奔终点。'),
    dict(id='C11', pose='claude_point', sub='算起来更简单：对应分量相加。(1, 2) + (3, −1) = (4, 1)。', read='算起来更简单：对应分量相加。一、二，加上三、负一，等于四、一。'),
    dict(id='D03', mood='daily', pose='ds_ask', sub='那两个矩阵相加呢？'),
    dict(id='C12', pose='claude_smile', sub='也是对应元素相加。所以两个矩阵必须一样大，行数、列数都相同。'),
    dict(id='G02', pose='gpt_cross', sub='顺带一提：全是 0 的矩阵叫零矩阵 O，加上它什么都不变；A + (−1)A = O。', read='顺带一提：全是零的矩阵叫零矩阵，加上它什么都不变。A加上负一倍的A，就得到零矩阵。'),
    # —— 线性组合 → 方程组
    dict(id='C13', pose='claude_explain', sub='把两件事合起来：先各自缩放，再加在一起，这叫线性组合。'),
    dict(id='C14', pose='claude_point', sub='比如 2 倍的 (1, 1)，加 1 倍的 (1, −1)：走两步，再走一步，到达 (3, 1)。', read='比如两倍的一、一，加上一倍的一、负一：先走两步，再走一步，到达三、一。'),
    dict(id='D04', mood='panic', pose='ds_shock', sub='等等！3 和 1……不就是刚才方程组的右边吗？', read='等等！三和一……不就是刚才方程组的右边吗？'),
    dict(id='C15', pose='claude_smile', sub='眼尖！这不是巧合。我们把方程组竖着看。'),
    dict(id='C16', pose='claude_explain', sub='把 x₁ 的系数竖着排成一列，x₂ 的系数也排成一列。', read='把x一的系数竖着排成一列，x二的系数也排成一列。'),
    dict(id='C17', pose='claude_point', sub='方程组就变成一句话：x₁ 倍的第一列，加 x₂ 倍的第二列，等于右边的 (3, 1)。', read='方程组就变成一句话：x一倍的第一列，加上x二倍的第二列，等于右边的三、一。'),
    dict(id='C18', pose='claude_explain', sub='解方程，就是在问：两支箭头各取几倍，才能拼出右边？答案是 2 倍和 1 倍。', read='解方程，就是在问：两支箭头各取几倍，才能拼出右边？答案是两倍和一倍。'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='原来解就是一份“配方”！'),
    dict(id='C19', pose='claude_point', sub='对。同一个方程组，有两种看法。按行看：每个方程是一条直线，解是交点 (2, 1)。', read='对。同一个方程组，有两种看法。按行看：每个方程是一条直线，解是交点二、一。'),
    dict(id='C20', pose='claude_explain', sub='按列看：两支列向量各自缩放，首尾相接，拼出右边的向量。'),
    dict(id='C21', pose='claude_smile', sub='交点的坐标 2 和 1，正好就是配方里的 2 倍和 1 倍。', read='交点的坐标二和一，正好就是配方里的两倍和一倍。'),
    # —— 定义 Ax
    dict(id='C22', pose='claude_explain', sub='现在可以定义矩阵乘向量了。系数排成矩阵 A，未知数排成向量 x。', read='现在可以定义矩阵乘向量了。系数排成矩阵A，未知数排成向量x。'),
    dict(id='C23', pose='claude_point', sub='A 乘 x：用 x 的每个分量，去乘 A 的对应列，再全部加起来。', read='A乘x：用x的每个分量，去乘A的对应列，再全部加起来。'),
    dict(id='C24', pose='claude_smile', sub='于是整个方程组，缩成一个式子：Ax = b。', read='于是整个方程组，缩成一个式子：A x等于b。'),
    dict(id='D06', mood='think', pose='ds_confused', sub='可我在别处看到的算法，是“行乘列”啊？', read='可我在别处看到的算法，是行乘列啊？'),
    dict(id='C25', pose='claude_explain', sub='那是另一种算法，结果完全一样。A 的第 i 行和 x 对应相乘再相加，就是结果的第 i 个数。', read='那是另一种算法，结果完全一样。A的第i行和x对应相乘、再相加，就是结果的第i个数。'),
    dict(id='C26', pose='claude_point', sub='先看一行：(2, 1, −3, 4) 乘 (3, 2, 1, −2)，是 6 + 2 − 3 − 8 = −3。行乘列，得到一个数。', read='先看只有一行的：二、一、负三、四，乘三、二、一、负二，是六加二减三减八，等于负三。行乘列，得到一个数。'),
    dict(id='C27', pose='claude_explain', sub='再看三行两列的 A 乘 (2, 4)：每一行各做一次，得到 (−2, 24, 16)。', read='再看三行两列的A，乘二、四：每一行各做一次，得到负二、二十四、十六。'),
    dict(id='C28', pose='claude_point', sub='按列算一遍：2 倍的第一列，加 4 倍的第二列。结果一模一样。', read='按列再算一遍：两倍的第一列，加上四倍的第二列。结果一模一样。'),
    dict(id='G03', pose='gpt_explain', sub='尺寸要对上：A 是 m 行 n 列，x 就得有 n 个分量，乘出来的 Ax 有 m 个分量。', read='尺寸要对上：A是m行n列，x就得有n个分量，乘出来的A x有m个分量。'),
    # —— 网格变换主画面
    dict(id='C29', pose='claude_explain', sub='还有一种更直观的看法：把 A 当成一个动作，整个平面都跟着它动。', read='还有一种更直观的看法：把A当成一个动作，整个平面都跟着它动。'),
    dict(id='C30', pose='claude_point', sub='向右的单位箭头 î，落到 A 的第一列；向上的 ĵ，落到第二列。', read='向右的单位箭头i帽，落到A的第一列；向上的j帽，落到第二列。'),
    dict(id='C31', pose='claude_explain', sub='网格跟着变形，但格线依然平行、间距均匀，原点不动。'),
    dict(id='C32', pose='claude_point', sub='x = (2, 1) 落在哪？它原本是两步 î 加一步 ĵ，变换后就是两倍第一列加一倍第二列。', read='x等于二、一，落在哪？它原本是两步i帽加一步j帽，变换后，就是两倍第一列加一倍第二列。'),
    dict(id='C33', pose='claude_smile', sub='正好落在 b = (3, 1)。所以 Ax = b 问的是：哪个 x 被 A 送到了 b？', read='正好落在b等于三、一。所以A x等于b问的是：哪个x，被A送到了b？'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='这么一看，解方程就是找“谁被送到了这里”！', read='这么一看，解方程就是找，谁被送到了这里！'),
    # —— 相容性定理
    dict(id='C34', pose='claude_explain', sub='这就引出教材的定理 1.3.1，相容性定理：', read='这就引出教材的定理一点三点一，相容性定理：'),
    dict(id='C35', pose='claude_point', sub='Ax = b 有解，当且仅当 b 能写成 A 的列向量的线性组合。', read='A x等于b有解，当且仅当，b能写成A的列向量的线性组合。'),
    dict(id='D08', mood='think', pose='ds_ask', sub='那什么时候写不成？'),
    dict(id='C36', pose='claude_explain', sub='看例 7：x₁ + 2x₂ = 1，2x₁ + 4x₂ = 1。两列是 (1, 2) 和 (2, 4)。', read='看例七：x一加二x二等于一，二x一加四x二等于一。两列分别是一、二，和二、四。'),
    dict(id='C37', pose='claude_point', sub='第二列正好是第一列的两倍，两支箭头躺在同一条直线上。'),
    dict(id='C38', pose='claude_think', sub='怎么缩放、怎么相加，都跑不出这条线。可 b = (1, 1) 不在线上。', read='不管怎么缩放、怎么相加，都跑不出这条线。可b等于一、一，不在这条线上。'),
    dict(id='C39', pose='claude_explain', sub='所以无解。这就是第一节里的“不相容”，只是换成列的角度来看。', read='所以无解。这就是第一节里的不相容，只是换成列的角度来看。'),
    dict(id='D09', mood='panic', pose='ds_shock', sub='按行看是两条平行线，按列看是够不着！'),
    dict(id='C40', pose='claude_smile', sub='说得好。两种看法，讲的是同一件事。'),
    dict(id='G04', pose='gpt_proud', sub='同济的顺序不同：第二章先用“行乘列”定义乘法，把 y = Ax 叫线性变换；“b 能由列线性表示”要到第四章才讲。', read='同济的顺序不一样：第二章先用行乘列定义乘法，把y等于A x叫作线性变换；b能由各列线性表示，要到第四章才讲。'),
    # —— 总结
    dict(id='D10', mood='easy', pose='ds_happy', sub='我来总结！向量能缩放、能相加；Ax 就是拿 x 当配方，把 A 的列组合起来！', read='我来总结！向量能缩放、能相加；A x就是拿x当配方，把A的列组合起来！'),
    dict(id='D11', mood='easy', pose='ds_happy', sub='方程有解，就是右边能被 A 的列拼出来！', read='方程有解，就是右边能被A的列拼出来！'),
    dict(id='C41', pose='claude_smile', sub='完全正确。下一节，矩阵乘矩阵：两个动作接连做，会发生什么？'),
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
