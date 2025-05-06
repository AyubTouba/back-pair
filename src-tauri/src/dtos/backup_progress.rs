use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupProgress {
  pub name_file: String,
  pub total_bytes: u64,
  pub file_total_bytes: u64,
  pub file_bytes_copied: u64,
  pub copied_bytes: u64,

}