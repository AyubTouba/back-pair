use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CreatePairFolderDto {
    pub id: String,
    pub from_folder: String,
    pub to_folder: String,
}
