#!/bin/bash
# 第七章续跑：重配 s7_1a C03 / s7_1b C02（开头丢字）→ 补 s7_xb/xc 的 prep+ASR → 标记 CH7_VO_DONE → ch7_build.sh
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8
log "CH7 RESUME2"
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" ch07 s7_1a:C03 s7_1b:C02
/usr/bin/bash "$P/tools/host/sp_run.sh" ch07 prep s7_xb s7_xc
log "CH7_VO_DONE"
/usr/bin/bash /e/AI/AI娘课程/.xfer/ch7_build.sh
