#!/bin/bash
# 第五章收尾修正：等第一轮 10 段出片（ch05 BUILD_DONE） → 重配 s5_5 C17、s5_xb G04 → prep/ASR → 重建 s5_1b（例 6–8 镜头）与这两段 → 重新合成第 5 集
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
until grep -q "ch05 BUILD_DONE" "$L"; do sleep 30; done
cd "$P"; log "CH5 FIX2 START"; export PYTHONIOENCODING=utf-8
/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe pipeline/g2p_lint.py ch05/s5_5 ch05/s5_xb > "$P/.g2p_ch5fix2.log" 2>&1; log "ch5 g2p2 rc=$? $(tail -1 $P/.g2p_ch5fix2.log)"
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" ch05 s5_5:C17 s5_xb:G04
/usr/bin/bash "$P/tools/host/sp_run.sh" ch05 build s5_1b s5_5 s5_xb
/usr/bin/bash /e/AI/AI娘课程/.xfer/ep_split.sh 5
log "ch5 ep_split2 rc=$? $(tail -1 $P/ep/ep_split.log)"
log "CH5_FIX2_DONE"
