'use client'

import useAccountNFTs from '@/hooks/useAccountNFTs'
import useLoanRegistryState from '@/hooks/useLoanRegistryState'
import { useRadix } from '@/hooks/useRadix'
import type { BorrowerNFT } from '@/types'
import { useMemo } from 'react'

export default function useUserNFTs() {
  const { loan_borrower_nft_resource_manager, loan_lender_nft_resource_manager } = useLoanRegistryState()
  const { account } = useRadix()
  const { accountNfts } = useAccountNFTs(account?.address)

  // @ts-ignore
  const userBorrowerNfts: BorrowerNFT[] = useMemo(
    () => accountNfts?.filter((nft) => nft.resource === loan_borrower_nft_resource_manager),
    [accountNfts, loan_borrower_nft_resource_manager],
  )

  // @ts-ignore
  const userLenderNfts: BorrowerNFT[] = useMemo(
    () => accountNfts?.filter((nft) => nft.resource === loan_lender_nft_resource_manager),
    [accountNfts, loan_lender_nft_resource_manager],
  )

  return { userNfts: accountNfts, userBorrowerNfts, userLenderNfts }
}
