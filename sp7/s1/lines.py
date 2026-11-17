# -*- coding: utf-8 -*-
"""特别篇 7 · 第 1 段：判断题闪电战。
原题：2025–26 第 1 题（25 分，判断并说明理由）；2020–21 第 1 题；2021–22 第 1 题；2024–25 第 2 题；2023–24 第 1(5)、2(1) 题
台词源（唯一真源），由 mid/script/sp07.py 导出；数值见 verify_sp07.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：开场：屏幕中央连击计数器“COMBO 0”；左右两枚巨大的 T（青）/ F（红）印章悬停。规则卡：“判断 + 理由：F 必须给反例，T 必须给一句证明”。
    # 音效：riser @ 闪电战
    dict(id='C01', pose='claude_point', sub='最后一集。先来一场判断题闪电战。最新卷第 1 题 25 分，全是判断加理由。', read='最后一集。先来一场判断题闪电战。最新卷第一题，二十五分，全是判断加理由。'),
    dict(id='C02', pose='claude_explain', sub='规则：判 F，必须给一个具体反例；判 T，必须给一句证明。只写 T 或 F，拿不到几分。', read='规则：判F，必须给出一个具体的反例；判T，必须给出一句证明。只写T或F，拿不到几分。'),
    dict(id='D01', mood='easy', pose='ds_proud', sub='准备好了！连击开始！', read='准备好了！连击开始！'),
    # 镜头：第 1 题卡：“(A + B)² = A² + 2AB + B²”（2025–26 1(1)）。
    dict(id='C03', pose='claude_point', sub='第一题：(A + B)² = A² + 2AB + B²？', read='第一题：A加B的平方，等于A方加二AB加B方？'),
    dict(id='D02', mood='think', pose='ds_think', sub='F！展开是 A² + AB + BA + B²，矩阵乘法不交换，AB 不一定等于 BA。', read='F！展开是A方加AB加BA加B方，矩阵乘法不交换，AB不一定等于BA。'),
    # 镜头：反例小动画：A = [[0,1],[0,0]]，B = [[0,0],[1,0]]；左边算出 I，右边算出 [[2,0],[0,0]]，两个结果“碰撞”后弹开。F 印章砸下，屏幕轻震，COMBO 1。
    dict(id='C04', pose='claude_write', sub='反例：A = [[0, 1], [0, 0]]，B = [[0, 0], [1, 0]]。A + B = [[0, 1], [1, 0]]，平方是 I；而 A² + 2AB + B² = [[2, 0], [0, 0]]。', read='反例：A等于零、一；零、零，B等于零、零；一、零。A加B等于零、一；一、零，平方是单位矩阵；而A方加二AB加B方，等于二、零；零、零。'),
    # 音效：stamp @ F
    # 镜头：第 2 题卡：“x, y ∈ ℝⁿ（n > 0），则 det(xyᵀ) = 0”（2025–26 1(2)）。卡片角上有一个闪烁的小问号。
    dict(id='C05', pose='claude_point', sub='第二题，陷阱题：x、y 属于 ℝⁿ，n > 0，那么 det(xyᵀ) = 0？', read='第二题，陷阱题：x、y属于R n，n大于零，那么x乘y转置的行列式等于零？'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='T！xyᵀ 的每一行都是 yᵀ 的倍数，秩最多 1，比 n 小，所以奇异！', read='T！x乘y转置，每一行都是y转置的倍数，秩最多是一，比n小，所以奇异！'),
    dict(id='G01', pose='gpt_cross', sub='等等，n > 0 包括 n = 1。n = 1 时 xyᵀ 就是一个数 xy，1×1 矩阵，比如 x = 2，y = 3，行列式是 6，不是 0。', read='等等，n大于零，包括n等于一。n等于一的时候，x乘y转置就是一个数，一乘一矩阵。比如x等于二，y等于三，行列式是六，不是零。'),
    # 音效：glitch @ n = 1
    dict(id='D04', mood='panic', pose='ds_shock', sub='啊！秩 ≤ 1 < n，这一步要求 n ≥ 2！', read='啊！秩小于等于一、小于n，这一步要求n大于等于二！'),
    dict(id='C06', pose='claude_explain', sub='严格按题面，应该判 F，反例 n = 1。考场上最稳的写法：“n ≥ 2 时成立，理由是秩 ≤ 1 < n；n = 1 时不成立，反例 x = 2，y = 3。”两种情况都写，怎么判都给分。', read='严格按题面，应该判F，反例是n等于一。考场上最稳的写法：n大于等于二时成立，理由是秩小于等于一、小于n；n等于一时不成立，反例x等于二，y等于三。两种情况都写，怎么判都给分。'),
    # 镜头：印章 T 和 F 同时落下、半边叠合，写着“分情况”；COMBO 2。
    # 音效：stamp @ 分情况
    # 镜头：第 3 题卡：“v₁, …, vₛ 无关，v₁, …, vₛ, v 相关 ⇒ v ∈ Span(v₁, …, vₛ)”（2025–26 1(3)）。
    dict(id='C07', pose='claude_point', sub='第三题：v₁ 到 vₛ 线性无关，加上 v 以后线性相关，那么 v 在它们的张成里？', read='第三题：v一到v s线性无关，加上v以后线性相关，那么v在它们的张成里？'),
    dict(id='D05', mood='think', pose='ds_think', sub='T。有一组不全为零的 c 和 k，使 c₁v₁ + … + cₛvₛ + kv = 0。', read='T。存在一组不全为零的c和k，使得c一v一加到c s v s，再加k v，等于零。'),
    dict(id='C08', pose='claude_explain', sub='关键一步：k ≠ 0。如果 k = 0，就剩下 c₁v₁ + … + cₛvₛ = 0，系数不全为零，和 v₁…vₛ 无关矛盾。所以 k ≠ 0，两边除以 k，v 就写成了它们的组合。', read='关键一步：k不等于零。如果k等于零，就剩下c一v一加到c s v s等于零，系数不全为零，和v一到v s无关矛盾。所以k不等于零，两边除以k，v就写成了它们的组合。'),
    dict(id='G02', pose='gpt_point', sub='评分点就在“k ≠ 0”这一句。漏了它，证明不完整。', read='评分点就在k不等于零这一句。漏了它，证明就不完整。'),
    # 音效：stamp @ T
    # 镜头：第 4 题卡：“对某个非零 x 有 Ax = Bx ⇒ A = B”（2025–26 1(4)）。COMBO 3。
    dict(id='C09', pose='claude_point', sub='第四题：对某个非零向量 x，Ax = Bx，那么 A = B？', read='第四题：对某个非零向量x，A x等于B x，那么A等于B？'),
    dict(id='D06', mood='easy', pose='ds_proud', sub='F！只是一个 x 而已。A = [[1, 0], [0, 0]]，B = I，x = (1, 0)，Ax = Bx = (1, 0)，可是 A ≠ B。', read='F！只是一个x而已。A等于一、零；零、零，B等于单位矩阵，x等于一、零，A x和B x都等于一、零，可是A不等于B。'),
    dict(id='C10', pose='claude_smile', sub='对。要“对所有 x 都成立”才能推出 A = B——代入 e₁ 到 eₙ，每一列都相等。', read='对。要对所有的x都成立，才能推出A等于B，代入e一到e n，每一列都相等。'),
    # 音效：stamp @ F
    # 镜头：第 5 题卡：“AB = 4I ⇒ A 非奇异”（2025–26 1(5)）；贴“回看 速成版”标签。COMBO 4。
    dict(id='C11', pose='claude_point', sub='第五题：AB = 4I，A 非奇异？', read='第五题：AB等于四倍单位矩阵，A非奇异？'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='T！两边取行列式：det A · det B = 4ⁿ ≠ 0，所以 det A ≠ 0。或者直接写 A 的逆是 B/4。', read='T！两边取行列式：A的行列式乘B的行列式，等于四的n次方，不为零，所以A的行列式不为零。或者直接写A的逆是四分之一B。'),
    # 音效：stamp @ T
    # 镜头：COMBO 5：屏幕爆出“最新卷第 1 题 · 全清”的字样，粒子四散。
    # 音效：sparkle @ 全清
    dict(id='C12', pose='claude_explain', sub='最新卷第 1 题清完。接下来是往年的判断题，速度再快一点。', read='最新卷第一题清完。接下来是往年的判断题，速度再快一点。'),
    # 镜头：往年卷判断题，卡片快速翻出，每张约 15 秒。
    dict(id='C13', pose='claude_point', sub='AB = AC，且 A ≠ O，那么 B = C？', read='AB等于AC，并且A不等于零矩阵，那么B等于C？'),
    dict(id='D08', mood='think', pose='ds_think', sub='F。A = [[1, 0], [0, 0]]，B = [[0, 0], [0, 1]]，C = O：AB = O = AC，但 B ≠ C。A 不可逆，就不能消去。', read='F。A等于一、零；零、零，B等于零、零；零、一，C等于零矩阵：AB等于零，AC也等于零，但B不等于C。A不可逆，就不能消去。'),
    # 音效：stamp @ F
    dict(id='C14', pose='claude_point', sub='x、y 非零，A = xyᵀ 的行阶梯形恰好有一个非零行？', read='x、y都非零，A等于x乘y转置，它的行阶梯形恰好有一个非零行？'),
    dict(id='D09', mood='easy', pose='ds_happy', sub='T。每一行都是 yᵀ 的倍数，x 非零所以至少一行非零，消元后只剩一行。秩恰好是 1。', read='T。每一行都是y转置的倍数，x非零，所以至少有一行非零，消元后只剩一行。秩恰好是一。'),
    # 音效：stamp @ T
    dict(id='C15', pose='claude_point', sub='det(A + B) = det A + det B？', read='A加B的行列式，等于A的行列式加B的行列式？'),
    dict(id='D10', mood='easy', pose='ds_proud', sub='F。A = B = I（2 阶）：det(2I) = 4，而 1 + 1 = 2。', read='F。A和B都取二阶单位矩阵：两倍单位矩阵的行列式是四，而一加一等于二。'),
    # 音效：stamp @ F
    dict(id='C16', pose='claude_point', sub='det(αA) = α det A？', read='阿尔法乘A的行列式，等于阿尔法乘A的行列式？'),
    dict(id='D11', mood='think', pose='ds_think', sub='F。每一行都提出一个 α，是 αⁿ det A。比如 det(3I₂) = 9，不是 3。', read='F。每一行都提出一个阿尔法，所以是阿尔法的n次方乘A的行列式。比如三倍的二阶单位矩阵，行列式是九，不是三。'),
    # 音效：stamp @ F
    dict(id='C17', pose='claude_point', sub='A 非奇异，则 AᵀA 非奇异？', read='A非奇异，那么A转置乘A非奇异？'),
    dict(id='D12', mood='easy', pose='ds_happy', sub='T。det(AᵀA) = det Aᵀ · det A = (det A)² ≠ 0。', read='T。A转置乘A的行列式，等于A转置的行列式乘A的行列式，也就是A的行列式的平方，不为零。'),
    # 音效：stamp @ T
    dict(id='C18', pose='claude_point', sub='A ≠ O，AB = O，那么 det B = 0？（方阵）', read='A不是零矩阵，AB等于零矩阵，那么B的行列式等于零？这里都是方阵。'),
    dict(id='D13', mood='think', pose='ds_think', sub='T。反证：如果 B 可逆，右乘 B⁻¹ 得 A = O，矛盾。', read='T。用反证：如果B可逆，两边右乘B逆，得到A等于零矩阵，矛盾。'),
    # 音效：stamp @ T
    dict(id='C19', pose='claude_point', sub='y、z 都是 Ax = b 的解，则 y − z 是 Ax = 0 的解？', read='y和z都是A x等于b的解，那么y减z是A x等于零的解？'),
    dict(id='D14', mood='easy', pose='ds_happy', sub='T。A(y − z) = Ay − Az = b − b = 0。', read='T。A乘y减z，等于A y减A z，等于b减b，等于零。'),
    # 音效：stamp @ T
    # 镜头：子空间三连：卡片上画出 3D 坐标系里的图形。
    dict(id='C20', pose='claude_point', sub='子空间三连。第一个：S ∩ T 是子空间？', read='子空间三连。第一个：S交T是子空间吗？'),
    dict(id='D15', mood='easy', pose='ds_proud', sub='T！两边都封闭，交集里的向量做加法、数乘，结果还在两边里。', read='T！两边都封闭，交集里的向量做加法和数乘，结果还在两边里。'),
    dict(id='C21', pose='claude_point', sub='S ∪ T 呢？', read='那S并T呢？'),
    dict(id='D16', mood='think', pose='ds_think', sub='F。x 轴并 y 轴：(1, 0) + (0, 1) = (1, 1)，两条轴上都没有。', read='F。x轴并y轴：一、零加零、一，等于一、一，两条轴上都没有。'),
    dict(id='C22', pose='claude_point', sub='{x | x₃ = x₁ 或 x₃ = x₂} 是子空间？', read='满足x三等于x一，或者x三等于x二的向量，构成子空间吗？'),
    dict(id='D17', mood='easy', pose='ds_happy', sub='F，这也是两张平面的并！(1, 0, 1) + (0, 1, 1) = (1, 1, 2)，第三个分量 2 既不等于 1 也不等于 1。', read='F，这也是两张平面的并！一、零、一，加零、一、一，等于一、一、二，第三个分量二，既不等于第一个分量，也不等于第二个分量。'),
    # 镜头：“或”字被放大，红圈圈住，旁边写“或 = 并集 = 危险”。
    dict(id='G03', pose='gpt_point', sub='看到“或”字，十有八九是并集，判 F；看到“且”字，是交集，通常 T。', read='看到或字，十有八九是并集，判F；看到且字，是交集，通常是T。'),
    dict(id='C23', pose='claude_point', sub='子空间 U 中，x + y ∈ U，那么 x ∈ U 且 y ∈ U？', read='U是子空间，x加y属于U，那么x属于U且y属于U？'),
    dict(id='D18', mood='think', pose='ds_think', sub='F。U = {0}，x = e₁，y = −e₁：x + y = 0 ∈ U，但 x 不在 U 里。', read='F。U只含零向量，x等于e一，y等于负e一：x加y等于零，属于U，但x不在U里。'),
    dict(id='C24', pose='claude_point', sub='向量空间里的零元唯一？', read='向量空间里的零元唯一吗？'),
    dict(id='D19', mood='easy', pose='ds_happy', sub='T。假设 0 和 0′ 都是零元：0 = 0 + 0′ = 0′。', read='T。假设零和零撇都是零元：零等于零加零撇，又等于零撇。'),
    dict(id='C25', pose='claude_point', sub='最后一题：RREF 有自由变量 ⇒ Ax = b 有无穷多解？', read='最后一题：RREF有自由变量，那么A x等于b有无穷多解？'),
    dict(id='D20', mood='easy', pose='ds_proud', sub='T！有自由变量就——', read='T！有自由变量就'),
    # 音效：buzz @ 有自由变量就
    dict(id='C26', pose='claude_surprise', sub='小心！可能根本无解。比如增广矩阵 [[1, 1 | 0], [0, 0 | 1]]：x₂ 是自由变量，可是第二行 0 = 1。要先有解，才谈得上无穷多。', read='小心！可能根本无解。比如增广矩阵第一行一、一，竖线零；第二行零、零，竖线一：x二是自由变量，可是第二行写的是零等于一。要先有解，才谈得上无穷多。'),
    dict(id='D21', mood='sigh', pose='ds_confused', sub='连击断了……判 F。', read='连击断了。判F。'),
    # 镜头：COMBO 计数器碎裂后重组，定格在“COMBO 17”；底部总结卡：“F 给反例：2×2 小矩阵、坐标轴、n = 1；T 给证明：行列式、反证、移项”。
    dict(id='C27', pose='claude_smile', sub='十七连，已经非常强了。记住两个工具箱：反例用 2×2 小矩阵、坐标轴、n = 1；证明用行列式、反证、移项。', read='十七连，已经非常强了。记住两个工具箱：反例用二乘二的小矩阵、坐标轴、n等于一；证明用行列式、反证、移项。', post=500),
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
