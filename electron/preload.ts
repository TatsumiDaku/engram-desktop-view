import { contextBridge, ipcRenderer } from "electron";

// Type definitions for the exposed API
export interface UpdateStatus {
	status: "checking-for-update" | "update-available" | "update-not-available" | "download-progress" | "update-downloaded" | "error";
	version?: string;
	percent?: number;
	bytesPerSecond?: number;
	total?: number;
	transferred?: number;
	message?: string;
}

export interface ElectronAPI {
	engramRequest: (method: string, path: string, body?: object) => Promise<unknown>;
	minimizeWindow: () => void;
	maximizeWindow: () => void;
	closeWindow: () => void;
	getAppVersion: () => Promise<string>;
	getPlatform: () => string;
	onOpenSettings: (callback: () => void) => () => void;
	// Auto-update API
	checkForUpdates: () => Promise<{ success: boolean; updateInfo?: unknown; message?: string }>;
	downloadUpdate: () => Promise<{ success: boolean; message?: string }>;
	quitAndInstall: () => void;
	onUpdateStatus: (callback: (status: UpdateStatus) => void) => () => void;
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

	// Auto-update API
	checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
	downloadUpdate: () => ipcRenderer.invoke("download-update"),
	quitAndInstall: () => ipcRenderer.send("quit-and-install"),
	onUpdateStatus: (callback: (status: UpdateStatus) => void) => {
		const handler = (_event: Electron.IpcRendererEvent, status: UpdateStatus) => callback(status);
		ipcRenderer.on("update-status", handler);
		return () => {
			ipcRenderer.removeListener("update-status", handler);
		};
	},
});

console.log("[Preload] Context bridge exposed successfully");
