#!/usr/bin/env node

/**
 * VALIDAÇÃO DE BUILD (simulação CI/CD)
 * Verifica assets, arquivos e processo de build
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const buildDir = path.join(projectRoot, "build");

console.log("🔍 Iniciando validação do build (simulação CI/CD)...\n");

let validationErrors = [];
let validationWarnings = [];

function validateAsset(filePath, expectedFormats = []) {
  if (!fs.existsSync(filePath)) {
    validationErrors.push(`❌ Asset não encontrado: ${filePath}`);
    return false;
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    validationErrors.push(`❌ Asset vazio: ${filePath}`);
    return false;
  }

  console.log(`✅ Asset válido: ${filePath} (${stats.size} bytes)`);
  return true;
}

function validateIcons() {
  console.log("📦 Validando ícones...");

  const icons = [
    path.join(buildDir, "app.ico"),
    path.join(buildDir, "app.icns"),
    path.join(buildDir, "logo.png")
  ];

  icons.forEach(icon => validateAsset(icon));

  // Validar formato ICO
  const icoPath = path.join(buildDir, "app.ico");
  if (fs.existsSync(icoPath)) {
    const icoBuffer = fs.readFileSync(icoPath);
    if (!icoBuffer.toString('hex').startsWith('00000100')) {
      validationErrors.push("❌ Formato ICO inválido");
    }
  }

  // Validar formato ICNS
  const icnsPath = path.join(buildDir, "app.icns");
  if (fs.existsSync(icnsPath)) {
    const icnsBuffer = fs.readFileSync(icnsPath);
    if (!icnsBuffer.toString('hex').startsWith('69636e73')) {
      validationErrors.push("❌ Formato ICNS inválido");
    }
  }

  // Validar PNG
  const pngPath = path.join(buildDir, "logo.png");
  if (fs.existsSync(pngPath)) {
    const pngBuffer = fs.readFileSync(pngPath);
    if (!pngBuffer.toString('hex').startsWith('89504e47')) {
      validationErrors.push("❌ Formato PNG inválido");
    }
  }
}

function validateMainFiles() {
  console.log("\n📄 Validando arquivos principais...");

  const mainFiles = [
    "main.js",
    "index.html",
    "splash.html",
    "package.json"
  ];

  mainFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (!validateAsset(filePath)) {
      validationErrors.push(`❌ Arquivo principal ausente: ${file}`);
    }
  });
}

function validateDependencies() {
  console.log("\n📚 Validando dependências...");

  const packageJsonPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Verificar dependências críticas
    const criticalDeps = ["electron", "electron-builder", "qrcode"];
    criticalDeps.forEach(dep => {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        validationErrors.push(`❌ Dependência crítica ausente: ${dep}`);
      }
    });

    console.log("✅ Dependências validadas");
  }
}

function validateLoadingSystem() {
  console.log("\n⏱️ Validando sistema de loading...");

  const mainJsPath = path.join(projectRoot, "main.js");
  if (fs.existsSync(mainJsPath)) {
    const mainJs = fs.readFileSync(mainJsPath, 'utf8');

    // Verificar tempo exato de 3750ms
    if (!mainJs.includes("3750")) {
      validationErrors.push("❌ Tempo de loading incorreto (deve ser 3750ms)");
    } else {
      console.log("✅ Tempo de loading configurado para 3750ms");
    }

    // Verificar ordem correta (splash antes da janela principal)
    if (!mainJs.includes("splash.loadFile")) {
      validationErrors.push("❌ Splash screen não configurada");
    }

    if (!mainJs.includes("splash.destroy()")) {
      validationErrors.push("❌ Splash screen não é destruída");
    }

    console.log("✅ Sistema de loading validado");
  }
}

function validateBuildConfiguration() {
  console.log("\n⚙️ Validando configuração de build...");

  const packageJsonPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!packageJson.build) {
      validationErrors.push("❌ Configuração de build ausente");
      return;
    }

    // Validar configurações Windows
    if (!packageJson.build.win?.icon) {
      validationErrors.push("❌ Ícone Windows não configurado");
    }

    // Validar configurações Linux
    if (!packageJson.build.linux?.icon) {
      validationErrors.push("❌ Ícone Linux não configurado");
    }

    // Validar configurações macOS
    if (!packageJson.build.mac?.icon) {
      validationErrors.push("❌ Ícone macOS não configurado");
    }

    // Validar NSIS
    if (!packageJson.build.nsis) {
      validationErrors.push("❌ Configuração NSIS ausente");
    }

    console.log("✅ Configuração de build validada");
  }
}

function testBuildProcess() {
  console.log("\n🔨 Testando processo de build...");

  const buildScript = path.join(projectRoot, "scripts", "run-electron-builder.js");
  if (!fs.existsSync(buildScript)) {
    validationErrors.push("❌ Script de build ausente");
    return;
  }

  // Testar geração de ICO
  const icoScript = path.join(projectRoot, "scripts", "make-ico.js");
  if (fs.existsSync(icoScript)) {
    const result = spawnSync("node", [icoScript], {
      cwd: projectRoot,
      stdio: "pipe",
      timeout: 30000
    });

    if (result.error) {
      validationErrors.push(`❌ Erro ao gerar ICO: ${result.error.message}`);
    } else if (result.status !== 0) {
      validationErrors.push("❌ Falha na geração do ICO");
    } else {
      console.log("✅ Geração de ICO funcional");
    }
  }
}

function validatePermissions() {
  console.log("\n🔐 Validando permissões...");

  const criticalFiles = [
    "main.js",
    "scripts/run-electron-builder.js",
    "scripts/make-ico.js"
  ];

  criticalFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
        console.log(`✅ Permissões OK: ${file}`);
      } catch (error) {
        validationErrors.push(`❌ Permissões inválidas: ${file}`);
      }
    }
  });
}

function runValidation() {
  validateIcons();
  validateMainFiles();
  validateDependencies();
  validateLoadingSystem();
  validateBuildConfiguration();
  testBuildProcess();
  validatePermissions();

  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMO DA VALIDAÇÃO");
  console.log("=".repeat(50));

  if (validationErrors.length > 0) {
    console.log(`\n❌ ERROS (${validationErrors.length}):`);
    validationErrors.forEach(error => console.log(`  ${error}`));
  }

  if (validationWarnings.length > 0) {
    console.log(`\n⚠️ AVISOS (${validationWarnings.length}):`);
    validationWarnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (validationErrors.length === 0) {
    console.log("\n🎉 VALIDAÇÃO APROVADA! Projeto pronto para build.");
    process.exit(0);
  } else {
    console.log(`\n💥 VALIDAÇÃO FALHOU! Corrija ${validationErrors.length} erro(s) antes do build.`);
    process.exit(1);
  }
}

runValidation();
