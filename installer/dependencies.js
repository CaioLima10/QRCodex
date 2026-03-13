"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function verifyNpm(logger) {
  const result = spawnSync("npm", ["--version"], { stdio: "pipe" });
  if (result.status !== 0) {
    throw new Error("npm is required but was not found.");
  }
  logger.info(`npm OK: ${String(result.stdout).trim()}`);
}

function installDependencies(projectRoot, logger, options = {}) {
  if (options.skipDeps) {
    logger.warn("Skipping dependency install (--skip-deps).");
    return { installed: false };
  }

  logger.step("Install dependencies");
  verifyNpm(logger);

  const nodeModules = path.join(projectRoot, "node_modules");
  if (fs.existsSync(nodeModules)) {
    logger.info("node_modules already exists. Skipping install.");
    return { installed: false };
  }

  const hasLock = fs.existsSync(path.join(projectRoot, "package-lock.json"));
  const args = hasLock ? ["ci"] : ["install"];
  const result = spawnSync("npm", args, { stdio: "inherit", cwd: projectRoot });
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(" ")} failed`);
  }

  return { installed: true };
}

module.exports = { installDependencies };
