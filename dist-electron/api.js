import { ipcMain, net } from "electron";
import log from "electron-log";
// Engram backend URL
const ENGRAM_BASE_URL = "http://127.0.0.1:7437";
// Timeout for API requests (30 seconds)
const REQUEST_TIMEOUT = 30000;
export function setupApiHandler() {
    log.info("[API Handler] Setting up Engram API handler");
    // Handle API requests from renderer
    ipcMain.handle("engram-request", async (event, method, path, body) => {
        const url = `${ENGRAM_BASE_URL}${path}`;
        log.info(`[API Handler] ${method} ${url}`);
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const request = net.request({
                method,
                url,
            });
            // Set headers
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Accept", "application/json");
            let responseData = "";
            let responseEnded = false;
            // Timeout handler
            const timeoutId = setTimeout(() => {
                if (!responseEnded) {
                    request.abort();
                    log.error(`[API Handler] Request timeout: ${method} ${url}`);
                    reject(new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`));
                }
            }, REQUEST_TIMEOUT);
            // Collect response data
            request.on("response", (response) => {
                log.info(`[API Handler] Response status: ${response.statusCode}`);
                response.on("data", (chunk) => {
                    responseData += chunk.toString();
                });
                response.on("end", () => {
                    clearTimeout(timeoutId);
                    responseEnded = true;
                    const duration = Date.now() - startTime;
                    if (response.statusCode && response.statusCode >= 400) {
                        log.error(`[API Handler] HTTP ${response.statusCode} after ${duration}ms: ${responseData.slice(0, 200)}`);
                        reject(new Error(`HTTP ${response.statusCode}: ${responseData}`));
                    }
                    else {
                        log.info(`[API Handler] Success after ${duration}ms, ${responseData.length} bytes`);
                        // Try to parse as JSON, return raw string if fails
                        try {
                            const parsed = JSON.parse(responseData);
                            resolve(parsed);
                        }
                        catch {
                            // Return raw string (e.g., for "Method Not Allowed" responses)
                            resolve(responseData);
                        }
                    }
                });
                response.on("error", (error) => {
                    clearTimeout(timeoutId);
                    responseEnded = true;
                    log.error(`[API Handler] Response error: ${error.message}`);
                    reject(error);
                });
            });
            request.on("error", (error) => {
                clearTimeout(timeoutId);
                if (!responseEnded) {
                    responseEnded = true;
                    log.error(`[API Handler] Request error: ${error.message}`);
                    reject(error);
                }
            });
            // Send body for POST/PATCH requests
            if (body && (method === "POST" || method === "PATCH" || method === "PUT")) {
                request.write(JSON.stringify(body));
            }
            request.end();
        });
    });
    // Handle app version request
    ipcMain.handle("app-version", () => {
        const { app } = require("electron");
        return app.getVersion();
    });
    // Handle window controls
    ipcMain.on("window-minimize", (event) => {
        const webContents = event.sender;
        const win = require("electron").BrowserWindow.fromWebContents(webContents);
        win?.minimize();
    });
    ipcMain.on("window-maximize", (event) => {
        const webContents = event.sender;
        const win = require("electron").BrowserWindow.fromWebContents(webContents);
        if (win?.isMaximized()) {
            win.unmaximize();
        }
        else {
            win?.maximize();
        }
    });
    ipcMain.on("window-close", (event) => {
        const webContents = event.sender;
        const win = require("electron").BrowserWindow.fromWebContents(webContents);
        win?.close();
    });
    log.info("[API Handler] Engram API handler setup complete");
}
//# sourceMappingURL=api.js.map