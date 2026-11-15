# -*- coding: utf-8 -*-
"""第 2 章 复习（下）期中真题 + Leon Chapter 2 Test B（北京交通大学 线性代数 历年期中卷，只挑行列式题）台词源（唯一真源）。
题源（宿主 参考书籍和PPT/线代期中/ 与 解析/，数字全部用 sympy 复核）：
  套路一 拆乘积：Leon Test B 1（det A = 4、det B = 6、E 交换型）；2018-2019 第 4 题（E 倍加、A = (0,0,2;0,3,1;4,0,8)）；2017-2018 第 1(iii) 题（|5AᵀA*A⁻¹|）
  套路二 含参数：Leon Test B 2（x³ − x）；2018-2019 第 6 题（(λ − 6)(λ + 1)，λ = 1 时 Cramer）
  套路三 看结构：2015-2016 第 1 题（等差行 ⇒ det = 0；adj A）
  套路四 余子式组合：2021-2022 第 5 题（范德蒙德 −48；A31 + 2A32 + 3A33 + 4A34 = 12）
  GPT 快招：2023-2024 第 8(ii) 题（A² − A − 2I = O ⇒ 非奇异）
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼：panic/think/daily/sigh/easy）、pose（立绘差分）
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='判断题被虐了，这次是期中真题，我要报仇！'),
    dict(id='C01', pose='claude_smile', sub='好。这一节做期中卷里的行列式题，再加上教材的 B 组测试。一共四个套路。', read='好。这一节做期中卷里的行列式题，再加上教材的B组测试。一共四个套路。'),
    # —— 套路一：拆乘积
    dict(id='C02', pose='claude_point', sub='套路一：拆乘积。教材的题：A、B 都是 3 阶，det A = 4，det B = 6，E 是交换两行的初等矩阵。', read='套路一：拆乘积。先做教材的题：A和B都是三阶矩阵，A的行列式是四，B的行列式是六，E是交换两行的初等矩阵。'),
    dict(id='C03', pose='claude_point', sub='求三个值：det(½A)，det(B⁻¹Aᵀ)，det(EA²)。', read='求三个值：二分之一A的行列式，B逆乘A转置的行列式，E乘A方的行列式。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='第一个简单！二分之一乘四，等于二！'),
    dict(id='C04', pose='claude_think', sub='又掉进判断题第 3 题的坑了。3 阶矩阵，每一行都提出一个 ½：(½)³ × 4 = ½。', read='又掉进判断题第三题的坑了。三阶矩阵，每一行都提出一个二分之一：二分之一的三次方乘四，等于二分之一。'),
    dict(id='D03', mood='think', pose='ds_think', sub='那第二个：B⁻¹ 的行列式是 1/6，Aᵀ 还是 4，乘起来 2/3！', read='那第二个：B逆的行列式是六分之一，A转置还是四，乘起来是三分之二！'),
    dict(id='C05', pose='claude_smile', sub='对。第三个：E 交换两行，det E = −1；det(A²) = 16。答案 −16。', read='对。第三个：E交换两行，行列式是负一；A方的行列式是十六。所以答案是负十六。'),
    dict(id='C06', pose='claude_point', sub='2018-2019 期中第 4 题和它差不多：E 把第 2 行的 3 倍加到第 3 行，A = (0, 0, 2; 0, 3, 1; 4, 0, 8)。求 det(EA) 和 |3A⁻¹|。', read='期中卷二零一八到二零一九学年的第四题，和它差不多：E把第二行的三倍加到第三行，A的三行是零、零、二，零、三、一，四、零、八。求E A的行列式，和三倍A逆的行列式。'),
    dict(id='C07', pose='claude_explain', sub='按第一行展开，只剩 2 那一项：2 × (0 − 12) = −24。倍加不改行列式，det(EA) 也是 −24。', read='按第一行展开，只剩二那一项：二乘括号零减十二，等于负二十四。倍加不改变行列式，所以E A的行列式也是负二十四。'),
    dict(id='C08', pose='claude_point', sub='|3A⁻¹| = 3³ / det A = 27 / (−24) = −9/8。', read='三倍A逆的行列式，等于三的三次方除以A的行列式，二十七除以负二十四，等于负八分之九。'),
    dict(id='C09', pose='claude_point', sub='2017-2018 卷更狠：3 阶，|A| = 4，求 |5AᵀA*A⁻¹|。A* 是伴随矩阵。', read='二零一七到二零一八学年的卷子更狠：三阶矩阵，A的行列式是四，求五倍A转置、乘A星、乘A逆的行列式。A星就是伴随矩阵。'),
    dict(id='D04', mood='panic', pose='ds_shock', sub='伴随矩阵的行列式？没学过啊！'),
    dict(id='C10', pose='claude_explain', sub='用上一节的 AA* = |A|E。两边取行列式：4 · |A*| = 4³，所以 |A*| = 4² = 16。', read='用上一节的公式：A乘A星，等于A的行列式乘E。两边取行列式，左边是四乘A星的行列式，右边是四的三次方。所以A星的行列式，等于四的平方，十六。'),
    dict(id='C11', pose='claude_point', sub='拆开：5³ × 4 × 16 × ¼ = 2000。', read='拆开：五的三次方，乘四，乘十六，乘四分之一，等于两千。'),
    dict(id='G01', pose='gpt_explain', sub='记住三个指数陷阱：数乘是 cⁿ，伴随是 |A|ⁿ⁻¹，求逆是倒数。', read='记住三个指数陷阱：数乘是c的n次方，伴随是A的行列式的n减一次方，求逆是倒数。'),
    # —— 套路二：含参数
    dict(id='C12', pose='claude_point', sub='套路二：含参数的行列式。教材 B 组第 2 题：A = (x, 1, 1; 1, x, −1; −1, −1, x)，x 取什么值时 A 奇异？', read='套路二：含参数的行列式。教材B组第二题：A的三行是x、一、一，一、x、负一，负一、负一、x。问x取什么值时，A奇异。'),
    dict(id='D05', mood='think', pose='ds_think', sub='奇异就是行列式等于 0……我先展开。', read='奇异就是行列式等于零……我先展开。'),
    dict(id='C13', pose='claude_explain', sub='按第一行展开：x(x² − 1) − (x − 1) + (x − 1) = x³ − x。后两项正好抵消。', read='按第一行展开：x乘括号x方减一，减去括号x减一，再加上括号x减一，等于x的三次方减x。后两项正好抵消。'),
    dict(id='C14', pose='claude_point', sub='x³ − x = x(x − 1)(x + 1)，所以 x = 0、1、−1 时 A 奇异。', read='x的三次方减x，等于x乘x减一乘x加一，所以x等于零、一、负一时，A奇异。'),
    dict(id='C15', pose='claude_point', sub='2018-2019 第 6 题：(2 − λ)x₁ + 4x₂ = 0，3x₁ + (3 − λ)x₂ = 1。什么时候有唯一解？', read='二零一八到二零一九学年第六题：方程组第一个是，二减拉姆达乘x一，加四x二，等于零；第二个是，三x一，加三减拉姆达乘x二，等于一。什么时候有唯一解？'),
    dict(id='C16', pose='claude_explain', sub='唯一解 ⇔ 系数行列式 ≠ 0：(2 − λ)(3 − λ) − 12 = λ² − 5λ − 6 = (λ − 6)(λ + 1)。所以 λ ≠ 6 且 λ ≠ −1。', read='唯一解，等价于系数行列式不为零：二减拉姆达乘三减拉姆达，减十二，等于拉姆达方减五拉姆达减六，也就是拉姆达减六，乘拉姆达加一。所以拉姆达不等于六，也不等于负一。'),
    dict(id='C17', pose='claude_point', sub='λ = 1 时用克拉默：系数行列式 = −10；x₁ = −4 / −10 = 2/5，x₂ = 1 / −10 = −1/10。', read='拉姆达等于一时，用克拉默法则：系数行列式是负十；x一等于负四除以负十，五分之二；x二等于一除以负十，负十分之一。'),
    dict(id='D06', mood='easy', pose='ds_proud', sub='我来验算：2/5 + 4 × (−1/10) = 0，3 × 2/5 + 2 × (−1/10) = 1。对了！', read='我来验算：五分之二加四乘负十分之一，等于零；三乘五分之二加二乘负十分之一，等于一。对了！'),
    # —— 套路三：看结构
    dict(id='C18', pose='claude_point', sub='套路三：先看结构，别急着算。2015-2016 第 1 题：A = (1, 2, 3; 2, 3, 4; 3, 4, 5)，求 det A 和 adj A。', read='套路三：先看结构，别急着算。二零一五到二零一六学年第一题：A的三行是一、二、三，二、三、四，三、四、五。求A的行列式和伴随矩阵。'),
    dict(id='D07', mood='think', pose='ds_think', sub='三阶，用对角线法则，六项……'),
    dict(id='C19', pose='claude_smile', sub='等一下，先看看这三行：第 3 行减第 2 行，等于第 2 行减第 1 行。', read='等一下，先看看这三行：第三行减第二行，等于第二行减第一行。'),
    dict(id='C20', pose='claude_explain', sub='所以 r₁ − 2r₂ + r₃ = 0：三行线性相关，平行六面体被压扁，det A = 0。', read='所以第一行减两倍第二行，再加第三行，等于零。三行线性相关，平行六面体被压扁，行列式是零。'),
    dict(id='C21', pose='claude_point', sub='伴随矩阵还是要算九个代数余子式：adj A = (−1, 2, −1; 2, −4, 2; −1, 2, −1)。', read='伴随矩阵还是要算九个代数余子式，结果三行是：负一、二、负一，二、负四、二，负一、二、负一。'),
    dict(id='G02', pose='gpt_point', sub='验算：A · adj A 应该等于 det A · I，也就是零矩阵。比如 (1, 2, 3) · (−1, 2, −1) = 0 ✓。', read='验算一下：A乘伴随矩阵，应该等于A的行列式乘单位矩阵，也就是零矩阵。比如第一行一、二、三，点乘第一列负一、二、负一，等于零。'),
    # —— 套路四：余子式组合
    dict(id='C22', pose='claude_point', sub='套路四：代数余子式的组合。2021-2022 第 5 题：4 阶 A 的四行是 (1,1,1,1)、(1,2,4,8)、(1,3,9,27)、(1,−1,1,−1)。求 det A 和 A₃₁ + 2A₃₂ + 3A₃₃ + 4A₃₄。', read='套路四：代数余子式的组合。二零二一到二零二二学年第五题：四阶矩阵，四行分别是一、一、一、一，一、二、四、八，一、三、九、二十七，一、负一、一、负一。求A的行列式，和A三一加二A三二加三A三三加四A三四。'),
    dict(id='C23', pose='claude_explain', sub='每一行都是 (1, x, x², x³)，x 取 1、2、3、−1。这是范德蒙德行列式：所有“后减前”乘起来，得 −48。', read='每一行都是一、x、x方、x三次方，x分别取一、二、三、负一。这是范德蒙德行列式：把所有后面减前面的结果乘起来，等于负四十八。'),
    dict(id='D08', mood='panic', pose='ds_shock', sub='那第二问要算四个三阶行列式？'),
    dict(id='C24', pose='claude_smile', sub='不用。按第 3 行展开，det A = a₃₁A₃₁ + … + a₃₄A₃₄。把第 3 行换成 (1, 2, 3, 4)，这些代数余子式都不变，展开出来正好是要求的组合。', read='不用。按第三行展开，行列式等于第三行的元素乘各自的代数余子式，再相加。把第三行换成一、二、三、四，这些代数余子式都不变，展开出来正好就是要求的组合。'),
    dict(id='C25', pose='claude_point', sub='新的行列式算出来是 12。套路：把系数换进那一行，再算一个行列式。', read='新的行列式算出来是十二。套路就是：把系数换进那一行，再算一个行列式。'),
    dict(id='G03', pose='gpt_explain', sub='最后一道快招，2023-2024 卷：A² − A − 2I = O，证明 A 非奇异。写成 A(A − I) = 2I，两边取行列式：det A · det(A − I) = 2ⁿ ≠ 0。', read='最后一道快招，二零二三到二零二四学年的卷子：A方减A减二I等于零，证明A非奇异。先写成：A乘括号A减I，等于二I。两边取行列式：右边是二的n次方，不等于零。所以左边每个因子都不为零，A非奇异。'),
    # —— 总结
    dict(id='D09', mood='easy', pose='ds_proud', sub='我来总结！拆乘积记指数；含参数令行列式为 0；先看结构再动笔；余子式组合就换行！', read='我来总结！拆乘积要记指数；含参数就令行列式等于零；先看结构再动笔；余子式组合就换掉那一行！'),
    dict(id='C26', pose='claude_smile', sub='很好。第二章到这里全部结束。下一章，我们进入向量空间。'),
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
