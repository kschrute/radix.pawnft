use scrypto::prelude::*;

#[derive(ScryptoSbor, Clone)]
pub enum LoanStatus {
    Requested,
    Cancelled,
    Issued,
    Repaid,
    Defaulted,
}
