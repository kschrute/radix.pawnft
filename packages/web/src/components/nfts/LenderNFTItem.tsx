'use client'

import UnknowNftList from '@/components/nfts/UnknowNftList'
import useAccountNFTs from '@/hooks/useAccountNFTs'
import useGatewayRequest from '@/hooks/useGatewayRequest'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import takeCollateral from '@/manifests/takeCollateral'
import type { LenderNFT } from '@/types'
import transformStateData from '@/utils/transformStateData'
import { Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'

type Props = {
  nft: LenderNFT
}

export interface LoanRequestState {
  borrower_nft_id: string
  lender_nft_id: string
  loan_amount: number
  loan_amount_total: number
  loan_apr: number
  loan_duration: number
  loan_closed_date?: Date
  loan_maturity_date?: Date
  loan_receiver: string
  loan_registry: string
  loan_status: string
}

export default function LenderNFTItem({ nft }: Props) {
  const gatewayRequest = useGatewayRequest()
  const { account } = useRadix()
  const { sendTransaction, isPending } = useSendTransaction()
  const { id, data } = nft
  const { accountNfts } = useAccountNFTs(data.component)
  const [loanRequestState, setLoanRequestState] = useState<LoanRequestState>()
  const { loan_amount, loan_amount_total, loan_duration, loan_apr, loan_maturity_date } = loanRequestState || {}

  const canClaimCollateral = useMemo(() => {
    const now = new Date()
    return loan_maturity_date && data.status === 'Issued' && loan_maturity_date <= now
  }, [data.status, loan_maturity_date])

  console.log('loan_maturity_date', loan_maturity_date)

  useEffect(() => {
    ;(async () => {
      const state = await gatewayRequest('/state/entity/details', {
        opt_ins: {
          ancestor_identities: false,
          component_royalty_vault_balance: false,
          package_royalty_vault_balance: false,
          non_fungible_include_nfids: false,
          explicit_metadata: [],
        },
        addresses: [data.component],
        aggregation_level: 'Vault',
      })

      const res = transformStateData<LoanRequestState>(state.items[0].details.state.fields)

      setLoanRequestState(res)
    })()
  }, [data.component, gatewayRequest])

  const onClickTakeCollateral = async () => {
    if (!account) return

    const manifest = takeCollateral(account.address, nft)
    await sendTransaction(manifest)
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
        <CardBody>
          {/*<Text>{data.component}</Text>*/}

          <Text>
            <b>{loan_amount} $XRD</b> amount
          </Text>
          {loan_amount_total && (
            <Text>
              <b>{Math.floor(loan_amount_total)} $XRD</b> with interest{' '}
            </Text>
          )}
          {loan_apr && (
            <Text>
              <b>{loan_apr * 100}%</b> APR
            </Text>
          )}
          <Text>
            <b>{loan_duration} days</b> term
          </Text>
          {loan_maturity_date && (
            <Text>
              <b>{loan_maturity_date.toLocaleDateString()}</b> maturity
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
        {canClaimCollateral && (
          <CardFooter pt={0}>
            <Button onClick={onClickTakeCollateral} isLoading={isPending} loadingText="Approve in Wallet">
              Take Collateral
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  )
}
