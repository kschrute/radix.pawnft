'use client'

import { useEffect, useState } from 'react'
import config from '@/config'
import type { NonFungibleResourcesCollectionItemVaultAggregated } from '@radixdlt/babylon-gateway-api-sdk'
import { useRadix } from '@/hooks/useRadix'

export default function useUserNFTs() {
  const { api, account } = useRadix()
  const [nftIds, setNftIds] = useState<string[]>()
  const [nfts, setNfts] = useState<NonFungibleResourcesCollectionItemVaultAggregated[]>()

  // TODO: Load NFT data
  useEffect(() => {
    ;(async () => {
      if (api && account) {
        const entityDetails = await api.state.getEntityDetailsVaultAggregated(account.address)
        // console.log('entityDetails', entityDetails.non_fungible_resources.items)
        setNfts(entityDetails.non_fungible_resources.items)

        const allNonFungibleIds = await api.state.getAllNonFungibleIds(config.nftResourceAddress)
        setNftIds(allNonFungibleIds)
      }
    })()
  }, [account, api])

  return {
    nftResource: config.nftResourceAddress,
    nftIds,
    nfts,
  }
}
