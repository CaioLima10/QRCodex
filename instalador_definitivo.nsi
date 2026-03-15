; ===================================================
; Instalador NSIS com MUI2 - Solução Definitiva
; ===================================================

; --- INCLUDES ---
!include "MUI2.nsh"

; --- DEFINIÇÕES DO ÍCONE (ANTES DE TUDO) ---
!define MUI_ICON "app.ico"
!define MUI_UNICON "app.ico"

; --- CONFIGURAÇÕES BÁSICAS ---
Name "MeuPrograma"
OutFile "Instalador.exe"
InstallDir "$PROGRAMFILES\MeuPrograma"
RequestExecutionLevel admin

; --- ÍCONE DO INSTALADOR (DEPOIS DAS DEFINIÇÕES) ---
Icon "app.ico"
UninstallIcon "app.ico"

; --- CONFIGURAÇÕES DAS IMAGENS DO WIZARD ---
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "test_header.bmp"
!define MUI_HEADERIMAGE_RIGHT
!define MUI_WELCOMEFINISHPAGE_BITMAP "test_welcome.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP_NOSTRETCH

; --- PÁGINAS DO INSTALADOR ---
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; --- PÁGINAS DO DESINSTALADOR ---
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; --- IDIOMA ---
!insertmacro MUI_LANGUAGE "PortugueseBR"

; --- SEÇÃO DE INSTALAÇÃO ---
Section "MeuPrograma" SecMain
    SetOutPath "$INSTDIR"
    ; File /r "dist\*"  # Descomente quando tiver arquivos
    
    ; Criar desinstalador
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    
    ; Registros do Windows
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MeuPrograma" "DisplayName" "MeuPrograma"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MeuPrograma" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MeuPrograma" "DisplayIcon" "$INSTDIR\MeuPrograma.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MeuPrograma" "Publisher" "Minha Empresa"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MeuPrograma" "DisplayVersion" "1.0.0"
SectionEnd

; --- SEÇÃO DE DESINSTALAÇÃO ---
Section "Uninstall"
    Delete "$INSTDIR\Uninstall.exe"
    RMDir /r "$INSTDIR"
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MeuPrograma"
SectionEnd
