'use client'

import { useEffect, useState } from 'react'
import { useRadix } from '@/providers/radix'
import config from '@/config'
import type { NonFungibleResourcesCollectionItemVaultAggregated } from '@radixdlt/babylon-gateway-api-sdk'

export default function useUserNFTs() {
  const { api, account } = useRadix()
  const [nftIds, setNftIds] = useState<string[]>()
  const [nfts, setNfts] = useState<NonFungibleResourcesCollectionItemVaultAggregated[]>()

  useEffect(() => {
    (async () => {
      if (account) {
        const entityDetails = await api.state.getEntityDetailsVaultAggregated(account.address)
        // console.log('entityDetails', entityDetails.non_fungible_resources.items)
        setNfts(entityDetails.non_fungible_resources.items)

        const allNonFungibleIds = await api.state.getAllNonFungibleIds(config.nftResourceAddress)
        setNftIds(allNonFungibleIds)
      }
    })();
  }, [account, api.state.getAllNonFungibleIds])

  return {
    nftResource: config.nftResourceAddress,
    nftIds,
    nfts
  }
}
