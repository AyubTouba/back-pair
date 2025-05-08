use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
    Queryable, Selectable, Insertable, Serialize, Deserialize, Debug, PartialEq, Identifiable, Clone,
)]
#[diesel(table_name = crate::db::schema::profiles)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Profile {
    pub id: String,
    pub name_profile: String,
    pub created_at: NaiveDateTime,
}

#[derive(
    Queryable,
    Selectable,
    Insertable,
    Serialize,
    Deserialize,
    Associations,
    Debug,
    PartialEq,
    Identifiable,
    Clone,
)]
#[diesel(table_name = crate::db::schema::pairfolders)]
#[diesel(belongs_to(Profile))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct PairFolder {
    pub id: String,
    pub from_folder: String,
    pub to_folder: String,
    pub profile_id: String,
}

#[derive(
    Queryable,
    Selectable,
    Insertable,
    Serialize,
    Deserialize,
    Associations,
    Debug,
    PartialEq,
    Identifiable,
)]
#[diesel(table_name = crate::db::schema::history)]
#[diesel(belongs_to(Profile))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct History {
    pub id: String,
    pub created_at: NaiveDateTime,
    pub date_start: NaiveDateTime,
    pub date_end: NaiveDateTime,
    pub duration: f64,
    pub files_copied: Option<f64>,
    pub files_skipped: Option<f64>,
    pub files_total: Option<f64>,
    pub folder_size: Option<f64>,
    pub profile_id: String,
}
