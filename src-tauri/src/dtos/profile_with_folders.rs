use serde::Serialize;

use crate::modules::{PairFolder, Profile};

#[derive(Serialize)]
pub struct ProfileWithPairFolder {
    #[serde(flatten)]
    pub profile: Profile,
    pub pairfolders: Vec<PairFolder>,
}
