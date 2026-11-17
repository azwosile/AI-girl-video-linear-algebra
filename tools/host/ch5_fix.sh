#!/bin/bash
# 第五章：g2p 复查改写句 → 重配 3 句（1a C08、2 C08、4 C03）→ prep+ASR → 字体 → 全部 10 段联系表
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; log "CH5 FIX START"
export PYTHONIOENCODING=utf-8
/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe pipeline/g2p_lint.py ch05/s5_1a ch05/s5_2 ch05/s5_4 > "$P/.g2p_ch5fix.log" 2>&1; log "ch5 g2p rc=$? $(tail -1 $P/.g2p_ch5fix.log)"
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" ch05 s5_1a:C08 s5_2:C08 s5_4:C03
uv run --quiet --with fonttools --with brotli python pipeline/fonts.py > "$P/.fonts_ch5.log" 2>&1; log "ch5 fonts rc=$?"
for s in ch05/s5_*; do node pipeline/tex_build.mjs $s > /dev/null 2>&1 || log "tex_build FAIL $s"; done
/usr/bin/bash "$P/tools/host/sp_run.sh" ch05 sheet
log "CH5_FIX_DONE"
