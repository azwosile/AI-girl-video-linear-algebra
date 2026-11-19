#!/bin/bash
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; log "CH6 FIX2 START"; export PYTHONIOENCODING=utf-8
tar xzf /e/AI/AI娘课程/.xfer/ch6d.tgz
/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe pipeline/g2p_lint.py ch06/s6_xb > "$P/.g2p_ch6fix.log" 2>&1; log "ch6 g2p rc=$? $(tail -1 $P/.g2p_ch6fix.log)"
SEED=5 /usr/bin/bash "$P/tools/host/sp_fix.sh" ch06 s6_xb:C10
/usr/bin/bash "$P/tools/host/sp_run.sh" ch06 sheet s6_xb
log "CH6_FIX2_DONE"
