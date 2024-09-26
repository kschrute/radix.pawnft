'use client'

import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import issueLoan from '@/manifests/issueLoan'
import type { BorrowerNFT } from '@/types'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
  nft: BorrowerNFT
  isMyNft?: boolean
}

export default function BorrowerNFTItem({ nft, isMyNft = false }: Props) {
  const { account } = useRadix()
  const { sendTransaction } = useSendTransaction()

  const { id, data } = nft

  // console.log('data', data)

  const onClickAccept = async () => {
    if (!account) return

    const manifest = issueLoan(account.address, data.component, data.amount)
    await sendTransaction(manifest)
  }

  const onClickPayBack = async () => {
    if (!account) return

    const manifest = issueLoan(account.address, data.component, data.amount)
    await sendTransaction(manifest)
  }

  return (
    <>
      <Card bg="blackAlpha.400">
        <CardHeader>
          <Heading size="md">
            {data.amount} $XRD/{data.duration} days &nbsp;
            <Badge>{data.status}</Badge>
          </Heading>
        </CardHeader>
        <CardBody>
          <Text>{id}</Text>
          <Text>Amount {data.amount} $XRD</Text>
          <Text>Total return {Math.floor(data.total_amount)} $XRD</Text>
          <Text>Duration {data.duration} days</Text>
          <Text>APR {data.apr}%</Text>
          {data.maturity_date && <Text>Matures {data.maturity_date.toDateString()}</Text>}
        </CardBody>
        {!isMyNft && nft.data.status === 'Requested' && (
          <CardFooter>
            <Button onClick={onClickAccept}>Issue Loan</Button>
          </CardFooter>
        )}
        {isMyNft && nft.data.status === 'Issued' && (
          <CardFooter>
            <Button onClick={onClickPayBack}>Pay off</Button>
          </CardFooter>
        )}
      </Card>
      {/*
      <Box>
        <Debug data={nft} />
      </Box>
*/}
    </>
  )
}
