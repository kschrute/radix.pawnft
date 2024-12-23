'use client'

import AppAlert from '@/components/AppAlert'
import UnknowNftItem from '@/components/nfts/UnknowNftItem'
import { useShowErrorMessage } from '@/hooks'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import useUserNFTs from '@/hooks/useUserNFTs'
import instantiateLoanRequest from '@/manifests/instantiateLoanRequest'
import type { UnknownNFT } from '@/types'
import { addDays, formatNumber } from '@/utils'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import type React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'

export default function Borrow() {
  const { account } = useRadix()
  const [hasApplied, setHasApplied] = useState(false)
  const [selectedNft, setSelectedNft] = useState<UnknownNFT>()
  const [amount, setAmount] = useState('100')
  const [duration, setDuration] = useState('30')
  const [apr, setApr] = useState('100')
  const { sendTransaction, isPending } = useSendTransaction()
  const { userNfts } = useUserNFTs()
  const showErrorMessage = useShowErrorMessage()

  // loan_amount * loan_apr * loan_duration / 365
  const repaymentAmount = Number(amount) + (((Number(amount) * Number(apr)) / 100) * Number(duration)) / 365
  const maturityDate = useMemo(() => addDays(Number(duration)), [duration])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)

  const handleAprChange = (e: React.ChangeEvent<HTMLInputElement>) => setApr(e.target.value)

  const onSelectNft = async (nft: UnknownNFT) => {
    setSelectedNft(nft)
  }

  const onClickBorrow = async () => {
    if (!account) return
    if (!selectedNft || !amount || !apr || !duration) {
      showErrorMessage(
        'Some fields are missinØg',
        'Please fill out all form fields and select an NFT you want to use as collateral',
      )
      return
    }

    const manifest = instantiateLoanRequest(
      account.address,
      selectedNft.resource,
      selectedNft.id,
      Number(amount),
      Number(apr) / 100,
      Number(duration),
    )

    await sendTransaction(manifest)

    setHasApplied(true)
  }

  return (
    <Box>
      <Heading size="lg">Apply for a loan</Heading>

      {hasApplied && (
        <>
          <AppAlert
            status="success"
            title="You have sucessfully aplied for a loan"
            description="Go to My Loans page to keep track of your loans"
          />

          <Link href="/my">
            <Button>My Loans</Button>
          </Link>
        </>
      )}

      {!hasApplied && (
        <>
          <FormControl my={5}>
            <FormLabel>Amount, XRD</FormLabel>
            <Input type="text" value={amount} onChange={handleAmountChange} />
            <FormHelperText>
              We recommend asking for 80% of your NFTs value or less to increase your chances of getting a loan
            </FormHelperText>
          </FormControl>

          <FormControl my={5}>
            <FormLabel>Duration, Days</FormLabel>
            <Input type="text" value={duration} onChange={handleDurationChange} />
            <FormHelperText>Shorter loan term may increase your chances of getting a loan</FormHelperText>
          </FormControl>

          <FormControl my={5}>
            <FormLabel>Interest Rate, %/Year</FormLabel>
            <Input type="text" value={apr} onChange={handleAprChange} />
            <FormHelperText>Higher interest rate increases your chances of getting a loan</FormHelperText>
          </FormControl>

          <Box my={5}>
            <FormLabel>Total Repayment</FormLabel>
            <Text>
              {formatNumber(repaymentAmount)} XRD by {maturityDate.toLocaleDateString()}
            </Text>
          </Box>

          <FormLabel>Select an NFT you want to use as collateral</FormLabel>

          {!userNfts && <Skeleton h={10} my={5} />}

          <SimpleGrid columns={[1, 2, 3]} spacing={5} my={5}>
            {userNfts?.map((nft) => (
              <UnknowNftItem
                key={`${nft.resource}:${nft.id}`}
                nft={nft}
                isActive={nft.resource === selectedNft?.resource && nft.id === selectedNft?.id}
                onClickSelect={onSelectNft}
              />
            ))}
          </SimpleGrid>

          <ButtonGroup my={5}>
            <Button colorScheme="purple" onClick={onClickBorrow} isLoading={isPending} loadingText="Approve in Wallet">
              Request Loan
            </Button>
          </ButtonGroup>
        </>
      )}
    </Box>
  )
}
