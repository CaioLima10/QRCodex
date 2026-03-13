#!/usr/bin/env node

/**
 * GERAR ARQUIVO ICO
 * Converte logo.png para app.ico multi-tamanho
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIcoImport = require("png-to-ico");
const pngToIco = typeof pngToIcoImport === "function" ? pngToIcoImport : pngToIcoImport.default;

async function main() {
  const projectRoot = path.join(__dirname, "..");
  const inputPng = path.join(projectRoot, "build", "logo.png");
  const outputIco = path.join(projectRoot, "build", "app.ico");

  if (!fs.existsSync(inputPng)) {
    console.error(`Missing input PNG: ${inputPng}`);
    process.exit(1);
  }

  const basePng = fs.readFileSync(inputPng);

  // Produce a multi-size ICO suitable for Windows/NSIS.
  if (typeof pngToIco !== "function") {
    throw new Error("png-to-ico did not export a function");
  }

  const sizes = [16, 32, 48, 64, 128, 256];
  const pngVariants = [];
  for (const size of sizes) {
    const resized = await sharp(basePng)
      .resize(size, size, { fit: "cover" })
      .png()
      .toBuffer();
    pngVariants.push(resized);
  }

  const icoBuf = await pngToIco(pngVariants);

  fs.writeFileSync(outputIco, icoBuf);
  console.log(`Wrote: ${outputIco}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

