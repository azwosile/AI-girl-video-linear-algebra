# -*- coding: utf-8 -*-
"""第 5 章 复习（上）判断题（Leon 9th Chapter 5 Test A 全 10 题）台词源（唯一真源）。
答案：1F 2F 3F 4F 5T 6F 7T 8T 9T 10F。大肥鱼 6 / 10（对 3、4、5、7、8、9；错 1、2、6、10）。
形式：题卡 → 大肥鱼抢答气泡 → 判定印章 → 理由 / 最小反例（2D 投影、三根轴、3D 投影）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='D01', mood='easy', pose='ds_happy', sub='第五章：点积、投影、最小二乘、施密特，我全会了！来考我！', read='第五章，点积、投影、最小二乘、施密特，我全会了！来考我吧！'),
    dict(id='C01', pose='claude_smile', sub='好。第五章判断题共 10 道，全做：永远成立判“对”并说理由，不一定成立就举反例。', read='好。第五章的判断题，一共十道，我们全做：永远成立的判对，并说出理由；不一定成立的，就举一个反例。'),
    # 1
    dict(id='C02', pose='claude_point', sub='第 1 题：x、y 是 ℝⁿ 中的非零向量，则 x 在 y 上的向量投影，等于 y 在 x 上的向量投影。', read='第一题：x和y是R n中的非零向量，那么x在y上的向量投影，等于y在x上的向量投影。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='对！公式里都是 xᵀy，对称的！', read='对！公式里都是x转置y，是对称的！'),
    dict(id='C03', pose='claude_think', sub='错。分子对称，可是 x 在 y 上的投影沿着 y，y 在 x 上的投影沿着 x，方向都不一样。', read='错。分子是对称的，可是x在y上的投影沿着y，y在x上的投影沿着x，方向都不一样。'),
    dict(id='C04', pose='claude_explain', sub='反例：x = (1, 1)ᵀ，y = (1, 0)ᵀ。前者是 (1, 0)ᵀ，后者是 (1/2, 1/2)ᵀ。', read='反例：x是一、一，y是一、零。前者是一、零，后者是二分之一、二分之一。'),
    # 2
    dict(id='C05', pose='claude_point', sub='第 2 题：x、y 是 ℝⁿ 中的单位向量，且 |xᵀy| = 1，则 x、y 线性无关。', read='第二题：x和y是R n中的单位向量，并且x转置y的绝对值等于一，那么x和y线性无关。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='对！两个单位向量嘛，各指各的。', read='对！两个单位向量嘛，各指各的。'),
    dict(id='C06', pose='claude_think', sub='错。|xᵀy| = 1 = ‖x‖‖y‖，柯西–施瓦茨取了等号，两个向量一定共线：y = x 或 y = −x，线性相关。', read='错。x转置y的绝对值等于一，正好等于两个长度的乘积，柯西施瓦茨取了等号。两个向量一定共线：y等于x，或者y等于负x，线性相关。'),
    # 3
    dict(id='C07', pose='claude_point', sub='第 3 题：U、V、W 是 ℝ³ 的子空间。U ⊥ V 且 V ⊥ W，则 U ⊥ W。', read='第三题：U、V、W是R三的子空间。U垂直于V，V垂直于W，那么U垂直于W。'),
    dict(id='D04', mood='think', pose='ds_think', sub='垂直好像不能传递……我猜错！', read='垂直，好像不能传递，我猜错！'),
    dict(id='C08', pose='claude_smile', sub='猜对了。取 U = W = x 轴，V = y 轴。U ⊥ V，V ⊥ W，可 U 和 W 是同一条轴，根本不正交。', read='猜对了。取U和W都是x轴，V是y轴。U垂直于V，V垂直于W，可是U和W是同一条轴，根本不正交。'),
    # 4
    dict(id='C09', pose='claude_point', sub='第 4 题：可以在 A 的列空间里找到非零向量 y，使 Aᵀy = 0。', read='第四题：可以在A的列空间里，找到非零向量y，使A转置y等于零。'),
    dict(id='D05', mood='easy', pose='ds_proud', sub='错！这个我会：列空间和 N(Aᵀ) 互为正交补。', read='错！这个我会：列空间，和A转置的零空间，互为正交补。'),
    dict(id='C10', pose='claude_smile', sub='完全正确。y 既在 R(A) 里，又在 N(Aᵀ) 里，就要和自己正交，只能是零向量。', read='完全正确。y既在列空间里，又在A转置的零空间里，它就要和自己正交，那就是零向量。'),
    # 5
    dict(id='C11', pose='claude_point', sub='第 5 题：A 是 m×n 矩阵，则 AAᵀ 与 AᵀA 的秩相同。', read='第五题：A是m行n列的矩阵，那么A A转置，与A转置A的秩相同。'),
    dict(id='D06', mood='easy', pose='ds_happy', sub='对！都等于 A 的秩。', read='对！都等于A的秩。'),
    dict(id='C12', pose='claude_explain', sub='对。关键一步：若 AᵀAx = 0，则 xᵀAᵀAx = ‖Ax‖² = 0，所以 Ax = 0。于是 N(AᵀA) = N(A)。', read='对。关键的一步：如果A转置A x等于零，两边左乘x转置，得到A x的长度平方等于零，所以A x等于零。于是A转置A的零空间，就是A的零空间。'),
    dict(id='C13', pose='claude_point', sub='零空间相同、列数相同，秩就相同：rank(AᵀA) = rank(A)。把 A 换成 Aᵀ，rank(AAᵀ) = rank(Aᵀ) = rank(A)。', read='零空间相同，列数相同，秩就相同，A转置A的秩等于A的秩。把A换成A转置，A A转置的秩，也等于A的秩。'),
    # 6
    dict(id='C14', pose='claude_point', sub='第 6 题：A 的列线性相关，则 b 在 A 的列空间上的投影不唯一。', read='第六题：如果A的各列线性相关，那么b在A的列空间上的投影，不唯一。'),
    dict(id='D07', mood='easy', pose='ds_proud', sub='对！列相关，最小二乘解有无穷多个，投影也有无穷多个！', read='对！列相关，最小二乘解有无穷多个，投影也有无穷多个！'),
    dict(id='C15', pose='claude_think', sub='错。投影永远唯一：定理 5.3.1，最近点只有一个。不唯一的是 x̂——许多个 x̂ 都给出同一个 p = Ax̂。', read='错。投影永远唯一，定理五点三点一说了，最近点就一个。不唯一的是x帽：许多个x帽，都给出同一个投影p。'),
    # 7
    dict(id='C16', pose='claude_point', sub='第 7 题：N(A) = {0}，则 Ax = b 有唯一的最小二乘解。', read='第七题：如果A的零空间仅含零向量，那么A x等于b，有唯一的最小二乘解。'),
    dict(id='D08', mood='easy', pose='ds_happy', sub='对！列无关，AᵀA 可逆。', read='对！列无关，A转置A可逆。'),
    dict(id='C17', pose='claude_smile', sub='对。N(A) = {0} 就是秩为 n，定理 5.3.2 直接给出唯一解 x̂ = (AᵀA)⁻¹Aᵀb。', read='对。零空间仅含零向量，就是秩为n，定理五点三点二，直接给出唯一解。'),
    # 8
    dict(id='C18', pose='claude_point', sub='第 8 题：Q₁、Q₂ 是正交矩阵，则 Q₁Q₂ 也是正交矩阵。', read='第八题：Q一、Q二是正交矩阵，那么Q一Q二，也是正交矩阵。'),
    dict(id='D09', mood='easy', pose='ds_proud', sub='对！转一下再转一下，还是在转。', read='对！转一下，再转一下，还是在转。'),
    dict(id='C19', pose='claude_explain', sub='对。(Q₁Q₂)ᵀ(Q₁Q₂) = Q₂ᵀQ₁ᵀQ₁Q₂ = Q₂ᵀQ₂ = I。几何上：两个保长度的变换，复合起来还保长度。', read='对。Q一Q二的转置，乘Q一Q二，中间的Q一转置Q一先变成单位矩阵，剩下Q二转置Q二，也是单位矩阵。几何上：两个保长度的变换，复合起来，还保长度。'),
    # 9
    dict(id='C20', pose='claude_point', sub='第 9 题：u₁ … uₖ 是 ℝⁿ 中的标准正交组，U = (u₁ … uₖ)，则 UᵀU = Iₖ。', read='第九题：u一到u k，是R n中的标准正交组，U由它们排成，那么U转置U，等于k阶单位矩阵。'),
    dict(id='D10', mood='easy', pose='ds_happy', sub='对！', read='对！'),
    dict(id='C21', pose='claude_smile', sub='对。UᵀU 的 (i, j) 元就是 uᵢᵀuⱼ：i = j 时是 1，否则是 0。', read='对。U转置U的第i行第j列，就是u i和u j的点积：i等于j的时候是一，否则是零。'),
    # 10
    dict(id='C22', pose='claude_point', sub='第 10 题：同样的 U，则 UUᵀ = Iₙ。', read='第十题：同样的U，那么U U转置，等于n阶单位矩阵。'),
    dict(id='D11', mood='easy', pose='ds_proud', sub='对！上一题反过来乘，一样的！', read='对！上一题反过来乘，一样的！'),
    dict(id='C23', pose='claude_think', sub='错。k < n 时，UUᵀ 是投影到 Span(u₁ … uₖ) 上的投影矩阵。U = (e₁ e₂) 时，它把 (5, 3, 4)ᵀ 压成 (5, 3, 0)ᵀ，不是单位矩阵。', read='错。k小于n的时候，U U转置，是投影到这些u张成的子空间上的投影矩阵。U取e一、e二，它把五、三、四，压成五、三、零，不是单位矩阵。'),
    dict(id='C24', pose='claude_explain', sub='仅在 k = n、U 是方阵时，UUᵀ 才等于 I。第 9、10 题放在一起，就是在提醒：矩阵乘法不交换。', read='仅在k等于n，U是方阵的时候，U U转置才等于单位矩阵。第九、第十题放在一起，就是在提醒：矩阵乘法不交换。'),
    # 结尾
    dict(id='D12', mood='sigh', pose='ds_confused', sub='六比十……错的四道，都是凭感觉。', read='六比十，错的四道，都是凭感觉。'),
    dict(id='C25', pose='claude_smile', sub='六题，进步了。错题的共同点：把公式看成了对称的、可交换的。', read='六题，进步了。错题的共同点：把公式看成了对称的，可交换的。'),
    dict(id='C26', pose='claude_point', sub='第 1 题：投影有方向；第 2 题：等号意味着共线；第 6 题：投影唯一，解不唯一；第 10 题：UUᵀ 是投影。', read='第一题，投影有方向；第二题，等号意味着共线；第六题，投影唯一，解不唯一；第十题，U U转置是投影。'),
    dict(id='C27', pose='claude_explain', sub='第 4、5 题靠的是同一套工具：列空间与 N(Aᵀ) 正交，以及 ‖Ax‖² = xᵀAᵀAx。', read='第四、第五题，靠的是同一套工具：列空间与A转置的零空间正交，以及A x的长度平方，等于x转置A转置A x。'),
    dict(id='D13', mood='easy', pose='ds_happy', sub='下次先画图，再下判断！', read='下次先画图，再下判断！'),
    dict(id='C28', pose='claude_point', sub='下一节：测验 B 计算题，再加同济题型。', read='下一节：测验B的计算题，再加上同济题型。'),
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
