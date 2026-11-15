# -*- coding: utf-8 -*-
"""第 4 章 4.2a 标准矩阵：盯住 î 和 ĵ（Leon 9th §4.2 定理 4.2.1、例 1、例 2 旋转矩阵；Test B 1(a)、2、5、6；
复合 = 乘积（习题 19），先做的写右边）台词源（唯一真源）。
3B1B 画面：第 3 集 î、ĵ 带着网格走，落点读成两列（î→(1,−2)，ĵ→(3,0)，x=(−1,2)→(5,2)）；第 4 集复合：先转 90° 再剪切 = [[1,−1],[1,0]]。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='上一节留了个问题：线性变换都能写成矩阵吗？从 ℝⁿ 到 ℝᵐ，答案是能，而且方法简单得惊人。', read='上一节留了个问题：线性变换，都能写成矩阵吗？从R n到R m，答案是能，而且方法简单得惊人。'),
    dict(id='C02', pose='claude_explain', sub='关键观察：任何向量 x = x₁î + x₂ĵ。线性变换保持线性组合，所以 L(x) = x₁L(î) + x₂L(ĵ)。', read='关键观察：任何向量x，都等于x一倍的i帽，加x二倍的j帽。线性变换保持线性组合，所以L x，就等于x一倍的L i帽，加x二倍的L j帽。'),
    dict(id='C03', pose='claude_point', sub='也就是说：知道 î 和 ĵ 落在哪里，整张网格落在哪里，就全知道了。', read='也就是说：一旦知道i帽和j帽落在哪里，整张网格落在哪里，就全都知道了。'),
    dict(id='D01', mood='think', pose='ds_ask', sub='两个向量，就能决定整张平面？', read='两个向量，就能决定整张平面？'),
    dict(id='C04', pose='claude_smile', sub='看画面。这个变换把 î 送到 (1, −2)，把 ĵ 送到 (3, 0)。网格跟着它们走。', read='看画面。这个变换，把i帽送到一、负二，把j帽送到三、零。整张网格，跟着它们走。'),
    dict(id='C05', pose='claude_explain', sub='取 x = (−1, 2)ᵀ。变换前它是 −1 个 î 加 2 个 ĵ；变换后，还是 −1 个新 î 加 2 个新 ĵ。', read='取x等于负一、二。变换前，它是负一个i帽，加两个j帽；变换以后，它还是负一个新i帽，加两个新j帽。'),
    dict(id='C06', pose='claude_point', sub='算出来：−1·(1, −2)ᵀ + 2·(3, 0)ᵀ = (5, 2)ᵀ。', read='算出来：负一乘一、负二，加上二乘三、零，等于五、二。'),
    dict(id='C07', pose='claude_explain', sub='把 î、ĵ 的落点并排写成两列，就是矩阵 [[1, 3], [−2, 0]]。矩阵乘向量，算的正是这个组合。', read='把i帽、j帽的落点，并排写成两列，就得到一个矩阵。矩阵乘向量，算的正是刚才那个组合。'),
    dict(id='C08', pose='claude_point', sub='这就是定理 4.2.1：L: ℝⁿ → ℝᵐ 的标准矩阵 A，第 j 列 aⱼ = L(eⱼ)。', read='这就是定理四点二点一：从R n到R m的线性变换，标准矩阵A的第j列，就是e j的像。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='所以矩阵的每一列，就是一个基向量的落脚点！', read='所以，矩阵的每一列，就是一个基向量的落脚点！'),
    dict(id='C09', pose='claude_smile', sub='记住这句话，这一章就通了一半。', read='记住这句话，这一章就通了一半。'),
    dict(id='C10', pose='claude_point', sub='例 1：L(x) = (x₁ + x₂, x₂ + x₃)ᵀ。L(e₁) = (1, 0)ᵀ，L(e₂) = (1, 1)ᵀ，L(e₃) = (0, 1)ᵀ。', read='例一：L x 等于x一加x二、x二加x三。e一的像是一、零，e二的像是一、一，e三的像是零、一。'),
    dict(id='C11', pose='claude_explain', sub='三列拼起来：A = [[1, 1, 0], [0, 1, 1]]。验证：Ax 正好是 (x₁ + x₂, x₂ + x₃)ᵀ。', read='三列拼起来，就是A。验证一下：用A去乘x，得到两个数：x一加x二，还有x二加x三。'),
    dict(id='C12', pose='claude_point', sub='例 2：逆时针旋转一个角。î 落到 (cos, sin)，ĵ 落到 (−sin, cos)。', read='例二：逆时针旋转一个角度西塔。i帽落到cos西塔、sin西塔，j帽落到负sin西塔、cos西塔。'),
    dict(id='C13', pose='claude_explain', sub='两列一拼，就是旋转矩阵。转 90° 时，它正是上一节的例 4：[[0, −1], [1, 0]]。', read='两列一拼，就是旋转矩阵。西塔等于九十度的时候，它正是上一节的例四。'),
    dict(id='C14', pose='claude_point', sub='Test B 第 5 题：L(x) = (x₁ + x₂, x₁ − x₂, 3x₁ + 2x₂)ᵀ，求 A。', read='教材测验B第五题：L x 等于x一加x二、x一减x二、三x一加二x二，求矩阵A。'),
    dict(id='D03', mood='easy', pose='ds_proud', sub='我来！e₁ 代进去得 (1, 1, 3)ᵀ，e₂ 得 (1, −1, 2)ᵀ。A = [[1, 1], [1, −1], [3, 2]]，三行两列！', read='我来！代入e一，是一、一、三；代入e二，是一、负一、二。拼起来，A是三行两列！'),
    dict(id='C15', pose='claude_smile', sub='对。Test B 第 1(a) 题也一样：(x₁ + x₂, x₁)ᵀ 能写成 [[1, 1], [1, 0]] 乘 x，所以是线性的。', read='对。测验B第一题的a问也一样：x一加x二、x一，能写成一个矩阵乘x，所以它是线性的。'),
    dict(id='C16', pose='claude_point', sub='再看 Test B 第 2 题：已知 L(v₁) = (2, 5)ᵀ，L(v₂) = (−3, 1)ᵀ，v₃ = (1, 7)ᵀ，求 L(v₃)。', read='再看测验B第二题：已知v一的像是二、五，v二的像是负三、一，v三等于一、七，求v三的像。'),
    dict(id='C17', pose='claude_explain', sub='不用求矩阵。v₁ = (1, 1)ᵀ，v₂ = (−1, 2)ᵀ，先把 v₃ 拆开：v₃ = 3v₁ + 2v₂。', read='不用先求矩阵。v一是一、一，v二是负一、二，先把v三拆开：v三等于三倍v一，加两倍v二。'),
    dict(id='C18', pose='claude_point', sub='线性性一用：L(v₃) = 3L(v₁) + 2L(v₂) = (6, 15)ᵀ + (−6, 2)ᵀ = (0, 17)ᵀ。', read='线性性一用：v三的像，等于三倍的二、五，加两倍的负三、一，也就是六、十五，加负六、二，等于零、十七。'),
    dict(id='C19', pose='claude_explain', sub='接下来：连做两个变换。先做 L₁，再做 L₂，这个复合的矩阵是什么？', read='接下来：连着做两个变换。先做L一，再做L二，这个复合变换的矩阵是什么？'),
    dict(id='D04', mood='think', pose='ds_think', sub='两个矩阵相乘？可是谁在前面？', read='两个矩阵相乘？可是，谁在前面？'),
    dict(id='C20', pose='claude_smile', sub='看画面：先转 90°，再剪切。最终 î、ĵ 的落点读成两列，正好是乘积 BA。', read='看画面：先转九十度，再做一个剪切。最后，i帽和j帽的落点，读成两列，正好是乘积B A。'),
    dict(id='C21', pose='claude_explain', sub='原因：L₂(L₁(x)) = B(Ax) = (BA)x。先做的 A 写在右边，像函数复合 f(g(x)) 一样，从右往左读。', read='原因是：L二作用在L一x上，等于B乘A x，也就是B A乘x。先做的A，写在右边，和函数复合一样，从右往左读。'),
    dict(id='C22', pose='claude_point', sub='Test B 第 6 题：先逆时针转 30°，再关于 y 轴反射，求标准矩阵。', read='测验B第六题：先逆时针转三十度，再关于y轴反射，求标准矩阵。'),
    dict(id='C23', pose='claude_explain', sub='转 30° 的矩阵记作 R，关于 y 轴反射是 F = [[−1, 0], [0, 1]]。先转后反射，所以是 FR。', read='转三十度的矩阵记作R，关于y轴的反射记作F。先转，后反射，所以乘积是F R。'),
    dict(id='C24', pose='claude_point', sub='乘出来：第一列 (−√3/2, 1/2)ᵀ，第二列 (1/2, √3/2)ᵀ。', read='乘出来：第一列是负二分之根号三、二分之一；第二列是二分之一、二分之根号三。'),
    dict(id='D05', mood='think', pose='ds_ask', sub='要是先反射再转呢？', read='要是先反射，再转呢？'),
    dict(id='C25', pose='claude_smile', sub='那是 RF：第一列 (−√3/2, −1/2)ᵀ，和 FR 不一样。矩阵乘法不能交换，变换的顺序也不能换。', read='那就是R F：第一列变成负二分之根号三、负二分之一，和F R不一样。矩阵乘法不能交换，变换的顺序也不能换。'),
    dict(id='C26', pose='claude_explain', sub='小结：标准矩阵的第 j 列是 L(eⱼ)；复合就是乘积，先做的写右边。', read='小结：标准矩阵的第j列，就是e j的像；复合就是乘积，先做的写在右边。'),
    dict(id='D06', mood='easy', pose='ds_happy', sub='那如果不用 î、ĵ，换一组别的基呢？', read='那如果不用i帽、j帽，换一组别的基呢？'),
    dict(id='C27', pose='claude_point', sub='这正是下一节：任意基下的矩阵。', read='这正是下一节的内容：任意基下的矩阵。'),
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
