'use client'

import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import issueLoan from '@/manifests/issueLoan'
import type { BorrowerNFT, LenderNFT } from '@/types'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
  nft: LenderNFT
}

export default function LenderNFTItem({ nft }: Props) {
  const { account } = useRadix()
  const { sendTransaction } = useSendTransaction()

  const { id, data } = nft

  // console.log('data', data)

  const onClickTakeCollateral = async () => {
    if (!account) return

    // const manifest = issueLoan(account.address, data.component, data.amount)
    // await sendTransaction(manifest)
  }

  return (
    <>
      <Card bg="blackAlpha.400">
        <CardHeader>
          <Heading size="md">
            {/*{data.amount} $XRD/{data.duration} days*/}
            {id}
            &nbsp;
            <Badge>{data.status}</Badge>
          </Heading>
        </CardHeader>
        {/*<CardBody>*/}
        {/*<Text>{id}</Text>*/}
        {/*
          <Text>Amount {data.amount} $XRD</Text>
          <Text>Total return {Math.floor(data.total_amount)} $XRD</Text>
          <Text>Duration {data.duration} days</Text>
          <Text>APR {data.apr}%</Text>
          {data.maturity_date && <Text>Matures {data.maturity_date.toDateString()}</Text>}
*/}
        {/*</CardBody>*/}
        {nft.data.status === 'Issued' && (
          <CardFooter>
            <Button onClick={onClickTakeCollateral}>Take Collateral</Button>
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
