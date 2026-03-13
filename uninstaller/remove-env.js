"use strict";

const fs = require("fs");
const path = require("path");
const { getPaths } = require("../installer/precheck");

function removeEnv(logger) {
  logger.step("Remove env");
  const paths = getPaths();
  const envFile = path.join(paths.configDir, ".env");
  if (fs.existsSync(envFile)) {
    fs.rmSync(envFile, { force: true });
    logger.info(`Removed: ${envFile}`);
  }
}

module.exports = { removeEnv };
