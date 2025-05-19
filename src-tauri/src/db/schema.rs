// @generated automatically by Diesel CLI.

diesel::table! {
    history (id) {
        id -> Text,
        files_copied -> Nullable<Double>,
        files_skipped -> Nullable<Double>,
        files_total -> Nullable<Double>,
        folder_size -> Nullable<Double>,
        duration -> Double,
        date_start -> Timestamp,
        date_end -> Timestamp,
        created_at -> Timestamp,
        profile_id -> Text,
    }
}

diesel::table! {
    pairfolders (id) {
        id -> Text,
        from_folder -> Text,
        to_folder -> Text,
        profile_id -> Text,
    }
}

diesel::table! {
    profiles (id) {
        id -> Text,
        name_profile -> Text,
        created_at -> Timestamp,
    }
}

diesel::joinable!(history -> profiles (profile_id));
diesel::joinable!(pairfolders -> profiles (profile_id));

diesel::allow_tables_to_appear_in_same_query!(history, pairfolders, profiles,);
