#![allow(unused_mut)]
use crate::db::db::establish_db_connection;
use crate::db::modules::PairFolder;
use crate::db::schema::pairfolders;
use crate::dtos::pairfolder_dtos::CreatePairFolderDto;
use diesel::prelude::*;
use diesel::result::Error;

pub fn create_folderpair(
    connection: &mut SqliteConnection,
    pair_folder_dto: &CreatePairFolderDto,
    id_profile: &str,
) -> Result<usize, Error> {
    let pair_folder: PairFolder = PairFolder {
        id: pair_folder_dto.id.clone(),
        from_folder: pair_folder_dto.from_folder.clone(),
        to_folder: pair_folder_dto.to_folder.clone(),
        profile_id: id_profile.to_string(),
    };
    diesel::insert_into(pairfolders::table)
        .values(pair_folder)
        .execute(connection)
}

pub fn delete_pairfolders_by_profile(
    connection: Option<&mut SqliteConnection>,
    profile_id: &str,
) -> Result<usize, Error> {
    let mut owned_connection;
    let conn = match connection {
        Some(conn_ref) => conn_ref,
        None => {
            owned_connection = establish_db_connection();
            &mut owned_connection
        }
    };

    diesel::delete(pairfolders::table.filter(pairfolders::profile_id.eq(profile_id))).execute(conn)
}
