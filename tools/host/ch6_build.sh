#!/bin/bash
# 第六章：字幕/镜头修正 → prep → 11 段出片 → 等 AE 包装 → 合成第 6 集
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; log "CH6 BUILD START"; export PYTHONIOENCODING=utf-8
tar xzf /e/AI/AI娘课程/.xfer/ch6e.tgz; log "ch6e extracted rc=$?"
uv run --quiet python /e/AI/AI娘课程/.xfer/ep6cfg.py >> "$L" 2>&1
/usr/bin/bash "$P/tools/host/sp_run.sh" ch06 prep s6_2 s6_3b s6_7 s6_xb
/usr/bin/bash "$P/tools/host/sp_run.sh" ch06 build
for s in ch06/s6_*; do x=$(basename $s); f=$s/out/ch06_$x.mp4; [ -f $f ] || log "MISSING $f"; done
log "CH6 SEGS DONE"
for i in $(seq 1 120); do [ -f /d/aetmp/pkg_out/EP06_End.mp4 ] && ! tasklist 2>/dev/null | grep -qi aerender && break; sleep 60; done
log "ch6 pkg wait i=$i $(ls /d/aetmp/pkg_out | grep -c EP06_)"
/usr/bin/bash /e/AI/AI娘课程/.xfer/ep_split.sh 6
log "ch6 ep_split rc=$? $(tail -1 $P/ep/ep_split.log)"
log "CH6_BUILD_DONE"
