#!/bin/bash
# 第五章配音链：TTS（全部 10 段）→ prep + ASR
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
log "CH5 VO START"
/usr/bin/bash "$P/tools/host/sp_run.sh" ch05 tts
/usr/bin/bash "$P/tools/host/sp_run.sh" ch05 prep
log "CH5_VO_DONE"
