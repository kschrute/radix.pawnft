import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import React from 'react'

type Props = {
  toggle: () => void
  isOpen: boolean
}

export default function MenuToggle({ toggle, isOpen }: Props) {
  return (
    <IconButton
      display={{ base: 'block', md: 'none' }}
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
      aria-label="Toggle Menu"
      variant="ghost"
      onClick={toggle}
    />
  )
}
