#!/usr/bin/env node

/**
 * EXECUTAR ELECTRON BUILDER
 * Wrapper para garantir ambiente correto no Windows
 */

const path = require("path");
const { spawnSync } = require("child_process");

// Only patch ComSpec/PATH on Windows (CI/local Windows can have broken env).
if (process.platform === "win32") {
  const systemRoot = process.env.SystemRoot || "C:\\Windows";
  const system32 = path.join(systemRoot, "System32");
  const cmdExe = path.join(system32, "cmd.exe");
  process.env.ComSpec = cmdExe;
  const existingPath = process.env.Path || process.env.PATH || "";
  process.env.Path = `${system32};${existingPath}`;
  process.env.PATH = process.env.Path;
}

const projectRoot = path.join(__dirname, "..");
const electronBuilderCli = path.join(projectRoot, "node_modules", "electron-builder", "cli.js");

const result = spawnSync(process.execPath, [electronBuilderCli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(result.error);
}

process.exit(typeof result.status === "number" ? result.status : 1);

