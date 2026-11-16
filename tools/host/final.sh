#!/bin/bash
# 速成版合成：AE 片头 + x0..x8 → spx/out/特别篇速成版_期中90分钟.mp4（带章节）+ 720p
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; cd "$P"; mkdir -p spx/out
ffmpeg -loglevel error -y -i ae/out/spx_title.mp4 -f lavfi -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -t 7 \
  -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -r 60 -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart spx/out/_intro.mp4 || exit 1
TITLES=("片头" "开场 · 路线图" "第 1 段 · 含参方程组" "第 2 段 · 初等矩阵 · LU · 逆" "第 3 段 · 行列式" "第 4 段 · 子空间" "第 5 段 · 线性相关" "第 6 段 · 过渡矩阵" "第 7 段 · RREF 反推" "第 8 段 · 判断题闪电战 + 考前十条")
FILES=("spx/out/_intro.mp4"); for x in 0 1 2 3 4 5 6 7 8; do FILES+=("spx/x$x/out/spx_x$x.mp4"); done
: > spx/out/list.txt; printf ';FFMETADATA1\ntitle=AI娘线性代数课 · 特别篇 · 期中速成版\n' > spx/out/meta.txt
T=0
for i in "${!FILES[@]}"; do
  f="${FILES[$i]}"; [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
  echo "file 'E:/AI/AI娘课程/AI娘线性代数课/$f'" >> spx/out/list.txt
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"); ms=$(python -c "print(int(round(float('$d')*1000)))")
  printf '[CHAPTER]\nTIMEBASE=1/1000\nSTART=%d\nEND=%d\ntitle=%s\n' $T $((T+ms)) "${TITLES[$i]}" >> spx/out/meta.txt
  T=$((T+ms))
done
OUT="spx/out/特别篇速成版_期中90分钟.mp4"
ffmpeg -loglevel error -y -f concat -safe 0 -i spx/out/list.txt -i spx/out/meta.txt -map 0 -map_metadata 1 -map_chapters 1 -c copy -movflags +faststart "$OUT" || exit 1
ffmpeg -loglevel error -y -i "$OUT" -map 0 -map_chapters 0 -vf scale=1280:720 -c:v h264_nvenc -preset p5 -cq 24 -c:a aac -b:a 128k -movflags +faststart "spx/out/特别篇速成版_期中90分钟_720p.mp4" \
  || ffmpeg -loglevel error -y -i "$OUT" -map 0 -map_chapters 0 -vf scale=1280:720 -c:v libx264 -crf 23 -c:a aac -b:a 128k -movflags +faststart "spx/out/特别篇速成版_期中90分钟_720p.mp4"
echo "FINAL_DONE total_ms=$T"
