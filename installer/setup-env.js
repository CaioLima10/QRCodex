"use strict";

const fs = require("fs");
const path = require("path");

function setupEnv(paths, logger) {
  logger.step("Setup environment");
  const envFile = path.join(paths.configDir, ".env");

  const envLines = [
    `HOLIVERQRCODE_HOME=${paths.baseDir}`,
    `HOLIVERQRCODE_CONFIG=${paths.configDir}`,
    `HOLIVERQRCODE_LOGS=${paths.logsDir}`,
    `HOLIVERQRCODE_CACHE=${paths.cacheDir}`
  ];

  fs.writeFileSync(envFile, envLines.join("\n"));
  logger.info(`Env file created: ${envFile}`);
}

module.exports = { setupEnv };
