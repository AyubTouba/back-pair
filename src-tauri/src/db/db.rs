use std::fs;
use std::path::Path;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

use crate::utils::get_config_app_folder;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn init() {
    if !db_file_exists() {
        create_db_file();
    }

    run_migrations();
}

pub fn establish_db_connection() -> SqliteConnection {
    let db_path = get_db_path().clone();

    SqliteConnection::establish(db_path.as_str()).unwrap_or_else(|e| {
        log::error!("establish_db_connection {}", e);
        panic!("Error connecting to {}", db_path)
    })
}

fn run_migrations() {
    let mut connection = establish_connection();
    connection.run_pending_migrations(MIGRATIONS).unwrap();
}

fn establish_connection() -> SqliteConnection {
    let db_path = "sqlite://".to_string() + get_db_path().as_str();

    SqliteConnection::establish(&db_path)
      .unwrap_or_else(|e| {
        log::error!("establish_db_connection {}", e);
        panic!("Error connecting to {}", db_path)
    })
}

fn create_db_file() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    fs::File::create(db_path).unwrap();
}

fn db_file_exists() -> bool {
    let db_path = get_db_path();
    Path::new(&db_path).exists()
}

fn get_db_path() -> String {
    // For testing purpose
    // env::var("DATABASE_URL").expect("DATABASE_URL must be set")
    get_config_app_folder() + "/database.sqlite"
}
