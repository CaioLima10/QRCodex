"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

function getBaseDir() {
  if (process.env.HOLIVERQRCODE_HOME) {
    return process.env.HOLIVERQRCODE_HOME;
  }

  if (process.platform === "win32") {
    const base = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
    return path.join(base, "HoliverQRCode");
  }

  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "HoliverQRCode");
  }

  return path.join(os.homedir(), ".config", "holiverqrcode");
}

function getPaths() {
  const baseDir = getBaseDir();
  return {
    baseDir,
    configDir: path.join(baseDir, "config"),
    logsDir: path.join(baseDir, "logs"),
    cacheDir: path.join(baseDir, "cache"),
    binDir: path.join(baseDir, "bin")
  };
}

function checkNodeVersion(minMajor) {
  const major = Number(String(process.versions.node || "0").split(".")[0]);
  return Number.isFinite(major) && major >= minMajor;
}

function checkWriteAccess(dir) {
  try {
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function runPrecheck(logger) {
  logger.step("Pre-install checks");

  const minNode = 18;
  if (!checkNodeVersion(minNode)) {
    throw new Error(`Node >= ${minNode} required. Found ${process.versions.node}`);
  }
  logger.info(`Node OK: ${process.versions.node}`);

  const paths = getPaths();
  const parentDir = path.dirname(paths.baseDir);
  if (!checkWriteAccess(parentDir)) {
    throw new Error(`No write permission in: ${parentDir}`);
  }
  logger.info(`Write access OK: ${parentDir}`);

  return paths;
}

module.exports = { getPaths, runPrecheck };
