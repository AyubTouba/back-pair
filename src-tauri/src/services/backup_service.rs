use fs_extra::dir::{copy_with_progress, CopyOptions, TransitProcess};
use tauri::{AppHandle, Emitter};

use crate::dtos::{backup_progress::BackupProgress, profile_with_folders::ProfileWithPairFolder};

pub struct BackupService {
    pub profile: ProfileWithPairFolder,
    options: CopyOptions,
}

impl BackupService {
    pub fn default(profile: ProfileWithPairFolder) -> Self {
        let mut options = CopyOptions::new();
        options.overwrite = true;
      //  options.buffer_size = 125000; // 125000Octe => 1Mb
        Self { profile, options }
    }

    pub fn run(&self, app: &AppHandle) -> Result<(), fs_extra::error::Error> {
        let handle = |process_info: TransitProcess| {
            app.emit(
                "backup_files",
                BackupProgress {
                    name_file: process_info.file_name,
                    total_bytes: process_info.total_bytes,
                    file_total_bytes: process_info.file_total_bytes,
                    file_bytes_copied: process_info.file_bytes_copied,
                    copied_bytes:process_info.copied_bytes,
                },
            )
            .unwrap();
            fs_extra::dir::TransitProcessResult::ContinueOrAbort
        };
        for pairfolder in &self.profile.pairfolders {
            copy_with_progress(
                &pairfolder.from_folder,
                &pairfolder.to_folder,
                &self.options,
                handle,
            )?;
        }

        Ok(())
    }
}
