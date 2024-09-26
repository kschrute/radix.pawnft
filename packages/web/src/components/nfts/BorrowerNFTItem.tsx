'use client'

import { Debug } from '@/components/Debug'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import issueLoan from '@/manifests/issueLoan'
import type { BorrowerNFT } from '@/types'
import { Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
  nft: BorrowerNFT
}

export default function BorrowerNFTItem({ nft }: Props) {
  const { account } = useRadix()
  const { sendTransaction } = useSendTransaction()

  const { id, data } = nft

  const onClickAccept = async () => {
    if (!account) return

    const manifest = issueLoan(account.address, data.component, data.amount)
    await sendTransaction(manifest)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">
            {data.amount} $XRD for {data.duration} days
            &nbsp;
            <Badge>{data.status}</Badge>
          </Heading>
        </CardHeader>
        <CardBody>
          <Text>{id}</Text>
          <Text>Amount {data.amount} $XRD</Text>
          <Text>Total return {Math.floor(data.total_amount)} $XRD</Text>
          <Text>Duration {data.duration} days</Text>
          <Text>APR {data.apr}%</Text>
        </CardBody>
        {nft.data.status === 'Requested' && <CardFooter>
          <Button onClick={onClickAccept}>Issue Loan</Button>}
        </CardFooter>}
      </Card>
{/*
      <Box>
        <Debug data={nft} />
      </Box>
*/}
    </>
  )
}
