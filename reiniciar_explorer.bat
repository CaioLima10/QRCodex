@echo off
echo Reiniciando Windows Explorer...
echo.
taskkill /f /im explorer.exe
timeout /t 2 /nobreak
start explorer.exe
echo.
echo Explorer reiniciado!
echo Agora teste o instalador novamente.
pause
