import React from 'react'
import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import useUserNFTs from '@/hooks/useUserNFTs'
import { Debug } from '@/components/Debug'

export default function Borrow() {
  const { nftIds, nfts } = useUserNFTs()

  const onClickBorrow = async () => {

  }

  return (
    <Box>
      <p>Borrow</p>

      <ButtonGroup>
        <Button onClick={onClickBorrow}>
          Borrow
        </Button>
      </ButtonGroup>

      <Debug data={{
        nftIds,
        nfts
      }} />
    </Box>
  )
}
