# -*- coding: utf-8 -*-
"""逐句 ASR 复核：Paraformer 识别 <段>/vo/*.wav，与朗读稿按无调拼音比对。
用法（推荐，独立 CPU 环境；整合包自带 python 加载模型时会段错误 0xC0000005）：
  QA_DEVICE=cpu uv run --python 3.11 --with "torch==2.5.1" --with "torchaudio==2.5.1" --with funasr --with pypinyin --with modelscope \
    --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match python pipeline/asr.py ch01/p0_sample
  选项：[--src vo|vo48] [--only C02]
输出 <段>/qa_asr.txt；相似度 < 0.90 或单字母变量缺失的句子标 ⚠，需人工复听。
"""
import argparse, difflib, json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
G = 'E:/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0'
ap = argparse.ArgumentParser(); ap.add_argument('seg'); ap.add_argument('--src', default='vo'); ap.add_argument('--only', nargs='*')
a = ap.parse_args()
seg = (ROOT / a.seg).resolve()
ref = {k: v[0] for k, v in json.loads((seg / 'script.json').read_text(encoding='utf-8')).items()}
os.chdir(G)
if 'GPT-SoVITS' in sys.executable: sys.path.insert(0, G)  # 用独立 uv 环境时不混入整合包源码
from funasr import AutoModel
from pypinyin import lazy_pinyin
sys.path.insert(0, str(ROOT / 'pipeline'))
import pron  # 两边都过发音修正表：稿子里的 行→航；ASR 写成 形/型 的会被比出来
m = AutoModel(model='tools/asr/models/speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch',
              disable_update=True, device=os.environ.get('QA_DEVICE', 'cuda'))
# 线代读法归一：字母与帽子统一成汉字读音再转拼音
EN = {'i帽': '爱帽', 'j帽': '杰帽', 'k帽': '开帽', 'claude': '克劳德', 'gpt': '基批踢', 'lambda': '兰姆达'}


def norm(s):
    s = s.lower()
    for e, z in sorted(EN.items(), key=lambda x: -len(x[0])): s = s.replace(e, z)
    s = re.sub(r'(?<![a-z])i(?![a-z])', '爱', s); s = re.sub(r'(?<![a-z])j(?![a-z])', '杰', s)
    s = re.sub(r'(?<![a-z])x(?![a-z])', '艾克斯', s); s = re.sub(r'(?<![a-z])y(?![a-z])', '歪', s)
    s = re.sub(r'[^\w]', '', pron.fix_hang(s))
    return ''.join(lazy_pinyin(s))


out, bad = [], []
for k in sorted(ref):
    if a.only and k not in a.only: continue
    f = seg / a.src / f'{k}.wav'
    if not f.exists(): out.append(f'?? {k} 缺音频'); bad.append(k); continue
    t = m.generate(input=str(f))[0]['text'].replace(' ', '')
    A, B = norm(t), norm(ref[k]); sm = difflib.SequenceMatcher(None, A, B); r = sm.ratio()
    diff = [f'{B[j1:j2] or "∅"}→{A[i1:i2] or "∅"}' for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
    hx = A.count('hang') < B.count('hang')  # 稿子该读 háng 的 行 被听成 形/型（xíng），哪怕整体相似度高也要标
    flag = '⚠' if r < 0.90 or hx else 'OK'
    out.append(f'{flag} {k} {r:.2f} | ASR: {t} | 稿: {ref[k]}' + (f'\n      差异: {" ".join(diff)}' if diff else ''))
    if flag != 'OK': bad.append(k)
(seg / 'qa_asr.txt').write_text('\n'.join(out) + f'\n\n需人工复听 / 重配：{" ".join(bad) or "无"}\n', encoding='utf-8')
print('\n'.join(out)); print('flagged', bad)
