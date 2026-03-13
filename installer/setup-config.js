"use strict";

const fs = require("fs");
const path = require("path");

function setupConfig(paths, logger, projectRoot) {
  logger.step("Create config");
  const configFile = path.join(paths.configDir, "config.json");

  if (!fs.existsSync(configFile)) {
    const config = {
      version: "1.0.0",
      projectRoot,
      theme: "dark",
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    logger.info(`Config created: ${configFile}`);
  } else {
    logger.info("Config already exists. Skipping.");
  }
}

module.exports = { setupConfig };
