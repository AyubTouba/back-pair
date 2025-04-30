#![allow(unused_mut)]

use crate::db::establish_db_connection;
use crate::dtos::profile_dtos::CreateProfileDto;
use crate::dtos::profile_with_folders::ProfileWithPairFolder;
use crate::modules::{PairFolder, Profile};
use crate::schema::profiles::dsl as p_dsl;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::BelongingToDsl;

pub fn create_profile(create_profile: &CreateProfileDto) -> Result<(), Error> {
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
