@echo off
cd /d "%~dp0"
if not exist ferramentas\owlbear\backend\node_modules call npm run setup
call npm start
pause
