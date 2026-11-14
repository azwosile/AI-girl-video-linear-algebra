# -*- coding: utf-8 -*-
"""第 1 章 §1.5（下）三角分解 LU（Leon 9th §1.5：Diagonal and Triangular Matrices、Triangular Factorization 例 6、
E₃E₂E₁A = U ⇒ A = E₁⁻¹E₂⁻¹E₃⁻¹U = LU；同济第六版正文不讲 LU，学习辅导补充）台词源（唯一真源）。
3B1B 对应：上三角 = 横轴不动的变换，下三角 = 纵轴不动的变换；A = LU = 先做 U 再做 L，斜网格拆成两次简单剪切。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='think', pose='ds_ask', sub='求逆、解方程都靠消元。可要是同一个 A，右边的 b 换了一百次，难道消一百遍？', read='求逆、解方程都靠消元。可要是同一个A，右边的b换了一百次，难道消一百遍？'),
    dict(id='C01', pose='claude_smile', sub='不用。消一遍，把过程记下来就行。记法就是这一节要讲的：三角分解，也叫 LU 分解。', read='不用。消一遍，把过程记下来就行。记法就是这一节要讲的：三角分解，也叫L U分解。'),
    # —— 形状
    dict(id='C02', pose='claude_explain', sub='先认识两种形状：主对角线下面全是 0，叫上三角矩阵；上面全是 0，叫下三角矩阵。', read='先认识两种形状：主对角线下面全是零，叫上三角矩阵；上面全是零，叫下三角矩阵。'),
    dict(id='C03', pose='claude_point', sub='除了对角线，其余全是 0 的，叫对角矩阵。它既是上三角，也是下三角。', read='除了对角线，其余全是零的，叫对角矩阵。它既是上三角，也是下三角。'),
    dict(id='C04', pose='claude_explain', sub='放到平面上：对角矩阵只沿坐标轴拉伸，网格还是方方正正的。', read='放到平面上：对角矩阵只沿坐标轴拉伸，网格还是方方正正的。'),
    dict(id='C05', pose='claude_point', sub='上三角矩阵的第一列下面是 0，所以 î 只在横轴上伸缩——横轴这条线不动。', read='上三角矩阵的第一列下面是零，所以i帽只在横轴上伸缩，横轴这条线不动。'),
    dict(id='C06', pose='claude_point', sub='下三角正好反过来：第二列上面是 0，ĵ 只在纵轴上伸缩，纵轴不动。', read='下三角正好反过来：第二列上面是零，j帽只在纵轴上伸缩，纵轴不动。'),
    dict(id='D02', mood='daily', pose='ds_confused', sub='所以 U 是上三角，L 是下三角？', read='所以U是上三角，L是下三角？'),
    dict(id='C07', pose='claude_explain', sub='对，U 取 upper，L 取 lower。第一节说过，严格三角形的方程组最好解：从最后一行往上回代。前提是对角线上都不是 0。', read='对，U取自upper，L取自lower。第一节说过，严格三角形的方程组最好解：从最后一行往上回代。前提是对角线上都不是零。'),
    # —— 例 6
    dict(id='C08', pose='claude_explain', sub='来看教材例 6。A 的三行是 (2, 4, 2)、(1, 5, 2)、(4, −1, 9)。规定只用第三类变换：某一行加上另一行的倍数。', read='来看教材例六。A的三行是二四二、一五二、四负一九。规定只用第三类变换：某一行加上另一行的倍数。'),
    dict(id='C09', pose='claude_point', sub='第一步：第二行减去第一行的 1/2，记下乘子 1/2；第三行减去第一行的 2 倍，记下乘子 2。', read='第一步：第二行减去第一行的二分之一，记下乘子二分之一；第三行减去第一行的两倍，记下乘子二。'),
    dict(id='C10', pose='claude_point', sub='第二步：第三行加上第二行的 3 倍。按“减去几倍”的说法，乘子是 −3。', read='第二步：第三行加上第二行的三倍。按减去几倍的说法，乘子是负三。'),
    dict(id='C11', pose='claude_explain', sub='左边消成了上三角，这就是 U。', read='左边消成了上三角，这就是U。'),
    dict(id='C12', pose='claude_point', sub='再把三个乘子按位置填进单位下三角矩阵：1/2 放在 (2, 1)，2 放在 (3, 1)，−3 放在 (3, 2)。这就是 L。', read='再把三个乘子按位置填进单位下三角矩阵：二分之一放在第二行第一列，二放在第三行第一列，负三放在第三行第二列。这就是L。'),
    dict(id='D03', mood='panic', pose='ds_shock', sub='就这么填进去？不用算？！', read='就这么填进去？不用算？'),
    dict(id='C13', pose='claude_smile', sub='不用算。验证一下：L 乘 U，正好等于 A。', read='不用算。验证一下：L乘U，正好等于A。'),
    dict(id='D04', mood='think', pose='ds_ask', sub='为什么乘子能原封不动地掉进去？', read='为什么乘子能原封不动地掉进去？'),
    # —— 为什么：初等矩阵
    dict(id='C14', pose='claude_explain', sub='换成初等矩阵看：三步消元就是三个初等矩阵，E₃E₂E₁A = U。', read='换成初等矩阵看：三步消元就是三个初等矩阵，E三E二E一A等于U。'),
    dict(id='C15', pose='claude_point', sub='两边依次乘逆：A = E₁⁻¹E₂⁻¹E₃⁻¹U。注意顺序反过来了。', read='两边依次乘逆：A等于E一逆、E二逆、E三逆，再乘U。注意顺序反过来了。'),
    dict(id='C16', pose='claude_explain', sub='上一节说过，倍加的逆就是把减改成加，所以每个逆矩阵里，乘子都以正号出现。', read='上一节说过，倍加的逆就是把减改成加，所以每个逆矩阵里，乘子都以正号出现。'),
    dict(id='C17', pose='claude_point', sub='按这个顺序相乘，乘子各占各的格子，互不干扰，拼起来就是 L。', read='按这个顺序相乘，乘子各占各的格子，互不干扰，拼起来就是L。'),
    dict(id='C18', pose='claude_think', sub='反过来，E₃E₂E₁ 按原顺序相乘，乘子就搅在一起：左下角冒出 −7/2，乱了。', read='反过来，E三E二E一按原顺序相乘，乘子就搅在一起：左下角冒出负二分之七，乱了。'),
    dict(id='G01', pose='gpt_explain', sub='记个口诀：L 的 (i, j) 格，就是消元时第 i 行减去第 j 行的倍数。减是正，加是负，符号别弄反。', read='记个口诀：L的第i行第j列，就是消元时，第i行减去第j行的倍数。减是正，加是负，符号别弄反。'),
    # —— 平面：A = LU
    dict(id='C19', pose='claude_explain', sub='平面上看更直观。拿上一节的 A：第一列 (1, 2)，第二列 (2, 5)。它的 L 和 U 都只有一个乘子 2。', read='平面上看更直观。拿上一节的A：第一列一、二，第二列二、五。它的L和U，都只有一个乘子二。'),
    dict(id='C20', pose='claude_point', sub='A = LU 的意思是先做 U，再做 L。U 是保住横轴的剪切，L 是保住纵轴的剪切。', read='A等于L U，意思是先做U，再做L。U是保住横轴的剪切，L是保住纵轴的剪切。'),
    dict(id='C21', pose='claude_smile', sub='两步叠起来，正好就是 A 的斜网格。一个复杂的变换，被拆成了两个简单的三角变换。', read='两步叠起来，正好就是A的斜网格。一个复杂的变换，被拆成了两个简单的三角变换。'),
    dict(id='D05', mood='daily', pose='ds_ask', sub='那它怎么帮我解方程？', read='那它怎么帮我解方程？'),
    # —— 解方程
    dict(id='C22', pose='claude_explain', sub='Ax = b 写成 L(Ux) = b。令 Ux = y，就拆成两个三角方程组。', read='A x等于b，写成L乘U x等于b。令U x等于y，就拆成两个三角方程组。'),
    dict(id='C23', pose='claude_point', sub='先解 Ly = b，从上往下代，叫前代；再解 Ux = y，从下往上代，就是回代。', read='先解L y等于b，从上往下代，叫前代；再解U x等于y，从下往上代，就是回代。'),
    dict(id='C24', pose='claude_point', sub='例子：b = (4, 6, 4)。前代：y₁ = 4；y₂ = 6 − 2 = 4；y₃ = 4 − 8 + 12 = 8。', read='举个例子：b是四、六、四。前代：y一等于四；y二等于六减二，是四；y三等于四减八加十二，是八。'),
    dict(id='C25', pose='claude_point', sub='回代：8x₃ = 8，x₃ = 1；3x₂ + 1 = 4，x₂ = 1；2x₁ + 4 + 2 = 4，x₁ = −1。', read='回代：八x三等于八，x三等于一；三x二加一等于四，x二等于一；二x一加四加二等于四，x一等于负一。'),
    dict(id='C26', pose='claude_explain', sub='消元最费工夫，只做一次；以后每来一个新的 b，只要前代加回代。计算机解方程，用的就是这一套。', read='消元最费工夫，只做一次；以后每来一个新的b，只要前代加回代。计算机解方程，用的就是这一套。'),
    dict(id='D06', mood='think', pose='ds_ask', sub='要是中途主元是 0，必须交换两行呢？', read='要是中途主元是零，必须交换两行呢？'),
    dict(id='C27', pose='claude_think', sub='那就没有这样的 LU 了。比如 [0 1; 1 0]，第一步就必须换行。教材第七章会处理：先把行换好，再分解。', read='那就没有这样的L U了。比如零一、一零，第一步就必须换行。教材第七章会处理：先把行换好，再分解。'),
    dict(id='G02', pose='gpt_proud', sub='同济对照：同济正文不讲 LU 分解，学习辅导里作补充。以后学数值计算，天天都会用到它。', read='同济对照：同济正文不讲L U分解，学习辅导里作补充。以后学数值计算，天天都会用到它。'),
    # —— 总结
    dict(id='D07', mood='easy', pose='ds_happy', sub='我来总结！只用倍加消元，消完是 U；乘子按位置填进去是 L；A = LU。', read='我来总结！只用倍加消元，消完是U；乘子按位置填进去是L；A等于L U。'),
    dict(id='D08', mood='easy', pose='ds_happy', sub='解方程拆成前代加回代，b 换多少次都不怕！', read='解方程拆成前代加回代，b换多少次都不怕！'),
    dict(id='C28', pose='claude_smile', sub='完全正确。下一节，我们把矩阵切成小块，看看块和块怎么相乘。', read='完全正确。下一节，我们把矩阵切成小块，看看块和块怎么相乘。'),
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
