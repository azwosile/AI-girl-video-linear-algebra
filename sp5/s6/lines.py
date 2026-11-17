# -*- coding: utf-8 -*-
"""特别篇 5 · 第 6 段：反过来：已知 S 求新基。
原题：2015–16 第 3 题：v₁=(2,6)，v₂=(1,4)，S=[[4,1],[2,1]] 为 {v₁,v₂}→{u₁,u₂} 的过渡矩阵，求 u₁、u₂
台词源（唯一真源），由 mid/script/sp05.py 导出；数值见 verify_sp05.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2015–16 第 3 题 → 纸卡。2D 平面上 v₁、v₂ 两根箭头已知，u₁、u₂ 位置是两个问号。
    dict(id='C01', pose='claude_point', sub='最后一题反着问。2015 到 2016 学年第 3 题：v₁ = (2, 6)，v₂ = (1, 4)，S = [[4, 1], [2, 1]] 是从 {v} 到 {u} 的过渡矩阵，求 u₁、u₂。', read='最后一道题，反着问。二零一五到二零一六学年第三题：v一等于二、六，v二等于一、四，S是从v到u的过渡矩阵，S等于四、一；二、一。求u一、u二。'),
    dict(id='D01', mood='panic', pose='ds_confused', sub='平时是已知两组基求 S，现在已知 S 求基？', read='平时是已知两组基求S，现在是已知S求基？'),
    dict(id='C02', pose='claude_explain', sub='公式反过来用就行。Leon：从 V 到 U 的过渡矩阵 S = U⁻¹V。两边左乘 U：US = V，再右乘 S⁻¹：U = VS⁻¹。', read='公式反过来用就行。按Leon：从V到U的过渡矩阵S等于U逆乘V。两边左乘U，得到U S 等于V；再右乘S逆，得到U等于V乘S逆。'),
    dict(id='C03', pose='claude_write', sub='S⁻¹：det S = 4 − 2 = 2，S⁻¹ = ½[[1, −1], [−2, 4]] = [[1/2, −1/2], [−1, 2]]。', read='先求S逆：S的行列式等于四减二，等于二。S逆等于二分之一乘一、负一；负二、四，也就是二分之一、负二分之一；负一、二。'),
    dict(id='C04', pose='claude_write', sub='V = [[2, 1], [6, 4]]（v₁、v₂ 按列）。VS⁻¹ 的第一列：2 × ½ + 1 × (−1) = 0，6 × ½ + 4 × (−1) = −1，所以 u₁ = (0, −1)。', read='V等于二、一；六、四，v一和v二按列放。V乘S逆的第一列：二乘二分之一加一乘负一，等于零；六乘二分之一加四乘负一，等于负一。所以u一等于零、负一。'),
    dict(id='C05', pose='claude_write', sub='第二列：2 × (−½) + 1 × 2 = 1，6 × (−½) + 4 × 2 = 5，所以 u₂ = (1, 5)。', read='第二列：二乘负二分之一加一乘二，等于一；六乘负二分之一加四乘二，等于五。所以u二等于一、五。'),
    # 镜头：2D：u₁ = (0, −1)、u₂ = (1, 5) 两根箭头出现，青色 u 网格铺开；v₁ 的箭头被 u 网格“量”出：4 格 u₁ + 2 格 u₂。
    dict(id='G01', pose='gpt_think', sub='验算：S 的第一列 (4, 2) 说的是 v₁ = 4u₁ + 2u₂ = (0, −4) + (2, 10) = (2, 6)。正是 v₁。', read='验算：S的第一列四、二，说的是v一等于四u一加二u二，等于零、负四，加二、十，等于二、六。正是v一。'),
    dict(id='D02', mood='think', pose='ds_think', sub='原来 S 的列，就是旧基在新基下的坐标。', read='原来S的列，就是旧基在新基下的坐标。'),
    dict(id='C06', pose='claude_smile', sub='对，这是 Leon 定义最直观的读法：S 的第 j 列 = vⱼ 在 {u} 下的坐标。记住这一句，正着反着都能做。', read='对，这是Leon定义最直观的读法：S的第j列，等于v j 在u下的坐标。记住这一句，正着问反着问都能做。'),
    # 镜头：本集总结：四张套路卡（约定之战 / [目标|出发] 一次消元 / 从标准基出发 / S 的列 = 旧基新坐标）扇形展开。
    dict(id='C07', pose='claude_explain', sub='这一集：先写定义式；到谁就用谁的逆；[目标 | 出发] 一次消元；S 的列是旧基在新基下的坐标。', read='这一集：先写定义式；到谁就用谁的逆；目标和出发并排，一次消元；S的列，是旧基在新基下的坐标。'),
    dict(id='G02', pose='gpt_proud', sub='下一集是压轴：RREF 反推。24 分的大题，还有一道原题本身就有 bug。', read='下一集是压轴：RREF反推。二十四分的大题，还有一道原题本身就有bug。'),
    dict(id='D03', mood='daily', pose='ds_shock', sub='原题有 bug？！', read='原题有bug？'),
    dict(id='C08', pose='claude_smile', sub='下一集揭晓。', read='下一集揭晓。', post=800),
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
