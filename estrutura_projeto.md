# Estrutura de pastas recomendada para instalador NSIS
# Copie esta estrutura para organizar seu projeto

MeuProjeto/
├── instalador_definitivo.nsi     # Script NSIS principal
├── app.ico                      # Ícone do instalador (todos os tamanhos)
├── header.bmp                   # Imagem do header (150x57, 24bpp)
├── welcome.bmp                  # Imagem de boas-vindas (164x314, 24bpp)
├── license.txt                  # Arquivo de licença
├── dist/                        # Arquivos do programa
│   ├── MeuPrograma.exe
│   ├── *.dll
│   └── assets/
├── scripts/                     # Scripts auxiliares
│   ├── criar_icon.ps1           # Criar ícone correto
│   ├── limpar_cache_icones.bat  # Limpar cache do Windows
│   └── verificar_icon.ps1      # Verificar ícone no .exe
└── build/                       # Arquivos gerados
    ├── Instalador.exe
    └── Uninstall.exe

# REQUISITOS DOS ARQUIVOS:
# 
# app.ico:
# - Formato: .ico com múltiplos tamanhos
# - Tamanhos: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
# - Cores: 32bpp com transparência
# - Tamanho máximo: 256KB
#
# header.bmp:
# - Formato: BMP 24bpp RGB (sem transparência)
# - Dimensões: 150x57 pixels
# - Tamanho máximo: 50KB
#
# welcome.bmp:
# - Formato: BMP 24bpp RGB (sem transparência)
# - Dimensões: 164x314 pixels
# - Tamanho máximo: 100KB
