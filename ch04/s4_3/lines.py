# -*- coding: utf-8 -*-
"""第 4 章 4.3 相似：同一个变换，两副眼镜（Leon 9th §4.3：开篇例 A = [[2,0],[1,1]]、U = [[1,−1],[1,1]] → B = [[2,−1],[0,1]]；
定理 4.3.1 交换图；相似的定义（对称、传递）；例 1 D 在 [1,x,x²] 与 [1,2x,4x²−2] 下；例 2 → diag(0,1,4)；不变量 det、迹；Test B 10）台词源（唯一真源）。
3B1B 画面：第 13 集“翻译 → 变换 → 翻译回去”，S⁻¹AS 从右往左读；例 2 斜网格在新基下变成沿轴伸缩。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    dict(id='C01', pose='claude_smile', sub='上一节说过：基变了，矩阵就变。那同一个变换的不同矩阵之间，有什么关系？', read='前面说过：基变了，矩阵就跟着变。那同一个变换的不同矩阵之间，有什么关系？'),
    dict(id='C02', pose='claude_explain', sub='开篇例子：L(x) = (2x₁, x₁ + x₂)ᵀ。标准基下，矩阵 A = [[2, 0], [1, 1]]。', read='先看开篇例子：L x 等于二x一、x一加x二。在标准基下，它的矩阵A，第一列是二、一，第二列是零、一。'),
    dict(id='C03', pose='claude_point', sub='换一组基：u₁ = (1, 1)ᵀ，u₂ = (−1, 1)ᵀ。画面里，我们戴上了这副斜着的“眼镜”。', read='换一组基：u一是一、一，u二是负一、一。画面里，我们戴上了这副斜着的眼镜。'),
    dict(id='C04', pose='claude_explain', sub='L(u₁) = Au₁ = (2, 2)ᵀ = 2u₁ + 0u₂；L(u₂) = Au₂ = (−2, 0)ᵀ = −u₁ + u₂。', read='u一的像，是二、二，等于两倍u一，加零倍u二；u二的像，是负二、零，等于负u一，加u二。'),
    dict(id='C05', pose='claude_point', sub='所以在 {u₁, u₂} 下，矩阵 B = [[2, −1], [0, 1]]。同一个 L，两个不同的矩阵。', read='所以，在u一、u二这组基下，矩阵B的第一列是二、零，第二列是负一、一。同一个L，两个不同的矩阵。'),
    dict(id='D01', mood='think', pose='ds_think', sub='A 和 B 看上去完全不一样，它们怎么联系起来？', read='A和B，看上去完全不一样，它们怎么联系起来？'),
    dict(id='C06', pose='claude_smile', sub='想象有个朋友，用 u₁、u₂ 当她的坐标轴。U = (u₁ u₂) 能把“她的语言”翻译成“我们的语言”。', read='想象有个朋友，用u一、u二当她的坐标轴。矩阵U，由u一、u二排成，它能把她的语言，翻译成我们的语言。'),
    dict(id='C07', pose='claude_explain', sub='U⁻¹AU 从右往左读：U 先把她的坐标翻译成标准坐标；A 在我们这边做变换；U⁻¹ 再翻译回她的坐标。', read='U逆A U，要从右往左读：U先把她的坐标，翻译成标准坐标；A在我们这边做变换；U逆再把结果，翻译回她的坐标。'),
    dict(id='C08', pose='claude_point', sub='算一下：U⁻¹AU 正好等于 B。翻译、变换、翻译回去。', read='算一下：U逆A U，正好等于B。翻译，变换，再翻译回去。'),
    dict(id='C09', pose='claude_explain', sub='定理 4.3.1：E、F 是 V 的两组基，S 是从 F 到 E 的过渡矩阵；A、B 分别表示 L 在 E、F 下的矩阵，则 B = S⁻¹AS。', read='定理四点三点一：E和F是V的两组基，S是从F到E的过渡矩阵；A和B，分别是L在E下和F下的矩阵，那么，B等于S逆A S。'),
    dict(id='C10', pose='claude_point', sub='交换图：上面一条路直接走 B；下面绕路：S 下去，A 走过去，S⁻¹ 上来。两条路结果一样。', read='看交换图：上面一条路，直接走B；下面绕路：S下去，A走过去，S逆再上来。两条路的结果一样。'),
    dict(id='D02', mood='easy', pose='ds_happy', sub='S 是第三章的过渡矩阵！它又回来了！', read='S是第三章的过渡矩阵！它又回来了！'),
    dict(id='C11', pose='claude_smile', sub='第二次登场。注意方向：S 把 F 坐标变成 E 坐标，它的列，是新基 F 在旧基 E 下的坐标。', read='对，第二次登场。注意方向：S把F坐标变成E坐标；它的列，是新基F在旧基E下的坐标。'),
    dict(id='C12', pose='claude_explain', sub='定义：若存在可逆矩阵 S，使 B = S⁻¹AS，就说 B 与 A 相似。', read='定义：如果存在可逆矩阵S，使得B等于S逆A S，就说B与A相似。'),
    dict(id='C13', pose='claude_point', sub='相似是对称的：A = (S⁻¹)⁻¹BS⁻¹，所以 A 也与 B 相似。它还是传递的。', read='相似是对称的：A等于S逆的逆，乘B，再乘S逆，所以A也与B相似。它还是传递的：A与B相似，B与C相似，那么A与C也相似。'),
    dict(id='C14', pose='claude_explain', sub='一句话：相似矩阵，就是同一个线性算子在不同基下的矩阵。', read='用一句话说：相似矩阵，就是同一个线性算子，在不同基下的矩阵。'),
    dict(id='C15', pose='claude_point', sub='例 1：求导 D 作用在 P₃ 上。基 [1, x, x²] 下，矩阵 B = [[0, 1, 0], [0, 0, 2], [0, 0, 0]]。', read='例一：求导D，作用在P三上。在一、x、x方这组基下，矩阵B的第二列是一、零、零，第三列是零、二、零。'),
    dict(id='C16', pose='claude_explain', sub='换成基 [1, 2x, 4x² − 2]：D(2x) = 2·1，D(4x² − 2) = 8x = 4·(2x)。矩阵 A = [[0, 2, 0], [0, 0, 4], [0, 0, 0]]。', read='换成一、二x、四x方减二这组基：二x求导得二，是两倍的一；四x方减二求导得八x，是四倍的二x。所以矩阵A的第二列是二、零、零，第三列是零、四、零。'),
    dict(id='C17', pose='claude_point', sub='过渡矩阵 S 就是第三章 3.5 节算过的那个，列是新基在 [1, x, x²] 下的坐标。可以验证 A = S⁻¹BS。', read='过渡矩阵S，就是第三章三点五节算过的那个，它的列，是新基在一、x、x方下的坐标。可以验证：A等于S逆B S。'),
    dict(id='C18', pose='claude_explain', sub='例 2：A = [[2, 2, 0], [1, 1, 2], [1, 1, 2]]。看起来平平无奇。', read='例二：A是这个三阶矩阵。看起来，平平无奇。'),
    dict(id='C19', pose='claude_point', sub='换一组基：y₁ = (1, −1, 0)ᵀ，y₂ = (−2, 1, 1)ᵀ，y₃ = (1, 1, 1)ᵀ。', read='换一组基：y一是一、负一、零；y二是负二、一、一；y三是一、一、一。'),
    dict(id='C20', pose='claude_explain', sub='Ay₁ = 0，Ay₂ = y₂，Ay₃ = 4y₃。每个新基向量都留在自己的方向上，仅仅伸缩。', read='算一下：A乘y一等于零，A乘y二等于y二，A乘y三等于四倍的y三。每个新基向量，都留在自己的方向上，仅仅是伸缩。'),
    dict(id='C21', pose='claude_point', sub='所以在 {y₁, y₂, y₃} 下，矩阵是对角矩阵 D = diag(0, 1, 4)，也就是 Y⁻¹AY = D。', read='所以，在y一、y二、y三这组基下，矩阵变成了对角矩阵D，对角线是零、一、四；也就是Y逆A Y等于D。'),
    dict(id='D03', mood='think', pose='ds_think', sub='换副眼镜，矩阵就变成对角的了？', read='换一副眼镜，矩阵就变成对角的了？'),
    dict(id='C22', pose='claude_smile', sub='看画面：在新基下，变换就是沿每根坐标轴各自伸缩。对角矩阵，算 D 的 n 次方都特别省事。', read='看画面：在新基下，这个变换，就是沿着每根坐标轴各自伸缩。对角矩阵，连算D的n次方，都特别省事。'),
    dict(id='C23', pose='claude_explain', sub='怎么找到这组神奇的基？这是第六章“特征值”的主题。diag(0, 1, 4) 不是巧合，到时揭晓。', read='怎么找到这组神奇的基？这是第六章，特征值的主题。零、一、四，不是巧合，到时候揭晓。'),
    dict(id='C24', pose='claude_point', sub='相似矩阵有不变量：行列式相同，迹也相同。迹是对角线元素之和，记作 tr A。', read='相似矩阵有不变量：行列式相同，迹也相同。迹，就是对角线元素之和，记作A的迹。'),
    dict(id='C25', pose='claude_explain', sub='行列式：det(S⁻¹AS) = det(S⁻¹)·det(A)·det(S) = det(A)。迹的证明用 tr(AB) = tr(BA)，见习题 15。', read='行列式的理由：S逆A S的行列式，等于三个行列式相乘。S逆的行列式，和S的行列式，正好抵消，剩下的就是A的行列式。迹的证明，要用A B的迹等于B A的迹，见习题十五。'),
    dict(id='D04', mood='easy', pose='ds_proud', sub='我验开篇例子：A 的迹 2 + 1 = 3，B 的迹 2 + 1 = 3；行列式都是 2。对上了！', read='我来验开篇例子：A的迹，二加一等于三；B的迹，二加一也等于三；行列式都是二。对上了！'),
    dict(id='C26', pose='claude_smile', sub='很好。Test B 第 10 题更进一步：两边同时减去同一个数量矩阵，行列式仍然相同——第六章会用到。', read='很好。测验B第十题更进一步：两边同时减去兰姆达倍的单位矩阵，行列式仍然相同。第六章会用到它。'),
    dict(id='G01', pose='gpt_explain', sub='同济对照：同济把相似放在第五章，写成 P⁻¹AP = B。P 的列，也是新基在旧基下的坐标。', read='同济对照：同济把相似放在第五章，写成P逆A P等于B。P的列，也是新基在旧基下的坐标。'),
    dict(id='G02', pose='gpt_point', sub='英文教材管它叫“从 F 到 E 的过渡矩阵”，同济叫“从旧基到新基的过渡矩阵”。名字方向相反，矩阵是同一个。', read='英文教材管它叫，从F到E的过渡矩阵；同济叫，从旧基到新基的过渡矩阵。名字的方向相反，矩阵却是同一个。'),
    dict(id='G03', pose='gpt_cross', sub='公式一样，名字相反。做题别背名字：先写定义式，再验一列。', read='公式一样，名字相反。做题的时候别背名字：先写定义式，再验一列。'),
    dict(id='C27', pose='claude_explain', sub='小结：同一个变换，两副眼镜，两个矩阵。B = S⁻¹AS，从右往左读：翻译、变换、翻译回去。相似矩阵的行列式和迹都相同。', read='小结：同一个变换，两副眼镜，两个矩阵。B等于S逆A S，从右往左读：翻译，变换，翻译回去。相似矩阵的行列式和迹，都相同。'),
    dict(id='C28', pose='claude_point', sub='下一节复习：先做第四章的十道判断题。', read='下一节复习：先做第四章的十道判断题。'),
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
