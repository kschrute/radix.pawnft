'use client'

import { useRadix } from '@/hooks/useRadix'
import type { UnknownNFT } from '@/types'
import transformNftData from '@/utils/transformNftData'
import { useEffect, useState } from 'react'

export default function useAccountNFTs(address?: string) {
  const { api, account } = useRadix()
  const [accountNfts, setAccountNfts] = useState<UnknownNFT[]>()

  useEffect(() => {
    if (!api || !address) return
    ;(async () => {
      // @ts-ignore
      let accountNfts: UnknownNFT[] = []

      const entityDetails = await api.state.getEntityDetailsVaultAggregated(address)
      // console.log('entityDetails', entityDetails)

      for (const collection of entityDetails.non_fungible_resources.items) {
        const collectionMeta = await api.state.getEntityMetadata(collection.resource_address)

        const nftIds = collection.vaults.items[0].items
        if (nftIds) {
          const nftData = await api.state.getNonFungibleData(collection.resource_address, nftIds)
          // @ts-ignore
          const data = transformNftData<Record<string, unknown>>(collectionMeta, nftData)

          accountNfts = [...accountNfts, ...data]
        }
      }

      setAccountNfts(accountNfts)
    })()
  }, [address, api])

  return { accountNfts }
}
