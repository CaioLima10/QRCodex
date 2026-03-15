'use strict';

const { app, BrowserWindow, session, systemPreferences } = require("electron");
const path = require("path");
const { version } = require('./package.json');

// Verificar flag --version
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(`HoliverQRCode v${version}`);
  process.exit(0);
}

const ICON_PATHS = {
  win32: "build/app.ico",
  linux: "build/icon.png",
  darwin: "build/app.icns",
  default: "build/app.ico"
};

function getAppIcon() {
  const rel = ICON_PATHS[process.platform] || ICON_PATHS.default;
  return path.join(__dirname, rel);
}

let mainWindow;
let splash;

function createWindow() {

  // Splash primeiro
  splash = new BrowserWindow({
    width: 520,
    height: 320,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    hasShadow: true,
    autoHideMenuBar: true,
    backgroundColor: "#090A0C",
    icon: getAppIcon()
  });

  splash.loadFile("splash.html");

  // ⏰ Iniciar timer SOMENTE quando splash estiver visível
  splash.once("ready-to-show", () => {

    // Agora sim, iniciar contagem de 3750ms
    setTimeout(() => {

      mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        icon: getAppIcon(),
        autoHideMenuBar: true,
        show: false
      });

      mainWindow.maximize();

      mainWindow.loadFile("index.html");

      mainWindow.once("ready-to-show", () => {
        splash.destroy();
        mainWindow.show();
      });

    }, 3750); // 3.75 segundos (exatamente 3750ms)
  });

}

function setupAutoUpdater() {
  if (!app.isPackaged) return;
  try {
    const { autoUpdater } = require("electron-updater");
    autoUpdater.autoDownload = true;
    autoUpdater.checkForUpdatesAndNotify().catch((error) => {
      console.error("Auto-update failed:", error);
    });
  } catch (error) {
    console.error("Auto-update unavailable:", error);
  }
}

function setupMediaPermissions() {
  const ses = session.defaultSession;
  if (!ses) return;

  ses.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  ses.webRequest.onBeforeSendHeaders(
    {
      urls: ["https://*.googleapis.com/*", "https://www.google.com/*"]
    },
    (details, callback) => {
      details.requestHeaders["User-Agent"] =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );

  ses.setPermissionRequestHandler((_, permission, callback) => {
    if (permission === "microphone" || permission === "media" || permission === "audioCapture") {
      callback(true);
      return;
    }
    callback(false);
  });

  if (typeof ses.setPermissionCheckHandler === "function") {
    ses.setPermissionCheckHandler((_wc, permission) => {
      if (permission === "microphone" || permission === "media" || permission === "audioCapture") {
        return true;
      }
      return false;
    });
  }
}

app.whenReady().then(() => {

  setupMediaPermissions();
  if (process.platform === "darwin" && typeof systemPreferences.askForMediaAccess === "function") {
    systemPreferences.askForMediaAccess("microphone");
  }
  createWindow();
  setupAutoUpdater();

  app.on("browser-window-created", (_event, window) => {
    const iconPath = getAppIcon();
    if (typeof window.setIcon === "function") {
      window.setIcon(iconPath);
    }
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

});


app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
