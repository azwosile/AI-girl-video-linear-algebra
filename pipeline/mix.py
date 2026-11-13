# -*- coding: utf-8 -*-
"""混音：按 out/timeline.json 摆放配音（vo48/）、音效（.cache48/）、BGM（闪避 + 循环交叉淡化），tanh 限幅。
规则（沿用微积分课）：人声 ×0.95；音效 ×0.5×gain；BGM ×0.30×(1 − 0.6×人声电平)；循环处 2 s 交叉淡化；峰值 0.95。
响度 −16 LUFS 在 build.sh 的封装步骤里用 loudnorm 做。
用法：python pipeline/mix.py ch01/p0_sample
"""
import json, sys, numpy as np, soundfile as sf
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
seg = (ROOT / sys.argv[1]).resolve(); out = seg / 'out'
tl = json.loads((out / 'timeline.json').read_text(encoding='utf-8'))
SR = 48000; N = int((tl['total'] + 0.05) * SR)
vo = np.zeros(N); fx = np.zeros((N, 2))

def stereo(x): return np.stack([x, x], 1) if x.ndim == 1 else x[:, :2]

for l in tl['seq']:
    x, sr = sf.read(seg / 'vo48' / f"{l['id']}.wav"); assert sr == SR
    if x.ndim > 1: x = x.mean(1)
    i = int(l['vo'] * SR); j = min(N, i + len(x)); vo[i:j] += x[:j - i] * 0.95
C48 = ROOT / '.cache48'; miss = set()
for s in tl['sfx']:
    f = C48 / f"{s['name']}.wav"
    if not f.exists(): miss.add(s['name']); continue
    x, sr = sf.read(f); x = stereo(x)
    i = int(s['t'] * SR); j = min(N, i + len(x)); fx[i:j] += x[:j - i] * 0.5 * s['gain']
if miss: print('缺少音效：', ', '.join(sorted(miss)))

# 人声电平（起 50 ms / 落 300 ms）
win = SR // 100; n = N // win
rms = np.sqrt((vo[:n * win].reshape(n, win) ** 2).mean(1)); lv = np.clip(rms / 0.12, 0, 1)
sm = np.zeros(n); a_up, a_dn = 1 - np.exp(-1 / 5), 1 - np.exp(-1 / 30)
for k in range(1, n): sm[k] = sm[k - 1] + (lv[k] - sm[k - 1]) * (a_up if lv[k] > sm[k - 1] else a_dn)
duck = np.repeat(1 - 0.6 * sm, win); duck = np.pad(duck, (0, N - len(duck)), 'edge')

b, sr = sf.read(C48 / 'bgm_main.wav'); b = stereo(b); X = 2 * SR
bg = np.zeros((N, 2)); pos = 0
while pos < N:
    seg_b = b.copy()
    if pos > 0:
        seg_b[:X] *= np.linspace(0, 1, X)[:, None]
    seg_b[-X:] *= np.linspace(1, 0, X)[:, None]
    j = min(N, pos + len(seg_b)); bg[pos:j] += seg_b[:j - pos]; pos += len(b) - X
fade = np.ones(N); fade[:SR // 2] = np.linspace(0, 1, SR // 2); fade[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR))
bg *= (0.30 * duck * fade)[:, None]

mix = stereo(vo) + fx + bg
mix = 0.95 * np.tanh(mix / 0.95)
sf.write(out / 'mix.wav', mix.astype(np.float32), SR, subtype='FLOAT')
print('mix →', out / 'mix.wav', f'{N / SR:.2f}s 峰值 {np.abs(mix).max():.3f}')
