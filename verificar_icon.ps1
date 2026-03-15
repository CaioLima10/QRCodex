# Verificar se o ícone foi embutido no .exe
# Execute este script para analisar o instalador

param(
    [string]$ExePath = "Instalador.exe"
)

Add-Type -AssemblyName System.Drawing

try {
    # Tentar extrair ícone do executável
    $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($ExePath)
    
    if ($icon -ne $null) {
        Write-Host "✅ Ícone encontrado no executável!"
        Write-Host "📏 Dimensões: $($icon.Width)x$($icon.Height)"
        Write-Host "🎨 Formato: Ícone válido do Windows"
        
        # Salvar ícone extraído para verificação
        $icon.Save("icone_extraido.ico")
        Write-Host "💾 Ícone salvo como: icone_extraido.ico"
        
    } else {
        Write-Host "❌ Nenhum ícone encontrado no executável!"
    }
    
    $icon.Dispose()
    
} catch {
    Write-Host "❌ Erro ao extrair ícone: $($_.Exception.Message)"
}

# Verificar tamanho do arquivo
$fileInfo = Get-Item $ExePath
Write-Host "📊 Tamanho do arquivo: $([math]::Round($fileInfo.Length/1MB, 2)) MB"
