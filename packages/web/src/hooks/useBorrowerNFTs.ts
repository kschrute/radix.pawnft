import useLoanRegistryState from '@/hooks/useLoanRegistryState'
import { useRadix } from '@/hooks/useRadix'
import type { BorrowerNFTData, NonFungibleToken } from '@/types'
import transformNftData from '@/utils/transformNftData'
import { useEffect, useState } from 'react'

export default function useBorrowerNFTs() {
  const { api } = useRadix()
  const { loan_borrower_nft_resource_manager } = useLoanRegistryState()
  const [borrowerNfts, setBorrowerNfts] = useState<NonFungibleToken<BorrowerNFTData>[]>()

  useEffect(() => {
    if (!api || !loan_borrower_nft_resource_manager) return
    ;(async () => {
      const collectionMeta = await api.state.getEntityMetadata(loan_borrower_nft_resource_manager)
      const nftIds = await api.state.getNonFungibleIds(loan_borrower_nft_resource_manager)
      const nftData = await api.state.getNonFungibleData(loan_borrower_nft_resource_manager, nftIds.items)

      // @ts-ignore
      setBorrowerNfts(transformNftData<BorrowerNFTData>(collectionMeta, nftData))
    })()
  }, [loan_borrower_nft_resource_manager, api])

  return { borrowerNfts }
}
