#!/bin/bash
# 第七章收尾：等 NVENC → git 提交推送 → Release ep7
source /e/AI/AI娘课程/.xfer/env.sh
P="/e/AI/AI娘课程/AI娘线性代数课"; L="$P/.sp_run.log"
log(){ echo "$(date +%H:%M:%S) $*" >> "$L"; }
cd "$P"; export PYTHONIOENCODING=utf-8
for i in $(seq 1 120); do grep -q CH7_POST_DONE "$L" && break; sleep 30; done
log "CH7 GH START i=$i"
tar xzf /e/AI/AI娘课程/.xfer/ch7f.tgz; log "ch7f extracted rc=$?"
G="git -c safe.directory=*"
$G add -A ch07 ep/ep_split.json ep/ep_split.py ep/ep7_meta.txt ae/ep_pack_build.js tools/host/ch7_*.sh tools/gh_release.py README.md docs covers/make_covers.py covers/art/ep07.png assets/fonts 2>>"$L"
$G reset -q ch07/*/_sheets 2>/dev/null
$G commit -q -m "第七章 数值线性代数：12 段 + 第 7 集合成（全课完结）+ 封面/B站文案/制作报告 + Release ep7" >> "$L" 2>&1; log "commit rc=$? $($G log --oneline -1)"
GCM_INTERACTIVE=never $G -c credential.helper= -c "credential.helper=!\"D:/DeepSeek Harness WorkSpace/ShunCode/resources/app/extensions/shuncode/runtime/git/mingw64/bin/git-credential-manager.exe\"" -c http.proxy= push origin main >> "$L" 2>&1; log "push rc=$? $($G log --oneline -1 origin/main)"
python tools/gh_release.py --no-proxy ep7 > out/gh_release_ep7.log 2>&1; log "gh_release rc=$? $(tail -1 out/gh_release_ep7.log)"
log "CH7_GH_DONE"
