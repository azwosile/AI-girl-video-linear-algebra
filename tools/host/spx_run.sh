#!/bin/bash
source /e/AI/AI娘课程/.xfer/env.sh
G=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
P="/e/AI/AI娘课程/AI娘线性代数课"
L="$P/.spx_run.log"
export PYTHONIOENCODING=utf-8
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
kill_api(){ for pid in $(netstat -ano | grep -E "127\.0\.0\.1:9880 +0\.0\.0\.0:0" | awk '{print $5}' | sort -u); do taskkill //PID $pid //F >/dev/null 2>&1; done; sleep 3; }
start_api(){ kill_api; cd $G; (runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_la.yaml > "$P/.api9880.log" 2>&1 &)
  for i in $(seq 150); do sleep 2; curl -s -o /dev/null http://127.0.0.1:9880/docs && { log "api up"; return 0; }; done; log "api FAIL"; return 1; }
cp -n $G/GPT_SoVITS/configs/tts_v5.yaml $G/GPT_SoVITS/configs/tts_la.yaml
log "START ${1:-all}"
STAGE=${1:-all}
if [ "$STAGE" = all ] || [ "$STAGE" = tts ]; then
for B in x0 x1 x2 x3 x4 x5 x6 x7 x8; do
  start_api || exit 1
  cd "$P"
  for x in $B; do
    for try in 1 2 3; do $G/runtime/python.exe pipeline/tts.py spx/$x >> "$P/.tts_$x.log" 2>&1 && break; log "tts $x retry $try"; start_api; cd "$P"; done
    log "tts $x done $(ls spx/$x/vo/*.wav 2>/dev/null | wc -l)"
  done
  kill_api; log "batch [$B] done"
done
fi
cd "$P"
if [ "$STAGE" = all ] || [ "$STAGE" = tts ] || [ "$STAGE" = prep ]; then
for x in x0 x1 x2 x3 x4 x5 x6 x7 x8; do uv run --quiet --with numpy --with soundfile python pipeline/prep.py spx/$x >> "$P/.prep.log" 2>&1; log "prep $x rc=$?"; done
log "PREP_DONE"
for x in x0 x1 x2 x3 x4 x5 x6 x7 x8; do
  QA_DEVICE=cpu uv run --quiet --python 3.11 --with "torch==2.5.1" --with "torchaudio==2.5.1" --with funasr --with pypinyin --with modelscope --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match python pipeline/asr.py spx/$x >> "$P/.asr.log" 2>&1
  log "asr $x rc=$? warn=$(grep -c '⚠' spx/$x/qa_asr.txt 2>/dev/null)"
done
log "ASR_DONE"
fi
if [ "$STAGE" = build ]; then
  shift; for x in "$@"; do bash pipeline/build.sh spx/$x --enc libx264 --jobs 2 >> "$P/.build_$x.log" 2>&1; log "build $x rc=$?"; done
  log "BUILD_DONE"
fi
