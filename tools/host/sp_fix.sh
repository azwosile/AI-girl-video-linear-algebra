#!/bin/bash
# 重配个别台词：bash sp_fix.sh <spN> s4:C01,G01 s7:C12 [--seed N] → 然后 prep(+asr) 受影响段
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"; G=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
EPD=$1; shift; SEED=${SEED:-7}
kill_api(){ for pid in $(netstat -ano | grep -E "127\.0\.0\.1:9880 +0\.0\.0\.0:0" | awk '{print $5}' | sort -u); do taskkill //PID $pid //F >/dev/null 2>&1; done; sleep 3; }
kill_api; cd $G; (runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_la.yaml > "$P/.api9880.log" 2>&1 &)
for i in $(seq 150); do sleep 2; curl -s -o /dev/null http://127.0.0.1:9880/docs && break; done
cd "$P"; SEGS=""
for a in "$@"; do x=${a%%:*}; ids=${a#*:}; SEGS="$SEGS $x"
  $G/runtime/python.exe pipeline/tts.py $EPD/$x --only ${ids//,/ } --force --seed $SEED >> "$P/.tts_${EPD}_fix.log" 2>&1
  log "$EPD retts $x $ids rc=$?"; done
kill_api
SEGS=$(echo $SEGS | tr ' ' '\n' | sort -u | tr '\n' ' ')
/usr/bin/bash "$P/tools/host/sp_run.sh" $EPD prep $SEGS
log "$EPD FIX_DONE"
