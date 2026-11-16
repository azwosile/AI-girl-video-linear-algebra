#!/usr/bin/bash
source /e/AI/AI娘课程/.xfer/env.sh
P=/e/AI/AI娘课程/AI娘线性代数课; T=$P/ep/cct; mkdir -p $T; cd $T
head -5 $P/ep/ep1_list.txt > l5.txt
ffmpeg -nostdin -v error -y -f concat -safe 0 -i l5.txt -c copy demux_copy.mkv
for f in demux_copy.mkv; do echo "== $f"; ffprobe -v error -show_entries stream=codec_type,duration -of compact $f; done
ffprobe -v error -show_entries stream=codec_type,duration,start_time -of compact $P/ch01/s1_1/out/ch01_s1_1.mp4
ffprobe -v error -select_streams v -show_entries packet=pts_time,dts_time,flags -of csv=p=0 $P/ch01/s1_1/out/ch01_s1_1.mp4 | head -4 | tr "\r\n" "  "; echo
ffprobe -v error -select_streams a -show_entries packet=pts_time -of csv=p=0 $P/ch01/s1_1/out/ch01_s1_1.mp4 | head -2 | tr "\r\n" "  "; echo
# 拼接后视频里 Card02 开始的时间：看 demux_copy 中 179–182 附近的视频包 pts 跳变
ffprobe -v error -select_streams v -show_entries packet=pts_time,flags -read_intervals 176%184 -of csv=p=0 demux_copy.mkv | awk -F, 'NR>1 && $1-p>0.03{print "gap",p,"->",$1} {p=$1}' | head
