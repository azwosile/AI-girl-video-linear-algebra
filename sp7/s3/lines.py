# -*- coding: utf-8 -*-
"""特别篇 7 · 第 3 段：附加题：线性变换换基。
原题：2015–16 第 4 题（13 分）：L(x)=Ax，A=[[3,−1,−2],[2,0,−2],[2,−1,−1]]，v₁=(1,1,1)，v₂=(1,2,0)，v₃=(0,−2,1)。求 {v}→{e} 的过渡矩阵 V，及 L 在 {v} 下的矩阵 B
台词源（唯一真源），由 mid/script/sp07.py 导出；数值见 verify_sp07.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2015–16 第 4 题 → 纸卡；角标“附加 · 超出今年范围的连接题”。
    dict(id='C01', pose='claude_point', sub='最后一道附加题，2015 到 2016 学年第 4 题。它把过渡矩阵和线性变换连在一起，是第四章的预告。', read='最后一道附加题，二零一五到二零一六学年第四题。它把过渡矩阵和线性变换连在一起，是第四章的预告。'),
    dict(id='C02', pose='claude_explain', sub='A 的三行是 (3, −1, −2)、(2, 0, −2)、(2, −1, −1)；v₁ = (1, 1, 1)，v₂ = (1, 2, 0)，v₃ = (0, −2, 1)。求从 {v} 到 {e} 的过渡矩阵，以及 L 在 {v} 下的矩阵 B。', read='A的三行是：三、负一、负二；二、零、负二；二、负一、负一。v一等于一、一、一，v二等于一、二、零，v三等于零、负二、一。求从v到标准基的过渡矩阵，以及L在v这组基下的矩阵B。'),
    dict(id='C03', pose='claude_explain', sub='第一问用上一集的“到谁用谁的逆”：到标准基 I，S = I⁻¹V = V。就是把 v 排成列。', read='第一问用特别篇五的口诀，到谁就用谁的逆：到标准基，S等于单位矩阵的逆乘V，也就是V本身。就是把v排成列。'),
    # 镜头：“两副眼镜”组件（回看 s4_3）：先戴 V 眼镜把 v 坐标翻译成标准坐标，A 在标准坐标里作用，再用 V⁻¹ 翻译回去。三个箭头组成 B = V⁻¹AV。
    dict(id='C04', pose='claude_explain', sub='第二问：B = V⁻¹AV。从右往左读：V 把 v 坐标翻译成标准坐标；A 在标准坐标里作用；V⁻¹ 再翻译回 v 坐标。', read='第二问：B等于V逆乘A乘V。从右往左读：V把v坐标翻译成标准坐标；A在标准坐标里作用；V逆再翻译回v坐标。'),
    dict(id='D01', mood='panic', pose='ds_confused', sub='三个 3×3 连乘，好累……', read='三个三乘三矩阵连乘，好累。'),
    dict(id='C05', pose='claude_smile', sub='有捷径：先看 A 对每个 vᵢ 做了什么。B 的第 i 列，就是 Avᵢ 在 {v} 下的坐标。', read='有捷径：先看A对每个v i做了什么。B的第i列，就是A乘v i在v这组基下的坐标。'),
    dict(id='C06', pose='claude_write', sub='Av₁ = (3 − 1 − 2, 2 + 0 − 2, 2 − 1 − 1) = (0, 0, 0)。Av₂ = (3 − 2, 2, 2 − 2) = (1, 2, 0) = v₂。', read='A乘v一，等于三减一减二、二加零减二、二减一减一，也就是零向量。A乘v二，等于三减二、二、二减二，也就是一、二、零，正是v二。'),
    dict(id='C07', pose='claude_write', sub='Av₃ = (0 + 2 − 2, 0 + 0 − 2, 0 + 2 − 1) = (0, −2, 1) = v₃。', read='A乘v三，等于零加二减二、零加零减二、零加二减一，也就是零、负二、一，正是v三。'),
    # 音效：shimmer @ 正是
    dict(id='C08', pose='claude_point', sub='所以 B 的三列是 (0, 0, 0)、(0, 1, 0)、(0, 0, 1)：B = diag(0, 1, 1)。', read='所以B的三列是零、零、零；零、一、零；零、零、一。B是对角矩阵，对角线上是零、一、一。'),
    # 镜头：斜网格动画：在 {v} 坐标系下，L 把 v₁ 方向压扁成 0，v₂、v₃ 方向不动——整个空间被投影到 v₂、v₃ 张成的平面上。
    dict(id='C09', pose='claude_explain', sub='几何意义：在 v 这副眼镜下，L 只是沿 v₁ 方向压扁，v₂、v₃ 方向不动。它是一个投影。', read='几何意义：戴上v这副眼镜，L只是沿着v一方向压扁，v二、v三方向保持不动。它是一个投影。'),
    dict(id='G01', pose='gpt_think', sub='验算：V⁻¹ = [[−2, 1, 2], [3, −1, −2], [2, −1, −1]]，真乘出来 V⁻¹AV = diag(0, 1, 1)。和捷径一致。', read='验算：V逆等于负二、一、二；三、负一、负二；二、负一、负一。真的乘出来，V逆A V等于对角零、一、一，和捷径一致。'),
    dict(id='G02', pose='gpt_proud', sub='这种“找一组基让矩阵变成对角的”，就是第六章的特征值与对角化。0 和 1 就是特征值。', read='这种找一组基、让矩阵变成对角矩阵的方法，就是第六章的特征值与对角化。零和一就是特征值。'),
    # 镜头：收尾：七集封面依次掠过；三个角色站在一起，背景大圆盘与网格缓缓旋转；字幕“期中加油”。
    dict(id='C10', pose='claude_smile', sub='七集特别篇到这里全部结束。十年真题，我们一题一题都验过了。考场上记住：先写定义，再算，最后验算。', read='七集特别篇，到这里全部结束。十年真题，我们一题一题都验过了。考场上记住：先写定义，再计算，最后验算。'),
    dict(id='D02', mood='daily', pose='ds_happy', sub='期中加油！', read='期中加油！'),
    dict(id='G03', pose='gpt_proud', sub='考完回来，我们继续第四章：线性变换。', read='考完回来，我们继续第四章，线性变换。'),
    # 音效：sparkle @ 加油
    dict(id='C11', pose='claude_smile', sub='下次见。', read='下次见。', post=1200),
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
