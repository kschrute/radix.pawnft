use scrypto::prelude::*;
use crate::enums::LoanStatus;

#[derive(ScryptoSbor, NonFungibleData, Clone)]
pub struct LoanBorrowerNFT {
    pub component: ComponentAddress,
    pub receiver: ComponentAddress,
    pub amount: Decimal,
    pub total_amount: Decimal,
    pub duration: i64,
    pub apr: Decimal,
    #[mutable]
    pub maturity_date: Option<UtcDateTime>,
    #[mutable]
    pub closed_date: Option<UtcDateTime>,
    #[mutable]
    pub status: LoanStatus,
}

#[derive(ScryptoSbor, NonFungibleData, Clone)]
pub struct LoanLenderNFT {
    pub component: ComponentAddress,

    #[mutable]
    pub status: LoanStatus,

    // pub loan_borrower_nft_id: NonFungibleLocalId,
    // #[mutable]
    // pub status: Status,
}