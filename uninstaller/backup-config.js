"use strict";

const fs = require("fs");
const path = require("path");
const { getPaths } = require("../installer/precheck");

function backupConfig(logger) {
  logger.step("Backup config");
  const paths = getPaths();

  if (!fs.existsSync(paths.configDir)) {
    logger.warn("Config dir not found. Skipping backup.");
    return null;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(paths.baseDir, "backup", `config-${stamp}`);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.cpSync(paths.configDir, backupDir, { recursive: true });
  logger.info(`Backup created: ${backupDir}`);
  return backupDir;
}

module.exports = { backupConfig };
