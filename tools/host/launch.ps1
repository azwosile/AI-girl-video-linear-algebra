param([string]$Stage = 'all', [string]$Segs = '')
$bash = 'D:\DeepSeek Harness WorkSpace\ShunCode\resources\app\extensions\shuncode\runtime\git\usr\bin\bash.exe'
$cl = '"' + $bash + '" /e/AI/AI娘课程/.xfer/spx_run.sh ' + $Stage + ' ' + $Segs
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cl }
"pid=" + $r.ProcessId + " rc=" + $r.ReturnValue
