'use client'

import { Box, Button, ButtonGroup, Heading, Text, } from '@chakra-ui/react'
import { CircleStackIcon, PercentBadgeIcon, } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'

export default function MainContent() {
  return (
    <Box as="main">
      <Heading fontSize="4xl">Use your NFTs to get a loan</Heading>

      <Box fontSize="xl" my={10}>
        <Text>It's like a pawn shop, but for NFTs and it's peer-to-peer.</Text>
        <Text>Just pick NFTs you want to use as collateral and apply for a loan. </Text>
      </Box>

      <ButtonGroup gap={2} mt={5} flexWrap="wrap">
        <Link href="/borrow">
          <Button colorScheme="gray" fontWeight="normal" rounded="full" size="lg" gap={2}>
            <CircleStackIcon className="size-6" />
            <Text>Borrow</Text>
          </Button>
        </Link>

        <Link href="/lend">
          <Button colorScheme="gray" fontWeight="normal" rounded="full" size="lg" gap={2} variant="outline">
            <PercentBadgeIcon className="size-6" />
            <Text>Lend</Text>
          </Button>
        </Link>
      </ButtonGroup>
    </Box>
  )
}
