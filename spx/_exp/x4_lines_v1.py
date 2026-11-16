# -*- coding: utf-8 -*-
"""特别篇 · 期中速成 x4：子空间（2018–19 第 7 题；2025–26 第 6 题）台词源。
数值：18–19 (a) 是子空间，(b) 不是（零函数不满足）；25–26 S 的基 {x−1/2, x²−1/3, x³−1/4}，dim 3。
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='第四段：子空间。七份卷子都考，要么判断，要么证明，要么求基。', read='第四段：子空间。七份卷子都考了，要么判断，要么证明，要么求一组基。'),
    dict(id='D01', mood='think', pose='ds_think', sub='子空间的定义有一大段，我老记不全……', read='子空间的定义有一大段，我老是记不全。'),
    dict(id='C02', pose='claude_explain', sub='记成三道闸门就够了：第一，零向量在不在里面；第二，加法封闭；第三，数乘封闭。三道都过，就是子空间。', read='记成三道闸门就够了：第一道，零向量在不在里面；第二道，加法封不封闭；第三道，数乘封不封闭。三道都过，就是子空间。'),
    dict(id='G01', pose='gpt_point', sub='反过来：只要一道闸门拦住，就不是。判“不是”时，先试第一道，最省事。', read='反过来说：只要有一道闸门拦住，就不是子空间。判断不是的时候，先试第一道，最省事。'),
    # 18–19 Q7
    dict(id='C03', pose='claude_point', sub='原题：2018–2019 学年期中第 7 题，10 分。C²[−1, 1] 是二阶导连续的函数全体。下面两个子集，哪个是子空间？', read='原题：二零一八到二零一九学年期中，第七题，十分。C二，负一到一，是二阶导数连续的函数全体。下面两个子集，哪个是子空间？'),
    dict(id='C04', pose='claude_explain', sub='(a) W = { f : f″ + f = 0 }。比如 sin x：二阶导是 −sin x，加回去正好是 0。cos x 也一样。', read='第a问：W是满足f两撇加f等于零的函数。比如正弦函数：它的二阶导数是负的正弦，加回去正好是零。余弦也一样。'),
    dict(id='C05', pose='claude_explain', sub='过闸门。第一道：零函数，0″ + 0 = 0，过。', read='来过闸门。第一道：零函数，它的二阶导数加它自己，还是零，通过。'),
    dict(id='C06', pose='claude_explain', sub='第二道：f、g 都在 W 里，(f + g)″ + (f + g) = (f″ + f) + (g″ + g) = 0 + 0 = 0，过。', read='第二道：f和g都在W里，f加g的二阶导数，再加上f加g，可以拆成两组，每组都是零，加起来还是零，通过。'),
    dict(id='C07', pose='claude_explain', sub='第三道：(cf)″ + cf = c(f″ + f) = c · 0 = 0，过。三道全过，(a) 是子空间。', read='第三道：c倍的f，二阶导数加上它自己，提出c，就是c乘以零，还是零，通过。三道全过，第a问是子空间。'),
    dict(id='C08', pose='claude_point', sub='看动画：sin x、cos x 都在 W 里，它们的任意组合，比如 2 sin x + cos x，也乖乖留在 W 里。', read='看动画：正弦、余弦都在W里；它们的任意组合，比如两倍正弦加余弦，也乖乖留在W里。'),
    dict(id='C09', pose='claude_point', sub='(b) W = { f : f″ + f = x² }。第一道闸门：零函数代进去，左边是 0，右边是 x²。', read='第b问：W是满足f两撇加f等于x平方的函数。第一道闸门：把零函数代进去，左边是零，右边是x平方。'),
    dict(id='D02', mood='panic', pose='ds_shock', sub='0 ≠ x²！第一道就被拦下了！', read='零不等于x平方！第一道就被拦下了！'),
    dict(id='C10', pose='claude_smile', sub='对，(b) 不是子空间。其实它并不空：f = x² − 2 就满足。但它的 2 倍给出 2x²，不再满足——数乘也不封闭。', read='对，第b问不是子空间。其实它并不是空集：x平方减二就满足。但它的两倍，给出两倍的x平方，不再满足，数乘也不封闭。'),
    dict(id='C11', pose='claude_explain', sub='一句话规律：线性方程右边是 0，解集是子空间；右边不是 0，连零都进不去。', read='一句话规律：线性方程的右边是零，解集就是子空间；右边不是零，连零向量都进不去。'),
    dict(id='G02', pose='gpt_explain', sub='评分点：(b) 写一句“零函数不属于 W”就足够；(a) 要把三条都写出来，或者写成“对线性组合封闭”。', read='评分点：第b问，写一句零函数不属于W，就足够了；第a问要把三条都写出来，或者合起来写成，对线性组合封闭。'),
    # 25–26 Q6
    dict(id='C12', pose='claude_point', sub='第二题：2025–2026 学年期中第 6 题，12 分。S 是 P₄ 里满足 ∫₀¹ p(x) dx = 0 的多项式。证明 S 是子空间，并求一组基。', read='第二题：二零二五到二零二六学年期中，第六题，十二分。S是P四里，从零到一积分等于零的多项式。证明S是子空间，并求一组基。'),
    dict(id='G03', pose='gpt_cross', sub='先对齐记号：Leon 的 P₄ 是次数小于 4 的多项式，也就是最高三次，维数是 4。', read='先对齐记号：英文教材里的P四，是次数小于四的多项式，也就是最高三次，维数是四。'),
    dict(id='C13', pose='claude_explain', sub='证明还是三道闸门：零多项式积分为 0；积分对加法、数乘都线性，所以和与倍数的积分仍是 0。', read='证明，还是三道闸门：零多项式的积分是零；积分对加法、对数乘都是线性的，所以和的积分、倍数的积分，仍然是零。'),
    dict(id='C14', pose='claude_explain', sub='求基：设 p = a + bx + cx² + dx³。积分 = a + b/2 + c/3 + d/4 = 0，于是 a = −b/2 − c/3 − d/4。', read='求基：设p等于a，加bx，加c x平方，加d x三次方。积分出来是a，加二分之b，加三分之c，加四分之d，等于零。于是a可以用b、c、d表示出来。'),
    dict(id='C15', pose='claude_explain', sub='代回去，按 b、c、d 整理：p = b(x − 1/2) + c(x² − 1/3) + d(x³ − 1/4)。', read='代回去，按b、c、d整理：p等于b倍的x减二分之一，加c倍的x平方减三分之一，加d倍的x三次方减四分之一。'),
    dict(id='C16', pose='claude_point', sub='所以基就是 {x − 1/2, x² − 1/3, x³ − 1/4}，dim S = 3。看图：每条曲线在 0 到 1 上，上下面积正好抵消。', read='所以基就是这三个：x减二分之一，x平方减三分之一，x三次方减四分之一。S的维数是三。看图：每条曲线在零到一上，上下两块面积正好抵消。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='4 维里加了一个条件，掉一维，剩 3 维！', read='四维里加了一个条件，掉一维，剩下三维！'),
    dict(id='C17', pose='claude_smile', sub='套路卡⑧：子空间 = 三道闸门，判“不是”先试零向量。求基 = 写通式 → 用条件消掉一个参数 → 按剩下的参数整理。', read='套路卡八：子空间，就是三道闸门，判断不是，先试零向量。求基：写出通式，用条件消掉一个参数，再按剩下的参数整理。'),
    dict(id='D04', mood='easy', pose='ds_proud', sub='下一段：线性相关！', read='下一段：线性相关！'),
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
