# -*- coding: utf-8 -*-
"""第 2 章 复习（上）判断题（Leon 9th Chapter 2 Test A，True or False 全 10 题；答案 T F F T F T T T F T）台词源（唯一真源）。
形式：大肥鱼先答 → 判定印章 → Claude 给理由 / 最小反例（尽量配 3B1B 画面）→ GPT 一句话。期中真题另起一段（s2_xb）。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪：panic/think/daily/sigh/easy）、pose（立绘差分）
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='行列式这章我全会了！面积、体积、展开、消元，来考我！'),
    dict(id='C01', pose='claude_smile', sub='好。教材第二章的判断题，一共十道：永远成立判“对”并说理由，不一定成立就举反例。', read='好。教材第二章的判断题，一共十道：永远成立，就判对，并说出理由；不一定成立，就举一个反例。'),
    # 1
    dict(id='C02', pose='claude_point', sub='第 1 题：det(AB) = det(BA)。', read='第一题：A B的行列式，等于B A的行列式。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='矩阵乘法不能交换，第一章刚学的！错！'),
    dict(id='C03', pose='claude_explain', sub='对。AB 和 BA 确实一般不相等，但两边的行列式都等于 det A 乘 det B。数的乘法是可以交换的。', read='对。A B和B A确实一般不相等，但两边的行列式，都等于A的行列式乘B的行列式。数的乘法是可以交换的。'),
    # 2
    dict(id='C04', pose='claude_point', sub='第 2 题：det(A + B) = det A + det B。', read='第二题：A加B的行列式，等于A的行列式加B的行列式。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='看着很顺，对！'),
    dict(id='C05', pose='claude_think', sub='错。A = diag(1, 0) 把平面压成一条线，det = 0；B = diag(0, 1) 也是 0。可 A + B = I，det = 1。', read='错。A等于对角矩阵一、零，把平面压成一条线，行列式是零；B等于对角矩阵零、一，也是零。可A加B等于单位矩阵，行列式是一。'),
    # 3
    dict(id='C06', pose='claude_point', sub='第 3 题：det(cA) = c · det A。', read='第三题：矩阵c A的行列式，等于数c乘上A的行列式。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='常数提出来嘛，对！'),
    dict(id='C07', pose='claude_explain', sub='错。看 2I：每个方向都放大 2 倍，正方形面积放大 4 倍。每一行提出一个 c，n 行就是 cⁿ。', read='错。看二倍的单位矩阵：每个方向都放大两倍，正方形的面积放大四倍。每一行都能提出一个c，n行就是c的n次方。'),
    # 4
    dict(id='C08', pose='claude_point', sub='第 4 题：det((AB)ᵀ) = det A · det B。', read='第四题：A B转置的行列式，等于A的行列式乘B的行列式。'),
    dict(id='D05', mood='think', pose='ds_think', sub='转置以后 A、B 要换顺序……那就错了吧？'),
    dict(id='C09', pose='claude_point', sub='对。第一步，转置不改行列式；第二步，乘积公式。顺序换不换，结果都是 det A · det B。', read='对。第一步，转置不改变行列式；第二步，用乘积公式。顺序换不换，结果都是A的行列式乘B的行列式。'),
    # 5
    dict(id='C10', pose='claude_point', sub='第 5 题：det A = det B，那么 A = B。', read='第五题：A和B的行列式相等，那么A等于B。'),
    dict(id='D06', mood='easy', pose='ds_happy', sub='行列式一样，那就是同一个矩阵！对！'),
    dict(id='C11', pose='claude_think', sub='错。I 和剪切矩阵 (1, 1; 0, 1)，行列式都是 1。一个不动，一个把正方形推斜了，面积一样，变换完全不同。', read='错。单位矩阵和剪切矩阵一、一，零、一，行列式都是一。一个不动，一个把正方形推斜了，面积一样，变换完全不同。'),
    dict(id='C12', pose='claude_explain', sub='行列式只记住了“面积放大几倍”这一个数，丢掉了方向、形状这些信息。', read='行列式只记住了面积放大几倍这一个数，丢掉了方向、形状这些信息。'),
    # 6
    dict(id='C13', pose='claude_point', sub='第 6 题：det(Aᵏ) = (det A)ᵏ。', read='第六题：A的k次方的行列式，等于A的行列式的k次方。'),
    dict(id='D07', mood='think', pose='ds_think', sub='Aᵏ 是 k 个 A 相乘，乘积公式用 k 次……对！', read='A的k次方，是k个A相乘，乘积公式用k次……对！'),
    dict(id='C14', pose='claude_smile', sub='对，理由也对。几何上：每做一次 A，面积放大 det A 倍；做 k 次，就是 k 个 det A 相乘。', read='对，理由也对。几何上：每做一次A，面积放大A的行列式倍；做k次，就是k个A的行列式相乘。'),
    # 7
    dict(id='C15', pose='claude_point', sub='第 7 题：三角矩阵非奇异，等价于对角元全都不是 0。', read='第七题：三角矩阵非奇异，等价于对角元全都不是零。'),
    dict(id='D08', mood='easy', pose='ds_proud', sub='三角矩阵的行列式是对角元之积，积不为零就是每个都不为零。对！'),
    dict(id='C16', pose='claude_smile', sub='完全正确。再加上“非奇异 ⇔ det ≠ 0”，两句话就证完了。', read='完全正确。再加上非奇异等价于行列式不为零，两句话就证完了。'),
    # 8
    dict(id='C17', pose='claude_point', sub='第 8 题：存在非零向量 x 使 Ax = 0，那么 det A = 0。', read='第八题：如果有一个非零向量x，让A乘x等于零，那么A的行列式就等于零。'),
    dict(id='D09', mood='think', pose='ds_think', sub='x 被送到原点……空间被压扁了？对！'),
    dict(id='C18', pose='claude_explain', sub='对，这就是 3B1B 的看法。比如 A = (1, 2; 2, 4)，x = (2, −1) 被压到原点，整个平面压成一条线，面积变成 0。', read='对，这就是3B1B的看法。比如A的两行是一、二和二、四，x等于二、负一，被压到原点，整个平面压成一条线，面积变成零。'),
    # 9
    dict(id='C19', pose='claude_point', sub='第 9 题：两个矩阵行等价，那么它们的行列式相等。', read='第九题：两个矩阵行等价，那么它们的行列式相等。'),
    dict(id='D10', mood='easy', pose='ds_happy', sub='行变换得来的，当然一样，对！'),
    dict(id='C20', pose='claude_think', sub='错。把 I 的第一行乘 2，得到 diag(2, 1)，两个矩阵行等价，行列式却是 1 和 2。交换两行还会变号。', read='错。把单位矩阵的第一行乘二，得到对角矩阵二、一。两个矩阵行等价，行列式却是一和二。交换两行还会变号。'),
    dict(id='G01', pose='gpt_explain', sub='不过有一样东西不变：是不是 0。行变换给行列式乘上的都是非零数，所以奇异的永远奇异。', read='不过有一样东西不变：是不是零。行变换给行列式乘上的，都是不为零的数，所以奇异的永远奇异。'),
    # 10
    dict(id='C21', pose='claude_point', sub='第 10 题：A 不是零矩阵，但某个 Aᵏ = O，那么 A 一定奇异。', read='第十题：A不是零矩阵，但A的某个k次方是零矩阵，那么A一定奇异。'),
    dict(id='D11', mood='think', pose='ds_confused', sub='A 不是零，乘几次却变成零？还有这种矩阵？'),
    dict(id='C22', pose='claude_explain', sub='有，比如 (0, 1; 0, 0)，它的平方就是 O。用第 6 题：(det A)ᵏ = det(Aᵏ) = 0，所以 det A = 0。对。', read='有，比如零、一，零、零，它的平方就是零矩阵。用第六题：A的行列式的k次方，等于零，所以A的行列式是零。对。'),
    # 结尾
    dict(id='D12', mood='sigh', pose='ds_confused', sub='三道对……十道里我只对了三道。'),
    dict(id='C23', pose='claude_smile', sub='规律很清楚：行列式和乘法相处得好——乘积、转置、乘方、求逆都能直接算；碰到加法、数乘和行变换，就得小心。', read='规律很清楚：行列式和乘法相处得好，乘积、转置、乘方、求逆，都能直接算；碰到加法、数乘和行变换，就得小心。'),
    dict(id='G02', pose='gpt_point', sub='找反例的老办法：先试 2 阶对角矩阵，再试剪切矩阵。十道题里四个反例，全都是 2 阶的。', read='找反例的老办法：先试二阶对角矩阵，再试剪切矩阵。十道题里四个反例，全都是二阶的。'),
    dict(id='C24', pose='claude_smile', sub='下一节，我们做期中考试的真题。', read='下一节，我们做期中考试的真题。'),
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
