"use strict";

const fs = require("fs");
const path = require("path");
const { createLogger, ensureDir } = require("./logger");
const { runPrecheck, getPaths } = require("./precheck");
const { installDependencies } = require("./dependencies");
const { setupConfig } = require("./setup-config");
const { setupEnv } = require("./setup-env");
const { verifyInstall } = require("./verify-install");

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    skipDeps: args.includes("--skip-deps"),
    dryRun: args.includes("--dry-run")
  };
}

function writeCliLaunchers(paths, projectRoot, logger) {
  const cmdPath = path.join(paths.binDir, "holiverqrcode.cmd");
  const shPath = path.join(paths.binDir, "holiverqrcode");

  const cmdLines = [
    "@echo off",
    `set HOLIVERQRCODE_HOME=${paths.baseDir}`,
    `set HOLIVERQRCODE_CONFIG=${paths.configDir}`,
    `set HOLIVERQRCODE_LOGS=${paths.logsDir}`,
    `set HOLIVERQRCODE_CACHE=${paths.cacheDir}`,
    `set APP_ROOT=${projectRoot}`,
    "cd /d \"%APP_ROOT%\"",
    "\"%APP_ROOT%\\node_modules\\.bin\\electron.cmd\" \"%APP_ROOT%\""
  ];
  fs.writeFileSync(cmdPath, cmdLines.join("\r\n") + "\r\n");

  const shLines = [
    "#!/bin/sh",
    `export HOLIVERQRCODE_HOME="${paths.baseDir}"`,
    `export HOLIVERQRCODE_CONFIG="${paths.configDir}"`,
    `export HOLIVERQRCODE_LOGS="${paths.logsDir}"`,
    `export HOLIVERQRCODE_CACHE="${paths.cacheDir}"`,
    `APP_ROOT="${projectRoot}"`,
    "cd \"$APP_ROOT\" || exit 1",
    "\"$APP_ROOT/node_modules/.bin/electron\" \"$APP_ROOT\""
  ];
  fs.writeFileSync(shPath, shLines.join("\n") + "\n");
  if (process.platform !== "win32") {
    fs.chmodSync(shPath, 0o755);
  }

  logger.info("CLI launchers created.");
}

async function install() {
  const opts = parseArgs();
  const projectRoot = path.join(__dirname, "..");
  const paths = getPaths();
  const logger = createLogger();
  const createdPaths = [];
  const createdFiles = [];
  let installedNodeModules = false;

  try {
    logger.step("Start install");
    const resolvedPaths = runPrecheck(logger);

    if (!opts.dryRun) {
      for (const dir of [
        resolvedPaths.baseDir,
        resolvedPaths.configDir,
        resolvedPaths.logsDir,
        resolvedPaths.cacheDir,
        resolvedPaths.binDir
      ]) {
        if (!fs.existsSync(dir)) {
          ensureDir(dir);
          createdPaths.push(dir);
        }
      }
    } else {
      logger.warn("Dry-run enabled. Skipping file operations.");
    }

    let fileLogger = logger;
    if (!opts.dryRun) {
      const logFile = path.join(resolvedPaths.logsDir, "install.log");
      fileLogger = createLogger(logFile);
      fileLogger.info("File logging enabled.");
    }

    if (!opts.dryRun) {
      const depResult = installDependencies(projectRoot, fileLogger, opts);
      installedNodeModules = depResult.installed;

      setupConfig(resolvedPaths, fileLogger, projectRoot);
      setupEnv(resolvedPaths, fileLogger);
      writeCliLaunchers(resolvedPaths, projectRoot, fileLogger);
      createdFiles.push(
        path.join(resolvedPaths.configDir, "config.json"),
        path.join(resolvedPaths.configDir, ".env"),
        path.join(resolvedPaths.binDir, "holiverqrcode.cmd"),
        path.join(resolvedPaths.binDir, "holiverqrcode")
      );
    }

    if (!opts.dryRun && !verifyInstall(fileLogger)) {
      throw new Error("Install verification failed.");
    }

    fileLogger.step("Install complete");
  } catch (err) {
    const failLogger = createLogger(path.join(paths.logsDir, "install.log"));
    try {
      failLogger.error(err && err.message ? err.message : String(err));
      failLogger.warn("Rolling back changes...");
    } catch {
      console.error(err && err.message ? err.message : String(err));
      console.error("Rolling back changes...");
    }

    for (const p of createdFiles.reverse()) {
      try {
        fs.rmSync(p, { force: true });
      } catch {}
    }
    for (const p of createdPaths.reverse()) {
      try {
        fs.rmSync(p, { recursive: true, force: true });
      } catch {}
    }
    if (installedNodeModules) {
      try {
        fs.rmSync(path.join(projectRoot, "node_modules"), { recursive: true, force: true });
      } catch {}
    }

    process.exit(1);
  }
}

install();
