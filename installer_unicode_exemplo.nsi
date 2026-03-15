; ===================================================
; Instalador NSIS HoliverQRCode - Unicode Completo
; Suporte total para português e múltiplos idiomas
; ===================================================

; --- SUPORE UNICODE ---
Unicode true

; --- INCLUDES ---
!include "MUI2.nsh"

; --- DEFINIÇÕES DO ÍCONE (ANTES DE TUDO) ---
!define MUI_ICON "app.ico"
!define MUI_UNICON "app.ico"

; --- CONFIGURAÇÕES BÁSICAS ---
Name "HoliverQRCode"
OutFile "HoliverQRCode_Installer.exe"
InstallDir "$PROGRAMFILES\HoliverQRCode"
RequestExecutionLevel admin

; --- ÍCONE DO INSTALADOR (DEPOIS DAS DEFINIÇÕES) ---
Icon "app.ico"
UninstallIcon "app.ico"

; --- CONFIGURAÇÕES DAS IMAGENS DO WIZARD ---
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header_grande.bmp"
!define MUI_HEADERIMAGE_RIGHT
!define MUI_WELCOMEFINISHPAGE_BITMAP "ii1nstaller.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP_NOSTRETCH

; --- PÁGINAS DO INSTALADOR ---
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "license_ansi.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; --- PÁGINAS DO DESINSTALADOR ---
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; --- IDIOMAS ---
LoadLanguageFile "${NSISDIR}\Contrib\Language files\PortugueseBR.nlf"
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_LANGUAGE "French"
!insertmacro MUI_LANGUAGE "German"
!insertmacro MUI_LANGUAGE "Italian"

; --- IDIOMA PADRÃO ---
!define MUI_LANGDLL_ALLLANGUAGES

; --- SEÇÃO DE INSTALAÇÃO ---
Section "HoliverQRCode" SecMain
    SetOutPath "$INSTDIR"
    File /r "dist\*"
    
    ; Criar desinstalador
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    
    ; Registros do Windows
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayName" "HoliverQRCode"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayIcon" "$INSTDIR\HoliverQRCode.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "Publisher" "Holiver Core"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayVersion" "1.0.1"
SectionEnd

; --- SEÇÃO DE DESINSTALAÇÃO ---
Section "Uninstall"
    Delete "$INSTDIR\Uninstall.exe"
    RMDir /r "$INSTDIR"
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode"
SectionEnd
