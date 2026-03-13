"use strict";

const fs = require("fs");
const { getPaths } = require("../installer/precheck");

function cleanupCache(logger) {
  logger.step("Cleanup cache/logs");
  const paths = getPaths();
  fs.rmSync(paths.cacheDir, { recursive: true, force: true });
  fs.rmSync(paths.logsDir, { recursive: true, force: true });
}

module.exports = { cleanupCache };
