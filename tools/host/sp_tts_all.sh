#!/usr/bin/bash
# 批量配音 + 预处理 + ASR：bash sp_tts_all.sh sp7 sp1 sp2 ...
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"
for e in "$@"; do /usr/bin/bash "$P/tools/host/sp_run.sh" $e tts; /usr/bin/bash "$P/tools/host/sp_run.sh" $e prep; done
echo "$(date +%H:%M:%S) TTSALL_DONE $*" >> "$P/.sp_run.log"
