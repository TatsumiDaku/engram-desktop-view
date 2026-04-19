// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;

fn main() {
    env_logger::init();
    info!("Starting EngramDesktopView...");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            info!("Setting up application...");
            let _ = engram_desktop_view_lib::create_tray(app.handle())?;
            info!("System tray created successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}