#!/bin/bash
# tile.sh SEG N  -> .xfer/tile_SEG.jpg  (N 帧均匀采样，4 列)
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; cd "$P"; f=spx/$1/out/spx_$1.mp4; N=${2:-12}
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $f); echo "$1 dur=$d"
rm -rf /tmp/tl_$1; mkdir -p /tmp/tl_$1
for i in $(seq 0 $((N-1))); do t=$(python -c "print(round($d*($i+0.5)/$N,2))"); ffmpeg -loglevel error -y -ss $t -i $f -frames:v 1 -vf scale=480:-1 /tmp/tl_$1/$(printf %02d $i).png; done
ffmpeg -loglevel error -y -framerate 1 -i /tmp/tl_$1/%02d.png -vf tile=4x$(( (N+3)/4 )) -q:v 4 /e/AI/AI娘课程/.xfer/tile_$1.jpg
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate,channels -of csv=p=0 $f
