#![allow(unused_mut)]
use crate::db::db::establish_db_connection;
use crate::dtos::pairfolder_dtos::CreatePairFolderDto;
use crate::db::modules::PairFolder;
use crate::db::schema::pairfolders;
use diesel::prelude::*;
use diesel::result::Error;

pub fn create_folderpair(
    pair_folder_dto: &CreatePairFolderDto,
    id_profile: &str,
) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();

    let pair_folder: PairFolder = PairFolder {
        id: pair_folder_dto.id.clone(),
        from_folder: pair_folder_dto.from_folder.clone(),
        to_folder: pair_folder_dto.to_folder.clone(),
        profile_id: id_profile.to_string(),
    };
    diesel::insert_into(pairfolders::table)
        .values(pair_folder)
        .execute(connection)
        .expect("Error saving new pair folder");

    Ok(())
}

pub fn delete_pairfolders_by_profile(profile_id:&str) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();
    diesel::delete(pairfolders::table.filter(pairfolders::profile_id.eq(profile_id))).execute(connection)?;

    Ok(())
}