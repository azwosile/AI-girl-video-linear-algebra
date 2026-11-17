#!/bin/bash
# 第五章续跑：重配 s5_5 C17、s5_xb G04 → prep/ASR → 出片其余 8 段（含 s5_1b 镜头修正）→ 合成第 5 集
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; log "CH5 REST START"; export PYTHONIOENCODING=utf-8
/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe pipeline/g2p_lint.py ch05/s5_5 ch05/s5_xb > "$P/.g2p_ch5fix2.log" 2>&1; log "ch5 g2p2 rc=$? $(tail -1 $P/.g2p_ch5fix2.log)"
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" ch05 s5_5:C17 s5_xb:G04
/usr/bin/bash "$P/tools/host/sp_run.sh" ch05 build s5_1b s5_3a s5_3b s5_4 s5_5 s5_6 s5_xa s5_xb
for s in ch05/s5_*; do x=$(basename $s); [ -f $s/out/ch05_$x.mp4 ] || log "MISSING $x"; done
/usr/bin/bash /e/AI/AI娘课程/.xfer/ep_split.sh 5
log "ch5 ep_split rc=$? $(tail -1 $P/ep/ep_split.log)"
PYTHONIOENCODING=utf-8 python tools/qc_ch.py ch05 > /dev/null 2>&1
log "CH5_REST_DONE"
