$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Paltoo.lnk"
$targetPath = "C:\Users\sanke\.gemini\antigravity\scratch\paltoo\Start-Paltoo.bat"
$workingDir = "C:\Users\sanke\.gemini\antigravity\scratch\paltoo"

$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $workingDir
$shortcut.WindowStyle = 1
$shortcut.Description = "Launch Paltoo Pet Care Assistant"
$shortcut.Save()

Write-Output "SUCCESS: Created Paltoo shortcut at $shortcutPath"
