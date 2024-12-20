import UnknowNftItem from '@/components/nfts/UnknowNftItem'
import type { UnknownNFT } from '@/types'
import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'

type Props = {
  nfts: UnknownNFT[]
}

export default function UnknowNftList({ nfts }: Props) {
  return (
    <SimpleGrid spacing={5} templateColumns="repeat(auto-fill)">
      {nfts?.map((nft) => (
        <UnknowNftItem key={`${nft.resource}:${nft.id}`} nft={nft} isActive={false} />
      ))}
    </SimpleGrid>
  )
}
