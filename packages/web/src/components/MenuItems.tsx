'use client'

import { Box, Stack } from '@chakra-ui/react'
import React, { type ReactNode } from 'react'

type Props = {
  isOpen: boolean
  children: ReactNode[]
}

export default function MenuItems({ children, isOpen }: Props) {
  return (
    <Box
      alignSelf="center"
      fontSize="sm"
      fontWeight="bold"
      textTransform="uppercase"
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}
      order={{ base: 99, sm: 99, md: 0 }}
      mb={1}
    >
      <Stack alignItems="flex-start" spacing={5} direction={['column', 'column', 'row', 'row']} pt={[5, 5, 0, 0]}>
        {children}
      </Stack>
    </Box>
  )
}
