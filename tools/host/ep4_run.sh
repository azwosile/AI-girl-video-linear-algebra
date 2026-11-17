#!/bin/bash
# 第 4 集合成：等 aerender 结束 → ep_split 4
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
log "EP4 START"
/usr/bin/bash /e/AI/AI娘课程/.xfer/ep_split.sh 4
log "ep4 ep_split rc=$? $(tail -1 $P/ep/ep_split.log)"
log "EP4_DONE"
