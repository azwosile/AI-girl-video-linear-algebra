# -*- coding: utf-8 -*-
"""第 1 章 §1.2（续）齐次方程组与应用（Leon 9th §1.2 Homogeneous Systems、Theorem 1.2.1、Application 1 / 3；
同济第六版 第三章 §3 定理 4：n 元齐次线性方程组有非零解 ⇔ R(A) < n）台词源（唯一真源）。
字段：id（首字母=说话人 C/G/D）、sub（字幕）、read（朗读稿，可省）、mood（大肥鱼参考音情绪）、pose（立绘差分）
多音字由 pipeline/pron.json 统一修正；配音前必须跑 pipeline/g2p_lint.py。
运行：python lines.py → script.json / lines.json
"""
import json
from pathlib import Path

LINES = [
    # —— 开场：右边全是零
    dict(id='D01', mood='daily', pose='ds_ask', sub='老师，上一节的方程组右边都有数。要是右边全是 0 呢？', read='老师，上一节的方程组，右边都有数。要是右边全是零呢？'),
    dict(id='C01', pose='claude_smile', sub='那它有个专门的名字：齐次线性方程组。今天就讲它。'),
    dict(id='C02', pose='claude_point', sub='齐次，就是每个方程的常数项都是 0。比如这个方程组。', read='齐次，就是每个方程的常数项都是零。比如这个方程组。'),
    dict(id='D02', mood='think', pose='ds_confused', sub='那……全取 0 不就好了？x₁、x₂、x₃ 都是 0，左边自然等于 0。', read='那，全取零不就好了？x一、x二、x三都是零，左边自然等于零。'),
    dict(id='C03', pose='claude_smile', sub='对！所以齐次方程组永远有解，至少有一个全 0 的解。', read='对！所以齐次方程组永远有解，至少有一个全零的解。'),
    dict(id='C04', pose='claude_explain', sub='这个解太理所当然了。教材叫它“平凡解”，同济叫它“零解”。', read='这个解太理所当然了。教材叫它平凡解，同济叫它零解。'),
    dict(id='C05', pose='claude_point', sub='真正值得问的是：除了零解，还有没有别的解？也就是非零解。'),
    # —— 几何：过原点的平面
    dict(id='C06', pose='claude_explain', sub='来看图。三个未知数，每个方程就是空间里的一张平面。'),
    dict(id='C07', pose='claude_point', sub='右边是 0，原点一定满足方程，所以每张平面都穿过原点。', read='右边是零，原点一定满足方程，所以每张平面都穿过原点。'),
    dict(id='C08', pose='claude_explain', sub='两张平面都过原点，又不重合，就一定交出一条直线。'),
    dict(id='C09', pose='claude_point', sub='这条线上的每个点，都同时满足两个方程。原点只是其中一个。'),
    dict(id='D03', mood='easy', pose='ds_happy', sub='一整条线！那非零解就有无穷多个了？'),
    dict(id='C10', pose='claude_smile', sub='没错。消元验证一下：第二行减去第一行的两倍。'),
    dict(id='C11', pose='claude_explain', sub='得到 x₂ = x₃。x₃ 是自由变量，设它为 t，解就是 (−t, t, t)。', read='得到x二等于x三。x三是自由变量，设它等于t，解就是负t、t、t。'),
    dict(id='C12', pose='claude_point', sub='t 取遍所有实数，这些点正好排成那条交线。', read='t取遍所有实数，这些点正好排成那条交线。'),
    # —— 三张平面
    dict(id='D04', mood='think', pose='ds_confused', sub='可要是再加一个方程，三张平面呢？'),
    dict(id='C13', pose='claude_think', sub='一般来说，三张平面只在原点碰头，那就只剩零解。'),
    # —— 定理 1.2.1
    dict(id='C14', pose='claude_explain', sub='所以关键是方程个数 m 和未知数个数 n。教材定理 1.2.1 说：', read='所以关键是方程个数m，和未知数个数n。教材的定理一点二点一说：'),
    dict(id='C15', pose='claude_point', sub='齐次方程组里，只要未知数比方程多，也就是 n > m，就一定有非零解。', read='齐次方程组里，只要未知数比方程多，也就是n大于m，就一定有非零解。'),
    dict(id='D05', mood='think', pose='ds_ask', sub='为什么“一定”？', read='为什么一定？'),
    dict(id='C16', pose='claude_explain', sub='看台阶。每一行最多一个主元，m 行最多 m 个主元。', read='看台阶。每一行最多一个主元，m行最多m个主元。'),
    dict(id='C17', pose='claude_point', sub='可未知数有 n 个，比 m 多，所以至少剩下一个自由变量。', read='可未知数有n个，比m多，所以至少剩下一个自由变量。'),
    dict(id='C18', pose='claude_explain', sub='让自由变量取 1，其余变量跟着算出来，就是一个非零解。', read='让自由变量取一，其余变量跟着算出来，就是一个非零解。'),
    dict(id='G01', pose='gpt_cross', sub='注意，反过来不成立：n ≤ m 也可能有非零解，比如三张平面恰好共用一条直线。', read='注意，反过来不成立。未知数不比方程多，也可能有非零解，比如三张平面恰好共用一条直线。'),
    dict(id='G02', pose='gpt_explain', sub='同济用秩来说：系数矩阵的秩小于 n，就有非零解。秩后面再讲。', read='同济用秩来说：系数矩阵的秩小于n，就有非零解。秩，我们后面再讲。'),
    # —— 应用：光合作用配平
    dict(id='D06', mood='daily', pose='ds_ask', sub='可右边全是 0，有什么用啊？看着好无聊。', read='可右边全是零，有什么用啊？看着好无聊。'),
    dict(id='C19', pose='claude_smile', sub='化学课配平方程式，就是在解齐次方程组。看光合作用。'),
    dict(id='C20', pose='claude_explain', sub='二氧化碳加水，生成氧气和葡萄糖。每种分子前面配一个系数。'),
    dict(id='C21', pose='claude_point', sub='配平，就是两边每种原子一样多。先看碳：左边 x₁ 个，右边 6x₄ 个。', read='配平，就是两边每种原子一样多。先看碳：左边x一个，右边六x四个。'),
    dict(id='C22', pose='claude_explain', sub='氧：2x₁ + x₂ = 2x₃ + 6x₄。氢：2x₂ = 12x₄。', read='再看氧：二x一加x二，等于二x三加六x四。氢：二x二等于十二x四。'),
    dict(id='C23', pose='claude_point', sub='把未知数都移到左边，右边全是 0：三个方程，四个未知数。', read='把未知数都移到左边，右边全是零：三个方程，四个未知数。'),
    dict(id='D07', mood='easy', pose='ds_happy', sub='齐次！而且 4 > 3，一定有非零解！', read='齐次！而且四大于三，一定有非零解！'),
    dict(id='C24', pose='claude_smile', sub='对，定理保证能配平。消元以后，x₄ 是自由变量，x₁、x₂、x₃ 都等于 6x₄。', read='对，定理保证能配平。消元以后，x四是自由变量，x一、x二、x三都等于六倍的x四。'),
    dict(id='C25', pose='claude_point', sub='取 x₄ = 1：六个二氧化碳加六个水，生成六个氧气和一个葡萄糖。', read='取x四等于一：六个二氧化碳加六个水，生成六个氧气和一个葡萄糖。'),
    dict(id='D08', mood='think', pose='ds_confused', sub='那零解呢？零个二氧化碳加零个水……', read='那零解呢？零个二氧化碳，加零个水？'),
    dict(id='G03', pose='gpt_proud', sub='就是什么反应都没发生。数学上成立，化学上没意思。'),
    # —— 应用：交通流（非齐次，有自由变量）
    dict(id='C26', pose='claude_explain', sub='再看一个右边不全是 0 的例子：市中心四个路口的车流。', read='再看一个右边不全是零的例子：市中心四个路口的车流。'),
    dict(id='C27', pose='claude_point', sub='每个路口，开进来的车等于开出去的车。四个路口，就是四个方程。'),
    dict(id='C28', pose='claude_explain', sub='比如路口 A：x₁ + 450 = x₂ + 610。', read='比如路口A：x一加四百五十，等于x二加六百一十。'),
    dict(id='C29', pose='claude_point', sub='化成简化行阶梯形，最后一行全是 0，x₄ 是自由变量。', read='化成简化行阶梯形，最后一行全是零，x四是自由变量。'),
    dict(id='C30', pose='claude_explain', sub='x₁、x₂、x₃ 都等于 x₄ 再加一个常数。', read='x一、x二、x三，都等于x四再加上一个常数。'),
    dict(id='D09', mood='think', pose='ds_confused', sub='那每条路上到底有多少车？'),
    dict(id='C31', pose='claude_think', sub='光靠四个路口，算不出来。只要再测一条路，比如 x₄ = 200……', read='光靠这四个路口，算不出来。只要再测一条路，比如x四等于两百。'),
    dict(id='C32', pose='claude_point', sub='其余三条马上就知道：530、370、410。', read='其余三条马上就知道：五百三十，三百七十，四百一十。'),
    # —— 总结
    dict(id='D10', mood='easy', pose='ds_happy', sub='我来总结！齐次方程组一定有零解；未知数比方程多，就一定有非零解！', read='我来总结！齐次方程组一定有零解；未知数比方程多，就一定有非零解！'),
    dict(id='C33', pose='claude_smile', sub='完全正确。下一节，我们把方程组写成“矩阵乘向量”，换个角度看它。', read='完全正确。下一节，我们把方程组写成矩阵乘向量，换个角度看它。'),
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
