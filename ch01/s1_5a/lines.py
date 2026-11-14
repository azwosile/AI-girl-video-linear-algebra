# -*- coding: utf-8 -*-
"""第 1 章 §1.5（上）初等矩阵与求逆（Leon 9th §1.5：Equivalent Systems、三类初等矩阵 例 1–3、Thm 1.5.1、行等价、Thm 1.5.2 非奇异的等价条件、
Corollary 1.5.3、[A | I] → [I | A⁻¹] 例 4、例 5；同济第六版 第三章 §1 初等变换、定理 1–3、(A, E) → (E, A⁻¹)）台词源（唯一真源）。
3B1B 对应：三种行变换 = 三种网格变换（交换 = 沿 y = x 翻折，倍乘 = 单方向拉伸，倍加 = 剪切）；消元 = 一串变换把网格拧正。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='think', pose='ds_ask', sub='上一节说要用行变换求逆。可是行变换是在方程上动手，跟矩阵乘法有什么关系？', read='上一节说，要用行变换求逆。可是行变换是在方程上动手，跟矩阵乘法有什么关系？'),
    dict(id='C01', pose='claude_smile', sub='关系大了：每一次行变换，都等于左边乘上一个特殊的矩阵。它叫初等矩阵。', read='关系大了：每一次行变换，都等于在左边乘上一个特殊的矩阵。它叫初等矩阵。'),
    # —— 定义 + 三类
    dict(id='C02', pose='claude_explain', sub='做法很简单：拿单位矩阵 I，只做一次行变换，得到的就是初等矩阵。三种行变换，对应三类。', read='做法很简单：拿单位矩阵I，只做一次行变换，得到的就是初等矩阵。三种行变换，对应三类。'),
    dict(id='C03', pose='claude_point', sub='第一类：交换两行。例 1，把 I 的前两行对调，得到 E₁。', read='第一类：交换两行。例一，把I的前两行对调，得到E一。'),
    dict(id='C04', pose='claude_explain', sub='E₁ 乘任何矩阵 A，效果就是把 A 的前两行对调。', read='E一乘任何矩阵A，效果就是把A的前两行对调。'),
    dict(id='C05', pose='claude_point', sub='在平面上，交换两行就是 î 和 ĵ 互换位置，整个网格沿着 y = x 这条线翻过去。', read='在平面上，交换两行，就是i帽和j帽互换位置，整个网格沿着y等于x这条线翻过去。'),
    dict(id='C06', pose='claude_explain', sub='第二类：某一行乘一个非零的数。例 2，把 I 的第三行乘 3。', read='第二类：某一行乘一个非零的数。例二，把I的第三行乘三。'),
    dict(id='C07', pose='claude_point', sub='在平面上，第一行乘 2，就是横向拉长两倍，竖直方向不动。', read='在平面上，第一行乘二，就是横向拉长两倍，竖直方向不动。'),
    dict(id='C08', pose='claude_explain', sub='第三类：把某一行的若干倍加到另一行。例 3，把第三行的 3 倍加到第一行。', read='第三类：把某一行的若干倍，加到另一行。例三，把第三行的三倍加到第一行。'),
    dict(id='C09', pose='claude_point', sub='在平面上，这正是上一节的老朋友：剪切。', read='在平面上，这正是上一节的老朋友：剪切。'),
    dict(id='D02', mood='daily', pose='ds_ask', sub='为什么第二类要强调“非零”？', read='为什么第二类要强调非零？'),
    dict(id='C10', pose='claude_think', sub='乘 0 就把一整行抹掉了，平面被压扁，撤不回来。初等矩阵要求每一步都能撤销。', read='乘零，就把一整行抹掉了，平面被压扁，撤不回来。初等矩阵要求每一步都能撤销。'),
    # —— 定理 1.5.1
    dict(id='C11', pose='claude_explain', sub='这就是定理 1.5.1：初等矩阵都可逆，而且逆还是同一类初等矩阵。', read='这就是定理一点五点一：初等矩阵都可逆，而且逆还是同一类初等矩阵。'),
    dict(id='C12', pose='claude_point', sub='交换的逆是再换回来；乘 α 的逆是乘 1/α；加 m 倍的逆是减 m 倍。', read='交换的逆，是再换回来；乘阿尔法的逆，是乘阿尔法分之一；加m倍的逆，是减m倍。'),
    # —— 消元 = 拧正网格
    dict(id='C13', pose='claude_explain', sub='现在看消元。A 的第一列是 (1, 2)，第二列是 (2, 5)，网格是斜的。', read='现在看消元。A的第一列是一、二，第二列是二、五，网格是斜的。'),
    dict(id='C14', pose='claude_point', sub='第一步：第二行减去第一行的 2 倍。这是一个初等矩阵 E₁，网格被剪切了一下。', read='第一步：第二行减去第一行的两倍。这是一个初等矩阵E一，网格被剪切了一下。'),
    dict(id='C15', pose='claude_point', sub='第二步：第一行减去第二行的 2 倍，又是一个剪切 E₂。网格被拧正了，变回单位矩阵。', read='第二步：第一行减去第二行的两倍，又是一个剪切E二。网格被拧正了，变回单位矩阵。'),
    dict(id='C16', pose='claude_smile', sub='写成式子：E₂E₁A = I。那 E₂E₁ 是什么？它把 A 撤销成了 I——它就是 A⁻¹！', read='写成式子：E二E一A等于I。那E二E一是什么？它把A撤销成了I，它就是A的逆！'),
    dict(id='D03', mood='panic', pose='ds_shock', sub='消元的步骤乘起来，就是逆矩阵？！', read='消元的步骤乘起来，就是逆矩阵？'),
    # —— 定理 1.5.2
    dict(id='C17', pose='claude_explain', sub='对。教材把这件事写成定理 1.5.2：对 n 阶方阵 A，下面三句话等价。', read='对。教材把这件事写成定理一点五点二：对n阶方阵A，下面三句话等价。'),
    dict(id='C18', pose='claude_point', sub='A 可逆；Ax = 0 只有零解；A 能通过行变换化成 I。', read='A可逆；A x等于零只有零解；A能通过行变换化成I。'),
    dict(id='C19', pose='claude_explain', sub='推论 1.5.3 更实用：n 个方程 n 个未知数，有唯一解，当且仅当 A 可逆。', read='推论一点五点三更实用：n个方程、n个未知数，有唯一解，当且仅当A可逆。'),
    dict(id='G01', pose='gpt_explain', sub='补个名词：能通过有限次行变换互相得到的矩阵，叫行等价。', read='补个名词：能通过有限次行变换互相得到的两个矩阵，叫行等价。'),
    # —— 求逆算法
    dict(id='C20', pose='claude_explain', sub='怎么把 E₂E₁ 乘出来？有个妙招：把 I 放在 A 旁边，一起做行变换。', read='怎么把这些E乘出来？有个妙招：把I放在A旁边，一起做行变换。'),
    dict(id='C21', pose='claude_point', sub='左边变成 I 的时候，右边的 I 被乘上了同一串 E，正好变成 A⁻¹。', read='左边变成I的时候，右边的I被乘上了同一串E，正好变成A的逆。'),
    dict(id='C22', pose='claude_explain', sub='来做教材例 4，一个三阶矩阵。先用第一行消掉下面两个数：第二行加第一行，第三行减两倍第一行。', read='来做教材例四，一个三阶矩阵。先用第一行消掉下面两个数：第二行加第一行，第三行减两倍第一行。'),
    dict(id='C23', pose='claude_point', sub='再用第二行消第三行：第三行加三倍第二行。左边变成上三角了。', read='再用第二行消第三行：第三行加上三倍的第二行。左边变成上三角了。'),
    dict(id='C24', pose='claude_explain', sub='接着从下往上消：用第三行消掉上面的 3，再用第二行消掉第一行的 4。', read='接着从下往上消：用第三行消掉上面的三，再用第二行消掉第一行的四。'),
    dict(id='C25', pose='claude_point', sub='最后每行除以主元，左边变成 I。右边那块，就是 A⁻¹。', read='最后，每行除以主元，左边变成I。右边那块，就是A的逆。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='像做菜一样，一步步跟着做就出来了！'),
    dict(id='C26', pose='claude_explain', sub='有了逆，例 5 的方程组就是一次乘法：x = A⁻¹b，得到 4、4、负三分之八。', read='有了逆，例五的方程组就是一次乘法：x等于A逆乘b，得到四、四、负三分之八。'),
    dict(id='C27', pose='claude_think', sub='要是左边消出一整行 0 呢？比如上一节的 (1, 2; 2, 4)，第二行减两倍第一行，直接变成 0。', read='要是左边消出一整行零呢？比如上一节的一、二、二、四，第二行减两倍第一行，直接变成零。'),
    dict(id='C28', pose='claude_explain', sub='那就不可能化成 I，A 是奇异的，没有逆。算法自己会告诉你答案。', read='那就不可能化成I，A是奇异的，没有逆。算法自己会告诉你答案。'),
    dict(id='G02', pose='gpt_proud', sub='同济第三章也是这招：(A, E) 做初等行变换，变成 (E, A⁻¹)。同济还讲列变换，但求逆时只能全程用行变换。', read='同济第三章也是这招：A、E做初等行变换，变成E、A逆。同济还讲列变换，但求逆的时候，只能全程用行变换。'),
    dict(id='D05', mood='easy', pose='ds_happy', sub='我来总结！行变换等于左乘初等矩阵；三类分别是翻折、拉伸、剪切。', read='我来总结！行变换等于左乘初等矩阵；三类分别是翻折、拉伸、剪切。'),
    dict(id='D06', mood='easy', pose='ds_happy', sub='把 A 和 I 并排一起消，左边变 I，右边就是逆；消出零行，就没有逆！', read='把A和I并排一起消，左边变I，右边就是逆；消出零行，就没有逆！'),
    dict(id='C29', pose='claude_smile', sub='完全正确。下一节换个角度：只用第三类变换消元，能把 A 拆成两个三角矩阵相乘。', read='完全正确。下一节换个角度：只用第三类变换消元，能把A拆成两个三角矩阵相乘。'),
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
