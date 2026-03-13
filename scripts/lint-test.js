#!/usr/bin/env node

/**
 * TESTE DE LINT E FORMATAÇÃO
 * Validação de estilo e formatação de código
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 TESTE DE LINT E FORMATAÇÃO');
console.log('=' .repeat(50));

const errors = [];
const warnings = [];

function log(message, type = 'info') {
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  console.log(`${prefix} ${message}`);
}

// 1. VALIDAÇÃO DE INDENTAÇÃO JAVASCRIPT
console.log('\n📝 1. VALIDAÇÃO DE INDENTAÇÃO JAVASCRIPT');
console.log('-'.repeat(40));

const jsFiles = [
  'main.js',
  'scripts/validate-build.js',
  'scripts/validate-platform.js',
  'scripts/test-all.js',
  'scripts/professional-test.js',
  'scripts/human-error-test.js',
  'scripts/github-actions-test.js',
  'scripts/final-validation.js',
  'scripts/run-electron-builder.js',
  'scripts/make-ico.js',
  'scripts/create-uninstaller-image.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let indentationErrors = 0;
    let mixedIndentation = false;
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        const leadingWhitespace = line.substring(0, line.length - line.trimStart().length);
        
        // Verificar se há tabs misturados com espaços
        if (leadingWhitespace.includes('\t') && leadingWhitespace.includes(' ')) {
          mixedIndentation = true;
        }
        
        // Verificar se indentação é múltiplo de 2 ou 4 espaços
        if (leadingWhitespace && !leadingWhitespace.includes('\t')) {
          const spaces = leadingWhitespace.length;
          if (spaces % 2 !== 0 && spaces % 4 !== 0) {
            indentationErrors++;
          }
        }
      }
    });
    
    if (mixedIndentation) {
      errors.push(`${file}: tabs e espaços misturados`);
      log(`${file}: tabs e espaços misturados`, 'error');
    } else if (indentationErrors > 0) {
      warnings.push(`${file}: ${indentationErrors} erros de indentação`);
      log(`${file}: ${indentationErrors} erros de indentação`, 'warning');
    } else {
      log(`${file}: indentação consistente`);
    }
  }
});

// 2. VALIDAÇÃO DE ESPAÇOS EM BRANCO
console.log('\n🔍 2. VALIDAÇÃO DE ESPAÇOS EM BRANCO');
console.log('-'.repeat(40));

jsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let trailingSpaces = 0;
    let multipleEmptyLines = 0;
    let consecutiveEmpty = 0;
    
    lines.forEach(line => {
      // Verificar espaços no final da linha
      if (line.endsWith(' ') || line.endsWith('\t')) {
        trailingSpaces++;
      }
      
      // Verificar múltiplas linhas vazias consecutivas
      if (line.trim() === '') {
        consecutiveEmpty++;
        if (consecutiveEmpty > 2) {
          multipleEmptyLines++;
        }
      } else {
        consecutiveEmpty = 0;
      }
    });
    
    if (trailingSpaces > 0) {
      warnings.push(`${file}: ${trailingSpaces} linhas com espaços no final`);
      log(`${file}: ${trailingSpaces} linhas com espaços no final`, 'warning');
    } else {
      log(`${file}: sem espaços no final das linhas`);
    }
    
    if (multipleEmptyLines > 0) {
      warnings.push(`${file}: ${multipleEmptyLines} blocos com múltiplas linhas vazias`);
      log(`${file}: ${multipleEmptyLines} blocos com múltiplas linhas vazias`, 'warning');
    } else {
      log(`${file}: linhas vazias controladas`);
    }
  }
});

// 3. VALIDAÇÃO DE ESTILO DE CÓDIGO
console.log('\n⭐ 3. VALIDAÇÃO DE ESTILO DE CÓDIGO');
console.log('-'.repeat(40));

jsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar uso de aspas consistentes
    const singleQuotes = (content.match(/'/g) || []).length;
    const doubleQuotes = (content.match(/"/g) || []).length;
    
    if (singleQuotes > 0 && doubleQuotes > 0) {
      warnings.push(`${file}: aspas simples e duplas misturadas`);
      log(`${file}: aspas simples e duplas misturadas`, 'warning');
    } else {
      log(`${file}: aspas consistentes`);
    }
    
    // Verificar ponto e vírgula no final das linhas
    const lines = content.split('\n');
    let missingSemicolons = 0;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && 
          !trimmed.startsWith('//') && 
          !trimmed.startsWith('/*') &&
          !trimmed.startsWith('*') &&
          !trimmed.endsWith('{') &&
          !trimmed.endsWith('}') &&
          !trimmed.endsWith(';') &&
          !trimmed.includes('if ') &&
          !trimmed.includes('for ') &&
          !trimmed.includes('while ') &&
          !trimmed.includes('function ') &&
          !trimmed.includes('else ') &&
          !trimmed.includes('else if') &&
          !trimmed.includes('try ') &&
          !trimmed.includes('catch ') &&
          !trimmed.includes('finally ') &&
          !trimmed.includes('switch ') &&
          !trimmed.includes('case ') &&
          !trimmed.includes('default ') &&
          !trimmed.includes('break') &&
          !trimmed.includes('continue') &&
          !trimmed.includes('return ') &&
          !trimmed.includes('return;') &&
          !trimmed.includes('throw ') &&
          !trimmed.includes('debugger') &&
          !trimmed.includes('var ') &&
          !trimmed.includes('let ') &&
          !trimmed.includes('const ') &&
          !trimmed.includes('class ') &&
          !trimmed.includes('import ') &&
          !trimmed.includes('export ')) {
        
        // Verificar se é uma expressão que deveria terminar com ;
        if (trimmed.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*[\w\[\]\.]*\s*=|^[\w\[\]\.]+\s*[\w\[\]\.]*\s*=|^console\./)) {
          missingSemicolons++;
        }
      }
    });
    
    if (missingSemicolons > 0) {
      warnings.push(`${file}: ${missingSemicolons} possíveis pontos e vírgula faltando`);
      log(`${file}: ${missingSemicolons} possíveis pontos e vírgula faltando`, 'warning');
    } else {
      log(`${file}: pontos e vírgula adequados`);
    }
    
    // Verificar espaços ao redor de operadores
    const operatorIssues = content.match(/\s*[+\-*/=<>!&|^%]\s*|[+\-*/=<>!&|^%]\s*[a-zA-Z_$]/g);
    if (operatorIssues && operatorIssues.length > 0) {
      warnings.push(`${file}: possíveis problemas com espaços em operadores`);
      log(`${file}: possíveis problemas com espaços em operadores`, 'warning');
    } else {
      log(`${file}: espaços em operadores adequados`);
    }
  }
});

// 4. VALIDAÇÃO DE NOMES DE VARIÁVEIS E FUNÇÕES
console.log('\n📝 4. VALIDAÇÃO DE NOMES');
console.log('-'.repeat(40));

jsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar nomes de variáveis (camelCase)
    const varDeclarations = content.match(/(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    if (varDeclarations) {
      let namingIssues = 0;
      
      varDeclarations.forEach(decl => {
        const varName = decl.split(/\s+/)[1];
        
        // Verificar se não está em camelCase (básico)
        if (varName.includes('_') && !varName.toUpperCase() === varName) {
          namingIssues++;
        }
        
        // Verificar nomes muito curtos
        if (varName.length < 3 && !['i', 'j', 'k', 'x', 'y', 'z'].includes(varName)) {
          namingIssues++;
        }
        
        // Verificar nomes muito longos
        if (varName.length > 30) {
          namingIssues++;
        }
      });
      
      if (namingIssues > 0) {
        warnings.push(`${file}: ${namingIssues} possíveis problemas de nomeação`);
        log(`${file}: ${namingIssues} possíveis problemas de nomeação`, 'warning');
      } else {
        log(`${file}: nomes de variáveis adequados`);
      }
    }
    
    // Verificar nomes de funções (camelCase)
    const functionDeclarations = content.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    if (functionDeclarations) {
      let functionNamingIssues = 0;
      
      functionDeclarations.forEach(decl => {
        const functionName = decl.split(/\s+/)[1];
        
        // Verificar se não está em camelCase
        if (functionName.includes('_') && !functionName.toUpperCase() === functionName) {
          functionNamingIssues++;
        }
        
        // Verificar se é descritivo
        if (functionName.length < 3) {
          functionNamingIssues++;
        }
      });
      
      if (functionNamingIssues > 0) {
        warnings.push(`${file}: ${functionNamingIssues} possíveis problemas de nomeação de funções`);
        log(`${file}: ${functionNamingIssues} possíveis problemas de nomeação de funções`, 'warning');
      } else {
        log(`${file}: nomes de funções adequados`);
      }
    }
  }
});

// 5. VALIDAÇÃO DE COMENTÁRIOS
console.log('\n💬 5. VALIDAÇÃO DE COMENTÁRIOS');
console.log('-'.repeat(40));

jsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar comentários de linha
    const lineComments = content.match(/\/\/.*$/gm) || [];
    
    // Verificar comentários de bloco
    const blockComments = content.match(/\/\*[\s\S]*?\*\//g) || [];
    
    // Verificar JSDoc
    const jsdocComments = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
    
    const totalComments = lineComments.length + blockComments.length;
    const codeLines = content.split('\n').filter(line => 
      line.trim() && 
      !line.trim().startsWith('//') && 
      !line.trim().startsWith('/*') && 
      !line.trim().startsWith('*')
    ).length;
    
    if (totalComments === 0) {
      warnings.push(`${file}: sem comentários`);
      log(`${file}: sem comentários`, 'warning');
    } else {
      log(`${file}: ${totalComments} comentários encontrados`);
    }
    
    if (jsdocComments.length === 0 && file !== 'main.js') {
      warnings.push(`${file}: sem documentação JSDoc`);
      log(`${file}: sem documentação JSDoc`, 'warning');
    } else if (jsdocComments.length > 0) {
      log(`${file}: ${jsdocComments.length} blocos JSDoc`);
    }
    
    // Verificar comentários úteis
    const usefulComments = lineComments.filter(comment => 
      !comment.includes('TODO') && 
      !comment.includes('FIXME') &&
      !comment.includes('XXX') &&
      comment.trim().length > 10
    );
    
    if (usefulComments.length === 0 && totalComments > 0) {
      warnings.push(`${file}: comentários podem não ser úteis`);
      log(`${file}: comentários podem não ser úteis`, 'warning');
    } else {
      log(`${file}: ${usefulComments.length} comentários úteis`);
    }
  }
});

// 6. VALIDAÇÃO DE ESTRUTURA HTML
console.log('\n🌐 6. VALIDAÇÃO DE ESTRUTURA HTML');
console.log('-'.repeat(40));

const htmlFiles = [
  'index.html',
  'splash.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar indentação HTML
    const lines = content.split('\n');
    let indentationErrors = 0;
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        const leadingWhitespace = line.substring(0, line.length - line.trimStart().length);
        
        if (leadingWhitespace && leadingWhitespace.includes('\t')) {
          indentationErrors++;
        }
      }
    });
    
    if (indentationErrors > 0) {
      warnings.push(`${file}: ${indentationErrors} linhas com tabs (use espaços)`);
      log(`${file}: ${indentationErrors} linhas com tabs (use espaços)`, 'warning');
    } else {
      log(`${file}: indentação HTML adequada`);
    }
    
    // Verificar espaços entre atributos
    const attributeIssues = content.match(/\w+="[^"]*"\w+/g);
    if (attributeIssues && attributeIssues.length > 0) {
      warnings.push(`${file}: possíveis problemas com espaços em atributos`);
      log(`${file}: possíveis problemas com espaços em atributos`, 'warning');
    } else {
      log(`${file}: atributos bem formatados`);
    }
  }
});

// 7. VALIDAÇÃO DE CONSISTÊNCIA DE ARQUIVOS
console.log('\n📁 7. VALIDAÇÃO DE CONSISTÊNCIA');
console.log('-'.repeat(40));

// Verificar se todos os scripts JS têm shebang
jsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file.startsWith('scripts/') && !content.startsWith('#!/usr/bin/env node')) {
      warnings.push(`${file}: sem shebang para scripts executáveis`);
      log(`${file}: sem shebang para scripts executáveis`, 'warning');
    } else {
      log(`${file}: shebang adequado`);
    }
  }
});

// Verificar se todos os scripts têm documentação
jsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('/**') || !content.includes('*/')) {
      warnings.push(`${file}: sem documentação JSDoc no início`);
      log(`${file}: sem documentação JSDoc no início`, 'warning');
    } else {
      log(`${file}: documentação presente`);
    }
  }
});

// 8. VALIDAÇÃO DE FINAL DE ARQUIVO
console.log('\n📄 8. VALIDAÇÃO DE FINAL DE ARQUIVO');
console.log('-'.repeat(40));

[...jsFiles, ...htmlFiles].forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se termina com newline
    if (!content.endsWith('\n')) {
      warnings.push(`${file}: não termina com newline`);
      log(`${file}: não termina com newline`, 'warning');
    } else {
      log(`${file}: termina com newline`);
    }
    
    // Verificar se há múltiplos newlines no final
    const trailingNewlines = content.length - content.trimEnd().length;
    if (trailingNewlines > 1) {
      warnings.push(`${file}: ${trailingNewlines} newlines no final`);
      log(`${file}: ${trailingNewlines} newlines no final`, 'warning');
    } else {
      log(`${file}: final de arquivo adequado`);
    }
  }
});

// RESUMO FINAL
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO DO TESTE DE LINT');
console.log('='.repeat(50));

log(`Erros críticos: ${errors.length}`);
log(`Avisos: ${warnings.length}`);
log(`Arquivos validados: ${jsFiles.length + htmlFiles.length}`);

if (errors.length === 0 && warnings.length === 0) {
  log('🎉 CÓDIGO PERFEITAMENTE FORMATADO!');
  log('🔧 Estilo: Consistente');
  log('📝 Indentação: Perfeita');
  log('💬 Comentários: Adequados');
  log('📁 Estrutura: Organizada');
} else if (errors.length === 0) {
  log('✅ CÓDIGO BEM FORMATADO!');
  log('🔧 Estilo: Bom');
  log('📝 Indentação: Adequada');
  log('💬 Comentários: Presentes');
  log('📁 Estrutura: Boa');
} else {
  log('❌ CÓDIGO PRECISA DE FORMATAÇÃO');
  log('🔨 Corrija os erros de estilo');
}

if (errors.length > 0) {
  console.log('\n🚨 ERROS CRÍTICOS:');
  errors.forEach(error => log(error, 'error'));
}

if (warnings.length > 0) {
  console.log('\n⚠️ AVISOS DE ESTILO:');
  warnings.forEach(warning => log(warning, 'warning'));
}

console.log('\n📋 REGRAS DE ESTILO RECOMENDADAS:');
console.log('  • Use 2 ou 4 espaços para indentação (consistente)');
console.log('  • Use aspas simples ou duplas (consistente)');
console.log('  • Termine linhas com ponto e vírgula');
console.log('  • Use camelCase para variáveis e funções');
console.log('  • Comente código complexo');
console.log('  • Use JSDoc para documentação');
console.log('  • Mantenha linhas sem espaços no final');
console.log('  • Termine arquivos com newline');

// Exit code para CI/CD
process.exit(errors.length > 0 ? 1 : 0);
