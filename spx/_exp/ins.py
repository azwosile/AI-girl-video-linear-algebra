# 通用：在 lines.py 的 LINES 中按 id 插入 / 替换台词（assert 保护）
import re, sys, json
def ins(path, after_map, replace_map=None):
    s = open(path, encoding='utf-8').read()
    for rid, newline in (replace_map or {}).items():
        m = re.search(r"^    dict\(id=['\"]%s['\"],.*\),\n" % rid, s, re.M); assert m, rid
        s = s[:m.start()] + newline + '\n' + s[m.end():]
    for aid, block in after_map.items():
        m = re.search(r"^    dict\(id=['\"]%s['\"],.*\),\n" % aid, s, re.M); assert m, aid
        s = s[:m.end()] + block + s[m.end():]
    open(path, 'w', encoding='utf-8').write(s)
def D(id, pose, sub, read=None, mood=None):
    d = dict(id=id, pose=pose, sub=sub, read=read or sub)
    if mood: d['mood'] = mood
    return '    dict(' + ', '.join(f"{k}={json.dumps(v, ensure_ascii=False)}" for k, v in d.items()) + '),\n'
