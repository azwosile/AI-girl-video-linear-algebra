# -*- coding: utf-8 -*-
"""第 7 章 复习（下）计算题 6–10 与全课收尾（Leon 9th Chapter 7 Test B 第 6–10 题：x = (1, 2, −2) 的 Householder / Givens；QR 与 RQ 相似；
幂法 A = (1 2; 4 3) 五次 → 5.0024；SVD 最小范数解 (1/3, 1/2, 1/12)；Householder 最小二乘 A = (1 5; 1 5; 1 6; 1 2) → x = (2, 1/3)、残差 2）+ 七章回顾 台词源（唯一真源）。
画面：镜面 + 旋转；幂法向量收向 (1, 2)；解集直线 + 垂足；Householder 两步清零；七章地图点亮；完结卡。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='复习最后一段：Test B 后五题，然后，全课收尾。', read='复习最后一段：后五道计算题，然后，全课收尾。'),
    # TB6
    dict(id='C02', pose='claude_point', sub='第六题：x = (1, 2, −2)。求 Householder 矩阵 H 使 Hx = (r, 0, 0)；再求 Givens 变换 G 使 Gx = (1, s, 0)。', read='第六题：x是一、二、负二。求豪斯霍尔德矩阵，把x变成只剩第一个分量；再求吉文斯变换，把x变成一、s、零。'),
    dict(id='C03', pose='claude_explain', sub='‖x‖ = 3，x₁ > 0，取 α = −3。v = (4, 2, −2)，β = 12，H = I − (1/12)vvᵀ，Hx = (−3, 0, 0)。', read='x的长度是三，x一大于零，取阿尔法等于负三。v是四、二、负二，贝塔等于十二，H等于I减十二分之一v乘v转置，H乘x等于负三、零、零。'),
    dict(id='C04', pose='claude_point', sub='Givens：只动第 2、3 个坐标。(2, −2) 的长度 2√2，cos θ = sin θ = 1/√2，Gx = (1, 2√2, 0)。', read='吉文斯：只动第二、第三个坐标。二、负二的长度是二倍根号二，余弦和正弦都取二分之根号二，结果是一、二倍根号二、零。'),
    # TB7
    dict(id='C05', pose='claude_point', sub='第七题：Q 正交，R 上三角，A = QR，B = RQ。A 和 B 的特征值、特征向量有什么关系？', read='第七题：Q正交，R上三角，A等于Q R，B等于R Q。A和B的特征值、特征向量，有什么关系？'),
    dict(id='C06', pose='claude_explain', sub='B = RQ = Qᵀ(QR)Q = QᵀAQ，正交相似，特征值相同。若 Ax = λx，则 B(Qᵀx) = λ(Qᵀx)：特征向量差一个 Qᵀ。', read='B等于R Q，等于Q转置乘Q R乘Q，也就是Q转置A Q。B和A正交相似，特征值相同。如果x是A的特征向量，那么Q转置乘x，就是B的特征向量。'),
    dict(id='D01', mood='easy', pose='ds_happy', sub='这就是 QR 算法的每一步！', read='这就是Q R算法的每一步！'),
    # TB8
    dict(id='C07', pose='claude_point', sub='第八题：A = (1 2; 4 3)，用幂法迭代五次，估计最大特征值和对应特征向量。', read='第八题：A是一二、四三，用幂法迭代五次，估计最大特征值和对应的特征向量。'),
    dict(id='C08', pose='claude_explain', sub='从 u₀ = (1, 1) 出发：v₁ = (3, 7)，除以 7；之后最大分量依次约 4.71、5.06、4.99、5.0024。', read='从一、一出发：第一次得三、七，除以七；之后的最大分量，依次大约是四点七一、五点零六、四点九九、五点零零二四。'),
    dict(id='C09', pose='claude_point', sub='u₅ ≈ (0.4999, 1)。精确值 λ₁ = 5，特征向量 (1, 2)；另一个特征值 −1，比值 1/5，所以收敛很快。', read='第五次的向量，大约是零点四九九九、一。精确值是五，特征向量是一、二；另一个特征值是负一，比值五分之一，所以收敛很快。'),
    # TB9
    dict(id='C10', pose='claude_point', sub='第九题：A 是 4×3、秩 2，b = (5, 1, −1, 9)，奇异值 12、6、0，SVD 已给出。求范数最小的最小二乘解。', read='第九题：A是四行三列、秩为二的矩阵，b是五、一、负一、九，奇异值是十二、六、零，奇异值分解已经给出。求范数最小的最小二乘解。'),
    dict(id='C11', pose='claude_explain', sub='先算 Uᵀb = (7, −1, 7, −3)。只用非零奇异值：y₁ = 7/12，y₂ = −1/6；第三个奇异值是 0，y₃ 取 0。', read='先算U转置乘b，是七、负一、七、负三。只用非零的奇异值：y一是十二分之七，y二是负六分之一；第三个奇异值是零，y三取零。'),
    dict(id='C12', pose='claude_point', sub='x = (7/12)v₁ − (1/6)v₂ = (1/3, 1/2, 1/12)。它和零空间方向 (−2, 1, 2) 正交——正是解集直线上离原点最近的点。', read='x等于十二分之七倍v一，减六分之一倍v二，等于三分之一、二分之一、十二分之一。它和零空间的方向正交，正是解集直线上，离原点最近的点。'),
    # TB10
    dict(id='C13', pose='claude_point', sub='第十题：A = (1 5; 1 5; 1 6; 1 2)，b = (2, 4, 5, 3)。用 Householder 变换把 A 化成 R，并求最小二乘解。', read='第十题：A的四行是，一五；一五；一六；一二；b是二、四、五、三。用豪斯霍尔德变换把A化成上三角，并求最小二乘解。'),
    dict(id='C14', pose='claude_explain', sub='第一列 (1, 1, 1, 1) 长度 2，α = −2，v₁ = (3, 1, 1, 1)，β = 6。H₁A 的第二列变成 (−9, ⅓, 4/3, −8/3)，H₁b = (−7, 1, 2, 0)。', read='第一列是四个一，长度二，阿尔法取负二，v一是三、一、一、一，贝塔是六。H一乘A，第二列变成负九、三分之一、三分之四、负三分之八；H一乘b，是负七、一、二、零。'),
    dict(id='C15', pose='claude_point', sub='第二步只看后三个 (⅓, 4/3, −8/3)，长度 3，α = −3，β = 10。得 R = (−2 −9; 0 −3)，c = (−7, −1, 6/5, 8/5)。', read='第二步只看后三个，长度是三，阿尔法取负三，贝塔是十。得到R的上半部分是负二、负九；零、负三；c是负七、负一、五分之六、五分之八。'),
    dict(id='C16', pose='claude_explain', sub='回代：−3x₂ = −1，x₂ = 1/3；−2x₁ − 3 = −7，x₁ = 2。残差 ‖(6/5, 8/5)‖ = 2。和正规方程的答案一致。', read='回代：负三x二等于负一，x二等于三分之一；负二x一减三等于负七，x一等于二。残差就是五分之六、五分之八的长度，等于二。和正规方程的答案一致。'),
    dict(id='D02', mood='easy', pose='ds_proud', sub='残差直接读出来，不用再算一遍！', read='残差直接就读出来了，不用再算一遍！'),
    # 收尾
    dict(id='C17', pose='claude_smile', sub='第七章到这里结束。这也是 Leon 教材正文的最后一章。', read='第七章到这里就结束了。这也是英文教材正文的最后一章。'),
    dict(id='C18', pose='claude_explain', sub='回头看整门课：第一章，方程组与矩阵；第二章，行列式；第三章，向量空间；第四章，线性变换。', read='回头看整门课：第一章，方程组与矩阵；第二章，行列式；第三章，向量空间；第四章，线性变换。'),
    dict(id='C19', pose='claude_explain', sub='第五章，正交与最小二乘；第六章，特征值；第七章，让电脑真正把这些算出来。', read='第五章，正交与最小二乘；第六章，特征值；第七章，让电脑真正把这些都算出来。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='从解方程组出发，最后又回到电脑上解方程组！', read='从解方程组出发，最后又回到电脑上解方程组！'),
    dict(id='G01', pose='gpt_explain', sub='同济六章也全部对照完了：行列式、矩阵、初等变换、向量组、相似与二次型、线性空间。考试按同济练，理解看 Leon 和这套动画。', read='同济的六章，也全部对照完了：行列式、矩阵、初等变换、向量组、相似与二次型、线性空间。考试按同济练，理解，就看英文教材和这套动画。'),
    dict(id='C20', pose='claude_smile', sub='教材网站上还有第八章迭代法、第九章若尔当标准形。想看的话，在评论区告诉我们。', read='教材网站上，还有第八章迭代法、第九章若尔当标准形。想看的话，在评论区告诉我们。'),
    dict(id='C21', pose='claude_point', sub='线性代数课，到此完结。谢谢你一路看到这里。', read='线性代数课，到这里就完结了。谢谢你，一路看到这里。'),
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
