import { contextBridge, ipcRenderer } from "electron";

// Type definitions for the exposed API
export interface ElectronAPI {
	engramRequest: (method: string, path: string, body?: object) => Promise<unknown>;
	minimizeWindow: () => void;
	maximizeWindow: () => void;
	closeWindow: () => void;
	getAppVersion: () => Promise<string>;
	getPlatform: () => string;
	onOpenSettings: (callback: () => void) => () => void;
}

contextBridge.exposeInMainWorld("electronAPI", {
	engramRequest: (method: string, path: string, body?: object) => {
		return ipcRenderer.invoke("engram-request", method, path, body);
	},

	minimizeWindow: () => ipcRenderer.send("window-minimize"),
	maximizeWindow: () => ipcRenderer.send("window-maximize"),
	closeWindow: () => ipcRenderer.send("window-close"),

	getAppVersion: () => ipcRenderer.invoke("app-version"),
	getPlatform: () => process.platform,

	onOpenSettings: (callback: () => void) => {
		const handler = () => callback();
		ipcRenderer.on("open-settings", handler);
		return () => {
			ipcRenderer.removeListener("open-settings", handler);
		};
	},
});

console.log("[Preload] Context bridge exposed successfully");
