import config from '@/config'

type NFTs = {
  resource: string
  ids: string[]
}

const formatNFTs = (nfts: NFTs[]) => {
  let fragment = ''

  for (const nft of nfts) {
    fragment = `
    Address("${nft.resource}")
    Array<NonFungibleLocalId>(
`
    for (const id of nft.ids) {
      fragment = `
${fragment}
        NonFungibleLocalId("${id}"),
    )
`
    }
  }

  fragment = `
${fragment}
    )
  `

  return fragment
}

export default function (account: string, nftResource: string, nftId: string) {
  return `
CALL_METHOD
    Address("${config.faucetComponent}")
    "lock_fee"
    Decimal("5000")
;
CALL_METHOD
    Address("${account}")
    "withdraw_non_fungibles"
    Address("${nftResource}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nftId}"),
    )
;
TAKE_ALL_FROM_WORKTOP
    Address("${nftResource}")
    Bucket("bucket")
;
CALL_FUNCTION
    Address("${config.packageAddress}")
    "LoanRequest"
    "instantiate_loan_request"
    Address("${config.loanRegistryComponentAddress}")
    Array<Bucket>(
        Bucket("bucket"),
        Bucket("bucket2")
    )
    Address("${config.xrdResource}")
    Decimal("33")
    Decimal("1.5")
    30i64
    Address("${account}")
;
CALL_METHOD
    Address("${account}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`
}
