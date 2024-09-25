import { Flex } from '@chakra-ui/react'
import React, { type ReactNode } from 'react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Props = {
  children?: ReactNode
}

export default function LayoutUI({ children }: Props) {
  return (
    <Flex flexDirection="column" minH="100vh">
      <Header />
      <Flex flex={1} flexDirection="column" alignItems="center" p={5}>
        {children}
      </Flex>
      <Footer />
    </Flex>
  )
}
