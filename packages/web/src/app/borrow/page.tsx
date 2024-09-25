'use client'

import { Box, Heading } from '@chakra-ui/react'
import Borrow from '@/components/Borrow'

export default function Page() {
  return (
    <Box>
      <Heading mb={10}>Borrow</Heading>
      <Borrow />
      {/*<Radix />*/}
    </Box>
  )
}
