import config from '@/config'
import type { BorrowerNFT, LenderNFT } from '@/types'

export default function takeCollateral(account: string, nft: LenderNFT) {
  return `
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
    "take_collateral"
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
