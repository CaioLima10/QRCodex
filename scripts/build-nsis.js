#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building NSIS Installer...');

// Verificar se o arquivo Installer.nsi existe
const installerPath = path.join(__dirname, '..', 'Installer.nsi');
if (!fs.existsSync(installerPath)) {
    console.error('❌ Installer.nsi not found!');
    process.exit(1);
}

// Verificar se o makensis.exe existe
const makensisPath = 'C:\\Program Files (x86)\\NSIS\\makensis.exe';
if (!fs.existsSync(makensisPath)) {
    console.error('❌ NSIS not found! Please install NSIS first.');
    process.exit(1);
}

try {
    // Compilar o instalador
    console.log('📦 Compiling Installer.nsi...');
    execSync(`"${makensisPath}" "${installerPath}"`, { stdio: 'inherit' });
    
    // Verificar se o instalador foi criado
    const installerExe = path.join(__dirname, '..', 'HoliverQRCode_Installer.exe');
    if (fs.existsSync(installerExe)) {
        const stats = fs.statSync(installerExe);
        console.log(`✅ NSIS Installer built successfully!`);
        console.log(`📁 File: HoliverQRCode_Installer.exe`);
        console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    } else {
        console.error('❌ Installer executable not found after build!');
        process.exit(1);
    }
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
