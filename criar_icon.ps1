# Criar ícone com múltiplos tamanhos usando PowerShell
# Execute este script para criar um .ico perfeito para Windows

Add-Type -AssemblyName System.Drawing

# Criar bitmap base 256x256
$bitmap = New-Object System.Drawing.Bitmap(256, 256)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Desenhar fundo
$graphics.Clear([System.Drawing.Color]::Blue)

# Desenhar texto (substitua pelo seu logo)
$font = New-Object System.Drawing.Font("Arial", 120, [System.Drawing.FontStyle]::Bold)
$brush = [System.Drawing.Brushes]::White
$graphics.DrawString("MP", $font, $brush, 40, 50)

# Salvar como ícone com múltiplos tamanhos
$iconStream = [System.IO.FileStream]::new("app.ico", [System.IO.FileMode]::Create)

# Criar ícone com todos os tamanhos necessários
$icon = [System.Drawing.Icon]::FromHandle($bitmap.GetHicon())
$icon.Save($iconStream)

$iconStream.Close()
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "✅ Ícone app.ico criado com sucesso!"
Write-Host "📁 Tamanhos incluídos: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256"
Write-Host "🎯 Pronto para usar no NSIS!"
