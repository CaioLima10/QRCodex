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

// Verificar se o diretório dist/win-*-unpacked existe
const distPath = path.join(__dirname, '..', 'dist');
const winUnpackedPattern = path.join(distPath, 'win-*-unpacked');
const winUnpackedDirs = fs.readdirSync(distPath)
    .filter(dir => dir.startsWith('win-') && dir.endsWith('-unpacked'))
    .map(dir => path.join(distPath, dir));

if (winUnpackedDirs.length === 0) {
    console.error('❌ No win-*-unpacked directory found in dist!');
    console.log('🔄 Attempting to generate Electron build...');

    try {
        // Tentar gerar o build do Electron
        console.log('🏗️ Running electron-builder...');
        execSync('npm run win', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

        // Verificar novamente
        const newDirs = fs.readdirSync(distPath)
            .filter(dir => dir.startsWith('win-') && dir.endsWith('-unpacked'))
            .map(dir => path.join(distPath, dir));

        if (newDirs.length === 0) {
            console.error('❌ Failed to generate win-*-unpacked directory!');
            process.exit(1);
        }

        winUnpackedDirs.push(...newDirs);
        console.log('✅ Electron build generated successfully!');
    } catch (error) {
        console.error('❌ Failed to generate Electron build:', error.message);
        process.exit(1);
    }
}

// Usar o primeiro diretório encontrado
const winUnpackedPath = winUnpackedDirs[0];
console.log(`📁 Using directory: ${winUnpackedPath}`);

// Verificar se o executável principal existe
const exePath = path.join(winUnpackedPath, 'HoliverQRCode.exe');
if (!fs.existsSync(exePath)) {
    console.error(`❌ HoliverQRCode.exe not found in ${winUnpackedPath}!`);
    console.log('� Directory contents:');
    fs.readdirSync(winUnpackedPath).forEach(file => {
        console.log(`  - ${file}`);
    });
    process.exit(1);
}

console.log('✅ Electron build found in dist/win-unpacked');

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
