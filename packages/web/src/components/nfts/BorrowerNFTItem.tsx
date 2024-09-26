'use client'

import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import issueLoan from '@/manifests/issueLoan'
import repayLoan from '@/manifests/repayLoan'
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

  const onClickAccept = async () => {
    if (!account) return

    const manifest = issueLoan(account.address, data.component, data.amount)
    await sendTransaction(manifest)
  }

  const onClickRepay = async () => {
    if (!account) return

    const manifest = repayLoan(account.address, nft)
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
          <Text>
            <b>{data.amount} $XRD</b> amount
          </Text>
          <Text>
            <b>{Math.floor(data.total_amount)} $XRD</b> with interest{' '}
          </Text>
          <Text>
            <b>{data.duration} days</b> term
          </Text>
          <Text>
            <b>{data.apr}%</b> APR
          </Text>
          {data.maturity_date && <Text mt={5}>Matures {data.maturity_date.toDateString()}</Text>}
        </CardBody>
        {!isMyNft && nft.data.status === 'Requested' && (
          <CardFooter pt={0}>
            <Button onClick={onClickAccept}>Issue Loan</Button>
          </CardFooter>
        )}
        {isMyNft && nft.data.status === 'Issued' && (
          <CardFooter pt={0}>
            <Button onClick={onClickRepay}>Repay</Button>
          </CardFooter>
        )}
      </Card>
    </>
  )
}
