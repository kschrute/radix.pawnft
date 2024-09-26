'use client'

/*
// @ts-nocheck
'use client'

import { useState } from 'react'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import { instantiate } from '@/manifests/instantiate'
import { radixDappToolkit, useRadix } from '@/providers/radix'
import { Debug } from '@/components/Debug'
import { Box, Button, ButtonGroup } from '@chakra-ui/react'

const packageAddress = process.env.NEXT_PUBLIC_PACKAGE_ADDRESS as string
const component = process.env.NEXT_PUBLIC_LOAN_REGISTRY_COMPONENT_ADDRESS as string
const resourceAddress = process.env.NEXT_PUBLIC_NFT_RESOURCE_ADDRESS as string

// console.log('packageAddress', packageAddress)
// console.log('component', component)

export default function Radix() {
  const [debug, setDebug] = useState({})
  const { api, account, xrdAddress } = useRadix()
  const { sendTransaction } = useSendTransaction()

  const onClickInstantiate = async () => {
    console.log('packageAddress', packageAddress)
    console.log('account?.address', account?.address)
    const manifest = instantiate(packageAddress, '0.33', account?.address)

    await sendTransaction(manifest)
  }

  // const onClickClaimNFTs = async () => {
  //   const manifest = free_nfts(account?.address, xrdAddress, component)
  //
  //   await sendTransaction(manifest)
  // }
  //
  // const onClickClaimTokens = async () => {
  //   const manifest = free_token(component, account?.address)
  //
  //   await sendTransaction(manifest)
  // }

  const onClickDev = async () => {
    console.log('dev')
    // console.log("account?.address", account?.address);

    const walletData = await radixDappToolkit.walletApi.getWalletData()
    console.log('walletData', walletData)

    const allNonFungibleIds = await api.state.getAllNonFungibleIds(resourceAddress)
    console.log('allNonFungibleIds', allNonFungibleIds)

    const entityMetadata = await api.state.getEntityMetadata(resourceAddress)
    console.log('entityMetadata', entityMetadata)

    const entityDetails = await api.state.getEntityDetailsVaultAggregated(account?.address)
    console.log('entityDetails', entityDetails)

    const entityDetails2 = await api.state.getEntityDetailsVaultAggregated(component)
    console.log('entityDetails2', entityDetails2)

    setDebug({
      allNonFungibleIds,
      entityMetadata,
      // entityDetails,
      walletData,
    })
  }

  return (
    <Box>
      {/!*<div className="my-5">*!/}
        {/!* @ts-ignore *!/}
        {/!*<radix-connect-button />*!/}
      {/!*</div>*!/}

      <p>👽 ...Welcome to the future... 👽</p>
      <ButtonGroup gap={2}>
        <Button type="button" onClick={onClickDev}>
          Dev
        </Button>
        <Button type="button" onClick={onClickInstantiate}>
          Instantiate
        </Button>
        {/!*<button type="button" onClick={onClickClaimTokens}>*!/}
        {/!*  Claim tokens*!/}
        {/!*</button>*!/}
        {/!*<button type="button" onClick={onClickClaimNFTs}>*!/}
        {/!*  Claim NFTs*!/}
        {/!*</button>*!/}
      </ButtonGroup>
      <Debug data={debug} />
    </Box>
  )
}
*/
