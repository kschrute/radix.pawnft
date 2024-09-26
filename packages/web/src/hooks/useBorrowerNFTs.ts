import useLoanRegistryState from '@/hooks/useLoanRegistryState'
import { useRadix } from '@/hooks/useRadix'
import type { BorrowerNFTData, NonFungibleToken } from '@/types'
import transformNftData from '@/utils/transformNftData'
import React, { useEffect, useState } from 'react'

export default function useBorrowerNFTs() {
  const { api } = useRadix()
  const { loan_borrower_nft_resource_manager } = useLoanRegistryState()
  const [borrowerNfts, setBorrowerNfts] = useState<NonFungibleToken<BorrowerNFTData>[]>([])

  useEffect(() => {
    if (!api || !loan_borrower_nft_resource_manager) return
    ;(async () => {
      const nftIds = await api.state.getNonFungibleIds(loan_borrower_nft_resource_manager)

      console.log('nftIds', nftIds)

      const nftData = await api.state.getNonFungibleData(loan_borrower_nft_resource_manager, nftIds.items)

      console.log('nftData', nftData)

      // @ts-ignore
      setBorrowerNfts(transformNftData<BorrowerNFTData>(nftData))
    })()
  }, [loan_borrower_nft_resource_manager, api])

  return { borrowerNfts }
}
