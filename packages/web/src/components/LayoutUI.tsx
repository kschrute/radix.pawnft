'use client'

import { Container, Flex } from '@chakra-ui/react'
import React, { type ReactNode } from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/Header'

type Props = {
  children?: ReactNode
}

export default function LayoutUI({ children }: Props) {
  return (
    <Flex flexDirection="column" minH="100vh">
      <Header />
      <Flex flex={1} flexDirection="column" alignItems="center" p={5}>
        <Container maxW="4xl">{children}</Container>
      </Flex>
      <Footer />
    </Flex>
  )
}
