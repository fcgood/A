@echo off
chcp 936 >nul
cd /d "%~dp0"
title A股复盘分析器 - 推送到 GitHub

echo ============================================
echo   A股复盘分析器 - 推送到 GitHub
echo ============================================
echo.

git rev-parse --git-dir >nul 2>nul
if errorlevel 1 goto NOGIT

git remote get-url origin >nul 2>nul
if errorlevel 1 goto NOREMOTE

for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTEURL=%%i
echo   远端仓库: %REMOTEURL%
echo.

echo [1/3] 收集本地改动...
git add -A
if errorlevel 1 goto FAIL

echo [2/3] 生成提交...
git diff --cached --quiet
if errorlevel 1 goto DOCOMMIT
echo   (无新改动，跳过提交)
goto PUSH

:DOCOMMIT
set STAMP=%date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,8%
git commit -m "update: %STAMP%"
if errorlevel 1 goto FAIL

:PUSH
echo [3/3] 推送中...
echo.
echo   如果弹出 GitHub 登录窗口，请在浏览器里点 Authorize 授权。
echo   如果要求输入密码，请填 Personal Access Token（不是登录密码）。
echo.
git push -u origin main
if errorlevel 1 goto FAIL

echo.
echo ============================================
echo   推送成功！
echo ============================================
echo.
echo   仓库页面: %REMOTEURL%
echo   在线访问: 见仓库 Settings - Pages
echo.
pause
exit /b 0

:NOREMOTE
echo [错误] 还没有配置远端仓库。
echo.
echo   请先去 https://github.com/new 建一个空仓库，然后执行：
echo     git remote add origin https://github.com/你的用户名/仓库名.git
echo.
pause
exit /b 1

:NOGIT
echo [错误] 当前目录不是 git 仓库。
pause
exit /b 1

:FAIL
echo.
echo [失败] 推送没成功。常见原因：
echo   1. GitHub 上还没建这个仓库  -> https://github.com/new （建空的，别勾 README）
echo   2. 没登录 / 没授权          -> 弹窗里登录，或改用 Token
echo   3. 仓库地址写错了           -> git remote set-url origin 正确地址
echo.
pause
exit /b 1
