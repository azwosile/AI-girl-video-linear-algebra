#!/bin/bash
# 配音后处理：等 TTSALL_DONE → 按 .sp_fixes.txt 重配 → 各集联系表
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
until grep -q TTSALL_DONE "$L"; do sleep 20; done
log "POST START"
if [ -f "$P/.sp_fixes.txt" ]; then
  while read -r ep rest; do [ -z "$ep" ] && continue; /usr/bin/bash "$P/tools/host/sp_fix.sh" $ep $rest; done < "$P/.sp_fixes.txt"
fi
for ep in ${EPS:-sp7 sp1 sp2 sp3 sp4 sp5}; do /usr/bin/bash "$P/tools/host/sp_run.sh" $ep sheet; done
log "POST_DONE"
