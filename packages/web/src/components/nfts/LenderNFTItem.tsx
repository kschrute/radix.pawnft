'use client'

import useGatewayRequest from '@/hooks/useGatewayRequest'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import takeCollateral from '@/manifests/takeCollateral'
import type { LenderNFT } from '@/types'
import transformStateData from '@/utils/transformStateData'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

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
  const { sendTransaction } = useSendTransaction()
  const { id, data } = nft
  const [loanRequestState, setLoanRequestState] = useState<LoanRequestState>()
  const { loan_amount, loan_amount_total, loan_duration, loan_apr, loan_maturity_date } = loanRequestState || {}

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
          <Text>
            <b>{loan_duration} days</b> term
          </Text>
          <Text>
            <b>{loan_apr}%</b> APR
          </Text>
          {loan_maturity_date && <Text mt={5}>Matures {loan_maturity_date.toISOString()}</Text>}
        </CardBody>
        {nft.data.status === 'Issued' && (
          <CardFooter pt={0}>
            <Button onClick={onClickTakeCollateral}>Take Collateral</Button>
          </CardFooter>
        )}
      </Card>
    </>
  )
}
