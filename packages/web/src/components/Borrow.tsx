'use client'

import UnknowNftItem from '@/components/nfts/UnknowNftItem'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import useUserNFTs from '@/hooks/useUserNFTs'
import instantiateLoanRequest from '@/manifests/instantiateLoanRequest'
import type { UnknownNFT } from '@/types'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react'
import type React from 'react'
import { useState } from 'react'

export default function Borrow() {
  const { account } = useRadix()
  const [selectedNft, setSelectedNft] = useState<UnknownNFT>()
  const [amount, setAmount] = useState('100')
  const [duration, setDuration] = useState('30')
  const [apr, setApr] = useState('1.5')
  const { sendTransaction } = useSendTransaction()
  const { userNfts } = useUserNFTs()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)

  const handleAprChange = (e: React.ChangeEvent<HTMLInputElement>) => setApr(e.target.value)

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
      Number(amount),
      Number(apr),
      Number(duration),
    )

    await sendTransaction(manifest)
  }

  return (
    <Box>
      <Heading size="lg">Apply for a loan</Heading>

      <SimpleGrid columns={3} spacing={5}>
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
      </SimpleGrid>

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
        <Button colorScheme="purple" onClick={onClickBorrow}>Borrow</Button>
      </ButtonGroup>
    </Box>
  )
}
