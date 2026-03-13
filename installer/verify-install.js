"use strict";

const fs = require("fs");
const path = require("path");
const { getPaths } = require("./precheck");

function verifyInstall(logger) {
  logger.step("Verify install");
  const paths = getPaths();

  const checks = [
    paths.configDir,
    paths.logsDir,
    paths.cacheDir,
    path.join(paths.configDir, "config.json"),
    path.join(paths.configDir, ".env"),
    path.join(paths.binDir, "holiverqrcode.cmd"),
    path.join(paths.binDir, "holiverqrcode")
  ];

  let ok = true;
  for (const p of checks) {
    if (!fs.existsSync(p)) {
      logger.error(`Missing: ${p}`);
      ok = false;
    }
  }

  if (ok) {
    logger.info("Install verification OK");
  }
  return ok;
}

module.exports = { verifyInstall };
