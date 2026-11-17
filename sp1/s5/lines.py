# -*- coding: utf-8 -*-
"""特别篇 1 · 第 5 段：自由变量 ≠ 无穷多解。
原题：2017–18 第 1(i) 题；2023–24 第 1(5) 题 = 2022–23 第 1(8) 题（判断）
台词源（唯一真源），由 mid/script/sp01.py 导出；数值见 verify_sp01.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2017–18 第 1(i) 题 → 纸卡：A 行等价于 B = [[1,−1,0,−2],[0,1,0,1],[0,0,1,−1]]，求 Ax = 0 的全部解。
    dict(id='C01', pose='claude_point', sub='2017 到 2018 学年填空第一题。A 行等价于 B，B 已经给出来了。求 Ax = 0 的全部解。', read='二零一七到二零一八学年填空第一题。A行等价于B，B已经给出来了。求A x 等于零的全部解。'),
    dict(id='C02', pose='claude_explain', sub='行等价意味着两个方程组同解：解 Bx = 0 就行。', read='行等价，意味着两个方程组同解：解B x 等于零就行。'),
    dict(id='D01', mood='easy', pose='ds_proud', sub='第四列没主元，x₄ 自由。第一行读出 x₁ = 2x₄……', read='第四列没有主元，x四是自由的。第一行读出：x一等于二x四。'),
    dict(id='G01', pose='gpt_cross', sub='慢着。第一行第二个位置是 −1，不是 0。B 只是阶梯形，不是最简形。', read='慢着。第一行第二个位置是负一，不是零。B只是阶梯形，不是最简形。'),
    # 镜头：B 的第一行第二格 “−1” 红框闪烁；做 r₁ + r₂：第一行变成 (1, 0, 0, −1)，红框消失，最简形完成。
    # 音效：buzz @ 负一
    dict(id='C03', pose='claude_explain', sub='直接读会读错。先把它化到最简：第一行加第二行，得 (1, 0, 0, −1)。', read='直接读就会读错。先把它化到最简形：第一行加上第二行，得到一、零、零、负一。'),
    dict(id='C04', pose='claude_write', sub='现在三行依次读：x₁ = x₄，x₂ = −x₄，x₃ = x₄。令 x₄ = t。', read='现在三行依次读：x一等于x四，x二等于负x四，x三等于x四。令x四等于t。'),
    dict(id='C05', pose='claude_point', sub='全部解：x = t(1, −1, 1, 1)ᵀ，t 任意。', read='全部解：x等于t倍的一、负一、一、一，t任意。'),
    dict(id='G02', pose='gpt_think', sub='检查一下：B 的第一行 1 − (−1) + 0 − 2·1 = 0。对。', read='检查一下：用原来的B第一行，一，减负一，加零，减二乘一，等于零。对。'),
    # 镜头：原题三步：2023–24 第 1(5) 题 → 纸卡：“若 A 的行最简形有自由变量，则 Ax = b 有无穷多解。（T / F）”角标：2022–23 第 1(8) 题一字不差。
    dict(id='C06', pose='claude_point', sub='第二题是判断题，2023 到 2024 学年考过，2022 到 2023 学年一字不差又考了一次：行最简形有自由变量，则 Ax = b 有无穷多解。', read='第二题是判断题，二零二三到二零二四学年考过，二零二二到二零二三学年一字不差又考了一次：行最简形有自由变量，那么A x 等于b有无穷多解。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='有自由变量，就能随便取，当然无穷多，True！', read='有自由变量，就能随便取，当然是无穷多。对！'),
    # 镜头：左右分屏：左“齐次 Ax = 0”，右“非齐次 Ax = b”。右侧增广矩阵 [[1,1|0],[0,0|1]]，第二行 “0 = 1” 变红并炸开。
    # 音效：glitch @ 零等于一
    dict(id='C07', pose='claude_explain', sub='看一个反例：增广矩阵 (1, 1 | 0) 和 (0, 0 | 1)。x₂ 确实是自由变量，可第二行说 0 = 1——根本无解。', read='看一个反例：增广矩阵第一行一、一，竖线零；第二行零、零，竖线一。x二确实是自由变量，可第二行说零等于一，根本无解。'),
    dict(id='C08', pose='claude_explain', sub='所以答案是 False。自由变量只决定“如果有解，解有多少”；有没有解，要先看会不会出现 0 = 非零。', read='所以答案是错。自由变量只决定：如果有解，解有多少个；有没有解，要先看会不会出现零等于非零。'),
    dict(id='C09', pose='claude_explain', sub='左边齐次方程永远有零解，所以对齐次方程来说，这句话是对的。考的就是你分不分得清齐次与非齐次。', read='左边的齐次方程，永远有零解，所以对齐次方程来说，这句话是对的。考的就是你分不分得清齐次和非齐次。'),
    dict(id='C10', pose='claude_explain', sub='为什么齐次就一定对？因为 x = 0 总是解，所以“有解”不用担心；再有一个自由变量，它取任意值都能回代出解，于是无穷多。', read='为什么齐次的就一定对？因为x等于零总是解，有解这件事不用担心；再加上有一个自由变量，它取任意值都能回代出一组解，于是就有无穷多个。'),
    dict(id='G03', pose='gpt_point', sub='判断题要写理由：答 F，并给出这个 2×2 的反例。只写 F 没有反例，一般只给一半分。', read='判断题要写理由：答错，并且给出这个二乘二的反例。只写错，不给反例，一般只给一半分。'),
    # 镜头：套路卡：“读解前先化最简形；自由变量 ⇏ 有解；判断题 = 结论 + 反例。”
    dict(id='C11', pose='claude_smile', sub='套路卡：读解之前先化到最简；自由变量不保证有解；判断题，结论加反例。', read='套路卡：读解之前先化到最简；自由变量不保证有解；判断题，结论加反例。', post=500),
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
