#!/usr/bin/env node

const { app, BrowserWindow } = require('electron');
const ipcMain = require('electron').ipcMain;
const { version } = require('./package.json');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const GITHUB_REPO = 'CaioLima10/QRCodex';
const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas em ms
const UPDATE_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

let updateWindow = null;
let updateInfo = null;

// Função para verificar atualizações
function checkForUpdates() {
  console.log('🔍 Checking for updates...');

  https.get(UPDATE_URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const releaseInfo = JSON.parse(data);
        const latestVersion = releaseInfo.tag_name.replace('v', '');

        console.log(`📦 Current version: ${version}`);
        console.log(`🆕 Latest version: ${latestVersion}`);

        if (latestVersion !== version) {
          console.log('✅ Update available!');
          showUpdateNotification(releaseInfo);
        } else {
          console.log('✅ Up to date!');
        }
      } catch (error) {
        console.error('❌ Error checking updates:', error);
      }
    });
  }).on('error', (error) => {
    console.error('❌ Error checking updates:', error);
  });
}

// Função para mostrar notificação de atualização
function showUpdateNotification(releaseInfo) {
  updateInfo = releaseInfo;

  // Enviar notificação para o renderer process
  if (BrowserWindow.getAllWindows().length > 0) {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    mainWindow.webContents.send('update-available', {
      version: releaseInfo.tag_name.replace('v', ''),
      releaseNotes: releaseInfo.body,
      downloadUrl: releaseInfo.html_url,
      currentVersion: version
    });
  }
}

// Função para mostrar janela de atualização
function showUpdateWindow() {
  if (updateWindow) return;

  updateWindow = new BrowserWindow({
    width: 500,
    height: 400,
    modal: true,
    parent: BrowserWindow.getAllWindows()[0],
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  updateWindow.loadFile(path.join(__dirname, 'update.html'));

  updateWindow.webContents.on('did-finish-load', () => {
    updateWindow.webContents.send('update-info', updateInfo);
  });

  updateWindow.on('closed', () => {
    updateWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('show-update-window', () => {
  showUpdateWindow();
});

ipcMain.handle('download-update', (event, downloadUrl) => {
  const { shell } = require('electron');
  shell.openExternal(downloadUrl);
});

// Iniciar verificação periódica
function startUpdateChecker() {
  console.log('🔄 Starting update checker...');

  // Verificar imediatamente
  setTimeout(checkForUpdates, 5000);

  // Verificar periodicamente
  setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);
}

// Exportar funções
module.exports = {
  checkForUpdates,
  showUpdateNotification,
  showUpdateWindow,
  startUpdateChecker
};
