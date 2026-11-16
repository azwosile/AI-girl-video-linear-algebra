param([string]$A = '')
$bash = 'D:\DeepSeek Harness WorkSpace\ShunCode\resources\app\extensions\shuncode\runtime\git\usr\bin\bash.exe'
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = ('"' + $bash + '" /e/AI/AI娘课程/.xfer/' + $A) }
"pid=" + $r.ProcessId + " rc=" + $r.ReturnValue
