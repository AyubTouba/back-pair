use std::{collections::HashSet, sync::{Arc, Mutex}};

use fs_extra::dir::{copy_with_progress, CopyOptions, TransitProcess};
use tauri::{AppHandle, Emitter};


use crate::dtos::{backup_progress::BackupProgress, history_dtos::CreateHistroyDto, profile_with_folders::ProfileWithPairFolder};

use super::db::history_service::create_history;

pub struct BackupService {
    pub profile: ProfileWithPairFolder,
    options: CopyOptions,
}

impl BackupService {
    pub fn default(profile: ProfileWithPairFolder) -> Self {
        let mut options = CopyOptions::new();
        options.overwrite = true;
      //  options.buffer_size = 1000000; // 1000000Octe => 1Mb
        Self { profile, options }
    }

    pub fn run(&self, app: &AppHandle) -> Result<(), fs_extra::error::Error> {
        let date_start =  chrono::Utc::now().naive_utc();

        let copied_count = Arc::new(Mutex::new(0));
        let skipped_count = Arc::new(Mutex::new(0));
        let files_count:Arc<Mutex<HashSet<String>>> = Arc::new(Mutex::new(HashSet::new()));



        for pairfolder in &self.profile.pairfolders {
            let copied = Arc::clone(&copied_count);
            let skipped = Arc::clone(&skipped_count);
            let files = Arc::clone(&files_count);
            let app = app.clone();
            let handle = move |process_info: TransitProcess| {
                let file_name = process_info.file_name.clone();
               let _ = app.emit(
                    "backup_files",
                    BackupProgress {
                        name_file: file_name.clone(),
                        total_bytes: process_info.total_bytes,
                        file_total_bytes: process_info.file_total_bytes,
                        file_bytes_copied: process_info.file_bytes_copied,
                        copied_bytes:process_info.copied_bytes,
                    },
                )
                .unwrap();

                let mut file = files.lock().unwrap();

                if !file.contains(&file_name) {
                    file.insert(file_name.clone());

                    if process_info.file_total_bytes > 0 && process_info.file_bytes_copied == 0 {
                        let mut skipped = skipped.lock().unwrap();
                        *skipped += 1;
                    } else {
                        let mut copied = copied.lock().unwrap();
                        *copied += 1;
                    }
                     
                }

                fs_extra::dir::TransitProcessResult::ContinueOrAbort
            };

            copy_with_progress(
                &pairfolder.from_folder,
                &pairfolder.to_folder,
                &self.options,
                handle,
            )?;
        }

        let files_copied = Some(*copied_count.lock().unwrap() as f64) ;
        let files_skipped = Some(*skipped_count.lock().unwrap() as f64);
        let files_total = Some(files_count.lock().unwrap().len() as f64);

        let date_end =  chrono::Utc::now().naive_utc();
        let history = CreateHistroyDto {
            date_start,
            date_end,
            files_copied,
            files_skipped,
            files_total,
            profile_id: self.profile.profile.id.clone()
        };
        let _ = create_history(&history);
        Ok(())
    }
}
