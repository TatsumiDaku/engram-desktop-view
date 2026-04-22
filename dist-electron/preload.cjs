"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// electron/preload.ts
var preload_exports = {};
module.exports = __toCommonJS(preload_exports);
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  engramRequest: (method, path, body) => {
    return import_electron.ipcRenderer.invoke("engram-request", method, path, body);
  },
  minimizeWindow: () => import_electron.ipcRenderer.send("window-minimize"),
  maximizeWindow: () => import_electron.ipcRenderer.send("window-maximize"),
  closeWindow: () => import_electron.ipcRenderer.send("window-close"),
  getAppVersion: () => import_electron.ipcRenderer.invoke("app-version"),
  getPlatform: () => process.platform,
  onOpenSettings: (callback) => {
    const handler = () => callback();
    import_electron.ipcRenderer.on("open-settings", handler);
    return () => {
      import_electron.ipcRenderer.removeListener("open-settings", handler);
    };
  },
  // Auto-update API
  checkForUpdates: () => import_electron.ipcRenderer.invoke("check-for-updates"),
  downloadUpdate: () => import_electron.ipcRenderer.invoke("download-update"),
  quitAndInstall: () => import_electron.ipcRenderer.send("quit-and-install"),
  onUpdateStatus: (callback) => {
    const handler = (_event, status) => callback(status);
    import_electron.ipcRenderer.on("update-status", handler);
    return () => {
      import_electron.ipcRenderer.removeListener("update-status", handler);
    };
  }
});
console.log("[Preload] Context bridge exposed successfully");
//# sourceMappingURL=preload.cjs.map
