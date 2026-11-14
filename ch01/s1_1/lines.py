# -*- coding: utf-8 -*-
"""第 1 章 §1.1 线性方程组（Leon 9th §1.1；同济第六版 第三章 §1、§3）台词源（唯一真源）。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # —— 开场：为什么从解方程讲起
    dict(id='D01', mood='daily', pose='ds_ask', sub='老师，解方程我小学就会了，为什么线代还要从解方程讲起？'),
    dict(id='C01', pose='claude_smile', sub='两三个未知数，你当然会。可工程里动不动就是成百上千个未知数。'),
    dict(id='C02', pose='claude_explain', sub='所以我们要的不是灵光一现，而是一套机械、可靠、电脑也能照着做的方法。'),
    # —— 线性方程、方程组、解
    dict(id='C03', pose='claude_point', sub='先看什么叫线性方程：每个未知数只乘一个常数，加起来等于一个常数。'),
    dict(id='C04', pose='claude_explain', sub='出现平方、两个未知数相乘、或者 sin x，就都不算线性。', read='出现平方、两个未知数相乘、或者sin x，就都不算线性。'),
    dict(id='C05', pose='claude_point', sub='把 m 个这样的方程放在一起，就是一个 m×n 线性方程组。', read='把m个这样的方程放在一起，就是一个m乘n的线性方程组。'),
    dict(id='C06', pose='claude_explain', sub='它的一个解，是一组数 (x₁, x₂, …, xₙ)，同时满足所有方程。', read='它的一个解，是一组数，同时满足所有方程。'),
    dict(id='D02', mood='think', pose='ds_confused', sub='那会不会根本没有解？'),
    dict(id='C07', pose='claude_think', sub='会。有解叫“相容”，无解叫“不相容”。最直观的，是看两个未知数的情形。', read='会。有解叫相容，无解叫不相容。最直观的，是看两个未知数的情形。'),
    # —— 2×2 的几何
    dict(id='C08', pose='claude_point', sub='每个方程是平面上的一条直线。解，就是同时落在两条线上的点。'),
    dict(id='C09', pose='claude_explain', sub='x₁ + x₂ = 2 和 x₁ − x₂ = 2 交于一点 (2, 0)：唯一解。', read='x一加x二等于二，和x一减x二等于二，交于一点，二、零：唯一解。'),
    dict(id='C10', pose='claude_point', sub='把第二条换成 x₁ + x₂ = 1，两线平行，永不相交：无解。', read='把第二条换成x一加x二等于一，两线平行，永不相交：无解。'),
    dict(id='C11', pose='claude_explain', sub='换成 −x₁ − x₂ = −2，其实是同一条线：无穷多解。', read='换成负x一减x二等于负二，其实是同一条线：无穷多解。'),
    dict(id='G01', pose='gpt_explain', sub='所以只有三种可能：唯一解、无解、无穷多解。不会恰好有两个解。'),
    # —— 等价方程组与三种操作
    dict(id='D03', mood='think', pose='ds_ask', sub='那解方程的时候，到底能对方程做什么？'),
    dict(id='C12', pose='claude_explain', sub='三种操作。第一，交换两个方程的位置。'),
    dict(id='C13', pose='claude_explain', sub='第二，一个方程两边同乘一个非零的数。', read='第二，一个方程两边，同乘一个非零的数。'),
    dict(id='C14', pose='claude_point', sub='第三，把一个方程的若干倍，加到另一个方程上。'),
    dict(id='C15', pose='claude_think', sub='这三种操作都不改变解。做完得到的方程组，叫“等价方程组”。', read='这三种操作都不改变解。做完得到的方程组，叫做等价方程组。'),
    dict(id='C16', pose='claude_point', sub='看第三种：第二个方程减去第一个，直线绕着交点转了过去，交点纹丝不动。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='哦！原来消元就是在转直线！'),
    # —— 三角形与回代
    dict(id='C17', pose='claude_explain', sub='对。消元的目标是三角形：第 k 个方程里，前面的未知数全部消掉。', read='对。消元的目标是三角形：第k个方程里，前面的未知数全部消掉。'),
    dict(id='C18', pose='claude_point', sub='来做一个三元的例子。'),
    dict(id='C19', pose='claude_explain', sub='第二个方程减去第一个的 3 倍，第三个减去第一个的 2 倍，x₁ 就只剩在第一行。', read='第二个方程减去第一个的三倍，第三个减去第一个的两倍，x一就只剩在第一行。'),
    dict(id='C20', pose='claude_think', sub='交换第二、第三个方程，让系数简单一点。'),
    dict(id='C21', pose='claude_point', sub='再用第三个减去第二个的 7 倍，三角形就出来了。', read='再用第三个减去第二个的七倍，三角形就出来了。'),
    dict(id='C22', pose='claude_explain', sub='然后从下往上：x₃ = 4，代入得 x₂ = −2，再代入得 x₁ = 3。这叫“回代”。', read='然后从下往上：x三等于四，代入得x二等于负二，再代入得x一等于三。这叫回代。'),
    # —— 矩阵记法
    dict(id='D05', mood='sigh', pose='ds_confused', sub='每一步都要抄一遍 x₁、x₂、x₃，好累……', read='每一步都要抄一遍：x一，x二，还有x三，好累。'),
    dict(id='C23', pose='claude_smile', sub='那就把 x 都省掉，只留系数——这就是系数矩阵。', read='那就把x都省掉，只留系数，这就是系数矩阵。'),
    dict(id='C24', pose='claude_point', sub='右边的常数也拼进来，用竖线隔开，叫增广矩阵。'),
    dict(id='C25', pose='claude_explain', sub='对方程的三种操作，就变成对行的三种操作：初等行变换。'),
    dict(id='C26', pose='claude_point', sub='每一步先选一个主元，用它把下面的数全消成 0。和刚才一模一样，只是干净多了。', read='每一步先选一个主元，用它把下面的数全消成零。和刚才一模一样，只是干净多了。'),
    dict(id='G02', pose='gpt_proud', sub='同济教材把这部分放在第三章“矩阵的初等变换”。名字不同，内容一样。', read='同济教材把这部分放在第三章，矩阵的初等变换。名字不同，内容一样。'),
    dict(id='D06', mood='panic', pose='ds_shock', sub='等等！要是某一列能当主元的数全是 0 呢？', read='等等！要是某一列能当主元的数全是零呢？'),
    dict(id='C27', pose='claude_smile', sub='好问题。那就是下一节：行阶梯形。'),
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
