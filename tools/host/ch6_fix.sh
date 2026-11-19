#!/bin/bash
# 第六章：g2p 复查改写句 → 重配 6 句 → prep+ASR → 字体 → tex → mathcheck → 全部 11 段联系表
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; log "CH6 FIX START"
export PYTHONIOENCODING=utf-8
/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe pipeline/g2p_lint.py ch06/s6_xb > "$P/.g2p_ch6fix.log" 2>&1; log "ch6 g2p rc=$? $(tail -1 $P/.g2p_ch6fix.log)"
SEED=11 /usr/bin/bash "$P/tools/host/sp_fix.sh" ch06 s6_1b:C15 s6_3b:C10,C11,C12 s6_5:C06 s6_xb:C10
uv run --quiet --with fonttools --with brotli python pipeline/fonts.py > "$P/.fonts_ch6.log" 2>&1; log "ch6 fonts rc=$?"
for s in ch06/s6_*; do node pipeline/tex_build.mjs $s > /dev/null 2>&1 || log "tex_build FAIL $s"; done
for s in ch06/s6_*; do uv run --quiet --with sympy python pipeline/mathcheck.py $s > "$s/qa_math.txt" 2>&1; log "mathcheck $s rc=$? $(tail -1 $s/qa_math.txt)"; done
/usr/bin/bash "$P/tools/host/sp_run.sh" ch06 sheet
log "CH6_FIX_DONE"
