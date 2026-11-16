import re,sys,pathlib,json,subprocess
PRE={'claude':'C','gpt':'G','ds':'D'}
for seg in sorted(pathlib.Path('.').glob('x[0-9]')):
    lp=seg/'lines.py'; s=lp.read_text(encoding='utf-8'); sc=(seg/'scene.js').read_text(encoding='utf-8')
    ids=set(re.findall(r"id=['\"]([A-Z]\w*)['\"]",s)); ren={}; out=[]
    for line in s.split('\n'):
        m=re.search(r"id=(['\"])([A-Z]\w*)\1",line); mp=re.search(r"pose=['\"]([a-z]+)_",line)
        if m and mp:
            old=m.group(2); want=PRE[mp.group(1)]
            if old[0]!=want:
                new=want+old[1:]
                while new in ids: new=new+'x'
                ids.add(new); ren[old]=new
                line=line.replace(m.group(0),f"id={m.group(1)}{new}{m.group(1)}",1)
            idn=ren.get(old,old)
            if idn[0]!='D':
                l2=re.sub(r",\s*mood=['\"]\w+['\"]","",line); l2=re.sub(r"mood=['\"]\w+['\"],\s*","",l2)
                if l2!=line: print(seg,idn,'drop mood'); line=l2
        out.append(line)
    if ren:
        for o,n in ren.items():
            cnt=len(re.findall(r"(['\"])%s\1"%o,sc)); sc=re.sub(r"(['\"])%s\1"%o,lambda m:m.group(1)+n+m.group(1),sc)
            print(seg,o,'->',n,'scene refs',cnt)
        (seg/'scene.js').write_text(sc,encoding='utf-8')
    if ren or '\n'.join(out)!=s:
        lp.write_text('\n'.join(out),encoding='utf-8')
        subprocess.run(['python3','lines.py'],cwd=seg,check=True,capture_output=True)
