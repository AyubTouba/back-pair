CREATE TABLE history (
    id VARCHAR(50) NOT NULL PRIMARY KEY ,
    files_copied NUMBER NULL,
    files_skipped NUMBER  NULL,
    files_total NUMBER NULL,
    folder_size NUMBER NULL,
    duration NUMBER NOT NULL,
    date_start TIMESTAMP NOT NULL,
    date_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    profile_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);