# -*- coding: utf-8 -*-
"""GPT-SoVITS 配音（本地 API 127.0.0.1:9880）。参考音只取本项目 assets/voice_ref/。
用法：$PY pipeline/tts.py ch01/p0_sample [--only C01 G01] [--force] [--seed 42]
读取 <段>/script.json：{id: [朗读文本, 情绪]}；输出 <段>/vo/<id>.wav
送字前经 pron.apply（pipeline/pron.json）修正多音字；配音前先跑 pipeline/g2p_lint.py
<段>/tts_override.json 可覆盖：{"C02": {"seed": 7, "mood": "panic"}}
"""
import argparse, json, os, sys, time, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pron  # 发音修正表 pipeline/pron.json（行→háng 等）

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'assets' / 'voice_ref'
API = os.environ.get('GSV_API', 'http://127.0.0.1:9880/tts')  # 端口被别的工程占用时用 GSV_API 改
SQ = json.loads((REF / 'refs.json').read_text(encoding='utf-8'))
VOICE = {
    'C': (REF / SQ['C']['file'], SQ['C']['text']),
    'G': (REF / 'G07_01.ogg', '用 git log，就能看到所有的存档记录。'),
}
D_REF = {
    'panic': ('dwg_0036', '别、别突然从后面叫我，我真的会被你吓到。刚才屏幕为什么自己亮了？我明明没有碰它。'),
    'think': ('dwg_0053', '嗯，让我想想，这件事其实没有你想象中那么复杂。'),
    'daily': ('dwg_0002', '什么嘛，这么简单的事情，你居然专门跑来问我。'),
    'sigh':  ('dwg_0033', '你又订阅别的人工智能了？行吧，我就当没看见。'),
    'easy':  ('dwg_0031', '今天的海水温度刚刚好，特别适合一边摸鱼，一边认真工作。'),
}
SPEED = {'C': 1.0, 'G': 1.0, 'D': 1.08}
SEED = 1234


def body(uid, text, mood, ov):
    text = pron.apply(text)
    k = uid[0]
    if k == 'D':
        r, prompt = D_REF[ov.get('mood') or mood or 'daily']; ref = REF / f'{r}.wav'
    else:
        ref, prompt = VOICE[k]
    return dict(text=text, text_lang='zh', ref_audio_path=str(ref), prompt_text=prompt, prompt_lang='zh',
                speed_factor=SPEED.get(k, 1.0), media_type='wav', seed=ov.get('seed', SEED),
                text_split_method='cut0', batch_size=1, top_k=15, top_p=1, temperature=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('seg'); ap.add_argument('--only', nargs='*'); ap.add_argument('--force', action='store_true')
    ap.add_argument('--seed', type=int)
    a = ap.parse_args()
    seg = (ROOT / a.seg).resolve()
    sc = json.loads((seg / 'script.json').read_text(encoding='utf-8'))
    ovf = seg / 'tts_override.json'
    OV = json.loads(ovf.read_text(encoding='utf-8')) if ovf.exists() else {}
    out = seg / 'vo'; out.mkdir(exist_ok=True)
    todo = [u for u in sc if not a.only or u in a.only]
    for n, u in enumerate(todo, 1):
        f = out / f'{u}.wav'
        if f.exists() and not a.force: continue
        text, mood = sc[u]
        b = body(u, text, mood, OV.get(u, {}))
        if a.seed is not None: b['seed'] = a.seed
        req = urllib.request.Request(API, json.dumps(b).encode('utf-8'), {'Content-Type': 'application/json'})
        t0 = time.time()
        for attempt in range(3):
            try:
                data = urllib.request.urlopen(req, timeout=300).read(); break
            except Exception as e:
                detail = e.read().decode('utf-8', 'ignore')[:300] if hasattr(e, 'read') else ''
                print(f'  {u} 第 {attempt + 1} 次失败：{e} {detail}', file=sys.stderr); time.sleep(3)
        else:
            raise SystemExit(f'{u} 生成失败')
        f.write_bytes(data)
        print(f'[{n}/{len(todo)}] {u} {time.time() - t0:.1f}s {text}', flush=True)


if __name__ == '__main__':
    main()
