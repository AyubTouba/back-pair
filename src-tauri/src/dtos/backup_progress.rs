use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupProgress {
  pub total_files: usize,
  pub copied_files:usize,
  pub progress:f64,

}