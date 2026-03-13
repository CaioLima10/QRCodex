'use strict';

const { app, BrowserWindow } = require("electron");
const path = require("path");

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
    icon: path.join(__dirname, "build/app.ico")
  });

  splash.loadFile("splash.html");


  // ⏰ esperar loading terminar - 3750ms (3.75 segundos)
  setTimeout(() => {

    mainWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      icon: path.join(__dirname, "build/app.ico"),
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

}


app.whenReady().then(() => {

  createWindow();

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
