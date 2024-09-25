'use client'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box, type BoxProps, IconButton, useColorMode } from '@chakra-ui/react'
import React from 'react'

export default function DarkModeSwitch(props: BoxProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Box {...props}>
      <IconButton
        icon={isDark ? <SunIcon /> : <MoonIcon />}
        aria-label="Toggle Theme"
        variant="ghost"
        onClick={toggleColorMode}
      />
    </Box>
  )
}
