#![allow(unused_mut)]

use crate::db::db::establish_db_connection;
use crate::dtos::profile_dtos::CrudProfileDto;
use crate::dtos::profile_with_folders::ProfileWithPairFolder;
use crate::db::modules::{PairFolder, Profile};
use crate::db::schema::profiles::dsl as p_dsl;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::BelongingToDsl;

use super::pairfolder_service::delete_pairfolders_by_profile;

pub fn create_profile(create_profile: &CrudProfileDto) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();

    let profile: Profile = Profile {
        name_profile: create_profile.name_profile.clone(),
        id: create_profile.id.clone(),
        created_at: chrono::Utc::now().naive_utc(),
    };
    diesel::insert_into(p_dsl::profiles)
        .values(&profile)
        .execute(connection)
        .expect("Error saving new profile");

    Ok(())
}

pub fn update_profile(edit_profile: &CrudProfileDto) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();

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

pub fn delete_profile(profile_id: &str) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();
    diesel::delete(p_dsl::profiles.filter(p_dsl::id.eq(profile_id))).execute(connection)?;
    Ok(())
}

pub fn delete_profile_with_pairfolders(profile_id: &str) -> Result<(), Error> {
    let mut connection = &mut establish_db_connection();

    let _ = connection.transaction(|_| {
        delete_pairfolders_by_profile(profile_id)?;
        delete_profile(profile_id)?;
        diesel::result::QueryResult::Ok(())
    });

    Ok(())
}
