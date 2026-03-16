; ===================================================
; Instalador NSIS HoliverQRCode - Solução Definitiva
; Suporte Unicode completo para português
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

; --- RESTAURAR TÍTULOS ---
!define MUI_ABORTWARNING

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
!insertmacro MUI_LANGUAGE "PortugueseBR"
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_LANGUAGE "French"
!insertmacro MUI_LANGUAGE "German"
!insertmacro MUI_LANGUAGE "Italian"

; --- HABILITAR SELEÇÃO DE IDIOMA ---
!define MUI_LANGDLL_ALLLANGUAGES

; --- FUNÇÃO DE INICIALIZAÇÃO ---
Function .onInit
  !insertmacro MUI_LANGDLL_DISPLAY
  
  ; Salvar idioma escolhido no registro
  ReadRegStr $0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "Language"
  ${If} $0 == ""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "Language" "$LANGUAGE"
  ${EndIf}
  
  ; Também salvar em chave separada para fácil acesso do app
  WriteRegStr HKLM "Software\HoliverQRCode" "Language" "$LANGUAGE"
FunctionEnd
Section "HoliverQRCode" SecMain
    SetOutPath "$INSTDIR"
    File /r "dist\win-unpacked\*"
    
    ; Criar desinstalador
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    
    ; Criar atalhos
    CreateShortCut "$DESKTOP\HoliverQRCode.lnk" "$INSTDIR\HoliverQRCode.exe" "" "$INSTDIR\HoliverQRCode.exe" 0
    CreateShortCut "$SMPROGRAMS\HoliverQRCode.lnk" "$INSTDIR\HoliverQRCode.exe" "" "$INSTDIR\HoliverQRCode.exe" 0
    CreateShortCut "$SMPROGRAMS\Desinstalar HoliverQRCode.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0
    
    ; Registros do Windows
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayName" "HoliverQRCode"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayIcon" "$INSTDIR\HoliverQRCode.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "Publisher" "Holiver Core"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayVersion" "2.0.9"
SectionEnd

; --- SEÇÃO DE DESINSTALAÇÃO ---
Section "Uninstall"
    ; Remover atalhos
    Delete "$DESKTOP\HoliverQRCode.lnk"
    Delete "$SMPROGRAMS\HoliverQRCode.lnk"
    Delete "$SMPROGRAMS\Desinstalar HoliverQRCode.lnk"
    
    ; Remover arquivos do diretório de instalação
    RMDir /r "$INSTDIR\*.*"
    RMDir "$INSTDIR"
    
    ; Remover registros do Windows
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode"
    DeleteRegKey HKLM "Software\HoliverQRCode"
SectionEnd
