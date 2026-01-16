const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const {
  ensureFolders,
  saveCsv,
  getCampaignData,
  getLinkData,
  deleteCampaignCsv,
  deleteLinkCsv
} = require("./back/local-backend.js");

const isDev = !app.isPackaged;
const dataRoot = isDev ? path.join(__dirname, "back") : app.getPath("userData");

let mainWindow;

function registerIpcHandlers() {
  ipcMain.handle("csv:upload", async (_event, payload) => {
    try {
      const buffer = Buffer.from(payload.fileData);
      return await saveCsv({
        dataRoot,
        idCampaign: payload.idCampaign,
        fileBuffer: buffer,
        isLink: false
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("csv:uploadLink", async (_event, payload) => {
    try {
      const buffer = Buffer.from(payload.fileData);
      return await saveCsv({
        dataRoot,
        idCampaign: payload.idCampaign,
        fileBuffer: buffer,
        isLink: true
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("csv:data", async (_event, payload) => {
    try {
      return await getCampaignData({
        dataRoot,
        idCampaign: payload.idCampaign
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("csv:links", async (_event, payload) => {
    try {
      return await getLinkData({
        dataRoot,
        idCampaign: payload.idCampaign
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("csv:deleteCampaign", async (_event, payload) => {
    try {
      return await deleteCampaignCsv({
        dataRoot,
        idCampaign: payload.idCampaign
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("csv:deleteLink", async (_event, payload) => {
    try {
      return await deleteLinkCsv({
        dataRoot,
        idCampaign: payload.idCampaign
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    height: screen.getPrimaryDisplay().workAreaSize.height,
    width: screen.getPrimaryDisplay().workAreaSize.width,
    icon: path.join(__dirname, "logo_app.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs")
    },
    autoHideMenuBar: true
  });

    if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "front/dist/index.html"));
  }

}

app.whenReady().then(() => {
  ensureFolders(dataRoot);
  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
