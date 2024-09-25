'use client'

import { Box, Center } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

export default function Footer() {
  // const filter = useColorModeValue('invert()', 'none')

  return (
    <Box as="footer" alignItems="center" py={{ base: 0, sm: 10 }}>
      {/*<Center sx={{ filter }}>*/}
      <Center>
        <Image src="/images/runs_on_radix.png" width={180} height={30} alt="RunsOnRadix" />
      </Center>
    </Box>
  )
}
