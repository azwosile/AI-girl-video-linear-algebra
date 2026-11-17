#!/bin/bash
# 第五章：10 段出片 → 等 AE 包装渲染完 → 合成第 5 集（片头/段落卡/片尾 + 角标 + 章节）
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; log "CH5 BUILD START"
/usr/bin/bash "$P/tools/host/sp_run.sh" ch05 build
for s in ch05/s5_*; do x=$(basename $s); f=$s/out/ch05_$x.mp4; [ -f $f ] || log "MISSING $f"; done
/usr/bin/bash /e/AI/AI娘课程/.xfer/ep_split.sh 5
log "ch5 ep_split rc=$? $(tail -1 $P/ep/ep_split.log)"
log "CH5_BUILD_DONE"
