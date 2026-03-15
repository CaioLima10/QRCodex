@echo off
echo Limpando arquivos temporarios do Windows...
echo.
REM Limpar temp do usuario
del /f /q /s "%temp%\*" 2>nul
REM Limpar temp do sistema
del /f /q /s "C:\Windows\Temp\*" 2>nul
REM Limpar prefetch
del /f /q /s "C:\Windows\Prefetch\*" 2>nul

echo Cache temporario limpo!
echo.
echo Seu projeto esta seguro e intacto.
echo Apenas cache foi limpo.
pause
