'use client'

import MainContent from '@/components/MainContent'
import { Flex } from '@chakra-ui/react'

export default function Home() {
  return (
    <Flex flex={1} flexDir="column" maxW="xl">
      <MainContent />
    </Flex>
  )
}
