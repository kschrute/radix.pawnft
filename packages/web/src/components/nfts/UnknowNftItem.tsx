'use client'

import type { UnknownNFT } from '@/types'
import { Badge, Card, CardHeader, Heading, Image } from '@chakra-ui/react'
import React from 'react'

type Props = {
  nft: UnknownNFT
  isActive: boolean
  onClickSelect?: (nft: UnknownNFT) => void
}

export default function UnknowNftItem({ nft, isActive, onClickSelect }: Props) {
  const { id, type, data } = nft
  const name = (data?.name as string) ?? id ?? 'Unknown'
  const image = data.key_image_url as string ?? 'https://i.imgur.com/DehtNMl.png'

  const handleSelect = async () => {
    onClickSelect?.(nft)
  }

  return (
    <Card
      bg="blackAlpha.400"
      cursor="pointer"
      onClick={handleSelect}
      {...(isActive
        ? {
            borderColor: 'green.300',
            borderWidth: 2,
            rounded: 5,
          }
        : {
            borderColor: 'none',
            borderWidth: 2,
            rounded: 5,
          })}
    >
      <CardHeader>
        <Heading size="md">
          <Badge>{type}</Badge>
          &nbsp;{name}
          <Image mt={2} src={image} alt="NFT" />
        </Heading>
      </CardHeader>
    </Card>
  )
}
