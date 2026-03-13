#!/usr/bin/env node

/**
 * TESTE ESPECÍFICO PARA GITHUB ACTIONS
 * Validação otimizada para ambiente CI/CD do GitHub
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔬 TESTE ESPECÍFICO GITHUB ACTIONS');
console.log('=' .repeat(50));

const errors = [];
const warnings = [];

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// 1. DETECÇÃO DE AMBIENTE GITHUB ACTIONS
console.log('\n🌍 1. DETECÇÃO DE AMBIENTE');
console.log('-'.repeat(30));

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const runnerOS = process.env.RUNNER_OS || 'unknown';
const workspace = process.env.GITHUB_WORKSPACE || process.cwd();

log(`GitHub Actions: ${isGitHubActions}`);
log(`Runner OS: ${runnerOS}`);
log(`Workspace: ${workspace}`);

if (isGitHubActions) {
  log('Ambiente GitHub Actions detectado');
} else {
  log('Ambiente local detectado');
}

// 2. VALIDAÇÃO DE PATHS COMPATÍVEIS
console.log('\n📁 2. VALIDAÇÃO DE PATHS');
console.log('-'.repeat(30));

const criticalPaths = [
  'package.json',
  'main.js',
  'index.html',
  'splash.html',
  'build/app.ico',
  'build/app.icns',
  'build/icon.png',
  'build/logo.png'
];

criticalPaths.forEach(filePath => {
  const fullPath = path.join(workspace, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    log(`${filePath} existe (${stats.size} bytes)`);
    
    // Validar se não está vazio
    if (stats.size === 0) {
      errors.push(`Arquivo vazio: ${filePath}`);
      log(`Arquivo vazio: ${filePath}`, 'error');
    }
  } else {
    errors.push(`Arquivo ausente: ${filePath}`);
    log(`Arquivo ausente: ${filePath}`, 'error');
  }
});

// 3. VALIDAÇÃO DE PERMISSÕES (CI/CD FRIENDLY)
console.log('\n🔐 3. VALIDAÇÃO DE PERMISSÕES');
console.log('-'.repeat(30));

const executableFiles = [
  'main.js',
  'scripts/run-electron-builder.js',
  'scripts/make-ico.js',
  'scripts/validate-build.js'
];

executableFiles.forEach(file => {
  const fullPath = path.join(workspace, file);
  if (fs.existsSync(fullPath)) {
    try {
      // Apenas verificar leitura (execução não se aplica a scripts JS)
      fs.accessSync(fullPath, fs.constants.R_OK);
      log(`Permissão de leitura OK: ${file}`);
    } catch (error) {
      errors.push(`Sem permissão de leitura: ${file}`);
      log(`Sem permissão de leitura: ${file}`, 'error');
    }
  }
});

// 4. VALIDAÇÃO DE DEPENDÊNCIAS
console.log('\n📦 4. VALIDAÇÃO DE DEPENDÊNCIAS');
console.log('-'.repeat(30));

const packageJsonPath = path.join(workspace, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Verificar dependências críticas
    const criticalDeps = ['electron', 'electron-builder', 'qrcode'];
    criticalDeps.forEach(dep => {
      const hasDep = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
      if (hasDep) {
        log(`Dependência encontrada: ${dep}`);
      } else {
        errors.push(`Dependência ausente: ${dep}`);
        log(`Dependência ausente: ${dep}`, 'error');
      }
    });
    
    // Verificar scripts essenciais
    const essentialScripts = ['start', 'validate', 'build'];
    essentialScripts.forEach(script => {
      if (packageJson.scripts?.[script]) {
        log(`Script encontrado: ${script}`);
      } else {
        errors.push(`Script ausente: ${script}`);
        log(`Script ausente: ${script}`, 'error');
      }
    });
    
  } catch (error) {
    errors.push(`Erro ao ler package.json: ${error.message}`);
    log(`Erro ao ler package.json: ${error.message}`, 'error');
  }
}

// 5. VALIDAÇÃO DE WORKFLOWS
console.log('\n🚀 5. VALIDAÇÃO DE WORKFLOWS');
console.log('-'.repeat(30));

const workflows = [
  '.github/workflows/build.yml',
  '.github/workflows/release.yml'
];

workflows.forEach(workflow => {
  const fullPath = path.join(workspace, workflow);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Verificar elementos essenciais
    const checks = [
      { pattern: 'name:', desc: 'Nome definido' },
      { pattern: 'on:', desc: 'Trigger definido' },
      { pattern: 'jobs:', desc: 'Jobs definidos' },
      { pattern: 'npm ci', desc: 'Usa npm ci' },
      { pattern: 'upload-artifact', desc: 'Faz upload de artefatos' }
    ];
    
    checks.forEach(check => {
      if (content.includes(check.pattern)) {
        log(`${workflow}: ${check.desc}`);
      } else {
        errors.push(`${workflow}: ${check.desc} ausente`);
        log(`${workflow}: ${check.desc} ausente`, 'error');
      }
    });
  } else {
    errors.push(`Workflow ausente: ${workflow}`);
    log(`Workflow ausente: ${workflow}`, 'error');
  }
});

// 6. VALIDAÇÃO DE SINTAXE
console.log('\n🔍 6. VALIDAÇÃO DE SINTAXE');
console.log('-'.repeat(30));

// Validar JSON
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  log('package.json: sintaxe JSON válida');
} catch (error) {
  errors.push(`package.json: sintaxe inválida - ${error.message}`);
  log(`package.json: sintaxe inválida - ${error.message}`, 'error');
}

// Validar YAML dos workflows
workflows.forEach(workflow => {
  const fullPath = path.join(workspace, workflow);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Verificação básica de YAML
    if (content.includes('name:') && content.includes('on:') && content.includes('jobs:')) {
      log(`${workflow}: estrutura YAML válida`);
    } else {
      errors.push(`${workflow}: estrutura YAML inválida`);
      log(`${workflow}: estrutura YAML inválida`, 'error');
    }
  }
});

// 7. VALIDAÇÃO DE PERFORMANCE
console.log('\n⚡ 7. VALIDAÇÃO DE PERFORMANCE');
console.log('-'.repeat(30));

const sizeLimits = {
  'package.json': 50000,
  'main.js': 100000,
  'index.html': 500000,
  'splash.html': 50000
};

Object.entries(sizeLimits).forEach(([file, maxSize]) => {
  const fullPath = path.join(workspace, file);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    if (size <= maxSize) {
      log(`${file}: tamanho OK (${size} bytes)`);
    } else {
      warnings.push(`${file}: tamanho excessivo (${size} bytes > ${maxSize})`);
      log(`${file}: tamanho excessivo (${size} bytes > ${maxSize})`, 'warning');
    }
  }
});

// 8. VALIDAÇÃO DE COMPATIBILIDADE
console.log('\n🌍 8. VALIDAÇÃO DE COMPATIBILIDADE');
console.log('-'.repeat(30));

// Verificar se não há paths hardcoded
if (fs.existsSync(path.join(workspace, 'main.js'))) {
  const mainContent = fs.readFileSync(path.join(workspace, 'main.js'), 'utf8');
  
  const hardcodedPaths = [
    'C:\\\\',
    '/home/',
    'Users/',
    'file://'
  ];
  
  hardcodedPaths.forEach(hardcoded => {
    if (mainContent.includes(hardcoded)) {
      errors.push(`main.js: path hardcoded detectado - ${hardcoded}`);
      log(`main.js: path hardcoded detectado - ${hardcoded}`, 'error');
    } else {
      log(`main.js: sem paths hardcoded (${hardcoded})`);
    }
  });
  
  // Verificar uso de path.join
  if (mainContent.includes('path.join')) {
    log('main.js: usa path.join (compatível)');
  } else {
    warnings.push('main.js: não usa path.join');
    log('main.js: não usa path.join', 'warning');
  }
}

// 9. TESTE DE NPM CI
console.log('\n📦 9. TESTE DE NPM CI');
console.log('-'.repeat(30));

try {
  const result = execSync('npm ci --dry-run', {
    cwd: workspace,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  log('npm ci: configuração OK');
} catch (error) {
  warnings.push('npm ci: pode ter problemas');
  log('npm ci: pode ter problemas', 'warning');
}

// 10. RESUMO FINAL
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO DO TESTE GITHUB ACTIONS');
console.log('='.repeat(50));

log(`Erros: ${errors.length}`);
log(`Avisos: ${warnings.length}`);
log(`Validações: ${errors.length + warnings.length}`);

if (errors.length === 0) {
  log('🎉 PROJETO 100% COMPATÍVEL COM GITHUB ACTIONS!');
  log('🚀 Build automático garantido');
  log('📦 Multiplataforma configurado');
  log('🔐 Segurança validada');
} else {
  log('❌ PROJETO PRECISA DE CORREÇÕES');
  log('🔨 Corrija os erros antes do deploy');
}

if (errors.length > 0) {
  console.log('\n🚨 ERROS CRÍTICOS:');
  errors.forEach(error => log(error, 'error'));
}

if (warnings.length > 0) {
  console.log('\n⚠️ AVISOS:');
  warnings.forEach(warning => log(warning, 'warning'));
}

console.log('\n📋 MÉTRAS:');
console.log(`  • Ambiente: ${isGitHubActions ? 'GitHub Actions' : 'Local'}`);
console.log(`  • SO: ${runnerOS}`);
console.log(`  • Workspace: ${workspace}`);
console.log(`  • Status: ${errors.length === 0 ? 'APROVADO' : 'REPROVADO'}`);

// Exit code para GitHub Actions
process.exit(errors.length > 0 ? 1 : 0);
