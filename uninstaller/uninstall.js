"use strict";

const readline = require("readline");
const path = require("path");
const { createLogger, ensureDir } = require("../installer/logger");
const { getPaths } = require("../installer/precheck");
const { backupConfig } = require("./backup-config");
const { removeFiles } = require("./remove-files");
const { removeEnv } = require("./remove-env");
const { cleanupCache } = require("./cleanup-cache");
const { verifyUninstall } = require("./verify-uninstall");

function parseArgs() {
  const args = process.argv.slice(2);
  return { yes: args.includes("--yes") };
}

function askConfirm() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Confirm uninstall? (yes/no): ", (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

async function uninstall() {
  const opts = parseArgs();
  const paths = getPaths();
  ensureDir(paths.logsDir);
  const logFile = path.join(paths.logsDir, "uninstall.log");
  const logger = createLogger(logFile);

  logger.step("Start uninstall");

  if (!opts.yes) {
    const confirmed = await askConfirm();
    if (!confirmed) {
      logger.warn("Uninstall canceled by user.");
      process.exit(0);
    }
  }

  backupConfig(logger);
  removeEnv(logger);
  removeFiles(logger);
  cleanupCache(logger);

  if (!verifyUninstall(logger)) {
    process.exit(1);
  }

  logger.step("Uninstall complete");
}

uninstall();
