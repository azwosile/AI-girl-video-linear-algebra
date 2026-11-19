# -*- coding: utf-8 -*-
"""第 7 章 复习（上）判断题（Leon 9th Chapter 7 Test A 第 1–10 题，共 10 道）台词源（唯一真源）。
答案：1F 2F 3F 4T 5F 6F 7T 8F 9F 10F。大肥鱼 5 / 10（对 1、4、7、8、9；错 2、3、5、6、10）。
形式：题卡 → 大肥鱼抢答气泡 → 判定印章 → 理由 / 最小反例（三位浮点、行向量 × 列向量、希尔伯特、(1 1; ε 1)、单位阵、秩突变）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='浮点、消元、主元、范数、条件数、正交变换、QR，我全会了！来考我吧！', read='浮点、消元、主元、范数、条件数、正交变换、Q R，我全会了！来考我吧！'),
    dict(id='C01', pose='claude_smile', sub='好。第七章判断题十道。永远成立的判“对”并说理由；不一定成立的，举一个反例。', read='好。第七章的判断题，一共十道。永远成立的判对，并说出理由；不一定成立的，就举一个反例。'),
    # 1
    dict(id='C02', pose='claude_point', sub='第一题：a、b、c 是浮点数，则 fl(fl(a + b) + c) = fl(a + fl(b + c))。', read='第一题：a、b、c是浮点数。先算a加b、再加c，和先算b加c、再和a相加，电脑算出的结果一样。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='错！第 1 节刚演示过，顺序不同，答案就不同。', read='错！第一节刚演示过，加的顺序不同，答案就不同。'),
    dict(id='C03', pose='claude_smile', sub='错，答对了。三位十进制，a = 1.00，b = c = 0.004：左边 1.00，右边 1.01。', read='错，答对了。三位十进制，a是一，b和c都是零点零零四：左边算出一，右边算出一点零一。'),
    # 2
    dict(id='C04', pose='claude_point', sub='第二题：计算 A(BC) 和 (AB)C 需要的浮点运算次数相同。', read='第二题：计算A乘B C，和计算A B乘C，需要的浮点运算次数相同。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='对！结合律嘛，反正结果一样。', read='对！结合律嘛，反正结果都一样。'),
    dict(id='C05', pose='claude_explain', sub='错。结果一样，运算量可以差很多。设 A 是 1×n 行向量，B 是 n×1 列向量，C 是 1×n。', read='错。结果一样，运算量却可以差很多。设A是一行n列，B是n行一列，C又是一行n列。'),
    dict(id='C06', pose='claude_point', sub='(AB)C：AB 是一个数，n 次乘法，再乘 C 又 n 次，共 2n。A(BC)：BC 是 n×n，要 n² 次，再乘 A 又 n²，共 2n²。', read='先算A乘B，得到一个数，n次乘法；再乘C，又是n次，一共二n次。先算B乘C，得到n乘n的矩阵，要n的平方次；再用A去乘，又是n的平方次，一共二倍n的平方次。'),
    # 3
    dict(id='C07', pose='claude_point', sub='第三题：A 非奇异，用数值稳定的算法解 Ax = b，计算解的相对误差一定很小。', read='第三题：A非奇异，用数值稳定的算法解方程组，算出来的解，相对误差一定很小。'),
    dict(id='D04', mood='easy', pose='ds_proud', sub='对！稳定就是误差不放大嘛。', read='对！稳定就是误差不放大嘛。'),
    dict(id='C08', pose='claude_explain', sub='错。稳定只保证算法不添乱；问题本身病态，照样不准。12 阶希尔伯特矩阵，部分主元消元，相对误差 0.28。', read='错。稳定，只保证算法本身不添乱；问题本身病态，结果照样不准。十二阶希尔伯特矩阵，用部分主元消元，相对误差是零点二八。'),
    dict(id='C09', pose='claude_smile', sub='记住：误差 ≈ 条件数 × 稳定算法带来的小误差。算法管后一项，前一项谁也管不了。', read='记住：误差，大约是条件数，乘上稳定算法带来的那一点小误差。稳定的算法管后一项，前一项，谁也管不了。'),
    # 4
    dict(id='C10', pose='claude_point', sub='第四题：A 对称，用数值稳定的算法求特征值，相对误差应该总是很小。', read='第四题：A对称，用数值稳定的算法求特征值，误差应该总是很小。'),
    dict(id='D05', mood='think', pose='ds_think', sub='对称……定理 7.6.1 说变化不超过 ‖E‖₂。那就是对！', read='对称的话，定理七点六点一说，变化不超过扰动的二范数。那就是对！'),
    dict(id='C11', pose='claude_smile', sub='对。对称矩阵用正交矩阵对角化，cond₂(X) = 1，特征值误差不超过 ‖E‖₂；稳定算法保证 ‖E‖ 和舍入误差同一量级。', read='对。对称矩阵可以用正交矩阵对角化，条件数是一，特征值的误差不超过扰动的二范数；而稳定的算法，保证这个扰动和舍入误差同一个量级。'),
    # 5
    dict(id='C12', pose='claude_point', sub='第五题：A 非对称，用数值稳定的算法求特征值，相对误差也应该总是很小。', read='第五题：A非对称，用数值稳定的算法求特征值，误差也应该总是很小。'),
    dict(id='D06', mood='easy', pose='ds_happy', sub='对！稳定算法都一样稳。', read='对！稳定的算法，都一样稳。'),
    dict(id='C13', pose='claude_explain', sub='错。非对称时放大倍数是 cond₂(X)，可以非常大。A = (1 1; ε 1)：10⁻¹⁰ 的扰动，让特征值从 1 变成 1 ± 10⁻⁵。', read='错。非对称的时候，放大倍数是X的条件数，可以非常大。还是那个矩阵：十的负十次方的扰动，让特征值从一，变成了一加减十的负五次方。'),
    # 6
    dict(id='C14', pose='claude_point', sub='第六题：A⁻¹ 和 LU 都已算好，那么用 A⁻¹b 解方程组，比用 LU 前代回代更有效率。', read='第六题：A逆和L U分解都已经算好了，那么用A逆乘b解方程组，比用L U前代回代更有效率。'),
    dict(id='D07', mood='easy', pose='ds_proud', sub='对！直接一乘就完事了，前代回代要两遍呢。', read='对！直接一乘就完事了，前代回代，要算两遍呢。'),
    dict(id='C15', pose='claude_explain', sub='错。A⁻¹b 要 n² 次乘法；前代加回代合起来也约 n² 次。一样多，谈不上更有效率。', read='错。A逆乘b要n的平方次乘法；前代加回代，合起来也是大约n的平方次。一样多，谈不上更有效率。'),
    dict(id='C16', pose='claude_point', sub='而且 LU 解通常更准；当初算 A⁻¹ 本身约 n³ 次，是 LU 的三倍。实际软件从不靠求逆解方程组。', read='而且L U解通常更准；更别说当初算A逆，本身要大约n的立方次，是L U的三倍。实际软件，从来不靠求逆来解方程组。'),
    # 7
    dict(id='C17', pose='claude_point', sub='第七题：A 对称，则 ‖A‖₁ = ‖A‖∞。', read='第七题：A对称，那么A的一范数等于无穷范数。'),
    dict(id='D08', mood='easy', pose='ds_happy', sub='对！1-范数看列，∞-范数看行，对称矩阵行和列一样。', read='对！一范数看列，无穷范数看行，对称矩阵的行和列一模一样。'),
    dict(id='C18', pose='claude_smile', sub='对。‖A‖₁ = ‖Aᵀ‖∞，A 对称时 Aᵀ = A。', read='对。A的一范数，等于A转置的无穷范数；A对称的时候，A转置就是A。'),
    # 8
    dict(id='C19', pose='claude_point', sub='第八题：A 是 m×n 矩阵，则 ‖A‖₂ = ‖A‖F。', read='第八题：A是m行n列的矩阵，那么它的二范数，等于弗罗贝尼乌斯范数。'),
    dict(id='D09', mood='easy', pose='ds_proud', sub='错！单位阵：2-范数是 1，Frobenius 是 √n。', read='错！单位阵：二范数是一，弗罗贝尼乌斯范数是根号n。'),
    dict(id='C20', pose='claude_smile', sub='错，答对了。‖A‖₂ = σ₁，‖A‖F = √(σ₁² + ⋯ + σᵣ²)，只有秩为 1 时两者才相等。', read='错，答对了。一般来说，二范数是西格玛一，弗罗贝尼乌斯范数是所有奇异值平方和的平方根，只有秩为一的时候，两者才相等。'),
    # 9
    dict(id='C21', pose='claude_point', sub='第九题：最小二乘问题，A 是 m×n、秩 n。正规方程、Gram–Schmidt QR、Householder QR、SVD 都能算出高精度的解。', read='第九题：最小二乘问题，A是m行n列、秩为n。正规方程、施密特Q R、豪斯霍尔德Q R、奇异值分解，都能算出高精度的解。'),
    dict(id='D10', mood='think', pose='ds_think', sub='正规方程会把条件数平方……所以错！', read='正规方程会让条件数，变成原来的平方，所以错！'),
    dict(id='C22', pose='claude_smile', sub='错，答对了。A 稍微病态，正规方程就多丢一倍的位数；经典 Gram–Schmidt 也可能失去正交性。', read='错，答对了。A只要稍微病态，正规方程就要多丢一倍的位数；经典的施密特，也可能失去正交性。'),
    # 10
    dict(id='C23', pose='claude_point', sub='第十题：A、B 很接近，‖A − B‖₂ < ε，那么它们的伪逆也很接近。', read='第十题：A和B很接近，差的二范数很小，那么它们的伪逆也很接近。'),
    dict(id='D11', mood='easy', pose='ds_happy', sub='对！矩阵接近，伪逆当然也接近。', read='对！矩阵接近，伪逆当然也接近。'),
    dict(id='C24', pose='claude_explain', sub='错。A = (1 0; 0 0)，B = (1 0; 0 ε)，只差 ε。可 A⁺ = A，B⁺ = (1 0; 0 1/ε)，差 1/ε，ε 越小越远。', read='错。A是一、零、零、零的对角阵，B把右下角换成一个很小的数，两者只差这个小数。可是A的伪逆还是A，B的伪逆，右下角却是它的倒数，小数越小，差得越远。'),
    dict(id='C25', pose='claude_point', sub='原因：秩突然变了。伪逆在秩变化处不连续，这也是计算数值秩要设阈值的原因。', read='原因是：秩突然变了。伪逆在秩发生变化的地方不连续，这也是计算数值秩，要设一个阈值的原因。'),
    dict(id='D12', mood='sigh', pose='ds_confused', sub='对五道、错五道……数值线代全是陷阱。', read='对了五道，错了五道。数值线代，全是陷阱。'),
    dict(id='C26', pose='claude_smile', sub='陷阱就是知识点。错的五道正好是本章最重要的五句话：运算顺序、病态、非对称敏感、不求逆、伪逆不连续。', read='陷阱，就是知识点。错的五道，正好是本章最重要的五句话：运算顺序、病态、非对称敏感、不求逆、伪逆不连续。'),
    dict(id='C27', pose='claude_point', sub='下一段：计算题。', read='下一段：计算题。'),
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
