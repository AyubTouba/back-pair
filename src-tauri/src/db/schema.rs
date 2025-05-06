// @generated automatically by Diesel CLI.

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

diesel::joinable!(pairfolders -> profiles (profile_id));

diesel::allow_tables_to_appear_in_same_query!(pairfolders, profiles,);
