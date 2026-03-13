"use strict";

const fs = require("fs");
const { getPaths } = require("../installer/precheck");

function removeFiles(logger) {
  logger.step("Remove installed files");
  const paths = getPaths();

  const targets = [paths.binDir, paths.configDir, paths.logsDir, paths.cacheDir];
  for (const t of targets) {
    fs.rmSync(t, { recursive: true, force: true });
    logger.info(`Removed: ${t}`);
  }
}

module.exports = { removeFiles };
