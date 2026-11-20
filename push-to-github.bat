@echo off
title Push Paltoo to GitHub
color 0b
cd /d "%~dp0"

echo ========================================================
echo             PUSHING PALTOO TO GITHUB
echo ========================================================
echo Repository: https://github.com/sanketkhare98/paltoo.git
echo.
echo When prompted for credentials:
echo   - Username: sanketkhare98
echo   - Password: [Paste your GitHub Personal Access Token]
echo ========================================================
echo.

"C:\Users\sanke\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe" push -u origin main

echo.
echo ========================================================
echo Done! If you saw any error, please verify your token.
echo ========================================================
pause
