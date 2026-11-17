#!/bin/bash
# 收尾：等 FIX3_DONE → 重配 sp1/s6 C10（改写朗读稿避免跳读）→ 重建 sp1/s6 → 重新合成特别篇1
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
until grep -q "FIX3_DONE" "$L"; do sleep 30; done
log "FIX4 START"
cd "$P" && tar xzf ../.xfer/fix3.tgz
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" sp1 s6:C10
/usr/bin/bash "$P/tools/host/sp_run.sh" sp1 build s6
/usr/bin/bash /e/AI/AI娘课程/.xfer/sp_compose.sh 1
log "FIX4_DONE compose_rc=$?"
