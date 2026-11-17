# -*- coding: utf-8 -*-
"""特别篇 1 · 第 6 段：矩阵方程：左乘还是右乘。
原题：2020–21 第 2 题（10 分）：A=[[3,1],[5,2]]，B=[[1,2],[3,4]]，(a) AX=B，(b) YA−Y=B
台词源（唯一真源），由 mid/script/sp01.py 导出；数值见 verify_sp01.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：原题三步：2020–21 第 2 题 → 纸卡 → 排版：A = [[3,1],[5,2]]，B = [[1,2],[3,4]]；两问并列。
    dict(id='C01', pose='claude_point', sub='2020 到 2021 学年第 2 题，10 分。A = [[3, 1], [5, 2]]，B = [[1, 2], [3, 4]]。', read='二零二零到二零二一学年第二题，十分。A是二乘二矩阵，第一行三、一，第二行五、二；B第一行一、二，第二行三、四。'),
    dict(id='C02', pose='claude_explain', sub='(a) 求 X，使 AX = B。(b) 求 Y，使 YA − Y = B。', read='第一问，求X，使得A X 等于B。第二问，求Y，使得Y A 减Y等于B。'),
    # 镜头：求 A⁻¹：二阶公式动画——主对角线 3、2 交换位置，副对角线 1、5 变号，整体除以 det = 1。
    dict(id='C03', pose='claude_explain', sub='先求 A⁻¹。det A = 3×2 − 1×5 = 1。二阶求逆口诀：主对角线换位置，副对角线变号，再除以行列式。', read='先求A的逆。A的行列式等于三乘二减一乘五，等于一。二阶求逆的口诀：主对角线换位置，副对角线变号，再除以行列式。'),
    dict(id='C04', pose='claude_write', sub='A⁻¹ = [[2, −1], [−5, 3]]。', read='A的逆，第一行二、负一，第二行负五、三。'),
    dict(id='C05', pose='claude_explain', sub='(a)：AX = B，A 在 X 的左边，所以两边从左边乘 A⁻¹：X = A⁻¹B。', read='第一问：A X 等于B，A在X的左边，所以两边都从左边乘上A的逆：X等于A的逆乘B。'),
    # 镜头：A⁻¹B 的行×列扫描：每算一个元素，对应行与列高亮。结果 [[−1, 0], [4, 2]]。
    dict(id='C06', pose='claude_write', sub='第一行：(2, −1) 点乘 (1, 3) 得 −1，点乘 (2, 4) 得 0。第二行：(−5, 3) 点乘 (1, 3) 得 4，点乘 (2, 4) 得 2。', read='第一行：二、负一，点乘一、三，得负一；点乘二、四，得零。第二行：负五、三，点乘一、三，得四；点乘二、四，得二。'),
    dict(id='C07', pose='claude_point', sub='X = [[−1, 0], [4, 2]]。', read='X第一行负一、零，第二行四、二。'),
    # 镜头：(b)：YA − Y = B。大肥鱼在黑板上写 “Y(A − 1) = B”，粉笔“1”下方红色波浪线。
    dict(id='D01', mood='easy', pose='ds_proud', sub='第二问我来！YA − Y，提出 Y：Y(A − 1) = B……', read='第二问我来！Y A 减Y，提出Y：Y乘A减一，等于B。'),
    dict(id='G01', pose='gpt_cross', sub='A 是矩阵，1 是数。矩阵减数，没有定义。', read='A是矩阵，一是数。矩阵减一个数，没有定义。'),
    dict(id='C08', pose='claude_explain', sub='Y 本身要写成 YI，才能和 YA 合并：YA − YI = Y(A − I)。', read='Y本身要写成Y乘单位矩阵I，才能和Y A 合并：Y A 减Y I，等于Y乘A减I。'),
    dict(id='D02', mood='think', pose='ds_think', sub='好，Y(A − I) = B，那 Y = (A − I)⁻¹ B。', read='好，Y乘A减I等于B，那Y就等于A减I的逆，乘B。'),
    # 镜头：积木动画：Y、(A − I)、B 三块矩阵积木。大肥鱼把 (A − I)⁻¹ 贴到 B 的左边，积木“卡不进去”，抖动并弹开；Claude 把它挪到 B 的右边，咔哒贴合。
    # 音效：buzz @ 卡不进去
    # 音效：click @ 右边
    dict(id='C09', pose='claude_explain', sub='这是全题最大的坑。A − I 在 Y 的右边，要消掉它，就得从右边乘它的逆。矩阵不能“除”，从哪边乘进来，就从哪边消掉。', read='这是全题最大的坑。A减I在Y的右边，要消掉它，就得从右边乘上它的逆。矩阵不能除，从哪边乘进来，就从哪边消掉。'),
    dict(id='C10', pose='claude_point', sub='所以 Y = B(A − I)⁻¹。写成 (A − I)⁻¹B，结果完全不同，这一问就没分了。', read='所以Y等于B，右乘A减I的逆。顺序一旦写反，把逆放到B的左边，结果完全不同，这一问就没分了。'),
    dict(id='C11', pose='claude_write', sub='A − I = [[2, 1], [5, 1]]，行列式 2 − 5 = −3。逆矩阵 = −⅓ [[1, −1], [−5, 2]] = [[−⅓, ⅓], [5/3, −⅔]]。', read='A减I，第一行二、一，第二行五、一，行列式二减五，等于负三。它的逆等于负三分之一，乘上第一行一、负一，第二行负五、二。也就是第一行负三分之一、三分之一，第二行三分之五、负三分之二。'),
    dict(id='C12', pose='claude_write', sub='B 乘它。第一行：(1, 2)，得 (−⅓ + 10/3, ⅓ − 4/3) = (3, −1)。', read='用B乘它。第一行一、二：得到负三分之一加三分之十，和三分之一减三分之四，也就是三、负一。'),
    dict(id='C13', pose='claude_write', sub='第二行：(3, 4)，得 (−1 + 20/3, 1 − 8/3) = (17/3, −5/3)。', read='第二行三、四：得到负一加三分之二十，和一减三分之八，也就是三分之十七、负三分之五。'),
    dict(id='C14', pose='claude_point', sub='Y = [[3, −1], [17/3, −5/3]]。', read='Y第一行三、负一，第二行三分之十七、负三分之五。'),
    # 镜头：验算：Y 第一行 (3, −1) 乘 (A − I)，得 (6 − 5, 3 − 1) = (1, 2)，与 B 第一行重合，打勾。
    dict(id='G02', pose='gpt_think', sub='分数多的题一定验算。拿 Y 的第一行乘 A − I：(3·2 − 1·5, 3·1 − 1·1) = (1, 2)，正是 B 的第一行。', read='分数多的题一定要验算。拿Y的第一行乘A减I：三乘二减一乘五，三乘一减一乘一，得到一、二，正是B的第一行。'),
    dict(id='D03', mood='sigh', pose='ds_confused', sub='要是用错的那个，验算一下就露馅了……', read='要是用错的那个，验算一下就露馅了。'),
    # 镜头：快问三连：三张卡片依次翻开——① XA = B；② AXB = C；③ XA + B = X。每张停 3 秒后翻出答案。
    # 音效：count
    dict(id='C15', pose='claude_point', sub='趁热打铁，三连快问。第一个，XA = B。', read='趁热打铁，三连快问。第一个：X A 等于B。'),
    dict(id='D04', mood='think', pose='ds_think', sub='A 在右边，右乘 A⁻¹：X = BA⁻¹。', read='A在右边，右乘A的逆：X等于B乘A的逆。'),
    dict(id='C16', pose='claude_point', sub='第二个，AXB = C。', read='第二个：A X B 等于C。'),
    dict(id='D05', mood='think', pose='ds_think', sub='左边有 A，右边有 B……X = A⁻¹CB⁻¹。', read='左边有A，右边有B，那X等于A的逆乘C乘B的逆。'),
    dict(id='C17', pose='claude_point', sub='第三个，XA + B = X。', read='第三个：X A 加B等于X。'),
    dict(id='D06', mood='think', pose='ds_confused', sub='把 X 挪到左边：XA − X = −B，提出来补 I：X(A − I) = −B，X = −B(A − I)⁻¹。', read='把X挪到左边：X A 减X等于负B；提出来补上I：X乘A减I等于负B；所以X等于负B乘A减I的逆。'),
    dict(id='C18', pose='claude_smile', sub='三个全对。前提是 A、B、A − I 都可逆，答卷上要提一句。', read='三个全对。前提是A、B、A减I都可逆，答卷上要提一句。'),
    # 镜头：套路卡：“提公因子写 I；在哪边，从哪边乘逆；分数答案必验算一行。”
    dict(id='C19', pose='claude_smile', sub='套路卡：提公因子要补 I；矩阵在哪边，就从哪边乘逆；分数答案，至少验算一行。', read='套路卡：提公因子要补上I；矩阵在哪边，就从哪边乘逆；答案有分数，至少验算一行。', post=500),
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
