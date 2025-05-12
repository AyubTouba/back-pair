use std::{
    collections::HashSet, path::Path, sync::{Arc, Mutex}, thread
};
use std::time::{Duration, Instant};
use fs_extra::{dir::{copy_with_progress, get_dir_content, CopyOptions, TransitProcess}, error::{Error, ErrorKind}};
use tauri::{AppHandle, Emitter};

use crate::{app_error::AppError, dtos::{
    backup_finished::BackupFinished, backup_progress::BackupProgress, history_dtos::CreateHistroyDto, profile_with_folders::ProfileWithPairFolder

}};

use super::db::history_service::create_history;

pub struct BackupService {
    pub profile: ProfileWithPairFolder,
    options: CopyOptions,
}

#[derive(Clone,Debug)]
struct DetailFromFolders {
    files_count:usize,
    folders_size:f64,
}
impl BackupService {
    pub fn default(profile: ProfileWithPairFolder) -> Self {
        let mut options = CopyOptions::new();
        options.overwrite = true;
        options.buffer_size = 1000000; // 1000000Octe => 1Mb
        Self { profile, options }
    }

    pub fn run(&self, app: &AppHandle) -> Result<(), Error> {
        if !self.is_folders_exist() {
           return Err(Error::new(ErrorKind::InvalidFolder, "One of the Folders doesn't exist"));
        }
        let date_start = chrono::Utc::now().naive_utc();

        let copied_count = Arc::new(Mutex::new(0));
        let skipped_count = Arc::new(Mutex::new(0));

        let files_count: Arc<Mutex<HashSet<String>>> = Arc::new(Mutex::new(HashSet::new()));
        let app = app.clone();
        let profile = self.profile.clone();
        let options = self.options.clone();
        let detail_from_folder = self.details_from_folders()?.clone();
        println!("Details: Files totals : {:#?}",detail_from_folder.files_count);

        let _ = thread::spawn(move || {
            for pairfolder in profile.pairfolders {
                let copied = Arc::clone(&copied_count);
                let skipped = Arc::clone(&skipped_count);
                let files = Arc::clone(&files_count);
                let app = &app.clone();
                let mut last_emit = Instant::now();

                let handle = move |process_info: TransitProcess| {
                    let file_name = process_info.file_name.clone();
                    let now = Instant::now();
                    let mut file = files.lock().unwrap();

                    if !file.contains(&file_name) {
                        file.insert(file_name.clone());
                        if now.duration_since(last_emit) > Duration::from_millis(100) {
                            let _ = app
                                .emit(
                                    "backup_files",
                                    BackupProgress {
                                        name_file: file_name.clone(),
                                        total_bytes: process_info.total_bytes,
                                        file_total_bytes: process_info.file_total_bytes,
                                        file_bytes_copied: process_info.file_bytes_copied,
                                        copied_bytes: process_info.copied_bytes,
                                    },
                                )
                                .map_err(|e| print!("event emit error {}", e.to_string()));
                            last_emit = now;
                        }

                        if process_info.file_total_bytes > 0 && process_info.file_bytes_copied == 0
                        {
                            let mut skipped = skipped.lock().unwrap();
                            *skipped += 1; // that's not correct
                        } else {
                            let mut copied = copied.lock().unwrap();
                            *copied += 1; // that's not correct
                        }
                    }

                    fs_extra::dir::TransitProcessResult::ContinueOrAbort
                };
                
                let _ = copy_with_progress(
                    &pairfolder.from_folder,
                    &pairfolder.to_folder,
                    &options,
                    handle,
                )
                .map_err(|e| {
                    let app_error = AppError::FilesError(e);
                    let _ = app
                    .emit(
                        "backup_error",
                        app_error.to_string(),
                    );
                });
            }

            let files_copied = Some(*copied_count.lock().unwrap() as f64);
            let files_skipped = Some(*skipped_count.lock().unwrap() as f64);
            let files_total = Some(files_count.lock().unwrap().len() as f64);
            let date_end = chrono::Utc::now().naive_utc();

            println!("Files totals : {:#?}, copied: {:#?}",files_total,files_copied);

            let history = CreateHistroyDto {
                date_start,
                date_end,
                files_copied,
                files_skipped,
                files_total,
                folder_size: Some(detail_from_folder.folders_size),
                profile_id: profile.profile.id.clone(),
            };
            let _ = create_history(&history);
            let _ = app
            .emit(
                "backup_finished",
                BackupFinished {
                    files_copied,
                    files_total,
                    profile_name:profile.profile.name_profile.clone(),
                },
            )
            .map_err(|e| print!("event emit error {}", e.to_string()));
        });
        Ok(())
    }

     fn is_folders_exist(&self) -> bool {
        for pairfolder in &self.profile.pairfolders {
            if !Path::new(&pairfolder.from_folder).exists() || !Path::new(&pairfolder.to_folder).exists() {
                return false;
            }

        }

         true
    }

    fn details_from_folders(&self) -> Result<DetailFromFolders,Error> {
        let mut files_count = 0;
        let mut folders_size= 0;
        for pairfolder in &self.profile.pairfolders {
            let source = Path::new(&pairfolder.from_folder);
            if source.exists() {
                let details = get_dir_content(&source)?;
                files_count = files_count + &details.files.len();
                folders_size = folders_size + &details.dir_size;
                }
            }
            Ok(DetailFromFolders {
                files_count,
                folders_size :folders_size  as f64
            })
    }
}
