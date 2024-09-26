'use client'

import React, { useState } from 'react'
import { Box, Button, ButtonGroup, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import useUserNFTs from '@/hooks/useUserNFTs'
import { Debug } from '@/components/Debug'
import bootstrap from '@/manifests/bootstrap'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import instantiateLoanRequest from '@/manifests/instantiateLoanRequest'
import { useRadix } from '@/hooks/useRadix'

export default function Borrow() {
  const { api, account } = useRadix()
  const [nftResourceId, setNftResourceId] = useState('resource_tdx_2_1n278g09f0keutwd7g5wffypmhjwptx6qf7t6l34tf0z7v48zd206zj')
  const [nftId, setNftId] = useState('{c6fc44a1fe07525f-a065657555113865-f34f3ddac94147e0-fb9d517f72619cb8}')
  const { sendTransaction } = useSendTransaction()
  const { nftIds, nfts } = useUserNFTs()

  const handleResourceIdChange = (e) => setNftResourceId(e.target.value)

  const handleNftIdChange = (e) => setNftId(e.target.value)

  const onClickBorrow = async () => {
    if (!(nftResourceId && nftId && account)) return

    const manifest = instantiateLoanRequest(account.address, nftResourceId, nftId)

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
