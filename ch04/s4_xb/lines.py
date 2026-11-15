# -*- coding: utf-8 -*-
"""第 4 章 复习（下）计算题 + 同济期末题型（Leon 9th Chapter 4 Test B 第 3、4、9 题；同济第五章风格“相似求参数”；
总结 + 预告第五章 正交性）台词源（唯一真源）。
数值：TB3 ker = Span{(1,1,1)ᵀ}，L(S) = Span{(−1,1,0)ᵀ}；TB4 值域 = 平面 y₃ = y₁ + y₂；
TB9 S = U⁻¹V = [[12,7],[−7,−4]]，B = S⁻¹AS = [[−222,−131],[383,226]]，tr 4、det 1；同济 x = 0，y = 1。
不编造“某年期中考过”：期中卷里线性变换很少出现，这一节定位为 Test B 精选 + 同济期末常见题型。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='G01', pose='gpt_explain', sub='先说明：我们翻了 9 份期中卷，线性变换很少出现，它主要考在期末。', read='先说明一下：我们翻了九份期中卷，线性变换很少出现，它主要考在期末。'),
    dict(id='G02', pose='gpt_point', sub='所以这一节选英文教材 Test B 的三道计算题，再加一道同济期末常见的“相似求参数”。', read='所以这一节，选英文教材测验B的三道计算题，再加一道同济期末常见的，相似求参数。'),
    dict(id='D01', mood='easy', pose='ds_proud', sub='计算题我拿手！来吧！', read='计算题我拿手！来吧！'),
    # Test B 3
    dict(id='C01', pose='claude_point', sub='第一题，Test B 第 3 题：L(x) = (x₂ − x₁, x₃ − x₂, x₃ − x₁)ᵀ，S = Span{(1, 0, 1)ᵀ}。求核，求 L(S)。', read='第一题，测验B第三题：L x 等于x二减x一、x三减x二、x三减x一；S是一、零、一张成的直线。求核，再求S的像。'),
    dict(id='C02', pose='claude_explain', sub='套路卡①：求核 = 解 L(x) = 0。三个分量都为零：x₁ = x₂ = x₃。', read='套路卡一：求核，就是解L x 等于零。三个分量都为零，就是x一等于x二，等于x三。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='三个分量相等，那核就是 (1, 1, 1)ᵀ 张成的直线！', read='三个分量相等，那核，就是一、一、一张成的直线！'),
    dict(id='C03', pose='claude_smile', sub='对。几何上：所有分量同时加一个常量，两两之差不变，输出就不变。', read='对。几何上看：所有分量同时加上同一个常量，两两相减的结果不变，输出也就不变。'),
    dict(id='C04', pose='claude_point', sub='套路卡②：求像 = 把张成向量送过去。L((1, 0, 1)ᵀ) = (−1, 1, 0)ᵀ，所以 L(S) = Span{(−1, 1, 0)ᵀ}。', read='套路卡二：求像，就是把张成向量送过去。一、零、一的像，是负一、一、零，所以S的像，就是负一、一、零张成的直线。'),
    dict(id='C05', pose='claude_explain', sub='原因：S 里每个向量都是 c(1, 0, 1)ᵀ，线性性让它的像就是 c(−1, 1, 0)ᵀ。', read='原因是：S里每个向量，都是一、零、一的倍数，线性性保证，它的像就是负一、一、零的同样倍数。'),
    # Test B 4
    dict(id='C06', pose='claude_point', sub='第二题，Test B 第 4 题：ℝ³ 上的算子 L(x) = (x₂, x₁, x₁ + x₂)ᵀ。求值域。', read='第二题，测验B第四题：R三上的算子，L x 等于x二、x一、x一加x二。求它的值域。'),
    dict(id='D03', mood='think', pose='ds_think', sub='值域就是列空间……先写标准矩阵？', read='值域就是列空间，那先写标准矩阵？'),
    dict(id='C07', pose='claude_smile', sub='好思路。L(e₁) = (0, 1, 1)ᵀ，L(e₂) = (1, 0, 1)ᵀ，L(e₃) = 0。值域 = 前两列张成的平面。', read='好思路。e一的像是零、一、一；e二的像是一、零、一；e三的像是零向量。所以值域，就是前两列张成的平面。'),
    dict(id='C08', pose='claude_explain', sub='套路卡③：值域写成方程。设 y = a(0, 1, 1)ᵀ + b(1, 0, 1)ᵀ = (b, a, a + b)ᵀ，于是 y₃ = y₁ + y₂。', read='套路卡三：把值域写成方程。设y等于a倍的零、一、一，加b倍的一、零、一，也就是b、a、a加b。于是，y三等于y一加y二。'),
    dict(id='C09', pose='claude_point', sub='看 3D 画面：整个 ℝ³ 被压到这张平面上；e₃ 方向被压成零，核一维、值域二维，1 + 2 = 3。', read='看三维画面：整个R三，被压到这张平面上；e三方向被压成了零。核一维，值域二维，一加二等于三。'),
    # Test B 9
    dict(id='C10', pose='claude_point', sub='第三题，Test B 第 9 题：u₁ = (3, 1)ᵀ，u₂ = (5, 2)ᵀ；v₁ = (1, −2)ᵀ，v₂ = (1, −1)ᵀ。L 在 {u₁, u₂} 下的矩阵 A = [[2, 1], [3, 2]]。', read='第三题，测验B第九题：u一是三、一，u二是五、二；v一是一、负二，v二是一、负一。L在u这组基下的矩阵A，第一列是二、三，第二列是一、二。'),
    dict(id='C11', pose='claude_explain', sub='(a) 求从 {v₁, v₂} 到 {u₁, u₂} 的过渡矩阵；(b) 求 L 在 {v₁, v₂} 下的矩阵。', read='a问，求从v到u的过渡矩阵；b问，求L在v这组基下的矩阵。'),
    dict(id='D04', mood='think', pose='ds_think', sub='过渡矩阵……第三章的方向陷阱又来了。', read='过渡矩阵，第三章的方向陷阱又来了。'),
    dict(id='C12', pose='claude_smile', sub='按定义来。从 v 到 u：把 v 坐标变成 u 坐标。v 坐标先乘 V 变成标准坐标，再乘 U⁻¹ 变成 u 坐标。', read='按定义来。从v到u，就是把v坐标变成u坐标：v坐标先乘V，变成标准坐标；再乘U逆，变成u坐标。'),
    dict(id='C13', pose='claude_explain', sub='所以 S = U⁻¹V。U 的行列式是 1，U⁻¹ = [[2, −5], [−1, 3]]，乘出来 S = [[12, 7], [−7, −4]]。', read='所以S等于U逆乘V。U的行列式是一，求出U逆，再乘V，得到S：第一列是十二、负七，第二列是七、负四。'),
    dict(id='C14', pose='claude_point', sub='验一列：12u₁ − 7u₂ = (36 − 35, 12 − 14)ᵀ = (1, −2)ᵀ = v₁。方向没错。', read='验一列：十二倍u一，减七倍u二，等于三十六减三十五、十二减十四，也就是一、负二，正好是v一。方向没错。'),
    dict(id='C15', pose='claude_explain', sub='(b)：A 是 u 下的矩阵，S 把 v 坐标翻译成 u 坐标。翻译、变换、翻译回去：B = S⁻¹AS。', read='b问：A是u下的矩阵，S把v坐标翻译成u坐标。翻译，变换，再翻译回去：B等于S逆A S。'),
    dict(id='C16', pose='claude_point', sub='S 的行列式也是 1，S⁻¹ = [[−4, −7], [7, 12]]。乘出来 B = [[−222, −131], [383, 226]]。', read='S的行列式也是一，求出S逆。三个矩阵乘出来，B的第一列是负二百二十二、三百八十三，第二列是负一百三十一、二百二十六。'),
    dict(id='D05', mood='panic', pose='ds_shock', sub='这么大的数，肯定算错了吧？！', read='这么大的结果，肯定算错了吧？'),
    dict(id='C17', pose='claude_smile', sub='用不变量秒验。迹：A 是 2 + 2 = 4，B 是 −222 + 226 = 4。', read='用不变量秒验。先看迹：A是二加二，等于四；B是负二百二十二加二百二十六，也等于四。'),
    dict(id='C18', pose='claude_explain', sub='行列式：A 是 4 − 3 = 1；B 是 −222·226 + 131·383 = −50172 + 50173 = 1。都对上了。', read='再看行列式：A是四减三，等于一；B是负五万零一百七十二，加五万零一百七十三，也等于一。都对上了。'),
    dict(id='C19', pose='claude_point', sub='迹和行列式对上，不能保证全对，但对不上，就一定错了。考场上，这是最划算的检查。', read='迹和行列式对上了，不能保证全对；但要是对不上，就一定错了。考场上，这是最划算的检查。'),
    # 同济
    dict(id='G03', pose='gpt_point', sub='第四题，同济期末常见题型：A = [[2, 0, 0], [0, 0, 1], [0, 1, x]] 与 diag(2, y, −1) 相似，求 x、y。', read='第四题，同济期末常见题型：A是这个三阶矩阵，右下角含有参数x；它与对角线为二、y、负一的对角矩阵相似。求x和y。'),
    dict(id='D06', mood='think', pose='ds_think', sub='还没学特征值，能做吗？', read='还没学特征值，能做吗？'),
    dict(id='G04', pose='gpt_explain', sub='能。相似就有两个等式：迹相等，2 + x = 1 + y；行列式相等，−2 = −2y。', read='能。相似，就有两个等式：迹相等，二加x，等于一加y；行列式相等，负二等于负二y。'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='第二个式子 y = 1，代回去 x = 0！', read='第二个式子，得y等于一，代回去，x等于零！'),
    dict(id='G05', pose='gpt_cross', sub='对。注意：题目已经告诉你“相似”，用必要条件解参数没问题；但反过来，迹和行列式相等，不能证明相似。', read='对。注意：题目已经告诉你它们相似，用必要条件解参数没有问题；但反过来，迹和行列式相等，不能证明相似。'),
    dict(id='C20', pose='claude_explain', sub='代回去验一下：x = 0 时，右下角是 [[0, 1], [1, 0]]，交换两个坐标，把 (1, 1)ᵀ 送回自己，把 (1, −1)ᵀ 翻成相反方向。', read='代回去验一下：x等于零时，右下角那块，交换两个坐标：它把一、一送回自己，把一、负一翻成相反方向。'),
    dict(id='C21', pose='claude_point', sub='所以在合适的基下，它就是 diag(2, 1, −1)。这组基怎么找，第六章细讲。', read='所以，在合适的基下，它就是对角线为二、一、负一的矩阵。这组基怎么找，第六章细讲。'),
    # 总结
    dict(id='C22', pose='claude_smile', sub='第四章总结。一：线性变换保持线性组合；几何上，网格平行等距、原点不动。', read='好，来做第四章总结。第一：线性变换，保持线性组合；几何上，网格保持平行等距，原点不动。'),
    dict(id='C23', pose='claude_explain', sub='二：矩阵的每一列，是一个基向量的落脚点。复合就是乘积，先做的写右边。', read='第二：矩阵的每一列，是一个基向量的落脚点。复合就是乘积，先做的写在右边。'),
    dict(id='C24', pose='claude_point', sub='三：核与值域，就是第三章的零空间和列空间；维数加起来，等于输入空间的维数。', read='第三：核与值域，就是第三章的零空间和列空间；它们的维数加起来，等于输入空间的维数。'),
    dict(id='C25', pose='claude_explain', sub='四：任意基下，A 的第 j 列 = L(vⱼ) 的 F 坐标。五：同一个变换换基，B = S⁻¹AS，迹和行列式不变。', read='第四：任意基下，A的第j列，是v j的像在F下的坐标。第五：同一个变换换一组基，B等于S逆A S，迹和行列式都不变。'),
    dict(id='D08', mood='easy', pose='ds_proud', sub='矩阵就是线性变换的坐标写法！', read='一句话：矩阵，就是线性变换在一组基下的坐标写法！'),
    dict(id='C26', pose='claude_smile', sub='这句话，就是整个第四章。', read='这句话，就是整个第四章。'),
    dict(id='G06', pose='gpt_explain', sub='预告第五章：正交性。向量之间的夹角、投影、最小二乘，还有让计算变简单的正交基。', read='预告第五章：正交性。向量之间的夹角、投影、最小二乘，还有让计算变简单的正交基。'),
    dict(id='D09', mood='easy', pose='ds_happy', sub='第四章通关！第五章见！', read='第四章通关！第五章见！'),
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
