use commands::backup_command::{history_backup, run_backup};
use commands::profile_command::{add_profile, delete_profile, edit_profile, list_profiles};
use utils::get_config_app_folder;

mod db {
    pub mod db;
    pub mod modules;
    pub mod schema;
}
mod commands {
    pub mod backup_command;
    pub mod profile_command;
}
mod dtos {
    pub mod backup_finished;
    pub mod backup_progress;
    pub mod history_dtos;
    pub mod pairfolder_dtos;
    pub mod profile_dtos;
    pub mod profile_with_folders;
}
mod services {
    pub mod db {
        pub mod history_service;
        pub mod pairfolder_service;
        pub mod profile_service;
    }
    pub mod backup_service;
    pub mod event_service;
}
pub mod app_error;
pub mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Folder {
                        path:  std::path::PathBuf::from(get_config_app_folder() + "/logs"),
                        file_name: None,
                    },
                ))
                .build(),
        )
        .setup(|_app| {
            db::db::init();
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_profile,
            list_profiles,
            delete_profile,
            edit_profile,
            run_backup,
            history_backup
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
