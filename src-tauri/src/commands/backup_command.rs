use tauri::AppHandle;

use crate::{dtos::profile_with_folders::ProfileWithPairFolder, services::backup_service::BackupService};




#[tauri::command]
pub fn run_backup(app: AppHandle,profile: ProfileWithPairFolder) -> Result<(),String>{
    let backup = BackupService::default(profile);
    backup.run(&app).map_err(|e| e.to_string())
}