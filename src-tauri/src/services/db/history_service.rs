#![allow(unused_mut)]

use diesel::{result::Error, ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use uuid::Uuid;

use crate::{db::{db::establish_db_connection, modules::{History, Profile}, schema::{history, profiles}}, dtos::history_dtos::{CreateHistroyDto, HistoryWithProfile}};



pub fn create_history(history_dto : &CreateHistroyDto) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();
    let diff = history_dto.date_end.clone() - history_dto.date_start.clone();

    let new_history = History {
        id: Uuid::new_v4().to_string(),
        profile_id: history_dto.profile_id.clone(),
        created_at: chrono::Local::now().naive_local(),
        date_start:history_dto.date_start.clone(),
        date_end: history_dto.date_end.clone(),
        duration: diff.num_seconds() as f64,
        files_copied: history_dto.files_copied,
        files_skipped:history_dto.files_skipped,
        files_total:history_dto.files_total,
        folder_size:history_dto.folder_size,
    };

    diesel::insert_into(history::table).values(&new_history).execute(connection).expect("Error saving new History");

    Ok(())
}

pub fn list_history() -> Result<Vec<HistoryWithProfile>,Error>{
    let mut connection = &mut establish_db_connection();
    let data = history::table.inner_join(profiles::table).select((History::as_select(),Profile::as_select())).order(history::created_at.desc()).load::<(History,Profile)>(connection)?;
     Ok(data.into_iter().map(|(history,profile)| HistoryWithProfile {history,profile}).collect::<Vec<HistoryWithProfile>>())

}