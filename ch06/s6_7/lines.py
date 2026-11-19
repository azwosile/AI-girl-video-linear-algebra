# -*- coding: utf-8 -*-
"""第 6 章 6.7 正定矩阵（+ 6.8 点到）（Leon 9th §6.7：例 1–3 A = (4 2 −2; 2 10 2; −2 2 5)，顺序主子式 4、36、108，主元 4、9、3，
L 乘数 ½、−½、⅓，LDLᵀ，Cholesky L₁ = (2 0 0; 1 3 0; −1 1 √3)；定理 6.7.1 五条等价；−I 反例；§6.8 Perron 定理）台词源（唯一真源）。
画面：顺序主子式逐层点亮；消元三步“剥洋葱”；L₁L₁ᵀ 拼回 A。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='上一节说正定看特征值。可三阶以上，特征值往往很难求。这一节给出更快的判别法。', read='上一节说，正定看特征值。可是三阶以上，特征值往往很难求。这一节给出更快的判别法。'),
    dict(id='C02', pose='claude_explain', sub='例 1：A = (4 2 −2; 2 10 2; −2 2 5)。它的特征值不是整数，很难手算。', read='例一：一个三阶对称矩阵，第一行四、二、负二，第二行二、十、二，第三行负二、二、五。它的特征值不是整数，很难手算。'),
    dict(id='C03', pose='claude_point', sub='换个看法：顺序主子式。左上角 1×1 是 4，2×2 是 40 − 4 = 36，3×3 是 det A = 108。全部为正。', read='换一个看法：顺序主子式。左上角一阶的是四，二阶的是四十减四，等于三十六，三阶的就是A的行列式，等于一百零八。全部为正。'),
    dict(id='C04', pose='claude_explain', sub='再做消元：第一行的 ½ 倍从第二行减掉，−½ 倍从第三行减掉；再把第二行的 ⅓ 倍从第三行减掉。主元依次是 4、9、3，全部为正。', read='再做高斯消元：第一行的二分之一倍，从第二行减掉，负二分之一倍，从第三行减掉；再把新的第二行的三分之一倍，从第三行减掉。主元依次是四、九、三，全部为正。'),
    dict(id='D01', mood='think', pose='ds_think', sub='主元 4、9、3，和主子式 4、36、108 有关系吗？', read='主元四、九、三，和主子式四、三十六、一百零八，有关系吗？'),
    dict(id='C05', pose='claude_smile', sub='有。36 = 4×9，108 = 4×9×3。第 k 个顺序主子式，就是前 k 个主元的乘积。', read='有。三十六等于四乘九，一百零八等于四乘九乘三。第k个顺序主子式，就是前k个主元的乘积。'),
    dict(id='C06', pose='claude_explain', sub='消元记录下来就是 A = LU，L 的下三角放乘数 ½、−½、⅓。把 U 的主元提出来，A = LDLᵀ，D = diag(4, 9, 3)。', read='把消元记录下来，就是A等于L U，L的下三角放着乘数：二分之一、负二分之一、三分之一。再把U的主元提出来，A等于L D L的转置，D的对角线是四、九、三。'),
    dict(id='C07', pose='claude_point', sub='主元全正，就能开平方：L₁ = LD^(1/2)，A = L₁L₁ᵀ，这叫 Cholesky 分解。本例 L₁ = (2 0 0; 1 3 0; −1 1 √3)。', read='主元全正，就能开平方：L一等于L乘D的二分之一次方，A等于L一乘L一的转置，这叫乔列斯基分解。本例的L一，第一行二、零、零，第二行一、三、零，第三行负一、一、根号三。'),
    dict(id='C08', pose='claude_explain', sub='定理 6.7.1：对称矩阵 A，五条等价。一，A 正定。二，顺序主子式全正。三，只用第三类行变换消元，主元全正。四，有 Cholesky 分解。五，A = BᵀB，B 可逆。', read='定理六点七点一：对称矩阵A，下面五条等价。一，A正定。二，顺序主子式全正。三，只用第三类行变换消元，主元全正。四，有乔列斯基分解。五，A等于B的转置乘B，B可逆。'),
    dict(id='C09', pose='claude_point', sub='第五条最直观：xᵀBᵀBx = ‖Bx‖²。B 可逆，x 非零时 Bx 也非零，长度平方一定为正。', read='第五条最直观：二次型等于B x的长度平方。B可逆，x非零，B x也非零，长度平方一定为正。'),
    dict(id='D02', mood='think', pose='ds_confused', sub='那我直接看行列式大于零，不就够了？', read='那我直接看行列式大于零，不就够了？'),
    dict(id='C10', pose='claude_smile', sub='不够。比如 −I₂，行列式是 1，可它是负定的。要每一个顺序主子式都为正，缺一不可。', read='不够。比如二阶的负单位矩阵，行列式是一，可它是负定的。要每一个顺序主子式都为正，缺一不可。'),
    dict(id='C11', pose='claude_explain', sub='还有一个陷阱：判断半正定，只看顺序主子式非负是不够的。教材举了反例，要看所有主子式，或者看特征值。', read='还有一个常见陷阱：判断半正定，只看顺序主子式非负，是不够的。教材举了反例，判断半正定，要看所有主子式，或者看特征值。'),
    dict(id='C12', pose='claude_point', sub='Cholesky 在计算里很重要：解正定方程组，它比一般的 LU 快一倍，而且数值稳定，不用选主元。', read='乔列斯基分解在计算里很重要：解正定方程组，它比一般的L U分解快一倍，而且数值稳定，不用选主元。'),
    dict(id='C13', pose='claude_explain', sub='本章最后一节 6.8 非负矩阵，只点一句：元素全为正的矩阵，有一个正的主特征值，和一个分量全为正的特征向量。这就是 Perron 定理。', read='本章的最后一节，六点八，非负矩阵，我们只点一句：元素全为正的矩阵，有一个正的主特征值，以及一个分量全为正的特征向量。这就是佩龙定理。'),
    dict(id='C14', pose='claude_point', sub='它保证了经济学里投入产出模型有合理的解，也解释了马尔可夫链、网页排名为什么能收敛到正的稳态。', read='它保证了经济学里的投入产出分析有合理的解，也解释了，为什么马尔可夫链和网页排名，能收敛到一个正的稳态。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='原来前面的稳态向量，背后是 Perron 定理撑腰！', read='原来前面的稳态向量，背后是佩龙定理撑腰！'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济第五章第七节，正定判定写成赫尔维茨定理：各阶顺序主子式都为正；负定则奇数阶为负、偶数阶为正。', read='同济对照：同济第五章第七节，正定的判定写成赫尔维茨定理：对称阵A正定，等价于各阶顺序主子式都为正；负定，则奇数阶为负，偶数阶为正。'),
    dict(id='G02', pose='gpt_point', sub='同济经典含参题：f = x₁² + x₂² + 5x₃² + 2ax₁x₂ − 2x₁x₃ + 4x₂x₃。主子式 1、1 − a²、−a(5a + 4) 都要大于零，解出 −4/5 < a < 0。', read='同济的经典含参题：一个三元二次型，交叉项里带着参数a。顺序主子式分别是一、一减a平方、负a乘五a加四，都要大于零，解出a在负五分之四和零之间。'),
    dict(id='C15', pose='claude_explain', sub='小结：判断正定有五条等价路线。手算最快是顺序主子式或消元主元；Cholesky 是 LDLᵀ 再开平方；行列式为正不足以判定。', read='小结：判断正定，有五条等价的路线。手算最快的，是顺序主子式，或者消元的主元；乔列斯基分解，是L D L转置再开平方；行列式为正，不足以判定。'),
    dict(id='C16', pose='claude_point', sub='第六章正文就到这里。接下来两段复习：先做十道判断题。', read='第六章的正文就到这里。接下来两段复习：先做十道判断题。'),
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
