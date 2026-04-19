// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager,
};

/// Proxy HTTP requests to Engram server from Rust backend to avoid CORS
#[tauri::command]
async fn engram_request(
    method: String,
    path: String,
    body: Option<String>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!("http://127.0.0.1:7437{}", path);
    log::info!("[ENGRAM_REQUEST] {} {}", method, url);

    let resp = match method.to_uppercase().as_str() {
        "GET" => client.get(&url).send().await,
        "POST" => {
            let mut req = client.post(&url);
            if let Some(b) = &body {
                req = req.body(b.clone()).header("content-type", "application/json");
            }
            req.send().await
        }
        "PATCH" => {
            let mut req = client.patch(&url);
            if let Some(b) = &body {
                req = req.body(b.clone()).header("content-type", "application/json");
            }
            req.send().await
        }
        "DELETE" => client.delete(&url).send().await,
        _ => return Err(format!("Method not supported: {}", method)),
    };

    match resp {
        Ok(response) => {
            let status = response.status();
            let text = response.text().await.map_err(|e| e.to_string())?;
            log::info!("[ENGRAM_RESPONSE] {} - {}", status, text.len());
            Ok(text)
        }
        Err(e) => {
            log::error!("[ENGRAM_ERROR] {} {} - {}", method, url, e);
            Err(e.to_string())
        }
    }
}

fn main() {
    env_logger::init();
    info!("Starting EngramDesktopView...");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![engram_request])
        .setup(|app| {
            info!("Setting up application...");

            // Create system tray
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .tooltip("Engram Desktop View")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        info!("Quit requested from tray menu");
                        std::process::exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            info!("System tray created successfully");
            Ok(())
        })
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                // Kill the process when window is closed - no graceful shutdown
                info!("Window close requested - killing process");
                std::process::exit(0);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}