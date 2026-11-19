#!/bin/bash
# 第七章：解包台词 → g2p 审查全部 12 段
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8
tar xzf /e/AI/AI娘课程/.xfer/ch7a.tgz; log "ch7a extracted rc=$?"
/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe pipeline/g2p_lint.py $(ls -d ch07/s7_* | sort -V) > "$P/.g2p_ch7.log" 2>&1; log "ch7 g2p rc=$? $(tail -1 $P/.g2p_ch7.log)"
log "CH7_G2P_DONE"
