'use client'

import { Debug } from '@/components/Debug'
import config from '@/config'
import { useRadix } from '@/hooks/useRadix'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import useUserNFTs from '@/hooks/useUserNFTs'
import bootstrap from '@/manifests/bootstrap'
import instantiateLoanRequest from '@/manifests/instantiateLoanRequest'
import { Box, Button, ButtonGroup, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import React, { useState } from 'react'

export default function Borrow() {
  const { api, account } = useRadix()
  const [nftResourceId, setNftResourceId] = useState(
    'resource_tdx_2_1ntnamngqfllfy7uz67vnkuvkg8kg42y4mzkpl3xr57f344mf4tf3kt',
  )
  const [nftId, setNftId] = useState('{c6fc44a1fe07525f-a065657555113865-f34f3ddac94147e0-fb9d517f72619cb8}')
  const { sendTransaction } = useSendTransaction()
  const { nftIds, nfts } = useUserNFTs()

  const handleResourceIdChange = (e) => setNftResourceId(e.target.value)

  const handleNftIdChange = (e) => setNftId(e.target.value)

  const onClickBorrow = async () => {
    if (!(nftResourceId && nftId && account)) return

    console.log('config', config)

    const manifest = instantiateLoanRequest(account.address, nftResourceId, nftId)

    console.log('manifest', manifest)

    await sendTransaction(manifest)
  }

  return (
    <Box>
      {/*<p>Borrow</p>*/}

      <FormControl>
        <FormLabel>NFT resource address</FormLabel>
        <Input type="text" value={nftResourceId} onChange={handleResourceIdChange} />
        {/*<FormHelperText>We'll never share your email.</FormHelperText>*/}
      </FormControl>

      <FormControl>
        <FormLabel>NFT ID</FormLabel>
        <Input type="text" value={nftId} onChange={handleNftIdChange} />
        {/*<FormHelperText>We'll never share your email.</FormHelperText>*/}
      </FormControl>

      <ButtonGroup my={5}>
        <Button onClick={onClickBorrow}>Borrow</Button>
      </ButtonGroup>

      <Debug
        data={{
          nftIds,
          nfts,
        }}
      />
    </Box>
  )
}
