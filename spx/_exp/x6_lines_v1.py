# -*- coding: utf-8 -*-
"""特别篇 · 期中速成 x6：过渡矩阵与坐标（2025–26 第 5 题 = 2021–22 第 6 题数据）台词源。
数值：S = F⁻¹E = [[1,1,−3],[−1,−1,0],[1,2,4]]；x = 3v₁+2v₂−v₃ = (6,4,3)，[x]_F = (8,−5,3)；y = v₁−3v₂+2v₃，[y]_F = (−8,2,3)。
[F|E] → [I|S] 只需三步：R₂−R₁，R₁−R₂，R₂−R₃。
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='第六段：过渡矩阵。2025–2026 卷 15 分，2021–2022 卷用的是同一组数据——这题值得练透。', read='第六段：过渡矩阵。二零二五到二零二六学年的卷子，十五分；二零二一到二零二二学年的卷子，用的是同一组数据。这道题值得练透。'),
    dict(id='D01', mood='panic', pose='ds_shock', sub='过渡矩阵我永远分不清是谁乘谁……', read='过渡矩阵，我永远分不清是谁乘谁。'),
    dict(id='C02', pose='claude_explain', sub='那就别背公式，背一个画面：同一个向量，戴两副不同的眼镜看，读出来的坐标不一样。', read='那就别背公式，背一个画面：同一个向量，戴两副不同的眼镜去看，读出来的坐标不一样。'),
    dict(id='C03', pose='claude_point', sub='原题：E = [v₁, v₂, v₃]，F = [u₁, u₂, u₃] 是 R³ 的两组基。求 E 到 F 的过渡矩阵；再求 x = 3v₁ + 2v₂ − v₃、y = v₁ − 3v₂ + 2v₃ 在 F 下的坐标。', read='原题：E和F，是R三的两组基，各由三个列向量组成。求从E到F的过渡矩阵；再求x和y在F下的坐标。x是三v一加二v二减v三，y是v一减三v二加二v三。'),
    dict(id='C04', pose='claude_explain', sub='先看 x 本人。按 E 的说明书走：3 步 v₁、2 步 v₂、退 1 步 v₃，到达 (6, 4, 3)。所以 x 的 E 坐标 = (3, 2, −1)。', read='先看x本人。按E的说明书走：三步v一，两步v二，退一步v三，到达六、四、三。所以x在E下的坐标，是三、二、负一。'),
    dict(id='C05', pose='claude_explain', sub='换 F 的眼镜：同一个点 (6, 4, 3)，要走 8 步 u₁、退 5 步 u₂、再走 3 步 u₃。x 的 F 坐标 = (8, −5, 3)。', read='换上F的眼镜：同一个点，六四三，要走八步u一，退五步u二，再走三步u三。所以x在F下的坐标，是八、负五、三。'),
    dict(id='G01', pose='gpt_point', sub='点没动，只是“说明书”换了。过渡矩阵就是这本翻译词典：把 E 坐标翻成 F 坐标。', read='点没有动，只是说明书换了。过渡矩阵，就是这本翻译词典：把E坐标，翻译成F坐标。'),
    dict(id='C06', pose='claude_explain', sub='翻译分两步。第一步：E 坐标 → 标准坐标，乘 E。因为 E·(3, 2, −1) 就是 3v₁ + 2v₂ − v₃。', read='翻译分两步。第一步，E坐标翻成标准坐标：乘以E。因为E乘三、二、负一，就是三v一加二v二减v三。'),
    dict(id='C07', pose='claude_explain', sub='第二步：标准坐标 → F 坐标，乘 F⁻¹。两步合起来：S = F⁻¹E，F 坐标 = S × E 坐标。', read='第二步，标准坐标翻成F坐标：乘以F的逆。两步合起来，S等于F逆乘E，x的F坐标，等于S乘x的E坐标。'),
    dict(id='D02', mood='think', pose='ds_think', sub='“从右往左读”：先 E 再 F⁻¹……好像记住了。', read='从右往左读：先乘E，再乘F逆。好像记住了。'),
    dict(id='C08', pose='claude_point', sub='怎么算 F⁻¹E？不用真的求逆。把 [F | E] 并排，消元把左边变成 I，右边自动变成 F⁻¹E。', read='怎么算F逆乘E？不用真的求逆。把F和E并排写，做消元，把左边变成单位矩阵，右边自动就变成F逆乘E。'),
    dict(id='C09', pose='claude_explain', sub='第一步：R₂ 减 R₁。', read='第一步：第二行减第一行。'),
    dict(id='C10', pose='claude_explain', sub='第二步：R₁ 减 R₂，第一行左边变成 (1, 0, 0)。', read='第二步：第一行减第二行，第一行的左边变成一、零、零。'),
    dict(id='C11', pose='claude_explain', sub='第三步：R₂ 减 R₃。左边变成 I——只用了三步！', read='第三步：第二行减第三行。左边变成单位矩阵，只用了三步！'),
    dict(id='C12', pose='claude_point', sub='右边就是答案：S = [[1, 1, −3], [−1, −1, 0], [1, 2, 4]]。', read='右边就是答案：S的三行是：一、一、负三；负一、负一、零；一、二、四。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='比先求 F⁻¹ 再乘快多了！', read='比先求F逆再相乘，快多了！'),
    dict(id='C13', pose='claude_explain', sub='再算坐标：x 的 F 坐标 = S · (3, 2, −1)。第一行 3 + 2 + 3 = 8；第二行 −3 − 2 + 0 = −5；第三行 3 + 4 − 4 = 3。', read='再算坐标：x的F坐标，等于S乘三、二、负一。第一行：三加二加三，等于八；第二行：负三减二加零，等于负五；第三行：三加四减四，等于三。'),
    dict(id='C14', pose='claude_point', sub='(8, −5, 3)，和刚才 3D 里走出来的一模一样。', read='八、负五、三，和刚才三维图里走出来的一模一样。'),
    dict(id='C15', pose='claude_explain', sub='y 同理：E 坐标 (1, −3, 2)，S 乘它：1 − 3 − 6 = −8；−1 + 3 + 0 = 2；1 − 6 + 8 = 3。y 的 F 坐标 = (−8, 2, 3)。', read='y同理：y的E坐标是一、负三、二，S乘它：一减三减六，等于负八；负一加三加零，等于二；一减六加八，等于三。所以y的F坐标是负八、二、三。'),
    dict(id='G02', pose='gpt_explain', sub='自检：F · (8, −5, 3) 应该回到 (6, 4, 3)。8 − 5 + 3 = 6，8 − 10 + 6 = 4，最后 3。全对。', read='自检一下：F乘八、负五、三，应该回到六、四、三。八减五加三，等于六；八减十加六，等于四；最后是三。全对。'),
    dict(id='G03', pose='gpt_cross', sub='注意教材约定！Leon：F 坐标 = S × E 坐标，S = F⁻¹E。同济：过渡矩阵 P 满足 (u₁, u₂, u₃) = (v₁, v₂, v₃)P，P = E⁻¹F。', read='注意教材约定！英文教材里，S满足F坐标等于S乘E坐标，S等于F逆乘E。同济教材里，过渡矩阵P满足：新基等于旧基乘P，P等于E逆乘F。'),
    dict(id='C16', pose='claude_point', sub='两者互为逆矩阵：P = S⁻¹。本卷题目用的是英文表述，按 Leon 写 S；保险起见，答卷上写清“F 坐标 = S × E 坐标”。', read='两者互为逆矩阵：P等于S的逆。这份卷子是英文题，按英文教材写S；保险起见，答卷上加一句：F坐标等于S乘E坐标。'),
    dict(id='D04', mood='sigh', pose='ds_think', sub='写清楚方向，阅卷老师就不会误会。', read='写清楚方向，阅卷老师就不会误会了。'),
    dict(id='C17', pose='claude_smile', sub='套路卡⑩：S = F⁻¹E，从右往左读——先进标准坐标，再出到 F。计算用 [F | E] → [I | S]；坐标 = S × 旧坐标；最后用 F × 新坐标回代自检。', read='套路卡十：S等于F逆乘E，从右往左读，先进入标准坐标，再出到F。计算用F和E并排消元；新坐标等于S乘旧坐标；最后用F乘新坐标，回代自检。'),
    dict(id='D05', mood='easy', pose='ds_proud', sub='下一段：压轴的 RREF 反推！', read='下一段：压轴的RREF反推！'),
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
