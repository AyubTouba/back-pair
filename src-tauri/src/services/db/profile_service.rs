#![allow(unused_mut)]

use crate::db::db::establish_db_connection;
use crate::db::modules::{PairFolder, Profile};
use crate::db::schema::profiles::dsl as p_dsl;
use crate::dtos::pairfolder_dtos::CreatePairFolderDto;
use crate::dtos::profile_dtos::CrudProfileDto;
use crate::dtos::profile_with_folders::ProfileWithPairFolder;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::BelongingToDsl;

use super::pairfolder_service::{create_folderpair, delete_pairfolders_by_profile};

pub fn create_profile(connection : &mut SqliteConnection ,create_profile: &CrudProfileDto) -> Result<usize, Error> {

    let profile = Profile {
        name_profile: create_profile.name_profile.clone(),
        id: create_profile.id.clone(),
        created_at: chrono::Local::now().naive_local(),
    };
    diesel::insert_into(p_dsl::profiles)
        .values(&profile)
        .execute(connection)
}

pub fn update_profile(connection : &mut SqliteConnection ,edit_profile: &CrudProfileDto) -> Result<(), Error> {

    diesel::update(p_dsl::profiles)
        .filter(p_dsl::id.eq(edit_profile.id.clone()))
        .set(p_dsl::name_profile.eq(edit_profile.name_profile.clone()))
        .execute(connection)?;

    Ok(())
}

pub fn list_profiles_with_pairfolder() -> Result<Vec<ProfileWithPairFolder>, Error> {
    let mut connection = &mut establish_db_connection();

    let profiles = p_dsl::profiles
        .select(Profile::as_select())
        .load(connection)?;

    let pairfolders = PairFolder::belonging_to(&profiles)
        .select(PairFolder::as_select())
        .load(connection)?;

    Ok(pairfolders
        .grouped_by(&profiles)
        .into_iter()
        .zip(profiles)
        .map(|(pairfolders, profile)| ProfileWithPairFolder {
            profile,
            pairfolders,
        })
        .collect::<Vec<ProfileWithPairFolder>>())
}

pub fn delete_profile(connection : &mut SqliteConnection ,profile_id: &str) -> Result<(), Error> {
    diesel::delete(p_dsl::profiles.filter(p_dsl::id.eq(profile_id))).execute(connection)?;
    Ok(())
}

pub fn delete_profile_with_pairfolders(profile_id: &str) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();

     connection.transaction(|conn| {
        delete_pairfolders_by_profile(Some(conn),profile_id)?;
        delete_profile(conn,profile_id)?;
        diesel::result::QueryResult::Ok(())
    })?;

    Ok(())
}

pub fn create_profile_with_pairfolders(
    profile: &CrudProfileDto,
    pair_folders: &Vec<CreatePairFolderDto>,
) -> Result<(),Error>{
    let mut connection = &mut establish_db_connection();

    connection.transaction(|conn| {
        create_profile(conn,&profile)?;

        for pair_folder in pair_folders {
            create_folderpair(conn,&pair_folder, &profile.id)?;
        }

        diesel::result::QueryResult::Ok(())
    })?;

    Ok(())
}

pub fn update_profile_with_pairfolders(edit_profile: &CrudProfileDto,pair_folders: &Vec<CreatePairFolderDto>,
) -> Result<(),Error> {
    let mut connection = &mut establish_db_connection();

    connection.transaction(|conn| {
        update_profile(conn,edit_profile)?;
        delete_pairfolders_by_profile(Some(conn),&edit_profile.id).unwrap();
        for pair_folder in pair_folders {
            create_folderpair(conn,&pair_folder, &edit_profile.id)?;
        }

        diesel::result::QueryResult::Ok(())
    })?;

    Ok(())
}