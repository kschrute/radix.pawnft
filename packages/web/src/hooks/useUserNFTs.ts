'use client'

import useLoanRegistryState from '@/hooks/useLoanRegistryState'
import { useRadix } from '@/hooks/useRadix'
import type { BorrowerNFT, UnknownNFT } from '@/types'
import transformNftData from '@/utils/transformNftData'
import { useEffect, useMemo, useState } from 'react'

export default function useUserNFTs() {
  const { loan_borrower_nft_resource_manager, loan_lender_nft_resource_manager } = useLoanRegistryState()
  const { api, account } = useRadix()
  const [userNfts, setUserNfts] = useState<UnknownNFT[]>()

  // @ts-ignore
  const userBorrowerNfts: BorrowerNFT[] = useMemo(
    () => userNfts?.filter((nft) => nft.resource === loan_borrower_nft_resource_manager),
    [userNfts, loan_borrower_nft_resource_manager],
  )

  // @ts-ignore
  const userLenderNfts: BorrowerNFT[] = useMemo(
    () => userNfts?.filter((nft) => nft.resource === loan_lender_nft_resource_manager),
    [userNfts, loan_lender_nft_resource_manager],
  )

  useEffect(() => {
    if (!account || !api) return
    ;(async () => {
      // @ts-ignore
      let userNfts: UnknownNFT[] = []

      if (api && account) {
        const entityDetails = await api.state.getEntityDetailsVaultAggregated(account.address)

        for (const collection of entityDetails.non_fungible_resources.items) {
          const collectionMeta = await api.state.getEntityMetadata(collection.resource_address)

          const nftIds = collection.vaults.items[0].items
          if (nftIds) {
            const nftData = await api.state.getNonFungibleData(collection.resource_address, nftIds)
            // @ts-ignore
            const data = transformNftData<Record<string, unknown>>(collectionMeta, nftData)

            userNfts = [...userNfts, ...data]
          }
        }
      }

      setUserNfts(userNfts)
    })()
  }, [account, api])

  return { userNfts, userBorrowerNfts, userLenderNfts }
}
