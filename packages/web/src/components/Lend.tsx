import { Debug } from '@/components/Debug'
import BorrowerNFTItem from '@/components/nfts/BorrowerNFTItem'
import useBorrowerNFTs from '@/hooks/useBorrowerNFTs'
import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react'
import React from 'react'

export default function Lend() {
  const { borrowerNfts } = useBorrowerNFTs()

  return (
    <Box>
      {borrowerNfts === undefined && <Skeleton h={10} />}
      <SimpleGrid spacing={5} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
        {borrowerNfts?.map((nft) => (
          <BorrowerNFTItem key={nft.id} nft={nft} />
        ))}
      </SimpleGrid>

      {/*
      <Debug
        data={{
          borrowerNfts,
        }}
      />
*/}
    </Box>
  )
}
