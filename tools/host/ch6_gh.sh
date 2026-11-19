#!/bin/bash
# 第六章收尾：质检 → 文档（B站/README/gh_release）→ NVENC 1080p → git 提交推送 → Release ep6
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8; log "CH6 GH START"
python /e/AI/AI娘课程/.xfer/ep6_docs.py >> "$L" 2>&1; log "ep6_docs rc=$?"
SRC="out/AI娘线性代数课_第6集_特征值.mp4"; DST="out/gh_1080p/AI-girl-LA-ep6-1080p.mp4"
if [ ! -f "$DST" ]; then
  ffmpeg -loglevel error -nostdin -y -i "$SRC" -map 0 -map_metadata 0 -map_chapters 0 -c:v h264_nvenc -preset p5 -rc vbr -b:v 4200k -maxrate 7000k -bufsize 14000k -profile:v high -c:a copy -movflags +faststart "$DST.tmp.mp4" && mv "$DST.tmp.mp4" "$DST"
  log "nvenc rc=$? size=$(stat -c %s "$DST" 2>/dev/null)"
fi
G="git -c safe.directory=*"
$G add -A ch06 ep/ep_split.json ep/ep_split.py ep/ep6_meta.txt pipeline/mathcheck.py tools/host/ch6_*.sh tools/gh_release.py README.md docs covers/make_covers.py covers/art/ep06.png assets/fonts 2>>"$L"
$G reset -q ch06/*/_sheets 2>/dev/null
$G commit -q -m "第六章 特征值：11 段 + 第 6 集合成 + 封面/B站文案/制作报告 + Release ep6" >> "$L" 2>&1; log "commit rc=$? $($G log --oneline -1)"
$G push origin main >> "$L" 2>&1; log "push rc=$? $($G log --oneline -1 origin/main)"
python tools/gh_release.py ep6 > out/gh_release_ep6.log 2>&1; log "gh_release rc=$? $(tail -1 out/gh_release_ep6.log)"
log "CH6_GH_DONE"
