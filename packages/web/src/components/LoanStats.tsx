import useLoanRegistryState from '@/hooks/useLoanRegistryState'
import { Box, Skeleton, Stat, StatGroup, StatLabel, StatNumber } from '@chakra-ui/react'
import React from 'react'

export default function LoanStats() {
  const data = useLoanRegistryState()
  const { loans_issued_count, loans_requested_count, loans_repaid_count, loans_defaulted_count } = data
  return (
    <Box my={10}>
      <StatGroup>
        <Stat>
          <StatLabel>Loans Requested</StatLabel>
          {loans_requested_count === undefined && <Skeleton h={10} />}
          <StatNumber>{loans_requested_count}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Loans Issued</StatLabel>
          {loans_issued_count === undefined && <Skeleton h={10} />}
          <StatNumber>{loans_issued_count}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Loans Repaid</StatLabel>
          {loans_repaid_count === undefined && <Skeleton h={10} />}
          <StatNumber>{loans_repaid_count}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Loans Defaulted</StatLabel>
          {loans_defaulted_count === undefined && <Skeleton h={10} />}
          <StatNumber>{loans_defaulted_count}</StatNumber>
        </Stat>
      </StatGroup>
    </Box>
  )
}
