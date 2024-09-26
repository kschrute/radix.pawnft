import { Debug } from '@/components/Debug'
import useLoanRegistryState from '@/hooks/useLoanRegistryState'
import { Box, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import React from 'react'

export default function LoanStats() {
  const data = useLoanRegistryState()
  const { loans_issued_count, loans_requested_count, loans_repaid_count } = data
  return (
    <Box my={10}>
      <StatGroup>
        <Stat>
          <StatLabel>Loans Requested</StatLabel>
          <StatNumber>{loans_requested_count}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Loans Issued</StatLabel>
          <StatNumber>{loans_issued_count}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Loans Repaid</StatLabel>
          <StatNumber>{loans_repaid_count}</StatNumber>
        </Stat>
      </StatGroup>
      {/*<Debug data={data} />*/}
    </Box>
  )
}
