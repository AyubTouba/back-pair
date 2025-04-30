use crate::{
    dtos::{
        pairfolder_dtos::CreatePairFolderDto, profile_dtos::CreateProfileDto,
        profile_with_folders::ProfileWithPairFolder,
    },
    services::{
        pairfolder_service::create_folderpair,
        profile_service::{create_profile, list_profiles_with_pairfolder},
    },
};

#[tauri::command]
pub fn add_profile(
    profile: CreateProfileDto,
    pair_folders: Vec<CreatePairFolderDto>,
) -> Result<(), String> {
    create_profile(&profile).expect("Error on create profile");

    for pair_folder in pair_folders {
        create_folderpair(&pair_folder, &profile.id).unwrap()
    }
    Ok(())
}

#[tauri::command]
pub fn list_profiles() -> Option<Vec<ProfileWithPairFolder>> {
    match list_profiles_with_pairfolder() {
        Ok(data) => Some(data),
        Err(_) => None,
    }
}
