#!/bin/bash
# 第七章：重配改写后的 s7_1a C03 / s7_1b C02 → ASR 闸门 → ch7_build.sh
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8
log "CH7 RESUME3"
tar xzf /e/AI/AI娘课程/.xfer/ch7d.tgz; log "ch7d extracted rc=$?"
/usr/bin/bash "$P/tools/host/sp_fix.sh" ch07 s7_1a:C03 s7_1b:C02
w=$(grep -a -c "⚠ C03" ch07/s7_1a/qa_asr.txt)$(grep -a -c "⚠ C02" ch07/s7_1b/qa_asr.txt)
log "ch7 fix gate $w"
[ "$w" = "00" ] || { log "CH7 FIX GATE STOP"; exit 1; }
/usr/bin/bash /e/AI/AI娘课程/.xfer/ch7_build.sh
