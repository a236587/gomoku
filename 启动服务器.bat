@echo off
setlocal
cd /d "%~dp0"
title Gomoku Local Server

where node >nul 2>nul
if not errorlevel 1 goto withnode

echo Node.js not found, trying Python...
where python >nul 2>nul
if not errorlevel 1 goto withpython

echo.
echo Neither Node.js nor Python was found.
echo On this PC you can still just double-click index.html.
echo To open the game on your phone, install Node.js or Python first.
echo.
pause
exit /b 1

:withnode
node serve.js
echo.
echo Server stopped.
pause
exit /b 0

:withpython
echo.
echo Server starting on port 8000 ...
echo   PC    : http://127.0.0.1:8000/
echo   Phone : http://YOUR-PC-IP:8000/   (run ipconfig to find your IPv4)
echo.
python -m http.server 8000
echo.
echo Server stopped.
pause
exit /b 0
