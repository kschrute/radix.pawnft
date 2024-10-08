import BorrowerNFTItem from '@/components/nfts/BorrowerNFTItem'
import LenderNFTItem from '@/components/nfts/LenderNFTItem'
import useUserNFTs from '@/hooks/useUserNFTs'
import { Box, Heading, SimpleGrid, Skeleton, Text } from '@chakra-ui/react'
import React from 'react'

export default function MyLoans() {
  const { userBorrowerNfts, userLenderNfts } = useUserNFTs()

  return (
    <Box>
      <Heading size="lg" my={5}>
        Borrowing
      </Heading>

      {userBorrowerNfts === undefined && <Skeleton h={10} />}
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

      {userLenderNfts === undefined && <Skeleton h={10} />}
      {userLenderNfts?.length === 0 && <Text>You haven't given out any loans yet.</Text>}
      {userLenderNfts?.length > 0 && (
        <SimpleGrid spacing={5} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
          {userLenderNfts.map((nft) => (
            <LenderNFTItem key={nft.id} nft={nft} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}
