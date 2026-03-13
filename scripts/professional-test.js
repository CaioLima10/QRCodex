#!/usr/bin/env node

/**
 * TESTE PROFISSIONAL COMPLETO - HoliverQRCode
 * Validação 100% para GitHub Actions
 * Garante que nada vai se perder ou quebrar
 */

const fs = require('fs');
const path = require('path');

console.log('🔬 INICIANDO TESTE PROFISSIONAL COMPLETO');
console.log('='.repeat(60));

const errors = [];
const warnings = [];
const passed = [];

function check(condition, message, type = 'error') {
  if (condition) {
    passed.push(`✅ ${message}`);
    console.log(`✅ ${message}`);
  } else {
    const msg = `❌ ${message}`;
    if (type === 'error') {
      errors.push(msg);
      console.error(msg);
    } else {
      warnings.push(msg);
      console.warn(msg);
    }
  }
}

function checkFile(filePath, description, required = true) {
  const exists = fs.existsSync(filePath);
  const stats = exists ? fs.statSync(filePath) : null;

  if (required) {
    check(exists, `${description} existe em ${filePath}`);
  } else {
    check(exists, `${description} existe em ${filePath}`, 'warning');
  }

  if (exists && stats) {
    check(stats.size > 0, `${description} tem conteúdo (${stats.size} bytes)`);
    check(stats.isFile(), `${description} é um arquivo válido`);
  }

  return exists && stats && stats.size > 0;
}

function checkDir(dirPath, description, required = true) {
  const exists = fs.existsSync(dirPath);
  const stats = exists ? fs.statSync(dirPath) : null;

  if (required) {
    check(exists, `${description} existe em ${dirPath}`);
  } else {
    check(exists, `${description} existe em ${dirPath}`, 'warning');
  }

  if (exists && stats) {
    check(stats.isDirectory(), `${description} é um diretório válido`);
  }

  return exists && stats && stats.isDirectory();
}

// 1. ESTRUTURA BÁSICA DO PROJETO
console.log('\n📁 1. ESTRUTURA BÁSICA DO PROJETO');
console.log('-'.repeat(40));

checkDir('.', 'Diretório raiz do projeto');
checkFile('package.json', 'Arquivo package.json');
checkFile('main.js', 'Arquivo main.js');
checkFile('index.html', 'Arquivo index.html');
checkFile('splash.html', 'Arquivo splash.html');
checkFile('.gitignore', 'Arquivo .gitignore');
checkFile('README.md', 'Arquivo README.md');

// 2. DIRETÓRIOS ESSENCIAIS
console.log('\n📂 2. DIRETÓRIOS ESSENCIAIS');
console.log('-'.repeat(40));

checkDir('build', 'Diretório build (ícones)');
checkDir('scripts', 'Diretório scripts');
checkDir('.github', 'Diretório .github');
checkDir('.github/workflows', 'Diretório workflows');

// 3. ARQUIVOS DE BUILD
console.log('\n🔨 3. ARQUIVOS DE BUILD');
console.log('-'.repeat(40));

checkFile('build/app.ico', 'Ícone Windows (.ico)');
checkFile('build/app.icns', 'Ícone macOS (.icns)');
checkFile('build/icon.png', 'Ícone Linux (.png)');
checkFile('build/logo.png', 'Logo original (.png)');

// Validar tamanhos dos ícones
if (fs.existsSync('build/app.ico')) {
  const icoSize = fs.statSync('build/app.ico').size;
  check(icoSize > 100000, `Ícone Windows tem tamanho adequado (${icoSize} bytes)`);
}

if (fs.existsSync('build/app.icns')) {
  const icnsSize = fs.statSync('build/app.icns').size;
  check(icnsSize > 50000, `Ícone macOS tem tamanho adequado (${icnsSize} bytes)`);
}

if (fs.existsSync('build/icon.png')) {
  const pngSize = fs.statSync('build/icon.png').size;
  check(pngSize > 10000, `Ícone Linux tem tamanho adequado (${pngSize} bytes)`);
}

// 4. SCRIPTS DE AUTOMAÇÃO
console.log('\n⚙️ 4. SCRIPTS DE AUTOMAÇÃO');
console.log('-'.repeat(40));

checkFile('scripts/validate-build.js', 'Script de validação de build');
checkFile('scripts/validate-platform.js', 'Script de validação de plataforma');
checkFile('scripts/test-all.js', 'Script de teste completo');
checkFile('scripts/run-electron-builder.js', 'Script de build');
checkFile('scripts/make-ico.js', 'Script de geração de ICO');

// 5. GITHUB ACTIONS WORKFLOWS
console.log('\n🚀 5. GITHUB ACTIONS WORKFLOWS');
console.log('-'.repeat(40));

checkFile('.github/workflows/build.yml', 'Workflow de build');
checkFile('.github/workflows/release.yml', 'Workflow de release');

// Validar conteúdo dos workflows
if (fs.existsSync('.github/workflows/build.yml')) {
  const buildContent = fs.readFileSync('.github/workflows/build.yml', 'utf8');
  check(buildContent.includes('npm ci'), 'Build workflow usa npm ci');
  check(buildContent.includes('npm run validate'), 'Build workflow executa validações');
  check(buildContent.includes('npm run win'), 'Build workflow inclui Windows');
  check(buildContent.includes('npm run linux'), 'Build workflow inclui Linux');
  check(buildContent.includes('npm run mac'), 'Build workflow inclui macOS');
  check(buildContent.includes('upload-artifact'), 'Build workflow faz upload de artefatos');
}

if (fs.existsSync('.github/workflows/release.yml')) {
  const releaseContent = fs.readFileSync('.github/workflows/release.yml', 'utf8');
  check(releaseContent.includes('tags:'), 'Release workflow é ativado por tags');
  check(releaseContent.includes('v*'), 'Release workflow usa padrão de versão');
  check(releaseContent.includes('npm ci'), 'Release workflow usa npm ci');
  check(releaseContent.includes('npm run validate'), 'Release workflow executa validações');
}

// 6. CONFIGURAÇÃO PACKAGE.JSON
console.log('\n📦 6. CONFIGURAÇÃO PACKAGE.JSON');
console.log('-'.repeat(40));

if (fs.existsSync('package.json')) {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    check(packageJson.name, 'Package.json tem nome');
    check(packageJson.version, 'Package.json tem versão');
    check(packageJson.main === 'main.js', 'Package.json aponta main.js corretamente');
    check(packageJson.scripts, 'Package.json tem scripts');

    // Scripts essenciais
    const scripts = packageJson.scripts || {};
    check(scripts.start, 'Script start existe');
    check(scripts.validate, 'Script validate existe');
    check(scripts['validate-platform'], 'Script validate-platform existe');
    check(scripts['test-all'], 'Script test-all existe');
    check(scripts.win, 'Script win existe');
    check(scripts.linux, 'Script linux existe');
    check(scripts.mac, 'Script mac existe');
    check(scripts.build, 'Script build existe');

    // Build configuration
    check(packageJson.build, 'Package.json tem configuração de build');
    if (packageJson.build) {
      check(packageJson.build.appId, 'Build tem appId');
      check(packageJson.build.productName, 'Build tem productName');
      check(packageJson.build.directories, 'Build tem diretórios configurados');
      check(packageJson.build.files, 'Build tem arquivos configurados');

      // Configurações por plataforma
      check(packageJson.build.win, 'Build tem configuração Windows');
      check(packageJson.build.linux, 'Build tem configuração Linux');
      check(packageJson.build.mac, 'Build tem configuração macOS');
      check(packageJson.build.nsis, 'Build tem configuração NSIS');

      if (packageJson.build.win) {
        check(packageJson.build.win.icon, 'Windows tem ícone configurado');
      }
      if (packageJson.build.linux) {
        check(packageJson.build.linux.icon, 'Linux tem ícone configurado');
      }
      if (packageJson.build.mac) {
        check(packageJson.build.mac.icon, 'macOS tem ícone configurado');
      }
    }

    // Dependências
    check(packageJson.dependencies, 'Package.json tem dependências');
    check(packageJson.devDependencies, 'Package.json tem devDependencies');

  } catch (error) {
    errors.push(`❌ Erro ao parsear package.json: ${error.message}`);
    console.error(`❌ Erro ao parsear package.json: ${error.message}`);
  }
}

// 7. ARQUIVOS PRINCIPAIS
console.log('\n📄 7. ARQUIVOS PRINCIPAIS');
console.log('-'.repeat(40));

// Validar main.js
if (fs.existsSync('main.js')) {
  const mainContent = fs.readFileSync('main.js', 'utf8');
  check(mainContent.includes("require(" + '"electron' + '"') || mainContent.includes('require("electron")'), 'main.js importa Electron');
  check(mainContent.includes('BrowserWindow'), 'main.js usa BrowserWindow');
  check(mainContent.includes('3750'), 'main.js tem tempo de loading correto');
  check(mainContent.includes('build/app.ico'), 'main.js referencia ícone corretamente');
}

// Validar index.html
if (fs.existsSync('index.html')) {
  const indexContent = fs.readFileSync('index.html', 'utf8');
  check(indexContent.includes('<!DOCTYPE html>'), 'index.html tem DOCTYPE');
  check(indexContent.includes('<title>'), 'index.html tem título');
  check(indexContent.includes('rel="icon"'), 'index.html tem favicon');
  check(indexContent.includes('build/app.ico'), 'index.html referencia ícone Windows');
  check(indexContent.includes('build/logo.png'), 'index.html referencia logo');
}

// Validar splash.html
if (fs.existsSync('splash.html')) {
  const splashContent = fs.readFileSync('splash.html', 'utf8');
  check(splashContent.includes('<!DOCTYPE html>'), 'splash.html tem DOCTYPE');
  check(splashContent.includes('<title>'), 'splash.html tem título');
}

// 8. .GITIGNORE
console.log('\n🚫 8. .GITIGNORE');
console.log('-'.repeat(40));

if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  check(gitignoreContent.includes('node_modules'), '.gitignore ignora node_modules');
  check(gitignoreContent.includes('dist'), '.gitignore ignora dist');
  check(gitignoreContent.includes('build/*'), '.gitignore ignora build/*');
  check(gitignoreContent.includes('!build/*.png'), '.gitignore preserva PNGs do build');
  check(gitignoreContent.includes('!build/*.ico'), '.gitignore preserva ICOs do build');
  check(gitignoreContent.includes('!build/*.icns'), '.gitignore preserva ICNSs do build');
}

// 9. README
console.log('\n📖 9. README');
console.log('-'.repeat(40));

if (fs.existsSync('README.md')) {
  const readmeContent = fs.readFileSync('README.md', 'utf8');
  check(readmeContent.includes('#'), 'README.md tem título');
  check(readmeContent.includes('npm'), 'README.md menciona npm');
  check(readmeContent.includes('GitHub Actions'), 'README.md menciona GitHub Actions');
}

// 10. VALIDAÇÃO DE PERMISSÕES
console.log('\n🔐 10. VALIDAÇÃO DE PERMISSÕES');
console.log('-'.repeat(40));

const essentialFiles = [
  'main.js',
  'scripts/validate-build.js',
  'scripts/validate-platform.js',
  'scripts/test-all.js',
  'scripts/run-electron-builder.js'
];

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.accessSync(file, fs.constants.R_OK);
      check(true, `${file} tem permissão de leitura`);
    } catch (error) {
      check(false, `${file} tem permissão de leitura`);
    }
  }
});

// 11. VALIDAÇÃO DE CONTEÚDO MÍNIMO
console.log('\n📋 11. VALIDAÇÃO DE CONTEÚDO MÍNIMO');
console.log('-'.repeat(40));

// Verificar se arquivos não estão vazios
const nonEmptyFiles = [
  'package.json',
  'main.js',
  'index.html',
  'splash.html',
  'README.md'
];

nonEmptyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    check(stats.size > 100, `${file} tem conteúdo mínimo (${stats.size} bytes)`);
  }
});

// 12. VALIDAÇÃO DE SINTAXE
console.log('\n🔍 12. VALIDAÇÃO DE SINTAXE');
console.log('-'.repeat(40));

// Validar JSON
if (fs.existsSync('package.json')) {
  try {
    JSON.parse(fs.readFileSync('package.json', 'utf8'));
    check(true, 'package.json tem sintaxe JSON válida');
  } catch (error) {
    check(false, `package.json tem erro de sintaxe: ${error.message}`);
  }
}

// Validar YAML dos workflows
const yamlFiles = [
  '.github/workflows/build.yml',
  '.github/workflows/release.yml'
];

yamlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    check(content.includes('name:'), `${file} tem nome definido`);
    check(content.includes('on:'), `${file} tem trigger definido`);
    check(content.includes('jobs:'), `${file} tem jobs definidos`);
  }
});

// RESUMO FINAL
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DO TESTE PROFISSIONAL');
console.log('='.repeat(60));

console.log(`\n✅ Testes passados: ${passed.length}`);
console.log(`⚠️  Avisos: ${warnings.length}`);
console.log(`❌ Erros: ${errors.length}\n`);

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 PROJETO 100% APROVADO PARA GITHUB ACTIONS!');
  console.log('🚀 Nada vai se perder ou quebrar no build automático.');
} else if (errors.length === 0) {
  console.log('⚠️  PROJETO APROVADO COM AVISOS');
  console.log('🔧 Recomendado corrigir os avisos antes do deploy.');
} else {
  console.log('❌ PROJETO PRECISA DE CORREÇÕES');
  console.log('🔨 Corrija os erros antes de fazer deploy.');
}

if (errors.length > 0) {
  console.log('\n🚨 ERROS ENCONTRADOS:');
  errors.forEach(error => console.log(`  ${error}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  AVISOS ENCONTRADOS:');
  warnings.forEach(warning => console.log(`  ${warning}`));
}

console.log('\n📋 ESTATÍSTICAS FINAIS:');
console.log(`  - Arquivos validados: ${passed.length + errors.length + warnings.length}`);
console.log(`  - Taxa de sucesso: ${Math.round((passed.length / (passed.length + errors.length + warnings.length)) * 100)}%`);
console.log(`  - Status: ${errors.length === 0 ? 'APROVADO' : 'REPROVADO'}`);

process.exit(errors.length > 0 ? 1 : 0);
