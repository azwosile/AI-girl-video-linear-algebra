#!/bin/bash
# 特别篇主流程：bash sp_run.sh <spN> [all|tts|prep|sheet|build] [段...]
# all = tts → prep(+asr) → sheet；build 单独跑（先看联系表再出片）
source /e/AI/AI娘课程/.xfer/env.sh
G=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
P="/e/AI/AI娘课程/AI娘线性代数课"
L="$P/.sp_run.log"
export PYTHONIOENCODING=utf-8
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
kill_api(){ for pid in $(netstat -ano | grep -E "127\.0\.0\.1:9880 +0\.0\.0\.0:0" | awk '{print $5}' | sort -u); do taskkill //PID $pid //F >/dev/null 2>&1; done; sleep 3; }
start_api(){ kill_api; cd $G; (runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_la.yaml > "$P/.api9880.log" 2>&1 &)
  for i in $(seq 150); do sleep 2; curl -s -o /dev/null http://127.0.0.1:9880/docs && { log "api up"; return 0; }; done; log "api FAIL"; return 1; }
EPD=$1; shift; STAGE=${1:-all}; shift
cd "$P"; SEGS=${*:-$(ls -d $EPD/s* | xargs -n1 basename | sort -V | tr "\n" " ")}
log "START $EPD $STAGE [$SEGS]"
if [ "$STAGE" = all ] || [ "$STAGE" = tts ]; then
  start_api || exit 1
  for x in $SEGS; do
    cd "$P"
    for try in 1 2 3; do $G/runtime/python.exe pipeline/tts.py $EPD/$x >> "$P/.tts_${EPD}_$x.log" 2>&1 && break; log "$EPD tts $x retry $try"; start_api; cd "$P"; done
    log "$EPD tts $x done $(ls $EPD/$x/vo/*.wav 2>/dev/null | wc -l)"
  done
  kill_api; log "$EPD TTS_DONE"
fi
cd "$P"
if [ "$STAGE" = all ] || [ "$STAGE" = prep ]; then
  for x in $SEGS; do uv run --quiet --with numpy --with soundfile python pipeline/prep.py $EPD/$x >> "$P/.prep_${EPD}.log" 2>&1; log "$EPD prep $x rc=$?"; done
  log "$EPD PREP_DONE"
  for x in $SEGS; do
    QA_DEVICE=cpu uv run --quiet --python 3.11 --with "torch==2.5.1" --with "torchaudio==2.5.1" --with funasr --with pypinyin --with modelscope --index https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match python pipeline/asr.py $EPD/$x >> "$P/.asr_${EPD}.log" 2>&1
    log "$EPD asr $x rc=$? warn=$(grep -c '⚠' $EPD/$x/qa_asr.txt 2>/dev/null)"
  done
  log "$EPD ASR_DONE"
fi
if [ "$STAGE" = all ] || [ "$STAGE" = sheet ]; then
  for x in $SEGS; do rm -f $EPD/$x/out/timeline.json; uv run --quiet --with playwright --with numpy --with soundfile --with pillow python tools/sheet.py $EPD/$x >> "$P/.sheet_${EPD}.log" 2>&1; log "$EPD sheet $x rc=$? $(ls $EPD/$x/_sheets 2>/dev/null | wc -l)"; done
  log "$EPD SHEET_DONE"
fi
if [ "$STAGE" = build ]; then
  for x in $SEGS; do bash pipeline/build.sh $EPD/$x --enc libx264 --jobs 2 >> "$P/.build_${EPD}_$x.log" 2>&1; log "$EPD build $x rc=$?"; done
  log "$EPD BUILD_DONE"
fi
