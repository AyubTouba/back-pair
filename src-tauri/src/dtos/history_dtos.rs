use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::db::modules::{History, Profile};

#[derive(Serialize, Deserialize)]
pub struct CreateHistroyDto {
    pub date_start: NaiveDateTime,
    pub date_end: NaiveDateTime,
    pub files_copied: Option<f64>,
    pub files_skipped: Option<f64>,
    pub files_total: Option<f64>,
    pub folder_size: Option<f64>,
    pub profile_id: String,
}
#[derive(Serialize, Deserialize)]
pub struct HistoryWithProfile {
    #[serde(flatten)]
    pub history: History,
    pub profile: Profile,
}
