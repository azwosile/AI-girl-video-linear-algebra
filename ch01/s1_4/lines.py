# -*- coding: utf-8 -*-
"""第 1 章 §1.4 矩阵代数（Leon 9th §1.4：Thm 1.4.1 运算律、例 2 幂、单位矩阵、逆矩阵定义、例 3 / 例 5（奇异）、Thm 1.4.2 (AB)⁻¹ = B⁻¹A⁻¹、
转置运算律（含 §1.3 末 转置定义、例 11）、对称矩阵、图与邻接矩阵 Thm 1.4.3；同济第六版 第二章 §2–§3（转置、对称、逆矩阵、伴随矩阵求逆））台词源（唯一真源）。
3B1B 对应：EoLA 第 4 集（结合律 = 复合天然满足）、第 7 集（逆 = 撤销变换；压扁成一条线就撤不回来）。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。屏幕数字见 math.json（mathcheck.py 复核）。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # —— 开场
    dict(id='D01', mood='sigh', pose='ds_confused', sub='上一节交换律不成立，我现在都不敢随便算了。还有哪些规则能用？'),
    dict(id='C01', pose='claude_smile', sub='好问题。这一节就来清点：哪些老规矩还能用，哪些要小心，再学会怎么“撤销”一个矩阵。', read='好问题。这一节就来清点：哪些老规矩还能用，哪些要小心，再学会怎么撤销一个矩阵。'),
    # —— 运算律
    dict(id='C02', pose='claude_explain', sub='好消息是大部分都还在。加法可以交换、可以结合；乘法对加法可以分配。', read='好消息是，大部分都还在。加法可以交换、可以结合；乘法对加法可以分配。'),
    dict(id='C03', pose='claude_point', sub='最重要的是乘法结合律：(AB)C = A(BC)。', read='最重要的是乘法结合律：A B括号C，等于A括号B C。'),
    dict(id='D02', mood='think', pose='ds_ask', sub='这个凭什么成立？逐项展开好麻烦。'),
    dict(id='C04', pose='claude_explain', sub='用“动作”来看就一眼明白：两个式子都是先做 C，再做 B，最后做 A。', read='用动作来看，就一眼明白：两个式子都是先做C，再做B，最后做A。'),
    dict(id='C05', pose='claude_point', sub='括号只决定你先在脑子里合并哪两步，动作的顺序一点没变，结果当然一样。', read='括号只决定你先在脑子里合并哪两步，动作的顺序一点没变，结果当然一样。'),
    dict(id='G01', pose='gpt_cross', sub='提醒：能结合不等于能交换。括号可以挪，A、B、C 的前后位置不能挪。', read='提醒：能结合，不等于能交换。括号可以挪，A、B、C的前后位置不能挪。'),
    dict(id='C06', pose='claude_explain', sub='有了结合律，方阵的幂才有意义。教材例 2：全是 1 的二阶矩阵，平方后每个元素变成 2。', read='有了结合律，方阵的幂才有意义。教材例二：全是一的二阶矩阵，平方后，每个元素变成二。'),
    dict(id='C07', pose='claude_point', sub='立方变成 4，n 次方就是 2 的 n−1 次方。', read='立方变成四，n次方就是二的n减一次方。'),
    # —— 单位矩阵
    dict(id='C08', pose='claude_explain', sub='数字里有个特殊的 1，乘谁都不变。矩阵里的“1”叫单位矩阵 I：对角线全是 1，其余是 0。', read='数字里有个特殊的一，乘谁都不变。矩阵里的一，叫单位矩阵I：对角线全是一，其余是零。'),
    dict(id='C09', pose='claude_point', sub='几何上，I 就是“什么都不做”：î 还在原地，ĵ 也还在原地。所以 IA = AI = A。', read='几何上，I就是什么都不做：i帽还在原地，j帽也还在原地。所以，I A等于A I，等于A。'),
    # —— 逆矩阵
    dict(id='D03', mood='daily', pose='ds_ask', sub='那矩阵能不能做除法？'),
    dict(id='C10', pose='claude_explain', sub='矩阵没有除法，但有“撤销”。如果 B 能把 A 做的动作完全撤回，AB = BA = I，B 就叫 A 的逆矩阵，记作 A⁻¹。', read='矩阵没有除法，但有撤销。如果B能把A做的动作完全撤回，A B等于B A等于I，B就叫A的逆矩阵，记作A的负一次方。'),
    dict(id='C11', pose='claude_point', sub='比如剪切把 ĵ 推到 (1, 1)。往回推，把 ĵ 推回 (0, 1)，这就是它的逆。', read='比如，剪切把j帽推到一、一。往回推，把j帽推回零、一，这就是它的逆。'),
    dict(id='C12', pose='claude_explain', sub='教材例 3 给了一对：两个矩阵乘出来正好是 I，左乘右乘都是。', read='教材例三给了一对：两个矩阵乘出来正好是I，左乘右乘都是。'),
    dict(id='C13', pose='claude_think', sub='但不是每个矩阵都能撤销。看例 5：它把整个平面压扁到 x 轴上。', read='但不是每个矩阵都能撤销。看例五：它把整个平面压扁到x轴上。'),
    dict(id='C14', pose='claude_explain', sub='一整条竖线上的点，全都落到同一个点。你只看结果，根本不知道它原来在哪。', read='一整条竖线上的点，全都落到同一个点。你只看结果，根本不知道它原来在哪。'),
    dict(id='C15', pose='claude_point', sub='所以它没有逆。没有逆的方阵叫奇异矩阵，有逆的叫非奇异，也叫可逆。', read='所以它没有逆。没有逆的方阵叫奇异矩阵，有逆的叫非奇异，也叫可逆。'),
    dict(id='D04', mood='panic', pose='ds_shock', sub='压扁了就回不去了……好惨！'),
    dict(id='G02', pose='gpt_explain', sub='注意：只有方阵才谈得上可逆。教材也强调，长方形矩阵不用“奇异”这个词。', read='注意：只有方阵，才谈得上可逆。教材也强调，长方形矩阵不用奇异这个词。'),
    # —— (AB)^-1
    dict(id='C16', pose='claude_explain', sub='两个可逆矩阵乘起来，还是可逆的。那 AB 的逆是什么？', read='两个可逆矩阵乘起来，还是可逆的。那A B的逆是什么？'),
    dict(id='D05', mood='daily', pose='ds_ask', sub='A 逆乘 B 逆？', read='A逆乘B逆？'),
    dict(id='C17', pose='claude_smile', sub='想想穿衣服。早上先穿袜子，再穿鞋；晚上要先脱鞋，再脱袜子。', read='想想穿衣服。早上先穿袜子，再穿鞋；晚上，要先脱鞋，再脱袜子。'),
    dict(id='C18', pose='claude_point', sub='AB 是先做 B 再做 A。撤销时先撤 A，再撤 B。所以 (AB)⁻¹ = B⁻¹A⁻¹，顺序反过来。', read='A B是先做B、再做A。撤销时，先撤A，再撤B。所以，A B的逆，等于B逆乘A逆，顺序反过来。'),
    dict(id='C19', pose='claude_explain', sub='验证一下：B⁻¹A⁻¹ 乘 AB，中间的 A⁻¹A 先变成 I，剩下 B⁻¹B，也是 I。', read='验证一下：B逆A逆乘A B，中间的A逆A先变成I，剩下B逆B，也是I。'),
    # —— 转置
    dict(id='C20', pose='claude_explain', sub='最后一个新操作：转置。把 A 的每一行，竖起来变成一列，记作 Aᵀ。', read='最后一个新操作：转置。把A的每一行，竖起来变成一列，记作A的转置。'),
    dict(id='C21', pose='claude_point', sub='例 11：两行三列的 A，转置后是三行两列。第 i 行第 j 列的元素，跑到第 j 行第 i 列。', read='例十一：两行三列的A，转置后是三行两列。第i行、第j列的元素，跑到第j行、第i列。'),
    dict(id='C22', pose='claude_explain', sub='对方阵来说，就像沿着主对角线翻了个面，对角线上的元素不动。', read='对方阵来说，就像沿着主对角线翻了个面，对角线上的元素不动。'),
    dict(id='C23', pose='claude_point', sub='转置的规则里，最要紧的一条：(AB)ᵀ = BᵀAᵀ。又是顺序反过来。', read='转置的规则里，最要紧的一条：A B的转置，等于B转置乘A转置。又是顺序反过来。'),
    dict(id='D06', mood='think', pose='ds_confused', sub='怎么又反过来？'),
    dict(id='C24', pose='claude_explain', sub='看尺寸就懂：A 是 m×n，B 是 n×r。Aᵀ 是 n×m，Bᵀ 是 r×n，只有 BᵀAᵀ 能乘。', read='看尺寸就懂：A是m乘n，B是n乘r。A转置是n乘m，B转置是r乘n，只有B转置乘A转置能乘得起来。'),
    dict(id='C25', pose='claude_smile', sub='如果一个方阵转置后不变，Aᵀ = A，就叫对称矩阵。它的元素关于对角线左右对称。', read='如果一个方阵转置后不变，A转置等于A，就叫对称矩阵。它的元素关于对角线对称。'),
    # —— 图
    dict(id='C26', pose='claude_explain', sub='对称矩阵很常见。比如四个城市之间的航线图：有航线记 1，没有记 0。', read='对称矩阵很常见。比如四个城市之间的航线图：有航线记一，没有记零。'),
    dict(id='C27', pose='claude_point', sub='航线是双向的，所以这张表是对称的。它叫邻接矩阵。', read='航线是双向的，所以这张表是对称的。它叫邻接矩阵。'),
    dict(id='C28', pose='claude_explain', sub='神奇的是 A²：它的第 i 行第 j 列，正好是从城市 i 走两步到城市 j 的路线条数。', read='神奇的是A的平方：它的第i行、第j列，正好是从城市i走两步到城市j的路线条数。'),
    dict(id='C29', pose='claude_point', sub='比如从 1 出发两步回到 1：1→2→1，1→3→1，一共 2 条。A² 的左上角正好是 2。', read='比如从一出发，两步回到一：一到二再回一，一到三再回一，一共两条。A平方的左上角，正好是二。'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='矩阵乘法居然能算出有几条路线！'),
    dict(id='G03', pose='gpt_proud', sub='同济的求逆方法不同：先讲行列式，用伴随矩阵求。二阶的公式最好背下来。', read='同济的求逆方法不一样：先讲行列式，再用伴随矩阵求。二阶的公式最好背下来。'),
    dict(id='G04', pose='gpt_explain', sub='a b c d 的逆：主对角线换位置，副对角线变号，再除以 ad − bc。', read='二阶矩阵a b c d的逆：主对角线换位置，副对角线变号，再除以a d减b c。'),
    # —— 总结
    dict(id='D08', mood='easy', pose='ds_happy', sub='我来总结！结合律能用，交换律不能用；I 是什么都不做；逆矩阵是撤销。', read='我来总结！结合律能用，交换律不能用；I是什么都不做；逆矩阵是撤销。'),
    dict(id='D09', mood='easy', pose='ds_happy', sub='压扁了就没有逆；乘积求逆、乘积转置，顺序都要反过来！', read='压扁了就没有逆；乘积求逆、乘积转置，顺序都要反过来！'),
    dict(id='C30', pose='claude_smile', sub='满分。可是怎么判断一个矩阵可不可逆、逆又怎么算？下一节用行变换来回答。', read='满分。可是，怎么判断一个矩阵可不可逆，逆又怎么算？下一节用行变换来回答。'),
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
