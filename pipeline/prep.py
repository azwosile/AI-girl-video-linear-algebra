# -*- coding: utf-8 -*-
"""配音后处理：转 48k、提速（不变调）、压句内长停顿、裁首尾、归一；写 <段>/durations.json。
BGM / 音效统一转 48k 到 <段>/../../.cache48/（全项目共用）。
用法：$PY pipeline/prep.py ch01/p0_sample
"""
import json, re, subprocess, sys, numpy as np, soundfile as sf
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
seg = (ROOT / sys.argv[1]).resolve()
TEMPO = {'C': 1.10, 'G': 1.12, 'D': 1.0}
tj = seg / 'tempo.json'
if tj.exists(): TEMPO.update(json.loads(tj.read_text(encoding='utf-8')))
MAX_SIL, KEEP_SIL = 0.22, 0.18


def ff(*a): subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *map(str, a)], check=True)


def squeeze(x, sr):
    win = int(0.01 * sr); n = len(x) // win
    rms = np.sqrt((x[:n * win].reshape(n, win) ** 2).mean(1)); quiet = rms < 0.008
    out, i = [], 0
    while i < n:
        j = i
        while j < n and quiet[j] == quiet[i]: j += 1
        s = x[i * win:j * win]
        if quiet[i] and (j - i) * 0.01 > MAX_SIL and i > 0 and j < n:
            k = int(KEEP_SIL * sr); s = np.concatenate([s[:k // 2], s[-(k - k // 2):]])
        out.append(s); i = j
    out.append(x[n * win:]); return np.concatenate(out)


(seg / 'vo48').mkdir(exist_ok=True)
dur, env = {}, {}
for f in sorted((seg / 'vo').glob('*.wav')):
    if not re.fullmatch(r'[A-Z]\d\d[a-z]?', f.stem): continue
    d = seg / 'vo48' / f.name
    ff('-i', f, '-af', f'atempo={TEMPO.get(f.stem[0], 1.1)}', '-ar', 48000, '-ac', 1, d)
    x, sr = sf.read(d); e = np.abs(x) > 0.012; i = int(np.argmax(e)); j = len(x) - int(np.argmax(e[::-1]))
    x = x[max(0, i - int(.015 * sr)):min(len(x), j + int(.06 * sr))]
    x = squeeze(x, sr); x = x / np.abs(x).max() * 0.89
    sf.write(d, x, sr); dur[f.stem] = round(len(x) / sr, 3)
    # 口型/说话包络：每 1/30 s 一个 RMS（0–1），供 cast 做说话起伏
    w = sr // 30; n = len(x) // w
    r = np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1)); env[f.stem] = [round(float(v), 3) for v in np.clip(r / 0.18, 0, 1)]
(seg / 'durations.json').write_text(json.dumps(dur, ensure_ascii=False, indent=0), encoding='utf-8')
(seg / 'envelope.json').write_text(json.dumps(env), encoding='utf-8')

C48 = ROOT / '.cache48'; C48.mkdir(exist_ok=True)
for f in sorted((ROOT / 'assets' / 'sfx').glob('*.wav')):
    d = C48 / f.name
    if not d.exists(): ff('-i', f, '-ar', 48000, '-ac', 2, d)
bg = C48 / 'bgm_main.wav'
if not bg.exists():
    ff('-i', ROOT / 'assets' / 'music' / 'bgm.mp3', '-ar', 48000, '-ac', 2, bg)
    b, sr = sf.read(bg); b = b * (0.12 / max(1e-6, np.sqrt(np.mean(b ** 2)))); sf.write(bg, np.clip(b, -1, 1), sr)
print(len(dur), 'lines', round(sum(dur.values()), 2), 's', dur)
