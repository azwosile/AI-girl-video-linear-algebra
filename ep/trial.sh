#!/usr/bin/bash
source /e/AI/AI娘课程/.xfer/env.sh
cd /e/AI/AI娘课程/AI娘线性代数课/ep
export PYTHONIOENCODING=utf-8 EP_TRIAL=5
python -c "import ep_split as s; s.build(1)" > cct/trial.log 2>&1 < /dev/null
echo TRIAL_RC=$? >> cct/trial.log
