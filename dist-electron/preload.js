import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  engramRequest: (method, path, body) => {
    return ipcRenderer.invoke("engram-request", method, path, body);
  },
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  maximizeWindow: () => ipcRenderer.send("window-maximize"),
  closeWindow: () => ipcRenderer.send("window-close"),
  getAppVersion: () => ipcRenderer.invoke("app-version"),
  getPlatform: () => process.platform,
  onOpenSettings: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("open-settings", handler);
    return () => {
      ipcRenderer.removeListener("open-settings", handler);
    };
  }
});
console.log("[Preload] Context bridge exposed successfully");
