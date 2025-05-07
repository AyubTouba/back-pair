use tauri::AppHandle;

use crate::{dtos::{history_dtos::HistoryWithProfile, profile_with_folders::ProfileWithPairFolder}, services::{backup_service::BackupService, db::history_service::list_history}};




#[tauri::command]
pub fn run_backup(app: AppHandle,profile: ProfileWithPairFolder) -> Result<(),String>{
    let backup = BackupService::default(profile);
    backup.run(&app).map_err(|e| e.to_string())
   
}

#[tauri::command]
pub fn history_backup() -> Result<Vec<HistoryWithProfile>,String> {
    list_history().map_err(|e| e.to_string())
}