#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando Build Completo v2.1.9');
console.log('='.repeat(40));

// Verificar diretórios
const distPath = path.join(__dirname, '..', 'dist');
const winUnpackedPath = path.join(distPath, 'win-unpacked');
const holiverPath = path.join(distPath, 'HoliverQRCode-win32-x64');

console.log('\n📁 Verificando diretórios:');
console.log(`- dist: ${fs.existsSync(distPath) ? '✅' : '❌'}`);
console.log(`- win-unpacked: ${fs.existsSync(winUnpackedPath) ? '✅' : '❌'}`);
console.log(`- HoliverQRCode-win32-x64: ${fs.existsSync(holiverPath) ? '✅' : '❌'}`);

// Verificar executáveis
const electronExe = path.join(winUnpackedPath, 'electron.exe');
const holiverExe = path.join(holiverPath, 'HoliverQRCode.exe');
const installerPath = path.join(__dirname, '..', 'HoliverQRCode_Installer.exe');

console.log('\n📦 Verificando executáveis:');
console.log(`- electron.exe: ${fs.existsSync(electronExe) ? '✅' : '❌'}`);
console.log(`- HoliverQRCode.exe: ${fs.existsSync(holiverExe) ? '✅' : '❌'}`);
console.log(`- HoliverQRCode_Installer.exe: ${fs.existsSync(installerPath) ? '✅' : '❌'}`);

// Mostrar tamanhos
if (fs.existsSync(installerPath)) {
    const stats = fs.statSync(installerPath);
    console.log(`\n📊 Tamanho do instalador: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

if (fs.existsSync(electronExe)) {
    const stats = fs.statSync(electronExe);
    console.log(`📊 Tamanho do electron.exe: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

// Verificar arquivos do instalador
console.log('\n🔍 Verificando arquivos do instalador:');
const installerFiles = [
    'app.ico',
    'header_grande.bmp',
    'ii1nstaller.bmp',
    'license_ansi.txt',
    'Installer.nsi'
];

installerFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    console.log(`- ${file}: ${fs.existsSync(filePath) ? '✅' : '❌'}`);
});

// Verificar se está tudo pronto para o GitHub Actions
const allReady = fs.existsSync(winUnpackedPath) && 
                fs.existsSync(electronExe) && 
                fs.existsSync(installerPath) &&
                fs.existsSync(path.join(__dirname, '..', 'app.ico'));

console.log('\n🎯 Status Final:');
console.log(allReady ? '✅ Build completo e pronto para GitHub Actions!' : '❌ Build incompleto - execute os testes primeiro!');

if (allReady) {
    console.log('\n🚀 Comandos para deploy:');
    console.log('git add .');
    console.log('git commit -m "🎯 Build Completo v2.1.9 - GitHub Actions Ready"');
    console.log('git push origin main');
    console.log('git tag v2.1.9');
    console.log('git push origin v2.1.9');
}
