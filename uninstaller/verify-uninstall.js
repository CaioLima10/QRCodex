"use strict";

const fs = require("fs");
const { getPaths } = require("../installer/precheck");

function verifyUninstall(logger) {
  logger.step("Verify uninstall");
  const paths = getPaths();
  const targets = [paths.binDir, paths.configDir, paths.logsDir, paths.cacheDir];

  let ok = true;
  for (const t of targets) {
    if (fs.existsSync(t)) {
      logger.error(`Still exists: ${t}`);
      ok = false;
    }
  }

  if (ok) {
    logger.info("Uninstall verification OK");
  }
  return ok;
}

module.exports = { verifyUninstall };
