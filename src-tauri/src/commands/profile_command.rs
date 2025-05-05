use crate::{
    dtos::{
        pairfolder_dtos::CreatePairFolderDto, profile_dtos::CrudProfileDto,
        profile_with_folders::ProfileWithPairFolder,
    },
    services::{
        pairfolder_service::{create_folderpair, delete_pairfolders_by_profile},
        profile_service::{create_profile, delete_profile_with_pairfolders, list_profiles_with_pairfolder, update_profile},
    },
};

#[tauri::command]
pub fn add_profile(
    profile: CrudProfileDto,
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

#[tauri::command]
pub fn delete_profile(profile_id:&str) -> Option<bool> {
    match delete_profile_with_pairfolders(profile_id) {
        Ok(_) => Some(true),
        Err(_) => None,
    }
}

#[tauri::command]
pub fn edit_profile(profile: CrudProfileDto,
pair_folders: Vec<CreatePairFolderDto>,
) -> Result<(), String> {
update_profile(&profile).expect("Error on create profile");
delete_pairfolders_by_profile(&profile.id).unwrap();
for pair_folder in pair_folders {
    create_folderpair(&pair_folder, &profile.id).unwrap()
}
Ok(())
}
