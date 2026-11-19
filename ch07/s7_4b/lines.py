# -*- coding: utf-8 -*-
"""第 7 章 7.4（下）条件数（Leon 9th §7.4：例 2 (2 2; 2 2.0005) → (2 2; 2 2.001)，解 (1, 2) → (2, 1)；病态定义；残差 r = b − Ax′；
(1/cond)‖r‖/‖b‖ ≤ ‖e‖/‖x‖ ≤ cond‖r‖/‖b‖；例 3 A = (3 3; 4 5)，cond∞ = 24；例 4 x′ = (2.0, 0.1)，相对残差 1/18、相对误差 1；cond₂ = σ₁/σₙ；希尔伯特矩阵；例 5 100 × 2⁹⁹）台词源（唯一真源）。
3B1B 画面：两条几乎平行的直线，系数微动 → 交点沿直线滑出去；残差条很短、误差条很长；椭圆越扁越病态；log₁₀ cond 位数刻度尺。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='第 1 节说过：有的问题本身就病态。这一节用范数把“病态”量出来。', read='第一节说过：有的问题本身就病态。这一节，用范数把病态量出来。'),
    dict(id='C02', pose='claude_point', sub='例 2：2x₁ + 2x₂ = 6，2x₁ + 2.0005x₂ = 6.001。精确解 (1, 2)。', read='例二：二x一加二x二等于六；二x一加二点零零零五x二，等于六点零零一。精确解是一、二。'),
    dict(id='C03', pose='claude_explain', sub='改用四位数字存：2.0005 只能存成 2.001，系数只变了 0.025%。可新方程组的解是 (2, 1)！', read='改用四位数字存：二点零零零五，只能存成二点零零一，系数只变了万分之二点五。可是新方程组的解，变成了二、一！'),
    dict(id='D01', mood='think', pose='ds_confused', sub='系数几乎没动，解却面目全非？', read='系数几乎没动，解却面目全非？'),
    dict(id='C04', pose='claude_explain', sub='画出来就明白：两条直线几乎平行。稍微转一点点，交点就沿着直线滑出去很远。', read='画出来就明白了：两条直线几乎平行。只要稍微转一点点，交点就沿着直线，滑出去很远。'),
    dict(id='C05', pose='claude_point', sub='定义：A 的元素有相对很小的变化，就能让解有相对很大的变化，A 叫病态的；反之叫良态的。', read='定义：如果A的元素有相对很小的变化，就能让解发生相对很大的变化，A就叫作病态的；反之，叫作良态的。'),
    dict(id='C06', pose='claude_explain', sub='怎么检验算出来的 x′ 准不准？真解 x 不知道，但可以算残差 r = b − Ax′。', read='怎么检验算出来的x撇准不准？我们不知道真解x，但可以算残差：r等于b减A乘x撇。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='残差小，解就准！', read='那残差小，解就准！'),
    dict(id='C07', pose='claude_smile', sub='不一定。例 4：3x₁ + 3x₂ = 6，4x₁ + 5x₂ = 9，算得 x′ = (2.0, 0.1)。', read='不一定。例四：三x一加三x二等于六，四x一加五x二等于九，算出来x撇是二点零、零点一。'),
    dict(id='C08', pose='claude_point', sub='残差 r = (−0.3, 0.5)，相对残差只有 1/18。可真解是 (1, 1)，误差 (−1, 0.9)，相对误差是 1——百分之百。', read='残差是负零点三、零点五，相对残差只有十八分之一。可是真解是一、一，误差是负一、零点九，相对误差是一，也就是百分之百。'),
    dict(id='C09', pose='claude_explain', sub='两者的关系：误差 = A⁻¹r，b = Ax，推出 (1/cond(A))·‖r‖/‖b‖ ≤ ‖x − x′‖/‖x‖ ≤ cond(A)·‖r‖/‖b‖，cond(A) = ‖A‖‖A⁻¹‖。', read='两者的关系：由误差等于A逆乘残差，以及b等于A乘x，可以推出屏幕上这个夹逼不等式。中间那个数，A的范数乘A逆的范数，叫作A的条件数。'),
    dict(id='C10', pose='claude_point', sub='条件数就是放大倍数的上限：相对误差最多是相对残差的 cond(A) 倍。cond(A) ≥ 1；接近 1 是良态，很大就是病态。', read='条件数，就是放大倍数的上限：相对误差，最多是相对残差的条件数倍。条件数总是大于等于一；接近一是良态，很大就是病态。'),
    dict(id='C11', pose='claude_explain', sub='例 3：A = (3 3; 4 5)，A⁻¹ = ⅓(5 −3; −4 3)。‖A‖∞ = 9，‖A⁻¹‖∞ = 8/3，cond∞(A) = 24。', read='例三：还是这个A。A逆等于三分之一，乘五、负三；负四、三。A的无穷范数是九，A逆的无穷范数是三分之八，条件数是二十四。'),
    dict(id='C12', pose='claude_point', sub='回到例 4：相对误差 1 ≤ 24 × 1/18 = 4/3。不等式成立，而且这回几乎顶到了上限。', read='回到例四：相对误差一，确实不超过二十四乘十八分之一，也就是三分之四。不等式成立，而且这一回，几乎顶到了上限。'),
    dict(id='C13', pose='claude_explain', sub='用 2-范数：cond₂(A) = σ₁/σₙ，最长半轴比最短半轴。椭圆越扁越病态；σₙ = 0 就是奇异。', read='用二范数的话，条件数等于西格玛一除以西格玛n，也就是椭圆最长半轴比最短半轴。椭圆越扁，越病态；最短半轴等于零，就是奇异了。'),
    dict(id='C14', pose='claude_point', sub='著名的病态矩阵：希尔伯特矩阵 hᵢⱼ = 1/(i + j − 1)。cond₂(H₄) ≈ 1.6 × 10⁴，H₈ ≈ 1.5 × 10¹⁰，H₁₂ ≈ 1.6 × 10¹⁶。', read='著名的病态矩阵：希尔伯特矩阵，第i行第j列是i加j减一分之一。四阶的条件数大约一点六乘十的四次方，八阶大约一点五乘十的十次方，十二阶大约一点六乘十的十六次方。'),
    dict(id='C15', pose='claude_explain', sub='用双精度解 H₁₂x = b，真解全是 1：算出的相对误差 0.28，相对残差只有 1.4 × 10⁻¹⁶。残差完美，解却错了近三成。', read='用双精度解十二阶的希尔伯特方程组，真解全是一：算出来的相对误差是零点二八，可是相对残差，只有一点四乘十的负十六次方。残差完美，解却错了将近三成。'),
    dict(id='D03', mood='think', pose='ds_think', sub='那能不能大概估计丢了几位？', read='那能不能大概估计，丢了几位数字？'),
    dict(id='C16', pose='claude_smile', sub='经验法则：大约丢掉 log₁₀ cond(A) 位。双精度约 16 位，cond = 10⁶，大约还剩 10 位。', read='一个经验法则：大约丢掉条件数的常用对数那么多位。双精度大约有十六位，条件数是十的六次方，大约还剩十位。'),
    dict(id='C17', pose='claude_point', sub='例 5：第六章那个 100 阶上三角矩阵，cond∞ = 100 × 2⁹⁹ ≈ 6.34 × 10³¹，远远超出双精度能承受的范围。', read='例五：第六章那个一百阶的上三角矩阵，无穷范数条件数，是一百乘二的九十九次方，大约六点三四乘十的三十一次方，远远超出双精度能承受的范围。'),
    dict(id='G01', pose='gpt_explain', sub='同济讲过：系数行列式不为零，方程组有唯一解。但行列式不能衡量病态：每个方程都乘 10，二阶行列式变成 100 倍，条件数一点不变。', read='同济讲过：系数行列式不为零，方程组就有唯一解。但是，行列式不能衡量病态：把每个方程都乘十，二阶行列式变成一百倍，条件数却一点不变。'),
    dict(id='C18', pose='claude_smile', sub='小结：残差小 ≠ 误差小；cond(A) = ‖A‖‖A⁻¹‖ 是放大倍数上限；cond₂ = σ₁/σₙ；大约丢 log₁₀ cond 位。', read='小结：残差小，不等于误差小；条件数，是误差放大倍数的上限；二范数条件数等于西格玛一比西格玛n；大约丢掉它的常用对数那么多位。'),
    dict(id='C19', pose='claude_point', sub='病态躲不开，那至少别让算法再添乱。下一节：绝不放大误差的变换——正交变换。', read='病态躲不开，那至少，别让算法再添乱。下一节：绝不放大误差的变换，正交变换。'),
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
