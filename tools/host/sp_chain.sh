#!/bin/bash
# 二次重配(SEED=11) → AE 包装渲染 → 各集顺序构建
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
log "CHAIN START"
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" sp1 s6:C10
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" sp3 s1:C12
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" sp4 s3:C03
log "FIX2_DONE"
log "AER START"
"/d/Adobe/Adobe After Effects 2026/Support Files/aerender.exe" -project 'D:\aetmp\sp_all_pack.aep' -sound OFF > /d/aetmp/spall_render.log 2>&1
log "AER_DONE rc=$? n=$(ls /d/aetmp/pkg_out/SP0[1-57]_*.mp4 2>/dev/null | wc -l)"
for ep in ${EPS:-sp7 sp1 sp2 sp3 sp4 sp5}; do /usr/bin/bash "$P/tools/host/sp_run.sh" $ep build; done
log "BUILDALL_DONE"
/usr/bin/bash /e/AI/AI娘课程/.xfer/sp_compose.sh 7 1 2 3 4 5
log "CHAIN_DONE compose_rc=$?"
