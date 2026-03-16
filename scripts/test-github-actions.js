#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Simulando GitHub Actions - Build Test v2.1.9');
console.log('='.repeat(50));

// 1. Build Electron app
console.log('\n📦 1. Build Electron App');
console.log('-'.repeat(30));

try {
    console.log('🏗️ Running electron-packager...');
    execSync('npx electron-packager . HoliverQRCode --platform=win32 --arch=x64 --out=dist --overwrite', { stdio: 'inherit' });
    console.log('✅ Electron build completed successfully!');
} catch (error) {
    console.error('❌ Electron build failed:', error.message);
    process.exit(1);
}

// 2. Verify Electron build
console.log('\n🔍 2. Verify Electron Build');
console.log('-'.repeat(30));

const distPath = path.join(__dirname, '..', 'dist');
const winUnpackedPath = path.join(distPath, 'win-unpacked');

if (!fs.existsSync(winUnpackedPath)) {
    console.error('❌ win-unpacked directory not found!');
    process.exit(1);
}

const electronExe = path.join(winUnpackedPath, 'electron.exe');
if (!fs.existsSync(electronExe)) {
    console.error('❌ electron.exe not found!');
    process.exit(1);
}

console.log('✅ Electron build verified!');
console.log(`📁 Found: ${winUnpackedPath}`);
console.log(`📊 electron.exe size: ${(fs.statSync(electronExe).size / 1024 / 1024).toFixed(2)} MB`);

// 3. Build NSIS
console.log('\n🔨 3. Build NSIS Installer');
console.log('-'.repeat(30));

try {
    console.log('📦 Compiling NSIS installer...');
    execSync('npm run build-nsis', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
    });
    console.log('✅ NSIS build completed successfully!');
} catch (error) {
    console.error('❌ NSIS build failed:', error.message);
    process.exit(1);
}

// 4. Verify NSIS build
console.log('\n🔍 4. Verify NSIS Build');
console.log('-'.repeat(30));

const installerPath = path.join(__dirname, '..', 'HoliverQRCode_Installer.exe');
if (!fs.existsSync(installerPath)) {
    console.error('❌ HoliverQRCode_Installer.exe not found!');
    process.exit(1);
}

const installerStats = fs.statSync(installerPath);
console.log('✅ NSIS installer verified!');
console.log(`📁 Found: ${installerPath}`);
console.log(`📊 Installer size: ${(installerStats.size / 1024 / 1024).toFixed(2)} MB`);

// 5. Final verification
console.log('\n🎯 5. Final Verification');
console.log('-'.repeat(30));

console.log('📋 Build Summary:');
console.log(`✅ Electron app: ${winUnpackedPath}`);
console.log(`✅ NSIS installer: ${installerPath}`);
console.log(`✅ Total size: ${((installerStats.size + fs.statSync(electronExe).size) / 1024 / 1024).toFixed(2)} MB`);

console.log('\n🎉 All tests passed! Ready for deployment!');
console.log('🚀 Push to GitHub with tag v2.1.9');
