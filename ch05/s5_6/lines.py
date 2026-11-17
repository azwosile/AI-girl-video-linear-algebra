# -*- coding: utf-8 -*-
"""第 5 章 5.6 施密特正交化与 QR（Leon 9th §5.6：定理 5.6.1；例 2 a₁ = (1, 1, 1, 1)ᵀ、a₂ = (−1, 4, 4, −1)ᵀ、a₃ = (4, −2, 2, 0)ᵀ →
q 全是 ±1/2、R = [[2, 3, 2], [0, 5, −2], [0, 0, 4]]；定理 5.6.2 及证明思路；定理 5.6.3；例 4 x̂ = (−2/5, 0, 1)ᵀ；修正施密特；例 1 → §5.7；
同济 §1 例：a₁ = (1, 2, −1)ᵀ、a₂ = (−1, 3, 1)ᵀ、a₃ = (4, −1, 0)ᵀ → b₂ = (5/3)(−1, 1, 1)ᵀ、b₃ = 2(1, 0, 1)ᵀ）台词源（唯一真源）。
3B1B 画面：3D 里 x₂ 减去影子立起来、x₃ 减去平面投影竖直；r 系数逐个落进上三角 R。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='上一节说，标准正交基好处多多。可手里的基往往是歪的。这一节，把它一根一根掰正。', read='上一节说，标准正交基好处多多。可是手里的基，往往是歪的。这一节，把它一根一根掰正。'),
    dict(id='C02', pose='claude_explain', sub='思路就一句话：每来一个新向量，减掉它在前面所有方向上的投影，剩下的就和前面全都垂直，再单位化。', read='思路就一句话：每来一个新向量，减掉它在前面所有方向上的投影，剩下的部分，就和前面全都垂直，再把它单位化。'),
    dict(id='C03', pose='claude_point', sub='第一步：u₁ = x₁/‖x₁‖。第二步：p₁ = 〈x₂, u₁〉u₁ 是 x₂ 在 u₁ 上的影子；x₂ − p₁ 垂直于 u₁，除以长度得 u₂。', read='第一步：u一等于x一除以它的长度。第二步：p一，是x二在u一上的影子；x二减p一，垂直于u一，再除以长度，得到u二。'),
    dict(id='C04', pose='claude_explain', sub='第三步：p₂ 是 x₃ 在 u₁、u₂ 张成的平面上的投影；x₃ − p₂ 垂直于这张平面，单位化得 u₃。', read='第三步：p二，是x三在u一、u二张成的平面上的投影；x三减p二，垂直于这张平面，单位化，得到u三。'),
    dict(id='D01', mood='think', pose='ds_think', sub='每次都减影子……减完为什么一定不是零向量？', read='每次都减掉影子，减完为什么一定不是零向量？'),
    dict(id='C05', pose='claude_smile', sub='因为 x 们线性无关。x₃ 要是减成了零，它就落在 x₁、x₂ 的平面里了。', read='因为这些x线性无关。如果x三减成了零，它就落在x一、x二的平面里了。'),
    dict(id='C06', pose='claude_point', sub='而且每一步都保持 Span(u₁, …, uₖ) = Span(x₁, …, xₖ)。这就是定理 5.6.1。', read='而且每一步都保持：前k个u张成的空间，等于前k个x张成的空间。这就是定理五点六点一。'),
    dict(id='C07', pose='claude_explain', sub='例 2：A 的三列，a₁ = (1, 1, 1, 1)ᵀ，a₂ = (−1, 4, 4, −1)ᵀ，a₃ = (4, −2, 2, 0)ᵀ。', read='例二：A的三列，a一是一、一、一、一；a二是负一、四、四、负一；a三是四、负二、二、零。'),
    dict(id='C08', pose='claude_point', sub='r₁₁ = ‖a₁‖ = 2，q₁ = (1/2)(1, 1, 1, 1)ᵀ。', read='r一一等于a一的长度，是二。q一等于二分之一倍的一、一、一、一。'),
    dict(id='C09', pose='claude_explain', sub='r₁₂ = q₁ᵀa₂ = 3。a₂ − 3q₁ = (−5/2, 5/2, 5/2, −5/2)ᵀ，长度 r₂₂ = 5，q₂ = (1/2)(−1, 1, 1, −1)ᵀ。', read='r一二，是q一和a二的点积，等于三。a二减三倍q一，是负二分之五、二分之五、二分之五、负二分之五。长度r二二等于五，q二是二分之一倍的负一、一、一、负一。'),
    dict(id='C10', pose='claude_point', sub='r₁₃ = 2，r₂₃ = −2。a₃ − p₂ = (2, −2, 2, −2)ᵀ，长度 r₃₃ = 4，q₃ = (1/2)(1, −1, 1, −1)ᵀ。', read='r一三等于二，r二三等于负二。a三减p二，是二、负二、二、负二，长度r三三等于四，q三是二分之一倍的一、负一、一、负一。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='三个 q，每个分量都是 ±1/2，好整齐！', read='三个q，每个分量都是正负二分之一，好整齐！'),
    dict(id='C11', pose='claude_explain', sub='更妙的是：把一路算出的 r 收集起来，排成上三角矩阵 R = [[2, 3, 2], [0, 5, −2], [0, 0, 4]]，就有 A = QR。', read='更妙的是：把一路算出来的r收集起来，排成上三角矩阵R，第一行二、三、二，第二行零、五、负二，第三行零、零、四，就有A等于Q R。'),
    dict(id='C12', pose='claude_point', sub='定理 5.6.2：A 是 m×n、秩为 n，就能分解成 A = QR：Q 的列标准正交，R 是上三角，对角线全正。', read='定理五点六点二：A是m行n列，秩为n，就能分解成Q R：Q的各列标准正交，R是上三角，对角线全是正数。'),
    dict(id='C13', pose='claude_explain', sub='为什么？倒过来读每一步：a₁ = r₁₁q₁，a₂ = r₁₂q₁ + r₂₂q₂，a₃ = r₁₃q₁ + r₂₃q₂ + r₃₃q₃。这正是 QR 的第 1、2、3 列。', read='为什么？倒过来读每一步：a一等于r一一乘q一；a二等于r一二乘q一，加r二二乘q二；a三是三项之和。这正是Q R的第一、二、三列。'),
    dict(id='C14', pose='claude_point', sub='定理 5.6.3：最小二乘解满足 Rx = Qᵀb，回代就能解。', read='定理五点六点三：最小二乘解，满足R x等于Q转置b，回代就能解出来。'),
    dict(id='C15', pose='claude_explain', sub='例 4：用例 3 分解好的 QR，Qᵀb = (−1, −1, 2)ᵀ。回代：x₃ = 1，x₂ = 0，x₁ = −2/5。', read='例四：用例三已经分解好的Q R，算出Q转置b，是负一、负一、二。从下往上回代：x三等于一，x二等于零，x一等于负五分之二。'),
    dict(id='D03', mood='think', pose='ds_think', sub='这和直接解正规方程，结果一样吗？', read='这和直接解正规方程，结果一样吗？'),
    dict(id='C16', pose='claude_smile', sub='一样，都是 (−2/5, 0, 1)ᵀ。但 QR 不用算 AᵀA，数值上更稳。教材还给了修正的施密特过程，更适合计算机。', read='一样，都是负五分之二、零、一。但是Q R不用算A转置A，数值上更稳。教材还给了一个修正的施密特过程，更适合计算机。'),
    dict(id='C17', pose='claude_explain', sub='施密特过程不只用于 ℝⁿ。例 1：从 1、x、x² 出发，配上三点求值的内积，同样能得到一组正交多项式。这是 5.7 节正交多项式的起点。', read='施密特过程，不局限于R n。例一：从一、x、x方出发，配上三点求值的内积，同样能得到一组正交多项式。这就是五点七节，正交多项式的起点。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济第五章第一节也讲施密特正交化，但顺序不同：先全部正交化，最后再统一单位化。', read='同济对照：同济第五章第一节，也讲施密特正交化，但是顺序不同：先全部正交化，最后再统一单位化。'),
    dict(id='G02', pose='gpt_point', sub='同济写法：b₁ = a₁，b₂ = a₂ − ([a₂, b₁]/[b₁, b₁]) b₁，b₃ 再减两项。分母用 [b, b]，中途不开根号，手算更省事。', read='同济的写法：b一等于a一；b二等于a二，减去方括号a二b一，除以方括号b一b一，再乘b一；b三再减两项。分母用b和自己的内积，中途不开根号，手算更省事。'),
    dict(id='G03', pose='gpt_cross', sub='同济例题：a₁ = (1, 2, −1)ᵀ，a₂ = (−1, 3, 1)ᵀ，a₃ = (4, −1, 0)ᵀ。算出 b₂ = (5/3)(−1, 1, 1)ᵀ，b₃ = 2(1, 0, 1)ᵀ，最后单位化。考试推荐这种写法。', read='同济的例题：a一是一、二、负一，a二是负一、三、一，a三是四、负一、零。算出b二，是三分之五倍的负一、一、一；b三是二倍的一、零、一；最后再单位化。考试推荐这种写法。'),
    dict(id='C18', pose='claude_explain', sub='小结：减去投影，再单位化。记下所有系数，就得到 A = QR，用它解最小二乘最稳。', read='小结：减去投影，再单位化。记下所有的系数，就得到A等于Q R，用它解最小二乘，最稳。'),
    dict(id='C19', pose='claude_point', sub='下一节复习：第五章十道判断题。', read='下一节复习：先做第五章的十道判断题。'),
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
