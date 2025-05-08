use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupFinished {
    pub files_copied: Option<f64>,
    pub files_total: Option<f64>,
    pub profile_name: String,
}
