import config from '@/config'
import type { BorrowerNFT } from '@/types'

export default function repayLoan(account: string, nft: BorrowerNFT) {
  console.log('nft', nft)
  return `
CALL_METHOD
    Address("${config.faucetComponent}")
    "lock_fee"
    Decimal("5000")
;
CALL_METHOD
    Address("${account}")
    "create_proof_of_non_fungibles"
    Address("${nft.resource}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nft.id}")
    )
;
CALL_METHOD
    Address("${account}")
    "withdraw"
    Address("${config.xrdResource}")
    Decimal("${nft.data.total_amount}")
;
TAKE_FROM_WORKTOP
    Address("${config.xrdResource}")
    Decimal("${nft.data.total_amount}")
    Bucket("bucket1")
;
CALL_METHOD
    Address("${account}")
    "create_proof_of_non_fungibles"
    Address("${nft.resource}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nft.id}")
    )
;
POP_FROM_AUTH_ZONE
    Proof("proof1")
;
CALL_METHOD
    Address("${nft.data.component}")
    "repay_loan"
    Bucket("bucket1")
    Proof("proof1")
;
CALL_METHOD
    Address("${account}")
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
`
}
