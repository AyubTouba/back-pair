// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod commands;
mod db;
mod dtos;
mod modules;
mod schema;
mod services;
use commands::profile_command::{add_profile, list_profiles,delete_profile,edit_profile};


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            db::init();
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![add_profile, list_profiles,delete_profile,edit_profile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
