use fs_extra_back_pair::{
    dir::{copy_with_progress, get_dir_content, CopyOptions, TransitProcess},
    error::{Error, ErrorKind},
};
use serde::Serialize;
use std::{
    collections::HashSet,
    path::Path,
    sync::{Arc, Mutex},
    thread,
};
use tauri::{AppHandle, Emitter};

use crate::{
    app_error::AppError,
    dtos::{
        backup_finished::BackupFinished, backup_progress::BackupProgress,
        history_dtos::CreateHistroyDto, profile_with_folders::ProfileWithPairFolder,
    },
};

use super::{db::history_service::create_history, event_service::get_event_steps};

pub struct BackupService {
    pub profile: ProfileWithPairFolder,
    options: CopyOptions,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]

pub struct DetailFromFolders {
    files_count: usize,
    folders_size: f64,
}
impl BackupService {
    pub fn default(profile: ProfileWithPairFolder) -> Self {
        let mut options = CopyOptions::new();
        options.overwrite = true;
        options.buffer_size = 1000000; // 1000000Octe => 1Mb
        Self { profile, options }
    }

    pub fn run(&self, app: &AppHandle) -> Result<DetailFromFolders, Error> {
        if !self.is_folders_exist() {
            return Err(Error::new(
                ErrorKind::InvalidFolder,
                "One of the Folders doesn't exist",
            ));
        }

        let app = app.clone();
        let profile = self.profile.clone();
        let options = self.options.clone();
        let detail_from_folder = self.details_from_folders()?.clone();
        let details = detail_from_folder.clone();
        let _ = thread::spawn(move || {
            Self::process_backup(app, profile, options, detail_from_folder);
        });
        Ok(details)
    }

    fn process_backup(
        app: AppHandle,
        profile: ProfileWithPairFolder,
        options: CopyOptions,
        detail_from_folder: DetailFromFolders,
    ) {
        let date_start = chrono::Local::now().naive_local();
        let copied_count = Arc::new(Mutex::new(0));
        let skipped_count = Arc::new(Mutex::new(0));
        let files_count: Arc<Mutex<HashSet<String>>> = Arc::new(Mutex::new(HashSet::new()));
        let step = get_event_steps(detail_from_folder.files_count);

        for pairfolder in profile.pairfolders {
            let files = Arc::clone(&files_count);
            let _skipped = Arc::clone(&skipped_count);
            let app = &app.clone();

            let copied = Arc::clone(&copied_count);

            let handle = move |process_info: TransitProcess| {
                let mut file = files.lock().unwrap();
                if !file.contains(&process_info.path_file) {
                    file.insert(process_info.path_file.clone());
                    let mut copied = copied.lock().unwrap();
                    *copied += 1;
                }

                let copied = copied.lock().unwrap();
                if *copied % step == 0 || *copied == detail_from_folder.files_count {
                    let _ = app
                        .emit(
                            "backup_files",
                            BackupProgress {
                                copied_files: *copied,
                                total_files: detail_from_folder.files_count,
                                progress: ((*copied + 1) as f64
                                    / detail_from_folder.files_count as f64
                                    * 100.0)
                                    .round(),
                            },
                        )
                        .map_err(|e| print!("event emit error {}", e.to_string()));
                }

                fs_extra_back_pair::dir::TransitProcessResult::ContinueOrAbort
            };

            let _ = copy_with_progress(
                &pairfolder.from_folder,
                &pairfolder.to_folder,
                &options,
                handle,
            )
            .map_err(|e| {
                let app_error = AppError::FilesError(e);
                let _ = app.emit("backup_error", app_error.to_string());
            });
        }

        let files_copied = Some(*copied_count.lock().unwrap() as f64);
        let files_skipped = Some(*skipped_count.lock().unwrap() as f64);
        let date_end = chrono::Local::now().naive_local();

        let history = CreateHistroyDto {
            date_start,
            date_end,
            files_copied,
            files_skipped,
            files_total: Some(detail_from_folder.files_count as f64),
            folder_size: Some(detail_from_folder.folders_size),
            profile_id: profile.profile.id.clone(),
        };
        let _ = create_history(&history);
        let _ = app
            .emit(
                "backup_finished",
                BackupFinished {
                    files_copied,
                    files_total: Some(detail_from_folder.files_count as f64),
                    profile_name: profile.profile.name_profile.clone(),
                },
            )
            .map_err(|e| print!("event emit error {}", e.to_string()));
    }

    fn is_folders_exist(&self) -> bool {
        for pairfolder in &self.profile.pairfolders {
            if !Path::new(&pairfolder.from_folder).exists()
                || !Path::new(&pairfolder.to_folder).exists()
            {
                return false;
            }
        }

        true
    }

    fn details_from_folders(&self) -> Result<DetailFromFolders, Error> {
        let mut files_count = 0;
        let mut folders_size = 0;
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
            folders_size: folders_size as f64,
        })
    }
}
