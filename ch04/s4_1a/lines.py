# -*- coding: utf-8 -*-
"""第 4 章 4.1a 什么是线性变换（Leon 9th §4.1 前半：定义、式 (2)(3)、线性算子；例 1–4 伸缩 / 投影 / 反射 / 旋转；
反例：例 6 范数、Test B 1(b) (x₁x₂, x₁)ᵀ、平移 x + a）台词源（唯一真源）。
3B1B 画面：网格整体变形——平行等距、原点不动；反例里网格线不再平行 / 原点被拖走。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='第三章结尾说过：这一章，要把矩阵真正当成“变换”来看。', read='第三章结尾我们说过：这一章，要把矩阵真正当成变换来看。'),
    dict(id='D01', mood='think', pose='ds_ask', sub='变换？矩阵不就是排成方阵的一堆元素吗？', read='变换？矩阵不就是，排成方阵的一堆元素吗？'),
    dict(id='C02', pose='claude_explain', sub='先把矩阵放一边。“变换”其实就是函数：吃进一个向量，吐出另一个向量。', read='先把矩阵放一边。变换，其实就是函数：吃进一个向量，吐出另一个向量。'),
    dict(id='C03', pose='claude_point', sub='换个看法：把它想成运动。平面上每个点都挪到新位置，整张网格跟着变形。', read='换个看法：把它想成一场运动。平面上每个点，都挪到一个新位置，整张网格跟着变形。'),
    dict(id='C04', pose='claude_explain', sub='绝大部分变形都乱七八糟。线性代数关心的，是最规整的那一类：线性变换。', read='绝大部分变形，都乱七八糟。线性代数关心的，是最规整的那一类：线性变换。'),
    dict(id='C05', pose='claude_point', sub='定义：映射 L: V → W，如果对任意向量 v₁、v₂ 和任意标量 α、β，都满足画面上这条等式，就叫线性变换。', read='定义：从V到W的映射L，如果对任意向量v一、v二，和任意两个标量，都满足画面上这条等式，就叫线性变换。'),
    dict(id='C06', pose='claude_explain', sub='用一句话说：先线性组合再变换，等于先变换再线性组合。', read='用一句话说：先线性组合再变换，等于先变换，再线性组合。'),
    dict(id='C07', pose='claude_point', sub='拆开是两条：保持加法，L(v₁ + v₂) = L(v₁) + L(v₂)；保持标量乘法，L(αv) = αL(v)。', read='把它拆开，就是两条：第一，保持加法，v一加v二的像，等于各自的像相加；第二，保持标量乘法，阿尔法v的像，等于阿尔法乘L v。'),
    dict(id='C08', pose='claude_explain', sub='如果 V 和 W 是同一个空间，L 就叫线性算子。这一节前几个例子，都是 ℝ² 上的算子。', read='如果V和W是同一个空间，L就叫线性算子。这一节前几个例子，都是R二上的算子。'),
    dict(id='D02', mood='easy', pose='ds_think', sub='公式我看懂了……可它在画面里是什么样子？', read='公式我看懂了，可它在画面里，是什么样子？'),
    dict(id='C09', pose='claude_smile', sub='看网格。几何上有两条判别：网格线变形后仍是直线，并且保持平行、等距；原点不动。', read='看网格。几何上，有两条判别：网格线变形以后，仍然是直线，并且保持平行、等距；同时，原点不动。'),
    dict(id='C10', pose='claude_point', sub='例 1：L(x) = 3x。每个向量都拉伸到 3 倍，整张网格均匀放大。', read='例一：L x 等于三x。每个向量，都拉伸到三倍，整张网格均匀放大。'),
    dict(id='C11', pose='claude_explain', sub='验证：3 倍的线性组合，等于线性组合的 3 倍。线性。', read='验证一下：三倍的线性组合，展开以后，正好等于线性组合的三倍。所以它是线性的。'),
    dict(id='C12', pose='claude_point', sub='例 2：L(x) = x₁e₁，把每个向量投影到 x₁ 轴上。整张平面被压成一条直线。', read='例二：L x 等于x一乘e一，就是把每个向量，投影到x一轴上。整张平面，被压成了一条直线。'),
    dict(id='D03', mood='think', pose='ds_confused', sub='压扁了也算线性？', read='压扁了，也算线性？'),
    dict(id='C13', pose='claude_explain', sub='算。直线还是直线，间距还是均匀的，原点也没动；代数上，取第一个分量本来就保持加法和标量乘法。', read='算。直线还是直线，间距还是均匀的，原点也没动；代数上，取出第一个分量，本来就保持加法和标量乘法。'),
    dict(id='C14', pose='claude_point', sub='例 3：L(x) = (x₁, −x₂)ᵀ，关于 x₁ 轴反射。上半平面翻到下半平面，像照镜子。', read='例三：L x 等于x一、负x二，就是关于x一轴的反射。上半平面翻到下半平面，像照镜子一样。'),
    dict(id='C15', pose='claude_explain', sub='例 4：L(x) = (−x₂, x₁)ᵀ，逆时针转 90°。î 转到 ĵ 的位置，ĵ 转到 −î 的位置。', read='例四：L x 等于负x二、x一，就是逆时针转九十度。i帽转到了j帽的位置，j帽转到了负i帽的位置。'),
    dict(id='C16', pose='claude_smile', sub='四个例子，四种动作：伸缩、投影、反射、旋转。网格都平行等距，原点都不动。', read='四个例子，四种动作：伸缩、投影、反射、旋转。网格都保持平行等距，原点都不动。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='那是不是所有变换都这么乖？', read='那是不是，所有变换都这么乖？'),
    dict(id='C17', pose='claude_think', sub='当然不是。看反例。例 6：M(x) = x 的长度（范数），把向量变成一个非负实数。', read='当然不是。来看反例。教材例六：M x 等于x的范数，也就是把向量，变成它的大小。'),
    dict(id='C18', pose='claude_explain', sub='取 α = −1：M(−x) 还是正的长度，可是 −M(x) 是负的。一正一负，对不上，不是线性的。', read='取阿尔法等于负一：M负x，还是正的；可负M x，是负的。一正一负，对不上，所以它不是线性的。'),
    dict(id='C19', pose='claude_point', sub='再看 Test B 第 1(b) 题：L(x) = (x₁x₂, x₁)ᵀ。一旦出现 x₁x₂ 这种乘积项，就要警惕。', read='再看教材测验B，第一题的b问：L x 等于x一x二、x一。一旦出现x一乘x二这种乘积项，就要警惕。'),
    dict(id='C20', pose='claude_explain', sub='把 x 放大 2 倍：第一个分量变成 4x₁x₂，放大了 4 倍，不是 2 倍。所以不是线性的。', read='把x放大两倍：第一个分量，变成了四倍的x一x二。放大了四倍，而不是两倍，所以不是线性的。'),
    dict(id='C21', pose='claude_point', sub='画面上看：每条横线都被拧成了过原点的斜线，彼此不再平行。', read='画面上看：每一条横线，都被拧成了过原点的斜线，彼此不再平行。'),
    dict(id='D05', mood='think', pose='ds_think', sub='那平移呢？整张网格一起往右挪，线还是直的，也还平行、等距。', read='那平移呢？整张网格一起往右挪，线还是直的，也依然平行、等距。'),
    dict(id='C22', pose='claude_smile', sub='好问题。设 L(x) = x + a，a 不是零向量。盯住原点：它被拖到了 a。', read='好问题。设L x 等于x加a，a不是零向量。盯住原点：它被拖到了a的位置。'),
    dict(id='C23', pose='claude_explain', sub='线性变换一定把零向量送到零向量：L(0) = L(0·0) = 0·L(0) = 0。原点一动，立刻出局。', read='线性变换，一定把零向量送到零向量：L零，等于零乘零的像，等于零乘L零，结果就是零。原点一动，立刻出局。'),
    dict(id='C24', pose='claude_point', sub='所以平移不是线性变换。可图形学里天天要平移，怎么办？这个坑留到 4.2 节的图形学应用来填。', read='所以，平移不是线性变换。可图形学里，天天都要平移，怎么办？这个坑，留到四点二节的图形学应用来填。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济第六章第 3 节 把线性变换记作 T，定义相同：保持加法，保持数乘。', read='同济对照：同济教材第六章第三节，把线性变换记作T，定义完全相同：保持加法，保持标量乘法。'),
    dict(id='G02', pose='gpt_point', sub='区别是：同济仅讨论一个空间到它自身的变换，也就是英文教材说的线性算子。', read='区别在于：同济仅讨论一个空间到它自身的变换，也就是英文教材说的线性算子。'),
    dict(id='C25', pose='claude_smile', sub='小结：线性 = 保持线性组合；几何上，网格平行等距、原点不动。判断时先看 L(0) 是不是 0，最快。', read='小结一下：线性，就是保持线性组合；几何上，网格保持平行等距，原点不动。判断的时候，先看L零是不是零，这是最快的排除法。'),
    dict(id='D06', mood='easy', pose='ds_proud', sub='记住了！下一节呢？', read='记住了！下一节讲什么？'),
    dict(id='C26', pose='claude_explain', sub='下一节：从 n 维到 m 维的变换，还有两个新名词——核与像。', read='下一节，看从R n到R m的变换，还有两个新名词：核，和像。'),
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
