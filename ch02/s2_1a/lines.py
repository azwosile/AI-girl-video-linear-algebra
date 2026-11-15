# -*- coding: utf-8 -*-
"""第 2 章 §2.1（上）行列式是什么（Leon 9th §2.1 开头：Case 1 1×1、Case 2 2×2（由消元导出 a₁₁a₂₂ − a₂₁a₁₂）、记号 |A|；
同济第六版 第一章 §1 二阶行列式）台词源（唯一真源）。
3B1B 对应：EoLA 第 6 集——行列式 = 面积放大倍数；负号 = 翻面；等于 0 = 压扁 ↔ 奇异。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='think', pose='ds_ask', sub='上一章最后说，行列式是“面积放大倍数”。可它不就是一个公式吗？跟面积有什么关系？', read='上一章最后说，行列式是面积放大倍数。可它不就是一个公式吗？跟面积有什么关系？'),
    dict(id='C01', pose='claude_smile', sub='先别背公式。这一章只追一个问题：一个变换，把面积放大了多少倍。'),
    # —— 面积放大倍数
    dict(id='C02', pose='claude_explain', sub='老规矩，盯住 î 和 ĵ。它们围成一个单位正方形，面积是 1。', read='老规矩，盯住i帽和j帽。它们围成一个单位正方形，面积是一。'),
    dict(id='C03', pose='claude_point', sub='做变换 (3, 0; 0, 2)：î 拉长到 3，ĵ 拉长到 2。正方形变成 3 × 2 的长方形，面积 6。', read='做一个变换，矩阵是三、零、零、二：i帽拉长到三，j帽拉长到二。正方形变成三乘二的长方形，面积是六。'),
    dict(id='C04', pose='claude_explain', sub='关键是：网格是均匀变形的。每个小方格都放大 6 倍，所以随便画一个圆，面积也放大 6 倍。', read='关键是：网格是均匀变形的。每个小方格都放大六倍，所以随便画一个圆，面积也放大六倍。'),
    dict(id='C05', pose='claude_point', sub='这个放大倍数，就叫矩阵的行列式，记作 det A，或者把矩阵的括号换成两条竖线。', read='这个放大倍数，就叫矩阵的行列式，记作d e t A，或者把矩阵的括号换成两条竖线。'),
    dict(id='D02', mood='daily', pose='ds_think', sub='那斜着推的变换呢？比如上一章的剪切？'),
    dict(id='C06', pose='claude_explain', sub='剪切 (1, 1; 0, 1)：正方形被推成平行四边形。底还是 1，高还是 1，面积不变，行列式等于 1。', read='剪切，矩阵是一、一、零、一：正方形被推成平行四边形。底还是一，高还是一，面积不变，行列式等于一。'),
    # —— 割补出 ad − bc
    dict(id='C07', pose='claude_point', sub='来个一般的：(3, 1; 1, 2)。î 落到 (3, 1)，ĵ 落到 (1, 2)。这个平行四边形面积是多少？', read='来个一般的：三、一、一、二。i帽落到三、一，j帽落到一、二。这个平行四边形面积是多少？'),
    dict(id='C08', pose='claude_explain', sub='在外面套一个长方形：宽 3 + 1 = 4，高 1 + 2 = 3，面积 12。', read='在外面套一个长方形：宽是三加一等于四，高是一加二等于三，面积十二。'),
    dict(id='C09', pose='claude_point', sub='再切掉多余的部分：两个黄色三角形合起来是 3，两个绿色三角形合起来是 2，两个角上的小长方形各是 1。', read='再切掉多余的部分：两个黄色三角形合起来是三，两个绿色三角形合起来是二，两个角上的小长方形，各是一。'),
    dict(id='C10', pose='claude_smile', sub='12 − 3 − 2 − 2 = 5。把数字换成字母 a、b、c、d，同样的割补就得到 ad − bc。', read='十二减三减二减二，等于五。把数字换成字母a、b、c、d，同样的割补，就得到a d减b c。'),
    dict(id='G01', pose='gpt_point', sub='背法一句话：主对角线相乘，减去副对角线相乘。'),
    # —— 负号 = 翻面
    dict(id='D03', mood='panic', pose='ds_confused', sub='等等，ad − bc 也可能是负数啊！面积怎么会是负的？', read='等等，a d减b c也可能是负数啊！面积怎么会是负的？'),
    dict(id='C11', pose='claude_think', sub='好问题。先看 î 和 ĵ 的相对位置：从 î 出发，逆时针转一下，就碰到 ĵ。', read='好问题。先看i帽和j帽的相对位置：从i帽出发，逆时针转一下，就碰到j帽。'),
    dict(id='C12', pose='claude_point', sub='换成 (1, 2; 2, 1)：î 落到 (1, 2)，ĵ 落到 (2, 1)。看小圆弧：现在要顺时针转，平面像纸一样翻了个面。', read='换成一、二、二、一：i帽落到一、二，j帽落到二、一。看小圆弧：现在要顺时针转，平面像纸一样翻了个面。'),
    dict(id='C13', pose='claude_explain', sub='ad − bc = 1 − 4 = −3。面积放大 3 倍，负号表示翻面。行列式的绝对值是倍数，符号是方向。', read='a d减b c，等于一减四，等于负三。面积放大三倍，负号表示翻面。行列式的绝对值是倍数，符号是方向。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='就像把一张透明胶片翻过来！'),
    dict(id='C24', pose='claude_think', sub='考考你：(2, 0; 0, −1) 的行列式是多少？', read='考考你：矩阵二、零、零、负一，行列式是多少？'),
    dict(id='D08', mood='think', pose='ds_think', sub='横着拉长两倍……竖着翻下来……是 −2！', read='横着拉长两倍，竖着翻下来，是负二！'),
    dict(id='C25', pose='claude_smile', sub='对。面积 2 倍，外加翻了个面。', read='对。面积两倍，外加翻了个面。'),
    dict(id='C14', pose='claude_think', sub='注意变的过程：面积先缩到 0，再变成负的。中间那一刻，平面被压成了一条线。'),
    # —— 0 = 压扁 = 奇异
    dict(id='C15', pose='claude_explain', sub='专门看这种情况：(1, 2; 2, 4)，上一章的老朋友。î 落到 (1, 2)，ĵ 落到 (2, 4)，两个落点在同一条直线上。', read='专门看这种情况：一、二、二、四，上一章的老朋友。i帽落到一、二，j帽落到二、四，两个落点在同一条直线上。'),
    dict(id='C16', pose='claude_point', sub='整个平面被压成一条线，面积变成 0：1 × 4 − 2 × 2 = 0。', read='整个平面被压成一条线，面积变成零：一乘四减二乘二，等于零。'),
    dict(id='C17', pose='claude_smile', sub='压扁的变换撤不回来——这就是奇异矩阵。所以：行列式等于 0，当且仅当矩阵奇异。', read='压扁的变换撤不回来，这就是奇异矩阵。所以：行列式等于零，当且仅当矩阵奇异。'),
    dict(id='C26', pose='claude_explain', sub='反过来也成立：只要行列式不是 0，平面就没被压扁，变换就撤得回来，矩阵可逆。', read='反过来也成立：只要行列式不是零，平面就没被压扁，变换就撤得回来，矩阵可逆。'),
    dict(id='D05', mood='panic', pose='ds_shock', sub='一个数，就能判断矩阵有没有逆？！', read='一个数，就能判断矩阵有没有逆？'),
    # —— Leon 的代数推导
    dict(id='C18', pose='claude_explain', sub='对。教材正是从这里出发的。Leon 第 2 章问：一个 2 阶矩阵，什么时候能用行变换化成 I？', read='对。教材正是从这里出发的。Leon第二章问：一个二阶矩阵，什么时候能用行变换化成I？'),
    dict(id='C19', pose='claude_point', sub='设 a₁₁ ≠ 0。第二行先乘 a₁₁，再减去 a₂₁ 倍的第一行，第二行就变成 0 和 a₁₁a₂₂ − a₂₁a₁₂。', read='设a一一不等于零。第二行先乘a一一，再减去a二一倍的第一行，第二行就变成零，和a一一a二二减a二一a一二。'),
    dict(id='C20', pose='claude_explain', sub='能化成 I，当且仅当这个数不是 0。a₁₁ = 0 时先交换两行，结论一样。', read='能化成I，当且仅当这个数不是零。a一一等于零的时候，先交换两行，结论一样。'),
    dict(id='C21', pose='claude_smile', sub='于是教材定义 det A = a₁₁a₂₂ − a₁₂a₂₁。和我们割补出来的 ad − bc 一模一样。', read='于是教材定义：A的行列式，等于a一一乘a二二，减去a一二乘a二一。和我们割补出来的a d减b c，一模一样。'),
    dict(id='C27', pose='claude_point', sub='教材的记号：把方括号换成竖线。比如 |3 4; 2 1| = 3 × 1 − 4 × 2 = −5。', read='教材的记号：把方括号换成竖线。比如三、四、二、一的行列式，等于三乘一减四乘二，等于负五。'),
    dict(id='C22', pose='claude_explain', sub='1 阶更简单：A = (a)，有逆当且仅当 a ≠ 0，所以 det A = a。在数轴上，乘 a 就是把长度放大 a 倍。', read='一阶更简单：A只有一个数a。a不等于零，它才有逆，所以A的行列式就是a。在数轴上，乘a就是把长度放大a倍。'),
    dict(id='G02', pose='gpt_explain', sub='同济第一章第一节也从二阶行列式讲起，用的是解二元方程组。公式和竖线记号都一样。', read='同济第一章第一节，也从二阶行列式讲起，用的是解二元方程组。公式和竖线记号都一样。'),
    # —— 总结
    dict(id='D06', mood='easy', pose='ds_proud', sub='让我来总结一下，行列式就是面积放大的倍数；负号是翻面；等于 0 就是压扁，矩阵奇异！', read='让我来总结一下，行列式就是面积放大的倍数；负号是翻面；等于零就是压扁，矩阵奇异！'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='2 阶公式：主对角线乘积，减去副对角线乘积。', read='二阶公式：主对角线乘积，减去副对角线乘积。'),
    dict(id='C23', pose='claude_smile', sub='完全正确。下一节进入三维：行列式变成体积的放大倍数，公式也要升级。'),
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
