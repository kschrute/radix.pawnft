import { Debug } from '@/components/Debug'
import BorrowerNFTItem from '@/components/nfts/BorrowerNFTItem'
import LenderNFTItem from '@/components/nfts/LenderNFTItem'
import useUserNFTs from '@/hooks/useUserNFTs'
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'

export default function MyLoans() {
  const { userBorrowerNfts, userLenderNfts } = useUserNFTs()

  console.log('userBorrowerNfts', userBorrowerNfts)
  console.log('userLenderNfts', userLenderNfts)

  return (
    <Box>
      <Heading size="lg" my={5}>
        Borrowing
      </Heading>

      {userBorrowerNfts?.length === 0 && <Text>You don't have any loans yet.</Text>}
      {userBorrowerNfts?.length > 0 && (
        <SimpleGrid spacing={5} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
          {userBorrowerNfts.map((nft) => (
            <BorrowerNFTItem key={nft.id} nft={nft} isMyNft />
          ))}
        </SimpleGrid>
      )}

      <Heading size="lg" mt={10} mb={5}>
        Lending
      </Heading>

      {userLenderNfts?.length === 0 && <Text>You haven't given out any loans yet.</Text>}
      {userLenderNfts?.length > 0 && (
        <SimpleGrid spacing={5} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
          {userLenderNfts.map((nft) => (
            <LenderNFTItem key={nft.id} nft={nft} />
          ))}
        </SimpleGrid>
      )}

      {/*<Debug data={{ userBorrowerNfts, userLenderNfts }} />*/}
    </Box>
  )
}
