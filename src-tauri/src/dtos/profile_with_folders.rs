use serde::{Deserialize, Serialize};

use crate::db::modules::{PairFolder, Profile};

#[derive(Serialize,Deserialize)]
pub struct ProfileWithPairFolder {
    #[serde(flatten)]
    pub profile: Profile,
    pub pairfolders: Vec<PairFolder>,
}
