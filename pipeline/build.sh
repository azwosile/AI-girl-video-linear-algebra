#!/usr/bin/env bash
# 出片：渲染 → 混音 → 封装（loudnorm −16 LUFS）→ 字幕 → 720p 预览。
# 用法（项目根目录，Git Bash）：bash pipeline/build.sh ch01/p0_sample [--jobs 3] [--enc h264_nvenc]
set -euo pipefail
SEG=${1:?段目录}; shift
cd "$(dirname "$0")/.."
export PYTHONIOENCODING=utf-8
PYX="uv run --quiet --with playwright --with numpy --with soundfile python"
$PYX pipeline/render.py "$SEG" --video --channel chrome --enc h264_nvenc "$@"
$PYX pipeline/mix.py "$SEG"
$PYX pipeline/srt.py "$SEG"
OUT="$SEG/out"
NAME=$(basename "$(dirname "$SEG")")_$(basename "$SEG")
ffmpeg -loglevel error -y -i "$OUT/video_noaudio.mp4" -i "$OUT/mix.wav" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/$NAME.mp4"
ffmpeg -loglevel error -y -i "$OUT/$NAME.mp4" -vf scale=1280:720 -c:v h264_nvenc -preset p5 -cq 24 -c:a aac -b:a 128k "$OUT/${NAME}_preview720.mp4" \
  || ffmpeg -loglevel error -y -i "$OUT/$NAME.mp4" -vf scale=1280:720 -c:v libx264 -crf 23 -c:a aac -b:a 128k "$OUT/${NAME}_preview720.mp4"
echo "成片 → $OUT/$NAME.mp4"
