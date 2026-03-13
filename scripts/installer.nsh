; Script NSIS personalizado para HoliverQRCode
; Instalador profissional com validações

!macro customInstall
  ; Criar diretórios adicionais se necessário
  CreateDirectory "$APPDATA\HoliverQRCode"
  
  ; Definir permissões adequadas
  AccessControl::GrantOnFile "$INSTDIR\HoliverQRCode.exe" "(BU)"
  
  ; Registrar desinstalador no Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayName" "HoliverQRCode"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "UninstallString" "$INSTDIR\Uninstall HoliverQRCode.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayIcon" "$INSTDIR\HoliverQRCode.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "Publisher" "Holiver Core"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode" "DisplayVersion" "1.0.1"
  
  ; Limpar registros antigos se existirem
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}"
!macroend

!macro customUnInstall
  ; Remover diretórios de dados do usuário
  RMDir /r "$APPDATA\HoliverQRCode"
  
  ; Remover registros do Windows
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HoliverQRCode"
  DeleteRegKey HKCU "Software\HoliverQRCode"
  
  ; Remover atalhos adicionais se existirem
  Delete "$DESKTOP\HoliverQRCode.lnk"
  Delete "$STARTMENU\Programs\HoliverQRCode\HoliverQRCode.lnk"
  RMDir "$STARTMENU\Programs\HoliverQRCode"
!macroend

; Página de boas-vindas personalizada
!macro customWelcomePage
  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_LICENSE "scripts\license.txt"
  !insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH
!macroend

; Configurações de compressão e otimização
SetCompressor lzma
SetCompressorDictSize 64

; Validações de sistema
Function .onInit
  ; Verificar Windows 10 ou superior
  ${If} ${IsWin10}
  ${OrIf} ${IsWin11}
    ; OK - Windows compatível
  ${Else}
    MessageBox MB_OK|MB_ICONEXCLAMATION "Este aplicativo requer Windows 10 ou superior."
    Abort
  ${EndIf}
  
  ; Verificar permissões de administrador
  UserInfo::GetAccountType
  pop $0
  ${If} $0 != "admin"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Este instalador requer permissões de administrador."
    Abort
  ${EndIf}
FunctionEnd
