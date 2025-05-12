#[derive(Debug,thiserror::Error)]
pub enum AppError {
    #[error(transparent)]
    DatabaseError(#[from] diesel::result::Error),

    #[error(transparent)]
    FilesError(#[from] fs_extra::error::Error),
}

#[derive(serde::Serialize)]
#[serde(tag="type",content = "message")]
#[serde(rename_all = "camelCase")]
enum AppErrorType {
    DatabaseError(String),
    FilesError(String)
}

impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
        let error_message = self.to_string();
        let error_type = match self {
            Self::DatabaseError(_) => AppErrorType::DatabaseError(error_message),
            Self::FilesError(_) => AppErrorType::FilesError(error_message),
        };

        error_type.serialize(serializer)
    }
}