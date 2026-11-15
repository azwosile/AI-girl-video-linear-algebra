# -*- coding: utf-8 -*-
"""第 3 章 3.2b 张成与张成集（Leon 9th §3.2 后半：Span、定理 3.2.1、例 10–12、定理 3.2.2）台词源（唯一真源）。
3B1B 画面：α、β 滑动，组合点铺满平面；共线时只扫出一条线；ℝ³ 第三根箭头在 / 不在平面上。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='上一节，零空间被两个向量“撑”了起来。这一节，我们把“撑起来”说清楚。', read='上一节，零空间被两个向量撑了起来。这一节，我们把撑起来这件事说清楚。'),
    dict(id='C02', pose='claude_explain', sub='先回顾线性组合：每个向量乘上一个数，再全部加起来。'),
    dict(id='C03', pose='claude_point', sub='所有可能的线性组合放在一起，叫这些向量的“张成”，记作 Span。', read='所有可能的线性组合放在一起，构成的集合，叫作这些向量的张成，记作Span。'),
    dict(id='C04', pose='claude_explain', sub='看平面上的 v₁ 和 v₂。固定 α、β，就得到一个点。', read='看平面上的两个向量，v一和v二。固定阿尔法和贝塔，就得到一个点。'),
    dict(id='C05', pose='claude_point', sub='让 α、β 都动起来，这些点就铺满了整个平面。两个不共线的向量，张成整个 ℝ²。', read='让阿尔法和贝塔都动起来，这些点就铺满了整个平面。两个不共线的向量，张成整个R二。'),
    dict(id='D01', mood='think', pose='ds_ask', sub='要是两个向量共线呢？'),
    dict(id='C06', pose='claude_explain', sub='那不管系数怎么取，结果都落在同一条直线上。张成就缩成了一条线。'),
    dict(id='C07', pose='claude_point', sub='换到 ℝ³：两个不共线的向量，张成一张过原点的平面。', read='换到R三：两个不共线的向量，张成一张过原点的平面。'),
    dict(id='C08', pose='claude_explain', sub='再加第三个向量。如果它不在这张平面上，三个向量就能张成整个 ℝ³。', read='再加第三个向量。如果它不在这张平面上，三个向量就能张成整个R三。'),
    dict(id='C09', pose='claude_think', sub='如果它恰好躺在平面上，加了也白加，张成还是那张平面。记住这个画面，下一节要用。', read='如果它恰好躺在平面上，那就加了也白加，张成还是那张平面。记住这个画面，下一节要用。'),
    dict(id='C10', pose='claude_explain', sub='定理 3.2.1：任何一组向量的张成，都是子空间。', read='教材定理三点二点一：任何一组向量的张成，都是子空间。'),
    dict(id='C11', pose='claude_point', sub='理由：两个线性组合相加，还是线性组合；线性组合乘一个数，也还是线性组合。', read='理由很简单：两个线性组合相加，还是线性组合；线性组合乘一个数，也还是线性组合。'),
    dict(id='C12', pose='claude_explain', sub='如果一组向量的张成正好是整个 V，就说它们是 V 的“张成集”。', read='如果一组向量的张成，正好就是整个V，我们就说，这组向量是V的张成集。'),
    dict(id='C13', pose='claude_point', sub='教材例 11：下面四组向量，哪些能张成 ℝ³？', read='来判断教材例十一：下面四组向量，哪些能张成R三？'),
    dict(id='C14', pose='claude_explain', sub='(a) e₁、e₂、e₃，再加 (1, 2, 3)ᵀ。三个坐标方向都有了，任何向量都凑得出来。能。', read='第一组：e一、e二、e三，再加一个一、二、三。三个坐标方向都有了，任何向量都能凑出来。能。'),
    dict(id='C15', pose='claude_point', sub='(b) (1, 1, 1)ᵀ、(1, 1, 0)ᵀ、(1, 0, 0)ᵀ。要凑出任意的 (a, b, c)ᵀ ——', read='第二组：一、一、一；一、一、零；一、零、零。要凑出任意一个向量a、b、c，'),
    dict(id='C16', pose='claude_explain', sub='从最后一个分量倒推：α = c，β = b − c，γ = a − b。总有解，能张成。', read='从最后一个分量开始倒推：阿尔法等于c，贝塔等于b减c，伽马等于a减b。总是有解，所以能张成。'),
    dict(id='C17', pose='claude_point', sub='(c) (1, 0, 1)ᵀ 和 (0, 1, 0)ᵀ。它们的组合，第一个分量永远等于第三个分量。', read='第三组：一、零、一，和零、一、零。它们的组合，第一个分量永远等于第三个分量。'),
    dict(id='C18', pose='claude_explain', sub='所以 (1, 0, 0)ᵀ 凑不出来。两个向量最多张成一张平面，不能张成 ℝ³。', read='所以，一、零、零这样的向量凑不出来。两个向量最多张成一张平面，不能张成R三。'),
    dict(id='C19', pose='claude_think', sub='(d) (1, 2, 4)ᵀ、(2, 1, 3)ᵀ、(4, −1, 1)ᵀ。三个向量，数量看起来够了。', read='第四组：一、二、四；二、一、三；四、负一、一。三个向量，数量看起来够了。'),
    dict(id='C20', pose='claude_point', sub='但行列式等于零：第三个 = 3 × 第二个 − 2 × 第一个，它躺在前两个张成的平面里。不能。', read='但是算一下行列式，等于零。第三个向量，等于第二个的三倍，减去第一个的二倍，它躺在前两个张成的平面里。所以不能。'),
    dict(id='D02', mood='think', pose='ds_think', sub='原来不是向量越多越好，还得看有没有白加的。'),
    dict(id='C21', pose='claude_smile', sub='说得好。这个“白加”，下一节有个正式的名字。', read='说得好。这个白加，下一节会有一个正式的名字。'),
    dict(id='C22', pose='claude_explain', sub='张成集不限于 ℝⁿ。教材例 12：1 − x²、x + 2、x² 张成 P₃。', read='张成集也不限于R n。教材例十二：一减x的平方、x加二、x的平方，这三个多项式张成P三。'),
    dict(id='C23', pose='claude_point', sub='任取 ax² + bx + c，比较各次项系数：α₁ = c − 2b，α₂ = b，α₃ = a + c − 2b。', read='任取a x平方，加b x，加c，比较各次项的系数，就能解出：第一个系数是c减二b，第二个是b，第三个是a加c减二b。'),
    dict(id='C24', pose='claude_explain', sub='最后，用张成的眼光重新看非齐次方程 Ax = b。定理 3.2.2：', read='最后，用张成的眼光，重新看非齐次方程A x等于b。教材定理三点二点二说：'),
    dict(id='C25', pose='claude_point', sub='若 x₀ 是一个特解，全部解就是 x₀ 加上零空间里的每一个向量。', read='如果x零是一个特解，那么全部的解，就是x零，加上零空间里的每一个向量。'),
    dict(id='C26', pose='claude_explain', sub='比如 x₁ + 2x₂ = 4：齐次解是过原点的一条直线；把它平移到特解 (4, 0)ᵀ，就是全部的解。', read='比如方程：x一加二倍的x二，等于四。齐次方程的解是过原点的一条直线；把这条直线平移到特解四、零，就得到了全部的解。'),
    dict(id='C27', pose='claude_think', sub='解集是一条不过原点的直线：不是子空间，而是零空间平移以后的样子。', read='解集是一条不过原点的直线：它不是子空间，而是零空间平移以后的样子。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：b 能由 A 的列向量线性表示 ⇔ b 在列向量的张成里 ⇔ R(A) = R(A, b)。', read='同济对照：b能由A的列向量线性表示，就是b在列向量的张成里；同济的判别法是，A的秩等于增广矩阵的秩。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='那下一节，就是“白加”的正式名字？', read='那下一节，就是白加的正式名字？'),
    dict(id='C28', pose='claude_smile', sub='对，它叫“线性相关”。', read='对，它叫线性相关。'),
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
