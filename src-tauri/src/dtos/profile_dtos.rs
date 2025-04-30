use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CreateProfileDto {
    pub id: String,
    pub name_profile: String,
}
