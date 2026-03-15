@echo off
echo Forcando atualizacao de icones do Windows...
echo.

REM Limpar cache de icones do sistema
del /f /q "%localappdata%\Microsoft\Windows\Explorer\iconcache*" 2>nul
del /f /q "%localappdata%\IconCache.db" 2>nul

REM Limpar cache de icones do usuario
del /f /q "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\iconcache*" 2>nul

REM Reiniciar explorer
taskkill /f /im explorer.exe 2>nul
timeout /t 2 /nobreak >nul
start explorer.exe

echo Cache de icones limpo!
echo.
echo Agora verifique se o icone do instalador mudou.
pause
