#!/usr/bin/env node

/**
 * VALIDAÇÃO FINAL INTEGRADA
 * Executa todos os testes em sequência para garantia 100%
 */

const { execSync } = require('child_process');

console.log('🎯 VALIDAÇÃO FINAL INTEGRADA - HoliverQRCode');
console.log('=' .repeat(60));

const tests = [
  {
    name: 'Teste Profissional',
    command: 'npm run test-professional',
    critical: true
  },
  {
    name: 'Teste de Proteção Contra Erro Humano',
    command: 'npm run test-human-error',
    critical: true
  },
  {
    name: 'Validação de Build',
    command: 'npm run validate',
    critical: true
  },
  {
    name: 'Validação Multiplataforma',
    command: 'npm run validate-platform',
    critical: true
  },
  {
    name: 'Teste Completo',
    command: 'npm run test-all',
    critical: true
  }
];

let passedTests = 0;
let failedTests = 0;

tests.forEach((test, index) => {
  console.log(`\n📋 ${index + 1}. ${test.name}`);
  console.log('-'.repeat(40));
  
  try {
    console.log(`⚡ Executando: ${test.command}`);
    const result = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 60000 // 60 segundos timeout
    });
    
    console.log('✅ Teste passou com sucesso!');
    passedTests++;
    
  } catch (error) {
    console.error(`❌ Teste falhou: ${error.message}`);
    
    if (test.critical) {
      console.error('🚨 ESTE É UM TESTE CRÍTICO!');
      failedTests++;
    } else {
      console.warn('⚠️  Teste não-crítico falhou, continuando...');
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DA VALIDAÇÃO FINAL');
console.log('='.repeat(60));

console.log(`\n✅ Testes passados: ${passedTests}/${tests.length}`);
console.log(`❌ Testes falhados: ${failedTests}/${tests.length}`);
console.log(`📈 Taxa de sucesso: ${Math.round((passedTests / tests.length) * 100)}%\n`);

if (failedTests === 0) {
  console.log('🎉 PROJETO 100% APROVADO PARA GITHUB ACTIONS!');
  console.log('🚀 Todos os testes críticos passaram com sucesso.');
  console.log('🛡️  Proteção contra erro humano: ATIVA');
  console.log('📦 Build multiplataforma: GARANTIDO');
  console.log('🔐 Segurança: VALIDADA');
  console.log('\n✨ O projeto está pronto para deploy em produção!');
  console.log('   • Faça push para o GitHub');
  console.log('   • Os workflows serão executados automaticamente');
  console.log('   • Builds Windows/Linux/macOS serão gerados');
  console.log('   • Artefatos estarão disponíveis para download');
  
} else {
  console.log('❌ PROJETO PRECISA DE CORREÇÕES!');
  console.log('🔨 Corrija os testes falhados antes do deploy.');
  console.log('\n📋 Ações recomendadas:');
  console.log('   • Execute os testes individualmente para detalhes');
  console.log('   • Corrija os erros identificados');
  console.log('   • Execute esta validação final novamente');
}

console.log('\n🔗 Comandos úteis:');
console.log('  npm run test-professional  # Teste completo 137 validações');
console.log('  npm run test-human-error   # Proteção contra erro humano');
console.log('  npm run validate          # Validação de build');
console.log('  npm run validate-platform # Validação multiplataforma');
console.log('  npm run test-all          # Teste completo do sistema');

process.exit(failedTests > 0 ? 1 : 0);
