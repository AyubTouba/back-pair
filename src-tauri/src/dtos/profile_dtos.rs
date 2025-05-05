use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CrudProfileDto {
    pub id: String,
    pub name_profile: String,
}
