'use client'

import Lend from '@/components/Lend'
import LoanStats from '@/components/LoanStats'
// import useLoans from '@/hooks/useLoans'
import { Box, Heading } from '@chakra-ui/react'

export default function Page() {
  // const { loans, isLoading } = useLoans()

  return (
    <Box>
      <Heading mb={10}>Lend</Heading>
      <LoanStats />
      <Lend />
      {/*<Debug*/}
      {/*  data={{*/}
      {/*    loans,*/}
      {/*    isLoading,*/}
      {/*  }}*/}
      {/*/>*/}
    </Box>
  )
}
