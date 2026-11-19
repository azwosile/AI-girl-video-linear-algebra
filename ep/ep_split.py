# -*- coding: utf-8 -*-
"""第 1–3 集拆分成片：AE 包装（片头 / 段落卡 / 片尾）+ 音效 + 角标 + 章节 → out/。
宿主机运行：python ep_split.py [1 2 3]
- 先等待 aerender 结束，并确认 D:/aetmp/pkg_out 下 36 个 mp4 齐全
- 每个包装片段混入 assets/sfx 音效 → ep/pack/<name>.mp4（h264 原样 + aac 48k 立体声）
- 每集按 Intro → (Card k → 第 k 段) × N → End 的顺序 concat，叠加角标，写入章节，NVENC 编码
- 输出 out/AI娘线性代数课_第N集_<标题>.mp4 和 _720p.mp4
"""
import json, os, subprocess, sys, time

P = 'E:/AI/AI娘课程/AI娘线性代数课'
PKG = 'D:/aetmp/pkg_out'
EP = P + '/ep'
SFX = P + '/assets/sfx/'
os.makedirs(EP + '/pack', exist_ok=True)
os.makedirs(P + '/out', exist_ok=True)
CFG = json.load(open(EP + '/ep_split.json', encoding='utf-8'))
NCARD = {1: 11, 2: 9, 3: 10, 4: 8, 5: 10, 6: 11}


def log(*a):
    print(time.strftime('%H:%M:%S'), *a, flush=True)


def run(cmd, timeout=None, tries=1):
    for k in range(tries):
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace',
                               stdin=subprocess.DEVNULL, timeout=timeout)
        except subprocess.TimeoutExpired:
            log('TIMEOUT try', k + 1, ' '.join(cmd)[-120:])
            subprocess.run(['taskkill', '/F', '/IM', 'ffmpeg.exe'], capture_output=True)
            time.sleep(2)
            continue
        if r.returncode:
            log('FAIL', ' '.join(cmd)[:300]); log(r.stderr[-1500:]); sys.exit(1)
        return r.stdout
    log('GIVEUP', ' '.join(cmd)[:300]); sys.exit(4)


def dur(f):
    return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], timeout=30, tries=3).strip())


def wait_render(eps=(1, 2, 3)):
    while True:
        tl = subprocess.run(['tasklist'], capture_output=True, text=True, errors='replace', stdin=subprocess.DEVNULL).stdout.lower()
        names = [n for n in os.listdir(PKG) if n.endswith('.mp4')]
        if 'aerender' not in tl:
            break
        log('aerender running, mp4 =', len(names)); time.sleep(60)
    names = [n for n in os.listdir(PKG) if n.endswith('.mp4')]
    need = ['EP%02d_Intro.mp4' % e for e in eps] + ['EP%02d_End.mp4' % e for e in eps] + \
           ['EP%02d_Card%02d.mp4' % (e, k) for e in eps for k in range(1, NCARD[e] + 1)]
    miss = [n for n in need if n not in names]
    if miss:
        log('MISSING', miss); sys.exit(2)
    log('render complete:', len(names))


# (sfx file, start seconds, volume, trim-start seconds)
SFX_PLAN = {
    'intro': [('riser', 0.0, 0.55, 0.87), ('impact', 1.75, 1.0, 0), ('shimmer', 1.95, 0.45, 0), ('sparkle', 2.4, 0.35, 0)],
    'card': [('whoosh', 0.05, 0.6, 0), ('pluck', 0.18, 0.45, 0), ('sparkle', 0.55, 0.3, 0)],
    'end': [('shimmer', 0.75, 0.45, 0), ('pop', 2.40, 0.7, 0), ('pop', 2.62, 0.7, 0), ('pop', 2.84, 0.7, 0),
            ('sparkle', 3.6, 0.35, 0), ('bell_soft', 4.0, 0.4, 0)],
}


def add_sfx(name):
    src = f'{PKG}/{name}.mp4'; dst = f'{EP}/pack/{name}.mp4'
    if os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(src):
        return dst
    kind = 'intro' if 'Intro' in name else ('end' if 'End' in name else 'card')
    D = dur(src)
    wav = f'{EP}/pack/_{name}.wav'
    cmd = ['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-f', 'lavfi', '-t', f'{D:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']
    fl = ['[0:a]aformat=sample_fmts=fltp:channel_layouts=stereo[base]']
    for i, (f, t, v, ts) in enumerate(SFX_PLAN[kind]):
        cmd += ['-i', SFX + f + '.wav']
        ms = int(t * 1000)
        fl.append(f'[{i + 1}:a]atrim=start={ts},asetpts=PTS-STARTPTS,aresample=48000,'
                  f'aformat=sample_fmts=fltp:channel_layouts=stereo,volume={v},adelay={ms}|{ms}[a{i}]')
    n = len(SFX_PLAN[kind])
    fl.append('[base]' + ''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n + 1}:normalize=0:duration=first,'
              f'alimiter=limit=0.89[aout]')
    cmd += ['-filter_complex', ';'.join(fl), '-map', '[aout]', '-ar', '48000', '-ac', '2', wav]
    run(cmd, timeout=45, tries=4)
    run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', src, '-i', wav, '-map', '0:v', '-map', '1:a',
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2', dst], timeout=45, tries=4)
    os.remove(wav)
    return dst


def build(e):
    c = CFG[str(e)]
    title = c['title']
    files, chaps = [], []
    files.append((add_sfx('EP%02d_Intro' % e), '片头'))
    for k, (seg, st) in enumerate(c['segs'], 1):
        card = add_sfx('EP%02d_Card%02d' % (e, k))
        body = f'{P}/ch{e:02d}/{seg}/out/ch{e:02d}_{seg}.mp4'
        if not os.path.exists(body):
            log('MISSING', body); sys.exit(3)
        files.append((card, st))      # chapter starts at the card
        files.append((body, None))
    if os.environ.get('EP_TRIAL'):
        files = files[:int(os.environ['EP_TRIAL'])]
    files.append((add_sfx('EP%02d_End' % e), '片尾 · 下一集预告'))
    lst = f'{EP}/ep{e}_list.txt'; meta = f'{EP}/ep{e}_meta.txt'
    T = 0; cur = None
    with open(lst, 'w', encoding='utf-8') as L:
        for f, st in files:
            L.write(f"file '{f}'\n")
            ms = int(round(dur(f) * 1000))
            if st is not None:
                if cur: chaps.append(cur)
                cur = [T, T + ms, st]
            else:
                cur[1] = T + ms
            T += ms
    chaps.append(cur)
    with open(meta, 'w', encoding='utf-8') as M:
        M.write(f';FFMETADATA1\ntitle=AI娘线性代数课 · 第{e}集 · {title}\nartist=AI娘线性代数课\n')
        for a, b, st in chaps:
            M.write(f'[CHAPTER]\nTIMEBASE=1/1000\nSTART={a}\nEND={b}\ntitle={st}\n')
    intro_s = dur(files[0][0]); end_s = (T / 1000) - dur(files[-1][0])
    out = f'{P}/out/AI娘线性代数课_第{e}集_{title}.mp4' if not os.environ.get('EP_TRIAL') else f'{EP}/cct/trial{e}.mp4'
    log(f'EP{e}: {len(files)} files, {T / 60000:.2f} min → encode')
    # concat 滤镜：每个输入单独解码、统一规格，并把每段音视频都补齐/截到同一时长 D
    # （concat 分离器混接“有 B 帧的正片”和“无 B 帧的 AE 包装”会丢帧，导致音画不同步）
    ins, fl, cat = [], [], ''
    for i, (f, st) in enumerate(files):
        D = round(dur(f), 3)
        ins += ['-i', f]
        fl.append(f'[{i}:v]setpts=PTS-STARTPTS,fps=60,scale=1920:1080,setsar=1,format=yuv420p,'
                  f'tpad=stop_mode=clone:stop_duration=0.2,trim=duration={D},setpts=PTS-STARTPTS[v{i}]')
        fl.append(f'[{i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,asetpts=PTS-STARTPTS,'
                  f'apad=whole_dur={D},atrim=duration={D},asetpts=PTS-STARTPTS[a{i}]')
        cat += f'[v{i}][a{i}]'
    n = len(files)
    fl.append(f'{cat}concat=n={n}:v=1:a=1[cv][ca]')
    fl.append(f'[{n}:v]format=rgba[w]')
    fl.append(f"[cv][w]overlay=W-w-40:34:shortest=1:enable='between(t,{intro_s:.2f},{end_s:.2f})',format=yuv420p[v]")
    fsc = f'{EP}/ep{e}_filter.txt'
    open(fsc, 'w', encoding='utf-8').write(';\n'.join(fl))
    base = ['ffmpeg', '-nostdin', '-loglevel', 'error', '-progress', f'{EP}/ep{e}_progress.txt', '-y'] + ins + \
           ['-loop', '1', '-framerate', '60', '-i', EP + '/wm.png', '-i', meta, '-/filter_complex', fsc,
            '-map', '[v]', '-map', '[ca]', '-map_metadata', str(n + 1), '-map_chapters', str(n + 1)]
    aud = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', out]
    t0 = time.time()
    r = subprocess.run(base + ['-c:v', 'h264_nvenc', '-preset', 'p6', '-tune', 'hq', '-rc', 'vbr', '-cq', '19',
                               '-b:v', '14M', '-maxrate', '24M', '-bufsize', '48M', '-profile:v', 'high',
                               '-pix_fmt', 'yuv420p', '-g', '120'] + aud, capture_output=True, text=True, errors='replace', stdin=subprocess.DEVNULL)
    if r.returncode:
        log('nvenc failed, fallback x264:', r.stderr[-400:])
        run(base + ['-c:v', 'libx264', '-preset', 'fast', '-crf', '17', '-pix_fmt', 'yuv420p'] + aud)
    log(f'EP{e} 1080p done in {time.time() - t0:.0f}s, dur={dur(out):.2f}')
    o7 = out[:-4] + '_720p.mp4'
    r = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', out, '-map', '0', '-map_chapters', '0', '-vf', 'scale=1280:720',
                        '-c:v', 'h264_nvenc', '-preset', 'p5', '-cq', '24', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', o7],
                       capture_output=True, text=True, errors='replace', stdin=subprocess.DEVNULL)
    if r.returncode:
        run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', out, '-map', '0', '-map_chapters', '0', '-vf', 'scale=1280:720',
             '-c:v', 'libx264', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', o7])
    log(f'EP{e} 720p done')
    return T


if __name__ == '__main__':
    eps = [int(a) for a in sys.argv[1:]] or [1, 2, 3]
    wait_render(eps)
    tot = {}
    for e in eps:
        tot[e] = build(e)
    log('EPSPLIT_DONE', json.dumps(tot))
