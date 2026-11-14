# -*- coding: utf-8 -*-
"""第 1 章 复习（下）期中真题（北京交通大学 几何与代数(B) / 线性代数 历年期中卷，只挑第一章能做的题）台词源（唯一真源）。
题源（宿主 参考书籍和PPT/线代期中/ 与 解析/）：
  第 1 题 = 2025-2026 第 2 题（含参数方程组；原卷用行列式，这里只用第一章的消元）
  第 2 题 = 2025-2026 第 3 题（LU 分解 + 初等矩阵表示）
  第 3 题 = 2017-2018 第 2 题（A³ + A² − 3I = O ⇒ A 非奇异）＋ 2025-2026 第 1(5) 题（AB = 4I）
形式：大肥鱼先做 → 翻车 → Claude 讲（配 3B1B 画面）→ GPT 快招。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='期中真题来了！这次我一定不翻车。'),
    dict(id='C01', pose='claude_smile', sub='这些是北京交通大学历年的线代期中卷。第一章能考的，几乎年年都是三类：含参数的方程组、LU 分解、证明矩阵可逆。', read='这些是北京交通大学历年的线代期中卷。第一章能考的，几乎年年都是三类：含参数的方程组、L U分解、证明矩阵可逆。'),
    # ── 第 1 题 ──
    dict(id='C02', pose='claude_point', sub='第 1 题，2025 年的卷子。三列 α₁、α₂、α₃ 拼成 A，α₂ 里藏着一个参数 α，右边 b 里藏着 β。', read='第一题，二零二五年的卷子。三列，阿尔法一、阿尔法二、阿尔法三，拼成A。阿尔法二里藏着一个参数阿尔法，右边b里藏着贝塔。'),
    dict(id='C03', pose='claude_explain', sub='问：α 取什么值，A 可逆？α、β 取什么值，Ax = b 有无穷多解？', read='问：阿尔法取什么值，A可逆？阿尔法、贝塔取什么值，A x等于b有无穷多解？'),
    dict(id='D02', mood='think', pose='ds_ask', sub='先消元！R₂ − R₁，第二行的主元是 α − 2……所以 α = 2 的时候不可逆！', read='先消元！第二行减第一行，第二行的主元是阿尔法减二……所以阿尔法等于二的时候，不可逆！'),
    dict(id='C04', pose='claude_think', sub='别急着下结论。α − 2 是零，不代表这一列没有主元，下面的行还可能补上。把消元做完。', read='别急着下结论。阿尔法减二是零，不代表这一列没有主元，下面的行还可能补上。把消元做完。'),
    dict(id='C05', pose='claude_explain', sub='R₃ − 2R₁，再 R₃ + R₂。第三行变成：零、α − 8、零，右边 β − 1。', read='第三行减二倍第一行，再加上第二行。第三行变成：零、阿尔法减八、零，右边贝塔减一。'),
    dict(id='C06', pose='claude_point', sub='如果 α ≠ 8，第三行在第二列有主元，第二行的 2 就是第三列的主元。三个主元齐了，A 可逆，解唯一。', read='如果阿尔法不等于八，第三行在第二列有主元，第二行的二，就是第三列的主元。三个主元齐了，A可逆，解唯一。'),
    dict(id='C07', pose='claude_explain', sub='如果 α = 8，第三行左边全是零，只剩 0 = β − 1。β ≠ 1 就矛盾，无解；β = 1 才有解，而且有一个自由变量，无穷多解。', read='如果阿尔法等于八，第三行左边全是零，只剩零等于贝塔减一。贝塔不等于一，就矛盾，无解；贝塔等于一，才有解，而且有一个自由变量，无穷多解。'),
    dict(id='D03', mood='sigh', pose='ds_confused', sub='原来临界值是 8，不是 2……', read='原来临界值是八，不是二……'),
    dict(id='C08', pose='claude_smile', sub='几何上看更清楚。α = 8 时，α₂ = −α₁ + 3α₃：三列躺进同一个平面，空间被压扁，A 不可逆。', read='几何上看更清楚。阿尔法等于八的时候，阿尔法二等于负阿尔法一加三倍阿尔法三：三列躺进同一个平面，空间被压扁，A不可逆。'),
    dict(id='C09', pose='claude_explain', sub='这时 Ax = b 要有解，b 也必须落在这个平面里。算一下，b = ½α₁ + ½α₃，第三个分量正好要求 β = 1。', read='这时A x等于b要有解，b也必须落在这个平面里。算一下，b等于二分之一阿尔法一，加二分之一阿尔法三，第三个分量正好要求贝塔等于一。'),
    dict(id='C10', pose='claude_point', sub='通解：特解 (½, 0, ½)，加上 t 倍的 (1, 1, −3)。后面这个方向，就是 α₁ + α₂ − 3α₃ = 0 给的。', read='通解：特解二分之一、零、二分之一，加上t倍的一、一、负三。后面这个方向，就是阿尔法一加阿尔法二减三倍阿尔法三等于零给的。'),
    dict(id='G01', pose='gpt_explain', sub='提醒：原卷第一问用行列式算，得 16 − 2α。行列式是第二章的内容，结论一样：α ≠ 8。', read='提醒：原卷第一问用行列式算，得十六减二阿尔法。行列式是第二章的内容，结论一样：阿尔法不等于八。'),
    # ── 第 2 题 ──
    dict(id='C11', pose='claude_point', sub='第 2 题，同一张卷子：求这个 A 的 LU 分解，再把 A 写成初等矩阵和 U 的乘积。', read='第二题，同一张卷子：求这个A的L U分解，再把A写成初等矩阵和U的乘积。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='这个我会！R₂ + R₁，R₃ + R₁，再 R₃ + 2R₂，得到 U。', read='这个我会！第二行加第一行，第三行加第一行，再第三行加二倍第二行，得到U。'),
    dict(id='C12', pose='claude_smile', sub='对。U 的对角线是 1、1、1。乘数呢？R₂ + R₁ 就是减去 −1 倍，所以 L 里填 −1。', read='对。U的对角线是一、一、一。乘数呢？第二行加第一行，就是减去负一倍，所以L里填负一。'),
    dict(id='C13', pose='claude_explain', sub='三个乘数 −1、−1、−2，按位置抄进 L 的下三角。逐行验算，LU 正好等于 A。', read='三个乘数，负一、负一、负二，按位置抄进L的下三角。逐行验算，L U正好等于A。'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='第二问：三步是 E₁、E₂、E₃，所以 A = E₃⁻¹E₂⁻¹E₁⁻¹U！', read='第二问：三步是E一、E二、E三，所以A等于E三逆、E二逆、E一逆，乘U！'),
    dict(id='C14', pose='claude_think', sub='顺序反了。先做的 E₁ 写在最右边：E₃E₂E₁A = U。要把 A 解出来，从左边一个一个撤掉。', read='顺序反了。先做的E一写在最右边：E三E二E一A等于U。要把A解出来，从左边一个一个撤掉。'),
    dict(id='C15', pose='claude_explain', sub='就像先穿袜子再穿鞋，脱的时候先脱鞋。所以 A = E₁⁻¹E₂⁻¹E₃⁻¹U，倍加矩阵的逆，把乘数变号就行。', read='就像先穿袜子再穿鞋，脱的时候先脱鞋。所以A等于E一逆、E二逆、E三逆，乘U。倍加矩阵的逆，把乘数变号就行。'),
    dict(id='C16', pose='claude_smile', sub='而且 E₁⁻¹E₂⁻¹E₃⁻¹ 乘出来正好就是 L。两问其实是同一件事。', read='而且，E一逆、E二逆、E三逆，乘出来正好就是L。两问其实是同一件事。'),
    # ── 第 3 题 ──
    dict(id='C17', pose='claude_point', sub='第 3 题，2017 年：A 是 n 阶方阵，A³ + A² − 3I = O。证明 A 非奇异。', read='第三题，二零一七年：A是n阶方阵，A的三次方加A方减三I等于零矩阵。证明A非奇异。'),
    dict(id='D06', mood='panic', pose='ds_shock', sub='A 连一个数都没给！怎么消元？', read='A连一个数都没给！怎么消元？'),
    dict(id='C18', pose='claude_explain', sub='不用消元。非奇异就是有逆，只要凑出“A 乘某个东西等于 I”。把 3I 移过去：A³ + A² = 3I。', read='不用消元。非奇异就是有逆，只要凑出：A乘某个东西等于I。把三I移过去：A的三次方加A方等于三I。'),
    dict(id='C19', pose='claude_point', sub='左边提出一个 A：A(A² + A) = 3I。两边除以 3，A 乘 (A² + A)/3 等于 I。逆矩阵直接写出来了。', read='左边提出一个A：A乘A方加A，等于三I。两边除以三，A乘三分之一的A方加A，等于I。逆矩阵直接写出来了。'),
    dict(id='G02', pose='gpt_proud', sub='快招：方阵只要一边乘出 I 就够了，另一边自动成立。2025 年判断题 AB = 4I，同样一步：A 的逆就是 B/4。', read='快招：方阵只要一边乘出I就够了，另一边自动成立。二零二五年的判断题，A B等于四I，同样一步：A的逆，就是四分之一B。'),
    dict(id='D07', mood='think', pose='ds_ask', sub='为什么一边就够？', read='为什么一边就够？'),
    dict(id='C20', pose='claude_explain', sub='用 1.5 节的定理：如果 AB = I，那么 Bx = 0 只有零解，B 可逆。两边右乘 B 的逆，A 就是 B⁻¹，BA 也等于 I。', read='用一点五节的定理：如果A B等于I，那么B x等于零只有零解，B可逆。两边右乘B的逆，A就是B逆，B A也等于I。'),
    # ── 收尾 ──
    dict(id='D08', mood='easy', pose='ds_happy', sub='总结三招！含参数看消完的最后一行；LU 把乘数抄进 L，逆序撤销；证可逆，就凑 A 乘某个东西等于 I。', read='总结三招！含参数，看消完的最后一行；L U把乘数抄进L，逆序撤销；证可逆，就凑A乘某个东西等于I。'),
    dict(id='C21', pose='claude_smile', sub='完全正确。第一章到这里就全部结束了。', read='完全正确。第一章到这里就全部结束了。'),
    dict(id='C22', pose='claude_explain', sub='下一章，行列式：一个数，就能说出矩阵把空间放大了多少倍，也能直接判断它可不可逆。', read='下一章，行列式：一个数，就能说出矩阵把空间放大了多少倍，也能直接判断它可不可逆。'),
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
