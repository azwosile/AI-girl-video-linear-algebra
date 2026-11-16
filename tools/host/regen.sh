#!/bin/bash
# usage: regen.sh SEED "x1:C04,C25a" "x2:C17a" ...
source /e/AI/AI娘课程/.xfer/env.sh
G=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0; P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.regen.log"; export PYTHONIOENCODING=utf-8
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
kill_api(){ for pid in $(netstat -ano | grep -E "127\.0\.0\.1:9880 +0\.0\.0\.0:0" | awk '{print $5}' | sort -u); do taskkill //PID $pid //F >/dev/null 2>&1; done; sleep 3; }
SEED=$1; shift
kill_api; cd $G; (runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_la.yaml > "$P/.api9880.log" 2>&1 &)
for i in $(seq 150); do sleep 2; curl -s -o /dev/null http://127.0.0.1:9880/docs && break; done; log "api up seed=$SEED"
cd "$P"
for spec in "$@"; do x=${spec%%:*}; ids=${spec#*:}; ids=${ids//,/ }
  $G/runtime/python.exe pipeline/tts.py spx/$x --only $ids --force --seed $SEED >> "$P/.regen_tts.log" 2>&1; log "tts $x rc=$?"; done
kill_api
for spec in "$@"; do x=${spec%%:*}; ids=${spec#*:}; ids=${ids//,/ }
  uv run --quiet --with numpy --with soundfile python pipeline/prep.py spx/$x >> "$P/.prep.log" 2>&1
  QA_DEVICE=cpu uv run --quiet --python 3.11 --with "torch==2.5.1" --with "torchaudio==2.5.1" --with funasr --with pypinyin --with modelscope --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match python pipeline/asr.py spx/$x --only $ids >> "$P/.asr.log" 2>&1
  cp spx/$x/qa_asr.txt spx/$x/qa_asr_regen.txt
  log "qa $x $(grep -a '⚠' spx/$x/qa_asr.txt | cut -c1-12 | tr '\n' ' ')"; done
log "REGEN_DONE"
