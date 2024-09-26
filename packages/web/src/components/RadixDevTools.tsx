'use client'

import { Debug } from '@/components/Debug'
import config from '@/config'
import useGatewayRequest from '@/hooks/useGatewayRequest'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import bootstrap from '@/manifests/bootstrap'
import debug from '@/manifests/debug'
import instantiateLoanRegistry from '@/manifests/instantiateLoanRegistry'
import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import React from 'react'

export default function RadixDevTools() {
  const gatewayRequest = useGatewayRequest()
  const { api, rdt, account } = useRadix()
  const { sendTransaction } = useSendTransaction()

  const onClickDev = async () => {
    if (!account || !api || !rdt) {
      console.error('Connect your account first')
      return
    }

    console.log('!!!')

    const state = await gatewayRequest('/state/entity/details', {
      opt_ins: {
        ancestor_identities: false,
        component_royalty_vault_balance: false,
        package_royalty_vault_balance: false,
        non_fungible_include_nfids: true,
        explicit_metadata: [],
      },
      addresses: ['component_tdx_2_1crpxrvx3k87qa7yl4fehvzxyfqgyu77vrjez2dkl45sv4whql50wt4'],
      aggregation_level: 'Vault',
    })

    console.log('state', state)

    // const state = await api.state.innerClient.stateEntityDetails({
    //   stateEntityDetailsRequest: {
    //     opt_ins: {
    //       native_resource_details: true,
    //     },
    //     addresses: ['component_tdx_2_1crpxrvx3k87qa7yl4fehvzxyfqgyu77vrjez2dkl45sv4whql50wt4'],
    //   }
    // })
    // console.log('state', state)

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
        <Button onClick={onClickDev}>Dev</Button>
        <Button onClick={onClickDebug}>Debug</Button>
        <Button onClick={onClickBootstrap}>Bootstrap</Button>
        <Button onClick={onClickInstantiateLoanRegistry}>Instantiate Loan Registry</Button>
      </ButtonGroup>
      <Debug data={{}} />
    </Box>
  )
}
