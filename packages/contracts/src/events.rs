use scrypto::prelude::*;

#[derive(ScryptoSbor, ScryptoEvent)]
pub struct NFTMintedEvent {
    pub nft_id: NonFungibleLocalId,
}
