'use strict';

const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

function getAppIcon() {
  if (process.platform === "win32") {
    return path.join(__dirname, "build", "app.ico");
  }
  if (process.platform === "linux") {
    return path.join(__dirname, "build", "icon.png");
  }
  if (process.platform === "darwin") {
    return path.join(__dirname, "build", "app.icns");
  }
  return path.join(__dirname, "build", "app.ico");
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
  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdatesAndNotify().catch((error) => {
    console.error("Auto-update failed:", error);
  });
}

app.whenReady().then(() => {

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
