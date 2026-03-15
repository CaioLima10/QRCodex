@echo off
echo ===================================================
echo LIMPANDO CACHE DE ICONES DO WINDOWS
echo ===================================================
echo.

REM 1. Limpar cache de icones do usuario
echo [1/5] Limpando cache de icones do usuario...
del /f /q "%localappdata%\Microsoft\Windows\Explorer\iconcache*" 2>nul
del /f /q "%localappdata%\IconCache.db" 2>nul

REM 2. Limpar cache de icones do sistema
echo [2/5] Limpando cache de icones do sistema...
del /f /q "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\iconcache*" 2>nul

REM 3. Limpar cache do Thumbnail
echo [3/5] Limpando cache de thumbnails...
del /f /q "%localappdata%\Microsoft\Windows\Explorer\thumbcache_*" 2>nul

REM 4. Usar ie4uinit para limpar cache (Windows 10/11)
echo [4/5] Limpando cache com ie4uinit...
ie4uinit.exe -ClearIconCache 2>nul

REM 5. Reiniciar Windows Explorer
echo [5/5] Reiniciando Windows Explorer...
taskkill /f /im explorer.exe 2>nul
timeout /t 3 /nobreak >nul
start explorer.exe

echo.
echo ===================================================
echo ✅ CACHE DE ICONES LIMPO COM SUCESSO!
echo ===================================================
echo.
echo Agora verifique se o ícone do instalador apareceu.
pause
