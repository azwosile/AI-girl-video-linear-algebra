# -*- coding: utf-8 -*-
"""第 1 章 复习（上）判断题（Leon 9th Chapter 1 Test A，True or False：选 9 题——1 自由变量、5 (A+B)⁻¹、7 (A−B)²、8 消去律、
9 AB = O、6 A = A⁻¹、10 列相关 ⇒ 奇异、14 初等矩阵之积、15 外积的行阶梯形；第 2 题齐次相容由 GPT 顺带）台词源（唯一真源）。
形式：大肥鱼先答 → 翻车 → Claude 给反例 / 理由（尽量配 3B1B 画面）→ GPT 快招。期中真题另起一段（s1_xb）。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='第一章学完了！我觉得我无敌了，来考我！'),
    dict(id='C01', pose='claude_smile', sub='好。教材每章末尾都有判断题：永远成立就判“对”并说明理由；不一定成立，就举一个反例。', read='好。教材每章末尾都有判断题：永远成立，就判对，并说明理由；不一定成立，就举一个反例。'),
    dict(id='C02', pose='claude_explain', sub='举反例是线代最重要的本事之一：只要一个例子不成立，整句话就是错的。我们挑九道。', read='举反例是线代最重要的本事之一：只要一个例子不成立，整句话就是错的。我们挑九道。'),
    # 1
    dict(id='C03', pose='claude_point', sub='第 1 题：如果 A 的简化行阶梯形里有自由变量，那么 Ax = b 一定有无穷多解。', read='第一题：如果A的简化行阶梯形里有自由变量，那么A x等于b，一定有无穷多解。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='自由变量能随便取，当然无穷多解！对！', read='自由变量能随便取，当然无穷多解！对！'),
    dict(id='C04', pose='claude_think', sub='错。前提是方程组本来就有解。比如 x + y = 1 和 x + y = 2：有自由变量，可两个方程互相矛盾，一个解都没有。', read='错。前提是方程组本来就有解。比如x加y等于一，和x加y等于二：有自由变量，可两个方程互相矛盾，一个解都没有。'),
    dict(id='G01', pose='gpt_explain', sub='顺带一句：齐次方程组永远有解，因为零向量总是一个解。所以“齐次方程组都相容”是对的。', read='顺带一句：齐次方程组永远有解，因为零向量总是一个解。所以，齐次方程组都相容，是对的。'),
    # 5
    dict(id='C05', pose='claude_point', sub='第 2 题：A 和 B 都可逆，那么 A + B 也可逆，而且 (A + B)⁻¹ = A⁻¹ + B⁻¹。', read='第二题：A和B都可逆，那么A加B也可逆，而且A加B的逆，等于A逆加B逆。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='看着很对称，对！', read='看着很对称，对！'),
    dict(id='C06', pose='claude_explain', sub='错。取 A = I，B = −I，两个都可逆，可 A + B 是零矩阵，根本没有逆。', read='错。取A等于I，B等于负I，两个都可逆，可A加B是零矩阵，根本没有逆。'),
    # 7
    dict(id='C07', pose='claude_point', sub='第 3 题：(A − B)² = A² − 2AB + B²。', read='第三题：A减B的平方，等于A方减二A B加B方。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='完全平方公式，初中就学过！对！', read='完全平方公式，初中就学过！对！'),
    dict(id='C08', pose='claude_think', sub='错。展开是 A² − AB − BA + B²。只有 AB = BA 时，中间两项才能合并成 2AB。而矩阵乘法一般不能交换。', read='错。展开是A方减A B减B A加B方。只有A B等于B A的时候，中间两项才能合并成二A B。而矩阵乘法一般不能交换。'),
    # 8
    dict(id='C09', pose='claude_point', sub='第 4 题：如果 AB = AC，而且 A 不是零矩阵，那么 B = C。', read='第四题：如果A B等于A C，而且A不是零矩阵，那么B等于C。'),
    dict(id='D05', mood='think', pose='ds_confused', sub='两边约掉 A……对吧？', read='两边约掉A……对吧？'),
    dict(id='C10', pose='claude_explain', sub='错。A = [1 0; 0 0] 把平面压到横轴上，竖直方向的信息全丢了。B、C 只要第一行相同，乘上 A 以后就一样。', read='错。A等于一零、零零，它把平面压到横轴上，竖直方向的信息全丢了。B和C只要第一行相同，乘上A以后就一样。'),
    dict(id='C11', pose='claude_smile', sub='能不能约掉，要看 A 可不可逆：A 可逆，两边左乘 A⁻¹，才能约掉。', read='能不能约掉，要看A可不可逆：A可逆，两边左乘A逆，才能约掉。'),
    # 9
    dict(id='C12', pose='claude_point', sub='第 5 题：如果 AB = O，那么 BA = O。', read='第五题：如果A B等于零矩阵，那么B A也等于零矩阵。'),
    dict(id='D06', mood='think', pose='ds_ask', sub='这题我学乖了……错？', read='这题我学乖了……错？'),
    dict(id='C13', pose='claude_explain', sub='答对了。A = [0 1; 0 0]，B = [1 0; 0 0]。AB 是零矩阵，BA 却是 [0 1; 0 0]。', read='答对了。A等于零一、零零，B等于一零、零零。A B是零矩阵，B A却是零一、零零。'),
    # 6
    dict(id='C14', pose='claude_point', sub='第 6 题：如果 A = A⁻¹，那么 A 只能是 I 或 −I。', read='第六题：如果A等于自己的逆，那么A只能是I，或者负I。'),
    dict(id='D07', mood='think', pose='ds_ask', sub='一个数等于自己的倒数，只能是 1 或 −1。所以……对？', read='一个数等于自己的倒数，只能是一或者负一。所以……对？'),
    dict(id='C15', pose='claude_think', sub='错。想想交换两行的初等矩阵：沿 y = x 翻折，再翻一次就回来了。它的逆就是它自己，却既不是 I 也不是 −I。', read='错。想想交换两行的初等矩阵：沿着y等于x翻折，再翻一次就回来了。它的逆就是它自己，却既不是I，也不是负I。'),
    # 10
    dict(id='C16', pose='claude_point', sub='第 7 题：3×3 矩阵 A 的列满足 a₁ + 2a₂ − a₃ = 0，那么 A 一定奇异。', read='第七题：三阶矩阵A的列满足：a一加二倍a二减a三等于零，那么A一定奇异。'),
    dict(id='D08', mood='sigh', pose='ds_confused', sub='这……看不出来。', read='这……看不出来。'),
    dict(id='C17', pose='claude_explain', sub='对。把它写成矩阵形式：A(1, 2, −1) = 0。Ax = 0 有了非零解，根据定理 1.5.2，A 不可逆。', read='对。把它写成矩阵形式：A乘一、二、负一，等于零向量。A x等于零有了非零解，根据定理一点五点二，A不可逆。'),
    dict(id='C18', pose='claude_smile', sub='几何上：三列落在同一个平面里，整个空间被压扁，当然撤不回来。', read='几何上：三列落在同一个平面里，整个空间被压扁，当然撤不回来。'),
    # 14
    dict(id='C19', pose='claude_point', sub='第 8 题：两个初等矩阵的乘积，还是初等矩阵。', read='第八题：两个初等矩阵的乘积，还是初等矩阵。'),
    dict(id='D09', mood='easy', pose='ds_happy', sub='初等乘初等，还是初等，对！', read='初等乘初等，还是初等，对！'),
    dict(id='C20', pose='claude_explain', sub='错。初等矩阵只做一次行变换，两个相乘就是两次。比如两个倍加矩阵相乘，得到 [1 1; 2 3]，一次行变换做不到。', read='错。初等矩阵只做一次行变换，两个相乘就是两次。比如两个倍加矩阵相乘，得到一一、二三，一次行变换做不到。'),
    # 15
    dict(id='C21', pose='claude_point', sub='最后一题：x、y 都是非零向量，A = xyᵀ，那么 A 的行阶梯形恰好有一个非零行。', read='最后一题：x和y都是非零向量，A等于x乘y转置，那么A的行阶梯形，恰好有一个非零行。'),
    dict(id='D10', mood='think', pose='ds_ask', sub='外积！上一节说外积的每一行都是 yᵀ 的倍数……所以对！', read='外积！上一节说，外积的每一行，都是y转置的倍数……所以对！'),
    dict(id='C22', pose='claude_smile', sub='对，理由也说到点子上了：每行都是 yᵀ 的倍数，其他行都能消成零；x、y 都不是零，至少留下一行。', read='对，理由也说到点子上了：每一行都是y转置的倍数，其他行都能消成零；x和y又不是零，至少留下一行。'),
    # 收尾
    dict(id='D11', mood='sigh', pose='ds_confused', sub='九道题，我只答对了两道……', read='九道题，我只答对了两道……'),
    dict(id='C23', pose='claude_explain', sub='你错的几题有个共同点：把数的规律直接搬到矩阵上。矩阵乘法不能交换，也不能随便约掉，这两条要记牢。', read='你错的几题有个共同点：把数的规律，直接搬到矩阵上。矩阵乘法不能交换，也不能随便约掉，这两条要记牢。'),
    dict(id='G02', pose='gpt_proud', sub='考试技巧：判断题先找反例。最好用的是二阶小矩阵，像 [0 1; 0 0] 这种，几秒钟就能试出来。', read='考试技巧：判断题先找反例。最好用的是二阶小矩阵，像零一、零零这种，几秒钟就能试出来。'),
    dict(id='D12', mood='easy', pose='ds_happy', sub='记住了！先找反例，二阶矩阵最好用！', read='记住了！先找反例，二阶矩阵最好用！'),
    dict(id='C24', pose='claude_smile', sub='很好。下一集，我们去做真正的期中考试题。', read='很好。下一集，我们去做真正的期中考试题。'),
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
