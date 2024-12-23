'use client'

import UnknowNftList from '@/components/nfts/UnknowNftList'
import useAccountNFTs from '@/hooks/useAccountNFTs'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import issueLoan from '@/manifests/issueLoan'
import repayLoan from '@/manifests/repayLoan'
import type { BorrowerNFT } from '@/types'
import { Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
  nft: BorrowerNFT
  isMyNft?: boolean
}

export default function BorrowerNFTItem({ nft, isMyNft = false }: Props) {
  const { account } = useRadix()
  const { sendTransaction, isPending } = useSendTransaction()
  const { id, data } = nft
  const { accountNfts } = useAccountNFTs(data.component)

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
            <b>{data.apr * 100}%</b> APR
          </Text>
          <Text>
            <b>{data.duration} days</b> term
          </Text>
          {data.maturity_date && (
            <Text>
              <b>{data.maturity_date.toLocaleDateString()}</b> maturity
            </Text>
          )}

          {accountNfts && accountNfts.length > 0 && (
            <Box mt={5}>
              <Heading mb={5} size="sm">
                Collateral
              </Heading>
              <UnknowNftList nfts={accountNfts} />
            </Box>
          )}
        </CardBody>
        {!isMyNft && nft.data.status === 'Requested' && (
          <CardFooter pt={0}>
            <Button onClick={onClickAccept} isLoading={isPending} loadingText="Approve in Wallet">
              Issue Loan
            </Button>
          </CardFooter>
        )}
        {isMyNft && nft.data.status === 'Issued' && (
          <CardFooter pt={0}>
            <Button onClick={onClickRepay} isLoading={isPending} loadingText="Approve in Wallet">
              Repay
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  )
}
