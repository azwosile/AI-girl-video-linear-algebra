#!/bin/bash
# 第七章：等配音/ASR → 解包场景 → 公式缓存/字体/数学核对 → 联系表 → 12 段出片 → 等 AE 包装 → 合成第 7 集
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8
for i in $(seq 1 90); do grep -q CH7_VO_DONE "$L" && break; sleep 30; done
log "CH7 BUILD START (vo wait i=$i)"
tar xzf /e/AI/AI娘课程/.xfer/ch7c.tgz; log "ch7c extracted rc=$?"
for s in ch07/s7_*; do node pipeline/tex_build.mjs $s >> "$P/.tex_ch07.log" 2>&1 || log "tex FAIL $s"; done
log "ch7 tex done"
uv run --quiet --with fonttools --with brotli python pipeline/fonts.py >> "$P/.fonts_ch07.log" 2>&1; log "ch7 fonts rc=$?"
for s in ch07/s7_*; do log "math $s $(uv run --quiet --with sympy --with numpy python pipeline/mathcheck.py $s 2>&1 | tail -1)"; done
uv run --quiet python /e/AI/AI娘课程/.xfer/ep7cfg.py >> "$L" 2>&1
/usr/bin/bash "$P/tools/host/sp_run.sh" ch07 sheet
/usr/bin/bash "$P/tools/host/sp_run.sh" ch07 build
for s in ch07/s7_*; do x=$(basename $s); f=$s/out/ch07_$x.mp4; [ -f $f ] || log "MISSING $f"; done
log "CH7 SEGS DONE"
for i in $(seq 1 120); do [ -f /d/aetmp/pkg_out/EP07_End.mp4 ] && ! tasklist 2>/dev/null | grep -qi aerender && break; sleep 60; done
log "ch7 pkg wait i=$i $(ls /d/aetmp/pkg_out | grep -c EP07_)"
/usr/bin/bash /e/AI/AI娘课程/.xfer/ep_split.sh 7
log "ch7 ep_split rc=$? $(tail -1 $P/ep/ep_split.log)"
log "CH7_BUILD_DONE"
