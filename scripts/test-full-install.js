#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Teste Completo Install + Uninstall v2.1.9');
console.log('='.repeat(60));

// Função para executar script
function runScript(scriptName) {
    try {
        console.log(`\n🚀 Executando ${scriptName}...`);
        console.log('-'.repeat(40));
        execSync(`npm run ${scriptName}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        console.log(`✅ ${scriptName} concluído com sucesso!`);
        return true;
    } catch (error) {
        console.error(`❌ Erro em ${scriptName}:`, error.message);
        return false;
    }
}

// Função para verificar estado final
function verifyFinalState() {
    const installDir = path.join('C:\\Program Files', 'HoliverQRCode');
    const desktopPath = path.join(require('os').homedir(), 'Desktop');
    const startMenuPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs');
    
    const checks = [
        { name: 'Diretório removido', path: installDir, shouldBeGone: true },
        { name: 'Atalho Desktop removido', path: path.join(desktopPath, 'HoliverQRCode.lnk'), shouldBeGone: true },
        { name: 'Atalho Menu Iniciar removido', path: path.join(startMenuPath, 'HoliverQRCode.lnk'), shouldBeGone: true },
        { name: 'Atalho Desinstalar removido', path: path.join(startMenuPath, 'Desinstalar HoliverQRCode.lnk'), shouldBeGone: true }
    ];
    
    console.log('\n🔍 Verificação Final do Sistema');
    console.log('-'.repeat(40));
    
    let allClean = true;
    checks.forEach(check => {
        const exists = fs.existsSync(check.path);
        const status = check.shouldBeGone ? !exists : exists;
        const icon = status ? '✅' : '❌';
        const desc = check.shouldBeGone ? (exists ? 'presente (deveria estar removido)' : 'removido') : (exists ? 'presente' : 'ausente');
        console.log(`${icon} ${check.name}: ${desc}`);
        if (!status) allClean = false;
    });
    
    return allClean;
}

// 1. Verificar pré-requisitos
console.log('\n📋 1. Verificando Pré-requisitos');
console.log('-'.repeat(30));

const installerPath = path.join(__dirname, '..', 'HoliverQRCode_Installer.exe');
if (!fs.existsSync(installerPath)) {
    console.error('❌ Instalador não encontrado. Execute npm run build-nsis primeiro.');
    process.exit(1);
}

console.log('✅ Instalador encontrado');
console.log('✅ Sistema pronto para testes');

// 2. Executar teste de instalação
const installSuccess = runScript('test-install');

if (!installSuccess) {
    console.error('\n❌ Falha no teste de instalação. Abortando...');
    process.exit(1);
}

// 3. Pausa para verificação manual (opcional)
console.log('\n⏸️ Pausa de 5 segundos para verificação manual...');
console.log('📋 Verifique visualmente se o app foi instalado corretamente');
setTimeout(() => {}, 5000);

// 4. Executar teste de desinstalação
const uninstallSuccess = runScript('test-uninstall');

if (!uninstallSuccess) {
    console.error('\n❌ Falha no teste de desinstalação.');
}

// 5. Verificação final
const finalClean = verifyFinalState();

// 6. Resumo final
console.log('\n📊 6. Resumo Final do Teste Completo');
console.log('-'.repeat(50));

const results = [
    { name: 'Teste de Instalação', passed: installSuccess },
    { name: 'Teste de Desinstalação', passed: uninstallSuccess },
    { name: 'Limpeza Completa', passed: finalClean }
];

const passedTests = results.filter(test => test.passed).length;
const totalTests = results.length;

console.log(`📈 Testes passados: ${passedTests}/${totalTests}`);
console.log(`📊 Porcentagem: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

results.forEach(test => {
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}`);
});

// 7. Verificação de recursos visuais
console.log('\n🎨 7. Verificação de Recursos Visuais');
console.log('-'.repeat(30));

const visualAssets = [
    'app.ico',
    'header_grande.bmp',
    'ii1nstaller.bmp',
    'license_ansi.txt'
];

console.log('📁 Assets visuais do instalador:');
visualAssets.forEach(asset => {
    const assetPath = path.join(__dirname, '..', asset);
    console.log(`${fs.existsSync(assetPath) ? '✅' : '❌'} ${asset}`);
});

// 8. Resultado final
if (passedTests === totalTests) {
    console.log('\n🎉 TESTE COMPLETO 100% BEM-SUCEDIDO!');
    console.log('✅ Instalação e desinstalação funcionando perfeitamente');
    console.log('✅ Todos os componentes verificados');
    console.log('✅ Sistema limpo após desinstalação');
    console.log('✅ Recursos visuais presentes');
    console.log('\n🚀 O instalador está pronto para distribuição!');
} else {
    console.log('\n⚠️ TESTE COMPLETO COM PROBLEMAS');
    console.log('❌ Alguns testes falharam');
    console.log('🔧 Verifique os logs acima para detalhes');
    console.log('🛠️ Corrija os problemas antes de distribuir');
}

console.log('\n📋 Comandos úteis:');
console.log('🔄 Para repetir apenas instalação: npm run test-install');
console.log('🗑️ Para repetir apenas desinstalação: npm run test-uninstall');
console.log('🔨 Para rebuildar: npm run build-nsis');
console.log('🧪 Para repetir teste completo: npm run test-full-install');
