# -*- coding: utf-8 -*-
"""第 3 章 复习（上）判断题（Leon 9th Chapter 3 Test A，15 题选 12 题：1 2 3 4 6 7 8 10 12 13 14 15；第 5、9、11 题在相邻题里顺带说明）台词源（唯一真源）。
答案：1T 2F 3F 4F 6T 7F 8T 10F 12F 13T 14F 15F。大肥鱼 4 / 12（对 1、8、12、13）。
形式：题卡 → 大肥鱼抢答气泡 → 判定印章 → 理由 / 最小反例（配 3B1B 画面）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='第三章我全会了！子空间、张成、基、维数、换基，来考我！', read='第三章我全会了！子空间、张成、基、维数、换基，来考我吧！'),
    dict(id='C01', pose='claude_smile', sub='好。教材第三章判断题共 15 道，我们挑 12 道：永远成立判“对”并说理由，不一定成立就举反例。', read='好。教材第三章的判断题，一共十五道，我们挑其中十二道。永远成立，就判对，并说出理由；不一定成立，就举一个反例。'),
    # 1
    dict(id='C02', pose='claude_point', sub='第 1 题：S 是向量空间 V 的子空间，则 S 本身是向量空间。', read='第一题：如果S是向量空间V的子空间，那么S本身也是一个向量空间。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='对！名字里就有“空间”。', read='对！子空间嘛，名字里就有空间两个字。'),
    dict(id='C03', pose='claude_explain', sub='对，但理由不是名字：S 对加法、数乘封闭，其余公理从 V 继承，零向量和负向量靠数乘封闭得到。', read='对，不过理由不是名字。S对加法和数乘封闭，其余的公理从V继承过来，零向量和负向量，靠数乘封闭得到。八条全都成立。'),
    # 2
    dict(id='C04', pose='claude_point', sub='第 2 题：ℝ² 是 ℝ³ 的子空间。', read='第二题：R二是R三的子空间。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='平面在空间里面，当然是！'),
    dict(id='C05', pose='claude_think', sub='错。ℝ² 的向量有两个分量，ℝ³ 的有三个，ℝ² 根本不是 ℝ³ 的子集。', read='错。R二的向量有两个分量，R三的向量有三个，R二根本就不是R三的子集。'),
    dict(id='C06', pose='claude_explain', sub='真正的子空间是 {(x₁, x₂, 0)ᵀ}，即 xy 平面。它长得像 ℝ²，但不是 ℝ² 本身。', read='真正的子空间，是第三个分量等于零的那些向量，也就是x y平面。它长得像R二，但不是R二本身。'),
    # 3
    dict(id='C07', pose='claude_point', sub='第 3 题：ℝ³ 中可以找到两个二维子空间 S、T，使 S ∩ T = {0}。', read='第三题：在R三中，可以找到两个二维子空间S和T，让它们的交集里，除了零向量，再没有别的向量。'),
    dict(id='D04', mood='think', pose='ds_think', sub='两张平面，转一转角度，应该能做到就在原点碰一下吧？', read='两张平面，转一转角度，应该能做到，就在原点碰一下吧？'),
    dict(id='C08', pose='claude_explain', sub='错。看画面：两张过原点的平面，怎么转，都交出一整条直线。', read='错。看画面：两张过原点的平面，不管怎么转，都会交出一整条直线。'),
    dict(id='C09', pose='claude_point', sub='代数上：两组基共 4 个向量，在 ℝ³ 里必然相关。关系式分成两边，就得到同时属于 S、T 的非零向量。', read='代数上：两组基一共四个向量，放在三维空间里，一定线性相关。把关系式分成两边，就得到一个同时属于S和T的非零向量。'),
    # 4
    dict(id='C10', pose='claude_point', sub='第 4 题：S、T 是 V 的子空间，则 S ∪ T 是 V 的子空间。', read='第四题：如果S和T是V的子空间，那么S和T的并集，也是V的子空间。'),
    dict(id='D05', mood='easy', pose='ds_proud', sub='并起来更大了，肯定还是！'),
    dict(id='C11', pose='claude_explain', sub='错。这道见过：x 轴、y 轴都是子空间，并起来是两条坐标轴。(1, 0) + (0, 1) = (1, 1)，跑出去了。', read='错。这道题我们其实见过：x轴和y轴都是子空间，并起来就是两条坐标轴。一、零加上零、一，得到一、一，跑出去了。'),
    dict(id='C12', pose='claude_smile', sub='顺便说第 5 题：S ∩ T 一定是子空间——交集里的向量加完、乘完，还在两边里面。', read='顺便说一下第五题：交集一定是子空间。因为两边都封闭，交集里的向量加完、乘完，还在两边里面。'),
    # 6
    dict(id='C13', pose='claude_point', sub='第 6 题：x₁, …, xₙ 张成 ℝⁿ，则它们线性无关。', read='第六题：如果n个向量张成R n，那么它们线性无关。'),
    dict(id='D06', mood='think', pose='ds_think', sub='能张成，不代表不多余。错！'),
    dict(id='C14', pose='claude_explain', sub='对。关键在个数：正好 n 个，空间正好 n 维。定理 3.4.3：数量对了，张成就自动线性无关。', read='对。关键在个数：正好n个向量，空间又正好是n维。定理三点四点三：数量对了，张成就自动线性无关。'),
    dict(id='D07', mood='panic', pose='ds_shock', sub='啊？那我学聪明了——', read='啊？那我学聪明了！'),
    # 7
    dict(id='C15', pose='claude_point', sub='第 7 题：x₁, …, xₙ 张成向量空间 V，则它们线性无关。', read='第七题：如果n个向量张成向量空间V，那么它们线性无关。'),
    dict(id='D08', mood='easy', pose='ds_happy', sub='和第六题一样，对！'),
    dict(id='C16', pose='claude_think', sub='错。这次 V 不一定是 n 维的。V = ℝ²，取 e₁、e₂、e₁ + e₂：张成 ℝ²，但线性相关。', read='错。这一次，V不一定是n维的。比如V是R二，取e一、e二、e一加e二，三个向量张成R二，但是线性相关。'),
    # 8
    dict(id='C17', pose='claude_point', sub='第 8 题：去掉最后一个向量，张成不变，则这 k 个向量线性相关。', read='第八题：如果k个向量的张成，和去掉最后一个向量以后的张成相同，那么这k个向量线性相关。'),
    dict(id='D09', mood='easy', pose='ds_happy', sub='去掉它张成不变，说明它是白加的。对！'),
    dict(id='C18', pose='claude_explain', sub='对。最后一个向量在前面向量的张成里，能写成它们的组合，移项就得到系数不全为零的零组合。', read='对。最后那个向量在前面向量的张成里，就能写成它们的组合，移项，就是一个系数不全为零、却等于零的组合。'),
    # 10
    dict(id='C19', pose='claude_point', sub='第 10 题：A 是 m×n 矩阵，则 A 与 Aᵀ 的零化度相同。', read='第十题：如果A是m行n列的矩阵，那么A和A转置的零化度相同。'),
    dict(id='D10', mood='easy', pose='ds_proud', sub='第九题说秩相同，那零化度也相同。对！', read='第九题说秩相同，那零化度也相同嘛。对！'),
    dict(id='C20', pose='claude_think', sub='第 9 题确实对。可零化度一个是 n − r，一个是 m − r，m ≠ n 时就不一样。', read='第九题确实是对的，秩相同。可是零化度，一个是n减r，一个是m减r。m和n不相等，它们就不一样。'),
    dict(id='C21', pose='claude_explain', sub='A = (1  1)：零化度 2 − 1 = 1；Aᵀ 是 2×1，零化度 1 − 1 = 0。错。', read='比如一行两列的矩阵：一、一。它的零化度是一；转置以后变成两行一列，零化度是零。所以错。'),
    # 12
    dict(id='C22', pose='claude_point', sub='第 12 题：U 是 A 的行最简形，则 A 与 U 的列空间相同。', read='第十二题：如果U是A的行最简形，那么A和U的列空间相同。'),
    dict(id='D11', mood='easy', pose='ds_proud', sub='这个我记住了！行变换会改变列空间。错！'),
    dict(id='C23', pose='claude_smile', sub='答对了。A = (1, 1)ᵀ，列空间是直线 y = x；U = (1, 0)ᵀ，列空间变成 x 轴。第 11 题的行空间才相同。', read='答对了。A是一列：一、一，列空间是直线y等于x；最简形是一、零，列空间变成了x轴。第十一题说的行空间，才是相同的。'),
    # 13
    dict(id='C24', pose='claude_point', sub='第 13 题：k 个向量线性无关，k < n，新向量不在它们的张成里 ⇒ 这 k + 1 个向量仍线性无关。', read='第十三题：k个线性无关的向量，k小于n。如果再加一个不在它们张成里的向量，那么这k加一个向量仍然线性无关。'),
    dict(id='D12', mood='easy', pose='ds_happy', sub='新向量伸向新方向，对！'),
    dict(id='C25', pose='claude_explain', sub='对。设组合为零：新向量系数若非零，它就能被前面的表示，矛盾；所以它的系数为零，其余也全为零。', read='对。设组合等于零：如果新向量的系数不是零，它就能被前面的向量表示，矛盾；所以它的系数是零，剩下的系数也就全是零。'),
    # 14
    dict(id='C26', pose='claude_point', sub='第 14 题：X 是 {u} 到 {v} 的过渡矩阵，Y 是 {v} 到 {w} 的，则 Z = XY 是 {u} 到 {w} 的。', read='第十四题：X是从u基到v基的过渡矩阵，Y是从v基到w基的过渡矩阵，那么X乘Y，就是从u基到w基的过渡矩阵。'),
    dict(id='D13', mood='easy', pose='ds_happy', sub='先 X 再 Y，乘起来就是 XY。对！', read='先做X，再做Y。乘起来，就是X Y。对！'),
    dict(id='C27', pose='claude_explain', sub='错。v 坐标 = X · u 坐标，w 坐标 = Y · v 坐标 = YX · u 坐标。先做的写在右边，应该是 YX。', read='错。按教材的定义：v坐标等于X乘u坐标，w坐标等于Y乘v坐标，合起来是Y X乘u坐标。先做的写在右边，应该是Y X。'),
    # 15
    dict(id='C28', pose='claude_point', sub='第 15 题：A、B 是 n×n 矩阵且秩相同，则 A² 与 B² 的秩也相同。', read='第十五题：A和B是同阶方阵，秩相同，那么A的平方和B的平方，秩也相同。'),
    dict(id='D14', mood='easy', pose='ds_happy', sub='秩一样，平方以后也一样嘛。对！'),
    dict(id='C29', pose='claude_think', sub='错。A = [[0, 1], [0, 0]]，秩 1，A² = O，秩 0；B = [[1, 0], [0, 0]]，秩 1，B² = B，秩还是 1。', read='错。A等于零、一；零、零，秩是一，可是A的平方是零矩阵，秩是零。B等于一、零；零、零，秩是一，B的平方还是B，秩还是一。'),
    # 结尾
    dict(id='D15', mood='sigh', pose='ds_confused', sub='十二道，我才对了四道……', read='十二道，我才对了四道。'),
    dict(id='C30', pose='claude_smile', sub='不错了。总结一下，这一章判断题的反例，主要来自三个地方：'),
    dict(id='C31', pose='claude_explain', sub='① 两条坐标轴：专治并集；② 个数和维数对不上：专治“张成 ⇒ 无关”；③ 一列 (1, 1)ᵀ 和幂零矩阵：专治列空间和秩。', read='第一，两条坐标轴，专门对付并集；第二，个数和维数对不上，专门对付张成就无关；第三，一列一、一，和幂零矩阵，专门对付列空间和秩。'),
    dict(id='G01', pose='gpt_point', sub='遇到判断题，先在 ℝ²、ℝ³ 里画一画，反例往往就藏在坐标轴里。', read='遇到判断题，先在R二、R三里画一画，反例往往就藏在坐标轴里。'),
    dict(id='C32', pose='claude_smile', sub='下一节，我们做期中考试的真题。'),
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
