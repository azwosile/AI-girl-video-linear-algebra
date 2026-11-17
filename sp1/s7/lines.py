# -*- coding: utf-8 -*-
"""特别篇 1 · 第 7 段：置换矩阵求逆。
原题：2024–25 第 3 题（10 分）：5×5 置换矩阵 P，判断是否非奇异并求逆
台词源（唯一真源），由 mid/script/sp01.py 导出；数值见 verify_sp01.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2024–25 第 3 题 → 纸卡 → 排版：5×5 矩阵，1 用橙色方块、0 用暗色小点。
    dict(id='C01', pose='claude_point', sub='2024 到 2025 学年第 3 题，10 分。一个 5×5 的矩阵，全是 0 和 1。判断是否非奇异，若是，求逆。', read='二零二四到二零二五学年第三题，十分。一个五乘五的矩阵，全是零和一。判断它是否非奇异；如果是，求它的逆。'),
    dict(id='D01', mood='panic', pose='ds_shock', sub='5×5 求逆？[A | I] 得写一整页吧……', read='五乘五求逆？增广单位矩阵，得写一整页吧。'),
    dict(id='C02', pose='claude_smile', sub='先别动笔，看看它长什么样。每一行恰有一个 1，每一列也恰有一个 1——这叫置换矩阵。', read='先别动笔，看看它长什么样。每一行恰好有一个一，每一列也恰好有一个一。这叫置换矩阵。'),
    # 镜头：五条彩色行条（红、金、青、紫、粉）从单位矩阵出发：第 1、3 条交换位置，第 4、5 条交换位置，得到 P。
    # 音效：whoosh @ 交换
    dict(id='C03', pose='claude_explain', sub='它就是单位矩阵交换两次行得来的：第 1 行和第 3 行换，第 4 行和第 5 行换。', read='它就是单位矩阵交换两次行得来的：第一行和第三行换，第四行和第五行换。'),
    dict(id='C04', pose='claude_explain', sub='非奇异吗？每交换一次行，行列式变号一次。交换两次：det P = (−1)² = 1 ≠ 0。非奇异。', read='非奇异吗？每交换一次行，行列式变号一次。交换两次，P的行列式等于负一的平方，等于一，不等于零。所以非奇异。'),
    # 镜头：彩色行条再做一次同样的两次交换，回到单位矩阵；画面中央写 P·P = I。
    dict(id='C05', pose='claude_explain', sub='求逆：P 的作用是“换两对行”。再做一遍同样的交换，就换回来了。所以 P·P = I，P⁻¹ = P。', read='求逆：P的作用是换两对行。把同样的交换再做一遍，就换回来了。所以P乘P等于单位矩阵，P的逆就是P自己。'),
    dict(id='D02', mood='think', pose='ds_ask', sub='所有置换矩阵的逆都是它自己吗？', read='所有置换矩阵的逆都是它自己吗？'),
    # 镜头：反例：3×3 轮换（行条 1→2→3→1 循环移动）；做两次没回到原位，做三次才回去。旁注 P⁻¹ = Pᵀ。
    dict(id='C06', pose='claude_explain', sub='不是。如果是三行轮着转一圈，转两次回不来，得转三次。通用的结论是 P⁻¹ = Pᵀ：置换矩阵的逆是它的转置。', read='不是。如果是三行轮着转一圈，转两次回不来，要转三次。通用的结论是：置换矩阵的逆，等于它的转置。'),
    dict(id='C07', pose='claude_explain', sub='这道题的 P 恰好是对称的，Pᵀ = P，所以逆就是它自己。', read='这道题的P恰好是对称的，转置等于它自己，所以逆也是它自己。'),
    # 镜头：高斯–若尔当只演两步：[P | I] 中 r₁ ↔ r₃，r₄ ↔ r₅，左半变 I，右半显影出 P。
    dict(id='G01', pose='gpt_point', sub='考场写法：写出“P 由 I 经 r₁ ↔ r₃、r₄ ↔ r₅ 得到”，再做两步 [P | I] → [I | P]。两步就完，不必展开 25 个格子。', read='考场上这样写：先写出P是单位矩阵经过第一、三行交换，第四、五行交换得到的；再做两步，把增广单位矩阵化成单位矩阵增广P。两步就完，不必展开二十五个格子。'),
    dict(id='G02', pose='gpt_cross', sub='最后要验：P·P = I。写一行“经验证 PP = I”，有的老师会单独给分。', read='最后要验证：P乘P等于单位矩阵。写一句经验证P乘P等于I，有的老师会单独给分。'),
    # 镜头：三枚“操作印章”并排：换行、倍乘、倍加；每枚翻面露出它的逆印章：换行 → 同一枚；乘 k → 乘 1/k；加 ℓ 倍 → 减 ℓ 倍。
    dict(id='C08', pose='claude_explain', sub='顺便把三类初等矩阵的逆一起记了：交换两行，逆是它自己；某行乘 k，逆是乘 1/k；某行加上 ℓ 倍另一行，逆是减去 ℓ 倍。', read='顺便把三类初等矩阵的逆一起记住：交换两行，逆是它自己；某一行乘k，逆是乘k分之一；某一行加上l倍的另一行，逆是减去l倍。'),
    dict(id='C09', pose='claude_explain', sub='一句话：逆就是“撤销这个操作”。下一集的 LU 分解，整套方法就建立在这句话上。', read='一句话：逆就是撤销这个操作。下一集的LU分解，整套方法就建立在这句话上。'),
    # 镜头：套路卡：“置换矩阵：det = (−1)^交换次数；P⁻¹ = Pᵀ；对称则 P⁻¹ = P。”本集总结：四张套路卡排成扇形。
    dict(id='C10', pose='claude_smile', sub='这一集的四张套路卡：末行定生死；系数就是解；自由变量不保证有解；矩阵从哪边乘就从哪边消。', read='这一集的四张套路卡：末行定生死；系数就是解；自由变量不保证有解；矩阵从哪边乘进来，就从哪边消掉。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='下一集，LU 分解！七年考了七次的那个！', read='下一集，LU分解！七年考了七次的那个！'),
    dict(id='C11', pose='claude_point', sub='对。下一集，我们给初等矩阵刻一枚印章。', read='对。下一集，我们给初等矩阵刻一枚印章。', post=800),
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
