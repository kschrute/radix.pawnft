'use client'

import { Box, Heading } from '@chakra-ui/react'
import { Debug } from '@/components/Debug'
import useLoans from '@/hooks/useLoans'

export default function Page() {
  const { loans, isLoading } = useLoans()

  return (
    <Box>
      <Heading mb={10}>Lend</Heading>
      <Debug data={{
        loans,
        isLoading,
      }} />
    </Box>
  )
}
