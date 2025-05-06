mod db {
    pub mod db;
    pub mod modules;
    pub mod schema;
}
mod commands {
    pub mod profile_command;
    pub mod backup_command;
}
mod dtos {
    pub mod pairfolder_dtos;
    pub mod profile_dtos;
    pub mod profile_with_folders;
    pub mod backup_progress;
}
mod services {
     pub mod db {
        pub mod pairfolder_service;
        pub mod profile_service;
    }   
    pub mod backup_service;   
}

use commands::profile_command::{add_profile, list_profiles,delete_profile,edit_profile};
use commands::backup_command::run_backup;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            db::db::init();
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![add_profile, list_profiles,delete_profile,edit_profile,run_backup])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

