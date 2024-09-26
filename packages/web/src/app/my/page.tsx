'use client'

import LoanStats from '@/components/LoanStats'
import MyLoans from '@/components/MyLoans'
import { Box, Heading } from '@chakra-ui/react'

export default function Page() {
  return (
    <Box>
      <Heading mb={10}>My Loans</Heading>
      <LoanStats />
      <MyLoans />
    </Box>
  )
}
