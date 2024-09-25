'use client'

import { Box, Flex, type FlexProps, Heading, Image, Text, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'

import DarkModeSwitch from '@/components/DarkModeSwitch'
import MenuItems from '@/components/MenuItems'
import MenuToggle from '@/components/MenuToggle'

export default function Header(props: FlexProps) {
  const [isOpen, setIsOpen] = useState(false)
  const filter = useColorModeValue('none', 'invert()')
  const toggle = () => setIsOpen(!isOpen)

  return (
    <Box as="header" className="header" {...props}>
      <Flex as="nav" alignItems="center" wrap="wrap" w="100%" p={5}>
        <Flex flex={1}>
          <Link href="/">
            <Heading fontSize="4xl">PAWNFT</Heading>
            <Text fontSize="sm" mt={-2}>
              Borrow against your NFTs
            </Text>
          </Link>
        </Flex>

        <MenuItems isOpen={isOpen}>
          <Link href="/borrow">Borrow</Link>
          <Link href="/lend">Lend</Link>
          <Link href="/dev">Dev</Link>
        </MenuItems>

        <Flex flex={1} justifyContent="flex-end">
          <DarkModeSwitch mr={5} />
          {/* @ts-ignore */}
          <radix-connect-button />
          <MenuToggle toggle={toggle} isOpen={isOpen} />
        </Flex>
      </Flex>
    </Box>
  )
}
