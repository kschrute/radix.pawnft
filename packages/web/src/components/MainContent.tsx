'use client'

import { TriangleUpIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { EllipsisHorizontalCircleIcon, CircleStackIcon, CurrencyEuroIcon, PercentBadgeIcon } from '@heroicons/react/24/solid'
// import { PercentBadgeIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MainContent() {
  const filter = useColorModeValue('none', 'invert()')

  return (
    <Flex as="main" flex={1} flexDir="column" justifyContent="center">
      <Heading fontSize="4xl">
        Use your NFTs to get a loan
      </Heading>

      <Text fontSize="large" my={5}>
        Just pick which NFTs you want to use as collateral and apply for a loan.
      </Text>

{/*
      <OrderedList my={5} pl={1}>
        <ListItem fontSize="large">
          Just pick which NFTs you want to use as collateral and apply for a loan.
        </ListItem>
        <ListItem fontSize="large">
          Apply for a loan.
        </ListItem>
      </OrderedList>
*/}

      <ButtonGroup gap={2} flexWrap="wrap">
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
    </Flex>
  )
}
