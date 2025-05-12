use tauri::AppHandle;

use crate::{
    app_error::AppError, dtos::{history_dtos::HistoryWithProfile, profile_with_folders::ProfileWithPairFolder}, services::{backup_service::BackupService, db::history_service::list_history}
};

#[tauri::command]
pub fn run_backup(app: AppHandle, profile: ProfileWithPairFolder) -> Result<(), AppError> {
    let backup = BackupService::default(profile);
    Ok(backup.run(&app)?)
}

#[tauri::command]
pub fn history_backup() -> Result<Vec<HistoryWithProfile>, AppError> {
    Ok(list_history()?)
}
