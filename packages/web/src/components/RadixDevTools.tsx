'use client'

import React, { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import bootstrap from '@/manifests/bootstrap'
import { radixDappToolkit, useRadix } from '@/providers/radix'
import instantiateLoanRegistry from '@/manifests/instantiateLoanRegistry'
import config from '@/config'
import { Debug } from '@/components/Debug'
import useUserNFTs from '@/hooks/useUserNFTs'

export default function RadixDevTools() {
  const { api, account } = useRadix()
  const { sendTransaction } = useSendTransaction()
  const { nftIds } = useUserNFTs()

  const onClickDev = async () => {
    const walletData = radixDappToolkit.walletApi.getWalletData()
    console.log('walletData', walletData)

    if (account) {
      console.log(await api.state.getEntityDetailsVaultAggregated(account.address))
    }

    const allNonFungibleIds = await api.state.getEntityDetailsVaultAggregated(config.nftResourceAddress)
    console.log('allNonFungibleIds', allNonFungibleIds)
  }

  const onClickBootstrap = async () => {
    if (!account) {
      console.error('Connect your account first')
      return
    }

    const manifest = account && bootstrap(account.address)

    await sendTransaction(manifest)
  }

  const onClickInstantiateLoanRegistry = async () => {
    if (!account) {
      console.error('Connect your account first')
      return
    }

    const manifest = account && instantiateLoanRegistry(account.address)

    const res = await sendTransaction(manifest)

    console.log('res', res)
  }

  return (
    <Box>
      <ButtonGroup>
        <Button onClick={onClickDev}>
          Dev
        </Button>
        <Button onClick={onClickBootstrap}>
          Bootstrap
        </Button>
        <Button onClick={onClickInstantiateLoanRegistry}>
          Instantiate Loan Registry
        </Button>
      </ButtonGroup>
      <Debug data={{
        nftIds
      }} />
    </Box>
  )
}
