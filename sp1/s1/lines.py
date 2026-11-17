# -*- coding: utf-8 -*-
"""特别篇 1 · 第 1 段：开场：这套特别篇怎么用。
原题：9 份卷子（2015–16 至 2025–26）
台词源（唯一真源），由 mid/script/sp01.py 导出；数值见 verify_sp01.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # 镜头：黑底，奶油色网格从中心向外铺开。9 张卷子从画面四周旋转飞入，落定后散成扇形；每张卷角标出学年。
    # 音效：riser
    # 音效：impact @ 九份卷子
    dict(id='C01', pose='claude_smile', sub='欢迎来到期中特别篇。桌上这九份，是我们能找到的全部期中卷：从 2015 年到今年。', read='欢迎来到期中特别篇。桌上这九份，是我们能找到的全部期中卷：从二零一五年一直到今年。'),
    dict(id='D01', mood='panic', pose='ds_shock', sub='九份？！我连一份都没做完……', read='九份？我连一份都没做完。'),
    dict(id='C02', pose='claude_explain', sub='不用一份一份做。我们把它们拆开、揉碎，重新按“考点”排队。一共六十道左右的题，一百一十个小问。', read='不用一份一份地做。我们把它们拆开、揉碎，重新按考点排队。一共六十道左右的题，一百一十个小问。'),
    # 镜头：扇形卷子收拢成一张“卷子 × 考点”热力图：横轴 7 份真期中卷，纵轴 8 个考点；格子按出现与否逐格点亮，橙色越深分值越高。
    # 音效：count @ 逐格
    dict(id='C03', pose='claude_point', sub='先看这张热力图。横着是七份真正的期中卷，竖着是八类考点。亮的格子，表示那一年考过。', read='先看这张热力图。横着是七份真正的期中卷，竖着是八类考点。亮的格子，表示那一年考过。'),
    dict(id='C04', pose='claude_explain', sub='LU 分解、行列式、子空间判定、线性相关性——这四行，七年里一年不落，全亮。', read='LU分解、行列式、子空间判定、线性相关性，这四行，七年里一年不落，全是亮的。'),
    dict(id='G01', pose='gpt_point', sub='过渡矩阵和“由 RREF 反推”是七分之六；判断题七分之五；含参方程组七分之三，但近三年考了两次。', read='过渡矩阵和由RREF反推，都是七年里考了六次；判断题七次里五次；含参方程组只有三次，但近三年考了两次。'),
    dict(id='D02', mood='think', pose='ds_think', sub='那 2015 年和 2022 年那两份呢？格子怎么是灰的？', read='那二零一五年和二零二二年那两份呢？格子怎么是灰的？'),
    dict(id='G02', pose='gpt_explain', sub='那两份是全学期卷，有正交、特征值、二次型，超出期中范围。我们只挑其中属于前三章的题来讲，不计入统计。', read='那两份是全学期的卷子，有正交、特征值、二次型，超出了期中范围。我们只挑其中属于前三章的题来讲，不算进统计。'),
    # 镜头：热力图缩到左上角；右侧弹出“七集地图”：七张构成主义卡片排成一列，依次亮起集名。
    dict(id='C05', pose='claude_explain', sub='所以特别篇分七集：方程组、LU 与逆、行列式、子空间与相关性、过渡矩阵、RREF 反推，最后是判断题闪电战和整卷导航。', read='所以特别篇分成七集：方程组；LU与逆；行列式；子空间与相关性；过渡矩阵；RREF反推；最后是判断题闪电战和整卷导航。'),
    # 镜头：演示“原题三步”：整页卷子闪现 → 题目区域被裁成一张纸卡停在左侧 → 纸卡文字“融化”成我们的排版公式。
    # 音效：whoosh
    # 音效：pluck @ 纸卡
    dict(id='C06', pose='claude_point', sub='每道题都按同一个流程走。第一步，原题上屏：你会先看到那一页真卷子，再看到题目被裁下来，停在左边。', read='每道题都按同一个流程走。第一步，原题上屏：你会先看到那一页真卷子，再看到题目被裁下来，停在左边。'),
    dict(id='C07', pose='claude_explain', sub='第二步，一句话套路：这道题属于哪一类、核心动作是什么。第三步，动画把关键一步拆开演。最后，答案和评分点。', read='第二步，一句话套路：这道题属于哪一类、核心动作是什么。第三步，动画把关键一步拆开演。最后，答案和评分点。'),
    dict(id='G03', pose='gpt_proud', sub='评分点归我管。哪一步有分、哪一步写漏会被扣，我会单独标出来。', read='评分点归我管。哪一步有分，哪一步写漏了会被扣，我会单独标出来。'),
    # 镜头：一张“回看卡”滑入：左边原题缩略图，中间答案，右边一句话套路，底部写“完整讲解见第 2 章复习（下）”。
    dict(id='C08', pose='claude_explain', sub='还有一种卡叫“回看卡”。有些真题在正片复习段已经完整讲过，这里就不重讲：只给原题、答案和一句话套路，告诉你去哪一集看。', read='还有一种卡叫回看卡。有些真题，在正片的复习段已经完整讲过，这里就不重讲了：只给原题、答案和一句话套路，再告诉你去哪一集看。'),
    dict(id='D03', mood='think', pose='ds_ask', sub='那速成版和这个是什么关系？我已经看完速成版了。', read='那速成版和这个是什么关系？我已经看完速成版了。'),
    dict(id='C09', pose='claude_smile', sub='速成版是“每类一道代表题”，考前一晚用。特别篇是“每道题都讲细”，用来把题型真正吃透。速成版讲过的题，这里会讲得更慢、更完整。', read='速成版是每类一道代表题，考前一晚用。特别篇是每道题都讲细，用来把题型真正吃透。速成版讲过的题，这里会讲得更慢、更完整。'),
    # 镜头：三个角色依次站到画面下方：Claude 居中，GPT 右侧抱臂，大肥鱼左侧举手。
    dict(id='G04', pose='gpt_cross', sub='建议看法：先暂停，自己做一遍，再往下看。做错的题，在下面的套路卡上打个记号。', read='建议的看法是：看到原题先暂停，自己做一遍，再往下看。做错的题，在套路卡上打个记号。'),
    dict(id='D04', mood='easy', pose='ds_happy', sub='好！那第一题我先来——', read='好！那第一题我先来。'),
    dict(id='C10', pose='claude_point', sub='第一集，从方程组开始。第一题，就是三张平面的故事。', read='第一集，从方程组开始。第一题，就是三张平面的故事。', post=600),
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
