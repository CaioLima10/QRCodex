"use strict";

const fs = require("fs");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function createLogger(logFile) {
  const write = (level, msg) => {
    const line = `[${level}] ${msg}`;
    if (level === "ERROR") {
      console.error(line);
    } else if (level === "WARN") {
      console.log(line);
    } else {
      console.log(line);
    }
    if (logFile) {
      fs.appendFileSync(logFile, `${line}\n`);
    }
  };

  return {
    step(msg) {
      write("STEP", msg);
    },
    info(msg) {
      write("INFO", msg);
    },
    warn(msg) {
      write("WARN", msg);
    },
    error(msg) {
      write("ERROR", msg);
    }
  };
}

module.exports = { ensureDir, createLogger };
