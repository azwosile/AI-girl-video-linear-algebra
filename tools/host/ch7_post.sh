#!/bin/bash
# 第七章：等第 7 集合成 → 质检 qc.txt → NVENC 1080p（GitHub 2 GiB 上限）
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8
for i in $(seq 1 150); do grep -q CH7_BUILD_DONE "$L" && break; sleep 30; done
log "CH7 POST START i=$i"
python tools/qc_ch.py ch07 > /dev/null 2>> "$L"; log "ch7 qc rc=$? $(tail -1 ch07/qc.txt)"
SRC="out/AI娘线性代数课_第7集_数值线性代数.mp4"; DST="out/gh_1080p/AI-girl-LA-ep7-1080p.mp4"
log "ep7 src size=$(stat -c %s "$SRC" 2>/dev/null)"
ffmpeg -loglevel error -nostdin -y -i "$SRC" -map 0 -map_metadata 0 -map_chapters 0 -c:v h264_nvenc -preset p5 -rc vbr -b:v 4200k -maxrate 7000k -bufsize 14000k -profile:v high -c:a copy -movflags +faststart "$DST.tmp.mp4" && mv "$DST.tmp.mp4" "$DST"
log "ep7 nvenc rc=$? size=$(stat -c %s "$DST" 2>/dev/null)"
log "CH7_POST_DONE"
