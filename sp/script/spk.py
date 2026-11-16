# -*- coding: utf-8 -*-
"""特别篇逐字稿的公共工具。

写法（每集一个 spNN.py）：
    seg('sp1_1', '三张平面的三种结局', exam='2018–19 第 1 题（18 分）', mins=8)
    S('画面：……')                      # 镜头说明，作用于其后的台词，直到下一条 S
    C('claude_explain', '字幕', r='读法（可省；省略时与字幕相同）')
    G('gpt_point', '字幕', r=None)
    D('ds_confused', 'think', '字幕', r=None)   # 大肥鱼要写 mood ∈ D_REF
    X('sfx 名', t='cue 词')               # 音效提示（可选）
导出：python spNN.py → out/spNN/<seg>/lines.json、script.json，以及 out/特别篇N_逐字稿.md
台词字段与正片 lines.py 相同：id / pose / mood / sub / read，多出 shot 与 sfx 两个字段。
"""
import json, os, re, sys
from collections import OrderedDict

D_MOODS = {'panic', 'think', 'daily', 'sigh', 'easy'}
POSES = {
    'C': {'claude_explain', 'claude_point', 'claude_smile', 'claude_surprise', 'claude_think', 'claude_write'},
    'G': {'gpt_cross', 'gpt_explain', 'gpt_point', 'gpt_proud', 'gpt_think'},
    'D': {'ds_ask', 'ds_confused', 'ds_happy', 'ds_proud', 'ds_shock', 'ds_think'},
}
CPM = 191  # 成片字/分钟：速成版实测 14332 字 / 74.9 分钟（含原题上屏、动画与停顿）

SEGS = OrderedDict()
_cur = None
_shot = None
_cnt = {}
_ep = {}


def episode(n, title, minutes):
    _ep.update(n=n, title=title, minutes=minutes)


def seg(sid, title, exam='', mins=0, note=''):
    global _cur, _shot, _cnt
    _cur = SEGS[sid] = dict(id=sid, title=title, exam=exam, mins=mins, note=note, lines=[])
    _shot = None
    _cnt = {}


def S(text):
    global _shot
    _shot = text
    _cur['lines'].append(dict(kind='shot', text=text))


def X(name, t=None):
    _cur['lines'].append(dict(kind='sfx', name=name, cue=t))


def _add(sp, pose, sub, r=None, mood=None, post=None):
    assert pose in POSES[sp], (sp, pose)
    _cnt[sp] = _cnt.get(sp, 0) + 1
    d = dict(kind='line', id=f'{sp}{_cnt[sp]:02d}', pose=pose, sub=sub, read=r or _plain(sub))
    if mood:
        assert mood in D_MOODS, mood
        d['mood'] = mood
    if post:
        d['post'] = post
    if _shot:
        d['shot'] = _shot
    _cur['lines'].append(d)


def _plain(s):
    # 省略读法时，去掉字幕里只给眼睛看的符号
    return re.sub(r'[（(]\s*[)）]', '', s).replace('……', '，').replace('“', '').replace('”', '')


def C(pose, sub, r=None, post=None):
    _add('C', pose, sub, r, post=post)


def G(pose, sub, r=None, post=None):
    _add('G', pose, sub, r, post=post)


def D(pose, mood, sub, r=None, post=None):
    _add('D', pose, sub, r, mood=mood, post=post)


def _chars(s):
    return len(re.sub(r'[\s，。、；：？！,.;:?!“”‘’（）()…—\-]', '', s))


def export(outroot):
    n = _ep['n']
    os.makedirs(outroot, exist_ok=True)
    md = [f"# 特别篇 {n}：{_ep['title']} · 逐字稿\n",
          f"> 目标时长约 {_ep['minutes']} 分钟 · 按速成版实测 {CPM} 字/成片分钟估算 · 台词字段与正片 `lines.py` 相同（id / pose / mood / sub / read），"
          f"另加 shot（画面）与 sfx（音效）。\n> 角色：**Claude** 主讲 · **GPT** 助教（评分点、书写规范）· **DeepSeek（大肥鱼）** 提问与踩坑。\n"]
    tot_c = 0; rows = []
    for sid, sg in SEGS.items():
        lines = [l for l in sg['lines'] if l['kind'] == 'line']
        ch = sum(_chars(l['read']) for l in lines)
        tot_c += ch
        est = ch / CPM
        rows.append((sid, sg['title'], sg['mins'], len(lines), ch, est))
        d = os.path.join(outroot, f'sp{n:02d}', sid); os.makedirs(d, exist_ok=True)
        clean = [{k: v for k, v in l.items() if k != 'kind'} for l in lines]
        json.dump(clean, open(os.path.join(d, 'lines.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        json.dump(dict(seg=sid, title=sg['title'], exam=sg['exam'], items=[{k: v for k, v in l.items()} for l in sg['lines']]),
                  open(os.path.join(d, 'script.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    md.append('| 段 | 标题 | 计划 | 句数 | 字数 | 估算 |\n|---|---|---|---|---|---|')
    for sid, t, m, nl, ch, est in rows:
        md.append(f'| {sid} | {t} | {m} min | {nl} | {ch} | {est:.1f} min |')
    md.append(f"| **合计** | | {_ep['minutes']} min | {sum(r[3] for r in rows)} | {tot_c} | {sum(r[5] for r in rows):.1f} min |\n")
    for sid, sg in SEGS.items():
        md.append(f"\n---\n\n## {sid} · {sg['title']}\n")
        if sg['exam']:
            md.append(f"**原题**：{sg['exam']}  ")
        md.append(f"**计划时长**：{sg['mins']} 分钟" + (f"  \n**备注**：{sg['note']}" if sg['note'] else '') + '\n')
        for l in sg['lines']:
            if l['kind'] == 'shot':
                md.append(f"\n> 🎬 **画面**：{l['text']}\n")
            elif l['kind'] == 'sfx':
                md.append(f"> 🔊 `{l['name']}`" + (f"（在“{l['cue']}”处）" if l.get('cue') else '') + '\n')
            else:
                who = {'C': 'Claude', 'G': 'GPT', 'D': '大肥鱼'}[l['id'][0]]
                mood = f"·{l['mood']}" if 'mood' in l else ''
                md.append(f"- `{l['id']}` **{who}**（{l['pose']}{mood}）：{l['sub']}")
                if l['read'] != _plain(l['sub']):
                    md.append(f"  - 读：{l['read']}")
    path = os.path.join(outroot, f"特别篇{n}_逐字稿.md")
    open(path, 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print(path, f'{tot_c} 字, 估算 {sum(r[5] for r in rows):.1f} min')
