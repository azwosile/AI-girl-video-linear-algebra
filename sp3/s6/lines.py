# -*- coding: utf-8 -*-
"""特别篇 3 · 第 6 段：两道行列式判断题。
原题：2021–22 第 1(1) 题：A≠O，AB=O ⇒ |B|=0（T）；第 1(2) 题：det(αA)=α det A（F）
台词源（唯一真源），由 mid/script/sp03.py 导出；数值见 verify_sp03.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2021–22 第 1 题扫描件（判断题 5 小问），(1)(2) 两问被圈出。
    dict(id='C01', pose='claude_point', sub='最后两道判断，都来自 2021 到 2022 学年第 1 题。第一问：A ≠ O，AB = O，那么 |B| = 0？', read='最后两道判断，都来自二零二一到二零二二学年第一题。第一问：A不是零矩阵，A B 等于零矩阵，那么B的行列式等于零吗？'),
    dict(id='D01', mood='think', pose='ds_think', sub='|A||B| = 0，所以 |A| = 0 或 |B| = 0……没法确定是哪个？', read='A的行列式乘B的行列式等于零，所以A的行列式等于零，或者B的行列式等于零。没法确定是哪个？'),
    dict(id='C02', pose='claude_explain', sub='用反证法。假设 |B| ≠ 0，那 B 可逆。把 AB = O 两边右乘 B⁻¹：A = O·B⁻¹ = O。', read='用反证法。假设B的行列式不等于零，那B就可逆。把A B 等于零矩阵两边右乘B的逆：A等于零矩阵乘B的逆，还是零矩阵。'),
    # 镜头：A = O 与题设 A ≠ O 相撞，红色“矛盾”印章砸下；随后“T”印章盖在题号旁。
    # 音效：slam @ 矛盾
    dict(id='C03', pose='claude_explain', sub='和 A ≠ O 矛盾。所以 |B| = 0，True。', read='这和A不是零矩阵矛盾。所以B的行列式等于零，判断为对。'),
    dict(id='G01', pose='gpt_point', sub='参考答案用的是转置的写法，绕了一点。右乘 B⁻¹ 的写法最短，三行写完。', read='参考答案用的是转置的写法，绕了一点。右乘B逆的写法最短，三行就能写完。'),
    dict(id='D02', mood='think', pose='ds_ask', sub='那 |A| 一定是 0 吗？', read='那A的行列式一定是零吗？'),
    dict(id='C04', pose='claude_explain', sub='这一问只问 B。顺便想想：A 能不能可逆？若 A 可逆，左乘 A⁻¹ 就得 B = O，|B| = 0 照样成立。所以不管 A 怎样，结论都对。', read='这一问只问B。顺便想一想：A能不能可逆？如果A可逆，左乘A的逆就得到B等于零矩阵，B的行列式还是零。所以不管A怎样，结论都成立。'),
    # 镜头：第二问：“det(αA) = α det A”。反例 α = 2，A = I₂：左边 det(2I) = 4，右边 2 × 1 = 2。“F”印章盖下。
    dict(id='C05', pose='claude_point', sub='第二问：det(αA) = α det A？', read='第二问：阿尔法乘A的行列式，等于阿尔法乘A的行列式吗？'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='这个我今天已经学过了！要 n 次方，False！反例 2I！', read='这个我今天已经学过了！要n次方，错！反例，二倍单位矩阵！'),
    dict(id='C06', pose='claude_smile', sub='对：α = 2，A = I₂，左边 det(2I) = 4，右边 2。正确的公式是 det(αA) = αⁿ det A。', read='对：阿尔法等于二，A是二阶单位矩阵，左边是二倍单位矩阵的行列式，等于四，右边是二。正确的公式是：阿尔法 A 的行列式，等于阿尔法的n次方乘A的行列式。'),
    # 音效：slam
    # 镜头：本集总结：五张套路卡（数乘 n 次方 / 偷梁换柱 / 计数器消元 / 先找最空行列 / 先乘再算）扇形展开。
    dict(id='C07', pose='claude_explain', sub='这一集的五张卡：数乘提 n 次方；余子式组合就换行；消元挂计数器；零多先找最空的行列；有加号先乘再算。', read='这一集的五张卡：数乘提出n次方；余子式组合就换行；消元挂计数器；零多先找最空的行列；有加号先乘再算。'),
    dict(id='G02', pose='gpt_proud', sub='下一集是向量空间。证明题开始变多，我会把每道证明的标准写法拆给你看。', read='下一集是向量空间。证明题开始变多，我会把每道证明的标准写法拆给你看。'),
    dict(id='D04', mood='panic', pose='ds_confused', sub='证明题……我最怕的……', read='证明题，我最怕的。'),
    dict(id='C08', pose='claude_smile', sub='别怕。证明题也有模板。下一集见。', read='别怕。证明题也有模板。下一集见。', post=800),
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
