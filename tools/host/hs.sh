cd "/e/AI/AI娘课程/AI娘线性代数课"; export PYTHONIOENCODING=utf-8
seg=$1; shift
timeout 100 uv run --quiet --with playwright --with pillow python tools/sheet.py spx/$seg --ids "$@" >/dev/null 2>&1 || echo FAIL $seg
ffmpeg -v error -y -i spx/$seg/_sheets/sheet_1.png -vf scale=1600:-1 -q:v 4 /e/AI/AI娘课程/.xfer/sh_$seg.jpg && ls -la /e/AI/AI娘课程/.xfer/sh_$seg.jpg | awk '{print $5}'
