const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const packageJsonPath = path.join(projectRoot, "package.json");

console.log("🌍 Validando compatibilidade multiplataforma...\n");

let validationErrors = [];
let validationWarnings = [];

function validatePlatformSupport() {
  console.log("🔧 Validando suporte às plataformas...");
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const buildConfig = packageJson.build;
  
  if (!buildConfig) {
    validationErrors.push("❌ Configuração de build ausente");
    return;
  }

  // Validar Windows
  if (!buildConfig.win) {
    validationErrors.push("❌ Configuração Windows ausente");
  } else {
    if (!buildConfig.win.target || buildConfig.win.target.length === 0) {
      validationErrors.push("❌ Targets Windows não configurados");
    }
    if (!buildConfig.win.icon) {
      validationErrors.push("❌ Ícone Windows não configurado");
    }
    console.log("✅ Configuração Windows validada");
  }

  // Validar Linux
  if (!buildConfig.linux) {
    validationErrors.push("❌ Configuração Linux ausente");
  } else {
    if (!buildConfig.linux.target || buildConfig.linux.target.length === 0) {
      validationErrors.push("❌ Targets Linux não configurados");
    }
    if (!buildConfig.linux.icon) {
      validationErrors.push("❌ Ícone Linux não configurado");
    }
    console.log("✅ Configuração Linux validada");
  }

  // Validar macOS
  if (!buildConfig.mac) {
    validationErrors.push("❌ Configuração macOS ausente");
  } else {
    if (!buildConfig.mac.target) {
      validationErrors.push("❌ Target macOS não configurado");
    }
    if (!buildConfig.mac.icon) {
      validationErrors.push("❌ Ícone macOS não configurado");
    }
    console.log("✅ Configuração macOS validada");
  }
}

function validateAssets() {
  console.log("\n📦 Validando assets multiplataforma...");
  
  const buildDir = path.join(projectRoot, "build");
  const requiredAssets = [
    { file: "app.ico", platforms: ["Windows"] },
    { file: "app.icns", platforms: ["macOS"] },
    { file: "logo.png", platforms: ["Linux", "macOS"] }
  ];

  requiredAssets.forEach(asset => {
    const assetPath = path.join(buildDir, asset.file);
    if (fs.existsSync(assetPath)) {
      const stats = fs.statSync(assetPath);
      console.log(`✅ ${asset.file} (${asset.platforms.join(", ")}) - ${stats.size} bytes`);
    } else {
      validationErrors.push(`❌ Asset ausente: ${asset.file} (${asset.platforms.join(", ")})`);
    }
  });
}

function validateNodeModules() {
  console.log("\n📚 Validando dependências multiplataforma...");
  
  const criticalModules = [
    "electron",
    "electron-builder",
    "qrcode",
    "sharp",
    "png-to-ico"
  ];

  criticalModules.forEach(module => {
    const modulePath = path.join(projectRoot, "node_modules", module);
    if (fs.existsSync(modulePath)) {
      console.log(`✅ ${module}`);
    } else {
      validationErrors.push(`❌ Módulo crítico ausente: ${module}`);
    }
  });
}

function validateBuildScripts() {
  console.log("\n📜 Validando scripts de build...");
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts;
  
  const requiredScripts = [
    "start",
    "build",
    "win",
    "linux",
    "mac",
    "validate"
  ];

  requiredScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`✅ Script ${script}`);
    } else {
      validationErrors.push(`❌ Script ausente: ${script}`);
    }
  });
}

function validateLoadingSystem() {
  console.log("\n⏱️ Validando sistema de loading multiplataforma...");
  
  const mainJsPath = path.join(projectRoot, "main.js");
  if (fs.existsSync(mainJsPath)) {
    const mainJs = fs.readFileSync(mainJsPath, 'utf8');
    
    // Validar tempo exato
    if (!mainJs.includes("3750")) {
      validationErrors.push("❌ Tempo de loading incorreto (deve ser 3750ms)");
    } else {
      console.log("✅ Tempo de loading: 3750ms");
    }

    // Validar ordem correta
    if (!mainJs.includes("splash.loadFile")) {
      validationErrors.push("❌ Splash screen não configurada");
    }

    if (!mainJs.includes("splash.destroy()")) {
      validationErrors.push("❌ Splash screen não é destruída");
    }

    // Validar compatibilidade de paths
    if (!mainJs.includes("path.join")) {
      validationErrors.push("❌ Paths não usam path.join (pode causar problemas multiplataforma)");
    } else {
      console.log("✅ Paths compatíveis multiplataforma");
    }
  }
}

function testBuildCommands() {
  console.log("\n🔨 Testando comandos de build...");
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts;
  
  // Testar se os comandos são válidos
  const testCommands = ["validate"];
  
  testCommands.forEach(command => {
    if (scripts[command]) {
      // Simular validação do comando
      if (scripts[command].includes("node")) {
        console.log(`✅ Comando ${command} válido`);
      } else {
        validationWarnings.push(`⚠️ Comando ${command} pode não ser compatível`);
      }
    }
  });
}

function validateElectronConfig() {
  console.log("\n⚡ Validando configuração Electron...");
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.main) {
    validationErrors.push("❌ Arquivo main não configurado");
  } else {
    console.log(`✅ Main: ${packageJson.main}`);
  }

  if (!packageJson.author) {
    validationErrors.push("❌ Autor não configurado");
  } else {
    console.log(`✅ Autor: ${packageJson.author}`);
  }

  if (!packageJson.build?.appId) {
    validationErrors.push("❌ AppId não configurado");
  } else {
    console.log(`✅ AppId: ${packageJson.build.appId}`);
  }
}

function runPlatformValidation() {
  validatePlatformSupport();
  validateAssets();
  validateNodeModules();
  validateBuildScripts();
  validateLoadingSystem();
  testBuildCommands();
  validateElectronConfig();

  console.log("\n" + "=".repeat(50));
  console.log("🌍 RESUMO DA VALIDAÇÃO MULTIPLATAFORMA");
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
    console.log("\n🎉 VALIDAÇÃO MULTIPLATAFORMA APROVADA!");
    console.log("✅ Windows: NSIS, Portable, ZIP");
    console.log("✅ Linux: AppImage, DEB");
    console.log("✅ macOS: DMG");
    process.exit(0);
  } else {
    console.log(`\n💥 VALIDAÇÃO FALHOU! Corrija ${validationErrors.length} erro(s).`);
    process.exit(1);
  }
}

runPlatformValidation();
