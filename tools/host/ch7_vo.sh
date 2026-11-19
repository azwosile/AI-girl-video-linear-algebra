#!/bin/bash
# 第七章配音链：解包修订台词 → g2p 复查 → TTS（全部 12 段）→ prep + ASR
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8
log "CH7 VO START"
tar xzf /e/AI/AI娘课程/.xfer/ch7b.tgz; log "ch7b extracted rc=$?"
/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe pipeline/g2p_lint.py ch07/s7_7 ch07/s7_xa > "$P/.g2p_ch7b.log" 2>&1; log "ch7 g2p2 rc=$? $(tail -1 $P/.g2p_ch7b.log)"
/usr/bin/bash "$P/tools/host/sp_run.sh" ch07 tts
/usr/bin/bash "$P/tools/host/sp_run.sh" ch07 prep
log "CH7_VO_DONE"
