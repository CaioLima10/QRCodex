; Teste MUI2 com imagens
!include "MUI2.nsh"

Name "Teste MUI2 Imagens"
OutFile "teste_mui2_img.exe"

!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "test_header.bmp"
!define MUI_HEADERIMAGE_RIGHT
!define MUI_WELCOMEFINISHPAGE_BITMAP "test_welcome.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP_NOSTRETCH

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "scripts\license.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "PortugueseBR"

Section "Teste"
SectionEnd
