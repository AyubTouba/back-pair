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
        match self.details_source_folders(&app) {
            Ok(details) => {
                let detail_from_folder = details.clone();
                let details = detail_from_folder.clone();
                let _ = thread::spawn(move || {
                    Self::process_backup(app, profile, options, detail_from_folder);
                });
                Ok(details)
            }
            Err(e) => Err(Error::new(ErrorKind::Other, &e)),
        }
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
                                progress: ((*copied) as f64
                                    / detail_from_folder.files_count as f64
                                    * 100.0)
                                    .round(),
                            },
                        )
                        .map_err(|e| {
                            log::error!("app.emit prcoess backup backup_files event: {}", e)
                        });
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
                log::error!("copy_with_progress: {}", e);
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
                    files_total: history.files_total,
                    profile_name: profile.profile.name_profile.clone(),
                },
            )
            .map_err(|e| {
                log::error!("app.emit in process_backup: {}", e);
                print!("event emit error {}", e.to_string())
            });

        log::info!(
            "Backup finished {} / {} copied files",
            *copied_count.lock().unwrap(),
            detail_from_folder.files_count
        )
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

    fn details_source_folders(&self, app: &AppHandle) -> Result<DetailFromFolders, String> {
        let files_count: Arc<Mutex<usize>> = Arc::new(Mutex::new(0));
        let folders_size: Arc<Mutex<u64>> = Arc::new(Mutex::new(0));
        let is_has_error = Arc::new(Mutex::new(None));

        let err = Arc::clone(&is_has_error);
        let profile = self.profile.clone();
        let files = Arc::clone(&files_count);
        let folders = Arc::clone(&folders_size);
        let app = app.clone();
        let _ = app.emit("backup_start", "Preparing folders for backup…");
        let _ = thread::spawn(move || {
            for pairfolder in profile.pairfolders {
                let source = Path::new(&pairfolder.from_folder);
                if source.exists() {
                    let details = get_dir_content(&source);
                    match details {
                        Ok(details) => {
                            let mut file_count = files.lock().unwrap();
                            let mut folder = folders.lock().unwrap();
                            *file_count += details.files.len();
                            *folder += details.dir_size;

                            let folder_name =
                                source.file_name().unwrap_or_default().to_string_lossy();

                            let _ = app.emit(
                                "backup_start",
                                format!(
                                    "Found {} files in \"{}\"",
                                    details.files.len(),
                                    folder_name
                                ),
                            );
                        }
                        Err(e) => {
                            log::error!("details_source_folders: {}", e);
                            let _ = app.emit("backup_error", e.to_string());
                            let mut error = err.lock().unwrap();
                            *error = Some(e.to_string());
                            break;
                        }
                    };
                }
            }
        })
        .join()
        .unwrap();

        let files_count = *files_count.lock().unwrap() as usize;
        let folders_size = *folders_size.lock().unwrap() as f64;
        let error = is_has_error.lock().unwrap().clone();

        match error {
            None => Ok(DetailFromFolders {
                files_count,
                folders_size,
            }),
            Some(e) => Err(e),
        }
    }
}
