# -*- coding: utf-8 -*-
"""第 5 章 5.5 标准正交基与正交矩阵（Leon 9th §5.5：例 1、例 2；定理 5.5.1、5.5.2 坐标 = 内积；推论 5.5.3、帕塞瓦尔；
例 5 ∫sin⁴x = 3π/4；正交矩阵定理 5.5.5、例 6 旋转；保内积；置换矩阵；定理 5.5.6–5.5.8、推论 5.5.9 p = UUᵀb；例 7 (5, 3, 0)ᵀ；
Chapter Test B 8：〈x, y〉 = 0、‖x‖ = 3）台词源（唯一真源）。
3B1B 画面：坐标 = 往轴上投影；正交矩阵网格刚性转动；UUᵀ 把 3D 点压到平面。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='坐标轴互相垂直、长度为 1，这是我们最熟悉的标准基。这一节，看看这样的基到底好在哪。', read='坐标轴互相垂直，长度为一，这是我们最熟悉的标准基。这一节，看看这样的基，到底好在哪里。'),
    dict(id='C02', pose='claude_explain', sub='定义：一组非零向量两两正交，叫正交组；再加上每个长度都是 1，叫标准正交组。', read='定义：一组非零向量，两两正交，叫正交组；再加上每个长度都是一，叫标准正交组。'),
    dict(id='C03', pose='claude_point', sub='例 1：(1, 1, 1)ᵀ、(2, 1, −3)ᵀ、(4, −5, 1)ᵀ，两两点积都是零，是正交组。', read='例一：一、一、一，二、一、负三，四、负五、一。两两点积都是零，是正交组。'),
    dict(id='C04', pose='claude_explain', sub='定理 5.5.1：正交组一定线性无关。把 Σcᵢvᵢ = 0 和 vⱼ 做内积，别的项全变成零，剩下 cⱼ‖vⱼ‖² = 0。', read='定理五点五点一：正交组一定线性无关。把线性组合等于零，和v j做内积，别的项全变成零，剩下c j乘v j的长度平方，等于零。'),
    dict(id='C05', pose='claude_point', sub='例 2：各自除以长度 √3、√14、√42，就得到标准正交组。', read='例二：各自除以长度，根号三、根号十四、根号四十二，就得到标准正交组。'),
    dict(id='C06', pose='claude_explain', sub='定理 5.5.2：在标准正交基下，坐标不用解方程！v 的第 i 个坐标，就是 〈v, uᵢ〉。', read='定理五点五点二：在标准正交基下，求坐标不用解方程！v的第i个坐标，就是v和u i的内积。'),
    dict(id='D01', mood='think', pose='ds_think', sub='不用解方程组？以前求坐标可是要消元的！', read='不用解方程组？以前求坐标，可是要消元的！'),
    dict(id='C07', pose='claude_smile', sub='这就是正交的威力。画面里：v 往每根轴上投影，影子的长度就是坐标。', read='这就是正交的威力。看画面：v往每根轴上投影，影子的长度，就是坐标。'),
    dict(id='C08', pose='claude_point', sub='推论：〈u, v〉 = Σ aᵢbᵢ；以及帕塞瓦尔公式 ‖v‖² = Σ cᵢ²，又是勾股定理。', read='推论：两个向量的内积，等于坐标对应相乘再相加；还有帕塞瓦尔公式：长度平方，等于坐标的平方和，又是勾股定理。'),
    dict(id='C09', pose='claude_explain', sub='例 5，一个漂亮的应用：sin²x = 1/2 − (1/2)cos 2x = (1/√2)·(1/√2) + (−1/2)·cos 2x。', read='例五，一个漂亮的应用：sine方x，等于二分之一，减二分之一cos二x。也可以写成：根号二分之一，乘根号二分之一，加上负二分之一乘cos二x。'),
    dict(id='C10', pose='claude_point', sub='1/√2 和 cos 2x 是标准正交组。帕塞瓦尔：‖sin²x‖² = 1/2 + 1/4 = 3/4，所以 ∫ sin⁴x dx = 3π/4，一个原函数都不用求。', read='根号二分之一和cos二x，是标准正交组。用帕塞瓦尔公式：长度平方等于二分之一加四分之一，是四分之三。所以sine四次方的积分，等于四分之三派，一个原函数都不用求。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='积分变成了勾股定理！', read='积分，变成了勾股定理！'),
    dict(id='C11', pose='claude_explain', sub='正交矩阵：方阵 Q 的列构成标准正交组。定理 5.5.5：Q 是正交矩阵，等价于 QᵀQ = I。', read='正交矩阵：方阵Q的各列，构成标准正交组。定理五点五点五：Q是正交矩阵，等价于Q转置Q等于单位矩阵。'),
    dict(id='C12', pose='claude_point', sub='所以 Q⁻¹ = Qᵀ，求逆只要转置。例 6：旋转矩阵 [[cos θ, −sin θ], [sin θ, cos θ]] 就是正交矩阵。', read='所以，Q的逆就是Q的转置，求逆仅需转置。例六：旋转矩阵，就是正交矩阵。'),
    dict(id='C13', pose='claude_explain', sub='看网格：正交矩阵把网格整体转动或翻转，格子不拉伸、不歪斜。〈Qx, Qy〉 = 〈x, y〉，长度和角度全部保持。', read='看网格：正交矩阵把网格整体转动，或者翻转，格子不拉伸，也不歪斜。Q x和Q y的内积，等于x和y的内积，长度和角度，全部保持。'),
    dict(id='C14', pose='claude_point', sub='置换矩阵也是正交矩阵：把单位矩阵的列重新排一排。右乘换列，左乘换行。', read='置换矩阵，也是正交矩阵：把单位矩阵的列，重新排一排。右乘换列，左乘换行。'),
    dict(id='C15', pose='claude_explain', sub='回到最小二乘：A 的列标准正交时，AᵀA = I，正规方程直接变成 x̂ = Aᵀb。', read='再回到最小二乘：如果A的各列标准正交，A转置A就是单位矩阵，正规方程，直接变成x帽等于A转置b。'),
    dict(id='C16', pose='claude_point', sub='定理 5.5.7、5.5.8：u₁ … uₖ 是子空间 S 的标准正交基，b 在 S 上的投影 p = Σ 〈b, uᵢ〉uᵢ，它就是 S 里离 b 最近的点。', read='定理五点五点七和五点五点八：如果u一到u k，是子空间S的标准正交基，b在S上的投影p，就是各个内积乘u i再相加，它就是S里离b最近的点。'),
    dict(id='C17', pose='claude_explain', sub='写成矩阵：U = (u₁ … uₖ)，p = UUᵀb，投影矩阵就是 UUᵀ。例 7：(5, 3, 4)ᵀ 投影到 xy 平面，得 (5, 3, 0)ᵀ。', read='把它们写成矩阵。大写U，由u一到u k排成，p等于U U转置b，投影矩阵就是U U转置。例七：五、三、四，投影到x y平面，得到五、三、零。'),
    dict(id='C18', pose='claude_point', sub='测验 B 第 8 题：x = 2u₁ − 2u₂ + u₃，y = 3u₁ + u₂ − 4u₃。〈x, y〉 = 6 − 2 − 4 = 0；‖x‖ = √(4 + 4 + 1) = 3。', read='测验B第八题：x等于二u一减二u二加u三，y等于三u一加u二减四u三。内积等于六减二减四，是零；x的长度，等于根号下四加四加一，是三。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='系数直接相乘，直接平方相加！', read='系数直接相乘，直接平方相加！'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济第五章第一节把正交矩阵定义为 AᵀA = E，并证明：A 的列，或者行，都是两两正交的单位向量。', read='同济对照：同济第五章第一节，把正交矩阵定义为A转置A等于E，并证明：A的各列，或者各行，都是两两正交的单位向量。'),
    dict(id='G02', pose='gpt_point', sub='同济把 y = Px（P 正交）叫正交变换，它保持长度。两条常考结论：正交矩阵的行列式是 ±1；两个正交矩阵的乘积还是正交矩阵。', read='同济还把y等于P x，P正交，叫做正交变换，它保持长度不变。两条常考结论：正交矩阵的行列式，是正负一；两个正交矩阵的乘积，还是正交矩阵。'),
    dict(id='C19', pose='claude_explain', sub='小结：标准正交基下，坐标就是内积，长度是系数的平方和；正交矩阵 Qᵀ = Q⁻¹，保长度、保角度；投影矩阵是 UUᵀ。', read='小结：标准正交基下，坐标就是内积，长度平方是系数的平方和；正交矩阵的转置就是逆，保长度，保角度；投影矩阵是U U转置。'),
    dict(id='C20', pose='claude_point', sub='下一节：任给一组基，怎么把它“掰”成标准正交基？Gram–Schmidt（施密特）正交化。', read='下一节：任给一组基，怎么把它掰成标准正交基？格拉姆施密特正交化。'),
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
