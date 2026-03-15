@echo off
echo Limpando cache de icones do Windows...
echo.
echo Isso nao prejudicara seu projeto, apenas limpara o cache
echo.

REM Limpar cache de icones
del /f /q "%localappdata%\IconCache.db" 2>nul
del /f /q "%localappdata%\Microsoft\Windows\Explorer\iconcache*" 2>nul

REM Reiniciar explorer
taskkill /f /im explorer.exe
start explorer.exe

echo Cache limpo com sucesso!
echo.
pause
