# -*- coding: utf-8 -*-
"""特别篇 5 · 第 1 段：过渡矩阵的“约定之战”。
原题：本校两份答案：2021–22 第 6 题（Leon 写法 S=U⁻¹V）；2020–21 第 5 题（同济写法 (u)=(v)S）
台词源（唯一真源），由 mid/script/sp05.py 导出；数值见 verify_sp05.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：开场：两本教材（Leon 第 9 版、同济第六版）从左右两侧滑入，中间一道闪电分隔；上方大字“过渡矩阵”。
    dict(id='C01', pose='claude_point', sub='第五集，过渡矩阵。七年考了六次，一题十二到十五分。但在讲题之前，必须先打一场“约定之战”。', read='第五集，过渡矩阵。七年考了六次，一题十二到十五分。但在讲题之前，必须先打一场约定之战。'),
    dict(id='D01', mood='think', pose='ds_confused', sub='什么约定？过渡矩阵不就是一个矩阵吗？', read='什么约定？过渡矩阵不就是一个矩阵吗？'),
    dict(id='C02', pose='claude_explain', sub='问题是“从 E 到 F 的过渡矩阵”这句话，Leon 和同济给的是两个不同的矩阵——它们正好互为逆矩阵。', read='问题在于，从E到F的过渡矩阵这句话，Leon和同济给出的是两个不同的矩阵。它们正好互为逆矩阵。'),
    # 镜头：左卡（Leon）：“从 E 到 F 的过渡矩阵 S：[x]_F = S [x]_E，S = F⁻¹E”。两副眼镜：戴 E 眼镜读出坐标 → 换上 F 眼镜。
    dict(id='C03', pose='claude_explain', sub='Leon 的定义管“坐标”：S 把 x 在 E 下的坐标，变成在 F 下的坐标。[x]_F = S[x]_E。算出来 S = F⁻¹E。', read='Leon的定义管坐标：S把x在E下的坐标，变成在F下的坐标。x的F坐标等于S乘x的E坐标。算出来S等于F逆乘E。'),
    # 镜头：右卡（同济）：“(β₁, …, βₙ) = (α₁, …, αₙ)P，P = α⁻¹β”。新基的每个向量用旧基表示，系数排成列。
    dict(id='C04', pose='claude_explain', sub='同济的定义管“基”：新基 β 的每个向量，用旧基 α 表示，系数排成列，得到 P。(β) = (α)P，P = α⁻¹β。', read='同济的定义管基：新基贝塔的每个向量，用旧基阿尔法表示，系数排成列，得到P。贝塔等于阿尔法乘P，P等于阿尔法逆乘贝塔。'),
    # 镜头：两张卡上下翻转叠合：Leon 的“E→F”= F⁻¹E；同济的“E→F”= E⁻¹F；中间出现“互为逆矩阵”的连线。
    # 音效：impact @ 互为逆
    dict(id='C05', pose='claude_explain', sub='同样说“从 E 到 F”：Leon 是 F⁻¹E，同济是 E⁻¹F。互逆。', read='同样说从E到F：Leon是F逆乘E，同济是E逆乘F。两者互为逆矩阵。'),
    dict(id='G01', pose='gpt_point', sub='我们学校两份参考答案，一份按 Leon（2021–22 第 6 题），一份按同济（2020–21 第 5 题）。老师们自己也没统一。', read='我们学校的两份参考答案，一份按Leon，是二零二一到二零二二学年第六题；一份按同济，是二零二零到二零二一学年第五题。老师们自己也没有统一。'),
    dict(id='D02', mood='panic', pose='ds_shock', sub='那我考试写哪个？写错了不就零分了？', read='那我考试写哪个？写错了不就零分了？'),
    # 镜头：考场策略卡：①先写定义式 ②题目同时问坐标 → 用 Leon 写法 ③两种都不丢分。
    dict(id='C06', pose='claude_smile', sub='策略很简单：答卷第一行先写你用的定义式，比如“设 [x]_F = S[x]_E”。定义写清楚了，按哪种都给分。', read='策略很简单：答卷第一行，先写出你用的定义式，比如设x的F坐标等于S乘x的E坐标。定义写清楚了，按哪种算都给分。'),
    dict(id='C07', pose='claude_explain', sub='如果题目同时问坐标，推荐 Leon 写法：S 一乘坐标就出来，不用再求逆。这一集的所有题，我们都用 Leon 写法，最后再顺手给出同济版本。', read='如果题目同时问坐标，推荐Leon写法：S一乘坐标就出来，不用再求逆。这一集的所有题，我们都用Leon写法，最后再顺手给出同济的版本。'),
    dict(id='G02', pose='gpt_cross', sub='一句话记 Leon：S = (目标基)⁻¹ × (出发基)。“到谁，就用谁的逆”。', read='一句话记Leon：S等于目标基的逆，乘出发基。到谁，就用谁的逆。', post=500),
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
