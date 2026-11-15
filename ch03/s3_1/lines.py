# -*- coding: utf-8 -*-
"""第 3 章 3.1 向量空间是什么（Leon 9th §3.1 Definition and Examples）台词源（唯一真源）。
主线：能加、能数乘、守八条规矩 → 都叫向量。例：ℝⁿ、ℝ^{m×n}、P_n、C[a,b]；定理 3.1.1；反例 α∘(x₁,x₂) = (αx₁, x₂) 违反 A6。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='前两章的向量，要么是箭头，要么是一列数。这还有什么好讲的？'),
    dict(id='C01', pose='claude_smile', sub='这一章我们反过来问：到底什么东西，有资格叫“向量”？', read='这一章我们反过来问：到底什么东西，有资格被叫作向量？'),
    dict(id='C02', pose='claude_explain', sub='先看我们一直在对向量做的两件事：两个向量相加；一个向量乘上一个数。'),
    dict(id='C03', pose='claude_point', sub='箭头相加，是首尾相接；乘上一个数，是把箭头拉长、缩短，或者反向。'),
    dict(id='C04', pose='claude_explain', sub='数组也一样：对应位置相加；每个位置都乘上同一个数。'),
    dict(id='C05', pose='claude_point', sub='关键在这里：加完、乘完，得到的还是同一类东西。这叫“封闭”。', read='关键在这里：不管是箭头还是数组，加完、乘完，得到的还是同一类东西。这叫作封闭。'),
    dict(id='D02', mood='think', pose='ds_think', sub='那是不是能加、能数乘，就可以叫向量了？'),
    dict(id='C06', pose='claude_think', sub='还要加得规矩。教材把这些规矩写成了八条公理。'),
    dict(id='C07', pose='claude_explain', sub='A1 到 A4 管加法：交换律、结合律、有零向量、每个向量都有负向量。', read='前四条管加法：可以交换，可以结合，有一个零向量，每个向量还都有一个负向量，和它相加等于零。'),
    dict(id='C08', pose='claude_explain', sub='A5 到 A8 管数乘：两种分配律；α(βx) = (αβ)x；1·x = x。', read='后四条管数乘：数乘对向量的加法可以分配，对数的加法也可以分配；先乘贝塔、再乘阿尔法，等于直接乘阿尔法贝塔；最后，乘以一，向量不变。'),
    dict(id='D03', mood='sigh', pose='ds_confused', sub='八条……考试要背吗？', read='八条啊，考试的时候要背吗？'),
    dict(id='C09', pose='claude_smile', sub='不用死背。记住一句话：平时对数组做运算的那些习惯，在这里都得照样成立。', read='不用死背。你只要记住一句话：平时对数组做运算的那些习惯，在这里都得照样成立。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：满足八条的集合，同济叫“线性空间”，放在第六章；教材第三章一开头就讲。', read='补充一下同济的叫法：满足这八条的集合，同济叫线性空间，放在第六章；我们的教材，第三章一开头就讲。'),
    dict(id='C10', pose='claude_point', sub='来看有哪些东西满足这八条。第一个，老朋友 ℝⁿ。', read='来看看，有哪些东西满足这八条。第一个，老朋友，R n。'),
    dict(id='C11', pose='claude_explain', sub='第二个，所有 m×n 矩阵，记作 ℝ^(m×n)：对应元素相加，每个元素乘同一个数。', read='第二个，所有m行n列的矩阵，记作R m乘n。对应元素相加，每个元素都乘同一个数，八条公理全部成立。'),
    dict(id='C12', pose='claude_point', sub='第三个，次数小于 n 的多项式，记作 Pₙ。相加，就是同类项的系数相加。', read='第三个，次数小于n的多项式，记作P n。两个多项式相加，就是同类项的系数相加。'),
    dict(id='D04', mood='think', pose='ds_ask', sub='多项式也算向量？它又不是箭头。'),
    dict(id='C13', pose='claude_explain', sub='把系数排成一列，箭头就出来了。P₃ 里的 2x² + 3x − 1，对应一列数：2、3、−1。', read='把系数排成一列，箭头就出来了。比如P三里的多项式，二x的平方，加三x，减一。按顺序把系数排成一列：二、三、负一。'),
    dict(id='C14', pose='claude_point', sub='第四个更大胆：区间 [a, b] 上所有连续函数，记作 C[a, b]。函数相加，就是每一点的函数值相加。', read='第四个更大胆：区间a到b上所有的连续函数，记作C a b。两个函数相加，就是在每一个点上，把函数值相加。'),
    dict(id='C15', pose='claude_explain', sub='可以把函数想成有无穷多个分量的向量：每一个 x，都对应一个分量。', read='你可以把函数想成一个有无穷多个分量的向量：每一个x，都对应一个分量。'),
    dict(id='G02', pose='gpt_point', sub='所以，向量长什么样不重要；重要的是：能相加、能数乘，而且守这八条规矩。'),
    dict(id='C16', pose='claude_explain', sub='有了公理，就能证明一些“显然”的结论。定理 3.1.1 第一条：0 乘任何向量，都得零向量。', read='有了公理，就能证明一些看起来显然的结论。教材定理三点一点一，第一条：数零乘任何向量，都得零向量。'),
    dict(id='C17', pose='claude_point', sub='证明三步：0x = (0 + 0)x；分配律拆成 0x + 0x；两边加上 0x 的负向量，就得到 0 = 0x。', read='证明只要三步：零x，等于零加零，再乘x；按分配律拆开，是零x加零x；两边同时加上零x的负向量，就得到零向量等于零x。'),
    dict(id='C18', pose='claude_explain', sub='第二条：x + y = 0，则 y 就是 x 的负向量；第三条：(−1)x = −x。', read='第二条：如果x加y等于零，那么y就是x的负向量。第三条：负一乘x，正好等于x的负向量。'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='这些不都是废话嘛。', read='这些不都是废话嘛。'),
    dict(id='C19', pose='claude_smile', sub='在 ℝⁿ 里是废话；可在一个陌生的集合里，都得靠公理来保证。下面就来一个陌生的。', read='在R n里是废话；可是在一个陌生的集合里，这些都得靠公理来保证。下面就来看一个陌生的。'),
    dict(id='C20', pose='claude_point', sub='V = ℝ²，加法照常，数乘改成：α∘(x₁, x₂) = (αx₁, x₂)，第二个分量保持不动。', read='平面上的点对，加法照常，但数乘改成：阿尔法乘第一个分量，第二个分量保持不动。'),
    dict(id='D06', mood='easy', pose='ds_proud', sub='加完是点对，乘完也是点对，封闭！是向量空间！', read='加完是点对，乘完也是点对，封闭的！所以是向量空间！'),
    dict(id='C21', pose='claude_think', sub='封闭没问题。取 x = (1, 1)，α = β = 1，检查第六条：(α + β)∘x = α∘x + β∘x。', read='封闭确实没问题。我们取x等于一、一，阿尔法和贝塔都取一，来检查第六条公理。'),
    dict(id='C22', pose='claude_explain', sub='左边：2∘(1, 1) = (2, 1)。右边：(1, 1) + (1, 1) = (2, 2)。', read='左边：二乘x，第一个分量变成二，第二个不动，得到二、一。右边：一乘x加一乘x，就是一、一加一、一，等于二、二。'),
    dict(id='C23', pose='claude_point', sub='(2, 1) ≠ (2, 2)，A6 不成立，它不是向量空间。封闭只是入场券，八条一条都不能少。', read='二、一不等于二、二，第六条不成立，所以它不是向量空间。封闭只是入场券，八条公理一条都不能少。'),
    dict(id='G03', pose='gpt_explain', sub='期中考试常考这种题：先查封闭，再找一条被破坏的公理，代入具体数字。', read='期中考试常考这种题：先查封闭，再找一条被破坏的公理，代入具体的数字。'),
    dict(id='D07', mood='sigh', pose='ds_confused', sub='好吧，我又抢答失败了。'),
    dict(id='C24', pose='claude_smile', sub='下一节，我们在向量空间里面，找更小的向量空间：子空间。'),
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
