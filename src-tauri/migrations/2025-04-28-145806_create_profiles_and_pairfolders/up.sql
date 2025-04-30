CREATE TABLE profiles (
    id VARCHAR(50) NOT NULL PRIMARY KEY ,
    name_profile TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pairfolders (
    id VARCHAR(50) NOT NULL PRIMARY KEY ,
    from_folder TEXT NOT NULL,
    to_folder TEXT NOT NULL,
    profile_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);