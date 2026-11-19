# -*- coding: utf-8 -*-
"""第 6 章 6.3（下）马尔可夫链与矩阵指数（Leon 9th §6.3：概率向量、随机矩阵、婚姻链 λ = 1, ½，稳态 (0.4, 0.6)ᵀ；定理 6.3.3；
例 5 租车 λ = 1, 0.8, 0.7, 0.7，稳态各 ¼；应用 2 PageRank；e^A 级数；例 6 A = (−2 −6; 1 3)；例 7 e^{tA}Y₀）台词源（唯一真源）。
3B1B 画面：状态点迭代落到稳态线；e^{tA} 流。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='回到婚姻模型。把人数除以总数，向量就变成比例：分量非负、加起来等于 1，叫概率向量。', read='回到婚姻的例子。把人数除以总人数，向量就变成了比例：每个分量非负，加起来等于一，叫作概率向量。'),
    dict(id='C02', pose='claude_explain', sub='每一步只依赖上一步、转移概率固定不变的过程，叫马尔可夫链。A 叫转移矩阵：每一列都是概率向量，这样的矩阵叫随机矩阵。', read='每一步只依赖上一步，转移概率又固定不变的过程，叫马尔可夫链。A叫转移矩阵：每一列都是概率向量，这样的矩阵叫随机矩阵。'),
    dict(id='C03', pose='claude_point', sub='对角化婚姻矩阵：特征值 1 和 ½，特征向量 (2, 3)ᵀ 和 (−1, 1)ᵀ。Aⁿ = X·diag(1, (½)ⁿ)·X⁻¹，n → ∞ 时 (½)ⁿ → 0。', read='对角化婚姻矩阵：特征值是一和二分之一，特征向量是二、三，和负一、一。A的n次方，等于X乘对角阵一、二分之一的n次方，再乘X逆。n趋于无穷，二分之一的n次方趋于零。'),
    dict(id='C04', pose='claude_explain', sub='看画面：不管从哪个比例出发，状态点一步步落到 (2, 3)ᵀ 那条直线上，最后停在 (0.4, 0.6)ᵀ。这就是稳态向量。', read='看画面：不管从哪个比例出发，状态点一步一步，落到二、三那条直线上，最后停在零点四、零点六。这就是稳态向量。'),
    dict(id='D01', mood='think', pose='ds_think', sub='稳态向量一定是属于 1 的特征向量吗？', read='稳态向量，一定是属于一的特征向量吗？'),
    dict(id='C05', pose='claude_smile', sub='是的。定理 6.3.3：若马尔可夫链收敛到 x，则 x 是概率向量，而且 Ax = x，就是属于特征值 1 的特征向量。', read='是的。定理六点三点三：如果马尔可夫链收敛到x，那么x是概率向量，而且A乘x等于x，也就是属于特征值一的特征向量。'),
    dict(id='C06', pose='claude_explain', sub='随机矩阵一定有特征值 1，其余特征值绝对值都不超过 1。若 1 是唯一的最大者，叫主特征值，链就必然收敛到稳态。', read='随机矩阵一定有特征值一，其余特征值的绝对值，都不超过一。如果一是唯一的最大者，叫作主特征值，链就必然收敛到稳态。'),
    dict(id='C07', pose='claude_point', sub='教材的租车例子：四种车型，转移矩阵 4 阶，特征值 1、0.8、0.7、0.7。长期来看，四种车各占四分之一。', read='教材的租车例子：四种车型，转移矩阵是四阶的，特征值是一、零点八、零点七、零点七。长期来看，四种车各占四分之一。'),
    dict(id='C08', pose='claude_explain', sub='再大一点就是网页排名：把互联网看成马尔可夫链，用户沿链接随机点击。稳态向量的分量，就是每个网页的重要程度。', read='再大一点，就是网页排名：把互联网看成一个马尔可夫链，用户沿着链接随机点击。稳态向量的各个分量，就是每个网页的重要程度。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='搜索引擎排序，原来就是求一个特征向量！', read='搜索引擎排序，原来就是求一个特征向量！'),
    dict(id='C09', pose='claude_smile', sub='对，而且是属于特征值 1 的那一个。下面换个方向：矩阵的指数函数。', read='对，而且是属于特征值一的那一个。下面换一个方向：矩阵的指数函数。'),
    dict(id='C10', pose='claude_explain', sub='数的指数有级数 eᵃ = 1 + a + a²/2! + ⋯。把 a 换成方阵 A，就定义了 eᴬ = I + A + A²/2! + A³/3! + ⋯。', read='数的指数函数，有级数展开：e的a次方，等于一加a，加a平方除以二的阶乘，一直加下去。把a换成方阵A，就定义了e的A次方：I加A，加A平方除以二的阶乘，加A立方除以三的阶乘，一直加下去。'),
    dict(id='C11', pose='claude_point', sub='若 A = XDX⁻¹，每一项都是 X·Dᵏ·X⁻¹，加起来 eᴬ = X·eᴰ·X⁻¹。eᴰ 只要把对角元各自取指数。', read='如果A等于X D X逆，每一项都是X乘D的k次方乘X逆，加起来，e的A次方，就等于X乘e的D次方乘X逆。而e的D次方，只要把对角元各自取指数。'),
    dict(id='C12', pose='claude_explain', sub='例 6：A = (−2 −6; 1 3)，特征值 1 和 0，特征向量 (−2, 1)ᵀ 和 (−3, 1)ᵀ。eᴬ = X·diag(e, 1)·X⁻¹ = (3 − 2e  6 − 6e; e − 1  3e − 2)。', read='例六：A的第一行是负二、负六，第二行是一、三。特征值是一和零，特征向量是负二、一，和负三、一。e的A次方，等于X乘对角阵e、一，再乘X逆。结果第一行是三减二e、六减六e，第二行是e减一、三e减二。'),
    dict(id='D03', mood='think', pose='ds_think', sub='算这个有什么用？', read='算这个，有什么用呢？'),
    dict(id='C13', pose='claude_smile', sub='它把上一节的微分方程变成一行：Y′ = AY，Y(0) = Y₀ 的解就是 Y = eᵗᴬY₀，和一维的 y = eᵃᵗy₀ 一模一样。', read='它把上一节的微分方程变成一行：Y的导数等于A乘Y，初值为Y零，解就是e的t A次方乘Y零。和一维的公式长得完全一样。'),
    dict(id='C14', pose='claude_point', sub='例 7：还是 A = (3 4; 3 2)，Y₀ = (6, 1)ᵀ。eᵗᴬY₀ = X·diag(e⁶ᵗ, e⁻ᵗ)·X⁻¹Y₀，算出 4e⁶ᵗ + 2e⁻ᵗ 和 3e⁶ᵗ − 2e⁻ᵗ，和上一节完全一样。', read='例七：还是上一节的A，Y零是六、一。e的t A次方乘Y零，等于X乘对角阵e的六t次方、e的负t次方，再乘X逆乘Y零。算出来，和上一节的答案完全一样。'),
    dict(id='C15', pose='claude_explain', sub='两件事其实是一回事：离散时间看 Aⁿ，连续时间看 eᵗᴬ。都靠对角化，把矩阵运算变成对角线上数的运算。', read='这两件事，其实是一回事：离散时间看A的n次方，连续时间看e的t A次方。都靠对角化，把矩阵运算变成对角线上数的运算。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济本章不讲马尔可夫链和矩阵指数，但会出“已知 P⁻¹AP = Λ，求 Aⁿ 或 φ(A)”的题，用的正是 Aⁿ = PΛⁿP⁻¹。', read='同济对照：同济这一章，不讲马尔可夫链和矩阵指数，但会出这样的题：已知P逆A P等于大拉姆达，求A的n次方，或者求phi A。用的正是对角化的公式。'),
    dict(id='G02', pose='gpt_point', sub='比如求 φ(A) = A¹⁰ − 5A⁹：先对角化，φ(A) = P·φ(Λ)·P⁻¹，φ 作用到每个特征值上就行。', read='比如求phi A，等于A的十次方减五倍A的九次方：先对角化，phi A等于P乘phi大拉姆达乘P逆，phi作用到每个特征值上就行。'),
    dict(id='C16', pose='claude_explain', sub='小结：随机矩阵有特征值 1，稳态就是属于 1 的概率特征向量。对角化后，Aⁿ 和 eᵗᴬ 都只需对特征值取幂或取指数。', read='小结：随机矩阵有特征值一，稳态就是属于一的概率特征向量。对角化以后，A的n次方，和e的t A次方，都只需要对特征值取幂，或者取指数。'),
    dict(id='C17', pose='claude_point', sub='下一节：对称矩阵。它的特征向量互相垂直，对角化会格外漂亮。', read='下一节：对称矩阵。它的特征向量互相垂直，对角化会变得格外漂亮。'),
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
