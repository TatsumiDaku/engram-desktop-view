// electron/main.ts
import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, dialog, shell, net } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import log from "electron-log";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
log.transports.file.level = "info";
log.transports.console.level = "debug";
log.info("Application starting...");
process.on("uncaughtException", (error) => {
  log.error("Uncaught exception:", error);
  dialog.showErrorBox("Error", `An unexpected error occurred: ${error.message}`);
  app.exit(1);
});
process.on("unhandledRejection", (reason) => {
  log.error("Unhandled rejection:", reason);
});
var isAppQuitting = false;
var mainWindow = null;
var tray = null;
var isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
function createWindow() {
  log.info("Creating main window...");
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "EngramDesktopView",
    backgroundColor: "#1a1a2e",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  if (isDev) {
    log.info("Loading development server...");
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    log.info("Loading production build...");
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    log.info("Window ready to show");
    mainWindow?.show();
  });
  mainWindow.on("close", (event) => {
    if (!isAppQuitting) {
      event.preventDefault();
      mainWindow?.hide();
      log.info("Window hidden to tray");
    }
  });
  mainWindow.on("closed", () => {
    log.info("Window closed");
    mainWindow = null;
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  log.info("Main window created successfully");
}
function createTray() {
  log.info("Creating system tray...");
  const iconDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFpSURBVDiNpZM9SgNBGIbfmb1EQiKJjYWNhY2FjYWFhYWFhY2FhY2FhY2FhY2FhYWFhYWFhY2FjYWFhY2FjYWNhYhCQJIgcxEXy57LsYHYvhBA4MDMM7M7Oe+9tqJQoKqq8lrrB0opC5gH9oEt4Ax4Ah6BG+AKuAOu6n1xKWWl1gO01gpYAS6ADeAE2AS2gVPgFLgEroEbYBtY0PWi1toCbYANYBM4BE6BM+ACuAI2geK/oLW+BDa1LrTWq8ASUAd2gSPgGDgDLoFN4EJrbYBtwDawDxwBJ8AZcAFcAJuqagHoh3xXgU1gHzgEjoBT4BQ4Bc5UVQFQB6qBHWBf9ZwCp8A5cK5ECqh9H6iqegBYA3aV2AAugEtgFdiU5Ceqqk6AbWAT2JUYj4AT4BRYA4qqqhPJMw6sABvAjmQ5Bk6AU2ANGOVYx2qtLwELwJaya8eBY+AUWAUmnWq9APYBS8AGsC3JCTgEjoFVYMI51hNgD7AErAM7kmUfOAQOgBVg3KnWc2AXsAisATuSZR84APaAZWDcqdZLYAewCKwDO5JlH9gHdgFLwLhkOQR2AIvAGrBDhvoK/gG/EJMu3U9X8wAAAABJRU5ErkJggg==";
  const icon = nativeImage.createFromDataURL(iconDataUrl);
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show EngramDesktop",
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      }
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        isAppQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip("EngramDesktopView");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
  log.info("System tray created successfully");
}
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            mainWindow?.webContents.send("open-settings");
          }
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            isAppQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About EngramDesktopView",
          click: () => {
            dialog.showMessageBox({
              type: "info",
              title: "About EngramDesktopView",
              message: "EngramDesktopView v1.0.0",
              detail: "Desktop dashboard to monitor and explore Engram memory events."
            });
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  log.info("Application menu created");
}
var ENGRAM_BASE_URL = "http://127.0.0.1:7437";
function setupApiHandler() {
  ipcMain.handle("engram-request", async (_event, method, reqPath, body) => {
    const url = `${ENGRAM_BASE_URL}${reqPath}`;
    log.info(`[API Handler] ${method} ${url}`);
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
      const request = net.request({
        method,
        url
      });
      request.setHeader("Content-Type", "application/json");
      request.setHeader("Accept", "application/json");
      let responseData = "";
      request.on("response", (response) => {
        response.on("data", (chunk) => {
          responseData += chunk.toString();
        });
        response.on("end", () => {
          const duration = Date.now() - startTime;
          if (response.statusCode && response.statusCode >= 400) {
            log.error(`[API Handler] HTTP ${response.statusCode}: ${responseData.slice(0, 200)}`);
            reject(new Error(`HTTP ${response.statusCode}: ${responseData}`));
          } else {
            log.info(`[API Handler] Success after ${duration}ms`);
            try {
              resolve(JSON.parse(responseData));
            } catch {
              resolve(responseData);
            }
          }
        });
      });
      request.on("error", (error) => {
        log.error(`[API Handler] Request error: ${error.message}`);
        reject(error);
      });
      if (body && (method === "POST" || method === "PATCH" || method === "PUT")) {
        request.write(JSON.stringify(body));
      }
      request.end();
    });
  });
  ipcMain.handle("app-version", () => app.getVersion());
  ipcMain.on("window-minimize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.minimize();
  });
  ipcMain.on("window-maximize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });
  ipcMain.on("window-close", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });
  log.info("[API Handler] Engram API handler setup complete");
}
app.whenReady().then(() => {
  log.info("App ready");
  setupApiHandler();
  createMenu();
  createWindow();
  createTray();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("before-quit", () => {
  log.info("Application quitting...");
  isAppQuitting = true;
});
//# sourceMappingURL=main.js.map
