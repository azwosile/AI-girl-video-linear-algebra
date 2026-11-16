#!/usr/bin/bash
# usage: chk_ep.sh N  → 章节、边界帧拼图、响度
source /e/AI/AI娘课程/.xfer/env.sh
P=/e/AI/AI娘课程/AI娘线性代数课; cd $P/out
F=$(ls AI娘线性代数课_第$1集_*.mp4 | grep -v 720p)
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,pix_fmt -of compact "$F"
ffprobe -v error -show_chapters -of csv "$F" | awk -F, '{printf "%s %.1f %s\n",$2,$5,$NF}' | head -30
mapfile -t T < <(ffprobe -v error -show_chapters -of csv "$F" | awk -F, 'NR==2||NR==3{print $5}'; ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
D=${T[2]}; C1=${T[0]}; C2=${T[1]}
N=$1; mkdir -p $P/ep/chk; rm -f $P/ep/chk/*.png
i=0
for t in 3 7.5 $(awk "BEGIN{print $C1+1}") $(awk "BEGIN{print $C2-1.2}") $(awk "BEGIN{print $C2+0.3}") $(awk "BEGIN{print $C2+3}") $(awk "BEGIN{print $D-8}") $(awk "BEGIN{print $D-2}"); do
  ffmpeg -nostdin -v error -y -ss $t -i "$F" -frames:v 1 -vf scale=480:-1 $P/ep/chk/f$i.png; i=$((i+1)); done
ffmpeg -nostdin -v error -y -i $P/ep/chk/f%d.png -vf tile=4x2 -frames:v 1 -q:v 4 $P/ep/chk/ep${N}_sheet.jpg
for w in "0 20" "$C2 30" "$(awk "BEGIN{print $D-20}") 20"; do set -- $w; ffmpeg -nostdin -hide_banner -ss $1 -t $2 -i "$F" -af volumedetect -vn -f null - 2>&1 | grep -E "mean_vol|max_vol" | tr '\n' ' '; echo " @$1"; done
ls -la $P/ep/chk/
