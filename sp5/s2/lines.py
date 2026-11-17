# -*- coding: utf-8 -*-
"""特别篇 5 · 第 2 段：最新卷第 5 题。
原题：2025–26 第 5 题（15 分）：E=[(1,1,1),(2,3,2),(1,5,4)]，F=[(1,1,0),(1,2,0),(1,2,1)]；x=3v₁+2v₂−v₃，y=v₁−3v₂+2v₃（数据与 2021–22 第 6 题相同）
台词源（唯一真源），由 mid/script/sp05.py 导出；数值见 verify_sp05.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2025–26 第 5 题 → 纸卡；2021–22 第 6 题扫描件从角落滑入，数据逐格比对打勾。
    dict(id='C01', pose='claude_point', sub='今年最新卷第 5 题，15 分。数据和 2021 到 2022 学年第 6 题一模一样——又一道“重考题”。', read='今年最新卷第五题，十五分。数据和二零二一到二零二二学年第六题一模一样，又是一道重考题。'),
    dict(id='C02', pose='claude_explain', sub='E 的三个向量 v₁ = (1, 1, 1)，v₂ = (2, 3, 2)，v₃ = (1, 5, 4)；F 的三个向量 u₁ = (1, 1, 0)，u₂ = (1, 2, 0)，u₃ = (1, 2, 1)。', read='E的三个向量：v一等于一、一、一；v二等于二、三、二；v三等于一、五、四。F的三个向量：u一等于一、一、零；u二等于一、二、零；u三等于一、二、一。'),
    dict(id='C03', pose='claude_explain', sub='求从 E 到 F 的过渡矩阵；再求 x = 3v₁ + 2v₂ − v₃ 和 y = v₁ − 3v₂ + 2v₃ 在 F 下的坐标。', read='求从E到F的过渡矩阵；再求x等于三v一加二v二减v三，和y等于v一减三v二加二v三，在F下的坐标。'),
    dict(id='G01', pose='gpt_point', sub='先确认两组都是基：det E = 3，det F = 1，都不为零。这一句有的老师要。', read='先确认两组都是基：E的行列式等于三，F的行列式等于一，都不为零。这一句有的老师要看。'),
    # 镜头：宽矩阵 [F | E]：左半 F（青），右半 E（金），中间分割光带。
    dict(id='C04', pose='claude_explain', sub='Leon：S = F⁻¹E。不用先求 F⁻¹ 再乘——把 [F | E] 并排写，消元把左边变成 I，右边自动变成 F⁻¹E。', read='按Leon：S等于F逆乘E。不用先求F逆再乘，把F和E并排写成增广矩阵，消元把左边变成单位矩阵，右边自动变成F逆乘E。'),
    dict(id='D01', mood='think', pose='ds_ask', sub='为什么右边会变成 F⁻¹E？', read='为什么右边会变成F逆乘E？'),
    dict(id='C05', pose='claude_explain', sub='消元等于左乘一串初等矩阵，乘积就是 F⁻¹——因为它把 F 变成了 I。同一串操作作用在右边，就是 F⁻¹E。', read='消元，等于左乘一串初等矩阵，它们的乘积就是F逆，因为它把F变成了单位矩阵。同一串操作作用在右边，就是F逆乘E。'),
    # 镜头：rowop：F 的行为 (1,1,1)、(1,2,2)、(0,0,1)（F 按列写入后读行）；逐步消元，右半随之变化；左半变 I 的瞬间，右半“显影”出 S。
    dict(id='C06', pose='claude_write', sub='F 按列放，三行是 (1, 1, 1)、(1, 2, 2)、(0, 0, 1)；E 的三行是 (1, 2, 1)、(1, 3, 5)、(1, 2, 4)。', read='F按列放进去，三行是：一、一、一；一、二、二；零、零、一。E的三行是：一、二、一；一、三、五；一、二、四。'),
    dict(id='C07', pose='claude_write', sub='r₂ − r₁：左 (0, 1, 1)，右 (0, 1, 4)。第三行已经是 (0, 0, 1 | 1, 2, 4)。', read='第二行减第一行：左边零、一、一，右边零、一、四。第三行已经是零、零、一，竖线一、二、四。'),
    dict(id='C08', pose='claude_write', sub='r₂ − r₃：左 (0, 1, 0)，右 (−1, −1, 0)。r₁ − r₂ − r₃：左 (1, 0, 0)，右 (1, 2, 1) − (−1, −1, 0) − (1, 2, 4) = (1, 1, −3)。', read='第二行减第三行：左边零、一、零，右边负一、负一、零。第一行减第二行再减第三行：左边一、零、零，右边一、二、一，减负一、负一、零，再减一、二、四，等于一、一、负三。'),
    # 音效：shimmer @ 显影
    dict(id='C09', pose='claude_point', sub='S = [[1, 1, −3], [−1, −1, 0], [1, 2, 4]]。', read='S等于：一、一、负三；负一、负一、零；一、二、四。'),
    # 镜头：两套 3D 网格（金色 E 网格、青色 F 网格）同时铺开；点 x 在空间中固定，两个“里程表”分别滚动显示 x 在 E、F 下的坐标。
    dict(id='C10', pose='claude_explain', sub='现在求坐标。x = 3v₁ + 2v₂ − v₃，所以 x 在 E 下的坐标就是 (3, 2, −1)。直接读系数。', read='现在求坐标。x等于三v一加二v二减v三，所以x在E下的坐标，就是三、二、负一。直接读系数。'),
    dict(id='C11', pose='claude_write', sub='[x]_F = S(3, 2, −1)：第一行 3 + 2 + 3 = 8；第二行 −3 − 2 + 0 = −5；第三行 3 + 4 − 4 = 3。所以 (8, −5, 3)。', read='x的F坐标等于S乘三、二、负一：第一行三加二加三等于八；第二行负三减二加零等于负五；第三行三加四减四等于三。所以是八、负五、三。'),
    # 音效：count @ 里程表
    dict(id='C12', pose='claude_write', sub='y 的 E 坐标是 (1, −3, 2)。[y]_F = S(1, −3, 2) = (1 − 3 − 6, −1 + 3, 1 − 6 + 8) = (−8, 2, 3)。', read='y的E坐标是一、负三、二。y的F坐标等于S乘它：一减三减六，负一加三，一减六加八，也就是负八、二、三。'),
    # 镜头：验算：x 在标准坐标下 = (6, 4, 3)；8u₁ − 5u₂ + 3u₃ 三根箭头首尾相接，终点落在同一个点 (6, 4, 3)，打勾。
    dict(id='G02', pose='gpt_think', sub='验算：x = 3(1, 1, 1) + 2(2, 3, 2) − (1, 5, 4) = (6, 4, 3)。而 8u₁ − 5u₂ + 3u₃ = (8 − 5 + 3, 8 − 10 + 6, 3) = (6, 4, 3)。对上了。', read='验算：x等于三倍的一、一、一，加两倍的二、三、二，减一、五、四，等于六、四、三。而八u一减五u二加三u三，等于八减五加三、八减十加六、三，也是六、四、三。对上了。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='同一个点，两副眼镜，读出两组不同的坐标！', read='同一个点，两副眼镜，读出两组不同的坐标！'),
    dict(id='G03', pose='gpt_point', sub='如果按同济写法：从 E 到 F 的过渡矩阵是 E⁻¹F = S⁻¹。坐标公式变成 [x]_F = P⁻¹[x]_E，还得再求一次逆。所以这题用 Leon 写法最省事。', read='如果按同济写法：从E到F的过渡矩阵是E逆乘F，也就是S的逆。坐标公式变成x的F坐标等于P逆乘x的E坐标，还得再求一次逆。所以这道题用Leon写法最省事。'),
    # 镜头：套路卡：“[目标 | 出发] 一次消元 → S；坐标 = S × 系数；验算回到标准坐标。”
    dict(id='C13', pose='claude_smile', sub='套路卡：把目标基和出发基并排，一次消元得 S；坐标等于 S 乘系数；最后回到标准坐标验算。', read='套路卡：把目标基和出发基并排，一次消元得到S；坐标等于S乘系数；最后回到标准坐标验算。', post=500),
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
