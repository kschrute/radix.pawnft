import { Debug } from '@/components/Debug'
import BorrowerNFTItem from '@/components/nfts/BorrowerNFTItem'
import useBorrowerNFTs from '@/hooks/useBorrowerNFTs'
import React from 'react'
import { SimpleGrid } from '@chakra-ui/react'

export default function Lend() {
  const { borrowerNfts } = useBorrowerNFTs()

  return (
    <>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
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
    </>
  )
}
