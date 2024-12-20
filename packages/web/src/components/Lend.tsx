import BorrowerNFTItem from '@/components/nfts/BorrowerNFTItem'
import useBorrowerNFTs from '@/hooks/useBorrowerNFTs'
import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react'
import React from 'react'

export default function Lend() {
  const { borrowerNfts } = useBorrowerNFTs()

  return (
    <Box>
      {borrowerNfts === undefined && <Skeleton h={10} />}
      <SimpleGrid columns={[1, 2, 3]} spacing={5}>
        {borrowerNfts?.map((nft) => (
          <BorrowerNFTItem key={nft.id} nft={nft} />
        ))}
      </SimpleGrid>
    </Box>
  )
}
