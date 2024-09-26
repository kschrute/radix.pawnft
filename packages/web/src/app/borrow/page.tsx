'use client'

import Borrow from '@/components/Borrow'
import LoanStats from '@/components/LoanStats'
import { Box, Heading } from '@chakra-ui/react'

export default function Page() {
  return (
    <Box>
      <Heading mb={10}>Borrow</Heading>
      <LoanStats />
      <Borrow />
      {/*<Radix />*/}
    </Box>
  )
}
