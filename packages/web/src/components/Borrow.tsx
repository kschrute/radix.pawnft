'use client'

import { Debug } from '@/components/Debug'
import UnknowNftItem from '@/components/nfts/UnknowNftItem'
import config from '@/config'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import useUserNFTs from '@/hooks/useUserNFTs'
import bootstrap from '@/manifests/bootstrap'
import instantiateLoanRequest from '@/manifests/instantiateLoanRequest'
import type { UnknownNFT } from '@/types'
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
} from '@chakra-ui/react'
import React, { useState } from 'react'

export default function Borrow() {
  const { api, account } = useRadix()
  const [selectedNft, setSelectedNft] = useState<UnknownNFT>()
  const [amount, setAmount] = useState<number>(100)
  const [duration, setDuration] = useState<number>(30)
  const [apr, setApr] = useState<number>(1.5)
  const { sendTransaction } = useSendTransaction()
  const { userNfts } = useUserNFTs()

  // console.log('userNfts', userNfts)

  const handleAmountChange = (e) => setAmount(e.target.value)
  const handleDurationChange = (e) => setDuration(e.target.value)
  const handleAprChange = (e) => setApr(e.target.value)

  const onSelectNft = async (nft: UnknownNFT) => {
    setSelectedNft(nft)
  }

  const onClickBorrow = async () => {
    if (!account) return
    if (!selectedNft || !amount || !apr || !duration) return

    const manifest = instantiateLoanRequest(
      account.address,
      selectedNft.resource,
      selectedNft.id,
      amount,
      apr,
      duration,
    )

    await sendTransaction(manifest)
  }

  return (
    <Box>
      {/*<p>Borrow</p>*/}

      <Heading size="lg">Request a loan</Heading>

      <FormControl my={5}>
        <FormLabel>Amount</FormLabel>
        <Input type="text" value={amount} onChange={handleAmountChange} />
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Duration</FormLabel>
        <Input type="text" value={duration} onChange={handleDurationChange} />
      </FormControl>

      <FormControl my={5}>
        <FormLabel>APR</FormLabel>
        <Input type="text" value={apr} onChange={handleAprChange} />
      </FormControl>

      {/*
      <FormControl my={5}>
        <FormLabel>NFT resource address</FormLabel>
        <Input type="text" value={nftResourceId} onChange={handleResourceIdChange} />
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>

      <FormControl my={5}>
        <FormLabel>NFT ID</FormLabel>
        <Input type="text" value={nftId} onChange={handleNftIdChange} />
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>
*/}

      <FormLabel>Select an NFT you want to use as collateral</FormLabel>

      {!userNfts && <Skeleton h={10} my={10} />}

      <SimpleGrid my={10} spacing={5} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
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
        <Button onClick={onClickBorrow}>Borrow</Button>
      </ButtonGroup>

      {/*
      <Debug
        data={{
          userNfts,
        }}
      />
*/}
    </Box>
  )
}
