# -*- coding: utf-8 -*-
"""第 7 章 7.4（上）矩阵范数（Leon 9th §7.4：Frobenius 范数、性质 (iv) ‖AB‖ ≤ ‖A‖‖B‖、从属范数 max ‖Ax‖/‖x‖、
定理 7.4.2 ‖A‖₁ 最大列和 / ‖A‖∞ 最大行和（例 1：14、15）、定理 7.4.3 ‖A‖₂ = σ₁、相容、‖I‖F = √n、‖Q‖₂ = 1）台词源（唯一真源）。
3B1B 画面：单位圆 / 菱形 / 正方形被 A = (2 1; 1 3) 变形，最远点到原点的距离 = 范数；列和、行和条形逐个点亮。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='向量有长度。矩阵有多大？这一节给矩阵定义“大小”，叫矩阵范数。', read='向量有长度。那矩阵有多大？这一节给矩阵定义大小，叫作矩阵范数。'),
    dict(id='C02', pose='claude_explain', sub='最直接的：所有元素平方相加再开方，叫 Frobenius 范数 ‖A‖F。第五章用过它：把 A 当成一个长向量，量它的长度。', read='最直接的办法：把所有元素平方，加起来，再开方，叫弗罗贝尼乌斯范数。第五章用过它，它就是把A当成一个长长的向量，量它的长度。'),
    dict(id='C03', pose='claude_point', sub='好用的矩阵范数，除了非负、数乘、三角不等式，还要满足 ‖AB‖ ≤ ‖A‖‖B‖。于是 ‖Aⁿ‖ ≤ ‖A‖ⁿ。', read='一个好用的矩阵范数，除了非负、数乘、三角不等式这三条，还要满足：乘积的范数，不超过范数的乘积。于是，A的n次方的范数，不超过A的范数的n次方。'),
    dict(id='C04', pose='claude_explain', sub='换个几何的看法：A 是一个变换。把单位向量喂进去，看最多被拉长多少倍——这个最大倍数 max ‖Ax‖/‖x‖，叫从属范数。', read='换个几何的看法：A是一个变换。把所有单位向量喂进去，看它们最多被拉长多少倍，这个最大倍数，就叫作从属于向量范数的矩阵范数。'),
    dict(id='C05', pose='claude_point', sub='用 2-范数：单位圆被 A 变成椭圆，最长半轴就是 ‖A‖₂。第六章说过，那就是最大奇异值 σ₁。', read='用二范数：单位圆被A变成一个椭圆，椭圆最长的半轴，就是A的二范数。第六章说过，它就是最大的奇异值，西格玛一。'),
    dict(id='C06', pose='claude_explain', sub='定理 7.4.3：‖A‖₂ = σ₁。比如 A = (2 1; 1 3)，σ₁ ≈ 3.618，椭圆最长半轴就这么长。', read='定理七点四点三：A的二范数，等于西格玛一。比如屏幕上这个二乘二的矩阵，西格玛一大约是三点六一八，椭圆最长的半轴，就这么长。'),
    dict(id='D01', mood='think', pose='ds_think', sub='那 1-范数、∞-范数的“单位圆”呢？', read='那一范数、无穷范数的单位圆呢？'),
    dict(id='C07', pose='claude_smile', sub='1-范数的单位圆是菱形，∞-范数的是正方形。A 把它们变成平行四边形，最远的顶点决定范数。', read='一范数的单位圆，是一个菱形；无穷范数的单位圆，是一个正方形。A把它们变成平行四边形，最远的那个顶点，决定范数。'),
    dict(id='C08', pose='claude_explain', sub='菱形的顶点是坐标轴上的单位向量，被 A 变成 A 的各列。所以 ‖A‖₁ = 最大的列绝对值和。', read='菱形的顶点，是坐标轴上的单位向量，被A变成A的各列。所以，A的一范数，就是各列绝对值之和里，最大的那一个。'),
    dict(id='C09', pose='claude_point', sub='正方形的顶点各坐标都是 ±1，选和 A 某一行符号一致的那个，得到 ‖A‖∞ = 最大的行绝对值和。', read='正方形的顶点，各个坐标都是正负一；选和A某一行符号一致的那个，就得到：A的无穷范数，是各行绝对值之和里，最大的那一个。'),
    dict(id='C10', pose='claude_explain', sub='记法：1 看“列”，∞ 看“行”。1 竖着写像一列，∞ 横着躺像一行。', read='一个记法：一范数看列，无穷范数看行。一竖着写，像一列；无穷横着躺，像一行。'),
    dict(id='C11', pose='claude_point', sub='例 1：一个 4 阶矩阵。各列绝对值和 11、6、14、13，所以 ‖A‖₁ = 14；各行 12、15、13、4，所以 ‖A‖∞ = 15。', read='例一：一个四阶矩阵。各列绝对值之和，是十一、六、十四、十三，所以一范数是十四；各行是十二、十五、十三、四，所以无穷范数是十五。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='这个简单，比奇异值好算多了！', read='这个简单，比奇异值好算多了！'),
    dict(id='C12', pose='claude_smile', sub='所以实际估算常用 1-范数和 ∞-范数；2-范数要算奇异值，最“几何”，但最贵。', read='所以实际估算的时候，常用一范数和无穷范数；二范数要算奇异值，最几何，但最贵。'),
    dict(id='C13', pose='claude_explain', sub='从属范数的关键性质：‖Ax‖ ≤ ‖A‖‖x‖，叫相容。Frobenius 范数和向量 2-范数也相容：‖Ax‖₂ ≤ ‖A‖F‖x‖₂。', read='从属范数有一个关键性质：A乘x的范数，不超过A的范数乘x的范数，叫作相容。弗罗贝尼乌斯范数，和向量的二范数，也是相容的。'),
    dict(id='C14', pose='claude_point', sub='但两者不一定相等：‖A‖₂ ≤ ‖A‖F。单位阵就是例子：‖I‖₂ = 1，‖I‖F = √n。', read='但它们不一定相等：二范数不超过弗罗贝尼乌斯范数。单位阵就是例子：它的二范数是一，弗罗贝尼乌斯范数却是根号n。'),
    dict(id='C15', pose='claude_explain', sub='再看正交矩阵 Q：只转不拉，单位圆还是单位圆，所以 ‖Q‖₂ = 1。第 5 节会反复用到。', read='再看正交矩阵Q：它只转不拉，单位圆还是单位圆，所以它的二范数等于一。这个事实，第五节会反复用到。'),
    dict(id='G01', pose='gpt_explain', sub='同济本科不讲矩阵范数；但第五章讲过向量长度，以及正交矩阵保持长度不变。‖Q‖₂ = 1 说的就是这件事。', read='同济本科不讲矩阵范数；但第五章讲过向量的长度，以及正交矩阵保持长度不变。正交矩阵的二范数等于一，说的就是这件事。'),
    dict(id='C16', pose='claude_smile', sub='小结：‖A‖ = 最大拉伸倍数；‖A‖₁ 最大列和，‖A‖∞ 最大行和，‖A‖₂ = σ₁；‖Ax‖ ≤ ‖A‖‖x‖。', read='小结：矩阵范数，是最大的拉伸倍数；一范数看最大列和，无穷范数看最大行和，二范数等于西格玛一；而且，A乘x的范数，不超过A的范数乘x的范数。'),
    dict(id='C17', pose='claude_point', sub='有了尺子，下一节就来量：一个方程组到底有多敏感。条件数。', read='有了尺子，下一节就来量：一个方程组，到底有多敏感。条件数。'),
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
