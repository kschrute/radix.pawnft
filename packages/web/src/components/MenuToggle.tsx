'use client'

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Box, type BoxProps, IconButton } from '@chakra-ui/react'
import React from 'react'

type Props = {
  toggle: () => void
  isOpen: boolean
} & BoxProps

export default function MenuToggle({ toggle, isOpen, ...rest }: Props) {
  return (
    <Box {...rest}>
      <IconButton
        display={{ base: 'block', md: 'none' }}
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        aria-label="Toggle Menu"
        variant="ghost"
        onClick={toggle}
      />
    </Box>
  )
}
