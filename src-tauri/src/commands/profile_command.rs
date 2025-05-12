use crate::{
    app_error::AppError,
    dtos::{
        pairfolder_dtos::CreatePairFolderDto, profile_dtos::CrudProfileDto,
        profile_with_folders::ProfileWithPairFolder,
    },
    services::db::profile_service::{
        create_profile_with_pairfolders, delete_profile_with_pairfolders,
        list_profiles_with_pairfolder, update_profile_with_pairfolders,
    },
};

#[tauri::command]
pub fn add_profile(
    profile: CrudProfileDto,
    pair_folders: Vec<CreatePairFolderDto>,
) -> Result<(), AppError> {
    Ok(create_profile_with_pairfolders(&profile, &pair_folders)?)
}

#[tauri::command]
pub fn list_profiles() -> Result<Vec<ProfileWithPairFolder>,AppError> {
    Ok(list_profiles_with_pairfolder()?)
}

#[tauri::command]
pub fn delete_profile(profile_id: &str) ->Result<(), AppError> {
  Ok(delete_profile_with_pairfolders(profile_id)?)
}

#[tauri::command]
pub fn edit_profile(
    profile: CrudProfileDto,
    pair_folders: Vec<CreatePairFolderDto>,
) -> Result<(), AppError> {
    Ok(update_profile_with_pairfolders(&profile,&pair_folders)?)
}
