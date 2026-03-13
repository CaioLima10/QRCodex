# HoliverQRCode

Gerador de QR Codes multiplataforma desenvolvido com Electron.

## 🚀 Build

### Desenvolvimento
```bash
npm install
npm start
```

### Validação
```bash
npm run validate          # Valida build e assets
npm run validate-platform # Valida compatibilidade
npm run test-all          # Executa todas as validações
```

### Build Local
```bash
npm run win    # Windows
npm run linux  # Linux  
npm run mac    # macOS
npm run build  # Todas plataformas
```

## 📦 GitHub Actions

O projeto possui workflows automáticos para build:

- **Build Multiplatform**: Roda em pushes na main/master
- **Release**: Roda em tags `v*` para criar releases

Os workflows executam:
1. Validação de build e plataforma
2. Build para cada sistema operacional
3. Upload dos artefatos gerados

## 📁 Estrutura

```
├── build/          # Ícones e assets
├── scripts/        # Scripts de build e validação
├── .github/        # Workflows do GitHub Actions
├── main.js         # Main process Electron
├── index.html      # Interface principal
└── splash.html     # Tela de loading
```

## 🔧 Ícones

- **Windows**: `build/app.ico`
- **macOS**: `build/app.icns` 
- **Linux**: `build/icon.png`

Todos os ícones são gerados automaticamente a partir do `build/logo.png`.
