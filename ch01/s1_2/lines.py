# -*- coding: utf-8 -*-
"""第 1 章 §1.2 行阶梯形（Leon 9th §1.2；同济第六版 第三章 §1 行阶梯形 / 行最简形、§3）台词源（唯一真源）。
字段同 s1_1/lines.py。运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_explain', sub='上一节，每一列都能找到不为 0 的主元，消完就是漂亮的三角形。', read='上一节，每一列都能找到不为零的主元，消完就是漂亮的三角形。'),
    dict(id='C02', pose='claude_point', sub='这一节来看不顺利的情况。看这个方程组。'),
    dict(id='C03', pose='claude_explain', sub='写成增广矩阵。第二行减去第一行的 2 倍，第三行减去第一行的 3 倍。', read='写成增广矩阵。第二行减去第一行的两倍，第三行减去第一行的三倍。'),
    dict(id='D01', mood='think', pose='ds_confused', sub='咦，第二列下面全变成 0 了，主元去哪儿找？', read='咦，第二列下面全变成零了，主元去哪儿找？'),
    dict(id='C04', pose='claude_think', sub='找不到就跳过这一列，去下一列找。第三列有个 1，就用它。', read='找不到就跳过这一列，去下一列找。第三列有个一，就用它。'),
    dict(id='C05', pose='claude_point', sub='第三行减去第二行的 2 倍，最后一行整行变成 0。', read='第三行减去第二行的两倍，最后一行整行变成零。'),
    dict(id='C06', pose='claude_explain', sub='看这个形状：每一行的领头数都比上一行更靠右，像台阶。这就是行阶梯形。'),
    dict(id='C07', pose='claude_point', sub='领头 1 所在列的未知数叫首元变量，这里是 x₁ 和 x₃；剩下的 x₂ 叫自由变量。', read='领头的一所在列的未知数，叫首元变量，这里是x一和x三；剩下的x二，叫自由变量。'),
    dict(id='C08', pose='claude_explain', sub='自由变量想取几都行。设 x₂ = t，倒着代回去：x₃ = 1，x₁ = 3 − 2t。', read='自由变量想取几都行。设x二等于t，倒着代回去：x三等于一，x一等于三减二t。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='t 随便取，所以有无穷多个解！', read='t随便取，所以有无穷多个解！'),
    dict(id='C09', pose='claude_think', sub='没错。现在把最后一个常数从 14 改成 15，再消一遍。', read='没错。现在把最后一个常数从十四改成十五，再消一遍。'),
    dict(id='C10', pose='claude_point', sub='最后一行变成 0 0 0 | 1，翻译回方程，就是 0 = 1。', read='最后一行变成零、零、零，竖线，一。翻译回方程，就是零等于一。'),
    dict(id='D03', mood='panic', pose='ds_shock', sub='零等于一？！这不可能啊！'),
    dict(id='C11', pose='claude_smile', sub='对，所以方程组无解。左边全是 0、右边不是 0 的那一行，就是无解的信号。', read='对，所以方程组无解。左边全是零、右边不是零的那一行，就是无解的信号。'),
    dict(id='C12', pose='claude_explain', sub='正式定义：行阶梯形满足三条。第一，每个非零行的第一个非零数是 1。', read='正式定义：行阶梯形满足三条。第一，每个非零行的第一个非零数是一。'),
    dict(id='C13', pose='claude_explain', sub='第二，下一行领头数前面的 0，比上一行多。', read='第二，下一行领头数前面的零，比上一行多。'),
    dict(id='C14', pose='claude_point', sub='第三，全零的行都放在最下面。'),
    dict(id='G01', pose='gpt_cross', sub='注意：同济教材的“行阶梯形矩阵”不要求领头是 1，只要台阶形状对就行。', read='注意：同济教材的行阶梯形矩阵，不要求领头是一，只要台阶形状对就行。'),
    dict(id='C15', pose='claude_explain', sub='用三种行变换把增广矩阵化成行阶梯形，这个过程叫高斯消元法。'),
    dict(id='D04', mood='think', pose='ds_ask', sub='那要是方程个数和未知数个数不一样呢？'),
    dict(id='C16', pose='claude_point', sub='方程比未知数多，叫超定方程组，通常无解：三条直线很难恰好交于一点。'),
    dict(id='C17', pose='claude_explain', sub='方程比未知数少，叫欠定方程组：要么无解，要么无穷多解，绝不会只有一个解。'),
    dict(id='C18', pose='claude_think', sub='最后还能再走一步：把每个领头 1 上方的数也消成 0。', read='最后还能再走一步：把每个领头的一上方的数，也消成零。'),
    dict(id='C19', pose='claude_point', sub='第一行减去第二行，答案直接就能读出来：x₁ = 3 − 2x₂，x₃ = 1。', read='第一行减去第二行，答案直接就能读出来：x一等于三减二倍x二，x三等于一。'),
    dict(id='C20', pose='claude_explain', sub='这叫简化行阶梯形，这个过程叫高斯–若尔当消元。', read='这叫简化行阶梯形，这个过程叫高斯若尔当消元。'),
    dict(id='G02', pose='gpt_proud', sub='在同济教材里，它叫“行最简形矩阵”。', read='在同济教材里，它叫行最简形矩阵。'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='有没有解、有几个解，看台阶就知道了！'),
    dict(id='C21', pose='claude_smile', sub='总结：先化成阶梯形。出现 0 = 1 就无解；否则有自由变量就无穷多解，没有就唯一解。', read='总结：先化成阶梯形。出现零等于一，就无解；否则，有自由变量就无穷多解，没有就是唯一解。'),
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
