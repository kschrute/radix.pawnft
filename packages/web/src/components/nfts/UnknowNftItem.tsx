'use client'

import type { UnknownNFT } from '@/types'
import { Badge, Card, CardHeader, Heading } from '@chakra-ui/react'
import React from 'react'

type Props = {
  nft: UnknownNFT
  isActive: boolean
  onClickSelect: (nft: UnknownNFT) => void
}

export default function UnknowNftItem({ nft, isActive, onClickSelect }: Props) {
  const { id, type, data } = nft
  const name = (data?.name as string) ?? id ?? 'Unknown'

  const handleSelect = async () => {
    onClickSelect(nft)
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
      // borderColor="red.500"
      // borderWidth={2}
      // rounded={5}
    >
      <CardHeader>
        <Heading size="md">
          <Badge>{type}</Badge>
          &nbsp;{name}
        </Heading>
      </CardHeader>
      {/*<CardBody>*/}
      {/*<Text>{type}</Text>*/}
      {/*<Text>{data?.name ?? 'Unknown'}</Text>*/}
      {/*</CardBody>*/}
      {/*
      <CardFooter>
        <Button onClick={handleSelect}>Select</Button>
      </CardFooter>
*/}
    </Card>
  )
}
