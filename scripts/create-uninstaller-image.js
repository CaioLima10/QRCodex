const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function createUninstallerImage() {
  const projectRoot = path.join(__dirname, "..");
  const logoPath = path.join(projectRoot, "build", "logo.png");
  const outputPath = path.join(projectRoot, "scripts", "uninstaller-image.png");

  if (!fs.existsSync(logoPath)) {
    console.error("❌ Logo original não encontrado:", logoPath);
    process.exit(1);
  }

  try {
    // Criar imagem para o desinstalador (300x200 com fundo profissional)
    await sharp(logoPath)
      .resize(150, 150, { fit: "contain", background: { r: 9, g: 10, b: 12 } })
      .extend({
        top: 25,
        bottom: 25,
        left: 75,
        right: 75,
        background: { r: 9, g: 10, b: 12 }
      })
      .png()
      .toFile(outputPath);

    console.log("✅ Imagem do desinstalador criada:", outputPath);
  } catch (error) {
    console.error("❌ Erro ao criar imagem do desinstalador:", error);
    process.exit(1);
  }
}

createUninstallerImage();
