'use client'

import React from 'react'
import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import bootstrap from '@/manifests/bootstrap'
import instantiateLoanRegistry from '@/manifests/instantiateLoanRegistry'
import config from '@/config'
import { Debug } from '@/components/Debug'
import useUserNFTs from '@/hooks/useUserNFTs'
import debug from '@/manifests/debug'
import { useRadix } from '@/hooks/useRadix'

export default function RadixDevTools() {
  const { api, rdt, account } = useRadix()
  const { sendTransaction } = useSendTransaction()
  const { nftIds } = useUserNFTs()

  const onClickDev = async () => {
    if (!account || !api) {
      console.error('Connect your account first')
      return
    }

    const walletData = rdt?.walletApi.getWalletData()
    console.log('walletData', walletData)

    if (account) {
      console.log(await api.state.getEntityDetailsVaultAggregated(account.address))
    }

    const allNonFungibleIds = await api.state.getEntityDetailsVaultAggregated(config.nftResourceAddress)
    console.log('allNonFungibleIds', allNonFungibleIds)
  }

  const onClickDebug = async () => {
    if (!account || !api) {
      console.error('Connect your account first')
      return
    }

    // await core.transaction.innerClient.transactionCallPreviewPost()

    const manifest = debug(account.address)

    await sendTransaction(manifest)
  }

  const onClickBootstrap = async () => {
    if (!account || !api) {
      console.error('Connect your account first')
      return
    }

    const manifest = bootstrap(account.address)

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
        <Button onClick={onClickDebug}>
          Debug
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
