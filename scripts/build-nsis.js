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

// Verificar se o diretório dist/win-unpacked ou HoliverQRCode-win32-x64 existe
const distPath = path.join(__dirname, '..', 'dist');
const possibleDirs = ['win-unpacked', 'HoliverQRCode-win32-x64'];
let winUnpackedPath = null;

for (const dir of possibleDirs) {
    const testPath = path.join(distPath, dir);
    if (fs.existsSync(testPath)) {
        winUnpackedPath = testPath;
        console.log(`📁 Found directory: ${dir}`);
        break;
    }
}

if (!winUnpackedPath) {
    console.error('❌ No Electron build directory found!');
    console.log('🔄 Attempting to generate Electron build...');

    try {
        // Tentar gerar o build do Electron
        console.log('🏗️ Running electron-packager...');
        execSync('npx electron-packager . HoliverQRCode --platform=win32 --arch=x64 --out=dist --overwrite', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

        // Verificar novamente se o diretório foi criado
        for (const dir of possibleDirs) {
            const testPath = path.join(distPath, dir);
            if (fs.existsSync(testPath)) {
                winUnpackedPath = testPath;
                console.log(`✅ Electron build generated: ${dir}`);
                break;
            }
        }

        if (!winUnpackedPath) {
            console.error('❌ Failed to generate Electron build directory!');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Failed to generate Electron build:', error.message);
        process.exit(1);
    }
}

// Verificar se o executável principal existe (electron.exe ou HoliverQRCode.exe)
const exePath1 = path.join(winUnpackedPath, 'electron.exe');
const exePath2 = path.join(winUnpackedPath, 'HoliverQRCode.exe');

let exePath = null;
if (fs.existsSync(exePath1)) {
    exePath = exePath1;
    console.log(`✅ Found electron.exe in ${winUnpackedPath}`);
} else if (fs.existsSync(exePath2)) {
    exePath = exePath2;
    console.log(`✅ Found HoliverQRCode.exe in ${winUnpackedPath}`);
}

if (!exePath) {
    console.error(`❌ No executable found in ${winUnpackedPath}!`);
    console.log('📁 Directory contents:');
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
    console.error('❌ NSIS Build failed:', error.message);
    console.error('💡 Check if dist/win-unpacked directory exists and contains HoliverQRCode.exe');
    process.exit(1);
}
